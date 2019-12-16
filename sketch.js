let featureExtractor;
let classifier;
let video;
let loss;
let jumpImg = 0;
let stayImg = 0;
let shootImg = 0;
let gameCanvas;
let agent, obstacle, bullet;
let obstacles = [],
	bullets = [];
let count = 0;
let score = 0;
let j;
let frames = 50;
let play = false;
let ammo = 10;

function setup() {
	//Creating an instance of a Agent
	agent = new Agent(count);
	for (let i = 0; i < 10; i++) {
		bullets.push(new Bullet());
	}

	//this canvas where the game will be display
	gameCanvas = createCanvas(420, 340);
	gameCanvas.parent("gameCanvas");
	// Create a video label
	video = createCapture(VIDEO);
	video.parent("videoContainer");
	video.size(420, 340);

	// Extract the already learned features from MobileNet
	featureExtractor = ml5.featureExtractor("MobileNet", modelReady);

	// Create a new classifier using those features and give the video we want to use
	const options = { numLabels: 3 };
	classifier = featureExtractor.classification(video, options);
	// Set up the UI buttons
	setupButtons();
}

function action(result) {
	if (result == "Jump") {
		count++;
		if (agent.canJump(count)) {
			agent.jump();
		}
	} else if (result == "Shoot") {
		bullets[0].bullets();
		setTimeout(() => {
			bullets.shift();
		}, 1500);
	} else {
		return;
	}
}

function keyPressed() {
	if (key == " ") {
		count++;
		if (agent.canJump(count)) {
			agent.jump();
		}
	}

	if (key === "s") {
		if (bullets.length > 0) {
			bullets[0].bullets();
			setTimeout(() => {
				bullets.shift();
			}, 1500);
		} else {
			select("#ammo").html("NO MORE AMMO!");
		}
	}
}

function draw() {
	select("#ammo").html(`AMMO: ${bullets.length}`);
	background(100);
	if (play === true) {
		select("#score").html("SCORE: " + score++);

		if (agent.onGround()) {
			count = 0;
		}
		if (random(1) < 0.005) {
			obstacles.push(new Obstacle());
		}
		agent.show();
		agent.move();
		if (bullets.length === 0) {
			return;
		} else {
			bullets[0].show();
			if (bullets[0].bulletsLeft() === false) {
				bullets[0].shot();
			}
		}

		for (let o of obstacles) {
			o.show();
			o.move();
			o.byeBye(obstacles);
			if (o.hit(agent)) {
				noLoop();
				select("#gameOver").html("game over");
			}
			if (bullets.length === 0) {
				return;
			} else if (o.isDestroyed(bullets[0])) {
				o.destroy(obstacles);
			}
		}
	}
}
function reset() {
	select("#score").html("SCORE: " + 0);
	score = 0;
	bullets = [];
	obstacles = [];
	select("#gameOver").html("");
	loop();

	//Creating an instance of a Agent
	agent = new Agent(count);
	for (let i = 0; i < 10; i++) {
		bullets.push(new Bullet());
	}
	//this canvas where the game will be display
	gameCanvas = createCanvas(420, 340);
	gameCanvas.parent("gameCanvas");
}
function modelReady() {
	select("#status").html("MobileNet Loaded!");
}

// Classify the current frame
function classify() {
	classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
	// When the Cruz button is pressed, add the current frame
	// from the video with a label of "cruz" to the classifier
	buttonA = select("#jumpBtn");
	buttonA.mousePressed(function() {
		for (let i = 0; i < 250; i++) {
			classifier.addImage("Jump");
			select("#jumpAmount").html(jumpImg++);
		}
	});

	// When the Christine button is pressed, add the current frame
	// from the video with a label of "christine" to the classifier
	buttonB = select("#stayBtn");
	buttonB.mousePressed(function() {
		for (let i = 0; i < 250; i++) {
			classifier.addImage("Stay");
			select("#stayAmount").html(stayImg++);
		}
	});

	buttonC = select("#shootBtn");
	buttonC.mousePressed(function() {
		for (let i = 0; i < 250; i++) {
			classifier.addImage("Shoot");
			select("#shootAmount").html(shootImg++);
		}
	});

	playBtn = select("#play");
	playBtn.mousePressed(() => {
		play = true;
	});

	resetBtn = select("#reset");
	resetBtn.mousePressed(() => {
		reset();
	});

	// Train Button
	train = select("#train");
	train.mousePressed(function() {
		classifier.train(function(lossValue) {
			if (lossValue) {
				loss = lossValue;
				select("#loss").html("Done Training ! Final Loss: " + loss);
			}
		});
	});

	// Predict Button
	buttonPredict = select("#buttonPredict");
	buttonPredict.mousePressed(classify);
}

// Show the results
function gotResults(err, results) {
	// Display any error
	if (err) {
		console.error(err);
	}

	if (results && results[0]) {
		select("#result").html(results[0].label);
		action(results[0].label);
		select("#confidence").html(results[0].confidence.toFixed(2) * 100 + "%");
		classify();
	}
}
