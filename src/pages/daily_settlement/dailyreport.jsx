import { useEffect, useState } from "react";

import TopNavbar from "../dashboard/TopNavbar";

import "./DailyReportSummary.css";

import { BsCashStack } from "react-icons/bs";

import { MdReceiptLong } from "react-icons/md";

const API =
  "https://zyntaweb.com/demoalafiya/api/DailySummaryReport.php";

const COMPANY_API =
  "https://zyntaweb.com/demoalafiya/api/company.php";

const DailyReportSummary = () => {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [company, setCompany] =
    useState({});

  const [data, setData] =
    useState([]);

  const [totals, setTotals] =
    useState({

      opening: 0,

      inflow: 0,

      expense: 0,

      deposit: 0,

      cash: 0,

    });

  const [hasSearched, setHasSearched] =
    useState(false);

  /* ================= COMPANY ================= */

  useEffect(() => {

    fetch(COMPANY_API)

      .then((res) => res.json())

      .then((res) =>
        setCompany(res || {})
      )

      .catch((err) =>
        console.log(err)
      );

  }, []);

  /* ================= FETCH REPORT ================= */

  const fetchReport = async () => {

    if (!fromDate || !toDate) {

      alert("Select From and To Date");

      return;
    }

    try {

      const res = await fetch(

        `${API}?from_date=${fromDate}&to_date=${toDate}`

      );

      const result = await res.json();

      setData(result.data || []);

      setTotals({

        opening:
          Number(result.total_opening || 0),

        inflow:
          Number(result.total_inflow || 0),

        expense:
          Number(result.total_expense || 0),

        deposit:
          Number(result.total_deposit || 0),

        cash:
          Number(result.total_cash_in_hand || 0),

      });

      setHasSearched(true);

    } catch (error) {

      console.log(error);

      setData([]);

      setHasSearched(true);
    }
  };

  /* ================= PRINT ================= */

  const handlePrint = () => {

    window.print();
  };

  return (

    <div className="dailyreport-page">

      {/* ================= NAVBAR ================= */}

      <div className="no-print">

        <TopNavbar />

      </div>

      {/* ================= CARD ================= */}

      <div className="dailyreport-card">

        {/* ================= TITLE ================= */}

        <h3 className="dailyreport-title">

          <BsCashStack
            style={{ color: "#4e73df" }}
          />

          Daily Summary Report

        </h3>

        {/* ================= FILTER ================= */}

        <div className="dailyreport-filter-section">

          <div className="dailyreport-filter-group">

            <label>From</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
            />

          </div>

          <div className="dailyreport-filter-group">

            <label>To</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
            />

          </div>

          <button
            className="dailyreport-btn generate"
            onClick={fetchReport}
          >
            Generate
          </button>

          <button
            className="dailyreport-btn print"
            onClick={handlePrint}
          >
            Print
          </button>

        </div>

        {/* ================= TABLE ================= */}

        {hasSearched && data.length > 0 ? (

          <div className="dailyreport-print-section">

            {/* ================= PRINT HEADER ================= */}

            <div className="dailyreport-print-header dailyreport-print-only">

              <h2>
                {company.company_name}
              </h2>

              <p>{company.address}</p>

              <p>{company.phone}</p>

              <h3>
                Daily Summary Report
              </h3>

              <p>
                {fromDate} to {toDate}
              </p>

            </div>

            {/* ================= TABLE ================= */}

            <table className="dailyreportsummary-table">

              <thead>

                <tr>

                  <th>SLNO</th>

                  <th>Date</th>

                  <th>Opening</th>

                  <th>Inflow</th>

                  <th>Expense</th>

                  <th>Deposit</th>

                  <th>Cash In Hand</th>

                </tr>

              </thead>

              <tbody>

                {data.map((row, i) => (

                  <tr key={i}>

                    <td data-label="SLNO">
                      {i + 1}
                    </td>

                    <td data-label="Date">
                      {row.date}
                    </td>

                    <td data-label="Opening">
                      ₹ {Number(
                        row.opening || 0
                      ).toFixed(2)}
                    </td>

                    <td data-label="Inflow">
                      ₹ {Number(
                        row.inflow || 0
                      ).toFixed(2)}
                    </td>

                    <td data-label="Expense">
                      ₹ {Number(
                        row.expense || 0
                      ).toFixed(2)}
                    </td>

                    <td data-label="Deposit">
                      ₹ {Number(
                        row.deposit || 0
                      ).toFixed(2)}
                    </td>

                    <td
                      data-label="Cash In Hand"
                      className="dailyreport-cash-cell"
                    >
                      ₹ {Number(
                        row.cash_in_hand || 0
                      ).toFixed(2)}
                    </td>

                  </tr>

                ))}

                {/* ================= TOTAL ROW ================= */}

                

              </tbody>

            </table>

          </div>

        ) : hasSearched ? (

          <div className="dailyreport-no-data">

            <MdReceiptLong
              className="dailyreport-no-data-icon"
            />

            No data found

          </div>

        ) : null}

      </div>

    </div>
  );
};

export default DailyReportSummary;