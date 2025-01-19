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
app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

function randInt(max) {return Math.floor(Math.random() * (max+1))}
function randChar() {let num = randInt(35); return num > 9 ? String.fromCharCode(num+55) : String(num)}
function randRoomCode() {return randChar() + randChar() + randChar() + randChar()}
function validRoomCode() {
  let code = ""
  let valid = false
  while (!valid) { // room code generation. 4 characters, 0-9 A-Z, avoids duplicates
    valid = true
    code = randRoomCode()
    for (let i in games) {
      if (games[i].room === code) valid = false
    }
  }
  return code
}

const games = []
/*
{room: 09AZ}
*/

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  const player = socket

  socket.on('createRoom', () => {
    if (socket.rooms.size === 1) { // each player is in a solo room by default, so allowed to join 1 more
      const roomCode = validRoomCode()
      socket.join(roomCode)
      games.push({
        room: roomCode,
        p: [socket.id] 
      })
      console.log(`Room ${roomCode} has been created.`)
    }
  })

  socket.on('joinRoom', (roomCode) => {
    if (socket.rooms.size === 1) {
      for (let i in games) {
        if (games[i].room === roomCode) {
          socket.join(roomCode)
          games[i].p.push(socket.id)
          console.log(`Room ${roomCode} has been joined.`)
        }
      }
    }
  })

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`)
  });
});
