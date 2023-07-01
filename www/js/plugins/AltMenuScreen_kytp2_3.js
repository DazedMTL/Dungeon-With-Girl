//=============================================================================
// AltMenuScreen_kytp.js
//=============================================================================

/*:
 * @plugindesc Alternative menu screen layout.
 * @author Yoji Ojima
 *
 * @param backGroundBitmap
 * @desc 背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgwinonoff
 * @desc デフォルトウインドウを表示するか。（0:表示　1:非表示）
 * @default 0
 *
 * @param maxColsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 * 
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc メニュー画面のレイアウトを変更します。
 * @author Yoji Ojima, 神無月サスケ
 *
 * @param backGroundBitmap
 * @desc 背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgwinonoff
 * @desc デフォルトウインドウを表示するか。（0:表示　1:非表示）
 * @default 0
 *
 * @param maxColsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 * 
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc メニュー画面のレイアウトを変更します。（ＴＰ表示対応）
 * @author Yoji Ojima　（改変：ゆわか）
 *
 * @param backGroundBitmap
 * @desc 背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgwinonoff
 * @desc デフォルトウインドウを表示するか。（0:表示　1:非表示）
 * @default 0
 *
 * @param maxColsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 * 
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc メニュー画面のレイアウトを変更します。
 * @author Yoji Ojima, 神無月サスケ
 *
 * @param backGroundBitmap
 * @desc 背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgwinonoff
 * @desc デフォルトウインドウを表示するか。（0:表示　1:非表示）
 * @default 0
 *
 * @param maxColsMenu
 * @desc １画面に表示するアクター数。（5人以上は未対応）
 * @default 4
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  - アクターに立ち絵を利用します。
 *　　　　　　（この機能は、AltMenuScreen2.jsからの抜粋です）
 *
 * アクターのメモに以下のように書いてください:
 * <stand_picture:ファイル名> ファイル名が、そのアクターの立ち絵になります。
 *  ファイルは img/pictures に置いてください。
 *　記入例）
 *　<stand_picture:Package1>
 *
 *「キャンプメニューにもＴＰ表示」に対応しました。
 * アクターかクラスの特徴で、ＴＰ持ち越しを付加してないと無意味です。。
 *
 * 村人Ｃさまのご協力により、表示するアクター数が4の時は
 * フォントサイズを変更し、最大ＨＰも表示できるようになりました。
 *
 * AltMenuScreen3.jsから、背景設定機能を移植しました。
 *
 * 使用報告不要・クレジット不要・改変可・商用利用可
 * もし何か問題が起きても、当方は一切責任を負いません。ご了承ください。
 */

(function () {

    // set parameters
    var parameters = PluginManager.parameters('AltMenuScreen_kytp2_3');
    var backGroundBitmap = parameters['backGroundBitmap'] || '';
    var bgBitmapItem = parameters['bgBitmapItem'] || '';
    var bgBitmapSkill = parameters['bgBitmapSkill'] || '';
    var bgBitmapEquip = parameters['bgBitmapEquip'] || '';
    var bgBitmapStatus = parameters['bgBitmapStatus'] || '';
    var bgBitmapOptions = parameters['bgBitmapOptions'] || '';
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
    var bgBitmapGameEnd = parameters['bgBitmapGameEnd'] || '';
    var bgwinonoff = Number(parameters['bgwinonoff'] || 0);
    var maxColsMenuWnd = Number(parameters['maxColsMenu'] || 4);

    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function () {
        _Scene_Menu_create.call(this);
        this._statusWindow.x = this._commandWindow.width;
        this._statusWindow.y = 0;
        //        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        if (bgwinonoff >= 1) {
            this._statusWindow.opacity = 0;//ウインドウを透明に
            this._goldWindow.opacity = 0;//ウインドウを透明に
            this._commandWindow.opacity = 0;
        }//ウインドウを透明に
    };

    //以下各種ウインドウの設定
    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function () {
        _Scene_Item_create.call(this);
        if (bgwinonoff >= 1) {
            this._helpWindow.opacity = 0;
            this._categoryWindow.opacity = 0;
            this._itemWindow.opacity = 0;
            this._actorWindow.opacity = 0;
        }
    };

    var _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function () {
        _Scene_Skill_create.call(this);
        if (bgwinonoff >= 1) {
            this._helpWindow.opacity = 0;
            this._skillTypeWindow.opacity = 0;
            this._statusWindow.opacity = 0;
            this._itemWindow.opacity = 0;
            this._actorWindow.opacity = 0;
        }
    };

    var _Scene_Equip_create = Scene_Equip.prototype.create;
    Scene_Equip.prototype.create = function () {
        _Scene_Equip_create.call(this);
        if (bgwinonoff >= 1) {
            this._helpWindow.opacity = 0;
            this._statusWindow.opacity = 0;
            this._commandWindow.opacity = 0;
            this._slotWindow.opacity = 0;
            this._itemWindow.opacity = 0;
        }
    };

    var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function () {
        _Scene_Status_create.call(this);
        if (bgwinonoff >= 1) {
            this._statusWindow.opacity = 0;
        }
    };

    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function () {
        _Scene_Options_create.call(this);
        if (bgwinonoff >= 1) {
            this._optionsWindow.opacity = 0;
        }
    };

    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function () {
        _Scene_File_create.call(this);
        if (bgwinonoff >= 1) {
            this._helpWindow.opacity = 0;
            this._listWindow.opacity = 0;
        }
    };

    var _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function () {
        _Scene_GameEnd_create.call(this);
        if (bgwinonoff >= 1) {
            this._commandWindow.opacity = 0;
        }
    };



    // load bitmap that set in plugin parameter
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function () {
        if (backGroundBitmap) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(backGroundBitmap);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Menu_createBackground.call(this);
    };

    var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
    Scene_Item.prototype.createBackground = function () {
        if (bgBitmapItem) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapItem);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Item_createBackground.call(this);
    };

    var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
    Scene_Skill.prototype.createBackground = function () {
        if (bgBitmapSkill) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapSkill);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Skill_createBackground.call(this);
    };

    var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
    Scene_Equip.prototype.createBackground = function () {
        if (bgBitmapEquip) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapEquip);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Equip_createBackground.call(this);
    };

    var _Scene_Status_createBackground =
        Scene_Status.prototype.createBackground;
    Scene_Status.prototype.createBackground = function () {
        if (bgBitmapStatus) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapStatus);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Status_createBackground.call(this);
    };

    var _Scene_Options_createBackground =
        Scene_Options.prototype.createBackground;
    Scene_Options.prototype.createBackground = function () {
        if (bgBitmapOptions) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapOptions);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Options_createBackground.call(this);
    };

    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function () {
        if (bgBitmapFile) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_File_createBackground.call(this);
    };

    var _Scene_GameEnd_createBackground =
        Scene_GameEnd.prototype.createBackground;
    Scene_GameEnd.prototype.createBackground = function () {
        if (bgBitmapGameEnd) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
                ImageManager.loadPicture(bgBitmapGameEnd);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_GameEnd_createBackground.call(this);
    };

    //最大表示数が4人以上の場合、フォントサイズを変更する処理。（村人Ｃさまより伝授）
    Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
        width = width || 186;
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        if (maxColsMenuWnd >= 4) {//表示アクターが４人以上
            this.contents.fontSize = 20; // フォントサイズを 20
        }
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
            this.hpColor(actor), this.normalColor());
        this.contents.fontSize = this.standardFontSize(); // フォントサイズを元に戻す
    };

    Window_Base.prototype.drawActorMp = function (actor, x, y, width) {
        width = width || 186;
        var color1 = this.mpGaugeColor1();
        var color2 = this.mpGaugeColor2();
        if (maxColsMenuWnd >= 4) {//表示アクターが４人以上
            this.contents.fontSize = 20; // フォントサイズを 20
        }
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y, 44);
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
            this.mpColor(actor), this.normalColor());
        this.contents.fontSize = this.standardFontSize(); // フォントサイズを元に戻す
    };

    Window_Base.prototype.drawActorTp = function (actor, x, y, width) {
        width = width || 96;
        var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
        if (maxColsMenuWnd >= 4) {//表示アクターが４人以上
            this.contents.fontSize = 20; // フォントサイズを 20
        }
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y, 64, 'right');
        this.contents.fontSize = this.standardFontSize(); // フォントサイズを元に戻す
    };



    //AltMenuScreenより抜粋
    Window_MenuStatus.prototype.maxCols = function () {
        return maxColsMenuWnd;//１ページのアクター数
    };

    Window_MenuStatus.prototype.numVisibleRows = function () {
        return 1;
    };


    Window_MenuStatus.prototype.drawItemImage = function (index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if (bitmap) {
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
        } else { // when bitmap is not set, do the original process.
            this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
        }
        this.changePaintOpacity(true);
    };




    //最大表示数が4人以上の場合、フォントサイズを変更する処理。（村人Ｃさまより伝授）
    Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
        width = width || 186;
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        if (maxColsMenuWnd >= 4) {//表示アクターが４人以上
            this.contents.fontSize = 20; // フォントサイズを 20
        }
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
            this.hpColor(actor), this.normalColor());
        this.contents.fontSize = this.standardFontSize(); // フォントサイズを元に戻す
    };

    Window_Base.prototype.drawActorMp = function (actor, x, y, width) {
        width = width || 186;
        var color1 = this.mpGaugeColor1();
        var color2 = this.mpGaugeColor2();
        if (maxColsMenuWnd >= 4) {//表示アクターが４人以上
            this.contents.fontSize = 20; // フォントサイズを 20
        }
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y, 44);
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
            this.mpColor(actor), this.normalColor());
        this.contents.fontSize = this.standardFontSize(); // フォントサイズを元に戻す
    };

    Window_Base.prototype.drawActorTp = function (actor, x, y, width) {
        width = width || 96;
        var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
        if (maxColsMenuWnd >= 4) {//表示アクターが４人以上
            this.contents.fontSize = 20; // フォントサイズを 20
        }
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y, 64, 'right');
        this.contents.fontSize = this.standardFontSize(); // フォントサイズを元に戻す
    };



    //AltMenuScreenより抜粋
    Window_MenuStatus.prototype.maxCols = function () {
        return maxColsMenuWnd;//１ページのアクター数
    };

    Window_MenuStatus.prototype.numVisibleRows = function () {
        return 1;
    };

    Window_MenuStatus.prototype.drawItemImage = function (index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if (bitmap) {
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
        } else { // when bitmap is not set, do the original process.
            this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
        }
        this.changePaintOpacity(true);
    };

    //表示アクターが５人以上の時、レベルの数値の表示位置を変更する。
    Window_Base.prototype.drawActorLevel = function (actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        if (maxColsMenuWnd >= 5) {//表示アクターが5人以上
            this.drawText(actor.level, x + 34, y, 36, 'right');
        } else {
            this.drawText(actor.level, x + 84, y, 36, 'right');
        }
    };


    //AltMenuScreenメニュー画面のステータス表示位置（ＴＰ追加）
    Window_MenuStatus.prototype.drawItemStatus = function (index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorLevel(actor, x, y + lineHeight * 1, width);
        this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
        this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
        this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
        this.drawActorTp(actor, x, bottom - lineHeight * 1, width);//追加
        this.drawActorIcons(actor, x, bottom - lineHeight * 5, width);//位置変更
    };

    //ＴＰを追加（スキル画面）
    Window_Base.prototype.drawActorSimpleStatus = function (actor, x, y, width) {
        var lineHeight = this.lineHeight();
        var x2 = x + 180;
        var width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x2, (y + lineHeight * 1) - 6, width2);
        this.drawActorMp(actor, x2, (y + lineHeight * 2) - 11, width2);
        this.drawActorTp(actor, x2, (y + lineHeight * 3) - 16, width2);
    };

    //ＴＰを追加（ステータス画面）
    Window_Status.prototype.drawBasicInfo = function (x, y) {
        var lineHeight = this.lineHeight();
        this.drawActorLevel(this._actor, x, (y + lineHeight * 0) - 16);
        this.drawActorIcons(this._actor, x, (y + lineHeight * 1) - 18);
        this.drawActorHp(this._actor, x, (y + lineHeight * 2) - 18);
        this.drawActorMp(this._actor, x, (y + lineHeight * 3) - 20);
        this.drawActorTp(this._actor, x, (y + lineHeight * 4) - 22, 185);
    };

})();
