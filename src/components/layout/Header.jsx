import { NavLink } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import imgUrl from "../../img/tracker.webp";

const linkClass = ({ isActive }) =>
  `relative px-3 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-lg transition-colors ${
    isActive
      ? "text-white bg-[var(--f1-black)]/15 shadow-[inset_0_-2px_0_var(--f1-red)]"
      : "text-white/60 hover:text-white"
  }`;

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/driverList", label: "Pilotes" },
  { to: "/circuit", label: "Circuit" },
  { to: "/standings", label: "Classement" },
  { to: "/shop", label: "Shopping" },
];

export default function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const authLinks = user
    ? [
        { to: "/shopCart", label: "Panier" },
        { to: "/orders", label: "Mes commandes" },
      ]
    : [
        { to: "/register", label: "Inscription" },
        { to: "/login", label: "Connexion" },
      ];

  const allLinks = [...NAV_LINKS, ...authLinks];

  const logoutClass =
    "px-3 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-lg border border-[var(--f1-red)]/50 text-red-500 hover:bg-[var(--f1-red)] hover:text-white transition-colors";

  return (
    <nav
      aria-label="Navigation principale"
      className="sticky top-0 z-50 px-4 py-3 border-b border-white/10 bg-[rgba(21,21,30,0.75)] backdrop-blur-md"
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {/* Gauche : logo */}
        <div className="flex-1 flex items-center">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-black text-lg tracking-tight"
          >
            <img src={imgUrl} alt="Logo F1 Tracker" className="h-4 w-auto" />
          </NavLink>
        </div>

        {/* Centre : navigation + (panier / mes commandes si connecté) */}
        <div className="flex justify-center items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
          {user &&
            authLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
        </div>

        {/* Droite : connexion / inscription (ou déconnexion) */}
        <div className="flex-1 flex justify-end items-center gap-1">
          {user ? (
            <button onClick={handleLogout} className={logoutClass}>
              Déconnexion
            </button>
          ) : (
            authLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex justify-between items-center px-2">
        <span className="font-black text-lg tracking-tight">
          <span className="text-red-500">🏎️</span> F1 App
        </span>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-2xl text-white focus:outline-none"
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-start gap-2 mt-3 px-2 py-3 border-t border-white/10">
          {allLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
          {user && (
            <button onClick={handleLogout} className={`mt-1 ${logoutClass}`}>
              Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
