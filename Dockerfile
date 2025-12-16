# syntax=docker/dockerfile:1.4

# Stage 1: Build Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependências apenas
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar TODAS as dependências (dev + prod)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build && \
    rm -rf node_modules

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar dependências de produção do stage 1
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar código buildado do stage 2
COPY --from=builder --chown=nodejs:nodejs /app/.next ./.next
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Se não for Next.js, ajuste conforme sua estrutura:
# COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
# COPY --from=builder --chown=nodejs:nodejs /app/build ./build

# Mudar para usuário não-root
USER nodejs

# Variáveis de ambiente otimizadas
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=384" \
    PORT=3000

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]