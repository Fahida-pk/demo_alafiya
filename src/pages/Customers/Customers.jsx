import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus } from "react-icons/fa";
import "./Customer.css";

const API = "https://zyntaweb.com/demoalafiya/api/customers.php";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    status: "ACTIVE",
  });

  // LOAD
  const loadCustomers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(isEdit ? "Customer updated ✅" : "Customer added 🎉");
    setMessageType("success");
    autoHide();

    loadCustomers();
    setShowModal(false);
    resetForm();
  };

  const autoHide = () => {
    setTimeout(() => setMessage(""), 3000);
  };

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      address: "",
      phone: "",
      status: "ACTIVE",
    });
    setIsEdit(false);
  };

  // EDIT
  const editCustomer = (c) => {
    setForm(c);
    setIsEdit(true);
    setShowModal(true);
  };

  // DELETE
  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Customer deleted ❌");
    setMessageType("success");
    autoHide();

    loadCustomers();
  };

  // SEARCH
  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="customer-page">
      <TopNavbar />

      {/* MESSAGE */}
      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      {/* ADD BUTTON */}
      <button
        className="add-customer-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Customer
      </button>

      {/* CARD */}
      <div className="customer-list-card">
        <div className="card-header">
          <h3>👥 CUSTOMER LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">👤</div>
            <p>No customers found.</p>
          </div>
        ) : (
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
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td data-label="Name">{c.name}</td>
                  <td data-label="Address">{c.address}</td>
                  <td data-label="Phone">{c.phone}</td>
                  <td data-label="Status">
                    <span className="status-active">{c.status}</span>
                  </td>
                  <td data-label="Actions">
                    <button
                      className="edit-btn"
                      onClick={() => editCustomer(c)}
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteCustomer(c.id)}
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
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Customer" : "Add Customer"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
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
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
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

export default Customers;