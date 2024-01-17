//
//  条件付き追加効果 ver1.04
//
// author yana
//

var Imported = Imported || {};
Imported["ConditionallyAddEffect"] = 1.04;

/*:
 * @plugindesc ver1.04/条件を満たすと発動する追加効果を設定できるようになります。
 * @author Yana
 *
 * @param Display Add Effect Text
 * @desc 追加効果が発動した時のメッセージ。_nameが発動元スキル名に、
 * _mes1,_mes2が追加効果のメッセージ1、2行目に置き換わります。
 * @default _userの_nameの追加効果が発動した！
 *
 * @help プラグインコマンドはありません。
 *
 * ※YEP_BattleEngineCoreよりも下に配置してください。
 *
 * スキルやアイテムのメモ欄に
 *
 * <追加効果:I○,×%>
 * 発動条件
 * </追加効果>
 * または、
 * <追加効果:S○,×%>
 * 発動条件
 * </追加効果>
 * と記述してください。
 *
 * I○の場合は○番のアイテム、S○の場合は○番のスキルが条件を満たした時、×%の確率で追加効果として発動します。
 *
 * 発動条件の詳細はConditionallyCoreのヘルプを参照してください。
 * 発動時の表示メッセージはnullにすることで表示を無効化することができます。
 * 発動時のメッセージは_userを発動者の名前に変換します。
 *
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.04:
 * 内部処理を大幅に変更。
 * 複数の追加効果を設定しても正常に動くように修正。
 * ver1.03:
 * YEP_BattleEngineCoreと併用時、行動終了時に減るステートのターンが倍減少していたバグを修正。
 * ver1.021:
 * コンソールの表示を削除。
 * ver1.02:
 * YEP_BattleEngineCore_ver1.28dとの併用化処理を追加。
 * メモ欄に記述のSIにsiも使用できるように追加。
 * ver1.01:
 * メッセージを非表示にする機能が正常に動作していなかったバグを修正。
 * メッセージの変換順を変更。
 * メッセージの制御文字に_userを追加。
 * ver1.00:
 * 公開
 */

(function () {
  ////////////////////////////////////////////////////////////////////////////////////

  var parameters = PluginManager.parameters("ConditionallyAddEffect");
  var displayAddEffectText = String(
    parameters["Display Add Effect Text"] || "_nameの追加効果が発動！"
  );

  ////////////////////////////////////////////////////////////////////////////////////

  function AddEffectManager() {
    throw new Error("This is a static class");
  }

  AddEffectManager.initCond = function (note) {
    var texts = note.split("\n");
    var flag = false;
    var result = [];
    for (var i = 0; i < texts.length; i++) {
      if (flag) {
        if (texts[i].match(/^<\/追加効果>/)) {
          result.push(effect);
          flag = false;
        } else {
          effect["conditions"].push(
            ConditionallyManager.makeCondition(texts[i])
          );
        }
      } else if (texts[i].match(/^<追加効果:([ISis])(\d+),(\d+)[%％]>/)) {
        var effect = {
          type: RegExp.$1,
          id: parseInt(RegExp.$2),
          rate: parseInt(RegExp.$3),
          conditions: [],
        };
        flag = true;
      }
    }
    return result;
  };

  ////////////////////////////////////////////////////////////////////////////////////

  var _CAef_BManager_endAction = BattleManager.endAction;
  BattleManager.endAction = function () {
    if (this._subject && !$gameTemp._checkAddEffect) {
      this.executeAddEffect();
      $gameTemp._checkAddEffect = true;
      this._caefCallItem = this._lastAction.item();
    }
    if (this._subject && this._subject.isAddEffects()) {
      var effect = this._subject.shiftCurrentAddEffects();
      var action = effect[0];
      this._subject._actions.unshift(action);
      $gameTemp._caefTargets = effect[1];
      this._logWindow.displayAddEffect(this._subject, this._caefCallItem);
      this.startAction();
      this._subject.removeCurrentAction();
    } else {
      $gameTemp._caefTargets = null;
      $gameTemp._checkAddEffect = false;
      _CAef_BManager_endAction.call(this);
    }
  };

  BattleManager.executeAddEffect = function () {
    if ($gameTroop.aliveMembers().length === 0) {
      return;
    }
    var item = this._lastAction.item();
    if (!item) {
      return;
    }
    item._condAddEffects =
      item._condAddEffects || AddEffectManager.initCond(item.note);
    var cEff = item._condAddEffects;
    var user = this._subject;
    var targets = this._lastTargets;
    if (!targets) {
      return;
    }
    if (!targets[0]) {
      return;
    }
    if (!targets[0]._lastHit) {
      return;
    }
    user._addEffects = [];
    for (var i = 0; i < cEff.length; i++) {
      if (Math.random() < cEff[i]["rate"] / 100) {
        if (
          ConditionallyManager.checkConditions(
            user,
            targets[0],
            cEff[i]["conditions"]
          )
        ) {
          var action = new Game_Action(user);
          switch (cEff[i]["type"]) {
            case "I":
            case "i":
              action.setItem(cEff[i]["id"]);
              break;
            case "S":
            case "s":
              action.setSkill(cEff[i]["id"]);
              break;
          }
          var tgr = [];
          if (action.item().scope === item.scope) {
            var r = targets.filter(function (t) {
              return t.isDead();
            });
            if (r.length !== targets.length) {
              tgr = targets;
            }
          } else if (action.isForOne() && action.isForFriend()) {
            if (user.isAlive()) {
              tgr = [user];
            }
          } else if (
            action.isForOne() &&
            action.isForOpponent() &&
            this._lastAction.isForOpponent()
          ) {
            for (var j = 0; j < targets.length; j++) {
              if (targets[j].isAlive()) {
                tgr = [targets[j]];
                break;
              }
            }
          } else {
            tgr = action.makeTargets();
          }
          if (tgr.length > 0) {
            user.setAddEffects(action, tgr);
          }
        }
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////

  Game_Battler.prototype.setAddEffects = function (action, targets) {
    if (this._addEffects === undefined) {
      this._addEffects = [];
    }
    this._addEffects.push([action, targets]);
  };

  Game_Battler.prototype.isAddEffects = function () {
    if (this._addEffects && this._addEffects.length > 0) {
      return true;
    }
    return false;
  };

  Game_Battler.prototype.shiftCurrentAddEffects = function () {
    return this._addEffects.shift();
  };

  var __GBattler_useItem = Game_Battler.prototype.useItem;
  Game_Battler.prototype.useItem = function (item) {
    if ($gameTemp._checkAddEffect) {
      return;
    } // 追加効果は消費が発生しない
    __GBattler_useItem.call(this, item);
  };

  ////////////////////////////////////////////////////////////////////////////////////

  Window_BattleLog.prototype.displayAddEffect = function (subject, item) {
    var text = displayAddEffectText;
    if (text != "null") {
      if (DataManager.isSkill(item)) {
        text = text.replace("_mes1", item.message1);
        text = text.replace("_mes2", item.message2);
      }
      text = text.replace("_user", subject.name());
      text = text.replace("_name", item.name);
      this.push("addText", text);
      this.push("wait");
      this.push("clear");
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////

  var _CAef_GAction_makeTargets = Game_Action.prototype.makeTargets;
  Game_Action.prototype.makeTargets = function () {
    if ($gameTemp._caefTargets) {
      return $gameTemp._caefTargets;
    } else {
      return _CAef_GAction_makeTargets.call(this);
    }
  };

  var _CAef_GAction_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    $gameTemp._tmpTarget = target;
    _CAef_GAction_apply.call(this, target);
  };

  ////////////////////////////////////////////////////////////////////////////////////

  var _CAef_GActionResult_isHit = Game_ActionResult.prototype.isHit;
  Game_ActionResult.prototype.isHit = function () {
    var result = _CAef_GActionResult_isHit.call(this);
    $gameTemp._tmpTarget._lastHit = result;
    return result;
  };

  ////////////////////////////////////////////////////////////////////////////////////
})();
