import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Header";
import Home from "./components/pages/Home";
import DriverList from "./components/pages/DriverList";
import Standings from "./components/pages/Standings/Standings";
import DriversStanding from "./components/pages/Standings/DriversStanding";
import ConstructorsStanding from "./components/pages/Standings/ConstructorsStanding";
import Circuit from "./components/pages/Races/Circuit";
import RaceResult from "./components/pages/Races/RaceResult";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </BrowserRouter>
    </>
  );
}
