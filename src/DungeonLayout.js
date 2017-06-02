var Mandragora = require("./Mandragora");
var Bat = require("./Bat");

const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_INVISIBLE = 2;
const TILE_DOOR = 3;

class DungeonLayout {
	constructor() {
		this.rooms = [[0, 0, 3, 8, 0], [6, 3, 14, 14, 0], [0, 10, 4, 13, -50], [-6, -4, -3, 2, 100], [0, -10, 5, -1, 200]];
		this.halls = [[3, 4, 6, 4, 0, 0], [4, 12, 6, 12, -50, 0], [1, 8, 1, 10, 0, -50], [-3, 1, 0, 1, 100, 0], [-3, -2, 0, -2, 100, 200]];
		this.doors = [[3, 4, 0], [6, 4, 0], [1, 8, 0], [1, 10, -50], [4, 12, -50], [6, 12, 0], [0, 1, 0], [-3, 1, 100], [-3, -2, 100], [0, -2, 200]];
		this.entities = [[4, 4, 0, new Mandragora()], [1, 11, -50, new Bat()], [2, 11, -50, new Bat()]];
	}

	entityAtLocation(x, z) {
		var ret = false;
		this.entities.map((entity) => {
			if (entity[0] == x && entity[1] == z) ret = entity[3];
		});
		return ret;
	}

	atLocation(x, z) {
		if (this.isWall(x, z) && !this.isHall(x, z)) {
			return TILE_WALL;
		} else if (this.isFloor(x, z) || this.isHall(x, z)) {
			return TILE_FLOOR;
		} else if (this.isInvisibleWall(x, z)) {
			return TILE_INVISIBLE;
		} else {
			return null;
		}
	}

	isDoor(x, z) {
		var ret = false;
		this.doors.map((door) => {
			if (door[0] == x && door[1] == z) ret = true;
		});
		return ret;
	}

	isInvisibleWall(x, z) {
		var ret = false;
		this.halls.map((hallway) => {
			if (hallway[0] == hallway[2]) {
				if (z > hallway[1] && z < hallway[3] && (x == hallway[0] + 1 || x == hallway[0] - 1)) ret = true;
			} else {
				if (x > hallway[0] && x < hallway[2] && (z == hallway[1] + 1 || z == hallway[1] - 1)) ret = true;
			}
		});
		return ret;
	}

	isHall(x, z) {
		var ret = false;
		this.halls.map((hallway) => {
			if (hallway[0] == hallway[2]) {
				if (z >= hallway[1] && z <= hallway[3] && x == hallway[0]) ret = true;
			} else {
				if (x >= hallway[0] && x <= hallway[2] && z == hallway[1]) ret = true;
			}
		});
		return ret;
	}

	height(x, z) {
		var height = null;
		this.rooms.map((room) => {
			if (x >= room[0] && x <= room[2] && z >= room[1] && z <= room[3]) {
				height = room[4];
			}
		});
		if (height === null) {
			this.halls.map((hallway) => {
				if (hallway[0] == hallway[2]) {
					// x same: vertical hall
					if (z >= hallway[1] && z <= hallway[3] && x == hallway[0]) {
						const slope = (hallway[4] - hallway[5]) / ((hallway[3] - hallway[1]) - 1);
						height = hallway[4] + (z - hallway[1] - 1.5) * slope;
					}
				} else {
					// z same: horiz hall
					if (x >= hallway[0] && x <= hallway[2] && z == hallway[1]) {
						const slope = (hallway[4] - hallway[5]) / ((hallway[2] - hallway[0]) - 1);
						height = hallway[4] + (x - hallway[0] - 0.5) * -slope;
					}
				}
			});
		}
		return height;
	}

	getTilt(x, z) {
		var ret = [0, 0];
		this.halls.map((hallway) => {
			if (hallway[0] == hallway[2]) {
				if (z > hallway[1] && z < hallway[3] && x == hallway[0]) {
					ret = [0, (hallway[5] < hallway[4] ? 0.5 : (hallway[5] == hallway[4] ? 0 : -0.5))];
				}
			} else {
				if (x > hallway[0] && x < hallway[2] && z == hallway[1]) {
					ret = [(hallway[5] < hallway[4] ? 0.5 : (hallway[5] == hallway[4] ? 0 : -0.5)), 0];
				}
			}
		});
		return ret;
	}

	isFloor(x, z) {
		var floor = false;
		this.rooms.map((room) => {
			if (x > room[0] && x < room[2] && z > room[1] && z < room[3]) {
				floor = true;
			}
		});
		return floor;
	}

	isWall(x, z) {
		var wall = false;
		this.rooms.map((room) => {
			if (((x == room[0] || x == room[2]) && z >= room[1] && z <= room[3]) ||
					((z == room[1] || z == room[3]) && x >= room[0] && x <= room[2])) {
				wall = true;
			}
		});
		return wall;
	}
}

module.exports = new DungeonLayout();
