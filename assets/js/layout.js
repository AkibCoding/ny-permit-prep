/* Shared layout (header, phone tab bar, footer) and progress storage.
   Each page sets <body data-page="home|study|signs|tests|cheat|about">. */
(function () {
  const NYP = (window.NYP = window.NYP || {});

  // ---------- progress storage (this browser only, no login) ----------
  const KEY = "nyp.progress.v1";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* storage blocked: progress just isn't kept */ }
  }
  NYP.store = {
    get() {
      const p = load();
      p.chapters = p.chapters || {};   // { "4": { best, total } }
      p.tests = p.tests || {};         // { "1": { best, last, date } , "q1": ... }
      p.stats = p.stats || {};         // { qid: { seen, wrong } }
      return p;
    },
    set(p) { save(p); },
    record(qid, correct) {
      const p = this.get();
      const s = p.stats[qid] || { seen: 0, wrong: 0 };
      s.seen += 1;
      if (correct) { s.wrong = Math.max(0, s.wrong - 1); } else { s.wrong += 2; }
      p.stats[qid] = s;
      save(p);
    },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} }
  };

  // ---------- icons ----------
  const I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/></svg>',
    sign: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l10 10-10 10L2 12z"/><path d="M12 8v5"/><circle cx="12" cy="16" r=".6" fill="currentColor"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l1.5 1.5L12 7"/><path d="M14 8.5h3"/><path d="M8 14l1.5 1.5L12 13"/><path d="M14 14.5h3"/></svg>',
    sheet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'
  };
  NYP.icons = I;

  const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 1.5L30.5 16 16 30.5 1.5 16z" fill="#F2B705" stroke="#13211B" stroke-width="1.5"/><path d="M11 17.5l3.5 3.5L21.5 12" fill="none" stroke="#13211B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const PAGES = [
    { id: "home", href: "index.html", label: "Home", icon: I.home },
    { id: "study", href: "study.html", label: "Study", icon: I.book },
    { id: "signs", href: "signs.html", label: "Signs", icon: I.sign },
    { id: "tests", href: "tests.html", label: "Tests", icon: I.test },
    { id: "cheat", href: "cheatsheet.html", label: "Cheat sheet", short: "Cheat", icon: I.sheet }
  ];

  function render() {
    const page = document.body.dataset.page || "";
    const cur = (id) => (id === page ? ' aria-current="page"' : "");

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap"><a class="brand" href="index.html">' + LOGO + "NY Permit Prep</a>" +
      '<nav class="top-nav" aria-label="Main">' +
      PAGES.slice(1).map((p) => '<a href="' + p.href + '"' + cur(p.id) + ">" + p.label + "</a>").join("") +
      '<a href="about.html"' + cur("about") + ">About</a></nav></div>";
    document.body.prepend(header);

    const tab = document.createElement("nav");
    tab.className = "tabbar";
    tab.setAttribute("aria-label", "Main");
    tab.innerHTML = PAGES.map((p) => '<a href="' + p.href + '"' + cur(p.id) + ">" + p.icon + "<span>" + (p.short || p.label) + "</span></a>").join("");
    document.body.append(tab);

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap">' +
      "<p><b>NY Permit Prep</b> is a free study tool for the New York State Class D learner permit test. " +
      "It is not affiliated with or endorsed by the NYS Department of Motor Vehicles.</p>" +
      '<p>Content is based on the NYS Driver’s Manual (MV-21), last checked October 2026. Always check the <a href="https://dmv.ny.gov/new-york-state-drivers-manual-practice-tests" rel="noopener">official manual</a> for the latest rules.</p>' +
      '<p><a href="about.html">About</a> · <a href="about.html#privacy">Privacy</a> · <a href="https://github.com/AkibCoding/ny-permit-prep" rel="noopener">GitHub</a></p>' +
      "</div>";
    document.body.append(footer);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();

  // ---------- small helpers ----------
  NYP.shuffle = function (a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  NYP.esc = function (s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  };
})();
