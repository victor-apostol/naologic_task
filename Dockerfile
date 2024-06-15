FROM node:20-alpine AS build
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install
RUN npm install -g @nestjs/cli 

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /home/node/app

COPY --from=build /home/node/app/dist ./dist
COPY --from=build /home/node/app/images40.csv ./dist/images40.csv
COPY --from=build /home/node/app/package*.json ./

RUN npm install --omit=dev

CMD ["node", "dist/main.js"]
