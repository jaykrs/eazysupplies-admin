import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import FormBtn from "../../elements/buttons/FormBtn";
import { nameSchema, descriptionSchema, YupObject, numberSchema, roleIdSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import SearchableSelectInput from "../inputFields/SearchableSelectInput";
import SimpleInputField from "../inputFields/SimpleInputField";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const NotificationForm = ({ data, buttonName }) => {
    const { t } = useTranslation("common");
    const router = useRouter();
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
                                name: data?.name,
                                type: data?.type,
                                recipient: data?.recepient,
                                remarks: data?.remarks
                            }}
                            validationSchema={YupObject({
                            })}
                            onSubmit={(values, helpers) => {
                                router.push(`/notifications`);
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
                                                    disabled: "true"
                                                },
                                                {
                                                    name: "type",
                                                    placeholder: t("Enter Product type"),
                                                    require: "true",
                                                    disabled: "true"
                                                },
                                                {
                                                    name: "recipient",
                                                    placeholder: t("Enter Product recipient"),
                                                    require: "true",
                                                    disabled: "true"
                                                },
                                                {
                                                    name: "remarks",
                                                    placeholder: t("Enter Product remarks"),
                                                    require: "true",
                                                    disabled: "true"
                                                },
                                            ]}
                                        />

                                        <FormBtn buttonName={buttonName} />
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
export default NotificationForm;
