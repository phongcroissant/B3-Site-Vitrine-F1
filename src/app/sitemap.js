import { getSeasonRaces } from "@/lib/f1";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// sitemap.xml : pages publiques + une page de résultats par Grand Prix.
export default async function sitemap() {
  const pages = ["", "/driverList", "/circuit", "/standings", "/standings/constructorsStanding", "/shop"];
  const { races } = await getSeasonRaces();

  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" })),
    ...races.map((race) => ({
      url: `${siteUrl}/raceResult/${race.round}`,
      changeFrequency: "monthly",
    })),
  ];
}
