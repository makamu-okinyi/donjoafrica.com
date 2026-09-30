import { Play, CheckCircle2, Clock } from "lucide-react";

const skills = ["Frontend", "Product design", "Communication"];
const industries = ["Fintech", "Education"];

/** Static, illustrative mock of a Donjo review screen. Contains no real data or metrics. */
const ProductPreview = () => (
  <figure className="max-w-4xl mx-auto text-left">
    <div className="neo-extruded p-4 sm:p-6" aria-hidden="true">
      <div className="flex items-center justify-between px-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <span className="text-xs font-medium text-muted-foreground tracking-wide">Review queue</span>
        <span className="w-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
        <div className="md:col-span-3 neo-pressed p-3">
          <div className="relative aspect-video rounded-2xl bg-foreground overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-[hsl(var(--brand-strong))]/50" />
            <div className="relative h-16 w-16 rounded-full bg-background/95 flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-foreground ml-1" fill="currentColor" />
            </div>
            <span className="absolute bottom-3 left-3 text-xs font-medium text-background/90">Project walkthrough</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-3 px-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--brand-ink))]" /> Proof clip
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" /> Pending review
            </span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-5 py-1">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="neo-pressed px-3 py-1.5 text-xs font-medium text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Industry</p>
            <div className="flex flex-wrap gap-2">
              {industries.map((s) => (
                <span key={s} className="neo-pressed px-3 py-1.5 text-xs font-medium text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <span className="flex-1 text-center rounded-full bg-[hsl(var(--brand-strong))] px-4 py-2.5 text-xs font-semibold text-[hsl(var(--brand-foreground))]">
              Shortlist
            </span>
            <span className="flex-1 text-center neo-extruded-sm !rounded-full px-4 py-2.5 text-xs font-semibold text-foreground">
              Reject
            </span>
          </div>
        </div>
      </div>
    </div>
    <figcaption className="mt-4 text-center text-xs text-muted-foreground">
      Illustrative screen. Names and content are placeholders, not real applicant data.
    </figcaption>
  </figure>
);

export default ProductPreview;
