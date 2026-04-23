import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./OrderList.css";

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
    <div className="erp-container">

      <TopNavbar />

      <div className="erp-card">

        {/* HEADER */}
        <div className="erp-header">
          <h2 className="erp-title">Daily Picking</h2>
        </div>

        {/* DATE */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="erp-search"
          />
        </div>

        {/* TABLE */}
        <div className="erp-table-container">
          <div className="erp-table-body">

            <table className="erp-table">

              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Qty Req</th>
                  <th>Location</th>
                  <th>Pick Qty</th>
                  <th>Brand</th>
                  <th>Delivery Remarks</th>
                  <th>Back Order</th>
                  <th>Status</th>
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
                      <tr key={i} style={{ background: "#ffffff" }}>

                        <td>{i + 1}</td>
                        <td>{d.customer_name}</td>
                        <td>{d.item_name}</td>
                        <td>{d.qty}</td>
                        <td>{d.location_name}</td>

                        {/* PICK QTY */}
                        <td>
                          <input
                            type="number"
                            value={d.picking_qty || ""}
                            onChange={(e) =>
                              handlePickChange(i, e.target.value)
                            }
                            style={{ width: "60px" }}
                          />
                        </td>

                        <td>{d.brand_name}</td>

                        {/* REMARK */}
                        <td>
                          <input
                            value={d.remark || ""}
                            readOnly
                            style={{
                              width: "120px",
                              background: "#f5f5f5",
                              border: "1px solid #ccc"
                            }}
                          />
                        </td>

                        {/* BACK ORDER */}
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>
                          {back}
                        </td>

                        {/* STATUS */}
                        <td>
                          <select
                            value={d.status || "Order Placed"}
                            onChange={(e) =>
                              handleStatusChange(i, e.target.value)
                            }
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>
          </div>
        </div>

        {/* SAVE BUTTON */}
        {data.length > 0 && (
          <button className="erp-add-top" onClick={handleSave}>
            Save Picking
          </button>
        )}

      </div>
    </div>
  );
};

export default DailyPicking;