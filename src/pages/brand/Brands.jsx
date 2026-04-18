import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "./Brands.css";
const API = "https://zyntaweb.com/demoalafiya/api/brands.php";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const brandsPerPage = 5; 
  const [nameError, setNameError] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
  });

  // ================= LOAD =================
  const loadBrands = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setBrands(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // ================= NAME VALIDATION =================
  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm({ ...form, name: value });

    if (!value.trim()) {
      setNameError("Brand name is required");
      return;
    }

    const duplicate = brands.find(
      (b) =>
        b.name.toLowerCase().trim() === value.toLowerCase().trim() &&
        b.id !== form.id
    );

    if (duplicate) {
      setNameError("Brand already exists");
      return;
    }

    setNameError("");
  };

  // ================= SUBMIT =================
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

    setMessage(isEdit ? "Brand updated ✅" : "Brand added 🎉");
    setMessageType("success");
    autoHide();

    loadBrands();
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
    });
    setIsEdit(false);
    setNameError("");
  };

  // ================= EDIT =================
  const editBrand = (b) => {
    setForm(b);
    setIsEdit(true);
    setShowModal(true);
  };

  // ================= DELETE =================
  const deleteBrand = async (id) => {
  if (!window.confirm("Delete this brand?")) return;

  const res = await fetch(`${API}?id=${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.status === "error") {
    setMessage(data.message);   // ❌ FK error
    setMessageType("error");
  } else {
    setMessage(data.message);   // ✅ success
    setMessageType("success");
  }

  autoHide();
  loadBrands();
};

  // ================= SEARCH =================
  const filtered = brands.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );
const totalPages = Math.ceil(filtered.length / brandsPerPage);

const indexOfLast = currentPage * brandsPerPage;
const indexOfFirst = indexOfLast - brandsPerPage;

const currentBrands = filtered.slice(indexOfFirst, indexOfLast);
  return (
<div className="brand-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-brand-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Brand
      </button>

<div className="brand-list-card">
          <div className="card-header">
          <h3>🏷️ BRAND LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search brand"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">🏷️</div>
            <p>No brands found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {currentBrands.map((b) => (
    <tr key={b.id}>
      <td data-label="Brand Name">{b.name}</td>

      <td data-label="Actions">
        <button className="brand-edit-btn" onClick={() => editBrand(b)}>
          <FaEdit />
        </button>

        <button className="brand-delete-btn" onClick={() => deleteBrand(b.id)}>
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
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
     Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>
 
      </div>
      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Brand" : "Add Brand"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Brand Name *</label>
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

export default Brands;