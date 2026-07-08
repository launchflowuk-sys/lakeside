#!/bin/bash
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "update"
git push origin main
