import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import FormBtn from "../../elements/buttons/FormBtn";
import { nameSchema, descriptionSchema, YupObject } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import SimpleInputField from "../inputFields/SimpleInputField";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";

const RoleForm = ({ updateId, buttonName, type,title }) => {
    const { t } = useTranslation("common");
    const [isLoading, setIsLoading] = useState(false);
    const [stateData, setStateData] = useState({});
    const router = useRouter();

    useEffect(() => {
        if (updateId) {
            loadProductData();
        }
    }, [updateId]);

    const loadProductData = async () => {
        setIsLoading(true);
        const product = await axios.get('/api/role?roleId=' + updateId);
        if (product.status == 200) {
            setStateData(product?.data?.data);
        }
        setIsLoading(false);
    }

    if (updateId && isLoading) return <Loader />;
    const handleSubmit = async (values) => {
        try {

            if (updateId) {
                const res = await axios.put('/api/role', {
                    "permission": values.permission
                }, { withCredentials: true });

                if (res.status == 200) {
                    alert('role: ' + values.name + " updated successfully!");
                    router.push("/role");
                }
            } else {
                const res = await axios.post('/api/role', {
                    "name": values.name,
                    "permission": values.permission
                }, { withCredentials: true });

                if (res.status == 201) {
                    alert('role: ' + values.name + " added successfully!");
                    router.push("/role");
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
                            <h5>{t(title)}</h5>
                        </div>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                name: Object.keys(stateData).length > 0 ? stateData?.name : "",
                                description: Object.keys(stateData).length > 0 ? stateData?.description : ""

                            }}
                            validationSchema={YupObject({
                                name: nameSchema,

                            })}
                            onSubmit={(values, helpers) => {
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
                                                    placeholder: t("Enter role Name"),
                                                    require: "true",
                                                }
                                            ]}
                                        />
                                        <SimpleInputField nameList={[{ name: "permission", title: "permission", placeholder: t("Enter permission"), type: "number", require: "true", }]} />

                                        <FormBtn loading={isLoading} buttonName={buttonName} />
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
export default RoleForm;
