//=============================================================================
// MPP_Patch.js
//=============================================================================

/*:
 * @plugindesc 【2019/11/30】不具合修正プラグイン
 * @author 木星ペンギン
 *
 * @help 1.ダメージスプライトの更新が２度行われている不具合の修正
 * 2.画面スクロール中、マップとキャラクターの同期がとれていない不具合の修正
 * 3.サイドビュー戦闘でアクターがステートの変化によって、
 *   防御中が解除されない不具合の修正
 * 4.[文章の表示]などで改行時に行の高さの計算が間違っている不具合の修正
 * 5.グラフィックが設定されていないイベントの基準パターンを1番に変更
 * 6.[文章の表示]でウェイト中にもスキップが行える機能の追加と
 *   スキップ中はウェイトをしない機能の追加
 * 7.モバイルデバイスで色調変更やブレンドする色を変更した際、
 *   極端に処理が重くなる仕様への対処
 * 8.一部のカーソルを非表示にする処理で、カーソルSEが鳴らないように修正
 * 9.移動ルートの実行を可能な限り１フレーム以内に行うように修正
 * 10.[選択肢の表示]で文字の大きさを変更した際、
 *    次の項目の位置がずれる不具合の修正
 * 11.戦闘中に[メンバーの入れ替え]を行った際、パラメータの初期化や
 *    ステートの解除等が行われない不具合の修正
 * 12.[文章の表示]で文章の最後がウェイトだった場合、無視される不具合の修正
 * 13.戦闘中にコモンイベントを実行するスキルを使用した際、
 *    行動失敗と判定される処理の修正
 * 14.アクション中にバトルイベントの条件を満たし[戦闘行動の強制]を実行した際、
 *    アクション中だったキャラにアクション終了処理が実行されない不具合の修正
 * 15.ターン終了時以外で[戦闘行動の強制]を実行した場合、
 *    ターン経過が行われない不具合の修正
 * 16.アイテム/スキルのダメージ計算式で、まだ使用していない変数を使うと
 *    ダメージが0になってしまう不具合の修正
 * 17.ターン終了時に[戦闘行動の強制]を実行すると、
 *    自然回復処理が複数回行われる不具合の修正
 * 18.戦闘メンバーにいないアクターに対し[戦闘行動の強制]を行う際、
 *    戦闘開始処理を行うように修正
 * 19.WebGLにてタイルサイズや画面サイズを変更した際に、
 *    不要なスプライトが解放されない不具合の修正
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Patch1 enabled?
 * @type boolean
 * @desc 修正内容1番の有効/無効
 * @default true
 * 
 * @param Patch2 enabled?
 * @type boolean
 * @desc 修正内容2番の有効/無効
 * @default true
 * 
 * @param Patch3 enabled?
 * @type boolean
 * @desc 修正内容3番の有効/無効
 * @default true
 * 
 * @param Patch4 enabled?
 * @type boolean
 * @desc 修正内容4番の有効/無効
 * @default true
 * 
 * @param Patch5 enabled?
 * @type boolean
 * @desc 修正内容5番の有効/無効
 * @default true
 * 
 * @param Patch6 enabled?
 * @type boolean
 * @desc 修正内容6番の有効/無効
 * @default true
 * 
 * @param Patch7 enabled?
 * @type boolean
 * @desc 修正内容7番の有効/無効
 * @default true
 * 
 * @param Patch8 enabled?
 * @type boolean
 * @desc 修正内容8番の有効/無効
 * @default true
 * 
 * @param Patch9 enabled?
 * @type boolean
 * @desc 修正内容9番の有効/無効
 * @default true
 * 
 * @param Patch10 enabled?
 * @type boolean
 * @desc 修正内容10番の有効/無効
 * @default true
 * 
 * @param Patch11 enabled?
 * @type boolean
 * @desc 修正内容11番の有効/無効
 * @default true
 * 
 * @param Patch12 enabled?
 * @type boolean
 * @desc 修正内容12番の有効/無効
 * @default true
 * 
 * @param Patch13 enabled?
 * @type boolean
 * @desc 修正内容13番の有効/無効
 * @default true
 * 
 * @param Patch14 enabled?
 * @type boolean
 * @desc 修正内容14番の有効/無効
 * @default true
 * 
 * @param Patch15 enabled?
 * @type boolean
 * @desc 修正内容15番の有効/無効
 * @default true
 * 
 * @param Patch16 enabled?
 * @type boolean
 * @desc 修正内容16番の有効/無効
 * @default false
 * 
 * @param Patch17 enabled?
 * @type boolean
 * @desc 修正内容17番の有効/無効
 * @default true
 * 
 * @param Patch18 enabled?
 * @type boolean
 * @desc 修正内容18番の有効/無効
 * @default false
 * 
 * @param Patch19 enabled?
 * @type boolean
 * @desc 修正内容19番の有効/無効
 * @default true
 * 
 */

(function () {

    var parameters = PluginManager.parameters('MPP_Patch');
    const MPPlugin = {
        patch1enabled: !!eval(parameters['Patch1 enabled?']),
        patch2enabled: !!eval(parameters['Patch2 enabled?']),
        patch3enabled: !!eval(parameters['Patch3 enabled?']),
        patch4enabled: !!eval(parameters['Patch4 enabled?']),
        patch5enabled: !!eval(parameters['Patch5 enabled?']),
        patch6enabled: !!eval(parameters['Patch6 enabled?']),
        patch7enabled: !!eval(parameters['Patch7 enabled?']),
        patch8enabled: !!eval(parameters['Patch8 enabled?']),
        patch9enabled: !!eval(parameters['Patch9 enabled?']),
        patch10enabled: !!eval(parameters['Patch10 enabled?']),
        patch11enabled: !!eval(parameters['Patch11 enabled?']),
        patch12enabled: !!eval(parameters['Patch12 enabled?']),
        patch13enabled: !!eval(parameters['Patch13 enabled?']),
        patch14enabled: !!eval(parameters['Patch14 enabled?']),
        patch15enabled: !!eval(parameters['Patch15 enabled?']),
        patch16enabled: !!eval(parameters['Patch16 enabled?']),
        patch17enabled: !!eval(parameters['Patch17 enabled?']),
        patch18enabled: !!eval(parameters['Patch18 enabled?']),
        patch19enabled: !!eval(parameters['Patch19 enabled?']),
    };

    const Alias = {};


    // 1.ダメージスプライトの更新が２度行われている不具合の修正
    if (MPPlugin.patch1enabled) {

        //99
        Sprite_Battler.prototype.updateDamagePopup = function () {
            this.setupDamagePopup();
            if (this._damages.length > 0) {
                //            for (var i = 0; i < this._damages.length; i++) {
                //                this._damages[i].update();
                //            }
                if (!this._damages[0].isPlaying()) {
                    this.parent.removeChild(this._damages[0]);
                    this._damages.shift();
                }
            }
        };

    }



    // 2.画面スクロール中、タイルマップとキャラクターの座標が同期できていない不具合の修正
    if (MPPlugin.patch2enabled) {

        //258
        Game_CharacterBase.prototype.screenX = function () {
            var tw = $gameMap.tileWidth();
            return Math.ceil(this.scrolledX() * tw + tw / 2);
        };

        //263
        Game_CharacterBase.prototype.screenY = function () {
            var th = $gameMap.tileHeight();
            return Math.ceil(this.scrolledY() * th + th -
                this.shiftY() - this.jumpHeight());
        };

    }



    // 3.サイドビュー戦闘でアクターがステートの変化によって、
    //   防御中が解除されない不具合の修正
    if (MPPlugin.patch3enabled) {

        //18
        Alias.GaBa_initMembers = Game_Battler.prototype.initMembers;
        Game_Battler.prototype.initMembers = function () {
            Alias.GaBa_initMembers.apply(this, arguments);
            this._forceMotionRefresh = false;
        };

        Game_Battler.prototype.requestForceMotionRefresh = function () {
            this.requestMotionRefresh();
            this._forceMotionRefresh = true;
        };

        //473
        Alias.WiBaLo_displayAffectedStatus = Window_BattleLog.prototype.displayAffectedStatus;
        Window_BattleLog.prototype.displayAffectedStatus = function (target) {
            Alias.WiBaLo_displayAffectedStatus.apply(this, arguments);
            if (target.result().isStatusAffected() && !target.motionType()) {
                this.push('requestForceMotionRefresh', target);
            }
        };

        Window_BattleLog.prototype.requestForceMotionRefresh = function (target) {
            target.requestForceMotionRefresh();
        };

        //208
        Alias.SpAc_refreshMotion = Sprite_Actor.prototype.refreshMotion;
        Sprite_Actor.prototype.refreshMotion = function () {
            var actor = this._actor;
            if (actor) {
                if (actor._forceMotionRefresh) {
                    this._motion = null;
                    actor._forceMotionRefresh = false;
                }
            }
            Alias.SpAc_refreshMotion.apply(this, arguments);
        };

    }



    // 4.[文章の表示]などで改行時に行の高さの計算が間違っている不具合の修正
    if (MPPlugin.patch4enabled) {

        //327
        Window_Base.prototype.processNewLine = function (textState) {
            textState.x = textState.left;
            textState.y += textState.height;
            textState.index++;
            textState.height = this.calcTextHeight(textState, false);
        };

    }



    // 5.グラフィックが設定されていないイベントの基準パターンを1番に変更
    if (MPPlugin.patch5enabled) {

        //256
        Alias.GaEv_setupPageSettings = Game_Event.prototype.setupPageSettings;
        Game_Event.prototype.setupPageSettings = function () {
            Alias.GaEv_setupPageSettings.apply(this, arguments);
            if (this._tileId === 0 && !this._characterName) {
                this._originalPattern = 1;
                this.setPattern(1);
            }
        };

    }



    // 6.[文章の表示]でウェイト中にもスキップが行える機能の追加と
    //   スキップ中はウェイトをしない機能の追加
    if (MPPlugin.patch6enabled) {

        //125
        Alias.WiMe_updateWait = Window_Message.prototype.updateWait;
        Window_Message.prototype.updateWait = function () {
            if (!Alias.WiMe_updateWait.apply(this, arguments)) return false;
            this.updateShowFast();
            return !this._showFast;
        };

        //291
        Alias.WiMe_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
        Window_Message.prototype.processEscapeCharacter = function (code, textState) {
            switch (code) {
                case '.':
                    if (!this._showFast) this.startWait(15);
                    break;
                case '|':
                    if (!this._showFast) this.startWait(60);
                    break;
                default:
                    Alias.WiMe_processEscapeCharacter.apply(this, arguments);
                    break;
            }
        };

    }



    // 7.アニメーション処理の軽量化
    if (MPPlugin.patch7enabled) {

        //76
        Alias.SpPi_updateTone = Sprite_Picture.prototype.updateTone;
        Sprite_Picture.prototype.updateTone = function () {
            if (Utils.isMobileDevice()) {
                var picture = this.picture();
                if (picture.tone()) {
                    if (Graphics.frameCount % 4 === 0) this.setColorTone(picture.tone());
                } else {
                    this.setColorTone([0, 0, 0, 0]);
                }
            } else {
                Alias.SpPi_updateTone.apply(this, arguments);
            }
        };

        //214
        Alias.SpEn_updateWhiten = Sprite_Enemy.prototype.updateWhiten;
        Sprite_Enemy.prototype.updateWhiten = function () {
            if (Utils.isMobileDevice()) {
                var alpha = 128 - Math.ceil((16 - this._effectDuration) / 4) * 40;
                this.setBlendColor([255, 255, 255, alpha]);
            } else {
                Alias.SpEn_updateWhiten.apply(this, arguments);
            }
        };

        //237
        Alias.SpEn_updateBossCollapse = Sprite_Enemy.prototype.updateBossCollapse;
        Sprite_Enemy.prototype.updateBossCollapse = function () {
            if (Utils.isMobileDevice()) {
                this._shake = this._effectDuration % 2 * 4 - 2;
                this.blendMode = Graphics.BLEND_ADD;
                this.opacity *= this._effectDuration / (this._effectDuration + 1);
                if (this._effectDuration % 4 === 0) {
                    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
                }
                if (this._effectDuration % 20 === 19) {
                    SoundManager.playBossCollapse2();
                }
            } else {
                Alias.SpEn_updateBossCollapse.apply(this, arguments);
            }
        };

        //80
        Alias.SpAn_updateFlash = Sprite_Animation.prototype.updateFlash;
        Sprite_Animation.prototype.updateFlash = function () {
            if (Utils.isMobileDevice()) {
                if (this._flashDuration > 0) {
                    var d = this._flashDuration--;
                    this._flashColor[3] *= (d - 1) / d;
                    if (d % this._rate === 0 || this._flashDuration === 0) {
                        this._target.setBlendColor(this._flashColor);
                    }
                }
            } else {
                Alias.SpAn_updateFlash.apply(this, arguments);
            }
        };

        //93
        Alias.SpDa_updateChild = Sprite_Damage.prototype.updateChild;
        Sprite_Damage.prototype.updateChild = function (sprite) {
            if (Utils.isMobileDevice()) {
                sprite.dy += 0.5;
                sprite.ry += sprite.dy;
                if (sprite.ry >= 0) {
                    sprite.ry = 0;
                    sprite.dy *= -0.6;
                }
                sprite.y = Math.round(sprite.ry);
                if (Graphics.frameCount % 4 === 0) {
                    sprite.setBlendColor(this._flashColor);
                }
            } else {
                Alias.SpDa_updateChild.apply(this, arguments);
            }
        };

    }



    // 8.不自然なカーソルSEへの対処
    if (MPPlugin.patch8enabled) {

        //368
        Window_Selectable.prototype.onTouch = function (triggered) {
            var lastIndex = this.index();
            var x = this.canvasToLocalX(TouchInput.x);
            var y = this.canvasToLocalY(TouchInput.y);
            var hitIndex = this.hitTest(x, y);
            if (hitIndex >= 0) {
                if (hitIndex === this.index()) {
                    if (triggered && this.isTouchOkEnabled()) {
                        this.processOk();
                        return; // カーソルSEが鳴らないように処理終了
                    }
                } else if (this.isCursorMovable()) {
                    this.select(hitIndex);
                }
            } else if (this._stayCount >= 10) {
                if (y < this.padding) {
                    this.cursorUp();
                } else if (y >= this.height - this.padding) {
                    this.cursorDown();
                }
            }
            if (this.index() !== lastIndex) {
                SoundManager.playCursor();
            }
        };

    }



    // 9.移動ルートの実行を可能な限り１フレーム以内に行うように修正
    if (MPPlugin.patch9enabled) {

        //112
        Alias.GaCh_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
        Game_Character.prototype.updateRoutineMove = function () {
            Alias.GaCh_updateRoutineMove.apply(this, arguments);
            if (this._moveRouteForcing && this.isMovementSucceeded() &&
                this.isStopping() && this._waitCount === 0 &&
                this._moveRouteIndex > 0) {
                this.updateRoutineMove();
            }
        };

        //125
        Alias.GaCh_processMoveCommand = Game_Character.prototype.processMoveCommand;
        Game_Character.prototype.processMoveCommand = function (command) {
            Alias.GaCh_processMoveCommand.apply(this, arguments);
            if (command.code === Game_Character.ROUTE_WAIT) {
                this._waitCount++;
            }
        };

    }



    // 10.[選択肢の表示]で文字の大きさを変更した際、次の項目の位置がずれる不具合の修正
    if (MPPlugin.patch10enabled) {

        //110
        Alias.WiChLi_drawItem = Window_ChoiceList.prototype.drawItem;
        Window_ChoiceList.prototype.drawItem = function (index) {
            this.resetFontSettings();
            Alias.WiChLi_drawItem.apply(this, arguments);
        };

    }



    // 11.戦闘中に[メンバーの入れ替え]を行った際、
    //    パラメータの初期化やステートの解除等が行われない不具合の修正
    if (MPPlugin.patch11enabled) {

        //179
        Alias.GaPa_addActor = Game_Party.prototype.addActor;
        Game_Party.prototype.addActor = function (actorId) {
            if (this.inBattle() && !this._actors.contains(actorId)) {
                var actor = $gameActors.actor(actorId);
                if (actor) actor.onBattleStart();
            }
            Alias.GaPa_addActor.apply(this, arguments);
        };

        //187
        Alias.GaPa_removeActor = Game_Party.prototype.removeActor;
        Game_Party.prototype.removeActor = function (actorId) {
            if (this.inBattle() && this._actors.contains(actorId)) {
                var actor = $gameActors.actor(actorId);
                if (actor) actor.onBattleEnd();
            }
            Alias.GaPa_removeActor.apply(this, arguments);
        };

    }



    // 12.[文章の表示]で文章の最後がウェイトだった場合、無視される不具合の修正
    if (MPPlugin.patch12enabled) {

        //284
        Alias.WiMe_isEndOfText = Window_Message.prototype.isEndOfText;
        Window_Message.prototype.isEndOfText = function (textState) {
            return this._waitCount === 0 && Alias.WiMe_isEndOfText.apply(this, arguments);
        };

    }



    // 13.戦闘中にコモンイベントを実行するスキルを使用した際、
    //    行動失敗と判定される処理の修正
    if (MPPlugin.patch13enabled) {

        //774
        Alias.GaAc_itemEffectCommonEvent = Game_Action.prototype.itemEffectCommonEvent;
        Game_Action.prototype.itemEffectCommonEvent = function (target, effect) {
            Alias.GaAc_itemEffectCommonEvent.apply(this, arguments);
            target.result().success = true;
        };

    }



    // 14.アクション中にバトルイベントの条件を満たし[戦闘行動の強制]を実行した際、
    //    アクション中だったキャラにアクション終了処理が実行されない不具合の修正
    if (MPPlugin.patch14enabled) {

        //466
        Alias.BaMa_processForcedAction = BattleManager.processForcedAction;
        BattleManager.processForcedAction = function () {
            if (this._subject) {
                var subject = this._subject;
                subject.onAllActionsEnd();
                this.refreshStatus();
                this._logWindow.displayAutoAffectedStatus(subject);
                this._logWindow.displayCurrentState(subject);
                this._logWindow.displayRegeneration(subject);
            }
            Alias.BaMa_processForcedAction.apply(this, arguments);
        };

    }



    // 15.ターン終了時以外で[戦闘行動の強制]を実行した場合、
    //    ターン経過が行われない不具合の修正
    if (MPPlugin.patch15enabled) {

        //19
        Alias.BaMa_initMembers_patch15 = BattleManager.initMembers;
        BattleManager.initMembers = function () {
            Alias.BaMa_initMembers_patch15.apply(this, arguments);
            this._tuenEndAction = false;
        };

        //240
        Alias.BaMa_startInput_patch15 = BattleManager.startInput;
        BattleManager.startInput = function () {
            this._tuenEndAction = false;
            Alias.BaMa_startInput_patch15.apply(this, arguments);
        };

        //466
        Alias.BaMa_processForcedAction_patch15 = BattleManager.processForcedAction;
        BattleManager.processForcedAction = function () {
            this._tuenEndAction = (this._tuenEndAction || this._phase === 'turnEnd');
            Alias.BaMa_processForcedAction_patch15.apply(this, arguments);
            this._turnForced = (this._turnForced && this._tuenEndAction);
        };


    }



    // 16.アイテム/スキルのダメージ計算式で、まだ使用していない変数を使うと
    //    ダメージが0になってしまう不具合の修正
    if (MPPlugin.patch16enabled) {

        //508
        Game_Action.prototype.evalDamageFormula = function (target) {
            try {
                var item = this.item();
                var a = this.subject();
                var b = target;
                var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
                var text = item.damage.formula.replace(/v\[(\d+)\]/g, function () {
                    return $gameVariables.value(parseInt(arguments[1]));
                });
                var value = Math.max(eval(text), 0) * sign;
                if (isNaN(value)) value = 0;
                return value;
            } catch (e) {
                return 0;
            }
        };

    }



    // 17.ターン終了時に[戦闘行動の強制]を実行すると、
    //    自然回復処理が複数回行われる不具合の修正
    if (MPPlugin.patch17enabled) {

        //321
        Alias.BaMa_endTurn_patch17 = BattleManager.endTurn;
        BattleManager.endTurn = function () {
            if (this.isForcedTurn()) {
                this._phase = 'turnEnd';
                this._turnForced = false;
            } else {
                Alias.BaMa_endTurn_patch17.apply(this, arguments);
            }
        };

    }



    // 18.戦闘メンバーにいないアクターに対し[戦闘行動の強制]を行う際、
    //    戦闘開始処理を行うように修正
    if (MPPlugin.patch18enabled) {

        //427
        Alias.GaBa_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
        Game_Battler.prototype.onAllActionsEnd = function () {
            Alias.GaBa_onAllActionsEnd.apply(this, arguments);
            if (this.index() < 0) {
                this.onBattleEnd();
            }
        };

        //1686
        Alias.GaIn_command339 = Game_Interpreter.prototype.command339;
        Game_Interpreter.prototype.command339 = function () {
            this.iterateBattler(this._params[0], this._params[1], function (battler) {
                if (battler.index() < 0) {
                    battler.onBattleStart();
                }
            });
            return Alias.GaIn_command339.apply(this, arguments);
        };

    }



    // 19.WebGLにてタイルサイズや画面サイズを変更した際に、
    //    不要なスプライトが解放されない不具合の修正
    if (MPPlugin.patch19enabled) {

        //4763
        Alias.Tilemap__createLayers_patch19 = Tilemap.prototype._createLayers;
        Tilemap.prototype._createLayers = function () {
            if (this._lowerLayer) {
                this.removeChild(this._lowerLayer);
                this.removeChild(this._upperLayer);
            }
            Alias.Tilemap__createLayers_patch19.apply(this, arguments);
        };

    }


})();
