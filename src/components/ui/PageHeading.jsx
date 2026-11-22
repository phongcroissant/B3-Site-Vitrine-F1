// En-tête de page : sur-titre, titre principal (h1) et liseré.
export default function PageHeading({ children }) {
  return (
    <div className="f1-section-head">
      <p className="f1-eyebrow">Formula 1</p>
      <h1 className="f1-title text-4xl md:text-6xl mb-4">{children}</h1>
      <div className="f1-accent-line max-w-xs mx-auto" />
    </div>
  );
}
