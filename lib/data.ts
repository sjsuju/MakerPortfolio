export const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" }
];

export const projects = [
  {
    title: "FTC Team 23918 Super Sigma Robotics",
    slug: "ftc-23918",
    role: "Founder, captain, design lead",
    description:
      "Founded Team 23918 in 2023 and have captained it every season since, leading mechanical design across intake, sorting, shooter, and drivebase. In the DECODE season the team won first place Inspire Award at both the regional and state levels, advancing to the FIRST Championship as Oregon's #1 placed team.",
    image: "/placeholders/robotics.svg",
    tags: ["FTC", "CAD", "Robotics", "Leadership"]
  },
  {
    title: "EMG Prosthetic Hand",
    slug: "emg-prosthetic-hand",
    role: "Embedded systems and machine learning",
    description:
      "A five finger prosthetic hand driven by forearm muscle signals. Two MyoWare 2.0 sensors feed an Arduino Nano ESP32 at 100 Hz, a Random Forest sorts each window into clamp, point, or open, and a PCA9685 drives the servos only once the prediction has held steady.",
    image: "/placeholders/prosthetic.svg",
    tags: ["ESP32", "EMG", "Random Forest", "Assistive Tech"]
  },
  {
    title: "Buddy AI Assistant",
    slug: "buddy-ai",
    role: "Desktop AI product engineering",
    description:
      "A floating AI companion for Windows 11, built in Electron. A small expressive face expands into a full assistant with chat, media and system control, consent-gated screen vision, and MCP tool integrations, designed so routine commands never cost a token and every capability sits behind an explicit permission.",
    image: "/projects/buddy.png",
    tags: ["Electron", "AI Agents", "MCP", "Windows"]
  },
  {
    title: "Veridex Browser Extension",
    slug: "veridex",
    role: "AI product engineering",
    description:
      "A reading assistant that shows its evidence instead of asking for trust. Veridex summarizes long pages, pulls out the sources they cite, and flags weak or promotional claims, running the model locally through Ollama so the page you are reading never leaves your machine.",
    image: "/placeholders/veridex.svg",
    tags: ["Browser Extension", "Local AI", "Manifest V3", "Research"]
  },
  {
    title: "VibeShuffle / Spotify Tuner",
    slug: "vibeshuffle",
    role: "Music intelligence experiment",
    description:
      "A Spotify app that reranks a playlist against a phrase like \"rainy night drive\" instead of a genre label. A model trained offline on 114,000 tracks turns everyday words into audio-feature profiles, then scores every track against them and can write the result back as a new playlist.",
    image: "/placeholders/music.svg",
    tags: ["Flask", "React", "Recommendations", "Data"]
  },
  {
    title: "SoleLedger Resale Tracker",
    slug: "soleledger",
    role: "Full-stack product engineering",
    description:
      "A sneaker resale tracker built around honest math rather than bots. It follows a pair from purchase to payout in fixed-precision decimals, and a deterministic pricing agent reprices listings against StockX market data behind a floor it is not allowed to cross. Every buying decision stays in human hands.",
    image: "/placeholders/soleledger.svg",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "StockX API"]
  },
  {
    title: "Portfolio Website",
    slug: "makerportfolio",
    role: "Full-stack web project",
    description:
      "This site. It began as a containerized Flask app on AWS and became a Next.js rebuild with a hand-rolled 3D gear you can drag, a working terminal in the hero, and a warm drafting-table theme layered under frosted glass panels.",
    image: "/placeholders/portfolio.svg",
    tags: ["Next.js", "TypeScript", "Canvas", "Design"]
  }
];

export const timeline = [
  {
    year: "2023",
    title: "Founded Super Sigma Robotics",
    text: "Organized the team, set the technical direction, and began rapid robot iteration."
  },
  {
    year: "2025",
    title: "Founded the Curious Neurons Foundation",
    text: "A non-profit organization dedicated to improving access to technology and education for underprivileged communities. Encompasses Super Sigma Robotics and other initiatives dedicated to bringing STEM for all."
  },
  {
    year: "2026",
    title: "Qualified for FTC World Championship",
    text: "Led design and competition execution through high-pressure regional and championship cycles."
  },
  {
    year: "2026",
    title: "Expanded into assistive tech and AI tools",
    text: "Started building EMG prosthetics, browser AI workflows, and recommendation systems."
  }
];

export const contactLinks = [
  {
    label: "Email",
    value: "soorajjsathyajith@gmail.com",
    href: "mailto:soorajjsathyajith@gmail.com"
  },
  { label: "GitHub", 
    value: "sjsuju", 
    href: "https://github.com/sjsuju" 
  },
  {
    label: "LinkedIn",
    value: "Sooraj Sathyajith",
    href: "https://www.linkedin.com/in/sooraj-sathyajith-0b5695345/"
  }
];
