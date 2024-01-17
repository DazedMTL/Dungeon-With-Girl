/*============================================================================
 Game_Interrupted .js
----------------------------------------------------------------------------
 (C)2019 kiki
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/7/14 初版
----------------------------------------------------------------------------
 [Blog]   : http://sctibacromn.hatenablog.com/
============================================================================*/
/*:
 * @plugindesc ゲームの中断
 * @author kiki
 *
 * @help ゲームを中断させ、セーブ＆ロードを防止する
 *
 * @param SwitchId
 * @desc セーブせずにロードした場合、オンにするスイッチID
 * @default 1
 *
 */

(function () {
  "use strict";
  function toNumber(str, def) {
    return isNaN(str) ? def : +(str || def);
  }
  const parameters = PluginManager.parameters("Game_Interrupted");
  const paramSwitchId = toNumber(parameters["SwitchId"], 1);

  const _Game_System_prototype_onBeforeSave =
    Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function () {
    _Game_System_prototype_onBeforeSave.call(this);
    //セーブ正常終了フラグ
    this._saveSuccess = true;
  };
  const _Scene_Load_prototype_onLoadSuccess =
    Scene_Load.prototype.onLoadSuccess;
  Scene_Load.prototype.onLoadSuccess = function () {
    _Scene_Load_prototype_onLoadSuccess.call(this);
    if (!$gameSystem._saveSuccess) {
      //不正ロードフラグオン
      $gameSwitches.setValue(paramSwitchId, true);
    } else {
      //セーブ正常終了フラグをオフにしてセーブする
      $gameSystem._saveSuccess = false;
      DataManager.saveGame(this.savefileId());
    }
  };
  //ウインドウ表示しない
  const _Scene_File_prototype_create = Scene_File.prototype.create;
  Scene_File.prototype.create = function () {
    _Scene_File_prototype_create.call(this);
    this._listWindow.visible = false;
    this._helpWindow.visible = false;
  };
  Scene_Save.prototype.onSaveSuccess = function () {
    SoundManager.playSave();
    StorageManager.cleanBackup(this.savefileId());
    //セーブしたらタイトルに戻る
    SceneManager.goto(Scene_Title);
  };
  //ファイルIDは固定
  Scene_File.prototype.savefileId = function () {
    return 1;
  };
  //すぐにセーブファイルOK実行
  Scene_Save.prototype.start = function () {
    Scene_File.prototype.start.call(this);
    this.onSavefileOk();
  };
  Scene_Load.prototype.start = function () {
    Scene_File.prototype.start.call(this);
    this.onSavefileOk();
  };
})();
