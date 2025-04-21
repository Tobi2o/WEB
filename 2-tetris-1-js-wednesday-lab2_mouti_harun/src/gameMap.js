export class GameMap {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		/** 2D array storing for each position the id of the player whose block is there, or -1 otherwise. */
		// TODO: initialize the map to all -1.
		this.map = new Array(height).fill(null).map(() => new Array(width).fill(-1));
	}

	/**
	 * Drops the given shape, i.e. moves it down until it touches something, and then grounds it.
	 * @param {Shape} shape The shape to be dropped.
	 */
	dropShape(shape) {
		do {
			// Check if the shape can move down
			var canMove = this.testShape(shape, shape.row + 1, shape.col, shape.rotation);
			
			if (canMove) {
				shape.row++;
			}
		}
		while (canMove);
		this.groundShape(shape);
	}

	/**
	 * Grounds the given shape, i.e. transfers it to the map table.
	 * @param {Shape} shape The shape to be grounded.
	 */
	groundShape(shape) {
		const coordinates = shape.getCoordinates();
		coordinates.forEach(([x, y]) => {
			const mapX = shape.col + x;
			const mapY = shape.row + y;
			if (mapX >= 0 && mapX < this.width && mapY >= 0 && mapY < this.height) {
				this.map[mapY][mapX] = shape.playerId;
			}
		});
	}

	/**
	 * Tests whether the given shape is overlapping a block or is out of bounds on the left, right, or bottom of the map.
	 * This method allows the test to be done with row, col and/or rotation that are different from those of the shape itself.
	 *
	 * Note that we do not consider a shape to be out of bounds if it is (even partly) above the top of the map.
	 *
	 * @param {Shape} shape The shape to be tested
	 * @param {Number} row Optional row at which the shape should be tested. If omitted, uses that of the shape.
	 * @param {Number} col Optional col at which the shape should be tested. If omitted, uses that of the shape.
	 * @param {Number} rotation Optional rotation with which the shape should be tested. If omitted, uses that of the shape.
	 * @returns true if and only if the shape does not overlap anything and is not out of bounds.
	 */
	testShape(shape, row = shape.row, col = shape.col, rotation = shape.rotation) {
		const coordinates = shape.getCoordinates(rotation);
		return coordinates.every(([x, y]) => {
			const mapX = col + x;
			const mapY = row + y;
			return (
				mapX >= 0 &&
				mapX < this.width &&
				mapY < this.height &&
				(mapY >= 0 ? this.map[mapY][mapX] === -1 : true)
			);
		});
	}

	/**
	 * Clears any row that is fully complete.
	 */
	clearFullRows() {
    for (let row = 0; row < this.height; row++) {
        if (this.map[row].every(cell => cell !== -1)) {
            this.clearRow(row);
        }
    }
}

	/**
	 * Clears the given row, and moves any row above it down by one.
	 * @param {Number} row The row to be cleared.
	 */
	clearRow(row) {
		this.map.splice(row, 1);
   		this.map.unshift(new Array(this.width).fill(-1));
	}

	/**
	 * Returns the id of the player whose block is grounded at the given position, or -1 otherwise.
	 * @param {Number} row the requested row
	 * @param {Number} col the requested column
	 * @returns the id of the player whose block is grounded at the given position, or -1 otherwise
	 */
	getPlayerAt(row, col) {
		return this.map[row][col];
	}
}
