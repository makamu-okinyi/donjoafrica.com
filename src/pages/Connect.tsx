import { useState } from "react";
import { Mail, MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Connect = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", brief: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("notify-consultation", { body: formData });
      if (error) throw error;
      setIsSubmitted(true);
      setFormData({ name: "", email: "", brief: "" });
      toast({ title: "Request sent! ✅", description: "We'll get back to you shortly." });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      console.error("Submission error:", err);
      toast({ title: "Something went wrong", description: "Please try again or reach out directly via email.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 animate-fade-in-up">
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          Request Access
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how Donjo's Venture Engine can transform your hiring pipeline.
        </p>
      </div>

      <div className="neo-extruded p-6 sm:p-12 lg:p-16 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Contact info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Let's Get You Started.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a solo founder or running a 150-person cohort, we'll show you how Donjo fits your workflow.
              </p>
            </div>

            <div className="space-y-4">
              <a href="mailto:hello@donjo.dev" className="flex items-center gap-4 group">
                <div className="squircle-icon w-12 h-12 transition-shadow duration-200 group-hover:shadow-none">
                  <Mail className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  hello@donjo.dev
                </span>
              </a>

              <a href="https://wa.me/254113881734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="squircle-icon w-12 h-12 transition-shadow duration-200 group-hover:shadow-none">
                  <MessageCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  WhatsApp: 0113881734
                </span>
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <CheckCircle className="w-16 h-16 text-foreground" strokeWidth={1.2} />
                <h3 className="text-xl font-bold text-foreground">Request Received!</h3>
                <p className="text-muted-foreground">We'll review your request and get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="w-full px-5 py-4 neo-inset text-foreground placeholder:text-muted-foreground/60 outline-none text-sm bg-transparent" disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" className="w-full px-5 py-4 neo-inset text-foreground placeholder:text-muted-foreground/60 outline-none text-sm bg-transparent" disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tell us about your hiring needs</label>
                  <textarea required maxLength={1000} rows={5} value={formData.brief} onChange={(e) => setFormData({ ...formData, brief: e.target.value })} placeholder="What roles are you hiring for? How large is your applicant pool?" className="w-full px-5 py-4 neo-inset text-foreground placeholder:text-muted-foreground/60 outline-none text-sm bg-transparent resize-none" disabled={isSubmitting} />
                </div>
                <button type="submit" className="neo-pill w-full text-center flex items-center justify-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Sending...</>) : "Request Access"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Connect;
