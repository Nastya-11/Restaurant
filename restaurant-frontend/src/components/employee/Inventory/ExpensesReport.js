import { useEffect, useState } from "react";

import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function ExpensesReport() {

  const [data, setData] = useState([]);

  const loadData = async () => {

    const res = await api.get("/expenses");

    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SectionContainer title="Expenses Report">

      <DataTable data={data} />

    </SectionContainer>
  );
}