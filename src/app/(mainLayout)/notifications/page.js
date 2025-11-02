"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

const AllNotifications = () => {
  const route = useRouter();
  const [notification, setNotification] = useState([]);
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
    let res = await axios.get('/api/notifications', { withCredentials: true });
    if (res.status == 200) {
      setNotification(res.data.notifications);

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
    { value: 'TOMATO notification', label: 'TOMATO notification' },
  ];

  const handleView = (el) => {
    // route.push('/notifications/view?id=' + el.id + '&name=' + el?.name + '&type=' + el.type + '&recepient=' + el.recepient + '&remarks=' + el.remarks + '&createdAt=' + el.createdAt + '&updatedAt=' + el.updatedAt);
    const query = new URLSearchParams({
      id: el.id,
      name: el.name ?? "",
      type: el.type ?? "",
      recepient: el.recepient ?? "",
      remarks: el.remarks ?? "",
      createdAt: el.createdAt ?? "",
      updatedAt: el.updatedAt ?? "",
    }).toString();

    route.push(`/notifications/view?${query}`);
  };
  return (
    <>

      <div className="w-100 d-flex justify-content-end fs-5">
        <div className="w-50 d-flex justify-content-end gap-4">
          <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => setRefeshState(true)}>Search</button>
          {/* <button className="px-2 py-1 btn btn-primary fs-4" onClick={() => route.push('/offer/create')}>Add</button> */}
        </div>
      </div>

      <div>
        Notification
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Recipient</th>
              <th className="border px-4 py-2">Remarks</th>
              <th className="border px-4 py-2">Created On</th>
              <th className="border px-4 py-2">Updated On</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {notification?.length ? (
              notification.map((offer) => {
                return (
                  <tr key={offer.id} style={offer?.readStatus ? { backgroundColor: "" } : { backgroundColor: "blue", color: "#fff" }}>
                    <td className="border px-4 py-2">{offer.name}</td>
                    <td className="border px-4 py-2">{offer.type}</td>
                    <td className="border px-4 py-2">{offer.recepient}</td>
                    <td className="border px-4 py-2">{offer?.remarks}</td>
                    <td className="border px-4 py-2">{offer?.createdAt
                      ? new Date(offer?.createdAt).toLocaleDateString()
                      : "-"}</td>
                    <td className="border px-4 py-2">{offer?.updatedAt
                      ? new Date(offer?.updatedAt).toLocaleDateString()
                      : "-"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleView(offer)} style={{ padding: "4px 6px", fontSize: "12px" }} className="btn btn-warning">View</button>
                      </div>
                    </td>
                  </tr>
                )
              }
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No notification found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AllNotifications;