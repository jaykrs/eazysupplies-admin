import request from "@/utils/axiosUtils";
import { NoticeRecent } from "@/utils/axiosUtils/API";
import NoticeDashBoard from "./NoticeDashBoard";
import ProductStockReportTable from "./productStockReport/ProductStockReportTable";
import RecentOrderTable from "./recentOrders/RecentOrderTable";
import RevenueAndTopVendor from "./Revenue&TopVendor";
import TopDashSection from "./TopDashSection";
import { useRouter } from "next/navigation";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const MainDashboard = () => {
  const router = useRouter()   

  const { data, refetch } = useCustomQuery([NoticeRecent],() =>  !isAdmin ?  request({ url: NoticeRecent },router) :Promise.resolve() ,{
      refetchOnWindowFocus: false,
      enabled: true,
      select: (data) => data?.data,
    }
  );
  return (
    <>
      {data?.is_read === 0 && <NoticeDashBoard data={data} refetch={refetch} />}
      <TopDashSection   />
      <section>
        <RevenueAndTopVendor  />
        <RecentOrderTable />
        <ProductStockReportTable  />
      </section>
    </>
  );
};

export default MainDashboard;
