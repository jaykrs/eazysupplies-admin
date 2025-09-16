"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

const AllUsers = () => {
  const route = useRouter();
  const [state, setState] = useState([]);
  const [refreshState, setRefeshState] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    let res = await axios.get('/api/auth/user_auth', { withCredentials: true });
    if (res.status == 200) {
      setState(res.data.data);
    }
  }
  const handleView = () => {

  };
  const handleEdit = (id) => {
    route.push('/user/edit/' + id);
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
          <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => route.push('/user/create')}>Add</button>
        </div>
      </div>
      <Row>
        <Col xl="1"></Col>
        <Col xl="11">
          <Card className={""}>
            <CardBody>
              <div className="title-header option-title">
                <h5>User List</h5>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Role</th>
                      <th className="border px-4 py-2">Country Code</th>
                      <th className="border px-4 py-2">Phone</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state?.length ? (
                      state.map((el) => (
                        <tr key={el.id}>
                          <td className="border px-4 py-2">{el.name}</td>
                          <td className="border px-4 py-2">{el.email}</td>
                          <td className="border px-4 py-2">{el.role?.name}</td>
                          <td className="border px-4 py-2">{el.countryCode}</td>
                          <td className="border px-4 py-2">{el.phone}</td>
                          <td>
                            <div className="d-flex gap-2 px-2">
                              <button onClick={() => handleView(el.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                              <button onClick={() => handleEdit(el.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button>
                              <button onClick={() => handleDelete(el.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-danger">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                      )
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No state found.
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

export default AllUsers;