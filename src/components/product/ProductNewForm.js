import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import CategoryContext from "../../helper/categoryContext";
import request from "../../utils/axiosUtils";
import { nameSchema, YupObject } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import FileUploadField from "../inputFields/FileUploadField";
import MultiSelectField from "../inputFields/MultiSelectField";
import SearchableSelectInput from "../inputFields/SearchableSelectInput";
import SimpleInputField from "../inputFields/SimpleInputField";

import { mediaConfig } from "../../data/MediaConfig";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useCustomQuery from "../../utils/hooks/useCustomQuery";
import axios from "axios";

const CategoryNewForm = ({ setResetData, updateId, loading, type, buttonName }) => {
  const { t } = useTranslation("common");
  const [catData, setCatData] = useState([]);
  const [brandData, setBranddata] = useState([]);
  const [tagdata, setTagData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const categories = await axios.get('/api/categories');
    if (categories.status == 200) {
      let data = categories?.data?.data?.map(item => ({ id: item.id, name: item.name }));
      setCatData(data);
    }

    const brand = await axios.get('/api/brands');
    if (brand.status == 200) {
      let data = brand?.data?.data?.map(item => ({ id: item.id, name: item.name }));
      setBranddata(data);
    }

    const tag = await axios.get('/api/tags');
    if (tag.status == 200) {
      let data = tag?.data?.data?.map(item => ({ id: item.id, name: item.name }));
      setTagData(data);
    }
  }

  if (updateId && isLoading) return <Loader />;
  const handleSubmit = async (values) => {
    try {
      const res = await axios.post('/api/product', {
        "name": values.name,
        "description": values.description,
        "price": values.price,
        "stock": values.stock,
        //"categoryId": 1,
        //"brandId": 1,
        "tags": "1,2",
        "sku": values.sku,
        "dimension": values.dimension,
        "tax": values.tax
      }, { withCredentials: true });

      if (res.status == 201) {
        alert('product: ' + values.name + " added successfully!");
        router.push("/product");
      }

    } catch (err) {
      console.log('.........', err)
      alert(err.response.data.error);
    }

  }

  console.log('catdata', catData);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: "",
        description: "",
        price: 0.0,
        stock: 0,
        sku: "",
        dimension: "",
        tax: 0
      }}
      // validationSchema={YupObject({
      //   name: nameSchema,
      // })}
      onSubmit={(values, helpers) => {
        // setResetData && setResetData(true);
        // router.push(`/category`);
        handleSubmit(values);
      }}
    >
      {({ setFieldValue, values, errors }) => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            <SimpleInputField
              nameList={[
                {
                  name: "name",
                  title: "Name",
                  placeholder: t("Enter Product Name"),
                  require: "true",
                },
                {
                  name: "description",
                  type: "textarea",
                  rows: "3",
                  placeholder: t("Enter Product Description"),
                },
              ]}
            />
            <SimpleInputField nameList={[{ name: "price", title: "price", placeholder: t("Enter price"), type: "number" }]} />
            <SimpleInputField nameList={[{ name: "stock", title: "stock", placeholder: t("Enter stock available"), type: "number" }]} />
            <SimpleInputField nameList={[{ name: "sku", title: "sku type", placeholder: t("Enter sku type"), type: "text" }]} />
            <SimpleInputField nameList={[{ name: "dimension", title: "dimension", placeholder: t("Enter dimension"), type: "text" }]} />
            <SimpleInputField nameList={[{ name: "tax", title: "tax", postprefix: "%", inputaddon: "true", placeholder: t("Enter tax"), min: "0", max: "100", type: "number", helpertext: "*Define the percentage of tax to be paid" }]} />
            <SearchableSelectInput
              nameList={[
                {
                  name: "categoryId",
                  title: "Category",
                  require: "true",
                  inputprops: {
                    name: "categoryId",
                    id: "categoryId",
                    options: catData.length > 0 ? catData : [],
                    close: false,
                  },
                },
              ]}
            />
            <SearchableSelectInput
              nameList={[
                {
                  name: "brandId",
                  title: "Brand",
                  require: "true",
                  inputprops: {
                    name: "brandId",
                    id: "brandId",
                    options: brandData.length > 0 ? brandData : [],
                    close: false,
                  },
                },
              ]}
            />
            {/* <SearchableSelectInput
              nameList={[
                {
                  name: "categoryId",
                  title: "Category",
                  require: "true",
                  inputprops: {
                    name: "categoryId",
                    id: "categoryId",
                    options: catData.length > 0 ? catData : [],
                    close: false,
                  },
                },
              ]}
            /> */}
            <FormBtn loading={loading} buttonName={buttonName} />
          </Row>
        </Form>
      )}
    </Formik>
  );
};
export default CategoryNewForm;
