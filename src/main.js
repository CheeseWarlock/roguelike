var scene, camera, renderer;
var geometry, material, mesh;

window.onload = function() {
	
}

function init() {
	Renderer.init();
}

function animate() {
	requestAnimationFrame( animate );
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );

}
