var Dungeon = require("./Dungeon");
var TextureManager = require("./TextureManager");
var Controller = require("./Controller");

class Renderer {
	setup() {
		TextureManager.startLoad(() => { this.init(); });
	}

	callback() {
		this.init();
	}

	nextFrame() {
		requestAnimationFrame(() => { this.nextFrame() });
		this.render();
	}

	init() {
		this.scene = new THREE.Scene();

		var directionalLight = new THREE.DirectionalLight(0xff0000, 0.6);
		directionalLight.position.set(500, 1000, 0);
		this.scene.add(directionalLight);

		directionalLight = new THREE.DirectionalLight(0x00ff00, 0.6);
		directionalLight.position.set(0, 1000, 500);
		this.scene.add(directionalLight);

		directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
		directionalLight.position.set(0, 1000, 0);
		this.scene.add(directionalLight);

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.set(0, 800, 400);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		for (var i=0;i<10;i++) {
			for (var j=0;j<10;j++) {
				if (Dungeon.atLocation(i, j) === Dungeon.TILE_WALL) {
					this.addWallBlock(i, j);
				}
			}
		}

		var entities = Dungeon.entities();
		for (i in entities) {
			this.addActor(entities[i].x, entities[i].z, 0);
		}

		var floor = new THREE.PlaneGeometry(800, 600);
		var floorMaterial = TextureManager.loadedMaterials["tile"];
		var floorMesh = new THREE.Mesh(floor, floorMaterial);
		floorMesh.rotation.x = Math.PI / 2;
		this.scene.add(floorMesh);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
		this.nextFrame();
	}

	addWallBlock(x, z) {
		var wall = new THREE.BoxGeometry(100, 100, 100);
		var wallMaterial = new THREE.MeshLambertMaterial({ color: 0x907058 });
		var wallMesh = new THREE.Mesh(wall, wallMaterial);
		this.scene.add(wallMesh);
		wallMesh.position.set(x * 100 - 350, 50, z * 100 - 250);
	}

	addActor(x, z) {
		var actor = new THREE.PlaneGeometry(50, 100);
		var actorMaterial = TextureManager.loadedMaterials["char"];
		this.actorMesh = new THREE.Mesh(actor, actorMaterial);
		this.scene.add(this.actorMesh);
		this.actorMesh.position.set(x * 100 - 350, 50, z * 100 - 250);
		Controller.registerCallback(37, () => { this.actorMesh.position.x -= 50; });
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}
}

module.exports = new Renderer();
