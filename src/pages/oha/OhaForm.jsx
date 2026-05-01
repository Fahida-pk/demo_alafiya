import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdSearchOff } from "react-icons/md";
import { MdUndo } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { MdAssignmentReturn } from "react-icons/md";
import "./OhaForm.css";

const OHA_API = "https://zyntaweb.com/demoalafiya/api/oha_header.php";
const DETAILS_API = "https://zyntaweb.com/demoalafiya/api/oha_details.php";
const CUSTOMER_API = "https://zyntaweb.com/demoalafiya/api/customer.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";
const REASON_API = "https://zyntaweb.com/demoalafiya/api/return_reason_codes.php";

const OhaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ohaNumber, setOhaNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [reasons, setReasons] = useState([]);
const [loading, setLoading] = useState(false);
const [batchList, setBatchList] = useState([]);
const [showBatchModal, setShowBatchModal] = useState(false);
const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [header, setHeader] = useState({
    date: "",
    customer_id: "",
    remarks: ""
  });

  const [details, setDetails] = useState([
    {
      item_id: "",
      quantity: "",
      batch: "",
      expiry: "",
      location_id: "",
      return_reason_code_id: "",
      action: "",
      remarks: ""
    }
  ]);

  // 🔥 DROPDOWN CONTROL
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchText, setSearchText] = useState("");

  // ================= LOAD =================
  useEffect(() => {
    fetch(CUSTOMER_API).then(r => r.json()).then(d => setCustomers(d.data || d));
    fetch(ITEM_API).then(r => r.json()).then(d => setItems(d.data || d));
    fetch(LOCATION_API).then(r => r.json()).then(d => setLocations(d.data || d));
    fetch(REASON_API).then(r => r.json()).then(d => setReasons(d.data || d));
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`${OHA_API}?id=${id}`)
        .then(r => r.json())
        .then(d => {
          setOhaNumber(d.sl_no || "");
          setHeader({
            date: d.date || "",
            customer_id: d.customer_id || "",
            remarks: d.remarks || ""
          });
        });

      fetch(`${DETAILS_API}?oha_id=${id}`)
        .then(r => r.json())
        .then(d => setDetails(Array.isArray(d) ? d : []));
    } else {
      fetch(OHA_API + "?type=next_number")
        .then(r => r.json())
        .then(d => setOhaNumber(d.number || ""));
    }
  }, [id]);

  // ================= FUNCTIONS =================
  const addRow = () => {
    setDetails([...details, {
      item_id: "", quantity: "", batch: "",
      expiry: "", location_id: "",
      return_reason_code_id: "", action: "", remarks: ""
    }]);
  };

  const handleChange = (i, field, value) => {
    const updated = [...details];
    updated[i][field] = value;
    setDetails(updated);
  };

  const handleItemChange = (i, value) => {
    const item = items.find(x => x.id == value);
    const updated = [...details];
    updated[i].item_id = value;
    updated[i].location_id = item?.location_id || "";
    setDetails(updated);
  };

  const deleteRow = (i) => {
    setDetails(details.filter((_, index) => index !== i));
  };

  // ================= SAVE =================
 const handleSave = async () => {
  if (loading) return;

  try {
    setLoading(true);

    // ✅ VALIDATION
   // ✅ 1. At least one item
const hasItem = details.some(
  d => d.item_id && Number(d.quantity) > 0
);

if (!hasItem) {
  alert("Please add at least one item ❗");
  setLoading(false);
  return;
}

// ✅ 2. Required fields check
const invalidRow = details.find(
  d =>
    d.item_id &&
    Number(d.quantity) > 0 &&
    (!d.return_reason_code_id || !d.action)
);

if (invalidRow) {
  alert("Please select Reason and Action ❗");
  setLoading(false);
  return;
}

// ✅ 3. Final items
const validItems = details.filter(
  d => d.item_id && Number(d.quantity) > 0
);

    const method = id ? "PUT" : "POST";

    // ================= HEADER =================
    const res = await fetch(OHA_API, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...header,
        id
      })
    });

    let headerRes = {};
    const headerText = await res.text();

    try {
      headerRes = headerText ? JSON.parse(headerText) : {};
    } catch {
      alert("Header JSON error ❌");
      setLoading(false);
      return;
    }

    const ohaId = id ? id : headerRes.id;

    if (!ohaId) {
      alert("Header failed ❌");
      setLoading(false);
      return;
    }

    // ================= DETAILS =================
    const detailsMethod = id ? "PUT" : "POST";

    const detailsRes = await fetch(DETAILS_API, {
      method: detailsMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oha_id: ohaId,
        items: validItems.map(d => ({
          ...d,
          expiry: d.expiry || null // 🔥 FIX
        }))
      })
    });

    let detailsData = {};
    const text = await detailsRes.text();

    try {
      detailsData = text ? JSON.parse(text) : {};
    } catch {
      alert("Details JSON error ❌");
      setLoading(false);
      return;
    }

    if (detailsData.status !== "success") {
      alert(detailsData.message || "Failed to save items ❌");
      setLoading(false);
      return;
    }

    alert(id ? "OHA Updated ✅" : "OHA Saved ✅");

    navigate("/oha-list");

  } catch (err) {
    console.error(err);
    alert("Error saving OHA ❌");
  } finally {
    setLoading(false);
  }
};

  // ================= FILTER =================
  const filterData = (list) =>
    list.filter(x =>
      x.name?.toLowerCase().includes(searchText.toLowerCase())
    );

  // ================= UI =================
return (
  <div className="oha-ui-container">

    {/* HEADER */}
    <div className="oha-ui-card">

      <div className="oha-ui-header">
        <h2><FaUndo /> OHA</h2>

        <button
          className="oha-ui-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="oha-ui-grid">

        <input value={ohaNumber} readOnly />

        <input
          type="date"
          value={header.date}
          onChange={e => setHeader({ ...header, date: e.target.value })}
        />

       {/* CUSTOMER */}
<div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() => setActiveDropdown("customer")}
  >
    {header.customer_id
      ? customers.find(c => c.id == header.customer_id)?.name
      : "Select Customer"}
    <span className="arrow">▼</span>
  </div>

  {activeDropdown === "customer" && (
    <div className="dropdown-box">

      {/* 🔥 SEARCH */}
      <input
        placeholder="Search..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />

      <div className="dropdown-options">

        {filterData(customers).length > 0 ? (

          filterData(customers).map(c => (
            <div
              key={c.id}
              className="dropdown-option"
              onClick={() => {
                setHeader({ ...header, customer_id: c.id });
                setActiveDropdown(null);
                setSearchText("");
              }}
            >
              {c.name}
            </div>
          ))

        ) : (

          <div className="no-results">
            <MdSearchOff size={18} />
            No customer found
          </div>

        )}

      </div>
    </div>
  )}
</div>
        <input
          placeholder="Remarks"
          value={header.remarks}
          onChange={e => setHeader({ ...header, remarks: e.target.value })}
        />
      </div>
    </div>

    {/* DETAILS */}
    <div className="oha-ui-card">

      <div className="oha-ui-header">
<h2><MdAssignmentReturn /> OHA Details</h2>
        <button className="oha-ui-add-btn" onClick={addRow}>
          + Add Item
        </button>
      </div>

      {/* 🔥 IMPORTANT WRAPPER */}
      <div className="oha-ui-table-wrapper">

        <table className="oha-ui-table">
<thead>
  <tr>
    <th>Item</th>
    <th>Qty</th>
    <th>Batch</th>
    <th>Expiry</th>
    <th>Location</th>
    <th>Return Reason</th>
    <th>Action</th>
    <th>Remark</th>
    <th></th>
  </tr>
</thead>

          <tbody>
  {details.map((d, i) => (
    <tr key={i}>

      {/* ITEM */}
      <td>
        <div className="custom-dropdown">
          <div
            className="dropdown-display"
            onClick={() => setActiveDropdown("item" + i)}
          >
            {d.item_id
              ? items.find(it => it.id == d.item_id)?.name
              : "Select Item"}
            <span className="arrow">▼</span>
          </div>

          {activeDropdown === "item" + i && (
            <div className="dropdown-box">
              <input
                placeholder="Search item..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <div className="dropdown-options">

  {filterData(items).length > 0 ? (

    filterData(items).map(it => (
      <div
        key={it.id}
        className="dropdown-option"
        onClick={() => {
          handleItemChange(i, it.id);
          setActiveDropdown(null);
          setSearchText("");
        }}
      >
        {it.name}
      </div>
    ))

  ) : (

    <div className="no-results">
      <MdSearchOff size={18} />
      No item found
    </div>

  )}

</div>
            </div>
          )}
        </div>
      </td>

      {/* QTY */}
      <td>
       
          <input
  value={d.quantity || ""}
  onChange={(e) => {
    handleChange(i, "quantity", e.target.value);
  }}

  onBlur={async () => {
    const value = details[i].quantity;

    if (!value || value <= 0) return;

    if (!details[i].item_id) {
      alert("Select item first ❗");
      return;
    }

   const res = await fetch(
  `https://zyntaweb.com/demoalafiya/api/order_batches.php?item_id=${details[i].item_id}&customer_id=${header.customer_id}`
);

    const data = await res.json();
    const batches = Array.isArray(data) ? data : data.data || [];

    setBatchList(batches);
    setSelectedRowIndex(i);
    setShowBatchModal(true);
  }}
/>
        
      </td>

      {/* BATCH */}
     <td>
  <input value={d.batch || ""} readOnly />
</td>

<td>
  <input type="date" value={d.expiry || ""} readOnly />
</td>

      {/* LOCATION */}
      <td>
        <div className="custom-dropdown">
          <div
            className="dropdown-display"
            onClick={() => setActiveDropdown("loc" + i)}
          >
            {d.location_id
              ? locations.find(l => l.id == d.location_id)?.name
              : "Select Location"}
            <span className="arrow">▼</span>
          </div>

          {activeDropdown === "loc" + i && (
            <div className="dropdown-box">
              <input
                placeholder="Search location..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <div className="dropdown-options">
                {filterData(locations).map(l => (
                  <div
                    key={l.id}
                    className="dropdown-option"
                    onClick={() => {
                      handleChange(i, "location_id", l.id);
                      setActiveDropdown(null);
                      setSearchText("");
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

      {/* 🔥 REASON DROPDOWN */}
      <td>
        <select
          value={d.return_reason_code_id || ""}
          onChange={e =>
            handleChange(i, "return_reason_code_id", e.target.value)
          }
        >
          <option value="">Select Reason</option>
          {reasons.map(r => (
            <option key={r.id} value={r.id}>
              {r.code} - {r.description}
            </option>
          ))}
        </select>
      </td>

      {/* 🔥 ACTION DROPDOWN */}
      <td>
        <select
          value={d.action || ""}
          onChange={e => handleChange(i, "action", e.target.value)}
        >
          <option value="">Select</option>
          <option value="TO_STOCK">To Stock</option>
          <option value="NOT_TO_STOCK">Not To Stock</option>
        </select>
      </td>

      {/* REMARK */}
      <td>
        <input
          value={d.remarks}
          onChange={e => handleChange(i, "remarks", e.target.value)}
        />
      </td>

      {/* DELETE */}
      <td>
        <button
          className="oha-ui-delete-btn"
          onClick={() => deleteRow(i)}
        >
          <FaTrash />
        </button>
      </td>

    </tr>
  ))}
</tbody>
        </table>
</div>
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

              if (details[selectedRowIndex].quantity > (b.available_qty || b.qty)) {
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
            <div>{b.available_qty || b.qty}</div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowBatchModal(false)}>Close</button>
    </div>
  </div>
)}
{/* ================= MOBILE VIEW ================= */}
<div className="oha-ui-mobile">
  {details.map((d, i) => (

    <div key={i} className="oha-ui-item-card">

      {/* ITEM */}
      <div className="oha-field">
        <label>Item</label>

        <div className="custom-dropdown">
          <div
            className="dropdown-display"
            onClick={() => setActiveDropdown("item" + i)}
          >
            {d.item_id
              ? items.find(it => it.id == d.item_id)?.name
              : "Select Item"}
          </div>

          {activeDropdown === "item" + i && (
            <div className="dropdown-box">

              {/* 🔥 SEARCH */}
              <input
                placeholder="Search item..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />

              <div className="dropdown-options">
                {filterData(items).length > 0 ? (
                  filterData(items).map(it => (
                    <div
                      key={it.id}
                      className="dropdown-option"
                      onClick={() => {
                        handleItemChange(i, it.id);
                        setActiveDropdown(null);
                        setSearchText("");
                      }}
                    >
                      {it.name}
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    No item found
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* QTY */}
      <div className="oha-field">
        <label>Qty</label>
       <input
  value={d.quantity || ""}
  onChange={(e) => {
    handleChange(i, "quantity", e.target.value);
  }}

  onBlur={async () => {
    const value = details[i].quantity;

    if (!value || value <= 0) return;

    if (!details[i].item_id) {
      alert("Select item first ❗");
      return;
    }

    const res = await fetch(
  `https://zyntaweb.com/demoalafiya/api/order_batches.php?item_id=${details[i].item_id}&customer_id=${header.customer_id}`
);

    const data = await res.json();
    const batches = Array.isArray(data) ? data : data.data || [];

    setBatchList(batches);
    setSelectedRowIndex(i);
    setShowBatchModal(true);
  }}
/>
      </div>

      {/* BATCH */}
      <div className="oha-field">
        <label>Batch</label>
       <input value={d.batch || ""} readOnly />
      </div>

      {/* EXPIRY */}
      <div className="oha-field">
        <label>Expiry</label>
        <input
          type="date"
          value={d.expiry || ""}
          onChange={e => handleChange(i, "expiry", e.target.value)}
        />
      </div>

      {/* LOCATION */}
      <div className="oha-field">
        <label>Location</label>

        <div className="custom-dropdown">
          <div
            className="dropdown-display"
            onClick={() => setActiveDropdown("loc" + i)}
          >
            {d.location_id
              ? locations.find(l => l.id == d.location_id)?.name
              : "Select Location"}
          </div>

          {activeDropdown === "loc" + i && (
            <div className="dropdown-box">

              {/* 🔥 SEARCH */}
              <input
                placeholder="Search location..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />

              <div className="dropdown-options">
                {filterData(locations).length > 0 ? (
                  filterData(locations).map(l => (
                    <div
                      key={l.id}
                      className="dropdown-option"
                      onClick={() => {
                        handleChange(i, "location_id", l.id);
                        setActiveDropdown(null);
                        setSearchText("");
                      }}
                    >
                      {l.name}
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    No location found
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* REASON */}
      <div className="oha-field">
        <label>Reason</label>
        <select
          value={d.return_reason_code_id || ""}
          onChange={e =>
            handleChange(i, "return_reason_code_id", e.target.value)
          }
        >
          <option value="">Select Reason</option>
          {reasons.map(r => (
            <option key={r.id} value={r.id}>
              {r.code} - {r.description}
            </option>
          ))}
        </select>
      </div>

      {/* ACTION */}
      <div className="oha-field">
        <label>Action</label>
        <select
          value={d.action}
          onChange={e => handleChange(i, "action", e.target.value)}
        >
          <option value="">Select</option>
          <option value="TO_STOCK">To Stock</option>
          <option value="NOT_TO_STOCK">Not To Stock</option>
        </select>
      </div>

      {/* REMARK */}
      <div className="oha-field">
        <label>Remark</label>
        <input
          value={d.remarks}
          onChange={e => handleChange(i, "remarks", e.target.value)}
        />
      </div>

      {/* DELETE */}
      <button
        className="oha-ui-delete-btn"
        onClick={() => deleteRow(i)}
      >
        Delete
      </button>

    </div>

  ))}
</div>
<button
  className="oha-ui-save-btn"
  onClick={handleSave}
  disabled={loading}
>
  {loading
    ? (id ? "Updating..." : "Saving...")
    : (id ? "Update" : "Save")}
</button>
    </div>
  </div>
);
};

export default OhaForm;