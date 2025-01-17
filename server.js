import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = [];


app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

io.on('connection', (socket) => {
  players.push({ posx: 100, posy: 450, id: socket.id, animState: 'left' });
  console.log(`Player connected: ${socket.id}`);

  socket.on('updatePlayers', (data) => {
    for (let player of players) {
      if (player.id === socket.id) {
        player.posx = data.posx;
        player.posy = data.posy;
        player.animState = data.animState;
      }
    }
    io.emit('updatePlayers', players);
  });

  socket.on('disconnect', () => {
    players = players.filter((player) => player.id !== socket.id);
    console.log(`Player disconnected: ${socket.id}`);
  });
});
