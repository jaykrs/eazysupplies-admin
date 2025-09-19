import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import FormBtn from "../../elements/buttons/FormBtn";
import CategoryContext from "../../helper/categoryContext";
import request from "../../utils/axiosUtils";
import { nameSchema, descriptionSchema, YupObject, numberSchema, roleIdSchema } from "../../utils/validation/ValidationSchemas";
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
import { NumberSchema } from "yup";

const CategoryNewForm = ({ setResetData, updateId, loading, type, buttonName }) => {
  const { t } = useTranslation("common");
  const [catData, setCatData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taxData, setTaxData] = useState([]);
  const [productData, setProductData] = useState({});
  const [supplierData, setSupplierData] = useState([]);
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
    const allData = await axios.get('/api/products/filter/filter_tag_brand_category?tag_brand_category=true');
    if (allData.status == 200) {
      const tagData = allData?.data?.tags?.map(item => ({ id: item.id, name: item.name }));
      setTagData(tagData);
      const brandData = allData?.data?.brands?.map(item => ({ id: item.id, name: item.name }));
      setBrandData(brandData);
      const tagCategory = allData?.data?.categories?.map(item => ({ id: item.id, name: item.name }));
      setCatData(tagCategory);
      const tax = allData?.data?.tax?.map(item => ({ id: item.id, name: item.name + "-" + item.value + "%", value: item.value }));
      setTaxData(tax);
      const supplier = allData?.data?.supplier?.map(item => ({ id: item.id, name: item.name }));
      setSupplierData(supplier);
    }
  }

  if (updateId && isLoading) return <Loader />;
  const handleSubmit = async (values) => {
    try {
      if (brandId == 0 || categoryId == 0) {
        alert('brand or category is missing');
      }
      console.log('.............data', values);
      // const taxDataFilter = taxData.filter(item => item.id == Number(values.tax));
      // if (taxDataFilter.length == 0) {
      //   alert('All field is mandatory!');
      // }
      const tagStr = (values.tags).toString();
      const supplierStr = (values.supplier).toString();

      if (updateId) {
        const res = await axios.put('/api/products', {
          "id": Number(updateId),
          "name": values.name,
          "description": values.description,
          "price": values.price,
          "stock": values.stock,
          "categoryId": values.categoryId,
          "brandId": values.brandId,
          "tags": tagStr,
          "sku": values.sku,
          "skuType": values.skuType,
          "dimension": values.dimension,
          "tax": Number(values.tax),
          "supplier": supplierStr,
          "pkgUnit": values.pkgUnit,
          "pkgCnt": values.pkgCnt,
          "unitRate": values.unitRate,
          "status": values.status
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
          "tags": tagStr,
          "sku": values.sku,
          "skuType": values.skuType,
          "dimension": values.dimension,
          "tax": Number(values.tax),
          "supplier": supplierStr,
          "pkgUnit": values.pkgUnit,
          "pkgCnt": values.pkgCnt,
          "unitRate": values.unitRate,
          "status": Boolean(values.status)
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
                tax: Object.keys(productData).length > 0 ? Number(productData?.tax) : 0, //  :
                brandId: Object.keys(productData).length > 0 ? productData?.brand?.id : 0,
                categoryId: Object.keys(productData).length > 0 ? productData?.category?.id : 0,
                tags: Object.keys(productData).length > 0 ? (productData?.tags ? productData?.tags.split(',').map(Number) : []) : [],
                supplier: Object.keys(productData).length > 0 ? Number(productData?.supplier) : 0,
                skuType:  Object.keys(productData).length > 0 ? productData?.skuType : "",
                pkgUnit:  Object.keys(productData).length > 0 ? Number(productData?.pkgUnit) : 0,
                pkgCnt:  Object.keys(productData).length > 0 ? Number(productData?.pkgCnt) : 0,
                unitRate:  Object.keys(productData).length > 0 ? Number(productData?.unitRate) : 0,
                status:  Object.keys(productData).length > 0 ? (productData?.status) : false
              }}
              validationSchema={YupObject({
                name: nameSchema,
                description: descriptionSchema,
                price: numberSchema,
                stock: numberSchema,
                sku: nameSchema,
                dimension: nameSchema,
                tax: numberSchema,
                // brandId: roleIdSchema,
                // categoryId: roleIdSchema,
                //tags: nameSchema
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
                    <SimpleInputField nameList={[{ name: "price", title: "Price", placeholder: t("Enter price"), type: "number", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "stock", title: "Stock", placeholder: t("Enter stock available"), type: "number", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "dimension", title: "Dimension", placeholder: t("Enter dimension"), type: "text", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "sku", title: "Sku", placeholder: t("Enter sku type"), type: "text", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "skuType", title: "Sku type", placeholder: t("Enter sku type"), type: "text", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "pkgUnit", title: "Pkg Unit", placeholder: t("Enter sku type"), type: "text", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "unitRate", title: "Unit Rate", placeholder: t("Enter sku type"), type: "number", require: "true", }]} />
                    <SimpleInputField nameList={[{ name: "pkgCnt", title: "Pkg Count", placeholder: t("Enter sku type"), type: "number", require: "true", }]} />
                    <CheckBoxField name="status" title="Status" />
                    {/* <SimpleInputField nameList={[{ name: "tax", title: "tax", postprefix: "%", inputaddon: "true", placeholder: t("Enter tax"), min: "0", max: "100", type: "number", helpertext: "*Define the percentage of tax to be paid", require: "true", }]} /> */}
                    <SearchableSelectInput
                      nameList={[
                        {
                          name: "tax",
                          title: "Tax(%)",
                          require: "true",
                          inputprops: {
                            name: "tax",
                            id: "tax",
                            options: taxData.length > 0 ? taxData : [],
                            close: false,
                            isMulti: false
                          },
                        },
                      ]}
                    />
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
                            isMulti: false
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
                            isMulti: false
                          },
                        },
                      ]}
                    />

                    <SearchableSelectInput
                      nameList={[
                        {
                          name: "tags",
                          title: "Tags",
                          require: "true",
                          inputprops: {
                            name: "tags",
                            id: "tags",
                            options: tagData.length > 0 ? tagData : [],
                            close: false,
                            isMulti: true,
                          },
                        },
                      ]}
                    />

                    <SearchableSelectInput
                      nameList={[
                        {
                          name: "supplier",
                          title: "Supplier",
                          require: "true",
                          inputprops: {
                            name: "supplier",
                            id: "supplier",
                            options: supplierData.length > 0 ? supplierData : [],
                            close: false,
                            isMulti: false
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
