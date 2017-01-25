/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.audioLoader = ABSULIT.audioLoader || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var pivot2 = new THREE.Object3D();


    object.init = function () {
        //Create an AudioListener and add it to the camera
        var listener = new THREE.AudioListener();
        camera.add( listener );

        //Create the PositionalAudio object (passing in the listener)
        var sound = new THREE.PositionalAudio( listener );

        //Load a sound and set it as the PositionalAudio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'audio/84529__cmusounddesign__02-museum.ogg', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.setRefDistance( 20 );
            sound.play();
        });

        pivot.add( sound );
        pivot.position.x = 1;
        pivot.position.y = 1;

        scene.add(pivot);
        /*********************************/
        //Create the PositionalAudio object (passing in the listener)
        var sound2 = new THREE.PositionalAudio( listener );

        //Load a sound and set it as the PositionalAudio object's buffer
        var audioLoader2 = new THREE.AudioLoader();
        audioLoader2.load( 'audio/219462__cediez__musee-victoria-londres-grand-escalier.ogg', function( buffer ) {
            sound2.setBuffer( buffer );
            sound2.setLoop(true);
            sound2.setVolume(0.5);
            sound2.setRefDistance( 200 );
            sound2.play();
        });

        pivot2.add( sound );
        pivot2.position.x = 1;
        pivot2.position.y = 1;
        pivot2.position.z = 100;

        scene.add(pivot2);


    };

    object.update = function () {

    };

    return object;

})();
