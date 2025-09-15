import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import SimpleInputField from "../inputFields/SimpleInputField";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import axios from "axios";

const TagForm = ({ updateId, type, buttonName }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (updateId) {
      fetchDetails();
    }
  }, [updateId]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get('/api/tags?tagId=' + updateId);
      if (res.status == 200) {
        console.log('........res', res);
        setData(res.data.data);

      }
      setIsLoading(false);
    } catch (err) {
      console.log('........err', err);
      alert('something went wrong');
    }
  }
  if (updateId && isLoading) return <Loader />;

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (buttonName == "Update") {
        const res = await axios.put('/api/tags?tagId=' + updateId, {
          "description": values.description,
        }, { withCredentials: true });

        if (res.status == 200) {
          alert('product: ' + values.name + " updated successfully!");
          router.push("/tag");
        }

      } else {
        const res = await axios.post('/api/tags', {
          "name": values.name,
          "description": values.description,
        }, { withCredentials: true });

        if (res.status == 201) {
          alert('product: ' + values.name + " added successfully!");
          router.push("/tag");
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.log('.........', err)
      alert(err.response.data.error);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: data.length > 1 ? data[0]?.name : "",
        description: data.length > 1 ? data[0]?.description : ""
      }}
      validationSchema={YupObject({ name: nameSchema })}
      onSubmit={(values) => {
        handleSubmit(values)
      }}
    >
      {() => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            <SimpleInputField
              nameList={[
                ...(updateId ? [] : [{ name: "name", placeholder: t("EnterTagName"), require: "true" }]),
                { name: "description", type: "textarea", title: "Description", placeholder: t("EnterDescription") }
              ]}
            />
            <FormBtn buttonName={buttonName} />
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default TagForm;
