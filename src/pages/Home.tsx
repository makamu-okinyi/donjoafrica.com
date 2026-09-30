import { Link } from "react-router-dom";
import {
  Video, BarChart3, FileText, MapPin, Zap, Shield, ArrowRight, Scale, Timer, Globe2, Eye,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Trailer, { WatchTrailerButton } from "@/components/trailer/Trailer";
import type { HeroState } from "@/components/trailer/Player";
import PartnerWall from "@/components/PartnerWall";
import LegacyHashRedirect from "@/components/LegacyHashRedirect";
import { CtaBand, Eyebrow, SectionHeader, StatusBadge } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";
import { solutions } from "@/data/solutions";
import type { FeatureStatus } from "@/data/types";

const features: {
  to: string;
  icon: typeof Video;
  title: string;
  description: string;
  status?: FeatureStatus;
}[] = [
  { to: "/platform/video-proof", icon: Video, title: "Video Proof", description: "Short clips that show real skill instead of a CV." },
  { to: "/platform/skill-radar", icon: BarChart3, title: "Skill Radar", description: "Skill and industry tags, plotted for the whole cohort." },
  { to: "/platform/dossier-generation", icon: FileText, title: "Dossier Generation", description: "A printable PDF of applicants with video links." },
  { to: "/platform/venture-velocity", icon: Zap, title: "Venture Velocity", description: "Applications, outcomes and decision time at a glance.", status: "building" },
  { to: "/platform/venture-velocity", icon: MapPin, title: "Geospatial view", description: "See which Kenyan counties applicants come from.", status: "building" },
  { to: "/platform#security", icon: Shield, title: "Secure sign-in", description: "Passkeys and role-based access for applicant data.", status: "building" },
];

const steps = [
  { n: "01", title: "Show", body: "Applicants answer with a short proof clip." },
  { n: "02", title: "Review", body: "Watch, shortlist or reject from one queue." },
  { n: "03", title: "Decide", body: "Message, export a dossier, keep a record." },
];

const principles = [
  { icon: Eye, title: "Evidence first", body: "Show the work, in your own voice." },
  { icon: Scale, title: "Fair to all", body: "Skill outweighs school names." },
  { icon: Timer, title: "Fast to review", body: "One queue, clear statuses." },
  { icon: Globe2, title: "East Africa first", body: "Designed around Kenya." },
];


/**
 * Brand line for the hero. Landscape: a column on the left over a soft glow, beside the product window.
 * Portrait: stacked above the window. Always visible.
 */
function HeroHeadline() {
  return (
    <div className="pointer-events-none z-10 flex flex-none flex-col gap-3 px-6 pb-4 text-center text-white landscape:absolute landscape:bottom-16 landscape:left-0 landscape:top-[var(--hero-top)] landscape:w-[36%] landscape:justify-center landscape:gap-[2vw] landscape:px-0 landscape:pb-0 landscape:pl-[4.5vw] landscape:text-left">
      <h1 className="text-[clamp(2.1rem,11vw,3.6rem)] font-bold leading-[1.02] tracking-tighter landscape:text-[clamp(1.4rem,4.6vw,7.5rem)]">
        Proof Over <span className="text-[hsl(var(--brand))]">Promises.</span>
      </h1>
      <p className="mx-auto max-w-[30ch] text-[clamp(.95rem,4vw,1.2rem)] leading-snug text-white/85 landscape:mx-0 landscape:max-w-[26ch] landscape:text-[clamp(.75rem,1.6vw,2.2rem)]">
        Video-first hiring: applicants show real work, you decide on evidence.
      </p>
    </div>
  );
}

/** Docked call to action, in its own reserved band under the stage. Pulses once the dossier scene plays. */
function HeroCta({ st }: { st: HeroState }) {
  return (
    <Link
      to="/contact"
      className={"neo-pill whitespace-nowrap !px-5 !py-2.5 text-sm sm:!px-8 sm:!py-3 sm:text-base portrait:block portrait:w-[min(86%,22rem)] portrait:text-center portrait:!py-3.5 portrait:text-base " + (st.live && st.scene >= 2 ? "hero-cta-pulse" : "")}
    >
      Request Access
    </Link>
  );
}

const Home = () => {
  usePageMeta("/");
  return (
    <div>
      <LegacyHashRedirect />

      {/* Full-bleed hero: the trailer IS the hero. Edge to edge, 100svh, no frame. The headline is a plain
          element (not part of the lazy player) so it paints immediately and never re-mounts. */}
      <section aria-label="Product preview" className="relative flex h-[100svh] min-h-[20rem] w-full flex-col bg-[#12151b]">
        <div className="h-[var(--hero-top)] shrink-0" aria-hidden="true" />
        <HeroHeadline />
        <div className="relative min-h-0 flex-1">
          <Trailer
            id="home"
            hero
            eager
            dock={(st) => <HeroCta st={st} />}
            aside={<WatchTrailerButton id="platform" label="Watch the full walkthrough" tone="light" className="!py-1 text-xs sm:text-sm" />}
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 pt-20 sm:space-y-28 sm:px-6 sm:pt-28 lg:px-8">
      <PartnerWall id="home-partners" />

      <section id="how-it-works" className="scroll-mt-28 space-y-10" aria-labelledby="how-title">
        <SectionHeader align="center" eyebrow="How it works" title="Three steps, grounded in proof" id="how-title" />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st, i) => (
            <li key={st.n}>
              <Reveal delay={i * 0.1} className="neo-extruded p-6 sm:p-8 space-y-3 h-full">
                <span className="text-sm font-bold tabular-nums text-[hsl(var(--brand-ink))]">{st.n}</span>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{st.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{st.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" className="scroll-mt-28 space-y-10" aria-labelledby="features-title">
        <SectionHeader align="center" eyebrow="The platform" title="Everything the review room needs" id="features-title" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={f.title}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <Link
                    to={f.to}
                    className="group neo-extruded p-6 sm:p-8 h-full flex flex-col gap-4 hover:shadow-none transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="squircle-icon w-12 h-12">
                        <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <StatusBadge status={f.status} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      Learn more<span className="sr-only"> about {f.title}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="built-title">
        <SectionHeader align="center" eyebrow="Built for" title="Anyone who selects people on merit" id="built-title" />
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {solutions.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.slug}>
                <Reveal delay={i * 0.05} className="h-full">
                  <Link to={`/solutions/${s.slug}`} className="neo-extruded-sm h-full p-5 flex flex-col gap-3 hover:shadow-none transition-shadow group">
                    <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-bold text-foreground">{s.name}</span>
                    <ArrowRight className="h-4 w-4 mt-auto text-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.title}>
                <Reveal delay={i * 0.06} className="neo-pressed p-5 space-y-2 h-full">
                  <Icon className="w-5 h-5 text-[hsl(var(--brand-ink))]" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="font-bold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <Reveal>
        <section className="neo-extruded p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6" aria-labelledby="journey-teaser">
          <div className="space-y-2 text-center sm:text-left">
            <Eyebrow>Our journey</Eyebrow>
            <h2 id="journey-teaser" className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">From a question to a platform</h2>
          </div>
          <Link to="/about#journey-title" className="neo-pill inline-block whitespace-nowrap">Read our journey</Link>
        </section>
      </Reveal>

      <CtaBand
        title="Move from CV-centric to proof-centric hiring."
        body="Tell us what you're hiring for."
        secondary={{ label: "See pricing", to: "/pricing" }}
      />
      </div>
    </div>
  );
};

export default Home;
