var scene, camera, renderer;
var geometry, material, mesh;

window.onload = function() {
	
}

function init() {
	Renderer.init();
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}
