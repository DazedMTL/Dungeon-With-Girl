// --------------------------------------------------------------------------
// 
// PNDK_LuggageCapacity
// Copyright (c) 2019 PANDAKO
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// 
// --------------------------------------------------------------------------
/*:
 * @plugindesc This plugin sets weights for items.
 * @author PANDAKO
 *
 * @help
 * Meta tag:
 *   <weight:10>
 * 
 * Plugin Command: {Optional}
 *   PNDK_LC getSurplusWeights [variable ID]
 *   PNDK_LC getAllItemWeights [variable ID]
 *   PNDK_LC getItemWeights [variable ID] [Item ID] {quantity}
 *   PNDK_LC getWeaponWeights [variable ID] [Weapon ID] {quantity}
 *   PNDK_LC getArmorWeights [variable ID] [Armor ID] {quantity}
 *   PNDK_LC checkWeights
 *
 * Disclaimer:
 *   I will not be responsible for any accident or injures.
 * 
 * @param Carry point
 * @desc Max weights.
 * @default 1000
 * 
 * @param Excess handling in EnemyDrop
 * @desc Excess weight of drop item after battles.
 * Discard, Choice
 * @default Discard
 * @type select
 * @option Discard
 * @value Discard
 * @option Choice
 * @value Choice
 * @option Get
 * @value Get
 *
 * @param Excess handling in GainItem
 * @desc Excess weight of items obtained at the events.
 * Discard, Choice
 * @default Discard
 * @type select
 * @option Discard
 * @value Discard
 * @option Choice
 * @value Choice
 * @option Get
 * @value Get
 *
 * @param Default weight
 * @desc Default weight.
 * @default 10
 * @type number
 * @min -999
 * 
 * @param Unit
 * @desc Unit for weight.
 * @default W
 * 
 * @param Attribute name
 * @desc Name for attribute.
 * @default Weights
 * 
 * @param Window layout in menu
 * @desc Layout of the weights window in menu.
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * @type combo
 * @option Default
 * @option TopLeft
 * @option TopRight
 * @option BottomLeft
 * @option BottomRight
 * 
 * @param Window opacity in menu
 * @desc Opacity of the weights window in menu.
 * 0～255
 * @default 255
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Window layout in item window
 * @desc Layout of the weights window in menu.
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * @type combo
 * @option Default
 * @option TopLeft
 * @option TopRight
 * @option BottomLeft
 * @option BottomRight
 * 
 * @param Window opacity in item window
 * @desc Opacity of the weights window in menu.
 * 0～255
 * @default 255
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Window layout in shop
 * @desc Layout of the weights window in shop.
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * @type combo
 * @option Default
 * @option TopLeft
 * @option TopRight
 * @option BottomLeft
 * @option BottomRight
 * 
 * @param Window opacity in shop
 * @desc Opacity of the weights window in shop.
 * 0～255
 * @default 255
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Font color when weight exceeded
 * @desc Font color when the weight is exceeded.
 * HTML color(HEX)
 * @default #ff0000
 * @type string
 * 
 * @param Dialog title
 * @desc Warning dialog title.
 * @default weight is exceeded!
 * @type string
 * 
 * @param Dialog message
 * @desc Warning dialog message.
 * @default Need to reduce total weight.
 * @type string
 * 
 */

/*:ja
 * @plugindesc アイテムや武器・防具の所持できる数を重量（ポイント）制にします。
 * @author パンダコ
 *
 * @help
 * このプラグインを有効にすると、個々のアイテムや武器・防具（以下アイテム）に
 * 重さが設定できるようになり、パーティーは決められた総重量までしかアイテムを
 * 所持できなくなります。
 * 
 * ■重さの設定方法
 * アイテムのメモ欄に以下のようなメタタグを記入してください。
 * <weight:10>
 * 上記の場合、重さが10に設定されます。
 * 重さが設定されていないものは、パラメータで設定された Default weight の
 * 重さになります。
 * また、値には制御文字が利用できるので、
 * <weight:\V[1]>
 * などと設定すればアイテムの重さを変数で管理することもできます。
 * 
 * ■持てる重さの上限をイベントで変更したい時
 * パラメータの Carry point には制御文字が利用できるので、\V[1] などと
 * 設定すれば変数で上限を管理できます。
 * 
 * ■敵のドロップアイテムによる重量オーバーについて
 * 敵のドロップアイテムにより重量オーバーした場合は、破棄するかアイテム画面を
 * 表示するかをパラメータの Excess handling in EnemyDrop で設定できます。
 * 初期値の Discard は破棄です。
 * Choice に設定すると重量オーバーした場合にのみ、戦闘終了後にアイテム画面が
 * 表示されるようになります。
 * ただし、このプラグイン単体ではアイテム画面から「捨てる」は行なえないので、
 * 別途アイテム画面で「捨てる」を可能にするプラグインが必要です。
 * Get に設定すると強制的に取得します。
 * 
 * ■アイテム入手イベントによる重量オーバーについて
 * アイテム入手イベントにより重量オーバーした場合は、破棄するかアイテム画面を
 * 表示するかをパラメータの Excess handling in GainItem で設定できます。
 * 初期値の Discard は破棄です。
 * Choice に設定すると重量オーバーした場合にのみ、すぐにアイテム画面が表示
 * されるようになります。
 * Get に設定すると強制的に取得します。これは複数のアイテムを同時に入手
 * するような場面が多いときに便利です。
 * 一連のアイテム入手コマンドが終わってから、重量オーバーしているかチェックできる
 * プラグインコマンド PNDK_LC checkWeights を実行することで、
 * アイテムウィンドウが開くのを一回にまとめることができます。
 * ただし、このプラグイン単体ではアイテム画面から「捨てる」は行なえないので、
 * 別途アイテム画面で「捨てる」を可能にするプラグインが必要です。
 *  
 * ★「捨てる」を可能にするプラグインについて
 * フトコロさんの FTKR_ItemSubCommand プラグインによる「捨てる」に、いちおう
 * 対応しています。
 * なお、FTKR_ItemSubCommand プラグインは、このプラグインよりも先に
 * （プラグイン管理画面で上に）読み込まれている必要があります。
 * 
 * ■プラグインコマンド
 * （※アイテム ID 及び個数には制御文字が使えます）
 * （※個数は省略できます。省略すると1個分とみなします）
 * 
 * ・所持できる残りの重量を変数0001へ代入します。
 *   PNDK_LC getSurplusWeights 1
 * 
 * ・所持しているアイテムの総重量を変数0007へ代入します。
 *   PNDK_LC getAllItemWeights 7
 * 
 * ・ID 0005 のアイテム3個分の重量を変数0010へ代入します。
 *   PNDK_LC getItemWeights 10 5 3
 *
 * ・変数0010に格納された ID の武器1個分の重量を変数0011へ代入します。
 *   PNDK_LC getWeaponWeights 11 \V[10]
 *
 * ・変数0015に格納された ID の防具が変数0020に格納された個数分の重量を
 *   変数0012へ代入します。
 *   PNDK_LC getArmorWeights 12 \V[15] \V[20]
 *
 * ・重量オーバーしているか確認し、重量オーバーしている場合はアイテムウィンドウが
 * 　開くコマンドです。
 *   PNDK_LC checkWeights
 * 
 * ■総重量ウィンドウの位置について
 * パラメータ Window layout in ○○ を以下の値にすることで、
 * 総重量ウィンドウの位置を変更できます。
 * 
 * Default        #初期位置（所持金の上）
 * TopLeft        #画面の左上
 * TopRight       #画面の右上
 * BottomLeft     #画面の左下
 * BottomRight    #画面の右下
 * 
 * ■仕様
 * ・メニュー画面とアイテム画面とショップ画面に重量ウィンドウが追加されます。
 * ・ショップ画面の商品選択時に対象の重さが表示されます。
 * ・ショップ画面の数量選択時に重さの小計が表示されます。
 * ・アイテム画面とショプ画面ではアイテムの説明欄が小さくなるので文字数に
 * 　注意してください。
 * ・装備しているものも総重量に含まれます。
 * ・控えメンバーの装備も総重量に含まれます。
 * ・「大事なもの」の重さも総重量に含まれます。
 * ・重さなし <weight:0> も可能です。
 * ・システムで定められた上限（通常は99個）以上には所持できません。
 * ・重量オーバーしているとアイテム画面を閉じることができなくなります。
 * 
 * ■更新履歴
 * Version:1.4.0［2019/11/05］
 * にゃたまさんのご協力により、以下の機能が追加されました。
 * ・イベントによるアイテム入手時にも破棄か整理かを選択できるようになりました。
 * ・重量オーバーしている時の総重量の文字色が変更できるようになりました。
 * ・重量オーバーしていると、アイテムウィンドウを開いたときと、閉じようとしたときに
 * 　警告ウィンドウが表示されるようになりました。
 * ・重量オーバーしている時はアイテムウィンドウが開くコマンドが追加されました。
 * 強制的な入手が設定できるようになりました。
 * 
 * Version:1.3.1［2019/05/17］
 * 防具の重量が正しく取得できていなかったバグを修正しました。
 * 
 * Version:1.3.0［2019/01/16］
 * にゃたまさん作成のコードを追記し、アイテムの重さを変数に代入できるように
 * なりました。
 * 重さの値に制御文字を利用できるようにしました。
 * 
 * Version:1.2.1［2018/11/22］
 * プラグインのパラメータを設定しやすくしました。
 * プラグインのカスタマイズ用コメントをコード内に追記。
 * 
 * Version:1.2.0［2017/10/15］
 * 敵ドロップアイテムにより重量オーバーした場合の処理を
 * 破棄か整理かを選択できる機能の追加。
 * 
 * Version:1.1.2［2017/10/14］
 * フトコロさんの FTKR_ItemSubCommand プラグインによる「捨てる」に対応。
 * 
 * Version:1.1.1［2017/10/14］
 * 装備をはずすと消えてしまうことがあるバグを修正。
 * アイテム画面に重量ウィンドウを追加。
 * 
 * Version:1.1.0［2016/11/11］
 * 総重量ウィンドウの位置と不透明度を選択できる機能を追加。
 * 
 * Version:1.0.0［2016/11/10］
 * 初版
 * 
 * ■ライセンス
 * Copyright (c) 2019 PANDAKO
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * 
 * [Blog : http://note.pandako.com/]
 * 
 * ■免責事項
 * このプラグインの利用により利用者または第三者に生じたいかなる損害や
 * 不利益も、このプラグインの開発者はその責任を負いません。
 * 
 * 
 * @param Carry point
 * @desc 所持できる総重量の上限。
 * 制御文字が利用できます。
 * @default 1000
 * 
 * @param Excess handling in EnemyDrop
 * @desc 敵ドロップアイテムにより重量オーバーした際の対応方法。
 * Discard(破棄), Choice(アイテム画面表示), Get（強制入手）
 * @default Discard
 * @type select
 * @option Discard（アイテム破棄）
 * @value Discard
 * @option Choice（アイテム画面表示）
 * @value Choice
 * @option Get（アイテム強制入手）
 * @value Get
 *
 * @param Excess handling in GainItem
 * @desc アイテム入手イベントにより重量オーバーした際の対応方法。
 * Discard(破棄), Choice(アイテム画面表示), Get（強制入手）
 * @default Discard
 * @type select
 * @option Discard（アイテム破棄）
 * @value Discard
 * @option Choice（アイテム画面表示）
 * @value Choice
 * @option Get（アイテム強制入手）
 * @value Get
 *
 * @param Default weight
 * @desc 重さの初期値。weight を設定していないアイテムや武器・防具はこの重さになります。
 * @default 10
 * @type number
 * @min -999
 * 
 * @param Unit
 * @desc 重さの単位。
 * @default Ｗ
 * 
 * @param Attribute name
 * @desc 重さの用語。
 * @default 重さ
 * 
 * @param Window layout in menu
 * @desc メニュー画面での総重量ウィンドウの位置
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * @type combo
 * @option Default
 * @option TopLeft
 * @option TopRight
 * @option BottomLeft
 * @option BottomRight
 * 
 * @param Window opacity in menu
 * @desc メニュー画面での総重量ウィンドウの不透明度
 * 0～255（0 透明 ⇔ 255 不透明）
 * @default 255
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Window layout in item
 * @desc アイテム画面での総重量ウィンドウの位置
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * @type combo
 * @option Default
 * @option TopLeft
 * @option TopRight
 * @option BottomLeft
 * @option BottomRight
 * 
 * @param Window opacity in item
 * @desc アイテム画面での総重量ウィンドウの不透明度
 * 0～255（0 透明 ⇔ 255 不透明）
 * @default 255
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Window layout in shop
 * @desc ショップ画面での総重量ウィンドウの位置
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * @type combo
 * @option Default
 * @option TopLeft
 * @option TopRight
 * @option BottomLeft
 * @option BottomRight
 * 
 * @param Window opacity in shop
 * @desc ショップ画面での総重量ウィンドウの不透明度
 * 0～255（0 透明 ⇔ 255 不透明）
 * @default 255
 * @type number
 * @min 0
 * @max 255
 * 
 * @param Font color when weight exceeded
 * @desc 重量オーバーしているときの文字色
 * HTML カラー(HEX)
 * @default #ff0000
 * @type string
 * 
 * @param Dialog title
 * @desc 重量オーバー警告ウィンドウのタイトル
 * @default 重量オーバーです！
 * @type string
 * 
 * @param Dialog message
 * @desc 重量オーバー警告ウィンドウのメッセージ
 * @default 総重量を減らしてください。
 * @type string
 * 
 */

(function () {
	//プラグインマネージャーで設定されたパラメータを取得
	var parameters = PluginManager.parameters('PNDK_LuggageCapacity');

	//パラメータを変数へ
	var cp = parameters['Carry point'];
	//var isChoice = parameters['Excess handling'] == "Choice";
	//var isChoice_EnemyDrop = parameters['Excess handling in EnemyDrop'] == "Choice";//Edit by nyatama
	//var isChoice_GainItem = parameters['Excess handling in GainItem'] == "Choice";//Add by nyatama
	var HandlingEnemyDrop = parameters['Excess handling in EnemyDrop'];
	var HandlingGainItem = parameters['Excess handling in GainItem'];
	var defW = Number(parameters['Default weight']);
	var wUnit = parameters['Unit'];
	var wText = parameters['Attribute name'];
	var layoutMenu = parameters['Window layout in menu'];
	var opacityMenu = parseInt(parameters['Window opacity in menu'], 10);
	var layoutItem = parameters['Window layout in item'];
	var opacityItem = parseInt(parameters['Window opacity in item'], 10);
	var layoutShop = parameters['Window layout in shop'];
	var opacityShop = parseInt(parameters['Window opacity in shop'], 10);
	var overFontColor = parameters['Font color when weight exceeded'];
	var DialogTitle = parameters['Dialog title'];
	var DialogMsg = parameters['Dialog message'];

	//最大積載量の取得
	function getCP() {
		return Number(Window_Base.prototype.convertEscapeCharacters(cp));
	}

	//それの重量
	function getWeight(item, amount) {
		if (item) {
			var w = item.meta.weight;
			if (w !== undefined) {
				w = Number(Window_Base.prototype.convertEscapeCharacters(w));
				return w * amount;
			} else {
				return defW * amount;
			}
			//return item.meta.weight !== undefined ? (item.meta.weight * amount) : defW * amount;
		}
		//itemがnullの場合もある（装備していない時や全部解除したときなど）
		return 0;
	}

	// 2019/01/07 Add start by nyatama
	//アイテム重量取得
	function getItemWeights(value, num) {
		var itemId = Number(Window_Base.prototype.convertEscapeCharacters(value));
		var item = $dataItems[itemId];
		if (num == null) num = 1;
		else num = Number(Window_Base.prototype.convertEscapeCharacters(num));
		return getWeight(item, num);
	}

	//武器重量取得
	function getWeaponWeights(value, num) {
		var weaponId = Number(Window_Base.prototype.convertEscapeCharacters(value));
		var weapon = $dataWeapons[weaponId];
		if (num == null) num = 1;
		else num = Number(Window_Base.prototype.convertEscapeCharacters(num));
		return getWeight(weapon, num);
	}

	//防具重量取得
	function getArmorWeights(value, num) {
		var armorId = Number(Window_Base.prototype.convertEscapeCharacters(value));
		var armor = $dataArmors[armorId];
		if (num == null) num = 1;
		else num = Number(Window_Base.prototype.convertEscapeCharacters(num));
		return getWeight(armor, num);
	}
	// 2019/01/07 Add end by nyatama

	//総重量取得
	function getAllItemWeights() {
		var w = 0;
		//アイテム・武器・防具
		$gameParty.allItems().forEach(function (item) {
			var n = $gameParty.numItems(item);
			w += getWeight(item, n);
		});
		//全アクターの装備品
		$gameParty.allMembers().forEach(function (actor) {
			actor.equips().forEach(function (item) {
				w += getWeight(item, 1);
			});
		});
		return w;
	}

	//持てるかチェック
	function canHaveItem(item, amount) {
		return getCP() >= (getAllItemWeights() + getWeight(item, amount));
	}

	//余剰積載量
	function getSurplusCP() {
		return getCP() - getAllItemWeights();
	}

	// Add start by nyatama
	//重量オーバー警告ウィンドウ=====================================================================
	function Window_OverCP() {
		this.initialize.apply(this, arguments);
	}

	Window_OverCP.prototype = Object.create(Window_Base.prototype);
	Window_OverCP.prototype.constructor = Window_OverCP;

	Window_OverCP.prototype.initialize = function (x, y, w, h) {
		Window_Base.prototype.initialize.call(this, x, y, w, h);
		this.refresh();
	};

	Window_OverCP.prototype.refresh = function () {
		var x = this.textPadding();
		var y = 0;
		var width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		this.drawOverCpValue(DialogTitle, x, y + this.fittingHeight(0), width);
		this.drawOverCpValue(DialogMsg, x, y + this.fittingHeight(1), width);
	};

	Window_OverCP.prototype.drawOverCpValue = function (value, x, y, width) {
		this.resetFontSettings();
		this.drawText(value, x, y, width, 'center');
	};
	// Add end by nyatama

	// Add start by nyatama
	//重量オーバー警告ウィンドウ内のOKボタン=====================================================================
	function Window_OverCP_Command() {
		this.initialize.apply(this, arguments);
	}

	Window_OverCP_Command.prototype = Object.create(Window_Selectable.prototype);
	Window_OverCP_Command.prototype.constructor = Window_OverCP_Command;

	Window_OverCP_Command.prototype.initialize = function (x, y, w) {
		Window_Selectable.prototype.initialize.call(this, x, y, w, this.fittingHeight(1));
		this.okText = 'OK';
		this.refresh();
		this.select(0);
		this.activate();
	};

	Window_OverCP_Command.prototype.maxItems = function () {
		return 1;
	};

	Window_OverCP_Command.prototype.maxCols = function () {
		return 1;
	};

	Window_OverCP_Command.prototype.refresh = function () {
		var rectOk = this.itemRectForText(0);
		this.drawText(this.okText, rectOk.x, rectOk.y, rectOk.width, "center");
	};
	// Add end by nyatama

	//CPウィンドウ=====================================================================
	function Window_CP() {
		this.initialize.apply(this, arguments);
	}

	Window_CP.prototype = Object.create(Window_Base.prototype);
	Window_CP.prototype.constructor = Window_CP;

	Window_CP.prototype.initialize = function (x, y, w, h) {
		Window_Base.prototype.initialize.call(this, x, y, w, h);
		this.refresh();
	};

	Window_CP.prototype.refresh = function () {
		var x = this.textPadding();
		var width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		this.drawCpValue(getAllItemWeights(), x, 0, width);
	};

	Window_Base.prototype.drawCpValue = function (value, x, y, width) {
		var unitWidth = this.textWidth(wUnit) + this.textPadding();
		var cpWidth = this.textWidth(getCP());
		var slashWidth = this.textWidth("／");
		var sCpWidth = width - (slashWidth + cpWidth + unitWidth);
		//
		this.resetFontSettings();
		//this.makeFontSmaller();
		// 2019/03/28 Add start by nyatama
		if (getSurplusCP() < 0) {
			this.changeTextColor(overFontColor);
		}
		// 2019/03/28 Add end by nyatama
		this.drawText(value, x, y, sCpWidth, 'right');
		//
		this.changeTextColor(this.systemColor());
		this.drawText("／", (x + sCpWidth), y, slashWidth, 'right');
		//
		this.resetTextColor();
		this.drawText(getCP(), (x + sCpWidth + slashWidth), y, cpWidth, 'right');
		//
		this.changeTextColor(this.systemColor());
		this.drawText(wUnit, (x + sCpWidth + slashWidth + cpWidth), y, unitWidth, 'right');
	};

	//メニュー画面にCPウィンドウを追加---------------------------------------------------------------
	var _Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function () {
		_Scene_Menu_create.call(this);
		//
		this.createCpWindow(layoutMenu, opacityMenu);
	};

	Scene_MenuBase.prototype.createCpWindow = function (layout, opacity) {
		var x = 0;
		var y = 0;
		var w = 240;
		var h = 240;
		//
		if (this._goldWindow) {
			//既に所持金ウィンドウがある場合はそれを基準とする
			x = this._goldWindow.x;
			y = this._goldWindow.y - this._goldWindow.height;
			w = this._goldWindow.width;
			h = this._goldWindow.height;
		} else {
			//所持金ウィンドウがない場合（item画面）はヘルプウィンドウを利用
			x = this._helpWindow.width;
			w = Graphics.boxWidth - this._helpWindow.width;
			h = this._helpWindow.fittingHeight(1);
			y = this._helpWindow.height - h;
		}
		//設定により書き換え
		if (layout == "TopLeft") {
			x = 0;
			y = 0;
		} else if (layout == "TopRight") {
			x = Graphics.boxWidth - w;
			y = 0;
		} else if (layout == "BottomLeft") {
			x = 0;
			y = Graphics.boxHeight - h;
		} else if (layout == "BottomRight") {
			x = Graphics.boxWidth - w;
			y = Graphics.boxHeight - h;
		}
		//▼ここから独自のウインドウサイズと位置を指定したい場合のサンプル
		/*
		ここでパラメータ Window layout in ○○ で利用できる独自の値を設定できます。
		下記のサンプルでは OriginalLayout01、OriginalLayout02、OriginalLayout03 の3つを作成しています。
		変数 x には横の位置、y には縦の位置、w にはウィンドウの幅、h にはウィンドウの高さの数値を代入します。
		その上でパラメータ Window layout in ○○ に該当する文字列（OriginalLayout01など）を設定することで、任意の位置とサイズで表示することができます。
		*/
		//OriginalLayout01 を作成
		if (layout == "OriginalLayout01") {
			//以下は Default 設定時のメニュー画面での数値です。参考にしてください。
			x = 0;
			y = 480;
			w = 240;
			h = 72;
		}
		//OriginalLayout02 を作成
		if (layout == "OriginalLayout02") {
			//以下は Default 設定時のアイテム画面での数値です。参考にしてください。
			x = 576;
			y = 36;
			w = 240;
			h = 72;
		}
		//OriginalLayout03 を作成
		if (layout == "OriginalLayout03") {
			//以下は Default 設定時のショップ画面での数値です。参考にしてください。
			x = 576;
			y = 36;
			w = 240;
			h = 72;
		}
		//▲サンプルここまで
		this._cpWindow = new Window_CP(x, y, w, h);
		this._cpWindow.opacity = opacity;
		this.addWindow(this._cpWindow);
	};

	//小さなヘルプウィンドウを作れるようにする---------------------------------------------------------------
	var _Window_Help_initialize = Window_Help.prototype.initialize;
	Window_Help.prototype.initialize = function (numLines, isShort) {
		if (isShort) {
			var width = Graphics.boxWidth - Window_Gold.prototype.windowWidth();
			var height = this.fittingHeight(numLines || 2);
			Window_Base.prototype.initialize.call(this, 0, 0, width, height);
			this._text = '';
		} else {
			_Window_Help_initialize.call(this, numLines);
		}
	};

	//shop画面のヘルプウィンドウを小さくする---------------------------------------------------------------
	Scene_Shop.prototype.createHelpWindow = function () {
		this._helpWindow = new Window_Help(2, true);
		this.addWindow(this._helpWindow);
	};

	//shop画面にCPウィンドウを追加---------------------------------------------------------------
	var _Scene_Shop_create = Scene_Shop.prototype.create;
	Scene_Shop.prototype.create = function () {
		_Scene_Shop_create.call(this);
		//
		this.createCpWindow(layoutShop, opacityShop);
	};

	//商品購入時の購入可能最大数取得を書き換え---------------------------------------------------------------
	var _Scene_Shop_maxBuy = Scene_Shop.prototype.maxBuy;
	Scene_Shop.prototype.maxBuy = function () {
		var r = _Scene_Shop_maxBuy.call(this);
		var w = getWeight(this._item, 1);
		if (w === 0) {
			return r;
		} else {
			return Math.min(r, Math.floor(getSurplusCP() / w));
		}
	};

	//商品選択時の購入可否判定を書き換え---------------------------------------------------------------
	var _Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
	Window_ShopBuy.prototype.isEnabled = function (item) {
		return _Window_ShopBuy_isEnabled.call(this, item) && canHaveItem(item, 1);
	};

	//売買時にCPウィンドウを更新するよう書き換え---------------------------------------------------------------
	var _Scene_Shop_onNumberOk = Scene_Shop.prototype.onNumberOk;
	Scene_Shop.prototype.onNumberOk = function () {
		_Scene_Shop_onNumberOk.call(this);
		//
		this._cpWindow.refresh();
	};

	//数量選択画面に重さを追加---------------------------------------------------------------
	var _Window_ShopNumber_refresh = Window_ShopNumber.prototype.refresh;
	Window_ShopNumber.prototype.refresh = function () {
		_Window_ShopNumber_refresh.call(this);
		//
		this.drawWeight();
	};

	Window_ShopNumber.prototype.drawWeight = function () {
		var total = getWeight(this._item, this._number);
		var width = this.contentsWidth() - this.textPadding();
		//drawCurrencyValue を代用
		this.drawCurrencyValue(total, wUnit, 0, this.weightY(), width);
	};

	Window_ShopNumber.prototype.weightY = function () {
		return Math.round(this.contentsHeight() / 2 - this.lineHeight() * 0.5);
	};

	//shopのステータスウィンドウに重さを追加---------------------------------------------------------------
	var _Window_ShopStatus_drawPossession = Window_ShopStatus.prototype.drawPossession;
	Window_ShopStatus.prototype.drawPossession = function (x, y) {
		_Window_ShopStatus_drawPossession.call(this, x, y);
		//
		var width = this.contents.width - (this.textPadding() + x);
		var wTextWidth = this.textWidth(wText);
		var wY = this.lineHeight();
		this.changeTextColor(this.systemColor());
		this.drawText(wText, x, wY, wTextWidth);
		this.resetTextColor();
		this.drawText(getWeight(this._item, 1), (x + wTextWidth), wY, (width - wTextWidth), 'right');
	};

	//item画面のヘルプウィンドウを小さくする---------------------------------------------------------------
	Scene_Item.prototype.createHelpWindow = function () {
		this._helpWindow = new Window_Help(2, true);
		this.addWindow(this._helpWindow);
	};

	//item画面にCPウィンドウを追加---------------------------------------------------------------
	//Itemウィンドウの次にCPウィンドウを追加したいのでここで実行
	var _Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
	Scene_Item.prototype.createItemWindow = function () {
		_Scene_Item_createItemWindow.call(this);
		//
		this.createCpWindow(layoutItem, opacityItem);
		// 2019/03/28 Add start by nyatama
		//重量オーバーしていたら警告窓を表示
		if (getSurplusCP() < 0) {
			//ブザー
			SoundManager.playBuzzer();
			//警告窓を表示
			this.showOverCpWindow();
		}
		// 2019/03/28 Add end by nyatama
	}

	// 2019/03/28 Add start by nyatama
	Scene_Item.prototype.showOverCpWindow = function () {
		var width = 500;
		var height = 200;
		var x = Graphics.boxWidth / 2 - width / 2;
		var y = Graphics.boxHeight / 2 - height / 2;
		this._categoryWindow.deactivate();
		//重量オーバー警告ウィンドウを表示
		this._overCpWindow = new Window_OverCP(x, y, width, height);
		this._overCpWindow.opacity = 255;
		this.addWindow(this._overCpWindow);
		//ウィンドウ下にOKボタンを表示
		this._overCpCommand = new Window_OverCP_Command(x, y + height, width);
		this._overCpCommand.setHandler('ok', this.onOverCpOk.bind(this));
		this.addWindow(this._overCpCommand);
	}

	Scene_Item.prototype.onOverCpOk = function () {
		this._categoryWindow.activate();
		this._categoryWindow.select(0);
		this._overCpWindow.deactivate();
		this._overCpWindow.hide();
		this._overCpCommand.hide();
	}
	// 2019/03/28 Add end by nyatama

	//アイテム使用時にCPウィンドウを更新---------------------------------------------------------------
	var _Scene_Item_useItem = Scene_Item.prototype.useItem;
	Scene_Item.prototype.useItem = function () {
		_Scene_Item_useItem.call(this);
		//
		this._cpWindow.refresh();
	};

	//【旧】重量オーバー時にはitem画面を閉じられないようにする---------------------------------------------------------------
	/*
	Window_ItemCategory.prototype.processCancel = function() {
		if (getSurplusCP() < 0) {
			//ブザー
			SoundManager.playBuzzer();
		} else {
			Window_Selectable.prototype.processCancel.call(this);
		}
	};
	*/

	// 2019/03/28 Add start by nyatama
	//重量オーバー時にはitem画面を閉じられないようにする---------------------------------------------------------------
	var _Scene_Item_popScene = Scene_Item.prototype.popScene;
	Scene_Item.prototype.popScene = function () {
		if (getSurplusCP() < 0) {
			//ブザー
			SoundManager.playBuzzer();
			//警告窓を表示
			this.showOverCpWindow();
		} else {
			//アイテム画面を閉じる
			_Scene_Item_popScene.call(this);
		}
	};
	// 2019/03/28 Add end by nyatama

	//アイテム増減処理の書き換え---------------------------------------------------------------
	var _Game_Party_gainItem = Game_Party.prototype.gainItem;
	Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
		if (amount > 0) {
			if (canHaveItem(item, amount)) {
				_Game_Party_gainItem.call(this, item, amount, includeEquip);
			} else {
				if (HandlingGainItem === "Choice") {
					_Game_Party_gainItem.call(this, item, amount, includeEquip);
					SceneManager.push(Scene_Item);
				} else if (HandlingGainItem === "Get") {
					_Game_Party_gainItem.call(this, item, amount, includeEquip);
				} else {
					//Discard
				}
			}
			/*
			if (canHaveItem(item, amount)) {
				//増減可能
				_Game_Party_gainItem.call(this, item, amount, includeEquip);
			} else {
				// 2019/05/17 Add start by nyatama
				//重量オーバー
				if(isChoice_GainItem) {
					//増減可能
					_Game_Party_gainItem.call(this, item, amount, includeEquip);
					//アイテム画面
					SceneManager.push(Scene_Item);
				}
				// 2019/05/17 Add end by nyatama
			}
			*/
		} else {
			_Game_Party_gainItem.call(this, item, amount, includeEquip);
		}
	};

	//装備変更時に不正に重量オーバーするのを回避---------------------------------------------------------------
	var _Game_Actor_tradeItemWithParty = Game_Actor.prototype.tradeItemWithParty;
	Game_Actor.prototype.tradeItemWithParty = function (newItem, oldItem) {
		if (newItem && !$gameParty.hasItem(newItem)) {
			return false;
		} else {
			//パーティー内トレード時には重量判定を行わない
			_Game_Party_gainItem.call($gameParty, oldItem, 1);
			//$gameParty.gainItem(oldItem, 1);
			$gameParty.loseItem(newItem, 1);
			return true;
		}
	};

	//設定によっては戦闘によるドロップアイテムには重量判定を行わなず強制取得する---------------------------------------------------------------
	BattleManager.gainDropItems = function () {
		var items = this._rewards.items;
		items.forEach(function (item) {
			//if (isChoice) {
			//if (isChoice_EnemyDrop) {//2019/5/17 Edit by nyatama
			if (HandlingEnemyDrop === "Choice" || HandlingEnemyDrop === "Get") {
				_Game_Party_gainItem.call($gameParty, item, 1);
			} else {
				//ドロップアイテムの取得可否判定は、アイテム入手イベントにより重量オーバーした際の対応方法の影響を受けないよう、ここでおこなう必要がある
				if (canHaveItem(item, 1)) {
					_Game_Party_gainItem.call($gameParty, item, 1);
					//$gameParty.gainItem(item, 1);
				}
			}
		});
	};

	//設定によっては戦闘終了時に重量オーバーしていたらアイテムウィンドウを表示---------------------------------------------------------------
	BattleManager.updateBattleEnd = function () {
		if (this.isBattleTest()) {
			AudioManager.stopBgm();
			SceneManager.exit();
		} else if (!this._escaped && $gameParty.isAllDead()) {
			if (this._canLose) {
				$gameParty.reviveBattleMembers();
				SceneManager.pop();
			} else {
				SceneManager.goto(Scene_Gameover);
			}
		} else {
			//Choice設定で重量オーバー時のみアイテムウィンドウを表示
			if (getSurplusCP() < 0 && HandlingEnemyDrop === "Choice") {
				SceneManager.goto(Scene_Item);
			} else {
				SceneManager.pop();
			}
		}
		this._phase = null;
	};

	//フトコロさんのプラグイン FTKR_ItemSubCommand.js がある場合の処理===================================================================
	//捨てた時にもCPウィンドウを更新
	var FTKR_parameters = PluginManager.parameters('FTKR_ItemSubCommand');
	if (FTKR_parameters['Command List']) {
		var _Scene_Item_itemDiscard = Scene_Item.prototype.itemDiscard;
		Scene_Item.prototype.itemDiscard = function () {
			_Scene_Item_itemDiscard.call(this);
			//
			this._cpWindow.refresh();
		};
	}

	//プラグインコマンドの追加===================================================================
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		//
		if (command === 'PNDK_LC') {
			switch (args[0]) {
				case 'getSurplusWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getSurplusCP());
					break;
				case 'getAllItemWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getAllItemWeights());
					break;
				// 2019/01/07 Add start by nyatama
				case 'getItemWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getItemWeights(args[2], args[3]));
					break;
				case 'getWeaponWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getWeaponWeights(args[2], args[3]));
					break;
				case 'getArmorWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getArmorWeights(args[2], args[3]));
					break;
				// 2019/01/07 Add end by nyatama
				// Add start by nyatama
				case 'checkWeights':
					if (getSurplusCP() < 0) SceneManager.push(Scene_Item);
					break;
				// Add end by nyatama
			}
		}
	};

})();