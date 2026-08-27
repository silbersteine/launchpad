#!/usr/bin/env bash
set -euo pipefail

# Idempotent Cloud Agent bootstrap for LaunchPad.
export HUSKY=0

corepack enable
corepack prepare yarn@4.5.0 --activate

yarn install
yarn setup
yarn seed

set +e
admin_output="$(yarn create-demo-admin 2>&1)"
admin_status=$?
set -e
printf '%s\n' "$admin_output"
if [ "$admin_status" -ne 0 ] && ! grep -q 'already exists' <<<"$admin_output"; then
  exit "$admin_status"
fi
