/* Chapter study content (MV-21 chapters 4–11). Text is paraphrased from the manual; p = page.
   Diagrams are original SVG; colors that must follow the theme use the .tx / .tm / .ln classes. */
(function () {
  // ---------- small SVG helpers ----------
  const car = (x, y, c, dir) => {
    // dir: "r","l","u","d"
    if (dir === "r" || dir === "l") {
      const nose = dir === "r" ? `${x + 30},${y + 3} ${x + 37},${y + 9} ${x + 30},${y + 15}` : `${x},${y + 3} ${x - 7},${y + 9} ${x},${y + 15}`;
      return `<rect x="${x}" y="${y}" width="30" height="18" rx="4" fill="${c}"/><polygon points="${nose}" fill="${c}"/>`;
    }
    const nose = dir === "u" ? `${x + 3},${y} ${x + 9},${y - 7} ${x + 15},${y}` : `${x + 3},${y + 30} ${x + 9},${y + 37} ${x + 15},${y + 30}`;
    return `<rect x="${x}" y="${y}" width="18" height="30" rx="4" fill="${c}"/><polygon points="${nose}" fill="${c}"/>`;
  };
  const T = (x, y, s, txt, cls = "tx", w = 400, anchor = "start") => `<text x="${x}" y="${y}" class="${cls}" font-size="${s}" font-weight="${w}" text-anchor="${anchor}">${txt}</text>`;
  const GO = "#2E9E5B", STOPC = "#D64545", YOU = "#2F6FD1", AMB = "#E3A008";
  const mk = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5L1 9z" fill="${c}"/></marker>`;
  const ARROW = `<defs>${mk("ah-go", "#2E9E5B")}${mk("ah-you", "#2F6FD1")}${mk("ah-w", "#FFFFFF")}${mk("ah-gray", "#888888")}</defs>`;

  // ---------- diagrams ----------
  const D = {};

  D.lanes = (() => {
    const panel = (y, lines, cars, title, l1, l2) => `
      <rect x="10" y="${y}" width="300" height="84" rx="4" fill="#5F5E5A"/>${lines}${cars}
      ${T(330, y + 26, 17, title, "tx", 700)}${T(330, y + 50, 15, l1, "tm")}${T(330, y + 70, 15, l2, "tm")}`;
    const L = (y, color, dash) => `<line x1="10" y1="${y}" x2="310" y2="${y}" stroke="${color}" stroke-width="3" ${dash ? 'stroke-dasharray="20 14"' : ""}/>`;
    return `<svg viewBox="0 0 600 410" role="img" aria-label="Four kinds of lane lines and who may pass">
      ${panel(10, L(52, "#fff", 1), car(50, 20, GO, "r") + car(210, 66, GO, "r"), "One broken line", "Pass or change lanes", "when it is safe")}
      ${panel(110, L(148, "#F2B705") + L(156, "#F2B705", 1), car(220, 120, STOPC, "l") + car(50, 166, GO, "r"), "Solid + broken", "Solid on your side: no passing", "Broken on your side: may pass")}
      ${panel(210, L(248, "#F2B705") + L(256, "#F2B705"), car(220, 220, STOPC, "l") + car(50, 266, STOPC, "r"), "Double solid", "No passing from either side", "Cross only to turn left in/out")}
      ${panel(310, L(352, "#fff"), car(50, 320, AMB, "r") + car(210, 366, AMB, "r"), "One solid line", "Change lanes only when", "traffic or an obstruction requires")}
    </svg>`;
  })();

  D.rightOfWay = (() => {
    const inter = (ox) => `<rect x="${ox + 105}" y="0" width="80" height="250" fill="#5F5E5A"/><rect x="${ox}" y="85" width="290" height="80" fill="#5F5E5A"/>
      <line x1="${ox + 145}" y1="0" x2="${ox + 145}" y2="85" stroke="#F2B705" stroke-width="2"/><line x1="${ox + 145}" y1="165" x2="${ox + 145}" y2="250" stroke="#F2B705" stroke-width="2"/>
      <line x1="${ox}" y1="125" x2="${ox + 105}" y2="125" stroke="#F2B705" stroke-width="2"/><line x1="${ox + 185}" y1="125" x2="${ox + 290}" y2="125" stroke="#F2B705" stroke-width="2"/>`;
    return `<svg viewBox="0 0 600 320" role="img" aria-label="Two right-of-way situations">${ARROW}
      ${inter(0)}
      ${car(156, 190, YOU, "u")}
      <path d="M165 186 V150 Q165 120 120 118 H95" fill="none" stroke="${YOU}" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#ah-you)"/>
      ${car(116, 20, GO, "d")}
      <path d="M125 58 V235" fill="none" stroke="${GO}" stroke-width="3" marker-end="url(#ah-go)"/>
      ${T(145, 278, 16, "Left turn: oncoming goes first", "tx", 700, "middle")}
      ${T(145, 300, 14, "You (blue) wait, then turn", "tm", 400, "middle")}
      ${inter(310)}
      ${car(466, 190, YOU, "u")}
      ${car(548, 95, GO, "l")}
      <line x1="310" y1="85" x2="600" y2="85" stroke="none"/>
      <path d="M540 104 H440" fill="none" stroke="${GO}" stroke-width="3" marker-end="url(#ah-go)"/>
      ${T(455, 278, 16, "Same time: car on right goes first", "tx", 700, "middle")}
      ${T(455, 300, 14, "You (blue) are on its left, so you wait", "tm", 400, "middle")}
    </svg>`;
  })();

  D.schoolBus = `<svg viewBox="0 0 600 250" role="img" aria-label="Traffic in both directions stops for a school bus with flashing red lights">
    <rect x="0" y="50" width="600" height="130" fill="#5F5E5A"/>
    <line x1="0" y1="115" x2="600" y2="115" stroke="#F2B705" stroke-width="3" stroke-dasharray="20 14"/>
    <rect x="250" y="62" width="120" height="44" rx="6" fill="#F2B705"/>
    ${T(310, 90, 14, "SCHOOL BUS", "", 700, "middle").replace('class=""', 'fill="#111"')}
    <circle cx="256" cy="68" r="6" fill="#E53935"/><circle cx="364" cy="68" r="6" fill="#E53935"/>
    <rect x="236" y="64" width="12" height="18" fill="#E53935"/>
    ${car(440, 75, YOU, "l")}
    <line x1="372" y1="40" x2="436" y2="40" class="ln" stroke-width="2"/>
    <line x1="372" y1="34" x2="372" y2="46" class="ln" stroke-width="2"/><line x1="436" y1="34" x2="436" y2="46" class="ln" stroke-width="2"/>
    ${T(404, 30, 14, "20+ ft", "tx", 700, "middle")}
    ${car(150, 140, YOU, "r")}
    ${T(165, 205, 15, "Stop", "tx", 700, "middle")}${T(455, 205, 15, "Stop", "tx", 700, "middle")}
    ${T(300, 238, 15, "Red lights flashing: traffic from BOTH directions stops, even on a divided highway", "tm", 400, "middle")}
  </svg>`;

  D.parking = (() => {
    const bracket = (x1, x2, label) => `<line x1="${x1}" y1="150" x2="${x2}" y2="150" class="ln" stroke-width="2"/><line x1="${x1}" y1="143" x2="${x1}" y2="157" class="ln" stroke-width="2"/><line x1="${x2}" y1="143" x2="${x2}" y2="157" class="ln" stroke-width="2"/>${T((x1 + x2) / 2, 176, 18, label, "tx", 800, "middle")}`;
    return `<svg viewBox="0 0 600 250" role="img" aria-label="No-parking distances along a curb">
      <rect x="0" y="60" width="600" height="70" fill="#5F5E5A"/><rect x="0" y="130" width="600" height="8" fill="#B9B9B2"/>
      <g><rect x="20" y="104" width="12" height="22" rx="3" fill="#D64545"/><rect x="16" y="100" width="20" height="6" rx="2" fill="#D64545"/></g>
      ${bracket(32, 120, "15 ft")}${T(26, 222, 13, "Hydrant", "tm", 400, "start")}
      <g fill="#fff">${[0, 1, 2, 3, 4].map((k) => `<rect x="${170 + k * 9}" y="64" width="5" height="62"/>`).join("")}</g>
      ${bracket(212, 280, "20 ft")}${T(170, 222, 13, "Crosswalk at", "tm")}${T(170, 238, 13, "intersection", "tm")}
      <line x1="345" y1="138" x2="345" y2="96" stroke="#888" stroke-width="3"/><polygon points="338,80 352,80 360,88 360,100 352,108 338,108 330,100 330,88" fill="#C8102E"/>
      ${bracket(345, 430, "30 ft")}${T(318, 222, 13, "STOP / YIELD", "tm")}${T(318, 238, 13, "or traffic light", "tm")}
      <line x1="490" y1="60" x2="490" y2="130" stroke="#3A3A3A" stroke-width="4"/><line x1="500" y1="60" x2="500" y2="130" stroke="#3A3A3A" stroke-width="4"/>
      ${bracket(500, 590, "50 ft")}${T(470, 222, 13, "Railroad", "tm")}${T(470, 238, 13, "crossing", "tm")}
      ${T(300, 40, 15, "Do not park closer than this to each item", "tm", 400, "middle")}
    </svg>`;
  })();

  D.twoSecond = `<svg viewBox="0 0 600 200" role="img" aria-label="Two-second following distance">${ARROW}
    <rect x="0" y="70" width="600" height="70" fill="#5F5E5A"/><line x1="0" y1="105" x2="600" y2="105" stroke="#fff" stroke-width="3" stroke-dasharray="20 14"/>
    <line x1="400" y1="40" x2="400" y2="70" stroke="#888" stroke-width="3"/><rect x="384" y="22" width="32" height="20" rx="3" fill="#00704A"/>
    ${car(420, 112, GO, "r")}${car(160, 112, YOU, "r")}
    <path d="M200 160 H392" stroke="#888888" stroke-width="2" fill="none" marker-end="url(#ah-gray)"/>
    ${T(296, 186, 15, "“one thousand one, one thousand two”", "tx", 700, "middle")}
    ${T(300, 18, 14, "When the car ahead passes a sign, start counting", "tm", 400, "middle")}
    ${T(10, 60, 14, "You should reach the sign after you finish the count", "tm")}
  </svg>`;

  D.roundabout = `<svg viewBox="0 0 600 300" role="img" aria-label="Roundabout traffic moves counterclockwise; entering traffic yields">${ARROW}
    <circle cx="300" cy="150" r="120" fill="#5F5E5A"/><rect x="270" y="250" width="60" height="50" fill="#5F5E5A"/><rect x="270" y="0" width="60" height="50" fill="#5F5E5A"/>
    <rect x="400" y="120" width="200" height="60" fill="#5F5E5A"/><rect x="0" y="120" width="200" height="60" fill="#5F5E5A"/>
    <circle cx="300" cy="150" r="60" fill="#7BAF7F"/>
    <path d="M300 60 A90 90 0 0 0 210 150" fill="none" stroke="#fff" stroke-width="3" marker-end="url(#ah-w)"/>
    <path d="M210 160 A90 90 0 0 0 300 240" fill="none" stroke="#fff" stroke-width="3" marker-end="url(#ah-w)"/>
    <path d="M310 240 A90 90 0 0 0 390 160" fill="none" stroke="#fff" stroke-width="3" marker-end="url(#ah-w)"/>
    <path d="M390 140 A90 90 0 0 0 310 60" fill="none" stroke="#fff" stroke-width="3" marker-end="url(#ah-w)"/>
    ${car(308, 262, YOU, "u")}<line x1="270" y1="255" x2="330" y2="255" stroke="#fff" stroke-width="3" stroke-dasharray="6 4"/>
    ${car(200, 132, GO, "d")}
    ${T(450, 230, 15, "Counterclockwise", "tx", 700)}${T(450, 252, 14, "Look left, yield to cars", "tm")}${T(450, 270, 14, "already in the circle", "tm")}
  </svg>`;

  D.bac = (() => {
    const x = (v) => 30 + (v / 0.2) * 540;
    return `<svg viewBox="0 0 600 190" role="img" aria-label="Blood alcohol content levels">
      <rect x="${x(0)}" y="60" width="${x(0.05) - x(0)}" height="36" fill="#9AD0A8"/>
      <rect x="${x(0.05)}" y="60" width="${x(0.08) - x(0.05)}" height="36" fill="#F2C94C"/>
      <rect x="${x(0.08)}" y="60" width="${x(0.18) - x(0.08)}" height="36" fill="#EB8A57"/>
      <rect x="${x(0.18)}" y="60" width="${x(0.2) - x(0.18)}" height="36" fill="#C0392B"/>
      <rect x="${x(0.02)}" y="104" width="${x(0.07) - x(0.02)}" height="10" rx="3" fill="${YOU}"/>
      ${T(x(0.045), 134, 13, "Under 21: .02–.07 = Zero Tolerance", "tx", 700, "middle")}
      ${[0, 0.05, 0.08, 0.18].map((v) => `<line x1="${x(v)}" y1="52" x2="${x(v)}" y2="100" class="ln" stroke-width="2"/>${T(x(v), 44, 15, v === 0 ? "0" : "." + String(Math.round(v * 100)).padStart(2, "0"), "tx", 700, "middle")}`).join("")}
      ${T(x(0.065), 160, 13, "Over .05", "tx", 700, "middle")}${T(x(0.065), 176, 13, "impaired", "tm", 400, "middle")}
      ${T(x(0.13), 160, 13, ".08+", "tx", 700, "middle")}${T(x(0.13), 176, 13, "intoxicated (DWI)", "tm", 400, "middle")}
      ${T(x(0.19), 160, 13, ".18+", "tx", 700, "middle")}${T(x(0.19), 176, 13, "aggravated", "tm", 400, "middle")}
      ${T(30, 20, 14, "Blood alcohol content (BAC)", "tm")}
    </svg>`;
  })();

  D.drinks = `<svg viewBox="0 0 600 170" role="img" aria-label="12 oz beer, 5 oz wine and 1.5 oz liquor contain the same alcohol">
    <rect x="60" y="30" width="44" height="80" rx="6" fill="#E3A008"/><rect x="60" y="22" width="44" height="14" rx="4" fill="#F5F5F0"/>
    ${T(82, 140, 15, "12 oz beer", "tx", 700, "middle")}
    ${T(170, 80, 34, "=", "tx", 800, "middle")}
    <path d="M232 30 h44 q0 40 -22 46 q-22 -6 -22 -46z" fill="#8E2B44"/><line x1="254" y1="76" x2="254" y2="104" class="ln" stroke-width="4"/><line x1="236" y1="106" x2="272" y2="106" class="ln" stroke-width="4"/>
    ${T(254, 140, 15, "5 oz wine", "tx", 700, "middle")}
    ${T(340, 80, 34, "=", "tx", 800, "middle")}
    <rect x="404" y="62" width="32" height="44" rx="4" fill="#C98A3A"/>
    ${T(420, 140, 15, "1½ oz liquor", "tx", 700, "middle")}
    ${T(520, 70, 15, "Same alcohol", "tx", 700, "middle")}${T(520, 92, 14, "~1 hour each", "tm", 400, "middle")}${T(520, 110, 14, "to leave the body", "tm", 400, "middle")}
  </svg>`;

  D.trainEscape = `<svg viewBox="0 0 600 260" role="img" aria-label="If stalled on tracks with a train coming, get out and move away at an angle toward the train">${ARROW}
    <rect x="0" y="150" width="600" height="40" fill="#8A7F72"/>
    <line x1="0" y1="158" x2="600" y2="158" stroke="#3A3A3A" stroke-width="4"/><line x1="0" y1="182" x2="600" y2="182" stroke="#3A3A3A" stroke-width="4"/>
    <rect x="20" y="146" width="110" height="48" rx="8" fill="#555"/><rect x="100" y="152" width="26" height="18" rx="3" fill="#CFE3F5"/>
    ${T(75, 214, 14, "Train coming", "tm", 400, "middle")}
    <path d="M140 170 H200" stroke="#888888" stroke-width="3" marker-end="url(#ah-gray)"/>
    <rect x="330" y="154" width="54" height="32" rx="6" fill="${YOU}"/>
    <circle cx="352" cy="140" r="7" fill="#2E9E5B"/>
    <path d="M345 145 L280 80" stroke="${GO}" stroke-width="4" marker-end="url(#ah-go)"/>
    ${T(390, 70, 16, "Get out and move away", "tx", 700)}${T(390, 92, 14, "toward the train, at about 45°,", "tm")}${T(390, 110, 14, "so debris won’t hit you", "tm")}
    ${T(357, 214, 14, "Stalled car", "tm", 400, "middle")}
    ${T(10, 248, 14, "Then call the number on the Emergency Notification sign.", "tm")}
  </svg>`;

  D.lights = (() => {
    const row = (y, len, label, sub, c) => `<rect x="160" y="${y}" width="${len}" height="20" rx="4" fill="${c}"/>${T(150, y + 15, 18, label, "tx", 800, "end")}${T(170 + len, y + 15, 14, sub, "tm")}`;
    return `<svg viewBox="0 0 600 190" role="img" aria-label="Headlight distances">
      ${row(20, 70, "200 ft", "Low beams: car ahead of you", YOU)}
      ${row(60, 122, "350 ft", "How far headlights reach", "#7FA4D9")}
      ${row(100, 175, "500 ft", "Low beams: oncoming car", YOU)}
      ${row(140, 250, "1,000 ft", "Lights on below this", AMB)}
    </svg>`;
  })();

  D.truck = `<svg viewBox="0 0 600 260" role="img" aria-label="Truck blind spots">
    <rect x="0" y="40" width="600" height="180" fill="#5F5E5A"/>
    <line x1="0" y1="100" x2="600" y2="100" stroke="#fff" stroke-width="3" stroke-dasharray="20 14"/><line x1="0" y1="160" x2="600" y2="160" stroke="#fff" stroke-width="3" stroke-dasharray="20 14"/>
    <rect x="40" y="104" width="150" height="52" fill="#D64545" opacity=".45"/>
    <rect x="470" y="104" width="70" height="52" fill="#D64545" opacity=".45"/>
    <polygon points="200,100 360,100 440,44 200,44" fill="#D64545" opacity=".45"/>
    <polygon points="200,160 420,160 420,216 200,216" fill="#D64545" opacity=".45"/>
    <rect x="190" y="108" width="210" height="44" rx="3" fill="#E9E9E2"/><rect x="404" y="110" width="62" height="40" rx="6" fill="#CFCFC6"/>
    ${T(295, 136, 14, "TRAILER", "", 700, "middle").replace('class=""', 'fill="#333"')}
    ${T(115, 136, 13, "Rear", "", 700, "middle").replace('class=""', 'fill="#fff"')}
    ${T(505, 136, 13, "Front", "", 700, "middle").replace('class=""', 'fill="#fff"')}
    ${T(300, 30, 15, "Red = “no zones” the driver can’t see you", "tm", 400, "middle")}
    ${T(300, 246, 14, "Long-hood tractors can have a blind spot up to 20 ft in front", "tm", 400, "middle")}
  </svg>`;

  // ---------- chapters ----------
  const CH = [
    { n: 4, title: "Traffic Control", pages: "29–33", mins: 45,
      intro: "Signs, traffic lights and lane lines. Every test has 4 road-sign questions and you must get 2 right, so this chapter matters most.",
      keys: [
        "<b>Shape and color tell you the type of sign.</b> White rectangle = rule. Yellow diamond = warning. Orange = work zone. Green = directions. Blue = services. Red circle with slash = not allowed.",
        "<b>STOP sign:</b> stop before the stop line. No line? Stop before the crosswalk. Neither? Stop where you can see cross traffic, before entering the intersection.",
        "<b>Steady red:</b> stop. You may turn right after a full stop and yielding, unless a sign says NO TURN ON RED. <b>No right on red in New York City</b> unless a sign allows it.",
        "<b>Left on red</b> is allowed only from a one-way street onto another one-way street, after a full stop.",
        "<b>Flashing red</b> = STOP sign. <b>Flashing yellow</b> = caution. <b>Steady yellow</b> = about to turn red. <b>Red arrow</b> = no turn that way. <b>Yellow arrow</b> = the green arrow is ending.",
        "<b>Traffic light not working?</b> Treat it like a STOP sign.",
        "<b>White lines</b> separate traffic going the same way. <b>Yellow lines</b> separate opposite directions.",
        "<b>A traffic officer overrides</b> every light, sign and pavement marking."
      ],
      diagrams: [{ svg: "lanes", cap: "Only the line on your side counts. Cross a double solid line only to turn left into or out of the road (for example, a driveway)." }],
      signs: ["stop", "yield", "noRightTurn", "doNotPass", "noTurnOnRed", "speed55", "curve", "roadWork", "destination", "gas", "steadyRed", "flashRed", "redGreenArrow", "redArrow", "laneRedX", "laneYellowX"],
      numbers: [["25 mph", "lowest work-zone limit that may be posted"]],
      tip: "Memory hook: officer beats everything; flashing red = STOP sign; left on red only one-way to one-way."
    },
    { n: 5, title: "Intersections and Turns", pages: "34–38", mins: 35,
      intro: "Right-of-way decides who goes first. Most crashes happen at intersections, so the test asks about this a lot.",
      keys: [
        "<b>Already in the intersection?</b> They go first.",
        "<b>Turning left?</b> You wait for oncoming traffic going straight or turning right, even when turning into a driveway with no signs.",
        "<b>Arrive at the same time at right angles</b> (no signs, or STOP signs on both): <b>the driver on the left waits</b> for the driver on the right.",
        "<b>Leaving a driveway or parking lot:</b> stop and wait for traffic and pedestrians.",
        "<b>Traffic circle or roundabout:</b> yield to cars already inside.",
        "<b>Green light but traffic backed up ahead?</b> Don't enter. Never block an intersection.",
        "<b>Emergency vehicle</b> with lights or siren, from any direction (even the opposite lane): pull to the right edge and stop. In an intersection? Drive out of it first.",
        "<b>Move Over law:</b> slow down for stopped emergency or hazard vehicles (police, ambulance, tow trucks) with lights on. On expressways and parkways, also move out of the lane next to them.",
        "<b>Blue light</b> = volunteer firefighter. <b>Green light</b> = volunteer ambulance. Yield as a courtesy; it isn't required.",
        "<b>Signal at least 100 ft</b> before turning. Waiting to turn left? Keep your wheels straight.",
        "<b>U-turns:</b> only from the left part of the lane nearest the center line. Never where drivers can't see you from 500 ft, on a limited-access expressway, in a school zone, or in an NYC business district."
      ],
      diagrams: [{ svg: "rightOfWay", cap: "Left-turners wait for oncoming traffic. At the same time from different sides, the car on the right goes first." }],
      signs: ["handLeft", "handRight", "handStop"],
      numbers: [["100 ft", "signal before a turn or lane change"], ["500 ft", "others must see you before a U-turn"]],
      tip: "Memory hook: left-turners wait, the car on the left waits, driveways wait, and people on foot always go first."
    },
    { n: 6, title: "How to Pass", pages: "39–41", mins: 20,
      intro: "A short chapter with a few must-know rules, including the school bus rule that shows up on nearly every test.",
      keys: [
        "<b>Pass on the left</b>, and never go over the speed limit to pass.",
        "<b>Don't pass on the left if:</b> there's a solid yellow line on your side; you can't get back before an oncoming car is within 200 ft; you're near a curve or hilltop you can't see past; you're within 100 ft of a railroad crossing on a two-way road, or of a bridge, tunnel or viaduct when your view is blocked.",
        "<b>Before passing:</b> mirrors, signal, then look over your left shoulder for the blind spot.",
        "<b>Return</b> only when you can see the front bumper of the passed car in your inside mirror.",
        "<b>Pass on the right only</b> when the car ahead is turning left, or there are 2+ lanes in your direction. Never on the shoulder.",
        "<b>Never pass a car stopped at a crosswalk.</b> Someone may be crossing.",
        "<b>Bicycles:</b> pass on the left at a safe distance. <b>Motorcycles:</b> give them a full lane.",
        "<b>Being passed:</b> slow down slightly and stay centered in your lane.",
        "<b>School bus, flashing red:</b> stop from <b>both directions</b>, even on a divided highway or in a school parking lot, at least 20 ft away. Go only when the bus moves or the driver or an officer waves you on.",
        "<b>School bus, flashing yellow:</b> slow down and get ready to stop."
      ],
      diagrams: [{ svg: "schoolBus", cap: "Passing a stopped school bus: at least $250 fine for a first offense. Three in three years means your license is revoked." }],
      signs: ["doNotPass"],
      numbers: [["200 ft", "oncoming car limit when passing"], ["100 ft", "no passing near a railroad crossing"], ["20 ft", "stop this far from a school bus"]],
      tip: "This one surprises many people: you stop for a school bus with red lights even when it's on the other side of a divided highway."
    },
    { n: 7, title: "Parallel Parking", pages: "42–44", mins: 20,
      intro: "Mostly distances. Learn the numbers and these are easy points.",
      keys: [
        "<b>Parallel parking:</b> stop next to the car in front of the space with about 2 ft between you, back in slowly looking through the rear window, and finish with your wheels <b>no more than 1 ft</b> from the curb.",
        "<b>Don't open your door</b> on the road side if it would interfere with bikes or traffic.",
        "<b>On a hill:</b> set the parking brake, shift to Park (or 1st gear in a manual), and turn the wheels toward the curb.",
        "<b>Leaving a space:</b> wheels straight, signal, look over your shoulders, and pull out when safe.",
        "<b>NO PARKING:</b> you may stop briefly to load or unload passengers or things. <b>NO STANDING:</b> passengers only, and the driver stays in the car. <b>NO STOPPING:</b> only to obey a signal, sign or officer, or to avoid a crash.",
        "<b>Never park:</b> on a sidewalk or crosswalk, in an intersection, on railroad tracks, on a bridge or in a tunnel, double-parked, or in front of a driveway.",
        "<b>Disability spaces:</b> only with the permit or plates, and only when the permit holder is in the vehicle. Don't park in the striped area beside them either."
      ],
      diagrams: [{ svg: "parking", cap: "Fire hydrant 15 ft (unless a licensed driver stays in the car). Fire station driveway: 20 ft on the same side, 75 ft across the street." }],
      signs: [],
      numbers: [["1 ft", "max distance from curb"], ["15 ft", "fire hydrant"], ["20 ft", "crosswalk at an intersection"], ["30 ft", "STOP, YIELD sign or traffic light"], ["50 ft", "railroad crossing"], ["20 / 75 ft", "fire station driveway (same side / across)"]],
      tip: "Count up: hydrant 15, crosswalk 20, sign or light 30, railroad 50."
    },
    { n: 8, title: "Defensive Driving", pages: "45–53", mins: 35,
      intro: "Speed, following distance, seat belts, phones, roundabouts, work zones and drowsy driving.",
      keys: [
        "<b>Speed:</b> 55 mph when no limit is posted; <b>25 mph in NYC</b> unless posted. You can still get a ticket for a speed that isn't reasonable for the conditions.",
        "<b>Following distance:</b> at least 2 seconds; <b>3–4 seconds</b> in bad weather or behind trucks.",
        "<b>Tailgater?</b> Change lanes or let them pass. Don't brake suddenly.",
        "<b>Aggressive driver:</b> no eye contact, stay calm, move away. If they follow you, don't stop or get out; drive to a police station.",
        "<b>Seat belts:</b> required for the driver and every passenger. The driver is responsible for passengers under 16. Under 4: car seat. Ages 4–7: booster seat.",
        "<b>Air bags:</b> sit at least 10 inches away, hands at 9 and 3. Never put a rear-facing infant seat in front of an air bag.",
        "<b>Work zones:</b> speeding fines double, even with no workers there. Merge early when a lane is closed.",
        "<b>Roundabouts:</b> go counterclockwise, look left, and yield to cars already inside. Signal right to exit.",
        "<b>Phones:</b> hand-held calls cost up to $200 and 5 points. Texting is illegal. Hands-free is OK.",
        "<b>Drowsy?</b> Pull over somewhere safe and nap 15–45 minutes. Rest every 100 miles or 2 hours. The radio or an open window won't keep you safe.",
        "<b>Tires:</b> at least 2/32 inch of tread. Penny test: if you can see all of Lincoln's head, replace the tire."
      ],
      diagrams: [{ svg: "twoSecond", cap: "Two-second rule. In rain, snow, or behind a truck, count to 3 or 4." }, { svg: "roundabout", cap: "Roundabouts: traffic inside has the right-of-way. Keep the crosswalk clear while you wait." }],
      signs: ["speed55", "advisory"],
      numbers: [["55 mph", "limit when none is posted"], ["25 mph", "NYC limit"], ["2 sec", "minimum following distance"], ["10 in", "chest to air bag"], ["2/32 in", "minimum tire tread"], ["100 mi / 2 hr", "rest stop"]],
      tip: "Under the posted limit isn't automatically safe. In fog, ice or heavy rain, slow down further."
    },
    { n: 9, title: "Alcohol and Other Drugs", pages: "54–60", mins: 20,
      intro: "Mostly about BAC and how alcohol works. Learn the concepts and the three BAC numbers; skip the fine details of the penalty table.",
      keys: [
        "<b>Alcohol</b> slows your reactions, weakens vision and judgment of speed and distance, and makes you take chances. It starts with the first drink.",
        "<b>BAC depends on</b> how much you drink, how fast, and your body weight, not on the type of drink.",
        "<b>Only time lowers BAC.</b> Coffee, cold showers and exercise don't. Eating slows absorption a little but can't prevent intoxication.",
        "<b>Over .05</b> = impaired. <b>.08</b> = intoxicated (DWI). <b>.18</b> = aggravated DWI.",
        "<b>Under 21 (Zero Tolerance):</b> any BAC from .02 to .07 means a 6-month suspension after a DMV hearing.",
        "<b>Other drugs</b> (marijuana, cold medicines, tranquilizers, some prescriptions) can impair you too. Check before driving. Alcohol plus drugs is especially dangerous.",
        "<b>Implied Consent:</b> by driving in NY you agree to a chemical test if arrested. Refuse, and your license is revoked even if you're found not guilty.",
        "<b>No test needed to convict:</b> an officer's testimony about your driving and behavior can be enough.",
        "<b>Open containers</b> and drinking in a car on the road are illegal for drivers and passengers.",
        "<b>Leandra's Law:</b> drunk driving with a child under 16 in the car can be charged as a felony."
      ],
      diagrams: [{ svg: "bac", cap: "BAC levels in New York." }, { svg: "drinks", cap: "Same alcohol in each. None is “safer” than the others." }],
      signs: [],
      numbers: [[".05+", "impaired"], [".08", "intoxicated (DWI)"], [".18", "aggravated DWI"], [".02–.07", "Zero Tolerance, under 21"], ["~1 hour", "to clear one drink"]],
      tip: "Test favorite: “What lowers BAC?” Only time."
    },
    { n: 10, title: "Special Driving Conditions", pages: "60–66", mins: 35,
      intro: "Railroad crossings, expressways, night driving, bad weather and emergencies. Very useful for a Buffalo winter.",
      keys: [
        "<b>Railroad lights, gates or bell:</b> stop at least 15 ft from the tracks. Never go around gates. Cross only when your whole car fits on the other side.",
        "<b>Always stop at crossings:</b> school buses (even empty), other buses with passengers, and vehicles carrying explosives or flammable cargo. Expect it when you follow one.",
        "<b>Expressways:</b> use the ramp to speed up and merge. Short ramp? Stop, wait for a big gap, then go. Missed your exit or going the wrong way? Take the next exit. Never back up or cross the median. Signal 100 ft before your exit.",
        "<b>Headlights</b> are required from ½ hour after sunset to ½ hour before sunrise, when you can see less than 1,000 ft, and whenever your wipers are on.",
        "<b>Dim to low beams</b> within 500 ft of oncoming cars and 200 ft of cars ahead. Blinded by oncoming lights? Look at the right edge of the road.",
        "<b>Fog, rain or snow:</b> low beams. Hydroplaning happens at higher speeds, especially on worn or under-inflated tires.",
        "<b>Skids:</b> rear wheels slide left, steer left. Front-wheel skid: foot off the gas, shift to neutral, then steer once traction returns. ABS: steady pressure. No ABS: pump gently.",
        "<b>Winter:</b> bridges, ramps and overpasses freeze first. Studded tires are allowed Oct 16 – Apr 30. Deer crashes peak Oct–Dec, at dawn and dusk.",
        "<b>Emergencies, rule #1: don't panic.</b> Blowout: hold the wheel, ease off the gas, don't brake until controlled. Brake failure: pump the pedal, then the parking brake gently, then a lower gear. Stuck gas pedal: neutral and brake; don't turn off the ignition. Off the pavement: ease off, brake gently, steer back once slowed. Head-on car in your lane: slow down, go right, honk. Never swerve left. Car in water: escape through a window."
      ],
      diagrams: [{ svg: "trainEscape", cap: "Running down the track with the train sends you into the debris path." }, { svg: "lights", cap: "Headlight distances to remember." }],
      signs: ["rrAdvance", "crossbuck", "rrPavement", "rrSignal"],
      numbers: [["15 ft", "stop from railroad tracks"], ["350 ft", "headlight range"], ["500 ft", "low beams, oncoming"], ["200 ft", "low beams, following"], ["1,000 ft", "lights on below this visibility"]],
      tip: "Simple rule to remember: wipers on, headlights on."
    },
    { n: 11, title: "Sharing the Road", pages: "67–76", mins: 25,
      intro: "Pedestrians, bicycles, motorcycles, trucks, farm vehicles and horses.",
      keys: [
        "<b>Pedestrians</b> have the right-of-way at all crosswalks, marked or unmarked. Check both sides when turning.",
        "<b>Blind pedestrians</b> (guide dog, white or metal cane): always yield, even if the signal is against them.",
        "<b>No sidewalk?</b> Pedestrians should walk facing traffic.",
        "<b>Backing out with children nearby:</b> get out and check behind the car first.",
        "<b>Bicyclists</b> follow the same traffic laws and ride in the bike lane or near the right edge. Helmets for ages 1–13. At night: headlight visible 500 ft, red taillight visible 300 ft.",
        "<b>Right on red:</b> look left, right, left and behind for bikes. Check for bikes before opening your door.",
        "<b>Motorcycles</b> are hard to see and their speed is hard to judge. Give them a full lane. At most 2 may ride side by side; they can't share a lane with a car.",
        "<b>Large trucks:</b> big blind spots (sides, rear, up to 20 ft in front), much longer stopping distances, and wide right turns (they swing left first).",
        "<b>After passing a truck</b>, return only when you can see its whole front in your mirror. Truck backing up? Wait. Stopped behind a truck or bus on a hill? Leave room in case it rolls back.",
        "<b>Slow-moving vehicles</b> show an orange triangle. ATVs and snowmobiles must stop, yield and cross at a 90° angle. <b>Never honk</b> near a horse."
      ],
      diagrams: [{ svg: "truck", cap: "If you can't see the truck driver in their mirror, they can't see you." }],
      signs: ["smv", "pedestrians"],
      numbers: [["2", "max motorcycles side by side"], ["20 ft", "truck front blind spot"], ["500 / 300 ft", "bike lights at night"], ["1–13", "bike helmet ages"]],
      tip: "Trucks swing left before turning right. Don't slip into the gap beside them."
    }
  ];

  window.NYP = window.NYP || {};
  window.NYP.CHAPTERS = CH;
  window.NYP.DIAGRAMS = D;
})();
