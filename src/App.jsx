import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Header";
import Home from "./components/pages/Home";
import DriverList from "./components/pages/DriverList";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/driverList" element={<DriverList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
