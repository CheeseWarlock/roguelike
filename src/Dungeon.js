var Dungeon = {
	TILE_WALL: 0,
	TILE_FLOOR: 1,
	rooms: function() {
		return [[0, 0, 8, 6]];
	},

	atLocation: function(x, y) {
		if (x == 0 || y == 0 || x == 7 || y == 5) {
			return this.TILE_WALL;
		} else {
			return this.TILE_FLOOR;
		}
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
