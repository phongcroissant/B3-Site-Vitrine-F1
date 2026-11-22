"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/standings", label: "Pilotes" },
  { href: "/standings/constructorsStanding", label: "Constructeurs" },
];

// Onglets du classement (remplace les NavLink de React Router).
export default function StandingsTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Type de classement" className="flex justify-center gap-3 mb-8">
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`f1-pill ${active ? "f1-pill-active" : "f1-pill-idle"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
