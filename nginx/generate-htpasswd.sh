#!/usr/bin/env bash
# Generate / regenerate the .htpasswd file used by Nginx for Basic Auth.
# Usage:   ./generate-htpasswd.sh <user> <password>
# Example: ./generate-htpasswd.sh admin Fanja2026

set -e
USER="${1:-admin}"
PASS="${2:-Fanja2026}"

cd "$(dirname "$0")"

if command -v htpasswd >/dev/null 2>&1; then
  htpasswd -bc .htpasswd "$USER" "$PASS"
else
  # Fallback via Docker (no host install needed)
  docker run --rm httpd:2.4-alpine htpasswd -nbB "$USER" "$PASS" > .htpasswd
fi

echo "✔ Wrote nginx/.htpasswd with user '$USER'"
