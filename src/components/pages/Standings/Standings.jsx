import { Outlet, NavLink } from "react-router-dom";

export default function Standings() {
  const tabClass = ({ isActive }) =>
    `f1-pill ${isActive ? "f1-pill-active" : "f1-pill-idle"}`;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1</p>
        <h1 className="f1-title text-4xl md:text-6xl mb-4">Classement</h1>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>
      <nav className="flex justify-center gap-3 mb-8">
        <NavLink to="." end className={tabClass}>
          Pilotes
        </NavLink>
        <NavLink to="constructorsStanding" className={tabClass}>
          Constructeurs
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
