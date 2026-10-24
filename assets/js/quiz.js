/* Quiz engine: one question at a time, instant feedback, results screen with review.
   NYP.runQuiz(container, questions, options)
   options: {
     title: string,
     exam: bool            -> score like the real test (14/20 and 2 of 4 signs)
     onFinish(result)      -> called once with { right, total, signRight, signTotal, pass }
     actions: [{ label, onClick, ghost }]  -> extra buttons on the results screen
   } */
(function () {
  const NYP = window.NYP;
  const LETTERS = ["A", "B", "C", "D"];

  NYP.runQuiz = function (box, questions, opt) {
    opt = opt || {};
    const qs = questions.map((q) => ({ q, options: NYP.shuffle(q.a), picked: null }));
    let i = 0;
    let finished = false;

    function signHtml(q) {
      return q.sign && NYP.signSvg ? '<div class="q-art">' + NYP.signSvg(q.sign) + "</div>" : "";
    }

    function renderQuestion() {
      const item = qs[i];
      const q = item.q;
      const answered = item.picked !== null;
      const correct = q.a[0];
      box.innerHTML =
        '<div class="quiz">' +
        '<div class="quiz-head"><b>' + NYP.esc(opt.title || "Quiz") + '</b><span class="count">Question ' + (i + 1) + " of " + qs.length + "</span></div>" +
        '<div class="progress" aria-hidden="true"><i style="width:' + (i / qs.length) * 100 + '%"></i></div>' +
        '<div class="quiz-body">' +
        signHtml(q) +
        '<p class="q-text">' + (q.sign ? '<span class="tag">Sign</span> ' : "") + NYP.esc(q.q) + "</p>" +
        '<div class="options" role="group" aria-label="Answers">' +
        item.options.map((t, k) => {
          let cls = "opt";
          if (answered && t === correct) cls += " right";
          else if (answered && t === item.picked) cls += " wrong";
          return '<button type="button" class="' + cls + '" data-k="' + k + '"' + (answered ? " disabled" : "") + '><span class="letter">' + LETTERS[k] + "</span><span>" + NYP.esc(t) + "</span></button>";
        }).join("") +
        "</div>" +
        (answered
          ? '<div class="explain' + (item.picked === correct ? "" : " no") + '" role="status"><b>' + (item.picked === correct ? "Correct." : "Not quite. The answer is: " + NYP.esc(correct) + ".") + "</b> " + NYP.esc(q.e) + '<span class="ref">NYS Driver’s Manual, page ' + q.p + "</span></div>"
          : "") +
        "</div>" +
        '<div class="quiz-foot">' +
        (answered ? '<button type="button" class="btn" data-next>' + (i === qs.length - 1 ? "See my score" : "Next question") + "</button>" : '<span class="muted" style="font-size:14px">Pick an answer</span>') +
        "</div></div>";

      box.querySelectorAll(".opt").forEach((b) => {
        b.addEventListener("click", () => {
          if (item.picked !== null) return;
          item.picked = item.options[+b.dataset.k];
          NYP.store.record(q.id, item.picked === correct);
          renderQuestion();
          const nb = box.querySelector("[data-next]");
          if (nb) nb.focus({ preventScroll: true });
        });
      });
      const next = box.querySelector("[data-next]");
      if (next) next.addEventListener("click", () => {
        if (i < qs.length - 1) { i++; renderQuestion(); box.scrollIntoView({ block: "start", behavior: "smooth" }); }
        else renderResult();
      });
    }

    function renderResult() {
      const right = qs.filter((x) => x.picked === x.q.a[0]).length;
      const signs = qs.filter((x) => x.q.sign);
      const signRight = signs.filter((x) => x.picked === x.q.a[0]).length;
      const total = qs.length;
      const pass = opt.exam ? right >= Math.ceil(total * 0.7) && signRight >= Math.min(2, signs.length) : right >= Math.ceil(total * 0.7);
      const missed = qs.filter((x) => x.picked !== x.q.a[0]);
      const result = { right, total, signRight, signTotal: signs.length, pass };
      if (!finished) { finished = true; if (opt.onFinish) opt.onFinish(result); }

      let note;
      if (opt.exam) {
        note = "Road signs: " + signRight + " of " + signs.length + " (need 2). Overall: " + right + " of " + total + " (need " + Math.ceil(total * 0.7) + ").";
      } else {
        note = right + " of " + total + " correct.";
      }
      const advice = pass
        ? (right / total >= 0.9 ? "Great work. You're ready for this material." : "You passed. Review the misses below to push your score higher.")
        : "Review the questions you missed below, then try again.";

      box.innerHTML =
        '<div class="quiz">' +
        '<div class="quiz-head"><b>' + NYP.esc(opt.title || "Quiz") + '</b><span class="count">Finished</span></div>' +
        '<div class="progress" aria-hidden="true"><i style="width:100%"></i></div>' +
        '<div class="result">' +
        '<div class="score">' + right + "/" + total + "</div>" +
        '<span class="badge ' + (pass ? "pass" : "fail") + '">' + (pass ? "Pass" : "Not a pass yet") + "</span>" +
        '<p>' + NYP.esc(note) + "</p><p class=\"muted\">" + NYP.esc(advice) + "</p>" +
        '<div class="btn-row" style="justify-content:center" data-actions></div>' +
        "</div>" +
        (missed.length
          ? '<div class="review"><h3>Questions to review (' + missed.length + ")</h3>" +
            missed.map((x) =>
              '<div class="review-item"><b>' + NYP.esc(x.q.q) + "</b>" +
              '<span class="your">Your answer: ' + NYP.esc(x.picked) + "</span>" +
              '<span class="correct">Correct: ' + NYP.esc(x.q.a[0]) + "</span>" +
              '<span class="muted" style="font-size:15px">' + NYP.esc(x.q.e) + " (p. " + x.q.p + ")</span></div>"
            ).join("") + "</div>"
          : '<div class="review"><p class="muted" style="text-align:center">No mistakes. Nice!</p></div>') +
        "</div>";

      const row = box.querySelector("[data-actions]");
      (opt.actions || []).forEach((a) => {
        const b = document.createElement(a.href ? "a" : "button");
        b.className = "btn" + (a.ghost ? " ghost" : "");
        b.textContent = a.label;
        if (a.href) b.href = a.href; else { b.type = "button"; b.addEventListener("click", a.onClick); }
        row.append(b);
      });
      box.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    renderQuestion();
  };

  // Weighted pick without replacement. weightFn(q) -> number > 0
  NYP.weightedPick = function (pool, n, weightFn) {
    const items = pool.map((q) => ({ q, w: Math.max(0.01, weightFn(q)) }));
    const out = [];
    while (out.length < n && items.length) {
      const sum = items.reduce((s, x) => s + x.w, 0);
      let r = Math.random() * sum;
      let k = 0;
      for (; k < items.length - 1; k++) { r -= items[k].w; if (r <= 0) break; }
      out.push(items.splice(k, 1)[0].q);
    }
    return out;
  };

  // Build a 20-question exam: 4 sign questions + 16 others.
  NYP.buildExam = function (pool, weightFn) {
    const w = weightFn || (() => 1);
    const signs = NYP.weightedPick(pool.filter((q) => q.sign), 4, w);
    const rules = NYP.weightedPick(pool.filter((q) => !q.sign), 16, w);
    return NYP.shuffle(signs.concat(rules));
  };
})();
