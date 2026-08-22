"use client";
import { ReactstrapInput } from "../../../../components/reactstrapFormik";
import ShowBox from "../../../../elements/alerts&Modals/ShowBox";
import Btn from "../../../../elements/buttons/Btn";
import SettingContext from "../../../../helper/settingContext";
import LoginBoxWrapper from "../../../../utils/hoc/LoginBoxWrapper";
import { YupObject, emailSchema, nameSchema } from "../../../../utils/validation/ValidationSchemas";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const [showBoxMessage, setShowBoxMessage] = useState();
  const { settingObj, state } = useContext(SettingContext);
  const { t } = useTranslation("common");
  const reCaptchaRef = useRef();
  const router = useRouter();

  const handleLogin = async (email, password) => {
    setShowBoxMessage();
    try {
      if (email === "" || password === "") {
        setShowBoxMessage("Email and password are required.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setShowBoxMessage("Enter a valid email address.");
        return;
      }
      const res = await axios.post('/api/auth/login_auth', {
        email: email,
        password: password
      }, { withCredentials: true });
      if (res.status == 200) {
        router.push('/dashboard');
      } else {
        setShowBoxMessage("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.error || err?.response?.data?.message;
      if (status === 401 && serverMessage === "User is not active") {
        setShowBoxMessage("Your account is inactive. Complete verification to continue.");
        localStorage.setItem('email', email);
        router.push(`/auth/otp-verification`);
      } else if (status === 401) {
        setShowBoxMessage(serverMessage || "The email or password is incorrect.");
      } else {
        setShowBoxMessage(serverMessage || "The server could not complete the login. Please try again.");
      }
    }
  }

  return (
    <div className="box-wrapper">
      <ShowBox showBoxMessage={showBoxMessage} />
      <LoginBoxWrapper>
        <div className="log-in-title text-center">
          <Image className="for-white" src={state?.setDarkLogo?.original_url ? state?.setDarkLogo?.original_url : "/assets/images/logo.png"} alt="Earthling Logo" width={140} height={58} priority />
          <h4>{t("LogInYourAccount")}</h4>
        </div>
        <div className="input-box">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={YupObject({
              email: emailSchema,
              password: nameSchema,
              // recaptcha: settingObj?.google_reCaptcha?.status ? recaptchaSchema : "",
            })}
            onSubmit={(values) => {
              handleLogin(values.email, values.password);
            }}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form className="row g-4">
                <Col sm="12">
                  <Field inputprops={{ noExtraSpace: true }} autoComplete={true} name="email" type="email" component={ReactstrapInput} className="form-control" id="email" placeholder="Email Address" label="EmailAddress" />
                </Col>
                <Col sm="12">
                  <Field inputprops={{ noExtraSpace: true }} name="password" component={ReactstrapInput} type="password" className="form-control" id="password" placeholder="Password" label="Password" />
                </Col>
                {settingObj?.google_reCaptcha?.status && (
                  <Col sm="12">
                    <ReCAPTCHA
                      ref={reCaptchaRef}
                      sitekey={settingObj?.google_reCaptcha?.site_key}
                      onChange={(value) => {
                        setFieldValue("recaptcha", value);
                      }}
                    />
                    {errors.recaptcha && touched.recaptcha && <ErrorMessage name="recaptcha" render={(msg) => <div className="invalid-feedback d-block">{errors.recaptcha}</div>} />}
                  </Col>
                )}
                <Col sm="12">
                  <div className="forgot-box">
                    <Link href={`/auth/forgot-password`} className="forgot-password">
                      {t("ForgotPassword")}?
                    </Link>
                  </div>
                </Col>
                <Col sm="12">
                  <Btn title="Login" className="btn btn-animation w-100 justify-content-center" type="submit" color="false" />
                  <div className="sign-up-box">
                    {/* <h4>{"Need Support for Account?"}</h4> */}
                    {/* <Link href={`/auth/register`}>{"Support"}</Link> */}
                  </div>
                </Col>
              </Form>
            )}
          </Formik>
        </div>
      </LoginBoxWrapper>
    </div>
  );
};

export default Login;
