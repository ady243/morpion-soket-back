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
    });
};
