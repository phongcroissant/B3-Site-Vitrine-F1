import { Link, Outlet, NavLink } from "react-router-dom";

import DriversStanding from "./DriversStanding";
import ConstructorsStanding from "./ConstructorsStanding";

export default function Standings() {
  return (
    <div>
      <h1 className="text-center p-5 font-bold text-3xl">Classement</h1>
      <nav className="text-center">
        <NavLink
          to="."
          end
          className={({ isActive }) =>
            `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
          }
        >
          Pilotes
        </NavLink>
        <NavLink
          to="constructorsStanding"
          className={({ isActive }) =>
            `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
          }
        >
          Constructeurs
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
