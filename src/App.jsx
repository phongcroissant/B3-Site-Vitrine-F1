import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Header";
import Home from "./components/pages/Home";
import DriverList from "./components/pages/DriverList";
import Standings from "./components/pages/Standings/Standings";
import DriversStanding from "./components/pages/Standings/DriversStanding";
import ConstructorsStanding from "./components/pages/Standings/ConstructorsStanding";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/driverList" element={<DriverList />} />
          <Route path="/standings" element={<Standings />}>
            <Route path="driversStanding" element={<DriversStanding />} />
            <Route
              path="constructorsStanding"
              element={<ConstructorsStanding />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
