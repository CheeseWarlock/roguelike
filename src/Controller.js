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
		if (this.callbacks[ev.keyCode]) this.callbacks[ev.keyCode].map((func) => { func(); });
	}
}

module.exports = new Controller();
