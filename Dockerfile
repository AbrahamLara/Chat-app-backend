# syntax=docker/dockerfile:1
FROM node:12.3.1

WORKDIR /chat-app-backend

COPY . .

RUN npm install

EXPOSE 5000
EXPOSE 8000

CMD ["npm", "run", "dev"]
