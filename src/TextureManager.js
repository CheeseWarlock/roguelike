class TextureManager {
	constructor() {
		this.textures = [
			{
				file: "tile.png",
				name: "tile",
				repeats: [1, 1],
				transparent: false,
				side: THREE.DoubleSide
			},
			{
				file: "char.png",
				name: "char",
				repeats: [1, 1],
				transparent: true,
				side: THREE.DoubleSide
			}
		];

		this.loader = new THREE.TextureLoader();
		this.loadedTextures = {};
		this.loadedMaterials = {};
		this.unloaded = this.textures.length;
	}

	startLoad(callback) {
		this.callback = callback;

		this.textures.forEach((texture) => {
			var _texture = texture;
			this.loader.load(texture.file, (loadedTexture) => {
				this.loadedTextures[_texture.name] = loadedTexture;
				this.loadedMaterials[_texture.name] = new THREE.MeshPhongMaterial(
					{
						map: loadedTexture,
						side: _texture.side,
						transparent: !!_texture.transparent
					}
				);
				loadedTexture.wrapS = THREE.RepeatWrapping;
				loadedTexture.wrapT = THREE.RepeatWrapping;
				loadedTexture.repeat.set(_texture.repeats[0], _texture.repeats[1]);
				loadedTexture.magFilter = THREE.NearestFilter;
				if (!--this.unloaded) this.callback();
			});
		});
	}
}

module.exports = new TextureManager();
