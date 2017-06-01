var TextureManager = require("./TextureManager");
var HealthBar = require("./HealthBar");

class Renderer {
	constructor(options) {
		TextureManager.startLoad(() => { this.setupGame(); });
		this.loadCallback = options.loadCallback;
		this.actors = new Map();
		this.animations = [];
		this.anim = 0;
	}

	setupHUD() {
		const playerHealth = document.createElement("h1");
		const playerMana = document.createElement("h1");
		playerHealth.id = "player-health";
		playerMana.id = "player-mana";
		const hud = document.getElementById("hud-container");
		hud.appendChild(playerHealth);
		hud.appendChild(playerMana);
		this.log("Welcome to the game!");
	}

	updateHUD(stats) {
		document.getElementById("player-health").textContent = "HP: " + stats.currentHealth + "/" + stats.maxHealth;
		document.getElementById("player-mana").textContent = "MP: 10/10";
	}

	log(text) {
		const combatLog = document.getElementById("combat-log");
		const welcomeMessage = document.createElement("p");
		welcomeMessage.textContent = text;
		combatLog.appendChild(welcomeMessage);
		combatLog.scrollTop = combatLog.scrollHeight;
	}

	nextFrame() {
		requestAnimationFrame(() => { this.nextFrame(); });
		if (this.animations.length && !this.animationFrames) this.animationFrames = 10;
		if (this.animationFrames > 0) {
			this.animations.map((animation) => {
				this.actors[animation.id].position.x += animation.x * 10;
				this.actors[animation.id].position.y += animation.h / 10;
				this.actors[animation.id].position.z += animation.z * 10;
				if (animation.id == 0) {
					this.camera.position.x += animation.x * 10;
					this.camera.position.z += animation.z * 10;
					this.characterLight.position.x += animation.x * 10;
					this.characterLight.position.y += animation.h / 10;
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

	addFloorSection(x, z, h) {
		var floor = new THREE.PlaneGeometry(100, 100);
		var floorMaterial = TextureManager.loadedMaterials["tile"];
		var floorMesh = new THREE.Mesh(floor, floorMaterial);
		floorMesh.rotation.x = Math.PI / 2;
		floorMesh.position.set(x * 100 - 350, h, z * 100 - 250);
		floorMesh.receiveShadow = true;

		const xTilt = ((x == -1 || x == -2) && z == 1) ? 0.5 : 0;
		const zTilt = 0;

		if (xTilt || zTilt) {
			var matrix = new THREE.Matrix4();
			matrix.set(1, 0, 0, 0, 0, 1, 0, 0, xTilt, zTilt, 1, 0, 0, 0, 0, 1);
			floor.applyMatrix(matrix);
		}
		this.scene.add(floorMesh);
	}

	addWallBlock(x, z, h) {
		var wall = new THREE.BoxGeometry(100, 100, 100);
		var wallSideMaterial = TextureManager.loadedMaterials["wall"];
		var wallTopMaterial = TextureManager.loadedMaterials["walltop"];
		var wallMesh = new THREE.Mesh(wall, new THREE.MeshFaceMaterial([wallSideMaterial, wallSideMaterial, wallTopMaterial, wallSideMaterial, wallSideMaterial, wallSideMaterial]));
		wallMesh.castShadow = true;
		wallMesh.receiveShadow = true;
		this.scene.add(wallMesh);
		wallMesh.position.set(x * 100 - 350, 50 + h, z * 100 - 250);
	}

	addInvisibleWallBlock(x, z, h) {
		var wall = new THREE.BoxGeometry(100, 100, 100);
		var wallMesh = new THREE.Mesh(wall, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.BackSide }));
		wallMesh.castShadow = true;
		this.scene.add(wallMesh);
		wallMesh.position.set(x * 100 - 350, 50 + h, z * 100 - 250);
	}

	addActor(entity) {
		var actorMesh = entity.getMesh();
		const healthBar = this.makeHealthBar(100 * entity.currentHealth / entity.maxHealth, actorMesh);
		const joined = new THREE.Object3D();
		joined.add(actorMesh);
		if (!entity.isDoor) joined.add(healthBar);
		this.actors[entity.id] = joined;
		this.scene.add(joined);
		joined.position.set(entity.x * 100 - 350, 50 + entity.h, entity.z * 100 - 250);
	}

	makeHealthBar(percent, target) {
		const healthBar = new HealthBar(percent);
		healthBar.position.set(target.position.x, target.position.y + 80, target.position.z);
		return healthBar;
	}

	updateActor(entity) {
		const actor = this.actors[entity.id];
		const healthBar = this.makeHealthBar(100 * entity.currentHealth / entity.maxHealth, actor.children[0]);
		actor.remove(actor.children[1]);
		actor.add(healthBar);
	}

	removeActor(id) {
		this.scene.remove(this.actors[id]);
	}

	moveCharacter(x, z, h, id) {
		this.animations.push({
			x: x,
			z: z,
			h: h,
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
