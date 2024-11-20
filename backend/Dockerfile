FROM node:23.2.0-bullseye-slim

WORKDIR /usr/src/app
COPY . .

RUN npm i -g pnpm
RUN pnpm i

EXPOSE 8080

CMD pnpm run start
