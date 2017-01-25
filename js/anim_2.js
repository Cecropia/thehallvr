/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var CS = CS || {};
CS.anim2 = CS.anim2 || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = 2;
    var boxScale = 0.0625;

    var spotDistance = .1;

    object.model = null;

    var localClock;

    var strandNumber = 14,
        spotNumber = 30,
        strandIndex,
        spotIndex,
        spot,
        firstSpot,
        lastSpot,
        strand,
        strands = new THREE.Object3D();

    object.init = function (onComplete, envMap, clock) {
        var geometry = new THREE.BoxBufferGeometry(boxScale, boxScale, boxScale),
            material = new THREE.MeshPhongMaterial( {color: 0xaaaaaa, envMap: envMap} ),
            baseSpot = new THREE.Mesh( geometry, material );


        localClock = clock;



        for(spotIndex = 0; spotIndex < spotNumber; spotIndex++){
            spot = baseSpot.clone();
            spot.position.x = 1 * spotDistance;
            spot.rotation.y = .1;
            spot.scale.multiplyScalar(.90);
            if(!firstSpot){
                firstSpot = spot;
            }
            if(lastSpot){
                lastSpot.add(spot);
            }

            lastSpot = spot;
        }



        for(strandIndex = 0; strandIndex < strandNumber; strandIndex++){
            strand = firstSpot.clone();
            strand.rotation.y = .5 * strandIndex;
            strand.rotation.x = .05 * strandIndex;
            strands.add(strand);
        }

        pivot.add(strands);

        //pivot.position.y = 1;
        //pivot.rotation.x = Math.PI / 2;


        pivot.position.set( -3, 2.2, -4.1);
        pivot.rotation.set( 0, 0, 1);

        pivot.scale.multiplyScalar(scale);

        object.model = pivot;
        scene.add(pivot);

    };

    object.update = function () {
        //pivot.rotation.x += .01 * localClock.getDelta();
        //console.log(localClock.getDelta());

        //pivot.rotation.y += .01;
        pivot.rotation.x += .001;

        for(strandIndex in strands.children){
            strand = strands.children[strandIndex];
            strand.rotation.y = Math.sin(localClock.elapsedTime * .25)  * strandIndex * .5;
            //strand.rotation.x = Math.sin(localClock.elapsedTime * .25)  * strandIndex * .5;
            for(spotIndex in strand.children){
                spot = strand.children[spotIndex];
                spot.rotation.x = Math.sin(localClock.elapsedTime * spotIndex * spotDistance) ;
                spot.rotation.z = Math.sin(localClock.elapsedTime * spotIndex * spotDistance) ;
                //spot.rotation.y += Math.sin(localClock.elapsedTime * spotIndex * spotDistance) ;
                spot.rotation.x = Math.sin(localClock.elapsedTime * .5) * spotDistance * Math.PI * 3;

                spot.position.x = Math.sin(localClock.elapsedTime * .1) * spotDistance;
            }
        }
    };

    return object;

})();
