/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var CS = CS || {};
CS.hallctm = CS.hallctm || (function () {
    'use strict';
    var object = {};
    var scale = 1;

    object.model = null;

    object.init = function (onComplete) {
        var loader = new THREE.CTMLoader();


		loader.loadParts( "models/hall.js", function( geometries, materials ) {
			var textureLoader = new THREE.TextureLoader();
			console.log("---- geometries: ", geometries);
			console.log("---- materials:", materials);
			//hackMaterials( materials );
			var material;
			var geometry;
			for ( var i = 0; i < geometries.length; i ++ ) {

				geometry = geometries[ i ];
				material = new THREE.MeshPhongMaterial();
			console.log("---- material.name:", material.name);
				material.map = textureLoader.load('textures/' + materials[ i ].name  + '.png');
				console.log(material);



				geometry.computeFaceNormals();
				geometry.computeVertexNormals();    // requires correct face normals


				var o = new THREE.Mesh( geometries[ i ], material);
				//o.position.copy( position );
				//o.scale.copy( scale );

				object.model = o;
                scene.add(o);
                if(onComplete){
                    onComplete(o);
                }

			}


		}, { useWorker: false, useBuffers: false } );

/*		loader.load( "models/hall.ctm",  function( geometry ) {
			console.log("---- geometry: ", geometry);

				var material = new THREE.MeshPhongMaterial( {
					color: 0xFF0000,
					specular: 0x303030,
					shininess: 50,
					//normalScale: new THREE.Vector2( 0.8, 0.8 )
					wireframe: true,
				} );


			var mesh = new THREE.Mesh( geometry, material );

			scene.add( mesh );

		}, { useWorker: false } );*/




    };

    object.update = function () {

    };

    return object;

})();
