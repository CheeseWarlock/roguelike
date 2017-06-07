var Character = require("./Character");

class Coins extends Character {
	constructor() {
		super();
		this.maxHealth = 1;
		this.currentHealth = this.maxHealth;
		this.attack = 0;
		this.name = "Coins";
	}

	getMesh() {
		const thing = new THREE.Object3D();
		const a = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 30), new THREE.MeshPhongMaterial({color: 0xFFBB77}));
		const b = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 30), new THREE.MeshPhongMaterial({color: 0xFFBB77}));
		const c = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 30), new THREE.MeshPhongMaterial({color: 0xFFBB77}));
		a.position.x = -20;
		a.position.z = -15;
		b.position.x = 20;
		b.position.z = -15;
		c.position.z = 30;
		thing.add(a);
		thing.add(b);
		thing.add(c);
		return thing;
	}
}

module.exports = Coins;
