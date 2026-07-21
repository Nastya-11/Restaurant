import { useEffect, useState } from "react";
import { Card, TextField, Button, Typography } from "@mui/material";
import api from "../../api/axios";

export default function IngredientsTab() {

  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");

  const load = async () => {
    const res = await api.get("/ingredients");
    setIngredients(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const addIngredient = async () => {
    await api.post("/ingredients", { name, unit });
    setName("");
    load();
  };

  return (
    <div>

      <Typography variant="h6">Ingredients</Typography>

      <Card sx={{ p: 2, mt: 2 }}>

        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <TextField
          label="Unit"
          fullWidth
          sx={{ mt: 2 }}
          value={unit}
          onChange={e => setUnit(e.target.value)}
        />

        <Button sx={{ mt: 2 }} variant="contained" onClick={addIngredient}>
          Add Ingredient
        </Button>

      </Card>

      {ingredients.map(i => (
        <Card key={i.id} sx={{ mt: 2, p: 2 }}>
          {i.name} ({i.unit})
        </Card>
      ))}

    </div>
  );
}