import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/Dashboard";
import Drivers from "./pages/driver/Drivers";
import Vehicles from "./pages/vehicles/Vehicles";
import TripMaster from "./pages/trip/TripMaster";
import MainLayout from "./layouts/MainLayout";
import Users from "./pages/user/Users";
import FixedTrip from "./pages/fixedtrip/FixedTrip";
import FloatingTrips from "./pages/floatingtrip/FloatingTrips";
import Payment from "./pages/payment/payment";
import CompanySettings from "./pages/CompanySettings/CompanySettings";
import Customers from "./pages/Customers/Customers";
import DriverReport from "./pages/DriverReport/DriverReport";
import Items from "./pages/item/Items";
import Locations from "./pages/Locations/Locations";
import Suppliers from "./pages/SUPPLIERS/SUPPLIERS";
import OrderForm from "./pages/order/OrderForm";
import OrderList from "./pages/order/OrderList";
import Brand from "./pages/brand/Brands";
import GrnForm from "./pages/grn/GrnForm";
import GrnList from "./pages/grn/GrnList";
import DailyPicking from "./pages/order/DailyPicking";
import OhaForm from "./pages/oha/OhaForm";
import OhaList from "./pages/oha/OhaList";
import GRNReport from "./pages/grn/GRNReport";
import OHAReport from "./pages/oha/OHAReport";
import CurrentStockReport from "./pages/stock/CurrentStockReport";
import DailySettlement from "./pages/daily_settlement/DailySettlement";
import ProtectedRoute from "./pages/login/ProtectedRoute";
import Expense  from "./pages/Expense/expense";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/trips" element={<TripMaster />} />
          <Route path="/fixed-trips" element={<FixedTrip />} />
          <Route path="/floating-trips" element={<FloatingTrips />} />
          <Route path="/report" element={<Payment />} />
          <Route path="/driver-report" element={<DriverReport />} />
          <Route path="/company-settings" element={<CompanySettings />} />
          <Route path="/users" element={<Users />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/items" element={<Items />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/brands" element={<Brand />} />
          <Route path="/order-form/:id" element={<OrderForm />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/order-form" element={<OrderForm />} />
          <Route path="/grn-form/:id" element={<GrnForm />} />
          <Route path="/grn-form" element={<GrnForm />} />
          <Route path="/grn-list" element={<GrnList />} />
          <Route path="/daily-picking" element={<DailyPicking />} />
          <Route path="/daily-settlement" element={<DailySettlement />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/oha-form/:id" element={<OhaForm />} />
          <Route path="/oha-form" element={<OhaForm />} />
          <Route path="/oha-list" element={<OhaList />} />
          <Route path="/grn-report" element={<GRNReport />} />
          <Route path="/oha-report" element={<OHAReport />} />
          <Route
            path="/current-stock-report"
            element={<CurrentStockReport />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;