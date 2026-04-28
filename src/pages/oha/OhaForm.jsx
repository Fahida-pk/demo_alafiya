import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
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
    if (details.length === 1) return alert("At least one item required");
    setDetails(details.filter((_, index) => index !== i));
  };

  // ================= SAVE =================
  const handleSave = async () => {
    const validItems = details.filter(d => d.item_id && d.quantity);
    if (!validItems.length) return alert("Add items");

    const method = id ? "PUT" : "POST";

    const res = await fetch(OHA_API, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...header, id })
    });

    const data = await res.json();
    const ohaId = id || data.id;

    await fetch(DETAILS_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oha_id: ohaId, items: validItems })
    });

    alert("OHA Saved ✅");
    navigate("/oha-list");
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
        <h2><MdInventory /> OHA</h2>

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
              <input
                placeholder="Search..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <div className="dropdown-options">
                {filterData(customers).map(c => (
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
                ))}
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
        <h2><MdInventory /> OHA Details</h2>

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
    <th>Reason</th>
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
                {filterData(items).map(it => (
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
                ))}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* QTY */}
      <td>
        <input
          value={d.quantity}
          onChange={e => handleChange(i, "quantity", e.target.value)}
        />
      </td>

      {/* BATCH */}
      <td>
        <input
          value={d.batch}
          onChange={e => handleChange(i, "batch", e.target.value)}
        />
      </td>

      {/* EXPIRY */}
      <td>
        <input
          type="date"
          value={d.expiry}
          onChange={e => handleChange(i, "expiry", e.target.value)}
        />
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

      <button className="oha-ui-save-btn" onClick={handleSave}>
        Save OHA
      </button>

    </div>
  </div>
);
};

export default OhaForm;