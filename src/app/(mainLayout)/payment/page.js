"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

const AllPayments = () => {
    const route = useRouter();
    const [payments, setPayments] = useState([]);
    const [refreshState, setRefeshState] = useState(false);
    const [state, setState] = useState({
        name: "all",
        type: "all",
        tag: "all"
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
        fetchpayment();
    }, [])

    useEffect(() => {
        const initial = document.body.classList.contains("dark-only");
        setIsDarkMode(initial);
        fetchpayment();
        setRefeshState(false);
    }, [refreshState])

    const fetchpayment = async () => {
        let res = await axios.get('/api/payments', { withCredentials: true });
        if (res.status == 200) {
            setPayments(res.data.data);

        }
    }

    const nameOptions = [
        { value: 'all', label: 'All' },
        { value: 'CORN FLAKES', label: 'CORN FLAKES' },
        { value: 'MOJITO MINT', label: 'MOJITO MINT' },
        { value: 'BLUE CURACAO', label: 'BLUE CURACAO' },
    ];

    const typeOptions = [
        { value: 'all', label: 'All' },
        { value: 'physical', label: 'Physical payment' },
        { value: 'digital', label: 'Digital payment' },
        { value: 'external', label: 'External/Affiliate payment' },
    ];

    const tagOptions = [
        { value: 'all', label: 'All' },
        { value: 'BAR SYRUP & CORNFLAKES', label: 'BAR SYRUP & CORNFLAKES' },
        { value: 'CRUSHES', label: 'CRUSHES' },
        { value: 'TOMATO paymentS', label: 'TOMATO paymentS' },
    ];

    const handleView = () => {

    };
    const handleEdit = (id) => {
        route.push('/payment/edit/' + id);
    };

    const handleDelete = () => {

    };

    return (
        <>
            <div className="w-100 d-flex flex-wrap justify-content-start m-4 fs-6" style={{ gap: "50px" }}>

                <div className="d-flex" style={{ gap: "20px" }} >
                    <label htmlFor="paymentType">payment Type</label>

                    <Select
                        id="paymentType"
                        options={typeOptions}
                        onChange={(e) => handleStateChange('type', e.value)}
                        defaultValue={typeOptions[0]}
                        isSearchable={true}
                        styles={{
                            control: (base) => ({
                                ...base,
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                                color: isDarkMode ? "#f1f1f1" : "#000",
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
                                color: isDarkMode ? "#f1f1f1" : "#000",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                    ? isDarkMode ? "#3a3a3a" : "#f0f0f0"
                                    : isDarkMode ? "#2c2c2c" : "#fff",
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                        }}
                    />
                </div>
                <div className="d-flex" style={{ gap: "20px" }}>
                    <label htmlFor="paymentName">payment Name</label>
                    {/* <select id="paymentName" style={{ padding: "0 1rem" }}>
                        <option value={'all'}>All</option>
                    </select> */}
                    <Select
                        id="paymentName"
                        options={nameOptions}
                        onChange={(e) => handleStateChange("name", e.value)}
                        defaultValue={nameOptions[0]}
                        isSearchable={true}
                        styles={{
                            control: (base) => ({
                                ...base,
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                backgroundColor: isDarkMode ? "#6B6565" : "#fff",
                                color: isDarkMode ? "#f1f1f1" : "#000",
                                borderColor: isDarkMode ? "#444" : base.borderColor,
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: isDarkMode ? "#6B6565" : "#fff",
                                color: isDarkMode ? "#f1f1f1" : "#000",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                    ? isDarkMode
                                        ? "#6B6565"
                                        : "#f0f0f0"
                                    : isDarkMode
                                        ? "#6B6565"
                                        : "#fff",
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            input: (base) => ({
                                ...base,
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: isDarkMode ? "#aaa" : "#888",
                            }),
                        }}
                    />
                </div>

                <div className="d-flex" style={{ gap: "20px" }} >
                    <label htmlFor="tag">Tag</label>
                    <Select
                        id="tag"
                        options={tagOptions}
                        onChange={(e) => handleStateChange("tag", e.value)}
                        defaultValue={tagOptions[0]}
                        isSearchable={true}
                        styles={{
                            control: (base) => ({
                                ...base,
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                backgroundColor: isDarkMode ? "#6B6565" : "#fff",
                                color: isDarkMode ? "#f1f1f1" : "#000",
                                borderColor: isDarkMode ? "#555" : base.borderColor,
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: isDarkMode ? "#6B6565" : "#fff",
                                color: isDarkMode ? "#f1f1f1" : "#000",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                    ? isDarkMode ? "#6B6565" : "#f0f0f0"
                                    : isDarkMode ? "#6B6565" : "#fff",
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            input: (base) => ({
                                ...base,
                                color: isDarkMode ? "#fff" : "#000",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: isDarkMode ? "#aaa" : "#888",
                            }),
                        }}
                    />
                </div>
            </div>
            <div className="w-100 d-flex justify-content-end fs-5">
                <div className="w-50 d-flex justify-content-end gap-4">
                    <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => setRefeshState(true)}>Search</button>
                    <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => route.push('/payment/create')}>Add</button>
                </div>
            </div>

            <div>
                payment list
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Order ID</th>
                            <th className="border px-4 py-2">Transaction ID</th>
                            <th className="border px-4 py-2">Amount</th>
                            <th className="border px-4 py-2">Method</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Creted At</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.length ? (
                            payments.map((payment) => {
                                return (
                                    <tr key={payment.id}>
                                        <td className="border px-4 py-2" >{payment?.orderId}</td>
                                        <td className="border px-4 py-2">{payment?.transectionid}</td>
                                        <td className="border px-4 py-2">{payment?.amount}</td>
                                        <td className="border px-4 py-2">{payment?.method}</td>
                                        <td className="border px-4 py-2">{payment?.status}</td>
                                        <td className="border px-4 py-2">
                                            {payment?.createdAt
                                                ? new Date(payment.createdAt).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button onClick={() => handleView(payment.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                                                <button onClick={() => handleEdit(payment.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button>
                                                <button onClick={() => handleDelete(payment.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            )
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllPayments;