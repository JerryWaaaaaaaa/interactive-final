// create a variable to hold our world object
var world;

// create a variable to hold our marker
var marker;

var allCars = {};

function setup() {
	world = new World('ARScene');
	angleMode(DEGREES);

	marker = world.getMarker('w_marker');

	//marker.addChild(car.object);
}


function draw() {
	var updates = firebase.database().ref("/");
	updates.on("value", function(snapshot) {
		allData = snapshot.val();
		for (var key in allData) {
			if (typeof allCars[key] == "undefined") {
				allCars[key] = new Car();
				marker.addChild(allCars[key].object);
			}
		}
	})

	for (var key in allData) {
		if (allData[key].action == "left") {
			allCars[key].turnLeft();
		} else if (allData[key].action == "right") {
			allCars[key].turnRight();
		}
	}

	for (var key in allCars) {
		allCars[key].move();
	}
}

function Car() {
	this.object = new OBJ({
		asset: 'car_obj',
		mtl: 'car_mtl',
		x: 0,
		y: 0,
		z: 0,
		scaleX:0.008,
		scaleY:0.008,
		scaleZ:0.008,
	});

	this.speed = 0.07;
	this.max = 0.07;
	this.acc = 0.003;
	this.dec = 0.003;
	this.dir = 0;
	this.object.rotateY(this.dir);
	this.turn = 5;

	this.move = function() {
		//console.log(this.object.getX() + " - " + this.object.getZ());
		if (keyIsDown(38)) { //up arrow
			this.accelerate();
		} else {
			this.decelerate();
		}
		this.speed = constrain(this.speed, 0, this.max);

		if (this.speed > 0) {
			this.object.rotateY(this.dir);
		}

		this.object.nudge((this.speed*sin(this.dir)),0,(this.speed*cos(this.dir)));
		//console.log(this.dir);

		if (this.object.getZ() > 2) {
			this.object.setZ(-2);
		}
		if (this.object.getZ() < -2) {
			this.object.setZ(2);
		}
		if (this.object.getX() > 3) {
			this.object.setX(-3);
		}
		if (this.object.getX() < -3) {
			this.object.setX(3);
		}
	}

	this.accelerate = function() {
		this.speed += this.acc;
	}

	this.decelerate = function() {
		//this.speed -= this.dec;
	}

	this.turnLeft = function() {
		console.log("Turning Left");
		this.dir += this.turn*(this.speed/this.max);
	}

	this.turnRight = function() {
		console.log("Turning Right");
		this.dir -= this.turn*(this.speed/this.max);
	}
}
