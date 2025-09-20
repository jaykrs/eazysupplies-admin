"use client";
import FormWrapper from "@/utils/hoc/FormWrapper";
import dynamic from "next/dynamic";

const TaxCreate = () => {
    const SupplierForm = dynamic(() => import("@/components/supplier/supplierForm").then((mod) => mod.default), {
      // loading: () => <Loader />,
      ssr: false,
    });
  return (
    <FormWrapper title="Add Supplier">
      <SupplierForm buttonName="Save" />
    </FormWrapper>
  );
};

export default TaxCreate;
