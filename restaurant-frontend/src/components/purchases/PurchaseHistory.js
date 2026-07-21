import { useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import api from "../../api/axios";

export default function PurchaseHistory() {

  const [purchases, setPurchases] = useState([]);

  const load = async () => {
    const res = await api.get("/purchases");
    setPurchases(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <Typography variant="h6">
        Purchases History
      </Typography>

      {purchases.map(p => (
        <Card key={p.id} sx={{ mt: 2, p: 2 }}>
          <Typography>
            #{p.id} — {p.supplier}
          </Typography>

          <Typography variant="body2">
            {new Date(p.purchase_date).toLocaleString()}
          </Typography>
        </Card>
      ))}

    </div>
  );
}