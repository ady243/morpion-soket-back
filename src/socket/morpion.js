

let onlineUsers = [];

export const handleWebSocketConnections = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);

        socket.on('move', (moveData) => {
            socket.broadcast.emit('move', moveData);
        });

        // Gérer la déconnexion d'un joueur
        socket.on('disconnect', () => {
            console.log('Disconnected:', socket.id);
        });


        // Gérer les messages du chat
        //ecoute la connection d'un user 
        socket.on("addNewUser", (userId)=>{
            if (!onlineUsers.some(user => user.userId === userId)) {
                onlineUsers.push({
                    userId,
                    socketId: socket.id
                });
            }
            io.emit("getOnlineUsers", onlineUsers);
        })

        //add message
        socket.on("sendMessage", (message)=>{
            const user = onlineUsers.find(user => user.userId === message.recipientId);

            if(user){
                io.to(user.socketId).emit("getMessage", message);
            }
        })

        socket.on("disconnect",()=>{
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
            io.emit("getOnlineUsers", onlineUsers);
        })
 
    });
};
