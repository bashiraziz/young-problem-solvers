# Brief: add the robot mascot, new logo mark and favicon to Young Problem Solvers

Live site: https://young-problem-solvers.vercel.app/

## Before you start

Look at the repo first and confirm the stack. The site appears to use the Next.js App Router (the favicon is served from `app/icon.svg`) and Tailwind. If any path below doesn't match the repo, adapt it and tell me what you changed.

## Files in this package

| File | Put it at | What it is |
|---|---|---|
| `app/icon.svg` | `app/icon.svg` (replace the existing one) | Favicon (the robot head on a teal tile) |
| `app/favicon.ico` | `app/favicon.ico` | 16/32/48px fallback for older browsers |
| `app/apple-icon.png` | `app/apple-icon.png` | 180px icon for iPhone home screens |
| `public/brand/mark.svg` | `public/brand/mark.svg` | Logo mark used in the header |
| `public/mascot/robot-default.svg` | `public/mascot/` | Neutral waving pose |
| `public/mascot/robot-thinking.svg` | `public/mascot/` | Thinking |
| `public/mascot/robot-got-it.svg` | `public/mascot/` | Celebrating a correct answer |
| `public/mascot/robot-stuck.svg` | `public/mascot/` | Puzzled: a wrong answer or a hint |
| `public/mascot/robot-explaining.svg` | `public/mascot/` | Pointing at a board |

Every mascot SVG is a 200×200 square with a transparent background.

## Tasks

### 1. Favicon
Copy the three `app/` files into place. Next.js generates the `<link>` tags itself, so don't add any by hand. Remove any old favicon files or icon metadata that would conflict with these.

### 2. Header logo
- Replace the `YPS` text badge in the header (the `span` with `bg-deep ... -rotate-3`) with `public/brand/mark.svg` at the same size (44px). Keep the `-rotate-3` tilt.
- Load **Nunito** (weight 900) with `next/font/google`. Use it only for the "Young Problem Solvers" wordmark next to the mark. Keep the "THINK. BUILD. EXPLAIN." tagline as it is.
- The mark is decorative because the name sits next to it, so give it `alt=""`. The header link should still have an accessible name.

### 3. A reusable `Mascot` component
Create `components/Mascot.tsx`:
- Props: `pose: "default" | "thinking" | "got-it" | "stuck" | "explaining"`, `size?: number` (default 160), `className?`, and `label?: string`.
- Render the matching file from `/mascot/robot-<pose>.svg` with `next/image`.
- Use `alt=""` unless `label` is passed. The mascot is decoration; the words on the page carry the meaning.
- Don't animate anything for now. If you add animation later, wrap it in `motion-safe:`.

### 4. Where the mascot goes

| Place | Pose | Notes |
|---|---|---|
| Home page, next to the "Example challenge" card | `explaining` | About 160px on desktop. Smaller or hidden below `sm`, so it never squeezes the headline. |
| Try a Challenge: while the child is working / the challenge is loading | `thinking` | |
| Try a Challenge: correct answer or step completed | `got-it` | |
| Try a Challenge: wrong answer or a hint is shown | `stuck` | Keep the copy encouraging, e.g. "Hmm, let's look at it another way." Never "Wrong!" |
| Try a Challenge: the Justify / Reflect ("explain your thinking") steps | `explaining` | |
| `app/not-found.tsx` (create it if missing) | `stuck` | "This page is a puzzle even we can't solve." plus a button back home |
| For Parents, About and Foundation Programme pages | none, or at most one small `default` | These pages are for parents, so keep them calm and credible. |

### 5. Rules
- At most one mascot per screen.
- Never show the mascot reacting to a child's mistake in a mocking or sad way.
- Don't give the mascot a name in the UI yet. The name hasn't been decided.
- Keep the existing colours. The mascot already uses the site palette (`#133F45`, `#12685F`, `#DCF4E7`, `#F4BF65`).

## Check before you finish
1. Run `npm run build` and confirm it passes with no new warnings.
2. Run the dev server and check:
   - the favicon appears in the browser tab after a hard refresh;
   - the header and the home page look right at 375px and 1280px wide;
   - the 404 page by visiting a made-up URL;
   - each challenge state (thinking, correct, wrong/hint, explain) shows the right pose.
3. Give me a short summary of what changed and where.
