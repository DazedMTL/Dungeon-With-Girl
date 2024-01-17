//=============================================================================
// KMS_ShopInventory.js
//   Last update: 2017/02/03
//=============================================================================

/*:
 * @plugindesc
 * [v0.1.0] Add the inventory control function for shops.
 *
 * @author TOMY (Kamesoft)
 *
 * @param Sold out text
 * @default SOLD OUT
 * @desc "Sold out" text which is displayed instead of item's price.
 *
 * @param Caption for stock
 * @default Stock
 * @desc The caption for stocks of items.
 *
 * @param Stock display
 * @default 1
 * @desc
 *  Specify the window for displaying stock numbers.
 *  0: ShopNumber  1: ShopStatus
 *
 * @help
 *
 * ## Plugin commands
 *   ShopInventory apply shop1          # Use an inventory info specified as ID:shop1 when the event command "Shop" is called in the next
 *   ShopInventory supplySpeed shop1 3  # All items are supplied to ID:shop1 by 3x
 *   ShopInventory supplySpeed shop2 0  # Do not supply any item to ID:shop2
 *   ShopInventory restockAll shop1     # Stock of ID:shop1 is replenished fully
 *   ShopInventory resetAll             # Initialize all inventory info
 */

/*:ja
 * @plugindesc
 * [v0.1.0] アイテムの在庫管理機能を追加します。
 *
 * @author TOMY (Kamesoft)
 *
 * @param Sold out text
 * @default SOLD OUT
 * @desc 在庫がない場合、アイテムの価格の代わりに表示するテキストです。
 *
 * @param Caption for stock
 * @default 在庫
 * @desc 在庫表示の名称です。
 *
 * @param Stock display
 * @default 1
 * @desc
 *  在庫数を表示するウィンドウを指定します。
 *  0: 購入数選択  1: ステータス
 *
 * @help
 *
 * ■ プラグインコマンド
 *   ShopInventory apply shop1          # 次の「ショップの処理」で ID:shop1 の在庫情報を使用
 *   ShopInventory supplySpeed shop1 3  # ID:shop1 の在庫を 3 倍速で補充
 *   ShopInventory supplySpeed shop2 0  # ID:shop2 の在庫は補充しない
 *   ShopInventory restockAll shop1     # ID:shop1 の在庫を最大まで補充
 *   ShopInventory resetAll             # 在庫情報を初期化
 */

var KMS = KMS || {};

// セーブデータからの復元を可能にするため、セーブデータに入るクラスをグローバルスコープに置く
function Game_ShopInventory() {
  this.initialize.apply(this, arguments);
}

function Game_ShopSupplySchedule() {
  this.initialize.apply(this, arguments);
}

function Game_ShopInventorySupplier() {
  this.initialize.apply(this, arguments);
}

(function () {
  "use strict";

  var PluginName = "KMS_ShopInventory";

  KMS.imported = KMS.imported || {};
  KMS.imported["ShopInventory"] = true;

  var pluginParams = PluginManager.parameters(PluginName);
  var Params = {};
  Params.soldOutText = pluginParams["Sold out text"] || "SOLD OUT";
  Params.stockCaption = pluginParams["Caption for stock"] || "Stock";
  Params.showStockInStatus = Number(pluginParams["Show stock in status"] || 1);

  // 商品の補充モード
  var SupplyMode = {
    playtime: 0, // プレイ時間
    battleCount: 1, // 戦闘回数

    max: 1,
  };

  // 商品の補充モードシンボル
  var SupplyModeSymbol = {
    T: SupplyMode.playtime,
    B: SupplyMode.battleCount,
  };

  // 定数
  var Const = {
    debug: false, // デバッグモード
    pluginCommandCode: "ShopInventory", // プラグインコマンドコード
  };

  // デバッグログ
  var debuglog;
  if (Const.debug) {
    debuglog = function () {
      console.log(arguments);
    };
  } else {
    debuglog = function () {};
  }

  // トルコロケールで i の小文字変換が期待と異なる件に対する W/A
  var toUpper = function (s) {
    return s.toUpperCase();
  };

  if ("I" !== "i".toUpperCase()) {
    // トルコ用
    toUpper = function (s) {
      return s.replace(/[A-Z]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) & ~32);
      });
    };
  }

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command !== Const.pluginCommandCode) {
      return;
    }

    // TODO: 商品の個別補充

    switch (args[0]) {
      case "apply": // 在庫情報の呼び出し (inventoryId)
        if (args[1] == null) {
          console.error(
            "[%1 %2] Inventory ID is not specified.".format(
              Const.pluginCommandCode,
              args[0]
            )
          );
        } else {
          $gameTemp.nextInventoryId = args[1];
        }
        break;

      case "supplySpeed": // 補充速度の変更 (inventoryId speed)
        if (isNaN(args[2])) {
          console.error(
            "[%1 %2] Invalid speed (%3).".format(
              Const.pluginCommandCode,
              args[0],
              args[2]
            )
          );
        } else {
          // インベントリ未作成の場合は自動的に作成される
          var speed = Number(args[2]);
          $gameSystem.getInventoryById(args[1]).setSupplySpeed();
        }
        break;

      case "restockAll": // 在庫の完全補充 (inventoryId)
        if ($gameSystem.existsInventory(args[1])) {
          $gameSystem.getInventoryById(args[1]).initializeStock();
        } else {
          console.log(
            '[%1 %2] Inventory "%3" is not exist.'.format(
              Const.pluginCommandCode,
              args[0],
              args[1]
            )
          );
        }
        break;

      case "resetAll": // 全ショップの在庫情報初期化
        $gameSystem.clearInventories();
        break;

      default:
        // 不明なコマンド
        console.error(
          "[%1 %2] Unknown command.".format(Const.pluginCommandCode, args[0])
        );
        break;
    }
  };

  //-----------------------------------------------------------------------------
  // Item

  /**
   * 同一のアイテムであるか
   */
  function isSameItem(item1, item2) {
    if (item1.id !== item2.id) {
      return false;
    }

    var result =
      (DataManager.isItem(item1) && DataManager.isItem(item2)) ||
      (DataManager.isWeapon(item1) && DataManager.isWeapon(item2)) ||
      (DataManager.isArmor(item1) && DataManager.isArmor(item2));

    if (KMS.imported["AbilityOrb"]) {
      result |=
        DataManager.isAbilityOrb(item1) && DataManager.isAbilityOrb(item2);
    }

    return result;
  }

  /**
   * 在庫メモの解析
   */
  function parseNotesForStock(item) {
    var note = item.meta["kms_shop_stock"];
    if (note == null) {
      return;
    }

    var opts = note.replace(/\s+/g, "").split(/,/);
    if (!opts || opts.length < 2) {
      return;
    }

    if (isNaN(opts[0])) {
      console.error("%1: Invalid stock count".format(item.name));
      return;
    }

    if (isNaN(opts[1])) {
      console.error("%1: Invalid supply interval".format(item.name));
      return;
    }

    item.shopStockCountMax = parseInt(opts[0]);
    item.shopStockSupplyInterval = parseInt(opts[1]);

    if (opts.length >= 3) {
      // 補充モードの判定 (不正なモードの場合はプレイ時間にフォールバック)
      var modeSymbol = toUpper(opts[2] || "T");
      if (SupplyModeSymbol[modeSymbol] != null) {
        item.shopStockSupplyMode = SupplyModeSymbol[modeSymbol];
      } else {
        console.error("%1: Invalid supply mode".format(item.name));
        item.shopStockSupplyMode = SupplyMode.playtime;
      }
    } else {
      // モード省略時はプレイ時間扱い
      item.shopStockSupplyMode = SupplyMode.playtime;
    }

    debuglog(
      "%1: Max=%2, Interval=%3, Mode=%4".format(
        item.name,
        item.shopStockCountMax,
        item.shopStockSupplyInterval,
        item.shopStockSupplyMode
      )
    );
  }

  /**
   * 在庫上限の取得
   */
  function getStockMax(item) {
    return item.shopStockCountMax;
  }

  /**
   * 補充間隔の取得
   */
  function getSupplyInterval(item) {
    return item.shopStockSupplyInterval;
  }

  /**
   * 補充モードの取得
   */
  function getSupplyMode(item) {
    return item.shopStockSupplyMode;
  }

  //-----------------------------------------------------------------------------
  // DataManager

  var _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function (object) {
    _DataManager_onLoad.call(this, object);

    // 在庫設定の解析
    if (
      object === $dataItems ||
      object === $dataWeapons ||
      object === $dataArmors ||
      (KMS.imported["AbilityOrb"] && object === $dataKmsAbilityOrbs)
    ) {
      for (var i = 0; i < object.length; i++) {
        var obj = object[i];
        if (obj != null) {
          parseNotesForStock(obj);
        }
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Temp

  /**
   * 次回呼び出す在庫管理情報の ID
   *
   * @property nextInventoryId
   * @type String
   */
  Object.defineProperty(Game_Temp.prototype, "nextInventoryId", {
    get: function () {
      return this._nextInventoryId;
    },
    set: function (value) {
      this._nextInventoryId = value;
    },
    configurable: true,
  });

  var _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);

    this._nextInventoryId = null;
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);

    this.clearInventories();
  };

  /**
   * 指定 ID に対応する店舗在庫が存在するか
   */
  Game_System.prototype.existsInventory = function (id) {
    this._inventories = this._inventories || {};
    return this._inventories[id] != null;
  };

  /**
   * 指定 ID に対応する店舗在庫を取得
   */
  Game_System.prototype.getInventoryById = function (id) {
    if (!this.existsInventory(id)) {
      this._inventories[id] = new Game_ShopInventory(id);
    }

    return this._inventories[id];
  };

  /**
   * 店舗在庫の全クリア
   */
  Game_System.prototype.clearInventories = function () {
    this._inventories = {};
    this._inventorySupplier = new Game_ShopInventorySupplier();
  };

  /**
   * 在庫補充スケジュールの登録
   */
  Game_System.prototype.registerInventorySupplySchedule = function (
    inventoryId,
    item
  ) {
    if (!this._inventorySupplier) {
      this._inventorySupplier = new Game_ShopInventorySupplier();
    }

    var schedule = new Game_ShopSupplySchedule(inventoryId, item);
    this._inventorySupplier.register(schedule);
  };

  /**
   * 在庫補充スケジュールの更新
   */
  Game_System.prototype.updateInventorySupplier = function () {
    if (!this._inventorySupplier) {
      this._inventorySupplier = new Game_ShopInventorySupplier();
    }

    this._inventorySupplier.update();
  };

  //-----------------------------------------------------------------------------
  // Game_ShopInventory
  //
  // 店舗の在庫を管理するクラス

  Object.defineProperties(Game_ShopInventory.prototype, {
    id: {
      get: function () {
        return this._id;
      },
      configurable: true,
    },
    supplySpeed: {
      get: function () {
        return this._supplySpeed;
      },
      configurable: true,
    },
  });

  Game_ShopInventory.prototype.initialize = function (id) {
    this._id = id;
    this._supplySpeed = 1;

    this.initializeStock();
  };

  /**
   * コンテナの初期化
   */
  Game_ShopInventory.prototype.initializeStock = function (item) {
    this._itemStock = {};
    this._weaponStock = {};
    this._armorStock = {};

    this._abilityOrbStock = {};
  };

  /**
   * 商品のコンテナを取得
   */
  Game_ShopInventory.prototype.itemContainer = function (item) {
    if (!item) {
      return null;
    } else if (DataManager.isItem(item)) {
      return this._itemStock;
    } else if (DataManager.isWeapon(item)) {
      return this._weaponStock;
    } else if (DataManager.isArmor(item)) {
      return this._armorStock;
    } else if (KMS.imported["AbilityOrb"] && DataManager.isAbilityOrb(item)) {
      return this._abilityOrbStock;
    } else {
      console.error("Game_ShopInventory: Invalid item type");
      return null;
    }
  };

  /**
   * 商品の補充速度を設定
   */
  Game_ShopInventory.prototype.setSupplySpeed = function (speed) {
    this._supplySpeed = Math.max(speed, 0);
  };

  /**
   * 商品の補充間隔を取得
   */
  Game_ShopInventory.prototype.getSupplyInterval = function (item) {
    return Math.max(Math.floor(getSupplyInterval(item) * this._supplySpeed), 0);
  };

  /**
   * 商品の在庫数を取得
   */
  Game_ShopInventory.prototype.getStock = function (item) {
    if (!this.isStockManaged(item)) {
      // 在庫管理外なら常に MAX 扱い
      return $gameParty.maxItems(item);
    }

    var stock = this.itemContainer(item);
    if (stock[item.id] == null) {
      // 初回参照時は在庫をフルにする
      stock[item.id] = this.getStockMax(item);
    }

    return stock[item.id];
  };

  /**
   * 商品の在庫数を設定
   */
  Game_ShopInventory.prototype.setStock = function (item, number) {
    if (!this.isStockManaged(item)) {
      return;
    }

    var stock = this.itemContainer(item);
    if (stock != null) {
      stock[item.id] = number.clamp(0, this.getStockMax(item));
    }
  };

  /**
   * 商品が在庫管理対象か
   */
  Game_ShopInventory.prototype.isStockManaged = function (item) {
    return getStockMax(item) != null;
  };

  /**
   * 商品の在庫数上限を取得
   */
  Game_ShopInventory.prototype.getStockMax = function (item) {
    // TODO: 店ごとに上限を指定できるようにしたい
    return this.isStockManaged(item)
      ? getStockMax(item)
      : $gameParty.maxItems(item);
  };

  /**
   * 商品の在庫数が上限か
   */
  Game_ShopInventory.prototype.isStockFull = function (item) {
    return this.getStock(item) >= this.getStockMax(item);
  };

  /**
   * 商品の在庫数があるか
   */
  Game_ShopInventory.prototype.isStockAvailable = function (item) {
    return this.getStock(item) > 0;
  };

  /**
   * 商品の在庫数を増やす
   */
  Game_ShopInventory.prototype.gainStock = function (item, amount) {
    var prevStock = this.getStock(item);
    this.setStock(item, prevStock + amount);
    return this.getStock(item) - prevStock;
  };

  /**
   * 商品の在庫数を減らす
   */
  Game_ShopInventory.prototype.loseStock = function (item, amount) {
    return -this.gainStock(item, -amount);
  };

  //-----------------------------------------------------------------------------
  // Game_ShopSupplySchedule
  //
  // 店舗の在庫補充タイミングを制御するクラス

  Object.defineProperties(Game_ShopSupplySchedule.prototype, {
    inventoryId: {
      get: function () {
        return this._inventoryId;
      },
      configurable: true,
    },
    item: {
      get: function () {
        return this._item.object();
      },
      configurable: true,
    },
  });

  Game_ShopSupplySchedule.prototype.initialize = function (inventoryId, item) {
    this._inventoryId = inventoryId;
    this._item = new Game_Item(item);
    this._startCount = -1;
  };

  /**
   * 補充間隔の取得
   */
  Game_ShopSupplySchedule.prototype.getSupplyInterval = function () {
    var inventory = $gameSystem.getInventoryById(this.inventoryId);
    return inventory.getSupplyInterval(this.item);
  };

  /**
   * 有効なスケジュールであるか
   */
  Game_ShopSupplySchedule.prototype.isValid = function () {
    return this._startCount >= 0;
  };

  /**
   * 補充を行うか
   */
  Game_ShopSupplySchedule.prototype.canSupply = function () {
    return this.getSupplyInterval() > 0;
  };

  /**
   * 同一と見なせるスケジュールであるか
   */
  Game_ShopSupplySchedule.prototype.logicallyEqual = function (rhs) {
    return (
      rhs != null &&
      this.isValid() &&
      this.inventoryId === rhs.inventoryId &&
      isSameItem(this.item, rhs.item)
    );
  };

  /**
   * 補充判定用カウントの現在値を取得
   */
  Game_ShopSupplySchedule.prototype.getCurrentCountForSupply = function () {
    switch (getSupplyMode(this.item)) {
      case SupplyMode.playtime:
        return $gameSystem.playtime();
      case SupplyMode.battleCount:
        return $gameSystem.battleCount();

      default:
        console.error("Invalid supply mode");
        return -1;
    }
  };

  /**
   * 補充可能な個数を取得
   */
  Game_ShopSupplySchedule.prototype.getSuppliableCount = function () {
    if (!this.isValid() || !this.canSupply()) {
      return 0;
    }

    var currentCount = this.getCurrentCountForSupply();
    if (currentCount < 0) {
      // 異常なモード設定
      this.stop();
      return;
    }

    // 現在のカウントが開始時のカウントより減っている場合、
    // 値が変更されたと見なしてカウントを初期化
    if (currentCount < this._startCount) {
      this._startCount = currentCount;
    }

    return Math.floor(
      (currentCount - this._startCount) / this.getSupplyInterval()
    );
  };

  /**
   * スケジュールの開始
   */
  Game_ShopSupplySchedule.prototype.start = function () {
    if (!this.canSupply()) {
      debuglog("%1 is not necessary to supply.".format(this.item.name));
      return;
    }

    var currentCount = this.getCurrentCountForSupply();
    if (currentCount >= 0) {
      this._startCount = currentCount;
    } else {
      // 無効なスケジュール
      this.stop();
    }
  };

  /**
   * スケジュールの停止
   */
  Game_ShopSupplySchedule.prototype.stop = function () {
    this._startCount = -1;
    debuglog(
      "Schedule [%1:%2] stopped".format(this.inventoryId, this.item.name)
    );
  };

  /**
   * 在庫補充処理
   */
  Game_ShopSupplySchedule.prototype.supply = function () {
    if (!this.canSupply()) {
      this.stop();
      return;
    }

    var count = this.getSuppliableCount();
    if (count <= 0) {
      return;
    }

    var item = this.item;
    var inventory = $gameSystem.getInventoryById(this.inventoryId);
    inventory.gainStock(item, count);

    debuglog("%1: Supplied %2".format(item.name, count));

    if (inventory.isStockFull(item)) {
      this.stop();
    } else {
      // 補充した分カウンタを進める
      this._startCount += count * this.getSupplyInterval();
    }
  };

  //-----------------------------------------------------------------------------
  // Game_ShopInventorySupplier
  //
  // 店舗の在庫補充を制御するクラス

  Game_ShopInventorySupplier.prototype.initialize = function () {
    this._schedules = [];
  };

  /**
   * 既に同一アイテムのスケジュールが登録済みか
   */
  Game_ShopInventorySupplier.prototype.isRegistered = function (schedule) {
    return this._schedules.some(function (s) {
      return s.logicallyEqual(schedule);
    }, this);
  };

  /**
   * スケジュール登録
   */
  Game_ShopInventorySupplier.prototype.register = function (schedule) {
    if (this.isRegistered(schedule)) {
      return;
    }

    schedule.start();
    if (schedule.isValid()) {
      this._schedules.push(schedule);
      debuglog("Schedule for %1 is registered".format(schedule.item.name));
    }
  };

  /**
   * 指定したスケジュールを削除
   */
  Game_ShopInventorySupplier.prototype.remove = function (schedule) {
    this._schedules = this._schedules.filter(function (s) {
      return !s.logicallyEqual(schedule);
    }, this);
  };

  /**
   * 停止済みのスケジュールを削除
   */
  Game_ShopInventorySupplier.prototype.removeStopped = function () {
    this._schedules = this._schedules.filter(function (s) {
      return s.isValid();
    }, this);
  };

  /**
   * 在庫の更新
   */
  Game_ShopInventorySupplier.prototype.update = function () {
    this._schedules.forEach(function (s) {
      s.supply();
    }, this);

    this.removeStopped();
  };

  //-----------------------------------------------------------------------------
  // Window_Base

  /**
   * 店舗在庫数の描画
   */
  Window_Base.prototype.drawShopStockNumber = function (
    item,
    inventory,
    x,
    y,
    width
  ) {
    if (!inventory.isStockManaged(item)) {
      return;
    }

    var valueWidth = this.textWidth("000");
    var slashWidth = this.textWidth("/");
    var captionWidth = this.textWidth(Params.stockCaption) + 8;

    this.changeTextColor(this.systemColor());
    this.drawText(Params.stockCaption, x, y, captionWidth);

    var numX = x + width - (valueWidth * 2 + slashWidth);
    var stock = inventory.getStock(item);
    var stockMax = inventory.getStockMax(item);
    this.resetTextColor();
    this.drawText(stock, numX, y, valueWidth, "right");
    this.drawText("/", numX + valueWidth, y, slashWidth, "right");
    this.drawText(
      stockMax,
      numX + valueWidth + slashWidth,
      y,
      valueWidth,
      "right"
    );
  };

  //-----------------------------------------------------------------------------
  // Window_ShopBuy

  var _Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
  Window_ShopBuy.prototype.isEnabled = function (item) {
    var enabled = _Window_ShopBuy_isEnabled.call(this, item);

    if (this._inventory) {
      return enabled && this._inventory.isStockAvailable(item);
    } else {
      return enabled;
    }
  };

  var _Window_ShopBuy_drawItem = Window_ShopBuy.prototype.drawItem;
  Window_ShopBuy.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (this._inventory && !this._inventory.isStockAvailable(item)) {
      // 売り切れ表示
      var rect = this.itemRect(index);
      var priceWidth = 96;
      rect.width -= this.textPadding();
      this.changePaintOpacity(this.isEnabled(item));
      this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
      this.drawText(
        Params.soldOutText,
        rect.x + rect.width - priceWidth,
        rect.y,
        priceWidth,
        "right"
      );
      this.changePaintOpacity(true);
    } else {
      _Window_ShopBuy_drawItem.call(this, index);
    }
  };

  /**
   * 在庫管理オブジェクトの設定
   */
  Window_ShopBuy.prototype.setInventory = function (inventory) {
    this._inventory = inventory;
  };

  //-----------------------------------------------------------------------------
  // Window_ShopNumber

  var _Window_ShopNumber_refresh = Window_ShopNumber.prototype.refresh;
  Window_ShopNumber.prototype.refresh = function () {
    _Window_ShopNumber_refresh.call(this);

    if (!Params.showStockInStatus) {
      this.drawStockNumber();
    }
  };

  /**
   * 在庫数の描画
   */
  Window_ShopNumber.prototype.drawStockNumber = function () {
    if (!this._item || !this._inventory) {
      return;
    }

    var valueWidth = this.textWidth("000");
    var slashWidth = this.textWidth("/");
    var captionWidth =
      this.textWidth(Params.stockCaption) + this.textPadding() * 2 + 8;
    var width = captionWidth + valueWidth * 2 + slashWidth;
    var x = this.contents.width - width - this.textPadding() * 2;
    var y = this.stockY();
    this.drawShopStockNumber(this._item, this._inventory, x, y, width);
  };

  /**
   * 在庫数 Y 座標
   */
  Window_ShopNumber.prototype.stockY = function () {
    return this.itemY() - this.lineHeight() * 2;
  };

  /**
   * 在庫管理オブジェクトの設定
   */
  Window_ShopNumber.prototype.setInventory = function (inventory) {
    this._inventory = inventory;
  };

  //-----------------------------------------------------------------------------
  // Window_ShopStatus

  var _Windowe_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
  Window_ShopStatus.prototype.refresh = function () {
    _Windowe_ShopStatus_refresh.call(this);

    if (Params.showStockInStatus) {
      var x = this.textPadding();
      this.drawStockNumber(x, this.lineHeight());
    }
  };

  /**
   * 在庫数の描画
   */
  Window_ShopStatus.prototype.drawStockNumber = function (x, y) {
    if (!this._item || !this._inventory) {
      return;
    }

    var width = this.contents.width - this.textPadding() * 2;
    this.drawShopStockNumber(this._item, this._inventory, x, y, width);
  };

  /**
   * 在庫管理オブジェクトの設定
   */
  Window_ShopStatus.prototype.setInventory = function (inventory) {
    this._inventory = inventory;
  };

  //-----------------------------------------------------------------------------
  // Scene_Shop

  var _Scene_Shop_prepare = Scene_Shop.prototype.prepare;
  Scene_Shop.prototype.prepare = function (goods, purchaseOnly) {
    _Scene_Shop_prepare.call(this, goods, purchaseOnly);

    // 在庫補充
    $gameSystem.updateInventorySupplier();

    // 予約されている在庫管理情報を呼び出す
    var id = $gameTemp.nextInventoryId;
    if (id != null) {
      this._inventory = $gameSystem.getInventoryById(id);
      $gameTemp.nextInventoryId = null;
    } else {
      this._inventory = null;
    }
  };

  var _Scene_Shop_createBuyWindow = Scene_Shop.prototype.createBuyWindow;
  Scene_Shop.prototype.createBuyWindow = function () {
    _Scene_Shop_createBuyWindow.call(this);

    this._buyWindow.setInventory(this._inventory);
  };

  var _Scene_Shop_createNumberWindow = Scene_Shop.prototype.createNumberWindow;
  Scene_Shop.prototype.createNumberWindow = function () {
    _Scene_Shop_createNumberWindow.call(this);

    this._numberWindow.setInventory(this._inventory);
  };

  var _Scene_Shop_createStatusWindow = Scene_Shop.prototype.createStatusWindow;
  Scene_Shop.prototype.createStatusWindow = function () {
    _Scene_Shop_createStatusWindow.call(this);

    this._statusWindow.setInventory(this._inventory);
  };

  var _Scene_Shop_maxBuy = Scene_Shop.prototype.maxBuy;
  Scene_Shop.prototype.maxBuy = function () {
    var count = _Scene_Shop_maxBuy.call(this);

    if (this._inventory) {
      // 既に所持金に応じた cap がかかっているので、在庫数と比較して少ない方を採用
      count = Math.min(count, this._inventory.getStock(this._item));
    }

    return count;
  };

  var _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
  Scene_Shop.prototype.doBuy = function (number) {
    _Scene_Shop_doBuy.call(this, number);

    // 在庫を減らす
    if (this._inventory) {
      this._inventory.loseStock(this._item, number);

      // 在庫補充を開始
      $gameSystem.registerInventorySupplySchedule(
        this._inventory.id,
        this._item
      );
    }
  };

  var _Scene_Shop_doSell = Scene_Shop.prototype.doSell;
  Scene_Shop.prototype.doSell = function (number) {
    _Scene_Shop_doSell.call(this, number);

    // 買戻し用に在庫を増やす
    if (this._inventory) {
      this._inventory.gainStock(this._item, number);
    }
  };
})();
