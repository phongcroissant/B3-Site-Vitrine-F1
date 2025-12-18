import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="p-2 text-center ">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
        }
      >
        Accueil
      </NavLink>
      <NavLink
        to="/driverList"
        className={({ isActive }) =>
          `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
        }
        state={{ txt: "State test" }}
      >
        Pilotes
      </NavLink>
      <NavLink
        to="/circuit"
        className={({ isActive }) =>
          `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
        }
        state={{ txt: "State test" }}
      >
        Circuit
      </NavLink>
      <NavLink
        to="/standings"
        className={({ isActive }) =>
          `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
        }
      >
        Classement
      </NavLink>
      <NavLink
        to="/shop"
        className={({ isActive }) =>
          `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
        }
      >
        Shopping
      </NavLink>
      <NavLink
        to="/shopCart"
        className={({ isActive }) =>
          `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
        }
      >
        Panier
      </NavLink>
    </nav>
  );
}
