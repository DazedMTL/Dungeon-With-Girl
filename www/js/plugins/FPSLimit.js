//=============================================================================
// FPSLimit.js
//=============================================================================

/*:
 * @plugindesc Limits game refresh rate
 * @author ocean pollen
 *
 * @param FPS Limit
 * @desc For a 20FPS limit, set this to 20, etc.
 * Default: 60
 * @default 60
 *
 * @help This plugin does not provide plugin commands.
 */

(function () {
  var desiredFPS = Number(PluginManager.parameters("FPSLimit")["FPS Limit"]),
    frameLimit = 1000 / desiredFPS,
    nextUpdate = 0,
    timeout = null;

  SceneManager.requestUpdate = function () {
    if (!this._stopped) {
      var now = Date.now();
      if (now >= nextUpdate) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        nextUpdate = now + frameLimit;
        requestAnimationFrame(this.update.bind(this));
      } else {
        var that = this;
        timeout = setTimeout(function () {
          nextUpdate = Date.now() + frameLimit;
          requestAnimationFrame(that.update.bind(that));
        }, nextUpdate - now);
      }
    }
  };
})();
