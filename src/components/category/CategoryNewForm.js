import { mediaConfig } from "@/data/MediaConfig";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { BrandAPI } from "../../utils/axiosUtils/API";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import FileUploadField from "../inputFields/FileUploadField";
import SimpleInputField from "../inputFields/SimpleInputField";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import axios from "axios";
const CategoryNewForm = ({ updateId, buttonName }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchDetails();
  }, [updateId]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get('/api/categories?categoryId=' + updateId);
      if (res.status == 200) {
        setData(res.data.data);
      }
      setIsLoading(false);
    } catch (err) {
      alert('something went wrong');
    }
  }
  if (updateId && isLoading) return <Loader />;

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (buttonName == "Update") {
        const res = await axios.put('/api/categories?categoryId=' + updateId, {
          "name": values.name,
        }, { withCredentials: true });

        if (res.status == 200) {
          alert('Category: ' + values.name + " updated successfully!");
          router.push("/category");
        }

      } else {
        const res = await axios.post('/api/categories', {
          "name": values.name,
          // "description": values.description,
        }, { withCredentials: true });

        if (res.status == 201) {
          alert('Category: ' + values.name + " added successfully!");
          router.push("/category");
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.log('.........', err)
      alert(err.response.data.error);
    }
  }
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name: Object.keys(data).length > 1 ? data?.name : "",
          // brand_image_id: updateId ? oldData?.data?.brand_image?.id || "" : "",
          // brand_image: updateId ? oldData?.data?.brand_image || "" : "",
          // brand_banner_id: updateId ? oldData?.data?.brand_banner?.id || "" : "",
          // brand_banner: updateId ? oldData?.data?.brand_banner || "" : "",
          // meta_title: updateId ? oldData?.data?.meta_title || "" : "",
          // meta_description: updateId ? oldData?.data?.meta_description || "" : "",
          // brand_meta_image_id: updateId ? oldData?.data?.brand_meta_image?.id : "",
          // brand_meta_image: updateId ? oldData?.data?.brand_meta_image : "",
          // status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
        }}
        validationSchema={YupObject({
          name: nameSchema,
        })}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Form id="blog" className="theme-form theme-form-2 mega-form">
              <SimpleInputField nameList={[{ name: "name", placeholder: t("EnterName"), require: "true" }]} />
              {/* <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="brand_image_id" title="Image" id="brand_image_id" updateId={updateId} type="file" values={values} setFieldValue={setFieldValue} errors={errors} touched={touched} />
              <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="brand_banner_id" title="BannerImage" id="brand_banner_id" updateId={updateId} type="file" values={values} setFieldValue={setFieldValue} errors={errors} touched={touched} />
              <SimpleInputField
                nameList={[
                  { name: "meta_title", title: "meta_title", placeholder: t("enter_meta_title") },
                  { name: "meta_description", title: "meta_description", type: "textarea", rows: "3", placeholder: t("enter_meta_description") },
                ]}
              />
              <FileUploadField paramsProps={{ mime_type: mediaConfig.image.join(",") }} name="brand_meta_image_id" id="brand_meta_image_id" title="meta_image" updateId={updateId} type="file" values={values} setFieldValue={setFieldValue} />
              <CheckBoxField name="status" /> */}
              <FormBtn buttonName={buttonName} />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default CategoryNewForm;
