import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const linkClass = ({ isActive }) =>
  `${isActive ? "font-bold underline" : ""} mx-2 text-md font-semibold hover:underline transition-all`;

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/driverList", label: "Pilotes" },
  { to: "/circuit", label: "Circuit" },
  { to: "/standings", label: "Classement" },
  { to: "/shop", label: "Shopping" },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const authLinks = user
    ? [{ to: "/shopCart", label: "Panier" }]
    : [
        { to: "/register", label: "Inscription" },
        { to: "/login", label: "Connexion" },
      ];

  const allLinks = [...NAV_LINKS, ...authLinks];

  return (
    <nav className="p-3 border-b">
      {/* Desktop */}
      <div className="hidden md:flex justify-center items-center flex-wrap gap-1">
        {allLinks.map(({ to, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {label}
          </NavLink>
        ))}
        {user && (
          <button
            onClick={handleLogout}
            className="mx-2 text-md font-semibold hover:underline transition-all"
          >
            Déconnexion
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex justify-between items-center px-2">
        <span className="font-bold text-lg">🏎️ F1 App</span>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-2xl focus:outline-none"
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-start gap-3 mt-3 px-4 py-3 border-t">
          {allLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="text-md font-semibold hover:underline transition-all"
            >
              Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
