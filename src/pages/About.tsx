import { Link } from "react-router-dom";
import { Scale, Eye, Users, ClipboardCheck, ArrowRight, Video, Briefcase, Trophy, FileText, ShieldCheck, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import Journey from "@/components/Journey";
import { CtaBand, PageHero, SectionHeader, StatusBadge } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { FeatureStatus } from "@/data/types";

const beliefs = [
  { icon: Eye, title: "Evidence first", body: "A minute of video shows what a paragraph only claims." },
  { icon: Scale, title: "Fair to everyone", body: "Skill counts more than school or employer names." },
  { icon: Users, title: "Humans decide", body: "Donjo organises proof. Reviewers make the call." },
  { icon: ClipboardCheck, title: "Honest roadmap", body: "We say what is live and what is still being built." },
];

const today: { icon: typeof Video; title: string; status?: FeatureStatus }[] = [
  { icon: Video, title: "Video proof and portfolios" },
  { icon: Briefcase, title: "Jobs with video applications" },
  { icon: Trophy, title: "Challenges and venture applications" },
  { icon: FileText, title: "PDF applicant dossiers" },
  { icon: ShieldCheck, title: "Passkey sign-in", status: "building" },
  { icon: MapPin, title: "County map and decision timing", status: "building" },
];

const About = () => {
  usePageMeta("/about");
  return (
    <div className="space-y-20 sm:space-y-28">
      <PageHero
        eyebrow="About Donjo"
        title="The engine for proof-based hiring."
        intro="Applicants show real work in a short video. Employers decide on evidence."
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="neo-pill inline-block">Request Access</Link>
          <Link to="/platform" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline py-3">
            Explore the platform <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </PageHero>

      <section className="space-y-10" aria-labelledby="beliefs-title">
        <SectionHeader align="center" eyebrow="What we believe" title="Four principles" id="beliefs-title" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beliefs.map((b, i) => {
            const Icon = b.icon;
            return (
              <li key={b.title}>
                <Reveal delay={i * 0.06} className="neo-extruded p-6 space-y-3 h-full">
                  <div className="squircle-icon w-12 h-12">
                    <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <Journey />

      <section className="space-y-10" aria-labelledby="today-title">
        <SectionHeader align="center" eyebrow="The product" title="What Donjo does today" id="today-title" />
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {today.map((t, i) => {
            const Icon = t.icon;
            return (
              <li key={t.title}>
                <Reveal delay={(i % 3) * 0.05} className="neo-extruded-sm p-5 h-full flex flex-col gap-3">
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-semibold text-foreground">{t.title}</span>
                  <div><StatusBadge status={t.status} /></div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <Reveal>
        <section className="neo-extruded p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10" aria-labelledby="lead-title">
          <div className="squircle-icon w-20 h-20 text-3xl font-bold text-foreground shrink-0" aria-hidden="true">M</div>
          <div className="space-y-2 text-center sm:text-left">
            <h2 id="lead-title" className="text-2xl font-bold text-foreground tracking-tight">Led by Makamu Okinyi</h2>
            <p className="text-muted-foreground">Founder and CEO. Product-minded technologist building fairer hiring.</p>
            <Link to="/founder" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline underline-offset-4">
              Meet the founder <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </Reveal>

      <CtaBand title="Help make proof the standard." body="Hire, partner or just ask a question." />
    </div>
  );
};

export default About;
