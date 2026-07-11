// All in-app guide content, derived from docs/Original_Recommendation/back_recovery_guide_final.md
// so the user never has to open the original document.

export type Move = {
  id: string;
  name: string;
  dose: string;
  steps: string[];
  avoid?: string[];
  videoUrl?: string;
  videoLabel?: string;
};

export type HabitGuide = {
  habitId: string;
  title: string;
  what: string;
  why: string;
  moves: Move[];
};

export const HABIT_LABELS: Record<string, string> = {
  sleep_window: "Sleep window",
  walks: "Walks",
  mcgill_big3: "McGill Big 3",
  hip_openers: "Hip openers",
  sit_stand: "Position changes",
  morning_rule: "Morning rule",
};

export const HABIT_GUIDES: HabitGuide[] = [
  {
    habitId: "sleep_window",
    title: "Sleep window",
    what: "Be in bed 8 hours 15 minutes with a fixed wake time, 7 days a week.",
    why: "This is your #1 intervention, above any exercise. 7.5h in bed is only ~6.5h of actual sleep, and sleep debt measurably lowers pain thresholds and slows tissue healing.",
    moves: [
      {
        id: "wind-down",
        name: "Wind-down routine",
        dose: "30 min before bed, nightly",
        steps: [
          "Screens away 30 minutes before your in-bed time.",
          "5 minutes of slow diaphragmatic breathing: 4 seconds in, 6 seconds out.",
          "Same wake time every day, including weekends.",
        ],
      },
    ],
  },
  {
    habitId: "walks",
    title: "Walks",
    what: "5-10 minute easy walks, 3-4 times spread across the day (8-10k steps total).",
    why: "Walking is the best-evidenced habit for recurrent back pain. Frequency beats duration: several short walks beat one long one.",
    moves: [
      {
        id: "walk-how",
        name: "How to count them",
        dose: "3-4 walks per day, 5-10 min each",
        steps: [
          "Any relaxed-pace walk of 5+ minutes counts as one.",
          "Spread them out: morning, midday, evening beats all at once.",
          "Log the number of walks, not the minutes. Target: 3 or more.",
        ],
      },
    ],
  },
  {
    habitId: "mcgill_big3",
    title: "McGill Big 3",
    what: "Three core-endurance exercises done back-to-back once a day: modified curl-up, side plank, bird dog. About 10 minutes.",
    why: "Back extensor ENDURANCE (not strength or flexibility) is what predicts fewer recurrences. These three build it without bending or loading the spine.",
    moves: [
      {
        id: "curl-up",
        name: "1. Modified curl-up",
        dose: "3 sets of 5 per side, 10-second holds",
        steps: [
          "Lie on your back. Bend one knee, keep the other leg straight.",
          "Slide both hands (palms down) under the natural arch of your lower back. Do not flatten your back.",
          "Lift your head and shoulders a few centimeters as one stiff unit, as if your head rests on a scale and you just take the weight off.",
          "Hold 10 seconds, breathing normally. Lower slowly. 5 reps, then switch the bent leg.",
        ],
        avoid: [
          "Do NOT curl up like a sit-up or tuck your chin to your chest.",
          "Do NOT flatten your lower back into the floor. The hands preserve the arch.",
        ],
      },
      {
        id: "side-plank",
        name: "2. Side plank",
        dose: "3 holds of 10 sec per side (start from knees; long-term target 60-75 sec from feet)",
        steps: [
          "Lie on your side, elbow directly under your shoulder, knees bent 90 degrees.",
          "Lift your hips so shoulder-hip-knee forms a straight line.",
          "Hold 10 seconds, breathing normally. Lower, rest briefly, repeat 3 times, then switch sides.",
          "Progression: once easy from knees, straighten the legs and support on feet.",
        ],
        avoid: [
          "Hips sagging toward the floor.",
          "Holding your breath.",
          "A side-to-side time difference over 10% is worth noting; tell your PT.",
        ],
      },
      {
        id: "bird-dog",
        name: "3. Bird dog",
        dose: "3 sets of 5 per side, 10-second holds",
        steps: [
          "Hands under shoulders, knees under hips. Gently brace your midsection.",
          "Extend the opposite arm and leg until horizontal. No higher.",
          "Hold 10 seconds with ZERO lower-back movement. Imagine balancing a full cup of water on your lower back.",
          "Sweep back under, switch sides. 5 reps each side, 3 rounds.",
        ],
        avoid: [
          "Lifting the leg above hip height (this arches the back).",
          "Rotating the hips as the leg lifts.",
        ],
      },
    ],
  },
  {
    habitId: "hip_openers",
    title: "Hip openers",
    what: "Three ACTIVE hip mobility drills daily: 90/90 switches, couch stretch, goblet squat hold. Stiff hips force your lower back to do their bending.",
    why: "Your hips were never examined and are the biggest gap in the workup. Mobile hips take load off the lumbar discs during every sit, stand, and bend.",
    moves: [
      {
        id: "ninety-ninety",
        name: "1. 90/90 hip switches",
        dose: "10 slow switches",
        steps: [
          "Sit on the floor: front leg bent 90 degrees in front of you, back leg bent 90 degrees to the side.",
          "Stay tall through the chest and slowly rotate both knees together to the other side.",
          "Pause where it is hard; do not force. 10 controlled switches.",
        ],
        videoUrl: "https://www.youtube.com/watch?v=-cQqV5q52FQ",
        videoLabel: "Watch: 90/90 hip switches (PT demo)",
      },
      {
        id: "couch-stretch",
        name: "2. Couch stretch",
        dose: "60 seconds per side",
        steps: [
          "Kneel with one knee at the base of a couch or wall, that shin running up the backrest/wall. Other foot flat in front.",
          "Squeeze the glute of the kneeling side and tuck your pelvis slightly. You should feel the front of that hip stretch.",
          "Stay upright and breathe for 60 seconds, then switch.",
        ],
        avoid: ["Arching the lower back to fake the range. The pelvic tuck is the whole exercise."],
        videoUrl: "https://www.youtube.com/watch?v=ulgAOykAgV4",
        videoLabel: "Watch: couch stretch (Kelly Starrett)",
      },
      {
        id: "goblet-hold",
        name: "3. Goblet squat hold",
        dose: "3 holds of 20 seconds",
        steps: [
          "Hold a light weight (or nothing) at your chest.",
          "Squat down to a COMFORTABLE depth only, heels down, chest tall.",
          "Use your elbows to gently push your knees out. Breathe and hold 20 seconds.",
        ],
        videoUrl: "https://www.youtube.com/watch?v=28YoUHBMCyA",
        videoLabel: "Watch: prying goblet squat hold",
      },
    ],
  },
  {
    habitId: "sit_stand",
    title: "Position changes",
    what: "Change position every 30-45 minutes at the desk. Set a timer; willpower does not work.",
    why: "12-14 hour sitting days on stiff hips are an established driver of your episodes. The dose of sitting matters less than how long each unbroken block is.",
    moves: [
      {
        id: "standing-extensions",
        name: "Every stand-up: 5 standing back extensions",
        dose: "5 slow reps, every break",
        steps: [
          "Stand up, place your hands on your hips.",
          "Gently push your hips forward and lean back slightly, eyes following up.",
          "Slow and easy: 5 reps. This reverses the sitting posture for a moment.",
        ],
      },
    ],
  },
  {
    habitId: "morning_rule",
    title: "Morning rule",
    what: "No loaded bending, floor exercises, or deep stretches in the FIRST HOUR after waking.",
    why: "Discs are maximally swollen with fluid right after sleep and most vulnerable to flexion then. The same bend is far safer at 10am than at 6:30am.",
    moves: [
      {
        id: "morning-how",
        name: "How to follow it",
        dose: "First 60 minutes after waking",
        steps: [
          "Fine in hour one: shower, walk, coffee, standing back extensions.",
          "Put on socks and shoes sitting down instead of deep-bending.",
          "Schedule Big 3, hip openers, and any lifting for later in the day.",
        ],
      },
    ],
  },
];

export type SelfTest = {
  id: string;
  name: string;
  when: string;
  steps: string[];
  reading: string;
};

export const SELF_TESTS: SelfTest[] = [
  {
    id: "directional-preference",
    name: "Prone press-up (directional preference test)",
    when: "Only when your back is CALM. Never mid-flare.",
    steps: [
      "Lie face down, hands flat under your shoulders like a push-up.",
      "Slowly press your chest up while your hips and legs stay relaxed on the floor (a lazy cobra).",
      "Do 10 slow reps, noting how your back feels during and after.",
    ],
    reading:
      "Feels better, or the pain moves toward the CENTER of your back = extension bias; record it and tell your PT. Feels worse or spreads toward a leg = stop and tell your PT. Either result completes the 'Directional preference result recorded' milestone.",
  },
  {
    id: "sorensen",
    name: "Sorensen hold (back endurance baseline)",
    when: "Once when calm, then to track progress. This number predicts recurrence better than strength.",
    steps: [
      "Lie face down on a bed or bench with everything from the hips UP hanging off the edge, unsupported.",
      "Anchor your legs: a partner holds them, or hook your feet under something solid.",
      "Cross your arms on your chest and hold your torso level with the floor.",
      "Time how long until you can no longer hold level. Record the seconds.",
    ],
    reading: "Under ~120 seconds = elevated recurrence risk. Target: 150+ seconds by the end of Phase 2.",
  },
  {
    id: "side-plank-test",
    name: "Side plank baseline (each side)",
    when: "Once when calm, then to track progress.",
    steps: [
      "Full side plank from the feet if possible, otherwise from the knees (note which).",
      "Time each side to failure. Rest a few minutes between sides.",
    ],
    reading: "A left/right difference over 10% matters; flag it to your PT. Target: symmetric 60-75 seconds.",
  },
  {
    id: "single-leg-balance",
    name: "Single-leg balance, eyes closed",
    when: "Once as a baseline.",
    steps: [
      "Stand near a wall or counter. Close your eyes and lift one foot.",
      "Time until you touch down or open your eyes. Both legs.",
    ],
    reading: "Watch for a much weaker left side (your left knee history). Tell the PT the numbers.",
  },
];

export const PT_SCRIPT = {
  script:
    '"I want a McKenzie/MDT directional preference assessment and a progressive loading program back to lifting, not stretching and modalities. Flexion stretching has nearly triggered spasms. Screen my hips (flexion and internal rotation) and my single-leg mechanics; I have a recurrent LEFT medial meniscus issue (tear/bulge/cyst, ~4 yrs)."',
  firingCriteria:
    "No loading program and no objective measures after 3 visits = switch clinicians, no guilt.",
};

export type GlossaryEntry = { term: string; def: string };

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Back score ("back 4")',
    def: "Your back pain/tightness today on a 1-10 scale. 1 = felt nothing, 10 = worst imaginable. \"back 4\" in the quick log just means back pain 4 out of 10.",
  },
  {
    term: "Stress score",
    def: "Overall life/work stress today, 1-10. 1 = totally relaxed, 10 = maximum. Tracked because your flares follow high-stress weeks by 1-2 days.",
  },
  {
    term: "Sleep hours",
    def: "Hours actually slept last night. Target is 8.25 hours IN BED, which usually yields ~7+ hours asleep.",
  },
  {
    term: "Big 3 (McGill Big 3)",
    def: "Three core-endurance exercises done daily: modified curl-up, side plank, bird dog. Full how-to in the Daily six section.",
  },
  {
    term: "Directional preference",
    def: "The direction of spine movement your back prefers. Many flexion-intolerant backs feel BETTER with gentle extension (leaning back). Found via the prone press-up self-test or a PT's McKenzie/MDT exam.",
  },
  {
    term: "MDT / McKenzie",
    def: "Mechanical Diagnosis and Therapy: a PT assessment method that finds your directional preference by testing repeated movements. This is what you ask the PT for by name.",
  },
  {
    term: "Sorensen hold",
    def: "A timed back-endurance test lying face down with your torso off the edge of a bench. Under ~120 sec = higher recurrence risk; target 150+ sec.",
  },
  {
    term: "Hinge",
    def: "Bending by pushing the hips back with a neutral (straight) spine, like closing a car door with your butt. The safe way to pick things up and the pattern behind deadlifts.",
  },
  {
    term: "Flexion / loaded flexion / end-range flexion",
    def: "Flexion = bending the spine forward. Loaded = while carrying weight. End-range = to the very limit of the bend. The short-term rule protects only LOADED and END-RANGE flexion; ordinary bending is being rebuilt, not banned.",
  },
  {
    term: "Flare",
    def: "An episode of spasm or sharp guarding. It is a muscle alarm, not new damage. A flare handled calmly inside 72 hours is a WIN. The Flare button opens the playbook.",
  },
  {
    term: "Guarding / spasm",
    def: "Protective muscle tension around irritated discs: the smoke alarm, not the fire. Oversensitive from 18 months of overload; calmed by capacity + sleep + time, not stretching.",
  },
  {
    term: "Streak",
    def: "Consecutive days with all six daily habits completed.",
  },
  {
    term: "Adherence",
    def: "The percentage of daily habits you actually completed over a period. The weekly coach report uses it.",
  },
  {
    term: "Maintenance floor",
    def: "The forever-minimum once recovered: 10 minutes daily (walks + Big 3) plus 2 lifting sessions per week. Also the level you deliberately drop to during high-stress weeks.",
  },
  {
    term: "WIP limit",
    def: "Work-in-progress limit: recovery is your ONLY side project until 2027. No new courses, certifications, or ventures. The 18-month stack built this injury.",
  },
  {
    term: "Stress-lag",
    def: "Your flares follow short sleep + high stress + training spikes by 1-2 days. In any such week, drop to the maintenance floor on purpose. That is the dashboard working, not weakness.",
  },
  {
    term: "Phases 0-3",
    def: "Phase 0 (wk 0-2): assess and baseline. Phase 1 (wk 0-6): raise the floor. Phase 2 (wk 6-16): rebuild load tolerance. Phase 3 (mo 4-9): full return including burpees. Details in Training plan.",
  },
  {
    term: "Carries (farmer / suitcase)",
    def: "Walking while holding weight: both hands (farmer) or one hand (suitcase). Builds trunk endurance without spine bending. 3x/week in Phase 1.",
  },
  {
    term: "RDL (Romanian deadlift)",
    def: "A hip-hinge lift with a slight knee bend, weight sliding down the thighs. Step 2 of the hinge progression, after the dowel drill.",
  },
];

export const PHASES = [
  {
    id: "phase-0",
    title: "Phase 0 (weeks 0-2): Instrument and assess",
    items: [
      "Book the PT eval using the script (see Self-tests & PT visit).",
      "Record baselines: Sorensen hold, side planks, single-leg balance.",
      "Run the prone press-up test when calm; record the directional preference result.",
      "Log 3 numbers nightly for 8 weeks: sleep, stress, back.",
      "Labs at next draw: ferritin + HbA1c. Then labs are closed forever.",
    ],
  },
  {
    id: "phase-1",
    title: "Phase 1 (weeks 0-6): Raise the floor",
    items: [
      "Everything in the daily six, every day.",
      "Protein ~1.6 g/kg/day (paneer, Greek yogurt, soy, dal + whey if dairy OK).",
      "Creatine monohydrate 3-5 g/day.",
      "Farmer and suitcase carries 3x/week.",
      "Glute bridges, chest-supported rows, split squats. Train BOTH legs evenly.",
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2 (weeks 6-16): Rebuild load tolerance",
    items: [
      "Hinge progression: dowel drill -> kettlebell RDL -> trap bar from blocks -> conventional deadlift.",
      "Graded exposure: cat-cow through fuller range, floor sitting, picking up light objects with a rounded back at zero load.",
      "Exit criteria: Sorensen 150+ sec, side planks symmetric 60-75 sec, automatic hinge under moderate load, one full month spasm-free.",
    ],
  },
  {
    id: "phase-3",
    title: "Phase 3 (months 4-9): Full return",
    items: [
      "Burpees only after pain-free loaded hinging + one PT review of jump-landing mechanics.",
      "Deadlift back to full range and load, with a coach.",
      "Permanent maintenance floor from here on: 10 min daily + 2 lifts/week.",
    ],
  },
];

export const GYM_REFERENCE = {
  doNow: [
    "Walking",
    "Big 3",
    "Carries",
    "Glute bridges",
    "Split squats",
    "Hinge drills",
    "Sled",
    "Swimming",
  ],
  modify: [
    "Rows -> chest-supported only",
    "Squats -> goblet, above parallel",
    "Cat-cow -> small pain-free range",
  ],
  parked: [
    "Burpees (the plank-to-feet jump)",
    "Good-mornings",
    "Exaggerated knee-to-chest",
    "End-range flexion stretches",
    "Loaded twists",
    "Sit-ups",
    "Ballistic jumping",
  ],
  stretchingNote:
    "Stop stretching the back entirely for now. The tightness is neurological guarding, not short muscles; stretching appeases the alarm instead of fixing capacity. Strength + walking + time dissolve guarding.",
};

export const FLARE_GUIDE = {
  first48: [
    "Keep moving: short easy walks every 1-2 hours. NO bed rest.",
    "Position of ease: on your back, calves up on a chair (90/90), 10-15 min as needed.",
    "Heat for comfort (changes comfort, not recovery speed).",
    "NSAID short course with food if stomach/kidneys OK, 2-3 days max.",
    "Brace 1-2 days max, then wean. It is a splint, not a treatment.",
    'Say out loud: "This is a muscle alarm, not new damage. It settles in days."',
    "A flare handled calmly in 72 hours is a WIN, not a failure.",
  ],
  stressLag:
    "Prevention: your flares follow load by 1-2 days. In any week with short sleep + work crunch + a hard session planned, deliberately drop to the maintenance floor only (walks, Big 3, sleep). Zero progression attempts during crunch weeks.",
  relapseScript:
    "Around month 4 you will feel cured and want to drop the routine or add a new project. That is the standard relapse pattern, predicted in advance. The maintenance floor and WIP limit exist for exactly this moment.",
  erFlags: [
    "New loss of bladder/bowel control or true inability to urinate",
    "Numbness in the groin/saddle area",
    "New leg weakness or foot drop",
    "Fever with back pain",
  ],
  escalation:
    "Execute this plan 9-12 months. If spasms still recur frequently: see a physiatrist (PM&R), NOT a surgeon. Re-image only for new neurological deficit, never for pain alone. There is no surgical target on your MRI.",
};

export const SUPPLEMENTS: { item: string; verdict: string; note: string }[] = [
  { item: "Creatine monohydrate 3-5 g/day", verdict: "Recommended", note: "Does NOT cause tightness or cramps. Vegetarians benefit most. Decide once, then closed." },
  { item: "Protein ~1.6 g/kg/day", verdict: "Required", note: "Tissue adaptation. Engineer it deliberately as a vegetarian." },
  { item: "Magnesium glycinate 200-400 mg", verdict: "Keep if you like", note: "Safe, may help sleep. Not the cure." },
  { item: "Coffee up to ~20 oz", verdict: "Fine", note: "Not depleting magnesium. Closed." },
  { item: "Ferritin, HbA1c", verdict: "Test once", note: "Then labs closed forever." },
  { item: "Vitamin D, B12", verdict: "Paused", note: "Both high, paused per doctor. Done." },
  { item: "IV drips, niacin, beetroot, quercetin, electrolyte theories", verdict: "Skip permanently", note: "Spasms are mechanical + neurological, not chemical." },
  { item: "Vibration plate", verdict: "Don't buy", note: "Ranks far below sleep/walking/loading; wrong dose is an established disc risk." },
  { item: "Acupuncture / cupping", verdict: "Neutral", note: "Fine if it feels good and keeps you moving. Reject 'stagnation' narratives." },
  { item: "PRP for the spine", verdict: "Skip", note: "Weak/mixed evidence for discogenic back pain. Spend it on PT." },
  { item: "Brace", verdict: "Flares only", note: "1-2 days max. Daily use weakens the system you're building." },
  { item: "Muscle relaxers", verdict: "Ask doctor once", note: "A few tablets for acute flare NIGHTS only. Not maintenance." },
  { item: "Heat vs cold", verdict: "Whichever feels good", note: "Comfort tool. Heat wins for you; fine." },
  { item: "Ice baths", verdict: "Your preference", note: "Irrelevant to the back either way." },
];

export const DIAGNOSIS_PLAIN = [
  "The MRI shows ordinary age-typical findings: the spine equivalent of gray hair, present in most pain-free men your age. NO stenosis, NO nerve impingement, nothing surgical.",
  "The spasms are protective muscle guarding around mildly irritated discs: a smoke alarm, not a fire. Eighteen months of extreme life load, sleep debt, 12-14 hour sitting days, and a growing fear of bending made the alarm oversensitive.",
  "The fix is raising capacity and calming the alarm, not protecting the spine forever. The One Rule: avoid LOADED and END-RANGE forward bending short term, while gradually rebuilding confident bending over months. \"Never bend again\" is the outcome we are avoiding, not aiming for.",
];

export const SUCCESS_DEFINITION = {
  isNot: 'Success is NOT "never tight again." With your genetics, no honest clinician promises that.',
  is: "Success = spasms rare, brief, and boring; flares handled calmly inside 72 hours; deadlifting with a hinge you trust; no brace, no supplement stack, no fear running decisions.",
  timeline: [
    "8-12 weeks: noticeably fewer and milder episodes.",
    'Month 4: Phase 2 exit criteria met; survive the "I\'m cured" relapse urge.',
    "Month 6: full gym including reintroduced burpees per criteria.",
    "Month 9-12: maintenance floor is automatic; case closed unless escalation criteria met.",
  ],
};

export function getHabitGuide(habitId: string): HabitGuide | undefined {
  return HABIT_GUIDES.find((g) => g.habitId === habitId);
}
