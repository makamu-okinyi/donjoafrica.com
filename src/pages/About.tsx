import startupsGarage from "@/assets/startups-garage.jpeg";

const milestones = [
  { year: "2018", label: "Donjo concept incubated" },
  { year: "2020", label: "Video portfolio MVP launched" },
  { year: "2022", label: "Venture Engine dashboard shipped" },
  { year: "2024", label: "150+ applicant dossiers generated" },
];

const About = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">About Donjo</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              The Venture Engine for proof-based hiring.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Donjo is a video-first proof-of-work platform that replaces static CVs with real demonstrations of skill. Founders watch 60-second proof clips, generate applicant dossiers, and make data-driven decisions — all from one dashboard.
            </p>
          </div>
          <div className="neo-extruded p-4 overflow-hidden">
            <img
              src={startupsGarage}
              alt="Donjo team at Startups Garage"
              loading="lazy"
              className="w-full rounded-[calc(var(--radius)-0.5rem)] object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Our Journey</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div key={m.year} className="neo-extruded-sm p-6 space-y-2">
              <span className="text-2xl font-bold text-foreground">{m.year}</span>
              <p className="text-sm text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="neo-extruded p-6 sm:p-12 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          To shift the hiring paradigm from credentials to competence. Every founder deserves to see real proof before making a hire. Every applicant deserves a platform where skills speak louder than school names.
        </p>
      </section>
    </div>
  );
};

export default About;
