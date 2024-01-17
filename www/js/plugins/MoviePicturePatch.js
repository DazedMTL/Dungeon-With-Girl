/*:ja
 * @plugindesc MoviePicture.js 1.7.2 バグの応急処置
 * @author DarkPlasma
 * @license MIT
 *
 * @target MV
 * @help
 * ムービーピクチャのロードが完了したフレームと同一フレームでマップ遷移すると、
 * 状態の不整合が起こってエラー落ちする不具合への暫定対応プラグインです。
 *
 * MoviePicture.js よりも下に読み込んでください。
 */
(() => {
  "use strict";

  const _clearVideo = Sprite_Picture.prototype.clearVideo;
  Sprite_Picture.prototype.clearVideo = function () {
    _clearVideo.call(this);
    this._loadingState = null;
  };
})();
