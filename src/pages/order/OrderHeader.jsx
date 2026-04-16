import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "./OrderHeader.css";

const API = "https://zyntaweb.com/demoalafiya/api/order_header.php";
const CUSTOMER_API = "https://zyntaweb.com/demoalafiya/api/customer.php";

const OrderHeader = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]); // 🔥 dropdown
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    id: "",
    date: "",
    number: "",
    customer_id: "",
    remarks: "",
  });

  // ================= LOAD =================
  const loadOrders = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const loadCustomers = async () => {
    const res = await fetch(CUSTOMER_API);
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadOrders();
    loadCustomers();
  }, []);

  // ================= INPUT =================
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

    setMessage(isEdit ? "Order updated ✅" : "Order added 🎉");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);

    loadOrders();
    setShowModal(false);
    resetForm();
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      id: "",
      date: "",
      number: "",
      customer_id: "",
      remarks: "",
    });
    setIsEdit(false);
  };

  // ================= EDIT =================
  const editItem = (order) => {
    setForm(order);
    setIsEdit(true);
    setShowModal(true);
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Order deleted ❌");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);

    loadOrders();
  };

  // ================= SEARCH =================
  const filtered = orders.filter((o) =>
    o.number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="order-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-order-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Order
      </button>

      <div className="order-list-card">
        <div className="card-header">
          <h3>📦 ORDER HEADER</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search order"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <p>No orders found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
               
<th>Date</th>
 <th>Number</th>
<th>Customer</th>
<th>Remarks</th>
<th>Actions</th>
              </tr>
            </thead>

           <tbody>
  {filtered.map((o) => (
    <tr key={o.id}>
      <td data-label="Date">{o.date}</td>
      <td data-label="Number">{o.number}</td>

      <td data-label="Customer">
        {o.customer_name || "-"}
      </td>

      <td data-label="Remarks">
        {o.remarks || "-"}
      </td>

      <td data-label="Actions">
        <button
          className="order-edit-btn"
          onClick={() => editItem(o)}
        >
          <FaEdit />
        </button>

        <button
          className="order-delete-btn"
          onClick={() => deleteItem(o.id)}
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
        <div className="order-modal-overlay">
          <div className="order-modal-box">
            <div className="order-modal-header">
              <h3>{isEdit ? "Update Order" : "Add Order"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="order-modal-body">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />

              <label>Order Number *</label>
              <input
                name="number"
                value={form.number}
                onChange={handleChange}
                required
              />

              {/* 🔥 CUSTOMER DROPDOWN */}
              <label>Customer *</label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>

                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label>Remarks</label>
              <input
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
              />

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

export default OrderHeader;