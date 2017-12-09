// create a variable to hold our world object
var world;

// create a variable to hold our marker
var marker;

var allCars = {};
var allData;

function setup() {
	world = new World('ARScene');
	angleMode(DEGREES);

	marker = world.getMarker('w_marker');

	//marker.addChild(car.object);

	var updates = firebase.database().ref("/");
	updates.on("value", function(snapshot) {
		allData = snapshot.val();

		if (allData != null) {
			//console.log("Database Updated");
			for (var key in allData) {
				if (typeof allCars[key] == "undefined" && key != "undefined") {
					allCars[key] = new Car();
					marker.addChild(allCars[key].object);
				}
			}

			// remove any old unused cars
			for (var key in allCars) {
				if (typeof allData[key] == "undefined") {
					console.log(allCars);
					marker.removeChild(allCars[key].object);
					delete allCars[key];
					console.log(allCars);
				}
			}
		}
		else {
			for (var key in allCars) {
				//console.log(allCars);
				marker.removeChild(allCars[key].object);
				delete allCars[key];
				//console.log(allCars);
			}
		}

	})

}


function draw() {

	//console.log(allCars);

	//console.log(allData);
	if (allData != null) {
		for (var key in allCars) {
			if (typeof allData[key] != "undefined") {
				if (allData[key].turnAction == "left") {
					allCars[key].turnLeft();
				}
				if (allData[key].turnAction == "right") {
					allCars[key].turnRight();
				}
				if (allData[key].goAction == "forward") {
					allCars[key].goForwards();
				} else if (allData[key].goAction == "backward") {
					allCars[key].goBackwards();
				} else if (allCars[key].speed > allCars[key].acc/2 || allCars[key].speed < -allCars[key].acc/2) {
					allCars[key].decelerate();
					//console.log("beep");
				}
			}
		}


		for (var key in allCars) {
			allCars[key].move();
		}
	}
}

function Car() {
	/*this.object = new OBJ({
		asset: 'car_obj',
		mtl: 'car_mtl',
		x: 0,
		y: 0,
		z: 0,
		scaleX:0.008,
		scaleY:0.008,
		scaleZ:0.008,
	});*/
	this.object = new Container3D();

	this.speed = 0;
	this.max = 0.07;
	this.acc = 0.003;
	this.dec = 0.003;
	this.dir = 0;
	this.moving = "forwards"
	this.object.rotateY(this.dir);
	this.turn = 5;
	this.go = false;
	this.scale = 0.25;

	this.move = function() {
		//console.log(this.object.getX() + " - " + this.object.getZ());
		if (this.speed > 0) {
			this.speed = constrain(this.speed, 0, this.max);
		} else if (this.speed < 0) {
			this.speed = constrain(this.speed, -this.max, 0);
		}

		if (this.speed < this.acc/2 && this.speed > -this.acc/2) {
			this.speed = 0;
		} else {
			this.object.rotateY(this.dir);
		}

		this.object.nudge((this.speed*cos(this.dir)),0,(this.speed*sin(-this.dir)));

		//console.log(this.dir);

		if (this.object.getZ() > 8) {
			this.object.setZ(-8);
		}
		if (this.object.getZ() < -8) {
			this.object.setZ(8);
		}
		if (this.object.getX() > 8) {
			this.object.setX(-8);
		}
		if (this.object.getX() < -8) {
			this.object.setX(8);
		}
	}

	this.goForwards = function() {
		this.speed += this.acc;
		this.moving = "forwards";
	}

	this.goBackwards = function() {
		this.speed -= this.acc;
		this.moving = "backwards";
	}

	this.decelerate = function() {
		//this.speed -= this.dec;
		if (this.speed > 0) {
			this.speed -= this.dec;
		} else {
			this.speed += this.dec;
		}
	}

	this.turnLeft = function() {
		this.dir += this.turn*(this.speed/this.max);
	}

	this.turnRight = function() {
		this.dir -= this.turn*(this.speed/this.max);
	}

	var cab = new Box({
		green:0,
		blue:0,
		width:1,
		depth:1,
		height:.9,
		y:.65
	});
	this.object.addChild(cab);

	var windshields = new Box({
		red:0,
		green:0,
		blue:0,
		y:0.65,
		width:1.1,
		depth:.8,
		height:.7
	});
	//this.object.addChild(windshields);

	var trunk = new Box({
		green:0,
		blue:0,
		width:1.75,
		depth:.999,
		height:.4,
		y:.4
	});
	this.object.addChild(trunk);

	var wheel1 = new Circle({
		x:-.5,
		y:.2,
		z:.52,
		radius:0.2,
		red:0,
		green:255,
		blue:0,
		side:'double'
	});
	this.object.addChild(wheel1);

	var wheel2 = new Circle({
		x:.5,
		y:.2,
		z:.52,
		radius:0.2,
		red:0,
		green:255,
		blue:0,
		side:'double'
	});
	this.object.addChild(wheel2);

	var wheel3 = new Circle({
		x:-.5,
		y:.2,
		z:-.52,
		radius:0.2,
		red:0,
		green:255,
		blue:0,
		side:'double'
	});
	this.object.addChild(wheel3);

	var wheel4 = new Circle({
		x:.5,
		y:.2,
		z:-.52,
		radius:0.2,
		red:0,
		green:255,
		blue:0,
		side:'double'
	});
	this.object.addChild(wheel4);

	var frontLight1 = new Box({
		width:.1,
		depth:.1,
		height:.1,
		x:.865,
		y:.45,
		z:.35
	});
	this.object.addChild(frontLight1);

	var frontLight2 = new Box({
		width:.1,
		depth:.1,
		height:.1,
		x:.865,
		y:.45,
		z:-.35
	});
	this.object.addChild(frontLight2);

	var backLight1 = new Box({
		width:.1,
		depth:.1,
		height:.1,
		x:-.865,
		y:.45,
		z:.35,
		green:0,
		blue:0
	});
	this.object.addChild(backLight1);

	var backLight2 = new Box({
		width:.1,
		depth:.1,
		height:.1,
		x:-.865,
		y:.45,
		z:-.35,
		green:0,
		blue:0
	});
	this.object.addChild(backLight2);

	this.object.setScaleX(this.scale);
	this.object.setScaleY(this.scale);
	this.object.setScaleZ(this.scale);
}
