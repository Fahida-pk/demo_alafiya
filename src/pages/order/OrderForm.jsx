import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useLocation } from "react-router-dom";
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
const location = useLocation();
const [customerSearch, setCustomerSearch] = useState("");
const [activeCustomer, setActiveCustomer] = useState(false);
const [batchPopup, setBatchPopup] = useState([]);
const [activeBatchIndex, setActiveBatchIndex] = useState(null);
const [itemSearch, setItemSearch] = useState("");
const [activeItemIndex, setActiveItemIndex] = useState(null);

const [locationSearch, setLocationSearch] = useState("");
const [activeLocationIndex, setActiveLocationIndex] = useState(null);
const [showBatchModal, setShowBatchModal] = useState(false);
const [selectedRowIndex, setSelectedRowIndex] = useState(null);
const [batchList, setBatchList] = useState([]);
const [brandSearch, setBrandSearch] = useState("");
const [activeBrandIndex, setActiveBrandIndex] = useState(null);
const isView = new URLSearchParams(location.search).get("view") === "true";
  const [header, setHeader] = useState({
    date: "",
    customer_id: "",
    remarks: ""
  });
const [loading, setLoading] = useState(false);
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

// ✅ LOAD EDIT DATA (HEADER + DETAILS)
useEffect(() => {
  if (id) {
    // HEADER
    fetch(`${ORDER_API}?id=${id}`)
      .then(res => res.json())
      .then(data => {
        const order = Array.isArray(data) ? data[0] : data;

        setOrderNumber(order.number);

        setHeader({
          date: order.date || "",
          customer_id: order.customer_id || "",
          remarks: order.remarks || ""
        });
      });

    // ✅ DETAILS (FIX)
    fetch(`${DETAILS_API}?order_id=${id}`)
      .then(res => res.json())
      .then(data => {
        setDetails(Array.isArray(data) ? data : data.data || []);
      });

  } else {
    // ADD MODE
    fetch(ORDER_API + "?type=next_number")
      .then(res => res.json())
      .then(data => setOrderNumber(data.number));
  }
}, [id]);
const addRow = () => {
  setDetails([...details, {
    id: null, // 🔥 MUST
    item_id: "",
    qty: "",
    batch: "",
    expiry: "",
    location_id: "",
    brand_id: "",
    remark: ""
  }]);
};

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

const handleSave = async () => {
  try {

    // ✅ VALIDATION
// 🔥 FILTER ONLY VALID ITEMS
const validItems = details.filter(d => d.item_id && d.qty);

if (validItems.length === 0) {
  alert("Please enter at least one item ❗");
  return;
}

// 🔥 MAP AFTER FILTER
const formattedItems = validItems.map(d => ({
  item_id: d.item_id,
  qty: d.qty,
  batch: d.batch || "",
  expiry: d.expiry || null,
  location_id: d.location_id || null,
  brand_id: d.brand_id || null,
  remark: d.remark || ""
}));
    if (validItems.length === 0) {
      alert("Please enter at least one item ❗");
      return;
    }

    let method = id ? "PUT" : "POST";

    // ✅ SAVE HEADER
    const res = await fetch(ORDER_API, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...header,
        id: id
      })
    });

    const headerRes = await res.json();
    const orderId = id ? id : headerRes.id;

    // ✅ SAVE DETAILS
    await fetch(DETAILS_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        items: validItems
      })
    });

    alert(id ? "Order Updated ✅" : "Order Saved ✅");

    // 🔥 AFTER SAVE RESET FORM
    if (!id) {
      // clear header
      setHeader({
        date: "",
        customer_id: "",
        remarks: ""
      });

      // reset details (1 empty row)
      setDetails([
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

      // 🔥 LOAD NEXT ORDER NUMBER
      const nextRes = await fetch(ORDER_API + "?type=next_number");
      const nextData = await nextRes.json();
      setOrderNumber(nextData.number);
    }

  } catch (err) {
    console.error(err);
    alert("Error ❌");
  }
};
  const filteredCustomers = customers.filter(c =>
  c.name.toLowerCase().includes(customerSearch.toLowerCase())
);

const filteredItems = items.filter(i =>
  i.name.toLowerCase().includes(itemSearch.toLowerCase())
);

const filteredLocations = locations.filter(l =>
  l.name.toLowerCase().includes(locationSearch.toLowerCase())
);

const filteredBrands = brands.filter(b =>
  b.name.toLowerCase().includes(brandSearch.toLowerCase())
);
const handleItemChange = async (i, value) => {
  const item = items.find(x => x.id == value);

  const updated = [...details];
  updated[i].item_id = value;
  updated[i].location_id = item?.location_id || "";

  setDetails(updated);

  // 🔥 CALL YOUR API HERE
  const res = await fetch(
  `https://zyntaweb.com/demoalafiya/api/stock_batches.php?item_id=${details[i].item_id}`
);

const data = await res.json();

console.log("BATCH DATA:", data); // 🔥 ADD THIS

const batches = Array.isArray(data)
  ? data
  : data.data || data.batches || [];

setBatchList(batches);
  setBatchPopup(Array.isArray(data) ? data : data.data || []);
  setActiveBatchIndex(i); // 🔥 open popup
};
  return (
    <div className="order-ui-container">

      {/* HEADER */}
      <div className="order-ui-card">
        <div className="order-ui-header">
          <h2>📋 Order </h2>

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
            <input
  type="date"
  value={header.date}
  onChange={e => setHeader({ ...header, date: e.target.value })}
/>
          </div>

          <div className="order-ui-group">
            <label>Customer *</label>
       <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() => setActiveCustomer(!activeCustomer)}
  >
    {header.customer_id
      ? customers.find(c => c.id == header.customer_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeCustomer && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search customer..."
        value={customerSearch}
        onChange={(e) => setCustomerSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredCustomers.map(c => (
          <div
            key={c.id}
            className="dropdown-option"
            onClick={() => {
              setHeader({ ...header, customer_id: c.id });
              setActiveCustomer(false);
              setCustomerSearch("");
            }}
          >
            {c.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
          </div>

          <div className="order-ui-group">
            <label>Remarks</label>
            <input
  value={header.remarks}
  onChange={e => setHeader({ ...header, remarks: e.target.value })}
/>
          </div>

        </div>
      </div>

      {/* ITEMS */}
      <div className="order-ui-card">

        <div className="order-ui-header">
          <h2>📦 Order Details</h2>
{!isView && (
  <button className="order-ui-add-btn" onClick={addRow}>
    + Add Item
  </button>
)}        </div>

        {/* MOBILE */}
        <div className="order-ui-mobile">
  {details.map((d, i) => (
    <div className="order-ui-item-card" key={i}>

      <label>Item</label>
     <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() =>
      setActiveItemIndex(activeItemIndex === i ? null : i)
    }
  >
    {d.item_id
      ? items.find(it => it.id == d.item_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeItemIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search item..."
        value={itemSearch}
        onChange={(e) => setItemSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredItems.map(it => (
          <div
            key={it.id}
            className="dropdown-option"
            onClick={() => {
              handleItemChange(i, it.id);   // 🔥 auto location
              setActiveItemIndex(null);
              setItemSearch("");
            }}
          >
            {it.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
<label>Qty</label>
<input
  value={d.qty || ""}
  onChange={async (e) => {
    const value = e.target.value;

    handleDetailChange(i, "qty", value);

    if (!value || value <= 0) return;

    if (!details[i].item_id) {
      alert("Select item first ❗");
      return;
    }

    // 🔥 ALWAYS fetch (even in edit)
    const res = await fetch(
      `https://zyntaweb.com/demoalafiya/api/stock_batches.php?item_id=${details[i].item_id}`
    );

    const data = await res.json();
    const batches = Array.isArray(data) ? data : data.data || [];

    setBatchList(batches);
    setSelectedRowIndex(i);
    setShowBatchModal(true);
  }}

  // ✅ ADD THIS (VERY IMPORTANT 🔥)
  onFocus={async () => {
    if (!details[i].item_id) return;

    const res = await fetch(
      `https://zyntaweb.com/demoalafiya/api/stock_batches.php?item_id=${details[i].item_id}`
    );

    const data = await res.json();
    const batches = Array.isArray(data) ? data : data.data || [];

    setBatchList(batches);
    setSelectedRowIndex(i);
    setShowBatchModal(true);
  }}
/>
      <label>Batch</label>
     <input
  value={d.batch || ""}
  readOnly
/>

      <label>Expiry</label>
      <input
  type="date"
  value={d.expiry || ""}
  readOnly
/>

      <label>Location</label>
      <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() =>
      setActiveLocationIndex(activeLocationIndex === i ? null : i)
    }
  >
    {d.location_id
      ? locations.find(l => l.id == d.location_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeLocationIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search location..."
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredLocations.map(l => (
          <div
            key={l.id}
            className="dropdown-option"
            onClick={() => {
              handleDetailChange(i, "location_id", l.id);
              setActiveLocationIndex(null);
              setLocationSearch("");
            }}
          >
            {l.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      <label>Brand</label>
     <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() =>
      setActiveBrandIndex(activeBrandIndex === i ? null : i)
    }
  >
    {d.brand_id
      ? brands.find(b => b.id == d.brand_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeBrandIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search brand..."
        value={brandSearch}
        onChange={(e) => setBrandSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredBrands.map(b => (
          <div
            key={b.id}
            className="dropdown-option"
            onClick={() => {
              handleDetailChange(i, "brand_id", b.id);
              setActiveBrandIndex(null);
              setBrandSearch("");
            }}
          >
            {b.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      <label>Remark</label>
      <input
        value={d.remark || ""}
        onChange={e => handleDetailChange(i, "remark", e.target.value)}
      />
{isView ? (
  <button className="order-ui-view-btn" disabled>
    <FaEye />
  </button>
) : (
  <button
    className="order-ui-delete-btn"
    onClick={() => setDetails(details.filter((_, index) => index !== i))}
  >
    <FaTrash />
  </button>
)}


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
                {!isView && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
  {details.map((d, i) => (
    <tr key={i}>
      <td>
       <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() =>
      setActiveItemIndex(activeItemIndex === i ? null : i)
    }
  >
    {d.item_id
      ? items.find(it => it.id == d.item_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeItemIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search item..."
        value={itemSearch}
        onChange={(e) => setItemSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredItems.map(it => (
          <div
            key={it.id}
            className="dropdown-option"
            onClick={() => {
              handleItemChange(i, it.id); // 🔥 auto location
              setActiveItemIndex(null);
              setItemSearch("");
            }}
          >
            {it.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
      </td>

<td style={{ position: "relative" }}>

  <input
    value={d.qty || ""}
  onChange={async (e) => {
  const value = e.target.value;
  handleDetailChange(i, "qty", value);

  if (!value || value <= 0) return;
  if (showBatchModal) return;

  if (!details[i].item_id) {
    alert("Select item first ❗");
    return;
  }

  const res = await fetch(
    `https://zyntaweb.com/demoalafiya/api/stock_batches.php?item_id=${details[i].item_id}`
  );

  const data = await res.json();
  const batches = Array.isArray(data) ? data : data.data || [];

  setBatchList(batches);
  setSelectedRowIndex(i);
  setShowBatchModal(true);
}}
  />

</td>
<td>
  <input value={d.batch || ""} readOnly />
</td>
      <td>
        <input
          type="date"
          value={d.expiry || ""}
          readOnly
        />
      </td>

      <td>
       <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() =>
      setActiveLocationIndex(activeLocationIndex === i ? null : i)
    }
  >
    {d.location_id
      ? locations.find(l => l.id == d.location_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeLocationIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search location..."
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredLocations.map(l => (
          <div
            key={l.id}
            className="dropdown-option"
            onClick={() => {
              handleDetailChange(i, "location_id", l.id);
              setActiveLocationIndex(null);
              setLocationSearch("");
            }}
          >
            {l.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
      </td>

      <td>
       <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() =>
      setActiveBrandIndex(activeBrandIndex === i ? null : i)
    }
  >
    {d.brand_id
      ? brands.find(b => b.id == d.brand_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {activeBrandIndex === i && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search brand..."
        value={brandSearch}
        onChange={(e) => setBrandSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredBrands.map(b => (
          <div
            key={b.id}
            className="dropdown-option"
            onClick={() => {
              handleDetailChange(i, "brand_id", b.id);
              setActiveBrandIndex(null);
              setBrandSearch("");
            }}
          >
            {b.name}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
      </td>

      <td>
        <input
          value={d.remark || ""}
          onChange={e => handleDetailChange(i, "remark", e.target.value)}
        />
      </td>

      {!isView && (
  <td>
    <button
      className="order-ui-delete-btn"
      onClick={() => setDetails(details.filter((_, index) => index !== i))}
    >
      <FaTrash />
    </button>
  </td>
)}
    </tr>
  ))}
</tbody>
          </table>
        </div>

        {!isView && (
  <button className="order-ui-save-btn" onClick={handleSave}>
  {id ? "Update Order" : "Save Order"}
</button>
)}
 {/* ✅ ONLY ONE MODAL HERE */}
    {showBatchModal && (
        <div className="batch-modal-overlay">

      <div className="batch-modal-box">

  <h3>Select Batch</h3>

  <div className="batch-table">
    <div className="batch-header">
      <div>Batch</div>
      <div>Expiry</div>
      <div>Stock</div>
    </div>

    {batchList.map((b, index) => (
      <div
        key={index}
        className="batch-row-item"
        onClick={() => {

          if (details[selectedRowIndex].qty > (b.available_qty || b.qty)) {
            alert("Stock not enough ❗");
            return;
          }

          const updated = [...details];

          updated[selectedRowIndex].batch = b.batch;
          updated[selectedRowIndex].expiry = b.expiry_date || b.expiry;

          setDetails(updated);
          setShowBatchModal(false);
        }}
      >
        <div>{b.batch}</div>
        <div>{b.expiry_date || b.expiry}</div>
        <div>
  {(b.available_qty ?? b.qty ?? (b.quantity_in - b.quantity_out)) || 0}
</div>
      </div>
    ))}
  </div>

  {/* ✅ CLOSE BUTTON */}
  <div style={{ textAlign: "right", marginTop: "10px" }}>
    <button
      onClick={() => setShowBatchModal(false)}
      className="modal-close-btn"
    >
      Close
    </button>
  </div>
</div>

</div>
    )}

  </div>
      </div>
  );
};

export default OrderForm;