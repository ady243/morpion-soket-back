const animalNames = ["Lion", "Tigre", "Ours", "Girafe", "Zèbre", "Hippopotame", "Kangourou", "Panda", "Gorille", "Crocodile"];
let players = {};
let onlineUsers = [];

const generateRandomAnimalName = () => {
    const randomIndex = Math.floor(Math.random() * animalNames.length);
    const animalName = animalNames.splice(randomIndex, 1)[0];
    return animalName;
};

export const handleWebSocketConnections = (io) => {
    io.on('connection', (socket) => {
        // Assign a role to the connected player
        if (!players.X) {
            players.X = { id: socket.id, name: generateRandomAnimalName() };
            socket.emit('role', 'X');
        } else if (!players.O) {
            players.O = { id: socket.id, name: generateRandomAnimalName() };
            socket.emit('role', 'O');
        } else {
            socket.emit('full');
            socket.disconnect();
            return;
        }

        // Emit the current players
        socket.emit('players', players);

        // Handle moves
        socket.on('move', (moveData) => {
            socket.broadcast.emit('move', moveData);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            if (players.X?.id === socket.id) {
                delete players.X;
            } else if (players.O?.id === socket.id) {
                delete players.O;
            }
            socket.emit('players', players);

            // Remove user from online users
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
            socket.emit("getOnlineUsers", onlineUsers);
        });

        // Add new user to online users list
        socket.on("addNewUser", (userId) => {
            if (!onlineUsers.some(user => user.userId === userId)) {
                onlineUsers.push({
                    userId,
                    socketId: socket.id
                });
            }
            socket.emit("getOnlineUsers", onlineUsers);
        });

        socket.on("sendMessage", (message) => {
            const user = onlineUsers.find(user => user.userId === message.recipientId);

            if (user) {
                const notification = {
                    from: message.senderId,
                    to: message.recipientId,
                    message: message.text,
                    time: new Date()
                };

                socket.to(user.socketId).emit("getMessage", message);
                
        
                socket.emit("getNotification", notification);

               
                io.emit('newMessage', message);
            }
        });

    });
};
