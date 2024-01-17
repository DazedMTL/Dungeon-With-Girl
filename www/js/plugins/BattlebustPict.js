//=============================================================================
// BattlebustPict.js
//=============================================================================

/*:ja
 * @plugindesc ver1.02 バトル中のピクチャ表示
 * @author まっつＵＰ
 *
 * @param startId
 * @desc ピクチャの開始ID
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 * @param middying
 * @desc デフォルトとは別のピンチ基準。
 * デフォルトのピンチ基準も使うことに注意。
 * @type number
 * @min 1
 * @max 99
 * @default 50
 *
 * @param orizin
 * @desc ピクチャの原点
 * 0・・・左上 1・・・中央
 * @type number
 * @min 0
 * @max 1
 * @default 1
 *
 * @param pictX
 * @desc ピクチャのx座標
 * @type number
 * @min 1
 * @max 2000
 * @default 600
 *
 * @param pictY
 * @desc ピクチャのy座標
 * @type number
 * @min 1
 * @max 2000
 * @default 350
 *
 * @param scaleX
 * @desc ピクチャのx拡大率
 * @type number
 * @min -1000
 * @max 1000
 * @default 100
 *
 * @param scaleY
 * @desc ピクチャのy拡大率
 * @type number
 * @min -1000
 * @max 1000
 * @default 100
 *
 * @param equipX
 * @desc スロットごとのx座標
 * ヘルプ参照
 * @default 0 0 0 0 0 0
 *
 * @param equipY
 * @desc スロットごとのy座標
 * ヘルプ参照
 * @default 0 0 0 0 0 0
 *
 * @param indexaddX
 * @desc アクターのindex(先頭は0)に
 * この数をかけてx座標を算出します
 * @type number
 * @min 1
 * @max 1000
 * @default 150
 *
 * @param dyingtone
 * @desc 戦闘不能のアクターのピクチャを
 * 表示させるときの黒さの強さ(0だと無効です)
 * @type number
 * @min 0
 * @max 255
 * @default 64
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * アクター・武器・防具のノートタグ
 * <BPnormal:x>　通常時
 * <BPdying:x>　瀕死時
 * <BPmiddying:x>　パラメータ指定瀕死時
 * xはファイル名、(:とのスペースは無しでお願いします)
 *
 * 例<BPnormal:aaa>
 * 通常時aaa.pngのファイルをピクチャで表示します。
 *
 * アクターのノートタグ
 * <BPnoequip>
 * このアクターは装備による差分を表示しません。
 *
 * equipXはスロットのindexごとにx座標を指定します。
 * 数値と数値の間は半角スペースを一つだけあけてください。
 * 装備スロットの数だけ数値を増やしてください。
 * 0を指定したスロットindexではピクチャの取得・表示を行いません。
 *
 * 例：0 0 600 600 0
 * 装備できる装備品が5つでその順が「武器、盾、頭、体、飾」の場合
 * 頭、体のピクチャのx座標を600とします。
 *
 * equipYも設定方法は同様ですが
 * こちらは0を指定してもピクチャの取得・表示の分岐を行いません。
 *
 * indexaddXは
 * 実質バトルメンバー数が2以上の時に機能します。
 *
 * ピクチャのIDは
 * アクターの設定のピクチャ
 * startId + アクターのindex * 10
 *
 * アクターの装備のピクチャ
 * アクターの設定のピクチャ + 装備スロットindex + 1
 *
 * となります。
 *
 * ピクチャの原点は
 * イベントコマンド「ピクチャの表示」と同じ扱いです。
 *
 * 表示するピクチャの優先度は
 * dying > middying > normal
 * です。
 *
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *
 * ver1.01 装備差分対応、パラメータを増加。
 * ver1.02 戦闘不能時の処理追加
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 *
 */

(function () {
  var parameters = PluginManager.parameters("BattlebustPict");
  var BPstartId = Number(parameters["startId"] || 50);
  var BPmiddying = Number(parameters["middying"] || 50) / 100;
  var BPorizin = Number(parameters["orizin"] || 1);
  var BPpictX = Number(parameters["pictX"] || 600);
  var BPpictY = Number(parameters["pictY"] || 350);
  var BPscaleX = Number(parameters["scaleX"] || 100);
  var BPscaleY = Number(parameters["scaleY"] || 100);
  //ループ計算用変数の先定義
  var calconly = 0;
  var BPequipX = String(parameters["equipX"]);
  BPequipX = BPequipX.split(" ");
  for (var i = 0; i < BPequipX.length; ++i) {
    calconly = Number(BPequipX[i] || 0);
    BPequipX[i] = Math.abs(calconly);
  }

  var BPequipY = String(parameters["equipY"]);
  BPequipY = BPequipY.split(" ");
  for (var i = 0; i < BPequipY.length; ++i) {
    calconly = Number(BPequipY[i] || 0);
    BPequipY[i] = Math.abs(calconly);
  }

  var BPindexaddX = Number(parameters["indexaddX"] || 150);
  var BPdyingtone = Number(parameters["dyingtone"] || 64);

  var _BattleManager_refreshStatus = BattleManager.refreshStatus;
  BattleManager.refreshStatus = function () {
    _BattleManager_refreshStatus.call(this);
    $gameParty.TimingUpdateBP();
  };

  Game_Actor.prototype.showstandBP = function (id, name, x, y) {
    if (!name) return;
    $gameScreen.showPicture(
      id,
      name,
      BPorizin,
      x,
      y,
      BPscaleX,
      BPscaleY,
      255,
      0
    );
    if (this.isdyingtone()) {
      var color = -BPdyingtone;
      var tone = [color, color, color, 0];
      $gameScreen.tintPicture(id, tone, 0);
    }
  };

  Game_Actor.prototype.baseidBP = function () {
    return BPstartId + this.index() * 10;
  };

  Game_Actor.prototype.isBPDying = function () {
    return this.isAlive() && this._hp / this.mhp <= BPmiddying;
  };

  Game_Actor.prototype.isdyingtone = function () {
    return this.isDeathStateAffected() && BPdyingtone > 0;
  };

  Game_Actor.prototype.getnotetag = function () {
    var text = "BPnormal";
    if (this.isDying() || this.isDeathStateAffected()) {
      text = "BPdying";
    } else if (this.isBPDying()) {
      text = "BPmiddying";
    }
    return text;
  };

  Game_Actor.prototype.BPnotepict = function (data, text) {
    return data.meta[text];
  };

  Game_Actor.prototype.StandUpdateBP = function (text) {
    var id = this.baseidBP();
    var x = BPpictX + this.index() * BPindexaddX;
    var name = this.BPnotepict(this.actor(), text);
    this.showstandBP(id, name, x, BPpictY);
  };

  Game_Actor.prototype.EquipUpdateBP = function (text) {
    if (this.actor().note.match(/<BPnoequip>/i)) return;
    var id = this.baseidBP();
    var equip = this.equips();
    for (var i = 0; i < BPequipX.length; i++) {
      id++;
      if (BPequipX[i] <= 0 || !equip[i]) continue;
      var x = BPequipX[i] + this.index() * BPindexaddX;
      var y = BPequipY[i];
      var name = this.BPnotepict(equip[i], text);
      this.showstandBP(id, name, x, y);
    }
  };

  //オーバーライド（ここで初めてinBattleがtrueになる）
  var _Game_Unit_onBattleStart = Game_Unit.prototype.onBattleStart;
  Game_Party.prototype.onBattleStart = function () {
    _Game_Unit_onBattleStart.call(this);
    this.TimingUpdateBP();
  };

  Game_Party.prototype.TimingUpdateBP = function () {
    this.members().forEach(function (actor) {
      var text = actor.getnotetag();
      actor.StandUpdateBP(text);
      actor.EquipUpdateBP(text);
    });
  };
})();
