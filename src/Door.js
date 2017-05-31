var Character = require("./Character");

class Door extends Character {
	constructor() {
		super();
		this.attack = 0;
		this.currentHealth = 1;
		this.maxHealth = 1;
		this.name = "Door";
		this.isDoor = true;
	}

	getMesh() {
		return new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshPhongMaterial({color: 0x555555}));
	}

	doTurn(dungeon) {

	}
}

module.exports = Door;
