'use client'
import { useParams } from "next/navigation";
import RoleForm from "@/components/role/roleForm";

const UpdateProduct = () => {
  const params  = useParams();

  return (
    params?.updateId && (
      // <ProductForm saveButton={saveButton} setSaveButton={setSaveButton} values={mutate} mutate={mutate} updateId={params?.updateId} loading={isLoading} title={"EditProduct"} key={resetKey}  buttonName="Update"/>
      //  <CategoryNewForm updateId={params?.updateId} loading={isLoading} mutate={mutate}   buttonName="Update" title={"EditProduct"} />
       <RoleForm updateId={params?.updateId}  type={"product"} buttonName="Update" title={"Edit Role"} />
    )
  );
};

export default UpdateProduct;
