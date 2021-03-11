/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarsClass = exports.MarsClass = function () {
	//========== 构造方法 ========== 
	function MarsClass(options) {
		_classCallCheck(this, MarsClass);

		// this.options = options;

		// 别名,但不建议使用。 
		this.addEventListener = this.on;
		this.removeEventListener = this.clearAllEventListeners = this.off;
		this.addOneTimeEventListener = this.once;
		this.fireEvent = this.fire;
		this.hasEventListeners = this.listens;
	}

	_createClass(MarsClass, [{
		key: 'destroy',
		value: function destroy() {
			//删除所有绑定的数据
			for (var i in this) {
				delete this[i];
			}
		}

		//========== 方法 ==========  

		/* @method on(type: String, fn: Function, context?: Object): this
  * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
  *
  * @alternative
  * @method on(eventMap: Object): this
  * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
  */

	}, {
		key: 'on',
		value: function on(types, fn, context) {

			// types can be a map of types/handlers
			if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
				for (var type in types) {
					// we don't process space-separated events here for performance;
					// it's a hot path since Layer uses the on(obj) syntax
					this._on(type, types[type], fn);
				}
			} else {
				// types can be a string of space-separated words
				types = splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._on(types[i], fn, context);
				}
			}

			return this;
		}

		/* @method off(type: String, fn?: Function, context?: Object): this
   * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
   *
   * @alternative
   * @method off(eventMap: Object): this
   * Removes a set of type/listener pairs.
   *
   * @alternative
   * @method off: this
   * Removes all listeners to all events on the object.
   */

	}, {
		key: 'off',
		value: function off(types, fn, context) {

			if (!types) {
				// clear all listeners if called without arguments
				delete this._events;
			} else if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
				for (var type in types) {
					this._off(type, types[type], fn);
				}
			} else {
				types = splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._off(types[i], fn, context);
				}
			}

			return this;
		}

		// attach listener (without syntactic sugar now)

	}, {
		key: '_on',
		value: function _on(type, fn, context) {
			this._events = this._events || {};

			/* get/init listeners for type */
			var typeListeners = this._events[type];
			if (!typeListeners) {
				typeListeners = [];
				this._events[type] = typeListeners;
			}

			if (context === this) {
				// Less memory footprint.
				context = undefined;
			}
			var newListener = { fn: fn, ctx: context },
			    listeners = typeListeners;

			// check if fn already there
			for (var i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i].fn === fn && listeners[i].ctx === context) {
					return;
				}
			}

			listeners.push(newListener);
		}
	}, {
		key: '_off',
		value: function _off(type, fn, context) {
			var listeners, i, len;

			if (!this._events) {
				return;
			}

			listeners = this._events[type];

			if (!listeners) {
				return;
			}

			if (!fn) {
				// Set all removed listeners to noop so they are not called if remove happens in fire
				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn = falseFn;
				}
				// clear all listeners for a type if function isn't specified
				delete this._events[type];
				return;
			}

			if (context === this) {
				context = undefined;
			}

			if (listeners) {

				// find fn and remove it
				for (i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					if (l.ctx !== context) {
						continue;
					}
					if (l.fn === fn) {

						// set the removed listener to noop so that's not called if remove happens in fire
						l.fn = falseFn;

						if (this._firingCount) {
							/* copy array in case events are being fired */
							this._events[type] = listeners = listeners.slice();
						}
						listeners.splice(i, 1);

						return;
					}
				}
			}
		}

		// @method fire(type: String, data?: Object, propagate?: Boolean): this
		// Fires an event of the specified type. You can optionally provide an data
		// object — the first argument of the listener function will contain its
		// properties. The event can optionally be propagated to event parents.

	}, {
		key: 'fire',
		value: function fire(type, data, propagate) {
			if (!this.listens(type, propagate)) {
				return this;
			}

			var event = extend({}, data, {
				type: type,
				target: this,
				sourceTarget: data && data.sourceTarget || this
			});

			if (this._events) {
				var listeners = this._events[type];

				if (listeners) {
					this._firingCount = this._firingCount + 1 || 1;
					for (var i = 0, len = listeners.length; i < len; i++) {
						var l = listeners[i];
						l.fn.call(l.ctx || this, event);
					}

					this._firingCount--;
				}
			}

			if (propagate) {
				// propagate the event to parents (set with addEventParent)
				this._propagateEvent(event);
			}

			return this;
		}

		// @method listens(type: String): Boolean
		// Returns `true` if a particular event type has any listeners attached to it.

	}, {
		key: 'listens',
		value: function listens(type, propagate) {
			var listeners = this._events && this._events[type];
			if (listeners && listeners.length) {
				return true;
			}

			if (propagate) {
				// also check parents for listeners if event propagates
				for (var id in this._eventParents) {
					if (this._eventParents[id].listens(type, propagate)) {
						return true;
					}
				}
			}
			return false;
		}

		// @method once(…): this
		// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.

	}, {
		key: 'once',
		value: function once(types, fn, context) {

			if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
				for (var type in types) {
					this.once(type, types[type], fn);
				}
				return this;
			}

			var handler = bind(function () {
				this.off(types, fn, context).off(types, handler, context);
			}, this);

			// add a listener that's executed once and removed after that
			return this.on(types, fn, context).on(types, handler, context);
		}

		// @method addEventParent(obj: Evented): this
		// Adds an event parent - an `Evented` that will receive propagated events

	}, {
		key: 'addEventParent',
		value: function addEventParent(obj) {
			this._eventParents = this._eventParents || {};
			this._eventParents[stamp(obj)] = obj;
			return this;
		}

		// @method removeEventParent(obj: Evented): this
		// Removes an event parent, so it will stop receiving propagated events

	}, {
		key: 'removeEventParent',
		value: function removeEventParent(obj) {
			if (this._eventParents) {
				delete this._eventParents[stamp(obj)];
			}
			return this;
		}
	}, {
		key: '_propagateEvent',
		value: function _propagateEvent(e) {
			for (var id in this._eventParents) {
				this._eventParents[id].fire(e.type, extend({
					layer: e.target,
					propagatedFrom: e.target
				}, e), true);
			}
		}
	}]);

	return MarsClass;
}();

//事件类型枚举[统一的定义，避免命名混乱]


var eventType = exports.eventType = {
	add: 'add',
	remove: 'remove', //移除对象
	delete: 'delete', //删除对象
	update: 'update',

	start: 'start',
	change: 'change',
	endItem: 'endItem', //多个数据异步分析时，完成其中一个时的回调事件
	end: 'end',
	stop: 'stop',

	loadBefore: 'loadBefore', //加载完成 未做任何其他处理前
	load: 'load', //加载完成，执行所有内部处理后
	error: 'error',

	click: 'click',
	clickMap: 'clickMap', //单击地图空白（未单击到矢量或模型数据）时
	mouseMove: 'mouseMove',
	mouseOver: 'mouseOver', //鼠标移入
	mouseOut: 'mouseOut', //鼠标移出


	//标绘事件
	drawStart: 'draw-start', //开始绘制
	drawMouseMove: 'draw-mouse-move', //正在移动鼠标中，绘制过程中鼠标移动了点
	drawAddPoint: 'draw-add-point', //绘制过程中增加了点
	drawRemovePoint: 'draw-remove-lastpoint', //绘制过程中删除了last点
	drawCreated: 'draw-created', //创建完成
	editStart: 'edit-start', //开始编辑
	editMouseDown: 'edit-mouse-movestart', //移动鼠标按下左键					  LEFT_DOWN
	editMouseMove: 'edit-mouse-move', //正在移动鼠标中，正在编辑拖拽修改点中	MOUSE_MOVE
	editMovePoint: 'edit-move-point', //编辑修改了点 						  LEFT_UP
	editRemovePoint: 'edit-remove-point', //编辑删除了点
	editStop: 'edit-stop', //停止编辑

	//3dtiles模型
	initialTilesLoaded: 'initialTilesLoaded',
	allTilesLoaded: 'allTilesLoaded',

	//瓦片底图
	loadTileStart: 'loadTileStart',
	loadTileEnd: 'loadTileEnd',
	loadTileError: 'loadTileError'

};

function extend(dest) {
	var i, j, len, src;

	for (j = 1, len = arguments.length; j < len; j++) {
		src = arguments[j];
		for (i in src) {
			dest[i] = src[i];
		}
	}
	return dest;
}

function trim(str) {
	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
function splitWords(str) {
	if (!str) {
		console.error("传入了空event事件名称，请检查代码");
		return str;
	}
	return trim(str).split(/\s+/);
}

function falseFn() {
	return false;
}

function bind(fn, obj) {
	var slice = Array.prototype.slice;

	if (fn.bind) {
		return fn.bind.apply(fn, slice.call(arguments, 1));
	}

	var args = slice.call(arguments, 2);

	return function () {
		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	};
}

// @property lastId: Number
// Last unique ID used by [`stamp()`](#util-stamp)
var lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
function stamp(obj) {
	obj._dc_id = obj._dc_id || ++lastId;
	return obj._dc_id;
}

/***/ }),
