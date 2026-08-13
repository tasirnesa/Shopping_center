# Build from the repository root: docker build -f web/Dockerfile .
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY web/package.json web/package.json
COPY shared/package.json shared/package.json
COPY mobile/package.json mobile/package.json
RUN npm ci

FROM dependencies AS build
COPY web web
# Vite transpiles the TypeScript application as part of its production build.
# The project also has a separate `npm run build --workspace=web` type-check
# step for CI/development.
WORKDIR /app/web
RUN ../node_modules/.bin/vite build

FROM nginx:1.27-alpine
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
