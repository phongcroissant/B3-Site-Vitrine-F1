import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const questions = [
  {
    id: 1,
    question: "Quel pilote a remporté le plus de titres mondiaux ?",
    options: ["Schumacher", "Hamilton", "Vettel", "Senna"],
    answer: "Hamilton"
  },
  {
    id: 2,
    question: "Quel circuit accueille le Grand Prix de Monaco ?",
    options: ["Monza", "Monte-Carlo", "Silverstone", "Spa"],
    answer: "Monte-Carlo"
  },
  {
    id: 3,
    question: "Combien de roues a une F1 ?",
    options: ["2", "3", "4", "6"],
    answer: "4"
  }
];

// Obtenir toutes les questions (sans réponses)
app.get("/api/questions", (req, res) => {
  res.json(questions.map(({ answer, ...q }) => q));
});

// Vérifier une réponse
app.post("/api/answer", (req, res) => {
  const { id, answer } = req.body;
  const q = questions.find(q => q.id === id);
  if (!q) return res.status(404).json({ message: "Question introuvable" });

  res.json({ correct: q.answer === answer });
});

app.listen(3000, () => console.log("✅ API Quiz F1 sur http://localhost:3000"));
