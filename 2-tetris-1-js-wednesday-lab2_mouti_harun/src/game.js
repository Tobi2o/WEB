import { gameRows, gameCols, cellPixelSize } from './constants.js';
import { Shape } from './shape.js';
import { GameMap } from './gameMap.js';

export class Game extends Map {
	constructor(gameMap) {
		super();
		this.map = gameMap;
		this.isGameOver = false;
	}

	/**
	 * Returns shape of given player, or undefined if no such player or shape.
	 * @param {Number} id Id of the player whose shape is to be returned.
	 */
    getShape(id) {
        const playerInfo = this.get(id);
        return playerInfo ? playerInfo.shape : undefined;
    }

	/**
	 * Executes the provided function on each shape in the game.
	 * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
	 */
    forEachShape(f) {
        this.forEach(playerInfo => {
            if (playerInfo.shape) {
                f(playerInfo.shape);
            }
        });
    }
    /**
     * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
     * @param {Number} playerId The id of the player whose shape should be dropped
     */
    dropShape(playerId) {
        const shape = this.getShape(playerId);
        if (!shape) return;

        this.map.dropShape(shape);
    }

	/**
	 * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
	 */
	step() {
		/*
        TODO:
        - If the game is over, ignore this phase.
        - Move each shape down by one. If it cannot, then that shape is touching the ground and should be force-dropped. Re-use code wheree possible.
        */
		if (this.isGameOver) return;
        
		// Move each shape down by one
		this.forEachShape((shape) => {
			shape.row++;
		});

		this.forEachShape((shape) => {
			// If it cannot, the shape is touching the ground
			if (!this.map.testShape(shape)) {
				// move it back up by one
				shape.row--;
				
				// drop it and add a new one for the player
				this.dropShape(shape.playerId);
				this.addNewShape(shape.playerId);
				
				// all other players' shapes that are in collision with the newly dropped shape get new shapes
				this.forEach((playerInfo, id) => {
					if (id !== shape.playerId && !this.map.testShape(playerInfo.shape)) {
						this.addNewShape(id);
					}
				});
			}
		});

        this.map.clearFullRows();
		
	}

	/**
	 * Replace current shape of given player id (if any) with a new random shape.
	 * @param {Number} id Id of the player whose shape should be replaced.
	 */
	addNewShape(id) {
		/*
        TODO
        - Add a shape of random type to the given player.
        - If that shape is overlapping something, then the game is over.
        */
		const shapeType = Shape.getRandomShapeType();
        const shapeCol = Math.floor(this.map.width / 2);
        const shape = new Shape(shapeType, id, shapeCol, 0, 0);

		if (this.map.testShape(shape)) {
        	let playerInfo = this.get(id);
        	playerInfo.shape = shape;
        } else {
            this.gameOver();
        }
	}

	/**
	 * Resets the game upon game over.
	 */
	gameOver() {
		// TODO: reset the map and all players.
		this.isGameOver = true;
		this.map = new GameMap(this.map.height, this.map.width);
		this.clear();
	}
}
