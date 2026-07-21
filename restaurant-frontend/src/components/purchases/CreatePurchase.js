import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box
} from "@mui/material";
import api from "../../api/axios";

export default function CreatePurchase() {

  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/suppliers").then(res => setSuppliers(res.data));
    api.get("/ingredients").then(res => setIngredients(res.data));
  }, []);

  const addItem = () => {
    setItems([...items, {
      ingredient_id: "",
      quantity: 1,
      price: 0
    }]);
  };

  const updateItem = (i, field, value) => {
    const copy = [...items];
    copy[i][field] = value;
    setItems(copy);
  };

  const submit = async () => {
    await api.post("/purchases", {
      supplier_id: supplierId,
      items
    });

    alert("Saved!");
    setItems([]);
  };

  return (
    <div>

      <Typography variant="h6">
        Create Purchase
      </Typography>

      <Card sx={{ p: 2, mt: 2 }}>

        <Select
          fullWidth
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          {suppliers.map(s => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>

        <Button sx={{ mt: 2 }} onClick={addItem}>
          + Add Item
        </Button>

        {items.map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, mt: 2 }}>

            <Select
              value={item.ingredient_id}
              onChange={(e) => updateItem(i, "ingredient_id", e.target.value)}
              sx={{ flex: 2 }}
            >
              {ingredients.map(ing => (
                <MenuItem key={ing.id} value={ing.id}>
                  {ing.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              type="number"
              label="Qty"
              value={item.quantity}
              onChange={(e) =>
                updateItem(i, "quantity", Number(e.target.value))
              }
            />

            <TextField
              type="number"
              label="Price"
              value={item.price}
              onChange={(e) =>
                updateItem(i, "price", Number(e.target.value))
              }
            />

          </Box>
        ))}

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={submit}
        >
          Save
        </Button>

      </Card>
    </div>
  );
}