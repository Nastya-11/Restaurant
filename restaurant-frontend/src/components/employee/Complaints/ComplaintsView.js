import { useEffect, useState } from "react";

import api from "../../../api/axios";

import DataTable from "../../common/DataTable";
import SectionContainer from "../../common/SectionContainer";

export default function ComplaintsView() {

  const [data, setData] = useState([]);

  const loadData = async () => {

    const res = await api.get("/complaints");

    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SectionContainer title="Complaints">

      <DataTable data={data} />

    </SectionContainer>
  );
}