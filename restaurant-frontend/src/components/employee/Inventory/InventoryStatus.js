import { useEffect, useState } from "react";
import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function InventoryStatus() {

  const [data, setData] = useState([]);

  const loadData = async () => {
    const res = await api.get("/inventory-status");
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SectionContainer title="Inventory Status">

      <DataTable
        data={data}
        rowStyle={(row) => ({
          backgroundColor:
            row.status === "missing"
              ? "rgba(255, 0, 0, 0.08)"
              : "transparent"
        })}
      />

    </SectionContainer>
  );
}