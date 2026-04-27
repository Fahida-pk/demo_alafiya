import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import "./GrnForm.css";

const GRN_API = "https://zyntaweb.com/demoalafiya/api/grn_header.php";
const DETAILS_API = "https://zyntaweb.com/demoalafiya/api/grn_details.php";
const SUPPLIER_API = "https://zyntaweb.com/demoalafiya/api/suppliers.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";

const GrnForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grnNumber, setGrnNumber] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
const [supplierSearch, setSupplierSearch] = useState("");
const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
const [itemSearch, setItemSearch] = useState("");
const [showItemDropdown, setShowItemDropdown] = useState(false);

const [locationSearch, setLocationSearch] = useState("");
const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [header, setHeader] = useState({
    date: "",
    supplier_id: "",
    remarks: ""
  });

  const [details, setDetails] = useState([
    {
      item_id: "",
      qty: "",
      batch: "",
      expiry: "",
      location_id: "",
      remark: ""
    }
  ]);
const [loading, setLoading] = useState(false);
  // ================= LOAD MASTER DATA =================
  useEffect(() => {
    fetch(SUPPLIER_API)
      .then(r => r.json())
      .then(d => setSuppliers(Array.isArray(d) ? d : d.data || []));

    fetch(ITEM_API)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : d.data || []));

    fetch(LOCATION_API)
      .then(r => r.json())
      .then(d => setLocations(Array.isArray(d) ? d : d.data || []));
  }, []);

  // ================= LOAD EDIT / NEW =================
  useEffect(() => {
    if (id) {
      fetch(`${GRN_API}?id=${id}`)
        .then(r => r.json())
        .then(d => {
          setGrnNumber(d.invoice_no || "");
          setHeader({
            date: d.date || "",
            supplier_id: d.supplier_id || "",
            remarks: d.remarks || ""
          });
        });

      fetch(`${DETAILS_API}?grn_id=${id}`)
        .then(r => r.json())
        .then(d => setDetails(Array.isArray(d) ? d : []));
    } else {
      fetch(GRN_API + "?type=next_number")
        .then(r => r.json())
        .then(d => setGrnNumber(d.number || ""));
    }
  }, [id]);

  // ================= ADD ROW =================
  const addRow = () => {
    setDetails([
      ...details,
      {
        item_id: "",
        qty: "",
        batch: "",
        expiry: "",
        location_id: "",
        remark: ""
      }
    ]);
  };

  // ================= CHANGE =================
  const handleChange = (i, field, value) => {
    const updated = [...details];
    updated[i][field] = value;
    setDetails(updated);
  };

  // ================= AUTO LOCATION =================
  const handleItemChange = (i, value) => {
    const item = items.find(x => x.id == value);

    const updated = [...details];
    updated[i].item_id = value;
    updated[i].location_id = item?.location_id || "";

    setDetails(updated);
  };

  // ================= DELETE ROW =================
  const deleteRow = (index) => {
  if (details.length === 1) {
    alert("At least one item required ❗");
    return;
  }

  setDetails(details.filter((_, i) => i !== index));
  alert("Item deleted 🗑️");
};
  // ================= SAVE =================
const handleSave = async () => {
  if (loading) return;

  try {
    setLoading(true);

    // ✅ VALIDATION
    const validItems = details.filter(d => d.item_id && d.qty);

    if (validItems.length === 0) {
      alert("Please add at least one item ❗");
      return;
    }

    const method = id ? "PUT" : "POST";

    // ✅ SAVE HEADER
    const res = await fetch(GRN_API, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...header,
        id
      })
    });

    // 🔥 SAFE JSON
    let headerRes = {};
    const headerText = await res.text();

    try {
      headerRes = headerText ? JSON.parse(headerText) : {};
    } catch {
      alert("Header JSON error ❌");
      return;
    }

    const grnId = id ? id : headerRes.id;

    if (!grnId) {
      alert("Header failed ❌");
      return;
    }

    // ✅ SAVE DETAILS (same as ORDER)
    const detailsRes = await fetch(DETAILS_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grn_id: grnId,
        items: validItems
      })
    });

    // 🔥 SAFE JSON
    let detailsData = {};
    const text = await detailsRes.text();

    try {
      detailsData = text ? JSON.parse(text) : {};
    } catch {
      alert("Details JSON error ❌");
      return;
    }

    if (detailsData.status !== "success") {
      alert("Failed to save items ❌");
      return;
    }

    alert(id ? "GRN Updated ✅" : "GRN Saved ✅");

    navigate("/grn-list");

  } catch (err) {
    console.error(err);
    alert("Error saving GRN ❌");
  } finally {
    setLoading(false);
  }
};
const filteredSuppliers = suppliers.filter(s =>
  s.name.toLowerCase().includes(supplierSearch.toLowerCase())
);
const filteredItems = items.filter(i =>
  i.name.toLowerCase().includes(itemSearch.toLowerCase())
);

const filteredLocations = locations.filter(l =>
  l.name.toLowerCase().includes(locationSearch.toLowerCase())
);
  return (
   <div className="order-ui-container">

  {/* HEADER */}
  <div className="order-ui-card">
    <div className="order-ui-header">
<h2><BsBoxSeam /> GRN </h2>
      <button
        className="order-ui-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </div>

    <div className="order-ui-grid">

      {/* GRN NUMBER */}
      <div className="order-ui-group">
        <label>GRN No</label>
        <input
          value={
            grnNumber
              ? "GRN" + String(grnNumber).replace(/\D/g, "").padStart(3, "0")
              : ""
          }
          readOnly
        />
      </div>

      {/* DATE */}
      <div className="order-ui-group">
        <label>Date *</label>
        <input
          type="date"
          value={header.date}
          onChange={e => setHeader({ ...header, date: e.target.value })}
        />
      </div>

      {/* SUPPLIER */}
      <div className="order-ui-group">
        <label>Supplier *</label>
       <div className="custom-dropdown">
 <div
  className="dropdown-display"
  onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
>
  {header.supplier_id
    ? suppliers.find(s => s.id == header.supplier_id)?.name
    : ""}

  <span className="arrow">▼</span>
</div>

  {showSupplierDropdown && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search supplier..."
        value={supplierSearch}
        autoFocus
        onChange={(e) => setSupplierSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map(s => (
            <div
              key={s.id}
              className="dropdown-option"
              onClick={() => {
                setHeader({ ...header, supplier_id: s.id });
                setShowSupplierDropdown(false);
                setSupplierSearch("");
              }}
            >
              {s.name}
            </div>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  )}
</div>
      </div>

      {/* REMARKS */}
      <div className="order-ui-group">
        <label>Remarks</label>
        <input
          value={header.remarks}
          onChange={e => setHeader({ ...header, remarks: e.target.value })}
        />
      </div>

    </div>
  </div>

      {/* ================= DETAILS ================= */}
      <div className="grn-ui-card">

        <div className="grn-ui-header">
          <h2><MdInventory /> GRN Details</h2>
          <button className="grn-ui-add-btn" onClick={addRow}>
            + Add Item
          </button>
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="grn-ui-table-wrapper">
          <table className="grn-ui-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Location</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {details.map((d, i) => (
                <tr key={i}>
                  <td>
                  <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() => setShowItemDropdown(!showItemDropdown)}
  >
    {d.item_id
      ? items.find(it => it.id == d.item_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {showItemDropdown && (
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
              handleItemChange(i, it.id);
              setShowItemDropdown(false);
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

                  <td>
                    <input
                      value={d.qty}
                      onChange={e => handleChange(i, "qty", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      value={d.batch}
                      onChange={e => handleChange(i, "batch", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      type="date"
                      value={d.expiry}
                      onChange={e => handleChange(i, "expiry", e.target.value)}
                    />
                  </td>

                  <td>
                    <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
  >
    {d.location_id
      ? locations.find(l => l.id == d.location_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {showLocationDropdown && (
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
              handleChange(i, "location_id", l.id);
              setShowLocationDropdown(false);
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
                    <input
                      value={d.remark}
                      onChange={e => handleChange(i, "remark", e.target.value)}
                    />
                  </td>

                  <td>
                    <button className="grn-ui-delete-btn" onClick={() => deleteRow(i)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE VIEW ===== */}
     <div className="grn-ui-mobile">
  {details.map((d, i) => (
    <div key={i} className="grn-ui-item-card">

      <div className="grn-field">
        <label>Item</label>
       <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() => setShowItemDropdown(!showItemDropdown)}
  >
    {d.item_id
      ? items.find(it => it.id == d.item_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {showItemDropdown && (
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
              handleItemChange(i, it.id);
              setShowItemDropdown(false);
              setItemSearch("");
            }}
          >
            {it.name}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  )}
</div>
      </div>

      <div className="grn-field">
        <label>Qty</label>
        <input
          value={d.qty}
          onChange={e => handleChange(i, "qty", e.target.value)}
        />
      </div>

      <div className="grn-field">
        <label>Batch</label>
        <input
          value={d.batch}
          onChange={e => handleChange(i, "batch", e.target.value)}
        />
      </div>

      <div className="grn-field">
        <label>Expiry</label>
        <input
          type="date"
          value={d.expiry}
          onChange={e => handleChange(i, "expiry", e.target.value)}
        />
      </div>

      <div className="grn-field">
        <label>Location</label>
      <div className="custom-dropdown">
  <div
    className="dropdown-display"
    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
  >
    {d.location_id
      ? locations.find(l => l.id == d.location_id)?.name
      : ""}

    <span className="arrow">▼</span>
  </div>

  {showLocationDropdown && (
    <div className="dropdown-box">
      <input
        type="text"
        placeholder="Search location..."
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
        className="dropdown-search"
      />

      <div className="dropdown-options">
        {filteredLocations.length > 0 ? (
          filteredLocations.map(l => (
            <div
              key={l.id}
              className="dropdown-option"
              onClick={() => {
                handleChange(i, "location_id", l.id);
                setShowLocationDropdown(false);
                setLocationSearch("");
              }}
            >
              {l.name}
            </div>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  )}
</div>
      </div>

      <div className="grn-field">
        <label>Remark</label>
        <input
          value={d.remark}
          onChange={e => handleChange(i, "remark", e.target.value)}
        />
      </div>

      <button
        className="grn-ui-delete-btn"
        onClick={() => deleteRow(i)}
      >
        Delete
      </button>

    </div>
  ))}
</div>

        <button className="grn-ui-save-btn" onClick={handleSave}>
          Save GRN
        </button>

      </div>
    </div>
  );
};

export default GrnForm;