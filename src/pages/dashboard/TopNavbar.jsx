import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TopNavbar = () => {
  const [role, setRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r.toLowerCase());
  }, []);

  const openSidebar = () => {
    window.dispatchEvent(new Event("open-sidebar"));
  };

  const getTitle = () => {
    const path = location.pathname.toLowerCase();

    // ===== MASTER =====
    if (path === "/drivers") return "Driver";
    if (path === "/vehicles") return "Vehicle";
    if (path === "/trips") return "Route";
    if (path === "/customers") return "Customer";
    if (path === "/items") return "Item";
    if (path === "/locations") return "Location";
    if (path === "/suppliers") return "Supplier";
    if (path === "/brands") return "Brand";

    // ===== TRANSACTION =====
    if (path === "/fixed-trips") return "Fixed Trip";
    if (path === "/floating-trips") return "Floating Trip";
    if (path === "/report") return "Trip Settlement"; // ⚠️ important
    if (path === "/orders") return "Orders";
    if (path === "/grn-list") return "GRN";

    // ===== REPORT =====
    if (path === "/driver-report") return "Driver Report";

    // ===== ADMIN =====
    if (path === "/users") return "User";
    if (path === "/company-settings") return "Company";

    return "Dashboard";
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="menu-icon" onClick={openSidebar}>☰</span>
        <span>{getTitle()}</span>
      </div>

      <div className="topbar-right">
        Welcome, <b>{role === "admin" ? "Admin" : "User"}</b>
      </div>
    </div>
  );
};

export default TopNavbar;