const animalNames = ["Lion", "Tigre", "Ours", "Girafe", "Zèbre", "Hippopotame", "Kangourou", "Panda", "Gorille", "Crocodile"];
let players = {}; 

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
    });
};
