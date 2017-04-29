var Dungeon = {
	TILE_WALL: 0,
	TILE_FLOOR: 1,
	rooms: function() {
		return [[0, 0, 2, 2], [4, 0, 6, 5]];
	},

	atLocation: function(x, y) {
		// prev: 8,6
		if (this.isWall(x, y)) {
			return this.TILE_WALL;
		} else {
			return this.TILE_FLOOR;
		}
	},

	isWall: function(x, y) {
		var wall = false;
		this.rooms().map((room) => {
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
