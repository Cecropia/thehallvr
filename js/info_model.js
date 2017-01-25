/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.info = ABSULIT.info || (function () {
    'use strict';
    var object = {},
        plane,
        textureLoader = new THREE.TextureLoader(),
		cache = {},
		currentMeshName = '';



    object.model = null;

    object.init = function (onComplete) {
        var geometry = new THREE.PlaneBufferGeometry( 1, 1, 1 ),
            material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );

            plane = new THREE.Mesh( geometry, material );


        object.model = plane;
		plane.visible = false;
        scene.add( plane );
        if(onComplete){
            onComplete(o);
        }
    };

    object.load = function(imagePath, mesh, offset){
        console.log("---- info load: ", imagePath);


		console.log(mesh.name);

		if(currentMeshName !== mesh.name){
			console.log("---- load new");
			var cachedObject = cache[mesh.name],
				position;

			if(cachedObject){
				position = cachedObject.position;
			}else{
				position = getMeshPosition(mesh);
				cache[mesh.name] = {position: position};
			}

			plane.position.copy(position);
			plane.lookAt(camera.position);
			plane.translateOnAxis( new THREE.Vector3(1,0,0), 1 );
			plane.translateOnAxis( new THREE.Vector3(0,0,1), 1 );
			//plane.rotateX(Math.PI / 2);
			currentMeshName = mesh.name;

			var map;
			if(!imagePath){
				console.error('imagePath is empty');
			}else{
				map = textureLoader.load(imagePath,
					function(xhr){
						/*onLoad*/
						plane.visible = true;
					},
					function(xhr){
						/*onProgress*/
					},
					function(xhr){
						/*onError*/
                	}

				);
				object.model.material = new THREE.MeshBasicMaterial(
					{ map: map, side: THREE.DoubleSide }
				);
			}

		}else{
			console.log("---- keep everything the same");
		}

    };

	/*
		set the plane position based on a mesh, even if the mesh has an offset
		with the origin, but the origin is still <0,0,0>
		http://stackoverflow.com/a/14225370/507186
	*/
	function getMeshPosition(mesh){
		mesh.geometry.computeBoundingBox();
		var boundingBox = mesh.geometry.boundingBox,
			position = new THREE.Vector3();

		position.subVectors( boundingBox.max, boundingBox.min );
		position.multiplyScalar( 0.5 );
		position.add( boundingBox.min );

		position.applyMatrix4( mesh.matrixWorld );
		return position;
	};

	object.hide = function(){
		plane.visible = false;
	};

    object.update = function () {
        //object.model.rotation.y += .01;
    };

    return object;

})();
