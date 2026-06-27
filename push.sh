#!/bin/bash
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "fix: require ADMIN_PASSWORD env var (no silent empty default)"
git push origin main
