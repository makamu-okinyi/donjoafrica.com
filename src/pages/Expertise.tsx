import { Server, GitBranch, Rocket, Lightbulb, Search, PenTool, Hammer, RefreshCw } from "lucide-react";
import Reveal from "@/components/Reveal";
import { CtaBand, FaqList, PageHero, SectionHeader } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";

const services = [
  { icon: Server, title: "Tech strategy", description: "Architecture, stack choices and team structure that scale." },
  { icon: GitBranch, title: "Business models", description: "Pricing, go-to-market and financial models investors trust." },
  { icon: Rocket, title: "Product-market fit", description: "Validation, user research and growth playbooks." },
  { icon: Lightbulb, title: "Startup advisory", description: "Pitch, fundraising and fractional CTO help, pre-seed to Series A." },
];

const process = [
  { icon: Search, title: "Discover" },
  { icon: PenTool, title: "Plan" },
  { icon: Hammer, title: "Build with you" },
  { icon: RefreshCw, title: "Review" },
];

const faq = [
  { q: "Is this separate from the Donjo platform?", a: "Yes. Donjo is a product. Expertise is advisory work from its founder." },
  { q: "Who do you work with?", a: "Early-stage founders and small teams, from pre-seed to Series A." },
  { q: "How does it start?", a: "A short conversation about what you're building and what's blocking you." },
];

const Expertise = () => {
  usePageMeta("/expertise", { faq });
  return (
    <div className="space-y-20 sm:space-y-28">
      <PageHero
        eyebrow="Expertise"
        title="Startup advisory and tech strategy."
        intro="Practical, hands-on help at the intersection of technology and business."
      />

      <section className="space-y-10" aria-labelledby="services-title">
        <SectionHeader align="center" eyebrow="Services" title="Where we can help" id="services-title" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title}>
                <Reveal delay={(i % 2) * 0.08} className="neo-extruded p-6 sm:p-8 space-y-4 h-full">
                  <div className="squircle-icon w-14 h-14">
                    <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="process-title">
        <SectionHeader align="center" eyebrow="Process" title="How it works" id="process-title" />
        <ol className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {process.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.title}>
                <Reveal delay={i * 0.06} className="neo-extruded-sm p-5 flex items-center gap-3 h-full">
                  <span className="text-sm font-bold tabular-nums text-[hsl(var(--brand-ink))]">0{i + 1}</span>
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-semibold text-foreground">{p.title}</span>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-10" aria-labelledby="efaq-title">
        <SectionHeader eyebrow="FAQ" title="Quick answers" id="efaq-title" />
        <FaqList items={faq} />
      </section>

      <CtaBand title="Have something you're building?" body="A short conversation is usually enough." primary={{ label: "Start a Conversation", to: "/contact" }} />
    </div>
  );
};

export default Expertise;
