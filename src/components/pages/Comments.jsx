import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function CommentSection({ idRace }) {
  const [commentaires, setCommentaires] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCommentaires();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [idRace]);

  const fetchCommentaires = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, users(username)")
      .eq("id_course", idRace)
      .order("id", { ascending: false });

    if (data) setCommentaires(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      id_utilisateur: user.id,
      commentaire: newComment,
      id_course: idRace,
    });

    if (!error) {
      setNewComment("");
      fetchCommentaires();
    }
    setLoading(false);
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Commentaires</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Laisser un commentaire..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Publier"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          <Link to="/login" className="underline">Connectez-vous</Link> pour laisser un commentaire.
        </p>
      )}

      {commentaires.length === 0 ? (
        <p className="text-sm text-gray-400">{"Aucun commentaire pour l'instant."}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {commentaires.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{c.users?.username}</span>
              </div>
              <p className="text-sm text-gray-700">{c.commentaire}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}