$(document).ready(function() {
	var oMain = new CMain({
		scope_accelleration: 2, //SCOPE ACCELLERATION
		scope_friction: 0.85, //SCOPE FRICTION
		max_scope_speed: 40, //MAXIMUM SCOPE SPEED
		num_bullets: 3, //NUMBER OF PLAYER BULLETS FOR EACH SHOT LEVEL
		hit_score: 100, //POINTS GAINED WHEN DUCK IS HITTEN
		bonus_time: 4000, //BONUS TIME IN MILLISECONDS
		lives: 4, //NUMBER OF PLAYER LIVES
		duck_increase_speed: 0.5, //INCREASE THIS VALUE TO SPEED UP DUCKS AFTER EACH LEVEL SHOT
		duck_occurence: [
			1, //NUMBER OF DUCKS IN SHOT 1
			1, //NUMBER OF DUCKS IN SHOT 2
			1, //NUMBER OF DUCKS IN SHOT 3
			1, //NUMBER OF DUCKS IN SHOT 4
			1, //NUMBER OF DUCKS IN SHOT 5
			2, //NUMBER OF DUCKS IN SHOT 6
			2, //NUMBER OF DUCKS IN SHOT 7
			2, //NUMBER OF DUCKS IN SHOT 8
			2, //NUMBER OF DUCKS IN SHOT 9
			3, //NUMBER OF DUCKS IN SHOT 10
			//ADD NEW DUCK OCCURENCE HERE IF YOU NEED...
		],
	});

	$(oMain).on("game_start", function(evt) {
		//alert("game_start");
	});

	$(oMain).on("save_score", function(evt, iScore) {
		//alert("iScore: "+iScore);
	});

	$(oMain).on("restart", function(evt) {
		//alert("restart");
	});
});
