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
    try {
      if (email === "" || password === "") {
        return alert("email or password is missing!");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return alert('enter valid email');
      }
      const res = await axios.post('/api/auth/login', {
        email: email,
        password: password
      }, { withCredentials: true });
      if (res.status == 200) {
        alert('login success!');
        router.push('/dashboard');
      } else {
        alert("login failed!");
      }
    } catch (err) {
      console.log(err);
      if (err.status == 401 && err.response.data.error == "User is not active") {
        alert("your account is inactive, please verify to proceed!");
        localStorage.setItem('email', email);
        router.push(`/auth/otp-verification`);
      } else if (err.status == 401) {
        alert(err.response.data.error);
      }
      else {
        alert(err);
      }

    }
  }

  return (
    <div className="box-wrapper">
      <ShowBox showBoxMessage={showBoxMessage} />
      <LoginBoxWrapper>
        <div className="log-in-title text-center">
          <Image className="for-white" src={state?.setDarkLogo?.original_url ? state?.setDarkLogo?.original_url : "/assets/images/logo.png"} alt="Light Logo" width={140} height={28} priority />
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
                    <h4>{"Don't Have Seller Account?"}</h4>
                    <Link href={`/auth/register`}>{"Sign Up"}</Link>
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
