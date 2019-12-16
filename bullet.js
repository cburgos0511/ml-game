class Bullet {
	constructor() {
		this.r = 5;
		this.x = 40;
		this.y = 330 - this.r;
		this.ammo = true;
	}

	show() {
		rect(this.x, this.y, this.r * 2, this.r);
	}

	shot() {
		this.x += 4;
	}

	bullets() {
		this.ammo = false;
	}
	bulletsLeft() {
		return this.ammo;
	}
}
