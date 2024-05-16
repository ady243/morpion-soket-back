import * as userService from "../../src/services/user.service.js";


const userSocketMap = {};

export const handleWebSocketConnections = (io) => {


    // Middleware pour gérer le CORS pour les connexions WebSocket
    io.use((socket, next) => {
        // Autoriser l'origine du client
        socket.request.headers.origin = socket.request.headers.origin || '*';
        // Autoriser les en-têtes personnalisés
        socket.request.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type';
        // Autoriser les cookies et les informations d'authentification
        socket.request.headers['Access-Control-Allow-Credentials'] = true;
        next();
    });

    io.on('connection', (socket) => {
        console.log('Nouvelle connexion WebSocket établie');
        // Gérez les mouvements de jeu
        socket.on('move', (moveData) => {
            // Diffusez le mouvement uniquement à l'utilisateur connecté
            const userSocket = userSocketMap[userId];
            if (userSocket) {
                userSocket.emit('move', moveData);
            }
        });

        // Gérez la déconnexion de l'utilisateur
        socket.on('disconnect', () => {
            console.log('Déconnexion WebSocket');
            // Supprimez l'association utilisateur-socket
     
        });
    });
};
