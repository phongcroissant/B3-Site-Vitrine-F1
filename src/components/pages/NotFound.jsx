import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Cette page n'existe pas.</p>
      <Link to="/" className="mt-6 inline-block underline">
        Retour à l'accueil
      </Link>
    </div>
  );
}