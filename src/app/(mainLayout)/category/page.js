"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiRefreshLine, RiSearchLine } from "react-icons/ri";
import { Button, Card, CardBody, Input, Spinner } from "reactstrap";

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await axios.get("/api/categories", { withCredentials: true });
      setCategories(response.data?.data || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Unable to load categories.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  const filtered = useMemo(() => categories.filter((category) => category.name.toLowerCase().includes(search.trim().toLowerCase())), [categories, search]);
  const lastPage = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    try { await axios.delete(`/api/categories/${category.id}`, { withCredentials: true }); await loadCategories(); }
    catch (requestError) { setError(requestError?.response?.data?.error || "Unable to delete category."); }
  };

  return <Card><CardBody>
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4"><div><h3 className="mb-1">Categories</h3><p className="text-muted mb-0">Search and maintain storefront categories.</p></div><Button color="primary" onClick={() => router.push("/category/create")}><RiAddLine /> Add Category</Button></div>
    <div className="row g-3 mb-3"><div className="col-md-8"><label className="form-label" htmlFor="category-search">Search categories</label><div className="input-group"><span className="input-group-text"><RiSearchLine /></span><Input id="category-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Category name" /></div></div><div className="col-md-4 d-flex align-items-end"><Button outline className="w-100" onClick={loadCategories}><RiRefreshLine /> Refresh</Button></div></div>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    <div className="table-responsive" style={{ maxHeight: "65vh" }}><table className="table table-hover align-middle mb-0"><thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}><tr><th>Actions</th><th>Name</th><th>Created</th></tr></thead><tbody>{loading ? <tr><td colSpan="3" className="text-center py-5"><Spinner size="sm" /> Loading categories…</td></tr> : rows.length ? rows.map((category) => <tr key={category.id}><td><Button size="sm" color="warning" aria-label={`Edit ${category.name}`} onClick={() => router.push(`/category/edit/${category.id}`)}><RiEditLine /></Button>{" "}<Button size="sm" color="danger" aria-label={`Delete ${category.name}`} onClick={() => removeCategory(category)}><RiDeleteBinLine /></Button></td><td>{category.name}</td><td>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "—"}</td></tr>) : <tr><td colSpan="3" className="text-center py-5">No categories match this search.</td></tr>}</tbody></table></div>
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3"><div className="d-flex align-items-center gap-2"><span>Rows</span><Input type="select" value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }} style={{ width: 90 }}><option>10</option><option>15</option><option>25</option><option>50</option></Input><span>{filtered.length} total</span></div><div className="d-flex align-items-center gap-2"><Button outline disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page} of {lastPage}</span><Button outline disabled={page >= lastPage} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
  </CardBody></Card>;
}
