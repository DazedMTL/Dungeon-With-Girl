//===========================================================================
// MPI_AnimationOverPictures.js
//===========================================================================

/*:
 * @plugindesc アニメーションを、ピクチャより前に表示します。
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param 表示切替用スイッチ番号
 * @desc アニメーションをピクチャより前に表示するかどうかを切り替えるスイッチの番号を指定してください。
 * @default 0
 *
 * @help
 * [ 概要 ] ...
 *  表示切替用スイッチがONになっている間、アニメーションをピクチャより上に表示す
 *  るようになります。表示用スイッチ番号に0を指定した場合、常にピクチャより上に
 *  表示するようになります。
 *
 * [ プラグインコマンド ] ...
 *  プラグインコマンドはありません。
 *
 * [ 利用規約 ] ................................................................
 *  ・本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  ・商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  ・利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  ・プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  ・不具合対応以外のサポートやリクエストは、基本的に受け付けておりません。
 *  ・本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [ 改訂履歴 ] ................................................................
 *   Version 1.00  2016/10/25  First edition.
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2016 Nekoma Otobuki
 */

var Imported = Imported || {};
Imported.MPI_AnimationOverPictures = true;

var Makonet = Makonet || {};
Makonet.AOP = {};

(function () {
    'use strict';

    var AOP = Makonet.AOP;
    AOP.product = 'MPI_AnimationOverPictures';
    AOP.parameters = PluginManager.parameters(AOP.product);
    AOP.switchId = +AOP.parameters['表示切替用スイッチ番号'] || 0;

    function _(object) {
        return object[AOP.product] = object[AOP.product] || {}
    }

    //==============================================================================
    // Spriteset_Base
    //==============================================================================

    var _Spriteset_Base_createPictures = Spriteset_Base.prototype.createPictures;
    Spriteset_Base.prototype.createPictures = function () {
        _Spriteset_Base_createPictures.call(this);
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        _(this)._animationContainer = new Sprite();
        _(this)._animationContainer.setFrame(x, y, width, height);
        this.addChild(_(this)._animationContainer);
    };

    //==============================================================================
    // Sprite_Base
    //==============================================================================

    var _Sprite_Base_startAnimation = Sprite_Base.prototype.startAnimation;
    Sprite_Base.prototype.startAnimation = function (animation, mirror, delay) {
        _Sprite_Base_startAnimation.call(this, animation, mirror, delay);
        if (!AOP.switchId || $gameSwitches.value(AOP.switchId)) {
            var sprite = this._animationSprites[this._animationSprites.length - 1];
            _(sprite).orgParent = this.parent;
            this.parent.removeChild(sprite);
            _(SceneManager._scene._spriteset)._animationContainer.addChild(sprite);
        }
    };

    //==============================================================================
    // Sprite_Animation
    //==============================================================================

    var _Sprite_Animation_updatePosition = Sprite_Animation.prototype.updatePosition;
    Sprite_Animation.prototype.updatePosition = function () {
        _Sprite_Animation_updatePosition.call(this);
        if (this._animation.position !== 3) {
            var parent = this._target.parent;
            var grandparent = parent ? parent.parent : null;
            if (_(this).orgParent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
        }
    };
}());
