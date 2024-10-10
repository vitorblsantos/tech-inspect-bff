FROM node:20-slim AS builder

WORKDIR /app

COPY . .

RUN yarn
RUN yarn prestart:prod
RUN yarn start:prod
