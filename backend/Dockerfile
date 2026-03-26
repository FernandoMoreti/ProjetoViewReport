# Dockerfile do Backend
FROM node:24-slim

WORKDIR /app

# Copia apenas os arquivos necessários para rodar
COPY package*.json ./
RUN npm install --omit=dev

# Copia o código já buildado (pasta dist)
COPY dist ./dist
COPY .env .

EXPOSE 3003

CMD ["npm", "start"]