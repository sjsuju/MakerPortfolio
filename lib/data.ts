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
      "Founded and captained Team 23918, leading mechanical design across intake, sorting, shooter, drivebase, and iteration cycles. The work combined CAD, fabrication, testing discipline, and match strategy under real competition pressure.",
    image: "/placeholders/robotics.svg",
    tags: ["FTC", "CAD", "Robotics", "Leadership"]
  },
  {
    title: "EMG Prosthetic Hand",
    slug: "emg-prosthetic-hand",
    role: "Embedded systems and mechatronics",
    description:
      "Designed a prosthetic hand architecture around an ESP32, MyoWare EMG sensor, PCA9685 driver, and MG996R servos, with a planned Random Forest gesture classifier for more natural control.",
    image: "/placeholders/prosthetic.svg",
    tags: ["ESP32", "EMG", "Servos", "ML"]
  },
  {
    title: "Veridex Browser Extension",
    slug: "veridex",
    role: "AI product engineering",
    description:
      "Explored a privacy-minded extension workflow that helps readers summarize long pages, pull cited sources, and inspect claims without turning the browser into a black-box answer machine.",
    image: "/placeholders/veridex.svg",
    tags: ["Browser Extension", "Local AI", "UX", "Research"]
  },
  {
    title: "VibeShuffle / Spotify Tuner",
    slug: "vibeshuffle",
    role: "Music intelligence experiment",
    description:
      "Prototyped a more expressive way to tune playlists using natural preferences such as energy, texture, mood, familiarity, and listening context instead of only genre labels.",
    image: "/placeholders/music.svg",
    tags: ["Spotify", "Recommendations", "Product", "Data"]
  },
  {
    title: "Portfolio Website",
    slug: "makerportfolio",
    role: "Full-stack web project",
    description:
      "Built a web development project that connected backend routing, containerized deployment, AWS hosting, and portfolio content into a maintainable personal site foundation.",
    image: "/placeholders/portfolio.svg",
    tags: ["Flask", "Docker", "AWS", "Web"]
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
