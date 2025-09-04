import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import SettingContext from "../../../helper/settingContext";

const Logo = () => {
  const { state, settingObj } = useContext(SettingContext);
  return (
    <Link href="/dashboard">
      {state?.setLightLogo?.original_url ? <Image className="for-white" src={`${state?.setLightLogo?.original_url || null}`} alt="Light Logo" width={1300} height={500} priority /> : <h2 className="text-white">{settingObj?.general?.site_name || 'Logo Here'}</h2>}
    </Link>
  );
};

export default Logo;
