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
        console.log('New connection:', socket.id);

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


        io.emit('players', players);

        socket.on('move', (moveData) => {
            socket.broadcast.emit('move', moveData);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected:', socket.id);
            if (players.X?.id === socket.id) {
                delete players.X;
            } else if (players.O?.id === socket.id) {
                delete players.O;
            }
            io.emit('players', players);
        });
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
