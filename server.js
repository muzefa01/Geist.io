import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { GameState } from './src/gameState.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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
  const player = socket

  socket.on('createRoom', () => {
    if (socket.rooms.size === 1) { // each player is in a solo room by default, so allowed to join 1 more
      const roomCode = validRoomCode()
      socket.join(roomCode)
      const newGame = new GameState(roomCode)
      newGame.plr[0] = socket.id
      games.push(newGame)
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
            io.to(games[i].plr[j]).emit('offerSpirit', games[i].currentlyOffering[j], 'start', j) // j is plr index
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
              io.to(socket.id).emit('confirmSpirit', games[i].currentlyOffering[j], games[i].teams[j].length, () => {

                if (games[i].teams[j].length < 3) { 
                  // team still not full after pushing to team?
                  games[i].currentlyOffering[j] = games[i].offerSpirit()
                  io.to(games[i].plr[j]).emit('offerSpirit', games[i].currentlyOffering[j], 'confirmed') 
                } else { 
                  // team full
                  games[i].ready[j] = 'battles'
                  if (games[i].ready[0] === 'battles' && games[i].ready[1] === 'battles') {
                    games[i].phase = 'battles'
                    io.to(games[i].room).emit('beginBattles', games[i].teams, games[i].firstChoice)
                    console.log('beginBattles')
                  }
                }
              })
            }
          }
        }
      }
    }
  })

  socket.on('chooseMatchup1', (roomCode, chosenFighters) => {
    console.log("A")
    for (let i in games) {
      if (games[i].room === roomCode) {
        console.log("B")
        if (socket.id === games[i].plr[ games[i].firstChoice ]) { // if the sender is the acting player
          console.log("C")
          console.log(chosenFighters)
          console.log(games[i].fightersActive)
          if (games[i].fighterCheck(chosenFighters)) {
            // games[i].battle'em() - find & tally winner, set alreadyFoughts
            io.to(games[i].room).emit('firstBattle', chosenFighters)
            console.log("firstBattles")
          }
        }
      }
    }
  })

  socket.on('chooseMatchup2', (roomCode, chosenFighters) => {
    for (let i in games) {
      if (games[i].room === roomCode) {
        if (socket.id === games[i].plr[ games[i].secondChoice ]) { // if the sender is the acting player
          if (games[i].fighterCheck(chosenFighters) && games[i].fighterCheck(games[i].others(chosenFighters))) {
            io.to(games[i].room).emit('secondThirdBattles', chosenFighters, games[i].others(chosenFighters))
            // games[i].battle'em() twice
            // and they win
          }
        }
      }
    }
  })


  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`)
  });
});
