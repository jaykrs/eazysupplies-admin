"use client";
import ShowModal from "@/elements/alerts&Modals/Modal";
import Btn from "@/elements/buttons/Btn";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
const AllOrders = () => {
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status");
  console.log('qry status 1', queryStatus);
  const route = useRouter();
  const [orders, setOrders] = useState({});
  const [refreshState, setRefeshState] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [state, setState] = useState({
    paymentModel: false,
    paymentDetails: {},
    shippingModel: false,
    shippingDetails: {},
    userModel: false,
    userDetails: {},
    productModel: false,
    productDetails: {},
    qtyTempValue: 0
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleStateChange = (name, value) => {
    setState(prev => {
      return { ...prev, [name]: value }
    })
  }
  useEffect(() => {
    const initial = document.body.classList.contains("dark-only");
    setIsDarkMode(initial);
    if (queryStatus) {
      getOrderListBasedOnStatus();
    } else {
      fetchProduct();
    }
  }, [])

  useEffect(() => {
    const initial = document.body.classList.contains("dark-only");
    setIsDarkMode(initial);
    if (queryStatus) {
      getOrderListBasedOnStatus();
    } else {
      fetchProduct();
    }
    setRefeshState(false);
  }, [refreshState])

  const fetchProduct = async () => {
    let res = await axios.get('/api/orders/auth', { withCredentials: true });
    if (res.status == 200) {
      let filterData = res?.data?.data?.filter(el => el?.orders?.length != 0);
      setOrders(filterData);

    }
  }

  const getOrderListBasedOnStatus = async () => {
    console.log('qry status 2', queryStatus);
    let res = await axios.get('/api/orders?status=' + queryStatus, { withCredentials: true });
    if (res.status == 200) {
      let filterData = res?.data?.orders;
      setOrderList(filterData);

    }
  }

  const handleView = (id) => {
    route.push('/order/details/' + id);
  }
  const handleViewOrder = async (id)=> {

  }
  const handleEditOrder = async (id)=> {

  }
  const handleDeleteOrder = async (id)=> {

  }
  return (
    <>
      {/* <div className="w-100 d-flex flex-wrap justify-content-start m-4 fs-6" style={{ gap: "50px" }}>
      </div> */}
      <div className="w-100 d-flex justify-content-end fs-5">
        <div className="w-50 d-flex justify-content-end gap-4">
          <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => setRefeshState(true)}>Search</button>
          <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => route.push('/product/create')}>Add</button>
        </div>
      </div>

      <div>
        Orders List
      </div>

      {queryStatus == null &&
        <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">S.N.</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Order Count</th>
                <th className="border px-4 py-2">Order Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length ? (
                orders?.map((order, index) => {
                  const PENDINGStatus = order?.orders?.filter(el => el?.status === "PENDING");
                  const ApprovedStatus = order?.orders?.filter(el => el?.status === "APPROVED");
                  const RejectedStatus = order?.orders?.filter(el => el?.status === "REJECTED");
                  return (
                    <tr key={order?.id + index + 1}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2" onClick={() => {
                        handleStateChange("userModel", true);
                        handleStateChange('userDetails', order);
                      }} style={{ "color": "#1515df", cursor: "pointer" }}>{order?.name}</td>
                      <td className="border px-4 py-2">{order?.orders?.length}</td>
                      <td className="border px-4 py-2">
                        <div className="d-flex gap-5">
                          <span><p>PENDING</p> <br /> <p>{PENDINGStatus?.length}</p></span>
                          <span><p>APPROVED</p> <br /> <p>{ApprovedStatus?.length}</p></span>
                          <span><p>REJECTED</p> <br /> <p>{RejectedStatus?.length}</p></span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button onClick={() => handleView(order?.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                        </div>
                      </td>
                    </tr>
                  )
                }
                )
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }

      {
        queryStatus &&
        <div style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}>
          <table className="min-w-full border border-gray-300" style={{overflow:"auto", whiteSpace:"nowrap", textAlign:"center"}} >
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Order Id</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Approved</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Total Items(no.)</th>
                <th className="border px-4 py-2">Total Qty(no.)</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Ordered date</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.length > 0 ? (
                orderList.map((element) => {
                 const productNameList = element?.items?.map(el=> el?.product?.name).filter(Boolean)?.join(", ");
                 const productQty = element?.items?.reduce((sum, item)=> sum + ( item?.quantity || 0), 0);
                  return (
                    <tr key={element?.id}>
                      <td className="border px-4 py-2">{element?.id}</td>
                      <td className="border px-4 py-2">{element?.status}</td>
                      <td className="border px-4 py-2">{element?.approved}</td>
                      <td className="border px-4 py-2">{element?.user?.name}</td>
                      <td className="border px-4 py-2">{element?.items?.length || 0}</td>
                      <td className="border px-4 py-2">{productQty}</td>
                      <td className="border px-4 py-2">{element?.payment?.status}</td>
                      <td className="border px-4 py-2">{productNameList || ""}</td>
                      <td className="border px-4 py-2">{element?.createdAt ? new Date(element.createdAt).toLocaleDateString() : "-"}</td>
                      <td>
                        <div className="d-flex gap-2 px-2">
                          <button onClick={() => handleViewOrder(element?.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                          <button onClick={() => handleEditOrder(element?.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button>
                        </div>
                      </td>
                    </tr>
                  )
                }
                )
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No order found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }

      <ShowModal
        open={state.paymentModel}
        close={false}
        buttons={
          <>
            <Btn title="Close" onClick={() => {
              setState(prev => {
                return { ...prev, ["paymentModel"]: false, ["paymentDetails"]: {}, ["shippingModel"]: false, ["shippingDetails"]: {}, ["userModel"]: false, ["userDetails"]: {}, ["userModel"]: false, ["userDetails"]: {} }
              })
            }} className="btn-md btn-outline fw-bold" />
            {/* <Btn title="Yes" onClick={() => handleLogout()} className="btn-theme btn-md fw-bold" /> */}
          </>
        }
      >
        {/* <div className="remove-box"> */}
        <div style={{ maxWidth: "600px", maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
          <h4>Payment Details</h4>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Method</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Transaction Id</th>
                <th className="border px-4 py-2">Paid On</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(state.paymentDetails || {}).length > 0 ? (
                <tr>
                  <td className="border px-4 py-2">{state.paymentDetails?.status || "-"}</td>
                  <td className="border px-4 py-2">{state.paymentDetails?.method || "-"}</td>
                  <td className="border px-4 py-2">{state.paymentDetails?.amount || "-"}</td>
                  <td className="border px-4 py-2">{state.paymentDetails?.transectionid || "-"}</td>
                  <td className="border px-4 py-2">
                    {state.paymentDetails?.createdAt
                      ? new Date(state.paymentDetails.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-4 py-2 text-gray-500">
                    No Payment Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* </div> */}
        </div>
      </ShowModal>
      <ShowModal
        open={state.shippingModel}
        close={false}
        buttons={
          <>
            <Btn title="Close" onClick={() => {
              setState(prev => {
                return { ...prev, ["paymentModel"]: false, ["paymentDetails"]: {}, ["shippingModel"]: false, ["shippingDetails"]: {}, ["userModel"]: false, ["userDetails"]: {}, ["userModel"]: false, ["userDetails"]: {} }
              })
            }} className="btn-md btn-outline fw-bold" />
            {/* <Btn title="Yes" onClick={() => handleLogout()} className="btn-theme btn-md fw-bold" /> */}
          </>
        }
      >
        {/* <div className="remove-box"> */}
        <div style={{ maxWidth: "600px", maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
          <h4>Shipping Details</h4>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Postal Code</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">Country</th>
                <th className="border px-4 py-2">CreatedAt</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(state.shippingDetails || {}).length > 0 ? (
                <tr>
                  <td className="border px-4 py-2">{state.shippingDetails?.address || "-"}</td>
                  <td className="border px-4 py-2">{state.shippingDetails?.postalCode || "-"}</td>
                  <td className="border px-4 py-2">{state.shippingDetails?.city || "-"}</td>
                  <td className="border px-4 py-2">{state.shippingDetails?.state || "-"}</td>
                  <td className="border px-4 py-2">{state.shippingDetails?.country}</td>
                  <td className="border px-4 py-2">
                    {state.shippingDetails?.createdAt
                      ? new Date(state.shippingDetails.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-4 py-2 text-gray-500">
                    No Shipping Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* </div> */}
        </div>
      </ShowModal>
      <ShowModal
        open={state.userModel}
        close={false}
        buttons={
          <>
            <Btn title="Close" onClick={() => {
              setState(prev => {
                return { ...prev, ["paymentModel"]: false, ["paymentDetails"]: {}, ["shippingModel"]: false, ["shippingDetails"]: {}, ["userModel"]: false, ["userDetails"]: {}, ["userModel"]: false, ["userDetails"]: {} }
              })
            }} className="btn-md btn-outline fw-bold" />
            {/* <Btn title="Yes" onClick={() => handleLogout()} className="btn-theme btn-md fw-bold" /> */}
          </>
        }
      >
        {/* <div className="remove-box"> */}
        <div style={{ maxWidth: "600px", maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
          <h4>Shipping Details</h4>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Country Code</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Favorite</th>
                <th className="border px-4 py-2">GSt No</th>
                <th className="border px-4 py-2">Last LogIn</th>
                <th className="border px-4 py-2">Register On</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(state.userDetails || {}).length > 0 ? (
                <tr>
                  <td className="border px-4 py-2">{state.userDetails?.name || "-"}</td>
                  <td className="border px-4 py-2">{state.userDetails?.email || "-"}</td>
                  <td className="border px-4 py-2">{state.userDetails?.countryCode || "-"}</td>
                  <td className="border px-4 py-2">{state.userDetails?.phone || "-"}</td>
                  <td className="border px-4 py-2">{state.userDetails?.favorite}</td>
                  <td className="border px-4 py-2">{state.userDetails?.gstn}</td>
                  <td className="border px-4 py-2">
                    {state.userDetails?.lastLoginDt
                      ? new Date(state.userDetails.lastLoginDt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {state.userDetails?.createdAt
                      ? new Date(state.userDetails.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-4 py-2 text-gray-500">
                    No Shipping Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* </div> */}
        </div>
      </ShowModal>
      <ShowModal
        open={state.productModel}
        close={false}
        buttons={
          <>
            <Btn title="Close" onClick={() => {
              setState(prev => {
                return { ...prev, ["paymentModel"]: false, ["paymentDetails"]: {}, ["shippingModel"]: false, ["shippingDetails"]: {}, ["userModel"]: false, ["userDetails"]: {}, ["userModel"]: false, ["userDetails"]: {} }
              })
            }} className="btn-md btn-outline fw-bold" />
            {/* <Btn title="Yes" onClick={() => handleLogout()} className="btn-theme btn-md fw-bold" /> */}
          </>
        }
      >
        {/* <div className="remove-box"> */}
        <div style={{ maxWidth: "600px", maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
          <h4>Product Details</h4>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Create At</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(state.userDetails || {}).length > 0 ? (
                <tr>
                  <td className="border px-4 py-2">{state.userDetails?.name || "-"}</td>
                  <td className="border px-4 py-2">
                    {state.userDetails?.createdAt
                      ? new Date(state.userDetails.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-4 py-2 text-gray-500">
                    No Shipping Details Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* </div> */}
        </div>
      </ShowModal>
    </>
  )
}

export default AllOrders;