"use client";
import axios from "axios";
import ShowBox from "../../../../elements/alerts&Modals/ShowBox";
import { obscureEmail } from "../../../../utils/customFunctions/EmailFormats";
import LoginBoxWrapper from "../../../../utils/hoc/LoginBoxWrapper";
import NoSsr from "../../../../utils/hoc/NoSsr";
import useHandleForgotPassword from "../../../../utils/hooks/auth/useForgotPassword";
import useOtpVerification from "../../../../utils/hooks/auth/useOtpVerification";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "reactstrap";
import { useRouter } from "next/navigation";

const OtpVerification = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [showBoxMessage, setShowBoxMessage] = useState();
  //const cookies = Cookies.get("ue");
  const [cookies, setCookie] = useState('');
  const [seconds, setSeconds] = useState();
  const [otp, setOtp] = useState("");
  const { mutate: otpVerification } = useOtpVerification(setShowBoxMessage);
  const { mutate: forgotPassword } = useHandleForgotPassword(setShowBoxMessage);
  const handleChange = (e) => {
    if (e.target.value.length <= 6 && !isNaN(Number(e.target.value))) {
      setOtp(e.target.value);
    }
  };

  const verifyOtp = async () => {
    try {
      if (otp && otp.length === 6) {
        let res = await axios.get(`/api/auth/login?email=${cookies}&otp=${otp}&action=activateUser`, { withCredentials: true });
        console.log('............', res);
        if (res.status == 200) {
          alert(res.data.message);
          return router.push('/auth/login');
        }
      }

    } catch (err) {
      alert(err);
      console.log(err);
    }
  }

  useEffect(() => {
    setCookie(localStorage.getItem('email'));
  }, []);

  useEffect(() => {
    const otpTimer =
      Boolean(seconds) && setInterval(() => setSeconds(seconds - 1), 1000);
    return () => {
      clearInterval(otpTimer);
    };
  }, [seconds]);
  return (
    <>
      <div className="box-wrapper">
        <ShowBox showBoxMessage={showBoxMessage} />
        <LoginBoxWrapper>
          <div className="log-in-title">
            <h3 className="text-content">
              {t("PleasEnterTheOneTimePasswordToVerifyYourAccount")}
            </h3>
            <h5 className="text-content">
              {t("ACodeHasBeenSentTo") + " "}
              <span>
                <NoSsr>{obscureEmail(cookies)}</NoSsr>
              </span>
            </h5>
          </div>
          <div className="outer-otp">
            <div className="inner-otp">
              <Input
                type="text"
                maxLength="6"
                onChange={handleChange}
                value={otp}
              />
            </div>
          </div>
          <div className="AlignDivToCenter">
            <button className="otpBtn" onClick={verifyOtp}>Verify</button>
          </div>
          <div className="send-box pt-4">
            {seconds ? (
              <h5>
                {t("PleaseWait")}
                <a className="theme-color fw-bold">
                  {seconds} <NoSsr>{t("second(s)")}</NoSsr>3
                </a>
                {t("BeforeRequestingANewOneTimePassword(OTP)")}.
              </h5>
            ) : (
              <h5>
                {t("Didn'tGetTheOTP")}?
                <a
                  className="theme-color fw-bold"
                  onClick={() => {
                    forgotPassword({ email: cookies });
                    setSeconds(60);
                  }}
                >
                  {t("ResendIt")}
                </a>
              </h5>
            )}
          </div>
        </LoginBoxWrapper>
      </div>
    </>
  );
};
export default OtpVerification;
