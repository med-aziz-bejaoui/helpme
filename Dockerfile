FROM node:21
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps
COPY . .
CMD ["npx", "playwright", "test"]
