# syntax=docker/dockerfile:1.7
#
# Two-stage build: node:22-alpine compiles the Astro static site, nginx:alpine
# serves the resulting dist/ on port 8080 to match fly.toml internal_port.
#
# Build context note: `predev`/`prebuild` npm scripts call sync-bug-fab.mjs,
# which reads from `../BUG-FAB/repo/static/`. That parent path is NOT present
# inside the Docker context, so sync-bug-fab is a no-op here (it warns and
# exits 0). Instead, we COPY the already-synced `public/bug-fab/` from the
# local checkout — this means whoever runs `fly deploy` must have run
# `npm run sync:bugfab` locally first, OR Docker will ship without the FAB
# bundle. The .dockerignore is set up so the synced files DO get copied.

FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Build only — skip the sync step (parent repo is outside the build context).
# `astro check` + `astro build`. If `public/bug-fab/` was synced locally, it
# gets copied into the build context and shipped in dist/.
RUN npx astro check && npx astro build

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
