import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./OrderForm.css";
const ORDER_API = "https://zyntaweb.com/demoalafiya/api/order_header.php";
const DETAILS_API = "https://zyntaweb.com/demoalafiya/api/order_details.php";

const CUSTOMER_API = "https://zyntaweb.com/demoalafiya/api/customer.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";
const BRAND_API = "https://zyntaweb.com/demoalafiya/api/brands.php";

const OrderForm = () => {

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

  // 🔥 LOAD DATA + NEXT ORDER NUMBER
  useEffect(() => {
    fetch(CUSTOMER_API).then(r=>r.json()).then(setCustomers);
    fetch(ITEM_API).then(r=>r.json()).then(setItems);
    fetch(LOCATION_API).then(r=>r.json()).then(setLocations);
    fetch(BRAND_API).then(r=>r.json()).then(setBrands);

    fetch(ORDER_API + "?type=next_number")
      .then(res => res.json())
      .then(data => setOrderNumber(data.number));

  }, []);

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

  // 🔥 SAVE
  const handleSave = async () => {

    const res = await fetch(ORDER_API, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(header)
    });

    const headerRes = await res.json();

    const orderId = headerRes.id;
    if (!orderId) {
  alert("Order ID missing ❌");
  return;
}
    setOrderNumber(headerRes.number);

    // SAVE DETAILS
   for (let d of details) {

  // 🔥 EMPTY ROW SKIP
  if (!d.item_id || !d.qty) {
    console.log("Skipped empty row:", d);
    continue;
  }

  const res2 = await fetch(DETAILS_API, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      ...d,
      order_id: orderId,
      status_id: 1
    })
  });

  const data2 = await res2.json();
  console.log("DETAIL RESPONSE:", data2);
}

    alert("Order Saved ✅ " + headerRes.number);
  };

return (
  <div className="sales-container">
    <TopNavbar />

    {/* ===== HEADER ===== */}
    <div className="sales-card">

      <div className="sales-header">
        <h2>📋 Order Header</h2>
      </div>

      <div className="form-grid">

        {/* ORDER NUMBER FIX */}
        <div className="form-group">
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

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            onChange={e=>setHeader({...header, date:e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Customer *</label>
          <select onChange={e=>setHeader({...header, customer_id:e.target.value})}>
            <option>Select Customer</option>
            {customers.map(c=>(
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Remarks</label>
          <input
            placeholder="Enter remarks"
            onChange={e=>setHeader({...header, remarks:e.target.value})}
          />
        </div>

      </div>
    </div>

    {/* ===== ITEMS ===== */}
    <div className="sales-card">

      <div className="sales-header">
        <h2>📦 Order Items</h2>
        <button className="add-btn" onClick={addRow}>+ Add Item</button>
      </div>
{/* ✅ MOBILE VIEW */}
<div className="mobile-items">
  {details.map((d, i) => (
    <div className="item-card" key={i}>

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
      <input type="date" onChange={e=>handleDetailChange(i,"expiry",e.target.value)} />

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
        className="delete-btn"
        onClick={()=>{
          const newData = details.filter((_, index)=>index!==i);
          setDetails(newData);
        }}
      >
        Delete
      </button>

    </div>
  ))}
</div>
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Item *</th>
              <th>Qty *</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Location</th>
              <th>Brand</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {details.map((d, i)=>(
              <tr key={i}>

                <td>
                  <select onChange={e=>handleDetailChange(i,"item_id",e.target.value)}>
                    <option>Item</option>
                    {items.map(it=>(
                      <option key={it.id} value={it.id}>{it.name}</option>
                    ))}
                  </select>
                </td>

                <td>
                  <input onChange={e=>handleDetailChange(i,"qty",e.target.value)} />
                </td>

                <td>
                  <input onChange={e=>handleDetailChange(i,"batch",e.target.value)} />
                </td>

                <td>
                  <input
                    type="date"
                    onChange={e=>handleDetailChange(i,"expiry",e.target.value)}
                  />
                </td>

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

                {/* REMARK FULL WIDTH */}
                <td>
                  <input
                    className="remark-input"
                    onChange={e=>handleDetailChange(i,"remark",e.target.value)}
                  />
                </td>

                {/* ACTION CENTER */}
                <td>
                  <button
                    className="delete-btn"
                    onClick={()=>{
                      const newData = details.filter((_, index)=>index!==i);
                      setDetails(newData);
                    }}
                  >
                    🗑
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Order
      </button>

    </div>
  </div>
);
};

export default OrderForm;