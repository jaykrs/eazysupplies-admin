"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiRefreshLine, RiSearchLine } from "react-icons/ri";
import { Button, Card, CardBody, Input, Spinner } from "reactstrap";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function ProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availability, setAvailability] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/products", {
        params: {
          status: "all",
          search: search.trim() || undefined,
          category_ids: categoryId || undefined,
          page,
          paginate: perPage,
          field: "createdAt",
          sort: "desc",
        },
        withCredentials: true,
      });
      let rows = response.data?.data || [];
      if (availability === "in-stock") rows = rows.filter((product) => product.stock > 0);
      if (availability === "out-of-stock") rows = rows.filter((product) => product.stock <= 0);
      setProducts(rows);
      setTotal(response.data?.total || 0);
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, availability, page, perPage]);

  useEffect(() => {
    axios.get("/api/categories", { withCredentials: true })
      .then((response) => setCategories(response.data?.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete “${product.name}”?`)) return;
    try {
      await axios.delete(`/api/products/${product.id}`, { withCredentials: true });
      await loadProducts();
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Unable to delete product.");
    }
  };

  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return (
    <Card>
      <CardBody>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="mb-1">All Products</h3>
            <p className="text-muted mb-0">Search, filter and manage the product catalogue.</p>
          </div>
          <Button color="primary" onClick={() => router.push("/product/create")}><RiAddLine /> Add Product</Button>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-lg-5">
            <label className="form-label" htmlFor="product-search">Search products</label>
            <div className="input-group"><span className="input-group-text"><RiSearchLine /></span><Input id="product-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name or keyword" /></div>
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="product-category">Category</label>
            <Input id="product-category" type="select" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Input>
          </div>
          <div className="col-md-2">
            <label className="form-label" htmlFor="product-stock">Availability</label>
            <Input id="product-stock" type="select" value={availability} onChange={(event) => { setAvailability(event.target.value); setPage(1); }}>
              <option value="all">All</option><option value="in-stock">In stock</option><option value="out-of-stock">Out of stock</option>
            </Input>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button outline className="w-100" onClick={loadProducts}><RiRefreshLine /> Refresh</Button>
          </div>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="table-responsive" style={{ maxHeight: "65vh" }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}><tr><th>Actions</th><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Category</th><th>Brand</th><th>Updated</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="8" className="text-center py-5"><Spinner size="sm" /> Loading products…</td></tr> : products.length ? products.map((product) => (
                <tr key={product.id}>
                  <td className="text-nowrap"><Button size="sm" color="warning" aria-label={`Edit ${product.name}`} onClick={() => router.push(`/product/edit/${product.id}`)}><RiEditLine /></Button>{" "}<Button size="sm" color="danger" aria-label={`Delete ${product.name}`} onClick={() => removeProduct(product)}><RiDeleteBinLine /></Button></td>
                  <td style={{ minWidth: 220, whiteSpace: "normal" }}>{product.name}</td><td>{product.sku || "—"}</td><td>₹{Number(product.price).toFixed(2)}</td><td>{product.stock}</td><td>{product.category?.name || "—"}</td><td>{product.brand?.name || "—"}</td><td>{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "—"}</td>
                </tr>
              )) : <tr><td colSpan="8" className="text-center py-5">No products match these filters.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
          <div className="d-flex align-items-center gap-2"><span>Rows</span><Input type="select" value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }} style={{ width: 90 }}>{PAGE_SIZE_OPTIONS.map((size) => <option key={size}>{size}</option>)}</Input><span>{total} total</span></div>
          <div className="d-flex align-items-center gap-2"><Button outline disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page} of {lastPage}</span><Button outline disabled={page >= lastPage} onClick={() => setPage((value) => value + 1)}>Next</Button></div>
        </div>
      </CardBody>
    </Card>
  );
}
