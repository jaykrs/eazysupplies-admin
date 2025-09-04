import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { tax } from "../../utils/axiosUtils/API";
import { YupObject, nameSchema, roleIdSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import SimpleInputField from "../inputFields/SimpleInputField";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const TaxForm = ({ updateId, buttonName }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { data: oldData, isLoading, refetch } = useCustomQuery([updateId], () => request({ url: tax + "/" + updateId }, router), { refetchOnMount: false, enabled: false });
  useEffect(() => {
    updateId && refetch();
  }, [updateId]);
  if (updateId && isLoading) return <Loader />;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: updateId ? oldData?.data?.name || "" : "",
        rate: updateId ? oldData?.data?.rate || "" : "",
        status: updateId ? Boolean(Number(oldData?.data?.status)) : true,
      }}
      validationSchema={YupObject({
        name: nameSchema,
        rate: roleIdSchema,
      })}
      onSubmit={(values) => {
        router.push("/tax");
        // Put your logic here
      }}
    >
      {({ values }) => (
        <Form className="theme-form theme-form-2 mega-form">
          <SimpleInputField
            nameList={[
              { name: "name", placeholder: t("EnterTaxTitle"), require: "true" },
              { name: "rate", type: "number", placeholder: t("EnterRate"), require: "true", inputaddon: "true", postprefix: "%", min: "0", max: "100" },
            ]}
          />
          <CheckBoxField name="status" />
          <FormBtn buttonName={buttonName} />
        </Form>
      )}
    </Formik>
  );
};

export default TaxForm;
