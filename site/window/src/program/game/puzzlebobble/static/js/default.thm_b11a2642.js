window.skins = window.skins || {};
function __extends(d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() {
		this.constructor = d;
	}
	__.prototype = b.prototype;
	d.prototype = new __();
}
window.generateEUI = {};
generateEUI.paths = {};
generateEUI.styles = undefined;
generateEUI.skins = {};
generateEUI.paths["resource/mySkin/component/ComboEffectItem.exml"] = window.skins.ComboEffectItem = (function(_super) {
	__extends(ComboEffectItem, _super);
	function ComboEffectItem() {
		_super.call(this);
		this.skinParts = ["bl_combo"];

		this.elementsContent = [this._Image1_i(), this.bl_combo_i()];
		this.states = [
			new eui.State("blue", []),
			new eui.State("purple", [
				new eui.SetProperty("_Image1", "source", "combo_purple_png"),
				new eui.SetProperty("bl_combo", "font", "fnt_combo_pruple_fnt"),
			]),
		];
	}
	var _proto = ComboEffectItem.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "combo_blue_png";
		return t;
	};
	_proto.bl_combo_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_combo = t;
		t.font = "fnt_combo_blue_fnt";
		t.left = 81;
		t.rotation = 0.16;
		t.text = "122";
		return t;
	};
	return ComboEffectItem;
})(eui.Skin);
generateEUI.paths["resource/mySkin/component/LevelItem.exml"] = window.skins.LevelItem = (function(_super) {
	__extends(LevelItem, _super);
	var LevelItem$Skin1 = (function(_super) {
		__extends(LevelItem$Skin1, _super);
		function LevelItem$Skin1() {
			_super.call(this);
			this.skinParts = [];

			this.elementsContent = [this._Image1_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "star_noEmpty_s_png")]),
				new eui.State("disabled", []),
			];
		}
		var _proto = LevelItem$Skin1.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "star_empty_s_png";
			t.percentWidth = 100;
			return t;
		};
		return LevelItem$Skin1;
	})(eui.Skin);

	var LevelItem$Skin2 = (function(_super) {
		__extends(LevelItem$Skin2, _super);
		function LevelItem$Skin2() {
			_super.call(this);
			this.skinParts = [];

			this.elementsContent = [this._Image1_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "star_noEmpty_s_png")]),
				new eui.State("disabled", []),
			];
		}
		var _proto = LevelItem$Skin2.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "star_empty_s_png";
			t.percentWidth = 100;
			return t;
		};
		return LevelItem$Skin2;
	})(eui.Skin);

	var LevelItem$Skin3 = (function(_super) {
		__extends(LevelItem$Skin3, _super);
		function LevelItem$Skin3() {
			_super.call(this);
			this.skinParts = [];

			this.elementsContent = [this._Image1_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "star_noEmpty_s_png")]),
				new eui.State("disabled", []),
			];
		}
		var _proto = LevelItem$Skin3.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "star_empty_s_png";
			t.percentWidth = 100;
			return t;
		};
		return LevelItem$Skin3;
	})(eui.Skin);

	function LevelItem() {
		_super.call(this);
		this.skinParts = ["l_level", "tg_star_1", "tg_star_2", "tg_star_3"];

		this.currentState = "unlock";
		this.elementsContent = [this._Image1_i()];
		this.l_level_i();

		this.tg_star_1_i();

		this.tg_star_2_i();

		this.tg_star_3_i();

		this.states = [
			new eui.State("lock", [new eui.SetProperty("_Image1", "source", "item_level_lock_png")]),
			new eui.State("unlock", [
				new eui.AddItems("l_level", "", 1, ""),
				new eui.AddItems("tg_star_1", "", 1, ""),
				new eui.AddItems("tg_star_2", "", 1, ""),
				new eui.AddItems("tg_star_3", "", 1, ""),
			]),
		];
	}
	var _proto = LevelItem.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "item_level_unlock_png";
		t.touchEnabled = false;
		return t;
	};
	_proto.l_level_i = function() {
		var t = new eui.BitmapLabel();
		this.l_level = t;
		t.font = "fnt_scroe2_fnt";
		t.horizontalCenter = -2.5;
		t.rotation = 357.92;
		t.text = "1";
		t.touchEnabled = false;
		t.y = 32;
		return t;
	};
	_proto.tg_star_1_i = function() {
		var t = new eui.ToggleButton();
		this.tg_star_1 = t;
		t.height = 43;
		t.label = "";
		t.touchEnabled = false;
		t.width = 42;
		t.y = 87;
		t.skinName = LevelItem$Skin1;
		return t;
	};
	_proto.tg_star_2_i = function() {
		var t = new eui.ToggleButton();
		this.tg_star_2 = t;
		t.height = 43;
		t.label = "";
		t.touchEnabled = false;
		t.width = 42;
		t.x = 41.5;
		t.y = 87;
		t.skinName = LevelItem$Skin2;
		return t;
	};
	_proto.tg_star_3_i = function() {
		var t = new eui.ToggleButton();
		this.tg_star_3 = t;
		t.height = 43;
		t.label = "";
		t.touchEnabled = false;
		t.width = 42;
		t.x = 83;
		t.y = 87;
		t.skinName = LevelItem$Skin3;
		return t;
	};
	return LevelItem;
})(eui.Skin);
generateEUI.paths["resource/mySkin/component/ProgressStar.exml"] = window.skins.ProgressStar = (function(_super) {
	__extends(ProgressStar, _super);
	function ProgressStar() {
		_super.call(this);
		this.skinParts = [];

		this.currentState = "star_2_up";
		this.elementsContent = [this._Image1_i()];
		this._Image2_i();

		this._Image3_i();

		this.states = [
			new eui.State("star_1_down", []),
			new eui.State("star_1_up", [new eui.SetProperty("_Image1", "source", "star_light_png")]),
			new eui.State("star_2_down", [new eui.AddItems("_Image2", "", 1, "")]),
			new eui.State("star_2_up", [
				new eui.AddItems("_Image2", "", 1, ""),
				new eui.SetProperty("_Image1", "source", "star_light_png"),
				new eui.SetProperty("_Image2", "source", "star_light_png"),
			]),
			new eui.State("star_3_down", [new eui.AddItems("_Image2", "", 1, ""), new eui.AddItems("_Image3", "", 1, "")]),
			new eui.State("star_3_up", [
				new eui.AddItems("_Image2", "", 1, ""),
				new eui.AddItems("_Image3", "", 1, ""),
				new eui.SetProperty("_Image1", "source", "star_light_png"),
				new eui.SetProperty("_Image2", "source", "star_light_png"),
				new eui.SetProperty("_Image3", "source", "star_light_png"),
			]),
			new eui.State("star_1_light", [new eui.SetProperty("_Image1", "source", "smallStar_png")]),
		];
	}
	var _proto = ProgressStar.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "star_gray_png";
		t.y = 0;
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		this._Image2 = t;
		t.source = "star_gray_png";
		t.x = 10;
		t.y = 0;
		return t;
	};
	_proto._Image3_i = function() {
		var t = new eui.Image();
		this._Image3 = t;
		t.source = "star_gray_png";
		t.x = 20;
		t.y = 0;
		return t;
	};
	return ProgressStar;
})(eui.Skin);
generateEUI.paths["resource/mySkin/component/ToolItem.exml"] = window.skins.ToolItem = (function(_super) {
	__extends(ToolItem, _super);
	function ToolItem() {
		_super.call(this);
		this.skinParts = ["icon_tool", "bl_num"];

		this.height = 80;
		this.width = 90;
		this.elementsContent = [this.icon_tool_i(), this._Group1_i()];
		this.states = [
			new eui.State("bomb", []),
			new eui.State("color", [new eui.SetProperty("icon_tool", "source", "prop_colorBall_png")]),
			new eui.State("guid", [
				new eui.SetProperty("icon_tool", "source", "prop_guidLine_png"),
				new eui.SetProperty("icon_tool", "anchorOffsetX", 27),
				new eui.SetProperty("icon_tool", "anchorOffsetY", 37),
				new eui.SetProperty("icon_tool", "x", 27),
				new eui.SetProperty("icon_tool", "y", 37),
			]),
			new eui.State("hummer", [new eui.SetProperty("icon_tool", "source", "prop_hammer_png")]),
		];
	}
	var _proto = ToolItem.prototype;

	_proto.icon_tool_i = function() {
		var t = new eui.Image();
		this.icon_tool = t;
		t.anchorOffsetX = 35;
		t.anchorOffsetY = 35;
		t.source = "prop_bomb_png";
		t.x = 35;
		t.y = 35;
		return t;
	};
	_proto._Group1_i = function() {
		var t = new eui.Group();
		t.bottom = 0;
		t.right = 0;
		t.elementsContent = [this._Image1_i(), this.bl_num_i()];
		return t;
	};
	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.scale9Grid = new egret.Rectangle(13, 7, 18, 15);
		t.source = "num_bg_png";
		return t;
	};
	_proto.bl_num_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_num = t;
		t.font = "fnt_nums_fnt";
		t.horizontalCenter = 0;
		t.scaleX = 0.55;
		t.scaleY = 0.55;
		t.text = "20";
		t.verticalCenter = 0;
		return t;
	};
	return ToolItem;
})(eui.Skin);
generateEUI.paths["resource/mySkin/component/ShopItem.exml"] = window.skins.ShopItem = (function(_super) {
	__extends(ShopItem, _super);
	function ShopItem() {
		_super.call(this);
		this.skinParts = ["tool", "bl_cost", "bl_count"];

		this.width = 640;
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State("hummer", []),
			new eui.State("color", [new eui.SetProperty("tool", "currentState", "color")]),
			new eui.State("bomb", [new eui.SetProperty("tool", "currentState", "bomb")]),
			new eui.State("guid", [new eui.SetProperty("tool", "currentState", "guid")]),
		];
	}
	var _proto = ShopItem.prototype;

	_proto._Group1_i = function() {
		var t = new eui.Group();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this.tool_i(), this._Image1_i(), this.bl_cost_i(), this._Image2_i(), this.bl_count_i()];
		return t;
	};
	_proto.tool_i = function() {
		var t = new eui.Component();
		this.tool = t;
		t.currentState = "hummer";
		t.name = "hummer";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 90;
		t.y = 0;
		return t;
	};
	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.scaleX = 0.4;
		t.scaleY = 0.4;
		t.source = "icon_coin_png";
		t.x = 260;
		t.y = 26;
		return t;
	};
	_proto.bl_cost_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_cost = t;
		t.font = "fnt_score_fnt";
		t.left = 290;
		t.scaleX = 1;
		t.scaleY = 1;
		t.text = "100";
		t.x = 290;
		t.y = 23;
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		t.scale9Grid = new egret.Rectangle(39, 21, 43, 19);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "an_png";
		t.x = 410;
		t.y = 10;
		return t;
	};
	_proto.bl_count_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_count = t;
		t.font = "fnt_scroe2_fnt";
		t.horizontalCenter = 151;
		t.scaleX = 1;
		t.scaleY = 1;
		t.text = "12";
		t.x = 441;
		t.y = 16;
		return t;
	};
	return ShopItem;
})(eui.Skin);
generateEUI.paths["resource/mySkin/component/Timer.exml"] = window.skins.Timer = (function(_super) {
	__extends(Timer, _super);
	function Timer() {
		_super.call(this);
		this.skinParts = ["bl_time"];

		this.elementsContent = [this._BitmapLabel1_i(), this.bl_time_i()];
	}
	var _proto = Timer.prototype;

	_proto._BitmapLabel1_i = function() {
		var t = new eui.BitmapLabel();
		t.font = "fnt_daoji_fnt";
		t.scaleX = 1.1;
		t.scaleY = 1.1;
		t.text = "O";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.bl_time_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_time = t;
		t.font = "fnt_daoji_fnt";
		t.horizontalCenter = 0;
		t.text = "50";
		t.verticalCenter = 0;
		return t;
	};
	return Timer;
})(eui.Skin);
generateEUI.paths["resource/mySkin/GameModelPanel.exml"] = window.skins.GameModelPanel = (function(_super) {
	__extends(GameModelPanel, _super);
	function GameModelPanel() {
		_super.call(this);
		this.skinParts = ["btn_infinite", "btn_level"];

		this.elementsContent = [this.btn_infinite_i(), this.btn_level_i()];
	}
	var _proto = GameModelPanel.prototype;

	_proto.btn_infinite_i = function() {
		var t = new ui.ImageButton();
		this.btn_infinite = t;
		t.anchorOffsetX = 157;
		t.anchorOffsetY = 68;
		t.source = "btn_model_infinite_png";
		t.x = 157;
		t.y = 80;
		return t;
	};
	_proto.btn_level_i = function() {
		var t = new ui.ImageButton();
		this.btn_level = t;
		t.anchorOffsetX = 157;
		t.anchorOffsetY = 68;
		t.source = "btn_model_level_png";
		t.x = 157;
		t.y = 310;
		return t;
	};
	return GameModelPanel;
})(eui.Skin);
generateEUI.paths["resource/mySkin/ScoreBoard.exml"] = window.skins.ScoreBoard = (function(_super) {
	__extends(ScoreBoard, _super);
	function ScoreBoard() {
		_super.call(this);
		this.skinParts = ["bl_lv", "pg_trace", "pg_thumb", "pg_thumb_mask", "pg_star_1", "pg_star_2", "pg_star_3", "bl_user_score", "bl_max_score"];

		this.elementsContent = [this._Image1_i(), this._Group1_i(), this._Group3_i()];
	}
	var _proto = ScoreBoard.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.fillMode = "clip";
		t.height = 135;
		t.source = "bg_game_top_png";
		return t;
	};
	_proto._Group1_i = function() {
		var t = new eui.Group();
		t.left = 19;
		t.top = 3;
		t.elementsContent = [this._Image2_i(), this.bl_lv_i()];
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		t.source = "text_guanqia_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.bl_lv_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_lv = t;
		t.font = "fnt_level_fnt";
		t.horizontalCenter = 0;
		t.text = "2";
		t.verticalCenter = 24;
		return t;
	};
	_proto._Group3_i = function() {
		var t = new eui.Group();
		t.horizontalCenter = 38;
		t.y = 1;
		t.elementsContent = [
			this.pg_trace_i(),
			this.pg_thumb_i(),
			this.pg_thumb_mask_i(),
			this.pg_star_1_i(),
			this.pg_star_2_i(),
			this.pg_star_3_i(),
			this._Group2_i(),
		];
		return t;
	};
	_proto.pg_trace_i = function() {
		var t = new eui.Image();
		this.pg_trace = t;
		t.height = 42;
		t.source = "progress_trace_png";
		t.width = 348;
		t.x = 0;
		t.y = 50.08;
		return t;
	};
	_proto.pg_thumb_i = function() {
		var t = new eui.Image();
		this.pg_thumb = t;
		t.height = 42;
		t.source = "progress_thumb_png";
		t.width = 348;
		t.x = 0;
		t.y = 50;
		return t;
	};
	_proto.pg_thumb_mask_i = function() {
		var t = new eui.Image();
		this.pg_thumb_mask = t;
		t.height = 42;
		t.source = "progress_thumb_png";
		t.width = 348;
		t.x = 0;
		t.y = 50;
		return t;
	};
	_proto.pg_star_1_i = function() {
		var t = new eui.Component();
		this.pg_star_1 = t;
		t.anchorOffsetX = 30;
		t.anchorOffsetY = 16;
		t.currentState = "star_1_down";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ProgressStar";
		t.x = 91.66;
		t.y = 70;
		return t;
	};
	_proto.pg_star_2_i = function() {
		var t = new eui.Component();
		this.pg_star_2 = t;
		t.anchorOffsetX = 20;
		t.anchorOffsetY = 16;
		t.currentState = "star_2_down";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ProgressStar";
		t.x = 194;
		t.y = 70;
		return t;
	};
	_proto.pg_star_3_i = function() {
		var t = new eui.Component();
		this.pg_star_3 = t;
		t.anchorOffsetX = 40;
		t.anchorOffsetY = 16;
		t.currentState = "star_3_down";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ProgressStar";
		t.x = 312.35;
		t.y = 70;
		return t;
	};
	_proto._Group2_i = function() {
		var t = new eui.Group();
		t.horizontalCenter = 0;
		t.scaleX = 0.7;
		t.scaleY = 0.7;
		t.y = 10;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this.bl_user_score_i(), this._BitmapLabel1_i(), this.bl_max_score_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function() {
		var t = new eui.HorizontalLayout();
		t.gap = 0;
		return t;
	};
	_proto.bl_user_score_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_user_score = t;
		t.font = "fnt_scroe2_fnt";
		t.scaleX = 1;
		t.scaleY = 1;
		t.text = "100";
		t.x = 156;
		t.y = 0;
		return t;
	};
	_proto._BitmapLabel1_i = function() {
		var t = new eui.BitmapLabel();
		t.font = "fnt_scroe2_fnt";
		t.text = "/";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.bl_max_score_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_max_score = t;
		t.font = "fnt_scroe2_fnt";
		t.text = "100";
		t.x = 10;
		t.y = 10;
		return t;
	};
	return ScoreBoard;
})(eui.Skin);
generateEUI.paths["resource/mySkin/GamePage.exml"] = window.skins.GamePage = (function(_super) {
	__extends(GamePage, _super);
	var GamePage$Skin4 = (function(_super) {
		__extends(GamePage$Skin4, _super);
		function GamePage$Skin4() {
			_super.call(this);
			this.skinParts = ["bl_time"];

			this.elementsContent = [this._BitmapLabel1_i(), this.bl_time_i()];
		}
		var _proto = GamePage$Skin4.prototype;

		_proto._BitmapLabel1_i = function() {
			var t = new eui.BitmapLabel();
			t.font = "fnt_daoji_fnt";
			t.scaleX = 1.1;
			t.scaleY = 1.1;
			t.text = "O";
			t.x = 0;
			t.y = 0;
			return t;
		};
		_proto.bl_time_i = function() {
			var t = new eui.BitmapLabel();
			this.bl_time = t;
			t.font = "fnt_daoji_fnt";
			t.horizontalCenter = 0;
			t.text = "50";
			t.verticalCenter = 0;
			return t;
		};
		return GamePage$Skin4;
	})(eui.Skin);

	function GamePage() {
		_super.call(this);
		this.skinParts = [
			"bg",
			"g_bubble",
			"g_guidLine",
			"g_comboEffect",
			"curtain",
			"border",
			"dead_line",
			"icon_arrow",
			"score_board",
			"time_board",
			"g_handle",
			"tool_hummer",
			"tool_bomb",
			"tool_color",
			"tool_guid",
			"g_tool",
			"btn_change",
			"btn_pause",
			"l_coin",
			"gray_mask",
			"icon_ready",
			"btn_begin",
		];

		this.height = 1136;
		this.width = 640;
		this.elementsContent = [
			this.bg_i(),
			this.g_bubble_i(),
			this.g_guidLine_i(),
			this.g_comboEffect_i(),
			this.curtain_i(),
			this.border_i(),
			this.dead_line_i(),
			this.icon_arrow_i(),
			this.score_board_i(),
			this.time_board_i(),
			this.g_handle_i(),
			this.g_tool_i(),
			this.btn_change_i(),
			this.btn_pause_i(),
			this._Group1_i(),
			this.gray_mask_i(),
			this.icon_ready_i(),
			this.btn_begin_i(),
		];
	}
	var _proto = GamePage.prototype;

	_proto.bg_i = function() {
		var t = new eui.Image();
		this.bg = t;
		t.height = 1136;
		t.source = "bg_png";
		return t;
	};
	_proto.g_bubble_i = function() {
		var t = new eui.Group();
		this.g_bubble = t;
		t.height = 735;
		t.touchChildren = false;
		t.touchEnabled = false;
		t.width = 618;
		t.x = 11;
		t.y = 117;
		return t;
	};
	_proto.g_guidLine_i = function() {
		var t = new eui.Group();
		this.g_guidLine = t;
		t.height = 735;
		t.width = 618;
		t.x = 11;
		t.y = 117;
		return t;
	};
	_proto.g_comboEffect_i = function() {
		var t = new eui.Group();
		this.g_comboEffect = t;
		t.anchorOffsetY = 0;
		t.height = 730;
		t.left = 11;
		t.right = 11;
		t.y = 120;
		return t;
	};
	_proto.curtain_i = function() {
		var t = new eui.Image();
		this.curtain = t;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(32, 10, 541, 5);
		t.source = "hanging_curtain_png";
		t.top = 95;
		return t;
	};
	_proto.border_i = function() {
		var t = new eui.Image();
		this.border = t;
		t.height = 1137;
		t.source = "border_png";
		return t;
	};
	_proto.dead_line_i = function() {
		var t = new eui.Image();
		this.dead_line = t;
		t.source = "dead_line_png";
		t.x = 19;
		t.y = 856.08;
		return t;
	};
	_proto.icon_arrow_i = function() {
		var t = new ui.Arrow();
		this.icon_arrow = t;
		t.anchorOffsetX = 19;
		t.anchorOffsetY = 85;
		t.rotation = 0;
		t.source = "arrow_blue_png";
		t.visible = false;
		t.x = 320;
		t.y = 985;
		return t;
	};
	_proto.score_board_i = function() {
		var t = new view.ScoreBoard();
		this.score_board = t;
		t.skinName = "skins.ScoreBoard";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.time_board_i = function() {
		var t = new eui.Component();
		this.time_board = t;
		t.scaleX = 1.2;
		t.scaleY = 1.2;
		t.x = 36.11;
		t.y = 881.08;
		t.skinName = GamePage$Skin4;
		return t;
	};
	_proto.g_handle_i = function() {
		var t = new eui.Group();
		this.g_handle = t;
		t.anchorOffsetY = 0;
		t.height = 740;
		t.width = 610;
		t.x = 15;
		t.y = 110;
		return t;
	};
	_proto.g_tool_i = function() {
		var t = new eui.Group();
		this.g_tool = t;
		t.touchChildren = true;
		t.touchEnabled = false;
		t.touchThrough = true;
		t.x = 230;
		t.y = 1048;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this.tool_hummer_i(), this.tool_bomb_i(), this.tool_color_i(), this.tool_guid_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function() {
		var t = new eui.HorizontalLayout();
		t.gap = 15;
		t.horizontalAlign = "center";
		return t;
	};
	_proto.tool_hummer_i = function() {
		var t = new eui.Component();
		this.tool_hummer = t;
		t.currentState = "hummer";
		t.name = "hummer";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.tool_bomb_i = function() {
		var t = new eui.Component();
		this.tool_bomb = t;
		t.currentState = "bomb";
		t.name = "bomb";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 10;
		t.y = 10;
		return t;
	};
	_proto.tool_color_i = function() {
		var t = new eui.Component();
		this.tool_color = t;
		t.currentState = "color";
		t.name = "color";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 20;
		t.y = 20;
		return t;
	};
	_proto.tool_guid_i = function() {
		var t = new eui.Component();
		this.tool_guid = t;
		t.currentState = "guid";
		t.name = "guid";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 30;
		t.y = 30;
		return t;
	};
	_proto.btn_change_i = function() {
		var t = new eui.Rect();
		this.btn_change = t;
		t.ellipseHeight = 60;
		t.ellipseWidth = 60;
		t.fillAlpha = 0;
		t.fillColor = 0xffffff;
		t.height = 60;
		t.strokeAlpha = 0;
		t.touchEnabled = true;
		t.width = 60;
		t.x = 177;
		t.y = 982;
		return t;
	};
	_proto.btn_pause_i = function() {
		var t = new ui.ImageButton();
		this.btn_pause = t;
		t.anchorOffsetX = 92;
		t.right = 0;
		t.source = "btn_pause_png";
		t.top = 0;
		return t;
	};
	_proto._Group1_i = function() {
		var t = new eui.Group();
		t.height = 74;
		t.width = 200;
		t.x = 5.71;
		t.y = 1046.47;
		t.elementsContent = [this.l_coin_i(), this._Image1_i()];
		return t;
	};
	_proto.l_coin_i = function() {
		var t = new eui.Label();
		this.l_coin = t;
		t.bold = true;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 22.5;
		t.size = 34;
		t.text = "12312";
		t.y = 20;
		return t;
	};
	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.source = "icon_coin_png";
		t.y = 3.04;
		return t;
	};
	_proto.gray_mask_i = function() {
		var t = new eui.Rect();
		this.gray_mask = t;
		t.bottom = 0;
		t.fillAlpha = 0.3;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.icon_ready_i = function() {
		var t = new eui.Image();
		this.icon_ready = t;
		t.anchorOffsetY = 62;
		t.horizontalCenter = 0;
		t.source = "readygo_0_png";
		t.y = 461;
		return t;
	};
	_proto.btn_begin_i = function() {
		var t = new ui.ImageButton();
		this.btn_begin = t;
		t.horizontalCenter = 0;
		t.source = "btn_begin_png";
		t.verticalCenter = -100;
		return t;
	};
	return GamePage;
})(eui.Skin);
generateEUI.paths["resource/mySkin/HelpPage.exml"] = window.skins.HelpPage = (function(_super) {
	__extends(HelpPage, _super);
	var HelpPage$Skin5 = (function(_super) {
		__extends(HelpPage$Skin5, _super);
		function HelpPage$Skin5() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];

			this.elementsContent = [this._Image1_i(), this.labelDisplay_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "btn_return_png")]),
				new eui.State("disabled", []),
			];
		}
		var _proto = HelpPage$Skin5.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_return_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function() {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return HelpPage$Skin5;
	})(eui.Skin);

	function HelpPage() {
		_super.call(this);
		this.skinParts = ["btn_return"];

		this.elementsContent = [
			this._Image1_i(),
			this.btn_return_i(),
			this._Image2_i(),
			this._Image3_i(),
			this._Image4_i(),
			this._Image5_i(),
			this._Image6_i(),
			this._Image7_i(),
			this._Image8_i(),
			this._Image9_i(),
			this._Image10_i(),
		];
	}
	var _proto = HelpPage.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.height = 1136;
		t.source = "bg_png";
		return t;
	};
	_proto.btn_return_i = function() {
		var t = new eui.Button();
		this.btn_return = t;
		t.label = "";
		t.skewY = 180;
		t.x = 620;
		t.y = 970;
		t.skinName = HelpPage$Skin5;
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		t.source = "explain_rule_png";
		t.x = 86;
		t.y = 110;
		return t;
	};
	_proto._Image3_i = function() {
		var t = new eui.Image();
		t.source = "text_caiqiu_png";
		t.x = 118;
		t.y = 324.15;
		return t;
	};
	_proto._Image4_i = function() {
		var t = new eui.Image();
		t.source = "text_miaozhunxian_png";
		t.x = 88;
		t.y = 426.15;
		return t;
	};
	_proto._Image5_i = function() {
		var t = new eui.Image();
		t.source = "text_xiaomuchui_png";
		t.x = 86;
		t.y = 528.15;
		return t;
	};
	_proto._Image6_i = function() {
		var t = new eui.Image();
		t.source = "text_zhadan_png";
		t.x = 118;
		t.y = 626.15;
		return t;
	};
	_proto._Image7_i = function() {
		var t = new eui.Image();
		t.source = "prop_colorBall_png";
		t.x = 285;
		t.y = 304.15;
		return t;
	};
	_proto._Image8_i = function() {
		var t = new eui.Image();
		t.source = "prop_guidLine_png";
		t.x = 285;
		t.y = 404.15;
		return t;
	};
	_proto._Image9_i = function() {
		var t = new eui.Image();
		t.source = "prop_hammer_png";
		t.x = 285;
		t.y = 507.15;
		return t;
	};
	_proto._Image10_i = function() {
		var t = new eui.Image();
		t.source = "prop_bomb_png";
		t.x = 285;
		t.y = 606.15;
		return t;
	};
	return HelpPage;
})(eui.Skin);
generateEUI.paths["resource/mySkin/LevelPage.exml"] = window.skins.LevelPage = (function(_super) {
	__extends(LevelPage, _super);
	var LevelPage$Skin6 = (function(_super) {
		__extends(LevelPage$Skin6, _super);
		function LevelPage$Skin6() {
			_super.call(this);
			this.skinParts = [];

			this.elementsContent = [this._Image1_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [
					new eui.SetProperty("_Image1", "scaleY", 1.1),
					new eui.SetProperty("_Image1", "scaleX", 1.1),
					new eui.SetProperty("_Image1", "source", "btn_return_png"),
				]),
				new eui.State("disabled", []),
			];
		}
		var _proto = LevelPage$Skin6.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_return_png";
			t.percentWidth = 100;
			return t;
		};
		return LevelPage$Skin6;
	})(eui.Skin);

	function LevelPage() {
		_super.call(this);
		this.skinParts = ["btn_return", "bl_completion", "g_container", "s_container", "g_pages"];

		this.height = 1136;
		this.elementsContent = [
			this._Image1_i(),
			this.btn_return_i(),
			this.bl_completion_i(),
			this._Image2_i(),
			this.s_container_i(),
			this.g_pages_i(),
			this._Image3_i(),
		];
	}
	var _proto = LevelPage.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.height = 1137;
		t.source = "bg_png";
		return t;
	};
	_proto.btn_return_i = function() {
		var t = new eui.Button();
		this.btn_return = t;
		t.label = "";
		t.x = 20;
		t.y = 970;
		t.skinName = LevelPage$Skin6;
		return t;
	};
	_proto.bl_completion_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_completion = t;
		t.font = "fnt_scroe2_fnt";
		t.right = 140;
		t.text = "14/62";
		t.y = 998.96;
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		t.scaleX = 0.6;
		t.scaleY = 0.6;
		t.source = "star_noEmpty_b_png";
		t.x = 510.73;
		t.y = 975.92;
		return t;
	};
	_proto.s_container_i = function() {
		var t = new eui.Scroller();
		this.s_container = t;
		t.height = 700;
		t.width = 560;
		t.x = 40;
		t.y = 110.15;
		t.viewport = this.g_container_i();
		return t;
	};
	_proto.g_container_i = function() {
		var t = new eui.Group();
		this.g_container = t;
		t.horizontalCenter = 0;
		t.touchEnabled = true;
		t.y = 124;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._DataGroup1_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function() {
		var t = new eui.HorizontalLayout();
		t.gap = 10;
		return t;
	};
	_proto._DataGroup1_i = function() {
		var t = new eui.DataGroup();
		t.anchorOffsetY = 0;
		t.height = 720;
		t.itemRendererSkinName = skins.LevelItem;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 560;
		t.layout = this._TileLayout1_i();
		t.dataProvider = this._ArrayCollection1_i();
		return t;
	};
	_proto._TileLayout1_i = function() {
		var t = new eui.TileLayout();
		t.horizontalAlign = "left";
		t.horizontalGap = 18;
		t.orientation = "rows";
		t.rowAlign = "top";
		t.verticalGap = 14;
		return t;
	};
	_proto._ArrayCollection1_i = function() {
		var t = new eui.ArrayCollection();
		t.source = [];
		return t;
	};
	_proto.g_pages_i = function() {
		var t = new eui.Group();
		this.g_pages = t;
		t.anchorOffsetY = 0;
		t.horizontalCenter = 10;
		t.touchChildren = true;
		t.touchEnabled = false;
		t.width = 600;
		t.y = 867.15;
		t.layout = this._HorizontalLayout2_i();
		return t;
	};
	_proto._HorizontalLayout2_i = function() {
		var t = new eui.HorizontalLayout();
		t.gap = 30;
		t.horizontalAlign = "center";
		return t;
	};
	_proto._Image3_i = function() {
		var t = new eui.Image();
		t.source = "text_guanqia_png";
		t.x = 18;
		t.y = 25;
		return t;
	};
	return LevelPage;
})(eui.Skin);
generateEUI.paths["resource/mySkin/MenuPage.exml"] = window.skins.MenuPage = (function(_super) {
	__extends(MenuPage, _super);
	function MenuPage() {
		_super.call(this);
		this.skinParts = ["tgShow", "logo", "btn_start", "btn_help", "btn_shop"];

		this.height = 1136;
		this.width = 640;
		this.tgShow_i();
		this.elementsContent = [this._Image1_i(), this.logo_i(), this.btn_start_i(), this.btn_help_i(), this.btn_shop_i()];

		eui.Binding.$bindProperties(this, ["logo"], [0], this._TweenItem1, "target");
		eui.Binding.$bindProperties(this, [1], [], this._Object1, "scaleX");
		eui.Binding.$bindProperties(this, [1], [], this._Object1, "scaleY");
		eui.Binding.$bindProperties(this, [270], [], this._Object1, "y");
		eui.Binding.$bindProperties(this, ["btn_start"], [0], this._TweenItem2, "target");
		eui.Binding.$bindProperties(this, [0], [], this._Object2, "alpha");
		eui.Binding.$bindProperties(this, [-99], [], this._Object2, "x");
		eui.Binding.$bindProperties(this, [1], [], this._Object3, "alpha");
		eui.Binding.$bindProperties(this, [-99], [], this._Object3, "x");
		eui.Binding.$bindProperties(this, [420], [], this._Object4, "x");
		eui.Binding.$bindProperties(this, [320], [], this._Object5, "x");
		eui.Binding.$bindProperties(this, ["btn_help"], [0], this._TweenItem3, "target");
		eui.Binding.$bindProperties(this, [0], [], this._Object6, "alpha");
		eui.Binding.$bindProperties(this, [-99], [], this._Object6, "x");
		eui.Binding.$bindProperties(this, [1], [], this._Object7, "alpha");
		eui.Binding.$bindProperties(this, [-99], [], this._Object7, "x");
		eui.Binding.$bindProperties(this, [390], [], this._Object8, "x");
		eui.Binding.$bindProperties(this, [320], [], this._Object9, "x");
		eui.Binding.$bindProperties(this, ["btn_shop"], [0], this._TweenItem4, "target");
		eui.Binding.$bindProperties(this, [1333], [], this._Object10, "y");
		eui.Binding.$bindProperties(this, [1053], [], this._Object11, "y");
	}
	var _proto = MenuPage.prototype;

	_proto.tgShow_i = function() {
		var t = new egret.tween.TweenGroup();
		this.tgShow = t;
		t.items = [this._TweenItem1_i(), this._TweenItem2_i(), this._TweenItem3_i(), this._TweenItem4_i()];
		return t;
	};
	_proto._TweenItem1_i = function() {
		var t = new egret.tween.TweenItem();
		this._TweenItem1 = t;
		t.paths = [this._Set1_i(), this._Wait1_i(), this._Set2_i(), this._To1_i()];
		return t;
	};
	_proto._Set1_i = function() {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._Wait1_i = function() {
		var t = new egret.tween.Wait();
		t.duration = 250;
		return t;
	};
	_proto._Set2_i = function() {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To1_i = function() {
		var t = new egret.tween.To();
		t.duration = 950;
		t.ease = "bounceOut";
		t.props = this._Object1_i();
		return t;
	};
	_proto._Object1_i = function() {
		var t = {};
		this._Object1 = t;
		return t;
	};
	_proto._TweenItem2_i = function() {
		var t = new egret.tween.TweenItem();
		this._TweenItem2 = t;
		t.paths = [this._Set3_i(), this._Wait2_i(), this._Set4_i(), this._To2_i(), this._To3_i()];
		return t;
	};
	_proto._Set3_i = function() {
		var t = new egret.tween.Set();
		t.props = this._Object2_i();
		return t;
	};
	_proto._Object2_i = function() {
		var t = {};
		this._Object2 = t;
		return t;
	};
	_proto._Wait2_i = function() {
		var t = new egret.tween.Wait();
		t.duration = 500;
		return t;
	};
	_proto._Set4_i = function() {
		var t = new egret.tween.Set();
		t.props = this._Object3_i();
		return t;
	};
	_proto._Object3_i = function() {
		var t = {};
		this._Object3 = t;
		return t;
	};
	_proto._To2_i = function() {
		var t = new egret.tween.To();
		t.duration = 400;
		t.ease = "backIn";
		t.props = this._Object4_i();
		return t;
	};
	_proto._Object4_i = function() {
		var t = {};
		this._Object4 = t;
		return t;
	};
	_proto._To3_i = function() {
		var t = new egret.tween.To();
		t.duration = 300;
		t.ease = "quintOut";
		t.props = this._Object5_i();
		return t;
	};
	_proto._Object5_i = function() {
		var t = {};
		this._Object5 = t;
		return t;
	};
	_proto._TweenItem3_i = function() {
		var t = new egret.tween.TweenItem();
		this._TweenItem3 = t;
		t.paths = [this._Set5_i(), this._Wait3_i(), this._Set6_i(), this._To4_i(), this._To5_i()];
		return t;
	};
	_proto._Set5_i = function() {
		var t = new egret.tween.Set();
		t.props = this._Object6_i();
		return t;
	};
	_proto._Object6_i = function() {
		var t = {};
		this._Object6 = t;
		return t;
	};
	_proto._Wait3_i = function() {
		var t = new egret.tween.Wait();
		t.duration = 650;
		return t;
	};
	_proto._Set6_i = function() {
		var t = new egret.tween.Set();
		t.props = this._Object7_i();
		return t;
	};
	_proto._Object7_i = function() {
		var t = {};
		this._Object7 = t;
		return t;
	};
	_proto._To4_i = function() {
		var t = new egret.tween.To();
		t.duration = 350;
		t.ease = "backIn";
		t.props = this._Object8_i();
		return t;
	};
	_proto._Object8_i = function() {
		var t = {};
		this._Object8 = t;
		return t;
	};
	_proto._To5_i = function() {
		var t = new egret.tween.To();
		t.duration = 200;
		t.ease = "backInOut";
		t.props = this._Object9_i();
		return t;
	};
	_proto._Object9_i = function() {
		var t = {};
		this._Object9 = t;
		return t;
	};
	_proto._TweenItem4_i = function() {
		var t = new egret.tween.TweenItem();
		this._TweenItem4 = t;
		t.paths = [this._Set7_i(), this._Wait4_i(), this._Set8_i(), this._To6_i()];
		return t;
	};
	_proto._Set7_i = function() {
		var t = new egret.tween.Set();
		t.props = this._Object10_i();
		return t;
	};
	_proto._Object10_i = function() {
		var t = {};
		this._Object10 = t;
		return t;
	};
	_proto._Wait4_i = function() {
		var t = new egret.tween.Wait();
		t.duration = 850;
		return t;
	};
	_proto._Set8_i = function() {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To6_i = function() {
		var t = new egret.tween.To();
		t.duration = 350;
		t.ease = "cubicIn";
		t.props = this._Object11_i();
		return t;
	};
	_proto._Object11_i = function() {
		var t = {};
		this._Object11 = t;
		return t;
	};
	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.height = 1136;
		t.source = "bg_png";
		return t;
	};
	_proto.logo_i = function() {
		var t = new eui.Image();
		this.logo = t;
		t.anchorOffsetX = 252;
		t.anchorOffsetY = 146;
		t.scaleX = 0.5;
		t.scaleY = 0.5;
		t.source = "logo_png";
		t.x = 320;
		t.y = 450;
		return t;
	};
	_proto.btn_start_i = function() {
		var t = new ui.ImageButton();
		this.btn_start = t;
		t.anchorOffsetX = 99;
		t.anchorOffsetY = 48;
		t.source = "btn_start_png";
		t.x = 320;
		t.y = 573;
		return t;
	};
	_proto.btn_help_i = function() {
		var t = new ui.ImageButton();
		this.btn_help = t;
		t.anchorOffsetX = 99;
		t.anchorOffsetY = 48;
		t.source = "btn_help_png";
		t.x = 320;
		t.y = 800;
		return t;
	};
	_proto.btn_shop_i = function() {
		var t = new ui.ImageButton();
		this.btn_shop = t;
		t.anchorOffsetX = 50;
		t.anchorOffsetY = 58;
		t.source = "icon_shop_png";
		t.x = 90;
		t.y = 1053;
		return t;
	};
	return MenuPage;
})(eui.Skin);
generateEUI.paths["resource/mySkin/MsgPanel.exml"] = window.skins.MsgPanel = (function(_super) {
	__extends(MsgPanel, _super);
	function MsgPanel() {
		_super.call(this);
		this.skinParts = ["btn_close", "l_msg"];

		this.elementsContent = [this._Image1_i(), this.btn_close_i(), this.l_msg_i()];
	}
	var _proto = MsgPanel.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.source = "bg_panel_purple_png";
		t.touchEnabled = false;
		return t;
	};
	_proto.btn_close_i = function() {
		var t = new ui.ImageButton();
		this.btn_close = t;
		t.anchorOffsetX = 45;
		t.anchorOffsetY = 37;
		t.source = "btn_close_png";
		t.x = 493;
		t.y = 52;
		return t;
	};
	_proto.l_msg_i = function() {
		var t = new eui.Label();
		this.l_msg = t;
		t.anchorOffsetX = 0;
		t.fontFamily = "Microsoft YaHei";
		t.horizontalCenter = 0;
		t.text = "还没有完成开发阿斯顿发阿斯！！顿阿斯顿发生发";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		t.width = 450;
		t.wordWrap = true;
		return t;
	};
	return MsgPanel;
})(eui.Skin);
generateEUI.paths["resource/mySkin/PausePanel.exml"] = window.skins.PausePanel = (function(_super) {
	__extends(PausePanel, _super);
	var PausePanel$Skin7 = (function(_super) {
		__extends(PausePanel$Skin7, _super);
		function PausePanel$Skin7() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];

			this.elementsContent = [this._Image1_i(), this.labelDisplay_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "btn_bgm_down_png")]),
				new eui.State("disabled", []),
			];
		}
		var _proto = PausePanel$Skin7.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_bgm_up_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function() {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return PausePanel$Skin7;
	})(eui.Skin);

	var PausePanel$Skin8 = (function(_super) {
		__extends(PausePanel$Skin8, _super);
		function PausePanel$Skin8() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];

			this.elementsContent = [this._Image1_i(), this.labelDisplay_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "btn_music_effect_down_png")]),
				new eui.State("disabled", []),
			];
		}
		var _proto = PausePanel$Skin8.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_music_effect_up_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function() {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return PausePanel$Skin8;
	})(eui.Skin);

	function PausePanel() {
		_super.call(this);
		this.skinParts = ["btn_close", "btn_back", "btn_last", "btn_continue", "btn_restart", "btn_music", "btn_voice"];

		this.elementsContent = [
			this._Image1_i(),
			this.btn_close_i(),
			this.btn_back_i(),
			this.btn_last_i(),
			this.btn_continue_i(),
			this.btn_restart_i(),
			this.btn_music_i(),
			this.btn_voice_i(),
		];
	}
	var _proto = PausePanel.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.source = "bg_panel_blue_png";
		t.touchEnabled = false;
		return t;
	};
	_proto.btn_close_i = function() {
		var t = new ui.ImageButton();
		this.btn_close = t;
		t.anchorOffsetX = 45;
		t.anchorOffsetY = 37;
		t.source = "btn_close_png";
		t.x = 493;
		t.y = 52;
		return t;
	};
	_proto.btn_back_i = function() {
		var t = new ui.ImageButton();
		this.btn_back = t;
		t.anchorOffsetX = 31;
		t.anchorOffsetY = 32;
		t.source = "btn_last_png";
		t.x = 115;
		t.y = 312;
		return t;
	};
	_proto.btn_last_i = function() {
		var t = new ui.ImageButton();
		this.btn_last = t;
		t.anchorOffsetX = 33;
		t.anchorOffsetY = 28;
		t.skewY = 180;
		t.source = "btn_next_png";
		t.x = 230.33;
		t.y = 312;
		return t;
	};
	_proto.btn_continue_i = function() {
		var t = new ui.ImageButton();
		this.btn_continue = t;
		t.anchorOffsetX = 22;
		t.anchorOffsetY = 32;
		t.source = "btn_contuine_png";
		t.x = 340.67;
		t.y = 311;
		return t;
	};
	_proto.btn_restart_i = function() {
		var t = new ui.ImageButton();
		this.btn_restart = t;
		t.anchorOffsetX = 34;
		t.anchorOffsetY = 33;
		t.source = "btn_restart_png";
		t.x = 450;
		t.y = 310;
		return t;
	};
	_proto.btn_music_i = function() {
		var t = new eui.ToggleButton();
		this.btn_music = t;
		t.x = 134.5;
		t.y = 136;
		t.skinName = PausePanel$Skin7;
		return t;
	};
	_proto.btn_voice_i = function() {
		var t = new eui.ToggleButton();
		this.btn_voice = t;
		t.x = 346;
		t.y = 136;
		t.skinName = PausePanel$Skin8;
		return t;
	};
	return PausePanel;
})(eui.Skin);
generateEUI.paths["resource/mySkin/ResultPanel.exml"] = window.skins.ResultPanel = (function(_super) {
	__extends(ResultPanel, _super);
	function ResultPanel() {
		_super.call(this);
		this.skinParts = [
			"icon_pass",
			"icon_result",
			"icon_completion",
			"g_completion",
			"bl_score",
			"bl_maxScore",
			"btn_back",
			"btn_restart",
			"btn_next",
		];

		this.elementsContent = [
			this._Image1_i(),
			this.icon_pass_i(),
			this._Image2_i(),
			this.icon_result_i(),
			this._Group1_i(),
			this.bl_score_i(),
			this.bl_maxScore_i(),
			this.btn_back_i(),
			this.btn_restart_i(),
		];
		this.icon_completion_i();

		this.g_completion_i();

		this.btn_next_i();

		this.states = [
			new eui.State("free", [
				new eui.SetProperty("_Group1", "y", 199),
				new eui.SetProperty("bl_score", "y", 196),
				new eui.SetProperty("bl_maxScore", "y", 259.5),
				new eui.SetProperty("btn_back", "x", 208),
				new eui.SetProperty("btn_restart", "x", 388),
			]),
			new eui.State("lv", [
				new eui.AddItems("icon_completion", "_Group1", 1, ""),
				new eui.AddItems("g_completion", "", 2, "bl_score"),
				new eui.AddItems("btn_next", "", 1, ""),
				new eui.SetProperty("btn_back", "x", 160),
				new eui.SetProperty("btn_restart", "x", 298),
			]),
		];
	}
	var _proto = ResultPanel.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "btn_panel_libao_png";
		t.y = 58.34;
		return t;
	};
	_proto.icon_pass_i = function() {
		var t = new eui.Image();
		this.icon_pass = t;
		t.anchorOffsetX = 153;
		t.anchorOffsetY = 164;
		t.source = "guoguanXzTX0_png";
		t.x = 295.45;
		t.y = 275.49;
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		t.source = "icon_red_silk_png";
		t.x = 116;
		t.y = 3.34;
		return t;
	};
	_proto.icon_result_i = function() {
		var t = new eui.Image();
		this.icon_result = t;
		t.source = "result_wenzigongxiguoguan_png";
		t.x = 163;
		t.y = 16.84;
		return t;
	};
	_proto._Group1_i = function() {
		var t = new eui.Group();
		this._Group1 = t;
		t.x = 139.8;
		t.y = 172.34;
		t.elementsContent = [this._Image3_i()];
		return t;
	};
	_proto._Image3_i = function() {
		var t = new eui.Image();
		t.source = "result_defen_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.icon_completion_i = function() {
		var t = new eui.Image();
		this.icon_completion = t;
		t.source = "result_wanchengdu_png";
		t.x = 1;
		t.y = 115;
		return t;
	};
	_proto.g_completion_i = function() {
		var t = new eui.Group();
		this.g_completion = t;
		t.height = 50;
		t.width = 162;
		t.x = 282.3;
		t.y = 278.34;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image4_i(), this._Image5_i(), this._Image6_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function() {
		var t = new eui.HorizontalLayout();
		return t;
	};
	_proto._Image4_i = function() {
		var t = new eui.Image();
		t.source = "smallStar_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Image5_i = function() {
		var t = new eui.Image();
		t.source = "smallStar_png";
		t.x = 69;
		t.y = 0;
		return t;
	};
	_proto._Image6_i = function() {
		var t = new eui.Image();
		t.source = "smallStar_png";
		t.x = 79;
		t.y = 10;
		return t;
	};
	_proto.bl_score_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_score = t;
		t.font = "fnt_nums_fnt";
		t.text = "232";
		t.x = 293.3;
		t.y = 169.34;
		return t;
	};
	_proto.bl_maxScore_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_maxScore = t;
		t.font = "fnt_nums_fnt";
		t.text = "111";
		t.x = 293.8;
		t.y = 232.84;
		return t;
	};
	_proto.btn_back_i = function() {
		var t = new ui.ImageButton();
		this.btn_back = t;
		t.anchorOffsetX = 31;
		t.anchorOffsetY = 32;
		t.source = "btn_last_png";
		t.x = 162.5;
		t.y = 400;
		return t;
	};
	_proto.btn_restart_i = function() {
		var t = new ui.ImageButton();
		this.btn_restart = t;
		t.anchorOffsetX = 34;
		t.anchorOffsetY = 33;
		t.source = "btn_restart_png";
		t.x = 297.5;
		t.y = 398;
		return t;
	};
	_proto.btn_next_i = function() {
		var t = new ui.ImageButton();
		this.btn_next = t;
		t.anchorOffsetX = 33;
		t.anchorOffsetY = 28;
		t.source = "btn_next_png";
		t.x = 433.5;
		t.y = 399;
		return t;
	};
	return ResultPanel;
})(eui.Skin);
generateEUI.paths["resource/mySkin/ShopPage.exml"] = window.skins.ShopPage = (function(_super) {
	__extends(ShopPage, _super);
	var ShopPage$Skin9 = (function(_super) {
		__extends(ShopPage$Skin9, _super);
		function ShopPage$Skin9() {
			_super.call(this);
			this.skinParts = [];

			this.elementsContent = [this._Image1_i()];
			this.states = [
				new eui.State("up", []),
				new eui.State("down", [new eui.SetProperty("_Image1", "source", "btn_buy_down_png")]),
				new eui.State("disabled", [new eui.SetProperty("_Image1", "source", "btn_buy_down_png")]),
			];
		}
		var _proto = ShopPage$Skin9.prototype;

		_proto._Image1_i = function() {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_buy_up_png";
			t.percentWidth = 100;
			return t;
		};
		return ShopPage$Skin9;
	})(eui.Skin);

	function ShopPage() {
		_super.call(this);
		this.skinParts = [
			"l_coin",
			"btn_return",
			"btn_pay",
			"btn_min",
			"btn_add",
			"g_btns",
			"c_hummer",
			"c_bomb",
			"c_color",
			"c_guid",
			"tool_hummer",
			"bl_cost_hummer",
			"bl_count_hummer",
			"g_hummer",
			"tool_bomb",
			"bl_cost_bomb",
			"bl_count_bomb",
			"g_bomb",
			"tool_color",
			"bl_cost_color",
			"bl_count_color",
			"g_color",
			"tool_guid",
			"bl_cost_guid",
			"bl_count_guid",
			"g_guid",
			"g_tool",
		];

		this.elementsContent = [
			this._Image1_i(),
			this._Image2_i(),
			this._Group1_i(),
			this.btn_return_i(),
			this.btn_pay_i(),
			this.g_btns_i(),
			this.g_tool_i(),
		];
	}
	var _proto = ShopPage.prototype;

	_proto._Image1_i = function() {
		var t = new eui.Image();
		t.height = 1136;
		t.source = "bg_png";
		return t;
	};
	_proto._Image2_i = function() {
		var t = new eui.Image();
		t.source = "text_shangcheng_png";
		t.x = 257;
		t.y = 52.26;
		return t;
	};
	_proto._Group1_i = function() {
		var t = new eui.Group();
		t.height = 74;
		t.width = 200;
		t.x = 36.01;
		t.y = 970.71;
		t.elementsContent = [this._Image3_i(), this._Image4_i(), this.l_coin_i()];
		return t;
	};
	_proto._Image3_i = function() {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "dijinbi_png";
		return t;
	};
	_proto._Image4_i = function() {
		var t = new eui.Image();
		t.source = "icon_coin_png";
		t.x = -6.08;
		t.y = -1.04;
		return t;
	};
	_proto.l_coin_i = function() {
		var t = new eui.Label();
		this.l_coin = t;
		t.bold = true;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 18;
		t.size = 34;
		t.text = "12123";
		t.y = 12;
		return t;
	};
	_proto.btn_return_i = function() {
		var t = new ui.ImageButton();
		this.btn_return = t;
		t.anchorOffsetX = 52;
		t.anchorOffsetY = 54;
		t.source = "btn_return_png";
		t.x = 87;
		t.y = 89;
		return t;
	};
	_proto.btn_pay_i = function() {
		var t = new eui.Button();
		this.btn_pay = t;
		t.label = "";
		t.x = 345.5;
		t.y = 952.64;
		t.skinName = ShopPage$Skin9;
		return t;
	};
	_proto.g_btns_i = function() {
		var t = new eui.Group();
		this.g_btns = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.x = 340;
		t.y = 8;
		t.elementsContent = [this.btn_min_i(), this.btn_add_i()];
		return t;
	};
	_proto.btn_min_i = function() {
		var t = new ui.ImageButton();
		this.btn_min = t;
		t.anchorOffsetX = 45;
		t.anchorOffsetY = 40;
		t.source = "btn_min_png";
		t.x = 45;
		t.y = 40;
		return t;
	};
	_proto.btn_add_i = function() {
		var t = new ui.ImageButton();
		this.btn_add = t;
		t.anchorOffsetX = 45;
		t.anchorOffsetY = 40;
		t.source = "btn_add_png";
		t.x = 215;
		t.y = 40;
		return t;
	};
	_proto.g_tool_i = function() {
		var t = new eui.Group();
		this.g_tool = t;
		t.left = 0;
		t.right = 0;
		t.touchChildren = true;
		t.touchEnabled = false;
		t.y = 242;
		t.elementsContent = [
			this.c_hummer_i(),
			this.c_bomb_i(),
			this.c_color_i(),
			this.c_guid_i(),
			this.g_hummer_i(),
			this.g_bomb_i(),
			this.g_color_i(),
			this.g_guid_i(),
		];
		return t;
	};
	_proto.c_hummer_i = function() {
		var t = new eui.Component();
		this.c_hummer = t;
		t.currentState = "hummer";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ShopItem";
		t.touchChildren = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.c_bomb_i = function() {
		var t = new eui.Component();
		this.c_bomb = t;
		t.currentState = "bomb";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ShopItem";
		t.touchChildren = false;
		t.x = 0;
		t.y = 133.99999999999997;
		return t;
	};
	_proto.c_color_i = function() {
		var t = new eui.Component();
		this.c_color = t;
		t.currentState = "color";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ShopItem";
		t.touchChildren = false;
		t.x = 0;
		t.y = 269;
		return t;
	};
	_proto.c_guid_i = function() {
		var t = new eui.Component();
		this.c_guid = t;
		t.currentState = "guid";
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "skins.ShopItem";
		t.touchChildren = false;
		t.x = 0;
		t.y = 403.31;
		return t;
	};
	_proto.g_hummer_i = function() {
		var t = new eui.Group();
		this.g_hummer = t;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchChildren = false;
		t.visible = false;
		t.x = 0;
		t.elementsContent = [this.tool_hummer_i(), this._Image5_i(), this.bl_cost_hummer_i(), this._Image6_i(), this.bl_count_hummer_i()];
		return t;
	};
	_proto.tool_hummer_i = function() {
		var t = new eui.Component();
		this.tool_hummer = t;
		t.currentState = "hummer";
		t.name = "hummer";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 90;
		t.y = 0;
		return t;
	};
	_proto._Image5_i = function() {
		var t = new eui.Image();
		t.scaleX = 0.4;
		t.scaleY = 0.4;
		t.source = "icon_coin_png";
		t.x = 260;
		t.y = 26;
		return t;
	};
	_proto.bl_cost_hummer_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_cost_hummer = t;
		t.font = "fnt_score_fnt";
		t.left = 290;
		t.text = "100";
		t.y = 28;
		return t;
	};
	_proto._Image6_i = function() {
		var t = new eui.Image();
		t.scale9Grid = new egret.Rectangle(39, 21, 43, 19);
		t.source = "an_png";
		t.x = 410;
		t.y = 10;
		return t;
	};
	_proto.bl_count_hummer_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_count_hummer = t;
		t.font = "fnt_scroe2_fnt";
		t.horizontalCenter = 151;
		t.text = "12";
		t.y = 16;
		return t;
	};
	_proto.g_bomb_i = function() {
		var t = new eui.Group();
		this.g_bomb = t;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchChildren = false;
		t.visible = false;
		t.x = 0;
		t.y = 133.66666666666669;
		t.elementsContent = [this.tool_bomb_i(), this._Image7_i(), this.bl_cost_bomb_i(), this._Image8_i(), this.bl_count_bomb_i()];
		return t;
	};
	_proto.tool_bomb_i = function() {
		var t = new eui.Component();
		this.tool_bomb = t;
		t.currentState = "bomb";
		t.name = "bomb";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 90;
		return t;
	};
	_proto._Image7_i = function() {
		var t = new eui.Image();
		t.scaleX = 0.4;
		t.scaleY = 0.4;
		t.source = "icon_coin_png";
		t.x = 260;
		t.y = 26;
		return t;
	};
	_proto.bl_cost_bomb_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_cost_bomb = t;
		t.font = "fnt_score_fnt";
		t.left = 290;
		t.text = "100";
		t.y = 29;
		return t;
	};
	_proto._Image8_i = function() {
		var t = new eui.Image();
		t.scale9Grid = new egret.Rectangle(39, 21, 43, 19);
		t.source = "an_png";
		t.x = 409;
		t.y = 10;
		return t;
	};
	_proto.bl_count_bomb_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_count_bomb = t;
		t.font = "fnt_scroe2_fnt";
		t.horizontalCenter = 150;
		t.text = "12";
		t.y = 16;
		return t;
	};
	_proto.g_color_i = function() {
		var t = new eui.Group();
		this.g_color = t;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchChildren = false;
		t.visible = false;
		t.x = 0;
		t.y = 266.33333333333337;
		t.elementsContent = [this.tool_color_i(), this._Image9_i(), this.bl_cost_color_i(), this._Image10_i(), this.bl_count_color_i()];
		return t;
	};
	_proto.tool_color_i = function() {
		var t = new eui.Component();
		this.tool_color = t;
		t.currentState = "color";
		t.name = "color";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 90;
		return t;
	};
	_proto._Image9_i = function() {
		var t = new eui.Image();
		t.scaleX = 0.4;
		t.scaleY = 0.4;
		t.source = "icon_coin_png";
		t.x = 260;
		t.y = 26;
		return t;
	};
	_proto.bl_cost_color_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_cost_color = t;
		t.font = "fnt_score_fnt";
		t.left = 290;
		t.text = "100";
		t.y = 29;
		return t;
	};
	_proto._Image10_i = function() {
		var t = new eui.Image();
		t.scale9Grid = new egret.Rectangle(39, 21, 43, 19);
		t.source = "an_png";
		t.x = 409;
		t.y = 10;
		return t;
	};
	_proto.bl_count_color_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_count_color = t;
		t.font = "fnt_scroe2_fnt";
		t.horizontalCenter = 150;
		t.text = "12";
		t.y = 16;
		return t;
	};
	_proto.g_guid_i = function() {
		var t = new eui.Group();
		this.g_guid = t;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchChildren = false;
		t.visible = false;
		t.x = 0;
		t.y = 400;
		t.elementsContent = [this.tool_guid_i(), this._Image11_i(), this.bl_cost_guid_i(), this._Image12_i(), this.bl_count_guid_i()];
		return t;
	};
	_proto.tool_guid_i = function() {
		var t = new eui.Component();
		this.tool_guid = t;
		t.currentState = "guid";
		t.name = "guid";
		t.skinName = "skins.ToolItem";
		t.touchChildren = false;
		t.touchEnabled = true;
		t.x = 90;
		return t;
	};
	_proto._Image11_i = function() {
		var t = new eui.Image();
		t.scaleX = 0.4;
		t.scaleY = 0.4;
		t.source = "icon_coin_png";
		t.x = 260;
		t.y = 26;
		return t;
	};
	_proto.bl_cost_guid_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_cost_guid = t;
		t.font = "fnt_score_fnt";
		t.left = 290;
		t.text = "100";
		t.y = 29;
		return t;
	};
	_proto._Image12_i = function() {
		var t = new eui.Image();
		t.scale9Grid = new egret.Rectangle(39, 21, 43, 19);
		t.source = "an_png";
		t.x = 409;
		t.y = 10;
		return t;
	};
	_proto.bl_count_guid_i = function() {
		var t = new eui.BitmapLabel();
		this.bl_count_guid = t;
		t.font = "fnt_scroe2_fnt";
		t.horizontalCenter = 150;
		t.text = "120";
		t.y = 16;
		return t;
	};
	return ShopPage;
})(eui.Skin);
