import TableWrapper from "../../utils/hoc/TableWrapper";
import usePermissionCheck from "../../utils/hooks/usePermissionCheck";
import ShowDeliveryAgentTable from "../table/ShowDeliveryAgentTable";

const AllDeliveryAgent = ({ data, ...props }) => {
  const [edit, destroy] = usePermissionCheck(["edit", "destroy"]);
  const headerObj = {
    checkBox: true,
    isSerialNo: false,
    isOption: edit == false && destroy == false ? false : true,
    noEdit: edit ? false : true,
    optionHead: { title: "Action" },
    column: [
      { title: "S.N.", apiKey: "sn", sorting: true },
      { title: "Name", apiKey: "name", sorting: true, sortBy: "desc" },
      { title: "Email", apiKey: "email", sorting: true, sortBy: "desc" },
      { title: "Phone", apiKey: "phone", sorting: true, sortBy: "desc" },
      { title: "GstIn", apiKey: "gstIn", sorting: true, sortBy: "desc" },
      { title: "City", apiKey: "city", sorting: true, sortBy: "desc" },
      { title: "PinCode", apiKey: "pinCode", sorting: true, sortBy: "desc" },
    ],
    data: data || []
  };
  if (!data) return null;
  return <>
    <ShowDeliveryAgentTable {...props} headerData={headerObj} />
  </>
};

export default TableWrapper(AllDeliveryAgent);
