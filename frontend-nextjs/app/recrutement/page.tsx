import { pageMetadata } from "@/lib/seo";
import { RecruitmentClient } from "@/components/public/RecruitmentClient";

export const metadata = pageMetadata(
  "Recrutement",
  "Rejoignez 2JK Services : agents d'entretien, techniciens, chefs d'equipe. Postulez en ligne.",
  "/recrutement/"
);

export default function RecruitmentPage() {
  return <RecruitmentClient />;
}
