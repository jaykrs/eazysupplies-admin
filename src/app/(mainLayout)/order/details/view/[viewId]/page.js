"use client";
import OrderViewWithId from "@/components/orders/orderViewWithId";
import { useParams } from "next/navigation";

const OrderDetails = () => {
  const params = useParams();
  return params?.viewId && <OrderViewWithId id={params?.viewId} />;
};

export default OrderDetails;
