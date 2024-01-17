-(
  //=============================================================================
  // Ricon_RandomItemLose.js
  // Version: 1.0.1
  //----------------------------------------------------------------------------
  // Copyright (c) 2019 Ricon
  // Released under the MIT license
  // http://opensource.org/licenses/mit-license.php
  //----------------------------------------------------------------------------
  // Versions
  // 2.0.0 2020/01/05 記述方法をECMA6に対応、最大値・最小値設定の不具合を修正
  // 1.0.1 2019/02/11 SE設定を行わないとエラーが出る不具合を修正
  // 1.0.0 2019/02/07 初版
  //----------------------------------------------------------------------------
  // [Website] https://riceconstruction.weebly.com/
  // [GitHub] https://github.com/RiceConstruction/
  // [Twitter] https://twitter.com/riceconstr/
  // [Fantia] https://fantia.jp/rice-construction/
  //=============================================================================

  /*:
   * @plugindesc アイテムのランダム消失プラグイン
   * @author べるろ＊(Ricon)
   *
   * @help プラグインコマンドを呼び出した際に持ち物をランダムで失います。
   *
   * 消失する所持品の範囲を決定するものは
   * プラグインパラメータ
   * メタタグ<RandomLoseException>
   * コマンド「RandomLose」
   * コマンド「RandomLoseSetting」
   * の4要素があり、
   * <RandomLoseException> ＞ RandomLoseSetting ＞ パラメータ ＞ RandomLose
   * の順に優先度が高くなります。
   * つまり、RandomLoseでアイテム・武器・防具のすべてを対象としていても
   * 他の要素で除外されている所持品は対象外となります。
   *
   * ----------------------------------------------------------------------------
   * メタタグ
   *
   * <RandomLoseException>
   * このタグを記入したアイテムはランダム消失の対象から除外します。
   * 記入場所：アイテム・武器・防具のメモ欄
   *
   * ----------------------------------------------------------------------------
   * プラグインコマンド
   *
   * RandomLose 対象 固定値
   * 所持品をランダムに消失させます。
   * 対象にコードを入れることで、消失させるアイテムの範囲を限定させることが可能です。
   * 対象コードを入力した状態で固定値を入力すると、パラメータの値を無視して
   * 消失するアイテムの合計数を変更することができます。
   *  対象コード：
   *      ALL(アイテム・武器・防具) ← パラメータの設定と同じ
   *      ITEM(アイテムのみ)
   *      WEAPON(武器のみ)
   *      ARMOR(防具のみ)
   *      EQUIP(武器・防具のみ)
   *  例：
   *      RandomLose ⇒ 通常の設定に従ってアイテムを消失
   *      RandomLose WEAPON 3 ⇒ 所持している武器を合計3つ消失
   *
   *
   * RandomLoseSetting IncludeItems on/off
   * 消失対象に一般アイテムを含むかどうかを変更します。
   * onなら含み、offなら除外します。
   * 大事なものを含めるならばこのパラメータと下記IncludeImportantsの
   * 両方をonにしてください。
   * on/off部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting IncludeWeapons on/off
   * 消失対象に武器を含むかどうかを変更します。
   * onなら含み、offなら除外します。
   * パーティメンバーが装備中の武器も含める場合はこのパラメータと
   * 下記IncludeEquipsの両方をonにしてください。
   * on/off部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting IncludeAromors on/off
   * 消失対象に防具を含むかどうかを変更します。
   * onなら含み、offなら除外します。
   * パーティメンバーが装備中の防具も含める場合はこのパラメータと
   * 下記IncludeEquipsの両方をonにしてください。
   * on/off部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting IncludeImportants on/off
   * 消失対象に大事なものを含むかどうかを変更します。
   * onなら含み、offなら除外します。
   * on/off部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting IncludeEquips on/off
   * 消失対象に装備品を含むかどうかを変更します。
   * onなら含み、offなら除外します。
   * on/off部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting MinCount 数値
   * ランダムで消失させるアイテム総数の最小値を設定します。
   * 数値には0以上の整数を入力してください。
   * 数値部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting MaxCount 数値
   * ランダムで消失させるアイテム総数の最大値を設定します。
   * 数値には0以上の整数を入力してください。
   * 数値部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting VariousItems on/off
   * 消失させるアイテムを複数種類にするかを変更できます。
   * ランダムで消失させるアイテムの総数がNのとき
   * この設定がonならば複数のアイテムを合計N個消失し、
   * offならば1つのアイテムをN個消失します。
   * on/off部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting Message 文字列
   * 消失時に表示するメッセージを文字列部分に入力した文に変更します。
   * %1が消失するアイテム名、%2が消失する個数、%3がパーティ先頭のアクター名に対応します。
   * \nを入れるとその部分で改行します。
   * 文字列部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting Sound Name ファイル名
   * 消失時に再生するSEをファイル名部分に入力したSEファイルに変更します。
   * ファイル名部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting Sound Volume 数値
   * 消失時に再生するSEの音量を数値部分に入れた値に変更します。
   * 数値部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting Sound Pitch 数値
   * 消失時に再生するSEのピッチを数値部分に入れた値に変更します。
   * 数値部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * RandomLoseSetting Sound Pan 数値
   * 消失時に再生するSEの位相を数値部分に入れた値に変更します。
   * 数値部分にdefaultと入力するとパラメータで設定した初期値に戻ります。
   *
   * ----------------------------------------------------------------------------
   * このプラグインは他のトランジション変更プラグインと併用することは出来ません。
   *
   * @param IncludeItems
   * @type boolean
   * @on 有効
   * @off 無効
   * @default true
   * @desc 消失するものに一般アイテムを含む
   * デフォルト：on(有効)
   *
   * @param IncludeWeapons
   * @type boolean
   * @on 有効
   * @off 無効
   * @default false
   * @desc 消失するものに武器を含む
   * デフォルト：off(無効)
   *
   * @param IncludeArmors
   * @type boolean
   * @on 有効
   * @off 無効
   * @default false
   * @desc 消失するものに防具を含む
   * デフォルト：off(無効)
   *
   * @param IncludeImportants
   * @type boolean
   * @on 有効
   * @off 無効
   * @default false
   * @desc 消失するものに大事なものを含む
   * デフォルト：off(無効)
   *
   * @param IncludeEquips
   * @type boolean
   * @on 有効
   * @off 無効
   * @default false
   * @desc 消失するものに装備品を含む
   * デフォルト：off(無効)
   *
   * @param MinCount
   * @type number
   * @min 0
   * @default 1
   * @desc 消失する所持品の総数の最小値
   * デフォルト：1
   *
   * @param MaxCount
   * @type number
   * @min 0
   * @default 3
   * @desc 消失する所持品の総数の最大値
   * デフォルト：3
   *
   * @param VariousItems
   * @type boolean
   * @on 有効
   * @off 無効
   * @default false
   * @desc 消失するアイテムが複数種類になることを許可
   * デフォルト：off(無効)
   *
   * @param Message
   * @type string
   * @default %1を%2個失った。
   * @desc アイテム消失時に表示するメッセージ
   * 使用可能な記号：%1(アイテム名)、%2(消失数)、%3(先頭アクター)
   *
   * @param Sound
   * @type struct<sound>
   * @desc アイテム消失時に再生するSEの設定
   *
   */
  /*~struct~sound:
   * @param name
   * @type file
   * @require 1
   * @dir audio/se
   * @desc SEファイル
   * @default
   * @param volume
   * @type number
   * @min 0
   * @max 100
   * @default 90
   * @desc SEの音量
   * @param pitch
   * @type number
   * @min 50
   * @max 150
   * @default 100
   * @desc SEのピッチ
   * @param pan
   * @type number
   * @min -100
   * @max 100
   * @default 0
   * @desc SEの位相
   */

  "use strict"
);

/**
 * @class
 * @classdesc アイテムのランダム消失プラグイン
 */
class Ricon_RandomItemLose {
  /**
   * @constructor
   * @param {Object} gameParams ゲーム内プラグインパラメータ
   */
  constructor(gameParams) {
    const _getParam = this.getParam.bind(this);
    const _getParamBoolean = this.getParamBoolean.bind(this);
    const _getParamNumber = this.getParamNumber.bind(this);
    const _getParamString = this.getParamString.bind(this);
    const _parseJson = this.parseJson.bind(this);
    class _GameParams {
      constructor() {
        /**
         * @type {boolean} 消失するものに一般アイテムを含む
         */
        this.includeItems = _getParamBoolean("IncludeItems");
        /**
         * @type {boolean} 消失するものに武器を含む
         */
        this.includeWeapons = _getParamBoolean("IncludeWeapons");
        /**
         * @type {boolean} 消失するものに防具を含む
         */
        this.includeArmors = _getParamBoolean("IncludeArmors");
        /**
         * @type {boolean} 消失するものに大事なものを含む
         */
        this.includeImportants = _getParamBoolean("IncludeImportants");
        /**
         * @type {boolean} 消失するものに装備品を含む
         */
        this.includeEquips = _getParamBoolean("IncludeEquips");
        /**
         * @type {number} 消失する所持品の総数の最小値
         */
        this.minCount = _getParamNumber("MinCount");
        /**
         * @type {number} 消失する所持品の総数の最大値
         */
        this.maxCount = _getParamNumber("MaxCount");
        /**
         * @type {boolean} 消失するアイテムが複数種類になることを許可
         */
        this.variousItems = _getParamBoolean("VariousItems");
        /**
         * @type {string} アイテム消失時に表示するメッセージ
         */
        this.message = _getParamString("Message");
        /**
         * @type {Object} アイテム消失時に再生するSEの設定
         */
        this.sound = _parseJson(_getParam("Sound"));
      }
    }
    /**
     * @type {_GameParams} ゲーム内パラメータ
     */
    this.gameParams = gameParams || new _GameParams();
    class PartyItemData {
      /**
       * @param {IDataAllItem} data
       * @param {number} value
       */
      constructor(data, value) {
        /**
         * @type {IDataAllItem}
         */
        this.data = data;
        /**
         * @type {number}
         */
        this.value = value;
      }
    }
    class PartyItemList {
      constructor() {
        /**
         * @type {Array<PartyItemData>}
         */
        this.list = new Array();
      }
      init() {
        this.list = new Array();
      }
      /**
       * @param {IDataAllItem} data
       * @param {number} value
       */
      set(data, value) {
        if (value <= 0) return;
        this.list.push(new PartyItemData(data, value));
      }
      get() {
        return this.list.filter(function (partyItemData) {
          return !!partyItemData && !!partyItemData.data;
        });
      }
      take(index, value) {
        const itemData = this.list[index];
        if (itemData.value <= value) {
          return this.list.splice(index, 1)[0];
        } else {
          itemData.value -= value;
          return new PartyItemData(itemData.data, value);
        }
      }
      size() {
        return this.list.length;
      }
    }
    /**
     * 各種アイテムリスト
     */
    this.lists = {
      /**
       * @type {Map<string, number>} 一般アイテムリスト
       */
      items: new Map(),
      /**
       * @type {Map<string, number>} 武器リスト
       */
      weapons: new Map(),
      /**
       * @type {Map<string, number>} 防具リスト
       */
      armors: new Map(),
      /**
       * @type {PartyItemList} 消失対象アイテムリスト
       */
      targets: new PartyItemList(),
      /**
       * @type {PartyItemList} 消失アイテムリスト
       */
      loses: new PartyItemList(),
    };
  }
  /**
   * @param {string} paramName プラグインパラメータ名
   * @returns {string} プラグインパラメータ(未返還)
   */
  getParam(paramName) {
    /**
     * @type {PluginParameters} プラグインパラメータ・オブジェクト
     */
    const params = PluginManager.parameters("Ricon_RandomItemLose");
    return params[paramName];
  }
  /**
   * @param {string} paramName プラグインパラメータ名
   * @returns {boolean} プラグインパラメータ(真偽値変換済み)
   */
  getParamBoolean(paramName) {
    return ["ON", "TRUE"].includes(
      (this.getParam(paramName) || "").toUpperCase()
    );
  }
  /**
   * @param {string} paramName プラグインパラメータ名
   * @returns {number} プラグインパラメータ(数値変換済み)
   */
  getParamNumber(paramName) {
    return (parseInt(this.getParam(paramName), 10) || 0).clamp(
      -Infinity,
      Infinity
    );
  }
  /**
   * @param {string} paramName プラグインパラメータ名
   * @returns {string} プラグインパラメータ(文字列変換済み)
   */
  getParamString(paramName) {
    return String(this.getParam(paramName));
  }
  /**
   * @desc JSONのオブジェクト化
   * @param {Object} obj プラグインパラメータ名
   * @returns {Object} オブジェクト
   */
  parseJson(obj) {
    return JSON.parse(
      JSON.stringify(obj, function (key, value) {
        try {
          return JSON.parse(value || null);
        } catch (e) {
          return value;
        }
      })
    );
  }
  /**
   * @returns {boolean} 消失するものに一般アイテムを含むか否か
   */
  includesItems() {
    return this.gameParams.includeItems;
  }
  /**
   * @returns {boolean} 消失するものに武器を含むか否か
   */
  includesWeapons() {
    return this.gameParams.includeWeapons;
  }
  /**
   * @returns {boolean} 消失するものに防具を含むか否か
   */
  includesArmors() {
    return this.gameParams.includeArmors;
  }
  /**
   * @returns {boolean} 消失するものに大事なものを含むか否か
   */
  includesImportants() {
    return this.gameParams.includeImportants;
  }
  /**
   * @returns {boolean} 消失するものに装備品を含むか否か
   */
  includesEquips() {
    return this.gameParams.includeEquips;
  }
  /**
   * @returns {number} 消失する所持品の総数の最小値
   */
  getMinCount() {
    return this.gameParams.minCount;
  }
  /**
   * @returns {number} 消失する所持品の総数の最大値
   */
  getMaxCount() {
    return this.gameParams.maxCount;
  }
  /**
   * @returns {boolean} 消失するアイテムが複数種類になることを許可
   */
  allowsVariousItems() {
    return this.gameParams.variousItems;
  }
  /**
   * @returns {string} アイテム消失時に表示するメッセージ
   */
  getMessage() {
    return this.gameParams.message;
  }
  /**
   * @returns {Object} アイテム消失時に再生するSEの設定
   */
  getSound() {
    return this.gameParams.sound;
  }
  /** 一般アイテムの追加
   * @param {string} id 一般アイテムID
   * @param {number} value 所持数
   */
  addItem(id, value) {
    id = String(id);
    const items = this.lists.items;
    this.lists.items.set(id, value + (items.has(id) ? items.get(id) : 0));
  }
  /** 一般アイテムリストを対象リストに追加 */
  concatItemList() {
    if (!this.includesItems) return;
    let data;
    this.lists.items.forEach(
      function (value, id) {
        data = $dataItems[id];
        if (!this.includesImportants && data.itypeId === 2) return;
        if (data.meta["RandomLoseException"]) return;
        this.lists.targets.set(data, value);
      }.bind(this)
    );
  }
  /** 武器の追加
   * @param {string} id 武器ID
   * @param {number} value 所持数
   */
  addWeapon(id, value) {
    id = String(id);
    const weapons = this.lists.weapons;
    this.lists.weapons.set(id, value + (weapons.has(id) ? weapons.get(id) : 0));
  }
  /** 武器リストを対象リストに追加 */
  concatWeaponList() {
    if (!this.includesWeapons) return;
    let data;
    this.lists.weapons.forEach(
      function (value, id) {
        data = $dataWeapons[id];
        if (data.meta["RandomLoseException"]) return;
        this.lists.targets.set(data, value);
      }.bind(this)
    );
  }
  /** 防具の追加
   * @param {string} id 防具ID
   * @param {number} value 所持数
   */
  addArmor(id, value) {
    id = String(id);
    const armors = this.lists.armors;
    this.lists.armors.set(id, value + (armors.has(id) ? armors.get(id) : 0));
  }
  /** 防具リストを対象リストに追加 */
  concatArmorList() {
    if (!this.includesArmors) return;
    let data;
    this.lists.armors.forEach(
      function (value, id) {
        data = $dataArmors[id];
        if (data.meta["RandomLoseException"]) return;
        this.lists.targets.set(data, value);
      }.bind(this)
    );
  }
  /**
   * 所持アイテムリストの初期化
   */
  initLists() {
    this.lists.targets.init();
    this.lists.loses.init();
    this.lists.items.clear();
    this.lists.weapons.clear();
    this.lists.armors.clear();
    Object.keys($gameParty._items).forEach(
      function (id) {
        this.addItem(id, $gameParty._items[id]);
      }.bind(this)
    );
    Object.keys($gameParty._weapons).forEach(
      function (id) {
        this.addWeapon(id, $gameParty._weapons[id]);
      }.bind(this)
    );
    Object.keys($gameParty._armors).forEach(
      function (id) {
        this.addArmor(id, $gameParty._armors[id]);
      }.bind(this)
    );
    if (!this.includesEquips()) return;
    // 装備品の追加
    $gameParty
      .members()
      .reduce(
        /** @param {Game_Item[]} equips */ function (equips, member) {
          return equips.concat(member.equips());
        },
        []
      )
      .forEach(
        /** @param {Game_Item} equip */ function (equip) {
          if (!equip) return;
          if (equip.itypeId > 0) {
            this.addItem(equip.id, 1);
          } else if (equip.wtypeId > 0) {
            this.addWeapon(equip.id, 1);
          } else if (equip.atypeId > 0) {
            this.addArmor(equip.id, 1);
          }
        }.bind(this)
      );
  }
  /**
   * @desc アイテム消失処理
   * @param {Array<string>} args プラグイン呼び出し引数
   */
  operateItemLose(args) {
    const min = this.getMinCount();
    const max = this.getMaxCount();
    const [argScope, argValue] = args;
    let value = !!argValue
      ? parseInt(argValue)
      : Math.floor(Math.random() * (max + 1 - min)) + min;
    if (value <= 0) return;
    const scope = String(argScope).toUpperCase();
    this.setTargetList(scope);
    while (value > 0) {
      if (this.lists.targets.size() <= 0) {
        break;
      }
      value -= this.randomLose(value);
      if (!this.allowsVariousItems()) {
        break;
      }
    }
    if (this.lists.loses.size() > 0) {
      this.loseItem();
    }
  }
  /**
   * @desc 対象アイテムリストの初期化・設定
   * @param {string} scope 対象
   */
  setTargetList(scope) {
    this.initLists();
    switch (scope) {
      case "ITEM":
        this.concatItemList();
        break;
      case "WEAPON":
        this.concatWeaponList();
        break;
      case "ARMOR":
        this.concatArmorList();
        break;
      case "EQUIP":
        this.concatWeaponList();
        this.concatArmorList();
        break;
      case "ALL":
      default:
        this.concatItemList();
        this.concatWeaponList();
        this.concatArmorList();
        break;
    }
  }
  /**
   * @desc ランダム消失
   * @param {PartyItemData[]} list 所持アイテムデータリスト
   * @param {number} value 消失数の最大値
   */
  randomLose(value) {
    const listIndex = Math.floor(Math.random() * this.lists.targets.size());
    const randomValue = Math.floor(Math.random() * value) + 1;
    const loseValue = this.allowsVariousItems() ? randomValue : value;
    const takenData = this.lists.targets.take(listIndex, loseValue);
    this.lists.loses.set(takenData.data, takenData.value);
    return takenData.value;
  }
  /**
   * @desc アイテム消失実処理
   */
  loseItem() {
    const sound = this.getSound();
    if (sound && sound["name"]) {
      const _sound = {
        name: String(sound["name"]),
        volume: Number(sound["volume"]),
        pitch: Number(sound["pitch"]),
        pan: Number(sound["pan"]),
      };
      AudioManager.playSe(_sound);
    }
    const template = this.getMessage();
    const actorName = $gameParty.members()[0].name;
    let message = "";
    /** @type {IDataAllItem} */
    let data = null;
    /** @type {string} */
    let itemName = "";
    /** @type {number} */
    let value = 0;
    const includeEquips = this.includesEquips();
    this.lists.loses.get().forEach(function (partyItemData) {
      data = partyItemData.data;
      itemName = data.name;
      value = partyItemData.value;
      message = template
        .replace("%1", itemName)
        .replace("%2", value)
        .replace("%3", actorName);
      $gameMessage.add(message);
      $gameParty.loseItem(data, value, includeEquips);
    });
  }
  /**
   * @desc プラグインパラメータの設定
   * @param {string[]} args プラグイン呼び出し引数
   */
  operateSetting(args) {
    const mode = String(args[0]).toUpperCase();
    const value1 = args[1];
    const value2 = args[2];
    switch (mode) {
      case "INCLUDEITEMS":
        this.gameParams.includeItems = this.setGameBoolean(
          value1,
          "IncludeItems"
        );
        break;
      case "INCLUDEWEAPONS":
        this.gameParams.includeWeapons = this.setGameBoolean(
          value1,
          "IncludeWeapons"
        );
        break;
      case "INCLUDEARMORS":
        this.gameParams.includeArmors = this.setGameBoolean(
          value1,
          "IncludeArmors"
        );
        break;
      case "INCLUDEIMPORTANTS":
        this.gameParams.includeImportants = this.setGameBoolean(
          value1,
          "IncludeImportants"
        );
        break;
      case "INCLUDEEQUIPS":
        this.gameParams.includeEquips = this.setGameBoolean(
          value1,
          "IncludeEquips"
        );
        break;
      case "MINCOUNT":
        this.gameParams.minCount = this.setGameNumber(value1, "MinCount");
        break;
      case "MAXCOUNT":
        this.gameParams.maxCount = this.setGameNumber(value1, "MaxCount");
        break;
      case "VARIOUSITEMS":
        this.gameParams.variousItems = this.setGameBoolean(
          value1,
          "VariousItems"
        );
        break;
      case "MESSAGE":
        const newMessage = args.slice(1).join(" ");
        this.gameParams.message = this.setGameString(newMessage, "Message");
        break;
      case "SOUND":
        this.setGameSound(value1, value2);
        break;
    }
  }
  setGameBoolean(value, name) {
    switch (String(value).toUpperCase()) {
      case "ON":
        return true;
      case "OFF":
        return false;
      case "DEFAULT":
      default:
        return this.getParamBoolean(name);
    }
  }
  setGameNumber(value, name) {
    if (String(value).toUpperCase() == "DEFAULT") {
      return getParamNumber(name);
    } else {
      return Math.abs(parseInt(value));
    }
  }
  setGameString(value, name) {
    if (String(value).toUpperCase() == "DEFAULT") {
      return getParamString(name);
    } else {
      return String(value);
    }
  }
  setGameSound(param, value) {
    const _param = String(param).toLowerCase();
    if (String(value).toUpperCase() == "DEFAULT") {
      this.gameParams.sound[_param] = paramParse("Sound")[_param];
    } else if (_param == "name") {
      this.gameParams.sound[_param] = String(value);
    } else {
      this.gameParams.sound[_param] = Math.abc(parseInt(value));
    }
  }
}

(function () {
  const RRIL = new Ricon_RandomItemLose();
  //=============================================================================
  // Game_Interpreter
  //=============================================================================
  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command == "RandomLose") {
      RRIL.operateItemLose(args);
    }
    if (command == "RandomLoseSetting") {
      RRIL.operateSetting(args);
    }
  };
})();
