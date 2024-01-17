//=============================================================================
// TRP_Skit.js
//=============================================================================
// Copyright (c) 2018-2019 Thirop
//=============================================================================

var Imported = Imported || {};
Imported.TRP_Skit = true;

//=============================================================================
/*:
 * @plugindesc 立ち絵操作プラグイン。
 * @author Thirop
 * @help 本プラグインをご購入頂きありがとうございます。
 * プラグインの使い方についてはマニュアル(https://ci-en.net/creator/2170/article/28646)をご参照ください。
 * ※本プラグインはBoothにて販売している有償プラグインです。
 * ※最新バージョンはBoothの購入履歴より再ダウンロード可能です。
 *
 * 【更新履歴】
 * 1.14 2020/12/10 Y移動、ループ、evalコマンド追加。イージング種類追加
 * 1.13 2019/6/23  アニメーション名に<noMirror>を含むと反転無効機能追加
 * 1.12 2019/6/22  コンフィグver1.04に対応
 * 1.11 2019/6/14  プッシュイン時に退出途中のキャラが動かされる不具合を修正
 * 1.10 2019/2/10  立ち絵表示前にポーズ/表情コマンドを使用可能に修正
 * 1.09 2019/1/22  マクロコマンドが使用できない不具合を対応
 * 1.08 2019/1/22  プラグインパラメータに制御文字を対応
 * 1.07 2018/12/20 hide/非表示コマンドで発生するエラーを修正。
 * 1.06 2018/12/6  コンフィグver1.03対応(制御文字の割当変更)。
 * 1.05 2018/11/29 アニメーション表示位置を修正。コンフィグver1.02対応。
 * 1.04 2018/11/22 表情瞬間変更時のチラツキ修正。表情表示位置が乱れる不具合修正。
 * 1.03 2018/11/22 ポーズ瞬間切替時のチラツキ修正。
 * 1.02 2018/11/20 拡大表示される不具合修正。コンフィグver1.01対応。
 * 1.01 2018/11/17 日本語コマンド名の修正
 * 1.00 2018/11/17 初版
 */
//=============================================================================

var $gameSkit = null;

var TRP_CORE = TRP_CORE || {};
function SkitActor() {
  this.initialize.apply(this, arguments);
}
function Skit() {
  this.initialize.apply(this, arguments);
}

(function () {
  "use strict";

  //=============================================================================
  // Setup pluginParaßmeters & dataSkitActors
  //=============================================================================
  var parameters;
  var names = {};

  /* setupParameters
	===================================*/
  var _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    TRP_CORE.setupTRPSkitConfigParametersIfNeeded();

    _Scene_Boot_start.call(this);
  };

  TRP_CORE.convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters;
  TRP_CORE.actorName = Window_Base.prototype.actorName;
  TRP_CORE.partyMemberName = Window_Base.prototype.partyMemberName;

  TRP_CORE.setupTRPSkitConfigParametersIfNeeded = function () {
    if (this.isSkitParametersInitialized) return;

    this.isSkitParametersInitialized = true;
    parameters = TRP_CORE.skitParameters;
    parameters = JSON.parse(
      JSON.stringify(parameters, function (key, value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          try {
            return eval(value);
          } catch (e) {
            return value;
          }
        }
      })
    );

    //added at ver1.02, config ver1.01
    parameters.noReverse = TRP_CORE.supplement(false, parameters.noReverse);
    parameters.bustsScale = TRP_CORE.supplementNum(100, parameters.bustsScale);

    //added at ver1.05, config ver1.03
    parameters.controlCharacters = TRP_CORE.supplement(
      {
        expression: "SE",
        pose: "SP",
        motion: "SM",
        animation: "SA",
      },
      parameters.controlCharacters
    );

    var errorPrefix = "TRP_SkitConfig:";
    try {
      /* setup SkitActorSettings
			===================================*/
      var characterSettingArray = parameters.SkitActorSettings;
      var dataActors = {};
      parameters.dataActors = dataActors;
      parameters.nameToInputList = names;

      characterSettingArray.forEach(function (character) {
        character.inputName = character.inputName || character.name;
        character.fileName = character.fileName || character.inputName;
        // names[character.inputName] = character.fileName;
        if (character.name) {
          names[character.name] = character.fileName;
        }
        if (character.inputName) {
          names[character.inputName] = character.fileName;
        }
        delete character.basic;
        delete character.displayAdjust;
        dataActors[character.fileName] = character;
      });
      delete parameters.SkitActorSettings;
    } catch (e) {
      e = new Error(errorPrefix + "キャラクター設定が正しくありません。");
      SceneManager.catchException(e);
    }

    /* setup xPosition
		===================================*/
    try {
      var xPositionArray = parameters.xPosition;
      var xPosition = {};
      parameters.xPosition = xPosition;
      xPositionArray.forEach(function (positionInfo) {
        xPosition[positionInfo.name] = positionInfo.position;
      });
    } catch (e) {
      e = new Error(errorPrefix + "ポジションの略称設定が正しくありません。");
      SceneManager.catchException(e);
    }

    /* setup speed list
		===================================*/
    try {
      var speedArray = parameters.speed;
      var speed = {};
      parameters.speed = speed;
      speedArray.forEach(function (info) {
        speed[info.name] = info.speed;
      });
    } catch (e) {
      e = new Error(errorPrefix + "スピードの略称設定が正しくありません。");
      SceneManager.catchException(e);
    }
    /* setup animationList
		===================================*/
    try {
      var listArray = parameters.animation.list;
      var list = {};
      parameters.animation.list = list;
      listArray.forEach(function (animation) {
        if (animation.name && animation.name !== "") {
          list[animation.name] = animation.id;
        }
      });
    } catch (e) {
      e = new Error(
        errorPrefix + "アニメーションの登録設定が正しくありません。"
      );
      SceneManager.catchException(e);
    }

    /* setup macro
		===================================*/
    try {
      var macroArray = parameters.macro
        .concat(parameters.macro2)
        .concat(parameters.macro3)
        .concat(parameters.macro4);
      if (parameters.macro5) {
        macroArray = macroArray.concat(parameters.macro5);
      }
      var macro = {};
      parameters.macro = macro;
      macroArray.forEach(function (info) {
        macro[info.name] = info.macro.split(" ");
      });
    } catch (e) {
      e = new Error(errorPrefix + "マクロの登録設定が正しくありません。");
      SceneManager.catchException(e);
    }

    /* setup toneParameter
		===================================*/
    var toneError =
      "のトーン設定が不正です。スペース区切りで使用可能な数の範囲を確認してください。また、正の数に+はつけないでください。";
    try {
      parameters.unFocus.tone = TRP_CORE.interpretToneStr(
        parameters.unFocus.tone
      );
    } catch (e) {
      e = new Error(errorPrefix + "アンフォーカス" + toneError);
      SceneManager.catchException(e);
    }
    try {
      parameters.tint.tone = TRP_CORE.interpretToneStr(parameters.tint.tone);
    } catch (e) {
      e = new Error(errorPrefix + "色調のトーン設定" + toneError);
      SceneManager.catchException(e);
    }
    try {
      parameters.emphasize.tone = TRP_CORE.interpretToneStr(
        parameters.emphasize.tone
      );
    } catch (e) {
      e = new Error(errorPrefix + "強調のトーン設定" + toneError);
      SceneManager.catchException(e);
    }
  };

  //=============================================================================
  // TRP_CORE
  //=============================================================================
  TRP_CORE.RELEATIVE = true;
  TRP_CORE.ABSOLUTE = false;
  TRP_CORE.WAIT = true;
  TRP_CORE.NO_WAIT = false;

  TRP_CORE.supplement = function (defaultValue, optionArg) {
    if (optionArg === undefined) {
      return defaultValue;
    }
    return optionArg;
  };
  TRP_CORE.supplementNum = function (defaultValue, optionArg) {
    return Number(TRP_CORE.supplement(defaultValue, optionArg));
  };

  TRP_CORE.supplementDef = function (defaultValue, optionArg, otherWords) {
    var value = TRP_CORE.supplement(defaultValue, optionArg);

    var defTargetWords = otherWords || [];
    defTargetWords.push("default");
    defTargetWords.push("def");
    defTargetWords.push("d");
    for (var i = 0; i < defTargetWords.length; i++) {
      var target = defTargetWords[i];
      if (value === target) {
        value = defaultValue;
        break;
      }
    }
    return value;
  };
  TRP_CORE.supplementDefNum = function (defaultValue, optionArg, otherWords) {
    var value = TRP_CORE.supplementDef(defaultValue, optionArg, otherWords);
    return Number(value);
  };
  TRP_CORE.supplementDefBool = function (defaultValue, optionArg, otherWords) {
    var value = TRP_CORE.supplementDef(defaultValue, optionArg, otherWords);
    if (value === "true" || value === "t") {
      value = true;
    } else if (value === "false" || value === "f") {
      value = false;
    } else if (value) {
      value = true;
    } else {
      value = false;
    }
    return value;
  };

  TRP_CORE.removeArrayObject = function (array, target) {
    var length = array.length;
    for (var i = 0; i < length; i = i + 1) {
      if (array[i] === target) {
        array.splice(i, 1);
        return;
      }
    }
  };

  /* tween
	===================================*/
  TRP_CORE.EASING = {
    linear: 0,
    easeInQuad: 1,
    easeOutQuad: 2,
    easeInOutQuad: 3,
    easeInCubic: 4,
    easeOutCubic: 5,
    easeInOutCubic: 6,
    easeInBack: 7,
    easeOutBack: 8,
    easeInOutBack: 9,
    easeInElastic: 10,
    easeOutElastic: 11,
    easeInOutElastic: 12,
  };
  TRP_CORE.easingValue = function (t, v0, delta, duration, type) {
    var EASING = this.EASING;
    t /= duration;

    switch (type) {
      case EASING.easeInQuad:
        t = this.easingInQuad(t);
        break;
      case EASING.easeOutQuad:
        t = this.easingOutQuad(t);
        break;
      case EASING.easeInOutQuad:
        t = this.easingInOutQuad(t);
        break;
      case EASING.easeInCubic:
        t = this.easingInCubic(t);
        break;
      case EASING.easeOutCubic:
        t = this.easingOutCubic(t);
        break;
      case EASING.easeInOutCubic:
        t = this.easingInOutCubic(t);
        break;
      case EASING.easeInBack:
        t = this.easingInBack(t);
        break;
      case EASING.easeOutBack:
        t = this.easingOutBack(t);
        break;
      case EASING.easeInOutBack:
        t = this.easingInOutBack(t);
        break;
      case EASING.easeInElastic:
        t = this.easingInElastic(t);
        break;
      case EASING.easeOutElastic:
        t = this.easingOutElastic(t);
        break;
      case EASING.easeInOutElastic:
        t = this.easingInOutElastic(t);
        break;
      default:
        t = this.easingLinear(t);
    }
    return delta * t + v0;
  };
  TRP_CORE.easingLinear = function (t) {
    return t;
  };
  TRP_CORE.easingInQuad = function (t) {
    return t * t;
  };
  TRP_CORE.easingOutQuad = function (t) {
    return -t * (t - 2);
  };
  TRP_CORE.easingInOutQuad = function (t) {
    t *= 2;
    if (t < 1) return (1 / 2) * t * t;
    t -= 1;
    return (-1 / 2) * (t * (t - 2) - 1);
  };
  TRP_CORE.easingInCubic = function (t) {
    return t * t * t;
  };
  TRP_CORE.easingOutCubic = function (t) {
    t -= 1;
    return t * t * t + 1;
  };
  TRP_CORE.easingInOutCubic = function (t) {
    t *= 2;
    if (t < 1) return (1 / 2) * t * t * t;
    t -= 2;
    return (1 / 2) * (t * t * t + 2);
  };
  TRP_CORE.easingInBack = function (t) {
    return t * t * (2.5 * t - 1.5);
  };
  TRP_CORE.easingOutBack = function (t) {
    t -= 1;
    return 1 + t * t * (2.5 * t + 1.5);
  };
  TRP_CORE.easingInOutBack = function (t) {
    t *= 2;
    if (t < 1) return (t * t * (2.5 * t - 1.5)) / 2;
    t -= 2;
    return (1 + t * t * (2.5 * t + 1.5)) / 2 + 0.5;
  };
  TRP_CORE.easingInElastic = function (t) {
    t -= 1;
    return (
      -Math.pow(2, 10 * t) *
      Math.sin(((t - (0.4 / 2 / Math.PI) * Math.asin(1)) * 2 * Math.PI) / 0.4)
    );
  };
  TRP_CORE.easingOutElastic = function (t) {
    return (
      Math.pow(2, -10 * t) *
        Math.sin(
          ((t - (0.4 / 2 / Math.PI) * Math.asin(1)) * 2 * Math.PI) / 0.4
        ) +
      1
    );
  };
  TRP_CORE.easingInOutElastic = function (t) {
    t -= 0.5;
    if (t < 0) {
      return (
        -0.5 *
        Math.pow(2, 10 * t) *
        Math.sin(((t - 0.4 / 4) * 2 * Math.PI) / 0.4)
      );
    } else {
      return (
        0.5 *
          Math.pow(2, -10 * t) *
          Math.sin(((t - 0.4 / 4) * 2 * Math.PI) / 0.4) +
        1
      );
    }
  };

  /* functions for Skit
	===================================*/
  TRP_CORE.isTRPSkitPluginCommand = function (command) {
    return command === "SKIT" || command === "skit" || command === "スキット";
  };

  var WAIT_ARGS = ["wait"];
  TRP_CORE.supplementSkitWait = function (default_value, opt_arg) {
    var ret = TRP_CORE.supplementDef(default_value, opt_arg, WAIT_ARGS);
    ret =
      ret === "false" || ret === "f"
        ? false
        : ret === "true" || ret === "t"
        ? true
        : ret;
    return ret;
  };

  TRP_CORE.interpretToneStr = function (toneStr) {
    toneStr = toneStr.replace("　", " ");
    toneStr = toneStr.replace(/^\s*/, "");
    toneStr = toneStr.replace(/\s+/g, " ");
    var toneParams = toneStr.split(" ");
    var tone = [
      Number(toneParams[0]),
      Number(toneParams[1]),
      Number(toneParams[2]),
      Number(toneParams[3] || 0),
    ];
    return tone;
  };

  TRP_CORE.interpretPositionArg = function (posArg) {
    switch (posArg) {
      case "default":
      case "def":
      case "d":
      case "デフォルト":
      case "":
      case undefined:
        posArg = parameters.defaultPositionX;
    }

    var position;
    var registered = parameters.xPosition[posArg];

    if (registered !== undefined) {
      position = registered;
    } else {
      if (isNaN(posArg)) {
        position = 2;
      } else {
        position = Number(posArg);
      }
    }

    return position;
  };

  TRP_CORE.supplementSpeedArg = function (defaultValue, arg) {
    arg = TRP_CORE.supplementDef(defaultValue, arg);
    var speed;
    var registered = parameters.speed[arg];

    if (registered !== undefined) {
      speed = registered;
    } else {
      if (isNaN(arg)) {
        speed = 12;
      } else {
        speed = Number(arg);
      }
    }

    return speed;
  };

  TRP_CORE.interpretDirectionArg = function (arg, position) {
    switch (arg) {
      case "left":
      case "左":
        return -1;
      case "right":
      case "右":
        return 1;
      default:
        if (!isNaN(arg)) {
          var numArg = Number(arg);
          if (numArg < 0) {
            return -1;
          }
          if (numArg > 0) {
            return 1;
          }
        }
        return position <= 5 ? -1 : 1;
    }
  };

  TRP_CORE.interpretAnimationArg = function (arg) {
    var animationId;
    var registered = parameters.animation.list[arg];

    if (registered !== undefined) {
      animationId = Number(registered);
    } else {
      if (isNaN(arg)) {
        animationId = 1;
      } else {
        animationId = Number(arg);
      }
    }

    return animationId;
  };

  TRP_CORE.supplementEasingArg = function (defaultValue, arg) {
    arg = TRP_CORE.supplementDef(defaultValue, arg);
    var type;

    switch (arg) {
      case "easeIn":
      case "easeInQuad":
      case "quadIn":
      case "イーズイン":
      case "イーズインクアッド":
      case "クアッドイン":
        return TRP_CORE.EASING.easeInQuad;
      case "easeOut":
      case "easeOutQuad":
      case "quadOut":
      case "イーズアウト":
      case "イーズアウトクアッド":
      case "クアッドアウト":
        return TRP_CORE.EASING.easeOutQuad;
      case "easeInOut":
      case "easeInOutQuad":
      case "quadInOut":
      case "イーズインアウト":
      case "イーズインアウトクアッド":
      case "クアッドインアウト":
        return TRP_CORE.EASING.easeInOutQuad;

      case "cubicIn":
      case "easeInCubic":
      case "キュービックイン":
      case "イーズインキュービック":
        return TRP_CORE.EASING.easeInCubic;
      case "cubicOut":
      case "easeOutCubic":
      case "キュービックアウト":
      case "イーズアウトキュービック":
        return TRP_CORE.EASING.easeOutCubic;
      case "cubicInOut":
      case "easeInOutCubic":
      case "キュービックインアウト":
      case "イーズインアウトキュービック":
        return TRP_CORE.EASING.easeInOutCubic;

      case "backIn":
      case "バックイン":
      case "easeInBack":
      case "イーズインバック":
        return TRP_CORE.EASING.easeInBack;
      case "backOut":
      case "バックアウト":
      case "easeOutBack":
      case "イーズアウトバック":
        return TRP_CORE.EASING.easeOutBack;
      case "backInOut":
      case "バックインアウト":
      case "backInOutElastic":
      case "バックインアウトバック":
        return TRP_CORE.EASING.easeInOutBack;

      case "elasticIn":
      case "イラスティックイン":
      case "easeInElastic":
      case "イーズインイラスティック":
        return TRP_CORE.EASING.easeInElastic;
      case "elasticOut":
      case "イラスティックアウト":
      case "easeOutElastic":
      case "イーズアウトイラスティック":
        return TRP_CORE.EASING.easeOutElastic;
      case "elasticInOut":
      case "イラスティックインアウト":
      case "easeInOutElastic":
      case "イーズインアウトイラスティック":
        return TRP_CORE.EASING.easeInOutElastic;

      default:
        if (isNaN(arg)) {
          return TRP_CORE.EASING.linear;
        }
        return Number(arg);
    }
  };

  TRP_CORE.reqestTRPSkitPluginCommandImages = function (params) {};

  //=============================================================================
  // DataManager
  //=============================================================================
  var _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);

    TRP_CORE.setupTRPSkitConfigParametersIfNeeded();
    $gameSkit = new Skit();
  };

  var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    var contents = _DataManager_makeSaveContents_.call(this);
    contents.skit = $gameSkit;
    return contents;
  };
  var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents_.call(this, contents);
    $gameSkit = contents.skit;
  };

  //=============================================================================
  // SceneManager
  //=============================================================================
  SceneManager.isScene = function (sceneClass) {
    return this._scene && this._scene.constructor === sceneClass;
  };

  //=============================================================================
  // ImageManager
  //=============================================================================
  ImageManager.loadBust = function (charaname, filename, hue) {
    return this.loadBitmap(
      "img/pictures/busts/" + charaname + "/",
      filename,
      hue,
      true
    );
  };

  ImageManager.requestBust = function (charaname, filename, hue) {
    return this.requestBitmap(
      "img/pictures/busts/" + charaname + "/",
      filename,
      hue,
      true
    );
  };

  //=============================================================================
  // Scene_Map
  //=============================================================================
  var _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
  Scene_Map.prototype.updateMain = function () {
    _Scene_Map_updateMain.call(this);
    $gameSkit.update();
  };

  //=============================================================================
  // Scene_Battle
  //=============================================================================
  var _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);
    $gameSkit.update();
  };

  //=============================================================================
  // Game_Interpreter
  //=============================================================================
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (TRP_CORE.isTRPSkitPluginCommand(command)) {
      if (args[0] === "test") {
        this.skitTest();
      } else {
        this.setWaitMode("skit");
        $gameSkit.processCommand(args);
      }
    }
  };

  var _Game_Interpreter_updateWaitMode =
    Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === "skit") {
      if (!$gameSkit.isBusy()) {
        this._waitMode = "";
        return false;
      }
      return true;
    }
    return _Game_Interpreter_updateWaitMode.call(this);
  };

  //=============================================================================
  // Skit
  //=============================================================================
  Skit.defaultExpression = function () {
    return parameters.useDefaultExpression ? "default" : null;
  };

  //=============================================================================
  // Skit => interpretCommands
  //=============================================================================
  Skit.prototype.processCommand = function (args, macroPos) {
    //interpret if macroCommand
    var i, length;
    while (parameters.macro[args[0]]) {
      var macroArgs = parameters.macro[args[0]];
      var argLength = args.length;
      var macroLength = macroArgs.length;
      length = Math.max(argLength, macroLength);
      args[0] = macroArgs[0];
      if (args[0] === "eval") {
        args[1] = macroArgs[1];
      } else {
        for (i = 1; i < length; i = i + 1) {
          args[i] = TRP_CORE.supplementDef(macroArgs[i], args[i]);
        }
      }
    }

    //convert escapeCharacters
    length = args.length;
    for (i = 0; i < length; i = (i + 1) | 0) {
      if (typeof args[i] === "string") {
        args[i] = TRP_CORE.convertEscapeCharacters(args[i]);
      }
    }

    this._processCommand(args, macroPos);
  };

  Skit.prototype._processCommand = function (args, macroPos) {
    var skitCommand = args[0].toLowerCase();

    switch (skitCommand) {
      case "start":
      case "開始":
        this.startSkit(args, macroPos);
        break;
      case "end":
      case "終了":
        this.endSkit(args, macroPos);
        break;
      case "preload":
      case "プリロード":
        this.preloadImage(args, macroPos);
        break;
      case "clear":
      case "クリア":
      case "クリアー":
        this.clearActors(args, macroPos);
        break;
      case "show":
      case "表示":
      case "出現":
        this.showSkitActor(args, macroPos);
        break;
      case "hide":
      case "非表示":
        this.hideSkitActor(args, macroPos);
        break;
      case "fadein":
      case "フェードイン":
        this.fadeInSkitActor(args, macroPos);
        break;
      case "fadeout":
      case "フェードアウト":
        this.fadeOutSkitActor(args, macroPos);
        break;
      case "slidein":
      case "スライドイン":
        this.slideInSkitActor(args, macroPos);
        break;
      case "slideout":
      case "スライドアウト":
        this.slideOutSkitActor(args, macroPos);
        break;
      case "movein":
      case "ムーブイン":
        this.moveInSkitActor(args, macroPos);
        break;
      case "moveout":
      case "ムーブアウト":
        this.moveOutSkitActor(args, macroPos);
        break;
      case "expression":
      case "exp":
      case "表情":
        this.changeSkitActorExpression(args, macroPos);
        break;
      case "pose":
      case "ポーズ":
        this.changeSkitActorPose(args, macroPos);
        break;
      case "move":
      case "移動":
        this.moveSkitActor(args, macroPos);
        break;
      case "y":
      case "movey":
      case "y移動":
        this.moveYSkitActor(args, macroPos);
        break;
      case "jump":
      case "ジャンプ":
        this.jumpSkitActor(args, macroPos);
        break;
      case "step":
      case "ステップ":
        this.stepSkitActor(args, macroPos);
        break;
      case "shake":
      case "シェイク":
      case "揺れ":
        this.shakeSkitActor(args, macroPos);
        break;
      case "rotate":
      case "回転":
        this.changeAngleSkitActor(args, macroPos);
        break;
      case "flip":
      case "フリップ":
      case "反転":
        this.flipSkitActor(args, macroPos);
        break;
      case "autofocus":
      case "オートフォーカス":
        this.setAutoFocus(args, macroPos);
        break;
      case "focus":
      case "フォーカス":
        this.focusSkitActor(args, macroPos);
        break;
      case "unfocus":
      case "アンフォーカス":
        this.unFocusSkitActor(args, macroPos);
        break;
      case "scale":
      case "拡大":
        this.changeScaleSkitActor(args, macroPos);
        break;
      case "opacity":
      case "不透明度":
      case "オパシティ":
        this.changeOpacitySkitActor(args, macroPos);
        break;
      case "tint":
      case "色調":
        this.changeTintSkitActor(args, macroPos);
        break;
      case "emphasize":
      case "強調":
        this.emphasizeSkitActor(args, macroPos);
        break;
      case "animation":
      case "anim":
      case "アニメーション":
      case "アニメ":
        this.playAnimationSkitActor(args, macroPos);
        break;
      case "wait":
      case "ウェイト":
        this.waitSkitActor(args, macroPos);
        break;
      case "front":
      case "前面":
        this.bringSkitActorToFront(args, macroPos);
        break;
      case "sequence":
      case "シーケンス":
        this.playSequence(args, macroPos);
        break;
      case "loop":
      case "ループ":
        this.playLoop(args, macroPos);
        break;
      case "mob":
      case "モブ":
        this.registerSkitMobName(args, macroPos);
        break;
      case "name":
      case "名前":
        this.setDisplayNameWithSkitActor(args, macroPos);
        break;
      case "eval":
        this.processEval(args);
        break;
    }
  };

  Skit.prototype.processEval = function (args) {
    eval(args[1]);
  };

  /* start
	===================================*/
  Skit.prototype.startSkit = function (args, macroPos) {
    this.start();
  };

  /* end
	 *	[1] : noAnimation
	===================================*/
  Skit.prototype.endSkit = function (args, macroPos) {
    var noAnimation = args[1] === "t" || args[1] === "true";
    this.end(noAnimation);
  };

  /* preload image
	 *  [1] : charaName
	 *  [2] : wait(dummy)
	 *  [3] : pose
	 *  [4] : expression
	===================================*/
  Skit.prototype.preloadImage = function (args, macroPos) {
    var charaName = args[1];
    var folderName = this.actorFolderName(charaName);
    if (!folderName) return;

    var pose = TRP_CORE.supplementDef("normal", args[3]);
    var exp = TRP_CORE.supplementDef(Skit.defaultExpression(), args[4]);

    //pose image
    var filename = pose;
    ImageManager.requestBust(folderName, filename);

    //expression image
    if (exp) {
      filename = pose + "_" + exp;
      ImageManager.requestBust(folderName, filename);
    }
  };

  /* clearActors
	 *  [1] : wait
	===================================*/
  Skit.prototype.clearActors = function (args) {
    var wait = TRP_CORE.supplementSkitWait(false, args[1]);
    this.processClearActors(wait);
  };

  /* show
	 * 	[1] : name
	 * 	[2] : wait		(dummy)
	 *  [3] : position
	 * 	[4] : opacity 		(255)
	===================================*/
  Skit.prototype.showSkitActor = function (args, macroPos) {
    if (!this._isSkitOn) {
      this.start();
    }

    var name = args[1];
    var actor = this.actor(name);

    if (!actor) {
      return;
    }

    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var opacity = args[4];

    actor.show(position, opacity);
  };

  /* hide
	 * 	[1] : name
	===================================*/
  Skit.prototype.hideSkitActor = function (args, macroPos) {
    var name = args[1];
    var actors = this.actorsForHideCommands(name);

    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      actor.hide();
    }
  };

  /* fadeIn
	 * 	[1] : name
	 * 	[2] : wait (true)
	 * 	[3] : position
	 * 	[4] : duration
	 *  [5] : opacity(255)
	 *  [6] : easeType
	 *  [7] : pushIn
	===================================*/
  Skit.prototype.fadeInSkitActor = function (args, macroPos) {
    if (!this._isSkitOn) {
      this.start();
    }

    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var duration = args[4];
    var opacity = args[5];
    var easeType = args[6];

    actor.fadeIn(wait, easeType, position, duration, opacity);

    var pushIn = TRP_CORE.supplementDefBool(parameters.fadeIn.pushIn, args[7]);
    if (pushIn) {
      this.pushOutActorsAroundActor(actor);
    }
  };

  /* fadeOut
	 *  [1] : name
	 *  [2] : waitFlag     (false)
	 *  [3] : duration
	 *  [4] : easeType
	===================================*/
  Skit.prototype.fadeOutSkitActor = function (args, macroPos) {
    var name = args[1];
    var actors = this.actorsForHideCommands(name);

    var wait = args[2];
    var duration = args[3];
    var easeType = args[4];

    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      actor.fadeOut(wait, easeType, duration);
    }
  };

  /* slidein
	 *  [1] : name
	 *  [2] : waitFlag
	 *  [3] : position     (left:2)
	 *  [4] : slideLength   (0.5)
	 *  [5] : speed        (20)
	 *  [6] : direction(auto)
	 *  [7] : easeType
	 *  [8] : pushIn(true)
	===================================*/
  Skit.prototype.slideInSkitActor = function (args, macroPos) {
    if (!this._isSkitOn) {
      this.start();
    }

    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var slideLength = args[4];
    var speed = args[5];
    var direction = args[6];
    var easeType = args[7];

    actor.slideIn(wait, easeType, position, slideLength, speed, direction);

    var pushIn = TRP_CORE.supplementDefBool(parameters.slideIn.pushIn, args[8]);
    if (pushIn) {
      this.pushOutActorsAroundActor(actor);
    }
  };

  /* slideout
	 *  [1] : name
	 *  [2] : waitFlag
	 *  [3] : slideLength   (0.5)
	 *  [4] : speed        (20)
	 *  [5] : direction(auto)
	 *  [6] : easeType
	===================================*/
  Skit.prototype.slideOutSkitActor = function (args, macroPos) {
    var name = args[1];
    var actors = this.actorsForHideCommands(name);

    var wait = args[2];
    var slideLength = args[3];
    var speed = args[4];
    var direction = args[5];
    var easeType = args[6];

    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      actor.slideOut(wait, easeType, slideLength, speed, direction);
    }
  };

  /* moveIn
	 *  [1] : name
	 *  [2] : waitFlag
	 *  [3] : position
	 *  [4] : speed
	 *  [5] : direction(auto)
	 *  [6] : easeType
	 *  [7] : pushIn
	===================================*/
  Skit.prototype.moveInSkitActor = function (args, macroPos) {
    if (!this._isSkitOn) {
      this.start();
    }

    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var speed = args[4];
    var direction = args[5];
    var easeType = args[6];

    actor.moveIn(wait, easeType, position, speed, direction);

    var pushIn = TRP_CORE.supplementDefBool(parameters.moveIn.pushIn, args[7]);
    if (pushIn) {
      this.pushOutActorsAroundActor(actor);
    }
  };

  /* moveOut
	 *  [1] : name
	 *  [2] : waitFlag
	 *  [3] : speed
	 *  [4] : direction(auto)
	 *  [5] : easeType
	===================================*/
  Skit.prototype.moveOutSkitActor = function (args, macroPos) {
    var name = args[1];
    var actors = this.actorsForHideCommands(name);

    var wait = args[2];
    var speed = args[3];
    var direction = args[4];
    var easeType = args[5];

    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      actor.moveOut(wait, easeType, speed, direction);
    }
  };

  /* move
	 *  [1] : name
	 *  [2] : wait
	 *  [3] : position
	 *  [4] : speed
	 *  [5] : relative(false)
	 *  [6] : easeType
	===================================*/
  Skit.prototype.moveSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var speed = args[4];
    var relative = args[5];
    var easeType = args[6];

    actor.movePosition(wait, easeType, position, speed, relative);
  };

  /* move y
	 *  [1] : name
	 *  [2] : wait
	 *  [3] : position
	 *  [4] : duration
	 *  [5] : relative(false)
	 *  [6] : easeType
	===================================*/
  Skit.prototype.moveYSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var duration = args[4];
    var relative = args[5];
    var easeType = args[6];

    actor.moveYPosition(wait, easeType, position, duration, relative);
  };

  /* jump
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : height
	 *  [4] : gravity
	 *  [5] : angle
	 *  <preset>
	 *  double,pop,sank,hop
	===================================*/
  Skit.prototype.jumpSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var height = args[3];
    var gravity = args[4];
    var angle = args[5];

    var duration = actor.jump(wait, height, gravity, angle);
    return duration;
  };

  /* step
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : position
	 *  [4] : speed
	 *  [5] : height
	 *  [6] : gravity
	 *  [7] : relative
	 *  [8] : easeType
	===================================*/
  Skit.prototype.stepSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);
    var speed = args[4];
    var height = args[5];
    var gravity = args[6];
    var relative = args[7];
    var easeType = args[8];

    actor.stepMove(wait, easeType, position, speed, height, gravity, relative);
  };

  /* shake
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : strength
	 *  [4] : count
	 *  [5] : speedDur
	 *  [6] : reverse (逆方向からスタート)
	 *  [7] : easeType
	===================================*/
  Skit.prototype.shakeSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var strength = args[3];
    var count = args[4];
    var speedDur = args[5];
    var reverse = args[6];
    var easeType = args[7];

    actor.shake(wait, easeType, strength, speedDur, count, reverse);
  };

  /* flip
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : num
	 *  [4] : durationPerCount
	 *  [5] : easeType
	===================================*/
  Skit.prototype.flipSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var num = args[3];
    var durationPerCount = args[4];
    var easeType = args[5];

    actor.flip(wait, easeType, num, durationPerCount);
  };

  /* angle
	 *  [1] : name
	 *  [2] : wait
	 *  [3] : angle
	 *  [4] : duration
	 *  [5] : relative
	 *  [6] : easeType
	===================================*/
  Skit.prototype.changeAngleSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var angle = args[3];
    var duration = args[4];
    var relative = args[5];
    var easeType = args[7];

    actor.changeAngle(wait, easeType, angle, duration, relative);
  };

  /* changeExpression
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : expression
	 *  [4] : duration
	===================================*/
  Skit.prototype.changeSkitActorExpression = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var expression = args[3];
    var duration = args[4];

    actor.changeExpression(wait, expression, duration);
  };

  /* changePose
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : pose
	 *  [4] : expression
	 *  [5] : style (flip)
	 *  [6] : duration
	 *  [7] : easeType
	===================================*/
  Skit.prototype.changeSkitActorPose = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var pose = args[3];
    var expression = args[4];
    var style = args[5];
    var duration = args[6];
    var easeType = args[7];

    actor.changePose(wait, easeType, pose, expression, duration, style);
  };

  /* changeScale
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : scaleX
	 *  [4] : scaleY
	 *  [5] : duration
	 *  [6] : relative(false)
	 *  [7] : easeType
	===================================*/
  Skit.prototype.changeScaleSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var scaleX = args[3];
    var scaleY = args[4];
    var duration = args[5];
    var relative = args[6];
    var easeType = args[7];

    actor.changeScale(wait, easeType, duration, scaleX, scaleY, relative);
  };

  /* changeOpacity
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : opacity
	 *  [4] : duration
	 *  [5] : relative(false)
	 *  [6] : easeType
	===================================*/
  Skit.prototype.changeOpacitySkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var opacity = args[3];
    var duration = args[4];
    var relative = args[5];
    var easeType = args[6];

    actor.changeOpacity(wait, easeType, opacity, duration, relative);
  };

  /* changeTint
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : r
	 *  [4] : g
	 *  [5] : b
	 *  [6] : gray
	 *  [7] : duration
	===================================*/
  Skit.prototype.changeTintSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var r = args[3];
    var g = args[4];
    var b = args[5];
    var gray = args[6];

    var tone = parameters.tint.tone;
    if (!isNaN(r)) {
      tone[0] = Number(r);
    }
    if (!isNaN(g)) {
      tone[1] = Number(g);
    }
    if (!isNaN(b)) {
      tone[2] = Number(b);
    }
    if (!isNaN(gray)) {
      tone[3] = Number(gray);
    }

    var duration = args[7];
    actor.changeTone(wait, tone, duration);
  };

  /* setAutoFocus
	 * [1] : autoFocusFlag(true)
	===================================*/
  Skit.prototype.setAutoFocus = function (args, macroPos) {
    var autoFocus = args[1];
    this._autoFocus = TRP_CORE.supplementDefBool(true, autoFocus);
  };

  /* focus
	 *  [1] : name　　　('reset' => 全てfocus)
	 *  [2] : wait (false)
	 *  [3] : onlyFlag (true) 
	===================================*/
  Skit.prototype.focusSkitActor = function (args, macroPos) {
    var target = TRP_CORE.supplementDef("reset", args[1]);

    var wait = args[2];
    var onlyFlag = args[3];

    this.processFocusSkitActor(wait, target, onlyFlag);
  };

  /* unFocus
	 *  [1] : name
	 *  [2] : wait (false)
	===================================*/
  Skit.prototype.unFocusSkitActor = function (args, macroPos) {
    var name = args[1];
    var wait = args[2];

    var actor = this.actor(name);
    if (!actor) {
      return;
    }
    actor.unFocus(wait);
  };

  /* animation
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : animeName
	 *  [4] : mirror
	 *  [5] : focus
	===================================*/
  Skit.prototype.playAnimationSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var animation = args[3];
    var mirror = TRP_CORE.supplementDefBool(
      parameters.animation.mirror,
      args[4]
    );
    var focus = TRP_CORE.supplementDefBool(parameters.animation.focus, args[5]);

    actor.playAnimation(wait, animation, mirror);

    if (focus) {
      this.processFocusSkitActor(TRP_CORE.NO_WAIT, name, false);
    }
  };

  /* emphasize
	 *  [1] : name
	 *  [2] : wait (false)
	 *  [3] : duration
	 *  [4] : scaleX
	 *  [5] : scaleY
	 *  [6] : num
	 *  [7] : interval
	 *  [8] : r
	 *  [9] : g
	 *  [10] : b
	 *  [11] : a
	 *  [12] : easeType
	===================================*/
  Skit.prototype.emphasizeSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var wait = args[2];
    var duration = args[3];
    var scaleX = args[4];
    var scaleY = args[5];
    var num = args[6];
    var interval = args[7];

    var r = args[8];
    var g = args[9];
    var b = args[10];
    var a = args[11];
    var easeType = args[12];

    actor.emphasize(
      wait,
      easeType,
      duration,
      scaleX,
      scaleY,
      num,
      interval,
      r,
      g,
      b,
      a
    );
  };

  /* bringToFront
	 *  [1] : name
	===================================*/
  Skit.prototype.bringSkitActorToFront = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    this.processBringActorToFront(actor);
  };

  /* wait
	 *  [1] : name
	 *  [2] : frame
	===================================*/
  Skit.prototype.waitSkitActor = function (args, macroPos) {
    if (isNaN(args[1])) {
      var name = args[1];
      var actor = this.actor(name);
      if (!actor) {
        return;
      }
      var frame = TRP_CORE.supplementDefNum(30, args[2]);
      actor.wait(frame);
    } else {
      var frame = TRP_CORE.supplementDefNum(30, args[1]);
      this.wait(frame);
    }
  };

  /* playSequence
	 *  [1] : name
	 *  [2] : wait
	 *  [3] : position
	 *  [4]~: macroNames
	===================================*/
  Skit.prototype.playSequence = function (args, macroPos) {
    args = args.concat();

    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }
    var wait = args[2];
    var position = TRP_CORE.supplementDef(args[3], macroPos);

    var macroNames = args.slice(4);
    actor.playSequence(wait, position, macroNames);
  };

  /* playLoop
	 *  [1] : name
	 *  [2] : wait (dummy)
	 *  [3] : position
	 *  [4]~: macroNames
	===================================*/
  var CLEAR_LOOP_ARGS = ["stop", "clear", "ストップ", "クリアー", "クリア"];
  Skit.prototype.playLoop = function (args, macroPos) {
    args = args.concat();

    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }
    var wait;
    if (CLEAR_LOOP_ARGS.contains(args[3])) {
      wait = args[2];
      actor.stopLoop(wait, TRP_CORE.supplementDefBool(false, args[4]));
    } else {
      wait = false;
      var position = TRP_CORE.supplementDef(args[3], macroPos);
      var macroNames = args.slice(4);
      actor.playSequence(wait, position, macroNames, true);
    }
  };

  /* registerMobName
	 *  [1] : name
	===================================*/
  Skit.prototype.registerSkitMobName = function (args, macroPos) {
    var name = args[1];
    this.registerMobName(name);
  };

  /* setDisplayNameWithSkitActor
	 *  [1] : charaName
	 *  [2] : wait(dummy)
	 *  [3] : dispName
	===================================*/
  Skit.prototype.setDisplayNameWithSkitActor = function (args, macroPos) {
    var name = args[1];
    var actor = this.actor(name);
    if (!actor) {
      return;
    }

    var dispName = args[3];
    actor.setTempDisplayName(dispName);
  };

  //=============================================================================
  // Skit => process
  //=============================================================================
  Skit.prototype.initialize = function () {
    this.clearParameters();
    this._autoFocus = true;
  };
  Skit.prototype.clear = function () {
    if (!this._isSkitOn) {
      return;
    }

    var actors = this.actors();
    actors.forEach(function (actor) {
      $gameScreen.erasePicture(actor.pictureId());
    });

    this.clearParameters();
  };
  Skit.prototype.clearParameters = function () {
    this._skitActors = {};
    this._isSkitOn = false;
    this._mobNames = [];

    this._waitAfterClear = false;
    this._waitCount = 0;
  };

  Skit.prototype.start = function () {
    this.clear();
    this._isSkitOn = true;
    this._waitAfterClear = false;
  };

  Skit.prototype.end = function (noAnimation) {
    if (!this._isSkitOn) {
      return;
    }

    if (!noAnimation) {
      this.processClearActors(true);
      this._waitAfterClear = true;
    } else {
      this.clear();
    }
  };

  Skit.prototype.update = function () {
    if (!this.isSkitOn()) {
      return;
    }

    if (this._waitCount > 0) {
      this._waitCount -= 1;
    }
    if (this._waitAfterClear && !this.isBusy()) {
      this.clear();
    }

    var actors = this.actors();
    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      actor.update();
    }
  };

  /* clearActors
	===================================*/
  Skit.prototype.processClearActors = function (wait) {
    var actors = this.actors();
    var disappearCommand = parameters.defaultDisappear || 0;
    actors.forEach(function (actor) {
      if (disappearCommand === 1) {
        actor.moveOut(wait);
      } else if (disappearCommand === 2) {
        actor.slideOut(wait);
      } else {
        actor.fadeOut(wait);
      }
    });
  };

  /* pushOut
	===================================*/
  Skit.prototype.pushOutActorsAroundActor = function (target) {
    var margin = parameters.pushInMargin || 2;
    var position = target._position;
    var easeType = TRP_CORE.EASING.easeInOutQuad;
    var speed = parameters.pushInSpeed || 5;

    var actors = this.actors();
    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      if (actor === target) continue;
      if (!actor._showing) continue;

      var diffPos = actor._position - position;
      var absDiff = Math.abs(diffPos);
      if (absDiff < margin) {
        var sign = diffPos > 0 ? 1 : -1;
        var movePos = position + sign * margin;
        // if(movePos < margin || movePos>10-margin){
        // movePos = position + (-1)*sign*margin;
        // }
        if (movePos < 1 || movePos > 10 - 1) {
          movePos = position + -1 * sign * margin;
        }
        actor.movePosition(
          TRP_CORE.NO_WAIT,
          easeType,
          movePos,
          speed,
          TRP_CORE.ABSOLUTE
        );
      }
    }
  };

  /* focus
	===================================*/
  Skit.prototype.processFocusSkitActor = function (wait, target, onlyFlag) {
    onlyFlag = TRP_CORE.supplementDefBool(true, onlyFlag);

    var focusTargets;
    var length, i;
    switch (target) {
      case "all":
      case "reset":
      case undefined:
        focusTargets = this.actors();
        break;
      default:
        var targetActor = this.actor(target);
        if (targetActor) {
          this.processBringActorToFront(targetActor);
          focusTargets = [targetActor];
        } else {
          focusTargets = [];
        }

        if (onlyFlag) {
          var actors = this.actors();
          length = actors.length;
          for (i = 0; i < length; i = (i + 1) | 0) {
            var actor = actors[i];
            if (actor !== targetActor) {
              actor.unFocus(false);
            }
          }
        }
        break;
    }

    length = focusTargets.length;
    for (i = 0; i < length; i = (i + 1) | 0) {
      focusTargets[i].focus(wait);
    }
  };

  Skit.prototype.onTalk = function (target) {
    if (this._autoFocus) {
      var onlyFlag = true;
      var wait = true;
      this.processFocusSkitActor(wait, target, onlyFlag);
    }
  };

  /* swap order
	===================================*/
  Skit.prototype.processBringActorToFront = function (target) {
    var targetId = target._pictureId;
    var actors = this.actors();
    var length = actors.length;
    var hasMaxZOrder = false;

    var i, actor;
    for (i = 0; i < length; i = (i + 1) | 0) {
      actor = actors[i];
      var pictureId = actor._pictureId;
      if (actor === target) {
        actor.setZOrderMax();
      } else {
        hasMaxZOrder = hasMaxZOrder || actor.isMaxZOrder();
      }
    }

    if (hasMaxZOrder) {
      for (i = 0; i < length; i = (i + 1) | 0) {
        actor = actors[i];
        if (actor !== target) {
          actor.reduceZOrder();
        }
      }
    }
  };

  /* wait
	===================================*/
  Skit.prototype.isBusy = function () {
    if (this._waitCount) {
      return true;
    }

    return this.isAnyActorBusy();
  };
  Skit.prototype.isAnyActorBusy = function () {
    var actors = this.actors();
    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      if (actor.isBusy()) {
        return true;
      }
    }
    return false;
  };

  Skit.prototype.wait = function (wait) {
    this._waitCount = Math.max(wait, this._waitCount);
  };

  /* mob
	===================================*/
  Skit.prototype.registerMobName = function (name) {
    this._mobNames.push(name);
  };
  Skit.prototype.mobNames = function () {
    return parameters.mobNames.concat(this._mobNames);
  };

  /* helper
	===================================*/
  Skit.prototype.isSkitOn = function () {
    return this._isSkitOn;
  };

  Skit.prototype.actors = function () {
    var names = this.names();
    var ret = [];
    var length = names.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      ret.push(this.actor(names[i]));
    }
    return ret;
  };

  Skit.prototype.actorFolderName = function (name) {
    if (parameters.dataActors[name]) {
      return name;
    } else {
      if (
        parameters.nameToInputList[name] &&
        parameters.dataActors[parameters.nameToInputList[name]]
      ) {
        return parameters.nameToInputList[name] || null;
      }
    }

    return null;
  };

  Skit.prototype.actor = function (name) {
    var actor = null;

    if (!parameters.dataActors[name]) {
      if (
        parameters.nameToInputList[name] &&
        parameters.dataActors[parameters.nameToInputList[name]]
      ) {
        name = parameters.nameToInputList[name];
      }
    }

    if (this.names().contains(name)) {
      actor = this._skitActors[name];
    } else if (parameters.dataActors[name]) {
      //CAUTION: mobキャラにもpictureIdが割り振られる(pictureは生成されない)
      var pictureId = this.nextPictureId();
      var diffY = 0;

      actor = new SkitActor(name, pictureId, diffY);
      this._skitActors[name] = actor;
    }

    return actor;
  };

  Skit.prototype.showingActors = function () {
    var ret = [];
    var actors = this.actors();
    var length = actors.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var actor = actors[i];
      if (actor.isShowing()) {
        ret.push(actor);
      }
    }
    return ret;
  };

  Skit.prototype.names = function () {
    return Object.keys(this._skitActors);
  };

  Skit.prototype.nextPictureId = function () {
    var i, id, actor;

    var actors = this.actors();
    var length = actors.length;

    var usingIds = {};
    var releasableIds = {};
    for (i = 0; i < length; i = (i + 1) | 0) {
      actor = actors[i];
      id = actor.pictureId();
      if (id) {
        usingIds[id] = i;
        if (!actor.isShowing()) {
          releasableIds[id] = i;
        }
      }
    }

    var firstId = parameters.firstPictureId;
    var lastId = parameters.lastPictureId;
    var ret = null;
    for (id = firstId; id <= lastId; id = (id + 1) | 0) {
      if (usingIds[id] === undefined) {
        ret = id;
        break;
      }
    }
    if (ret === null) {
      for (id = firstId; id <= lastId; id = (id + 1) | 0) {
        if (releasableIds[id] !== undefined) {
          ret = id;
          actor = actors[releasableIds[id]];
          actor.clearPictureId();
        }
      }
    }

    return ret;
  };

  Skit.prototype.defaultPositionY = function () {
    var y = parameters.baseOffsetY;
    if (parameters.verticalPositionType === 0) {
      var messageWindow = SceneManager._scene._messageWindow;
      y += messageWindow ? messageWindow.height : 0;
    }
    return y;
  };

  Skit.prototype.actorsForHideCommands = function (name) {
    var actors;
    if (name === "all" || name === "全員") {
      actors = this.showingActors();
    } else {
      var actor = this.actor(name);
      if (actor) {
        actors = [actor];
      }
    }
    return actors;
  };

  //=============================================================================
  // SkitActor
  //=============================================================================
  SkitActor.prototype.initialize = function (name, pictureId) {
    this._name = name;

    this._pictureId = null;
    this._battlePictureId = null;
    this.setPictureId(pictureId);

    this.clearTimerCommands();
    this.clearParameters();
  };

  SkitActor.prototype.clearParameters = function () {
    var data = this.data();
    this._offsetY = data.displayOffsetY || 0;

    this._opacity = -1;
    this._scaleX = 100;
    this._scaleY = 100;
    this._baseScale = 1;
    this._position = 1;
    this._xAngle = 0;
    this._angle = 0;
    this._z = 5;

    this._previousJumpDuration = 0;

    this._pose = "normal";
    this._expression = this.defaultExpression();

    this._showing = false;
    this._focusState = Skit.FOCUS_STATE_NONE;

    this._waitingSequences = [];
    this._playingSequences = [];
    this._waitCount = 0;
  };

  SkitActor.prototype.setTempDisplayName = function (displayName) {
    this._tempDisplayName = displayName;
  };
  SkitActor.prototype.displayName = function () {
    if (this._tempDisplayName) {
      return this._tempDisplayName;
    } else {
      var data = this.data();
      if (data) {
        return data.name || "";
      } else {
        return "";
      }
    }
  };

  SkitActor.prototype.changePictureId = function (pictureId) {
    this._pictureId = pictureId;
  };

  /* update
	===================================*/
  SkitActor.prototype.update = function () {
    // if(this._isMob)return;
    if (this._waitCount > 0) {
      this._waitCount -= 1;
      if (this._waitCount <= 0) {
        this._waitCount = 0;
      }
    }

    this.updateTimerCommands();
  };

  /* show & hide
	===================================*/
  SkitActor.prototype.show = function (position, opacity) {
    position = TRP_CORE.interpretPositionArg(position);

    opacity = TRP_CORE.supplementDefNum(
      this._opacity < 0 ? 255 : this._opacity,
      opacity
    );

    this._showing = true;
    this._isFocused = true;

    this._scaleX = 100;
    this._scaleY = 100;
    this._baseScale = (parameters.bustsScale || 100) / 100;
    this._focusScale = 1.0;

    this._angle = 0;
    this._z = 5;

    this._position = TRP_CORE.supplement(this._position, position);
    this._opacity = opacity;

    if (parameters.noReverse) {
      this._yAngle = 0;
    } else {
      this._yAngle = this._position < 5 ? 180 : 0;
    }

    var skitActorName = this._name;
    var fileName = this.fileName();
    var origin = 1;
    var blend = 0;

    var x = this.x();
    var y = this.y();
    var scaleX = this._scaleX;
    var scaleY = this._scaleY;

    $gameScreen.showBustPicture(
      this.pictureId(),
      skitActorName,
      fileName,
      origin,
      x,
      y,
      scaleX,
      scaleY,
      this._opacity,
      blend
    );

    this.apply();
  };

  SkitActor.prototype.hide = function () {
    if (!this._showing) {
      return;
    }

    this._showing = false;
    this.changeOpacity(false, 0, 0, 0, TRP_CORE.ABSOLUTE);
  };

  /* fade in && out
	===================================*/
  SkitActor.prototype.fadeIn = function (
    wait,
    easeType,
    position,
    duration,
    opacity
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.fadeIn.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.fadeIn.easeType,
      easeType
    );
    position = TRP_CORE.interpretPositionArg(position);
    duration = TRP_CORE.supplementDefNum(parameters.fadeIn.duration, duration);
    opacity = TRP_CORE.supplementDefNum(255, opacity);

    this.show(position, 0);
    this.changeOpacity(wait, easeType, opacity, duration, TRP_CORE.ABSOLUTE);
  };

  SkitActor.prototype.fadeOut = function (wait, easeType, duration) {
    if (!this._showing) {
      return;
    }
    this._showing = false;

    wait = TRP_CORE.supplementSkitWait(parameters.fadeOut.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.fadeOut.easeType,
      easeType
    );
    duration = TRP_CORE.supplement(parameters.fadeOut.duration, duration);

    this.changeOpacity(wait, easeType, 0, duration, TRP_CORE.ABSOLUTE);
  };

  /* slideIn & slideOut
	===================================*/
  SkitActor.prototype.slideIn = function (
    wait,
    easeType,
    position,
    slideLength,
    speed,
    direction
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.slideIn.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.slideIn.easeType,
      easeType
    );

    position = TRP_CORE.interpretPositionArg(position);
    slideLength = TRP_CORE.supplementDefNum(
      parameters.slideIn.slideLength,
      slideLength
    );
    speed = TRP_CORE.supplementSpeedArg(parameters.slideIn.speed, speed);

    direction = TRP_CORE.interpretDirectionArg(direction, position);

    var startPosition = position + (direction < 0 ? -slideLength : slideLength);
    var opacity = 0;
    this.show(startPosition, opacity);

    var duration = this.movePosition(
      wait,
      easeType,
      position,
      speed,
      TRP_CORE.ABSOLUTE
    );
    this.changeOpacity(
      TRP_CORE.NO_WAIT,
      easeType,
      255,
      duration,
      TRP_CORE.ABSOLUTE
    );
  };
  SkitActor.prototype.slideOut = function (
    wait,
    easeType,
    slideLength,
    speed,
    direction
  ) {
    this._showing = false;

    wait = TRP_CORE.supplementSkitWait(parameters.slideOut.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.slideOut.easeType,
      easeType
    );
    slideLength = TRP_CORE.supplementDefNum(
      parameters.slideOut.slideLength,
      slideLength
    );
    speed = TRP_CORE.supplementSpeedArg(parameters.slideOut.speed, speed);
    direction = TRP_CORE.interpretDirectionArg(direction, this._position);
    var position =
      this._position + (direction < 0 ? -slideLength : slideLength);

    var duration = this.movePosition(
      wait,
      easeType,
      position,
      speed,
      TRP_CORE.ABSOLUTE
    );
    this.changeOpacity(
      TRP_CORE.NO_WAIT,
      easeType,
      0,
      duration,
      TRP_CORE.ABSOLUTE
    );
  };

  /* moveIn & moveOut
	===================================*/
  SkitActor.prototype.moveIn = function (
    wait,
    easeType,
    position,
    speed,
    direction
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.moveIn.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.moveIn.easeType,
      easeType
    );
    position = TRP_CORE.interpretPositionArg(position);
    speed = TRP_CORE.supplementSpeedArg(parameters.moveIn.speed, speed);
    direction = TRP_CORE.interpretDirectionArg(direction, position);

    var startPosition = direction < 0 ? -2 : 12;
    var opacity = 255;
    this.show(startPosition, opacity);

    var duration = this.movePosition(
      wait,
      easeType,
      position,
      speed,
      TRP_CORE.ABSOLUTE
    );
    return duration;
  };
  SkitActor.prototype.moveOut = function (wait, easeType, speed, direction) {
    // if(this._isMob){return;}
    this._showing = false;

    wait = TRP_CORE.supplementSkitWait(parameters.moveOut.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.moveOut.easeType,
      easeType
    );
    speed = TRP_CORE.supplementSpeedArg(parameters.moveOut.speed, speed);
    direction = TRP_CORE.interpretDirectionArg(direction, this._position);

    var position = direction < 0 ? -3 : 13;
    var duration = this.movePosition(
      wait,
      easeType,
      position,
      speed,
      TRP_CORE.ABSOLUTE
    );
    return duration;
  };

  /* jump
	===================================*/
  SkitActor.prototype.jump = function (wait, height, gravity, angle) {
    height = TRP_CORE.supplementDefNum(parameters.jump.height, height);
    gravity = TRP_CORE.supplementDefNum(parameters.jump.gravity, gravity);

    wait = TRP_CORE.supplementSkitWait(parameters.jump.wait, wait);
    angle = TRP_CORE.supplementDefNum(0, angle);
    angle *= this.isReverse() ? -1 : 1;

    //jump
    var picture = this.picture();
    var duration = picture.jump(height, gravity, angle);

    this._previousJumpDuration = duration;

    if (wait) {
      this.wait(duration);
    }
    return duration;
  };

  /* step
	===================================*/
  SkitActor.prototype.stepMove = function (
    wait,
    easeType,
    position,
    speed,
    height,
    gravity,
    relative
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.step.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(parameters.step.easeType, easeType);

    position = TRP_CORE.interpretPositionArg(position);
    speed = TRP_CORE.supplementSpeedArg(parameters.step.speed, speed);
    height = TRP_CORE.supplementDefNum(parameters.step.height, height);
    gravity = TRP_CORE.supplementDefNum(parameters.step.gravity, gravity);
    relative = TRP_CORE.supplementDefBool(parameters.step.relative, relative);

    var targetPos = this._calcMovePosition(position, relative);
    var difPos = Math.abs(this._position - targetPos);
    var moveDur = (difPos / speed) * 60;

    //stepDurで割り切れるようにmoveのdurationを揃える
    var stepDur = this.stepDuration(height, gravity);
    var stepCount = Math.ceil(moveDur / stepDur);
    var duration = stepCount * stepDur;

    this.step(stepCount, height, gravity);
    this.movePositionDur(wait, easeType, position, duration, relative);
  };

  SkitActor.prototype.step = function (stepCount, height, gravity) {
    var picture = this.picture();
    var stepDur = picture.jump(height, gravity);

    stepCount -= 1;
    if (stepCount > 0) {
      this.pushTimerCommand(stepDur, "step", [stepCount, height, gravity]);
    }
  };

  SkitActor.prototype.stepDuration = function (height, gravity) {
    var picture = this.picture();
    var duration = picture.jump(height, gravity);
    picture.resetJump();

    return duration;
  };

  /* shake
	===================================*/
  SkitActor.prototype.shake = function (
    wait,
    easeType,
    strength,
    speedDur,
    count,
    reverse
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.shake.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.shake.easeType,
      easeType
    );
    strength = TRP_CORE.supplementDefNum(parameters.shake.strength, strength);
    speedDur = TRP_CORE.supplementDefNum(
      parameters.shake.durationPerCount,
      speedDur
    );
    count = TRP_CORE.supplementDefNum(parameters.shake.count, count);
    reverse = TRP_CORE.supplementDefBool(parameters.shake.reverse, reverse);

    if (count > 0) {
      count += 1;
    }

    this.processShake(easeType, strength, speedDur, count, reverse, true);

    if (wait) {
      var duration = count * speedDur;
      this.wait(duration);
    }
  };

  SkitActor.prototype.processShake = function (
    easeType,
    strength,
    speedDur,
    count,
    reverse,
    first
  ) {
    var diffPos = strength * 0.05;
    var duration = speedDur;
    if (first || count === 1) {
      diffPos /= 2;
      duration /= 2;
    }

    if (count % 2 === 0) {
      diffPos *= -1;
    }
    if (reverse) {
      diffPos *= -1;
    }

    this.movePositionDur(
      TRP_CORE.NO_WAIT,
      easeType,
      diffPos,
      duration,
      TRP_CORE.RELEATIVE
    );

    count -= 1;
    if (count > 0) {
      this.pushTimerCommand(duration, "processShake", [
        easeType,
        strength,
        speedDur,
        count,
        reverse,
        false,
      ]);
    }
  };

  /* expression & pose
	===================================*/
  SkitActor.prototype.changeExpression = function (wait, expression, duration) {
    wait = TRP_CORE.supplementSkitWait(parameters.expression.wait, wait);
    expression = TRP_CORE.supplementDef(this.defaultExpression(), expression);
    duration = TRP_CORE.supplementDefNum(
      parameters.expression.duration,
      duration
    );

    var pose = null;
    var style = "auto";
    var easeType = 0;

    this.changeImage(wait, easeType, pose, expression, duration, style);
  };

  SkitActor.prototype.changePose = function (
    wait,
    easeType,
    pose,
    expression,
    duration,
    style
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.pose.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(parameters.pose.easeType, easeType);
    style = TRP_CORE.supplementDef("auto", style);
    pose = TRP_CORE.supplementDef("normal", pose);
    duration = TRP_CORE.supplementDefNum(parameters.pose.duration, duration);

    expression = TRP_CORE.supplementDef(null, expression);

    this.changeImage(wait, easeType, pose, expression, duration, style);
  };

  SkitActor.prototype.changeImage = function (
    wait,
    easeType,
    pose,
    expression,
    duration,
    style
  ) {
    if (!this._showing) {
      if (pose && this._pose !== pose) {
        this._pose = pose;
        this._expression = expression || this.defaultExpression();
      } else if (expression) {
        this._expression = expression;
      }
      return;
    }

    if (this._nextPose) {
      pose = pose || this._nextPose;
      this._nextPose = null;
    }

    style = TRP_CORE.supplementDef("auto", style);
    var poseChange = false;
    if (pose && pose !== "false" && pose !== "f") {
      if (pose !== this._pose) {
        poseChange = true;
        this._pose = pose || "normal";
        this._expression = null;
        if (style === "auto") {
          if (this._opacity === 0) {
            style = null;
          } else {
            style = parameters.pose.style;
          }
        }

        if (!expression) {
          expression = this.defaultExpression();
        }
      }
    }
    if (!poseChange && style === "auto") {
      style = null;
    }

    var expressionChange = poseChange;
    if (
      !expression ||
      expression === 0 ||
      expression === "0" ||
      expression === "false" ||
      expression === "f"
    ) {
      // expression = null;
      expression = this.defaultExpression();
    }
    if (expression !== this._expression) {
      expressionChange = true;
      this._expression = expression;
    }

    if (style === "auto") {
      style = parameters.pose.style;
    }

    switch (style) {
      case "flip":
      case "フリップ":
      case "1":
      case 1:
        this.changeImageWithFlipAnimation(wait, easeType, duration);
        break;
      case "fade":
      case "フェード":
      case "2":
      case 2:
        this.changeImageWithFadeAnimation(wait, easeType, duration);
        break;
      default:
        this.changeImageWithoutAnimation(
          wait,
          duration,
          poseChange,
          expressionChange
        );
    }
  };

  SkitActor.prototype.changeImageWithoutAnimation = function (
    wait,
    duration,
    poseChange,
    expressionChange
  ) {
    var picture = this.picture();
    if (poseChange) {
      var imageName = this.fileName();
      picture.changeImage(imageName);
    }
    if (expressionChange) {
      var overlayName = this.overlayName();
      duration = 0;
      picture.changeOverlay(overlayName, duration);
      if (wait) {
        this.wait(duration);
      }
    }
  };

  SkitActor.prototype.changeImageWithFlipAnimation = function (
    wait,
    easeType,
    duration
  ) {
    wait = TRP_CORE.supplement(false, wait);
    duration = TRP_CORE.supplementDefNum(12, duration);
    duration = Math.ceil(duration / 2);

    this.flip(wait, easeType, 0.5, duration);

    this.pushTimerCommand(duration, "changeImageStartFlipEmerge", [
      wait,
      easeType,
      duration,
    ]);
  };
  SkitActor.prototype.changeImageStartFlipEmerge = function (
    wait,
    easeType,
    duration
  ) {
    var picture = this.picture();
    picture.changeImage(this.fileName());
    picture.changeOverlay(this.overlayName(), 0);

    this.flip(wait, easeType, -0.5, duration);
  };
  SkitActor.prototype.changeImageWithFadeAnimation = function (
    wait,
    easeType,
    duration
  ) {
    wait = TRP_CORE.supplement(false, wait);
    duration = TRP_CORE.supplementDefNum(12, duration);
    duration = Math.ceil(duration / 2);

    var opacity = this._opacity;
    this.changeOpacity(wait, easeType, 0, duration, TRP_CORE.ABSOLUTE);

    this.pushTimerCommand(duration, "changeImageStartFadeEmerge", [
      wait,
      easeType,
      duration,
      opacity,
    ]);
  };
  SkitActor.prototype.changeImageStartFadeEmerge = function (
    wait,
    easeType,
    duration,
    opacity
  ) {
    var picture = this.picture();
    picture.changeImage(this.fileName());
    picture.changeOverlay(this.overlayName(), 0);

    this.changeOpacity(wait, easeType, opacity, duration, TRP_CORE.ABSOLUTE);
  };

  /* change Opacity
	===================================*/
  SkitActor.prototype.changeOpacity = function (
    wait,
    easeType,
    opacity,
    duration,
    relative
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.opacity.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(
      parameters.opacity.easeType,
      easeType
    );
    opacity = TRP_CORE.supplementDefNum(parameters.opacity.opacity, opacity);
    duration = TRP_CORE.supplementDefNum(parameters.opacity.duration, duration);
    relative = TRP_CORE.supplementDefBool(
      parameters.opacity.easeType.relative,
      relative
    );

    this._opacity = opacity;

    var picture = this.picture();
    if (picture) {
      picture.changeOpacity(opacity, duration, relative, easeType);
    }

    if (wait && duration) {
      this.wait(duration);
    }
  };

  /* focus & unFocus
	===================================*/
  SkitActor.prototype.focus = function (wait) {
    wait = TRP_CORE.supplementSkitWait(parameters.focus.wait, wait);
    var duration = parameters.focus.duration;
    var easeType = parameters.focus.easeType;

    this._focused = true;

    this.clearTone(wait, duration);

    var scale = 1;
    this.changeFocusScale(TRP_CORE.NO_WAIT, easeType, duration, scale);

    if (wait) {
      this.wait(duration);
    }
  };

  SkitActor.prototype.unFocus = function (wait) {
    // if(this._isMob){return;}
    this._focused = false;

    wait = TRP_CORE.supplementSkitWait(parameters.unFocus.wait, wait);
    var duration = parameters.unFocus.duration;
    var easeType = parameters.unFocus.easeType;

    var tone = parameters.unFocus.tone || [-150, -150, -150, 0];
    this.changeTone(wait, tone, 10);

    var scale = parameters.unFocus.scale / 100 || 1;
    this.changeFocusScale(TRP_CORE.NO_WAIT, easeType, duration, scale);
  };

  /* changeTone
	===================================*/
  SkitActor.prototype.changeTone = function (wait, tone, duration) {
    this._tone = tone;
    tone = tone || [0, 0, 0, 0];
    duration = TRP_CORE.supplementDefNum(parameters.tint.duration, duration);
    wait = TRP_CORE.supplementSkitWait(parameters.tint.wait, wait);

    var picture = this.picture();
    if (picture) {
      picture.tint(tone, duration);
    }

    if (wait) {
      this.wait(duration);
    }
  };

  SkitActor.prototype.clearTone = function (wait, duration) {
    var tone = [0, 0, 0, 0];
    this.changeTone(wait, tone, duration);
  };

  /* emphasizeEffect
	===================================*/
  SkitActor.prototype.emphasize = function (
    wait,
    easeType,
    duration,
    scaleX,
    scaleY,
    num,
    interval,
    r,
    g,
    b,
    a
  ) {
    duration = TRP_CORE.supplementDefNum(
      parameters.emphasize.duration,
      duration
    );
    scaleX =
      TRP_CORE.supplementDefNum(parameters.emphasize.scaleX, scaleX) / 100;
    scaleY =
      TRP_CORE.supplementDefNum(parameters.emphasize.scaleY, scaleY) / 100;
    num = TRP_CORE.supplementDefNum(parameters.emphasize.num, num);
    interval = TRP_CORE.supplementDefNum(
      parameters.emphasize.interval,
      interval
    );
    wait = TRP_CORE.supplementSkitWait(parameters.emphasize.wait, wait);

    var tone;
    if (r !== undefined && g !== undefined && b !== undefined) {
      tone = [r, g, b, a || 0];
    } else {
      tone = null;
    }

    this.picture().emphasize(
      duration,
      scaleX,
      scaleY,
      num,
      interval,
      tone,
      easeType
    );

    if (wait) {
      this.wait(num * interval + duration);
    }
  };

  /* scale
	===================================*/
  SkitActor.prototype.changeScale = function (
    wait,
    easeType,
    duration,
    scaleX,
    scaleY,
    relative
  ) {
    var param = parameters.scale;

    wait = TRP_CORE.supplementSkitWait(param.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(param.easeType, easeType);
    duration = TRP_CORE.supplementDefNum(param.duration, duration);
    scaleX = TRP_CORE.supplementDefNum(param.scaleX, scaleX);
    scaleY = TRP_CORE.supplementDefNum(param.scaleY, scaleY);
    relative = TRP_CORE.supplementDefBool(param.relative, relative);

    this._scaleX = scaleX * (relative ? this._scaleX / 100 : 1);
    this._scaleY = scaleY * (relative ? this._scaleY / 100 : 1);

    this.applyScale(wait, easeType, duration);
  };
  SkitActor.prototype.changeFocusScale = function (
    wait,
    easeType,
    duration,
    scale
  ) {
    scale = scale || 1.0;
    this._focusScale = scale;
    this.applyScale(wait, easeType, duration, scale);
  };
  SkitActor.prototype.applyScale = function (wait, easeType, duration) {
    var scaleX = this.scaleX() * (parameters.useRightDirection ? -1 : 1);
    var scaleY = this.scaleY();

    var picture = this.picture();
    if (picture) {
      picture.changeScale(
        scaleX,
        scaleY,
        duration,
        TRP_CORE.ABSOLUTE,
        easeType
      );
    }
    if (wait) {
      this.wait(duration);
    }
  };

  /* move position
	===================================*/
  SkitActor.prototype.movePosition = function (
    wait,
    easeType,
    position,
    speed,
    relative
  ) {
    wait = TRP_CORE.supplementSkitWait(parameters.move.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(parameters.move.easeType, easeType);
    position = TRP_CORE.interpretPositionArg(position);

    relative = TRP_CORE.supplementDefBool(false, relative);
    var targetPos = this._calcMovePosition(position, relative);

    var difPos = Math.abs(this._position - targetPos);

    var duration;
    if (speed === "jump" && this._previousJumpDuration) {
      duration = this._previousJumpDuration;
    } else {
      speed = TRP_CORE.supplementSpeedArg(parameters.move.speed, speed);
      duration = (difPos / speed) * 60;
    }

    duration = this.movePositionDur(
      wait,
      easeType,
      position,
      duration,
      relative
    );

    return duration;
  };
  SkitActor.prototype.movePositionDur = function (
    wait,
    easeType,
    position,
    duration,
    relative
  ) {
    relative = TRP_CORE.supplementDefBool(false, relative);

    // var targetPos = position + (relative ? this._position : 0);
    var targetPos = this._calcMovePosition(position, relative);

    this._position = targetPos;

    duration = this.processMove(wait, easeType, duration);
    return duration;
  };
  SkitActor.prototype.processMove = function (wait, easeType, duration) {
    wait = TRP_CORE.supplementSkitWait(false, wait);
    easeType = TRP_CORE.supplementNum(0, easeType);
    duration = TRP_CORE.supplementNum(0, duration);

    var x = this.x();
    var y = this.y();

    var picture = this.picture();
    if (picture) {
      picture.movePosition(x, y, duration, TRP_CORE.ABSOLUTE, easeType);
    }

    if (wait && duration) {
      this.wait(duration);
    }

    return duration;
  };
  SkitActor.prototype._calcMovePosition = function (position, relative) {
    if (relative) {
      if (this.isReverse()) {
        return this._position + position;
      } else {
        return this._position - position;
      }
    } else {
      return position;
    }
  };

  /* move y position
	===================================*/
  SkitActor.prototype.moveYPosition = function (
    wait,
    easeType,
    position,
    duration,
    relative
  ) {
    var defParams = parameters.yMove;
    wait = TRP_CORE.supplementSkitWait(defParams ? defParams.wait : true, wait);
    easeType = TRP_CORE.supplementEasingArg(
      defParams ? defParams.easeType : TRP_CORE.EASING.easeOutQuad,
      easeType
    );
    position = TRP_CORE.interpretPositionArg(position);
    duration = TRP_CORE.supplementSpeedArg(
      defParams ? defParams.duration : 20,
      duration
    );
    relative = TRP_CORE.supplementDefBool(false, relative);

    this._offsetY =
      position + (relative ? this._offsetY : this.data().displayOffsetY);
    this.processMove(wait, easeType, duration);

    return duration;
  };

  /* flip
	===================================*/
  SkitActor.prototype.flip = function (wait, easeType, num, durationPerCount) {
    wait = TRP_CORE.supplementSkitWait(parameters.flip.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(parameters.flip.easeType, easeType);
    num = TRP_CORE.supplementDefNum(parameters.flip.num, num);
    durationPerCount = TRP_CORE.supplementDefNum(
      parameters.flip.durationPerCount,
      durationPerCount
    );

    var angle = 180 * num;
    var duration = Math.abs(durationPerCount * num);

    this.changeYAngle(wait, easeType, angle, duration, TRP_CORE.RELEATIVE);
  };
  SkitActor.prototype.setYAngle = function (angle, relative) {
    this.changeYAngle(false, angle, 0, relative);
  };
  SkitActor.prototype.changeYAngle = function (
    wait,
    easeType,
    angle,
    duration,
    relative
  ) {
    this._yAngle = angle + (relative ? this._yAngle : 0);

    var picture = this.picture();
    if (picture) {
      picture.changeYAngle(angle, duration, relative, easeType);
    }
    if (wait) {
      this.wait(duration);
    }
  };

  SkitActor.prototype.isReverse = function () {
    var cos = Math.cos((this._yAngle * Math.PI) / 180);
    if (cos === 0) {
      return this._scaleX < 0;
    } else {
      return this._scaleX * cos < 0;
    }
  };

  TRP_CORE.NO_EASE = TRP_CORE.EASING.linear;

  /* changeAngle
	===================================*/
  SkitActor.prototype.setAngle = function (angle, relative) {
    this.changeAngle(TRP_CORE.NO_WAIT, TRP_CORE.NO_EASE, angle, 0, relative);
  };
  SkitActor.prototype.changeAngle = function (
    wait,
    easeType,
    angle,
    duration,
    relative
  ) {
    var param = parameters.angle;

    wait = TRP_CORE.supplementSkitWait(param.wait, wait);
    easeType = TRP_CORE.supplementEasingArg(param.easeType, easeType);
    angle = TRP_CORE.supplementDefNum(param.angle, angle);
    duration = TRP_CORE.supplementDefNum(param.duration, duration);
    relative = TRP_CORE.supplementDefBool(param.relative, relative);

    if (!this.isReverse()) {
      angle *= -1;
    }
    this._angle = angle + (relative ? this._angle : 0);

    var picture = this.picture();
    if (picture) {
      picture.changeAngle(angle, duration, relative, easeType);
    }

    if (wait) {
      this.wait(duration);
    }
  };

  /* animation
	===================================*/
  SkitActor.prototype.playAnimation = function (wait, animeName, mirror) {
    mirror = TRP_CORE.supplementDefBool(false, mirror);
    wait = TRP_CORE.supplementSkitWait(parameters.animation.wait, wait);

    var animationId = TRP_CORE.interpretAnimationArg(animeName);
    var animation = $dataAnimations[animationId];
    if (!animation) {
      return;
    }

    this.startAnimation(animationId, mirror);

    if (wait) {
      var duration = 4 * animation.frames.length;
      this.wait(duration);
    }
  };

  SkitActor.prototype.startAnimation = function (animationId, mirror) {
    var animation = $dataAnimations[animationId];
    if (
      !parameters.noAnimationMirror &&
      !(animation && animation.name.contains("<noMirror>"))
    ) {
      mirror = mirror ^ !this.isReverse();
    }

    var picture = this.picture();
    if (picture) {
      picture.requestAnimation(animationId, mirror);
    }
  };

  /* zOrder
	===================================*/
  SkitActor.MAX_Z_ORDER = 10;

  SkitActor.prototype.isMaxZOrder = function () {
    return this._z === SkitActor.MAX_Z_ORDER;
  };
  SkitActor.prototype.initZOrder = function () {
    this._z = 5;
  };
  SkitActor.prototype.setZOrder = function (z) {
    this._z = z;
    var picture = this.picture();
    if (picture) {
      picture.setBustPictureZ(z);
    }
  };
  SkitActor.prototype.setZOrderMax = function () {
    this.setZOrder(SkitActor.MAX_Z_ORDER);
  };
  SkitActor.prototype.reduceZOrder = function () {
    var z = this._z;
    z *= (SkitActor.MAX_Z_ORDER - 1) / SkitActor.MAX_Z_ORDER;
    this.setZOrder(z);
  };

  /* apply
	===================================*/
  SkitActor.prototype.apply = function () {
    var picture = this.picture();

    var overlay = this.overlayName();
    picture.changeOverlay(overlay, 0);

    picture.setPosition(this.x(), this.y());
    picture.setAngle(this._angle);
    picture.setYAngle(this._yAngle);
    picture.setOpacity(this._opacity, 0);

    var scaleX = this.scaleX() * (parameters.useRightDirection ? -1 : 1);
    picture.setScale(scaleX, this.scaleY());
    picture.setBustPictureZ(this._z);

    var data = this.data();
    picture.setAnimationOffset(
      data.animationOffsetX || 0,
      data.animationOffsetY || 0
    );
  };

  /* wait
	===================================*/
  SkitActor.prototype.wait = function (wait) {
    if (this._playingSequences[0]) {
      this._playingSequences[0]._waitCount = Math.max(
        wait,
        this._playingSequences[0]._waitCount
      );
    } else {
      this._waitCount = Math.max(wait, this._waitCount);
    }
  };
  SkitActor.prototype.isBusy = function () {
    return this._waitCount > 0 || this._waitingSequences.length > 0;
  };

  /* timerCommand
	===================================*/
  SkitActor.prototype.pushTimerCommand = function (duration, command, args) {
    //一旦newに入れておいて、次回updateループからtimerCommandsに移される
    this._newTimerCommands.push({
      duration: duration,
      command: command,
      args: args,
    });
  };
  SkitActor.prototype.clearTimerCommands = function () {
    this._newTimerCommands = [];
    this._timerCommands = [];
  };
  SkitActor.prototype.updateTimerCommands = function () {
    var timerCommands = this._timerCommands.concat(this._newTimerCommands);
    this._newTimerCommands = [];

    var existTimerCommands = [];
    var length = timerCommands.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var timerCommand = timerCommands[i];
      timerCommand.duration -= 1;
      if (timerCommand.duration <= 0) {
        var command = timerCommand.command;
        var args = timerCommand.args;
        if (this[command]) {
          this[command].apply(this, args);
        }
      } else {
        existTimerCommands.push(timerCommand);
      }
    }

    this._timerCommands = existTimerCommands;
  };

  /* sequence
	===================================*/
  const LOOP_ARG = "__LOOP";
  SkitActor.prototype.playSequence = function (
    wait,
    position,
    macroCommands,
    loop
  ) {
    wait = TRP_CORE.supplementSkitWait(false, wait);
    if (macroCommands.length <= 0) {
      return;
    }

    loop = loop || false;
    if (loop) {
      macroCommands.push(LOOP_ARG);
    }
    var sequence = {
      macroCommands: macroCommands,
      waitCount: 0,
      position: position,
      loop: loop,
    };

    if (wait) {
      this.pushWaitingSequence(sequence);
    }
    this.processSequence(sequence);
  };
  SkitActor.prototype.stopLoop = function (wait, quit) {
    wait = TRP_CORE.supplementSkitWait(true, wait);

    var sequences = this._waitingSequences;
    var length = sequences.length;
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      var sequence = sequences[i];
      if (!sequence.loop) continue;
      if (quit) {
        sequences.splice(i, 1);
      } else {
        sequence.loop = false;
        if (wait) {
          this.pushWaitingSequence(sequence);
        }
      }
    }

    for (var i = 0; i < 2; i = (i + 1) | 0) {
      var commands = i === 0 ? this._timerCommands : this._newTimerCommands;
      var length = commands.length;
      for (var j = length - 1; j >= 0; j = (j - 1) | 0) {
        var command = commands[j];
        if (command.command !== "processSequence") continue;
        var sequence = command.args[0];
        if (sequence && sequence.loop) {
          if (quit) {
            commands.splice(j, 1);
          } else {
            sequence.loop = false;
            if (wait) {
              this.pushWaitingSequence(sequence);
            }
          }
        }
      }
    }
  };

  SkitActor.prototype.pushWaitingSequence = function (sequence) {
    this._waitingSequences.push(sequence);
  };
  SkitActor.prototype.didFinishSequence = function (sequence) {
    TRP_CORE.removeArrayObject(this._waitingSequences, sequence);
  };

  SkitActor.prototype.processSequence = function (sequence) {
    var macroCommand = sequence.macroCommands.shift();
    if (!macroCommand || (!sequence.loop && macroCommand === LOOP_ARG)) {
      this.didFinishSequence(sequence);
      return;
    }
    if (sequence.loop) {
      sequence.macroCommands.push(macroCommand);
    }

    var position = sequence.position;

    sequence._waitCount = 0;
    this._playingSequences.unshift(sequence);
    this.playMacroCommand(macroCommand, position);
    this._playingSequences.shift();

    var waitCount = sequence._waitCount;

    if (!waitCount) {
      this.processSequence(sequence);
    } else {
      this.pushTimerCommand(waitCount, "processSequence", [sequence]);
    }
  };
  SkitActor.prototype.playMacroCommand = function (macroCommand, position) {
    $gameSkit.processCommand([macroCommand, this._name], position);
  };

  /* helper
	===================================*/
  SkitActor.prototype.data = function () {
    return parameters.dataActors[this._name];
  };
  SkitActor.prototype.picture = function () {
    var pictureId = this.pictureId();
    var picture = $gameScreen.picture(pictureId);

    if (!picture) {
      pictureId = $gameSkit.nextPictureId();
      if (pictureId) {
        this.setPictureId(pictureId);
        picture = $gameScreen.picture(pictureId);
      } else {
        console.error("立ち絵用のピクチャ番号を確保できませんでした。");
      }
    }
    return picture;
  };
  SkitActor.prototype.clearPictureId = function () {
    this.setPictureId(null);
  };
  SkitActor.prototype.setPictureId = function (pictureId) {
    if (SceneManager.isScene(Scene_Battle)) {
      this._battlePictureId = pictureId;
    } else {
      this._pictureId = pictureId;
    }
  };
  SkitActor.prototype.pictureId = function () {
    if (SceneManager.isScene(Scene_Battle)) {
      return this._battlePictureId;
    } else {
      return this._pictureId;
    }
  };
  SkitActor.prototype.isShowing = function () {
    return this._showing;
  };

  SkitActor.prototype.x = function () {
    return this.xForPosition(this._position);
  };
  SkitActor.prototype.xForPosition = function (position) {
    return Math.floor((position / 10) * Graphics.boxWidth);
  };
  SkitActor.prototype.y = function () {
    return Graphics.boxHeight - ($gameSkit.defaultPositionY() - this._offsetY);
  };
  SkitActor.prototype.scaleX = function () {
    return this._scaleX * this._baseScale * this._focusScale;
  };
  SkitActor.prototype.scaleY = function () {
    return this._scaleY * this._baseScale * this._focusScale;
  };
  SkitActor.prototype.defaultExpression = function () {
    return Skit.defaultExpression();
  };

  SkitActor.prototype.fileName = function () {
    var fileName = this._pose;
    return fileName;
  };
  SkitActor.prototype.overlayName = function () {
    if (this._expression) {
      var fileName = this._pose + "_" + this._expression;
      return fileName;
    } else {
      return null;
    }
  };

  //=============================================================================
  // Game_Screen
  //=============================================================================
  Game_Screen.prototype.showBustPicture = function (
    pictureId,
    skitActorName,
    name,
    origin,
    x,
    y,
    scaleX,
    scaleY,
    opacity,
    blendMode
  ) {
    var realPictureId = this.realPictureId(pictureId);
    var picture = new Game_Picture();
    picture.showBust(
      skitActorName,
      name,
      origin,
      x,
      y,
      scaleX,
      scaleY,
      opacity,
      blendMode
    );
    this._pictures[realPictureId] = picture;
  };

  //=============================================================================
  // Game_Picture
  //=============================================================================
  var _Game_Picture_initialize = Game_Picture.prototype.initialize;
  Game_Picture.prototype.initialize = function () {
    this.initAnimation();
    this.initAngleChange();
    this.initYAngleChange();
    this.initOpacityChange();
    this.initMovement();
    this.initScaleChange();
    this.initJump();

    _Game_Picture_initialize.apply(this, arguments);
  };
  Game_Picture.prototype.showBust = function (
    skitActorName,
    name,
    origin,
    x,
    y,
    scaleX,
    scaleY,
    opacity,
    blendMode
  ) {
    this.initBustPicture();
    this._skitActorName = skitActorName;
    this.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
  };

  Game_Picture.prototype.initBustPicture = function () {
    this._bustPictureZ = 5;
    this._nextImageName = null;
  };

  var _Game_Picture_update = Game_Picture.prototype.update;
  Game_Picture.prototype.update = function () {
    _Game_Picture_update.call(this);

    if (this._moveDuration > 0) {
      this.updateMovement();
    }
    if (this._yAngleDuration > 0) {
      this.updateYAngleChange();
    }
    if (this._angleDuration > 0) {
      this.updateAngleChange();
    }
    if (this._opacityDuration > 0) {
      this.updateOpacityChange();
    }
    if (this._scaleDuration > 0) {
      this.updateScaleChange();
    }
    if (this._jumpMaxDuration > 0) {
      this.updateJump();
    }
  };

  /* opacity
	===================================*/
  Game_Picture.prototype.initOpacityChange = function () {
    this.clearOpacityChange();
  };
  Game_Picture.prototype.clearOpacityChange = function () {
    this._opacityDuration = 0;
    this._opacityTotalDuration = 0;
  };
  Game_Picture.prototype.setOpacity = function (opacity, relative) {
    this.changeOpacity(opacity, 0, relative, TRP_CORE.NO_EASE);
  };
  Game_Picture.prototype.changeOpacity = function (
    opacity,
    duration,
    relative,
    easeType
  ) {
    duration = Math.ceil(duration);
    opacity = opacity + (relative ? this._opacity : 0);
    if (duration <= 0) {
      this.clearOpacityChange();
      this._opacity = this._targetOpacity = opacity;
    } else {
      this._targetOpacity = opacity;
      this._deltaOpacity = opacity - this._opacity;
      this._startOpacity = this._opacity;
      this._opacityDuration = this._opacityTotalDuration = duration;
      this._opacityEaseType = easeType;
    }
  };
  Game_Picture.prototype.updateOpacityChange = function () {
    this._opacityDuration -= 1;

    var t = this._opacityTotalDuration - this._opacityDuration;
    this._opacity = TRP_CORE.easingValue(
      t,
      this._startOpacity,
      this._deltaOpacity,
      this._opacityTotalDuration,
      this._opacityEaseType
    );

    if (this._opacityDuration <= 0) {
      this.clearOpacityChange();
    }
  };

  // case $.BACK_IN :
  //     per =  ((2+1)*t-2)*t*t;
  //     break;
  // case $.BACK_OUT :
  //     per =  ((2+1)*(t-1)+2)*(t-1)*(t-1)+1;
  //     break;
  // case $.BACK_IN_OUT :
  //     t = t*2;
  //     if(t<1){
  //         return 1/2 * t*t*((1.5+1)*t-1.5);
  //     }else{
  //         t -= 2;
  //         return 1/2 * (t*t*((2.5+1)*t+2.5)+2)
  //     }
  //     break;

  /* scale
	===================================*/
  Game_Picture.prototype.initScaleChange = function () {
    this.clearScaleChange();
  };
  Game_Picture.prototype.clearScaleChange = function () {
    this._scaleDuration = 0;
    this._scaleTotalDuration = 0;
  };
  Game_Picture.prototype.setScale = function (scaleX, scaleY, relative) {
    this.changeScale(scaleX, scaleY, 0, relative, TRP_CORE.NO_EASE);
  };
  Game_Picture.prototype.changeScale = function (
    scaleX,
    scaleY,
    duration,
    relative,
    easeType
  ) {
    duration = Math.ceil(duration);
    scaleX += relative ? this._scaleX : 0;
    scaleY += relative ? this._scaleY : 0;
    if (duration <= 0) {
      this.clearScaleChange();
      this._scaleX = this._targetScaleX = scaleX;
      this._scaleY = this._targetScaleY = scaleY;
    } else {
      this._targetScaleX = scaleX;
      this._targetScaleY = scaleY;
      this._deltaScaleX = scaleX - this._scaleX;
      this._deltaScaleY = scaleY - this._scaleY;
      this._startScaleX = this._scaleX;
      this._startScaleY = this._scaleY;
      this._scaleTotalDuration = duration;
      this._scaleDuration = duration;
      this._scaleEaseType = easeType;
    }
  };
  Game_Picture.prototype.updateScaleChange = function () {
    this._scaleDuration -= 1;
    var t = this._scaleTotalDuration - this._scaleDuration;
    this._scaleX = TRP_CORE.easingValue(
      t,
      this._startScaleX,
      this._deltaScaleX,
      this._scaleTotalDuration,
      this._scaleEaseType
    );
    this._scaleY = TRP_CORE.easingValue(
      t,
      this._startScaleY,
      this._deltaScaleY,
      this._scaleTotalDuration,
      this._scaleEaseType
    );
    if (this._scaleDuration <= 0) {
      this.clearScaleChange();
    }
  };

  /* overlay
	===================================*/
  Game_Picture.prototype.changeOverlay = function (imageName, duration) {
    this._overlayName = imageName;
    this._overlayDuration = duration;
  };

  /* changeImage
	===================================*/
  Game_Picture.prototype.changeImage = function (imageName) {
    this._nextImageName = imageName;
  };

  Game_Picture.prototype.onChangeImage = function (imageName) {
    this._nextImageName = null;
    this._name = imageName;
  };

  /* movement
	===================================*/
  Game_Picture.prototype.initMovement = function () {
    this.clearMovement();
  };
  Game_Picture.prototype.clearMovement = function () {
    this._moveDuration = 0;
    this._moveTotalDuration = 0;
  };
  Game_Picture.prototype.setPosition = function (x, y, relative) {
    this.movePosition(x, y, 0, relative, TRP_CORE.NO_EASE);
  };
  Game_Picture.prototype.movePosition = function (
    x,
    y,
    duration,
    relative,
    easeType
  ) {
    duration = Math.ceil(duration);
    x = x + (relative ? this._x : 0);
    y = y + (relative ? this._y : 0);
    if (duration <= 0) {
      this.clearMovement();
      this._x = this._deltaX = x;
      this._y = this._deltaY = y;
    } else {
      this._deltaX = x - this._x;
      this._deltaY = y - this._y;
      this._startX = this._x;
      this._startY = this._y;
      this._moveDuration = duration;
      this._moveTotalDuration = duration;
      this._moveEaseType = easeType;
    }
  };
  Game_Picture.prototype.updateMovement = function () {
    this._moveDuration -= 1;
    var td = this._moveTotalDuration;
    var t = this._moveTotalDuration - this._moveDuration;
    var easeType = this._moveEaseType;
    this._x = TRP_CORE.easingValue(t, this._startX, this._deltaX, td, easeType);
    this._y = TRP_CORE.easingValue(t, this._startY, this._deltaY, td, easeType);
  };

  /* angle
	===================================*/
  Game_Picture.prototype.initAngleChange = function () {
    this.clearAngleChange();
  };
  Game_Picture.prototype.clearAngleChange = function () {
    this._angleDuration = 0;
    this._angleTotalDuration = 0;
  };
  Game_Picture.prototype.setAngle = function (angle, relative) {
    this.changeAngle(angle, 0, relative, TRP_CORE.NO_EASE);
  };
  Game_Picture.prototype.changeAngle = function (
    angle,
    duration,
    relative,
    easeType
  ) {
    if (this._angleDuration > 0) {
      this._angle = this._startAngle + this._deltaAngle;
    }

    duration = Math.ceil(duration);
    var targetAngle = angle + (relative ? this._angle : 0);
    if (duration <= 0) {
      this.clearAngleChange();
      this._angle = targetAngle;
      this._angleDuration = 0;
    } else {
      this._deltaAngle = targetAngle - this._angle;
      this._startAngle = this._angle;
      this._angleDuration = duration;
      this._angleTotalDuration = duration;
      this._angleEaseType = easeType;
    }
  };
  Game_Picture.prototype.updateAngleChange = function () {
    this._angleDuration -= 1;
    var t = this._angleTotalDuration - this._angleDuration;
    this._angle = TRP_CORE.easingValue(
      t,
      this._startAngle,
      this._deltaAngle,
      this._angleTotalDuration,
      this._angleEaseType
    );
  };

  /* yRotate
	===================================*/
  Game_Picture.prototype.initYAngleChange = function () {
    this._yAngle = 0;
    this.clearYAngleChange();
  };
  Game_Picture.prototype.clearYAngleChange = function () {
    this._yAngleDuration = 0;
    this._yAngleTotalDuration = 0;
  };
  Game_Picture.prototype.setYAngle = function (angle, relative) {
    this.changeYAngle(angle, 0, relative, TRP_CORE.NO_EASE);
  };
  Game_Picture.prototype.changeYAngle = function (
    angle,
    duration,
    relative,
    easeType
  ) {
    if (this._yAngleDuration > 0) {
      this._yAngle = this._startYAngle + this._deltaYAngle;
    }

    duration = Math.ceil(duration);
    var targetAngle = angle + (relative ? this._yAngle : 0);

    if (duration <= 0) {
      this.clearYAngleChange();
      this._yAngle = targetAngle;
      this._yAngleDuration = 0;
    } else {
      this._deltaYAngle = targetAngle - this._yAngle;
      this._startYAngle = this._yAngle;
      this._yAngleDuration = duration;
      this._yAngleTotalDuration = duration;
      this._yAngleEaseType = easeType;
    }
  };
  Game_Picture.prototype.updateYAngleChange = function () {
    this._yAngleDuration -= 1;
    var t = this._yAngleTotalDuration - this._yAngleDuration;
    this._yAngle = TRP_CORE.easingValue(
      t,
      this._startYAngle,
      this._deltaYAngle,
      this._yAngleTotalDuration,
      this._yAngleEaseType
    );
  };

  /* emphasisEffect
	===================================*/
  Game_Picture.prototype.emphasize = function (
    duration,
    scaleX,
    scaleY,
    num,
    interval,
    tone,
    easeType
  ) {
    this._emphasisEffect = {
      duration: duration,
      scaleX: scaleX,
      scaleY: scaleY,
      num: num,
      interval: interval,
      tone: tone,
      easeType: easeType,
    };
  };
  Game_Picture.prototype.emphasisEffect = function () {
    return this._emphasisEffect;
  };
  Game_Picture.prototype.clearEmphasisEffect = function () {
    this._emphasisEffect = null;
  };

  /* jump
	===================================*/
  Game_Picture.prototype.initJump = function () {
    this._jumpPeak = 0;
    this._jumpCount = 0;
    this._jumpDuration = 0;
    this._gravity = 1.2;
    this._jumpRotation = 0;

    this._jumpX = 0;
    this._jumpY = 0;
  };
  Game_Picture.prototype.jump = function (height, gravity, angle) {
    this._gravity = gravity || 1.2;
    this._jumpPeak = height;
    this._jumpRotation = (Math.PI / 180) * ((angle || 0) + 90);
    var g = this._gravity;
    var v0 = Math.sqrt(2 * height * g);
    this._jumpMaxDuration = (2 * v0) / g;
    this._jumpCount = 0;

    return this._jumpMaxDuration;
  };
  Game_Picture.prototype.resetJump = function () {
    this.initJump();
  };

  Game_Picture.prototype.updateJump = function () {
    this._jumpCount += 1;
    var g = this._gravity;
    var h = this._jumpPeak;
    var t = this._jumpCount;

    var jumpValue = Math.sqrt(2 * g * h) * t - (1 / 2) * g * Math.pow(t, 2);
    this._jumpY = -jumpValue * Math.sin(this._jumpRotation);
    this._jumpX = jumpValue * Math.cos(this._jumpRotation);

    if (this._jumpCount >= this._jumpMaxDuration) {
      this._jumpY = this._jumpX = 0;
      this._jumpCount = 0;
      this._jumpMaxDuration = 0;
    }
  };

  /* animation
	===================================*/
  Game_Picture.prototype.initAnimation = function () {
    this._animation = null;
    this._animationOffset = { x: 0, y: 0 };
  };
  Game_Picture.prototype.animation = function () {
    return this._animation;
  };
  Game_Picture.prototype.startAnimation = function () {
    this._animation = null;
  };
  Game_Picture.prototype.requestAnimation = function (animationId, mirror) {
    this._animation = {
      id: animationId,
      mirror: mirror,
    };
  };

  /* zOrder
	===================================*/
  Game_Picture.prototype.setBustPictureZ = function (z) {
    this._bustPictureZ = z;
  };

  Game_Picture.prototype.bustPictureZ = function () {
    return this._bustPictureZ;
  };

  /* animation offset
	===================================*/
  Game_Picture.prototype.setAnimationOffset = function (x, y) {
    this._animationOffset = { x: x, y: y };
  };
  Game_Picture.prototype.animationOffset = function () {
    return this._animationOffset || { x: 0, y: 0 };
  };

  /* helper
	===================================*/
  Game_Picture.prototype.skitActorName = function () {
    return this._skitActorName;
  };

  Game_Picture.prototype.x = function () {
    return this._x + this._jumpX;
  };

  Game_Picture.prototype.y = function () {
    return this._y + this._jumpY;
  };

  //=============================================================================
  // Sprite_Picture
  //=============================================================================
  var _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
  Sprite_Picture.prototype.initialize = function (pictureId) {
    this._skitActorName = null;

    var firstId = parameters.firstPictureId;
    var lastId = parameters.lastPictureId;
    if (pictureId >= firstId && pictureId <= lastId) {
      this.setupBustPicture();
    } else {
      this._isBustPicture = false;
    }

    this.initAnimation();

    _Sprite_Picture_initialize.call(this, pictureId);
  };

  //interface for Sprite_Animation target
  Sprite_Picture.prototype.show = function () {};

  Sprite_Picture.prototype.isBustPicture = function () {
    return this._isBustPicture;
  };

  Sprite_Picture.prototype.setupBustPicture = function () {
    this._isBustPicture = true;

    this._overlayName = null;
    this._skitActorName = null;
    this._overlays = [];
    this._emphasisSprites = [];
  };

  var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
  Sprite_Picture.prototype.loadBitmap = function () {
    if (this.isBustPicture()) {
      this._overlayName = null;
      this._needsRemoveOverlays = true;

      var bitmap = ImageManager.loadBust(
        this._skitActorName,
        this._pictureName
      );
      bitmap.addLoadListener(
        this.didLoadPoseImage.bind(this, this._pictureName)
      );
      if (!this.bitmap || bitmap.isReady()) {
        this.bitmap = bitmap;
      }

      this.picture().onChangeImage(this._pictureName);
    } else {
      _Sprite_Picture_loadBitmap.call(this);
    }
  };

  var _Sprite_Picture_updateOrigin = Sprite_Picture.prototype.updateOrigin;
  Sprite_Picture.prototype.updateOrigin = function () {
    if (this._isBustPicture) {
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
    } else {
      _Sprite_Picture_updateOrigin.call(this);
    }
  };

  /* update
	===================================*/
  var _Sprite_Picture_update = Sprite_Picture.prototype.update;
  Sprite_Picture.prototype.update = function () {
    _Sprite_Picture_update.call(this);

    if (this.visible) {
      this.updateAnimation();

      var picture = this.picture();

      //update yAngle
      if (picture._yAngle !== 0) {
        var theta = (picture._yAngle / 180) * Math.PI;
        this.scale.x *= Math.cos(theta);
      }

      if (this._isBustPicture) {
        this.updateBustPicture(picture);
      }
    }
  };

  var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
  Sprite_Picture.prototype.updateBitmap = function () {
    if (this.isBustPicture()) {
      var picture = this.picture();
      if (this._skitActorName || (picture && picture.skitActorName())) {
        if (picture) {
          var pictureName = picture.name();
          var skitActorName = picture._skitActorName;
          if (
            this._pictureName !== pictureName ||
            this._skitActorName !== skitActorName
          ) {
            this._skitActorName = skitActorName;
            this._pictureName = pictureName;
            this.loadBitmap();
          }
          this.visible = true;
        } else {
          this._pictureName = "";
          this._skitActorName = null;
          this.bitmap = null;
          this.visible = false;
        }
      } else {
        this.visible = false;
      }
    } else {
      _Sprite_Picture_updateBitmap.call(this);
    }
  };

  /* updateBustPicture
	===================================*/
  Sprite_Picture.prototype.updateBustPicture = function (picture) {
    picture = picture || this.picture();

    //update zorder
    this.z = picture.bustPictureZ();

    //update image
    var nextImageName = picture._nextImageName;
    //nextimage setup
    if (nextImageName && this._pictureName !== nextImageName) {
      this._pictureName = nextImageName;
      this.loadBitmap();
    }

    //update overlay
    this.updateOverlay();

    //update adjustPosition
    this.y -= (1 - this.anchor.y) * this.height * this.scale.y;

    //update emphasis
    if (this._emphasisEffect) {
      this.updateEmphasis(this._emphasisEffect);
    }
    var emphasis = picture.emphasisEffect();
    if (emphasis) {
      picture.clearEmphasisEffect();
      this.processEmphasisEffect(emphasis);
    }
    if (this._emphasisSprites.length) {
      this.updateEmphasisSprites();
    }
  };

  /* overlay
	===================================*/
  Sprite_Picture.DEFAULT_TONE = [0, 0, 0, 0];
  Sprite_Picture.prototype.updateOverlay = function () {
    //overlay
    var picture = this.picture();
    var overlays = this._overlays;

    var overlay;
    if (!picture) {
      this.removeAllOverlays();
    } else if (this._skitActorName) {
      if (picture._overlayName !== this._overlayName) {
        this._overlayName = picture._overlayName;
        var duration = picture._overlayDuration;
        if (this._overlayName) {
          var newOverlayBitmap = ImageManager.loadBust(
            this._skitActorName,
            this._overlayName
          );
          overlay = new Sprite(newOverlayBitmap);

          overlay.visible = false;
          overlay.anchor.x = 0.5;
          overlay.anchor.y = 0;
          overlay._overlayName = this._overlayName;
          this.addChild(overlay);
          overlays.push(overlay);

          newOverlayBitmap.addLoadListener(this.setOverlayPosition.bind(this));

          var oldOverlay = this._overlay;
          if (duration > 0) {
            overlay.opacity = 0;
            overlay._fadeSpeed = 255 / duration;
            overlay._fadeInDuration = duration;
            overlay._fadeOutDuration = 0;
            if (oldOverlay) {
              oldOverlay._fadeSpeed = -oldOverlay.opacity / duration;
              oldOverlay._fadeOutDuration = duration;
              oldOverlay._fadeInDuration = 0;
            }
          } else if (oldOverlay) {
            newOverlayBitmap.addLoadListener(
              this.removeOverlay.bind(this, oldOverlay)
            );
          }
          this._overlay = overlay;
        } else if (this._overlay) {
          if (duration > 0) {
            this._overlay._fadeSpeed = -this._overlay.opacity / duration;
            this._overlay._fadeOutDuration = duration;
            this._overlay._fadeInDuration = 0;
          } else {
            this.removeOverlay(this._overlay);
          }
        }
      }
    }

    var tone = picture.tone() || Sprite_Picture.DEFAULT_TONE;
    var length = overlays.length;
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      overlay = overlays[i];
      if (overlay._fadeOutDuration > 0) {
        overlay._fadeOutDuration -= 1;
        if (overlay._fadeOutDuration <= 0) {
          this.removeOverlay(overlay);
          continue;
        }
        overlay.opacity += overlay._fadeSpeed;
      } else if (overlay._fadeInDuration > 0) {
        overlay._fadeInDuration -= 1;
        overlay.opacity += overlay._fadeSpeed;
      }

      //color tone
      overlay.setColorTone(tone);
    }
  };

  Sprite_Picture.prototype.didLoadPoseImage = function (pictureName, bitmap) {
    if (this._pictureName !== pictureName) return;

    if (this._overlay && !this._overlay.bitmap.isReady()) {
      this._overlay.bitmap.addLoadListener(
        this.didLoadPoseImage.bind(this, pictureName, bitmap)
      );
      return;
    }

    if (this._needsRemoveOverlays) {
      this._needsRemoveOverlays = false;
      this.removeOverlaysWithoutCurrentPose();
    }

    this.bitmap = bitmap;
    this.setOverlayPosition();
  };

  Sprite_Picture.prototype.setOverlayPosition = function () {
    if (!this.bitmap || !this.bitmap.isReady()) {
      return;
    }
    var overlays = this._overlays;
    var length = overlays.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var overlay = overlays[i];
      if (overlay && overlay.bitmap.isReady()) {
        overlay.y = -this.bitmap.height * this.anchor.y;
        overlay.visible = true;
      }
    }
  };

  Sprite_Picture.prototype.removeAllOverlays = function () {
    var overlays = this._overlays;
    var length = overlays.length;
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      var overlay = overlays[i];
      this.removeOverlay(overlay);
    }
  };

  Sprite_Picture.prototype.removeOverlaysWithoutCurrentPose = function () {
    var pose = this._pictureName;

    var overlays = this._overlays;
    var length = overlays.length;
    var regex = new RegExp("^" + pose + "_");
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      var overlay = overlays[i];
      if (!overlay._overlayName || !overlay._overlayName.match(regex)) {
        this.removeOverlay(overlay);
      }
    }
  };

  Sprite_Picture.prototype.removeOverlay = function (overlay) {
    if (!overlay) {
      return;
    }

    TRP_CORE.removeArrayObject(this._overlays, overlay);
    this.removeChild(overlay);
    if (this._overlay === overlay) {
      this._overlay = null;
    }
  };

  /* animation
	===================================*/
  Sprite_Picture.prototype.initAnimation = function () {
    this._animationSprites = [];
    this._effectTarget = this;

    this._animationOffset = { x: 0, y: 0 };
  };

  Sprite_Picture.prototype.updateAnimation = function () {
    var picture = this.picture();
    var animation;
    if (picture) {
      this._animationOffset = picture.animationOffset();
      if ((animation = picture.animation())) {
        var data = $dataAnimations[animation.id];
        this.startAnimation(data, animation.mirror, 0);
        picture.startAnimation();
      }
    }
    this.updateAnimationSprites();
  };

  Sprite_Picture.prototype.updateAnimationSprites = function () {
    if (this._animationSprites.length > 0) {
      var sprites = this._animationSprites.clone();
      this._animationSprites = [];
      for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        if (sprite.isPlaying() && this.opacity) {
          this._animationSprites.push(sprite);
        } else {
          sprite.remove();
        }
      }
    }
  };

  Sprite_Picture.prototype.isAnimationPlaying = function () {
    return this._animationSprites.length > 0;
  };

  Sprite_Picture.prototype.startAnimation = function (
    animation,
    mirror,
    delay
  ) {
    var picture = this.picture();
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay);

    sprite.z = 101;
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
  };

  Sprite_Picture.prototype.adjustAnimationSprite = function (
    sprite,
    animation
  ) {
    if (animation.position !== 3) {
      sprite.y += this.height / 2;

      if (this._animationOffset) {
        if (this.scale.x < 0) {
          sprite.x -= this._animationOffset.x || 0;
        } else {
          sprite.x += this._animationOffset.x || 0;
        }
        sprite.y += this._animationOffset.y || 0;
      }
    }
  };

  /* emphasize
	===================================*/
  Sprite_Picture.prototype.updateEmphasis = function (emphasis) {
    emphasis.count -= 1;
    if (emphasis.count > 0) {
      return;
    }

    this.processEmphasisEffect(this._emphasisEffect);
  };

  Sprite_Picture.prototype.processEmphasisEffect = function (emphasis) {
    var duration = emphasis.duration || 20;
    var scaleX = emphasis.scaleX;
    var scaleY = emphasis.scaleY;
    var tone = emphasis.tone || [0, 0, 0, 0];
    var easeType = emphasis.easeType || 0;

    this.emphasize(duration, scaleX, scaleY, tone, easeType);

    emphasis.num -= 1;
    if (emphasis.num <= 0) {
      this._emphasisEffect = null;
    } else {
      this._emphasisEffect = emphasis;
      emphasis.count = emphasis.interval;
    }
  };

  Sprite_Picture.prototype.emphasize = function (
    duration,
    scaleX,
    scaleY,
    tone,
    easeType
  ) {
    var sprite = new Sprite(this.bitmap);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.y = -(this.anchor.y - 0.5) * this.height;
    sprite.opacity = (255 * 2) / 3;
    if (tone) {
      sprite.setColorTone(tone);
    }

    var overlay = this._overlay;
    if (overlay) {
      var addSprite = new Sprite(overlay.bitmap);
      addSprite.anchor.x = 0.5;
      addSprite.anchor.y = 0;
      addSprite.y = -sprite.height * sprite.anchor.y;
      if (tone) {
        addSprite.setColorTone(tone);
      }
      sprite.addChild(addSprite);
    }

    this.addChild(sprite);
    this._emphasisSprites.push(sprite);

    var startScale = 1;
    sprite._emphasisDuration = duration;
    sprite._emphasisTotalDuration = duration;
    sprite._deltaScaleX = TRP_CORE.supplementDefNum(1.2, scaleX) - startScale;
    sprite._deltaScaleY =
      TRP_CORE.supplementDefNum(sprite._deltaScaleY + startScale, scaleY) -
      startScale;
    sprite._startScaleX = startScale;
    sprite._startScaleY = startScale;

    sprite._deltaOpacity = 0 - sprite.opacity;
    sprite._startOpacity = sprite.opacity;

    sprite._easeType = easeType;
  };

  Sprite_Picture.prototype.updateEmphasisSprites = function () {
    var emphasisSprites = this._emphasisSprites;
    var length = emphasisSprites.length;
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      var emphasis = emphasisSprites[i];
      emphasis._emphasisDuration -= 1;
      var ed = emphasis._emphasisDuration;
      if (ed <= 0) {
        TRP_CORE.removeArrayObject(emphasisSprites, emphasis);
        this.removeChild(emphasis);
      } else {
        var easeType = emphasis._easeType;
        var td = emphasis._emphasisTotalDuration;
        var t = td - ed;

        emphasis.opacity = TRP_CORE.easingValue(
          t,
          emphasis._startOpacity,
          emphasis._deltaOpacity,
          td,
          easeType
        );
        emphasis.scale.x = TRP_CORE.easingValue(
          t,
          emphasis._startScaleX,
          emphasis._deltaScaleX,
          td,
          easeType
        );
        emphasis.scale.y = TRP_CORE.easingValue(
          t,
          emphasis._startScaleY,
          emphasis._deltaScaleY,
          td,
          easeType
        );
      }
    }
  };

  //=============================================================================
  // Sprite_Animation
  //=============================================================================
  var _Sprite_Animation_updatePosition =
    Sprite_Animation.prototype.updatePosition;
  Sprite_Animation.prototype.updatePosition = function () {
    _Sprite_Animation_updatePosition.call(this);

    if (this._target && this._target instanceof Sprite_Picture) {
      this._target.adjustAnimationSprite(this, this._animation);
    }
  };

  //=============================================================================
  // Spriteset_Base
  //=============================================================================
  var _Spriteset_Base_createPictures = Spriteset_Base.prototype.createPictures;
  Spriteset_Base.prototype.createPictures = function () {
    _Spriteset_Base_createPictures.call(this);

    var pictureSprites = this._pictureContainer.children;
    var length = pictureSprites.length;

    var bustPictureContainer = new Sprite();
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      var sprite = pictureSprites[i];
      var pictureId = sprite._pictureId;

      if (sprite.isBustPicture()) {
        TRP_CORE.removeArrayObject(pictureSprites, sprite);
        bustPictureContainer.addChildAt(sprite, 0);
      }
    }

    this._bustPictureContainer = bustPictureContainer;
    var zOrder = parameters.zOrder;
    this._bustPictureZOrder = zOrder;

    if (zOrder !== 0) {
      var index = this.children.indexOf(this._pictureContainer) || 0;
      if (zOrder === 1) {
        index = index + 1;
      } else {
        index = index;
      }
      this.addChildAt(bustPictureContainer, index);
    }
  };

  var _Spriteset_Base_update = Spriteset_Base.prototype.update;
  Spriteset_Base.prototype.update = function () {
    _Spriteset_Base_update.call(this);

    if (this._bustPictureContainer) {
      this.updateBustPictureOrders();
    }
  };

  Spriteset_Base.prototype.updateBustPictureOrders = function () {
    var sprites = this._bustPictureContainer.children;
    var i;

    var zCache = this._bustPictureSpritesZCache;
    var zChanged = !zCache || zCache.length !== sprites.length;

    var length = sprites.length;
    if (!zChanged) {
      for (i = 0; i < length; i = (i + 1) | 0) {
        if (sprites[i].z !== zCache[i]) {
          zChanged = true;
          break;
        }
      }
    }

    if (zChanged) {
      sprites = sprites.sort(this._compareChildOrder.bind(this));
      if (zCache) {
        zCache.length = 0;
      } else {
        zCache = [];
      }
      for (i = 0; i < length; i = (i + 1) | 0) {
        zCache[i] = sprites[i].z;
      }
      this._bustPictureSpritesZCache = zCache;
    }
  };

  Spriteset_Base.prototype.releaseBustPictureContainer = function () {
    var container = this._bustPictureContainer;
    if (container && container.parent) {
      container.parent.removeChild(container);
    }
    this._bustPictureContainer = null;
  };
  Spriteset_Base.prototype.bustPictureContainer = function () {
    return this._bustPictureContainer;
  };

  Spriteset_Base.prototype.needsBustPictureAddToScene = function () {
    return this._bustPictureZOrder === 0;
  };

  /* helper
	===================================*/
  Spriteset_Base.prototype._compareChildOrder = function (a, b) {
    if (a.z !== b.z) {
      return (a.z || 0) - (b.z || 0);
    } else if (a.y !== b.y) {
      return a.y - b.y;
    } else {
      return a.spriteId - b.spriteId;
    }
  };

  //=============================================================================
  // Scene_Base
  //=============================================================================
  var _Scene_Base_terminate = Scene_Base.prototype.terminate;
  Scene_Base.prototype.terminate = function () {
    if (this._spriteset) {
      this._spriteset.releaseBustPictureContainer();
    }
    _Scene_Base_terminate.call(this);
  };

  Scene_Base.prototype.addBustPictureContainerIfNeeded = function () {
    if (!this._spriteset) {
      return;
    }

    if (this._spriteset.needsBustPictureAddToScene()) {
      this.addChild(this._spriteset.bustPictureContainer());
    }
  };
  var _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.call(this);
    this.addBustPictureContainerIfNeeded();
  };
  var _Scene_Battle_createDisplayObjects =
    Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    _Scene_Battle_createDisplayObjects.call(this);
    this.addBustPictureContainerIfNeeded();
  };

  //=============================================================================
  // Game_Message => 自動フォーカス
  //=============================================================================
  // Show Text
  var _Game_Message_add_ = Game_Message.prototype.add;
  Game_Message.prototype.add = function (text) {
    //Skitのfocus処理
    if (!$gameMessage.isBusy() && $gameSkit.isSkitOn()) {
      var line = text.replace(/\s+/g, "");

      var list = parameters.nameToInputList;
      var actorNames = Object.keys(list);
      var length = actorNames.length;
      names = actorNames.concat($gameSkit.mobNames());

      length = names.length;
      for (var i = 0; i < length; i++) {
        var name = names[i];
        var regExp = new RegExp("^" + name);
        if (line.match(regExp)) {
          var target = list[name] || name;
          var actor = $gameSkit.actor(name);
          if (actor) {
            var displayName = actor.displayName();
            text = text.replace(regExp, displayName);
          }

          this._character = target;
          $gameSkit.onTalk(target);
          break;
        }
      }
    }

    _Game_Message_add_.call(this, text);
  };

  //=============================================================================
  // Window_Message
  //=============================================================================
  var _Window_Message_processEscapeCharacter_ =
    Window_Message.prototype.processEscapeCharacter;
  Window_Message.prototype.processEscapeCharacter = function (code, textState) {
    if (this.processEscapeCharacterForSkit(code, textState)) {
      return;
    }
    _Window_Message_processEscapeCharacter_.call(this, code, textState);
  };

  Window_Message.prototype.processEscapeCharacterForSkit = function (
    code,
    textState
  ) {
    var params, expression, command, args;

    var skitCodes = parameters.controlCharacters || {};
    if (code === (skitCodes.pose || "SP")) {
      params = this.obtainEscapeWords(textState).split(" ");
      var pose = params[0];
      expression = params[1];
      $gameSkit.processCommand([
        "pose",
        $gameMessage._character,
        "f",
        pose,
        expression,
      ]);
      return true;
    } else if (code === (skitCodes.expression || "SE")) {
      params = this.obtainEscapeWords(textState);
      expression = params;
      $gameSkit.processCommand([
        "expression",
        $gameMessage._character,
        "f",
        expression,
      ]);
      return true;
    } else if (code === (skitCodes.motion || "SM")) {
      command = this.obtainEscapeWords(textState);
      // var macro = parameters.macro[command];
      // if(macro){
      // 	command = macro[0];
      // 	args = macro.slice(3);
      // }else{
      // 	args = [];
      // }
      $gameSkit.processCommand(
        [command, $gameMessage._character, "f"].concat(args)
      );
      return true;
    } else if (code === (skitCodes.animation || "SA")) {
      command = "animation";
      var animeName = this.obtainEscapeWords(textState);
      $gameSkit.processCommand([
        command,
        $gameMessage._character,
        "f",
        animeName,
      ]);
      return true;
    }

    return false;
  };

  Window_Base.prototype.obtainEscapeWords = function (textState) {
    var regExp = /\[(.+?)\]/;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
      textState.index += arr[0].length;
      return arr[1];
    } else {
      return "";
    }
  };

  //=============================================================================
  // test用
  //=============================================================================
  Game_Interpreter.prototype.skitTest = function () {
    this.clear();

    var list = [];
    var pushCommand = function (list, command) {
      list.push({
        code: 356,
        indent: 0,
        parameters: [command],
      });
    };
    var pushText = function (list, texts) {
      list.push({
        code: 101,
        indent: 0,
        parameters: ["", 0, 0, 2],
      });
      var length = texts.length;
      for (var i = 0; i < length; i = (i + 1) | 0) {
        list.push({
          code: 401,
          indent: 0,
          parameters: [texts[i]],
        });
      }
    };

    //skit
    pushText(list, ["動作名とコマンド表示のあとに、動作を行います。"]);
    pushText(list, ["スキット開始", "「SKIT 開始」"]);
    pushCommand(list, "skit start");
    pushText(list, ["←フェードイン", "「SKIT フェードイン yuna t 左」"]);
    pushCommand(list, "skit fadeIn yuna t left");
    pushText(list, [
      "←スライドイン(登場位置がかぶるときはキャラを押し避ける)",
      "「SKIT スライドイン shizu t 左」",
    ]);
    pushCommand(list, "skit slidein shizu t left");
    pushText(list, ["反転→", "「SKIT 反転 yuna t 4」"]);
    pushCommand(list, "skit flip yuna t 4");
    pushText(list, ["ジャンプ→", "「SKIT ジャンプ yuna t」"]);
    pushCommand(list, "skit jump yuna t");

    pushText(list, [
      "←反転しつつ移動",
      "「SKIT 反転 shizu f 1」",
      "「SKIT 移動 shizu t 右」",
    ]);
    pushCommand(list, "skit move shizu f right");
    pushCommand(list, "skit flip shizu t");

    pushText(list, ["←ステップ", "「SKIT ステップ yuna t 中央」"]);
    pushCommand(list, "skit step yuna t center");
    pushText(list, ["←強調", "「SKIT 強調 yuna t」"]);
    pushCommand(list, "skit emphasize yuna t");
    pushText(list, ["←シェイク", "「SKIT シェイク yuna t」"]);
    pushCommand(list, "skit shake yuna t");
    pushText(list, ["アニメーション→", "「SKIT アニメーション shizu f 1」"]);
    pushCommand(list, "skit animation shizu f 1");
    pushText(list, ["回転→", "「SKIT 回転 shizu t 360」"]);
    pushCommand(list, "skit rotate shizu t 360");
    pushText(list, ["表情→", "「SKIT 表情 shizu t 2」"]);
    pushCommand(list, "skit expression shizu t 2");
    pushText(list, ["←ポーズ", "「SKIT ポーズ yuna t bend 3」"]);
    pushCommand(list, "skit pose yuna t bend 3");

    pushText(list, [
      "【ユナ】",
      "会話キャラの名前を検出して自動フォーカス",
      "（話していないキャラが縮小＆暗く)",
    ]);
    pushText(list, [
      "【ユナ】",
      "会話中の制御文字のテスト。\\!",
      "\\SE[5]\\\\SE[5]表情変更\\!",
      "\\SM[jump]\\\\SM[jump]ジャンプモーション",
    ]);
    pushText(list, [
      "【シズ】",
      "\\SP[depressed]\\\\SP[depressed]ポーズ変更\\!",
      "\\SA[1]\\\\SA[1]アニメーション\\!",
      "\\SM[pop]\\\\SM[pop]登録マクロ~ポップジャンプ",
    ]);
    pushText(list, [
      "以上、正しく表示されていれば、",
      "プラグインが動作する可能性が高いです。",
    ]);

    pushCommand(list, "skit end");

    //end
    list.push({
      code: 0,
      indent: 0,
      parameters: [],
    });

    this.setup(list, this._eventId);

    this._index = -1;
  };
})();
