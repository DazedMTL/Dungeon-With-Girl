//=============================================================================
// HighSpeedBossCollapseEffect.js
//
//=============================================================================
// Copyright (c) 2018-2019 uta_asakayu
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
/*:
 * @plugindesc ボスの消滅エフェクトを高速化します
 * @author uta_asakayu
 * @help
 * ボスの消滅エフェクトを高速化します
 * 
 * 再配布以外はご自由にお使いください
 * 
 * ver 1.00 :リリース。単純に2倍速にしてみる
 * 
*/



(function () {

  const _Sprite_Enemy_updateBossCollapse = Sprite_Enemy.prototype.updateBossCollapse
  Sprite_Enemy.prototype.updateBossCollapse = function () {
    this._effectDuration -= this._effectDuration > 1 ? 1 : 0
    _Sprite_Enemy_updateBossCollapse.call(this)
  };

})();