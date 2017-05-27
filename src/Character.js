class Character {
	constructor() {
		this.maxHP = 10;
		this.currentHP = this.maxHP;
		this.attack = 2;
	}

	getMesh() {
		return new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial({color: 0x000000}));
	}
}

module.exports = Character;
