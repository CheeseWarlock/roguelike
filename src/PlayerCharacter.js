var Controller = require("./Controller");
var TextureManager = require("./TextureManager");

class PlayerCharacter {
	constructor(motionCallback) {
		this.motionCallback = motionCallback;
		Controller.registerCallback(37, () => { this.motionCallback(-1, 0); });
		Controller.registerCallback(38, () => { this.motionCallback(0, -1); });
		Controller.registerCallback(39, () => { this.motionCallback(1, 0); });
		Controller.registerCallback(40, () => { this.motionCallback(0, 1); });
	}

	getMesh() {
		var actor = new THREE.PlaneGeometry(50, 100);
		var actorMaterial = TextureManager.loadedMaterials["char"];
		return new THREE.Mesh(actor, actorMaterial);
	}
}

module.exports = PlayerCharacter;
