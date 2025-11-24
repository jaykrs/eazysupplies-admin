"use client"
import React, { useState , useEffect} from "react";
import { Col } from "reactstrap";
import { BrandAPI } from "@/utils/axiosUtils/API";
import axios from "axios";
import AllDeliveryAgentTable from "@/components/deliveryAgent/AllDeliveryAgentTable";
const DeliveryAgent = () => {
  const [isCheck, setIsCheck] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [])

  const fetchProduct = async () => {
    let res = await axios.get('/api/deliveryAgent', { withCredentials: true });
    if (res.status == 200) {
      setData(res.data);
    }

  }
  return (
    <Col sm="12">
      <AllDeliveryAgentTable
        url={BrandAPI}
        moduleName="DeliveryAgent"
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        keyInPermission={"deliveryAgent"}
        data= {data}
        fetchProduct={fetchProduct}
      />
    </Col>
  );
};

export default DeliveryAgent;