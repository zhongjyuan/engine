var bootState = {
	preload: function() {
		game.load.image("progressBar", "../../image/progressBar.png");
	},

	create: function() {
		game.stage.backgroundColor = "#000000";
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// If playing on mobile
		if (!game.device.desktop) {
			game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

			document.body.style.backgroundColor = "#000000";

			game.scale.minWidth = 200;
			game.scale.minHeight = 300;
			game.scale.maxWidth = 1000;
			game.scale.maxHeight = 1500;

			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;

			//game.scale.setScreenSize(true);
			game.scale.refresh();

			// Only portrait mode
			this.scale.forceOrientation(false, true);
			this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
			this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
		}

		game.state.start("Loading");
	},

	// Manage device rotation, play only in portrait mode
	enterIncorrectOrientation: function() {
		game.orientated = false;
		document.getElementById("orientation").style.display = "block";
	},

	leaveIncorrectOrientation: function() {
		game.orientated = true;
		document.getElementById("orientation").style.display = "none";
	},
};
