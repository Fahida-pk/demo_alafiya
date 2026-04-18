import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import TopNavbar from "../dashboard/TopNavbar";

import "./OrderList.css";

const API = "https://zyntaweb.com/demoalafiya/api/order_header.php";
const CUSTOMER_API = "https://zyntaweb.com/demoalafiya/api/customer.php";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterOrder, setFilterOrder] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const customers = [...new Set(orders.map(o => o.customer_name))];

  const filteredOrders = orders.filter(o => {
    return (
      (search === "" ||
        o.number?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(search.toLowerCase())
      ) &&
      (filterOrder === "" ||
        o.number?.toLowerCase().includes(filterOrder.toLowerCase())
      ) &&
      (filterCustomer === "" ||
        o.customer_name === filterCustomer
      ) &&
      (filterDate === "" ||
        o.date === filterDate
      )
    );
  });
const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;
const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const handleClear = () => {
    setFilterOrder("");
    setFilterCustomer("");
    setFilterDate("");
  };
const handleDelete = (id) => {
  if (!window.confirm("Delete this order?")) return;

  fetch(`${API}?id=${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.status === "deleted") {
        alert("Deleted successfully ✅");
      } else {
        alert("Delete failed ❌");
      }

      // UI update
      setOrders(prev => prev.filter(o => o.id !== id));
    })
    .catch(err => {
      console.error(err);
      alert("Server error ❌");
    });
};
  return (
  <div className="erp-container">
      <TopNavbar />

    <div className="erp-card">

      {/* ✅ HEADER */}
      <div className="erp-header">
        <h2 className="erp-title">Orders</h2>

        <button
          className="erp-add-top"
          onClick={() => navigate("/order-form")}
        >
          +
        </button>
      </div>

      {/* 🔍 TOP BAR */}
      <div className="erp-topbar">

  {/* LEFT SIDE */}
  <div className="erp-left">
    <input
      className="erp-search"
      placeholder="Search by order..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button className="erp-search-btn">Search</button>
  </div>

  {/* RIGHT SIDE */}
  <div className="erp-right">

    {/* PER PAGE */}
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
      <option value={100}>100 per page</option>
    </select>

    {/* FILTER */}
    <button
      className="erp-filter-btn"
      onClick={() => setShowFilters(!showFilters)}
    >
      <FiFilter />
      Filters
    </button>

  </div>

</div>

      {/* FILTER */}
      {showFilters && (
        <div className="erp-filter-box">
          <div className="erp-filter-grid">

            <div>
              <label>Order No</label>
              <input
                value={filterOrder}
                onChange={(e) => setFilterOrder(e.target.value)}
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

     <div className="erp-table-container">
  <div className="erp-table-body">

    <table className="erp-table">

      <thead>
        <tr>
          <th>Order No</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Remarks</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {currentOrders.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No Orders Found
            </td>
          </tr>
        ) : (
          currentOrders.map(o => (
            <tr key={o.id}>
              <td>{o.number}</td>
              <td>{o.date}</td>
              <td>{o.customer_name}</td>
              <td>{o.remarks}</td>
              <td>
<div className="erp-actions">

  <button 
    className="erp-edit"
    onClick={() => navigate(`/order-form/${o.id}`)}
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
      {/* ✅ FOOTER */}
      <div className="erp-footer">

        <div className="erp-info">
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredOrders.length)} of{" "}
          {filteredOrders.length} results
        </div>

        <div className="erp-pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
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

export default OrderList;