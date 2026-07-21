import { useEffect, useState } from "react";
import api from "../../../api/axios";

import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Stack,
  Divider
} from "@mui/material";

import Cart from "./Cart";

export default function CreateOrder({ cart, setCart }) {

  const [form, setForm] = useState({
    table_id: "",
    customer_id: ""
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) loadDishes(selectedCategory);
  }, [selectedCategory]);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const loadDishes = async (categoryId) => {
    const res = await api.get("/dishes", {
      params: { category_id: categoryId }
    });
    setDishes(res.data);
  };

  const addToCart = (dish) => {
    const existing = cart.find(i => i.dish_id === dish.id);

    if (existing) {
      setCart(cart.map(i =>
        i.dish_id === dish.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([
        ...cart,
        {
          dish_id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1
        }
      ]);
    }
  };

  const createOrder = async () => {
    try {
      const res = await api.post("/orders", {
        table_id: form.table_id,
        customer_id: form.customer_id,
        items: cart.map(item => ({
          dish_id: item.dish_id,
          quantity: item.quantity
        }))
      });

      alert("Order created: " + res.data.orderId);
      setCart([]);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Order error");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>

      {/* HEADER */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Create New Order
      </Typography>

      <Grid container spacing={3}>

        {/* CATEGORIES */}
        <Grid item xs={3}>
          <Card sx={{ p: 2, position: "sticky", top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categories
            </Typography>

            <Stack spacing={1}>
              {categories.map(category => (
                <Button
                  key={category.id}
                  fullWidth
                  variant={
                    selectedCategory === category.id
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* DISHES */}
        <Grid item xs={5}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Dishes
          </Typography>

          <Stack spacing={2}>
            {dishes.map(dish => (
              <Card key={dish.id} sx={{ borderRadius: 3 }}>
                <CardContent>

                  <Typography variant="h6">
                    {dish.name}
                  </Typography>

                  <Typography sx={{ color: "gray" }}>
                    {dish.price} ₴
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => addToCart(dish)}
                  >
                    Add to cart
                  </Button>

                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* CART */}
        <Grid item xs={4}>
          <Card sx={{ p: 2, position: "sticky", top: 20 }}>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Cart
            </Typography>

            <Cart cart={cart} setCart={setCart} />

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              label="Table ID"
              size="small"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setForm({ ...form, table_id: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Customer ID"
              size="small"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setForm({ ...form, customer_id: e.target.value })
              }
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={cart.length === 0}
              onClick={createOrder}
            >
              Create Order
            </Button>

          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}