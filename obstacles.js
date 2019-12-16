class Obstacle {
	constructor() {
		this.r = 50;
		this.x = 420;
		this.y = 340 - 50;
	}

	move() {
		this.x -= 4;
	}
	show() {
		fill(234, 234, 0);
		rect(this.x, this.y, this.r / 2, this.r);
	}

	byeBye(arr) {
		if (arr[0].x < -25) {
			arr.shift();
			return true;
		}
	}

	score(arr) {
		if (arr[0].x < 0) {
			return true;
		}
	}

	hit(agent) {
		let distance = dist(this.x + 5, this.y + 10, agent.x, agent.y);
		if (distance < this.r - 15) {
			return true;
		}
	}

	isDestroyed(bullet) {
		let distance = dist(this.x + 10, this.y, bullet.x, bullet.y);
		if (bullet.x === undefined) {
			return;
		}
		if (bullet.x < 50) {
			return false;
		}
		if (distance < this.r - 10) {
			return true;
		}
	}
	destroy(arr) {
		arr.shift();
	}
}
