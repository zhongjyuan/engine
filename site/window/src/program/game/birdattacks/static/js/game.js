ZHONGJYUANWIN.onReady(function() {
	var ZHONGJYUAN = parent.ZHONGJYUAN;
	ZHONGJYUANWIN.onEvent(function(eventData) {
		switch (eventData.event) {
			case ZHONGJYUAN.static.message.dataChangeEvent:
				if (eventData.from === 0) {
					//
				}
		}
	});
	var game = new Phaser.Game(400, 600, Phaser.AUTO, null);

	game.global = {
		// Global score
		score: 0,

		// Music playing
		musicPlaying: false,

		// Lock orientation, play only in portrait or landscape mode
		orientated: false,

		/** Select level screen, did not used in this game **/

		// number of thumbnail rows
		thumbRows: 3,
		// number of thumbnail cololumns
		thumbCols: 4,
		// width of a thumbnail, in pixels
		thumbWidth: 64,
		// height of a thumbnail, in pixels
		thumbHeight: 64,
		// space among thumbnails, in pixels
		thumbSpacing: 8,

		// array with finished levels and stars collected.
		// 0 = playable yet unfinished level
		// 1, 2, 3 = level finished with 1, 2, 3 stars
		// 4 = locked level
		starsArray: [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],

		// level currently playing
		level: 0,
	};

	// Game states
	game.state.add("boot", bootState);
	game.state.add("Loading", loading);
	game.state.add("menu", menuState);
	game.state.add("level1", state1);
	game.state.add("game_over", gameOverState);

	// Start boot state
	game.state.start("boot");
});
