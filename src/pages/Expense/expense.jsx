import React, { useEffect, useState } from "react";

import TopNavbar from "../dashboard/TopNavbar";

import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";

import "./Expense.css";

const API =
  "https://zyntaweb.com/demoalafiya/api/expenseentry.php";

const Expense = () => {

  const [data, setData] = useState([]);
  const [expenseClass, setExpenseClass] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [filterSlno, setFilterSlno] = useState("");
  const [filterExpenseDate, setFilterExpenseDate] = useState("");
  const [filterVoucherNo, setFilterVoucherNo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");

  const rowsPerPage = 5;

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const emptyForm = {
    id: "",
    slno: "",
    expense_date: "",
    expense_particular: "",
    expense_amount: "",
    expense_class_id: "",
    voucher_no: "",
    remarks: "",
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

  /* ================= LOAD DROPDOWN ================= */

  const loadExpenseClass = async () => {
    const res = await fetch(`${API}?dropdown=1`);
    const result = await res.json();
    setExpenseClass(result);
  };

  useEffect(() => {
    loadData();
    loadExpenseClass();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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
        ? "Expense Updated Successfully ✏️"
        : "Expense Added Successfully 🎉"
    );

    setMessageType("success");

    autoHide();

    setShowModal(false);

    setIsEdit(false);

    setForm(emptyForm);

    loadData();
  };

  /* ================= SEARCH FILTER ================= */

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
      filterExpenseDate === "" ||
      item.expense_date === filterExpenseDate;

    const matchesVoucher =
      filterVoucherNo === "" ||
      item.voucher_no
        ?.toLowerCase()
        .includes(filterVoucherNo.toLowerCase());

    return (
      matchesSearch &&
      matchesSlno &&
      matchesDate &&
      matchesVoucher
    );
  });

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

    if (!window.confirm("Delete this expense?"))
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

    <div className="expense-page">

      <TopNavbar />

      {message && (
        <div
          className={`expense_message-box ${messageType}`}
        >
          {message}
        </div>
      )}

      <button
        className="add-expense-top"
        onClick={() => {

          setForm(emptyForm);

          setIsEdit(false);

          setShowModal(true);
        }}
      >
        <FaPlus /> Add Expense
      </button>

      {/* ================= TABLE ================= */}

      <div className="expense-list-card">

        <div className="expense-card-header">
          <h3>💰 EXPENSE ENTRY</h3>
        </div>

        {/* SEARCH + FILTER */}

        <div className="expense-toolbar">

          <div className="expense-search-wrapper">

            <div className="expense-search-box">

              <FaSearch className="expense-search-icon" />

              <input
                type="text"
                placeholder="Search Expense..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="expense-search-input"
              />

              {search && (
                <button
                  className="expense-clear-btn"
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

          <div className="expense-filter-box">

            <select className="expense-filter-select">
              <option>10 per page</option>
              <option>25 per page</option>
              <option>50 per page</option>
            </select>

            <button
              className="expense-filter-btn"
              onClick={() =>
                setShowFilters(!showFilters)
              }
            >
              ⏳ Filters
            </button>

          </div>

          {showFilters && (
            <div className="expense-filter-panel1">

              <div className="expense-filter-grid1">

                <div className="expense-filter-group1">

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

                <div className="expense-filter-group1">

                  <label>Expense Date</label>

                  <input
                    type="date"
                    value={filterExpenseDate}
                    onChange={(e) =>
                      setFilterExpenseDate(e.target.value)
                    }
                  />

                </div>

                <div className="expense-filter-group1">

                  <label>Voucher No</label>

                  <input
                    type="text"
                    placeholder="Enter Voucher No"
                    value={filterVoucherNo}
                    onChange={(e) =>
                      setFilterVoucherNo(e.target.value)
                    }
                  />

                </div>

                <div className="expense-filter-actions1">

                  <button
                    className="expense-apply-btn1"
                    onClick={() => setCurrentPage(1)}
                  >
                    Apply
                  </button>

                  <button
                    className="expense-clear-filter-btn1"
                    onClick={() => {
                      setFilterSlno("");
                      setFilterExpenseDate("");
                      setFilterVoucherNo("");
                      setCurrentPage(1);
                    }}
                  >
                    Clear
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

        <div className="expense-table-wrapper">

          <table className="expense-table">

            <thead>

              <tr>

                <th>SLNO</th>
                <th>Expense Date</th>
                <th>Expense Particular</th>
                <th>Expense Amount</th>
                <th>Expense Class</th>
                <th>Voucher No</th>
                <th>Remarks</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {currentRows.map((item) => (

                <tr key={item.id}>

                  <td data-label="SLNO">
                    {item.slno}
                  </td>

                  <td data-label="Expense Date">
                    {item.expense_date}
                  </td>

                  <td data-label="Expense Particular">
                    {item.expense_particular}
                  </td>

                  <td data-label="Expense Amount">
                    {item.expense_amount}
                  </td>

                  <td data-label="Expense Class">
                    {item.expense_class_name}
                  </td>

                  <td data-label="Voucher No">
                    {item.voucher_no}
                  </td>

                  <td data-label="Remarks">
                    {item.remarks}
                  </td>

                  <td data-label="Actions">

                    <button
                      className="expense_edit-btn"
                      onClick={() =>
                        editData(item)
                      }
                    >
                      ✏️
                    </button>

                    <button
                      className="expense_delete-btn"
                      onClick={() =>
                        deleteData(item.id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))}

              {currentRows.length === 0 && (

                <tr className="expense-empty-row">

                  <td colSpan="8">

                    <div className="expense-no-data">

                      <FaSearch className="expense-no-icon" />

                      <p>💰 No Expense Found</p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}

        <div className="expense-pagination">

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

        <div className="expense_modal-overlay">

          <div className="expense_modal-box">

            <div className="expense_modal-header">

              <h3>
                {isEdit
                  ? "Update Expense"
                  : "Add Expense"}
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
              className="expense_modal-body"
            >

              <label>Expense Date</label>

              <input
                type="date"
                name="expense_date"
                value={form.expense_date}
                onChange={handleChange}
                required
              />

              <label>Expense Particular</label>

              <input
                type="text"
                name="expense_particular"
                value={form.expense_particular}
                onChange={handleChange}
                required
              />

              <label>Expense Amount</label>

              <input
                type="number"
                step="0.01"
                name="expense_amount"
                value={form.expense_amount}
                onChange={handleChange}
                required
              />

              <label>Expense Class</label>

              <select
                name="expense_class_id"
                value={form.expense_class_id}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Expense Class
                </option>

                {expenseClass.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.description}
                  </option>

                ))}

              </select>

              <label>Voucher No</label>

              <input
                type="text"
                name="voucher_no"
                value={form.voucher_no}
                onChange={handleChange}
                required
              />

              <label>Remarks</label>

              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
              />

              <button className="expense_save-btn">

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

export default Expense;