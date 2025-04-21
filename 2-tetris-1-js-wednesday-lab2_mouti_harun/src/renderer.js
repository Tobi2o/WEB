import { cellPixelSize, shapeColors } from "./constants.js";
import { Game } from "./game.js";
import { Shape } from "./shape.js";
import { GameMap } from "./gameMap.js";

function cellToPixel(x) {
    return x * cellPixelSize;
}

export class Renderer {
    constructor(game, context) {
        this.game = game;
        this.context = context;
    }

    /**
     * Clears the context and draws all falling and dropped shapes.
     */
    render() {
        /*
        TODO:
        - Reset context
        - Draw all falling shapes
        - Draw all blocks stored in the game map, i.e. the dropped/grounded shapes.

        You may benefit from splitting this method into smaller ones.
        */
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.renderMap();
        this.renderShapes();
    }

    renderShapes(){
        this.game.forEachShape((shape) => {
            if (shape !== undefined) {

                const coords = shape.getCoordinates();
                for (let i = 0; i < coords.length; i++) {
                    const coord = coords[i];
                    this.drawBlock(shape.col + coord[0], shape.row + coord[1], shape.playerId);
                }
            }
        });
    }

    renderMap(){
        let gameMap = this.game.map;
        for (let row = 0; row < gameMap.height; ++row) {
            for (let col = 0; col < gameMap.width; ++col){

                let id = this.game.map.getPlayerAt(row, col);
                if(id != -1){
                    this.drawBlock(col, row, id);
                }
            }
        }
    }

    drawBlock(col, row, playerId){
        this.context.fillStyle = shapeColors[playerId % shapeColors.length];
        this.context.fillRect(cellToPixel(col), cellToPixel(row), cellPixelSize, cellPixelSize);
        this.context.strokeRect(cellToPixel(col), cellToPixel(row), cellPixelSize, cellPixelSize);
    }
}