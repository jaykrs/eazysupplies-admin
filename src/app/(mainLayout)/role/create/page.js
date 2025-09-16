"use client";
import RoleForm from "../../../../components/role/roleForm";
import { useState } from "react";

const RoleCreate = () => {
  const [resetData, setResetData] = useState(false);
 
  // return <ProductForm values={resetKey} mutate={mutate} loading={isLoading} title={"AddProduct"} key={resetKey} buttonName="Save" />;
  return <RoleForm  type={"product"} title="New Role" />
};

export default RoleCreate;
