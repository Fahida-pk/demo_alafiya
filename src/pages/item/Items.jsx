import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "./item.css";

const API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";

const Items = () => {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    id: "",
    item_code: "",
    name: "",
    unit: "",
    location_id: "",
  });

  // ✅ LOAD ITEMS
  const loadItems = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data.data || []);
  };

  // ✅ LOAD LOCATIONS
  const loadLocations = async () => {
    const res = await fetch(LOCATION_API);
    const data = await res.json();
    setLocations(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadItems();
    loadLocations();
  }, []);

  // ✅ FILTER (🔥 FIXED POSITION)
  const filtered = items.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ PAGINATION (AFTER FILTER)
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.status === "error") {
      setMessage(data.message);
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setMessage(isEdit ? "Item updated ✅" : "Item added 🎉");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);

    loadItems();
    setShowModal(false);
    resetForm();
  };

  // RESET
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

  // EDIT
  const editItem = (item) => {
    setForm({
      ...item,
      location_id: item.location_id || "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  // DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Item deleted ❌");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);

    loadItems();
  };

  return (
    <div className="item-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-item-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Item
      </button>

      <div className="item-list-card">
        <div className="item-card-header">
          <h3>📦 ITEM LIST</h3>

          <div className="item-search-wrapper">
            <input
              className="item-search-input"
              placeholder="Search item"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // ✅ reset page on search
              }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="item-no-data">
            <div className="item-no-data-icon">📦</div>
            <p>No items found.</p>
          </div>
        ) : (
          <div className="item-table-wrapper">
            <table className="item-table">
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
  {currentItems.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No items found
      </td>
    </tr>
  ) : (
    currentItems.map((i) => (
      <tr key={i.id}>
        <td data-label="Code">{i.item_code}</td>
        <td data-label="Item Name">{i.name}</td>
        <td data-label="Unit">{i.unit}</td>
        <td data-label="Location">{i.location_name || "-"}</td>

        <td data-label="Actions">
          <button
            className="item-edit-btn"
            onClick={() => editItem(i)}
          >
            ✏️
          </button>

          <button
            className="item-delete-btn"
            onClick={() => deleteItem(i.id)}
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>

            {/* ✅ PAGINATION */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ⬅ Prev
              </button>

              <span>
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="item-modal-overlay">
          <div className="item-modal-box">
            <div className="item-modal-header">
              <h3>{isEdit ? "Update Item" : "Add Item"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="item-modal-body">
              <label>Item Name *</label>
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

              <button className="item-save-btn">
                {isEdit ? "✏️ UPDATE ITEM" : "💾 ADD ITEM"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;