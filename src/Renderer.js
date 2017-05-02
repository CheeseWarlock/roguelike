var Dungeon = require("./Dungeon");
var TextureManager = require("./TextureManager");
var Controller = require("./Controller");

class Renderer {
	constructor() {
		TextureManager.startLoad(() => { this.setupGame(); });
	}

	nextFrame() {
		requestAnimationFrame(() => { this.nextFrame(); });
		if (this.animationFrames > 0) {
			this.actorMesh.position.x += this.animationDirection[0] * 10;
			this.actorMesh.position.z += this.animationDirection[1] * 10;
			this.animationFrames -= 1;
		}
		this.render();
	}

	setupGame() {
		this.dungeon = new Dungeon.Dungeon();
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
				var a = this.dungeon.atLocation(i, j);
				if (a === Dungeon.TILE_WALL) {
					this.addWallBlock(i, j);
				} else if (a === Dungeon.TILE_FLOOR) {
					this.addFloorSection(i, j);
				}
			}
		}

		var entities = this.dungeon.entities();
		for (i in entities) {
			this.addActor(entities[i].x, entities[i].z, 0);
		}

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
		this.nextFrame();
	}

	addFloorSection(x, z) {
		var floor = new THREE.PlaneGeometry(100, 100);
		var floorMaterial = TextureManager.loadedMaterials["tile"];
		var floorMesh = new THREE.Mesh(floor, floorMaterial);
		floorMesh.rotation.x = Math.PI / 2;
		floorMesh.position.set(x * 100 - 350, 0, z * 100 - 250);
		this.scene.add(floorMesh);
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
		this.actorPosition = [x, z];
		Controller.registerCallback(37, () => { this.moveCharacter(-1, 0); });
		Controller.registerCallback(38, () => { this.moveCharacter(0, -1); });
		Controller.registerCallback(39, () => { this.moveCharacter(1, 0); });
		Controller.registerCallback(40, () => { this.moveCharacter(0, 1); });
	}

	moveCharacter(x, z) {
		if (this.dungeon.atLocation(this.actorPosition[0] + x, this.actorPosition[1] + z) != Dungeon.TILE_WALL && !this.animationFrames) {
			this.animationFrames = 10;
			this.animationDirection = [x, z];
			this.actorPosition = [this.actorPosition[0] + x, this.actorPosition[1] + z];
		}
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}
}

module.exports = new Renderer();
