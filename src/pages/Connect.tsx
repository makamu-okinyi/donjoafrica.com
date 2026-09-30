import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, Loader2, CheckCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Reveal from "@/components/Reveal";
import { Field, Input, Textarea } from "@/components/ui/field";
import { FaqList, PageHero, SectionHeader } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";

const nextSteps = [
  { title: "Tell us", body: "Share your name, email and what you need." },
  { title: "We read it", body: "It's saved and forwarded to the team." },
  { title: "We reply", body: "A walkthrough, a pilot idea or a straight answer." },
];

const reasons = [
  "Hiring for a startup or business",
  "Running a hackathon or accelerator",
  "Helping students show their work",
  "Exploring a partnership",
];

const faq = [
  { q: "How quickly will I hear back?", a: "We reply as soon as we can. For urgent questions, use WhatsApp." },
  { q: "Do I need to be ready to buy?", a: "No. Questions and rough ideas are welcome." },
  { q: "Where are you based?", a: "Kenya, working with teams across East Africa, including remotely." },
];

const Connect = () => {
  usePageMeta("/contact", { faq });
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", brief: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
      const response = await fetch(`${convexSiteUrl}/notify-consultation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Request failed");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", brief: "" });
      toast({ title: "Request sent", description: "We'll get back to you shortly." });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Submission error:", err);
      toast({ title: "Something went wrong", description: "Please try again or reach out directly via email.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-24">
      <PageHero
        eyebrow="Contact"
        title="Request access."
        intro="Tell us about your team. We'll show how Donjo fits."
      />

      <section className="neo-extruded p-6 sm:p-12 lg:p-16" aria-labelledby="contact-title">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 id="contact-title" className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Let's get you started.
              </h2>
            </div>

            <ul className="space-y-4">
              <li>
                <a href="mailto:makamubetsy@gmail.com" className="flex items-center gap-4 group">
                  <span className="squircle-icon w-12 h-12 transition-shadow duration-200 group-hover:shadow-none">
                    <Mail className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="text-foreground/80 group-hover:text-foreground group-hover:underline underline-offset-4 break-all">
                    makamubetsy@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/254113881734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <span className="squircle-icon w-12 h-12 transition-shadow duration-200 group-hover:shadow-none">
                    <MessageCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="text-foreground/80 group-hover:text-foreground group-hover:underline underline-offset-4">
                    WhatsApp: 0113881734
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="squircle-icon w-12 h-12">
                  <MapPin className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-foreground/80">Kenya, serving East Africa</span>
              </li>
            </ul>

            <div className="neo-pressed p-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">Good reasons to reach out</h3>
              <ul className="space-y-2">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-strong))] shrink-0" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Request access form">
            <div aria-live="polite">
              {isSubmitted && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center" role="status">
                  <CheckCircle className="w-16 h-16 text-foreground" strokeWidth={1.2} aria-hidden="true" />
                  <h3 className="text-xl font-bold text-foreground">Request received</h3>
                  <p className="text-muted-foreground">We'll review your request and get back to you soon.</p>
                </div>
              )}
            </div>
            {!isSubmitted && (
              <>
                <Field label="Full name" required>
                  {(p) => <Input {...p} name="name" autoComplete="name" enterKeyHint="next" maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} />}
                </Field>
                <Field label="Email" required>
                  {(p) => <Input {...p} name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={isSubmitting} placeholder="you@company.com" />}
                </Field>
                <Field label="Tell us about your hiring needs" required helper="Roles you're hiring for and roughly how many applicants." count={{ value: formData.brief.length, max: 1000 }}>
                  {(p) => <Textarea {...p} name="brief" rows={5} enterKeyHint="send" maxLength={1000} value={formData.brief} onChange={(e) => setFormData({ ...formData, brief: e.target.value })} disabled={isSubmitting} />}
                </Field>
                <button type="submit" className="neo-pill w-full text-center flex items-center justify-center gap-2 disabled:opacity-70" disabled={isSubmitting}>
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Sending...</>) : "Request Access"}
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  By sending this you agree to our <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</Link> and <Link to="/terms" className="underline underline-offset-4 hover:text-foreground">Terms of Use</Link>. We only use your details to reply.
                </p>
              </>
            )}
          </form>
        </div>
      </section>

      <section className="space-y-10" aria-labelledby="next-title">
        <SectionHeader align="center" eyebrow="What happens next" title="Three short steps" id="next-title" />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nextSteps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.08} className="neo-extruded p-6 sm:p-8 space-y-3 h-full">
                <span className="text-sm font-bold tabular-nums text-[hsl(var(--brand-ink))]">0{i + 1}</span>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-10" aria-labelledby="cfaq-title">
        <SectionHeader eyebrow="FAQ" title="Quick answers" id="cfaq-title" />
        <FaqList items={faq} />
      </section>
    </div>
  );
};

export default Connect;
