import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { api, getConvex } from "@/lib/convexClient";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export const PARTNER_SECTORS = [
  "Accelerator or incubator",
  "University or training provider",
  "Employer or recruiter",
  "Hackathon or competition host",
  "Investor or funder",
  "NGO or community organisation",
  "Technology or media partner",
  "Other",
];

const EMPTY = { organisation: "", contactName: "", email: "", phone: "", sector: "", website: "", message: "", company_url: "" };
type Form = typeof EMPTY;
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.organisation.trim().length < 2) e.organisation = "Enter your organisation's name.";
  if (f.contactName.trim().length < 2) e.contactName = "Enter a contact name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.phone.trim() && !/^[+\d][\d\s()-]{5,}$/.test(f.phone.trim())) e.phone = "Enter a valid phone number, or leave it blank.";
  if (!f.sector) e.sector = "Choose the option that fits best.";
  if (f.website.trim()) {
    try {
      const u = new URL(/^https?:\/\//i.test(f.website.trim()) ? f.website.trim() : `https://${f.website.trim()}`);
      if (!u.hostname.includes(".")) throw new Error();
    } catch {
      e.website = "Enter a valid website address, or leave it blank.";
    }
  }
  if (f.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
  return e;
}

function serverMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : "";
  if (msg.includes("RATE_LIMITED")) return "You've sent several requests recently. Please try again in an hour, or email us.";
  if (msg.includes("INVALID_")) return "Some details didn't pass our checks. Please review the form and try again.";
  return "We couldn't send your request. Please try again, or email us directly.";
}

/** Accessible partnership request form. Writes to the Convex `partnerRequests` table. */
const PartnerRequestForm = () => {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setErrors((er) => ({ ...er, [k]: undefined }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = document.querySelector<HTMLElement>(`[data-pf="${first}"]`);
      (el?.matches("input,textarea,button") ? el : el?.querySelector<HTMLElement>("button"))?.focus();
      return;
    }
    setStatus("sending");
    const convexClient = await getConvex();
    if (!convexClient) {
      setServerError("Our request form is offline right now. Please email us instead.");
      setStatus("error");
      return;
    }
    setServerError("");
    try {
      await convexClient.mutation(api.partners.submitRequest, {
        organisation: form.organisation,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone || undefined,
        sector: form.sector,
        website: form.website || undefined,
        message: form.message,
        company_url: form.company_url || undefined,
      });
      setStatus("done");
      setForm(EMPTY);
    } catch (err) {
      setServerError(serverMessage(err));
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center" role="status">
        <CheckCircle className="w-14 h-14 text-foreground" strokeWidth={1.2} aria-hidden="true" />
        <h3 className="text-xl font-bold text-foreground">Request received</h3>
        <p className="text-muted-foreground max-w-sm">Thank you. We'll review your request and reply by email.</p>
      </div>
    );
  }

  const busy = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Partnership request">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <Field label="Organisation" required error={errors.organisation}>
          {(p) => <Input {...p} data-pf="organisation" autoComplete="organization" enterKeyHint="next" maxLength={120} value={form.organisation} onChange={set("organisation")} disabled={busy} />}
        </Field>
        <Field label="Contact person" required error={errors.contactName}>
          {(p) => <Input {...p} data-pf="contactName" autoComplete="name" enterKeyHint="next" maxLength={100} value={form.contactName} onChange={set("contactName")} disabled={busy} />}
        </Field>
        <Field label="Email" required error={errors.email}>
          {(p) => <Input {...p} data-pf="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" maxLength={254} value={form.email} onChange={set("email")} disabled={busy} />}
        </Field>
        <Field label="Phone" optional error={errors.phone}>
          {(p) => <Input {...p} data-pf="phone" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" maxLength={30} value={form.phone} onChange={set("phone")} disabled={busy} />}
        </Field>
        <Field label="Sector" required error={errors.sector}>
          {(p) => (
            <div data-pf="sector">
              <Select {...p} value={form.sector} onChange={(v) => { setForm((f) => ({ ...f, sector: v })); setErrors((er) => ({ ...er, sector: undefined })); }} options={PARTNER_SECTORS} placeholder="Choose one" disabled={busy} />
            </div>
          )}
        </Field>
        <Field label="Website" optional error={errors.website} helper="For example example.org">
          {(p) => <Input {...p} data-pf="website" inputMode="url" autoComplete="url" enterKeyHint="next" maxLength={200} value={form.website} onChange={set("website")} disabled={busy} />}
        </Field>
      </div>
      <Field label="How would you like to work together?" required error={errors.message} count={{ value: form.message.length, max: 1500 }}>
        {(p) => <Textarea {...p} data-pf="message" enterKeyHint="send" maxLength={1500} value={form.message} onChange={set("message")} disabled={busy} />}
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="pf-company_url">Leave this field empty</label>
        <input id="pf-company_url" tabIndex={-1} autoComplete="off" value={form.company_url} onChange={set("company_url")} />
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p className="flex items-start gap-2 text-sm font-medium text-[hsl(var(--destructive-ink))]" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {serverError}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        By sending this you agree to our <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</Link> and <Link to="/terms" className="underline underline-offset-4 hover:text-foreground">Terms of Use</Link>.
      </p>
      <button type="submit" className="neo-pill w-full flex items-center justify-center gap-2 disabled:opacity-70" disabled={busy}>
        {busy ? (<><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />Sending...</>) : "Send partnership request"}
      </button>
    </form>
  );
};

export default PartnerRequestForm;
