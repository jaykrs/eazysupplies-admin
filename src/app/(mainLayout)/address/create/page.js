"use client";
import useCreate from "../../../../utils/hooks/useCreate";
import { useState } from "react";
import AddressForm from "@/components/address/AddressForm";

const AddressCreate = () => {
  const [resetData, setResetData] = useState(false);
  return <AddressForm key={resetData} setResetData={setResetData} type={"product"} />
};

export default AddressCreate;
