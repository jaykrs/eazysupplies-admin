'use client'
import BrandForm from "@/components/brand/BrandForm";
import FormWrapper from "@/utils/hoc/FormWrapper";

const CreateNewBrand = ({model}) => {
  return (
    <FormWrapper title="CreateBrand">
      <BrandForm  buttonName="Save" model={model}/>
     </FormWrapper>
  );
};

export default CreateNewBrand;
