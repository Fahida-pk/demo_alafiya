import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "../Customers/Customer.css";

const API = "https://zyntaweb.com/demoalafiya/api/status.php";

const Status = () => {
  const [statusList, setStatusList] = useState([]);
  const [form, setForm] = useState({ id: "", status: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  // LOAD
  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setStatusList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, status: e.target.value });
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
    setForm({ id: "", status: "" });
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
        <FaPlus /> Add Status
      </button>

      <div className="customer-list-card">
        <h3>📌 STATUS LIST</h3>

        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {statusList.map((s) => (
              <tr key={s.id}>
                <td>{s.status}</td>
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
            <h3>{isEdit ? "Edit" : "Add"} Status</h3>

            <form onSubmit={handleSubmit}>
              <input
                value={form.status}
                onChange={handleChange}
                placeholder="Status name"
                required
              />

              <button>Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;