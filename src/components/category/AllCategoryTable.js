import TableWrapper from "../../utils/hoc/TableWrapper";
import usePermissionCheck from "../../utils/hooks/usePermissionCheck";
import { title } from "process";
import ShowTableCategory from "../table/ShowCategoryTable";

const AllCategoryTable = ({ data, ...props }) => {
  const [edit, destroy] = usePermissionCheck(["edit", "destroy"]);
  const headerObj = {
    checkBox: true,
    isSerialNo: false,
    isOption: edit == false && destroy == false ? false : true,
    noEdit: edit ? false : true,
    optionHead: { title: "Action" },
    column: [
      // { title: "Id", apiKey: "id", sorting: true },
      { title: "Name", apiKey: "name", sorting: true, sortBy: "desc" },
      // { title: "CreateAt", apiKey: "createdAt", sorting: true, sortBy: "desc", type: "date" }
    ],
    data: data || []
  };
  if (!data) return null;
  return <>
    <ShowTableCategory {...props} headerData={headerObj} />
  </>
};

export default TableWrapper(AllCategoryTable);
