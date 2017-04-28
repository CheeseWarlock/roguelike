var scene, camera, renderer;
var geometry, material, mesh;

window.Dungeon = require("./Dungeon");
window.Renderer = require("./Renderer");
window.TextureManager = require("./TextureManager");

window.TILE_WALL = 0;
window.TILE_FLOOR = 1;

window.onload = function() {
	
}

window.initt = function() {
	Renderer.init();
}

window.animate = function() {
	requestAnimationFrame( animate );
	Renderer.render();

}
