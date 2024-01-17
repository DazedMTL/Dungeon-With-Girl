(() => {
  "use strict";

  function Spriteset_MoveContainerMixIn(spriteset) {
    const _updatePosition = spriteset.updatePosition;
    spriteset.updatePosition = function () {
      _updatePosition.call(this);
      this._pictureContainer.x = $gameVariables.value(188);
      this._pictureContainer.y = $gameVariables.value(189);
    };
  }

  Spriteset_MoveContainerMixIn(Spriteset_Base.prototype);
})();
