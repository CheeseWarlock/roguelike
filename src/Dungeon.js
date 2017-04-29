var DungeonLayout = require("./DungeonLayout");

const TILE_WALL = 0;
const TILE_FLOOR = 1;

class Dungeon {
	rooms() {
		return DungeonLayout.rooms;
	}

	atLocation(x, y) {
		if (this.isWall(x, y)) {
			return TILE_WALL;
		} else if (this.isFloor(x, y)) {
			return TILE_FLOOR;
		} else {
			return null;
		}
	}

	isFloor(x, y) {
		var floor = false;
		DungeonLayout.rooms.map((room) => {
			if (x > room[0] && x < room[2] && y > room[1] && y < room[3]) {
				floor = true;
			}
		});
		return floor;
	}

	isWall(x, y) {
		var wall = false;
		DungeonLayout.rooms.map((room) => {
			if (((x == room[0] || x == room[2]) && y >= room[1] && y <= room[3]) ||
					((y == room[1] || y == room[3]) && x >= room[0] && x <= room[2])) {
				wall = true;
			}
		});
		return wall;
	}

	entities() {
		return [
			{
				x: 2,
				z: 2,
				id: 0
			}
		];
	}
}

module.exports = {
	TILE_WALL: TILE_WALL,
	TILE_FLOOR: TILE_FLOOR,
	Dungeon: Dungeon
};
