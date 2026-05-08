import React, { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import "./DailySettlement.css";

const API = "https://zyntaweb.com/demoalafiya/api/daily_settlement.php";

const DailySettlement = () => {

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  const [filterSlno, setFilterSlno] = useState("");
  const [filterReceiptNo, setFilterReceiptNo] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const rowsPerPage = 5;

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const emptyForm = {
    id: "",
    slno: "",
    settlement_date: "",
    settlement_from_date: "",
    settlement_to_date: "",
    last_payment_receipt_no: "",
    last_expense_voucher_no: "",
    last_sales_document: "",
    contra: "",
    amount: "",
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
        ? "Daily Settlement Updated Successfully ✏️"
        : "Daily Settlement Added Successfully 🎉"
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

    const matchesReceipt =
      filterReceiptNo === "" ||
      item.last_payment_receipt_no
        ?.toString()
        .includes(filterReceiptNo);

    const matchesDate =
      filterDate === "" ||
      item.settlement_date === filterDate;

    return (
      matchesSearch &&
      matchesSlno &&
      matchesReceipt &&
      matchesDate
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

    if (!window.confirm("Delete this settlement?"))
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

    <div className="settlement-page">

      <TopNavbar />

      {message && (
        <div
          className={`settlement_message-box ${messageType}`}
        >
          {message}
        </div>
      )}

      <button
        className="add-settlement-top"
        onClick={() => {

          setForm(emptyForm);

          setIsEdit(false);

          setShowModal(true);
        }}
      >
        <FaPlus /> Add Daily Settlement
      </button>

      {/* ================= TABLE ================= */}

      <div className="settlement-list-card">

        <div className="settlement-card-header">

          <h3>
            <HiOutlineClipboardDocumentList className="settlement-heading-icon" />
            DAILY SETTLEMENT
          </h3>

        </div>

        {/* SEARCH + FILTER */}

        <div className="settlement-toolbar">

          <div className="settlement-search-wrapper">

            <div className="settlement-search-box">

              <FaSearch className="settlement-search-icon" />

              <input
                type="text"
                placeholder="Search Daily Settlement..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="settlement-search-input"
              />

              {search && (
                <button
                  type="button"
                  className="settlement-clear-btn"
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

          <div className="settlement-filter-box">

            <select className="settlement-filter-select">
              <option>10 per page</option>
              <option>25 per page</option>
              <option>50 per page</option>
            </select>

            <button
              className="settlement-filter-btn"
              onClick={() =>
                setShowFilters(!showFilters)
              }
            >
              ⏳ Filters
            </button>

          </div>

          {showFilters && (

            <div className="settlement-filter-panel">

              <div className="settlement-filter-grid">

                <div className="settlement-filter-group">

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

                <div className="settlement-filter-group">

                  <label>Settlement Date</label>

                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) =>
                      setFilterDate(e.target.value)
                    }
                  />

                </div>

                <div className="settlement-filter-group">

                  <label>Last Payment Receipt No</label>

                  <input
                    type="text"
                    placeholder="Enter Receipt No"
                    value={filterReceiptNo}
                    onChange={(e) =>
                      setFilterReceiptNo(e.target.value)
                    }
                  />

                </div>

                <div className="settlement-filter-actions">

                  <button
                    className="settlement-apply-btn"
                    onClick={() => setCurrentPage(1)}
                  >
                    Apply
                  </button>

                  <button
                    className="settlement-clear-filter-btn"
                    onClick={() => {

                      setFilterSlno("");
                      setFilterReceiptNo("");
                      setFilterDate("");
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

        {/* ================= TABLE ================= */}

        <div className="settlement-table-wrapper">

          <table className="settlement-table">

            <thead>

              <tr>

                <th>SLNO</th>
                <th>Settlement Date</th>
                <th>Settlement From Date</th>
                <th>Settlement To Date</th>
                <th>Last Payment Receipt No</th>
                <th>Last Expense Voucher No</th>
                <th>Last Sales Document</th>
                <th>Contra</th>
                <th>Amount</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {currentRows.map((item) => (

                <tr key={item.id}>

                  <td data-label="SLNO">
                    {item.slno}
                  </td>

                  <td data-label="Settlement Date">
                    {item.settlement_date}
                  </td>

                  <td data-label="Settlement From Date">
                    {item.settlement_from_date}
                  </td>

                  <td data-label="Settlement To Date">
                    {item.settlement_to_date}
                  </td>

                  <td data-label="Last Payment Receipt No">
                    {item.last_payment_receipt_no}
                  </td>

                  <td data-label="Last Expense Voucher No">
                    {item.last_expense_voucher_no}
                  </td>

                  <td data-label="Last Sales Document">
                    {item.last_sales_document}
                  </td>

                  <td data-label="Contra">
                    {item.contra}
                  </td>

                  <td data-label="Amount">
                    {item.amount}
                  </td>

                  <td data-label="Actions">

                    <button
                      className="settlement_edit-btn"
                      onClick={() =>
                        editData(item)
                      }
                    >
                      ✏️
                    </button>

                    <button
                      className="settlement_delete-btn"
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

                <tr className="settlement-empty-row">

                  <td colSpan="10">

                    <div className="settlement-no-data">

                      <FaSearch className="settlement-no-icon" />

                      <p>
                        <HiOutlineClipboardDocumentList className="settlement-heading-icon" />
                        No Daily Settlement Found
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}

        <div className="settlement-pagination">

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

        <div className="settlement_modal-overlay">

          <div className="settlement_modal-box">

            <div className="settlement_modal-header">

              <h3>
                {isEdit
                  ? "Update Settlement"
                  : "Add Settlement"}
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
              className="settlement_modal-body"
            >

              <label>Settlement Date</label>

              <input
                type="date"
                name="settlement_date"
                value={form.settlement_date}
                onChange={handleChange}
                required
              />

              <label>Settlement From Date</label>

              <input
                type="date"
                name="settlement_from_date"
                value={form.settlement_from_date}
                onChange={handleChange}
                required
              />

              <label>Settlement To Date</label>

              <input
                type="date"
                name="settlement_to_date"
                value={form.settlement_to_date}
                onChange={handleChange}
                required
              />

              <label>Last Payment Receipt No</label>

              <input
                type="text"
                name="last_payment_receipt_no"
                value={form.last_payment_receipt_no}
                onChange={handleChange}
              />

              <label>Last Expense Voucher No</label>

              <input
                type="text"
                name="last_expense_voucher_no"
                value={form.last_expense_voucher_no}
                onChange={handleChange}
              />

              <label>Last Sales Document</label>

              <input
                type="text"
                name="last_sales_document"
                value={form.last_sales_document}
                onChange={handleChange}
              />

              <label>Contra</label>

              <input
                type="text"
                name="contra"
                value={form.contra}
                onChange={handleChange}
              />

              <label>Amount</label>

              <input
                type="number"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />

              <button className="settlement_save-btn">

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

export default DailySettlement;