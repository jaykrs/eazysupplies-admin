import { mediaConfig } from "@/data/MediaConfig";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormBtn from "../../elements/buttons/FormBtn";
import request from "../../utils/axiosUtils";
import { BrandAPI } from "../../utils/axiosUtils/API";
import { YupObject, emailSchema, nameSchema, numberSchema, phoneSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import CheckBoxField from "../inputFields/CheckBoxField";
import FileUploadField from "../inputFields/FileUploadField";
import SimpleInputField from "../inputFields/SimpleInputField";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import { formatString } from "../../lib/format-number";
import axios from "axios";
const DeliveryAgentForm = ({ updateId, buttonName, model }) => {
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
            let res = await axios.get('/api/deliveryAgent?id=' + updateId);
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
                const res = await axios.put('/api/deliveryAgent', {
                    "id": Number(updateId),
                    "name": values.name,
                    "email": values.email,
                    "description": values.description,
                    "phone": values.phone,
                    "pinCode": values.pinCode,
                    "address": values.pinCode,
                    "gstIn": values.gstIn,
                    "remarks": values.remarks,
                    "city": values.city
                }, { withCredentials: true });

                if (res.status == 200) {
                    alert('DeliveryAgent: ' + values.name + " updated successfully!");
                    router.push("/deliveryAgent");
                }
                setIsLoading(false);

            } else {
                let slugs = formatString(values.name);
                const res = await axios.post('/api/deliveryAgent', {
                    "name": values.name,
                    "email": values.email,
                    "description": values.description,
                    "phone": values.phone,
                    "pinCode": values.pinCode,
                    "address": values.pinCode,
                    "gstIn": values.gstIn,
                    "remarks": values.remarks,
                    "city": values.city
                }, { withCredentials: true });

                if (res.status == 201) {
                    alert('DeliveryAgent: ' + values.name + " added successfully!");
                     router.push("/deliveryAgent");
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
                    name: Object.keys(data).length > 1 ? data?.name : "",
                    email: Object.keys(data).length > 1 ? data?.email : "",
                    phone: Object.keys(data).length > 1 ? data?.phone : "",
                    address: Object.keys(data).length > 1 ? data?.address : "",
                    description: Object.keys(data).length > 1 ? data?.description : "",
                    city: Object.keys(data).length > 1 ? data?.city : "",
                    pinCode: Object.keys(data).length > 1 ? data?.pinCode : "",
                    gstIn: Object.keys(data).length > 1 ? data?.gstIn : "",
                    remarks: Object.keys(data).length > 1 ? data?.remarks : "",

                }}
                validationSchema={YupObject({
                    name: nameSchema,
                    email: emailSchema,
                    phone: phoneSchema,
                    address: nameSchema,
                    pinCode: numberSchema,
                    city: nameSchema,
                    gstIn: nameSchema
                })}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <>
                        <Form id="blog" className="theme-form theme-form-2 mega-form">
                            <SimpleInputField nameList={[{ name: "name", placeholder: t("EnterName"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "email", type: "email", placeholder: t("EnterEmail"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "phone", placeholder: t("EnterPhoneNo."), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "description", rows: 10, type: "textarea", placeholder: t("EnterDescription"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "address", placeholder: t("EnterAddress"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "city", placeholder: t("EnterCity"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "pinCode", placeholder: t("EnterPinCode"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "gstIn", placeholder: t("EnterGSTIn"), require: "true" }]} />
                            <SimpleInputField nameList={[{ name: "remarks", rows: 5, type: "textarea", placeholder: t("EnterRemarks"), require: "true" }]} />
                            <FormBtn buttonName={buttonName} />
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};

export default DeliveryAgentForm;
