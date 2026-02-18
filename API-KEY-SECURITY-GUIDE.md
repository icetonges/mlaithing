# 🔐 API Key Security Guide
## Fixing the Leaked Secret + Setting Up Vercel

---

## ⚠️ IMMEDIATE ACTION REQUIRED (Do This First!)

**Your Anthropic + OpenAI API keys were exposed in git history.
Even if you delete the file, the keys are still in old commits.
You MUST rotate (regenerate) them RIGHT NOW.**

### Step 1 — Revoke the leaked keys immediately

**Anthropic:**
1. Go to https://console.anthropic.com
2. Click **API Keys** in the left sidebar
3. Find the leaked key → click **Delete** (or **Revoke**)
4. Click **Create Key** → give it a new name → copy the new key
5. Store the NEW key only in `.env.local` (never `.env.example`)

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Find the leaked key → click the **trash icon** to delete it
3. Click **+ Create new secret key** → copy the new key
4. Store the NEW key only in `.env.local`

---

## 🧹 Step 2 — Remove Secret from Git History

The key is in your commit history even after deleting the file.
Run these commands in your project folder:

```bash
# Install BFG (fastest tool for cleaning git history)
# Mac:
brew install bfg

# Windows (download jar from https://rtyley.github.io/bfg-repo-cleaner/):
# Then run: java -jar bfg.jar ...

# --- Clean the history ---

# 1. Create a file listing secrets to remove
echo "sk-ant-api03-YOUR-OLD-KEY" > secrets.txt
echo "sk-proj-YOUR-OLD-OPENAI-KEY" >> secrets.txt

# 2. Run BFG to wipe secrets from ALL commits
bfg --replace-text secrets.txt

# 3. Clean up and force push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin main --force

# 4. Delete the secrets file
rm secrets.txt
```

**Alternative — git filter-repo (no BFG needed):**
```bash
# Install
pip install git-filter-repo

# Replace all occurrences of old key in history
git filter-repo --replace-text <(echo "sk-ant-api03-OLD-KEY==>REMOVED")
git push origin main --force
```

---

## ✅ Step 3 — The Correct File Structure Going Forward

```
project/
├── .env.example        ← ✅ Committed to git — EMPTY values only (template)
├── .env.local          ← ✅ NEVER committed — contains real keys
└── .gitignore          ← ✅ Must include .env.local
```

### `.env.example` — what goes in git (EMPTY VALUES):
```env
ANTHROPIC_API_KEY=
GOOGLE_GEMINI_API_KEY=
OPENAI_API_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `.env.local` — on your machine only (REAL VALUES, never git):
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-new-real-key
GOOGLE_GEMINI_API_KEY=AIzaSy-your-real-key
OPENAI_API_KEY=sk-proj-your-new-real-key
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `.gitignore` — make sure these lines exist:
```gitignore
.env
.env.local
.env.*.local
```

---

## 🔒 Verify Before Every Commit

```bash
# Check what files you're about to commit
git status

# Check if any env file accidentally staged
git diff --cached | grep -E "sk-ant|AIzaSy|sk-proj"
# → Should return NOTHING. If it shows a key, run: git reset HEAD .env.local
```

---

## ☁️ Vercel Environment Variables Setup

### Do I need to set env vars twice? (local + Vercel)

**Yes — but they are SEPARATE, not duplicated.**

| Location | File | Purpose |
|----------|------|---------|
| **Local dev** | `.env.local` | Only on your machine, never pushed |
| **Vercel prod** | Dashboard → Settings | Stored encrypted in Vercel's vault |

They serve different environments. Vercel NEVER reads your local `.env.local`.

---

### How to Set Env Vars on Vercel

**Method A — Vercel Dashboard (recommended):**

1. Go to https://vercel.com → Your Project
2. Click **Settings** tab (top nav)
3. Click **Environment Variables** (left sidebar)
4. For each variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-your-new-key`
   - **Environments:** ✅ Production ✅ Preview ✅ Development
   - Click **Save**
5. Repeat for all keys
6. Go to **Deployments** → click **Redeploy** on latest deployment

**Method B — Vercel CLI:**
```bash
# Set each variable
vercel env add ANTHROPIC_API_KEY
# → prompts: Enter value: [paste key] → select: Production, Preview, Development

vercel env add GOOGLE_GEMINI_API_KEY
vercel env add OPENAI_API_KEY
vercel env add DATABASE_URL

# Redeploy to apply
vercel deploy --prod
```

---

### Complete Vercel Env Variable List

| Variable | Required on Vercel | Notes |
|----------|-------------------|-------|
| `ANTHROPIC_API_KEY` | ✅ Yes (for AI) | New key after revoking |
| `GOOGLE_GEMINI_API_KEY` | Optional | Free fallback |
| `OPENAI_API_KEY` | Optional | Only if using OpenAI features |
| `DATABASE_URL` | Optional | For persistent upload metadata |
| `NEXT_PUBLIC_APP_URL` | Recommended | Set to `https://your-app.vercel.app` |

**Note on `NEXT_PUBLIC_` prefix:**
Variables starting with `NEXT_PUBLIC_` are embedded in the browser bundle (client-side).
Never put secret keys with `NEXT_PUBLIC_` prefix — they'd be visible to anyone.

---

## 🛡️ Secret Scanning — How to Prevent This Forever

### Option 1 — Git pre-commit hook (automatic protection)
```bash
# Create the hook file
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Block commits containing API key patterns
if git diff --cached | grep -qE '(sk-ant-api03|AIzaSy|sk-proj-|sk-[a-zA-Z0-9]{48})'; then
  echo "🚨 BLOCKED: API key pattern detected in staged files!"
  echo "   Run: git diff --cached | grep -E 'sk-ant|AIzaSy|sk-proj'"
  echo "   Remove the key and use .env.local instead."
  exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
echo "Pre-commit hook installed!"
```

### Option 2 — Install git-secrets (more robust)
```bash
# Mac
brew install git-secrets
git secrets --install
git secrets --register-aws   # adds AWS patterns
git secrets --add 'sk-ant-api03-[A-Za-z0-9_-]+'   # Anthropic
git secrets --add 'AIzaSy[A-Za-z0-9_-]+'           # Google
git secrets --add 'sk-proj-[A-Za-z0-9_-]+'         # OpenAI
```

### Option 3 — GitHub repo protection (already enabled on your repo!)
GitHub already blocked your push — that's the Secret Scanning feature working.
To review settings: **Repo → Settings → Security → Secret scanning**

---

## 📋 Quick Checklist

- [ ] Revoked old Anthropic API key at console.anthropic.com
- [ ] Revoked old OpenAI API key at platform.openai.com
- [ ] Generated new API keys for both
- [ ] Cleaned git history with BFG or git-filter-repo
- [ ] New keys are ONLY in `.env.local` (never `.env.example`)
- [ ] `.env.local` is in `.gitignore`
- [ ] Added new keys to Vercel Dashboard → Settings → Environment Variables
- [ ] Redeployed on Vercel after adding env vars
- [ ] Installed pre-commit hook to prevent future leaks
