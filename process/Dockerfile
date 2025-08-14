FROM node:22.11.0-bookworm-slim AS builder

WORKDIR /app
    
COPY package*.json ./

RUN npm ci
    
COPY . .
    
RUN npm run build
    
FROM node:22.11.0-bookworm-slim
    
WORKDIR /app
    
COPY package*.json ./

RUN npm ci --omit=dev
    
COPY --from=builder /app/dist ./dist

COPY .env .env
    
RUN useradd --user-group --create-home --shell /bin/false appuser
USER appuser
    
EXPOSE 3000
    
CMD ["node", "dist/main.js"]
    