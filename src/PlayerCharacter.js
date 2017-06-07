var Controller = require("./Controller");
var Character = require("./Character");

class PlayerCharacter extends Character {
	constructor(motionCallback) {
		super();
		this.motionCallback = motionCallback;
		Controller.registerCallback(37, () => { this.motionCallback(0, this.id); });
		Controller.registerCallback(38, () => { this.motionCallback(1, this.id); });
		Controller.registerCallback(39, () => { this.motionCallback(2, this.id); });
		Controller.registerCallback(40, () => { this.motionCallback(3, this.id); });
	}

	getMesh() {
		return new THREE.Mesh(new THREE.BoxGeometry(50, 100, 50), new THREE.MeshPhongMaterial({color: 0x444444}));
	}
}

module.exports = PlayerCharacter;
