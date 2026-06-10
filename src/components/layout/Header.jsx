import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
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
      {user ? (
        <>
          <NavLink
            to="/shopCart"
            className={({ isActive }) =>
              `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
            }
          >
            Panier
          </NavLink>
          <button
            onClick={handleLogout}
            className="mx-2 text-md font-semibold hover:underline"
          >
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
            }
          >
            Inscription
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${isActive && "font-bold underline"} mx-2 text-md text-semibold`
            }
          >
            Connexion
          </NavLink>
        </>
      )}
    </nav>
  );
}
