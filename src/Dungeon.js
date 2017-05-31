var DungeonLayout = require("./DungeonLayout");
var PlayerCharacter = require("./PlayerCharacter");
var Door = require("./Door");

const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_INVISIBLE = 2;
const TILE_DOOR = 3;

class Dungeon {
	constructor(options) {
		this.renderer = new options.renderer({
			loadCallback: () => this.populate()
		});
		this.entities = new Map();
		this.idx = 10;
		this.revealedSquares = [];
	}

	populate() {
		this.playerCharacter = new PlayerCharacter((x, z, id) => this.handlePlayerAction(x, z, id));
		this.addEntity(2, 2, 0, this.playerCharacter);

		this.reveal(2, 2);

		this.renderer.updateHUD({
			currentHealth: 10,
			maxHealth: 10
		});
	}

	reveal(x, z) {
		let xMin = x;
		let xMax = x;
		while (DungeonLayout.atLocation(xMin, z) === TILE_FLOOR && !DungeonLayout.isDoor(xMin, z)) xMin--;
		while (DungeonLayout.atLocation(xMax, z) === TILE_FLOOR && !DungeonLayout.isDoor(xMax, z)) xMax++;

		let zMin = z;
		let zMax = z;
		while (DungeonLayout.atLocation(x, zMin) === TILE_FLOOR && !DungeonLayout.isDoor(x, zMin)) zMin--;
		while (DungeonLayout.atLocation(x, zMax) === TILE_FLOOR && !DungeonLayout.isDoor(x, zMax)) zMax++;

		for (var i=xMin;i<=xMax;i++) {
			for (var j=zMin;j<=zMax;j++) {
				if (!this.revealedSquares[i]) this.revealedSquares[i] = [];
				if (!this.revealedSquares[i][j]) {
					this.revealedSquares[i][j] = true;
					var a = DungeonLayout.atLocation(i, j);
					if (a === TILE_WALL) {
						this.renderer.addWallBlock(i, j);
					} else if (a === TILE_FLOOR || a === TILE_DOOR) {
						this.renderer.addFloorSection(i, j);
					} else if (a === TILE_INVISIBLE) {
						this.renderer.addInvisibleWallBlock(i, j);
					}
					const entity = DungeonLayout.entityAtLocation(i, j);
					if (entity) {
						this.addEntity(i, j, this.idx++, entity);
					}
					if (DungeonLayout.isDoor(i, j)) {
						this.addEntity(i, j, this.idx++, new Door());
					}
				}
			}
		}
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
		return DungeonLayout.atLocation(x, z) == TILE_FLOOR && !this.entityAtPosition(x, z);
	}

	handlePlayerAction(x, z, id) {
		var target = {
			x: this.entities.get(id).x + x,
			z: this.entities.get(id).z + z
		};
		if (!this.renderer.isAnimating()) {
			var entity = this.entityAtPosition(target.x, target.z);
			if (entity) {
				if (entity.isDoor) {
					this.reveal(target.x * 2 - this.playerCharacter.x, target.z * 2 - this.playerCharacter.z);
				}
				this.doCombat(this.playerCharacter, entity);
				this.renderer.animationFrames = 10;
			} else if (this.spaceIsMoveable(target.x, target.z)) {
				this.moveEntity(x, z, id);
			}
			this.entities.forEach((entity) => {
				var action = entity.doTurn(this);
				if (action) {
					if (action[0] == "move") {
						this.moveEntity(action[1], action[2], entity.id);
					} else if (action[0] == "attack") {
						this.doCombat(entity, this.playerCharacter);
					}
				}
			});
		}
	}

	removeDoor(x, z) {
		DungeonLayout.doors = DungeonLayout.doors.filter((door) => {
			return !(door[0] == x && door[1] == z);
		});
		this.renderer.removeDoor(x, z);
		this.reveal(x * 2 - this.playerCharacter.x, z * 2 - this.playerCharacter.z);
	}

	moveEntity(x, z, id) {
		var target = {
			x: this.entities.get(id).x + x,
			z: this.entities.get(id).z + z
		};
		if (this.spaceIsMoveable(target.x, target.z)) {
			this.entities.get(id).x += x;
			this.entities.get(id).z += z;
			this.renderer.moveCharacter(x, z, id);
		}
	}

	doCombat(attacker, defender) {
		defender.currentHealth -= attacker.attack;
		this.renderer.log(`${ attacker.name } attacked ${ defender.name } for ${ attacker.attack } damage!`);
		this.renderer.updateActor(defender);
		if (defender.currentHealth <= 0) {
			this.kill(defender);
			this.renderer.log(`${ defender.name } was defeated!`);
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
}

module.exports = {
	TILE_WALL: TILE_WALL,
	TILE_FLOOR: TILE_FLOOR,
	TILE_INVISIBLE: TILE_INVISIBLE,
	TILE_DOOR: TILE_DOOR,
	Dungeon: Dungeon
};
