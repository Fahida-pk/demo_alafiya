import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderList.css";

const API = "https://zyntaweb.com/demoalafiya/api/order_header.php";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const handleClear = () => {
    setFilterOrder("");
    setFilterCustomer("");
    setFilterDate("");
  };

  return (
    <div className="list-container">

      <div className="card">

        {/* 🔍 TOP BAR */}
        <div className="top-bar">

          <div className="left-group">
            <input
              className="search-box"
              placeholder="Search order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>

          <div className="right-group">
            <button
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </button>

            <button
              className="add-btn"
              onClick={() => navigate("/order-form")}
            >
              +
            </button>
          </div>

        </div>

        {/* 🎯 FILTER PANEL */}
        {showFilters && (
          <div className="filter-panel">

            <div className="filter-grid">

              <div className="filter-item">
                <label>Order No</label>
                <input
                  value={filterOrder}
                  onChange={(e) => setFilterOrder(e.target.value)}
                  placeholder="Enter order number"
                />
              </div>

              <div className="filter-item">
                <label>Customer</label>
                <select
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                >
                  <option value="">All Customers</option>
                  {customers.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label>Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <button className="apply-btn">Apply</button>

                <button
                  className="clear-btn"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>

            </div>

          </div>
        )}

        {/* 📊 TABLE */}
        <table className="list-table">
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
            {filteredOrders.length > 0 ? (
              filteredOrders.map(o => (
                <tr key={o.id}>
                  <td className="link">{o.number}</td>
                  <td>{o.date}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.remarks}</td>

                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/order-form/${o.id}`)}
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => alert("Delete " + o.id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default OrderList;