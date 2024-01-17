//=============================================================================
// メッセージボックス中央揃い・右揃いプラグイン
// aligncenter.js
// Copyright (c) 2018 村人Ａ
//=============================================================================

/*:ja
 * @plugindesc メッセージボックスの文字を中央揃い、右揃いにするプラグインです。
 * @author 村人A
 *
 * @help
 *
 * メッセージ内で指定の行の冒頭で「\#」で中央揃い、[\_]で右揃いにします。
 * ex)メッセージ入力時
 *
 * ここはデフォルト（左揃い）
 * \#ここは中央ぞろい
 * \_ここは右揃い
 * ここはデフォルト（左揃い）
 *
 * となります。
 *
 * 拡大・縮小文字を揃えたい場合はや「\#」や「\_」の前に指定特殊文字「\{」や「\}」を
 * 入力してください。
 * ex)メッセージ入力時
 *
 * ここはデフォルト（左揃い）
 * \{\#ここは一段階大きな文字を中央ぞろい
 * \}}\_ここは一段階小さい文字を右揃い
 * ここは一段階小さい文字を左揃い
 *
 */

(function () {
  var _Window_Base_initialize = Window_Base.prototype.initialize;
  Window_Base.prototype.initialize = function (x, y, width, height) {
    _Window_Base_initialize.call(this, x, y, width, height);
    this.villaA_paddingleft = 0;
    this.villaA_procLine = 0;
  };

  Window_Base.prototype.obtainEscapeCode = function (textState) {
    textState.index++;
    var regExp = /^[\$\.\|\^!><\{\}\\\#\_]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
      textState.index += arr[0].length;
      return arr[0].toUpperCase();
    } else {
      return "";
    }
  };

  Window_Message.prototype.processEscapeCharacter = function (code, textState) {
    switch (code) {
      case "$":
        this._goldWindow.open();
        break;
      case ".":
        this.startWait(15);
        break;
      case "|":
        this.startWait(60);
        break;
      case "!":
        this.startPause();
        break;
      case ">":
        this._lineShowFast = true;
        break;
      case "<":
        this._lineShowFast = false;
        break;
      case "^":
        this._pauseSkip = true;
        break;
      case "#":
        var linelenght = textState.text.split(/\r\n|\r|\n/);
        this.villaA_paddingleft =
          (this.width -
            this.textWidth(linelenght[this.villaA_procLine]) -
            this.newLineX()) /
          2;
        break;
      case "_":
        var linelenght = textState.text.split(/\r\n|\r|\n/);
        this.villaA_paddingleft =
          this.width -
          this.textWidth(linelenght[this.villaA_procLine]) -
          20 -
          this.newLineX();
        break;
      default:
        Window_Base.prototype.processEscapeCharacter.call(
          this,
          code,
          textState
        );
        break;
    }
  };

  Window_Base.prototype.processCharacter = function (textState) {
    switch (textState.text[textState.index]) {
      case "\n":
        this.processNewLine(textState);
        this.villaA_procLine++;
        break;
      case "\f":
        this.processNewPage(textState);
        break;
      case "\x1b":
        this.processEscapeCharacter(
          this.obtainEscapeCode(textState),
          textState
        );
        break;
      default:
        this.processNormalCharacter(textState);
        break;
    }
  };

  Window_Base.prototype.processNormalCharacter = function (textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(
      c,
      textState.x + this.villaA_paddingleft,
      textState.y,
      w * 2,
      textState.height
    );
    textState.x += w;
  };

  var _Window_Base_processNewLine = Window_Base.prototype.processNewLine;
  Window_Base.prototype.processNewLine = function (textState) {
    _Window_Base_processNewLine.call(this, textState);
    this.villaA_paddingleft = 0;
  };

  var _Window_Message_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function () {
    _Window_Message_startMessage.call(this);
    this.villaA_procLine = 0;
  };

  var _Window_Message_clearFlags = Window_Message.prototype.clearFlags;
  Window_Message.prototype.clearFlags = function () {
    _Window_Message_clearFlags.call(this);
    this.villaA_paddingleft = 0;
  };
})();
