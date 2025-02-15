# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./

# Очищаем кэш npm и устанавливаем зависимости
RUN npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install --save-dev typescript @types/node --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

EXPOSE 3000
CMD ["npm", "run", "dev"]