import { useRef } from "react";
import { Link } from "react-router-dom";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Briefcase, Rocket, ShieldCheck, Layers, Fingerprint } from "lucide-react";
import { SectionHeader } from "./PageBits";
import Reveal from "./Reveal";

// Every milestone below is taken from the commit history of the Donjo product and this site
// (video-proof-hire and donjoafrica.com). Nothing here is a projection or a customer claim.
const milestones = [
  {
    period: "Dec 2025",
    title: "The first Donjo build",
    story: "A video-first interface where people show work instead of describing it. The idea becomes something you can click.",
    icon: Sparkles,
  },
  {
    period: "Jan 2026",
    title: "Employers join in",
    story: "Job postings, video applications and an employer dashboard. Hiring teams get a place to watch proof.",
    icon: Briefcase,
  },
  {
    period: "Feb 2026",
    title: "Ventures and the review room",
    story: "A guided venture application, a separate admin review queue, and a Donjo-branded home on the web.",
    icon: Rocket,
  },
  {
    period: "Jun 2026",
    title: "Roles and trust",
    story: "Access hardened across talent, employer and admin roles. The product gets its production polish.",
    icon: ShieldCheck,
  },
  {
    period: "Aug 2026",
    title: "New foundations",
    story: "The platform moves to a new backend, with in-app notifications keeping everyone in the loop.",
    icon: Layers,
  },
  {
    period: "Now",
    title: "Passkeys, counties, decision time",
    story: "Passkey sign-in, a county-level applicant map and real time-to-decision are being built.",
    icon: Fingerprint,
    current: true,
  },
];

const Journey = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="space-y-14" aria-labelledby="journey-title">
      <SectionHeader
        align="center"
        eyebrow="Our journey"
        title="From a question to a platform"
        intro="What if a hiring decision started with a minute of proof? Here is how we've built toward it."
        id="journey-title"
      />

      <ol ref={ref} className="relative max-w-5xl mx-auto">
        {/* Track and scroll-drawn progress line */}
        <span className="absolute left-5 md:left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-foreground/10" aria-hidden="true" />
        <m.span
          className="absolute left-5 md:left-1/2 top-2 bottom-2 w-0.5 -translate-x-1/2 origin-top bg-[hsl(var(--brand-strong))]"
          style={reduce ? undefined : { scaleY }}
          aria-hidden="true"
        />

        {milestones.map((m, i) => {
          const Icon = m.icon;
          const right = i % 2 === 1;
          return (
            <li key={m.title} className="relative pb-12 last:pb-0 md:grid md:grid-cols-2 md:gap-20">
              <span
                className={`absolute left-5 md:left-1/2 top-6 z-10 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-[var(--neo-shadow-sm)] ${m.current ? "ring-2 ring-[hsl(var(--brand-strong))]" : ""}`}
                aria-hidden="true"
              >
                <Icon className={`h-4 w-4 ${m.current ? "text-[hsl(var(--brand-ink))]" : "text-foreground"}`} strokeWidth={1.75} />
              </span>
              <Reveal
                delay={0.04}
                className={`ml-14 md:ml-0 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
              >
                <article className="neo-extruded-sm !rounded-3xl p-6 sm:p-8 space-y-3">
                  <span className={`neo-pressed inline-block px-3 py-1 text-xs font-semibold tracking-wide ${m.current ? "text-[hsl(var(--brand-ink))]" : "text-muted-foreground"}`}>
                    {m.period}
                  </span>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">{m.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{m.story}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal>
        <div className="neo-extruded p-8 sm:p-12 text-center space-y-5 max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-[0.18em]">Where we're going</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-balance">
            Proof as the first step of every hire in East Africa.
          </h3>
          <p className="text-muted-foreground">Help us get there.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="neo-pill inline-block">Request Access</Link>
            <Link to="/partners#partner-form" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline py-3">
              Partner with us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Journey;
