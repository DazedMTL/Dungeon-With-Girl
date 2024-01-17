/*---------------------------------------------------------------------------*
 * 2018/09/05 kido
 * https://kido0617.github.io/
 * Ver.1.3
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ランダム宝箱プラグイン
 * @author kido
 *
 *
 * @help
 *   ランダムにアイテムを入手できる宝箱を実装するプラグインです。
 *   使い方は下記webページを参照
 *   https://kido0617.github.io/rpgmaker/2017-04-17-random-treasure/
 *
 * @param アイテム名格納変数
 * @desc 取得したアイテムの名前を入れる変数
 * @default -1
 *
 * @param アイテムアイコン番号格納変数
 * @desc 取得したアイテムのアイコン番号を入れる変数
 * @default -1
 *
 * @param アイテムのくじの本数格納変数
 * @desc 取得したアイテムのくじの本数を入れる変数(レア度に応じた演出などに使う)
 * @default -1
 */

(function () {
  var parameters = PluginManager.parameters("RandomTreasure");
  var NAME_VAR = Number(parameters["アイテム名格納変数"] || -1);
  var ICON_VAR = Number(parameters["アイテムアイコン番号格納変数"] || -1);
  var RATE_VAR = Number(parameters["アイテムのくじの本数格納変数"] || -1);

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "RandomTreasure") {
      switch (args[0]) {
        case "reset":
          $gameTemp.randomTreasureReset = true;
          break;
        case "get":
          getRandom.call(this);
          break;
      }
    }
  };

  function getRandom() {
    if (!$gameSystem.randomTreasures || !$gameSystem.randomTreasures.length) {
      $gameSystem.lastRandomTreasure = null;
      return null;
    }
    var sum = 0;
    $gameSystem.randomTreasures.forEach(function (treasure) {
      sum += treasure.rate;
    });
    var rand = Math.randomInt(sum);
    var item, id, type, rate;
    sum = 0;
    for (var i = 0; i < $gameSystem.randomTreasures.length; i++) {
      sum += $gameSystem.randomTreasures[i].rate;
      if (rand < sum) {
        id = $gameSystem.randomTreasures[i].id;
        type = $gameSystem.randomTreasures[i].type;
        rate = $gameSystem.randomTreasures[i].rate;
        item = getItem(type, id);
        break;
      }
    }
    this._params = [id, 0, 0, 1, false];
    if (type == 0) {
      this.command126();
    } else if (type == 1) {
      this.command127();
    } else {
      this.command128();
    }
    $gameSystem.lastRandomTreasure = item;
    if (NAME_VAR != -1) $gameVariables.setValue(NAME_VAR, item.name);
    if (ICON_VAR != -1) $gameVariables.setValue(ICON_VAR, item.iconIndex);
    if (RATE_VAR != -1) $gameVariables.setValue(RATE_VAR, rate);
  }

  function getItem(type, id) {
    var item;
    switch (type) {
      case 0:
        item = $dataItems[id];
        break;
      case 1:
        item = $dataWeapons[id];
        break;
      case 2:
        item = $dataArmors[id];
        break;
    }
    return item;
  }

  // Shop Processing
  var _command302 = Game_Interpreter.prototype.command302;
  Game_Interpreter.prototype.command302 = function () {
    if ($gameTemp.randomTreasureReset) {
      $gameTemp.randomTreasureReset = false;
      var goodsList = [this._params];
      while (this.nextEventCode() === 605) {
        this._index++;
        goodsList.push(this.currentCommand().parameters);
      }
      data = [];
      goodsList.forEach(function (goods) {
        var item = getItem(goods[0], goods[1]);
        data.push({
          type: goods[0],
          id: goods[1],
          rate: goods[2] === 0 ? item.price : goods[3],
        });
      }, this);
      $gameSystem.randomTreasures = data;
      return true;
    }
    return _command302.call(this);
  };
})();
