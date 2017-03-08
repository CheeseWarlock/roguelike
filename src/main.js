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

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.x = 0;
	directionalLight.position.y = 0;
	directionalLight.position.z = 1000;
	scene.add( directionalLight );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
	camera.position.y = -400;
	camera.rotation.x = 0.5;

	for (var i=0;i<Dungeon.rooms()[0][2];i++) {
		for (var j=0;j<Dungeon.rooms()[0][3];j++) {
			if (Dungeon.atLocation(i,j) === TILE_WALL) {
				addWallBlock(i, j);
			}
		}
	}

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

function addWallBlock(x, z) {
	var wall = new THREE.BoxGeometry(100, 100, 100);
	var wallMaterial = new THREE.MeshLambertMaterial({ color: 0x907058 });
	var wallMesh = new THREE.Mesh(wall, wallMaterial);
	scene.add(wallMesh);
	wallMesh.position.x = x * 100 - 350;
	wallMesh.position.y = z * 100 - 250;
	wallMesh.position.z = 50;
}

function animate() {
	requestAnimationFrame( animate );
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );

}
