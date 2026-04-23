import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./DailyPicking.css";

const API = "https://zyntaweb.com/demoalafiya/api/daily_picking.php";
const UPDATE_API = "https://zyntaweb.com/demoalafiya/api/order_details.php";

const DailyPicking = () => {

  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

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

  return {
    ...d,
    status
  };
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

    // ✅ AUTO STATUS (CORRECT LOGIC)
    if (!newData[index].manual) {
if (!newData[index].manual) {

  if (back === 0) {
    newData[index].status = "Completed";
  } else {
    newData[index].status = "Pending";
  }

}
    }

    setData(newData);
  };

  // ✅ MANUAL STATUS CHANGE
  const handleStatusChange = (index, value) => {
    let newData = [...data];
    newData[index].status = value;
    newData[index].manual = true;
    setData(newData);
  };

  // ✅ SAVE
  const handleSave = async () => {

    for (let d of data) {

      let status_id = 1; // Order Placed

      if (d.status === "Completed") status_id = 2;
      if (d.status === "Pending") status_id = 3;

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

    alert("Saved ✅");
  };

 return (
    <div className="dp-pro-container">

      <TopNavbar />

      <div className="dp-pro-card">

        {/* HEADER */}
        <div className="dp-pro-header">
          <h2 className="dp-pro-title">Daily Picking</h2>
        </div>

        {/* DATE */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="dp-pro-input"
          />
        </div>

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
                  <input
                    type="number"
                    value={d.picking_qty > 0 ? d.picking_qty : ""}
                    onChange={(e) => handlePickChange(i, e.target.value)}
                  />
                </td>

                <td style={{ textAlign: "center", fontWeight: "600" }}>
                  {back}
                </td>

                <td>
                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(i, e.target.value)}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </td>

                <td>
                  <input value={d.remark || ""} readOnly />
                </td>
              </tr>
            );
          })
        )}
      </tbody>

    </table>
  </div>
</div>

        {/* SAVE */}
        {data.length > 0 && (
          <button className="dp-pro-btn" onClick={handleSave}>
            Save Picking
          </button>
        )}

      </div>
    </div>
  );
};

export default DailyPicking;