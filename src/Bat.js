var Character = require("./Character");

class Bat extends Character {
	constructor(motionCallback) {
		super();
	}

	doTurn() {
		var rand = Math.random();
		if (rand > 0.75) {
			return [0, 1];
		} else if (rand > 0.5) {
			return [0, -1];
		} else if (rand > 0.25) {
			return [-1, 0];
		} else {
			return [1, 0];
		}
	}
}

module.exports = Bat;
