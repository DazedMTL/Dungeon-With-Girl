//=============================================================================
// SupponShopStock.js
//=============================================================================

/*:
 * @plugindesc 在庫システムを有するお店を設定します。version 1.04
 * @author Suppon
 *
 * @param Label of stock Number
 * @desc 在庫数の表記を設定します
 * @default 在庫数
 *
 * @param Label of sold out
 * @desc 売り切れの表記を設定します
 * @default 売り切れ
 *
 * @help
 * このプラグインを使用するときは以下のようにプラグインコマンドを入力してください。
 * 文字、数値の間はスペースで区切ってください。
 *
 * <ショップの作成方法>
 * SupponSS makeShop 文字1 数値1
 * 文字1 : ショップの名前です。数値でも構いません。
 * 数値1 : ショップタイプです。0は購買専門（売却不可）
 *                         1は購買、売却可能
 *                         2は購買、売却可能、全ての売却品がショップの商品に加わります。
 *                         省略時は、1になります。
 * 例 : SupponSS makeShop omise 2
 *
 *
 * <アイテムの追加方法>
 * SupponSS addItem 文字1 数値1 数値2 数値3
 * 文字1 : アイテムを追加するショップ名です。
 * 数値1 : 追加するアイテムのIDです。
 * 数値2 : 在庫の個数を割り当てる変数のIDです。-1にすると変数は使わず、
 *        在庫は内部のデータで処理されます。
 * 数値3 : 在庫数の設定値です。省略した場合、数値2で指定した変数の値が適用されます。
 * 例 : SupponSS addItem omise 1 2 3
 * 例 : SupponSS addItem omise 4 -1 10
 *
 *
 * <武器の追加方法>
 * SupponSS addWeapon 文字1 数値1 数値2 数値3
 * 文字1、数値1~3 : アイテムの追加と同様です。
 *
 * <防具の追加方法>
 * SupponSS addArmor 文字1 数値1 数値2 数値3
 * 文字1、数値1~3 : アイテムの追加と同様です。
 *
 * <アイテムの削除方法>
 * SupponSS removeItem 文字1 数値1
 * 文字1 : 削除したいアイテムがあるショップ名です。
 * 数値1 : 削除するアイテムのIDです。
 * 例 : SupponSS removeItem omise 1
 *
 * <武器の削除方法>
 * SupponSS removeWeapon 文字1 数値1
 * 文字1、数値1 : アイテムの削除方法と同様です。
 *
 * <防具の削除方法>
 * SupponSS removeArmor 文字1 数値1
 * 文字1、数値1 : アイテムの削除方法と同様です。
 *
 * <ショップの起動方法>
 * SupponSS openShop 文字1 数値1
 * 文字1 : 起動するショップ名です。
 * 数値1 : 購買時のソートオプションです。0は、商品の表示順は追加した順になります。
 *                                 1は、アイテムID順、次に武器ID順、次に防具ID順になります。
 *                                 2は、カテゴリー選択できます。さらにID順になります。
 *                                 省略時は、0と同じになります。
 * 例 : SupponSS openShop omise 2
 *
 *
 * <ショップの削除方法>
 * SupponSS deleteShop 文字1
 * 文字1 : 削除したいショップのショップ名です。
 * 例 : SupponSS deleteShop omise
 *
 *
 * <変数管理しないアイテムの在庫数の取り出し方法>
 * SupponSS getNumItem 文字1 数値1 数値2
 * SupponSS getNumWeapon 文字1 数値1 数値2
 * SupponSS getNumArmor 文字1 数値1 数値2
 * 文字1 : 調べたいアイテムのあるショップ名です。
 * 数値1 : アイテム、武器、防具のIDです。
 * 数値2 : アイテムの個数を格納する変数のIDです。
 * 例 : SupponSS getNumItem omise 1 2
 *
 *
 */

(function () {
  var parameters = PluginManager.parameters("SupponShopStock");
  var StockLabel = String(parameters["Label of stock Number"] || "在庫数");
  var SoldOutLabel = String(parameters["Label of sold out"] || "売り切れ");

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command1, args) {
    _Game_Interpreter_pluginCommand.call(this, command1, args);
    args = args.filter(function (n) {
      return n !== "";
    });
    if (!$gameSystem._supponSS) {
      $gameSystem._supponSS = [];
    }
    if (command1 === "SupponSS") {
      var command2 = args.shift();
      switch (command2) {
        case "makeShop":
          $gameSystem.supponSSmakeShop(args);
          break;
        case "addItem":
          args.splice(1, 0, 0);
          $gameSystem.supponSSaddGoods(args);
          break;
        case "addWeapon":
          args.splice(1, 0, 1);
          $gameSystem.supponSSaddGoods(args);
          break;
        case "addArmor":
          args.splice(1, 0, 2);
          $gameSystem.supponSSaddGoods(args);
          break;
        case "removeItem":
          args.splice(1, 0, 0);
          $gameSystem.supponSSremoveGoods(args);
          break;
        case "removeWeapon":
          args.splice(1, 0, 1);
          $gameSystem.supponSSremoveGoods(args);
          break;
        case "removeArmor":
          args.splice(1, 0, 2);
          $gameSystem.supponSSremoveGoods(args);
          break;
        case "deleteShop":
          $gameSystem.supponSSdeleteShop(args);
          break;
        case "openShop":
          $gameSystem.supponSSopenShop(args);
          break;
        case "getNumItem":
          args.splice(1, 0, 0);
          $gameSystem.supponSSgetNumItem(args);
          break;
        case "getNumWeapon":
          args.splice(1, 0, 1);
          $gameSystem.supponSSgetNumItem(args);
          break;
        case "getNumArmor":
          args.splice(1, 0, 2);
          $gameSystem.supponSSgetNumItem(args);
          break;
      }
    }
  };

  Game_System.prototype.supponSScheckData = function () {
    this._supponSS = this._supponSS || [];
  };

  Game_System.prototype.supponSSmakeShop = function (args) {
    this.supponSScheckData();
    var redundancy = this._supponSS.some(function (element) {
      return element[0] === args[0];
    });
    if (redundancy) {
      return;
    }
    if (!args[1]) {
      args[1] = 1;
    }
    this._supponSS.push([args[0], [], args[1]]); //[shopid, goods, shoptype]
  };

  //args => [shopId, 種類, itemId, 変数id]
  //shop => [id, goods, type]
  //good => [種類, itemId, 価格指定, 価格, 変数id, 在庫数]
  Game_System.prototype.supponSSaddGoods = function (args) {
    var shop = this.supponSSsearchShop(args);
    args.shift();
    args.splice(2, 0, 0, 0);
    if (shop) {
      var redundancy = false;
      shop[1].forEach(function (element) {
        if (element[0] == args[0] && element[1] == args[1]) {
          element = args;
          redundancy = true;
        }
      });
      if (args[5]) {
        args[4] > 0
          ? $gameVariables.setValue(Number(args[4]), Number(args[5]))
          : 0;
      } else {
        args[5] = 0;
      }
      if (!redundancy) {
        shop[1].push(args);
      }
    }
  };

  Game_System.prototype.supponSSremoveGoods = function (args) {
    var shop = this.supponSSsearchShop(args);
    if (!shop) {
      return;
    }
    //shop[1] => goods
    shop[1] = shop[1].filter(function (element) {
      return !(args[1] == element[0] && args[2] == element[1]);
    });
  };

  Game_System.prototype.supponSSsearchShop = function (args) {
    this.supponSScheckData();
    var shop = null;
    this._supponSS.forEach(function (element) {
      if (args[0] === element[0]) {
        shop = element;
      }
    });
    if (!shop) {
      console.log("Not exist shop of " + args[0] + " !!");
    }
    return shop;
  };

  Game_System.prototype.supponSSdeleteShop = function (args) {
    this._supponSS = this._supponSS.filter(function (element) {
      return !(element[0] == args[0]);
    });
  };

  Game_System.prototype.supponSSopenShop = function (args) {
    var shop = this.supponSSsearchShop(args);
    if (shop) {
      SceneManager.push(Scene_supponSSshop);
      var purchaseOnly = shop[2] == 0;
      var sortType = args[1];
      SceneManager.prepareNextScene(shop, purchaseOnly, sortType);
    }
  };

  Game_System.prototype.supponSSgetNumItem = function (args) {
    if (!args[2]) {
      return;
    }
    var shop = this.supponSSsearchShop(args);
    var goodsElement = null;
    if (shop) {
      goodsElement = shop[1].find(function (element) {
        return element[0] == args[1] && element[1] == args[2];
      });
    }
    if (goodsElement) {
      if (Number(goodsElement[4]) > 0) {
        var n = $gameVariables.value(goodsElement[4]);
      } else {
        var n = goodsElement[5];
      }
      $gameVariables.setValue(Number(args[3]), Number(n));
    } else {
      $gameVariables.setValue(Number(args[3]), 0);
    }
  };

  function Scene_supponSSshop() {
    this.initialize.apply(this, arguments);
  }

  SceneManager.isSupponSS = function () {
    return this._scene.constructor === Scene_supponSSshop;
  };

  Scene_supponSSshop.prototype = Object.create(Scene_Shop.prototype);
  Scene_supponSSshop.prototype.constructor = Scene_supponSSshop;

  Scene_supponSSshop.prototype.initialize = function () {
    Scene_Shop.prototype.initialize.call(this);
    this._trade = ""; // 'buy' or 'sell';
  };

  Scene_supponSSshop.prototype.prepare = function (
    shop,
    purchaseOnly,
    sortType
  ) {
    this._shop = shop;
    //this._goods = [];
    this._sortTyep = sortType;
    //_sortTyep => nill,0>従来、1>ID順、2>カテゴリ表示
    //goodelement [0, "2", 0, 0, "-1", "4"] [0, 2, purchaseOnly, 0, v, n];
    //good => [種類, itemId, 価格指定, 価格, 変数id, 在庫数]

    this._originalGoods = this._shop[1];
    this._goods = this._shop[1];
    this._purchaseOnly = purchaseOnly;
    this._item = null;
  };

  Scene_supponSSshop.prototype.sortGoods = function () {
    this._goods = [];
    //        this._originalGoods = this._originalGoods.map(function(e){
    //            return e.map(function(x){return Number(x)})
    //        })
    if (this._sortTyep == 1) {
      for (i = 0; i < this._originalGoods.length; i++) {
        this._goods.push(this._originalGoods[i]);
      }
      this._goods.sort(function (a, b) {
        return a[0] - b[0] || (a[0] == b[0] && a[1] - b[1]);
      });
    } else if (this._sortTyep == 2) {
      var type = this._categoryWindow.index();
      this._goods = this._originalGoods.filter(function (element) {
        return element[0] == type;
      });
      this._goods.sort(function (a, b) {
        return a[1] - b[1];
      });
    } else {
      this._goods = this._originalGoods;
    }
    this._buyWindow._shopGoods = this._goods;
  };

  Scene_supponSSshop.prototype.commandBuy = function () {
    this._trade = "buy";
    if (this._sortTyep == 2) {
      this._categoryWindow._list[3].enabled = false; //大事なもの選択不可
      Window_Selectable.prototype.refresh.call(this._categoryWindow);
      //this._categoryWindow.refresh();
      this._categoryWindow.setItemWindow(null);
      this._categoryWindow.show();
      this._categoryWindow.activate();
      return;
    }
    this.sortGoods();
    Scene_Shop.prototype.commandBuy.call(this);
  };

  Scene_supponSSshop.prototype.onCategoryOk = function () {
    if (this._trade == "sell") {
      Scene_Shop.prototype.onCategoryOk.call(this);
      return;
    }
    this._categoryWindow.hide();
    this.sortGoods();
    this._buyWindow.select(0);
    Scene_Shop.prototype.commandBuy.call(this);
  };

  Scene_supponSSshop.prototype.onCategoryCancel = function () {
    if (this._trade == "sell") {
      Scene_Shop.prototype.onCategoryCancel.call(this);
    } else {
      this._categoryWindow.hide();
      this._categoryWindow.deactivate();
      Scene_Shop.prototype.onBuyCancel.call(this);
    }
  };

  Scene_supponSSshop.prototype.onBuyCancel = function () {
    if (this._sortTyep != 2) {
      Scene_Shop.prototype.onBuyCancel.call(this);
      return;
    }
    //this._commandWindow.activate();
    this._dummyWindow.show();
    this._buyWindow.hide();
    this._statusWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
    this._categoryWindow.show();
    this._categoryWindow.activate();
  };

  Scene_supponSSshop.prototype.commandSell = function () {
    this._trade = "sell";
    this._categoryWindow._list[3].enabled = true; //大事なもの選択可
    Window_Selectable.prototype.refresh.call(this._categoryWindow);
    this._categoryWindow.setItemWindow(this._sellWindow);
    Scene_Shop.prototype.commandSell.call(this);
  };

  Scene_supponSSshop.prototype.stockNumber = function () {
    if (this._trade == "buy") {
      return this._buyWindow.stockNumber();
    } else if (this._trade == "sell") {
      var goodsElement = this.goodsElement();
      if (goodsElement) {
        if (goodsElement[4] > 0) {
          return $gameVariables.value(Number(goodsElement[4]));
        } else if (goodsElement[4] == -1) {
          return goodsElement[5];
        }
      } else {
        return null;
      }
    }
  };

  Scene_supponSSshop.prototype.stockId = function () {
    if (this._trade == "buy") {
      return this._buyWindow.stockId();
    } else if (this._trade == "sell") {
      var goodsElement = this.goodsElement();
      if (goodsElement) {
        if (goodsElement[4] > 0) {
          return goodsElement[4];
        }
      }
    }
  };

  Scene_supponSSshop.prototype.goodsElement = function () {
    if (this._trade == "buy") {
      return this._goods[this._buyWindow.index()];
    } else if (this._trade == "sell") {
      return this.searchGoodsElement();
    }
  };

  Scene_supponSSshop.prototype.searchGoodsElement = function () {
    var type = this.itemTypeAndId()[0];
    var id = this.itemTypeAndId()[1];
    var goodsElement = null;
    //this._goods.forEach(function(element){
    this._originalGoods.forEach(function (element) {
      if (element[0] == type && element[1] == id) {
        goodsElement = element;
      }
    });
    return goodsElement;
  };

  Scene_supponSSshop.prototype.itemTypeAndId = function () {
    if (DataManager.isItem(this._item)) {
      var type = 0;
    } else if (DataManager.isWeapon(this._item)) {
      var type = 1;
    } else if (DataManager.isArmor(this._item)) {
      var type = 2;
    } else {
      var type = null;
    }
    return [type, this._item ? this._item.id : null];
  };

  Scene_supponSSshop.prototype.makeGoodsElement = function () {
    var type = Number(this.itemTypeAndId()[0]);
    var id = Number(this.itemTypeAndId()[1]);
    return [type, id, 0, 0, -1, 0];
  };

  Scene_supponSSshop.prototype.doBuy = function (number) {
    Scene_Shop.prototype.doBuy.call(this, number);
    this.processStockBuy(number);
    //gameVariables.setValue(this._stockId, this.itemStock()-number);
  };

  Scene_supponSSshop.prototype.processStockBuy = function (number) {
    var element = this.goodsElement();
    if (this.stockId() > 0) {
      $gameVariables.setValue(this.stockId(), this.stockNumber() - number);
    } else if (this.stockId() == -1) {
      var lastStock = element[5];
      element[5] = lastStock - number;
    }
  };

  Scene_supponSSshop.prototype.maxBuy = function () {
    var max = $gameParty.maxItems(this._item) - $gameParty.numItems(this._item);
    max = Math.min(max, this.stockNumber());
    var price = this.buyingPrice();
    if (price > 0) {
      return Math.min(max, Math.floor(this.money() / price));
    } else {
      return max;
    }
  };

  Scene_supponSSshop.prototype.doSell = function (number) {
    $gameParty.gainGold(number * this.sellingPrice());
    $gameParty.loseItem(this._item, number);
    this.processStockSell(number);
  };

  Scene_supponSSshop.prototype.processStockSell = function (number) {
    var goodsElement = this.goodsElement();
    if (goodsElement) {
      if (goodsElement[4] > 0) {
        var lastNumber = $gameVariables.value(goodsElement[4]);
        $gameVariables.setValue(goodsElement[4], lastNumber + number);
      } else if (goodsElement[4] == -1) {
        goodsElement[5] = Number(goodsElement[5]) + number;
      }
    } else if (this._shop[2] == 2) {
      goodsElement = this.makeGoodsElement();
      goodsElement[5] = number;
      //this._goods.push(goodsElement);★
      this._originalGoods.push(goodsElement);
      this.sortGoods();
      //this._goods = this.sortGoods(this._originalGoods);
      //this._buyWindow._shopGoods = this._goods;
    }
  };

  Window_ShopBuy.prototype.stockId = function () {
    if (this._shopGoods.length > 0) {
      return this._shopGoods[this._index][4];
    } else {
      return null;
    }
  };

  Window_ShopBuy.prototype.stockNumber = function () {
    if (this.stockId() > 0) {
      return $gameVariables.value(this.stockId());
    } else if (this.stockId() == -1) {
      return this._shopGoods[this._index][5];
    }
  };

  var _Window_ShopBuy_drawItem = Window_ShopBuy.prototype.drawItem;
  Window_ShopBuy.prototype.drawItem = function (index) {
    if (!SceneManager.isSupponSS()) {
      _Window_ShopBuy_drawItem.call(this, index);
      return;
    }
    var item = this._data[index];
    var rect = this.itemRect(index);
    var priceWidth = 96;
    rect.width -= this.textPadding();
    if (this._shopGoods[index][4] > 0) {
      var stockNumber = $gameVariables.value(this._shopGoods[index][4]);
    } else if (this._shopGoods[index][4] == -1) {
      var stockNumber = this._shopGoods[index][5];
    }
    this.changePaintOpacity(this.isEnabled(item) && stockNumber > 0);
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
    var text = stockNumber > 0 ? this.price(item) : SoldOutLabel;
    this.drawText(
      text,
      rect.x + rect.width - priceWidth,
      rect.y,
      priceWidth,
      "right"
    );
    this.changePaintOpacity(true);
  };

  var _Window_ShopBuy_isCurrentItemEnabled =
    Window_ShopBuy.prototype.isCurrentItemEnabled;
  Window_ShopBuy.prototype.isCurrentItemEnabled = function () {
    if (SceneManager.isSupponSS()) {
      return (
        _Window_ShopBuy_isCurrentItemEnabled.call(this) &&
        this.stockNumber() > 0
      );
    } else {
      return _Window_ShopBuy_isCurrentItemEnabled.call(this);
    }
  };

  var _Window_ShopBuy_updateHelp = Window_ShopBuy.prototype.updateHelp;
  Window_ShopBuy.prototype.updateHelp = function () {
    if (this._statusWindow && SceneManager.isSupponSS()) {
      this._statusWindow.setStock(this.stockNumber());
    }
    _Window_ShopBuy_updateHelp.call(this);
  };

  var _Window_ShopStatus_initialize = Window_ShopStatus.prototype.initialize;
  Window_ShopStatus.prototype.initialize = function (x, y, width, height) {
    this._stockNumber = null;
    _Window_ShopStatus_initialize.call(this, x, y, width, height);
  };

  Window_ShopStatus.prototype.setStock = function (number) {
    this._stockNumber = number;
  };

  Window_ShopStatus.prototype.stockNumber = function () {
    return SceneManager._scene.stockNumber();
  };

  var _Window_ShopStatus_drawPossession =
    Window_ShopStatus.prototype.drawPossession;
  Window_ShopStatus.prototype.drawPossession = function (x, y) {
    _Window_ShopStatus_drawPossession.call(this, x, y);
    if (!SceneManager.isSupponSS() || !this._stockNumber) {
      return;
    }
    var width = this.contents.width - this.textPadding() - x;
    var possessionWidth = this.textWidth("0000");
    this.changeTextColor(this.systemColor());
    this.drawText(
      StockLabel,
      x,
      y + this.lineHeight(),
      width - possessionWidth
    );
    this.resetTextColor();
    this.drawText(this._stockNumber, x, y + this.lineHeight(), width, "right");
  };

  var _Scene_Shop_onSellOk = Scene_Shop.prototype.onSellOk;
  Scene_Shop.prototype.onSellOk = function () {
    _Scene_Shop_onSellOk.call(this);
    if (this._statusWindow && SceneManager.isSupponSS()) {
      this._statusWindow.setStock(this._statusWindow.stockNumber());
      this._statusWindow.refresh();
    }
  };
})();
