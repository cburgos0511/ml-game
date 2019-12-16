class Agent {
	constructor() {
		this.r = 25;
		this.x = 25;
		this.y = 340 - this.r;
		this.vy = 0;
		this.gravity = 1.5;
	}

	jump() {
		this.vy = -20;
	}

	canJump(count) {
		if (count <= 1) {
			return true;
		} else {
			return false;
		}
	}
	onGround() {
		if (this.y === 340 - this.r) {
			return true;
		}
	}

	move() {
		this.y += this.vy;
		this.vy += this.gravity;
		this.y = constrain(this.y, 0, 340 - this.r);
	}

	show() {
		rect(this.x, this.y, this.r, this.r);
		fill(255);
	}
}
