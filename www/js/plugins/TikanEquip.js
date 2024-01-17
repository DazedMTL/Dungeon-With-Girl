//=============================================================================
// TikanEquip.js
//=============================================================================

/*:ja
 * @plugindesc ver1.01 一定の装備関係がある場合に装備ごとに効果発動。
 * @author まっつＵＰ
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * 武器・防具のノートタグ（メモの中に記入）
 *
 * xは一意の文字列
 * <Tikan:x>
 *
 * 例<Tikan:aab>
 * そのアクターの装備の中から同じ「組み合わせの属性」を
 * 持った装備を探し出すのに必要な設定です。
 *
 *
 * :の前のxは数値、yはID（数値）
 * <TikanApplyx:y>
 *
 * 例<TikanApply3:5>
 * 同じ「組み合わせの属性」を持った装備が3つ以上装備されている時
 * ノートタグのついている装備と同じ装備タイプのID5と装備した時と同様の効果を受けます。
 *
 *
 * なお、装備ごとに組み合わせを探しますが
 * 自身は当然同じ「組み合わせの属性」を持っているためカウントされます。
 *
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *
 * ver1.01 記述の整理
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 *
 */

//(function() {
//var parameters = PluginManager.parameters('TikanEquip');

var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
  _Game_Actor_initMembers.call(this);
  this._TEarray1 = [];
};

var _Game_Actor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function () {
  this._TEarray1 = [];
  var equips = this.equips();
  for (var i = 0; i < equips.length; i++) {
    var item = equips[i];
    var name = this.TEname(item);
    this.TEcount(item, name);
  }
  _Game_Actor_refresh.call(this);
};

Game_Actor.prototype.TEname = function (item) {
  if (!item) return false;
  return String(item.meta["Tikan"] || "");
};

Game_Actor.prototype.TEbaseitem = function (item, count) {
  var text = "TikanApply" + count;
  return Number(item.meta[text] || 0);
};

Game_Actor.prototype.TEcount = function (item, name) {
  if (!name) return;
  var equips = this.equips();
  var count = 0;
  for (var i = 0; i < equips.length; i++) {
    if (name === this.TEname(equips[i])) {
      count += 1;
      this.TEapply(item, count);
    }
  }
};

Game_Actor.prototype.TEapply = function (item, count) {
  var baseId = this.TEbaseitem(item, count);
  if (!baseId) return;
  if (DataManager.isWeapon(item)) {
    var baseitem = $dataWeapons[baseId];
  } else {
    var baseitem = $dataArmors[baseId];
  }
  this._TEarray1.push(baseitem);
};

var _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
Game_Actor.prototype.traitObjects = function () {
  var objects = _Game_Actor_traitObjects.call(this);
  var array = this._TEarray1;
  for (var i = 0; i < array.length; i++) {
    objects.push(array[i]);
  }
  return objects;
};

var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
Game_Actor.prototype.paramPlus = function (paramId) {
  var value = _Game_Actor_paramPlus.call(this, paramId);
  var array = this._TEarray1;
  for (var i = 0; i < array.length; i++) {
    value += array[i].params[paramId];
  }
  return value;
};

//})();
