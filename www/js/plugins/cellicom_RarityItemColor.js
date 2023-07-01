//=============================================================================
// Rarity Item color
//=============================================================================

/*:
 * @plugindesc Change Items and Weapons color based on rarity value in notetag
 * @author cellicom
 *
 *
 * @help Change Items and Weapons color based on rarity value in notetag
 *
 * <rarity: x>
 *
 * x = Level of rarity
 *
 * Examples of rarity grade
 * 0 = Common
 * 1 = Uncommon
 * 2 = Rare
 * 3 = Legendary
 * 4 = Sets
 * 5 = Special
 *
 * @param Rarity 0
 * @desc Color of Common Item (Default: 0) White
 * @default 0
 *
 * @param Rarity 1
 * @desc Color of Uncommon Item (Default: 1) Blue
 * @default 4
 *
 * @param Rarity 2
 * @desc Color of Rare Item (Default: 6) Yellow
 * @default 6
 *
 * @param Rarity 3
 * @desc Color of Legendary Item (Default: 20) Orange
 * @default 2
 *
 * @param Rarity 4
 * @desc Color of Sets Item (Default: 3) Green
 * @default 3
 *
 * @param Rarity 5
 * @desc Color of Special Item (Default: 30) Purple
 * @default 30
 *
 * @param Rarity Escape Code
 * @desc Escape code for message. Example of Rarity 2 \CR[2]  (Default: CR)
 * @default CR
 *
 * @param ==YANFLY PATCH==
 * @desc
 * @default
 *
 * @param YANFLY_SLOT_PATCH
 * @desc If you use "YEP_X_ItemUpgradeSlots.js", after insert item into slot, keeps item color in list. (Default: false)
 * @default false
 */

var Imported = Imported || {};
Imported.cellicom_RarityItemColor = true;

var cellicom = cellicom || {};
cellicom.rarityColors = [];

//setRarity
cellicom.setRarity = function (value, item) {
	if (typeof (item.meta.rarity) == 'undefined') {
		item.meta.rarity = 0;
	}
	var rarity = parseInt(item.meta.rarity);
	console.log(rarity);
	if (rarity < value) {
		item.meta.rarity = value;
	}
	return item;
};
//DrawRarityYanflyItemSlot
cellicom.DrawRarityYanflyItemSlot = function (item) {
	var rarity = parseInt(item.meta.rarity);
	var colore = cellicom.rarityColors[0];

	if (rarity < cellicom.rarityColors.length) {
		colore = cellicom.rarityColors[rarity];
	}

	return '\\C[' + colore + ']';
};

(function () {

	//parameters
	var parameters = PluginManager.parameters('cellicom_RarityItemColor');
	cellicom.rarityColors = [];
	cellicom.rarityColors.push(Number(parameters['Rarity 0']) || 0);
	cellicom.rarityColors.push(Number(parameters['Rarity 1']) || 4);
	cellicom.rarityColors.push(Number(parameters['Rarity 2']) || 6);
	cellicom.rarityColors.push(Number(parameters['Rarity 3']) || 2);
	cellicom.rarityColors.push(Number(parameters['Rarity 4']) || 3);
	cellicom.rarityColors.push(Number(parameters['Rarity 5']) || 30);

	var rarityEscapeCode = String(parameters['Rarity Escape Code'] || null);
	var rarityEscapeCodePattern = rarityEscapeCode ? new RegExp('\\x1b' + rarityEscapeCode + '\\[(\\d+)\\]', 'gi') : null;

	var YANFLY_SLOT_PATCH = parameters['YANFLY_SLOT_PATCH'] || "false";
	YANFLY_SLOT_PATCH.toLowerCase();

	//color the name
	Window_Base.prototype.drawItemName = function (item, x, y, width) {
		width = width || 312;
		if (item) {
			var iconBoxWidth = Window_Base._iconWidth + 4;
			this.resetTextColor();
			this.drawIcon(item.iconIndex, x + 2, y + 2);
			if (typeof item.meta.rarity !== "undefined") {
				var rarity = parseInt(item.meta.rarity);
				if (rarity < cellicom.rarityColors.length) {
					this.changeTextColor(this.textColor(cellicom.rarityColors[rarity]));
				}
				else {
					cellicom.setRarity(0);
					this.changeTextColor(this.textColor(0));
				}
			}
			else {
				this.resetTextColor();
			}
			this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
			this.resetTextColor();
		};
	};

	//Add Escape code
	var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
	Window_Message.prototype.processEscapeCharacter = function (code, textState) {
		switch (code) {
			case rarityEscapeCode:
				this.changeTextColor(this.textColor(cellicom.rarityColors[this.obtainEscapeParam(textState)]));
				break;
			default:
				_Window_Message_processEscapeCharacter.call(this, code, textState);
				break;
		}
	};

	//YANFLY SLOT PATCH
	if (YANFLY_SLOT_PATCH == 'true') {

		if (typeof (ItemManager) != 'undefined') {

			ItemManager.addIUSLine = function (mainItem, effectItem) {
				if (!mainItem.slotsApplied) this.initSlotUpgradeNotes(mainItem);
				var line = '\\i[' + effectItem.iconIndex + ']' + cellicom.DrawRarityYanflyItemSlot(effectItem) + effectItem.name;
				mainItem.slotsApplied.push(line);
				mainItem.slotsAppliedItemId.push(effectItem.id);
			};
		}

	}


})();