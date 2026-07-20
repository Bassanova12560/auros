# AUROS Shield — on-prem cryptographic underlayer
# Keys stay in the container / mounted secret. Do not expose publicly without VPN.

FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY dist ./dist
COPY bin ./bin
ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787
CMD ["node", "-e", "import('./dist/server.js').then(m => m.startShieldServer(Number(process.env.PORT||8787)))"]
