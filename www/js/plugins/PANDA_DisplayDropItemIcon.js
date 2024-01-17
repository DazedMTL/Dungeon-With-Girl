//=============================================================================
// PANDA_DisplayDropItemIcon.js
//=============================================================================
// [Update History]
// 2020-09-06 Ver.1.0.0 First Release for MV/MZ.
// 2021-06-23 Ver.1.1.0 delete pluginName (for MZ 1.3.0).

/*:
 * @target MV MZ
 * @plugindesc display an item icon in obtain items message at the end of the battle.
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200906031415.html
 *
 * @help In obtain item message at the end of the battle,
 * you can display the item icon at the beginning of the item name.
 *
 * This plugin changes BattleManager.displayDropItems.
 *
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 *
 */

/*:ja
 * @target MV MZ
 * @plugindesc 戦闘終了時のアイテム獲得メッセージにアイコンを表示します。
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200906031415.html
 *
 * @help 戦闘終了時のアイテム獲得メッセージで、
 * アイテム名の頭にそのアイテムのアイコンを表示させることができます。
 *
 * BattleManager.displayDropItemsを書き換えています。
 *
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 *
 */

/*:ko
 * @target MV MZ
 * @plugindesc 전투 종료시의 아이템 획득 메세지에 아이콘을 표시합니다.
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200906031415.html
 *
 * @help 전투 종료시의 아이템 획득 메세지에서
 * 아이템명 앞에 그 아이템의 아이콘을 표시시킬 수 있습니다.
 *
 * BattleManager.displayDropItems를 새로 정의합니다.
 *
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 *
 */

(() => {
  "use strict";

  //--------------------------------------------------
  // BattleManager.displayDropItems
  //  [New Definition]
  //--------------------------------------------------
  BattleManager.displayDropItems = function () {
    const items = this._rewards.items;
    if (items.length > 0) {
      $gameMessage.newPage();
      for (const item of items) {
        let text = "\\I[" + item.iconIndex + "]" + item.name;
        $gameMessage.add(TextManager.obtainItem.format(text));
      }
    }
  };
})();
