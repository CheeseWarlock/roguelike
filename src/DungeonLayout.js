class DungeonLayout {
	constructor() {
		this.size = [20, 20];
		this.rooms = [[0, 0, 3, 8], [6, 3, 14, 14], [0, 10, 4, 13]];
		this.halls = [[3, 4, 6, 4], [4, 12, 6, 12], [1, 8, 1, 10]];
		this.doors = [[3, 4], [6, 4], [1, 8], [1, 10], [4, 12], [6, 12]];
	}
}

module.exports = new DungeonLayout();
