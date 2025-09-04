import TabForProduct from "@/components/product/widgets/TabForProduct";
import Btn from "@/elements/buttons/Btn";
import AccountContext from "@/helper/accountContext";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Col, Row } from "reactstrap";
import SettingContext from "../../helper/settingContext";
import request from "../../utils/axiosUtils";
import { product } from "../../utils/axiosUtils/API";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import AllProductTabs from "./widgets/AllProductTabs";
import { ProductInitValues, ProductValidationSchema } from "./widgets/ProductObjects";
import ProductSubmitFunction from "./widgets/ProductSubmitFunction";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const ProductForm = ({ updateId, title, buttonName, saveButton, setSaveButton }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("1");
  const { state } = useContext(SettingContext);
  const { data: oldData, isLoading: oldDataLoading, refetch, status } = useCustomQuery([updateId], () => request({ url: `${product}/${updateId}` }, router), { refetchOnWindowFocus: false, enabled: false, select: (data) => data.data });
  useEffect(() => {
    if (updateId) {
      !saveButton && refetch();
    }
  }, [updateId]);
  const watchEvent = useCallback(
    (oldData, updateId) => {
      return ProductInitValues(oldData, updateId);
    },
    [oldData, updateId]
  );
  const { role, accountData } = useContext(AccountContext);

  if (updateId && oldDataLoading) return <Loader />;
  return (
    <Formik
      initialValues={{ ...watchEvent(oldData, updateId) }}
      validationSchema={YupObject({
        ...ProductValidationSchema,
        store_id: state?.isMultiVendor && role === "admin" && nameSchema,
      })}
      onSubmit={(values) => {
        if (updateId) {
          values["_method"] = "put";
        }
        ProductSubmitFunction(null, values, updateId);
        // setResetKey(true);
        router.push(`/product`);
        
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting, setErrors, setTouched }) => (
        <Form className="theme-form theme-form-2 mega-form vertical-tabs">
          <Row>
            <Col> 
              <Card>
                <div className="title-header option-title">
                  <h5>{t(title)}</h5>
                </div>
                <Row>
                  <Col xl="3" lg="4">
                    <TabForProduct values={values} activeTab={activeTab} setActiveTab={setActiveTab} errors={errors} touched={touched} />
                  </Col>
                  <AllProductTabs setErrors={setErrors} setTouched={setTouched} touched={touched} values={values} activeTab={activeTab} isSubmitting={isSubmitting} setFieldValue={setFieldValue} errors={errors} updateId={updateId} setActiveTab={setActiveTab} />
                  <div className="ms-auto justify-content-end dflex-wgap mt-sm-4 mt-2 save-back-button">
                    <Btn className="btn-outline" title="Back" onClick={() => router.back()} />
                    {updateId && <Btn className="btn-outline" type="submit" title={`save&Continue`} onClick={() => setSaveButton(true)} />}
                    <Btn className="btn-primary" type="submit" title={buttonName}  />
                  </div>
                </Row>  
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
