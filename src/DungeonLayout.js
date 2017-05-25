class DungeonLayout {
	constructor() {
		this.size = [12, 12];
		this.rooms = [[0, 0, 3, 8], [6, 3, 10, 9]];
		this.halls = [[3, 4, 6, 4]];
	}
}

module.exports = new DungeonLayout();
