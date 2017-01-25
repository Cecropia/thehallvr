/**
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var CS = CS || {};
CS.mocap3 = CS.mocap3 || (function () {
    'use strict';
    var object = {};
    var pivot = new THREE.Object3D();
    var scale = 1;
    var spotScale = .1;

    var spotDistance = .3;

    object.model = null;


    var head, right, left, hand, torso;
    var mocaps;

    var frame = 0;

    object.init = function (onComplete, envMap, clock) {
        var geometry = new THREE.BoxBufferGeometry(spotScale, spotScale, spotScale),
            material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF, envMap: envMap} ),
            baseSpot = new THREE.Mesh( geometry, material ),
            spot;

        mocaps = {
            head: jsonData[3].head.value,
            left: jsonData[3].left.value,
            right: jsonData[3].right.value
        }

        head = baseSpot.clone();

        hand = baseSpot.clone();
        hand.scale.set( .1, .5, 1 );

        right = hand.clone();
        left = hand.clone();

        torso = baseSpot.clone();
        torso.scale.set(1,9,1);
        torso.scale.multiplyScalar(.5);

        pivot.add(head);
        pivot.add(right);
        pivot.add(left);
        pivot.add(torso);


        pivot.position.set(-3, 1, 12.2);
        pivot.rotation.y = -Math.PI/2

        object.model = pivot;


        scene.add(pivot);
    };

    object.update = function () {

        if(mocaps && frame < 600){
            head.position.set(
                mocaps.head[frame].position.x,
                mocaps.head[frame].position.y,
                mocaps.head[frame].position.z
            );

            head.rotation.set(
                mocaps.head[frame].rotation.x,
                mocaps.head[frame].rotation.y,
                mocaps.head[frame].rotation.z
            );

            left.position.set(
                mocaps.left[frame].position.x,
                mocaps.left[frame].position.y,
                mocaps.left[frame].position.z
            );

            left.rotation.set(
                mocaps.left[frame].rotation.x,
                mocaps.left[frame].rotation.y,
                mocaps.left[frame].rotation.z
            );

            right.position.set(
                mocaps.right[frame].position.x,
                mocaps.right[frame].position.y,
                mocaps.right[frame].position.z
            );

            right.rotation.set(
                mocaps.right[frame].rotation.x,
                mocaps.right[frame].rotation.y,
                mocaps.right[frame].rotation.z
            );

            torso.position.set(
                mocaps.head[frame].position.x,
                mocaps.head[frame].position.y - .4,
                mocaps.head[frame].position.z + .05
            );

        }else{
            frame = -1;
        }

        ++frame;
    };

    return object;

})();
