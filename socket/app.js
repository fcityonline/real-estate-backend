import { Server } from "socket.io";

const io = new Server({
  cors: { origin: "http://localhost:5173" },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.find((u) => u.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
  console.log("Online Users:", onlineUsers);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
  console.log("User disconnected. Online Users:", onlineUsers);
};

const getUser = (userId) => onlineUsers.find((u) => u.userId === userId);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("newUser", (userId) => addUser(userId, socket.id));

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      io.to(receiver.socketId).emit("notification", { chatId: data.chatId });
    }
  });

  socket.on("disconnect", () => removeUser(socket.id));
});

io.listen(4000);
console.log("🚀 Socket server running on port 4000");