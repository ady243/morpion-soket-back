
export const handleWebSocketConnectionsChat = (io) => {
    io.on("connection", (socket) => {
     console.log("New client connected", socket.id);
    });
};
