/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.objects = ABSULIT.objects || (function () {
    'use strict';
    var object = {},
        numTextures = 0,
        numLoadedTextures = 0;

    object.model = null;
    object.models = [];

    object.TYPES = {
        DRACO: 'drc',
        CTM: 'ctm',
        PLY: 'ply'
    }

    var modelsPath = './models/',
        texturesPath = 'textures/'

    object.init = function (objectToLoad, onComplete) {
        var nameParts = objectToLoad.file.split('.');
        objectToLoad.name = nameParts[0];
        objectToLoad.type = nameParts[1];

        if(objectToLoad.type === object.TYPES.DRACO){
            dracoLoader.load(objectToLoad.file, function(bufferGeometry){
                var meshNormalMaterial = new THREE.MeshNormalMaterial();
                var meshPhongMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
                var mesh;
                meshPhongMaterial.needsUpdate = true;
                var materials = [
                    meshPhongMaterial,
                    meshNormalMaterial,
                ];
                var multiMaterial = new THREE.MultiMaterial( materials );

                let geometry;
                // Point cloud does not have face indices.
                //console.log('----bufferGeometry.index', bufferGeometry.index);
                if (bufferGeometry.index == null) {
                  mesh = new THREE.Points(bufferGeometry, meshPhongMaterial);
                } else {
                  //bufferGeometry.computeFaceNormals();
                  bufferGeometry.computeVertexNormals();
                  mesh = new THREE.Mesh(bufferGeometry, meshPhongMaterial);

                }

                object.model = mesh;
                object.models.push(mesh);

                mesh.mocap = objectToLoad.mocap;
                mesh.name = objectToLoad.name;

                if(objectToLoad.side){
                    mesh.material.side = objectToLoad.side;
                }

                if(objectToLoad.scale){
                    mesh.scale.multiplyScalar(objectToLoad.scale);
                }

                if('' !== mesh.name ){
                    //console.log("---- material: ", c.material.name);
                    mesh.pointerType = objectToLoad.pointerType;
                    loadTextureAndComplete(texturesPath + objectToLoad.name  + '', mesh.material, 'map', onComplete);

                    if(objectToLoad.normal){
                        loadTextureAndComplete(texturesPath + mesh.name  + '_normal', mesh.material, 'normalMap', onComplete);
                        //loadTextureAndComplete('textures/' + mesh.name  + '_normal', mesh.material, 'specularMap', onComplete);
                    }

                    if(objectToLoad.shininess !== null){
                        mesh.material.shininess = objectToLoad.shininess;
                    }

                }



               scene.add(mesh);
            });
        }else if(objectToLoad.type === object.TYPES.CTM){

            ctmLoader.load( modelsPath + objectToLoad.file,   function( bufferGeometry ) {

                var meshPhongMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
                var mesh = new THREE.Mesh(bufferGeometry, meshPhongMaterial);

                object.model = mesh;
                object.models.push(mesh);

                mesh.mocap = objectToLoad.mocap;
                mesh.name = objectToLoad.name;

                if(objectToLoad.side){
                    mesh.material.side = objectToLoad.side;
                }

                if(objectToLoad.scale){
                    mesh.scale.multiplyScalar(objectToLoad.scale);
                }

                if('' !== mesh.name ){
                    mesh.pointerType = objectToLoad.pointerType;
                    loadTextureAndComplete(texturesPath + objectToLoad.name  + '', mesh.material, 'map', onComplete);

                    if(objectToLoad.normal){
                        loadTextureAndComplete(texturesPath + mesh.name  + '_normal', mesh.material, 'normalMap', onComplete);
                    }

                    if(objectToLoad.shininess !== null){
                        mesh.material.shininess = objectToLoad.shininess;
                    }

                }

            }, { useWorker: true, worker: new Worker( "js/CTMWorker.js" ) } );

        }else{
            mtlLoader.load( objectToLoad.name + '.mtl', function( materials ) {

                materials.preload();
                loader.setMaterials( materials );

                loader.load(objectToLoad.file, function (o) {
                    object.model = o;
                    object.models.push(o);

                    o.mocap = objectToLoad.mocap;
                    o.name = objectToLoad.name;

                    o.traverse(function(c) {
                        if ( c instanceof THREE.Mesh ) {
							c.material.color = new THREE.Color(1,1,1);
                            if(objectToLoad.side){
                                c.material.side = objectToLoad.side;
                            }

                            if(objectToLoad.scale){
                                c.scale.multiplyScalar(objectToLoad.scale);
                            }

                            if('' !== c.material.name  ){
                                c.pointerType = objectToLoad.pointerType;
                                loadTextureAndComplete(texturesPath + objectToLoad.name  + '', c.material, 'map', onComplete);

                                if(objectToLoad.normal){
                                    loadTextureAndComplete(texturesPath + c.material.name  + '_normal', c.material, 'normalMap', onComplete);
                                }

                                if(objectToLoad.shininess !== null){
                                    c.material.shininess = objectToLoad.shininess;
                                }

                            }

                        }

                    });


                }, function(){
				}, function(xhr){
					/* on error*/
					console.log(xhr);
				});
            });

        }
    };

    function loadTextureAndComplete(path, material, where, onComplete){
        ++numTextures;
        material[where] =
            textureLoader.load(
                path + '.jpg',
                function(xhr){
                    /*onLoad*/
                    ++numLoadedTextures;
                    scene.add(object.model);
                    if(onComplete && (numTextures === numLoadedTextures)){
                        onComplete(object.model);
                    }
                },
                function(xhr){
                    /*onProgress*/
                },
                function(xhr){
                    /*onError*/
                    console.warn('No jpg loaded, proceed with png');
                    material[where] =
                        textureLoader.load(path + '.png', function(){
                            ++numLoadedTextures;
                            scene.add(object.model);
                            if(onComplete && (numTextures === numLoadedTextures)){
                                onComplete(object.model);
                            }
                        },
                        function(xhr){/* progress */},
                        function(xhr){
                            console.warn('No texture loaded, proceed showing model');
                                ++numLoadedTextures;
                                scene.add(object.model);
                                onComplete(object.model);
                        });
                }
              );
    }

    var k, o, frame = 0, frameFixed = 0;
    object.update = function () {
        //console.clear();


        for(k = 0; k < object.models.length; k++){
            //frameFixed = frame;
            //frame = Math.floor(frame * 1.5);
            o = object.models[k];

            //console.log(frame);

            if(o.mocap && (frame < o.mocap.length)){
                //console.log(o);
                //console.log( frame < o.mocap.length );
                //console.log(frame < o.mocap.length);
                //console.log(o.mocap[frame].position);
                //console.log(o.mocap[frame].rotation);
                //console.log(frame);

                //o.position.copy(o.mocap[frame].position);

                o.position.set(
                    o.mocap[frame].position.x,
                    o.mocap[frame].position.y,
                    o.mocap[frame].position.z
                );

                /*handLeft.position.set(
                    o.mocap[frame].position.x,
                    o.mocap[frame].position.y,
                    o.mocap[frame].position.z
                );*/

                //o.rotation.copy(o.mocap[frame].rotation)

                o.rotation.set(
                    o.mocap[frame].rotation.x,
                    o.mocap[frame].rotation.y,
                    o.mocap[frame].rotation.z
                );

                /*handLeft.rotation.set(
                    o.mocap[frame].rotation.x,
                    o.mocap[frame].rotation.y,
                    o.mocap[frame].rotation.z
                );*/

            }
        }
        //frame = frameFixed;
        ++frame;


    };

    return object;

})();
