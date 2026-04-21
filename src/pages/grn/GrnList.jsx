import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import TopNavbar from "../dashboard/TopNavbar";
import "../order/OrderList.css";
const API = "https://zyntaweb.com/demoalafiya/api/grn_header.php";

const GrnList = () => {
  const [grns, setGrns] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterGrn, setFilterGrn] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setGrns(Array.isArray(data) ? data : []));
  }, []);

  const suppliers = [...new Set(grns.map(g => g.supplier_name))];

  const filtered = grns.filter(g => {
    return (
      (search === "" ||
        g.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||
        g.supplier_name?.toLowerCase().includes(search.toLowerCase())
      ) &&
      (filterGrn === "" ||
        g.invoice_no?.toLowerCase().includes(filterGrn.toLowerCase())
      ) &&
      (filterSupplier === "" ||
        g.supplier_name === filterSupplier
      ) &&
      (filterDate === "" ||
        g.date === filterDate
      )
    );
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleDelete = (id) => {
  if (!window.confirm("Delete this GRN?")) return;

  fetch(`${API}?delete_id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "deleted") {

        // ✅ UI update
        setGrns(prev => prev.filter(g => g.id !== id));

        // ✅ SUCCESS MESSAGE
        alert("GRN Deleted Successfully ✅");
      } else {
        alert("Delete failed ❌");
      }
    })
    .catch(() => {
      alert("Server error ❌");
    });
};

  const handleClear = () => {
    setFilterGrn("");
    setFilterSupplier("");
    setFilterDate("");
  };

  return (
    <div className="erp-container">
      <TopNavbar />

      <div className="erp-card">

        {/* HEADER */}
        <div className="erp-header">
          <h2 className="erp-title">GRN</h2>

          <button
            className="erp-add-top"
            onClick={() => navigate("/grn-form")}
          >
            +
          </button>
        </div>

        {/* TOPBAR */}
        <div className="erp-topbar">

          <div className="erp-left">
            <input
              className="erp-search"
              placeholder="Search GRN..."
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

        {/* FILTER */}
        {showFilters && (
          <div className="erp-filter-box">
            <div className="erp-filter-grid">

              <div>
                <label>GRN No</label>
                <input
                  value={filterGrn}
                  onChange={(e) => setFilterGrn(e.target.value)}
                />
              </div>

              <div>
                <label>Supplier</label>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                >
                  <option value="">All</option>
                  {suppliers.map((s, i) => (
                    <option key={i}>{s}</option>
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
                  <th>GRN No</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No GRN Found
                    </td>
                  </tr>
                ) : (
                  currentData.map(g => (
                    <tr key={g.id}>
                      <td>{g.invoice_no}</td>
                      <td>{g.date}</td>
                      <td>{g.supplier_name}</td>
                      <td>{g.remarks}</td>
                      <td>
                        <div className="erp-actions">

                          <button
                            className="erp-edit"
                            onClick={() => navigate(`/grn-form/${g.id}`)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="erp-delete"
                            onClick={() => handleDelete(g.id)}
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

export default GrnList;