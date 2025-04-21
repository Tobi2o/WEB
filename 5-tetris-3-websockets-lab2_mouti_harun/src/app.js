import { Renderer } from "./renderer.js"
import { Replica } from "./game.js"
import { GameMap } from "./gameMap.js"
import { gameCols, gameRows, port } from "./constants.js"
import { JoinMessage, MessageCodec } from "./messages.js"
import { setListeners } from "./inputListener.js";

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

const gameMap = new GameMap(gameCols, gameRows)
const replica = new Replica(gameMap)
const renderer = new Renderer(replica, context)

// Render loop
function loop() {
    renderer.render()
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

// TODO Get hostname from current URL, and use it to open a Web socket to the corresponding `ws://` URL.
const hostname = window.location.hostname;
const wsUrl = `ws://${hostname}:${port}`;
const webSocket = new WebSocket(wsUrl);

// TODO Once the socket is open, set the input listener to send messages to the server.
webSocket.addEventListener('open', (event) => {
    console.log("Connected to websocket")
    setListeners(canvas, (msg) => {
        webSocket.send(MessageCodec.encode(msg))
      });
})

// TODO Handle messages received on that socket from the server. If the message is a `JoinMessage`, set the player id of the renderer. Otherwise, pass the message to the replica.
webSocket.onmessage = (msg) => {
    const message = MessageCodec.decode(msg.data);
    if(message instanceof JoinMessage){
        console.log("Joined the game")
        renderer.setPlayerId(message.getPlayerId());
    }
    else{
        replica.onMessage(message);
    }
}

webSocket.onclose = () => {
    console.log("Connection to websocket ended")
}
