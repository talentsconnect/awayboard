FROM node:latest

RUN mkdir -p /awayboard
RUN mkdir -p /awayboard/.data

WORKDIR /awayboard

COPY . .

RUN npm install

ENV PORT 5711
EXPOSE 5711

CMD ["npm", "start"]
