import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
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
    setDetails(details.filter((_, i) => i !== index));
  };

  // ================= SAVE =================
const handleSave = async () => {
  try {

    const method = id ? "PUT" : "POST";

    const res = await fetch(GRN_API, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...header,
        id: id   // 🔥 important
      })
    });

    const h = await res.json();

    const grnId = id ? id : h.id;

    if (!grnId) {
      alert("Header failed ❌");
      return;
    }

    // 🔥 EDIT mode → delete old details
    if (id) {
      await fetch(`${DETAILS_API}?grn_id=${id}`, {
        method: "DELETE"
      });
    }

    // INSERT DETAILS
    for (let d of details) {
      if (!d.item_id || !d.qty) continue;

      await fetch(DETAILS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grn_id: grnId,
          ...d
        })
      });
    }

    alert(id ? "GRN Updated ✅" : "GRN Saved ✅");

    navigate("/grn-list");

  } catch (err) {
    console.error(err);
    alert("Error saving GRN ❌");
  }
};

  return (
   <div className="order-ui-container">

  {/* HEADER */}
  <div className="order-ui-card">
    <div className="order-ui-header">
      <h2>📋 GRN</h2>

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
        <select
          value={header.supplier_id}
          onChange={e => setHeader({ ...header, supplier_id: e.target.value })}
        >
          <option value="">Select Supplier</option>

          {suppliers.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
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
          <h2>📦 GRN Details</h2>
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
                    <select
                      value={d.item_id}
                      onChange={e => handleItemChange(i, e.target.value)}
                    >
                      <option value="">Item</option>
                      {items.map(it => (
                        <option key={it.id} value={it.id}>{it.name}</option>
                      ))}
                    </select>
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
                    <select
                      value={d.location_id}
                      onChange={e => handleChange(i, "location_id", e.target.value)}
                    >
                      <option value="">Location</option>
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
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

              <select
                value={d.item_id}
                onChange={e => handleItemChange(i, e.target.value)}
              >
                <option value="">Item</option>
                {items.map(it => (
                  <option key={it.id} value={it.id}>{it.name}</option>
                ))}
              </select>

              <input
                placeholder="Qty"
                value={d.qty}
                onChange={e => handleChange(i, "qty", e.target.value)}
              />

              <input
                placeholder="Batch"
                value={d.batch}
                onChange={e => handleChange(i, "batch", e.target.value)}
              />

              <input
                type="date"
                value={d.expiry}
                onChange={e => handleChange(i, "expiry", e.target.value)}
              />

              <select
                value={d.location_id}
                onChange={e => handleChange(i, "location_id", e.target.value)}
              >
                <option value="">Location</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>

              <input
                placeholder="Remark"
                value={d.remark}
                onChange={e => handleChange(i, "remark", e.target.value)}
              />

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