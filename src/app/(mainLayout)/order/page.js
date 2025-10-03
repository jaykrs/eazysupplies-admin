"use client";
import ShowModal from "@/elements/alerts&Modals/Modal";
import Btn from "@/elements/buttons/Btn";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

const AllOrders = () => {
  const route = useRouter();
  const [orders, setOrders] = useState({});
  //const [paymentModel, setPaymentModel] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [refreshState, setRefeshState] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    fetchProduct();
  }, [])

  useEffect(() => {
    const initial = document.body.classList.contains("dark-only");
    setIsDarkMode(initial);
    fetchProduct();
    setRefeshState(false);
  }, [refreshState])

  const fetchProduct = async () => {
    let res = await axios.get('/api/orders', { withCredentials: true });
    if (res.status == 200) {
      console.log('.............', res);
      setOrders(res.data);
      // setTaxData(res.data.tax);

    }
  }

  const handleDelete = () => {

  };

  const handleBlur = () => {

  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <>
      <div className="w-100 d-flex flex-wrap justify-content-start m-4 fs-6" style={{ gap: "50px" }}>
      </div>
      <div className="w-100 d-flex justify-content-end fs-5">
        <div className="w-50 d-flex justify-content-end gap-4">
          <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => setRefeshState(true)}>Search</button>
          <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => route.push('/product/create')}>Add</button>
        </div>
      </div>

      <div>
        Orders List
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">S.N.</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Shipping</th>
              <th className="border px-4 py-2">Payment</th>
              <th className="border px-4 py-2">Supplier</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.orders?.length ? (
              orders?.orders.map((order, index) => {
                return (
                  order?.items?.map((subOrder, subIndex) => {
                    return (
                      <tr key={subOrder?.id + 1}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2" onClick={() => {
                          handleStateChange("userModel", true);
                          handleStateChange('userDetails', order?.user);
                        }} style={{ "color": "#1515df", cursor: "pointer" }}>{order?.user?.name}</td>
                        <td className="border px-4 py-2" onClick={() => {
                          handleStateChange("userModel", true);
                          handleStateChange('userDetails', subOrder?.product);
                        }} style={{ "color": "#1515df", cursor: "pointer" }} >{subOrder?.product?.name}</td>

                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={Number(subOrder?.quantity)}
                            onChange={(e) => handleStateChange('qtyTempValue', e.target.value)}
                            onBlur={(e) => {
                              setIsFocused(false);
                              handleBlur(e);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className={`w-full px-1 outline-none transition-all ${isFocused ? 'border border-blue-500' : 'border border-transparent'
                              }`}
                          />
                        </td>
                        <td className="border px-4 py-2">{Number(subOrder?.price) * Number(subOrder?.quantity)}</td>
                        <td className="border px-4 py-2" onClick={() => {
                          handleStateChange("shippingModel", true);
                          handleStateChange('shippingDetails', order?.shipping);
                        }} style={{ "color": "#1515df", cursor: "pointer" }} title={order?.shipping?.address + " ," + order?.shipping?.city + ' ,' + order?.shipping?.country} >{order?.shipping?.address}</td>

                        <td className="border px-4 py-2" onClick={() => {
                          handleStateChange("paymentModel", true);
                          handleStateChange('paymentDetails', order?.payment);
                        }} style={{ "color": "#1515df", cursor: "pointer" }} >{order?.payment?.status + "(" + order?.payment?.amount + ")"}</td>
                        <td className="border px-4 py-2">{order?.supplier}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {/* <button onClick={() => handleView(product.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                            <button onClick={() => handleEdit(product.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button> */}
                            <button onClick={() => handleDelete(product.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-danger">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
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