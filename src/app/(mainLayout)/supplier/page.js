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

const AllSuppliers = () => {
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
    let res = await axios.get('/api/supplier', { withCredentials: true });
    if (res.status == 200) {
      setData(res.data.data);
    }
  }

  const handleView = () => {

  };
  const handleEdit = (id) => {
    route.push('/supplier/edit/' + id);
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
          <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => route.push('/supplier/create') }>Add</button>
        </div>
      </div>

      <Row>
        {/* <Col xl="1"></Col> */}
        <Col xl="12">
          <Card className={""}>
            <CardBody>
              <div className="title-header option-title">
                <h5>Supplier List</h5>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">S.N.</th>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Phone</th>
                      <th className="border px-4 py-2">Description</th>
                      <th className="border px-4 py-2">GstIn</th>
                      <th className="border px-4 py-2">Pin Code</th>
                      <th className="border px-4 py-2">City</th>
                      <th className="border px-4 py-2">Address</th>
                      {/* <th className="border px-4 py-2">Remarks</th> */}
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length ? (
                      data.map((product, index) => (
                        <tr key={product.id}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{product.name}</td>
                          <td className="border px-4 py-2">{product.phone}</td>
                          <td className="border px-4 py-2">{product.description}</td>
                          <td className="border px-4 py-2">{product.gstIn}</td>
                          <td className="border px-4 py-2">{product.pinCode}</td>
                          <td className="border px-4 py-2">{product.city}</td>
                          <td className="border px-4 py-2">{product.address}</td>
                          
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

export default AllSuppliers;