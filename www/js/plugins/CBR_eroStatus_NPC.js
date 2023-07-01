/*
############################################
	作者: COBRA
	改造や配布好き勝手にしても大丈夫だよ
	寧ろ積極的に配布して皆のゲーム開発を快適にしてあげて
	http://cobrara.blogspot.jp/
############################################
*/

// Version 1.0.1
// 2017/12/3 1.0.1 フォントカラーを指定した場合後に続くテキストカラーも変更されてしまう問題を修正しました
// 2017/12/2 1.0.0

/*:
* @plugindesc エロステータス作れちゃうプラグイン(NPC用)
* @author COBRA
* @help Version 1.0.1
* ※width 0pxの画像を表示しようとすると永遠にロード中と勘違いして
* いつまでたってもエロステータスは表示されません


*
* @param コモンイベント
* @desc ベースになるコモンイベントを指定してね
* Default:
* @default
*
* @param
*
* @param ピクチャの原点
* @desc 入力を省いた時の値になります
* Default: 左上
* @default 左上
*
* @param
*
* @param テキストのサイズ
* @desc 入力を省いた時の値になります
* Default: 26
* @default 26
*
* @param テキストの原点
* @desc 入力を省いた時の値になります
* Default: 左上
* @default 左上
*
* @param テキストの揃え
* @desc 入力を省いた時の値になります
* Default: 中
* @default 中
*
* @param
*
* @param ページ移動のSEの名前
* @desc ←→でエロステータスのページを切り替えた時に鳴らすSEの名前
* Default: Cursor2
* @default Cursor2
*
* @param ページ移動のSEの音量
* @desc ←→でエロステータスのページを切り替えた時に鳴らすSEの音量
* Default: 90
* @default 90
*
* @param ページ移動のSEのピッチ
* @desc ←→でエロステータスのページを切り替えた時に鳴らすSEのピッチ
* Default: 100
* @default 100
*
* @param ページ移動のSEの位相
* @desc ←→でエロステータスのページを切り替えた時に鳴らすSEの位相
* Default: 0
* @default 0
*/

//使いやすくする為日本語で

CBR_eroStaNPC = {};//[0]=[] [1]=[]で1ページと2ページのデータを入れる
CBR_eroStaNPC.character = {};
CBR_eroStaNPC.param = {};//初期値を入れる

//var hoge ="test=123=2 = hog";
//hoge.split(/^([^=\s]+)\s*=\s?/);
/*
$dataCommonEventsに存在してる
*/


//タイトルでコモンイベント実行
var _CBR_eroStaNPC_Scene_Title_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function () {
	_CBR_eroStaNPC_Scene_Title_update.call(this);
	if (!CBR_eroStaNPC.data && this.isActive()) {
		CBR_eroStaNPC.data = [];
		var param = PluginManager.parameters('CBR_eroStatus_NPC');
		$gameTemp.reserveCommonEvent(Number(param['コモンイベント']));
		CBR_eroStaNPC.param['pic原点'] = param['ピクチャの原点'] || '左上';
		if (Number(param['テキストのサイズ']) === 0) {
			CBR_eroStaNPC.param['txtサイズ'] = 0;
		} else {
			CBR_eroStaNPC.param['txtサイズ'] = Number(param['テキストのサイズ']) || 26;
		}
		CBR_eroStaNPC.param['txt原点'] = param['テキストの原点'] || '左上';
		CBR_eroStaNPC.param['txt揃え'] = param['テキストの揃え'] || '中';
		CBR_eroStaNPC.param['se名'] = param['ページ移動のSEの名前'] || 'Cursor2';
		if (Number(param['ページ移動のSEの音量']) === 0) {
			CBR_eroStaNPC.param['se音量'] = 0;
		} else {
			CBR_eroStaNPC.param['se音量'] = Number(param['ページ移動のSEの音量']) || 100;
		}
		if (Number(param['ページ移動のSEのピッチ']) === 0) {
			CBR_eroStaNPC.param['seピッチ'] = 0;
		} else {
			CBR_eroStaNPC.param['seピッチ'] = Number(param['ページ移動のSEのピッチ']) || 100;
		}
		CBR_eroStaNPC.param['se位相'] = Number(param['ページ移動のSEの位相']) || 0;

		$gameMap.updateInterpreter();
	}
};


//これから入れるページを指定
CBR_eroStaNPC.setPage = function (val) {
	this._setPage = val;
	this.data[val] = this.data[val] || { 'p': [], 't': [] };//速度重視の為addではなくこっちでやる
};


//基本データ追加
CBR_eroStaNPC.addPic = function (ary) {
	var tempD = {};
	var key = this.data[this._setPage].p.length;//そのページの何番目になるのか

	for (var i = 0, len = ary.length; i < len; i++) {
		var temp = ary[i].split(/^([^=\s]+)\s*=\s?/);
		switch (temp[1]) {
			case "名前":
			case "x":
			case "y":
			case "拡大":
			case "透明度":
			case "原点":
				//差分処理
				var m = temp[2].match(/^[<|＜](.+)[>|＞]$/);
				if (m) {
					this.character[m[1]] = {
						'page': this._setPage,
						'type': 'p',
						'key': key,
						'name': temp[1],
						'val': temp[2]
					}
				} else {
					temp[2].replace(/^@(<|＜)/, '$1');
					if (temp[1] != '名前' && temp[1] != '原点') {
						temp[2] = Number(temp[2]);
					}
					tempD[temp[1]] = temp[2];
				}

				break;
			default:
				alert('エラー/addPicに予期しない文字が入ってる→' + ary[i][0]);
				break;
		}
	}
	//デフォの値はここで設定
	if (!tempD['原点']) { tempD['原点'] = this.param['pic原点']; }
	if (!tempD['透明度']) { tempD['透明度'] = 1; }
	if (!tempD['拡大']) { tempD['拡大'] = 1; }

	this.data[this._setPage].p[key] = tempD;
};


CBR_eroStaNPC.addTxt = function (ary) {
	var tempD = {};
	var key = this.data[this._setPage].t.length;

	for (var i = 0, len = ary.length; i < len; i++) {
		var temp = ary[i].split(/^([^=\s]+)\s*=\s?/);
		switch (temp[1]) {
			case "テキスト":
			case "x":
			case "y":
			case "原点":
			case "揃え":
			case "サイズ":
				//差分処理
				var m = temp[2].match(/^[<|＜](.+)[>|＞]$/);
				if (m) {
					this.character[m[1]] = {
						'page': this._setPage,
						'type': 't',
						'key': key,
						'name': temp[1],
						'val': temp[2]
					}
				} else {
					temp[2].replace(/^@(<|＜)/, '$1');
					if (temp[1] != 'テキスト' && temp[1] != '原点' && temp[1] != '揃え') {
						temp[2] = Number(temp[2]);
					}
					tempD[temp[1]] = temp[2];
				}
				break;
			default:
				alert('エラー/addTxtに予期しない文字が入ってる→' + ary[i][0]);
				break;
		}
	}
	if (!tempD['原点']) { tempD['原点'] = this.param['txt原点']; }
	if (!tempD['揃え']) { tempD['揃え'] = this.param['txt揃え']; }
	if (!tempD['サイズ']) { tempD['サイズ'] = this.param['txtサイズ']; }
	this.data[this._setPage].t[key] = tempD;
};

CBR_eroStaNPC.changeChara = function (ary) {
	for (var i = 0, len = ary.length; i < len; i++) {
		var temp = ary[i].split(/^([^=\s]+)\s*=\s?/);
		data = this.character[temp[1]];
		if (temp[1] == 'x' || temp[1] == 'y' || temp[1] == '拡大' || temp[1] == '透明度') { }
		this.data[data.page][data.type][data.key][data.name] = temp[2];//オブジェクトの書き換え
	}
};


//########### Scene ###########
function Scene_EroStaNPC() {
	this.initialize.apply(this, arguments);
}
Scene_EroStaNPC.prototype = Object.create(Scene_MenuBase.prototype);
Scene_EroStaNPC.prototype.constructor = Scene_EroStaNPC;

Scene_EroStaNPC.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
};
Scene_EroStaNPC.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);

	this._eroStaNPCWindow = new Window_EroStaNPC();
	this._eroStaNPCWindow.setHandler('cancel', this.popScene.bind(this));

	this._eroStaNPCWindow._margin = 0;//背景ピッチリする為
	this._eroStaNPCWindow.margin = 0;//本当はこっちだけどね
	this._eroStaNPCWindow._windowFrameSprite.visible = false;//枠線を消す

	this.addWindow(this._eroStaNPCWindow);
};

Scene_EroStaNPC.prototype.update = function () {
	Scene_Base.prototype.update.call(this);
};

//########### window ###########
function Window_EroStaNPC() {
	this.initialize.apply(this, arguments);
}

Window_EroStaNPC.prototype = Object.create(Window_Selectable.prototype);
Window_EroStaNPC.prototype.constructor = Window_EroStaNPC;

Window_EroStaNPC.prototype.initialize = function () {//windowを作る
	var width = Graphics.boxWidth;
	var height = Graphics.boxHeight;
	Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
	this.CBR_setPage(1);
	this.CBR_setComplete(false);
};


Window_EroStaNPC.prototype.CBR_setPage = function (val) {//現在のページ
	this._CBR_page = val;
};
Window_EroStaNPC.prototype.CBR_page = function () {
	return this._CBR_page;
};
Window_EroStaNPC.prototype.CBR_setComplete = function (val) {//描写終わったかどうか
	this._CBR_complete = val;
};
Window_EroStaNPC.prototype.CBR_complete = function () {
	return this._CBR_complete;
};


Window_EroStaNPC.prototype.update = function () {//毎回image描写してもいいけどそれだと負荷が多くなるのでこの方法で
	Window_Selectable.prototype.update.call(this);

	var allPage = CBR_eroStaNPC.data.length - 1;
	//2ページある時は2

	if (2 < CBR_eroStaNPC.data.length && this.isOpenAndActive()) {//2ページ以上存在して操作があった時
		if (Input.isRepeated('right') || Input.isRepeated('left')) {
			AudioManager.playSe({ "name": CBR_eroStaNPC.param['se名'], "volume": CBR_eroStaNPC.param['se音量'], "pitch": CBR_eroStaNPC.param['seピッチ'], "pan": CBR_eroStaNPC.param['se位相'] });
			if (Input.isRepeated('right')) {//右の時
				if (this.CBR_page() < allPage) {
					this.CBR_setPage(this.CBR_page() + 1);
				} else {
					this.CBR_setPage(1);
				}
			} else {//左の時
				if (this.CBR_page() == 1) {
					this.CBR_setPage(allPage);
				} else {
					this.CBR_setPage(this.CBR_page() - 1);
				}
			}
			this.CBR_setComplete(false);//初期化
		}
	}

	if (!this.CBR_complete()) {//まだ画像の描写してないのなら
		var flag = false;
		var ary = CBR_eroStaNPC.data[this.CBR_page()].p;
		var p_data = [];

		//ピクチャの数だけ
		for (var i = 0, len = ary.length; i < len; i++) {
			var name = ary[i]['名前'];
			if (!name) {
				continue;
			}
			name = name.replace(/\\(\\)|\\([VNP])\[(\d+)\]|\\(<)(.+)\\>/g, function (a, b, c, d, e, f) {//汚いけどこれは毎回やらないとね
				if (b) {//\\
					return '\\';
				} else if (c) {//[VNP]
					d = Number(d);
					switch (c) {
						case 'V':
							return $gameVariables.value(d);
							break;
						case 'N':
							return $gameActors._data[d]._name;
							break;
						case 'P':
							return $dataActors[$gameParty._actors[d - 1]].name;
							break;
					}
				} else {//script
					return eval(f);
				}
			});


			if (name) {
				var temp = ImageManager.loadPicture(name);//初回読み込み
				if (temp) {
					if (!temp.width) {//暗号化するとwidthでしか判別できない　探せばあるかもしれないけど
						//if(temp._isLoading || temp._loadingState == 'requesting'){//前者は古いver用 ロード中ならアウト
						flag = true;
						break;
					}
				} else {//その名前の画像が無かったら
					flag = true;
					this.CBR_setComplete(true);
					break;
				}
				p_data[i] = {
					'w': temp.width,
					'h': temp.height,
				}
			}
		}

		if (!flag) {//全ロードが終わってたら
			this.contents.clear();

			//ピクチャの表示
			var ary = CBR_eroStaNPC.data[this.CBR_page()].p;
			for (var i = 0, len = ary.length; i < len; i++) {
				var name = ary[i]['名前'];
				if (!name) {
					continue;
				}
				//変数とか文字化
				name = name.replace(/\\(\\)|\\([VNP])\[(\d+)\]|\\(<)(.+)\\>/g, function (a, b, c, d, e, f) {
					if (b) {//\\
						return '\\';
					} else if (c) {//[VNP]
						d = Number(d);
						switch (c) {
							case 'V':
								return $gameVariables.value(d);
								break;
							case 'N':
								return $gameActors._data[d]._name;
								break;
							case 'P':
								return $dataActors[$gameParty._actors[d - 1]].name;
								break;
						}
					} else {//script
						return eval(f);
					}
				});


				if (name) {
					this.changePaintOpacity(ary[i]['透明度']);

					//原点処理
					var x = ary[i].x;
					var y = ary[i].y;
					var lr = ary[i]['原点'].charAt(0);
					var ud = ary[i]['原点'].charAt(1);

					if (lr == '中') {
						x -= p_data[i].w * ary[i]['拡大'] / 2;
					} else if (lr == '右') {
						x -= p_data[i].w * ary[i]['拡大'];
					}
					if (ud == '中') {
						y -= p_data[i].h * ary[i]['拡大'] / 2;
					} else if (ud == '下') {
						y -= p_data[i].h * ary[i]['拡大'];
					}

					this.drawPicture('pictures', name, 0, 0, x, y, 0, 0, ary[i]['拡大'], 0);
				}
			}

			//テキストの表示
			this.resetTextColor();
			var ary = CBR_eroStaNPC.data[this.CBR_page()].t;
			for (var i = 0, len = ary.length; i < len; i++) {
				var temp = ary[i]['テキスト'];
				if (!temp) {
					continue;
				}

				var opAry = temp.match(/(\\\{|\\\}|\\[CI]\[\d+\])+/g);

				//先頭にある場合は"","tesa"になる
				var strAry = temp.split(/(?:\\\{|\\\}|\\[CI]\[\d+\])+/);

				var str = '';

				var allW = 0;
				var maxSize = null;
				var dataFAry = [];
				var dataWAry = [];
				var drawI = [];
				var drawC = [];
				//分割した配列の数
				for (var k = 0, len2 = strAry.length; k < len2; k++) {

					//前方にある\{のフォントサイズを入れる
					dataFAry[k] = k ? dataFAry[k - 1] : 0;
					drawI[k] = [];

					//変数とか文字化
					strAry[k] = strAry[k].replace(/\\(\\)|\\([VNP])\[(\d+)\]|\\(G)|\\(<)(.+)\\>/g, function (a, b, c, d, e, f, g) {
						if (b) {//\\
							return '\\';
						} else if (c) {//[VNP]
							d = Number(d);
							switch (c) {
								case 'V':
									return $gameVariables.value(d);
									break;
								case 'N':
									return $gameActors._data[d]._name;
									break;
								case 'P':
									return $dataActors[$gameParty._actors[d - 1]].name;
									break;
							}
						} else if (e) {//G
							return $dataSystem.currencyUnit;
						} else {//script
							return eval(g);
						}
					});

					//自身の前に区切りマッチがあったら
					if (0 < k) {
						var temp = opAry[k - 1].split('\\');//\\{\\}を分割する
						for (var m = 1, len3 = temp.length; m < len3; m++) {

							switch (temp[m].charAt(0)) {
								case '{':
									dataFAry[k] += 12;
									break;
								case '}':
									dataFAry[k] -= 12;
									break;
								case 'C':
									drawC[k] = Number(temp[m].match(/\[(\d+)\]/)[1]);//Cは複数あっても最後のが適応されれば良いわけで
									break;
								case 'I':
									drawI[k][drawI[k].length] = Number(temp[m].match(/\[(\d+)\]/)[1]);
									break;
							}
						}
					}
					this.contents.fontSize = ary[i]['サイズ'] + dataFAry[k];
					this.contents.context.font = this.contents._makeFontNameText();
					dataWAry[k] = this.contents.context.measureText(strAry[k]).width;//何の為に+4するのか忘れた
					allW += dataWAry[k];

					if (strAry[k]) {//先頭に\{や変数がある時の問題　アイコン乃場合もここを通さないと
						if (maxSize === null) {//まだ記録されてなかったら入れよう
							maxSize = dataFAry[k];
						} else {
							maxSize = (maxSize < dataFAry[k]) ? dataFAry[k] : maxSize;
						}
					}
				}

				maxSize += ary[i]['サイズ'];
				var x = ary[i].x;
				var y = ary[i].y;
				var lr = ary[i]['原点'].charAt(0);
				var ud = ary[i]['原点'].charAt(1);

				/*
				デフォは原点左中、やりたいのはデフォ左上
				アイコンは左上
				
				上上の場合→y + (max / 2) - (max - size)/2
				上中の場合→y + (max / 2)
				上下の場合→y + (max / 2) + (max - size)/2
				
				中上の場合→y - (max - size)/2
				中中の場合→y
				中下の場合→y + (max - size)/2
				
				下上の場合→y - (max / 2) - (max - size)/2
				下中の場合→y - (max / 2)
				下下の場合→y - (max / 2) + (max - size)/2
				*/

				//原点の左右
				if (lr == '中') {
					x -= allW / 2;
				} else if (lr == '右') {
					x -= allW;
				}
				//原点の上下
				if (ud == '上') {
					y += maxSize / 2;
				} else if (ud == '下') {
					y -= maxSize / 2;
				}

				//各文字のサイズの描写
				for (var k = 0, len2 = strAry.length; k < len2; k++) {
					this.contents.fontSize = ary[i]['サイズ'] + dataFAry[k];
					this.contents.context.font = this.contents._makeFontNameText();
					//bottom→下揃え原点の上　top→上揃え原点の下　center→原点
					var trueY = y;
					var iconY = y;
					if (ary[i]['揃え'] == '上') {
						trueY -= (maxSize - ary[i]['サイズ'] - dataFAry[k]) / 2;
						iconY = y - maxSize / 2;
					} else if (ary[i]['揃え'] == '下') {
						trueY += (maxSize - ary[i]['サイズ'] - dataFAry[k]) / 2;
						iconY = y + (maxSize / 2 - Window_Base._iconWidth);
					} else {
						iconY = y - (Window_Base._iconWidth) / 2;
					}
					if (drawI[k].length) {
						for (var m = 0, len3 = drawI[k].length; m < len3; m++) {
							this.drawIcon(drawI[k][m], x, iconY);
							x += Window_Base._iconWidth;
						}
					}
					if (drawC[k]) {
						this.changeTextColor(this.textColor(drawC[k]));
					}
					this.contents.drawText(strAry[k], x, trueY, dataWAry[k], 0, 'left');
					x += dataWAry[k];
				}
				this.contents.fontSize = this.standardFontSize();
				this.resetTextColor();
				this.changePaintOpacity(true);
			}

			this.activate();
			this.CBR_setComplete(true);
		}
	}
};

Window_EroStaNPC.prototype.drawPicture = function (dir, filename, sx, sy, x, y, w, h, zoom, hue) {
	var bitmap = ImageManager.loadBitmap('img/' + dir + '/', filename, hue, true);
	this.contents.blt(bitmap, sx, sy, bitmap.width, bitmap.height, x, y, bitmap.width * zoom, bitmap.height * zoom);
};
Window_EroStaNPC.prototype.standardPadding = function () {
	return 0;
};

var _CBR_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	_CBR_Game_Interpreter_pluginCommand.call(this, command, args);
	if (command.toUpperCase() === 'CBR_EROSTATUS_NPC') {
		SceneManager.push(Scene_EroStaNPC);
	}
};