//=============================================================================
// TMPlugin - ログウィンドウ
// バージョン: 1.1.1
// 最終更新日: 2019/03/11
// 配布元    : https://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2017 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc マップシーンにログウィンドウを表示します。
 *
 * @author tomoaky (https://hikimoki.sakura.ne.jp/)
 *
 * @param logWindowX
 * @type number
 * @min -1000
 * @desc ログウィンドウの X 座標。
 * 初期値: 0
 * @default 0
 *
 * @param logWindowY
 * @type number
 * @min -1000
 * @desc ログウィンドウの Y 座標。
 * 初期値: 460
 * @default 460
 *
 * @param logWindowWidth
 * @type number
 * @desc ログウィンドウの幅。
 * 初期値: 480
 * @default 480
 *
 * @param lines
 * @type number
 * @desc ログウィンドウの行数。
 * 初期値: 6
 * @default 6
 *
 * @param lineHeight
 * @type number
 * @desc ログウィンドウの１行の高さ。
 * 初期値: 24
 * @default 24
 * 
 * @param padding
 * @type number
 * @desc ログウィンドウの余白の大きさ。
 * 初期値: 10
 * @default 10
 *
 * @param fontSize
 * @type number
 * @desc ログウィンドウのフォントサイズ。
 * 初期値: 20
 * @default 20
 *
 * @param startVisible
 * @type boolean
 * @desc ゲーム開始時の表示状態。
 * 初期値: ON（ true = ON 表示 / false = OFF 非表示 )
 * @default true
 *
 * @param opacity
 * @type number
 * @max 255
 * @desc ウィンドウフレームと背景の不透明度。
 * 初期値: 255 ( 0 ～ 255 )
 * @default 255
 * 
 * @param collideOpacity
 * @type number
 * @max 255
 * @desc プレイヤーと重なったときの不透明度。
 * 初期値: 128（ 0 ～ 255 ）
 * @default 128
 *
 * @param messageBusyHide
 * @type boolean
 * @desc メッセージウィンドウ表示中はログウィンドウを隠す。
 * 初期値: ON（ true = ON 隠す / false = OFF 隠さない )
 * @default true
 *
 * @param eventBusyHide
 * @type boolean
 * @desc イベント起動中はログウィンドウを隠す。
 * 初期値: ON（ true = ON 隠す / false = OFF 隠さない )
 * @default true
 * 
 * @param maxLogs
 * @type number
 * @desc 保存するログの最大行数。
 * 初期値: 30
 * @default 30
 * 
 * @param autoDelete
 * @type variable
 * @desc 指定したゲーム変数に代入された値の間隔で、自動的にテキストを
 * 削除する。単位はフレーム数（ 60フレーム = 1秒 ）
 * @default 0
 *
 * @help
 * TMPlugin - ログウィンドウ ver1.1.1
 * 
 * 使い方:
 * 
 *   プラグインを導入するとマップシーンにログウィンドウが追加されます。
 *   プラグインコマンドを使って手動で書き込むか、転記モードで
 *   自動的に書き込むことでログウィンドウにテキストを表示できます。
 *   
 *   このプラグインは RPGツクールMV Version 1.6.1 で動作確認をしています。
 *
 *   このプラグインはMITライセンスのもとに配布しています、商用利用、
 *   改造、再配布など、自由にお使いいただけます。
 * 
 *
 * プラグインコマンド:
 * 
 *   showLogWindow
 *     ログウィンドウを表示する。
 * 
 *   hideLogWindow
 *     ログウィンドウを隠す。
 * 
 *   addLog テキスト
 *     テキストをログウィンドウに追加する。
 *     一部の制御文字も使えます（\V[n], \N[n], \P[n], \G, \C[n]）
 * 
 *   deleteLog
 *     一番古いテキストをひとつ削除する。
 * 
 *   startMirrorLogWindow
 *     イベントコマンド『文章の表示』をトレースする転記モードを有効化。
 * 
 *   stopMirrorLogWindow
 *     startMirrorLogWindow で有効化した機能を無効化します。
 * 
 *   startAutoLogWindow
 *     『TMJumpAction.js』などの対応プラグインと併用した場合に
 *     敵撃破時の報酬情報を自動でログに追記する機能を有効化します。
 *     この機能はゲーム開始時には自動的にオンになっています。
 * 
 *   stopAutoLogWindow
 *     startAutoLogWindow で有効化した機能を無効化します。
 * 
 *   openLogScene
 *     ログ確認シーンへ移行します。
 * 
 * 
 * プラグインパラメータ補足:
 * 
 *   padding
 *     テキストの表示領域とウィンドウフレーム外側までのドット数です。
 *     ウィンドウの高さ（縦方向の大きさ）は以下の式で算出されます。
 *     １行の高さ(lineHeight) * 行数(lines) + 余白(padding) * 2
 *     画面の下部ぴったりにウィンドウを表示したい場合は縦方向の
 *     画面サイズから上記の式の結果を引いた値を logWindowY に
 *     設定してください。
 * 
 *   collideOpacity
 *     opacity よりも大きい値を設定した場合、ログの内容には
 *     collideOpacity を適用し、ウィンドウフレームと背景には
 *     opacity を適用します。
 * 
 *   autoDelete
 *     指定したゲーム変数の値が 0 の場合は、自動削除の機能が
 *     停止します。
 */

var Imported = Imported || {};
Imported.TMLogWindow = true;

(function () {

	parameters = PluginManager.parameters('TMLogWindow');
	logWindowX = +(parameters['logWindowX'] || 0);
	logWindowY = +(parameters['logWindowY'] || 464);
	logWindowWidth = +(parameters['logWindowWidth'] || 480);
	logWindowLines = +(parameters['lines'] || 6);
	logWindowLineHeight = +(parameters['lineHeight'] || 24);
	logWindowPadding = +(parameters['padding'] || 10);
	logWindowFontSize = +(parameters['fontSize'] || 20);
	logWindowStartVisible = JSON.parse(parameters['startVisible']);
	logWindowOpacity = +(parameters['opacity'] || 255);
	logWindowCollideOpacity = +(parameters['collideOpacity'] || 128);
	logWindowMessageBusyHide = JSON.parse(parameters['messageBusyHide']);
	logWindowEventBusyHide = JSON.parse(parameters['eventBusyHide']);
	logWindowMaxLogs = +(parameters['maxLogs'] || 20);
	logWindowAutoDelete = +(parameters['autoDelete'] || 0);

	//-----------------------------------------------------------------------------
	// Game_Temp
	//

	Game_Temp.prototype.dummyWindow = function () {
		if (!this._dummyWindow) {
			this._dummyWindow = new Window_Base(0, 0, 64, 64);
		}
		return this._dummyWindow;
	};

	//-----------------------------------------------------------------------------
	// Game_System
	//

	var _Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function () {
		_Game_System_initialize.call(this);
		this._visibleLogWindow = logWindowStartVisible;
		this._mirrorLogWindow = false;
		this._autoLogWindow = true;
		this._actionLog = [];
	};

	Game_System.prototype.isVisibleLogWindow = function () {
		return this._visibleLogWindow;
	};

	Game_System.prototype.isMirrorLogWindow = function () {
		return this._mirrorLogWindow;
	};

	Game_System.prototype.isAutoLogWindow = function () {
		return this._autoLogWindow;
	};

	Game_System.prototype.setVisibleLogWindow = function (visible) {
		this._visibleLogWindow = visible;
	};

	Game_System.prototype.setMirrorMode = function (flag) {
		this._mirrorLogWindow = flag;
	};

	Game_System.prototype.setAutoMode = function (flag) {
		this._autoLogWindow = flag;
	};

	Game_System.prototype.addLog = function (text) {
		text = $gameTemp.dummyWindow().convertEscapeCharacters(text);
		this._actionLog.push(text);
		if (this._actionLog.length > logWindowMaxLogs) {
			this._actionLog.shift();
		}
		this._needsActionLogRefresh = true;
	};

	Game_System.prototype.deleteLog = function () {
		if (this._actionLog.length > 0) {
			this._actionLog.shift();
			this._needsActionLogRefresh = true;
		}
	};

	Game_System.prototype.actionLog = function () {
		return this._actionLog;
	};

	//-----------------------------------------------------------------------------
	// Game_Message
	//

	var _Game_Message_add = Game_Message.prototype.add;
	Game_Message.prototype.add = function (text) {
		_Game_Message_add.call(this, text);
		if ($gameSystem.isMirrorLogWindow()) {
			$gameSystem.addLog(text);
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Actor
	//

	// レベルアップの表示
	var _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
	Game_Actor.prototype.displayLevelUp = function (newSkills) {
		_Game_Actor_displayLevelUp.call(this, newSkills);
		if ($gameSystem.isAutoLogWindow() && !$gameParty.inBattle()) {
			var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
			$gameSystem.addLog(text);
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Event
	//

	var _Game_Event_gainRewards = Game_Event.prototype.gainRewards;
	Game_Event.prototype.gainRewards = function () {
		if ($gameSystem.isAutoLogWindow()) {
			var battler = this.battler();
			var exp = battler.exp();
			var gold = battler.gold();
			var text = battler.name() + $dataStates[battler.deathStateId()].message2;
			var rewardText = '';
			if (exp > 0) {
				rewardText += '' + exp + '\\C[16]' + TextManager.expA + '\\C[0]';
			}
			if (gold > 0) {
				if (exp > 0) {
					rewardText += ' / ';
				}
				rewardText += '' + gold + '\\C[16]' + TextManager.currencyUnit + '\\C[0]';
			}
			if (rewardText) {
				text += ' ( ' + rewardText + ' )';
			}
			$gameSystem.addLog(text)
		}
		_Game_Event_gainRewards.call(this);
	};

	var _Game_Event_gainRewardItem = Game_Event.prototype.gainRewardItem;
	Game_Event.prototype.gainRewardItem = function (item, y) {
		_Game_Event_gainRewardItem.call(this, item, y);
		if ($gameSystem.isAutoLogWindow()) {
			var text = TextManager.obtainItem.format(item.name);
			$gameSystem.addLog(text);
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Interpreter
	//

	// プラグインコマンド
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'showLogWindow') {
			$gameSystem.setVisibleLogWindow(true);
		} else if (command === 'hideLogWindow') {
			$gameSystem.setVisibleLogWindow(false);
		} else if (command === 'addLog') {
			$gameSystem.addLog(args[0]);
		} else if (command === 'deleteLog') {
			$gameSystem.deleteLog();
		} else if (command === 'startMirrorLogWindow') {
			$gameSystem.setMirrorMode(true);
		} else if (command === 'stopMirrorLogWindow') {
			$gameSystem.setMirrorMode(false);
		} else if (command === 'startAutoLogWindow') {
			$gameSystem.setAutoMode(true);
		} else if (command === 'stopAutoLogWindow') {
			$gameSystem.setAutoMode(false);
		} else if (command === 'openLogScene') {
			SceneManager.push(Scene_Log);
		}
	};

	//-----------------------------------------------------------------------------
	// Window_MapLog
	//

	function Window_MapLog() {
		this.initialize.apply(this, arguments);
	}

	Window_MapLog.prototype = Object.create(Window_Base.prototype);
	Window_MapLog.prototype.constructor = Window_MapLog;

	Window_MapLog.prototype.initialize = function () {
		var x = logWindowX;
		var y = logWindowY;
		var wight = this.windowWidth();
		var height = this.windowHeight();
		Window_Base.prototype.initialize.call(this, x, y, wight, height);
		this.openness = $gameSystem.isVisibleLogWindow() ? 255 : 0;
		this.opacity = 255;
		this.contentsOpacity = 255;
		this._hideCount = 0;
		this._autoDeleteCount = 0;
		this.refresh();
	};

	Window_MapLog.prototype.standardFontSize = function () {
		return logWindowFontSize;
	};

	// ウィンドウの幅を取得
	Window_MapLog.prototype.windowWidth = function () {
		return logWindowWidth;
	};

	// ウィンドウの高さを取得
	Window_MapLog.prototype.windowHeight = function () {
		return this.fittingHeight(logWindowLines);
	};

	// 標準パディングを取得
	Window_MapLog.prototype.standardPadding = function () {
		return logWindowPadding;
	};

	// ウィンドウの１行の高さを取得
	Window_MapLog.prototype.lineHeight = function () {
		return logWindowLineHeight;
	};

	// フレーム更新
	Window_MapLog.prototype.update = function () {
		Window_Base.prototype.update.call(this);
		if (logWindowAutoDelete > 0) {
			var maxCount = $gameVariables.value(logWindowAutoDelete);
			if (maxCount > 0) {
				var actionLog = $gameSystem.actionLog();
				if (actionLog.length > 0) {
					this._autoDeleteCount++;
				}
				if (this._autoDeleteCount >= maxCount) {
					$gameSystem.deleteLog();
					this._autoDeleteCount = 0;
				}
			}
		}
		if (this.updateVisibility()) {
			this.open();
			if ($gameSystem._needsActionLogRefresh) {
				this.refresh();
				$gameSystem._needsActionLogRefresh = false;
			}
			this.updateOpacity();
		} else {
			this.close();
		}
	};

	// ウィンドウ表示状態の更新
	Window_MapLog.prototype.updateVisibility = function () {
		if (!$gameSystem.isVisibleLogWindow()) {
			return false;
		}
		if ((logWindowEventBusyHide && $gameMap.isEventRunning()) ||
			(logWindowMessageBusyHide && $gameMessage.isBusy())) {
			this._hideCount++;
		} else {
			this._hideCount = 0;
		}
		return this._hideCount < 10;
	};

	// 不透明度の更新
	Window_MapLog.prototype.updateOpacity = function () {
		if (this.x < $gamePlayer.screenX() + 24 &&
			this.x + this.windowWidth() > $gamePlayer.screenX() - 24 &&
			this.y < $gamePlayer.screenY() &&
			this.y + this.windowHeight() > $gamePlayer.screenY() - 48) {
			this.opacity = Math.min(logWindowCollideOpacity, logWindowOpacity);
			this.contentsOpacity = logWindowCollideOpacity;
		} else {
			this.opacity = logWindowOpacity;
			this.contentsOpacity = 255;
		}
	};

	// リフレッシュ
	Window_MapLog.prototype.refresh = function () {
		this.contents.clear();
		var actionLog = $gameSystem.actionLog();
		var lh = this.lineHeight();
		var n = Math.min(logWindowLines, actionLog.length);
		for (var i = 0; i < n; i++) {
			this.drawTextEx(actionLog[actionLog.length - n + i], 0, lh * i);
		}
	};

	//-----------------------------------------------------------------------------
	// Window_MenuLog
	//

	function Window_MenuLog() {
		this.initialize.apply(this, arguments);
	}

	Window_MenuLog.prototype = Object.create(Window_Selectable.prototype);
	Window_MenuLog.prototype.constructor = Window_MenuLog;

	Window_MenuLog.prototype.initialize = function () {
		Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
		this._data = $gameSystem.actionLog();
		this.refresh();
		this.select(Math.max(this._data.length - 1, 0));
		this.activate();
	};

	Window_MenuLog.prototype.standardFontSize = function () {
		return logWindowFontSize;
	};

	Window_MenuLog.prototype.standardPadding = function () {
		return logWindowPadding;
	};

	Window_MenuLog.prototype.lineHeight = function () {
		return logWindowLineHeight;
	};

	Window_MenuLog.prototype.maxItems = function () {
		return this._data ? this._data.length : 1;
	};

	Window_MenuLog.prototype.item = function () {
		var index = this.index();
		return this._data && index >= 0 ? this._data[index] : null;
	};

	Window_MenuLog.prototype.drawItem = function (index) {
		var item = this._data[index];
		if (item) {
			var rect = this.itemRectForText(index);
			this.drawTextEx(item, 0, rect.y);
		}
	};

	//-----------------------------------------------------------------------------
	// Scene_Map
	//

	var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function () {
		_Scene_Map_createDisplayObjects.call(this);
		this.createMapLogWindow();
	};

	// ログウィンドウの作成
	Scene_Map.prototype.createMapLogWindow = function () {
		this._mapLogWindow = new Window_MapLog();
		this.addChild(this._mapLogWindow);
	};

	var _Scene_Map_terminate = Scene_Map.prototype.terminate;
	Scene_Map.prototype.terminate = function () {
		if (!SceneManager.isNextScene(Scene_Battle)) {
			this._mapLogWindow.hide();
		}
		_Scene_Map_terminate.call(this);
	};

	var _Scene_Map_launchBattle = Scene_Map.prototype.launchBattle;
	Scene_Map.prototype.launchBattle = function () {
		this._mapLogWindow.hide();
		this.removeChild(this._mapLogWindow);
		this._mapLogWindow = null;
		_Scene_Map_launchBattle.call(this);
	};

	//-----------------------------------------------------------------------------
	// Scene_Log
	//

	function Scene_Log() {
		this.initialize.apply(this, arguments);
	}

	Scene_Log.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_Log.prototype.constructor = Scene_Log;

	Scene_Log.prototype.initialize = function () {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_Log.prototype.create = function () {
		Scene_MenuBase.prototype.create.call(this);
		this.createCreditsWindow();
	};

	Scene_Log.prototype.createCreditsWindow = function () {
		this._logWindow = new Window_MenuLog();
		this._logWindow.setHandler('ok', this.popScene.bind(this));
		this._logWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._logWindow);
	};

})();
