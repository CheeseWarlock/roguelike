var DungeonLayout = require("./DungeonLayout");

var Dungeon = {
	TILE_WALL: 0,
	TILE_FLOOR: 1,
	rooms: function() {
		return DungeonLayout.rooms;
	},

	atLocation: function(x, y) {
		if (this.isWall(x, y)) {
			return this.TILE_WALL;
		} else if (this.isFloor(x, y)) {
			return this.TILE_FLOOR;
		} else {
			return null;
		}
	},

	isFloor: function(x, y) {
		var floor = false;
		DungeonLayout.rooms.map((room) => {
			if (x > room[0] && x < room[2] && y > room[1] && y < room[3]) {
				floor = true;
			}
		});
		return floor;
	},

	isWall: function(x, y) {
		var wall = false;
		DungeonLayout.rooms.map((room) => {
			if (((x == room[0] || x == room[2]) && y >= room[1] && y <= room[3]) ||
					((y == room[1] || y == room[3]) && x >= room[0] && x <= room[2])) {
				wall = true;
			}
		});
		return wall;
	},

	entities: function() {
		return [
			{
				x: 2,
				z: 2,
				id: 0
			}
		];
	}
};

module.exports = Dungeon;
