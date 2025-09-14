'use client'
import BrandForm from "@/components/brand/BrandForm";
import CategoryNewForm from "@/components/category/CategoryNewForm";
import FormWrapper from "@/utils/hoc/FormWrapper";

const CategoryCreate = () => {
  return (
    <FormWrapper title="New Category">
      <CategoryNewForm  buttonName="Save"/>
    </FormWrapper>
  );
};

export default CategoryCreate;
