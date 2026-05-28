# Clash of Clans Tournament Manager

A responsive React web application for managing Clash of Clans tournaments with bracket visualization, match scoring, and live standings.

## Features

- **Tournament Bracket** — Quarter finals → Semi finals → Grand Final + 3rd Place match
- **Live Scoring** — Enter star counts (0-3) for each match
- **Standings** — Auto-updating leaderboard with win/loss/star stats
- **Mobile Responsive** — Fully optimized for phones and tablets
- **8 Pre-loaded Clans** — Dragon Fury, Iron Wolves, Shadow Legion, Storm Breakers, Crystal Guard, Phoenix Rise, Dark Knights, Golden Eagles

## Quick Start (No Build Required)

Simply open `index.html` in your browser. It loads React from CDN and works immediately.

## Deploy to GitHub Pages (Free Hosting)

### Option 1: Manual Deploy (Fastest)

1. **Create a GitHub repo** called `clash-tournament`
2. **Replace** `YOUR_USERNAME` in `package.json` with your actual GitHub username
3. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/clash-tournament.git
git push -u origin main
npm install
npm run deploy
```

4. Go to **Settings → Pages** in your repo and set source to `gh-pages` branch
5. Your app will be live at `https://YOUR_USERNAME.github.io/clash-tournament`

### Option 2: Auto-Deploy with GitHub Actions

1. Push the code to GitHub (steps 1-4 above)
2. The `.github/workflows/deploy.yml` file will automatically deploy on every push to `main`
3. Go to **Settings → Pages** and set source to `gh-pages` branch

## Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── App.js      # Main React components
│   └── App.css     # Styling
├── package.json
└── README.md
```

## Tech Stack

- React 18
- Pure CSS (no frameworks)
- SVG icons (no icon library)
- GitHub Pages (free hosting)

## License

MIT
