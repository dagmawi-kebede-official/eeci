"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "compliance",
    number: "01",
    title: "Compliance Scoring",
    description: "Assess your organization's cybersecurity compliance and resilience with a measurable security score.",
    icon: (
      <svg aria-label="Compliance Score" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z" />
        <path d="m8.5 12 2.3 2.3 4.7-5" />
      </svg>
    ),
  },
  {
    id: "incident",
    number: "02",
    title: "Incident Reporting",
    description: "Report and manage cybersecurity incidents through a structured and centralized reporting system.",
    icon: (
      <svg aria-label="Incident Reporting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M12 11v4" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    id: "security",
    number: "03",
    title: "Security Testing",
    description: "Comprehensive vulnerability assessments, penetration testing deep dives, and offensive red team engagements.",
    icon: (
      <svg aria-label="Security Testing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z" />
        <circle cx="12" cy="11" r="3" />
        <path d="M12 6v2M12 14v2M7 11h2M15 11h2" />
      </svg>
    ),
  },
];

export default function OurServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="our-platform"
      className="relative overflow-hidden px-6 text-white sm:py-40 mb-20"
    >
      {/* Background ambient mesh layout detail */}
      <div className="absolute top-0 left-1/4 -z-10 h-125 w-175 rounded-full bg-blue-500/5 blur-[160px]" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-125 w-175 rounded-full bg-indigo-500/5 blur-[160px]" />
      
      {/* Grid pattern overlay for uniqueness */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="mx-auto flex flex-col items-center">
        {/* Centered Header Layout Component Area */}
        <div className="mb-24 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-zinc-500">
            What we provide
          </p>
          <h2 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[0.9]">
            Our Services
          </h2>
        </div>

        {/* Dynamic Card Architecture Assembly */}
        <div className="grid w-7/8 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((service, index) => (
            <div
              key={service.id}
              onMouseMove={handleMouseMove}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
              className={`
                group relative overflow-hidden rounded-3xl
                border border-zinc-800/80 bg-linear-to-b from-zinc-900/40 to-zinc-950/60
                py-8 px-15 transition-all duration-700 ease-out
                hover:border-zinc-600 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)]
                hover:-translate-y-2
                [--mouse-x:0px] [--mouse-y:0px]
                ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-100 opacity-0"
                }
              `}
            >
              {/* Dynamic Interactive Spotlight Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 80%)`
                }}
              />

              {/* Animated border gradient on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)`
                }}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Card Metric Header */}
                <div className="mb-10 flex items-start justify-between">
                  <span className="text-7xl font-black tracking-tighter text-zinc-800/60 transition-all duration-500 group-hover:text-zinc-500/80 group-hover:scale-110 origin-left">
                    {service.number}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:border-zinc-500 group-hover:text-white group-hover:bg-zinc-800">
                    {service.icon}
                  </div>
                </div>

                <h3 className="mb-4 text-4xl font-bold tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-white">
                  {service.title}
                </h3>

                <p className="text-base leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300 grow">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button Section */}
        <div className={`mt-20 flex justify-center transition-all duration-1000 delay-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <a
            href="/register"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-30 py-5 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
          >
            <span className="relative z-10">Get Started</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            {/* Button shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/40 to-transparent" />
          </a>
        </div>
      </div>
    </section>
  );
}
