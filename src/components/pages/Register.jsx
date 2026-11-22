import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm)
      return setError("Les mots de passe ne correspondent pas.");
    if (password.length < 8) return setError("8 caractères minimum.");

    const username = pseudo.trim();
    if (!username) return setError("Le pseudo est obligatoire.");

    setLoading(true);

    // 1. Vérifier que le pseudo est libre, pour afficher un message clair
    const { data: available, error: checkError } = await supabase.rpc(
      "username_available",
      { p_username: username },
    );

    if (checkError) {
      setError(checkError.message);
      setLoading(false);
      return;
    }

    if (!available) {
      setError("Ce pseudo est déjà utilisé.");
      setLoading(false);
      return;
    }

    // 2. Créer le compte : le profil est créé par le trigger on_auth_user_created,
    //    dans la même transaction. Si ça échoue, aucun compte n'est créé.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      // Cas rare : le pseudo a été pris entre la vérification et l'inscription
      setError(
        error.message === "Database error saving new user"
          ? "Ce pseudo est déjà utilisé."
          : error.message,
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/");
  };

  const inputClass = "f1-input";

  const labelClass = "block text-sm font-medium text-white/70 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 f1-fade-up">
      <div className="w-full max-w-md f1-card p-8">
        <p className="f1-eyebrow text-center">Formula 1</p>
        <h1 className="f1-title text-3xl mb-1 text-center">Créer un compte</h1>
        <div className="f1-accent-line max-w-[8rem] mx-auto mb-6" />

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-500 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="pseudo" className={labelClass}>
              Pseudo
            </label>
            <input
              id="pseudo"
              type="text"
              placeholder="Votre pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="8 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="f1-btn w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Chargement..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-white/50 mt-6">
          Déjà un compte ?{" "}
          <a href="/login" className="f1-link">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
