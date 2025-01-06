# frontend/Dockerfile
FROM node:18.17.0-alpine

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

EXPOSE 3000
CMD ["npm", "run", "dev"]