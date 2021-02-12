FROM node:12-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080

# build app
RUN npm run build

CMD [ "npm", "start" ]