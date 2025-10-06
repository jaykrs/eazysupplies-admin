"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ShowModal from "@/elements/alerts&Modals/Modal";
import FullScreenModel from "@/elements/alerts&Modals/FullScreenModel";
import Btn from "@/elements/buttons/Btn";
import { useRouter } from "next/navigation";

const OrdersView = ({ id }) => {
    const route = useRouter();
    const [model, setModel] = useState(false);
    const [state, setState] = useState({
        Orders: [],
        qtyTempValue: 0,
        productItemDetails: {},
        editOrderItem: {},
        orderItemQty: 0,
        orderItemPrice: 0,
        refreshState: false
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

    // useEffect(() => {
    //   const initial = document.body.classList.contains("dark-only");
    //   setIsDarkMode(initial);
    //   fetchProduct();
    //   handleStateChange('refreshState', false);
    // }, [state.refreshState])

    const handleView = (el) => {
        handleStateChange('productItemDetails', el);
    }

    const fetchProduct = async () => {
        let res = await axios.get('/api/orders/filter?userId=' + id, { withCredentials: true });
        if (res.status == 200) {
            handleStateChange('Orders', res.data.data);
        }
    }
    const handleOrderItemUpdate = async () => {
        try {
            console.log('state.editOrderItem', state.editOrderItem);
            const res = await axios.put('/api/orders/auth', {
                "id": Number(state.editOrderItem?.id),
                "quantity": Number(state.orderItemQty !== 0 ? state.orderItemQty : state.editOrderItem?.quantity),
                "price": Number(state.orderItemPrice !== 0 ? state.orderItemPrice : state.editOrderItem?.price)
            }, { withCredentials: true });
            if (res.status == 200) {
                alert("Supplier:  updated successfully!");
                window.location.reload();
            }
        } catch (err) {
           console.log('error', err);
        }
    }
    const orderItemEdit = (el) => {
        handleStateChange('editOrderItem', el);
        handleStateChange('orderItemQty', el?.quantity);
        handleStateChange('orderItemPrice', el?.price);
    }

    return (
        <>
            <div className="w-100 d-flex flex-wrap justify-content-start m-4 fs-6" style={{ gap: "50px" }}>
            </div>

            <div>
                Orders Details
            </div>
            <div className="d-flex" style={{ width: "100%", height: "100vh" }}>
                {/* Sidebar (Scrollable) */}
                <div
                    className="d-flex flex-column overflow-auto p-2"
                    style={{
                        width: "300px",
                        maxHeight: "100vh",
                        overflowY: "auto",
                        borderRight: "1px solid #ccc",
                    }}
                >
                    {state.Orders?.length > 0 ? (
                        state.Orders.map((el, index) => {
                            const totalPrice = el?.items?.reduce(
                                (acc, item) => acc + Number(item.price) * Number(item.quantity),
                                0
                            );
                            return (
                                <div key={index} className="card mb-3" style={{ width: "100%" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Items: {el?.items.length}</h5>
                                        <p className="card-text">Status: {el?.status}</p>
                                        <p className="card-text">Total: RS {totalPrice.toFixed(2)}</p>
                                        <p className="card-text">Orders On: {el?.createdAt
                                            ? new Date(el?.createdAt).toLocaleDateString()
                                            : "-"}</p>
                                        <a href="#" className="btn btn-primary btn-sm" onClick={() => handleView(el)} >View</a>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p></p>
                    )}
                </div>

                {/* Main Content (Static) */}
                <div className="flex-grow-1 p-3">
                    <h4>Order Items Details</h4>
                    {Object.keys(state.productItemDetails).length > 0 ? (
                        state.productItemDetails?.items?.map((el, index) => {
                            return (
                                <div key={index} className="card mb-3" style={{ width: "100%" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Product Name: {el?.product?.name}</h5>
                                        <div>
                                            <p className="card-text">Quantity: {Number(el?.quantity)}</p>
                                            {
                                                Object.keys(state.editOrderItem).length == 0 ? '' : el.id === state.editOrderItem?.id ? <input type="number" placeholder="Enter Quantity" name="quantity" value={state.orderItemQty} onChange={(e) => handleStateChange('orderItemQty', e.target.value)} /> : ''
                                            }

                                        </div>
                                        <div>
                                            <p className="card-text">price/quantity(RS): {Number(el?.price)}</p>
                                            {
                                                Object.keys(state.editOrderItem).length == 0 ? '' : el.id === state.editOrderItem?.id ? <input type="number" placeholder="Enter price" name="price" value={state.orderItemPrice} onChange={(e) => handleStateChange('orderItemPrice', e.target.value)} /> : ''
                                            }
                                        </div>

                                        <p className="card-text">Orders On: {el?.createdAt
                                            ? new Date(el?.createdAt).toLocaleDateString()
                                            : "-"}</p>
                                        <p className="card-text">Updated On: {el?.updatedAt
                                            ? new Date(el?.updatedAt).toLocaleDateString()
                                            : "-"}</p>
                                        <div className="w-100 d-flex justify-content-between">
                                            <h3>Tost Price(RS): {(Number(el?.price) * Number(el?.quantity).toFixed(2))}</h3>
                                            {
                                                Object.keys(state.editOrderItem).length == 0 ? <a href="#" className="btn btn-primary btn-sm" onClick={() => orderItemEdit(el)} >Edit</a> : el.id === state.editOrderItem?.id ? <a href="#" className="btn btn-primary btn-sm" onClick={() => handleOrderItemUpdate()} >Update</a> : <a href="#" className="btn btn-primary btn-sm" onClick={() => orderItemEdit(el)} >Edit</a>
                                            }
                                            {/* <a href="#" className="btn btn-primary btn-sm" onClick={() => handleStateChange('editOrderItem', el)} >Edit</a> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No orders</p>
                    )}
                </div>
            </div>
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
                <div className="remove-box">

                </div>
            </ShowModal>
        </>
    )
};

export default OrdersView;
