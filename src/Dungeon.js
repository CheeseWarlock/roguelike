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
		const spawn = DungeonLayout.playerSpawn;
		this.playerCharacter = new spawn.entity((x, z, id) => this.handlePlayerAction(x, z, id));
		this.addEntity(spawn.x, spawn.z, spawn.h, 0, this.playerCharacter);

		this.reveal(spawn.x, spawn.z);
		this.renderer.addPlayerSupport(spawn.x, spawn.z, spawn.h);

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
					const h = DungeonLayout.height(i, j);
					var a = DungeonLayout.atLocation(i, j);
					if (a === TILE_WALL) {
						this.renderer.addWallBlock(i, j, h);
					} else if (a === TILE_FLOOR || a === TILE_DOOR) {
						const t = DungeonLayout.getTilt(i, j);
						this.renderer.addFloorSection(i, j, t[0], t[1], h);
					} else if (a === TILE_INVISIBLE) {
						this.renderer.addInvisibleWallBlock(i, j, h);
					}
					const entity = DungeonLayout.entityAtLocation(i, j);
					if (entity) {
						this.addEntity(i, j, h, this.idx++, new entity());
					}
				}
			}
		}
	}

	addEntity(x, z, h, id, character) {
		var pc = character;
		pc.id = id;
		pc.x = x;
		pc.z = z;
		pc.h = h;
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

	handlePlayerAction(dir, id) {
		let rot = dir + this.renderer.rotationState;
		let x = (rot % 4 == 0 ? -1 : rot % 4 == 2 ? 1 : 0);
		let z = (rot % 4 == 1 ? -1 : rot % 4 == 3 ? 1 : 0);
		var target = {
			x: this.entities.get(id).x + x,
			z: this.entities.get(id).z + z
		};
		if (!this.renderer.isAnimating()) {
			var entity = this.entityAtPosition(target.x, target.z);
			if (entity) {
				if (entity.isDoor) {
					this.reveal(target.x * 2 - this.playerCharacter.x, target.z * 2 - this.playerCharacter.z);
					this.kill(entity);
				} else if (entity.isCollectible) {
					this.kill(entity);
					if (this.spaceIsMoveable(target.x, target.z)) {
						this.moveEntity(x, z, id);
					}
				} else {
					this.doCombat(this.playerCharacter, entity);
				}
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

	moveEntity(dx, dz, id) {
		var target = {
			x: this.entities.get(id).x + dx,
			z: this.entities.get(id).z + dz
		};
		const dh = DungeonLayout.height(target.x, target.z) - DungeonLayout.height(this.entities.get(id).x, this.entities.get(id).z);
		if (this.spaceIsMoveable(target.x, target.z)) {
			this.entities.get(id).x += dx;
			this.entities.get(id).z += dz;
			this.renderer.moveCharacter(dx, dz, dh, id);
		}
	}

	doCombat(attacker, defender) {
		defender.currentHealth -= attacker.attack;
		this.renderer.log(`${ attacker.name } attacked ${ defender.name } for ${ attacker.attack } damage!`);
		this.renderer.updateActor(defender);
		if (defender.currentHealth <= 0) {
			const drop = defender.drop();
			if (drop) {
				this.addEntity(defender.x, defender.z, defender.h, this.idx++, new drop());
			}
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
