#!/bin/bash
# =============================================================
# Vercel Environment Variable Setup Script
# =============================================================
# INSTRUCTIONS:
#   1. Install Vercel CLI:  npm install -g vercel
#   2. Login:              vercel login
#   3. Link project:       vercel link   (run once in project folder)
#   4. Run this script:    bash scripts/vercel-env-setup.sh
# =============================================================

set -e

echo ""
echo "================================================"
echo "  AI/ML Hub — Vercel Environment Variable Setup"
echo "================================================"
echo ""

# Helper: add env var to all 3 environments (Production, Preview, Development)
add_env() {
  local KEY="$1"
  local VALUE="$2"
  echo "→ Setting $KEY ..."
  echo "$VALUE" | vercel env add "$KEY" production  --force 2>/dev/null || true
  echo "$VALUE" | vercel env add "$KEY" preview     --force 2>/dev/null || true
  echo "$VALUE" | vercel env add "$KEY" development --force 2>/dev/null || true
  echo "  ✅ $KEY set in all environments"
}

# =============================================================
# PASTE YOUR REAL VALUES BELOW (then delete this comment)
# =============================================================

GEMINI_KEY=""          # Get free at: aistudio.google.com
ANTHROPIC_KEY=""       # Get at: console.anthropic.com  
OPENAI_KEY=""          # Get at: platform.openai.com (optional)
DATABASE_URL=""        # Get free at: neon.tech (optional)
APP_URL=""             # e.g. https://mlaithing.vercel.app

# =============================================================

# Validate at least one AI key is set
if [[ -z "$GEMINI_KEY" && -z "$ANTHROPIC_KEY" ]]; then
  echo "❌ ERROR: Set at least GEMINI_KEY or ANTHROPIC_KEY above before running."
  exit 1
fi

# Add AI keys
[[ -n "$GEMINI_KEY" ]]    && add_env "GOOGLE_GEMINI_API_KEY" "$GEMINI_KEY"
[[ -n "$ANTHROPIC_KEY" ]] && add_env "ANTHROPIC_API_KEY"     "$ANTHROPIC_KEY"
[[ -n "$OPENAI_KEY" ]]    && add_env "OPENAI_API_KEY"        "$OPENAI_KEY"

# Add optional vars
[[ -n "$DATABASE_URL" ]]  && add_env "DATABASE_URL"          "$DATABASE_URL"
[[ -n "$APP_URL" ]]       && add_env "NEXT_PUBLIC_APP_URL"   "$APP_URL"

# Always set app name
add_env "NEXT_PUBLIC_APP_NAME" "AI/ML Knowledge Hub"

echo ""
echo "================================================"
echo "  All environment variables set!"
echo ""
echo "  Next step — redeploy to apply them:"
echo "  $ vercel deploy --prod"
echo "================================================"
echo ""
