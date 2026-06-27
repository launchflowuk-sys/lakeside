#!/bin/bash
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "fix: pass ADMIN_PASSWORD and COOKIE_SECURE to api container"
git push origin main
