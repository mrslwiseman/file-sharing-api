FROM node:18-alpine as builder

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
RUN npm ci
RUN npm run build

FROM node:18-alpine 

WORKDIR /usr/app
COPY --from=0 /usr/app/package.json .
COPY --from=0 /usr/app/package-lock.json . 
COPY --from=0 /usr/app/dist .
RUN npm ci --omit=dev

EXPOSE 8080