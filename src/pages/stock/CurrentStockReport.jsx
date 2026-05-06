import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "../oha/OHAReport.css";
import { MdKeyboardReturn } from "react-icons/md";

const API = "https://zyntaweb.com/demoalafiya/api/current_stock_report.php";
const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const COMPANY_API = "https://zyntaweb.com/demoalafiya/api/company.php";

const CurrentStockReport = () => {

  const [asOnDate, setAsOnDate] = useState("");

  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");

  const [itemSearch, setItemSearch] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const [data, setData] = useState([]);
  const [company, setCompany] = useState({});
  const [hasSearched, setHasSearched] = useState(false);

  /* LOAD */
  useEffect(() => {

    fetch(ITEM_API)
      .then(res => res.json())
      .then(res => setItems(res.data || res || []));

    fetch(COMPANY_API)
      .then(res => res.json())
      .then(setCompany);

  }, []);

  /* FILTER */
  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  /* FETCH REPORT */
  const fetchReport = async () => {

    if (!asOnDate) {
      alert("Select As On Date");
      return;
    }

    let url = `${API}?as_on_date=${asOnDate}`;

    if (itemId) url += `&item_id=${itemId}`;

    try {
      const res = await fetch(url);
      const result = await res.json();

      setData(result.data || []);
      setHasSearched(true);

    } catch {
      setData([]);
      setHasSearched(true);
    }
  };

  return (
    <div className="oha-page-wrapper">

      <div className="no-print">
        <TopNavbar />
      </div>

      <div className="oha-card-container">

        <h3 className="oha-title">
          <MdKeyboardReturn style={{ color: "#4e73df" }} />
          CURRENT STOCK REPORT
        </h3>

        {/* FILTER */}
        <div className="oha-filter-section">

          <div className="oha-filter-group">
            <label> Date</label>
            <input
              type="date"
              value={asOnDate}
              onChange={e => setAsOnDate(e.target.value)}
            />
          </div>

          {/* ITEM */}
          <div className="oha-select-wrapper">
            <label>Item</label>

            <div className="oha-select-display"
              onClick={() => setShowItemDropdown(!showItemDropdown)}>
              {itemId
                ? items.find(i => i.id == itemId)?.name
                : "Select item"}
              <span>▼</span>
            </div>

            {showItemDropdown && (
              <div className="oha-dropdown-box">

                <div className="oha-search-box">
                  <input
                    type="text"
                    placeholder="Search item..."
                    value={itemSearch}
                    onChange={(e)=>setItemSearch(e.target.value)}
                    className="oha-search-input"
                  />
                </div>

                <div className="oha-options">
                  {filteredItems.map(i => (
                    <div key={i.id}
                      className="oha-option"
                      onClick={()=>{
                        setItemId(i.id);
                        setShowItemDropdown(false);
                        setItemSearch("");
                      }}>
                      {i.name}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          <button className="oha-btn generate" onClick={fetchReport}>
            Generate
          </button>

          <button className="oha-btn print" onClick={()=>window.print()}>
            Print
          </button>

        </div>

        {hasSearched && data.length > 0 ? (

          <div className="print-section">

            {/* PRINT HEADER */}
            <div className="oha-print-header print-only">
              <h2>{company.company_name}</h2>
              <p>{company.address}</p>
              <p>{company.phone}</p>
              <h3>CURRENT STOCK REPORT</h3>
              <p>As On: {asOnDate}</p>
            </div>

            {/* TABLE */}
            <table className="oha-table">
  <thead>
    <tr>
      <th>Item</th>
      <th>Batch</th>
      <th>Expiry</th>
      <th>Location</th>
      <th>Available Qty</th>
    </tr>
  </thead>

  <tbody>
    {data.map((row, i) => (
      <tr key={i}>
        <td data-label="Item">{row.item_name}</td>
        <td data-label="Batch">{row.batch}</td>
        <td data-label="Expiry">{row.expiry}</td>
        <td data-label="Location">{row.location || "-"}</td>
        <td data-label="Available Qty">{row.available_qty}</td>
      </tr>
    ))}
  </tbody>
</table>
          </div>

        ) : hasSearched ? (

          <div className="oha-no-data">
            <MdKeyboardReturn className="oha-no-data-icon" /> No data found
          </div>

        ) : null}

      </div>
    </div>
  );
};

export default CurrentStockReport;