"use client"
import React, { useState , useEffect} from "react";
import { Col } from "reactstrap";
import { BrandAPI } from "@/utils/axiosUtils/API";
import AllCategoryTable from "@/components/category/AllCategoryTable";
import axios from "axios";
const CategoryCreate = () => {
  const [isCheck, setIsCheck] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [])

  const fetchProduct = async () => {
    let res = await axios.get('/api/categories', { withCredentials: true });
    if (res.status == 200) {
      setData(res.data);
    }

  }
  return (
    <Col sm="12">
      <AllCategoryTable
        url={BrandAPI}
        moduleName="category"
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        keyInPermission={"category"}
        data= {data}
        fetchProduct={fetchProduct}
      />
    </Col>
  );
};

export default CategoryCreate;