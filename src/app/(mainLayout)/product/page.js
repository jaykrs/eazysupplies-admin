"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

const AllUsers = () => {

    const [products, setProducts] = useState([]);
    const [state, setState] = useState({
        name: "all",
        type: "all",
        tag: "all"
    });
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleStateChange = (name, value) => {
        console.log('........e', name, value);
        setState(prev => {
            return { ...prev, [name]: value }
        })
    }

    useEffect(() => {
        const initial = document.body.classList.contains("dark-only");
        setIsDarkMode(initial);
        fetchProduct();
    }, [])

    const fetchProduct = async () => {
        let res = await axios.get('/api/product?products=all', { withCredentials: true });
        if (res.status == 200) {
            setProducts(res.data.products);
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

    console.log('.........', state);

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
                    <button className="px-4 py-2 btn btn-primary fs-5">Search</button>
                    <button className="px-4 py-2 btn btn-secondary fs-5">Clear</button>
                </div>
            </div>

            <div>
                Product list
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">SKU</th>
                            <th className="border px-4 py-2">Unit</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Stock Status</th>
                            <th className="border px-4 py-2">Self Life</th>
                            <th className="border px-4 py-2">MRP price</th>
                            <th className="border px-4 py-2">Discount(%)</th>
                            <th className="border px-4 py-2">Sale Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.length ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2">{product.type}</td>
                                    <td className="border px-4 py-2">{product.name}</td>
                                    <td className="border px-4 py-2">{product.sku}</td>
                                    <td className="border px-4 py-2">{product.unit}</td>
                                    <td className="border px-4 py-2">${product.price}</td>
                                    <td className="border px-4 py-2">{product.stock_status}</td>
                                    <td className="border px-4 py-2">{product.self_life}</td>
                                    <td className="border px-4 py-2">{product.price}</td>
                                    <td className="border px-4 py-2">{product.discount}</td>
                                    <td className="border px-4 py-2">{product.sale_price}</td>
                                </tr>
                            ))
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