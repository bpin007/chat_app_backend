FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5005
ENV PORT=5005
ENV MONGO_URL="mongodb+srv://bipingowda7:shiva@chat-app.4hs2r.mongodb.net/?retryWrites=true&w=majority&appName=chat-app"
ENV JWT_SECRET=bipin
CMD ["npm", "start"]
