# BharatNXT Website

Static multi-page website. All pages are cross-linked and share one runtime, one asset set, and one navigation/footer system.

## Folder structure

```
bharatnxt-website/
├── index.html          → Homepage (the current, approved version)
├── product.html        → Product detail (?p=<slug>)
├── tool.html           → Calculators / tools (?t=<slug>)
├── resources.html      → Blog / resources listing
├── article.html        → Single article (?a=<slug>)
├── author.html         → Author profile (?au=<slug>)
├── india-map.html      → Network map (embedded in the homepage)
├── js/
│   ├── support.js      → Page runtime (renders each page)
│   └── image-slot.js   → Drag-and-drop image placeholders
└── assets/
    ├── images/         → All logos & image assets (.png)
    └── video/          → story-1.mp4 (user-stories video)
```

## Running it (VS Code)

The pages must be served over HTTP — opening the files directly with `file://`
will not render them correctly, and an internet connection is required (the
runtime, fonts, and map libraries load from a CDN).

1. Open this folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **"Open with Live Server"**.

Any other static server works too, e.g. from this folder:

```
python3 -m http.server 8000     # then open http://localhost:8000
```

## Editing

- Page content lives inline in each `.html` file — edit the markup/text directly.
- Shared logos live in `assets/images/`; swap a file (keep the name) to rebrand.
- Internal links use clean relative names (`product.html?p=card-payments`, etc.).
- External links (e.g. AchievHer) open in a new tab.
