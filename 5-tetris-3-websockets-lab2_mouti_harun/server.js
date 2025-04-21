import express from 'express'
import expressWs from 'express-ws'
import { GameOverMessage, JoinMessage, MessageCodec, SetPlayerMessage, UpdateMapMessage } from './src/messages.js'
import { Game } from './src/game.js'
import { GameMap } from './src/gameMap.js'
import { PlayerInfo } from './src/playerInfo.js'
import { gameCols, gameRows, port, stepIntervalMs } from './src/constants.js'

const app = express()
expressWs(app)

// TODO Create a new Game instance and start a game loop
var idCounter = 0;
var sockets = new Map();
var isGameOver;

function broadcast(message){
    sockets.forEach(client => client.send(MessageCodec.encode(message)));
}

function onGameOver(){
    console.log("Game over")
    isGameOver = true;
    sockets.forEach(client => client.close());
    console.log("All connections closed")
    sockets.clear();
    idCounter = 0;
}

const gameMap = new GameMap(gameCols, gameRows);
const game = new Game(gameMap, 
    broadcast, 
    onGameOver);

setInterval(() => {
    game.step();
  }, stepIntervalMs);

// Serve the public directory
app.use(express.static('public'))

// Serve the src directory
app.use('/src', express.static('src'))

// Websocket game events
app.ws('/', (socket) => {
    // TODO handle new websocket connections.
    if(isGameOver){
        socket.close();
        return;
    }
    const playerId = idCounter++;
    game.introduceNewPlayer(new PlayerInfo(playerId));
    sockets.set(playerId, socket);

    console.log("New player connected")
    // TODO The first message the client receives should be a JoinMessage, containing its player id. The server then sends all current state to that client. Received messages from the client should be forwarded to the game instance.

    socket.send(MessageCodec.encode(new JoinMessage(playerId)));
    socket.send(MessageCodec.encode(new UpdateMapMessage(gameMap)));
    game.forEach((player) => socket.send(MessageCodec.encode(new SetPlayerMessage(player))))
    
    socket.on('message', function (message){
        game.onMessage(playerId, MessageCodec.decode(message));       
    });

    // TODO Ensure the game is notified of a player quitting when the socket is closed.
    socket.on('close', function (){
        console.log(`Player ${playerId} quit`)
        game.quit(playerId);
        sockets.delete(playerId);
    })
})

app.listen(port)

console.log("App started.")
