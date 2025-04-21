# === Stage 1: Build Angular App ===
FROM node:12 AS builder

WORKDIR /app

# Установим зависимости
COPY package*.json angular.json tsconfig.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Собираем прод-версию Angular-приложения
RUN npm run build -- --configuration production

# === Stage 2: Nginx to serve Angular ===
FROM nginx

# Удаляем дефолтные страницы nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем собранный фронт
COPY --from=builder /app/dist /usr/share/nginx/html

# Кастомный конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
