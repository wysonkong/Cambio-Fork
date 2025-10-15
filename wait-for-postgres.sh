#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

echo "Waiting for Postgres at $host..."

until PGPASSWORD=$DB_PASS psql -h "$host" -U "$DB_USER" -d "cambio_db" -c '\q' 2>/dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

>&2 echo "Postgres is up - executing command"
exec $cmd