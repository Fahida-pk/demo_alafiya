import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdSwapHoriz } from "react-icons/md";
import { FaUserShield, FaUsers } from "react-icons/fa";
import { FaChartBar, FaChartPie, FaFileInvoice } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaMapMarkerAlt  } from "react-icons/fa";
import { FaTags,FaChartLine } from "react-icons/fa";      // Brands
import { FiCornerUpLeft } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";
import { FaTruckLoading} from "react-icons/fa"; // Suppliers
import { MdReceiptLong } from "react-icons/md";
import { TbPackage } from "react-icons/tb";
import { MdShoppingCart } from "react-icons/md";
import { MdAltRoute } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaExchangeAlt } from "react-icons/fa";
import { MdKeyboardReturn } from "react-icons/md";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaUndo } from "react-icons/fa";
import { FaRoad, FaWarehouse, FaFileImport, FaCartPlus, FaClipboardList } from "react-icons/fa";
import { MdPayments, MdExplore } from "react-icons/md";
import { FaMoneyCheckAlt,FaMoneyBillWave } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { MdAssessment} from "react-icons/md";   // ⭐ BEST (report analytics look)
import { RiBankFill } from "react-icons/ri";
import { BsBank2 } from "react-icons/bs";
import { MdAccountBalance } from "react-icons/md";
import { MdSummarize } from "react-icons/md";
import {
  FaClipboardCheck,
  FaUniversity,
  FaMapMarkedAlt,
  FaTachometerAlt,
  FaFolderOpen,
  FaUserTie,
  FaTruck,
  FaRoute,
  FaSignOutAlt,
  FaChevronDown,
  FaFileInvoiceDollar,  
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
const [tripOpen, setTripOpen] = useState(false);
const [inventoryOpen, setInventoryOpen] = useState(false);
  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("open-sidebar", handler);
    return () => window.removeEventListener("open-sidebar", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Dashboard */}
        <Link to="/dashboard" className="menu-item" onClick={() => setMobileOpen(false)}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        {/* ================= MASTER ================= */}
        <div
          className="menu-item"
          onClick={() => setOpenMenu(openMenu === "master" ? null : "master")}
        >
          <FaFolderOpen />
          <span>Master</span>
          <FaChevronDown className={openMenu === "master" ? "rotate" : ""} />
        </div>

        {openMenu === "master" && (
          <div className="submenu">
            <Link to="/drivers" onClick={() => setMobileOpen(false)}>
              <FaUserTie />
              <span>Driver</span>
            </Link>

            <Link to="/vehicles" onClick={() => setMobileOpen(false)}>
              <FaTruck />
              <span>Vehicle</span>
            </Link>

            <Link to="/trips" onClick={() => setMobileOpen(false)}>
              <FaRoute />
              <span>Route</span>
            </Link>
           {/* ✅ NEW CUSTOMER */}
    <Link to="/customers" onClick={() => setMobileOpen(false)}>
      <FaUsers />
      <span>Customer</span>
    </Link>
    <Link to="/items" onClick={() => setMobileOpen(false)}>
      <FaClipboardCheck />
      <span>Item</span>
    </Link>
    <Link to="/locations">
  <FaMapMarkerAlt  />
  <span>Location</span>
</Link>
<Link to="/suppliers" onClick={() => setMobileOpen(false)}>
      <FaTruckLoading />
      <span>Supplier</span>
    </Link>
    <Link to="/brands" onClick={() => setMobileOpen(false)}>
      <FaTags />
      <span>Brand</span>
    </Link>
          </div>
    
        )}

     {/* ================= TRANSACTION ================= */}
{/* ================= TRIP ================= */}
<div
  className="menu-item"
  onClick={() => setTripOpen(!tripOpen)}
>
  <MdAltRoute />
  <span>Trip</span>
  <FaChevronDown className={tripOpen ? "rotate" : ""} />
</div>

{tripOpen && (
  <div className="submenu">

    <Link to="/fixed-trips" onClick={() => setMobileOpen(false)}>
      <FaRoad />
      <span>Fixed Trip</span>
    </Link>

    <Link to="/floating-trips" onClick={() => setMobileOpen(false)}>
      <MdExplore />
      <span>Floating Trip</span>
    </Link>

    <Link to="/report" onClick={() => setMobileOpen(false)}>
      <MdPayments />
      <span>Trip Settlement</span>
    </Link>

  </div>
)}

{/* ================= INVENTORY ================= */}
<div
  className="menu-item"
  onClick={() => setInventoryOpen(!inventoryOpen)}
>
  <FaWarehouse />
  <span>Inventory</span>
  <FaChevronDown className={inventoryOpen ? "rotate" : ""} />
</div>

{inventoryOpen && (
  <div className="submenu">

    <Link to="/grn-list" onClick={() => setMobileOpen(false)}>
      <FaFileImport />
      <span>GRN</span>
    </Link>

    <Link to="/orders" onClick={() => setMobileOpen(false)}>
      <FaCartPlus />
      <span>Orders</span>
    </Link>

    <Link to="/daily-picking" onClick={() => setMobileOpen(false)}>
      <FaClipboardList />
      <span>Daily Picking</span>
    </Link>
    <Link to="/oha-list" onClick={() => setMobileOpen(false)}>
      <FaExchangeAlt />
      <span>OHA</span>
    </Link>
    
  </div>
  
)}
{/* ================= ACCOUNTS ================= */}

<div
  className="menu-item"
  onClick={() =>
    setOpenMenu(openMenu === "accounts" ? null : "accounts")
  }
>
  <MdAccountBalanceWallet />
  <span>Accounts</span>

  <FaChevronDown
    className={openMenu === "accounts" ? "rotate" : ""}
  />
</div>

{openMenu === "accounts" && (
  <div className="submenu">

    <Link
      to="/daily-settlement"
      onClick={() => setMobileOpen(false)}
    >
      <FaMoneyCheckAlt />
      <span>Daily Settlement</span>
    </Link>
<Link
  to="/expense"
  onClick={() => setMobileOpen(false)}
>
  <FaMoneyBillWave />
  <span>Expense Entry</span>
</Link>
<Link
  to="/bank-deposit"
  onClick={() => setMobileOpen(false)}
>
  <FaUniversity />
  <span>Bank Deposit</span>
</Link>
  </div>
)}
{/* ================= REPORT ================= */}
{/* ================= REPORT ================= */}
<div
  className="menu-item"
  onClick={() => setOpenMenu(openMenu === "report" ? null : "report")}
>
  <FaChartPie />
  <span>Report</span>
  <FaChevronDown className={openMenu === "report" ? "rotate" : ""} />
</div>

{openMenu === "report" && (
  <div className="submenu">

    

    <Link to="/driver-report" onClick={() => setMobileOpen(false)}>
  <FaChartBar className="sidebar-icon" />
      <span>Driver Report</span>
    </Link>

    <Link to="/grn-report" onClick={() => setMobileOpen(false)}>
      <HiOutlineDocumentReport className="sidebar-icon" />
      <span>GRN Report</span>
    </Link>
    <Link to="/oha-report" onClick={() => setMobileOpen(false)}>
    
      <FiCornerUpLeft className="sidebar-icon" />
      <span>OHA Report</span>
    </Link>
 
    <Link to="/current-stock-report" onClick={() => setMobileOpen(false)}>
  <MdAssessment className="sidebar-icon" />
      <span>Current Stock Report</span>
    </Link>
       <Link to="/daily-report-summary" onClick={() => setMobileOpen(false)}>
  <MdSummarize className="sidebar-icon" />
  <span>Daily Report Summary</span>
</Link>
    <Link
  to="/expense-report"
  onClick={() => setMobileOpen(false)}
>
  <FaChartLine className="sidebar-icon" />
  <span>Expense Report</span>
</Link>
<Link
  to="/bank-deposit-report"
  onClick={() => setMobileOpen(false)}
>
  <BsBank2 className="sidebar-icon" />
  <span>Bank Deposit Report</span>
</Link>
  </div>
)}


        {/* ================= BOTTOM SECTION ================= */}
        <div className="bottom-section">

          {role === "ADMIN" && (
            <>
              <div
                className="menu-item1"
                onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}
              >
                <FaUserShield />
                <span>Admin</span>
                <FaChevronDown className={openMenu === "admin" ? "rotate" : ""} />
              </div>

           {openMenu === "admin" && (
  <div className="submenu">
    <Link to="/users" onClick={() => setMobileOpen(false)}>
      <FaUsers />
      <span>User</span>
    </Link>

    <Link to="/company-settings" onClick={() => setMobileOpen(false)}>
  <FaBuilding />
  <span>Company</span>
</Link>

  </div>
)}

            </>
          )}

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>

      </div>
    </>
  );
};

export default Sidebar;