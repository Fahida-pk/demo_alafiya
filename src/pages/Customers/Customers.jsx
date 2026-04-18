import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Customer.css";

// API
const API = "https://zyntaweb.com/demoalafiya/api/customer.php";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const customersPerPage = 5;
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

  // NAME VALIDATION
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

  // NORMAL CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // PHONE VALIDATION
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

    if (country.countryCode === "in") {
      if (localNumber.length !== 10) {
        setPhoneError("Indian phone must be 10 digits");
        return;
      }
    } else {
      if (localNumber.length < 7 || localNumber.length > 12) {
        setPhoneError("Invalid phone number");
        return;
      }
    }

    setPhoneError("");
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

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

  try {
    const res = await fetch(`${API}?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    console.log("DELETE RESPONSE:", data); // 🔥 debug

    if (data.status === "error") {
      setMessage(data.message);   // 🔥 FK message show
      setMessageType("error");
      autoHide();
      return;
    }

    setMessage(data.message || "Customer deleted ❌");
    setMessageType("success");
    autoHide();

    loadCustomers();

  } catch (err) {
    console.error(err);
    setMessage("customer already in use,cannot delete");
    setMessageType("error");
    autoHide();
  }
};
  // SEARCH
  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );
const totalPages = Math.max(
  1,
  Math.ceil(filtered.length / customersPerPage)
);

const indexOfLast = currentPage * customersPerPage;
const indexOfFirst = indexOfLast - customersPerPage;

const currentCustomers = filtered.slice(indexOfFirst, indexOfLast);
  return (
    <div className="customers-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-customers-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Customer
      </button>

      <div className="customers-list-card">
        <div className="customers-card-header">
          <h3>👥 CUSTOMER LIST</h3>

          <div className="customers-search-wrapper">
            <input
              className="customers-search-input"
              placeholder="Search by name or phone"
              value={search}
onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1); // 🔥 reset page
}}            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">👤</div>
            <p>No customers found.</p>
          </div>
        ) : (
          <table className="customers-table">
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
              {currentCustomers.map((c) => (
                <tr key={c.id}>
                  <td data-label="Name">{c.name}</td>
                  <td data-label="Address">{c.address}</td>
                  <td data-label="Phone">{c.phone}</td>
                  <td data-label="Status">
                    <span className="customers-status-active">
                      {c.status}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <button
                      className="customers-edit-btn"
                      onClick={() => editCustomer(c)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="customers-delete-btn"
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

      {/* MODAL */}
      {showModal && (
        <div className="customers-modal-overlay">
          <div className="customers-modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Customer" : "Add Customer"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="customers-modal-body">
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

              <button className="customers-save-btn">
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