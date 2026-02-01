#!/bin/sh
set -e

if [ -n "$DATABASE_WAIT_TIMEOUT" ]; then
  echo "Waiting up to $DATABASE_WAIT_TIMEOUT seconds for DB (Python socket check)…"
  python - <<'PY'
import os, sys, time, socket, urllib.parse
url = os.environ.get('DATABASE_URL')
if not url:
    print('DATABASE_URL not set; skipping DB wait')
    sys.exit(0)
try:
    parsed = urllib.parse.urlparse(url)
    host = parsed.hostname
    port = parsed.port or 5432
except Exception as e:
    print('Could not parse DATABASE_URL:', e, file=sys.stderr)
    sys.exit(0)

timeout = int(os.environ.get('DATABASE_WAIT_TIMEOUT', '0'))
end = time.time() + timeout
while time.time() < end:
    try:
        s = socket.create_connection((host, port), timeout=2)
        s.close()
        print('Database reachable at %s:%s' % (host, port))
        sys.exit(0)
    except Exception:
        time.sleep(1)
print('Timed out waiting for database', file=sys.stderr)
sys.exit(1)
PY
fi

if [ "${ALEMBIC_AUTO_UPGRADE:-1}" = "1" ] || [ "${ALEMBIC_AUTO_UPGRADE:-true}" = "true" ]; then
  echo "Running alembic migrations..."
  if command -v alembic >/dev/null 2>&1; then
    alembic upgrade head || echo "alembic upgrade failed" >&2
  else
    echo "alembic not installed; skipping migrations" >&2
  fi
fi

echo "Verifying spaCy model 'pt_core_news_sm'..."
python - <<'PY'
import sys
try:
    import spacy
    spacy.load('pt_core_news_sm')
    print('spaCy model OK')
except Exception as e:
    print('spaCy model load failed:', e, file=sys.stderr)
    sys.exit(2)
PY

# If no args provided, run gunicorn with $PORT and configurable workers
if [ "$#" -eq 0 ]; then
  echo "No command provided; starting gunicorn on port ${PORT:-8000}"
  exec gunicorn app.main:app --bind 0.0.0.0:${PORT:-8000} --workers ${GUNICORN_WORKERS:-2} --timeout ${GUNICORN_TIMEOUT:-120} --worker-class uvicorn.workers.UvicornWorker
fi

exec "$@"
