import pocketTracerImg from '../assets/PocketTracer.webp';
import ciscoExamImg from '../assets/CiscoPacketTracerExam.webp';
import ciscoIoTImg from '../assets/CiscoIoTPacketTracer.webp';
import ciscoNetworkingImg from '../assets/CiscoNetworkingPacketTracer.webp';
import ciscoGettingStartedImg from '../assets/CiscoGettingStartedPacketTracer.webp';
import COSHSeminarImg from '../assets/COSHSeminar.webp';
import RSTWDost from '../assets/RSTWDost.webp';

export const certificates = [
  {
    id: 1,
    title: "Introduction to Packet Tracer",
    organization: "Cisco Networking Academy",
    date: "November 2025",
    credentialUrl: "https://www.netacad.com/",
    image: pocketTracerImg,
    skills: ["Cisco Packet Tracer", "Simple Networks", "Network Controllers", "Smart Home IoT"],
    description: "Student-level Certificate of Completion for building simple networks, configuring network controllers, and simulating smart home IoT devices in Cisco Packet Tracer.",
  },
  {
    id: 2,
    title: "Introduction to Packet Tracer Exam",
    organization: "Cisco Networking Academy",
    date: "November 2025",
    credentialUrl: "https://www.netacad.com/",
    image: ciscoExamImg,
    skills: ["Network Simulation", "Packet Analysis", "Device Configuration", "Diagnostics"],
    description: "Passed the Cisco Networking Academy examination verifying practical proficiency in network simulation, topology design, and packet flow diagnostics.",
  },
  {
    id: 3,
    title: "Exploring Internet of Things with Cisco Packet Tracer",
    organization: "Cisco Networking Academy",
    date: "November 2025",
    certId: "01b4579b-04c2-4276-880c-027b3da872a8",
    credentialUrl: "https://www.netacad.com/",
    image: ciscoIoTImg,
    skills: ["IoT Architecture", "Smart Sensors", "Microcontrollers", "IoT Security"],
    description: "Completed hands-on simulation training on connecting smart IoT devices, configuring network controllers, and modeling automated smart environments.",
  },
  {
    id: 4,
    title: "Exploring Networking with Cisco Packet Tracer",
    organization: "Cisco Networking Academy",
    date: "November 2025",
    certId: "34b0dce8-01d1-4d2d-9345-fb33adb49cbd",
    credentialUrl: "https://www.netacad.com/",
    image: ciscoNetworkingImg,
    skills: ["IP Addressing", "Routing & Switching", "LAN Topologies", "Network Protocols"],
    description: "Demonstrated competence in building, configuring, and troubleshooting wired and wireless local area networks inside Cisco Packet Tracer.",
  },
  {
    id: 5,
    title: "Getting Started with Cisco Packet Tracer",
    organization: "Cisco Networking Academy",
    date: "November 2025",
    certId: "9e408e02-d441-4871-8abb-aee5d723edf2",
    credentialUrl: "https://www.netacad.com/",
    image: ciscoGettingStartedImg,
    skills: ["Topology Modeling", "Network Interface", "Packet Inspection", "CLI Basics"],
    description: "Foundational Cisco Networking Academy credential covering virtual lab setup, physical/logical workspace modeling, and simulation workflows.",
  },
  {
    id: 6,
    title: "Regional Science & Technology Week (RSTW)",
    organization: "DOST Region 1",
    date: "February 2026",
    credentialUrl: "#",
    image: RSTWDost,
    skills: ["Emerging Tech", "Digital Innovation", "Science & Research"],
    description: "Recognized for technical participation, technology exhibition, and digital innovation showcases.",
  },
  {
    id: 7,
    title: "Construction Occupational Safety & Health (COSH-SO2)",
    organization: "JCOSH / DOLE Accredited",
    date: "March 2026",
    credentialUrl: "#",
    image: COSHSeminarImg,
    skills: ["Risk Assessment", "Workplace Safety", "Standard Operating Procedures"],
    description: "Certified safety officer credential demonstrating compliance with industry occupational health standards.",
  },
];
