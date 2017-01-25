/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var CS = CS || {};
CS.spheres = CS.spheres || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = 1;

    object.model = null;


    object.init = function (onComplete, envMap) {
    var geometry = new THREE.SphereBufferGeometry(.2, 32, 32),
        material = new THREE.MeshPhongMaterial( {color: 0xaaaaaa, envMap: envMap} ),
        baseSpot = new THREE.Mesh( geometry, material ),
        spot;

        pivot.add(baseSpot);

        spot = baseSpot.clone();
        spot.scale.multiplyScalar(.3);
        spot.position.x = .5;
        pivot.add(spot);

        spot = baseSpot.clone();
        spot.scale.multiplyScalar(.3);
        spot.position.x = -.3;
        pivot.add(spot);

        pivot.position.set(0, 1.7, -13.64);


        var o = pivot;
        object.model = o;

        scene.add(o);
        if(onComplete){
            onComplete(o);
        }

    };

    object.update = function () {
        pivot.rotation.z += .01;
        pivot.rotation.x += .01;
    };

    return object;

})();
