import pocketTracerImg from '../assets/PocketTracer.webp';
import COSHSeminarImg from '../assets/COSHSeminar.webp';
import RSTWDost from "../assets/RSTWDost.jpeg";

export const certificates = [
  {
    id: 1,
    title: "Introduction to Packet Tracer & Network Topologies",
    organization: "Cisco Networking Academy",
    date: "2025",
    credentialUrl: "https://www.netacad.com/",
    image: pocketTracerImg,
    skills: ["Network Simulation", "IP Addressing", "Routing Protocols", "Diagnostic Tools"],
    description: "Verified foundational competence in network architecture, packet analysis, and simulated infrastructure setup.",
  },
  {
    id: 2,
    title: "Regional Science & Technology Week (RSTW)",
    organization: "DOST Region 1",
    date: "February 2026",
    credentialUrl: "#",
    image: RSTWDost,
    skills: ["Emerging Tech", "Digital Innovation", "Science & Research"],
    description: "Recognized for technical participation, technology exhibition, and digital innovation showcases.",
  },
  {
    id: 3,
    title: "Construction Occupational Safety & Health (COSH-SO2)",
    organization: "JCOSH / DOLE Accredited",
    date: "March 2026",
    credentialUrl: "#",
    image: COSHSeminarImg,
    skills: ["Risk Assessment", "Workplace Safety", "Standard Operating Procedures"],
    description: "Certified safety officer credential demonstrating compliance with industry occupational health standards.",
  },
];

export const achievements = [
  {
    id: 1,
    title: "Regional Science & Tech Innovation Exhibition",
    description: "Represented university in showcasing software and tech solutions at DOST RSTW.",
    year: "2026",
    icon: "Award",
    metric: "DOST Accredited",
  },
  {
    id: 2,
    title: "Dean's List & Academic Excellence",
    description: "Consistent academic recognition for top marks in core Computer Science & IT coursework.",
    year: "2022 – 2026",
    icon: "GraduationCap",
    metric: "Top Tier",
  },
  {
    id: 3,
    title: "Production Software Deployments",
    description: "Architected, tested, and published verified web applications and open-source tools with active live demos.",
    year: "2024 – Present",
    icon: "Rocket",
    metric: "5 Deployed",
  },
  {
    id: 4,
    title: "Technical Community Stewardship",
    description: "Mentored junior peers in web development fundamentals, Git workflows, and modern JavaScript.",
    year: "2023 – 2025",
    icon: "Users",
    metric: "Community",
  },
];
