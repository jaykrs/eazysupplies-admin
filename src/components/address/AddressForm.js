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
const AddressForm = ({ updateId, buttonName, model }) => {
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
                let res = await axios.get('/api/address?id=' + updateId);
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
                const res = await axios.put('/api/address', {
                    "id": Number(updateId),
                    "name": values.AddName,
                    "address": values.address,
                    "zipcode": values.zipcode,
                    "city": values.city
                }, { withCredentials: true });

                console.log('res.....', res);
                if (res.status == 200) {
                    alert('Address: ' + values.AddName + " updated successfully!");
                    router.push("/address");
                }

            } else {
                const res = await axios.post('/api/address', {
                    "name": values.AddName,
                    "address": values.address,
                    "zipcode": values.zipcode,
                    "city": values.city
                }, { withCredentials: true });

                if (res.status == 201) {
                    alert('Address: ' + values.AddName + " added successfully!");
                    router.push("/address");
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
                    AddName: Object.keys(data).length > 1 ? data?.name : "",
                    address: updateId ? data?.address || "" : "",
                    zipcode: updateId ? data?.zipcode || "" : "",
                    city: updateId ? data?.city || "" : "",
                }}
                validationSchema={YupObject({
                   // name: nameSchema,
                })}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <>
                        <Form id="blog" className="theme-form theme-form-2 mega-form">
                            <SimpleInputField nameList={[{ name: "AddName", placeholder: t("EnterName"), require: "true" }]} />
                            <SimpleInputField
                                nameList={[
                                    { name: "address", title: "Address", placeholder: t("enter address") },
                                    { name: "zipcode", title: "Zip Code", placeholder: t("enter zipcode") },
                                    { name: "city", title: "City", type: "text", rows: "3", placeholder: t("enter city name") },
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

export default AddressForm;
