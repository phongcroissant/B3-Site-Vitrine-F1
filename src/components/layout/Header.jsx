"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/driverList", label: "Pilotes" },
  { href: "/circuit", label: "Circuit" },
  { href: "/standings", label: "Classement" },
  { href: "/shop", label: "Shopping" },
];

const linkClass = (isActive) =>
  `relative px-3 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-lg transition-colors ${
    isActive
      ? "text-white bg-[var(--f1-black)]/15 shadow-[inset_0_-2px_0_var(--f1-red)]"
      : "text-white/60 hover:text-white"
  }`;

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Équivalent du NavLink de React Router : lien actif selon l'URL courante.
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const authLinks = user
    ? [
        { href: "/shopCart", label: "Panier" },
        { href: "/orders", label: "Mes commandes" },
      ]
    : [
        { href: "/register", label: "Inscription" },
        { href: "/login", label: "Connexion" },
      ];

  const allLinks = [...NAV_LINKS, ...authLinks];

  const logoutClass =
    "px-3 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-lg border border-[var(--f1-red)]/50 text-red-500 hover:bg-[var(--f1-red)] hover:text-white transition-colors";

  const navLink = ({ href, label }, onClick) => (
    <Link
      key={href}
      href={href}
      onClick={onClick}
      aria-current={isActive(href) ? "page" : undefined}
      className={linkClass(isActive(href))}
    >
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Navigation principale"
      className="sticky top-0 z-50 px-4 py-3 border-b border-white/10 bg-[rgba(21,21,30,0.75)] backdrop-blur-md"
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {/* Gauche : logo */}
        <div className="flex-1 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-lg tracking-tight"
          >
            <Image
              src="/img/tracker.webp"
              alt="Logo F1 Tracker"
              width={382}
              height={24}
              priority
              className="h-4 w-auto"
            />
          </Link>
        </div>

        {/* Centre : navigation + (panier / mes commandes si connecté) */}
        <div className="flex justify-center items-center gap-1">
          {NAV_LINKS.map((link) => navLink(link))}
          {user && authLinks.map((link) => navLink(link))}
        </div>

        {/* Droite : connexion / inscription (ou déconnexion) */}
        <div className="flex-1 flex justify-end items-center gap-1">
          {user ? (
            <button onClick={handleLogout} className={logoutClass}>
              Déconnexion
            </button>
          ) : (
            authLinks.map((link) => navLink(link))
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
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-start gap-2 mt-3 px-2 py-3 border-t border-white/10">
          {allLinks.map((link) => navLink(link, closeMenu))}
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
