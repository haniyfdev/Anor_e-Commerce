# 1. Node.js ning barqaror versiyasini tanlaymiz
FROM node:20-alpine

# 2. Konteyner ichidagi ishchi papka
WORKDIR /app

# 3. Kutubxonalar ro'yxatini nusxalaymiz
COPY package*.json ./

# 4. Kutubxonalarni o'rnatamiz
RUN npm install

# 5. Loyihaning barcha fayllarini nusxalaymiz
COPY . .

# 6. Vite-ning 5173 portini tashqariga ochamiz
EXPOSE 5173

# 7. Frontendni ishga tushirish (host 0.0.0.0 Docker uchun shart)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]