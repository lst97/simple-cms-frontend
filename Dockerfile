FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm run build

COPY . ./

FROM nginx:1.25.4-alpine-slim AS prod

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1167

CMD ["nginx", "-g", "daemon off;"]