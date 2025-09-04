import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row } from "reactstrap";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import SimpleInputField from "../inputFields/SimpleInputField";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const TagForm = ({  updateId, type, buttonName }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { data: oldData, isLoading, refetch } = useCustomQuery(["role/id"], () => request({ url: `tag/${updateId}` }, router), { refetchOnMount: false, enabled: false });
  useEffect(() => {
    updateId && refetch();
  }, [updateId]);
  if (updateId && isLoading) return <Loader />;

  return (
    <Formik 
      enableReinitialize
      initialValues={{
        name: updateId ? oldData?.data?.name || "" : "",
        type: type,
        description: updateId ? oldData?.data?.description : "",
        status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
      }}
      validationSchema={YupObject({ name: nameSchema })}
      onSubmit={(values) => {
        router.push("/tag");
        // Put Add Or Update Logic Here
      }}
    >
      {() => (
        <Form className="theme-form theme-form-2 mega-form">
          <Row>
            <SimpleInputField
              nameList={[
                { name: "name", placeholder: t("EnterTagName"), require: "true" },
                { name: "description", type: "textarea", title: "Description", placeholder: t("EnterDescription") },
              ]}
            />
            <CheckBoxField name="status" />
            <FormBtn  buttonName={buttonName} />
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default TagForm;
