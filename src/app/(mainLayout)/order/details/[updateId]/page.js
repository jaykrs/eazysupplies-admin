"use client";
import OrdersView from "@/components/orders/OrdersView";
import { useParams } from "next/navigation";

const OrderDetails = () => {
  const params = useParams();
  return params?.updateId && <OrdersView id={params?.updateId} />;
};

export default OrderDetails;
