import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import { YupObject, descriptionSchema, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import SimpleInputField from "../inputFields/SimpleInputField";
import axios from "axios";
import { formatString } from "../../lib/format-number";

const TaxForm = ({ updateId, type, buttonName }) => {
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
      let res = await axios.get('/api/tax?taxId=' + updateId);
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
        const res = await axios.put('/api/tax?taxId=' + updateId, {
          "name": values.name,
          "value": Number(values.value),
          "description": values.value
        }, { withCredentials: true });
        if (res.status == 200) {
          alert('Tax: ' + values.name + " updated successfully!");
          router.push("/tax");
        }

      } else {
        const res = await axios.post('/api/tax', {
          "name": values.name,
          "value": Number(values.value),
          "description": values.description,
        }, { withCredentials: true });

        if (res.status == 201) {
          alert('Tax: ' + values.name + " added successfully!");
          router.push("/tax");
        }
      }
      setIsLoading(false);
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: Object.keys(data).length > 0 ? data?.name : "",
        description: Object.keys(data).length > 0 ? data?.description : "",
        tax: Object.keys(data).length > 0 ? data?.value : 0
      }}
      validationSchema={YupObject({ name: nameSchema, description: descriptionSchema })}
      onSubmit={(values) => {
        handleSubmit(values)
      }}
    >
      {() => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            <SimpleInputField
              nameList={[
                { name: "name", placeholder: t("EnterTaxName"), require: "true" },
                { name: "value", title: "Value", placeholder: t("EnterTaxValue"), require: "true", type: "number" },
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

export default TaxForm;
