# jrumanov.github.io

Personal site for Jakub Rumanovský. Plain HTML, CSS and a little JavaScript —
**no framework, no build step, no dependencies.** Open `index.html` in a browser
and that is exactly what ships.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole page. All content lives here. |
| `styles.css` | Design tokens at the top, then layout. |
| `script.js` | Sticky header, mobile menu, scroll-spy, fade-in. Page works fine without it. |
| `assets/jakub.jpg` | Hero portrait. |
| `favicon.svg` | Tab icon. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

## Editing

Everything is in `index.html`, in the order it appears on the page:
Hero → About → Skills → Experience → Projects → Interests → Contact.

- **Add a job:** copy an `<li class="tl-item">` block in the Experience timeline.
  The first one in the list gets the blue dot automatically.
- **Add a skill:** add an `<li>` inside the relevant `<ul class="tags">`.
- **Fill in a project:** replace a `card-placeholder` article in the Projects
  section and drop the `card-placeholder` class once it has real content.
- **Change colours:** the `:root` block at the top of `styles.css` — every colour
  on the page comes from those six tokens.

## Local preview

Any static server works, or just double-click `index.html`. With Python:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying to GitHub Pages

The repo must be named `jrumanov.github.io` for the site to live at the bare
domain `https://jrumanov.github.io/`.

1. Create an **empty public repo** called `jrumanov.github.io` on GitHub
   (no README, no .gitignore — this folder provides those).
2. From this folder:

   ```bash
   git init
   git add .
   git commit -m "Personal site: first version"
   git branch -M main
   git remote add origin https://github.com/jrumanov/jrumanov.github.io.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.

First publish takes a minute or two. After that every `git push` redeploys.

## Deliberately out of scope for v1

Dark mode, contact form, blog, project detail pages, analytics, custom domain,
and a downloadable CV. The Experience section is the CV; recruiters email for
the PDF.
