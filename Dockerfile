### ETAPA 1 - BUILD
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --omit=dev
RUN npm cache clean --force

COPY . .

RUN npm run build

### ETAPA 2 - START

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

CMD ["node", "./dist/main.js"]

EXPOSE 8080
