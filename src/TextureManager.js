textures = [
	{
		file: "tile.png",
		name: "tile",
		repeats: [8, 6],
		transparent: false,
		side: THREE.DoubleSide
	}
];

loader = new THREE.TextureLoader();
loadedTextures = {};
loadedMaterials = {};
unloaded = textures.length;

textures.forEach(function(texture) {
	var _texture = texture;
	loader.load(texture.file, function(loadedTexture) {
		loadedTextures[_texture.name] = loadedTexture;
		loadedMaterials[_texture.name] = new THREE.MeshPhongMaterial(
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
		if (!--unloaded) loadingDone();
	});
});

function loadingDone() {
	console.log("whyyyyyy");
	init();
}
