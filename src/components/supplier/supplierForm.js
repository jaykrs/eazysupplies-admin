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

const SupplierForm = ({ updateId, type, buttonName }) => {
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
            let res = await axios.get('/api/supplier?supplierId=' + updateId);
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
                const res = await axios.put('/api/supplier', {
                    "name": values.name,
                    "phone": values.phone,
                    "description": values.description,
                    "gstIn": values.gstIn,
                    "pinCode": values.pinCode,
                    "city": values.city,
                    "address": values.address,
                    "remarks": values.remarks,
                    "id": Number(updateId)
                }, { withCredentials: true });
                if (res.status == 200) {
                    alert('Supplier: ' + values.name + " updated successfully!");
                    router.push("/supplier");
                }

            } else {
                const res = await axios.post('/api/supplier', {
                    "name": values.name,
                    "phone": values.phone,
                    "description": values.description,
                    "gstIn": values.gstIn,
                    "pinCode": values.pinCode,
                    "city": values.city,
                    "address": values.address,
                    "remarks": values.remarks
                }, { withCredentials: true });

                if (res.status == 201) {
                    alert('Supplier: ' + values.name + " added successfully!");
                    router.push("/supplier");
                }
            }
            setIsLoading(false);
        } catch (err) {
            alert(err.response.data.error);
            setIsLoading(false);
        }
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: Object.keys(data).length > 0 ? data?.name : "",
                description: Object.keys(data).length > 0 ? data?.description : "",
                phone: Object.keys(data).length > 0 ? data?.phone : "",
                gstIn: Object.keys(data).length > 0 ? data?.gstIn : "",
                pinCode: Object.keys(data).length > 0 ? data?.pinCode : "",
                city: Object.keys(data).length > 0 ? data?.city : "",
                address: Object.keys(data).length > 0 ? data?.address : "",
                remarks: Object.keys(data).length > 0 ? data?.remarks : "",
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
                                { name: "name", placeholder: t("Enter Tax Name"), require: "true" },
                                { name: "phone", title: "Phone", placeholder: t("Enter Phone Number"), require: "true", type: "string" },
                                { name: "description", type: "textarea", title: "Description", placeholder: t("EnterDescription") },
                                { name: "gstIn", title: "GstIn", placeholder: t("Enter GstIn"), require: "true", type: "string" },
                                { name: "pinCode", title: "PinCode", placeholder: t("Enter PinCode"), require: "true", type: "string" },
                                { name: "city", type: "string", title: "City", placeholder: t("Enter City") },
                                { name: "address", type: "string", title: "Address", placeholder: t("Enter Address") },
                                { name: "remarks", type: "textarea", title: "Remarks", placeholder: t("Enter Remarks") }
                            ]}
                        />
                        <FormBtn buttonName={buttonName} />
                    </Row>
                </Form>
            )}
        </Formik>
    );
};

export default SupplierForm;
