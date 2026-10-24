/* Sign, signal, marking and hand-signal library.
   All artwork is original simplified SVG (100x100 viewBox). Meanings are paraphrased from the
   NYS Driver's Manual MV-21; "ref" is the manual page. */
(function () {
  const F = 'font-family="Arial,Helvetica,sans-serif" font-weight="700"';
  const t = (x, y, s, txt, fill = "#111", extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" ${F} font-size="${s}" fill="${fill}" ${extra}>${txt}</text>`;
  const svg = (inner, label) => `<svg viewBox="0 0 100 100" role="img" aria-label="${label}">${inner}</svg>`;
  const diamond = (fill, inner) => `<polygon points="50,3 97,50 50,97 3,50" fill="${fill}" stroke="#111" stroke-width="3"/>${inner}`;
  const rect = (inner, h = 80) => `<rect x="14" y="${(100 - h) / 2}" width="72" height="${h}" rx="5" fill="#fff" stroke="#111" stroke-width="3"/>${inner}`;
  // traffic light housing: states = {r:'on'|'flash'|'off'|'arrow', y:..., g:...}
  const light = (r, y, g, extra = "") => {
    const lamp = (cy, c, st) => {
      if (st === "off") return `<circle cx="50" cy="${cy}" r="11" fill="#3A3A3A"/>`;
      if (st === "arrowG") return `<circle cx="50" cy="${cy}" r="11" fill="#222"/><path d="M42 ${cy}h12" stroke="${c}" stroke-width="4"/><path d="M52 ${cy - 6}l6 6-6 6" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`;
      if (st === "arrowL") return `<circle cx="50" cy="${cy}" r="11" fill="#222"/><path d="M46 ${cy}h12" stroke="${c}" stroke-width="4"/><path d="M48 ${cy - 6}l-6 6 6 6" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`;
      const rays = st === "flash" ? `<g stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M${30} ${cy}h-7M${70} ${cy}h7M36 ${cy - 13}l-5-5M64 ${cy - 13}l5-5M36 ${cy + 13}l-5 5M64 ${cy + 13}l5 5"/></g>` : "";
      return `${rays}<circle cx="50" cy="${cy}" r="11" fill="${c}"/>`;
    };
    return `<rect x="34" y="6" width="32" height="88" rx="8" fill="#1E1E1E"/>${lamp(24, "#E53935", r)}${lamp(50, "#FBC02D", y)}${lamp(76, "#43A047", g)}${extra}`;
  };
  const lane = (inner) => `<rect x="10" y="10" width="80" height="80" rx="6" fill="#111"/>${inner}`;
  const xMark = (c, w = 9) => `<path d="M30 30L70 70M70 30L30 70" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const road = (inner) => `<rect x="5" y="15" width="90" height="70" rx="4" fill="#5F5E5A"/>${inner}`;
  const car = (x, y, c, dir = 1) => dir > 0
    ? `<rect x="${x}" y="${y}" width="22" height="12" rx="3" fill="${c}"/><polygon points="${x + 22},${y + 2} ${x + 28},${y + 6} ${x + 22},${y + 10}" fill="${c}"/>`
    : `<rect x="${x}" y="${y}" width="22" height="12" rx="3" fill="${c}"/><polygon points="${x},${y + 2} ${x - 6},${y + 6} ${x},${y + 10}" fill="${c}"/>`;
  // driver's arm out of a car window (hand signals)
  // Car seen from the side, driver's window on the left; the arm comes out of that window.
  const arm = (path) => `<rect x="34" y="40" width="62" height="38" rx="8" fill="#6B7C8F"/><rect x="38" y="44" width="24" height="16" rx="3" fill="#CFE3F5"/><circle cx="48" cy="80" r="8" fill="#222"/><circle cx="84" cy="80" r="8" fill="#222"/><path d="${path}" fill="none" stroke="#E0A87E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const paddle = (fill, word, wordFill, shape) => `<line x1="50" y1="56" x2="50" y2="96" stroke="#7A5230" stroke-width="5"/>${shape}${t(50, 38, 15, word, wordFill)}`;

  const S = [
    // ---------- regulation ----------
    { id: "stop", cat: "Regulation", name: "STOP", ref: 29,
      meaning: "Come to a full stop before the stop line (or crosswalk, or edge of the intersection). Yield to vehicles and pedestrians, then go when safe.",
      art: `<polygon points="30,3 70,3 97,30 97,70 70,97 30,97 3,70 3,30" fill="#C8102E"/><polygon points="31.5,7 68.5,7 93,31.5 93,68.5 68.5,93 31.5,93 7,68.5 7,31.5" fill="none" stroke="#fff" stroke-width="2.5"/>${t(50, 59, 25, "STOP", "#fff")}` },
    { id: "yield", cat: "Regulation", name: "YIELD", ref: 29,
      meaning: "Slow down and be ready to stop. Give the right-of-way to vehicles and pedestrians; stop fully if traffic requires it.",
      art: `<polygon points="3,8 97,8 50,95" fill="#C8102E"/><polygon points="21,18 79,18 50,73" fill="#fff"/>${t(50, 39, 13, "YIELD", "#C8102E")}` },
    { id: "noRightTurn", cat: "Regulation", name: "No right turn", ref: 29,
      meaning: "A red circle with a slash means the action shown is not allowed. Here: no right turn.",
      art: rect(`<path d="M42 78V52q0-10 10-10h9" fill="none" stroke="#111" stroke-width="7"/><polygon points="59,32 73,42 59,52" fill="#111"/><circle cx="50" cy="50" r="31" fill="none" stroke="#C8102E" stroke-width="7"/><line x1="28" y1="28" x2="72" y2="72" stroke="#C8102E" stroke-width="7"/>`, 80) },
    { id: "doNotPass", cat: "Regulation", name: "DO NOT PASS", ref: 29,
      meaning: "Passing is not allowed on this stretch of road.",
      art: rect(`${t(50, 37, 15, "DO")}${t(50, 56, 15, "NOT")}${t(50, 75, 15, "PASS")}`, 76) },
    { id: "noTurnOnRed", cat: "Regulation", name: "NO TURN ON RED", ref: 31,
      meaning: "You may not turn (right, or left from one-way to one-way) while the light is red. Wait for green.",
      art: rect(`${t(50, 30, 13, "NO")}${t(50, 46, 13, "TURN")}${t(50, 62, 13, "ON")}${t(50, 78, 13, "RED")}`, 80) },
    { id: "speed55", cat: "Regulation", name: "Speed limit", ref: 47,
      meaning: "Maximum legal speed in good conditions. You can still be ticketed for driving too fast for bad conditions, even under the limit.",
      art: rect(`${t(50, 30, 12, "SPEED")}${t(50, 45, 12, "LIMIT")}${t(50, 80, 32, "55")}`, 84) },

    // ---------- warning ----------
    { id: "curve", cat: "Warning", name: "Winding road", ref: 30,
      meaning: "Yellow diamond = warning. The road curves ahead; slow down and be ready.",
      art: diamond("#F2C200", `<path d="M44 76c0-12 14-12 14-24s-14-12-14-22" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/><polygon points="36,32 44,18 52,32" fill="#111"/>`) },
    { id: "narrowBridge", cat: "Warning", name: "Narrow bridge", ref: 30,
      meaning: "The road narrows at a bridge ahead. Slow down and watch for oncoming traffic.",
      art: diamond("#F2C200", `${t(50, 48, 11, "NARROW")}${t(50, 62, 11, "BRIDGE")}`) },
    { id: "pedestrians", cat: "Warning", name: "Pedestrian / school crossing", ref: 30,
      meaning: "Warning: people, often children, may be crossing ahead. Slow down and be ready to stop.",
      art: diamond("#F2C200", `<g fill="#111"><circle cx="40" cy="34" r="5"/><circle cx="60" cy="40" r="4.5"/></g><g stroke="#111" stroke-width="5" stroke-linecap="round" fill="none"><path d="M40 40v16l-6 14M40 56l7 13M40 46l-8 6M40 46l8 4"/><path d="M60 45v13l-5 12M60 58l6 11M60 50l-7 5M60 50l7 3"/></g>`) },
    { id: "advisory", cat: "Warning", name: "Recommended speed", ref: 30,
      meaning: "A yellow speed plate under a warning sign is the advised (safe) speed for that hazard.",
      art: `<polygon points="50,2 80,32 50,62 20,32" fill="#F2C200" stroke="#111" stroke-width="2.5"/><path d="M46 48c0-7 8-7 8-14s-8-7-8-12" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/><rect x="28" y="66" width="44" height="32" rx="3" fill="#F2C200" stroke="#111" stroke-width="2.5"/>${t(50, 84, 13, "35")}${t(50, 95, 8, "MPH")}` },

    // ---------- work zone ----------
    { id: "roadWork", cat: "Work zone", name: "Road work ahead", ref: 30,
      meaning: "Orange = work zone. Slow down, merge early, and obey flag persons. Speeding fines double here.",
      art: diamond("#F28C28", `${t(50, 42, 12, "ROAD")}${t(50, 56, 12, "WORK")}${t(50, 70, 10, "1500 FT")}`) },
    { id: "flaggerAhead", cat: "Work zone", name: "Flag person ahead", ref: 30,
      meaning: "A flag person is directing traffic ahead. You must obey their signals; they have the same authority as a sign.",
      art: diamond("#F28C28", `<circle cx="46" cy="30" r="5" fill="#111"/><g stroke="#111" stroke-width="5" stroke-linecap="round" fill="none"><path d="M46 36v18l-6 16M46 54l6 16M46 42l-9 8M46 42l12-6"/></g><line x1="58" y1="36" x2="58" y2="22" stroke="#111" stroke-width="3"/><rect x="58" y="20" width="12" height="9" fill="#111"/>`) },
    { id: "flagStop", cat: "Work zone", name: "Flag person: STOP", ref: 30,
      meaning: "A flag person showing STOP means stop and wait until they signal you to go.",
      art: paddle("#C8102E", "STOP", "#fff", `<polygon points="35,13 65,13 77,25 77,47 65,59 35,59 23,47 23,25" fill="#C8102E" stroke="#fff" stroke-width="2"/>`) },
    { id: "flagSlow", cat: "Work zone", name: "Flag person: SLOW", ref: 30,
      meaning: "A flag person showing SLOW means proceed slowly and carefully through the work area.",
      art: paddle("#F28C28", "SLOW", "#111", `<polygon points="50,6 78,34 50,62 22,34" fill="#F28C28" stroke="#111" stroke-width="2.5"/>`) },

    // ---------- guide & service ----------
    { id: "destination", cat: "Guide & service", name: "Destination", ref: 30,
      meaning: "Green = direction and distance to places.",
      art: `<rect x="3" y="22" width="94" height="56" rx="5" fill="#00704A" stroke="#fff" stroke-width="2"/><path d="M10 40l7-5v10z" fill="#fff"/>${t(52, 45, 12, "Rochester 55", "#fff")}${t(46, 67, 12, "Lockport 10", "#fff")}<path d="M90 62l-7-5v10z" fill="#fff"/>` },
    { id: "routeState", cat: "Guide & service", name: "State route", ref: 30,
      meaning: "Route signs: the shape tells you the type of road. A plain rectangle like this marks a state route.",
      art: `<rect x="16" y="20" width="68" height="60" rx="6" fill="#fff" stroke="#111" stroke-width="3"/>${t(50, 63, 34, "60")}` },
    { id: "routeUS", cat: "Guide & service", name: "U.S. route", ref: 30,
      meaning: "A white shield marks a U.S. route.",
      art: `<rect x="10" y="10" width="80" height="80" rx="4" fill="#111"/><path d="M22 20h56c0 14 6 18 6 30 0 22-20 30-34 38-14-8-34-16-34-38 0-12 6-16 6-30z" fill="#fff"/>${t(50, 63, 30, "20")}` },
    { id: "routeInterstate", cat: "Guide & service", name: "Interstate route", ref: 30,
      meaning: "A red-and-blue shield marks an interstate highway.",
      art: `<path d="M14 18q36-12 72 0c4 30-6 58-36 74C20 76 10 48 14 18z" fill="#1E4FA0" stroke="#fff" stroke-width="3"/><path d="M14 18q36-12 72 0l-2 14H16z" fill="#C8102E"/>${t(50, 30, 9, "INTERSTATE", "#fff")}${t(50, 70, 30, "84", "#fff")}` },
    { id: "gas", cat: "Guide & service", name: "Gas station", ref: 30,
      meaning: "Blue = services, such as gas, rest areas, camping or medical facilities.",
      art: `<rect x="10" y="10" width="80" height="80" rx="6" fill="#1E4FA0" stroke="#fff" stroke-width="2"/><rect x="32" y="26" width="26" height="50" rx="3" fill="#fff"/><rect x="36" y="31" width="18" height="12" fill="#1E4FA0"/><path d="M58 36h8v26a4 4 0 0 0 8 0V40l-6-8" fill="none" stroke="#fff" stroke-width="4"/>` },
    { id: "camping", cat: "Guide & service", name: "Camping", ref: 30,
      meaning: "Blue service sign: camping or trailer area ahead.",
      art: `<rect x="10" y="10" width="80" height="80" rx="6" fill="#1E4FA0" stroke="#fff" stroke-width="2"/><rect x="22" y="34" width="50" height="28" rx="5" fill="#fff"/><rect x="30" y="40" width="12" height="9" fill="#1E4FA0"/><circle cx="40" cy="66" r="6" fill="#fff"/><path d="M72 56h10" stroke="#fff" stroke-width="4"/>` },

    // ---------- railroad ----------
    { id: "rrAdvance", cat: "Railroad", name: "Railroad crossing ahead", ref: 61,
      meaning: "Round yellow sign: a railroad crossing is ahead. Slow down, look and listen, and be ready to stop.",
      art: `<circle cx="50" cy="50" r="46" fill="#F2C200" stroke="#111" stroke-width="3"/><path d="M22 22L78 78M78 22L22 78" stroke="#111" stroke-width="6"/>${t(26, 58, 18, "R")}${t(74, 58, 18, "R")}` },
    { id: "crossbuck", cat: "Railroad", name: "Crossbuck", ref: 61,
      meaning: "White X at the tracks = yield to trains. Look and listen; don't cross if a train is near.",
      art: `<g transform="rotate(35 50 50)"><rect x="3" y="41" width="94" height="18" fill="#fff" stroke="#111" stroke-width="2.5"/></g><g transform="rotate(-35 50 50)"><rect x="3" y="41" width="94" height="18" fill="#fff" stroke="#111" stroke-width="2.5"/></g>` },
    { id: "rrPavement", cat: "Railroad", name: "Railroad pavement marking", ref: 61,
      meaning: "An X with R R painted on the road means a crossing is ahead. Stay behind the stop line while a train passes.",
      art: `<rect x="15" y="2" width="70" height="96" fill="#5F5E5A"/><path d="M25 20L75 80M75 20L25 80" stroke="#fff" stroke-width="5"/>${t(30, 57, 15, "R", "#fff")}${t(70, 57, 15, "R", "#fff")}<rect x="15" y="88" width="70" height="4" fill="#fff"/>` },
    { id: "rrSignal", cat: "Railroad", name: "Crossing lights and gate", ref: 61,
      meaning: "Flashing red lights, a lowered gate or a bell: stop at least 15 ft from the tracks. Wait until the lights stop and the gate is fully up.",
      art: `<rect x="47" y="30" width="6" height="66" fill="#777"/><rect x="20" y="22" width="60" height="22" rx="11" fill="#111"/><circle cx="31" cy="33" r="8" fill="#E53935"/><circle cx="69" cy="33" r="8" fill="#5A1A1A"/><g transform="rotate(35 50 50)"><rect x="12" y="6" width="76" height="8" fill="#fff" stroke="#111" stroke-width="1.5"/></g><rect x="53" y="70" width="44" height="7" fill="#fff" stroke="#C8102E" stroke-width="2" stroke-dasharray="6 6"/>` },

    // ---------- traffic signals ----------
    { id: "steadyRed", cat: "Signals", name: "Steady red", ref: 31,
      meaning: "Stop. You may turn right after a full stop and yielding, unless a sign forbids it (and never in NYC unless a sign allows it).",
      art: light("on", "off", "off") },
    { id: "flashRed", cat: "Signals", name: "Flashing red", ref: 31,
      meaning: "Same as a STOP sign: stop, yield the right-of-way, go when safe.",
      art: light("flash", "off", "off") },
    { id: "steadyYellow", cat: "Signals", name: "Steady yellow", ref: 31,
      meaning: "The light is about to turn red. Be prepared to stop.",
      art: light("off", "on", "off") },
    { id: "flashYellow", cat: "Signals", name: "Flashing yellow", ref: 31,
      meaning: "Drive with caution.",
      art: light("off", "flash", "off") },
    { id: "steadyGreen", cat: "Signals", name: "Steady green", ref: 31,
      meaning: "Go, but still yield to traffic and pedestrians as the right-of-way rules require.",
      art: light("off", "off", "on") },
    { id: "redGreenArrow", cat: "Signals", name: "Red with green arrow", ref: 31,
      meaning: "You may go only in the direction of the arrow, and only if the intersection is clear.",
      art: light("on", "off", "arrowG") },
    { id: "redArrow", cat: "Signals", name: "Red arrow", ref: 31,
      meaning: "Do not turn in the direction of the arrow. No turn on red is allowed at a red arrow.",
      art: light("arrowL", "off", "off") },
    { id: "yellowArrow", cat: "Signals", name: "Yellow arrow", ref: 31,
      meaning: "The protection of the green arrow is ending. If you are turning that way, be prepared to stop.",
      art: light("off", "arrowL", "off") },

    // ---------- lane-use lights ----------
    { id: "laneRedX", cat: "Lane lights", name: "Steady red X", ref: 31,
      meaning: "Do not drive in this lane.",
      art: lane(xMark("#E53935")) },
    { id: "laneYellowX", cat: "Lane lights", name: "Steady yellow X", ref: 31,
      meaning: "Move out of this lane.",
      art: lane(xMark("#FBC02D")) },
    { id: "laneFlashYellowX", cat: "Lane lights", name: "Flashing yellow X", ref: 31,
      meaning: "This lane may be used only for a left turn.",
      art: lane(xMark("#FBC02D") + `<g stroke="#FBC02D" stroke-width="3" stroke-linecap="round"><path d="M20 50h-6M86 50h-6M50 20v-6M50 86v-6"/></g>`) },
    { id: "laneGreenArrow", cat: "Lane lights", name: "Green arrow (lane)", ref: 31,
      meaning: "You may use this lane.",
      art: lane(`<path d="M50 26v46" stroke="#43A047" stroke-width="9" stroke-linecap="round"/><path d="M34 56l16 18 16-18" fill="none" stroke="#43A047" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`) },

    // ---------- pavement markings ----------
    { id: "brokenLine", cat: "Markings", name: "One broken line", ref: 32,
      meaning: "You may pass or change lanes if it is safe.",
      art: road(`<line x1="5" y1="50" x2="95" y2="50" stroke="#fff" stroke-width="3" stroke-dasharray="12 9"/>${car(14, 26, "#43A047")}${car(58, 62, "#43A047")}`) },
    { id: "solidBroken", cat: "Markings", name: "Solid + broken line", ref: 32,
      meaning: "Solid on your side: no passing (except a left turn into a driveway). Broken on your side: you may pass if safe.",
      art: road(`<line x1="5" y1="47" x2="95" y2="47" stroke="#F2B705" stroke-width="3"/><line x1="5" y1="53" x2="95" y2="53" stroke="#F2B705" stroke-width="3" stroke-dasharray="12 9"/>${car(64, 26, "#E53935", -1)}${car(14, 62, "#43A047")}`) },
    { id: "doubleSolid", cat: "Markings", name: "Double solid lines", ref: 32,
      meaning: "No passing or lane changes. Cross only to turn left into or out of the road (driveway, U-turn).",
      art: road(`<line x1="5" y1="47" x2="95" y2="47" stroke="#F2B705" stroke-width="3"/><line x1="5" y1="53" x2="95" y2="53" stroke="#F2B705" stroke-width="3"/>${car(64, 26, "#E53935", -1)}${car(14, 62, "#E53935")}`) },
    { id: "singleSolid", cat: "Markings", name: "One solid line", ref: 32,
      meaning: "You may pass or change lanes only when traffic or an obstruction makes it necessary.",
      art: road(`<line x1="5" y1="50" x2="95" y2="50" stroke="#fff" stroke-width="3"/>${car(14, 26, "#F2B705")}${car(58, 62, "#F2B705")}`) },
    { id: "stopLine", cat: "Markings", name: "Stop line and crosswalk", ref: 32,
      meaning: "Stop before the stop line. With no stop line, stop before the crosswalk.",
      art: `<rect x="5" y="5" width="90" height="90" fill="#5F5E5A"/><rect x="5" y="58" width="90" height="5" fill="#fff"/><rect x="5" y="30" width="90" height="3" fill="#fff"/><rect x="5" y="46" width="90" height="3" fill="#fff"/><rect x="38" y="70" width="22" height="14" rx="3" fill="#43A047"/>` },
    { id: "diamondLane", cat: "Markings", name: "Diamond lane", ref: 33,
      meaning: "A reserved lane (bus, HOV car-pool, bicycles). Use it only if your vehicle qualifies during the posted times.",
      art: `<rect x="20" y="2" width="60" height="96" fill="#5F5E5A"/><polygon points="50,22 66,50 50,78 34,50" fill="none" stroke="#fff" stroke-width="5"/>` },
    { id: "laneArrows", cat: "Markings", name: "Lane arrows", ref: 32,
      meaning: "Arrows show which lane to use for each direction. Be in the correct lane before the solid line begins.",
      art: `<rect x="5" y="2" width="90" height="96" fill="#5F5E5A"/><line x1="50" y1="2" x2="50" y2="98" stroke="#fff" stroke-width="3"/><path d="M28 86V40" stroke="#fff" stroke-width="6"/><path d="M18 50l10-14 10 14" fill="#fff"/><path d="M72 86V52q0-10 10-10" fill="none" stroke="#fff" stroke-width="6"/><path d="M80 32l12 10-12 10z" fill="#fff"/>` },

    // ---------- hand signals ----------
    { id: "handLeft", cat: "Hand signals", name: "Hand signal: left turn", ref: 36,
      meaning: "Arm straight out the window = left turn.",
      art: arm("M44 52H6") },
    { id: "handRight", cat: "Hand signals", name: "Hand signal: right turn", ref: 36,
      meaning: "Arm out and bent up at the elbow = right turn.",
      art: arm("M44 52H18V22") },
    { id: "handStop", cat: "Hand signals", name: "Hand signal: stop / slow", ref: 36,
      meaning: "Arm out and bent down at the elbow = stop or slow down.",
      art: arm("M44 52H18V84") },

    // ---------- other ----------
    { id: "smv", cat: "Other", name: "Slow-moving vehicle", ref: 76,
      meaning: "Reflective orange triangle on horse-drawn vehicles, most farm vehicles, construction equipment and rural mail trucks. Pass only when safe.",
      art: `<polygon points="50,6 96,88 4,88" fill="#C8102E"/><polygon points="50,24 82,80 18,80" fill="#F28C28"/>` }
  ];

  S.forEach((s) => { s.svg = svg(s.art, s.name); });

  window.NYP = window.NYP || {};
  window.NYP.SIGNS = S;
  window.NYP.signSvg = function (id) {
    const s = S.find((x) => x.id === id);
    return s ? s.svg : "";
  };
})();
