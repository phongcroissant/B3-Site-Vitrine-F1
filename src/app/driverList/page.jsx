import DriverList from "@/components/pages/DriverList";
import { getDrivers } from "@/lib/f1";

export const revalidate = 3600;

export const metadata = {
  title: "Pilotes de Formule 1",
  description: "Tous les pilotes de la saison de Formule 1 en cours, avec leur écurie et leur numéro.",
  alternates: { canonical: "/driverList" },
};

export default async function Page() {
  const { drivers, error } = await getDrivers();
  return <DriverList drivers={drivers} error={error} />;
}
