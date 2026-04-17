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
import Customers from "./pages/Customers/Customers";
import CompanySettings from "./pages/CompanySettings/CompanySettings";
import DriverReport from "./pages/DriverReport/DriverReport";
import Brands  from "./pages/brand/Brands";
import Items  from "./pages/item/Items";
import OrderForm from "./pages/order/OrderForm";
import OrderList from "./pages/order/OrderList";

import Locations  from "./pages/Locations/Locations";
import Suppliers  from "./pages/SUPPLIERS/SUPPLIERS";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
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
<Route path="/order-form" element={<OrderForm />} />
          {/* ✅ BRAND ROUTE */}
          <Route path="/brands" element={<Brands />} />
          <Route path="/items" element={<Items />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/order-list" element={<OrderList />} />

          <Route path="/suppliers" element={<Suppliers />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;