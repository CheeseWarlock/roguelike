var Character = require("./Character");

class Bat extends Character {
	constructor(motionCallback) {
		super();
		this.attack = 1;
	}

	getMesh() {
		return new THREE.Mesh(new THREE.BoxGeometry(30, 60, 30), new THREE.MeshPhongMaterial({color: 0x552288}));
	}

	doTurn(dungeon) {
		if (this.currentHealth < 10) {
			const xdiff = this.x - dungeon.playerCharacter.x;
			const zdiff = this.z - dungeon.playerCharacter.z;
			if (Math.abs(xdiff) + Math.abs(zdiff) == 1) {
				return ["attack"];
			} else {
				if (this.x > dungeon.playerCharacter.x) {
					return ["move", -1, 0];
				} else if (this.x < dungeon.playerCharacter.x) {
					return ["move", 1, 0];
				} else if (this.z > dungeon.playerCharacter.z) {
					return ["move", 0, -1];
				} else {
					return ["move", 0, 1];
				}
			}
		} else {
			var rand = Math.random();
			if (rand > 0.75) {
				return ["move", 0, 1];
			} else if (rand > 0.5) {
				return ["move", 0, -1];
			} else if (rand > 0.25) {
				return ["move", -1, 0];
			} else {
				return ["move", 1, 0];
			}
		}
	}
}

module.exports = Bat;
