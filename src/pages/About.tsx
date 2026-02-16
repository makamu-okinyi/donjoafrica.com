const milestones = [
  { year: "2018", label: "Donjo concept incubated" },
  { year: "2020", label: "Video portfolio MVP launched" },
  { year: "2022", label: "Venture Engine dashboard shipped" },
  { year: "2024", label: "150+ applicant dossiers generated" },
];

const team = [
  { name: "Allan Mbuthia Nganga", role: "Founder & CTO", bio: "Product-minded technologist with deep experience in early-stage ventures, financial modeling, and scaling teams from zero to one." },
];

const About = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Who We Are</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
          The Venture Engine for proof-based hiring.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Donjo is a video-first proof-of-work platform that replaces static CVs with real demonstrations of skill. Founders watch 60-second proof clips, generate applicant dossiers, and make data-driven decisions — all from one dashboard.
        </p>
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

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Leadership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {team.map((person) => (
            <div key={person.name} className="neo-extruded p-6 sm:p-8 space-y-3">
              <div className="squircle-icon w-16 h-16 text-2xl font-bold text-foreground">
                {person.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-foreground">{person.name}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{person.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{person.bio}</p>
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
