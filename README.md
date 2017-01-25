# The Hall VR


![hallvr1](/screenshots/thehall1.jpg)

WebVR demo to be used with Oculus Rift.

The Hall is a demo created in [Cecropia Solutions](http://www.cecropiasolutions.com/) to test the WebVR capabilities.

The project has a variety of art items in display. Some custom, some of free access and use.

# Navigation

It has various types of navigation, but the main are the Teleport Spots, yellow dots on the floor to jump quick to an interest point.

If no Touch controllers are connected, the default navigation is using the gaze pointer.

# Development process

The object modeling and texture baking was created in Blender, where the 1m unit is used as base size; the models are exported individually, converted to CTM and loaded into the application via Three.js.

A couple of the models were created with Oculus Medium and later decimated with Meshlab.

A couple of [Kinetic Sculptures](https://en.wikipedia.org/wiki/Kinetic_art) were created directly with Three.js and a bit of Math knowledge.

We created a motorcycle model with [Photogrammetry](https://en.wikipedia.org/wiki/Photogrammetry).

Captured human movement to create four animations that occupy one side of a hallway.


[Live Demo](https://cecropia.github.io/thehallvr/)



# Technologies used

- [WebVR](https://webvr.info/)
- [Three.js r84](https://threejs.org/)
- [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
- [gamepad.js](https://github.com/Absulit/gamepad.js)
- [Blender](https://www.blender.org/)
- [Wavefront OBJ file format](https://en.wikipedia.org/wiki/Wavefront_.obj_file)
- [CTM file format](https://en.wikipedia.org/wiki/OpenCTM)
- [OpenCTM](http://openctm.sourceforge.net/)
- [Oculus Medium](https://www.oculus.com/medium/)
- [Meshlab](http://www.meshlab.net/)

# Various Models are from

- [Archive3D](http://archive3d.net/)
- [Nefertiti](http://nefertitihack.alloversky.com/)
- [Female with a Helmet](https://sketchfab.com/models/c80c8fd27ebf4762a781ac298667fa48)

# Audio is from

- [freesound.org](https://www.freesound.org/)

# Paintings from

- [wikipedia.org](https://www.wikipedia.org/)

# More images

![hallvr2](/screenshots/thehall2.jpg)
![hallvr3](/screenshots/thehall3.jpg)
![hallvr4](/screenshots/thehall4.jpg)
![hallvr5](/screenshots/thehall5.jpg)

[Live Demo](https://cecropia.github.io/thehallvr/)
