// TODO(renovation): Expertise.tsx is unlinked advisory copy; decide later whether to repurpose, merge into Founder, or remove.
import { Server, GitBranch, Rocket, Lightbulb } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const ServiceCard = ({ icon: Icon, title, description, delay }: ServiceCardProps) => (
  <div
    className="neo-extruded p-6 sm:p-10 space-y-6 animate-fade-in-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="squircle-icon w-16 h-16">
      <Icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-foreground">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const services = [
  {
    icon: Server,
    title: "Tech Strategy & Architecture",
    description:
      "From system design to stack selection, I help you build a technical foundation that scales. Covering cloud architecture, API design, and engineering team structure.",
  },
  {
    icon: GitBranch,
    title: "Business Model Innovation",
    description:
      "Mapping revenue streams, pricing strategies, and go-to-market plans that align with your technology. Financial modeling that investors understand.",
  },
  {
    icon: Rocket,
    title: "Product Market Fit & Scaling",
    description:
      "Data-driven product validation, user research frameworks, and growth playbooks. From MVP to scale — the right way, at the right time.",
  },
  {
    icon: Lightbulb,
    title: "Startup Advisory (Pre-Seed to Series A)",
    description:
      "Hands-on mentorship for early-stage founders. Pitch deck refinement, fundraising strategy, board preparation, and fractional CTO engagements.",
  },
];

const Expertise = () => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 animate-fade-in-up">
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          Core Competencies.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Deep expertise across the intersection of technology and business strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default Expertise;
