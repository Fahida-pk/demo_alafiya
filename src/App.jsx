import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/Dashboard";
import Drivers from "./pages/driver/Drivers";
import  Vehicles from "./pages/vehicles/Vehicles";
import TripMaster from "./pages/trip/TripMaster";
import MainLayout from "./layouts/MainLayout";
import Users from "./pages/user/Users";
import FixedTrip from "./pages/fixedtrip/FixedTrip";
import FloatingTrips from "./pages/floatingtrip/FloatingTrips";
import Payment from "./pages/payment/payment";
import CompanySettings from "./pages/CompanySettings/CompanySettings";
import Customers  from "./pages/Customers/Customers";
import DriverReport from "./pages/DriverReport/DriverReport";
import Items from "./pages/item/Items";
import Locations from "./pages/Locations/Locations";
import Suppliers from "./pages/SUPPLIERS/SUPPLIERS";
import OrderForm from "./pages/order/OrderForm";
import OrderList from "./pages/order/OrderList";
import Brand  from "./pages/brand/Brands";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* NO SIDEBAR */}
        <Route path="/" element={<Login />} />

        {/* WITH SIDEBAR */}
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
<Route path="/locations" element={<Locations />} />
<Route path="/items" element={<Items />} />
<Route path="/suppliers" element={<Suppliers />} />
<Route path="/brands" element={<Brand />} />

<Route path="/orders" element={<OrderList />} />
<Route path="/order-form" element={<OrderForm />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
