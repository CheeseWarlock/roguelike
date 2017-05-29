class HealthBar {
	constructor(percent) {
		this.fullHealth = new THREE.Mesh(
			new THREE.BoxGeometry(percent, 10, 10), new THREE.MeshBasicMaterial({color: 0xff0000})
		);
		this.emptyHealth = new THREE.Mesh(
			new THREE.BoxGeometry((100 - percent), 10, 10), new THREE.MeshBasicMaterial({color: 0x000000})
		);
		this.fullHealth.position.x = -50 + percent/2;
		this.emptyHealth.position.x = 50 - (100-percent)/2;
		const healthBar = new THREE.Object3D();
		healthBar.add(this.fullHealth);
		healthBar.add(this.emptyHealth);
		return healthBar;
	}
}

module.exports = HealthBar;
