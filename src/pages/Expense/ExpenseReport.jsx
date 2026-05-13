import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./ExpenseReport.css";

import {
  FaRegCreditCard,
} from "react-icons/fa";

import {
  MdReceiptLong,
} from "react-icons/md";

const API =
  "https://zyntaweb.com/demoalafiya/api/expense_report.php";

const EXPENSE_CLASS_API =
  "https://zyntaweb.com/demoalafiya/api/expenseentry.php?dropdown=1";

const COMPANY_API =
  "https://zyntaweb.com/demoalafiya/api/company.php";

const ExpenseReport = () => {

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [expenseClasses, setExpenseClasses] =
    useState([]);

  const [expenseClassId, setExpenseClassId] =
    useState("");

  const [expenseSearch, setExpenseSearch] =
    useState("");

  const [showExpenseDropdown,
    setShowExpenseDropdown] =
    useState(false);

  const [company, setCompany] = useState({});

  const [data, setData] = useState([]);

  const [totalAmount, setTotalAmount] =
    useState(0);

  const [hasSearched, setHasSearched] =
    useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {

    fetch(EXPENSE_CLASS_API)

      .then((res) => res.json())

      .then((res) =>
        setExpenseClasses(res || [])
      )

      .catch((err) =>
        console.log(err)
      );

    fetch(COMPANY_API)

      .then((res) => res.json())

      .then((res) =>
        setCompany(res || {})
      );

  }, []);

  /* ================= FILTER ================= */

  const filteredExpenseClasses =
    expenseClasses.filter((e) =>

      e.description
        .toLowerCase()
        .includes(
          expenseSearch.toLowerCase()
        )
    );

  /* ================= FETCH REPORT ================= */

  const fetchReport = async () => {

    if (!fromDate || !toDate) {

      alert("Select From and To Date");

      return;
    }

    let url =
      `${API}?from_date=${fromDate}&to_date=${toDate}`;

    if (expenseClassId) {

      url +=
        `&expense_class_id=${expenseClassId}`;
    }

    try {

      const res = await fetch(url);

      const result = await res.json();

      setData(result.data || []);

      setTotalAmount(
        result.total_amount || 0
      );

      setHasSearched(true);

    } catch (error) {

      console.log(error);

      setData([]);

      setTotalAmount(0);

      setHasSearched(true);
    }
  };

  /* ================= PRINT ================= */

  const handlePrint = () => {

    window.print();
  };

  return (

    <div className="expense-report-page">

   <div className="expense-no-print">

        <TopNavbar />

      </div>

      <div className="expense-report-card">

        {/* TITLE */}

        <h3 className="expense-report-title">

          <FaRegCreditCard
            style={{ color: "#4e73df" }}
          />

          Expense Entry Report

        </h3>

        {/* FILTER */}

        <div className="expense-report-filter-section">

          {/* FROM DATE */}

          <div className="expense-report-filter-group">

            <label>From</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
            />

          </div>

          {/* TO DATE */}

          <div className="expense-report-filter-group">

            <label>To</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
            />

          </div>

          {/* EXPENSE CLASS */}

          <div className="expense-report-select-wrapper">

            <label>
              Expense Class
            </label>

            <div
              className="expense-report-select-display"

              onClick={() =>
                setShowExpenseDropdown(
                  !showExpenseDropdown
                )
              }
            >

              {expenseClassId

                ? expenseClasses.find(
                    (e) =>
                      e.id ==
                      expenseClassId
                  )?.description

                : "Select Expense Class"}

              <span>▼</span>

            </div>

            {showExpenseDropdown && (

              <div className="expense-report-dropdown-box">

                <div className="expense-report-search-box">

                  <input
                    type="text"

                    placeholder="Search expense class..."

                    value={expenseSearch}

                    onChange={(e) =>
                      setExpenseSearch(
                        e.target.value
                      )
                    }

                    className="expense-report-search-input"
                  />

                </div>

                <div className="expense-report-options">

                  {filteredExpenseClasses.length > 0 ? (

                    filteredExpenseClasses.map((e) => (

                      <div
                        key={e.id}

                        className="expense-report-option"

                        onClick={() => {

                          setExpenseClassId(
                            e.id
                          );

                          setShowExpenseDropdown(
                            false
                          );

                        }}
                      >

                        {e.description}

                      </div>

                    ))

                  ) : (

                    <div className="expense-report-no-results">

                      No results

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

          {/* BUTTONS */}

          <button
            className="expense-report-btn generate"
            onClick={fetchReport}
          >

            Generate

          </button>

          <button
            className="expense-report-btn print"
            onClick={handlePrint}
          >

            Print

          </button>

        </div>

        {/* TABLE */}

        {hasSearched && data.length > 0 ? (

          <div className="expense-print-section">

            {/* PRINT HEADER */}

         <div className="expense-report-print-header expense-print-only">

              <h2>
                {company.company_name}
              </h2>

              <p>
                {company.address}
              </p>

              <p>
                {company.phone}
              </p>

              <h3>
                Expense Entry Report
              </h3>

              <p>
                {fromDate} to {toDate}
              </p>

            </div>

            {/* TABLE */}

            <table className="expense-report-table">

              <thead>

                <tr>

                  <th>SLNO</th>

                  <th>Doc Num</th>

                  <th>Date</th>

                  <th>Expense Class</th>

                  <th>Amount</th>

                </tr>

              </thead>

              <tbody>

                {data.map((row, i) => (

                  <tr key={i}>

                    <td data-label="SLNO">
                      {i + 1}
                    </td>
<td data-label="Doc Num">
  {row.slno}
</td>

                    <td data-label="Date">
                      {row.date}
                    </td>

                    <td data-label="Expense Class">
                      {row.expense_class}
                    </td>

                    <td
                      data-label="Amount"
                      className="amount-cell"
                    >
                      ₹ {Number(row.amount).toFixed(2)}
                    </td>

                  </tr>

                ))}

                {/* TOTAL */}

                <tr className="expense-total-row">

                  <td
                    colSpan="5"
                    className="expense-total-single"
                  >

                    Grand Total
                    &nbsp;&nbsp;

                    ₹ {Number(totalAmount).toFixed(2)}

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        ) : hasSearched ? (

          <div className="expense-report-no-data">

            <MdReceiptLong
              className="expense-report-no-data-icon"
            />

            No data found

          </div>

        ) : null}

      </div>

    </div>
  );
};

export default ExpenseReport;