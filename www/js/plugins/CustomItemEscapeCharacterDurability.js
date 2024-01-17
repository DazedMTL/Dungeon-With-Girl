//=============================================================================
// CustomItemEscapeCharacterDurability.js
// This plugin alterd ItemNameEscape.js by Moooty.
//=============================================================================
//=============================================================================
// Original Plugin(ItemNameEscape.js) is :
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2015/12/24 マップデータが歯抜けになっている場合に発生するエラーを対応
// 1.0.0 2015/12/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Add escape character for YEP_X_ItemDurability.js
 * @author Moooty
 *
 * @help
 * Add escape character for YEP_YEP_X_ItemDurability.js with ItemNameEscape.js
 *
 * required : YEP_X_ItemDurability.js, ItemNameEscape.js
 *
 * escape codes :
 * \D  equipment durability
 * \MD equipment max durability
 *
 */

/*:ja
 * @plugindesc 項目名の制御文字適用プラグインに耐久度の制御文字を追加
 * @author むーてぃ
 *
 * @param removeString
 * @desc メッセージウィンドウの時に取り除く文字
 * @type string
 * @default \D
 *
 * @help
 * 項目名の制御文字適用プラグイン(ItemNameEscape.js)を使って
 * YEP_X_ItemDurability.js用の制御文字を追加します。
 *
 * YEP_X_ItemDurabilityとItemNameEscape.jsのあとにプラグインを読みこんでください。
 *
 * \D  装備の耐久度
 * \MD 装備の最大耐久度
 *
 */

(function () {
  "use strict";
  const UNBREAKABLE = -1;

  // 耐久度回復アイテムを使った時に耐久度を更新する
  // Window_ItemList(rpg_windows.js)をオーバーライド
  var _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
  Window_ItemList.prototype.makeItemList = function () {
    _Window_ItemList_makeItemList.call(this);
    DataManager.updateDurability();
  };

  // メニューシーンを開いた時に耐久度を更新する
  // Scene_Menu(rpg_scenes.js)をオーバーライド
  var _Scene_Menu_initialize = Scene_Menu.prototype.initialize;
  Scene_Menu.prototype.initialize = function () {
    _Scene_Menu_initialize.call(this);
    DataManager.updateDurability();
  };

  // 戦闘中に装備変更をしたい場合の更新処理(ChangeEquipBattle.jsと併用)
  // ChangeEquipBattle.jsのcommandEquipにthis._eStatusWindow.refresh();を追加して使用
  // BattleManager(rpg_managers.js)をオーバーライド
  var _BattleManager_updateTurnEnd = BattleManager.updateTurnEnd;
  BattleManager.updateTurnEnd = function () {
    _BattleManager_updateTurnEnd.call(this);
    DataManager.updateDurability();
  };

  // 装備の耐久度を更新する
  DataManager.updateDurability = function () {
    if ($gameParty) {
      // 装備中の装備
      for (var i = 0; i < $gameParty.members().length; i++) {
        var actor = $gameParty.members()[i];
        for (var ii = 0; ii < actor.equips().length; ii++) {
          var item = actor.equips()[ii];
          this.setDurability(item);
        }
      }

      //控えの装備も更新
      for (var wi = 0; wi < $gameParty.weapons().length; wi++) {
        DataManager.setDurability($gameParty.weapons()[wi]);
      }

      for (var ai = 0; ai < $gameParty.armors().length; ai++) {
        DataManager.setDurability($gameParty.armors()[ai]);
      }
    }
  };

  // 耐久度の変換処理を呼び出し
  DataManager.setDurability = function (data) {
    if (data != null) {
      if (hasDurability(data)) {
        if (data.preName != null) {
          data.name = convertDurabilityEscapeCharacters(data.preName, data);
        }

        if (data.preDescription != null) {
          data.description = convertDurabilityEscapeCharacters(
            data.preDescription,
            data
          );
        }
      }
    }
  };

  function hasDurability(item) {
    return item.hasOwnProperty("durability") ? true : false;
  }

  // 耐久度用の制御文字を変換
  function convertDurabilityEscapeCharacters(text, item) {
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");

    var durability = "-";
    var maxDurability = "-";
    if (item.durability !== UNBREAKABLE) {
      durability = item.durability;
      maxDurability = item.durMax;
    }

    text = text.replace(/\x1bD/gi, durability);
    text = text.replace(/\x1bMD/gi, maxDurability);

    return text;
  }

  var _Window_Base_convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function (text) {
    var result = _Window_Base_convertEscapeCharacters.apply(this, arguments);
    result = trimDurabilityStrings(result);

    return result;
  };

  // メッセージの表示の時にアイテム名の耐久度を取りのぞく
  function trimDurabilityStrings(str) {
    const PLUGIN_NAME = "CustomItemEscapeCharacterDurability";
    var parameters = PluginManager.parameters(PLUGIN_NAME);
    var removeString = parameters["removeString"];
    removeString = removeString.replace(/\\/g, "\x1b");
    removeString = removeString.replace(/\x1b\x1b/g, "\\");

    removeString = removeString.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    var regExp = new RegExp(removeString);

    return str.replace(regExp, "");
  }
})();
