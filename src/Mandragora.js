var Character = require("./Character");
var Coins = require("./Coins");

class Mandragora extends Character {
	constructor() {
		super();
		this.attack = 2;
		this.name = "Mandragora";
	}

	getMesh() {
		return new THREE.Mesh(new THREE.BoxGeometry(60, 70, 60), new THREE.MeshPhongMaterial({color: 0x226600}));
	}

	doTurn(dungeon) {
		const xdiff = this.x - dungeon.playerCharacter.x;
		const zdiff = this.z - dungeon.playerCharacter.z;
		if (Math.abs(xdiff) + Math.abs(zdiff) == 1) {
			return ["attack"];
		}
	}

	drop() {
		return Coins;
	}
}

module.exports = Mandragora;
