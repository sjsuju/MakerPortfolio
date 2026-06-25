export const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact + Resume", href: "/contact" }
];

export const projects = [
  {
    title: "FTC Team 23918 Super Sigma Robotics",
    role: "Founder, captain, design lead",
    summary:
      "Built and led an FTC robotics team from early prototypes through World Championship qualification.",
    description:
      "Founded and captained Team 23918, leading mechanical design across intake, sorting, shooter, drivebase, and iteration cycles. The work combined CAD, fabrication, testing discipline, and match strategy under real competition pressure.",
    image: "/placeholders/robotics.svg",
    tags: ["FTC", "CAD", "Robotics", "Leadership"],
    icon: "trophy",
    featured: true
  },
  {
    title: "EMG Prosthetic Hand",
    role: "Embedded systems and mechatronics",
    summary:
      "Low-cost 3D printed prosthetic hand controlled by EMG muscle signals and servo actuation.",
    description:
      "Designed a prosthetic hand architecture around an ESP32, MyoWare EMG sensor, PCA9685 driver, and MG996R servos, with a planned Random Forest gesture classifier for more natural control.",
    image: "/placeholders/prosthetic.svg",
    tags: ["ESP32", "EMG", "Servos", "ML"],
    icon: "hand",
    featured: true
  },
  {
    title: "Veridex Browser Extension",
    role: "AI product engineering",
    summary:
      "Local AI browser assistant for webpage summaries, source extraction, and claim checks.",
    description:
      "Explored a privacy-minded extension workflow that helps readers summarize long pages, pull cited sources, and inspect claims without turning the browser into a black-box answer machine.",
    image: "/placeholders/veridex.svg",
    tags: ["Browser Extension", "Local AI", "UX", "Research"],
    icon: "shield",
    featured: true
  },
  {
    title: "VibeShuffle / Spotify Tuner",
    role: "Music intelligence experiment",
    summary:
      "Music filtering and recommendation app based on qualitative user input.",
    description:
      "Prototyped a more expressive way to tune playlists using natural preferences such as energy, texture, mood, familiarity, and listening context instead of only genre labels.",
    image: "/placeholders/music.svg",
    tags: ["Spotify", "Recommendations", "Product", "Data"],
    icon: "music",
    featured: true
  },
  {
    title: "Portfolio Website",
    role: "Full-stack web project",
    summary:
      "Flask, Docker, and AWS project focused on deployment, iteration, and personal storytelling.",
    description:
      "Built a web development project that connected backend routing, containerized deployment, AWS hosting, and portfolio content into a maintainable personal site foundation.",
    image: "/placeholders/portfolio.svg",
    tags: ["Flask", "Docker", "AWS", "Web"],
    icon: "code",
    featured: false
  }
];

export const skills = [
  "Mechanical Design",
  "CAD Iteration",
  "3D Printing",
  "Embedded Systems",
  "ESP32",
  "Robot Strategy",
  "Python",
  "TypeScript",
  "Next.js",
  "Flask",
  "Docker",
  "AWS",
  "Machine Learning",
  "Product Thinking",
  "Technical Writing"
];

export const processSteps = [
  {
    title: "Frame",
    text: "Define constraints, success metrics, and what the build has to prove.",
    icon: "brain"
  },
  {
    title: "Prototype",
    text: "Move quickly from sketch to CAD, code, printed part, or bench test.",
    icon: "wrench"
  },
  {
    title: "Instrument",
    text: "Use data, driver feedback, and failure notes to identify the real bottleneck.",
    icon: "cpu"
  },
  {
    title: "Ship",
    text: "Refine the system until it can survive demos, matches, and public scrutiny.",
    icon: "rocket"
  }
];

export const timeline = [
  {
    year: "2023",
    title: "Founded Super Sigma Robotics",
    text: "Organized the team, set the technical direction, and began rapid robot iteration."
  },
  {
    year: "2024",
    title: "Qualified for FTC World Championship",
    text: "Led design and competition execution through high-pressure regional and championship cycles."
  },
  {
    year: "2025",
    title: "Expanded into assistive tech and AI tools",
    text: "Started building EMG prosthetics, browser AI workflows, and recommendation systems."
  }
];

export const contactLinks = [
  { label: "Email", value: "sooraj@example.com", href: "mailto:sooraj@example.com" },
  { label: "GitHub", value: "github.com/sooraj", href: "https://github.com/" },
  { label: "LinkedIn", value: "linkedin.com/in/sooraj", href: "https://www.linkedin.com/" }
];

export const heroStats = [
  { label: "FTC team", value: "23918" },
  { label: "Worlds", value: "Qualified" },
  { label: "Build focus", value: "Robotics + AI" }
];
