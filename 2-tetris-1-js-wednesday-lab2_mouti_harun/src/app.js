import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { PlayerInfo } from "./playerInfo.js";
import { GameMap } from "./gameMap.js";
import { gameCols, gameRows, stepIntervalMs } from "./constants.js";

/*
TODO:
- Create new game, player and renderer.
- Start a game loop that makes the game step every stepIntervalMs milliseconds (see constants.js).
- Start a rendering loop on the renderer using requestAnimationFrame.
*/

var game = new Game(new GameMap(gameCols, gameRows));
var player1 = new PlayerInfo(0, null);
game.set(0, player1);

//add a shape for testing
game.addNewShape(0);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var renderer = new Renderer(game, ctx);

function renderLoop() {
  renderer.render();
  requestAnimationFrame(renderLoop);
}

function loop() {
  game.step();
}

requestAnimationFrame(renderLoop);
setInterval(loop, stepIntervalMs);

console.log("Hello, world!");
