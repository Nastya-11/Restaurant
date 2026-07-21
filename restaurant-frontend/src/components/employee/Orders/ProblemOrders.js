import { useEffect, useState } from "react";

import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function ProblemOrders() {

  const [data, setData] = useState([]);

  const loadData = async () => {

    const res = await api.get("/problem-orders");

    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SectionContainer title="Problem Orders">

      <DataTable data={data} />

    </SectionContainer>
  );
}