var TextureManager = require("./TextureManager");

class Renderer {
	constructor(options) {
		TextureManager.startLoad(() => { this.setupGame(); });
		this.loadCallback = options.loadCallback;
		this.actors = {};
		this.animations = [];
		this.anim = 0;
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
				}
			});
			this.animationFrames -= 1;
			if (this.animationFrames == 0) this.animations = [];
		}
		this.render();
	}

	setupGame() {
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
		this.camera.position.set(-150, 800, 250);
		this.camera.lookAt(new THREE.Vector3(-150, 0, -150));

		this.loadCallback();

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

	addActor(entity) {
		var actorMesh = entity.getMesh();
		this.actors[entity.id] = actorMesh;
		this.scene.add(actorMesh);
		actorMesh.position.set(entity.x * 100 - 350, 50, entity.z * 100 - 250);
		this.actorPosition = [entity.x, entity.z];
	}

	moveCharacter(x, z, id) {
		this.animations.push({
			x: x,
			z: z,
			id: id
		});
	}

	isAnimating() {
		return this.animationFrames > 0;
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}
}

module.exports = Renderer;
