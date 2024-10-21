const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const cors = require("cors");

// Use CORS middleware
app.use(cors("*"));

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5004;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("iam loooser");
});

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat/:id", (req, res) => {
//   console.log(req.params);
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   if (!singleChat) {
//     return res.status(404).send("Chat not found");
//   }
//   console.log(singleChat);
//   res.send(singleChat);
// });

const server = app.listen(PORT, (req, res) =>
  console.log(`server is runnig successfully in ${PORT}`.blue.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://letsdogossips.netlify.app/",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
