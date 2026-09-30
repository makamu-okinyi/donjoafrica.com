import { Link } from "react-router-dom";
import {
  Video, BarChart3, FileText, MapPin, Zap, Shield, ArrowRight, Scale, Timer, Globe2, Eye,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Trailer from "@/components/trailer/Trailer";
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

const Home = () => {
  usePageMeta("/");
  return (
    <div className="space-y-20 sm:space-y-28">
      <LegacyHashRedirect />

      <section className="neo-extruded p-6 sm:p-12 lg:p-16 space-y-12" aria-labelledby="home-title">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <Eyebrow>Video-first hiring</Eyebrow>
          <h1 id="home-title" className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tighter">
            Proof Over <span className="text-[hsl(var(--brand-strong))]">Promises.</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto text-balance">
            Donjo is a video hiring platform: applicants show real work, you decide on evidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="neo-pill inline-block">Request Access</Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline underline-offset-4 py-3">
              See how it works <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-4xl">
          <Trailer id="home" compact eager />
        </div>
      </section>

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
  );
};

export default Home;
