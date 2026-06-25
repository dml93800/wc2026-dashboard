# 🏆 CdM 2026 — Dashboard IA

Dashboard live de la Coupe du Monde 2026 avec prédictions IA, système de pronos et notifications en temps réel.

## Fonctionnalités

- ⚽ Scores live mis à jour toutes les 60 secondes
- 🧠 Analyse IA de chaque match (powered by Claude)
- 🎯 Système de pronos avec points (3 pts score exact, 1 pt bon vainqueur)
- 🔔 Notifications navigateur à chaque but
- 📊 Classements de groupe et stats du tournoi

---

## Déploiement sur Vercel (5 minutes)

### Étape 1 — Mettre le projet sur GitHub

1. Va sur [github.com](https://github.com) → **New repository**
2. Nomme-le `wc2026-dashboard`, mets-le en **Public**
3. Dans ton terminal, depuis le dossier du projet :

```bash
git init
git add .
git commit -m "🏆 Initial commit — CdM 2026 Dashboard"
git remote add origin https://github.com/TON_USERNAME/wc2026-dashboard.git
git push -u origin main
```

### Étape 2 — Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) → **Sign up** avec ton compte GitHub
2. Clique **Add New Project** → importe ton repo `wc2026-dashboard`
3. Vercel détecte Next.js automatiquement, clique **Deploy**

### Étape 3 — Ajouter ta clé API Anthropic

1. Dans Vercel → ton projet → **Settings** → **Environment Variables**
2. Ajoute :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : ta clé API depuis [console.anthropic.com](https://console.anthropic.com)
3. Clique **Save** puis **Redeploy**

### C'est tout ! 🎉

Ton site est en ligne à `https://wc2026-dashboard.vercel.app`

---

## Dev local

```bash
npm install
cp .env.example .env.local
# Édite .env.local avec ta clé API
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

---

## Stack

- **Next.js 14** — framework React
- **API CdM 2026** — `worldcup26.ir` (gratuite, open source)
- **Claude Sonnet** — analyses IA via Anthropic API
- **Vercel** — hébergement gratuit
