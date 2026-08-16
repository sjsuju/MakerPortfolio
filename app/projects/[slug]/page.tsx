import { ArrowLeft } from "lucide-react";
import Image from "next/image";
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
  image?: { src: string; alt: string; caption?: string; width: number; height: number };
  accent?: boolean;
};

// ponytail: presentational only, no highlighting lib. Monochrome code, VS Code-style chrome.
function CodeWindow({ file, code }: { file: string; code: string }) {
  return (
    <div className="code-window mt-5 overflow-hidden rounded-lg border border-border bg-secondary">
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
  "ftc-23918": [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "I did not join a robotics team, I started one, in 2023, because I wanted a platform for myself and for about ten other kids who had never touched robotics before. I have been the founder, captain, and design lead every season since.",
        "It was never just a competition to me. It was a way to bring STEM into my own community on my own terms, with more freedom over what we built and how we built it than joining an existing team would have given me. I wanted to take my own thinking and put it into something bigger than myself.",
        "The team now sits under the Curious Neurons Foundation, a non-profit I founded in 2025 for access to technology and education in underprivileged communities. The robotics program was the first piece of that, not a side effect of it."
      ]
    },
    {
      heading: "Design across the whole robot",
      paragraphs: [
        "Leading a robot end to end means the same person who drew the intake in CAD is also the one redesigning it in the pit twenty minutes before the next match. Across intake, sorting, shooter, and drivebase, most seasons have looked like the same loop: design something that should work, watch the field prove it wrong, and fix it fast enough that the next match is better than the last.",
        "Running that loop with a team of first-timers means the redesign has to be explainable, not just correct. If only I understand why a change worked, the team has not actually learned anything from it."
      ]
    },
    {
      heading: "From a regional Inspire Award to the World Championship",
      paragraphs: [
        "In the DECODE season we won the Inspire Award, FTC's top honor, at both the regional and state levels, and advanced to the FIRST Championship as Oregon's top-placed team.",
        "Inspire is not a build award. It is judged on the whole program: engineering practice, outreach, and how well the team can explain its own thinking, which is the part I actually care most about proving."
      ]
    }
  ],
  "emg-prosthetic-hand": [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "In seventh grade I shattered my right wrist, my dominant hand, badly enough that for a while I effectively did not have a working hand. It got me thinking about the people who do not have one at all, and how good the prosthetics available to them actually are.",
        "The research was worse than I expected. Something like 100 million people worldwide need a prosthetic limb, and by most estimates around 80 percent of them do not get access to an advanced one. A lot of the people who do get a device end up abandoning it anyway, because it is not intuitive, does not give them much dexterity, or it is just too expensive. So the target was never just \"a prosthetic hand.\" It was one that is smart, cheap, and runs its inference locally instead of depending on infrastructure a lot of the people who need it do not have.",
        "I brought in two of my closest friends to build it with me. Prathamesh Kulkarni led the hardware, Misha Arturov owned implementation and testing, and I led the ML side and the outreach.",
        "The activation-pattern idea came directly out of the abandonment problem. Instead of wiring one sensor to one motion, the model reads the whole array as a pattern, so dexterity scales with however much residual muscle someone actually has left, anywhere on the body. There is a real cost: more sensors means a sharper learning curve for the user. But everyone we tested it on could do more with it than with a traditional prosthetic, and learned to do it faster.",
        "Long term I want to open source the whole thing once we have a big enough dataset to properly tune the self-adjusting thresholds and feedback loops. Every part is designed to be 3D printed individually, so a broken finger gets reprinted and swapped instead of the whole hand getting shipped off for weeks of repair."
      ]
    },
    {
      heading: "Reading the muscle directly",
      paragraphs: [
        "Cheap prosthetic hands are usually driven by a switch, an app, or a shoulder harness. All of those ask you to operate the hand. The signal you actually want is already sitting in the forearm: every time someone tries to close their hand, the muscle fires, whether or not the hand is there to respond.",
        "So the hand reads that signal. MyoWare 2.0 sensors sit on the forearm, an Arduino Nano ESP32 samples them, a Random Forest works out which gesture the muscle is making, and a PCA9685 drives five servos that pull the fingers through tendon strings. The whole prototype came to $213.61 in parts. A commercial myoelectric hand starts around $20,000, so the interesting question is not whether we matched one, it is how much of the function survives at one percent of the cost."
      ],
      image: {
        src: "/projects/emg/prototype.jpg",
        alt: "The assembled 3D-printed prosthetic hand next to its breadboard, ESP32, PCA9685 driver, and servo wiring harness.",
        caption: "The assembled prototype. Five MG90S servos in the forearm pull the fingers through tendon strings; the control electronics still live outside the arm.",
        width: 977,
        height: 1295
      }
    },
    {
      heading: "Activation patterns, not one sensor per finger",
      paragraphs: [
        "The usual myoelectric wiring is one sensor to one output: this muscle site opens the hand, that one closes it. It is simple and it caps you immediately. Every new motion needs a new clean muscle site, and most amputees do not have a row of conveniently separated ones waiting.",
        "We treat the sensor array as a single pattern instead. No individual sensor owns a finger. The classifier looks at how all of them move together, and a gesture is a shape across the whole array rather than a threshold on one channel. That is what makes point and clamp separable when each sensor alone reads nearly identical: the difference is not amplitude anywhere, it is whether the sites fire together or against each other.",
        "Two things fall out of that. Sensor count becomes a dial rather than a design constraint. Any additional site that reads distinguishably from its neighbors adds dimensions to the pattern space, so dexterity scales with sensors instead of being fixed at build time. And the sites do not have to be the anatomically correct ones. Whatever residual muscle a user still controls, anywhere on the body, can become part of the pattern, because the model only needs the signals to be repeatable, not to correspond to the motion being made.",
        "Practically, that means a user with an unusual amputation is a calibration problem instead of a redesign problem."
      ],
      image: {
        src: "/projects/emg/electrodes.jpg",
        alt: "MyoWare EMG sensors adhered to a forearm with medical electrodes and jumper wiring.",
        caption: "Electrode placement on the forearm. Sites are chosen for signal separability from each other, not for mapping onto specific fingers.",
        width: 1080,
        height: 1920
      }
    },
    {
      heading: "Sampling and windows",
      paragraphs: [
        "The board streams both sensors at 100 Hz over serial at 115200 baud. Python buffers that into 100-sample windows stepping forward 50 samples at a time, so every decision is based on a full second of signal and the windows overlap each other by half. A prediction comes out every 0.2 seconds.",
        "The constant that caused me the most grief is the ADC width. An Arduino Nano ESP32 reads 12 bits, so 0 to 4095, while an AVR Nano tops out at 1023. The same contraction produces roughly four times the number depending on which board you plugged in, and a model trained on one is worthless on the other. Nothing warns you. Switching boards means re-recording everything and retraining.",
        "There is a related trap on the sensor output. The MyoWare has RAW, RECT, and ENV pins, and only ENV works at this sample rate. The other two alias at 100 Hz and you get garbage that still looks plausible on a plot."
      ],
      image: {
        src: "/projects/emg/raw-signal.png",
        alt: "Line chart of three EMG sensor channels over about 18 seconds, showing spiky bursts against a near-zero baseline.",
        caption: "Raw capture from three sites. Averaging a window of this tells you almost nothing, which is why every window becomes a feature vector before the model sees it.",
        width: 2560,
        height: 1440
      },
      file: "hosailc/train_model_2sensor.py",
      code: `SENSOR_COLUMNS = ["sensor1", "sensor2"]

# 100 samples at 100 Hz = 1.0 s of signal per decision.
# Step 50 means windows overlap by half.
WINDOW_SIZE = 100
STEP_SIZE = 50
SAMPLE_RATE = 100

# Sensor 1 on A0, sensor 2 on A1, using the MyoWare ENV output.
# RAW and RECT alias at this sample rate.
# An AVR Nano would read 0-1023 here instead of 0-4095, which is
# why data does not transfer between boards.`
    },
    {
      heading: "Nineteen features per window",
      paragraphs: [
        "Raw EMG is noisy and sits roughly symmetric around a baseline, so averaging a window tells you almost nothing. Each window becomes 19 features instead. Every sensor gives six time-domain statistics describing how hard the muscle is working, plus the power in three FFT frequency bands. The frequency content is worth having because fatigue and contraction type shift the spectrum even when the raw amplitude looks the same.",
        "The last feature is the correlation between the two sensors, and it does more work than I expected when I added it. Pointing and clamping can look almost identical on either sensor by itself. What separates them is whether the two muscles fire together or against each other. A flat signal leaves that correlation undefined, so NaNs get scrubbed before anything reaches the model.",
        "Classification is a Random Forest, 200 trees, with balanced class weights, sorting windows into open, clamp, and point. I picked a forest over a neural network because it trains in seconds on a laptop from a few minutes of recorded gestures and runs without a GPU. It also gives class probabilities that are actually usable, which the next section depends on."
      ],
      file: "hosailc/train_model_2sensor.py",
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
      heading: "The confidence gate",
      paragraphs: [
        "Even a good classifier is wrong sometimes, and a hand attached to a wrong answer twitches. So predicting and moving are separate decisions. Any window the model is less than 60 percent sure about is treated as no answer at all, and the hand holds whatever pose it is already in. It never guesses.",
        "On top of that, a gesture has to win three windows in a row before the servos move. That costs about 0.6 seconds of extra lag, which you can feel, and it buys immunity to a single bad window. Both numbers sit at the top of the main program with a note about which way to turn them: sluggish means lower, twitchy means raise. Tuning those against a real arm is not something I could do from the numbers alone."
      ],
      file: "ilcProgram.py",
      code: `# A window below this is treated as "no idea", and the hand holds its
# current pose. Lower it if the hand feels unresponsive; raise it if it
# acts on noise.
MIN_CONFIDENCE = 0.60

# Consecutive agreeing windows before the servos move. Costs
# STABLE_WINDOWS_REQUIRED * PREDICT_INTERVAL_SECONDS of extra lag, and
# buys immunity to a single bad window. 1 disables the gate.
STABLE_WINDOWS_REQUIRED = 3`
    },
    {
      heading: "Fatigue is the failure mode, and it does not look like one",
      paragraphs: [
        "Hold a contraction for twenty minutes and the same intended gesture comes out quieter. Amplitude falls, and because almost every feature is derived from amplitude, the entire feature vector drifts out of the distribution the forest was trained on. The obvious guess is that the model gets uncertain and the confidence gate catches it. That is not what happens.",
        "At 12 percent of starting amplitude, 97 percent of windows still clear the confidence threshold and get acted on, while usable accuracy has fallen to 73.5 percent. The model is not unsure. It is confidently wrong, and confidence gating is exactly the wrong instrument for that. We tested the intuitive fix too, lowering the threshold in proportion to the decay, and kept it in the file as a negative control: it recovers 1.1 points. You cannot threshold your way out of confident-and-wrong.",
        "What works is treating decay as a measurable quantity rather than noise. The system tracks how far amplitude has fallen against the session's own baseline and scales the signal back toward the trained distribution, so the forest keeps seeing features in the range it learned. Two guards make that safe. A deadband at 85 percent means mild decay is left alone, since correcting small drift is really just amplifying noise, and adding that guard was worth 8 points on its own. And the decision rule switches from a moving confidence threshold to a fixed margin floor: the winning class has to beat the runner-up by a set margin. A threshold moves as the signal degrades. A margin between two classes does not, so sensitivity comes back without false confidence coming with it.",
        "Together that is 15.7 points of usable accuracy at heavy fatigue. The honest caveat is that this is validated leave-one-recording-out across 14 recordings with fatigue simulated as an amplitude ramp, and it is not in the live control loop yet. Real fatigue also shifts the frequency content, not just the amplitude, so the simulation is optimistic in a way I have not measured."
      ],
      image: {
        src: "/projects/emg/fatigue.png",
        alt: "Slide comparing usable accuracy across amplitude decay for three strategies: gain plus threshold stays near 90 percent while fixed and threshold-only fall to about 74 percent.",
        caption: "Usable accuracy against remaining amplitude. Gain correction with a margin floor holds where both the fixed pipeline and threshold-only adjustment collapse.",
        width: 1600,
        height: 900
      }
    },
    {
      heading: "What the accuracy actually is",
      paragraphs: [
        "The training script reports about 99 percent, and that number is not real. Windows overlap by half, so a random train/test split drops nearly identical windows on both sides and the model gets graded partly on data it already saw. It runs roughly 12 points high.",
        "The honest version holds out a whole recording at a time and retrains, which is the closest offline stand-in for a session the model has never seen. That gives 96.0 percent on average across folds, with the worst fold at 90.6 percent. Both scripts still exist, and the evaluation one has a note in its docstring saying to use its number in write-ups, mostly so future me does not quote the flattering one by accident.",
        "The interesting part is which gesture is worst, because it keeps moving. An earlier evaluation put the mean at 87 percent with point as the weak class at 74.7 percent recall, since point reads as open or clamp when the signal is ambiguous. The fix was boring: record more point data. Point is now at 100 percent and the overall mean went to 96. That promoted clamp to worst class at 88 percent, and clamp currently has three recordings against open's six and point's five. So the next improvement is already obvious, and it is more clamp recordings."
      ],
      image: {
        src: "/projects/emg/log-loss.png",
        alt: "Training and validation cross-entropy loss against number of decision trees, both flattening well before 200 trees.",
        caption: "Validation loss settles around 50 trees. Two hundred is not doing extra work, it is buying stability in the class probabilities the confidence gate reads.",
        width: 1280,
        height: 720
      },
      file: "evaluate_2sensor.py output",
      code: `Running 3 folds, holding out one recording per gesture each time.
Window 100 samples, step 50, 1.0s of signal per decision.

  fold 1: 100.0%   (train 429 windows, test 117)
  fold 2:  90.6%   (train 429 windows, test 117)
  fold 3:  97.4%   (train 429 windows, test 117)

  mean 96.0%   min 90.6%   max 100.0%

Pooled confusion matrix (rows = truth, columns = predicted)
            open   clamp   point
open         117       0       0
clamp          9     103       5
point          0       0     117

Per-gesture recall:
  open    100.0%
  clamp    88.0%
  point   100.0%`
    },
    {
      heading: "Every build needs different numbers",
      paragraphs: [
        "Each gesture is a set of five servo angles, and those numbers change every time the hand gets rebuilt, because tendon string tension is never the same twice. There is nothing to hard-code once and forget. A separate script nudges individual servos so you can find the angles on the actual hand, and point is literally clamp with the pointer finger left at zero.",
        "Those angles get tuned by watching, not by calculating. The pointer went from 95 to 105 degrees on the clamp pose because at 95 it was not curling far enough to look closed. That is not a number any model could have told me.",
        "What I want next is more clamp recordings to fix the weak class, then testing electrode placement on other people's forearms, since so far the classifier has only ever seen mine. There is also a fallback path that runs on plain thresholds with no model at all, which is useful when I want to check whether a problem is in the hardware or in the classifier.",
        "One more thing that lives at the top of the runbook: only one program can hold the serial port at a time. It is small and it costs you an hour if you forget, and I did."
      ],
      file: "ilcProgram.py",
      code: `# Finger order matches the servo scripts:
# 0 thumb, 1 pointer, 2 middle, 3 ring, 4 pinky
#            thumb, pointer, middle, ring, pinky
OPEN =      [    0,       0,      0,    0,     0]
CLAMP =     [   85,     105,     75,   90,    95]
POINT =     [   85,       0,     75,   90,    95]  # pointer held out

GESTURE_ANGLES = {
    "open": OPEN,
    "clamp": CLAMP,
    "point": POINT,
}`
    },
    {
      heading: "What if the muscle is not the best place to listen?",
      accent: true,
      paragraphs: [
        "Everything above works around one inherited assumption: that the signal has to be read off a muscle. That assumption is what puts electrodes on skin, and skin is where all the hard problems live. Electrodes shift. Sweat changes impedance. Muscles fatigue. And a user with very little residual muscle gets very little to work with, no matter how good the classifier is.",
        "The intent, though, does not originate in the arm. It originates upstream, and the muscle is only the last place it becomes measurable. If you can read it earlier, most of the failure modes on this page stop being your problem. Fatigue is a property of muscle, not of intent. Electrode shift is a property of a skin interface that no longer needs to exist on the limb.",
        "So the version I actually want to build reads EEG instead. The pattern-based approach transfers directly, because nothing in it assumes the channels are muscles. It only assumes the channels are repeatable and distinguishable from each other, which is exactly the property a scalp array has. Same feature extraction, same forest, different source. That also strips the electronics off the prosthetic itself: the hand goes back to being servos and a receiver, and everything heavy moves to a headset that is not hanging off the end of an arm.",
        "The obvious catch is that inferring motor intent from EEG is a substantially harder classification problem than reading a contracting forearm, and non-invasive EEG has a much worse signal-to-noise ratio than surface EMG. I do not think that is a reason not to try it. It is a reason the model has to be much better than the one running today, and knowing which of the two is the bottleneck is worth finding out."
      ]
    }
  ],
  soleledger: [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "I started reselling sneakers freshman year purely because I love sneakers, not because I had a business plan. Buying and reselling let me actually experience pairs I could not afford to just keep.",
        "What I did not have was the business side. I was bleeding margin without noticing, and as a solo seller juggling a few hundred pairs on top of a full school schedule, I could not analyze the market fast enough to keep up. I was skipping days to study pricing by hand.",
        "SoleLedger started as the tool that fixed that for me. It also turned into a good place to get real experience with AI agents, pulling market data and running it through a sentiment pass that summarizes how different audiences might react to a shoe based on what is happening around it, which ended up teaching me as much as it saved me time."
      ]
    },
    {
      heading: "Why this is a ledger",
      paragraphs: [
        "Almost all sneaker resale software is built to win the buy: checkout automation, queue skipping, CAPTCHA solving, scraped pricing. Most of it breaks somebody's terms of service to get there. Very little of it answers the duller question of whether the pair you bought last month actually made you any money.",
        "SoleLedger does that part. It tracks a pair from purchase through inventory, listing, and sale, works out landed cost and net payout, and shows you your own totals on a dashboard. Deciding what to buy is left to you."
      ]
    },
    {
      heading: "Money math",
      paragraphs: [
        "Every monetary value is a fixed-precision decimal quantized to cents with half-up rounding. None of it is a binary float. Floating point cannot represent ten cents exactly, so a ledger built on floats drifts a cent at a time until the profit it reports stops matching your bank statement.",
        "The calculations themselves are boring, which is the idea, because boring is testable. Landed cost is the purchase price plus tax, shipping, and anything else you paid. Payout is the sale price minus marketplace fees, processing, and shipping. Profit is one minus the other. The only interesting case is ROI when landed cost is zero: it raises instead of dividing, since a financial report should not quietly hand you an infinity."
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
      heading: "The floor price",
      paragraphs: [
        "The number the whole pricing side leans on is the floor: the lowest you can list a pair for and still clear your cost, the platform's fees, and whatever profit you told it you needed. The obvious way to get there is to add the fees on top of your cost, and that is wrong every time. Marketplace fees are a percentage of the final sale price, so the fee depends on the number you are still solving for. It works out to p = (cost + profit + flat + shipping) / (1 - rate).",
        "This is how a resale spreadsheet loses money without anyone noticing. You list at what looks like a comfortable margin, the platform takes its cut of the larger number, and the pair ends up selling for less than you paid.",
        "If the market sits below the floor, the pricing agent stops. It returns a needs_approval action with a sentence explaining that selling at market would lose money, and then it waits for you. I did not want something that could reason its way into a loss while I was asleep, so going below the floor is the one move it cannot make on its own."
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
      heading: "When the agent reprices",
      paragraphs: [
        "Market data is noisy, and something that reacts to every wobble will just churn your listing. So the agent reads a 60-day window of snapshots split down the middle, weighting the recent 30 days at 0.7 so the suggested price follows current conditions without forgetting where it came from. If the current price is already within two percent of that weighted ask, it stays put. A fifty cent correction is not worth relisting over.",
        "A price also gets a run before anything changes, 14 days by default. Only after that does the agent undercut the weighted ask by one percent, which is usually what it takes to actually move a pair.",
        "Suggestions come back as hold, lower, raise, needs_approval, or no_data, each with a written reason. That last one exists so the agent can admit it has nothing useful to say. With no snapshots for a given size it suggests nothing at all, instead of guessing a price off a neighboring size.",
        "Settings are per style with an account-wide fallback, which is where I hit a SQL trap I had not seen before. Querying for a specific style or the default fails if you put NULL in an IN list, because IN never matches NULL. The account-wide row has to be asked for separately with IS NULL. That comment is now in the code so the next person does not lose an evening to it."
      ]
    },
    {
      heading: "Scoring buying opportunities",
      paragraphs: [
        "The app also scores size-level buying opportunities, and the scoring is arithmetic rather than prediction. It reads stored market snapshots, your actual landed costs, and your fee schedule, then saves a score along with confidence, risk, liquidity, margin, and bear, base, and bull net-profit scenarios. Every recommendation keeps a plain-English explanation of how it got there.",
        "When the underlying data is stale or incomplete, that lowers the confidence or drops the opportunity entirely. Nothing gets interpolated to fill a hole. Snapshots carry a 24-hour stale flag so old numbers cannot pass themselves off as current.",
        "Backtesting replays a bounded set of historical snapshots through the same scoring rules and reports how many samples were eligible. It does not tell you what will happen next. The score only ever describes data that already exists."
      ]
    },
    {
      heading: "The StockX connection",
      paragraphs: [
        "Live market data comes from StockX over OAuth, and the token handling took more care than the rest of the integration combined. Access and refresh tokens are encrypted before storage, kept out of logs, and refreshed five minutes ahead of expiry so a scheduled job never fires with a token that dies halfway through.",
        "Two cases needed explicit handling. A new connection that arrives without a refresh token gets rejected as an authorization failure instead of being saved, because it could never be renewed and would fail days later for no visible reason. Going the other way, StockX does not rotate refresh tokens, so a refresh response that contains no new token keeps the stored one rather than overwriting it with nothing. Both of these pass testing happily and then break a week into production.",
        "The scheduler is split in two so it can be tested. Deciding which accounts are due and refreshing them is a plain function over a database session that a test can call directly. The loop around it only handles timing. It wakes every 60 seconds, though each account still refreshes no more often than its own configured interval."
      ]
    },
    {
      heading: "What it will not do",
      paragraphs: [
        "Each phase got built against a written list of things the software is not allowed to do. In this particular corner of software the easy version of the product is the unethical one, so the list came first.",
        "Market URLs are stored as HTTPS links for a person to click. The backend never fetches them and there is no server-side proxy. Alert previews are inert: generating one never sends an email, SMS, push, or calendar event, and never contacts a retailer.",
        "Before adding any language model, I wrote down that retrieved posts, listings, and page text count as untrusted input. A resale forum is exactly where someone would plant text meant to be read by an automated buyer. So a future agent gets source-isolated text with no secrets in its context, a bounded tool allowlist with a call ceiling, output validated against a schema, and policy checks that run after the model rather than being asked of it. It gets no standing permission to write to a marketplace. Claims pulled from community data keep their source, timestamp, and any contradicting evidence attached."
      ],
      bullets: [
        "No checkout automation. You do the buying",
        "No CAPTCHA solving and no queue bypass",
        "No prohibited scraping and no private marketplace APIs",
        "Live data only through an approved adapter behind a typed provider boundary",
        "Model output never gets to write to a marketplace"
      ]
    },
    {
      heading: "Stack, security, and known gaps",
      paragraphs: [
        "The backend is FastAPI with SQLAlchemy, Alembic, and PostgreSQL. Pydantic schemas define the API contract, so ORM models never get returned straight to the client. The frontend is Next.js, React, TypeScript, and Tailwind, and the whole thing comes up under Docker Compose.",
        "Passwords are hashed with Argon2 and stay out of the logs. Short-lived JWTs sit in HTTP-only SameSite cookies alongside a readable CSRF cookie that has to match an X-CSRF-Token header on unsafe requests, and no token is ever written to local storage. CORS is credentialed only for origins that were configured explicitly. Every query and mutation is scoped to the authenticated owner, so there is no path to another user's data even by accident. Playwright runs the whole registration through sale workflow against the real Compose stack on desktop and mobile, with pytest, ruff, and typecheck behind it.",
        "The security doc also lists what is still missing: no MFA or passkeys, no production rate limiting, no audit-event UI, no backup automation, no container scanning. I would rather write those down than let the doc imply the app has them. It is easy to describe only the parts that are finished."
      ]
    }
  ],
  makerportfolio: [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "I was not strong at front-end work when I started this. It was basically my first serious front-end project, and I built it as much to get better at that as to have something to point people to.",
        "The first version was a Flask app on purpose, so I could keep working in the language I am strongest in while I picked up everything else around it. Docker and AWS came in to actually teach me how a personal project gets deployed and kept running, not just written. I do not run either anymore. Everything today deploys straight to Vercel off Next.js.",
        "Every rebuild since has been driven by wanting something that looks intentional and reacts to you, not a static resume online. The terminal is the clearest example. Nothing about the site needed it. I added it because it was fun to build, and it says more about how I think than a bullet list does."
      ]
    },
    {
      heading: "From Flask to Next.js",
      paragraphs: [
        "The first version of this site was a Flask app I containerized with Docker and hosted on AWS. It taught me the parts of web work that tutorials skip: routing, deployment, and how much upkeep a personal site quietly demands once the novelty has worn off.",
        "The current version is a rebuild on Next.js 15 App Router, React 19, TypeScript, and Tailwind. I collapsed a sprawl of thin routes down to three, /, /projects, and /contact, and left redirects behind so the old links still work."
      ]
    },
    {
      heading: "The gear on the homepage",
      paragraphs: [
        "The centerpiece is a 14-tooth spur gear drawn as a 3D wireframe on a canvas. There is no model file and no scene library behind it. The tooth profile gets generated from a tooth count plus tip, root, and bore radii, extruded along Z, then projected down to 2D with rotation matrices and a perspective divide. It came out to a few hundred lines and no dependencies.",
        "You can drag it. It follows your pointer, keeps spinning when you let go, and settles back into a slow idle rotation. Edges further from the camera get drawn fainter, which turned out to be the thing that actually sells the depth. It pulls its two colors from the same CSS variables as everything else and watches for theme changes, so it recolors the moment you flip to dark mode.",
        "The render loop tries not to waste anyone's battery. It stops when the tab is hidden and when the gear scrolls out of view, it respects devicePixelRatio, and if you have reduced motion turned on it draws a static gear that you can still drag around."
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
      heading: "The terminal",
      paragraphs: [
        "The other half of the hero used to be a chip-shaped card with buttons that repeated the navigation. Now it is a working terminal. Type help for the command list, or robotics, assistive, aiandml, embedded, or web to get a short account of what I actually do in that area. whyexist explains the site. whoami does about what you would expect.",
        "It boots once per session with a typing animation that gets skipped if you have reduced motion on. It does not navigate anywhere, which was a deliberate walk-back. An earlier version accepted paths like /projects/veridex and would take you there, which was fun to build and turned out to be competing with the nav bar for the same job."
      ]
    },
    {
      heading: "Glass panels and the light theme",
      paragraphs: [
        "Every card is a frosted glass panel, meaning a backdrop-filter surface with a translucent fill sitting over a faint drafting grid that stays visible through it. None of them are opaque boxes dropped on a background.",
        "Light mode was near-white for a long time, which gave me white cards on a white page and no separation at all. It is now closer to a drafting table: a Half Haystack paper background with cream panels floating over it and sepia grid lines instead of cool gray ones. The shadows had to warm up too, since a navy shadow on warm paper just looks like dirt. Dark mode still runs the VS Code Dark+ palette. Both themes are the same HSL variables with class-based dark mode, which is also why the code blocks on this page look like they belong here.",
        "The most useful bug I hit was in that glass class. It set position: relative and lived outside Tailwind's component layer, so it beat every position utility applied to it. Anything marked fixed was quietly rendering in normal flow instead. Moving the rule into @layer components handed priority back to the utilities and cleared up several layout problems I had been treating as unrelated."
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
        "The rebuild was mostly deletion. Framer-motion went, along with a pile of old hero, bento, and card components, once I realized how little code they were actually hiding. Every route prerenders statically, so there is nothing to spin up and nothing to pay for at request time.",
        "The deleting kept going after that. A scroll-driven SVG gear train and a glowing wire that traced your scroll position both came out, because both were motion competing with the thing you were trying to read. The terminal lost its collapse, popout, and floating-button modes after I watched it jump across the page one too many times. It works better as one panel that stays where you left it.",
        "Most of my edits to this site have been subtraction, and I have not regretted many of them."
      ]
    }
  ],
  "buddy-ai": [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "I wanted my own version of a Jarvis-style assistant, but I did not want to just clone someone's repo and call it done. I took a little inspiration from what is out there and then built almost everything else around what actually makes my day faster.",
        "It is less a product and more a tool I use for myself, constantly. I can control my entire desktop at a glance, it keeps my screen decluttered, and after using it this long it genuinely gets my work done faster. It was also just a good excuse to get hands-on with a bunch of APIs and see how far I could push something with direct access to my own machine."
      ]
    },
    {
      heading: "From Dynamic Island clone to desktop buddy",
      paragraphs: [
        "This began as a Windows version of Apple's Dynamic Island and drifted away from that pretty quickly. A pill that mirrors notifications is a nice demo, but I wanted something closer to company. The compact form became a small liquid face with mint and coral styling and a few expressive states, living in a transparent Electron window that stays reachable, remembers where you put it, and clamps properly across multiple monitors.",
        "Clicking it expands the face into a 420x560 assistant panel with chat, media controls showing the current track, volume, battery, one-shot screenshot attachment, settings, and a session usage meter. The face is the part you recognize. Everything you would actually use sits inside the panel."
      ]
    },
    {
      heading: "Handling routine commands locally",
      paragraphs: [
        "A lot of what you ask a desktop assistant to do does not need a model at all. Play, pause, skip, volume, mute, battery, opening a common site: all of those get parsed and executed locally before anything touches the API. They cost nothing and come back instantly.",
        "When a request does need the model, it runs through a bounded conversation history and strict tool schemas on Cerebras. The default text model is gpt-oss-120b, which is the cheapest option that can still do the job. Vision only runs on screenshots you explicitly hand it, and the tool schemas sent along with a prompt are chosen per prompt to keep input tokens down. Each session has a request ceiling you can see and change, and every reply is labeled with the model that wrote it."
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
        "Something that can see your screen and act on your machine should have to ask first. Every capability sits behind an allow-once, remember, or deny dialog. Screen capture asks every single time and keeps nothing afterward. Web access is opt-in, read-only, and hardened against SSRF. API keys and OAuth tokens go through Electron safeStorage instead of sitting in a config file.",
        "The list of things it cannot do matters just as much. There is no purchase, subscription, billing, arbitrary shell, or arbitrary filesystem capability, and those stay blocked even when a tool arrives through an MCP server. If a Windows bridge is unavailable, the app tells you so instead of inventing a plausible-looking state."
      ]
    },
    {
      heading: "MCP integrations and real automation",
      paragraphs: [
        "The assistant speaks Model Context Protocol over persistent stdio sessions. Configured servers get discovered, their tools validated, and calls executed exactly as confirmed. The model never gets to decide which server commands run. The catalog covers Playwright browser automation, scoped file access, memory, planning, PDF reading, GitHub, and Gmail, and you can add your own.",
        "Profiles handle multiple users without needing a database. Each one keeps its own preferences, encrypted credentials, permissions, model settings, request caps, and MCP config. Google sign-in goes through browser OAuth with PKCE and a temporary loopback callback, so no password ever passes through the app itself. Reading and navigating can run under a remembered permission. Anything that writes, sends, or deletes still asks."
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
        "One rule governs the test suite: the deterministic tests never call the live API. Thirty of them cover model routing, the tool loop, permission persistence, encrypted settings, web hardening, and the MCP protocol, all against mocked responses and fake transports. A separate screenshot harness renders the compact face, the expanded panel, and the settings states offscreen so layout regressions show up before I do.",
        "Actual Windows behavior gets checked with read-only smoke tests, where the media, battery, and volume bridges emit real payloads without changing anything on the machine.",
        "Still on the list: opt-in push-to-talk with local speech-to-text, text-to-speech with a way to interrupt it, and durable memory with per-memory review and delete. Each of those needs a privacy design I am happy with before it ships, and none of them have one yet."
      ]
    }
  ],
  veridex: [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "A lot of sites are written to get past an AI model rather than to inform the person reading them: phrasing planted to push a summarizer toward a more positive read than the page actually earns. I wanted a tool that pushes back on that instead of falling for it.",
        "I also did not buy that everything needs a cloud model behind it. Between token limits and the compute you get allocated on hosted APIs, local inference felt like the more interesting problem, so I built Veridex to run entirely on-device and treat a page's own claims as something to check rather than trust. It doubled as a genuinely useful habit. Half of what it does is check a source before I believe it, and building it made me a better researcher for the same reason."
      ]
    },
    {
      heading: "The trust problem",
      paragraphs: [
        "Long articles bury their sourcing, claims conflict from one page to the next, and AI answers show up confident but untraceable. When a tool summarizes something for you, it is usually asking for your trust without giving you a way to check it.",
        "Veridex is my attempt at the opposite. It shows the evidence it worked from, and it runs the model on your own machine, so the pages you read never get shipped off to an API."
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
        "There is a real cost to this. A 1B local model is slower and noticeably weaker than a hosted frontier model, and you feel it. What you get back is that the page you are reading never leaves your device. Given what the tool is for, I think that is worth the quality hit, though I would not pretend the hit is small."
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
        "Sources sit next to the claims they support instead of collecting in a footnote pile",
        "The summary and the bias check stay separate sections",
        "Weak evidence gets called weak",
        "Analysis only runs when you click. Nothing happens in the background"
      ]
    },
    {
      heading: "Current state and what's next",
      paragraphs: [
        "The pipeline works end to end today: extract, summarize, pull sources, flag weaknesses, follow-up chat. The piece it is still missing is claim-by-claim inspection. I want to split KEY CLAIMS into individually checkable items, each one linked back to the passage it came from, so you can get from a claim to its evidence in a single click.",
        "I also want to try larger local models as they get faster, since the 1B model is the current quality bottleneck, and the architecture makes swapping models a one-line env change."
      ]
    }
  ],
  vibeshuffle: [
    {
      heading: "Why did I build this?",
      paragraphs: [
        "Music is how I reset my mood, whether that is coming down after being out with friends or locking into a focused headspace to code. Spotify's own recommendation engine is genuinely good, but it is tuned for taste, not for the specific mood I am trying to move into or out of right now.",
        "I wanted to describe that in a sentence, something like coming back from hanging out and wanting to switch into work mode, and get a playlist that actually carries me from one mood to the other. It was also a real excuse to work with recommendation systems, which turned out to be harder and far more data-hungry than I expected. I am still not fully comfortable calling it live, but I use it myself and I like what it does, especially after Spotify cut back a lot of developer access in 2024 and made this kind of thing harder to build than it used to be."
      ]
    },
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
        "The descriptor rules are hand-tuned ranges, and that is where the current version runs out of room. Two things I want next: letting likes and skips inside the app feed back into future rankings, and clustering a user's own library by vibe instead of leaning entirely on the global dataset profiles. Tuning a playlist should feel like turning a knob, so the ranking needs to shift under you rather than starting over each time."
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
              <Card
                key={section.heading}
                className={section.accent ? "border-primary/40 p-6 md:p-8" : "p-6 md:p-8"}
                data-reveal
              >
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
                {section.image ? (
                  <figure className="mt-5">
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={section.image.width}
                      height={section.image.height}
                      sizes="(min-width: 768px) 42rem, 100vw"
                      className="w-full rounded-lg border border-border bg-background/40 object-contain"
                    />
                    {section.image.caption ? (
                      <figcaption className="mt-2 font-mono text-[11px] leading-5 tracking-tight text-muted-foreground">
                        {section.image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
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
                I would rather leave this page short than fill it with claims I have not written
                up properly yet.
              </p>
            </Card>
          )}
        </div>
      </section>
    </PageShell>
  );
}
