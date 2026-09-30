import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, UserCog, ClipboardCheck, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { CtaBand, Eyebrow, SectionHeader } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";

// TODO(owner): confirm the milestones and roles below are accurate and approved for public use.

const techStack = [
  "React", "TypeScript", "Convex", "Cloudflare Pages", "WebAuthn passkeys", "CSP / HSTS",
];

const securityHighlights = [
  { icon: ShieldCheck, title: "Hardened headers", description: "A strict Content-Security-Policy, HSTS and Permissions-Policy on both sites." },
  { icon: KeyRound, title: "Passkey sign-in", description: "WebAuthn passkeys, with passwords still available." },
  { icon: UserCog, title: "Role-based access", description: "Every account has one role, checked on the server on every request." },
  { icon: ClipboardCheck, title: "Audit log", description: "Admin sign-ins and privileged actions are recorded." },
];

const milestones = [
  { year: "2018", label: "Founded first SaaS startup" },
  { year: "2022", label: "Launched consultancy practice" },
  { year: "Now", label: "Building Donjo, the Venture Engine" },
];

const currentRoles = [
  { title: "CTO", org: "Startups Garage", description: "Tech strategy and product for portfolio startups." },
  { title: "Creator", org: "Donjo", description: "Architecting a video-first proof-of-work hiring platform." },
];

const Founder = () => {
  usePageMeta("/founder");
  return (
    <div className="space-y-20 sm:space-y-28">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16" aria-labelledby="founder-title">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <div className="squircle-icon w-32 h-32 sm:w-40 sm:h-40 text-6xl font-bold text-foreground mx-auto md:mx-0" aria-hidden="true">M</div>
          <div className="md:col-span-2 space-y-5 text-center md:text-left">
            <Eyebrow>The founder</Eyebrow>
            <h1 id="founder-title" className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight text-balance">
              Makamu Okinyi builds fairer hiring.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A product-minded technologist across early-stage ventures, financial modelling and security.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-10" aria-labelledby="roles-title">
        <SectionHeader align="center" eyebrow="Now" title="Current roles" id="roles-title" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {currentRoles.map((role, i) => (
            <li key={role.org}>
              <Reveal delay={i * 0.08} className="neo-extruded-sm p-6 sm:p-8 space-y-2 h-full">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{role.title}</span>
                <h3 className="text-xl font-bold text-foreground">{role.org}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="sec-title">
        <SectionHeader
          align="center"
          eyebrow="Security engineering"
          title="Defense-in-depth"
          intro="How applicant data is protected in Donjo today."
          id="sec-title"
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityHighlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Reveal delay={i * 0.06} className="neo-extruded-sm p-6 space-y-3 h-full">
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="journey-title">
        <SectionHeader align="center" eyebrow="Timeline" title="Journey" id="journey-title" />
        <ol className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <li key={m.year}>
              <Reveal delay={i * 0.06} className="neo-extruded-sm p-6 space-y-2 h-full">
                <span className="text-2xl font-bold text-foreground tabular-nums">{m.year}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.label}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6 text-center" aria-labelledby="stack-title">
        <SectionHeader align="center" eyebrow="Toolkit" title="Tech stack" id="stack-title" />
        <Reveal>
          <ul className="flex flex-wrap justify-center gap-3">
            {techStack.map((t) => (
              <li key={t} className="neo-extruded-sm !rounded-full px-5 py-2.5 text-sm font-semibold text-foreground/80">{t}</li>
            ))}
          </ul>
        </Reveal>
        <Link to="/expertise" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline underline-offset-4">
          Advisory and consulting <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <CtaBand title="Want to work together?" body="Tell us what you're building." secondary={{ label: "About Donjo", to: "/about" }} />
    </div>
  );
};

export default Founder;
