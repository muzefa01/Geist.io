import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import { GameState } from './src/gameState.js'

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
      if (games[i].room === code) 
        valid = false
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
      games.push(new GameState(roomCode))
      console.log(`Room ${roomCode} has been created.`)
      io.to(socket.id).emit("yourRoomIs", roomCode)
    }
  })

  socket.on('joinRoom', (roomCode) => {
    if (socket.rooms.size === 1) { // each player is in a solo room by default, so allowed to join 1 more
      for (let i in games) {
        if (games[i].room === roomCode) {
          socket.join(roomCode)
          games[i].plr.push(socket.id)
          console.log(`Room ${roomCode} has been joined by another.`)
          
          games[i].moveToTeambuild() // progress game state
          for (let j in games[i].plr) { // client will need to start teambuild on this signal:
            io.to(games[i].plr[j]).emit('offerSpirit', games[i].currentlyOffering[j], 'start', j) 
          }
        }
      }
    }
  })

  socket.on('rerollSpirit', (roomCode) => { // players always emit roomCode to make the search faster
    for (let i in games) { if (games[i].room === roomCode) { // search rooms
        for (let j in games[i].plr) { if (games[i].plr[j] === socket.id) { // search players in room
          if (games[i].rerolls[j] > 0) {
              games[i].rerolls[j] --
              games[i].currentlyOffering[j] = games[i].offerSpirit()
              io.to(games[i].plr[j]).emit('offerSpirit', games[i].currentlyOffering[j], 'reroll') 
            }
          }
        }
      }
    }
  })

  socket.on('recruitSpirit', (roomCode) => { // players always emit roomCode to make the search faster
    for (let i in games) { if (games[i].room === roomCode) { // search rooms
        for (let j in games[i].plr) { if (games[i].plr[j] === socket.id) { // search players in room

          if (games[i].teams[j].length < 3) {
              games[i].teams[j].push(games[i].currentlyOffering[j])
              io.to(socket.id).emit('confirmSpirit', games[i].currentlyOffering[j], () => {

                if (games[i].teams[j].length < 3) { // team still not full after pushing to team?
                  games[i].currentlyOffering[j] = games[i].offerSpirit()
                  io.to(games[i].plr[j]).emit('offerSpirit', games[i].currentlyOffering[j], 'confirmed') 
                } else { // team full
                  games[i].ready[j] = 'battles'
                  if (games[i].ready[0] === 'battles' && games[i].ready[1] === 'battles') {
                    games[i].phase = 'battles'
                    io.to(games[i].room).emit('beginBattles', games[i].teams, games[i].firstChoice)
                  }
                }
              })
            }
          }
        }
      }
    }
  })

  socket.on('chooseMatchup', (roomCode, combatants) => {
    
  })


  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`)
  });
});
