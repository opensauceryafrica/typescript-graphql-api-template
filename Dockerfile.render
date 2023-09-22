FROM node:alpine

RUN apk add --no-cache git openssh

RUN mkdir /app

ARG PORT

ENV PORT $PORT

# mount env file
RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env

WORKDIR /app

COPY yarn*.lock ./

COPY package*.json ./

RUN yarn

COPY tsconfig.json ./

COPY . ./

RUN yarn build

EXPOSE $PORT

CMD ["yarn", "start"]