const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

const attachUser = (req, res, next) => {
  req.user = {
    role: req.headers.role,
    user_id: req.headers.user_id
  };
  next();
};
app.use(attachUser);

const checkRole = (roles) => {
  return (req, res, next) => {
    const role = req.user.role; 

    if (!role) {
      return res.status(401).json({ message: "No role provided" });
    }

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

// ================= ROLES =================
app.get("/roles", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name FROM roles");
    res.json(rows); // повертає [{id:1, name:"waiter"}, ...]
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

// ================= AUTH =================
app.post("/login", async (req, res) => {
  const { login, password, role } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE login = ? AND role = ?",
      [login, role]
    );

    if (!rows.length)
      return res.status(401).json({ message: "User not found" });

    const user = rows[0];

    if (user.password !== password)
      return res.status(401).json({ message: "Wrong password" });

    let employeeRole = null;

    if (user.role === "employee") {
      const [emp] = await db.query(
        `SELECT r.name AS role_name
         FROM employees e
         JOIN roles r ON e.role_id = r.id
         WHERE e.user_id = ?`,
        [user.id]
      );

      employeeRole = emp.length ? emp[0].role_name : null;
    }

    res.json({
      id: user.id,
      login: user.login,
      role: user.role, 
      employeeRole                  
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { login, password, role, name, employeeRole } = req.body;
  try {
    const [existing] = await db.query("SELECT * FROM users WHERE login=?", [login]);
    if (existing.length) return res.status(400).json({ message: "User already exists" });

    const [userResult] = await db.query(
      "INSERT INTO users (login, password, role) VALUES (?, ?, ?)",
      [login, password, role]
    );
    const userId = userResult.insertId;

    if (role === "client") {
      await db.query("INSERT INTO customers (name, user_id) VALUES (?, ?)", [name, userId]);
    }

    if (role === "employee") {
      let roleId;
      const [roleRows] = await db.query("SELECT id FROM roles WHERE name=?", [employeeRole]);

      if (roleRows.length > 0) {
        roleId = roleRows[0].id;
      } else {
        const [newRole] = await db.query("INSERT INTO roles (name) VALUES (?)", [employeeRole]);
        roleId = newRole.insertId;
      }

      await db.query(
        "INSERT INTO employees (name, role_id, user_id) VALUES (?, ?, ?)",
        [name, roleId, userId]
      );
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register error" });
  }
});

// ================= CREATE ORDER ================= //
app.post("/orders", checkRole(["employee"]), async (req, res) => {
  try {
    const { table_id, customer_id, items } = req.body;

    if (!table_id || !customer_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing data" });
    }

    const [emp] = await db.query(
      "SELECT id FROM employees WHERE user_id = ?",
      [req.user.user_id]
    );

    const employee_id = emp?.[0]?.id;

    const [result] = await db.query(
      "CALL CreateOrder(?, ?, ?)",
      [table_id, customer_id, employee_id]
    );

    const orderId = result[0][0].orderId;

    for (const item of items) {
      await db.query(
        "CALL AddDishToOrder(?, ?, ?)",
        [orderId, item.dish_id, item.quantity]
      );
    }

    res.json({ orderId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order error" });
  }
});

// ================= GET DISHES BY CATEGORY ================= //
app.get("/dishes", async (req, res) => {
  try {
    const { category_id } = req.query;

    const [rows] = await db.query(
      "SELECT id, name, price FROM dishes WHERE category_id = ?",
      [category_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error loading dishes" });
  }
});

// ================= CATEGORIES ================= //
app.get("/categories", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM menu_categories");
  res.json(rows);
});

// ================= RESERVATION ================= //
app.post("/reservations", checkRole(["client", "employee"]), async (req, res) => {
  try {
    const { table_id, date, time } = req.body;

    if (!table_id || !date || !time) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let customer_id;

    if (req.user.role === "client") {
      const [rows] = await db.query(
        "SELECT id FROM customers WHERE user_id = ?",
        [req.user.user_id]
      );

      if (!rows.length) {
        return res.status(400).json({
          message: "Customer not found for this user"
        });
      }

      customer_id = rows[0].id;
    }

    await db.query(
      `INSERT INTO reservations 
       (customer_id, table_id, reservation_date, reservation_time, status) 
       VALUES (?, ?, ?, ?, 'reserved')`,
      [customer_id, table_id, date, time]
    );

    res.json({ message: "Reservation created" });

  } catch (err) {
    console.error("RESERVATION ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= ORDER STATUS + TOTAL =================
app.get("/orders/:id/info", async (req, res) => {

  try {

    const orderId = req.params.id;

    const [order] = await db.query(
      `
      SELECT
        id,
        status
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    if (!order.length) {

      return res.status(404).json({
        message: "Order not found"
      });
    }

    const [[{ total }]] = await db.query(
      "SELECT GetOrderTotal(?) AS total",
      [orderId]
    );

    const [payments] = await db.query(
      `
      SELECT
        payment_method,
        amount,
        payment_date
      FROM payments
      WHERE order_id = ?
      `,
      [orderId]
    );

    res.json({

      orderId,

      status: order[0].status,

      total,

      payment_status:
        payments.length > 0
          ? "paid"
          : "unpaid",

      payment_method:
        payments.length > 0
          ? payments[0].payment_method
          : null,

      payment_date:
        payments.length > 0
          ? payments[0].payment_date
          : null
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error fetching order info"
    });
  }
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body; 
    const orderId = req.params.id;

    if (!["active", "pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      "UPDATE orders SET status=? WHERE id=?",
      [status, orderId]
    );

    res.json({ message: "Status updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update error" });
  }
});

// ================= PAYMENTS =================
app.post("/orders/:id/pay", async (req, res) => {

  try {

    const orderId = req.params.id;

    const { method } = req.body;

    if (!["cash", "card"].includes(method)) {

      return res.status(400).json({
        message: "Invalid payment method"
      });
    }

    const [order] = await db.query(
      `
      SELECT
        id,
        status
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    if (!order.length) {

      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order[0].status !== "completed") {

      return res.status(400).json({
        message: "Order is not completed"
      });
    }

    const [existingPayment] = await db.query(
      `
      SELECT id
      FROM payments
      WHERE order_id = ?
      `,
      [orderId]
    );

    if (existingPayment.length > 0) {

      return res.status(400).json({
        message: "Order already paid"
      });
    }

    const [[{ total }]] = await db.query(
      "SELECT GetOrderTotal(?) AS total",
      [orderId]
    );


    await db.query(
      `
      INSERT INTO payments
      (
        order_id,
        amount,
        payment_method,
        payment_date
      )
      VALUES (?, ?, ?, NOW())
      `,
      [orderId, total, method]
    );

    res.json({

      message: "Payment successful",

      total,

      method
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Payment error"
    });
  }
});

// ================= COMPLAINT ================= //
app.post("/complaints", checkRole(["client", "employee"]), async (req, res) => {
  try {
    let { text } = req.body;

    let customer_id;

    if (req.user.role === "client") {
      const [rows] = await db.query(
        "SELECT id FROM customers WHERE user_id = ?",
        [req.user.user_id]
      );

      if (!rows.length) {
        return res.status(400).json({ message: "Customer not found" });
      }

      customer_id = rows[0].id;
    }

    if (!text) {
      return res.status(400).json({ message: "Missing text" });
    }

    await db.query(
      "INSERT INTO complaints (customer_id, complaint_text, complaint_date) VALUES (?, ?, CURDATE())",
      [customer_id, text]
    );

    res.json({ message: "Complaint added" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Complaint error" });
  }
});

// ================= PURCHASES ================= //
app.post("/purchases", checkRole(["employee"]), async (req, res) => {
  try {
    const { supplier_id, items } = req.body;

    if (!supplier_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing data" });
    }

    const [purchase] = await db.query(
      "INSERT INTO purchases (supplier_id, purchase_date) VALUES (?, NOW())",
      [supplier_id]
    );

    const purchaseId = purchase.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO purchase_items 
         (purchase_id, ingredient_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [purchaseId, item.ingredient_id, item.quantity, item.price]
      );

      await db.query(
        "UPDATE ingredients SET quantity = quantity + ? WHERE id = ?",
        [item.quantity, item.ingredient_id]
      );
    }

    res.json({
      message: "Purchase created",
      purchaseId
    });

  } catch (err) {
    console.error("PURCHASE ERROR:", err);
    res.status(500).json({ message: "Purchase error" });
  }
});

app.get("/suppliers", checkRole(["employee"]), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM suppliers");
  res.json(rows);
});

app.get("/ingredients", checkRole(["employee"]), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM ingredients");
  res.json(rows);
});

app.get("/purchases", checkRole(["employee"]), async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.id, s.name AS supplier, p.purchase_date
    FROM purchases p
    JOIN suppliers s ON p.supplier_id = s.id
    ORDER BY p.purchase_date DESC
  `);

  res.json(rows);
});

// ================= SUPPLIERS ================= //
app.post("/suppliers", checkRole(["employee"]), async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    await db.query(
      "INSERT INTO suppliers (name, phone) VALUES (?, ?)",
      [name, phone ?? null]
    );

    res.json({ message: "Supplier created" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Supplier error" });
  }
});

app.post("/ingredients", checkRole(["employee"]), async (req, res) => {
  try {
    const { name, unit, quantity } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    await db.query(
      "INSERT INTO ingredients (name, unit, quantity) VALUES (?, ?, 0)",
      [name, unit || "kg"]
    );

    res.json({ message: "Ingredient created" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ingredient error" });
  }
});
// ================= 16 QUERIES ================= //

// 1
app.get("/tables", checkRole(["client", "employee"]), async (req, res) => {
  const [rows] = await db.query("SELECT table_number, capacity, zone_id, status FROM tables");
  res.json(rows);
});

// 2
app.get("/reserved", checkRole(["client", "employee"]), async (req, res) => {
  const { date, time } = req.query;
  const [rows] = await db.query(`
    SELECT t.table_number
    FROM reservations r
    JOIN tables t ON r.table_id = t.id
    WHERE r.reservation_date=? AND r.reservation_time=?`,
    [date, time]
  );
  res.json(rows);
});

// 3
app.get("/free-tables-zone", async (req, res) => {
  const { zone_id } = req.query;

  const [rows] = await db.query(
    `SELECT COUNT(*) AS free_tables 
     FROM tables 
     WHERE zone_id = ? 
     AND status IN ('available')`,
    [zone_id]
  );

  res.json(rows);
});

// 4
app.get("/top-waiters", checkRole(["employee"]), async (req, res) => {
  const { start, end } = req.query;

  const [rows] = await db.query(`
    SELECT e.name, COUNT(o.id) AS orders_count
    FROM orders o
    JOIN employees e ON o.employee_id = e.id
    JOIN roles r ON e.role_id = r.id
    WHERE r.name='waiter'
      AND o.order_time BETWEEN ? AND ?
    GROUP BY e.id
    HAVING orders_count = (
      SELECT MAX(cnt)
      FROM (
        SELECT COUNT(o2.id) AS cnt
        FROM orders o2
        JOIN employees e2 ON o2.employee_id = e2.id
        JOIN roles r2 ON e2.role_id = r2.id
        WHERE r2.name='waiter'
          AND o2.order_time BETWEEN ? AND ?
        GROUP BY e2.id
      ) t
    )
  `, [start, end, start, end]);

  res.json(rows);
});

// 5
app.get("/orders-by-day", checkRole(["employee"]), async (req, res) => {
  const { date } = req.query;
  const [rows] = await db.query("SELECT * FROM orders WHERE DATE(order_time)=?", [date]);
  res.json(rows);
});

// 6
app.get("/avg-check", checkRole(["employee"]), async (req, res) => {
  const { start, end } = req.query;
  const [rows] = await db.query(
    "SELECT AVG(amount) AS avg_check FROM payments WHERE payment_date BETWEEN ? AND ?",
    [start, end]
  );
  res.json(rows);
});

// 7
app.get("/top-clients", checkRole(["employee"]), async (req, res) => {
  try {
    const { start, end, min } = req.query;

    const [rows] = await db.query(`
      SELECT c.name, SUM(p.amount) AS total
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      WHERE DATE(p.payment_date) BETWEEN ? AND ?
      GROUP BY c.id
      HAVING total > ?
      ORDER BY total DESC
    `, [start, end, Number(min) || 0]);

    res.json(rows);
  } catch (err) {
    console.error("TOP CLIENTS ERROR:", err);
    res.status(500).json({ message: "Error loading top clients" });
  }
});

// 8
app.get("/top-dishes", checkRole(["employee"]), async (req, res) => {
  const { month } = req.query;

  const [rows] = await db.query(`
    SELECT d.name, SUM(oi.quantity) AS total
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN dishes d ON oi.dish_id = d.id
    WHERE MONTH(o.order_time) = ?
    GROUP BY d.id
    HAVING total = (
      SELECT MAX(total_count)
      FROM (
        SELECT SUM(oi2.quantity) AS total_count
        FROM order_items oi2
        JOIN orders o2 ON oi2.order_id = o2.id
        WHERE MONTH(o2.order_time) = ?
        GROUP BY oi2.dish_id
      ) t
    )
  `, [month, month]);

  res.json(rows);
});

// 9
app.get("/least-dishes", checkRole(["employee"]), async (req, res) => {
  const { days } = req.query;

  const [rows] = await db.query(`
    SELECT d.name, SUM(oi.quantity) AS total
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN dishes d ON oi.dish_id = d.id
    WHERE o.order_time >= NOW() - INTERVAL ? DAY
    GROUP BY d.id
    HAVING total = (
      SELECT MIN(total_count)
      FROM (
        SELECT SUM(oi2.quantity) AS total_count
        FROM order_items oi2
        JOIN orders o2 ON oi2.order_id = o2.id
        WHERE o2.order_time >= NOW() - INTERVAL ? DAY
        GROUP BY oi2.dish_id
      ) t
    )
  `, [days, days]);

  res.json(rows);
});

// 10
app.get("/suppliers-report", checkRole(["employee"]), async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      s.name AS supplier_name,
      COALESCE(SUM(pi.quantity), 0) AS total_purchases
    FROM suppliers s
    LEFT JOIN purchases p ON s.id = p.supplier_id
    LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
    GROUP BY s.id, s.name
  `);

  res.json(rows);
});

// 11
app.get("/inventory-status", checkRole(["employee"]), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.name AS ingredient,
        i.quantity AS available,
        d.name AS dish,
        di.quantity AS required,
        CASE 
          WHEN i.quantity >= di.quantity THEN 'enough'
          ELSE 'missing'
        END AS status,
        (di.quantity - i.quantity) AS shortage
      FROM dish_ingredients di
      JOIN ingredients i ON di.ingredient_id = i.id
      JOIN dishes d ON di.dish_id = d.id
      ORDER BY status ASC, shortage DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("INVENTORY STATUS ERROR:", err);
    res.status(500).json({ message: "Error loading inventory status" });
  }
});

// 12
app.get("/frequent-customers", checkRole(["employee"]), async (req, res) => {

  const [rows] = await db.query(`
    SELECT c.name, COUNT(o.id) AS visits
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id
    HAVING visits = (
      SELECT MAX(cnt)
      FROM (
        SELECT COUNT(o2.id) AS cnt
        FROM orders o2
        GROUP BY o2.customer_id
      ) t
    )
  `);

  res.json(rows);
});

// 13
app.get("/complaints",checkRole(["client", "employee"]), async (req, res) => {
  const [rows] = await db.query(`
    SELECT c.name, comp.complaint_text
    FROM complaints comp
    JOIN customers c ON comp.customer_id=c.id`);
  res.json(rows);
});

// 14
app.get("/profit", checkRole(["employee"]), async (req, res) => {
  try {
    const { start, end } = req.query;

    const [rows] = await db.query(`
      SELECT 
        IFNULL(
          (
            SELECT SUM(amount)
            FROM payments
            WHERE payment_date >= ?
            AND payment_date < DATE_ADD(?, INTERVAL 1 DAY)
          ),
          0
        ) AS income,

        IFNULL(
          (
            SELECT SUM(pi.price * pi.quantity)
            FROM purchase_items pi
            JOIN purchases p 
              ON pi.purchase_id = p.id
            WHERE p.purchase_date >= ?
            AND p.purchase_date < DATE_ADD(?, INTERVAL 1 DAY)
          ),
          0
        ) AS expenses
    `, [start, end, start, end]);

    const income = Number(rows[0].income || 0);
    const expenses = Number(rows[0].expenses || 0);

    const profit = income - expenses;

    res.json([
      {
        income,
        expenses,
        profit
      }
    ]);

  } catch (err) {
    console.error("PROFIT ERROR:", err);

    res.status(500).json({
      message: "Error calculating profit"
    });
  }
});

// 15
app.get("/expenses", checkRole(["employee"]), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.name AS ingredient,

        IFNULL(p.purchased_quantity, 0) AS purchased_quantity,

        ROUND(IFNULL(p.purchase_cost, 0), 2) AS purchase_cost,

        IFNULL(u.used_quantity, 0) AS used,

        IFNULL(p.purchased_quantity, 0) - IFNULL(u.used_quantity, 0) AS balance
      FROM ingredients i

      LEFT JOIN (
        SELECT 
          ingredient_id,
          SUM(quantity) AS purchased_quantity,
          SUM(quantity * price) AS purchase_cost
        FROM purchase_items
        GROUP BY ingredient_id
      ) p ON i.id = p.ingredient_id

      LEFT JOIN (
        SELECT 
          di.ingredient_id,
          SUM(oi.quantity * di.quantity) AS used_quantity
        FROM dish_ingredients di
        JOIN order_items oi ON di.dish_id = oi.dish_id
        GROUP BY di.ingredient_id
      ) u ON i.id = u.ingredient_id
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
});

// 16
app.get("/problem-orders", checkRole(["employee"]), async (req, res) => {
  const [rows] = await db.query(`
    SELECT id, table_id, order_time, status, employee_id
    FROM orders
    WHERE status = 'pending'
    ORDER BY order_time DESC
  `);

  res.json(rows);
});



app.listen(5001, () => console.log("Server running on port 5001"));
