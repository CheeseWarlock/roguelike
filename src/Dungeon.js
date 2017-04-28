var Dungeon = {
	rooms: function() {
		return [[0, 0, 8, 6]];
	},

	atLocation: function(x, y) {
		if (x == 0 || y == 0 || x == 7 || y == 5) {
			return TILE_WALL;
		} else {
			return TILE_FLOOR;
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
