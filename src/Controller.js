const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

class Controller {
	constructor() {
		document.addEventListener("keydown", (ev) => { this.respond(ev); });
		this.callbacks = {};
	}

	registerCallback(keycode, func) {
		if (!this.callbacks[keycode]) this.callbacks[keycode] = [];
		this.callbacks[keycode].push(func);
	}

	respond(ev) {
		this.callbacks[ev.keyCode].map((func) => { func(); });
	}
}

module.exports = new Controller();
