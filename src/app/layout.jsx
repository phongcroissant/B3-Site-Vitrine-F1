import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Balises SEO par défaut, complétées par chaque page.
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "F1 Tracker – Résultats, classements et boutique Formule 1",
    template: "%s | F1 Tracker",
  },
  description:
    "Résultats du dernier Grand Prix, classements pilotes et écuries, fiches pilotes, calendrier des circuits et boutique F1. Gratuit et sans publicité.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "F1 Tracker",
  },
  icons: { icon: "/img/tracker-favicon.webp" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Aller au contenu
        </a>
        <AuthProvider>
          <Header />
          <main id="main-content">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
