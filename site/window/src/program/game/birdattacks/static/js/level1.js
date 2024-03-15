// Boolean
var gameStarted; // when start flying
var canJumpWithArrows;
var alive;
var playerOnGround;
var protected; // if collect power up
var biggerEnemies;

// Timer
var timer;
var powerTimer;

// Score
var scoreText;
var protectionText;

// Player
var player;
var playersBody;
var protection;

// Instructions
var instructions;

// Items
var powerUp;
var coin;
var powerUpIcon; // top right

// Number
var timerCount;
var powerTimerCount;
var currentItemsPos; // current position of an item on y axis

var xPosition; // position of enemy on x axis
var yPosition; // position of enemy on y axis

var createdItems; // the number of items (coin or power up), when the game start, one coin is created

// Enemies
var grumpy;
var grumpy2;
var grumpy3;
var grumpy4;
var dragon;

// These will show the next enemy
var grumpyComingR;
var grumpyComingL;

// Groups
var enemyGroup;
var enemiesComing; // showing next enemies
var effect; // +10

// Sounds
var touchSound;
var bird1;
var bird2;
var attack;
var powerUpSound;
var coinSound;
var onGroundSound;
var kickEnemy1;
var kickEnemy2;

var state1 = {
	create: function() {
		// Arrow keys controls
		cursors = game.input.keyboard.createCursorKeys();

		// If UP arrow has been released
		game.input.keyboard.onUpCallback = function(e) {
			if (e.keyCode == 38) {
				// You can use arrow again to jump/fly
				canJumpWithArrows = true;
			}
		};

		// Initialize variables
		gameStarted = false;
		canJumpWithArrows = true;
		playerOnGround = false;
		protected = false;
		biggerEnemies = false;
		timerCount = 0;
		powerTimerCount = 0;
		createdItems = 1;
		alive = true;

		// Touch screen or mouse click controls
		game.input.onDown.add(jumpPlayer, this);

		//  Background and bg tiles
		game.add.sprite(0, 0, "background");

		// The player sprite (x position, y position, spritesheet)
		player = game.add.sprite(0, 490, "dude");

		// This will act like player's body (used for collision detection)
		playersBody = game.add.sprite(0, 100, "playersBody");
		// Change alpha to 1 to see this object
		playersBody.alpha = 0;

		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(playersBody);

		//  This adjusts the collision body size to be a 100x50 box
		player.body.setSize(60, 38, 8, 3);

		// Stop the player for now
		player.body.gravity.y = 0;

		// Scale the player
		player.scale.x = 0.7;
		player.scale.y = 0.8;

		// Set player's position
		player.x = game.width / 2 - player.width / 2; // center the player
		playersBody.x = game.width / 2 - player.width / 2; // center the player

		//  Player's animation
		player.animations.add("flying", [0, 1, 2, 3], 16, false);

		// Protection
		protection = game.add.sprite(0, 200, "protection");

		// The first coin to collect
		coin = game.add.sprite(0, 90, "coin");
		coin.scale.x = 0.9;
		coin.scale.y = 0.9;
		coin.x = game.width / 2 - coin.width / 2;
		game.physics.arcade.enable(coin);
		coin.animations.add("coinAni", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 9, false);
		// Play this animation for the first time
		coin.animations.play("coinAni");

		// Current y position of item is 200
		currentItemsPos = 200;

		// Create new group and put first item into it
		items = game.add.group();
		items.add(coin);

		// Effects group
		effects = game.add.group();

		// Set a timer, every 2.4 seconds run the function createEnemyBird
		timer = game.time.create(false);
		timer.loop(2400, createEnemyBird, this);

		//loop = timer.loop(2500, createEnemyBird, this);

		// Enemy group
		enemyGroup = game.add.group();
		enemiesComing = game.add.group();

		// Create particles
		poEffect = game.add.emitter(0, 0, 10);
		// Set the 'pixel' image for the particles
		poEffect.makeParticles("pixel");

		// Set the y speed of the particles between -100 and 100
		// The speed will be randomly picked between -100 and 100 for each 		particle
		poEffect.setYSpeed(-100, 100);

		// Do the same for the x speed
		poEffect.setXSpeed(-100, 100);

		// Use no gravity for the particles
		poEffect.gravity = 0;

		// Coin effect
		coinEffect = game.add.emitter(0, 0, 10);
		// Set the 'pixel' image for the particles
		coinEffect.makeParticles("pixelOrange");
		coinEffect.setYSpeed(-100, 100);
		coinEffect.setXSpeed(-100, 100);
		coinEffect.gravity = 0;

		// Instruction
		instructions = game.add.sprite(30, 150, "instructions");

		// Create text
		game.global.score = 0;

		scoreText = game.add.text(20, 10, "score: " + game.global.score);
		scoreText.fontSize = 28;
		scoreText.fontWeight = "bold";
		scoreText.stroke = "#ffffff";
		scoreText.strokeThickness = 4;
		scoreText.fill = "#336666";

		// Protection text
		protectionText = game.add.text(331, 15, "10");
		protectionText.fontSize = 28;
		protectionText.fontWeight = "bold";
		protectionText.stroke = "#ffffff";
		protectionText.strokeThickness = 4;
		protectionText.fill = "#336666";
		protectionText.visible = false;

		// Protection icon
		powerUpIcon = game.add.sprite(310, 10, "protection");
		powerUpIcon.scale.x = 0.7;
		powerUpIcon.scale.y = 0.7;
		powerUpIcon.visible = false;

		// Create sounds
		touchSound = game.add.audio("touchSound");
		powerUpSound = game.add.audio("powerUpSound");
		coinSound = game.add.audio("coinSound");
		onGroundSound = game.add.audio("onGroundSound");
		attack = game.add.audio("attack");
		bird1 = game.add.audio("bird1");
		bird2 = game.add.audio("bird2");
		kickEnemy1 = game.add.audio("kickEnemy1");
		kickEnemy2 = game.add.audio("kickEnemy2");
	},

	update: function() {
		// If player touching a power-up
		game.physics.arcade.overlap(player, powerUp, collectPowerup, null, this);

		// If player touching a coin
		game.physics.arcade.overlap(player, coin, collectCoin, null, this);

		// If enemy bird touching it's "silhouette", remove "silhouette"
		game.physics.arcade.overlap(enemyGroup, enemiesComing, collisionHandler, null, this);

		// Prevent moving silhouette
		for (var i = 0; i < enemiesComing.children.length; i++) {
			enemiesComing.children[i].body.velocity.x = 0;
		}

		// Remove "+10" if it's alpha is 0
		for (i = 0; i < effects.children.length; i++) {
			if (effects.children[i].alpha == 0) {
				effects.children[i].destroy();
			}
		}

		// PlayersBody rectangle
		playersBody.body.x = player.body.x;
		playersBody.body.y = player.body.y;

		// If the player is protected
		if (protected) {
			protection.visible = true;
		} else {
			protection.visible = false;
		}
		protection.x = player.x - 11;
		protection.y = player.y - 8;

		// This is Y position for new item (coin, power-up) that will be created below
		// This will help us create a new item that is not too close to the previous one
		if (createdItems % 2 == 0) {
			currentItemsPos = game.rnd.integerInRange(20, game.height / 2 - 60);
		} else {
			currentItemsPos = game.rnd.integerInRange(game.height / 2, 430);
		}

		// Create new items to collect
		// Only if there is no item on the screen, create new one
		if (items.children.length == 0) {
			// Increse the number of create items
			createdItems += 1;

			// Choose a number between 1 and 10
			var randomItem = game.rnd.integerInRange(1, 10);

			// if random number is 10, create power up
			// only if the player is not yet protected
			// and if wave is less than 17
			if (protected == false && randomItem == 10 && timerCount < 17) {
				powerUp = game.add.sprite(0, currentItemsPos, "powerUp");
				powerUp.x = game.width / 2 - powerUp.width / 2;
				game.physics.arcade.enable(powerUp);

				// Create an animation
				powerUp.animations.add("power", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 9, false);

				// make it a little smaller
				powerUp.scale.x = 0.9;
				powerUp.scale.y = 0.9;

				// Play this animation for the first time
				powerUp.animations.play("power");

				// Insert into group
				items.add(powerUp);
			} // create coin
			else {
				coin = game.add.sprite(0, currentItemsPos, "coin");
				coin.scale.x = 0.9;
				coin.scale.y = 0.9;
				coin.x = game.width / 2 - coin.width / 2;
				game.physics.arcade.enable(coin);
				coin.animations.add("coinAni", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 9, false);
				// Play this animation for the first time
				coin.animations.play("coinAni");

				items.add(coin);
			}
		}

		//game.debug.body(player);

		// Enemy group
		for (var i = 0; i < enemyGroup.children.length; i++) {
			// If player touching an enemy
			game.physics.arcade.overlap(player, enemyGroup.children[i], hitEnemy, null, this);

			// Uncomment this if you want to see enemy's box
			//game.debug.body(enemyGroup.children[i]);

			// enemies that coming from the left, will be bigger now
			if (biggerEnemies == true) {
				if (enemyGroup.children[i].vx == 250) {
					enemyGroup.children[i].scale.setTo(1.4, 1.4);
				}
			}

			// move enemies
			enemyGroup.children[i].body.velocity.x = enemyGroup.children[i].vx;

			// rotate (dead) enemeis
			enemyGroup.children[i].body.rotation += enemyGroup.children[i].r;
		}

		// Limit player's position
		if (player.body.y <= 0) {
			player.body.velocity.y = 20;
		}
		// If alive and y position is greater than 490
		if (alive && player.body.y >= 490) {
			// stop the player
			player.body.velocity.y = 0;
			player.body.y = 490;

			if (playerOnGround == false && timerCount > 0) {
				// play the sound
				onGroundSound.play();
				playerOnGround = true;
			}
		}
		// If the player is dead
		else if (alive == false && player.body.y >= 530) {
			// stop the player
			player.body.velocity.y = 0;
			player.body.y = 530;
		}

		// Call movePlayer function
		movePlayer();
	},
};

// When UP arrow is down
function movePlayer() {
	if (cursors.up.isDown && canJumpWithArrows) {
		jumpPlayer();
		canJumpWithArrows = false;
	}
}

// Function on mouse click or touch screen
function jumpPlayer() {
	// Start flying and start enemies (once)
	if (gameStarted == false) {
		gameStarted = true;

		// start timer
		timer.start();

		// hide instructions
		var tween = game.add.tween(instructions);
		tween.to({ alpha: 0 }, 200, Phaser.Easing.Linear.None);
		tween.onComplete.add(function() {
			instructions.destroy();
		});
		tween.start();
	}

	// Player is flying and he is not on the ground
	playerOnGround = false;

	// If power up exist, play it's animation on tap (click)
	if (powerUp) {
		powerUp.animations.play("power");
	}

	// set gravity
	player.body.gravity.y = 620;

	touchSound.play();
	player.body.velocity.y = -330;

	player.animations.play("flying");

	// play sound
	var randomValue = game.rnd.integerInRange(1, 3);
}

// Create new enemy function
function createEnemyBird() {
	// Timer count
	timerCount++;

	// After wave 13, make some enemies bigger
	if (timerCount >= 14) {
		biggerEnemies = true;
	}
	// Now enemies appear faster
	else if (timerCount >= 18) {
		// recreate timer
		timer.stop();
		timer = game.time.create(false);
		timer.loop(2000, createEnemyBird, this);
		timer.start();
	}

	// If timer count is less than 5, create only one enemy, grumpy
	if (timerCount < 4) {
		// Create new enemy
		grumpy = game.add.sprite(99, 99, "grumpy");

		// Play sound
		bird1.play();

		// Random position for the enemy
		xPosition = game.rnd.integerInRange(1, 2);
		yPosition = game.rnd.integerInRange(20, 480);

		grumpy.y = yPosition;

		// Put this enemy on the left side
		if (xPosition == 1) {
			grumpy.x = -250;
			grumpy.vx = 250; // vx is the speed of the enemy

			// This will show where are enemies coming from
			showLeftGrumpy();
		}
		// Put this enemy on the right side
		else {
			grumpy.x = game.width + 250;
			grumpy.vx = -250;
			grumpy.scale.x = -1; // flip the enemy horizontally

			showRightGrumpy();
		}

		// Create and play animation
		grumpy.animations.add("grumpyFlying", [0, 1, 2, 3], 14, true);
		grumpy.animations.play("grumpyFlying");

		// Grumpy's physics
		game.physics.arcade.enable(grumpy);

		grumpy.dead = false;
		grumpy.r = 0;

		// If grumpy is flipped, we need to 'flip' it's body too,
		// Once you use grumpy.scale.x = -1, it will flip image only but not the body
		if (grumpy.vx == -250) {
			//grumpy.body.setSize(47, 51, -47, 0);
		}

		// Add new enemy to the group
		enemyGroup.add(grumpy);
	}
	// If timer count is equal or greater than five, create 2 enemies
	else if (timerCount >= 4 && timerCount < 9) {
		// Choose random enemy
		var randomEnemy = game.rnd.integerInRange(1, 2);

		// Random y position
		yPosition = game.rnd.integerInRange(20, game.height / 2 - 20);

		// First enemy
		if (randomEnemy == 1) {
			grumpy = game.add.sprite(99, 99, "grumpy");
			// Create and play animation
			grumpy.animations.add("grumpyFlying", [0, 1, 2, 3], 9, true);
			grumpy.animations.play("grumpyFlying");
			// Play sound
			bird1.play();

			showLeftGrumpy();
		} else {
			grumpy = game.add.sprite(99, 99, "dragon_sheet");
			grumpy.animations.add("dragonFlying", [0, 1, 2], 9, true);
			grumpy.animations.play("dragonFlying");
			// Play sound
			bird2.play();

			showLeftDragon();
		}

		grumpy.y = yPosition;

		// First  enemy goes to the left side
		grumpy.x = -200;
		grumpy.vx = 250;

		// First enemy
		game.physics.arcade.enable(grumpy);

		// Second enemy
		randomEnemy = game.rnd.integerInRange(1, 2);

		// Random y position
		yPosition = game.rnd.integerInRange(game.height / 2 + 20, game.height - 120);

		if (randomEnemy == 1) {
			grumpy2 = game.add.sprite(99, 99, "grumpy");
			// Create and play animation
			grumpy2.animations.add("grumpyFlying", [0, 1, 2, 3], 9, true);
			grumpy2.animations.play("grumpyFlying");

			grumpy2.x = game.width + 250;
			grumpy2.vx = -250;
			game.physics.arcade.enable(grumpy2);

			grumpy2.scale.x = -1;
			//grumpy2.body.setSize(47, 51, -47, 0);

			showRightGrumpy();
		} else {
			grumpy2 = game.add.sprite(99, 99, "dragon_sheet");
			grumpy2.animations.add("dragonFlying", [0, 1, 2, 3], 9, true);
			grumpy2.animations.play("dragonFlying");

			grumpy2.x = game.width + 250;
			grumpy2.vx = -250;
			game.physics.arcade.enable(grumpy2);

			grumpy2.scale.x = -1;
			//grumpy2.body.setSize(69, 50, -69, 0);

			showRightDragon();
		}

		//var yPosition2 = game.rnd.integerInRange(game.height/2 + 20, game.height-120);
		grumpy2.y = yPosition;

		grumpy.dead = false;
		grumpy.r = 0;
		grumpy2.dead = false;
		grumpy2.r = 0;

		// Add new enemy to the group
		enemyGroup.add(grumpy);
		enemyGroup.add(grumpy2);
	}
	// if timer count is equal or greater than 10, create 3 enemies
	else if (timerCount >= 9) {
		// Grumpy
		grumpy = game.add.sprite(99, 99, "grumpy");
		// Random position for the enemy
		yPosition = game.rnd.integerInRange(game.height / 2 + 20, game.height - 120);

		grumpy.x = -200;
		grumpy.vx = 250;
		grumpy.y = yPosition;

		// Where are they coming from
		showLeftGrumpy();

		// Dragon
		grumpy2 = game.add.sprite(99, 99, "dragon_sheet");
		yPosition = game.rnd.integerInRange(20, game.height / 2 - 20);

		grumpy2.y = yPosition;
		grumpy2.x = -200;
		grumpy2.vx = 250;

		// Where are they coming from
		showLeftDragon();

		// Grumpy's physics
		game.physics.arcade.enable(grumpy);
		game.physics.arcade.enable(grumpy2);

		// Create and play animations
		grumpy.animations.add("grumpyFlying", [0, 3], 9, true);
		grumpy.animations.play("grumpyFlying");
		grumpy2.animations.add("dragonFlying", [0, 3], 9, true);
		grumpy2.animations.play("dragonFlying");

		// Random enemy
		randomEnemy = game.rnd.integerInRange(1, 2);

		yPosition = game.rnd.integerInRange(20, game.height - 120);

		if (randomEnemy == 1) {
			grumpy3 = game.add.sprite(199, 199, "grumpy");
			// Create and play animation
			grumpy3.animations.add("grumpyFlying", [0, 1, 2, 3], 9, true);
			grumpy3.animations.play("grumpyFlying");

			game.physics.arcade.enable(grumpy3);
			grumpy3.scale.x = -1;
			//grumpy3.body.setSize(47, 51, -47, 0);

			// Play sound
			bird1.play();

			showRightGrumpy();
		} else {
			grumpy3 = game.add.sprite(199, 199, "dragon_sheet");
			grumpy3.animations.add("dragonFlying", [0, 1, 2, 3], 9, true);
			grumpy3.animations.play("dragonFlying");

			game.physics.arcade.enable(grumpy3);
			grumpy3.scale.x = -1;
			//grumpy3.body.setSize(69, 50, -69, 0);

			// Play sound
			bird2.play();

			showRightDragon();
		}

		// This enemy coming from the right side
		grumpy3.x = game.width + 250;
		grumpy3.vx = -250;

		//var yPosition3 = game.rnd.integerInRange(20,480);

		grumpy3.y = yPosition;

		grumpy.dead = false;
		grumpy2.dead = false;
		grumpy3.dead = false;
		grumpy.r = 0;
		grumpy2.r = 0;
		grumpy3.r = 0;

		// Add new enemy to the group
		enemyGroup.add(grumpy);
		enemyGroup.add(grumpy2);
		enemyGroup.add(grumpy3);
	}
}

// Collect power up
function collectPowerup(player, item) {
	if (alive) {
		// Set the position of the emitter
		poEffect.x = item.x + item.width / 2;
		poEffect.y = item.y + item.width / 2;

		// Start the emitter, by exploding 16 particles that will live for 600ms
		poEffect.start(true, 600, null, 16);

		// remove power up
		item.destroy();

		// play sound
		powerUpSound.play();

		// the player is protected for 10 seconds
		protected = true;
		protectionText.visible = true;
		protectionText.text = 10;
		powerUpIcon.visible = true;

		// start new timer
		powerTimer = game.time.create(false);
		powerTimer.loop(1000, playerProtected, this);
		powerTimer.start();

		//  Add and update the score
		game.global.score += 10;
		scoreText.text = "score: " + game.global.score;
	}
}

// Collect coin
function collectCoin(player, item) {
	if (alive) {
		// Set the position of the emitter
		coinEffect.x = item.x + item.width / 2;
		coinEffect.y = item.y + item.width / 2;

		// Start the emitter, by exploding 16 particles that will live for 600ms
		coinEffect.start(true, 600, null, 16);

		// remove power up
		item.destroy();

		// play sound
		coinSound.play();

		//  Add and update the score
		game.global.score += 5;
		scoreText.text = "score: " + game.global.score;
	}
}

// When player hits an enemy, run this function
var hitEnemy = function(thePlayer, bird) {
	// Game over, if the player is not protected
	if (alive && protected == false) {
		attack.play();
		player.scale.y = -1;
		alive = false;

		// remove touch (click) and UP arrow controls,
		// The game is over and you can't fly anymore
		game.input.onDown.remove(jumpPlayer, this);
		game.input.keyboard.removeKey(Phaser.Keyboard.UP);

		// stop timer that create enemies
		timer.destroy();

		// SHow game over screen
		game.state.start("game_over", false);
	}
	// if the player is protected, kill enemy
	else if (protected) {
		if (bird.dead == false) {
			bird.vx = 0;
			bird.body.velocity.x = 0;

			if (player.body.x >= bird.body.x) {
				bird.vx = -150;
			} else {
				bird.vx = 150;
			}

			// Set rotation and velocity, stop animation
			bird.animations.stop();
			bird.r = 4;
			bird.body.velocity.y = 250;
			bird.dead = true;

			// increase score
			game.global.score += 10;

			// show +10 text and tween it
			var ss = game.add.text(bird.x, bird.y - 20, "+10");
			ss.fontSize = 22;
			ss.fontWeight = "bold";
			ss.stroke = "#ffffff";
			ss.strokeThickness = 4;
			ss.fill = "#f68e56";

			var tween = game.add.tween(ss).to({ y: ss.y - 50, alpha: 0 }, 700, Phaser.Easing.Linear.Out, true, 0, 0, false);
			effects.add(ss);

			// play sound, if createItems number is odd or even
			if (createdItems % 2 == 0) {
				kickEnemy1.play();
			} else {
				kickEnemy2.play();
			}
		}
	}
};

// Player protected
function playerProtected() {
	powerTimerCount += 1;

	// update protection text
	protectionText.text = 10 - powerTimerCount;

	// remove protection and destroy timer after 10 seconds
	if (powerTimerCount >= 10) {
		// reset powerTimerCound
		powerTimerCount = 0;

		protected = false;
		powerTimer.destroy();

		protectionText.visible = false;
		powerUpIcon.visible = false;
	}
}

// Remove sprite
function collisionHandler(realEnemy, enemyComing) {
	enemyComing.destroy();
}

// SHow left grumpy
function showLeftGrumpy() {
	grumpyComing = game.add.sprite(0, yPosition, "grumpyComing");
	grumpyComing.anchor.setTo(0.5, 0);
	grumpyComing.x = grumpyComing.width / 2;
	game.physics.arcade.enable(grumpyComing);
	grumpyComing.alpha = 0.6;
	enemiesComing.add(grumpyComing);

	// tween sprite
	var tween = game.add.tween(grumpyComing.scale).to({ x: 0.7, y: 0.7 }, 300, Phaser.Easing.Linear.None, true, 0, 4, true);
}

// SHow left grumpy
function showRightGrumpy() {
	// This will show where are enemies coming from
	grumpyComing = game.add.sprite(0, yPosition, "grumpyComingR");
	grumpyComing.anchor.setTo(0.5, 0);
	//grumpyComing.x = game.world.width - 55;
	grumpyComing.x = game.world.width - grumpyComing.width / 2;
	game.physics.arcade.enable(grumpyComing);
	grumpyComing.alpha = 0.6;
	enemiesComing.add(grumpyComing);

	// tween sprite
	tween = game.add.tween(grumpyComing.scale).to({ x: 0.7, y: 0.7 }, 300, Phaser.Easing.Linear.None, true, 0, 4, true);
}

// SHow right dragon
function showRightDragon() {
	// This will show where are enemies coming from
	grumpyComing = game.add.sprite(0, yPosition, "dragonComingR");
	grumpyComing.anchor.setTo(0.5, 0);
	//grumpyComing.x = game.world.width - 55;
	grumpyComing.x = game.world.width - grumpyComing.width / 2;
	game.physics.arcade.enable(grumpyComing);
	grumpyComing.alpha = 0.6;
	enemiesComing.add(grumpyComing);

	// tween sprite
	tween = game.add.tween(grumpyComing.scale).to({ x: 0.7, y: 0.7 }, 300, Phaser.Easing.Linear.None, true, 0, 4, true);
}

// Show left dragon
function showLeftDragon() {
	// This will show where are enemies coming from
	grumpyComing = game.add.sprite(0, yPosition, "dragonComing");
	grumpyComing.anchor.setTo(0.5, 0);
	grumpyComing.x = grumpyComing.width / 2;
	game.physics.arcade.enable(grumpyComing);
	grumpyComing.alpha = 0.6;
	enemiesComing.add(grumpyComing);

	// tween sprite
	tween = game.add.tween(grumpyComing.scale).to({ x: 0.7, y: 0.7 }, 300, Phaser.Easing.Linear.None, true, 0, 4, true);
}
