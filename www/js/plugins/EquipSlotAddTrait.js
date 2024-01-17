//
//  装備スロット追加特徴 ver1.02
//
// ------------------------------------------------------
// Copyright (c) 2016 Yana
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------
//
// author Yana
//

var Imported = Imported || {};
Imported["EquipSlotAddTrait"] = 1.02;
/*:
 * @plugindesc ver1.02/装備スロットを追加する特徴を設定できるようにします。
 * @author Yana
 *
 * @help ------------------------------------------------------
 * 使用方法
 * ------------------------------------------------------
 * 特徴を持ったオブジェクトのメモ欄に
 * <装備スロット:x+y>
 * または、
 * <AddEquipSlot:x+y>
 * と記述することで、xのスロットをy個増やします。
 * +を-にすることで減らすことも可能です。
 *
 * ※注意※
 * 初期装備に反映される形で、武器を減らさないでください。
 *
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.02:
 * 装備欄の数が変化したとき、エラーが出る可能性のあるバグを修正。
 * ver1.01:
 * 初期装備に反映される形で設定を行った場合、装備可能な初期装備まで消えることのあるバグを修正
 * ver1.00:
 * 公開
 */
(function () {
  ////////////////////////////////////////////////////////////////////////////////////

  "use strict";

  var parameters = PluginManager.parameters("EquipSlotAddTrait");

  ////////////////////////////////////////////////////////////////////////////////////

  DataManager.addEquipSlots = function (item) {
    if (!item) {
      return [];
    }
    if (item._addEquipSlots === undefined) {
      item._addEquipSlots = [];
      var texts = item.note.split("\n");
      for (var i = 0, max = texts.length; i < max; i++) {
        var text = texts[i];
        if (text.match(/<(?:装備スロット|AddEquipSlot):(\d+)([+-]\d+)>/)) {
          item._addEquipSlots.push([Number(RegExp.$1), Number(RegExp.$2)]);
        }
      }
    }
    return item._addEquipSlots;
  };

  var __DManager_loadGame = DataManager.loadGame;
  DataManager.loadGame = function (savefileId) {
    var result = __DManager_loadGame.call(this, savefileId);
    if (result) {
      $gameParty.allMembers().forEach(function (m) {
        m.refresh();
      });
    }
    return result;
  };

  ////////////////////////////////////////////////////////////////////////////////////

  var __GActor_equipSlots = Game_Actor.prototype.equipSlots;
  Game_Actor.prototype.equipSlots = function () {
    var slots = __GActor_equipSlots.call(this);
    var objects = this.traitObjects().clone();
    return objects.reduce(
      function (r, to) {
        var addSlots = DataManager.addEquipSlots(to);
        for (var i = 0, max = addSlots.length; i < max; i++) {
          var addSlot = addSlots[i];
          for (var j = 0; j < addSlot[1]; j++) {
            if (!this._equips[r.length]) {
              this._equips[r.length] = new Game_Item();
            }
            r = r.concat(addSlot[0]);
          }
          for (var j = 0; j < -addSlot[1]; j++) {
            var index = r.indexOf(addSlot[0]);
            if (index >= 0) {
              r.splice(index, 1);
            }
          }
        }
        return r;
      }.bind(this),
      slots
    );
  };

  var __GActor_initEquips = Game_Actor.prototype.initEquips;
  Game_Actor.prototype.initEquips = function (equips) {
    var slots = this.equipSlots();
    var ary = [];
    for (var i = 0, max = equips.length; i < max; i++) {
      if (equips[i] === 0 || i === 0 || (i === 1 && this.isDualWield())) {
        ary.push(equips[i]);
        continue;
      }
      var obj = $dataArmors[equips[i]];
      if (slots.contains(obj.etypeId)) ary.push(equips[i]);
    }
    __GActor_initEquips.call(this, ary);
  };

  var __GActor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function (classId, keepExp) {
    __GActor_changeClass.call(this, classId, keepExp);
    var es = this.equipSlots();
    for (var i = 0, max = es.length; i < max; i++) {
      if (!this._equips[es[i] - 1]) this._equips[es[i] - 1] = new Game_Item();
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////

  var __WESlot_refresh = Window_EquipSlot.prototype.refresh;
  Window_EquipSlot.prototype.refresh = function () {
    if (this._actor) {
      this._actor.refresh();
    }
    __WESlot_refresh.call(this);
  };
})();
