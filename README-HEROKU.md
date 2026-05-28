# Clash of Clans Tournament Manager — Heroku Deployment

## ⚠️ Important Note About Heroku Free Tier

**Heroku ended its free tier in November 2022.** You now need a paid plan (starts at ~$5/month) or use Heroku's **Eco Dynos** (from $5/month for 1000 hours).

If you want **truly free** hosting, I recommend:
- **GitHub Pages** (free forever)
- **Render** (free tier available)
- **Vercel** (free tier available)
- **Netlify** (free tier available)

## Heroku Deployment Steps (If You Have a Paid Plan)

### Option A: Using `serve` (Simplest)

1. **Install Heroku CLI** and login:
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku app**:
```bash
heroku create clash-tournament-app
```

3. **Set Node version**:
```bash
heroku config:set NODE_ENV=production
```

4. **Deploy**:
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **Open your app**:
```bash
heroku open
```

### Option B: Using Express (More Control)

Use `package-express.json` and `server.js` instead of the default `package.json`.

```bash
mv package-express.json package.json
# Then follow steps above
```

### Option C: Connect GitHub Repo (No CLI)

1. Push code to GitHub
2. Go to [Heroku Dashboard](https://dashboard.heroku.com)
3. Create new app → **Deploy** tab → **GitHub** method
4. Connect your repo and enable **Auto Deploy**

## File Structure for Heroku

```
├── build/              # React production build (generated)
├── src/
│   ├── App.js
│   └── App.css
├── public/
│   └── index.html
├── package.json        # Use package.json (serve) or package-express.json
├── package-express.json # Alternative with Express
├── server.js           # Express server (for Option B)
├── Procfile            # Heroku process definition
└── README.md
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `npm install` before deploying |
| `Build fails` | Check Node version matches `engines` in package.json |
| `App crashes` | Check logs: `heroku logs --tail` |
| `Routing broken` | Ensure `server.js` handles `*` route for React Router |

---

## 🆓 Free Alternative: Render

If you want free hosting, Render is the best Heroku alternative:

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. **New Static Site** → Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `build`
6. Click **Create Static Site**

Done! Your app will be live at `https://your-app.onrender.com` for free.
