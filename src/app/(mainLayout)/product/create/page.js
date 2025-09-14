"use client";
import CategoryNewForm from "../../../../components/product/ProductNewForm";
import { product } from "../../../../utils/axiosUtils/API";
import useCreate from "../../../../utils/hooks/useCreate";
import { useState } from "react";

const ProductCreate = () => {
  const [resetData, setResetData] = useState(false);
  const { mutate, isLoading } = useCreate(product, false, product, false, (resDta) => {
    if (resDta?.status == 200 || resDta?.status == 201) {
      setResetData(true);
    }
  });
  // return <ProductForm values={resetKey} mutate={mutate} loading={isLoading} title={"AddProduct"} key={resetKey} buttonName="Save" />;
  return <CategoryNewForm loading={isLoading} mutate={mutate} key={resetData} setResetData={setResetData} type={"product"} />
};

export default ProductCreate;
