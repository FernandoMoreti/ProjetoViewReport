# Dockerfile do Frontend
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copia a build do Next.js
COPY . .

EXPOSE 3000

CMD ["npm", "start"]