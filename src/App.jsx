import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Header";
import Home from "./components/pages/Home";
import DriverList from "./components/pages/DriverList";
import Standings from "./components/pages/Standings/Standings";
import DriversStanding from "./components/pages/Standings/DriversStanding";
import ConstructorsStanding from "./components/pages/Standings/ConstructorsStanding";
import Circuit from "./components/pages/Races/Circuit";
import RaceResult from "./components/pages/Races/RaceResult";
import Shop from "./components/pages/Shop/Shop";
import ShopCart from "./components/pages/Shop/ShopCart";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./components/pages/NotFound";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>

        <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/driverList" element={<DriverList />} />
          <Route path="/circuit" element={<Circuit />} />
          <Route path="/raceResult/:round" element={<RaceResult />} />
          <Route path="/standings" element={<Standings />}>
            <Route index element={<DriversStanding />} />
            <Route
              path="constructorsStanding"
              element={<ConstructorsStanding />}
            />
          </Route>
          <Route path="/shop" element={<Shop />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/shopCart" element={<ShopCart />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
