import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./DailyPicking.css";

const API = "https://zyntaweb.com/demoalafiya/api/daily_picking.php";
const UPDATE_API = "https://zyntaweb.com/demoalafiya/api/order_details.php";
const COMPANY_API = "https://zyntaweb.com/demoalafiya/api/company.php";

const DailyPicking = () => {

  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  // 🔥 COMPANY STATE
  const [company, setCompany] = useState({
    company_name: "",
    address: "",
    phone: ""
  });

  // 🔥 LOAD COMPANY
  useEffect(() => {
    fetch(COMPANY_API)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCompany({
            company_name: data.company_name || "",
            address: data.address || "",
            phone: data.phone || ""
          });
        }
      });
  }, []);

  // ✅ FETCH DATA
  useEffect(() => {
    if (date) {
      fetch(`${API}?date=${date}`)
        .then(res => res.json())
        .then(res => {
          const updated = res.map(d => {
            let qty = Number(d.qty);
            let picked = Number(d.picking_qty || 0);
            let back = qty - picked;

            let status = back === 0 ? "Completed" : "Pending";

            return { ...d, status };
          });
          setData(updated);
        });
    }
  }, [date]);

  // ✅ PICK CHANGE
  const handlePickChange = (index, value) => {
    let newData = [...data];

    let qty = Number(newData[index].qty);
    let picked = Number(value);

    if (picked > qty) {
      alert("Picking qty should be <= required qty");
      return;
    }

    newData[index].picking_qty = picked;

    let back = qty - picked;

    if (!newData[index].manual) {
      newData[index].status = back === 0 ? "Completed" : "Pending";
    }

    setData(newData);
  };

  // ✅ STATUS CHANGE
  const handleStatusChange = (index, value) => {
    let newData = [...data];
    newData[index].status = value;
    newData[index].manual = true;
    setData(newData);
  };

  // ✅ SAVE
  const handleSave = async () => {

    for (let d of data) {
      let status_id = 1;
      if (d.status === "Completed") status_id = 3;
      if (d.status === "Pending") status_id = 2;

      await fetch(UPDATE_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: d.id,
          picking_qty: d.picking_qty || 0,
          status_id: status_id,
          remark: d.remark || ""
        })
      });
    }

    const orderIds = [...new Set(data.map(d => d.order_id))];

    for (let id of orderIds) {
      await fetch("https://zyntaweb.com/demoalafiya/api/order_header.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          picking_done: 1
        })
      });
    }

    alert("Daily picking saved successfully");
  };

  const handlePrint = () => window.print();

  return (
    <div className="dp-pro-container">

      <div className="no-print">
        <TopNavbar />
      </div>

      <div className="dp-pro-card">

        {/* TITLE */}
        <h3 className="dp-pro-title no-print">Daily Picking</h3>

        {/* FILTER */}
        <div className="no-print" style={{ marginBottom: "15px" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="dp-pro-input"
          />
         
        </div>

        {/* 🔥 PRINT HEADER */}
        <div className="dp-print-header dp-print-only">
          <h2>{company.company_name}</h2>
          <p>{company.address}</p>
          <p>Phone: {company.phone}</p>

          <h3>DAILY PICKING REPORT</h3>
          <p>Date: {date}</p>
          <hr />
        </div>

        {/* TABLE */}
        <div className="dp-pro-table-container">
          <div className="dp-pro-table-body">
            <table className="dp-pro-table">
      <thead>
        <tr>
          <th>Sl No</th>
          <th>Customer Name</th>
          <th>Item Name</th>
          <th>Item Location</th>
          <th>Brand</th>
          <th>Qty Req</th>
          <th>Pick Qty</th>
          <th>Back Order</th>
          <th>Status</th>
          <th>Delivery Remarks</th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="10" style={{ textAlign: "center" }}>
              No Data
            </td>
          </tr>
        ) : (
          data.map((d, i) => {
            let picked = d.picking_qty || 0;
            let back = d.qty - picked;

            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.customer_name}</td>
                <td>{d.item_name}</td>
                <td>{d.location_name}</td>
                <td>{d.brand_name}</td>
                <td>{d.qty}</td>

               <td>
  <span className="print-only">{d.picking_qty || ""}</span>
  <input
    className="no-print"
    type="number"
    value={d.picking_qty > 0 ? d.picking_qty : ""}
    onChange={(e) => handlePickChange(i, e.target.value)}
  />
</td>

                <td style={{ textAlign: "center", fontWeight: "600" }}>
                  {back}
                </td>
<td>
  <span className="print-only">{d.status}</span>
  <select
    className="no-print"
    value={d.status}
    onChange={(e) => handleStatusChange(i, e.target.value)}
  >
    <option>Order Placed</option>
    <option>Completed</option>
    <option>Pending</option>
  </select>
</td><td>
  <span className="print-only">{d.remark}</span>
  <input className="no-print" value={d.remark || ""} readOnly />
</td>
              </tr>
            );
          })
        )}
      </tbody>

    </table>
          </div>
        </div>

       <div className="dp-btn-group no-print">
  
  {data.length > 0 && (
    <button className="dp-pro-btn" onClick={handleSave}>
      Save Picking
    </button>
  )}

  <button className="dp-pro-btn" onClick={handlePrint}>
    Print
  </button>

</div>
      </div>
    </div>
  );
};

export default DailyPicking;