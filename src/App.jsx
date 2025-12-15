import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Header";
import Home from "./components/pages/Home";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
