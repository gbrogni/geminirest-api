FROM node:18

WORKDIR /app

COPY .env ./ 
COPY package*.json ./ 

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["gemini-pg:5432", "--", "sh", "-c", "npx prisma migrate deploy && node seed.js && npm run start"]

EXPOSE 3000