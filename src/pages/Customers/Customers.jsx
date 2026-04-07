import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Customer.css";
// ✅ FIXED API
const API = "https://zyntaweb.com/demoalafiya/api/customer.php";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ✅ NEW STATES
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

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

  // ================= NAME VALIDATION =================
  const handleNameChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (!value.trim()) {
      setNameError("Customer name is required");
      return;
    }

    const duplicate = customers.find(
      (c) =>
        c.name.toLowerCase().trim() === value.toLowerCase().trim() &&
        c.id !== form.id
    );

    if (duplicate) {
      setNameError("Customer name already exists");
      return;
    }

    setNameError("");
  };

  // ================= NORMAL CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= PHONE VALIDATION =================
  const handlePhoneChange = (value, country) => {
    const fullNumber = "+" + value;
    setForm({ ...form, phone: fullNumber });

    const localNumber = value.slice(country.dialCode.length);

    if (!localNumber) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!/^\d+$/.test(localNumber)) {
      setPhoneError("Only digits allowed");
      return;
    }

    // India
    if (country.countryCode === "in") {
      if (localNumber.length !== 10) {
        setPhoneError("Indian phone must be 10 digits");
        return;
      }
    } 
    // Other countries
    else {
      if (localNumber.length < 7 || localNumber.length > 12) {
        setPhoneError("Invalid phone number");
        return;
      }
    }

    setPhoneError("");
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION CHECK
    if (nameError) {
      setMessage("Fix name error");
      setMessageType("error");
      autoHide();
      return;
    }

    if (phoneError || !form.phone) {
      setMessage("Enter valid phone number");
      setMessageType("error");
      autoHide();
      return;
    }

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
    setPhoneError("");
    setNameError("");
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

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-customer-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Customer
      </button>

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
        <button className="edit-btn" onClick={() => editCustomer(c)}>
          <FaEdit />
        </button>

        <button className="delete-btn" onClick={() => deleteCustomer(c.id)}>
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
              
              <label>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleNameChange}
                required
              />
              {nameError && <small className="error">{nameError}</small>}

              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />

              <label>Phone *</label>
              <PhoneInput
                country="in"
                value={form.phone}
                onChange={handlePhoneChange}
                inputStyle={{ width: "100%" }}
              />
              {phoneError && <small className="error">{phoneError}</small>}

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