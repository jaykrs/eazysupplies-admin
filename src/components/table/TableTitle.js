import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import Btn from "../../elements/buttons/Btn";
import Pluralize from "../../utils/customFunctions/Pluralize";
import NoSsr from "../../utils/hoc/NoSsr";
import usePermissionCheck from "../../utils/hooks/usePermissionCheck";
import ImportExport from "./ImportExport";
import ShowModal from "@/elements/alerts&Modals/Modal";
import { useState } from "react";
import { RiQuestionLine } from "react-icons/ri";
import CreateNewBrand from '@/app/(mainLayout)/brand/create/createNewBrand';
import CreateNewCategory from '@/app/(mainLayout)/category/create/createNewCategory';
import CreateNewTag from '@/app/(mainLayout)/tag/create/createNewTag';

const TableTitle = ({ fullObj, moduleName, onlyTitle, type, filterHeader, importExport, refetch, exportButton, showFilterDifferentPlace }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const [create] = usePermissionCheck(["create"]);
  const [model, setModal] = useState(false);
  return (
    <div className="title-header option-title">
      <h5>{filterHeader?.customTitle ? t(filterHeader?.customTitle) : t(Pluralize(moduleName))}</h5>
      {importExport && <ImportExport importExport={importExport} moduleName={Pluralize(moduleName)} refetch={refetch} exportButton={exportButton} />}
      <NoSsr>
        {/* {filterHeader?.customFilter && !showFilterDifferentPlace && filterHeader?.customFilter}
        {(
          <Btn className="align-items-center btn-theme add-button" title={t("Add") + " " + t(moduleName)} onClick={() => (type == "post" && moduleName.toLowerCase() == "tag" ? router.push(`/${pathname.split("/")[1]}/tag/create`) : moduleName.toLowerCase() == "Brand"? router.push(`/${pathname.split("/")[1]}/brand/create`) :  type == "post" ? router.push(`/${pathname.split("/")[1]}/category/create`) : router.push(`/${pathname.split("/")[1]}/create`))}
          >
            <FiPlus />
          </Btn>
        )} */}
        {/* <Btn className="align-items-center btn-theme add-button" title={t("Add") + " " + t(moduleName)} onClick={() => setModal(true)}> <FiPlus /></Btn> */}
      </NoSsr>
      
    </div>
  );
};

export default TableTitle;
