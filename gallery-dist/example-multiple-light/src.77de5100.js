// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../../node_modules/@thi.ng/hdom/api.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG = false;

},{}],"../../../node_modules/@thi.ng/api/api.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EPS = 1e-6;
exports.EVENT_ALL = "*";
exports.EVENT_ENABLE = "enable";
exports.EVENT_DISABLE = "disable";
exports.SEMAPHORE = Symbol();

},{}],"../../../node_modules/@thi.ng/equiv/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OBJP = Object.getPrototypeOf({});
const FN = "function";
const STR = "string";
exports.equiv = (a, b) => {
    let proto;
    if (a === b) {
        return true;
    }
    if (a != null) {
        if (typeof a.equiv === FN) {
            return a.equiv(b);
        }
    }
    else {
        return a == b;
    }
    if (b != null) {
        if (typeof b.equiv === FN) {
            return b.equiv(a);
        }
    }
    else {
        return a == b;
    }
    if (typeof a === STR || typeof b === STR) {
        return false;
    }
    if ((proto = Object.getPrototypeOf(a), proto == null || proto === OBJP) &&
        (proto = Object.getPrototypeOf(b), proto == null || proto === OBJP)) {
        return exports.equivObject(a, b);
    }
    if (typeof a !== FN && a.length !== undefined &&
        typeof b !== FN && b.length !== undefined) {
        return exports.equivArrayLike(a, b);
    }
    if (a instanceof Set && b instanceof Set) {
        return exports.equivSet(a, b);
    }
    if (a instanceof Map && b instanceof Map) {
        return exports.equivMap(a, b);
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }
    // NaN
    return (a !== a && b !== b);
};
exports.equivArrayLike = (a, b, _equiv = exports.equiv) => {
    let l = a.length;
    if (l === b.length) {
        while (--l >= 0 && _equiv(a[l], b[l]))
            ;
    }
    return l < 0;
};
exports.equivSet = (a, b, _equiv = exports.equiv) => (a.size === b.size) &&
    _equiv([...a.keys()].sort(), [...b.keys()].sort());
exports.equivMap = (a, b, _equiv = exports.equiv) => (a.size === b.size) &&
    _equiv([...a].sort(), [...b].sort());
exports.equivObject = (a, b, _equiv = exports.equiv) => {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for (let k in a) {
        if (!b.hasOwnProperty(k) || !_equiv(a[k], b[k])) {
            return false;
        }
    }
    return true;
};

},{}],"../../../node_modules/@thi.ng/diff/array.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equiv_1 = require("@thi.ng/equiv");
let _cachedFP;
let _cachedPath;
let _cachedEPC = [];
let _cachedPathPos = [];
const cachedFP = (size) => _cachedFP && _cachedFP.length >= size ?
    _cachedFP :
    (_cachedFP = new Int32Array(size));
const cachedPath = (size) => _cachedPath && _cachedPath.length >= size ?
    _cachedPath :
    (_cachedPath = new Int32Array(size));
const simpleDiff = (state, src, key, logDir, mode) => {
    const n = src.length;
    const linear = state.linear;
    state.distance = n;
    if (mode !== 0 /* ONLY_DISTANCE */) {
        for (let i = 0, j = 0; i < n; i++, j += 3) {
            linear[j] = logDir;
            linear[j + 1] = i;
            linear[j + 2] = src[i];
        }
        if (mode === 2 /* FULL */) {
            const _state = state[key];
            for (let i = 0; i < n; i++) {
                _state[i] = src[i];
            }
        }
    }
    return state;
};
/**
 * Based on "An O(NP) Sequence Comparison Algorithm""
 * by Wu, Manber, Myers and Miller
 *
 * - http://www.itu.dk/stud/speciale/bepjea/xwebtex/litt/an-onp-sequence-comparison-algorithm.pdf
 * - https://github.com/cubicdaiya/onp
 *
 * Various optimizations, fixes & refactorings.
 * By default uses `@thi.ng/equiv` for equality checks.
 *
 * @param a "old" array
 * @param b "new" array
 * @param mode result mode
 * @param equiv equality predicate function
 */
exports.diffArray = (a, b, mode = 2 /* FULL */, equiv = equiv_1.equiv) => {
    const state = {
        distance: 0,
        adds: {},
        dels: {},
        const: {},
        linear: []
    };
    if (a === b || (a == null && b == null)) {
        return state;
    }
    else if (a == null || a.length === 0) {
        return simpleDiff(state, b, "adds", 1, mode);
    }
    else if (b == null || b.length === 0) {
        return simpleDiff(state, a, "dels", -1, mode);
    }
    const reverse = a.length >= b.length;
    let _a, _b, na, nb;
    if (reverse) {
        _a = b;
        _b = a;
    }
    else {
        _a = a;
        _b = b;
    }
    na = _a.length;
    nb = _b.length;
    const offset = na + 1;
    const delta = nb - na;
    const doff = delta + offset;
    const size = na + nb + 3;
    const path = cachedPath(size).fill(-1, 0, size);
    const fp = cachedFP(size).fill(-1, 0, size);
    const epc = _cachedEPC;
    const pathPos = _cachedPathPos;
    epc.length = 0;
    pathPos.length = 0;
    const snake = (k, p, pp) => {
        const koff = k + offset;
        let r, y;
        if (p > pp) {
            r = path[koff - 1];
            y = p;
        }
        else {
            r = path[koff + 1];
            y = pp;
        }
        let x = y - k;
        while (x < na && y < nb && equiv(_a[x], _b[y])) {
            x++;
            y++;
        }
        path[koff] = pathPos.length / 3;
        pathPos.push(x, y, r);
        return y;
    };
    let p = -1, k, ko;
    do {
        p++;
        for (k = -p, ko = k + offset; k < delta; k++, ko++) {
            fp[ko] = snake(k, fp[ko - 1] + 1, fp[ko + 1]);
        }
        for (k = delta + p, ko = k + offset; k > delta; k--, ko--) {
            fp[ko] = snake(k, fp[ko - 1] + 1, fp[ko + 1]);
        }
        fp[doff] = snake(delta, fp[doff - 1] + 1, fp[doff + 1]);
    } while (fp[doff] !== nb);
    state.distance = delta + 2 * p;
    if (mode !== 0 /* ONLY_DISTANCE */) {
        p = path[doff] * 3;
        while (p >= 0) {
            epc.push(p);
            p = pathPos[p + 2] * 3;
        }
        if (mode === 2 /* FULL */) {
            buildFullLog(epc, pathPos, state, _a, _b, reverse);
        }
        else {
            buildLinearLog(epc, pathPos, state, _a, _b, reverse);
        }
    }
    return state;
};
const buildFullLog = (epc, pathPos, state, a, b, reverse) => {
    const linear = state.linear;
    const _const = state.const;
    let i = epc.length, px = 0, py = 0;
    let adds, dels, aID, dID;
    if (reverse) {
        adds = state.dels;
        dels = state.adds;
        aID = -1;
        dID = 1;
    }
    else {
        adds = state.adds;
        dels = state.dels;
        aID = 1;
        dID = -1;
    }
    for (; --i >= 0;) {
        const e = epc[i];
        const ppx = pathPos[e];
        const ppy = pathPos[e + 1];
        const d = ppy - ppx;
        while (px < ppx || py < ppy) {
            const dp = py - px;
            if (d > dp) {
                linear.push(aID, py, adds[py] = b[py]);
                py++;
            }
            else if (d < dp) {
                linear.push(dID, px, dels[px] = a[px]);
                px++;
            }
            else {
                linear.push(0, px, _const[px] = a[px]);
                px++;
                py++;
            }
        }
    }
};
const buildLinearLog = (epc, pathPos, state, a, b, reverse) => {
    const linear = state.linear;
    const aID = reverse ? -1 : 1;
    const dID = reverse ? 1 : -1;
    let i = epc.length, px = 0, py = 0;
    for (; --i >= 0;) {
        const e = epc[i];
        const ppx = pathPos[e];
        const ppy = pathPos[e + 1];
        const d = ppy - ppx;
        while (px < ppx || py < ppy) {
            const dp = py - px;
            if (d > dp) {
                linear.push(aID, py, b[py]);
                py++;
            }
            else if (d < dp) {
                linear.push(dID, px, a[px]);
                px++;
            }
            else {
                linear.push(0, px, a[px]);
                px++;
                py++;
            }
        }
    }
};

},{"@thi.ng/equiv":"../../../node_modules/@thi.ng/equiv/index.js"}],"../../../node_modules/@thi.ng/diff/object.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equiv_1 = require("@thi.ng/equiv");
exports.diffObject = (a, b, mode = 2 /* FULL */, _equiv = equiv_1.equiv) => a === b ?
    { distance: 0 } :
    mode === 0 /* ONLY_DISTANCE */ ?
        diffObjectDist(a, b, _equiv) :
        diffObjectFull(a, b, _equiv);
const diffObjectDist = (a, b, _equiv) => {
    let d = 0;
    for (let k in a) {
        const vb = b[k];
        (vb === undefined || !_equiv(a[k], vb)) && d++;
    }
    for (let k in b) {
        !(k in a) && d++;
    }
    return { distance: d };
};
const diffObjectFull = (a, b, _equiv) => {
    let d = 0;
    const adds = [];
    const dels = [];
    const edits = [];
    for (let k in a) {
        const vb = b[k];
        if (vb === undefined) {
            dels.push(k);
            d++;
        }
        else if (!_equiv(a[k], vb)) {
            edits.push(k, vb);
            d++;
        }
    }
    for (let k in b) {
        if (!(k in a)) {
            adds.push(k);
            d++;
        }
    }
    return { distance: d, adds, dels, edits };
};

},{"@thi.ng/equiv":"../../../node_modules/@thi.ng/equiv/index.js"}],"../../../node_modules/@thi.ng/hdom/diff.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@thi.ng/api/api");
const array_1 = require("@thi.ng/diff/array");
const object_1 = require("@thi.ng/diff/object");
const equiv_1 = require("@thi.ng/equiv");
const isArray = Array.isArray;
const max = Math.max;
// child index tracking template buffer
const INDEX = (() => {
    const res = new Array(2048);
    for (let i = 2, n = res.length; i < n; i++) {
        res[i] = i - 2;
    }
    return res;
})();
const buildIndex = (n) => {
    if (n <= INDEX.length) {
        return INDEX.slice(0, n);
    }
    const res = new Array(n);
    while (--n >= 2) {
        res[n] = n - 2;
    }
    return res;
};
/**
 * See `HDOMImplementation` interface for further details.
 *
 * @param opts
 * @param impl hdom implementation
 * @param parent
 * @param prev previous tree
 * @param curr current tree
 * @param child child index
 */
exports.diffTree = (opts, impl, parent, prev, curr, child = 0) => {
    const attribs = curr[1];
    if (attribs.__skip) {
        return;
    }
    // always replace element if __diff = false
    if (attribs.__diff === false) {
        exports.releaseTree(prev);
        impl.replaceChild(opts, parent, child, curr);
        return;
    }
    // delegate to branch-local implementation
    let _impl = attribs.__impl;
    if (_impl && _impl !== impl) {
        return _impl.diffTree(opts, _impl, parent, prev, curr, child);
    }
    const delta = array_1.diffArray(prev, curr, 1 /* ONLY_DISTANCE_LINEAR */, exports.equiv);
    if (delta.distance === 0) {
        return;
    }
    const edits = delta.linear;
    const el = impl.getChild(parent, child);
    let i;
    let ii;
    let j;
    let idx;
    let k;
    let eq;
    let status;
    let val;
    if (edits[0] !== 0 || prev[1].key !== attribs.key) {
        // DEBUG && console.log("replace:", prev, curr);
        exports.releaseTree(prev);
        impl.replaceChild(opts, parent, child, curr);
        return;
    }
    if ((val = prev.__release) && val !== curr.__release) {
        exports.releaseTree(prev);
    }
    if (edits[3] !== 0) {
        exports.diffAttributes(impl, el, prev[1], curr[1]);
        // if attribs changed & distance == 2 then we're done here...
        if (delta.distance === 2) {
            return;
        }
    }
    const numEdits = edits.length;
    const prevLength = prev.length - 1;
    const equivKeys = extractEquivElements(edits);
    const offsets = buildIndex(prevLength + 1);
    for (i = 2, ii = 6; ii < numEdits; i++, ii += 3) {
        status = edits[ii];
        if (status === -1) {
            // element removed / edited?
            val = edits[ii + 2];
            if (isArray(val)) {
                k = val[1].key;
                if (k !== undefined && equivKeys[k][2] !== undefined) {
                    eq = equivKeys[k];
                    k = eq[0];
                    // DEBUG && console.log(`diff equiv key @ ${k}:`, prev[k], curr[eq[2]]);
                    exports.diffTree(opts, impl, el, prev[k], curr[eq[2]], offsets[k]);
                }
                else {
                    idx = edits[ii + 1];
                    // DEBUG && console.log("remove @", offsets[idx], val);
                    exports.releaseTree(val);
                    impl.removeChild(el, offsets[idx]);
                    for (j = prevLength; j >= idx; j--) {
                        offsets[j] = max(offsets[j] - 1, 0);
                    }
                }
            }
            else if (typeof val === "string") {
                impl.setContent(el, "");
            }
        }
        else if (status === 1) {
            // element added/inserted?
            val = edits[ii + 2];
            if (typeof val === "string") {
                impl.setContent(el, val);
            }
            else if (isArray(val)) {
                k = val[1].key;
                if (k === undefined || equivKeys[k][0] === undefined) {
                    idx = edits[ii + 1];
                    // DEBUG && console.log("insert @", offsets[idx], val);
                    impl.createTree(opts, el, val, offsets[idx]);
                    for (j = prevLength; j >= idx; j--) {
                        offsets[j]++;
                    }
                }
            }
        }
    }
    // call __init after all children have been added/updated
    if ((val = curr.__init) && val != prev.__init) {
        val.apply(curr, [el, ...(curr.__args)]);
    }
};
/**
 * Helper function for `diffTree()` to compute & apply the difference
 * between a node's `prev` and `curr` attributes.
 *
 * @param impl
 * @param el
 * @param prev
 * @param curr
 */
exports.diffAttributes = (impl, el, prev, curr) => {
    const delta = object_1.diffObject(prev, curr, 2 /* FULL */, equiv_1.equiv);
    impl.removeAttribs(el, delta.dels, prev);
    let val = api_1.SEMAPHORE;
    let i, e, edits;
    for (edits = delta.edits, i = edits.length; (i -= 2) >= 0;) {
        const a = edits[i];
        if (a.indexOf("on") === 0) {
            impl.removeAttribs(el, [a], prev);
        }
        if (a !== "value") {
            impl.setAttrib(el, a, edits[i + 1], curr);
        }
        else {
            val = edits[i + 1];
        }
    }
    for (edits = delta.adds, i = edits.length; --i >= 0;) {
        e = edits[i];
        if (e !== "value") {
            impl.setAttrib(el, e, curr[e], curr);
        }
        else {
            val = curr[e];
        }
    }
    if (val !== api_1.SEMAPHORE) {
        impl.setAttrib(el, "value", val, curr);
    }
};
/**
 * Recursively attempts to call the `release` lifecycle method on every
 * element in given tree (branch), using depth-first descent. Each
 * element is checked for the presence of the `__release` control
 * attribute. If (and only if) it is set to `false`, further descent
 * into that element's branch is skipped.
 *
 * @param tag
 */
exports.releaseTree = (tag) => {
    if (isArray(tag)) {
        let x;
        if ((x = tag[1]) && x.__release === false) {
            return;
        }
        if (tag.__release) {
            // DEBUG && console.log("call __release", tag);
            tag.__release.apply(tag.__this, tag.__args);
            delete tag.__release;
        }
        for (x = tag.length; --x >= 2;) {
            exports.releaseTree(tag[x]);
        }
    }
};
const extractEquivElements = (edits) => {
    let k;
    let val;
    let ek;
    const equiv = {};
    for (let i = edits.length; (i -= 3) >= 0;) {
        val = edits[i + 2];
        if (isArray(val) && (k = val[1].key) !== undefined) {
            ek = equiv[k];
            !ek && (equiv[k] = ek = [, ,]);
            ek[edits[i] + 1] = edits[i + 1];
        }
    }
    return equiv;
};
const OBJP = Object.getPrototypeOf({});
const FN = "function";
const STR = "string";
/**
 * Customized version @thi.ng/equiv which takes `__diff` attributes into
 * account (at any nesting level). If an hdom element's attribute object
 * contains `__diff: false`, the object will ALWAYS be considered
 * unequal, even if all other attributes in the object are equivalent.
 *
 * @param a
 * @param b
 */
exports.equiv = (a, b) => {
    let proto;
    if (a === b) {
        return true;
    }
    if (a != null) {
        if (typeof a.equiv === FN) {
            return a.equiv(b);
        }
    }
    else {
        return a == b;
    }
    if (b != null) {
        if (typeof b.equiv === FN) {
            return b.equiv(a);
        }
    }
    else {
        return a == b;
    }
    if (typeof a === STR || typeof b === STR) {
        return false;
    }
    if ((proto = Object.getPrototypeOf(a), proto == null || proto === OBJP) &&
        (proto = Object.getPrototypeOf(b), proto == null || proto === OBJP)) {
        return !(a.__diff === false || b.__diff === false) &&
            equiv_1.equivObject(a, b, exports.equiv);
    }
    if (typeof a !== FN && a.length !== undefined &&
        typeof b !== FN && b.length !== undefined) {
        return equiv_1.equivArrayLike(a, b, exports.equiv);
    }
    if (a instanceof Set && b instanceof Set) {
        return equiv_1.equivSet(a, b, exports.equiv);
    }
    if (a instanceof Map && b instanceof Map) {
        return equiv_1.equivMap(a, b, exports.equiv);
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }
    // NaN
    return (a !== a && b !== b);
};

},{"@thi.ng/api/api":"../../../node_modules/@thi.ng/api/api.js","@thi.ng/diff/array":"../../../node_modules/@thi.ng/diff/array.js","@thi.ng/diff/object":"../../../node_modules/@thi.ng/diff/object.js","@thi.ng/equiv":"../../../node_modules/@thi.ng/equiv/index.js"}],"../../../node_modules/@thi.ng/checks/is-array.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray;

},{}],"../../../node_modules/@thi.ng/checks/is-not-string-iterable.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNotStringAndIterable(x) {
    return x != null &&
        typeof x !== "string" &&
        typeof x[Symbol.iterator] === "function";
}
exports.isNotStringAndIterable = isNotStringAndIterable;

},{}],"../../../node_modules/@thi.ng/hiccup/api.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVG_NS = "http://www.w3.org/2000/svg";
exports.XLINK_NS = "http://www.w3.org/1999/xlink";
exports.TAG_REGEXP = /^([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?$/;
// tslint:disable-next-line
exports.SVG_TAGS = "animate animateColor animateMotion animateTransform circle clipPath color-profile defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font foreignObject g image line linearGradient marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop style svg switch symbol text textPath title tref tspan use view"
    .split(" ")
    .reduce((acc, x) => (acc[x] = 1, acc), {});
// tslint:disable-next-line
exports.VOID_TAGS = "area base br circle col command ellipse embed hr img input keygen line link meta param path polygon polyline rect source stop track use wbr"
    .split(" ")
    .reduce((acc, x) => (acc[x] = 1, acc), {});
exports.ENTITIES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
};
exports.COMMENT = "__COMMENT__";
exports.NO_SPANS = {
    button: 1,
    option: 1,
    text: 1,
    textarea: 1,
};
exports.ENTITY_RE = new RegExp(`[${Object.keys(exports.ENTITIES)}]`, "g");

},{}],"../../../node_modules/@thi.ng/checks/is-function.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === "function";
}
exports.isFunction = isFunction;

},{}],"../../../node_modules/@thi.ng/hiccup/css.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_function_1 = require("@thi.ng/checks/is-function");
exports.css = (rules) => {
    let css = "", v;
    for (let r in rules) {
        v = rules[r];
        if (is_function_1.isFunction(v)) {
            v = v(rules);
        }
        v != null && (css += `${r}:${v};`);
    }
    return css;
};

},{"@thi.ng/checks/is-function":"../../../node_modules/@thi.ng/checks/is-function.js"}],"../../../node_modules/@thi.ng/hdom/dom.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isa = require("@thi.ng/checks/is-array");
const isi = require("@thi.ng/checks/is-not-string-iterable");
const api_1 = require("@thi.ng/hiccup/api");
const css_1 = require("@thi.ng/hiccup/css");
const isArray = isa.isArray;
const isNotStringAndIterable = isi.isNotStringAndIterable;
/**
 * See `HDOMImplementation` interface for further details.
 *
 * @param opts
 * @param parent
 * @param tree
 * @param insert
 */
exports.createTree = (opts, impl, parent, tree, insert) => {
    if (isArray(tree)) {
        const tag = tree[0];
        if (typeof tag === "function") {
            return exports.createTree(opts, impl, parent, tag.apply(null, [opts.ctx, ...tree.slice(1)]), insert);
        }
        const attribs = tree[1];
        if (attribs.__impl) {
            return attribs.__impl
                .createTree(opts, parent, tree, insert);
        }
        const el = impl.createElement(parent, tag, attribs, insert);
        if (tree.length > 2) {
            const n = tree.length;
            for (let i = 2; i < n; i++) {
                exports.createTree(opts, impl, el, tree[i]);
            }
        }
        if (tree.__init) {
            tree.__init.apply(tree.__this, [el, ...tree.__args]);
        }
        return el;
    }
    if (isNotStringAndIterable(tree)) {
        const res = [];
        for (let t of tree) {
            res.push(exports.createTree(opts, impl, parent, t));
        }
        return res;
    }
    if (tree == null) {
        return parent;
    }
    return impl.createTextElement(parent, tree);
};
/**
 * See `HDOMImplementation` interface for further details.
 *
 * @param opts
 * @param parent
 * @param tree
 * @param index
 */
exports.hydrateTree = (opts, impl, parent, tree, index = 0) => {
    if (isArray(tree)) {
        const el = impl.getChild(parent, index);
        if (typeof tree[0] === "function") {
            exports.hydrateTree(opts, impl, parent, tree[0].apply(null, [opts.ctx, ...tree.slice(1)]), index);
        }
        const attribs = tree[1];
        if (attribs.__impl) {
            return attribs.__impl
                .hydrateTree(opts, parent, tree, index);
        }
        if (tree.__init) {
            tree.__init.apply(tree.__this, [el, ...tree.__args]);
        }
        for (let a in attribs) {
            if (a.indexOf("on") === 0) {
                impl.setAttrib(el, a, attribs[a]);
            }
        }
        for (let n = tree.length, i = 2; i < n; i++) {
            exports.hydrateTree(opts, impl, el, tree[i], i - 2);
        }
    }
    else if (isNotStringAndIterable(tree)) {
        for (let t of tree) {
            exports.hydrateTree(opts, impl, parent, t, index);
            index++;
        }
    }
};
/**
 * Creates a new DOM element of type `tag` with optional `attribs`. If
 * `parent` is not `null`, the new element will be inserted as child at
 * given `insert` index. If `insert` is missing, the element will be
 * appended to the `parent`'s list of children. Returns new DOM node.
 *
 * If `tag` is a known SVG element name, the new element will be created
 * with the proper SVG XML namespace.
 *
 * @param parent
 * @param tag
 * @param attribs
 * @param insert
 */
exports.createElement = (parent, tag, attribs, insert) => {
    const el = api_1.SVG_TAGS[tag] ?
        document.createElementNS(api_1.SVG_NS, tag) :
        document.createElement(tag);
    if (parent) {
        if (insert == null) {
            parent.appendChild(el);
        }
        else {
            parent.insertBefore(el, parent.children[insert]);
        }
    }
    if (attribs) {
        exports.setAttribs(el, attribs);
    }
    return el;
};
exports.createTextElement = (parent, content, insert) => {
    const el = document.createTextNode(content);
    if (parent) {
        if (insert === undefined) {
            parent.appendChild(el);
        }
        else {
            parent.insertBefore(el, parent.children[insert]);
        }
    }
    return el;
};
exports.getChild = (parent, child) => parent.children[child];
exports.replaceChild = (opts, impl, parent, child, tree) => (impl.removeChild(parent, child),
    impl.createTree(opts, parent, tree, child));
exports.cloneWithNewAttribs = (el, attribs) => {
    const res = el.cloneNode(true);
    exports.setAttribs(res, attribs);
    el.parentNode.replaceChild(res, el);
    return res;
};
exports.setContent = (el, body) => el.textContent = body;
exports.setAttribs = (el, attribs) => {
    for (let k in attribs) {
        exports.setAttrib(el, k, attribs[k], attribs);
    }
    return el;
};
/**
 * Sets a single attribute on given element. If attrib name is NOT an
 * event name (prefix: "on") and its value is a function, it is called
 * with given `attribs` object (usually the full attrib object passed to
 * `setAttribs`) and the function's return value is used as the actual
 * attrib value.
 *
 * Special rules apply for certain attributes:
 *
 * - "style": delegated to `setStyle()`
 * - "value": delegated to `updateValueAttrib()`
 * - attrib IDs starting with "on" are treated as event listeners
 *
 * If the given (or computed) attrib value is `false` or `undefined` the
 * attrib is removed from the element.
 *
 * @param el
 * @param id
 * @param val
 * @param attribs
 */
exports.setAttrib = (el, id, val, attribs) => {
    if (id.startsWith("__"))
        return;
    const isListener = id.indexOf("on") === 0;
    if (!isListener && typeof val === "function") {
        val = val(attribs);
    }
    if (val !== undefined && val !== false) {
        switch (id) {
            case "style":
                exports.setStyle(el, val);
                break;
            case "value":
                exports.updateValueAttrib(el, val);
                break;
            case "checked":
                // TODO add more native attribs?
                el[id] = val;
                break;
            default:
                if (isListener) {
                    el.addEventListener(id.substr(2), val);
                }
                else {
                    el.setAttribute(id, val);
                }
        }
    }
    else {
        el[id] != null ? (el[id] = null) : el.removeAttribute(id);
    }
    return el;
};
/**
 * Updates an element's `value` property. For form elements it too
 * ensures the edit cursor retains its position.
 *
 * @param el
 * @param v
 */
exports.updateValueAttrib = (el, v) => {
    let ev;
    switch (el.type) {
        case "text":
        case "textarea":
        case "password":
        case "email":
        case "url":
        case "tel":
        case "search":
            if ((ev = el.value) !== undefined && typeof v === "string") {
                const off = v.length - (ev.length - el.selectionStart);
                el.value = v;
                el.selectionStart = el.selectionEnd = off;
                break;
            }
        default:
            el.value = v;
    }
};
exports.removeAttribs = (el, attribs, prev) => {
    for (let i = attribs.length; --i >= 0;) {
        const a = attribs[i];
        if (a.indexOf("on") === 0) {
            el.removeEventListener(a.substr(2), prev[a]);
        }
        else {
            el[a] ? (el[a] = null) : el.removeAttribute(a);
        }
    }
};
exports.setStyle = (el, styles) => (el.setAttribute("style", css_1.css(styles)), el);
exports.clearDOM = (el) => el.innerHTML = "";
exports.removeChild = (parent, childIdx) => {
    const n = parent.children[childIdx];
    if (n !== undefined) {
        n.remove();
    }
};

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","@thi.ng/checks/is-not-string-iterable":"../../../node_modules/@thi.ng/checks/is-not-string-iterable.js","@thi.ng/hiccup/api":"../../../node_modules/@thi.ng/hiccup/api.js","@thi.ng/hiccup/css":"../../../node_modules/@thi.ng/hiccup/css.js"}],"../../../node_modules/@thi.ng/checks/is-plain-object.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OBJP = Object.getPrototypeOf({});
/**
 * Similar to `isObject()`, but also checks if prototype is that of
 * `Object` (or `null`).
 *
 * @param x
 */
function isPlainObject(x) {
    let proto;
    return Object.prototype.toString.call(x) === "[object Object]" &&
        (proto = Object.getPrototypeOf(x), proto === null || proto === OBJP);
}
exports.isPlainObject = isPlainObject;

},{}],"../../../node_modules/@thi.ng/errors/illegal-arguments.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IllegalArgumentError extends Error {
    constructor(msg) {
        super("illegal argument(s)" + (msg !== undefined ? ": " + msg : ""));
    }
}
exports.IllegalArgumentError = IllegalArgumentError;
function illegalArgs(msg) {
    throw new IllegalArgumentError(msg);
}
exports.illegalArgs = illegalArgs;

},{}],"../../../node_modules/@thi.ng/hdom/normalize.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isa = require("@thi.ng/checks/is-array");
const insi = require("@thi.ng/checks/is-not-string-iterable");
const iso = require("@thi.ng/checks/is-plain-object");
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const api_1 = require("@thi.ng/hiccup/api");
const isArray = isa.isArray;
const isNotStringAndIterable = insi.isNotStringAndIterable;
const isPlainObject = iso.isPlainObject;
/**
 * Expands single hiccup element/component into its canonical form:
 *
 * ```
 * [tagname, {attribs}, ...children]
 * ```
 *
 * Emmet-style ID and class names in the original tagname are moved into
 * the attribs object, e.g.:
 *
 * ```
 * ["div#foo.bar.baz"] => ["div", {id: "foo", class: "bar baz"}]
 * ```
 *
 * If both Emmet-style classes AND a `class` attrib exists, the former
 * are appended to the latter:
 *
 * ```
 * ["div.bar.baz", {class: "foo"}] => ["div", {class: "foo bar baz"}]
 * ```
 *
 * @param spec
 * @param keys
 */
exports.normalizeElement = (spec, keys) => {
    let tag = spec[0], hasAttribs = isPlainObject(spec[1]), match, id, clazz, attribs;
    if (typeof tag !== "string" || !(match = api_1.TAG_REGEXP.exec(tag))) {
        illegal_arguments_1.illegalArgs(`${tag} is not a valid tag name`);
    }
    // return orig if already normalized and satisfies key requirement
    if (tag === match[1] && hasAttribs && (!keys || spec[1].key)) {
        return spec;
    }
    attribs = hasAttribs ? Object.assign({}, spec[1]) : {};
    id = match[2];
    clazz = match[3];
    if (id) {
        attribs.id = id;
    }
    if (clazz) {
        clazz = clazz.replace(/\./g, " ");
        if (attribs.class) {
            attribs.class += " " + clazz;
        }
        else {
            attribs.class = clazz;
        }
    }
    return [match[1], attribs, ...spec.slice(hasAttribs ? 2 : 1)];
};
/**
 * See `HDOMImplementation` interface for further details.
 *
 * @param opts
 * @param tree
 */
exports.normalizeTree = (opts, tree) => _normalizeTree(tree, opts, opts.ctx, [0], opts.keys !== false, opts.span !== false);
const _normalizeTree = (tree, opts, ctx, path, keys, span) => {
    if (tree == null) {
        return;
    }
    if (isArray(tree)) {
        if (tree.length === 0) {
            return;
        }
        let norm, nattribs = tree[1], impl;
        // if available, use branch-local normalize implementation
        if (nattribs && (impl = nattribs.__impl) && (impl = impl.normalizeTree)) {
            return impl(opts, tree);
        }
        const tag = tree[0];
        // use result of function call
        // pass ctx as first arg and remaining array elements as rest args
        if (typeof tag === "function") {
            return _normalizeTree(tag.apply(null, [ctx, ...tree.slice(1)]), opts, ctx, path, keys, span);
        }
        // component object w/ life cycle methods
        // (render() is the only required hook)
        if (typeof tag.render === "function") {
            const args = [ctx, ...tree.slice(1)];
            norm = _normalizeTree(tag.render.apply(tag, args), opts, ctx, path, keys, span);
            if (isArray(norm)) {
                norm.__this = tag;
                norm.__init = tag.init;
                norm.__release = tag.release;
                norm.__args = args;
            }
            return norm;
        }
        norm = exports.normalizeElement(tree, keys);
        nattribs = norm[1];
        if (nattribs.__normalize === false) {
            return norm;
        }
        if (keys && nattribs.key === undefined) {
            nattribs.key = path.join("-");
        }
        if (norm.length > 2) {
            const tag = norm[0];
            const res = [tag, nattribs];
            span = span && !api_1.NO_SPANS[tag];
            for (let i = 2, j = 2, k = 0, n = norm.length; i < n; i++) {
                let el = norm[i];
                if (el != null) {
                    const isarray = isArray(el);
                    if ((isarray && isArray(el[0])) || (!isarray && isNotStringAndIterable(el))) {
                        for (let c of el) {
                            c = _normalizeTree(c, opts, ctx, path.concat(k), keys, span);
                            if (c !== undefined) {
                                res[j++] = c;
                            }
                            k++;
                        }
                    }
                    else {
                        el = _normalizeTree(el, opts, ctx, path.concat(k), keys, span);
                        if (el !== undefined) {
                            res[j++] = el;
                        }
                        k++;
                    }
                }
            }
            return res;
        }
        return norm;
    }
    if (typeof tree === "function") {
        return _normalizeTree(tree(ctx), opts, ctx, path, keys, span);
    }
    if (typeof tree.toHiccup === "function") {
        return _normalizeTree(tree.toHiccup(opts.ctx), opts, ctx, path, keys, span);
    }
    if (typeof tree.deref === "function") {
        return _normalizeTree(tree.deref(), opts, ctx, path, keys, span);
    }
    return span ?
        ["span", keys ? { key: path.join("-") } : {}, tree.toString()] :
        tree.toString();
};

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","@thi.ng/checks/is-not-string-iterable":"../../../node_modules/@thi.ng/checks/is-not-string-iterable.js","@thi.ng/checks/is-plain-object":"../../../node_modules/@thi.ng/checks/is-plain-object.js","@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","@thi.ng/hiccup/api":"../../../node_modules/@thi.ng/hiccup/api.js"}],"../../../node_modules/@thi.ng/hdom/default.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diff_1 = require("./diff");
const dom_1 = require("./dom");
const normalize_1 = require("./normalize");
/**
 * Default target implementation to manipulate browser DOM.
 */
exports.DEFAULT_IMPL = {
    createTree(opts, parent, tree, child) {
        return dom_1.createTree(opts, this, parent, tree, child);
    },
    hydrateTree(opts, parent, tree, child) {
        return dom_1.hydrateTree(opts, this, parent, tree, child);
    },
    diffTree(opts, parent, prev, curr, child) {
        diff_1.diffTree(opts, this, parent, prev, curr, child);
    },
    normalizeTree: normalize_1.normalizeTree,
    getElementById(id) {
        return document.getElementById(id);
    },
    getChild: dom_1.getChild,
    createElement: dom_1.createElement,
    createTextElement: dom_1.createTextElement,
    replaceChild(opts, parent, child, tree) {
        dom_1.replaceChild(opts, this, parent, child, tree);
    },
    removeChild: dom_1.removeChild,
    setContent: dom_1.setContent,
    removeAttribs: dom_1.removeAttribs,
    setAttrib: dom_1.setAttrib,
};

},{"./diff":"../../../node_modules/@thi.ng/hdom/diff.js","./dom":"../../../node_modules/@thi.ng/hdom/dom.js","./normalize":"../../../node_modules/@thi.ng/hdom/normalize.js"}],"../../../node_modules/@thi.ng/checks/implements-function.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function implementsFunction(x, fn) {
    return x != null && typeof x[fn] === "function";
}
exports.implementsFunction = implementsFunction;

},{}],"../../../node_modules/@thi.ng/hiccup/deref.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const implements_function_1 = require("@thi.ng/checks/implements-function");
/**
 * Takes an arbitrary `ctx` object and array of `keys`. Attempts to call
 * `.deref()` on all given keys' values and stores result values instead
 * of original. Returns updated copy of `ctx` or original if `ctx` is
 * `null` or no keys were given.
 *
 * @param ctx
 * @param keys
 */
exports.derefContext = (ctx, keys) => {
    if (ctx == null || !keys || !keys.length)
        return ctx;
    const res = Object.assign({}, ctx);
    for (let k of keys) {
        const v = res[k];
        implements_function_1.implementsFunction(v, "deref") && (res[k] = v.deref());
    }
    return res;
};

},{"@thi.ng/checks/implements-function":"../../../node_modules/@thi.ng/checks/implements-function.js"}],"../../../node_modules/@thi.ng/checks/is-string.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(x) {
    return typeof x === "string";
}
exports.isString = isString;

},{}],"../../../node_modules/@thi.ng/hdom/utils.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_string_1 = require("@thi.ng/checks/is-string");
exports.resolveRoot = (root, impl) => is_string_1.isString(root) ?
    impl.getElementById(root) :
    root;

},{"@thi.ng/checks/is-string":"../../../node_modules/@thi.ng/checks/is-string.js"}],"../../../node_modules/@thi.ng/hdom/render-once.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deref_1 = require("@thi.ng/hiccup/deref");
const default_1 = require("./default");
const utils_1 = require("./utils");
/**
 * One-off hdom tree conversion & target DOM application. Takes same
 * options as `start()`, but performs no diffing and only creates or
 * hydrates target once. The given tree is first normalized and if
 * result is `null` or `undefined` no further action will be taken.
 *
 * @param tree
 * @param opts
 * @param impl
 */
exports.renderOnce = (tree, opts = {}, impl = default_1.DEFAULT_IMPL) => {
    opts = Object.assign({ root: "app" }, opts);
    opts.ctx = deref_1.derefContext(opts.ctx, opts.autoDerefKeys);
    const root = utils_1.resolveRoot(opts.root, impl);
    tree = impl.normalizeTree(opts, tree);
    if (!tree)
        return;
    opts.hydrate ?
        impl.hydrateTree(opts, root, tree) :
        impl.createTree(opts, root, tree);
};

},{"@thi.ng/hiccup/deref":"../../../node_modules/@thi.ng/hiccup/deref.js","./default":"../../../node_modules/@thi.ng/hdom/default.js","./utils":"../../../node_modules/@thi.ng/hdom/utils.js"}],"../../../node_modules/@thi.ng/hdom/start.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deref_1 = require("@thi.ng/hiccup/deref");
const default_1 = require("./default");
const utils_1 = require("./utils");
/**
 * Takes an hiccup tree (array, function or component object w/ life
 * cycle methods) and an optional object of DOM update options. Starts
 * RAF update loop, in each iteration first normalizing given tree, then
 * computing diff to previous frame's tree and applying any changes to
 * the real DOM. The `ctx` option can be used for passing arbitrary
 * config data or state down into the hiccup component tree. Any
 * embedded component function in the tree will receive this context
 * object (shallow copy) as first argument, as will life cycle methods
 * in component objects. If the `autoDerefKeys` option is given, attempts
 * to auto-expand/deref the given keys in the user supplied context
 * object (`ctx` option) prior to *each* tree normalization. All of
 * these values should implement the thi.ng/api `IDeref` interface (e.g.
 * atoms, cursors, views, rstreams etc.). This feature can be used to
 * define dynamic contexts linked to the main app state, e.g. using
 * derived views provided by thi.ng/atom.
 *
 * **Selective updates**: No updates will be applied if the given hiccup
 * tree is `undefined` or `null` or a root component function returns no
 * value. This way a given root function can do some state handling of
 * its own and implement fail-fast checks to determine no DOM updates
 * are necessary, save effort re-creating a new hiccup tree and request
 * skipping DOM updates via this function. In this case, the previous
 * DOM tree is kept around until the root function returns a tree again,
 * which then is diffed and applied against the previous tree kept as
 * usual. Any number of frames may be skipped this way.
 *
 * **Important:** Unless the `hydrate` option is enabled, the parent
 * element given is assumed to have NO children at the time when
 * `start()` is called. Since hdom does NOT track the real DOM, the
 * resulting changes will result in potentially undefined behavior if
 * the parent element wasn't empty. Likewise, if `hydrate` is enabled,
 * it is assumed that an equivalent DOM (minus listeners) already exists
 * (i.e. generated via SSR) when `start()` is called. Any other
 * discrepancies between the pre-existing DOM and the hdom trees will
 * cause undefined behavior.
 *
 * Returns a function, which when called, immediately cancels the update
 * loop.
 *
 * @param tree hiccup DOM tree
 * @param opts options
 * @param impl hdom target implementation
 */
exports.start = (tree, opts = {}, impl = default_1.DEFAULT_IMPL) => {
    const _opts = Object.assign({ root: "app" }, opts);
    let prev = [];
    let isActive = true;
    const root = utils_1.resolveRoot(_opts.root, impl);
    const update = () => {
        if (isActive) {
            _opts.ctx = deref_1.derefContext(opts.ctx, _opts.autoDerefKeys);
            const curr = impl.normalizeTree(_opts, tree);
            if (curr != null) {
                if (_opts.hydrate) {
                    impl.hydrateTree(_opts, root, curr);
                    _opts.hydrate = false;
                }
                else {
                    impl.diffTree(_opts, root, prev, curr);
                }
                prev = curr;
            }
            // check again in case one of the components called cancel
            isActive && requestAnimationFrame(update);
        }
    };
    requestAnimationFrame(update);
    return () => (isActive = false);
};

},{"@thi.ng/hiccup/deref":"../../../node_modules/@thi.ng/hiccup/deref.js","./default":"../../../node_modules/@thi.ng/hdom/default.js","./utils":"../../../node_modules/@thi.ng/hdom/utils.js"}],"../../../node_modules/@thi.ng/hdom/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./api"));
__export(require("./default"));
__export(require("./diff"));
__export(require("./dom"));
__export(require("./normalize"));
__export(require("./render-once"));
__export(require("./start"));

},{"./api":"../../../node_modules/@thi.ng/hdom/api.js","./default":"../../../node_modules/@thi.ng/hdom/default.js","./diff":"../../../node_modules/@thi.ng/hdom/diff.js","./dom":"../../../node_modules/@thi.ng/hdom/dom.js","./normalize":"../../../node_modules/@thi.ng/hdom/normalize.js","./render-once":"../../../node_modules/@thi.ng/hdom/render-once.js","./start":"../../../node_modules/@thi.ng/hdom/start.js"}],"../../../node_modules/@thi.ng/hdom-components/canvas.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configurable canvas component. Used as common base for `canvasWebGL`
 * and `canvas2D` wrappers.
 *
 * @param type canvas context type
 * @param handlers user handlers
 * @param opts canvas context creation options
 */
const _canvas = (type, { init, update, release }, opts) => {
    let el, ctx;
    let frame = 0;
    let time = 0;
    return {
        init(_el, hctx, ...args) {
            el = _el;
            exports.adaptDPI(el, el.width, el.height);
            ctx = el.getContext(type, opts);
            time = Date.now();
            init && init(el, ctx, hctx, ...args);
            update && update(el, ctx, hctx, time, frame++, ...args);
        },
        render(hctx, ...args) {
            ctx && update && update(el, ctx, hctx, Date.now() - time, frame++, ...args);
            return ["canvas", args[0]];
        },
        release(hctx, ...args) {
            release && release(el, ctx, hctx, ...args);
        }
    };
};
/**
 * Higher order WebGL canvas component delegating to user provided
 * handlers.
 *
 * Note: Since this is an higher order component, if used within a
 * non-static parent component, this function itself cannot be directly
 * inlined into hdom tree and must be initialized prior/outside, however
 * the returned component can be used as normal.
 *
 * ```
 * const glcanvas = canvasWebGL({
 *   render: (canv, gl, hctx, time, frame, ...args) => {
 *     const col = 0.5 + 0.5 * Math.sin(time);
 *     gl.clearColor(col, col, col, 1);
 *   }
 * });
 * ...
 * [glcanvas, {id: "foo", width: 640, height: 480}]
 * ```
 *
 * @param handlers user provided handlers
 * @param opts canvas context creation options
 */
exports.canvasWebGL = (handlers, opts) => _canvas("webgl", handlers, opts);
/**
 * Same as `canvasWebGL` but targets WebGL2.
 *
 * @param handlers user provided handlers
 * @param opts canvas context creation options
 */
exports.canvasWebGL2 = (handlers, opts) => _canvas("webgl2", handlers, opts);
/**
 * Similar to `canvasWebGL`, but targets default 2D drawing context.
 *
 * @param handlers user provided handlers
 * @param glopts canvas context creation options
 */
exports.canvas2D = (handlers, opts) => _canvas("2d", handlers, opts);
/**
 * Sets the canvas size to given `width` & `height` and adjusts style to
 * compensate for HDPI devices. Note: For 2D canvases, this will
 * automatically clear any prior canvas content.
 *
 * @param canvas
 * @param width uncompensated pixel width
 * @param height uncompensated pixel height
 */
exports.adaptDPI = (canvas, width, height) => {
    const dpr = window.devicePixelRatio || 1;
    if (dpr != 1) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    return dpr;
};

},{}],"../../../node_modules/regl/dist/regl.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.createREGL = factory());
}(this, (function () { 'use strict';

var isTypedArray = function (x) {
  return (
    x instanceof Uint8Array ||
    x instanceof Uint16Array ||
    x instanceof Uint32Array ||
    x instanceof Int8Array ||
    x instanceof Int16Array ||
    x instanceof Int32Array ||
    x instanceof Float32Array ||
    x instanceof Float64Array ||
    x instanceof Uint8ClampedArray
  )
};

var extend = function (base, opts) {
  var keys = Object.keys(opts);
  for (var i = 0; i < keys.length; ++i) {
    base[keys[i]] = opts[keys[i]];
  }
  return base
};

// Error checking and parameter validation.
//
// Statements for the form `check.someProcedure(...)` get removed by
// a browserify transform for optimized/minified bundles.
//
/* globals atob */
var endl = '\n';

// only used for extracting shader names.  if atob not present, then errors
// will be slightly crappier
function decodeB64 (str) {
  if (typeof atob !== 'undefined') {
    return atob(str)
  }
  return 'base64:' + str
}

function raise (message) {
  var error = new Error('(regl) ' + message);
  console.error(error);
  throw error
}

function check (pred, message) {
  if (!pred) {
    raise(message);
  }
}

function encolon (message) {
  if (message) {
    return ': ' + message
  }
  return ''
}

function checkParameter (param, possibilities, message) {
  if (!(param in possibilities)) {
    raise('unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join());
  }
}

function checkIsTypedArray (data, message) {
  if (!isTypedArray(data)) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. must be a typed array');
  }
}

function checkTypeOf (value, type, message) {
  if (typeof value !== type) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value));
  }
}

function checkNonNegativeInt (value, message) {
  if (!((value >= 0) &&
        ((value | 0) === value))) {
    raise('invalid parameter type, (' + value + ')' + encolon(message) +
          '. must be a nonnegative integer');
  }
}

function checkOneOf (value, list, message) {
  if (list.indexOf(value) < 0) {
    raise('invalid value' + encolon(message) + '. must be one of: ' + list);
  }
}

var constructorKeys = [
  'gl',
  'canvas',
  'container',
  'attributes',
  'pixelRatio',
  'extensions',
  'optionalExtensions',
  'profile',
  'onDone'
];

function checkConstructor (obj) {
  Object.keys(obj).forEach(function (key) {
    if (constructorKeys.indexOf(key) < 0) {
      raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
    }
  });
}

function leftPad (str, n) {
  str = str + '';
  while (str.length < n) {
    str = ' ' + str;
  }
  return str
}

function ShaderFile () {
  this.name = 'unknown';
  this.lines = [];
  this.index = {};
  this.hasErrors = false;
}

function ShaderLine (number, line) {
  this.number = number;
  this.line = line;
  this.errors = [];
}

function ShaderError (fileNumber, lineNumber, message) {
  this.file = fileNumber;
  this.line = lineNumber;
  this.message = message;
}

function guessCommand () {
  var error = new Error();
  var stack = (error.stack || error).toString();
  var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
  if (pat) {
    return pat[1]
  }
  var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
  if (pat2) {
    return pat2[1]
  }
  return 'unknown'
}

function guessCallSite () {
  var error = new Error();
  var stack = (error.stack || error).toString();
  var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
  if (pat) {
    return pat[1]
  }
  var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
  if (pat2) {
    return pat2[1]
  }
  return 'unknown'
}

function parseSource (source, command) {
  var lines = source.split('\n');
  var lineNumber = 1;
  var fileNumber = 0;
  var files = {
    unknown: new ShaderFile(),
    0: new ShaderFile()
  };
  files.unknown.name = files[0].name = command || guessCommand();
  files.unknown.lines.push(new ShaderLine(0, ''));
  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    var parts = /^\s*\#\s*(\w+)\s+(.+)\s*$/.exec(line);
    if (parts) {
      switch (parts[1]) {
        case 'line':
          var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
          if (lineNumberInfo) {
            lineNumber = lineNumberInfo[1] | 0;
            if (lineNumberInfo[2]) {
              fileNumber = lineNumberInfo[2] | 0;
              if (!(fileNumber in files)) {
                files[fileNumber] = new ShaderFile();
              }
            }
          }
          break
        case 'define':
          var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
          if (nameInfo) {
            files[fileNumber].name = (nameInfo[1]
                ? decodeB64(nameInfo[2])
                : nameInfo[2]);
          }
          break
      }
    }
    files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
  }
  Object.keys(files).forEach(function (fileNumber) {
    var file = files[fileNumber];
    file.lines.forEach(function (line) {
      file.index[line.number] = line;
    });
  });
  return files
}

function parseErrorLog (errLog) {
  var result = [];
  errLog.split('\n').forEach(function (errMsg) {
    if (errMsg.length < 5) {
      return
    }
    var parts = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(errMsg);
    if (parts) {
      result.push(new ShaderError(
        parts[1] | 0,
        parts[2] | 0,
        parts[3].trim()));
    } else if (errMsg.length > 0) {
      result.push(new ShaderError('unknown', 0, errMsg));
    }
  });
  return result
}

function annotateFiles (files, errors) {
  errors.forEach(function (error) {
    var file = files[error.file];
    if (file) {
      var line = file.index[error.line];
      if (line) {
        line.errors.push(error);
        file.hasErrors = true;
        return
      }
    }
    files.unknown.hasErrors = true;
    files.unknown.lines[0].errors.push(error);
  });
}

function checkShaderError (gl, shader, source, type, command) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var errLog = gl.getShaderInfoLog(shader);
    var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
    checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
    var files = parseSource(source, command);
    var errors = parseErrorLog(errLog);
    annotateFiles(files, errors);

    Object.keys(files).forEach(function (fileNumber) {
      var file = files[fileNumber];
      if (!file.hasErrors) {
        return
      }

      var strings = [''];
      var styles = [''];

      function push (str, style) {
        strings.push(str);
        styles.push(style || '');
      }

      push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

      file.lines.forEach(function (line) {
        if (line.errors.length > 0) {
          push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
          push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');

          // try to guess token
          var offset = 0;
          line.errors.forEach(function (error) {
            var message = error.message;
            var token = /^\s*\'(.*)\'\s*\:\s*(.*)$/.exec(message);
            if (token) {
              var tokenPat = token[1];
              message = token[2];
              switch (tokenPat) {
                case 'assign':
                  tokenPat = '=';
                  break
              }
              offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
            } else {
              offset = 0;
            }

            push(leftPad('| ', 6));
            push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
            push(leftPad('| ', 6));
            push(message + endl, 'font-weight:bold');
          });
          push(leftPad('| ', 6) + endl);
        } else {
          push(leftPad(line.number, 4) + '|  ');
          push(line.line + endl, 'color:red');
        }
      });
      if (typeof document !== 'undefined' && !window.chrome) {
        styles[0] = strings.join('%c');
        console.log.apply(console, styles);
      } else {
        console.log(strings.join(''));
      }
    });

    check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
  }
}

function checkLinkError (gl, program, fragShader, vertShader, command) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var errLog = gl.getProgramInfoLog(program);
    var fragParse = parseSource(fragShader, command);
    var vertParse = parseSource(vertShader, command);

    var header = 'Error linking program with vertex shader, "' +
      vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

    if (typeof document !== 'undefined') {
      console.log('%c' + header + endl + '%c' + errLog,
        'color:red;text-decoration:underline;font-weight:bold',
        'color:red');
    } else {
      console.log(header + endl + errLog);
    }
    check.raise(header);
  }
}

function saveCommandRef (object) {
  object._commandRef = guessCommand();
}

function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
  saveCommandRef(opts);

  function id (str) {
    if (str) {
      return stringStore.id(str)
    }
    return 0
  }
  opts._fragId = id(opts.static.frag);
  opts._vertId = id(opts.static.vert);

  function addProps (dict, set) {
    Object.keys(set).forEach(function (u) {
      dict[stringStore.id(u)] = true;
    });
  }

  var uniformSet = opts._uniformSet = {};
  addProps(uniformSet, uniforms.static);
  addProps(uniformSet, uniforms.dynamic);

  var attributeSet = opts._attributeSet = {};
  addProps(attributeSet, attributes.static);
  addProps(attributeSet, attributes.dynamic);

  opts._hasCount = (
    'count' in opts.static ||
    'count' in opts.dynamic ||
    'elements' in opts.static ||
    'elements' in opts.dynamic);
}

function commandRaise (message, command) {
  var callSite = guessCallSite();
  raise(message +
    ' in command ' + (command || guessCommand()) +
    (callSite === 'unknown' ? '' : ' called from ' + callSite));
}

function checkCommand (pred, message, command) {
  if (!pred) {
    commandRaise(message, command || guessCommand());
  }
}

function checkParameterCommand (param, possibilities, message, command) {
  if (!(param in possibilities)) {
    commandRaise(
      'unknown parameter (' + param + ')' + encolon(message) +
      '. possible values: ' + Object.keys(possibilities).join(),
      command || guessCommand());
  }
}

function checkCommandType (value, type, message, command) {
  if (typeof value !== type) {
    commandRaise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value),
      command || guessCommand());
  }
}

function checkOptional (block) {
  block();
}

function checkFramebufferFormat (attachment, texFormats, rbFormats) {
  if (attachment.texture) {
    checkOneOf(
      attachment.texture._texture.internalformat,
      texFormats,
      'unsupported texture format for attachment');
  } else {
    checkOneOf(
      attachment.renderbuffer._renderbuffer.format,
      rbFormats,
      'unsupported renderbuffer format for attachment');
  }
}

var GL_CLAMP_TO_EDGE = 0x812F;

var GL_NEAREST = 0x2600;
var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

var GL_BYTE = 5120;
var GL_UNSIGNED_BYTE = 5121;
var GL_SHORT = 5122;
var GL_UNSIGNED_SHORT = 5123;
var GL_INT = 5124;
var GL_UNSIGNED_INT = 5125;
var GL_FLOAT = 5126;

var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

var GL_HALF_FLOAT_OES = 0x8D61;

var TYPE_SIZE = {};

TYPE_SIZE[GL_BYTE] =
TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

TYPE_SIZE[GL_SHORT] =
TYPE_SIZE[GL_UNSIGNED_SHORT] =
TYPE_SIZE[GL_HALF_FLOAT_OES] =
TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

TYPE_SIZE[GL_INT] =
TYPE_SIZE[GL_UNSIGNED_INT] =
TYPE_SIZE[GL_FLOAT] =
TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

function pixelSize (type, channels) {
  if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
      type === GL_UNSIGNED_SHORT_4_4_4_4 ||
      type === GL_UNSIGNED_SHORT_5_6_5) {
    return 2
  } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
    return 4
  } else {
    return TYPE_SIZE[type] * channels
  }
}

function isPow2 (v) {
  return !(v & (v - 1)) && (!!v)
}

function checkTexture2D (info, mipData, limits) {
  var i;
  var w = mipData.width;
  var h = mipData.height;
  var c = mipData.channels;

  // Check texture shape
  check(w > 0 && w <= limits.maxTextureSize &&
        h > 0 && h <= limits.maxTextureSize,
        'invalid texture shape');

  // check wrap mode
  if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
    check(isPow2(w) && isPow2(h),
      'incompatible wrap mode for texture, both width and height must be power of 2');
  }

  if (mipData.mipmask === 1) {
    if (w !== 1 && h !== 1) {
      check(
        info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
        info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
        info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
        info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
        'min filter requires mipmap');
    }
  } else {
    // texture must be power of 2
    check(isPow2(w) && isPow2(h),
      'texture must be a square power of 2 to support mipmapping');
    check(mipData.mipmask === (w << 1) - 1,
      'missing or incomplete mipmap data');
  }

  if (mipData.type === GL_FLOAT) {
    if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
      check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
        'filter not supported, must enable oes_texture_float_linear');
    }
    check(!info.genMipmaps,
      'mipmap generation not supported with float textures');
  }

  // check image complete
  var mipimages = mipData.images;
  for (i = 0; i < 16; ++i) {
    if (mipimages[i]) {
      var mw = w >> i;
      var mh = h >> i;
      check(mipData.mipmask & (1 << i), 'missing mipmap data');

      var img = mipimages[i];

      check(
        img.width === mw &&
        img.height === mh,
        'invalid shape for mip images');

      check(
        img.format === mipData.format &&
        img.internalformat === mipData.internalformat &&
        img.type === mipData.type,
        'incompatible type for mip image');

      if (img.compressed) {
        // TODO: check size for compressed images
      } else if (img.data) {
        // check(img.data.byteLength === mw * mh *
        // Math.max(pixelSize(img.type, c), img.unpackAlignment),
        var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
        check(img.data.byteLength === rowSize * mh,
          'invalid data for image, buffer size is inconsistent with image format');
      } else if (img.element) {
        // TODO: check element can be loaded
      } else if (img.copy) {
        // TODO: check compatible format and type
      }
    } else if (!info.genMipmaps) {
      check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
    }
  }

  if (mipData.compressed) {
    check(!info.genMipmaps,
      'mipmap generation for compressed images not supported');
  }
}

function checkTextureCube (texture, info, faces, limits) {
  var w = texture.width;
  var h = texture.height;
  var c = texture.channels;

  // Check texture shape
  check(
    w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
    'invalid texture shape');
  check(
    w === h,
    'cube map must be square');
  check(
    info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
    'wrap mode not supported by cube map');

  for (var i = 0; i < faces.length; ++i) {
    var face = faces[i];
    check(
      face.width === w && face.height === h,
      'inconsistent cube map face shape');

    if (info.genMipmaps) {
      check(!face.compressed,
        'can not generate mipmap for compressed textures');
      check(face.mipmask === 1,
        'can not specify mipmaps and generate mipmaps');
    } else {
      // TODO: check mip and filter mode
    }

    var mipmaps = face.images;
    for (var j = 0; j < 16; ++j) {
      var img = mipmaps[j];
      if (img) {
        var mw = w >> j;
        var mh = h >> j;
        check(face.mipmask & (1 << j), 'missing mipmap data');
        check(
          img.width === mw &&
          img.height === mh,
          'invalid shape for mip images');
        check(
          img.format === texture.format &&
          img.internalformat === texture.internalformat &&
          img.type === texture.type,
          'incompatible type for mip image');

        if (img.compressed) {
          // TODO: check size for compressed images
        } else if (img.data) {
          check(img.data.byteLength === mw * mh *
            Math.max(pixelSize(img.type, c), img.unpackAlignment),
            'invalid data for image, buffer size is inconsistent with image format');
        } else if (img.element) {
          // TODO: check element can be loaded
        } else if (img.copy) {
          // TODO: check compatible format and type
        }
      }
    }
  }
}

var check$1 = extend(check, {
  optional: checkOptional,
  raise: raise,
  commandRaise: commandRaise,
  command: checkCommand,
  parameter: checkParameter,
  commandParameter: checkParameterCommand,
  constructor: checkConstructor,
  type: checkTypeOf,
  commandType: checkCommandType,
  isTypedArray: checkIsTypedArray,
  nni: checkNonNegativeInt,
  oneOf: checkOneOf,
  shaderError: checkShaderError,
  linkError: checkLinkError,
  callSite: guessCallSite,
  saveCommandRef: saveCommandRef,
  saveDrawInfo: saveDrawCommandInfo,
  framebufferFormat: checkFramebufferFormat,
  guessCommand: guessCommand,
  texture2D: checkTexture2D,
  textureCube: checkTextureCube
});

var VARIABLE_COUNTER = 0;

var DYN_FUNC = 0;

function DynamicVariable (type, data) {
  this.id = (VARIABLE_COUNTER++);
  this.type = type;
  this.data = data;
}

function escapeStr (str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function splitParts (str) {
  if (str.length === 0) {
    return []
  }

  var firstChar = str.charAt(0);
  var lastChar = str.charAt(str.length - 1);

  if (str.length > 1 &&
      firstChar === lastChar &&
      (firstChar === '"' || firstChar === "'")) {
    return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
  }

  var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
  if (parts) {
    return (
      splitParts(str.substr(0, parts.index))
      .concat(splitParts(parts[1]))
      .concat(splitParts(str.substr(parts.index + parts[0].length)))
    )
  }

  var subparts = str.split('.');
  if (subparts.length === 1) {
    return ['"' + escapeStr(str) + '"']
  }

  var result = [];
  for (var i = 0; i < subparts.length; ++i) {
    result = result.concat(splitParts(subparts[i]));
  }
  return result
}

function toAccessorString (str) {
  return '[' + splitParts(str).join('][') + ']'
}

function defineDynamic (type, data) {
  return new DynamicVariable(type, toAccessorString(data + ''))
}

function isDynamic (x) {
  return (typeof x === 'function' && !x._reglType) ||
         x instanceof DynamicVariable
}

function unbox (x, path) {
  if (typeof x === 'function') {
    return new DynamicVariable(DYN_FUNC, x)
  }
  return x
}

var dynamic = {
  DynamicVariable: DynamicVariable,
  define: defineDynamic,
  isDynamic: isDynamic,
  unbox: unbox,
  accessor: toAccessorString
};

/* globals requestAnimationFrame, cancelAnimationFrame */
var raf = {
  next: typeof requestAnimationFrame === 'function'
    ? function (cb) { return requestAnimationFrame(cb) }
    : function (cb) { return setTimeout(cb, 16) },
  cancel: typeof cancelAnimationFrame === 'function'
    ? function (raf) { return cancelAnimationFrame(raf) }
    : clearTimeout
};

/* globals performance */
var clock = (typeof performance !== 'undefined' && performance.now)
  ? function () { return performance.now() }
  : function () { return +(new Date()) };

function createStringStore () {
  var stringIds = {'': 0};
  var stringValues = [''];
  return {
    id: function (str) {
      var result = stringIds[str];
      if (result) {
        return result
      }
      result = stringIds[str] = stringValues.length;
      stringValues.push(str);
      return result
    },

    str: function (id) {
      return stringValues[id]
    }
  }
}

// Context and canvas creation helper functions
function createCanvas (element, onDone, pixelRatio) {
  var canvas = document.createElement('canvas');
  extend(canvas.style, {
    border: 0,
    margin: 0,
    padding: 0,
    top: 0,
    left: 0
  });
  element.appendChild(canvas);

  if (element === document.body) {
    canvas.style.position = 'absolute';
    extend(element.style, {
      margin: 0,
      padding: 0
    });
  }

  function resize () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (element !== document.body) {
      var bounds = element.getBoundingClientRect();
      w = bounds.right - bounds.left;
      h = bounds.bottom - bounds.top;
    }
    canvas.width = pixelRatio * w;
    canvas.height = pixelRatio * h;
    extend(canvas.style, {
      width: w + 'px',
      height: h + 'px'
    });
  }

  window.addEventListener('resize', resize, false);

  function onDestroy () {
    window.removeEventListener('resize', resize);
    element.removeChild(canvas);
  }

  resize();

  return {
    canvas: canvas,
    onDestroy: onDestroy
  }
}

function createContext (canvas, contextAttributes) {
  function get (name) {
    try {
      return canvas.getContext(name, contextAttributes)
    } catch (e) {
      return null
    }
  }
  return (
    get('webgl') ||
    get('experimental-webgl') ||
    get('webgl-experimental')
  )
}

function isHTMLElement (obj) {
  return (
    typeof obj.nodeName === 'string' &&
    typeof obj.appendChild === 'function' &&
    typeof obj.getBoundingClientRect === 'function'
  )
}

function isWebGLContext (obj) {
  return (
    typeof obj.drawArrays === 'function' ||
    typeof obj.drawElements === 'function'
  )
}

function parseExtensions (input) {
  if (typeof input === 'string') {
    return input.split()
  }
  check$1(Array.isArray(input), 'invalid extension array');
  return input
}

function getElement (desc) {
  if (typeof desc === 'string') {
    check$1(typeof document !== 'undefined', 'not supported outside of DOM');
    return document.querySelector(desc)
  }
  return desc
}

function parseArgs (args_) {
  var args = args_ || {};
  var element, container, canvas, gl;
  var contextAttributes = {};
  var extensions = [];
  var optionalExtensions = [];
  var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
  var profile = false;
  var onDone = function (err) {
    if (err) {
      check$1.raise(err);
    }
  };
  var onDestroy = function () {};
  if (typeof args === 'string') {
    check$1(
      typeof document !== 'undefined',
      'selector queries only supported in DOM enviroments');
    element = document.querySelector(args);
    check$1(element, 'invalid query string for element');
  } else if (typeof args === 'object') {
    if (isHTMLElement(args)) {
      element = args;
    } else if (isWebGLContext(args)) {
      gl = args;
      canvas = gl.canvas;
    } else {
      check$1.constructor(args);
      if ('gl' in args) {
        gl = args.gl;
      } else if ('canvas' in args) {
        canvas = getElement(args.canvas);
      } else if ('container' in args) {
        container = getElement(args.container);
      }
      if ('attributes' in args) {
        contextAttributes = args.attributes;
        check$1.type(contextAttributes, 'object', 'invalid context attributes');
      }
      if ('extensions' in args) {
        extensions = parseExtensions(args.extensions);
      }
      if ('optionalExtensions' in args) {
        optionalExtensions = parseExtensions(args.optionalExtensions);
      }
      if ('onDone' in args) {
        check$1.type(
          args.onDone, 'function',
          'invalid or missing onDone callback');
        onDone = args.onDone;
      }
      if ('profile' in args) {
        profile = !!args.profile;
      }
      if ('pixelRatio' in args) {
        pixelRatio = +args.pixelRatio;
        check$1(pixelRatio > 0, 'invalid pixel ratio');
      }
    }
  } else {
    check$1.raise('invalid arguments to regl');
  }

  if (element) {
    if (element.nodeName.toLowerCase() === 'canvas') {
      canvas = element;
    } else {
      container = element;
    }
  }

  if (!gl) {
    if (!canvas) {
      check$1(
        typeof document !== 'undefined',
        'must manually specify webgl context outside of DOM environments');
      var result = createCanvas(container || document.body, onDone, pixelRatio);
      if (!result) {
        return null
      }
      canvas = result.canvas;
      onDestroy = result.onDestroy;
    }
    gl = createContext(canvas, contextAttributes);
  }

  if (!gl) {
    onDestroy();
    onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
    return null
  }

  return {
    gl: gl,
    canvas: canvas,
    container: container,
    extensions: extensions,
    optionalExtensions: optionalExtensions,
    pixelRatio: pixelRatio,
    profile: profile,
    onDone: onDone,
    onDestroy: onDestroy
  }
}

function createExtensionCache (gl, config) {
  var extensions = {};

  function tryLoadExtension (name_) {
    check$1.type(name_, 'string', 'extension name must be string');
    var name = name_.toLowerCase();
    var ext;
    try {
      ext = extensions[name] = gl.getExtension(name);
    } catch (e) {}
    return !!ext
  }

  for (var i = 0; i < config.extensions.length; ++i) {
    var name = config.extensions[i];
    if (!tryLoadExtension(name)) {
      config.onDestroy();
      config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
      return null
    }
  }

  config.optionalExtensions.forEach(tryLoadExtension);

  return {
    extensions: extensions,
    restore: function () {
      Object.keys(extensions).forEach(function (name) {
        if (extensions[name] && !tryLoadExtension(name)) {
          throw new Error('(regl): error restoring extension ' + name)
        }
      });
    }
  }
}

function loop (n, f) {
  var result = Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = f(i);
  }
  return result
}

var GL_BYTE$1 = 5120;
var GL_UNSIGNED_BYTE$2 = 5121;
var GL_SHORT$1 = 5122;
var GL_UNSIGNED_SHORT$1 = 5123;
var GL_INT$1 = 5124;
var GL_UNSIGNED_INT$1 = 5125;
var GL_FLOAT$2 = 5126;

function nextPow16 (v) {
  for (var i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i
    }
  }
  return 0
}

function log2 (v) {
  var r, shift;
  r = (v > 0xFFFF) << 4;
  v >>>= r;
  shift = (v > 0xFF) << 3;
  v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2;
  v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1;
  v >>>= shift; r |= shift;
  return r | (v >> 1)
}

function createPool () {
  var bufferPool = loop(8, function () {
    return []
  });

  function alloc (n) {
    var sz = nextPow16(n);
    var bin = bufferPool[log2(sz) >> 2];
    if (bin.length > 0) {
      return bin.pop()
    }
    return new ArrayBuffer(sz)
  }

  function free (buf) {
    bufferPool[log2(buf.byteLength) >> 2].push(buf);
  }

  function allocType (type, n) {
    var result = null;
    switch (type) {
      case GL_BYTE$1:
        result = new Int8Array(alloc(n), 0, n);
        break
      case GL_UNSIGNED_BYTE$2:
        result = new Uint8Array(alloc(n), 0, n);
        break
      case GL_SHORT$1:
        result = new Int16Array(alloc(2 * n), 0, n);
        break
      case GL_UNSIGNED_SHORT$1:
        result = new Uint16Array(alloc(2 * n), 0, n);
        break
      case GL_INT$1:
        result = new Int32Array(alloc(4 * n), 0, n);
        break
      case GL_UNSIGNED_INT$1:
        result = new Uint32Array(alloc(4 * n), 0, n);
        break
      case GL_FLOAT$2:
        result = new Float32Array(alloc(4 * n), 0, n);
        break
      default:
        return null
    }
    if (result.length !== n) {
      return result.subarray(0, n)
    }
    return result
  }

  function freeType (array) {
    free(array.buffer);
  }

  return {
    alloc: alloc,
    free: free,
    allocType: allocType,
    freeType: freeType
  }
}

var pool = createPool();

// zero pool for initial zero data
pool.zero = createPool();

var GL_SUBPIXEL_BITS = 0x0D50;
var GL_RED_BITS = 0x0D52;
var GL_GREEN_BITS = 0x0D53;
var GL_BLUE_BITS = 0x0D54;
var GL_ALPHA_BITS = 0x0D55;
var GL_DEPTH_BITS = 0x0D56;
var GL_STENCIL_BITS = 0x0D57;

var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

var GL_MAX_TEXTURE_SIZE = 0x0D33;
var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
var GL_MAX_VERTEX_ATTRIBS = 0x8869;
var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
var GL_MAX_VARYING_VECTORS = 0x8DFC;
var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

var GL_VENDOR = 0x1F00;
var GL_RENDERER = 0x1F01;
var GL_VERSION = 0x1F02;
var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

var GL_TEXTURE_2D = 0x0DE1;
var GL_TEXTURE_CUBE_MAP = 0x8513;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
var GL_TEXTURE0 = 0x84C0;
var GL_RGBA = 0x1908;
var GL_FLOAT$1 = 0x1406;
var GL_UNSIGNED_BYTE$1 = 0x1401;
var GL_FRAMEBUFFER = 0x8D40;
var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
var GL_COLOR_ATTACHMENT0 = 0x8CE0;
var GL_COLOR_BUFFER_BIT$1 = 0x4000;

var wrapLimits = function (gl, extensions) {
  var maxAnisotropic = 1;
  if (extensions.ext_texture_filter_anisotropic) {
    maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
  }

  var maxDrawbuffers = 1;
  var maxColorAttachments = 1;
  if (extensions.webgl_draw_buffers) {
    maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
    maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
  }

  // detect if reading float textures is available (Safari doesn't support)
  var readFloat = !!extensions.oes_texture_float;
  if (readFloat) {
    var readFloatTexture = gl.createTexture();
    gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
    gl.bindTexture(GL_TEXTURE_2D, null);

    if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

    else {
      gl.viewport(0, 0, 1, 1);
      gl.clearColor(1.0, 0.0, 0.0, 1.0);
      gl.clear(GL_COLOR_BUFFER_BIT$1);
      var pixels = pool.allocType(GL_FLOAT$1, 4);
      gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);

      if (gl.getError()) readFloat = false;
      else {
        gl.deleteFramebuffer(fbo);
        gl.deleteTexture(readFloatTexture);

        readFloat = pixels[0] === 1.0;
      }

      pool.freeType(pixels);
    }
  }

  // detect non power of two cube textures support (IE doesn't support)
  var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));

  var npotTextureCube = true;

  if (!isIE) {
    var cubeTexture = gl.createTexture();
    var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
    gl.activeTexture(GL_TEXTURE0);
    gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
    gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
    pool.freeType(data);
    gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
    gl.deleteTexture(cubeTexture);
    npotTextureCube = !gl.getError();
  }

  return {
    // drawing buffer bit depth
    colorBits: [
      gl.getParameter(GL_RED_BITS),
      gl.getParameter(GL_GREEN_BITS),
      gl.getParameter(GL_BLUE_BITS),
      gl.getParameter(GL_ALPHA_BITS)
    ],
    depthBits: gl.getParameter(GL_DEPTH_BITS),
    stencilBits: gl.getParameter(GL_STENCIL_BITS),
    subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

    // supported extensions
    extensions: Object.keys(extensions).filter(function (ext) {
      return !!extensions[ext]
    }),

    // max aniso samples
    maxAnisotropic: maxAnisotropic,

    // max draw buffers
    maxDrawbuffers: maxDrawbuffers,
    maxColorAttachments: maxColorAttachments,

    // point and line size ranges
    pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
    lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
    maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
    maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
    maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
    maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
    maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
    maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
    maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
    maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
    maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
    maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

    // vendor info
    glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
    renderer: gl.getParameter(GL_RENDERER),
    vendor: gl.getParameter(GL_VENDOR),
    version: gl.getParameter(GL_VERSION),

    // quirks
    readFloat: readFloat,
    npotTextureCube: npotTextureCube
  }
};

function isNDArrayLike (obj) {
  return (
    !!obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.shape) &&
    Array.isArray(obj.stride) &&
    typeof obj.offset === 'number' &&
    obj.shape.length === obj.stride.length &&
    (Array.isArray(obj.data) ||
      isTypedArray(obj.data)))
}

var values = function (obj) {
  return Object.keys(obj).map(function (key) { return obj[key] })
};

var flattenUtils = {
  shape: arrayShape$1,
  flatten: flattenArray
};

function flatten1D (array, nx, out) {
  for (var i = 0; i < nx; ++i) {
    out[i] = array[i];
  }
}

function flatten2D (array, nx, ny, out) {
  var ptr = 0;
  for (var i = 0; i < nx; ++i) {
    var row = array[i];
    for (var j = 0; j < ny; ++j) {
      out[ptr++] = row[j];
    }
  }
}

function flatten3D (array, nx, ny, nz, out, ptr_) {
  var ptr = ptr_;
  for (var i = 0; i < nx; ++i) {
    var row = array[i];
    for (var j = 0; j < ny; ++j) {
      var col = row[j];
      for (var k = 0; k < nz; ++k) {
        out[ptr++] = col[k];
      }
    }
  }
}

function flattenRec (array, shape, level, out, ptr) {
  var stride = 1;
  for (var i = level + 1; i < shape.length; ++i) {
    stride *= shape[i];
  }
  var n = shape[level];
  if (shape.length - level === 4) {
    var nx = shape[level + 1];
    var ny = shape[level + 2];
    var nz = shape[level + 3];
    for (i = 0; i < n; ++i) {
      flatten3D(array[i], nx, ny, nz, out, ptr);
      ptr += stride;
    }
  } else {
    for (i = 0; i < n; ++i) {
      flattenRec(array[i], shape, level + 1, out, ptr);
      ptr += stride;
    }
  }
}

function flattenArray (array, shape, type, out_) {
  var sz = 1;
  if (shape.length) {
    for (var i = 0; i < shape.length; ++i) {
      sz *= shape[i];
    }
  } else {
    sz = 0;
  }
  var out = out_ || pool.allocType(type, sz);
  switch (shape.length) {
    case 0:
      break
    case 1:
      flatten1D(array, shape[0], out);
      break
    case 2:
      flatten2D(array, shape[0], shape[1], out);
      break
    case 3:
      flatten3D(array, shape[0], shape[1], shape[2], out, 0);
      break
    default:
      flattenRec(array, shape, 0, out, 0);
  }
  return out
}

function arrayShape$1 (array_) {
  var shape = [];
  for (var array = array_; array.length; array = array[0]) {
    shape.push(array.length);
  }
  return shape
}

var arrayTypes = {
	"[object Int8Array]": 5120,
	"[object Int16Array]": 5122,
	"[object Int32Array]": 5124,
	"[object Uint8Array]": 5121,
	"[object Uint8ClampedArray]": 5121,
	"[object Uint16Array]": 5123,
	"[object Uint32Array]": 5125,
	"[object Float32Array]": 5126,
	"[object Float64Array]": 5121,
	"[object ArrayBuffer]": 5121
};

var int8 = 5120;
var int16 = 5122;
var int32 = 5124;
var uint8 = 5121;
var uint16 = 5123;
var uint32 = 5125;
var float = 5126;
var float32 = 5126;
var glTypes = {
	int8: int8,
	int16: int16,
	int32: int32,
	uint8: uint8,
	uint16: uint16,
	uint32: uint32,
	float: float,
	float32: float32
};

var dynamic$1 = 35048;
var stream = 35040;
var usageTypes = {
	dynamic: dynamic$1,
	stream: stream,
	"static": 35044
};

var arrayFlatten = flattenUtils.flatten;
var arrayShape = flattenUtils.shape;

var GL_STATIC_DRAW = 0x88E4;
var GL_STREAM_DRAW = 0x88E0;

var GL_UNSIGNED_BYTE$3 = 5121;
var GL_FLOAT$3 = 5126;

var DTYPES_SIZES = [];
DTYPES_SIZES[5120] = 1; // int8
DTYPES_SIZES[5122] = 2; // int16
DTYPES_SIZES[5124] = 4; // int32
DTYPES_SIZES[5121] = 1; // uint8
DTYPES_SIZES[5123] = 2; // uint16
DTYPES_SIZES[5125] = 4; // uint32
DTYPES_SIZES[5126] = 4; // float32

function typedArrayCode (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function copyArray (out, inp) {
  for (var i = 0; i < inp.length; ++i) {
    out[i] = inp[i];
  }
}

function transpose (
  result, data, shapeX, shapeY, strideX, strideY, offset) {
  var ptr = 0;
  for (var i = 0; i < shapeX; ++i) {
    for (var j = 0; j < shapeY; ++j) {
      result[ptr++] = data[strideX * i + strideY * j + offset];
    }
  }
}

function wrapBufferState (gl, stats, config, attributeState) {
  var bufferCount = 0;
  var bufferSet = {};

  function REGLBuffer (type) {
    this.id = bufferCount++;
    this.buffer = gl.createBuffer();
    this.type = type;
    this.usage = GL_STATIC_DRAW;
    this.byteLength = 0;
    this.dimension = 1;
    this.dtype = GL_UNSIGNED_BYTE$3;

    this.persistentData = null;

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  REGLBuffer.prototype.bind = function () {
    gl.bindBuffer(this.type, this.buffer);
  };

  REGLBuffer.prototype.destroy = function () {
    destroy(this);
  };

  var streamPool = [];

  function createStream (type, data) {
    var buffer = streamPool.pop();
    if (!buffer) {
      buffer = new REGLBuffer(type);
    }
    buffer.bind();
    initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
    return buffer
  }

  function destroyStream (stream$$1) {
    streamPool.push(stream$$1);
  }

  function initBufferFromTypedArray (buffer, data, usage) {
    buffer.byteLength = data.byteLength;
    gl.bufferData(buffer.type, data, usage);
  }

  function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
    var shape;
    buffer.usage = usage;
    if (Array.isArray(data)) {
      buffer.dtype = dtype || GL_FLOAT$3;
      if (data.length > 0) {
        var flatData;
        if (Array.isArray(data[0])) {
          shape = arrayShape(data);
          var dim = 1;
          for (var i = 1; i < shape.length; ++i) {
            dim *= shape[i];
          }
          buffer.dimension = dim;
          flatData = arrayFlatten(data, shape, buffer.dtype);
          initBufferFromTypedArray(buffer, flatData, usage);
          if (persist) {
            buffer.persistentData = flatData;
          } else {
            pool.freeType(flatData);
          }
        } else if (typeof data[0] === 'number') {
          buffer.dimension = dimension;
          var typedData = pool.allocType(buffer.dtype, data.length);
          copyArray(typedData, data);
          initBufferFromTypedArray(buffer, typedData, usage);
          if (persist) {
            buffer.persistentData = typedData;
          } else {
            pool.freeType(typedData);
          }
        } else if (isTypedArray(data[0])) {
          buffer.dimension = data[0].length;
          buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
          flatData = arrayFlatten(
            data,
            [data.length, data[0].length],
            buffer.dtype);
          initBufferFromTypedArray(buffer, flatData, usage);
          if (persist) {
            buffer.persistentData = flatData;
          } else {
            pool.freeType(flatData);
          }
        } else {
          check$1.raise('invalid buffer data');
        }
      }
    } else if (isTypedArray(data)) {
      buffer.dtype = dtype || typedArrayCode(data);
      buffer.dimension = dimension;
      initBufferFromTypedArray(buffer, data, usage);
      if (persist) {
        buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
      }
    } else if (isNDArrayLike(data)) {
      shape = data.shape;
      var stride = data.stride;
      var offset = data.offset;

      var shapeX = 0;
      var shapeY = 0;
      var strideX = 0;
      var strideY = 0;
      if (shape.length === 1) {
        shapeX = shape[0];
        shapeY = 1;
        strideX = stride[0];
        strideY = 0;
      } else if (shape.length === 2) {
        shapeX = shape[0];
        shapeY = shape[1];
        strideX = stride[0];
        strideY = stride[1];
      } else {
        check$1.raise('invalid shape');
      }

      buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
      buffer.dimension = shapeY;

      var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
      transpose(transposeData,
        data.data,
        shapeX, shapeY,
        strideX, strideY,
        offset);
      initBufferFromTypedArray(buffer, transposeData, usage);
      if (persist) {
        buffer.persistentData = transposeData;
      } else {
        pool.freeType(transposeData);
      }
    } else {
      check$1.raise('invalid buffer data');
    }
  }

  function destroy (buffer) {
    stats.bufferCount--;

    for (var i = 0; i < attributeState.state.length; ++i) {
      var record = attributeState.state[i];
      if (record.buffer === buffer) {
        gl.disableVertexAttribArray(i);
        record.buffer = null;
      }
    }

    var handle = buffer.buffer;
    check$1(handle, 'buffer must not be deleted already');
    gl.deleteBuffer(handle);
    buffer.buffer = null;
    delete bufferSet[buffer.id];
  }

  function createBuffer (options, type, deferInit, persistent) {
    stats.bufferCount++;

    var buffer = new REGLBuffer(type);
    bufferSet[buffer.id] = buffer;

    function reglBuffer (options) {
      var usage = GL_STATIC_DRAW;
      var data = null;
      var byteLength = 0;
      var dtype = 0;
      var dimension = 1;
      if (Array.isArray(options) ||
          isTypedArray(options) ||
          isNDArrayLike(options)) {
        data = options;
      } else if (typeof options === 'number') {
        byteLength = options | 0;
      } else if (options) {
        check$1.type(
          options, 'object',
          'buffer arguments must be an object, a number or an array');

        if ('data' in options) {
          check$1(
            data === null ||
            Array.isArray(data) ||
            isTypedArray(data) ||
            isNDArrayLike(data),
            'invalid data for buffer');
          data = options.data;
        }

        if ('usage' in options) {
          check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
          usage = usageTypes[options.usage];
        }

        if ('type' in options) {
          check$1.parameter(options.type, glTypes, 'invalid buffer type');
          dtype = glTypes[options.type];
        }

        if ('dimension' in options) {
          check$1.type(options.dimension, 'number', 'invalid dimension');
          dimension = options.dimension | 0;
        }

        if ('length' in options) {
          check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
          byteLength = options.length | 0;
        }
      }

      buffer.bind();
      if (!data) {
        // #475
        if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
        buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
        buffer.usage = usage;
        buffer.dimension = dimension;
        buffer.byteLength = byteLength;
      } else {
        initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
      }

      if (config.profile) {
        buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
      }

      return reglBuffer
    }

    function setSubData (data, offset) {
      check$1(offset + data.byteLength <= buffer.byteLength,
        'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

      gl.bufferSubData(buffer.type, offset, data);
    }

    function subdata (data, offset_) {
      var offset = (offset_ || 0) | 0;
      var shape;
      buffer.bind();
      if (isTypedArray(data)) {
        setSubData(data, offset);
      } else if (Array.isArray(data)) {
        if (data.length > 0) {
          if (typeof data[0] === 'number') {
            var converted = pool.allocType(buffer.dtype, data.length);
            copyArray(converted, data);
            setSubData(converted, offset);
            pool.freeType(converted);
          } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
            shape = arrayShape(data);
            var flatData = arrayFlatten(data, shape, buffer.dtype);
            setSubData(flatData, offset);
            pool.freeType(flatData);
          } else {
            check$1.raise('invalid buffer data');
          }
        }
      } else if (isNDArrayLike(data)) {
        shape = data.shape;
        var stride = data.stride;

        var shapeX = 0;
        var shapeY = 0;
        var strideX = 0;
        var strideY = 0;
        if (shape.length === 1) {
          shapeX = shape[0];
          shapeY = 1;
          strideX = stride[0];
          strideY = 0;
        } else if (shape.length === 2) {
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
        } else {
          check$1.raise('invalid shape');
        }
        var dtype = Array.isArray(data.data)
          ? buffer.dtype
          : typedArrayCode(data.data);

        var transposeData = pool.allocType(dtype, shapeX * shapeY);
        transpose(transposeData,
          data.data,
          shapeX, shapeY,
          strideX, strideY,
          data.offset);
        setSubData(transposeData, offset);
        pool.freeType(transposeData);
      } else {
        check$1.raise('invalid data for buffer subdata');
      }
      return reglBuffer
    }

    if (!deferInit) {
      reglBuffer(options);
    }

    reglBuffer._reglType = 'buffer';
    reglBuffer._buffer = buffer;
    reglBuffer.subdata = subdata;
    if (config.profile) {
      reglBuffer.stats = buffer.stats;
    }
    reglBuffer.destroy = function () { destroy(buffer); };

    return reglBuffer
  }

  function restoreBuffers () {
    values(bufferSet).forEach(function (buffer) {
      buffer.buffer = gl.createBuffer();
      gl.bindBuffer(buffer.type, buffer.buffer);
      gl.bufferData(
        buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
    });
  }

  if (config.profile) {
    stats.getTotalBufferSize = function () {
      var total = 0;
      // TODO: Right now, the streams are not part of the total count.
      Object.keys(bufferSet).forEach(function (key) {
        total += bufferSet[key].stats.size;
      });
      return total
    };
  }

  return {
    create: createBuffer,

    createStream: createStream,
    destroyStream: destroyStream,

    clear: function () {
      values(bufferSet).forEach(destroy);
      streamPool.forEach(destroy);
    },

    getBuffer: function (wrapper) {
      if (wrapper && wrapper._buffer instanceof REGLBuffer) {
        return wrapper._buffer
      }
      return null
    },

    restore: restoreBuffers,

    _initBuffer: initBufferFromData
  }
}

var points = 0;
var point = 0;
var lines = 1;
var line = 1;
var triangles = 4;
var triangle = 4;
var primTypes = {
	points: points,
	point: point,
	lines: lines,
	line: line,
	triangles: triangles,
	triangle: triangle,
	"line loop": 2,
	"line strip": 3,
	"triangle strip": 5,
	"triangle fan": 6
};

var GL_POINTS = 0;
var GL_LINES = 1;
var GL_TRIANGLES = 4;

var GL_BYTE$2 = 5120;
var GL_UNSIGNED_BYTE$4 = 5121;
var GL_SHORT$2 = 5122;
var GL_UNSIGNED_SHORT$2 = 5123;
var GL_INT$2 = 5124;
var GL_UNSIGNED_INT$2 = 5125;

var GL_ELEMENT_ARRAY_BUFFER = 34963;

var GL_STREAM_DRAW$1 = 0x88E0;
var GL_STATIC_DRAW$1 = 0x88E4;

function wrapElementsState (gl, extensions, bufferState, stats) {
  var elementSet = {};
  var elementCount = 0;

  var elementTypes = {
    'uint8': GL_UNSIGNED_BYTE$4,
    'uint16': GL_UNSIGNED_SHORT$2
  };

  if (extensions.oes_element_index_uint) {
    elementTypes.uint32 = GL_UNSIGNED_INT$2;
  }

  function REGLElementBuffer (buffer) {
    this.id = elementCount++;
    elementSet[this.id] = this;
    this.buffer = buffer;
    this.primType = GL_TRIANGLES;
    this.vertCount = 0;
    this.type = 0;
  }

  REGLElementBuffer.prototype.bind = function () {
    this.buffer.bind();
  };

  var bufferPool = [];

  function createElementStream (data) {
    var result = bufferPool.pop();
    if (!result) {
      result = new REGLElementBuffer(bufferState.create(
        null,
        GL_ELEMENT_ARRAY_BUFFER,
        true,
        false)._buffer);
    }
    initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
    return result
  }

  function destroyElementStream (elements) {
    bufferPool.push(elements);
  }

  function initElements (
    elements,
    data,
    usage,
    prim,
    count,
    byteLength,
    type) {
    elements.buffer.bind();
    if (data) {
      var predictedType = type;
      if (!type && (
          !isTypedArray(data) ||
         (isNDArrayLike(data) && !isTypedArray(data.data)))) {
        predictedType = extensions.oes_element_index_uint
          ? GL_UNSIGNED_INT$2
          : GL_UNSIGNED_SHORT$2;
      }
      bufferState._initBuffer(
        elements.buffer,
        data,
        usage,
        predictedType,
        3);
    } else {
      gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
      elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
      elements.buffer.usage = usage;
      elements.buffer.dimension = 3;
      elements.buffer.byteLength = byteLength;
    }

    var dtype = type;
    if (!type) {
      switch (elements.buffer.dtype) {
        case GL_UNSIGNED_BYTE$4:
        case GL_BYTE$2:
          dtype = GL_UNSIGNED_BYTE$4;
          break

        case GL_UNSIGNED_SHORT$2:
        case GL_SHORT$2:
          dtype = GL_UNSIGNED_SHORT$2;
          break

        case GL_UNSIGNED_INT$2:
        case GL_INT$2:
          dtype = GL_UNSIGNED_INT$2;
          break

        default:
          check$1.raise('unsupported type for element array');
      }
      elements.buffer.dtype = dtype;
    }
    elements.type = dtype;

    // Check oes_element_index_uint extension
    check$1(
      dtype !== GL_UNSIGNED_INT$2 ||
      !!extensions.oes_element_index_uint,
      '32 bit element buffers not supported, enable oes_element_index_uint first');

    // try to guess default primitive type and arguments
    var vertCount = count;
    if (vertCount < 0) {
      vertCount = elements.buffer.byteLength;
      if (dtype === GL_UNSIGNED_SHORT$2) {
        vertCount >>= 1;
      } else if (dtype === GL_UNSIGNED_INT$2) {
        vertCount >>= 2;
      }
    }
    elements.vertCount = vertCount;

    // try to guess primitive type from cell dimension
    var primType = prim;
    if (prim < 0) {
      primType = GL_TRIANGLES;
      var dimension = elements.buffer.dimension;
      if (dimension === 1) primType = GL_POINTS;
      if (dimension === 2) primType = GL_LINES;
      if (dimension === 3) primType = GL_TRIANGLES;
    }
    elements.primType = primType;
  }

  function destroyElements (elements) {
    stats.elementsCount--;

    check$1(elements.buffer !== null, 'must not double destroy elements');
    delete elementSet[elements.id];
    elements.buffer.destroy();
    elements.buffer = null;
  }

  function createElements (options, persistent) {
    var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
    var elements = new REGLElementBuffer(buffer._buffer);
    stats.elementsCount++;

    function reglElements (options) {
      if (!options) {
        buffer();
        elements.primType = GL_TRIANGLES;
        elements.vertCount = 0;
        elements.type = GL_UNSIGNED_BYTE$4;
      } else if (typeof options === 'number') {
        buffer(options);
        elements.primType = GL_TRIANGLES;
        elements.vertCount = options | 0;
        elements.type = GL_UNSIGNED_BYTE$4;
      } else {
        var data = null;
        var usage = GL_STATIC_DRAW$1;
        var primType = -1;
        var vertCount = -1;
        var byteLength = 0;
        var dtype = 0;
        if (Array.isArray(options) ||
            isTypedArray(options) ||
            isNDArrayLike(options)) {
          data = options;
        } else {
          check$1.type(options, 'object', 'invalid arguments for elements');
          if ('data' in options) {
            data = options.data;
            check$1(
                Array.isArray(data) ||
                isTypedArray(data) ||
                isNDArrayLike(data),
                'invalid data for element buffer');
          }
          if ('usage' in options) {
            check$1.parameter(
              options.usage,
              usageTypes,
              'invalid element buffer usage');
            usage = usageTypes[options.usage];
          }
          if ('primitive' in options) {
            check$1.parameter(
              options.primitive,
              primTypes,
              'invalid element buffer primitive');
            primType = primTypes[options.primitive];
          }
          if ('count' in options) {
            check$1(
              typeof options.count === 'number' && options.count >= 0,
              'invalid vertex count for elements');
            vertCount = options.count | 0;
          }
          if ('type' in options) {
            check$1.parameter(
              options.type,
              elementTypes,
              'invalid buffer type');
            dtype = elementTypes[options.type];
          }
          if ('length' in options) {
            byteLength = options.length | 0;
          } else {
            byteLength = vertCount;
            if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
              byteLength *= 2;
            } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
              byteLength *= 4;
            }
          }
        }
        initElements(
          elements,
          data,
          usage,
          primType,
          vertCount,
          byteLength,
          dtype);
      }

      return reglElements
    }

    reglElements(options);

    reglElements._reglType = 'elements';
    reglElements._elements = elements;
    reglElements.subdata = function (data, offset) {
      buffer.subdata(data, offset);
      return reglElements
    };
    reglElements.destroy = function () {
      destroyElements(elements);
    };

    return reglElements
  }

  return {
    create: createElements,
    createStream: createElementStream,
    destroyStream: destroyElementStream,
    getElements: function (elements) {
      if (typeof elements === 'function' &&
          elements._elements instanceof REGLElementBuffer) {
        return elements._elements
      }
      return null
    },
    clear: function () {
      values(elementSet).forEach(destroyElements);
    }
  }
}

var FLOAT = new Float32Array(1);
var INT = new Uint32Array(FLOAT.buffer);

var GL_UNSIGNED_SHORT$4 = 5123;

function convertToHalfFloat (array) {
  var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

  for (var i = 0; i < array.length; ++i) {
    if (isNaN(array[i])) {
      ushorts[i] = 0xffff;
    } else if (array[i] === Infinity) {
      ushorts[i] = 0x7c00;
    } else if (array[i] === -Infinity) {
      ushorts[i] = 0xfc00;
    } else {
      FLOAT[0] = array[i];
      var x = INT[0];

      var sgn = (x >>> 31) << 15;
      var exp = ((x << 1) >>> 24) - 127;
      var frac = (x >> 13) & ((1 << 10) - 1);

      if (exp < -24) {
        // round non-representable denormals to 0
        ushorts[i] = sgn;
      } else if (exp < -14) {
        // handle denormals
        var s = -14 - exp;
        ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
      } else if (exp > 15) {
        // round overflow to +/- Infinity
        ushorts[i] = sgn + 0x7c00;
      } else {
        // otherwise convert directly
        ushorts[i] = sgn + ((exp + 15) << 10) + frac;
      }
    }
  }

  return ushorts
}

function isArrayLike (s) {
  return Array.isArray(s) || isTypedArray(s)
}

var isPow2$1 = function (v) {
  return !(v & (v - 1)) && (!!v)
};

var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

var GL_TEXTURE_2D$1 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

var GL_RGBA$1 = 0x1908;
var GL_ALPHA = 0x1906;
var GL_RGB = 0x1907;
var GL_LUMINANCE = 0x1909;
var GL_LUMINANCE_ALPHA = 0x190A;

var GL_RGBA4 = 0x8056;
var GL_RGB5_A1 = 0x8057;
var GL_RGB565 = 0x8D62;

var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

var GL_DEPTH_COMPONENT = 0x1902;
var GL_DEPTH_STENCIL = 0x84F9;

var GL_SRGB_EXT = 0x8C40;
var GL_SRGB_ALPHA_EXT = 0x8C42;

var GL_HALF_FLOAT_OES$1 = 0x8D61;

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

var GL_UNSIGNED_BYTE$5 = 0x1401;
var GL_UNSIGNED_SHORT$3 = 0x1403;
var GL_UNSIGNED_INT$3 = 0x1405;
var GL_FLOAT$4 = 0x1406;

var GL_TEXTURE_WRAP_S = 0x2802;
var GL_TEXTURE_WRAP_T = 0x2803;

var GL_REPEAT = 0x2901;
var GL_CLAMP_TO_EDGE$1 = 0x812F;
var GL_MIRRORED_REPEAT = 0x8370;

var GL_TEXTURE_MAG_FILTER = 0x2800;
var GL_TEXTURE_MIN_FILTER = 0x2801;

var GL_NEAREST$1 = 0x2600;
var GL_LINEAR = 0x2601;
var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

var GL_GENERATE_MIPMAP_HINT = 0x8192;
var GL_DONT_CARE = 0x1100;
var GL_FASTEST = 0x1101;
var GL_NICEST = 0x1102;

var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

var GL_UNPACK_ALIGNMENT = 0x0CF5;
var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

var GL_TEXTURE0$1 = 0x84C0;

var MIPMAP_FILTERS = [
  GL_NEAREST_MIPMAP_NEAREST$1,
  GL_NEAREST_MIPMAP_LINEAR$1,
  GL_LINEAR_MIPMAP_NEAREST$1,
  GL_LINEAR_MIPMAP_LINEAR$1
];

var CHANNELS_FORMAT = [
  0,
  GL_LUMINANCE,
  GL_LUMINANCE_ALPHA,
  GL_RGB,
  GL_RGBA$1
];

var FORMAT_CHANNELS = {};
FORMAT_CHANNELS[GL_LUMINANCE] =
FORMAT_CHANNELS[GL_ALPHA] =
FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
FORMAT_CHANNELS[GL_RGB] =
FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
FORMAT_CHANNELS[GL_RGBA$1] =
FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

function objectName (str) {
  return '[object ' + str + ']'
}

var CANVAS_CLASS = objectName('HTMLCanvasElement');
var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
var BITMAP_CLASS = objectName('ImageBitmap');
var IMAGE_CLASS = objectName('HTMLImageElement');
var VIDEO_CLASS = objectName('HTMLVideoElement');

var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
  CANVAS_CLASS,
  CONTEXT2D_CLASS,
  BITMAP_CLASS,
  IMAGE_CLASS,
  VIDEO_CLASS
]);

// for every texture type, store
// the size in bytes.
var TYPE_SIZES = [];
TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
TYPE_SIZES[GL_FLOAT$4] = 4;
TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

var FORMAT_SIZES_SPECIAL = [];
FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

function isNumericArray (arr) {
  return (
    Array.isArray(arr) &&
    (arr.length === 0 ||
    typeof arr[0] === 'number'))
}

function isRectArray (arr) {
  if (!Array.isArray(arr)) {
    return false
  }
  var width = arr.length;
  if (width === 0 || !isArrayLike(arr[0])) {
    return false
  }
  return true
}

function classString (x) {
  return Object.prototype.toString.call(x)
}

function isCanvasElement (object) {
  return classString(object) === CANVAS_CLASS
}

function isContext2D (object) {
  return classString(object) === CONTEXT2D_CLASS
}

function isBitmap (object) {
  return classString(object) === BITMAP_CLASS
}

function isImageElement (object) {
  return classString(object) === IMAGE_CLASS
}

function isVideoElement (object) {
  return classString(object) === VIDEO_CLASS
}

function isPixelData (object) {
  if (!object) {
    return false
  }
  var className = classString(object);
  if (PIXEL_CLASSES.indexOf(className) >= 0) {
    return true
  }
  return (
    isNumericArray(object) ||
    isRectArray(object) ||
    isNDArrayLike(object))
}

function typedArrayCode$1 (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function convertData (result, data) {
  var n = data.length;
  switch (result.type) {
    case GL_UNSIGNED_BYTE$5:
    case GL_UNSIGNED_SHORT$3:
    case GL_UNSIGNED_INT$3:
    case GL_FLOAT$4:
      var converted = pool.allocType(result.type, n);
      converted.set(data);
      result.data = converted;
      break

    case GL_HALF_FLOAT_OES$1:
      result.data = convertToHalfFloat(data);
      break

    default:
      check$1.raise('unsupported texture type, must specify a typed array');
  }
}

function preConvert (image, n) {
  return pool.allocType(
    image.type === GL_HALF_FLOAT_OES$1
      ? GL_FLOAT$4
      : image.type, n)
}

function postConvert (image, data) {
  if (image.type === GL_HALF_FLOAT_OES$1) {
    image.data = convertToHalfFloat(data);
    pool.freeType(data);
  } else {
    image.data = data;
  }
}

function transposeData (image, array, strideX, strideY, strideC, offset) {
  var w = image.width;
  var h = image.height;
  var c = image.channels;
  var n = w * h * c;
  var data = preConvert(image, n);

  var p = 0;
  for (var i = 0; i < h; ++i) {
    for (var j = 0; j < w; ++j) {
      for (var k = 0; k < c; ++k) {
        data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
      }
    }
  }

  postConvert(image, data);
}

function getTextureSize (format, type, width, height, isMipmap, isCube) {
  var s;
  if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
    // we have a special array for dealing with weird color formats such as RGB5A1
    s = FORMAT_SIZES_SPECIAL[format];
  } else {
    s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
  }

  if (isCube) {
    s *= 6;
  }

  if (isMipmap) {
    // compute the total size of all the mipmaps.
    var total = 0;

    var w = width;
    while (w >= 1) {
      // we can only use mipmaps on a square image,
      // so we can simply use the width and ignore the height:
      total += s * w * w;
      w /= 2;
    }
    return total
  } else {
    return s * width * height
  }
}

function createTextureSet (
  gl, extensions, limits, reglPoll, contextState, stats, config) {
  // -------------------------------------------------------
  // Initialize constants and parameter tables here
  // -------------------------------------------------------
  var mipmapHint = {
    "don't care": GL_DONT_CARE,
    'dont care': GL_DONT_CARE,
    'nice': GL_NICEST,
    'fast': GL_FASTEST
  };

  var wrapModes = {
    'repeat': GL_REPEAT,
    'clamp': GL_CLAMP_TO_EDGE$1,
    'mirror': GL_MIRRORED_REPEAT
  };

  var magFilters = {
    'nearest': GL_NEAREST$1,
    'linear': GL_LINEAR
  };

  var minFilters = extend({
    'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
    'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
    'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
    'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
    'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
  }, magFilters);

  var colorSpace = {
    'none': 0,
    'browser': GL_BROWSER_DEFAULT_WEBGL
  };

  var textureTypes = {
    'uint8': GL_UNSIGNED_BYTE$5,
    'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
    'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
    'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
  };

  var textureFormats = {
    'alpha': GL_ALPHA,
    'luminance': GL_LUMINANCE,
    'luminance alpha': GL_LUMINANCE_ALPHA,
    'rgb': GL_RGB,
    'rgba': GL_RGBA$1,
    'rgba4': GL_RGBA4,
    'rgb5 a1': GL_RGB5_A1,
    'rgb565': GL_RGB565
  };

  var compressedTextureFormats = {};

  if (extensions.ext_srgb) {
    textureFormats.srgb = GL_SRGB_EXT;
    textureFormats.srgba = GL_SRGB_ALPHA_EXT;
  }

  if (extensions.oes_texture_float) {
    textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
  }

  if (extensions.oes_texture_half_float) {
    textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
  }

  if (extensions.webgl_depth_texture) {
    extend(textureFormats, {
      'depth': GL_DEPTH_COMPONENT,
      'depth stencil': GL_DEPTH_STENCIL
    });

    extend(textureTypes, {
      'uint16': GL_UNSIGNED_SHORT$3,
      'uint32': GL_UNSIGNED_INT$3,
      'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
    });
  }

  if (extensions.webgl_compressed_texture_s3tc) {
    extend(compressedTextureFormats, {
      'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
      'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
      'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
      'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
    });
  }

  if (extensions.webgl_compressed_texture_atc) {
    extend(compressedTextureFormats, {
      'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
      'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
      'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
    });
  }

  if (extensions.webgl_compressed_texture_pvrtc) {
    extend(compressedTextureFormats, {
      'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
      'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
      'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
      'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
    });
  }

  if (extensions.webgl_compressed_texture_etc1) {
    compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
  }

  // Copy over all texture formats
  var supportedCompressedFormats = Array.prototype.slice.call(
    gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
  Object.keys(compressedTextureFormats).forEach(function (name) {
    var format = compressedTextureFormats[name];
    if (supportedCompressedFormats.indexOf(format) >= 0) {
      textureFormats[name] = format;
    }
  });

  var supportedFormats = Object.keys(textureFormats);
  limits.textureFormats = supportedFormats;

  // associate with every format string its
  // corresponding GL-value.
  var textureFormatsInvert = [];
  Object.keys(textureFormats).forEach(function (key) {
    var val = textureFormats[key];
    textureFormatsInvert[val] = key;
  });

  // associate with every type string its
  // corresponding GL-value.
  var textureTypesInvert = [];
  Object.keys(textureTypes).forEach(function (key) {
    var val = textureTypes[key];
    textureTypesInvert[val] = key;
  });

  var magFiltersInvert = [];
  Object.keys(magFilters).forEach(function (key) {
    var val = magFilters[key];
    magFiltersInvert[val] = key;
  });

  var minFiltersInvert = [];
  Object.keys(minFilters).forEach(function (key) {
    var val = minFilters[key];
    minFiltersInvert[val] = key;
  });

  var wrapModesInvert = [];
  Object.keys(wrapModes).forEach(function (key) {
    var val = wrapModes[key];
    wrapModesInvert[val] = key;
  });

  // colorFormats[] gives the format (channels) associated to an
  // internalformat
  var colorFormats = supportedFormats.reduce(function (color, key) {
    var glenum = textureFormats[key];
    if (glenum === GL_LUMINANCE ||
        glenum === GL_ALPHA ||
        glenum === GL_LUMINANCE ||
        glenum === GL_LUMINANCE_ALPHA ||
        glenum === GL_DEPTH_COMPONENT ||
        glenum === GL_DEPTH_STENCIL) {
      color[glenum] = glenum;
    } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
      color[glenum] = GL_RGBA$1;
    } else {
      color[glenum] = GL_RGB;
    }
    return color
  }, {});

  function TexFlags () {
    // format info
    this.internalformat = GL_RGBA$1;
    this.format = GL_RGBA$1;
    this.type = GL_UNSIGNED_BYTE$5;
    this.compressed = false;

    // pixel storage
    this.premultiplyAlpha = false;
    this.flipY = false;
    this.unpackAlignment = 1;
    this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

    // shape info
    this.width = 0;
    this.height = 0;
    this.channels = 0;
  }

  function copyFlags (result, other) {
    result.internalformat = other.internalformat;
    result.format = other.format;
    result.type = other.type;
    result.compressed = other.compressed;

    result.premultiplyAlpha = other.premultiplyAlpha;
    result.flipY = other.flipY;
    result.unpackAlignment = other.unpackAlignment;
    result.colorSpace = other.colorSpace;

    result.width = other.width;
    result.height = other.height;
    result.channels = other.channels;
  }

  function parseFlags (flags, options) {
    if (typeof options !== 'object' || !options) {
      return
    }

    if ('premultiplyAlpha' in options) {
      check$1.type(options.premultiplyAlpha, 'boolean',
        'invalid premultiplyAlpha');
      flags.premultiplyAlpha = options.premultiplyAlpha;
    }

    if ('flipY' in options) {
      check$1.type(options.flipY, 'boolean',
        'invalid texture flip');
      flags.flipY = options.flipY;
    }

    if ('alignment' in options) {
      check$1.oneOf(options.alignment, [1, 2, 4, 8],
        'invalid texture unpack alignment');
      flags.unpackAlignment = options.alignment;
    }

    if ('colorSpace' in options) {
      check$1.parameter(options.colorSpace, colorSpace,
        'invalid colorSpace');
      flags.colorSpace = colorSpace[options.colorSpace];
    }

    if ('type' in options) {
      var type = options.type;
      check$1(extensions.oes_texture_float ||
        !(type === 'float' || type === 'float32'),
        'you must enable the OES_texture_float extension in order to use floating point textures.');
      check$1(extensions.oes_texture_half_float ||
        !(type === 'half float' || type === 'float16'),
        'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
      check$1(extensions.webgl_depth_texture ||
        !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
        'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
      check$1.parameter(type, textureTypes,
        'invalid texture type');
      flags.type = textureTypes[type];
    }

    var w = flags.width;
    var h = flags.height;
    var c = flags.channels;
    var hasChannels = false;
    if ('shape' in options) {
      check$1(Array.isArray(options.shape) && options.shape.length >= 2,
        'shape must be an array');
      w = options.shape[0];
      h = options.shape[1];
      if (options.shape.length === 3) {
        c = options.shape[2];
        check$1(c > 0 && c <= 4, 'invalid number of channels');
        hasChannels = true;
      }
      check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
      check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
    } else {
      if ('radius' in options) {
        w = h = options.radius;
        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
      }
      if ('width' in options) {
        w = options.width;
        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
      }
      if ('height' in options) {
        h = options.height;
        check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
      }
      if ('channels' in options) {
        c = options.channels;
        check$1(c > 0 && c <= 4, 'invalid number of channels');
        hasChannels = true;
      }
    }
    flags.width = w | 0;
    flags.height = h | 0;
    flags.channels = c | 0;

    var hasFormat = false;
    if ('format' in options) {
      var formatStr = options.format;
      check$1(extensions.webgl_depth_texture ||
        !(formatStr === 'depth' || formatStr === 'depth stencil'),
        'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
      check$1.parameter(formatStr, textureFormats,
        'invalid texture format');
      var internalformat = flags.internalformat = textureFormats[formatStr];
      flags.format = colorFormats[internalformat];
      if (formatStr in textureTypes) {
        if (!('type' in options)) {
          flags.type = textureTypes[formatStr];
        }
      }
      if (formatStr in compressedTextureFormats) {
        flags.compressed = true;
      }
      hasFormat = true;
    }

    // Reconcile channels and format
    if (!hasChannels && hasFormat) {
      flags.channels = FORMAT_CHANNELS[flags.format];
    } else if (hasChannels && !hasFormat) {
      if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
        flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
      }
    } else if (hasFormat && hasChannels) {
      check$1(
        flags.channels === FORMAT_CHANNELS[flags.format],
        'number of channels inconsistent with specified format');
    }
  }

  function setFlags (flags) {
    gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
    gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
    gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
    gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
  }

  // -------------------------------------------------------
  // Tex image data
  // -------------------------------------------------------
  function TexImage () {
    TexFlags.call(this);

    this.xOffset = 0;
    this.yOffset = 0;

    // data
    this.data = null;
    this.needsFree = false;

    // html element
    this.element = null;

    // copyTexImage info
    this.needsCopy = false;
  }

  function parseImage (image, options) {
    var data = null;
    if (isPixelData(options)) {
      data = options;
    } else if (options) {
      check$1.type(options, 'object', 'invalid pixel data type');
      parseFlags(image, options);
      if ('x' in options) {
        image.xOffset = options.x | 0;
      }
      if ('y' in options) {
        image.yOffset = options.y | 0;
      }
      if (isPixelData(options.data)) {
        data = options.data;
      }
    }

    check$1(
      !image.compressed ||
      data instanceof Uint8Array,
      'compressed texture data must be stored in a uint8array');

    if (options.copy) {
      check$1(!data, 'can not specify copy and data field for the same texture');
      var viewW = contextState.viewportWidth;
      var viewH = contextState.viewportHeight;
      image.width = image.width || (viewW - image.xOffset);
      image.height = image.height || (viewH - image.yOffset);
      image.needsCopy = true;
      check$1(image.xOffset >= 0 && image.xOffset < viewW &&
            image.yOffset >= 0 && image.yOffset < viewH &&
            image.width > 0 && image.width <= viewW &&
            image.height > 0 && image.height <= viewH,
            'copy texture read out of bounds');
    } else if (!data) {
      image.width = image.width || 1;
      image.height = image.height || 1;
      image.channels = image.channels || 4;
    } else if (isTypedArray(data)) {
      image.channels = image.channels || 4;
      image.data = data;
      if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
        image.type = typedArrayCode$1(data);
      }
    } else if (isNumericArray(data)) {
      image.channels = image.channels || 4;
      convertData(image, data);
      image.alignment = 1;
      image.needsFree = true;
    } else if (isNDArrayLike(data)) {
      var array = data.data;
      if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
        image.type = typedArrayCode$1(array);
      }
      var shape = data.shape;
      var stride = data.stride;
      var shapeX, shapeY, shapeC, strideX, strideY, strideC;
      if (shape.length === 3) {
        shapeC = shape[2];
        strideC = stride[2];
      } else {
        check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
        shapeC = 1;
        strideC = 1;
      }
      shapeX = shape[0];
      shapeY = shape[1];
      strideX = stride[0];
      strideY = stride[1];
      image.alignment = 1;
      image.width = shapeX;
      image.height = shapeY;
      image.channels = shapeC;
      image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
      image.needsFree = true;
      transposeData(image, array, strideX, strideY, strideC, data.offset);
    } else if (isCanvasElement(data) || isContext2D(data)) {
      if (isCanvasElement(data)) {
        image.element = data;
      } else {
        image.element = data.canvas;
      }
      image.width = image.element.width;
      image.height = image.element.height;
      image.channels = 4;
    } else if (isBitmap(data)) {
      image.element = data;
      image.width = data.width;
      image.height = data.height;
      image.channels = 4;
    } else if (isImageElement(data)) {
      image.element = data;
      image.width = data.naturalWidth;
      image.height = data.naturalHeight;
      image.channels = 4;
    } else if (isVideoElement(data)) {
      image.element = data;
      image.width = data.videoWidth;
      image.height = data.videoHeight;
      image.channels = 4;
    } else if (isRectArray(data)) {
      var w = image.width || data[0].length;
      var h = image.height || data.length;
      var c = image.channels;
      if (isArrayLike(data[0][0])) {
        c = c || data[0][0].length;
      } else {
        c = c || 1;
      }
      var arrayShape = flattenUtils.shape(data);
      var n = 1;
      for (var dd = 0; dd < arrayShape.length; ++dd) {
        n *= arrayShape[dd];
      }
      var allocData = preConvert(image, n);
      flattenUtils.flatten(data, arrayShape, '', allocData);
      postConvert(image, allocData);
      image.alignment = 1;
      image.width = w;
      image.height = h;
      image.channels = c;
      image.format = image.internalformat = CHANNELS_FORMAT[c];
      image.needsFree = true;
    }

    if (image.type === GL_FLOAT$4) {
      check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
        'oes_texture_float extension not enabled');
    } else if (image.type === GL_HALF_FLOAT_OES$1) {
      check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
        'oes_texture_half_float extension not enabled');
    }

    // do compressed texture  validation here.
  }

  function setImage (info, target, miplevel) {
    var element = info.element;
    var data = info.data;
    var internalformat = info.internalformat;
    var format = info.format;
    var type = info.type;
    var width = info.width;
    var height = info.height;
    var channels = info.channels;

    setFlags(info);

    if (element) {
      gl.texImage2D(target, miplevel, format, format, type, element);
    } else if (info.compressed) {
      gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
    } else if (info.needsCopy) {
      reglPoll();
      gl.copyTexImage2D(
        target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
    } else {
      var nullData = !data;
      if (nullData) {
        data = pool.zero.allocType(type, width * height * channels);
      }

      gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data);

      if (nullData && data) {
        pool.zero.freeType(data);
      }
    }
  }

  function setSubImage (info, target, x, y, miplevel) {
    var element = info.element;
    var data = info.data;
    var internalformat = info.internalformat;
    var format = info.format;
    var type = info.type;
    var width = info.width;
    var height = info.height;

    setFlags(info);

    if (element) {
      gl.texSubImage2D(
        target, miplevel, x, y, format, type, element);
    } else if (info.compressed) {
      gl.compressedTexSubImage2D(
        target, miplevel, x, y, internalformat, width, height, data);
    } else if (info.needsCopy) {
      reglPoll();
      gl.copyTexSubImage2D(
        target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
    } else {
      gl.texSubImage2D(
        target, miplevel, x, y, width, height, format, type, data);
    }
  }

  // texImage pool
  var imagePool = [];

  function allocImage () {
    return imagePool.pop() || new TexImage()
  }

  function freeImage (image) {
    if (image.needsFree) {
      pool.freeType(image.data);
    }
    TexImage.call(image);
    imagePool.push(image);
  }

  // -------------------------------------------------------
  // Mip map
  // -------------------------------------------------------
  function MipMap () {
    TexFlags.call(this);

    this.genMipmaps = false;
    this.mipmapHint = GL_DONT_CARE;
    this.mipmask = 0;
    this.images = Array(16);
  }

  function parseMipMapFromShape (mipmap, width, height) {
    var img = mipmap.images[0] = allocImage();
    mipmap.mipmask = 1;
    img.width = mipmap.width = width;
    img.height = mipmap.height = height;
    img.channels = mipmap.channels = 4;
  }

  function parseMipMapFromObject (mipmap, options) {
    var imgData = null;
    if (isPixelData(options)) {
      imgData = mipmap.images[0] = allocImage();
      copyFlags(imgData, mipmap);
      parseImage(imgData, options);
      mipmap.mipmask = 1;
    } else {
      parseFlags(mipmap, options);
      if (Array.isArray(options.mipmap)) {
        var mipData = options.mipmap;
        for (var i = 0; i < mipData.length; ++i) {
          imgData = mipmap.images[i] = allocImage();
          copyFlags(imgData, mipmap);
          imgData.width >>= i;
          imgData.height >>= i;
          parseImage(imgData, mipData[i]);
          mipmap.mipmask |= (1 << i);
        }
      } else {
        imgData = mipmap.images[0] = allocImage();
        copyFlags(imgData, mipmap);
        parseImage(imgData, options);
        mipmap.mipmask = 1;
      }
    }
    copyFlags(mipmap, mipmap.images[0]);

    // For textures of the compressed format WEBGL_compressed_texture_s3tc
    // we must have that
    //
    // "When level equals zero width and height must be a multiple of 4.
    // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
    //
    // but we do not yet support having multiple mipmap levels for compressed textures,
    // so we only test for level zero.

    if (mipmap.compressed &&
        (mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT)) {
      check$1(mipmap.width % 4 === 0 &&
            mipmap.height % 4 === 0,
            'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
    }
  }

  function setMipMap (mipmap, target) {
    var images = mipmap.images;
    for (var i = 0; i < images.length; ++i) {
      if (!images[i]) {
        return
      }
      setImage(images[i], target, i);
    }
  }

  var mipPool = [];

  function allocMipMap () {
    var result = mipPool.pop() || new MipMap();
    TexFlags.call(result);
    result.mipmask = 0;
    for (var i = 0; i < 16; ++i) {
      result.images[i] = null;
    }
    return result
  }

  function freeMipMap (mipmap) {
    var images = mipmap.images;
    for (var i = 0; i < images.length; ++i) {
      if (images[i]) {
        freeImage(images[i]);
      }
      images[i] = null;
    }
    mipPool.push(mipmap);
  }

  // -------------------------------------------------------
  // Tex info
  // -------------------------------------------------------
  function TexInfo () {
    this.minFilter = GL_NEAREST$1;
    this.magFilter = GL_NEAREST$1;

    this.wrapS = GL_CLAMP_TO_EDGE$1;
    this.wrapT = GL_CLAMP_TO_EDGE$1;

    this.anisotropic = 1;

    this.genMipmaps = false;
    this.mipmapHint = GL_DONT_CARE;
  }

  function parseTexInfo (info, options) {
    if ('min' in options) {
      var minFilter = options.min;
      check$1.parameter(minFilter, minFilters);
      info.minFilter = minFilters[minFilter];
      if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
        info.genMipmaps = true;
      }
    }

    if ('mag' in options) {
      var magFilter = options.mag;
      check$1.parameter(magFilter, magFilters);
      info.magFilter = magFilters[magFilter];
    }

    var wrapS = info.wrapS;
    var wrapT = info.wrapT;
    if ('wrap' in options) {
      var wrap = options.wrap;
      if (typeof wrap === 'string') {
        check$1.parameter(wrap, wrapModes);
        wrapS = wrapT = wrapModes[wrap];
      } else if (Array.isArray(wrap)) {
        check$1.parameter(wrap[0], wrapModes);
        check$1.parameter(wrap[1], wrapModes);
        wrapS = wrapModes[wrap[0]];
        wrapT = wrapModes[wrap[1]];
      }
    } else {
      if ('wrapS' in options) {
        var optWrapS = options.wrapS;
        check$1.parameter(optWrapS, wrapModes);
        wrapS = wrapModes[optWrapS];
      }
      if ('wrapT' in options) {
        var optWrapT = options.wrapT;
        check$1.parameter(optWrapT, wrapModes);
        wrapT = wrapModes[optWrapT];
      }
    }
    info.wrapS = wrapS;
    info.wrapT = wrapT;

    if ('anisotropic' in options) {
      var anisotropic = options.anisotropic;
      check$1(typeof anisotropic === 'number' &&
         anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
        'aniso samples must be between 1 and ');
      info.anisotropic = options.anisotropic;
    }

    if ('mipmap' in options) {
      var hasMipMap = false;
      switch (typeof options.mipmap) {
        case 'string':
          check$1.parameter(options.mipmap, mipmapHint,
            'invalid mipmap hint');
          info.mipmapHint = mipmapHint[options.mipmap];
          info.genMipmaps = true;
          hasMipMap = true;
          break

        case 'boolean':
          hasMipMap = info.genMipmaps = options.mipmap;
          break

        case 'object':
          check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
          info.genMipmaps = false;
          hasMipMap = true;
          break

        default:
          check$1.raise('invalid mipmap type');
      }
      if (hasMipMap && !('min' in options)) {
        info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
      }
    }
  }

  function setTexInfo (info, target) {
    gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
    gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
    gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
    gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
    if (extensions.ext_texture_filter_anisotropic) {
      gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
    }
    if (info.genMipmaps) {
      gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
      gl.generateMipmap(target);
    }
  }

  // -------------------------------------------------------
  // Full texture object
  // -------------------------------------------------------
  var textureCount = 0;
  var textureSet = {};
  var numTexUnits = limits.maxTextureUnits;
  var textureUnits = Array(numTexUnits).map(function () {
    return null
  });

  function REGLTexture (target) {
    TexFlags.call(this);
    this.mipmask = 0;
    this.internalformat = GL_RGBA$1;

    this.id = textureCount++;

    this.refCount = 1;

    this.target = target;
    this.texture = gl.createTexture();

    this.unit = -1;
    this.bindCount = 0;

    this.texInfo = new TexInfo();

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  function tempBind (texture) {
    gl.activeTexture(GL_TEXTURE0$1);
    gl.bindTexture(texture.target, texture.texture);
  }

  function tempRestore () {
    var prev = textureUnits[0];
    if (prev) {
      gl.bindTexture(prev.target, prev.texture);
    } else {
      gl.bindTexture(GL_TEXTURE_2D$1, null);
    }
  }

  function destroy (texture) {
    var handle = texture.texture;
    check$1(handle, 'must not double destroy texture');
    var unit = texture.unit;
    var target = texture.target;
    if (unit >= 0) {
      gl.activeTexture(GL_TEXTURE0$1 + unit);
      gl.bindTexture(target, null);
      textureUnits[unit] = null;
    }
    gl.deleteTexture(handle);
    texture.texture = null;
    texture.params = null;
    texture.pixels = null;
    texture.refCount = 0;
    delete textureSet[texture.id];
    stats.textureCount--;
  }

  extend(REGLTexture.prototype, {
    bind: function () {
      var texture = this;
      texture.bindCount += 1;
      var unit = texture.unit;
      if (unit < 0) {
        for (var i = 0; i < numTexUnits; ++i) {
          var other = textureUnits[i];
          if (other) {
            if (other.bindCount > 0) {
              continue
            }
            other.unit = -1;
          }
          textureUnits[i] = texture;
          unit = i;
          break
        }
        if (unit >= numTexUnits) {
          check$1.raise('insufficient number of texture units');
        }
        if (config.profile && stats.maxTextureUnits < (unit + 1)) {
          stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
        }
        texture.unit = unit;
        gl.activeTexture(GL_TEXTURE0$1 + unit);
        gl.bindTexture(texture.target, texture.texture);
      }
      return unit
    },

    unbind: function () {
      this.bindCount -= 1;
    },

    decRef: function () {
      if (--this.refCount <= 0) {
        destroy(this);
      }
    }
  });

  function createTexture2D (a, b) {
    var texture = new REGLTexture(GL_TEXTURE_2D$1);
    textureSet[texture.id] = texture;
    stats.textureCount++;

    function reglTexture2D (a, b) {
      var texInfo = texture.texInfo;
      TexInfo.call(texInfo);
      var mipData = allocMipMap();

      if (typeof a === 'number') {
        if (typeof b === 'number') {
          parseMipMapFromShape(mipData, a | 0, b | 0);
        } else {
          parseMipMapFromShape(mipData, a | 0, a | 0);
        }
      } else if (a) {
        check$1.type(a, 'object', 'invalid arguments to regl.texture');
        parseTexInfo(texInfo, a);
        parseMipMapFromObject(mipData, a);
      } else {
        // empty textures get assigned a default shape of 1x1
        parseMipMapFromShape(mipData, 1, 1);
      }

      if (texInfo.genMipmaps) {
        mipData.mipmask = (mipData.width << 1) - 1;
      }
      texture.mipmask = mipData.mipmask;

      copyFlags(texture, mipData);

      check$1.texture2D(texInfo, mipData, limits);
      texture.internalformat = mipData.internalformat;

      reglTexture2D.width = mipData.width;
      reglTexture2D.height = mipData.height;

      tempBind(texture);
      setMipMap(mipData, GL_TEXTURE_2D$1);
      setTexInfo(texInfo, GL_TEXTURE_2D$1);
      tempRestore();

      freeMipMap(mipData);

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          mipData.width,
          mipData.height,
          texInfo.genMipmaps,
          false);
      }
      reglTexture2D.format = textureFormatsInvert[texture.internalformat];
      reglTexture2D.type = textureTypesInvert[texture.type];

      reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
      reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

      reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
      reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

      return reglTexture2D
    }

    function subimage (image, x_, y_, level_) {
      check$1(!!image, 'must specify image data');

      var x = x_ | 0;
      var y = y_ | 0;
      var level = level_ | 0;

      var imageData = allocImage();
      copyFlags(imageData, texture);
      imageData.width = 0;
      imageData.height = 0;
      parseImage(imageData, image);
      imageData.width = imageData.width || ((texture.width >> level) - x);
      imageData.height = imageData.height || ((texture.height >> level) - y);

      check$1(
        texture.type === imageData.type &&
        texture.format === imageData.format &&
        texture.internalformat === imageData.internalformat,
        'incompatible format for texture.subimage');
      check$1(
        x >= 0 && y >= 0 &&
        x + imageData.width <= texture.width &&
        y + imageData.height <= texture.height,
        'texture.subimage write out of bounds');
      check$1(
        texture.mipmask & (1 << level),
        'missing mipmap data');
      check$1(
        imageData.data || imageData.element || imageData.needsCopy,
        'missing image data');

      tempBind(texture);
      setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
      tempRestore();

      freeImage(imageData);

      return reglTexture2D
    }

    function resize (w_, h_) {
      var w = w_ | 0;
      var h = (h_ | 0) || w;
      if (w === texture.width && h === texture.height) {
        return reglTexture2D
      }

      reglTexture2D.width = texture.width = w;
      reglTexture2D.height = texture.height = h;

      tempBind(texture);

      var data;
      var channels = texture.channels;
      var type = texture.type;

      for (var i = 0; texture.mipmask >> i; ++i) {
        var _w = w >> i;
        var _h = h >> i;
        if (!_w || !_h) break
        data = pool.zero.allocType(type, _w * _h * channels);
        gl.texImage2D(
          GL_TEXTURE_2D$1,
          i,
          texture.format,
          _w,
          _h,
          0,
          texture.format,
          texture.type,
          data);
        if (data) pool.zero.freeType(data);
      }
      tempRestore();

      // also, recompute the texture size.
      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          w,
          h,
          false,
          false);
      }

      return reglTexture2D
    }

    reglTexture2D(a, b);

    reglTexture2D.subimage = subimage;
    reglTexture2D.resize = resize;
    reglTexture2D._reglType = 'texture2d';
    reglTexture2D._texture = texture;
    if (config.profile) {
      reglTexture2D.stats = texture.stats;
    }
    reglTexture2D.destroy = function () {
      texture.decRef();
    };

    return reglTexture2D
  }

  function createTextureCube (a0, a1, a2, a3, a4, a5) {
    var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
    textureSet[texture.id] = texture;
    stats.cubeCount++;

    var faces = new Array(6);

    function reglTextureCube (a0, a1, a2, a3, a4, a5) {
      var i;
      var texInfo = texture.texInfo;
      TexInfo.call(texInfo);
      for (i = 0; i < 6; ++i) {
        faces[i] = allocMipMap();
      }

      if (typeof a0 === 'number' || !a0) {
        var s = (a0 | 0) || 1;
        for (i = 0; i < 6; ++i) {
          parseMipMapFromShape(faces[i], s, s);
        }
      } else if (typeof a0 === 'object') {
        if (a1) {
          parseMipMapFromObject(faces[0], a0);
          parseMipMapFromObject(faces[1], a1);
          parseMipMapFromObject(faces[2], a2);
          parseMipMapFromObject(faces[3], a3);
          parseMipMapFromObject(faces[4], a4);
          parseMipMapFromObject(faces[5], a5);
        } else {
          parseTexInfo(texInfo, a0);
          parseFlags(texture, a0);
          if ('faces' in a0) {
            var face_input = a0.faces;
            check$1(Array.isArray(face_input) && face_input.length === 6,
              'cube faces must be a length 6 array');
            for (i = 0; i < 6; ++i) {
              check$1(typeof face_input[i] === 'object' && !!face_input[i],
                'invalid input for cube map face');
              copyFlags(faces[i], texture);
              parseMipMapFromObject(faces[i], face_input[i]);
            }
          } else {
            for (i = 0; i < 6; ++i) {
              parseMipMapFromObject(faces[i], a0);
            }
          }
        }
      } else {
        check$1.raise('invalid arguments to cube map');
      }

      copyFlags(texture, faces[0]);

      if (!limits.npotTextureCube) {
        check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
      }

      if (texInfo.genMipmaps) {
        texture.mipmask = (faces[0].width << 1) - 1;
      } else {
        texture.mipmask = faces[0].mipmask;
      }

      check$1.textureCube(texture, texInfo, faces, limits);
      texture.internalformat = faces[0].internalformat;

      reglTextureCube.width = faces[0].width;
      reglTextureCube.height = faces[0].height;

      tempBind(texture);
      for (i = 0; i < 6; ++i) {
        setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
      }
      setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
      tempRestore();

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          reglTextureCube.width,
          reglTextureCube.height,
          texInfo.genMipmaps,
          true);
      }

      reglTextureCube.format = textureFormatsInvert[texture.internalformat];
      reglTextureCube.type = textureTypesInvert[texture.type];

      reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
      reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

      reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
      reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

      for (i = 0; i < 6; ++i) {
        freeMipMap(faces[i]);
      }

      return reglTextureCube
    }

    function subimage (face, image, x_, y_, level_) {
      check$1(!!image, 'must specify image data');
      check$1(typeof face === 'number' && face === (face | 0) &&
        face >= 0 && face < 6, 'invalid face');

      var x = x_ | 0;
      var y = y_ | 0;
      var level = level_ | 0;

      var imageData = allocImage();
      copyFlags(imageData, texture);
      imageData.width = 0;
      imageData.height = 0;
      parseImage(imageData, image);
      imageData.width = imageData.width || ((texture.width >> level) - x);
      imageData.height = imageData.height || ((texture.height >> level) - y);

      check$1(
        texture.type === imageData.type &&
        texture.format === imageData.format &&
        texture.internalformat === imageData.internalformat,
        'incompatible format for texture.subimage');
      check$1(
        x >= 0 && y >= 0 &&
        x + imageData.width <= texture.width &&
        y + imageData.height <= texture.height,
        'texture.subimage write out of bounds');
      check$1(
        texture.mipmask & (1 << level),
        'missing mipmap data');
      check$1(
        imageData.data || imageData.element || imageData.needsCopy,
        'missing image data');

      tempBind(texture);
      setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
      tempRestore();

      freeImage(imageData);

      return reglTextureCube
    }

    function resize (radius_) {
      var radius = radius_ | 0;
      if (radius === texture.width) {
        return
      }

      reglTextureCube.width = texture.width = radius;
      reglTextureCube.height = texture.height = radius;

      tempBind(texture);
      for (var i = 0; i < 6; ++i) {
        for (var j = 0; texture.mipmask >> j; ++j) {
          gl.texImage2D(
            GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
            j,
            texture.format,
            radius >> j,
            radius >> j,
            0,
            texture.format,
            texture.type,
            null);
        }
      }
      tempRestore();

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          reglTextureCube.width,
          reglTextureCube.height,
          false,
          true);
      }

      return reglTextureCube
    }

    reglTextureCube(a0, a1, a2, a3, a4, a5);

    reglTextureCube.subimage = subimage;
    reglTextureCube.resize = resize;
    reglTextureCube._reglType = 'textureCube';
    reglTextureCube._texture = texture;
    if (config.profile) {
      reglTextureCube.stats = texture.stats;
    }
    reglTextureCube.destroy = function () {
      texture.decRef();
    };

    return reglTextureCube
  }

  // Called when regl is destroyed
  function destroyTextures () {
    for (var i = 0; i < numTexUnits; ++i) {
      gl.activeTexture(GL_TEXTURE0$1 + i);
      gl.bindTexture(GL_TEXTURE_2D$1, null);
      textureUnits[i] = null;
    }
    values(textureSet).forEach(destroy);

    stats.cubeCount = 0;
    stats.textureCount = 0;
  }

  if (config.profile) {
    stats.getTotalTextureSize = function () {
      var total = 0;
      Object.keys(textureSet).forEach(function (key) {
        total += textureSet[key].stats.size;
      });
      return total
    };
  }

  function restoreTextures () {
    for (var i = 0; i < numTexUnits; ++i) {
      var tex = textureUnits[i];
      if (tex) {
        tex.bindCount = 0;
        tex.unit = -1;
        textureUnits[i] = null;
      }
    }

    values(textureSet).forEach(function (texture) {
      texture.texture = gl.createTexture();
      gl.bindTexture(texture.target, texture.texture);
      for (var i = 0; i < 32; ++i) {
        if ((texture.mipmask & (1 << i)) === 0) {
          continue
        }
        if (texture.target === GL_TEXTURE_2D$1) {
          gl.texImage2D(GL_TEXTURE_2D$1,
            i,
            texture.internalformat,
            texture.width >> i,
            texture.height >> i,
            0,
            texture.internalformat,
            texture.type,
            null);
        } else {
          for (var j = 0; j < 6; ++j) {
            gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
              i,
              texture.internalformat,
              texture.width >> i,
              texture.height >> i,
              0,
              texture.internalformat,
              texture.type,
              null);
          }
        }
      }
      setTexInfo(texture.texInfo, texture.target);
    });
  }

  return {
    create2D: createTexture2D,
    createCube: createTextureCube,
    clear: destroyTextures,
    getTexture: function (wrapper) {
      return null
    },
    restore: restoreTextures
  }
}

var GL_RENDERBUFFER = 0x8D41;

var GL_RGBA4$1 = 0x8056;
var GL_RGB5_A1$1 = 0x8057;
var GL_RGB565$1 = 0x8D62;
var GL_DEPTH_COMPONENT16 = 0x81A5;
var GL_STENCIL_INDEX8 = 0x8D48;
var GL_DEPTH_STENCIL$1 = 0x84F9;

var GL_SRGB8_ALPHA8_EXT = 0x8C43;

var GL_RGBA32F_EXT = 0x8814;

var GL_RGBA16F_EXT = 0x881A;
var GL_RGB16F_EXT = 0x881B;

var FORMAT_SIZES = [];

FORMAT_SIZES[GL_RGBA4$1] = 2;
FORMAT_SIZES[GL_RGB5_A1$1] = 2;
FORMAT_SIZES[GL_RGB565$1] = 2;

FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
FORMAT_SIZES[GL_RGB16F_EXT] = 6;

function getRenderbufferSize (format, width, height) {
  return FORMAT_SIZES[format] * width * height
}

var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
  var formatTypes = {
    'rgba4': GL_RGBA4$1,
    'rgb565': GL_RGB565$1,
    'rgb5 a1': GL_RGB5_A1$1,
    'depth': GL_DEPTH_COMPONENT16,
    'stencil': GL_STENCIL_INDEX8,
    'depth stencil': GL_DEPTH_STENCIL$1
  };

  if (extensions.ext_srgb) {
    formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
  }

  if (extensions.ext_color_buffer_half_float) {
    formatTypes['rgba16f'] = GL_RGBA16F_EXT;
    formatTypes['rgb16f'] = GL_RGB16F_EXT;
  }

  if (extensions.webgl_color_buffer_float) {
    formatTypes['rgba32f'] = GL_RGBA32F_EXT;
  }

  var formatTypesInvert = [];
  Object.keys(formatTypes).forEach(function (key) {
    var val = formatTypes[key];
    formatTypesInvert[val] = key;
  });

  var renderbufferCount = 0;
  var renderbufferSet = {};

  function REGLRenderbuffer (renderbuffer) {
    this.id = renderbufferCount++;
    this.refCount = 1;

    this.renderbuffer = renderbuffer;

    this.format = GL_RGBA4$1;
    this.width = 0;
    this.height = 0;

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  REGLRenderbuffer.prototype.decRef = function () {
    if (--this.refCount <= 0) {
      destroy(this);
    }
  };

  function destroy (rb) {
    var handle = rb.renderbuffer;
    check$1(handle, 'must not double destroy renderbuffer');
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    gl.deleteRenderbuffer(handle);
    rb.renderbuffer = null;
    rb.refCount = 0;
    delete renderbufferSet[rb.id];
    stats.renderbufferCount--;
  }

  function createRenderbuffer (a, b) {
    var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
    renderbufferSet[renderbuffer.id] = renderbuffer;
    stats.renderbufferCount++;

    function reglRenderbuffer (a, b) {
      var w = 0;
      var h = 0;
      var format = GL_RGBA4$1;

      if (typeof a === 'object' && a) {
        var options = a;
        if ('shape' in options) {
          var shape = options.shape;
          check$1(Array.isArray(shape) && shape.length >= 2,
            'invalid renderbuffer shape');
          w = shape[0] | 0;
          h = shape[1] | 0;
        } else {
          if ('radius' in options) {
            w = h = options.radius | 0;
          }
          if ('width' in options) {
            w = options.width | 0;
          }
          if ('height' in options) {
            h = options.height | 0;
          }
        }
        if ('format' in options) {
          check$1.parameter(options.format, formatTypes,
            'invalid renderbuffer format');
          format = formatTypes[options.format];
        }
      } else if (typeof a === 'number') {
        w = a | 0;
        if (typeof b === 'number') {
          h = b | 0;
        } else {
          h = w;
        }
      } else if (!a) {
        w = h = 1;
      } else {
        check$1.raise('invalid arguments to renderbuffer constructor');
      }

      // check shape
      check$1(
        w > 0 && h > 0 &&
        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
        'invalid renderbuffer size');

      if (w === renderbuffer.width &&
          h === renderbuffer.height &&
          format === renderbuffer.format) {
        return
      }

      reglRenderbuffer.width = renderbuffer.width = w;
      reglRenderbuffer.height = renderbuffer.height = h;
      renderbuffer.format = format;

      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

      check$1(
        gl.getError() === 0,
        'invalid render buffer format');

      if (config.profile) {
        renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
      }
      reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

      return reglRenderbuffer
    }

    function resize (w_, h_) {
      var w = w_ | 0;
      var h = (h_ | 0) || w;

      if (w === renderbuffer.width && h === renderbuffer.height) {
        return reglRenderbuffer
      }

      // check shape
      check$1(
        w > 0 && h > 0 &&
        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
        'invalid renderbuffer size');

      reglRenderbuffer.width = renderbuffer.width = w;
      reglRenderbuffer.height = renderbuffer.height = h;

      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

      check$1(
        gl.getError() === 0,
        'invalid render buffer format');

      // also, recompute size.
      if (config.profile) {
        renderbuffer.stats.size = getRenderbufferSize(
          renderbuffer.format, renderbuffer.width, renderbuffer.height);
      }

      return reglRenderbuffer
    }

    reglRenderbuffer(a, b);

    reglRenderbuffer.resize = resize;
    reglRenderbuffer._reglType = 'renderbuffer';
    reglRenderbuffer._renderbuffer = renderbuffer;
    if (config.profile) {
      reglRenderbuffer.stats = renderbuffer.stats;
    }
    reglRenderbuffer.destroy = function () {
      renderbuffer.decRef();
    };

    return reglRenderbuffer
  }

  if (config.profile) {
    stats.getTotalRenderbufferSize = function () {
      var total = 0;
      Object.keys(renderbufferSet).forEach(function (key) {
        total += renderbufferSet[key].stats.size;
      });
      return total
    };
  }

  function restoreRenderbuffers () {
    values(renderbufferSet).forEach(function (rb) {
      rb.renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
    });
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
  }

  return {
    create: createRenderbuffer,
    clear: function () {
      values(renderbufferSet).forEach(destroy);
    },
    restore: restoreRenderbuffers
  }
};

// We store these constants so that the minifier can inline them
var GL_FRAMEBUFFER$1 = 0x8D40;
var GL_RENDERBUFFER$1 = 0x8D41;

var GL_TEXTURE_2D$2 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
var GL_DEPTH_ATTACHMENT = 0x8D00;
var GL_STENCIL_ATTACHMENT = 0x8D20;
var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

var GL_HALF_FLOAT_OES$2 = 0x8D61;
var GL_UNSIGNED_BYTE$6 = 0x1401;
var GL_FLOAT$5 = 0x1406;

var GL_RGB$1 = 0x1907;
var GL_RGBA$2 = 0x1908;

var GL_DEPTH_COMPONENT$1 = 0x1902;

var colorTextureFormatEnums = [
  GL_RGB$1,
  GL_RGBA$2
];

// for every texture format, store
// the number of channels
var textureFormatChannels = [];
textureFormatChannels[GL_RGBA$2] = 4;
textureFormatChannels[GL_RGB$1] = 3;

// for every texture type, store
// the size in bytes.
var textureTypeSizes = [];
textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
textureTypeSizes[GL_FLOAT$5] = 4;
textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

var GL_RGBA4$2 = 0x8056;
var GL_RGB5_A1$2 = 0x8057;
var GL_RGB565$2 = 0x8D62;
var GL_DEPTH_COMPONENT16$1 = 0x81A5;
var GL_STENCIL_INDEX8$1 = 0x8D48;
var GL_DEPTH_STENCIL$2 = 0x84F9;

var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

var GL_RGBA32F_EXT$1 = 0x8814;

var GL_RGBA16F_EXT$1 = 0x881A;
var GL_RGB16F_EXT$1 = 0x881B;

var colorRenderbufferFormatEnums = [
  GL_RGBA4$2,
  GL_RGB5_A1$2,
  GL_RGB565$2,
  GL_SRGB8_ALPHA8_EXT$1,
  GL_RGBA16F_EXT$1,
  GL_RGB16F_EXT$1,
  GL_RGBA32F_EXT$1
];

var statusCode = {};
statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

function wrapFBOState (
  gl,
  extensions,
  limits,
  textureState,
  renderbufferState,
  stats) {
  var framebufferState = {
    cur: null,
    next: null,
    dirty: false,
    setFBO: null
  };

  var colorTextureFormats = ['rgba'];
  var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

  if (extensions.ext_srgb) {
    colorRenderbufferFormats.push('srgba');
  }

  if (extensions.ext_color_buffer_half_float) {
    colorRenderbufferFormats.push('rgba16f', 'rgb16f');
  }

  if (extensions.webgl_color_buffer_float) {
    colorRenderbufferFormats.push('rgba32f');
  }

  var colorTypes = ['uint8'];
  if (extensions.oes_texture_half_float) {
    colorTypes.push('half float', 'float16');
  }
  if (extensions.oes_texture_float) {
    colorTypes.push('float', 'float32');
  }

  function FramebufferAttachment (target, texture, renderbuffer) {
    this.target = target;
    this.texture = texture;
    this.renderbuffer = renderbuffer;

    var w = 0;
    var h = 0;
    if (texture) {
      w = texture.width;
      h = texture.height;
    } else if (renderbuffer) {
      w = renderbuffer.width;
      h = renderbuffer.height;
    }
    this.width = w;
    this.height = h;
  }

  function decRef (attachment) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture._texture.decRef();
      }
      if (attachment.renderbuffer) {
        attachment.renderbuffer._renderbuffer.decRef();
      }
    }
  }

  function incRefAndCheckShape (attachment, width, height) {
    if (!attachment) {
      return
    }
    if (attachment.texture) {
      var texture = attachment.texture._texture;
      var tw = Math.max(1, texture.width);
      var th = Math.max(1, texture.height);
      check$1(tw === width && th === height,
        'inconsistent width/height for supplied texture');
      texture.refCount += 1;
    } else {
      var renderbuffer = attachment.renderbuffer._renderbuffer;
      check$1(
        renderbuffer.width === width && renderbuffer.height === height,
        'inconsistent width/height for renderbuffer');
      renderbuffer.refCount += 1;
    }
  }

  function attach (location, attachment) {
    if (attachment) {
      if (attachment.texture) {
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          location,
          attachment.target,
          attachment.texture._texture.texture,
          0);
      } else {
        gl.framebufferRenderbuffer(
          GL_FRAMEBUFFER$1,
          location,
          GL_RENDERBUFFER$1,
          attachment.renderbuffer._renderbuffer.renderbuffer);
      }
    }
  }

  function parseAttachment (attachment) {
    var target = GL_TEXTURE_2D$2;
    var texture = null;
    var renderbuffer = null;

    var data = attachment;
    if (typeof attachment === 'object') {
      data = attachment.data;
      if ('target' in attachment) {
        target = attachment.target | 0;
      }
    }

    check$1.type(data, 'function', 'invalid attachment data');

    var type = data._reglType;
    if (type === 'texture2d') {
      texture = data;
      check$1(target === GL_TEXTURE_2D$2);
    } else if (type === 'textureCube') {
      texture = data;
      check$1(
        target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
        target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
        'invalid cube map target');
    } else if (type === 'renderbuffer') {
      renderbuffer = data;
      target = GL_RENDERBUFFER$1;
    } else {
      check$1.raise('invalid regl object for attachment');
    }

    return new FramebufferAttachment(target, texture, renderbuffer)
  }

  function allocAttachment (
    width,
    height,
    isTexture,
    format,
    type) {
    if (isTexture) {
      var texture = textureState.create2D({
        width: width,
        height: height,
        format: format,
        type: type
      });
      texture._texture.refCount = 0;
      return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
    } else {
      var rb = renderbufferState.create({
        width: width,
        height: height,
        format: format
      });
      rb._renderbuffer.refCount = 0;
      return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
    }
  }

  function unwrapAttachment (attachment) {
    return attachment && (attachment.texture || attachment.renderbuffer)
  }

  function resizeAttachment (attachment, w, h) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture.resize(w, h);
      } else if (attachment.renderbuffer) {
        attachment.renderbuffer.resize(w, h);
      }
      attachment.width = w;
      attachment.height = h;
    }
  }

  var framebufferCount = 0;
  var framebufferSet = {};

  function REGLFramebuffer () {
    this.id = framebufferCount++;
    framebufferSet[this.id] = this;

    this.framebuffer = gl.createFramebuffer();
    this.width = 0;
    this.height = 0;

    this.colorAttachments = [];
    this.depthAttachment = null;
    this.stencilAttachment = null;
    this.depthStencilAttachment = null;
  }

  function decFBORefs (framebuffer) {
    framebuffer.colorAttachments.forEach(decRef);
    decRef(framebuffer.depthAttachment);
    decRef(framebuffer.stencilAttachment);
    decRef(framebuffer.depthStencilAttachment);
  }

  function destroy (framebuffer) {
    var handle = framebuffer.framebuffer;
    check$1(handle, 'must not double destroy framebuffer');
    gl.deleteFramebuffer(handle);
    framebuffer.framebuffer = null;
    stats.framebufferCount--;
    delete framebufferSet[framebuffer.id];
  }

  function updateFramebuffer (framebuffer) {
    var i;

    gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
    var colorAttachments = framebuffer.colorAttachments;
    for (i = 0; i < colorAttachments.length; ++i) {
      attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
    }
    for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER$1,
        GL_COLOR_ATTACHMENT0$1 + i,
        GL_TEXTURE_2D$2,
        null,
        0);
    }

    gl.framebufferTexture2D(
      GL_FRAMEBUFFER$1,
      GL_DEPTH_STENCIL_ATTACHMENT,
      GL_TEXTURE_2D$2,
      null,
      0);
    gl.framebufferTexture2D(
      GL_FRAMEBUFFER$1,
      GL_DEPTH_ATTACHMENT,
      GL_TEXTURE_2D$2,
      null,
      0);
    gl.framebufferTexture2D(
      GL_FRAMEBUFFER$1,
      GL_STENCIL_ATTACHMENT,
      GL_TEXTURE_2D$2,
      null,
      0);

    attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
    attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
    attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

    // Check status code
    var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
    if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
      check$1.raise('framebuffer configuration not supported, status = ' +
        statusCode[status]);
    }

    gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
    framebufferState.cur = framebufferState.next;

    // FIXME: Clear error code here.  This is a work around for a bug in
    // headless-gl
    gl.getError();
  }

  function createFBO (a0, a1) {
    var framebuffer = new REGLFramebuffer();
    stats.framebufferCount++;

    function reglFramebuffer (a, b) {
      var i;

      check$1(framebufferState.next !== framebuffer,
        'can not update framebuffer which is currently in use');

      var width = 0;
      var height = 0;

      var needsDepth = true;
      var needsStencil = true;

      var colorBuffer = null;
      var colorTexture = true;
      var colorFormat = 'rgba';
      var colorType = 'uint8';
      var colorCount = 1;

      var depthBuffer = null;
      var stencilBuffer = null;
      var depthStencilBuffer = null;
      var depthStencilTexture = false;

      if (typeof a === 'number') {
        width = a | 0;
        height = (b | 0) || width;
      } else if (!a) {
        width = height = 1;
      } else {
        check$1.type(a, 'object', 'invalid arguments for framebuffer');
        var options = a;

        if ('shape' in options) {
          var shape = options.shape;
          check$1(Array.isArray(shape) && shape.length >= 2,
            'invalid shape for framebuffer');
          width = shape[0];
          height = shape[1];
        } else {
          if ('radius' in options) {
            width = height = options.radius;
          }
          if ('width' in options) {
            width = options.width;
          }
          if ('height' in options) {
            height = options.height;
          }
        }

        if ('color' in options ||
            'colors' in options) {
          colorBuffer =
            options.color ||
            options.colors;
          if (Array.isArray(colorBuffer)) {
            check$1(
              colorBuffer.length === 1 || extensions.webgl_draw_buffers,
              'multiple render targets not supported');
          }
        }

        if (!colorBuffer) {
          if ('colorCount' in options) {
            colorCount = options.colorCount | 0;
            check$1(colorCount > 0, 'invalid color buffer count');
          }

          if ('colorTexture' in options) {
            colorTexture = !!options.colorTexture;
            colorFormat = 'rgba4';
          }

          if ('colorType' in options) {
            colorType = options.colorType;
            if (!colorTexture) {
              if (colorType === 'half float' || colorType === 'float16') {
                check$1(extensions.ext_color_buffer_half_float,
                  'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                colorFormat = 'rgba16f';
              } else if (colorType === 'float' || colorType === 'float32') {
                check$1(extensions.webgl_color_buffer_float,
                  'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                colorFormat = 'rgba32f';
              }
            } else {
              check$1(extensions.oes_texture_float ||
                !(colorType === 'float' || colorType === 'float32'),
                'you must enable OES_texture_float in order to use floating point framebuffer objects');
              check$1(extensions.oes_texture_half_float ||
                !(colorType === 'half float' || colorType === 'float16'),
                'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
            }
            check$1.oneOf(colorType, colorTypes, 'invalid color type');
          }

          if ('colorFormat' in options) {
            colorFormat = options.colorFormat;
            if (colorTextureFormats.indexOf(colorFormat) >= 0) {
              colorTexture = true;
            } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
              colorTexture = false;
            } else {
              if (colorTexture) {
                check$1.oneOf(
                  options.colorFormat, colorTextureFormats,
                  'invalid color format for texture');
              } else {
                check$1.oneOf(
                  options.colorFormat, colorRenderbufferFormats,
                  'invalid color format for renderbuffer');
              }
            }
          }
        }

        if ('depthTexture' in options || 'depthStencilTexture' in options) {
          depthStencilTexture = !!(options.depthTexture ||
            options.depthStencilTexture);
          check$1(!depthStencilTexture || extensions.webgl_depth_texture,
            'webgl_depth_texture extension not supported');
        }

        if ('depth' in options) {
          if (typeof options.depth === 'boolean') {
            needsDepth = options.depth;
          } else {
            depthBuffer = options.depth;
            needsStencil = false;
          }
        }

        if ('stencil' in options) {
          if (typeof options.stencil === 'boolean') {
            needsStencil = options.stencil;
          } else {
            stencilBuffer = options.stencil;
            needsDepth = false;
          }
        }

        if ('depthStencil' in options) {
          if (typeof options.depthStencil === 'boolean') {
            needsDepth = needsStencil = options.depthStencil;
          } else {
            depthStencilBuffer = options.depthStencil;
            needsDepth = false;
            needsStencil = false;
          }
        }
      }

      // parse attachments
      var colorAttachments = null;
      var depthAttachment = null;
      var stencilAttachment = null;
      var depthStencilAttachment = null;

      // Set up color attachments
      if (Array.isArray(colorBuffer)) {
        colorAttachments = colorBuffer.map(parseAttachment);
      } else if (colorBuffer) {
        colorAttachments = [parseAttachment(colorBuffer)];
      } else {
        colorAttachments = new Array(colorCount);
        for (i = 0; i < colorCount; ++i) {
          colorAttachments[i] = allocAttachment(
            width,
            height,
            colorTexture,
            colorFormat,
            colorType);
        }
      }

      check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
        'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
      check$1(colorAttachments.length <= limits.maxColorAttachments,
        'too many color attachments, not supported');

      width = width || colorAttachments[0].width;
      height = height || colorAttachments[0].height;

      if (depthBuffer) {
        depthAttachment = parseAttachment(depthBuffer);
      } else if (needsDepth && !needsStencil) {
        depthAttachment = allocAttachment(
          width,
          height,
          depthStencilTexture,
          'depth',
          'uint32');
      }

      if (stencilBuffer) {
        stencilAttachment = parseAttachment(stencilBuffer);
      } else if (needsStencil && !needsDepth) {
        stencilAttachment = allocAttachment(
          width,
          height,
          false,
          'stencil',
          'uint8');
      }

      if (depthStencilBuffer) {
        depthStencilAttachment = parseAttachment(depthStencilBuffer);
      } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
        depthStencilAttachment = allocAttachment(
          width,
          height,
          depthStencilTexture,
          'depth stencil',
          'depth stencil');
      }

      check$1(
        (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
        'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

      var commonColorAttachmentSize = null;

      for (i = 0; i < colorAttachments.length; ++i) {
        incRefAndCheckShape(colorAttachments[i], width, height);
        check$1(!colorAttachments[i] ||
          (colorAttachments[i].texture &&
            colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
          (colorAttachments[i].renderbuffer &&
            colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
          'framebuffer color attachment ' + i + ' is invalid');

        if (colorAttachments[i] && colorAttachments[i].texture) {
          var colorAttachmentSize =
              textureFormatChannels[colorAttachments[i].texture._texture.format] *
              textureTypeSizes[colorAttachments[i].texture._texture.type];

          if (commonColorAttachmentSize === null) {
            commonColorAttachmentSize = colorAttachmentSize;
          } else {
            // We need to make sure that all color attachments have the same number of bitplanes
            // (that is, the same numer of bits per pixel)
            // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
            check$1(commonColorAttachmentSize === colorAttachmentSize,
                  'all color attachments much have the same number of bits per pixel.');
          }
        }
      }
      incRefAndCheckShape(depthAttachment, width, height);
      check$1(!depthAttachment ||
        (depthAttachment.texture &&
          depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
        (depthAttachment.renderbuffer &&
          depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
        'invalid depth attachment for framebuffer object');
      incRefAndCheckShape(stencilAttachment, width, height);
      check$1(!stencilAttachment ||
        (stencilAttachment.renderbuffer &&
          stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
        'invalid stencil attachment for framebuffer object');
      incRefAndCheckShape(depthStencilAttachment, width, height);
      check$1(!depthStencilAttachment ||
        (depthStencilAttachment.texture &&
          depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
        (depthStencilAttachment.renderbuffer &&
          depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
        'invalid depth-stencil attachment for framebuffer object');

      // decrement references
      decFBORefs(framebuffer);

      framebuffer.width = width;
      framebuffer.height = height;

      framebuffer.colorAttachments = colorAttachments;
      framebuffer.depthAttachment = depthAttachment;
      framebuffer.stencilAttachment = stencilAttachment;
      framebuffer.depthStencilAttachment = depthStencilAttachment;

      reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
      reglFramebuffer.depth = unwrapAttachment(depthAttachment);
      reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
      reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

      reglFramebuffer.width = framebuffer.width;
      reglFramebuffer.height = framebuffer.height;

      updateFramebuffer(framebuffer);

      return reglFramebuffer
    }

    function resize (w_, h_) {
      check$1(framebufferState.next !== framebuffer,
        'can not resize a framebuffer which is currently in use');

      var w = Math.max(w_ | 0, 1);
      var h = Math.max((h_ | 0) || w, 1);
      if (w === framebuffer.width && h === framebuffer.height) {
        return reglFramebuffer
      }

      // resize all buffers
      var colorAttachments = framebuffer.colorAttachments;
      for (var i = 0; i < colorAttachments.length; ++i) {
        resizeAttachment(colorAttachments[i], w, h);
      }
      resizeAttachment(framebuffer.depthAttachment, w, h);
      resizeAttachment(framebuffer.stencilAttachment, w, h);
      resizeAttachment(framebuffer.depthStencilAttachment, w, h);

      framebuffer.width = reglFramebuffer.width = w;
      framebuffer.height = reglFramebuffer.height = h;

      updateFramebuffer(framebuffer);

      return reglFramebuffer
    }

    reglFramebuffer(a0, a1);

    return extend(reglFramebuffer, {
      resize: resize,
      _reglType: 'framebuffer',
      _framebuffer: framebuffer,
      destroy: function () {
        destroy(framebuffer);
        decFBORefs(framebuffer);
      },
      use: function (block) {
        framebufferState.setFBO({
          framebuffer: reglFramebuffer
        }, block);
      }
    })
  }

  function createCubeFBO (options) {
    var faces = Array(6);

    function reglFramebufferCube (a) {
      var i;

      check$1(faces.indexOf(framebufferState.next) < 0,
        'can not update framebuffer which is currently in use');

      var params = {
        color: null
      };

      var radius = 0;

      var colorBuffer = null;
      var colorFormat = 'rgba';
      var colorType = 'uint8';
      var colorCount = 1;

      if (typeof a === 'number') {
        radius = a | 0;
      } else if (!a) {
        radius = 1;
      } else {
        check$1.type(a, 'object', 'invalid arguments for framebuffer');
        var options = a;

        if ('shape' in options) {
          var shape = options.shape;
          check$1(
            Array.isArray(shape) && shape.length >= 2,
            'invalid shape for framebuffer');
          check$1(
            shape[0] === shape[1],
            'cube framebuffer must be square');
          radius = shape[0];
        } else {
          if ('radius' in options) {
            radius = options.radius | 0;
          }
          if ('width' in options) {
            radius = options.width | 0;
            if ('height' in options) {
              check$1(options.height === radius, 'must be square');
            }
          } else if ('height' in options) {
            radius = options.height | 0;
          }
        }

        if ('color' in options ||
            'colors' in options) {
          colorBuffer =
            options.color ||
            options.colors;
          if (Array.isArray(colorBuffer)) {
            check$1(
              colorBuffer.length === 1 || extensions.webgl_draw_buffers,
              'multiple render targets not supported');
          }
        }

        if (!colorBuffer) {
          if ('colorCount' in options) {
            colorCount = options.colorCount | 0;
            check$1(colorCount > 0, 'invalid color buffer count');
          }

          if ('colorType' in options) {
            check$1.oneOf(
              options.colorType, colorTypes,
              'invalid color type');
            colorType = options.colorType;
          }

          if ('colorFormat' in options) {
            colorFormat = options.colorFormat;
            check$1.oneOf(
              options.colorFormat, colorTextureFormats,
              'invalid color format for texture');
          }
        }

        if ('depth' in options) {
          params.depth = options.depth;
        }

        if ('stencil' in options) {
          params.stencil = options.stencil;
        }

        if ('depthStencil' in options) {
          params.depthStencil = options.depthStencil;
        }
      }

      var colorCubes;
      if (colorBuffer) {
        if (Array.isArray(colorBuffer)) {
          colorCubes = [];
          for (i = 0; i < colorBuffer.length; ++i) {
            colorCubes[i] = colorBuffer[i];
          }
        } else {
          colorCubes = [ colorBuffer ];
        }
      } else {
        colorCubes = Array(colorCount);
        var cubeMapParams = {
          radius: radius,
          format: colorFormat,
          type: colorType
        };
        for (i = 0; i < colorCount; ++i) {
          colorCubes[i] = textureState.createCube(cubeMapParams);
        }
      }

      // Check color cubes
      params.color = Array(colorCubes.length);
      for (i = 0; i < colorCubes.length; ++i) {
        var cube = colorCubes[i];
        check$1(
          typeof cube === 'function' && cube._reglType === 'textureCube',
          'invalid cube map');
        radius = radius || cube.width;
        check$1(
          cube.width === radius && cube.height === radius,
          'invalid cube map shape');
        params.color[i] = {
          target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
          data: colorCubes[i]
        };
      }

      for (i = 0; i < 6; ++i) {
        for (var j = 0; j < colorCubes.length; ++j) {
          params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
        }
        // reuse depth-stencil attachments across all cube maps
        if (i > 0) {
          params.depth = faces[0].depth;
          params.stencil = faces[0].stencil;
          params.depthStencil = faces[0].depthStencil;
        }
        if (faces[i]) {
          (faces[i])(params);
        } else {
          faces[i] = createFBO(params);
        }
      }

      return extend(reglFramebufferCube, {
        width: radius,
        height: radius,
        color: colorCubes
      })
    }

    function resize (radius_) {
      var i;
      var radius = radius_ | 0;
      check$1(radius > 0 && radius <= limits.maxCubeMapSize,
        'invalid radius for cube fbo');

      if (radius === reglFramebufferCube.width) {
        return reglFramebufferCube
      }

      var colors = reglFramebufferCube.color;
      for (i = 0; i < colors.length; ++i) {
        colors[i].resize(radius);
      }

      for (i = 0; i < 6; ++i) {
        faces[i].resize(radius);
      }

      reglFramebufferCube.width = reglFramebufferCube.height = radius;

      return reglFramebufferCube
    }

    reglFramebufferCube(options);

    return extend(reglFramebufferCube, {
      faces: faces,
      resize: resize,
      _reglType: 'framebufferCube',
      destroy: function () {
        faces.forEach(function (f) {
          f.destroy();
        });
      }
    })
  }

  function restoreFramebuffers () {
    framebufferState.cur = null;
    framebufferState.next = null;
    framebufferState.dirty = true;
    values(framebufferSet).forEach(function (fb) {
      fb.framebuffer = gl.createFramebuffer();
      updateFramebuffer(fb);
    });
  }

  return extend(framebufferState, {
    getFramebuffer: function (object) {
      if (typeof object === 'function' && object._reglType === 'framebuffer') {
        var fbo = object._framebuffer;
        if (fbo instanceof REGLFramebuffer) {
          return fbo
        }
      }
      return null
    },
    create: createFBO,
    createCube: createCubeFBO,
    clear: function () {
      values(framebufferSet).forEach(destroy);
    },
    restore: restoreFramebuffers
  })
}

var GL_FLOAT$6 = 5126;

function AttributeRecord () {
  this.state = 0;

  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
  this.w = 0.0;

  this.buffer = null;
  this.size = 0;
  this.normalized = false;
  this.type = GL_FLOAT$6;
  this.offset = 0;
  this.stride = 0;
  this.divisor = 0;
}

function wrapAttributeState (
  gl,
  extensions,
  limits,
  stringStore) {
  var NUM_ATTRIBUTES = limits.maxAttributes;
  var attributeBindings = new Array(NUM_ATTRIBUTES);
  for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
    attributeBindings[i] = new AttributeRecord();
  }

  return {
    Record: AttributeRecord,
    scope: {},
    state: attributeBindings
  }
}

var GL_FRAGMENT_SHADER = 35632;
var GL_VERTEX_SHADER = 35633;

var GL_ACTIVE_UNIFORMS = 0x8B86;
var GL_ACTIVE_ATTRIBUTES = 0x8B89;

function wrapShaderState (gl, stringStore, stats, config) {
  // ===================================================
  // glsl compilation and linking
  // ===================================================
  var fragShaders = {};
  var vertShaders = {};

  function ActiveInfo (name, id, location, info) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.info = info;
  }

  function insertActiveInfo (list, info) {
    for (var i = 0; i < list.length; ++i) {
      if (list[i].id === info.id) {
        list[i].location = info.location;
        return
      }
    }
    list.push(info);
  }

  function getShader (type, id, command) {
    var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
    var shader = cache[id];

    if (!shader) {
      var source = stringStore.str(id);
      shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      check$1.shaderError(gl, shader, source, type, command);
      cache[id] = shader;
    }

    return shader
  }

  // ===================================================
  // program linking
  // ===================================================
  var programCache = {};
  var programList = [];

  var PROGRAM_COUNTER = 0;

  function REGLProgram (fragId, vertId) {
    this.id = PROGRAM_COUNTER++;
    this.fragId = fragId;
    this.vertId = vertId;
    this.program = null;
    this.uniforms = [];
    this.attributes = [];

    if (config.profile) {
      this.stats = {
        uniformsCount: 0,
        attributesCount: 0
      };
    }
  }

  function linkProgram (desc, command) {
    var i, info;

    // -------------------------------
    // compile & link
    // -------------------------------
    var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
    var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

    var program = desc.program = gl.createProgram();
    gl.attachShader(program, fragShader);
    gl.attachShader(program, vertShader);
    gl.linkProgram(program);
    check$1.linkError(
      gl,
      program,
      stringStore.str(desc.fragId),
      stringStore.str(desc.vertId),
      command);

    // -------------------------------
    // grab uniforms
    // -------------------------------
    var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
    if (config.profile) {
      desc.stats.uniformsCount = numUniforms;
    }
    var uniforms = desc.uniforms;
    for (i = 0; i < numUniforms; ++i) {
      info = gl.getActiveUniform(program, i);
      if (info) {
        if (info.size > 1) {
          for (var j = 0; j < info.size; ++j) {
            var name = info.name.replace('[0]', '[' + j + ']');
            insertActiveInfo(uniforms, new ActiveInfo(
              name,
              stringStore.id(name),
              gl.getUniformLocation(program, name),
              info));
          }
        } else {
          insertActiveInfo(uniforms, new ActiveInfo(
            info.name,
            stringStore.id(info.name),
            gl.getUniformLocation(program, info.name),
            info));
        }
      }
    }

    // -------------------------------
    // grab attributes
    // -------------------------------
    var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
    if (config.profile) {
      desc.stats.attributesCount = numAttributes;
    }

    var attributes = desc.attributes;
    for (i = 0; i < numAttributes; ++i) {
      info = gl.getActiveAttrib(program, i);
      if (info) {
        insertActiveInfo(attributes, new ActiveInfo(
          info.name,
          stringStore.id(info.name),
          gl.getAttribLocation(program, info.name),
          info));
      }
    }
  }

  if (config.profile) {
    stats.getMaxUniformsCount = function () {
      var m = 0;
      programList.forEach(function (desc) {
        if (desc.stats.uniformsCount > m) {
          m = desc.stats.uniformsCount;
        }
      });
      return m
    };

    stats.getMaxAttributesCount = function () {
      var m = 0;
      programList.forEach(function (desc) {
        if (desc.stats.attributesCount > m) {
          m = desc.stats.attributesCount;
        }
      });
      return m
    };
  }

  function restoreShaders () {
    fragShaders = {};
    vertShaders = {};
    for (var i = 0; i < programList.length; ++i) {
      linkProgram(programList[i]);
    }
  }

  return {
    clear: function () {
      var deleteShader = gl.deleteShader.bind(gl);
      values(fragShaders).forEach(deleteShader);
      fragShaders = {};
      values(vertShaders).forEach(deleteShader);
      vertShaders = {};

      programList.forEach(function (desc) {
        gl.deleteProgram(desc.program);
      });
      programList.length = 0;
      programCache = {};

      stats.shaderCount = 0;
    },

    program: function (vertId, fragId, command) {
      check$1.command(vertId >= 0, 'missing vertex shader', command);
      check$1.command(fragId >= 0, 'missing fragment shader', command);

      var cache = programCache[fragId];
      if (!cache) {
        cache = programCache[fragId] = {};
      }
      var program = cache[vertId];
      if (!program) {
        program = new REGLProgram(fragId, vertId);
        stats.shaderCount++;

        linkProgram(program, command);
        cache[vertId] = program;
        programList.push(program);
      }
      return program
    },

    restore: restoreShaders,

    shader: getShader,

    frag: -1,
    vert: -1
  }
}

var GL_RGBA$3 = 6408;
var GL_UNSIGNED_BYTE$7 = 5121;
var GL_PACK_ALIGNMENT = 0x0D05;
var GL_FLOAT$7 = 0x1406; // 5126

function wrapReadPixels (
  gl,
  framebufferState,
  reglPoll,
  context,
  glAttributes,
  extensions,
  limits) {
  function readPixelsImpl (input) {
    var type;
    if (framebufferState.next === null) {
      check$1(
        glAttributes.preserveDrawingBuffer,
        'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
      type = GL_UNSIGNED_BYTE$7;
    } else {
      check$1(
        framebufferState.next.colorAttachments[0].texture !== null,
          'You cannot read from a renderbuffer');
      type = framebufferState.next.colorAttachments[0].texture._texture.type;

      if (extensions.oes_texture_float) {
        check$1(
          type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
          'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');

        if (type === GL_FLOAT$7) {
          check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
        }
      } else {
        check$1(
          type === GL_UNSIGNED_BYTE$7,
          'Reading from a framebuffer is only allowed for the type \'uint8\'');
      }
    }

    var x = 0;
    var y = 0;
    var width = context.framebufferWidth;
    var height = context.framebufferHeight;
    var data = null;

    if (isTypedArray(input)) {
      data = input;
    } else if (input) {
      check$1.type(input, 'object', 'invalid arguments to regl.read()');
      x = input.x | 0;
      y = input.y | 0;
      check$1(
        x >= 0 && x < context.framebufferWidth,
        'invalid x offset for regl.read');
      check$1(
        y >= 0 && y < context.framebufferHeight,
        'invalid y offset for regl.read');
      width = (input.width || (context.framebufferWidth - x)) | 0;
      height = (input.height || (context.framebufferHeight - y)) | 0;
      data = input.data || null;
    }

    // sanity check input.data
    if (data) {
      if (type === GL_UNSIGNED_BYTE$7) {
        check$1(
          data instanceof Uint8Array,
          'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
      } else if (type === GL_FLOAT$7) {
        check$1(
          data instanceof Float32Array,
          'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
      }
    }

    check$1(
      width > 0 && width + x <= context.framebufferWidth,
      'invalid width for read pixels');
    check$1(
      height > 0 && height + y <= context.framebufferHeight,
      'invalid height for read pixels');

    // Update WebGL state
    reglPoll();

    // Compute size
    var size = width * height * 4;

    // Allocate data
    if (!data) {
      if (type === GL_UNSIGNED_BYTE$7) {
        data = new Uint8Array(size);
      } else if (type === GL_FLOAT$7) {
        data = data || new Float32Array(size);
      }
    }

    // Type check
    check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
    check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

    // Run read pixels
    gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
    gl.readPixels(x, y, width, height, GL_RGBA$3,
                  type,
                  data);

    return data
  }

  function readPixelsFBO (options) {
    var result;
    framebufferState.setFBO({
      framebuffer: options.framebuffer
    }, function () {
      result = readPixelsImpl(options);
    });
    return result
  }

  function readPixels (options) {
    if (!options || !('framebuffer' in options)) {
      return readPixelsImpl(options)
    } else {
      return readPixelsFBO(options)
    }
  }

  return readPixels
}

function slice (x) {
  return Array.prototype.slice.call(x)
}

function join (x) {
  return slice(x).join('')
}

function createEnvironment () {
  // Unique variable id counter
  var varCounter = 0;

  // Linked values are passed from this scope into the generated code block
  // Calling link() passes a value into the generated scope and returns
  // the variable name which it is bound to
  var linkedNames = [];
  var linkedValues = [];
  function link (value) {
    for (var i = 0; i < linkedValues.length; ++i) {
      if (linkedValues[i] === value) {
        return linkedNames[i]
      }
    }

    var name = 'g' + (varCounter++);
    linkedNames.push(name);
    linkedValues.push(value);
    return name
  }

  // create a code block
  function block () {
    var code = [];
    function push () {
      code.push.apply(code, slice(arguments));
    }

    var vars = [];
    function def () {
      var name = 'v' + (varCounter++);
      vars.push(name);

      if (arguments.length > 0) {
        code.push(name, '=');
        code.push.apply(code, slice(arguments));
        code.push(';');
      }

      return name
    }

    return extend(push, {
      def: def,
      toString: function () {
        return join([
          (vars.length > 0 ? 'var ' + vars + ';' : ''),
          join(code)
        ])
      }
    })
  }

  function scope () {
    var entry = block();
    var exit = block();

    var entryToString = entry.toString;
    var exitToString = exit.toString;

    function save (object, prop) {
      exit(object, prop, '=', entry.def(object, prop), ';');
    }

    return extend(function () {
      entry.apply(entry, slice(arguments));
    }, {
      def: entry.def,
      entry: entry,
      exit: exit,
      save: save,
      set: function (object, prop, value) {
        save(object, prop);
        entry(object, prop, '=', value, ';');
      },
      toString: function () {
        return entryToString() + exitToString()
      }
    })
  }

  function conditional () {
    var pred = join(arguments);
    var thenBlock = scope();
    var elseBlock = scope();

    var thenToString = thenBlock.toString;
    var elseToString = elseBlock.toString;

    return extend(thenBlock, {
      then: function () {
        thenBlock.apply(thenBlock, slice(arguments));
        return this
      },
      else: function () {
        elseBlock.apply(elseBlock, slice(arguments));
        return this
      },
      toString: function () {
        var elseClause = elseToString();
        if (elseClause) {
          elseClause = 'else{' + elseClause + '}';
        }
        return join([
          'if(', pred, '){',
          thenToString(),
          '}', elseClause
        ])
      }
    })
  }

  // procedure list
  var globalBlock = block();
  var procedures = {};
  function proc (name, count) {
    var args = [];
    function arg () {
      var name = 'a' + args.length;
      args.push(name);
      return name
    }

    count = count || 0;
    for (var i = 0; i < count; ++i) {
      arg();
    }

    var body = scope();
    var bodyToString = body.toString;

    var result = procedures[name] = extend(body, {
      arg: arg,
      toString: function () {
        return join([
          'function(', args.join(), '){',
          bodyToString(),
          '}'
        ])
      }
    });

    return result
  }

  function compile () {
    var code = ['"use strict";',
      globalBlock,
      'return {'];
    Object.keys(procedures).forEach(function (name) {
      code.push('"', name, '":', procedures[name].toString(), ',');
    });
    code.push('}');
    var src = join(code)
      .replace(/;/g, ';\n')
      .replace(/}/g, '}\n')
      .replace(/{/g, '{\n');
    var proc = Function.apply(null, linkedNames.concat(src));
    return proc.apply(null, linkedValues)
  }

  return {
    global: globalBlock,
    link: link,
    block: block,
    proc: proc,
    scope: scope,
    cond: conditional,
    compile: compile
  }
}

// "cute" names for vector components
var CUTE_COMPONENTS = 'xyzw'.split('');

var GL_UNSIGNED_BYTE$8 = 5121;

var ATTRIB_STATE_POINTER = 1;
var ATTRIB_STATE_CONSTANT = 2;

var DYN_FUNC$1 = 0;
var DYN_PROP$1 = 1;
var DYN_CONTEXT$1 = 2;
var DYN_STATE$1 = 3;
var DYN_THUNK = 4;

var S_DITHER = 'dither';
var S_BLEND_ENABLE = 'blend.enable';
var S_BLEND_COLOR = 'blend.color';
var S_BLEND_EQUATION = 'blend.equation';
var S_BLEND_FUNC = 'blend.func';
var S_DEPTH_ENABLE = 'depth.enable';
var S_DEPTH_FUNC = 'depth.func';
var S_DEPTH_RANGE = 'depth.range';
var S_DEPTH_MASK = 'depth.mask';
var S_COLOR_MASK = 'colorMask';
var S_CULL_ENABLE = 'cull.enable';
var S_CULL_FACE = 'cull.face';
var S_FRONT_FACE = 'frontFace';
var S_LINE_WIDTH = 'lineWidth';
var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
var S_SAMPLE_ALPHA = 'sample.alpha';
var S_SAMPLE_ENABLE = 'sample.enable';
var S_SAMPLE_COVERAGE = 'sample.coverage';
var S_STENCIL_ENABLE = 'stencil.enable';
var S_STENCIL_MASK = 'stencil.mask';
var S_STENCIL_FUNC = 'stencil.func';
var S_STENCIL_OPFRONT = 'stencil.opFront';
var S_STENCIL_OPBACK = 'stencil.opBack';
var S_SCISSOR_ENABLE = 'scissor.enable';
var S_SCISSOR_BOX = 'scissor.box';
var S_VIEWPORT = 'viewport';

var S_PROFILE = 'profile';

var S_FRAMEBUFFER = 'framebuffer';
var S_VERT = 'vert';
var S_FRAG = 'frag';
var S_ELEMENTS = 'elements';
var S_PRIMITIVE = 'primitive';
var S_COUNT = 'count';
var S_OFFSET = 'offset';
var S_INSTANCES = 'instances';

var SUFFIX_WIDTH = 'Width';
var SUFFIX_HEIGHT = 'Height';

var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
var S_DRAWINGBUFFER = 'drawingBuffer';
var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

var NESTED_OPTIONS = [
  S_BLEND_FUNC,
  S_BLEND_EQUATION,
  S_STENCIL_FUNC,
  S_STENCIL_OPFRONT,
  S_STENCIL_OPBACK,
  S_SAMPLE_COVERAGE,
  S_VIEWPORT,
  S_SCISSOR_BOX,
  S_POLYGON_OFFSET_OFFSET
];

var GL_ARRAY_BUFFER$1 = 34962;
var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

var GL_FRAGMENT_SHADER$1 = 35632;
var GL_VERTEX_SHADER$1 = 35633;

var GL_TEXTURE_2D$3 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP$2 = 0x8513;

var GL_CULL_FACE = 0x0B44;
var GL_BLEND = 0x0BE2;
var GL_DITHER = 0x0BD0;
var GL_STENCIL_TEST = 0x0B90;
var GL_DEPTH_TEST = 0x0B71;
var GL_SCISSOR_TEST = 0x0C11;
var GL_POLYGON_OFFSET_FILL = 0x8037;
var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
var GL_SAMPLE_COVERAGE = 0x80A0;

var GL_FLOAT$8 = 5126;
var GL_FLOAT_VEC2 = 35664;
var GL_FLOAT_VEC3 = 35665;
var GL_FLOAT_VEC4 = 35666;
var GL_INT$3 = 5124;
var GL_INT_VEC2 = 35667;
var GL_INT_VEC3 = 35668;
var GL_INT_VEC4 = 35669;
var GL_BOOL = 35670;
var GL_BOOL_VEC2 = 35671;
var GL_BOOL_VEC3 = 35672;
var GL_BOOL_VEC4 = 35673;
var GL_FLOAT_MAT2 = 35674;
var GL_FLOAT_MAT3 = 35675;
var GL_FLOAT_MAT4 = 35676;
var GL_SAMPLER_2D = 35678;
var GL_SAMPLER_CUBE = 35680;

var GL_TRIANGLES$1 = 4;

var GL_FRONT = 1028;
var GL_BACK = 1029;
var GL_CW = 0x0900;
var GL_CCW = 0x0901;
var GL_MIN_EXT = 0x8007;
var GL_MAX_EXT = 0x8008;
var GL_ALWAYS = 519;
var GL_KEEP = 7680;
var GL_ZERO = 0;
var GL_ONE = 1;
var GL_FUNC_ADD = 0x8006;
var GL_LESS = 513;

var GL_FRAMEBUFFER$2 = 0x8D40;
var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

var blendFuncs = {
  '0': 0,
  '1': 1,
  'zero': 0,
  'one': 1,
  'src color': 768,
  'one minus src color': 769,
  'src alpha': 770,
  'one minus src alpha': 771,
  'dst color': 774,
  'one minus dst color': 775,
  'dst alpha': 772,
  'one minus dst alpha': 773,
  'constant color': 32769,
  'one minus constant color': 32770,
  'constant alpha': 32771,
  'one minus constant alpha': 32772,
  'src alpha saturate': 776
};

// There are invalid values for srcRGB and dstRGB. See:
// https://www.khronos.org/registry/webgl/specs/1.0/#6.13
// https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
var invalidBlendCombinations = [
  'constant color, constant alpha',
  'one minus constant color, constant alpha',
  'constant color, one minus constant alpha',
  'one minus constant color, one minus constant alpha',
  'constant alpha, constant color',
  'constant alpha, one minus constant color',
  'one minus constant alpha, constant color',
  'one minus constant alpha, one minus constant color'
];

var compareFuncs = {
  'never': 512,
  'less': 513,
  '<': 513,
  'equal': 514,
  '=': 514,
  '==': 514,
  '===': 514,
  'lequal': 515,
  '<=': 515,
  'greater': 516,
  '>': 516,
  'notequal': 517,
  '!=': 517,
  '!==': 517,
  'gequal': 518,
  '>=': 518,
  'always': 519
};

var stencilOps = {
  '0': 0,
  'zero': 0,
  'keep': 7680,
  'replace': 7681,
  'increment': 7682,
  'decrement': 7683,
  'increment wrap': 34055,
  'decrement wrap': 34056,
  'invert': 5386
};

var shaderType = {
  'frag': GL_FRAGMENT_SHADER$1,
  'vert': GL_VERTEX_SHADER$1
};

var orientationType = {
  'cw': GL_CW,
  'ccw': GL_CCW
};

function isBufferArgs (x) {
  return Array.isArray(x) ||
    isTypedArray(x) ||
    isNDArrayLike(x)
}

// Make sure viewport is processed first
function sortState (state) {
  return state.sort(function (a, b) {
    if (a === S_VIEWPORT) {
      return -1
    } else if (b === S_VIEWPORT) {
      return 1
    }
    return (a < b) ? -1 : 1
  })
}

function Declaration (thisDep, contextDep, propDep, append) {
  this.thisDep = thisDep;
  this.contextDep = contextDep;
  this.propDep = propDep;
  this.append = append;
}

function isStatic (decl) {
  return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
}

function createStaticDecl (append) {
  return new Declaration(false, false, false, append)
}

function createDynamicDecl (dyn, append) {
  var type = dyn.type;
  if (type === DYN_FUNC$1) {
    var numArgs = dyn.data.length;
    return new Declaration(
      true,
      numArgs >= 1,
      numArgs >= 2,
      append)
  } else if (type === DYN_THUNK) {
    var data = dyn.data;
    return new Declaration(
      data.thisDep,
      data.contextDep,
      data.propDep,
      append)
  } else {
    return new Declaration(
      type === DYN_STATE$1,
      type === DYN_CONTEXT$1,
      type === DYN_PROP$1,
      append)
  }
}

var SCOPE_DECL = new Declaration(false, false, false, function () {});

function reglCore (
  gl,
  stringStore,
  extensions,
  limits,
  bufferState,
  elementState,
  textureState,
  framebufferState,
  uniformState,
  attributeState,
  shaderState,
  drawState,
  contextState,
  timer,
  config) {
  var AttributeRecord = attributeState.Record;

  var blendEquations = {
    'add': 32774,
    'subtract': 32778,
    'reverse subtract': 32779
  };
  if (extensions.ext_blend_minmax) {
    blendEquations.min = GL_MIN_EXT;
    blendEquations.max = GL_MAX_EXT;
  }

  var extInstancing = extensions.angle_instanced_arrays;
  var extDrawBuffers = extensions.webgl_draw_buffers;

  // ===================================================
  // ===================================================
  // WEBGL STATE
  // ===================================================
  // ===================================================
  var currentState = {
    dirty: true,
    profile: config.profile
  };
  var nextState = {};
  var GL_STATE_NAMES = [];
  var GL_FLAGS = {};
  var GL_VARIABLES = {};

  function propName (name) {
    return name.replace('.', '_')
  }

  function stateFlag (sname, cap, init) {
    var name = propName(sname);
    GL_STATE_NAMES.push(sname);
    nextState[name] = currentState[name] = !!init;
    GL_FLAGS[name] = cap;
  }

  function stateVariable (sname, func, init) {
    var name = propName(sname);
    GL_STATE_NAMES.push(sname);
    if (Array.isArray(init)) {
      currentState[name] = init.slice();
      nextState[name] = init.slice();
    } else {
      currentState[name] = nextState[name] = init;
    }
    GL_VARIABLES[name] = func;
  }

  // Dithering
  stateFlag(S_DITHER, GL_DITHER);

  // Blending
  stateFlag(S_BLEND_ENABLE, GL_BLEND);
  stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
  stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
    [GL_FUNC_ADD, GL_FUNC_ADD]);
  stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
    [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

  // Depth
  stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
  stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
  stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
  stateVariable(S_DEPTH_MASK, 'depthMask', true);

  // Color mask
  stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

  // Face culling
  stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
  stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

  // Front face orientation
  stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

  // Line width
  stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

  // Polygon offset
  stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
  stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

  // Sample coverage
  stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
  stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
  stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

  // Stencil
  stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
  stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
  stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
  stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
    [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
  stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
    [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

  // Scissor
  stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
  stateVariable(S_SCISSOR_BOX, 'scissor',
    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

  // Viewport
  stateVariable(S_VIEWPORT, S_VIEWPORT,
    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

  // ===================================================
  // ===================================================
  // ENVIRONMENT
  // ===================================================
  // ===================================================
  var sharedState = {
    gl: gl,
    context: contextState,
    strings: stringStore,
    next: nextState,
    current: currentState,
    draw: drawState,
    elements: elementState,
    buffer: bufferState,
    shader: shaderState,
    attributes: attributeState.state,
    uniforms: uniformState,
    framebuffer: framebufferState,
    extensions: extensions,

    timer: timer,
    isBufferArgs: isBufferArgs
  };

  var sharedConstants = {
    primTypes: primTypes,
    compareFuncs: compareFuncs,
    blendFuncs: blendFuncs,
    blendEquations: blendEquations,
    stencilOps: stencilOps,
    glTypes: glTypes,
    orientationType: orientationType
  };

  check$1.optional(function () {
    sharedState.isArrayLike = isArrayLike;
  });

  if (extDrawBuffers) {
    sharedConstants.backBuffer = [GL_BACK];
    sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
      if (i === 0) {
        return [0]
      }
      return loop(i, function (j) {
        return GL_COLOR_ATTACHMENT0$2 + j
      })
    });
  }

  var drawCallCounter = 0;
  function createREGLEnvironment () {
    var env = createEnvironment();
    var link = env.link;
    var global = env.global;
    env.id = drawCallCounter++;

    env.batchId = '0';

    // link shared state
    var SHARED = link(sharedState);
    var shared = env.shared = {
      props: 'a0'
    };
    Object.keys(sharedState).forEach(function (prop) {
      shared[prop] = global.def(SHARED, '.', prop);
    });

    // Inject runtime assertion stuff for debug builds
    check$1.optional(function () {
      env.CHECK = link(check$1);
      env.commandStr = check$1.guessCommand();
      env.command = link(env.commandStr);
      env.assert = function (block, pred, message) {
        block(
          'if(!(', pred, '))',
          this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
      };

      sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
    });

    // Copy GL state variables over
    var nextVars = env.next = {};
    var currentVars = env.current = {};
    Object.keys(GL_VARIABLES).forEach(function (variable) {
      if (Array.isArray(currentState[variable])) {
        nextVars[variable] = global.def(shared.next, '.', variable);
        currentVars[variable] = global.def(shared.current, '.', variable);
      }
    });

    // Initialize shared constants
    var constants = env.constants = {};
    Object.keys(sharedConstants).forEach(function (name) {
      constants[name] = global.def(JSON.stringify(sharedConstants[name]));
    });

    // Helper function for calling a block
    env.invoke = function (block, x) {
      switch (x.type) {
        case DYN_FUNC$1:
          var argList = [
            'this',
            shared.context,
            shared.props,
            env.batchId
          ];
          return block.def(
            link(x.data), '.call(',
              argList.slice(0, Math.max(x.data.length + 1, 4)),
             ')')
        case DYN_PROP$1:
          return block.def(shared.props, x.data)
        case DYN_CONTEXT$1:
          return block.def(shared.context, x.data)
        case DYN_STATE$1:
          return block.def('this', x.data)
        case DYN_THUNK:
          x.data.append(env, block);
          return x.data.ref
      }
    };

    env.attribCache = {};

    var scopeAttribs = {};
    env.scopeAttrib = function (name) {
      var id = stringStore.id(name);
      if (id in scopeAttribs) {
        return scopeAttribs[id]
      }
      var binding = attributeState.scope[id];
      if (!binding) {
        binding = attributeState.scope[id] = new AttributeRecord();
      }
      var result = scopeAttribs[id] = link(binding);
      return result
    };

    return env
  }

  // ===================================================
  // ===================================================
  // PARSING
  // ===================================================
  // ===================================================
  function parseProfile (options) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    var profileEnable;
    if (S_PROFILE in staticOptions) {
      var value = !!staticOptions[S_PROFILE];
      profileEnable = createStaticDecl(function (env, scope) {
        return value
      });
      profileEnable.enable = value;
    } else if (S_PROFILE in dynamicOptions) {
      var dyn = dynamicOptions[S_PROFILE];
      profileEnable = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    }

    return profileEnable
  }

  function parseFramebuffer (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    if (S_FRAMEBUFFER in staticOptions) {
      var framebuffer = staticOptions[S_FRAMEBUFFER];
      if (framebuffer) {
        framebuffer = framebufferState.getFramebuffer(framebuffer);
        check$1.command(framebuffer, 'invalid framebuffer object');
        return createStaticDecl(function (env, block) {
          var FRAMEBUFFER = env.link(framebuffer);
          var shared = env.shared;
          block.set(
            shared.framebuffer,
            '.next',
            FRAMEBUFFER);
          var CONTEXT = shared.context;
          block.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            FRAMEBUFFER + '.width');
          block.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            FRAMEBUFFER + '.height');
          return FRAMEBUFFER
        })
      } else {
        return createStaticDecl(function (env, scope) {
          var shared = env.shared;
          scope.set(
            shared.framebuffer,
            '.next',
            'null');
          var CONTEXT = shared.context;
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
          return 'null'
        })
      }
    } else if (S_FRAMEBUFFER in dynamicOptions) {
      var dyn = dynamicOptions[S_FRAMEBUFFER];
      return createDynamicDecl(dyn, function (env, scope) {
        var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
        var shared = env.shared;
        var FRAMEBUFFER_STATE = shared.framebuffer;
        var FRAMEBUFFER = scope.def(
          FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

        check$1.optional(function () {
          env.assert(scope,
            '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
            'invalid framebuffer object');
        });

        scope.set(
          FRAMEBUFFER_STATE,
          '.next',
          FRAMEBUFFER);
        var CONTEXT = shared.context;
        scope.set(
          CONTEXT,
          '.' + S_FRAMEBUFFER_WIDTH,
          FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
          CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
        scope.set(
          CONTEXT,
          '.' + S_FRAMEBUFFER_HEIGHT,
          FRAMEBUFFER +
          '?' + FRAMEBUFFER + '.height:' +
          CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
        return FRAMEBUFFER
      })
    } else {
      return null
    }
  }

  function parseViewportScissor (options, framebuffer, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseBox (param) {
      if (param in staticOptions) {
        var box = staticOptions[param];
        check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

        var isStatic = true;
        var x = box.x | 0;
        var y = box.y | 0;
        var w, h;
        if ('width' in box) {
          w = box.width | 0;
          check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
        } else {
          isStatic = false;
        }
        if ('height' in box) {
          h = box.height | 0;
          check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
        } else {
          isStatic = false;
        }

        return new Declaration(
          !isStatic && framebuffer && framebuffer.thisDep,
          !isStatic && framebuffer && framebuffer.contextDep,
          !isStatic && framebuffer && framebuffer.propDep,
          function (env, scope) {
            var CONTEXT = env.shared.context;
            var BOX_W = w;
            if (!('width' in box)) {
              BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
            }
            var BOX_H = h;
            if (!('height' in box)) {
              BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
            }
            return [x, y, BOX_W, BOX_H]
          })
      } else if (param in dynamicOptions) {
        var dynBox = dynamicOptions[param];
        var result = createDynamicDecl(dynBox, function (env, scope) {
          var BOX = env.invoke(scope, dynBox);

          check$1.optional(function () {
            env.assert(scope,
              BOX + '&&typeof ' + BOX + '==="object"',
              'invalid ' + param);
          });

          var CONTEXT = env.shared.context;
          var BOX_X = scope.def(BOX, '.x|0');
          var BOX_Y = scope.def(BOX, '.y|0');
          var BOX_W = scope.def(
            '"width" in ', BOX, '?', BOX, '.width|0:',
            '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
          var BOX_H = scope.def(
            '"height" in ', BOX, '?', BOX, '.height|0:',
            '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

          check$1.optional(function () {
            env.assert(scope,
              BOX_W + '>=0&&' +
              BOX_H + '>=0',
              'invalid ' + param);
          });

          return [BOX_X, BOX_Y, BOX_W, BOX_H]
        });
        if (framebuffer) {
          result.thisDep = result.thisDep || framebuffer.thisDep;
          result.contextDep = result.contextDep || framebuffer.contextDep;
          result.propDep = result.propDep || framebuffer.propDep;
        }
        return result
      } else if (framebuffer) {
        return new Declaration(
          framebuffer.thisDep,
          framebuffer.contextDep,
          framebuffer.propDep,
          function (env, scope) {
            var CONTEXT = env.shared.context;
            return [
              0, 0,
              scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
              scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
          })
      } else {
        return null
      }
    }

    var viewport = parseBox(S_VIEWPORT);

    if (viewport) {
      var prevViewport = viewport;
      viewport = new Declaration(
        viewport.thisDep,
        viewport.contextDep,
        viewport.propDep,
        function (env, scope) {
          var VIEWPORT = prevViewport.append(env, scope);
          var CONTEXT = env.shared.context;
          scope.set(
            CONTEXT,
            '.' + S_VIEWPORT_WIDTH,
            VIEWPORT[2]);
          scope.set(
            CONTEXT,
            '.' + S_VIEWPORT_HEIGHT,
            VIEWPORT[3]);
          return VIEWPORT
        });
    }

    return {
      viewport: viewport,
      scissor_box: parseBox(S_SCISSOR_BOX)
    }
  }

  function parseProgram (options) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseShader (name) {
      if (name in staticOptions) {
        var id = stringStore.id(staticOptions[name]);
        check$1.optional(function () {
          shaderState.shader(shaderType[name], id, check$1.guessCommand());
        });
        var result = createStaticDecl(function () {
          return id
        });
        result.id = id;
        return result
      } else if (name in dynamicOptions) {
        var dyn = dynamicOptions[name];
        return createDynamicDecl(dyn, function (env, scope) {
          var str = env.invoke(scope, dyn);
          var id = scope.def(env.shared.strings, '.id(', str, ')');
          check$1.optional(function () {
            scope(
              env.shared.shader, '.shader(',
              shaderType[name], ',',
              id, ',',
              env.command, ');');
          });
          return id
        })
      }
      return null
    }

    var frag = parseShader(S_FRAG);
    var vert = parseShader(S_VERT);

    var program = null;
    var progVar;
    if (isStatic(frag) && isStatic(vert)) {
      program = shaderState.program(vert.id, frag.id);
      progVar = createStaticDecl(function (env, scope) {
        return env.link(program)
      });
    } else {
      progVar = new Declaration(
        (frag && frag.thisDep) || (vert && vert.thisDep),
        (frag && frag.contextDep) || (vert && vert.contextDep),
        (frag && frag.propDep) || (vert && vert.propDep),
        function (env, scope) {
          var SHADER_STATE = env.shared.shader;
          var fragId;
          if (frag) {
            fragId = frag.append(env, scope);
          } else {
            fragId = scope.def(SHADER_STATE, '.', S_FRAG);
          }
          var vertId;
          if (vert) {
            vertId = vert.append(env, scope);
          } else {
            vertId = scope.def(SHADER_STATE, '.', S_VERT);
          }
          var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
          check$1.optional(function () {
            progDef += ',' + env.command;
          });
          return scope.def(progDef + ')')
        });
    }

    return {
      frag: frag,
      vert: vert,
      progVar: progVar,
      program: program
    }
  }

  function parseDraw (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseElements () {
      if (S_ELEMENTS in staticOptions) {
        var elements = staticOptions[S_ELEMENTS];
        if (isBufferArgs(elements)) {
          elements = elementState.getElements(elementState.create(elements, true));
        } else if (elements) {
          elements = elementState.getElements(elements);
          check$1.command(elements, 'invalid elements', env.commandStr);
        }
        var result = createStaticDecl(function (env, scope) {
          if (elements) {
            var result = env.link(elements);
            env.ELEMENTS = result;
            return result
          }
          env.ELEMENTS = null;
          return null
        });
        result.value = elements;
        return result
      } else if (S_ELEMENTS in dynamicOptions) {
        var dyn = dynamicOptions[S_ELEMENTS];
        return createDynamicDecl(dyn, function (env, scope) {
          var shared = env.shared;

          var IS_BUFFER_ARGS = shared.isBufferArgs;
          var ELEMENT_STATE = shared.elements;

          var elementDefn = env.invoke(scope, dyn);
          var elements = scope.def('null');
          var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

          var ifte = env.cond(elementStream)
            .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
            .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

          check$1.optional(function () {
            env.assert(ifte.else,
              '!' + elementDefn + '||' + elements,
              'invalid elements');
          });

          scope.entry(ifte);
          scope.exit(
            env.cond(elementStream)
              .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

          env.ELEMENTS = elements;

          return elements
        })
      }

      return null
    }

    var elements = parseElements();

    function parsePrimitive () {
      if (S_PRIMITIVE in staticOptions) {
        var primitive = staticOptions[S_PRIMITIVE];
        check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
        return createStaticDecl(function (env, scope) {
          return primTypes[primitive]
        })
      } else if (S_PRIMITIVE in dynamicOptions) {
        var dynPrimitive = dynamicOptions[S_PRIMITIVE];
        return createDynamicDecl(dynPrimitive, function (env, scope) {
          var PRIM_TYPES = env.constants.primTypes;
          var prim = env.invoke(scope, dynPrimitive);
          check$1.optional(function () {
            env.assert(scope,
              prim + ' in ' + PRIM_TYPES,
              'invalid primitive, must be one of ' + Object.keys(primTypes));
          });
          return scope.def(PRIM_TYPES, '[', prim, ']')
        })
      } else if (elements) {
        if (isStatic(elements)) {
          if (elements.value) {
            return createStaticDecl(function (env, scope) {
              return scope.def(env.ELEMENTS, '.primType')
            })
          } else {
            return createStaticDecl(function () {
              return GL_TRIANGLES$1
            })
          }
        } else {
          return new Declaration(
            elements.thisDep,
            elements.contextDep,
            elements.propDep,
            function (env, scope) {
              var elements = env.ELEMENTS;
              return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
            })
        }
      }
      return null
    }

    function parseParam (param, isOffset) {
      if (param in staticOptions) {
        var value = staticOptions[param] | 0;
        check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
        return createStaticDecl(function (env, scope) {
          if (isOffset) {
            env.OFFSET = value;
          }
          return value
        })
      } else if (param in dynamicOptions) {
        var dynValue = dynamicOptions[param];
        return createDynamicDecl(dynValue, function (env, scope) {
          var result = env.invoke(scope, dynValue);
          if (isOffset) {
            env.OFFSET = result;
            check$1.optional(function () {
              env.assert(scope,
                result + '>=0',
                'invalid ' + param);
            });
          }
          return result
        })
      } else if (isOffset && elements) {
        return createStaticDecl(function (env, scope) {
          env.OFFSET = '0';
          return 0
        })
      }
      return null
    }

    var OFFSET = parseParam(S_OFFSET, true);

    function parseVertCount () {
      if (S_COUNT in staticOptions) {
        var count = staticOptions[S_COUNT] | 0;
        check$1.command(
          typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
        return createStaticDecl(function () {
          return count
        })
      } else if (S_COUNT in dynamicOptions) {
        var dynCount = dynamicOptions[S_COUNT];
        return createDynamicDecl(dynCount, function (env, scope) {
          var result = env.invoke(scope, dynCount);
          check$1.optional(function () {
            env.assert(scope,
              'typeof ' + result + '==="number"&&' +
              result + '>=0&&' +
              result + '===(' + result + '|0)',
              'invalid vertex count');
          });
          return result
        })
      } else if (elements) {
        if (isStatic(elements)) {
          if (elements) {
            if (OFFSET) {
              return new Declaration(
                OFFSET.thisDep,
                OFFSET.contextDep,
                OFFSET.propDep,
                function (env, scope) {
                  var result = scope.def(
                    env.ELEMENTS, '.vertCount-', env.OFFSET);

                  check$1.optional(function () {
                    env.assert(scope,
                      result + '>=0',
                      'invalid vertex offset/element buffer too small');
                  });

                  return result
                })
            } else {
              return createStaticDecl(function (env, scope) {
                return scope.def(env.ELEMENTS, '.vertCount')
              })
            }
          } else {
            var result = createStaticDecl(function () {
              return -1
            });
            check$1.optional(function () {
              result.MISSING = true;
            });
            return result
          }
        } else {
          var variable = new Declaration(
            elements.thisDep || OFFSET.thisDep,
            elements.contextDep || OFFSET.contextDep,
            elements.propDep || OFFSET.propDep,
            function (env, scope) {
              var elements = env.ELEMENTS;
              if (env.OFFSET) {
                return scope.def(elements, '?', elements, '.vertCount-',
                  env.OFFSET, ':-1')
              }
              return scope.def(elements, '?', elements, '.vertCount:-1')
            });
          check$1.optional(function () {
            variable.DYNAMIC = true;
          });
          return variable
        }
      }
      return null
    }

    return {
      elements: elements,
      primitive: parsePrimitive(),
      count: parseVertCount(),
      instances: parseParam(S_INSTANCES, false),
      offset: OFFSET
    }
  }

  function parseGLState (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    var STATE = {};

    GL_STATE_NAMES.forEach(function (prop) {
      var param = propName(prop);

      function parseParam (parseStatic, parseDynamic) {
        if (prop in staticOptions) {
          var value = parseStatic(staticOptions[prop]);
          STATE[param] = createStaticDecl(function () {
            return value
          });
        } else if (prop in dynamicOptions) {
          var dyn = dynamicOptions[prop];
          STATE[param] = createDynamicDecl(dyn, function (env, scope) {
            return parseDynamic(env, scope, env.invoke(scope, dyn))
          });
        }
      }

      switch (prop) {
        case S_CULL_ENABLE:
        case S_BLEND_ENABLE:
        case S_DITHER:
        case S_STENCIL_ENABLE:
        case S_DEPTH_ENABLE:
        case S_SCISSOR_ENABLE:
        case S_POLYGON_OFFSET_ENABLE:
        case S_SAMPLE_ALPHA:
        case S_SAMPLE_ENABLE:
        case S_DEPTH_MASK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'boolean', prop, env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="boolean"',
                  'invalid flag ' + prop, env.commandStr);
              });
              return value
            })

        case S_DEPTH_FUNC:
          return parseParam(
            function (value) {
              check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
              return compareFuncs[value]
            },
            function (env, scope, value) {
              var COMPARE_FUNCS = env.constants.compareFuncs;
              check$1.optional(function () {
                env.assert(scope,
                  value + ' in ' + COMPARE_FUNCS,
                  'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
              });
              return scope.def(COMPARE_FUNCS, '[', value, ']')
            })

        case S_DEPTH_RANGE:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) &&
                value.length === 2 &&
                typeof value[0] === 'number' &&
                typeof value[1] === 'number' &&
                value[0] <= value[1],
                'depth range is 2d array',
                env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===2&&' +
                  'typeof ' + value + '[0]==="number"&&' +
                  'typeof ' + value + '[1]==="number"&&' +
                  value + '[0]<=' + value + '[1]',
                  'depth range must be a 2d array');
              });

              var Z_NEAR = scope.def('+', value, '[0]');
              var Z_FAR = scope.def('+', value, '[1]');
              return [Z_NEAR, Z_FAR]
            })

        case S_BLEND_FUNC:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', 'blend.func', env.commandStr);
              var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
              var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
              var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
              var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
              check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
              check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
              check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
              check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

              check$1.command(
                (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
                'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

              return [
                blendFuncs[srcRGB],
                blendFuncs[dstRGB],
                blendFuncs[srcAlpha],
                blendFuncs[dstAlpha]
              ]
            },
            function (env, scope, value) {
              var BLEND_FUNCS = env.constants.blendFuncs;

              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid blend func, must be an object');
              });

              function read (prefix, suffix) {
                var func = scope.def(
                  '"', prefix, suffix, '" in ', value,
                  '?', value, '.', prefix, suffix,
                  ':', value, '.', prefix);

                check$1.optional(function () {
                  env.assert(scope,
                    func + ' in ' + BLEND_FUNCS,
                    'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                });

                return func
              }

              var srcRGB = read('src', 'RGB');
              var dstRGB = read('dst', 'RGB');

              check$1.optional(function () {
                var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

                env.assert(scope,
                           INVALID_BLEND_COMBINATIONS +
                           '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
                           'unallowed blending combination for (srcRGB, dstRGB)'
                          );
              });

              var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
              var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
              var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
              var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

              return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
            })

        case S_BLEND_EQUATION:
          return parseParam(
            function (value) {
              if (typeof value === 'string') {
                check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                return [
                  blendEquations[value],
                  blendEquations[value]
                ]
              } else if (typeof value === 'object') {
                check$1.commandParameter(
                  value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                check$1.commandParameter(
                  value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                return [
                  blendEquations[value.rgb],
                  blendEquations[value.alpha]
                ]
              } else {
                check$1.commandRaise('invalid blend.equation', env.commandStr);
              }
            },
            function (env, scope, value) {
              var BLEND_EQUATIONS = env.constants.blendEquations;

              var RGB = scope.def();
              var ALPHA = scope.def();

              var ifte = env.cond('typeof ', value, '==="string"');

              check$1.optional(function () {
                function checkProp (block, name, value) {
                  env.assert(block,
                    value + ' in ' + BLEND_EQUATIONS,
                    'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                }
                checkProp(ifte.then, prop, value);

                env.assert(ifte.else,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
                checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                checkProp(ifte.else, prop + '.alpha', value + '.alpha');
              });

              ifte.then(
                RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
              ifte.else(
                RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

              scope(ifte);

              return [RGB, ALPHA]
            })

        case S_BLEND_COLOR:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) &&
                value.length === 4,
                'blend.color must be a 4d array', env.commandStr);
              return loop(4, function (i) {
                return +value[i]
              })
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===4',
                  'blend.color must be a 4d array');
              });
              return loop(4, function (i) {
                return scope.def('+', value, '[', i, ']')
              })
            })

        case S_STENCIL_MASK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'number', param, env.commandStr);
              return value | 0
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="number"',
                  'invalid stencil.mask');
              });
              return scope.def(value, '|0')
            })

        case S_STENCIL_FUNC:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var cmp = value.cmp || 'keep';
              var ref = value.ref || 0;
              var mask = 'mask' in value ? value.mask : -1;
              check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
              check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
              check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
              return [
                compareFuncs[cmp],
                ref,
                mask
              ]
            },
            function (env, scope, value) {
              var COMPARE_FUNCS = env.constants.compareFuncs;
              check$1.optional(function () {
                function assert () {
                  env.assert(scope,
                    Array.prototype.join.call(arguments, ''),
                    'invalid stencil.func');
                }
                assert(value + '&&typeof ', value, '==="object"');
                assert('!("cmp" in ', value, ')||(',
                  value, '.cmp in ', COMPARE_FUNCS, ')');
              });
              var cmp = scope.def(
                '"cmp" in ', value,
                '?', COMPARE_FUNCS, '[', value, '.cmp]',
                ':', GL_KEEP);
              var ref = scope.def(value, '.ref|0');
              var mask = scope.def(
                '"mask" in ', value,
                '?', value, '.mask|0:-1');
              return [cmp, ref, mask]
            })

        case S_STENCIL_OPFRONT:
        case S_STENCIL_OPBACK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var fail = value.fail || 'keep';
              var zfail = value.zfail || 'keep';
              var zpass = value.zpass || 'keep';
              check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
              check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
              check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
              return [
                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                stencilOps[fail],
                stencilOps[zfail],
                stencilOps[zpass]
              ]
            },
            function (env, scope, value) {
              var STENCIL_OPS = env.constants.stencilOps;

              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
              });

              function read (name) {
                check$1.optional(function () {
                  env.assert(scope,
                    '!("' + name + '" in ' + value + ')||' +
                    '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
                    'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                });

                return scope.def(
                  '"', name, '" in ', value,
                  '?', STENCIL_OPS, '[', value, '.', name, ']:',
                  GL_KEEP)
              }

              return [
                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                read('fail'),
                read('zfail'),
                read('zpass')
              ]
            })

        case S_POLYGON_OFFSET_OFFSET:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var factor = value.factor | 0;
              var units = value.units | 0;
              check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
              check$1.commandType(units, 'number', param + '.units', env.commandStr);
              return [factor, units]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
              });

              var FACTOR = scope.def(value, '.factor|0');
              var UNITS = scope.def(value, '.units|0');

              return [FACTOR, UNITS]
            })

        case S_CULL_FACE:
          return parseParam(
            function (value) {
              var face = 0;
              if (value === 'front') {
                face = GL_FRONT;
              } else if (value === 'back') {
                face = GL_BACK;
              }
              check$1.command(!!face, param, env.commandStr);
              return face
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '==="front"||' +
                  value + '==="back"',
                  'invalid cull.face');
              });
              return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
            })

        case S_LINE_WIDTH:
          return parseParam(
            function (value) {
              check$1.command(
                typeof value === 'number' &&
                value >= limits.lineWidthDims[0] &&
                value <= limits.lineWidthDims[1],
                'invalid line width, must be a positive number between ' +
                limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="number"&&' +
                  value + '>=' + limits.lineWidthDims[0] + '&&' +
                  value + '<=' + limits.lineWidthDims[1],
                  'invalid line width');
              });

              return value
            })

        case S_FRONT_FACE:
          return parseParam(
            function (value) {
              check$1.commandParameter(value, orientationType, param, env.commandStr);
              return orientationType[value]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '==="cw"||' +
                  value + '==="ccw"',
                  'invalid frontFace, must be one of cw,ccw');
              });
              return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
            })

        case S_COLOR_MASK:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) && value.length === 4,
                'color.mask must be length 4 array', env.commandStr);
              return value.map(function (v) { return !!v })
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===4',
                  'invalid color.mask');
              });
              return loop(4, function (i) {
                return '!!' + value + '[' + i + ']'
              })
            })

        case S_SAMPLE_COVERAGE:
          return parseParam(
            function (value) {
              check$1.command(typeof value === 'object' && value, param, env.commandStr);
              var sampleValue = 'value' in value ? value.value : 1;
              var sampleInvert = !!value.invert;
              check$1.command(
                typeof sampleValue === 'number' &&
                sampleValue >= 0 && sampleValue <= 1,
                'sample.coverage.value must be a number between 0 and 1', env.commandStr);
              return [sampleValue, sampleInvert]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid sample.coverage');
              });
              var VALUE = scope.def(
                '"value" in ', value, '?+', value, '.value:1');
              var INVERT = scope.def('!!', value, '.invert');
              return [VALUE, INVERT]
            })
      }
    });

    return STATE
  }

  function parseUniforms (uniforms, env) {
    var staticUniforms = uniforms.static;
    var dynamicUniforms = uniforms.dynamic;

    var UNIFORMS = {};

    Object.keys(staticUniforms).forEach(function (name) {
      var value = staticUniforms[name];
      var result;
      if (typeof value === 'number' ||
          typeof value === 'boolean') {
        result = createStaticDecl(function () {
          return value
        });
      } else if (typeof value === 'function') {
        var reglType = value._reglType;
        if (reglType === 'texture2d' ||
            reglType === 'textureCube') {
          result = createStaticDecl(function (env) {
            return env.link(value)
          });
        } else if (reglType === 'framebuffer' ||
                   reglType === 'framebufferCube') {
          check$1.command(value.color.length > 0,
            'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
          result = createStaticDecl(function (env) {
            return env.link(value.color[0])
          });
        } else {
          check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
        }
      } else if (isArrayLike(value)) {
        result = createStaticDecl(function (env) {
          var ITEM = env.global.def('[',
            loop(value.length, function (i) {
              check$1.command(
                typeof value[i] === 'number' ||
                typeof value[i] === 'boolean',
                'invalid uniform ' + name, env.commandStr);
              return value[i]
            }), ']');
          return ITEM
        });
      } else {
        check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
      }
      result.value = value;
      UNIFORMS[name] = result;
    });

    Object.keys(dynamicUniforms).forEach(function (key) {
      var dyn = dynamicUniforms[key];
      UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    });

    return UNIFORMS
  }

  function parseAttributes (attributes, env) {
    var staticAttributes = attributes.static;
    var dynamicAttributes = attributes.dynamic;

    var attributeDefs = {};

    Object.keys(staticAttributes).forEach(function (attribute) {
      var value = staticAttributes[attribute];
      var id = stringStore.id(attribute);

      var record = new AttributeRecord();
      if (isBufferArgs(value)) {
        record.state = ATTRIB_STATE_POINTER;
        record.buffer = bufferState.getBuffer(
          bufferState.create(value, GL_ARRAY_BUFFER$1, false, true));
        record.type = 0;
      } else {
        var buffer = bufferState.getBuffer(value);
        if (buffer) {
          record.state = ATTRIB_STATE_POINTER;
          record.buffer = buffer;
          record.type = 0;
        } else {
          check$1.command(typeof value === 'object' && value,
            'invalid data for attribute ' + attribute, env.commandStr);
          if ('constant' in value) {
            var constant = value.constant;
            record.buffer = 'null';
            record.state = ATTRIB_STATE_CONSTANT;
            if (typeof constant === 'number') {
              record.x = constant;
            } else {
              check$1.command(
                isArrayLike(constant) &&
                constant.length > 0 &&
                constant.length <= 4,
                'invalid constant for attribute ' + attribute, env.commandStr);
              CUTE_COMPONENTS.forEach(function (c, i) {
                if (i < constant.length) {
                  record[c] = constant[i];
                }
              });
            }
          } else {
            if (isBufferArgs(value.buffer)) {
              buffer = bufferState.getBuffer(
                bufferState.create(value.buffer, GL_ARRAY_BUFFER$1, false, true));
            } else {
              buffer = bufferState.getBuffer(value.buffer);
            }
            check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

            var offset = value.offset | 0;
            check$1.command(offset >= 0,
              'invalid offset for attribute "' + attribute + '"', env.commandStr);

            var stride = value.stride | 0;
            check$1.command(stride >= 0 && stride < 256,
              'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

            var size = value.size | 0;
            check$1.command(!('size' in value) || (size > 0 && size <= 4),
              'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

            var normalized = !!value.normalized;

            var type = 0;
            if ('type' in value) {
              check$1.commandParameter(
                value.type, glTypes,
                'invalid type for attribute ' + attribute, env.commandStr);
              type = glTypes[value.type];
            }

            var divisor = value.divisor | 0;
            if ('divisor' in value) {
              check$1.command(divisor === 0 || extInstancing,
                'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
              check$1.command(divisor >= 0,
                'invalid divisor for attribute "' + attribute + '"', env.commandStr);
            }

            check$1.optional(function () {
              var command = env.commandStr;

              var VALID_KEYS = [
                'buffer',
                'offset',
                'divisor',
                'normalized',
                'type',
                'size',
                'stride'
              ];

              Object.keys(value).forEach(function (prop) {
                check$1.command(
                  VALID_KEYS.indexOf(prop) >= 0,
                  'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
                  command);
              });
            });

            record.buffer = buffer;
            record.state = ATTRIB_STATE_POINTER;
            record.size = size;
            record.normalized = normalized;
            record.type = type || buffer.dtype;
            record.offset = offset;
            record.stride = stride;
            record.divisor = divisor;
          }
        }
      }

      attributeDefs[attribute] = createStaticDecl(function (env, scope) {
        var cache = env.attribCache;
        if (id in cache) {
          return cache[id]
        }
        var result = {
          isStream: false
        };
        Object.keys(record).forEach(function (key) {
          result[key] = record[key];
        });
        if (record.buffer) {
          result.buffer = env.link(record.buffer);
          result.type = result.type || (result.buffer + '.dtype');
        }
        cache[id] = result;
        return result
      });
    });

    Object.keys(dynamicAttributes).forEach(function (attribute) {
      var dyn = dynamicAttributes[attribute];

      function appendAttributeCode (env, block) {
        var VALUE = env.invoke(block, dyn);

        var shared = env.shared;

        var IS_BUFFER_ARGS = shared.isBufferArgs;
        var BUFFER_STATE = shared.buffer;

        // Perform validation on attribute
        check$1.optional(function () {
          env.assert(block,
            VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
            VALUE + '==="function")&&(' +
            IS_BUFFER_ARGS + '(' + VALUE + ')||' +
            BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
            BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
            IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
            '("constant" in ' + VALUE +
            '&&(typeof ' + VALUE + '.constant==="number"||' +
            shared.isArrayLike + '(' + VALUE + '.constant))))',
            'invalid dynamic attribute "' + attribute + '"');
        });

        // allocate names for result
        var result = {
          isStream: block.def(false)
        };
        var defaultRecord = new AttributeRecord();
        defaultRecord.state = ATTRIB_STATE_POINTER;
        Object.keys(defaultRecord).forEach(function (key) {
          result[key] = block.def('' + defaultRecord[key]);
        });

        var BUFFER = result.buffer;
        var TYPE = result.type;
        block(
          'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
          result.isStream, '=true;',
          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$1, ',', VALUE, ');',
          TYPE, '=', BUFFER, '.dtype;',
          '}else{',
          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
          'if(', BUFFER, '){',
          TYPE, '=', BUFFER, '.dtype;',
          '}else if("constant" in ', VALUE, '){',
          result.state, '=', ATTRIB_STATE_CONSTANT, ';',
          'if(typeof ' + VALUE + '.constant === "number"){',
          result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
          CUTE_COMPONENTS.slice(1).map(function (n) {
            return result[n]
          }).join('='), '=0;',
          '}else{',
          CUTE_COMPONENTS.map(function (name, i) {
            return (
              result[name] + '=' + VALUE + '.constant.length>' + i +
              '?' + VALUE + '.constant[' + i + ']:0;'
            )
          }).join(''),
          '}}else{',
          'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$1, ',', VALUE, '.buffer);',
          '}else{',
          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
          '}',
          TYPE, '="type" in ', VALUE, '?',
          shared.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
          result.normalized, '=!!', VALUE, '.normalized;');
        function emitReadRecord (name) {
          block(result[name], '=', VALUE, '.', name, '|0;');
        }
        emitReadRecord('size');
        emitReadRecord('offset');
        emitReadRecord('stride');
        emitReadRecord('divisor');

        block('}}');

        block.exit(
          'if(', result.isStream, '){',
          BUFFER_STATE, '.destroyStream(', BUFFER, ');',
          '}');

        return result
      }

      attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
    });

    return attributeDefs
  }

  function parseContext (context) {
    var staticContext = context.static;
    var dynamicContext = context.dynamic;
    var result = {};

    Object.keys(staticContext).forEach(function (name) {
      var value = staticContext[name];
      result[name] = createStaticDecl(function (env, scope) {
        if (typeof value === 'number' || typeof value === 'boolean') {
          return '' + value
        } else {
          return env.link(value)
        }
      });
    });

    Object.keys(dynamicContext).forEach(function (name) {
      var dyn = dynamicContext[name];
      result[name] = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    });

    return result
  }

  function parseArguments (options, attributes, uniforms, context, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    check$1.optional(function () {
      var KEY_NAMES = [
        S_FRAMEBUFFER,
        S_VERT,
        S_FRAG,
        S_ELEMENTS,
        S_PRIMITIVE,
        S_OFFSET,
        S_COUNT,
        S_INSTANCES,
        S_PROFILE
      ].concat(GL_STATE_NAMES);

      function checkKeys (dict) {
        Object.keys(dict).forEach(function (key) {
          check$1.command(
            KEY_NAMES.indexOf(key) >= 0,
            'unknown parameter "' + key + '"',
            env.commandStr);
        });
      }

      checkKeys(staticOptions);
      checkKeys(dynamicOptions);
    });

    var framebuffer = parseFramebuffer(options, env);
    var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
    var draw = parseDraw(options, env);
    var state = parseGLState(options, env);
    var shader = parseProgram(options, env);

    function copyBox (name) {
      var defn = viewportAndScissor[name];
      if (defn) {
        state[name] = defn;
      }
    }
    copyBox(S_VIEWPORT);
    copyBox(propName(S_SCISSOR_BOX));

    var dirty = Object.keys(state).length > 0;

    var result = {
      framebuffer: framebuffer,
      draw: draw,
      shader: shader,
      state: state,
      dirty: dirty
    };

    result.profile = parseProfile(options, env);
    result.uniforms = parseUniforms(uniforms, env);
    result.attributes = parseAttributes(attributes, env);
    result.context = parseContext(context, env);
    return result
  }

  // ===================================================
  // ===================================================
  // COMMON UPDATE FUNCTIONS
  // ===================================================
  // ===================================================
  function emitContext (env, scope, context) {
    var shared = env.shared;
    var CONTEXT = shared.context;

    var contextEnter = env.scope();

    Object.keys(context).forEach(function (name) {
      scope.save(CONTEXT, '.' + name);
      var defn = context[name];
      contextEnter(CONTEXT, '.', name, '=', defn.append(env, scope), ';');
    });

    scope(contextEnter);
  }

  // ===================================================
  // ===================================================
  // COMMON DRAWING FUNCTIONS
  // ===================================================
  // ===================================================
  function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
    var shared = env.shared;

    var GL = shared.gl;
    var FRAMEBUFFER_STATE = shared.framebuffer;
    var EXT_DRAW_BUFFERS;
    if (extDrawBuffers) {
      EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
    }

    var constants = env.constants;

    var DRAW_BUFFERS = constants.drawBuffer;
    var BACK_BUFFER = constants.backBuffer;

    var NEXT;
    if (framebuffer) {
      NEXT = framebuffer.append(env, scope);
    } else {
      NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
    }

    if (!skipCheck) {
      scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
    }
    scope(
      'if(', NEXT, '){',
      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
    if (extDrawBuffers) {
      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
        DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
    }
    scope('}else{',
      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
    if (extDrawBuffers) {
      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
    }
    scope(
      '}',
      FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
    if (!skipCheck) {
      scope('}');
    }
  }

  function emitPollState (env, scope, args) {
    var shared = env.shared;

    var GL = shared.gl;

    var CURRENT_VARS = env.current;
    var NEXT_VARS = env.next;
    var CURRENT_STATE = shared.current;
    var NEXT_STATE = shared.next;

    var block = env.cond(CURRENT_STATE, '.dirty');

    GL_STATE_NAMES.forEach(function (prop) {
      var param = propName(prop);
      if (param in args.state) {
        return
      }

      var NEXT, CURRENT;
      if (param in NEXT_VARS) {
        NEXT = NEXT_VARS[param];
        CURRENT = CURRENT_VARS[param];
        var parts = loop(currentState[param].length, function (i) {
          return block.def(NEXT, '[', i, ']')
        });
        block(env.cond(parts.map(function (p, i) {
          return p + '!==' + CURRENT + '[' + i + ']'
        }).join('||'))
          .then(
            GL, '.', GL_VARIABLES[param], '(', parts, ');',
            parts.map(function (p, i) {
              return CURRENT + '[' + i + ']=' + p
            }).join(';'), ';'));
      } else {
        NEXT = block.def(NEXT_STATE, '.', param);
        var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
        block(ifte);
        if (param in GL_FLAGS) {
          ifte(
            env.cond(NEXT)
                .then(GL, '.enable(', GL_FLAGS[param], ');')
                .else(GL, '.disable(', GL_FLAGS[param], ');'),
            CURRENT_STATE, '.', param, '=', NEXT, ';');
        } else {
          ifte(
            GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
            CURRENT_STATE, '.', param, '=', NEXT, ';');
        }
      }
    });
    if (Object.keys(args.state).length === 0) {
      block(CURRENT_STATE, '.dirty=false;');
    }
    scope(block);
  }

  function emitSetOptions (env, scope, options, filter) {
    var shared = env.shared;
    var CURRENT_VARS = env.current;
    var CURRENT_STATE = shared.current;
    var GL = shared.gl;
    sortState(Object.keys(options)).forEach(function (param) {
      var defn = options[param];
      if (filter && !filter(defn)) {
        return
      }
      var variable = defn.append(env, scope);
      if (GL_FLAGS[param]) {
        var flag = GL_FLAGS[param];
        if (isStatic(defn)) {
          if (variable) {
            scope(GL, '.enable(', flag, ');');
          } else {
            scope(GL, '.disable(', flag, ');');
          }
        } else {
          scope(env.cond(variable)
            .then(GL, '.enable(', flag, ');')
            .else(GL, '.disable(', flag, ');'));
        }
        scope(CURRENT_STATE, '.', param, '=', variable, ';');
      } else if (isArrayLike(variable)) {
        var CURRENT = CURRENT_VARS[param];
        scope(
          GL, '.', GL_VARIABLES[param], '(', variable, ');',
          variable.map(function (v, i) {
            return CURRENT + '[' + i + ']=' + v
          }).join(';'), ';');
      } else {
        scope(
          GL, '.', GL_VARIABLES[param], '(', variable, ');',
          CURRENT_STATE, '.', param, '=', variable, ';');
      }
    });
  }

  function injectExtensions (env, scope) {
    if (extInstancing) {
      env.instancing = scope.def(
        env.shared.extensions, '.angle_instanced_arrays');
    }
  }

  function emitProfile (env, scope, args, useScope, incrementCounter) {
    var shared = env.shared;
    var STATS = env.stats;
    var CURRENT_STATE = shared.current;
    var TIMER = shared.timer;
    var profileArg = args.profile;

    function perfCounter () {
      if (typeof performance === 'undefined') {
        return 'Date.now()'
      } else {
        return 'performance.now()'
      }
    }

    var CPU_START, QUERY_COUNTER;
    function emitProfileStart (block) {
      CPU_START = scope.def();
      block(CPU_START, '=', perfCounter(), ';');
      if (typeof incrementCounter === 'string') {
        block(STATS, '.count+=', incrementCounter, ';');
      } else {
        block(STATS, '.count++;');
      }
      if (timer) {
        if (useScope) {
          QUERY_COUNTER = scope.def();
          block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
        } else {
          block(TIMER, '.beginQuery(', STATS, ');');
        }
      }
    }

    function emitProfileEnd (block) {
      block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
      if (timer) {
        if (useScope) {
          block(TIMER, '.pushScopeStats(',
            QUERY_COUNTER, ',',
            TIMER, '.getNumPendingQueries(),',
            STATS, ');');
        } else {
          block(TIMER, '.endQuery();');
        }
      }
    }

    function scopeProfile (value) {
      var prev = scope.def(CURRENT_STATE, '.profile');
      scope(CURRENT_STATE, '.profile=', value, ';');
      scope.exit(CURRENT_STATE, '.profile=', prev, ';');
    }

    var USE_PROFILE;
    if (profileArg) {
      if (isStatic(profileArg)) {
        if (profileArg.enable) {
          emitProfileStart(scope);
          emitProfileEnd(scope.exit);
          scopeProfile('true');
        } else {
          scopeProfile('false');
        }
        return
      }
      USE_PROFILE = profileArg.append(env, scope);
      scopeProfile(USE_PROFILE);
    } else {
      USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
    }

    var start = env.block();
    emitProfileStart(start);
    scope('if(', USE_PROFILE, '){', start, '}');
    var end = env.block();
    emitProfileEnd(end);
    scope.exit('if(', USE_PROFILE, '){', end, '}');
  }

  function emitAttributes (env, scope, args, attributes, filter) {
    var shared = env.shared;

    function typeLength (x) {
      switch (x) {
        case GL_FLOAT_VEC2:
        case GL_INT_VEC2:
        case GL_BOOL_VEC2:
          return 2
        case GL_FLOAT_VEC3:
        case GL_INT_VEC3:
        case GL_BOOL_VEC3:
          return 3
        case GL_FLOAT_VEC4:
        case GL_INT_VEC4:
        case GL_BOOL_VEC4:
          return 4
        default:
          return 1
      }
    }

    function emitBindAttribute (ATTRIBUTE, size, record) {
      var GL = shared.gl;

      var LOCATION = scope.def(ATTRIBUTE, '.location');
      var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

      var STATE = record.state;
      var BUFFER = record.buffer;
      var CONST_COMPONENTS = [
        record.x,
        record.y,
        record.z,
        record.w
      ];

      var COMMON_KEYS = [
        'buffer',
        'normalized',
        'offset',
        'stride'
      ];

      function emitBuffer () {
        scope(
          'if(!', BINDING, '.buffer){',
          GL, '.enableVertexAttribArray(', LOCATION, ');}');

        var TYPE = record.type;
        var SIZE;
        if (!record.size) {
          SIZE = size;
        } else {
          SIZE = scope.def(record.size, '||', size);
        }

        scope('if(',
          BINDING, '.type!==', TYPE, '||',
          BINDING, '.size!==', SIZE, '||',
          COMMON_KEYS.map(function (key) {
            return BINDING + '.' + key + '!==' + record[key]
          }).join('||'),
          '){',
          GL, '.bindBuffer(', GL_ARRAY_BUFFER$1, ',', BUFFER, '.buffer);',
          GL, '.vertexAttribPointer(', [
            LOCATION,
            SIZE,
            TYPE,
            record.normalized,
            record.stride,
            record.offset
          ], ');',
          BINDING, '.type=', TYPE, ';',
          BINDING, '.size=', SIZE, ';',
          COMMON_KEYS.map(function (key) {
            return BINDING + '.' + key + '=' + record[key] + ';'
          }).join(''),
          '}');

        if (extInstancing) {
          var DIVISOR = record.divisor;
          scope(
            'if(', BINDING, '.divisor!==', DIVISOR, '){',
            env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
            BINDING, '.divisor=', DIVISOR, ';}');
        }
      }

      function emitConstant () {
        scope(
          'if(', BINDING, '.buffer){',
          GL, '.disableVertexAttribArray(', LOCATION, ');',
          '}if(', CUTE_COMPONENTS.map(function (c, i) {
            return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
          }).join('||'), '){',
          GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
          CUTE_COMPONENTS.map(function (c, i) {
            return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
          }).join(''),
          '}');
      }

      if (STATE === ATTRIB_STATE_POINTER) {
        emitBuffer();
      } else if (STATE === ATTRIB_STATE_CONSTANT) {
        emitConstant();
      } else {
        scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
        emitBuffer();
        scope('}else{');
        emitConstant();
        scope('}');
      }
    }

    attributes.forEach(function (attribute) {
      var name = attribute.name;
      var arg = args.attributes[name];
      var record;
      if (arg) {
        if (!filter(arg)) {
          return
        }
        record = arg.append(env, scope);
      } else {
        if (!filter(SCOPE_DECL)) {
          return
        }
        var scopeAttrib = env.scopeAttrib(name);
        check$1.optional(function () {
          env.assert(scope,
            scopeAttrib + '.state',
            'missing attribute ' + name);
        });
        record = {};
        Object.keys(new AttributeRecord()).forEach(function (key) {
          record[key] = scope.def(scopeAttrib, '.', key);
        });
      }
      emitBindAttribute(
        env.link(attribute), typeLength(attribute.info.type), record);
    });
  }

  function emitUniforms (env, scope, args, uniforms, filter) {
    var shared = env.shared;
    var GL = shared.gl;

    var infix;
    for (var i = 0; i < uniforms.length; ++i) {
      var uniform = uniforms[i];
      var name = uniform.name;
      var type = uniform.info.type;
      var arg = args.uniforms[name];
      var UNIFORM = env.link(uniform);
      var LOCATION = UNIFORM + '.location';

      var VALUE;
      if (arg) {
        if (!filter(arg)) {
          continue
        }
        if (isStatic(arg)) {
          var value = arg.value;
          check$1.command(
            value !== null && typeof value !== 'undefined',
            'missing uniform "' + name + '"', env.commandStr);
          if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
            check$1.command(
              typeof value === 'function' &&
              ((type === GL_SAMPLER_2D &&
                (value._reglType === 'texture2d' ||
                value._reglType === 'framebuffer')) ||
              (type === GL_SAMPLER_CUBE &&
                (value._reglType === 'textureCube' ||
                value._reglType === 'framebufferCube'))),
              'invalid texture for uniform ' + name, env.commandStr);
            var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
            scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
            scope.exit(TEX_VALUE, '.unbind();');
          } else if (
            type === GL_FLOAT_MAT2 ||
            type === GL_FLOAT_MAT3 ||
            type === GL_FLOAT_MAT4) {
            check$1.optional(function () {
              check$1.command(isArrayLike(value),
                'invalid matrix for uniform ' + name, env.commandStr);
              check$1.command(
                (type === GL_FLOAT_MAT2 && value.length === 4) ||
                (type === GL_FLOAT_MAT3 && value.length === 9) ||
                (type === GL_FLOAT_MAT4 && value.length === 16),
                'invalid length for matrix uniform ' + name, env.commandStr);
            });
            var MAT_VALUE = env.global.def('new Float32Array([' +
              Array.prototype.slice.call(value) + '])');
            var dim = 2;
            if (type === GL_FLOAT_MAT3) {
              dim = 3;
            } else if (type === GL_FLOAT_MAT4) {
              dim = 4;
            }
            scope(
              GL, '.uniformMatrix', dim, 'fv(',
              LOCATION, ',false,', MAT_VALUE, ');');
          } else {
            switch (type) {
              case GL_FLOAT$8:
                check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                infix = '1f';
                break
              case GL_FLOAT_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2f';
                break
              case GL_FLOAT_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3f';
                break
              case GL_FLOAT_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4f';
                break
              case GL_BOOL:
                check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                infix = '1i';
                break
              case GL_INT$3:
                check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                infix = '1i';
                break
              case GL_BOOL_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2i';
                break
              case GL_INT_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2i';
                break
              case GL_BOOL_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3i';
                break
              case GL_INT_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3i';
                break
              case GL_BOOL_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4i';
                break
              case GL_INT_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4i';
                break
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',',
              isArrayLike(value) ? Array.prototype.slice.call(value) : value,
              ');');
          }
          continue
        } else {
          VALUE = arg.append(env, scope);
        }
      } else {
        if (!filter(SCOPE_DECL)) {
          continue
        }
        VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
      }

      if (type === GL_SAMPLER_2D) {
        scope(
          'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
          VALUE, '=', VALUE, '.color[0];',
          '}');
      } else if (type === GL_SAMPLER_CUBE) {
        scope(
          'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
          VALUE, '=', VALUE, '.color[0];',
          '}');
      }

      // perform type validation
      check$1.optional(function () {
        function check (pred, message) {
          env.assert(scope, pred,
            'bad data or missing for uniform "' + name + '".  ' + message);
        }

        function checkType (type) {
          check(
            'typeof ' + VALUE + '==="' + type + '"',
            'invalid type, expected ' + type);
        }

        function checkVector (n, type) {
          check(
            shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length===' + n,
            'invalid vector, should have length ' + n, env.commandStr);
        }

        function checkTexture (target) {
          check(
            'typeof ' + VALUE + '==="function"&&' +
            VALUE + '._reglType==="texture' +
            (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"',
            'invalid texture type', env.commandStr);
        }

        switch (type) {
          case GL_INT$3:
            checkType('number');
            break
          case GL_INT_VEC2:
            checkVector(2, 'number');
            break
          case GL_INT_VEC3:
            checkVector(3, 'number');
            break
          case GL_INT_VEC4:
            checkVector(4, 'number');
            break
          case GL_FLOAT$8:
            checkType('number');
            break
          case GL_FLOAT_VEC2:
            checkVector(2, 'number');
            break
          case GL_FLOAT_VEC3:
            checkVector(3, 'number');
            break
          case GL_FLOAT_VEC4:
            checkVector(4, 'number');
            break
          case GL_BOOL:
            checkType('boolean');
            break
          case GL_BOOL_VEC2:
            checkVector(2, 'boolean');
            break
          case GL_BOOL_VEC3:
            checkVector(3, 'boolean');
            break
          case GL_BOOL_VEC4:
            checkVector(4, 'boolean');
            break
          case GL_FLOAT_MAT2:
            checkVector(4, 'number');
            break
          case GL_FLOAT_MAT3:
            checkVector(9, 'number');
            break
          case GL_FLOAT_MAT4:
            checkVector(16, 'number');
            break
          case GL_SAMPLER_2D:
            checkTexture(GL_TEXTURE_2D$3);
            break
          case GL_SAMPLER_CUBE:
            checkTexture(GL_TEXTURE_CUBE_MAP$2);
            break
        }
      });

      var unroll = 1;
      switch (type) {
        case GL_SAMPLER_2D:
        case GL_SAMPLER_CUBE:
          var TEX = scope.def(VALUE, '._texture');
          scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
          scope.exit(TEX, '.unbind();');
          continue

        case GL_INT$3:
        case GL_BOOL:
          infix = '1i';
          break

        case GL_INT_VEC2:
        case GL_BOOL_VEC2:
          infix = '2i';
          unroll = 2;
          break

        case GL_INT_VEC3:
        case GL_BOOL_VEC3:
          infix = '3i';
          unroll = 3;
          break

        case GL_INT_VEC4:
        case GL_BOOL_VEC4:
          infix = '4i';
          unroll = 4;
          break

        case GL_FLOAT$8:
          infix = '1f';
          break

        case GL_FLOAT_VEC2:
          infix = '2f';
          unroll = 2;
          break

        case GL_FLOAT_VEC3:
          infix = '3f';
          unroll = 3;
          break

        case GL_FLOAT_VEC4:
          infix = '4f';
          unroll = 4;
          break

        case GL_FLOAT_MAT2:
          infix = 'Matrix2fv';
          break

        case GL_FLOAT_MAT3:
          infix = 'Matrix3fv';
          break

        case GL_FLOAT_MAT4:
          infix = 'Matrix4fv';
          break
      }

      scope(GL, '.uniform', infix, '(', LOCATION, ',');
      if (infix.charAt(0) === 'M') {
        var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
        var STORAGE = env.global.def('new Float32Array(', matSize, ')');
        scope(
          'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
          loop(matSize, function (i) {
            return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
          }), ',', STORAGE, ')');
      } else if (unroll > 1) {
        scope(loop(unroll, function (i) {
          return VALUE + '[' + i + ']'
        }));
      } else {
        scope(VALUE);
      }
      scope(');');
    }
  }

  function emitDraw (env, outer, inner, args) {
    var shared = env.shared;
    var GL = shared.gl;
    var DRAW_STATE = shared.draw;

    var drawOptions = args.draw;

    function emitElements () {
      var defn = drawOptions.elements;
      var ELEMENTS;
      var scope = outer;
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          scope = inner;
        }
        ELEMENTS = defn.append(env, scope);
      } else {
        ELEMENTS = scope.def(DRAW_STATE, '.', S_ELEMENTS);
      }
      if (ELEMENTS) {
        scope(
          'if(' + ELEMENTS + ')' +
          GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$1 + ',' + ELEMENTS + '.buffer.buffer);');
      }
      return ELEMENTS
    }

    function emitCount () {
      var defn = drawOptions.count;
      var COUNT;
      var scope = outer;
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          scope = inner;
        }
        COUNT = defn.append(env, scope);
        check$1.optional(function () {
          if (defn.MISSING) {
            env.assert(outer, 'false', 'missing vertex count');
          }
          if (defn.DYNAMIC) {
            env.assert(scope, COUNT + '>=0', 'missing vertex count');
          }
        });
      } else {
        COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
        check$1.optional(function () {
          env.assert(scope, COUNT + '>=0', 'missing vertex count');
        });
      }
      return COUNT
    }

    var ELEMENTS = emitElements();
    function emitValue (name) {
      var defn = drawOptions[name];
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          return defn.append(env, inner)
        } else {
          return defn.append(env, outer)
        }
      } else {
        return outer.def(DRAW_STATE, '.', name)
      }
    }

    var PRIMITIVE = emitValue(S_PRIMITIVE);
    var OFFSET = emitValue(S_OFFSET);

    var COUNT = emitCount();
    if (typeof COUNT === 'number') {
      if (COUNT === 0) {
        return
      }
    } else {
      inner('if(', COUNT, '){');
      inner.exit('}');
    }

    var INSTANCES, EXT_INSTANCING;
    if (extInstancing) {
      INSTANCES = emitValue(S_INSTANCES);
      EXT_INSTANCING = env.instancing;
    }

    var ELEMENT_TYPE = ELEMENTS + '.type';

    var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements);

    function emitInstancing () {
      function drawElements () {
        inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
          PRIMITIVE,
          COUNT,
          ELEMENT_TYPE,
          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
          INSTANCES
        ], ');');
      }

      function drawArrays () {
        inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
          [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
      }

      if (ELEMENTS) {
        if (!elementsStatic) {
          inner('if(', ELEMENTS, '){');
          drawElements();
          inner('}else{');
          drawArrays();
          inner('}');
        } else {
          drawElements();
        }
      } else {
        drawArrays();
      }
    }

    function emitRegular () {
      function drawElements () {
        inner(GL + '.drawElements(' + [
          PRIMITIVE,
          COUNT,
          ELEMENT_TYPE,
          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
        ] + ');');
      }

      function drawArrays () {
        inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
      }

      if (ELEMENTS) {
        if (!elementsStatic) {
          inner('if(', ELEMENTS, '){');
          drawElements();
          inner('}else{');
          drawArrays();
          inner('}');
        } else {
          drawElements();
        }
      } else {
        drawArrays();
      }
    }

    if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
      if (typeof INSTANCES === 'string') {
        inner('if(', INSTANCES, '>0){');
        emitInstancing();
        inner('}else if(', INSTANCES, '<0){');
        emitRegular();
        inner('}');
      } else {
        emitInstancing();
      }
    } else {
      emitRegular();
    }
  }

  function createBody (emitBody, parentEnv, args, program, count) {
    var env = createREGLEnvironment();
    var scope = env.proc('body', count);
    check$1.optional(function () {
      env.commandStr = parentEnv.commandStr;
      env.command = env.link(parentEnv.commandStr);
    });
    if (extInstancing) {
      env.instancing = scope.def(
        env.shared.extensions, '.angle_instanced_arrays');
    }
    emitBody(env, scope, args, program);
    return env.compile().body
  }

  // ===================================================
  // ===================================================
  // DRAW PROC
  // ===================================================
  // ===================================================
  function emitDrawBody (env, draw, args, program) {
    injectExtensions(env, draw);
    emitAttributes(env, draw, args, program.attributes, function () {
      return true
    });
    emitUniforms(env, draw, args, program.uniforms, function () {
      return true
    });
    emitDraw(env, draw, draw, args);
  }

  function emitDrawProc (env, args) {
    var draw = env.proc('draw', 1);

    injectExtensions(env, draw);

    emitContext(env, draw, args.context);
    emitPollFramebuffer(env, draw, args.framebuffer);

    emitPollState(env, draw, args);
    emitSetOptions(env, draw, args.state);

    emitProfile(env, draw, args, false, true);

    var program = args.shader.progVar.append(env, draw);
    draw(env.shared.gl, '.useProgram(', program, '.program);');

    if (args.shader.program) {
      emitDrawBody(env, draw, args, args.shader.program);
    } else {
      var drawCache = env.global.def('{}');
      var PROG_ID = draw.def(program, '.id');
      var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
      draw(
        env.cond(CACHED_PROC)
          .then(CACHED_PROC, '.call(this,a0);')
          .else(
            CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
            env.link(function (program) {
              return createBody(emitDrawBody, env, args, program, 1)
            }), '(', program, ');',
            CACHED_PROC, '.call(this,a0);'));
    }

    if (Object.keys(args.state).length > 0) {
      draw(env.shared.current, '.dirty=true;');
    }
  }

  // ===================================================
  // ===================================================
  // BATCH PROC
  // ===================================================
  // ===================================================

  function emitBatchDynamicShaderBody (env, scope, args, program) {
    env.batchId = 'a1';

    injectExtensions(env, scope);

    function all () {
      return true
    }

    emitAttributes(env, scope, args, program.attributes, all);
    emitUniforms(env, scope, args, program.uniforms, all);
    emitDraw(env, scope, scope, args);
  }

  function emitBatchBody (env, scope, args, program) {
    injectExtensions(env, scope);

    var contextDynamic = args.contextDep;

    var BATCH_ID = scope.def();
    var PROP_LIST = 'a0';
    var NUM_PROPS = 'a1';
    var PROPS = scope.def();
    env.shared.props = PROPS;
    env.batchId = BATCH_ID;

    var outer = env.scope();
    var inner = env.scope();

    scope(
      outer.entry,
      'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
      PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
      inner,
      '}',
      outer.exit);

    function isInnerDefn (defn) {
      return ((defn.contextDep && contextDynamic) || defn.propDep)
    }

    function isOuterDefn (defn) {
      return !isInnerDefn(defn)
    }

    if (args.needsContext) {
      emitContext(env, inner, args.context);
    }
    if (args.needsFramebuffer) {
      emitPollFramebuffer(env, inner, args.framebuffer);
    }
    emitSetOptions(env, inner, args.state, isInnerDefn);

    if (args.profile && isInnerDefn(args.profile)) {
      emitProfile(env, inner, args, false, true);
    }

    if (!program) {
      var progCache = env.global.def('{}');
      var PROGRAM = args.shader.progVar.append(env, inner);
      var PROG_ID = inner.def(PROGRAM, '.id');
      var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
      inner(
        env.shared.gl, '.useProgram(', PROGRAM, '.program);',
        'if(!', CACHED_PROC, '){',
        CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
        env.link(function (program) {
          return createBody(
            emitBatchDynamicShaderBody, env, args, program, 2)
        }), '(', PROGRAM, ');}',
        CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
    } else {
      emitAttributes(env, outer, args, program.attributes, isOuterDefn);
      emitAttributes(env, inner, args, program.attributes, isInnerDefn);
      emitUniforms(env, outer, args, program.uniforms, isOuterDefn);
      emitUniforms(env, inner, args, program.uniforms, isInnerDefn);
      emitDraw(env, outer, inner, args);
    }
  }

  function emitBatchProc (env, args) {
    var batch = env.proc('batch', 2);
    env.batchId = '0';

    injectExtensions(env, batch);

    // Check if any context variables depend on props
    var contextDynamic = false;
    var needsContext = true;
    Object.keys(args.context).forEach(function (name) {
      contextDynamic = contextDynamic || args.context[name].propDep;
    });
    if (!contextDynamic) {
      emitContext(env, batch, args.context);
      needsContext = false;
    }

    // framebuffer state affects framebufferWidth/height context vars
    var framebuffer = args.framebuffer;
    var needsFramebuffer = false;
    if (framebuffer) {
      if (framebuffer.propDep) {
        contextDynamic = needsFramebuffer = true;
      } else if (framebuffer.contextDep && contextDynamic) {
        needsFramebuffer = true;
      }
      if (!needsFramebuffer) {
        emitPollFramebuffer(env, batch, framebuffer);
      }
    } else {
      emitPollFramebuffer(env, batch, null);
    }

    // viewport is weird because it can affect context vars
    if (args.state.viewport && args.state.viewport.propDep) {
      contextDynamic = true;
    }

    function isInnerDefn (defn) {
      return (defn.contextDep && contextDynamic) || defn.propDep
    }

    // set webgl options
    emitPollState(env, batch, args);
    emitSetOptions(env, batch, args.state, function (defn) {
      return !isInnerDefn(defn)
    });

    if (!args.profile || !isInnerDefn(args.profile)) {
      emitProfile(env, batch, args, false, 'a1');
    }

    // Save these values to args so that the batch body routine can use them
    args.contextDep = contextDynamic;
    args.needsContext = needsContext;
    args.needsFramebuffer = needsFramebuffer;

    // determine if shader is dynamic
    var progDefn = args.shader.progVar;
    if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
      emitBatchBody(
        env,
        batch,
        args,
        null);
    } else {
      var PROGRAM = progDefn.append(env, batch);
      batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
      if (args.shader.program) {
        emitBatchBody(
          env,
          batch,
          args,
          args.shader.program);
      } else {
        var batchCache = env.global.def('{}');
        var PROG_ID = batch.def(PROGRAM, '.id');
        var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
        batch(
          env.cond(CACHED_PROC)
            .then(CACHED_PROC, '.call(this,a0,a1);')
            .else(
              CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
              env.link(function (program) {
                return createBody(emitBatchBody, env, args, program, 2)
              }), '(', PROGRAM, ');',
              CACHED_PROC, '.call(this,a0,a1);'));
      }
    }

    if (Object.keys(args.state).length > 0) {
      batch(env.shared.current, '.dirty=true;');
    }
  }

  // ===================================================
  // ===================================================
  // SCOPE COMMAND
  // ===================================================
  // ===================================================
  function emitScopeProc (env, args) {
    var scope = env.proc('scope', 3);
    env.batchId = 'a2';

    var shared = env.shared;
    var CURRENT_STATE = shared.current;

    emitContext(env, scope, args.context);

    if (args.framebuffer) {
      args.framebuffer.append(env, scope);
    }

    sortState(Object.keys(args.state)).forEach(function (name) {
      var defn = args.state[name];
      var value = defn.append(env, scope);
      if (isArrayLike(value)) {
        value.forEach(function (v, i) {
          scope.set(env.next[name], '[' + i + ']', v);
        });
      } else {
        scope.set(shared.next, '.' + name, value);
      }
    });

    emitProfile(env, scope, args, true, true)

    ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
      function (opt) {
        var variable = args.draw[opt];
        if (!variable) {
          return
        }
        scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
      });

    Object.keys(args.uniforms).forEach(function (opt) {
      scope.set(
        shared.uniforms,
        '[' + stringStore.id(opt) + ']',
        args.uniforms[opt].append(env, scope));
    });

    Object.keys(args.attributes).forEach(function (name) {
      var record = args.attributes[name].append(env, scope);
      var scopeAttrib = env.scopeAttrib(name);
      Object.keys(new AttributeRecord()).forEach(function (prop) {
        scope.set(scopeAttrib, '.' + prop, record[prop]);
      });
    });

    function saveShader (name) {
      var shader = args.shader[name];
      if (shader) {
        scope.set(shared.shader, '.' + name, shader.append(env, scope));
      }
    }
    saveShader(S_VERT);
    saveShader(S_FRAG);

    if (Object.keys(args.state).length > 0) {
      scope(CURRENT_STATE, '.dirty=true;');
      scope.exit(CURRENT_STATE, '.dirty=true;');
    }

    scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
  }

  function isDynamicObject (object) {
    if (typeof object !== 'object' || isArrayLike(object)) {
      return
    }
    var props = Object.keys(object);
    for (var i = 0; i < props.length; ++i) {
      if (dynamic.isDynamic(object[props[i]])) {
        return true
      }
    }
    return false
  }

  function splatObject (env, options, name) {
    var object = options.static[name];
    if (!object || !isDynamicObject(object)) {
      return
    }

    var globals = env.global;
    var keys = Object.keys(object);
    var thisDep = false;
    var contextDep = false;
    var propDep = false;
    var objectRef = env.global.def('{}');
    keys.forEach(function (key) {
      var value = object[key];
      if (dynamic.isDynamic(value)) {
        if (typeof value === 'function') {
          value = object[key] = dynamic.unbox(value);
        }
        var deps = createDynamicDecl(value, null);
        thisDep = thisDep || deps.thisDep;
        propDep = propDep || deps.propDep;
        contextDep = contextDep || deps.contextDep;
      } else {
        globals(objectRef, '.', key, '=');
        switch (typeof value) {
          case 'number':
            globals(value);
            break
          case 'string':
            globals('"', value, '"');
            break
          case 'object':
            if (Array.isArray(value)) {
              globals('[', value.join(), ']');
            }
            break
          default:
            globals(env.link(value));
            break
        }
        globals(';');
      }
    });

    function appendBlock (env, block) {
      keys.forEach(function (key) {
        var value = object[key];
        if (!dynamic.isDynamic(value)) {
          return
        }
        var ref = env.invoke(block, value);
        block(objectRef, '.', key, '=', ref, ';');
      });
    }

    options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
      thisDep: thisDep,
      contextDep: contextDep,
      propDep: propDep,
      ref: objectRef,
      append: appendBlock
    });
    delete options.static[name];
  }

  // ===========================================================================
  // ===========================================================================
  // MAIN DRAW COMMAND
  // ===========================================================================
  // ===========================================================================
  function compileCommand (options, attributes, uniforms, context, stats) {
    var env = createREGLEnvironment();

    // link stats, so that we can easily access it in the program.
    env.stats = env.link(stats);

    // splat options and attributes to allow for dynamic nested properties
    Object.keys(attributes.static).forEach(function (key) {
      splatObject(env, attributes, key);
    });
    NESTED_OPTIONS.forEach(function (name) {
      splatObject(env, options, name);
    });

    var args = parseArguments(options, attributes, uniforms, context, env);

    emitDrawProc(env, args);
    emitScopeProc(env, args);
    emitBatchProc(env, args);

    return env.compile()
  }

  // ===========================================================================
  // ===========================================================================
  // POLL / REFRESH
  // ===========================================================================
  // ===========================================================================
  return {
    next: nextState,
    current: currentState,
    procs: (function () {
      var env = createREGLEnvironment();
      var poll = env.proc('poll');
      var refresh = env.proc('refresh');
      var common = env.block();
      poll(common);
      refresh(common);

      var shared = env.shared;
      var GL = shared.gl;
      var NEXT_STATE = shared.next;
      var CURRENT_STATE = shared.current;

      common(CURRENT_STATE, '.dirty=false;');

      emitPollFramebuffer(env, poll);
      emitPollFramebuffer(env, refresh, null, true);

      // Refresh updates all attribute state changes
      var INSTANCING;
      if (extInstancing) {
        INSTANCING = env.link(extInstancing);
      }
      for (var i = 0; i < limits.maxAttributes; ++i) {
        var BINDING = refresh.def(shared.attributes, '[', i, ']');
        var ifte = env.cond(BINDING, '.buffer');
        ifte.then(
          GL, '.enableVertexAttribArray(', i, ');',
          GL, '.bindBuffer(',
            GL_ARRAY_BUFFER$1, ',',
            BINDING, '.buffer.buffer);',
          GL, '.vertexAttribPointer(',
            i, ',',
            BINDING, '.size,',
            BINDING, '.type,',
            BINDING, '.normalized,',
            BINDING, '.stride,',
            BINDING, '.offset);'
        ).else(
          GL, '.disableVertexAttribArray(', i, ');',
          GL, '.vertexAttrib4f(',
            i, ',',
            BINDING, '.x,',
            BINDING, '.y,',
            BINDING, '.z,',
            BINDING, '.w);',
          BINDING, '.buffer=null;');
        refresh(ifte);
        if (extInstancing) {
          refresh(
            INSTANCING, '.vertexAttribDivisorANGLE(',
            i, ',',
            BINDING, '.divisor);');
        }
      }

      Object.keys(GL_FLAGS).forEach(function (flag) {
        var cap = GL_FLAGS[flag];
        var NEXT = common.def(NEXT_STATE, '.', flag);
        var block = env.block();
        block('if(', NEXT, '){',
          GL, '.enable(', cap, ')}else{',
          GL, '.disable(', cap, ')}',
          CURRENT_STATE, '.', flag, '=', NEXT, ';');
        refresh(block);
        poll(
          'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
          block,
          '}');
      });

      Object.keys(GL_VARIABLES).forEach(function (name) {
        var func = GL_VARIABLES[name];
        var init = currentState[name];
        var NEXT, CURRENT;
        var block = env.block();
        block(GL, '.', func, '(');
        if (isArrayLike(init)) {
          var n = init.length;
          NEXT = env.global.def(NEXT_STATE, '.', name);
          CURRENT = env.global.def(CURRENT_STATE, '.', name);
          block(
            loop(n, function (i) {
              return NEXT + '[' + i + ']'
            }), ');',
            loop(n, function (i) {
              return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
            }).join(''));
          poll(
            'if(', loop(n, function (i) {
              return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
            }).join('||'), '){',
            block,
            '}');
        } else {
          NEXT = common.def(NEXT_STATE, '.', name);
          CURRENT = common.def(CURRENT_STATE, '.', name);
          block(
            NEXT, ');',
            CURRENT_STATE, '.', name, '=', NEXT, ';');
          poll(
            'if(', NEXT, '!==', CURRENT, '){',
            block,
            '}');
        }
        refresh(block);
      });

      return env.compile()
    })(),
    compile: compileCommand
  }
}

function stats () {
  return {
    bufferCount: 0,
    elementsCount: 0,
    framebufferCount: 0,
    shaderCount: 0,
    textureCount: 0,
    cubeCount: 0,
    renderbufferCount: 0,
    maxTextureUnits: 0
  }
}

var GL_QUERY_RESULT_EXT = 0x8866;
var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
var GL_TIME_ELAPSED_EXT = 0x88BF;

var createTimer = function (gl, extensions) {
  if (!extensions.ext_disjoint_timer_query) {
    return null
  }

  // QUERY POOL BEGIN
  var queryPool = [];
  function allocQuery () {
    return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT()
  }
  function freeQuery (query) {
    queryPool.push(query);
  }
  // QUERY POOL END

  var pendingQueries = [];
  function beginQuery (stats) {
    var query = allocQuery();
    extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
    pendingQueries.push(query);
    pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
  }

  function endQuery () {
    extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
  }

  //
  // Pending stats pool.
  //
  function PendingStats () {
    this.startQueryIndex = -1;
    this.endQueryIndex = -1;
    this.sum = 0;
    this.stats = null;
  }
  var pendingStatsPool = [];
  function allocPendingStats () {
    return pendingStatsPool.pop() || new PendingStats()
  }
  function freePendingStats (pendingStats) {
    pendingStatsPool.push(pendingStats);
  }
  // Pending stats pool end

  var pendingStats = [];
  function pushScopeStats (start, end, stats) {
    var ps = allocPendingStats();
    ps.startQueryIndex = start;
    ps.endQueryIndex = end;
    ps.sum = 0;
    ps.stats = stats;
    pendingStats.push(ps);
  }

  // we should call this at the beginning of the frame,
  // in order to update gpuTime
  var timeSum = [];
  var queryPtr = [];
  function update () {
    var ptr, i;

    var n = pendingQueries.length;
    if (n === 0) {
      return
    }

    // Reserve space
    queryPtr.length = Math.max(queryPtr.length, n + 1);
    timeSum.length = Math.max(timeSum.length, n + 1);
    timeSum[0] = 0;
    queryPtr[0] = 0;

    // Update all pending timer queries
    var queryTime = 0;
    ptr = 0;
    for (i = 0; i < pendingQueries.length; ++i) {
      var query = pendingQueries[i];
      if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
        queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
        freeQuery(query);
      } else {
        pendingQueries[ptr++] = query;
      }
      timeSum[i + 1] = queryTime;
      queryPtr[i + 1] = ptr;
    }
    pendingQueries.length = ptr;

    // Update all pending stat queries
    ptr = 0;
    for (i = 0; i < pendingStats.length; ++i) {
      var stats = pendingStats[i];
      var start = stats.startQueryIndex;
      var end = stats.endQueryIndex;
      stats.sum += timeSum[end] - timeSum[start];
      var startPtr = queryPtr[start];
      var endPtr = queryPtr[end];
      if (endPtr === startPtr) {
        stats.stats.gpuTime += stats.sum / 1e6;
        freePendingStats(stats);
      } else {
        stats.startQueryIndex = startPtr;
        stats.endQueryIndex = endPtr;
        pendingStats[ptr++] = stats;
      }
    }
    pendingStats.length = ptr;
  }

  return {
    beginQuery: beginQuery,
    endQuery: endQuery,
    pushScopeStats: pushScopeStats,
    update: update,
    getNumPendingQueries: function () {
      return pendingQueries.length
    },
    clear: function () {
      queryPool.push.apply(queryPool, pendingQueries);
      for (var i = 0; i < queryPool.length; i++) {
        extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
      }
      pendingQueries.length = 0;
      queryPool.length = 0;
    },
    restore: function () {
      pendingQueries.length = 0;
      queryPool.length = 0;
    }
  }
};

var GL_COLOR_BUFFER_BIT = 16384;
var GL_DEPTH_BUFFER_BIT = 256;
var GL_STENCIL_BUFFER_BIT = 1024;

var GL_ARRAY_BUFFER = 34962;

var CONTEXT_LOST_EVENT = 'webglcontextlost';
var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

var DYN_PROP = 1;
var DYN_CONTEXT = 2;
var DYN_STATE = 3;

function find (haystack, needle) {
  for (var i = 0; i < haystack.length; ++i) {
    if (haystack[i] === needle) {
      return i
    }
  }
  return -1
}

function wrapREGL (args) {
  var config = parseArgs(args);
  if (!config) {
    return null
  }

  var gl = config.gl;
  var glAttributes = gl.getContextAttributes();
  var contextLost = gl.isContextLost();

  var extensionState = createExtensionCache(gl, config);
  if (!extensionState) {
    return null
  }

  var stringStore = createStringStore();
  var stats$$1 = stats();
  var extensions = extensionState.extensions;
  var timer = createTimer(gl, extensions);

  var START_TIME = clock();
  var WIDTH = gl.drawingBufferWidth;
  var HEIGHT = gl.drawingBufferHeight;

  var contextState = {
    tick: 0,
    time: 0,
    viewportWidth: WIDTH,
    viewportHeight: HEIGHT,
    framebufferWidth: WIDTH,
    framebufferHeight: HEIGHT,
    drawingBufferWidth: WIDTH,
    drawingBufferHeight: HEIGHT,
    pixelRatio: config.pixelRatio
  };
  var uniformState = {};
  var drawState = {
    elements: null,
    primitive: 4, // GL_TRIANGLES
    count: -1,
    offset: 0,
    instances: -1
  };

  var limits = wrapLimits(gl, extensions);
  var attributeState = wrapAttributeState(
    gl,
    extensions,
    limits,
    stringStore);
  var bufferState = wrapBufferState(
    gl,
    stats$$1,
    config,
    attributeState);
  var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
  var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
  var textureState = createTextureSet(
    gl,
    extensions,
    limits,
    function () { core.procs.poll(); },
    contextState,
    stats$$1,
    config);
  var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
  var framebufferState = wrapFBOState(
    gl,
    extensions,
    limits,
    textureState,
    renderbufferState,
    stats$$1);
  var core = reglCore(
    gl,
    stringStore,
    extensions,
    limits,
    bufferState,
    elementState,
    textureState,
    framebufferState,
    uniformState,
    attributeState,
    shaderState,
    drawState,
    contextState,
    timer,
    config);
  var readPixels = wrapReadPixels(
    gl,
    framebufferState,
    core.procs.poll,
    contextState,
    glAttributes, extensions, limits);

  var nextState = core.next;
  var canvas = gl.canvas;

  var rafCallbacks = [];
  var lossCallbacks = [];
  var restoreCallbacks = [];
  var destroyCallbacks = [config.onDestroy];

  var activeRAF = null;
  function handleRAF () {
    if (rafCallbacks.length === 0) {
      if (timer) {
        timer.update();
      }
      activeRAF = null;
      return
    }

    // schedule next animation frame
    activeRAF = raf.next(handleRAF);

    // poll for changes
    poll();

    // fire a callback for all pending rafs
    for (var i = rafCallbacks.length - 1; i >= 0; --i) {
      var cb = rafCallbacks[i];
      if (cb) {
        cb(contextState, null, 0);
      }
    }

    // flush all pending webgl calls
    gl.flush();

    // poll GPU timers *after* gl.flush so we don't delay command dispatch
    if (timer) {
      timer.update();
    }
  }

  function startRAF () {
    if (!activeRAF && rafCallbacks.length > 0) {
      activeRAF = raf.next(handleRAF);
    }
  }

  function stopRAF () {
    if (activeRAF) {
      raf.cancel(handleRAF);
      activeRAF = null;
    }
  }

  function handleContextLoss (event) {
    event.preventDefault();

    // set context lost flag
    contextLost = true;

    // pause request animation frame
    stopRAF();

    // lose context
    lossCallbacks.forEach(function (cb) {
      cb();
    });
  }

  function handleContextRestored (event) {
    // clear error code
    gl.getError();

    // clear context lost flag
    contextLost = false;

    // refresh state
    extensionState.restore();
    shaderState.restore();
    bufferState.restore();
    textureState.restore();
    renderbufferState.restore();
    framebufferState.restore();
    if (timer) {
      timer.restore();
    }

    // refresh state
    core.procs.refresh();

    // restart RAF
    startRAF();

    // restore context
    restoreCallbacks.forEach(function (cb) {
      cb();
    });
  }

  if (canvas) {
    canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
    canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
  }

  function destroy () {
    rafCallbacks.length = 0;
    stopRAF();

    if (canvas) {
      canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
      canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
    }

    shaderState.clear();
    framebufferState.clear();
    renderbufferState.clear();
    textureState.clear();
    elementState.clear();
    bufferState.clear();

    if (timer) {
      timer.clear();
    }

    destroyCallbacks.forEach(function (cb) {
      cb();
    });
  }

  function compileProcedure (options) {
    check$1(!!options, 'invalid args to regl({...})');
    check$1.type(options, 'object', 'invalid args to regl({...})');

    function flattenNestedOptions (options) {
      var result = extend({}, options);
      delete result.uniforms;
      delete result.attributes;
      delete result.context;

      if ('stencil' in result && result.stencil.op) {
        result.stencil.opBack = result.stencil.opFront = result.stencil.op;
        delete result.stencil.op;
      }

      function merge (name) {
        if (name in result) {
          var child = result[name];
          delete result[name];
          Object.keys(child).forEach(function (prop) {
            result[name + '.' + prop] = child[prop];
          });
        }
      }
      merge('blend');
      merge('depth');
      merge('cull');
      merge('stencil');
      merge('polygonOffset');
      merge('scissor');
      merge('sample');

      return result
    }

    function separateDynamic (object) {
      var staticItems = {};
      var dynamicItems = {};
      Object.keys(object).forEach(function (option) {
        var value = object[option];
        if (dynamic.isDynamic(value)) {
          dynamicItems[option] = dynamic.unbox(value, option);
        } else {
          staticItems[option] = value;
        }
      });
      return {
        dynamic: dynamicItems,
        static: staticItems
      }
    }

    // Treat context variables separate from other dynamic variables
    var context = separateDynamic(options.context || {});
    var uniforms = separateDynamic(options.uniforms || {});
    var attributes = separateDynamic(options.attributes || {});
    var opts = separateDynamic(flattenNestedOptions(options));

    var stats$$1 = {
      gpuTime: 0.0,
      cpuTime: 0.0,
      count: 0
    };

    var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

    var draw = compiled.draw;
    var batch = compiled.batch;
    var scope = compiled.scope;

    // FIXME: we should modify code generation for batch commands so this
    // isn't necessary
    var EMPTY_ARRAY = [];
    function reserve (count) {
      while (EMPTY_ARRAY.length < count) {
        EMPTY_ARRAY.push(null);
      }
      return EMPTY_ARRAY
    }

    function REGLCommand (args, body) {
      var i;
      if (contextLost) {
        check$1.raise('context lost');
      }
      if (typeof args === 'function') {
        return scope.call(this, null, args, 0)
      } else if (typeof body === 'function') {
        if (typeof args === 'number') {
          for (i = 0; i < args; ++i) {
            scope.call(this, null, body, i);
          }
          return
        } else if (Array.isArray(args)) {
          for (i = 0; i < args.length; ++i) {
            scope.call(this, args[i], body, i);
          }
          return
        } else {
          return scope.call(this, args, body, 0)
        }
      } else if (typeof args === 'number') {
        if (args > 0) {
          return batch.call(this, reserve(args | 0), args | 0)
        }
      } else if (Array.isArray(args)) {
        if (args.length) {
          return batch.call(this, args, args.length)
        }
      } else {
        return draw.call(this, args)
      }
    }

    return extend(REGLCommand, {
      stats: stats$$1
    })
  }

  var setFBO = framebufferState.setFBO = compileProcedure({
    framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
  });

  function clearImpl (_, options) {
    var clearFlags = 0;
    core.procs.poll();

    var c = options.color;
    if (c) {
      gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
      clearFlags |= GL_COLOR_BUFFER_BIT;
    }
    if ('depth' in options) {
      gl.clearDepth(+options.depth);
      clearFlags |= GL_DEPTH_BUFFER_BIT;
    }
    if ('stencil' in options) {
      gl.clearStencil(options.stencil | 0);
      clearFlags |= GL_STENCIL_BUFFER_BIT;
    }

    check$1(!!clearFlags, 'called regl.clear with no buffer specified');
    gl.clear(clearFlags);
  }

  function clear (options) {
    check$1(
      typeof options === 'object' && options,
      'regl.clear() takes an object as input');
    if ('framebuffer' in options) {
      if (options.framebuffer &&
          options.framebuffer_reglType === 'framebufferCube') {
        for (var i = 0; i < 6; ++i) {
          setFBO(extend({
            framebuffer: options.framebuffer.faces[i]
          }, options), clearImpl);
        }
      } else {
        setFBO(options, clearImpl);
      }
    } else {
      clearImpl(null, options);
    }
  }

  function frame (cb) {
    check$1.type(cb, 'function', 'regl.frame() callback must be a function');
    rafCallbacks.push(cb);

    function cancel () {
      // FIXME:  should we check something other than equals cb here?
      // what if a user calls frame twice with the same callback...
      //
      var i = find(rafCallbacks, cb);
      check$1(i >= 0, 'cannot cancel a frame twice');
      function pendingCancel () {
        var index = find(rafCallbacks, pendingCancel);
        rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
        rafCallbacks.length -= 1;
        if (rafCallbacks.length <= 0) {
          stopRAF();
        }
      }
      rafCallbacks[i] = pendingCancel;
    }

    startRAF();

    return {
      cancel: cancel
    }
  }

  // poll viewport
  function pollViewport () {
    var viewport = nextState.viewport;
    var scissorBox = nextState.scissor_box;
    viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
    contextState.viewportWidth =
      contextState.framebufferWidth =
      contextState.drawingBufferWidth =
      viewport[2] =
      scissorBox[2] = gl.drawingBufferWidth;
    contextState.viewportHeight =
      contextState.framebufferHeight =
      contextState.drawingBufferHeight =
      viewport[3] =
      scissorBox[3] = gl.drawingBufferHeight;
  }

  function poll () {
    contextState.tick += 1;
    contextState.time = now();
    pollViewport();
    core.procs.poll();
  }

  function refresh () {
    pollViewport();
    core.procs.refresh();
    if (timer) {
      timer.update();
    }
  }

  function now () {
    return (clock() - START_TIME) / 1000.0
  }

  refresh();

  function addListener (event, callback) {
    check$1.type(callback, 'function', 'listener callback must be a function');

    var callbacks;
    switch (event) {
      case 'frame':
        return frame(callback)
      case 'lost':
        callbacks = lossCallbacks;
        break
      case 'restore':
        callbacks = restoreCallbacks;
        break
      case 'destroy':
        callbacks = destroyCallbacks;
        break
      default:
        check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
    }

    callbacks.push(callback);
    return {
      cancel: function () {
        for (var i = 0; i < callbacks.length; ++i) {
          if (callbacks[i] === callback) {
            callbacks[i] = callbacks[callbacks.length - 1];
            callbacks.pop();
            return
          }
        }
      }
    }
  }

  var regl = extend(compileProcedure, {
    // Clear current FBO
    clear: clear,

    // Short cuts for dynamic variables
    prop: dynamic.define.bind(null, DYN_PROP),
    context: dynamic.define.bind(null, DYN_CONTEXT),
    this: dynamic.define.bind(null, DYN_STATE),

    // executes an empty draw command
    draw: compileProcedure({}),

    // Resources
    buffer: function (options) {
      return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
    },
    elements: function (options) {
      return elementState.create(options, false)
    },
    texture: textureState.create2D,
    cube: textureState.createCube,
    renderbuffer: renderbufferState.create,
    framebuffer: framebufferState.create,
    framebufferCube: framebufferState.createCube,

    // Expose context attributes
    attributes: glAttributes,

    // Frame rendering
    frame: frame,
    on: addListener,

    // System limits
    limits: limits,
    hasExtension: function (name) {
      return limits.extensions.indexOf(name.toLowerCase()) >= 0
    },

    // Read pixels
    read: readPixels,

    // Destroy regl and all associated resources
    destroy: destroy,

    // Direct GL state manipulation
    _gl: gl,
    _refresh: refresh,

    poll: function () {
      poll();
      if (timer) {
        timer.update();
      }
    },

    // Current time
    now: now,

    // regl Statistics Information
    stats: stats$$1
  });

  config.onDone(null, regl);

  return regl
}

return wrapREGL;

})));


},{}],"../../../node_modules/@tstackgl/regl-draw/dist/frameCatch.js":[function(require,module,exports) {
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
function createFrameCatch(regl) {
    return function frameCatch(func) {
        var loop = regl.frame(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                func.apply(void 0, __spread(args));
            }
            catch (err) {
                loop.cancel();
                throw err;
            }
        });
        return loop;
    };
}
exports.createFrameCatch = createFrameCatch;

},{}],"../../../node_modules/sliced/index.js":[function(require,module,exports) {

/**
 * An Array.prototype.slice.call(arguments) alternative
 *
 * @param {Object} args something with a length
 * @param {Number} slice
 * @param {Number} sliceEnd
 * @api public
 */

module.exports = function (args, slice, sliceEnd) {
  var ret = [];
  var len = args.length;

  if (0 === len) return ret;

  var start = slice < 0
    ? Math.max(0, slice + len)
    : slice || 0;

  if (sliceEnd !== undefined) {
    len = sliceEnd < 0
      ? sliceEnd + len
      : sliceEnd
  }

  while (len-- > start) {
    ret[len - start] = args[len];
  }

  return ret;
}


},{}],"../../../node_modules/@tstackgl/geometry/src/mesh-combine-normals.ts":[function(require,module,exports) {
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var slice = require("sliced");
function combine(meshes) {
    var hasNormals = meshes.every(function (mesh) { return mesh.normals && mesh.positions.length === mesh.normals.length; });
    var hasColors = meshes.every(function (mesh) { return mesh.colors && mesh.positions.length === mesh.colors.length; });
    var pos = [];
    var cel = [];
    var nor = [];
    var color = [];
    var p = 0;
    var c = 0;
    var k = 0;
    var j = 0;
    for (var i = 0; i < meshes.length; i++) {
        var mpos = meshes[i].positions;
        var mcel = meshes[i].cells;
        var mnor = meshes[i].normals;
        var mcol = meshes[i].colors;
        for (j = 0; j < mpos.length; j++) {
            pos[j + p] = slice(mpos[j]);
            if (hasNormals)
                nor[j + p] = slice(mnor[j]);
            if (hasColors)
                color[j + p] = slice(mcol[j]);
        }
        for (j = 0; j < mcel.length; j++) {
            cel[(k = j + c)] = slice(mcel[j]);
            for (var l = 0; l < cel[k].length; l++) {
                cel[k][l] += p;
            }
        }
        p += mpos.length;
        c += mcel.length;
    }
    return __assign({ cells: cel, positions: pos }, (hasNormals && { normals: nor }), (hasColors && { colors: color }));
}
exports.combine = combine;

},{"sliced":"../../../node_modules/sliced/index.js"}],"../../../node_modules/gl-mat4/create.js":[function(require,module,exports) {
module.exports = create;

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],"../../../node_modules/gl-mat4/clone.js":[function(require,module,exports) {
module.exports = clone;

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
    var out = new Float32Array(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],"../../../node_modules/gl-mat4/copy.js":[function(require,module,exports) {
module.exports = copy;

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],"../../../node_modules/gl-mat4/identity.js":[function(require,module,exports) {
module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],"../../../node_modules/gl-mat4/transpose.js":[function(require,module,exports) {
module.exports = transpose;

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};
},{}],"../../../node_modules/gl-mat4/invert.js":[function(require,module,exports) {
module.exports = invert;

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};
},{}],"../../../node_modules/gl-mat4/adjoint.js":[function(require,module,exports) {
module.exports = adjoint;

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};
},{}],"../../../node_modules/gl-mat4/determinant.js":[function(require,module,exports) {
module.exports = determinant;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};
},{}],"../../../node_modules/gl-mat4/multiply.js":[function(require,module,exports) {
module.exports = multiply;

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};
},{}],"../../../node_modules/gl-mat4/translate.js":[function(require,module,exports) {
module.exports = translate;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};
},{}],"../../../node_modules/gl-mat4/scale.js":[function(require,module,exports) {
module.exports = scale;

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],"../../../node_modules/gl-mat4/rotate.js":[function(require,module,exports) {
module.exports = rotate;

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};
},{}],"../../../node_modules/gl-mat4/rotateX.js":[function(require,module,exports) {
module.exports = rotateX;

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};
},{}],"../../../node_modules/gl-mat4/rotateY.js":[function(require,module,exports) {
module.exports = rotateY;

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};
},{}],"../../../node_modules/gl-mat4/rotateZ.js":[function(require,module,exports) {
module.exports = rotateZ;

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
},{}],"../../../node_modules/gl-mat4/fromRotation.js":[function(require,module,exports) {
module.exports = fromRotation

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotate(dest, dest, rad, axis)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  var s, c, t
  var x = axis[0]
  var y = axis[1]
  var z = axis[2]
  var len = Math.sqrt(x * x + y * y + z * z)

  if (Math.abs(len) < 0.000001) {
    return null
  }

  len = 1 / len
  x *= len
  y *= len
  z *= len

  s = Math.sin(rad)
  c = Math.cos(rad)
  t = 1 - c

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c
  out[1] = y * x * t + z * s
  out[2] = z * x * t - y * s
  out[3] = 0
  out[4] = x * y * t - z * s
  out[5] = y * y * t + c
  out[6] = z * y * t + x * s
  out[7] = 0
  out[8] = x * z * t + y * s
  out[9] = y * z * t - x * s
  out[10] = z * z * t + c
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}

},{}],"../../../node_modules/gl-mat4/fromRotationTranslation.js":[function(require,module,exports) {
module.exports = fromRotationTranslation;

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};
},{}],"../../../node_modules/gl-mat4/fromScaling.js":[function(require,module,exports) {
module.exports = fromScaling

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.scale(dest, dest, vec)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0]
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = v[1]
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = v[2]
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}

},{}],"../../../node_modules/gl-mat4/fromTranslation.js":[function(require,module,exports) {
module.exports = fromTranslation

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.translate(dest, dest, vec)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = 1
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 1
  out[11] = 0
  out[12] = v[0]
  out[13] = v[1]
  out[14] = v[2]
  out[15] = 1
  return out
}

},{}],"../../../node_modules/gl-mat4/fromXRotation.js":[function(require,module,exports) {
module.exports = fromXRotation

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotateX(dest, dest, rad)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad)

    // Perform axis-specific matrix multiplication
    out[0] = 1
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[5] = c
    out[6] = s
    out[7] = 0
    out[8] = 0
    out[9] = -s
    out[10] = c
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
    out[15] = 1
    return out
}
},{}],"../../../node_modules/gl-mat4/fromYRotation.js":[function(require,module,exports) {
module.exports = fromYRotation

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotateY(dest, dest, rad)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad)

    // Perform axis-specific matrix multiplication
    out[0] = c
    out[1] = 0
    out[2] = -s
    out[3] = 0
    out[4] = 0
    out[5] = 1
    out[6] = 0
    out[7] = 0
    out[8] = s
    out[9] = 0
    out[10] = c
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
    out[15] = 1
    return out
}
},{}],"../../../node_modules/gl-mat4/fromZRotation.js":[function(require,module,exports) {
module.exports = fromZRotation

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotateZ(dest, dest, rad)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad)

    // Perform axis-specific matrix multiplication
    out[0] = c
    out[1] = s
    out[2] = 0
    out[3] = 0
    out[4] = -s
    out[5] = c
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[10] = 1
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
    out[15] = 1
    return out
}
},{}],"../../../node_modules/gl-mat4/fromQuat.js":[function(require,module,exports) {
module.exports = fromQuat;

/**
 * Creates a matrix from a quaternion rotation.
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @returns {mat4} out
 */
function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};
},{}],"../../../node_modules/gl-mat4/frustum.js":[function(require,module,exports) {
module.exports = frustum;

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};
},{}],"../../../node_modules/gl-mat4/perspective.js":[function(require,module,exports) {
module.exports = perspective;

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
},{}],"../../../node_modules/gl-mat4/perspectiveFromFieldOfView.js":[function(require,module,exports) {
module.exports = perspectiveFromFieldOfView;

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}


},{}],"../../../node_modules/gl-mat4/ortho.js":[function(require,module,exports) {
module.exports = ortho;

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};
},{}],"../../../node_modules/gl-mat4/lookAt.js":[function(require,module,exports) {
var identity = require('./identity');

module.exports = lookAt;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};
},{"./identity":"../../../node_modules/gl-mat4/identity.js"}],"../../../node_modules/gl-mat4/str.js":[function(require,module,exports) {
module.exports = str;

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};
},{}],"../../../node_modules/gl-mat4/index.js":[function(require,module,exports) {
module.exports = {
  create: require('./create')
  , clone: require('./clone')
  , copy: require('./copy')
  , identity: require('./identity')
  , transpose: require('./transpose')
  , invert: require('./invert')
  , adjoint: require('./adjoint')
  , determinant: require('./determinant')
  , multiply: require('./multiply')
  , translate: require('./translate')
  , scale: require('./scale')
  , rotate: require('./rotate')
  , rotateX: require('./rotateX')
  , rotateY: require('./rotateY')
  , rotateZ: require('./rotateZ')
  , fromRotation: require('./fromRotation')
  , fromRotationTranslation: require('./fromRotationTranslation')
  , fromScaling: require('./fromScaling')
  , fromTranslation: require('./fromTranslation')
  , fromXRotation: require('./fromXRotation')
  , fromYRotation: require('./fromYRotation')
  , fromZRotation: require('./fromZRotation')
  , fromQuat: require('./fromQuat')
  , frustum: require('./frustum')
  , perspective: require('./perspective')
  , perspectiveFromFieldOfView: require('./perspectiveFromFieldOfView')
  , ortho: require('./ortho')
  , lookAt: require('./lookAt')
  , str: require('./str')
}

},{"./create":"../../../node_modules/gl-mat4/create.js","./clone":"../../../node_modules/gl-mat4/clone.js","./copy":"../../../node_modules/gl-mat4/copy.js","./identity":"../../../node_modules/gl-mat4/identity.js","./transpose":"../../../node_modules/gl-mat4/transpose.js","./invert":"../../../node_modules/gl-mat4/invert.js","./adjoint":"../../../node_modules/gl-mat4/adjoint.js","./determinant":"../../../node_modules/gl-mat4/determinant.js","./multiply":"../../../node_modules/gl-mat4/multiply.js","./translate":"../../../node_modules/gl-mat4/translate.js","./scale":"../../../node_modules/gl-mat4/scale.js","./rotate":"../../../node_modules/gl-mat4/rotate.js","./rotateX":"../../../node_modules/gl-mat4/rotateX.js","./rotateY":"../../../node_modules/gl-mat4/rotateY.js","./rotateZ":"../../../node_modules/gl-mat4/rotateZ.js","./fromRotation":"../../../node_modules/gl-mat4/fromRotation.js","./fromRotationTranslation":"../../../node_modules/gl-mat4/fromRotationTranslation.js","./fromScaling":"../../../node_modules/gl-mat4/fromScaling.js","./fromTranslation":"../../../node_modules/gl-mat4/fromTranslation.js","./fromXRotation":"../../../node_modules/gl-mat4/fromXRotation.js","./fromYRotation":"../../../node_modules/gl-mat4/fromYRotation.js","./fromZRotation":"../../../node_modules/gl-mat4/fromZRotation.js","./fromQuat":"../../../node_modules/gl-mat4/fromQuat.js","./frustum":"../../../node_modules/gl-mat4/frustum.js","./perspective":"../../../node_modules/gl-mat4/perspective.js","./perspectiveFromFieldOfView":"../../../node_modules/gl-mat4/perspectiveFromFieldOfView.js","./ortho":"../../../node_modules/gl-mat4/ortho.js","./lookAt":"../../../node_modules/gl-mat4/lookAt.js","./str":"../../../node_modules/gl-mat4/str.js"}],"../../../node_modules/gl-vec3/epsilon.js":[function(require,module,exports) {
module.exports = 0.000001

},{}],"../../../node_modules/gl-vec3/create.js":[function(require,module,exports) {
module.exports = create;

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
    var out = new Float32Array(3)
    out[0] = 0
    out[1] = 0
    out[2] = 0
    return out
}
},{}],"../../../node_modules/gl-vec3/clone.js":[function(require,module,exports) {
module.exports = clone;

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
    var out = new Float32Array(3)
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/fromValues.js":[function(require,module,exports) {
module.exports = fromValues;

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
    var out = new Float32Array(3)
    out[0] = x
    out[1] = y
    out[2] = z
    return out
}
},{}],"../../../node_modules/gl-vec3/normalize.js":[function(require,module,exports) {
module.exports = normalize;

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    var len = x*x + y*y + z*z
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len)
        out[0] = a[0] * len
        out[1] = a[1] * len
        out[2] = a[2] * len
    }
    return out
}
},{}],"../../../node_modules/gl-vec3/dot.js":[function(require,module,exports) {
module.exports = dot;

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}
},{}],"../../../node_modules/gl-vec3/angle.js":[function(require,module,exports) {
module.exports = angle

var fromValues = require('./fromValues')
var normalize = require('./normalize')
var dot = require('./dot')

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
    var tempA = fromValues(a[0], a[1], a[2])
    var tempB = fromValues(b[0], b[1], b[2])
 
    normalize(tempA, tempA)
    normalize(tempB, tempB)
 
    var cosine = dot(tempA, tempB)

    if(cosine > 1.0){
        return 0
    } else {
        return Math.acos(cosine)
    }     
}

},{"./fromValues":"../../../node_modules/gl-vec3/fromValues.js","./normalize":"../../../node_modules/gl-vec3/normalize.js","./dot":"../../../node_modules/gl-vec3/dot.js"}],"../../../node_modules/gl-vec3/copy.js":[function(require,module,exports) {
module.exports = copy;

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/set.js":[function(require,module,exports) {
module.exports = set;

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
    out[0] = x
    out[1] = y
    out[2] = z
    return out
}
},{}],"../../../node_modules/gl-vec3/equals.js":[function(require,module,exports) {
module.exports = equals

var EPSILON = require('./epsilon')

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0]
  var a1 = a[1]
  var a2 = a[2]
  var b0 = b[0]
  var b1 = b[1]
  var b2 = b[2]
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)))
}

},{"./epsilon":"../../../node_modules/gl-vec3/epsilon.js"}],"../../../node_modules/gl-vec3/exactEquals.js":[function(require,module,exports) {
module.exports = exactEquals

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

},{}],"../../../node_modules/gl-vec3/add.js":[function(require,module,exports) {
module.exports = add;

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    out[2] = a[2] + b[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/subtract.js":[function(require,module,exports) {
module.exports = subtract;

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    out[2] = a[2] - b[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/sub.js":[function(require,module,exports) {
module.exports = require('./subtract')

},{"./subtract":"../../../node_modules/gl-vec3/subtract.js"}],"../../../node_modules/gl-vec3/multiply.js":[function(require,module,exports) {
module.exports = multiply;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
    out[0] = a[0] * b[0]
    out[1] = a[1] * b[1]
    out[2] = a[2] * b[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/mul.js":[function(require,module,exports) {
module.exports = require('./multiply')

},{"./multiply":"../../../node_modules/gl-vec3/multiply.js"}],"../../../node_modules/gl-vec3/divide.js":[function(require,module,exports) {
module.exports = divide;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
    out[0] = a[0] / b[0]
    out[1] = a[1] / b[1]
    out[2] = a[2] / b[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/div.js":[function(require,module,exports) {
module.exports = require('./divide')

},{"./divide":"../../../node_modules/gl-vec3/divide.js"}],"../../../node_modules/gl-vec3/min.js":[function(require,module,exports) {
module.exports = min;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    out[2] = Math.min(a[2], b[2])
    return out
}
},{}],"../../../node_modules/gl-vec3/max.js":[function(require,module,exports) {
module.exports = max;

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    out[2] = Math.max(a[2], b[2])
    return out
}
},{}],"../../../node_modules/gl-vec3/floor.js":[function(require,module,exports) {
module.exports = floor

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0])
  out[1] = Math.floor(a[1])
  out[2] = Math.floor(a[2])
  return out
}

},{}],"../../../node_modules/gl-vec3/ceil.js":[function(require,module,exports) {
module.exports = ceil

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0])
  out[1] = Math.ceil(a[1])
  out[2] = Math.ceil(a[2])
  return out
}

},{}],"../../../node_modules/gl-vec3/round.js":[function(require,module,exports) {
module.exports = round

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = Math.round(a[0])
  out[1] = Math.round(a[1])
  out[2] = Math.round(a[2])
  return out
}

},{}],"../../../node_modules/gl-vec3/scale.js":[function(require,module,exports) {
module.exports = scale;

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b
    out[1] = a[1] * b
    out[2] = a[2] * b
    return out
}
},{}],"../../../node_modules/gl-vec3/scaleAndAdd.js":[function(require,module,exports) {
module.exports = scaleAndAdd;

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale)
    out[1] = a[1] + (b[1] * scale)
    out[2] = a[2] + (b[2] * scale)
    return out
}
},{}],"../../../node_modules/gl-vec3/distance.js":[function(require,module,exports) {
module.exports = distance;

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2]
    return Math.sqrt(x*x + y*y + z*z)
}
},{}],"../../../node_modules/gl-vec3/dist.js":[function(require,module,exports) {
module.exports = require('./distance')

},{"./distance":"../../../node_modules/gl-vec3/distance.js"}],"../../../node_modules/gl-vec3/squaredDistance.js":[function(require,module,exports) {
module.exports = squaredDistance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2]
    return x*x + y*y + z*z
}
},{}],"../../../node_modules/gl-vec3/sqrDist.js":[function(require,module,exports) {
module.exports = require('./squaredDistance')

},{"./squaredDistance":"../../../node_modules/gl-vec3/squaredDistance.js"}],"../../../node_modules/gl-vec3/length.js":[function(require,module,exports) {
module.exports = length;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    return Math.sqrt(x*x + y*y + z*z)
}
},{}],"../../../node_modules/gl-vec3/len.js":[function(require,module,exports) {
module.exports = require('./length')

},{"./length":"../../../node_modules/gl-vec3/length.js"}],"../../../node_modules/gl-vec3/squaredLength.js":[function(require,module,exports) {
module.exports = squaredLength;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    return x*x + y*y + z*z
}
},{}],"../../../node_modules/gl-vec3/sqrLen.js":[function(require,module,exports) {
module.exports = require('./squaredLength')

},{"./squaredLength":"../../../node_modules/gl-vec3/squaredLength.js"}],"../../../node_modules/gl-vec3/negate.js":[function(require,module,exports) {
module.exports = negate;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
    out[0] = -a[0]
    out[1] = -a[1]
    out[2] = -a[2]
    return out
}
},{}],"../../../node_modules/gl-vec3/inverse.js":[function(require,module,exports) {
module.exports = inverse;

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0]
  out[1] = 1.0 / a[1]
  out[2] = 1.0 / a[2]
  return out
}
},{}],"../../../node_modules/gl-vec3/cross.js":[function(require,module,exports) {
module.exports = cross;

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2]

    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out
}
},{}],"../../../node_modules/gl-vec3/lerp.js":[function(require,module,exports) {
module.exports = lerp;

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2]
    out[0] = ax + t * (b[0] - ax)
    out[1] = ay + t * (b[1] - ay)
    out[2] = az + t * (b[2] - az)
    return out
}
},{}],"../../../node_modules/gl-vec3/random.js":[function(require,module,exports) {
module.exports = random;

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
    scale = scale || 1.0

    var r = Math.random() * 2.0 * Math.PI
    var z = (Math.random() * 2.0) - 1.0
    var zScale = Math.sqrt(1.0-z*z) * scale

    out[0] = Math.cos(r) * zScale
    out[1] = Math.sin(r) * zScale
    out[2] = z * scale
    return out
}
},{}],"../../../node_modules/gl-vec3/transformMat4.js":[function(require,module,exports) {
module.exports = transformMat4;

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15]
    w = w || 1.0
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    return out
}
},{}],"../../../node_modules/gl-vec3/transformMat3.js":[function(require,module,exports) {
module.exports = transformMat3;

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
    var x = a[0], y = a[1], z = a[2]
    out[0] = x * m[0] + y * m[3] + z * m[6]
    out[1] = x * m[1] + y * m[4] + z * m[7]
    out[2] = x * m[2] + y * m[5] + z * m[8]
    return out
}
},{}],"../../../node_modules/gl-vec3/transformQuat.js":[function(require,module,exports) {
module.exports = transformQuat;

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx
    return out
}
},{}],"../../../node_modules/gl-vec3/rotateX.js":[function(require,module,exports) {
module.exports = rotateX;

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
    var by = b[1]
    var bz = b[2]

    // Translate point to the origin
    var py = a[1] - by
    var pz = a[2] - bz

    var sc = Math.sin(c)
    var cc = Math.cos(c)

    // perform rotation and translate to correct position
    out[0] = a[0]
    out[1] = by + py * cc - pz * sc
    out[2] = bz + py * sc + pz * cc

    return out
}

},{}],"../../../node_modules/gl-vec3/rotateY.js":[function(require,module,exports) {
module.exports = rotateY;

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
    var bx = b[0]
    var bz = b[2]

    // translate point to the origin
    var px = a[0] - bx
    var pz = a[2] - bz
    
    var sc = Math.sin(c)
    var cc = Math.cos(c)
  
    // perform rotation and translate to correct position
    out[0] = bx + pz * sc + px * cc
    out[1] = a[1]
    out[2] = bz + pz * cc - px * sc
  
    return out
}

},{}],"../../../node_modules/gl-vec3/rotateZ.js":[function(require,module,exports) {
module.exports = rotateZ;

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
    var bx = b[0]
    var by = b[1]

    //Translate point to the origin
    var px = a[0] - bx
    var py = a[1] - by
  
    var sc = Math.sin(c)
    var cc = Math.cos(c)

    // perform rotation and translate to correct position
    out[0] = bx + px * cc - py * sc
    out[1] = by + px * sc + py * cc
    out[2] = a[2]
  
    return out
}

},{}],"../../../node_modules/gl-vec3/forEach.js":[function(require,module,exports) {
module.exports = forEach;

var vec = require('./create')()

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
function forEach(a, stride, offset, count, fn, arg) {
        var i, l
        if(!stride) {
            stride = 3
        }

        if(!offset) {
            offset = 0
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length)
        } else {
            l = a.length
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i] 
            vec[1] = a[i+1] 
            vec[2] = a[i+2]
            fn(vec, vec, arg)
            a[i] = vec[0] 
            a[i+1] = vec[1] 
            a[i+2] = vec[2]
        }
        
        return a
}
},{"./create":"../../../node_modules/gl-vec3/create.js"}],"../../../node_modules/gl-vec3/index.js":[function(require,module,exports) {
module.exports = {
  EPSILON: require('./epsilon')
  , create: require('./create')
  , clone: require('./clone')
  , angle: require('./angle')
  , fromValues: require('./fromValues')
  , copy: require('./copy')
  , set: require('./set')
  , equals: require('./equals')
  , exactEquals: require('./exactEquals')
  , add: require('./add')
  , subtract: require('./subtract')
  , sub: require('./sub')
  , multiply: require('./multiply')
  , mul: require('./mul')
  , divide: require('./divide')
  , div: require('./div')
  , min: require('./min')
  , max: require('./max')
  , floor: require('./floor')
  , ceil: require('./ceil')
  , round: require('./round')
  , scale: require('./scale')
  , scaleAndAdd: require('./scaleAndAdd')
  , distance: require('./distance')
  , dist: require('./dist')
  , squaredDistance: require('./squaredDistance')
  , sqrDist: require('./sqrDist')
  , length: require('./length')
  , len: require('./len')
  , squaredLength: require('./squaredLength')
  , sqrLen: require('./sqrLen')
  , negate: require('./negate')
  , inverse: require('./inverse')
  , normalize: require('./normalize')
  , dot: require('./dot')
  , cross: require('./cross')
  , lerp: require('./lerp')
  , random: require('./random')
  , transformMat4: require('./transformMat4')
  , transformMat3: require('./transformMat3')
  , transformQuat: require('./transformQuat')
  , rotateX: require('./rotateX')
  , rotateY: require('./rotateY')
  , rotateZ: require('./rotateZ')
  , forEach: require('./forEach')
}

},{"./epsilon":"../../../node_modules/gl-vec3/epsilon.js","./create":"../../../node_modules/gl-vec3/create.js","./clone":"../../../node_modules/gl-vec3/clone.js","./angle":"../../../node_modules/gl-vec3/angle.js","./fromValues":"../../../node_modules/gl-vec3/fromValues.js","./copy":"../../../node_modules/gl-vec3/copy.js","./set":"../../../node_modules/gl-vec3/set.js","./equals":"../../../node_modules/gl-vec3/equals.js","./exactEquals":"../../../node_modules/gl-vec3/exactEquals.js","./add":"../../../node_modules/gl-vec3/add.js","./subtract":"../../../node_modules/gl-vec3/subtract.js","./sub":"../../../node_modules/gl-vec3/sub.js","./multiply":"../../../node_modules/gl-vec3/multiply.js","./mul":"../../../node_modules/gl-vec3/mul.js","./divide":"../../../node_modules/gl-vec3/divide.js","./div":"../../../node_modules/gl-vec3/div.js","./min":"../../../node_modules/gl-vec3/min.js","./max":"../../../node_modules/gl-vec3/max.js","./floor":"../../../node_modules/gl-vec3/floor.js","./ceil":"../../../node_modules/gl-vec3/ceil.js","./round":"../../../node_modules/gl-vec3/round.js","./scale":"../../../node_modules/gl-vec3/scale.js","./scaleAndAdd":"../../../node_modules/gl-vec3/scaleAndAdd.js","./distance":"../../../node_modules/gl-vec3/distance.js","./dist":"../../../node_modules/gl-vec3/dist.js","./squaredDistance":"../../../node_modules/gl-vec3/squaredDistance.js","./sqrDist":"../../../node_modules/gl-vec3/sqrDist.js","./length":"../../../node_modules/gl-vec3/length.js","./len":"../../../node_modules/gl-vec3/len.js","./squaredLength":"../../../node_modules/gl-vec3/squaredLength.js","./sqrLen":"../../../node_modules/gl-vec3/sqrLen.js","./negate":"../../../node_modules/gl-vec3/negate.js","./inverse":"../../../node_modules/gl-vec3/inverse.js","./normalize":"../../../node_modules/gl-vec3/normalize.js","./dot":"../../../node_modules/gl-vec3/dot.js","./cross":"../../../node_modules/gl-vec3/cross.js","./lerp":"../../../node_modules/gl-vec3/lerp.js","./random":"../../../node_modules/gl-vec3/random.js","./transformMat4":"../../../node_modules/gl-vec3/transformMat4.js","./transformMat3":"../../../node_modules/gl-vec3/transformMat3.js","./transformQuat":"../../../node_modules/gl-vec3/transformQuat.js","./rotateX":"../../../node_modules/gl-vec3/rotateX.js","./rotateY":"../../../node_modules/gl-vec3/rotateY.js","./rotateZ":"../../../node_modules/gl-vec3/rotateZ.js","./forEach":"../../../node_modules/gl-vec3/forEach.js"}],"../../../node_modules/@tstackgl/geometry/dist/calc/get-centroid.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_vec3_1 = __importDefault(require("gl-vec3"));
function getCentroid(points) {
    // TODO: refactor with transducers
    var l = points.length;
    if (l === 0) {
        return [];
    }
    return points.reduce(function (center, p, i) {
        for (var j = 0; j < p.length; j++) {
            center[j] += p[j];
        }
        if (i === l - 1) {
            for (var j = 0; j < p.length; j++) {
                center[j] /= l;
            }
        }
        return center;
    }, new Float32Array(points[0].length));
}
exports.getCentroid = getCentroid;
function getCentroidFromCells(cells, positions) {
    return cells.map(function (face) { return getCentroid(face.map(function (index) { return positions[index]; })); });
}
exports.getCentroidFromCells = getCentroidFromCells;
function getCentroidTriangle3(triangle) {
    var result = gl_vec3_1.default.create();
    result[0] = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3;
    result[1] = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3;
    result[2] = (triangle[0][2] + triangle[1][2] + triangle[2][2]) / 3;
    return result;
}
exports.getCentroidTriangle3 = getCentroidTriangle3;

},{"gl-vec3":"../../../node_modules/gl-vec3/index.js"}],"../../../node_modules/earcut/src/earcut.js":[function(require,module,exports) {
'use strict';

module.exports = earcut;
module.exports.default = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return p;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m.next;

    while (p !== stop) {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    }

    return m;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
           locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
           area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

},{}],"../../../node_modules/@thi.ng/checks/is-arraylike.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isArrayLike(x) {
    return (x != null && typeof x !== "function" && x.length !== undefined);
}
exports.isArrayLike = isArrayLike;

},{}],"../../../node_modules/@thi.ng/transducers/func/ensure-iterable.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
function ensureIterable(x) {
    if (!(x != null && x[Symbol.iterator])) {
        illegal_arguments_1.illegalArgs(`value is not iterable: ${x}`);
    }
    return x;
}
exports.ensureIterable = ensureIterable;

},{"@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js"}],"../../../node_modules/@thi.ng/transducers/func/ensure-array.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_array_1 = require("@thi.ng/checks/is-array");
const is_arraylike_1 = require("@thi.ng/checks/is-arraylike");
const ensure_iterable_1 = require("./ensure-iterable");
/**
 * Helper function to avoid unnecessary copying if `x` is already an
 * array. First checks if `x` is an array and if so returns it. Else
 * attempts to obtain an iterator from `x` and if successful collects it
 * as array and returns it. Throws error if `x` isn't iterable.
 *
 * @param x
 */
function ensureArray(x) {
    return is_array_1.isArray(x) ? x : [...ensure_iterable_1.ensureIterable(x)];
}
exports.ensureArray = ensureArray;
function ensureArrayLike(x) {
    return is_arraylike_1.isArrayLike(x) ? x : [...ensure_iterable_1.ensureIterable(x)];
}
exports.ensureArrayLike = ensureArrayLike;

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","@thi.ng/checks/is-arraylike":"../../../node_modules/@thi.ng/checks/is-arraylike.js","./ensure-iterable":"../../../node_modules/@thi.ng/transducers/func/ensure-iterable.js"}],"../../../node_modules/@thi.ng/transducers/iter/wrap.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const ensure_array_1 = require("../func/ensure-array");
/**
 * Yields iterator of `src` with the last `n` values of `src` prepended
 * at the beginning (if `left` is truthy) and/or the first `n` values
 * appended at the end (if `right` is truthy). Wraps both sides by
 * default and throws error if `n` < 0 or larger than `src.length`.
 *
 * @param src
 * @param n
 * @param left
 * @param right
 */
function* wrap(src, n = 1, left = true, right = true) {
    const _src = ensure_array_1.ensureArray(src);
    (n < 0 || n > _src.length) && illegal_arguments_1.illegalArgs(`wrong number of wrap items: got ${n}, but max: ${_src.length}`);
    if (left) {
        for (let m = _src.length, i = m - n; i < m; i++) {
            yield _src[i];
        }
    }
    yield* _src;
    if (right) {
        for (let i = 0; i < n; i++) {
            yield _src[i];
        }
    }
}
exports.wrap = wrap;

},{"@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","../func/ensure-array":"../../../node_modules/@thi.ng/transducers/func/ensure-array.js"}],"../../../node_modules/@thi.ng/checks/is-iterable.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIterable(x) {
    return x != null && typeof x[Symbol.iterator] === "function";
}
exports.isIterable = isIterable;

},{}],"../../../node_modules/@thi.ng/transducers/reduced.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reduced {
    constructor(val) {
        this.value = val;
    }
    deref() {
        return this.value;
    }
}
exports.Reduced = Reduced;
function reduced(x) {
    return new Reduced(x);
}
exports.reduced = reduced;
function isReduced(x) {
    return x instanceof Reduced;
}
exports.isReduced = isReduced;
function ensureReduced(x) {
    return x instanceof Reduced ? x : new Reduced(x);
}
exports.ensureReduced = ensureReduced;
function unreduced(x) {
    return x instanceof Reduced ? x.deref() : x;
}
exports.unreduced = unreduced;

},{}],"../../../node_modules/@thi.ng/errors/illegal-arity.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IllegalArityError extends Error {
    constructor(n) {
        super(`illegal arity: ${n}`);
    }
}
exports.IllegalArityError = IllegalArityError;
function illegalArity(n) {
    throw new IllegalArityError(n);
}
exports.illegalArity = illegalArity;

},{}],"../../../node_modules/@thi.ng/transducers/reduce.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const implements_function_1 = require("@thi.ng/checks/implements-function");
const is_arraylike_1 = require("@thi.ng/checks/is-arraylike");
const is_iterable_1 = require("@thi.ng/checks/is-iterable");
const illegal_arity_1 = require("@thi.ng/errors/illegal-arity");
const reduced_1 = require("./reduced");
function reduce(...args) {
    let acc, xs;
    switch (args.length) {
        case 3:
            xs = args[2];
            acc = args[1];
            break;
        case 2:
            xs = args[1];
            break;
        default:
            illegal_arity_1.illegalArity(args.length);
    }
    const rfn = args[0];
    const init = rfn[0];
    const complete = rfn[1];
    const reduce = rfn[2];
    acc = acc == null ? init() : acc;
    if (implements_function_1.implementsFunction(xs, "$reduce")) {
        acc = xs.$reduce(reduce, acc);
    }
    else if (is_arraylike_1.isArrayLike(xs)) {
        for (let i = 0, n = xs.length; i < n; i++) {
            acc = reduce(acc, xs[i]);
            if (reduced_1.isReduced(acc)) {
                acc = acc.deref();
                break;
            }
        }
    }
    else {
        for (let x of xs) {
            acc = reduce(acc, x);
            if (reduced_1.isReduced(acc)) {
                acc = acc.deref();
                break;
            }
        }
    }
    return reduced_1.unreduced(complete(acc));
}
exports.reduce = reduce;
/**
 * Convenience helper for building a full `Reducer` using the identity
 * function (i.e. `(x) => x`) as completion step (true for 90% of all
 * bundled transducers).
 *
 * @param init init step of reducer
 * @param rfn reduction step of reducer
 */
function reducer(init, rfn) {
    return [init, (acc) => acc, rfn];
}
exports.reducer = reducer;
exports.$$reduce = (rfn, args) => {
    const n = args.length - 1;
    return is_iterable_1.isIterable(args[n]) ?
        args.length > 1 ?
            reduce(rfn.apply(null, args.slice(0, n)), args[n]) :
            reduce(rfn(), args[0]) :
        undefined;
};

},{"@thi.ng/checks/implements-function":"../../../node_modules/@thi.ng/checks/implements-function.js","@thi.ng/checks/is-arraylike":"../../../node_modules/@thi.ng/checks/is-arraylike.js","@thi.ng/checks/is-iterable":"../../../node_modules/@thi.ng/checks/is-iterable.js","@thi.ng/errors/illegal-arity":"../../../node_modules/@thi.ng/errors/illegal-arity.js","./reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/rfn/push.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function push(xs) {
    return xs ?
        [...xs] :
        reduce_1.reducer(() => [], (acc, x) => (acc.push(x), acc));
}
exports.push = push;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/iterator.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@thi.ng/api/api");
const is_iterable_1 = require("@thi.ng/checks/is-iterable");
const reduced_1 = require("./reduced");
const push_1 = require("./rfn/push");
/**
 * Takes a transducer and input iterable. Returns iterator of
 * transformed results.
 *
 * @param xform
 * @param xs
 */
function* iterator(xform, xs) {
    const rfn = xform(push_1.push());
    const complete = rfn[1];
    const reduce = rfn[2];
    for (let x of xs) {
        const y = reduce([], x);
        if (reduced_1.isReduced(y)) {
            yield* reduced_1.unreduced(complete(y.deref()));
            return;
        }
        if (y.length) {
            yield* y;
        }
    }
    yield* reduced_1.unreduced(complete([]));
}
exports.iterator = iterator;
/**
 * Optimized version of `iterator()` for transducers which are
 * guaranteed to:
 *
 * 1) Only produce none or a single result per input
 * 2) Do not require a `completion` reduction step
 *
 * @param xform
 * @param xs
 */
function* iterator1(xform, xs) {
    const reduce = xform([null, null, (_, x) => x])[2];
    for (let x of xs) {
        let y = reduce(api_1.SEMAPHORE, x);
        if (reduced_1.isReduced(y)) {
            y = reduced_1.unreduced(y.deref());
            if (y !== api_1.SEMAPHORE) {
                yield y;
            }
            return;
        }
        if (y !== api_1.SEMAPHORE) {
            yield y;
        }
    }
}
exports.iterator1 = iterator1;
/**
 * Helper function used by various transducers to wrap themselves as
 * transforming iterators. Delegates to `iterator1()` by default.
 *
 * @param xform
 * @param args
 * @param impl
 */
exports.$iter = (xform, args, impl = iterator1) => {
    const n = args.length - 1;
    return is_iterable_1.isIterable(args[n]) ?
        args.length > 1 ?
            impl(xform.apply(null, args.slice(0, n)), args[n]) :
            impl(xform(), args[0]) :
        undefined;
};

},{"@thi.ng/api/api":"../../../node_modules/@thi.ng/api/api.js","@thi.ng/checks/is-iterable":"../../../node_modules/@thi.ng/checks/is-iterable.js","./reduced":"../../../node_modules/@thi.ng/transducers/reduced.js","./rfn/push":"../../../node_modules/@thi.ng/transducers/rfn/push.js"}],"../../../node_modules/@thi.ng/transducers/xform/partition.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
function partition(...args) {
    const iter = iterator_1.$iter(partition, args, iterator_1.iterator);
    if (iter) {
        return iter;
    }
    let size = args[0], all, step;
    if (typeof args[1] == "number") {
        step = args[1];
        all = args[2];
    }
    else {
        step = size;
        all = args[1];
    }
    return ([init, complete, reduce]) => {
        let buf = [];
        let skip = 0;
        return [
            init,
            (acc) => {
                if (all && buf.length > 0) {
                    acc = reduce(acc, buf);
                    buf = [];
                }
                return complete(acc);
            },
            (acc, x) => {
                if (skip <= 0) {
                    if (buf.length < size) {
                        buf.push(x);
                    }
                    if (buf.length === size) {
                        acc = reduce(acc, buf);
                        buf = step < size ? buf.slice(step) : [];
                        skip = step - size;
                    }
                }
                else {
                    skip--;
                }
                return acc;
            }
        ];
    };
}
exports.partition = partition;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@tstackgl/geometry/dist/edge.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_1 = require("@thi.ng/transducers/iter/wrap");
var partition_1 = require("@thi.ng/transducers/xform/partition");
function polygonToSegments(array) {
    return partition_1.partition(2, 1, wrap_1.wrap(array, 1, false, true));
}
exports.polygonToSegments = polygonToSegments;

},{"@thi.ng/transducers/iter/wrap":"../../../node_modules/@thi.ng/transducers/iter/wrap.js","@thi.ng/transducers/xform/partition":"../../../node_modules/@thi.ng/transducers/xform/partition.js"}],"../../../node_modules/gl-vec2/epsilon.js":[function(require,module,exports) {
module.exports = 0.000001

},{}],"../../../node_modules/gl-vec2/create.js":[function(require,module,exports) {
module.exports = create

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
function create() {
    var out = new Float32Array(2)
    out[0] = 0
    out[1] = 0
    return out
}
},{}],"../../../node_modules/gl-vec2/clone.js":[function(require,module,exports) {
module.exports = clone

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
function clone(a) {
    var out = new Float32Array(2)
    out[0] = a[0]
    out[1] = a[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/fromValues.js":[function(require,module,exports) {
module.exports = fromValues

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
function fromValues(x, y) {
    var out = new Float32Array(2)
    out[0] = x
    out[1] = y
    return out
}
},{}],"../../../node_modules/gl-vec2/copy.js":[function(require,module,exports) {
module.exports = copy

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
function copy(out, a) {
    out[0] = a[0]
    out[1] = a[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/set.js":[function(require,module,exports) {
module.exports = set

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
function set(out, x, y) {
    out[0] = x
    out[1] = y
    return out
}
},{}],"../../../node_modules/gl-vec2/equals.js":[function(require,module,exports) {
module.exports = equals

var EPSILON = require('./epsilon')

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0]
  var a1 = a[1]
  var b0 = b[0]
  var b1 = b[1]
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)))
}

},{"./epsilon":"../../../node_modules/gl-vec2/epsilon.js"}],"../../../node_modules/gl-vec2/exactEquals.js":[function(require,module,exports) {
module.exports = exactEquals

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1]
}

},{}],"../../../node_modules/gl-vec2/add.js":[function(require,module,exports) {
module.exports = add

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/subtract.js":[function(require,module,exports) {
module.exports = subtract

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function subtract(out, a, b) {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/sub.js":[function(require,module,exports) {
module.exports = require('./subtract')

},{"./subtract":"../../../node_modules/gl-vec2/subtract.js"}],"../../../node_modules/gl-vec2/multiply.js":[function(require,module,exports) {
module.exports = multiply

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function multiply(out, a, b) {
    out[0] = a[0] * b[0]
    out[1] = a[1] * b[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/mul.js":[function(require,module,exports) {
module.exports = require('./multiply')

},{"./multiply":"../../../node_modules/gl-vec2/multiply.js"}],"../../../node_modules/gl-vec2/divide.js":[function(require,module,exports) {
module.exports = divide

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function divide(out, a, b) {
    out[0] = a[0] / b[0]
    out[1] = a[1] / b[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/div.js":[function(require,module,exports) {
module.exports = require('./divide')

},{"./divide":"../../../node_modules/gl-vec2/divide.js"}],"../../../node_modules/gl-vec2/inverse.js":[function(require,module,exports) {
module.exports = inverse

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0]
  out[1] = 1.0 / a[1]
  return out
}

},{}],"../../../node_modules/gl-vec2/min.js":[function(require,module,exports) {
module.exports = min

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function min(out, a, b) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    return out
}
},{}],"../../../node_modules/gl-vec2/max.js":[function(require,module,exports) {
module.exports = max

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function max(out, a, b) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    return out
}
},{}],"../../../node_modules/gl-vec2/rotate.js":[function(require,module,exports) {
module.exports = rotate

/**
 * Rotates a vec2 by an angle
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to rotate
 * @param {Number} angle the angle of rotation (in radians)
 * @returns {vec2} out
 */
function rotate(out, a, angle) {
  var c = Math.cos(angle),
      s = Math.sin(angle)
  var x = a[0],
      y = a[1]

  out[0] = x * c - y * s
  out[1] = x * s + y * c

  return out
}


},{}],"../../../node_modules/gl-vec2/floor.js":[function(require,module,exports) {
module.exports = floor

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0])
  out[1] = Math.floor(a[1])
  return out
}

},{}],"../../../node_modules/gl-vec2/ceil.js":[function(require,module,exports) {
module.exports = ceil

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0])
  out[1] = Math.ceil(a[1])
  return out
}

},{}],"../../../node_modules/gl-vec2/round.js":[function(require,module,exports) {
module.exports = round

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
function round(out, a) {
  out[0] = Math.round(a[0])
  out[1] = Math.round(a[1])
  return out
}

},{}],"../../../node_modules/gl-vec2/scale.js":[function(require,module,exports) {
module.exports = scale

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b
    out[1] = a[1] * b
    return out
}
},{}],"../../../node_modules/gl-vec2/scaleAndAdd.js":[function(require,module,exports) {
module.exports = scaleAndAdd

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale)
    out[1] = a[1] + (b[1] * scale)
    return out
}
},{}],"../../../node_modules/gl-vec2/distance.js":[function(require,module,exports) {
module.exports = distance

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1]
    return Math.sqrt(x*x + y*y)
}
},{}],"../../../node_modules/gl-vec2/dist.js":[function(require,module,exports) {
module.exports = require('./distance')

},{"./distance":"../../../node_modules/gl-vec2/distance.js"}],"../../../node_modules/gl-vec2/squaredDistance.js":[function(require,module,exports) {
module.exports = squaredDistance

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1]
    return x*x + y*y
}
},{}],"../../../node_modules/gl-vec2/sqrDist.js":[function(require,module,exports) {
module.exports = require('./squaredDistance')

},{"./squaredDistance":"../../../node_modules/gl-vec2/squaredDistance.js"}],"../../../node_modules/gl-vec2/length.js":[function(require,module,exports) {
module.exports = length

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0],
        y = a[1]
    return Math.sqrt(x*x + y*y)
}
},{}],"../../../node_modules/gl-vec2/len.js":[function(require,module,exports) {
module.exports = require('./length')

},{"./length":"../../../node_modules/gl-vec2/length.js"}],"../../../node_modules/gl-vec2/squaredLength.js":[function(require,module,exports) {
module.exports = squaredLength

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    var x = a[0],
        y = a[1]
    return x*x + y*y
}
},{}],"../../../node_modules/gl-vec2/sqrLen.js":[function(require,module,exports) {
module.exports = require('./squaredLength')

},{"./squaredLength":"../../../node_modules/gl-vec2/squaredLength.js"}],"../../../node_modules/gl-vec2/negate.js":[function(require,module,exports) {
module.exports = negate

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
function negate(out, a) {
    out[0] = -a[0]
    out[1] = -a[1]
    return out
}
},{}],"../../../node_modules/gl-vec2/normalize.js":[function(require,module,exports) {
module.exports = normalize

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
function normalize(out, a) {
    var x = a[0],
        y = a[1]
    var len = x*x + y*y
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len)
        out[0] = a[0] * len
        out[1] = a[1] * len
    }
    return out
}
},{}],"../../../node_modules/gl-vec2/dot.js":[function(require,module,exports) {
module.exports = dot

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1]
}
},{}],"../../../node_modules/gl-vec2/cross.js":[function(require,module,exports) {
module.exports = cross

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0]
    out[0] = out[1] = 0
    out[2] = z
    return out
}
},{}],"../../../node_modules/gl-vec2/lerp.js":[function(require,module,exports) {
module.exports = lerp

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
function lerp(out, a, b, t) {
    var ax = a[0],
        ay = a[1]
    out[0] = ax + t * (b[0] - ax)
    out[1] = ay + t * (b[1] - ay)
    return out
}
},{}],"../../../node_modules/gl-vec2/random.js":[function(require,module,exports) {
module.exports = random

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
function random(out, scale) {
    scale = scale || 1.0
    var r = Math.random() * 2.0 * Math.PI
    out[0] = Math.cos(r) * scale
    out[1] = Math.sin(r) * scale
    return out
}
},{}],"../../../node_modules/gl-vec2/transformMat2.js":[function(require,module,exports) {
module.exports = transformMat2

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2(out, a, m) {
    var x = a[0],
        y = a[1]
    out[0] = m[0] * x + m[2] * y
    out[1] = m[1] * x + m[3] * y
    return out
}
},{}],"../../../node_modules/gl-vec2/transformMat2d.js":[function(require,module,exports) {
module.exports = transformMat2d

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2d(out, a, m) {
    var x = a[0],
        y = a[1]
    out[0] = m[0] * x + m[2] * y + m[4]
    out[1] = m[1] * x + m[3] * y + m[5]
    return out
}
},{}],"../../../node_modules/gl-vec2/transformMat3.js":[function(require,module,exports) {
module.exports = transformMat3

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat3(out, a, m) {
    var x = a[0],
        y = a[1]
    out[0] = m[0] * x + m[3] * y + m[6]
    out[1] = m[1] * x + m[4] * y + m[7]
    return out
}
},{}],"../../../node_modules/gl-vec2/transformMat4.js":[function(require,module,exports) {
module.exports = transformMat4

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat4(out, a, m) {
    var x = a[0], 
        y = a[1]
    out[0] = m[0] * x + m[4] * y + m[12]
    out[1] = m[1] * x + m[5] * y + m[13]
    return out
}
},{}],"../../../node_modules/gl-vec2/forEach.js":[function(require,module,exports) {
module.exports = forEach

var vec = require('./create')()

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
function forEach(a, stride, offset, count, fn, arg) {
    var i, l
    if(!stride) {
        stride = 2
    }

    if(!offset) {
        offset = 0
    }
    
    if(count) {
        l = Math.min((count * stride) + offset, a.length)
    } else {
        l = a.length
    }

    for(i = offset; i < l; i += stride) {
        vec[0] = a[i]
        vec[1] = a[i+1]
        fn(vec, vec, arg)
        a[i] = vec[0]
        a[i+1] = vec[1]
    }
    
    return a
}
},{"./create":"../../../node_modules/gl-vec2/create.js"}],"../../../node_modules/gl-vec2/limit.js":[function(require,module,exports) {
module.exports = limit;

/**
 * Limit the magnitude of this vector to the value used for the `max`
 * parameter.
 *
 * @param  {vec2} the vector to limit
 * @param  {Number} max the maximum magnitude for the vector
 * @returns {vec2} out
 */
function limit(out, a, max) {
  var mSq = a[0] * a[0] + a[1] * a[1];

  if (mSq > max * max) {
    var n = Math.sqrt(mSq);
    out[0] = a[0] / n * max;
    out[1] = a[1] / n * max;
  } else {
    out[0] = a[0];
    out[1] = a[1];
  }

  return out;
}

},{}],"../../../node_modules/gl-vec2/index.js":[function(require,module,exports) {
module.exports = {
  EPSILON: require('./epsilon')
  , create: require('./create')
  , clone: require('./clone')
  , fromValues: require('./fromValues')
  , copy: require('./copy')
  , set: require('./set')
  , equals: require('./equals')
  , exactEquals: require('./exactEquals')
  , add: require('./add')
  , subtract: require('./subtract')
  , sub: require('./sub')
  , multiply: require('./multiply')
  , mul: require('./mul')
  , divide: require('./divide')
  , div: require('./div')
  , inverse: require('./inverse')
  , min: require('./min')
  , max: require('./max')
  , rotate: require('./rotate')
  , floor: require('./floor')
  , ceil: require('./ceil')
  , round: require('./round')
  , scale: require('./scale')
  , scaleAndAdd: require('./scaleAndAdd')
  , distance: require('./distance')
  , dist: require('./dist')
  , squaredDistance: require('./squaredDistance')
  , sqrDist: require('./sqrDist')
  , length: require('./length')
  , len: require('./len')
  , squaredLength: require('./squaredLength')
  , sqrLen: require('./sqrLen')
  , negate: require('./negate')
  , normalize: require('./normalize')
  , dot: require('./dot')
  , cross: require('./cross')
  , lerp: require('./lerp')
  , random: require('./random')
  , transformMat2: require('./transformMat2')
  , transformMat2d: require('./transformMat2d')
  , transformMat3: require('./transformMat3')
  , transformMat4: require('./transformMat4')
  , forEach: require('./forEach')
  , limit: require('./limit')
}

},{"./epsilon":"../../../node_modules/gl-vec2/epsilon.js","./create":"../../../node_modules/gl-vec2/create.js","./clone":"../../../node_modules/gl-vec2/clone.js","./fromValues":"../../../node_modules/gl-vec2/fromValues.js","./copy":"../../../node_modules/gl-vec2/copy.js","./set":"../../../node_modules/gl-vec2/set.js","./equals":"../../../node_modules/gl-vec2/equals.js","./exactEquals":"../../../node_modules/gl-vec2/exactEquals.js","./add":"../../../node_modules/gl-vec2/add.js","./subtract":"../../../node_modules/gl-vec2/subtract.js","./sub":"../../../node_modules/gl-vec2/sub.js","./multiply":"../../../node_modules/gl-vec2/multiply.js","./mul":"../../../node_modules/gl-vec2/mul.js","./divide":"../../../node_modules/gl-vec2/divide.js","./div":"../../../node_modules/gl-vec2/div.js","./inverse":"../../../node_modules/gl-vec2/inverse.js","./min":"../../../node_modules/gl-vec2/min.js","./max":"../../../node_modules/gl-vec2/max.js","./rotate":"../../../node_modules/gl-vec2/rotate.js","./floor":"../../../node_modules/gl-vec2/floor.js","./ceil":"../../../node_modules/gl-vec2/ceil.js","./round":"../../../node_modules/gl-vec2/round.js","./scale":"../../../node_modules/gl-vec2/scale.js","./scaleAndAdd":"../../../node_modules/gl-vec2/scaleAndAdd.js","./distance":"../../../node_modules/gl-vec2/distance.js","./dist":"../../../node_modules/gl-vec2/dist.js","./squaredDistance":"../../../node_modules/gl-vec2/squaredDistance.js","./sqrDist":"../../../node_modules/gl-vec2/sqrDist.js","./length":"../../../node_modules/gl-vec2/length.js","./len":"../../../node_modules/gl-vec2/len.js","./squaredLength":"../../../node_modules/gl-vec2/squaredLength.js","./sqrLen":"../../../node_modules/gl-vec2/sqrLen.js","./negate":"../../../node_modules/gl-vec2/negate.js","./normalize":"../../../node_modules/gl-vec2/normalize.js","./dot":"../../../node_modules/gl-vec2/dot.js","./cross":"../../../node_modules/gl-vec2/cross.js","./lerp":"../../../node_modules/gl-vec2/lerp.js","./random":"../../../node_modules/gl-vec2/random.js","./transformMat2":"../../../node_modules/gl-vec2/transformMat2.js","./transformMat2d":"../../../node_modules/gl-vec2/transformMat2d.js","./transformMat3":"../../../node_modules/gl-vec2/transformMat3.js","./transformMat4":"../../../node_modules/gl-vec2/transformMat4.js","./forEach":"../../../node_modules/gl-vec2/forEach.js","./limit":"../../../node_modules/gl-vec2/limit.js"}],"../../../node_modules/@tstackgl/geometry/dist/calc/pivot.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_vec2_1 = __importDefault(require("gl-vec2"));
function scaleAroundCenter2(out, input, center, scale) {
    out[0] = (input[0] - center[0]) * scale + center[0];
    out[1] = (input[1] - center[1]) * scale + center[1];
    return out;
}
exports.scaleAroundCenter2 = scaleAroundCenter2;
function rotateAroundCenter2(out, input, center, angle) {
    gl_vec2_1.default.sub(out, input, center);
    gl_vec2_1.default.rotate(out, out, angle);
    gl_vec2_1.default.add(out, out, center);
    return out;
}
exports.rotateAroundCenter2 = rotateAroundCenter2;
function scaleAroundCenter3(out, input, center, scale) {
    out[0] = (input[0] - center[0]) * scale + center[0];
    out[1] = (input[1] - center[1]) * scale + center[1];
    out[2] = (input[2] - center[2]) * scale + center[2];
    return out;
}
exports.scaleAroundCenter3 = scaleAroundCenter3;

},{"gl-vec2":"../../../node_modules/gl-vec2/index.js"}],"../../../node_modules/@thi.ng/transducers/func/compr.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Reducer composition helper. Takes existing reducer `rfn` (a 3-tuple)
 * and a reducing function `fn`. Returns a new reducer tuple of this
 * form:
 *
 * ```
 * [rfn[0], rfn[1], fn]
 * ```
 *
 * `rfn[2]` reduces values of type `B` into an accumulator of type `A`.
 * `fn` accepts values of type `C` and produces interim results of type
 * `B`, which are then (possibly) passed to the "inner" `rfn[2]`
 * function. Therefore the resulting reducer takes inputs of `C` and an
 * accumulator of type `A`.
 *
 * It is assumed that `fn` internally calls `rfn[2]` to pass its own
 * results for further processing by the nested reducer `rfn`.
 *
 * @param rfn
 * @param fn
 */
function compR(rfn, fn) {
    return [rfn[0], rfn[1], fn];
}
exports.compR = compR;

},{}],"../../../node_modules/@thi.ng/transducers/xform/map.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function map(fn, src) {
    return src ?
        iterator_1.iterator1(map(fn), src) :
        (rfn) => {
            const r = rfn[2];
            return compr_1.compR(rfn, (acc, x) => r(acc, fn(x)));
        };
}
exports.map = map;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/transduce.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arity_1 = require("@thi.ng/errors/illegal-arity");
const reduce_1 = require("./reduce");
const map_1 = require("./xform/map");
function transduce(...args) {
    let acc, xs;
    switch (args.length) {
        case 4:
            xs = args[3];
            acc = args[2];
            break;
        case 3:
            xs = args[2];
            break;
        case 2:
            return map_1.map((x) => transduce(args[0], args[1], x));
        default:
            illegal_arity_1.illegalArity(args.length);
    }
    return reduce_1.reduce(args[0](args[1]), acc, xs);
}
exports.transduce = transduce;

},{"@thi.ng/errors/illegal-arity":"../../../node_modules/@thi.ng/errors/illegal-arity.js","./reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","./xform/map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/run.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transduce_1 = require("./transduce");
const nop = () => { };
function run(tx, ...args) {
    if (args.length === 1) {
        transduce_1.transduce(tx, [nop, nop, nop], args[0]);
    }
    else {
        const fx = args[0];
        transduce_1.transduce(tx, [nop, nop, (_, x) => fx(x)], args[1]);
    }
}
exports.run = run;

},{"./transduce":"../../../node_modules/@thi.ng/transducers/transduce.js"}],"../../../node_modules/@thi.ng/transducers/step.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduced_1 = require("./reduced");
const push_1 = require("./rfn/push");
/**
 * Single-step transducer execution wrapper.
 * Returns array if transducer produces multiple results
 * and undefined if there was no output. Else returns single
 * result value.
 *
 * Likewise, once a transducer has produced a final / reduced
 * value, all further invocations of the stepper function will
 * return undefined.
 *
 * ```
 * // single result
 * step(map(x => x * 10))(1);
 * // 10
 *
 * // multiple results
 * step(mapcat(x => [x, x + 1, x + 2]))(1)
 * // [ 1, 2, 3 ]
 *
 * // no result
 * f = step(filter(even))
 * f(1); // undefined
 * f(2); // 2
 *
 * // reduced value termination
 * f = step(take(2));
 * f(1); // 1
 * f(1); // 1
 * f(1); // undefined
 * f(1); // undefined
 * ```
 *
 * @param tx
 */
function step(tx) {
    const [_, complete, reduce] = tx(push_1.push());
    _;
    let done = false;
    return (x) => {
        if (!done) {
            let acc = reduce([], x);
            done = reduced_1.isReduced(acc);
            if (done) {
                acc = complete(acc.deref());
            }
            return acc.length === 1 ?
                acc[0] :
                acc.length > 0 ?
                    acc :
                    undefined;
        }
    };
}
exports.step = step;

},{"./reduced":"../../../node_modules/@thi.ng/transducers/reduced.js","./rfn/push":"../../../node_modules/@thi.ng/transducers/rfn/push.js"}],"../../../node_modules/@thi.ng/transducers/rfn/add.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function add(...args) {
    const res = reduce_1.$$reduce(add, args);
    if (res !== undefined) {
        return res;
    }
    const init = args[0] || 0;
    return reduce_1.reducer(() => init, (acc, x) => acc + x);
}
exports.add = add;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/assoc-map.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function assocMap(xs) {
    return xs ?
        reduce_1.reduce(assocMap(), xs) :
        reduce_1.reducer(() => new Map(), (acc, [k, v]) => acc.set(k, v));
}
exports.assocMap = assocMap;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/assoc-obj.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function assocObj(xs) {
    return xs ?
        reduce_1.reduce(assocObj(), xs) :
        reduce_1.reducer(() => new Object(), (acc, [k, v]) => (acc[k] = v, acc));
}
exports.assocObj = assocObj;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/conj.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function conj(xs) {
    return xs ?
        reduce_1.reduce(conj(), xs) :
        reduce_1.reducer(() => new Set(), (acc, x) => acc.add(x));
}
exports.conj = conj;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/count.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function count(...args) {
    const res = reduce_1.$$reduce(count, args);
    if (res !== undefined) {
        return res;
    }
    let offset = args[0] || 0;
    let step = args[1] || 1;
    return reduce_1.reducer(() => offset, (acc, _) => acc + step);
}
exports.count = count;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/div.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function div(init, xs) {
    return xs ?
        reduce_1.reduce(div(init), xs) :
        reduce_1.reducer(() => init, (acc, x) => acc / x);
}
exports.div = div;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/every.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
const reduced_1 = require("../reduced");
function every(...args) {
    const res = reduce_1.$$reduce(every, args);
    if (res !== undefined) {
        return res;
    }
    const pred = args[0];
    return reduce_1.reducer(() => true, pred ?
        (acc, x) => (pred(x) ? acc : reduced_1.reduced(false)) :
        (acc, x) => (x ? acc : reduced_1.reduced(false)));
}
exports.every = every;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/rfn/fill.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function fill(...args) {
    const res = reduce_1.$$reduce(fill, args);
    if (res !== undefined) {
        return res;
    }
    let start = args[0] || 0;
    return reduce_1.reducer(() => [], (acc, x) => (acc[start++] = x, acc));
}
exports.fill = fill;
function fillN(...args) {
    return fill(...args);
}
exports.fillN = fillN;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/func/identity.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function identity(x) { return x; }
exports.identity = identity;

},{}],"../../../node_modules/@thi.ng/transducers/rfn/group-by-map.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("../func/identity");
const reduce_1 = require("../reduce");
const push_1 = require("./push");
function groupByMap(...args) {
    const res = reduce_1.$$reduce(groupByMap, args);
    if (res !== undefined) {
        return res;
    }
    const opts = Object.assign({ key: identity_1.identity, group: push_1.push() }, args[0]);
    const [init, _, reduce] = opts.group;
    _;
    return reduce_1.reducer(() => new Map(), (acc, x) => {
        const k = opts.key(x);
        return acc.set(k, acc.has(k) ?
            reduce(acc.get(k), x) :
            reduce(init(), x));
    });
}
exports.groupByMap = groupByMap;

},{"../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","./push":"../../../node_modules/@thi.ng/transducers/rfn/push.js"}],"../../../node_modules/@thi.ng/transducers/rfn/frequencies.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("../func/identity");
const reduce_1 = require("../reduce");
const count_1 = require("./count");
const group_by_map_1 = require("./group-by-map");
function frequencies(...args) {
    return reduce_1.$$reduce(frequencies, args) ||
        group_by_map_1.groupByMap({ key: args[0] || identity_1.identity, group: count_1.count() });
}
exports.frequencies = frequencies;

},{"../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","./count":"../../../node_modules/@thi.ng/transducers/rfn/count.js","./group-by-map":"../../../node_modules/@thi.ng/transducers/rfn/group-by-map.js"}],"../../../node_modules/@thi.ng/transducers/rfn/group-by-obj.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("../func/identity");
const reduce_1 = require("../reduce");
const push_1 = require("./push");
function groupByObj(...args) {
    const res = reduce_1.$$reduce(groupByObj, args);
    if (res) {
        return res;
    }
    const _opts = Object.assign({ key: identity_1.identity, group: push_1.push() }, args[0]);
    const [_init, _, _reduce] = _opts.group;
    _;
    return reduce_1.reducer(() => ({}), (acc, x) => {
        const k = _opts.key(x);
        acc[k] = acc[k] ?
            _reduce(acc[k], x) :
            _reduce(_init(), x);
        return acc;
    });
}
exports.groupByObj = groupByObj;

},{"../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","./push":"../../../node_modules/@thi.ng/transducers/rfn/push.js"}],"../../../node_modules/@thi.ng/transducers/rfn/group-binary.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const group_by_obj_1 = require("./group-by-obj");
const push_1 = require("./push");
function branchPred(key, b, l, r) {
    return (x) => key(x) & b ? r : l;
}
/**
 * Creates a bottom-up, unbalanced binary tree of desired depth and
 * choice of data structures. Any value can be indexed, as long as a
 * numeric representation (key) can be obtained. This numeric key is
 * produced by the supplied `key` function. IMPORTANT: the returned
 * values MUST be unsigned and less than the provided bit length (i.e.
 * `0 .. (2^bits) - 1` range).
 *
 * By default the tree is constructed using plain objects for branches,
 * with left branches stored as "l" and right ones as "r". The original
 * values are stored at the lowest tree level using a customizable
 * nested reducer. By default leaves are collected in arrays (using the
 * `push()` reducer), but any suitable reducer can be used (e.g.
 * `conj()` to collect values into sets).
 *
 * Index by lowest 4-bits of ID value:
 *
 * ```
 * tree = reduce(
 *   groupBinary(4, x => x.id & 0xf),
 *   [{id: 3}, {id: 8}, {id: 15}, {id: 0}]
 * )
 *
 * tree.l.l.l.l
 * // [ { id: 0 } ]
 * tree.r.r.r.r
 * // [ { id: 15 } ]
 * tree.l.l.r.r
 * // [ { id: 3 } ]
 * ```
 *
 * Collecting as array:
 *
 * ```
 * tree = reduce(
 *   groupBinary(4, identity, ()=>[], push(), 0, 1),
 *   [1,2,3,4,5,6,7]
 * )
 *
 * tree[0][1][0][1] // 0101 == 5 in binary
 * // [ 5 ]
 *
 * tree[0][1][1]    // 011* == branch
 * // [ [ 6 ], [ 7 ] ]
 * ```
 *
 * Using `frequencies` as leaf reducer:
 *
 * ```
 * tree = reduce(
 *   groupBinary(3, (x: string) => x.length, null, frequencies()),
 *   "aa bbb dddd ccccc bbb eeee fff".split(" ")
 * )
 * // [ [ undefined,
 * //     [ Map { 'aa' => 1 },
 * //       Map { 'bbb' => 2, 'fff' => 1 } ] ],
 * //   [ [ Map { 'dddd' => 1, 'eeee' => 1 },
 * //       Map { 'ccccc' => 1 } ] ] ]
 *
 * tree[0][1][1]
 * // Map { 'bbb' => 2, 'fff' => 1 }
 * ```
 *
 * @param bits index range (always from 0)
 * @param key key function
 * @param branch function to create a new branch container (object or
 * array)
 * @param leaf reducer for leaf collection
 * @param left key for storing left branches (e.g. `0` for arrays)
 * @param right key for storing right branches (e.g. `1` for arrays)
 */
function groupBinary(bits, key, branch, leaf, left = "l", right = "r") {
    const init = branch || (() => ({}));
    let rfn = group_by_obj_1.groupByObj({
        key: branchPred(key, 1, left, right),
        group: leaf || push_1.push(),
    });
    for (let i = 2, maxIndex = 1 << bits; i < maxIndex; i <<= 1) {
        rfn = group_by_obj_1.groupByObj({ key: branchPred(key, i, left, right), group: [init, rfn[1], rfn[2]] });
    }
    return [init, rfn[1], rfn[2]];
}
exports.groupBinary = groupBinary;

},{"./group-by-obj":"../../../node_modules/@thi.ng/transducers/rfn/group-by-obj.js","./push":"../../../node_modules/@thi.ng/transducers/rfn/push.js"}],"../../../node_modules/@thi.ng/transducers/rfn/last.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function last(xs) {
    return xs ?
        reduce_1.reduce(last(), xs) :
        reduce_1.reducer(() => undefined, (_, x) => x);
}
exports.last = last;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/compare/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compare(a, b) {
    if (a === b) {
        return 0;
    }
    if (a == null) {
        return b == null ? 0 : -1;
    }
    if (b == null) {
        return a == null ? 0 : 1;
    }
    if (typeof a.compare === "function") {
        return a.compare(b);
    }
    if (typeof b.compare === "function") {
        return -b.compare(a);
    }
    return a < b ? -1 : a > b ? 1 : 0;
}
exports.compare = compare;

},{}],"../../../node_modules/@thi.ng/transducers/rfn/max-compare.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("@thi.ng/compare");
const reduce_1 = require("../reduce");
function maxCompare(...args) {
    const res = reduce_1.$$reduce(maxCompare, args);
    if (res !== undefined) {
        return res;
    }
    const init = args[0];
    const cmp = args[1] || compare_1.compare;
    return reduce_1.reducer(init, (acc, x) => cmp(acc, x) >= 0 ? acc : x);
}
exports.maxCompare = maxCompare;

},{"@thi.ng/compare":"../../../node_modules/@thi.ng/compare/index.js","../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/max.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function max(xs) {
    return xs ?
        reduce_1.reduce(max(), xs) :
        reduce_1.reducer(() => -Infinity, (acc, x) => Math.max(acc, x));
}
exports.max = max;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/mean.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function mean(xs) {
    let n = 0;
    return xs ?
        reduce_1.reduce(mean(), xs) :
        [
            () => 0,
            (acc) => acc / n,
            (acc, x) => (n++, acc + x),
        ];
}
exports.mean = mean;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/min-compare.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("@thi.ng/compare");
const reduce_1 = require("../reduce");
function minCompare(...args) {
    const res = reduce_1.$$reduce(minCompare, args);
    if (res !== undefined) {
        return res;
    }
    const init = args[0];
    const cmp = args[1] || compare_1.compare;
    return reduce_1.reducer(init, (acc, x) => cmp(acc, x) <= 0 ? acc : x);
}
exports.minCompare = minCompare;

},{"@thi.ng/compare":"../../../node_modules/@thi.ng/compare/index.js","../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/min.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function min(xs) {
    return xs ?
        reduce_1.reduce(min(), xs) :
        reduce_1.reducer(() => Infinity, (acc, x) => Math.min(acc, x));
}
exports.min = min;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/mul.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function mul(...args) {
    const res = reduce_1.$$reduce(mul, args);
    if (res !== undefined) {
        return res;
    }
    const init = args[0] || 1;
    return reduce_1.reducer(() => init, (acc, x) => acc * x);
}
exports.mul = mul;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/push-copy.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function pushCopy() {
    return reduce_1.reducer(() => [], (acc, x) => ((acc = acc.slice()).push(x), acc));
}
exports.pushCopy = pushCopy;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/reductions.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
const reduced_1 = require("../reduced");
function reductions(rfn, xs) {
    const [init, complete, _reduce] = rfn;
    return xs ?
        reduce_1.reduce(reductions(rfn), xs) :
        [
            () => [init()],
            (acc) => (acc[acc.length - 1] = complete(acc[acc.length - 1]), acc),
            (acc, x) => {
                const res = _reduce(acc[acc.length - 1], x);
                if (reduced_1.isReduced(res)) {
                    acc.push(res.deref());
                    return reduced_1.reduced(acc);
                }
                acc.push(res);
                return acc;
            }
        ];
}
exports.reductions = reductions;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/rfn/some.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
const reduced_1 = require("../reduced");
function some(...args) {
    const res = reduce_1.$$reduce(some, args);
    if (res !== undefined) {
        return res;
    }
    const pred = args[0];
    return reduce_1.reducer(() => false, pred ?
        (acc, x) => (pred(x) ? reduced_1.reduced(true) : acc) :
        (acc, x) => (x ? reduced_1.reduced(true) : acc));
}
exports.some = some;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/rfn/str.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function str(sep, xs) {
    sep = sep || "";
    let first = true;
    return xs ?
        [...xs].join(sep) :
        reduce_1.reducer(() => "", (acc, x) => (acc = first ? acc + x : acc + sep + x, first = false, acc));
}
exports.str = str;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/rfn/sub.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduce_1 = require("../reduce");
function sub(...args) {
    const res = reduce_1.$$reduce(sub, args);
    if (res !== undefined) {
        return res;
    }
    const init = args[0] || 0;
    return reduce_1.reducer(() => init, (acc, x) => acc - x);
}
exports.sub = sub;

},{"../reduce":"../../../node_modules/@thi.ng/transducers/reduce.js"}],"../../../node_modules/@thi.ng/transducers/xform/base64.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_SAFE = B64_CHARS.substr(0, 62) + "-_";
function base64Decode(src) {
    return src ?
        iterator_1.iterator1(base64Decode(), src) :
        (rfn) => {
            const r = rfn[2];
            let bc = 0, bs = 0;
            return compr_1.compR(rfn, (acc, x) => {
                switch (x) {
                    case "-":
                        x = "+";
                        break;
                    case "_":
                        x = "/";
                        break;
                    case "=":
                        return reduced_1.reduced(acc);
                    default:
                }
                let y = B64_CHARS.indexOf(x);
                bs = bc & 3 ? (bs << 6) + y : y;
                if (bc++ & 3) {
                    acc = r(acc, 255 & bs >> (-2 * bc & 6));
                }
                return acc;
            });
        };
}
exports.base64Decode = base64Decode;
function base64Encode(...args) {
    const iter = iterator_1.$iter(base64Encode, args, iterator_1.iterator);
    if (iter) {
        return [...iter].join("");
    }
    return (([init, complete, reduce]) => {
        let state = 0;
        let b;
        const opts = Object.assign({ safe: false, buffer: 1024 }, args[0]);
        const chars = opts.safe ? B64_SAFE : B64_CHARS;
        const buf = [];
        return [
            init,
            (acc) => {
                switch (state) {
                    case 1:
                        buf.push(chars[b >> 18 & 0x3f], chars[b >> 12 & 0x3f], "=", "=");
                        break;
                    case 2:
                        buf.push(chars[b >> 18 & 0x3f], chars[b >> 12 & 0x3f], chars[b >> 6 & 0x3f], "=");
                        break;
                    default:
                }
                while (buf.length && !reduced_1.isReduced(acc)) {
                    acc = reduce(acc, buf.shift());
                }
                return complete(acc);
            },
            (acc, x) => {
                switch (state) {
                    case 0:
                        state = 1;
                        b = x << 16;
                        break;
                    case 1:
                        state = 2;
                        b += x << 8;
                        break;
                    default:
                        state = 0;
                        b += x;
                        buf.push(chars[b >> 18 & 0x3f], chars[b >> 12 & 0x3f], chars[b >> 6 & 0x3f], chars[b & 0x3f]);
                        if (buf.length >= opts.buffer) {
                            for (let i = 0, n = buf.length; i < n && !reduced_1.isReduced(acc); i++) {
                                acc = reduce(acc, buf[i]);
                            }
                            buf.length = 0;
                        }
                }
                return acc;
            }
        ];
    });
}
exports.base64Encode = base64Encode;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/benchmark.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function benchmark(src) {
    return src ?
        iterator_1.iterator1(benchmark(), src) :
        (rfn) => {
            const r = rfn[2];
            let prev = Date.now();
            return compr_1.compR(rfn, (acc, _) => {
                const t = Date.now();
                const x = t - prev;
                prev = t;
                return r(acc, x);
            });
        };
}
exports.benchmark = benchmark;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/bits.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function bits(...args) {
    return iterator_1.$iter(bits, args, iterator_1.iterator) ||
        ((rfn) => {
            const reduce = rfn[2];
            const size = (args[0] || 8) - 1;
            const msb = args[1] !== false;
            return compr_1.compR(rfn, msb ?
                (acc, x) => {
                    for (let i = size; i >= 0 && !reduced_1.isReduced(acc); i--) {
                        acc = reduce(acc, (x >>> i) & 1);
                    }
                    return acc;
                } :
                (acc, x) => {
                    for (let i = 0; i <= size && !reduced_1.isReduced(acc); i++) {
                        acc = reduce(acc, (x >>> i) & 1);
                    }
                    return acc;
                });
        });
}
exports.bits = bits;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/cat.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const reduced_1 = require("../reduced");
/**
 * Transducer to concatenate iterable values.
 */
function cat() {
    return (rfn) => {
        const r = rfn[2];
        return compr_1.compR(rfn, (acc, x) => {
            if (x) {
                for (let y of x) {
                    acc = r(acc, y);
                    if (reduced_1.isReduced(acc)) {
                        break;
                    }
                }
            }
            return acc;
        });
    };
}
exports.cat = cat;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/iter/range.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduced_1 = require("../reduced");
function range(from, to, step) {
    return new Range(from, to, step);
}
exports.range = range;
;
/**
 * Simple class wrapper around given range interval and implementing
 * `Iterable` and `IReducible` interfaces, the latter is used to
 * accelerate use with `reduce`.
 */
class Range {
    constructor(from, to, step) {
        if (from === undefined) {
            from = 0;
            to = Infinity;
        }
        else if (to === undefined) {
            to = from;
            from = 0;
        }
        step = step === undefined ? (from < to ? 1 : -1) : step;
        this.from = from;
        this.to = to;
        this.step = step;
    }
    *[Symbol.iterator]() {
        const step = this.step;
        const to = this.to;
        let from = this.from;
        if (step > 0) {
            while (from < to) {
                yield from;
                from += step;
            }
        }
        else if (step < 0) {
            while (from > to) {
                yield from;
                from += step;
            }
        }
    }
    $reduce(rfn, acc) {
        const step = this.step;
        if (step > 0) {
            for (let i = this.from, n = this.to; i < n && !reduced_1.isReduced(acc); i += step) {
                acc = rfn(acc, i);
            }
        }
        else {
            for (let i = this.from, n = this.to; i > n && !reduced_1.isReduced(acc); i += step) {
                acc = rfn(acc, i);
            }
        }
        return acc;
    }
}
exports.Range = Range;

},{"../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/iter/range2d.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arity_1 = require("@thi.ng/errors/illegal-arity");
const range_1 = require("./range");
function* range2d(...args) {
    let fromX, toX, fromY, toY, stepX, stepY;
    switch (args.length) {
        case 6:
            stepX = args[4];
            stepY = args[5];
        case 4:
            [fromX, toX, fromY, toY] = args;
            break;
        case 2:
            [toX, toY] = args;
            fromX = fromY = 0;
            break;
        default:
            illegal_arity_1.illegalArity(args.length);
    }
    const rx = range_1.range(fromX, toX, stepX);
    for (let y of range_1.range(fromY, toY, stepY)) {
        for (let x of rx) {
            yield [x, y];
        }
    }
}
exports.range2d = range2d;

},{"@thi.ng/errors/illegal-arity":"../../../node_modules/@thi.ng/errors/illegal-arity.js","./range":"../../../node_modules/@thi.ng/transducers/iter/range.js"}],"../../../node_modules/@thi.ng/transducers/iter/tuples.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* tuples(...src) {
    const iters = src.map((s) => s[Symbol.iterator]());
    while (true) {
        const tuple = [];
        for (let i of iters) {
            let v = i.next();
            if (v.done) {
                return;
            }
            tuple.push(v.value);
        }
        yield tuple;
    }
}
exports.tuples = tuples;

},{}],"../../../node_modules/@thi.ng/transducers/xform/convolve.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const range2d_1 = require("../iter/range2d");
const tuples_1 = require("../iter/tuples");
const iterator_1 = require("../iterator");
const add_1 = require("../rfn/add");
const transduce_1 = require("../transduce");
const map_1 = require("./map");
exports.buildKernel2d = (weights, w, h) => {
    const w2 = w >> 1;
    const h2 = h >> 1;
    return [...tuples_1.tuples(weights, range2d_1.range2d(-w2, w2 + 1, -h2, h2 + 1))];
};
const kernelLookup2d = (src, x, y, width, height, wrap, border) => wrap ?
    ([w, [ox, oy]]) => {
        const xx = x < -ox ? width + ox : x >= width - ox ? ox - 1 : x + ox;
        const yy = y < -oy ? height + oy : y >= height - oy ? oy - 1 : y + oy;
        return w * src[yy * width + xx];
    } :
    ([w, [ox, oy]]) => {
        return (x < -ox || y < -oy || x >= width - ox || y >= height - oy) ?
            border :
            w * src[(y + oy) * width + x + ox];
    };
function convolve2d(opts, _src) {
    if (_src) {
        return iterator_1.iterator1(convolve2d(opts), _src);
    }
    const { src, width, height } = opts;
    const wrap = opts.wrap !== false;
    const border = opts.border || 0;
    let kernel = opts.kernel;
    if (!kernel) {
        if (!(opts.weights && opts.kwidth && opts.kheight)) {
            illegal_arguments_1.illegalArgs(`no kernel or kernel config`);
        }
        kernel = exports.buildKernel2d(opts.weights, opts.kwidth, opts.kheight);
    }
    return map_1.map((p) => transduce_1.transduce(map_1.map(kernelLookup2d(src, p[0], p[1], width, height, wrap, border)), add_1.add(), kernel));
}
exports.convolve2d = convolve2d;

},{"@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","../iter/range2d":"../../../node_modules/@thi.ng/transducers/iter/range2d.js","../iter/tuples":"../../../node_modules/@thi.ng/transducers/iter/tuples.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../rfn/add":"../../../node_modules/@thi.ng/transducers/rfn/add.js","../transduce":"../../../node_modules/@thi.ng/transducers/transduce.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/dedupe.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@thi.ng/api/api");
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function dedupe(...args) {
    return iterator_1.$iter(dedupe, args) ||
        ((rfn) => {
            const r = rfn[2];
            const equiv = args[0];
            let prev = api_1.SEMAPHORE;
            return compr_1.compR(rfn, equiv ?
                (acc, x) => {
                    acc = equiv(prev, x) ? acc : r(acc, x);
                    prev = x;
                    return acc;
                } :
                (acc, x) => {
                    acc = prev === x ? acc : r(acc, x);
                    prev = x;
                    return acc;
                });
        });
}
exports.dedupe = dedupe;

},{"@thi.ng/api/api":"../../../node_modules/@thi.ng/api/api.js","../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/func/delay.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function delay(x, t) {
    return new Promise((resolve) => setTimeout(() => resolve(x), t));
}
exports.delay = delay;

},{}],"../../../node_modules/@thi.ng/transducers/xform/delayed.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("../func/delay");
const map_1 = require("./map");
/**
 * Yields transducer which wraps incoming values in promises, which
 * resolve after specified delay time (in ms).
 *
 * **Only to be used in async contexts and NOT with `transduce`
 * directly.**
 *
 * @param t
 */
function delayed(t) {
    return map_1.map((x) => delay_1.delay(x, t));
}
exports.delayed = delayed;

},{"../func/delay":"../../../node_modules/@thi.ng/transducers/func/delay.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/distinct.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function distinct(...args) {
    return iterator_1.$iter(distinct, args) ||
        ((rfn) => {
            const r = rfn[2];
            const opts = (args[0] || {});
            const key = opts.key;
            const seen = (opts.cache || (() => new Set()))();
            return compr_1.compR(rfn, key ?
                (acc, x) => {
                    const k = key(x);
                    return !seen.has(k) ? (seen.add(k), r(acc, x)) : acc;
                } :
                (acc, x) => !seen.has(x) ? (seen.add(x), r(acc, x)) : acc);
        });
}
exports.distinct = distinct;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/throttle.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function throttle(pred, src) {
    return src ?
        iterator_1.iterator1(throttle(pred), src) :
        (rfn) => {
            const r = rfn[2];
            const _pred = pred();
            return compr_1.compR(rfn, (acc, x) => _pred(x) ? r(acc, x) : acc);
        };
}
exports.throttle = throttle;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/drop-nth.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throttle_1 = require("./throttle");
const iterator_1 = require("../iterator");
function dropNth(n, src) {
    if (src) {
        return iterator_1.iterator1(dropNth(n), src);
    }
    n = Math.max(0, n - 1);
    return throttle_1.throttle(() => {
        let skip = n;
        return () => skip-- > 0 ? true : (skip = n, false);
    });
}
exports.dropNth = dropNth;

},{"./throttle":"../../../node_modules/@thi.ng/transducers/xform/throttle.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/drop-while.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function dropWhile(...args) {
    return iterator_1.$iter(dropWhile, args) ||
        ((rfn) => {
            const r = rfn[2];
            const pred = args[0];
            let ok = true;
            return compr_1.compR(rfn, (acc, x) => (ok = ok && pred(x)) ? acc : r(acc, x));
        });
}
exports.dropWhile = dropWhile;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/drop.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function drop(n, src) {
    return src ?
        iterator_1.iterator1(drop(n), src) :
        (rfn) => {
            const r = rfn[2];
            let m = n;
            return compr_1.compR(rfn, (acc, x) => m > 0 ? (m--, acc) : r(acc, x));
        };
}
exports.drop = drop;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/duplicate.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function duplicate(n = 1, src) {
    return src ?
        iterator_1.iterator(duplicate(n), src) :
        (rfn) => {
            const r = rfn[2];
            return compr_1.compR(rfn, (acc, x) => {
                for (let i = n; i >= 0 && !reduced_1.isReduced(acc); i--) {
                    acc = r(acc, x);
                }
                return acc;
            });
        };
}
exports.duplicate = duplicate;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/filter.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const compr_1 = require("../func/compr");
function filter(pred, src) {
    return src ?
        iterator_1.iterator1(filter(pred), src) :
        (rfn) => {
            const r = rfn[2];
            return compr_1.compR(rfn, (acc, x) => pred(x) ? r(acc, x) : acc);
        };
}
exports.filter = filter;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js"}],"../../../node_modules/@thi.ng/transducers/func/fuzzy-match.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equiv_1 = require("@thi.ng/equiv");
/**
 * Performs a fuzzy search of `query` in `domain` and returns `true` if
 * successful. The optional `eq` predicate can be used to customize item
 * equality checking. Uses @thi.ng/equiv by default.
 *
 * Related transducer: `filterFuzzy()` (/xform/filter-fuzzy.ts)
 *
 * Adapted and generalized from:
 * https://github.com/bevacqua/fufuzzyzzysearch (MIT)
 *
 * @param domain
 * @param query
 * @param eq
 */
function fuzzyMatch(domain, query, eq = equiv_1.equiv) {
    const nd = domain.length;
    const nq = query.length;
    if (nq > nd) {
        return false;
    }
    if (nq === nd) {
        return eq(query, domain);
    }
    next: for (let i = 0, j = 0; i < nq; i++) {
        const q = query[i];
        while (j < nd) {
            if (eq(domain[j++], q)) {
                continue next;
            }
        }
        return false;
    }
    return true;
}
exports.fuzzyMatch = fuzzyMatch;

},{"@thi.ng/equiv":"../../../node_modules/@thi.ng/equiv/index.js"}],"../../../node_modules/@thi.ng/transducers/xform/filter-fuzzy.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fuzzy_match_1 = require("../func/fuzzy-match");
const iterator_1 = require("../iterator");
const filter_1 = require("./filter");
function filterFuzzy(...args) {
    const iter = args.length > 1 && iterator_1.$iter(filterFuzzy, args);
    if (iter) {
        return iter;
    }
    const query = args[0];
    const { key, equiv } = (args[1] || {});
    return filter_1.filter((x) => fuzzy_match_1.fuzzyMatch(key != null ? key(x) : x, query, equiv));
}
exports.filterFuzzy = filterFuzzy;

},{"../func/fuzzy-match":"../../../node_modules/@thi.ng/transducers/func/fuzzy-match.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./filter":"../../../node_modules/@thi.ng/transducers/xform/filter.js"}],"../../../node_modules/@thi.ng/transducers/xform/flatten-with.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function flattenWith(fn, src) {
    return src ?
        iterator_1.iterator(flattenWith(fn), src) :
        (rfn) => {
            const reduce = rfn[2];
            const flatten = (acc, x) => {
                const xx = fn(x);
                if (xx) {
                    for (let y of xx) {
                        acc = flatten(acc, y);
                        if (reduced_1.isReduced(acc)) {
                            break;
                        }
                    }
                    return acc;
                }
                return reduce(acc, x);
            };
            return compr_1.compR(rfn, flatten);
        };
}
exports.flattenWith = flattenWith;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/flatten.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flatten_with_1 = require("./flatten-with");
function flatten(src) {
    return flatten_with_1.flattenWith((x) => x != null && x[Symbol.iterator] && typeof x !== "string" ? x : undefined, src);
}
exports.flatten = flatten;

},{"./flatten-with":"../../../node_modules/@thi.ng/transducers/xform/flatten-with.js"}],"../../../node_modules/@thi.ng/memoize/memoizej.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function memoizeJ(fn, cache) {
    !cache && (cache = {});
    return (...args) => {
        const key = JSON.stringify(args);
        if (key !== undefined) {
            return key in cache ?
                cache[key] :
                (cache[key] = fn.apply(null, args));
        }
        return fn.apply(null, args);
    };
}
exports.memoizeJ = memoizeJ;

},{}],"../../../node_modules/@thi.ng/strings/repeat.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoizej_1 = require("@thi.ng/memoize/memoizej");
/**
 * @param ch character
 * @param n repeat count
 */
exports.repeat = memoizej_1.memoizeJ((ch, n) => ch.repeat(n));

},{"@thi.ng/memoize/memoizej":"../../../node_modules/@thi.ng/memoize/memoizej.js"}],"../../../node_modules/@thi.ng/strings/radix.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoizej_1 = require("@thi.ng/memoize/memoizej");
const repeat_1 = require("./repeat");
/**
 * Returns a `Stringer` which formats given numbers to `radix`, `len`
 * and with optional prefix (not included in `len`).
 *
 * @param radix
 * @param len
 * @param prefix
 */
exports.radix = memoizej_1.memoizeJ((radix, n, prefix = "") => {
    const buf = repeat_1.repeat("0", n);
    return (x) => {
        x = (x >>> 0).toString(radix);
        return prefix + (x.length < n ? buf.substr(x.length) + x : x);
    };
});
/**
 * 8bit binary conversion preset.
 */
exports.B8 = exports.radix(2, 8);
/**
 * 8bit hex conversion preset.
 * Assumes unsigned inputs.
 */
exports.U8 = exports.radix(16, 2);
/**
 * 16bit hex conversion preset.
 * Assumes unsigned inputs.
 */
exports.U16 = exports.radix(16, 4);
/**
 * 24bit hex conversion preset.
 * Assumes unsigned inputs.
 */
exports.U24 = exports.radix(16, 6);
/**
 * 32bit hex conversion preset.
 * Assumes unsigned inputs.
 */
exports.U32 = exports.radix(16, 8);
/**
 * 64bit hex conversion preset (2x 32bit ints)
 * Assumes unsigned inputs.
 */
exports.U64 = (hi, lo) => exports.U32(hi) + exports.U32(lo);

},{"@thi.ng/memoize/memoizej":"../../../node_modules/@thi.ng/memoize/memoizej.js","./repeat":"../../../node_modules/@thi.ng/strings/repeat.js"}],"../../../node_modules/@thi.ng/compose/comp.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arity_1 = require("@thi.ng/errors/illegal-arity");
function comp(...fns) {
    let [a, b, c, d, e, f, g, h, i, j] = fns;
    switch (fns.length) {
        case 0:
            illegal_arity_1.illegalArity(0);
        case 1:
            return a;
        case 2:
            return (...xs) => a(b(...xs));
        case 3:
            return (...xs) => a(b(c(...xs)));
        case 4:
            return (...xs) => a(b(c(d(...xs))));
        case 5:
            return (...xs) => a(b(c(d(e(...xs)))));
        case 6:
            return (...xs) => a(b(c(d(e(f(...xs))))));
        case 7:
            return (...xs) => a(b(c(d(e(f(g(...xs)))))));
        case 8:
            return (...xs) => a(b(c(d(e(f(g(h(...xs))))))));
        case 9:
            return (...xs) => a(b(c(d(e(f(g(h(i(...xs)))))))));
        case 10:
        default:
            const fn = (...xs) => a(b(c(d(e(f(g(h(i(j(...xs))))))))));
            return fns.length === 10 ? fn : compI(fn, ...fns.slice(10));
    }
}
exports.comp = comp;
function compI(...fns) {
    return comp.apply(null, fns.reverse());
}
exports.compI = compI;

},{"@thi.ng/errors/illegal-arity":"../../../node_modules/@thi.ng/errors/illegal-arity.js"}],"../../../node_modules/@thi.ng/transducers/func/comp.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("@thi.ng/compose/comp");
function comp(...fns) {
    return comp_1.comp.apply(null, fns);
}
exports.comp = comp;

},{"@thi.ng/compose/comp":"../../../node_modules/@thi.ng/compose/comp.js"}],"../../../node_modules/@thi.ng/compose/juxt.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function juxt(...fns) {
    const [a, b, c, d, e, f, g, h] = fns;
    switch (fns.length) {
        case 1:
            return (x) => [a(x)];
        case 2:
            return (x) => [a(x), b(x)];
        case 3:
            return (x) => [a(x), b(x), c(x)];
        case 4:
            return (x) => [a(x), b(x), c(x), d(x)];
        case 5:
            return (x) => [a(x), b(x), c(x), d(x), e(x)];
        case 6:
            return (x) => [a(x), b(x), c(x), d(x), e(x), f(x)];
        case 7:
            return (x) => [a(x), b(x), c(x), d(x), e(x), f(x), g(x)];
        case 8:
            return (x) => [a(x), b(x), c(x), d(x), e(x), f(x), g(x), h(x)];
        default:
            return (x) => {
                let res = new Array(fns.length);
                for (let i = fns.length - 1; i >= 0; i--) {
                    res[i] = fns[i](x);
                }
                return res;
            };
    }
}
exports.juxt = juxt;

},{}],"../../../node_modules/@thi.ng/transducers/func/juxt.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("@thi.ng/compose/juxt"));

},{"@thi.ng/compose/juxt":"../../../node_modules/@thi.ng/compose/juxt.js"}],"../../../node_modules/@thi.ng/transducers/xform/map-indexed.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function mapIndexed(...args) {
    return iterator_1.$iter(mapIndexed, args) ||
        ((rfn) => {
            const r = rfn[2];
            const fn = args[0];
            let i = args[1] || 0;
            return compr_1.compR(rfn, (acc, x) => r(acc, fn(i++, x)));
        });
}
exports.mapIndexed = mapIndexed;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/pad-last.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function padLast(n, fill, src) {
    return src ?
        iterator_1.iterator(padLast(n, fill), src) :
        ([init, complete, reduce]) => {
            let m = 0;
            return [
                init,
                (acc) => {
                    let rem = m % n;
                    if (rem > 0) {
                        while (++rem <= n && !reduced_1.isReduced(acc)) {
                            acc = reduce(acc, fill);
                        }
                    }
                    return complete(acc);
                },
                (acc, x) => (m++, reduce(acc, x))
            ];
        };
}
exports.padLast = padLast;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/hex-dump.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const radix_1 = require("@thi.ng/strings/radix");
const comp_1 = require("../func/comp");
const juxt_1 = require("../func/juxt");
const iterator_1 = require("../iterator");
const map_1 = require("./map");
const map_indexed_1 = require("./map-indexed");
const pad_last_1 = require("./pad-last");
const partition_1 = require("./partition");
function hexDump(...args) {
    const iter = iterator_1.$iter(hexDump, args);
    if (iter) {
        return iter;
    }
    const { cols, address } = Object.assign({ cols: 16, address: 0 }, args[0]);
    return comp_1.comp(pad_last_1.padLast(cols, 0), map_1.map(juxt_1.juxt(radix_1.U8, (x) => x > 31 && x < 128 ? String.fromCharCode(x) : ".")), partition_1.partition(cols, true), map_1.map(juxt_1.juxt((x) => x.map((y) => y[0]).join(" "), (x) => x.map((y) => y[1]).join(""))), map_indexed_1.mapIndexed((i, [h, a]) => `${radix_1.U32(address + i * cols)} | ${h} | ${a}`));
}
exports.hexDump = hexDump;

},{"@thi.ng/strings/radix":"../../../node_modules/@thi.ng/strings/radix.js","../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../func/juxt":"../../../node_modules/@thi.ng/transducers/func/juxt.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js","./map-indexed":"../../../node_modules/@thi.ng/transducers/xform/map-indexed.js","./pad-last":"../../../node_modules/@thi.ng/transducers/xform/pad-last.js","./partition":"../../../node_modules/@thi.ng/transducers/xform/partition.js"}],"../../../node_modules/@thi.ng/transducers/xform/indexed.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const map_indexed_1 = require("./map-indexed");
function indexed(...args) {
    const iter = iterator_1.$iter(indexed, args);
    if (iter) {
        return iter;
    }
    const from = args[0] || 0;
    return map_indexed_1.mapIndexed((i, x) => [from + i, x]);
}
exports.indexed = indexed;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map-indexed":"../../../node_modules/@thi.ng/transducers/xform/map-indexed.js"}],"../../../node_modules/@thi.ng/transducers/xform/interleave.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function interleave(sep, src) {
    return src ?
        iterator_1.iterator(interleave(sep), src) :
        (rfn) => {
            const r = rfn[2];
            const _sep = typeof sep === "function" ? sep : () => sep;
            return compr_1.compR(rfn, (acc, x) => {
                acc = r(acc, _sep());
                return reduced_1.isReduced(acc) ? acc : r(acc, x);
            });
        };
}
exports.interleave = interleave;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/interpose.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function interpose(sep, src) {
    return src ?
        iterator_1.iterator(interpose(sep), src) :
        (rfn) => {
            const r = rfn[2];
            const _sep = typeof sep === "function" ? sep : () => sep;
            let first = true;
            return compr_1.compR(rfn, (acc, x) => {
                if (first) {
                    first = false;
                    return r(acc, x);
                }
                acc = r(acc, _sep());
                return reduced_1.isReduced(acc) ? acc : r(acc, x);
            });
        };
}
exports.interpose = interpose;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/keep.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const identity_1 = require("../func/identity");
const iterator_1 = require("../iterator");
function keep(...args) {
    return iterator_1.$iter(keep, args) ||
        ((rfn) => {
            const r = rfn[2];
            const pred = args[0] || identity_1.identity;
            return compr_1.compR(rfn, (acc, x) => pred(x) != null ? r(acc, x) : acc);
        });
}
exports.keep = keep;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/labeled.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_function_1 = require("@thi.ng/checks/is-function");
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function labeled(id, src) {
    return src ?
        iterator_1.iterator1(labeled(id), src) :
        map_1.map(is_function_1.isFunction(id) ?
            (x) => [id(x), x] :
            (x) => [id, x]);
}
exports.labeled = labeled;

},{"@thi.ng/checks/is-function":"../../../node_modules/@thi.ng/checks/is-function.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/func/deep-transform.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_function_1 = require("@thi.ng/checks/is-function");
/**
 * Higher-order deep object transformer. Accepts a nested `spec`
 * array reflecting same key structure as the object to be mapped,
 * but with functions or sub-specs as their values.
 * Returns a new function, which when called, recursively applies
 * nested transformers in post-order traversal (child transformers
 * are run first) and returns the result of the root transformer.
 *
 * The transform specs are given as arrays in this format:
 *
 * ```
 * [tx-function, {key1: [tx-function, {...}], key2: tx-fn}]
 * ```
 *
 * If a key in the spec has no further sub maps, its transform
 * function can be given directly without having to wrap it into
 * the usual array structure.
 *
 * ```
 * // source object to be transformed
 * src = {
 *    meta: {
 *      author: { name: "Alice", email: "a@b.com" },
 *      date: 1041510896000
 *    },
 *    type: "post",
 *    title: "Hello world",
 *    body: "Ratione necessitatibus doloremque itaque."
 * };
 *
 * // deep transformation spec
 * spec = [
 *    // root transform (called last)
 *    ({type, meta, title, body}) => ["div", {class: type}, title, meta, body],
 *    // object of transform sub-specs
 *    {
 *      meta: [
 *        ({author, date}) => ["div.meta", author, `(${date})`],
 *        {
 *          author: ({email, name}) => ["a", {href: `mailto:${email}`}, name],
 *          date: (d) => new Date(d).toLocaleString()
 *        }
 *      ],
 *      title: (title) => ["h1", title]
 *    }
 * ];
 *
 * // build transformer & apply to src
 * deepTransform(spec)(src);
 *
 * // [ "div",
 * //   { class: "article" },
 * //   [ "h1", "Hello world" ],
 * //   [ "div.meta",
 * //     [ "a", { href: "mailto:a@.b.com" }, "Alice" ],
 * //     "(1/2/2003, 12:34:56 PM)" ],
 * //   "Ratione necessitatibus doloremque itaque." ]
 * ```
 *
 * @param spec transformation spec
 */
function deepTransform(spec) {
    if (is_function_1.isFunction(spec)) {
        return spec;
    }
    const mapfns = Object.keys(spec[1] || {}).reduce((acc, k) => (acc[k] = deepTransform(spec[1][k]), acc), {});
    return (x) => {
        const res = Object.assign({}, x);
        for (let k in mapfns) {
            res[k] = mapfns[k](res[k]);
        }
        return spec[0](res);
    };
}
exports.deepTransform = deepTransform;

},{"@thi.ng/checks/is-function":"../../../node_modules/@thi.ng/checks/is-function.js"}],"../../../node_modules/@thi.ng/transducers/xform/map-deep.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deep_transform_1 = require("../func/deep-transform");
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function mapDeep(spec, src) {
    return src ?
        iterator_1.iterator1(mapDeep(spec), src) :
        map_1.map(deep_transform_1.deepTransform(spec));
}
exports.mapDeep = mapDeep;

},{"../func/deep-transform":"../../../node_modules/@thi.ng/transducers/func/deep-transform.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/map-keys.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function mapKeys(...args) {
    const iter = iterator_1.$iter(mapKeys, args);
    if (iter) {
        return iter;
    }
    const keys = args[0];
    const copy = args[1] !== false;
    return map_1.map((x) => {
        const res = copy ? Object.assign({}, x) : x;
        for (let k in keys) {
            res[k] = keys[k](x[k]);
        }
        return res;
    });
}
exports.mapKeys = mapKeys;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/map-nth.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function mapNth(...args) {
    const iter = iterator_1.$iter(mapNth, args);
    if (iter) {
        return iter;
    }
    let n = args[0] - 1, offset, fn;
    if (typeof args[1] === "number") {
        offset = args[1];
        fn = args[2];
    }
    else {
        fn = args[1];
        offset = 0;
    }
    return (rfn) => {
        const r = rfn[2];
        let skip = 0, off = offset;
        return compr_1.compR(rfn, (acc, x) => {
            if (off === 0) {
                if (skip === 0) {
                    skip = n;
                    return r(acc, fn(x));
                }
                skip--;
            }
            else {
                off--;
            }
            return r(acc, x);
        });
    };
}
exports.mapNth = mapNth;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/map-vals.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function mapVals(...args) {
    const iter = iterator_1.$iter(mapVals, args);
    if (iter) {
        return iter;
    }
    const fn = args[0];
    const copy = args[1] !== false;
    return map_1.map((x) => {
        const res = copy ? {} : x;
        for (let k in x) {
            res[k] = fn(x[k]);
        }
        return res;
    });
}
exports.mapVals = mapVals;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/mapcat.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("../func/comp");
const iterator_1 = require("../iterator");
const cat_1 = require("./cat");
const map_1 = require("./map");
function mapcat(fn, src) {
    return src ?
        iterator_1.iterator(mapcat(fn), src) :
        comp_1.comp(map_1.map(fn), cat_1.cat());
}
exports.mapcat = mapcat;

},{"../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./cat":"../../../node_modules/@thi.ng/transducers/xform/cat.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/take.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function take(n, src) {
    return src ?
        iterator_1.iterator(take(n), src) :
        (rfn) => {
            const r = rfn[2];
            let m = n;
            return compr_1.compR(rfn, (acc, x) => --m > 0 ? r(acc, x) :
                m === 0 ? reduced_1.ensureReduced(r(acc, x)) :
                    reduced_1.reduced(acc));
        };
}
exports.take = take;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/match-first.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("../func/comp");
const iterator_1 = require("../iterator");
const filter_1 = require("./filter");
const take_1 = require("./take");
function matchFirst(pred, src) {
    return src ?
        [...iterator_1.iterator1(matchFirst(pred), src)][0] :
        comp_1.comp(filter_1.filter(pred), take_1.take(1));
}
exports.matchFirst = matchFirst;

},{"../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./filter":"../../../node_modules/@thi.ng/transducers/xform/filter.js","./take":"../../../node_modules/@thi.ng/transducers/xform/take.js"}],"../../../node_modules/@thi.ng/transducers/xform/take-last.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function takeLast(n, src) {
    return src ?
        iterator_1.iterator(takeLast(n), src) :
        ([init, complete, reduce]) => {
            const buf = [];
            return [
                init,
                (acc) => {
                    while (buf.length && !reduced_1.isReduced(acc)) {
                        acc = reduce(acc, buf.shift());
                    }
                    return complete(acc);
                },
                (acc, x) => {
                    if (buf.length === n) {
                        buf.shift();
                    }
                    buf.push(x);
                    return acc;
                }
            ];
        };
}
exports.takeLast = takeLast;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/match-last.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("../func/comp");
const iterator_1 = require("../iterator");
const filter_1 = require("./filter");
const take_last_1 = require("./take-last");
function matchLast(pred, src) {
    return src ?
        [...iterator_1.iterator(matchLast(pred), src)][0] :
        comp_1.comp(filter_1.filter(pred), take_last_1.takeLast(1));
}
exports.matchLast = matchLast;

},{"../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./filter":"../../../node_modules/@thi.ng/transducers/xform/filter.js","./take-last":"../../../node_modules/@thi.ng/transducers/xform/take-last.js"}],"../../../node_modules/@thi.ng/transducers/xform/moving-average.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function movingAverage(period, src) {
    return src ?
        iterator_1.iterator1(movingAverage(period), src) :
        (rfn) => {
            period |= 0;
            period < 2 && illegal_arguments_1.illegalArgs("period must be >= 2");
            const reduce = rfn[2];
            const window = [];
            let sum = 0;
            return compr_1.compR(rfn, (acc, x) => {
                const n = window.push(x);
                sum += x;
                n > period && (sum -= window.shift());
                return n >= period ? reduce(acc, sum / period) : acc;
            });
        };
}
exports.movingAverage = movingAverage;
;

},{"@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/moving-median.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("@thi.ng/compare");
const comp_1 = require("../func/comp");
const identity_1 = require("../func/identity");
const iterator_1 = require("../iterator");
const map_1 = require("./map");
const partition_1 = require("./partition");
function movingMedian(...args) {
    const iter = iterator_1.$iter(movingMedian, args);
    if (iter) {
        return iter;
    }
    const { key, compare } = Object.assign({ key: identity_1.identity, compare: compare_1.compare }, args[1]);
    const n = args[0];
    const m = n >> 1;
    return comp_1.comp(partition_1.partition(n, 1, true), map_1.map((window) => window.slice().sort((a, b) => compare(key(a), key(b)))[m]));
}
exports.movingMedian = movingMedian;

},{"@thi.ng/compare":"../../../node_modules/@thi.ng/compare/index.js","../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js","./partition":"../../../node_modules/@thi.ng/transducers/xform/partition.js"}],"../../../node_modules/@thi.ng/transducers/xform/multiplex.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const juxt_1 = require("../func/juxt");
const step_1 = require("../step");
const map_1 = require("./map");
function multiplex(...args) {
    return map_1.map(juxt_1.juxt.apply(null, args.map(step_1.step)));
}
exports.multiplex = multiplex;

},{"../func/juxt":"../../../node_modules/@thi.ng/transducers/func/juxt.js","../step":"../../../node_modules/@thi.ng/transducers/step.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/func/renamer.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function renamer(kmap) {
    const ks = Object.keys(kmap);
    const [a2, b2, c2] = ks;
    const [a1, b1, c1] = ks.map((k) => kmap[k]);
    switch (ks.length) {
        case 3:
            return (x) => {
                const res = {};
                let v;
                v = x[c1], v !== undefined && (res[c2] = v);
                v = x[b1], v !== undefined && (res[b2] = v);
                v = x[a1], v !== undefined && (res[a2] = v);
                return res;
            };
        case 2:
            return (x) => {
                const res = {};
                let v;
                v = x[b1], v !== undefined && (res[b2] = v);
                v = x[a1], v !== undefined && (res[a2] = v);
                return res;
            };
        case 1:
            return (x) => {
                const res = {};
                let v = x[a1];
                v !== undefined && (res[a2] = v);
                return res;
            };
        default:
            return (x) => {
                let k, v;
                const res = {};
                for (let i = ks.length - 1; i >= 0; i--) {
                    k = ks[i], v = x[kmap[k]], v !== undefined && (res[k] = v);
                }
                return res;
            };
    }
}
exports.renamer = renamer;

},{}],"../../../node_modules/@thi.ng/transducers/xform/rename.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_array_1 = require("@thi.ng/checks/is-array");
const comp_1 = require("../func/comp");
const renamer_1 = require("../func/renamer");
const iterator_1 = require("../iterator");
const transduce_1 = require("../transduce");
const filter_1 = require("./filter");
const map_1 = require("./map");
function rename(...args) {
    const iter = args.length > 2 && iterator_1.$iter(rename, args);
    if (iter) {
        return iter;
    }
    let kmap = args[0];
    if (is_array_1.isArray(kmap)) {
        kmap = kmap.reduce((acc, k, i) => (acc[k] = i, acc), {});
    }
    if (args[1]) {
        const ks = Object.keys(kmap);
        return map_1.map((y) => transduce_1.transduce(comp_1.comp(map_1.map((k) => [k, y[kmap[k]]]), filter_1.filter(x => x[1] !== undefined)), args[1], ks));
    }
    else {
        return map_1.map(renamer_1.renamer(kmap));
    }
}
exports.rename = rename;

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../func/renamer":"../../../node_modules/@thi.ng/transducers/func/renamer.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../transduce":"../../../node_modules/@thi.ng/transducers/transduce.js","./filter":"../../../node_modules/@thi.ng/transducers/xform/filter.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/multiplex-obj.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("../func/comp");
const iterator_1 = require("../iterator");
const multiplex_1 = require("./multiplex");
const rename_1 = require("./rename");
function multiplexObj(...args) {
    const iter = iterator_1.$iter(multiplexObj, args);
    if (iter) {
        return iter;
    }
    const [xforms, rfn] = args;
    const ks = Object.keys(xforms);
    return comp_1.comp(multiplex_1.multiplex.apply(null, ks.map((k) => xforms[k])), rename_1.rename(ks, rfn));
}
exports.multiplexObj = multiplexObj;

},{"../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./multiplex":"../../../node_modules/@thi.ng/transducers/xform/multiplex.js","./rename":"../../../node_modules/@thi.ng/transducers/xform/rename.js"}],"../../../node_modules/@thi.ng/transducers/xform/noop.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * No-op / pass-through transducer, essentially the same as:
 * `map(identity)`, but faster. Useful for testing and / or to keep
 * existing values in a `multiplex()` tuple lane.
 */
function noop() {
    return (rfn) => rfn;
}
exports.noop = noop;

},{}],"../../../node_modules/@thi.ng/transducers/xform/page.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("../func/comp");
const iterator_1 = require("../iterator");
const drop_1 = require("./drop");
const take_1 = require("./take");
function page(...args) {
    return iterator_1.$iter(page, args) ||
        comp_1.comp(drop_1.drop(args[0] * (args[1] || 10)), take_1.take(args[1] || 10));
}
exports.page = page;

},{"../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./drop":"../../../node_modules/@thi.ng/transducers/xform/drop.js","./take":"../../../node_modules/@thi.ng/transducers/xform/take.js"}],"../../../node_modules/@thi.ng/transducers/xform/partition-bits.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function partitionBits(...args) {
    return iterator_1.$iter(partitionBits, args, iterator_1.iterator) ||
        ((rfn) => {
            const destSize = args[0];
            const srcSize = args[1] || 8;
            return destSize < srcSize ?
                small(rfn, destSize, srcSize) :
                destSize > srcSize ?
                    large(rfn, destSize, srcSize) :
                    rfn;
        });
}
exports.partitionBits = partitionBits;
const small = ([init, complete, reduce], n, wordSize) => {
    const maxb = wordSize - n;
    const m1 = (1 << wordSize) - 1;
    const m2 = (1 << n) - 1;
    let r = 0;
    let y = 0;
    return [
        init,
        (acc) => complete(r > 0 ? reduce(acc, y) : acc),
        (acc, x) => {
            let b = 0;
            do {
                acc = reduce(acc, y + ((x >>> (maxb + r)) & m2));
                b += n - r;
                x = (x << (n - r)) & m1;
                y = 0;
                r = 0;
            } while (b <= maxb && !reduced_1.isReduced(acc));
            r = wordSize - b;
            y = r > 0 ? (x >>> maxb) & m2 : 0;
            return acc;
        }
    ];
};
const large = ([init, complete, reduce], n, wordSize) => {
    const m1 = (1 << wordSize) - 1;
    let r = 0;
    let y = 0;
    return [
        init,
        (acc) => complete(r > 0 ? reduce(acc, y) : acc),
        (acc, x) => {
            if (r + wordSize <= n) {
                y |= (x & m1) << (n - wordSize - r);
                r += wordSize;
                if (r === n) {
                    acc = reduce(acc, y);
                    y = 0;
                    r = 0;
                }
            }
            else {
                const k = n - r;
                r = wordSize - k;
                acc = reduce(acc, y | ((x >>> r) & ((1 << k) - 1)));
                y = (x & ((1 << r) - 1)) << (n - r);
            }
            return acc;
        }
    ];
};

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/partition-by.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@thi.ng/api/api");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function partitionBy(...args) {
    return iterator_1.$iter(partitionBy, args, iterator_1.iterator) ||
        (([init, complete, reduce]) => {
            const fn = args[0];
            const f = args[1] === true ? fn() : fn;
            let prev = api_1.SEMAPHORE, chunk;
            return [
                init,
                (acc) => {
                    if (chunk && chunk.length) {
                        acc = reduce(acc, chunk);
                        chunk = null;
                    }
                    return complete(acc);
                },
                (acc, x) => {
                    const curr = f(x);
                    if (prev === api_1.SEMAPHORE) {
                        prev = curr;
                        chunk = [x];
                    }
                    else if (curr === prev) {
                        chunk.push(x);
                    }
                    else {
                        chunk && (acc = reduce(acc, chunk));
                        chunk = reduced_1.isReduced(acc) ? null : [x];
                        prev = curr;
                    }
                    return acc;
                }
            ];
        });
}
exports.partitionBy = partitionBy;

},{"@thi.ng/api/api":"../../../node_modules/@thi.ng/api/api.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/partition-of.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const partition_by_1 = require("./partition-by");
function partitionOf(sizes, src) {
    return src ?
        iterator_1.iterator(partitionOf(sizes), src) :
        partition_by_1.partitionBy(() => {
            let i = 0, j = 0;
            return () => {
                if (i++ === sizes[j]) {
                    i = 1;
                    j = (j + 1) % sizes.length;
                }
                return j;
            };
        }, true);
}
exports.partitionOf = partitionOf;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./partition-by":"../../../node_modules/@thi.ng/transducers/xform/partition-by.js"}],"../../../node_modules/@thi.ng/transducers/xform/partition-sort.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("@thi.ng/compare");
const comp_1 = require("../func/comp");
const identity_1 = require("../func/identity");
const iterator_1 = require("../iterator");
const mapcat_1 = require("./mapcat");
const partition_1 = require("./partition");
function partitionSort(...args) {
    const iter = iterator_1.$iter(partitionSort, args, iterator_1.iterator);
    if (iter) {
        return iter;
    }
    const { key, compare } = Object.assign({ key: identity_1.identity, compare: compare_1.compare }, args[1]);
    return comp_1.comp(partition_1.partition(args[0], true), mapcat_1.mapcat((window) => window.slice().sort((a, b) => compare(key(a), key(b)))));
}
exports.partitionSort = partitionSort;

},{"@thi.ng/compare":"../../../node_modules/@thi.ng/compare/index.js","../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./mapcat":"../../../node_modules/@thi.ng/transducers/xform/mapcat.js","./partition":"../../../node_modules/@thi.ng/transducers/xform/partition.js"}],"../../../node_modules/@thi.ng/transducers/xform/partition-sync.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_array_1 = require("@thi.ng/checks/is-array");
const identity_1 = require("../func/identity");
const iterator_1 = require("../iterator");
function partitionSync(...args) {
    return iterator_1.$iter(partitionSync, args, iterator_1.iterator) ||
        (([init, complete, reduce]) => {
            let curr = {};
            let first = true;
            const currKeys = new Set();
            const { key, mergeOnly, reset, all } = Object.assign({ key: identity_1.identity, mergeOnly: false, reset: true, all: true }, args[1]);
            const ks = is_array_1.isArray(args[0]) ? new Set(args[0]) : args[0];
            return [
                init,
                (acc) => {
                    if ((reset && all && currKeys.size > 0) || (!reset && first)) {
                        acc = reduce(acc, curr);
                        curr = undefined;
                        currKeys.clear();
                        first = false;
                    }
                    return complete(acc);
                },
                (acc, x) => {
                    const k = key(x);
                    if (ks.has(k)) {
                        curr[k] = x;
                        currKeys.add(k);
                        if (mergeOnly || currKeys.size >= ks.size) {
                            acc = reduce(acc, curr);
                            first = false;
                            if (reset) {
                                curr = {};
                                currKeys.clear();
                            }
                            else {
                                curr = Object.assign({}, curr);
                            }
                        }
                    }
                    return acc;
                }
            ];
        });
}
exports.partitionSync = partitionSync;

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/pluck.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function pluck(key, src) {
    return src ?
        iterator_1.iterator1(pluck(key), src) :
        map_1.map((x) => x[key]);
}
exports.pluck = pluck;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/sample.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function sample(prob, src) {
    return src ?
        iterator_1.iterator1(sample(prob), src) :
        (rfn) => {
            const r = rfn[2];
            return compr_1.compR(rfn, (acc, x) => Math.random() < prob ? r(acc, x) : acc);
        };
}
exports.sample = sample;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/xform/scan.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function scan(...args) {
    return (args.length > 2 && iterator_1.$iter(scan, args, iterator_1.iterator)) ||
        (([inito, completeo, reduceo]) => {
            const [initi, completei, reducei] = args[0];
            let acc = args.length > 1 && args[1] != null ? args[1] : initi();
            return [
                inito,
                (_acc) => {
                    let a = completei(acc);
                    if (a !== acc) {
                        _acc = reduced_1.unreduced(reduceo(_acc, a));
                    }
                    acc = a;
                    return completeo(_acc);
                },
                (_acc, x) => {
                    acc = reducei(acc, x);
                    if (reduced_1.isReduced(acc)) {
                        return reduced_1.ensureReduced(reduceo(_acc, acc.deref()));
                    }
                    return reduceo(_acc, acc);
                }
            ];
        });
}
exports.scan = scan;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/func/key-selector.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renamer_1 = require("./renamer");
function keySelector(keys) {
    return renamer_1.renamer(keys.reduce((acc, x) => (acc[x] = x, acc), {}));
}
exports.keySelector = keySelector;

},{"./renamer":"../../../node_modules/@thi.ng/transducers/func/renamer.js"}],"../../../node_modules/@thi.ng/transducers/xform/select-keys.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_selector_1 = require("../func/key-selector");
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function selectKeys(keys, src) {
    return src ?
        iterator_1.iterator1(selectKeys(keys), src) :
        map_1.map(key_selector_1.keySelector(keys));
}
exports.selectKeys = selectKeys;

},{"../func/key-selector":"../../../node_modules/@thi.ng/transducers/func/key-selector.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/side-effect.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./map");
/**
 * Helper transducer. Applies given `fn` to each input value, presumably
 * for side effects. Discards function's result and yields original
 * inputs.
 *
 * @param fn side effect
 */
function sideEffect(fn) {
    return map_1.map((x) => (fn(x), x));
}
exports.sideEffect = sideEffect;

},{"./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/sliding-window.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
function slidingWindow(...args) {
    const iter = iterator_1.$iter(slidingWindow, args);
    if (iter) {
        return iter;
    }
    const size = args[0];
    const partial = args[1] !== false;
    return (rfn) => {
        const reduce = rfn[2];
        let buf = [];
        return compr_1.compR(rfn, (acc, x) => {
            buf.push(x);
            if (partial || buf.length === size) {
                acc = reduce(acc, buf);
                buf = buf.slice(buf.length === size ? 1 : 0);
            }
            return acc;
        });
    };
}
exports.slidingWindow = slidingWindow;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js"}],"../../../node_modules/@thi.ng/transducers/func/shuffle.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shuffleN(buf, n) {
    const l = buf.length;
    n = n < l ? n : l;
    while (--n >= 0) {
        const a = (Math.random() * l) | 0;
        const b = (Math.random() * l) | 0;
        const t = buf[a];
        buf[a] = buf[b];
        buf[b] = t;
    }
}
exports.shuffleN = shuffleN;

},{}],"../../../node_modules/@thi.ng/transducers/xform/stream-shuffle.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shuffle_1 = require("../func/shuffle");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function streamShuffle(...args) {
    return iterator_1.$iter(streamShuffle, args, iterator_1.iterator) ||
        (([init, complete, reduce]) => {
            const n = args[0];
            const maxSwaps = args[1] || n;
            const buf = [];
            return [
                init,
                (acc) => {
                    while (buf.length && !reduced_1.isReduced(acc)) {
                        shuffle_1.shuffleN(buf, maxSwaps);
                        acc = reduce(acc, buf.shift());
                    }
                    acc = complete(acc);
                    return acc;
                },
                (acc, x) => {
                    buf.push(x);
                    shuffle_1.shuffleN(buf, maxSwaps);
                    if (buf.length === n) {
                        acc = reduce(acc, buf.shift());
                    }
                    return acc;
                }
            ];
        });
}
exports.streamShuffle = streamShuffle;

},{"../func/shuffle":"../../../node_modules/@thi.ng/transducers/func/shuffle.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/func/binary-search.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the supposed index of `x` in pre-sorted array-like collection
 * `arr`. The `key` function first is used to obtain the actual sort
 * value of `x` and each array item. The `cmp` comparator is then used to
 * identify the index of `x`.
 *
 * @param arr
 * @param key
 * @param cmp
 * @param x
 * @returns index of `x`, else `-index` if item could not be found
 */
function binarySearch(arr, key, cmp, x) {
    const kx = key(x);
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const c = cmp(key(arr[mid]), kx);
        if (c < 0) {
            low = mid + 1;
        }
        else if (c > 0) {
            high = mid - 1;
        }
        else {
            return mid;
        }
    }
    return -low;
}
exports.binarySearch = binarySearch;

},{}],"../../../node_modules/@thi.ng/transducers/xform/stream-sort.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("@thi.ng/compare");
const binary_search_1 = require("../func/binary-search");
const identity_1 = require("../func/identity");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function streamSort(...args) {
    const iter = iterator_1.$iter(streamSort, args, iterator_1.iterator);
    if (iter) {
        return iter;
    }
    const { key, compare } = Object.assign({ key: identity_1.identity, compare: compare_1.compare }, args[1]);
    const n = args[0];
    return ([init, complete, reduce]) => {
        const buf = [];
        return [
            init,
            (acc) => {
                while (buf.length && !reduced_1.isReduced(acc)) {
                    acc = reduce(acc, buf.shift());
                }
                return complete(acc);
            },
            (acc, x) => {
                const idx = binary_search_1.binarySearch(buf, key, compare, x);
                buf.splice(Math.abs(idx), 0, x);
                if (buf.length === n) {
                    acc = reduce(acc, buf.shift());
                }
                return acc;
            }
        ];
    };
}
exports.streamSort = streamSort;

},{"@thi.ng/compare":"../../../node_modules/@thi.ng/compare/index.js","../func/binary-search":"../../../node_modules/@thi.ng/transducers/func/binary-search.js","../func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/struct.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comp_1 = require("../func/comp");
const iterator_1 = require("../iterator");
const map_keys_1 = require("./map-keys");
const partition_1 = require("./partition");
const partition_of_1 = require("./partition-of");
const rename_1 = require("./rename");
function struct(fields, src) {
    return src ?
        iterator_1.iterator(struct(fields), src) :
        comp_1.comp(partition_of_1.partitionOf(fields.map((f) => f[1])), partition_1.partition(fields.length), rename_1.rename(fields.map((f) => f[0])), map_keys_1.mapKeys(fields.reduce((acc, f) => (f[2] ? (acc[f[0]] = f[2], acc) : acc), {}), false));
}
exports.struct = struct;

},{"../func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map-keys":"../../../node_modules/@thi.ng/transducers/xform/map-keys.js","./partition":"../../../node_modules/@thi.ng/transducers/xform/partition.js","./partition-of":"../../../node_modules/@thi.ng/transducers/xform/partition-of.js","./rename":"../../../node_modules/@thi.ng/transducers/xform/rename.js"}],"../../../node_modules/@thi.ng/transducers/func/swizzler.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns optimized function to select, repeat, reshape and / or
 * reorder array/object values in the specified index order. The
 * returned function can be used directly or as mapping function for the
 * `map` transducer. Fast paths for up to 8 indices are provided, before
 * a loop based approach is used.
 *
 * ```
 * swizzler([0, 0, 0])([1, 2, 3, 4])    // [ 1, 1, 1 ]
 * swizzler([1, 1, 3, 3])([1, 2, 3, 4]) // [ 2, 2, 4, 4 ]
 * swizzler([2, 0])([1, 2, 3])          // [ 3, 1 ]
 * ```
 *
 * Even though, objects can be used as input to the generated function,
 * the returned values will always be in array form.
 *
 * ```
 * swizzler(["a", "c", "b"])({a: 1, b: 2, c: 3}) // [ 1, 3, 2 ]
 * ```
 *
 * @param order indices
 */
function swizzler(order) {
    const [a, b, c, d, e, f, g, h] = order;
    switch (order.length) {
        case 0:
            return () => [];
        case 1:
            return (x) => [x[a]];
        case 2:
            return (x) => [x[a], x[b]];
        case 3:
            return (x) => [x[a], x[b], x[c]];
        case 4:
            return (x) => [x[a], x[b], x[c], x[d]];
        case 5:
            return (x) => [x[a], x[b], x[c], x[d], x[e]];
        case 6:
            return (x) => [x[a], x[b], x[c], x[d], x[e], x[f]];
        case 7:
            return (x) => [x[a], x[b], x[c], x[d], x[e], x[f], x[g]];
        case 8:
            return (x) => [x[a], x[b], x[c], x[d], x[e], x[f], x[g], x[h]];
        default:
            return (x) => {
                const res = [];
                for (let i = order.length - 1; i >= 0; i--) {
                    res[i] = x[order[i]];
                }
                return res;
            };
    }
}
exports.swizzler = swizzler;

},{}],"../../../node_modules/@thi.ng/transducers/xform/swizzle.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swizzler_1 = require("../func/swizzler");
const iterator_1 = require("../iterator");
const map_1 = require("./map");
function swizzle(order, src) {
    return src ?
        iterator_1.iterator1(swizzle(order), src) :
        map_1.map(swizzler_1.swizzler(order));
}
exports.swizzle = swizzle;

},{"../func/swizzler":"../../../node_modules/@thi.ng/transducers/func/swizzler.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./map":"../../../node_modules/@thi.ng/transducers/xform/map.js"}],"../../../node_modules/@thi.ng/transducers/xform/take-nth.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const throttle_1 = require("./throttle");
function takeNth(n, src) {
    if (src) {
        return iterator_1.iterator1(takeNth(n), src);
    }
    n = Math.max(0, n - 1);
    return throttle_1.throttle(() => {
        let skip = 0;
        return () => (skip === 0 ? (skip = n, true) : (skip--, false));
    });
}
exports.takeNth = takeNth;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./throttle":"../../../node_modules/@thi.ng/transducers/xform/throttle.js"}],"../../../node_modules/@thi.ng/transducers/xform/take-while.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function takeWhile(...args) {
    return iterator_1.$iter(takeWhile, args) ||
        ((rfn) => {
            const r = rfn[2];
            const pred = args[0];
            let ok = true;
            return compr_1.compR(rfn, (acc, x) => (ok = ok && pred(x)) ? r(acc, x) : reduced_1.reduced(acc));
        });
}
exports.takeWhile = takeWhile;

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/throttle-time.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const throttle_1 = require("./throttle");
function throttleTime(delay, src) {
    return src ?
        iterator_1.iterator1(throttleTime(delay), src) :
        throttle_1.throttle(() => {
            let last = 0;
            return () => {
                const t = Date.now();
                return t - last >= delay ? (last = t, true) : false;
            };
        });
}
exports.throttleTime = throttleTime;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./throttle":"../../../node_modules/@thi.ng/transducers/xform/throttle.js"}],"../../../node_modules/@thi.ng/transducers/xform/trace.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const side_effect_1 = require("./side-effect");
function trace(prefix = "") {
    return side_effect_1.sideEffect((x) => console.log(prefix, x));
}
exports.trace = trace;

},{"./side-effect":"../../../node_modules/@thi.ng/transducers/xform/side-effect.js"}],"../../../node_modules/@thi.ng/transducers/xform/utf8.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compr_1 = require("../func/compr");
const iterator_1 = require("../iterator");
const reduced_1 = require("../reduced");
function utf8Decode(src) {
    return src ?
        [...iterator_1.iterator1(utf8Decode(), src)].join("") :
        (rfn) => {
            const r = rfn[2];
            let state = 0, u0, u1, u2, u3, u4;
            return compr_1.compR(rfn, (acc, x) => {
                switch (state) {
                    case 0:
                    default:
                        if (x < 0x80) {
                            return r(acc, String.fromCharCode(x));
                        }
                        u0 = x;
                        state = 1;
                        break;
                    case 1:
                        u1 = x & 0x3f;
                        if ((u0 & 0xe0) === 0xc0) {
                            state = 0;
                            return r(acc, String.fromCharCode(((u0 & 0x1f) << 6) | u1));
                        }
                        state = 2;
                        break;
                    case 2:
                        u2 = x & 0x3f;
                        if ((u0 & 0xf0) === 0xe0) {
                            state = 0;
                            return r(acc, String.fromCharCode(((u0 & 0x0f) << 12) | (u1 << 6) | u2));
                        }
                        state = 3;
                        break;
                    case 3:
                        u3 = x & 0x3f;
                        if ((u0 & 0xf8) === 0xf0) {
                            state = 0;
                            return r(acc, codePoint(((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3));
                        }
                        state = 4;
                        break;
                    case 4:
                        u4 = x & 0x3f;
                        if ((u0 & 0xfc) === 0xf8) {
                            state = 0;
                            return r(acc, codePoint(((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4));
                        }
                        state = 5;
                        break;
                    case 5:
                        state = 0;
                        return r(acc, codePoint(((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | (x & 0x3f)));
                }
                return acc;
            });
        };
}
exports.utf8Decode = utf8Decode;
function utf8Encode(src) {
    return src != null ?
        iterator_1.iterator(utf8Encode(), src) :
        (rfn) => {
            const r = rfn[2];
            return compr_1.compR(rfn, (acc, x) => {
                let u = x.charCodeAt(0), buf;
                if (u >= 0xd800 && u <= 0xdfff) {
                    u = 0x10000 + ((u & 0x3ff) << 10) | (x.charCodeAt(1) & 0x3ff);
                }
                if (u < 0x80) {
                    return r(acc, u);
                }
                else if (u < 0x800) {
                    buf = [
                        0xc0 | (u >> 6),
                        0x80 | (u & 0x3f)
                    ];
                }
                else if (u < 0x10000) {
                    buf = [
                        0xe0 | (u >> 12),
                        0x80 | ((u >> 6) & 0x3f),
                        0x80 | (u & 0x3f)
                    ];
                }
                else if (u < 0x200000) {
                    buf = [
                        0xf0 | (u >> 18),
                        0x80 | ((u >> 12) & 0x3f),
                        0x80 | ((u >> 6) & 0x3f),
                        0x80 | (u & 0x3f)
                    ];
                }
                else if (u < 0x4000000) {
                    buf = [
                        0xf8 | (u >> 24),
                        0x80 | ((u >> 18) & 0x3f),
                        0x80 | ((u >> 12) & 0x3f),
                        0x80 | ((u >> 6) & 0x3f),
                        0x80 | (u & 0x3f)
                    ];
                }
                else {
                    buf = [
                        0xfc | (u >> 30),
                        0x80 | ((u >> 24) & 0x3f),
                        0x80 | ((u >> 18) & 0x3f),
                        0x80 | ((u >> 12) & 0x3f),
                        0x80 | ((u >> 6) & 0x3f),
                        0x80 | (u & 0x3f)
                    ];
                }
                for (let i = 0, n = buf.length; i < n; i++) {
                    acc = r(acc, buf[i]);
                    if (reduced_1.isReduced(acc)) {
                        break;
                    }
                }
                return acc;
            });
        };
}
exports.utf8Encode = utf8Encode;
const codePoint = (x) => x < 0x10000 ?
    String.fromCharCode(x) :
    (x -= 0x10000, String.fromCharCode(0xd800 | (x >> 10), 0xdc00 | (x & 0x3ff)));

},{"../func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/xform/word-wrap.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("../iterator");
const partition_by_1 = require("./partition-by");
function wordWrap(...args) {
    const iter = iterator_1.$iter(wordWrap, args, iterator_1.iterator);
    if (iter) {
        return iter;
    }
    const lineLength = args[0];
    const { delim, always } = Object.assign({ delim: 1, always: true }, args[1]);
    return partition_by_1.partitionBy(() => {
        let n = 0;
        let flag = false;
        return (w) => {
            n += w.length + delim;
            if (n > lineLength + (always ? 0 : delim)) {
                flag = !flag;
                n = w.length + delim;
            }
            return flag;
        };
    }, true);
}
exports.wordWrap = wordWrap;

},{"../iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./partition-by":"../../../node_modules/@thi.ng/transducers/xform/partition-by.js"}],"../../../node_modules/@thi.ng/transducers/func/constantly.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function constantly(x) {
    return () => x;
}
exports.constantly = constantly;

},{}],"../../../node_modules/@thi.ng/checks/is-even.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEven(x) {
    return (x % 2) === 0;
}
exports.isEven = isEven;

},{}],"../../../node_modules/@thi.ng/transducers/func/even.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_even_1 = require("@thi.ng/checks/is-even");
exports.even = is_even_1.isEven;

},{"@thi.ng/checks/is-even":"../../../node_modules/@thi.ng/checks/is-even.js"}],"../../../node_modules/@thi.ng/transducers/func/hex.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const radix_1 = require("@thi.ng/strings/radix");
/**
 * @deprecated use thi.ng/strings `radix()` instead
 *
 * @param digits
 * @param prefix
 */
exports.hex = (digits = 2, prefix = "") => radix_1.radix(16, digits, prefix);

},{"@thi.ng/strings/radix":"../../../node_modules/@thi.ng/strings/radix.js"}],"../../../node_modules/@thi.ng/transducers/func/juxtr.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reduced_1 = require("../reduced");
function juxtR(...rs) {
    let [a, b, c] = rs;
    const n = rs.length;
    switch (n) {
        case 1: {
            const r = a[2];
            return [
                () => [a[0]()],
                (acc) => [a[1](acc[0])],
                (acc, x) => {
                    const aa1 = r(acc[0], x);
                    if (reduced_1.isReduced(aa1)) {
                        return reduced_1.reduced([reduced_1.unreduced(aa1)]);
                    }
                    return [aa1];
                }
            ];
        }
        case 2: {
            const ra = a[2];
            const rb = b[2];
            return [
                () => [a[0](), b[0]()],
                (acc) => [a[1](acc[0]), b[1](acc[1])],
                (acc, x) => {
                    const aa1 = ra(acc[0], x);
                    const aa2 = rb(acc[1], x);
                    if (reduced_1.isReduced(aa1) || reduced_1.isReduced(aa2)) {
                        return reduced_1.reduced([reduced_1.unreduced(aa1), reduced_1.unreduced(aa2)]);
                    }
                    return [aa1, aa2];
                }
            ];
        }
        case 3: {
            const ra = a[2];
            const rb = b[2];
            const rc = c[2];
            return [
                () => [a[0](), b[0](), c[0]()],
                (acc) => [a[1](acc[0]), b[1](acc[1]), c[1](acc[2])],
                (acc, x) => {
                    const aa1 = ra(acc[0], x);
                    const aa2 = rb(acc[1], x);
                    const aa3 = rc(acc[2], x);
                    if (reduced_1.isReduced(aa1) || reduced_1.isReduced(aa2) || reduced_1.isReduced(aa3)) {
                        return reduced_1.reduced([reduced_1.unreduced(aa1), reduced_1.unreduced(aa2), reduced_1.unreduced(aa3)]);
                    }
                    return [aa1, aa2, aa3];
                }
            ];
        }
        default:
            return [
                () => rs.map((r) => r[0]()),
                (acc) => rs.map((r, i) => r[1](acc[i])),
                (acc, x) => {
                    let done = false;
                    const res = [];
                    for (let i = 0; i < n; i++) {
                        let a = rs[i][2](acc[i], x);
                        if (reduced_1.isReduced(a)) {
                            done = true;
                            a = reduced_1.unreduced(a);
                        }
                        res[i] = a;
                    }
                    return done ? reduced_1.reduced(res) : res;
                }
            ];
    }
}
exports.juxtR = juxtR;

},{"../reduced":"../../../node_modules/@thi.ng/transducers/reduced.js"}],"../../../node_modules/@thi.ng/transducers/func/lookup.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns function accepting a single index arg used to
 * lookup value in given array. No bounds checks are done.
 *
 * ```
 * [...map(lookup1d([10, 20, 30]), [2,0,1])]
 * // [ 30, 10, 20 ]
 * ```
 *
 * @param src source data
 */
function lookup1d(src) {
    return (i) => src[i];
}
exports.lookup1d = lookup1d;
/**
 * Returns function accepting a single `[x, y]` index tuple,
 * used to lookup value in given array. Useful for transducers
 * processing 2D data. **Note**: The source data MUST be in
 * row major linearized format, i.e. 1D representation of 2D data
 * (pixel buffer). No bounds checks are done.
 *
 * ```
 * [...map(lookup2d([...range(9)], 3), range2d(2, -1, 0, 3))]
 * // [ 2, 1, 0, 5, 4, 3, 8, 7, 6 ]
 * ```
 *
 * @param src source data
 * @param width number of items along X (columns)
 */
function lookup2d(src, width) {
    return (i) => src[i[0] + i[1] * width];
}
exports.lookup2d = lookup2d;
/**
 * Same as `lookup2d()`, but for 3D data. The index ordering of the
 * source data MUST be in Z, Y, X order (i.e. a stack of row major 2D slices).
 * No bounds checks are done.
 *
 * @param src source data
 * @param width number of items along X (columns)
 * @param height number of items along Y (rows)
 */
function lookup3d(src, width, height) {
    const stridez = width * height;
    return (i) => src[i[0] + i[1] * width + i[2] * stridez];
}
exports.lookup3d = lookup3d;

},{}],"../../../node_modules/@thi.ng/checks/is-odd.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isOdd(x) {
    return (x % 2) !== 0;
}
exports.isOdd = isOdd;

},{}],"../../../node_modules/@thi.ng/transducers/func/odd.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_odd_1 = require("@thi.ng/checks/is-odd");
exports.odd = is_odd_1.isOdd;

},{"@thi.ng/checks/is-odd":"../../../node_modules/@thi.ng/checks/is-odd.js"}],"../../../node_modules/@thi.ng/transducers/func/peek.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns last element of given array.
 *
 * @param x
 */
function peek(x) {
    return x[x.length - 1];
}
exports.peek = peek;

},{}],"../../../node_modules/@thi.ng/transducers/iter/repeat.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* repeat(x, n = Infinity) {
    while (n-- > 0) {
        yield x;
    }
}
exports.repeat = repeat;

},{}],"../../../node_modules/@thi.ng/transducers/func/weighted-random.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repeat_1 = require("../iter/repeat");
const tuples_1 = require("../iter/tuples");
/**
 * If `weights` are given, it must be the same size as `choices`. If omitted,
 * each choice will have same probability.
 *
 * https://www.electricmonk.nl/log/2009/12/23/weighted-random-distribution/
 *
 * @param choices
 * @param weights
 */
function weightedRandom(choices, weights) {
    const n = choices.length;
    const opts = [...tuples_1.tuples(choices, weights || repeat_1.repeat(1))].sort((a, b) => b[1] - a[1]);
    let total = 0, i, r, sum;
    for (i = 0; i < n; i++) {
        total += weights[i];
    }
    return () => {
        r = Math.random() * total;
        sum = total;
        for (i = 0; i < n; i++) {
            sum -= opts[i][1];
            if (sum <= r) {
                return opts[i][0];
            }
        }
    };
}
exports.weightedRandom = weightedRandom;

},{"../iter/repeat":"../../../node_modules/@thi.ng/transducers/iter/repeat.js","../iter/tuples":"../../../node_modules/@thi.ng/transducers/iter/tuples.js"}],"../../../node_modules/@thi.ng/transducers/iter/repeatedly.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* repeatedly(fn, n = Infinity) {
    while (n-- > 0) {
        yield fn();
    }
}
exports.repeatedly = repeatedly;

},{}],"../../../node_modules/@thi.ng/transducers/iter/choices.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weighted_random_1 = require("../func/weighted-random");
const repeatedly_1 = require("./repeatedly");
/**
 * Returns an infinite iterator of random choices and their (optional)
 * weights. If `weights` is given, it must have at least the same size
 * as `choices`. If omitted, each choice will have same probability.
 *
 * See: `weightedRandom()`
 *
 * ```
 * transduce(take(1000), frequencies(), choices("abcd", [1, 0.5, 0.25, 0.125]))
 * // Map { 'c' => 132, 'a' => 545, 'b' => 251, 'd' => 72 }
 * ```
 *
 * @param choices
 * @param weights
 */
function choices(choices, weights) {
    return repeatedly_1.repeatedly(weights ?
        weighted_random_1.weightedRandom(choices, weights) :
        () => choices[(Math.random() * choices.length) | 0]);
}
exports.choices = choices;

},{"../func/weighted-random":"../../../node_modules/@thi.ng/transducers/func/weighted-random.js","./repeatedly":"../../../node_modules/@thi.ng/transducers/iter/repeatedly.js"}],"../../../node_modules/@thi.ng/transducers/func/random-id.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const choices_1 = require("../iter/choices");
const take_1 = require("../xform/take");
/**
 * Generates and returns a random string of `len` characters (default
 * 4), plus optional given `prefix` and using only provided `syms`
 * characters (default lowercase a-z).
 *
 * ```
 * randomID()
 * "qgdt"
 *
 * randomID(8, "id-", "0123456789ABCDEF")
 * "id-94EF6E1A"
 * ```
 *
 * @param len
 * @param prefix
 * @param syms
 */
exports.randomID = (len = 4, prefix = "", syms = "abcdefghijklmnopqrstuvwxyz") => [prefix, ...take_1.take(len, choices_1.choices(syms))].join("");

},{"../iter/choices":"../../../node_modules/@thi.ng/transducers/iter/choices.js","../xform/take":"../../../node_modules/@thi.ng/transducers/xform/take.js"}],"../../../node_modules/@thi.ng/transducers/iter/as-iterable.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper function to (re)provide given iterable in iterator form.
 *
 * @param src
 */
function* asIterable(src) {
    yield* src;
}
exports.asIterable = asIterable;

},{}],"../../../node_modules/@thi.ng/transducers/iter/concat.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensure_iterable_1 = require("../func/ensure-iterable");
/**
 * Yields iterator producing concatenation of given iterables.
 * Undefined & null inputs are silently ignored, however any
 * such values produced or contained in an input will remain.
 *
 * ```
 * [...concat([1, 2, 3], null, [4, 5])]
 * // [ 1, 2, 3, 4, 5 ]
 *
 * [...concat([1, 2, 3, undefined], null, [4, 5])]
 * // [ 1, 2, 3, undefined, 4, 5 ]
 * ```
 *
 * @param xs
 */
function* concat(...xs) {
    for (let x of xs) {
        x != null && (yield* ensure_iterable_1.ensureIterable(x));
    }
}
exports.concat = concat;

},{"../func/ensure-iterable":"../../../node_modules/@thi.ng/transducers/func/ensure-iterable.js"}],"../../../node_modules/@thi.ng/transducers/iter/cycle.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* cycle(input) {
    let cache = [];
    for (let i of input) {
        cache.push(i);
        yield i;
    }
    if (cache.length > 0) {
        while (true) {
            yield* cache;
        }
    }
}
exports.cycle = cycle;

},{}],"../../../node_modules/@thi.ng/transducers/iter/iterate.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* iterate(fn, seed) {
    while (true) {
        yield seed;
        seed = fn(seed);
    }
}
exports.iterate = iterate;

},{}],"../../../node_modules/@thi.ng/transducers/iter/keys.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* keys(x) {
    for (let k in x) {
        if (x.hasOwnProperty(k)) {
            yield k;
        }
    }
}
exports.keys = keys;

},{}],"../../../node_modules/@thi.ng/transducers/iter/norm-range.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Yields sequence of `n+1` monotonically increasing numbers in the
 * closed interval (0.0 .. 1.0). If `n <= 0`, yields nothing.
 *
 * ```
 * [...normRange(4)]
 * // [0, 0.25, 0.5, 0.75, 1.0]
 * ```
 *
 * @param n number of steps
 * @param inclLast include last value (i.e. `1.0`)
 */
function* normRange(n, inclLast = true) {
    if (n > 0) {
        for (let i = 0, m = inclLast ? n + 1 : n; i < m; i++) {
            yield i / n;
        }
    }
}
exports.normRange = normRange;

},{}],"../../../node_modules/@thi.ng/transducers/iter/pairs.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* pairs(x) {
    for (let k in x) {
        if (x.hasOwnProperty(k)) {
            yield [k, x[k]];
        }
    }
}
exports.pairs = pairs;

},{}],"../../../node_modules/@thi.ng/transducers/iter/permutations.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const ensure_array_1 = require("../func/ensure-array");
const range_1 = require("./range");
function* permutations(...src) {
    const n = src.length - 1;
    if (n < 0) {
        return;
    }
    const step = new Array(n + 1).fill(0);
    const realized = src.map(ensure_array_1.ensureArrayLike);
    const total = realized.reduce((acc, x) => acc * x.length, 1);
    for (let i = 0; i < total; i++) {
        const tuple = [];
        for (let j = n; j >= 0; j--) {
            const r = realized[j];
            let s = step[j];
            if (s === r.length) {
                step[j] = s = 0;
                j > 0 && (step[j - 1]++);
            }
            tuple[j] = r[s];
        }
        step[n]++;
        yield tuple;
    }
}
exports.permutations = permutations;
/**
 * Iterator yielding the Cartesian Product for `n` items of `m` values
 * each. If `m` is not given, defaults to value of `n`. The range of `m`
 * is `0..m-1`. The optional `offsets` array can be used to define start
 * values for each dimension.
 *
 * ```
 * [...permutationsN(2)]
 * // [ [0, 0], [0, 1], [1, 0], [1, 1] ]
 *
 * [...permutationsN(2, 3)]
 * // [ [0, 0], [0, 1], [0, 2],
 * //   [1, 0], [1, 1], [1, 2],
 * //   [2, 0], [2, 1], [2, 2] ]
 *
 * [...permutationsN(2, 3, [10, 20])]
 * // [ [ 10, 20 ], [ 10, 21 ], [ 11, 20 ], [ 11, 21 ] ]
 * ```
 *
 * @param n
 * @param m
 * @param offsets
 */
function permutationsN(n, m = n, offsets) {
    if (offsets && offsets.length < n) {
        illegal_arguments_1.illegalArgs(`insufficient offsets, got ${offsets.length}, needed ${n}`);
    }
    const seqs = [];
    while (--n >= 0) {
        const o = offsets ? offsets[n] : 0;
        seqs[n] = range_1.range(o, o + m);
    }
    return permutations.apply(null, seqs);
}
exports.permutationsN = permutationsN;

},{"@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","../func/ensure-array":"../../../node_modules/@thi.ng/transducers/func/ensure-array.js","./range":"../../../node_modules/@thi.ng/transducers/iter/range.js"}],"../../../node_modules/@thi.ng/transducers/iter/range3d.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const illegal_arity_1 = require("@thi.ng/errors/illegal-arity");
const range_1 = require("./range");
function* range3d(...args) {
    let fromX, toX, fromY, toY, fromZ, toZ, stepX, stepY, stepZ;
    switch (args.length) {
        case 9:
            stepX = args[6];
            stepY = args[7];
            stepZ = args[8];
        case 6:
            [fromX, toX, fromY, toY, fromZ, toZ] = args;
            break;
        case 3:
            [toX, toY, toZ] = args;
            fromX = fromY = fromZ = 0;
            break;
        default:
            illegal_arity_1.illegalArity(args.length);
    }
    const rx = range_1.range(fromX, toX, stepX);
    const ry = range_1.range(fromY, toY, stepY);
    for (let z of range_1.range(fromZ, toZ, stepZ)) {
        for (let y of ry) {
            for (let x of rx) {
                yield [x, y, z];
            }
        }
    }
}
exports.range3d = range3d;

},{"@thi.ng/errors/illegal-arity":"../../../node_modules/@thi.ng/errors/illegal-arity.js","./range":"../../../node_modules/@thi.ng/transducers/iter/range.js"}],"../../../node_modules/@thi.ng/transducers/iter/reverse.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensure_array_1 = require("../func/ensure-array");
/**
 * Yields iterator which consumes input and yield its values in reverse
 * order. Important: Input MUST be finite.
 *
 * ```
 * [...tx.reverse("hello world")]
 * // [ "d", "l", "r", "o", "w", " ", "o", "l", "l", "e", "h" ]
 * ```
 *
 * @param input
 */
function* reverse(input) {
    const _input = ensure_array_1.ensureArray(input);
    let n = _input.length;
    while (--n >= 0) {
        yield _input[n];
    }
}
exports.reverse = reverse;

},{"../func/ensure-array":"../../../node_modules/@thi.ng/transducers/func/ensure-array.js"}],"../../../node_modules/@thi.ng/transducers/iter/vals.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* vals(x) {
    for (let k in x) {
        if (x.hasOwnProperty(k)) {
            yield x[k];
        }
    }
}
exports.vals = vals;

},{}],"../../../node_modules/@thi.ng/transducers/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./iterator"));
__export(require("./reduce"));
__export(require("./reduced"));
__export(require("./run"));
__export(require("./step"));
__export(require("./transduce"));
__export(require("./rfn/add"));
__export(require("./rfn/assoc-map"));
__export(require("./rfn/assoc-obj"));
__export(require("./rfn/conj"));
__export(require("./rfn/count"));
__export(require("./rfn/div"));
__export(require("./rfn/every"));
__export(require("./rfn/fill"));
__export(require("./rfn/frequencies"));
__export(require("./rfn/group-binary"));
__export(require("./rfn/group-by-map"));
__export(require("./rfn/group-by-obj"));
__export(require("./rfn/last"));
__export(require("./rfn/max-compare"));
__export(require("./rfn/max"));
__export(require("./rfn/mean"));
__export(require("./rfn/min-compare"));
__export(require("./rfn/min"));
__export(require("./rfn/mul"));
__export(require("./rfn/push-copy"));
__export(require("./rfn/push"));
__export(require("./rfn/reductions"));
__export(require("./rfn/some"));
__export(require("./rfn/str"));
__export(require("./rfn/sub"));
__export(require("./xform/base64"));
__export(require("./xform/benchmark"));
__export(require("./xform/bits"));
__export(require("./xform/cat"));
__export(require("./xform/convolve"));
__export(require("./xform/dedupe"));
__export(require("./xform/delayed"));
__export(require("./xform/distinct"));
__export(require("./xform/drop-nth"));
__export(require("./xform/drop-while"));
__export(require("./xform/drop"));
__export(require("./xform/duplicate"));
__export(require("./xform/filter"));
__export(require("./xform/filter-fuzzy"));
__export(require("./xform/flatten-with"));
__export(require("./xform/flatten"));
__export(require("./xform/hex-dump"));
__export(require("./xform/indexed"));
__export(require("./xform/interleave"));
__export(require("./xform/interpose"));
__export(require("./xform/keep"));
__export(require("./xform/labeled"));
__export(require("./xform/map-deep"));
__export(require("./xform/map-indexed"));
__export(require("./xform/map-keys"));
__export(require("./xform/map-nth"));
__export(require("./xform/map-vals"));
__export(require("./xform/map"));
__export(require("./xform/mapcat"));
__export(require("./xform/match-first"));
__export(require("./xform/match-last"));
__export(require("./xform/moving-average"));
__export(require("./xform/moving-median"));
__export(require("./xform/multiplex"));
__export(require("./xform/multiplex-obj"));
__export(require("./xform/noop"));
__export(require("./xform/pad-last"));
__export(require("./xform/page"));
__export(require("./xform/partition-bits"));
__export(require("./xform/partition-by"));
__export(require("./xform/partition-of"));
__export(require("./xform/partition-sort"));
__export(require("./xform/partition-sync"));
__export(require("./xform/partition"));
__export(require("./xform/pluck"));
__export(require("./xform/rename"));
__export(require("./xform/sample"));
__export(require("./xform/scan"));
__export(require("./xform/select-keys"));
__export(require("./xform/side-effect"));
__export(require("./xform/sliding-window"));
__export(require("./xform/stream-shuffle"));
__export(require("./xform/stream-sort"));
__export(require("./xform/struct"));
__export(require("./xform/swizzle"));
__export(require("./xform/take-nth"));
__export(require("./xform/take-last"));
__export(require("./xform/take-while"));
__export(require("./xform/take"));
__export(require("./xform/throttle"));
__export(require("./xform/throttle-time"));
__export(require("./xform/trace"));
__export(require("./xform/utf8"));
__export(require("./xform/word-wrap"));
__export(require("./func/binary-search"));
__export(require("./func/comp"));
__export(require("./func/compr"));
__export(require("./func/constantly"));
__export(require("./func/deep-transform"));
__export(require("./func/delay"));
__export(require("./func/ensure-array"));
__export(require("./func/ensure-iterable"));
__export(require("./func/even"));
__export(require("./func/fuzzy-match"));
__export(require("./func/hex"));
__export(require("./func/identity"));
__export(require("./func/juxt"));
__export(require("./func/juxtr"));
__export(require("./func/key-selector"));
__export(require("./func/lookup"));
__export(require("./func/odd"));
__export(require("./func/peek"));
__export(require("./func/random-id"));
__export(require("./func/renamer"));
__export(require("./func/swizzler"));
__export(require("./func/weighted-random"));
__export(require("./iter/as-iterable"));
__export(require("./iter/choices"));
__export(require("./iter/concat"));
__export(require("./iter/cycle"));
__export(require("./iter/iterate"));
__export(require("./iter/keys"));
__export(require("./iter/norm-range"));
__export(require("./iter/pairs"));
__export(require("./iter/permutations"));
__export(require("./iter/range"));
__export(require("./iter/range2d"));
__export(require("./iter/range3d"));
__export(require("./iter/repeat"));
__export(require("./iter/repeatedly"));
__export(require("./iter/reverse"));
__export(require("./iter/tuples"));
__export(require("./iter/vals"));
__export(require("./iter/wrap"));

},{"./iterator":"../../../node_modules/@thi.ng/transducers/iterator.js","./reduce":"../../../node_modules/@thi.ng/transducers/reduce.js","./reduced":"../../../node_modules/@thi.ng/transducers/reduced.js","./run":"../../../node_modules/@thi.ng/transducers/run.js","./step":"../../../node_modules/@thi.ng/transducers/step.js","./transduce":"../../../node_modules/@thi.ng/transducers/transduce.js","./rfn/add":"../../../node_modules/@thi.ng/transducers/rfn/add.js","./rfn/assoc-map":"../../../node_modules/@thi.ng/transducers/rfn/assoc-map.js","./rfn/assoc-obj":"../../../node_modules/@thi.ng/transducers/rfn/assoc-obj.js","./rfn/conj":"../../../node_modules/@thi.ng/transducers/rfn/conj.js","./rfn/count":"../../../node_modules/@thi.ng/transducers/rfn/count.js","./rfn/div":"../../../node_modules/@thi.ng/transducers/rfn/div.js","./rfn/every":"../../../node_modules/@thi.ng/transducers/rfn/every.js","./rfn/fill":"../../../node_modules/@thi.ng/transducers/rfn/fill.js","./rfn/frequencies":"../../../node_modules/@thi.ng/transducers/rfn/frequencies.js","./rfn/group-binary":"../../../node_modules/@thi.ng/transducers/rfn/group-binary.js","./rfn/group-by-map":"../../../node_modules/@thi.ng/transducers/rfn/group-by-map.js","./rfn/group-by-obj":"../../../node_modules/@thi.ng/transducers/rfn/group-by-obj.js","./rfn/last":"../../../node_modules/@thi.ng/transducers/rfn/last.js","./rfn/max-compare":"../../../node_modules/@thi.ng/transducers/rfn/max-compare.js","./rfn/max":"../../../node_modules/@thi.ng/transducers/rfn/max.js","./rfn/mean":"../../../node_modules/@thi.ng/transducers/rfn/mean.js","./rfn/min-compare":"../../../node_modules/@thi.ng/transducers/rfn/min-compare.js","./rfn/min":"../../../node_modules/@thi.ng/transducers/rfn/min.js","./rfn/mul":"../../../node_modules/@thi.ng/transducers/rfn/mul.js","./rfn/push-copy":"../../../node_modules/@thi.ng/transducers/rfn/push-copy.js","./rfn/push":"../../../node_modules/@thi.ng/transducers/rfn/push.js","./rfn/reductions":"../../../node_modules/@thi.ng/transducers/rfn/reductions.js","./rfn/some":"../../../node_modules/@thi.ng/transducers/rfn/some.js","./rfn/str":"../../../node_modules/@thi.ng/transducers/rfn/str.js","./rfn/sub":"../../../node_modules/@thi.ng/transducers/rfn/sub.js","./xform/base64":"../../../node_modules/@thi.ng/transducers/xform/base64.js","./xform/benchmark":"../../../node_modules/@thi.ng/transducers/xform/benchmark.js","./xform/bits":"../../../node_modules/@thi.ng/transducers/xform/bits.js","./xform/cat":"../../../node_modules/@thi.ng/transducers/xform/cat.js","./xform/convolve":"../../../node_modules/@thi.ng/transducers/xform/convolve.js","./xform/dedupe":"../../../node_modules/@thi.ng/transducers/xform/dedupe.js","./xform/delayed":"../../../node_modules/@thi.ng/transducers/xform/delayed.js","./xform/distinct":"../../../node_modules/@thi.ng/transducers/xform/distinct.js","./xform/drop-nth":"../../../node_modules/@thi.ng/transducers/xform/drop-nth.js","./xform/drop-while":"../../../node_modules/@thi.ng/transducers/xform/drop-while.js","./xform/drop":"../../../node_modules/@thi.ng/transducers/xform/drop.js","./xform/duplicate":"../../../node_modules/@thi.ng/transducers/xform/duplicate.js","./xform/filter":"../../../node_modules/@thi.ng/transducers/xform/filter.js","./xform/filter-fuzzy":"../../../node_modules/@thi.ng/transducers/xform/filter-fuzzy.js","./xform/flatten-with":"../../../node_modules/@thi.ng/transducers/xform/flatten-with.js","./xform/flatten":"../../../node_modules/@thi.ng/transducers/xform/flatten.js","./xform/hex-dump":"../../../node_modules/@thi.ng/transducers/xform/hex-dump.js","./xform/indexed":"../../../node_modules/@thi.ng/transducers/xform/indexed.js","./xform/interleave":"../../../node_modules/@thi.ng/transducers/xform/interleave.js","./xform/interpose":"../../../node_modules/@thi.ng/transducers/xform/interpose.js","./xform/keep":"../../../node_modules/@thi.ng/transducers/xform/keep.js","./xform/labeled":"../../../node_modules/@thi.ng/transducers/xform/labeled.js","./xform/map-deep":"../../../node_modules/@thi.ng/transducers/xform/map-deep.js","./xform/map-indexed":"../../../node_modules/@thi.ng/transducers/xform/map-indexed.js","./xform/map-keys":"../../../node_modules/@thi.ng/transducers/xform/map-keys.js","./xform/map-nth":"../../../node_modules/@thi.ng/transducers/xform/map-nth.js","./xform/map-vals":"../../../node_modules/@thi.ng/transducers/xform/map-vals.js","./xform/map":"../../../node_modules/@thi.ng/transducers/xform/map.js","./xform/mapcat":"../../../node_modules/@thi.ng/transducers/xform/mapcat.js","./xform/match-first":"../../../node_modules/@thi.ng/transducers/xform/match-first.js","./xform/match-last":"../../../node_modules/@thi.ng/transducers/xform/match-last.js","./xform/moving-average":"../../../node_modules/@thi.ng/transducers/xform/moving-average.js","./xform/moving-median":"../../../node_modules/@thi.ng/transducers/xform/moving-median.js","./xform/multiplex":"../../../node_modules/@thi.ng/transducers/xform/multiplex.js","./xform/multiplex-obj":"../../../node_modules/@thi.ng/transducers/xform/multiplex-obj.js","./xform/noop":"../../../node_modules/@thi.ng/transducers/xform/noop.js","./xform/pad-last":"../../../node_modules/@thi.ng/transducers/xform/pad-last.js","./xform/page":"../../../node_modules/@thi.ng/transducers/xform/page.js","./xform/partition-bits":"../../../node_modules/@thi.ng/transducers/xform/partition-bits.js","./xform/partition-by":"../../../node_modules/@thi.ng/transducers/xform/partition-by.js","./xform/partition-of":"../../../node_modules/@thi.ng/transducers/xform/partition-of.js","./xform/partition-sort":"../../../node_modules/@thi.ng/transducers/xform/partition-sort.js","./xform/partition-sync":"../../../node_modules/@thi.ng/transducers/xform/partition-sync.js","./xform/partition":"../../../node_modules/@thi.ng/transducers/xform/partition.js","./xform/pluck":"../../../node_modules/@thi.ng/transducers/xform/pluck.js","./xform/rename":"../../../node_modules/@thi.ng/transducers/xform/rename.js","./xform/sample":"../../../node_modules/@thi.ng/transducers/xform/sample.js","./xform/scan":"../../../node_modules/@thi.ng/transducers/xform/scan.js","./xform/select-keys":"../../../node_modules/@thi.ng/transducers/xform/select-keys.js","./xform/side-effect":"../../../node_modules/@thi.ng/transducers/xform/side-effect.js","./xform/sliding-window":"../../../node_modules/@thi.ng/transducers/xform/sliding-window.js","./xform/stream-shuffle":"../../../node_modules/@thi.ng/transducers/xform/stream-shuffle.js","./xform/stream-sort":"../../../node_modules/@thi.ng/transducers/xform/stream-sort.js","./xform/struct":"../../../node_modules/@thi.ng/transducers/xform/struct.js","./xform/swizzle":"../../../node_modules/@thi.ng/transducers/xform/swizzle.js","./xform/take-nth":"../../../node_modules/@thi.ng/transducers/xform/take-nth.js","./xform/take-last":"../../../node_modules/@thi.ng/transducers/xform/take-last.js","./xform/take-while":"../../../node_modules/@thi.ng/transducers/xform/take-while.js","./xform/take":"../../../node_modules/@thi.ng/transducers/xform/take.js","./xform/throttle":"../../../node_modules/@thi.ng/transducers/xform/throttle.js","./xform/throttle-time":"../../../node_modules/@thi.ng/transducers/xform/throttle-time.js","./xform/trace":"../../../node_modules/@thi.ng/transducers/xform/trace.js","./xform/utf8":"../../../node_modules/@thi.ng/transducers/xform/utf8.js","./xform/word-wrap":"../../../node_modules/@thi.ng/transducers/xform/word-wrap.js","./func/binary-search":"../../../node_modules/@thi.ng/transducers/func/binary-search.js","./func/comp":"../../../node_modules/@thi.ng/transducers/func/comp.js","./func/compr":"../../../node_modules/@thi.ng/transducers/func/compr.js","./func/constantly":"../../../node_modules/@thi.ng/transducers/func/constantly.js","./func/deep-transform":"../../../node_modules/@thi.ng/transducers/func/deep-transform.js","./func/delay":"../../../node_modules/@thi.ng/transducers/func/delay.js","./func/ensure-array":"../../../node_modules/@thi.ng/transducers/func/ensure-array.js","./func/ensure-iterable":"../../../node_modules/@thi.ng/transducers/func/ensure-iterable.js","./func/even":"../../../node_modules/@thi.ng/transducers/func/even.js","./func/fuzzy-match":"../../../node_modules/@thi.ng/transducers/func/fuzzy-match.js","./func/hex":"../../../node_modules/@thi.ng/transducers/func/hex.js","./func/identity":"../../../node_modules/@thi.ng/transducers/func/identity.js","./func/juxt":"../../../node_modules/@thi.ng/transducers/func/juxt.js","./func/juxtr":"../../../node_modules/@thi.ng/transducers/func/juxtr.js","./func/key-selector":"../../../node_modules/@thi.ng/transducers/func/key-selector.js","./func/lookup":"../../../node_modules/@thi.ng/transducers/func/lookup.js","./func/odd":"../../../node_modules/@thi.ng/transducers/func/odd.js","./func/peek":"../../../node_modules/@thi.ng/transducers/func/peek.js","./func/random-id":"../../../node_modules/@thi.ng/transducers/func/random-id.js","./func/renamer":"../../../node_modules/@thi.ng/transducers/func/renamer.js","./func/swizzler":"../../../node_modules/@thi.ng/transducers/func/swizzler.js","./func/weighted-random":"../../../node_modules/@thi.ng/transducers/func/weighted-random.js","./iter/as-iterable":"../../../node_modules/@thi.ng/transducers/iter/as-iterable.js","./iter/choices":"../../../node_modules/@thi.ng/transducers/iter/choices.js","./iter/concat":"../../../node_modules/@thi.ng/transducers/iter/concat.js","./iter/cycle":"../../../node_modules/@thi.ng/transducers/iter/cycle.js","./iter/iterate":"../../../node_modules/@thi.ng/transducers/iter/iterate.js","./iter/keys":"../../../node_modules/@thi.ng/transducers/iter/keys.js","./iter/norm-range":"../../../node_modules/@thi.ng/transducers/iter/norm-range.js","./iter/pairs":"../../../node_modules/@thi.ng/transducers/iter/pairs.js","./iter/permutations":"../../../node_modules/@thi.ng/transducers/iter/permutations.js","./iter/range":"../../../node_modules/@thi.ng/transducers/iter/range.js","./iter/range2d":"../../../node_modules/@thi.ng/transducers/iter/range2d.js","./iter/range3d":"../../../node_modules/@thi.ng/transducers/iter/range3d.js","./iter/repeat":"../../../node_modules/@thi.ng/transducers/iter/repeat.js","./iter/repeatedly":"../../../node_modules/@thi.ng/transducers/iter/repeatedly.js","./iter/reverse":"../../../node_modules/@thi.ng/transducers/iter/reverse.js","./iter/tuples":"../../../node_modules/@thi.ng/transducers/iter/tuples.js","./iter/vals":"../../../node_modules/@thi.ng/transducers/iter/vals.js","./iter/wrap":"../../../node_modules/@thi.ng/transducers/iter/wrap.js"}],"../../../node_modules/@tstackgl/geometry/dist/calc/extrude/extrude.js":[function(require,module,exports) {
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as tx from '@thi.ng/transducers'
var earcut_1 = __importDefault(require("earcut"));
var get_centroid_1 = require("../get-centroid");
var edge_1 = require("../../edge");
var pivot_1 = require("../pivot");
var transducers_1 = require("@thi.ng/transducers");
function triangulate(vertices, holes, dimensions) {
    if (dimensions === void 0) { dimensions = 2; }
    return earcut_1.default(vertices, holes, dimensions);
}
var identity = function (x) { return x; };
function getSideCells(segmentsTopCells, segmentsBottomCells) {
    return __spread(transducers_1.mapcat(identity, transducers_1.map(function (_a) {
        var _b = __read(_a, 2), segment1 = _b[0], segment2 = _b[1];
        return [
            [segment2[1], segment2[0], segment1[0]],
            [segment2[1], segment1[0], segment1[1]],
        ];
    }, transducers_1.tuples(segmentsTopCells, segmentsBottomCells))));
}
exports.getSideCells = getSideCells;
function extrude(inputPolygons, opts) {
    if (opts === void 0) { opts = {
        depthTop: 2,
        depthBottom: -1,
        bevelTop: 0.2,
        bevelBottom: 0.9,
    }; }
    var newPolygon = inputPolygons;
    var hasHoles = newPolygon.length > 1;
    var _a = earcut_1.default.flatten(newPolygon), vertices = _a.vertices, holes = _a.holes, dimensions = _a.dimensions;
    if (dimensions !== 2) {
        throw new Error('Only 2D polygon points are supported');
    }
    // convertToClockwise(vertices, holes) // TODO: does not seems to work well, actually
    var indices = triangulate(vertices, holes, dimensions);
    var depthTop = opts.depthTop, depthBottom = opts.depthBottom, bevelTop = opts.bevelTop, bevelBottom = opts.bevelBottom;
    var center = get_centroid_1.getCentroid(inputPolygons[0]);
    var centers = [__spread(center, [depthTop]), __spread(center, [depthBottom])];
    // positions is an array of the faces extruded:
    // once with z = depthTop, once with z = depthBottom
    var nPos = vertices.length;
    var xy = transducers_1.partition(2, transducers_1.wrap(vertices, nPos, false));
    var offsetsDepth = transducers_1.concat(transducers_1.repeat(depthTop, nPos / 2), transducers_1.repeat(depthBottom, nPos / 2));
    var positions = __spread(transducers_1.map(function (_a) {
        var _b = __read(_a, 2), _c = __read(_b[0], 2), x = _c[0], y = _c[1], z = _b[1];
        return [x, y, z];
    }, transducers_1.tuples(xy, offsetsDepth)));
    // TODO: bevel should be done on 2d polygon actually, and triangulate twice for bottom and top, shit!
    // apply bevelTop to top external polygon and bevelBottom to bottom external polygon
    for (var i = 0; i < inputPolygons[0].length; i++) {
        positions[i] = pivot_1.scaleAroundCenter3(positions[i], positions[i], centers[0], bevelTop);
    }
    for (var i = positions.length / 2; i < positions.length / 2 + inputPolygons[0].length; i++) {
        positions[i] = pivot_1.scaleAroundCenter3(positions[i], positions[i], centers[1], bevelBottom);
    }
    var nCell = indices.length / 3;
    var facesTop = __spread(transducers_1.partition(3, indices));
    // notice that for normals directions the bottom face index has to be reversed: that's why `.slice().reverse()`
    var facesBottom = transducers_1.map(function (face) { return face.slice().reverse(); }, facesTop);
    var facesTopBottom = transducers_1.concat(facesTop, facesBottom);
    var offsetsIndex = transducers_1.concat(transducers_1.repeat(0, nCell), transducers_1.repeat(nPos / 2, nCell));
    var cells = __spread(transducers_1.map(function (_a) {
        var _b = __read(_a, 2), face = _b[0], n = _b[1];
        return face.map(function (f) { return f + n; });
    }, transducers_1.tuples(facesTopBottom, offsetsIndex)));
    var sideCells = [];
    if (!hasHoles) {
        var len = inputPolygons[0].length * 2;
        var flatCells = __spread(transducers_1.range(len));
        var segmentsTopCells = edge_1.polygonToSegments(transducers_1.take(len / 2, flatCells));
        var segmentsBottomCells = edge_1.polygonToSegments(transducers_1.takeLast(len / 2, flatCells));
        sideCells = getSideCells(segmentsTopCells, segmentsBottomCells);
    }
    else {
        var polygonsIdx = [
            transducers_1.range(0, inputPolygons[0].length),
            transducers_1.range(positions.length / 2, positions.length / 2 + inputPolygons[0].length),
        ];
        var segmentsTopCells = edge_1.polygonToSegments(polygonsIdx[0]);
        var segmentsBottomCells = edge_1.polygonToSegments(polygonsIdx[1]);
        sideCells = getSideCells(segmentsTopCells, segmentsBottomCells);
        // TODO: refactor with transducers
        var cursor_1 = inputPolygons[0].length;
        var holesIdx = inputPolygons.slice(1).map(function (hole) {
            var ret = [
                transducers_1.range(cursor_1, cursor_1 + hole.length),
                transducers_1.range(positions.length / 2 + cursor_1, positions.length / 2 + cursor_1 + hole.length),
            ];
            cursor_1 += hole.length;
            return ret;
        });
        var holesSideCells = holesIdx.reduce(function (acc, holeIdx) {
            var segmentsTopCells = edge_1.polygonToSegments(holeIdx[0]);
            var segmentsBottomCells = edge_1.polygonToSegments(holeIdx[1]);
            var holeSideCells = getSideCells(segmentsTopCells, segmentsBottomCells);
            acc.push.apply(acc, __spread(holeSideCells));
            return acc;
        }, []);
        sideCells.push.apply(sideCells, __spread(holesSideCells));
    }
    cells.push.apply(cells, __spread(sideCells));
    return {
        positions: positions,
        cells: cells,
    };
}
exports.extrude = extrude;

},{"earcut":"../../../node_modules/earcut/src/earcut.js","../get-centroid":"../../../node_modules/@tstackgl/geometry/dist/calc/get-centroid.js","../../edge":"../../../node_modules/@tstackgl/geometry/dist/edge.js","../pivot":"../../../node_modules/@tstackgl/geometry/dist/calc/pivot.js","@thi.ng/transducers":"../../../node_modules/@thi.ng/transducers/index.js"}],"../../../node_modules/@tstackgl/geometry/dist/calc/angle-between.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_vec2_1 = __importDefault(require("gl-vec2"));
function angleBetweenSegments(v1, v2) {
    var dir1 = gl_vec2_1.default.set(gl_vec2_1.default.create(), v1[1][0] - v1[0][0], v1[1][1] - v1[0][1]);
    gl_vec2_1.default.normalize(dir1, dir1);
    var dir2 = gl_vec2_1.default.set(gl_vec2_1.default.create(), v2[1][0] - v2[0][0], v2[1][1] - v2[0][1]);
    gl_vec2_1.default.normalize(dir2, dir2);
    return Math.acos(gl_vec2_1.default.dot(dir1, dir2));
}
exports.angleBetweenSegments = angleBetweenSegments;
function angleBetween(dir1, dir2) {
    return Math.acos(gl_vec2_1.default.dot(dir1, dir2));
}
exports.angleBetween = angleBetween;
function angleBetweenPoints(p1, p2) {
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}
exports.angleBetweenPoints = angleBetweenPoints;

},{"gl-vec2":"../../../node_modules/gl-vec2/index.js"}],"../../../node_modules/@tstackgl/geometry/dist/shape/circle.js":[function(require,module,exports) {
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tr = __importStar(require("@thi.ng/transducers"));
function pointInCircle(t, radius, center) {
    if (center === void 0) { center = [0, 0]; }
    return [Math.cos(t) * radius + center[0], Math.sin(t) * radius + center[1]];
}
exports.pointInCircle = pointInCircle;
function circleShape(radius, center, density) {
    if (center === void 0) { center = [0, 0]; }
    if (density === void 0) { density = 10; }
    return __spread(tr.map(function (i) {
        var delta = (i / density) * Math.PI * 2;
        return pointInCircle(delta, radius, center);
    }, tr.range(density)));
}
exports.circleShape = circleShape;

},{"@thi.ng/transducers":"../../../node_modules/@thi.ng/transducers/index.js"}],"../../../node_modules/@tstackgl/geometry/dist/shape/primitive-icosahedron.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_vec3_1 = __importDefault(require("gl-vec3"));
// https://vorg.github.io/pex/docs/pex-gen/Icosahedron.html
// http://paulbourke.net/geometry/platonic/
function createIcosahedron(r) {
    if (r === void 0) { r = 0.5; }
    var phi = (1 + Math.sqrt(5)) / 2;
    var a = 1 / 2;
    var b = 1 / (2 * phi);
    var positions = [
        [0, b, -a],
        [b, a, 0],
        [-b, a, 0],
        [0, b, a],
        [0, -b, a],
        [-a, 0, b],
        [a, 0, b],
        [0, -b, -a],
        [a, 0, -b],
        [-a, 0, -b],
        [b, -a, 0],
        [-b, -a, 0],
    ].map(function (point) {
        gl_vec3_1.default.normalize(point, point);
        gl_vec3_1.default.scale(point, point, r);
        return point;
    });
    var cells = [
        [1, 0, 2],
        [2, 3, 1],
        [4, 3, 5],
        [6, 3, 4],
        [7, 0, 8],
        [9, 0, 7],
        [10, 4, 11],
        [11, 7, 10],
        [5, 2, 9],
        [9, 11, 5],
        [8, 1, 6],
        [6, 10, 8],
        [5, 3, 2],
        [1, 3, 6],
        [2, 0, 9],
        [8, 0, 1],
        [9, 7, 11],
        [10, 7, 8],
        [11, 4, 5],
        [6, 4, 10],
    ];
    var edges = [
        [0, 1],
        [0, 2],
        [0, 7],
        [0, 8],
        [0, 9],
        [1, 2],
        [1, 3],
        [1, 6],
        [1, 8],
        [2, 3],
        [2, 5],
        [2, 9],
        [3, 4],
        [3, 5],
        [3, 6],
        [4, 5],
        [4, 6],
        [4, 10],
        [4, 11],
        [5, 9],
        [5, 11],
        [6, 8],
        [6, 10],
        [7, 8],
        [7, 9],
        [7, 10],
        [7, 11],
        [8, 10],
        [9, 11],
        [10, 11],
    ];
    return {
        positions: positions,
        cells: cells,
        edges: edges,
    };
}
exports.createIcosahedron = createIcosahedron;

},{"gl-vec3":"../../../node_modules/gl-vec3/index.js"}],"../../../node_modules/@tstackgl/geometry/dist/shape/primitive-cylinder.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// from https://github.com/ataber/primitive-cylinder/blob/master/index.js
// but also with lateral quad
function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments) {
    var index = 0;
    var indexOffset = 0;
    var indexArray = [];
    var vertexCount = (radialSegments + 1) * (heightSegments + 1);
    var cellCount = radialSegments * heightSegments * 2;
    var normals = new Array(vertexCount);
    var vertices = new Array(vertexCount);
    var uvs = new Array(vertexCount);
    var cells = new Array(cellCount);
    var quadCells = new Array(cellCount / 2);
    var slope = (radiusBottom - radiusTop) / height;
    var thetaLength = 2.0 * Math.PI;
    for (var y = 0; y <= heightSegments; y++) {
        var indexRow = [];
        var v = y / heightSegments;
        var radius = v * (radiusBottom - radiusTop) + radiusTop;
        for (var x = 0; x <= radialSegments; x++) {
            var u = x / radialSegments;
            var theta = u * thetaLength;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            vertices[index] = [radius * sinTheta, -v * height + height / 2, radius * cosTheta];
            normals[index] = [sinTheta, slope, cosTheta];
            uvs[index] = [u, 1 - v];
            indexRow.push(index);
            index++;
        }
        indexArray.push(indexRow);
    }
    for (var x = 0; x < radialSegments; x++) {
        for (var y = 0; y < heightSegments; y++) {
            var i1 = indexArray[y][x];
            var i2 = indexArray[y + 1][x];
            var i3 = indexArray[y + 1][x + 1];
            var i4 = indexArray[y][x + 1];
            quadCells[indexOffset / 2] = [i1, i2, i3, i4];
            // face one
            cells[indexOffset] = [i1, i2, i4];
            indexOffset++;
            // face two
            cells[indexOffset] = [i2, i3, i4];
            indexOffset++;
        }
    }
    function generateCap(top) {
        var vertex = new Array(3).fill(0);
        var radius = top === true ? radiusTop : radiusBottom;
        var sign = top === true ? 1 : -1;
        var centerIndexStart = index;
        for (var x = 1; x <= radialSegments; x++) {
            vertices[index] = [0, (height * sign) / 2, 0];
            normals[index] = [0, sign, 0];
            uvs[index] = [0.5, 0.5];
            index++;
        }
        var centerIndexEnd = index;
        for (var x = 0; x <= radialSegments; x++) {
            var u = x / radialSegments;
            var theta = u * thetaLength;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            vertices[index] = [radius * sinTheta, (height * sign) / 2, radius * cosTheta];
            normals[index] = [0, sign, 0];
            uvs[index] = [cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5];
            index++;
        }
        for (var x = 0; x < radialSegments; x++) {
            var c = centerIndexStart + x;
            var i = centerIndexEnd + x;
            if (top === true) {
                // face top
                cells[indexOffset] = [i, i + 1, c];
                indexOffset++;
            }
            else {
                // face bottom
                cells[indexOffset] = [i + 1, i, c];
                indexOffset++;
            }
        }
    }
    if (radiusTop > 0) {
        generateCap(true);
    }
    if (radiusBottom > 0) {
        generateCap(false);
    }
    return {
        positions: vertices,
        uvs: uvs,
        cells: cells,
        normals: normals,
        quadCells: quadCells,
    };
}
exports.createCylinder = createCylinder;

},{}],"../../../node_modules/@tstackgl/geometry/dist/shape/primitive-octahedron.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_vec3_1 = __importDefault(require("gl-vec3"));
// https://vorg.github.io/pex/docs/pex-gen/Octahedron.html
// http://paulbourke.net/geometry/platonic/
function createOctahedron(r) {
    if (r === void 0) { r = 0.5; }
    var a = 1 / (2 * Math.sqrt(2));
    var b = 1 / 2;
    var s3 = Math.sqrt(3);
    var s6 = Math.sqrt(6);
    var positions = [
        [-a, 0, a],
        [a, 0, a],
        [a, 0, -a],
        [-a, 0, -a],
        [0, b, 0],
        [0, -b, 0],
    ].map(function (point) {
        gl_vec3_1.default.normalize(point, point);
        gl_vec3_1.default.scale(point, point, r);
        return point;
    });
    var cells = [
        [3, 0, 4],
        [2, 3, 4],
        [1, 2, 4],
        [0, 1, 4],
        [3, 2, 5],
        [0, 3, 5],
        [2, 1, 5],
        [1, 0, 5],
    ];
    var edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 4],
        [1, 4],
        [2, 4],
        [3, 4],
        [0, 5],
        [1, 5],
        [2, 5],
        [3, 5],
    ];
    return {
        positions: positions,
        cells: cells,
        edges: edges,
    };
}
exports.createOctahedron = createOctahedron;

},{"gl-vec3":"../../../node_modules/gl-vec3/index.js"}],"../../../node_modules/@tstackgl/geometry/dist/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./calc/get-centroid"));
__export(require("./calc/extrude/extrude"));
__export(require("./calc/angle-between"));
__export(require("./edge"));
__export(require("./shape/circle"));
__export(require("./shape/primitive-icosahedron"));
__export(require("./shape/primitive-cylinder"));
__export(require("./shape/primitive-octahedron"));

},{"./calc/get-centroid":"../../../node_modules/@tstackgl/geometry/dist/calc/get-centroid.js","./calc/extrude/extrude":"../../../node_modules/@tstackgl/geometry/dist/calc/extrude/extrude.js","./calc/angle-between":"../../../node_modules/@tstackgl/geometry/dist/calc/angle-between.js","./edge":"../../../node_modules/@tstackgl/geometry/dist/edge.js","./shape/circle":"../../../node_modules/@tstackgl/geometry/dist/shape/circle.js","./shape/primitive-icosahedron":"../../../node_modules/@tstackgl/geometry/dist/shape/primitive-icosahedron.js","./shape/primitive-cylinder":"../../../node_modules/@tstackgl/geometry/dist/shape/primitive-cylinder.js","./shape/primitive-octahedron":"../../../node_modules/@tstackgl/geometry/dist/shape/primitive-octahedron.js"}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-axes.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_combine_normals_1 = require("@tstackgl/geometry/src/mesh-combine-normals");
var regl_1 = __importDefault(require("regl"));
var gl_mat4_1 = __importDefault(require("gl-mat4"));
var gl_vec3_1 = __importDefault(require("gl-vec3"));
var geometry_1 = require("@tstackgl/geometry");
var vert = "\n  precision mediump float;\n  uniform mat4 projection, view;\n  attribute vec3 position;\n  attribute vec3 colorAttribute;\n  varying vec3 color;\n  void main () {\n    color = colorAttribute;\n    gl_Position = projection * view * vec4(position, 1);\n  }\n";
var frag = "\n  precision mediump float;\n  varying vec3 color;\n  void main () {\n    gl_FragColor = vec4(color, 1.0);\n  }\n";
// ----------------------------------------------------------------- lines
function createAxesLines(regl, scale) {
    var mesh = {
        positions: [[0, 0, 0], [scale, 0, 0], [0, 0, 0], [0, scale, 0], [0, 0, 0], [0, 0, scale]],
        cells: [[0, 1], [2, 3], [4, 5]],
        colors: [[1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 1], [0, 0, 1]],
    };
    return regl({
        vert: vert,
        frag: frag,
        attributes: {
            position: mesh.positions,
            colorAttribute: mesh.colors,
        },
        elements: mesh.cells,
    });
}
// ----------------------------------------------------------------- arrows
function createAxes(regl, scale) {
    function getAxis(translationVec, colorVec, rotationVec) {
        var arrow = geometry_1.createCylinder(0, 0.1, 0.22, 4, 1);
        arrow.positions = arrow.positions.map(function (position) {
            var mat = gl_mat4_1.default.create();
            gl_mat4_1.default.translate(mat, mat, translationVec);
            gl_mat4_1.default.rotate(mat, mat, Math.PI / 2, rotationVec);
            return gl_vec3_1.default.transformMat4(gl_vec3_1.default.create(), position, mat);
        });
        arrow.colors = arrow.positions.map(function (p) { return colorVec; });
        return arrow;
    }
    var xArrow = getAxis([scale, 0, 0], [1, 0, 0], [0, 0, -1]);
    var yArrow = getAxis([0, scale, 0], [0, 1, 0], [0, 1, 0]);
    var zArrow = getAxis([0, 0, scale], [0, 0, 1], [1, 0, 0]);
    var meshes = [xArrow, yArrow, zArrow];
    var mesh = mesh_combine_normals_1.combine(meshes);
    mesh.colors = [].concat(meshes.map(function (x) { return x.colors; }));
    return regl({
        vert: vert,
        frag: frag,
        attributes: {
            position: mesh.positions,
            colorAttribute: mesh.colors,
            createRegl: regl_1.default,
        },
        elements: mesh.cells,
    });
}
function createXYZ(regl, scale) {
    if (scale === void 0) { scale = 1; }
    var axes = createAxes(regl, scale);
    var axesLines = createAxesLines(regl, scale);
    function draw() {
        axes();
        axesLines();
    }
    return { draw: draw };
}
exports.createXYZ = createXYZ;

},{"@tstackgl/geometry/src/mesh-combine-normals":"../../../node_modules/@tstackgl/geometry/src/mesh-combine-normals.ts","regl":"../../../node_modules/regl/dist/regl.js","gl-mat4":"../../../node_modules/gl-mat4/index.js","gl-vec3":"../../../node_modules/gl-vec3/index.js","@tstackgl/geometry":"../../../node_modules/@tstackgl/geometry/dist/index.js"}],"../../../node_modules/vectors/normalize-nd.js":[function(require,module,exports) {
module.exports = normalize

function normalize(vec) {
  var mag = 0
  for (var n = 0; n < vec.length; n++) {
    mag += vec[n] * vec[n]
  }
  mag = Math.sqrt(mag)

  // avoid dividing by zero
  if (mag === 0) {
    return Array.apply(null, new Array(vec.length)).map(Number.prototype.valueOf, 0)
  }

  for (var n = 0; n < vec.length; n++) {
    vec[n] /= mag
  }

  return vec
}

},{}],"../../../node_modules/icosphere/index.js":[function(require,module,exports) {
var normalize = require('vectors/normalize-nd')

module.exports = icosphere

function icosphere(subdivisions) {
  subdivisions = +subdivisions|0

  var positions = []
  var faces = []
  var t = 0.5 + Math.sqrt(5) / 2

  positions.push([-1, +t,  0])
  positions.push([+1, +t,  0])
  positions.push([-1, -t,  0])
  positions.push([+1, -t,  0])

  positions.push([ 0, -1, +t])
  positions.push([ 0, +1, +t])
  positions.push([ 0, -1, -t])
  positions.push([ 0, +1, -t])

  positions.push([+t,  0, -1])
  positions.push([+t,  0, +1])
  positions.push([-t,  0, -1])
  positions.push([-t,  0, +1])

  faces.push([0, 11, 5])
  faces.push([0, 5, 1])
  faces.push([0, 1, 7])
  faces.push([0, 7, 10])
  faces.push([0, 10, 11])

  faces.push([1, 5, 9])
  faces.push([5, 11, 4])
  faces.push([11, 10, 2])
  faces.push([10, 7, 6])
  faces.push([7, 1, 8])

  faces.push([3, 9, 4])
  faces.push([3, 4, 2])
  faces.push([3, 2, 6])
  faces.push([3, 6, 8])
  faces.push([3, 8, 9])

  faces.push([4, 9, 5])
  faces.push([2, 4, 11])
  faces.push([6, 2, 10])
  faces.push([8, 6, 7])
  faces.push([9, 8, 1])

  var complex = {
      cells: faces
    , positions: positions
  }

  while (subdivisions-- > 0) {
    complex = subdivide(complex)
  }

  positions = complex.positions
  for (var i = 0; i < positions.length; i++) {
    normalize(positions[i])
  }

  return complex
}

// TODO: work out the second half of loop subdivision
// and extract this into its own module.
function subdivide(complex) {
  var positions = complex.positions
  var cells = complex.cells

  var newCells = []
  var newPositions = []
  var midpoints = {}
  var f = [0, 1, 2]
  var l = 0

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var c0 = cell[0]
    var c1 = cell[1]
    var c2 = cell[2]
    var v0 = positions[c0]
    var v1 = positions[c1]
    var v2 = positions[c2]

    var a = getMidpoint(v0, v1)
    var b = getMidpoint(v1, v2)
    var c = getMidpoint(v2, v0)

    var ai = newPositions.indexOf(a)
    if (ai === -1) ai = l++, newPositions.push(a)
    var bi = newPositions.indexOf(b)
    if (bi === -1) bi = l++, newPositions.push(b)
    var ci = newPositions.indexOf(c)
    if (ci === -1) ci = l++, newPositions.push(c)

    var v0i = newPositions.indexOf(v0)
    if (v0i === -1) v0i = l++, newPositions.push(v0)
    var v1i = newPositions.indexOf(v1)
    if (v1i === -1) v1i = l++, newPositions.push(v1)
    var v2i = newPositions.indexOf(v2)
    if (v2i === -1) v2i = l++, newPositions.push(v2)

    newCells.push([v0i, ai, ci])
    newCells.push([v1i, bi, ai])
    newCells.push([v2i, ci, bi])
    newCells.push([ai, bi, ci])
  }

  return {
      cells: newCells
    , positions: newPositions
  }

  // reuse midpoint vertices between iterations.
  // Otherwise, there'll be duplicate vertices in the final
  // mesh, resulting in sharp edges.
  function getMidpoint(a, b) {
    var point = midpoint(a, b)
    var pointKey = pointToKey(point)
    var cachedPoint = midpoints[pointKey]
    if (cachedPoint) {
      return cachedPoint
    } else {
      return midpoints[pointKey] = point
    }
  }

  function pointToKey(point) {
    return point[0].toPrecision(6) + ','
         + point[1].toPrecision(6) + ','
         + point[2].toPrecision(6)
  }

  function midpoint(a, b) {
    return [
        (a[0] + b[0]) / 2
      , (a[1] + b[1]) / 2
      , (a[2] + b[2]) / 2
    ]
  }
}

},{"vectors/normalize-nd":"../../../node_modules/vectors/normalize-nd.js"}],"../../../node_modules/primitive-icosphere/lib/is-uv-seam.js":[function(require,module,exports) {
var cross2 = require('gl-vec2/cross')
var sub2 = require('gl-vec2/subtract')

var tmpX = [0, 0, 0]
var tmpY = [0, 0, 0]

module.exports = function isUVBroken (uvs, a, b, c) {
  var uvA = uvs[a]
  var uvB = uvs[b]
  var uvC = uvs[c]
  sub2(tmpX, uvB, uvA)
  sub2(tmpY, uvC, uvA)
  cross2(tmpX, tmpX, tmpY)
  return tmpX[2] < 0
}

},{"gl-vec2/cross":"../../../node_modules/gl-vec2/cross.js","gl-vec2/subtract":"../../../node_modules/gl-vec2/subtract.js"}],"../../../node_modules/primitive-icosphere/lib/fix-wrapped-uvs.js":[function(require,module,exports) {
var isSeam = require('./is-uv-seam')
var MIN = 0.25
var MAX = 0.75

module.exports = fixWrappedUVs

function fixWrappedUVs (mesh) {
  var positions = mesh.positions
  var cells = mesh.cells
  var uvs = mesh.uvs

  var newVertices = positions.slice()
  var newUvs = uvs.slice()
  var visited = {}

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]

    var a = cell[0]
    var b = cell[1]
    var c = cell[2]

    if (!isSeam(uvs, a, b, c)) {
      continue
    }

    var p0 = positions[a]
    var p1 = positions[b]
    var p2 = positions[c]
    var uv0 = uvs[a]
    var uv1 = uvs[b]
    var uv2 = uvs[c]

    if (uv0[0] < MIN) {
      a = revisit(visited, a, uv0, p0)
    }
    if (uv1[0] < MIN) {
      b = revisit(visited, b, uv1, p1)
    }
    if (uv2[0] < MIN) {
      c = revisit(visited, c, uv2, p2)
    }

    cell[0] = a
    cell[1] = b
    cell[2] = c
  }

  fixUVEdges(cells, newUvs)
  // modify mesh in place with new lists
  mesh.positions = newVertices
  mesh.uvs = newUvs

  function revisit (cache, face, uv, position) {
    if (!(face in cache)) {
      newVertices.push(position.slice())
      newUvs.push(uv.slice())
      var verticeIndex = newVertices.length - 1
      cache[face] = verticeIndex
      return verticeIndex
    } else {
      return cache[face]
    }
  }
}

function fixUVEdges (cells, uvs) {
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var uv0 = uvs[cell[0]]
    var uv1 = uvs[cell[1]]
    var uv2 = uvs[cell[2]]

    var max = Math.max(uv0[0], uv1[0], uv2[0])
    var min = Math.min(uv0[0], uv1[0], uv2[0])
    if (max > MAX && min < MIN) {
      if (uv0[0] < MIN) uv0[0] += 1
      if (uv1[0] < MIN) uv1[0] += 1
      if (uv2[0] < MIN) uv2[0] += 1
    }
  }
}

},{"./is-uv-seam":"../../../node_modules/primitive-icosphere/lib/is-uv-seam.js"}],"../../../node_modules/primitive-icosphere/lib/fix-pole-uvs.js":[function(require,module,exports) {
module.exports = fixPoleUVs
function fixPoleUVs (mesh) {
  var positions = mesh.positions
  var cells = mesh.cells
  var uvs = mesh.uvs

  var northIndex = firstYIndex(positions, 1)
  var southIndex = firstYIndex(positions, -1)
  if (northIndex === -1 || southIndex === -1) {
    // could not find any poles, bail early
    return
  }

  var newVertices = positions.slice()
  var newUvs = uvs.slice()
  var verticeIndex = newVertices.length - 1

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var a = cell[0]
    var b = cell[1]
    var c = cell[2]

    if (a === northIndex) {
      visit(cell, northIndex, b, c)
    } else if (a === southIndex) {
      visit(cell, southIndex, b, c)
    }
  }

  mesh.positions = newVertices
  mesh.uvs = newUvs

  function visit (cell, poleIndex, b, c) {
    var uv1 = uvs[b]
    var uv2 = uvs[c]
    uvs[poleIndex][0] = (uv1[0] + uv2[0]) / 2
    verticeIndex++
    newVertices.push(positions[poleIndex].slice())
    newUvs.push(uvs[poleIndex].slice())
    cell[0] = verticeIndex
  }
}

function firstYIndex (list, value) {
  for (var i = 0; i < list.length; i++) {
    var vec = list[i]
    if (Math.abs(vec[1] - value) <= 1e-4) {
      return i
    }
  }
  return -1
}

},{}],"../../../node_modules/primitive-icosphere/index.js":[function(require,module,exports) {
var icosphere = require('icosphere')
var normalize = require('gl-vec3/normalize')
var scale = require('gl-vec3/scale')
var fixWrappedUVs = require('./lib/fix-wrapped-uvs')
var fixPoles = require('./lib/fix-pole-uvs')

module.exports = function primitiveIcosphere (radius, opt) {
  opt = opt || {}
  radius = typeof radius !== 'undefined' ? radius : 1

  var subdivisions = typeof opt.subdivisions !== 'undefined' ? opt.subdivisions : 2
  var complex = icosphere(subdivisions)

  var normals = []
  var uvs = []
  var i, position

  for (i = 0; i < complex.positions.length; i++) {
    position = complex.positions[i]

    // get UV from unit icosphere
    var u = 0.5 * (-(Math.atan2(position[2], -position[0]) / Math.PI) + 1.0)
    var v = 0.5 + Math.asin(position[1]) / Math.PI
    uvs.push([ 1 - u, 1 - v ])
  }

  var mesh = {
    positions: complex.positions,
    cells: complex.cells,
    uvs: uvs,
    normals: normals
  }

  // attempt to fix some of the glaring seam issues
  fixPoles(mesh)
  fixWrappedUVs(mesh)

  // now determine normals
  for (i = 0; i < mesh.positions.length; i++) {
    position = mesh.positions[i]

    // get normal
    var normal = normalize([0, 0, 0], position)
    normals.push(normal)

    // and scale sphere to radius
    scale(position, position, radius)
  }

  return mesh
}

},{"icosphere":"../../../node_modules/icosphere/index.js","gl-vec3/normalize":"../../../node_modules/gl-vec3/normalize.js","gl-vec3/scale":"../../../node_modules/gl-vec3/scale.js","./lib/fix-wrapped-uvs":"../../../node_modules/primitive-icosphere/lib/fix-wrapped-uvs.js","./lib/fix-pole-uvs":"../../../node_modules/primitive-icosphere/lib/fix-pole-uvs.js"}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-debug.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var primitive_icosphere_1 = __importDefault(require("primitive-icosphere"));
var vert = "\nprecision mediump float;\n\nuniform mat4 projection, view;\nuniform vec3 translate;\nattribute vec3 position, normal;\n\nvoid main () {\n  vec4 mpos = projection * view * vec4(position + translate, 1.0);\n  gl_Position = mpos;\n}";
var frag = "\nprecision mediump float;\n\nuniform vec3 color;\n\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n}";
function createDrawPointDebug(regl, radius) {
    if (radius === void 0) { radius = 0.3; }
    var mesh = primitive_icosphere_1.default(radius, { subdivisions: 1 });
    var draw = regl({
        frag: frag,
        vert: vert,
        attributes: {
            position: function () { return mesh.positions; },
            normal: function () { return mesh.normals; },
        },
        uniforms: {
            color: regl.prop('color'),
            translate: regl.prop('translate'),
        },
        elements: function () { return mesh.cells; },
    });
    return {
        draw: draw,
    };
}
exports.createDrawPointDebug = createDrawPointDebug;

},{"primitive-icosphere":"../../../node_modules/primitive-icosphere/index.js"}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-mesh-unicolor.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vert = "\nprecision mediump float;\nuniform mat4 projection, view;\nattribute vec3 position;\nvoid main () {\n  vec4 mpos = projection * view * vec4(position, 1.0);\n  gl_Position = mpos;\n}";
var frag = "\nprecision mediump float;\nuniform vec4 color;\nvoid main () {\n  gl_FragColor = color;\n}";
function createDrawMeshUnicolor(regl, mesh) {
    var draw = regl({
        frag: frag,
        vert: vert,
        attributes: {
            position: function () { return mesh.positions; },
        },
        uniforms: {
            color: regl.prop('color'),
        },
        elements: function () { return mesh.cells; },
    });
    return {
        draw: draw,
    };
}
exports.createDrawMeshUnicolor = createDrawMeshUnicolor;

},{}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-mesh-wireframe.js":[function(require,module,exports) {
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var transducers_1 = require("@thi.ng/transducers");
var vert = "\nprecision mediump float;\nuniform mat4 projection, view, model;\nattribute vec3 position;\nvoid main () {\n  vec4 mpos = projection * view * model * vec4(position, 1.0);\n  gl_Position = mpos;\n}";
var frag = "\nprecision mediump float;\nuniform vec3 color;\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n}";
function createDrawMeshWireframe(regl, mesh) {
    // const input: Vec3[] = [[1, 0, 3], [3, 2, 1], [5, 4, 7]]
    // const expected = [[[1, 0], [0, 3], [3, 1]], [[3, 2], [2, 1], [1, 3]], [[5, 4], [4, 7], [7, 5]]]
    var triangleToSegments = function (_a) {
        var _b = __read(_a, 3), a = _b[0], b = _b[1], c = _b[2];
        return [[a, b], [b, c], [c, a]];
    };
    var wireframeCells = __spread(transducers_1.map(triangleToSegments, mesh.cells));
    var draw = regl({
        frag: frag,
        vert: vert,
        attributes: {
            position: function () { return mesh.positions; },
        },
        uniforms: {
            color: regl.prop('color'),
            model: regl.prop('model'),
        },
        elements: wireframeCells,
        primitive: 'lines',
    });
    return {
        draw: draw,
    };
}
exports.createDrawMeshWireframe = createDrawMeshWireframe;

},{"@thi.ng/transducers":"../../../node_modules/@thi.ng/transducers/index.js"}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-basic-mesh.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vert = "\nprecision mediump float;\n\nuniform mat4 projection, view, model;\nattribute vec3 position, normal;\nvarying vec3 vViewPos;\n\nvoid main () {\n  vec4 mpos = projection * view * model * vec4(position, 1.0);\n  vViewPos = -(projection * view * model * vec4(position, 1.0)).xyz;\n  gl_Position = mpos;\n}\n";
var frag = "\nprecision mediump float;\n#extension GL_OES_standard_derivatives: enable\n\nuniform vec3 diffuseColor, ambientColor, lightDirection;\nvarying vec3 vViewPos;\n\nvec3 faceNormal(vec3 pos) {\n  vec3 fdx = dFdx(pos);\n  vec3 fdy = dFdy(pos);\n  return normalize(cross(fdx, fdy));\n}\n\nvoid main () {\n  vec3 normal = faceNormal(vViewPos);\n\n  float brightness = max(\n    dot(\n      normalize(lightDirection),\n      normalize(normal)\n    ), 0.4);\n  vec3 lightColor = ambientColor + diffuseColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
function createBasicMesh(regl, mesh) {
    var draw = regl({
        vert: vert,
        frag: frag,
        attributes: {
            position: mesh.positions,
        },
        uniforms: {
            model: regl.prop('model'),
            diffuseColor: regl.prop('diffuseColor'),
            ambientColor: regl.prop('ambientColor'),
            lightDirection: regl.prop('lightDirection'),
        },
        elements: function () { return mesh.cells; },
    });
    return { draw: draw };
}
exports.createBasicMesh = createBasicMesh;

},{}],"../../../node_modules/normals/normals.js":[function(require,module,exports) {
var DEFAULT_NORMALS_EPSILON = 1e-6;
var DEFAULT_FACE_EPSILON = 1e-6;

//Estimate the vertex normals of a mesh
exports.vertexNormals = function(faces, positions, specifiedEpsilon) {

  var N         = positions.length;
  var normals   = new Array(N);
  var epsilon   = specifiedEpsilon === void(0) ? DEFAULT_NORMALS_EPSILON : specifiedEpsilon;

  //Initialize normal array
  for(var i=0; i<N; ++i) {
    normals[i] = [0.0, 0.0, 0.0];
  }

  //Walk over all the faces and add per-vertex contribution to normal weights
  for(var i=0; i<faces.length; ++i) {
    var f = faces[i];
    var p = 0;
    var c = f[f.length-1];
    var n = f[0];
    for(var j=0; j<f.length; ++j) {

      //Shift indices back
      p = c;
      c = n;
      n = f[(j+1) % f.length];

      var v0 = positions[p];
      var v1 = positions[c];
      var v2 = positions[n];

      //Compute infineteismal arcs
      var d01 = new Array(3);
      var m01 = 0.0;
      var d21 = new Array(3);
      var m21 = 0.0;
      for(var k=0; k<3; ++k) {
        d01[k] = v0[k]  - v1[k];
        m01   += d01[k] * d01[k];
        d21[k] = v2[k]  - v1[k];
        m21   += d21[k] * d21[k];
      }

      //Accumulate values in normal
      if(m01 * m21 > epsilon) {
        var norm = normals[c];
        var w = 1.0 / Math.sqrt(m01 * m21);
        for(var k=0; k<3; ++k) {
          var u = (k+1)%3;
          var v = (k+2)%3;
          norm[k] += w * (d21[u] * d01[v] - d21[v] * d01[u]);
        }
      }
    }
  }

  //Scale all normals to unit length
  for(var i=0; i<N; ++i) {
    var norm = normals[i];
    var m = 0.0;
    for(var k=0; k<3; ++k) {
      m += norm[k] * norm[k];
    }
    if(m > epsilon) {
      var w = 1.0 / Math.sqrt(m);
      for(var k=0; k<3; ++k) {
        norm[k] *= w;
      }
    } else {
      for(var k=0; k<3; ++k) {
        norm[k] = 0.0;
      }
    }
  }

  //Return the resulting set of patches
  return normals;
}

//Compute face normals of a mesh
exports.faceNormals = function(faces, positions, specifiedEpsilon) {

  var N         = faces.length;
  var normals   = new Array(N);
  var epsilon   = specifiedEpsilon === void(0) ? DEFAULT_FACE_EPSILON : specifiedEpsilon;

  for(var i=0; i<N; ++i) {
    var f = faces[i];
    var pos = new Array(3);
    for(var j=0; j<3; ++j) {
      pos[j] = positions[f[j]];
    }

    var d01 = new Array(3);
    var d21 = new Array(3);
    for(var j=0; j<3; ++j) {
      d01[j] = pos[1][j] - pos[0][j];
      d21[j] = pos[2][j] - pos[0][j];
    }

    var n = new Array(3);
    var l = 0.0;
    for(var j=0; j<3; ++j) {
      var u = (j+1)%3;
      var v = (j+2)%3;
      n[j] = d01[u] * d21[v] - d01[v] * d21[u];
      l += n[j] * n[j];
    }
    if(l > epsilon) {
      l = 1.0 / Math.sqrt(l);
    } else {
      l = 0.0;
    }
    for(var j=0; j<3; ++j) {
      n[j] *= l;
    }
    normals[i] = n;
  }
  return normals;
}



},{}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-normal-lines.js":[function(require,module,exports) {
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var normals_1 = require("normals");
var geometry_1 = require("@tstackgl/geometry");
var gl_vec3_1 = __importDefault(require("gl-vec3"));
var transducers_1 = require("@thi.ng/transducers");
var vert = "\nprecision mediump float;\nuniform mat4 projection, view;\nattribute vec3 position, color;\nvarying vec3 vColor;\nvoid main () {\n  vec4 mpos = projection * view * vec4(position, 1.0);\n  gl_Position = mpos;\n  vColor = color;\n}";
var frag = "\nprecision mediump float;\nvarying vec3 vColor;\nvoid main () {\n  gl_FragColor = vec4(vColor, 1.0);\n}";
function createFaceNormalLines(regl, mesh, len) {
    if (len === void 0) { len = 1; }
    var faceNormalsArray = normals_1.faceNormals(mesh.cells, mesh.positions);
    var colors = __spread(transducers_1.map(function (x) { return [x[0] / 2 + 0.5, x[1] / 2 + 0.5, x[2] / 2 + 0.5]; }, transducers_1.mapcat(function (x) { return [x, x]; }, faceNormalsArray)));
    console.log({ colors: colors });
    var centersArray = geometry_1.getCentroidFromCells(mesh.cells, mesh.positions);
    var p1Array = centersArray.map(function (p0, i) {
        var out = gl_vec3_1.default.create();
        var normalScaled = gl_vec3_1.default.scale(out, faceNormalsArray[i], len);
        return gl_vec3_1.default.add(out, p0, normalScaled);
    });
    var positions = __spread(transducers_1.mapcat(function (x) { return x; }, transducers_1.tuples(centersArray, p1Array)));
    var cellsLen = centersArray.length * 2;
    var cells = __spread(transducers_1.partition(2, __spread(transducers_1.range(cellsLen))));
    var draw = regl({
        frag: frag,
        vert: vert,
        attributes: {
            position: positions,
            color: colors,
        },
        uniforms: {},
        elements: cells,
    });
    return {
        draw: draw,
    };
}
exports.createFaceNormalLines = createFaceNormalLines;

},{"normals":"../../../node_modules/normals/normals.js","@tstackgl/geometry":"../../../node_modules/@tstackgl/geometry/dist/index.js","gl-vec3":"../../../node_modules/gl-vec3/index.js","@thi.ng/transducers":"../../../node_modules/@thi.ng/transducers/index.js"}],"../../../node_modules/@tstackgl/regl-draw/dist/draw-normal-mesh.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://stackoverflow.com/questions/19728950/three-js-meshnormalmaterial-default-color
// https://stackoverflow.com/questions/47710377/how-to-implement-meshnormalmaterial-in-three-js-by-glsl#47710795
var vert = "\nprecision mediump float;\n\nuniform mat4 projection, view, model;\nattribute vec3 position, normal;\nvarying vec3 vViewPos;\n\nvoid main () {\n  vec4 mpos = projection * view * model * vec4(position, 1.0);\n  vViewPos = -(projection * view * model * vec4(position, 1.0)).xyz;\n  gl_Position = mpos;\n}\n";
var frag = "\nprecision mediump float;\n\nvarying vec3 vViewPos;\n\n#extension GL_OES_standard_derivatives: enable\n\nvec3 faceNormal(vec3 pos) {\n  vec3 fdx = dFdx(pos);\n  vec3 fdy = dFdy(pos);\n  return normalize(cross(fdx, fdy));\n}\n\n\nvoid main () {\n\n  vec3 normal = faceNormal(vViewPos);\n  vec3 view_nv  = normal;\n  vec3 nv_color = view_nv * 0.5 + 0.5; \n   gl_FragColor  = vec4(nv_color, 1.0);\n}\n";
function createNormalMesh(regl, mesh) {
    var draw = regl({
        vert: vert,
        frag: frag,
        attributes: {
            position: mesh.positions,
        },
        uniforms: {
            model: regl.prop('model'),
        },
        elements: function () { return mesh.cells; },
    });
    return { draw: draw };
}
exports.createNormalMesh = createNormalMesh;

},{}],"../../../node_modules/@tstackgl/regl-draw/dist/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./frameCatch"));
__export(require("./draw-axes"));
__export(require("./draw-debug"));
__export(require("./draw-mesh-unicolor"));
__export(require("./draw-mesh-wireframe"));
__export(require("./draw-basic-mesh"));
__export(require("./draw-normal-lines"));
__export(require("./draw-normal-mesh"));

},{"./frameCatch":"../../../node_modules/@tstackgl/regl-draw/dist/frameCatch.js","./draw-axes":"../../../node_modules/@tstackgl/regl-draw/dist/draw-axes.js","./draw-debug":"../../../node_modules/@tstackgl/regl-draw/dist/draw-debug.js","./draw-mesh-unicolor":"../../../node_modules/@tstackgl/regl-draw/dist/draw-mesh-unicolor.js","./draw-mesh-wireframe":"../../../node_modules/@tstackgl/regl-draw/dist/draw-mesh-wireframe.js","./draw-basic-mesh":"../../../node_modules/@tstackgl/regl-draw/dist/draw-basic-mesh.js","./draw-normal-lines":"../../../node_modules/@tstackgl/regl-draw/dist/draw-normal-lines.js","./draw-normal-mesh":"../../../node_modules/@tstackgl/regl-draw/dist/draw-normal-mesh.js"}],"../../../node_modules/mouse-event/mouse.js":[function(require,module,exports) {
'use strict'

function mouseButtons(ev) {
  if(typeof ev === 'object') {
    if('buttons' in ev) {
      return ev.buttons
    } else if('which' in ev) {
      var b = ev.which
      if(b === 2) {
        return 4
      } else if(b === 3) {
        return 2
      } else if(b > 0) {
        return 1<<(b-1)
      }
    } else if('button' in ev) {
      var b = ev.button
      if(b === 1) {
        return 4
      } else if(b === 2) {
        return 2
      } else if(b >= 0) {
        return 1<<b
      }
    }
  }
  return 0
}
exports.buttons = mouseButtons

function mouseElement(ev) {
  return ev.target || ev.srcElement || window
}
exports.element = mouseElement

function mouseRelativeX(ev) {
  if(typeof ev === 'object') {
    if('offsetX' in ev) {
      return ev.offsetX
    }
    var target = mouseElement(ev)
    var bounds = target.getBoundingClientRect()
    return ev.clientX - bounds.left
  }
  return 0
}
exports.x = mouseRelativeX

function mouseRelativeY(ev) {
  if(typeof ev === 'object') {
    if('offsetY' in ev) {
      return ev.offsetY
    }
    var target = mouseElement(ev)
    var bounds = target.getBoundingClientRect()
    return ev.clientY - bounds.top
  }
  return 0
}
exports.y = mouseRelativeY

},{}],"../../../node_modules/mouse-change/mouse-listen.js":[function(require,module,exports) {
'use strict'

module.exports = mouseListen

var mouse = require('mouse-event')

function mouseListen (element, callback) {
  if (!callback) {
    callback = element
    element = window
  }

  var buttonState = 0
  var x = 0
  var y = 0
  var mods = {
    shift: false,
    alt: false,
    control: false,
    meta: false
  }
  var attached = false

  function updateMods (ev) {
    var changed = false
    if ('altKey' in ev) {
      changed = changed || ev.altKey !== mods.alt
      mods.alt = !!ev.altKey
    }
    if ('shiftKey' in ev) {
      changed = changed || ev.shiftKey !== mods.shift
      mods.shift = !!ev.shiftKey
    }
    if ('ctrlKey' in ev) {
      changed = changed || ev.ctrlKey !== mods.control
      mods.control = !!ev.ctrlKey
    }
    if ('metaKey' in ev) {
      changed = changed || ev.metaKey !== mods.meta
      mods.meta = !!ev.metaKey
    }
    return changed
  }

  function handleEvent (nextButtons, ev) {
    var nextX = mouse.x(ev)
    var nextY = mouse.y(ev)
    if ('buttons' in ev) {
      nextButtons = ev.buttons | 0
    }
    if (nextButtons !== buttonState ||
      nextX !== x ||
      nextY !== y ||
      updateMods(ev)) {
      buttonState = nextButtons | 0
      x = nextX || 0
      y = nextY || 0
      callback && callback(buttonState, x, y, mods)
    }
  }

  function clearState (ev) {
    handleEvent(0, ev)
  }

  function handleBlur () {
    if (buttonState ||
      x ||
      y ||
      mods.shift ||
      mods.alt ||
      mods.meta ||
      mods.control) {
      x = y = 0
      buttonState = 0
      mods.shift = mods.alt = mods.control = mods.meta = false
      callback && callback(0, 0, 0, mods)
    }
  }

  function handleMods (ev) {
    if (updateMods(ev)) {
      callback && callback(buttonState, x, y, mods)
    }
  }

  function handleMouseMove (ev) {
    if (mouse.buttons(ev) === 0) {
      handleEvent(0, ev)
    } else {
      handleEvent(buttonState, ev)
    }
  }

  function handleMouseDown (ev) {
    handleEvent(buttonState | mouse.buttons(ev), ev)
  }

  function handleMouseUp (ev) {
    handleEvent(buttonState & ~mouse.buttons(ev), ev)
  }

  function attachListeners () {
    if (attached) {
      return
    }
    attached = true

    element.addEventListener('mousemove', handleMouseMove)

    element.addEventListener('mousedown', handleMouseDown)

    element.addEventListener('mouseup', handleMouseUp)

    element.addEventListener('mouseleave', clearState)
    element.addEventListener('mouseenter', clearState)
    element.addEventListener('mouseout', clearState)
    element.addEventListener('mouseover', clearState)

    element.addEventListener('blur', handleBlur)

    element.addEventListener('keyup', handleMods)
    element.addEventListener('keydown', handleMods)
    element.addEventListener('keypress', handleMods)

    if (element !== window) {
      window.addEventListener('blur', handleBlur)

      window.addEventListener('keyup', handleMods)
      window.addEventListener('keydown', handleMods)
      window.addEventListener('keypress', handleMods)
    }
  }

  function detachListeners () {
    if (!attached) {
      return
    }
    attached = false

    element.removeEventListener('mousemove', handleMouseMove)

    element.removeEventListener('mousedown', handleMouseDown)

    element.removeEventListener('mouseup', handleMouseUp)

    element.removeEventListener('mouseleave', clearState)
    element.removeEventListener('mouseenter', clearState)
    element.removeEventListener('mouseout', clearState)
    element.removeEventListener('mouseover', clearState)

    element.removeEventListener('blur', handleBlur)

    element.removeEventListener('keyup', handleMods)
    element.removeEventListener('keydown', handleMods)
    element.removeEventListener('keypress', handleMods)

    if (element !== window) {
      window.removeEventListener('blur', handleBlur)

      window.removeEventListener('keyup', handleMods)
      window.removeEventListener('keydown', handleMods)
      window.removeEventListener('keypress', handleMods)
    }
  }

  // Attach listeners
  attachListeners()

  var result = {
    element: element
  }

  Object.defineProperties(result, {
    enabled: {
      get: function () { return attached },
      set: function (f) {
        if (f) {
          attachListeners()
        } else {
          detachListeners()
        }
      },
      enumerable: true
    },
    buttons: {
      get: function () { return buttonState },
      enumerable: true
    },
    x: {
      get: function () { return x },
      enumerable: true
    },
    y: {
      get: function () { return y },
      enumerable: true
    },
    mods: {
      get: function () { return mods },
      enumerable: true
    }
  })

  return result
}

},{"mouse-event":"../../../node_modules/mouse-event/mouse.js"}],"../../../node_modules/parse-unit/index.js":[function(require,module,exports) {
module.exports = function parseUnit(str, out) {
    if (!out)
        out = [ 0, '' ]

    str = String(str)
    var num = parseFloat(str, 10)
    out[0] = num
    out[1] = str.match(/[\d.\-\+]*\s*(.*)/)[1] || ''
    return out
}
},{}],"../../../node_modules/to-px/browser.js":[function(require,module,exports) {
'use strict'

var parseUnit = require('parse-unit')

module.exports = toPX

var PIXELS_PER_INCH = getSizeBrutal('in', document.body) // 96


function getPropertyInPX(element, prop) {
  var parts = parseUnit(getComputedStyle(element).getPropertyValue(prop))
  return parts[0] * toPX(parts[1], element)
}

//This brutal hack is needed
function getSizeBrutal(unit, element) {
  var testDIV = document.createElement('div')
  testDIV.style['height'] = '128' + unit
  element.appendChild(testDIV)
  var size = getPropertyInPX(testDIV, 'height') / 128
  element.removeChild(testDIV)
  return size
}

function toPX(str, element) {
  if (!str) return null

  element = element || document.body
  str = (str + '' || 'px').trim().toLowerCase()
  if(element === window || element === document) {
    element = document.body
  }

  switch(str) {
    case '%':  //Ambiguous, not sure if we should use width or height
      return element.clientHeight / 100.0
    case 'ch':
    case 'ex':
      return getSizeBrutal(str, element)
    case 'em':
      return getPropertyInPX(element, 'font-size')
    case 'rem':
      return getPropertyInPX(document.body, 'font-size')
    case 'vw':
      return window.innerWidth/100
    case 'vh':
      return window.innerHeight/100
    case 'vmin':
      return Math.min(window.innerWidth, window.innerHeight) / 100
    case 'vmax':
      return Math.max(window.innerWidth, window.innerHeight) / 100
    case 'in':
      return PIXELS_PER_INCH
    case 'cm':
      return PIXELS_PER_INCH / 2.54
    case 'mm':
      return PIXELS_PER_INCH / 25.4
    case 'pt':
      return PIXELS_PER_INCH / 72
    case 'pc':
      return PIXELS_PER_INCH / 6
    case 'px':
      return 1
  }

  // detect number of units
  var parts = parseUnit(str)
  if (!isNaN(parts[0]) && parts[1]) {
    var px = toPX(parts[1], element)
    return typeof px === 'number' ? parts[0] * px : null
  }

  return null
}

},{"parse-unit":"../../../node_modules/parse-unit/index.js"}],"../../../node_modules/mouse-wheel/wheel.js":[function(require,module,exports) {
'use strict'

var toPX = require('to-px')

module.exports = mouseWheelListen

function mouseWheelListen(element, callback, noScroll) {
  if(typeof element === 'function') {
    noScroll = !!callback
    callback = element
    element = window
  }
  var lineHeight = toPX('ex', element)
  var listener = function(ev) {
    if(noScroll) {
      ev.preventDefault()
    }
    var dx = ev.deltaX || 0
    var dy = ev.deltaY || 0
    var dz = ev.deltaZ || 0
    var mode = ev.deltaMode
    var scale = 1
    switch(mode) {
      case 1:
        scale = lineHeight
      break
      case 2:
        scale = window.innerHeight
      break
    }
    dx *= scale
    dy *= scale
    dz *= scale
    if(dx || dy || dz) {
      return callback(dx, dy, dz, ev)
    }
  }
  element.addEventListener('wheel', listener)
  return listener
}

},{"to-px":"../../../node_modules/to-px/browser.js"}],"../../../node_modules/regl-camera/regl-camera.js":[function(require,module,exports) {
var mouseChange = require('mouse-change')
var mouseWheel = require('mouse-wheel')
var identity = require('gl-mat4/identity')
var perspective = require('gl-mat4/perspective')
var lookAt = require('gl-mat4/lookAt')

module.exports = createCamera

var isBrowser = typeof window !== 'undefined'

function createCamera (regl, props_) {
  var props = props_ || {}

  // Preserve backward-compatibilty while renaming preventDefault -> noScroll
  if (typeof props.noScroll === 'undefined') {
    props.noScroll = props.preventDefault;
  }

  var cameraState = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    center: new Float32Array(props.center || 3),
    theta: props.theta || 0,
    phi: props.phi || 0,
    distance: Math.log(props.distance || 10.0),
    eye: new Float32Array(3),
    up: new Float32Array(props.up || [0, 1, 0]),
    fovy: props.fovy || Math.PI / 4.0,
    near: typeof props.near !== 'undefined' ? props.near : 0.01,
    far: typeof props.far !== 'undefined' ? props.far : 1000.0,
    noScroll: typeof props.noScroll !== 'undefined' ? props.noScroll : false,
    flipY: !!props.flipY,
    dtheta: 0,
    dphi: 0,
    rotationSpeed: typeof props.rotationSpeed !== 'undefined' ? props.rotationSpeed : 1,
    zoomSpeed: typeof props.zoomSpeed !== 'undefined' ? props.zoomSpeed : 1,
    renderOnDirty: typeof props.renderOnDirty !== undefined ? !!props.renderOnDirty : false
  }

  var element = props.element
  var damping = typeof props.damping !== 'undefined' ? props.damping : 0.9

  var right = new Float32Array([1, 0, 0])
  var front = new Float32Array([0, 0, 1])

  var minDistance = Math.log('minDistance' in props ? props.minDistance : 0.1)
  var maxDistance = Math.log('maxDistance' in props ? props.maxDistance : 1000)

  var ddistance = 0

  var prevX = 0
  var prevY = 0

  if (isBrowser && props.mouse !== false) {
    var source = element || regl._gl.canvas

    function getWidth () {
      return element ? element.offsetWidth : window.innerWidth
    }

    function getHeight () {
      return element ? element.offsetHeight : window.innerHeight
    }

    mouseChange(source, function (buttons, x, y) {
      if (buttons & 1) {
        var dx = (x - prevX) / getWidth()
        var dy = (y - prevY) / getHeight()

        cameraState.dtheta += cameraState.rotationSpeed * 4.0 * dx
        cameraState.dphi += cameraState.rotationSpeed * 4.0 * dy
        cameraState.dirty = true;
      }
      prevX = x
      prevY = y
    })

    mouseWheel(source, function (dx, dy) {
      ddistance += dy / getHeight() * cameraState.zoomSpeed
      cameraState.dirty = true;
    }, props.noScroll)
  }

  function damp (x) {
    var xd = x * damping
    if (Math.abs(xd) < 0.1) {
      return 0
    }
    cameraState.dirty = true;
    return xd
  }

  function clamp (x, lo, hi) {
    return Math.min(Math.max(x, lo), hi)
  }

  function updateCamera (props) {
    Object.keys(props).forEach(function (prop) {
      cameraState[prop] = props[prop]
    })

    var center = cameraState.center
    var eye = cameraState.eye
    var up = cameraState.up
    var dtheta = cameraState.dtheta
    var dphi = cameraState.dphi

    cameraState.theta += dtheta
    cameraState.phi = clamp(
      cameraState.phi + dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0)
    cameraState.distance = clamp(
      cameraState.distance + ddistance,
      minDistance,
      maxDistance)

    cameraState.dtheta = damp(dtheta)
    cameraState.dphi = damp(dphi)
    ddistance = damp(ddistance)

    var theta = cameraState.theta
    var phi = cameraState.phi
    var r = Math.exp(cameraState.distance)

    var vf = r * Math.sin(theta) * Math.cos(phi)
    var vr = r * Math.cos(theta) * Math.cos(phi)
    var vu = r * Math.sin(phi)

    for (var i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i]
    }

    lookAt(cameraState.view, eye, center, up)
  }

  cameraState.dirty = true;

  var injectContext = regl({
    context: Object.assign({}, cameraState, {
      dirty: function () {
        return cameraState.dirty;
      },
      projection: function (context) {
        perspective(cameraState.projection,
          cameraState.fovy,
          context.viewportWidth / context.viewportHeight,
          cameraState.near,
          cameraState.far)
        if (cameraState.flipY) { cameraState.projection[5] *= -1 }
        return cameraState.projection
      }
    }),
    uniforms: Object.keys(cameraState).reduce(function (uniforms, name) {
      uniforms[name] = regl.context(name)
      return uniforms
    }, {})
  })

  function setupCamera (props, block) {
    if (typeof setupCamera.dirty !== 'undefined') {
      cameraState.dirty = setupCamera.dirty || cameraState.dirty
      setupCamera.dirty = undefined;
    }

    if (props && block) {
      cameraState.dirty = true;
    }

    if (cameraState.renderOnDirty && !cameraState.dirty) return;

    if (!block) {
      block = props
      props = {}
    }

    updateCamera(props)
    injectContext(block)
    cameraState.dirty = false;
  }

  Object.keys(cameraState).forEach(function (name) {
    setupCamera[name] = cameraState[name]
  })

  return setupCamera
}

},{"mouse-change":"../../../node_modules/mouse-change/mouse-listen.js","mouse-wheel":"../../../node_modules/mouse-wheel/wheel.js","gl-mat4/identity":"../../../node_modules/gl-mat4/identity.js","gl-mat4/perspective":"../../../node_modules/gl-mat4/perspective.js","gl-mat4/lookAt":"../../../node_modules/gl-mat4/lookAt.js"}],"../../../node_modules/defined/index.js":[function(require,module,exports) {
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],"../../../node_modules/primitive-torus/index.js":[function(require,module,exports) {
var defined = require('defined')
var sub = require('gl-vec3/subtract')
var normalize = require('gl-vec3/normalize')

module.exports = createTorusMesh
function createTorusMesh (opt) {
  opt = opt || {}
  var majorRadius = defined(opt.majorRadius, 1)
  var minorRadius = defined(opt.minorRadius, 0.25)
  var minorSegments = defined(opt.minorSegments, 32)
  var majorSegments = defined(opt.majorSegments, 64)
  var arc = defined(opt.arc, Math.PI * 2)
  var PI2 = Math.PI * 2

  var center = [0, 0, 0]
  var uvs = []
  var positions = []
  var cells = []
  var tmp = [0, 0, 0]
  var normals = []

  for (var j = 0; j <= minorSegments; j++) {
    for (var i = 0; i <= majorSegments; i++) {
      var u = i / majorSegments * arc
      var v = j / minorSegments * PI2

      center[0] = majorRadius * Math.cos(u)
      center[1] = majorRadius * Math.sin(u)

      var vertex = [
        (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u),
        (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u),
        minorRadius * Math.sin(v)
      ]
      positions.push(vertex)

      sub(tmp, vertex, center)
      normalize(tmp, tmp)
      normals.push(tmp.slice())
      uvs.push([ i / majorSegments, j / minorSegments ])
    }
  }

  for (var j = 1; j <= minorSegments; j++) {
    for (var i = 1; i <= majorSegments; i++) {
      var a = (majorSegments + 1) * j + i - 1
      var b = (majorSegments + 1) * (j - 1) + i - 1
      var c = (majorSegments + 1) * (j - 1) + i
      var d = (majorSegments + 1) * j + i

      cells.push([ a, b, d ])
      cells.push([ b, c, d ])
    }
  }

  return {
    uvs: uvs,
    cells: cells,
    normals: normals,
    positions: positions
  }
}

},{"defined":"../../../node_modules/defined/index.js","gl-vec3/subtract":"../../../node_modules/gl-vec3/subtract.js","gl-vec3/normalize":"../../../node_modules/gl-vec3/normalize.js"}],"../../../node_modules/gl-mat3/adjoint.js":[function(require,module,exports) {
module.exports = adjoint

/**
 * Calculates the adjugate of a mat3
 *
 * @alias mat3.adjoint
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function adjoint(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]

  out[0] = (a11 * a22 - a12 * a21)
  out[1] = (a02 * a21 - a01 * a22)
  out[2] = (a01 * a12 - a02 * a11)
  out[3] = (a12 * a20 - a10 * a22)
  out[4] = (a00 * a22 - a02 * a20)
  out[5] = (a02 * a10 - a00 * a12)
  out[6] = (a10 * a21 - a11 * a20)
  out[7] = (a01 * a20 - a00 * a21)
  out[8] = (a00 * a11 - a01 * a10)

  return out
}

},{}],"../../../node_modules/gl-mat3/clone.js":[function(require,module,exports) {
module.exports = clone

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @alias mat3.clone
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
function clone(a) {
  var out = new Float32Array(9)
  out[0] = a[0]
  out[1] = a[1]
  out[2] = a[2]
  out[3] = a[3]
  out[4] = a[4]
  out[5] = a[5]
  out[6] = a[6]
  out[7] = a[7]
  out[8] = a[8]
  return out
}

},{}],"../../../node_modules/gl-mat3/copy.js":[function(require,module,exports) {
module.exports = copy

/**
 * Copy the values from one mat3 to another
 *
 * @alias mat3.copy
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function copy(out, a) {
  out[0] = a[0]
  out[1] = a[1]
  out[2] = a[2]
  out[3] = a[3]
  out[4] = a[4]
  out[5] = a[5]
  out[6] = a[6]
  out[7] = a[7]
  out[8] = a[8]
  return out
}

},{}],"../../../node_modules/gl-mat3/create.js":[function(require,module,exports) {
module.exports = create

/**
 * Creates a new identity mat3
 *
 * @alias mat3.create
 * @returns {mat3} a new 3x3 matrix
 */
function create() {
  var out = new Float32Array(9)
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 1
  out[5] = 0
  out[6] = 0
  out[7] = 0
  out[8] = 1
  return out
}

},{}],"../../../node_modules/gl-mat3/determinant.js":[function(require,module,exports) {
module.exports = determinant

/**
 * Calculates the determinant of a mat3
 *
 * @alias mat3.determinant
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]

  return a00 * (a22 * a11 - a12 * a21)
       + a01 * (a12 * a20 - a22 * a10)
       + a02 * (a21 * a10 - a11 * a20)
}

},{}],"../../../node_modules/gl-mat3/frob.js":[function(require,module,exports) {
module.exports = frob

/**
 * Returns Frobenius norm of a mat3
 *
 * @alias mat3.frob
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return Math.sqrt(
      a[0]*a[0]
    + a[1]*a[1]
    + a[2]*a[2]
    + a[3]*a[3]
    + a[4]*a[4]
    + a[5]*a[5]
    + a[6]*a[6]
    + a[7]*a[7]
    + a[8]*a[8]
  )
}

},{}],"../../../node_modules/gl-mat3/fromMat2.js":[function(require,module,exports) {
module.exports = fromMat2d

/**
 * Copies the values from a mat2d into a mat3
 *
 * @alias mat3.fromMat2d
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
function fromMat2d(out, a) {
  out[0] = a[0]
  out[1] = a[1]
  out[2] = 0

  out[3] = a[2]
  out[4] = a[3]
  out[5] = 0

  out[6] = a[4]
  out[7] = a[5]
  out[8] = 1

  return out
}

},{}],"../../../node_modules/gl-mat3/fromMat4.js":[function(require,module,exports) {
module.exports = fromMat4

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @alias mat3.fromMat4
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
function fromMat4(out, a) {
  out[0] = a[0]
  out[1] = a[1]
  out[2] = a[2]
  out[3] = a[4]
  out[4] = a[5]
  out[5] = a[6]
  out[6] = a[8]
  out[7] = a[9]
  out[8] = a[10]
  return out
}

},{}],"../../../node_modules/gl-mat3/fromQuat.js":[function(require,module,exports) {
module.exports = fromQuat

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @alias mat3.fromQuat
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
function fromQuat(out, q) {
  var x = q[0]
  var y = q[1]
  var z = q[2]
  var w = q[3]

  var x2 = x + x
  var y2 = y + y
  var z2 = z + z

  var xx = x * x2
  var yx = y * x2
  var yy = y * y2
  var zx = z * x2
  var zy = z * y2
  var zz = z * z2
  var wx = w * x2
  var wy = w * y2
  var wz = w * z2

  out[0] = 1 - yy - zz
  out[3] = yx - wz
  out[6] = zx + wy

  out[1] = yx + wz
  out[4] = 1 - xx - zz
  out[7] = zy - wx

  out[2] = zx - wy
  out[5] = zy + wx
  out[8] = 1 - xx - yy

  return out
}

},{}],"../../../node_modules/gl-mat3/identity.js":[function(require,module,exports) {
module.exports = identity

/**
 * Set a mat3 to the identity matrix
 *
 * @alias mat3.identity
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
function identity(out) {
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 1
  out[5] = 0
  out[6] = 0
  out[7] = 0
  out[8] = 1
  return out
}

},{}],"../../../node_modules/gl-mat3/invert.js":[function(require,module,exports) {
module.exports = invert

/**
 * Inverts a mat3
 *
 * @alias mat3.invert
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]

  var b01 = a22 * a11 - a12 * a21
  var b11 = -a22 * a10 + a12 * a20
  var b21 = a21 * a10 - a11 * a20

  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21

  if (!det) return null
  det = 1.0 / det

  out[0] = b01 * det
  out[1] = (-a22 * a01 + a02 * a21) * det
  out[2] = (a12 * a01 - a02 * a11) * det
  out[3] = b11 * det
  out[4] = (a22 * a00 - a02 * a20) * det
  out[5] = (-a12 * a00 + a02 * a10) * det
  out[6] = b21 * det
  out[7] = (-a21 * a00 + a01 * a20) * det
  out[8] = (a11 * a00 - a01 * a10) * det

  return out
}

},{}],"../../../node_modules/gl-mat3/multiply.js":[function(require,module,exports) {
module.exports = multiply

/**
 * Multiplies two mat3's
 *
 * @alias mat3.multiply
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function multiply(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]

  var b00 = b[0], b01 = b[1], b02 = b[2]
  var b10 = b[3], b11 = b[4], b12 = b[5]
  var b20 = b[6], b21 = b[7], b22 = b[8]

  out[0] = b00 * a00 + b01 * a10 + b02 * a20
  out[1] = b00 * a01 + b01 * a11 + b02 * a21
  out[2] = b00 * a02 + b01 * a12 + b02 * a22

  out[3] = b10 * a00 + b11 * a10 + b12 * a20
  out[4] = b10 * a01 + b11 * a11 + b12 * a21
  out[5] = b10 * a02 + b11 * a12 + b12 * a22

  out[6] = b20 * a00 + b21 * a10 + b22 * a20
  out[7] = b20 * a01 + b21 * a11 + b22 * a21
  out[8] = b20 * a02 + b21 * a12 + b22 * a22

  return out
}

},{}],"../../../node_modules/gl-mat3/normalFromMat4.js":[function(require,module,exports) {
module.exports = normalFromMat4

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @alias mat3.normalFromMat4
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
function normalFromMat4(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15]

  var b00 = a00 * a11 - a01 * a10
  var b01 = a00 * a12 - a02 * a10
  var b02 = a00 * a13 - a03 * a10
  var b03 = a01 * a12 - a02 * a11
  var b04 = a01 * a13 - a03 * a11
  var b05 = a02 * a13 - a03 * a12
  var b06 = a20 * a31 - a21 * a30
  var b07 = a20 * a32 - a22 * a30
  var b08 = a20 * a33 - a23 * a30
  var b09 = a21 * a32 - a22 * a31
  var b10 = a21 * a33 - a23 * a31
  var b11 = a22 * a33 - a23 * a32

  // Calculate the determinant
  var det = b00 * b11
          - b01 * b10
          + b02 * b09
          + b03 * b08
          - b04 * b07
          + b05 * b06

  if (!det) return null
  det = 1.0 / det

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det

  return out
}

},{}],"../../../node_modules/gl-mat3/rotate.js":[function(require,module,exports) {
module.exports = rotate

/**
 * Rotates a mat3 by the given angle
 *
 * @alias mat3.rotate
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function rotate(out, a, rad) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]

  var s = Math.sin(rad)
  var c = Math.cos(rad)

  out[0] = c * a00 + s * a10
  out[1] = c * a01 + s * a11
  out[2] = c * a02 + s * a12

  out[3] = c * a10 - s * a00
  out[4] = c * a11 - s * a01
  out[5] = c * a12 - s * a02

  out[6] = a20
  out[7] = a21
  out[8] = a22

  return out
}

},{}],"../../../node_modules/gl-mat3/scale.js":[function(require,module,exports) {
module.exports = scale

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @alias mat3.scale
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
function scale(out, a, v) {
  var x = v[0]
  var y = v[1]

  out[0] = x * a[0]
  out[1] = x * a[1]
  out[2] = x * a[2]

  out[3] = y * a[3]
  out[4] = y * a[4]
  out[5] = y * a[5]

  out[6] = a[6]
  out[7] = a[7]
  out[8] = a[8]

  return out
}

},{}],"../../../node_modules/gl-mat3/str.js":[function(require,module,exports) {
module.exports = str

/**
 * Returns a string representation of a mat3
 *
 * @alias mat3.str
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                   a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
                   a[6] + ', ' + a[7] + ', ' + a[8] + ')'
}

},{}],"../../../node_modules/gl-mat3/translate.js":[function(require,module,exports) {
module.exports = translate

/**
 * Translate a mat3 by the given vector
 *
 * @alias mat3.translate
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
function translate(out, a, v) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]
  var x = v[0], y = v[1]

  out[0] = a00
  out[1] = a01
  out[2] = a02

  out[3] = a10
  out[4] = a11
  out[5] = a12

  out[6] = x * a00 + y * a10 + a20
  out[7] = x * a01 + y * a11 + a21
  out[8] = x * a02 + y * a12 + a22

  return out
}

},{}],"../../../node_modules/gl-mat3/transpose.js":[function(require,module,exports) {
module.exports = transpose

/**
 * Transpose the values of a mat3
 *
 * @alias mat3.transpose
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1], a02 = a[2], a12 = a[5]
    out[1] = a[3]
    out[2] = a[6]
    out[3] = a01
    out[5] = a[7]
    out[6] = a02
    out[7] = a12
  } else {
    out[0] = a[0]
    out[1] = a[3]
    out[2] = a[6]
    out[3] = a[1]
    out[4] = a[4]
    out[5] = a[7]
    out[6] = a[2]
    out[7] = a[5]
    out[8] = a[8]
  }

  return out
}

},{}],"../../../node_modules/gl-mat3/index.js":[function(require,module,exports) {
module.exports = {
  adjoint: require('./adjoint')
  , clone: require('./clone')
  , copy: require('./copy')
  , create: require('./create')
  , determinant: require('./determinant')
  , frob: require('./frob')
  , fromMat2: require('./fromMat2')
  , fromMat4: require('./fromMat4')
  , fromQuat: require('./fromQuat')
  , identity: require('./identity')
  , invert: require('./invert')
  , multiply: require('./multiply')
  , normalFromMat4: require('./normalFromMat4')
  , rotate: require('./rotate')
  , scale: require('./scale')
  , str: require('./str')
  , translate: require('./translate')
  , transpose: require('./transpose')
}

},{"./adjoint":"../../../node_modules/gl-mat3/adjoint.js","./clone":"../../../node_modules/gl-mat3/clone.js","./copy":"../../../node_modules/gl-mat3/copy.js","./create":"../../../node_modules/gl-mat3/create.js","./determinant":"../../../node_modules/gl-mat3/determinant.js","./frob":"../../../node_modules/gl-mat3/frob.js","./fromMat2":"../../../node_modules/gl-mat3/fromMat2.js","./fromMat4":"../../../node_modules/gl-mat3/fromMat4.js","./fromQuat":"../../../node_modules/gl-mat3/fromQuat.js","./identity":"../../../node_modules/gl-mat3/identity.js","./invert":"../../../node_modules/gl-mat3/invert.js","./multiply":"../../../node_modules/gl-mat3/multiply.js","./normalFromMat4":"../../../node_modules/gl-mat3/normalFromMat4.js","./rotate":"../../../node_modules/gl-mat3/rotate.js","./scale":"../../../node_modules/gl-mat3/scale.js","./str":"../../../node_modules/gl-mat3/str.js","./translate":"../../../node_modules/gl-mat3/translate.js","./transpose":"../../../node_modules/gl-mat3/transpose.js"}],"../../../node_modules/primitive-plane/index.js":[function(require,module,exports) {
// 3x3 plane:
//
//  0   1   2   3
//  4   5   6   7
//  8   9  10  11
// 12  13  14  15
function createPlane (sx, sy, nx, ny, options) {
  sx = sx || 1
  sy = sy || 1
  nx = nx || 1
  ny = ny || 1
  var quads = (options && options.quads) ? options.quads : false

  var positions = []
  var uvs = []
  var normals = []
  var cells = []

  for (var iy = 0; iy <= ny; iy++) {
    for (var ix = 0; ix <= nx; ix++) {
      var u = ix / nx
      var v = iy / ny
      var x = -sx / 2 + u * sx // starts on the left
      var y = sy / 2 - v * sy // starts at the top
      positions.push([x, y, 0])
      uvs.push([u, 1.0 - v])
      normals.push([0, 0, 1])
      if (iy < ny && ix < nx) {
        if (quads) {
          cells.push([iy * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix + 1, iy * (nx + 1) + ix + 1])
        } else {
          cells.push([iy * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix + 1, iy * (nx + 1) + ix + 1])
          cells.push([(iy + 1) * (nx + 1) + ix + 1, iy * (nx + 1) + ix, (iy + 1) * (nx + 1) + ix])
        }
      }
    }
  }

  return {
    positions: positions,
    normals: normals,
    uvs: uvs,
    cells: cells
  }
}

module.exports = createPlane

},{}],"../../../node_modules/animejs/lib/anime.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * anime.js v3.0.0
 * (c) 2019 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */
// Defaults
var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};
var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};
var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective']; // Caching

var cache = {
  CSS: {},
  springs: {}
}; // Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) {
    return Array.isArray(a);
  },
  obj: function (a) {
    return stringContains(Object.prototype.toString.call(a), 'Object');
  },
  pth: function (a) {
    return is.obj(a) && a.hasOwnProperty('totalLength');
  },
  svg: function (a) {
    return a instanceof SVGElement;
  },
  inp: function (a) {
    return a instanceof HTMLInputElement;
  },
  dom: function (a) {
    return a.nodeType || is.svg(a);
  },
  str: function (a) {
    return typeof a === 'string';
  },
  fnc: function (a) {
    return typeof a === 'function';
  },
  und: function (a) {
    return typeof a === 'undefined';
  },
  hex: function (a) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
  },
  rgb: function (a) {
    return /^rgb/.test(a);
  },
  hsl: function (a) {
    return /^hsl/.test(a);
  },
  col: function (a) {
    return is.hex(a) || is.rgb(a) || is.hsl(a);
  },
  key: function (a) {
    return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
  }
}; // Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) {
    return parseFloat(p);
  }) : [];
} // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


function spring(string, duration) {
  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity = minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? duration * t / 1000 : t;

    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }

    if (t === 0 || t === 1) {
      return t;
    }

    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];

    if (cached) {
      return cached;
    }

    var frame = 1 / 6;
    var elapsed = 0;
    var rest = 0;

    while (true) {
      elapsed += frame;

      if (solver(elapsed) === 1) {
        rest++;

        if (rest >= 16) {
          break;
        }
      } else {
        rest = 0;
      }
    }

    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;
} // Elastic easing adapted from jQueryUI http://api.jqueryui.com/easings/


function elastic(amplitude, period) {
  if (amplitude === void 0) amplitude = 1;
  if (period === void 0) period = .5;
  var a = minMax(amplitude, 1, 10);
  var p = minMax(period, .1, 2);
  return function (t) {
    return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
  };
} // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


function steps(steps) {
  if (steps === void 0) steps = 10;
  return function (t) {
    return Math.round(t * steps) * (1 / steps);
  };
} // BezierEasing https://github.com/gre/bezier-easing


var bezier = function () {
  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
        currentT,
        i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;

      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      return;
    }

    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {
      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x;
      }

      if (x === 0 || x === 1) {
        return x;
      }

      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  return bezier;
}();

var penner = function () {
  var names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ', 'Back', 'Elastic']; // Approximated Penner equations http://matthewlein.com/ceaser/

  var curves = {
    In: [[0.550, 0.085, 0.680, 0.530],
    /* inQuad */
    [0.550, 0.055, 0.675, 0.190],
    /* inCubic */
    [0.895, 0.030, 0.685, 0.220],
    /* inQuart */
    [0.755, 0.050, 0.855, 0.060],
    /* inQuint */
    [0.470, 0.000, 0.745, 0.715],
    /* inSine */
    [0.950, 0.050, 0.795, 0.035],
    /* inExpo */
    [0.600, 0.040, 0.980, 0.335],
    /* inCirc */
    [0.600, -0.280, 0.735, 0.045],
    /* inBack */
    elastic
    /* inElastic */
    ],
    Out: [[0.250, 0.460, 0.450, 0.940],
    /* outQuad */
    [0.215, 0.610, 0.355, 1.000],
    /* outCubic */
    [0.165, 0.840, 0.440, 1.000],
    /* outQuart */
    [0.230, 1.000, 0.320, 1.000],
    /* outQuint */
    [0.390, 0.575, 0.565, 1.000],
    /* outSine */
    [0.190, 1.000, 0.220, 1.000],
    /* outExpo */
    [0.075, 0.820, 0.165, 1.000],
    /* outCirc */
    [0.175, 0.885, 0.320, 1.275],
    /* outBack */
    function (a, p) {
      return function (t) {
        return 1 - elastic(a, p)(1 - t);
      };
    }
    /* outElastic */
    ],
    InOut: [[0.455, 0.030, 0.515, 0.955],
    /* inOutQuad */
    [0.645, 0.045, 0.355, 1.000],
    /* inOutCubic */
    [0.770, 0.000, 0.175, 1.000],
    /* inOutQuart */
    [0.860, 0.000, 0.070, 1.000],
    /* inOutQuint */
    [0.445, 0.050, 0.550, 0.950],
    /* inOutSine */
    [1.000, 0.000, 0.000, 1.000],
    /* inOutExpo */
    [0.785, 0.135, 0.150, 0.860],
    /* inOutCirc */
    [0.680, -0.550, 0.265, 1.550],
    /* inOutBack */
    function (a, p) {
      return function (t) {
        return t < .5 ? elastic(a, p)(t * 2) / 2 : 1 - elastic(a, p)(t * -2 + 2) / 2;
      };
    }
    /* inOutElastic */
    ]
  };
  var eases = {
    linear: [0.250, 0.250, 0.750, 0.750]
  };

  var loop = function (coords) {
    curves[coords].forEach(function (ease, i) {
      eases['ease' + coords + names[i]] = ease;
    });
  };

  for (var coords in curves) loop(coords);

  return eases;
}();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) {
    return easing;
  }

  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);

  switch (name) {
    case 'spring':
      return spring(easing, duration);

    case 'cubicBezier':
      return applyArguments(bezier, args);

    case 'steps':
      return applyArguments(steps, args);

    default:
      return is.fnc(ease) ? applyArguments(ease, args) : applyArguments(bezier, ease);
  }
} // Strings


function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch (e) {
    return;
  }
} // Arrays


function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];

  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];

      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }

  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(is.arr(b) ? flattenArray(b) : b);
  }, []);
}

function toArray(o) {
  if (is.arr(o)) {
    return o;
  }

  if (is.str(o)) {
    o = selectString(o) || o;
  }

  if (o instanceof NodeList || o instanceof HTMLCollection) {
    return [].slice.call(o);
  }

  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) {
    return a === val;
  });
} // Objects


function cloneObject(o) {
  var clone = {};

  for (var p in o) {
    clone[p] = o[p];
  }

  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o1) {
    o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  }

  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o2) {
    o[p] = is.und(o1[p]) ? o2[p] : o1[p];
  }

  return o;
} // Colors


function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? "rgba(" + rgb[1] + ",1)" : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return "rgba(" + r + "," + g + "," + b + ",1)";
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;

  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }

    if (t > 1) {
      t -= 1;
    }

    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2) {
      return q;
    }

    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
  }

  var r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
}

function colorToRgb(val) {
  if (is.rgb(val)) {
    return rgbToRgba(val);
  }

  if (is.hex(val)) {
    return hexToRgba(val);
  }

  if (is.hsl(val)) {
    return hslToRgba(val);
  }
} // Units


function getUnit(val) {
  var split = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);

  if (split) {
    return split[2];
  }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') {
    return 'px';
  }

  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) {
    return 'deg';
  }
} // Values


function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) {
    return val;
  }

  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);

  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
    return value;
  }

  var cached = cache.CSS[value + unit];

  if (!is.und(cached)) {
    return cached;
  }

  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (getAttribute(el, prop) || is.svg(el) && el[prop])) {
    return 'attribute';
  }

  if (is.dom(el) && arrayContains(validTransforms, prop)) {
    return 'transform';
  }

  if (is.dom(el) && prop !== 'transform' && getCSSValue(el, prop)) {
    return 'css';
  }

  if (el[prop] != null) {
    return 'object';
  }
}

function getElementTransforms(el) {
  if (!is.dom(el)) {
    return;
  }

  var str = el.style.transform || '';
  var reg = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m;

  while (m = reg.exec(str)) {
    transforms.set(m[1], m[2]);
  }

  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;

  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }

  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform':
      return getTransformValue(target, propName, animatable, unit);

    case 'css':
      return getCSSValue(target, propName, unit);

    case 'attribute':
      return getAttribute(target, propName);

    default:
      return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);

  if (!operator) {
    return to;
  }

  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));

  switch (operator[0][0]) {
    case '+':
      return x + y + u;

    case '-':
      return x - y + u;

    case '*':
      return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) {
    return colorToRgb(val);
  }

  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  return unit && !/\s/g.test(val) ? unitLess + unit : unitLess;
} // getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744


function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return getAttribute(el, 'width') * 2 + getAttribute(el, 'height') * 2;
}

function getLineLength(el) {
  return getDistance({
    x: getAttribute(el, 'x1'),
    y: getAttribute(el, 'y1')
  }, {
    x: getAttribute(el, 'x2'),
    y: getAttribute(el, 'y2')
  });
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;

  for (var i = 0; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);

    if (i > 0) {
      totalLength += getDistance(previousPos, currentPos);
    }

    previousPos = currentPos;
  }

  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
} // Path animation


function getTotalLength(el) {
  if (el.getTotalLength) {
    return el.getTotalLength();
  }

  switch (el.tagName.toLowerCase()) {
    case 'circle':
      return getCircleLength(el);

    case 'rect':
      return getRectLength(el);

    case 'line':
      return getLineLength(el);

    case 'polyline':
      return getPolylineLength(el);

    case 'polygon':
      return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
} // Motion path


function getParentSvgEl(el) {
  var parentEl = el.parentNode;

  while (is.svg(parentEl)) {
    parentEl = parentEl.parentNode;

    if (!is.svg(parentEl.parentNode)) {
      break;
    }
  }

  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width / viewBox[2],
    h: height / viewBox[3]
  };
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function (property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    };
  };
}

function getPathProgress(path, progress) {
  function point(offset) {
    if (offset === void 0) offset = 0;
    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }

  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);

  switch (path.property) {
    case 'x':
      return (p.x - svg.x) * svg.w;

    case 'y':
      return (p.y - svg.y) * svg.h;

    case 'angle':
      return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
} // Decompose value


function decomposeValue(val, unit) {
  var rgx = /-?\d*\.?\d+/g;
  var value = validateValue(is.pth(val) ? val.totalLength : val, unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: is.str(val) || unit ? value.split(rgx) : []
  };
} // Animatables


function parseTargets(targets) {
  var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
  return filterArray(targetsArray, function (item, pos, self) {
    return self.indexOf(item) === pos;
  });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {
      target: t,
      id: i,
      total: parsed.length,
      transforms: {
        list: getElementTransforms(t)
      }
    };
  });
} // Properties


function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings); // Override duration if easing is a spring

  if (/^spring/.test(settings.easing)) {
    settings.duration = spring(settings.easing);
  }

  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = l === 2 && !is.obj(prop[0]);

    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) {
        settings.duration = tweenSettings.duration / l;
      }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {
        value: prop
      };
    }
  }

  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = is.obj(v) && !is.pth(v) ? v : {
      value: v
    }; // Default delay value should only be applied to the first tween

    if (is.und(obj.delay)) {
      obj.delay = !i ? tweenSettings.delay : 0;
    } // Default endDelay value should only be applied to the last tween


    if (is.und(obj.endDelay)) {
      obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
    }

    return obj;
  }).map(function (k) {
    return mergeObjects(k, settings);
  });
}

function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
    return Object.keys(key);
  })), function (p) {
    return is.key(p);
  }).reduce(function (a, b) {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }

    return a;
  }, []);
  var properties = {};

  var loop = function (i) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};

      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) {
            newKey.value = key[p];
          }
        } else {
          newKey[p] = key[p];
        }
      }

      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop(i);

  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;

  if (keyframes) {
    params = mergeObjects(flattenKeyframes(keyframes), params);
  }

  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }

  return properties;
} // Tweens


function normalizeTweenValues(tween, animatable) {
  var t = {};

  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);

    if (is.arr(value)) {
      value = value.map(function (v) {
        return getFunctionValue(v, animatable);
      });

      if (value.length === 1) {
        value = value[0];
      }
    }

    t[p] = value;
  }

  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;

    if (is.und(to)) {
      to = previousValue;
    }

    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isColor = is.col(tween.from.original);

    if (tween.isColor) {
      tween.round = 1;
    }

    previousTween = tween;
    return tween;
  });
} // Tween progress


var setProgressValue = {
  css: function (t, p, v) {
    return t.style[p] = v;
  },
  attribute: function (t, p, v) {
    return t.setAttribute(p, v);
  },
  object: function (t, p, v) {
    return t[p] = v;
  },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);

    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) {
        str += prop + "(" + value + ") ";
      });
      t.style.transform = str;
    }
  }
}; // Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
} // Animations


function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);

  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    };
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) {
    return !is.und(a);
  });
} // Create Instance


function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;

  var getTlOffset = function (anim) {
    return anim.timelineOffset ? anim.timelineOffset : 0;
  };

  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration;
  })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.delay;
  })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration - anim.endDelay;
  })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
} // Core


var activeInstances = [];
var pausedInstances = [];
var raf;

var engine = function () {
  function play() {
    raf = requestAnimationFrame(step);
  }

  function step(t) {
    var activeInstancesLength = activeInstances.length;

    if (activeInstancesLength) {
      var i = 0;

      while (i < activeInstancesLength) {
        var activeInstance = activeInstances[i];

        if (!activeInstance.paused) {
          activeInstance.tick(t);
        } else {
          var instanceIndex = activeInstances.indexOf(activeInstance);

          if (instanceIndex > -1) {
            activeInstances.splice(instanceIndex, 1);
            activeInstancesLength = activeInstances.length;
          }
        }

        i++;
      }

      play();
    } else {
      raf = cancelAnimationFrame(raf);
    }
  }

  return play;
}();

function handleVisibilityChange() {
  if (document.hidden) {
    activeInstances.forEach(function (ins) {
      return ins.pause();
    });
    pausedInstances = activeInstances.slice(0);
    activeInstances = [];
  } else {
    pausedInstances.forEach(function (ins) {
      return ins.play();
    });
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange); // Public Instance

function anime(params) {
  if (params === void 0) params = {};
  var startTime = 0,
      lastTime = 0,
      now = 0;
  var children,
      childrenLength = 0;
  var resolve = null;

  function makePromise() {
    return window.Promise && new Promise(function (_resolve) {
      return resolve = _resolve;
    });
  }

  var promise = makePromise();
  var instance = createNewInstance(params);

  function toggleInstanceDirection() {
    instance.reversed = !instance.reversed;
    children.forEach(function (child) {
      return child.reversed = instance.reversed;
    });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekCild(time, child) {
    if (child) {
      child.seek(time - child.timelineOffset);
    }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) {
        seekCild(time, children[i]);
      }
    } else {
      for (var i$1 = childrenLength; i$1--;) {
        seekCild(time, children[i$1]);
      }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;

    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength]; // Only check for keyframes if there is more than one tween

      if (tweenLength) {
        tween = filterArray(tweens, function (t) {
          return insTime < t.end;
        })[0] || tween;
      }

      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = void 0;

      for (var n = 0; n < toNumbersLength; n++) {
        var value = void 0;
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;

        if (!tween.isPath) {
          value = fromNumber + eased * (toNumber - fromNumber);
        } else {
          value = getPathProgress(tween.value, eased * toNumber);
        }

        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }

        numbers.push(value);
      } // Manual Array.reduce for better performances


      var stringsLength = strings.length;

      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];

        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];

          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }

      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) {
      instance[cb](instance);
    }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax(insTime / insDuration * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;

    if (children) {
      syncInstanceChildren(insTime);
    }

    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
      setCallback('loopBegin');
    }

    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }

    if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
      setAnimationsProgress(insDuration);
    }

    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }

      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }

    instance.currentTime = minMax(insTime, 0, insDuration);

    if (instance.began) {
      setCallback('update');
    }

    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();

      if (instance.remaining) {
        startTime = now;
        setCallback('loopComplete');
        setCallback('loopBegin');

        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      } else {
        instance.paused = true;

        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');

          if ('Promise' in window) {
            resolve();
            promise = makePromise();
          }
        }
      }
    }
  }

  instance.reset = function () {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;

    for (var i = childrenLength; i--;) {
      instance.children[i].reset();
    }

    if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) {
      instance.remaining++;
    }

    setAnimationsProgress(0);
  }; // Set Value helper


  instance.set = function (targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function (t) {
    now = t;

    if (!startTime) {
      startTime = now;
    }

    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function (time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function () {
    instance.paused = true;
    resetTime();
  };

  instance.play = function () {
    if (!instance.paused) {
      return;
    }

    instance.paused = false;
    activeInstances.push(instance);
    resetTime();

    if (!raf) {
      engine();
    }
  };

  instance.reverse = function () {
    toggleInstanceDirection();
    resetTime();
  };

  instance.restart = function () {
    instance.reset();
    instance.play();
  };

  instance.finished = promise;
  instance.reset();

  if (instance.autoplay) {
    instance.play();
  }

  return instance;
} // Remove targets from animation


function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargets(targets) {
  var targetsArray = parseTargets(targets);

  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    var animations = instance.animations;
    var children = instance.children;
    removeTargetsFromAnimations(targetsArray, animations);

    for (var c = children.length; c--;) {
      var child = children[c];
      var childAnimations = child.animations;
      removeTargetsFromAnimations(targetsArray, childAnimations);

      if (!childAnimations.length && !child.children.length) {
        children.splice(c, 1);
      }
    }

    if (!animations.length && !children.length) {
      instance.pause();
    }
  }
} // Stagger helpers


function stagger(val, params) {
  if (params === void 0) params = {};
  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) {
      fromIndex = 0;
    }

    if (fromCenter) {
      fromIndex = (t - 1) / 2;
    }

    if (fromLast) {
      fromIndex = t - 1;
    }

    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
          var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
          var toX = index % grid[0];
          var toY = Math.floor(index / grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (axis === 'x') {
            value = -distanceX;
          }

          if (axis === 'y') {
            value = -distanceY;
          }

          values.push(value);
        }

        maxValue = Math.max.apply(Math, values);
      }

      if (easing) {
        values = values.map(function (val) {
          return easing(val / maxValue) * maxValue;
        });
      }

      if (direction === 'reverse') {
        values = values.map(function (val) {
          return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
        });
      }
    }

    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
  };
} // Timeline


function timeline(params) {
  if (params === void 0) params = {};
  var tl = anime(params);
  tl.duration = 0;

  tl.add = function (instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;

    if (tlIndex > -1) {
      activeInstances.splice(tlIndex, 1);
    }

    function passThrough(ins) {
      ins.passThrough = true;
    }

    for (var i = 0; i < children.length; i++) {
      passThrough(children[i]);
    }

    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();

    if (tl.autoplay) {
      tl.play();
    }

    return tl;
  };

  return tl;
}

anime.version = '3.0.0';
anime.speed = 1;
anime.running = activeInstances;
anime.remove = removeTargets;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;

anime.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var _default = anime;
exports.default = _default;
},{}],"../../../node_modules/@thi.ng/api/mixin.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class behavior mixin based on:
 * http://raganwald.com/2015/06/26/decorators-in-es7.html
 *
 * Additionally only injects/overwrites properties in target, which are
 * NOT marked with `@nomixin` (i.e. haven't set their `configurable`
 * property descriptor flag to `false`)
 *
 * @param behaviour to mixin
 * @param sharedBehaviour
 * @returns decorator function
 */
function mixin(behaviour, sharedBehaviour = {}) {
    const instanceKeys = Reflect.ownKeys(behaviour);
    const sharedKeys = Reflect.ownKeys(sharedBehaviour);
    const typeTag = Symbol("isa");
    function _mixin(clazz) {
        for (let key of instanceKeys) {
            const existing = Object.getOwnPropertyDescriptor(clazz.prototype, key);
            if (!existing || existing.configurable) {
                Object.defineProperty(clazz.prototype, key, {
                    value: behaviour[key],
                    writable: true,
                });
            }
            else {
                console.log(`not patching: ${clazz.name}.${key.toString()}`);
            }
        }
        Object.defineProperty(clazz.prototype, typeTag, { value: true });
        return clazz;
    }
    for (let key of sharedKeys) {
        Object.defineProperty(_mixin, key, {
            value: sharedBehaviour[key],
            enumerable: sharedBehaviour.propertyIsEnumerable(key),
        });
    }
    Object.defineProperty(_mixin, Symbol.hasInstance, { value: (x) => !!x[typeTag] });
    return _mixin;
}
exports.mixin = mixin;

},{}],"../../../node_modules/@thi.ng/api/mixins/iwatch.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mixin_1 = require("../mixin");
exports.IWatch = mixin_1.mixin({
    addWatch(id, fn) {
        this._watches = this._watches || {};
        if (this._watches[id]) {
            return false;
        }
        this._watches[id] = fn;
        return true;
    },
    removeWatch(id) {
        if (!this._watches)
            return;
        if (this._watches[id]) {
            delete this._watches[id];
            return true;
        }
        return false;
    },
    notifyWatches(oldState, newState) {
        if (!this._watches)
            return;
        const w = this._watches;
        for (let id in w) {
            w[id](id, oldState, newState);
        }
    }
});

},{"../mixin":"../../../node_modules/@thi.ng/api/mixin.js"}],"../../../node_modules/@thi.ng/errors/illegal-state.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IllegalStateError extends Error {
    constructor(msg) {
        super("illegal state" + (msg !== undefined ? ": " + msg : ""));
    }
}
exports.IllegalStateError = IllegalStateError;
function illegalState(msg) {
    throw new IllegalStateError(msg);
}
exports.illegalState = illegalState;

},{}],"../../../node_modules/@thi.ng/paths/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_array_1 = require("@thi.ng/checks/is-array");
const is_string_1 = require("@thi.ng/checks/is-string");
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const _copy = (s) => Array.isArray(s) ? s.slice() : Object.assign({}, s);
const compS = (k, f) => (s, v) => { s = _copy(s); s[k] = f ? f(s[k], v) : v; return s; };
const compG = (k, f) => (s) => s ? f(s[k]) : undefined;
/**
 * Converts the given key path to canonical form (array).
 *
 * ```
 * toPath("a.b.c");
 * // ["a", "b", "c"]
 *
 * toPath(0)
 * // [0]
 *
 * toPath(["a", "b", "c"])
 * // ["a", "b", "c"]
 * ```
 *
 * @param path
 */
function toPath(path) {
    return is_array_1.isArray(path) ? path : is_string_1.isString(path) ? path.length > 0 ? path.split(".") : [] : path != null ? [path] : [];
}
exports.toPath = toPath;
/**
 * Takes an arbitrary object and lookup path. Descends into object along
 * path and returns true if the full path exists (even if final leaf
 * value is `null` or `undefined`). Checks are performed using
 * `hasOwnProperty()`.
 *
 * @param obj
 * @param path
 */
exports.exists = (obj, path) => {
    if (obj == null) {
        return false;
    }
    path = toPath(path);
    for (let n = path.length - 1, i = 0; i <= n; i++) {
        const k = path[i];
        if (!obj.hasOwnProperty(k)) {
            return false;
        }
        obj = obj[k];
        if (obj == null && i < n) {
            return false;
        }
    }
    return true;
};
/**
 * Composes a getter function for given nested lookup path. Optimized
 * fast execution paths are provided for path lengths less than 5.
 * Supports any `[]`-indexable data structure (arrays, objects,
 * strings).
 *
 * If `path` is given as string, it will be split using `.`. Returns
 * function which accepts single object and when called, returns value
 * at given path.
 *
 * If any intermediate key is not present in the given obj, descent
 * stops and the function returns `undefined`.
 *
 * If `path` is an empty string or array, the returned getter will
 * simply return the given state arg (identity function).
 *
 * Also see: `getIn()`
 *
 * ```
 * g = getter("a.b.c");
 * // or
 * g = getter(["a","b","c"]);
 *
 * g({a: {b: {c: 23}}}) // 23
 * g({x: 23}) // undefined
 * g() // undefined
 * ```
 *
 * @param path
 */
function getter(path) {
    const ks = toPath(path);
    let [a, b, c, d] = ks;
    switch (ks.length) {
        case 0:
            return (s) => s;
        case 1:
            return (s) => s ? s[a] : undefined;
        case 2:
            return (s) => s ? (s = s[a]) ? s[b] : undefined : undefined;
        case 3:
            return (s) => s ? (s = s[a]) ? (s = s[b]) ? s[c] : undefined : undefined : undefined;
        case 4:
            return (s) => s ? (s = s[a]) ? (s = s[b]) ? (s = s[c]) ? s[d] : undefined : undefined : undefined : undefined;
        default:
            const kl = ks[ks.length - 1];
            let f = (s) => s ? s[kl] : undefined;
            for (let i = ks.length - 2; i >= 0; i--) {
                f = compG(ks[i], f);
            }
            return f;
    }
}
exports.getter = getter;
/**
 * Composes a setter function for given nested update path. Optimized
 * fast execution paths are provided for path lengths less up to 4.
 * Supports both arrays and objects and creates intermediate shallow
 * copies at each level of the path. Thus provides structural sharing
 * with the original data for any branches not being updated by the
 * setter.
 *
 * If `path` is given as string, it will be split using `.`. Returns
 * function which accepts single object and when called, **immutably**
 * updates value at given path, i.e. produces a partial deep copy of obj
 * up until given path.
 *
 * If any intermediate key is not present in the given obj, creates a
 * plain empty object for that key and descends further.
 *
 * If `path` is an empty string or array, the returned setter will
 * simply return the new value.
 *
 * Also see: `setIn()`, `updateIn()`, `deleteIn()`
 *
 * ```
 * s = setter("a.b.c");
 * // or
 * s = setter(["a","b","c"]);
 *
 * s({a: {b: {c: 23}}}, 24)
 * // {a: {b: {c: 24}}}
 *
 * s({x: 23}, 24)
 * // { x: 23, a: { b: { c: 24 } } }
 *
 * s(null, 24)
 * // { a: { b: { c: 24 } } }
 * ```
 *
 * Only keys in the path will be modified, all other keys present in the
 * given object retain their original values to provide efficient
 * structural sharing / re-use.
 *
 * ```
 * s = setter("a.b.c");
 *
 * a = {x: {y: {z: 1}}};
 * b = s(a, 2);
 * // { x: { y: { z: 1 } }, a: { b: { c: 2 } } }
 *
 * a.x === b.x // true
 * a.x.y === b.x.y // true
 * ```
 *
 * @param path
 */
function setter(path) {
    const ks = toPath(path);
    let [a, b, c, d] = ks;
    switch (ks.length) {
        case 0:
            return (_, v) => v;
        case 1:
            return (s, v) => (s = _copy(s), s[a] = v, s);
        case 2:
            return (s, v) => { let x; s = _copy(s); s[a] = x = _copy(s[a]); x[b] = v; return s; };
        case 3:
            return (s, v) => { let x, y; s = _copy(s); s[a] = x = _copy(s[a]); x[b] = y = _copy(x[b]); y[c] = v; return s; };
        case 4:
            return (s, v) => { let x, y, z; s = _copy(s); s[a] = x = _copy(s[a]); x[b] = y = _copy(x[b]); y[c] = z = _copy(y[c]); z[d] = v; return s; };
        default:
            let f;
            for (let i = ks.length - 1; i >= 0; i--) {
                f = compS(ks[i], f);
            }
            return f;
    }
}
exports.setter = setter;
/**
 * Immediate use getter, i.e. same as: `getter(path)(state)`.
 *
 * ```
 * getIn({a: {b: {c: 23}}}, "a.b.c");
 * // 23
 * ```
 *
 * @param state
 * @param path
 */
function getIn(state, path) {
    return getter(path)(state);
}
exports.getIn = getIn;
/**
 * Immediate use setter, i.e. same as: `setter(path)(state, val)`.
 *
 * ```
 * setIn({}, "a.b.c", 23);
 * // {a: {b: {c: 23}}}
 * ```
 *
 * @param state
 * @param path
 */
function setIn(state, path, val) {
    return setter(path)(state, val);
}
exports.setIn = setIn;
/**
 * Like `setIn()`, but takes any number of path-value pairs and applies
 * them in sequence by calling `setIn()` for each. Any key paths missing
 * in the data structure will be created. Does *not* mutate original
 * (instead use `mutInMany()` for this purpose).
 *
 * ```
 * setInMany({}, "a.b", 10, "x.y.z", 20)
 * // { a: { b: 10 }, x: { y: { z: 20 } } }
 * ```
 *
 * @param state
 * @param pairs
 */
function setInMany(state, ...pairs) {
    const n = pairs.length;
    if ((n & 1)) {
        illegal_arguments_1.illegalArgs(`require an even number of args (got ${pairs.length})`);
    }
    for (let i = 0; i < n; i += 2) {
        state = setIn(state, pairs[i], pairs[i + 1]);
    }
    return state;
}
exports.setInMany = setInMany;
/**
 * Similar to `setter()`, returns a function to update values at given
 * `path` using provided update `fn`. The returned function accepts a
 * single object / array and applies `fn` to current path value (incl.
 * any additional/optional arguments passed) and uses result as new
 * value. Does not modify original state (unless given function does so
 * itself).
 *
 * ```
 * add = updater("a.b", (x, n) => x + n);
 *
 * add({a: {b: 10}}, 13);
 * // { a: { b: 23 } }
 * ```
 *
 * @param path
 * @param fn
 */
function updater(path, fn) {
    const g = getter(path);
    const s = setter(path);
    return (state, ...args) => s(state, fn.apply(null, (args.unshift(g(state)), args)));
}
exports.updater = updater;
;
/**
 * Similar to `setIn()`, but applies given function to current path
 * value (incl. any additional/optional arguments passed to `updateIn`)
 * and uses result as new value. Does not modify original state (unless
 * given function does so itself).
 *
 * ```
 * add = (x, y) => x + y;
 * updateIn({a: {b: {c: 23}}}, "a.b.c", add, 10);
 * // {a: {b: {c: 33}}}
 * ```
 *
 * @param state
 * @param path
 */
function updateIn(state, path, fn, ...args) {
    return setter(path)(state, fn.apply(null, (args.unshift(getter(path)(state)), args)));
}
exports.updateIn = updateIn;
/**
 * Uses `updateIn()` and returns updated state with key for given path
 * removed. Does not modify original state.
 *
 * Returns `undefined` if `path` is an empty string or array.
 *
 * ```
 * deleteIn({a:{b:{c: 23}}}, "a.b.c");
 * // {a: {b: {}}}
 * ```
 *
 * @param state
 * @param path
 */
function deleteIn(state, path) {
    const ks = [...toPath(path)];
    if (ks.length > 0) {
        const k = ks.pop();
        return updateIn(state, ks, (x) => { x = Object.assign({}, x); delete x[k]; return x; });
    }
}
exports.deleteIn = deleteIn;
/**
 * Higher-order function, similar to `setter()`. Returns function which
 * when called mutates given object/array at given path location and
 * bails if any intermediate path values are non-indexable (only the
 * very last path element can be missing in the actual object
 * structure). If successful, returns original (mutated) object, else
 * `undefined`. This function provides optimized versions for path
 * lengths <= 4.
 *
 * @param path
 */
function mutator(path) {
    const ks = toPath(path);
    let [a, b, c, d] = ks;
    switch (ks.length) {
        case 0:
            return (_, x) => x;
        case 1:
            return (s, x) => s ? (s[a] = x, s) : undefined;
        case 2:
            return (s, x) => { let t; return s ? (t = s[a]) ? (t[b] = x, s) : undefined : undefined; };
        case 3:
            return (s, x) => { let t; return s ? (t = s[a]) ? (t = t[b]) ? (t[c] = x, s) : undefined : undefined : undefined; };
        case 4:
            return (s, x) => { let t; return s ? (t = s[a]) ? (t = t[b]) ? (t = t[c]) ? (t[d] = x, s) : undefined : undefined : undefined : undefined; };
        default:
            return (s, x) => {
                let t = s;
                const n = ks.length - 1;
                for (let k = 0; k < n; k++) {
                    if (!(t = t[ks[k]]))
                        return;
                }
                t[ks[n]] = x;
                return s;
            };
    }
}
exports.mutator = mutator;
/**
 * Immediate use mutator, i.e. same as: `mutator(path)(state, val)`.
 *
 * ```
 * mutIn({ a: { b: [10, 20] } }, "a.b.1", 23);
 * // { a: { b: [ 10, 23 ] } }
 *
 * // fails (see `mutator` docs)
 * mutIn({}, "a.b.c", 23);
 * // undefined
 * ```
 *
 * @param state
 * @param path
 * @param val
 */
function mutIn(state, path, val) {
    return mutator(path)(state, val);
}
exports.mutIn = mutIn;
/**
 * Like `mutIn()`, but takes any number of path-value pairs and applies
 * them in sequence. All key paths must already be present in the given
 * data structure until their penultimate key.
 *
 * ```
 * mutInMany({a: {b: 1}, x: {y: {z: 2}}}, "a.b", 10, "x.y.z", 20)
 * // { a: { b: 10 }, x: { y: { z: 20 } } }
 * ```
 *
 * @param state
 * @param pairs
 */
function mutInMany(state, ...pairs) {
    const n = pairs.length;
    if ((n & 1)) {
        illegal_arguments_1.illegalArgs(`require an even number of args (got ${pairs.length})`);
    }
    for (let i = 0; i < n && state; i += 2) {
        state = mutIn(state, pairs[i], pairs[i + 1]);
    }
    return state;
}
exports.mutInMany = mutInMany;

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","@thi.ng/checks/is-string":"../../../node_modules/@thi.ng/checks/is-string.js","@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js"}],"../../../node_modules/@thi.ng/atom/view.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equiv_1 = require("@thi.ng/equiv");
const paths_1 = require("@thi.ng/paths");
/**
 * This class implements readonly access to a deeply nested value with
 * in an Atom/Cursor. An optional transformer function can be supplied
 * at creation time to produce a derived/materialized view of the actual
 * value held in the atom. Views can be created directly or via the
 * `.addView()` method of the parent state. Views can be `deref()`'d
 * like atoms and polled for value changes using `changed()`. The
 * transformer is only applied once per value change and its result
 * cached until the next change.
 *
 * If the optional `lazy` is true (default), the transformer will only
 * be executed with the first `deref()` after each value change. If
 * `lazy` is false, the transformer function will be executed
 * immediately after a value change occurred and so can be used like a
 * watch which only triggers if there was an actual value change (in
 * contrast to normal watches, which execute with each update,
 * regardless of value change).
 *
 * Related, the actual value change predicate can be customized. If not
 * given, the default `@thi.ng/equiv` will be used.
 *
 * ```
 * a = new Atom({a: {b: 1}});
 * v = a.addView("a.b", (x) => x * 10);
 *
 * v.deref()
 * // 10
 *
 * // update atom state
 * a.swap((state) => setIn(state, "a.b", 2));
 * // {a: {b: 2}}
 *
 * v.changed()
 * // true
 * v.deref()
 * // 20
 *
 * v.release()
 * // remove view from parent state
 * ```
 */
class View {
    constructor(parent, path, tx, lazy = true, equiv = equiv_1.equiv) {
        this.parent = parent;
        this.id = `view-${View.NEXT_ID++}`;
        this.tx = tx || ((x) => x);
        this.path = paths_1.toPath(path);
        this.isDirty = true;
        this.isLazy = lazy;
        const lookup = paths_1.getter(this.path);
        const state = this.parent.deref();
        this.unprocessed = state ? lookup(state) : undefined;
        if (!lazy) {
            this.state = this.tx(this.unprocessed);
            this.unprocessed = undefined;
        }
        parent.addWatch(this.id, (_, prev, curr) => {
            const pval = prev ? lookup(prev) : prev;
            const val = curr ? lookup(curr) : curr;
            if (!equiv(val, pval)) {
                if (lazy) {
                    this.unprocessed = val;
                }
                else {
                    this.state = this.tx(val);
                }
                this.isDirty = true;
            }
        });
    }
    get value() {
        return this.deref();
    }
    /**
     * Returns view's value. If the view has a transformer, the
     * transformed value is returned. The transformer is only run once
     * per value change. See class comments about difference between
     * lazy/eager behaviors.
     */
    deref() {
        if (this.isDirty) {
            if (this.isLazy) {
                this.state = this.tx(this.unprocessed);
                this.unprocessed = undefined;
            }
            this.isDirty = false;
        }
        return this.state;
    }
    /**
     * Returns true, if the view's value has changed since last
     * `deref()`.
     */
    changed() {
        return this.isDirty;
    }
    /**
     * Like `deref()`, but doesn't update view's cached state and dirty
     * flag if value has changed. If there's an unprocessed value
     * change, returns result of this sub's transformer or else the
     * cached value.
     *
     * **Important:** Use this function only if the view has none or or
     * a stateless transformer. Else might cause undefined/inconsistent
     * behavior when calling `view()` or `deref()` subsequently.
     */
    view() {
        return this.isDirty && this.isLazy ? this.tx(this.unprocessed) : this.state;
    }
    /**
     * Disconnects this view from parent state, marks itself
     * dirty/changed and sets its unprocessed raw value to `undefined`.
     */
    release() {
        this.unprocessed = undefined;
        if (!this.isLazy) {
            this.state = this.tx(undefined);
        }
        this.isDirty = true;
        return this.parent.removeWatch(this.id);
    }
}
View.NEXT_ID = 0;
exports.View = View;

},{"@thi.ng/equiv":"../../../node_modules/@thi.ng/equiv/index.js","@thi.ng/paths":"../../../node_modules/@thi.ng/paths/index.js"}],"../../../node_modules/@thi.ng/atom/atom.js":[function(require,module,exports) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const iwatch_1 = require("@thi.ng/api/mixins/iwatch");
const illegal_state_1 = require("@thi.ng/errors/illegal-state");
const paths_1 = require("@thi.ng/paths");
const view_1 = require("./view");
/**
 * Mutable wrapper for an (usually) immutable value. Support for
 * watches.
 */
let Atom = class Atom {
    constructor(val, valid) {
        if (valid && !valid(val)) {
            illegal_state_1.illegalState("initial state value did not validate");
        }
        this._value = val;
        this.valid = valid;
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this.reset(val);
    }
    deref() {
        return this._value;
    }
    equiv(o) {
        return this === o;
    }
    reset(val) {
        const old = this._value;
        if (this.valid && !this.valid(val)) {
            return old;
        }
        this._value = val;
        this.notifyWatches(old, val);
        return val;
    }
    resetIn(path, val) {
        return this.reset(paths_1.setIn(this._value, path, val));
    }
    swap(fn, ...args) {
        return this.reset(fn.apply(null, [this._value, ...args]));
    }
    swapIn(path, fn, ...args) {
        return this.reset(paths_1.updateIn(this._value, path, fn, ...args));
    }
    // mixin stub
    /* istanbul ignore next */
    addWatch(id, fn) {
        return false;
    }
    // mixin stub
    /* istanbul ignore next */
    removeWatch(id) {
        return false;
    }
    // mixin stub
    /* istanbul ignore next */
    notifyWatches(oldState, newState) { }
    addView(path, tx, lazy = true) {
        return new view_1.View(this, path, tx, lazy);
    }
    release() {
        delete this._watches;
        delete this._value;
        return true;
    }
};
Atom = __decorate([
    iwatch_1.IWatch
], Atom);
exports.Atom = Atom;

},{"@thi.ng/api/mixins/iwatch":"../../../node_modules/@thi.ng/api/mixins/iwatch.js","@thi.ng/errors/illegal-state":"../../../node_modules/@thi.ng/errors/illegal-state.js","@thi.ng/paths":"../../../node_modules/@thi.ng/paths/index.js","./view":"../../../node_modules/@thi.ng/atom/view.js"}],"../../../node_modules/@thi.ng/atom/cursor.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_array_1 = require("@thi.ng/checks/is-array");
const is_function_1 = require("@thi.ng/checks/is-function");
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const illegal_arity_1 = require("@thi.ng/errors/illegal-arity");
const paths_1 = require("@thi.ng/paths");
const atom_1 = require("./atom");
const view_1 = require("./view");
/**
 * A cursor provides read/write access to a path location within a
 * nested parent state (Atom or another Cursor). Cursors behave like
 * Atoms for all practical purposes, i.e. support `deref()`, `reset()`,
 * `swap()`, `addWatch()` etc. However, when updating a cursor's value,
 * the parent state will be updated at the cursor's path as well (incl.
 * triggering any watches and/or validators) attached to the parent.
 * Likewise, when the parent state is modified externally, the cursor's
 * value will automatically update as well. The update order of cursor's
 * sharing a common parent is undefined, but can be overridden by
 * extending this class with a custom `notifyWatches()` implementation.
 *
 * If creating multiple cursors w/ a shared parent and each cursor
 * configured with a custom ID (provided via config object to ctor),
 * it's the user's responsibility to ensure the given IDs are unique.
 * Cursors are implemented by attaching a watch to the parent and the ID
 * is used to identify each watch.
 *
 * When using the optional validator predicate (also specified via
 * config object to ctor), the cursor's validator MUST NOT conflict with
 * the one assigned to the parent or else both will go out-of-sync.
 * Therefore, when requiring validation and updating values via cursors
 * it's recommended to only specify validators for leaf-level cursors in
 * the hierarchy.
 */
class Cursor {
    constructor(...args) {
        let parent, id, lookup, update, validate, opts;
        switch (args.length) {
            case 1:
                opts = args[0];
                id = opts.id;
                parent = opts.parent;
                validate = opts.validate;
                if (opts.path) {
                    if (is_array_1.isArray(opts.path) && is_function_1.isFunction(opts.path[0])) {
                        [lookup, update] = opts.path;
                    }
                    else {
                        lookup = paths_1.getter(opts.path);
                        update = paths_1.setter(opts.path);
                    }
                }
                else {
                    illegal_arguments_1.illegalArgs("missing path config");
                }
                break;
            case 2:
                parent = args[0];
                lookup = paths_1.getter(args[1]);
                update = paths_1.setter(args[1]);
                break;
            case 3:
                [parent, lookup, update] = args;
                break;
            default:
                illegal_arity_1.illegalArity(args.length);
        }
        this.parent = parent;
        this.id = id || `cursor-${Cursor.NEXT_ID++}`;
        this.selfUpdate = false;
        if (!lookup || !update) {
            illegal_arguments_1.illegalArgs();
        }
        this.local = new atom_1.Atom(lookup(parent.deref()), validate);
        this.local.addWatch(this.id, (_, prev, curr) => {
            if (prev !== curr) {
                this.selfUpdate = true;
                parent.swap((state) => update(state, curr));
                this.selfUpdate = false;
            }
        });
        parent.addWatch(this.id, (_, prev, curr) => {
            if (!this.selfUpdate) {
                const cval = lookup(curr);
                if (cval !== lookup(prev)) {
                    this.local.reset(cval);
                }
            }
        });
    }
    get value() {
        return this.deref();
    }
    set value(val) {
        this.reset(val);
    }
    deref() {
        return this.local.deref();
    }
    release() {
        this.local.release();
        this.parent.removeWatch(this.id);
        delete this.local;
        delete this.parent;
        return true;
    }
    reset(val) {
        return this.local.reset(val);
    }
    resetIn(path, val) {
        return this.local.resetIn(path, val);
    }
    swap(fn, ...args) {
        return this.local.swap(fn, ...args);
    }
    swapIn(path, fn, ...args) {
        return this.local.swapIn(path, fn, ...args);
    }
    addWatch(id, fn) {
        return this.local.addWatch(id, fn);
    }
    removeWatch(id) {
        return this.local.removeWatch(id);
    }
    /* istanbul ignore next */
    notifyWatches(oldState, newState) {
        return this.local.notifyWatches(oldState, newState);
    }
    addView(path, tx, lazy = true) {
        return new view_1.View(this, path, tx, lazy);
    }
}
Cursor.NEXT_ID = 0;
exports.Cursor = Cursor;

},{"@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","@thi.ng/checks/is-function":"../../../node_modules/@thi.ng/checks/is-function.js","@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","@thi.ng/errors/illegal-arity":"../../../node_modules/@thi.ng/errors/illegal-arity.js","@thi.ng/paths":"../../../node_modules/@thi.ng/paths/index.js","./atom":"../../../node_modules/@thi.ng/atom/atom.js","./view":"../../../node_modules/@thi.ng/atom/view.js"}],"../../../node_modules/@thi.ng/api/mixins/inotify.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api = require("../api");
const mixin_1 = require("../mixin");
function inotify_dispatch(listeners, e) {
    if (!listeners)
        return;
    const n = listeners.length;
    let i = 0, l;
    for (i = 0; i < n; i++) {
        l = listeners[i];
        l[0].call(l[1], e);
        if (e.canceled) {
            return;
        }
    }
}
exports.inotify_dispatch = inotify_dispatch;
/**
 * Mixin class decorator, injects INotify default implementation, incl.
 * a lazily instantiated `_listeners` property object, storing
 * registered listeners.
 */
exports.INotify = mixin_1.mixin({
    addListener(id, fn, scope) {
        let l = (this._listeners = this._listeners || {})[id];
        if (!l) {
            l = this._listeners[id] = [];
        }
        if (this.__listener(l, fn, scope) === -1) {
            l.push([fn, scope]);
            return true;
        }
        return false;
    },
    removeListener(id, fn, scope) {
        if (!this._listeners)
            return false;
        const l = this._listeners[id];
        if (l) {
            const idx = this.__listener(l, fn, scope);
            if (idx !== -1) {
                l.splice(idx, 1);
                return true;
            }
        }
        return false;
    },
    notify(e) {
        if (!this._listeners)
            return;
        e.target === undefined && (e.target = this);
        inotify_dispatch(this._listeners[e.id], e);
        inotify_dispatch(this._listeners[api.EVENT_ALL], e);
    },
    __listener(listeners, f, scope) {
        let i = listeners.length;
        while (--i >= 0) {
            const l = listeners[i];
            if (l[0] === f && l[1] === scope) {
                break;
            }
        }
        return i;
    }
});

},{"../api":"../../../node_modules/@thi.ng/api/api.js","../mixin":"../../../node_modules/@thi.ng/api/mixin.js"}],"../../../node_modules/@thi.ng/atom/history.js":[function(require,module,exports) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var History_1;
const mixin = require("@thi.ng/api/mixins/inotify");
const equiv_1 = require("@thi.ng/equiv");
const paths_1 = require("@thi.ng/paths");
const view_1 = require("./view");
/**
 * Undo/redo history stack wrapper for atoms and cursors. Implements
 * `IAtom` interface and so can be used directly in place and delegates
 * to wrapped atom/cursor. Value changes are only recorded in history if
 * `changed` predicate returns truthy value, or else by calling
 * `record()` directly. This class too implements the @thi.ng/api
 * `INotify` interface to support event listeners for `undo()`, `redo()`
 * and `record()`.
 */
let History = History_1 = class History {
    /**
     * @param state parent state
     * @param maxLen max size of undo stack
     * @param changed predicate to determine changed values (default `!equiv(a,b)`)
     */
    constructor(state, maxLen = 100, changed) {
        this.state = state;
        this.maxLen = maxLen;
        this.changed = changed || ((a, b) => !equiv_1.equiv(a, b));
        this.clear();
    }
    get value() {
        return this.deref();
    }
    set value(val) {
        this.reset(val);
    }
    canUndo() {
        return this.history.length > 0;
    }
    canRedo() {
        return this.future.length > 0;
    }
    /**
     * Clears history & future stacks
     */
    clear() {
        this.history = [];
        this.future = [];
    }
    /**
     * Attempts to re-apply most recent historical value to atom and
     * returns it if successful (i.e. there's a history). Before the
     * switch, first records the atom's current value into the future
     * stack (to enable `redo()` feature). Returns `undefined` if
     * there's no history.
     *
     * If undo was possible, the `History.EVENT_UNDO` event is emitted
     * after the restoration with both the `prev` and `curr` (restored)
     * states provided as event value (and object with these two keys).
     * This allows for additional state handling to be executed, e.g.
     * application of the "Command pattern". See `addListener()` for
     * registering event listeners.
     */
    undo() {
        if (this.history.length) {
            const prev = this.state.deref();
            this.future.push(prev);
            const curr = this.state.reset(this.history.pop());
            this.notify({ id: History_1.EVENT_UNDO, value: { prev, curr } });
            return curr;
        }
    }
    /**
     * Attempts to re-apply most recent value from future stack to atom
     * and returns it if successful (i.e. there's a future). Before the
     * switch, first records the atom's current value into the history
     * stack (to enable `undo()` feature). Returns `undefined` if
     * there's no future (so sad!).
     *
     * If redo was possible, the `History.EVENT_REDO` event is emitted
     * after the restoration with both the `prev` and `curr` (restored)
     * states provided as event value (and object with these two keys).
     * This allows for additional state handling to be executed, e.g.
     * application of the "Command pattern". See `addListener()` for
     * registering event listeners.
     */
    redo() {
        if (this.future.length) {
            const prev = this.state.deref();
            this.history.push(prev);
            const curr = this.state.reset(this.future.pop());
            this.notify({ id: History_1.EVENT_REDO, value: { prev, curr } });
            return curr;
        }
    }
    /**
     * `IAtom.reset()` implementation. Delegates to wrapped atom/cursor,
     * but too applies `changed` predicate to determine if there was a
     * change and if the previous value should be recorded.
     *
     * @param val
     */
    reset(val) {
        const prev = this.state.deref();
        this.state.reset(val);
        const changed = this.changed(prev, this.state.deref());
        if (changed) {
            this.record(prev);
        }
        return val;
    }
    resetIn(path, val) {
        const prev = this.state.deref();
        const prevV = paths_1.getIn(prev, path);
        const curr = paths_1.setIn(prev, path, val);
        this.state.reset(curr);
        this.changed(prevV, paths_1.getIn(curr, path)) && this.record(prev);
        return curr;
    }
    /**
     * `IAtom.swap()` implementation. Delegates to wrapped atom/cursor,
     * but too applies `changed` predicate to determine if there was a
     * change and if the previous value should be recorded.
     *
     * @param val
     */
    swap(fn, ...args) {
        return this.reset(fn(this.state.deref(), ...args));
    }
    swapIn(path, fn, ...args) {
        const prev = this.state.deref();
        const prevV = paths_1.getIn(prev, path);
        const curr = paths_1.updateIn(this.state.deref(), path, fn, ...args);
        this.state.reset(curr);
        this.changed(prevV, paths_1.getIn(curr, path)) && this.record(prev);
        return curr;
    }
    /**
     * Records given state in history. This method is only needed when
     * manually managing snapshots, i.e. when applying multiple swaps on
     * the wrapped atom directly, but not wanting to create an history
     * entry for each change. **DO NOT call this explicitly if using
     * `History.reset()` / `History.swap()` etc.**
     *
     * If no `state` is given, uses the wrapped atom's current state
     * value (user code SHOULD always call without arg).
     *
     * If recording succeeded, the `History.EVENT_RECORD` event is
     * emitted with the recorded state provided as event value.
     *
     * @param state
     */
    record(state) {
        const history = this.history;
        const n = history.length;
        let ok = true;
        // check for arg given and not if `state == null` we want to
        // allow null/undefined as possible values
        if (!arguments.length) {
            state = this.state.deref();
            ok = (!n || this.changed(history[n - 1], state));
        }
        if (ok) {
            if (n >= this.maxLen) {
                history.shift();
            }
            history.push(state);
            this.notify({ id: History_1.EVENT_RECORD, value: state });
            this.future.length = 0;
        }
    }
    /**
     * Returns wrapped atom's **current** value.
     */
    deref() {
        return this.state.deref();
    }
    /**
     * `IWatch.addWatch()` implementation. Delegates to wrapped
     * atom/cursor.
     *
     * @param id
     * @param fn
     */
    addWatch(id, fn) {
        return this.state.addWatch(id, fn);
    }
    /**
     * `IWatch.removeWatch()` implementation. Delegates to wrapped
     * atom/cursor.
     *
     * @param id
     */
    removeWatch(id) {
        return this.state.removeWatch(id);
    }
    /**
     * `IWatch.notifyWatches()` implementation. Delegates to wrapped
     * atom/cursor.
     *
     * @param oldState
     * @param newState
     */
    notifyWatches(oldState, newState) {
        return this.state.notifyWatches(oldState, newState);
    }
    addView(path, tx, lazy = true) {
        return new view_1.View(this, path, tx, lazy);
    }
    release() {
        this.state.release();
        delete this.state;
        return true;
    }
    addListener(id, fn, scope) {
        return false;
    }
    removeListener(id, fn, scope) {
        return false;
    }
    notify(event) {
    }
};
History.EVENT_UNDO = "undo";
History.EVENT_REDO = "redo";
History.EVENT_RECORD = "record";
History = History_1 = __decorate([
    mixin.INotify
], History);
exports.History = History;

},{"@thi.ng/api/mixins/inotify":"../../../node_modules/@thi.ng/api/mixins/inotify.js","@thi.ng/equiv":"../../../node_modules/@thi.ng/equiv/index.js","@thi.ng/paths":"../../../node_modules/@thi.ng/paths/index.js","./view":"../../../node_modules/@thi.ng/atom/view.js"}],"../../../node_modules/@thi.ng/atom/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./atom"));
__export(require("./cursor"));
__export(require("./history"));
__export(require("./view"));

},{"./atom":"../../../node_modules/@thi.ng/atom/atom.js","./cursor":"../../../node_modules/@thi.ng/atom/cursor.js","./history":"../../../node_modules/@thi.ng/atom/history.js","./view":"../../../node_modules/@thi.ng/atom/view.js"}],"../../../node_modules/@thi.ng/checks/is-promise.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPromise(x) {
    return x instanceof Promise;
}
exports.isPromise = isPromise;

},{}],"interceptors/api.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // Built-in event ID constants

exports.EV_SET_VALUE = '--set-value';
exports.EV_UPDATE_VALUE = '--update-value';
exports.EV_TOGGLE_VALUE = '--toggle-value'; // Built-in side effect ID constants

exports.FX_CANCEL = '--cancel';
exports.FX_DISPATCH = '--dispatch';
exports.FX_DISPATCH_ASYNC = '--dispatch-async';
exports.FX_DISPATCH_NOW = '--dispatch-now';
exports.FX_DELAY = '--delay';
exports.FX_FETCH = '--fetch';
exports.FX_STATE = '--state';
/**
 * Event ID to trigger redo action.
 * See `EventBus.addBuiltIns()` for further details.
 * Also see `snapshot()` interceptor docs.
 */

exports.EV_REDO = '--redo';
/**
 * Event ID to trigger undo action.
 * See `EventBus.addBuiltIns()` for further details.
 * Also see `snapshot()` interceptor docs.
 */

exports.EV_UNDO = '--undo';
},{}],"interceptors/event-bus.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __values = this && this.__values || function (o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator],
      i = 0;
  if (m) return m.call(o);
  return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var atom_1 = require("@thi.ng/atom/atom");

var is_array_1 = require("@thi.ng/checks/is-array");

var is_function_1 = require("@thi.ng/checks/is-function");

var is_promise_1 = require("@thi.ng/checks/is-promise");

var illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");

var paths_1 = require("@thi.ng/paths");

var api = __importStar(require("./api"));

var FX_CANCEL = api.FX_CANCEL;
var FX_DISPATCH_NOW = api.FX_DISPATCH_NOW;
var FX_STATE = api.FX_STATE;
/**
 * Batched event processor for using composable interceptors for event
 * handling and side effects to execute the result of handled events.
 *
 * Events processed by this class are simple 2-element tuples/arrays of
 * this form: `["event-id", payload?]`, where the `payload` is optional
 * and can be of any type.
 *
 * Events are processed by registered handlers which transform each
 * event into a number of side effect descriptions to be executed later.
 * This separation ensures event handlers themselves are pure functions
 * and leads to more efficient reuse of side effecting operations. The
 * pure data nature until the last stage of processing (the application
 * side effects) too means that event flow can be much easier inspected
 * and debugged.
 *
 * In this model a single event handler itself is an array of objects
 * with `pre` and/or `post` keys and functions attached to each key.
 * These functions are called interceptors, since each intercepts the
 * processing of an event and can contribute their own side effects.
 * Each event's interceptor chain is processed bi-directionally (`pre`
 * in forward, `post` in reverse order) and the effects returned from
 * each interceptor are merged/collected. The outcome of this setup is a
 * more aspect-oriented, composable approach to event handling and
 * allows to inject common, re-usable behaviors for multiple event types
 * (logging, validation, undo/redo triggers etc.).
 *
 * Side effects are only processed after all event handlers have run.
 * Furthermore, their order of execution can be configured with optional
 * priorities.
 *
 * See for further details:
 *
 * - `processQueue()`
 * - `processEvent()`
 * - `processEffects()`
 * - `mergeEffects()`
 *
 * The overall approach of this type of event processing is heavily
 * based on the pattern initially pioneered by @Day8/re-frame, with the
 * following differences:
 *
 * - stateless (see `EventBus` for the more common stateful alternative)
 * - standalone implementation (no assumptions about surrounding
 *   context/framework)
 * - manual control over event queue processing
 * - supports event cancellation (via FX_CANCEL side effect)
 * - side effect collection (multiple side effects for same effect type
 *   per frame)
 * - side effect priorities (to control execution order)
 * - dynamic addition/removal of handlers & effects
 */

var StatelessEventBus =
/** @class */
function () {
  /**
   * Creates a new event bus instance with given handler and effect
   * definitions (all optional).
   *
   * In addition to the user provided handlers & effects, a number of
   * built-ins are added automatically. See `addBuiltIns()`. User
   * handlers can override built-ins.
   *
   * @param handlers
   * @param effects
   */
  function StatelessEventBus(handlers, effects) {
    this.handlers = {};
    this.effects = {};
    this.eventQueue = [];
    this.priorities = [];
    this.addBuiltIns();

    if (handlers) {
      this.addHandlers(handlers);
    }

    if (effects) {
      this.addEffects(effects);
    }
  }
  /**
   * Adds built-in event & side effect handlers. Also see additional
   * built-ins defined by the stateful `EventBus` extension of this
   * class, as well as comments for these class methods:
   *
   * - `mergeEffects()`
   * - `processEvent()`
   *
   * ### Handlers
   *
   * currently none...
   *
   * ### Side effects
   *
   * #### `FX_CANCEL`
   *
   * If assigned `true`, cancels processing of current event, though
   * still applies any side effects already accumulated.
   *
   * #### `FX_DISPATCH`
   *
   * Dispatches assigned events to be processed in next frame.
   *
   * #### `FX_DISPATCH_ASYNC`
   *
   * Async wrapper for promise based side effects.
   *
   * #### `FX_DISPATCH_NOW`
   *
   * Dispatches assigned events as part of currently processed event
   * queue (no delay).
   *
   * #### `FX_DELAY`
   *
   * Async side effect. Only to be used in conjunction with
   * `FX_DISPATCH_ASYNC`. Triggers given event after `x` milliseconds.
   *
   * ```
   * // this triggers `[EV_SUCCESS, "ok"]` event after 1000 ms
   * { [FX_DISPATCH_ASYNC]: [FX_DELAY, [1000, "ok"], EV_SUCCESS, EV_ERROR] }
   * ```
   *
   * #### `FX_FETCH`
   *
   * Async side effect. Only to be used in conjunction with
   * `FX_DISPATCH_ASYNC`. Performs `fetch()` HTTP request and triggers
   * success with received response, or if there was an error with
   * response's `statusText`. The error event is only triggered if the
   * fetched response's `ok` field is non-truthy.
   *
   * - https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
   * - https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
   *
   * ```
   * // fetches "foo.json" and then dispatches EV_SUCCESS or EV_ERROR event
   * { [FX_DISPATCH_ASYNC]: [FX_FETCH, "foo.json", EV_SUCCESS, EV_ERROR] }
   * ```
   */


  StatelessEventBus.prototype.addBuiltIns = function () {
    var _this = this;

    var _a;

    this.addEffects((_a = {}, _a[api.FX_DISPATCH] = [function (e) {
      return _this.dispatch(e);
    }, -999], _a[api.FX_DISPATCH_ASYNC] = [function (_a) {
      var _b = __read(_a, 4),
          id = _b[0],
          arg = _b[1],
          success = _b[2],
          err = _b[3];

      var fx = _this.effects[id];

      if (fx) {
        var p = fx(arg, _this);

        if (is_promise_1.isPromise(p)) {
          p.then(function (res) {
            return _this.dispatch([success, res]);
          }).catch(function (e) {
            return _this.dispatch([err, e]);
          });
        } else {
          console.warn('async effect did not return Promise');
        }
      } else {
        console.warn("skipping invalid async effect: " + id);
      }
    }, -999], _a[api.FX_DELAY] = [function (_a) {
      var _b = __read(_a, 2),
          x = _b[0],
          body = _b[1];

      return new Promise(function (res) {
        return setTimeout(function () {
          return res(body);
        }, x);
      });
    }, 1000], _a[api.FX_FETCH] = [function (req) {
      return fetch(req).then(function (resp) {
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }

        return resp;
      });
    }, 1000], _a));
  };

  StatelessEventBus.prototype.addHandler = function (id, spec) {
    var iceps = is_array_1.isArray(spec) ? spec.map(asInterceptor) : is_function_1.isFunction(spec) ? [{
      pre: spec
    }] : [spec];

    if (iceps.length > 0) {
      if (this.handlers[id]) {
        this.removeHandler(id);
        console.warn("overriding handler for ID: " + id);
      }

      this.handlers[id] = iceps;
    } else {
      illegal_arguments_1.illegalArgs("no handlers in spec for ID: " + id);
    }
  };

  StatelessEventBus.prototype.addHandlers = function (specs) {
    for (var id in specs) {
      this.addHandler(id, specs[id]);
    }
  };

  StatelessEventBus.prototype.addEffect = function (id, fx, priority) {
    if (priority === void 0) {
      priority = 1;
    }

    if (this.effects[id]) {
      this.removeEffect(id);
      console.warn("overriding effect for ID: " + id);
    }

    this.effects[id] = fx;
    var p = [id, priority];
    var priors = this.priorities;

    for (var i = 0; i < priors.length; i++) {
      if (p[1] < priors[i][1]) {
        priors.splice(i, 0, p);
        return;
      }
    }

    priors.push(p);
  };

  StatelessEventBus.prototype.addEffects = function (specs) {
    for (var id in specs) {
      var fx = specs[id];

      if (is_array_1.isArray(fx)) {
        this.addEffect(id, fx[0], fx[1]);
      } else {
        this.addEffect(id, fx);
      }
    }
  };
  /**
   * Prepends given interceptors (or interceptor functions) to
   * selected handlers. If no handler IDs are given, applies
   * instrumentation to all currently registered handlers.
   *
   * @param inject
   * @param ids
   */


  StatelessEventBus.prototype.instrumentWith = function (inject, ids) {
    var e_1, _a;

    var iceps = inject.map(asInterceptor);
    var handlers = this.handlers;

    try {
      for (var _b = __values(ids || Object.keys(handlers)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var id = _c.value;
        var h = handlers[id];

        if (h) {
          handlers[id] = iceps.concat(h);
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  StatelessEventBus.prototype.removeHandler = function (id) {
    delete this.handlers[id];
  };

  StatelessEventBus.prototype.removeHandlers = function (ids) {
    var e_2, _a;

    try {
      for (var ids_1 = __values(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
        var id = ids_1_1.value;
        this.removeHandler(id);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  };

  StatelessEventBus.prototype.removeEffect = function (id) {
    delete this.effects[id];
    var p = this.priorities;

    for (var i = p.length - 1; i >= 0; i--) {
      if (id === p[i][0]) {
        p.splice(i, 1);
        return;
      }
    }
  };

  StatelessEventBus.prototype.removeEffects = function (ids) {
    var e_3, _a;

    try {
      for (var ids_2 = __values(ids), ids_2_1 = ids_2.next(); !ids_2_1.done; ids_2_1 = ids_2.next()) {
        var id = ids_2_1.value;
        this.removeEffect(id);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (ids_2_1 && !ids_2_1.done && (_a = ids_2.return)) _a.call(ids_2);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
  };
  /**
   * If called during event processing, returns current side effect
   * accumulator / interceptor context. Otherwise returns nothing.
   */


  StatelessEventBus.prototype.context = function () {
    return this.currCtx;
  };
  /**
   * Adds given events to event queue to be processed by
   * `processQueue()` later on. It's the user's responsibility to call
   * that latter function repeatedly in a timely manner, preferably
   * via `requestAnimationFrame()` or similar.
   *
   * @param e
   */


  StatelessEventBus.prototype.dispatch = function () {
    var e = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      e[_i] = arguments[_i];
    }

    var _a;

    (_a = this.eventQueue).push.apply(_a, __spread(e));
  };
  /**
   * Adds given events to whatever is the current event queue. If
   * triggered via the `FX_DISPATCH_NOW` side effect from an event
   * handler / interceptor, the event will still be executed in the
   * currently active batch / frame. If called from elsewhere, the
   * result is the same as calling `dispatch()`.
   *
   * @param e
   */


  StatelessEventBus.prototype.dispatchNow = function () {
    var e = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      e[_i] = arguments[_i];
    }

    var _a;

    ;

    (_a = this.currQueue || this.eventQueue).push.apply(_a, __spread(e));
  };
  /**
   * Dispatches given event after `delay` milliseconds (by default
   * 17). Note: Since events are only processed by calling
   * `processQueue()`, it's the user's responsibility to call that
   * latter function repeatedly in a timely manner, preferably via
   * `requestAnimationFrame()` or similar.
   *
   * @param e
   * @param delay
   */


  StatelessEventBus.prototype.dispatchLater = function (e, delay) {
    var _this = this;

    if (delay === void 0) {
      delay = 17;
    }

    setTimeout(function () {
      return _this.dispatch(e);
    }, delay);
  };
  /**
   * Triggers processing of current event queue and returns `true` if
   * any events have been processed.
   *
   * If an event handler triggers the `FX_DISPATCH_NOW` side effect,
   * the new event will be added to the currently processed batch and
   * therefore executed in the same frame. Also see `dispatchNow()`.
   *
   * An optional `ctx` (context) object can be provided, which is used
   * to collect any side effect definitions during processing. This
   * can be useful for debugging, inspection or post-processing
   * purposes.
   *
   * @param ctx
   */


  StatelessEventBus.prototype.processQueue = function (ctx) {
    var e_4, _a;

    console.log('-- processQueue', this.eventQueue.length);

    if (this.eventQueue.length > 0) {
      this.currQueue = __spread(this.eventQueue);
      this.eventQueue.length = 0;
      ctx = this.currCtx = ctx || {};

      try {
        for (var _b = __values(this.currQueue), _c = _b.next(); !_c.done; _c = _b.next()) {
          var e = _c.value;
          this.processEvent(ctx, e);
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_4) throw e_4.error;
        }
      }

      this.currQueue = this.currCtx = undefined;
      this.processEffects(ctx);
      return true;
    }

    return false;
  };
  /**
   * Processes a single event using its configured handler/interceptor
   * chain. Logs warning message and skips processing if no handler is
   * available for the event type.
   *
   * The array of interceptors is processed in bi-directional order.
   * First any `pre` interceptors are processed in forward order. Then
   * `post` interceptors are processed in reverse.
   *
   * Each interceptor can return a result object of side effects,
   * which are being merged and collected for `processEffects()`.
   *
   * Any interceptor can trigger zero or more known side effects, each
   * (side effect) will be collected in an array to support multiple
   * invocations of the same effect type per frame. If no side effects
   * are requested, an interceptor can return `undefined`.
   *
   * Processing of the current event stops immediately, if an
   * interceptor sets the `FX_CANCEL` side effect key to `true`.
   * However, the results of any previous interceptors (incl. the one
   * which cancelled) are kept and processed further as usual.
   *
   * @param ctx
   * @param e
   */


  StatelessEventBus.prototype.processEvent = function (ctx, e) {
    var iceps = this.handlers[e[0]]; // console.log('processEvent -- ', iceps)

    if (!iceps) {
      console.warn("missing handler for event type: " + e[0].toString());
      return;
    }

    var n = iceps.length - 1;
    var hasPost = false;

    for (var i = 0; i <= n && !ctx[FX_CANCEL]; i++) {
      var icep = iceps[i];

      if (icep.pre) {
        this.mergeEffects(ctx, icep.pre(ctx[FX_STATE], e, this, ctx));
      }

      hasPost = hasPost || !!icep.post;
    }

    if (!hasPost) {
      return;
    }

    for (var i = n; i >= 0 && !ctx[FX_CANCEL]; i--) {
      var icep = iceps[i];

      if (icep.post) {
        this.mergeEffects(ctx, icep.post(ctx[FX_STATE], e, this, ctx));
      }
    }
  };
  /**
   * Takes a collection of side effects generated during event
   * processing and applies them in order of configured priorities.
   *
   * @param ctx
   */


  StatelessEventBus.prototype.processEffects = function (ctx) {
    var e_5, _a, e_6, _b;

    var effects = this.effects;

    try {
      for (var _c = __values(this.priorities), _d = _c.next(); !_d.done; _d = _c.next()) {
        var p = _d.value;
        var id = p[0];
        var val = ctx[id];

        if (val !== undefined) {
          var fn = effects[id];

          if (id !== FX_STATE) {
            try {
              for (var val_1 = __values(val), val_1_1 = val_1.next(); !val_1_1.done; val_1_1 = val_1.next()) {
                var v = val_1_1.value;
                fn(v, this, ctx);
              }
            } catch (e_6_1) {
              e_6 = {
                error: e_6_1
              };
            } finally {
              try {
                if (val_1_1 && !val_1_1.done && (_b = val_1.return)) _b.call(val_1);
              } finally {
                if (e_6) throw e_6.error;
              }
            }
          } else {
            fn(val, this, ctx);
          }
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_5) throw e_5.error;
      }
    }
  };
  /**
   * Merges the new side effects returned from an interceptor into the
   * internal effect accumulator.
   *
   * Any events assigned to the `FX_DISPATCH_NOW` effect key are
   * immediately added to the currently active event batch.
   *
   * If an interceptor wishes to cause multiple invocations of a
   * single side effect type (e.g. dispatch multiple other events), it
   * MUST return an array of these values. The only exceptions to this
   * are the following effects, which for obvious reasons can only
   * accept a single value.
   *
   * **Note:** the `FX_STATE` effect is not actually defined by this
   * class here, but is supported to avoid code duplication in
   * `StatefulEventBus`.
   *
   * - `FX_CANCEL`
   * - `FX_STATE`
   *
   * Because of this support (multiple values), the value of a single
   * side effect MUST NOT be a nested array itself, or rather its
   * first item can't be an array.
   *
   * For example:
   *
   * ```
   * // interceptor result map to dispatch a single event
   * { [FX_DISPATCH]: ["foo", "bar"]}
   *
   * // result map format to dispatch multiple events
   * { [FX_DISPATCH]: [ ["foo", "bar"], ["baz", "beep"] ]}
   * ```
   *
   * Any `null` / `undefined` values directly assigned to a side
   * effect are ignored and will not trigger the effect.
   *
   * @param fx
   * @param ret
   */


  StatelessEventBus.prototype.mergeEffects = function (ctx, ret) {
    var e_7, _a, e_8, _b;

    if (!ret) {
      return;
    }

    for (var k in ret) {
      var v = ret[k];

      if (v == null) {
        continue;
      }

      if (k === FX_STATE || k === FX_CANCEL) {
        ctx[k] = v;
      } else if (k === FX_DISPATCH_NOW) {
        if (is_array_1.isArray(v[0])) {
          try {
            for (var v_1 = __values(v), v_1_1 = v_1.next(); !v_1_1.done; v_1_1 = v_1.next()) {
              var e = v_1_1.value;
              e && this.dispatchNow(e);
            }
          } catch (e_7_1) {
            e_7 = {
              error: e_7_1
            };
          } finally {
            try {
              if (v_1_1 && !v_1_1.done && (_a = v_1.return)) _a.call(v_1);
            } finally {
              if (e_7) throw e_7.error;
            }
          }
        } else {
          this.dispatchNow(v);
        }
      } else {
        ctx[k] || (ctx[k] = []);

        if (is_array_1.isArray(v[0])) {
          try {
            for (var v_2 = __values(v), v_2_1 = v_2.next(); !v_2_1.done; v_2_1 = v_2.next()) {
              var e = v_2_1.value;
              e !== undefined && ctx[k].push(e);
            }
          } catch (e_8_1) {
            e_8 = {
              error: e_8_1
            };
          } finally {
            try {
              if (v_2_1 && !v_2_1.done && (_b = v_2.return)) _b.call(v_2);
            } finally {
              if (e_8) throw e_8.error;
            }
          }
        } else {
          ctx[k].push(v);
        }
      }
    }
  };

  return StatelessEventBus;
}();

exports.StatelessEventBus = StatelessEventBus;
/**
 * Stateful version of `StatelessEventBus`. Wraps an `IAtom` state
 * container (Atom/Cursor) and provides additional pre-defined event
 * handlers and side effects to manipulate wrapped state. Prefer this
 * as the default implementation for most use cases.
 */

var EventBus =
/** @class */
function (_super) {
  __extends(EventBus, _super);
  /**
   * Creates a new event bus instance with given parent state, handler
   * and effect definitions (all optional). If no state is given,
   * automatically creates an `Atom` with empty state object.
   *
   * In addition to the user provided handlers & effects, a number of
   * built-ins are added automatically. See `addBuiltIns()`. User
   * handlers can override built-ins.
   *
   * @param state
   * @param handlers
   * @param effects
   */


  function EventBus(state, handlers, effects) {
    var _this = _super.call(this, handlers, effects) || this;

    _this.state = state || new atom_1.Atom({});
    return _this;
  }
  /**
   * Returns value of internal state. Shorthand for:
   * `bus.state.deref()`
   */


  EventBus.prototype.deref = function () {
    return this.state.deref();
  };
  /**
   * Adds same built-in event & side effect handlers as in
   * `StatelessEventBus.addBuiltIns()` and the following additions:
   *
   * ### Handlers
   *
   * #### `EV_SET_VALUE`
   *
   * Resets state path to provided value. See `setIn()`.
   *
   * Example event definition:
   * ```
   * [EV_SET_VALUE, ["path.to.value", val]]
   * ```
   *
   * #### `EV_UPDATE_VALUE`
   *
   * Updates a state path's value with provided function and optional
   * extra arguments. See `updateIn()`.
   *
   * Example event definition:
   * ```
   * [EV_UPDATE_VALUE, ["path.to.value", (x, y) => x + y, 1]]
   * ```
   *
   * #### `EV_TOGGLE_VALUE`
   *
   * Negates a boolean state value at given path.
   *
   * Example event definition:
   * ```
   * [EV_TOGGLE_VALUE, "path.to.value"]
   * ```
   *
   * #### `EV_UNDO`
   *
   * Calls `ctx[id].undo()` and uses return value as new state.
   * Assumes `ctx[id]` is a @thi.ng/atom `History` instance, provided
   * via e.g. `processQueue({ history })`. The event can be triggered
   * with or without ID. By default `"history"` is used as default key
   * to lookup the `History` instance. Furthermore, an additional
   * event can be triggered based on if a previous state has been
   * restored or not (basically, if the undo was successful). This is
   * useful for resetting/re-initializing stateful resources after a
   * successful undo action or to notify the user that no more undo's
   * are possible. The new event will be processed in the same frame
   * and has access to the (possibly) restored state. The event
   * structure for these options is shown below:
   *
   * ```
   * // using default ID
   * bus.dispatch([EV_UNDO]);
   *
   * // using custom history ID
   * bus.dispatch([EV_UNDO, ["custom"]]);
   *
   * // using custom ID and dispatch another event after undo
   * bus.dispatch([EV_UNDO, ["custom", ["ev-undo-success"], ["ev-undo-fail"]]]);
   * ```
   *
   * #### `EV_REDO`
   *
   * Similar to `EV_UNDO`, but for redo actions.
   *
   * ### Side effects
   *
   * #### `FX_STATE`
   *
   * Resets state atom to provided value (only a single update per
   * processing frame).
   */


  EventBus.prototype.addBuiltIns = function () {
    var _this = this;

    var _a, _b;

    _super.prototype.addBuiltIns.call(this); // handlers


    this.addHandlers((_a = {}, _a[api.EV_SET_VALUE] = function (state, _a) {
      var _b = __read(_a, 2),
          _ = _b[0],
          _c = __read(_b[1], 2),
          path = _c[0],
          val = _c[1];

      var _d;

      return _d = {}, _d[FX_STATE] = paths_1.setIn(state, path, val), _d;
    }, _a[api.EV_UPDATE_VALUE] = function (state, _a) {
      var _b = __read(_a, 2),
          _ = _b[0],
          _c = __read(_b[1]),
          path = _c[0],
          fn = _c[1],
          args = _c.slice(2);

      var _d;

      return _d = {}, _d[FX_STATE] = paths_1.updateIn.apply(void 0, __spread([state, path, fn], args)), _d;
    }, _a[api.EV_TOGGLE_VALUE] = function (state, _a) {
      var _b = __read(_a, 2),
          _ = _b[0],
          path = _b[1];

      var _c;

      return _c = {}, _c[FX_STATE] = paths_1.updateIn(state, path, function (x) {
        return !x;
      }), _c;
    }, _a)); // effects

    this.addEffects((_b = {}, _b[FX_STATE] = [function (state) {
      return _this.state.reset(state);
    }, -1000], _b));
  };
  /**
   * Triggers processing of current event queue and returns `true` if
   * the any of the processed events caused a state change.
   *
   * If an event handler triggers the `FX_DISPATCH_NOW` side effect,
   * the new event will be added to the currently processed batch and
   * therefore executed in the same frame. Also see `dispatchNow()`.
   *
   * If the optional `ctx` arg is provided it will be merged into the
   * `InterceptorContext` object passed to each interceptor. Since the
   * merged object is also used to collect triggered side effects,
   * care must be taken that there're no key name clashes.
   *
   * In order to use the built-in `EV_UNDO`, `EV_REDO` events, users
   * MUST provide a @thi.ng/atom History (or compatible undo history
   * instance) via the `ctx` arg, e.g.
   *
   * ```
   * bus.processQueue({ history });
   * ```
   */


  EventBus.prototype.processQueue = function (ctx) {
    var _a, e_9, _b;

    if (this.eventQueue.length > 0) {
      var prev = this.state.deref();
      this.currQueue = __spread(this.eventQueue);
      this.eventQueue.length = 0;
      ctx = this.currCtx = __assign({}, ctx, (_a = {}, _a[FX_STATE] = prev, _a));

      try {
        for (var _c = __values(this.currQueue), _d = _c.next(); !_d.done; _d = _c.next()) {
          var e = _d.value;
          this.processEvent(ctx, e);
        }
      } catch (e_9_1) {
        e_9 = {
          error: e_9_1
        };
      } finally {
        try {
          if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        } finally {
          if (e_9) throw e_9.error;
        }
      }

      this.currQueue = this.currCtx = undefined;
      this.processEffects(ctx);
      return this.state.deref() !== prev;
    }

    return false;
  };

  return EventBus;
}(StatelessEventBus);

exports.EventBus = EventBus;

var asInterceptor = function (i) {
  return is_function_1.isFunction(i) ? {
    pre: i
  } : i;
}; // const undoHandler = (action: string) =>
//     (_, [__, ev], bus, ctx) => {
//         let id = ev ? ev[0] : "history";
//         if (implementsFunction(ctx[id], action)) {
//             const ok = ctx[id][action]();
//             return {
//                 [FX_STATE]: bus.state.deref(),
//                 [FX_DISPATCH_NOW]: ev ?
//                     ok !== undefined ? ev[1] : ev[2] :
//                     undefined,
//             };
//         } else {
//             console.warn("no history in context");
//         }
//     };
},{"@thi.ng/atom/atom":"../../../node_modules/@thi.ng/atom/atom.js","@thi.ng/checks/is-array":"../../../node_modules/@thi.ng/checks/is-array.js","@thi.ng/checks/is-function":"../../../node_modules/@thi.ng/checks/is-function.js","@thi.ng/checks/is-promise":"../../../node_modules/@thi.ng/checks/is-promise.js","@thi.ng/errors/illegal-arguments":"../../../node_modules/@thi.ng/errors/illegal-arguments.js","@thi.ng/paths":"../../../node_modules/@thi.ng/paths/index.js","./api":"interceptors/api.ts"}],"interceptors/interceptors.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var paths_1 = require("@thi.ng/paths");

var api_1 = require("./api");
/**
 * Debug interceptor to log the current event to the console.
 */


exports.trace = function (_, e) {
  return console.log('event:', e);
};
/**
 * Higher-order interceptor. Returns interceptor which unpacks payload
 * from event and assigns it as is to given side effect ID. Assigns
 * `true` to side effect if event has no payload.
 *
 * @param fxID side effect ID
 */


exports.forwardSideFx = function (fxID) {
  return function (_, _a) {
    var _b = __read(_a, 2),
        __ = _b[0],
        body = _b[1];

    var _c;

    return _c = {}, _c[fxID] = body !== undefined ? body : true, _c;
  };
};
/**
 * Higher-order interceptor. Returns interceptor which assigns given
 * event to `FX_DISPATCH` side effect.
 *
 * @param event
 */


exports.dispatch = function (event) {
  return function () {
    var _a;

    return _a = {}, _a[api_1.FX_DISPATCH] = event, _a;
  };
};
/**
 * Higher-order interceptor. Returns interceptor which assigns given
 * event to `FX_DISPATCH_NOW` side effect.
 *
 * @param event
 */


exports.dispatchNow = function (event) {
  return function () {
    var _a;

    return _a = {}, _a[api_1.FX_DISPATCH_NOW] = event, _a;
  };
};
/**
 * Higher-order interceptor. Returns interceptor which calls
 * `ctx[id].record()`, where `ctx` is the currently active
 * `InterceptorContext` passed to all event handlers and `ctx[id]` is
 * assumed to be a @thi.ng/atom `History` instance, passed to
 * `processQueue()`. The default ID for the history instance is
 * `"history"`.
 *
 * Example usage:
 *
 * ```
 * state = new Atom({});
 * history = new History(state);
 * bus = new EventBus(state);
 * // register event handler
 * // each time the `foo` event is triggered, a snapshot of
 * // current app state is recorded first
 * bus.addHandlers({
 *  foo: [snapshot(), valueSetter("foo")]
 * });
 * ...
 * // trigger event
 * bus.dispatch(["foo", 23]);
 *
 * // pass history instance via interceptor context to handlers
 * bus.processQueue({ history });
 * ```
 *
 * @param id
 */


exports.snapshot = function (id) {
  if (id === void 0) {
    id = 'history';
  }

  return function (_, __, ___, ctx) {
    return ctx[id].record();
  };
};
/**
 * Higher-order interceptor for validation purposes. Takes a predicate
 * function and an optional interceptor function, which will only be
 * called if the predicate fails for a given event. By default the
 * `FX_CANCEL` side effect is triggered if the predicate failed, thus
 * ensuring the actual event handler for the failed event will not be
 * executed anymore. However, this can be overridden using the error
 * interceptor's result, which is merged into the result of this
 * interceptor.
 *
 * The error interceptor can return any number of other side effects and
 * so be used to dispatch alternative events instead, for example:
 *
 * ```
 * // this interceptor will cause cancellation of current event
 * // and trigger an "error" event instead
 * ensurePred(
 *   // a dummy predicate which always fails
 *   () => false
 *   // error interceptor fn
 *   () => ({[FX_DISPATCH_NOW]: ["error", "reason"]})
 * )
 * ```
 *
 * Note: For this interceptor to work as expected, it needs to be
 * provided BEFORE the main handler in the interceptor list for a given
 * event, i.e.
 *
 * ```
 * [
 *    ensurePred((state, e) => false),
 *    // actual event handler
 *    (state, e) => console.log("no one never calls me")
 * ]
 * ```
 *
 * @param pred predicate applied to given state & event
 * @param err interceptor triggered on predicate failure
 */


exports.ensurePred = function (pred, err) {
  return function (state, e, bus) {
    var _a;

    return !pred(state, e, bus) ? __assign((_a = {}, _a[api_1.FX_CANCEL] = true, _a), err ? err(state, e, bus) : null) : undefined;
  };
};
/**
 * Specialization of `ensurePred()` to ensure a state value is less than
 * given max at the time when the event is being processed. The optional
 * `path` fn is used to extract or produce the path for the state value
 * to be validated. If omitted, the event's payload item is interpreted
 * as the value path.
 *
 * For example, without a provided `path` function and for an event of
 * this form: `["event-id", "foo.bar"]`, the term `"foo.bar"` would be
 * interpreted as path.
 *
 * If the event has this shape: `["event-id", ["foo.bar", 23]]`, we must
 * provide `(e) => e[1][0]` as path function to extract `"foo.bar"` from
 * the event.
 *
 * @param max
 * @param path path extractor
 * @param err error interceptor
 */


exports.ensureStateLessThan = function (max, path, err) {
  return exports.ensurePred(function (state, e) {
    return paths_1.getIn(state, path ? path(e) : e[1]) < max;
  }, err);
};
/**
 * Specialization of `ensurePred()` to ensure a state value is greater
 * than given min. See `ensureStateLessThan()` for further details.
 *
 * @param min
 * @param path path extractor
 * @param err error interceptor
 */


exports.ensureStateGreaterThan = function (min, path, err) {
  return exports.ensurePred(function (state, e) {
    return paths_1.getIn(state, path ? path(e) : e[1]) > min;
  }, err);
};
/**
 * Specialization of `ensurePred()` to ensure a state value is within
 * given `min` / `max` closed interval. See `ensureStateLessThan()` for
 * further details.
 *
 * @param min
 * @param max
 * @param path path extractor
 * @param err error interceptor
 */


exports.ensureStateRange = function (min, max, path, err) {
  return exports.ensurePred(function (state, e) {
    var x = paths_1.getIn(state, path ? path(e) : e[1]);
    return x >= min && x <= max;
  }, err);
};
/**
 * Specialization of `ensurePred()` to ensure an event's payload value
 * is within given `min` / `max` closed interval. By default, assumes
 * event format like: `[event-id, value]`. However if `value` is given,
 * the provided function can be used to extract the value to be
 * validated from any event. If the value is outside the given interval,
 * triggers `FX_CANCEL` side effect and if `err` is given, the error
 * interceptor can return any number of other side effects and so be
 * used to dispatch alternative events instead.
 *
 * @param min
 * @param max
 * @param value event value extractor
 * @param err error interceptor
 */


exports.ensureParamRange = function (min, max, value, err) {
  return exports.ensurePred(function (_, e) {
    var x = value ? value(e) : e[1];
    return x >= min && x <= max;
  }, err);
};
/**
 * Higher-order interceptor. Returns new interceptor to set state value
 * at provided path. This allows for dedicated events to set state
 * values more concisely, e.g. given this event definition:
 *
 * ```
 * setFoo: valueSetter("foo.bar")
 * ```
 *
 * ...the `setFoo` event then can be triggered like so to update the
 * state value at `foo.bar`:
 *
 * ```
 * bus.dispatch(["setFoo", 23])
 * ```
 *
 * @param path
 * @param tx
 */


exports.valueSetter = function (path, tx) {
  var $ = paths_1.setter(path);
  return function (state, _a) {
    var _b = __read(_a, 2),
        _ = _b[0],
        val = _b[1];

    var _c;

    return _c = {}, _c[api_1.FX_STATE] = $(state, tx ? tx(val) : val), _c;
  };
};
/**
 * Higher-order interceptor. Returns new interceptor to update state
 * value at provided path with given function. This allows for dedicated
 * events to update state values more concisely, e.g. given this event
 * definition:
 *
 * ```
 * incFoo: valueUpdater("foo.bar", (x, y) => x + y)
 * ```
 *
 * ...the `incFoo` event then can be triggered like so to update the
 * state value at `foo.bar` (where `1` is the extra arg provided to the
 * update fn:
 *
 * ```
 * bus.dispatch(["incFoo", 1]) // results in value = value + 1
 * ```
 *
 * @param path
 * @param fn
 */


exports.valueUpdater = function (path, fn) {
  var $ = paths_1.updater(path, fn);
  return function (state, _a) {
    var _b = __read(_a),
        _ = _b[0],
        args = _b.slice(1);

    var _c;

    return _c = {}, _c[api_1.FX_STATE] = $.apply(void 0, __spread([state], args)), _c;
  };
};
},{"@thi.ng/paths":"../../../node_modules/@thi.ng/paths/index.js","./api":"interceptors/api.ts"}],"state.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a;

var animejs_1 = __importDefault(require("animejs"));

var gl_vec3_1 = __importDefault(require("gl-vec3"));

var atom_1 = require("@thi.ng/atom");

var event_bus_1 = require("./interceptors/event-bus");

var interceptors_1 = require("./interceptors/interceptors");

exports.color = [1, 0.4, 0.0];
exports.Event = {
  UPDATE_UI: 'UPDATE_UI',
  TOGGLE_PANEL_SINGLE: 'TOGGLE_PANEL_SINGLE',
  UPDATE_ANIMATION_TIME: 'UPDATE_ANIMATION_TIME',
  UPDATE_LIGHT_PARAM: 'UPDATE_LIGHT_PARAM'
};
var lightParamStartState = {
  unicolor: {},
  normal: {},
  lambert: {},
  attenuation: {
    radius: 25,
    falloff: 0.5
  },
  orenNayar: {
    roughness: 0.3,
    albedo: 0.9
  },
  specularPhong: {
    shiness: 0.3
  },
  specularBlinnPhong: {
    shiness: 0.3
  },
  specularWard: {
    shinyPar: 0.1,
    shinyPerp: 0.3
  },
  specularBeckmann: {
    roughness: 0.3
  },
  specularGaussian: {
    shiness: 0.4
  },
  specularCookTorrance: {
    roughness: 0.4,
    fresnel: 1.0
  }
};
exports.lightParamsMinMax = {
  attenuation: {
    radius: {
      min: 0,
      max: 100,
      step: 0.1
    },
    falloff: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  orenNayar: {
    roughness: {
      min: 0,
      max: 2,
      step: 0.1
    },
    albedo: {
      min: 0,
      max: 2,
      step: 0.1
    }
  },
  specularPhong: {
    shiness: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  specularBlinnPhong: {
    shiness: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  specularWard: {
    shinyPar: {
      min: 0,
      max: 1,
      step: 0.1
    },
    shinyPerp: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  specularBeckmann: {
    roughness: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  specularGaussian: {
    shiness: {
      min: 0,
      max: 1,
      step: 0.1
    }
  },
  specularCookTorrance: {
    roughness: {
      min: 0,
      max: 1,
      step: 0.1
    },
    fresnel: {
      min: 0,
      max: 1,
      step: 0.1
    }
  }
};
var state = new atom_1.Atom({
  dirty: true,
  panels: new Array(11).fill(false),
  animationTime: 0,
  lightParams: lightParamStartState
});
exports.lightParams = new atom_1.Cursor(state, 'lightParams');
window.lightParams = exports.lightParams;
exports.animationTime = new atom_1.Cursor(state, 'animationTime');
exports.dirty = new atom_1.Cursor(state, 'dirty');
window.dirty = exports.dirty;
exports.openLightIndex = state.addView('panels', function (panels) {
  return panels.findIndex(function (x) {
    return x;
  });
});
exports.BUS = new event_bus_1.EventBus(state, (_a = {}, _a[exports.Event.UPDATE_UI] = [interceptors_1.valueUpdater('dirty', function () {
  return true;
})], _a[exports.Event.TOGGLE_PANEL_SINGLE] = [interceptors_1.valueUpdater('panels', function (panels, id) {
  var res = new Array(panels.length).fill(false);
  !panels[id] && (res[id] = true);
  exports.BUS.dispatch([exports.Event.UPDATE_UI]);
  return res;
})], _a[exports.Event.UPDATE_ANIMATION_TIME] = [interceptors_1.valueUpdater('animationTime', function (animationTime, newAnimationTime) {
  if (animationTime !== newAnimationTime) {
    exports.BUS.dispatch([exports.Event.UPDATE_UI]);
  }

  return newAnimationTime;
})], _a[exports.Event.UPDATE_LIGHT_PARAM] = [interceptors_1.valueUpdater('lightParams', function (param, _a) {
  var value = _a.value,
      path = _a.path,
      key = _a.key;
  exports.lightParams.swap(function (x) {
    x[path][key] = value;
    return x;
  });
  exports.BUS.dispatch([exports.Event.UPDATE_UI]);
  return param;
})], _a));

var _lightPosition = gl_vec3_1.default.create();

exports.lightPosition = exports.BUS.state.addView('animationTime', function (t) {
  gl_vec3_1.default.set(_lightPosition, animationObj.value * 20 - 10, Math.sin(Math.PI / 2 + animationObj.value * TWO_PI) * 5, Math.cos(Math.PI / 2 + animationObj.value * TWO_PI) * 5);
  return _lightPosition;
}); //------------------------------------------------------------------ light animation

var animationObj = {
  value: 0
};
var TWO_PI = Math.PI * 2;
var timeline = animejs_1.default.timeline({
  loop: true,
  update: function () {
    if (exports.animationTime.deref() !== animationObj.value) {
      exports.BUS.dispatch([exports.Event.UPDATE_ANIMATION_TIME, animationObj.value]);
    }
  },
  easing: 'easeInOutSine'
}).add({
  targets: animationObj,
  value: 1,
  duration: 3000
}).add({
  targets: animationObj,
  value: 1,
  duration: 2000
}).add({
  targets: animationObj,
  value: 0,
  duration: 3000
}).add({
  targets: animationObj,
  value: 0,
  duration: 2000
});
timeline.play();
},{"animejs":"../../../node_modules/animejs/lib/anime.es.js","gl-vec3":"../../../node_modules/gl-vec3/index.js","@thi.ng/atom":"../../../node_modules/@thi.ng/atom/index.js","./interceptors/event-bus":"interceptors/event-bus.ts","./interceptors/interceptors":"interceptors/interceptors.ts"}],"draw-wireframe.ts":[function(require,module,exports) {
"use strict";

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var transducers_1 = require("@thi.ng/transducers");

var vert = "\nprecision mediump float;\nuniform mat4 projection, view, model;\nattribute vec3 position;\nvoid main () {\n  vec4 mpos = projection * view * model * vec4(position, 1.0);\n  gl_Position = mpos;\n}";
var frag = "\nprecision mediump float;\nuniform vec3 color;\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n}";

function createWireframe(regl, mesh) {
  // const input: Vec3[] = [[1, 0, 3], [3, 2, 1], [5, 4, 7]]
  // const expected = [[[1, 0], [0, 3], [3, 1]], [[3, 2], [2, 1], [1, 3]], [[5, 4], [4, 7], [7, 5]]]
  var triangleToSegments = function (_a) {
    var _b = __read(_a, 3),
        a = _b[0],
        b = _b[1],
        c = _b[2];

    return [[a, b], [b, c], [c, a]];
  };

  var wireframeCells = __spread(transducers_1.map(triangleToSegments, mesh.cells));

  var draw = regl({
    frag: frag,
    vert: vert,
    attributes: {
      position: function () {
        return mesh.positions;
      }
    },
    uniforms: {
      color: regl.prop('color'),
      model: regl.prop('model')
    },
    elements: wireframeCells,
    primitive: 'lines'
  });
  return {
    draw: draw
  };
}

exports.createWireframe = createWireframe;
},{"@thi.ng/transducers":"../../../node_modules/@thi.ng/transducers/index.js"}],"draw-unicolor/draw-unicolor.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var vert = "\nprecision mediump float;\n\nattribute vec3 position;\n\nuniform mat4 projection, view, model;\n\nvoid main () {\n  vec4 mpos = projection * view * model * vec4(position, 1.0);\n  gl_Position = mpos;\n}";
var frag = "\nprecision mediump float;\nuniform vec3 color;\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n}"; //------------------------------------------- regl draw command

function createUnicolor(regl, mesh) {
  var draw = regl({
    frag: frag,
    vert: vert,
    attributes: {
      position: function () {
        return mesh.positions;
      }
    },
    uniforms: {
      model: regl.prop('model'),
      color: regl.prop('color')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createUnicolor = createUnicolor;
},{}],"draw-unicolor/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-unicolor"));
},{"./draw-unicolor":"draw-unicolor/draw-unicolor.ts"}],"draw-normal/normal.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\n// #pragma glslify: transpose = require('glsl-transpose')\n// #pragma glslify: inverse = require('glsl-inverse')\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\n\nvarying vec3 vNormal;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  // mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));\n  vNormal = normalMatrix * normal;\n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-normal/normal.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec3 vNormal;\n\nvoid main () {\n  vec3 color = vNormal * 0.5 + 0.5; \n   gl_FragColor  = vec4(color, 1.0);\n}";
},{}],"draw-normal/draw-normal.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var normal_vert_1 = __importDefault(require("./normal.vert"));

var normal_frag_1 = __importDefault(require("./normal.frag"));

function createNormalMesh(regl, mesh) {
  var draw = regl({
    vert: normal_vert_1.default,
    frag: normal_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createNormalMesh = createNormalMesh;
},{"./normal.vert":"draw-normal/normal.vert","./normal.frag":"draw-normal/normal.frag"}],"draw-normal/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-normal"));
},{"./draw-normal":"draw-normal/draw-normal.ts"}],"draw-diffuse-lambert/diffuse-lambert.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vPos;\nvarying vec3 vLightDirection;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n  vNormal = normalMatrix * normal;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n\n  gl_Position = projection * viewPosition;\n}";
},{}],"draw-diffuse-lambert/diffuse-lambert.frag":[function(require,module,exports) {
module.exports = "// see https://github.com/glslify/glsl-diffuse-lambert\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 diffuseColor;\nuniform vec3 ambientColor;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\n\nvoid main () {\n  float brightness = max(\n    dot(\n      normalize(vLightDirection),\n      normalize(vNormal)\n    ), 0.0);\n  vec3 lightColor = ambientColor + diffuseColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-diffuse-lambert/draw-diffuse-lambert.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var diffuse_lambert_vert_1 = __importDefault(require("./diffuse-lambert.vert"));

var diffuse_lambert_frag_1 = __importDefault(require("./diffuse-lambert.frag")); //------------------------------------------- regl draw command


function createDiffuseLambert(regl, mesh) {
  var draw = regl({
    vert: diffuse_lambert_vert_1.default,
    frag: diffuse_lambert_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      diffuseColor: regl.prop('diffuseColor'),
      ambientColor: regl.prop('ambientColor'),
      lightPosition: regl.prop('lightPosition')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createDiffuseLambert = createDiffuseLambert;
},{"./diffuse-lambert.vert":"draw-diffuse-lambert/diffuse-lambert.vert","./diffuse-lambert.frag":"draw-diffuse-lambert/diffuse-lambert.frag"}],"draw-diffuse-lambert/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-diffuse-lambert"));
},{"./draw-diffuse-lambert":"draw-diffuse-lambert/draw-diffuse-lambert.ts"}],"draw-diffuse-oren-nayar/diffuse-oren-nayar.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-diffuse-oren-nayar/diffuse-oren-nayar.frag":[function(require,module,exports) {
module.exports = "// see https://github.com/glslify/glsl-diffuse-oren-nayar\n\nprecision mediump float;\n#define GLSLIFY 1\n\n#define PI 3.14159265\n\nuniform vec3 eyePosition;\nuniform vec3 diffuseColor;\nuniform vec3 ambientColor;\nuniform float roughness;\nuniform float albedo;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nfloat orenNayarDiffuse(\n  vec3 _lightDirection,\n  vec3 _viewDirection,\n  vec3 _surfaceNormal,\n  float _roughness,\n  float _albedo) {\n  \n  float LdotV = dot(_lightDirection, _viewDirection);\n  float NdotL = dot(_lightDirection, _surfaceNormal);\n  float NdotV = dot(_surfaceNormal, _viewDirection);\n\n  float s = LdotV - NdotL * NdotV;\n  float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));\n\n  float sigma2 = _roughness * _roughness;\n  float A = 1.0 + sigma2 * (_albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));\n  float B = 0.45 * sigma2 / (sigma2 + 0.09);\n\n  return _albedo * max(0.0, NdotL) * (A + B * s / t) / PI;\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n\n  float brightness = orenNayarDiffuse(vLightDirection, viewDirection, vNormal, roughness, albedo);\n  vec3 lightColor = ambientColor + diffuseColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-diffuse-oren-nayar/draw-diffuse-oren-nayar.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var diffuse_oren_nayar_vert_1 = __importDefault(require("./diffuse-oren-nayar.vert"));

var diffuse_oren_nayar_frag_1 = __importDefault(require("./diffuse-oren-nayar.frag")); //------------------------------------------- regl draw command


function createDiffuseOrenNayar(regl, mesh) {
  var draw = regl({
    vert: diffuse_oren_nayar_vert_1.default,
    frag: diffuse_oren_nayar_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      diffuseColor: regl.prop('diffuseColor'),
      ambientColor: regl.prop('ambientColor'),
      roughness: regl.prop('roughness'),
      albedo: regl.prop('albedo')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createDiffuseOrenNayar = createDiffuseOrenNayar;
},{"./diffuse-oren-nayar.vert":"draw-diffuse-oren-nayar/diffuse-oren-nayar.vert","./diffuse-oren-nayar.frag":"draw-diffuse-oren-nayar/diffuse-oren-nayar.frag"}],"draw-diffuse-oren-nayar/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-diffuse-oren-nayar"));
},{"./draw-diffuse-oren-nayar":"draw-diffuse-oren-nayar/draw-diffuse-oren-nayar.ts"}],"draw-specular-phong/specular-phong.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-specular-phong/specular-phong.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 eyePosition;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\nuniform float shiness;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nfloat phongSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float shininess) {\n\n  //Calculate Phong power\n  vec3 R = -reflect(lightDirection, surfaceNormal);\n  return pow(max(0.0, dot(viewDirection, R)), shininess);\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n\n  float brightness = phongSpecular(vLightDirection, viewDirection, vNormal, shiness);\n  vec3 lightColor = ambientColor + specularColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-specular-phong/draw-specular-phong.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var specular_phong_vert_1 = __importDefault(require("./specular-phong.vert"));

var specular_phong_frag_1 = __importDefault(require("./specular-phong.frag")); //------------------------------------------- regl draw command


function createSpecularPhong(regl, mesh) {
  var draw = regl({
    vert: specular_phong_vert_1.default,
    frag: specular_phong_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      specularColor: regl.prop('specularColor'),
      ambientColor: regl.prop('ambientColor'),
      shiness: regl.prop('shiness')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createSpecularPhong = createSpecularPhong;
},{"./specular-phong.vert":"draw-specular-phong/specular-phong.vert","./specular-phong.frag":"draw-specular-phong/specular-phong.frag"}],"draw-specular-phong/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-specular-phong"));
},{"./draw-specular-phong":"draw-specular-phong/draw-specular-phong.ts"}],"draw-specular-blinn-phong/specular-blinn-phong.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-specular-blinn-phong/specular-blinn-phong.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 eyePosition;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\nuniform float shiness;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nfloat phongSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float shininess) {\n\n  //Calculate Phong power\n  vec3 R = -reflect(lightDirection, surfaceNormal);\n  return pow(max(0.0, dot(viewDirection, R)), shininess);\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n\n  float brightness = phongSpecular(vLightDirection, viewDirection, vNormal, shiness);\n  vec3 lightColor = ambientColor + specularColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-specular-blinn-phong/draw-specular-blinn-phong.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var specular_blinn_phong_vert_1 = __importDefault(require("./specular-blinn-phong.vert"));

var specular_blinn_phong_frag_1 = __importDefault(require("./specular-blinn-phong.frag")); //------------------------------------------- regl draw command


function createSpecularBlinnPhong(regl, mesh) {
  var draw = regl({
    vert: specular_blinn_phong_vert_1.default,
    frag: specular_blinn_phong_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      specularColor: regl.prop('specularColor'),
      ambientColor: regl.prop('ambientColor'),
      shiness: regl.prop('shiness')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createSpecularBlinnPhong = createSpecularBlinnPhong;
},{"./specular-blinn-phong.vert":"draw-specular-blinn-phong/specular-blinn-phong.vert","./specular-blinn-phong.frag":"draw-specular-blinn-phong/specular-blinn-phong.frag"}],"draw-specular-blinn-phong/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-specular-blinn-phong"));
},{"./draw-specular-blinn-phong":"draw-specular-blinn-phong/draw-specular-blinn-phong.ts"}],"draw-attenuation/draw-attenuation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var vert = "\nprecision mediump float;\n\nattribute vec3 position;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\n\nvarying vec3 vViewPosition;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);\n\n  vViewPosition = viewModelPosition.xyz;\n\n  gl_Position = projection * viewModelPosition;\n}";
var frag = "\nprecision mediump float;\n\n// by Tom Madams\n// Simple:\n// https://imdoingitwrong.wordpress.com/2011/01/31/light-attenuation/\n// \n// Improved\n// https://imdoingitwrong.wordpress.com/2011/02/10/improved-light-attenuation/\nfloat attenuation(float r, float f, float d) {\n  float denom = d / r + 1.0;\n  float attenuation = 1.0 / (denom*denom);\n  float t = (attenuation - f) / (1.0 - f);\n  return max(t, 0.0);\n}\n\nuniform mat4 view;\nuniform vec3 color;\nuniform vec3 lightPosition;\nuniform float radius;\nuniform float falloff;\n\nvarying vec3 vViewPosition;\n\nvoid main () {\n\n  vec4 lightViewPosition = view * vec4(lightPosition, 1.0);\n  vec3 lightVector = lightViewPosition.xyz - vViewPosition;\n  float lightDistance = length(lightVector);\n  float lightFalloff = attenuation(radius, falloff, lightDistance);\n\n  vec3 lightAttenuated = color * lightFalloff;\n\n  gl_FragColor = vec4(lightAttenuated, 1.0);\n}"; //------------------------------------------- regl draw command

function createAttenuation(regl, mesh) {
  var draw = regl({
    frag: frag,
    vert: vert,
    attributes: {
      position: function () {
        return mesh.positions;
      }
    },
    uniforms: {
      model: regl.prop('model'),
      lightPosition: regl.prop('lightPosition'),
      radius: regl.prop('radius'),
      falloff: regl.prop('falloff'),
      color: regl.prop('color')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createAttenuation = createAttenuation;
},{}],"draw-attenuation/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-attenuation"));
},{"./draw-attenuation":"draw-attenuation/draw-attenuation.ts"}],"draw-specular-ward/specular-ward.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\nvarying vec3 vFiberDirection;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  vFiberDirection = normalize(vec3(uv,0) - dot(vec3(uv,0), normal)*normal);\n\n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-specular-ward/specular-ward.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 eyePosition;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\n\nuniform float shinyPar;\nuniform float shinyPerp;\n \nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\nvarying vec3 vFiberDirection;\n\n#define PI 3.141592653589793\n\nfloat wardSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  vec3 fiberParallel,\n  vec3 fiberPerpendicular,\n  float shinyParallel,\n  float shinyPerpendicular) {\n\n  float NdotL = dot(surfaceNormal, lightDirection);\n  float NdotR = dot(surfaceNormal, viewDirection);\n\n  if(NdotL < 0.0 || NdotR < 0.0) {\n    return 0.0;\n  }\n\n  vec3 H = normalize(lightDirection + viewDirection);\n\n  float NdotH = dot(surfaceNormal, H);\n  float XdotH = dot(fiberParallel, H);\n  float YdotH = dot(fiberPerpendicular, H);\n\n  float coeff = sqrt(NdotL/NdotR) / (4.0 * PI * shinyParallel * shinyPerpendicular); \n  float theta = (pow(XdotH/shinyParallel, 2.0) + pow(YdotH/shinyPerpendicular, 2.0)) / (1.0 + NdotH);\n\n  return coeff * exp(-2.0 * theta);\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n\n  vec3 normal = normalize(vNormal);\n  vec3 fiberPar = normalize(vFiberDirection);\n  vec3 fiberPerp = normalize(cross(vPos, vFiberDirection));\n \n  //Compute specular power \n  float power = wardSpecular(\n    vLightDirection, \n    viewDirection, \n    normal, \n    fiberPar,\n    fiberPerp,\n    shinyPar,\n    shinyPerp);\n \n  gl_FragColor = vec4(specularColor * power,1.0);\n\n}\n";
},{}],"draw-specular-ward/draw-specular-ward.ts":[function(require,module,exports) {
"use strict";
/**
 * More on Ward specular:
 * https://gamedev.stackexchange.com/questions/67679/how-can-i-create-a-shader-that-will-reproduce-this-lighting-effect-on-terrain
 * http://www.cs.utah.edu/~premoze/brdf/
 *
 */

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var specular_ward_vert_1 = __importDefault(require("./specular-ward.vert"));

var specular_ward_frag_1 = __importDefault(require("./specular-ward.frag")); //------------------------------------------- regl draw command


function createSpecularWard(regl, mesh) {
  if (!mesh.uvs) {
    throw new Error('specular ward model need uv!');
  }

  var draw = regl({
    vert: specular_ward_vert_1.default,
    frag: specular_ward_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals,
      uv: mesh.uvs
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      specularColor: regl.prop('specularColor'),
      ambientColor: regl.prop('ambientColor'),
      shinyPar: regl.prop('shinyPar'),
      shinyPerp: regl.prop('shinyPerp')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createSpecularWard = createSpecularWard;
},{"./specular-ward.vert":"draw-specular-ward/specular-ward.vert","./specular-ward.frag":"draw-specular-ward/specular-ward.frag"}],"draw-specular-ward/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-specular-ward"));
},{"./draw-specular-ward":"draw-specular-ward/draw-specular-ward.ts"}],"draw-specular-beckmann/specular-beckmann.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-specular-beckmann/specular-beckmann.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 eyePosition;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\nuniform float roughness;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nfloat beckmannDistribution(float x, float roughness) {\n  float NdotH = max(x, 0.0001);\n  float cos2Alpha = NdotH * NdotH;\n  float tan2Alpha = (cos2Alpha - 1.0) / cos2Alpha;\n  float roughness2 = roughness * roughness;\n  float denom = 3.141592653589793 * roughness2 * cos2Alpha * cos2Alpha;\n  return exp(tan2Alpha / roughness2) / denom;\n}\n\nfloat beckmannSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float roughness) {\n  return beckmannDistribution(dot(surfaceNormal, normalize(lightDirection + viewDirection)), roughness);\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n  vec3 eyeDir = normalize(-vPos);\n  float brightness = beckmannSpecular(vLightDirection, eyeDir, vNormal, roughness);\n  vec3 lightColor = ambientColor + specularColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-specular-beckmann/draw-specular-beckmann.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var specular_beckmann_vert_1 = __importDefault(require("./specular-beckmann.vert"));

var specular_beckmann_frag_1 = __importDefault(require("./specular-beckmann.frag")); //------------------------------------------- regl draw command


function createSpecularBeckmann(regl, mesh) {
  var draw = regl({
    vert: specular_beckmann_vert_1.default,
    frag: specular_beckmann_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      specularColor: regl.prop('specularColor'),
      ambientColor: regl.prop('ambientColor'),
      roughness: regl.prop('roughness')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createSpecularBeckmann = createSpecularBeckmann;
},{"./specular-beckmann.vert":"draw-specular-beckmann/specular-beckmann.vert","./specular-beckmann.frag":"draw-specular-beckmann/specular-beckmann.frag"}],"draw-specular-beckmann/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-specular-beckmann"));
},{"./draw-specular-beckmann":"draw-specular-beckmann/draw-specular-beckmann.ts"}],"draw-specular-gaussian/specular-gaussian.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-specular-gaussian/specular-gaussian.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 eyePosition;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\nuniform float shiness;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nfloat gaussianSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float shininess) {\n  vec3 H = normalize(lightDirection + viewDirection);\n  float theta = acos(dot(H, surfaceNormal));\n  float w = theta / shininess;\n  return exp(-w*w);\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n  vec3 eyeDir = normalize(-vPos);\n  float brightness = gaussianSpecular(vLightDirection, eyeDir, vNormal, shiness);\n  vec3 lightColor = ambientColor + specularColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-specular-gaussian/draw-specular-gaussian.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var specular_gaussian_vert_1 = __importDefault(require("./specular-gaussian.vert"));

var specular_gaussian_frag_1 = __importDefault(require("./specular-gaussian.frag")); //------------------------------------------- regl draw command


function createSpecularGaussian(regl, mesh) {
  var draw = regl({
    vert: specular_gaussian_vert_1.default,
    frag: specular_gaussian_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      specularColor: regl.prop('specularColor'),
      ambientColor: regl.prop('ambientColor'),
      shiness: regl.prop('shiness')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createSpecularGaussian = createSpecularGaussian;
},{"./specular-gaussian.vert":"draw-specular-gaussian/specular-gaussian.vert","./specular-gaussian.frag":"draw-specular-gaussian/specular-gaussian.frag"}],"draw-specular-gaussian/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-specular-gaussian"));
},{"./draw-specular-gaussian":"draw-specular-gaussian/draw-specular-gaussian.ts"}],"draw-specular-cook-torrance/specular-cook-torrance.vert":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform mat3 normalMatrix;\nuniform vec3 lightPosition;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nvoid main () {\n  mat4 modelViewMatrix = view * model;\n  vNormal = normalMatrix * normal;\n  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n  vec3 lightViewPosition =  (view * vec4(lightPosition, 1.0)).xyz;\n  vLightDirection = normalize(lightViewPosition - vPos);\n  \n  gl_Position = projection * modelViewMatrix * vec4(position, 1.0);\n}";
},{}],"draw-specular-cook-torrance/specular-cook-torrance.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 eyePosition;\nuniform vec3 specularColor;\nuniform vec3 ambientColor;\nuniform float roughness;\nuniform float fresnel;\n\nvarying vec3 vNormal;\nvarying vec3 vLightDirection;\nvarying vec3 vPos;\n\nfloat beckmannDistribution(float x, float roughness) {\n  float NdotH = max(x, 0.0001);\n  float cos2Alpha = NdotH * NdotH;\n  float tan2Alpha = (cos2Alpha - 1.0) / cos2Alpha;\n  float roughness2 = roughness * roughness;\n  float denom = 3.141592653589793 * roughness2 * cos2Alpha * cos2Alpha;\n  return exp(tan2Alpha / roughness2) / denom;\n}\n\nfloat cookTorranceSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float roughness,\n  float fresnel) {\n\n  float VdotN = max(dot(viewDirection, surfaceNormal), 0.0);\n  float LdotN = max(dot(lightDirection, surfaceNormal), 0.0);\n\n  //Half angle vector\n  vec3 H = normalize(lightDirection + viewDirection);\n\n  //Geometric term\n  float NdotH = max(dot(surfaceNormal, H), 0.0);\n  float VdotH = max(dot(viewDirection, H), 0.000001);\n  float LdotH = max(dot(lightDirection, H), 0.000001);\n  float G1 = (2.0 * NdotH * VdotN) / VdotH;\n  float G2 = (2.0 * NdotH * LdotN) / LdotH;\n  float G = min(1.0, min(G1, G2));\n  \n  //Distribution term\n  float D = beckmannDistribution(NdotH, roughness);\n\n  //Fresnel term\n  float F = pow(1.0 - VdotN, fresnel);\n\n  //Multiply terms and done\n  return  G * F * D / max(3.14159265 * VdotN, 0.000001);\n}\n\nvoid main () {\n  vec3 viewDirection = normalize(eyePosition - vPos);\n\n  float brightness = cookTorranceSpecular(\n    vLightDirection, \n    viewDirection, \n    vNormal, \n    roughness,\n    fresnel);\n  vec3 lightColor = ambientColor + specularColor * brightness;\n  gl_FragColor = vec4(lightColor, 1.0);\n}\n";
},{}],"draw-specular-cook-torrance/draw-specular-cook-torrance.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var specular_cook_torrance_vert_1 = __importDefault(require("./specular-cook-torrance.vert"));

var specular_cook_torrance_frag_1 = __importDefault(require("./specular-cook-torrance.frag")); //------------------------------------------- regl draw command


function createSpecularCookTorrance(regl, mesh) {
  var draw = regl({
    vert: specular_cook_torrance_vert_1.default,
    frag: specular_cook_torrance_frag_1.default,
    attributes: {
      position: mesh.positions,
      normal: mesh.normals
    },
    uniforms: {
      model: regl.prop('model'),
      normalMatrix: regl.prop('normalMatrix'),
      eyePosition: regl.prop('eyePosition'),
      lightPosition: regl.prop('lightPosition'),
      specularColor: regl.prop('specularColor'),
      ambientColor: regl.prop('ambientColor'),
      roughness: regl.prop('roughness'),
      fresnel: regl.prop('fresnel')
    },
    elements: function () {
      return mesh.cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createSpecularCookTorrance = createSpecularCookTorrance;
},{"./specular-cook-torrance.vert":"draw-specular-cook-torrance/specular-cook-torrance.vert","./specular-cook-torrance.frag":"draw-specular-cook-torrance/specular-cook-torrance.frag"}],"draw-specular-cook-torrance/index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./draw-specular-cook-torrance"));
},{"./draw-specular-cook-torrance":"draw-specular-cook-torrance/draw-specular-cook-torrance.ts"}],"materials.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var gl_vec3_1 = __importDefault(require("gl-vec3"));

var gl_mat3_1 = __importDefault(require("gl-mat3"));

var gl_mat4_1 = __importDefault(require("gl-mat4"));

var draw_unicolor_1 = require("./draw-unicolor");

var draw_normal_1 = require("./draw-normal");

var draw_diffuse_lambert_1 = require("./draw-diffuse-lambert");

var draw_diffuse_oren_nayar_1 = require("./draw-diffuse-oren-nayar");

var draw_specular_phong_1 = require("./draw-specular-phong");

var draw_specular_blinn_phong_1 = require("./draw-specular-blinn-phong");

var draw_attenuation_1 = require("./draw-attenuation");

var draw_specular_ward_1 = require("./draw-specular-ward");

var draw_specular_beckmann_1 = require("./draw-specular-beckmann");

var draw_specular_gaussian_1 = require("./draw-specular-gaussian");

var draw_specular_cook_torrance_1 = require("./draw-specular-cook-torrance");

var state_1 = require("./state");

var unicolorProps = {
  model: gl_mat4_1.default.create(),
  color: state_1.color
};

var attenuation = __assign({
  color: state_1.color
}, state_1.lightParams.deref().attenuation, {
  lightPosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create()
});

var normalProps = __assign({}, state_1.lightParams.deref().normal, {
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var lambertProps = {
  diffuseColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08],
  lightPosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
};

var orenNayar = __assign({
  diffuseColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().orenNayar, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var specularPhong = __assign({
  specularColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().specularPhong, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var specularBlinnPhong = __assign({
  specularColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().specularBlinnPhong, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var specularWard = __assign({
  specularColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().specularWard, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var specularBeckmann = __assign({
  specularColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().specularBeckmann, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var specularGaussian = __assign({
  specularColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().specularGaussian, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

var specularCookTorrance = __assign({
  specularColor: state_1.color,
  ambientColor: [0.08, 0.08, 0.08]
}, state_1.lightParams.deref().specularCookTorrance, {
  lightPosition: gl_vec3_1.default.create(),
  eyePosition: gl_vec3_1.default.create(),
  model: gl_mat4_1.default.create(),
  normalMatrix: gl_mat3_1.default.create()
});

exports.createCommandAndProps = [{
  path: 'unicolor',
  name: 'Unicolor',
  create: draw_unicolor_1.createUnicolor,
  props: unicolorProps
}, {
  path: 'attenuation',
  name: 'Light attenuation',
  create: draw_attenuation_1.createAttenuation,
  props: attenuation
}, {
  path: 'normal',
  name: 'Normals',
  create: draw_normal_1.createNormalMesh,
  props: normalProps
}, {
  path: 'lambert',
  name: 'Diffuse Lambert',
  create: draw_diffuse_lambert_1.createDiffuseLambert,
  props: lambertProps
}, {
  path: 'orenNayar',
  name: 'Diffuse Oren Nayar',
  create: draw_diffuse_oren_nayar_1.createDiffuseOrenNayar,
  props: orenNayar
}, {
  path: 'specularPhong',
  name: 'Specular Phong',
  create: draw_specular_phong_1.createSpecularPhong,
  props: specularPhong
}, {
  path: 'specularBlinnPhong',
  name: 'Specular Blinn Phong',
  create: draw_specular_blinn_phong_1.createSpecularBlinnPhong,
  props: specularBlinnPhong
}, {
  path: 'specularWard',
  name: 'Specular Ward',
  create: draw_specular_ward_1.createSpecularWard,
  props: specularWard
}, {
  path: 'specularBeckmann',
  name: 'Specular Beckmann',
  create: draw_specular_beckmann_1.createSpecularBeckmann,
  props: specularBeckmann
}, {
  path: 'specularGaussian',
  name: 'Specular Gaussian',
  create: draw_specular_gaussian_1.createSpecularGaussian,
  props: specularGaussian
}, {
  path: 'specularCookTorrance',
  name: 'Specular Cook Torrance',
  create: draw_specular_cook_torrance_1.createSpecularCookTorrance,
  props: specularCookTorrance
}];
},{"gl-vec3":"../../../node_modules/gl-vec3/index.js","gl-mat3":"../../../node_modules/gl-mat3/index.js","gl-mat4":"../../../node_modules/gl-mat4/index.js","./draw-unicolor":"draw-unicolor/index.ts","./draw-normal":"draw-normal/index.ts","./draw-diffuse-lambert":"draw-diffuse-lambert/index.ts","./draw-diffuse-oren-nayar":"draw-diffuse-oren-nayar/index.ts","./draw-specular-phong":"draw-specular-phong/index.ts","./draw-specular-blinn-phong":"draw-specular-blinn-phong/index.ts","./draw-attenuation":"draw-attenuation/index.ts","./draw-specular-ward":"draw-specular-ward/index.ts","./draw-specular-beckmann":"draw-specular-beckmann/index.ts","./draw-specular-gaussian":"draw-specular-gaussian/index.ts","./draw-specular-cook-torrance":"draw-specular-cook-torrance/index.ts","./state":"state.ts"}],"draw-quad.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var vert = "\nprecision mediump float;\nuniform mat4 projection, view, model;\nattribute vec3 position;\nvoid main () {\n  vec4 mpos = projection * view * model * vec4(position, 1.0);\n  gl_Position = mpos;\n}";
var frag = "\nprecision mediump float;\nuniform vec3 color;\nvoid main () {\n  gl_FragColor = vec4(color, 1.0);\n}";

function createUnicolorQuad(regl, quad) {
  var cells = [[0, 1, 2], [1, 2, 3]]; // TODO: test normals

  var draw = regl({
    frag: frag,
    vert: vert,
    attributes: {
      position: function () {
        return quad.positions;
      }
    },
    uniforms: {
      color: regl.prop('color'),
      model: regl.prop('model')
    },
    elements: function () {
      return cells;
    }
  });
  return {
    draw: draw
  };
}

exports.createUnicolorQuad = createUnicolorQuad;
},{}],"scene.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var regl_1 = __importDefault(require("regl"));

var canvas_1 = require("@thi.ng/hdom-components/canvas");

var regl_draw_1 = require("@tstackgl/regl-draw");

var regl_camera_1 = __importDefault(require("regl-camera"));

var primitive_torus_1 = __importDefault(require("primitive-torus"));

var tx = __importStar(require("@thi.ng/transducers"));

var gl_mat4_1 = __importDefault(require("gl-mat4"));

var gl_mat3_1 = __importDefault(require("gl-mat3"));

var primitive_plane_1 = __importDefault(require("primitive-plane"));

var state_1 = require("./state");

var draw_wireframe_1 = require("./draw-wireframe");

var materials_1 = require("./materials");

var draw_quad_1 = require("./draw-quad");

var loop = {
  cancel: function () {}
};

function createReglScene() {
  var init = function (canvas, __) {
    var width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerHeight;
    var height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    canvas_1.adaptDPI(canvas, width, height);
    var regl = regl_1.default({
      canvas: canvas,
      extensions: ['OES_standard_derivatives']
    });
    var frameCatch = regl_draw_1.createFrameCatch(regl);
    var camera = regl_camera_1.default(regl, {
      distance: 25,
      phi: 0.4,
      theta: 1.2
    });
    var axes = regl_draw_1.createXYZ(regl, 10);
    var lightDebugPoint = regl_draw_1.createDrawPointDebug(regl, 0.2);
    var mesh = primitive_torus_1.default();
    var numRow = 3;
    var xform = tx.comp(tx.mapIndexed(function (i, _a) {
      var create = _a.create,
          props = _a.props,
          path = _a.path;
      var model = gl_mat4_1.default.create();
      var translation = [7.5 - Math.floor(i / numRow) * 5, 1.5, 5 - i % numRow * 5];
      gl_mat4_1.default.translate(model, model, translation);
      return {
        model: model,
        drawCommand: create(regl, mesh),
        props: props,
        path: path
      };
    }));

    var commandsAndProps = __spread(tx.iterator1(xform, materials_1.createCommandAndProps));

    var floor = primitive_plane_1.default(20, 15, Math.ceil(commandsAndProps.length / 3), 3);
    var drawFloor = draw_wireframe_1.createWireframe(regl, floor);
    var floorProps = {
      color: [0.2, 0.2, 0.2],
      model: gl_mat4_1.default.fromRotation(gl_mat4_1.default.create(), Math.PI / 2, [1, 0, 0])
    };
    var activePlane = primitive_plane_1.default(5, 5, 1, 1);
    var unicolorQuad = draw_quad_1.createUnicolorQuad(regl, activePlane);
    var activePlaneModelMatrix = gl_mat4_1.default.create();
    var activePlaneRotation = gl_mat4_1.default.fromRotation(gl_mat4_1.default.create(), Math.PI / 2, [1, 0, 0]);
    var modelViewMatrix = gl_mat4_1.default.create();
    var normalMatrix = gl_mat3_1.default.create();
    var inverseModelViewMatrix = gl_mat4_1.default.create();
    loop = frameCatch(function (_a) {
      camera(function (cameraState) {
        if (!cameraState.dirty && !state_1.dirty.deref()) {
          return;
        } // console.log('draw loop')


        regl.clear({
          color: [0, 0, 0, 0]
        }); // axes.draw()

        var activePosition = state_1.openLightIndex.deref() !== -1 ? [7.5 - Math.floor(state_1.openLightIndex.deref() / numRow) * 5, 0, 5 - state_1.openLightIndex.deref() % numRow * 5] : null;
        var lp = state_1.lightPosition.deref();
        lightDebugPoint.draw({
          color: [1, 1, 0],
          translate: lp
        });
        commandsAndProps.forEach(function (_a, i) {
          var drawCommand = _a.drawCommand,
              model = _a.model,
              props = _a.props,
              path = _a.path;
          gl_mat4_1.default.multiply(modelViewMatrix, cameraState.view, model);
          gl_mat4_1.default.invert(inverseModelViewMatrix, modelViewMatrix);
          gl_mat3_1.default.fromMat4(normalMatrix, inverseModelViewMatrix);
          gl_mat3_1.default.transpose(normalMatrix, normalMatrix);
          props.model = model;
          props.normalMatrix = normalMatrix;
          props.eyePosition = cameraState.eye;
          props.lightPosition = lp;
          drawCommand.draw(__assign({}, props, state_1.lightParams.deref()[path]));
        });
        drawFloor.draw(floorProps);

        if (activePosition) {
          unicolorQuad.draw({
            color: [0.2, 0.2, 0.2],
            model: gl_mat4_1.default.multiply(activePlaneModelMatrix, gl_mat4_1.default.fromTranslation(activePlaneModelMatrix, activePosition), activePlaneRotation)
          });
        }

        state_1.dirty.reset(false);
      });
    });
  };

  var update = function () {};

  return {
    init: init,
    update: update
  };
}

exports.createReglScene = createReglScene;

if (module.hot) {
  ;
  module.hot.dispose(function () {
    loop.cancel();
  });
}
},{"regl":"../../../node_modules/regl/dist/regl.js","@thi.ng/hdom-components/canvas":"../../../node_modules/@thi.ng/hdom-components/canvas.js","@tstackgl/regl-draw":"../../../node_modules/@tstackgl/regl-draw/dist/index.js","regl-camera":"../../../node_modules/regl-camera/regl-camera.js","primitive-torus":"../../../node_modules/primitive-torus/index.js","@thi.ng/transducers":"../../../node_modules/@thi.ng/transducers/index.js","gl-mat4":"../../../node_modules/gl-mat4/index.js","gl-mat3":"../../../node_modules/gl-mat3/index.js","primitive-plane":"../../../node_modules/primitive-plane/index.js","./state":"state.ts","./draw-wireframe":"draw-wireframe.ts","./materials":"materials.ts","./draw-quad":"draw-quad.ts"}],"../../../node_modules/@thi.ng/hiccup-carbon-icons/header-chevron.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_CHEVRON = ["svg", { viewBox: "0 0 20 20" },
    ["path",
        {
            d: "M6.542 4.945l.707-.707 6.004 6.004-6.004 6.02-.708-.707 5.298-5.312z",
            "fill-rule": "nonzero",
        }]];

},{}],"../../../node_modules/@thi.ng/hiccup-carbon-icons/header-close.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_CLOSE = ["svg", { viewBox: "0 0 20 20" },
    ["path",
        {
            "fill-rule": "nonzero",
            d: "M10 9.293l4.146-4.147.708.708L10.707 10l4.147 4.146-.708.708L10 10.707l-4.146 4.147-.708-.708L9.293 10 5.146 5.854l.708-.708L10 9.293z",
        }]];

},{}],"accordion/icon-wrapper.ts":[function(require,module,exports) {
"use strict";

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Not a component. Wraps given SVG icon in a fixed size span and
 * customizes fill color.
 *
 * @param icon
 * @param fill
 * @param width
 * @param attribs
 */

exports.iconWrapper = function (icon, fill, width, attribs) {
  if (attribs === void 0) {
    attribs = {
      class: 'mr2'
    };
  }

  return ['span.dib.w1.h1', attribs, __spread(['svg', {
    viewBox: icon[1].viewBox,
    fill: fill,
    width: width,
    height: width
  }], icon.slice(2))];
};
},{}],"accordion/accordion.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var header_chevron_1 = require("@thi.ng/hiccup-carbon-icons/header-chevron");

var header_close_1 = require("@thi.ng/hiccup-carbon-icons/header-close");

var icon_wrapper_1 = require("./icon-wrapper");
/**
 * Context-themed accordion component. Takes an `onclick` event handler
 * and `panelOpen` predicate (both of which are only being given a panel
 * ID) and any number of panel objects of `{ title, body }`.
 *
 * @param ctx
 * @param onclick
 * @param panelOpen
 * @param sections
 */


exports.accordion = function (ctx, onclick, panelOpen) {
  var sections = [];

  for (var _i = 3; _i < arguments.length; _i++) {
    sections[_i - 3] = arguments[_i];
  }

  if (!ctx.theme) {
    var themeExample = {
      accordion: {
        root: {
          class: 'string'
        },
        title: {
          class: 'string'
        },
        bodyOpen: {
          class: 'string'
        },
        bodyClosed: {
          class: 'string'
        }
      }
    };
    throw new Error("Accordion component needs theme as object: " + JSON.stringify(themeExample, null, 2));
  }

  return ['div', ctx.theme.accordion.root, sections.map(function (panel, i) {
    return [accordionPanel, onclick, i, panelOpen(i), panel];
  })];
};

var accordionPanel = function (ctx, onclick, id, open, _a) {
  var title = _a.title,
      body = _a.body;
  return ['div', ['h4', __assign({}, ctx.theme.accordion.title, {
    onclick: function () {
      return onclick(id);
    }
  }), icon_wrapper_1.iconWrapper(open ? header_close_1.HEADER_CLOSE : header_chevron_1.HEADER_CHEVRON, '#555', '80%'), title], open ? ['div.panel.panel-active', __spread(['div.content', ctx.theme.accordion.bodyOpen], body)] : ['div.panel', ['div.content', ctx.theme.accordion.bodyClosed]]];
};
},{"@thi.ng/hiccup-carbon-icons/header-chevron":"../../../node_modules/@thi.ng/hiccup-carbon-icons/header-chevron.js","@thi.ng/hiccup-carbon-icons/header-close":"../../../node_modules/@thi.ng/hiccup-carbon-icons/header-close.js","./icon-wrapper":"accordion/icon-wrapper.ts"}],"slider.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

function slider(label, value, onChange, opts) {
  return ['div', ['div', label], ['input', __assign({
    type: 'range',
    value: value,
    oninput: function (e) {
      return onChange(parseFloat(e.target.value));
    }
  }, opts)]];
}

exports.slider = slider;
},{}],"background.png":[function(require,module,exports) {
module.exports = "/background.e3ad310f.png";
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var hdom_1 = require("@thi.ng/hdom");

var canvas_1 = require("@thi.ng/hdom-components/canvas");

var scene_1 = require("./scene");

var materials_1 = require("./materials");

var accordion_1 = require("./accordion/accordion");

var state_1 = require("./state");

var slider_1 = require("./slider");

var background_png_1 = __importDefault(require("./background.png"));

var noParams = ['div', 'no parameter'];

var params = function (keys, path) {
  return keys.map(function (key, i) {
    var item = state_1.lightParams.deref()[path];
    return ["div" + (i !== 0 ? '.mv2' : ''), [slider_1.slider(key + ": " + item[key], item[key], function (value) {
      state_1.BUS.dispatch([state_1.Event.UPDATE_LIGHT_PARAM, {
        value: value,
        path: path,
        key: key
      }]);
    }, state_1.lightParamsMinMax[path][key])]];
  });
};

var panels = function () {
  return materials_1.createCommandAndProps.map(function (_a) {
    var name = _a.name,
        path = _a.path;
    var pathKeys = state_1.lightParams.deref()[path];
    var keys = pathKeys ? Object.keys(pathKeys) : [];
    return {
      title: name,
      body: [keys.length === 0 ? noParams : params(keys, path)]
    };
  });
};

var materialPanel = function (ctx) {
  return accordion_1.accordion.apply(void 0, __spread([ctx, function (id) {
    return ctx.bus.dispatch([state_1.Event.TOGGLE_PANEL_SINGLE, id]);
  }, function (id) {
    return ctx.bus.state.value.panels[id];
  }], panels()));
};

var canvas = canvas_1.canvasWebGL(scene_1.createReglScene());

var app = function () {
  var processed = ctx.bus.processQueue();
  var content = processed ? ['div.f7.code', ['div.w-100.h-100', ['p.ma0.pa2', 'light study'], ['div.vw-100.vh-100.flex',
  /* */
  ['div.w5.pa2.pt3', materialPanel],
  /* */
  ['div.w-100.vh-100', {
    style: {
      'background-image': "url(\"" + background_png_1.default + "\")"
    }
  }, [canvas]]]]] : null;
  return content;
};

var ctx = {
  bus: state_1.BUS,
  theme: {
    accordion: {
      root: {
        class: 'mv3'
      },
      title: {
        class: 'pointer fw6 ma0 mt2 pv2 ph3 bb b--gray dim'
      },
      bodyOpen: {
        class: 'gray pa3 mt2 bb'
      },
      bodyClosed: {
        class: 'ph3'
      }
    }
  }
};
window.ctx = ctx;
var hdomDispose = hdom_1.start(app, {
  ctx: ctx
});
state_1.BUS.dispatch([state_1.Event.UPDATE_UI]);

if (module.hot) {
  ;
  module.hot.dispose(function () {
    hdomDispose();
  });
}
},{"@thi.ng/hdom":"../../../node_modules/@thi.ng/hdom/index.js","@thi.ng/hdom-components/canvas":"../../../node_modules/@thi.ng/hdom-components/canvas.js","./scene":"scene.ts","./materials":"materials.ts","./accordion/accordion":"accordion/accordion.ts","./state":"state.ts","./slider":"slider.ts","./background.png":"background.png"}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60816" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.map