export const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
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
      "A five finger prosthetic hand driven by forearm muscle signals. Two MyoWare sensors feed an Arduino Nano ESP32 at 100 Hz, a Random Forest sorts each second of signal into open, clamp, or point at 96% accuracy held out by recording, and a PCA9685 moves the servos only once the prediction has held steady.",
    image: "/placeholders/prosthetic.svg",
    tags: ["ESP32", "EMG", "Random Forest", "Assistive Tech"]
  },
  {
    title: "Buddy AI Assistant",
    slug: "buddy-ai",
    role: "Desktop AI product engineering",
    description:
      "A floating AI companion for Windows 11, built in Electron. A small expressive face expands into an assistant with chat, media and system control, screen vision that asks permission every time, and MCP tool integrations. Routine commands like play or volume run locally and never reach the API.",
    image: "/projects/buddy.png",
    tags: ["Electron", "AI Agents", "MCP", "Windows"]
  },
  {
    title: "Veridex Browser Extension",
    slug: "veridex",
    role: "AI product engineering",
    description:
      "A reading assistant built to show its work. Veridex summarizes long pages, pulls out the sources they cite, and points at claims that look weak or promotional. The model runs locally through Ollama, so the page you are reading never leaves your machine.",
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
      "A sneaker resale tracker for the part nobody automates: whether you actually made money. It follows a pair from purchase to payout in fixed-precision decimals, and a pricing agent reprices listings against StockX data without ever going below a floor that guarantees your margin. Buying decisions stay with you.",
    image: "/placeholders/soleledger.svg",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "StockX API"]
  },
  {
    title: "Portfolio Website",
    slug: "makerportfolio",
    role: "Full-stack web project",
    description:
      "This site. It started as a containerized Flask app on AWS and got rebuilt in Next.js, picking up a 3D gear you can drag, a terminal that answers questions about my work, and a warm drafting-table theme sitting under frosted glass panels.",
    image: "/placeholders/portfolio.svg",
    tags: ["Next.js", "TypeScript", "Canvas", "Design"]
  }
];

export const timeline = [
  {
    year: "2023",
    title: "Founded Super Sigma Robotics",
    text: "Put the team together, set its technical direction, and started building robots on a competition clock."
  },
  {
    year: "2025",
    title: "Founded the Curious Neurons Foundation",
    text: "A non-profit working on access to technology and education for underprivileged communities. Super Sigma Robotics sits under it, along with other STEM outreach work."
  },
  {
    year: "2026",
    title: "Qualified for FTC World Championship",
    text: "Won first place Inspire Award at regionals and states, and advanced as Oregon's top placed team."
  },
  {
    year: "2026",
    title: "Expanded into assistive tech and AI tools",
    text: "Started the EMG prosthetic hand, then browser AI and recommendation work alongside it."
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
