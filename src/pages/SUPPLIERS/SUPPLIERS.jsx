import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../Customers/Customer.css";

const API = "https://zyntaweb.com/demoalafiya/api/suppliers.php";
const STATUS_API = "https://zyntaweb.com/demoalafiya/api/status.php";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    status_id: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  // LOAD DATA
  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setSuppliers(data);
  };

  const loadStatus = async () => {
    const res = await fetch(STATUS_API);
    const data = await res.json();
    setStatusList(data);
  };

  useEffect(() => {
    loadData();
    loadStatus();
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setForm({ ...form, phone: "+" + value });
  };

  // SUBMIT
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

  // EDIT
  const editItem = (s) => {
    setForm(s);
    setIsEdit(true);
    setShowModal(true);
  };

  // DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="customer-page">
      <TopNavbar />

      {message && <div className="message-box success">{message}</div>}

      <button className="add-customer-top" onClick={() => setShowModal(true)}>
        <FaPlus /> Add Supplier
      </button>

      <div className="customer-list-card">
        <h3>🏢 SUPPLIER LIST</h3>

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
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.phone}</td>
                <td>
                  <span className="status-active">{s.status}</span>
                </td>
                <td>
                  <button onClick={() => editItem(s)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(s.id)}>
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
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEdit ? "Edit" : "Add"} Supplier</h3>

            <form onSubmit={handleSubmit}>
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
                name="status_id"
                value={form.status_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                {statusList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.status}
                  </option>
                ))}
              </select>

              <button>Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;