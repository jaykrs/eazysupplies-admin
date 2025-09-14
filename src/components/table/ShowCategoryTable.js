import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDownSFill, RiArrowUpSFill, RiLock2Line } from "react-icons/ri";
import { Rating } from "react-simple-star-rating";
import { Input, Table } from "reactstrap";
import SettingContext from "../../helper/settingContext";
import { dateFormat, dateWithOnlyMonth } from "../../utils/customFunctions/DateFormat";
import usePermissionCheck from "../../utils/hooks/usePermissionCheck";
import Avatar from "../commonComponent/Avatar";
import NoDataFound from "../commonComponent/NoDataFound";
import Options from "./Options";
import Status from "./Status";
import TableLoader from "./TableLoader";

const ShowTableCategory = ({ current_page, per_page, mutate, isCheck, setIsCheck, url, sortBy, setSortBy, headerData, fetchStatus, moduleName, type, redirectLink, refetch, keyInPermission, link }) => {
  const { t } = useTranslation("common");
  const { convertCurrency } = useContext(SettingContext);
  const [edit] = usePermissionCheck(["edit", "destroy"]);
  const [colSpan, setColSpan] = useState();
  const router = useRouter();
  //  const originalDataLength = headerData?.data?.data?.filter((elem) => elem.system_reserve == "1").length;
  const originalDataLength = headerData?.data?.data?.length;
  /* Select All Data */
  const handleChange = (result) => {
    if (isCheck?.includes(result.id)) {
      let removeValue = [...isCheck];
      removeValue.splice(removeValue.indexOf(result.id), 1);
      setIsCheck(removeValue);
    } else setIsCheck([...isCheck, result.id]);
  };
  /* Sorting Data */
  const handleSort = (title) => {
    setSortBy({ ...sortBy, field: title, sort: `${sortBy.sort == "asc" ? "desc" : "asc"}` });
  };
  // Calculation For Row Head
  const countColSpan = () => {
    let totalColumn = headerData?.column?.length || 0;
    let isSerialNo = headerData.isSerialNo !== false ? 1 : 0;
    let isCheckbox = headerData?.checkBox ? 1 : 0;
    let isOption = headerData?.isOption ? 1 : 0;
    setColSpan(totalColumn + isSerialNo + isCheckbox + isOption);
  };
  // On mount calling the function
  useEffect(() => {
    countColSpan();
  }, []);
  // Clicking on Row data
  const isHandelEdit = (e, tableData, headerData) => {
    e.preventDefault();
    if (!headerData.noEdit) {
      if (headerData?.optionHead?.type == "View") {
        redirectLink ? redirectLink(tableData) : "";
      } else if (tableData.system_reserve !== "1" && headerData?.isOption) {
        tableData?.id && router.push(`/${link ? link.toLowerCase() : moduleName.toLowerCase()}/edit/${tableData.id}`);
      }
    }
  };
  // Getting Sub-objects data
  const getSubKeysData = (mainData, subKey) => {
    if (typeof mainData === "object" && subKey.length > 0) {
      const [key, ...remainingSubKey] = subKey;
      return getSubKeysData(mainData?.[key], remainingSubKey);
    } else {
      return mainData;
    }
  };

  const handleEdit = (tableData) => {
     if(isCheck.length> 0){
      router.push('/category/edit/' + tableData?.id);
     }
  }
  return (
    <Table id="table_id" className={`role-table ${headerData?.noCustomClass ? "" : "refund-table"} all-package theme-table datatable-wrapper`}>
      <TableLoader fetchStatus={fetchStatus} />
      <thead>
        <tr>
          <>
            {headerData?.checkBox && (
              <th className="sm-width">
                <Input
                  className="custom-control-input checkbox_animated"
                  type={"checkbox"}
                  checked={headerData?.data?.data?.length > 0 && isCheck?.length == headerData?.data?.data?.length}
                  disabled={originalDataLength == headerData?.data?.data?.length ? true : false}
                  onChange={(e) => {
                    e.target.checked ? setIsCheck([...headerData?.data?.data?.map((item) => item.id)]) : setIsCheck([]);
                  }}
                />
              </th>
            )}
            {headerData.isSerialNo !== false && <th className="sm-width">{t("No")}</th>}
            {/* Table Heading */}
            {headerData?.column.map((elem, i) => (
              <th key={i} className={` ${elem?.type === "image" ? "sm-width" : ""} ${elem.class ? elem.class : ""}`} onClick={() => (elem.sorting ? handleSort(elem.apiKey) : false)}>
                {t(elem.title)}
                {elem.sorting ? <div className="filter-arrow">{sortBy?.field == elem.apiKey && sortBy.sort == "desc" ? <RiArrowDownSFill /> : <RiArrowUpSFill />}</div> : ""}
              </th>
            ))}
            {headerData?.isOption && <th>{t(headerData?.optionHead?.title)}</th>}
          </>
        </tr>
      </thead>
      <tbody>
        {headerData?.data?.data?.length > 0 ? (
          headerData?.data?.data?.map((tableData, index) => (
            <tr key={index}>
              {headerData?.checkBox && (
                <td className="sm-width">
                  <Input className="custom-control-input checkbox_animated" checked={headerData?.data?.data?.[index]?.system_reserve !== "1" && isCheck?.includes(tableData?.id)} disabled={headerData?.data?.data?.[index]?.system_reserve == "1" ? true : false} onChange={(e) => handleChange(tableData)} type={"checkbox"} />
                </td>
              )}
              {headerData.isSerialNo !== false && (
                <td className="sm-width" onClick={(e) => isHandelEdit(e, headerData, tableData)}>
                  {index + 1 + (current_page - 1) * per_page}
                </td>
              )}
              <>
                <td>{tableData?.name}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button onClick={() => handleEdit(tableData)}  style={{padding:"4px 6px", fontSize:"12px"}} className="btn btn-warning">Edit</button>
                    <button onClick={() => handleDelete(tableData)} style={{padding:"4px 6px", fontSize:"12px"}} className="btn btn-danger">Delete</button>
                  </div>
                </td>
              </>
              {headerData?.isOption && <td>{headerData?.data?.data?.[index]?.system_reserve == "1" ? <RiLock2Line /> : <Options fullObj={tableData} mutate={mutate} moduleName={moduleName} type={type} optionPermission={headerData} refetch={refetch} keyInPermission={keyInPermission} />}</td>}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={colSpan}>
              <NoDataFound noImage={true} />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ShowTableCategory;
