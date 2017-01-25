/**
 * @author Sebastián Sanabria Díaz
 * Gamepad controls loosely based on this MDN link:
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * https://developers.google.com/web/fundamentals/vr/adding-input-to-a-webvr-scene/
 * chrome://flags
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.gamepad = ABSULIT.gamepad || (function () {
    'use strict';
    var object = {},
        gamepad = null,
        gamepads = {},
        gamepadConnected = false;

    var events = {
            A: 'A',
            B: 'B',
            X: 'X',
            Y: 'Y',

            LB: 'LB',
            RB: 'RB',
            LT: 'LT',
            RT: 'RT',

            VIEW: 'VIEW',
            MENU: 'MENU',

            LJB: 'LJB',
            RJB: 'RJB',

            UP: 'UP',
            DOWN: 'DOWN',
            LEFT: 'LEFT',
            RIGHT: 'RIGHT',

            LJX: 'LJX',
            RJX: 'RJX',

        },
        onGamepadPressedLocal,
        onUpdateLocal,
        gamepadIdListLocal;

    object.events = events;

    object.init = function (gamepadIdList, onGamepadPressed, onUpdate) {
        onGamepadPressedLocal = onGamepadPressed;
        onUpdateLocal = onUpdate;
        gamepadIdListLocal = gamepadIdList;

        //https://twitter.com/Tojiro/status/807758580791197696
        //console.log(navigator.getVRDisplays() );

        window.addEventListener("gamepadconnected", function(e) {
            gamepads = getGamepads();
            gamepad = getController(gamepads, 'xbox');
            gamepadConnected = !!gamepad;
        });

        window.addEventListener("gamepaddisconnected", function(e) {
          console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);

            gamepadConnected = false;
        });

        gamepads = getGamepads();
        gamepad = getController(gamepads, 'xbox');
        gamepadConnected = !!gamepad;

        window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
        window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
    };

    /* -------------------- */


    function gamepadHandler(event, connecting) {
      var gamepad = event.gamepad;
      // Note:
      // gamepad === navigator.getGamepads()[gamepad.index]

      if (connecting) {
        gamepads[gamepad.index] = gamepad;
      } else {
        delete gamepads[gamepad.index];
      }
    }
    /* -------------------- */
    var buttons = {
        /*A:{},
        B:{},
        X:{},
        Y:{},

        LB:{},*/

    };

    var pose = {

    }

    var formattedGamepads = {};

    function getGamepads(){
        return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    }

    function getController(gamepads, id){
        //console.log(gamepads);
        var gp, gpindex;
        for(gpindex in gamepads){
            gp = gamepads[gpindex];
            //console.log(gp);
            //console.log('---- gp.id',gp.id);
            if(gp !== null && (typeof gp == "object") && (gp.id.toLowerCase().indexOf(id) !== -1)){
                break;
            }
        }
        return gp;
    }


    var gamepadIdListIndex;
    var gamepadId;
    object.update = function () {
        //gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        gamepads = getGamepads();
        //console.log(gamepads);
        /* -------------------- */
        gamepadIdListIndex = 0;
        while(gamepadIdListIndex < gamepadIdListLocal.length){
            gamepadId = gamepadIdListLocal[gamepadIdListIndex];
            gamepad = getController(gamepads, gamepadId);

            if(gamepadConnected && gamepad.buttons){
                //console.log(gamepad.buttons[3]);

                //console.log(gamepad.pose);

                formattedGamepads[gamepadId] = {};
                formattedGamepads[gamepadId].pose = gamepad.pose;


                // Oculus Touch Mapping
                // 0 // RJB
                // 1 // TRIGGER / INDEX TRIGGER
                // 2 // MIDDLE  / HAND TRIGGER
                // 3 // A
                // 4 // B
                // 5 // MENU / HOME ? / reserved

                buttons.A = gamepad.buttons[0] ;
                buttons.B = gamepad.buttons[1] ;
                buttons.X = gamepad.buttons[2] ;
                buttons.Y = gamepad.buttons[3] ;

                buttons.LB = gamepad.buttons[4] ;
                buttons.RB = gamepad.buttons[5] ;
                buttons.LT = gamepad.buttons[6] ;
                buttons.RT = gamepad.buttons[7] ;

                buttons.VIEW = gamepad.buttons[8] ;
                buttons.MENU = gamepad.buttons[9] ;

                buttons.LJB = gamepad.buttons[10] ;
                buttons.RJB = gamepad.buttons[11] ;

                buttons.UP = gamepad.buttons[12] ;
                buttons.DOWN = gamepad.buttons[13] ;
                buttons.LEFT = gamepad.buttons[14] ;
                buttons.RIGHT = gamepad.buttons[15] ;

                buttons.LJX = {x: gamepad.axes[0], y: gamepad.axes[1]};
                buttons.RJX = {x: gamepad.axes[2], y: gamepad.axes[3]};


                buttons.LJX.pressed = (Math.abs(buttons.LJX.x) > .1) || (Math.abs(buttons.LJX.y) > .1);
                buttons.RJX.pressed = (Math.abs(buttons.RJX.x) > .1) || (Math.abs(buttons.RJX.y) > .1);

                buttons.LJX.angle = Math.atan2(buttons.LJX.y, buttons.LJX.x);
                buttons.RJX.angle = Math.atan2(buttons.RJX.y, buttons.RJX.x);

                formattedGamepads[gamepadId].buttons = buttons;

            }



            ++gamepadIdListIndex;

        }
        onGamepadPressedLocal(formattedGamepads);


        /* -------------------- */
        onUpdateLocal(formattedGamepads);
    };

    return object;

})();
