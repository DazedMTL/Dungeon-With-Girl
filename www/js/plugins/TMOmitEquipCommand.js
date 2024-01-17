//=============================================================================
// TMPlugin - 最強全脱ぎコマンド削除
// バージョン: 1.1.1
// 最終更新日: 2017/10/06
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 装備シーンからコマンドウィンドウを削除し、
 * スロットウィンドウに２行分のスペースを追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param useOptimize
 * @type boolean
 * @desc Shiftキーによる最強装備を利用する。
 * 初期値: ON ( false = OFF 無効 / true = ON 有効 )
 * @default true
 *
 * @param useClear
 * @type boolean
 * @desc Ctrl(Alt)キーによる全て外すを利用する。
 * 初期値: ON ( false = OFF 無効 / true = ON 有効 )
 * @default true
 *
 * @help
 * TMPlugin - 最強全脱ぎコマンド削除 ver1.1.1
 *
 * 使い方:
 *
 *   スロットウィンドウがアクティブな状態で Shift キーを押せば最強装備、
 *   Ctrl または Alt キーを押せば全て外すが実行されます。
 *
 *   Q または W キーによるアクター変更もスロットウィンドウが
 *   アクティブな状態で実行できます。
 *
 *   現在のバージョンではマウス、タッチ操作には対応していません。
 *
 *   プラグインコマンドはありません。
 *
 *   このプラグインは RPGツクールMV Version 1.5.1 で動作確認をしています。
 *
 *   このプラグインはMITライセンスのもとに配布しています、商用利用、
 *   改造、再配布など、自由にお使いいただけます。
 */

var Imported = Imported || {};
Imported.TMOmitEquipCommand = true;

(function () {
  var parameters = PluginManager.parameters("TMOmitEquipCommand");
  var useOptimize = JSON.parse(parameters["useOptimize"]);
  var useClear = JSON.parse(parameters["useClear"]);

  //-----------------------------------------------------------------------------
  // Scene_Equip
  //

  var _Scene_Equip_create = Scene_Equip.prototype.create;
  Scene_Equip.prototype.create = function () {
    _Scene_Equip_create.call(this);
    this._slotWindow.activate();
    this._slotWindow.select(0);
  };

  var _Scene_Equip_createCommandWindow =
    Scene_Equip.prototype.createCommandWindow;
  Scene_Equip.prototype.createCommandWindow = function () {
    _Scene_Equip_createCommandWindow.call(this);
    this._commandWindow.hide();
    this._commandWindow.deactivate();
  };

  Scene_Equip.prototype.createSlotWindow = function () {
    var wx = this._statusWindow.width;
    var wy = this._statusWindow.y;
    var ww = Graphics.boxWidth - this._statusWindow.width;
    var wh = this._statusWindow.height;
    this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
    this._slotWindow.setHandler("cancel", this.popScene.bind(this));
    this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._slotWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._slotWindow);
  };

  Scene_Equip.prototype.onActorChange = function () {
    this.refreshActor();
    this._slotWindow.activate();
  };

  Scene_Equip.prototype.commandOptimize = function () {
    SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._slotWindow.activate();
  };

  Scene_Equip.prototype.commandClear = function () {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._slotWindow.activate();
  };

  var _Scene_Equip_update = Scene_Equip.prototype.update;
  Scene_Equip.prototype.update = function () {
    _Scene_Equip_update.call(this);
    if (this._slotWindow.active) {
      if (Input.isTriggered("shift") && useOptimize) {
        this.commandOptimize();
      } else if (Input.isTriggered("control") && useClear) {
        this.commandClear();
      }
    }
  };
})();
