import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { Approach } from "@/components/marketing/approach";
import { AssessmentSection } from "@/components/marketing/assessment-section";
import { ChallengeSection } from "@/components/marketing/challenge-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { Hero } from "@/components/marketing/hero";
import { PilotStatus } from "@/components/marketing/pilot-status";
import { ProgrammeOverview } from "@/components/marketing/programme-overview";

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Approach />
        <ProgrammeOverview />
        <ChallengeSection />
        <AssessmentSection />
        <PilotStatus />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
