---
name: Coolify healthcheck pitfall
description: nginx:alpine has no wget or curl — a healthcheck using either marks the container unhealthy, causing Traefik to silently refuse all traffic despite the container running fine.
---

# Coolify healthcheck pitfall

## The rule
Do not add a `healthcheck` to the `frontend` service when using `nginx:1.27-alpine`. That image has no `wget` or `curl`, so the healthcheck always fails, Docker marks the container unhealthy, and Coolify/Traefik drops all incoming traffic with "no available server" — even though nginx is running perfectly.

**Why:** `nginx:alpine` is a minimal image. Busybox is present but `wget` is not wired up in the same way, and `curl` is absent entirely.

**How to apply:** Leave the frontend service without a healthcheck. nginx starting up is sufficient signal. Only add healthchecks to services that have the necessary tooling (e.g. the `api` service uses `node:24-slim` which can run `wget` or a node script, and the `db` service uses `pg_isready`).
