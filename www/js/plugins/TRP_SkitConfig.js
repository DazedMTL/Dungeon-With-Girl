//=============================================================================
// TRP_SkitConfig.js
//============================================================================= 

//=============================================================================
/*:
 * @plugindesc TRP_Skitの設定用プラグイン。TRP_Skitより上に配置。
 * @author Thirop
 *
 * @help
 * このプラグインを最新版のファイルに更新する際は、
 * プロジェクトのバックアップを取った上でそのままファイルを上書きして下さい。
 * 対応する本体(TRP_Skit.js)バージョンはv1.06です。
 * 
 * 【更新履歴】
 * 1.05 2019/12/10 イージング種類追加。Y移動コマンド対応。
 * 1.04 2019/6/22  画像向き反転、アニメーション反転無効の設定を追加
 * 1.03 2018/12/6  制御文字の割当変更設定の追加
 * 1.02 2018/11/29 アニメーション表示位置設定の追加
 * 1.01 2018/11/20 左右反転の有無、立ち絵の基本拡大率項目の追加。
 * 1.00 2018/11/17 初版
 * 
 * @param categoryBasic
 * @text 【必須設定】
 * @default ==============================
 * 
 * @param SkitActorSettings
 * @text 　立ち絵キャラクター設定
 * @desc 各行・空行をダブルクリックして立ち絵キャラの設定ができます。
 * @type struct<SkitActor>[]
 * @default ["{\"name\":\"ハロルド\",\"basic\":\"==============================\",\"inputName\":\"ハロ\",\"fileName\":\"halold\",\"displayAdjust\":\"==============================\",\"animationOffsetX\":\"0\",\"animationOffsetY\":\"0\",\"displayX\":\"0\",\"displayY\":\"0\"}"]
 * @parent categoryBasic
 *
 * @param firstPictureId
 * @text 　使用ピクチャの開始番号
 * @desc 立ち絵の表示で使用するピクチャ番号の初めの番号を設定してください。（"開始番号"から"終わり番号"まで占有します）
 * @type number
 * @default 1
 * @parent categoryBasic
 * 
 * @param lastPictureId
 * @text 　使用ピクチャの終わり番号
 * @desc 「"終わり番号"-"開始番号"」の値が＜立ち絵の最大表示数＞となります。
 * @type number
 * @default 10
 * @parent categoryBasic
 *
 * @param useDefaultExpression
 * @text 　デフォルト表情の使用
 * @desc 各ポーズを表示時に指定がなければ「ポーズ名_default.png」の表情を表示。
 * @type boolean
 * @default true
 * @parent categoryBasic
 * 
 * @param categoryDisplayPosition
 * @text 【表示の一般設定】
 * @default ────────────────
 *
 * @param zOrder
 * @text 立ち絵の画面重なり順
 * @desc 立ち絵を表示する重なり順を設定します。初期値はピクチャーの後ろ(2)
 * @type select
 * @option メッセージウィンドウの手前
 * @value 0
 * @option ピクチャの手前
 * @value 1
 * @option ピクチャの後ろ
 * @value 2
 * @default 2
 * @parent categoryDisplayPosition
 *
 * @param verticalPositionType
 * @text 　立ち絵の表示位置
 * @type select
 * @option メッセージウィンドウの上端にフィット
 * @value 0
 * @option 画面の下端にフィット
 * @value 1
 * @default 1
 * @parent categoryDisplayPosition
 *
 * @param baseOffsetY
 * @text 　立ち絵のy座標調整
 * @desc 立ち絵表示をy方向にずらす大きさ(100とすると上方向に100pixelずれて表示、デフォルトは0)
 * @type number
 * @default 0
 * @min -1000
 * @parent categoryDisplayPosition
 *
 * @param xPosition
 * @text 　ポジションの略称設定
 * @type struct<XPosition>[]
 * @desc ポジションの略称と位置を登録します。0が画面左端で10が画面右端
 * @default ["{\"name\":\"中央\",\"position\":\"5.0\"}","{\"name\":\"center\",\"position\":\"5.0\"}","{\"name\":\"左\",\"position\":\"2.0\"}","{\"name\":\"left\",\"position\":\"2.0\"}","{\"name\":\"右\",\"position\":\"8.0\"}","{\"name\":\"right\",\"position\":\"8.0\"}"]
 * @parent categoryDisplayPosition
 *
 * @param noReverse
 * @text 左右の自動反転無効
 * @desc 立ち絵を左右で表示させる際の自動反転表示の無効化設定。初期値はOFF(false)で自動反転有効。
 * @type boolean
 * @default false
 * @parent categoryDisplayPosition
 *
 * @param noAnimationMirror
 * @text アニメーションの自動反転無効
 * @desc デフォルト(OFF/false)では立ち絵の向きによってアニメーションを反転させますが、ON(true)にすることで反転を無効。
 * @type boolean
 * @parent categoryDisplayPosition
 *
 * @param useRightDirection
 * @text 右向き画像を使用
 * @desc デフォルト(OFF/false)では左向きの立ち絵画像を使いますが、ON(true)にすることで右向き画像を使用。
 * @type boolean
 * @default false
 * @parent categoryDisplayPosition
 *
 * @param bustsScale
 * @text 立ち絵の基本拡大率(%)
 * @desc 立ち絵の基本拡大率(%)
 * @type number
 * @default 100
 * @parent categoryDisplayPosition
 * 
 * 
 * @param border
 * @text ↓↓↓詳細/上級設定↓↓↓
 * @default ================================
 *
 * @param macro
 * @text マクロの登録１
 * @type struct<Macro>[]
 * @desc コマンドとパラメータをまとめてマクロとして登録できます。詳しくはマニュアルを御覧ください。（１〜４に区別はないので、整理用に使い分け可能）
 * @default ["{\"name\":\"pop1\",\"macro\":\"jump shizu t 30 d 180\"}","{\"name\":\"pop2\",\"macro\":\"jump shizu t 80\"}","{\"name\":\"pop\",\"macro\":\"sequence shizu t d pop1 pop2\"}","{\"name\":\"double1\",\"macro\":\"jump shizu t 30 1.7\"}","{\"name\":\"double\",\"macro\":\"sequence shizu t d double1 double1\"}","{\"name\":\"nod\",\"macro\":\"jump shizu t 25 0.9 180\"}","{\"name\":\"stamp1\",\"macro\":\"jump shizu t 5 0.3\"}","{\"name\":\"stamp\",\"macro\":\"sequence shizu t t stamp1 stamp1 stamp1 stamp1 stamp1 stamp1\"}","{\"name\":\"slide\",\"macro\":\"slidef shizu t\"}","{\"name\":\"slidef\",\"macro\":\"shake shizu t 10 1 15 t\"}","{\"name\":\"slideb\",\"macro\":\"shake shizu t 10 1 15\"}","{\"name\":\"tremble\",\"macro\":\"shake shizu t 4 10 6\"}","{\"name\":\"rock\",\"macro\":\"shake shizu t 5 5 25 t\"}","{\"name\":\"push\",\"macro\":\"shake shizu t 17 1 16 t\"}","{\"name\":\"attack\",\"macro\":\"shake shizu t 17 1 15\"}"]
 *
 * @param macro2
 * @text マクロの登録２
 * @type struct<Macro>[]
 * @desc コマンドとパラメータをまとめてマクロとして登録できます。詳しくはマニュアルを御覧ください。（１〜５に区別はないので、整理用に使い分け可能）
 * @default []
 *
 * @param macro3
 * @text マクロの登録３
 * @type struct<Macro>[]
 * @desc コマンドとパラメータをまとめてマクロとして登録できます。詳しくはマニュアルを御覧ください。（１〜５に区別はないので、整理用に使い分け可能）
 * @default []
 *
 * @param macro4
 * @text マクロの登録４
 * @type struct<Macro>[]
 * @desc コマンドとパラメータをまとめてマクロとして登録できます。詳しくはマニュアルを御覧ください。（１〜５に区別はないので、整理用に使い分け可能）
 * @default []
 *
 * @param macro5
 * @text マクロの登録５
 * @type struct<Macro>[]
 * @desc コマンドとパラメータをまとめてマクロとして登録できます。詳しくはマニュアルを御覧ください。（１〜５に区別はないので、整理用に使い分け可能）
 * @default ["{\"name\":\"loopstamp1\",\"macro\":\"jump shizu t 5 0.3\"}","{\"name\":\"loopstamp\",\"macro\":\"loop shizu t d stamp1\"}","{\"name\":\"looptremble1\",\"macro\":\"shake shizu t 4 10 2\"}","{\"name\":\"looptremble\",\"macro\":\"loop shizu t d looptremble1\"}","{\"name\":\"looprock1\",\"macro\":\"shake shizu t 5 4 25 t\"}","{\"name\":\"looprock\",\"macro\":\"loop shizu t d looprock1\"}","{\"name\":\"loopfloat1\",\"macro\":\"y shizu t 10 45\"}","{\"name\":\"loopfloat2\",\"macro\":\"y shizu t -10 45\"}","{\"name\":\"loopfloat\",\"macro\":\"loop shizu t d loopfloat1 loopfloat2\"}"]
 *
 * @param mobNames
 * @text モブキャラの登録
 * @type string[]
 * @desc 立ち絵のないモブキャラの名前を登録すると、モブキャラの発言時に立ち絵キャラが自動アンフォーカスされます。
 * @default []
 *
 * @param controlCharacters
 * @text 制御文字の変更
 * @type struct<ControlCharacters>
 * @desc 制御文字の割当を変更。大文字のアルファベットの組み合わせ、かつツクールデフォ（V,N,P,G,C,I）や他プラグインで使う文字/単語を避けて設定してください。
 * @default {"expression":"SE","pose":"SP","animation":"SA","motion":"SM"}
 *
 * @param categoryAppearCommands
 * @text 【出現系コマンド】
 * @default ────────────────
 *
 * @param defaultPositionX
 * @text 　出現ポジション(デフォ値)
 * @desc ポジションを指定しない場合のデフォルト値。(初期値は'左'、数値も可)
 * @default left
 * @parent categoryAppearCommands
 *
 * @param pushInMargin
 * @text プッシュイン間隔(デフォ値)
 * @desc キャラ登場時に確保する周囲のキャラとの間隔。初期値は2。
 * @type number
 * @decimals 1
 * @default 2
 * @parent categoryAppearCommands
 *
 * @param pushInSpeed
 * @text プッシュインスピード(デフォ値)
 * @desc プッシュインで捌けさせるキャラの移動速度。初期値は5。
 * @type number
 * @default 5
 * @parent categoryAppearCommands
 *
 * @param fadeIn
 * @text 　《フェードイン》の設定
 * @desc 《フェードイン》コマンドの設定
 * @type struct<FadeIn>
 * @default {"duration":"12","wait":"true","easeType":"3","pushIn":"true"}
 * @parent categoryAppearCommands
 *
 * @param slideIn
 * @text 　《スライドイン》の設定
 * @desc 《スライドイン》コマンドの設定
 * @type struct<SlideIn>
 * @default {"speed":"4","slideLength":"1","wait":"true","easeType":"3","pushIn":"true"}
 * @parent categoryAppearCommands
 *
 * @param moveIn
 * @text 　《ムーブイン》の設定
 * @desc 《ムーブイン》コマンドの設定
 * @type struct<MoveIn>
 * @default {"speed":"14","wait":"true","easeType":"3","pushIn":"true"}
 * @parent categoryAppearCommands
 *
 * @param categoryDisappearCommands
 * @text 【退出系コマンド】
 * @default ────────────────
 *
 * @param defaultDisappear
 * @text デフォルトの退出コマンド
 * @desc end/終了 コマンド時などの退出コマンド
 * @type select
 * @option フェードアウト
 * @value 0
 * @option ムーブアウト
 * @value 1
 * @option スライドアウト
 * @value 2
 * @default 1
 * @parent categoryDisappearCommands
 *
 * @param fadeOut
 * @text 　《フェードアウト》の設定
 * @desc 《フェードアウト》コマンドの設定
 * @type struct<FadeOut>
 * @default {"duration":"12","wait":"true","easeType":"3"}
 * @parent categoryDisappearCommands
 * 
 * @param slideOut
 * @text 　《スライドアウト》の設定
 * @desc 《スライドアウト》コマンドの設定
 * @type struct<SlideOut>
 * @default {"speed":"6","slideLength":"1","wait":"true","easeType":"3"}
 * @parent categoryDisappearCommands
 *
 * @param moveOut
 * @text 　《ムーブアウト》の設定
 * @desc 《ムーブアウト》コマンドの設定
 * @type struct<MoveOut>
 * @default {"speed":"14","wait":"true","easeType":"3"}
 * @parent categoryDisappearCommands
 *
 * @param categoryExpCommands
 * @text 【表情/ポーズ系コマンド】
 * @default ────────────────
 *
 * @param expression
 * @text 　《表情》の設定
 * @desc 《表情》コマンドの設定
 * @type struct<Expression>
 * @default {"duration":"4","wait":"false"}
 * @parent categoryExpCommands
 *
 * @param pose
 * @text 　《ポーズ》の設定
 * @desc 《ポーズ》コマンドの設定
 * @type struct<Pose>
 * @default {"style":"1","duration":"16","wait":"false","easeType":"0"}
 * @parent categoryExpCommands
 *
 * @param categoryMoveCommands
 * @text 【動作系コマンド】
 * @default ────────────────
 * @param speed
 * @text 　移動スピードの略称設定
 * @type struct<Speed>[]
 * @desc 移動スピードの名前と値を登録します。
 * @default ["{\"name\":\"verySlow\",\"speed\":\"3.0\"}","{\"name\":\"slow\",\"speed\":\"6.0\"}","{\"name\":\"littleSlow\",\"speed\":\"9.0\"}","{\"name\":\"normal\",\"speed\":\"12.0\"}","{\"name\":\"littleFast\",\"speed\":\"15.0\"}","{\"name\":\"fast\",\"speed\":\"20.0\"}","{\"name\":\"veryFast\",\"speed\":\"30.0\"}"]
 * @parent categoryMoveCommands
 *
 * @param move
 * @text 　《移動》の設定
 * @desc 《移動》コマンドの設定
 * @type struct<Move>
 * @default {"speed":"12","wait":"false","easeType":"3"}
 * @parent categoryMoveCommands
 *
 * @param yMove
 * @text 　《Y移動》の設定
 * @desc 《Y移動》コマンドの設定
 * @type struct<YMove>
 * @default {"duration":"20","wait":"false","easeType":"3"}
 * @parent categoryMoveCommands
 *
 * @param jump
 * @text 　《ジャンプ》の設定
 * @desc 《ジャンプ》コマンドの設定
 * @type struct<Jump>
 * @default {"height":"80","gravity":"1.5","wait":"false"}
 * @parent categoryMoveCommands
 *
 * @param step
 * @text 　《ステップ》の設定
 * @desc 《ステップ》コマンドの設定
 * @type struct<Step>
 * @default {"height":"20","gravity":"0.5","speed":"1.5","wait":"false","relative":"0","easeType":"3"}
 * @parent categoryMoveCommands
 *
 * @param flip
 * @text 　《反転》の設定
 * @desc 《反転》コマンドの設定
 * @type struct<Flip>
 * @default {"num":"1","durationPerCount":"14","wait":"true","easeType":"0"}
 * @parent categoryMoveCommands
 *
 * @param shake
 * @text 　《シェイク》の設定
 * @desc 《シェイク》コマンドの設定
 * @type struct<Shake>
 * @default {"strength":"8","count":"2","durationPerCount":"6","wait":"false","easeType":"3"}
 * @parent categoryMoveCommands
 *
 * @param angle
 * @text 　《回転》の設定
 * @desc 《回転》コマンドの設定
 * @type struct<Angle>
 * @default {"angle":"360","duration":"60","relative":"1","wait":"false","easeType":"3"}
 * @parent categoryMoveCommands
 *
 * @param scale
 * @text 　《拡大率》の設定
 * @desc 《拡大率》コマンドの設定
 * @type struct<Scale>
 * @default {"scaleX":"100","scaleY":"100","duration":"20","relative":"0","wait":"false","easeType":"3"}
 * @parent categoryMoveCommands
 *
 * @param categoryEffectCommands
 * @text 【演出系コマンド】
 * @default ────────────────
 * 
 * @param animation
 * @text 　《アニメーション》の設定
 * @desc 《アニメーション》コマンドの設定
 * @type struct<Animation>
 * @default {"list":"[]","focus":"true","mirror":"false","wait":"false"}
 * @parent categoryEffectCommands
 *
 * @param opacity
 * @text 　《透明度》の設定
 * @desc 《透明度》コマンドの設定
 * @type struct<Opacity>
 * @default {"duration":"20","opacity":"0","relative":"0","wait":"false","easeType":"3"}
 * @parent categoryEffectCommands
 *
 * @param focus
 * @text 　《フォーカス》の設定
 * @desc 《フォーカス》コマンドの設定
 * @type struct<Focus>
 * @default {"duration":"10","wait":"false","easeType":"3"}
 * @parent categoryEffectCommands
 *
 * @param unFocus
 * @text 　《アンフォーカス》の設定
 * @desc 《アンフォーカス》コマンドの設定
 * @type struct<UnFocus>
 * @default {"duration":"10","tone":"-90 -90 -90 0","scale":"97","wait":"false","easeType":"3"}
 * @parent categoryEffectCommands
 *
 * @param emphasize
 * @text 　《強調》の設定
 * @desc 《強調》コマンドの設定
 * @type struct<Emphasize>
 * @default {"duration":"20","tone":"0 0 0 0","scaleX":"120","scaleY":"120","num":"1","interval":"20","wait":"true","easeType":"3"}
 * @parent categoryEffectCommands
 *
 * @param tint
 * @text 　《色調》の設定
 * @desc 《色調》コマンドの設定
 * @type struct<Tint>
 * @default {"duration":"20","tone":"0 0 0 0","wait":"false"}
 * @parent categoryEffectCommands
 *
 */
//============================================================================= 

/*~struct~SkitActor:
 * @param name
 * @text キャラクター名
 * @desc メッセージで表示するキャラクター名
 *
 * @param inputName
 * @text 入力キャラクター名
 * @desc メッセージやプラグインコマンドで入力するキャラクター名の略名。（省略で"キャラクター名"と同じ）
 * 
 * @param fileName
 * @text フォルダ名
 * @desc キャラ毎の画像を保存するフォルダ名(アルファベット推奨、他のキャラと重複不可)
 *
 * @param displayOffsetY
 * @text 立ち絵表示Y座標
 * @desc 立ち絵のの垂直方向にずらす量（デフォルト：0）
 * @type number
 * @min -10000
 * @default 0
 *
 * @param animationOffsetX
 * @text アニメーション表示X
 * @desc アニメーション表示の水平方向にずらす量（デフォルト：0）
 * @type number
 * @min -10000
 * @default 0
 *
 * @param animationOffsetY
 * @text アニメーション表示Y
 * @desc アニメーション表示の垂直方向にずらす量（デフォルト：0）
 * @type number
 * @min -10000
 * @default 0
 */

/*~struct~XPosition:
 * @param name
 * @text 名称
 * @desc ポジションの指定で数字の代わりに置き換えられる名称
 * 
 * @param position
 * @text 位置
 * @desc 表示位置(0:左端,10:右端)
 * @type number
 * @decimals 1
 * @min -10
 * @max 20
 */
/*~struct~Speed:
 * @param name
 * @text 略称
 * @desc 速度の指定で数字の代わりに置き換えられる名称
 * 
 * @param speed
 * @text スピード
 * @desc スピード10は1秒で画面端から画面端(ポジション差10)まで移動する速さ。
 * @type number
 * @decimals 1
 * @min 0.1
 */


/*~struct~ControlCharacters:
 * @param expression
 * @text 表情の変更
 * @desc 表情変更の制御文字（デフォルトはSE）
 * @default SE
 *
 * @param pose
 * @text ポーズの変更
 * @desc ポーズ変更の制御文字（デフォルトはSP）
 * @default SP
 *
 * @param motion
 * @text モーション/マクロの実行
 * @desc キャラを対象としたモーション/マクロコマンド実行の制御文字（デフォルトはSM）
 * @default SM
 *
 * @param animation
 * @text アニメーションの実行
 * @desc アニメーション表示の制御文字（デフォルトはSA）
 * @default SA
 */

/*~struct~FadeIn:
 * @param duration
 * @text フレーム[デフォ値]
 * @desc フェードインにかかるフレーム数（時間）のデフォルト値（初期値12)
 * @type number
 * @min 0
 * @default 12
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc フェードインコマンドのウェイトのデフォルト値
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 *
 * @param pushIn
 * @text プッシュイン[デフォ値]
 * @desc プッシュインのデフォルト値。trueで登場地点近くのキャラを自動的に捌けさせます。初期値はtrue。
 * @type boolean
 * @default true
 */
/*~struct~FadeOut:
 * @param duration
 * @text フレーム[デフォ値]
 * @desc フェードアウトにかかるフレーム数（時間）のデフォルト値(初期値12)
 * @type number
 * @min 0
 * @default 12
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc フェードアウトコマンドのウェイトのデフォルト値(初期値true)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~SlideIn:
 * @param speed
 * @text スピード[デフォ値]
 * @desc スライドスピードのデフォルト値(初期値4)
 * @type number
 * @min 0
 * @default 4
 *
 * @param slideLength
 * @text スライド幅[デフォ値]
 * @desc フェード幅のデフォルト値(初期値１)
 * @type number
 * @default 1
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc スライドインコマンドのウェイトのデフォルト値(初期値true)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 *
 * @param pushIn
 * @text プッシュイン[デフォ値]
 * @desc プッシュインのデフォルト値。trueで登場地点近くのキャラを自動的に捌けさせます。初期値はtrue。
 * @type boolean
 * @default true
 */
/*~struct~SlideOut:
 * @param speed
 * @text スピード[デフォ値]
 * @desc スライドスピードのデフォルト値(初期値6)
 * @type number
 * @min 0
 * @default 6
 *
 * @param slideLength
 * @text スライド幅[デフォ値]
 * @desc フェード幅のデフォルト値(初期値１)
 * @type number
 * @default 1
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc スライドアウトコマンドのウェイトのデフォルト値(初期値true)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~MoveIn:
 * @param speed
 * @text スピード[デフォ値]
 * @desc ムーブインスピードのデフォルト値(初期値14)
 * @type number
 * @min 0
 * @default 14
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc ムーブインコマンドのウェイトのデフォルト値(初期値true)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 *
 * @param pushIn
 * @text プッシュイン[デフォ値]
 * @desc プッシュインのデフォルト値。trueで登場地点近くのキャラを自動的に捌けさせます。初期値はtrue。
 * @type boolean
 * @default true
 */
/*~struct~MoveOut:
 * @param speed
 * @text スピード[デフォ値]
 * @desc ムーブアウトスピードのデフォルト値(初期値14)
 * @type number
 * @min 0
 * @default 14
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc ムーブアウトコマンドのウェイトのデフォルト値(初期値true)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~Expression:
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc 表情変化に要する時間のデフォルト値(初期値6)
 * @type number
 * @min 0
 * @default 4
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc ウェイト有無のデフォルト値(初期値false)
 * @type boolean
 * @default false
 */
/*~struct~Pose:
 * @param style
 * @text 切り替え方法[デフォ値]
 * @desc ポーズの切り替え方法
 * @type select
 * @option 瞬時に切り替え
 * @value 0
 * @option 反転して切り替え
 * @value 1
 * @option フェードで切り替え
 * @value 2
 * @default 1
 *
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc ポーズ変化に要する時間のデフォルト値(初期値16
 )
 * @type number
 * @min 0
 * @default 16
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc ムーブアウトコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 0
 */

/*~struct~Move:
 * @param speed
 * @text スピード[デフォ値]
 * @desc 移動スピードのデフォルト値。（正の数か略号、初期値12）
 * @default 12
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 移動コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */


/*~struct~YMove:
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc 所要時間のデフォルト値。（0以上の整数、初期値20）
 * @default 20
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc Y移動コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */

/*~struct~Jump:
 * @param height
 * @text 高さ[デフォ値]
 * @desc ジャンプの高さのデフォルト値。初期値は80。
 * @type number
 * @default 80
 *
 * @param gravity
 * @text 重力[デフォ値]
 * @desc ジャンプにかかる重力のデフォルト値。初期値は1.5。
 * @type number
 * @decimals 1
 * @default 1.5
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc ジャンプコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 */

/*~struct~Step:
 * @param height
 * @text 高さ[デフォ値]
 * @desc ステップの高さのデフォルト値。初期値は20。
 * @type number
 * @min 1
 * @default 20
 *
 * @param gravity
 * @text 重力[デフォ値]
 * @desc ジャンプにかかる重力のデフォルト値。初期値は0.5。
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @param speed
 * @text 移動スピード[デフォ値]
 * @desc 移動スピードのデフォルト値。初期値は1.5。
 * @type number
 * @decimals 1
 * @min 0.1
 * @default 1.5
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc ステップコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param relative
 * @text 絶対/相対[デフォ値]
 * @desc 位置指定の相対/絶対のデフォルト値。初期値は絶対(0)
 * @type select
 * @option 絶対(0)
 * @value 0
 * @option 相対(1)
 * @value 1
 * @default 0
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */

/*~struct~Shake:
 * @param strength
 * @text 強さ[デフォ値]
 * @desc 揺れの強さデフォルト値。初期値は8。
 * @type number
 * @decimals 1
 * @min 0.1
 * @default 8
 *
 * @param count
 * @text 回数[デフォ値]
 * @desc 揺れの回数。１回は半往復で２回で左右１往復。(初期値は2,左右に1往復)
 * @type number
 * @min 1
 * @default 2
 *
 * @param durationPerCount
 * @text １回の所要時間[デフォ値]
 * @desc １回（半往復)のあたりの所要時間のデフォルト値。初期値は6。
 * @type number
 * @min 1
 * @default 6
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc シェイクコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */

/*~struct~Flip:
 * @param num
 * @text 反転回数[デフォ値]
 * @desc 反転回数のデフォルト値。初期値は1。
 * @type number
 * @min 1
 * @default 1
 *
 * @param durationPerCount
 * @text １回の時間[デフォ値]
 * @desc 反転１回あたりの所要フレーム。初期値は14。
 * @type number
 * @min 1
 * @default 14
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 反転コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 0
 */
/*~struct~Angle:
 * @param angle
 * @text 角度[デフォ値]
 * @desc 角度のデフォルト値。初期値は360。
 * @type number
 * @default 360
 *
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc 動作の所要フレーム。初期値は60。
 * @type number
 * @min 1
 * @default 60
 *
 * @param relative
 * @text 絶対/相対[デフォ値]
 * @desc 角度指定の相対/絶対のデフォルト値。初期値は相対(1)
 * @type select
 * @option 絶対(0)
 * @value 0
 * @option 相対(1)
 * @value 1
 * @default 1
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 回転コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~Scale:
 * @param scaleX
 * @text 横幅拡大率[デフォ値]
 * @desc 横幅の拡大率のデフォルト値。初期値は100(等倍)。
 * @type number
 * @default 100
 *
 * @param scaleY
 * @text 縦幅拡大率[デフォ値]
 * @desc 縦幅の拡大率のデフォルト値。初期値は100(等倍)。
 * @type number
 * @default 100
 *
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc 動作の所要フレーム。初期値は20。
 * @type number
 * @min 1
 * @default 20
 *
 * @param relative
 * @text 絶対/相対[デフォ値]
 * @desc 角度指定の相対/絶対のデフォルト値。初期値は絶対(0)
 * @type select
 * @option 絶対(0)
 * @value 0
 * @option 相対(1)
 * @value 1
 * @default 0
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 拡大率コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */

/*~struct~Focus:
 * @param duration
 * @text 所要時間
 * @desc フォーカスにかかる所要フレーム。初期値は10
 * @number
 * @min 0
 * @default 10
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc フォーカスコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~UnFocus:
* @param duration
 * @text 所要時間
 * @desc アンフォーカスにかかる所要フレーム。初期値は10
 * @number
 * @min 0
 * @default 10
 *
 * @param tone
 * @text トーン
 * @desc フォーカス外のキャラの色味。スペース区切りで順に赤、緑、青(-255~255)、グレー(0~255)。初期値は-90 -90 -90 0。
 * @default -90 -90 -90 0
 *
 * @param scale
 * @text 拡大率
 * @desc フォーカス外のキャラの表示拡大率。初期値は97(100で等倍)。
 * @type number
 * @decimals 1
 * @default 97
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc フォーカスコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~Opacity:
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc 透明度変化にかかる所要フレーム。初期値は20
 * @number
 * @min 0
 * @default 20
 *
 * @param opacity
 * @text 透明度[デフォ値]
 * @desc 透明度変更のデフォルト値。初期値は0。(255で不透明)
 * @type number
 * @default 0
 *
 * @param relative
 * @text 絶対/相対[デフォ値]
 * @desc 透明度指定の相対/絶対のデフォルト値。初期値は絶対値(0)
 * @type select
 * @option 絶対(0)
 * @value 0
 * @option 相対(1)
 * @value 1
 * @default 0
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 透明度コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */
/*~struct~Tint:
 * @param duration
 * @text 所要時間[デフォ値]
 * @desc 色調変化にかかる所要フレーム。初期値は20
 * @number
 * @min 0
 * @default 20
 *
 * @param tone
 * @text トーン[デフォ値]
 * @desc 色調のデフォルト値。スペース区切りで順に赤、緑、青(-255~255)、グレー(0~255)。初期値は0 0 0 0。
 * @default 0 0 0 0
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 色調コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 */
/*~struct~Emphasize:
* @param duration
 * @text 所要時間
 * @desc エフェクトにかかる所要フレーム。初期値は20
 * @number
 * @min 1
 * @default 20
 *
 * @param tone
 * @text トーン
 * @desc エフェクトの色味。スペース区切りで順に赤、緑、青(-255~255)、グレー(0~255)。初期値は0 0 0 0。
 * @default 0 0 0 0
 *
 * @param scaleX
 * @text 横方向の拡大率
 * @desc 拡大率。初期値は120(100で等倍)。
 * @type number
 * @decimals 1
 * @default 120
 *
 * @param scaleY
 * @text 縦方向の拡大率
 * @desc 拡大率。初期値は120(100で等倍)。
 * @type number
 * @decimals 1
 * @default 120
 *
 * @param num
 * @text 演出の回数
 * @desc 演出の回数。初期値は1。
 * @type number
 * @min 1
 * @default 1
 *
 * @param interval
 * @text 演出の間隔
 * @desc 演出の間隔フレーム。初期値は20。
 * @type number
 * @min 1
 * @default 20
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc 強調コマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default true
 *
 * @param easeType
 * @text イージングタイプ
 * @desc イージング（変化の緩急）のデフォルト値
 * @type select
 * @option リニア(0)
 * @value 0
 * @option イースイン(1)/徐々に早く
 * @value 1
 * @option イースアウト(2)/徐々に遅く
 * @value 2
 * @option イースインアウト(3)/間を早く
 * @value 3
 * @option イースインキュービック(4)/徐々に早く
 * @value 4
 * @option イースアウトキュービック(5)/徐々に遅く
 * @value 5
 * @option イースインアウトキュービック(6)/間を早く
 * @value 6
 * @option バックイン(1)/徐々に早く
 * @value 7
 * @option バックアウト(2)/徐々に遅く
 * @value 8
 * @option バックインアウト(3)/間を早く
 * @value 9
 * @option イラスティックイン(4)/徐々に早く
 * @value 10
 * @option イラスティックアウト(5)/徐々に遅く
 * @value 11
 * @option イラスティックインアウト(6)/間を早く
 * @value 12
 * @default 3
 */

/*~struct~Animation:
 * @param list
 * @text アニメーションの登録
 * @desc アニメーションIDを登録すると、デプロイメント時の未使用ファイルから除外されます。また、略称を設定できます。
 * @type struct<AnimationList>[]
 * @default []
 * 
 * @param focus
 * @text 自動フォーカス[デフォ値]
 * @desc 自動フォーカスのデフォルト値。初期値はtrue。(trueにするとアニメーション表示キャラを自動フォーカス）
 * @type boolean
 * @default true
 *
 * @param mirror
 * @text 反転表示[デフォ値]
 * @desc 反転表示のデフォルト値。初期値はfalse。(trueにすると反転して表示）
 * @type boolean
 * @default false
 *
 * @param wait
 * @text ウェイト[デフォ値]
 * @desc アニメーションコマンドのウェイトのデフォルト値(初期値false)
 * @type boolean
 * @default false
 */

/*~struct~AnimationList:
 * @param id
 * @text アニメーションID
 * @desc アニメーションIDを登録すると、デプロイメント時の未使用ファイルから除外されます。
 * @type animation
 * @require 1
 *
 * @param name
 * @text 略称
 * @desc アニメーションIDの代わりに使用できる略称を設定
 */

/*~struct~Macro:
 * @param name
 * @text 名前
 * @desc コマンド名の代わりに入力するマクロ名(すでにあるコマンド名は名付けないでください)
 *
 * @param macro
 * @text マクロ
 * @desc マクロを入力してください。
 */

var TRP_CORE = TRP_CORE || {};
TRP_CORE.skitParameters = PluginManager.parameters('TRP_SkitConfig');