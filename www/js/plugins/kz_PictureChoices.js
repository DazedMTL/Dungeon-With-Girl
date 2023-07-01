/*:ja
 * @plugindesc v1.04 - 選択肢の表示の際、選択肢を画像で、画面の自由な場所に配置できるようにします。
 * @author Souji Kenzaki
 *
 * @param Cursor Bitmap Name
 * @type string
 * @desc カーソル画像名
 * @default Cursor
 * 
 * @param Cursor Overhead X
 * @type number
 * @min -99999
 * @desc カーソル位置調整座標X
 * @default 0
 * 
 * @param Cursor Overhead Y
 * @type number
 * @min -99999
 * @desc カーソル位置調整座標Y
 * @default 0
 * 
 * @param Cursor Max Frame
 * @type number
 * @desc カーソルアニメーションの最大フレーム数（0でアニメーションなし）
 * @default 0
 *
 * @param Cursor Frame Spacing
 * @type number
 * @desc カーソルアニメーションのフレーム間隔
 * @default 0
 * 
 * @help
 * 有効化はプラグインコマンド GraphicalChoice on
 * 無効かは同　GraphicalChoice off
 * にて行ってください。（初期状態では無効化されています）
 * 
 * ※画像はカーソル、選択肢画像共に　img/choices/　フォルダ内に入れてください。
 * 有効化中、イベントコマンドで選択肢の表示を行う際、選択肢のテキストを
 * [画像]|[x]|[y]
 * の形式にする事で画像で選択肢の表示を行う事が可能です。
 * 
 * 例として
 * choice1|30|50
 * であれば、choice1.pngを座標(30,50)に表示し選択できるようにします。
 * 
 * 尚、キーボード操作はデフォルトに準じ、上下キーでのみカーソルが動かせる事にご注意ください。
 * タッチ／クリック操作はこの制約を受けません。
 * 
 * Cursor Max Frameを1以上にする事で、カーソルをアニメーションさせる事が可能です。
 * この場合、例えばCursor Bitmap Nameが cs
 * Cursor Max Frameが3だった場合
 * cs0.png~cs3.pngまでが順に再生されその後cs0.pngに巻き戻りループします。
 * 
 * スクリプトでゲーム中に以下を変更できます。
 * 
 * カーソル基本画像cn.pngに
 * $gameSystem.ChoiceCursor.bmp = "cn";
 * 
 * カーソルのx補正値変更
 * $gameSystem.ChoiceCursor.x = 3;
 * 
 * カーソルのy補正値変更
 * $gameSystem.ChoiceCursor.y = 5;
 * 
 * カーソルアニメのフレーム数変更
 * $gameSystem.ChoiceCursor.maxFrame = 10;
 * 
 * カーソルアニメの再生間隔変更
 * $gameSystem.ChoiceCursor.interval = 20;
 * 
 * 
 * 
 * 開発協力Special Thanks：
 * サイリ様(@sairi55)
 * ヴァージニアス様(@Virgina_ss)
 */



(function () {

    var parameters = PluginManager.parameters('kz_PictureChoices');
    var _cursorBmp = String(parameters['Cursor Bitmap Name'] || "");
    var _cursorX = Number(parameters['Cursor Overhead X']) || 0;
    var _cursorY = Number(parameters['Cursor Overhead Y']) || 0;
    var _c_maxFrame = Number(parameters['Cursor Max Frame']) || 0;
    var _c_Interval = Number(parameters['Cursor Frame Spacing']) || 0;

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'GraphicalChoice') {
            $gameSystem.graphicalChoices = (args[0] == "on");
        }
    };

    ImageManager.loadChoices = function (filename, hue) {
        return this.loadBitmap('img/choices/', filename, hue, true);
    };

    const kz_Game_System_prototype_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        kz_Game_System_prototype_initialize.call(this);
        this.ChoiceCursor = {}
        this.ChoiceCursor.bmp = _cursorBmp;
        this.ChoiceCursor.x = _cursorX;
        this.ChoiceCursor.y = _cursorY;
        this.ChoiceCursor.maxFrame = _c_maxFrame;
        this.ChoiceCursor.interval = _c_Interval;
    };

    var kz_Window_ChoiceList_prototype_windowWidth = Window_ChoiceList.prototype.windowWidth;
    Window_ChoiceList.prototype.windowWidth = function () {
        if (!$gameSystem.graphicalChoices) {
            return kz_Window_ChoiceList_prototype_windowWidth.call(this);
        }
        return 0;
    };

    var kz_Window_ChoiceList_prototype_windowHeight = Window_ChoiceList.prototype.windowHeight;
    Window_ChoiceList.prototype.windowHeight = function () {
        if (!$gameSystem.graphicalChoices) {
            return kz_Window_ChoiceList_prototype_windowHeight.call(this);
        }
        return 0;
    };

    var kz_Window_ChoiceList_prototype_cursorRight = Window_ChoiceList.prototype.cursorRight;
    Window_ChoiceList.prototype.cursorRight = function (wrap) {
        if (!$gameSystem.graphicalChoices) {
            kz_Window_ChoiceList_prototype_cursorRight.call(this, wrap);
            return;
        }
        this.cursorDown(wrap);
    };

    var kz_Window_ChoiceList_prototype_cursorLeft = Window_ChoiceList.prototype.cursorLeft;
    Window_ChoiceList.prototype.cursorLeft = function (wrap) {
        if (!$gameSystem.graphicalChoices) {
            kz_Window_ChoiceList_prototype_cursorLeft.call(this, wrap);
            return;
        }
        this.cursorUp(wrap);
    };

    var kz_Window_ChoiceList_prototype_initialize = Window_ChoiceList.prototype.initialize;
    Window_ChoiceList.prototype.initialize = function (messageWindow) {
        kz_Window_ChoiceList_prototype_initialize.call(this, messageWindow);

        this._choiceSprite = [];
        this._cursorSprite = new Sprite_ChoiceCursor($gameSystem.ChoiceCursor.maxFrame, $gameSystem.ChoiceCursor.interval);
    };

    var kz_Window_ChoiceList_prototype_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function () {
        this.removeAllChoiceSprites();

        if ($gameSystem.graphicalChoices) {
            this.populateChoiceSprites();
        }

        kz_Window_ChoiceList_prototype_start.call(this);

        if ($gameSystem.graphicalChoices) {
            this.x = 0;
            this.y = 0;
        }
    };

    Window_ChoiceList.prototype.populateChoiceSprites = function () {
        var choices = $gameMessage.choices();
        for (var i = 0; i < choices.length; i++) {
            var _data = choices[i].split('|')
            this._choiceSprite[i] = new Sprite_Base();
            this._choiceSprite[i].bitmap = ImageManager.loadChoices(_data[0]);
            this._choiceSprite[i].x = _data[1] ? Number(_data[1]) : 0;
            this._choiceSprite[i].y = _data[2] ? Number(_data[2]) : 0;
            this.addChild(this._choiceSprite[i]);
        }

        this.addChild(this._cursorSprite);//再追加で一番上に出す
    }

    Window_ChoiceList.prototype.removeAllChoiceSprites = function () {
        for (var i = 0; i < this._choiceSprite.length; i++) {
            this.removeChild(this._choiceSprite[i]);
        }
        this._choiceSprite = [];
    }

    var kz_Window_ChoiceList_prototype_updateArrows = Window_ChoiceList.prototype.updateArrows;
    Window_ChoiceList.prototype.updateArrows = function () {
        kz_Window_ChoiceList_prototype_updateArrows.call(this);

        if ($gameSystem.graphicalChoices) {
            this.downArrowVisible = false;
            this.upArrowVisible = false;
        }
    };

    var kz_Window_ChoiceList_prototype_select = Window_ChoiceList.prototype.select;
    Window_ChoiceList.prototype.select = function (index) {
        kz_Window_ChoiceList_prototype_select.call(this, index);

        if ($gameSystem.graphicalChoices) {
            if (!this._cursorSprite) {
                return;
            }
            if (index < 0 || !this._choiceSprite || !this._choiceSprite[index]) {
                this._cursorSprite.hide()
                return;
            }
            this._cursorSprite.show();
            this._cursorSprite.x = this._choiceSprite[index].x + $gameSystem.ChoiceCursor.x;
            this._cursorSprite.y = this._choiceSprite[index].y + $gameSystem.ChoiceCursor.y;
        }
        else if (this._cursorSprite) {
            this._cursorSprite.hide();
        }
    };

    var kz_Window_ChoiceList_prototype_hitTest = Window_ChoiceList.prototype.hitTest;
    Window_ChoiceList.prototype.hitTest = function (x, y) {
        if (!$gameSystem.graphicalChoices) {
            return kz_Window_ChoiceList_prototype_hitTest.call(this, x, y);
        }

        if (this._choiceSprite) {
            for (var i = 0; i < this._choiceSprite.length; i++) {
                var xmin = this._choiceSprite[i].x;
                var xmax = this._choiceSprite[i].x + this._choiceSprite[i].width;
                var ymin = this._choiceSprite[i].y;
                var ymax = this._choiceSprite[i].y + this._choiceSprite[i].height;

                if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) {
                    return i;
                }
            }
        }
        return -1;
    };

    var kz_Window_ChoiceList_prototype_isTouchedInsideFrame = Window_ChoiceList.prototype.isTouchedInsideFrame;
    Window_ChoiceList.prototype.isTouchedInsideFrame = function () {
        if (!$gameSystem.graphicalChoices) {
            return kz_Window_ChoiceList_prototype_isTouchedInsideFrame.call(this);
        }
        return true;
    };

    function Sprite_ChoiceCursor() {
        this.initialize.apply(this, arguments);
    }

    Sprite_ChoiceCursor.prototype = Object.create(Sprite_Base.prototype);
    Sprite_ChoiceCursor.prototype.constructor = Sprite_Weapon;

    Sprite_ChoiceCursor.prototype.initialize = function (cursorMaxFrame, cursorInterval) {
        Sprite_Base.prototype.initialize.call(this);

        if (!cursorMaxFrame) {
            this.bitmap = ImageManager.loadChoices($gameSystem.ChoiceCursor.bmp);
        }

        this._maxFrame = cursorMaxFrame;
        this._interval = cursorInterval;
        this._currentFrame = 0;
        this._currentInterval = 0;
        this._currentCursorPicName = "";
    };

    Sprite_ChoiceCursor.prototype.update = function () {
        Sprite_Base.prototype.update.call(this);
        this.updateCursorFrameAnimation();
    };

    Sprite_ChoiceCursor.prototype.updateCursorFrameAnimation = function () {
        this._maxFrame = $gameSystem.ChoiceCursor.maxFrame;
        this._interval = $gameSystem.ChoiceCursor.interval;

        if (!this._maxFrame) {
            if (this._currentCursorPicName != $gameSystem.ChoiceCursor.bmp) {
                this.bitmap = ImageManager.loadChoices($gameSystem.ChoiceCursor.bmp);
                this._currentCursorPicName = $gameSystem.ChoiceCursor.bmp;
            }
            return;
        }

        if (this._currentInterval > this._interval) {
            this._currentFrame++;
            this._currentInterval = 0;
        }

        if (this._currentFrame > this._maxFrame) {
            this._currentFrame = 0;
        }

        if (this._currentCursorPicName != this.cursorPicName()) {
            this.bitmap = ImageManager.loadChoices(this.cursorPicName());
            this._currentCursorPicName = this.cursorPicName();
        }

        this._currentInterval++;
    };

    Sprite_ChoiceCursor.prototype.cursorPicName = function () {
        return $gameSystem.ChoiceCursor.bmp + String(this._currentFrame);
    }


})();