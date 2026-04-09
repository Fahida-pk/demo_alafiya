import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "./Locations.css"; // ✅ separate css

const API = "https://zyntaweb.com/demoalafiya/api/locations.php";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ id: "", name: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [nameError, setNameError] = useState("");

  // LOAD
  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setLocations(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // VALIDATION (same as brand 🔥)
  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm({ ...form, name: value });

    if (!value.trim()) {
      setNameError("Location name is required");
      return;
    }

    const duplicate = locations.find(
      (l) =>
        l.name.toLowerCase().trim() === value.toLowerCase().trim() &&
        l.id !== form.id
    );

    if (duplicate) {
      setNameError("Location already exists");
      return;
    }

    setNameError("");
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nameError || !form.name) {
      setMessage("Fix name error");
      setMessageType("error");
      autoHide();
      return;
    }

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(isEdit ? "Location updated ✅" : "Location added 🎉");
    setMessageType("success");
    autoHide();

    loadData();
    setShowModal(false);
    resetForm();
  };

  const autoHide = () => {
    setTimeout(() => setMessage(""), 3000);
  };

  const resetForm = () => {
    setForm({ id: "", name: "" });
    setIsEdit(false);
    setNameError("");
  };

  // EDIT
  const editItem = (l) => {
    setForm(l);
    setIsEdit(true);
    setShowModal(true);
  };

  // DELETE
const deleteItem = async (id) => {
  if (!window.confirm("Delete this location?")) return;

  const res = await fetch(`${API}?id=${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  // 🔥 ERROR HANDLE
  if (data.status === "error") {
    setMessage(data.message);   // "already used"
    setMessageType("error");
    autoHide();
    return;
  }

  // ✅ SUCCESS
  setMessage("Location deleted ❌");
  setMessageType("success");
  autoHide();

  loadData();
};

  // SEARCH
  const filtered = locations.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="location-page">
      <TopNavbar />

      {message && <div className={`location-message ${messageType}`}>{message}</div>}

      {/* ADD BUTTON */}
      <button
        className="add-location-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Location
      </button>

      {/* CARD */}
      <div className="location-list-card">
        <div className="card-header">
          <h3>📍 LOCATION LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📍</div>
            <p>No locations found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td data-label="Location Name">{l.name}</td>

                  <td data-label="Actions">
                    <button
                      className="location-edit-btn"
                      onClick={() => editItem(l)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="location-delete-btn"
                      onClick={() => deleteItem(l.id)}
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

      {/* MODAL */}
      {showModal && (
        <div className="location-modal-overlay">
          <div className="location-modal-box">
            <div className="location-modal-header">
              <h3>{isEdit ? "Update Location" : "Add Location"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="location-modal-body">
              <label>Location Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleNameChange}
                required
              />
              {nameError && <small className="error">{nameError}</small>}

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

export default Locations;