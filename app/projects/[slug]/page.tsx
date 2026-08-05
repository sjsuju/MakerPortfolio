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
  "emg-prosthetic-hand": [
    {
      heading: "Control from a muscle, not a button",
      paragraphs: [
        "Most low-cost prosthetic hands are driven by something that is not the body: a switch, an app, a shoulder harness. The intent is already there in the forearm as electrical activity every time someone tries to close their hand. The project is about reading that intent directly, so control feels like moving rather than operating.",
        "The build is a five finger hand with two MyoWare 2.0 sensors on the forearm, an Arduino Nano ESP32 reading them, a Random Forest deciding what the muscle is doing, and a PCA9685 driving five servos through tendon strings. Cost, comfort, and reliability are treated as engineering requirements, not as things to apologize for later."
      ]
    },
    {
      heading: "One hundred windows a second",
      paragraphs: [
        "Firmware samples both sensors every 10 ms, so 100 Hz, and streams them over serial at 115200 baud. Python buffers the stream into 50-sample windows that step forward 25 samples at a time, which means each half second of muscle activity gets looked at twice and decisions arrive about four times a second.",
        "The detail that cost the most time is the ADC width. The Nano ESP32 reads 12 bits, so 0 to 4095, while an AVR Nano reads 10 bits and tops out at 1023. Data collected on one board is silently meaningless to a model trained on the other. The sample rate is equally load-bearing: the FFT band features are computed against it, so a firmware interval that drifts out of sync with the config degrades the model without ever raising an error. Both live in one config file with the reasoning written next to them."
      ],
      file: "config.py",
      code: `# Two MyoWare 2.0 sensors. The Nano ESP32 reads 12 bit, so 0-4095.
# (An AVR Nano would be 1023 here, which is why data does not transfer.)
SENSOR_COLUMNS = ["sensor1", "sensor2"]
SENSOR_PIN_LABELS = ["A1", "A2"]  # A0 is DTR, A4/A5 are I2C
ADC_MAX = 4095

# Must match EMG_INTERVAL_MS in the firmware (10 ms -> 100 Hz).
# The FFT band features depend on this, so a wrong value
# silently degrades the model.
SAMPLE_RATE = 100
WINDOW_SIZE = 50
STEP_SIZE = 25`
    },
    {
      heading: "Nineteen numbers per window",
      paragraphs: [
        "Raw EMG is noisy and roughly symmetric around a baseline, so the average value of a window says almost nothing. Each window is turned into 19 features instead. Every sensor contributes six time-domain statistics that describe how hard the muscle is working, plus the power in three frequency bands from an FFT, because fatigue and contraction type change the spectrum even when the amplitude looks similar.",
        "The nineteenth feature is the correlation between the two sensors. That one matters more than it looks: pointing and clamping can produce similar intensity on either sensor alone, and what separates them is whether the two muscles fire together or in opposition. A flat signal makes that correlation undefined, so the result is scrubbed of NaNs before it reaches the model.",
        "A Random Forest of 200 trees with balanced class weights does the classification into clamp, point, and open. A forest was the right call over a neural network here: it trains in seconds on a laptop from a few minutes of recorded gestures, it does not need a GPU, and it gives usable class probabilities, which the confidence gate depends on."
      ],
      file: "train_model.py",
      code: `# 6 time-domain + 3 frequency-band features per sensor
for column in SENSOR_COLUMNS:
    signal = window[column].values.astype(float)
    features.extend([
        np.mean(signal), np.std(signal), np.min(signal),
        np.max(signal), np.max(signal) - np.min(signal),
        np.sqrt(np.mean(signal ** 2)),  # RMS
    ])

    fft_values = np.abs(np.fft.rfft(signal))
    freqs = np.fft.rfftfreq(len(signal), d=1 / SAMPLE_RATE)
    features.extend([
        band_power(freqs, fft_values, 0, 5),
        band_power(freqs, fft_values, 5, 20),
        band_power(freqs, fft_values, 20, 50),
    ])

# Cross-sensor relationship: are the muscles firing together?
features.append(safe_correlation(sensor1, sensor2))`
    },
    {
      heading: "Refusing to move on a twitch",
      paragraphs: [
        "A classifier that is right 90 percent of the time still means a hand that spasms every tenth window, which is unusable and unsafe. Prediction and actuation are therefore separate decisions. The model can guess whatever it likes, but the servos only move when the last three consecutive windows agree on the same gesture and every one of them cleared 75 percent confidence.",
        "That costs roughly three quarters of a second of latency before the hand responds. It buys a hand that does not twitch when you shift your arm or when a sensor pad loses contact for a moment. For an assistive device, that trade is not close."
      ],
      file: "emg_io.py",
      code: `def stable_gesture(prediction_history, min_confidence=MIN_CONFIDENCE,
                   required=STABLE_PREDICTIONS_REQUIRED):
    """Return (gesture, run_length) once the last \`required\` windows agree."""
    if not prediction_history:
        return None, 0

    recent_gesture = prediction_history[-1][0]
    run_length = 0

    for gesture, confidence in reversed(prediction_history):
        if gesture != recent_gesture or confidence < min_confidence:
            break
        run_length += 1

    if run_length >= required:
        return recent_gesture, run_length

    return None, run_length  # still settling, hold position`
    },
    {
      heading: "Calibration is part of the design",
      paragraphs: [
        "Every finger gets its own open and clamp angle, and those numbers are different on every physical build because tendon string tension is never identical twice. Rather than pretend a single constant works, the angles live in a table that is meant to be edited, and the live dashboard lets you nudge the selected finger with the bracket keys and then print a config line you can paste straight back over the table.",
        "The gesture model itself stayed deliberately simple: every gesture is defined as clamping everything except a named set of fingers, so adding a new one is a single line rather than a new control path. The next step is expanding past three gestures and testing electrode placement across different forearms, since the classifier is currently trained on one.",
        "Tooling honesty matters too. Only one program can hold the serial port at a time, which is the kind of thing that silently wastes an hour, so it is written at the top of the runbook rather than learned again every session."
      ],
      file: "config.py",
      code: `# Per-finger calibration. String tension differs on every build, so
# these are the knobs you tune. Nudge with [ and ] in dashboard.py,
# press S to print a line you can paste back over this table.
#          name,      open, clamp
FINGERS = [
    ("Thumb",  0, 85),
    ("Index",  0, 95),
    ("Middle", 0, 70),
    ("Ring",   0, 90),
    ("Pinky",  0, 95),
]

def gesture_angles(open_fingers):
    """Every gesture is 'clamp everything except these fingers'."""`
    }
  ],
  soleledger: [
    {
      heading: "A ledger, not a bot",
      paragraphs: [
        "Sneaker resale software is mostly bots: checkout automation, queue skipping, CAPTCHA solving, scraped pricing. That software is aimed at winning the buy, and it tends to break terms of service to do it. The part nobody builds is the boring one, which is knowing whether you actually made money.",
        "SoleLedger tracks a pair from purchase to payout and tells you the truth about the margin. It follows a sneaker through inventory, listing, and sale, calculates landed cost and net payout deterministically, and surfaces per-user dashboard totals. Buying stays entirely in human hands, on purpose."
      ]
    },
    {
      heading: "Money never touches a float",
      paragraphs: [
        "Every monetary value in the system is a fixed-precision decimal quantized to cents with half-up rounding, never a binary float. This is not pedantry. Floating point cannot represent ten cents exactly, so a resale ledger built on floats drifts by a cent here and there and eventually reports a profit that does not reconcile with a bank statement.",
        "The calculation chain is intentionally dull and testable: landed cost is purchase price plus tax, shipping, and other costs; payout is price minus marketplace fees, processing, and shipping; profit is payout minus landed cost. ROI raises rather than dividing by zero when landed cost is zero, because a silent infinity in a financial report is worse than a crash."
      ],
      file: "backend/app/services/calculations.py",
      code: `from decimal import ROUND_HALF_UP, Decimal

CENT = Decimal("0.01")


def money(value: Decimal | int | str) -> Decimal:
    return Decimal(value).quantize(CENT, rounding=ROUND_HALF_UP)


def calculate_payout(
    price: Decimal,
    marketplace_fees: Decimal = Decimal("0"),
    payment_processing: Decimal = Decimal("0"),
    shipping: Decimal = Decimal("0"),
) -> Decimal:
    return money(price - marketplace_fees - payment_processing - shipping)


def calculate_roi(profit: Decimal, landed_cost: Decimal) -> Decimal:
    if landed_cost == 0:
        raise ValueError("Landed cost must be greater than zero")
    return (profit / landed_cost).quantize(Decimal("0.0001"))`
    },
    {
      heading: "Solving for the floor instead of adding to it",
      paragraphs: [
        "The most useful number in the whole app is the floor price: the lowest you can list a pair for and still clear cost, fees, and the profit you said you needed. The naive version adds the fees on top of your cost, and it is wrong every time. Marketplace fees are a percentage of the final sale price, so the fee depends on the price you are still trying to find. It is a small algebra problem, not an addition, and solving it gives p = (cost + profit + flat + shipping) / (1 - rate).",
        "Getting that backwards is exactly how a resale spreadsheet quietly loses money: you list at what looks like a safe margin, the platform takes its cut of the higher number, and the pair sells for less than it cost. The floor is computed once and then treated as immovable.",
        "When the market sits below that floor, the agent will not touch the price. It returns a needs_approval action with a plain sentence saying that selling at market would lose money, and it stops. An agent that can talk itself into a loss to make a sale is not an agent I want running unattended, so the one thing it cannot do on its own is go below the floor."
      ],
      file: "backend/app/services/seller_agent.py",
      code: `def floor_price(
    landed_cost: Decimal, minimum_profit: Decimal, schedule: FeeSchedule | None
) -> Decimal:
    """Lowest price that still clears cost, fees, and the minimum profit.

    Fees are a cut of the sale price, so the floor has to be solved for rather
    than added on: p = (cost + profit + flat + shipping) / (1 - rate).
    """
    flat = (schedule.flat_fee if schedule else Decimal("0")) + (
        schedule.shipping_cost if schedule else Decimal("0")
    )
    rate = (schedule.percentage_fee / Decimal("100")) if schedule else Decimal("0")
    if rate >= 1:
        rate = Decimal("0")
    return _money((landed_cost + minimum_profit + flat) / (Decimal("1") - rate))`
    },
    {
      heading: "Reading the market without chasing it",
      paragraphs: [
        "Market data is noisy, and a pricing loop that reacts to every wobble just churns your listing and teaches you nothing. Three rules keep it calm. The agent reads a 60-day window of snapshots split in half, weighting the recent 30 days at 0.7 so the price follows current conditions without forgetting the trend it came from. It leaves the price alone when it is already within two percent of the weighted ask, because a fifty cent correction is not worth relisting over. And a price gets an agreed run, 14 days by default, before repricing is even considered; only after that does the agent undercut the weighted ask by one percent, since shaving the ask is what actually moves a pair.",
        "Every suggestion comes back as one of hold, lower, raise, needs_approval, or no_data, each with a written reason. The no_data case is deliberate: with no snapshots for that size, the agent says so and suggests nothing, rather than inventing a price from a neighboring size.",
        "Settings are per style with an account-wide fallback, which surfaced a SQL trap worth remembering. A query for a specific style OR the default cannot use IN with a NULL in the list, because IN never matches NULL in SQL. The account-wide row has to be asked for explicitly with IS NULL, and the comment sits in the code so the next person does not rediscover it at midnight."
      ]
    },
    {
      heading: "Recommendations that show their work",
      paragraphs: [
        "Alongside pricing, the app scores size-level buying opportunities, and the scoring is deterministic rather than predictive. It reads only stored market snapshots, the owner's real landed costs, and that owner's fee schedule, then persists a score with confidence, risk, liquidity, margin, and bear, base, and bull net-profit scenarios. Each recommendation carries human-readable evidence explaining why it scored the way it did.",
        "Stale or incomplete data lowers confidence or makes an opportunity ineligible instead of being quietly interpolated over, and snapshots expose a 24-hour stale flag so old data cannot masquerade as current. Backtesting replays bounded historical snapshots through the exact same scoring rules and reports sample and eligibility metrics. It does not claim future performance, because a deterministic score describes the data you have rather than the market you are about to meet."
      ]
    },
    {
      heading: "Connecting to StockX carefully",
      paragraphs: [
        "Live market data comes from StockX through OAuth, and the token handling is where I spent the most care. Access and refresh tokens are encrypted before they are stored, never written to logs, and refreshed five minutes ahead of expiry so a job never fires with a token that dies mid-request.",
        "Two edge cases were worth handling explicitly. A brand new connection that arrives without a refresh token is rejected as an authorization failure rather than saved, because that connection can never be renewed and would fail silently days later. Conversely, StockX does not rotate refresh tokens, so a refresh response with no new token keeps the stored one instead of overwriting it with nothing. Both are the kind of thing that works fine in testing and breaks a week into production.",
        "The scheduler that keeps market data current is split so it can be tested. The function that decides which accounts are due and refreshes them is a plain function over a database session, callable by hand from a test, while the loop above it only decides when to call it. The loop wakes every 60 seconds, but each account still runs no more often than its own configured interval."
      ]
    },
    {
      heading: "The lines this project will not cross",
      paragraphs: [
        "Every phase was built against an explicit list of things the software refuses to do. This is the part of the design I care most about, because in this particular domain the easy version of the product is the unethical one.",
        "Market URLs are stored as HTTPS links and rendered for a human to click; the backend never fetches them and there is no server-side proxy. Alert previews are deterministic and completely inert: generating one never sends an email, SMS, push, or calendar event, and never touches a retailer.",
        "The rule I wrote down before adding any language model to this: retrieved posts, listings, and page text are untrusted content, not instructions. A resale forum is exactly the kind of place someone would post text designed to be read by an automated buyer, so future agents get source-isolated text with no secrets in context, a bounded tool allowlist with a call ceiling, structured output validated against a schema, deterministic policy checks after the model rather than inside it, and no ambient permission to write to a marketplace. Any claim pulled from community data keeps its source, timestamp, and contradicting evidence attached instead of being flattened into a fact."
      ],
      bullets: [
        "No checkout automation. Purchasing is human-in-the-loop by design",
        "No CAPTCHA or queue bypass",
        "No prohibited scraping and no private marketplace APIs",
        "Live data requires an explicitly approved adapter behind a typed provider boundary",
        "Model output is never trusted with a marketplace write"
      ]
    },
    {
      heading: "Stack, security, and the gaps I did not paper over",
      paragraphs: [
        "The backend is FastAPI with SQLAlchemy, Alembic, and PostgreSQL, with Pydantic schemas defining the API contract so ORM models are never returned directly. The frontend is Next.js, React, TypeScript, and Tailwind. The whole stack comes up under Docker Compose.",
        "Passwords are hashed with Argon2 and never logged. Short-lived JWTs live in HTTP-only SameSite cookies, paired with a readable CSRF cookie that has to match an X-CSRF-Token header on unsafe requests, and the frontend never puts a token in local storage. CORS is credentialed only for explicitly configured origins, and every query and mutation is scoped to the authenticated owner, so cross-user aggregation is not reachable even by accident. Playwright drives the full registration through sale workflow against the real Compose stack on desktop and mobile, alongside pytest, ruff, and typecheck.",
        "The security doc also lists what is missing: no MFA or passkeys yet, no production rate limiting, no audit-event UI, no backup automation or container scanning. Writing those down as gaps rather than leaving them unmentioned is the point. A README that only lists strengths reads like a product page, and the whole project is an argument for knowing exactly what you have."
      ]
    }
  ],
  makerportfolio: [
    {
      heading: "From Flask to Next.js",
      paragraphs: [
        "The first version of this site was a Flask app I containerized with Docker and hosted on AWS. It taught me the parts of web work that never show up in a tutorial: routing, deployment, and the ongoing cost of keeping a personal site maintainable once the novelty wears off.",
        "The current site is a rebuild on Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS. I collapsed a sprawl of thin routes into three that earn their place (/, /projects, and /contact), with redirects from the old routes so nothing breaks."
      ]
    },
    {
      heading: "A gear you can actually turn",
      paragraphs: [
        "The homepage centerpiece is a 14-tooth spur gear rendered as a 3D wireframe on a canvas, and it is not a model file or a library scene. The tooth profile is generated from a tooth count and tip, root, and bore radii, extruded along Z, and projected to 2D by hand with rotation matrices and a perspective divide. No Three.js, no dependencies, a few hundred lines total.",
        "Drag it and it spins with your pointer, keeps going on release, and decays back into a slow idle rotation. Edges further from the camera are drawn fainter, which is what sells the depth. It reads its two colors from the same CSS variables as the rest of the site and watches for theme changes, so it recolors instantly in light and dark mode.",
        "The render loop is disciplined about when it runs at all. It pauses when the tab is hidden, pauses when the gear scrolls offscreen, respects devicePixelRatio, and under prefers-reduced-motion it renders a static gear that you can still drag."
      ],
      file: "components/hero-centerpiece.tsx",
      code: `const TEETH = 14;
const R_TIP = 1;      // outer radius, tooth tip
const R_ROOT = 0.82;  // valley between teeth
const R_BORE = 0.34;  // center bore
const DEPTH = 0.3;    // extrusion along Z

// Perspective projection: divide by distance from the camera.
const CAM = 3.4;
const project = ([x, y, z]) => {
  const scale = CAM / (CAM - z);
  return [x * scale, y * scale, z];
};

// Inertia decaying back to the idle spin, one line.
ryVel += (BASE_SPIN - ryVel) * 0.03;`
    },
    {
      heading: "A terminal that answers questions",
      paragraphs: [
        "The empty half of the hero used to be a chip-shaped card with buttons that duplicated the navigation. It is now a working terminal. Type help and it lists commands; type robotics, assistive, aiandml, embedded, or web and it prints a short account of what I actually do in that area. whyexist explains the site, and whoami is what you would expect.",
        "It boots once per session with a short typing animation, skipped entirely under prefers-reduced-motion, and it deliberately does not route anywhere. An earlier version accepted paths like /projects/veridex and navigated for you, which was a fun trick that quietly competed with the navigation bar. Cutting it made both jobs clearer."
      ]
    },
    {
      heading: "Warm glass over a drafting table",
      paragraphs: [
        "Every card is a frosted glass panel: a backdrop-filter surface with a translucent fill, layered over a faint drafting grid that stays visible through it. Nothing is an opaque box sitting on a background.",
        "Light mode used to be near-white, which meant white cards on a white page and no separation at all. It is now a drafting table: a Half Haystack paper background with cream panels floating above it, sepia grid lines instead of cool gray, and warm shadows, because a navy shadow on warm paper reads as dirt. Dark mode stays on the VS Code Dark+ palette, and both are the same HSL CSS variables with class-based dark mode, which is why code blocks like this one feel native on the page.",
        "One bug was worth the whole exercise. The glass class set position: relative and lived outside Tailwind's component layer, so it silently beat any position utility applied to it. Elements marked fixed were quietly rendering in normal flow. Moving the rule into @layer components let the utilities win again and fixed several unrelated layout mysteries at once."
      ],
      file: "app/globals.css",
      code: `/* In the components layer so Tailwind utilities (fixed, ...) can override. */
@layer components {
  .glass-panel {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.5);
    /* Cream fill, translucent enough that the grid frosts through. */
    background: linear-gradient(
      145deg,
      rgba(240, 232, 219, 0.6),
      rgba(236, 229, 216, 0.42)
    );
    backdrop-filter: blur(6px) saturate(1.65) brightness(1.12);
  }
}`
    },
    {
      heading: "Keeping it lean",
      paragraphs: [
        "The rebuild was mostly deletion. I dropped framer-motion and a pile of old hero, bento, and card components in favor of writing the small amount of code they were hiding. Every route prerenders statically, so there is nothing to spin up and nothing to pay for at request time.",
        "The deleting never really stopped. A scroll-driven SVG gear train and a glowing wire that traced your scroll position both came out once they turned out to be motion competing with the content. The terminal shed its collapse, popout, and floating-button modes after I watched it jump around the page, and it is better as one panel that stays where you put it.",
        "The rule I keep coming back to: subtract before you add. Less code is less to explain at 3am."
      ]
    }
  ],
  "buddy-ai": [
    {
      heading: "From Dynamic Island clone to desktop buddy",
      paragraphs: [
        "This started as a Windows take on Apple's Dynamic Island and outgrew the reference. A pill that mirrors notifications is a demo; what I actually wanted was a companion. So the compact form became a small liquid face with mint and coral styling and expressive states, sitting in a transparent, always-reachable Electron window that remembers its position and clamps correctly across multiple monitors.",
        "Click it and the face expands into a 420x560 assistant panel: chat, media controls with live track info, volume, battery, one-shot screenshot attachment, settings, and a session usage meter. The compact face stays the identity; everything practical lives in the one expanded panel."
      ]
    },
    {
      heading: "Local first, model second",
      paragraphs: [
        "The cheapest and fastest model call is the one you never make. Routine desktop commands like play, pause, skip, volume, mute, battery, and opening common sites are parsed and executed locally before anything reaches the API, so they cost zero tokens and respond instantly.",
        "When a request does need the model, it goes through a bounded conversation history and strict tool schemas on Cerebras. The default text model is gpt-oss-120b because it is the lowest-priced capable option, vision runs only for explicitly shared screenshots, and tool schemas are selected per prompt to keep input tokens down. Every session has a visible, configurable request ceiling, and every reply shows which model produced it."
      ],
      file: "src/bridge/assistant-tools.js",
      code: `async function tryHandleLocal(prompt) {
  const normalized = normalize(prompt);

  let match = normalized.match(
    /^(?:set\\s+)?(?:the\\s+)?volume(?:\\s+to)?\\s+(\\d{1,3})\\s*%?$/
  );
  if (match) {
    const level = Math.min(100, Number(match[1]));
    const outcome = await execute('set_volume', { level });
    return localResponse(\`Volume set to \${level}%.\`, outcome);
  }

  if (/^(play|resume)(?:\\s+(?:my\\s+)?(?:music|media|song|spotify))?$/.test(normalized)) {
    const outcome = await execute('control_media', { action: 'play' });
    return localResponse('Playing your current media session.', outcome);
  }
  // ...pause, skip, mute, battery, and common sites route the same way,
  // so routine commands never spend a model token
}`
    },
    {
      heading: "Permissions as a design language",
      paragraphs: [
        "An assistant that can see your screen and act on your machine has to earn that access. Every capability sits behind allow-once, remember, or deny dialogs. Screen capture asks every single time and is never retained. Web access is opt-in, read-only, and hardened against SSRF. API keys and OAuth tokens are encrypted with Electron safeStorage rather than sitting in a config file.",
        "Just as important is what the assistant cannot do: there is no purchase, subscription, billing, arbitrary shell, or arbitrary filesystem capability, and those categories stay blocked even when tools arrive through MCP servers. When a Windows bridge is unavailable, the app says so honestly instead of faking state."
      ]
    },
    {
      heading: "MCP integrations and real automation",
      paragraphs: [
        "The assistant speaks Model Context Protocol through persistent stdio sessions: configured servers are discovered, their tools validated, and calls executed exactly as confirmed. The model never controls which server commands run. A catalog covers Playwright browser automation, scoped file access, memory, planning, PDF reading, GitHub, and Gmail, plus custom entries.",
        "Local profiles keep it multi-user without a database: each profile has isolated preferences, encrypted credentials, permissions, model settings, request caps, and MCP config. Google sign-in uses browser OAuth with PKCE and a temporary loopback callback, so no password ever touches the app. Read and navigation steps can run under a remembered permission, while anything that writes, sends, or deletes still confirms first."
      ],
      bullets: [
        "Playwright smoke test: initialized, navigated, and returned an accessibility snapshot",
        "Windows npx shims resolved through Node while keeping shell execution disabled",
        "Account-changing MCP calls always confirm; billing actions are blocked outright"
      ]
    },
    {
      heading: "Testing without burning credits",
      paragraphs: [
        "The rule for the test suite: deterministic tests can never call the live API. Thirty tests cover model routing, the tool loop, permission persistence, encrypted settings, web hardening, and the MCP protocol against mocked responses and fake transports. A separate screenshot harness renders the compact face, expanded panel, and settings states offscreen to catch layout regressions.",
        "Real Windows behavior gets verified through read-only smoke tests: media, battery, and volume bridges emitting genuine payloads without changing anything. Next on the list are opt-in push-to-talk with local speech-to-text, text-to-speech with an interrupt control, and durable memory with per-memory review and delete, each waiting on an explicit privacy design rather than shipping first and apologizing later."
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
