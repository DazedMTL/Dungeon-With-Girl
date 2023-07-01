//=============================================================================
// TRP_Dice.js
//=============================================================================
/*:
 * @plugindesc ダイスプラグイン
 * @author Thirop
 * @help
 * ※本プラグインはBoothにて販売している有償プラグインです。
 * ※最新バージョンはBoothの購入履歴より再ダウンロード可能です。
 *
 * 詳しい使い方はマニュアルを参照してください。
 * https://ci-en.net/creator/2170/article/177016
 * 
 * 【更新履歴】
 * 1.03 2020/2/4  changeで変数の値と表示が合わない不具合を修正
 * 1.02 2020/1/31 diceフォルダ使用設定、プリロードコマンド、不具合修正。
 * 1.00 2020/1/17 初版。
 * 
 * @param maxDiceNum
 * @text 　表示最大ダイス数
 * @desc 表示する可能性のある最大のダイス数
 * @type number
 * @default 8
 *
 * @param baseVariableId
 * @text 　同期変数の開始番号
 * @desc ダイスのマス目と同期する変数の開始番号
 * @type number
 * @default 1
 * 
 * @param typeSettings
 * @text 　サイコロタイプの登録
 * @desc 各行・空行をダブルクリックしてサイコロタイプの設定ができます。１行目はデフォルトの設定となります。
 * @type struct<DiceType>[]
 * @default ["{\"typeName\":\"normal\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"200\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1\\\",\\\"vy0Max\\\":\\\"10.0000\\\",\\\"vy0Min\\\":\\\"0\\\",\\\"vyBounceDimRate\\\":\\\"0.5000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"false\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"20\\\"}\"}","{\"typeName\":\"TRPG風6\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"TRPG風10-1\",\"planeNum\":\"10\",\"minNum\":\"0\",\"imageRow\":\"6\",\"imageName\":\"\",\"rollHeight\":\"350\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"false\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"20\\\"}\"}","{\"typeName\":\"TRPG風10-2\",\"planeNum\":\"10\",\"minNum\":\"0\",\"imageRow\":\"7\",\"imageName\":\"\",\"rollHeight\":\"350\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"false\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"20\\\"}\"}","{\"typeName\":\"悪魔の賽子\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"3\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"天使の賽子\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"2\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"2\",\"imageName\":\"\",\"rollHeight\":\"300\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.0000\\\",\\\"vy0Max\\\":\\\"10.0000\\\",\\\"vy0Min\\\":\\\"0.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.1000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"1.5000\\\"}\",\"useSeSetting\":\"false\",\"se\":\"{\\\"name\\\":\\\"Attack2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"100\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"40\\\"}\"}","{\"typeName\":\"10\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"200\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1\\\",\\\"vy0Max\\\":\\\"10\\\",\\\"vy0Min\\\":\\\"0\\\",\\\"vyBounceDimRate\\\":\\\"0.4\\\",\\\"vyEndLimit\\\":\\\"1\\\",\\\"aRotMax\\\":\\\"0.012\\\",\\\"vRotBounceDimRate\\\":\\\"0.3\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Attack3\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"100\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"40\\\"}\"}","{\"typeName\":\"チンチロ自分\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"200\",\"noElevate\":\"true\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.0000\\\",\\\"vy0Max\\\":\\\"10.0000\\\",\\\"vy0Min\\\":\\\"0.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.5000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"チンチロ相手\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"5\",\"imageName\":\"\",\"rollHeight\":\"200\",\"noElevate\":\"true\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.0000\\\",\\\"vy0Max\\\":\\\"10.0000\\\",\\\"vy0Min\\\":\\\"0.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.5000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく１０\",\"planeNum\":\"10\",\"minNum\":\"1\",\"imageRow\":\"3\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく４\",\"planeNum\":\"4\",\"minNum\":\"1\",\"imageRow\":\"4\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.7000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0300\\\",\\\"vRotBounceDimRate\\\":\\\"0.5000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく４５６\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"2\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく１２３\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"5\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく１\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"3\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく開始\",\"planeNum\":\"7\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"Sugoroku\",\"rollHeight\":\"400\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"0\\\",\\\"gravity\\\":\\\"1.2000\\\",\\\"vy0Max\\\":\\\"5.0000\\\",\\\"vy0Min\\\":\\\"5.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.5000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく終了\",\"planeNum\":\"8\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"SugorokuEnd\",\"rollHeight\":\"400\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"0\\\",\\\"gravity\\\":\\\"1.2000\\\",\\\"vy0Max\\\":\\\"5.0000\\\",\\\"vy0Min\\\":\\\"5.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.5000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"すごろく\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"360\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.3000\\\",\\\"vy0Max\\\":\\\"20.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0120\\\",\\\"vRotBounceDimRate\\\":\\\"0.3000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}","{\"typeName\":\"戦闘スキル\",\"planeNum\":\"6\",\"minNum\":\"1\",\"imageRow\":\"1\",\"imageName\":\"\",\"rollHeight\":\"200\",\"noElevate\":\"false\",\"useMotionSetting\":\"true\",\"motion\":\"{\\\"maxDelay\\\":\\\"5\\\",\\\"gravity\\\":\\\"1.0000\\\",\\\"vy0Max\\\":\\\"15.0000\\\",\\\"vy0Min\\\":\\\"10.0000\\\",\\\"vyBounceDimRate\\\":\\\"0.6000\\\",\\\"vyEndLimit\\\":\\\"1.0000\\\",\\\"aRotMax\\\":\\\"0.0150\\\",\\\"vRotBounceDimRate\\\":\\\"0.6000\\\"}\",\"useSeSetting\":\"true\",\"se\":\"{\\\"name\\\":\\\"Chest2\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"140\\\",\\\"pan\\\":\\\"0\\\",\\\"overlapDisableFrame\\\":\\\"10\\\",\\\"maxPitchChange\\\":\\\"0\\\"}\"}"]
 *
 * @param useFolder
 * @text diceフォルダを使用
 * @desc ON/trueにするとimg/diceフォルダ内のダイス画像を使用。(OFF/falseでsystemフォルダ)
 * @type Boolean
 * @default true
 */
//=============================================================================

/*~struct~DiceType:
 * @param typeName
 * @text タイプ名
 * @desc タイプ名。「dice type ダイスID タイプ名」でダイスタイプを変更できる。異なるタイプ名を設定すること。
 * 
 * @param planeNum
 * @text ダイスの面数
 * @desc ダイスの面数。６の場合は「Dice_6.png」画像を使用。
 * @type number
 * @min 1
 * @default 6
 *
 * @param minNum
 * @text 画像の最小の目
 * @desc ダイス画像の一番小さい目の数。通常は１で、０から始まるダイスの場合などは数値を変えてください。
 * @type number
 * @default 1
 *
 * @param imageRow
 * @text 画像の行数
 * @desc 使用する画像の行数。（デフォ値:1, 1番上の行の画像を使用）
 * @type number
 * @min 1
 * @default 1
 *
 * @param imageName
 * @text 画像名
 * @desc 通常は空白で不使用。設定するとimageRowは無効となり、「Dice_設定した画像名_目の数.png」の画像が使われる。
 * @type text
 *
 * @param rollHeight
 * @text 振り下ろし高さ
 * @desc ダイスを振り下ろす高さ。（デフォ値:200）
 * @type number
 * @default 200
 *
 * @param noElevate
 * @text ロール時に持ち上げない
 * @desc ロール時に表示位置からそのまま振り下ろす。（デフォ値:false）
 * @type boolean
 * @default false
 *
 * @param useMotionSetting
 * @text ロールモーション個別指定
 * @desc OFF(false)だとデフォルトタイプのロールモーションを使用。個別に指定する場合はON/true
 * @type boolean
 * @default true
 *
 * @param motion
 * @text ロールモーション<上級>
 * @desc ロール時の詳細なモーションを調整（上級者向け）。個別設定時はロールモーション個別指定をtrueにすること。
 * @type struct<RollMotion>
 * @default {"maxDelay":"5","gravity":"1.0000","vy0Max":"10.0000","vy0Min":"0.0000","vyBounceDimRate":"0.5000","vyEndLimit":"1.0000","aRotMax":"0.0120","vRotBounceDimRate":"0.3000"}
 *
 * @param useSeSetting
 * @text SE設定の個別指定
 * @desc OFF(false)だとデフォルトタイプのSE設定を使用。個別に指定する場合はON/true
 * @type boolean
 * @default true
 *
 * @param se
 * @text SE設定
 * @desc ロール時に再生するSEの設定。個別設定時はSE設定の個別指定をtrueにすること。
 * @type struct<SeSetting>
 * @default {"typeName":"normal","maxNum":"6","imageRow":"1","se":"{\"name\":\"\",\"volume\":\"90\",\"pitch\":\"100\",\"pan\":\"0\",\"overlapDisableFrame\":\"6\",\"maxPitchChange\":\"30\"}"}
 */

/*~struct~SeSetting:
 * @param name
 * @text SE名
 * @desc ロール時にならすSE名（空白でSEを鳴らさない）
 * 
 * @param volume
 * @text SEボリューム
 * @desc SEのボリューム（デフォ値:90）
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch
 * @text SEピッチ
 * @desc SEのピッチ（デフォ値:100）
 * @type number
 * @min 0
 * @default 100
 *
 * @param pan
 * @text SEパン
 * @desc SEのパン（デフォ値:0）
 * @type number
 * @default 0
 *
 * @param overlapDisableFrame
 * @text SEの連続再生停止フレーム
 * @desc 指定フレーム内にロールSEが再生された場合は再生しない。（デフォ値:6）
 * @min 0
 * @max 600
 * @type number
 * @default 6
 *
 * @param maxPitchChange
 * @text ピッチの変化幅
 * @desc ロール時の回転が早いほどピッチを変化させる最大の幅割合（デフォ値:20）
 * @type number
 * @default 20
 *
 */

/*~struct~RollMotion: 
* @param maxDelay
* @text ディレイ最大値
* @desc ロール開始ディレイの最大値。複数ダイスをロールするときに振り始めがバラけます。（デフォ値:5）
* @type number
* @min 0
* @default 5
*
* @param gravity
* @text 重力係数
* @desc 下方向への加速度係数（デフォ値:1）
* @type number
* @decimals 4
* @default 1
*
* @param vy0Max
* @text 落下初速の最大値
* @desc 振り下ろしの落下初速の最大値（デフォ値:10）
* @type number
* @decimals 4
* @default 10
*
* @param vy0Min
* @text 落下初速の最小値
* @desc 振り下ろしの落下初速の最小値（デフォ値:0）
* @type number
* @decimals 4
* @default 0
*
* @param vyBounceDimRate
* @text 速度のバウンド減衰率
* @desc バウンド時の速度の減衰率。0.1~1.0まで設定可（デフォ値:0.5）
* @type number
* @default 0.5
* @decimals 4
* @min 0.1
* @max 1.0
*
* @param vyEndLimit
* @text バウンド終了速度
* @desc バウンドを終了する落下速度の条件。（デフォ値:1）
* @min 0
* @type number
* @decimals 4 
* @default 1
*
* @param aRotMax
* @text 回転速度係数
* @desc 回転速度に関する係数の最大値。（デフォ値:0.012）
* @type number
* @decimals 4
* @default 0.012
*
* @param vRotBounceDimRate
* @text 回転速度のバウンド減衰率
* @desc バウンド時の回転速度の減衰率。（デフォ値:0.3）
* @type number
* @decimals 4
* @default 0.3
* @min -10
*
*
*/


var $gameDice = null;

function Game_Dice() {
	this.initialize.apply(this, arguments);
};
function Dice() {
	this.initialize.apply(this, arguments);
};

(function () {
	var parameters = PluginManager.parameters('TRP_Dice');
	var setupConfigParameters = function () {
		parameters = JSON.parse(JSON.stringify(parameters, function (key, value) {
			try {
				return JSON.parse(value);
			} catch (e) {
				try {
					return eval(value);
				} catch (e) {
					return value;
				}
			}
		}));


		var errorPrefix = 'TRP_SkitConfig:';
		try {
			/* setup SkitActorSettings
			===================================*/
			var typeSettingArray = parameters.typeSettings;
			var dataTypes = {};
			parameters.typeSettings = dataTypes;
			var defaultData = typeSettingArray[0];
			parameters.defaultType = defaultData.typeName;
			typeSettingArray.forEach(function (data) {
				if (!data.useMotionSetting) {
					data.motion = defaultData.motion;
				}
				if (!data.useSeSetting) {
					data.se = defaultData.se;
				}
				dataTypes[data.typeName] = data;
			});
		} catch (e) {
			e = new Error(errorPrefix + 'タイプ設定が正しくありません。最低１つ以上設定してください。');
			SceneManager.catchException(e);
		}
	};


	var _Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function () {
		setupConfigParameters();
		_Scene_Boot_start.call(this);
	};

	var convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	function supplement(defaultValue, optionArg) {
		if (optionArg === undefined) {
			return defaultValue;
		}
		return optionArg;
	};
	function supplementNum(defaultValue, optionArg) {
		return Number(supplement(defaultValue, optionArg));
	};
	function supplementDef(defaultValue, optionArg, otherWords) {
		var value = supplement(defaultValue, optionArg);
		var defTargetWords = otherWords || [];
		defTargetWords.push('default');
		defTargetWords.push('def');
		defTargetWords.push('d');
		for (var i = 0; i < defTargetWords.length; i++) {
			var target = defTargetWords[i];
			if (value === target) {
				value = defaultValue;
				break;
			}
		}
		return value;
	};
	function supplementDefNum(defaultValue, optionArg, otherWords) {
		var value = supplementDef(defaultValue, optionArg, otherWords);
		return Number(value);
	};
	function supplementDefBool(defaultValue, optionArg, otherWords) {
		var value = supplementDef(defaultValue, optionArg, otherWords);
		if (value === 'true' || value === 't') {
			value = true;
		} else if (value === 'false' || value === 'f') {
			value = false;
		} else if (value) {
			value = true;
		} else {
			value = false;
		}
		return value;
	};



	//=============================================================================
	// ImageManager
	//=============================================================================
	if (parameters.useFolder) {
		ImageManager.loadDice = function (filename, hue) {
			return this.loadBitmap('img/dice/', filename, hue, true);
		};
	};


	//=============================================================================
	// GameInterpreter
	//=============================================================================
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);

		if (command.toLowerCase() === 'dice' || command === 'ダイス') {
			var subCommand = args[0];
			if (subCommand === 'wait' || subCommand === 'ウェイト') {
				this.setWaitMode('diceRoll');
			} else if (subCommand === 'test') {
				this.trpDiceTest();
			} else if (subCommand === 'test2') {
				this.trpDiceTest2();
			} else if (subCommand === 'test3') {
				this.trpDiceTest3();
			} else {
				$gameDice.processCommand(args);
			}
		}
	};

	var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
	Game_Interpreter.prototype.updateWaitMode = function () {
		if (this._waitMode === 'diceRoll') {
			if ($gameDice.isAnyDiceRolling()) {
				return true;
			} else {
				this._waitMode = '';
				return false;
			}
		}
		return _Game_Interpreter_updateWaitMode.call(this);
	};





	//=============================================================================
	// DataManager
	//=============================================================================
	var _DataManager_createGameObjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function () {
		_DataManager_createGameObjects.call(this);
		$gameDice = new Game_Dice();
	};

	var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function () {
		var contents = _DataManager_makeSaveContents_.call(this);
		contents.dice = $gameDice;
		return contents;
	};
	var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function (contents) {
		_DataManager_extractSaveContents_.call(this, contents);
		$gameDice = contents.dice;
	};

	//=============================================================================
	// Game_Dice
	//=============================================================================
	Game_Dice.SE_COUNT_NOT_STARTED = -1;
	Game_Dice.SE_COUNT_STARTED = 0;
	Game_Dice.prototype.initialize = function () {
		this.seCount = Game_Dice.SE_COUNT_NOT_STARTED;
		this._dices = [];
		var num = parameters.maxDiceNum;
		for (var i = 0; i < num; i = (i + 1) | 0) {
			var id = i + 1;
			this._dices.push(new Dice(id));
		}

		this._layer = Game_Dice.LAYER.behindPicture;
		this._checker = null;
	};

	Game_Dice.LAYER = {
		behindPicture: 0,
		behindWindow: 1,
		top: 2
	};


	/* interpret command
	===================================*/
	Game_Dice.prototype.processCommand = function (args) {
		var i, length;

		//convert escapeCharacters
		length = args.length;
		for (i = 1; i < length; i = (i + 1) | 0) {
			if (typeof args[i] === 'string') {
				args[i] = convertEscapeCharacters(args[i]);
			}
		}

		if (!isNaN(args[i])) {
			throwError('ダイスコマンドの２番目のパラメータはサブコマンド名を指定してください。');
		}

		var command = args.shift().toLowerCase();
		switch (command) {
			case 'layer':
			case 'レイヤー':
			case 'レイヤ':
				this.commandChangeLayer(args);
				break;
			case 'show':
			case '表示':
				this.commandShow(args);
				break;
			case 'hide':
			case '非表示':
				this.commandHide(args);
				break;
			case 'clear':
			case 'クリア':
			case 'クリアー':
				this.commandClear(args);
				break;
			case 'value':
			case 'number':
			case '数値':
			case '数':
			case '目':
				this.commandSetValue(args);
				break;
			case 'max':
			case 'maximum':
			case '最大値':
			case '最大':
				this.commandSetMaxValue(args);
				break;
			case 'min':
			case 'minimum':
			case '最小値':
			case '最小':
				this.commandSetMinValue(args);
				break;

			case 'type':
			case 'タイプ':
				this.commandSetType(args);
				break;
			case 'row':
			case 'image':
			case '行':
			case 'イメージ':
				this.commandSetImageRow(args);
				break;
			case 'var':
			case 'variable':
			case 'variableId':
			case '変数':
				this.commandSetVariableId(args);
				break;
			case 'rand':
			case 'random':
			case 'ランダム':
			case '乱数':
				this.commandRandom(args);
				break;
			case 'roll':
			case 'ロール':
				this.commandRoll(args);
				break;
			case 'randroll':
			case 'randomroll':
			case 'ランダムロール':
			case '乱数ロール':
				this.commandRandomRoll(args);
				break;
			case 'change':
			case 'チェンジ':
			case '変化':
				this.commandChange(args);
				break;
			case 'pos':
			case 'position':
			case 'move':
			case '位置':
			case '移動':
				this.commandMove(args);
				break;
			case 'relativepos':
			case 'relativeposition':
			case 'relativemove':
			case '相対位置':
			case '相対移動':
				this.commandRelativeMove(args);
				break;
			case 'scale':
			case 'size':
			case 'スケール':
			case '拡大':
				this.commandScale(args);
				break;
			case 'animation':
			case 'アニメーション':
				this.commandAnimation(args);
				break;
			case 'checker':
			case 'check':
			case 'analyze':
			case '分析':
			case '統計':
				this.commandChecker(args);
				break;
			case 'preload':
			case 'プリロード':
				this.commandPreloadId(args);
				break;
		}
	};

	/* update
	===================================*/
	Game_Dice.prototype.update = function () {
		if (this.seCount >= Game_Dice.SE_COUNT_STARTED) {
			this.seCount += 1;
			if (this.seCount > 600) {
				this.seCount = Game_Dice.SE_COUNT_NOT_STARTED;
			}
		}

		var dices = this._dices;
		var length = dices.length;
		for (var i = 0; i < length; i = (i + 1) | 0) {
			dices[i].update();
		}
	};

	/* se
	===================================*/
	Game_Dice.prototype.didPlaySe = function () {
		this.seCount = Game_Dice.SE_COUNT_STARTED;
	};
	Game_Dice.prototype.canPlaySe = function (disableFrame) {
		return this.seCount >= Game_Dice.SE_COUNT_STARTED && this.seCount < disableFrame;
	};



	/* layer
	===================================*/
	Game_Dice.prototype.commandChangeLayer = function (args) {
		var layerArg = args[0].toLowerCase();
		var LAYER = Game_Dice.LAYER;
		var layer;
		switch (layerArg) {
			case 'behindwindow':
			case 'window':
			case 'ウィンドウの後ろ':
			case 'ウィンドウ後ろ':
				layer = LAYER.behindWindow;
				break;
			case 'top':
			case 'front':
			case 'トップ':
			case '最前面':
				layer = LAYER.top;
				break;
			default:
				layer = LAYER.behindPicture;
		}
		this._layer = layer;

		SceneManager._scene.rearrangeDiceContainerLayer();
	};
	Game_Dice.prototype.layer = function () {
		return this._layer;
	};


	/* show & hide
	===================================*/
	Game_Dice.prototype.commandShow = function (args) {
		var id = supplementDefNum(1, args[0]);
		var x = args[1];
		var y = args[2];
		var duration = supplementDefNum(0, args[3]);

		var dice = this.dice(id);
		dice.show(x, y, duration);
	};

	var ALL_TARGET_PARAMS = [undefined, 'all', '全て', '全部'];
	Game_Dice.prototype.commandHide = function (args) {
		var target = args[0];
		var duration = supplementDefNum(0, args[1]);

		if (ALL_TARGET_PARAMS.contains(target)) {
			var dices = this._dices;
			var length = dices.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var dice = dices[i];
				dice.hide(duration);
			}
		} else {
			var id = supplementDefNum(1, target);
			var dice = this.dice(id);
			dice.hide(duration);
		}
	};
	Game_Dice.prototype.commandClear = function (args) {
		var target = args[0];
		var duration = supplementDefNum(0, args[1]);

		if (ALL_TARGET_PARAMS.contains(target)) {
			var dices = this._dices;
			var length = dices.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var dice = dices[i];
				dice.clear(duration);
			}
		} else {
			var id = supplementDefNum(1, target);
			var dice = this.dice(id);
			dice.clear(duration);
		}
	};

	/* set params
	===================================*/
	var MAX_PARAMS = ['最大値', '最大', 'max', 'maximum'];
	var CLEAR_PARAMS = ['clear', 'reset', 'クリア', 'クリアー', 'リセット'];
	Game_Dice.prototype.commandSetValue = function (args) {
		var id = supplementDefNum(1, args[0]);
		var dice = this.dice(id);

		var value;
		if (args[1] === undefined) {
			value = dice.minNum;
		} else if (isNaN(args[1])) {
			value = args[1].toLowerCase();
			if (MAX_PARAMS.contains(value)) {
				value = dice.maxNum;
			} else {
				value = dice.minNum;
			}
		} else {
			value = Number(args[1]);
		}

		dice.value = value.clamp(dice.minNum, dice.maxNum);
	};
	Game_Dice.prototype.commandSetMaxValue = function (args) {
		var id = supplementDefNum(1, args[0]);
		var dice = this.dice(id);
		var typeData = dice.typeData();
		if (isNaN(args[1]) && CLEAR_PARAMS.contains(args[1].toLowerCase())) {
			dice.resetMaxNum();
		} else {
			dice.setMaxNum(Number(args[1]));
		}
	};
	Game_Dice.prototype.commandSetMinValue = function (args) {
		var id = supplementDefNum(1, args[0]);
		var dice = this.dice(id);
		if (isNaN(args[1]) && CLEAR_PARAMS.contains(args[1].toLowerCase())) {
			dice.resetMinNum();
		} else {
			dice.setMinNum(Number(args[1]));
		}
	};


	Game_Dice.prototype.commandSetType = function (args) {
		var id = supplementDefNum(1, args[0]);
		var dice = this.dice(id);

		var type;
		if (!isNaN(args[1])) {
			type = String(args[1]);
		} else {
			type = args[1];
		}
		type = type ? type.toString() : null;
		if (CLEAR_PARAMS.contains(type) || !type) {
			type = parameters.defaultType;
		}

		dice.type = type;
	};

	Game_Dice.prototype.commandSetImageRow = function (args) {
		var id = supplementDefNum(1, args[0]);
		var imageRow = supplementDefNum(1, args[1]);

		var dice = this.dice(id);
		dice.imageRow = Math.max(0, imageRow);
	};

	/* variable
	===================================*/
	Game_Dice.prototype.commandSetVariableId = function (args) {
		var id = supplementDefNum(1, args[0]);
		var variableId;
		if (CLEAR_PARAMS.contains(args[1])) {
			variableId = 0;
		} else {
			variableId = supplementDefNum(0, args[1]);
		}

		var dice = this.dice(id);
		dice.setVariableId(variableId);
	};

	/* rand && roll
	===================================*/
	Game_Dice.prototype.commandRandom = function (args) {
		var id = supplementDefNum(1, args[0]);

		var dice = this.dice(id);
		dice.makeValue();
	};

	Game_Dice.prototype.commandRoll = function (args) {
		var id = supplementDefNum(1, args[0]);
		var height = args[1];
		var fall = args[2];

		var dice = this.dice(id);
		dice.roll(height, fall);
	};

	Game_Dice.prototype.commandRandomRoll = function (args) {
		var id = supplementDefNum(1, args[0]);
		this.commandRandom([id]);

		var height = args[1];
		var fall = args[2];

		var dice = this.dice(id);
		dice.roll(height, fall);
	};

	Game_Dice.prototype.commandChange = function (args) {
		var id = supplementDefNum(1, args[0]);
		var dice = this.dice(id);
		var interval;
		if (args[1] === 'bound' || args[1] === 'バウンド') {
			interval = -1;
		} else if (args[1] && isNaN(args[1])) {
			interval = 0;
		} else {
			interval = supplementDefNum(5, args[1]);
		}
		dice.startChange(interval);
	};

	/* move
	===================================*/
	Game_Dice.prototype.commandMove = function (args) {
		var id = supplementDefNum(1, args[0]);
		var x = supplementDefNum(Graphics.boxWidth / 2, args[1]);
		var y = supplementDefNum(Graphics.boxHeight / 2, args[2]);
		var duration = supplementDefNum(0, args[3]);

		var dice = this.dice(id);
		dice.move(x, y, duration, false);
	};
	Game_Dice.prototype.commandRelativeMove = function (args) {
		var id = supplementDefNum(1, args[0]);
		var x = supplementDefNum(Graphics.boxWidth / 2, args[1]);
		var y = supplementDefNum(Graphics.boxHeight / 2, args[2]);
		var duration = supplementDefNum(0, args[3]);

		var dice = this.dice(id);
		dice.move(x, y, duration, true);
	};

	/* scale
	===================================*/
	Game_Dice.prototype.commandScale = function (args) {
		var id = supplementDefNum(1, args[0]);
		var scale;
		if (CLEAR_PARAMS.contains(args[1])) {
			scale = 100;
		} else {
			scale = supplementDefNum(100, args[1]);
		}
		var duration = supplementDefNum(0, args[2]);
		var dice = this.dice(id);
		dice.changeScale(scale, duration);
	};


	/* animation
	===================================*/
	var STATIC_PARAMS = ['static', '静止'];
	Game_Dice.prototype.commandAnimation = function (args) {
		var id = supplementDefNum(1, args[0]);
		var last = args.pop();
		var isStatic = STATIC_PARAMS.contains(last);
		if (!isStatic) {
			args.push(last);
		}

		var animationId = supplementDefNum(args[1]);
		var mirror = supplementDefBool(false, args[2]);
		var delay = supplementDefNum(0, args[3]);

		var dice = this.dice(id);
		dice.requestAnimation(animationId, mirror, delay, isStatic);
	};

	/* checker
	===================================*/
	Game_Dice.prototype.commandChecker = function (args) {
		var command = args.shift().toLowerCase();

		switch (command) {
			case '開始':
			case 'start':
				this.commandStartChecker(args);
				break;
			case 'total':
			case '合計':
			case '合計値':
			case 'トータル':
				this.commandCheckTotal(args);
				break;
			case 'mult':
			case 'multiply':
			case '掛ける':
			case 'かける':
			case '乗算':
				this.commandCheckMultiply(args);
				break;
			case 'min':
			case 'minimum':
			case '最小':
			case '最小値':
				this.commandCheckMinimum(args);
				break;
			case 'max':
			case 'maximum':
			case '最大':
			case '最大値':
				this.commandCheckMaximum(args);
				break;
			case 'num':
			case 'number':
			case '数':
			case '目':
				this.commandCheckNumber(args);
				break;
			case 'ペア':
			case 'pair':
				this.commandCheckPair(args);
				break;
			case '最大ペア':
			case 'maxpair':
				this.commandCheckMaxPair(args);
				break;
			case '最大ペアの数':
			case '最大ペアの目':
			case 'maxpairnumber':
			case 'maxpairnum':
				this.commandCheckMaxPairNum(args);
				break;
			case 'ストレート':
			case 'straight':
				this.commandCheckStraight(args);
				break;
			case 'end':
			case 'clear':
			case '終了':
				this.commandEndChecker(args);
				break;

		}
	};
	Game_Dice.prototype.commandStartChecker = function (args) {
		var dices = this._dices;
		var length = dices.length;

		var targetIds = null;
		if (args.length > 0) {
			targetIds = [];
			args.forEach(function (id) {
				targetIds.push(Number(id));
			});
		}

		//prepare target dices
		var targetDices = [];
		var maxNum = 0;
		var total = 0;
		var mult = 1;
		var minNum = Number.MAX_SAFE_INTEGER;
		for (var i = 0; i < length; i = (i + 1) | 0) {
			var dice = dices[i];
			var id = i + 1;
			if (targetIds && !targetIds.contains(id)) {
				continue;
			}
			if (!dice.showing) {
				continue;
			}
			targetDices.push(dice);
			var value = dice.value;
			total += value;
			mult *= value;
			if (value > maxNum) {
				maxNum = value;
			}
			if (value < minNum) {
				minNum = value;
			}
		}


		//init checker
		var numbers = [];
		for (var i = 0; i <= maxNum; i = (i + 1) | 0) {
			numbers[i] = 0;
		}
		var diceNum = targetDices.length;
		var pairs = [];
		for (var i = 0; i <= diceNum; i = (i + 1) | 0) {
			pairs[i] = 0;
		}


		//check number distribution
		for (var i = 0; i < diceNum; i = (i + 1) | 0) {
			var dice = targetDices[i];
			var value = dice.value;
			numbers[value] += 1;
		}

		//check pair distribution
		var maxPair = 0;
		var maxPairNum = 0;
		for (var i = 1; i <= maxNum; i = (i + 1) | 0) {
			var pairNum = numbers[i];
			if (pairNum <= 0) continue;
			pairs[pairNum] += 1;
			if (pairNum > maxPair) {
				maxPair = pairNum;
				maxPairNum = i;
			} else if (pairNum === maxPair) {
				if (i > maxPairNum) {
					maxPairNum = i;
				}
			}
		}

		//check straight
		var straight = 0;
		if (pairs[1] === diceNum) {
			var straightNum = 0;
			for (var i = 1; i <= maxNum; i = (i + 1) | 0) {
				var pairNum = numbers[i];
				if (pairNum) {
					if (straightNum === 0) {
						straight = i;
					}
					straightNum += 1;
				} else {
					if (straightNum > 0) {
						if (straightNum < diceNum) {
							straight = 0;
						}
						break;
					}
				}
			}
		}

		//check straight
		this._checker = {
			numbers: numbers,
			pairs: pairs,
			maxPair: maxPair,
			maxPairNumber: maxPairNum,
			straight: straight,
			total: total,
			mult: mult,
			min: minNum,
			max: maxNum
		};
	};

	Game_Dice.prototype.commandCheckTotal = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.total;
		$gameVariables.setValue(varId, value);
	};
	Game_Dice.prototype.commandCheckMultiply = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.mult;
		$gameVariables.setValue(varId, value);
	};
	Game_Dice.prototype.commandCheckMinimum = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.min;
		$gameVariables.setValue(varId, value);
	};
	Game_Dice.prototype.commandCheckMaximum = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.max;
		$gameVariables.setValue(varId, value);
	};

	Game_Dice.prototype.commandCheckNumber = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var target = Number(args[1]);
		var value = this._checker.numbers[target];
		$gameVariables.setValue(varId, value);
	};

	Game_Dice.prototype.commandCheckPair = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var target = Number(args[1]);
		var value = this._checker.pairs[target];
		$gameVariables.setValue(varId, value);
	};

	Game_Dice.prototype.commandCheckMaxPair = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.maxPair;
		$gameVariables.setValue(varId, value);
	};

	Game_Dice.prototype.commandCheckMaxPairNum = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.maxPairNumber;
		$gameVariables.setValue(varId, value);
	};

	Game_Dice.prototype.commandCheckStraight = function (args) {
		this.checkerError();

		var varId = Number(args[0]);
		var value = this._checker.straight;
		$gameVariables.setValue(varId, value);
	};


	Game_Dice.prototype.commandEndChecker = function (args) {
		this._checker = null;
	};

	Game_Dice.prototype.checkerError = function () {
		if (!this._checker) {
			throw new Error('分析結果がありません。「ダイス 統計 開始 ダイスID1 ダイスID2 ...」コマンドで分析を行ってください。');
		}
	};


	/* preload
	===================================*/
	Game_Dice.prototype.commandPreloadId = function (args) {
		var id = supplementDefNum(1, args[0]);
		var dice = this.dice(id);
		dice.preloadImages();
	};



	/* helper
	===================================*/
	Game_Dice.prototype.dice = function (id) {
		return this._dices[id - 1];
	};

	Game_Dice.prototype.isAnyDiceRolling = function () {
		var dices = this._dices;
		var length = dices.length;
		for (var i = 0; i < length; i += 1) {
			var dice = dices[i];
			if (!dice) continue;
			if (!dice.showing) continue;
			if (dice._rolling) return true;
		}
		return false;
	};


	//=============================================================================
	// Dice
	//=============================================================================
	Dice.prototype.initialize = function (diceId) {
		this.clearMembers();

		this.diceId = diceId;
	};

	Dice.prototype.clearMembers = function () {
		this.value = 1;
		this.type = null;
		this.imageRow = 1;
		this.imageName = '';
		this.maxNum = 6;
		this.minNum = 1;
		this.planeNum = 6;

		this.showing = false;
		this.x = Graphics.boxWidth / 2;
		this.y = Graphics.boxHeight / 2;
		this.rotation = 0;
		this.opacity = 255;
		this.scale = 100;

		this.displayValue = 0;
		this._changeInterval = 0;
		this._changeDuration = 0;

		this._animations = [];
		this._tempVaribaleId = 0;
		this._y0 = 0;

		this._opacityChanging = null;
		this._rolling = null;
		this._moving = null;
		this._scaling = null;

		this._checkValueValid();
	};

	/* type
	===================================*/
	Object.defineProperty(Dice.prototype, 'type', {
		get: function () {
			return this._type;
		}, set: function (value) {
			this._type = value;
			this._applyType();
		},
		configurable: true
	});

	Dice.prototype._applyType = function () {
		var type = this.typeData();

		this.planeNum = type.planeNum;
		this.imageName = type.imageName || '';
		this.resetMinNum(type);
		this.resetMaxNum(type);
		this.resetImageRow(type);
	};
	Dice.prototype.resetMaxNum = function (type) {
		type = type || this.typeData();
		this.maxNum = type.minNum + type.planeNum - 1;
	};
	Dice.prototype.resetMinNum = function (type) {
		type = type || this.typeData();
		this.minNum = type.minNum;
	};
	Dice.prototype.setMaxNum = function (value) {
		var type = this.typeData();
		this.maxNum = Math.min(value, type.minNum + type.planeNum - 1);
	};
	Dice.prototype.setMinNum = function (value) {
		var type = this.typeData();
		this.minNum = Math.max(value, type.minNum);
	};
	Dice.prototype.resetImageRow = function (type) {
		type = type || this.typeData();
		this.imageRow = type.imageRow;
	};

	Dice.prototype.typeData = function () {
		var type = parameters.typeSettings[this.type];
		if (!type) {
			this.type = parameters.defaultType;
			type = parameters.typeSettings[parameters.defaultType];
			if (!type) return null;
		}
		return type;
	};


	/* update
	===================================*/
	Dice.prototype.update = function () {
		if (!this.showing) return;

		this._checkValueValid();

		//update displayValue
		if (this._changeDuration > 0) {
			this._changeDuration -= 1;
			if (this._changeDuration <= 0) {
				this.changeDisplayValue();
			}
		}

		//update fade
		if (this._opacityChanging) {
			this._updateOpacityChange();
			if (!this.showing) return;
		}
		//udpate move
		if (this._moving) {
			this._updateMoving();
		}
		//update scale
		if (this._scaling) {
			this._updateScaleChange();
		}

		//update roll
		if (this._rolling) {
			this._updateRolling();
		}
	};

	Dice.prototype._checkValueValid = function () {
		var currentValue = this.value;
		var value = currentValue.clamp(this.minNum, this.maxNum);
		if (currentValue !== value) {
			this.value = value;
		}
	};

	/* show & hide
	===================================*/
	Dice.prototype.show = function (x, y, duration) {
		x = supplementDefNum(this.x, x);
		y = supplementDefNum(this.y, y);
		this.move(x, y, 0);

		if (this.showing) return;
		this.showing = true;

		if (duration > 0) {
			this.opacity = 0;
			this._opacityChanging = {
				deltaOpacity: 255 / duration
			};
		} else {
			this._opacityChanging = null;
			this.opacity = 255;
		}
		this._checkValueValid();
	};

	Dice.prototype.hide = function (duration) {
		if (!this.showing) return;

		if (duration > 0) {
			this._opacityChanging = {
				deltaOpacity: -this.opacity / duration
			};
		} else {
			this._opacityChanging = null;
			this.showing = false;
		}
	};

	Dice.prototype.clear = function (duration) {
		if (this.showing && duration > 0) {
			this.hide(duration);
			this._opacityChanging.clearAfterHide = true;
		} else {
			this._clear();
		}
	};
	Dice.prototype._clear = function () {
		this.clearMembers();
	};

	Dice.prototype._updateOpacityChange = function () {
		var changing = this._opacityChanging;

		this.opacity += changing.deltaOpacity;
		if (this.opacity >= 255) {
			this._opacityChanging = null;
		} else if (this.opacity <= 0) {
			this._opacityChanging = null;
			this.showing = false;
			if (changing.clearAfterHide) this._clear();
			return;
		}
	};




	/* variable & value
	===================================*/
	Object.defineProperty(Dice.prototype, 'value', {
		get: function () {
			return $gameVariables.value(this.variableId());
		}, set: function (value) {
			$gameVariables.setValue(this.variableId(), value);
			if (!this._changeInterval) {
				this.displayValue = this.value;
			}
		},
		configurable: true
	});

	Dice.prototype.makeValue = function () {
		var min = this.minNum;
		var max = this.maxNum;
		this.value = min + Math.randomInt(max - min + 1);
	};
	Dice.prototype.setVariableId = function (variableId) {
		this._tempVaribaleId = variableId;
	};
	Dice.prototype.variableId = function () {
		if (this._tempVaribaleId) {
			return this._tempVaribaleId;
		} else {
			return parameters.baseVariableId + this.diceId - 1;
		}
	};

	/* change display value
	===================================*/
	Dice.prototype.startChange = function (interval) {
		this._changeInterval = interval;
		if (interval >= 0) {
			this._changeDuration = interval;
		} else {
			this._changeDuration = 0;
		}
	};

	Dice.prototype.changeDisplayValue = function () {
		if (this._changeInterval > 0) {
			this._changeDuration = this._changeInterval;
		}

		var min = this.minNum;
		var max = this.maxNum;
		var value;
		do {
			value = min + Math.randomInt(max - min + 1);
		} while (min !== max && value === this.displayValue);

		this.displayValue = value;
	};
	Dice.prototype.checkChangeValueOnBounce = function () {
		return this._changeInterval < 0;
	};



	/* roll
	===================================*/
	Dice.END_VY = 1;

	Dice.BOUNCE_RESIST_ROTATION = 0.7;
	Dice.prototype.roll = function (height, fall) {
		if (!this.showing) {
			this.show();
		}

		var typeSetting = this.typeData();
		var motionSetting = typeSetting.motion;

		height = supplementDefNum(typeSetting.rollHeight, height);
		fall = supplementDefBool(typeSetting.noElevate, fall);

		//set position
		if (fall) {
			this._y0 = this.y + height;
		} else {//elevate
			this.y = this._y0 - height;
		}

		//set vy0
		var rolling = {
			vy: 0,
			count: 0,
			vRot: 0,
			aRot: 0,
			pitchRate: 0
		};
		this._rolling = rolling;

		//calc vy
		rolling.vy = (motionSetting.vy0Min || 0)
			+ (motionSetting.vy0Max || 0 - motionSetting.vy0Min) * Math.random();

		//calc r0
		this._setupRotation(rolling, typeSetting, motionSetting);

		var maxDelay = motionSetting.maxDelay || 0;
		if (maxDelay) {
			rolling.count = -Math.randomInt(maxDelay);
		} else {
			rolling.count = 0;
		}
		this.visible = rolling.count >= 0;
	};

	var _tempArray = [];
	Dice.prototype._setupRotation = function (rolling, typeSetting, motionSetting) {
		var rand = Math.random();
		var aRot = -rand * motionSetting.aRotMax;


		var vy = rolling.vy;
		var y = this.y;
		var y0 = this._y0;

		//calc bounce or end frames
		var frames = _tempArray;
		frames.length = 0;

		var frame = 0;
		var gravity = motionSetting.gravity;
		while (true) {
			frame += 1;
			vy += gravity;
			y += vy;
			if (y >= y0) {
				frames.push(frame);
				frame = 0;
				if (vy < motionSetting.vyEndLimit) {
					break;
				} else {
					//bounce
					vy *= -(1 - motionSetting.vyBounceDimRate);
					y = y0;
				}
			}
		}

		//reverse simmulate for r0
		var length = frames.length;
		var vRot = 0;
		var r = 0;
		for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
			var frame = frames[i];
			for (var j = 0; j < frame; j = (j + 1) | 0) {
				r -= vRot;
				vRot -= aRot;
			}
			if (i > 0) {
				//bounce
				vRot /= (1 - motionSetting.vRotBounceDimRate);
			}
		}

		this.rotation = r;
		rolling.vRot = vRot;
		rolling.aRot = aRot;
		rolling.pitchRate = rand;
	};

	Dice.prototype._playRollSe = function (rolling) {
		var type = this.typeData();
		var seSetting = type.se;
		if ($gameDice.canPlaySe(seSetting.overlapDisableFrame)) {
			return;
		} else {
			$gameDice.didPlaySe();
		}

		//play se
		var pitchRate = 100 + (-0.5 + rolling.pitchRate) * seSetting.maxPitchChange;
		var pitch = Math.max(0, seSetting.pitch * pitchRate / 100);
		var se = {
			name: seSetting.name,
			volume: seSetting.volume,
			pitch: pitch,
			pan: seSetting.pan
		};

		AudioManager.playSe(se);
	};
	Dice.prototype._updateRolling = function () {
		var type = this.typeData();
		var motionSetting = type.motion;

		var rolling = this._rolling;
		rolling.count += 1;
		if (rolling.count <= 0) {
			if (rolling.count === 0) {
				//end delay
				this.visible = true;
			}
			return;
		} else if (rolling.count === 5) {
			this._playRollSe(rolling);
		}

		rolling.vy += motionSetting.gravity;
		this.y += rolling.vy;

		rolling.vRot += rolling.aRot;
		this.rotation += rolling.vRot;


		if (this.y >= this._y0) {
			if (rolling.vy < motionSetting.vyEndLimit) {
				this.endRolling(type, motionSetting);
			} else {
				this.bounce(rolling, type, motionSetting);
			}
		}
	};

	Dice.BOUNCE_CHANGE_RATE = 0.75;
	Dice.prototype.bounce = function (rolling, type, motionSetting) {
		rolling.vy *= -(1 - motionSetting.vyBounceDimRate);
		this.y = this._y0;

		rolling.vRot *= (1 - motionSetting.vRotBounceDimRate);

		if (this.checkChangeValueOnBounce()) {
			if (Math.random() <= Dice.BOUNCE_CHANGE_RATE) {
				this.changeDisplayValue();
			}
		}
	};

	Dice.prototype.endRolling = function (type, motionSetting) {
		this._rolling = null;
		this.y = this._y0;
		this.rotation = 0;
		this._changeInterval = 0;
		this._changeDuration = 0;

		this.displayValue = this.value;
	};


	/* move
	===================================*/
	Dice.prototype.move = function (x, y, duration, relative) {
		if (relative) {
			if (this._moving) {
				x += this._moving.x;
			} else {
				x += this.x;
			}
			y += this._y0;
		}
		this._y0 = y;

		if (duration <= 0) {
			this.x = x;
			this.y = y;
			this._moving = null;
		} else {
			this._moving = {
				x: x,
				y: y,
				duration: duration
			};
		}
	};

	Dice.MOVE_ACCEL = 0.6;
	Dice.prototype._updateMoving = function () {
		var moving = this._moving;
		var d = moving.duration;
		var tx = moving.x;
		var ty = moving.y;
		this.x += (tx - this.x) / Math.pow(d, Dice.MOVE_ACCEL);
		this.y += (ty - this.y) / Math.pow(d, Dice.MOVE_ACCEL);

		moving.duration -= 1;
		if (moving.duration <= 0) {
			this._moving = null;
		}
	};

	/* scale
	===================================*/
	Dice.prototype.changeScale = function (scale, duration) {
		if (duration > 0) {
			this._scaling = {
				target: scale,
				duration: duration
			};
		} else {
			this.scale = scale;
			this._scaling = null;
		}
	};

	Dice.SCALE_ACCEL = 0.6;
	Dice.prototype._updateScaleChange = function () {
		var scaling = this._scaling;
		var d = scaling.duration;
		var t = scaling.target;
		this.scale += (t - this.scale) / Math.pow(d, Dice.SCALE_ACCEL);

		scaling.duration -= 1;

		if (scaling.duration <= 0) {
			this._scaling = null;
		}
	};

	/* animation
	===================================*/
	Dice.prototype.requestAnimation = function (animationId, mirror, delay, isStatic) {
		this._animations.push({
			animationId: animationId,
			mirror: mirror,
			delay: delay,
			isStatic: isStatic
		});
	};
	Dice.prototype.animation = function () {
		return this._animations.length > 0 ? this._animations.shift() : null;
	};

	/* preload
	===================================*/
	Dice.prototype.preloadImages = function () {
		var imageName = this.imageName;
		var planeNum = this.planeNum;
		var value = this.minNum;
		if (Sprite_Dice.checkUseSeparateImage(imageName)) {
			for (; value <= this.maxNum; value += 1) {
				Sprite_Dice.loadBitmap(imageName, planeNum, value);
			}
		} else {
			Sprite_Dice.loadBitmap(imageName, planeNum, value);
		}
	};



	//=============================================================================
	// Scenes
	//=============================================================================
	var _Scene_Base_create = Scene_Base.prototype.create;
	Scene_Base.prototype.create = function () {
		_Scene_Base_create.call(this);
		if (this.canUseTrpDice() && !!$gameDice) {
			this.createDiceSprites();
		}
	};

	Scene_Base.prototype.canUseTrpDice = function () {
		return false;
	};

	Scene_Base.prototype.createDiceSprites = function () {
		var num = parameters.maxDiceNum;
		var container = new Sprite_Base();
		this.addChild(container);
		this._diceContainer = container;

		for (var i = 0; i < num; i = (i + 1) | 0) {
			var diceId = i + 1;
			var sprite = new Sprite_Dice(diceId);
			container.addChild(sprite);
		}
	};


	var _Scene_Base_update = Scene_Base.prototype.update;
	Scene_Base.prototype.update = function () {
		_Scene_Base_update.call(this);
		if (this.canUseTrpDice() && !(this instanceof Scene_Map)) {
			$gameDice.update();
		}
	};




	/* Scene_Map
	===================================*/
	Scene_Map.prototype.canUseTrpDice = function () {
		return true;
	};
	var _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
	Scene_Map.prototype.updateMain = function () {
		_Scene_Map_updateMain.call(this);
		if (this.canUseTrpDice()) {
			$gameDice.update();
		}
	};

	var _Scene_Base_start = Scene_Base.prototype.start;
	Scene_Base.prototype.start = function () {
		_Scene_Base_start.call(this);
		if (this._diceContainer) {
			this.rearrangeDiceContainerLayer();
		}
	};

	Scene_Base.prototype.rearrangeDiceContainerLayer = function () {
		if (!$gameDice) return;

		var container = this._diceContainer;
		if (!container) return;

		var LAYER = Game_Dice.LAYER;
		var layer = $gameDice.layer();

		var index;
		switch (layer) {
			case LAYER.behindPicture:
				var spriteset = this._spriteset || null;
				index = spriteset ? this._spriteset.children.indexOf(this._spriteset._pictureContainer) : -1;
				if (index < 0) {
					this.addChild(container);
				} else {
					spriteset.addChildAt(container, index);
				}
				break;
			case LAYER.behindWindow:
				index = this.children.indexOf(this._windowLayer);
				if (index < 0) {
					this.addChild(container);
				} else {
					this.addChildAt(container, index);
				}
				break;
			default:
				this.addChild(container);
		}
	};



	/* Scene_Battle
	===================================*/
	Scene_Battle.prototype.canUseTrpDice = function () {
		return true;
	};

	var _Scene_Battle_start = Scene_Battle.prototype.start;
	Scene_Battle.prototype.start = function () {
		_Scene_Battle_start.call(this);
		if (this._diceContainer) {
			this.addChild(this._diceContainer);
		}
	};




	//=============================================================================
	// Sprite_Dice
	//=============================================================================
	function Sprite_Dice() {
		this.initialize.apply(this, arguments);
	};
	Sprite_Dice.checkUseSeparateImage = function (name) {
		return name !== '';
	};
	Sprite_Dice.loadBitmap = function (name, planeNum, value) {
		var file;
		var useSeparateImage = this.checkUseSeparateImage(name);
		if (useSeparateImage) {
			file = Sprite_Dice.FILE_PREFIX + name + '_' + value;
		} else {
			file = Sprite_Dice.FILE_PREFIX + planeNum;
		}

		var bitmap;
		if (parameters.useFolder) {
			bitmap = ImageManager.loadDice(file);
		} else {
			bitmap = ImageManager.loadSystem(file);
		}
		return bitmap;
	};

	Sprite_Dice.prototype = Object.create(Sprite.prototype);
	Sprite_Dice.prototype.constructor = Sprite_Dice;
	Sprite_Dice.prototype.initialize = function (diceId) {
		Sprite.prototype.initialize.call(this);
		this.initMembers();
		this._diceId = diceId;

		this.anchor.set(0.5, 0.5);
		this.visible = false;
	};

	Sprite_Dice.prototype.initMembers = function () {
		this._diceId = 0;
		this._planeNum = 0;
		this._value = 0;
		this._imageRow = 0;
		this._imageName = '';

		this._animationContainers = [];
	};

	Sprite_Dice.prototype.update = function () {
		Sprite.prototype.update.call(this);

		var dice = $gameDice.dice(this._diceId);
		this.visible = dice.showing;
		if (!this.visible) return;

		//animation
		var animation = dice.animation();
		if (animation) {
			this.startAnimation(animation);
		}
		if (this._animationContainers.length > 0) {
			this.updateAnimationSprites();
		}

		if (this._imageName !== dice.imageName) {
			this.refreshBitmap(dice);
		} else if (this._planeNum !== dice.planeNum) {
			this.refreshBitmap(dice);
		} else if (this._imageRow !== dice.imageRow) {
			this.refreshFrame(dice);
		} else if (this._value !== dice.displayValue) {
			if (!Sprite_Dice.checkUseSeparateImage(this._imageName)) {
				this.refreshFrame(dice);
			} else {
				this.refreshBitmap(dice);
			}
		}

		this.x = dice.x;
		this.y = dice.y;
		this.rotation = dice.rotation;
		this.opacity = dice.opacity;

		var scale = dice.scale / 100;
		this.scale.set(scale, scale);
	};

	Sprite_Dice.FILE_PREFIX = 'Dice_';
	Sprite_Dice.prototype.refreshBitmap = function (dice) {
		this._imageName = dice.imageName;
		this._planeNum = dice.planeNum;
		this._value = dice.displayValue;
		if (this._value === undefined) return;

		var file;
		var useSeparateImage = Sprite_Dice.checkUseSeparateImage(dice.imageName);
		if (useSeparateImage) {
			this._frame.x = 0;
			this._frame.y = 0;
		}

		var bitmap = Sprite_Dice.loadBitmap(dice.imageName, this._planeNum, this._value);
		this.bitmap = bitmap;
		bitmap.smooth = true;
		bitmap.addLoadListener(this.refreshFrame.bind(this, dice));
	};


	Sprite_Dice.prototype.refreshFrame = function (dice) {
		var value = dice.displayValue;
		this._imageRow = dice.imageRow;
		this._value = value;

		var useSeparateImage = Sprite_Dice.checkUseSeparateImage(dice.imageName);
		if (useSeparateImage) {
			this._frame.x = 0;
			this._frame.y = 0;
			this._refresh();
			return;
		}

		if (!this.bitmap.isReady()) {
			return;
		}
		var col = (value - dice.typeData().minNum);

		var sw = this.bitmap.width / this._planeNum;
		var sh = sw;
		var sx = col * sw;
		var sy = (this._imageRow - 1) * sh;
		this.setFrame(sx, sy, sw, sh);
	};

	/* animation
	===================================*/
	var _dummyShow = function () { };
	var _dummySetBlendColor = function () { };
	Sprite_Dice.prototype.startAnimation = function (requestData) {
		var animation = $dataAnimations[requestData.animationId];
		var mirror = requestData.mirror;
		var delay = requestData.delay;

		var target = requestData.isStatic ? {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			show: _dummyShow,
			setBlendColor: _dummySetBlendColor
		} : this;

		var sprite = new Sprite_Animation();
		sprite.setup(target, animation, mirror, delay);

		var container = new Sprite();
		container.addChild(sprite);
		this.parent.addChild(container);

		this._animationContainers.push(container);
	};

	Sprite_Dice.prototype.show = function () { };

	Sprite_Dice.prototype.updateAnimationSprites = function () {
		var containers = this._animationContainers;
		for (var i = containers.length - 1; i >= 0; i -= 1) {
			var container = containers[i];
			var sprite = container.children[0];
			if (!sprite.isPlaying()) {
				container.parent.removeChild(container);
				sprite.remove();
				containers.splice(i, 1);
			}
		}
	};



	/* test command
	===================================*/
	Game_Interpreter.prototype.trpDiceTest = function () {
		var eventId = this.isOnCurrentMap() ? this._eventId : 0;
		var list = [{ "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\C[2]賭博師\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["チンチロリンで勝負しようぜ！"] }, { "code": 102, "indent": 0, "parameters": [["掛け金100\\Gで勝負", "掛け金500\\Gで勝負", "掛け金2000\\Gで勝負", "いいえ"], 1, 0, 2, 0] }, { "code": 402, "indent": 0, "parameters": [0, "掛け金100\\Gで勝負"] }, { "code": 122, "indent": 1, "parameters": [11, 11, 0, 0, 100] }, { "code": 101, "indent": 1, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 1, "parameters": ["\\C[2]賭博師\\C[0]"] }, { "code": 401, "indent": 1, "parameters": ["よっしゃ、勝負だぜ！"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 402, "indent": 0, "parameters": [1, "掛け金500\\Gで勝負"] }, { "code": 122, "indent": 1, "parameters": [11, 11, 0, 0, 500] }, { "code": 101, "indent": 1, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 1, "parameters": ["\\C[2]賭博師\\C[0]"] }, { "code": 401, "indent": 1, "parameters": ["おっ、景気良さそうだな！"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 402, "indent": 0, "parameters": [2, "掛け金2000\\Gで勝負"] }, { "code": 122, "indent": 1, "parameters": [11, 11, 0, 0, 2000] }, { "code": 101, "indent": 1, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 1, "parameters": ["\\C[2]賭博師\\C[0]"] }, { "code": 401, "indent": 1, "parameters": ["しょ、勝負に出たな・・・！"] }, { "code": 401, "indent": 1, "parameters": ["負けられねーぜ！"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 402, "indent": 0, "parameters": [3, "いいえ"] }, { "code": 101, "indent": 1, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 1, "parameters": ["\\C[2]賭博師\\C[0]"] }, { "code": 401, "indent": 1, "parameters": ["けっ、つまんねぇ奴だぜ。"] }, { "code": 115, "indent": 1, "parameters": [] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 404, "indent": 0, "parameters": [] }, { "code": 122, "indent": 0, "parameters": [13, 13, 0, 1, 11] }, { "code": 122, "indent": 0, "parameters": [13, 13, 3, 0, 4] }, { "code": 122, "indent": 0, "parameters": [12, 12, 0, 3, 7, 2, 0] }, { "code": 111, "indent": 0, "parameters": [1, 12, 1, 13, 4] }, { "code": 101, "indent": 1, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 1, "parameters": ["\\C[2]賭博師\\C[0]"] }, { "code": 401, "indent": 1, "parameters": ["・・・おいおい、最低でも掛け金の４倍、"] }, { "code": 401, "indent": 1, "parameters": ["\\V[13]\\Gは持ってないと勝負は受けられねーぜ。"] }, { "code": 115, "indent": 1, "parameters": [] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 122, "indent": 0, "parameters": [10, 10, 0, 0, 150] }, { "code": 223, "indent": 0, "parameters": [[-150, -150, -150, 0], 30, true] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 全て"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 変数 1 2"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 変数 2 3"] }, { "code": 356, "indent": 0, "parameters": ["ダイス タイプ 1 チンチロ自分"] }, { "code": 356, "indent": 0, "parameters": ["ダイス タイプ 2 チンチロ相手"] }, { "code": 112, "indent": 0, "parameters": [] }, { "code": 356, "indent": 1, "parameters": ["ダイス 表示 1 308 \\V[10]"] }, { "code": 356, "indent": 1, "parameters": ["ダイス ランダムロール 1"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 表示 2 508 \\V[10]"] }, { "code": 356, "indent": 1, "parameters": ["ダイス ランダムロール 2"] }, { "code": 356, "indent": 1, "parameters": ["ダイス ウェイト"] }, { "code": 111, "indent": 1, "parameters": [1, 2, 1, 3, 5] }, { "code": 113, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 230, "indent": 1, "parameters": [30] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 413, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 2, 1, 3, 3] }, { "code": 121, "indent": 1, "parameters": [2, 2, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [2, 2, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 121, "indent": 0, "parameters": [3, 3, 1] }, { "code": 121, "indent": 0, "parameters": [4, 4, 1] }, { "code": 121, "indent": 0, "parameters": [6, 6, 1] }, { "code": 122, "indent": 0, "parameters": [14, 14, 0, 0, 0] }, { "code": 112, "indent": 0, "parameters": [] }, { "code": 230, "indent": 1, "parameters": [10] }, { "code": 111, "indent": 1, "parameters": [0, 2, 0] }, { "code": 111, "indent": 2, "parameters": [0, 6, 0] }, { "code": 231, "indent": 3, "parameters": [1, "your_turn_continue", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 231, "indent": 3, "parameters": [1, "your_turn", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 411, "indent": 1, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [0, 6, 0] }, { "code": 231, "indent": 3, "parameters": [1, "enemy_turn_continue", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 231, "indent": 3, "parameters": [1, "enemy_turn", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 250, "indent": 1, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 1, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 1, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 1, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 1, "parameters": [1] }, { "code": 356, "indent": 1, "parameters": ["ダイス 非表示 1 10"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 非表示 2 10"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 非表示 3 10"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 非表示 4 10"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 非表示 5 10"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 非表示 6 10"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 変数 1 2"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 変数 2 3"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 変数 3 4"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 変数 4 5"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 変数 5 6"] }, { "code": 356, "indent": 1, "parameters": ["ダイス 変数 6 7"] }, { "code": 230, "indent": 1, "parameters": [10] }, { "code": 356, "indent": 1, "parameters": ["ダイス クリア 1"] }, { "code": 356, "indent": 1, "parameters": ["ダイス クリア 2"] }, { "code": 356, "indent": 1, "parameters": ["ダイス クリア 3"] }, { "code": 356, "indent": 1, "parameters": ["ダイス クリア 4"] }, { "code": 356, "indent": 1, "parameters": ["ダイス クリア 5"] }, { "code": 356, "indent": 1, "parameters": ["ダイス クリア 6"] }, { "code": 356, "indent": 1, "parameters": ["ダイス タイプ 1 チンチロ自分"] }, { "code": 356, "indent": 1, "parameters": ["ダイス タイプ 2 チンチロ自分"] }, { "code": 356, "indent": 1, "parameters": ["ダイス タイプ 3 チンチロ自分"] }, { "code": 356, "indent": 1, "parameters": ["ダイス タイプ 4 チンチロ相手"] }, { "code": 356, "indent": 1, "parameters": ["ダイス タイプ 5 チンチロ相手"] }, { "code": 356, "indent": 1, "parameters": ["ダイス タイプ 6 チンチロ相手"] }, { "code": 121, "indent": 1, "parameters": [5, 5, 0] }, { "code": 122, "indent": 1, "parameters": [19, 19, 0, 0, 0] }, { "code": 112, "indent": 1, "parameters": [] }, { "code": 122, "indent": 2, "parameters": [19, 19, 1, 0, 1] }, { "code": 111, "indent": 2, "parameters": [0, 2, 0] }, { "code": 121, "indent": 3, "parameters": [7, 7, 0] }, { "code": 112, "indent": 3, "parameters": [] }, { "code": 111, "indent": 4, "parameters": [11, "ok"] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 111, "indent": 4, "parameters": [12, "TouchInput.isTriggered()"] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 230, "indent": 4, "parameters": [1] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 413, "indent": 3, "parameters": [] }, { "code": 121, "indent": 3, "parameters": [7, 7, 1] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 452, 100, 100, 0, 0, 30, false] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 1 308 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 2 408 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 3 508 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 1"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 2"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 3"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 統計 開始 1 2 3"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 4 308 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 5 408 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 6 508 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 4"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 5"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 6"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 統計 開始 4 5 6"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 356, "indent": 2, "parameters": ["ダイス ウェイト"] }, { "code": 230, "indent": 2, "parameters": [30] }, { "code": 356, "indent": 2, "parameters": ["dice checker maxPair 24"] }, { "code": 356, "indent": 2, "parameters": ["dice checker maxPairNum 25"] }, { "code": 356, "indent": 2, "parameters": ["dice checker total 26"] }, { "code": 356, "indent": 2, "parameters": ["dice checker straight 27"] }, { "code": 122, "indent": 2, "parameters": [22, 22, 0, 0, 0] }, { "code": 111, "indent": 2, "parameters": [1, 24, 0, 2, 0] }, { "code": 122, "indent": 3, "parameters": [22, 22, 0, 0, 1] }, { "code": 122, "indent": 3, "parameters": [23, 23, 0, 1, 26] }, { "code": 122, "indent": 3, "parameters": [23, 23, 2, 1, 25] }, { "code": 122, "indent": 3, "parameters": [23, 23, 2, 1, 25] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 24, 0, 3, 0] }, { "code": 111, "indent": 3, "parameters": [1, 25, 0, 1, 0] }, { "code": 122, "indent": 4, "parameters": [22, 22, 0, 0, 3] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 411, "indent": 3, "parameters": [] }, { "code": 122, "indent": 4, "parameters": [22, 22, 0, 0, 2] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 122, "indent": 3, "parameters": [23, 23, 0, 1, 25] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 27, 0, 1, 0] }, { "code": 122, "indent": 3, "parameters": [22, 22, 0, 0, 4] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 27, 0, 4, 0] }, { "code": 122, "indent": 3, "parameters": [22, 22, 0, 0, 5] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 0, 5] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 19, 0, 3, 0] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 413, "indent": 1, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [16, 16, 0, 1, 22] }, { "code": 122, "indent": 1, "parameters": [17, 17, 0, 1, 23] }, { "code": 112, "indent": 1, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 1, 0] }, { "code": 111, "indent": 3, "parameters": [0, 5, 0] }, { "code": 111, "indent": 4, "parameters": [1, 23, 0, 1, 0] }, { "code": 231, "indent": 5, "parameters": [1, "hand_parent_1", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 5, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 5, "parameters": [1] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 111, "indent": 4, "parameters": [1, 23, 0, 6, 0] }, { "code": 231, "indent": 5, "parameters": [1, "hand_parent_6", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 5, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 5, "parameters": [1] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 1, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_1", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 2, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_2", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 3, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_3", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 4, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_4", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 5, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_5", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 6, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_6", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 2, 0] }, { "code": 231, "indent": 3, "parameters": [1, "hand_arashi", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 3, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 231, "indent": 3, "parameters": [1, "hand_pinzoro", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, false] }, { "code": 230, "indent": 3, "parameters": [3] }, { "code": 231, "indent": 3, "parameters": [2, "hand_pinzoro", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 232, "indent": 3, "parameters": [2, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, false] }, { "code": 230, "indent": 3, "parameters": [5] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, false] }, { "code": 230, "indent": 3, "parameters": [3] }, { "code": 232, "indent": 3, "parameters": [2, 0, 1, 0, 408, 212, 100, 100, 0, 0, 60, false] }, { "code": 230, "indent": 3, "parameters": [58] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 235, "indent": 3, "parameters": [2] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 4, 0] }, { "code": 231, "indent": 3, "parameters": [1, "hand_hihumi", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 5, 0] }, { "code": 231, "indent": 3, "parameters": [1, "hand_shigoro", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 231, "indent": 2, "parameters": [1, "hand_none", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 2, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 2, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 2, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 2, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 2, "parameters": [1] }, { "code": 113, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 413, "indent": 1, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [18, 18, 0, 0, 0] }, { "code": 111, "indent": 1, "parameters": [1, 22, 0, 1, 0] }, { "code": 111, "indent": 2, "parameters": [1, 17, 0, 1, 0] }, { "code": 122, "indent": 3, "parameters": [18, 18, 0, 0, -1] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 17, 0, 6, 0] }, { "code": 122, "indent": 3, "parameters": [18, 18, 0, 0, 1] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 22, 0, 2, 0] }, { "code": 122, "indent": 2, "parameters": [18, 18, 0, 0, 3] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 22, 0, 3, 0] }, { "code": 122, "indent": 2, "parameters": [18, 18, 0, 0, 5] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 22, 0, 4, 0] }, { "code": 122, "indent": 2, "parameters": [18, 18, 0, 0, -2] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 22, 0, 5, 0] }, { "code": 122, "indent": 2, "parameters": [18, 18, 0, 0, 2] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 18, 0, 0, 5] }, { "code": 119, "indent": 2, "parameters": ["親番の終了"] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [0, 2, 0] }, { "code": 356, "indent": 2, "parameters": ["ダイス 移動 1 50 \\V[10] 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 移動 2 100 \\V[10] 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 移動 3 150 \\V[10] 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 拡大 1 80 20"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 拡大 2 80 20"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 拡大 3 80 20"] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 411, "indent": 1, "parameters": [] }, { "code": 356, "indent": 2, "parameters": ["ダイス 移動 4 666 \\V[10] 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 移動 5 716 \\V[10] 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 移動 6 766 \\V[10] 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 拡大 4 80 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 拡大 5 80 30"] }, { "code": 356, "indent": 2, "parameters": ["ダイス 拡大 6 80 30"] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [5, 5, 1] }, { "code": 111, "indent": 1, "parameters": [0, 2, 1] }, { "code": 231, "indent": 2, "parameters": [1, "yout_turn_child", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 411, "indent": 1, "parameters": [] }, { "code": 231, "indent": 2, "parameters": [1, "enemy_turn_child", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 250, "indent": 1, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 1, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 1, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 1, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 1, "parameters": [1] }, { "code": 122, "indent": 1, "parameters": [19, 19, 0, 0, 0] }, { "code": 112, "indent": 1, "parameters": [] }, { "code": 122, "indent": 2, "parameters": [19, 19, 1, 0, 1] }, { "code": 111, "indent": 2, "parameters": [0, 2, 1] }, { "code": 121, "indent": 3, "parameters": [7, 7, 0] }, { "code": 112, "indent": 3, "parameters": [] }, { "code": 111, "indent": 4, "parameters": [11, "ok"] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 111, "indent": 4, "parameters": [12, "TouchInput.isTriggered()"] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 230, "indent": 4, "parameters": [1] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 413, "indent": 3, "parameters": [] }, { "code": 121, "indent": 3, "parameters": [7, 7, 1] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 452, 100, 100, 0, 0, 30, false] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 1 308 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 2 408 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 3 508 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 1"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 2"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 3"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 統計 開始 1 2 3"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 4 308 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 5 408 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 表示 6 508 \\V[10]"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 4"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 5"] }, { "code": 356, "indent": 3, "parameters": ["ダイス ランダムロール 6"] }, { "code": 356, "indent": 3, "parameters": ["ダイス 統計 開始 4 5 6"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 356, "indent": 2, "parameters": ["ダイス ウェイト"] }, { "code": 230, "indent": 2, "parameters": [30] }, { "code": 356, "indent": 2, "parameters": ["dice checker maxPair 24"] }, { "code": 356, "indent": 2, "parameters": ["dice checker maxPairNum 25"] }, { "code": 356, "indent": 2, "parameters": ["dice checker total 26"] }, { "code": 356, "indent": 2, "parameters": ["dice checker straight 27"] }, { "code": 122, "indent": 2, "parameters": [22, 22, 0, 0, 0] }, { "code": 111, "indent": 2, "parameters": [1, 24, 0, 2, 0] }, { "code": 122, "indent": 3, "parameters": [22, 22, 0, 0, 1] }, { "code": 122, "indent": 3, "parameters": [23, 23, 0, 1, 26] }, { "code": 122, "indent": 3, "parameters": [23, 23, 2, 1, 25] }, { "code": 122, "indent": 3, "parameters": [23, 23, 2, 1, 25] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 24, 0, 3, 0] }, { "code": 111, "indent": 3, "parameters": [1, 25, 0, 1, 0] }, { "code": 122, "indent": 4, "parameters": [22, 22, 0, 0, 3] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 411, "indent": 3, "parameters": [] }, { "code": 122, "indent": 4, "parameters": [22, 22, 0, 0, 2] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 122, "indent": 3, "parameters": [23, 23, 0, 1, 25] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 27, 0, 1, 0] }, { "code": 122, "indent": 3, "parameters": [22, 22, 0, 0, 4] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 27, 0, 4, 0] }, { "code": 122, "indent": 3, "parameters": [22, 22, 0, 0, 5] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 0, 5] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 19, 0, 3, 0] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 413, "indent": 1, "parameters": [] }, { "code": 112, "indent": 1, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 1, 0] }, { "code": 111, "indent": 3, "parameters": [0, 5, 0] }, { "code": 111, "indent": 4, "parameters": [1, 23, 0, 1, 0] }, { "code": 231, "indent": 5, "parameters": [1, "hand_parent_1", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 5, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 5, "parameters": [1] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 111, "indent": 4, "parameters": [1, 23, 0, 6, 0] }, { "code": 231, "indent": 5, "parameters": [1, "hand_parent_6", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 5, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 5, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 5, "parameters": [1] }, { "code": 113, "indent": 5, "parameters": [] }, { "code": 0, "indent": 5, "parameters": [] }, { "code": 412, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 1, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_1", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 2, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_2", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 3, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_3", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 4, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_4", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 5, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_5", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 0, 6, 0] }, { "code": 231, "indent": 4, "parameters": [1, "hand_6", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 4, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 4, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 4, "parameters": [1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 2, 0] }, { "code": 231, "indent": 3, "parameters": [1, "hand_arashi", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 3, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 231, "indent": 3, "parameters": [1, "hand_pinzoro", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, false] }, { "code": 230, "indent": 3, "parameters": [3] }, { "code": 231, "indent": 3, "parameters": [2, "hand_pinzoro", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 232, "indent": 3, "parameters": [2, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, false] }, { "code": 230, "indent": 3, "parameters": [5] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, false] }, { "code": 230, "indent": 3, "parameters": [3] }, { "code": 232, "indent": 3, "parameters": [2, 0, 1, 0, 408, 212, 100, 100, 0, 0, 60, false] }, { "code": 230, "indent": 3, "parameters": [58] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 235, "indent": 3, "parameters": [2] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 4, 0] }, { "code": 231, "indent": 3, "parameters": [1, "hand_hihumi", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 5, 0] }, { "code": 231, "indent": 3, "parameters": [1, "hand_shigoro", 1, 0, 408, 212, 800, 800, 0, 0] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Collapse3", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 105, 105, 255, 0, 8, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 100, 100, 255, 0, 60, true] }, { "code": 232, "indent": 3, "parameters": [1, 0, 1, 0, 408, 212, 130, 0, 255, 0, 6, true] }, { "code": 235, "indent": 3, "parameters": [1] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 231, "indent": 2, "parameters": [1, "hand_none", 1, 0, 508, 212, 130, 0, 0, 0] }, { "code": 250, "indent": 2, "parameters": [{ "name": "Attack2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 232, "indent": 2, "parameters": [1, 0, 1, 0, 413, 212, 100, 100, 255, 0, 6, true] }, { "code": 232, "indent": 2, "parameters": [1, 0, 1, 0, 403, 212, 100, 100, 255, 0, 45, true] }, { "code": 232, "indent": 2, "parameters": [1, 0, 1, 0, 358, 212, 130, 0, 0, 0, 8, true] }, { "code": 235, "indent": 2, "parameters": [1] }, { "code": 113, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 413, "indent": 1, "parameters": [] }, { "code": 112, "indent": 1, "parameters": [] }, { "code": 122, "indent": 2, "parameters": [18, 18, 0, 0, 0] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 2, 0] }, { "code": 122, "indent": 3, "parameters": [18, 18, 0, 0, -3] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 3, 0] }, { "code": 122, "indent": 3, "parameters": [18, 18, 0, 0, -5] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 4, 0] }, { "code": 122, "indent": 3, "parameters": [18, 18, 0, 0, 2] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 5, 0] }, { "code": 122, "indent": 3, "parameters": [18, 18, 0, 0, -2] }, { "code": 113, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 1, 0] }, { "code": 111, "indent": 3, "parameters": [1, 16, 0, 0, 0] }, { "code": 122, "indent": 4, "parameters": [18, 18, 0, 0, -1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 1, 17, 3] }, { "code": 122, "indent": 4, "parameters": [18, 18, 0, 0, -1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [1, 23, 1, 17, 4] }, { "code": 122, "indent": 4, "parameters": [18, 18, 0, 0, 1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 22, 0, 0, 0] }, { "code": 111, "indent": 3, "parameters": [1, 16, 0, 0, 3] }, { "code": 122, "indent": 4, "parameters": [18, 18, 0, 0, 1] }, { "code": 113, "indent": 4, "parameters": [] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 113, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 413, "indent": 1, "parameters": [] }, { "code": 118, "indent": 1, "parameters": ["親番の終了"] }, { "code": 122, "indent": 1, "parameters": [15, 15, 0, 1, 11] }, { "code": 122, "indent": 1, "parameters": [15, 15, 3, 1, 18] }, { "code": 111, "indent": 1, "parameters": [0, 2, 1] }, { "code": 122, "indent": 2, "parameters": [15, 15, 3, 0, -1] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 125, "indent": 1, "parameters": [0, 1, 15] }, { "code": 122, "indent": 1, "parameters": [14, 14, 1, 1, 15] }, { "code": 111, "indent": 1, "parameters": [1, 15, 0, 0, 0] }, { "code": 101, "indent": 2, "parameters": ["", 0, 1, 1] }, { "code": 401, "indent": 2, "parameters": ["\\$引き分け。"] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 411, "indent": 1, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 15, 0, 0, 3] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Coin", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 101, "indent": 3, "parameters": ["", 0, 1, 1] }, { "code": 401, "indent": 3, "parameters": ["\\$\\V[15]\\Gの勝ち！"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 250, "indent": 3, "parameters": [{ "name": "Shop1", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 101, "indent": 3, "parameters": ["", 0, 1, 1] }, { "code": 401, "indent": 3, "parameters": ["\\$\\V[15]\\Gの負け…"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 18, 0, 0, 2] }, { "code": 111, "indent": 2, "parameters": [0, 2, 0] }, { "code": 111, "indent": 3, "parameters": [0, 4, 0] }, { "code": 119, "indent": 4, "parameters": ["ゲーム終了"] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 411, "indent": 3, "parameters": [] }, { "code": 121, "indent": 4, "parameters": [3, 3, 0] }, { "code": 121, "indent": 4, "parameters": [2, 2, 1] }, { "code": 121, "indent": 4, "parameters": [6, 6, 1] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [0, 3, 0] }, { "code": 119, "indent": 4, "parameters": ["ゲーム終了"] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 411, "indent": 3, "parameters": [] }, { "code": 121, "indent": 4, "parameters": [4, 4, 0] }, { "code": 121, "indent": 4, "parameters": [2, 2, 0] }, { "code": 121, "indent": 4, "parameters": [6, 6, 1] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 411, "indent": 1, "parameters": [] }, { "code": 121, "indent": 2, "parameters": [6, 6, 0] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 413, "indent": 0, "parameters": [] }, { "code": 118, "indent": 0, "parameters": ["ゲーム終了"] }, { "code": 111, "indent": 0, "parameters": [1, 14, 0, 0, 1] }, { "code": 250, "indent": 1, "parameters": [{ "name": "Applause2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 101, "indent": 1, "parameters": ["", 0, 1, 1] }, { "code": 401, "indent": 1, "parameters": ["\\$合計\\V[14]\\Gだけ勝った！"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 101, "indent": 1, "parameters": ["", 0, 1, 1] }, { "code": 401, "indent": 1, "parameters": ["\\$合計\\V[14]\\Gだけ負けてしまった……"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 1 10"] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 2 10"] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 3 10"] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 4 10"] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 5 10"] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 6 10"] }, { "code": 223, "indent": 0, "parameters": [[0, 0, 0, 0], 30, true] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["【賭博師】"] }, { "code": 401, "indent": 0, "parameters": ["なかなかいい勝負だったぜ！"] }, { "code": 0, "indent": 0, "parameters": [] }];
		this.setupChild(list, eventId);
	};
	Game_Interpreter.prototype.trpDiceTest2 = function () {
		var eventId = this.isOnCurrentMap() ? this._eventId : 0;
		var list = [{ "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>ダイスプラグインの動作テストを行います。"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>1.ダイスロール"] }, { "code": 356, "indent": 0, "parameters": ["dice type 1 チンチロ自分"] }, { "code": 356, "indent": 0, "parameters": ["dice show 1 408 150"] }, { "code": 356, "indent": 0, "parameters": ["dice 乱数ロール 1"] }, { "code": 356, "indent": 0, "parameters": ["dice wait"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>2.ダイスの移動・拡大"] }, { "code": 356, "indent": 0, "parameters": ["dice size 1 50 30"] }, { "code": 356, "indent": 0, "parameters": ["dice move 1 708 150 30"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 356, "indent": 0, "parameters": ["dice size 1 200 30"] }, { "code": 356, "indent": 0, "parameters": ["dice move 1 108 150 30"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>3.アニメーション・タイプ変更"] }, { "code": 356, "indent": 0, "parameters": ["dice animation 1 76"] }, { "code": 356, "indent": 0, "parameters": ["dice size 1 100"] }, { "code": 356, "indent": 0, "parameters": ["dice type 1 すごろく１０"] }, { "code": 230, "indent": 0, "parameters": [60] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>4.非表示・表示・複数ダイス"] }, { "code": 356, "indent": 0, "parameters": ["dice hide 1 30"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 356, "indent": 0, "parameters": ["dice type 2 すごろく４"] }, { "code": 356, "indent": 0, "parameters": ["dice type 3 すごろく１"] }, { "code": 356, "indent": 0, "parameters": ["dice type 4 すごろく４５６"] }, { "code": 356, "indent": 0, "parameters": ["dice type 5 すごろく１０"] }, { "code": 356, "indent": 0, "parameters": ["dice type 6 すごろく１２３"] }, { "code": 356, "indent": 0, "parameters": ["dice show 1 108 150 30"] }, { "code": 356, "indent": 0, "parameters": ["dice change 1 4"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice show 2 228 150 30"] }, { "code": 356, "indent": 0, "parameters": ["dice change 2 4"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice show 3 348 150 30"] }, { "code": 356, "indent": 0, "parameters": ["dice change 3 4"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice show 4 468 150 30"] }, { "code": 356, "indent": 0, "parameters": ["dice change 4 4"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice show 5 588 150 30"] }, { "code": 356, "indent": 0, "parameters": ["dice change 5 4"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice show 6 708 150 30"] }, { "code": 356, "indent": 0, "parameters": ["dice change 6 4"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 356, "indent": 0, "parameters": ["dice randomroll 1 250 true"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice randomroll 2 250 true"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice randomroll 3 250 true"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice randomroll 4 250 true"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice randomroll 5 250 true"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice randomroll 6 250 true"] }, { "code": 356, "indent": 0, "parameters": ["dice wait"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice scale 1 120 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice scale 1 100 5"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 2 120 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice roll 1 600 true"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 2 100 5"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 3 120 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice roll 2 600 true"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 3 100 5"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 4 120 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice roll 3 600 true"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 4 100 5"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 5 120 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice roll 4 600 true"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 5 100 5"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 6 120 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice roll 5 600 true"] }, { "code": 356, "indent": 0, "parameters": ["dice scale 6 100 5"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["dice roll 6 600 true"] }, { "code": 356, "indent": 0, "parameters": ["dice wait"] }, { "code": 356, "indent": 0, "parameters": ["dice clear 1"] }, { "code": 356, "indent": 0, "parameters": ["dice clear 2"] }, { "code": 356, "indent": 0, "parameters": ["dice clear 3"] }, { "code": 356, "indent": 0, "parameters": ["dice clear 4"] }, { "code": 356, "indent": 0, "parameters": ["dice clear 5"] }, { "code": 356, "indent": 0, "parameters": ["dice clear 6"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>以上でダイスプラグインの動作テストを終わります。"] }, { "code": 0, "indent": 0, "parameters": [] }];
		this.setupChild(list, eventId);
	};
	Game_Interpreter.prototype.trpDiceTest3 = function () {
		var eventId = this.isOnCurrentMap() ? this._eventId : 0;
		var list = [{ "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[24]「カスタム情報ウィンドウプラグイン」\\C[0]の"] }, { "code": 401, "indent": 0, "parameters": ["\\>動作テストを行います。"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ クリア 全て"] }, { "code": 230, "indent": 0, "parameters": [10] }, { "code": 122, "indent": 0, "parameters": [117, 117, 0, 0, 30] }, { "code": 122, "indent": 0, "parameters": [118, 118, 0, 0, 15] }, { "code": 122, "indent": 0, "parameters": [119, 119, 0, 0, 10] }, { "code": 122, "indent": 0, "parameters": [120, 120, 0, 0, 5] }, { "code": 122, "indent": 0, "parameters": [121, 121, 0, 0, 0] }, { "code": 122, "indent": 0, "parameters": [122, 122, 0, 0, -10] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 評価左 テキスト 180 24"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 評価左 fontSize:18"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 評価右 テキスト 180 24"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 評価右 fontSize:18 align:right"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 作成 1D6詳細 180 125"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6詳細 評価左 0 0 判定：\\C[24]\\V[107]\\C[0]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6詳細 評価左 0 25 要求値：\\S[62]\\C[14]？？？\\C[0]:\\V[103]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6詳細 評価左 0 50 パーティー評価値：\\V[108]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6詳細 評価右 0 75 └（最高値：\\V[109]）"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6詳細 評価右 0 100 └（平均値：\\V[110]）"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 作成 1D6結果 180 248"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 ハイライト 画像 0 0 dice_list_highlight"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 ハイライト sprite:true underContents:true"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 ハイライト 5 10"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト opacity:170 visible:false"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 サイコロ 画像 0 0 dice_list"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 サイコロ sprite:true"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 サイコロ 0 0"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 行テキスト テキスト 140 38"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 行テキスト fontSize:22"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 行テキスト 45 8 \\S[64]\\C[6]:\\C[8]\\S\\V[123]→評価\\V[111]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 行テキスト 45 47 \\S[65]\\C[6]:\\C[8]\\S\\V[124]→評価\\V[112]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 行テキスト 45 86 \\S[66]\\C[6]:\\C[8]\\S\\V[125]→評価\\V[113]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 行テキスト 45 125 \\S[67]\\C[6]:\\C[8]\\S\\V[126]→評価\\V[114]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 行テキスト 45 164 \\S[68]\\C[6]:\\C[8]\\S\\V[127]→評価\\V[115]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D6結果 行テキスト 45 203 \\S[69]\\C[6]:\\C[8]\\S\\V[128]→評価\\V[116]"] }, { "code": 122, "indent": 0, "parameters": [123, 123, 0, 4, "var value=$gameVariables.value(117); (value>=0 ? '+'+value : value)"] }, { "code": 122, "indent": 0, "parameters": [124, 124, 0, 4, "var value=$gameVariables.value(118); (value>=0 ? '+'+value : value)"] }, { "code": 122, "indent": 0, "parameters": [125, 125, 0, 4, "var value=$gameVariables.value(119); (value>=0 ? '+'+value : value)"] }, { "code": 122, "indent": 0, "parameters": [126, 126, 0, 4, "var value=$gameVariables.value(120); (value>=0 ? '+'+value : value)"] }, { "code": 122, "indent": 0, "parameters": [127, 127, 0, 4, "var value=$gameVariables.value(121); (value>=0 ? '+'+value : value)"] }, { "code": 122, "indent": 0, "parameters": [128, 128, 0, 4, "var value=$gameVariables.value(122); (value>=0 ? '+'+value : value)"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 作成 1D100詳細 200 125"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100詳細 評価左 0 0 判定：\\C[24]\\V[107]\\C[0]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100詳細 評価左 0 25 対抗値：\\S[62]\\C[14]？？？\\C[0]:\\V[103]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100詳細 評価左 0 50 パーティー評価値：\\V[108]"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100詳細 評価右 0 75 └（最高値：\\V[109]）"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100詳細 評価右 0 100 └（平均値：\\V[110]）"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 作成 1D100結果 200 170"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 ハイライト2 画像 0 0 dice_list_highlight_long"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 ハイライト2 sprite:true underContents:true"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100結果 ハイライト2 0 10"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ作成 行テキスト2 テキスト 190 38"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ設定 行テキスト2 fontSize:21"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100結果 行テキスト2 5 8 96~00:\\C[2]ファンブル"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100結果 行テキスト2 5 47 \\V[131]-95:\\C[8]失敗"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100結果 行テキスト2 5 86 06~\\V[130]:\\C[0]成功"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ パーツ登録 1D100結果 行テキスト2 5 125 01~05:\\C[6]クリティカル"] }, { "code": 122, "indent": 0, "parameters": [102, 102, 0, 0, 6] }, { "code": 122, "indent": 0, "parameters": [103, 103, 0, 0, 35] }, { "code": 111, "indent": 0, "parameters": [1, 102, 0, 0, 1] }, { "code": 355, "indent": 1, "parameters": ["var variableId = 102;"] }, { "code": 655, "indent": 1, "parameters": ["var paramId = $gameVariables.value(variableId);"] }, { "code": 655, "indent": 1, "parameters": ["var maxValue = 0, totalValue = 0;"] }, { "code": 655, "indent": 1, "parameters": ["$gameParty.members().forEach(function(member){"] }, { "code": 655, "indent": 1, "parameters": [" var value = member.param(paramId);"] }, { "code": 655, "indent": 1, "parameters": [" totalValue += value;"] }, { "code": 655, "indent": 1, "parameters": [" if(value > maxValue) maxValue = value;"] }, { "code": 655, "indent": 1, "parameters": ["});"] }, { "code": 655, "indent": 1, "parameters": ["$gameVariables.setValue(109,maxValue);"] }, { "code": 655, "indent": 1, "parameters": ["var average = totalValue/$gameParty.members().length"] }, { "code": 655, "indent": 1, "parameters": ["$gameVariables.setValue(110,average);"] }, { "code": 122, "indent": 1, "parameters": [108, 108, 0, 1, 109] }, { "code": 122, "indent": 1, "parameters": [108, 108, 1, 1, 110] }, { "code": 122, "indent": 1, "parameters": [108, 108, 4, 0, 2] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [108, 108, 0, 0, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 102, 0, 0, 1] }, { "code": 122, "indent": 1, "parameters": [107, 107, 0, 4, "var variableId=102; var paramId=$gameVariables.value(variableId); TextManager.param(paramId);"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [107, 107, 0, 4, "'固定確率'"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 122, "indent": 0, "parameters": [111, 111, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [111, 111, 1, 1, 117] }, { "code": 122, "indent": 0, "parameters": [112, 112, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [112, 112, 1, 1, 118] }, { "code": 122, "indent": 0, "parameters": [113, 113, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [113, 113, 1, 1, 119] }, { "code": 122, "indent": 0, "parameters": [114, 114, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [114, 114, 1, 1, 120] }, { "code": 122, "indent": 0, "parameters": [115, 115, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [115, 115, 1, 1, 121] }, { "code": 122, "indent": 0, "parameters": [116, 116, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [116, 116, 1, 1, 122] }, { "code": 111, "indent": 0, "parameters": [0, 62, 0] }, { "code": 121, "indent": 1, "parameters": [64, 64, 1] }, { "code": 121, "indent": 1, "parameters": [65, 65, 1] }, { "code": 121, "indent": 1, "parameters": [66, 66, 1] }, { "code": 121, "indent": 1, "parameters": [67, 67, 1] }, { "code": 121, "indent": 1, "parameters": [68, 68, 1] }, { "code": 121, "indent": 1, "parameters": [69, 69, 1] }, { "code": 115, "indent": 1, "parameters": [] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 111, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [64, 64, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [64, 64, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 112, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [65, 65, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [65, 65, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 113, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [66, 66, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [66, 66, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 114, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [67, 67, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [67, 67, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 115, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [68, 68, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [68, 68, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 116, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [69, 69, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [69, 69, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 表示 1D6詳細 550 100"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>画像・テキストを自由に配置したウィンドウを表示する"] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]「マップ上での情報表示に特化」\\C[0]した付属プラグインです。"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>制御文字で指定した変数が変わると、"] }, { "code": 401, "indent": 0, "parameters": ["\\>自動で表示内容も変わります。"] }, { "code": 401, "indent": 0, "parameters": ["\\>（右上ウィンドウの「要求値」に注目）"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 2, 0, 1] }, { "code": 230, "indent": 0, "parameters": [20] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 122, "indent": 0, "parameters": [103, 103, 1, 0, 1] }, { "code": 230, "indent": 0, "parameters": [20] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:false"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 表示 1D6結果 550 255"] }, { "code": 223, "indent": 0, "parameters": [[-100, -100, -100, 0], 20, true] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 1"] }, { "code": 356, "indent": 0, "parameters": ["ダイス タイプ 1 TRPG風6"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 変数 1 104"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 拡大 1 150"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 表示 1 300 350"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 乱数ロール 1"] }, { "code": 111, "indent": 0, "parameters": [1, 104, 0, 6, 0] }, { "code": 122, "indent": 1, "parameters": [106, 106, 0, 1, 111] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト y:eval_10+39*0"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 104, 0, 5, 0] }, { "code": 122, "indent": 1, "parameters": [106, 106, 0, 1, 112] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト y:eval_10+39*1"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 104, 0, 4, 0] }, { "code": 122, "indent": 1, "parameters": [106, 106, 0, 1, 113] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト y:eval_10+39*2"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 104, 0, 3, 0] }, { "code": 122, "indent": 1, "parameters": [106, 106, 0, 1, 114] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト y:eval_10+39*3"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 104, 0, 2, 0] }, { "code": 122, "indent": 1, "parameters": [106, 106, 0, 1, 115] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト y:eval_10+39*4"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 104, 0, 1, 0] }, { "code": 122, "indent": 1, "parameters": [106, 106, 0, 1, 116] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト y:eval_10+39*5"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 106, 1, 103, 1] }, { "code": 121, "indent": 1, "parameters": [63, 63, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 121, "indent": 1, "parameters": [63, 63, 1] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:true"] }, { "code": 230, "indent": 0, "parameters": [2] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:false"] }, { "code": 230, "indent": 0, "parameters": [5] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:true"] }, { "code": 230, "indent": 0, "parameters": [2] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:false"] }, { "code": 230, "indent": 0, "parameters": [4] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:true"] }, { "code": 230, "indent": 0, "parameters": [2] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:false"] }, { "code": 230, "indent": 0, "parameters": [2] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ スプライト 1D6結果 ハイライト visible:true"] }, { "code": 250, "indent": 0, "parameters": [{ "name": "Cursor2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>ハイライト部分は画像で表示しており、"] }, { "code": 401, "indent": 0, "parameters": ["\\>位置を随時変更することが可能です。"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 非表示 1D6詳細"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 非表示 1D6結果"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 非表示 1"] }, { "code": 223, "indent": 0, "parameters": [[0, 0, 0, 0], 20, true] }, { "code": 108, "indent": 0, "parameters": ["================================================================================================"] }, { "code": 122, "indent": 0, "parameters": [102, 102, 0, 0, -1] }, { "code": 122, "indent": 0, "parameters": [103, 103, 0, 0, -3] }, { "code": 111, "indent": 0, "parameters": [1, 102, 0, 0, 1] }, { "code": 355, "indent": 1, "parameters": ["var variableId = 102;"] }, { "code": 655, "indent": 1, "parameters": ["var paramId = $gameVariables.value(variableId);"] }, { "code": 655, "indent": 1, "parameters": ["var maxValue = 0, totalValue = 0;"] }, { "code": 655, "indent": 1, "parameters": ["$gameParty.members().forEach(function(member){"] }, { "code": 655, "indent": 1, "parameters": [" var value = member.param(paramId);"] }, { "code": 655, "indent": 1, "parameters": [" totalValue += value;"] }, { "code": 655, "indent": 1, "parameters": [" if(value > maxValue) maxValue = value;"] }, { "code": 655, "indent": 1, "parameters": ["});"] }, { "code": 655, "indent": 1, "parameters": ["$gameVariables.setValue(109,maxValue);"] }, { "code": 655, "indent": 1, "parameters": ["var average = totalValue/$gameParty.members().length"] }, { "code": 655, "indent": 1, "parameters": ["$gameVariables.setValue(110,average);"] }, { "code": 122, "indent": 1, "parameters": [108, 108, 0, 1, 109] }, { "code": 122, "indent": 1, "parameters": [108, 108, 1, 1, 110] }, { "code": 122, "indent": 1, "parameters": [108, 108, 4, 0, 2] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [108, 108, 0, 0, 0] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 102, 0, 0, 1] }, { "code": 122, "indent": 1, "parameters": [107, 107, 0, 4, "var variableId=102; var paramId=$gameVariables.value(variableId); TextManager.param(paramId);"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [107, 107, 0, 4, "'固定確率'"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 122, "indent": 0, "parameters": [130, 130, 0, 1, 108] }, { "code": 122, "indent": 0, "parameters": [130, 130, 2, 1, 103] }, { "code": 122, "indent": 0, "parameters": [130, 130, 3, 0, 5] }, { "code": 122, "indent": 0, "parameters": [130, 130, 1, 0, 50] }, { "code": 111, "indent": 0, "parameters": [1, 130, 0, 5, 2] }, { "code": 122, "indent": 1, "parameters": [130, 130, 0, 0, 6] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 130, 0, 95, 1] }, { "code": 122, "indent": 1, "parameters": [130, 130, 0, 0, 94] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 122, "indent": 0, "parameters": [131, 131, 0, 1, 130] }, { "code": 122, "indent": 0, "parameters": [131, 131, 1, 0, 1] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 表示 1D100詳細 550 100"] }, { "code": 111, "indent": 0, "parameters": [0, 62, 1] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ 表示 1D100結果 550 255"] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:false"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 223, "indent": 0, "parameters": [[-100, -100, -100, 0], 20, true] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 1"] }, { "code": 356, "indent": 0, "parameters": ["ダイス クリア 2"] }, { "code": 356, "indent": 0, "parameters": ["ダイス タイプ 1 TRPG風10-1"] }, { "code": 356, "indent": 0, "parameters": ["ダイス タイプ 2 TRPG風10-2"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 拡大 1 125"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 拡大 2 125"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 変数 1 104"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 変数 2 105"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 表示 1 220 350"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 表示 2 380 350"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 乱数ロール 1"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 乱数ロール 2"] }, { "code": 122, "indent": 0, "parameters": [129, 129, 0, 1, 104] }, { "code": 122, "indent": 0, "parameters": [129, 129, 3, 0, 10] }, { "code": 122, "indent": 0, "parameters": [129, 129, 1, 1, 105] }, { "code": 111, "indent": 0, "parameters": [1, 129, 0, 0, 0] }, { "code": 122, "indent": 1, "parameters": [129, 129, 0, 0, 100] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [1, 129, 0, 96, 1] }, { "code": 111, "indent": 1, "parameters": [0, 62, 1] }, { "code": 356, "indent": 2, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 y:eval_10+39*0"] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 122, "indent": 1, "parameters": [133, 133, 0, 0, 4] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 111, "indent": 1, "parameters": [1, 129, 1, 131, 1] }, { "code": 111, "indent": 2, "parameters": [0, 62, 1] }, { "code": 356, "indent": 3, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 y:eval_10+39*1"] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 122, "indent": 2, "parameters": [133, 133, 0, 0, 3] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 411, "indent": 1, "parameters": [] }, { "code": 111, "indent": 2, "parameters": [1, 129, 0, 6, 1] }, { "code": 111, "indent": 3, "parameters": [0, 62, 1] }, { "code": 356, "indent": 4, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 y:eval_10+39*2"] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 122, "indent": 3, "parameters": [133, 133, 0, 0, 2] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 411, "indent": 2, "parameters": [] }, { "code": 111, "indent": 3, "parameters": [0, 62, 1] }, { "code": 356, "indent": 4, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 y:eval_10+39*3"] }, { "code": 0, "indent": 4, "parameters": [] }, { "code": 412, "indent": 3, "parameters": [] }, { "code": 122, "indent": 3, "parameters": [133, 133, 0, 0, 1] }, { "code": 0, "indent": 3, "parameters": [] }, { "code": 412, "indent": 2, "parameters": [] }, { "code": 0, "indent": 2, "parameters": [] }, { "code": 412, "indent": 1, "parameters": [] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 111, "indent": 0, "parameters": [0, 62, 1] }, { "code": 230, "indent": 1, "parameters": [15] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:false"] }, { "code": 230, "indent": 1, "parameters": [30] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:true"] }, { "code": 230, "indent": 1, "parameters": [2] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:false"] }, { "code": 230, "indent": 1, "parameters": [5] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:true"] }, { "code": 230, "indent": 1, "parameters": [2] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:false"] }, { "code": 230, "indent": 1, "parameters": [4] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:true"] }, { "code": 230, "indent": 1, "parameters": [2] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:false"] }, { "code": 230, "indent": 1, "parameters": [2] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ スプライト 1D100結果 ハイライト2 visible:true"] }, { "code": 250, "indent": 1, "parameters": [{ "name": "Cursor2", "volume": 90, "pitch": 100, "pan": 0 }] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 411, "indent": 0, "parameters": [] }, { "code": 230, "indent": 1, "parameters": [30] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>「TRPG風判定システム」の他にも\\C[14]「すごろくミニゲーム」"] }, { "code": 401, "indent": 0, "parameters": ["\\>「サイコロを使ったダンジョンギミック」、「戦闘スキル」\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>などのサンプルをシステムを自作する際の参考として"] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[24]コモンイベントに解説コメント付きで用意\\C[0]しております。"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>また、データベースでコモンイベントや変数をコピーして"] }, { "code": 401, "indent": 0, "parameters": ["\\>ご自身のプロジェクトでそのまま使って頂くこともできます。"] }, { "code": 356, "indent": 0, "parameters": ["ウィンドウ 非表示 1D100詳細"] }, { "code": 111, "indent": 0, "parameters": [0, 62, 1] }, { "code": 356, "indent": 1, "parameters": ["ウィンドウ 非表示 1D100結果"] }, { "code": 0, "indent": 1, "parameters": [] }, { "code": 412, "indent": 0, "parameters": [] }, { "code": 356, "indent": 0, "parameters": ["ダイス 非表示 1"] }, { "code": 356, "indent": 0, "parameters": ["ダイス 非表示 2"] }, { "code": 223, "indent": 0, "parameters": [[0, 0, 0, 0], 20, true] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>これで、付属のカスタム情報ウィンドウプラグインの"] }, { "code": 401, "indent": 0, "parameters": ["\\>動作テストを終了します。"] }, { "code": 0, "indent": 0, "parameters": [] }];
		this.setupChild(list, eventId);
	};

})();