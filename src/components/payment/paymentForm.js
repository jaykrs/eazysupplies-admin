import { mediaConfig } from "@/data/MediaConfig";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormBtn from "../../elements/buttons/FormBtn";
import { YupObject, nameSchema, numberSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import SimpleInputField from "../inputFields/SimpleInputField";
import { formatString } from "../../lib/format-number";
import axios from "axios";
import SearchableSelectInput from "../inputFields/SearchableSelectInput";
import { PaymentMethod } from "../../utils/constants";
import { useSearchParams } from "next/navigation";
const PaymentForm = ({ updateId, buttonName, model }) => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get('id');
    const status = params.get("status");
    const amt = params.get("amt");
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
                    "orderId": Number(values.order),
                    "amount": Number(values.amount),
                    "method": values.method,
                    "transectionid": values.transectionid
                }, { withCredentials: true });

                if (res.status == 200) {
                    alert('Payment: ' + values.name + " updated successfully!");
                    router.push("/payment");
                }

            } else {
                if (status.toUpperCase() == "APPROVED") {
                    let orderDetails = await axios.get('/api/orders/' + Number(id), { withCredentials: true });
                    if (orderDetails.status != 200) {
                        alert('orders not found with orderId: ' + id);
                    }
                    if (orderDetails?.data?.payment) {
                        const res = await axios.put('/api/payments', {
                            "id": Number(orderDetails?.data?.payment?.id),
                            "orderId": Number(values.order),
                            "amount": Number(values.amount),
                            "method": values.method,
                            "transactionid": values.transactionid,
                            "status": "SUCCESS"
                        }, { withCredentials: true });

                        if (res.status == 200) {
                            const orders = await axios.put('/api/orders/filter?id=' + Number(values.order), {
                                "status": "PAID",
                            }, { withCredentials: true });
                            if (orders.status == 200) {
                                alert('Payment: ' + values.amount + " added successfully!");
                                router.push("/payment");
                            }
                        }
                    }
                } else {
                    alert('Order: ' + id + " is not apprnameoved yet, please approve order to add payment details!");
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
                    amount: updateId ? Number(data?.amount) || 0 : Number(amt) > 0 ? Number(amt) : 0,
                    transactionid: updateId ? data?.transactionid || "" : "",
                    order: updateId ? Number(data?.order?.id) || 0 : Number(id) > 0 ? Number(id) : 0,
                }}
                validationSchema={YupObject({
                    method: nameSchema,
                    amount: numberSchema,
                    order: numberSchema,
                   // transactionid: nameSchema
                })}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <>
                        <Form id="blog" className="theme-form theme-form-2 mega-form">
                            <SearchableSelectInput
                                nameList={[
                                    {
                                        name: "method",
                                        title: "Method",
                                        require: "true",
                                        inputprops: {
                                            name: "method",
                                            id: "method",
                                            options: PaymentMethod.length > 0 ? PaymentMethod : [],
                                            close: false,
                                            isMulti: false
                                        },
                                    },
                                ]}
                            />
                            <SimpleInputField
                                nameList={[
                                    { name: "amount", title: "Amount", type: "number", placeholder: t("enter amount"), disabled: "true" },
                                    { name: "transactionid", title: "Transaction Id", placeholder: t("enter transaction Id") },
                                    { name: "order", title: "Order Id", type: "number", rows: "3", placeholder: t(""), disabled: "true" },
                                ]}
                            />

                            <FormBtn buttonName={buttonName} />
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};

export default PaymentForm;
