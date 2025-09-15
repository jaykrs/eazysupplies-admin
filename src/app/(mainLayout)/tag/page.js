"use client";
import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import AllTagsTable from "@/components/tag/AllTagsTable";
import { tag,TagExportAPI, TagImportAPI } from "@/utils/axiosUtils/API";
import axios from "axios";

const AllTags = () => {
  const [isCheck, setIsCheck] = useState([]);
  const [data, setData] = useState([]);

   useEffect(() => {
          //const initial = document.body.classList.contains("dark-only");
        //  setIsDarkMode(initial);
          fetchProduct();
      }, [])
  
      const fetchProduct = async () => {
          let res = await axios.get('/api/tags', { withCredentials: true });
          if (res.status == 200) {
              setData(res.data);
          }
          
      }
  return (
    <Col sm="12">
      <AllTagsTable
        url={tag}
        moduleName="Tag"
        isCheck={isCheck}
        setIsCheck={setIsCheck}
        type={"Tag"}
        exportButton={true}
       // importExport={{ importUrl: TagImportAPI, exportUrl: TagExportAPI ,sampleFile:"tags.csv",}}
        data= {data}
        fetchProduct={fetchProduct}
      />
    </Col>
  );
};

export default AllTags;
