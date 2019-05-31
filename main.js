var drones = [];

function setup() {
  dt = 0.02;
  frameRate(50);
  g = createVector(0.0, 20.0) // gravity
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  let num = 5;
  for (let i = 0; i < num; i++) {
    let offset = W * ((i+1)/(num+1))
    drones.push(new Drone(createVector(offset, random(1)*H-10)));
  }
}

function draw() {
  background(230);
  stroke(0, 0, 200);
  line(0, H/2, W, H/2);
  for (let i = 0; i < drones.length; i++) {
    drones[i].update();
    drones[i].display();
  }
}

class Drone {

  constructor(pos) {
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.mass = 1.0; // kg
    this.thrust = 0.0; // N
    this.altitude = 0.0;
    this.target = H/2;
    this.KP = 0.15;
    this.KI = 0.00025;
    this.KD = 25.0;
    this.integral = 0.0;
    this.prevError = this.target - this.altitude;
  }


  calcForce() {
    let error = this.target - this.altitude;
    this.integral += error;
    let derivative = error - this.prevError;
    this.prevError = error;
    this.thrust = this.KP * error + this.KI * this.integral + this.KD * derivative;
    if (this.thrust < 0.0) { this.thrust = 0.0; }
    if (this.thrust > g.mag()*2) { this.thrust = g.mag()*2}
 }

  calcAccel() {
    let accel = createVector(0, 0);
    accel.add(g);
    this.calcForce();
    let force = this.thrust / this.mass;
    let F = createVector(0.0, -force);
    accel.add(F)
    return accel;
  }

  update() {
    let accel = this.calcAccel();
    accel.mult(dt);
    this.vel.add(accel);
    let vel = this.vel.copy();
    vel.mult(dt);
    this.pos.add(vel);
    if (this.pos.y > H-10) {
      this.pos.y = H-10;
      this.vel.y = 0.0;
    }
    this.altitude = H - this.pos.y;
  }

  display() {
    fill(0);
    rect(this.pos.x, this.pos.y, 10, 10);
  }

}
