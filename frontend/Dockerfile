FROM node:23-alpine

WORKDIR /usr/src/app

ARG EXPO_TOKEN
ENV EXPO_TOKEN=${EXPO_TOKEN}

ENV EAS_NO_VCS=1

RUN apk add --no-cache bash wget curl

RUN npm install -g eas-cli

COPY package*.json ./
RUN npm install

COPY . .

RUN ./apkurl.sh

RUN npx expo export --platform web

RUN npm install -g serve

EXPOSE 8081

CMD ["npx", "serve", "-l", "8081", "dist", "--single"]