import { Server } from "socket.io";

export default function (server) {
    const io = new Server(server, {
        cors: {
        origin: "*",
        },
    });
    
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);
        socket.on("disconnect", () => {
        console.log("user disconnected");
        });
    });
    }



