var DungeonLayout = require("./DungeonLayout");

const TILE_WALL = 0;
const TILE_FLOOR = 1;

class Dungeon {
	constructor(options) {
		this.renderer = new options.renderer({
			loadCallback: () => this.populate()
		});
	}

	populate() {
		for (var i=0;i<10;i++) {
			for (var j=0;j<10;j++) {
				var a = this.atLocation(i, j);
				if (a === TILE_WALL) {
					this.renderer.addWallBlock(i, j);
				} else if (a === TILE_FLOOR) {
					this.renderer.addFloorSection(i, j);
				}
			}
		}

		for (i in this.entities()) {
			this.renderer.addActor(this.entities()[i].x, this.entities()[i].z, 0);
		}
	}

	rooms() {
		return DungeonLayout.rooms;
	}

	atLocation(x, z) {
		if (this.isWall(x, z)) {
			return TILE_WALL;
		} else if (this.isFloor(x, z)) {
			return TILE_FLOOR;
		} else {
			return null;
		}
	}

	isFloor(x, z) {
		var floor = false;
		DungeonLayout.rooms.map((room) => {
			if (x > room[0] && x < room[2] && z > room[1] && z < room[3]) {
				floor = true;
			}
		});
		return floor;
	}

	isWall(x, z) {
		var wall = false;
		DungeonLayout.rooms.map((room) => {
			if (((x == room[0] || x == room[2]) && z >= room[1] && z <= room[3]) ||
					((z == room[1] || z == room[3]) && x >= room[0] && x <= room[2])) {
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
