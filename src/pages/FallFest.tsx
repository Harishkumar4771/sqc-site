"use client";

import { useEffect, useState, useCallback } from "react";
import FadeInOnScroll from "../components/sections/FadeInOnScroll";
import SectionHeading from "../components/ui/section-heading";
import SubSectionHeading from "../components/ui/sectionSubHeading";
import {Button} from "../components/ui/button";
import {Card, CardContent} from "../components/ui/card";
import EHeading from "../components/ui/event-section-heading"


// Focus and CTA styles
const ring =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#40c0cb] focus-visible:ring-offset-[#0f0c29]";
const ctaPrimary = `bg-[#40c0cb] text-[#0f0c29] hover:bg-[#3ab1bb] font-bold shadow-lg ${ring}`;
const ctaSecondary = `border-[#40c0cb] text-white hover:bg-[#40c0cb]/15 ${ring}`;
const linkAccent = "text-[#40c0cb] underline hover:text-[#58d4d7]";

// Common anchor offset for fixed global header (if present)
const anchorOffsetStyle = {
    scrollMarginTop: "calc(var(--global-nav-h, 0px) + 16px)",
} as React.CSSProperties;

// Shared logo sizing tokens for consistency
const logoH = "h-10 sm:h-12"; // hero primary logos
const partnerH = "h-14 sm:h-16 md:h-18"; // equal heights in partner strip



function HomeHero() {
    // Fallback handler for Qiskit (if SVG fails)
    const onQiskitError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const t = e.currentTarget;
        if (!t.dataset.fallback) {
            t.src = "/assets/fallfest/Qiskit_03.png";
            t.dataset.fallback = "true";
        }
    };
    // Fallback handler for Symbiosis (mono)
    const onSymbiosisError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const t = e.currentTarget;

    };

    return (
        <section
            id="home"
            aria-labelledby="hero-title"
            style={anchorOffsetStyle}
            className="relative flex flex-col items-center text-center px-6">
            {/* Fit hero within one screen below any global header */}
            <div
                className="w-full max-w-6xl mx-auto pt-8 md:pt-10"
                style={{minHeight: "calc(100vh - var(--global-nav-h, 0px))"}}
            >
                {/* Only these three logos: IBM Quantum | Qiskit | Symbiosis (mono) */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <img
                        src="/assets/fallfest/IBM Quantum Logo.png"
                        alt="IBM Quantum"
                        className={`${logoH} w-auto object-contain block`}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />

                    <img
                        style={{ width: "8%", height: "8%" }}
                        src="/assets/fallfest/Badge.png"
                        alt="Fall Fest Badge"
                        className={`${logoH} w-auto object-contain block`}
                        onError={onQiskitError}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />


                </div>

                <h1 id="hero-title" className="sr-only">Qiskit Fall Fest 2025 @ Symbiosis Institute of Technology, Pune</h1>
                <SectionHeading title="Qiskit Fall Fest 2025 @ Symbiosis Institute of Technology, Pune"/>

                {/* Illustration constrained for single-screen composition */}
                <div className="py-4 max-w-5xl w-full mx-auto">
                    <img
                        src="/assets/fallfest/Full_Illustration.png"
                        alt="Quantum 100 Years Banner"
                        className="w-full max-h-[38vh] sm:max-h-[42vh] rounded-xl shadow-lg object-contain mx-auto block"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                {/* Quick facts as chips */}
                <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.9 mb-10">
                    {[
                        "Fundamentals of Quantum Mechanics",
                        "Assessment for Certification",
                        "Open to Everyone",
                    ].map((item, i) => (
                        <li
                            key={i}
                            className="text-sm sm:text-base text-[#40c0cb] bg-[#4035AB] border-3 border-[#185270] rounded-full px-4 py-1"
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                <p className="mb-6 max-w-3xl text-gray-200 mx-auto text-base sm:text-lg">
                    Build a solid conceptual foundation and practice circuits with Qiskit in guided labs. Validate
                    learning with a short assessment for a course certificate.
                </p>


            </div>

        </section>
    );
}

function EventSection() {
    return (
        <section
            id="event"
            aria-labelledby="event-title"
            style={anchorOffsetStyle}
            className="relative flex flex-col px-6 py-12">
            <EHeading title="Event"/>
            <SubSectionHeading title="Fundamentals of Quantum Mechanics"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="space-y-4 text-gray-200">
                        <ul className="list-disc pl-5 space-y-2 text-base sm:text-lg">
                            <li>Three focused days combining live instruction with hands-on labs to build intuition
                                quickly.
                            </li>
                            <li>Guided practice with Qiskit: states, gates, circuits, and simple algorithms.</li>
                            <li>Short assessment at the end; successful completion makes participants eligible for a course
                                certificate.
                            </li>
                            <li>November 2025 · Open to all backgrounds and experience levels.</li>
                        </ul>

                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-white font-semibold mb-3">What to expect</h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-2">
                        <li>Clear explanations of states, operators, and measurement with minimal math overhead.</li>
                        <li>Build and run small circuits in Qiskit to see concepts in action.</li>
                        <li>Concise assessment to check understanding and qualify for certification.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

function ScheduleSection() {
    return (
        <section
            id="schedule"
            aria-labelledby="schedule-title"
            style={anchorOffsetStyle}
            className="relative flex flex-col items-center text-center px-6 py-12">
            <SectionHeading title="Schedule"/>
            <div className="overflow-x-auto">
                <img
                    src="/assets/fallfest/Timeline_01.png"
                    alt="Event Timeline"
                    className="max-w-full max-h-[280px] rounded-lg shadow-md mx-auto object-contain block"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <Card className="bg-gray-900/90 border-l-4 border-[#40c0cb]">
                    <CardContent>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#40c0cb] mb-2">Day 1: Foundations</h3>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            <li>State vectors, measurements, single-qubit gates.</li>
                            <li>Live demos in Qiskit to cement concepts.</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/90 border-l-4 border-[#8b5cf6]">
                    <CardContent>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#8b5cf6] mb-2">Day 2: Circuits</h3>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            <li>Multi-qubit systems, entanglement.</li>
                            <li>Compose and run simple circuits.</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/90 border-l-4 border-[#fbbf24]">
                    <CardContent>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#fbbf24] mb-2">Day 3: Algorithms</h3>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            <li>Intro to basic algorithms.</li>
                            <li>Guided practice + assessment briefing.</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/90 border-l-4 border-[#ff4e50]">
                    <CardContent>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#ff4e50] mb-2">Assessment</h3>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            <li>Submission checklist and timeline.</li>
                            <li>Certification eligibility criteria.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function SpeakersSection() {
    const speakers = [
  {
    name: "Qiskit 101: Fundamentals of Quantum Mechanics",
    role: "IBM Quantum (Speaker TBA)",
    img: "/assets/fallfest/Cat_01.png",
    bio: "An introduction to the core principles of quantum mechanics and their applications in quantum computing."
  },
  {
    name: "Getting Started with Qiskit",
    role: "Student-Led Workshop",
    img: "/assets/fallfest/Circuit.png",
    bio: "A beginner-friendly session on setting up Qiskit and exploring the basics of quantum programming."
  },
  {
    name: "Hands-On Quantum Circuit Prototyping",
    role: "Student-Led Workshop",
    img: "/assets/fallfest/Cat_02.png",
    bio: "An interactive workshop where participants design and prototype their own quantum circuits using Qiskit."
  }
];


    return (
        <section
            id="speakers"
            aria-labelledby="speakers-title"
            style={anchorOffsetStyle}
            className="relative flex flex-col items-center text-center px-6 py-12">
            <SectionHeading title="Speakers & Mentors"/>
            <div className="grid sm:grid-cols-3 gap-8">
                {speakers.map(({name, role, img, bio}, i) => (
                    <Card
                        key={i}
                        className="bg-gray-900/80 p-6 flex flex-col items-center text-center rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={img}
                            alt={name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#40c0cb] mb-3 sm:mb-4 object-cover block"
                            loading="lazy"
                            decoding="async"
                        />
                        <h3 className="text-white font-bold text-lg sm:text-xl">{name}</h3>
                        <span className="text-[#8b5cf6] font-semibold">{role}</span>
                        <p className="text-gray-300 mt-3">{bio}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}



function ResourcesSection() {

    return (
        <section
            id="resources"
            aria-labelledby="resources-title"
            style={anchorOffsetStyle}
            className="relative flex flex-col items-center text-center px-6 py-12">
            <SectionHeading title="Resources"/>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">
                Notebooks, slides, and recordings will be published after each session in the official repository.
            </p>
            <Button asChild variant="outline" size="lg" className={ctaSecondary}>
                <a href="https://github.com/Symbiosis-Quantum-Club" target="_blank" rel="noopener noreferrer" aria-label="View GitHub Page">
                    View GitHub Page
                </a>
            </Button>
        </section>
    );
}

function ColabSection() {
    // Equal-height, object-contain logos to prevent mismatched sizes
    const logos = [
        {src: "/assets/fallfest/IBM Quantum Logo.png", alt: "IBM Quantum"},
        {src: "/assets/fallfest/Qiskit_03.png", alt: "Qiskit Purple"}
    ];

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (!img.dataset.fallback) {
            // Use a known fallback image
            img.src = "/assets/fallfest/Badge.png";
            img.dataset.fallback = "true";
            img.alt = "Fallback logo";
        }
    };

    return (
        <section
            id="team"
            aria-labelledby="team-title"
            style={anchorOffsetStyle}
            className="relative flex flex-col items-center text-center px-6 py-12">
            <SectionHeading title="Collaborators"/>
            <div className="flex flex-wrap items-center justify-center gap-8">
                {logos.map(({src, alt}, i) => (
                    <div key={i} className="flex items-center justify-center">
                        <img
                            src={src}
                            alt={alt}
                            onError={handleImageError}
                            className={`${partnerH} w-auto object-contain block`}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ))}
            </div>
            <p className="text-gray-400 mt-6">
                For media or partnership inquiries, details are provided in registration confirmation emails.
            </p>
        </section>
    );
}

function OrganizersSection() {
    const organizers = [
        {name: "Dr. Archana Chaudhari", role: "Faculty in-Charge", img: "/assets/Team/Archana ma'am.png", email: "archana.chaudhari@sitpune.edu.in"},
        {name: "Samarth Bhadane", role: "Club Head", img: "/assets/Team/Samarth.png", email: "samarth.bhadane.btech2023@sitpune.edu.in"},
        {name: "Anirudh Raman", role: "Research Head", img: "/assets/Team/Anirudh.png", email: "ganapathy.anirudh.btech2023@sitpune.edu.in"},
        {name: "Eric Siquiera", role: "Technical Head", img: "/assets/Team/Eric.png", email: "eric.siqueira.btech2023@sitpune.edu.in"},
        {name: "Disha Gupta", role: "Technical Head", img: "/assets/Team/Disha.png", email: "disha.gupta.btech2023@sitpune.edu.in"},
    ];

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    let hideTimer: ReturnType<typeof setTimeout> | null = null;


    const showTooltip = (i: number) => {
    if (hideTimer) clearTimeout(hideTimer);
        setHoveredIndex(i);
  };

  const hideTooltip = (i: number | null) => {
    hideTimer = setTimeout(() => {
      setHoveredIndex((curr) => (curr === i ? null : curr));
    }, 500); // tooltip stays for 500ms after leaving
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
      setCopied(email);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section
      id="organs"
      aria-labelledby="organizers-title"
      style={anchorOffsetStyle}
      className="relative flex flex-col items-center text-center px-6 py-12"
    >
      <SectionHeading title="Organizers" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-8 w-full max-w-7xl">
        {organizers.map(({ name, role, img, email }, i : number) => (
          <Card
              key={i}
              className="bg-gray-900/80 p-6 flex flex-col items-center text-center rounded-lg hover:shadow-lg transition-shadow relative"
            >
              <img
                src={img}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#40c0cb] mb-3 sm:mb-4 object-cover block"
                loading="lazy"
                decoding="async"
              />

              <div
                className="relative inline-block"
                onMouseEnter={() => showTooltip(i)}
                onMouseLeave={() => hideTooltip(i)}
              >
                {/* Name with fixed height */}
                <h3
                  className="text-white font-bold text-lg sm:text-xl cursor-pointer leading-tight line-clamp-2"
                  style={{ minHeight: "3rem" }}
                >
                  {name}
                </h3>

                {hoveredIndex === i && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm rounded-xl px-3 py-2 shadow-lg z-10"
                    onMouseEnter={() => showTooltip(i)}
                    onMouseLeave={() => hideTooltip(i)}
                  >
                    <button
                      onClick={() => copyToClipboard(email)}
                      className="hover:underline"
                    >
                      {email}
                    </button>
                  </div>
                )}

                {copied === email && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-12 text-green-500 text-xs">
                    Copied!
                  </div>
                )}
              </div>

              {/* Role with fixed space so they all align */}
              <span
                className="text-[#40c0cb] font-semibold mt-1"
                style={{ minHeight: "1.5rem" }}
              >
                {role}
              </span>
            </Card>

        ))}
      </div>
    </section>
  );
}

function CodeOfConductSection() {
  const conductPoints = [
    {
      title: "Respect and Inclusivity",
      content: `All participants, speakers, organizers, and volunteers must treat everyone with respect. Harassment, discrimination, or exclusion based on gender, identity, age, disability, race, ethnicity, religion, or background will not be tolerated.`,
    },
    {
      title: "Professionalism",
      content: `We expect professional and courteous behavior at all times, whether online or offline. Be mindful of your language and actions.`,
    },
    {
      title: "Safe Environment",
      content: `The event is dedicated to providing a harassment-free experience for everyone. Intimidation, stalking, or unwanted attention will result in removal.`,
    },
    {
      title: "Collaboration and Learning",
      content: `Encourage open collaboration. Share knowledge, help peers, and respect differing perspectives.`,
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCard = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="coc" className="w-full max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center text-[#40c0cb] mb-8">
        Code of Conduct
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {conductPoints.map((point, i) => (
          <div
            key={i}
            className={`border rounded-xl bg-gray-900/80 text-white shadow-md overflow-hidden ${
              i === conductPoints.length ? "md:col-span-2" : ""
            }`}
          >
            {/* Header (clickable) */}
            <button
              onClick={() => toggleCard(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold hover:text-[#40c0cb] transition-colors"
            >
              <span className="flex-1 text-center">{point.title}</span>
              <span className="text-sm">{openIndex === i ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown Content */}
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-gray-200 leading-relaxed">
                {point.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}



// Page Layout
export default function FallFestPage() {
  return (
    <main
        className="bg-[#0f0c29] bg-gradient-to-b from-[#00122B] via-[#102F5B] to-[#003580] text-white font-sans min-h-screen scroll-smooth"
        style={{
        "--global-nav-h": "64px",
      } as React.CSSProperties}
    >
      <div className="w-full">
        <FadeInOnScroll><HomeHero /></FadeInOnScroll>
        <FadeInOnScroll><EventSection /></FadeInOnScroll>
        <FadeInOnScroll><ScheduleSection /></FadeInOnScroll>
        <FadeInOnScroll><SpeakersSection /></FadeInOnScroll>
        <FadeInOnScroll><ResourcesSection /></FadeInOnScroll>
        <FadeInOnScroll><ColabSection /></FadeInOnScroll>
        <FadeInOnScroll><OrganizersSection /></FadeInOnScroll>
        <FadeInOnScroll><CodeOfConductSection /></FadeInOnScroll>
      </div>
    </main>
  );
}
