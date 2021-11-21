FROM node:16-alpine
WORKDIR /app
COPY . /app
RUN apk add git
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "run", "start"]
