# Gitartha Pratim Das — Portfolio

A cinematic, motion-heavy single-page portfolio. No build step — it's plain
HTML/CSS/JS, so you can open `index.html` directly or deploy the folder as-is.

## 1. Add your real portrait

Your photo didn't come through in the upload, so the hero currently shows a
placeholder card (labelled "Add portrait.jpg").

1. Save your portrait as `assets/portrait.jpg` (a portrait/vertical crop
   works best, roughly 4:5, subject positioned toward the right/center).
2. In `index.html`, find the `hero-portrait` block and replace:
   ```html
   <div class="portrait-placeholder" ...> ... </div>
   ```
   with:
   ```html
   <img src="assets/portrait.jpg" alt="Portrait of Gitartha Pratim Das" class="portrait-img">
   ```

## 2. Connect the contact form

The form posts to [Web3Forms](https://web3forms.com) (free, no backend
needed, doesn't expose a secret — the access key is safe to ship in
frontend code by design).

1. Go to web3forms.com and create a free access key using
   `gitarthapratimd@gmail.com`.
2. In `index.html`, find:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
   and paste your key in place of `YOUR_ACCESS_KEY_HERE`.

That's it — submissions will be emailed to you directly. (Netlify Forms or
Formspree work as drop-in alternatives if you'd rather use those.)

## 3. Add a downloadable resume PDF (optional)

If you have a real resume PDF, drop it at `assets/resume.pdf`, then
uncomment the "Download resume" link in the Resume section of `index.html`.
Don't add this button until a real file exists at that path.

## 4. Deploy

Drag the whole `site` folder onto Netlify's deploy target, or connect this
folder to your existing Netlify site — no build command or install step is
required.

## Notes

- All copy, links, and figures came from the brief and the existing live
  site; nothing was invented (no fake clients, metrics, awards, or tech).
- Motion respects `prefers-reduced-motion`, and the 3D background disables
  itself for those users.
- Print styles (`@media print`) render a clean, separate one-page resume —
  triggered by any "Print Resume" button, or Ctrl/Cmd+P.
