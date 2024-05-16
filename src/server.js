import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/config.js';
import app from './app.js'; // Importez l'application depuis app.js
import * as http from 'http';
import { Server } from 'socket.io';
import { handleWebSocketConnections } from './socket/morpion.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down1...', err);
  console.log(err.name, err.message);
  process.exit(1);
});


mongoose
    .connect(config.db.connection, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('👌 Database connected');
    })
    .catch((error) => {
      console.log('❌ Database connection failed', error);
      process.exit(1);
    });


const PORT = config.port;

const server = http.createServer(app);

const io = new Server(server, {

  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type'],
    credentials: true
  }
});

handleWebSocketConnections(io);

server.listen(PORT, () => {
  console.log(`Environment: ${config.environment}`);
  console.log(`🎉 Listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!  shutting down2 ...', err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
