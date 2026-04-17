import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Supplier.css";

const API = "https://zyntaweb.com/demoalafiya/api/suppliers.php";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
  });

  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  // ================= LOAD =================
  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setSuppliers(Array.isArray(data) ? data : []);
  };

 

  useEffect(() => {
    loadData();
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setForm({ ...form, phone: "+" + value });
  };

  // ================= SEARCH FILTER 🔥 =================
  const filtered = suppliers.filter((s) =>
    `${s.name} ${s.phone} ${s.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(isEdit ? "Updated ✅" : "Added 🎉");
    setTimeout(() => setMessage(""), 3000);

    loadData();
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      address: "",
      phone: "",
      status_id: "",
    });
    setIsEdit(false);
  };

  // ================= EDIT =================
  const editItem = (s) => {
    setForm(s);
    setIsEdit(true);
    setShowModal(true);
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    if (!window.confirm("Delete?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="supplier-page">
      <TopNavbar />

      {message && <div className="supplier-message success">{message}</div>}

      {/* ADD BUTTON */}
      <button
        className="add-supplier-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Supplier
      </button>

      {/* CARD */}
      <div className="supplier-list-card">
        {/* HEADER + SEARCH */}
        <div className="card-header">
          <h3>🏢 SUPPLIER LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search supplier"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td data-label="Name">{s.name}</td>
                <td data-label="Address">{s.address}</td>
                <td data-label="Phone">{s.phone}</td>

                <td data-label="Status">
                  <span
                    className={`supplier-status ${s.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {s.status}
                  </span>
                </td>

                <td data-label="Actions">
                  <button
                    className="supplier-edit-btn"
                    onClick={() => editItem(s)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="supplier-delete-btn"
                    onClick={() => deleteItem(s.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="supplier-modal-overlay">
          <div className="supplier-modal-box">
            <div className="supplier-modal-header">
              <h3>{isEdit ? "Update Supplier" : "Add Supplier"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="supplier-modal-body">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />

              <label>Phone</label>
              <PhoneInput
                country="in"
                value={form.phone}
                onChange={handlePhoneChange}
              />

              <label>Status</label>
             <select
  name="status"
  value={form.status}
  onChange={handleChange}
  required
>
  <option value="ACTIVE">ACTIVE</option>
  <option value="INACTIVE">INACTIVE</option>
</select>

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;