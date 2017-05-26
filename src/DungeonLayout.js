class DungeonLayout {
	constructor() {
		this.size = [20, 12];
		this.rooms = [[0, 0, 3, 8, 0], [6, 3, 19, 9, 40]];
		this.halls = [[3, 4, 6, 4, 0, 40]];
	}
}

module.exports = new DungeonLayout();
