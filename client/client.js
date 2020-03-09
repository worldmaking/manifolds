

//  //************************************************************************************************// VARIABLES  //  //
//  //************************************************************************************************//
//  //************************************************************************************************//

const UNITVECTOR_X = new THREE.Vector3(1,0,0);
const UNITVECTOR_Y = new THREE.Vector3(0,1,0);
const UNITVECTOR_Z = new THREE.Vector3(0,0,1);

let log = document.getElementById( "log" );
let state_div = document.getElementById( "state" );
let msgs = [];


let container;
let camera, scene, renderer, controls; 

let crosshair, 
    raycaster, 
    handRay, 
    intersected, 
    leftInter,
    rightInter,
    intersections = [],
    intersectionsLeft = [],
    intersectionsRight = [];

let line, room, floor;

let leftHand,
    leftHandControl, 
    rightHand,
    rightHandControl;


let geometries = [
  new THREE.ConeGeometry( 0.01, 0.05, 32 ), // [0] boids //0.01 0.02
  new THREE.TorusGeometry( 0.03, 0.01, 16, 100 ), // [1] wrist
  new THREE.BoxGeometry( 0.06, 0.01, 0.07 ), // [2] palm
  new THREE.BoxGeometry( 0.01, 0.01, 0.01 ), // [3] joints
  new THREE.TorusGeometry( 0.01, 0.001, 16, 100 ), // [4] fingertips
  new THREE.RingBufferGeometry( 0.02, 0.04, 32 ), // [5] crosshair
  //new THREE.BoxLineGeometry( 10, 10, 10, 10, 10, 10 ), // [6] room
  new THREE.PlaneBufferGeometry( 10, 10 ), // [7] floor
  new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] ) // [8] raycaster
];

let materials = [
  // [0] boids
  new THREE.MeshLambertMaterial( {
    color: 0x9a799c//0x191919 //0x9a799c //0x101010
  } ),
  // [1] wrist, palm, joints
  new THREE.MeshStandardMaterial( {
    color: 0x883322 
  } ),
  // [2] fingertips 
  new THREE.MeshToonMaterial ( {
    color: 0x166d99,
    transparent: true,
    opacity: 0
  } ),
  // [3] crosshair
  new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    opacity: 0, //1
    transparent: true
  } ),
  // [4] room 
  new THREE.LineBasicMaterial( { 
    color: 0x808080
  } ),
  // [5] floor 
  new THREE.MeshStandardMaterial( {
    color: 0xffc30a,
    roughness: 1.0,
    metalness: 0.5
  } ),
  // [6] new floor
  new THREE.MeshLambertMaterial( {
    color: 0x101010//0x191919 //0x9a799c //0x101010
  } ),
  // [7] fingertips 
  new THREE.MeshToonMaterial ( {
    color: 0x160099
  } ),
  // [8] fingertips 
  new THREE.MeshToonMaterial ( {
    color: 0x166d00
  } ),
  // [9] fingertips 
  new THREE.MeshToonMaterial ( {
    color: 0x006d99,
    transparent: true,
    opacity: 0
  } ),
];

let state = null;

let sock;



//  //************************************************************************************************// FUNCTION CALLS  //  //
//  //************************************************************************************************//
//  //************************************************************************************************//

initialize();
animate();


//  //************************************************************************************************// SERVER CONNECT  //  //
//  //************************************************************************************************//
//  //************************************************************************************************//

//  //*************************************** // WRITE // ********************************************//

function write( ...args ) {

	if( msgs.length > 15 ) {

		msgs.shift();
  
  }

	let msg = args.join( ", " );
	msgs.push( msg );
  let fMsg = msgs.join( "\n" );

	log.innerText = "";
  log.innerText +=  "Log: \n " + fMsg;
  
  console.log( msg );
  
}
//  //*********************************** // CONNECT_TO_SERVER // *************************************//
function connect_to_server( opt, log ) {

	let self = {
    transport: opt.transport || "ws",
		hostname: opt.hostname || window.location.hostname,
		port: opt.port || window.location.port,
		protocols: opt.protocols || [],
		reconnect_period: 1000,
		reload_on_disconnect: true,
		socket: null,
  };
  
  self.addr = self.transport + '://' + self.hostname + ':' + self.port;
	
	let connect = function() {
  
    self.socket = new WebSocket( self.addr, self.protocols );
		self.socket.binaryType = 'arraybuffer';
    //self.socket.onerror = self.onerror;
    
		self.socket.onopen = function() {

			log( "websocket connected to " + self.addr );
			// ...
  
    }
  
    self.socket.onmessage = function( e ) { 
  
      if ( e.data instanceof ArrayBuffer ) {
  
        // if (onbuffer) {
				// 	//onbuffer(e.data, e.data.byteLength);
				// } else {

        log( "ws received arraybuffer of " + e.data.byteLength + " bytes" )

        //}

      } else {
  
        let msg = e.data;
				let obj
  
        try {
  
          obj = JSON.parse( msg );
  
        } catch( e ) {}
  
        if ( obj.cmd == "newData" ) {
  
          state = obj.state;
  
       } else if (obj.cmd == "trackingData") {

         
				} else {
          
          log( "ws received", msg );
  
        }
			} 
		}
  
    self.socket.onclose = function( e ) {
  
      self.socket = null;

			setTimeout( function() {
  
        if ( self.reload_on_disconnect ) {
  
          window.location.reload( true );
  
        } else {
  
          log( "websocket reconnecting" );

					connect();
  
        }
			}, self.reconnect_period );		
  
      //if (onclose) onclose(e);
			log( "websocket disconnected from " + self.addr );
  
    }

		self.send = function( msg ) {
  
      if ( !self.socket ) { console.warn( "socket not yet connected" ); return; }
			if ( self.socket.readyState != 1 ) { console.warn( "socket not yet ready" ); return; }
			if ( typeof msg !== "string" ) msg = JSON.stringify( msg );
  
      self.socket.send( msg );
  
    }
	}

	connect();

	return self;
}


//  //************************************************************************************************// INITIALIZATION  //  //  
//  //************************************************************************************************//
//  //************************************************************************************************//

function initialize() {
  
  //** setup */
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  let info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = 'STUPID HACKATHON 2020';
  container.appendChild( info );

  //** add scene */
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x808080 );
  //scene.fog	= new THREE.FogExp2( 0xdde0f0, 0.0025 );
  
  //** add camera */
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight; // 2;  // the canvas default
  const near = 0.01; //0.1;
  const far = 20; //10 //50;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  //** camera crosshairs | for intersections and to orientate sightline */
  crosshair = new THREE.Mesh( geometries[5], materials[3] );
  //camera.add( crosshair );
  crosshair.position.z = - 1; //** keep crosshair slightly infront of you at all times */
  //user.add( camera );
  scene.add( camera );

  //** add lighting */
  scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );
  scene.add( new THREE.AmbientLight( 0x404040 ) ); //** soft white light */
  let light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 ).normalize();
  light.castShadow = true;
  // light.shadow.camera.top = 6
  // light.shadow.camera.bottom = -6;
  // light.shadow.camera.right = 6;
  // light.shadow.camera.left = -6;
  // light.shadow.mapSize.set( 4096, 4096 );
  scene.add( light );
  
  //** add floor */
  //floor = new THREE.Mesh( geometries[7], materials[5] );
  floor = new THREE.Mesh( geometries[7],  materials[6] )
  floor.rotation.x = - Math.PI / 2;
  floor.name = "floor"
  floor.receiveShadow = true;
  scene.add( new THREE.PointLight( 0xff0040, 2, 50 ) );
  scene.add(floor)
  
  //** add ray | used for casting lines from head + controllers to objects | used for intersecting */
  raycaster = new THREE.Raycaster();
  
  //** add rendered requirements */
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;

  //** include VR content */
  renderer.vr.enabled = true;
  
  container.appendChild( renderer.domElement );
  document.body.appendChild( WEBVR.createButton( renderer ) );
  
  leftHandControl = renderer.vr.getController( 0 );
  leftHandControl.addEventListener( 'selectstart', onSelectStart );
  leftHandControl.addEventListener( 'selectend', onSelectEnd );
  scene.add( leftHandControl );

  rightHandControl = renderer.vr.getController( 1 );
  rightHandControl.addEventListener( 'selectstart', onSelectStart );
  rightHandControl.addEventListener( 'selectend', onSelectEnd );
  scene.add( rightHandControl );

  let line = new THREE.Line( geometries[8] );
  line.name = 'handRay';
  line.scale.z = 1;

  leftHandControl.add( line.clone() );
  rightHandControl.add( line.clone() );

  // leftHand.add( new THREE.AxesHelper( 0.05 ) );  
  // palm.add( new THREE.AxesHelper( 0.05 ) );
  scene.add( new THREE.AxesHelper( 1 ) );

  //** add event listeners  */
  // window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
  // window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );
  window.addEventListener( 'resize', onWindowResize, false );

  try {
    sock = connect_to_server( {}, write );
  } catch ( e ) {
    console.error( e );
  }

}



//  //************************************************************************************************// INTERSECTIONS  //  // 
//  //************************************************************************************************//
//  //************************************************************************************************//

//  //*************************************** // CLEAN // ********************************************//
function cleanIntersected() {

  while ( intersections.length ) {

    let object = intersections.pop();
    object.material.emissive.r = 0;

  }

}


//  //********************************** // SELECT START // ******************************************//
function onSelectStart( event ) {

  let selectStart = event.target;
  let intersections = getIntersections( selectStart );

  if ( intersections.length > 0 ) {

    let intersection = intersections[ 0 ];

    tempMatrix.getInverse( selectStart.matrixWorld );

    let object = intersection.object;
    object.matrix.premultiply( tempMatrix );
    object.matrix.decompose( object.position, object.quaternion, object.scale );
    //object.material.emissive.b = 1;
    selectStart.add( object );

    selectStart.userData.selected = object;

  }

}

//  //************************************ // SELECT END // ******************************************//
function onSelectEnd( event ) {

  let selectEnd = event.target;

  if ( selectEnd.userData.selected !== undefined ) {

    let object = selectEnd.userData.selected;
    object.matrix.premultiply( selectEnd.matrixWorld );
    object.matrix.decompose( object.position, object.quaternion, object.scale );
    //object.material.emissive.b = 0;
    scene.add( object );

    selectEnd.userData.selected = undefined;

  }


}

//  //******************************** // GET INTERSECTIONS // ***************************************//
function getIntersections( event ) {

  tempMatrix.identity().extractRotation( event.matrixWorld );

  raycaster.ray.origin.setFromMatrixPosition( event.matrixWorld );
  raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );

  return raycaster.intersectObjects( user.children );

}

//  //********************************* // INTERSECT OBJECT // ***************************************//
function intersectObjects( handAction ) {

  //* Do not highlight when already selected */

  if ( handAction.userData.selected !== undefined ) return;

  let handRay = handAction.getObjectByName( 'handRay' );
  let intersections = getIntersections( handAction );

  if ( intersections.length > 0 ) {

    let intersection = intersections[ 0 ];

    let object = intersection.object;
    object.material.emissive.r = 1;
    // object.rotation.y += 0.1;
    intersections.push( object );

    handRay.scale.z = intersection.distance;

  } else {

    handRay.scale.z = 5;

  }

}

//  //********************************** // INTERSECT HEAD // ****************************************//
function intersectHead() {
  
  raycaster.setFromCamera( { x: 0, y: 0 }, camera );
  let intersects = raycaster.intersectObjects( user.children );
  
  if ( intersects.length > 0 ) {
    
    if ( intersected != intersects[ 0 ].object ) {
      
      if ( intersected ) intersected.material.emissive.setHex( intersected.currentHex );
      
      intersected = intersects[ 0 ].object;
      intersected.currentHex = intersected.material.emissive.getHex();
      intersected.material.emissive.setHex( 0xff0000 );
      // intersected.rotation.y += 0.5;
      // intersected.position.z -= 0.1;

      if (intersected) {
        try {
          sock.send( "sendHaptics" );
        } catch( e ) {
          write( e );
        }
      }
    } else {
    
    if ( intersected ) intersected.material.emissive.setHex( intersected.currentHex );

    intersected = undefined;
    
    }
  }
}

//  //************************************ // CHECK ROOM // ******************************************//
function checkRoom() {
  
  for ( let i = 0; i < room.children.length; i ++ ) {
    
    let canTouch = room.children[ i ];

    if ( canTouch.position.x < - 2.5 || canTouch.position.x > 2.5 ) {
      
      canTouch.position.x = THREE.Math.clamp( canTouch.position.x, - 2.5, 2.5 );
      
    }  //** canTouch position x */
    
    if ( canTouch.position.y < - 2.5 || canTouch.position.y > 3 ) {
      
      canTouch.position.y = THREE.Math.clamp( canTouch.position.y, - 3, 3 );
      
    }  //** canTouch position y */
    
    if ( canTouch.position.z < - 2.5 || canTouch.position.z > 2.5 ) {
      
      canTouch.position.z = THREE.Math.clamp( canTouch.position.z, - 2.5, 2.5 );
      
    } //** canTouch position z */
    
  } 
}


//  //************************************************************************************************/ 
//  //************************************************************************************************/  UPDATE VR WORLD  //  //
//  //************************************************************************************************/ 

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  renderer.setAnimationLoop( render );

}

function render() {
  
  //controls.update();

  // try {
  //   sock.send( "getData" );
  // } catch( e ) {
  //   write( e )
  // }

  // try {
  //   sock.send( "sendHaptics" );
  // } catch( e ) {
  //   write( e );
  // }

  if ( !state ) return;


  //** manage intersections */
  cleanIntersected();
  getIntersections();
  intersectObjects( leftHandControl );
  intersectObjects( rightHandControl );
  intersectHead();
  //checkRoom();
  


  renderer.render( scene, camera );

}