class Character {
	constructor() {
		this.maxHealth = 10;
		this.currentHealth = this.maxHealth;
		this.attack = 5;
	}

	getMesh() {
		return new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial({color: 0x000000}));
	}

	doTurn(dungeon) {

	}
}

module.exports = Character;
