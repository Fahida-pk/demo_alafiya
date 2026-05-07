import React, { useEffect, useState } from "react";

import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";

import "./BankDeposit.css";

const API =
  "https://zyntaweb.com/demoalafiya/api/BankDeposit.php";

const BankDeposit = () => {

  const [data, setData] = useState([]);

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
const filteredData = data.filter((item) =>
  item.account_name
    ?.toLowerCase()
    .includes(search.toLowerCase()) ||

  item.account_number
    ?.toLowerCase()
    .includes(search.toLowerCase()) ||

  item.slno
    ?.toLowerCase()
    .includes(search.toLowerCase())
);
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

    <div className="daily-settlement-page">

      <TopNavbar />

      {message && (

        <div
          className={`daily_message-box ${messageType}`}
        >
          {message}
        </div>
      )}

      <button
        className="add-daily-settlement-top"
        onClick={() => {

          setForm(emptyForm);

          setIsEdit(false);

          setShowModal(true);
        }}
      >
        <FaPlus /> Add Bank Deposit
      </button>

      {/* ================= TABLE ================= */}

      <div className="daily-settlement-list-card">

        <div className="daily-card-header">

          <h3>🏦 BANK DEPOSIT</h3>
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
        </div>

        <div className="daily-table-wrapper">

          <table className="daily-table">

            <thead>

              <tr>

                <th>SLNO</th>

                <th>Deposit Date</th>

                <th>Account Name</th>

                <th>Account Number</th>

                <th>Amount Deposited</th>

                <th>Actions</th>

              </tr>

            </thead>

           <tbody>

  {currentRows.length > 0 ? (

    currentRows.map((item) => (

      <tr key={item.id}>

        <td data-label="SLNO">
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
            className="daily_edit-btn"
            onClick={() => editData(item)}
          >
            ✏️
          </button>

          <button
            className="daily_delete-btn"
            onClick={() => deleteData(item.id)}
          >
            <FaTrash />
          </button>

        </td>

      </tr>
    ))

  ) : (

   <tr className="bank-empty-row">
  <td colSpan="6">

    <div className="bank-no-data">

      <FaSearch className="bank-no-icon" />

      <p>🏦 bank not found</p>

    </div>

  </td>
</tr>
  )}

</tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}

        <div className="daily-pagination">

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

        <div className="daily_modal-overlay">

          <div className="daily_modal-box">

            <div className="daily_modal-header">

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
              className="daily_modal-body"
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

              <button className="daily_save-btn">

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