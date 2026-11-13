#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ ! -x "$root/.venv/bin/python" || ! -x "$root/frontend/node_modules/.bin/next" ]]; then
  echo 'Install the Python and frontend dependencies before running browser tests.' >&2
  exit 1
fi
for port in 8011 3011; do
  if "$root/.venv/bin/python" -c 'import socket,sys; s=socket.socket(); s.settimeout(.2); result=s.connect_ex(("127.0.0.1",int(sys.argv[1]))); s.close(); sys.exit(0 if result == 0 else 1)' "$port"; then
    echo "Port $port is already in use; refusing to test an unknown service." >&2
    exit 1
  fi
done

scratch="$(mktemp -d "${TMPDIR:-/tmp}/thecodemate-e2e.XXXXXX")"
cp "$root/frontend/next-env.d.ts" "$scratch/next-env.d.ts"
backend_pid=''
frontend_pid=''
cleanup() {
  [[ -z "$frontend_pid" ]] || kill "$frontend_pid" 2>/dev/null || true
  [[ -z "$backend_pid" ]] || kill "$backend_pid" 2>/dev/null || true
  wait "$frontend_pid" "$backend_pid" 2>/dev/null || true
  cp "$scratch/next-env.d.ts" "$root/frontend/next-env.d.ts"
  rm -rf "$scratch"
}
trap cleanup EXIT INT TERM

export TC_ENV=development
export TC_DATABASE_URL="sqlite:///$scratch/e2e.db"
export TC_MEDIA_DIR="$scratch/media"
export TC_SITE_URL='http://127.0.0.1:3011'
export TC_BACKEND_URL='http://127.0.0.1:8011'
export TC_NEXT_DIST_DIR='.next-e2e'
export TC_ADMIN_EMAIL='owner@e2e.invalid'
export TC_ADMIN_PASSWORD='Disposable-E2E-owner-2026!'
export E2E_BASE_URL="$TC_SITE_URL"
export E2E_ADMIN_EMAIL="$TC_ADMIN_EMAIL"
export E2E_ADMIN_PASSWORD="$TC_ADMIN_PASSWORD"
export E2E_DISPOSABLE=1

# Next can reuse stale generated CSS after a source-only style change.
# This directory is dedicated to this disposable test stack.
rm -rf "$root/frontend/.next-e2e"

cd "$root"
"$root/.venv/bin/alembic" upgrade head > "$scratch/migration.log"
"$root/.venv/bin/python" -m scripts.bootstrap_admin > "$scratch/bootstrap.log"
"$root/.venv/bin/python" -m scripts.seed_demo > "$scratch/seed.log"
"$root/.venv/bin/uvicorn" app.main:app --host 127.0.0.1 --port 8011 > "$scratch/backend.log" 2>&1 &
backend_pid=$!
cd "$root/frontend"
./node_modules/.bin/next dev --hostname 127.0.0.1 --port 3011 > "$scratch/frontend.log" 2>&1 &
frontend_pid=$!

for attempt in {1..90}; do
  if curl --fail --silent "$TC_BACKEND_URL/api/public/settings" >/dev/null &&
     curl --fail --silent "$TC_SITE_URL/topics/how-dns-works" >/dev/null; then
    break
  fi
  if ! kill -0 "$backend_pid" 2>/dev/null || ! kill -0 "$frontend_pid" 2>/dev/null; then
    cat "$scratch/backend.log" "$scratch/frontend.log" >&2
    exit 1
  fi
  sleep 1
done
if ! curl --fail --silent "$TC_SITE_URL/topics/how-dns-works" >/dev/null; then
  cat "$scratch/backend.log" "$scratch/frontend.log" >&2
  exit 1
fi
./node_modules/.bin/playwright test "$@"
