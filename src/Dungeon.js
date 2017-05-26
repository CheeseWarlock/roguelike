var DungeonLayout = require("./DungeonLayout");
var PlayerCharacter = require("./PlayerCharacter");

const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_INVISIBLE = 2;

class Dungeon {
	constructor(options) {
		this.renderer = new options.renderer({
			loadCallback: () => this.populate()
		});
		this.entities = [];
	}

	populate() {
		for (var i=0;i<DungeonLayout.size[0];i++) {
			for (var j=0;j<DungeonLayout.size[1];j++) {
				var a = this.atLocation(i, j);
				if (a === TILE_WALL) {
					this.renderer.addWallBlock(i, j);
				} else if (a === TILE_FLOOR) {
					this.renderer.addFloorSection(i, j);
				} else if (a === TILE_INVISIBLE) {
					this.renderer.addInvisibleWallBlock(i, j);
				}
			}
		}

		this.addEntity(2, 2, 0);
	}

	addEntity(x, z, id) {
		var pc = new PlayerCharacter((x, z, id) => this.moveEntity(x, z, id));
		pc.id = id;
		pc.x = x;
		pc.z = z;
		this.entities.push(pc);
		this.renderer.addActor(pc);
	}

	moveEntity(x, z, id) {
		if (!this.renderer.isAnimating() && this.atLocation(this.entities[id].x + x, this.entities[id].z + z) == TILE_FLOOR) {
			this.entities[id].x += x;
			this.entities[id].z += z;
			this.renderer.moveCharacter(x, z, id);
		}
	}

	rooms() {
		return DungeonLayout.rooms;
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

	isInvisibleWall(x, z) {
		var ret = false;
		DungeonLayout.halls.map((hallway) => {
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
		DungeonLayout.halls.map((hallway) => {
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
}

module.exports = {
	TILE_WALL: TILE_WALL,
	TILE_FLOOR: TILE_FLOOR,
	TILE_INVISIBLE: TILE_INVISIBLE,
	Dungeon: Dungeon
};
