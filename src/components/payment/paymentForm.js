import { mediaConfig } from "@/data/MediaConfig";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormBtn from "../../elements/buttons/FormBtn";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import SimpleInputField from "../inputFields/SimpleInputField";
import { formatString } from "../../lib/format-number";
import axios from "axios";
const PaymentForm = ({ updateId, buttonName, model }) => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchDetails();
    }, [updateId]);

    const fetchDetails = async () => {
        try {
            if (updateId) {
                setIsLoading(true);
                let res = await axios.get('/api/payments?paymentId=' + updateId);
                if (res.status == 200) {
                    setData(res.data.data);
                }
                setIsLoading(false);
            }
        } catch (err) {
            alert('something went wrong');
        }
    }
    if (updateId && isLoading) return <Loader />;

    const handleSubmit = async (values) => {
        try {
            setIsLoading(true);
            if (buttonName == "Update") {
                const res = await axios.put('/api/payment?paymentId=' + updateId, {
                    "name": values.name,
                }, { withCredentials: true });

                if (res.status == 200) {
                    alert('Payment: ' + values.name + " updated successfully!");
                    // router.push("/brand");
                }

            } else {
                let slugs = formatString(values.name);
                const res = await axios.post('/api/payment', {
                    "name": values.name,
                    "slug": slugs
                    // "description": values.description,
                }, { withCredentials: true });

                if (res.status == 201) {
                    alert('Payment: ' + values.name + " added successfully!");
                    // router.push("/brand");
                }
            }
            setIsLoading(false);
        } catch (err) {
            alert('something went wrong');
        }
    }
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    method: Object.keys(data).length > 1 ? data?.method : "",
                    amount: updateId ? Number(data?.amount) || 0 : 0,
                    transactionid: updateId ? data?.transactionid || "" : "",
                    order: updateId ? data?.order?.status || "" : "",
                }}
                validationSchema={YupObject({
                  //  name: nameSchema,
                })}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <>
                        <Form id="blog" className="theme-form theme-form-2 mega-form">
                            <SimpleInputField nameList={[{ name: "method", placeholder: t("EnterMethod"), require: "true" }]} />
                            <SimpleInputField
                                nameList={[
                                    { name: "amount", title: "Amount", placeholder: t("enter amount") },
                                    { name: "transactionid", title: "Transaction Id", placeholder: t("enter transaction Id") },
                                    { name: "order", title: "Order Status", type: "text", rows: "3", placeholder: t("") },
                                ]}
                            />
                            {/* <CheckBoxField name="status" /> */}
                            <FormBtn buttonName={buttonName} />
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};

export default PaymentForm;
