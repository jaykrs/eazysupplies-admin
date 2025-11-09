"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ShowModal from "@/elements/alerts&Modals/Modal";
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
        refreshState: false,
        shippingModel: false,
        shippingDetails: {}
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
        handleStateChange('refreshState', false);
    }, [state.refreshState])

    const handleView = (el) => {
        console.log('...........product details', el);
        handleStateChange('productItemDetails', el);
    }

    const fetchProduct = async () => {
        let res = await axios.get('/api/orders/filter?userId=' + id, { withCredentials: true });
        // if (res.status == 200) {
        //     handleStateChange('Orders', res.data.data);
        //     if (Object.keys(state.editOrderItem).length > 0) {
        //         const filterData = res.data.data.filter(el => el.id === state.editOrderItem?.orderId);
        //         handleStateChange('productItemDetails', filterData[0]);
        //         handleStateChange('editOrderItem', {});
        //     }
        // }

        if (res.status == 200) {
            handleStateChange('Orders', res.data.data);

            const currentProductId = state.productItemDetails?.id;

            if (currentProductId) {
                const updatedProduct = res.data.data.find(el => el.id === currentProductId);
                if (updatedProduct) {
                    handleStateChange('productItemDetails', updatedProduct);
                }
            }

            if (Object.keys(state.editOrderItem).length > 0) {
                const filterData = res.data.data.filter(el => el.id === state.editOrderItem?.orderId);
                handleStateChange('editOrderItem', {});
            }
        }

    }
    const handleOrderItemUpdate = async () => {
        try {
            const res = await axios.put('/api/orders/auth', {
                "id": Number(state.editOrderItem?.id),
                "quantity": Number(state.orderItemQty !== 0 ? state.orderItemQty : state.editOrderItem?.quantity),
                "price": Number(state.orderItemPrice !== 0 ? state.orderItemPrice : state.editOrderItem?.price)
            }, { withCredentials: true });
            if (res.status == 200) {
                alert("Order item updated successfully!");
                // window.location.reload();
                handleStateChange('refreshState', true);
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

    const updateOrderStatus = async (id, action) => {
        try {
            const res = await axios.put('/api/orders', {
                id: Number(id),
                status: action.toUpperCase(),
                approved: action.toUpperCase() === "APPROVED"
            }, { withCredentials: true });

            if (res.status === 200) {
                alert(`Order ${action.toUpperCase()} successfully!`);
                handleStateChange('refreshState', true);
            }
        } catch (err) {
            console.error('error', err);
        }
    };
    return (
        <>
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
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title">Order ID: {el?.id}</h5>
                                            <button className="btn btn-outline-primary cursor-pointer" style={{ width: "70px", color: "#1921e8" }} onClick={() => {
                                                setState(prev => {
                                                    return { ...prev, ["shippingModel"]: true, ["shippingDetails"]: el?.shipping }
                                                })
                                            }}>Shipping</button>
                                        </div>
                                        <h5 className="card-title">Items: {el?.items.length}</h5>
                                        <p className="card-text">Status: {el?.status}</p>
                                        <p className="card-text">Total Price(RS): {totalPrice.toFixed(2)}</p>
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
                    <div className="w-100 d-flex justify-content-between mb-2">
                        <div><h4>Order Items Details</h4></div>
                        {
                            Object.keys(state.productItemDetails).length > 0 &&
                            <div className="d-flex justify-content-end gap-3 pr-3">
                                {state.productItemDetails?.payment?.status !== "PENDING" && <button type="button" className="btn btn-info">Download Invoice</button>}
                                {state.productItemDetails?.payment?.status == "PENDING" && (state.productItemDetails?.status).toUpperCase() === "APPROVED" && <button type="button" onClick={()=> route.push('/payment/create') } className="btn btn-info">Pay</button>}

                                {(state.productItemDetails?.approved && (state.productItemDetails?.status).toUpperCase() === "APPROVED") ? <button type="button" className="btn btn-success" disabled title="disabled" >Approved</button> : (state.productItemDetails?.status).toUpperCase() === "PENDING" ? <button type="button" className="btn btn-success" onClick={() => updateOrderStatus(state.productItemDetails?.id, "APPROVED")} >Approve</button> : ''}
                                {(state.productItemDetails?.status).toUpperCase() === "REJECTED" ? <button type="button" className="btn btn-danger" disabled >Rejected</button> : (state.productItemDetails?.status).toUpperCase() === "PENDING" ? <button type="button" className="btn btn-danger" onClick={() => updateOrderStatus(state.productItemDetails?.id, "REJECTED")} >Reject</button> : ''}
                            </div>
                        }
                    </div>

                    {Object.keys(state.productItemDetails).length > 0 ? (
                        state.productItemDetails?.items?.map((el, index) => {
                              const jsonData = Array.isArray(el?.product?.jsonData) ? el?.product?.jsonData : [];
                              const filterJsonData = jsonData.length > 0 ? jsonData.filter(element=> el.orderId == element.orderId && state.productItemDetails?.userId == element.userId ) : [];
                              console.log('.....jsonData from ui',el.orderId, state.productItemDetails?.userId, index, jsonData);
                              console.log('.........filterJsonData', filterJsonData);
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
                                            <p className="card-text">price/quantity(RS): { Number(el?.product?.price)}</p>
                                            <p className="card-text">discount(%): { filterJsonData.length > 0 ? Number(filterJsonData[0]?.discountPercentage) : 0}</p>
                                            <p className="card-text"> Selling price/quantity(RS): {filterJsonData.length > 0 ? Number(filterJsonData[0]?.sellingPrice) :  Number(el?.price)}</p>
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
                                            <h3>Total Price(RS): { filterJsonData.length > 0 ? ( Number(filterJsonData[0]?.sellingPrice) * Number(el?.quantity)).toFixed(2) :  (Number(el?.price) * Number(el?.quantity)).toFixed(2)}</h3>
                                            {
                                                (!state.productItemDetails?.approved && (state.productItemDetails?.status).toUpperCase() === "PENDING") && (Object.keys(state.editOrderItem).length == 0 ? <a href="#" className="btn btn-primary btn-sm" onClick={() => orderItemEdit(el)} >Edit</a> : el.id === state.editOrderItem?.id ? <a href="#" className="btn btn-primary btn-sm" onClick={() => handleOrderItemUpdate()} >Update</a> : <a href="#" className="btn btn-primary btn-sm" onClick={() => orderItemEdit(el)} >Edit</a>)
                                            }
                                            {/* <a href="#" className="btn btn-primary btn-sm" onClick={() => handleStateChange('editOrderItem', el)} >Edit</a> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
            <ShowModal
                open={state.shippingModel}
                close={false}
                buttons={
                    <>
                        <Btn title="Close" onClick={() => {
                            setState(prev => {
                                return { ...prev, ["shippingModel"]: false, ["shippingDetails"]: {} }
                            })
                        }} className="btn-md btn-outline fw-bold" />
                        {/* <Btn title="Yes" onClick={() => handleLogout()} className="btn-theme btn-md fw-bold" /> */}
                    </>
                }
            >
                {/* <div className="remove-box"> */}
                {
                    Object.keys(state.shippingDetails).length > 0 ?
                        <div>
                            <p>Status: {state.shippingDetails?.status}</p>
                            <p style={{ color: "#0b24ed" }}>Address: {state.shippingDetails?.address}, {state.shippingDetails?.city}, {state.shippingDetails?.state},
                                {state.shippingDetails?.country}- {state.shippingDetails?.postalCode}
                            </p>
                        </div>
                        : <p>No Shipping address available</p>
                }
                {/* </div> */}
            </ShowModal>
        </>
    )
};

export default OrdersView;
