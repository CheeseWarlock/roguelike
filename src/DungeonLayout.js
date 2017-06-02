var Mandragora = require("./Mandragora");
var Bat = require("./Bat");

const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_INVISIBLE = 2;
const TILE_DOOR = 3;

class Room {
	constructor(x1, z1, x2, z2, h) {
		this.x1 = x1;
		this.z1 = z1;
		this.x2 = x2;
		this.z2 = z2;
		this.h = h;
	}
}

class Hall {
	constructor(x1, z1, x2, z2, h1, h2) {
		this.x1 = x1;
		this.z1 = z1;
		this.x2 = x2;
		this.z2 = z2;
		this.h1 = h1;
		this.h2 = h2;
	}
}

class EntitySpawn {
	constructor(x, z, h, entity) {
		this.x = x;
		this.z = z;
		this.h = h;
		this.entity = entity;
	}
}

class DungeonLayout {
	constructor() {
		this.rooms = [
			new Room(0, 0, 3, 8, 0), new Room(6, 3, 14, 14, 0), new Room(0, 10, 4, 13, -50), new Room(-6, -4, -3, 2, 100), new Room(0, -10, 5, -1, 200)
		];
		this.halls = [
			new Hall(3, 4, 6, 4, 0, 0), new Hall(4, 12, 6, 12, -50, 0), new Hall(1, 8, 1, 10, 0, -50), new Hall(-3, 1, 0, 1, 100, 0), new Hall(-3, -2, 0, -2, 100, 200) 
		];
		this.doors = [[3, 4, 0], [6, 4, 0], [1, 8, 0], [1, 10, -50], [4, 12, -50], [6, 12, 0], [0, 1, 0], [-3, 1, 100], [-3, -2, 100], [0, -2, 200]];
		this.entities = [[4, 4, 0, new Mandragora()], [1, 11, -50, new Bat()], [2, 11, -50, new Bat()]];
	}

	entityAtLocation(x, z) {
		for (const entity of this.entities) {
			if (entity[0] == x && entity[1] == z) return entity[3];
		}
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
		for (const door of this.doors) {
			if (door[0] == x && door[1] == z) return true;
		}
		return false;
	}

	isInvisibleWall(x, z) {
		for (const hallway of this.halls) {
			if (hallway.x1 == hallway.x2) {
				if (z > hallway.z1 && z < hallway.z2 && (x == hallway.x1 + 1 || x == hallway.x1 - 1)) return true;
			} else {
				if (x > hallway.x1 && x < hallway.x2 && (z == hallway.z1 + 1 || z == hallway.z1 - 1)) return true;
			}
		}
		return false;
	}

	isHall(x, z) {
		for (const hallway of this.halls) {
			if (hallway.x1 == hallway.x2) {
				if (z >= hallway.z1 && z <= hallway.z2 && x == hallway.x1) return true;
			} else {
				if (x >= hallway.x1 && x <= hallway.x2 && z == hallway.z1) return true;
			}
		}
		return false;
	}

	height(x, z) {
		var height = null;
		for (const room of this.rooms) {
			if (x >= room.x1 && x <= room.x2 && z >= room.z1 && z <= room.z2) {
				return room.h;
			}
		}
		for (const hallway of this.halls) {
			if (hallway.x1 == hallway.x2) {
				if (z >= hallway.z1 && z <= hallway.z2 && x == hallway.x1) {
					const slope = (hallway.h1 - hallway.h2) / ((hallway.z2 - hallway.z1) - 1);
					return hallway.h1 + (z - hallway.z1 - 1.5) * slope;
				}
			} else {
				if (x >= hallway.x1 && x <= hallway.x2 && z == hallway.z1) {
					const slope = (hallway.h1 - hallway.h2) / ((hallway.x2 - hallway.x1) - 1);
					return hallway.h1 + (x - hallway.x1 - 0.5) * -slope;
				}
			}
		}
	}

	getTilt(x, z) {
		for (const hallway of this.halls) {
			if (hallway.x1 == hallway.x2) {
				if (z > hallway.z1 && z < hallway.z2 && x == hallway.x1) {
					return [0, (hallway.h2 < hallway.h1 ? 0.5 : (hallway.h2 == hallway.h1 ? 0 : -0.5))];
				}
			} else {
				if (x > hallway.x1 && x < hallway.x2 && z == hallway.z1) {
					return [(hallway.h2 < hallway.h1 ? 0.5 : (hallway.h2 == hallway.h1 ? 0 : -0.5)), 0];
				}
			}
		}
		return [0, 0];
	}

	isFloor(x, z) {
		for (const room of this.rooms) {
			if (x > room.x1 && x < room.x2 && z > room.z1 && z < room.z2) {
				return true;
			}
		}
		return false;
	}

	isWall(x, z) {
		for (const room of this.rooms) {
			if (((x == room.x1 || x == room.x2) && z >= room.z1 && z <= room.z2) ||
					((z == room.z1 || z == room.z2) && x >= room.x1 && x <= room.x2)) {
				return true;
			}
		}
		return false;
	}
}

module.exports = new DungeonLayout();
