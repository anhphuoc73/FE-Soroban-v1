FROM node:21.1.0-alpine

RUN apk update && apk add --no-cache git

WORKDIR /fe-soroban

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3031

CMD ["npm", "run", "start"]