import {
  es_exports,
  init_es,
  init_redux_toolkit_esm,
  redux_toolkit_esm_exports
} from "./chunk-T7I6SSIH.js";
import "./chunk-Z2PTZEM6.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-ROME4SDB.js";

// node_modules/immer/dist/immer.cjs.development.js
var require_immer_cjs_development = __commonJS({
  "node_modules/immer/dist/immer.cjs.development.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _ref;
    var hasSymbol = typeof Symbol !== "undefined" && typeof Symbol("x") === "symbol";
    var hasMap = typeof Map !== "undefined";
    var hasSet = typeof Set !== "undefined";
    var hasProxies = typeof Proxy !== "undefined" && typeof Proxy.revocable !== "undefined" && typeof Reflect !== "undefined";
    var NOTHING = hasSymbol ? Symbol.for("immer-nothing") : (_ref = {}, _ref["immer-nothing"] = true, _ref);
    var DRAFTABLE = hasSymbol ? Symbol.for("immer-draftable") : "__$immer_draftable";
    var DRAFT_STATE = hasSymbol ? Symbol.for("immer-state") : "__$immer_state";
    var iteratorSymbol = typeof Symbol != "undefined" && Symbol.iterator || "@@iterator";
    var errors = {
      0: "Illegal state",
      1: "Immer drafts cannot have computed properties",
      2: "This object has been frozen and should not be mutated",
      3: function _(data) {
        return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
      },
      4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
      5: "Immer forbids circular references",
      6: "The first or second argument to `produce` must be a function",
      7: "The third argument to `produce` must be a function or undefined",
      8: "First argument to `createDraft` must be a plain object, an array, or an immerable object",
      9: "First argument to `finishDraft` must be a draft returned by `createDraft`",
      10: "The given draft is already finalized",
      11: "Object.defineProperty() cannot be used on an Immer draft",
      12: "Object.setPrototypeOf() cannot be used on an Immer draft",
      13: "Immer only supports deleting array indices",
      14: "Immer only supports setting array indices and the 'length' property",
      15: function _(path) {
        return "Cannot apply patch, path doesn't resolve: " + path;
      },
      16: 'Sets cannot have "replace" patches.',
      17: function _(op) {
        return "Unsupported patch operation: " + op;
      },
      18: function _(plugin) {
        return "The plugin for '" + plugin + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + plugin + "()` when initializing your application.";
      },
      20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",
      21: function _(thing) {
        return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + thing + "'";
      },
      22: function _(thing) {
        return "'current' expects a draft, got: " + thing;
      },
      23: function _(thing) {
        return "'original' expects a draft, got: " + thing;
      },
      24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
    };
    function die(error) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      {
        var e = errors[error];
        var msg = !e ? "unknown error nr: " + error : typeof e === "function" ? e.apply(null, args) : e;
        throw new Error("[Immer] " + msg);
      }
    }
    function isDraft(value) {
      return !!value && !!value[DRAFT_STATE];
    }
    function isDraftable(value) {
      var _value$constructor;
      if (!value)
        return false;
      return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor[DRAFTABLE]) || isMap(value) || isSet(value);
    }
    var objectCtorString = Object.prototype.constructor.toString();
    function isPlainObject(value) {
      if (!value || typeof value !== "object")
        return false;
      var proto = Object.getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      var Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      if (Ctor === Object)
        return true;
      return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
    }
    function original(value) {
      if (!isDraft(value))
        die(23, value);
      return value[DRAFT_STATE].base_;
    }
    var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function(obj) {
      return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
    } : (
      /* istanbul ignore next */
      Object.getOwnPropertyNames
    );
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(target) {
      var res = {};
      ownKeys(target).forEach(function(key) {
        res[key] = Object.getOwnPropertyDescriptor(target, key);
      });
      return res;
    };
    function each(obj, iter, enumerableOnly) {
      if (enumerableOnly === void 0) {
        enumerableOnly = false;
      }
      if (getArchtype(obj) === 0) {
        (enumerableOnly ? Object.keys : ownKeys)(obj).forEach(function(key) {
          if (!enumerableOnly || typeof key !== "symbol")
            iter(key, obj[key], obj);
        });
      } else {
        obj.forEach(function(entry, index) {
          return iter(index, entry, obj);
        });
      }
    }
    function getArchtype(thing) {
      var state = thing[DRAFT_STATE];
      return state ? state.type_ > 3 ? state.type_ - 4 : state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
    }
    function has(thing, prop) {
      return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
    }
    function get(thing, prop) {
      return getArchtype(thing) === 2 ? thing.get(prop) : thing[prop];
    }
    function set(thing, propOrOldValue, value) {
      var t = getArchtype(thing);
      if (t === 2)
        thing.set(propOrOldValue, value);
      else if (t === 3) {
        thing.add(value);
      } else
        thing[propOrOldValue] = value;
    }
    function is(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }
    function isMap(target) {
      return hasMap && target instanceof Map;
    }
    function isSet(target) {
      return hasSet && target instanceof Set;
    }
    function latest(state) {
      return state.copy_ || state.base_;
    }
    function shallowCopy(base) {
      if (Array.isArray(base))
        return Array.prototype.slice.call(base);
      var descriptors = getOwnPropertyDescriptors(base);
      delete descriptors[DRAFT_STATE];
      var keys = ownKeys(descriptors);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var desc = descriptors[key];
        if (desc.writable === false) {
          desc.writable = true;
          desc.configurable = true;
        }
        if (desc.get || desc.set)
          descriptors[key] = {
            configurable: true,
            writable: true,
            enumerable: desc.enumerable,
            value: base[key]
          };
      }
      return Object.create(Object.getPrototypeOf(base), descriptors);
    }
    function freeze(obj, deep) {
      if (deep === void 0) {
        deep = false;
      }
      if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
        return obj;
      if (getArchtype(obj) > 1) {
        obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
      }
      Object.freeze(obj);
      if (deep)
        each(obj, function(key, value) {
          return freeze(value, true);
        }, true);
      return obj;
    }
    function dontMutateFrozenCollections() {
      die(2);
    }
    function isFrozen(obj) {
      if (obj == null || typeof obj !== "object")
        return true;
      return Object.isFrozen(obj);
    }
    var plugins = {};
    function getPlugin(pluginKey) {
      var plugin = plugins[pluginKey];
      if (!plugin) {
        die(18, pluginKey);
      }
      return plugin;
    }
    function loadPlugin(pluginKey, implementation) {
      if (!plugins[pluginKey])
        plugins[pluginKey] = implementation;
    }
    var currentScope;
    function getCurrentScope() {
      if (!currentScope)
        die(0);
      return currentScope;
    }
    function createScope(parent_, immer_) {
      return {
        drafts_: [],
        parent_,
        immer_,
        // Whenever the modified draft contains a draft from another scope, we
        // need to prevent auto-freezing so the unowned draft can be finalized.
        canAutoFreeze_: true,
        unfinalizedDrafts_: 0
      };
    }
    function usePatchesInScope(scope, patchListener) {
      if (patchListener) {
        getPlugin("Patches");
        scope.patches_ = [];
        scope.inversePatches_ = [];
        scope.patchListener_ = patchListener;
      }
    }
    function revokeScope(scope) {
      leaveScope(scope);
      scope.drafts_.forEach(revokeDraft);
      scope.drafts_ = null;
    }
    function leaveScope(scope) {
      if (scope === currentScope) {
        currentScope = scope.parent_;
      }
    }
    function enterScope(immer2) {
      return currentScope = createScope(currentScope, immer2);
    }
    function revokeDraft(draft) {
      var state = draft[DRAFT_STATE];
      if (state.type_ === 0 || state.type_ === 1)
        state.revoke_();
      else
        state.revoked_ = true;
    }
    function processResult(result, scope) {
      scope.unfinalizedDrafts_ = scope.drafts_.length;
      var baseDraft = scope.drafts_[0];
      var isReplaced = result !== void 0 && result !== baseDraft;
      if (!scope.immer_.useProxies_)
        getPlugin("ES5").willFinalizeES5_(scope, result, isReplaced);
      if (isReplaced) {
        if (baseDraft[DRAFT_STATE].modified_) {
          revokeScope(scope);
          die(4);
        }
        if (isDraftable(result)) {
          result = finalize(scope, result);
          if (!scope.parent_)
            maybeFreeze(scope, result);
        }
        if (scope.patches_) {
          getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope.patches_, scope.inversePatches_);
        }
      } else {
        result = finalize(scope, baseDraft, []);
      }
      revokeScope(scope);
      if (scope.patches_) {
        scope.patchListener_(scope.patches_, scope.inversePatches_);
      }
      return result !== NOTHING ? result : void 0;
    }
    function finalize(rootScope, value, path) {
      if (isFrozen(value))
        return value;
      var state = value[DRAFT_STATE];
      if (!state) {
        each(
          value,
          function(key, childValue) {
            return finalizeProperty(rootScope, state, value, key, childValue, path);
          },
          true
          // See #590, don't recurse into non-enumerable of non drafted objects
        );
        return value;
      }
      if (state.scope_ !== rootScope)
        return value;
      if (!state.modified_) {
        maybeFreeze(rootScope, state.base_, true);
        return state.base_;
      }
      if (!state.finalized_) {
        state.finalized_ = true;
        state.scope_.unfinalizedDrafts_--;
        var result = (
          // For ES5, create a good copy from the draft first, with added keys and without deleted keys.
          state.type_ === 4 || state.type_ === 5 ? state.copy_ = shallowCopy(state.draft_) : state.copy_
        );
        var resultEach = result;
        var isSet2 = false;
        if (state.type_ === 3) {
          resultEach = new Set(result);
          result.clear();
          isSet2 = true;
        }
        each(resultEach, function(key, childValue) {
          return finalizeProperty(rootScope, state, result, key, childValue, path, isSet2);
        });
        maybeFreeze(rootScope, result, false);
        if (path && rootScope.patches_) {
          getPlugin("Patches").generatePatches_(state, path, rootScope.patches_, rootScope.inversePatches_);
        }
      }
      return state.copy_;
    }
    function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
      if (childValue === targetObject)
        die(5);
      if (isDraft(childValue)) {
        var path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
        !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
        var res = finalize(rootScope, childValue, path);
        set(targetObject, prop, res);
        if (isDraft(res)) {
          rootScope.canAutoFreeze_ = false;
        } else
          return;
      } else if (targetIsSet) {
        targetObject.add(childValue);
      }
      if (isDraftable(childValue) && !isFrozen(childValue)) {
        if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
          return;
        }
        finalize(rootScope, childValue);
        if (!parentState || !parentState.scope_.parent_)
          maybeFreeze(rootScope, childValue);
      }
    }
    function maybeFreeze(scope, value, deep) {
      if (deep === void 0) {
        deep = false;
      }
      if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
        freeze(value, deep);
      }
    }
    function createProxyProxy(base, parent) {
      var isArray = Array.isArray(base);
      var state = {
        type_: isArray ? 1 : 0,
        // Track which produce call this is associated with.
        scope_: parent ? parent.scope_ : getCurrentScope(),
        // True for both shallow and deep changes.
        modified_: false,
        // Used during finalization.
        finalized_: false,
        // Track which properties have been assigned (true) or deleted (false).
        assigned_: {},
        // The parent draft state.
        parent_: parent,
        // The base state.
        base_: base,
        // The base proxy.
        draft_: null,
        // The base copy with any updated values.
        copy_: null,
        // Called by the `produce` function.
        revoke_: null,
        isManual_: false
      };
      var target = state;
      var traps = objectTraps;
      if (isArray) {
        target = [state];
        traps = arrayTraps;
      }
      var _Proxy$revocable = Proxy.revocable(target, traps), revoke = _Proxy$revocable.revoke, proxy = _Proxy$revocable.proxy;
      state.draft_ = proxy;
      state.revoke_ = revoke;
      return proxy;
    }
    var objectTraps = {
      get: function get2(state, prop) {
        if (prop === DRAFT_STATE)
          return state;
        var source = latest(state);
        if (!has(source, prop)) {
          return readPropFromProto(state, source, prop);
        }
        var value = source[prop];
        if (state.finalized_ || !isDraftable(value)) {
          return value;
        }
        if (value === peek(state.base_, prop)) {
          prepareCopy(state);
          return state.copy_[prop] = createProxy(state.scope_.immer_, value, state);
        }
        return value;
      },
      has: function has2(state, prop) {
        return prop in latest(state);
      },
      ownKeys: function ownKeys2(state) {
        return Reflect.ownKeys(latest(state));
      },
      set: function set2(state, prop, value) {
        var desc = getDescriptorFromProto(latest(state), prop);
        if (desc === null || desc === void 0 ? void 0 : desc.set) {
          desc.set.call(state.draft_, value);
          return true;
        }
        if (!state.modified_) {
          var current2 = peek(latest(state), prop);
          var currentState = current2 === null || current2 === void 0 ? void 0 : current2[DRAFT_STATE];
          if (currentState && currentState.base_ === value) {
            state.copy_[prop] = value;
            state.assigned_[prop] = false;
            return true;
          }
          if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
            return true;
          prepareCopy(state);
          markChanged(state);
        }
        if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
        (value !== void 0 || prop in state.copy_) || // special case: NaN
        Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
          return true;
        state.copy_[prop] = value;
        state.assigned_[prop] = true;
        return true;
      },
      deleteProperty: function deleteProperty(state, prop) {
        if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
          state.assigned_[prop] = false;
          prepareCopy(state);
          markChanged(state);
        } else {
          delete state.assigned_[prop];
        }
        if (state.copy_)
          delete state.copy_[prop];
        return true;
      },
      // Note: We never coerce `desc.value` into an Immer draft, because we can't make
      // the same guarantee in ES5 mode.
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(state, prop) {
        var owner = latest(state);
        var desc = Reflect.getOwnPropertyDescriptor(owner, prop);
        if (!desc)
          return desc;
        return {
          writable: true,
          configurable: state.type_ !== 1 || prop !== "length",
          enumerable: desc.enumerable,
          value: owner[prop]
        };
      },
      defineProperty: function defineProperty() {
        die(11);
      },
      getPrototypeOf: function getPrototypeOf(state) {
        return Object.getPrototypeOf(state.base_);
      },
      setPrototypeOf: function setPrototypeOf() {
        die(12);
      }
    };
    var arrayTraps = {};
    each(objectTraps, function(key, fn) {
      arrayTraps[key] = function() {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
      };
    });
    arrayTraps.deleteProperty = function(state, prop) {
      if (isNaN(parseInt(prop)))
        die(13);
      return arrayTraps.set.call(this, state, prop, void 0);
    };
    arrayTraps.set = function(state, prop, value) {
      if (prop !== "length" && isNaN(parseInt(prop)))
        die(14);
      return objectTraps.set.call(this, state[0], prop, value, state[0]);
    };
    function peek(draft, prop) {
      var state = draft[DRAFT_STATE];
      var source = state ? latest(state) : draft;
      return source[prop];
    }
    function readPropFromProto(state, source, prop) {
      var _desc$get;
      var desc = getDescriptorFromProto(source, prop);
      return desc ? "value" in desc ? desc.value : (
        // This is a very special case, if the prop is a getter defined by the
        // prototype, we should invoke it with the draft as context!
        (_desc$get = desc.get) === null || _desc$get === void 0 ? void 0 : _desc$get.call(state.draft_)
      ) : void 0;
    }
    function getDescriptorFromProto(source, prop) {
      if (!(prop in source))
        return void 0;
      var proto = Object.getPrototypeOf(source);
      while (proto) {
        var desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc)
          return desc;
        proto = Object.getPrototypeOf(proto);
      }
      return void 0;
    }
    function markChanged(state) {
      if (!state.modified_) {
        state.modified_ = true;
        if (state.parent_) {
          markChanged(state.parent_);
        }
      }
    }
    function prepareCopy(state) {
      if (!state.copy_) {
        state.copy_ = shallowCopy(state.base_);
      }
    }
    var Immer = function() {
      function Immer2(config) {
        var _this = this;
        this.useProxies_ = hasProxies;
        this.autoFreeze_ = true;
        this.produce = function(base, recipe, patchListener) {
          if (typeof base === "function" && typeof recipe !== "function") {
            var defaultBase = recipe;
            recipe = base;
            var self = _this;
            return function curriedProduce(base2) {
              var _this2 = this;
              if (base2 === void 0) {
                base2 = defaultBase;
              }
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              return self.produce(base2, function(draft) {
                var _recipe;
                return (_recipe = recipe).call.apply(_recipe, [_this2, draft].concat(args));
              });
            };
          }
          if (typeof recipe !== "function")
            die(6);
          if (patchListener !== void 0 && typeof patchListener !== "function")
            die(7);
          var result;
          if (isDraftable(base)) {
            var scope = enterScope(_this);
            var proxy = createProxy(_this, base, void 0);
            var hasError = true;
            try {
              result = recipe(proxy);
              hasError = false;
            } finally {
              if (hasError)
                revokeScope(scope);
              else
                leaveScope(scope);
            }
            if (typeof Promise !== "undefined" && result instanceof Promise) {
              return result.then(function(result2) {
                usePatchesInScope(scope, patchListener);
                return processResult(result2, scope);
              }, function(error) {
                revokeScope(scope);
                throw error;
              });
            }
            usePatchesInScope(scope, patchListener);
            return processResult(result, scope);
          } else if (!base || typeof base !== "object") {
            result = recipe(base);
            if (result === void 0)
              result = base;
            if (result === NOTHING)
              result = void 0;
            if (_this.autoFreeze_)
              freeze(result, true);
            if (patchListener) {
              var p = [];
              var ip = [];
              getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
              patchListener(p, ip);
            }
            return result;
          } else
            die(21, base);
        };
        this.produceWithPatches = function(base, recipe) {
          if (typeof base === "function") {
            return function(state) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              return _this.produceWithPatches(state, function(draft) {
                return base.apply(void 0, [draft].concat(args));
              });
            };
          }
          var patches, inversePatches;
          var result = _this.produce(base, recipe, function(p, ip) {
            patches = p;
            inversePatches = ip;
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then(function(nextState) {
              return [nextState, patches, inversePatches];
            });
          }
          return [result, patches, inversePatches];
        };
        if (typeof (config === null || config === void 0 ? void 0 : config.useProxies) === "boolean")
          this.setUseProxies(config.useProxies);
        if (typeof (config === null || config === void 0 ? void 0 : config.autoFreeze) === "boolean")
          this.setAutoFreeze(config.autoFreeze);
      }
      var _proto = Immer2.prototype;
      _proto.createDraft = function createDraft2(base) {
        if (!isDraftable(base))
          die(8);
        if (isDraft(base))
          base = current(base);
        var scope = enterScope(this);
        var proxy = createProxy(this, base, void 0);
        proxy[DRAFT_STATE].isManual_ = true;
        leaveScope(scope);
        return proxy;
      };
      _proto.finishDraft = function finishDraft2(draft, patchListener) {
        var state = draft && draft[DRAFT_STATE];
        {
          if (!state || !state.isManual_)
            die(9);
          if (state.finalized_)
            die(10);
        }
        var scope = state.scope_;
        usePatchesInScope(scope, patchListener);
        return processResult(void 0, scope);
      };
      _proto.setAutoFreeze = function setAutoFreeze2(value) {
        this.autoFreeze_ = value;
      };
      _proto.setUseProxies = function setUseProxies2(value) {
        if (value && !hasProxies) {
          die(20);
        }
        this.useProxies_ = value;
      };
      _proto.applyPatches = function applyPatches2(base, patches) {
        var i;
        for (i = patches.length - 1; i >= 0; i--) {
          var patch = patches[i];
          if (patch.path.length === 0 && patch.op === "replace") {
            base = patch.value;
            break;
          }
        }
        if (i > -1) {
          patches = patches.slice(i + 1);
        }
        var applyPatchesImpl = getPlugin("Patches").applyPatches_;
        if (isDraft(base)) {
          return applyPatchesImpl(base, patches);
        }
        return this.produce(base, function(draft) {
          return applyPatchesImpl(draft, patches);
        });
      };
      return Immer2;
    }();
    function createProxy(immer2, value, parent) {
      var draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : immer2.useProxies_ ? createProxyProxy(value, parent) : getPlugin("ES5").createES5Proxy_(value, parent);
      var scope = parent ? parent.scope_ : getCurrentScope();
      scope.drafts_.push(draft);
      return draft;
    }
    function current(value) {
      if (!isDraft(value))
        die(22, value);
      return currentImpl(value);
    }
    function currentImpl(value) {
      if (!isDraftable(value))
        return value;
      var state = value[DRAFT_STATE];
      var copy;
      var archType = getArchtype(value);
      if (state) {
        if (!state.modified_ && (state.type_ < 4 || !getPlugin("ES5").hasChanges_(state)))
          return state.base_;
        state.finalized_ = true;
        copy = copyHelper(value, archType);
        state.finalized_ = false;
      } else {
        copy = copyHelper(value, archType);
      }
      each(copy, function(key, childValue) {
        if (state && get(state.base_, key) === childValue)
          return;
        set(copy, key, currentImpl(childValue));
      });
      return archType === 3 ? new Set(copy) : copy;
    }
    function copyHelper(value, archType) {
      switch (archType) {
        case 2:
          return new Map(value);
        case 3:
          return Array.from(value);
      }
      return shallowCopy(value);
    }
    function enableES5() {
      function willFinalizeES5_(scope, result, isReplaced) {
        if (!isReplaced) {
          if (scope.patches_) {
            markChangesRecursively(scope.drafts_[0]);
          }
          markChangesSweep(scope.drafts_);
        } else if (isDraft(result) && result[DRAFT_STATE].scope_ === scope) {
          markChangesSweep(scope.drafts_);
        }
      }
      function createES5Draft(isArray, base) {
        if (isArray) {
          var draft = new Array(base.length);
          for (var i = 0; i < base.length; i++) {
            Object.defineProperty(draft, "" + i, proxyProperty(i, true));
          }
          return draft;
        } else {
          var _descriptors = getOwnPropertyDescriptors(base);
          delete _descriptors[DRAFT_STATE];
          var keys = ownKeys(_descriptors);
          for (var _i = 0; _i < keys.length; _i++) {
            var key = keys[_i];
            _descriptors[key] = proxyProperty(key, isArray || !!_descriptors[key].enumerable);
          }
          return Object.create(Object.getPrototypeOf(base), _descriptors);
        }
      }
      function createES5Proxy_(base, parent) {
        var isArray = Array.isArray(base);
        var draft = createES5Draft(isArray, base);
        var state = {
          type_: isArray ? 5 : 4,
          scope_: parent ? parent.scope_ : getCurrentScope(),
          modified_: false,
          finalized_: false,
          assigned_: {},
          parent_: parent,
          // base is the object we are drafting
          base_: base,
          // draft is the draft object itself, that traps all reads and reads from either the base (if unmodified) or copy (if modified)
          draft_: draft,
          copy_: null,
          revoked_: false,
          isManual_: false
        };
        Object.defineProperty(draft, DRAFT_STATE, {
          value: state,
          // enumerable: false <- the default
          writable: true
        });
        return draft;
      }
      var descriptors = {};
      function proxyProperty(prop, enumerable) {
        var desc = descriptors[prop];
        if (desc) {
          desc.enumerable = enumerable;
        } else {
          descriptors[prop] = desc = {
            configurable: true,
            enumerable,
            get: function get2() {
              var state = this[DRAFT_STATE];
              assertUnrevoked(state);
              return objectTraps.get(state, prop);
            },
            set: function set2(value) {
              var state = this[DRAFT_STATE];
              assertUnrevoked(state);
              objectTraps.set(state, prop, value);
            }
          };
        }
        return desc;
      }
      function markChangesSweep(drafts) {
        for (var i = drafts.length - 1; i >= 0; i--) {
          var state = drafts[i][DRAFT_STATE];
          if (!state.modified_) {
            switch (state.type_) {
              case 5:
                if (hasArrayChanges(state))
                  markChanged(state);
                break;
              case 4:
                if (hasObjectChanges(state))
                  markChanged(state);
                break;
            }
          }
        }
      }
      function markChangesRecursively(object) {
        if (!object || typeof object !== "object")
          return;
        var state = object[DRAFT_STATE];
        if (!state)
          return;
        var base_ = state.base_, draft_ = state.draft_, assigned_ = state.assigned_, type_ = state.type_;
        if (type_ === 4) {
          each(draft_, function(key) {
            if (key === DRAFT_STATE)
              return;
            if (base_[key] === void 0 && !has(base_, key)) {
              assigned_[key] = true;
              markChanged(state);
            } else if (!assigned_[key]) {
              markChangesRecursively(draft_[key]);
            }
          });
          each(base_, function(key) {
            if (draft_[key] === void 0 && !has(draft_, key)) {
              assigned_[key] = false;
              markChanged(state);
            }
          });
        } else if (type_ === 5) {
          if (hasArrayChanges(state)) {
            markChanged(state);
            assigned_.length = true;
          }
          if (draft_.length < base_.length) {
            for (var i = draft_.length; i < base_.length; i++) {
              assigned_[i] = false;
            }
          } else {
            for (var _i2 = base_.length; _i2 < draft_.length; _i2++) {
              assigned_[_i2] = true;
            }
          }
          var min = Math.min(draft_.length, base_.length);
          for (var _i3 = 0; _i3 < min; _i3++) {
            if (!draft_.hasOwnProperty(_i3)) {
              assigned_[_i3] = true;
            }
            if (assigned_[_i3] === void 0)
              markChangesRecursively(draft_[_i3]);
          }
        }
      }
      function hasObjectChanges(state) {
        var base_ = state.base_, draft_ = state.draft_;
        var keys = ownKeys(draft_);
        for (var i = keys.length - 1; i >= 0; i--) {
          var key = keys[i];
          if (key === DRAFT_STATE)
            continue;
          var baseValue = base_[key];
          if (baseValue === void 0 && !has(base_, key)) {
            return true;
          } else {
            var value = draft_[key];
            var _state = value && value[DRAFT_STATE];
            if (_state ? _state.base_ !== baseValue : !is(value, baseValue)) {
              return true;
            }
          }
        }
        var baseIsDraft = !!base_[DRAFT_STATE];
        return keys.length !== ownKeys(base_).length + (baseIsDraft ? 0 : 1);
      }
      function hasArrayChanges(state) {
        var draft_ = state.draft_;
        if (draft_.length !== state.base_.length)
          return true;
        var descriptor = Object.getOwnPropertyDescriptor(draft_, draft_.length - 1);
        if (descriptor && !descriptor.get)
          return true;
        for (var i = 0; i < draft_.length; i++) {
          if (!draft_.hasOwnProperty(i))
            return true;
        }
        return false;
      }
      function hasChanges_(state) {
        return state.type_ === 4 ? hasObjectChanges(state) : hasArrayChanges(state);
      }
      function assertUnrevoked(state) {
        if (state.revoked_)
          die(3, JSON.stringify(latest(state)));
      }
      loadPlugin("ES5", {
        createES5Proxy_,
        willFinalizeES5_,
        hasChanges_
      });
    }
    function enablePatches() {
      var REPLACE = "replace";
      var ADD = "add";
      var REMOVE = "remove";
      function generatePatches_(state, basePath, patches, inversePatches) {
        switch (state.type_) {
          case 0:
          case 4:
          case 2:
            return generatePatchesFromAssigned(state, basePath, patches, inversePatches);
          case 5:
          case 1:
            return generateArrayPatches(state, basePath, patches, inversePatches);
          case 3:
            return generateSetPatches(state, basePath, patches, inversePatches);
        }
      }
      function generateArrayPatches(state, basePath, patches, inversePatches) {
        var base_ = state.base_, assigned_ = state.assigned_;
        var copy_ = state.copy_;
        if (copy_.length < base_.length) {
          var _ref2 = [copy_, base_];
          base_ = _ref2[0];
          copy_ = _ref2[1];
          var _ref22 = [inversePatches, patches];
          patches = _ref22[0];
          inversePatches = _ref22[1];
        }
        for (var i = 0; i < base_.length; i++) {
          if (assigned_[i] && copy_[i] !== base_[i]) {
            var path = basePath.concat([i]);
            patches.push({
              op: REPLACE,
              path,
              // Need to maybe clone it, as it can in fact be the original value
              // due to the base/copy inversion at the start of this function
              value: clonePatchValueIfNeeded(copy_[i])
            });
            inversePatches.push({
              op: REPLACE,
              path,
              value: clonePatchValueIfNeeded(base_[i])
            });
          }
        }
        for (var _i = base_.length; _i < copy_.length; _i++) {
          var _path = basePath.concat([_i]);
          patches.push({
            op: ADD,
            path: _path,
            // Need to maybe clone it, as it can in fact be the original value
            // due to the base/copy inversion at the start of this function
            value: clonePatchValueIfNeeded(copy_[_i])
          });
        }
        if (base_.length < copy_.length) {
          inversePatches.push({
            op: REPLACE,
            path: basePath.concat(["length"]),
            value: base_.length
          });
        }
      }
      function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
        var base_ = state.base_, copy_ = state.copy_;
        each(state.assigned_, function(key, assignedValue) {
          var origValue = get(base_, key);
          var value = get(copy_, key);
          var op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD;
          if (origValue === value && op === REPLACE)
            return;
          var path = basePath.concat(key);
          patches.push(op === REMOVE ? {
            op,
            path
          } : {
            op,
            path,
            value
          });
          inversePatches.push(op === ADD ? {
            op: REMOVE,
            path
          } : op === REMOVE ? {
            op: ADD,
            path,
            value: clonePatchValueIfNeeded(origValue)
          } : {
            op: REPLACE,
            path,
            value: clonePatchValueIfNeeded(origValue)
          });
        });
      }
      function generateSetPatches(state, basePath, patches, inversePatches) {
        var base_ = state.base_, copy_ = state.copy_;
        var i = 0;
        base_.forEach(function(value) {
          if (!copy_.has(value)) {
            var path = basePath.concat([i]);
            patches.push({
              op: REMOVE,
              path,
              value
            });
            inversePatches.unshift({
              op: ADD,
              path,
              value
            });
          }
          i++;
        });
        i = 0;
        copy_.forEach(function(value) {
          if (!base_.has(value)) {
            var path = basePath.concat([i]);
            patches.push({
              op: ADD,
              path,
              value
            });
            inversePatches.unshift({
              op: REMOVE,
              path,
              value
            });
          }
          i++;
        });
      }
      function generateReplacementPatches_(baseValue, replacement, patches, inversePatches) {
        patches.push({
          op: REPLACE,
          path: [],
          value: replacement === NOTHING ? void 0 : replacement
        });
        inversePatches.push({
          op: REPLACE,
          path: [],
          value: baseValue
        });
      }
      function applyPatches_(draft, patches) {
        patches.forEach(function(patch) {
          var path = patch.path, op = patch.op;
          var base = draft;
          for (var i = 0; i < path.length - 1; i++) {
            var parentType = getArchtype(base);
            var p = path[i];
            if (typeof p !== "string" && typeof p !== "number") {
              p = "" + p;
            }
            if ((parentType === 0 || parentType === 1) && (p === "__proto__" || p === "constructor"))
              die(24);
            if (typeof base === "function" && p === "prototype")
              die(24);
            base = get(base, p);
            if (typeof base !== "object")
              die(15, path.join("/"));
          }
          var type = getArchtype(base);
          var value = deepClonePatchValue(patch.value);
          var key = path[path.length - 1];
          switch (op) {
            case REPLACE:
              switch (type) {
                case 2:
                  return base.set(key, value);
                case 3:
                  die(16);
                default:
                  return base[key] = value;
              }
            case ADD:
              switch (type) {
                case 1:
                  return key === "-" ? base.push(value) : base.splice(key, 0, value);
                case 2:
                  return base.set(key, value);
                case 3:
                  return base.add(value);
                default:
                  return base[key] = value;
              }
            case REMOVE:
              switch (type) {
                case 1:
                  return base.splice(key, 1);
                case 2:
                  return base.delete(key);
                case 3:
                  return base.delete(patch.value);
                default:
                  return delete base[key];
              }
            default:
              die(17, op);
          }
        });
        return draft;
      }
      function deepClonePatchValue(obj) {
        if (!isDraftable(obj))
          return obj;
        if (Array.isArray(obj))
          return obj.map(deepClonePatchValue);
        if (isMap(obj))
          return new Map(Array.from(obj.entries()).map(function(_ref3) {
            var k = _ref3[0], v = _ref3[1];
            return [k, deepClonePatchValue(v)];
          }));
        if (isSet(obj))
          return new Set(Array.from(obj).map(deepClonePatchValue));
        var cloned = Object.create(Object.getPrototypeOf(obj));
        for (var key in obj) {
          cloned[key] = deepClonePatchValue(obj[key]);
        }
        if (has(obj, DRAFTABLE))
          cloned[DRAFTABLE] = obj[DRAFTABLE];
        return cloned;
      }
      function clonePatchValueIfNeeded(obj) {
        if (isDraft(obj)) {
          return deepClonePatchValue(obj);
        } else
          return obj;
      }
      loadPlugin("Patches", {
        applyPatches_,
        generatePatches_,
        generateReplacementPatches_
      });
    }
    function enableMapSet() {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) {
            if (b2.hasOwnProperty(p))
              d2[p] = b2[p];
          }
        };
        return _extendStatics(d, b);
      };
      function __extends(d, b) {
        _extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = // @ts-ignore
        (__.prototype = b.prototype, new __());
      }
      var DraftMap = function(_super) {
        __extends(DraftMap2, _super);
        function DraftMap2(target, parent) {
          this[DRAFT_STATE] = {
            type_: 2,
            parent_: parent,
            scope_: parent ? parent.scope_ : getCurrentScope(),
            modified_: false,
            finalized_: false,
            copy_: void 0,
            assigned_: void 0,
            base_: target,
            draft_: this,
            isManual_: false,
            revoked_: false
          };
          return this;
        }
        var p = DraftMap2.prototype;
        Object.defineProperty(p, "size", {
          get: function get2() {
            return latest(this[DRAFT_STATE]).size;
          }
          // enumerable: false,
          // configurable: true
        });
        p.has = function(key) {
          return latest(this[DRAFT_STATE]).has(key);
        };
        p.set = function(key, value) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (!latest(state).has(key) || latest(state).get(key) !== value) {
            prepareMapCopy(state);
            markChanged(state);
            state.assigned_.set(key, true);
            state.copy_.set(key, value);
            state.assigned_.set(key, true);
          }
          return this;
        };
        p.delete = function(key) {
          if (!this.has(key)) {
            return false;
          }
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareMapCopy(state);
          markChanged(state);
          if (state.base_.has(key)) {
            state.assigned_.set(key, false);
          } else {
            state.assigned_.delete(key);
          }
          state.copy_.delete(key);
          return true;
        };
        p.clear = function() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (latest(state).size) {
            prepareMapCopy(state);
            markChanged(state);
            state.assigned_ = /* @__PURE__ */ new Map();
            each(state.base_, function(key) {
              state.assigned_.set(key, false);
            });
            state.copy_.clear();
          }
        };
        p.forEach = function(cb, thisArg) {
          var _this = this;
          var state = this[DRAFT_STATE];
          latest(state).forEach(function(_value, key, _map) {
            cb.call(thisArg, _this.get(key), key, _this);
          });
        };
        p.get = function(key) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          var value = latest(state).get(key);
          if (state.finalized_ || !isDraftable(value)) {
            return value;
          }
          if (value !== state.base_.get(key)) {
            return value;
          }
          var draft = createProxy(state.scope_.immer_, value, state);
          prepareMapCopy(state);
          state.copy_.set(key, draft);
          return draft;
        };
        p.keys = function() {
          return latest(this[DRAFT_STATE]).keys();
        };
        p.values = function() {
          var _this2 = this, _ref2;
          var iterator = this.keys();
          return _ref2 = {}, _ref2[iteratorSymbol] = function() {
            return _this2.values();
          }, _ref2.next = function next() {
            var r = iterator.next();
            if (r.done)
              return r;
            var value = _this2.get(r.value);
            return {
              done: false,
              value
            };
          }, _ref2;
        };
        p.entries = function() {
          var _this3 = this, _ref2;
          var iterator = this.keys();
          return _ref2 = {}, _ref2[iteratorSymbol] = function() {
            return _this3.entries();
          }, _ref2.next = function next() {
            var r = iterator.next();
            if (r.done)
              return r;
            var value = _this3.get(r.value);
            return {
              done: false,
              value: [r.value, value]
            };
          }, _ref2;
        };
        p[iteratorSymbol] = function() {
          return this.entries();
        };
        return DraftMap2;
      }(Map);
      function proxyMap_(target, parent) {
        return new DraftMap(target, parent);
      }
      function prepareMapCopy(state) {
        if (!state.copy_) {
          state.assigned_ = /* @__PURE__ */ new Map();
          state.copy_ = new Map(state.base_);
        }
      }
      var DraftSet = function(_super) {
        __extends(DraftSet2, _super);
        function DraftSet2(target, parent) {
          this[DRAFT_STATE] = {
            type_: 3,
            parent_: parent,
            scope_: parent ? parent.scope_ : getCurrentScope(),
            modified_: false,
            finalized_: false,
            copy_: void 0,
            base_: target,
            draft_: this,
            drafts_: /* @__PURE__ */ new Map(),
            revoked_: false,
            isManual_: false
          };
          return this;
        }
        var p = DraftSet2.prototype;
        Object.defineProperty(p, "size", {
          get: function get2() {
            return latest(this[DRAFT_STATE]).size;
          }
          // enumerable: true,
        });
        p.has = function(value) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (!state.copy_) {
            return state.base_.has(value);
          }
          if (state.copy_.has(value))
            return true;
          if (state.drafts_.has(value) && state.copy_.has(state.drafts_.get(value)))
            return true;
          return false;
        };
        p.add = function(value) {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (!this.has(value)) {
            prepareSetCopy(state);
            markChanged(state);
            state.copy_.add(value);
          }
          return this;
        };
        p.delete = function(value) {
          if (!this.has(value)) {
            return false;
          }
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareSetCopy(state);
          markChanged(state);
          return state.copy_.delete(value) || (state.drafts_.has(value) ? state.copy_.delete(state.drafts_.get(value)) : (
            /* istanbul ignore next */
            false
          ));
        };
        p.clear = function() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          if (latest(state).size) {
            prepareSetCopy(state);
            markChanged(state);
            state.copy_.clear();
          }
        };
        p.values = function() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareSetCopy(state);
          return state.copy_.values();
        };
        p.entries = function entries() {
          var state = this[DRAFT_STATE];
          assertUnrevoked(state);
          prepareSetCopy(state);
          return state.copy_.entries();
        };
        p.keys = function() {
          return this.values();
        };
        p[iteratorSymbol] = function() {
          return this.values();
        };
        p.forEach = function forEach(cb, thisArg) {
          var iterator = this.values();
          var result = iterator.next();
          while (!result.done) {
            cb.call(thisArg, result.value, result.value, this);
            result = iterator.next();
          }
        };
        return DraftSet2;
      }(Set);
      function proxySet_(target, parent) {
        return new DraftSet(target, parent);
      }
      function prepareSetCopy(state) {
        if (!state.copy_) {
          state.copy_ = /* @__PURE__ */ new Set();
          state.base_.forEach(function(value) {
            if (isDraftable(value)) {
              var draft = createProxy(state.scope_.immer_, value, state);
              state.drafts_.set(value, draft);
              state.copy_.add(draft);
            } else {
              state.copy_.add(value);
            }
          });
        }
      }
      function assertUnrevoked(state) {
        if (state.revoked_)
          die(3, JSON.stringify(latest(state)));
      }
      loadPlugin("MapSet", {
        proxyMap_,
        proxySet_
      });
    }
    function enableAllPlugins() {
      enableES5();
      enableMapSet();
      enablePatches();
    }
    var immer = new Immer();
    var produce = immer.produce;
    var produceWithPatches = immer.produceWithPatches.bind(immer);
    var setAutoFreeze = immer.setAutoFreeze.bind(immer);
    var setUseProxies = immer.setUseProxies.bind(immer);
    var applyPatches = immer.applyPatches.bind(immer);
    var createDraft = immer.createDraft.bind(immer);
    var finishDraft = immer.finishDraft.bind(immer);
    function castDraft(value) {
      return value;
    }
    function castImmutable(value) {
      return value;
    }
    exports.Immer = Immer;
    exports.applyPatches = applyPatches;
    exports.castDraft = castDraft;
    exports.castImmutable = castImmutable;
    exports.createDraft = createDraft;
    exports.current = current;
    exports.default = produce;
    exports.enableAllPlugins = enableAllPlugins;
    exports.enableES5 = enableES5;
    exports.enableMapSet = enableMapSet;
    exports.enablePatches = enablePatches;
    exports.finishDraft = finishDraft;
    exports.freeze = freeze;
    exports.immerable = DRAFTABLE;
    exports.isDraft = isDraft;
    exports.isDraftable = isDraftable;
    exports.nothing = NOTHING;
    exports.original = original;
    exports.produce = produce;
    exports.produceWithPatches = produceWithPatches;
    exports.setAutoFreeze = setAutoFreeze;
    exports.setUseProxies = setUseProxies;
  }
});

// node_modules/immer/dist/index.js
var require_dist = __commonJS({
  "node_modules/immer/dist/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_immer_cjs_development();
    }
  }
});

// node_modules/@reduxjs/toolkit/dist/query/rtk-query.cjs.development.js
var require_rtk_query_cjs_development = __commonJS({
  "node_modules/@reduxjs/toolkit/dist/query/rtk-query.cjs.development.js"(exports) {
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
      return to;
    };
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = function(obj, key, value) {
      return key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    };
    var __spreadValues = function(a, b) {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var _j = 0, _k = __getOwnPropSymbols(b); _j < _k.length; _j++) {
          var prop = _k[_j];
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps = function(a, b) {
      return __defProps(a, __getOwnPropDescs(b));
    };
    var __markAsModule = function(target) {
      return __defProp(target, "__esModule", { value: true });
    };
    var __objRest = function(source, exclude) {
      var target = {};
      for (var prop in source)
        if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
          target[prop] = source[prop];
      if (source != null && __getOwnPropSymbols)
        for (var _j = 0, _k = __getOwnPropSymbols(source); _j < _k.length; _j++) {
          var prop = _k[_j];
          if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
            target[prop] = source[prop];
        }
      return target;
    };
    var __export = function(target, all) {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = function(target, module2, desc) {
      if (module2 && typeof module2 === "object" || typeof module2 === "function") {
        var _loop_1 = function(key2) {
          if (!__hasOwnProp.call(target, key2) && key2 !== "default")
            __defProp(target, key2, { get: function() {
              return module2[key2];
            }, enumerable: !(desc = __getOwnPropDesc(module2, key2)) || desc.enumerable });
        };
        for (var _j = 0, _k = __getOwnPropNames(module2); _j < _k.length; _j++) {
          var key = _k[_j];
          _loop_1(key);
        }
      }
      return target;
    };
    var __toModule = function(module2) {
      return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: function() {
        return module2.default;
      }, enumerable: true } : { value: module2, enumerable: true })), module2);
    };
    var __async = function(__this, __arguments, generator) {
      return new Promise(function(resolve, reject) {
        var fulfilled = function(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = function(value) {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = function(x) {
          return x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        };
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    __markAsModule(exports);
    __export(exports, {
      QueryStatus: function() {
        return QueryStatus;
      },
      buildCreateApi: function() {
        return buildCreateApi;
      },
      copyWithStructuralSharing: function() {
        return copyWithStructuralSharing;
      },
      coreModule: function() {
        return coreModule;
      },
      coreModuleName: function() {
        return coreModuleName;
      },
      createApi: function() {
        return createApi;
      },
      defaultSerializeQueryArgs: function() {
        return defaultSerializeQueryArgs;
      },
      fakeBaseQuery: function() {
        return fakeBaseQuery;
      },
      fetchBaseQuery: function() {
        return fetchBaseQuery;
      },
      retry: function() {
        return retry;
      },
      setupListeners: function() {
        return setupListeners;
      },
      skipSelector: function() {
        return skipSelector;
      },
      skipToken: function() {
        return skipToken;
      }
    });
    var QueryStatus;
    (function(QueryStatus2) {
      QueryStatus2["uninitialized"] = "uninitialized";
      QueryStatus2["pending"] = "pending";
      QueryStatus2["fulfilled"] = "fulfilled";
      QueryStatus2["rejected"] = "rejected";
    })(QueryStatus || (QueryStatus = {}));
    function getRequestStatusFlags(status) {
      return {
        status,
        isUninitialized: status === QueryStatus.uninitialized,
        isLoading: status === QueryStatus.pending,
        isSuccess: status === QueryStatus.fulfilled,
        isError: status === QueryStatus.rejected
      };
    }
    function isAbsoluteUrl(url) {
      return new RegExp("(^|:)//").test(url);
    }
    var withoutTrailingSlash = function(url) {
      return url.replace(/\/$/, "");
    };
    var withoutLeadingSlash = function(url) {
      return url.replace(/^\//, "");
    };
    function joinUrls(base, url) {
      if (!base) {
        return url;
      }
      if (!url) {
        return base;
      }
      if (isAbsoluteUrl(url)) {
        return url;
      }
      var delimiter = base.endsWith("/") || !url.startsWith("?") ? "/" : "";
      base = withoutTrailingSlash(base);
      url = withoutLeadingSlash(url);
      return "" + base + delimiter + url;
    }
    var flatten = function(arr) {
      return [].concat.apply([], arr);
    };
    function isOnline() {
      return typeof navigator === "undefined" ? true : navigator.onLine === void 0 ? true : navigator.onLine;
    }
    function isDocumentVisible() {
      if (typeof document === "undefined") {
        return true;
      }
      return document.visibilityState !== "hidden";
    }
    var import_toolkit = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var isPlainObject = import_toolkit.isPlainObject;
    function copyWithStructuralSharing(oldObj, newObj) {
      if (oldObj === newObj || !(isPlainObject(oldObj) && isPlainObject(newObj) || Array.isArray(oldObj) && Array.isArray(newObj))) {
        return newObj;
      }
      var newKeys = Object.keys(newObj);
      var oldKeys = Object.keys(oldObj);
      var isSameObject = newKeys.length === oldKeys.length;
      var mergeObj = Array.isArray(newObj) ? [] : {};
      for (var _j = 0, newKeys_1 = newKeys; _j < newKeys_1.length; _j++) {
        var key = newKeys_1[_j];
        mergeObj[key] = copyWithStructuralSharing(oldObj[key], newObj[key]);
        if (isSameObject)
          isSameObject = oldObj[key] === mergeObj[key];
      }
      return isSameObject ? oldObj : mergeObj;
    }
    var import_toolkit2 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var defaultFetchFn = function() {
      var args = [];
      for (var _j = 0; _j < arguments.length; _j++) {
        args[_j] = arguments[_j];
      }
      return fetch.apply(void 0, args);
    };
    var defaultValidateStatus = function(response) {
      return response.status >= 200 && response.status <= 299;
    };
    var defaultIsJsonContentType = function(headers) {
      return /ion\/(vnd\.api\+)?json/.test(headers.get("content-type") || "");
    };
    function stripUndefined(obj) {
      if (!(0, import_toolkit2.isPlainObject)(obj)) {
        return obj;
      }
      var copy = __spreadValues({}, obj);
      for (var _j = 0, _k = Object.entries(copy); _j < _k.length; _j++) {
        var _l = _k[_j], k = _l[0], v = _l[1];
        if (v === void 0)
          delete copy[k];
      }
      return copy;
    }
    function fetchBaseQuery(_a) {
      var _this = this;
      if (_a === void 0) {
        _a = {};
      }
      var _b = _a, baseUrl = _b.baseUrl, _j = _b.prepareHeaders, prepareHeaders = _j === void 0 ? function(x) {
        return x;
      } : _j, _k = _b.fetchFn, fetchFn = _k === void 0 ? defaultFetchFn : _k, paramsSerializer = _b.paramsSerializer, _l = _b.isJsonContentType, isJsonContentType = _l === void 0 ? defaultIsJsonContentType : _l, _m = _b.jsonContentType, jsonContentType = _m === void 0 ? "application/json" : _m, jsonReplacer = _b.jsonReplacer, defaultTimeout = _b.timeout, globalResponseHandler = _b.responseHandler, globalValidateStatus = _b.validateStatus, baseFetchOptions = __objRest(_b, [
        "baseUrl",
        "prepareHeaders",
        "fetchFn",
        "paramsSerializer",
        "isJsonContentType",
        "jsonContentType",
        "jsonReplacer",
        "timeout",
        "responseHandler",
        "validateStatus"
      ]);
      if (typeof fetch === "undefined" && fetchFn === defaultFetchFn) {
        console.warn("Warning: `fetch` is not available. Please supply a custom `fetchFn` property to use `fetchBaseQuery` on SSR environments.");
      }
      return function(arg, api) {
        return __async(_this, null, function() {
          var signal, getState, extra, endpoint, forced, type, meta, _a2, url, _j2, headers, _k2, params, _l2, responseHandler, _m2, validateStatus, _o, timeout, rest, config, _p, isJsonifiable, divider, query, request, requestClone, response, timedOut, timeoutId, e_1, responseClone, resultData, responseText, handleResponseError_1, e_2;
          return __generator(this, function(_q) {
            switch (_q.label) {
              case 0:
                signal = api.signal, getState = api.getState, extra = api.extra, endpoint = api.endpoint, forced = api.forced, type = api.type;
                _a2 = typeof arg == "string" ? { url: arg } : arg, url = _a2.url, _j2 = _a2.headers, headers = _j2 === void 0 ? new Headers(baseFetchOptions.headers) : _j2, _k2 = _a2.params, params = _k2 === void 0 ? void 0 : _k2, _l2 = _a2.responseHandler, responseHandler = _l2 === void 0 ? globalResponseHandler != null ? globalResponseHandler : "json" : _l2, _m2 = _a2.validateStatus, validateStatus = _m2 === void 0 ? globalValidateStatus != null ? globalValidateStatus : defaultValidateStatus : _m2, _o = _a2.timeout, timeout = _o === void 0 ? defaultTimeout : _o, rest = __objRest(_a2, [
                  "url",
                  "headers",
                  "params",
                  "responseHandler",
                  "validateStatus",
                  "timeout"
                ]);
                config = __spreadValues(__spreadProps(__spreadValues({}, baseFetchOptions), {
                  signal
                }), rest);
                headers = new Headers(stripUndefined(headers));
                _p = config;
                return [4, prepareHeaders(headers, {
                  getState,
                  extra,
                  endpoint,
                  forced,
                  type
                })];
              case 1:
                _p.headers = _q.sent() || headers;
                isJsonifiable = function(body) {
                  return typeof body === "object" && ((0, import_toolkit2.isPlainObject)(body) || Array.isArray(body) || typeof body.toJSON === "function");
                };
                if (!config.headers.has("content-type") && isJsonifiable(config.body)) {
                  config.headers.set("content-type", jsonContentType);
                }
                if (isJsonifiable(config.body) && isJsonContentType(config.headers)) {
                  config.body = JSON.stringify(config.body, jsonReplacer);
                }
                if (params) {
                  divider = ~url.indexOf("?") ? "&" : "?";
                  query = paramsSerializer ? paramsSerializer(params) : new URLSearchParams(stripUndefined(params));
                  url += divider + query;
                }
                url = joinUrls(baseUrl, url);
                request = new Request(url, config);
                requestClone = new Request(url, config);
                meta = { request: requestClone };
                timedOut = false, timeoutId = timeout && setTimeout(function() {
                  timedOut = true;
                  api.abort();
                }, timeout);
                _q.label = 2;
              case 2:
                _q.trys.push([2, 4, 5, 6]);
                return [4, fetchFn(request)];
              case 3:
                response = _q.sent();
                return [3, 6];
              case 4:
                e_1 = _q.sent();
                return [2, {
                  error: {
                    status: timedOut ? "TIMEOUT_ERROR" : "FETCH_ERROR",
                    error: String(e_1)
                  },
                  meta
                }];
              case 5:
                if (timeoutId)
                  clearTimeout(timeoutId);
                return [
                  7
                  /*endfinally*/
                ];
              case 6:
                responseClone = response.clone();
                meta.response = responseClone;
                responseText = "";
                _q.label = 7;
              case 7:
                _q.trys.push([7, 9, , 10]);
                return [4, Promise.all([
                  handleResponse(response, responseHandler).then(function(r) {
                    return resultData = r;
                  }, function(e) {
                    return handleResponseError_1 = e;
                  }),
                  responseClone.text().then(function(r) {
                    return responseText = r;
                  }, function() {
                  })
                ])];
              case 8:
                _q.sent();
                if (handleResponseError_1)
                  throw handleResponseError_1;
                return [3, 10];
              case 9:
                e_2 = _q.sent();
                return [2, {
                  error: {
                    status: "PARSING_ERROR",
                    originalStatus: response.status,
                    data: responseText,
                    error: String(e_2)
                  },
                  meta
                }];
              case 10:
                return [2, validateStatus(response, resultData) ? {
                  data: resultData,
                  meta
                } : {
                  error: {
                    status: response.status,
                    data: resultData
                  },
                  meta
                }];
            }
          });
        });
      };
      function handleResponse(response, responseHandler) {
        return __async(this, null, function() {
          var text;
          return __generator(this, function(_j2) {
            switch (_j2.label) {
              case 0:
                if (typeof responseHandler === "function") {
                  return [2, responseHandler(response)];
                }
                if (responseHandler === "content-type") {
                  responseHandler = isJsonContentType(response.headers) ? "json" : "text";
                }
                if (!(responseHandler === "json"))
                  return [3, 2];
                return [4, response.text()];
              case 1:
                text = _j2.sent();
                return [2, text.length ? JSON.parse(text) : null];
              case 2:
                return [2, response.text()];
            }
          });
        });
      }
    }
    var HandledError = (
      /** @class */
      function() {
        function HandledError2(value, meta) {
          if (meta === void 0) {
            meta = void 0;
          }
          this.value = value;
          this.meta = meta;
        }
        return HandledError2;
      }()
    );
    function defaultBackoff(attempt, maxRetries) {
      if (attempt === void 0) {
        attempt = 0;
      }
      if (maxRetries === void 0) {
        maxRetries = 5;
      }
      return __async(this, null, function() {
        var attempts, timeout;
        return __generator(this, function(_j) {
          switch (_j.label) {
            case 0:
              attempts = Math.min(attempt, maxRetries);
              timeout = ~~((Math.random() + 0.4) * (300 << attempts));
              return [4, new Promise(function(resolve) {
                return setTimeout(function(res) {
                  return resolve(res);
                }, timeout);
              })];
            case 1:
              _j.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function fail(e) {
      throw Object.assign(new HandledError({ error: e }), {
        throwImmediately: true
      });
    }
    var EMPTY_OPTIONS = {};
    var retryWithBackoff = function(baseQuery, defaultOptions) {
      return function(args, api, extraOptions) {
        return __async(void 0, null, function() {
          var possibleMaxRetries, maxRetries, defaultRetryCondition, options, retry2, result, e_3;
          return __generator(this, function(_j) {
            switch (_j.label) {
              case 0:
                possibleMaxRetries = [
                  5,
                  (defaultOptions || EMPTY_OPTIONS).maxRetries,
                  (extraOptions || EMPTY_OPTIONS).maxRetries
                ].filter(function(x) {
                  return x !== void 0;
                });
                maxRetries = possibleMaxRetries.slice(-1)[0];
                defaultRetryCondition = function(_, __, _j2) {
                  var attempt = _j2.attempt;
                  return attempt <= maxRetries;
                };
                options = __spreadValues(__spreadValues({
                  maxRetries,
                  backoff: defaultBackoff,
                  retryCondition: defaultRetryCondition
                }, defaultOptions), extraOptions);
                retry2 = 0;
                _j.label = 1;
              case 1:
                if (false)
                  return [3, 7];
                _j.label = 2;
              case 2:
                _j.trys.push([2, 4, , 6]);
                return [4, baseQuery(args, api, extraOptions)];
              case 3:
                result = _j.sent();
                if (result.error) {
                  throw new HandledError(result);
                }
                return [2, result];
              case 4:
                e_3 = _j.sent();
                retry2++;
                if (e_3.throwImmediately) {
                  if (e_3 instanceof HandledError) {
                    return [2, e_3.value];
                  }
                  throw e_3;
                }
                if (e_3 instanceof HandledError && !options.retryCondition(e_3.value.error, args, {
                  attempt: retry2,
                  baseQueryApi: api,
                  extraOptions
                })) {
                  return [2, e_3.value];
                }
                return [4, options.backoff(retry2, options.maxRetries)];
              case 5:
                _j.sent();
                return [3, 6];
              case 6:
                return [3, 1];
              case 7:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
    };
    var retry = Object.assign(retryWithBackoff, { fail });
    var import_toolkit3 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var onFocus = (0, import_toolkit3.createAction)("__rtkq/focused");
    var onFocusLost = (0, import_toolkit3.createAction)("__rtkq/unfocused");
    var onOnline = (0, import_toolkit3.createAction)("__rtkq/online");
    var onOffline = (0, import_toolkit3.createAction)("__rtkq/offline");
    var initialized = false;
    function setupListeners(dispatch, customHandler) {
      function defaultHandler() {
        var handleFocus = function() {
          return dispatch(onFocus());
        };
        var handleFocusLost = function() {
          return dispatch(onFocusLost());
        };
        var handleOnline = function() {
          return dispatch(onOnline());
        };
        var handleOffline = function() {
          return dispatch(onOffline());
        };
        var handleVisibilityChange = function() {
          if (window.document.visibilityState === "visible") {
            handleFocus();
          } else {
            handleFocusLost();
          }
        };
        if (!initialized) {
          if (typeof window !== "undefined" && window.addEventListener) {
            window.addEventListener("visibilitychange", handleVisibilityChange, false);
            window.addEventListener("focus", handleFocus, false);
            window.addEventListener("online", handleOnline, false);
            window.addEventListener("offline", handleOffline, false);
            initialized = true;
          }
        }
        var unsubscribe = function() {
          window.removeEventListener("focus", handleFocus);
          window.removeEventListener("visibilitychange", handleVisibilityChange);
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
          initialized = false;
        };
        return unsubscribe;
      }
      return customHandler ? customHandler(dispatch, { onFocus, onFocusLost, onOffline, onOnline }) : defaultHandler();
    }
    var import_toolkit7 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var DefinitionType;
    (function(DefinitionType2) {
      DefinitionType2["query"] = "query";
      DefinitionType2["mutation"] = "mutation";
    })(DefinitionType || (DefinitionType = {}));
    function isQueryDefinition(e) {
      return e.type === DefinitionType.query;
    }
    function isMutationDefinition(e) {
      return e.type === DefinitionType.mutation;
    }
    function calculateProvidedBy(description, result, error, queryArg, meta, assertTagTypes) {
      if (isFunction(description)) {
        return description(result, error, queryArg, meta).map(expandTagDescription).map(assertTagTypes);
      }
      if (Array.isArray(description)) {
        return description.map(expandTagDescription).map(assertTagTypes);
      }
      return [];
    }
    function isFunction(t) {
      return typeof t === "function";
    }
    function expandTagDescription(description) {
      return typeof description === "string" ? { type: description } : description;
    }
    var import_toolkit6 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    function isNotNullish(v) {
      return v != null;
    }
    var forceQueryFnSymbol = Symbol("forceQueryFn");
    var isUpsertQuery = function(arg) {
      return typeof arg[forceQueryFnSymbol] === "function";
    };
    function buildInitiate(_j) {
      var serializeQueryArgs = _j.serializeQueryArgs, queryThunk = _j.queryThunk, mutationThunk = _j.mutationThunk, api = _j.api, context = _j.context;
      var runningQueries = /* @__PURE__ */ new Map();
      var runningMutations = /* @__PURE__ */ new Map();
      var _k = api.internalActions, unsubscribeQueryResult = _k.unsubscribeQueryResult, removeMutationResult = _k.removeMutationResult, updateSubscriptionOptions = _k.updateSubscriptionOptions;
      return {
        buildInitiateQuery,
        buildInitiateMutation,
        getRunningQueryThunk,
        getRunningMutationThunk,
        getRunningQueriesThunk,
        getRunningMutationsThunk,
        getRunningOperationPromises,
        removalWarning
      };
      function removalWarning() {
        throw new Error("This method had to be removed due to a conceptual bug in RTK.\n       Please see https://github.com/reduxjs/redux-toolkit/pull/2481 for details.\n       See https://redux-toolkit.js.org/rtk-query/usage/server-side-rendering for new guidance on SSR.");
      }
      function getRunningOperationPromises() {
        if (typeof process !== "undefined" && true) {
          removalWarning();
        } else {
          var extract = function(v) {
            return Array.from(v.values()).flatMap(function(queriesForStore) {
              return queriesForStore ? Object.values(queriesForStore) : [];
            });
          };
          return __spreadArray(__spreadArray([], extract(runningQueries)), extract(runningMutations)).filter(isNotNullish);
        }
      }
      function getRunningQueryThunk(endpointName, queryArgs) {
        return function(dispatch) {
          var _a;
          var endpointDefinition = context.endpointDefinitions[endpointName];
          var queryCacheKey = serializeQueryArgs({
            queryArgs,
            endpointDefinition,
            endpointName
          });
          return (_a = runningQueries.get(dispatch)) == null ? void 0 : _a[queryCacheKey];
        };
      }
      function getRunningMutationThunk(_endpointName, fixedCacheKeyOrRequestId) {
        return function(dispatch) {
          var _a;
          return (_a = runningMutations.get(dispatch)) == null ? void 0 : _a[fixedCacheKeyOrRequestId];
        };
      }
      function getRunningQueriesThunk() {
        return function(dispatch) {
          return Object.values(runningQueries.get(dispatch) || {}).filter(isNotNullish);
        };
      }
      function getRunningMutationsThunk() {
        return function(dispatch) {
          return Object.values(runningMutations.get(dispatch) || {}).filter(isNotNullish);
        };
      }
      function middlewareWarning(dispatch) {
        if (true) {
          if (middlewareWarning.triggered)
            return;
          var registered = dispatch(api.internalActions.internal_probeSubscription({
            queryCacheKey: "DOES_NOT_EXIST",
            requestId: "DUMMY_REQUEST_ID"
          }));
          middlewareWarning.triggered = true;
          if (typeof registered !== "boolean") {
            throw new Error('Warning: Middleware for RTK-Query API at reducerPath "' + api.reducerPath + '" has not been added to the store.\nYou must add the middleware for RTK-Query to function correctly!');
          }
        }
      }
      function buildInitiateQuery(endpointName, endpointDefinition) {
        var queryAction = function(arg, _j2) {
          var _k2 = _j2 === void 0 ? {} : _j2, _l = _k2.subscribe, subscribe = _l === void 0 ? true : _l, forceRefetch = _k2.forceRefetch, subscriptionOptions = _k2.subscriptionOptions, _m = forceQueryFnSymbol, forceQueryFn = _k2[_m];
          return function(dispatch, getState) {
            var _j3;
            var _a;
            var queryCacheKey = serializeQueryArgs({
              queryArgs: arg,
              endpointDefinition,
              endpointName
            });
            var thunk = queryThunk((_j3 = {
              type: "query",
              subscribe,
              forceRefetch,
              subscriptionOptions,
              endpointName,
              originalArgs: arg,
              queryCacheKey
            }, _j3[forceQueryFnSymbol] = forceQueryFn, _j3));
            var selector = api.endpoints[endpointName].select(arg);
            var thunkResult = dispatch(thunk);
            var stateAfter = selector(getState());
            middlewareWarning(dispatch);
            var requestId = thunkResult.requestId, abort = thunkResult.abort;
            var skippedSynchronously = stateAfter.requestId !== requestId;
            var runningQuery = (_a = runningQueries.get(dispatch)) == null ? void 0 : _a[queryCacheKey];
            var selectFromState = function() {
              return selector(getState());
            };
            var statePromise = Object.assign(forceQueryFn ? thunkResult.then(selectFromState) : skippedSynchronously && !runningQuery ? Promise.resolve(stateAfter) : Promise.all([runningQuery, thunkResult]).then(selectFromState), {
              arg,
              requestId,
              subscriptionOptions,
              queryCacheKey,
              abort,
              unwrap: function() {
                return __async(this, null, function() {
                  var result;
                  return __generator(this, function(_j4) {
                    switch (_j4.label) {
                      case 0:
                        return [4, statePromise];
                      case 1:
                        result = _j4.sent();
                        if (result.isError) {
                          throw result.error;
                        }
                        return [2, result.data];
                    }
                  });
                });
              },
              refetch: function() {
                return dispatch(queryAction(arg, { subscribe: false, forceRefetch: true }));
              },
              unsubscribe: function() {
                if (subscribe)
                  dispatch(unsubscribeQueryResult({
                    queryCacheKey,
                    requestId
                  }));
              },
              updateSubscriptionOptions: function(options) {
                statePromise.subscriptionOptions = options;
                dispatch(updateSubscriptionOptions({
                  endpointName,
                  requestId,
                  queryCacheKey,
                  options
                }));
              }
            });
            if (!runningQuery && !skippedSynchronously && !forceQueryFn) {
              var running_1 = runningQueries.get(dispatch) || {};
              running_1[queryCacheKey] = statePromise;
              runningQueries.set(dispatch, running_1);
              statePromise.then(function() {
                delete running_1[queryCacheKey];
                if (!Object.keys(running_1).length) {
                  runningQueries.delete(dispatch);
                }
              });
            }
            return statePromise;
          };
        };
        return queryAction;
      }
      function buildInitiateMutation(endpointName) {
        return function(arg, _j2) {
          var _k2 = _j2 === void 0 ? {} : _j2, _l = _k2.track, track = _l === void 0 ? true : _l, fixedCacheKey = _k2.fixedCacheKey;
          return function(dispatch, getState) {
            var thunk = mutationThunk({
              type: "mutation",
              endpointName,
              originalArgs: arg,
              track,
              fixedCacheKey
            });
            var thunkResult = dispatch(thunk);
            middlewareWarning(dispatch);
            var requestId = thunkResult.requestId, abort = thunkResult.abort, unwrap = thunkResult.unwrap;
            var returnValuePromise = thunkResult.unwrap().then(function(data) {
              return { data };
            }).catch(function(error) {
              return { error };
            });
            var reset = function() {
              dispatch(removeMutationResult({ requestId, fixedCacheKey }));
            };
            var ret = Object.assign(returnValuePromise, {
              arg: thunkResult.arg,
              requestId,
              abort,
              unwrap,
              unsubscribe: reset,
              reset
            });
            var running = runningMutations.get(dispatch) || {};
            runningMutations.set(dispatch, running);
            running[requestId] = ret;
            ret.then(function() {
              delete running[requestId];
              if (!Object.keys(running).length) {
                runningMutations.delete(dispatch);
              }
            });
            if (fixedCacheKey) {
              running[fixedCacheKey] = ret;
              ret.then(function() {
                if (running[fixedCacheKey] === ret) {
                  delete running[fixedCacheKey];
                  if (!Object.keys(running).length) {
                    runningMutations.delete(dispatch);
                  }
                }
              });
            }
            return ret;
          };
        };
      }
    }
    var import_toolkit4 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var import_immer = __toModule(require_dist());
    var import_toolkit5 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    function defaultTransformResponse(baseQueryReturnValue) {
      return baseQueryReturnValue;
    }
    function buildThunks(_j) {
      var _this = this;
      var reducerPath = _j.reducerPath, baseQuery = _j.baseQuery, endpointDefinitions = _j.context.endpointDefinitions, serializeQueryArgs = _j.serializeQueryArgs, api = _j.api, assertTagType = _j.assertTagType;
      var patchQueryData = function(endpointName, args, patches, updateProvided) {
        return function(dispatch, getState) {
          var endpointDefinition = endpointDefinitions[endpointName];
          var queryCacheKey = serializeQueryArgs({
            queryArgs: args,
            endpointDefinition,
            endpointName
          });
          dispatch(api.internalActions.queryResultPatched({ queryCacheKey, patches }));
          if (!updateProvided) {
            return;
          }
          var newValue = api.endpoints[endpointName].select(args)(getState());
          var providedTags = calculateProvidedBy(endpointDefinition.providesTags, newValue.data, void 0, args, {}, assertTagType);
          dispatch(api.internalActions.updateProvidedBy({ queryCacheKey, providedTags }));
        };
      };
      var updateQueryData = function(endpointName, args, updateRecipe, updateProvided) {
        if (updateProvided === void 0) {
          updateProvided = true;
        }
        return function(dispatch, getState) {
          var _j2, _k;
          var endpointDefinition = api.endpoints[endpointName];
          var currentState = endpointDefinition.select(args)(getState());
          var ret = {
            patches: [],
            inversePatches: [],
            undo: function() {
              return dispatch(api.util.patchQueryData(endpointName, args, ret.inversePatches, updateProvided));
            }
          };
          if (currentState.status === QueryStatus.uninitialized) {
            return ret;
          }
          var newValue;
          if ("data" in currentState) {
            if ((0, import_immer.isDraftable)(currentState.data)) {
              var _l = (0, import_immer.produceWithPatches)(currentState.data, updateRecipe), value = _l[0], patches = _l[1], inversePatches = _l[2];
              (_j2 = ret.patches).push.apply(_j2, patches);
              (_k = ret.inversePatches).push.apply(_k, inversePatches);
              newValue = value;
            } else {
              newValue = updateRecipe(currentState.data);
              ret.patches.push({ op: "replace", path: [], value: newValue });
              ret.inversePatches.push({
                op: "replace",
                path: [],
                value: currentState.data
              });
            }
          }
          dispatch(api.util.patchQueryData(endpointName, args, ret.patches, updateProvided));
          return ret;
        };
      };
      var upsertQueryData = function(endpointName, args, value) {
        return function(dispatch) {
          var _j2;
          return dispatch(api.endpoints[endpointName].initiate(args, (_j2 = {
            subscribe: false,
            forceRefetch: true
          }, _j2[forceQueryFnSymbol] = function() {
            return {
              data: value
            };
          }, _j2)));
        };
      };
      var executeEndpoint = function(_0, _1) {
        return __async(_this, [_0, _1], function(arg, _j2) {
          var endpointDefinition, transformResponse, result, baseQueryApi_1, forceQueryFn, what, err, _k, _l, key, _m, error_1, catchedError, transformErrorResponse, _o, e_4;
          var _p, _q;
          var signal = _j2.signal, abort = _j2.abort, rejectWithValue = _j2.rejectWithValue, fulfillWithValue = _j2.fulfillWithValue, dispatch = _j2.dispatch, getState = _j2.getState, extra = _j2.extra;
          return __generator(this, function(_r) {
            switch (_r.label) {
              case 0:
                endpointDefinition = endpointDefinitions[arg.endpointName];
                _r.label = 1;
              case 1:
                _r.trys.push([1, 8, , 13]);
                transformResponse = defaultTransformResponse;
                result = void 0;
                baseQueryApi_1 = {
                  signal,
                  abort,
                  dispatch,
                  getState,
                  extra,
                  endpoint: arg.endpointName,
                  type: arg.type,
                  forced: arg.type === "query" ? isForcedQuery(arg, getState()) : void 0
                };
                forceQueryFn = arg.type === "query" ? arg[forceQueryFnSymbol] : void 0;
                if (!forceQueryFn)
                  return [3, 2];
                result = forceQueryFn();
                return [3, 6];
              case 2:
                if (!endpointDefinition.query)
                  return [3, 4];
                return [4, baseQuery(endpointDefinition.query(arg.originalArgs), baseQueryApi_1, endpointDefinition.extraOptions)];
              case 3:
                result = _r.sent();
                if (endpointDefinition.transformResponse) {
                  transformResponse = endpointDefinition.transformResponse;
                }
                return [3, 6];
              case 4:
                return [4, endpointDefinition.queryFn(arg.originalArgs, baseQueryApi_1, endpointDefinition.extraOptions, function(arg2) {
                  return baseQuery(arg2, baseQueryApi_1, endpointDefinition.extraOptions);
                })];
              case 5:
                result = _r.sent();
                _r.label = 6;
              case 6:
                if (typeof process !== "undefined" && true) {
                  what = endpointDefinition.query ? "`baseQuery`" : "`queryFn`";
                  err = void 0;
                  if (!result) {
                    err = what + " did not return anything.";
                  } else if (typeof result !== "object") {
                    err = what + " did not return an object.";
                  } else if (result.error && result.data) {
                    err = what + " returned an object containing both `error` and `result`.";
                  } else if (result.error === void 0 && result.data === void 0) {
                    err = what + " returned an object containing neither a valid `error` and `result`. At least one of them should not be `undefined`";
                  } else {
                    for (_k = 0, _l = Object.keys(result); _k < _l.length; _k++) {
                      key = _l[_k];
                      if (key !== "error" && key !== "data" && key !== "meta") {
                        err = "The object returned by " + what + " has the unknown property " + key + ".";
                        break;
                      }
                    }
                  }
                  if (err) {
                    console.error("Error encountered handling the endpoint " + arg.endpointName + ".\n              " + err + "\n              It needs to return an object with either the shape `{ data: <value> }` or `{ error: <value> }` that may contain an optional `meta` property.\n              Object returned was:", result);
                  }
                }
                if (result.error)
                  throw new HandledError(result.error, result.meta);
                _m = fulfillWithValue;
                return [4, transformResponse(result.data, result.meta, arg.originalArgs)];
              case 7:
                return [2, _m.apply(void 0, [_r.sent(), (_p = {
                  fulfilledTimeStamp: Date.now(),
                  baseQueryMeta: result.meta
                }, _p[import_toolkit5.SHOULD_AUTOBATCH] = true, _p)])];
              case 8:
                error_1 = _r.sent();
                catchedError = error_1;
                if (!(catchedError instanceof HandledError))
                  return [3, 12];
                transformErrorResponse = defaultTransformResponse;
                if (endpointDefinition.query && endpointDefinition.transformErrorResponse) {
                  transformErrorResponse = endpointDefinition.transformErrorResponse;
                }
                _r.label = 9;
              case 9:
                _r.trys.push([9, 11, , 12]);
                _o = rejectWithValue;
                return [4, transformErrorResponse(catchedError.value, catchedError.meta, arg.originalArgs)];
              case 10:
                return [2, _o.apply(void 0, [_r.sent(), (_q = { baseQueryMeta: catchedError.meta }, _q[import_toolkit5.SHOULD_AUTOBATCH] = true, _q)])];
              case 11:
                e_4 = _r.sent();
                catchedError = e_4;
                return [3, 12];
              case 12:
                if (typeof process !== "undefined" && true) {
                  console.error('An unhandled error occurred processing a request for the endpoint "' + arg.endpointName + '".\nIn the case of an unhandled error, no tags will be "provided" or "invalidated".', catchedError);
                } else {
                  console.error(catchedError);
                }
                throw catchedError;
              case 13:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      function isForcedQuery(arg, state) {
        var _a, _b, _c, _d;
        var requestState = (_b = (_a = state[reducerPath]) == null ? void 0 : _a.queries) == null ? void 0 : _b[arg.queryCacheKey];
        var baseFetchOnMountOrArgChange = (_c = state[reducerPath]) == null ? void 0 : _c.config.refetchOnMountOrArgChange;
        var fulfilledVal = requestState == null ? void 0 : requestState.fulfilledTimeStamp;
        var refetchVal = (_d = arg.forceRefetch) != null ? _d : arg.subscribe && baseFetchOnMountOrArgChange;
        if (refetchVal) {
          return refetchVal === true || (Number(/* @__PURE__ */ new Date()) - Number(fulfilledVal)) / 1e3 >= refetchVal;
        }
        return false;
      }
      var queryThunk = (0, import_toolkit5.createAsyncThunk)(reducerPath + "/executeQuery", executeEndpoint, {
        getPendingMeta: function() {
          var _j2;
          return _j2 = { startedTimeStamp: Date.now() }, _j2[import_toolkit5.SHOULD_AUTOBATCH] = true, _j2;
        },
        condition: function(queryThunkArgs, _j2) {
          var getState = _j2.getState;
          var _a, _b, _c;
          var state = getState();
          var requestState = (_b = (_a = state[reducerPath]) == null ? void 0 : _a.queries) == null ? void 0 : _b[queryThunkArgs.queryCacheKey];
          var fulfilledVal = requestState == null ? void 0 : requestState.fulfilledTimeStamp;
          var currentArg = queryThunkArgs.originalArgs;
          var previousArg = requestState == null ? void 0 : requestState.originalArgs;
          var endpointDefinition = endpointDefinitions[queryThunkArgs.endpointName];
          if (isUpsertQuery(queryThunkArgs)) {
            return true;
          }
          if ((requestState == null ? void 0 : requestState.status) === "pending") {
            return false;
          }
          if (isForcedQuery(queryThunkArgs, state)) {
            return true;
          }
          if (isQueryDefinition(endpointDefinition) && ((_c = endpointDefinition == null ? void 0 : endpointDefinition.forceRefetch) == null ? void 0 : _c.call(endpointDefinition, {
            currentArg,
            previousArg,
            endpointState: requestState,
            state
          }))) {
            return true;
          }
          if (fulfilledVal) {
            return false;
          }
          return true;
        },
        dispatchConditionRejection: true
      });
      var mutationThunk = (0, import_toolkit5.createAsyncThunk)(reducerPath + "/executeMutation", executeEndpoint, {
        getPendingMeta: function() {
          var _j2;
          return _j2 = { startedTimeStamp: Date.now() }, _j2[import_toolkit5.SHOULD_AUTOBATCH] = true, _j2;
        }
      });
      var hasTheForce = function(options) {
        return "force" in options;
      };
      var hasMaxAge = function(options) {
        return "ifOlderThan" in options;
      };
      var prefetch = function(endpointName, arg, options) {
        return function(dispatch, getState) {
          var force = hasTheForce(options) && options.force;
          var maxAge = hasMaxAge(options) && options.ifOlderThan;
          var queryAction = function(force2) {
            if (force2 === void 0) {
              force2 = true;
            }
            return api.endpoints[endpointName].initiate(arg, { forceRefetch: force2 });
          };
          var latestStateValue = api.endpoints[endpointName].select(arg)(getState());
          if (force) {
            dispatch(queryAction());
          } else if (maxAge) {
            var lastFulfilledTs = latestStateValue == null ? void 0 : latestStateValue.fulfilledTimeStamp;
            if (!lastFulfilledTs) {
              dispatch(queryAction());
              return;
            }
            var shouldRetrigger = (Number(/* @__PURE__ */ new Date()) - Number(new Date(lastFulfilledTs))) / 1e3 >= maxAge;
            if (shouldRetrigger) {
              dispatch(queryAction());
            }
          } else {
            dispatch(queryAction(false));
          }
        };
      };
      function matchesEndpoint(endpointName) {
        return function(action) {
          var _a, _b;
          return ((_b = (_a = action == null ? void 0 : action.meta) == null ? void 0 : _a.arg) == null ? void 0 : _b.endpointName) === endpointName;
        };
      }
      function buildMatchThunkActions(thunk, endpointName) {
        return {
          matchPending: (0, import_toolkit4.isAllOf)((0, import_toolkit4.isPending)(thunk), matchesEndpoint(endpointName)),
          matchFulfilled: (0, import_toolkit4.isAllOf)((0, import_toolkit4.isFulfilled)(thunk), matchesEndpoint(endpointName)),
          matchRejected: (0, import_toolkit4.isAllOf)((0, import_toolkit4.isRejected)(thunk), matchesEndpoint(endpointName))
        };
      }
      return {
        queryThunk,
        mutationThunk,
        prefetch,
        updateQueryData,
        upsertQueryData,
        patchQueryData,
        buildMatchThunkActions
      };
    }
    function calculateProvidedByThunk(action, type, endpointDefinitions, assertTagType) {
      return calculateProvidedBy(endpointDefinitions[action.meta.arg.endpointName][type], (0, import_toolkit4.isFulfilled)(action) ? action.payload : void 0, (0, import_toolkit4.isRejectedWithValue)(action) ? action.payload : void 0, action.meta.arg.originalArgs, "baseQueryMeta" in action.meta ? action.meta.baseQueryMeta : void 0, assertTagType);
    }
    var import_immer2 = __toModule(require_dist());
    var import_immer3 = __toModule(require_dist());
    function updateQuerySubstateIfExists(state, queryCacheKey, update) {
      var substate = state[queryCacheKey];
      if (substate) {
        update(substate);
      }
    }
    function getMutationCacheKey(id) {
      var _a;
      return (_a = "arg" in id ? id.arg.fixedCacheKey : id.fixedCacheKey) != null ? _a : id.requestId;
    }
    function updateMutationSubstateIfExists(state, id, update) {
      var substate = state[getMutationCacheKey(id)];
      if (substate) {
        update(substate);
      }
    }
    var initialState = {};
    function buildSlice(_j) {
      var reducerPath = _j.reducerPath, queryThunk = _j.queryThunk, mutationThunk = _j.mutationThunk, _k = _j.context, definitions = _k.endpointDefinitions, apiUid = _k.apiUid, extractRehydrationInfo = _k.extractRehydrationInfo, hasRehydrationInfo = _k.hasRehydrationInfo, assertTagType = _j.assertTagType, config = _j.config;
      var resetApiState = (0, import_toolkit6.createAction)(reducerPath + "/resetApiState");
      var querySlice = (0, import_toolkit6.createSlice)({
        name: reducerPath + "/queries",
        initialState,
        reducers: {
          removeQueryResult: {
            reducer: function(draft, _j2) {
              var queryCacheKey = _j2.payload.queryCacheKey;
              delete draft[queryCacheKey];
            },
            prepare: (0, import_toolkit6.prepareAutoBatched)()
          },
          queryResultPatched: {
            reducer: function(draft, _j2) {
              var _k2 = _j2.payload, queryCacheKey = _k2.queryCacheKey, patches = _k2.patches;
              updateQuerySubstateIfExists(draft, queryCacheKey, function(substate) {
                substate.data = (0, import_immer3.applyPatches)(substate.data, patches.concat());
              });
            },
            prepare: (0, import_toolkit6.prepareAutoBatched)()
          }
        },
        extraReducers: function(builder) {
          builder.addCase(queryThunk.pending, function(draft, _j2) {
            var meta = _j2.meta, arg = _j2.meta.arg;
            var _a, _b;
            var upserting = isUpsertQuery(arg);
            if (arg.subscribe || upserting) {
              (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {
                status: QueryStatus.uninitialized,
                endpointName: arg.endpointName
              };
            }
            updateQuerySubstateIfExists(draft, arg.queryCacheKey, function(substate) {
              substate.status = QueryStatus.pending;
              substate.requestId = upserting && substate.requestId ? substate.requestId : meta.requestId;
              if (arg.originalArgs !== void 0) {
                substate.originalArgs = arg.originalArgs;
              }
              substate.startedTimeStamp = meta.startedTimeStamp;
            });
          }).addCase(queryThunk.fulfilled, function(draft, _j2) {
            var meta = _j2.meta, payload = _j2.payload;
            updateQuerySubstateIfExists(draft, meta.arg.queryCacheKey, function(substate) {
              var _a;
              if (substate.requestId !== meta.requestId && !isUpsertQuery(meta.arg))
                return;
              var merge = definitions[meta.arg.endpointName].merge;
              substate.status = QueryStatus.fulfilled;
              if (merge) {
                if (substate.data !== void 0) {
                  var fulfilledTimeStamp_1 = meta.fulfilledTimeStamp, arg_1 = meta.arg, baseQueryMeta_1 = meta.baseQueryMeta, requestId_1 = meta.requestId;
                  var newData = (0, import_toolkit6.createNextState)(substate.data, function(draftSubstateData) {
                    return merge(draftSubstateData, payload, {
                      arg: arg_1.originalArgs,
                      baseQueryMeta: baseQueryMeta_1,
                      fulfilledTimeStamp: fulfilledTimeStamp_1,
                      requestId: requestId_1
                    });
                  });
                  substate.data = newData;
                } else {
                  substate.data = payload;
                }
              } else {
                substate.data = ((_a = definitions[meta.arg.endpointName].structuralSharing) != null ? _a : true) ? copyWithStructuralSharing((0, import_immer2.isDraft)(substate.data) ? (0, import_immer3.original)(substate.data) : substate.data, payload) : payload;
              }
              delete substate.error;
              substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
            });
          }).addCase(queryThunk.rejected, function(draft, _j2) {
            var _k2 = _j2.meta, condition = _k2.condition, arg = _k2.arg, requestId = _k2.requestId, error = _j2.error, payload = _j2.payload;
            updateQuerySubstateIfExists(draft, arg.queryCacheKey, function(substate) {
              if (condition) {
              } else {
                if (substate.requestId !== requestId)
                  return;
                substate.status = QueryStatus.rejected;
                substate.error = payload != null ? payload : error;
              }
            });
          }).addMatcher(hasRehydrationInfo, function(draft, action) {
            var queries = extractRehydrationInfo(action).queries;
            for (var _j2 = 0, _k2 = Object.entries(queries); _j2 < _k2.length; _j2++) {
              var _l = _k2[_j2], key = _l[0], entry = _l[1];
              if ((entry == null ? void 0 : entry.status) === QueryStatus.fulfilled || (entry == null ? void 0 : entry.status) === QueryStatus.rejected) {
                draft[key] = entry;
              }
            }
          });
        }
      });
      var mutationSlice = (0, import_toolkit6.createSlice)({
        name: reducerPath + "/mutations",
        initialState,
        reducers: {
          removeMutationResult: {
            reducer: function(draft, _j2) {
              var payload = _j2.payload;
              var cacheKey = getMutationCacheKey(payload);
              if (cacheKey in draft) {
                delete draft[cacheKey];
              }
            },
            prepare: (0, import_toolkit6.prepareAutoBatched)()
          }
        },
        extraReducers: function(builder) {
          builder.addCase(mutationThunk.pending, function(draft, _j2) {
            var meta = _j2.meta, _k2 = _j2.meta, requestId = _k2.requestId, arg = _k2.arg, startedTimeStamp = _k2.startedTimeStamp;
            if (!arg.track)
              return;
            draft[getMutationCacheKey(meta)] = {
              requestId,
              status: QueryStatus.pending,
              endpointName: arg.endpointName,
              startedTimeStamp
            };
          }).addCase(mutationThunk.fulfilled, function(draft, _j2) {
            var payload = _j2.payload, meta = _j2.meta;
            if (!meta.arg.track)
              return;
            updateMutationSubstateIfExists(draft, meta, function(substate) {
              if (substate.requestId !== meta.requestId)
                return;
              substate.status = QueryStatus.fulfilled;
              substate.data = payload;
              substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
            });
          }).addCase(mutationThunk.rejected, function(draft, _j2) {
            var payload = _j2.payload, error = _j2.error, meta = _j2.meta;
            if (!meta.arg.track)
              return;
            updateMutationSubstateIfExists(draft, meta, function(substate) {
              if (substate.requestId !== meta.requestId)
                return;
              substate.status = QueryStatus.rejected;
              substate.error = payload != null ? payload : error;
            });
          }).addMatcher(hasRehydrationInfo, function(draft, action) {
            var mutations = extractRehydrationInfo(action).mutations;
            for (var _j2 = 0, _k2 = Object.entries(mutations); _j2 < _k2.length; _j2++) {
              var _l = _k2[_j2], key = _l[0], entry = _l[1];
              if (((entry == null ? void 0 : entry.status) === QueryStatus.fulfilled || (entry == null ? void 0 : entry.status) === QueryStatus.rejected) && key !== (entry == null ? void 0 : entry.requestId)) {
                draft[key] = entry;
              }
            }
          });
        }
      });
      var invalidationSlice = (0, import_toolkit6.createSlice)({
        name: reducerPath + "/invalidation",
        initialState,
        reducers: {
          updateProvidedBy: {
            reducer: function(draft, action) {
              var _a, _b, _c, _d;
              var _j2 = action.payload, queryCacheKey = _j2.queryCacheKey, providedTags = _j2.providedTags;
              for (var _k2 = 0, _l = Object.values(draft); _k2 < _l.length; _k2++) {
                var tagTypeSubscriptions = _l[_k2];
                for (var _m = 0, _o = Object.values(tagTypeSubscriptions); _m < _o.length; _m++) {
                  var idSubscriptions = _o[_m];
                  var foundAt = idSubscriptions.indexOf(queryCacheKey);
                  if (foundAt !== -1) {
                    idSubscriptions.splice(foundAt, 1);
                  }
                }
              }
              for (var _p = 0, providedTags_1 = providedTags; _p < providedTags_1.length; _p++) {
                var _q = providedTags_1[_p], type = _q.type, id = _q.id;
                var subscribedQueries = (_d = (_b = (_a = draft[type]) != null ? _a : draft[type] = {})[_c = id || "__internal_without_id"]) != null ? _d : _b[_c] = [];
                var alreadySubscribed = subscribedQueries.includes(queryCacheKey);
                if (!alreadySubscribed) {
                  subscribedQueries.push(queryCacheKey);
                }
              }
            },
            prepare: (0, import_toolkit6.prepareAutoBatched)()
          }
        },
        extraReducers: function(builder) {
          builder.addCase(querySlice.actions.removeQueryResult, function(draft, _j2) {
            var queryCacheKey = _j2.payload.queryCacheKey;
            for (var _k2 = 0, _l = Object.values(draft); _k2 < _l.length; _k2++) {
              var tagTypeSubscriptions = _l[_k2];
              for (var _m = 0, _o = Object.values(tagTypeSubscriptions); _m < _o.length; _m++) {
                var idSubscriptions = _o[_m];
                var foundAt = idSubscriptions.indexOf(queryCacheKey);
                if (foundAt !== -1) {
                  idSubscriptions.splice(foundAt, 1);
                }
              }
            }
          }).addMatcher(hasRehydrationInfo, function(draft, action) {
            var _a, _b, _c, _d;
            var provided = extractRehydrationInfo(action).provided;
            for (var _j2 = 0, _k2 = Object.entries(provided); _j2 < _k2.length; _j2++) {
              var _l = _k2[_j2], type = _l[0], incomingTags = _l[1];
              for (var _m = 0, _o = Object.entries(incomingTags); _m < _o.length; _m++) {
                var _p = _o[_m], id = _p[0], cacheKeys = _p[1];
                var subscribedQueries = (_d = (_b = (_a = draft[type]) != null ? _a : draft[type] = {})[_c = id || "__internal_without_id"]) != null ? _d : _b[_c] = [];
                for (var _q = 0, cacheKeys_1 = cacheKeys; _q < cacheKeys_1.length; _q++) {
                  var queryCacheKey = cacheKeys_1[_q];
                  var alreadySubscribed = subscribedQueries.includes(queryCacheKey);
                  if (!alreadySubscribed) {
                    subscribedQueries.push(queryCacheKey);
                  }
                }
              }
            }
          }).addMatcher((0, import_toolkit6.isAnyOf)((0, import_toolkit6.isFulfilled)(queryThunk), (0, import_toolkit6.isRejectedWithValue)(queryThunk)), function(draft, action) {
            var providedTags = calculateProvidedByThunk(action, "providesTags", definitions, assertTagType);
            var queryCacheKey = action.meta.arg.queryCacheKey;
            invalidationSlice.caseReducers.updateProvidedBy(draft, invalidationSlice.actions.updateProvidedBy({
              queryCacheKey,
              providedTags
            }));
          });
        }
      });
      var subscriptionSlice = (0, import_toolkit6.createSlice)({
        name: reducerPath + "/subscriptions",
        initialState,
        reducers: {
          updateSubscriptionOptions: function(d, a) {
          },
          unsubscribeQueryResult: function(d, a) {
          },
          internal_probeSubscription: function(d, a) {
          }
        }
      });
      var internalSubscriptionsSlice = (0, import_toolkit6.createSlice)({
        name: reducerPath + "/internalSubscriptions",
        initialState,
        reducers: {
          subscriptionsUpdated: {
            reducer: function(state, action) {
              return (0, import_immer3.applyPatches)(state, action.payload);
            },
            prepare: (0, import_toolkit6.prepareAutoBatched)()
          }
        }
      });
      var configSlice = (0, import_toolkit6.createSlice)({
        name: reducerPath + "/config",
        initialState: __spreadValues({
          online: isOnline(),
          focused: isDocumentVisible(),
          middlewareRegistered: false
        }, config),
        reducers: {
          middlewareRegistered: function(state, _j2) {
            var payload = _j2.payload;
            state.middlewareRegistered = state.middlewareRegistered === "conflict" || apiUid !== payload ? "conflict" : true;
          }
        },
        extraReducers: function(builder) {
          builder.addCase(onOnline, function(state) {
            state.online = true;
          }).addCase(onOffline, function(state) {
            state.online = false;
          }).addCase(onFocus, function(state) {
            state.focused = true;
          }).addCase(onFocusLost, function(state) {
            state.focused = false;
          }).addMatcher(hasRehydrationInfo, function(draft) {
            return __spreadValues({}, draft);
          });
        }
      });
      var combinedReducer = (0, import_toolkit6.combineReducers)({
        queries: querySlice.reducer,
        mutations: mutationSlice.reducer,
        provided: invalidationSlice.reducer,
        subscriptions: internalSubscriptionsSlice.reducer,
        config: configSlice.reducer
      });
      var reducer = function(state, action) {
        return combinedReducer(resetApiState.match(action) ? void 0 : state, action);
      };
      var actions = __spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, configSlice.actions), querySlice.actions), subscriptionSlice.actions), internalSubscriptionsSlice.actions), mutationSlice.actions), invalidationSlice.actions), {
        unsubscribeMutationResult: mutationSlice.actions.removeMutationResult,
        resetApiState
      });
      return { reducer, actions };
    }
    var skipToken = Symbol.for("RTKQ/skipToken");
    var skipSelector = skipToken;
    var initialSubState = {
      status: QueryStatus.uninitialized
    };
    var defaultQuerySubState = (0, import_toolkit7.createNextState)(initialSubState, function() {
    });
    var defaultMutationSubState = (0, import_toolkit7.createNextState)(initialSubState, function() {
    });
    function buildSelectors(_j) {
      var serializeQueryArgs = _j.serializeQueryArgs, reducerPath = _j.reducerPath;
      var selectSkippedQuery = function(state) {
        return defaultQuerySubState;
      };
      var selectSkippedMutation = function(state) {
        return defaultMutationSubState;
      };
      return { buildQuerySelector, buildMutationSelector, selectInvalidatedBy };
      function withRequestFlags(substate) {
        return __spreadValues(__spreadValues({}, substate), getRequestStatusFlags(substate.status));
      }
      function selectInternalState(rootState) {
        var state = rootState[reducerPath];
        if (true) {
          if (!state) {
            if (selectInternalState.triggered)
              return state;
            selectInternalState.triggered = true;
            console.error("Error: No data found at `state." + reducerPath + "`. Did you forget to add the reducer to the store?");
          }
        }
        return state;
      }
      function buildQuerySelector(endpointName, endpointDefinition) {
        return function(queryArgs) {
          var serializedArgs = serializeQueryArgs({
            queryArgs,
            endpointDefinition,
            endpointName
          });
          var selectQuerySubstate = function(state) {
            var _a, _b, _c;
            return (_c = (_b = (_a = selectInternalState(state)) == null ? void 0 : _a.queries) == null ? void 0 : _b[serializedArgs]) != null ? _c : defaultQuerySubState;
          };
          var finalSelectQuerySubState = queryArgs === skipToken ? selectSkippedQuery : selectQuerySubstate;
          return (0, import_toolkit7.createSelector)(finalSelectQuerySubState, withRequestFlags);
        };
      }
      function buildMutationSelector() {
        return function(id) {
          var _a;
          var mutationId;
          if (typeof id === "object") {
            mutationId = (_a = getMutationCacheKey(id)) != null ? _a : skipToken;
          } else {
            mutationId = id;
          }
          var selectMutationSubstate = function(state) {
            var _a2, _b, _c;
            return (_c = (_b = (_a2 = selectInternalState(state)) == null ? void 0 : _a2.mutations) == null ? void 0 : _b[mutationId]) != null ? _c : defaultMutationSubState;
          };
          var finalSelectMutationSubstate = mutationId === skipToken ? selectSkippedMutation : selectMutationSubstate;
          return (0, import_toolkit7.createSelector)(finalSelectMutationSubstate, withRequestFlags);
        };
      }
      function selectInvalidatedBy(state, tags) {
        var _a;
        var apiState = state[reducerPath];
        var toInvalidate = /* @__PURE__ */ new Set();
        for (var _j2 = 0, _k = tags.map(expandTagDescription); _j2 < _k.length; _j2++) {
          var tag = _k[_j2];
          var provided = apiState.provided[tag.type];
          if (!provided) {
            continue;
          }
          var invalidateSubscriptions = (_a = tag.id !== void 0 ? provided[tag.id] : flatten(Object.values(provided))) != null ? _a : [];
          for (var _l = 0, invalidateSubscriptions_1 = invalidateSubscriptions; _l < invalidateSubscriptions_1.length; _l++) {
            var invalidate = invalidateSubscriptions_1[_l];
            toInvalidate.add(invalidate);
          }
        }
        return flatten(Array.from(toInvalidate.values()).map(function(queryCacheKey) {
          var querySubState = apiState.queries[queryCacheKey];
          return querySubState ? [
            {
              queryCacheKey,
              endpointName: querySubState.endpointName,
              originalArgs: querySubState.originalArgs
            }
          ] : [];
        }));
      }
    }
    var import_toolkit8 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var cache = WeakMap ? /* @__PURE__ */ new WeakMap() : void 0;
    var defaultSerializeQueryArgs = function(_j) {
      var endpointName = _j.endpointName, queryArgs = _j.queryArgs;
      var serialized = "";
      var cached = cache == null ? void 0 : cache.get(queryArgs);
      if (typeof cached === "string") {
        serialized = cached;
      } else {
        var stringified = JSON.stringify(queryArgs, function(key, value) {
          return (0, import_toolkit8.isPlainObject)(value) ? Object.keys(value).sort().reduce(function(acc, key2) {
            acc[key2] = value[key2];
            return acc;
          }, {}) : value;
        });
        if ((0, import_toolkit8.isPlainObject)(queryArgs)) {
          cache == null ? void 0 : cache.set(queryArgs, stringified);
        }
        serialized = stringified;
      }
      return endpointName + "(" + serialized + ")";
    };
    var import_toolkit9 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var import_reselect = __toModule((init_es(), __toCommonJS(es_exports)));
    function buildCreateApi() {
      var modules = [];
      for (var _j = 0; _j < arguments.length; _j++) {
        modules[_j] = arguments[_j];
      }
      return function baseCreateApi(options) {
        var extractRehydrationInfo = (0, import_reselect.defaultMemoize)(function(action) {
          var _a, _b;
          return (_b = options.extractRehydrationInfo) == null ? void 0 : _b.call(options, action, {
            reducerPath: (_a = options.reducerPath) != null ? _a : "api"
          });
        });
        var optionsWithDefaults = __spreadProps(__spreadValues({
          reducerPath: "api",
          keepUnusedDataFor: 60,
          refetchOnMountOrArgChange: false,
          refetchOnFocus: false,
          refetchOnReconnect: false
        }, options), {
          extractRehydrationInfo,
          serializeQueryArgs: function(queryArgsApi) {
            var finalSerializeQueryArgs = defaultSerializeQueryArgs;
            if ("serializeQueryArgs" in queryArgsApi.endpointDefinition) {
              var endpointSQA_1 = queryArgsApi.endpointDefinition.serializeQueryArgs;
              finalSerializeQueryArgs = function(queryArgsApi2) {
                var initialResult = endpointSQA_1(queryArgsApi2);
                if (typeof initialResult === "string") {
                  return initialResult;
                } else {
                  return defaultSerializeQueryArgs(__spreadProps(__spreadValues({}, queryArgsApi2), {
                    queryArgs: initialResult
                  }));
                }
              };
            } else if (options.serializeQueryArgs) {
              finalSerializeQueryArgs = options.serializeQueryArgs;
            }
            return finalSerializeQueryArgs(queryArgsApi);
          },
          tagTypes: __spreadArray([], options.tagTypes || [])
        });
        var context = {
          endpointDefinitions: {},
          batch: function(fn) {
            fn();
          },
          apiUid: (0, import_toolkit9.nanoid)(),
          extractRehydrationInfo,
          hasRehydrationInfo: (0, import_reselect.defaultMemoize)(function(action) {
            return extractRehydrationInfo(action) != null;
          })
        };
        var api = {
          injectEndpoints,
          enhanceEndpoints: function(_j2) {
            var addTagTypes = _j2.addTagTypes, endpoints = _j2.endpoints;
            if (addTagTypes) {
              for (var _k = 0, addTagTypes_1 = addTagTypes; _k < addTagTypes_1.length; _k++) {
                var eT = addTagTypes_1[_k];
                if (!optionsWithDefaults.tagTypes.includes(eT)) {
                  ;
                  optionsWithDefaults.tagTypes.push(eT);
                }
              }
            }
            if (endpoints) {
              for (var _l = 0, _m = Object.entries(endpoints); _l < _m.length; _l++) {
                var _o = _m[_l], endpointName = _o[0], partialDefinition = _o[1];
                if (typeof partialDefinition === "function") {
                  partialDefinition(context.endpointDefinitions[endpointName]);
                } else {
                  Object.assign(context.endpointDefinitions[endpointName] || {}, partialDefinition);
                }
              }
            }
            return api;
          }
        };
        var initializedModules = modules.map(function(m) {
          return m.init(api, optionsWithDefaults, context);
        });
        function injectEndpoints(inject) {
          var evaluatedEndpoints = inject.endpoints({
            query: function(x) {
              return __spreadProps(__spreadValues({}, x), { type: DefinitionType.query });
            },
            mutation: function(x) {
              return __spreadProps(__spreadValues({}, x), { type: DefinitionType.mutation });
            }
          });
          for (var _j2 = 0, _k = Object.entries(evaluatedEndpoints); _j2 < _k.length; _j2++) {
            var _l = _k[_j2], endpointName = _l[0], definition = _l[1];
            if (!inject.overrideExisting && endpointName in context.endpointDefinitions) {
              if (typeof process !== "undefined" && true) {
                console.error("called `injectEndpoints` to override already-existing endpointName " + endpointName + " without specifying `overrideExisting: true`");
              }
              continue;
            }
            context.endpointDefinitions[endpointName] = definition;
            for (var _m = 0, initializedModules_1 = initializedModules; _m < initializedModules_1.length; _m++) {
              var m = initializedModules_1[_m];
              m.injectEndpoint(endpointName, definition);
            }
          }
          return api;
        }
        return api.injectEndpoints({ endpoints: options.endpoints });
      };
    }
    function fakeBaseQuery() {
      return function() {
        throw new Error("When using `fakeBaseQuery`, all queries & mutations must use the `queryFn` definition syntax.");
      };
    }
    var import_toolkit13 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    function isObjectEmpty(obj) {
      for (var k in obj) {
        return false;
      }
      return true;
    }
    var THIRTY_TWO_BIT_MAX_TIMER_SECONDS = 2147483647 / 1e3 - 1;
    var buildCacheCollectionHandler = function(_j) {
      var reducerPath = _j.reducerPath, api = _j.api, context = _j.context, internalState = _j.internalState;
      var _k = api.internalActions, removeQueryResult = _k.removeQueryResult, unsubscribeQueryResult = _k.unsubscribeQueryResult;
      function anySubscriptionsRemainingForKey(queryCacheKey) {
        var subscriptions = internalState.currentSubscriptions[queryCacheKey];
        return !!subscriptions && !isObjectEmpty(subscriptions);
      }
      var currentRemovalTimeouts = {};
      var handler = function(action, mwApi, internalState2) {
        var _a;
        if (unsubscribeQueryResult.match(action)) {
          var state = mwApi.getState()[reducerPath];
          var queryCacheKey = action.payload.queryCacheKey;
          handleUnsubscribe(queryCacheKey, (_a = state.queries[queryCacheKey]) == null ? void 0 : _a.endpointName, mwApi, state.config);
        }
        if (api.util.resetApiState.match(action)) {
          for (var _j2 = 0, _k2 = Object.entries(currentRemovalTimeouts); _j2 < _k2.length; _j2++) {
            var _l = _k2[_j2], key = _l[0], timeout = _l[1];
            if (timeout)
              clearTimeout(timeout);
            delete currentRemovalTimeouts[key];
          }
        }
        if (context.hasRehydrationInfo(action)) {
          var state = mwApi.getState()[reducerPath];
          var queries = context.extractRehydrationInfo(action).queries;
          for (var _m = 0, _o = Object.entries(queries); _m < _o.length; _m++) {
            var _p = _o[_m], queryCacheKey = _p[0], queryState = _p[1];
            handleUnsubscribe(queryCacheKey, queryState == null ? void 0 : queryState.endpointName, mwApi, state.config);
          }
        }
      };
      function handleUnsubscribe(queryCacheKey, endpointName, api2, config) {
        var _a;
        var endpointDefinition = context.endpointDefinitions[endpointName];
        var keepUnusedDataFor = (_a = endpointDefinition == null ? void 0 : endpointDefinition.keepUnusedDataFor) != null ? _a : config.keepUnusedDataFor;
        if (keepUnusedDataFor === Infinity) {
          return;
        }
        var finalKeepUnusedDataFor = Math.max(0, Math.min(keepUnusedDataFor, THIRTY_TWO_BIT_MAX_TIMER_SECONDS));
        if (!anySubscriptionsRemainingForKey(queryCacheKey)) {
          var currentTimeout = currentRemovalTimeouts[queryCacheKey];
          if (currentTimeout) {
            clearTimeout(currentTimeout);
          }
          currentRemovalTimeouts[queryCacheKey] = setTimeout(function() {
            if (!anySubscriptionsRemainingForKey(queryCacheKey)) {
              api2.dispatch(removeQueryResult({ queryCacheKey }));
            }
            delete currentRemovalTimeouts[queryCacheKey];
          }, finalKeepUnusedDataFor * 1e3);
        }
      }
      return handler;
    };
    var import_toolkit10 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var buildInvalidationByTagsHandler = function(_j) {
      var reducerPath = _j.reducerPath, context = _j.context, endpointDefinitions = _j.context.endpointDefinitions, mutationThunk = _j.mutationThunk, api = _j.api, assertTagType = _j.assertTagType, refetchQuery = _j.refetchQuery;
      var removeQueryResult = api.internalActions.removeQueryResult;
      var isThunkActionWithTags = (0, import_toolkit10.isAnyOf)((0, import_toolkit10.isFulfilled)(mutationThunk), (0, import_toolkit10.isRejectedWithValue)(mutationThunk));
      var handler = function(action, mwApi) {
        if (isThunkActionWithTags(action)) {
          invalidateTags(calculateProvidedByThunk(action, "invalidatesTags", endpointDefinitions, assertTagType), mwApi);
        }
        if (api.util.invalidateTags.match(action)) {
          invalidateTags(calculateProvidedBy(action.payload, void 0, void 0, void 0, void 0, assertTagType), mwApi);
        }
      };
      function invalidateTags(tags, mwApi) {
        var rootState = mwApi.getState();
        var state = rootState[reducerPath];
        var toInvalidate = api.util.selectInvalidatedBy(rootState, tags);
        context.batch(function() {
          var _a;
          var valuesArray = Array.from(toInvalidate.values());
          for (var _j2 = 0, valuesArray_1 = valuesArray; _j2 < valuesArray_1.length; _j2++) {
            var queryCacheKey = valuesArray_1[_j2].queryCacheKey;
            var querySubState = state.queries[queryCacheKey];
            var subscriptionSubState = (_a = state.subscriptions[queryCacheKey]) != null ? _a : {};
            if (querySubState) {
              if (Object.keys(subscriptionSubState).length === 0) {
                mwApi.dispatch(removeQueryResult({
                  queryCacheKey
                }));
              } else if (querySubState.status !== QueryStatus.uninitialized) {
                mwApi.dispatch(refetchQuery(querySubState, queryCacheKey));
              }
            }
          }
        });
      }
      return handler;
    };
    var buildPollingHandler = function(_j) {
      var reducerPath = _j.reducerPath, queryThunk = _j.queryThunk, api = _j.api, refetchQuery = _j.refetchQuery, internalState = _j.internalState;
      var currentPolls = {};
      var handler = function(action, mwApi) {
        if (api.internalActions.updateSubscriptionOptions.match(action) || api.internalActions.unsubscribeQueryResult.match(action)) {
          updatePollingInterval(action.payload, mwApi);
        }
        if (queryThunk.pending.match(action) || queryThunk.rejected.match(action) && action.meta.condition) {
          updatePollingInterval(action.meta.arg, mwApi);
        }
        if (queryThunk.fulfilled.match(action) || queryThunk.rejected.match(action) && !action.meta.condition) {
          startNextPoll(action.meta.arg, mwApi);
        }
        if (api.util.resetApiState.match(action)) {
          clearPolls();
        }
      };
      function startNextPoll(_j2, api2) {
        var queryCacheKey = _j2.queryCacheKey;
        var state = api2.getState()[reducerPath];
        var querySubState = state.queries[queryCacheKey];
        var subscriptions = internalState.currentSubscriptions[queryCacheKey];
        if (!querySubState || querySubState.status === QueryStatus.uninitialized)
          return;
        var lowestPollingInterval = findLowestPollingInterval(subscriptions);
        if (!Number.isFinite(lowestPollingInterval))
          return;
        var currentPoll = currentPolls[queryCacheKey];
        if (currentPoll == null ? void 0 : currentPoll.timeout) {
          clearTimeout(currentPoll.timeout);
          currentPoll.timeout = void 0;
        }
        var nextPollTimestamp = Date.now() + lowestPollingInterval;
        var currentInterval = currentPolls[queryCacheKey] = {
          nextPollTimestamp,
          pollingInterval: lowestPollingInterval,
          timeout: setTimeout(function() {
            currentInterval.timeout = void 0;
            api2.dispatch(refetchQuery(querySubState, queryCacheKey));
          }, lowestPollingInterval)
        };
      }
      function updatePollingInterval(_j2, api2) {
        var queryCacheKey = _j2.queryCacheKey;
        var state = api2.getState()[reducerPath];
        var querySubState = state.queries[queryCacheKey];
        var subscriptions = internalState.currentSubscriptions[queryCacheKey];
        if (!querySubState || querySubState.status === QueryStatus.uninitialized) {
          return;
        }
        var lowestPollingInterval = findLowestPollingInterval(subscriptions);
        if (!Number.isFinite(lowestPollingInterval)) {
          cleanupPollForKey(queryCacheKey);
          return;
        }
        var currentPoll = currentPolls[queryCacheKey];
        var nextPollTimestamp = Date.now() + lowestPollingInterval;
        if (!currentPoll || nextPollTimestamp < currentPoll.nextPollTimestamp) {
          startNextPoll({ queryCacheKey }, api2);
        }
      }
      function cleanupPollForKey(key) {
        var existingPoll = currentPolls[key];
        if (existingPoll == null ? void 0 : existingPoll.timeout) {
          clearTimeout(existingPoll.timeout);
        }
        delete currentPolls[key];
      }
      function clearPolls() {
        for (var _j2 = 0, _k = Object.keys(currentPolls); _j2 < _k.length; _j2++) {
          var key = _k[_j2];
          cleanupPollForKey(key);
        }
      }
      function findLowestPollingInterval(subscribers) {
        if (subscribers === void 0) {
          subscribers = {};
        }
        var lowestPollingInterval = Number.POSITIVE_INFINITY;
        for (var key in subscribers) {
          if (!!subscribers[key].pollingInterval) {
            lowestPollingInterval = Math.min(subscribers[key].pollingInterval, lowestPollingInterval);
          }
        }
        return lowestPollingInterval;
      }
      return handler;
    };
    var buildWindowEventHandler = function(_j) {
      var reducerPath = _j.reducerPath, context = _j.context, api = _j.api, refetchQuery = _j.refetchQuery, internalState = _j.internalState;
      var removeQueryResult = api.internalActions.removeQueryResult;
      var handler = function(action, mwApi) {
        if (onFocus.match(action)) {
          refetchValidQueries(mwApi, "refetchOnFocus");
        }
        if (onOnline.match(action)) {
          refetchValidQueries(mwApi, "refetchOnReconnect");
        }
      };
      function refetchValidQueries(api2, type) {
        var state = api2.getState()[reducerPath];
        var queries = state.queries;
        var subscriptions = internalState.currentSubscriptions;
        context.batch(function() {
          for (var _j2 = 0, _k = Object.keys(subscriptions); _j2 < _k.length; _j2++) {
            var queryCacheKey = _k[_j2];
            var querySubState = queries[queryCacheKey];
            var subscriptionSubState = subscriptions[queryCacheKey];
            if (!subscriptionSubState || !querySubState)
              continue;
            var shouldRefetch = Object.values(subscriptionSubState).some(function(sub) {
              return sub[type] === true;
            }) || Object.values(subscriptionSubState).every(function(sub) {
              return sub[type] === void 0;
            }) && state.config[type];
            if (shouldRefetch) {
              if (Object.keys(subscriptionSubState).length === 0) {
                api2.dispatch(removeQueryResult({
                  queryCacheKey
                }));
              } else if (querySubState.status !== QueryStatus.uninitialized) {
                api2.dispatch(refetchQuery(querySubState, queryCacheKey));
              }
            }
          }
        });
      }
      return handler;
    };
    var import_toolkit11 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var neverResolvedError = new Error("Promise never resolved before cacheEntryRemoved.");
    var buildCacheLifecycleHandler = function(_j) {
      var api = _j.api, reducerPath = _j.reducerPath, context = _j.context, queryThunk = _j.queryThunk, mutationThunk = _j.mutationThunk, internalState = _j.internalState;
      var isQueryThunk = (0, import_toolkit11.isAsyncThunkAction)(queryThunk);
      var isMutationThunk = (0, import_toolkit11.isAsyncThunkAction)(mutationThunk);
      var isFulfilledThunk = (0, import_toolkit11.isFulfilled)(queryThunk, mutationThunk);
      var lifecycleMap = {};
      var handler = function(action, mwApi, stateBefore) {
        var cacheKey = getCacheKey(action);
        if (queryThunk.pending.match(action)) {
          var oldState = stateBefore[reducerPath].queries[cacheKey];
          var state = mwApi.getState()[reducerPath].queries[cacheKey];
          if (!oldState && state) {
            handleNewKey(action.meta.arg.endpointName, action.meta.arg.originalArgs, cacheKey, mwApi, action.meta.requestId);
          }
        } else if (mutationThunk.pending.match(action)) {
          var state = mwApi.getState()[reducerPath].mutations[cacheKey];
          if (state) {
            handleNewKey(action.meta.arg.endpointName, action.meta.arg.originalArgs, cacheKey, mwApi, action.meta.requestId);
          }
        } else if (isFulfilledThunk(action)) {
          var lifecycle = lifecycleMap[cacheKey];
          if (lifecycle == null ? void 0 : lifecycle.valueResolved) {
            lifecycle.valueResolved({
              data: action.payload,
              meta: action.meta.baseQueryMeta
            });
            delete lifecycle.valueResolved;
          }
        } else if (api.internalActions.removeQueryResult.match(action) || api.internalActions.removeMutationResult.match(action)) {
          var lifecycle = lifecycleMap[cacheKey];
          if (lifecycle) {
            delete lifecycleMap[cacheKey];
            lifecycle.cacheEntryRemoved();
          }
        } else if (api.util.resetApiState.match(action)) {
          for (var _j2 = 0, _k = Object.entries(lifecycleMap); _j2 < _k.length; _j2++) {
            var _l = _k[_j2], cacheKey2 = _l[0], lifecycle = _l[1];
            delete lifecycleMap[cacheKey2];
            lifecycle.cacheEntryRemoved();
          }
        }
      };
      function getCacheKey(action) {
        if (isQueryThunk(action))
          return action.meta.arg.queryCacheKey;
        if (isMutationThunk(action))
          return action.meta.requestId;
        if (api.internalActions.removeQueryResult.match(action))
          return action.payload.queryCacheKey;
        if (api.internalActions.removeMutationResult.match(action))
          return getMutationCacheKey(action.payload);
        return "";
      }
      function handleNewKey(endpointName, originalArgs, queryCacheKey, mwApi, requestId) {
        var endpointDefinition = context.endpointDefinitions[endpointName];
        var onCacheEntryAdded = endpointDefinition == null ? void 0 : endpointDefinition.onCacheEntryAdded;
        if (!onCacheEntryAdded)
          return;
        var lifecycle = {};
        var cacheEntryRemoved = new Promise(function(resolve) {
          lifecycle.cacheEntryRemoved = resolve;
        });
        var cacheDataLoaded = Promise.race([
          new Promise(function(resolve) {
            lifecycle.valueResolved = resolve;
          }),
          cacheEntryRemoved.then(function() {
            throw neverResolvedError;
          })
        ]);
        cacheDataLoaded.catch(function() {
        });
        lifecycleMap[queryCacheKey] = lifecycle;
        var selector = api.endpoints[endpointName].select(endpointDefinition.type === DefinitionType.query ? originalArgs : queryCacheKey);
        var extra = mwApi.dispatch(function(_, __, extra2) {
          return extra2;
        });
        var lifecycleApi = __spreadProps(__spreadValues({}, mwApi), {
          getCacheEntry: function() {
            return selector(mwApi.getState());
          },
          requestId,
          extra,
          updateCachedData: endpointDefinition.type === DefinitionType.query ? function(updateRecipe) {
            return mwApi.dispatch(api.util.updateQueryData(endpointName, originalArgs, updateRecipe));
          } : void 0,
          cacheDataLoaded,
          cacheEntryRemoved
        });
        var runningHandler = onCacheEntryAdded(originalArgs, lifecycleApi);
        Promise.resolve(runningHandler).catch(function(e) {
          if (e === neverResolvedError)
            return;
          throw e;
        });
      }
      return handler;
    };
    var import_toolkit12 = __toModule((init_redux_toolkit_esm(), __toCommonJS(redux_toolkit_esm_exports)));
    var buildQueryLifecycleHandler = function(_j) {
      var api = _j.api, context = _j.context, queryThunk = _j.queryThunk, mutationThunk = _j.mutationThunk;
      var isPendingThunk = (0, import_toolkit12.isPending)(queryThunk, mutationThunk);
      var isRejectedThunk = (0, import_toolkit12.isRejected)(queryThunk, mutationThunk);
      var isFullfilledThunk = (0, import_toolkit12.isFulfilled)(queryThunk, mutationThunk);
      var lifecycleMap = {};
      var handler = function(action, mwApi) {
        var _a, _b, _c;
        if (isPendingThunk(action)) {
          var _j2 = action.meta, requestId = _j2.requestId, _k = _j2.arg, endpointName_1 = _k.endpointName, originalArgs_1 = _k.originalArgs;
          var endpointDefinition = context.endpointDefinitions[endpointName_1];
          var onQueryStarted = endpointDefinition == null ? void 0 : endpointDefinition.onQueryStarted;
          if (onQueryStarted) {
            var lifecycle_1 = {};
            var queryFulfilled = new Promise(function(resolve, reject) {
              lifecycle_1.resolve = resolve;
              lifecycle_1.reject = reject;
            });
            queryFulfilled.catch(function() {
            });
            lifecycleMap[requestId] = lifecycle_1;
            var selector_1 = api.endpoints[endpointName_1].select(endpointDefinition.type === DefinitionType.query ? originalArgs_1 : requestId);
            var extra = mwApi.dispatch(function(_, __, extra2) {
              return extra2;
            });
            var lifecycleApi = __spreadProps(__spreadValues({}, mwApi), {
              getCacheEntry: function() {
                return selector_1(mwApi.getState());
              },
              requestId,
              extra,
              updateCachedData: endpointDefinition.type === DefinitionType.query ? function(updateRecipe) {
                return mwApi.dispatch(api.util.updateQueryData(endpointName_1, originalArgs_1, updateRecipe));
              } : void 0,
              queryFulfilled
            });
            onQueryStarted(originalArgs_1, lifecycleApi);
          }
        } else if (isFullfilledThunk(action)) {
          var _l = action.meta, requestId = _l.requestId, baseQueryMeta = _l.baseQueryMeta;
          (_a = lifecycleMap[requestId]) == null ? void 0 : _a.resolve({
            data: action.payload,
            meta: baseQueryMeta
          });
          delete lifecycleMap[requestId];
        } else if (isRejectedThunk(action)) {
          var _m = action.meta, requestId = _m.requestId, rejectedWithValue = _m.rejectedWithValue, baseQueryMeta = _m.baseQueryMeta;
          (_c = lifecycleMap[requestId]) == null ? void 0 : _c.reject({
            error: (_b = action.payload) != null ? _b : action.error,
            isUnhandledError: !rejectedWithValue,
            meta: baseQueryMeta
          });
          delete lifecycleMap[requestId];
        }
      };
      return handler;
    };
    var buildDevCheckHandler = function(_j) {
      var api = _j.api, apiUid = _j.context.apiUid, reducerPath = _j.reducerPath;
      return function(action, mwApi) {
        var _a, _b;
        if (api.util.resetApiState.match(action)) {
          mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
        }
        if (typeof process !== "undefined" && true) {
          if (api.internalActions.middlewareRegistered.match(action) && action.payload === apiUid && ((_b = (_a = mwApi.getState()[reducerPath]) == null ? void 0 : _a.config) == null ? void 0 : _b.middlewareRegistered) === "conflict") {
            console.warn('There is a mismatch between slice and middleware for the reducerPath "' + reducerPath + '".\nYou can only have one api per reducer path, this will lead to crashes in various situations!' + (reducerPath === "api" ? "\nIf you have multiple apis, you *have* to specify the reducerPath option when using createApi!" : ""));
          }
        }
      };
    };
    var import_immer4 = __toModule(require_dist());
    var promise;
    var queueMicrotaskShim = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : globalThis) : function(cb) {
      return (promise || (promise = Promise.resolve())).then(cb).catch(function(err) {
        return setTimeout(function() {
          throw err;
        }, 0);
      });
    };
    var buildBatchedActionsHandler = function(_j) {
      var api = _j.api, queryThunk = _j.queryThunk, internalState = _j.internalState;
      var subscriptionsPrefix = api.reducerPath + "/subscriptions";
      var previousSubscriptions = null;
      var dispatchQueued = false;
      var _k = api.internalActions, updateSubscriptionOptions = _k.updateSubscriptionOptions, unsubscribeQueryResult = _k.unsubscribeQueryResult;
      var actuallyMutateSubscriptions = function(mutableState, action) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        if (updateSubscriptionOptions.match(action)) {
          var _j2 = action.payload, queryCacheKey = _j2.queryCacheKey, requestId = _j2.requestId, options = _j2.options;
          if ((_a = mutableState == null ? void 0 : mutableState[queryCacheKey]) == null ? void 0 : _a[requestId]) {
            mutableState[queryCacheKey][requestId] = options;
          }
          return true;
        }
        if (unsubscribeQueryResult.match(action)) {
          var _k2 = action.payload, queryCacheKey = _k2.queryCacheKey, requestId = _k2.requestId;
          if (mutableState[queryCacheKey]) {
            delete mutableState[queryCacheKey][requestId];
          }
          return true;
        }
        if (api.internalActions.removeQueryResult.match(action)) {
          delete mutableState[action.payload.queryCacheKey];
          return true;
        }
        if (queryThunk.pending.match(action)) {
          var _l = action.meta, arg = _l.arg, requestId = _l.requestId;
          if (arg.subscribe) {
            var substate = (_c = mutableState[_b = arg.queryCacheKey]) != null ? _c : mutableState[_b] = {};
            substate[requestId] = (_e = (_d = arg.subscriptionOptions) != null ? _d : substate[requestId]) != null ? _e : {};
            return true;
          }
        }
        if (queryThunk.rejected.match(action)) {
          var _m = action.meta, condition = _m.condition, arg = _m.arg, requestId = _m.requestId;
          if (condition && arg.subscribe) {
            var substate = (_g = mutableState[_f = arg.queryCacheKey]) != null ? _g : mutableState[_f] = {};
            substate[requestId] = (_i = (_h = arg.subscriptionOptions) != null ? _h : substate[requestId]) != null ? _i : {};
            return true;
          }
        }
        return false;
      };
      return function(action, mwApi) {
        var _a, _b;
        if (!previousSubscriptions) {
          previousSubscriptions = JSON.parse(JSON.stringify(internalState.currentSubscriptions));
        }
        if (api.util.resetApiState.match(action)) {
          previousSubscriptions = internalState.currentSubscriptions = {};
          return [true, false];
        }
        if (api.internalActions.internal_probeSubscription.match(action)) {
          var _j2 = action.payload, queryCacheKey = _j2.queryCacheKey, requestId = _j2.requestId;
          var hasSubscription = !!((_a = internalState.currentSubscriptions[queryCacheKey]) == null ? void 0 : _a[requestId]);
          return [false, hasSubscription];
        }
        var didMutate = actuallyMutateSubscriptions(internalState.currentSubscriptions, action);
        if (didMutate) {
          if (!dispatchQueued) {
            queueMicrotaskShim(function() {
              var newSubscriptions = JSON.parse(JSON.stringify(internalState.currentSubscriptions));
              var _j3 = (0, import_immer4.produceWithPatches)(previousSubscriptions, function() {
                return newSubscriptions;
              }), patches = _j3[1];
              mwApi.next(api.internalActions.subscriptionsUpdated(patches));
              previousSubscriptions = newSubscriptions;
              dispatchQueued = false;
            });
            dispatchQueued = true;
          }
          var isSubscriptionSliceAction = !!((_b = action.type) == null ? void 0 : _b.startsWith(subscriptionsPrefix));
          var isAdditionalSubscriptionAction = queryThunk.rejected.match(action) && action.meta.condition && !!action.meta.arg.subscribe;
          var actionShouldContinue = !isSubscriptionSliceAction && !isAdditionalSubscriptionAction;
          return [actionShouldContinue, false];
        }
        return [true, false];
      };
    };
    function buildMiddleware(input) {
      var reducerPath = input.reducerPath, queryThunk = input.queryThunk, api = input.api, context = input.context;
      var apiUid = context.apiUid;
      var actions = {
        invalidateTags: (0, import_toolkit13.createAction)(reducerPath + "/invalidateTags")
      };
      var isThisApiSliceAction = function(action) {
        return !!action && typeof action.type === "string" && action.type.startsWith(reducerPath + "/");
      };
      var handlerBuilders = [
        buildDevCheckHandler,
        buildCacheCollectionHandler,
        buildInvalidationByTagsHandler,
        buildPollingHandler,
        buildCacheLifecycleHandler,
        buildQueryLifecycleHandler
      ];
      var middleware = function(mwApi) {
        var initialized2 = false;
        var internalState = {
          currentSubscriptions: {}
        };
        var builderArgs = __spreadProps(__spreadValues({}, input), {
          internalState,
          refetchQuery
        });
        var handlers = handlerBuilders.map(function(build) {
          return build(builderArgs);
        });
        var batchedActionsHandler = buildBatchedActionsHandler(builderArgs);
        var windowEventsHandler = buildWindowEventHandler(builderArgs);
        return function(next) {
          return function(action) {
            if (!initialized2) {
              initialized2 = true;
              mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
            }
            var mwApiWithNext = __spreadProps(__spreadValues({}, mwApi), { next });
            var stateBefore = mwApi.getState();
            var _j = batchedActionsHandler(action, mwApiWithNext, stateBefore), actionShouldContinue = _j[0], hasSubscription = _j[1];
            var res;
            if (actionShouldContinue) {
              res = next(action);
            } else {
              res = hasSubscription;
            }
            if (!!mwApi.getState()[reducerPath]) {
              windowEventsHandler(action, mwApiWithNext, stateBefore);
              if (isThisApiSliceAction(action) || context.hasRehydrationInfo(action)) {
                for (var _k = 0, handlers_1 = handlers; _k < handlers_1.length; _k++) {
                  var handler = handlers_1[_k];
                  handler(action, mwApiWithNext, stateBefore);
                }
              }
            }
            return res;
          };
        };
      };
      return { middleware, actions };
      function refetchQuery(querySubState, queryCacheKey, override) {
        if (override === void 0) {
          override = {};
        }
        return queryThunk(__spreadValues({
          type: "query",
          endpointName: querySubState.endpointName,
          originalArgs: querySubState.originalArgs,
          subscribe: false,
          forceRefetch: true,
          queryCacheKey
        }, override));
      }
    }
    function assertCast(v) {
    }
    function safeAssign(target) {
      var args = [];
      for (var _j = 1; _j < arguments.length; _j++) {
        args[_j - 1] = arguments[_j];
      }
      Object.assign.apply(Object, __spreadArray([target], args));
    }
    var import_immer5 = __toModule(require_dist());
    var coreModuleName = Symbol();
    var coreModule = function() {
      return {
        name: coreModuleName,
        init: function(api, _j, context) {
          var baseQuery = _j.baseQuery, tagTypes = _j.tagTypes, reducerPath = _j.reducerPath, serializeQueryArgs = _j.serializeQueryArgs, keepUnusedDataFor = _j.keepUnusedDataFor, refetchOnMountOrArgChange = _j.refetchOnMountOrArgChange, refetchOnFocus = _j.refetchOnFocus, refetchOnReconnect = _j.refetchOnReconnect;
          (0, import_immer5.enablePatches)();
          assertCast(serializeQueryArgs);
          var assertTagType = function(tag) {
            if (typeof process !== "undefined" && true) {
              if (!tagTypes.includes(tag.type)) {
                console.error("Tag type '" + tag.type + "' was used, but not specified in `tagTypes`!");
              }
            }
            return tag;
          };
          Object.assign(api, {
            reducerPath,
            endpoints: {},
            internalActions: {
              onOnline,
              onOffline,
              onFocus,
              onFocusLost
            },
            util: {}
          });
          var _k = buildThunks({
            baseQuery,
            reducerPath,
            context,
            api,
            serializeQueryArgs,
            assertTagType
          }), queryThunk = _k.queryThunk, mutationThunk = _k.mutationThunk, patchQueryData = _k.patchQueryData, updateQueryData = _k.updateQueryData, upsertQueryData = _k.upsertQueryData, prefetch = _k.prefetch, buildMatchThunkActions = _k.buildMatchThunkActions;
          var _l = buildSlice({
            context,
            queryThunk,
            mutationThunk,
            reducerPath,
            assertTagType,
            config: {
              refetchOnFocus,
              refetchOnReconnect,
              refetchOnMountOrArgChange,
              keepUnusedDataFor,
              reducerPath
            }
          }), reducer = _l.reducer, sliceActions = _l.actions;
          safeAssign(api.util, {
            patchQueryData,
            updateQueryData,
            upsertQueryData,
            prefetch,
            resetApiState: sliceActions.resetApiState
          });
          safeAssign(api.internalActions, sliceActions);
          var _m = buildMiddleware({
            reducerPath,
            context,
            queryThunk,
            mutationThunk,
            api,
            assertTagType
          }), middleware = _m.middleware, middlewareActions = _m.actions;
          safeAssign(api.util, middlewareActions);
          safeAssign(api, { reducer, middleware });
          var _o = buildSelectors({
            serializeQueryArgs,
            reducerPath
          }), buildQuerySelector = _o.buildQuerySelector, buildMutationSelector = _o.buildMutationSelector, selectInvalidatedBy = _o.selectInvalidatedBy;
          safeAssign(api.util, { selectInvalidatedBy });
          var _p = buildInitiate({
            queryThunk,
            mutationThunk,
            api,
            serializeQueryArgs,
            context
          }), buildInitiateQuery = _p.buildInitiateQuery, buildInitiateMutation = _p.buildInitiateMutation, getRunningMutationThunk = _p.getRunningMutationThunk, getRunningMutationsThunk = _p.getRunningMutationsThunk, getRunningQueriesThunk = _p.getRunningQueriesThunk, getRunningQueryThunk = _p.getRunningQueryThunk, getRunningOperationPromises = _p.getRunningOperationPromises, removalWarning = _p.removalWarning;
          safeAssign(api.util, {
            getRunningOperationPromises,
            getRunningOperationPromise: removalWarning,
            getRunningMutationThunk,
            getRunningMutationsThunk,
            getRunningQueryThunk,
            getRunningQueriesThunk
          });
          return {
            name: coreModuleName,
            injectEndpoint: function(endpointName, definition) {
              var _a, _b;
              var anyApi = api;
              (_b = (_a = anyApi.endpoints)[endpointName]) != null ? _b : _a[endpointName] = {};
              if (isQueryDefinition(definition)) {
                safeAssign(anyApi.endpoints[endpointName], {
                  name: endpointName,
                  select: buildQuerySelector(endpointName, definition),
                  initiate: buildInitiateQuery(endpointName, definition)
                }, buildMatchThunkActions(queryThunk, endpointName));
              } else if (isMutationDefinition(definition)) {
                safeAssign(anyApi.endpoints[endpointName], {
                  name: endpointName,
                  select: buildMutationSelector(),
                  initiate: buildInitiateMutation(endpointName)
                }, buildMatchThunkActions(mutationThunk, endpointName));
              }
            }
          };
        }
      };
    };
    var createApi = buildCreateApi(coreModule());
  }
});

// node_modules/@reduxjs/toolkit/dist/query/index.js
var require_query = __commonJS({
  "node_modules/@reduxjs/toolkit/dist/query/index.js"(exports, module) {
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_rtk_query_cjs_development();
    }
  }
});
export default require_query();
//# sourceMappingURL=@reduxjs_toolkit_dist_query.js.map
