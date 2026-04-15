import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "../Customers/Customer.css";

const API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";

const Items = () => {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]); // 🔥 NEW
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    id: "",
    item_code: "",
    name: "",
    unit: "",
    location_id: "",
  });

  // ================= LOAD ITEMS =================
  const loadItems = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  // ================= LOAD LOCATIONS =================
  const loadLocations = async () => {
    const res = await fetch(LOCATION_API);
    const data = await res.json();
    setLocations(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadItems();
    loadLocations(); // 🔥 IMPORTANT
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(isEdit ? "Item updated ✅" : "Item added 🎉");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);

    loadItems();
    setShowModal(false);
    resetForm();
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      id: "",
      item_code: "",
      name: "",
      unit: "",
      location_id: "",
    });
    setIsEdit(false);
  };

  // ================= EDIT =================
  const editItem = (item) => {
    setForm({
      ...item,
      location_id: item.location_id || "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Item deleted ❌");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);

    loadItems();
  };

  // ================= SEARCH =================
  const filtered = items.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-customer-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Item
      </button>

      <div className="customer-list-card">
        <div className="card-header">
          <h3>📦 ITEM LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📦</div>
            <p>No items found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
  {filtered.map((i) => (
    <tr key={i.id}>
      <td data-label="Code">{i.item_code}</td>

      <td data-label="Name">{i.name}</td>

      <td data-label="Unit">{i.unit}</td>

      {/* ✅ SHOW NAME */}
      <td data-label="Location">{i.location_name || "-"}</td>

      <td data-label="Actions">
        <button className="edit-btn" onClick={() => editItem(i)}>
          <FaEdit />
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteItem(i.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Item" : "Add Item"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Item Code *</label>
              <input
                name="item_code"
                value={form.item_code}
                onChange={handleChange}
                required
              />

              <label>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Unit *</label>
              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
              />

              {/* 🔥 DROPDOWN */}
              <label>Location *</label>
              <select
                name="location_id"
                value={form.location_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>

                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>

              <button className="save-btn">
                {isEdit ? "UPDATE" : "SAVE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;