//=============================================================================
// ChangeOperationToFPSStyle.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 Tsumio
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2017/07/15 オプション画面にコマンドを追加。
// 1.0.1 2017/07/14 コードを修正。内容に変更はなし。
// 1.0.0 2017/07/14 公開。
// ----------------------------------------------------------------------------
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:
 * @plugindesc This plugin change key operation to FPS style.
 * @author Tsumio
 *
 * @param ItemName
 * @type string
 * @desc It is a setting item name displayed on Options.
 * @default Type of Key Operation
 * 
 * @param SymbolName(DefaultType)
 * @type string
 * @desc It is a setting symbol name displayed on Options(Default setting use this key type).
 * @default Default
 * 
 * @param SymbolName(FPSType)
 * @type string
 * @desc It is a setting symbol name displayed on Options(FPS setting use this key type).
 * @default FPS
 * 
 * @help This plugin change the setting of the keys to the setting that was made for the FPS game.
 * Probably,it is effective when you want to operate the game with one hand.
 * And also, this plugin adds command to option scene.
 * 
 * ----plugin command----
 * Change_Key_FPS         #Change key settings to FPS style.
 * Change_Key_Default     #Change key settings to default settings.
 * 
 * ----change or add key settings----
 * Space Key     #To be changed cancel key(default is ok key)
 * Switch Pages  #W key is invalid.Q key does not change.E key is a substitute for W key.
 * WASD Key      #Cursor key.
 * F Key         #OK key.
 * CV Key        #Cancel Key.
 * Other key     #It remains as it is, unless I am mistaken.
 */
/*:ja
 * @plugindesc キーの設定をFPS寄りの設定に変更します。
 * @author ツミオ
 *
 * @param 項目名称
 * @type string
 * @desc オプション画面に表示される設定項目名称。
 * @default キー操作タイプ
 * 
 * @param 設定名称（通常キー）
 * @type string
 * @desc オプション画面に表示される設定名称（ツクールで通常使用されるキー設定）。
 * @default 両手操作
 * 
 * @param 設定名称（FPSキー）
 * @type string
 * @desc オプション画面に表示される設定名称（FPS寄りのキー設定）。
 * @default 片手操作
 * 
 * @help キーの設定をFPSゲームに寄せた設定に変更します。
 * 片手での操作を可能にしたい場合に有効です。
 * また、オプション画面に設定項目が追加されます。
 *
 * 【プラグインコマンド】
 * Change_Key_FPS         #FPSに寄せたキー設定に変更します。
 * Change_Key_Default     #ツクールデフォルトのキー設定に変更します。
 * 
 * 
 *【変更（追加）されるキー設定】
 * スペースキー   →キャンセルに変更（元は決定キー）
 * ページ切り替え →Wキー無効化。Qは据え置き。EキーがWキーの代わり。
 * WASDキー      →移動キー
 * Fキー         →決定キー
 * CVキー        →キャンセルキー。
 * その他のキー設定は元のままです（たぶん）。
 * 
 *
 * 利用規約：
 * 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 * についても制限はありません。
 * 自由に使用してください。
 */

(function () {
    'use strict';
    var pluginName = 'ChangeOperationToFPSStyle';

    //Declare NTMO namespace.
    var NTMO = NTMO || {};

    //-----------------------------------------------------------------------------
    // Settings for plugin command.
    //-----------------------------------------------------------------------------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Change_Key_FPS') {
            NTMO.COTS.setFPSKeyMapper();
        }
        else if (command === 'Change_Key_Default') {
            NTMO.COTS.setDefaultKeyMapper();
        }
    };

    //=============================================================================
    // Local function
    //  These functions checks & formats pluguin's command parameters.
    //  I borrowed these functions from Triacontane.Thanks!
    //=============================================================================
    var getParamString = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // Get and set pluguin parameters.
    //=============================================================================
    var param = {};
    param.itemName = getParamString(['ItemName', '項目名称']);
    param.symbolDefault = getParamString(['SymbolName(DefaultType)', '設定名称（通常キー）']);
    param.symbolFPS = getParamString(['SymbolName(FPSType)', '設定名称（FPSキー）']);

    //=============================================================================
    // ConfigManager
    //  Add a setting for key mappping.
    //  (I am short of knowledge about this class.So, if you find a error, I want  
    //    yout to correct it. If possible, please notify me.)
    //=============================================================================
    ConfigManager.keyMapper = false;

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        var config = _ConfigManager_makeData.apply(this, arguments);
        config.keyMapper = this.keyMapper;

        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.apply(this, arguments);

        this.keyMapper = this.readFlag(config, 'keyMapper');

        //set
        if (this.keyMapper) {
            NTMO.COTS.setDefaultKeyMapper();
        } else {
            NTMO.COTS.setFPSKeyMapper();
        }
    };

    //=============================================================================
    // Set key mapper.
    //  User can set original key mapper or FPS key mapper.
    //=============================================================================
    NTMO.COTS = function () {

    };

    NTMO.COTS.getDefaultKeyMapper = function () {
        return NTMO.COTS.defaultKeyMapper;
    };

    NTMO.COTS.getFPSKeyMapper = function () {
        return NTMO.COTS.FPSKeyMapper;
    };

    NTMO.COTS.setDefaultKeyMapper = function () {
        //Clear method is necessary to avoid input bug(ex. keep moving).
        Input.clear();
        Input.keyMapper = NTMO.COTS.getDefaultKeyMapper();
        ConfigManager.keyMapper = true;
    };

    NTMO.COTS.setFPSKeyMapper = function () {
        //Clear method is necessary to avoid input bug(ex. keep moving).
        Input.clear();
        Input.keyMapper = NTMO.COTS.getFPSKeyMapper();
        ConfigManager.keyMapper = false;
    };

    //=============================================================================
    // Window_Options
    //  Add a setting for KeyMapper.
    //=============================================================================
    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.call(this);
        this.addKeyMapperOption();
    };

    Window_Options.prototype.addKeyMapperOption = function () {
        this.addCommand(param.itemName, 'keyMapper');
    };


    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        //Initialize.
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);

        //Check if the symbol is key mapper.
        if (this.isKeyMapperSymbol(symbol)) {
            result = this.keyMapperStatusText(value);
        }

        return result;
    };

    Window_Options.prototype.isKeyMapperSymbol = function (symbol) {
        return symbol.contains('keyMapper');
    };

    Window_Options.prototype.keyMapperStatusText = function (value) {
        return value ? param.symbolDefault : param.symbolFPS;
    };

    var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function (wrap) {
        _Window_Options_cursorRight.apply(this, arguments);

        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);

        if (this.isKeyMapperSymbol(symbol)) {
            NTMO.COTS.setDefaultKeyMapper();
        }
    };

    var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function (wrap) {
        _Window_Options_cursorLeft.apply(this, arguments);
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);

        if (this.isKeyMapperSymbol(symbol)) {
            NTMO.COTS.setFPSKeyMapper();
        }
    };

    //=============================================================================
    // KeyMapperObjects
    //  Key mapper objects for mapping FPS key or default key.
    //=============================================================================
    NTMO.COTS.defaultKeyMapper = {
        9: 'tab',       // tab
        13: 'ok',       // enter
        16: 'shift',    // shift
        17: 'control',  // control
        18: 'control',  // alt
        27: 'escape',   // escape
        32: 'ok',       // space
        33: 'pageup',   // pageup
        34: 'pagedown', // pagedown
        37: 'left',     // left arrow
        38: 'up',       // up arrow
        39: 'right',    // right arrow
        40: 'down',     // down arrow
        45: 'escape',   // insert
        81: 'pageup',   // Q
        87: 'pagedown', // W
        88: 'escape',   // X
        90: 'ok',       // Z
        96: 'escape',   // numpad 0
        98: 'down',     // numpad 2
        100: 'left',    // numpad 4
        102: 'right',   // numpad 6
        104: 'up',      // numpad 8
        120: 'debug'    // F9
    };

    NTMO.COTS.FPSKeyMapper = {
        //These are default key mappings.
        9: 'tab',       // tab
        13: 'ok',       // enter
        16: 'shift',    // shift
        17: 'control',  // control
        18: 'control',  // alt
        27: 'escape',   // escape
        //32: 'ok',       // space
        33: 'pageup',   // pageup
        34: 'pagedown', // pagedown
        37: 'left',     // left arrow
        38: 'up',       // up arrow
        39: 'right',    // right arrow
        40: 'down',     // down arrow
        45: 'escape',   // insert
        //81: 'pageup',   // Q
        //87: 'pagedown', // W
        88: 'escape',   // X
        90: 'ok',       // Z
        96: 'escape',   // numpad 0
        98: 'down',     // numpad 2
        100: 'left',    // numpad 4
        102: 'right',   // numpad 6
        104: 'up',      // numpad 8
        120: 'debug',    // F9

        //These are addtional key mappings.
        65: 'left',      // A
        68: 'right',     // D
        83: 'down',      // S
        87: 'up',        // W
        81: 'pageup',    // Q
        69: 'pagedown',  // E
        70: 'ok',        // F
        32: 'escape',    // space
        67: 'escape',    // C
        86: 'escape'     // V
    };


    //Obsolete
    //=============================================================================
    // OverrideKeyMapper
    //  Override Input class for mapping FPS key.
    //=============================================================================
    //Input.keyMapper = NTMO.COTS.FPSKeyMapper;

})();