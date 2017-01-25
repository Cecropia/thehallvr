/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var CS = CS || {};
CS.anim1 = CS.anim1 || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = 1;
    var spotScale = .0250;

	var spotDistance = .3;

    object.model = null;


    object.init = function (onComplete, envMap, clock) {
		var geometry = new THREE.SphereBufferGeometry(spotScale, 4, 2),
			//material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF, envMap: envMap} ),
			material = new THREE.MeshLambertMaterial( {color: 0xFFFFFF} ),
			baseSpot = new THREE.Mesh( geometry, material ),
			spot;

		var columns = 40,
			rows = 10,
			c, r, i = 0;

		var columns_half = columns * .5;
		var rows_half = rows * .5;

		for(c = 0; c < columns; c++){
			for(r = 0; r < rows; r++){
				spot = baseSpot.clone();
				spot.index = i++;
				spot.position.x = (c - columns_half) * spotDistance;
				spot.position.z = (r - rows_half) * spotDistance;


				spot.column = c;
				spot.row = r;
				pivot.add(spot);
			}
		}
		pivot.position.y = 4;
		scene.add(pivot);
    };

    object.update = function () {
		var spot, i;
		for( i in pivot.children){
			spot = pivot.children[i];
			//spot.position.x = spot.column;
			//spot.position.z = spot.row;

			spot.position.y = Math.sin( clock.getElapsedTime() * (spot.row  * spot.column) / spot.index ) * spotDistance;
			//console.log(spot);

		}
		//debugger;
    };

    return object;

})();
