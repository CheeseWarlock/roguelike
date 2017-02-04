var scene, camera, renderer;
var geometry, material, mesh;

window.onload = function() {
	
}

function init() {
	scene = new THREE.Scene();

	var directionalLight = new THREE.DirectionalLight( 0xff0000, 0.5 );
	directionalLight.position.x = 0;
	directionalLight.position.y = -1000;
	directionalLight.position.z = 0;
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0x00ff00, 0.5 );
	directionalLight.position.x = 1000;
	directionalLight.position.y = 0;
	directionalLight.position.z = 0;
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0x0000ff, 0.5 );
	directionalLight.position.x = 0;
	directionalLight.position.y = 0;
	directionalLight.position.z = 1000;
	scene.add( directionalLight );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
	camera.position.y = -400;
	camera.rotation.x = 0.5;

	var outerShape = new THREE.Shape();
	outerShape.lineTo(800, 0);
	outerShape.lineTo(800, 600);
	outerShape.lineTo(0, 600);
	outerShape.lineTo(0, 0);

	var innerThing = new THREE.Path();
	innerThing.moveTo(100, 100);
	innerThing.lineTo(700, 100);
	innerThing.lineTo(700, 500);
	innerThing.lineTo(100, 500);
	innerThing.lineTo(100, 100);

	outerShape.holes = [innerThing];

	var wall = new THREE.ExtrudeGeometry(outerShape, { amount: 100 });
	var wallMaterial = new THREE.MeshLambertMaterial({ color: 0x907058 });
	var wallMesh = new THREE.Mesh(wall, wallMaterial);
	scene.add(wallMesh);
	wallMesh.position.x = -400;
	wallMesh.position.y = -300;

	var floor = new THREE.PlaneGeometry(800, 600);
	var floorMaterial = loadedMaterials['tile'];
	var floorMesh = new THREE.Mesh(floor, floorMaterial);
	scene.add(floorMesh);

	geometry = new THREE.BoxGeometry( 100, 100, 100 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );
	animate();
}

function animate() {
	requestAnimationFrame( animate );
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );

}
