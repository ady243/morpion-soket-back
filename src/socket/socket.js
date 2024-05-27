const onlineUsers = new Set();

export const handleWebSocketConnectionsChat = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

        socket.on("addNewUser", (userId) => {
            onlineUsers.add(userId);
            console.log("Online users", onlineUsers);

            io.emit("getOnlineUsers", Array.from(onlineUsers));
        });

        socket.on("sendMessage", (message) => {
            if (onlineUsers.has(message.recipientId)) {
                io.to(onlineUsers.get(message.recipientId)).emit("getMessage", message);
                io.to(socket.id).emit("getNotification", {
                    senderId: message.senderId,
                    isRead: false,
                    date: new Date(),
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("getOnlineUsers", Array.from(onlineUsers));
        });
    });
};
