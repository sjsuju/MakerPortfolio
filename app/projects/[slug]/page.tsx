import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projects } from "@/lib/data";

type Section = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  file?: string;
  code?: string;
};

// ponytail: presentational only, no highlighting lib. Monochrome code, VS Code-style chrome.
function CodeWindow({ file, code }: { file: string; code: string }) {
  return (
    <div className="code-window mt-5 overflow-hidden rounded-lg border border-border bg-background/70 dark:bg-black/40">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-hazard/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
        </span>
        <span className="font-mono text-[11px] tracking-tight text-muted-foreground">{file}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Rich write-ups keyed by slug. Slugs missing here render an honest "coming soon" skeleton.
const content: Record<string, Section[]> = {
  makerportfolio: [
    {
      heading: "From Flask to Next.js",
      paragraphs: [
        "The first version of this site was a Flask app I containerized with Docker and hosted on AWS. It taught me the parts of web work that never show up in a tutorial: routing, deployment, and the ongoing cost of keeping a personal site maintainable once the novelty wears off.",
        "The current site is a rebuild on Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS. I collapsed a sprawl of thin routes into three that earn their place (/, /projects, and /contact), with redirects from the old routes so nothing breaks."
      ]
    },
    {
      heading: "A gear train that scrolls",
      paragraphs: [
        "Every page sits on a procedural SVG gear field. The gear shapes are not images: a small function generates each tooth polygon from a tooth count and a module value, the same two parameters real spur gears are specified with. Clusters are laid out as meshing trains, for example a 26T driving a 12T driving a 16T.",
        "Scrolling is the crank. Each gear's angular speed is inversely proportional to its tooth count and adjacent gears counter-rotate, so the meshing ratios are physically honest instead of decorative. The handler is throttled through requestAnimationFrame and the whole layer switches off under prefers-reduced-motion.",
        "A charge wire rides along: one long SVG path, resampled every frame with getPointAtLength so a glowing node and a progress trace follow your scroll position through the page."
      ],
      file: "components/gear-field.tsx",
      code: `const REF_TEETH = 24;
const BASE_SPEED = 0.055; // degrees per scrolled pixel for a 24-tooth gear

const apply = () => {
  const scrolled = window.scrollY;
  ALL_GEARS.forEach((spec, i) => {
    const el = gearRefs.current[i];
    if (!el) return;
    // speed is inversely proportional to tooth count and
    // adjacent gears counter-rotate (spec.dir is 1 or -1)
    const speed = BASE_SPEED * (REF_TEETH / spec.teeth) * spec.dir;
    el.style.transform = \`rotate(\${spec.phase + scrolled * speed}deg)\`;
  });
};`
    },
    {
      heading: "Glass over the machinery",
      paragraphs: [
        "The cards are a liquid-glass system: backdrop-filter panels layered over the live gear field, so the machinery stays visible through every surface instead of being covered by opaque boxes.",
        "The homepage pushes the theme further. Navigation buttons sit on a PCB layout, wired together with circuit traces that carry animated pulses. The whole site runs on a VS Code Dark+/Light+ theme implemented as HSL CSS variables with class-based dark mode, which is also why code blocks like the ones on this page feel native here."
      ]
    },
    {
      heading: "The resume pipeline",
      paragraphs: [
        "The resume is not a separate document to keep in sync. It is the site. Visiting /contact?print=resume auto-opens the print dialog, and a print stylesheet strips the header, footer, gear field, and every non-resume section, leaving a single letter-sized sheet.",
        "One source of truth, two outputs: the screen version and the paper version stay identical because they are the same markup."
      ],
      file: "app/globals.css",
      code: `@media print {
  @page {
    size: letter;
    margin: 0;
  }

  header,
  footer,
  .gear-field,
  body > div > main > section:not(.resume-print),
  .print-hide {
    display: none !important;
  }

  .resume-sheet {
    width: 8.5in !important;
    max-width: none !important;
  }
}`
    },
    {
      heading: "Keeping it lean",
      paragraphs: [
        "The rebuild was mostly deletion. I dropped framer-motion and a pile of old hero, bento, and card components in favor of writing the small amount of code they were hiding. Every route prerenders statically, so there is nothing to spin up and nothing to pay for at request time.",
        "The rule I kept coming back to: subtract before you add. Less code is less to explain at 3am."
      ]
    }
  ],
  veridex: [
    {
      heading: "The trust problem",
      paragraphs: [
        "Long articles bury their sourcing, claims conflict across pages, and AI answers arrive confident but untraceable. When a tool summarizes something for you, it usually asks you to trust it rather than showing you why you should.",
        "Veridex is my answer to that posture: a browser assistant that shows its evidence instead of being a black box, and that runs the model on your own machine instead of shipping every page you read to an API."
      ]
    },
    {
      heading: "How the extension is wired",
      paragraphs: [
        "It is a Manifest V3 extension with three moving parts. A background service worker does exactly one job: open the side panel, from the toolbar icon or a Ctrl+Shift+K command. The side panel drives everything else. When you hit Analyze, it injects the content script into the active tab with chrome.scripting.executeScript, then requests the page over message passing.",
        "The content script clones the body, strips the noise (script, style, nav, footer, aside, svg, iframe, form tags), collapses whitespace, and caps the text at 35,000 characters. It also collects up to 120 deduplicated links with their anchor text, because the links are the raw material for source extraction."
      ],
      file: "extension/content.js",
      code: `function getVisibleText() {
  const clone = document.body.cloneNode(true);

  clone.querySelectorAll(
    "script, style, nav, footer, aside, noscript, svg, canvas, iframe, form"
  ).forEach((el) => el.remove());

  return clone.innerText
    .replace(/\\s+/g, " ")
    .trim()
    .slice(0, 35000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_DATA") {
    sendResponse({
      title: document.title,
      url: location.href,
      text: getVisibleText(),
      links: getLinks()
    });
  }
});`
    },
    {
      heading: "A local model instead of an API",
      paragraphs: [
        "The side panel posts the page data to a small Express backend on localhost with two endpoints: /summarize-page for the initial analysis and /ask-page for follow-up questions. The backend never calls a cloud API. It forwards a structured prompt to Ollama running on the same machine (gemma3:1b by default, configurable through an env var) at temperature 0.2.",
        "That is a real trade-off, not a free win. A 1B local model is slower and weaker than a hosted frontier model. In exchange, the page you are reading never leaves your device. For a tool whose whole point is trust, I think that is the right side of the trade."
      ],
      file: "backend/server.js",
      code: `const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3:1b";
const OLLAMA_URL = "http://localhost:11434/api/chat";

async function askOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      options: { temperature: 0.2 }
    })
  });

  const data = await response.json();
  return data.message?.content || "No response from local model.";
}`
    },
    {
      heading: "Forcing structure on the output",
      paragraphs: [
        "Small models ramble, so the prompt does not ask for an essay. It demands a fixed skeleton: SUMMARY, KEY CLAIMS, SOURCES/LINKS MENTIONED, BIAS OR WEAKNESS CHECK, USEFUL TAKEAWAY. The side panel parses those exact markers back into headed sections, which keeps summary and verification visually separate instead of blended into one confident paragraph.",
        "The prompt also draws hard lines: only discuss links that were actually extracted from the page, never claim to have verified facts beyond the provided text, and say plainly when the evidence is weak or promotional. Follow-up questions keep the last eight conversation turns plus the page context, and the model is told to answer general questions generally instead of forcing everything through the page."
      ],
      bullets: [
        "Sources rendered next to the claims they support, not in a footnote pile",
        "Summary and bias check are separate sections, never merged",
        "Uncertainty is stated, not smoothed over",
        "Analysis runs only when you click, never in the background"
      ]
    },
    {
      heading: "Current state and what's next",
      paragraphs: [
        "The pipeline works end to end today: extract, summarize, pull sources, flag weaknesses, follow-up chat. What it is not yet is a claim-by-claim inspector. The next step is splitting KEY CLAIMS into individually checkable items, each linked to the specific extracted passage it came from, so a reader can jump from claim to evidence in one click.",
        "I also want to try larger local models as they get faster, since the 1B model is the current quality bottleneck, and the architecture makes swapping models a one-line env change."
      ]
    }
  ],
  vibeshuffle: [
    {
      heading: "Beyond genre labels",
      paragraphs: [
        "Music interfaces hand you genre tags, but that is not how taste works. People reach for music by energy, mood, texture, familiarity, and setting. A track that fits a late-night drive and one that fits a morning kitchen might share a genre and nothing else.",
        "VibeShuffle, in active development since April 2025, is a full-stack Spotify app built around that gap: log in with Spotify, open a playlist, type a phrase like \"rainy night drive\" or \"high energy workout\", and get the playlist reranked against it. The frontend is React with Vite; the backend is Flask with Flask-CORS, split into route blueprints (auth, playlists) and services."
      ]
    },
    {
      heading: "Training vibe profiles from 114,000 tracks",
      paragraphs: [
        "The ranking model is a JSON artifact trained offline by ml/train_vibe_model.py from the Kaggle maharshipandya/-spotify-tracks-dataset: 114,000 tracks across 114 genres. The trainer computes an audio-feature profile per genre, plus profiles for qualitative descriptors defined as feature ranges. \"Rainy\" means low energy, low valence, high acousticness. \"Workout\" means high energy and a tempo between 115 and 190 BPM.",
        "An alias table maps everyday words onto those descriptors, so \"gym\" resolves to workout, \"coding\" to focus, and \"roadtrip\" to drive. It is a blunt instrument, but it is inspectable: I can point at exactly why a phrase produced a profile, which is not true of an embedding."
      ],
      file: "ml/train_vibe_model.py",
      code: `DESCRIPTOR_RULES = {
    "chill": {"energy": (0.0, 0.55), "danceability": (0.35, 0.85), "valence": (0.35, 0.8)},
    "drive": {"energy": (0.55, 0.9), "tempo": (95.0, 150.0), "valence": (0.35, 0.85)},
    "focus": {"speechiness": (0.0, 0.18), "instrumentalness": (0.25, 1.0), "energy": (0.15, 0.7)},
    "rainy": {"energy": (0.0, 0.45), "valence": (0.0, 0.55), "acousticness": (0.35, 1.0)},
    "workout": {"energy": (0.78, 1.0), "tempo": (115.0, 190.0), "danceability": (0.45, 1.0)},
}

ALIASES = {
    "gym": "workout",
    "coding": "focus",
    "roadtrip": "drive",
    "lofi": "study",
}`
    },
    {
      heading: "Ranking a playlist against a phrase",
      paragraphs: [
        "At request time, services/vibe_classifier.py tokenizes the prompt, resolves aliases, collects every matching descriptor and genre profile, and averages them into one target profile. Each track is then scored by a weighted normalized Euclidean distance between its audio features and that target, and the score is 1 minus the distance.",
        "The weights encode an opinion: energy and valence at 1.4 matter most to how a song feels, danceability sits at 1.2, tempo at 0.8, and popularity barely registers at 0.2. Genre never appears as a hard filter. It is just one weak signal that feeds profile matching."
      ],
      file: "services/vibe_classifier.py",
      code: `def _score(self, features, target_profile):
    weighted_distance = 0.0
    weight_total = 0.0

    for feature in self.artifact.get("features", []):
        bounds = self.artifact.get("bounds", {}).get(feature, {})
        span = bounds.get("max", 1) - bounds.get("min", 0)

        observed = (float(features[feature]) - bounds.get("min", 0)) / span
        target = (float(target_profile[feature]) - bounds.get("min", 0)) / span
        weight = self._feature_weight(feature)  # energy 1.4, valence 1.4 ...
        weighted_distance += weight * ((observed - target) ** 2)
        weight_total += weight

    distance = math.sqrt(weighted_distance / weight_total)
    return round(max(0.0, 1.0 - distance), 4)`
    },
    {
      heading: "When Spotify holds back the data",
      paragraphs: [
        "The messy real-world problem: Spotify often withholds rich audio features. When a track has none, the classifier falls back to a metadata profile built from the artist's genres and descriptor words found in the track, album, and artist text, blended as 88% profile distance and 12% text affinity. Missing data also creates score ties, so a deterministic tie-breaker hashed from the vibe phrase and track identity nudges each score by up to 0.018. The same phrase stays stable across requests while different phrases break ties differently.",
        "To avoid re-fetching enrichment on every rank, services/track_cache.py caches enriched track metadata in a local SQLite file that gets created on first run and never leaves the machine."
      ]
    },
    {
      heading: "The app around the model",
      paragraphs: [
        "routes/auth.py owns the Spotify OAuth dance: /login builds the authorize URL with a state parameter and redirects, /callback validates the state, exchanges the code for tokens, and bounces back to the React dashboard. routes/playlists.py exposes the playlist and track REST endpoints the frontend calls, with all Spotify Web API traffic isolated in services/spotify_service.py.",
        "After ranking, the app can write the result back: it creates a private Spotify playlist in the ranked order, which needed the playlist-modify OAuth scopes on top of the read scopes. The UI shows the matched descriptor terms for each ranking, so you can see why a song was picked instead of trusting a bare score."
      ]
    },
    {
      heading: "What's next",
      paragraphs: [
        "The descriptor rules are hand-tuned ranges, and that is the current ceiling. The next iterations I want: learning from liked and skipped feedback inside the app so corrections actually move future rankings, and clustering a user's own library by vibe instead of relying only on the global dataset profiles. The tuning loop should feel like adjusting a knob, not regenerating a playlist from scratch."
      ]
    }
  ]
};

const placeholderSections = ["Build log", "Design iterations", "Results"];

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? project.title : "Project" };
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }

  const sections = content[project.slug];

  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          data-reveal
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <div className="mt-8 max-w-3xl" data-reveal>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <span aria-hidden="true" className="mr-2 text-hazard">
              {"//"}
            </span>
            Project
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{project.title}</h1>
          <p className="mt-4 text-sm font-semibold text-primary">{project.role}</p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-12 grid max-w-3xl gap-6">
          {sections ? (
            sections.map((section) => (
              <Card key={section.heading} className="p-6 md:p-8" data-reveal>
                <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="mt-4 leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-4 grid gap-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-7 text-muted-foreground">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hazard" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.file && section.code ? (
                  <CodeWindow file={section.file} code={section.code} />
                ) : null}
              </Card>
            ))
          ) : (
            <Card className="p-6 md:p-8" data-reveal>
              <h2 className="text-xl font-semibold tracking-tight">Full write-up coming soon</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                I&apos;m still writing this one up properly. The finished page will cover:
              </p>
              <ul className="mt-4 grid gap-2">
                {placeholderSections.map((heading) => (
                  <li key={heading} className="flex gap-3 leading-7 text-muted-foreground">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hazard" />
                    {heading}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Rather than fill it with placeholder claims, I&apos;d rather leave it honest until the real
                notes are ready.
              </p>
            </Card>
          )}
        </div>
      </section>
    </PageShell>
  );
}
