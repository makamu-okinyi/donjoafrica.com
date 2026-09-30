import { Link } from "react-router-dom";
import { ArrowRight, Video, ClipboardCheck, MessageSquare, FileText } from "lucide-react";
import Reveal from "@/components/Reveal";
import LegacyHashRedirect from "@/components/LegacyHashRedirect";
import { CtaBand, PageHero, SectionHeader } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";
import { solutions } from "@/data/solutions";

const foundation = [
  { icon: Video, title: "Proof clips", body: "Every context starts with video." },
  { icon: ClipboardCheck, title: "One review flow", body: "Clear statuses in a single queue." },
  { icon: MessageSquare, title: "Direct follow-up", body: "Message people in-app." },
  { icon: FileText, title: "Shareable summaries", body: "PDF dossiers for panels." },
];

const Solutions = () => {
  usePageMeta("/solutions");
  return (
    <div className="space-y-20 sm:space-y-28">
      <LegacyHashRedirect />

      <PageHero
        eyebrow="Solutions"
        title="Proof-based hiring for every team."
        intro="Pick the context closest to yours."
      />

      <section className="space-y-10" aria-labelledby="sol-list">
        <SectionHeader align="center" eyebrow="Five contexts" title="Choose yours" id="sol-list" />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.slug} className={i === solutions.length - 1 && solutions.length % 2 === 1 ? "md:col-span-2" : ""}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <Link
                    to={`/solutions/${s.slug}`}
                    className="group neo-extruded h-full p-6 sm:p-10 flex flex-col gap-5 hover:shadow-none transition-shadow"
                  >
                    <div className="squircle-icon w-14 h-14">
                      <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{s.name}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{s.summary}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      Explore {s.name}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="sol-foundation">
        <SectionHeader
          align="center"
          eyebrow="Shared foundation"
          title="Different contexts, one platform"
          id="sol-foundation"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundation.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.06} className="neo-extruded-sm p-6 space-y-3">
                <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Don't see your use case?"
        body="If you select people on evidence, we can shape Donjo to fit."
        secondary={{ label: "Explore the platform", to: "/platform" }}
      />
    </div>
  );
};

export default Solutions;
