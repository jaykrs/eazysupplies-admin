"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Row, Col, Card, CardBody } from "reactstrap";
import ShowModal from "@/elements/alerts&Modals/Modal";
import Btn from "@/elements/buttons/Btn";
import FormWrapper from "@/utils/hoc/FormWrapper";
import TaxForm from "@/components/tax/TaxForm";

const AllRoles = () => {
  const route = useRouter();
  const [data, setData] = useState([]);
  const [refreshState, setRefeshState] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [model, setModal] = useState(false);

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
    let res = await axios.get('/api/tax', { withCredentials: true });
    if (res.status == 200) {
      setData(res.data.data);
    }
  }

  const handleView = () => {

  };
  const handleEdit = (id) => {
    route.push('/tax/edit/' + id);
  };

  const handleDelete = () => {

  };

  return (
    <>
      <div className="w-100 d-flex flex-wrap justify-content-start m-4 fs-6" style={{ gap: "50px" }}>
      </div>
      <div className="w-100 d-flex justify-content-end fs-5 pb-2">
        <div className="w-50 d-flex justify-content-end gap-4">
          <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => setRefeshState(true)}>Search</button>
          <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => route.push('/tax/create') }>Add</button>
        </div>
      </div>

      <Row>
        <Col xl="2"></Col>
        <Col xl="8">
          <Card className={""}>
            <CardBody>
              <div className="title-header option-title">
                <h5>Tax List</h5>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Value</th>
                      <th className="border px-4 py-2">Description</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length ? (
                      data.map((product) => (
                        <tr key={product.id}>
                          <td className="border px-4 py-2">{product.name}</td>
                          <td className="border px-4 py-2">{product.value}</td>
                          <td className="border px-4 py-2">{product.description}</td>
                          <td className="px-4 py-2">
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
                          No Record found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AllRoles;