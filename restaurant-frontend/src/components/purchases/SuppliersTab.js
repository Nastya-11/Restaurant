import { useEffect, useState } from "react";
import { Card, TextField, Button, Typography } from "@mui/material";
import api from "../../api/axios";

export default function SuppliersTab() {

  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const load = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const addSupplier = async () => {
    await api.post("/suppliers", { name, phone });
    setName("");
    setPhone("");
    load();
  };

  return (
    <div>

      <Typography variant="h6">Suppliers</Typography>

      <Card sx={{ p: 2, mt: 2 }}>

        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <TextField
          label="Phone"
          fullWidth
          sx={{ mt: 2 }}
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <Button sx={{ mt: 2 }} variant="contained" onClick={addSupplier}>
          Add Supplier
        </Button>

      </Card>

      {suppliers.map(s => (
        <Card key={s.id} sx={{ mt: 2, p: 2 }}>
          {s.name} — {s.phone}
        </Card>
      ))}

    </div>
  );
}