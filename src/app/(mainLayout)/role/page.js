"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Row, Col, Card, CardBody } from "reactstrap";
const AllRole = () => {

  const route = useRouter();
  const [state, setState] = useState([]);
  const [refreshState, setRefeshState] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleStateChange = (name, value) => {
    setState(prev => {
      return { ...prev, [name]: value }
    })
  }

  useEffect(() => {
    const initial = document.body.classList.contains("dark-only");
    setIsDarkMode(initial);
    fetchrole();
  }, [])

  useEffect(() => {
    const initial = document.body.classList.contains("dark-only");
    setIsDarkMode(initial);
    fetchrole();
    setRefeshState(false);
  }, [refreshState])

  const fetchrole = async () => {
    let res = await axios.get('/api/role', { withCredentials: true });
    if (res.status == 200) {
      setState(res.data.data);
    }
  }

  const handleView = () => {

  };
  const handleEdit = (id) => {
    route.push('/role/edit/' + id);
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
          <button className="px-4 py-2 btn btn-primary fs-5" onClick={() => route.push('/role/create')}>Add</button>
        </div>
      </div>
      <Row>
        <Col xl="2"></Col>
        <Col xl="8">
          <Card className={""}>
            <CardBody>
              <div className="title-header option-title">
                <h5>Role List</h5>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                <table className="min-w-full border border-gray-300 border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Permission</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state?.length ? (
                      state.map((role) => (
                        <tr key={role.id}>
                          <td className="border px-4 py-2">{role.name}</td>
                          <td className="border px-4 py-2">{role.sku}</td>
                          <td className="px-2">
                            <div className="d-flex gap-2">
                              <button onClick={() => handleView(role.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                              <button onClick={() => handleEdit(role.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">Edit</button>
                              <button onClick={() => handleDelete(role.id)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-danger">Delete</button>
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

export default AllRole;