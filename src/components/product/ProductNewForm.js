import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import FormBtn from "../../elements/buttons/FormBtn";
import CategoryContext from "../../helper/categoryContext";
import request from "../../utils/axiosUtils";
import { nameSchema, descriptionSchema, YupObject } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import FileUploadField from "../inputFields/FileUploadField";
import MultiSelectField from "../inputFields/MultiSelectField";
import SearchableSelectInput from "../inputFields/SearchableSelectInput";
import SimpleInputField from "../inputFields/SimpleInputField";
import { Card, CardBody, Col, Row } from "reactstrap";

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
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [productData, setProductData] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    loadProductData();
  }, [updateId]);

  const loadProductData = async () => {
    const product = await axios.get('/api/products?productId=' + updateId);
    if (product.status == 200) {
      setProductData(product?.data?.data);
    }
  }
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
      if (brandId == 0 || categoryId == 0) {
        alert('brand or category is missing');
      }

      if (updateId) {
        const res = await axios.put('/api/products', {
          "id": Number(updateId),
          "name": values.name,
          "description": values.description,
          "price": values.price,
          "stock": values.stock,
          "categoryId": values.categoryId,
          "brandId": values.brandId,
          "tags": "1,2",
          "sku": values.sku,
          "dimension": values.dimension,
          "tax": values.tax
        }, { withCredentials: true });

        if (res.status == 200) {
          alert('product: ' + values.name + " updated successfully!");
          router.push("/product");
        }
      } else {
        const res = await axios.post('/api/products', {
          "name": values.name,
          "description": values.description,
          "price": values.price,
          "stock": values.stock,
          "categoryId": values.categoryId,
          "brandId": values.brandId,
          "tags": "1,2",
          "sku": values.sku,
          "dimension": values.dimension,
          "tax": values.tax
        }, { withCredentials: true });

        if (res.status == 201) {
          alert('product: ' + values.name + " added successfully!");
          router.push("/product");
        }
      }

    } catch (err) {
      console.log('.........', err)
      alert('something went wrong, please try again!');
    }

  }

  return (
    <Row>
      <Col xl="2"></Col>
      <Col xl="8">
        <Card className={""}>
          <CardBody>
            <div className="title-header option-title">
              <h5>{t("")}</h5>
            </div>
            <Formik
              enableReinitialize
              initialValues={{
                name: Object.keys(productData).length > 0 ? productData?.name : "",
                description: Object.keys(productData).length > 0 ? productData?.description : "",
                price: Object.keys(productData).length > 0 ? productData?.price : 0.0,
                stock: Object.keys(productData).length > 0 ? productData?.stock : 0,
                sku: Object.keys(productData).length > 0 ? productData?.sku : "",
                dimension: Object.keys(productData).length > 0 ? productData?.dimension : "",
                tax: Object.keys(productData).length > 0 ? productData?.tax : 0,
                brandId: Object.keys(productData).length > 0 ? productData?.brand?.id : 0,
                categoryId: Object.keys(productData).length > 0 ? productData?.category?.id : 0,

              }}
              validationSchema={YupObject({
                name: nameSchema,
                description: descriptionSchema

              })}
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
                          require: "true",
                        },
                      ]}
                    />
                    <SimpleInputField nameList={[{ name: "price", title: "price", placeholder: t("Enter price"), type: "number", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "stock", title: "stock", placeholder: t("Enter stock available"), type: "number", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "sku", title: "sku type", placeholder: t("Enter sku type"), type: "text", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "dimension", title: "dimension", placeholder: t("Enter dimension"), type: "text", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "tax", title: "tax", postprefix: "%", inputaddon: "true", placeholder: t("Enter tax"), min: "0", max: "100", type: "number", helpertext: "*Define the percentage of tax to be paid", require: "true", }]} />
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

                    <FormBtn loading={loading} buttonName={buttonName} />
                  </Row>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default CategoryNewForm;
