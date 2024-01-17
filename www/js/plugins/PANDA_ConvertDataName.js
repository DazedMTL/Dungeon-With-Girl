//=============================================================================
// PANDA_ConvertDataName.js
//=============================================================================
// [Update History]
// 2020-08-22 Ver.1.0.0 First Release for MV/MZ.
// 2020-09-06 Ver.1.0.1 Added the Korean Description.

/*:
 * @target MV MZ
 * @plugindesc show the name and icon of item, skill or enemy etc. in messages.
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200822124150.html
 *
 * @help [How to Use]
 * Replace the following escape characters with their names in messages.
 *  \class[n]  : Class name of ID = n
 *  \skill[n]  : Skill name of ID = n
 *  \item[n]   : Item name of ID = n
 *  \weapon[n] : Weapon name of ID = n
 *  \armor[n]  : Armor name of ID = n
 *  \enemy[n]  : Enemy name of ID = n
 *  \troop[n]  : Troop name of ID = n
 *  \state[n]  : State name of ID = n
 *
 * Such as \item[\V[1]], you can use a variable for n.
 * In this case, the name of the item ID 1 is displayed.
 *
 * Such as \*skill[n], you can display an icon for the skill by adding *.
 * item, weapon, armor, state as the same.
 * class, enemy, troop will not.
 *
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 *
 * [Reference]
 * ItemNameMsg.js by Sasuke KANNAZUKI
 */

/*:ja
 * @target MV MZ
 * @plugindesc 文章中にアイテムやスキル、敵キャラ等の名前やアイコンを表示します。
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200822124150.html
 *
 * @help ■ 使い方
 * 文章の表示や説明文等で、以下の制御文字をそれぞれの名前に置き換えます。
 *  \class[n]  : n番の職業名
 *  \skill[n]  : n番のスキル名
 *  \item[n]   : n番のアイテム名
 *  \weapon[n] : n番の武器名
 *  \armor[n]  : n番の防具名
 *  \enemy[n]  : n番の敵キャラ名
 *  \troop[n]  : n番の敵グループ名
 *  \state[n]  : n番のステート名
 *
 * \item[\V[1]] のように、nに変数を用いることも可能です。
 * この場合、1番の変数に格納されているID番号のアイテム名が表示されます。
 *
 * \*skill[n] のように*を付けると、そのスキルのアイコンを表示できます。
 * item、weapon、armor、state も同様です。
 * class、enemy、troop は、*を付けてもアイコンは表示されません。
 *
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 *
 * ■ 参考
 * ItemNameMsg.js by 神無月サスケ様
 */

/*:ko
 * @target MV MZ
 * @plugindesc 텍스트중에 아이템이나 스킬, 적 캐릭터등의 이름과 아이콘을 표시합니다.
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200822124150.html
 *
 * @help [사용법]
 * 텍스트 표시나 설명등에서 이하의 제어문자를 각자의 이름으로 치환합니다.
 *  \class[n]  : n번 직업명
 *  \skill[n]  : n번 스킬명
 *  \item[n]   : n번 아이템명
 *  \weapon[n] : n번 무기명
 *  \armor[n]  : n번 방어구명
 *  \enemy[n]  : n번 적 캐릭터명
 *  \troop[n]  : n번 적 군단명
 *  \state[n]  : n번 상태명
 *
 * \item[\V[1]] 과 같이 n에 변수를 이용할 수도 있습니다.
 * 이 경우, 1번 변수에 저장되어 있는 ID번호를 가진 아이템명이 표시됩니다.
 *
 * \*skill[n] 과 같이 *를 붙이면 그 스킬의 아이콘을 표시시킬 수 있습니다.
 * item, weapon, armor, state 도 같습니다.
 * class, enemy, troop 는 *를 붙여도 아이콘은 표시되지 않습니다.
 *
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 *
 * [참조]
 * ItemNameMsg.js by Sasuke KANNAZUKI 님
 */

(() => {
  "use strict";

  const _Window_Base_convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function (text) {
    // Original Processing
    text = _Window_Base_convertEscapeCharacters.call(this, text);

    // Convert Data Name and Icon
    text = text.replace(
      /\x1b(\*)?(class|skill|item|weapon|armor|enemy|troop|state)\[(\d+)\]/gi,
      function () {
        var text = "";
        var icon = arguments[1];
        var type = arguments[2].toLowerCase();
        var id = parseInt(arguments[3]);
        // get object
        var obj = null;
        if (id >= 1) {
          switch (type) {
            case "class":
              obj = $dataClasses[id];
              break;
            case "skill":
              obj = $dataSkills[id];
              break;
            case "item":
              obj = $dataItems[id];
              break;
            case "weapon":
              obj = $dataWeapons[id];
              break;
            case "armor":
              obj = $dataArmors[id];
              break;
            case "enemy":
              obj = $dataEnemies[id];
              break;
            case "troop":
              obj = $dataTroops[id];
              break;
            case "state":
              obj = $dataStates[id];
              break;
          }
        }
        if (obj) {
          // get object name
          text = obj.name;
          // get object icon
          if (icon === "*") {
            switch (type) {
              case "skill":
              case "item":
              case "weapon":
              case "armor":
              case "state":
                text = "\x1bI[" + obj.iconIndex + "]" + text;
            }
          }
        }
        return text;
      }.bind(this)
    );

    return text;
  };
})();
