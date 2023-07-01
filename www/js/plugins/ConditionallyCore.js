//
//  条件付き○○用ベース ver1.07
//
// ------------------------------------------------------
// Copyright (c) 2016 Yana
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------
//
// author Yana
//

var Imported = Imported || {};
Imported['ConditionallyCore'] = 1.07;

/*:
 * @plugindesc ver1.07/条件付き○○のプラグインを使用するのに、必要となる条件をまとめたベースプラグインです。
 * @author Yana
 * 
 * @help プラグインコマンドはありません。
 * 
 * このプラグインは、条件ドロップ、条件変化スキル、条件付き追加効果を使用するときに必要となります。
 * 
 * 条件の設定方法
 * 
 * ○○××
 * 
 * というように組み合わせて設定します。
 * 
 * ○○=対象
 * ××=基本条件
 * ◇◇=条件設定
 *
 * となります。
 * 
 * ======================================================
 * ○○で設定可能な対象
 * 対象
 * 味方
 * 敵
 * 討伐者
 * (何もなし)
 * ・対象=行動の対象が条件を満たすか判定します。
 * ・味方=仲間全体のうちいずれかが条件を満たすか判定します。
 * ・敵=敵全体のうちいずれかが条件を満たすか判定します。
 * ・討伐者=トドメを刺した者が条件を満たすか判定します。(条件ドロップ用)
 * ・(何もなし)=使用者または倒された対象が条件を満たすか判定します。
 * ------------------------------------------------------
 * ××で設定可能な条件
 * ターン条件:○以上
 * ターン条件:○以下
 * ・現在(または倒した時)のターン数が○以上(以下)の時、条件を満たします。
 * ターン条件:○-○以内
 * ターン条件:○-○以外
 * ・現在(または倒した時)のターン数が○-○以内(以外)の時、条件を満たします。
 * ターン条件:○,○,○,○・・・・
 * ・現在(または倒した時)のターン数が○,○,○,○・・・のいずれかの時、条件を満たします。
 *
 * 例:
 * ターン条件:5以上
 * ターン条件:5以下
 * ターン条件:5-7以内
 * ターン条件:5-8以外
 * ターン条件:5,6,7,8,9,10
 * ------------------------------------------------------
 * ステート条件:×:○,○,○,○・・・・
 * ・現在(または倒した時)にステート○,○,○,○・・・のうち×個にかかっている時、条件を満たします。
 * 
 * 例:
 * ステート条件:×:○,○,○,○・・・・
 * 対象ステート条件:×:○,○,○,○・・・・
 * 討伐者ステート条件:×:○,○,○,○・・・・
 * 敵ステート条件:×:○,○,○,○・・・・
 * 味方ステート条件:×:○,○,○,○・・・・
 * -----------------------------------------------------
 * ID条件
 * ID条件:○,○,○,○・・・
 * ・対象のIDが○のいずれかの時に条件を満たします。
 * 
 * 例:
 * ID条件:4,5,6,7,8
 * 対象ID条件:4,5,6,7,8
 * 討伐者ID条件:4,5,6,7,8
 * 敵ID条件:4,5,6,7,8
 * 味方ID条件:4,5,6,7,8
 * ------------------------------------------------------
 * ステータス条件:××○以上
 * ステータス条件:××○%以上
 * ステータス条件:××○以下
 * ステータス条件:××○%以下
 * ・現在(または倒した時)に××のステータスが○(%)以上(以下)の時、条件を満たします。
 * ステータス条件:××○-○以内
 * ステータス条件:××○%-○%以内
 * ステータス条件:××○-以外
 * ステータス条件:××○%-○%以外
 * ・現在(または倒した時)に××のステータスが○(%)-○(%)以内(以外)の時、条件を満たします。
 * ステータス条件:××○の倍数
 * ・現在(または倒した時)に××のステータスが○の倍数の時、条件を満たします。
 * 
 * 例:
 * ステータス条件:HP40%以上
 * ステータス条件:HP40%-80%以内
 * 対象ステータス条件:攻撃力30以上
 * 敵ステータス条件:運4の倍数
 * 味方ステータス条件:回避率100%以上
 * 討伐者ステータス条件:HP再生率10%以下
 * ------------------------------------------------------
 * 属性有効度条件:×,○：◇%以上,○：◇%以下,○：◇%以上・・・
 * ・現在(または倒した時)に○の属性の有効度が◇%以上(以下)のうちx個を満たす時、条件を満たします。
 * 
 * 例：
 * 属性有効度条件：2,1:40%以上,2:60%以上,3:70%以下
 * 対象属性有効度条件：2,1:40%以上,2:60%以上,3:70%以下
 * 討伐者属性有効度条件：2,1:40%以上,2:60%以上,3:70%以下
 * 敵属性有効度条件：2,1:40%以上,2:60%以上,3:70%以下
 * 味方属性有効度条件：2,1:40%以上,2:60%以上,3:70%以下
 * ------------------------------------------------------
 * ステート有効度条件:×,○：◇%以上,○：◇%以下,○：◇%以上・・・
 * ・現在(または倒した時)に○番のステートの有効度が◇%以上(以下)のうちx個を満たす時、条件を満たします。
 * 
 * 例：
 * ステート有効度条件：2,1:40%以上,2:60%以上,3:70%以下 
 * 対象ステート有効度条件：2,1:40%以上,2:60%以上,3:70%以下 
 * 討伐者ステート有効度条件：2,1:40%以上,2:60%以上,3:70%以下 
 * 敵ステート有効度条件：2,1:40%以上,2:60%以上,3:70%以下 
 * 味方ステート有効度条件：2,1:40%以上,2:60%以上,3:70%以下 
 * ------------------------------------------------------
 * 人数条件:○以上
 * 人数条件:○以下
 * ・現在(または倒した時)の戦闘参加人数が○以上(以下)の時、条件を満たします。
 * 人数条件:○-○以内
 * 人数条件:○-○以外
 * ・現在(または倒した時)の戦闘参加人数が○-○以内(以外)の時、条件を満たします。
 * 人数条件:○,○,○,○・・・・
 * ・現在(または倒した時)の戦闘参加人数が○,○,○,○・・・のいずれかの時、条件を満たします。
 *
 * 例:
 * 人数条件:5以上
 * 人数条件:5以下
 * 人数条件:5-7以内
 * 人数条件:5-8以外
 * 人数条件:5,6,7,8,9,10
 * 対象人数条件:5以上
 * 対象人数条件:5以下
 * 対象人数条件:5-7以内
 * 対象人数条件:5-8以外
 * 対象人数条件:5,6,7,8,9,10
 * ------------------------------------------------------
 * ××で設定可能な条件
 * 生存人数条件:○以上
 * 生存人数条件:○以下
 * ・現在の生存人数が○以上(以下)の時、条件を満たします。
 * 生存人数条件:○-○以内
 * 生存人数条件:○-○以外
 * ・現在の生存人数が○-○以内(以外)の時、条件を満たします。
 * 生存人数条件:○,○,○,○・・・・
 * ・現在の生存人数が○,○,○,○・・・のいずれかの時、条件を満たします。
 *
 * 例:
 * 生存人数条件:5以上
 * 生存人数条件:5以下
 * 生存人数条件:5-7以内
 * 生存人数条件:5-8以外
 * 生存人数条件:5,6,7,8,9,10
 * 対象生存人数条件:5以上
 * 対象生存人数条件:5以下
 * 対象生存人数条件:5-7以内
 * 対象生存人数条件:5-8以外
 * 対象生存人数条件:5,6,7,8,9,10
 * ------------------------------------------------------
 * 変数条件:×が○以上
 * 変数条件:×が○以下
 * ・変数×の値が○以上(以下)の時、条件を満たします。
 * 
 * 例:
 * 変数条件:5が10以上
 * 変数条件:5が10以下
 * ------------------------------------------------------
 * スイッチ条件:×がON
 * スイッチ条件:×がOFF
 * ・スイッチ×の値がON(OFF)の時、条件を満たします。
 * 
 * 例:
 * スイッチ条件:5がON
 * スイッチ条件:5がOFF
 * ------------------------------------------------------
 * 装備条件:×:○◇,○◇,○◇・・・
 * ・対象がW(A)◇番の装備を×個装備している時、条件を満たします。
 * 
 * 例:
 * 装備条件:2:W1,A2,W3,A1
 * ------------------------------------------------------
 * 装備タイプ条件:×:○◇,○◇,○◇・・・
 * ・対象がW(A)◇番の装備タイプの装備をぞれぞれ×個装備している時、条件を満たします。
 * 
 * 例:
 * 装備タイプ条件:2:W1,A2,W3,A1
 * ------------------------------------------------------
 * クラス条件:○,○,○,○・・・
 * ・対象のクラスが○,○,○,○・・・のいずれかの時、条件を満たします。対象がエネミーの場合条件を満たしません。
 * 
 * 例:
 * クラス条件:1,2,3,4,5
 * ------------------------------------------------------
 * 特徴メモ条件:○○
 * ・対象の持っている特徴に○○をメモに含むものがある時、条件を満たします。
 * 
 * 例:
 * 特徴メモ条件:<テスト> 
 * ------------------------------------------------------
 * メンバー条件:×:○,○,○・・・
 * ・待機メンバーを含むパーティメンバーの中にIDが○のメンバーがx人以上いる場合、条件を満たします。
 * 敵を対象とした場合、隠れているエネミーを含む敵メンバーで判定されます。
 * 
 * 例:
 * メンバー条件:2:1,2,3,4
 * ------------------------------------------------------
 * 戦闘メンバー条件:x:○,○,○・・・
 * ・戦闘メンバーの中にIDが○のメンバーがx人以上いる場合、条件を満たします。
 * 敵を対象とした場合、隠れているエネミーを含まない敵メンバーで判定されます。
 * 
 * 例:
 * 戦闘メンバー条件:2:1,2,3,4
 * ------------------------------------------------------
 * スクリプト条件:○
 * ・○をevalで判定します。
 * スクリプト条件は、複数行にわたって記述することができます。
 * 
 * 例:
 * スクリプト条件:$gameVairbales.value[10] === 10
 * ------------------------------------------------------
 * 以下は基本的に条件ドロップ専用です
 * ------------------------------------------------------
 * 属性条件:○,○,○,○・・・
 * ・トドメに使用した属性が○,○,○,○のうちいずれかの時、条件を満たします。
 * 
 * 例:
 * 属性条件:1,2,3,4,5
 * ------------------------------------------------------
 * ダメージ条件:○以上
 * ダメージ条件:○以下
 * ・トドメを刺した時に与えたダメージが、○以上(以下)の時、条件を満たします。
 * ダメージ条件:○-○以内
 * ダメージ条件:○-○以外
 * ・トドメを刺した時に与えたダメージが、○-○以内(以外)の時、条件を満たします。
 * 
 * 例:
 * ダメージ条件:120以上
 * ダメージ条件:120-240以内
 * ------------------------------------------------------
 * レベル条件:最大○以上
 * レベル条件:最低○以上
 * レベル条件:平均○以下
 * レベル条件:討伐者○以上
 * ・(パーティの)レベルが最大(最低、平均または討伐者)○以上(以下)の時、条件を満たします。
 * レベル条件:最大○-○以内
 * レベル条件:最低○-○以外
 * レベル条件:平均○-○以内
 * レベル条件:討伐者○-○以外
 * ・(パーティの)レベルが最大(最低、平均または討伐者)○-○以内(以外)の時、条件を満たします。
 * 
 * 例:
 * レベル条件:最大5以上
 * レベル条件:最低3以下
 * レベル条件:平均4-8以内
 * レベル条件:討伐者5-10以外
 * ------------------------------------------------------
 * 通常攻撃
 * スキル攻撃
 * アイテム攻撃
 * 通常攻撃以外
 * スキル攻撃以外
 * アイテム攻撃以外
 * ・トドメを刺した攻撃が上記いずれかの時、条件を満たします。
 * 
 * 例:
 * 通常攻撃
 * 通常攻撃以外
 * スキル攻撃
 * スキル攻撃以外
 * アイテム攻撃
 * アイテム攻撃以外
 * ------------------------------------------------------
 * スキル条件:○,○,○,○・・・
 * アイテム条件:○,○,○,○・・・
 * ・トドメを刺した攻撃が○,○,○,○番のいずれかのスキル(アイテム)の時、条件を満たします。
 * 
 * 例:
 * スキル条件:1,2,3,4,5
 * アイテム条件:1,2,3,4,5
 * 
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.07:
 * dieStatus周りの処理を修正。
 * ver1.06:
 * 利用規約をMITライセンスに変更。
 * スクリプト条件で、v=変数,s=スイッチが使えるように変更。
 * 装備条件、装備タイプ条件が正常に機能していなかったバグを修正。
 * ver1.05:
 * スクリプト条件が正常に機能していないバグを修正。
 * ver1.04:
 * 生存人数条件を使用した際、エラーが発生するバグを修正。
 * ver1.03:
 * メンバー条件を追加。
 * 戦闘メンバー条件を追加。
 * スクリプト条件を追加。
 * ver1.02:
 * スイッチ条件が正常に機能していないバグを修正。
 * ver1.01:
 * ステータス条件に最大HPと最大MPの条件を追加。
 * ver1.00:
 * 公開
 */

function ConditionallyManager() {
    throw new Error('This is a static class');
}

(function () {

    'use strict';

    ConditionallyManager.initConditions = function () {
        this._targetCheck = ['^(?:t|対象)', '^(?:p|味方)', '^(?:tr|敵)', '^(?:f|討伐者)', '^'];

        this._preCheck = [
            ['(?:turn|ターン条件)', 'value1', 'value2', 'value3'],
            ['(?:state|ステート条件)', 'value3'],
            ['(?:id|ID条件)', 'value3'],
            ['(?:status|ステータス条件)', 'value4', 'value5', 'value6'],
            ['(?:eEfficacy|属性有効度条件)', 'value7'],
            ['(?:sEfficacy|ステート有効度条件)', 'value7'],
            ['(?:size|人数条件)', 'value1', 'value2', 'value3'],
            ['(?:aSize|生存人数条件)', 'value1', 'value2', 'value3'],
            ['(?:variable|変数条件)', 'value8'],
            ['(?:switch|スイッチ条件)', 'value9'],
            ['(?:equip|装備条件)', 'value10'],
            ['(?:eType|装備タイプ条件)', 'value10'],
            ['(?:class|クラス条件)', 'value3'],
            ['(?:memo|特徴メモ条件)', 'value11'],
            ['(?:element|属性条件)', 'value3'],
            ['(?:damage|ダメージ条件)', 'value1', 'value2'],
            ['(?:level|レベル条件)', 'value12'],
            ['(?:normalA|通常攻撃)', 'value13'],
            ['(?:skillA|スキル攻撃)', 'value13'],
            ['(?:itemA|アイテム攻撃)', 'value13'],
            ['(?:skill|スキル条件)', 'value3'],
            ['(?:item|アイテム条件)', 'value3'],
            ['(?:member|メンバー条件)', 'value3'],
            ['(?:battleMember|戦闘メンバー条件)', 'value3'],
            ['(?:script|スクリプト条件)', 'value13']
        ];

        this._valueCheck = {
            'value1': /(\d+)以([上下])/,
            'value2': /(\d+)\-(\d+)以([内外])/,
            'value3': /(?:(\d+):)*(\d+(?:,\d+)*)/,
            'value4': /(.+?)(\d+)+([%％])?以([上下])/,
            'value5': /(.+?)(\d+)+([%％])?\-+(\d+)+([%％])?以([内外])/,
            'value6': /(.+?)(\d+)+の倍数/,
            'value7': /(?:(\d+),)*(\d+:\d+[%％]以[上下]?)(?:[,，]\d+:\d+[%％]以[上下]?)*/,
            'value8': /(\d+)が(\d+)以([上下])?/,
            'value9': /(\d+)が(O[NF])/,
            'value10': /(?:(\d+):)*([WAwa])(\d+)(?:[,，]([WAwa])(\d+))*/,
            'value11': /(.+)/,
            'value12': /(.+)(\d+)以([上下])/,
            'value13': /(.+)*/
        }
    };

    ConditionallyManager.makeCondition = function (text) {
        if (!this._targetCheck) { this.initConditions() }

        for (var i = 0; i < this._targetCheck.length; i++) {
            for (var j = 0; j < this._preCheck.length; j++) {
                var reg1 = this._targetCheck[i] + this._preCheck[j][0] + '[:：]*';
                if (text.match(new RegExp(reg1 + '(.+)*'))) {
                    var reg = RegExp.$1;
                    var ary = this._preCheck[j].slice(1);
                    for (var t = 0; t < ary.length; t++) {
                        var result = null;
                        if (reg.match(this._valueCheck[ary[t]])) {
                            switch (ary[t]) {
                                case 'value1':
                                    return [i, j, [parseInt(RegExp.$1), RegExp.$2]];
                                case 'value2':
                                    return [i, j, [parseInt(RegExp.$1), parseInt(RegExp.$2), RegExp.$3]];
                                case 'value3':
                                    result = RegExp.$2.split(',');
                                    result.unshift(RegExp.$1);
                                    for (var u = 0; u < result.length; u++) {
                                        result[u] = parseInt(result[u]);
                                    }
                                    return [i, j, result];
                                case 'value4':
                                    result = [RegExp.$1, parseInt(RegExp.$2), RegExp.$3, RegExp.$4];
                                    return [i, j, result];
                                case 'value5':
                                    result = [RegExp.$1, parseInt(RegExp.$2), RegExp.$3,
                                    parseInt(RegExp.$4), RegExp.$5, RegExp.$6];
                                    return [i, j, result];
                                case 'value6':
                                    return [i, j, [RegExp.$1, parseInt(RegExp.$2)]];
                                case 'value7':
                                    var num = null;
                                    result = reg.split(',');
                                    if (result[0].match(/(\d+):(\d+):(\d+)[%％]以([上下])/)) {
                                        num = (parseInt(RegExp.$1));
                                    }
                                    for (var u = 0; u < result.length; u++) {
                                        result[u].match(/(\d+):(\d+)[%％]以([上下])/);
                                        result[u] = [parseInt(RegExp.$1), parseInt(RegExp.$2), RegExp.$3];
                                    }
                                    result.unshift(num);
                                    return [i, j, result];
                                case 'value8':
                                    return [i, j, [parseInt(RegExp.$1), parseInt(RegExp.$2)]];
                                case 'value9':
                                    return [i, j, [parseInt(RegExp.$1), RegExp.$2]];
                                case 'value10':
                                    var num = null;
                                    result = reg.split(',');
                                    if (result[0].match(/(\d+):([WAwa])(\d+)/)) {
                                        num = parseInt(RegExp.$1);
                                    }
                                    for (var u = 0; u < result.length; u++) {
                                        result[u].match(/([WAwa])(\d+)/);
                                        result[u] = [RegExp.$1, parseInt(RegExp.$2)];
                                    }
                                    result.unshift(num);
                                    return [i, j, result];
                                case 'value11':
                                    result = reg.replace(/\r/, '');
                                    result = result.replace(/\n/, '');
                                    return [i, j, result];
                                case 'value12':
                                    return [i, j, [RegExp.$1, parseInt(RegExp.$2), RegExp.$3]];
                                case 'value13':
                                    return [i, j, [RegExp.$1]];
                                default:
                                    break;
                            }
                        }
                    }
                }
            }
        }
        return [-1, -1, text];
    };

    ConditionallyManager.setTargets = function (user, target, type) {
        switch (type) {
            case 0:
            case 3:
                return [target];
            case 1:
                return user.isActor() ? $gameParty.members() : $gameTroop.members();
            case 2:
                return user.isActor() ? $gameTroop.members() : $gameParty.members();
            case 4:
                return [user];
            default:
        }
    };

    ConditionallyManager.checkConditions = function (user, target, conditions, dieStatus) {
        this._dieStatus = dieStatus;
        var fcns = [
            this.checkTurn,
            this.checkState,
            this.checkId,
            this.checkStatus,
            this.checkEleEff,
            this.checkStaEff,
            this.checkSize,
            this.checkASize,
            this.checkVariable,
            this.checkSwitch,
            this.checkEquip,
            this.checkEType,
            this.checkClass,
            this.checkMemo,
            this.checkElement,
            this.checkDamage,
            this.checkLevel,
            this.checkNormalA,
            this.checkSkillA,
            this.checkItemA,
            this.checkSkill,
            this.checkItem,
            this.checkMember,
            this.checkBattleMember,
            this.checkScript
        ];
        for (var i = 0; i < conditions.length; i++) {
            if (conditions[i][1] === -1 && conditions[i - 1][1] === 24) {
                for (var j = i; j < conditions.length; j++) {
                    if (conditions[j][1] === -1 && conditions[i][2]) {
                        conditions[i - 1][2] += '\n' + conditions[j][2];
                        conditions[j][1] = -2;
                    } else {
                        i = j - 1;
                        break;
                    }
                }
            }
        }
        for (var i = 0; i < conditions.length; i++) {
            if (!conditions[i]) { continue }
            if (conditions[i][1] < 0) { continue }
            var targets = this.setTargets(user, target, conditions[i][0]);
            if (!fcns[conditions[i][1]].call(this, targets, conditions[i][2])) {
                return false;
            }
        }
        return true;
    };

    ConditionallyManager.checkValues = function (code, num, value1, value2) {
        switch (code) {
            case '上':
                return num >= value1;
            case '下':
                return num <= value1;
            case '内':
                return num >= value1 && num <= value2;
            case '外':
                return num <= value1 && num >= value2;
            default:
                return (value1 % num) === 0;
        }
    };

    ConditionallyManager.checkTurn = function (targets, conditions) {
        var turn = this._dieStatus ? this._dieStatus['turn'] : BattleManager.ccTurnCount();
        var code = conditions[conditions.length - 1];
        switch (code) {
            case '上':
            case '下':
            case '内':
            case '外':
                return this.checkValues(code, turn, conditions[0], conditions[1]);
            default:
                return conditions.indexOf(turn) !== -1;
        }
    };
    ConditionallyManager.checkState = function (targets, conditions) {
        conditions = conditions.clone();
        var num = conditions.shift();
        num = isNaN(num) ? 1 : num;
        for (var i = 0; i < targets.length; i++) {
            var count = 0;
            for (var j = 0; j < conditions.length; j++) {
                if (targets[i].isStateAffected(conditions[j])) {
                    count++;
                    if (count === num) { return true }
                }
            }
        }
        return false;
    };
    ConditionallyManager.checkId = function (targets, conditions) {
        conditions = conditions.clone();
        conditions.shift();
        for (var i = 0; i < targets.length; i++) {
            var id = targets[i].isActor() ? targets[i]._actorId : targets[i]._enemyId;
            if (conditions.indexOf(id) >= 0) { return true }
        }
        return false;
    };
    ConditionallyManager.checkStatus = function (targets, conditions) {
        var code = conditions[conditions.length - 1];
        var value1 = conditions[1];
        var value2 = (conditions.length - 1) > 3 ? conditions[3] : null;
        for (var i = 0; i < targets.length; i++) {
            var num = this.getStatusValue(targets[i], conditions);
            if (this.checkValues(code, num, value1, value2)) { return true }
        }
        return false;
    };
    ConditionallyManager.checkEleEff = function (targets, conditions) {
        conditions = conditions.clone();
        var num = conditions.shift();
        num = num ? num : 1;
        for (var i = 0; i < targets.length; i++) {
            var count = 0;
            for (var j = 0; j < conditions.length; j++) {
                var code = conditions[j][2];
                var value = targets[i].elementRate(conditions[j][0]) * 100;
                var value1 = conditions[j][1];
                if (this.checkValues(code, value, value1)) {
                    count++;
                    if (count === num) { return true }
                }
            }
        }
        return false;
    };
    ConditionallyManager.checkStaEff = function (targets, conditions) {
        conditions = conditions.clone();
        var num = conditions.shift();
        num = num ? num : 1;
        for (var i = 0; i < targets.length; i++) {
            var count = 0;
            for (var j = 0; j < conditions.length; j++) {
                var code = conditions[j][2];
                var value = targets[i].stateRate(conditions[j][0]) * 100;
                var value1 = conditions[j][1];
                if (this.checkValues(code, value, value1)) {
                    count++;
                    if (count === num) { return true }
                }
            }
        }
        return false;

    };
    ConditionallyManager.checkSize = function (targets, conditions) {
        var code = conditions[conditions.length - 1];
        var num = null;
        var value1 = conditions[0];
        var value2 = conditions[1];
        if (targets[0].isActor()) {
            num = $gameParty.members().length;
        } else {
            num = $gameTroop.members().length;
        }
        switch (code) {
            case '上':
            case '下':
            case '内':
            case '外':
                return this.checkValues(code, num, value1, value2);
            default:
                return conditions.indexOf(num) !== -1;
        }
    };
    ConditionallyManager.checkASize = function (targets, conditions) {
        var code = conditions[conditions.length - 1];
        var num = null;
        var value1 = conditions[0];
        var value2 = conditions[1];
        if (targets[0].isActor()) {
            num = $gameParty.aliveMembers().length;
        } else {
            num = $gameTroop.aliveMembers().length;
        }
        switch (code) {
            case '上':
            case '下':
            case '内':
            case '外':
                return this.checkValues(code, num, value1, value2);
            default:
                return conditions.indexOf(num) !== -1;
        }

    };
    ConditionallyManager.checkVariable = function (targets, conditions) {
        var value = $gameVariables.value(conditions[0]);
        var code = conditions[2];
        return this.checkValues(code, value, conditions[1]);
    };
    ConditionallyManager.checkSwitch = function (targets, conditions) {
        var flag = $gameSwitches.value(conditions[0]);
        return flag === (conditions[1] === 'ON');
    };
    ConditionallyManager.checkEquip = function (targets, conditions) {
        if (!targets[0]) { return false }
        if (targets[0].isEnemy()) { return false }
        conditions = conditions.clone();
        var num = conditions.shift();
        num = num ? num : 1;
        for (var i = 0; i < targets.length; i++) {
            var count = 0;
            for (var j = 0; j < conditions.length; j++) {
                var eVar = conditions[j][0];
                var eId = conditions[j][1];
                switch (eVar) {
                    case 'W':
                    case 'w':
                        if (targets[i].isEquipped($dataWeapons[eId])) { count++ }
                        break;
                    case 'A':
                    case 'a':
                        if (targets[i].isEquipped($dataArmors[eId])) { count++ }
                        break;
                }
                if (count >= num) { return true }
            }
        }
        return false;
    };
    ConditionallyManager.checkEType = function (targets, conditions) {
        if (!targets[0]) { return false }
        if (targets[0].isEnemy()) { return false }
        var result = [];
        conditions = conditions.clone();
        var num = conditions.shift();
        num = num ? num : 1;
        for (var i = 0; i < targets.length; i++) {
            var count = 0;
            for (var j = 0; j < conditions.length; j++) {
                var eVar = conditions[j][0];
                var eId = conditions[j][1];
                switch (eVar) {
                    case 'W':
                    case 'w':
                        result = targets[i].weapons().filter(function (equip) {
                            return equip.wtypeId === eId;
                        });
                        break;
                    case 'A':
                    case 'a':
                        result = targets[i].armors().filter(function (equip) {
                            return equip.atypeId === eId;
                        });
                }
                if (result.length > 0) { count++ }
                if (count >= num) { return true }
            }
        }
        return false;

    };
    ConditionallyManager.checkClass = function (targets, conditions) {
        conditions = conditions.clone();
        var num = conditions.shift();
        num = num ? num : 1;
        var count = 0;
        for (var i = 0; i < targets.length; i++) {
            if (conditions.indexOf(targets[i]._classId) !== -1) { count++ }
            if (count >= num) { return true }
        }
        return false;
    };
    ConditionallyManager.checkMemo = function (targets, conditions) {
        var result = [];
        for (var i = 0; i < targets.length; i++) {
            result = targets[i].traitObjects().filter(function (object) {
                return object.note.match('^' + conditions);
            });
            if (result.length > 0) { return true }
        }
        return false;
    };
    ConditionallyManager.checkElement = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var finisher = this.decodeFinisher(this._dieStatus['finisher']);
        var item = this._dieStatus['item'];
        var elements = item.damage.elementId < 0 ? finisher.attackElements() : [item.damage.elementId];
        conditions = conditions.clone();
        var num = conditions.shift();
        var count = 0;
        num = isNaN(num) ? 1 : num;
        for (var i = 0; i < conditions.length; i++) {
            if (elements.indexOf(conditions[i]) >= 0) {
                count++;
                if (num === count) { return true }
            }
        }
        return false;
    };
    ConditionallyManager.decodeFinisher = function (finisher) {
        if (finisher[0]) return $gameParty.members()[finisher[1]];
        return $gameTroop.members()[finisher[1]];
    };
    ConditionallyManager.checkDamage = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var code = conditions[1];
        var num = this._dieStatus['damage'];
        var value1 = conditions[0];
        return this.checkValues(code, num, value1);
    };
    ConditionallyManager.checkLevel = function (targets, conditions) {
        var num = 0;
        var code = conditions[2];
        var value = conditions[1];
        switch (conditions[0]) {
            case '平均':
                $gameParty.members().forEach(function (member) { num += member._level });
                num /= $gameParty.members().length;
                break;
            case '最大':
                $gameParty.members().forEach(function (member) { if (num < member._level) { num = member._level } });
                break;
            case '最低':
                num = 999999;
                $gameParty.members().forEach(function (member) { if (num > member._level) { num = member._level } });
                break;
            case '討伐者':
                if (!this._dieStatus) { return false }
                num = this._dieStatus['finisher']._level;
                break;
            default:
        }
        return this.checkValues(code, num, value);
    };
    ConditionallyManager.checkNormalA = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var item = this._dieStatus['item'];
        var finisher = this.decodeFinisher(this._dieStatus['finisher']);
        var attackSkill = $dataSkills[finisher.attackSkillId()];
        var result = item === attackSkill;
        return conditions[0] === '以外' ? !result : result;
    };
    ConditionallyManager.checkSKillA = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var item = this._dieStatus['item'];
        var result = DataManager.isSkill(item);
        return conditions[0] === '以外' ? !result : result;
    };
    ConditionallyManager.checkItemA = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var item = this._dieStatus['item'];
        var result = DataManager.isItem(item);
        return conditions[0] === '以外' ? !result : result;
    };
    ConditionallyManager.checkSkill = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var skill = this._dieStatus['item'];
        conditions = conditions.clone();
        conditions.shift();
        if (DataManager.isItem(skill)) { return false }
        return conditions.indexOf(skill.id) >= 0;
    };
    ConditionallyManager.checkItem = function (targets, conditions) {
        if (!this._dieStatus) { return false }
        var item = this._dieStatus['item'];
        conditions = conditions.clone();
        conditions.shift();
        if (DataManager.isSkill(item)) { return false }
        return conditions.indexOf(item.id) >= 0;

    };
    ConditionallyManager.checkMember = function (targets, conditions) {
        conditions = conditions.clone();
        var members = $gameParty.allMembers();
        if (targets[0].isEnemy()) { members = $gameTroop.members() }
        var num = conditions.shift();
        num = num ? num : 1;
        var count = 0;
        for (var i = 0; i < members.length; i++) {
            var id = members[i].isActor() ? members[i]._actorId : members[i]._enemyId;
            if (conditions.indexOf(id) !== -1) { count++ }
            if (count >= num) { return true }
        }
        return false;
    };
    ConditionallyManager.checkBattleMember = function (targets, conditions) {
        conditions = conditions.clone();
        var members = $gameParty.battleMembers();
        if (targets[0].isEnemy()) { members = $gameTroop.members().filter(function (enemy) { return enemy.isAppeared() }) }
        var num = conditions.shift();
        num = num ? num : 1;
        var count = 0;
        for (var i = 0; i < members.length; i++) {
            var id = members[i].isActor() ? members[i]._actorId : members[i]._enemyId;
            if (conditions.indexOf(id) !== -1) { count++ }
            if (count >= num) { return true }
        }
        return false;
    };
    ConditionallyManager.checkScript = function (targets, conditions) {
        conditions = [conditions].clone();
        var a = targets;
        var v = $gameVariables._data;
        var s = $gameSwitches._data;
        return !!eval(conditions[0][0]);
    };
    ConditionallyManager.getStatusValue = function (subject, conditions) {
        switch (conditions[0]) {
            case 'Level':
            case 'Lv':
            case TextManager.basic(0):
            case TextManager.basic(1):
                return subject.isActor() ? subject._level : 0;
            case 'HP':
            case 'ＨＰ':
            case TextManager.basic(2):
            case TextManager.basic(3):
                if (conditions[2] === '') {
                    return subject.hp;
                } else {
                    return Math.floor((subject.hp / subject.mhp) * 100);
                }
            case 'MP':
            case 'ＭＰ':
            case TextManager.basic(4):
            case TextManager.basic(5):
                if (conditions[2] === '') {
                    return subject.mp;
                } else {
                    return Math.floor((subject.mp / subject.mmp) * 100);
                }
            case 'TP':
            case 'ＴＰ':
            case TextManager.basic(6):
            case TextManager.basic(7):
                return subject.tp;
            case 'EXP':
            case 'ＥＸＰ':
            case '経験値':
            case TextManager.basic(8):
            case TextManager.basic(9):
                return subject.isActor() ? subject.currentExp() : 0;
            case '最大HP':
            case '最大ＨＰ':
            case TextManager.param[0]:
                return subject.mhp;
            case '最大MP':
            case '最大ＭＰ':
            case TextManager.param[1]:
                return subject.mmp;
            case 'ATK':
            case 'ＡＴＫ':
            case '攻撃力':
            case TextManager.param[2]:
                return subject.atk;
            case 'DEF':
            case 'ＤＥＦ':
            case '防御力':
            case TextManager.param[3]:
                return subject.def;
            case 'MAT':
            case 'ＭＡＴ':
            case '魔法力':
            case TextManager.param[4]:
                return subject.mat;
            case 'MDF':
            case 'ＭＤＦ':
            case '魔法防御':
            case TextManager.param[5]:
                return subject.mdf;
            case 'AGI':
            case 'ＡＧＩ':
            case '敏捷性':
            case TextManager.param[6]:
                return subject.agi;
            case 'LUK':
            case 'ＬＵＫ':
            case '運':
            case TextManager.param[7]:
                return subject.luk;
            case 'HIT':
            case 'ＨＩＴ':
            case '命中率':
            case TextManager.param[8]:
                return Math.floor(subject.hit * 100);
            case 'EVA':
            case 'ＥＶＡ':
            case '回避率':
            case TextManager.param[9]:
                return Math.floor(subject.eva * 100);
            case 'CRI':
            case 'ＣＲＩ':
            case '会心率':
                return Math.floor(subject.cri * 100);
            case 'CEV':
            case 'ＣＥＶ':
            case '会心回避率':
                return Math.floor(subject.cev * 100);
            case 'MEV':
            case 'ＭＥＶ':
            case '魔法回避率':
                return Math.floor(subject.mev * 100);
            case 'MRF':
            case 'ＭＲＦ':
            case '魔法反射率':
                return Math.floor(subject.mrf * 100);
            case 'CNT':
            case 'ＣＮＴ':
            case '反撃率':
                return Math.floor(subject.cnt * 100);
            case 'HRG':
            case 'ＨＲＧ':
            case 'HP再生率':
            case 'ＨＰ再生率':
                return Math.floor(subject.hrg * 100);
            case 'MRG':
            case 'ＭＲＧ':
            case 'MP再生率':
            case 'ＭＰ再生率':
                return Math.floor(subject.mrg * 100);
            case 'TRG':
            case 'ＴＲＧ':
            case 'TP再生率':
            case 'ＴＰ再生率':
                return Math.floor(subject.trg * 100);
            case 'TGR':
            case 'ＴＧＲ':
            case '狙われ率':
                return Math.floor(subject.tgr * 100);
            case 'GRD':
            case 'ＧＲＤ':
            case '防御効果率':
                return Math.floor(subject.grd * 100);
            case 'REC':
            case 'ＲＥＣ':
            case '回復効果率':
                return Math.floor(subject.rec * 100);
            case 'PHA':
            case 'ＰＨＡ':
            case '薬の知識':
                return Math.floor(subject.pha * 100);
            case 'MCR':
            case 'ＭＣＲ':
            case 'MP消費率':
            case 'ＭＰ消費率':
                return Math.floor(subject.mcr * 100);
            case 'TCR':
            case 'ＴＣＲ':
            case 'TPチャージ率':
            case 'ＴＰチャージ率':
                return Math.floor(subject.tcr * 100);
            case 'PDR':
            case 'ＰＤＲ':
            case '物理ダメージ率':
                return Math.floor(subject.pdr * 100);
            case 'MDR':
            case 'ＭＤＲ':
            case '魔法ダメージ率':
                return Math.floor(subject.mdr * 100);
            case 'FDR':
            case 'ＦＤＲ':
            case '床ダメージ率':
                return Math.floor(subject.fdr * 100);
            case 'EXR':
            case 'ＥＸＲ':
            case '経験値獲得率':
                return Math.floor(subject.exr * 100);
            default:
                return 0;
        }
    };

    BattleManager.ccTurnCount = function (turn) {
        return this.isInputting() ? ($gameTroop._turnCount + 1) : $gameTroop._turnCount;
    };

    var _CnC_GAction_repeatTargets = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function (targets) {
        BattleManager._lastTargets = targets;
        return _CnC_GAction_repeatTargets.call(this, targets);
    };

    var _CnC_GAction_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        this.subject()._lastDamage += value;
        _CnC_GAction_executeDamage.call(this, target, value);
    };

    var _CnC_BManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        _CnC_BManager_startAction.call(this);
        this._subject._lastDamage = 0;
        this._lastAction = this._subject.currentAction();
    };

}());