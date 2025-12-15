import { Link, Outlet } from "react-router-dom";

import DriversStanding from "./DriversStanding";
import ConstructorsStanding from "./ConstructorsStanding";

export default function Standings() {
  return (
    <div>
      <h1 className="text-center p-5 font-bold text-3xl">Classement</h1>
      <nav className="text-center">
        <Link to="driversStanding" className="mx-2">
          Pilotes
        </Link>
        <Link to="constructorsStanding" className="mx-2">
          Constructeurs
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
