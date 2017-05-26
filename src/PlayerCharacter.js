var Controller = require("./Controller");
var Character = require("./Character");
var TextureManager = require("./TextureManager");

class PlayerCharacter extends Character {
	constructor(motionCallback) {
		super();
		this.motionCallback = motionCallback;
		Controller.registerCallback(37, () => { this.motionCallback(-1, 0, this.id); });
		Controller.registerCallback(38, () => { this.motionCallback(0, -1, this.id); });
		Controller.registerCallback(39, () => { this.motionCallback(1, 0, this.id); });
		Controller.registerCallback(40, () => { this.motionCallback(0, 1, this.id); });
	}

	getMesh() {
		var actor = new THREE.PlaneGeometry(50, 100);
		var actorMaterial = TextureManager.loadedMaterials["char"];
		return new THREE.Mesh(actor, actorMaterial);
	}
}

module.exports = PlayerCharacter;
