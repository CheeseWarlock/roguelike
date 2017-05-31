const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_INVISIBLE = 2;
const TILE_DOOR = 3;

class DungeonLayout {
	constructor() {
		this.size = [20, 20];
		this.rooms = [[0, 0, 3, 8], [6, 3, 14, 14], [0, 10, 4, 13]];
		this.halls = [[3, 4, 6, 4], [4, 12, 6, 12], [1, 8, 1, 10]];
		this.doors = [[3, 4], [6, 4], [1, 8], [1, 10], [4, 12], [6, 12]];
	}

	atLocation(x, z) {
		if (this.isDoor(x, z)) {
			return TILE_DOOR;
		} else if (this.isWall(x, z) && !this.isHall(x, z)) {
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
