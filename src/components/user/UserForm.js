import { Form, Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import FormBtn from "../../elements/buttons/FormBtn";
import { nameSchema, descriptionSchema, YupObject, emailSchema, passwordSchema, phoneSchema, roleIdSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import SimpleInputField from "../inputFields/SimpleInputField";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import axios from "axios";
import UserContact from "../auth/UserContact";
import SearchableSelectInput from "../inputFields/SearchableSelectInput";
import { AllCountryCode } from "@/data/AllCountryCode";
import UserPersonalInfo from "@/components/auth/UserPersonalInfo";
import Btn from "@/elements/buttons/Btn";
import { Link } from "react-feather";

const UserForm = ({ updateId, buttonName, type, title }) => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const [stateData, setStateData] = useState({});
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, [])
  useEffect(() => {
    if (updateId) {
      loadProductData();
    }
  }, [updateId]);

  const loadProductData = async () => {
    setIsLoading(true);
    const response = await axios.get('/api/auth/user_auth?userId=' + updateId);
    if (response.status == 200) {
      setStateData(response?.data?.data);
    }
    setIsLoading(false);
  }
  const fetchRoles = async () => {
    const roles = await axios.get('/api/role');
    if (roles.status == 200) {
      let data = roles?.data?.data?.map(item => ({ id: item.name, name: item.name }));
      setRoles(data);
    }
  }

  if (updateId && isLoading) return <Loader />;
  const handleSubmit = async (values) => {
    try {
      console.log("uid",updateId);
      if (updateId) {
        const res = await axios.put('/api/auth/user_auth', {
          "id" : Number(updateId),
          "gstn" : values.gstn,
          "name": values.name,
          "email" : values.email,
          "phone": values.phone.toString(),
          "role": values.role
        }, { withCredentials: true });

        if (res.status == 200) {
          alert('user: ' + values.name + " updated successfully!");
          router.push("/user");
        }
      } else {
        if(!values.password && values.password?.length > 8) alert('Password is empty or less than 8 Character'); 
        const res = await axios.post('/api/auth/user_auth', {
          "name": values.name,
          "email": values.email,
          "password": values.password,
          "gstn": values.gstn,
          "phone": values.phone.toString(),
          "countryCode" : "91",
          "role": values.role
        }, { withCredentials: true });

        if (res.status == 201) {
          alert('user: ' + values.name + " added successfully!");
          router.push("/user");
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
                email: Object.keys(stateData).length > 0 ? stateData?.email : "",
                gstn: Object.keys(stateData).length > 0 ? stateData?.gstn : "",
                phone: Object.keys(stateData).length > 0 ? stateData?.phone : "",
                role: Object.keys(stateData).length > 0 ? stateData?.role?.name : ""

              }}
              validationSchema={YupObject({
                name: nameSchema,
                email: emailSchema,
                phone: phoneSchema,
                role: nameSchema,
                gstn: nameSchema
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
                          placeholder: t("Enter Name"),
                          require: "true",
                        },
                        {
                          name: "email",
                          title: "Email",
                          placeholder: t("Enter email"),
                          require: "true"
                        },
                         {
                           name: "gstn",
                           title: "Gstn",
                           placeholder: t("Enter Gstn"),
                           require: "true"
                         },
                      ]}
                    />
                    <Row>
                      <Col sm="3" className="">Phone</Col>
                      {/* <Col sm="3">
                        <SearchableSelectInput
                          nameList={[
                            {
                              name: "country_code",
                              notitle: "true",
                              inputprops: {
                                name: "country_code",
                                id: "country_code",
                                options: AllCountryCode,
                              },
                            },
                          ]}
                        />
                      </Col> */}
                      <Col sm="6">
                        <SimpleInputField nameList={[{ name: "phone", type: "number", placeholder: "EnterPhoneNumber", require: "true", nolabel: "true", }]} />
                      </Col>
                    </Row>
                      {!updateId &&  <Row><Col sm="3" className="">Password</Col> 
                      <Col sm="6">
                        <SimpleInputField nameList={[{ name: "password", type: "password", placeholder: "Enter Password", require: "true", nolabel: "true", }]} />
                      </Col></Row>
                      }
                    <SearchableSelectInput
                      nameList={[
                        {
                          name: "role",
                          title: "Role",
                          inputprops: {
                            name: "role",
                            id: "role",
                            options: roles ? roles : [],
                          },
                        },
                      ]}
                    />

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
export default UserForm;

