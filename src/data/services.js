export const services = [
  {
    id: 1,
    code: "SVC-01",
    title: "Full-Stack Web Applications",
    tagline: "Production-ready web systems built for scale, reliability, and security",
    description: "End-to-end web application engineering from database architecture to client-side state management. Built with modular component boundaries, strict type safety patterns, and dependable data pipelines.",
    deliverables: [
      "Full-Stack React SPA with optimized state & routing",
      "Realtime cloud persistence (Firebase / Supabase)",
      "Role-based access control & secure authentication",
      "Automated CI/CD deployment with zero downtime",
    ],
    techStack: ["React", "Node.js", "Firebase", "REST APIs", "Vite"],
    turnaround: "2–4 Sprints",
    icon: "Layout",
    badge: "Full-Stack Architecture",
  },
  {
    id: 2,
    code: "SVC-02",
    title: "High-Performance UI & Design Systems",
    tagline: "Bespoke, pixel-exact web interfaces engineered for speed and conversion",
    description: "Transforming complex Figma prototypes into clean, responsive React interfaces. Handcrafted CSS token architectures with micro-interactions, hardware-level typography, and sub-second Core Web Vitals.",
    deliverables: [
      "1:1 Pixel-exact Figma to React / HTML5 implementation",
      "100% Fluid mobile & tablet responsiveness",
      "Lighthouse 95+ performance optimization (FCP < 1.0s)",
      "SEO metadata architecture & semantic OpenGraph cards",
    ],
    techStack: ["React", "Vanilla CSS Tokens", "Figma", "SEO / Web Vitals"],
    turnaround: "1–2 Sprints",
    icon: "PenTool",
    badge: "Frontend & UI/UX",
  },
  {
    id: 3,
    code: "SVC-03",
    title: "MVP & Rapid Product Prototyping",
    tagline: "Turning validated product concepts into working software in weeks",
    description: "Helping startup founders and engineering teams ship working Minimum Viable Products quickly. We prioritize core functional value to test market fit, onboard real users, and present to stakeholders without tech debt.",
    deliverables: [
      "Working production prototype deployed to live domain",
      "Lean scope roadmap focusing on primary user journey",
      "Integrated analytics, feedback capture & event tracking",
      "Clean, modular codebase structured for team scale",
    ],
    techStack: ["React", "Vite", "Serverless Backend", "Rapid CI/CD"],
    turnaround: "2–3 Sprints",
    icon: "Rocket",
    badge: "Rapid MVP Launch",
  },
  {
    id: 4,
    code: "SVC-04",
    title: "API Integration & Cloud Automation",
    tagline: "Connecting services, data pipelines, automated dispatches, and webhooks",
    description: "Bridging frontend user interfaces to third-party microservices, transactional email systems, payment gateways, and backend webhooks with robust error handling and payload validation.",
    deliverables: [
      "Third-party REST API pipelines with error boundary logic",
      "Automated transactional email workflows (EmailJS / Resend)",
      "Custom webhooks, serverless handlers & cloud triggers",
      "Database schema structuring & query optimization",
    ],
    techStack: ["REST APIs", "Cloud Functions", "EmailJS", "Webhooks"],
    turnaround: "1–2 Sprints",
    icon: "Server",
    badge: "Backend & Automation",
  },
];

export const clientProcess = [
  {
    step: "01",
    phase: "PHASE 01: SCOPE",
    title: "Discovery & Architecture Spec",
    description: "We align on business objectives, user flows, tech stack requirements, and edge cases to create a concrete project milestone document.",
    output: "Milestone Spec & Timeline",
  },
  {
    step: "02",
    phase: "PHASE 02: BLUEPRINT",
    title: "Design Tokens & Wireframes",
    description: "Wireframing the interface hierarchy, establishing design tokens, and laying out the database schema and API contracts.",
    output: "Figma Wireframes & API Schema",
  },
  {
    step: "03",
    phase: "PHASE 03: EXECUTION",
    title: "Iterative Sprint Builds",
    description: "Clean, modular implementation in weekly sprints with continuous staging previews so you test features as they are built.",
    output: "Weekly Live Staging URL",
  },
  {
    step: "04",
    phase: "PHASE 04: SHIP",
    title: "Audit, Deploy & Handover",
    description: "Rigorous cross-browser testing, Core Web Vitals audit, production deployment, and 100% source code repository handover.",
    output: "Production Deploy & Full IP",
  },
];

export const clientAssurances = [
  {
    icon: "Clock",
    title: "Predictable Turnaround",
    description: "Milestone-driven sprint cycles with weekly live staging demos and transparent progress.",
  },
  {
    icon: "ShieldCheck",
    title: "100% Code Ownership",
    description: "Complete IP and repository transfer upon completion with zero vendor lock-in.",
  },
  {
    icon: "Cpu",
    title: "Zero Framework Bloat",
    description: "Handcrafted React, custom CSS tokens, and optimal bundle size for sub-second page loads.",
  },
];

