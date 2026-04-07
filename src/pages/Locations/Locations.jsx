import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "../Customers/Customer.css";

const API = "https://zyntaweb.com/demoalafiya/api/locations.php";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ id: "", name: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");

  // LOAD
  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setLocations(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, name: e.target.value });
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
    setForm({ id: "", name: "" });
    setIsEdit(false);
  };

  // EDIT
  const editItem = (item) => {
    setForm(item);
    setIsEdit(true);
    setShowModal(true);
  };

  // DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    loadData();
  };

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">
      <TopNavbar />

      {message && <div className="message-box success">{message}</div>}

      <button
        className="add-customer-top"
        onClick={() => setShowModal(true)}
      >
        <FaPlus /> Add Location
      </button>

      <div className="customer-list-card">
        <div className="card-header">
          <h3>📍 LOCATION LIST</h3>

          <input
            className="search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>
                  <button onClick={() => editItem(l)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(l.id)}>
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
            <h3>{isEdit ? "Edit" : "Add"} Location</h3>

            <form onSubmit={handleSubmit}>
              <input
                value={form.name}
                onChange={handleChange}
                placeholder="Location name"
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

export default Locations;