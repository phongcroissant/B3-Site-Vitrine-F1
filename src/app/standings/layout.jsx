import StandingsTabs from "@/components/pages/Standings/StandingsTabs";
import PageHeading from "@/components/ui/PageHeading";

export default function StandingsLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 f1-fade-up">
      <PageHeading>Classement</PageHeading>
      <StandingsTabs />
      {children}
    </div>
  );
}
