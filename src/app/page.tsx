import { Approach } from "@/components/marketing/approach";
import { ChallengeCta } from "@/components/marketing/challenge-cta";
import { Hero } from "@/components/marketing/hero";
import { ParentsTeaser } from "@/components/marketing/parents-teaser";
import { PilotStatus } from "@/components/marketing/pilot-status";
import { UnitTeasers } from "@/components/marketing/unit-teasers";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Approach />
      <ChallengeCta />
      <UnitTeasers />
      <ParentsTeaser />
      <PilotStatus />
    </>
  );
}
