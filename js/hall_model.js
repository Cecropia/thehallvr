/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var CS = CS || {};
CS.hall = CS.hall || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = 1;

    object.model = null;

    var traversed = false;

    object.init = function (onComplete) {
        //var loader = new THREE.OBJLoader();
        var textureLoader = new THREE.TextureLoader();


        //var mtlLoader = new THREE.MTLLoader();

        //mtlLoader.setPath( 'models/' );
        //mtlLoader.setTexturePath( 'textures/' );
        mtlLoader.load( 'hall.mtl', function( materials ) {

            materials.preload();
            loader.setMaterials( materials );

            loader.load('hall.obj', function (o) {
                object.model = o;


                o.scale.set(scale,scale,scale);

                o.traverse(function(c) {
                    if ( c instanceof THREE.Mesh ) {

                        if('' !== c.material.name  ){
                            c.material.map =
                                textureLoader.load(
                                    'textures/' + c.material.name  + '.png',
                                    function(xhr){
                                        /*onLoad*/
                                    },
                                    function(xhr){
                                        /*onProgress*/
                                    },
                                    function(xhr){
                                        /*onError*/
                                        c.material.map = textureLoader.load('textures/' + c.material.name  + '.jpg');
                                    }
                                  );

                        }

                        console.log(c.material.name);

                        if('floor' === c.material.name){
                            //c.material.map = null;
                            //c.material.bumpMap = c.material.map;
                            //c.material.displacementMap = floorBumpMap,
                            c.material.shininess = 30;
                        }

                        if('lamp' === c.material.name){
                            c.material.side = THREE.DoubleSide;
                        }


                    }

                });
                traversed = true;


                scene.add(o);
                if(onComplete){
                    onComplete(o);
                }
            });
        });


    };

    object.update = function () {

    };

    return object;

})();
