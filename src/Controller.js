const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

class Controller {
	constructor() {
		document.addEventListener("keydown", this.respond);
		this.callbacks = {};
	}

	registerCallback(keycode, func) {
		var list = this.callbacks[keycode];
		if (!list) list = [];
		list.push(func);
	}

	respond(keycode) {
		this.callbacks[keycode].map((func) => { func(); });
	}
}
