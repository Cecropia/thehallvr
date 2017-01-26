/*
    @author Sebastian Sanabria ssanabria@cecropiasolutions.com @absulit
    www.cecropiasolutions.com

*/

var scene,
    camera,
    renderer,
    light,
    directionalLight,

    /*stereoEnabled = true,
    stereoFallbackEnabled = false,
    stereoFallback = false,*/

    stereoEffect,
    vrEffect,
    effectCache,
    noSleep /*= new NoSleep()*/,
    clock = new THREE.Clock,
    cameraPosition = new THREE.Vector3(),
    cameraRotation = new THREE.Vector3(),
    cameraContainer = new THREE.Object3D(),
    PI = Math.PI,
    PI_HALF = PI / 2,
    textureCube,
    textureCubeAnim2;

    var o,
    handLeft,
    handRight;

    var xboxConnected = false;
    var touchConnected = false;

    var standingMatrix = new THREE.Matrix4();

const info = document.getElementsByClassName('info')[0],
    percent = document.getElementsByClassName('percent')[0];

var manager = new THREE.LoadingManager(function onManagerLoad(){
    renderer.setClearColor(0xFFFFFF);
    ABSULIT.objects.models.forEach(function(item){
        info.remove();
    });
});

manager.onProgress = function ( item, loaded, total ) {
    percent.innerHTML = (Math.floor(loaded/total*100)) + '%';
};

const loader = new THREE.OBJLoader(manager),
      mtlLoader = new THREE.MTLLoader(manager),
      textureLoader = new THREE.TextureLoader(manager),
      ctmLoader = new THREE.CTMLoader();

loader.setPath( './models/' );
mtlLoader.setPath( './models/' );


const userHeight = 1.6; /* VRControls.userHeight */
const spotHeight = 0.22;
const teleportSpots = [
    {x: 6, y: spotHeight, z: 0},
    /*{x: 3, y: spotHeight, z: 0},
    {x: 0, y: spotHeight, z: 0},
    {x: -3, y: spotHeight, z: 0},*/
    {x: -6, y: spotHeight, z: 0},

    {x: 6, y: spotHeight, z: -1},
    {x: 3, y: spotHeight, z: -1},
    {x: 0, y: spotHeight, z: -1},
    {x: -3, y: spotHeight, z: -1},
    {x: -6, y: spotHeight, z: -1},

    {x: 6, y: spotHeight, z: 1},
    {x: 3, y: spotHeight, z: 1},
    {x: 0, y: spotHeight, z: 1},
    {x: -3, y: spotHeight, z: 1},
    {x: -6, y: spotHeight, z: 1},


    /* Fractals hallway */
    {x: 1, y: spotHeight, z: -4},
    {x: 1, y: spotHeight, z: -6.7},
    {x: 1, y: spotHeight, z: -9.4},
    {x: 1, y: spotHeight, z: -12.1},

    {x: 0, y: spotHeight, z: -13},

    {x: -1, y: spotHeight, z: -4},
    {x: -1, y: spotHeight, z: -6.7},
    {x: -1, y: spotHeight, z: -9.4},
    {x: -1, y: spotHeight, z: -12.1},

    /* MOCAP hallway */
    {x: 1, y: spotHeight, z: 4},
    {x: 1, y: spotHeight, z: 6.7},
    {x: 1, y: spotHeight, z: 9.4},
    {x: 1, y: spotHeight, z: 12.1},

    {x: 0, y: spotHeight, z: 13},

    {x: -1, y: spotHeight, z: 4},
    {x: -1, y: spotHeight, z: 6.7},
    {x: -1, y: spotHeight, z: 9.4},
    {x: -1, y: spotHeight, z: 12.1},

];

var resizeViewport = function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if(stereoEffect){
        stereoEffect.setSize(window.innerWidth, window.innerHeight);
    }else{
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

var toggleStereo = function(){
    stereoEnabled = !stereoEnabled;
    if(stereoEnabled){
        if(effectCache){
            stereoEffect = effectCache
        }else{
            stereoEffect = new THREE.StereoEffect(renderer);
            stereoEffect.eyeSeparation = 1;
            effectCache = stereoEffect;
        }
    }else{
        stereoEffect = null;
    }
    resizeViewport();
}

function activateStereoFallback(){
    if(effectCache){
        stereoEffect = effectCache
    }else{
        stereoEffect = new THREE.StereoEffect(renderer);
        stereoEffect.eyeSeparation = 1;
        effectCache = stereoEffect;
    }
    resizeViewport();
    //fullscreen();
}

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

var isMobile = mobileAndTabletcheck();

var buttonPressed = false;

const jsonData = {
    1:{
        head:{path:'am_threejs_CEC_BODY_1_HEAD.js', value: null},
        left:{path:'am_threejs_CEC_BODY_1_LEFT.js', value: null},
        right:{path:'am_threejs_CEC_BODY_1_RIGHT.js', value: null},
    },

    2:{
        head:{path:'am_threejs_CEC_BODY_2_HEAD.js', value: null},
        left:{path:'am_threejs_CEC_BODY_2_LEFT.js', value: null},
        right:{path:'am_threejs_CEC_BODY_2_RIGHT.js', value: null},
    },

    3:{
        head:{path:'am_threejs_CEC_BODY_3_HEAD.js', value: null},
        left:{path:'am_threejs_CEC_BODY_3_LEFT.js', value: null},
        right:{path:'am_threejs_CEC_BODY_3_RIGHT.js', value: null},
    },

    4:{
        head:{path:'am_threejs_CEC_BODY_4_HEAD.js', value: null},
        left:{path:'am_threejs_CEC_BODY_4_LEFT.js', value: null},
        right:{path:'am_threejs_CEC_BODY_4_RIGHT.js', value: null},
    },

};

function loadJSON(item, callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', './js/mocap/' + item.path, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            item.value = JSON.parse(xobj.responseText.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
            callback(item);
        }
    };
    xobj.send(null);
}

function loadMocapData(){
    let index, item;

    for (index in jsonData){
        item = jsonData[index];

        (function(item, index){

            loadJSON(item.head, function(responseItem){
                loadJSON(item.left, function(responseItem){
                    loadJSON(item.right, function(responseItem){

                        CS['mocap' + index].init(function(o){

                        }, textureCube);

                    });
                });
            });

        }(item, index));

    }
}

function init() {
    if ( /*stereoEnabled &&*/ (WEBVR.isAvailable() === false) ) {
        document.body.appendChild( WEBVR.getMessage() );
    }

    renderer = new THREE.WebGLRenderer({antialias: !isMobile, alpha: false});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1);

    sceneCube = new THREE.Scene();
    cameraCube = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );


    cameraContainer.add(camera);
    scene.add(cameraContainer);

    if(isMobile){
        camera.position.y = userHeight;
        controls = new THREE.DeviceOrientationControls( camera );
    }else{

        if(WEBVR.isAvailable()){
            controls = new THREE.VRControls(/*cameraContainer*/ camera );
            controls.standing = true;
            vrEffect = new THREE.VREffect( renderer );
        }else{

        }
        if ( navigator.getVRDisplays ) {

            navigator.getVRDisplays()
                .then( function ( displays ) {
                    effect.setVRDisplay( displays[ 0 ] );
                    controls.setVRDisplay( displays[ 0 ] );
                } )
                .catch( function () {
                    // no displays
                } );

            document.body.appendChild( WEBVR.getButton( vrEffect ) );

        }
    }

    if(isMobile){
        noSleep = new NoSleep()
        activateStereoFallback();
    }else{
        if ( WEBVR.isAvailable() === true ) {
            var button = WEBVR.getButton( vrEffect )
            document.body.appendChild( button );
        }
    }


    /*
        My code
    */
    var r = "textures/cube/hall/";
    var urls = [ r + "posx.png", r + "negx.png",
                 r + "posy.png", r + "negy.png",
                 r + "posz.png", r + "negz.png" ];

    textureCube = new THREE.CubeTextureLoader(manager).load( urls );
    textureCube.format = THREE.RGBFormat;
    textureCube.mapping = THREE.CubeReflectionMapping;

    r = "textures/cube/anim2/";
    urls = [ r + "posx.png", r + "negx.png",
             r + "posy.png", r + "negy.png",
             r + "posz.png", r + "negz.png" ];

    textureCubeAnim2 = new THREE.CubeTextureLoader(manager).load( urls );
    textureCubeAnim2.format = THREE.RGBFormat;
    textureCubeAnim2.mapping = THREE.CubeReflectionMapping;

    loadMocapData();
    //
    clock.autoStart = true;

    directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    directionalLight.position.set(2,20,0);
    scene.add( directionalLight );

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add( ambientLight );


    loadObjects();

    var geometry = new THREE.BoxGeometry( .1, .1, .1 );
    var material = new THREE.MeshPhongMaterial( {color: 0xffffff, wireframe:false} );
    o = new THREE.Mesh( geometry, material );

    handLeft = o.clone();
    handRight = o.clone();

    handLeft.material.envMap = handRight.material.envMap = textureCube;

    /*scene.add( handLeft );
    scene.add( handRight );*/


    var fwAmount = .01,
        fwRun = .05;


    ABSULIT.info.init();
    ABSULIT.teleportSpots.init(teleportSpots);

    ABSULIT.pointer.init();
    ABSULIT.audioLoader.init();

    CS.spheres.init(function(o){

    }, textureCube);

    CS.anim1.init(function(o){

    }, textureCube, clock);

    CS.anim2.init(function(o){

    }, textureCubeAnim2, clock);

    ABSULIT.skysphere.init('textures/sky_sphere.jpg');

    /*
        - My code ends
    */

    window.addEventListener('click',function onClickWindow(){
        if(isMobile){
            noSleep.enable();
            fullscreen();
        }
    });

    window.addEventListener( 'resize', resizeViewport, false );
    document.body.appendChild( renderer.domElement );

    resizeViewport();
}

var ART_POINTER_TYPE = ABSULIT.teleportSpots.ART_POINTER_TYPE;
var objectsToLoad = [
    {file: 'floor.obj',             pointerType: null,             normal: !isMobile,     shininess: 10},
    {file: 'hall.obj',              pointerType: null,             normal: !isMobile,     shininess: 10  },
    {file: 'acropolis.obj',         pointerType: null,             normal: false,    shininess: null},
    {file: 'castle_lake.obj',       pointerType: null,             normal: false,    shininess: null},
    {file: 'good_samaritan.obj',    pointerType: null,             normal: false,    shininess: null},
    {file: 'moonlight.obj',         pointerType: null,             normal: false,    shininess: null},
    {file: 'podiums.obj',           pointerType: null,             normal: false,    shininess: null},
    {file: 'lamps.ctm',             pointerType: null,             normal: false,    shininess: null,    side: THREE.DoubleSide},
    {file: 'david.ctm',             pointerType: ART_POINTER_TYPE, normal: false,    shininess: 0},
    {file: 'female_head.ctm',       pointerType: ART_POINTER_TYPE, normal: false,    shininess: 2},
    {file: 'lion.ctm',              pointerType: ART_POINTER_TYPE, normal: false,    shininess: null},
    {file: 'greek_bust.ctm',        pointerType: ART_POINTER_TYPE, normal: false,    shininess: null},
    {file: 'old_man.ctm',           pointerType: ART_POINTER_TYPE, normal: false,    shininess: null},
    {file: 'nefertiti.ctm',         pointerType: ART_POINTER_TYPE, normal: false,    shininess: 0},
    {file: 'fractal_1.ctm',         pointerType: ART_POINTER_TYPE, normal: false,    shininess: 0},
    {file: 'fractal_2.ctm',         pointerType: ART_POINTER_TYPE, normal: false,    shininess: 10},
    {file: 'fractal_3.ctm',         pointerType: ART_POINTER_TYPE, normal: false,    shininess: 0},
    {file: 'female_helmet.ctm',     pointerType: ART_POINTER_TYPE, normal: false,    shininess: 10},
    {file: 'monk_uv.ctm',           pointerType: ART_POINTER_TYPE, normal: false,    shininess: 10},
    {file: 'david_bike_hall_3.ctm', pointerType: ART_POINTER_TYPE, normal: false,    shininess: null},
],
    objectIndex = 0;

function loadObjects(){
    loadObject(objectIndex, objectsToLoad);
};

function loadObject(o){
    if(objectIndex < objectsToLoad.length){
        ABSULIT.objects.init(objectsToLoad[objectIndex], loadObject);
        ++objectIndex;
    }
};

function update(time) {
    if(isMobile){
        requestAnimationFrame(update)
    }else{
        vrEffect.requestAnimationFrame(update);
    }

    /*
        My code
    */

    //ABSULIT.gamepad.update();
    var handRightRotation = handRight.rotation.toVector3();
    handRightRotation.normalize();
    ABSULIT.pointer.update(handRight.position, handRight.rotation);
    ABSULIT.info.update();

    ABSULIT.teleportSpots.update();
    ABSULIT.objects.update();

    CS.spheres.update();
    CS.anim1.update();
    CS.anim2.update();

    CS.mocap1.update();
    CS.mocap2.update();
    CS.mocap3.update();
    CS.mocap4.update();

    /*
        - My code ends
    */

    if(isMobile){
        stereoEffect.render( scene, camera );
    }else{
        if(WEBVR.isAvailable() === true){
            vrEffect.render( scene, camera );
        }
    }
    controls.update(cameraPosition, cameraRotation);

}

function fullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (renderer.domElement.msRequestFullscreen) {
    window.msRequestFullscreen();
  } else if (renderer.domElement.mozRequestFullScreen) {
    document.body.mozRequestFullScreen();
  } else if (renderer.domElement.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  }
}

init();
update();
