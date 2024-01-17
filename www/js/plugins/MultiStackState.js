//=============================================================================
// MultiStackState.js
//=============================================================================

/*:en
 * @plugindesc Implementing Multi-stackable States
 * @author Souji Kenzaki
 *
 *
 *
 * @help
 * This is a plugin for implementing States which can be stacked multiple times.
 * in the memo section of state, write in format of <maxstack: [number of maximum stack of this state]>
 * such as <maxstack:2>. In this case, that state can be stacked 2 times max instead of 1.
 */

/*:ja
 * @plugindesc ステート重複可能数拡張
 * @author 剣崎宗二
 *
 *
 * @help
 * タグのついたステートを、重複可能にするプラグインです。
 * ステートのメモに<maxstack:2> (数字は最大重複数）を入れると、その数までステートを重複して付与できるようになります。
 * 尚、可能な限り競合に対して防御策は施しましたが、ステート付与、除去系のプラグインとは依然相性が悪い事が予想されますので、
 * 使用時は十分にご注意ください。
 */

(function () {
  Game_BattlerBase.prototype.countState = function (stateId) {
    var stateCount = 0;
    this._states.forEach(function (item) {
      if (item == stateId) {
        stateCount++;
      }
    });
    return stateCount;
  };

  var kz_Game_Battler_prototype_addState = Game_Battler.prototype.addState;
  Game_Battler.prototype.addState = function (stateId) {
    var preCount = this.countState(stateId);
    kz_Game_Battler_prototype_addState.call(this, stateId);
    if ($dataStates[stateId]) {
      var maxStack = $dataStates[stateId].meta.maxstack || 1;
      var postCount = this.countState(stateId);
      if (
        this.isStateAddable(stateId) &&
        preCount == postCount &&
        postCount < maxStack
      ) {
        this.addNewState(stateId);
      }
    }
  };

  var kz_Game_Battler_prototype_removeState =
    Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function (stateId) {
    while (this.countState(stateId) > 0) {
      var lastCount = this.countState(stateId);
      kz_Game_Battler_prototype_removeState.call(this, stateId);

      //For certain plugins which creates non-removable state
      if (lastCount == this.countState(stateId)) {
        break;
      }
    }
  };

  var kzk_Game_BattlerBase_prototype_updateStateTurns =
    Game_BattlerBase.prototype.updateStateTurns;
  Game_BattlerBase.prototype.updateStateTurns = function () {
    var stateOriginal = this._states;
    this._states = stateOriginal.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    kzk_Game_BattlerBase_prototype_updateStateTurns.call(this);
    this._states = stateOriginal;
    console.log(this._stateTurns);
  };
})();
