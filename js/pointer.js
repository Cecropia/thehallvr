/**
 *
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document, CustomEvent */

var ABSULIT = ABSULIT || {};
ABSULIT.pointer = ABSULIT.pointer || (function () {
    'use strict';
    var object = {},
        raycaster,
        intersected,
        lineMaterial = new THREE.LineBasicMaterial({color: 0x00FF00}),
        lineGeometry = new THREE.Geometry(),
        circleGeometry = new THREE.Geometry();

    var tempMatrix = new THREE.Matrix4();

    object.objects = [];
    object.IN = 'in';
    object.OUT = 'out';

    lineGeometry.vertices.push(new THREE.Vector3(0, 0.1, 0.0));
    lineGeometry.vertices.push(new THREE.Vector3(0, 0.0, -10.0));

    circleGeometry = new THREE.CircleGeometry( .01, 64 );
    circleGeometry.vertices.shift();

    object.line = new THREE.Line(lineGeometry, lineMaterial);
    object.line.position.set(0,0,-1);
    object.line.visible = true;

    object.circle = new THREE.Line(circleGeometry, lineMaterial);
    object.circle.position.set(0,0,-1);
    object.circle.visible = true;

    var lineContainer = new THREE.Object3D();

    object.init = function () {
        raycaster = new THREE.Raycaster();
        raycaster.near = .1;
        raycaster.far = 1000;

        if(xboxConnected){
            lineContainer.add(object.circle);
        }else if(touchConnected){
            lineContainer.add(object.line);
        }

        scene.add(lineContainer);

    };

    object.update = function (position, rotation) {
        if(touchConnected){
            raycaster.set(  position, rotation );
            lineContainer.remove(object.circle);
            lineContainer.add(object.line);

            lineContainer.position.copy(position);
            lineContainer.rotation.copy(rotation);

            tempMatrix.identity().extractRotation( handRight.matrixWorld );

            raycaster.ray.origin.setFromMatrixPosition( handRight.matrixWorld );
            raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );
        }else{
            raycaster.setFromCamera(  { x: 0, y: 0 }, camera );
            lineContainer.remove(object.line);
            lineContainer.add(object.circle);

            lineContainer.position.copy(camera.position);
            lineContainer.rotation.copy(camera.rotation);

        }


        //







        var collisions = raycaster.intersectObjects(object.objects);

        if (collisions.length > 0) {
            //console.log('---- collisions[0].distance: ', collisions[0].distance);
            //object.line.position.set(0, 0, -collisions[0].distance);

            if (intersected !== collisions[0].object) {

                if (intersected) {
                    //intersected.material.emissive.setHex( intersected.originalHex );//
                }
                intersected = collisions[0].object;
                //intersected.originalHex = intersected.material.emissive.getHex();//
                //intersected.material.emissive.setHex( 0xff0000 );//
                intersected.dispatchEvent( {'type': object.IN, 'detail': intersected  } );
            }

        } else {

            if (intersected) {
                //intersected.material.emissive.setHex( intersected.originalHex );//
                intersected.dispatchEvent( {'type': object.OUT, 'detail': intersected  } );
                intersected = null;
            }
        }

    };

    return object;

})();
