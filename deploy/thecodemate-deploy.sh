#!/usr/bin/env bash
# Pull-based deploy for the thecodemate VPS. Installed as /usr/local/sbin/thecodemate-deploy and run
# every two minutes by thecodemate-deploy.timer as the unprivileged `thecodemate` user.
# It deploys the newest commit on main only after its GitHub checks have passed, builds it in a
# fresh release directory, switches the `current` symlink, restarts the two services, verifies the
# site answers, and rolls back to the previous release if it does not.
#   FORCE=1         retry a commit that was previously rejected
#   SKIP_CI_GATE=1  deploy without waiting for GitHub checks (first install / emergency only)
set -euo pipefail

BASE="${TC_DEPLOY_BASE:-/var/www/thecodemate}"
REPO_URL="${TC_DEPLOY_REPO:-https://github.com/tarunx1/thecodemate.git}"
API="${TC_DEPLOY_API:-https://api.github.com/repos/tarunx1/thecodemate}"
BRANCH="${TC_DEPLOY_BRANCH:-main}"
ENV_FILE="${TC_DEPLOY_ENV:-/etc/thecodemate/env}"
SITE_LOCAL="http://127.0.0.1:3000"
KEEP=3

log() { echo "[$(date -u +%FT%TZ)] $*"; }

mkdir -p "$BASE/releases" "$BASE/state" "$BASE/media"
exec 9>"$BASE/state/deploy.lock"
flock -n 9 || exit 0

[[ -d "$BASE/repo.git" ]] || git clone --quiet --bare "$REPO_URL" "$BASE/repo.git"
git --git-dir="$BASE/repo.git" fetch --quiet --prune origin "+refs/heads/$BRANCH:refs/heads/$BRANCH"
sha="$(git --git-dir="$BASE/repo.git" rev-parse "refs/heads/$BRANCH")"
deployed="$(cat "$BASE/state/deployed" 2>/dev/null || true)"
rejected="$(cat "$BASE/state/rejected" 2>/dev/null || true)"
[[ "$sha" != "$deployed" ]] || exit 0
if [[ "$sha" == "$rejected" && "${FORCE:-0}" != 1 ]]; then exit 0; fi

if [[ "${SKIP_CI_GATE:-0}" != 1 ]]; then
  verdict="$(curl -fsS -m 20 -H 'Accept: application/vnd.github+json' "$API/commits/$sha/check-runs" | python3 -c '
import json, sys
runs = json.load(sys.stdin).get("check_runs", [])
if not runs or any(run["status"] != "completed" for run in runs):
    print("pending")
elif all(run["conclusion"] in ("success", "skipped", "neutral") for run in runs):
    print("success")
else:
    print("failure")' || echo pending)"
  case "$verdict" in
    success) ;;
    failure) log "checks failed for $sha; not deploying"; echo "$sha" > "$BASE/state/rejected"; exit 0 ;;
    *) log "checks not finished for $sha; will retry"; exit 0 ;;
  esac
fi

log "deploying $sha"
set -a; . "$ENV_FILE"; set +a
release="$BASE/releases/$sha"
rm -rf "$release"; mkdir -p "$release"
git --git-dir="$BASE/repo.git" archive "$sha" | tar -x -C "$release"

fail() { log "FAILED: $*"; echo "$sha" > "$BASE/state/rejected"; rm -rf "$release"; exit 1; }

python3 -m venv "$release/.venv" || fail "venv"
"$release/.venv/bin/pip" install --quiet --disable-pip-version-check -r "$release/requirements-lock.txt" || fail "pip install"
( cd "$release/frontend" && npm ci --no-audit --no-fund --loglevel=error && npm run build ) || fail "frontend build"
( cd "$release" && .venv/bin/alembic upgrade head ) || fail "database migration"

previous="$(readlink "$BASE/current" 2>/dev/null || true)"
switch_to() { ln -sfn "$1" "$BASE/current.next" && mv -T "$BASE/current.next" "$BASE/current"; sudo /usr/bin/systemctl restart thecodemate-backend thecodemate-frontend; }
healthy() {
  for _ in $(seq 1 30); do
    if curl -fsS -m 5 -o /dev/null "$SITE_LOCAL/api/public/settings" && curl -fsS -m 10 -o /dev/null "$SITE_LOCAL/"; then return 0; fi
    sleep 2
  done
  return 1
}

switch_to "$release"
if healthy; then
  echo "$sha" > "$BASE/state/deployed"; rm -f "$BASE/state/rejected"
  log "live: $sha"
else
  log "health check failed for $sha"
  echo "$sha" > "$BASE/state/rejected"
  if [[ -n "$previous" && -d "$previous" ]]; then switch_to "$previous"; log "rolled back to $(basename "$previous")"; fi
  exit 1
fi

# Keep the newest releases; never remove the live one.
ls -1dt "$BASE"/releases/*/ | tail -n +$((KEEP + 1)) | while read -r old; do
  [[ "$(readlink -f "$old")" == "$(readlink -f "$BASE/current")" ]] || rm -rf "$old"
done
