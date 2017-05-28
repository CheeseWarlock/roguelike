var TextureManager = require("./TextureManager");

class Renderer {
	constructor(options) {
		TextureManager.startLoad(() => { this.setupGame(); });
		this.loadCallback = options.loadCallback;
		this.actors = new Map();
		this.animations = [];
		this.anim = 0;
	}

	setupHUD() {
		var playerHealth = document.createElement("h1");
		var playerMana = document.createElement("h1");
		playerHealth.id = "player-health";
		playerMana.id = "player-mana";
		var hud = document.getElementById("hud-container");
		hud.appendChild(playerHealth);
		hud.appendChild(playerMana);
	}

	updateHUD(stats) {
		document.getElementById("player-health").textContent = "HP: " + stats.currentHealth + "/" + stats.maxHealth;
		document.getElementById("player-mana").textContent = "MP: Coming soon!";		
	}

	nextFrame() {
		requestAnimationFrame(() => { this.nextFrame(); });
		if (this.animations.length && !this.animationFrames) this.animationFrames = 10;
		if (this.animationFrames > 0) {
			this.animations.map((animation) => {
				this.actors[animation.id].position.x += animation.x * 10;
				this.actors[animation.id].position.z += animation.z * 10;
				if (animation.id == 0) {
					this.camera.position.x += animation.x * 10;
					this.camera.position.z += animation.z * 10;
					this.characterLight.position.x += animation.x * 10;
					this.characterLight.position.z += animation.z * 10;
				}
			});
			this.animationFrames -= 1;
			if (this.animationFrames == 0) this.animations = [];
		}
		this.render();
	}

	setupGame() {
		this.setupHUD();

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));

		this.characterLight = new THREE.PointLight(0xffddaa, 1, 1000, 1);
		this.characterLight.position.set(-150, 20, -50);
		this.characterLight.castShadow = true;
		this.characterLight.shadow.mapSize.width = 2048;
		this.characterLight.shadow.mapSize.height = 2048;
		this.characterLight.shadow.camera.near = 0.5;
		this.characterLight.shadow.camera.far = 5000;
		this.scene.add(this.characterLight);

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.set(-150, 800, 250);
		this.camera.lookAt(new THREE.Vector3(-150, 0, -150));

		this.loadCallback();

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.shadowMapBias = 0;
    this.renderer.shadowMapDarkness = 0.5;
    this.renderer.shadowMapWidth = 2048;
    this.renderer.shadowMapHeight = 2048;

		document.getElementById("game-container").appendChild(this.renderer.domElement);
		this.nextFrame();
	}

	addFloorSection(x, z) {
		var floor = new THREE.PlaneGeometry(100, 100);
		var floorMaterial = TextureManager.loadedMaterials["tile"];
		var floorMesh = new THREE.Mesh(floor, floorMaterial);
		floorMesh.rotation.x = Math.PI / 2;
		floorMesh.position.set(x * 100 - 350, 0, z * 100 - 250);
		floorMesh.receiveShadow = true;
		this.scene.add(floorMesh);
	}

	addWallBlock(x, z) {
		var wall = new THREE.BoxGeometry(100, 100, 100);
		var wallSideMaterial = TextureManager.loadedMaterials["wall"];
		var wallTopMaterial = TextureManager.loadedMaterials["walltop"];
		var wallMesh = new THREE.Mesh(wall, new THREE.MeshFaceMaterial([wallSideMaterial,wallSideMaterial,wallTopMaterial,wallSideMaterial,wallSideMaterial,wallSideMaterial]));
		wallMesh.castShadow = true;
		wallMesh.receiveShadow = true;
		this.scene.add(wallMesh);
		wallMesh.position.set(x * 100 - 350, 50, z * 100 - 250);
	}

	addInvisibleWallBlock(x, z) {
		var wall = new THREE.BoxGeometry(100, 100, 100);
		var wallMesh = new THREE.Mesh(wall, new THREE.MeshBasicMaterial( { transparent: true, opacity: 0, side: THREE.BackSide } ));
		wallMesh.castShadow = true;
		this.scene.add(wallMesh);
		wallMesh.position.set(x * 100 - 350, 50, z * 100 - 250);
	}

	addActor(entity) {
		var actorMesh = entity.getMesh();
		this.actors[entity.id] = actorMesh;
		this.scene.add(actorMesh);
		actorMesh.position.set(entity.x * 100 - 350, 50, entity.z * 100 - 250);
		this.actorPosition = [entity.x, entity.z];
	}

	removeActor(id) {
		this.scene.remove(this.actors[id]);
	}

	moveCharacter(x, z, id) {
		this.animations.push({
			x: x,
			z: z,
			id: id
		});
	}

	isAnimating() {
		return this.animationFrames > 0 || this.animations.length > 0;
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}
}

module.exports = Renderer;
