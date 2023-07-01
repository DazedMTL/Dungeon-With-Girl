/*:

 PH - Warehouse/Storage
 @plugindesc This plugin allows the creation of warehouses where you can store items in the game.
 @author PrimeHover
 @version 1.2.1
 @date 05/30/2016

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param ---Options---
 @desc Use the spaces below to customize the options of the plugin
 @default

 @param All Together
 @desc Defines whether or not you want to show the items in separated categories (0: false, 1: true)
 @default 0

 @param Stack Item Quantity
 @desc Defines whether or not you want to consider stacked items as a single space in the capacity (0: false, 1: true)
 @default 0

 @param ---Vocabulary---
 @desc Use the spaces below to personalize the vocabulary of the plugin
 @default

 @param Withdraw Text
 @desc Text shown in option "Withdraw"
 @default Withdraw

 @param Deposit Text
 @desc Text shown in option "Deposit"
 @default Deposit

 @param All Text
 @desc Text shown in option "All" if the parameter "All Together" is set as true.
 @default All

 @param Available Space Text
 @desc Text shown in the information window
 @default Available Space:

 @help

 Warehouse/Storage Plugin
 created by PrimeHover

 Check out the full documentation at: https://github.com/PrimeHover/Warehouse
 Check out an illustrative example of using the commands and rules at: http://forums.rpgmakerweb.com/index.php?/topic/50503-ph-warehousestorage/
 Check out the portuguese example at: http://www.mundorpgmaker.com.br/topic/114053-ph-warehousestorage/

 ----------------------------------------------------------------------------------------------------------------------------------

 Plugin Commands:

 - PHWarehouse create <Title of the Warehouse>                      # Creates a warehouse
 - PHWarehouse create <Title of the Warehouse:50>                   # Creates a warehouse and sets its maximum capacity to 50
 - PHWarehouse create <Title of the Warehouse:50:rule>              # Creates a warehouse, sets its maximum capacity to 50 and sets a rule

 - PHWarehouse show <Title of the Warehouse>                        # Shows a warehouse
 - PHWarehouse remove <Title of the Warehouse>                      # Removes a warehouse

 - PHWarehouse loot item <Title of the Warehouse:id:quantity>       # Add an item for loot bonus inside a created warehouse
 - PHWarehouse loot weapon <Title of the Warehouse:id:quantity>     # Add a weapon for loot bonus inside a created warehouse
 - PHWarehouse loot armor <Title of the Warehouse:id:quantity>      # Add an armor for loot bonus inside a created warehouse
 - PHWarehouse loot keyItem <Title of the Warehouse:id:quantity>    # Add a key item for loot bonus inside a created warehouse

 - PHWarehouse add item <Title of the Warehouse:id:quantity>        # Add an item immediately inside a created warehouse
 - PHWarehouse add weapon <Title of the Warehouse:id:quantity>      # Add a weapon immediately inside a created warehouse
 - PHWarehouse add armor <Title of the Warehouse:id:quantity>       # Add an armor immediately inside a created warehouse
 - PHWarehouse add keyItem <Title of the Warehouse:id:quantity>     # Add a key item immediately inside a created warehouse

 - PHWarehouse capacity set <Title of the Warehouse:quantity>       # Set a new maximum capacity for a warehouse already created
 - PHWarehouse capacity increase <Title of the Warehouse:quantity>  # Increase the maximum capacity for a warehouse already created
 - PHWarehouse capacity decrease <Title of the Warehouse:quantity>  # Decrease the maximum capacity for a warehouse already created

----------------------------------------------------------------------------------------------------------------------------------

Script Commands:

 - PHPlugins.PHWarehouse.prototype.exist("Title of the Warehouse");                                # Verifies if a warehouse exists

 - PHPlugins.PHWarehouse.prototype.getMaxCapacity("Title of the Warehouse");                       # Gets the maximum capacity of a warehouse
 - PHPlugins.PHWarehouse.prototype.getCurrentCapacity("Title of the Warehouse");                   # Gets the current capacity of a warehouse

 - PHPlugins.PHWarehouse.prototype.hasItem("Title of the Warehouse", id);                          # Verifies if a warehouse has a particular item and returns the quantity of this item inside the warehouse
 - PHPlugins.PHWarehouse.prototype.hasWeapon("Title of the Warehouse", id);                        # Verifies if a warehouse has a particular weapon and returns the quantity of this item inside the warehouse
 - PHPlugins.PHWarehouse.prototype.hasArmor("Title of the Warehouse", id);                         # Verifies if a warehouse has a particular armor and returns the quantity of this item inside the warehouse
 - PHPlugins.PHWarehouse.prototype.hasKeyItem("Title of the Warehouse", id);                       # Verifies if a warehouse has a particular key item and returns the quantity of this item inside the warehouse

 ----------------------------------------------------------------------------------------------------------------------------------

Rule Commands:

    Rules are a simple way to manage which items you can store in a specific warehouse.
    In order to create a rule for your warehouse, you have to create a Common Event in the database called "PHWarehouse".
    Inside of that Common Event, you will create some comments in order to populate the rules for warehouses.
    These comments must have the following format:

    {Title of the Rule}
    [commands]

    The [commands] you can specify are as follow:

    item: 1 (Just allow the storage of the item with id 1)
    item: 1, 2, 3, 4 (Allows the storage of items with id 1, 2, 3 and 4)
    item: no (Does not allow the storage of items)
    item-n: 1 (Allows the storage of any item except the one with id 1)
    (If you don't specify the command "item" in the rule, all items will be allowed to be stored)

    weapon: 1 (Just allow the storage of the weapon with id 1)
    weapon: 1, 2, 3, 4 (Allows the storage of weapons with id 1, 2, 3 and 4)
    weapon: no (Does not allow the storage of weapons)
    weapon-n: 1 (Allows the storage of any weapon except the one with id 1)
    (If you don't specify the command "weapon" in the rule, all weapons will be allowed to be stored)

    armor: 1 (Just allow the storage of the armor with id 1)
    armor: 1, 2, 3, 4 (Allows the storage of armors with id 1, 2, 3 and 4)
    armor: no (Does not allow the storage of armors)
    armor-n: 1 (Allows the storage of any armor except the one with id 1)
    (If you don't specify the command "armor" in the rule, all armors will be allowed to be stored)

    keyItem: 1 (Just allow the storage of the key item with id 1)
    keyItem: 1, 2, 3, 4 (Allows the storage of key items with id 1, 2, 3 and 4)
    keyItem: no (Does not allow the storage of key items)
    keyItem-n: 1 (Allows the storage of any key item except the one with id 1)
    (If you don't specify the command "keyItem" in the rule, all key items will be allowed to be stored)

 */

/* Global variable for PH Plugins */
var PHPlugins = PHPlugins || {};
PHPlugins.Parameters = PluginManager.parameters('PH_Warehouse');
PHPlugins.Params = PHPlugins.Params || {};

/* Global variable for the list of quests */
PHPlugins.PHWarehouse = null;

/* Getting the parameters */
PHPlugins.Params.PHWarehouseWithdrawText = String(PHPlugins.Parameters['Withdraw Text']);
PHPlugins.Params.PHWarehouseDepositText = String(PHPlugins.Parameters['Deposit Text']);
PHPlugins.Params.PHWarehouseAvailableSpaceText = String(PHPlugins.Parameters['Available Space Text']);
PHPlugins.Params.PHWarehouseAllText = String(PHPlugins.Parameters['All Text']);
PHPlugins.Params.PHWarehouseAllTogether = Number(PHPlugins.Parameters['All Together']) || 0;
PHPlugins.Params.PHWarehouseStackItemQuantity = Number(PHPlugins.Parameters['Stack Item Quantity']) || 0;
PHPlugins.Params.PHWarehouseAllTogether = Boolean(PHPlugins.Params.PHWarehouseAllTogether);
PHPlugins.Params.PHWarehouseStackItemQuantity = Boolean(PHPlugins.Params.PHWarehouseStackItemQuantity);

(function () {

    /* ---------------------------------------------------------- *
     *                      WAREHOUSE MANAGER                     *
     * ---------------------------------------------------------- */

    function PHWarehouseManager() {
        this._rules = {};
        this._warehouses = {};
        this._lastActive = "";
        this._lastOption = 0; // 0 = Withdraw, 1 = Deposit
        this._lastCategory = "item";
    }

    /* ---- BASIC OPERATIONS ---- */

    /* Creates a warehouse if it does not exist */
    PHWarehouseManager.prototype.createWarehouse = function (_sentence) {

        var matches = this.checkSentence(_sentence);
        var results;
        var title;
        var rule = null;
        var capacity = 50;

        if (matches != null) {
            results = matches.split(":");
            title = results[0];

            if (!this._warehouses.hasOwnProperty(title)) {

                if (results.length >= 2) {
                    capacity = parseInt(results[1]);
                    if (isNaN(capacity) || capacity <= 0) {
                        capacity = 50;
                    }
                    if (typeof results[2] !== "undefined" && this._rules.hasOwnProperty(results[2])) {
                        rule = results[2];
                    }
                }

                this._warehouses[title] = {
                    title: title,
                    maxCapacity: capacity,
                    currentCapacity: 0,
                    rule: rule,
                    lootBonus: true,
                    items: {
                        item: [],
                        weapon: [],
                        armor: [],
                        keyItem: []
                    },
                    qtty: {
                        item: {},
                        weapon: {},
                        armor: {},
                        keyItem: {}
                    }
                };
            }

            this._lastActive = title;
        }

    };

    /* Opens a warehouse */
    PHWarehouseManager.prototype.openWarehouse = function (_sentence) {
        var matches = this.checkSentence(_sentence);
        if (matches != null) {
            this._lastActive = matches;
            this._warehouses[this._lastActive].lootBonus = false;
        }
    };

    /* Remove a warehouse */
    PHWarehouseManager.prototype.removeWarehouse = function (_sentence) {

        var matches = this.checkSentence(_sentence);

        if (matches != null) {
            if (this._warehouses.hasOwnProperty(matches)) {
                delete this._warehouses[matches];
            }
        }

    };

    /* Add a loot bonus */
    PHWarehouseManager.prototype.addLoot = function (_sentence, category) {

        var matches = this.checkSentence(_sentence);
        var results;

        if (matches != null) {
            results = matches.split(":");
            if (this._warehouses.hasOwnProperty(results[0]) && this._warehouses[results[0]].lootBonus && typeof results[1] !== "undefined" && typeof results[2] !== "undefined") {
                results[1] = parseInt(results[1]);
                results[2] = parseInt(results[2]);
                if (results[2] > this._warehouses[results[0]].maxCapacity - this._warehouses[results[0]].currentCapacity) {
                    results[2] = this._warehouses[results[0]].maxCapacity - this._warehouses[results[0]].currentCapacity;
                }

                if (this._warehouses[results[0]].items[category].indexOf(results[1]) > -1) {
                    this._warehouses[results[0]].qtty[category][results[1]] += results[2];
                } else {
                    this._warehouses[results[0]].items[category].push(results[1]);
                    this._warehouses[results[0]].qtty[category][results[1]] = results[2];
                }
                this._warehouses[results[0]].currentCapacity += results[2];
            }
        }

    };

    /* Add item to a warehouse */
    PHWarehouseManager.prototype.addItems = function (_sentence, category) {

        var matches = this.checkSentence(_sentence);
        var results;

        if (matches != null) {
            results = matches.split(":");
            if (this._warehouses.hasOwnProperty(results[0]) && typeof results[1] !== "undefined" && typeof results[2] !== "undefined") {
                results[1] = parseInt(results[1]);
                results[2] = parseInt(results[2]);

                if (results[2] > this._warehouses[results[0]].maxCapacity - this._warehouses[results[0]].currentCapacity) {
                    results[2] = this._warehouses[results[0]].maxCapacity - this._warehouses[results[0]].currentCapacity;
                }

                if (this._warehouses[results[0]].items[category].indexOf(results[1]) > -1) {
                    this._warehouses[results[0]].qtty[category][results[1]] += results[2];
                } else {
                    this._warehouses[results[0]].items[category].push(results[1]);
                    this._warehouses[results[0]].qtty[category][results[1]] = results[2];
                }
                this._warehouses[results[0]].currentCapacity += results[2];
            }
        }

    };



    /* ---- RULE METHODS ---- */

    /* Load rules */
    PHWarehouseManager.prototype.loadRules = function () {
        var warehouseVar = null;

        if ($dataCommonEvents) {
            for (var i = 0; i < $dataCommonEvents.length; i++) {
                if ($dataCommonEvents[i] instanceof Object && $dataCommonEvents[i].name == "PHWarehouse") {
                    warehouseVar = $dataCommonEvents[i].list;
                    i = $dataCommonEvents.length;
                }
            }
        }

        if (warehouseVar != null) {
            this.populateRules(warehouseVar);
        }
    };

    /* Populate rules */
    PHWarehouseManager.prototype.populateRules = function (warehouseVar) {
        var str = '';
        var index = -1;
        var rule;

        for (var i = 0; i < warehouseVar.length; i++) {
            if (warehouseVar[i].parameters[0]) {
                str = warehouseVar[i].parameters[0].trim();
                if (this.checkTitle(str)) {
                    str = str.slice(1, str.length - 1);
                    this._rules[str] = {
                        enabledItems: {
                            item: [],
                            weapon: [],
                            armor: [],
                            keyItem: []
                        },
                        disabledItems: {
                            item: [],
                            weapon: [],
                            armor: [],
                            keyItem: []
                        }
                    };
                    index = str;
                } else if (this._rules[index]) {
                    rule = str.split(":");
                    rule[0] = rule[0].trim();
                    rule[1] = rule[1].trim();

                    if (rule[0].indexOf('-n') > -1) {
                        rule[0] = rule[0].replace("-n", "");
                        if (this._rules[index].disabledItems.hasOwnProperty(rule[0])) {
                            this._rules[index].disabledItems[rule[0]] = this.getItemsId(rule[1]);
                        }
                    } else {
                        if (this._rules[index].enabledItems.hasOwnProperty(rule[0])) {
                            if (rule[1].indexOf("no") > -1) {
                                this._rules[index].enabledItems[rule[0]] = false;
                            } else {
                                this._rules[index].enabledItems[rule[0]] = this.getItemsId(rule[1]);
                            }
                        }
                    }
                }
            }
        }
    };

    /* Checks if the string is a title or a description */
    PHWarehouseManager.prototype.checkTitle = function (str) {
        if (str.charAt(0) == "{" && str.charAt(str.length - 1) == "}") {
            return true;
        }
        return false;
    };

    /* Separate ids and make it an array */
    PHWarehouseManager.prototype.getItemsId = function (str) {
        var arr = str.split(",");
        for (var i = 0; i < arr; i++) {
            arr[i] = parseInt(arr[i], 10);
        }
        return arr;
    };

    /* Checks if items are enabled */
    PHWarehouseManager.prototype.isItemEnabled = function () {
        if (this._warehouses[this._lastActive].rule == null || (this._rules.hasOwnProperty(this._warehouses[this._lastActive].rule) && Array.isArray(this._rules[this._warehouses[this._lastActive].rule].enabledItems.item))) {
            return true;
        }
        return false;
    };

    /* Checks if weapons are enabled */
    PHWarehouseManager.prototype.isWeaponEnabled = function () {
        if (this._warehouses[this._lastActive].rule == null || (this._rules.hasOwnProperty(this._warehouses[this._lastActive].rule) && Array.isArray(this._rules[this._warehouses[this._lastActive].rule].enabledItems.weapon))) {
            return true;
        }
        return false;
    };

    /* Checks if armors are enabled */
    PHWarehouseManager.prototype.isArmorEnabled = function () {
        if (this._warehouses[this._lastActive].rule == null || (this._rules.hasOwnProperty(this._warehouses[this._lastActive].rule) && Array.isArray(this._rules[this._warehouses[this._lastActive].rule].enabledItems.armor))) {
            return true;
        }
        return false;
    };

    /* Checks if key items are enabled */
    PHWarehouseManager.prototype.isKeyItemEnabled = function () {
        if (this._warehouses[this._lastActive].rule == null || (this._rules.hasOwnProperty(this._warehouses[this._lastActive].rule) && Array.isArray(this._rules[this._warehouses[this._lastActive].rule].enabledItems.keyItem))) {
            return true;
        }
        return false;
    };

    /* Verifies if an item is allowed to be withdrawn or deposited */
    PHWarehouseManager.prototype.verifyItem = function (item) {
        if (item == undefined) return false;
        this.verifyAllTogether(item);
        if (this._warehouses[this._lastActive].rule == null ||
            (this._rules.hasOwnProperty(this._warehouses[this._lastActive].rule) &&
                Array.isArray(this._rules[this._warehouses[this._lastActive].rule].enabledItems[this._lastCategory]) &&
                (this._rules[this._warehouses[this._lastActive].rule].enabledItems[this._lastCategory].indexOf(item.id) > -1) ||
                this._rules[this._warehouses[this._lastActive].rule].enabledItems[this._lastCategory].length == 0)) {

            /* Makes a second checking to see if this item is disabled */
            if (this._warehouses[this._lastActive].rule !== null &&
                Array.isArray(this._rules[this._warehouses[this._lastActive].rule].disabledItems[this._lastCategory]) &&
                this._rules[this._warehouses[this._lastActive].rule].disabledItems[this._lastCategory].indexOf(item.id) > -1) {
                return false;
            }
            return true;
        }
        return false;
    };

    /* Changes the last category if "all together" are set as true */
    PHWarehouseManager.prototype.verifyAllTogether = function (item) {
        if (PHPlugins.Params.PHWarehouseAllTogether == true) {
            if (DataManager.isItem(item) && item.itypeId === 1) {
                this._lastCategory = 'item';
            } else if (DataManager.isArmor(item)) {
                this._lastCategory = 'armor';
            } else if (DataManager.isWeapon(item)) {
                this._lastCategory = 'weapon';
            } else if (DataManager.isItem(item) && item.itypeId === 2) {
                this._lastCategory = 'keyItem';
            }
        }
    };

    /* Undo what the previous function has done */
    PHWarehouseManager.prototype.undoAllTogetherVerification = function () {
        if (PHPlugins.Params.PHWarehouseAllTogether == true) {
            this._lastCategory = 'all';
        }
    };

    /* Changes the maximum capacity of the warehouse for the given title */
    PHWarehouseManager.prototype.setMaxCapacity = function (_sentence) {
        var matches = this.checkSentence(_sentence);
        if (matches != null) {
            var results = matches.split(":");
            if (results.length == 2) {
                var title = results[0];
                var capacity = parseInt(results[1]);
                if (this._warehouses.hasOwnProperty(title) && !isNaN(capacity) && capacity >= this.getCurrentCapacity(title)) {
                    this._warehouses[title].maxCapacity = capacity;
                    if (this._warehouses[title].maxCapacity < 0) {
                        this._warehouses[title].maxCapacity = 0;
                    }
                }
            }
        }
    };

    /* Increases the maximum capacity of the warehouse for the given title */
    PHWarehouseManager.prototype.increaseMaxCapacity = function (_sentence) {
        var matches = this.checkSentence(_sentence);
        if (matches != null) {
            var results = matches.split(":");
            if (results.length == 2) {
                var title = results[0];
                var capacity = parseInt(results[1]);
                if (this._warehouses.hasOwnProperty(title) && !isNaN(capacity) && (this._warehouses[title].maxCapacity + capacity) >= this.getCurrentCapacity(title)) {
                    this._warehouses[title].maxCapacity += capacity;
                    if (this._warehouses[title].maxCapacity < 0) {
                        this._warehouses[title].maxCapacity = 0;
                    }
                }
            }
        }
    };

    /* Decreases the maximum capacity of the warehouse for the given title */
    PHWarehouseManager.prototype.decreaseMaxCapacity = function (_sentence) {
        var matches = this.checkSentence(_sentence);
        if (matches != null) {
            var results = matches.split(":");
            if (results.length == 2) {
                var title = results[0];
                var capacity = parseInt(results[1]);
                if (this._warehouses.hasOwnProperty(title) && !isNaN(capacity) && (this._warehouses[title].maxCapacity - capacity) >= this.getCurrentCapacity(title)) {
                    this._warehouses[title].maxCapacity -= capacity;
                    if (this._warehouses[title].maxCapacity < 0) {
                        this._warehouses[title].maxCapacity = 0;
                    }
                }
            }
        }
    };



    /* ---- MANAGEMENT METHODS ---- */

    /* Get all the items from the current warehouse */
    PHWarehouseManager.prototype.getItems = function () {
        var totalItems = this.getCommonItems();
        totalItems = totalItems.concat(this.getArmors());
        totalItems = totalItems.concat(this.getKeyItems());
        totalItems = totalItems.concat(this.getWeapons());
        return totalItems;
    };

    /* Get weapon items */
    PHWarehouseManager.prototype.getWeapons = function () {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.weapon.length; i++) {
            for (var j = 0; j < $dataWeapons.length; j++) {
                if ($dataWeapons[j] != null && this._warehouses[this._lastActive].items.weapon[i] == $dataWeapons[j].id) {
                    totalItems.push($dataWeapons[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get common items */
    PHWarehouseManager.prototype.getCommonItems = function () {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.item.length; i++) {
            for (var j = 0; j < $dataItems.length; j++) {
                if ($dataItems[j] != null && this._warehouses[this._lastActive].items.item[i] == $dataItems[j].id) {
                    totalItems.push($dataItems[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get armor items */
    PHWarehouseManager.prototype.getArmors = function () {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.armor.length; i++) {
            for (var j = 0; j < $dataArmors.length; j++) {
                if ($dataArmors[j] != null && this._warehouses[this._lastActive].items.armor[i] == $dataArmors[j].id) {
                    totalItems.push($dataArmors[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get key items */
    PHWarehouseManager.prototype.getKeyItems = function () {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.keyItem.length; i++) {
            for (var j = 0; j < $dataItems.length; j++) {
                if ($dataItems[j] != null && this._warehouses[this._lastActive].items.keyItem[i] == $dataItems[j].id) {
                    totalItems.push($dataItems[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get the quantity for the corresponding item */
    PHWarehouseManager.prototype.getQuantity = function (item) {
        this.verifyAllTogether(item);
        var qtty = this._warehouses[this._lastActive].qtty[this._lastCategory][item.id];
        this.undoAllTogetherVerification();
        return qtty;
    };

    /* Checks whether or not the warehouse is already full */
    PHWarehouseManager.prototype.checkCapacity = function () {
        var capacity = this.getCurrentCapacity(this._lastActive);
        if (capacity < this._warehouses[this._lastActive].maxCapacity) {
            return true;
        }
        return false;
    };



    /* ---- OPERATION METHODS ---- */

    /* Deposit on warehouse */
    PHWarehouseManager.prototype.deposit = function (item) {
        if (this.checkCapacity()) {

            this.verifyAllTogether(item);
            if (this._lastCategory != 'all') {
                var hasItem = false;
                if (this._warehouses[this._lastActive].items[this._lastCategory].indexOf(item.id) > -1) {
                    hasItem = true;
                }

                if (hasItem) {
                    this._warehouses[this._lastActive].qtty[this._lastCategory][item.id]++;
                } else {
                    this._warehouses[this._lastActive].items[this._lastCategory].push(item.id);
                    this._warehouses[this._lastActive].qtty[this._lastCategory][item.id] = 1;
                }
                this._warehouses[this._lastActive].currentCapacity++;
            }
            this.undoAllTogetherVerification();

        }

    };

    /* Withdraw from a warehouse */
    PHWarehouseManager.prototype.withdraw = function (item) {

        this.verifyAllTogether(item);

        if (this._lastCategory != 'all') {
            var hasItem = false;
            var index = this._warehouses[this._lastActive].items[this._lastCategory].indexOf(item.id);
            if (index > -1) {
                hasItem = true;
            }

            if (hasItem) {
                this._warehouses[this._lastActive].qtty[this._lastCategory][item.id]--;
                if (this._warehouses[this._lastActive].qtty[this._lastCategory][item.id] == 0) {
                    this._warehouses[this._lastActive].items[this._lastCategory].splice(index, 1);
                    delete this._warehouses[this._lastActive].qtty[this._lastCategory][item.id];
                }
                this._warehouses[this._lastActive].currentCapacity--;
            }
        }

        this.undoAllTogetherVerification();

    };



    /* ---- INTERNAL METHODS ---- */

    /* Check sentences coming from the arguments */
    PHWarehouseManager.prototype.checkSentence = function (_sentence) {
        var regExp = /\<([^)]+)\>/;
        var matches = regExp.exec(_sentence);
        if (matches != null) {
            return matches[1];
        } else {
            return null;
        }
    };

    /* Main method for checking items inside warehouses */
    PHWarehouseManager.prototype.hasItems = function (title, id, category) {
        if (this._warehouses.hasOwnProperty(title) && this._warehouses[title].items[category].indexOf(id) > -1) {
            return this._warehouses[title].qtty[category][id];
        }
        return 0;
    };



    /* ---- ACCESSOR METHODS ---- */

    /* Return the value of the maximum capacity of the warehouse for the given title */
    PHWarehouseManager.prototype.getMaxCapacity = function (title) {
        if (this._warehouses.hasOwnProperty(title)) {
            return this._warehouses[title].maxCapacity;
        }
        return 0;
    };

    /* Return the value of the quantity of items in the warehouse for the given title */
    PHWarehouseManager.prototype.getCurrentCapacity = function (title) {
        if (this._warehouses.hasOwnProperty(title)) {
            if (PHPlugins.Params.PHWarehouseStackItemQuantity == true) {
                return (this._warehouses[title].items.item.length + this._warehouses[title].items.weapon.length + this._warehouses[title].items.keyItem.length + this._warehouses[title].items.armor.length);
            } else {
                return this._warehouses[title].currentCapacity;
            }
        }
        return 0;
    };

    /* Return whether or not the warehouse for the given title exists */
    PHWarehouseManager.prototype.exist = function (title) {
        if (this._warehouses.hasOwnProperty(title) && this._warehouses[title] !== undefined) {
            return true;
        }
        return false;
    };

    /* Checks if the given warehouse has an item */
    PHWarehouseManager.prototype.hasItem = function (title, id) {
        return this.hasItems(title, id, 'item');
    };

    /* Checks if the given warehouse has a weapon */
    PHWarehouseManager.prototype.hasWeapon = function (title, id) {
        return this.hasItems(title, id, 'weapon');
    };

    /* Checks if the given warehouse has an armor */
    PHWarehouseManager.prototype.hasArmor = function (title, id) {
        return this.hasItems(title, id, 'armor');
    };

    /* Checks if the given warehouse has a key item */
    PHWarehouseManager.prototype.hasKeyItem = function (title, id) {
        return this.hasItems(title, id, 'keyItem');
    };



    /* ---------------------------------------------------------- *
     *                      LOADING PROCESS                       *
     * ---------------------------------------------------------- */

    /* Creating PHWarehouse variable after loading the whole database */
    var _DataManager_createGameObjects_ = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects_.call(this);
        PHPlugins.PHWarehouse = new PHWarehouseManager();
        PHPlugins.PHWarehouse.loadRules();
    };

    /* Saves the warehouses when the player saves the game */
    var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        var contents = _DataManager_makeSaveContents_.call(this);
        contents.phwarehouse = PHPlugins.PHWarehouse._warehouses;
        return contents;
    };

    /* Retrieve the warehouses from the save content */
    var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents_.call(this, contents);
        PHPlugins.PHWarehouse = new PHWarehouseManager();
        PHPlugins.PHWarehouse._warehouses = contents.phwarehouse;
        PHPlugins.PHWarehouse.loadRules();
    };

    var getAllArguments = function (args, startIndex) {
        var str = args[startIndex].toString();
        for (var i = (startIndex + 1); i < args.length; i++) {
            str += ' ' + args[i].toString();
        }
        return str;
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'PHWarehouse') {
            switch (args[0]) {
                case 'create':
                    PHPlugins.PHWarehouse.createWarehouse(getAllArguments(args, 1));
                    break;
                case 'show':
                    PHPlugins.PHWarehouse.openWarehouse(getAllArguments(args, 1));
                    SceneManager.push(Scene_Warehouse);
                    break;
                case 'remove':
                    PHPlugins.PHWarehouse.removeWarehouse(getAllArguments(args, 1));
                    break;
                case 'add':
                    switch (args[1]) {
                        case 'item':
                            PHPlugins.PHWarehouse.addItems(getAllArguments(args, 2), 'item');
                            break;
                        case 'weapon':
                            PHPlugins.PHWarehouse.addItems(getAllArguments(args, 2), 'weapon');
                            break;
                        case 'armor':
                            PHPlugins.PHWarehouse.addItems(getAllArguments(args, 2), 'armor');
                            break;
                        case 'keyItem':
                            PHPlugins.PHWarehouse.addItems(getAllArguments(args, 2), 'keyItem');
                            break;
                    }
                    break;
                case 'capacity':
                    switch (args[1]) {
                        case 'increase':
                            PHPlugins.PHWarehouse.increaseMaxCapacity(getAllArguments(args, 2));
                            break;
                        case 'decrease':
                            PHPlugins.PHWarehouse.decreaseMaxCapacity(getAllArguments(args, 2));
                            break;
                        case 'set':
                            PHPlugins.PHWarehouse.setMaxCapacity(getAllArguments(args, 2));
                            break;
                    }
                    break;
                case 'loot':
                    switch (args[1]) {
                        case 'item':
                            PHPlugins.PHWarehouse.addLoot(getAllArguments(args, 2), 'item');
                            break;
                        case 'weapon':
                            PHPlugins.PHWarehouse.addLoot(getAllArguments(args, 2), 'weapon');
                            break;
                        case 'armor':
                            PHPlugins.PHWarehouse.addLoot(getAllArguments(args, 2), 'armor');
                            break;
                        case 'keyItem':
                            PHPlugins.PHWarehouse.addLoot(getAllArguments(args, 2), 'keyItem');
                            break;
                    }
                    break;
            }
        }
    };



    /* ---------------------------------------------------------- *
     *                       WINDOW PROCESS                       *
     * ---------------------------------------------------------- */

    function Window_WarehouseTitle() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseTitle.prototype = Object.create(Window_Base.prototype);
    Window_WarehouseTitle.prototype.constructor = Window_WarehouseTitle;

    Window_WarehouseTitle.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, this.fittingHeight(1));
        this.refresh();
    };

    Window_WarehouseTitle.prototype.refresh = function () {
        this.contents.clear();
        this.changeTextColor(this.crisisColor());
        this.drawText(PHPlugins.PHWarehouse._lastActive, 0, 0, Graphics.boxWidth, "center");
    };



    function Window_WarehouseOption() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseOption.prototype = Object.create(Window_Selectable.prototype);
    Window_WarehouseOption.prototype.constructor = Window_WarehouseOption;

    Window_WarehouseOption.prototype.initialize = function () {
        Window_Selectable.prototype.initialize.call(this, 0, this.fittingHeight(1), Graphics.boxWidth, this.fittingHeight(1));
        this.withdrawText = PHPlugins.Params.PHWarehouseWithdrawText;
        this.depositText = PHPlugins.Params.PHWarehouseDepositText;
        this.refresh();
        this.select(0);
        this.activate();
    };

    Window_WarehouseOption.prototype.maxItems = function () {
        return 2;
    };

    Window_WarehouseOption.prototype.maxCols = function () {
        return 2;
    };

    Window_WarehouseOption.prototype.changeOption = function () {
        PHPlugins.PHWarehouse._lastOption = this._index;
    };

    Window_WarehouseOption.prototype.refresh = function () {
        var rectWithdraw = this.itemRectForText(0);
        var rectDeposit = this.itemRectForText(1);
        this.drawText(this.withdrawText, rectWithdraw.x, rectWithdraw.y, rectWithdraw.width, "center");
        this.drawText(this.depositText, rectDeposit.x, rectDeposit.y, rectDeposit.width, "center");
    };



    function Window_WarehouseCategory() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseCategory.prototype = Object.create(Window_ItemCategory.prototype);
    Window_WarehouseCategory.prototype.constructor = Window_WarehouseCategory;

    Window_WarehouseCategory.prototype.initialize = function () {
        Window_ItemCategory.prototype.initialize.call(this);
        this.y = this.fittingHeight(3);
        this.deselect();
        this.deactivate();
    };

    Window_WarehouseCategory.prototype.changeCategory = function () {
        PHPlugins.PHWarehouse._lastCategory = this.currentSymbol() || "item";
    };

    Window_WarehouseCategory.prototype.maxCols = function () {
        if (PHPlugins.Params.PHWarehouseAllTogether == true) {
            return 1;
        }
        var cols = 0;
        if (PHPlugins.PHWarehouse.isItemEnabled()) {
            cols++;
        }
        if (PHPlugins.PHWarehouse.isWeaponEnabled()) {
            cols++;
        }
        if (PHPlugins.PHWarehouse.isArmorEnabled()) {
            cols++;
        }
        if (PHPlugins.PHWarehouse.isKeyItemEnabled()) {
            cols++;
        }
        return cols;
    };

    Window_WarehouseCategory.prototype.makeCommandList = function () {
        if (PHPlugins.Params.PHWarehouseAllTogether == true) {
            this.addCommand(PHPlugins.Params.PHWarehouseAllText, 'all');
        } else {
            if (PHPlugins.PHWarehouse.isItemEnabled()) {
                this.addCommand(TextManager.item, 'item');
            }
            if (PHPlugins.PHWarehouse.isWeaponEnabled()) {
                this.addCommand(TextManager.weapon, 'weapon');
            }
            if (PHPlugins.PHWarehouse.isArmorEnabled()) {
                this.addCommand(TextManager.armor, 'armor');
            }
            if (PHPlugins.PHWarehouse.isKeyItemEnabled()) {
                this.addCommand(TextManager.keyItem, 'keyItem');
            }
        }
    };

    Window_WarehouseCategory.prototype.setItemWindow = function (itemWindow) {
        this._itemWindow = itemWindow;
        this.update();
    };

    Window_WarehouseCategory.prototype.update = function () {
        Window_ItemCategory.prototype.update.call(this);
        this.changeCategory();
        this._itemWindow.refresh();
    };



    function Window_WarehouseItemList() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_WarehouseItemList.prototype.constructor = Window_WarehouseItemList;

    Window_WarehouseItemList.prototype.initialize = function () {
        Window_ItemList.prototype.initialize.call(this, 0, this.fittingHeight(5), Graphics.boxWidth, Graphics.boxHeight - this.fittingHeight(7));
    };

    Window_WarehouseItemList.prototype.isCurrentItemEnabled = function () {
        if (this._data.length > 0) {
            if (PHPlugins.PHWarehouse._lastOption == 1 && PHPlugins.PHWarehouse.checkCapacity()) {
                return true;
            } else if (PHPlugins.PHWarehouse._lastOption == 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    };

    Window_WarehouseItemList.prototype.makeWarehouseItemList = function () {
        var data = PHPlugins.PHWarehouse.getItems();
        this._data = data.filter(function (item) {
            if (PHPlugins.Params.PHWarehouseAllTogether == true) {
                return this.includesWarehouseAll(item);
            } else {
                return this.includes(item);
            }
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    Window_WarehouseItemList.prototype.includesWarehouseAll = function (item) {
        return ((DataManager.isItem(item) && item.itypeId === 1) || (DataManager.isWeapon(item)) || (DataManager.isArmor(item)) || (DataManager.isItem(item) && item.itypeId === 2));
    };

    Window_WarehouseItemList.prototype.makeDepositAllItemList = function () {
        this._data = $gameParty.allItems();
    };

    Window_WarehouseItemList.prototype.loadItems = function () {

        // Deposit
        if (PHPlugins.PHWarehouse._lastOption == 1) {
            if (PHPlugins.Params.PHWarehouseAllTogether == true) {
                this.makeDepositAllItemList();
            } else {
                this.makeItemList();
            }
        }

        // Withdraw
        else if (PHPlugins.PHWarehouse._lastOption == 0) {
            this.makeWarehouseItemList();
        }

    };

    Window_WarehouseItemList.prototype.drawItem = function (index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();

            this.changePaintOpacity(PHPlugins.PHWarehouse.verifyItem(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);

            if (PHPlugins.PHWarehouse._lastOption == 1) {
                this.drawItemNumber(item, rect.x, rect.y, rect.width);
            } else if (PHPlugins.PHWarehouse._lastOption == 0) {
                this.drawWarehouseItemNumber(item, rect.x, rect.y, rect.width);
            }

            this.changePaintOpacity(1);
        }
    };

    Window_WarehouseItemList.prototype.drawWarehouseItemNumber = function (item, x, y, width) {
        var qtty = PHPlugins.PHWarehouse.getQuantity(item);
        if (typeof Yanfly !== "undefined") {
            this.contents.fontSize = Yanfly.Param.ItemQuantitySize;
            this.drawText('\u00d7' + qtty, x, y, width, 'right');
            this.resetFontSettings();
        } else {
            this.drawText(':', x, y, width - this.textWidth('00'), 'right');
            this.drawText(qtty, x, y, width, 'right');
        }
    };

    Window_WarehouseItemList.prototype.refresh = function () {
        this.contents.clear();
        this.loadItems();
        this.drawAllItems();
    };

    Window_WarehouseItemList.prototype.moveItem = function () {

        var item = this.item();

        // Deposit
        if (PHPlugins.PHWarehouse._lastOption == 1) {
            if (PHPlugins.PHWarehouse.checkCapacity() && PHPlugins.PHWarehouse.verifyItem(item)) {
                SoundManager.playEquip();
                PHPlugins.PHWarehouse.deposit(item);
                $gameParty.loseItem(item, 1);
            } else {
                SoundManager.playBuzzer();
            }
        }

        // Withdraw
        else if (PHPlugins.PHWarehouse._lastOption == 0) {
            if (PHPlugins.PHWarehouse.verifyItem(item)) {
                var numItems = $gameParty.numItems(item);
                $gameParty.gainItem(item, 1);
                if (numItems < $gameParty.numItems(item)) {
                    SoundManager.playEquip();
                    PHPlugins.PHWarehouse.withdraw(item);
                } else {
                    SoundManager.playBuzzer();
                }
            } else {
                SoundManager.playBuzzer();
            }
        }

    };

    Window_WarehouseItemList.prototype.playOkSound = function () { };



    function Window_WarehouseInfo() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseInfo.prototype = Object.create(Window_Base.prototype);
    Window_WarehouseInfo.prototype.constructor = Window_WarehouseInfo;

    Window_WarehouseInfo.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, Graphics.boxHeight - this.fittingHeight(1), Graphics.boxWidth, this.fittingHeight(1));
        this.availableSpaceText = PHPlugins.Params.PHWarehouseAvailableSpaceText + " ";
        this.refresh();
    };

    Window_WarehouseInfo.prototype.refresh = function () {
        this.contents.clear();
        this.availableSpaceValue = (PHPlugins.PHWarehouse._warehouses[PHPlugins.PHWarehouse._lastActive].maxCapacity - PHPlugins.PHWarehouse.getCurrentCapacity(PHPlugins.PHWarehouse._lastActive)) + " / " + PHPlugins.PHWarehouse._warehouses[PHPlugins.PHWarehouse._lastActive].maxCapacity;
        this.changeTextColor(this.normalColor());
        this.drawText(this.availableSpaceText + this.availableSpaceValue, 0, 0, this.x);
    };



    /* ---------------------------------------------------------- *
     *                        SCENE PROCESS                       *
     * ---------------------------------------------------------- */

    function Scene_Warehouse() {
        this.initialize.apply(this, arguments);
    }

    Scene_Warehouse.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Warehouse.prototype.constructor = Scene_Warehouse;

    Scene_Warehouse.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Warehouse.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);

        this.createTitle();
        this.createOptions();
        this.createCategory();
        this.createItemList();
        this.createInfoLocation();

    };

    Scene_Warehouse.prototype.createTitle = function () {
        this._titleWindow = new Window_WarehouseTitle();
        this.addWindow(this._titleWindow);
    };

    Scene_Warehouse.prototype.createOptions = function () {
        this._optionWindow = new Window_WarehouseOption();
        this._optionWindow.setHandler('cancel', this.popScene.bind(this));
        this._optionWindow.setHandler('ok', this.onOptionOk.bind(this));
        this.addWindow(this._optionWindow);
    };

    Scene_Warehouse.prototype.createCategory = function () {
        this._categoryWindow = new Window_WarehouseCategory();
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this.addWindow(this._categoryWindow);
    };

    Scene_Warehouse.prototype.createItemList = function () {
        this._itemWindow = new Window_WarehouseItemList();
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
    };

    Scene_Warehouse.prototype.createInfoLocation = function () {
        this._infoLocationWindow = new Window_WarehouseInfo();
        this.addWindow(this._infoLocationWindow);
    };

    Scene_Warehouse.prototype.onOptionOk = function () {
        this._optionWindow.changeOption();
        this._categoryWindow.activate();
        this._categoryWindow.select(0);
        this._optionWindow.deactivate();
    };

    Scene_Warehouse.prototype.onCategoryOk = function () {
        this._itemWindow.activate();
        if (this._itemWindow._data.length > 0) {
            this._itemWindow.select(0);
        }
        this._categoryWindow.deactivate();
    };

    Scene_Warehouse.prototype.onCategoryCancel = function () {
        this._categoryWindow.deselect();
        this._optionWindow.activate();
    };

    Scene_Warehouse.prototype.onItemCancel = function () {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    };

    Scene_Warehouse.prototype.onItemOk = function () {
        this._itemWindow.moveItem();
        this._infoLocationWindow.refresh();
        this._itemWindow.activate();
    };

})();