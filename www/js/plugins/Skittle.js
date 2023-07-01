//=============================================================================
// Skittle.js
//=============================================================================

/*:ja
 * v0.1.0
 * @plugindesc
 * 自作ゲージのメーターを増減する
 *
 * @author オオホタルサイコ
 * 
 * @param Container
 * @default
 * @desc 容器(img/system)
 * 
 * @param Content
 * @default
 * @desc 容量(img/system)
 * 
 * @param Capacity
 * @default 100
 * @desc 最大値
 * 
 * @param Default
 * @default 100
 * @desc 開始値
 * 
 * @param Variable
 * @default 1
 * @desc 容量値格納先変数番号
 * 
 * @param Visible
 * @default true
 * @desc 表示状態
 * 
 * @param Location
 * @default 0 0
 * @desc 座標[X Y]を設定
 * 
 * @param Size
 * @default 100 100
 * @desc 画像のサイズ[Width Height]を設定
 * 
 * @param Margin
 * @default 0 0
 * @desc 中身の余白(上下)[MarginTop MarginBottom]を指定
 * 
 * @help ■概要
 * Skittleプラグインを利用するにはプラグインコマンドから実行します。
 * プラグインコマンドを実行するとイベント内でメーターの増減、表示を行います。
 * 
 * ■プラグインコマンド
 *   Skittle add [増減値]            # ゲージの増減を行う
 *   Skittle visivle [表示状態]      # ゲージの表示状態を制御
 */

/* 
 * 共通処理系
 */
var parseIntStrict = function (value) {
    var result = parseInt(value, 10);
    if (isNaN(result)) result = 0;
    return result;
};

/*
 * 中身
 */
var Content = (function () {
    // クラス変数
    var sprite = null;

    // コンストラクタ
    var Content = function (skittle, location, size, parameters) {
        if (!(this instanceof Content)) {
            return new Content(skittle, fileName, location, size, margin);
        }
        this.skittle = skittle;
        this.size = size;
        this.remains = 0;

        var fileName = parameters['Content'] || '';
        this.margin = parameters['Margin'].split(' ').map(s => parseIntStrict(s));
        this.variable = parseIntStrict(parameters['Variable']) || 0;

        this.LoadSprite(fileName, location, size);
        this.ReflectsRemainigHeight();
    }

    // プロトタイプ内でメソッドを定義
    Content.prototype.LoadSprite = function (fileName, location, size) {
        sprite = new Sprite();
        sprite.bitmap = ImageManager.loadSystem(fileName);
        sprite.x = location[0] + size[0];
        sprite.y = location[1] + size[1];
        sprite.rotation = 180 * Math.PI / 180;
    }

    Content.prototype.Scale = function () {
        // 純粋な画像部分の高さ / ゲージの最大量
        return (this.size[1] - this.margin[0] - this.margin[1]) / this.skittle.Capacity;
    }
    Content.prototype.RemainingHeight = function () {
        // 余白下を差し引いて画像の表示幅を調整
        return this.remains * this.Scale() - this.margin[1];
    }

    Content.prototype.Sprite = function () {
        return sprite;
    }
    Content.prototype.getX = function () {
        return this.Sprite().x;
    }
    Content.prototype.getY = function () {
        return this.Sprite().y;
    }

    Content.prototype.ReflectsRemainigHeight = function () {
        this.Sprite().setFrame(0, 0, this.size[0], this.RemainingHeight());
    }

    Content.prototype.setValue = function (value) {
        this.remains += value;
        if (this.remains < 0) this.remains = 0;
        if (this.remains > this.skittle.Capacity) this.remains = this.skittle.Capacity;
        this.ReflectsRemainigHeight();
        $gameVariables.setValue(this.variable, this.remains);
    }

    return Content;
})();

/* 
 *本体
 */
var Skittle = (function () {
    // クラス内変数
    var parameters = null;
    // コンストラクタ
    var Skittle = function () {
        if (!(this instanceof Skittle)) {
            return new Skittle();
        }
        this.isFirst = true;
        this.IsDisp = true;
        this.startAnimetion = false;
        this.animeContents = '';
        this.addContent = 0;
        this.initialize();
    }

    Skittle.prototype.clearValue = function () {
        this.clearAnimetion();
        this.addContent = 0;
    }

    Skittle.prototype.clearAnimetion = function () {
        this.animeContents = '';
        this.startAnimetion = false;
    };

    // プロトタイプ内でメソッドを定義
    Skittle.prototype.initialize = function () {
        parameters = PluginManager.parameters('Skittle');

        var container = parameters['Container'] || '';
        var location = parameters['Location'].split(' ').map(s => parseIntStrict(s));
        var size = parameters['Size'].split(' ').map(s => parseIntStrict(s));
        this.IsDisp = eval(parameters['Visible']);
        this.Displyed = !this.IsDisp;
        this.Capacity = parseIntStrict(parameters['Capacity']) || 0;

        // 中身の描画
        this.content = new Content(this, location, size, parameters);
        this.content.setValue(parseIntStrict(parameters['Default']) || 0);

        // 容器の描画
        this.LoadSprite(container, location);

        this.clearValue();
    }

    Skittle.prototype.LoadSprite = function (fileName, location) {
        sprite = new Sprite();
        sprite.bitmap = ImageManager.loadSystem(fileName);
        sprite.x = location[0];
        sprite.y = location[1];
    }

    Skittle.prototype.Sprite = function () {
        return sprite;
    }

    Skittle.prototype.setParameter = function (args) {
        //parse
        if (args.length < 2) {
            throw new SyntaxError("setParameter: args is invalid.");
        }
        this.animeContents = args[0];
        if (args[0] == 'visible') {
            this.IsDisp = eval(args[1]);
        } else {
            this.addContent = parseIntStrict(args[1]);
            this.startAnimetion = true;
        }
        return true;
    };

    Skittle.prototype.update = function () {
        if (this.startAnimetion) {
            if (this.animeContents == 'add') {
                //ゲージのアニメーションを行う
                if (this.addContent > 0) {
                    var add = 1;
                    this.addContent -= add;
                    this.content.setValue(add);
                }
                else if (this.addContent < 0) {
                    var add = -1
                    this.addContent -= add;
                    this.content.setValue(add);
                }
                else {
                    this.startAnimetion = false;
                }
            }
        }
        return true;
    };

    return Skittle;
})();

// グローバル変数
var $skittle = null;

/*
 * インスタンスの生成
 * プラグイン実行
 * セーブデータの保存・読み込み
 * メーターの表示制御
 */
(function () {
    //-----------------------------------------------------------------------------
    // インスタンスの生成（ゲーム起動時に呼ばれる）
    //-----------------------------------------------------------------------------
    var createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        createGameObjects.call(this);

        // ゲージの作成
        $skittle = new Skittle();
    };

    //-----------------------------------------------------------------------------
    // プラグイン実行
    //-----------------------------------------------------------------------------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Skittle') {
            switch (args[0]) {
                case 'add':
                case 'visible':
                    //増減したい値を設定したい
                    //表示するかの設定をしたい
                    if ($skittle.startAnimetion) return;
                    $skittle.setParameter(args);
                    break;
                default:
                    break;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // セーブデータの生成
    //-----------------------------------------------------------------------------
    var makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        // セーブデータ本体
        var contents = makeSaveContents.call(this);

        // ゲージをセーブデータに設定する。
        contents.skittle = $skittle;
        return contents;
    };

    //-----------------------------------------------------------------------------
    // セーブデータの読み込み
    //-----------------------------------------------------------------------------
    var extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        // セーブデータ本体を取得
        extractSaveContents.call(this, contents);

        // Skittleを読み込み
        $skittle = contents.skittle;
        $skittle.content.ReflectsRemainigHeight();
    };

    //-----------------------------------------------------------------------------
    // メーターの表示制御
    // 画像の表示・非表示は子の追加・削除で対応
    //-----------------------------------------------------------------------------
    var _Spriteset_Map = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map.call(this);
        $skittle.update();
        // ゲージが表示状態になっていない場合で表示フラグがONの場合に表示
        if ($skittle != null && $skittle.IsDisp) {
            $skittle.Displyed = true;
            this.addChild($skittle.content.Sprite());
            this.addChild($skittle.Sprite());
        }
        // ゲージが非表示状態になっていない場合で表示フラグがOFFの場合に表示
        else if ($skittle != null && !$skittle.IsDisp) {
            $skittle.Displyed = false;
            this.removeChild($skittle.content.Sprite());
            this.removeChild($skittle.Sprite());
        }
    };
})();
