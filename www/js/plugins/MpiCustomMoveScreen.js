//==============================================================================
// MpiCustomMoveScreen.js
//==============================================================================

/*:
 * @plugindesc スクリプトによる画面の移動を実行します。
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param Unaffected Picture
 * @type number[]
 * @default
 * @desc 画面の移動の影響を受けないピクチャの番号を指定してください。
 *
 * @help
 * [概要]
 *  1フレームごとにスクリプトで算出された値を画面のX座標とY座標に加算します。
 *
 * [使い方]
 *  プラグインコマンド'SetCmsFormulaX'、'SetCmsFomulaY'、'AddCmsFormulaX'、
 *  'AddCmsFormulaY'にて画面のX座標、Y座標に加算する値を算出するためのスクリプト
 *  を設定します。
 *
 *  ※プラグインコマンドの引数には変数を指定することができます。
 *    [例] SetCmsFormulaX Math.sin(\v[10])
 *    上記例の場合、\v[10]の部分は変数＃0010の値に置き換えられます。
 *
 * [プラグインパラメータ]
 *  Unaffected Picture
 *   画面の移動の影響を受けないピクチャの番号を指定します。通常は画面の移動に伴
 *   いピクチャも移動しますが、ここで指定したピクチャは画面が移動しても常に同じ
 *   場所に表示されます。
 *
 * [プラグインコマンド]
 *  SetCmsFormulaX <スクリプト>
 *  SetCmsFormulaY <スクリプト>
 *  AddCmsFormulaX <スクリプト>
 *  AddCmsFormulaY <スクリプト>
 *   <スクリプト> 画面の座標に加算する値を算出するスクリプト
 *
 *   画面の座標に加算する値を算出するスクリプトを設定します。設定されたスクリプ
 *   トにて1フレームごとに値を算出し、画面の座標に加算します。当プラグインコマン
 *   ドで設定するスクリプト用の特別な制御文字として \f が使用できます。
 *   \f は「現在のフレームカウント」に置き換えられます。
 * 　（※現在のフレームカウント＝ゲーム開始からのフレーム数（1秒＝60フレーム））
 *
 *   'Set'から始まるプラグインコマンドは、それまでに設定したスクリプトをクリアし
 *   て新しくスクリプトを設定します。
 *   'Add'から始まるプラグインコマンドは、それまでに設定したスクリプトに別のスク
 *   リプとを追加します。設定された複数のスクリプトは、それぞれの計算結果を合計
 *   して画面の座標に加算されます。
 *
 *   [例] SetCmsFormulaX Math.sin(Math.PI / 180 * (360 / 60) * \f) * 10
 *
 *    画面を横方向にゆらゆら揺らす（正弦波：振幅10px、周期60フレーム）
 *
 *   [例] SetCmsFormulaY Math.sin(Math.PI / 180 * (360 / 20) * \f) * 5
 *
 *    画面を縦方向にゆらゆら揺らす（正弦波：振幅5px、周期20フレーム）
 * ........
 *  ClearCmsFormulaX
 *  ClearCmsFormulaY
 *
 *   設定したスクリプトを消去します。
 *
 * [利用規約] ..................................................................
 *  - 本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  - 商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  - 利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  - プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  - 本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [改訂履歴] ..................................................................
 *   Version 1.01  2019/12/03  Unaffected Pictureにピクチャが指定されていないと
 *                             プラグインが機能しない問題を修正
 *   Version 1.00  2019/10/18  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2016-2019 Nekoma Otobuki
 */

var Imported = Imported || {};
var Makonet = Makonet || {};

(function () {
  "use strict";

  const plugin_name = "MpiCustomMoveScreen";

  Imported[plugin_name] = true;
  Makonet[plugin_name] = {};

  let _plugin = Makonet[plugin_name];
  let _parameters = PluginManager.parameters(plugin_name);

  _plugin.unaffected_picture = (
    eval(_parameters["Unaffected Picture"]) || []
  ).map((v) => Number(v));

  //==============================================================================
  // Private Methods
  //==============================================================================

  function convertVariables(text) {
    if (typeof text !== "string") return text;
    let pattern = "\\\\v\\[(\\d+)\\]";
    while (text.match(RegExp(pattern, "i"))) {
      text = text.replace(RegExp(pattern, "gi"), function () {
        return $gameVariables.value(+arguments[1]);
      });
    }
    return text;
  }

  //==============================================================================
  // Game_Interpreter
  //==============================================================================
  {
    let __pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
      __pluginCommand.apply(this, arguments);
      switch (command.toLowerCase()) {
        case "setcmsformulax":
          $gameScreen._cms_formula_x = [args.join(" ").trim()];
          break;
        case "setcmsformulay":
          $gameScreen._cms_formula_y = [args.join(" ").trim()];
          break;
        case "addcmsformulax":
          $gameScreen._cms_formula_x.push(args.join(" ").trim());
          break;
        case "addcmsformulay":
          $gameScreen._cms_formula_y.push(args.join(" ").trim());
          break;
        case "clearcmsformulax":
          delete $gameScreen._cms_formula_x;
          break;
        case "clearcmsformulay":
          delete $gameScreen._cms_formula_y;
          break;
      }
    };
  }

  //==============================================================================
  // Game_Screen
  //==============================================================================
  {
    let __update = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function () {
      this._custom_move_x = 0;
      this._custom_move_y = 0;
      if ($gameScreen._cms_formula_x) {
        $gameScreen._cms_formula_x.forEach((formula) => {
          formula = convertVariables(formula);
          formula = formula.replace(/\\f/gi, Graphics.frameCount);
          this._custom_move_x += Math.round(eval(formula));
        });
      }
      if ($gameScreen._cms_formula_y) {
        $gameScreen._cms_formula_y.forEach((formula) => {
          formula = convertVariables(formula);
          formula = formula.replace(/\\f/gi, Graphics.frameCount);
          this._custom_move_y += Math.round(eval(formula));
        });
      }
      __update.apply(this, arguments);
    };
  }

  //==============================================================================
  // Game_Picture
  //==============================================================================
  {
    let __x = Game_Picture.prototype.x;
    Game_Picture.prototype.x = function () {
      if (!this.hasOwnProperty("_cms_unaffected")) {
        this._cms_unaffected = _plugin.unaffected_picture.includes(
          $gameScreen._pictures.indexOf(this) - $gameScreen.realPictureId(0)
        );
      }
      return (
        __x.apply(this, arguments) -
        (this._cms_unaffected ? $gameScreen._custom_move_x : 0)
      );
    };

    let __y = Game_Picture.prototype.y;
    Game_Picture.prototype.y = function () {
      if (!this.hasOwnProperty("_cms_unaffected")) {
        this._cms_unaffected = _plugin.unaffected_picture.includes(
          $gameScreen._pictures.indexOf(this) - $gameScreen.realPictureId(0)
        );
      }
      return (
        __y.apply(this, arguments) -
        (this._cms_unaffected ? $gameScreen._custom_move_y : 0)
      );
    };
  }

  //==============================================================================
  // Spriteset_Base
  //==============================================================================
  {
    let __updatePosition = Spriteset_Base.prototype.updatePosition;
    Spriteset_Base.prototype.updatePosition = function () {
      __updatePosition.apply(this, arguments);
      this.x += $gameScreen._custom_move_x;
      this.y += $gameScreen._custom_move_y;
    };
  }
})();
