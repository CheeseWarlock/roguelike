var DungeonLayout = require("./DungeonLayout");
var PlayerCharacter = require("./PlayerCharacter");
var Mandragora = require("./Mandragora");
var Bat = require("./Bat");

const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_INVISIBLE = 2;

class Dungeon {
	constructor(options) {
		this.renderer = new options.renderer({
			loadCallback: () => this.populate()
		});
		this.entities = new Map();
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

		this.playerCharacter = new PlayerCharacter((x, z, id) => this.handlePlayerAction(x, z, id));
		this.addEntity(2, 2, 0, this.playerCharacter);
		this.addEntity(4, 4, 1, new Mandragora());
		this.addEntity(1, 9, 2, new Bat());
		this.addEntity(1, 10, 3, new Bat());
		this.addEntity(1, 11, 4, new Bat());
		this.addEntity(2, 11, 5, new Bat());
		this.renderer.updateHUD({
			currentHealth: 10,
			maxHealth: 10
		});
	}

	addEntity(x, z, id, character) {
		var pc = character;
		pc.id = id;
		pc.x = x;
		pc.z = z;
		this.entities.set(id, pc);
		this.renderer.addActor(pc);
	}

	entityAtPosition(x, z) {
		var ret = null;
		this.entities.forEach((entity) => {
			if (x == entity.x && z == entity.z) ret = entity;
		});
		return ret;
	}

	spaceIsMoveable(x, z) {
		return this.atLocation(x, z) == TILE_FLOOR;
	}

	handlePlayerAction(x, z, id) {
		var target = {
			x: this.entities.get(id).x + x,
			z: this.entities.get(id).z + z
		};
		if (!this.renderer.isAnimating()) {
			var entity = this.entityAtPosition(target.x, target.z);
			if (entity) {
				this.doCombat(entity);
			} else if (this.spaceIsMoveable(target.x, target.z)) {
				this.moveEntity(x, z, id);
			}
			this.entities.forEach((entity) => {
				var action = entity.doTurn();
				if (action) {
					this.moveEntity(action[0], action[1], entity.id);
				}
			});
		}
	}

	moveEntity(x, z, id) {
		var target = {
			x: this.entities.get(id).x + x,
			z: this.entities.get(id).z + z
		};
		if (this.spaceIsMoveable(target.x, target.z) && !this.entityAtPosition(target.x, target.z)) {
			this.entities.get(id).x += x;
			this.entities.get(id).z += z;
			this.renderer.moveCharacter(x, z, id);
		}
	}

	doCombat(entity) {
		this.playerCharacter.currentHealth -= 1;
		entity.currentHealth -= 5;
		if (entity.currentHealth <= 0) {
			this.kill(entity);
		}
		this.renderer.updateHUD({
			currentHealth: this.playerCharacter.currentHealth,
			maxHealth: this.playerCharacter.maxHealth
		});
	}

	kill(entity) {
		this.entities.delete(entity.id);
		this.renderer.removeActor(entity.id);
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
