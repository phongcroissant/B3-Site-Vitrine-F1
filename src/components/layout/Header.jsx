import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="p-2 text-center ">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${isActive && "bg-amber-400"} mx-2 text-md text-semibold`
        }
      >
        Accueil
      </NavLink>
      <NavLink
        to="/driverList"
        className={({ isActive }) =>
          `${isActive && "bg-amber-400"} mx-2 text-md text-semibold`
        }
        state={{ txt: "State test" }}
      >
        Pilotes
      </NavLink>
      <NavLink
        to="/standings"
        className={({ isActive }) =>
          `${isActive && "bg-amber-400"} mx-2 text-md text-semibold`
        }
      >
        Classement
      </NavLink>
    </nav>
  );
}
