FROM node:22

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm install

COPY backend ./backend

RUN npx prisma generate --schema=backend/prisma/schema.prisma \
    && npm run build --workspace=backend

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]