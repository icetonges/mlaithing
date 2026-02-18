#!/bin/bash
# Run this once after cloning: bash scripts/install-hooks.sh

HOOK=".git/hooks/pre-commit"

cat > $HOOK << 'HOOK_CONTENT'
#!/bin/bash
# Blocks commits containing real API key patterns

PATTERNS=(
  "sk-ant-api03-"
  "AIzaSy"
  "sk-proj-"
  "sk-live-"
)

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached | grep -q "$pattern"; then
    echo ""
    echo "🚨 COMMIT BLOCKED — API key detected!"
    echo "   Pattern found: $pattern"
    echo ""
    echo "   Fix: Move your keys to .env.local (not .env.example)"
    echo "   Then: git reset HEAD <file> to unstage"
    echo ""
    exit 1
  fi
done

exit 0
HOOK_CONTENT

chmod +x $HOOK
echo "✅ Pre-commit hook installed — API keys will be blocked from commits."
