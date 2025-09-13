FROM node:22-alpine

WORKDIR /app

# System-Tools (optional, falls prisma/mongo/postgres Tools gebraucht werden)
RUN apk add --no-cache bash openssl

# Dependencies installieren
COPY package.json package-lock.json turbo.json ./
COPY app/web/package.json ./apps/web/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN npm ci

# Projekt wird im Dev-Modus gemountet → kein Copy . .
EXPOSE 3000
EXPOSE 4000

CMD ["npm", "run", "dev"]
