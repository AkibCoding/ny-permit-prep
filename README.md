# NY Permit Prep

A free study site for the New York State Class D learner permit (written) test.
No login, no ads, no tracking. Progress is saved only in the visitor's own browser.

**Not affiliated with the NYS DMV.** Content is paraphrased from the NYS Driver's Manual
(MV-21), and every question cites the manual page it comes from.

## What's inside

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Test overview, links, the visitor's progress |
| Study | `study.html?c=4` … `?c=11` | One page per chapter: key points, diagrams, numbers, signs, quiz |
| Road signs | `signs.html` | All 47 signs/signals/markings/hand signals, filters, flashcard mode |
| Practice tests | `tests.html` | Tests 1–5 (100 unique questions), smart random tests, mistake review, quick test |
| Cheat sheet | `cheatsheet.html` | One-page revision sheet |
| About | `about.html` | Disclaimer, privacy, how to report mistakes |

## Questions

`data/questions.js` holds 184 questions:

- **84 `easy`** questions, used in chapter quizzes and the quick test
- **100 `real`** DMV-style questions: 20 road-sign + 80 rules (10 per chapter).
  They are split automatically into Practice Tests 1–5, each with 4 sign questions and
  2 rules questions per chapter, with no question repeated across the five tests.

Each question looks like this. **The first answer is always the correct one**; answers are shuffled on screen.

```js
{ q: "Question text", a: ["Correct", "Wrong", "Wrong", "Wrong"], e: "Explanation", p: 47 }
```

To add a question, add it to the right chapter list. Adding to the `REAL_RULES` or
`REAL_SIGNS` lists changes how questions are split into Tests 1–5, so if you want the five
fixed tests to stay exactly as they are, add new questions to the `easy` lists instead, or at
the end of a list in groups of five.

Smart random tests weight questions the visitor missed (and hasn't seen yet) more heavily.

## Editing site settings

`assets/js/config.js` holds the GitHub link used on the About page.

## Run locally

It's a plain static site with no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. The site appears at `https://akibcoding.github.io/ny-permit-prep/` within a minute or two.
   Every push to `main` updates it.
4. Optional: add a custom domain under **Settings → Pages → Custom domain**.

## Keeping it accurate

The DMV updates the manual from time to time. When it does, check `data/questions.js`,
`data/chapters.js`, `data/signs.js` and `cheatsheet.html` against the new edition and update
the "last checked" date in `assets/js/layout.js`.

## License

Code: MIT. Question text and diagrams: CC BY 4.0. Sign artwork is original and simplified,
not copied from official sources.
