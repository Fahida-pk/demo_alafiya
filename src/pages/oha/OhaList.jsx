import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import TopNavbar from "../dashboard/TopNavbar";
import "../order/OrderList.css";

const API = "https://zyntaweb.com/demoalafiya/api/oha_header.php";

const OhaList = () => {
  const [ohas, setOhas] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterOha, setFilterOha] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  // ================= LOAD =================
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setOhas(Array.isArray(data) ? data : []));
  }, []);

  // ================= CUSTOMER LIST =================
  const customers = [...new Set(ohas.map(o => o.customer_name))];

  // ================= FILTER =================
  const filtered = ohas.filter(o => {
    return (
      (search === "" ||
        o.sl_no?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(search.toLowerCase())
      ) &&
      (filterOha === "" ||
        o.sl_no?.toLowerCase().includes(filterOha.toLowerCase())
      ) &&
      (filterCustomer === "" ||
        o.customer_name === filterCustomer
      ) &&
      (filterDate === "" ||
        o.date === filterDate
      )
    );
  });

  // ================= PAGINATION =================
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Delete this OHA?")) return;

    fetch(`${API}?delete_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "deleted") {
          setOhas(prev => prev.filter(o => o.id !== id));
          alert("OHA Deleted ✅");
        } else {
          alert("Delete failed ❌");
        }
      });
  };

  const handleClear = () => {
    setFilterOha("");
    setFilterCustomer("");
    setFilterDate("");
  };

  return (
    <div className="erp-container">
      <TopNavbar />

      {/* ADD BUTTON */}
      <button
        className="erp-add-top"
        onClick={() => navigate("/oha-form")}
      >
        <FaPlus /> Add New OHA
      </button>

      <div className="erp-card">

        {/* HEADER */}
        <div className="erp-header">
          <h2 className="erp-title">OHA</h2>
        </div>

        {/* TOPBAR */}
        <div className="erp-topbar">

          <div className="erp-left">
            <input
              className="erp-search"
              placeholder="Search OHA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="erp-search-btn">Search</button>
          </div>

          <div className="erp-right">
            <select
              className="erp-select"
              value={rowsPerPage}
              onChange={(e) => {
                setCurrentPage(1);
                setRowsPerPage(Number(e.target.value));
              }}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button
              className="erp-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        {/* FILTER BOX */}
        {showFilters && (
          <div className="erp-filter-box">
            <div className="erp-filter-grid">

              <div>
                <label>OHA No</label>
                <input
                  value={filterOha}
                  onChange={(e) => setFilterOha(e.target.value)}
                />
              </div>

              <div>
                <label>Customer</label>
                <select
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                >
                  <option value="">All</option>
                  {customers.map((c, i) => (
                    <option key={i}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="erp-filter-actions">
                <button className="erp-apply">Apply</button>
                <button className="erp-clear" onClick={handleClear}>Clear</button>
              </div>

            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="erp-table-container">
          <div className="erp-table-body">

            <table className="erp-table">
              <thead>
                <tr>
                  <th>OHA No</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No OHA Found
                    </td>
                  </tr>
                ) : (
                  currentData.map(o => (
                    <tr key={o.id}>
                      <td>{o.sl_no}</td>
                      <td>{o.date}</td>
                      <td>{o.customer_name}</td>
                      <td>{o.remarks}</td>

                      <td>
                        <div className="erp-actions">

                          <button
                            className="erp-edit"
                            onClick={() => navigate(`/oha-form/${o.id}`)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="erp-delete"
                            onClick={() => handleDelete(o.id)}
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>

        {/* FOOTER */}
        <div className="erp-footer">

          <div className="erp-info">
            Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filtered.length)} of{" "}
            {filtered.length}
          </div>

          <div className="erp-pagination">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OhaList;