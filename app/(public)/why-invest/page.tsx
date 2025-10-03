import { getSectionData } from "@/lib/data/getSectionData";
import WhyInvestDetailClient from "./WhyInvestDetailClient";

interface InvestmentPoint {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export default async function WhyInvestPage() {
  const sections = await getSectionData("home");


  interface WhyInvestContent {
    mainTitle?: string;
    highlightedTitle?: string;
    description?: string;
    investmentPoints?: InvestmentPoint[];
    images?: string[];
  }


  const whyInvestSection = sections.find(
    (section: any) => section.type === "why-invest"
  );

  if (
    !whyInvestSection ||
    !whyInvestSection.content
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Why Invest content not available
        </p>
      </div>
    );
  }

  const {
    mainTitle = "WHY INVEST IN",
    highlightedTitle = "PHUKET",
    description = "",
    investmentPoints = [],
    images = [],
  } = whyInvestSection.content as WhyInvestContent;

  return (
    <WhyInvestDetailClient
      mainTitle={mainTitle}
      highlightedTitle={highlightedTitle}
      description={description}
      investmentPoints={investmentPoints}
      images={images}
    />
  );
}

export const revalidate = 30;
export const dynamic = "force-static";