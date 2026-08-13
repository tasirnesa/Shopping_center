# Build from the repository root: docker build -f backend/Dockerfile .
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY web/package.json web/package.json
COPY shared/package.json shared/package.json
COPY mobile/package.json mobile/package.json
RUN npm ci

FROM dependencies AS build
COPY backend backend
RUN npx prisma generate --schema=backend/prisma/schema.prisma \
    && npm run build --workspace=backend

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY backend/package.json ./backend/package.json
RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/uploads \
    && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["node", "backend/dist/main.js"]
