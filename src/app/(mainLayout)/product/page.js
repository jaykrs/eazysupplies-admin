"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

const AllUsers = () => {
    const route = useRouter();
    const [products, setProducts] = useState([]);
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
        let res = await axios.get('/api/products', { withCredentials: true });
        if (res.status == 200) {
            setProducts(res.data.data);
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
        { value: 'TOMATO PRODUCTS', label: 'TOMATO PRODUCTS' },
    ];

    const handleView = () => {

    };
    const handleEdit = (id) => {
       route.push('/product/edit/' + id);
    };

    const handleDelete = () => {

    };

    return (
        <>
            <div className="w-100 d-flex flex-wrap justify-content-start m-4 fs-6" style={{ gap: "50px" }}>

                <div className="d-flex" style={{ gap: "20px" }} >
                    <label htmlFor="productType">Product Type</label>

                    <Select
                        id="productType"
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
                    <label htmlFor="productName">Product Name</label>
                    {/* <select id="productName" style={{ padding: "0 1rem" }}>
                        <option value={'all'}>All</option>
                    </select> */}
                    <Select
                        id="productName"
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
                    <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => setRefeshState(true)}>Search</button>
                    <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => route.push('/product/create')}>Add</button>
                </div>
            </div>

            <div>
                Product list
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">SKU</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Tax</th>
                            <th className="border px-4 py-2">Stock</th>
                            <th className="border px-4 py-2">dimension</th>
                            <th className="border px-4 py-2">Category</th>
                            <th className="border px-4 py-2">Brand</th>
                            <th className="border px-4 py-2">Orders</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.length ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2">{product.name}</td>
                                    <td className="border px-4 py-2">{product.sku}</td>
                                    <td className="border px-4 py-2">${product.price}</td>
                                    <td className="border px-4 py-2">{product.tax}%</td>
                                    <td className="border px-4 py-2">{product.stock}</td>
                                    <td className="border px-4 py-2">{product.dimension}</td>
                                    <td className="border px-4 py-2">{product.category?.name}</td>
                                    <td className="border px-4 py-2">{product.brand?.name}</td>
                                    <td className="border px-4 py-2">{product.ordersCount}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button onClick={() => handleView(product.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                                            <button onClick={() => handleEdit(product.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                            )
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllUsers;