//=============================================================================
// SNZ_randomXorshift.js
//=============================================================================

/*:
 * @plugindesc ランダムに何かをする処理の精度を上げます　Xorshiftと呼ばれるアルゴリズムを使用
 *
 * @author しんぞ
 *
 * @help ※本プラグインはxorshift.jsという汎用JSプラグインを使用しています
 * xorshift.jsはMITライセンスでAndreas Madsen氏より提供されています
 * 本プラグインもMITライセンスとします
 * this plugin includs xorshift.js by Mr.Andreas Madsen.
 * xorshift.js and SNZ_randomXorshift.js is licensed under "MIT".
 * コアスクリプトで宣言されている関数Math.randomIntは
 * 精度が低い（似たような数値ばかり出る）と不評なMath.randomをそのまま使ってしまっているので
 * 他の方法で上書きしてみました
 * ランダムに何かをするプラグインより上に配置してください
 * 使用転載改変ご自由にどうぞ
 */
(function () {
  var module = {};
  /**
   * Create a pseudorandom number generator, with a seed.
   * @param {array} seed "128-bit" integer, composed of 4x32-bit
   * integers in big endian order.
   */
  function XorShift(seed) {
    // Note the extension, this === module.exports is required because
    // the `constructor` function will be used to generate new instances.
    // In that case `this` will point to the default RNG, and `this` will
    // be an instance of XorShift.
    if (!(this instanceof XorShift) || this === module.exports) {
      return new XorShift(seed);
    }

    if (!Array.isArray(seed) || seed.length !== 4) {
      throw new TypeError("seed must be an array with 4 numbers");
    }

    // uint64_t s = [seed ...]
    this._state0U = seed[0] | 0;
    this._state0L = seed[1] | 0;
    this._state1U = seed[2] | 0;
    this._state1L = seed[3] | 0;
  }

  /**
   * Returns a 64bit random number as a 2x32bit array
   * @return {array}
   */
  XorShift.prototype.randomint = function () {
    // uint64_t s1 = s[0]
    var s1U = this._state0U,
      s1L = this._state0L;
    // uint64_t s0 = s[1]
    var s0U = this._state1U,
      s0L = this._state1L;

    // result = s0 + s1
    var sumL = (s0L >>> 0) + (s1L >>> 0);
    resU = (s0U + s1U + ((sumL / 2) >>> 31)) >>> 0;
    resL = sumL >>> 0;

    // s[0] = s0
    this._state0U = s0U;
    this._state0L = s0L;

    // - t1 = [0, 0]
    var t1U = 0,
      t1L = 0;
    // - t2 = [0, 0]
    var t2U = 0,
      t2L = 0;

    // s1 ^= s1 << 23;
    // :: t1 = s1 << 23
    var a1 = 23;
    var m1 = 0xffffffff << (32 - a1);
    t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
    t1L = s1L << a1;
    // :: s1 = s1 ^ t1
    s1U = s1U ^ t1U;
    s1L = s1L ^ t1L;

    // t1 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
    // :: t1 = s1 ^ s0
    t1U = s1U ^ s0U;
    t1L = s1L ^ s0L;
    // :: t2 = s1 >> 18
    var a2 = 18;
    var m2 = 0xffffffff >>> (32 - a2);
    t2U = s1U >>> a2;
    t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
    // :: t1 = t1 ^ t2
    t1U = t1U ^ t2U;
    t1L = t1L ^ t2L;
    // :: t2 = s0 >> 5
    var a3 = 5;
    var m3 = 0xffffffff >>> (32 - a3);
    t2U = s0U >>> a3;
    t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
    // :: t1 = t1 ^ t2
    t1U = t1U ^ t2U;
    t1L = t1L ^ t2L;

    // s[1] = t1
    this._state1U = t1U;
    this._state1L = t1L;

    // return result
    return [resU, resL];
  };

  /**
   * Returns a random number normalized [0, 1), just like Math.random()
   * @return {number}
   */
  var CONVERTION_BUFFER = new ArrayBuffer(8);
  var CONVERTION_VIEW = new DataView(CONVERTION_BUFFER);

  XorShift.prototype.random = function () {
    // :: t2 = randomint()
    var t2 = this.randomint();
    var t2U = t2[0];
    var t2L = t2[1];

    // :: e = UINT64_C(0x3FF) << 52
    var eU = 0x3ff << (52 - 32);
    var eL = 0;

    // :: s = t2 >> 12
    var a1 = 12;
    var m1 = 0xffffffff >>> (32 - a1);
    sU = t2U >>> a1;
    sL = (t2L >>> a1) | ((t2U & m1) << (32 - a1));

    // :: x = e | s
    var xU = eU | sU;
    var xL = eL | sL;

    // :: double d = *((double *)&x)
    CONVERTION_VIEW.setUint32(0, xU);
    CONVERTION_VIEW.setUint32(4, xL);
    //  console.log(CONVERTION_VIEW);
    var d = CONVERTION_VIEW.getFloat64(0);

    // :: d - 1
    return d - 1;
  };

  // There is nothing particularly scientific about this seed, it is just
  // based on the clock.
  module.exports = new XorShift([0, Date.now() / 65536, 0, Date.now() % 65536]);

  // Perform 20 iterations in the RNG, this prevens a short seed from generating
  // pseudo predictable number.
  (function () {
    var rng = module.exports;
    for (var i = 0; i < 20; i++) {
      rng.randomint();
    }
  })();
  Math.randomInt = function (max) {
    return Math.floor(max * module.exports.random());
  };
})();
