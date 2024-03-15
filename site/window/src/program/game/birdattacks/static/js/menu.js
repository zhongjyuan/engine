var buttonTouch;

var menuState = {
	create: function() {
		game.add.image(0, 0, "menuBg");

		// Button sound
		buttonTouch = game.add.audio("buttonTouch");

		if (!localStorage.getItem("bestScore")) {
			localStorage.setItem("bestScore", 0);
		}

		if (game.global.score > localStorage.getItem("bestScore")) {
			localStorage.setItem("bestScore", game.global.score);
		}

		// Play music
		if (game.global.musicPlaying == false) {
			// If you want to play music uncomment two lines below
			// music1 = game.add.audio('music1');
			// music1.play();
			game.global.musicPlaying = true;
		}

		var text;

		// Title
		var title = game.add.sprite(0, 30, "birdAttack");
		title.x = game.width / 2 - title.width / 2;

		var startLabel = game.add.text(game.world.centerX, game.world.height - 180, text, { font: "25px Arial", fill: "#ffffff" });
		startLabel.anchor.setTo(0.5, 0.5);

		game.add
			.tween(startLabel)
			.to({ angle: -2 }, 500)
			.to({ angle: 2 }, 500)
			.loop()
			.start();

		// Mob games button
		// this.mobGames = game.add.button(240, 300, 'mobGames', this.visitMobGames, this);
		// this.mobGames.input.useHandCursor = true;
		// this.mobGames.x = game.width / 2 - this.mobGames.width / 2;
		// this.mobGames.y = 370;

		// Mute button
		this.muteButton = game.add.button(0, 0, "mute", this.toggleSound, this);
		this.muteButton.input.useHandCursor = true;
		if (game.sound.mute) {
			this.muteButton.frame = 1;
		}
		this.muteButton.x = game.width / 2 - this.muteButton.width / 2;
		this.muteButton.y = 220;

		// Start button
		this.buttonStart = game.add.button(0, 0, "buttonStart1", this.startGame, this);
		this.buttonStart.x = game.width / 2 - this.buttonStart.width / 2;
		this.buttonStart.y = 290;
		this.buttonStart.input.useHandCursor = true;
	},

	startGame: function() {
		game.state.start("level1");
		buttonTouch.play();
	},

	visitMobGames: function() {
		buttonTouch.play();
		// window.location.href = "";
	},

	// Sound on off
	toggleSound: function() {
		buttonTouch.play();

		// Sound on/off
		game.sound.mute = !game.sound.mute;
		this.muteButton.frame = game.sound.mute ? 1 : 0;
	},
};
