
import { use } from "chai";
import { Server } from "socket.io";

const io = new Server( process.env.SOCKET_PORT, {
    cors: {
        origin: "http://localhost:5173",
    }
});

    let onlineUser = [];


    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        socket.on("addNewUser", (userId) => {
            ! onlineUser.some((user) => user.userId === userId) &&
            onlineUser.push({
                userId,
                socketId: socket.id,
            });

            console.log("onlineuser",onlineUser);

            io.emit("getOnlineUser", onlineUser);

        });

        //add Message
        socket.on("addMessage", (message) => {
            const user = onlineUser.find((user) => user.userId === message.respientId);
            user && io.to(user.socketId).emit("getMessage", message);
            if(user) {
                io.to(user.socketId).emit("getMessage", message);
                io.to(socket.id).emit("getNotification", {
                    senderId: message.senderId,
                    isRead: false,
                    date: new Date(),
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("a user disconnected", socket.id);
            onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
            io.emit("getOnlineUser", onlineUser);
        });

    });







