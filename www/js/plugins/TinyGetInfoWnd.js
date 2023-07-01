//=============================================================================
// TinyGetInfoWnd.js Ver1.1
//=============================================================================
// Ver 1.1 New Features:
// - display window even if screen is faded out.
// - it can display window on battle (option)
// - display money get/(lose:option)
// - set SE for each type of item/money.
// note: The motivation of ver up is to use this at Margikarman ItoA MV.

/*:
 * @plugindesc Display tiny window of gaining/losing items information(Ver 1.1)
 * @author Sasuke KANNAZUKI (thx to Momomaru)
 *
 * @param Event Command Switch
 * @desc If the switch on, display window when change an item number by an
 *  event command
 * @default 104
 * 
 * @param Y position type
 * @desc Windows' position. 0:top 1:bottom
 * @default 0
 * 
 * @param Display Loss
 * @desc Whether display item loss (1:display 0:not display)
 * @default 1
 * 
 * @param Display at Battle
 * @desc Whether display not only map also at battle(1: yes 0:no)
 * @defalut 1
 * 
 * @param textGainItem
 * @desc title text display on the window when gain item(s).
 * %1 is replaced to the item's kind(weapon/armor/item/money).
 * @default You got %1
 * 
 * @param textLoseItem
 * @desc title text display on the window when lose item(s).
 * %1 is replaced to the item's kind(weapon/armor/item/money).
 * @default You lost %1
 *
 * @param wordMoney
 * @desc the word that represents the kind 'money'
 * @default money
 *
 * @param iconMoney
 * @desc the icon ID that represents the kind 'money'
 * @default 360
 *
 * @param Item SE filename
 * @desc the filename of the SE that plays when you gain item(s).
 * note: It doesn't play when you lose item(s).
 * @default Chime2
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Item SE volume
 * @desc the volume of the SE that plays when you gain item(s).
 * @default 90
 * 
 * @param Item SE pitch
 * @desc the pitch of the SE that plays when you gain item(s).
 * @default 100
 * 
 * @param Weapon SE filename
 * @desc the filename of the SE that plays when you gain weapon(s).
 * note: It doesn't play when you lose weapon(s).
 * @default Equip1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Weapon SE volume
 * @desc the volume of the SE that plays when you gain weapon(s).
 * @default 100
 * 
 * @param Weapon SE pitch
 * @desc the pitch of the SE that plays when you gain weapon(s).
 * @default 100
 * 
 * @param Armor SE filename
 * @desc the filename of the SE that plays when you gain armor(s).
 * note: It doesn't play when you lose armor(s).
 * @default Evasion2
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Armor SE volume
 * @desc the volume of the SE that plays when you gain armor(s).
 * @default 100
 * 
 * @param Armor SE pitch
 * @desc the pitch of the SE that plays when you gain armor(s).
 * @default 100
 * 
 * @param Money SE filename
 * @desc the filename of the SE that plays when you gain money.
 * note: It doesn't play when you lose money.
 * @default Coin
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Money SE volume
 * @desc the volume of the SE that plays when you gain money.
 * @default 100
 * 
 * @param Money SE pitch
 * @desc the pitch of the SE that plays when you gain money.
 * @default 100
 * @help
 * Plugin Commands:
 * TinyGetInfoWnd arg0 arg1 arg2 arg3
 * arg0 must be 'item', 'weapon', 'armor', or 'money'.
 * arg1 must be the ID of the item(or equipment), (when money, the value),
 *  or 'V' + number(ex. 'V20') where the number is the variable ID for item ID.
 * arg2 must be 'gain' or 'lose'. (default value is 'gain').
 *  at 'money', this is ignored.
 * arg3 must be the number of gain/lose. (defalut value is 1).
 *  at 'money', this is ignored.
 *  (arg3 also accepts the same notation as the arg1 like 'V15')
 * ex.
 * TinyGetInfoWnd weapon 14 gain 2  # gain 2 weapons whose id is 14.
 * TinyGetInfoWnd armor 20 lose 1   # lose an armor whose id is 20.
 *   (if you equip the armor, it will not be lost.)
 * TinyGetInfoWnd item 7    # gain an item whose id is 7.
 *   (default value, arg2='gain' and arg3='1' is applied.)
 * TinyGetInfoWnd item V10 gain 3   # gain 3 items whose ID is variable #10.
 * TinyGetInfoWnd money 100         # gain 100G
 * TinyGetInfoWnd money -100        # lose 100G
 * 
 * note description:
 * <info:the_explanation> : the_explanation is displayed when gain or lose
 *  the item. If it isn't written down, the first line of the item's
 *  description is displayed.
 *
 * Item lost is not more than the party has.
 * When you have only 3 and execute 'lose 5' for the item,
 * it will display 'lost 3'.
 * When you have the item none, even if execute 'lose', do not display window.
 *
 * Copyright：
 * This plugin is based on a Momomaru's RGSS2 script specification.
 * Thanks to Momomaru.
 */
/*:ja
 * @plugindesc アイテムの入手/消失を小さなウィンドウで表示します。(Ver1.1)
 * @author 神無月サスケ (原案：ももまる)
 *
 * @param Event Command Switch
 * @desc このスイッチがONの時、イベントコマンド「アイテム/武器/防具/所持金の増減」を行った時にウィンドウが表示されます
 * @default 104
 * 
 * @param Y position type
 * @desc 複数のウィンドウを並べる位置です。0:上部 1:下部
 * @default 0
 * 
 * @param Display Loss
 * @desc 消失時にウィンドウを表示するか (1:する 0:しない)
 * @default 1
 * 
 * @param Display at Battle
 * @desc 戦闘中にもウィンドウを表示するか(1:する 0:しない)
 * @defalut 1
 * 
 * @param textGainItem
 * @desc アイテムを入手した時に表示するタイトルです。
 * %1がアイテム種別(アイテム/武器/防具/お金)に置き換わります。
 * @default %1入手！
 * 
 * @param textLoseItem
 * @desc アイテムを消失した時に表示するタイトルです。
 * %1がアイテム種別(アイテム/武器/防具/お金)に置き換わります。
 * @default %1消失……。
 *
 * @param wordMoney
 * @desc アイテム種別の「お金」をあらわす文字列です
 * @default お金
 *
 * @param iconMoney
 * @desc お金入手/消失時に表示するアイコンIDです
 * @default 360
 *
 * @param Item SE filename
 * @desc アイテムを入手した時に演奏されるSEのファイル名です。
 * 注意：消失した時は演奏されません。
 * @default Evasion1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Item SE volume
 * @desc アイテムを入手した時に演奏されるSEのボリュームです。
 * @default 100
 * 
 * @param Item SE pitch
 * @desc アイテムを入手した時に演奏されるSEのピッチです。
 * @default 100
 * 
 * @param Weapon SE filename
 * @desc 武器を入手した時に演奏されるSEのファイル名です。
 * 注意：消失した時は演奏されません。
 * @default Equip1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Weapon SE volume
 * @desc 武器を入手した時に演奏されるSEのボリュームです。
 * @default 100
 * 
 * @param Weapon SE pitch
 * @desc 武器を入手した時に演奏されるSEのピッチです。
 * @default 100
 * 
 * @param Armor SE filename
 * @desc 防具を入手した時に演奏されるSEのファイル名です。
 * 注意：消失した時は演奏されません。
 * @default Evasion2
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Armor SE volume
 * @desc 防具を入手した時に演奏されるSEのボリュームです。
 * @default 100
 * 
 * @param Armor SE pitch
 * @desc 防具を入手した時に演奏されるSEのピッチです。
 * @default 100
 * 
 * @param Money SE filename
 * @desc お金を入手した時に演奏されるSEのファイル名です。
 * 注意：消失した時は演奏されません。
 * @default Coin
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Money SE volume
 * @desc お金を入手した時に演奏されるSEのボリュームです。
 * @default 100
 * 
 * @param Money SE pitch
 * @desc お金を入手した時に演奏されるSEのピッチです。
 * @default 100
 * 
 * @help
 * プラグインコマンドの書式:
 * TinyGetInfoWnd arg0 arg1 arg2 arg3
 * arg0 は item, weapon, armor, money のいずれかにします。
 * arg1 は アイテム(または武器防具)のID、（お金の時は金額）
 *  または V20 のようにVで始まる数字にします。
 *  後者の場合数字の番号(ここでは20)の変数の値がID(または金額)になります。
 * arg2 は gain, lose のいずれかにします。(省略時はgain)
 *  お金の時は指定しません。
 * arg3 は 個数にします。(省略時は1, arg2を省略してarg3を書くことは出来ません)
 *  お金の時は指定しません。
 * (arg3 でも arg1 と同等の、V15 のような Vで始まる記法が利用可能です)
 * ex.
 * TinyGetInfoWnd weapon 14 gain 2  # ID14の武器を2個得る。
 * TinyGetInfoWnd armor 20 lose 1   # ID20の鎧を1個失う
 *   (ただし装備していた場合は失わない)
 * TinyGetInfoWnd item 7            # ID7のアイテムを1個得る。
 *   (パラメータを省略したので、arg2はgainに、arg3は1になります。)
 * TinyGetInfoWnd item V10 gain 3   # 変数10番の値のIDのアイテムを3個得る。
 * TinyGetInfoWnd money 100         # 100G入手
 * TinyGetInfoWnd money -100        # 100G失う
 * 
 * メモの書式：
 * <info:the_explanation> : the_explanation の文章が、アイテムの説明として
 *   入手/消失時に表示されます。省略した場合は、アイテムの説明の1行目が
 *   表示されます。
 *
 * アイテムの消失は、所持している数に関連します。
 * 例えば5個消失コマンドを実行して、3個しか持っていない場合「3個消失」と
 * 表示されます。また、該当アイテムをひとつも持っていない場合は、
 * 消失ウィンドウは表示されません。
 *
 * 謝辞：
 * このプラグインは、ももまる様のRGSS2素材の仕様をベースに作られました。
 * ももまる様に謝意を示します。
 */

(function () {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('TinyGetInfoWnd');
  var dispSwitchID = Number(parameters['Event Command Switch'] || 22);
  var yPosType = Number(parameters['Y position type'] || 1);
  var isDisplayLoss = !!Number(parameters['Display Loss']);
  var isDisplayBattle = !!Number(parameters['Display at Battle']);
  var wordMoney = parameters['wordMoney'] || 'money';
  var iconMoney = Number(parameters['iconMoney'] || 360);
  var textGainItem = parameters['textGainItem'] || 'You got %1';
  var textLoseItem = parameters['textLoseItem'] || 'You lost %1';
  var seFilename = parameters['Item SE filename'] || 'Evasion1';
  var seVolume = Number(parameters['Item SE volume'] || 100);
  var sePitch = Number(parameters['Item SE pitch'] || 100);
  var seWeaponFilename = parameters['Weapon SE filename'] || 'Equip1';
  var seWeaponVolume = Number(parameters['Weapon SE volume'] || 100);
  var seWeaponPitch = Number(parameters['Weapon SE pitch'] || 100);
  var seArmorFilename = parameters['Armor SE filename'] || 'Evasion2';
  var seArmorVolume = Number(parameters['Armor SE volume'] || 100);
  var seArmorPitch = Number(parameters['Armor SE pitch'] || 100);
  var seMoneyFilename = parameters['Money SE filename'] || 'Coin';
  var seMoneyVolume = Number(parameters['Money SE volume'] || 100);
  var seMoneyPitch = Number(parameters['Money SE pitch'] || 100);

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'TinyGetInfoWnd') {
      // find args[1]
      var itemId = 0;
      var reg = (/^V([0-9]+)/i).exec(args[1]);
      if (reg) {
        itemId = $gameVariables.value(Number(reg[1])) || 0;
      } else {
        itemId = Number(args[1]) || 0;
      }
      // find args[3]
      var itemNumber = 0;
      reg = (/^V([0-9]+)/i).exec(args[3]);
      if (reg) {
        itemNumber = $gameVariables.value(Number(reg[1])) || 1;
      } else {
        itemNumber = Number(args[3]) || 1;
      }
      // get current spriteset
      var spriteSet = null;
      if (!$gameParty.inBattle() || isDisplayBattle) {
        spriteSet = SceneManager._scene._spriteset;
      }
      // parse parameters
      switch (args[0]) {
        case 'item':
          if (!!$dataItems[itemId] && !!spriteSet) {
            switch (args[2]) {
              case 'gain':
              case undefined:
                // gain item process
                var text = textGainItem.format(TextManager.item);
                spriteSet.addGetInfoWindow(itemId, 0, text, itemNumber);
                break;
              case 'lose':
                // lose item process
                var text = textLoseItem.format(TextManager.item);
                spriteSet.addGetInfoWindow(itemId, 0, text, -itemNumber);
                break;
            }
          }
          break;
        case 'weapon':
          if (!!$dataWeapons[itemId] && !!spriteSet) {
            switch (args[2]) {
              case 'gain':
              case undefined:
                // gain weapon process
                var text = textGainItem.format(TextManager.weapon);
                spriteSet.addGetInfoWindow(itemId, 1, text, itemNumber);
                break;
              case 'lose':
                // lose weapon process
                var text = textLoseItem.format(TextManager.weapon);
                spriteSet.addGetInfoWindow(itemId, 1, text, -itemNumber);
                break;
            }
          }
          break;
        case 'armor':
          if (!!$dataArmors[itemId] && !!spriteSet) {
            switch (args[2]) {
              case 'gain':
              case undefined:
                // gain armor process
                var text = textGainItem.format(TextManager.armor);
                spriteSet.addGetInfoWindow(itemId, 2, text, itemNumber);
                break;
              case 'lose':
                // lose armor process
                var text = textLoseItem.format(TextManager.armor);
                spriteSet.addGetInfoWindow(itemId, 2, text, -itemNumber);
                break;
            }
          }
          break;
        case 'money':
          if (!!spriteSet) {
            var text;
            if (itemId >= 0) {
              text = textGainItem.format(wordMoney);
            } else {
              text = textLoseItem.format(wordMoney);
            }
            spriteSet.addGetInfoWindow(0, 3, text, itemId);
          }
      }
    }
  };

  //
  // set variables
  //
  var _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this.getInfoOccupied = [];
  };

  //
  // process spriteset
  //
  var _Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
  Spriteset_Base.prototype.initialize = function () {
    this.getInfoWndFactory = [];
    this.getInfoWnds = [];
    $gameTemp.getInfoOccupied = [];
    _Spriteset_Base_initialize.call(this);
  };

  Spriteset_Base.prototype.createInfoWindow = function (id, type, text, value) {
    if (this.getInfoWndFactory.length > 0) {
      return this.getInfoWndFactory.shift().setup(id, type, text, value);
    } else {
      return new Window_GetInfo(id, type, text, value);
    }
  };

  Spriteset_Base.prototype.addGetInfoWindow = function (id, type, text, value) {
    var window = this.createInfoWindow(id, type, text, value);
    this.getInfoWnds.push(window);
    SceneManager._scene.addChild(window);
  };

  Spriteset_Base.prototype.removeGetInfoWindow = function (window) {
    $gameTemp.getInfoOccupied[window.index] = null;
    SceneManager._scene.removeChild(window);
    this.getInfoWndFactory.push(window.reset());
  };

  Spriteset_Base.prototype.removeAllGetInfoWindows = function () {
    for (var i = 0; i < this.getInfoWnds.length; i++) {
      this.removeGetInfoWindow(this.getInfoWnds[i]);
    }
    this.getInfoWnds = [];
  };

  var _Spriteset_Base_update = Spriteset_Base.prototype.update;
  Spriteset_Base.prototype.update = function () {
    _Spriteset_Base_update.call(this);
    this.updateGetInfoWindow();
  };

  Spriteset_Base.prototype.updateGetInfoWindow = function () {
    var s = this;
    this.getInfoWnds = this.getInfoWnds.filter(function (window) {
      if (window.needDispose()) {
        s.removeGetInfoWindow(window);
        return false;
      }
      return true;
    });
  };

  //
  // delete all tiny windows before battle
  //
  var _Scene_Map_startEncounterEffect =
    Scene_Map.prototype.startEncounterEffect;
  Scene_Map.prototype.startEncounterEffect = function () {
    this._spriteset.removeAllGetInfoWindows();
    _Scene_Map_startEncounterEffect.call(this);
  };

  // -------------------------------------------------------------------------
  // Window_GetInfo
  // 
  // The tiny window to display item gain/lose situation on map.

  function Window_GetInfo() {
    this.initialize.apply(this, arguments);
  }

  Window_GetInfo.prototype = Object.create(Window_Base.prototype);
  Window_GetInfo.prototype.constructor = Window_GetInfo;

  Window_GetInfo.prototype.initialize = function (id, type, text, value) {
    Window_Base.prototype.initialize.call(this, -24, 0, 864, 105);
    this.reset();
    this.setup(id, type, text, value);
  };

  Window_GetInfo.prototype.reset = function () {
    this.disposed = false;
    this.opacity = 0;
    this.backOpacity = 0;
    this.contentsOpacity = 0;
    this.count = 0;
    this.contents.clear();
    return this;
  };

  Window_GetInfo.prototype.setup = function (id, type, text, value) {
    value = this.getRealValue(type, id, value);
    this.gainItem(type, id, value);
    this.setPosition(value);
    this.drawContents(id, type, text, value);
    this.playSE(type, value);
    this.update();
    return this;
  };

  Window_GetInfo.prototype.determineItem = function (type, id) {
    var data = '';
    switch (type) {
      case 0:
        data = $dataItems[id];
        break;
      case 1:
        data = $dataWeapons[id];
        break;
      case 2:
        data = $dataArmors[id];
        break;
    }
    return data;
  };

  Window_GetInfo.prototype.description = function (data) {
    if (data.meta.info) {
      return data.meta.info;
    }
    return data.description.replace(/[\r\n]+.*/m, "");
  };

  Window_GetInfo.prototype.getRealValue = function (type, id, value) {
    var data = this.determineItem(type, id);
    // check number (whether the party has the number of item to lose)
    if (type >= 0 && type <= 2) {
      if (value < 0) {
        if (-value > $gameParty.numItems(data)) {
          value = -$gameParty.numItems(data);
        }
      }
    } else if (type === 3) {
      if (value < 0) {
        if (-value > $gameParty.gold()) {
          value = -$gameParty.gold();
        }
      }
    }
    return value;
  };

  Window_GetInfo.prototype.gainItem = function (type, id, value) {
    var data = this.determineItem(type, id);
    if (type >= 0 && type <= 2) {
      $gameParty.gainItem(data, value);
    } else if (type === 3) {
      $gameParty.gainGold(value);
    }
  };

  Window_GetInfo.prototype.setPosition = function (value) {
    if (value === 0 || (value < 0 && !isDisplayLoss)) {
      return;
    }
    this.index = $gameTemp.getInfoOccupied.indexOf(null);
    if (this.index === -1) {
      this.index = $gameTemp.getInfoOccupied.length;
    }
    $gameTemp.getInfoOccupied[this.index] = true;
    // set Y position
    if (yPosType === 0) {
      this.y = this.index * 60;
    } else {
      this.y = 520 - (this.index * 60);
    }
  };

  Window_GetInfo.prototype.drawContents = function (id, type, text, value) {
    if (value === 0 || (value < 0 && !isDisplayLoss)) {
      return;
    }
    var data = this.determineItem(type, id);
    // fill background
    this.contents.paintOpacity = 160;
    this.contents.fontSize = 28;
    this.contents.fillRect(0, 21, 816, 36, '#000000');
    // draw item name, number, description
    if (type >= 0 && type <= 2) {
      this.contents.paintOpacity = 255;
      this.changeTextColor(this.normalColor());
      if (value < 0) {
        this.contents.paintOpacity = 160;
      }
      this.drawItemName(data, 6, 21, 300);
      this.drawText('\xd7', 306, 21, 24, 'center');
      this.drawText(String(Math.abs(value)), 330, 21, 32, 'right');
      this.changeTextColor(this.normalColor());
      this.drawText(this.description(data), 384, 21, 432, 'left');
    } else if (type === 3) {
      this.contents.paintOpacity = 255;
      this.changeTextColor(this.normalColor());
      if (value < 0) {
        this.contents.paintOpacity = 160;
      }
      this.drawIcon(iconMoney, 6, 21);
      var mainText = String(Math.abs(value)) + $dataSystem.currencyUnit;
      this.drawText(mainText, 44, 21, 180, 'right');
    }
    // draw guide string
    this.contents.paintOpacity = 160;
    this.contents.fontSize = 20;
    this.contents.fillRect(0, 0, this.textWidth(text) + 6, 22, '#000000');
    this.contents.paintOpacity = 255;
    this.changeTextColor(this.normalColor());
    this.drawText(text, 6, -8, 510, 'left');
  };

  Window_GetInfo.prototype.playSE = function (type, value) {
    if (value <= 0) {   // play when gain, not play when lose.
      return;
    }
    switch (type) {
      case 0: // item
        if (seFilename) {
          var audio = { name: seFilename, volume: seVolume, pitch: sePitch };
          AudioManager.playSe(audio);
        }
        break;
      case 1: // weapon
        if (seWeaponFilename) {
          var audio = {
            name: seWeaponFilename, volume: seWeaponVolume,
            pitch: seWeaponPitch
          };
          AudioManager.playSe(audio);
        }
        break;
      case 2: // armor
        if (seArmorFilename) {
          var audio = {
            name: seArmorFilename, volume: seArmorVolume,
            pitch: seArmorPitch
          };
          AudioManager.playSe(audio);
        }
        break;
      case 3: // money
        if (seMoneyFilename) {
          var audio = {
            name: seMoneyFilename, volume: seMoneyVolume,
            pitch: seMoneyPitch
          };
          AudioManager.playSe(audio);
        }
        break;
      default: // not supported
        break;
    }
  };

  Window_GetInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (++this.count < 200) {
      this.contentsOpacity += 32;
    } else {
      if (yPosType === 0) {
        this.y -= 2;
      } else {
        this.y += 2;
      }
      this.contentsOpacity -= 32;
    }
  };

  Window_GetInfo.prototype.needDispose = function () {
    return this.contentsOpacity === 0;
  };

  //
  // interpreter commands
  // *** note *** : To prevent multiple exection of operateValue,
  // not to alias but overwriting functions.


  // Change Gold
  Game_Interpreter.prototype.command125 = function () {
    var value = this.operateValue(this._params[0], this._params[1],
      this._params[2]);
    if ($gameSwitches.value(dispSwitchID) &&
      (!$gameParty.inBattle() || isDisplayBattle) &&
      value != 0) {
      var text = '';
      var spriteSet = SceneManager._scene._spriteset;
      if (value > 0) {
        text = textGainItem.format(wordMoney);
      } else {
        text = textLoseItem.format(wordMoney);
      }
      spriteSet.addGetInfoWindow(0, 3, text, value);
    } else {
      $gameParty.gainGold(value);
    }
    return true;
  };


  // Change Items
  Game_Interpreter.prototype.command126 = function () {
    var value = this.operateValue(this._params[1], this._params[2],
      this._params[3]);
    if ($gameSwitches.value(dispSwitchID) &&
      (!$gameParty.inBattle() || isDisplayBattle) &&
      value != 0) {
      var text = '';
      var spriteSet = SceneManager._scene._spriteset;
      if (value > 0) {
        text = textGainItem.format(TextManager.item);
      } else {
        text = textLoseItem.format(TextManager.item);
      }
      spriteSet.addGetInfoWindow(this._params[0], 0, text, value);
    } else {
      $gameParty.gainItem($dataItems[this._params[0]], value);
    }
    return true;
  };

  // Change Weapons
  Game_Interpreter.prototype.command127 = function () {
    var value = this.operateValue(this._params[1], this._params[2],
      this._params[3]);
    if ($gameSwitches.value(dispSwitchID) &&
      (!$gameParty.inBattle() || isDisplayBattle) &&
      value != 0) {
      var text = '';
      var spriteSet = SceneManager._scene._spriteset;
      if (value > 0) {
        text = textGainItem.format(TextManager.weapon);
      } else {
        text = textLoseItem.format(TextManager.weapon);
      }
      spriteSet.addGetInfoWindow(this._params[0], 1, text, value);
    } else {
      $gameParty.gainItem($dataWeapons[this._params[0]], value,
        this._params[4]);
    }
    return true;
  };

  // Change Armors
  Game_Interpreter.prototype.command128 = function () {
    var value = this.operateValue(this._params[1], this._params[2],
      this._params[3]);
    if ($gameSwitches.value(dispSwitchID) &&
      (!$gameParty.inBattle() || isDisplayBattle) &&
      value != 0) {
      var text = '';
      var spriteSet = SceneManager._scene._spriteset;
      if (value > 0) {
        text = textGainItem.format(TextManager.armor);
      } else {
        text = textLoseItem.format(TextManager.armor);
      }
      spriteSet.addGetInfoWindow(this._params[0], 2, text, value);
    } else {
      $gameParty.gainItem($dataArmors[this._params[0]], value,
        this._params[4]);
    }
    return true;
  };

})();
