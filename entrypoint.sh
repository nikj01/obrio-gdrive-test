#!/usr/bin/env sh
set -e

wait_for_db() {
  echo "Waiting for database to be ready..."
  until nc -z postgres 5432; do
    echo "Database is unavailable - sleeping"
    sleep 1
  done
  echo "Database is ready!"
}

wait_for_redis() {
  echo "Waiting for Redis to be ready..."
  until nc -z redis 6379; do
    echo "Redis is unavailable - sleeping"
    sleep 1
  done
  echo "Redis is ready!"
}

run_db_migrate() {
  if [ "$FORCE_DB_MIGRATE" != "true" ]; then
    echo "💡 FORCE_DB_MIGRATE is not true → skipping db migration"
    return 0
  fi

  LOCK_KEY="db_migrate_lock"
  LOCK_TIMEOUT=300
  UNIQUE_ID="$(hostname)-$"

  echo "🔄 FORCE_DB_MIGRATE=true → attempting to run db migration..."

  if redis-cli -h redis -p 6379 SET "$LOCK_KEY" "$UNIQUE_ID" NX EX "$LOCK_TIMEOUT" >/dev/null 2>&1; then
    echo "Lock acquired! Running database migration..."

    if [ "$NODE_ENV" = "production" ]; then
      MIGRATE_CMD="yarn db:deploy"
      echo "Production environment detected, using migrate deploy"
    else
      MIGRATE_CMD="yarn db:push"
      echo "Development/staging environment detected, using db push"
    fi

    if $MIGRATE_CMD; then
      echo "✅ Database migration completed successfully!"
    else
      echo "❗ Database migration failed!"
      redis-cli -h redis -p 6379 DEL "$LOCK_KEY" >/dev/null 2>&1
      exit 1
    fi

    redis-cli -h redis -p 6379 DEL "$LOCK_KEY" >/dev/null 2>&1
    echo "🔓 Database migration lock released"
  else
    echo "Another instance is running database migration. Waiting..."

    while redis-cli -h redis -p 6379 EXISTS "$LOCK_KEY" >/dev/null 2>&1; do
      echo "Still waiting for database migration to complete..."
      sleep 5
    done

    echo "Database migration completed by another instance"
  fi
}

run_db_generate() {
  if [ "$FORCE_DB_GENERATE" != "true" ]; then
    echo "💡 FORCE_DB_GENERATE is not true → skipping db:generate"
    return 0
  fi

  GENERATE_LOCK_KEY="db_generate_lock"
  LOCK_TIMEOUT=300
  UNIQUE_ID="$(hostname)-$$"

  echo "🔄 FORCE_DB_GENERATE=true → attempting to run db:generate..."

  if redis-cli -h redis -p 6379 SET "$GENERATE_LOCK_KEY" "$UNIQUE_ID" NX EX "$LOCK_TIMEOUT" >/dev/null 2>&1; then
    echo "Lock acquired! Running db:generate..."

    if yarn db:generate; then
      echo "✅ db:generate completed successfully!"
    else
      echo "❗ db:generate failed!"
      redis-cli -h redis -p 6379 DEL "$GENERATE_LOCK_KEY" >/dev/null 2>&1
      exit 1
    fi

    redis-cli -h redis -p 6379 DEL "$GENERATE_LOCK_KEY" >/dev/null 2>&1
    echo "🔓 db:generate lock released"
  else
    echo "Another instance is running db:generate. Waiting..."

    while redis-cli -h redis -p 6379 EXISTS "$GENERATE_LOCK_KEY" >/dev/null 2>&1; do
      echo "Still waiting for db:generate to complete..."
      sleep 5
    done

    echo "db:generate completed by another instance"
  fi
}

echo "⏳ Checking dependencies..."
wait_for_db
wait_for_redis

echo "🔄 Checking database management flags..."
run_db_migrate
run_db_generate

echo "🚀 Starting production server..."
exec yarn start:prod