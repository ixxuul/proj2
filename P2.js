/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */

// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( length, 0, 0 ),
	    0xFF0000,
	    false
	)
y_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, length, 0 ),
	    0x00ff00,
	    false
	)
z_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, 0, length ),
	    0x0000FF,
	    false
	)
	
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function(a) {
  this.matrix=mvMatrix;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 80, 20, 80 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	},
	{
		left: 0.501,
		bottom: 0.0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 65, 20, 65 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	}
];



//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// Creating the two cameras and adding them to the scene.
var view = views[0];
camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_MotherShip.position.x = view.eye[ 0 ];
camera_MotherShip.position.y = view.eye[ 1 ];
camera_MotherShip.position.z = view.eye[ 2 ];
camera_MotherShip.up.x = view.up[ 0 ];
camera_MotherShip.up.y = view.up[ 1 ];
camera_MotherShip.up.z = view.up[ 2 ];
camera_MotherShip.lookAt( scene.position );
view.camera = camera_MotherShip;
scene.add(view.camera);

var view = views[1];
camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_ScoutShip.position.x = view.eye[ 0 ];
camera_ScoutShip.position.y = view.eye[ 1 ];
camera_ScoutShip.position.z = view.eye[ 2 ];
camera_ScoutShip.up.x = view.up[ 0 ];
camera_ScoutShip.up.y = view.up[ 1 ];
camera_ScoutShip.up.z = view.up[ 2 ];
camera_ScoutShip.lookAt( scene.position );
view.camera = camera_ScoutShip;
scene.add(view.camera);


// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () 
{
     window.scrollTo(0,0);
}

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;

lights[0].position.set( 0, 0, 0 ); // IN THE SUN....

scene.add( lights[0] );

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////


// Create Solar System
var geometry = new THREE.SphereGeometry( 3, 32, 32 );
generateVertexColors( geometry );
var centralgeometry = new THREE.SphereGeometry( 4, 32, 32 );
generateVertexColors( centralgeometry );
var normalMaterial = new THREE.MeshNormalMaterial(  {color: 0xffaa00, wireframe: true});
var photo1=THREE.ImageUtils.loadTexture('photo.jpg');
var sunMaterial = new THREE.MeshBasicMaterial( {map:photo1} );
var sun = new THREE.Mesh( centralgeometry, sunMaterial );
var sun1 = new THREE.Mesh( geometry, sunMaterial );
var sun2 = new THREE.Mesh( geometry, sunMaterial );
var sun3 = new THREE.Mesh( geometry, sunMaterial );
var sun4 = new THREE.Mesh( geometry, sunMaterial );
var sun5 = new THREE.Mesh( geometry, sunMaterial );
var sun6 = new THREE.Mesh( geometry, sunMaterial );
var sun7 = new THREE.Mesh( geometry, sunMaterial );

scene.add( sun );
scene.add( sun1 );
scene.add( sun2 );
scene.add( sun3 );
scene.add( sun4 );
scene.add( sun5 );
scene.add( sun6 );
scene.add( sun7 );


var plantMaterial = new THREE.MeshPhongMaterial();

var mercurygeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( mercurygeometry );
var mercury = new THREE.Mesh( mercurygeometry, plantMaterial );
scene.add( mercury );
mercury.parent=sun;

var venusgeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( venusgeometry );
var venus = new THREE.Mesh( mercurygeometry, plantMaterial );
scene.add(venus);
venus.parent=sun1;

var earthgeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( earthgeometry );
var earth = new THREE.Mesh( earthgeometry, plantMaterial );
scene.add(earth);
earth.parent=sun2;

var moongeometry = new THREE.SphereGeometry( 1, 32, 32 );
generateVertexColors( moongeometry );
var moon = new THREE.Mesh( moongeometry, plantMaterial );
scene.add(moon);
moon.parent=earth;


var marsgeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( marsgeometry );
var mars = new THREE.Mesh( marsgeometry, plantMaterial );
scene.add(mars);
mars.parent=sun3;


var jupitergeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( jupitergeometry );
var jupiter = new THREE.Mesh( jupitergeometry, plantMaterial );
scene.add(jupiter);
jupiter.parent=sun4;

var saturngeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( saturngeometry );
var saturn = new THREE.Mesh( saturngeometry, plantMaterial );
scene.add(saturn);
saturn.parent=sun5;

// Saturn's ring
for (var ra=1;ra<100;ra++){
var segcount = 32;
var radius = 3+0.01*ra;
var linegeometry = new THREE.Geometry();
var linematerial = new THREE.LineBasicMaterial({ color: 0xFFFFFF});

for (var i = 0; i <= segcount; i++) {
   	var theta = (i / segcount) * Math.PI * 2;
    linegeometry.vertices.push(
    	new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
saturnring = new THREE.Line(linegeometry, linematerial)
scene.add(saturnring);
saturnring.parent=sun5;
saturnring.position.z=42;
}

var uranusgeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( uranusgeometry );
var uranus = new THREE.Mesh( uranusgeometry, plantMaterial );
scene.add(uranus);
uranus.parent=sun6;

var neptunegeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors( neptunegeometry );
var neptune = new THREE.Mesh( neptunegeometry, plantMaterial );
scene.add(neptune);
neptune.parent=sun7;
//TO-DO: INITIALIZE THE REST OF YOUR PLANETS



// create line
for (var j=1;j<9;j++){
	var segcount = 100;
	var radius = 7*j;
	var linegeometry = new THREE.Geometry();
	var linematerial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

	for (var i = 0; i <= segcount; i++) {
    	var theta = (i / segcount) * Math.PI * 2;
    	linegeometry.vertices.push(
        	new THREE.Vector3(
            	Math.cos(theta) * radius,0,
            	Math.sin(theta) * radius
            	));            
	}
	orbits = new THREE.Line(linegeometry, linematerial)
	scene.add(orbits);
}

//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind! 

var clock = new THREE.Clock(true);
console.log(clock);
function updateSystem() 
{
	// ANIMATE YOUR SOLAR SYSTEM HERE.
	sun.rotation.y+=0.005;
	sun1.rotation.y+=0.006;
	sun2.rotation.y+=0.008;
	sun3.rotation.y+=0.01;
	sun4.rotation.y+=0.003;
	sun5.rotation.y+=0.001;
	sun6.rotation.y+=0.012;
	sun7.rotation.y+=0.009;

	mercury.rotation.y+=0.03;
  	venus.rotation.y+=0.02;
  	earth.rotation.y+=0.1;
  	mars.rotation.y+=0.008;
  	jupiter.rotation.y+=0.009;
  	saturn.rotation.y+=0.04;
  	uranus.rotation.y+=0.02;
  	neptune.rotation.y+=0.004;

  	moon.position.x=3+0;
  	moon.position.z=0+0;

  	mercury.position.z=7;
  	venus.position.z=14;
  	earth.position.z=21;
  	mars.position.z=28;
  	jupiter.position.z=35;
  	saturn.position.z=42;
  	uranus.position.z=49;
  	neptune.position.z=56;

}

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  framean=requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) 
  {

		view = views[ii];
		camera_ = view.camera;

		view.updateCamera( camera_, scene, mouseX, mouseY );

		var left   = Math.floor( windowWidth  * view.left );
		var bottom = Math.floor( windowHeight * view.bottom );
		var width  = Math.floor( windowWidth  * view.width );
		var height = Math.floor( windowHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera_.aspect = width / height;
		camera_.updateProjectionMatrix();

		renderer.render( scene, camera_ );
	}
}


// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var spacecounter = 0;

function onKeyDown(event)
{
	// TO-DO: BIND KEYS TO YOUR CONTROLS	  
  if(keyboard.eventMatches(event,"shift+g"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }

 else if (keyboard.eventMatches(event,"space") && spacecounter === 0){
 	cancelAnimationFrame(framean);
 	spacecounter=1;
 }   

 else if (keyboard.eventMatches(event,"space") && spacecounter === 1){
 	requestAnimationFrame(update);
 	spacecounter=0;
 }

}
keyboard.domElement.addEventListener('keydown', onKeyDown );
		

update();