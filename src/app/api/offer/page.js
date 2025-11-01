"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

const AllOffers = () => {
    const route = useRouter();
    const [offers, setOffers] = useState([]);
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
        fetchProduct();
    }, [])

    useEffect(() => {
        const initial = document.body.classList.contains("dark-only");
        setIsDarkMode(initial);
        fetchProduct();
        setRefeshState(false);
    }, [refreshState])

    const fetchProduct = async () => {
        let res = await axios.get('/api/offer', { withCredentials: true });
        if (res.status == 200) {
            setOffers(res.data.data);

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
        { value: 'physical', label: 'Physical Product' },
        { value: 'digital', label: 'Digital Product' },
        { value: 'external', label: 'External/Affiliate Product' },
    ];

    const tagOptions = [
        { value: 'all', label: 'All' },
        { value: 'BAR SYRUP & CORNFLAKES', label: 'BAR SYRUP & CORNFLAKES' },
        { value: 'CRUSHES', label: 'CRUSHES' },
        { value: 'TOMATO offers', label: 'TOMATO offers' },
    ];

    const handleView = () => {

    };
    const handleEdit = (id) => {
        route.push('/offer/edit/' + id);
    };

    const handleDelete = () => {

    };

    return (
        <>

            <div className="w-100 d-flex justify-content-end fs-5">
                <div className="w-50 d-flex justify-content-end gap-4">
                    <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => setRefeshState(true)}>Search</button>
                    <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => route.push('/offer/create')}>Add</button>
                </div>
            </div>

            <div>
                Offer list
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">User</th>
                            <th className="border px-4 py-2">Product</th>
                            <th className="border px-4 py-2">Discount(%)</th>
                            <th className="border px-4 py-2">Max Amount</th>
                            <th className="border px-4 py-2">Code</th>
                            <th className="border px-4 py-2">Start Date</th>
                            <th className="border px-4 py-2">End Date</th>
                            <th className="border px-4 py-2">Created On</th>
                            <th className="border px-4 py-2">Updated On</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers?.length ? (
                            offers.map((offer) => {
                                return (
                                    <tr key={offer.id}>
                                        <td className="border px-4 py-2">{offer.user}</td>
                                        <td className="border px-4 py-2">{offer.product}</td>
                                        <td className="border px-4 py-2">{offer.discountPercentage}</td>
                                        <td className="border px-4 py-2">{offer.maxAmount}</td>
                                        <td className="border px-4 py-2">{offer.code}</td>
                                        <td className="border px-4 py-2">{offer?.startDate
                                            ? new Date(offer?.startDate).toLocaleDateString()
                                            : "-"}</td>
                                        <td className="border px-4 py-2">{offer?.endDate
                                            ? new Date(offer?.endDate).toLocaleDateString()
                                            : "-"}</td>
                                        <td className="border px-4 py-2">{offer?.createdAt
                                            ? new Date(offer?.createdAt).toLocaleDateString()
                                            : "-"}</td>
                                        <td className="border px-4 py-2">{offer?.updatedAt
                                            ? new Date(offer?.updatedAt).toLocaleDateString()
                                            : "-"}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button onClick={() => handleView(offer.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                                                <button onClick={() => handleEdit(offer.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button>
                                                <button onClick={() => handleDelete(offer.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            )
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No offers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllOffers;