import React, { useEffect, useState } from "react";

import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";

import "./BankDeposit.css";

const API =
  "https://zyntaweb.com/demoalafiya/api/BankDeposit.php";

const BankDeposit = () => {

  const [data, setData] = useState([]);
const [showFilters, setShowFilters] = useState(false);

const [filterSlno, setFilterSlno] = useState("");

const [filterDate, setFilterDate] = useState("");

const [filterAccountNo, setFilterAccountNo] = useState("");
  const [showModal, setShowModal] = useState(false);
const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const emptyForm = {

    id: "",

    slno: "",

    deposit_date: "",

    account_name: "",

    account_number: "",

    amount_deposited: "",
  };

  const [form, setForm] = useState(emptyForm);

  const autoHide = () =>
    setTimeout(() => setMessage(""), 3000);

  /* ================= LOAD DATA ================= */

  const loadData = async () => {

    const res = await fetch(API);

    const result = await res.json();

    setData(result);
  };

  useEffect(() => {

    loadData();

  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,
    });
  };
const filteredData = data.filter((item) => {

  const matchesSearch =
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesSlno =
    filterSlno === "" ||
    item.slno
      ?.toLowerCase()
      .includes(filterSlno.toLowerCase());

  const matchesDate =
    filterDate === "" ||
    item.deposit_date === filterDate;

  const matchesAccountNo =
    filterAccountNo === "" ||
    item.account_number
      ?.toLowerCase()
      .includes(filterAccountNo.toLowerCase());

  return (
    matchesSearch &&
    matchesSlno &&
    matchesDate &&
    matchesAccountNo
  );

});
  /* ================= SAVE / UPDATE ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    await fetch(API, {

      method: isEdit ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    });

    setMessage(

      isEdit
        ? "Bank Deposit Updated Successfully ✏️"
        : "Bank Deposit Added Successfully 🎉"
    );

    setMessageType("success");

    autoHide();

    setShowModal(false);

    setIsEdit(false);

    setForm(emptyForm);

    loadData();
  };

  /* ================= PAGINATION ================= */

  const indexOfLastRow =
    currentPage * rowsPerPage;

  const indexOfFirstRow =
    indexOfLastRow - rowsPerPage;

const currentRows = filteredData.slice(
  indexOfFirstRow,
  indexOfLastRow
);

const totalPages = Math.ceil(
  filteredData.length / rowsPerPage
);

  /* ================= EDIT ================= */

  const editData = (item) => {

    setForm(item);

    setIsEdit(true);

    setShowModal(true);
  };

  /* ================= DELETE ================= */

  const deleteData = async (id) => {

    if (!window.confirm("Delete this deposit?"))
      return;

    await fetch(`${API}?id=${id}`, {
      method: "DELETE",
    });

    setMessage("Deleted Successfully ❌");

    setMessageType("success");

    autoHide();

    loadData();
  };

  return (

  <div className="bank-page">

    <TopNavbar />

    {message && (

      <div
        className={`bank_message-box ${messageType}`}
      >
        {message}
      </div>

    )}

    <button
      className="add-bank-top"
      onClick={() => {

        setForm(emptyForm);

        setIsEdit(false);

        setShowModal(true);

      }}
    >
      <FaPlus /> Add Bank Deposit
    </button>

    {/* ================= TABLE ================= */}

    <div className="bank-list-card">

      <div className="bank-card-header">

        <h3>🏦 BANK DEPOSIT</h3>

      </div>

      {/* SEARCH + FILTER */}

      <div className="bank-toolbar">

        <div className="bank-search-wrapper">

          <div className="bank-search-box">

            <FaSearch className="bank-search-icon" />

            <input
              type="text"
              placeholder="Search account / number / slno"
              className="bank-search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            {search && (

              <button
                className="bank-clear-btn"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
              >
                ✕
              </button>

            )}

          </div>

        </div>

        <div className="bank-filter-box">

          <select className="bank-filter-select">
            <option>10 per page</option>
            <option>25 per page</option>
            <option>50 per page</option>
          </select>

          <button
            className="bank-filter-btn"
            onClick={() =>
              setShowFilters(!showFilters)
            }
          >
            ⏳ Filters
          </button>

        </div>

      </div>

      {showFilters && (

        <div className="bank-filter-panel">

          <div className="bank-filter-grid">

            <div className="bank-filter-group">

              <label>SLNO</label>

              <input
                type="text"
                placeholder="Enter SLNO"
                value={filterSlno}
                onChange={(e) =>
                  setFilterSlno(e.target.value)
                }
              />

            </div>

            <div className="bank-filter-group">

              <label>Deposit Date</label>

              <input
                type="date"
                value={filterDate}
                onChange={(e) =>
                  setFilterDate(e.target.value)
                }
              />

            </div>

            <div className="bank-filter-group">

              <label>Account Number</label>

              <input
                type="text"
                placeholder="Enter Account Number"
                value={filterAccountNo}
                onChange={(e) =>
                  setFilterAccountNo(e.target.value)
                }
              />

            </div>

            <div className="bank-filter-actions">

              <button
                className="bank-apply-btn"
                onClick={() => setCurrentPage(1)}
              >
                Apply
              </button>

              <button
                className="bank-clear-filter-btn"
                onClick={() => {

                  setFilterSlno("");
                  setFilterDate("");
                  setFilterAccountNo("");

                  setCurrentPage(1);

                }}
              >
                Clear
              </button>

            </div>

          </div>

        </div>

      )}

      <div className="bank-table-wrapper">

        <table className="bank-table">

         <thead>

  <tr>

    <th>SLNO</th>


    <th>DOC NUM</th>

    <th>Deposit Date</th>

    <th>Account Name</th>

    <th>Account Number</th>

    <th>Amount Deposited</th>

    <th>Actions</th>

  </tr>

</thead>

<tbody>

  {currentRows.length > 0 ? (

    currentRows.map((item, index) => (

      <tr key={item.id}>

        {/* AUTO SERIAL NUMBER */}
        <td data-label="SLNO">
          {indexOfFirstRow + index + 1}
        </td>

        {/* DATABASE ID */}
        
        {/* DOC NUMBER */}
        <td data-label="DOC NUM">
          {item.slno}
        </td>

        <td data-label="Deposit Date">
          {item.deposit_date}
        </td>

        <td data-label="Account Name">
          {item.account_name}
        </td>

        <td data-label="Account Number">
          {item.account_number}
        </td>

        <td data-label="Amount Deposited">
          {item.amount_deposited}
        </td>

        <td data-label="Actions">

          <button
            className="bank_edit-btn"
            onClick={() => editData(item)}
          >
            ✏️
          </button>

          <button
            className="bank_delete-btn"
            onClick={() => deleteData(item.id)}
          >
            <FaTrash />
          </button>

        </td>

      </tr>

    ))

  ) : (

    <tr className="bank-empty-row">

      <td colSpan="8">

        <div className="bank-no-data">

          <FaSearch className="bank-no-icon" />

          <p>🏦 Bank Not Found</p>

        </div>

      </td>

    </tr>

  )}

</tbody>
</table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="bank-pagination">

        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
        >
          ⬅ Previous
        </button>

        <span className="page-number">

          Page {currentPage} of {totalPages}

        </span>

        <button
          className="page-btn"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
        >
          Next ➡
        </button>

      </div>

    </div>

    {/* ================= MODAL ================= */}

    {showModal && (

      <div className="bank_modal-overlay">

        <div className="bank_modal-box">

          <div className="bank_modal-header">

            <h3>

              {isEdit
                ? "Update Bank Deposit"
                : "Add Bank Deposit"}

            </h3>

            <button
              onClick={() =>
                setShowModal(false)
              }
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="bank_modal-body"
          >

            <label>Deposit Date</label>

            <input
              type="date"
              name="deposit_date"
              value={form.deposit_date}
              onChange={handleChange}
              required
            />

            <label>Account Name</label>

            <input
              type="text"
              name="account_name"
              value={form.account_name}
              onChange={handleChange}
              required
            />

            <label>Account Number</label>

            <input
              type="text"
              name="account_number"
              value={form.account_number}
              onChange={handleChange}
              required
            />

            <label>Amount Deposited</label>

            <input
              type="number"
              step="0.01"
              name="amount_deposited"
              value={form.amount_deposited}
              onChange={handleChange}
              required
            />

            <button className="bank_save-btn">

              {isEdit
                ? "✏️ UPDATE"
                : "💾 SAVE"}

            </button>

          </form>

        </div>

      </div>

    )}

  </div>
);
};

export default BankDeposit;