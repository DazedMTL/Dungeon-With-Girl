//=============================================================================
// LinkActionSkill.js
//=============================================================================
/*:
* @plugindesc Enable Reactions to skill usage such as chaining and counter with another skill
* @author Souji Kenzaki
*
* @param InteruptEnemyText
* @desc 敵の行動をクラッシュカウンターでキャンセルした際のテキスト。(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2が%1の%3に割り込み!
*
* @param InteruptSelfText
* @desc 自身の行動がクラッシュカウンターで変化した際のテキスト。(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2の%3が%4に変化した!
*
* @param CounterEnemyText
* @desc 敵の行動に反撃する際のテキスト(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2が%1の%3に%4で反撃！
*
* @param CounterSelfText
* @desc 自身のの行動に連鎖する際のテキスト(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2は続いて%4を発動！
*
* @help This plugin does not provide plugin commands.
*
* Memo Tag:
* For skill:
* <linkskill:[Skill ID]>
* Activate Skill with [Skill ID] after this skill is used.
* Will attempt to target same enemy.
*
* For State
* <elementcounter:[Element ID],[Probability（%）],[Skill Id]>  
* When attacked with [Element ID], Counter with [Probability（%）] using Skill with [Skill Id].
*　Is compatible with Multi-Element by YEP_ElementCore.
*
* <counter_exaustturn>
* When this tag exists along with elementcounter, the counter atk will count as an actual action,
* reset CTB charge and reduce the duration of states which progress at "end of action"
*
* <counter_ignorebind>
* When this tag exists along with elementcounter, counter will happen
* even when character is affected by disabling states such as sleep.
*/
/*:ja
* @plugindesc スキルへの反応関連（連鎖、反撃）
* @author 剣崎宗二
*
* @param InteruptEnemyText
* @desc 敵の行動をクラッシュカウンターでキャンセルした際のテキスト。(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2が%1の%3に割り込み!
*
* @param InteruptSelfText
* @desc 自身の行動がクラッシュカウンターで変化した際のテキスト。(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2の%3が%4に変化した!
*
* @param CounterEnemyText
* @desc 敵の行動に反撃する際のテキスト(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2が%1の%3に%4で反撃！
*
* @param CounterSelfText
* @desc 自身のの行動に連鎖する際のテキスト(%1=元の行動者名 %2=カウンター実行者名 %3=元の行動名 %4=新しい行動名)
* @default %2は続いて%4を発動！
*
* @help このプラグインにはプラグインコマンドはありません。
*
* スキルメモ欄用
* <linkskill:[連鎖確率（%）],[連動スキルID]>
* このスキルの発動直後、[連動スキルID]で指定されたスキルが更に発動します。
* ※更に発動するスキルのターゲットが選択可能な場合ターゲットが両方敵単体、或いは両方味方単体だった場合同じターゲットへ。そうでない場合はランダムにターゲットを選択します。
* 他の場合は敵全体など、技自体の設定が優先されます。
*
* ステートメモ欄用
* <elementcounter:[属性ID],[カウンター確率（%）],[反撃用スキルID]>  
* [属性ID]の属性の攻撃を受けた際、[カウンター確率]の確率で,[反撃用スキルID]を発動します。
*　YEP_ElementCoreによる複数属性対応。
*
* 共通（追加タグ）
* <counter_exaustturn>
* このタグが反撃、連動タグと同時に使われた際、追加攻撃は追加した1行動として扱われ、
* CTBの行動ゲージがリセットされるとともに「行動終了時に持続時間が変動する」ステートの持続時間を実際に1行動分、動かします。
*
* <counter_ignorebind>
* このタグが反撃、連動タグと同時に使われた際、例え行動不能のステートを受けていても
* 強制的に行動します。
*
* <counteronhit>
* このタグが反撃、連動タグと同時に使われた際、反応元のアクションが命中した場合のみ反撃や追撃を行います。
*
* <counteronevade>
* このタグが反撃、連動タグと同時に使われた際、反応元のアクションが回避された場合のみ反撃や追撃を行います。
*
* <counteroncrit>
* このタグが反撃、連動タグと同時に使われた際、反応元のアクションがクリティカルした場合のみ反撃や追撃を行います。
*
* <counter_crash>
* このタグが反撃、連動タグと同時に使われた際、反応元のアクションをキャンセルして（発動させない）反撃や追撃を行います。
* 仕様上<counteronhit>/<counteronevade>/<counteroncrit>とは併用できません（結果が出る前にキャンセルしている為）
*
* <linkcondition:[式]>
* このタグが反撃、連動タグと同時に使われた際、[式]の評価がtrueにならない限り反撃や連鎖が発動しません。
*
* ※サポートが打ち切られておりますが、一応Yanfly氏のBattleSysCTBで動くように作っております
*/

(function () {

  var parameters = PluginManager.parameters('LinkActionSkills');
  var kzktxt_EInterrupt = parameters['InteruptEnemyText'];
  var kzktxt_SInterrupt = parameters['InteruptSelfText'];
  var kzktxt_ECounter = parameters['CounterEnemyText'];
  var kzktxt_SCounter = parameters['CounterSelfText'];

  BattleManager.originalsubject = [];

  Game_Action.prototype.decideRandomTargetForLink = function () {
    var target;
    if (this.isForDeadFriend()) {
      target = this.friendsUnit().randomDeadTarget();
    } else if (this.isForFriend()) {
      target = this.friendsUnit().randomTarget();
    } else {
      target = this.opponentsUnit().randomTarget();
    }
    if (target) {
      this._targetIndex = target.index();
    } else {
      this.clear();
    }
  };

  var BattleManager_startAction_kzk = BattleManager.startAction;
  BattleManager.startAction = function () {
    var subject = this._subject;
    subject._lastActionLS = subject.currentAction();
    this.prevTargets = [];
    this.counterStartSection = true;

    this._targets = subject._lastActionLS.makeTargets();

    //Initialize Reactive Action Lists
    if (!this.exActionListCrush) {
      this.exActionListCrush = [];
    }

    //Chain
    var linkedAction = BattleManager.generateLinkedAction();
    if (linkedAction) {
      this.exActionListCrush.unshift(linkedAction);
    }

    //Counter
    //console.log(this._targets)
    for (var i = 0; i < this._targets.length; i++) {
      this._targets[i]._lastAddedState = [];
      var counterlist = this._targets[i].calcSkillCounter(this._subject._lastActionLS, this.counterStartSection, i);
      for (var j = 0; j < counterlist.length; j++) {
        this.exActionListCrush.unshift(counterlist[j]);
      }
    }

    //console.log(this.exActionListCrush);
    if (this.exActionListCrush.length > 0) {
      var nextAction = this.exActionListCrush.shift();
      this._subject = nextAction.subject();
      if (this._subject && (this._subject.canMove() || nextAction.counter_ignorebind)) {
        //取り消し
        this._logWindow.counterInterrupt(subject, this._subject, subject._lastActionLS, nextAction);
        subject._actions.shift();
        this._subject._actions.unshift(nextAction);
        if (this.isCTB && this.isCTB()) {
          this._subject.kzkCounter = !nextAction.counter_exaustturn;
          this.startCTBAction(this._subject);
        }
        else {
          BattleManager.startAction();
          this._subject.removeCurrentAction();
        }
      }
    }
    else {
      BattleManager_startAction_kzk.call(this);
    }
  };

  Window_BattleLog.prototype.counterInterrupt = function (origSubj, newSubj, oldAction, newAction) {
    if (origSubj != newSubj) {
      if (kzktxt_EInterrupt) {
        this.push('addText', kzktxt_EInterrupt.format(origSubj.name(), newSubj.name(), oldAction.item().name, newAction.item().name));
      }
    }
    else {
      if (kzktxt_SInterrupt) {
        this.push('addText', kzktxt_SInterrupt.format(origSubj.name(), newSubj.name(), oldAction.item().name, newAction.item().name));
      }
    }
  };

  Window_BattleLog.prototype.counterNormal = function (origSubj, newSubj, oldAction, newAction) {
    if (origSubj != newSubj) {
      if (kzktxt_ECounter) {
        this.push('addText', kzktxt_ECounter.format(origSubj.name(), newSubj.name(), oldAction.item().name, newAction.item().name));
      }
    }
    else {
      if (kzktxt_SCounter) {
        this.push('addText', kzktxt_SCounter.format(origSubj.name(), newSubj.name(), oldAction.item().name, newAction.item().name));
      }
    }
  };

  var BattleManager_updateAction = BattleManager.updateAction;
  BattleManager.updateAction = function () {
    var target = this._targets[0];
    BattleManager_updateAction.call(this);
    if (target && !target.isDead()) {
      var newTarget = JsonEx.makeDeepCopy(target);
      if (target.isEnemy()) {
        newTarget.backupIndex = target.index();
      }
      this.prevTargets.push(newTarget);
    }
  };

  var Game_Enemy_prototype_index = Game_Enemy.prototype.index;
  Game_Enemy.prototype.index = function () {
    var index_of = Game_Enemy_prototype_index.call(this);
    if (index_of > -1) { return index_of; }
    if (this.backupIndex === 0 || this.backupIndex) { return this.backupIndex; }
    return -1;
  };

  var BattleManager_endAction_kzk = BattleManager.endAction;
  BattleManager.endAction = function () {
    var backupSubject = this._subject;
    //set prevTargets again, due to YEP_BattleEngineCore Skipping the whole updateAction phase
    this._targets.forEach(function (target) {
      if (target && !target.isDead()) {
        var newTarget = JsonEx.makeDeepCopy(target);
        if (target.isEnemy()) {
          newTarget.backupIndex = target.index();
        }
        this.prevTargets.push(newTarget);
      }
    }, this);

    BattleManager_endAction_kzk.call(this);
    this._subject = backupSubject;
    this.counterStartSection = false;
    //Initialize Reactive Action Lists
    if (!this.exActionList) {
      this.exActionList = [];
    }

    //Chain
    var linkedAction = BattleManager.generateLinkedAction();
    if (linkedAction) {
      this.exActionList.unshift(linkedAction);
    }

    //Counter
    for (var i = 0; i < this.prevTargets.length; i++) {
      var counterlist = this.prevTargets[i].calcSkillCounter(this._subject._lastActionLS, this.counterStartSection, i);
      for (var j = 0; j < counterlist.length; j++) {
        this.exActionList.unshift(counterlist[j]);
      }
    }
    if (this.exActionList.length > 0) {
      var origSubject = this._subject;
      var nextAction = this.exActionList.shift();
      this._subject = nextAction.subject();
      if (this._subject && (this._subject.canMove() || nextAction.counter_ignorebind)) {
        this._logWindow.counterNormal(origSubject, this._subject, origSubject._lastActionLS, nextAction);
        this._subject._actions.unshift(nextAction);
        if (this.isCTB && this.isCTB()) {

          this._subject.kzkCounter = !nextAction.counter_exaustturn;
          this.startCTBAction(this._subject);

        }
        else {
          BattleManager.startAction();
          this._subject.removeCurrentAction();
        }
      }
    }
    else {
      if (this._subject._deathSentence) {
        this._subject._deathSentence = false;
        this._subject.clearActions();
        this._subject.die();
        this._subject.refresh();
      }
    }
  };


  //----------------------------------------Links----------------------------------------
  BattleManager.generateLinkedAction = function () {
    var subject = this._subject;
    var nextaction = JsonEx.makeDeepCopy(subject._lastActionLS);
    var someoneHit = false;
    var someoneEvade = false;
    var someoneCrit = false;
    for (var i = 0; i < this.prevTargets.length; i++) {
      var singleResult = this.prevTargets[i].result();
      if (singleResult.isHit()) { someoneHit = true; }
      if (!singleResult.isHit()) { someoneEvade = true; }
      if (singleResult.critical) { someoneCrit = true; }
    }
    if (nextaction.item().meta.counteronhit && !someoneHit) { return null; }
    if (nextaction.item().meta.counteronevade && !someoneEvade) { return null; }
    if (nextaction.item().meta.counteroncrit && !someoneCrit) { return null; }

    var a = subject;
    var b = this.prevTargets[0];
    if (nextaction.item().meta.linkcondition && !eval(nextaction.item().meta.linkcondition)) { return null; };

    if (!nextaction || !(nextaction.item()) || !nextaction.item().meta.linkskill) return null;
    if (!((nextaction.item().meta.counter_crash && this.counterStartSection) ||
      (!nextaction.item().meta.counter_crash && !this.counterStartSection))) {
      return null;
    }
    var linkC = nextaction.item().meta.linkskill.split(",");
    if (linkC.length < 2) {
      return null;
    }
    var nextId = linkC[1];
    var nextProb = linkC[0];
    nextaction.counter_ignorebind = nextaction.item().meta.counter_ignorebind;
    nextaction.counter_exaustturn = nextaction.item().meta.counter_exaustturn;
    if (nextId && Math.random() * 100 < nextProb) {
      nextaction.setSkill(nextId);
      nextaction._forcing = true;
      //Set target
      if (nextaction.needsSelection()) {
        if (subject._lastActionLS.item().scope == nextaction.item().scope) {
          nextaction._targetIndex = subject._lastActionLS._targetIndex;
        } else {
          nextaction.decideRandomTargetForLink();
        }
      }

      return nextaction;
    }
    return null;
  };

  //-----------------------Counters---------------------------------------------
  var Game_Battler_prototype_endTurnAllCTB = Game_Battler.prototype.endTurnAllCTB;
  Game_Battler.prototype.endTurnAllCTB = function () {
    if (this.kzkCounter) {
      if (this.battler()) this.battler().refreshMotion();
      //if (BattleManager.isTickBased()) this.onTurnEnd();
      this.kzkCounter = false;
    }
    else {
      Game_Battler_prototype_endTurnAllCTB.call(this);
    }
  };

  var Game_BattlerBase_prototype_updateStateActionEnd = Game_BattlerBase.prototype.updateStateActionEnd;
  Game_BattlerBase.prototype.updateStateActionEnd = function () {
    if (!this.kzkCounter) {
      Game_BattlerBase_prototype_updateStateActionEnd.call(this);
    }
  };


  var Game_BattlerBase_prototype_updateStateTurns = Game_BattlerBase.prototype.updateStateTurns;
  Game_BattlerBase.prototype.updateStateTurns = function () {
    if (!this.kzkCounter) {
      Game_BattlerBase_prototype_updateStateTurns.call(this);
    }
  };

  Game_BattlerBase.prototype.calcSkillCounter = function (action, counterStartSection, index) {
    if (!action) {
      return 0;
    }
    var rate = 0;
    var counterList = [];
    var target = this;
    var subject = action.subject();
    var a = subject;
    var b = target;

    //Yanfly_ElementCore対応
    var extraElements = action.checkElementkzk();

    var applicableStateList = this.states().map(function (element) {
      var formatted = {};
      formatted.state = element;
      formatted.target = this;
      return formatted;
    }, this);
    //1番手のみ、味方全員のインターセプトを上乗せする
    if (index < 1) {
      var unitList = this.friendsUnit().members().filter(function (unit) {
        return unit.name() != this.name();
      }, this);

      for (var i = 0; i < unitList.length; i++) {
        var list = unitList[i].states().filter(function (singleState) {
          return singleState.meta.counter_intercept;
        }, this).map(function (element) {
          var formatted = {};
          formatted.state = element;
          formatted.target = unitList[i];
          return formatted;
        }, this);
        applicableStateList = applicableStateList.concat(list);
      }
    }

    for (var i = 0; i < applicableStateList.length; i++) {
      var state = applicableStateList[i].state;
      if (state) {
        if (!((state.meta.counter_crash && counterStartSection) ||
          (!state.meta.counter_crash && !counterStartSection))) {
          continue;
        }

        var result = this.backupResult ? this.backupResult : this.result();
        if (state.meta.counteronhit && !result.isHit()) { continue; }
        if (state.meta.counteronevade && result.isHit()) { continue; }
        if (state.meta.counteroncrit && !result.critical) { continue; }

        if (state.meta.linkcondition && !eval(state.meta.linkcondition)) { continue; };

        if (state.meta.statecounter) {
          var meta_Array = state.metaArray ? state.metaArray.statecounter : [state.meta.statecounter]
          var incoming_isSkill = action.isSkill();

          meta_Array.some(function (stateWhole) {
            var stateC = stateWhole.split(",");
            if (stateC.length >= 3) {
              var counterState = Number(stateC[0]);
              var counterStateRate = stateC[1];

              //反射関連
              var isReflect = (Number(stateC[2]) == -1);
              var counterStateSkill = isReflect ? action.item().id : Number(stateC[2]);

              if (this._lastAddedState.indexOf(counterState) > -1 && Math.random() * 100 < counterStateRate) {
                var newaction = new Game_Action(applicableStateList[i].target, true);
                if (!incoming_isSkill && isReflect) {
                  newaction.setItem(counterStateSkill);
                }
                else {
                  newaction.setSkill(counterStateSkill);
                }

                newaction._targetIndex = subject.index();
                newaction.counter_ignorebind = state.meta.counter_ignorebind;
                newaction.counter_exaustturn = state.meta.counter_exaustturn;
                counterList.push(newaction);
                return true;
              }
            }
          }, this);
        }
        if (state.meta.elementcounter) {
          var meta_Array = state.metaArray ? state.metaArray.elementcounter : [state.meta.elementcounter]
          var incoming_isSkill = action.isSkill();

          meta_Array.some(function (elementWhole) {
            var elementC = elementWhole.split(",");
            if (elementC.length >= 3) {
              var counterElement = elementC[0];
              var counterRate = elementC[1];
              //反射関連
              var isReflect = (Number(elementC[2]) == -1);
              var counterSkill = isReflect ? action.item().id : Number(elementC[2]);

              if ((extraElements.indexOf(Number(counterElement)) >= 0) && Math.random() * 100 < counterRate) {

                var newaction = new Game_Action(applicableStateList[i].target, true);
                if (!incoming_isSkill && isReflect) {
                  newaction.setItem(counterSkill);
                }
                else {
                  newaction.setSkill(counterSkill);
                }

                newaction._targetIndex = subject.index();
                newaction.counter_ignorebind = state.meta.counter_ignorebind;
                newaction.counter_exaustturn = state.meta.counter_exaustturn;
                counterList.push(newaction);
                return true;
              }
            }
          }, this);
        }
      }
    }
    return counterList;
  };

  Game_Action.prototype.checkElementkzk = function () {
    var elements = [];
    if (typeof this.getItemElements === "function") {
      //Yanfly's element core
      elements = this.getItemElements();
    }
    else {
      if (this.item().damage.elementId < 0) {
        elements = this.subject().attackElements();
      } else {
        elements.push(this.item().damage.elementId);
      }
    }
    return elements;
  };


  //-----StateReact関連----
  var kz_Game_Battler_prototype_addState = Game_Battler.prototype.addState;
  Game_Battler.prototype.addState = function (stateId) {
    if (!this._lastAddedState) {
      this._lastAddedState = [];
    }
    this._lastAddedState.push(stateId);
    if (stateId == this.deathStateId() && this.hasDeathReaction()) {
      this._deathSentence = true;
    }
    else {
      kz_Game_Battler_prototype_addState.call(this, stateId);
    }
  };

  Game_Battler.prototype.hasDeathReaction = function () {
    for (var i = 0; i < this.states().length; i++) {
      var state = this.states()[i];
      if (state.meta.statecounter) {
        var stateC = state.meta.statecounter.split(",");
        if (stateC.length >= 3) {
          var counterState = Number(stateC[0]);
          if (counterState == this.deathStateId()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  var kz_Game_BattlerBase_prototype_revive = Game_BattlerBase.prototype.revive;
  Game_BattlerBase.prototype.revive = function () {
    if (this._deathSentence) {
      this._deathSentence = false;
    }
    kz_Game_BattlerBase_prototype_revive.call(this);
  }

  var kz_Game_Battler_prototype_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function (stateId) {
    if (stateId === this.deathStateId() && this._deathSentence) {
      this.revive();
    }
    kz_Game_Battler_prototype_removeState.call(this, stateId);
  };

  var kz_Game_Battler_prototype_refresh = Game_Battler.prototype.refresh;
  Game_Battler.prototype.refresh = function () {
    if (this._deathSentence) {
      Game_BattlerBase.prototype.refresh.call(this);
    }
    else {
      kz_Game_Battler_prototype_refresh.call(this);
    }
  }

  var kz_Game_Action_prototype_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    kz_Game_Action_prototype_apply.call(this, target);
    target.backupResult = JsonEx.makeDeepCopy(target.result());
  };

})();


