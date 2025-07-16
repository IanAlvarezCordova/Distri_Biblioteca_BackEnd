# Dockerfile

FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Runtime image ---
FROM node:18

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
