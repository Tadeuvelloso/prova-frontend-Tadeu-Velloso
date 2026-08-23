# syntax=docker/dockerfile:1

FROM node:24-alpine AS build

WORKDIR /app

# Manifesto e lock antes do resto do código: enquanto as dependências não
# mudam, o Docker reaproveita a camada do `npm ci` e o rebuild só refaz o build.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
