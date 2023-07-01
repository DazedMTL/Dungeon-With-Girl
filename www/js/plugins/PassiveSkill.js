//
//  パッシブスキル ver1.061
//
// author yana
//

var Imported = Imported || {};
Imported['yPassiveSkill'] = 1.061;

/*:
 * @plugindesc ver1.061/スキルに特徴を設定できるようにします。
 * @author Yana
 * 
 * @param Passive Skill Type ID
 * @desc パッシブスキルとして扱うスキルタイプID。
 * ここで設定されたIDのスキルタイプは、戦闘時に表示されません。
 * @default 3
 * 
 * @param Add Multi Order
 * @desc パラメータの加算と乗算の順番。
 * trueだと加算→乗算、falseだと乗算→加算になります。
 * @default true
 *
 * @help------------------------------------------------------
 *  プラグインコマンドはありません。
 * ------------------------------------------------------
 * ------------------------------------------------------
 * 設定方法
 * ------------------------------------------------------
 * ・攻撃力や最大HP等のパラメータが1つのパッシブスキルの設定
 * <パッシブスキル:xxx+y>
 * <パッシブスキル:xxx-y>
 * <パッシブスキル:xxx+y%>
 * <パッシブスキル:xxx-y%>
 * <パッシブスキル:xxxy>
 * xxxのステータスをyポイント(%)増加(減少)させます。
 * ※最大HP、最大MP、攻撃力、防御力、魔法力、魔法防御、敏捷性、運の通常のパラメータのいずれかの場合、
 * %が付いていない時はその数値通りの値が適用されます。
 * %が付いている時は、その数値に100を加算し、算出した数値を通常の特徴で設定した時と同じように適用します。
 * 
 * ※命中率、回避率、会心率、会心回避、魔法回避、魔法反射、反撃率、HP再生率、MP再生率、
 * 	TP再生率の等のExパラメータのいずれかの場合、
 * %が付いている時と%がついてない時の動作は同じになります。
 * 
 * ※狙われ率、防御効果率、回復効果率、薬の知識、MP消費率、TPチャージ率、物理ダメージ率、
 * 	 魔法ダメージ率、床ダメージ率、経験値獲得率等ののSPパラメータのいずれかの場合、
 * %が付いていない時はその数値通りの値が適用されます。
 * %が付いている時は、その数値に100を加算し、算出した数値を通常の特徴で設定した時と同じように適用します。
 * 
 * ※ステート無効化、攻撃時属性、攻撃速度補正、攻撃追加回数、スキルタイプ追加、スキルタイプ封印、スキル追加、
 * スキル封印、武器タイプ装備、防具タイプ装備、装備固定、装備封印、行動回数追加　のいずれかの場合も、これで設定します。
 * これらは%が付いていても付いていなくても同じです。
 * 
 * 例：
 * <パッシブスキル:最大HP+50>
 * 最大HPが50ポイント増加します。
 * 
 * <パッシブスキル:攻撃力+20%>
 * 特徴、攻撃力120%と同じ意味です。
 * 
 * <パッシブスキル:命中率+20%>
 * <パッシブスキル:命中率+20>
 * 特徴、命中率+20%と同じ意味です。
 * 
 * <パッシブスキル:狙われ率+30>
 * 狙われ率が30%増加します。
 * 
 * <パッシブスキル:狙われ率+30%>
 * 特徴、狙われ率130%と同じ意味です。
 * 
 * <パッシブスキル:ステート無効化5>
 * 特徴、ステート無効化5番のステートと同じ意味です。
 * 
 * <パッシブスキル:行動回数追加+20%>
 * 特徴、行動回数追加20%と同じ意味です。
 * 
 * ・属性有効度やステート有効度などのパラメータが2つのパッシブスキルの設定
 * <パッシブスキル:xxxy+z>
 * <パッシブスキル:xxxy―z>
 * <パッシブスキル:xxxy+z%>
 * <パッシブスキル:xxxy―z%>
 * xxxのy番のレートをz(%)増加(減少)します。
 * ※属性有効度、弱体有効度、ステート有効度のいずれかの場合、
 * %が付いていない時は、その数値の値を直接加算(減算)します。
 * %が付いている時は、その数値に100を加算し、算出した数値を通常の特徴で設定した時と同じように適用します。
 * 
 * ※攻撃時ステートの場合、%が付いていても付いていなくても同じです。
 * 
 * 例:
 * <パッシブスキル:属性有効度4-30%>
 * 特徴、属性有効度4番の属性70%と同じ意味です。
 * 
 * <パッシブスキル:属性有効度4-30>
 * 4番の属性の属性有効度を30%減少させます。
 * 
 * ・二刀流や自動戦闘など、パラメータを持たないパッシブスキルの設定
 * <パッシブスキル:xxx>
 * xxxの特徴を付与します。
 * 
 * 例:
 * <パッシブスキル:二刀流>
 * 特徴、スロットタイプ二刀流と同じ意味です。
 * 
 * <パッシブスキル:自動戦闘>
 * 特徴、特殊フラグ自動戦闘と同じ意味です。
 * 
 * ------------------------------------------------------
 * 仕様と解説
 * ------------------------------------------------------
 * ・特徴で追加されたスキルはパッシブスキルとして機能しません。
 * ・AddMultiOrderがtrueだと、加算の計算→乗算の計算となるので、攻撃力100で攻撃力+50と攻撃力+50%の特徴を持っていた場合、
 * (100+50)x1.5=225となります。
 * falseの場合は、乗算→加算と計算されるので、
 * 100x1.5+50=200となります。
 * ・対応するスキルタイプが封印されたり、パッシブスキル自体が封印された場合、そのスキルは効果がなくなります。
 * ・必要武器タイプが設定されていた場合、それらの条件を満たしていないとそのスキルは効果がなくなります。
 * ・PassiveSkillTypeIDで指定したスキルタイプでないとパッシブスキルとして機能しない、という事はありません。
 * ・PassiveSkillTypeIDはあくまで、戦闘中に表示しないスキルタイプのIDというのみです。
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.061:
 * ステータスクラス+クラスチェンジシーンと併用時、レベルアップ時に無限ループに入ってしまうバグを修正。
 * ver1.06:
 * イベントコマンドでスキルを習得した際、パッシブスキルが反映されないバグを修正。
 * ver1.051:
 * console.logを削除。
 * ver1.05:
 * いくつかの記述ミスを修正。
 * 機能していなかったプラグインパラメータを削除。
 * ver1.04:
 * 最大MPのキーワードが間違っていたバグを修正。
 * システムで設定した用語でのパッシブスキル化が正常に機能していなかったバグを修正。
 * ver1.03:
 * 特徴を持っていないスキルもパッシブスキルとして判定されていたバグを修正。
 * sparamの数値が100%基準になっていなかったバグを修正。
 * ver1.02:
 * PassiveSkillManagerをfunctionの外に移動
 * ver1.01:
 * パッシブスキルのスキルタイプが一番上に追加されていると、正常に非表示にできないバグを修正。
 * ver1.00:
 * 公開
 */

function PassiveSkillManager() {
	throw new Error('This is a static class');
};

(function () {

	var parameters = PluginManager.parameters('PassiveSkill');
	var passiveSkillTypeId = Number(parameters['Passive Skill Type ID']);
	var addMultiOrder = String(parameters['Add Multi Order']) === 'true';

	PassiveSkillManager.checkPassive = function (text) {
		if (text.match(/<(?:パッシブスキル|パッシブ|passive|PS):(.+)>/)) {
			var reg = RegExp.$1;
			var trait = this.makePassive('<' + reg + '>');
			if (trait) { return trait }
		}
		return false;
	};

	PassiveSkillManager.makePassive = function (reg) {
		if (reg.match(/<(.+?)(\d+),?([+-]\d+)(%)?>/)) {
			return this.makeNumTrait([RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4]);
		} else if (reg.match(/<(.+?),?([+-]?\d+)(%)?>/)) {
			return this.makeParamTrait([RegExp.$1, RegExp.$2, RegExp.$3]);
		} else if (reg.match(/<(.+)>/)) {
			return this.makeExTrait(RegExp.$1);
		}

		return false;
	};

	PassiveSkillManager.makeNumTrait = function (ary) {
		var code = null;
		var id = parseInt(ary[1]);
		var value = parseInt(ary[2]);
		var parc = ary[3];
		switch (ary[0]) {
			case '属性有効度':
			case 'ElementRate':
				code = parc == '' ? 111 : 11;
				break;
			case '弱体有効度':
			case 'DebuffRate':
				code = parc == '' ? 112 : 12;
				break;
			case 'ステート有効度':
			case 'StateRate':
				code = parc == '' ? 113 : 13;
				break;
			case '攻撃時ステート':
			case 'AttackState':
				code = 32;
				break;
		}
		if (code === null) { return false }
		value = (value / 100);
		if (code < 100) { value += 1 }
		return { 'code': code, 'dataId': id, 'value': value };
	};

	PassiveSkillManager.makeParamTrait = function (ary) {
		var code = null;
		var id = null;
		var value = parseInt(ary[1]);
		var parc = ary[2];
		switch (ary[0]) {
			// param
			case '最大HP':
			case '最大ＨＰ':
			case TextManager.basic(2):
			case TextManager.basic(3):
			case TextManager.param(0):
				id = 0;
				code = parc == '' ? 121 : 21;
				break;
			case '最大MP':
			case '最大ＭＰ':
			case TextManager.basic(4):
			case TextManager.basic(5):
			case TextManager.param(1):
				id = 1;
				code = parc == '' ? 121 : 21;
				break;
			case 'ATK':
			case 'ＡＴＫ':
			case '攻撃力':
			case TextManager.param(2):
				id = 2;
				code = parc == '' ? 121 : 21;
				break;
			case 'DEF':
			case 'ＤＥＦ':
			case '防御力':
			case TextManager.param(3):
				id = 3;
				code = parc == '' ? 121 : 21;
				break;
			case 'MAT':
			case 'ＭＡＴ':
			case '魔法力':
			case TextManager.param(4):
				id = 4;
				code = parc == '' ? 121 : 21;
				break;
			case 'MDF':
			case 'ＭＤＦ':
			case '魔法防御':
			case TextManager.param(5):
				id = 5;
				code = parc == '' ? 121 : 21;
				break;
			case 'AGI':
			case 'ＡＧＩ':
			case '敏捷性':
			case TextManager.param(6):
				id = 6;
				code = parc == '' ? 121 : 21;
				break;
			case 'LUK':
			case 'ＬＵＫ':
			case '運':
			case TextManager.param(7):
				id = 7;
				code = parc == '' ? 121 : 21;
				break;
			// xparams
			case 'HIT':
			case 'ＨＩＴ':
			case '命中率':
			case TextManager.param(8):
				id = 0;
				code = 22;
				break;
			case 'EVA':
			case 'ＥＶＡ':
			case '回避率':
				id = 1;
				code = 22;
				break;
			case TextManager.param(9):
			case 'CRI':
			case 'ＣＲＩ':
			case '会心率':
				id = 2;
				code = 22;
				break;
			case 'CEV':
			case 'ＣＥＶ':
			case '会心回避率':
				id = 3;
				code = 22;
				break;
			case 'MEV':
			case 'ＭＥＶ':
			case '魔法回避率':
				id = 4;
				code = 22;
				break;
			case 'MRF':
			case 'ＭＲＦ':
			case '魔法反射率':
				id = 5;
				code = 22;
				break;
			case 'CNT':
			case 'ＣＮＴ':
			case '反撃率':
				id = 6;
				code = 22;
				break;
			case 'HRG':
			case 'ＨＲＧ':
			case 'HP再生率':
			case 'ＨＰ再生率':
				id = 7;
				code = 22;
				break;
			case 'MRG':
			case 'ＭＲＧ':
			case 'MP再生率':
			case 'ＭＰ再生率':
				id = 8;
				code = 22;
				break;
			case 'TRG':
			case 'ＴＲＧ':
			case 'TP再生率':
			case 'ＴＰ再生率':
				id = 9;
				code = 22;
				break;
			//sparams
			case 'TGR':
			case 'ＴＧＲ':
			case '狙われ率':
				id = 0;
				code = parc == '' ? 123 : 23;
				break;
			case 'GRD':
			case 'ＧＲＤ':
			case '防御効果率':
				id = 1;
				code = parc == '' ? 123 : 23;
				break;
			case 'REC':
			case 'ＲＥＣ':
			case '回復効果率':
				id = 2;
				code = parc == '' ? 123 : 23;
				break;
			case 'PHA':
			case 'ＰＨＡ':
			case '薬の知識':
				id = 3;
				code = parc == '' ? 123 : 23;
				break;
			case 'MCR':
			case 'ＭＣＲ':
			case 'MP消費率':
			case 'ＭＰ消費率':
				id = 4;
				code = parc == '' ? 123 : 23;
				break;
			case 'TCR':
			case 'ＴＣＲ':
			case 'TPチャージ率':
			case 'ＴＰチャージ率':
				id = 5;
				code = parc == '' ? 123 : 23;
				break;
			case 'PDR':
			case 'ＰＤＲ':
			case '物理ダメージ率':
				id = 6;
				code = parc == '' ? 123 : 23;
				break;
			case 'MDR':
			case 'ＭＤＲ':
			case '魔法ダメージ率':
				id = 7;
				code = parc == '' ? 123 : 23;
				break;
			case 'FDR':
			case 'ＦＤＲ':
			case '床ダメージ率':
				id = 8;
				code = parc == '' ? 123 : 23;
				break;
			case 'EXR':
			case 'ＥＸＲ':
			case '経験値獲得率':
				id = 9;
				code = parc == '' ? 123 : 23;
				break;
			//その他
			case 'ステート無効化':
			case 'StateResist':
				id = value;
				code = 14;
				break;
			case '攻撃時属性':
			case 'AttackElement':
				id = value;
				code = 31;
				break;
			case '攻撃速度補正':
			case 'AttackSpeed':
				id = value;
				code = 33;
				break;
			case '攻撃追加回数':
			case 'AttackTimes+':
				id = value;
				code = 34;
				break;
			case 'スキルタイプ追加':
			case 'AddSkillType':
				id = value;
				code = 41;
				break;
			case 'スキルタイプ封印':
			case 'SealSkillType':
				id = value;
				code = 42;
				break;
			case 'スキル追加':
			case 'AddSkill':
				id = value;
				code = 43;
				break;
			case 'スキル封印':
			case 'SealSkill':
				id = value;
				code = 44;
				break;
			case '武器タイプ装備':
			case 'EquipWeapon':
				id = value;
				code = 51;
				break;
			case '防具タイプ装備':
			case 'EquipArmor':
				id = value;
				code = 52;
				break;
			case '装備固定':
			case 'LockEquip':
				id = value;
				code = 53;
				break;
			case '装備封印':
			case 'SealEquip':
				id = value;
				code = 54;
				break;
			case '行動回数追加':
			case 'ActionTime+':
				id = value;
				code = 61;
				break;
			default:
		}
		if (code === null) { return false }
		if ((code > 20 && code < 30) || (code === 123)) { value = (value / 100) }
		if (code === 21) { value += 1 }
		if (code === 23) { value += 1 }
		return { 'code': code, 'dataId': id, 'value': value };
	};

	PassiveSkillManager.makeExTrait = function (reg) {
		var code = null;
		var id = null;
		var value = 1;
		switch (reg) {
			case '二刀流':
			case 'DualWield':
				code = 55;
				id = 1;
				break;
			case '自動戦闘':
			case 'AutoBattle':
				code = 62;
				id = 0;
				break;
			case '防御':
			case 'Guard':
				code = 62;
				id = 1;
				break;
			case '身代わり':
			case 'Substitute':
				code = 62;
				id = 2;
				break;
			case 'TP持ち越し':
			case 'PreserveTP':
				code = 62;
				id = 3;
				break;
			case 'エンカウント半減':
			case 'EncounterHalf':
				code = 64;
				id = 0;
				break;
			case 'エンカウント無効':
			case 'EncounterNone':
				code = 64;
				id = 1;
				break;
			case '不意打ち無効':
			case 'CancelSurprise':
				code = 64;
				id = 2;
				break;
			case '先制攻撃率アップ':
			case 'RaisePreemptive':
				code = 64;
				id = 3;
				break;
			case '獲得金額二倍':
			case '獲得金額2倍':
			case '獲得金額２倍':
			case 'GoldDouble':
				code = 64;
				id = 4;
				break;
			case 'アイテム入手率二倍':
			case 'アイテム入手率2倍':
			case 'アイテム入手率２倍':
			case 'ItemDropDouble':
				code = 64;
				id = 5;
				break;
			default:
		}
		if (code === null) { return false }
		return { 'code': code, 'dataId': id, 'value': value };
	};

	PassiveSkillManager.initPassiveSkill = function (skill) {
		if (skill.traits) { return }
		skill.traits = [];
		var texts = skill.note.split('\n');
		for (var i = 0; i < texts.length; i++) {
			var trait = this.checkPassive(texts[i]);
			if (trait) { skill.traits.push(trait) }
		}
	};

	var _pS_GActor_traitObjects = Game_Actor.prototype.traitObjects;
	Game_Actor.prototype.traitObjects = function () {
		var objects = _pS_GActor_traitObjects.call(this);
		if (this.traitNest) { return objects }
		this.traitNest = true;
		this.enableSkills().forEach(function (skill) {
			PassiveSkillManager.initPassiveSkill(skill);
			if (skill.traits.length > 0) { objects.push(skill) }
		}, this);
		this.traitNest = false;
		return objects;
	};

	var _pS_GBBase_addedSkillTypes = Game_BattlerBase.prototype.addedSkillTypes;
	Game_BattlerBase.prototype.addedSkillTypes = function () {
		var types = _pS_GBBase_addedSkillTypes.call(this);
		if (!$gameParty.inBattle()) { return types }
		var id = types.indexOf(passiveSkillTypeId);
		if (id >= 0) { types.splice(id, 1) }
		return types;
	};

	Game_Actor.prototype.enableSkills = function () {
		if (this._enableSkills && !this._passiveRefresh) {
			return this._enableSkills.reduce(function (r, id) { return r.concat([$dataSkills[id]]) }, []);
		}
		this._enableSkills = [];
		this._skills.forEach(function (skillId) {
			var skill = $dataSkills[skillId];
			if (this.isUsableSkill(skill)) { this._enableSkills.push(skill.id) }
		}, this);
		this._passiveRefresh = false;
		return this._enableSkills.reduce(function (r, id) { return r.concat([$dataSkills[id]]) }, []);
	};

	var _pS_GActor_refresh = Game_Actor.prototype.refresh;
	Game_Actor.prototype.refresh = function () {
		this._passiveRefresh = true;
		_pS_GActor_refresh.call(this);
	};

	var _pS_GActor_learnSkill = Game_Actor.prototype.learnSkill;
	Game_Actor.prototype.learnSkill = function (skillId) {
		_pS_GActor_learnSkill.call(this, skillId);
		if (!Imported['VXandAceHybridClass']) this.refresh();
	};

	Game_Actor.prototype.isUsableSkill = function (skill) {
		return (this.isSkillWtypeOk(skill) && !this.isSkillSealed(skill.id) &&
			!this.isSkillTypeSealed(skill.stypeId));
	};

	Game_Party.prototype.refreshSkills = function () {
		this.members().forEach(function (actor) {
			actor._passiveRefresh = true;
		})
	};

	var _pS_BManager_startInput = BattleManager.startInput;
	BattleManager.startInput = function () {
		$gameParty.refreshSkills();
		_pS_BManager_startInput.call(this);
	};

	if (addMultiOrder) {
		var _pS_GBBase_paramPlus = Game_BattlerBase.prototype.paramPlus;
		Game_BattlerBase.prototype.paramPlus = function (paramId) {
			var pr = _pS_GBBase_paramPlus.call(this, paramId);
			pr += this.traitsSum(121, paramId);
			return pr;
		};

		var _pS_GBBase_sparam = Game_BattlerBase.prototype.sparam;
		Game_BattlerBase.prototype.sparam = function (paramId) {
			var pr = this.traitsSum(123, paramId) + 1.0;
			pr *= _pS_GBBase_sparam.call(this, paramId);
			return pr;
		}

		var _pS_GBBase_elementRate = Game_BattlerBase.prototype.elementRate;
		Game_BattlerBase.prototype.elementRate = function (elementId) {
			var rate = this.traitsSum(111, elementId) + 1.0;
			rate *= _pS_GBBase_elementRate.call(this, elementId);
			return rate;
		}

		var _pS_GBBase_debuffRate = Game_BattlerBase.prototype.debuffRate;
		Game_BattlerBase.prototype.debuffRate = function (debuffId) {
			var rate = this.traitsSum(112, debuffId) + 1.0;
			rate *= _pS_GBBase_debuffRate.call(this, debuffId);
			return rate;
		}

		var _pS_GBBase_stateRate = Game_BattlerBase.prototype.stateRate;
		Game_BattlerBase.prototype.stateRate = function (stateId) {
			var rate = this.traitsSum(113, stateId) + 1.0;
			rate *= _pS_GBBase_stateRate.call(this, stateId);
			return rate;
		}

	} else {
		var _pS_GBBase_param = Game_BattlerBase.prototype.param;
		Game_BattlerBase.prototype.param = function (paramId) {
			var pr = _pS_GBBase_param.call(this, paramId);
			pr += this.traitsSum(121, paramId);
			var maxValue = this.paramMax(paramId);
			var minValue = this.paramMin(paramId);
			return Math.round(pr.clamp(minValue, maxValue));
		};

		var _pS_GBBase_sparam = Game_BattlerBase.prototype.sparam;
		Game_BattlerBase.prototype.sparam = function (paramId) {
			var pr = _pS_GBBase_sparam.call(this, paramId);
			pr += this.traitsSum(123, paramId) + 1.0;
			return pr;
		}

		var _pS_GBBase_elementRate = Game_BattlerBase.prototype.elementRate;
		Game_BattlerBase.prototype.elementRate = function (elementId) {
			var rate = _pS_GBBase_elementRate.call(this, elementId);
			rate += this.traitsSum(111, elementId) + 1.0;
			return rate;
		}

		var _pS_GBBase_debuffRate = Game_BattlerBase.prototype.debuffRate;
		Game_BattlerBase.prototype.debuffRate = function (debuffId) {
			var rate = _pS_GBBase_debuffRate.call(this, debuffId);
			rate += this.traitsSum(112, debuffId) + 1.0;
			return rate;
		}

		var _pS_GBBase_stateRate = Game_BattlerBase.prototype.stateRate;
		Game_BattlerBase.prototype.stateRate = function (stateId) {
			var rate = _pS_GBBase_stateRate.call(this, stateId);
			rate += this.traitsSum(113, stateId) + 1.0;
			return rate;
		}
	}
}());
