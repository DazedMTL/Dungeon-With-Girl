//=============================================================================
// SkipPartyCommand.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2018 Tsumio
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.5 2018/07/25 0ターン目もステータスウィンドウをリフレッシュするよう修正。
// 1.0.4 2018/01/04 アクターコマンドに逃げるコマンドを追加。
// 1.0.3 2018/01/02 パーティー先頭に行動不能アクターが存在した場合の不具合を修正。
// 1.0.2 2017/08/16 さらに微調整。
// 1.0.1 2017/08/16 スキップの判定を微調整。
// 1.0.0 2017/08/16 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:
 * @plugindesc This plugin skip party command in battle.
 * @author Tsumio
 *
 * @param SwitchNumberForSkipping
 * @type switch
 * @desc If this switch is on, party command is skipped.
 * @default 1
 *
 * @param SwitchNumberForEscapeCommand
 * @type switch
 * @desc If this switch is on, show escape command to actor command window.
 * @default 2
 *
 * @help This plugin skip party command in battle.
 *
 * ----how to use----
 * You can use this plugin after setting SwitchNumberForSkipping and SwitchNumberForEscapeCommand parameters.
 *
 * ----plugin command----
 * There is no plugin command.
 *
 *
 * ----change log---
 * 1.0.5 2018/07/25 Fixed to refresh the status window also on turn 0.
 * 1.0.4 2018/01/04 Add escape command to acttor command window.
 * 1.0.3 2018/01/02 Fixed a bug when a inactivity actor is at the beginning of the party.
 * 1.0.2 2017/08/16 More Adjustment.
 * 1.0.1 2017/08/16 Adjustment of skip judgment.
 * 1.0.0 2017/08/16 Release
 *
 * ----remarks----
 * I shall not be responsible for any loss, damages and troubles from using this plugin.
 *
 * --Terms of Use--
 * This plugin is free for both commercial and non-commercial use.
 * You may edit the source code to suit your needs,
 * so long as you don't claim the source code belongs to you.
 *
 */
/*:ja
 * @plugindesc 戦闘時のパーティーコマンドをスキップします。
 * @author ツミオ
 *
 * @param スキップ用のスイッチ番号
 * @type switch
 * @desc このスイッチ番号がONのとき、パーティーコマンドはスキップされます。
 * @default 1
 *
 * @param 逃げるコマンド表示用のスイッチ番号
 * @type switch
 * @desc このスイッチ番号がONのとき、アクターコマンドに逃げるコマンドが追加されます。
 * @default 2
 *
 * @help 戦闘時のパーティーコマンドをスキップします。
 *
 *
 *
 * 【使用方法】
 * プラグインの導入後、スキップ用のスイッチ番号および逃げるコマンド表示用のスイッチ番号を設定することによって使用できます。
 *
 *
 * 【プラグインコマンド】
 * このプラグインにプラグインコマンドはありません。
 *
 * 【更新履歴】
 * 1.0.5 2018/07/25 0ターン目もステータスウィンドウをリフレッシュするよう修正。
 * 1.0.4 2018/01/04 アクターコマンドに逃げるコマンドを追加。
 * 1.0.3 2018/01/02 パーティー先頭に行動不能アクターが存在した場合の不具合を修正。
 * 1.0.2 2017/08/16 さらに微調整。
 * 1.0.1 2017/08/16 スキップの判定を微調整。
 * 1.0.0 2017/08/16 公開。
 *
 * 【備考】
 * 当プラグインを利用したことによるいかなる損害に対しても、制作者は一切の責任を負わないこととします。
 *
 * 【利用規約】
 * ソースコードの著作権者が自分であると主張しない限り、
 * 作者に無断で改変、再配布が可能です。
 * 利用形態（商用、18禁利用等）についても制限はありません。
 * 自由に使用してください。
 *
 */

(function () {
  "use strict";
  var pluginName = "SkipPartyCommand";

  ////=============================================================================
  //// NTMO
  ////  Declare NTMO namespace.
  ////=============================================================================
  var NTMO = NTMO || {};
  NTMO.SPC = function () {};

  ////=============================================================================
  //// Local function
  ////  These functions checks & formats pluguin's command parameters.
  ////  I borrowed these functions from Triacontane.Thanks!
  ////=============================================================================
  var getParamString = function (paramNames) {
    if (!Array.isArray(paramNames)) paramNames = [paramNames];
    for (var i = 0; i < paramNames.length; i++) {
      var name = PluginManager.parameters(pluginName)[paramNames[i]];
      if (name) return name;
    }
    return "";
  };

  var getParamNumber = function (paramNames, min, max) {
    var value = getParamString(paramNames);
    if (arguments.length < 2) min = -Infinity;
    if (arguments.length < 3) max = Infinity;
    return (parseInt(value) || 0).clamp(min, max);
  };

  //This function is not written by Triacontane.Tsumio wrote this function !
  var getParamDouble = function (paramNames, min, max) {
    var value = getParamString(paramNames);
    if (arguments.length < 2) min = -Infinity;
    if (arguments.length < 3) max = Infinity;
    return Number(value);
  };

  //This function is not written by Triacontane.Tsumio wrote this function !
  var convertParam = function (param) {
    if (param !== undefined) {
      try {
        return JSON.parse(param);
      } catch (e) {
        console.group();
        console.error(
          "%cParameter is invalid ! You should check the following parameter !",
          "background-color: #5174FF"
        );
        console.error("Parameter:" + eval(param));
        console.error("Error message :" + e);
        console.groupEnd();
      }
    }
  };

  ////=============================================================================
  //// Get and set pluguin parameters.
  ////=============================================================================
  var param = {};
  param.switchNum_skipping = getParamNumber([
    "SwitchNumberForSkipping",
    "スキップ用のスイッチ番号",
  ]);
  param.switchNum_escapeCommand = getParamNumber([
    "SwitchNumberForEscapeCommand",
    "逃げるコマンド表示用のスイッチ番号",
  ]);

  ////==============================
  //// Convert parameters.
  ////==============================

  //There is none.

  //////=============================================================================
  ///// Scene_Battle
  /////  Add skipping system to battle scene.
  ////   Override some methods for skipping always.
  /////=============================================================================

  const _Scene_Battle_changeInputWindow =
    Scene_Battle.prototype.changeInputWindow;
  Scene_Battle.prototype.changeInputWindow = function () {
    if (this.skipPartyCommand_SPC()) {
      //If return true, it means be skipped.
      return;
    }

    _Scene_Battle_changeInputWindow.call(this);
  };

  //This is additional method.
  Scene_Battle.prototype.skipPartyCommand_SPC = function () {
    if (this.canSkipPartyCommand_SPC()) {
      BattleManager.selectNextCommand(); //Instead of commandFight().
      this.refreshStatus();
      this.startActorCommandSelection();
      return true; //Be skipped.
    }
    return false;
  };

  //This is additional method.
  Scene_Battle.prototype.isSkippableSwitchOn_SPC = function () {
    return $gameSwitches.value(param.switchNum_skipping);
  };

  //This is additional method.
  Scene_Battle.prototype.canSkipPartyCommand_SPC = function () {
    return (
      this.isSkippableSwitchOn_SPC() &&
      BattleManager.isInputting() &&
      !BattleManager.actor()
    );
  };

  const _Scene_Battle_createActorCommandWindow =
    Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function () {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler(
      "escape",
      this.commandEscape.bind(this)
    );
  };

  //////=============================================================================
  ///// Window_ActorCommand
  /////  Add escapeCommand.
  /////=============================================================================
  const _Window_ActorCommand_changeInputWindow =
    Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function () {
    _Window_ActorCommand_changeInputWindow.call(this);
    if (this._actor) {
      this.addEscapeCommand();
    }
  };

  Window_ActorCommand.prototype.addEscapeCommand = function () {
    if (this.isEscapeCommandSwitchOn_SPC()) {
      this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }
  };

  Window_ActorCommand.prototype.isEscapeCommandSwitchOn_SPC = function () {
    return $gameSwitches.value(param.switchNum_escapeCommand);
  };
})();
