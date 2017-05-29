var Character = require("./Character");

class Mandragora extends Character {
	constructor(motionCallback) {
		super();
		this.attack = 2;
	}

	doTurn(dungeon) {
		const xdiff = this.x - dungeon.playerCharacter.x;
		const zdiff = this.z - dungeon.playerCharacter.z;
		if (Math.abs(xdiff) + Math.abs(zdiff) == 1) {
			return ["attack"];
		}
	}
}

module.exports = Mandragora;
