var buttonTouch;
var muteButton;

var gameOverState = {
	create: function() {
		// Black background
		game.add.image(0, 0, "black");

		// Button sound
		buttonTouch = game.add.audio("buttonTouch");

		// Mute button
		muteButton = game.add.button(0, 0, "mute", toggleSound, this);
		muteButton.input.useHandCursor = true;
		if (game.sound.mute) {
			muteButton.frame = 1;
		}
		muteButton.x = game.width / 2 - muteButton.width / 2;
		muteButton.y = game.world.height + 60;

		// Buttons
		// var moreGames = game.add.button(450, 245, 'mg', playMoreGames)
		// moreGames.input.useHandCursor = true;
		var home = game.add.button(560, 245, "home", goToMenu);
		home.input.useHandCursor = true;
		var tryAgain = game.add.button(670, 245, "again", playAgain);
		tryAgain.input.useHandCursor = true;

		// Tween buttons
		// game.add.tween(moreGames).to({ x: 50 }, 1000).easing(Phaser.Easing.Bounce.Out).start();
		game.add
			.tween(home)
			.to({ x: 100 }, 1000)
			.easing(Phaser.Easing.Bounce.Out)
			.start();
		game.add
			.tween(tryAgain)
			.to({ x: 210 }, 1000)
			.easing(Phaser.Easing.Bounce.Out)
			.start();

		// Game over text
		var nameLabel = game.add.text(game.world.centerX, -50, "Game over", { font: "70px Arial", fill: "#ffff00" });
		nameLabel.anchor.setTo(0.5, 0.5);
		nameLabel.stroke = "#000000";
		nameLabel.strokeThickness = 4;

		// Tween game over text
		game.add
			.tween(nameLabel)
			.to({ y: 125 }, 1000)
			.easing(Phaser.Easing.Bounce.Out)
			.start();

		// Update best score
		if (!localStorage.getItem("bestScore")) {
			localStorage.setItem("bestScore", 0);
		}

		if (game.global.score > localStorage.getItem("bestScore")) {
			localStorage.setItem("bestScore", game.global.score);
		}

		// Display score text and best score text
		var text = "score: " + game.global.score + "       best: " + localStorage.getItem("bestScore");

		var scoreLabel = game.add.text(game.world.centerX, game.world.height + 30, text, { font: "28px Arial", fill: "#ffff00", align: "center" });

		scoreLabel.anchor.setTo(0.5, 0.5);
		scoreLabel.stroke = "#000000";
		scoreLabel.strokeThickness = 3;

		// Tween score and mute button
		game.add
			.tween(scoreLabel)
			.to({ y: game.world.centerY + 115 }, 1000)
			.easing(Phaser.Easing.Bounce.Out)
			.start();

		game.add
			.tween(muteButton)
			.to({ y: 460 }, 1000)
			.easing(Phaser.Easing.Bounce.Out)
			.start();
	},
};

function goToMenu() {
	buttonTouch.play();
	game.state.start("menu");
}

function playAgain() {
	buttonTouch.play();
	game.state.start("level1");
}

function playMoreGames() {
	buttonTouch.play();
	// window.location.href = "";
}

function toggleSound() {
	buttonTouch.play();

	// Sound on/off
	game.sound.mute = !game.sound.mute;
	muteButton.frame = game.sound.mute ? 1 : 0;
}
