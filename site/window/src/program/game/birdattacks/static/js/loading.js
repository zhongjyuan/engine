var loading = {
	preload: function() {
		// Loading text
		var loadingLabel = game.add.text(game.world.centerX, 150, "...please wait...", { font: "30px Arial", fill: "#ffffff" });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Preloader
		var progressBar = game.add.sprite(game.world.centerX, 200, "progressBar");
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		// Title
		game.load.image("birdAttack", "image/birdAttack.png");

		// Particles
		game.load.image("pixel", "image/pixel.png");
		game.load.image("pixelRed", "image/pixelRed.png");
		game.load.image("pixelOrange", "image/pixelOrange.png");

		// Buttons
		game.load.spritesheet("mute", "image/onoff.png", 64, 61);
		game.load.image("mobGames", "image/mobGames.png");
		game.load.image("buttonStart1", "image/startButton.png");
		game.load.image("home", "image/home.png");
		game.load.image("again", "image/again.png");
		game.load.image("mg", "image/mg.png");

		game.load.image("instructions", "image/instructions.png");

		// Game over
		game.load.image("black", "image/black.png");

		// Bg objects
		game.load.image("background", "image/background.png");
		game.load.image("menuBg", "image/bgMenu.png");

		// Player's body rectangle
		game.load.image("playersBody", "image/playersBody.png");

		//Protection
		game.load.image("protection", "image/bubble.png");

		// Sprite sheets
		game.load.spritesheet("dude", "image/yellow_bird_4.png", 80, 54);
		game.load.spritesheet("grumpy", "image/grumpy.png", 50, 51);
		game.load.spritesheet("dragon_sheet", "image/dragon_sheet.png", 69, 50);
		game.load.spritesheet("powerUp", "image/powerUp.png", 40, 41);
		game.load.spritesheet("coin", "image/coin_sheet.png", 40, 40);

		game.load.image("dragonComing", "image/dragonComing.png");
		game.load.image("dragonComingR", "image/dragonComingR.png");
		game.load.image("grumpyComing", "image/grumpyComing.png");
		game.load.image("grumpyComingR", "image/grumpyComingR.png");

		// Audio
		game.load.audio("touchSound", ["../../media/audio/touchSound.mp3", "touchSound.ogg"]);

		game.load.audio("bird1", ["../../media/audio/bird1.mp3", "../../media/audio/bird1.ogg"]);
		game.load.audio("bird2", ["../../media/audio/bird2.mp3", "../../media/audio/bird2.ogg"]);
		game.load.audio("kickEnemy1", ["../../media/audio/kickEnemy.mp3", "../../media/audio/kickEnemy.ogg"]);
		game.load.audio("kickEnemy2", ["../../media/audio/kickEnemy2.mp3", "../../media/audio/kickEnemy2.ogg"]);
		game.load.audio("coinSound", ["../../media/audio/coinSound.mp3", "coinSound.ogg"]);
		game.load.audio("powerUpSound", ["../../media/audio/powerUpSound.mp3", "powerUpSound.ogg"]);
		game.load.audio("onGroundSound", ["../../media/audio/onGroundSound.mp3", "onGroundSound.ogg"]);
		game.load.audio("attack", ["../../media/audio/attack.mp3", "attack.ogg"]);
		game.load.audio("buttonTouch", ["../../media/audio/touch3.mp3", "touch3.ogg"]);
		game.load.audio("music1", ["../../media/audio/music1.mp3", "../../media/audio/music1.ogg"]);
	},
	create: function() {
		// After loading, show main menu
		game.state.start("menu");
	},
};
