import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useParams } from "react-router-dom";

import "./OrderForm.css";

const ORDER_API = "https://zyntaweb.com/demoalafiya/api/order_header.php";
const DETAILS_API = "https://zyntaweb.com/demoalafiya/api/order_details.php";

const CUSTOMER_API = "https://zyntaweb.com/demoalafiya/api/customer.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";
const BRAND_API = "https://zyntaweb.com/demoalafiya/api/brands.php";
const OrderForm = () => {
  const { id } = useParams();

const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [brands, setBrands] = useState([]);

  const [header, setHeader] = useState({
    date: "",
    customer_id: "",
    remarks: ""
  });

  const [details, setDetails] = useState([
    {
      item_id: "",
      qty: "",
      batch: "",
      expiry: "",
      location_id: "",
      brand_id: "",
      remark: ""
    }
  ]);
useEffect(() => {

  fetch(CUSTOMER_API)
    .then(r=>r.json())
    .then(data=>{
      setCustomers(Array.isArray(data) ? data : data.data || []);
    });

  fetch(ITEM_API)
    .then(r => r.json())
    .then(data => setItems(Array.isArray(data) ? data : data.data || []));

  fetch(LOCATION_API)
    .then(r => r.json())
    .then(data => setLocations(Array.isArray(data) ? data : data.data || []));

  fetch(BRAND_API)
    .then(r => r.json())
    .then(data => setBrands(Array.isArray(data) ? data : data.data || []));

}, []);

useEffect(() => {

  if (id) {
    // ✏️ EDIT
    fetch(`${ORDER_API}?id=${id}`)
      .then(res => res.json())
      .then(data => {
  console.log("EDIT:", data);

  // 🔥 MAIN FIX
  const order = Array.isArray(data) ? data[0] : data;

  setOrderNumber(order.number);

  setHeader({
    date: order.date,
    customer_id: order.customer_id,
    remarks: order.remarks
  });
});
  } else {
    // ➕ ADD
    fetch(ORDER_API + "?type=next_number")
      .then(res => res.json())
      .then(data => setOrderNumber(data.number));
  }

}, [id]);
  const addRow = () => {
    setDetails([...details, {
      item_id: "", qty: "", batch: "", expiry: "",
      location_id: "", brand_id: "", remark: ""
    }]);
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

 const handleSave = async () => {

  try {

    // 1️⃣ Save header
    const res = await fetch(ORDER_API, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(header)
    });

    const headerRes = await res.json();
    console.log("HEADER:", headerRes);

    const orderId = headerRes.id;

    if (!orderId) {
      alert("Order ID missing ❌");
      return;
    }

    // 2️⃣ Save details
    for (let d of details) {

      if (!d.item_id || !d.qty) continue;

      const res2 = await fetch(DETAILS_API, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          ...d,
          order_id: orderId
        })
      });

      const data2 = await res2.json();
      console.log("DETAIL INSERT:", data2);
    }

    alert("Order Saved ✅");

  } catch (err) {
    console.error(err);
    alert("Error saving ❌");
  }
};
  return (
    
    <div className="order-ui-container">

      {/* HEADER */}
      <div className="order-ui-card">
        <div className="order-ui-header">
          <h2>📋 Order Header</h2>

          <button
            className="order-ui-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
        <div className="order-ui-grid">

          <div className="order-ui-group">
            <label>Order No</label>
            <input
              value={
                orderNumber
                  ? "ORD" + String(orderNumber).replace(/\D/g, "").padStart(3, "0")
                  : ""
              }
              readOnly
            />
          </div>

          <div className="order-ui-group">
            <label>Date *</label>
            <input type="date"
              onChange={e=>setHeader({...header, date:e.target.value})}
            />
          </div>

          <div className="order-ui-group">
            <label>Customer *</label>
            <select
  value={header.customer_id}
  onChange={e=>setHeader({...header, customer_id:e.target.value})}
>
  <option value="">Select Customer</option>

  {customers.map(c => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>
          </div>

          <div className="order-ui-group">
            <label>Remarks</label>
            <input
              placeholder="Enter remarks"
              onChange={e=>setHeader({...header, remarks:e.target.value})}
            />
          </div>

        </div>
      </div>

      {/* ITEMS */}
      <div className="order-ui-card">

        <div className="order-ui-header">
          <h2>📦 Order Items</h2>
          <button className="order-ui-add-btn" onClick={addRow}>+ Add Item</button>
        </div>

        {/* MOBILE */}
        <div className="order-ui-mobile">
          {details.map((d, i) => (
            <div className="order-ui-item-card" key={i}>

              <label>Item</label>
              <select onChange={e=>handleDetailChange(i,"item_id",e.target.value)}>
                <option>Item</option>
                {items.map(it=>(
                  <option key={it.id} value={it.id}>{it.name}</option>
                ))}
              </select>

              <label>Qty</label>
              <input onChange={e=>handleDetailChange(i,"qty",e.target.value)} />

              <label>Batch</label>
              <input onChange={e=>handleDetailChange(i,"batch",e.target.value)} />

              <label>Expiry</label>
              <input type="date"
                onChange={e=>handleDetailChange(i,"expiry",e.target.value)}
              />

              <label>Location</label>
              <select onChange={e=>handleDetailChange(i,"location_id",e.target.value)}>
                <option>Location</option>
                {locations.map(l=>(
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>

              <label>Brand</label>
              <select onChange={e=>handleDetailChange(i,"brand_id",e.target.value)}>
                <option>Brand</option>
                {brands.map(b=>(
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <label>Remark</label>
              <input onChange={e=>handleDetailChange(i,"remark",e.target.value)} />

              <button
                className="order-ui-delete-btn"
                onClick={()=>setDetails(details.filter((_,index)=>index!==i))}
              >
                Delete
              </button>

            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="order-ui-table-wrapper">
          <table className="order-ui-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Location</th>
                <th>Brand</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {details.map((d,i)=>(
                <tr key={i}>
                  <td>
                    <select onChange={e=>handleDetailChange(i,"item_id",e.target.value)}>
                      <option>Item</option>
                      {items.map(it=>(
                        <option key={it.id} value={it.id}>{it.name}</option>
                      ))}
                    </select>
                  </td>

                  <td><input onChange={e=>handleDetailChange(i,"qty",e.target.value)} /></td>
                  <td><input onChange={e=>handleDetailChange(i,"batch",e.target.value)} /></td>
                  <td><input type="date" onChange={e=>handleDetailChange(i,"expiry",e.target.value)} /></td>

                  <td>
                    <select onChange={e=>handleDetailChange(i,"location_id",e.target.value)}>
                      <option>Location</option>
                      {locations.map(l=>(
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select onChange={e=>handleDetailChange(i,"brand_id",e.target.value)}>
                      <option>Brand</option>
                      {brands.map(b=>(
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      className="order-ui-remark"
                      onChange={e=>handleDetailChange(i,"remark",e.target.value)}
                    />
                  </td>

                  <td>
                    <button
                      className="order-ui-delete-btn"
                      onClick={()=>setDetails(details.filter((_,index)=>index!==i))}
                    >
                      🗑
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="order-ui-save-btn" onClick={handleSave}>
          Save Order
        </button>

      </div>
    </div>
  );
};

export default OrderForm;