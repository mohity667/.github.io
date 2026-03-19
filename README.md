# Mohit Yadav — Portfolio (GitHub Pages)

Production-ready personal portfolio built with **pure HTML/CSS/vanilla JS** (no build step). Designed to deploy directly on **GitHub Pages**.

## Files

- `index.html` — content + sections
- `style.css` — theme + layout + responsive styling
- `script.js` — theme toggle, scroll reveals, hero animation, mailto form

## Customize (quick)

### Update your links
In `index.html`, replace the placeholder `href="#"` links for:
- LinkedIn
- GitHub
- Project links (GitHub + Live Demo)

### Update Certifications
In `index.html`, edit the cards under the `#certifications` section (issuer/year), or duplicate/remove cards as needed.

### Update Open Graph preview
In `index.html`, replace:
- `./assets/og-image.png` with a real image path (recommended **1200×630**).

## Deploy to GitHub Pages (3 steps)

1. **Create a GitHub repo** (or use an existing one) and push these files to the repo root on the `main` branch.
2. In GitHub, go to **Settings → Pages**.
3. Set **Source: Deploy from a branch** → **Branch: `main`** → **Folder: `/ (root)`**, then **Save**.

After ~30–120 seconds, your site will be live at your GitHub Pages URL.

## Swap in your real profile photo

Right now the hero uses an initials avatar.

1. Create a folder: `assets/`
2. Add your photo file, for example: `assets/profile.jpg`
3. In `index.html`, replace the placeholder avatar block:

```html
<div class="avatar" role="img" aria-label="Profile photo placeholder">
  <span class="avatar-initials">MY</span>
</div>
```

With:

```html
<img class="avatar-img" src="./assets/profile.jpg" alt="Mohit Yadav" />
```

If you use the `<img>` approach, also add this CSS to `style.css` (near the `.avatar` styles):

```css
.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  object-fit: cover;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
}
```

## Notes

- Everything uses **relative paths** (safe for GitHub Pages).
- The contact form uses **mailto:** so it works without any backend.
- Theme is set to permanent dark mode.

