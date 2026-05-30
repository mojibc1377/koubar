import { Features } from "@/components/Features";
import { GiftGrid } from "@/components/GiftGrid";
import { GiftingArt } from "@/components/GiftingArt";
import { Hero } from "@/components/Hero";
import ImageSlider3D from "@/components/lightswind/ 3d-image-slider";
import SmokeyBackground from "@/components/lightswind/smokey-background";
import { LimitedOffers } from "@/components/LimitedOffers";
import { PageShell } from "@/components/PageShell";
import { SeasonalBestsellers } from "@/components/SeasonalBestsellers";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <PageShell>
    
      <Hero />

      <Features />
            <ImageSlider3D duration={32} cardWidth="15em" />

      <LimitedOffers />
      <SeasonalBestsellers />
      <GiftGrid />
      <GiftingArt />
      <Testimonials />
    </PageShell>
  );
}
