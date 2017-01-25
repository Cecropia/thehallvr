/**
 * SkySphere
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.skysphere = ABSULIT.skysphere || (function () {
    'use strict';
    var object = {},
        sphere;
    object.material = null;
    object.init = function (imgPath) {
		var textureLoader = new THREE.TextureLoader();


        var geometry = new THREE.SphereGeometry(1500, 32, 32);
        object.material = new THREE.MeshBasicMaterial({});
        //object.material.map = THREE.ImageUtils.loadTexture(imgPath);
        object.material.map = textureLoader.load(imgPath);
        object.material.side = THREE.BackSide;
        sphere = new THREE.Mesh(geometry, object.material);
        scene.add(sphere);
    };

    object.update = function (position) {
        sphere.position.copy(position);
    };

    return object;

})();
