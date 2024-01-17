//=============================================================================
// BordSkin_edit.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 能力値にステートに設定した定数を加算します。
 * @author まっつＵＰ, merusaia(著作表示はまっつＵＰさん)
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * パラメータとプラグインコマンドともにありません。
 * 定数は基本能力値の倍率やバフの倍率によって変わることはありません。
 *
 * ステートのノートタグ
 *
 * <BSparamId:value>
 *
 * 例：atkを100上昇させる。
 * <BS2:100>
 *
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 *
 * ↑　ここまで。まっつＵＰさん
 * ↓　以下、merusaiaが追記
 *
 * まっつＵＰさんのプラグインをmerusaiaが改変しています。
 * ・Game_BattlerBase.prototype.param上書きを追加定義に変更
 * ・機能説明やデバッグ方法のコメント
 *
 * 【概要】
 * このプラグインは、攻撃力などのパラメータを「絶対値」で増減させるプラグインです。
 * ステートによる変化では１％～１０００％の倍率でしか変化をさせられませんが、
 * このプラグインをステートのメモ欄にかくことで、
 * 装備のように「攻撃力を＋１００するステート」などがつくれます。
 *
 * 【使い方】
 * メモ欄に、以下のようにタグを書いてください。（「//」以降はコメントです）
 *
 * 例０：　「最大ＨＰを+100する」ステートを作りたい場合
 * <BS0:100> // BordSkin_edit.jsがON時、最大ＨＰ(ID=0)を絶対値増減。最小値は1。
 *
 * 例１：　「最大ＭＰを-100する」ステートを作りたい場合
 * <BS1:-100> // BordSkin_edit.jsがON時、最大ＭＰ(ID=1)を絶対値増減。最小値は0。
 *
 * 例２：　「攻撃力を+100する」ステートを作りたい場合
 * <BS2:100> // BordSkin_edit.jsがON時、攻撃力(ID=2)を絶対値増減。最小値は1。
 *
 * 例３：　「防御力を-100する」ステートを作りたい場合
 * <BS3:-100> // BordSkin_edit.jsがON時、防御力(ID=3)を絶対値増減。最小値は1。
 *
 * 例４：　「魔法力を100する」ステートを作りたい場合
 * <BS4:100> // BordSkin_edit.jsがON時、魔法力(ID=4)を絶対値増減。最小値は1。
 *
 * 例５：　「魔法防御力を-100する」ステートを作りたい場合
 * <BS5:-100> // BordSkin_edit.jsがON時、魔法防御力(ID=5)を絶対値増減。最小値は1。
 *
 * 例６：　「敏捷性を100する」ステートを作りたい場合
 * <BS6:100> // BordSkin_edit.jsがON時、敏捷性(ID=6)を絶対値増減。最小値は1。
 *
 * 例７：　「運を+999する」ステートを作りたい場合
 * <BS7:999> // BordSkin_edit.jsがON時、運(ID=7)を絶対値増減。最小値は1。
 *
 *【ステート重ね掛けプラグインとの併用について】
 * 剣崎宗二さんが作成されたMultiStackState.jsプラグインと併用すると、
 * 同じステートの効果を指定した回数だけ重ね掛け可能なステートがつくれます。
 * つまり、一つのステートで「攻撃力+100を5回重ね掛けする」などという、ツクール１や２の頃にあった重ね掛けパワーアップスキルがつくれます。
 * 「剣崎宗二 ステートを重複可能に」でネット検索すると、出てきます。ぜひお試しください。
 */

(function () {
  //var parameters = PluginManager.parameters('BordSkin_edit');

  Game_BattlerBase.prototype.paramPlus2 = function (paramId) {
    //新規
    var str1 = "BS" + paramId;
    var amount = 0;
    this._states.forEach(function (stateId) {
      var val1 = Number($dataStates[stateId].meta[str1] || 0);
      if (val1) amount += val1;
    }, this);
    return amount;
  };

  var _Game_BattlerBase_param = Game_BattlerBase.prototype.param; // 追加定義に変更
  Game_BattlerBase.prototype.param = function (paramId) {
    var baseValue = _Game_BattlerBase_param.apply(this, arguments); // まず、元メソッドの内容を呼び出し、返り値にその内容を格納

    // 以下、追加定義部分
    // 次に、絶対値を足したものを計算して、それに置き換える
    var value = this.paramBase(paramId) + this.paramPlus(paramId);
    value += this.paramPlus2(paramId); // 絶対値増加。
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    var value_addedPlus2 = Math.round(value.clamp(minValue, maxValue));
    // デバッグ用。元メソッドの内容と、その値が違えば、念のため、警告を出しておく。
    //if(baseValue !== value_addedPlus2){
    //  console.log('メモ<BS【パラID番号】,'+Math.floor(this.paramPlus2(paramId))
    //  +'>により、能力に絶対値が足されました。: 加算前'+Math.floor(baseValue)+' → 加算後:'+Math.floor(value_addedPlus2));
    //}

    return value_addedPlus2;
  };
})();
