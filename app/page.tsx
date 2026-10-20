import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ArrowDownRight,
  ArrowRight,
  BrainCircuit,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SecurityStats from "./components/landingstat";
import Timeline from "./components/timeline";
import OurServices from "./components/ourservices";
import LineAura from "./components/line-aura";
import IntelligenceVisual from "./components/IntelligenceVisual";
import EthiopiaCyberMap from "./components/EthiopianCyberMap";
import ComingSoonAssistant from "./components/ComingSoonAssistant";
import { ScrollReveal } from "./components/ScrollReveal";

const partners = [
  { id: 1, name: "Organization 1", logo: "/vercel.svg", height: "h-7" },
  { id: 2, name: "Organization 2", logo: "/insa.svg", height: "h-15" },
  { id: 3, name: "Organization 3", logo: "/github.png", height: "h-12" },
  { id: 4, name: "Organization 4", logo: "/betterauth.svg", height: "h-8" },
  { id: 5, name: "Organization 5", logo: "/ethiocert.svg", height: "h-15" },
  { id: 6, name: "Organization 6", logo: "/neondb.svg", height: "h-9" },
  { id: 7, name: "Organization 7", logo: "/Supabase.png", height: "h-9" },
  { id: 8, name: "Organization 8", logo: "/ethiotelecom.svg", height: "h-14" },
  { id: 9, name: "Organization 9", logo: "/prisma.svg", height: "h-10" },
  { id: 10, name: "Organization 10", logo: "/telebirr.svg", height: "h-13" },
  { id: 11, name: "Organization 11", logo: "/nextjs.svg", height: "h-6" },
  { id: 12, name: "Organization 12", logo: "/tailwind.svg", height: "h-7" },
  { id: 13, name: "Organization 13", logo: "/daisyui.png", height: "h-16" },
];

const upcomingFeatures = [
  {
    number: "01",
    title: "AI Assistant",
    subtitle: "Intelligent security guidance",
    description:
      "An AI assistant designed to help organizations understand security findings, explore compliance requirements, and discover practical remediation.",
    detail: "Authenticated AI service",
    icon: BrainCircuit,
  },
  {
    number: "02",
    title: "Localization",
    subtitle: "Security in your language",
    description:
      "A multilingual experience with reviewed translations, helping Ethiopian organizations navigate security assessments in their preferred language.",
    detail: "Amharic · Afaan Oromo · More",
    icon: Languages,
  },
  {
    number: "03",
    title: "Accessibility",
    subtitle: "Designed for everyone",
    description:
      "Improved accessibility through screen-reader support, keyboard navigation, and read-aloud controls for a more inclusive security platform.",
    detail: "Inclusive digital experience",
    icon: Accessibility,
  },
];

const projectTeam = [
  {
    number: "01",
    name: "DAGMAWI KEBEDE YESUF",
    id: "CTC-5419-26",
    specialization: "Cybersecurity Engineer",
    position: "Project Manager",
  },
  {
    number: "02",
    name: "REYAN AHMED USO",
    id: "CTC-2569-26",
    specialization: "Firmware Security Engineer",
    position: null,
  },
  {
    number: "03",
    name: "BINIYAM BIRHANU HADGU",
    id: "CTC-5561-26",
    specialization: "Cybersecurity Analyst",
    position: null,
  },
];

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center overflow-x-clip">
      {/* Hero Section */}
      <section className="hero relative min-h-[60vh] w-full overflow-hidden">
        <div className="hero-content text-center">
          <div className="flex max-w-4xl flex-col items-center justify-center">
            <Image
              className="logo -mt-15 -mb-28 h-auto w-100"
              src="/eeci-logo-white.svg"
              alt="EECI logo"
              width={100}
              height={20}
              priority
            />

            <h1 className="bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-5xl leading-[0.9] font-black tracking-tighter text-transparent sm:text-7xl md:text-8xl">
              Ethiopian Enterprise Cyber Intelligence
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              <strong className="text-white">Assess,</strong>{" "}
              <strong className="text-white">Manage,</strong> and{" "}
              <strong className="text-white">
                Continuously Improve
              </strong>{" "}
              your Organization&apos;s Security. With Integrated{" "}
              <span className="font-bold text-white">AI Features</span>.
            </p>

            <div className="mt-7">
              <Link
                href="/register"
                className="group z- relative flex h-12 items-center justify-center gap-3 overflow-hidden bg-white px-6 text-xs font-semibold text-black transition-colors hover:bg-zinc-200 sm:text-sm"
              >
                <span className="relative z-10">
                  PROTECT YOUR COMPANY
                </span>

                <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />

                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-zinc-300/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <IntelligenceVisual />

      {/* Partner / Technology Logo Marquee */}
      <section
        className="w-full -mt-40 max-w-full overflow-hidden border-b border-zinc-800 py-5"
        aria-label="Technology and organization logos"
      >
        <div className="relative w-full max-w-full overflow-hidden">
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-linear-to-r from-black to-transparent sm:w-32" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-linear-to-l from-black to-transparent sm:w-32" />

          <div className="flex w-max min-w-full animate-marquee gap-20 hover:[animation-play-state:paused] sm:gap-32">
            <div className="flex shrink-0 items-center gap-20 px-5 sm:gap-40 sm:px-8">
              {partners.map((partner) => (
                <img
                  key={partner.id}
                  src={partner.logo}
                  alt={partner.name}
                  className={`${partner.height} w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0`}
                />
              ))}
            </div>

            <div
              className="flex shrink-0 items-center gap-20 px-5 sm:gap-40 sm:px-8"
              aria-hidden="true"
            >
              {partners.map((partner) => (
                <img
                  key={`duplicate-${partner.id}`}
                  src={partner.logo}
                  alt=""
                  className={`${partner.height} w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ethiopia Cyber Map */}
      <EthiopiaCyberMap />

      {/* Existing Timeline, Statistics and Services */}
      <div className="relative w-full">
        {/* Timeline */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
            <LineAura />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <Timeline />
          </div>
        </div>

        {/* Security Statistics */}
        <div className="relative -my-50 w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
            <div className="h-full w-full rotate-180 opacity-80">
              <LineAura />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <SecurityStats />
          </div>
        </div>

        {/* Our Services */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
            <LineAura />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <OurServices />
          </div>
        </div>
      </div>

     
      {/* Upcoming Features */}
      <section
        id="upcoming-features"
        className="relative w-full overflow-hidden pb-50 pt-5"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
          <LineAura />
        </div>

        <div
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-175 -translate-x-1/2 rounded-full blur-[120px]"
          aria-hidden="true"
        />

        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <ScrollReveal className="mb-12 md:mb-16">
            <div className="mb-10 flex flex-col items-center text-center">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-zinc-500">
                The Next Chapter
              </p>

              <h2 className="bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-5xl leading-[0.9] font-black tracking-tighter text-transparent sm:text-7xl md:text-8xl">
                Security is evolving.
              </h2>

              <h2 className="bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-5xl leading-[0.9] font-black tracking-tighter text-transparent sm:text-7xl md:text-8xl">
                So are we.
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
                We&apos;re building new ways to make cybersecurity more
                intelligent, more accessible, and easier to use for
                organizations across Ethiopia.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className="mb-10">
            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/4 px-4 py-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4" />
              Planned capabilities
            </div>
          </ScrollReveal>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <ScrollReveal
                  key={feature.number}
                  delay={index * 140}
                >
                  <article className="group relative flex min-h-82.5 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/70 sm:p-8">
                    <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/2.5 blur-2xl transition-colors group-hover:bg-white/6" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white">
                        <Icon className="h-6 w-6" strokeWidth={1.7} />
                      </div>

                      <span className="font-mono text-sm tracking-widest text-zinc-600">
                        {feature.number}
                      </span>
                    </div>

                    <div className="relative mt-8">
                      <h3 className="text-2xl font-semibold tracking-tight text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-zinc-300">
                        {feature.subtitle}
                      </p>

                      <p className="mt-5 text-sm leading-7 text-zinc-400">
                        {feature.description}
                      </p>
                    </div>

                    <div className="relative mt-7 flex items-center gap-2 border-t border-white/8 pt-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="text-xs tracking-wide text-zinc-500">
                        {feature.detail}
                      </span>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={150} className="mt-15">
            <p className="text-xs leading-6 text-zinc-400">
              These features are planned for future releases and are not yet
              available.
            </p>
          </ScrollReveal>
        </div>
      </section>


      
      {/* Project Team */}
      <section
        id="project-team"
        className="mb-40 relative w-full overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div
          className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-white/2.5 blur-[120px]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* Project Introduction */}
            <div className="flex flex-col justify-between">
              <ScrollReveal>
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-white" />
                    <span className="text-xs font-bold tracking-[0.25em] text-zinc-300 uppercase">
                      Behind the Platform
                    </span>
                  </div>

                  <h2 className="text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
                    Built by students.
                    <br />
                    <span className="text-zinc-500">
                      Driven by purpose.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
                    EECI brings together cybersecurity professionals and a shared
                    commitment to strengthening the digital security of
                    Ethiopian organizations.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150} className="mt-10 lg:mt-16">
                <div className="border-l border-white/30 py-2 pl-5">
                  <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                    The project team
                  </p>

                  <p className="mt-2 text-5xl font-light tracking-tighter text-white sm:text-6xl">
                    03
                    <span className="ml-3 text-base tracking-normal text-zinc-500">
                      contributors
                    </span>
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Team Members */}
            <div className="border-t border-white/15">
              {projectTeam.map((member, index) => (
                <ScrollReveal
                  key={member.id}
                  delay={index * 120}
                >
                  <article className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-white/10 py-7 transition-colors hover:border-white/25 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6 sm:py-8">
                    <div className="pt-1 font-mono text-xs tracking-widest text-zinc-600 transition-colors group-hover:text-zinc-300">
                      {member.number}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="wrap-break-word text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-zinc-200 sm:text-xl">
                            {member.name}
                          </h3>

                          <p className="mt-2 font-mono text-xs tracking-wide text-zinc-400">
                            CTC ID : {member.id}
                          </p>
                        </div>

                        {member.position && (
                          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/4 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-zinc-200">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {member.position}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="text-[10px] font-bold tracking-[0.18em] text-zinc-600 uppercase">
                          Specialization
                        </span>

                        <span className="text-sm text-zinc-300">
                          {member.specialization}
                        </span>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}

              <ScrollReveal delay={150}>
                <div className="flex items-center justify-between gap-4 pt-6">
                  <p className="text-xs leading-5 text-zinc-600">
                    Ethiopian Enterprise Cyber Intelligence
                  </p>

                  <a
                    href="#"
                    className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                  >
                    Explore EECI
                    <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <ComingSoonAssistant />
    </div>
  );
}
