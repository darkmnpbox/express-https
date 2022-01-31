FROM node:14.18.3

WORKDIR /user/src/app

COPY . .

RUN npm install

CMD ["npm", "start"]