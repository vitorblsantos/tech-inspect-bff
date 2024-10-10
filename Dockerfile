FROM node:20-slim AS builder

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

CMD ["node", "./dist/src/main.js"]

EXPOSE 8080
