import { GraduationCap, Rocket, Building2, Handshake } from "lucide-react";
import Reveal from "@/components/Reveal";
import PartnerWall from "@/components/PartnerWall";
import PartnerRequestForm from "@/components/PartnerRequestForm";
import { PageHero, SectionHeader } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";

const partnerTypes = [
  { icon: Rocket, title: "Accelerators and hubs", body: "Run selection on proof, not pitch decks." },
  { icon: GraduationCap, title: "Universities and trainers", body: "Give students a video portfolio employers can watch." },
  { icon: Building2, title: "Employers and sponsors", body: "Find talent through proof clips and challenges." },
  { icon: Handshake, title: "Ecosystem organisations", body: "Open fairer routes into work across East Africa." },
];

const Partners = () => {
  usePageMeta("/partners");
  return (
    <div className="space-y-20 sm:space-y-28">
      <PageHero
        eyebrow="Partners"
        title="Build the proof economy with us."
        intro="We work with organisations that select, train or develop people."
      >
        <a href="#partner-form" className="neo-pill inline-block">Partner With Us</a>
      </PageHero>

      <PartnerWall />

      <section className="space-y-10" aria-labelledby="types-title">
        <SectionHeader align="center" eyebrow="Who we partner with" title="Four kinds of partner" id="types-title" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerTypes.map((t, i) => {
            const Icon = t.icon;
            return (
              <li key={t.title}>
                <Reveal delay={i * 0.06} className="neo-extruded-sm p-6 space-y-3 h-full">
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-lg font-bold text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="partner-form" className="scroll-mt-28 neo-extruded p-6 sm:p-12 lg:p-16" aria-labelledby="pform-title">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-2 space-y-4">
            <h2 id="pform-title" className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
              Partner with us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tell us who you are and how you'd like to work together. A person reads every request.
            </p>
          </div>
          <div className="lg:col-span-3 relative">
            <PartnerRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
