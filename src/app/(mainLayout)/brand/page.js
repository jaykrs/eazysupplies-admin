"use client"
import React, { useState , useEffect} from "react";
import { Col } from "reactstrap";
import { BrandAPI } from "@/utils/axiosUtils/API";
import AllBrandTable from "@/components/brand/AllBrandTable";
import axios from "axios";
const Brand = () => {
  const [isCheck, setIsCheck] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [])

  const fetchProduct = async () => {
    let res = await axios.get('/api/brands', { withCredentials: true });
    if (res.status == 200) {
      setData(res.data);
    }

  }
  return (
    <Col sm="12">
      <AllBrandTable
        url={BrandAPI}
        moduleName="brand"
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        keyInPermission={"brand"}
        data= {data}
        fetchProduct={fetchProduct}
      />
    </Col>
  );
};

export default Brand;