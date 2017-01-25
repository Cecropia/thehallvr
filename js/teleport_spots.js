/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.teleportSpots = ABSULIT.teleportSpots || (function () {
    'use strict';
    var object = {},
        positions = [];

    object.TELEPORT_POINTER_TYPE = 'teleport';
    object.ART_POINTER_TYPE = 'art';


    var geometry = new THREE.SphereBufferGeometry(.1, 32, 32),
        material = new THREE.MeshLambertMaterial( {color: 0xffff00} ),
        spotMesh = new THREE.Mesh( geometry, material );

    var selectedSpot = null,
        selectedSpotStart = 0,
        selectedSpotWait = 1, /* 1s */
        selectedSpotTotal = 0;

    function onPointerIN(e){
        //console.log(e.detail);
        var target = e.detail;
        console.log(target.pointerType);
        if( (object.TELEPORT_POINTER_TYPE === target.pointerType) && !selectedSpot ){
            //console.log('---- set selectedSpot and set selectedSpotStart');
            selectedSpot = target;
            selectedSpotStart = clock.getElapsedTime();
            selectedSpotTotal = selectedSpotStart + selectedSpotWait;
            //controls.resetPose();
            //cameraPosition.copy(target.position);
        }else if(object.ART_POINTER_TYPE === target.pointerType ){
            //console.log('--- ART');

            /*ABSULIT.info.load(
                    'textures/text.png',
                    target,
                    new THREE.Vector3(1,0,0)
            );*/
        }
    };

    function onPointerOUT(e){
        if(selectedSpot){
            selectedSpot.material.color.setRGB(1, 1, 0);
            selectedSpot = null;
            selectedSpotTotal = 0;
        }
        //ABSULIT.info.hide();
    };


    function addPoints(positions){
        var spot;

        positions.forEach(function(position){
            spot = spotMesh.clone();
            spot.material = material.clone();
            spot.position.copy(position);
            spot.pointerType = object.TELEPORT_POINTER_TYPE;

            ABSULIT.pointer.objects.push(spot);
            spot.addEventListener(ABSULIT.pointer.IN, onPointerIN);
            spot.addEventListener(ABSULIT.pointer.OUT, onPointerOUT);

            scene.add( spot );
        });
    };

    object.init = function (positions) {
		//material.envMap = textureCubeAnim2;
        addPoints(positions);
    };

    object.update = function () {
        if(selectedSpot){

            var percentTime =  (clock.getElapsedTime() - selectedSpotStart) / (selectedSpotTotal - selectedSpotStart);

            selectedSpot.material.color.setRGB(1 - percentTime, 1, 0);

            if(selectedSpotTotal < clock.getElapsedTime()){
                if(WEBVR.isAvailable() == true){
                    //cameraPosition.copy(selectedSpot.position);
					cameraContainer.position.copy(selectedSpot.position);
                }else{
                    //camera.position.copy(selectedSpot.position);
                    //camera.position.y = userHeight;

					cameraContainer.position.copy(selectedSpot.position);
                    cameraContainer.position.y = userHeight;
                }
                selectedSpot.material.color.setRGB(1, 1, 0);
                selectedSpot = null;
            }
        }
    };

    /*
        For the ART_POINTER_TYPE which are not internal spots
    */
    object.setEvents = function(mesh){
        //ABSULIT.pointer.objects.push(mesh);
        mesh.addEventListener(ABSULIT.pointer.IN, onPointerIN);
        mesh.addEventListener(ABSULIT.pointer.OUT, onPointerOUT);
    }

    return object;

})();
