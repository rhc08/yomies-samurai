# Yomies — The Menu That Doesn't Exist

A working prototype for the Samurai 17 competition (Vibe Code track).

**The big idea:** When you open Yomies inside a delivery app, there is no menu. You type one true thing about your day, and AI invents three one-of-one drinks named just for you. Tap one and get a shareable "diagnosis card" — the brand's playful read of who you are today.

---

## How to deploy this (no terminal needed)

### Step 1 — Upload to GitHub (~3 minutes)

1. Go to [github.com](https://github.com) and click the **+** icon top-right → **New repository**
2. Name it `yomies-samurai` (or anything you like)
3. Leave everything else default, click **Create repository**
4. On the next page, click **"uploading an existing file"** (it's a small link in the middle)
5. **Drag and drop every file from this folder** into the browser — yes, even the hidden ones (`.gitignore`, `.env.local.example`). On Mac, press `Cmd + Shift + .` in Finder to see hidden files.
6. Scroll down, click **Commit changes**

### Step 2 — Deploy to Vercel (~3 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → choose **Continue with GitHub** (uses the GitHub account you just used)
3. Once logged in, click **Add New → Project**
4. Find your `yomies-samurai` repo in the list, click **Import**
5. **Don't click Deploy yet.** First, expand the **Environment Variables** section
6. Add one variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** *paste your Gemini API key here*
7. Click **Deploy**
8. Wait ~60 seconds. When it's done, click **Continue to dashboard** → click on the preview/domain link at the top.

Your public URL will look like `https://yomies-samurai-xyz.vercel.app`. **That's your submission link.**

### Step 3 — Test it

Open the URL on your phone. Type a confession. See three drinks. Tap one. See the diagnosis card. Try sharing it.

---

## What if something breaks?

**"Application error" or blank page:**
Go to your Vercel project → Deployments → click the latest deployment → check the logs. If it mentions `GEMINI_API_KEY`, you forgot to set the env var. Add it under Settings → Environment Variables, then redeploy.

**Drinks all look the same:**
That means the Gemini call is failing and the app is showing fallback content. Check the env var, verify your key is correct in Google AI Studio, and try again. The app is designed to always show *something* so judges never see a broken state.

**Model not found error:**
Open `app/api/generate/route.js` (via github.dev — just press `.` on your repo page) and change `gemini-2.0-flash` to `gemini-2.5-flash` or whatever model your AI Studio dashboard says is available. Commit. Vercel auto-redeploys.

---

## Structure

```
yomies/
├── app/
│   ├── page.jsx              # entry — the confession input
│   ├── menu/page.jsx         # three named drinks
│   ├── card/page.jsx         # the shareable diagnosis card
│   ├── api/generate/route.js # server-side Gemini call
│   ├── layout.jsx
│   └── globals.css           # custom Yomies theming
├── lib/
│   └── drinks.js             # the real Yomies menu mapping
├── package.json
└── tailwind.config.js
```

---

## What's coming next

This is the working core. Next iterations will add:
- **"Today in Dubai" feed** — a live-scrolling feed of what other people are being served
- **Yomies Twin** — your evolving AI character built from your order history
- **PNG export** — actually downloadable diagnosis cards as images
- **Disappearing menu animation** — the countdown timer made cinematic
