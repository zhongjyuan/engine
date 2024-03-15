// <!--All source is here - https://github.com/DonSinDRom/Tactris-->
var _typeof =
	typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
		? function(obj) {
				return typeof obj;
		  }
		: function(obj) {
				return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		  };

!(function t(e, i, n) {
	function s(o, a) {
		if (!i[o]) {
			if (!e[o]) {
				var h = "function" == typeof require && require;
				if (!a && h) return h(o, !0);
				if (r) return r(o, !0);
				var u = new Error("Cannot find module '" + o + "'");
				throw ((u.code = "MODULE_NOT_FOUND"), u);
			}
			var c = (i[o] = { exports: {} });
			e[o][0].call(
				c.exports,
				function(t) {
					var i = e[o][1][t];
					return s(i ? i : t);
				},
				c,
				c.exports,
				t,
				e,
				i,
				n
			);
		}
		return i[o].exports;
	}
	for (var r = "function" == typeof require && require, o = 0; o < n.length; o++) {
		s(n[o]);
	}
	return s;
})(
	{
		1: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
					var e = t.getAlign();
					this._x.set(e[0]), this._y.set(e[1]), this._z.set(e[2]);
				}
				var s = t("./Position");
				(n.prototype.toString = function() {
					return "Align";
				}),
					(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.update = function() {
						this._node.setAlign(this._x.get(), this._y.get(), this._z.get()), this._checkUpdate();
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(e.exports = n);
			},
			{ "./Position": 7 },
		],
		2: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._node = t),
						(this._projectionType = n.ORTHOGRAPHIC_PROJECTION),
						(this._focalDepth = 0),
						(this._near = 0),
						(this._far = 0),
						(this._requestingUpdate = !1),
						(this._id = t.addComponent(this)),
						(this._viewTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])),
						(this._viewDirty = !1),
						(this._perspectiveDirty = !1),
						this.setFlat();
				}
				var s = t("../core/Commands");
				(n.FRUSTUM_PROJECTION = 0),
					(n.PINHOLE_PROJECTION = 1),
					(n.ORTHOGRAPHIC_PROJECTION = 2),
					(n.prototype.toString = function() {
						return "Camera";
					}),
					(n.prototype.getValue = function() {
						return {
							component: this.toString(),
							projectionType: this._projectionType,
							focalDepth: this._focalDepth,
							near: this._near,
							far: this._far,
						};
					}),
					(n.prototype.setValue = function(t) {
						return this.toString() === t.component ? (this.set(t.projectionType, t.focalDepth, t.near, t.far), !0) : !1;
					}),
					(n.prototype.set = function(t, e, i, n) {
						this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)),
							(this._projectionType = t),
							(this._focalDepth = e),
							(this._near = i),
							(this._far = n);
					}),
					(n.prototype.setDepth = function(t) {
						return (
							this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)),
							(this._perspectiveDirty = !0),
							(this._projectionType = n.PINHOLE_PROJECTION),
							(this._focalDepth = t),
							(this._near = 0),
							(this._far = 0),
							this
						);
					}),
					(n.prototype.setFrustum = function(t, e) {
						return (
							this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)),
							(this._perspectiveDirty = !0),
							(this._projectionType = n.FRUSTUM_PROJECTION),
							(this._focalDepth = 0),
							(this._near = t),
							(this._far = e),
							this
						);
					}),
					(n.prototype.setFlat = function() {
						return (
							this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)),
							(this._perspectiveDirty = !0),
							(this._projectionType = n.ORTHOGRAPHIC_PROJECTION),
							(this._focalDepth = 0),
							(this._near = 0),
							(this._far = 0),
							this
						);
					}),
					(n.prototype.onUpdate = function() {
						this._requestingUpdate = !1;
						var t = this._node.getLocation();
						if ((this._node.sendDrawCommand(s.WITH).sendDrawCommand(t), this._perspectiveDirty))
							switch (((this._perspectiveDirty = !1), this._projectionType)) {
								case n.FRUSTUM_PROJECTION:
									this._node.sendDrawCommand(s.FRUSTRUM_PROJECTION), this._node.sendDrawCommand(this._near), this._node.sendDrawCommand(this._far);
									break;
								case n.PINHOLE_PROJECTION:
									this._node.sendDrawCommand(s.PINHOLE_PROJECTION), this._node.sendDrawCommand(this._focalDepth);
									break;
								case n.ORTHOGRAPHIC_PROJECTION:
									this._node.sendDrawCommand(s.ORTHOGRAPHIC_PROJECTION);
							}
						this._viewDirty &&
							((this._viewDirty = !1),
							this._node.sendDrawCommand(s.CHANGE_VIEW_TRANSFORM),
							this._node.sendDrawCommand(this._viewTransform[0]),
							this._node.sendDrawCommand(this._viewTransform[1]),
							this._node.sendDrawCommand(this._viewTransform[2]),
							this._node.sendDrawCommand(this._viewTransform[3]),
							this._node.sendDrawCommand(this._viewTransform[4]),
							this._node.sendDrawCommand(this._viewTransform[5]),
							this._node.sendDrawCommand(this._viewTransform[6]),
							this._node.sendDrawCommand(this._viewTransform[7]),
							this._node.sendDrawCommand(this._viewTransform[8]),
							this._node.sendDrawCommand(this._viewTransform[9]),
							this._node.sendDrawCommand(this._viewTransform[10]),
							this._node.sendDrawCommand(this._viewTransform[11]),
							this._node.sendDrawCommand(this._viewTransform[12]),
							this._node.sendDrawCommand(this._viewTransform[13]),
							this._node.sendDrawCommand(this._viewTransform[14]),
							this._node.sendDrawCommand(this._viewTransform[15]));
					}),
					(n.prototype.onTransformChange = function(t) {
						var e = t;
						(this._viewDirty = !0), this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
						var i = e[0],
							n = e[1],
							s = e[2],
							r = e[3],
							o = e[4],
							a = e[5],
							h = e[6],
							u = e[7],
							c = e[8],
							l = e[9],
							p = e[10],
							d = e[11],
							f = e[12],
							m = e[13],
							g = e[14],
							_ = e[15],
							y = i * a - n * o,
							v = i * h - s * o,
							T = i * u - r * o,
							b = n * h - s * a,
							E = n * u - r * a,
							O = s * u - r * h,
							w = c * m - l * f,
							x = c * g - p * f,
							I = c * _ - d * f,
							C = l * g - p * m,
							S = l * _ - d * m,
							R = p * _ - d * g,
							A = 1 / (y * R - v * S + T * C + b * I - E * x + O * w);
						(this._viewTransform[0] = (a * R - h * S + u * C) * A),
							(this._viewTransform[1] = (s * S - n * R - r * C) * A),
							(this._viewTransform[2] = (m * O - g * E + _ * b) * A),
							(this._viewTransform[3] = (p * E - l * O - d * b) * A),
							(this._viewTransform[4] = (h * I - o * R - u * x) * A),
							(this._viewTransform[5] = (i * R - s * I + r * x) * A),
							(this._viewTransform[6] = (g * T - f * O - _ * v) * A),
							(this._viewTransform[7] = (c * O - p * T + d * v) * A),
							(this._viewTransform[8] = (o * S - a * I + u * w) * A),
							(this._viewTransform[9] = (n * I - i * S - r * w) * A),
							(this._viewTransform[10] = (f * E - m * T + _ * y) * A),
							(this._viewTransform[11] = (l * T - c * E - d * y) * A),
							(this._viewTransform[12] = (a * x - o * C - h * w) * A),
							(this._viewTransform[13] = (i * C - n * x + s * w) * A),
							(this._viewTransform[14] = (m * v - f * b - g * y) * A),
							(this._viewTransform[15] = (c * b - l * v + p * y) * A);
					}),
					(e.exports = n);
			},
			{ "../core/Commands": 15 },
		],
		3: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					(this.node = t),
						(this.id = t.addComponent(this)),
						(this._events = new h()),
						(this.last1 = new u()),
						(this.last2 = new u()),
						(this.delta1 = new u()),
						(this.delta2 = new u()),
						(this.velocity1 = new u()),
						(this.velocity2 = new u()),
						(this.dist = 0),
						(this.diff12 = new u()),
						(this.center = new u()),
						(this.centerDelta = new u()),
						(this.centerVelocity = new u()),
						(this.pointer1 = { position: this.last1, delta: this.delta1, velocity: this.velocity1 }),
						(this.pointer2 = { position: this.last2, delta: this.delta2, velocity: this.velocity2 }),
						(this.event = {
							status: null,
							time: 0,
							pointers: [],
							center: this.center,
							centerDelta: this.centerDelta,
							centerVelocity: this.centerVelocity,
							points: 0,
							current: 0,
						}),
						(this.trackedPointerIDs = [-1, -1]),
						(this.timeOfPointer = 0),
						(this.multiTap = 0),
						(this.mice = []),
						(this.gestures = []),
						(this.options = {}),
						(this.trackedGestures = {});
					var i, n;
					if (e)
						for (i = 0, n = e.length; n > i; i++) {
							this.on(e[i], e[i].callback);
						}
					t.addUIEvent("touchstart"),
						t.addUIEvent("mousedown"),
						t.addUIEvent("touchmove"),
						t.addUIEvent("mousemove"),
						t.addUIEvent("touchend"),
						t.addUIEvent("mouseup"),
						t.addUIEvent("mouseleave");
				}
				function s(t) {
					var e;
					if (
						(t.targetTouches ? (e = t.targetTouches) : ((this.mice[0] = t), (e = this.mice), (t.identifier = 1)),
						!e[0] || !e[1] || this.trackedPointerIDs[0] !== e[0].identifier || this.trackedPointerIDs[1] !== e[1].identifier)
					) {
						this.event.time = Date.now();
						var i, n;
						this.trackedPointerIDs[0] !== e[0].identifier &&
							(this.trackedGestures.tap &&
								((i = (this.options.tap && this.options.tap.threshold) || 250),
								this.event.time - this.timeOfPointer < i ? this.event.taps++ : (this.event.taps = 1),
								(this.timeOfPointer = this.event.time),
								(this.multiTap = 1)),
							(this.event.current = 1),
							(this.event.points = 1),
							(n = e[0].identifier),
							(this.trackedPointerIDs[0] = n),
							this.last1.set(e[0].pageX, e[0].pageY),
							this.velocity1.clear(),
							this.delta1.clear(),
							this.event.pointers.push(this.pointer1)),
							e[1] &&
								this.trackedPointerIDs[1] !== e[1].identifier &&
								(this.trackedGestures.tap &&
									((i = (this.options.tap && this.options.tap.threshold) || 250), this.event.time - this.timeOfPointer < i && (this.multiTap = 2)),
								(this.event.current = 2),
								(this.event.points = 2),
								(n = e[1].identifier),
								(this.trackedPointerIDs[1] = n),
								this.last2.set(e[1].pageX, e[1].pageY),
								this.velocity2.clear(),
								this.delta2.clear(),
								u.add(this.last1, this.last2, this.center).scale(0.5),
								this.centerDelta.clear(),
								this.centerVelocity.clear(),
								u.subtract(this.last2, this.last1, this.diff12),
								(this.dist = this.diff12.length()),
								this.trackedGestures.pinch &&
									((this.event.scale = this.event.scale || 1), (this.event.scaleDelta = 0), (this.event.scaleVelocity = 0)),
								this.trackedGestures.rotate &&
									((this.event.rotation = this.event.rotation || 0), (this.event.rotationDelta = 0), (this.event.rotationVelocity = 0)),
								this.event.pointers.push(this.pointer2)),
							(this.event.status = "start"),
							1 === this.event.points &&
								(this.center.copy(this.last1),
								this.centerDelta.clear(),
								this.centerVelocity.clear(),
								this.trackedGestures.pinch && ((this.event.scale = 1), (this.event.scaleDelta = 0), (this.event.scaleVelocity = 0)),
								this.trackedGestures.rotate && ((this.event.rotation = 0), (this.event.rotationDelta = 0), (this.event.rotationVelocity = 0))),
							this.triggerGestures();
					}
				}
				function r(t) {
					var e;
					if (t.targetTouches) e = t.targetTouches;
					else {
						if (!this.event.current) return;
						(this.mice[0] = t), (e = this.mice), (t.identifier = 1);
					}
					var i = Date.now(),
						n = i - this.event.time;
					if (0 !== n) {
						var s = 1e3 / n;
						if (
							((this.event.time = i),
							(this.event.current = 1),
							(this.event.points = 1),
							this.trackedPointerIDs[0] === e[0].identifier &&
								(c.set(e[0].pageX, e[0].pageY), u.subtract(c, this.last1, this.delta1), u.scale(this.delta1, s, this.velocity1), this.last1.copy(c)),
							e[1])
						) {
							if (
								((this.event.current = 2),
								(this.event.points = 2),
								c.set(e[1].pageX, e[1].pageY),
								u.subtract(c, this.last2, this.delta2),
								u.scale(this.delta2, s, this.velocity2),
								this.last2.copy(c),
								u.add(this.last1, this.last2, c).scale(0.5),
								u.subtract(c, this.center, this.centerDelta),
								u.add(this.velocity1, this.velocity2, this.centerVelocity).scale(0.5),
								this.center.copy(c),
								u.subtract(this.last2, this.last1, c),
								this.trackedGestures.rotate)
							) {
								var r = c.dot(this.diff12),
									o = c.cross(this.diff12),
									a = -Math.atan2(o, r);
								(this.event.rotation += a), (this.event.rotationDelta = a), (this.event.rotationVelocity = a * s);
							}
							var h = c.length(),
								l = h / this.dist;
							this.diff12.copy(c),
								(this.dist = h),
								this.trackedGestures.pinch && ((this.event.scale *= l), (l -= 1), (this.event.scaleDelta = l), (this.event.scaleVelocity = l * s));
						}
						(this.event.status = "move"),
							1 === this.event.points &&
								(this.center.copy(this.last1),
								this.centerDelta.copy(this.delta1),
								this.centerVelocity.copy(this.velocity1),
								this.trackedGestures.pinch && ((this.event.scale = 1), (this.event.scaleDelta = 0), (this.event.scaleVelocity = 0)),
								this.trackedGestures.rotate && ((this.event.rotation = 0), (this.event.rotationDelta = 0), (this.event.rotationVelocity = 0))),
							this.triggerGestures();
					}
				}
				function o(t) {
					var e;
					if (t.targetTouches) e = t.targetTouches;
					else {
						if (!this.event.current) return;
						this.mice.pop(), (e = this.mice);
					}
					if (!e[0] || !e[1] || this.trackedPointerIDs[0] !== e[0].identifier || this.trackedPointerIDs[1] !== e[1].identifier) {
						var i;
						if (((this.event.status = "end"), !e[0]))
							return (
								(this.event.current = 0),
								(this.trackedPointerIDs[0] = -1),
								(this.trackedPointerIDs[1] = -1),
								this.triggerGestures(),
								this.event.pointers.pop(),
								void this.event.pointers.pop()
							);
						this.trackedPointerIDs[0] !== e[0].identifier &&
							((this.trackedPointerIDs[0] = -1),
							(i = e[0].identifier),
							(this.trackedPointerIDs[0] = i),
							this.last1.set(e[0].pageX, e[0].pageY),
							this.velocity1.clear(),
							this.delta1.clear()),
							e[1]
								? this.trackedPointerIDs[1] !== e[1].identifier &&
								  ((this.trackedPointerIDs[1] = -1),
								  (this.event.points = 2),
								  (i = e[1].identifier),
								  (this.trackedPointerIDs[1] = i),
								  this.last2.set(e[1].pageX, e[1].pageY),
								  this.velocity2.clear(),
								  this.delta2.clear(),
								  u.add(this.last1, this.last2, this.center).scale(0.5),
								  this.centerDelta.clear(),
								  this.centerVelocity.clear(),
								  u.subtract(this.last2, this.last1, this.diff12),
								  (this.dist = this.diff12.length()))
								: ((this.event.current = 1),
								  (this.trackedPointerIDs[1] = -1),
								  this.triggerGestures(),
								  (this.event.points = 1),
								  this.event.pointers.pop());
					}
				}
				function a() {
					this.event.current &&
						((this.event.status = "end"),
						(this.event.current = 0),
						(this.trackedPointerIDs[0] = -1),
						this.triggerGestures(),
						this.event.pointers.pop());
				}
				var h = t("../utilities/CallbackStore"),
					u = t("../math/Vec2"),
					c = new u(),
					l = { drag: !0, tap: !0, rotate: !0, pinch: !0 };
				(n.prototype.onReceive = function(t, e) {
					switch (t) {
						case "touchstart":
						case "mousedown":
							s.call(this, e);
							break;
						case "touchmove":
						case "mousemove":
							r.call(this, e);
							break;
						case "touchend":
						case "mouseup":
							o.call(this, e);
							break;
						case "mouseleave":
							a.call(this, e);
					}
				}),
					(n.prototype.toString = function() {
						return "GestureHandler";
					}),
					(n.prototype.on = function(t, e) {
						var i = t.event || t;
						l[i] && ((this.trackedGestures[i] = !0), this.gestures.push(i), t.event && (this.options[i] = t), this._events.on(i, e));
					}),
					(n.prototype.triggerGestures = function() {
						for (var t = this.event, e = 0, i = this.gestures.length; i > e; e++) {
							var n = this.gestures[e];
							switch (n) {
								case "rotate":
								case "pinch":
									2 === t.points && this.trigger(n, t);
									break;
								case "tap":
									if ("start" === t.status)
										if (this.options.tap) {
											var s = this.options.tap.points || 1;
											this.multiTap >= s && t.points >= s && this.trigger(n, t);
										} else this.trigger(n, t);
									break;
								default:
									this.trigger(n, t);
							}
						}
					}),
					(n.prototype.trigger = function(t, e) {
						this._events.trigger(t, e);
					}),
					(e.exports = n);
			},
			{ "../math/Vec2": 49, "../utilities/CallbackStore": 94 },
		],
		4: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
					var e = t.getMountPoint();
					this._x.set(e[0]), this._y.set(e[1]), this._z.set(e[2]);
				}
				var s = t("./Position");
				(n.prototype.toString = function() {
					return "MountPoint";
				}),
					(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.update = function() {
						this._node.setMountPoint(this._x.get(), this._y.get(), this._z.get()), this._checkUpdate();
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(e.exports = n);
			},
			{ "./Position": 7 },
		],
		5: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._node = t), (this._id = t.addComponent(this)), (this._value = new s(1)), (this._requestingUpdate = !1);
				}
				var s = t("../transitions/Transitionable");
				(n.prototype.toString = function() {
					return "Opacity";
				}),
					(n.prototype.getValue = function() {
						return { component: this.toString(), value: this._value.get() };
					}),
					(n.prototype.setValue = function(t) {
						return this.toString() === t.component ? (this.set(t.value), !0) : !1;
					}),
					(n.prototype.set = function(t, e, i) {
						return this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)), this._value.set(t, e, i), this;
					}),
					(n.prototype.get = function() {
						return this._value.get();
					}),
					(n.prototype.halt = function() {
						return this._value.halt(), this;
					}),
					(n.prototype.isActive = function() {
						return this._value.isActive();
					}),
					(n.prototype.update = function() {
						this._node.setOpacity(this._value.get()),
							this._value.isActive() ? this._node.requestUpdateOnNextTick(this._id) : (this._requestingUpdate = !1);
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(e.exports = n);
			},
			{ "../transitions/Transitionable": 92 },
		],
		6: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
					var e = t.getOrigin();
					this._x.set(e[0]), this._y.set(e[1]), this._z.set(e[2]);
				}
				var s = t("./Position");
				(n.prototype.toString = function() {
					return "Origin";
				}),
					(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.update = function() {
						this._node.setOrigin(this._x.get(), this._y.get(), this._z.get()), this._checkUpdate();
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(e.exports = n);
			},
			{ "./Position": 7 },
		],
		7: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._node = t), (this._id = t.addComponent(this)), (this._requestingUpdate = !1);
					var e = t.getPosition();
					(this._x = new s(e[0])), (this._y = new s(e[1])), (this._z = new s(e[2]));
				}
				var s = t("../transitions/Transitionable");
				(n.prototype.toString = function() {
					return "Position";
				}),
					(n.prototype.getValue = function() {
						return { component: this.toString(), x: this._x.get(), y: this._y.get(), z: this._z.get() };
					}),
					(n.prototype.setValue = function(t) {
						return this.toString() === t.component ? (this.set(t.x, t.y, t.z), !0) : !1;
					}),
					(n.prototype.getX = function() {
						return this._x.get();
					}),
					(n.prototype.getY = function() {
						return this._y.get();
					}),
					(n.prototype.getZ = function() {
						return this._z.get();
					}),
					(n.prototype.isActive = function() {
						return this._x.isActive() || this._y.isActive() || this._z.isActive();
					}),
					(n.prototype._checkUpdate = function() {
						this.isActive() ? this._node.requestUpdateOnNextTick(this._id) : (this._requestingUpdate = !1);
					}),
					(n.prototype.update = function() {
						this._node.setPosition(this._x.get(), this._y.get(), this._z.get()), this._checkUpdate();
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(n.prototype.setX = function(t, e, i) {
						return this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)), this._x.set(t, e, i), this;
					}),
					(n.prototype.setY = function(t, e, i) {
						return this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)), this._y.set(t, e, i), this;
					}),
					(n.prototype.setZ = function(t, e, i) {
						return this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)), this._z.set(t, e, i), this;
					}),
					(n.prototype.set = function(t, e, i, n, s) {
						this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
						var r, o, a;
						return (
							null != i ? (a = s) : null != e ? (o = s) : null != t && (r = s),
							null != t && this._x.set(t, n, r),
							null != e && this._y.set(e, n, o),
							null != i && this._z.set(i, n, a),
							this
						);
					}),
					(n.prototype.halt = function() {
						return this._x.halt(), this._y.halt(), this._z.halt(), this;
					}),
					(e.exports = n);
			},
			{ "../transitions/Transitionable": 92 },
		],
		8: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
					var e = t.getRotation(),
						i = e[0],
						n = e[1],
						r = e[2],
						o = e[3],
						a = i * i,
						h = n * n,
						u = r * r,
						c = 2 * (i * r + n * o);
					c = -1 > c ? -1 : c > 1 ? 1 : c;
					var l = Math.atan2(2 * (i * o - n * r), 1 - 2 * (a + h)),
						p = Math.asin(c),
						d = Math.atan2(2 * (r * o - i * n), 1 - 2 * (h + u));
					this._x.set(l), this._y.set(p), this._z.set(d);
				}
				var s = t("./Position");
				(n.prototype.toString = function() {
					return "Rotation";
				}),
					(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.update = function() {
						this._node.setRotation(this._x.get(), this._y.get(), this._z.get()), this._checkUpdate();
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(e.exports = n);
			},
			{ "./Position": 7 },
		],
		9: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t), this._x.set(1), this._y.set(1), this._z.set(1);
				}
				var s = t("./Position");
				(n.prototype.toString = function() {
					return "Scale";
				}),
					(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.update = function() {
						this._node.setScale(this._x.get(), this._y.get(), this._z.get()), this._checkUpdate();
					}),
					(n.prototype.onUpdate = n.prototype.update),
					(e.exports = n);
			},
			{ "./Position": 7 },
		],
		10: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._node = t), (this._id = t.addComponent(this)), (this._requestingUpdate = !1);
					var e = t.getProportionalSize(),
						i = t.getDifferentialSize(),
						n = t.getAbsoluteSize();
					(this._proportional = { x: new s(e[0]), y: new s(e[1]), z: new s(e[2]) }),
						(this._differential = { x: new s(i[0]), y: new s(i[1]), z: new s(i[2]) }),
						(this._absolute = { x: new s(n[0]), y: new s(n[1]), z: new s(n[2]) });
				}
				var s = t("../transitions/Transitionable"),
					r = t("../core/SizeSystem");
				(n.RELATIVE = 0),
					(n.ABSOLUTE = 1),
					(n.RENDER = 2),
					(n.DEFAULT = n.RELATIVE),
					(n.prototype.setMode = function(t, e, i) {
						return this._node.setSizeMode(t, e, i), this;
					}),
					(n.prototype.toString = function() {
						return "Size";
					}),
					(n.prototype.getValue = function() {
						return {
							sizeMode: r.get(this._node.getLocation()).getSizeMode(),
							absolute: { x: this._absolute.x.get(), y: this._absolute.y.get(), z: this._absolute.z.get() },
							differential: { x: this._differential.x.get(), y: this._differential.y.get(), z: this._differential.z.get() },
							proportional: { x: this._proportional.x.get(), y: this._proportional.y.get(), z: this._proportional.z.get() },
						};
					}),
					(n.prototype.setValue = function(t) {
						return (
							this.toString() === t.component &&
								(this.setMode.apply(this, t.sizeMode),
								t.absolute && this.setAbsolute(t.absolute.x, t.absolute.y, t.absolute.z),
								t.differential && this.setAbsolute(t.differential.x, t.differential.y, t.differential.z),
								t.proportional && this.setAbsolute(t.proportional.x, t.proportional.y, t.proportional.z)),
							!1
						);
					}),
					(n.prototype._isActive = function(t) {
						return t.x.isActive() || t.y.isActive() || t.z.isActive();
					}),
					(n.prototype.isActive = function() {
						return this._isActive(this._absolute) || this._isActive(this._proportional) || this._isActive(this._differential);
					}),
					(n.prototype.onUpdate = function() {
						var t = this._absolute;
						this._node.setAbsoluteSize(t.x.get(), t.y.get(), t.z.get());
						var e = this._proportional,
							i = this._differential;
						this._node.setProportionalSize(e.x.get(), e.y.get(), e.z.get()),
							this._node.setDifferentialSize(i.x.get(), i.y.get(), i.z.get()),
							this.isActive() ? this._node.requestUpdateOnNextTick(this._id) : (this._requestingUpdate = !1);
					}),
					(n.prototype.setAbsolute = function(t, e, i, n, s) {
						this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
						var r, o, a;
						null != i ? (a = s) : null != e ? (o = s) : null != t && (r = s);
						var h = this._absolute;
						null != t && h.x.set(t, n, r), null != e && h.y.set(e, n, o), null != i && h.z.set(i, n, a);
					}),
					(n.prototype.setProportional = function(t, e, i, n, s) {
						this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
						var r, o, a;
						null != i ? (a = s) : null != e ? (o = s) : null != t && (r = s);
						var h = this._proportional;
						return null != t && h.x.set(t, n, r), null != e && h.y.set(e, n, o), null != i && h.z.set(i, n, a), this;
					}),
					(n.prototype.setDifferential = function(t, e, i, n, s) {
						this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
						var r, o, a;
						null != i ? (a = s) : null != e ? (o = s) : null != t && (r = s);
						var h = this._differential;
						return null != t && h.x.set(t, n, r), null != e && h.y.set(e, n, o), null != i && h.z.set(i, n, a), this;
					}),
					(n.prototype.get = function() {
						return this._node.getSize();
					}),
					(n.prototype.halt = function() {
						return (
							this._proportional.x.halt(),
							this._proportional.y.halt(),
							this._proportional.z.halt(),
							this._differential.x.halt(),
							this._differential.y.halt(),
							this._differential.z.halt(),
							this._absolute.x.halt(),
							this._absolute.y.halt(),
							this._absolute.z.halt(),
							this
						);
					}),
					(e.exports = n);
			},
			{ "../core/SizeSystem": 24, "../transitions/Transitionable": 92 },
		],
		11: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i, n) {
					(this._transform = n),
						(this._dirty = !1),
						(this.x = new o(t)),
						(this.y = new o(e)),
						(this.z = new o(i)),
						(this._values = { x: t, y: e, z: i });
				}
				function s(t, e, i, n, s) {
					(this._transform = s), (this._dirty = !1), (this._t = new o([t, e, i, n]));
				}
				function r(t) {
					(this._node = t),
						(this._id = t.addComponent(this)),
						(this.origin = null),
						(this.mountPoint = null),
						(this.align = null),
						(this.scale = null),
						(this.position = null),
						(this.rotation = null),
						(this._dirty = !1);
				}
				var o = t("../transitions/Transitionable"),
					a = t("../math/Quaternion"),
					h = new a(),
					u = new a();
				(n.prototype.get = function() {
					return (this._values.x = this.x.get()), (this._values.y = this.y.get()), (this._values.z = this.z.get()), this._values;
				}),
					(n.prototype.set = function(t, e, i, n, s) {
						this._transform._dirty || (this._transform._node.requestUpdate(this._transform._id), (this._transform._dirty = !0)), (this._dirty = !0);
						var r = null,
							o = null,
							a = null;
						return (
							null != i ? (a = s) : null != e ? (o = s) : null != t && (r = s),
							null != t && this.x.set(t, n, r),
							null != e && this.y.set(e, n, o),
							null != i && this.z.set(i, n, a),
							this
						);
					}),
					(n.prototype.isActive = function() {
						return this.x.isActive() || this.y.isActive() || this.z.isActive();
					}),
					(n.prototype.pause = function() {
						return this.x.pause(), this.y.pause(), this.z.pause(), this;
					}),
					(n.prototype.resume = function() {
						return this.x.resume(), this.y.resume(), this.z.resume(), this;
					}),
					(n.prototype.halt = function() {
						return this.x.halt(), this.y.halt(), this.z.halt(), this;
					}),
					(s.prototype.get = function() {
						return this._t.get();
					}),
					(s.prototype.set = function(t, e, i, n, s, r) {
						this._transform._dirty || (this._transform._node.requestUpdate(this._transform._id), (this._transform._dirty = !0)),
							(this._dirty = !0),
							(s.method = "slerp"),
							this._t.set([t, e, i, n], s, r);
					}),
					(s.prototype.isActive = function() {
						return this._t.isActive();
					}),
					(s.prototype.pause = function() {
						return this._t.pause(), this;
					}),
					(s.prototype.resume = function() {
						return this._t.resume(), this;
					}),
					(s.prototype.halt = function() {
						return (this._dirty = !1), this._t.halt(), this;
					}),
					(r.prototype.toString = function() {
						return "Transform";
					}),
					(r.prototype.getValue = function() {
						return {
							component: this.toString(),
							origin: this.origin && this.origin.get(),
							mountPoint: this.mountPoint && this.mountPoint.get(),
							align: this.align && this.align.get(),
							scale: this.scale && this.scale.get(),
							position: this.position && this.position.get(),
							rotation: this.rotation && this.rotation.get(),
						};
					}),
					(r.prototype.setState = function(t) {
						return this.toString() === t.component
							? (t.origin && this.setOrigin(t.origin.x, t.origin.y, t.origin.z),
							  t.mountPoint && this.setMountPoint(t.mountPoint.x, t.mountPoint.y, t.mountPoint.z),
							  t.align && this.setAlign(t.align.x, t.align.y, t.align.z),
							  t.scale && this.setScale(t.scale.x, t.scale.y, t.scale.z),
							  t.position && this.setPosition(t.position.x, t.position.y, t.position.z),
							  t.rotation && this.setRotation(t.rotation.x, t.rotation.y, t.rotation.z, t.rotation.w),
							  !0)
							: !1;
					}),
					(r.prototype.setOrigin = function(t, e, i, s, r) {
						if (!this.origin) {
							var o = this._node.getOrigin();
							this.origin = new n(o[0], o[1], o[2], this);
						}
						return this.origin.set(t, e, i, s, r), this;
					}),
					(r.prototype.setMountPoint = function(t, e, i, s, r) {
						if (!this.mountPoint) {
							var o = this._node.getMountPoint();
							this.mountPoint = new n(o[0], o[1], o[2], this);
						}
						return this.mountPoint.set(t, e, i, s, r), this;
					}),
					(r.prototype.setAlign = function(t, e, i, s, r) {
						if (!this.align) {
							var o = this._node.getAlign();
							this.align = new n(o[0], o[1], o[2], this);
						}
						return this.align.set(t, e, i, s, r), this;
					}),
					(r.prototype.setScale = function(t, e, i, s, r) {
						if (!this.scale) {
							var o = this._node.getScale();
							this.scale = new n(o[0], o[1], o[2], this);
						}
						return this.scale.set(t, e, i, s, r), this;
					}),
					(r.prototype.setPosition = function(t, e, i, s, r) {
						if (!this.position) {
							var o = this._node.getPosition();
							this.position = new n(o[0], o[1], o[2], this);
						}
						return this.position.set(t, e, i, s, r), this;
					}),
					(r.prototype.translate = function(t, e, i, s, r) {
						if (!this.position) {
							var o = this._node.getPosition();
							this.position = new n(o[0], o[1], o[2], this);
						}
						var a = this.position,
							h = a.x._queue,
							u = a.y._queue,
							c = a.z._queue,
							l = null == t ? null : t + (h.length > 0 ? h[h.length - 5] : a.x._state),
							p = null == e ? null : e + (u.length > 0 ? u[u.length - 5] : a.y._state),
							d = null == i ? null : i + (c.length > 0 ? c[c.length - 5] : a.z._state);
						return this.position.set(l, p, d, s, r), this;
					}),
					(r.prototype.setRotation = function(t, e, i, n, r, o) {
						if (!this.rotation) {
							var a = this._node.getRotation();
							this.rotation = new s(a[0], a[1], a[2], a[3], this);
						}
						var u = h;
						return (
							"number" == typeof n ? u.set(n, t, e, i) : (u.fromEuler(t, e, i), (o = r), (r = n)), this.rotation.set(u.x, u.y, u.z, u.w, r, o), this
						);
					}),
					(r.prototype.rotate = function(t, e, i, n, r, o) {
						if (!this.rotation) {
							var a = this._node.getRotation();
							this.rotation = new s(a[0], a[1], a[2], a[3], this);
						}
						var c,
							l,
							p = this.rotation._t._queue,
							d = p.length;
						(l = 0 !== d ? p[d - 5] : this.rotation._t._state), (c = u.set(l[3], l[0], l[1], l[2]));
						var f = h;
						"number" == typeof n ? f.set(n, t, e, i) : (f.fromEuler(t, e, i), (o = r), (r = n));
						var m = c.multiply(f);
						return this.rotation.set(m.x, m.y, m.z, m.w, r, o), this;
					}),
					(r.prototype.clean = function() {
						var t,
							e = this._node,
							i = !1;
						if (
							((t = this.origin) && t._dirty && (e.setOrigin(t.x.get(), t.y.get(), t.z.get()), (t._dirty = t.isActive()), (i = i || t._dirty)),
							(t = this.mountPoint) && t._dirty && (e.setMountPoint(t.x.get(), t.y.get(), t.z.get()), (t._dirty = t.isActive()), (i = i || t._dirty)),
							(t = this.align) && t._dirty && (e.setAlign(t.x.get(), t.y.get(), t.z.get()), (t._dirty = t.isActive()), (i = i || t._dirty)),
							(t = this.scale) && t._dirty && (e.setScale(t.x.get(), t.y.get(), t.z.get()), (t._dirty = t.isActive()), (i = i || t._dirty)),
							(t = this.position) && t._dirty && (e.setPosition(t.x.get(), t.y.get(), t.z.get()), (t._dirty = t.isActive()), (i = i || t._dirty)),
							(t = this.rotation) && t._dirty)
						) {
							var n = t.get();
							e.setRotation(n[0], n[1], n[2], n[3]), (t._dirty = t.isActive()), (i = i || t._dirty);
						}
						i ? this._node.requestUpdateOnNextTick(this._id) : (this._dirty = !1);
					}),
					(r.prototype.onUpdate = r.prototype.clean),
					(e.exports = r);
			},
			{ "../math/Quaternion": 48, "../transitions/Transitionable": 92 },
		],
		12: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					Align: t("./Align"),
					Camera: t("./Camera"),
					GestureHandler: t("./GestureHandler"),
					MountPoint: t("./MountPoint"),
					Opacity: t("./Opacity"),
					Origin: t("./Origin"),
					Position: t("./Position"),
					Rotation: t("./Rotation"),
					Scale: t("./Scale"),
					Size: t("./Size"),
					Transform: t("./Transform"),
				};
			},
			{
				"./Align": 1,
				"./Camera": 2,
				"./GestureHandler": 3,
				"./MountPoint": 4,
				"./Opacity": 5,
				"./Origin": 6,
				"./Position": 7,
				"./Rotation": 8,
				"./Scale": 9,
				"./Size": 10,
				"./Transform": 11,
			},
		],
		13: [
			function(t, e, i) {
				"use strict";
				function n() {
					"undefined" != typeof self && self.window !== self && this._enterWorkerMode();
				}
				(n.prototype._enterWorkerMode = function() {
					this._workerMode = !0;
					var t = this;
					self.addEventListener("message", function(e) {
						t.onMessage(e.data);
					});
				}),
					(n.prototype.onMessage = null),
					(n.prototype.sendMessage = function(t) {
						this._workerMode ? self.postMessage(t) : this.onmessage(t);
					}),
					(n.prototype.onmessage = null),
					(n.prototype.postMessage = function(t) {
						return this.onMessage(t);
					}),
					(e.exports = n);
			},
			{},
		],
		14: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this._time = 0), (this._frame = 0), (this._timerQueue = []), (this._updatingIndex = 0), (this._scale = 1), (this._scaledTime = this._time);
				}
				(n.prototype.setScale = function(t) {
					return (this._scale = t), this;
				}),
					(n.prototype.getScale = function() {
						return this._scale;
					}),
					(n.prototype.step = function(t) {
						this._frame++, (this._scaledTime = this._scaledTime + (t - this._time) * this._scale), (this._time = t);
						for (var e = 0; e < this._timerQueue.length; e++) {
							this._timerQueue[e](this._scaledTime) && this._timerQueue.splice(e, 1);
						}
						return this;
					}),
					(n.prototype.now = function() {
						return this._scaledTime;
					}),
					(n.prototype.getTime = n.prototype.now),
					(n.prototype.getFrame = function() {
						return this._frame;
					}),
					(n.prototype.setTimeout = function(t, e) {
						var i = Array.prototype.slice.call(arguments, 2),
							n = this._time,
							s = function s(_s) {
								return _s - n >= e ? (t.apply(null, i), !0) : !1;
							};
						return this._timerQueue.push(s), s;
					}),
					(n.prototype.setInterval = function(t, e) {
						var i = Array.prototype.slice.call(arguments, 2),
							n = this._time,
							s = function s(_s2) {
								return _s2 - n >= e && (t.apply(null, i), (n = _s2)), !1;
							};
						return this._timerQueue.push(s), s;
					}),
					(n.prototype.clearTimer = function(t) {
						var e = this._timerQueue.indexOf(t);
						return -1 !== e && this._timerQueue.splice(e, 1), this;
					}),
					(e.exports = n);
			},
			{},
		],
		15: [
			function(t, e, i) {
				"use strict";
				var n = {
						INIT_DOM: 0,
						DOM_RENDER_SIZE: 1,
						CHANGE_TRANSFORM: 2,
						CHANGE_SIZE: 3,
						CHANGE_PROPERTY: 4,
						CHANGE_CONTENT: 5,
						CHANGE_ATTRIBUTE: 6,
						ADD_CLASS: 7,
						REMOVE_CLASS: 8,
						SUBSCRIBE: 9,
						GL_SET_DRAW_OPTIONS: 10,
						GL_AMBIENT_LIGHT: 11,
						GL_LIGHT_POSITION: 12,
						GL_LIGHT_COLOR: 13,
						MATERIAL_INPUT: 14,
						GL_SET_GEOMETRY: 15,
						GL_UNIFORMS: 16,
						GL_BUFFER_DATA: 17,
						GL_CUTOUT_STATE: 18,
						GL_MESH_VISIBILITY: 19,
						GL_REMOVE_MESH: 20,
						PINHOLE_PROJECTION: 21,
						ORTHOGRAPHIC_PROJECTION: 22,
						CHANGE_VIEW_TRANSFORM: 23,
						WITH: 24,
						FRAME: 25,
						ENGINE: 26,
						START: 27,
						STOP: 28,
						TIME: 29,
						TRIGGER: 30,
						NEED_SIZE_FOR: 31,
						DOM: 32,
						READY: 33,
						ALLOW_DEFAULT: 34,
						PREVENT_DEFAULT: 35,
						UNSUBSCRIBE: 36,
						prettyPrint: function prettyPrint(t, e, i) {
							var n;
							e = e ? e : 0;
							for (var r = { i: e, result: "" }, o = i ? i + e : t.length; r.i < o; r.i++) {
								if (((n = s[t[r.i]]), !n)) throw new Error("PARSE ERROR: no command registered for: " + t[r.i]);
								n(t, r);
							}
							return r.result;
						},
					},
					s = [];
				(s[n.INIT_DOM] = function(t, e) {
					e.result += e.i + ". INIT_DOM\n    tagName: " + t[++e.i] + "\n\n";
				}),
					(s[n.DOM_RENDER_SIZE] = function(t, e) {
						e.result += e.i + ". DOM_RENDER_SIZE\n    selector: " + t[++e.i] + "\n\n";
					}),
					(s[n.CHANGE_TRANSFORM] = function(t, e) {
						e.result += e.i + ". CHANGE_TRANSFORM\n    val: [";
						for (var i = 0; 16 > i; i++) {
							e.result += t[++e.i] + (15 > i ? ", " : "");
						}
						e.result += "]\n\n";
					}),
					(s[n.CHANGE_SIZE] = function(t, e) {
						e.result += e.i + ". CHANGE_SIZE\n    x: " + t[++e.i] + ", y: " + t[++e.i] + "\n\n";
					}),
					(s[n.CHANGE_PROPERTY] = function(t, e) {
						e.result += e.i + ". CHANGE_PROPERTY\n    key: " + t[++e.i] + ", value: " + t[++e.i] + "\n\n";
					}),
					(s[n.CHANGE_CONTENT] = function(t, e) {
						e.result += e.i + ". CHANGE_CONTENT\n    content: " + t[++e.i] + "\n\n";
					}),
					(s[n.CHANGE_ATTRIBUTE] = function(t, e) {
						e.result += e.i + ". CHANGE_ATTRIBUTE\n    key: " + t[++e.i] + ", value: " + t[++e.i] + "\n\n";
					}),
					(s[n.ADD_CLASS] = function(t, e) {
						e.result += e.i + ". ADD_CLASS\n    className: " + t[++e.i] + "\n\n";
					}),
					(s[n.REMOVE_CLASS] = function(t, e) {
						e.result += e.i + ". REMOVE_CLASS\n    className: " + t[++e.i] + "\n\n";
					}),
					(s[n.SUBSCRIBE] = function(t, e) {
						e.result += e.i + ". SUBSCRIBE\n    event: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_SET_DRAW_OPTIONS] = function(t, e) {
						e.result += e.i + ". GL_SET_DRAW_OPTIONS\n    options: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_AMBIENT_LIGHT] = function(t, e) {
						e.result += e.i + ". GL_AMBIENT_LIGHT\n    r: " + t[++e.i] + "g: " + t[++e.i] + "b: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_LIGHT_POSITION] = function(t, e) {
						e.result += e.i + ". GL_LIGHT_POSITION\n    x: " + t[++e.i] + "y: " + t[++e.i] + "z: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_LIGHT_COLOR] = function(t, e) {
						e.result += e.i + ". GL_LIGHT_COLOR\n    r: " + t[++e.i] + "g: " + t[++e.i] + "b: " + t[++e.i] + "\n\n";
					}),
					(s[n.MATERIAL_INPUT] = function(t, e) {
						e.result += e.i + ". MATERIAL_INPUT\n    key: " + t[++e.i] + ", value: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_SET_GEOMETRY] = function(t, e) {
						e.result += e.i + ". GL_SET_GEOMETRY\n   x: " + t[++e.i] + ", y: " + t[++e.i] + ", z: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_UNIFORMS] = function(t, e) {
						e.result += e.i + ". GL_UNIFORMS\n    key: " + t[++e.i] + ", value: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_BUFFER_DATA] = function(t, e) {
						e.result += e.i + ". GL_BUFFER_DATA\n    data: ";
						for (var i = 0; 5 > i; i++) {
							e.result += t[++e.i] + ", ";
						}
						e.result += "\n\n";
					}),
					(s[n.GL_CUTOUT_STATE] = function(t, e) {
						e.result += e.i + ". GL_CUTOUT_STATE\n    state: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_MESH_VISIBILITY] = function(t, e) {
						e.result += e.i + ". GL_MESH_VISIBILITY\n    visibility: " + t[++e.i] + "\n\n";
					}),
					(s[n.GL_REMOVE_MESH] = function(t, e) {
						e.result += e.i + ". GL_REMOVE_MESH\n\n";
					}),
					(s[n.PINHOLE_PROJECTION] = function(t, e) {
						e.result += e.i + ". PINHOLE_PROJECTION\n    depth: " + t[++e.i] + "\n\n";
					}),
					(s[n.ORTHOGRAPHIC_PROJECTION] = function(t, e) {
						e.result += e.i + ". ORTHOGRAPHIC_PROJECTION\n";
					}),
					(s[n.CHANGE_VIEW_TRANSFORM] = function(t, e) {
						e.result += e.i + ". CHANGE_VIEW_TRANSFORM\n   value: [";
						for (var i = 0; 16 > i; i++) {
							e.result += t[++e.i] + (15 > i ? ", " : "");
						}
						e.result += "]\n\n";
					}),
					(s[n.PREVENT_DEFAULT] = function(t, e) {
						e.result += e.i + ". PREVENT_DEFAULT\n    value: " + t[++e.i] + "\n\n";
					}),
					(s[n.ALLOW_DEFAULT] = function(t, e) {
						e.result += e.i + ". ALLOW_DEFAULT\n    value: " + t[++e.i] + "\n\n";
					}),
					(s[n.READY] = function(t, e) {
						e.result += e.i + ". READY\n\n";
					}),
					(s[n.WITH] = function(t, e) {
						e.result += e.i + ". **WITH**\n     path: " + t[++e.i] + "\n\n";
					}),
					(s[n.TIME] = function(t, e) {
						e.result += e.i + ". TIME\n     ms: " + t[++e.i] + "\n\n";
					}),
					(s[n.NEED_SIZE_FOR] = function(t, e) {
						e.result += e.i + ". NEED_SIZE_FOR\n    selector: " + t[++e.i] + "\n\n";
					}),
					(e.exports = n);
			},
			{},
		],
		16: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this._nodes = {}), (this._queue = []);
				}
				function s(t, e) {
					e.length = 0;
					var i,
						n = 0,
						s = t.length;
					for (i = 0; s > i; i++) {
						"/" === t[i] && (e.push(t.substring(n, i)), (n = i + 1));
					}
					return i - n > 0 && e.push(t.substring(n, i)), e;
				}
				var r = t("./Event"),
					o = t("./Path");
				(n.prototype._setUpdater = function(t) {
					this._updater = t;
					for (var e in this._nodes) {
						this._nodes[e]._setUpdater(t);
					}
				}),
					(n.prototype.addChildrenToQueue = function(t) {
						for (var e, i = t.getChildren(), n = 0, s = i.length; s > n; n++) {
							(e = i[n]), e && this._queue.push(e);
						}
					}),
					(n.prototype.next = function() {
						return this._queue.shift();
					}),
					(n.prototype.breadthFirstNext = function() {
						var t = this._queue.shift();
						return t ? (this.addChildrenToQueue(t), t) : void 0;
					}),
					(n.prototype.mount = function(t, e) {
						if (!e) throw new Error("Dispatch: no node passed to mount at: " + t);
						if (this._nodes[t]) throw new Error("Dispatch: there is a node already registered at: " + t);
						e._setUpdater(this._updater), (this._nodes[t] = e);
						var i = o.parent(t),
							n = i ? this._nodes[i] : e;
						if (!n) throw new Error("Parent to path: " + t + " doesn't exist at expected path: " + i);
						var s,
							r,
							a = e.getChildren(),
							h = e.getComponents();
						if ((n.isMounted() && e._setMounted(!0, t), n.isShown() && e._setShown(!0), n.isMounted())) {
							for (e._setParent(n), e.onMount && e.onMount(t), s = 0, r = h.length; r > s; s++) {
								h[s] && h[s].onMount && h[s].onMount(e, s);
							}
							for (s = 0, r = a.length; r > s; s++) {
								a[s] && a[s].mount ? a[s].mount(t + "/" + s) : a[s] && this.mount(t + "/" + s, a[s]);
							}
						}
						if (n.isShown())
							for (e.onShow && e.onShow(), s = 0, r = h.length; r > s; s++) {
								h[s] && h[s].onShow && h[s].onShow();
							}
					}),
					(n.prototype.dismount = function(t) {
						var e = this._nodes[t];
						if (!e) throw new Error("No node registered to path: " + t);
						var i,
							n,
							s = e.getChildren(),
							r = e.getComponents();
						if (e.isShown())
							for (e._setShown(!1), e.onHide && e.onHide(), i = 0, n = r.length; n > i; i++) {
								r[i] && r[i].onHide && r[i].onHide();
							}
						if (e.isMounted()) {
							for (e.onDismount && e.onDismount(t), i = 0, n = s.length; n > i; i++) {
								s[i] && s[i].dismount ? s[i].dismount() : s[i] && this.dismount(t + "/" + i);
							}
							for (i = 0, n = r.length; n > i; i++) {
								r[i] && r[i].onDismount && r[i].onDismount();
							}
							e._setMounted(!1), e._setParent(null);
						}
						this._nodes[t] = null;
					}),
					(n.prototype.getNode = function(t) {
						return this._nodes[t];
					}),
					(n.prototype.show = function(t) {
						var e = this._nodes[t];
						if (!e) throw new Error("No node registered to path: " + t);
						e.onShow && e.onShow();
						for (var i = e.getComponents(), n = 0, s = i.length; s > n; n++) {
							i[n] && i[n].onShow && i[n].onShow();
						}
						this.addChildrenToQueue(e);
						for (var r; (r = this.breadthFirstNext()); ) {
							this.show(r.getLocation());
						}
					}),
					(n.prototype.hide = function(t) {
						var e = this._nodes[t];
						if (!e) throw new Error("No node registered to path: " + t);
						e.onHide && e.onHide();
						for (var i = e.getComponents(), n = 0, s = i.length; s > n; n++) {
							i[n] && i[n].onHide && i[n].onHide();
						}
						this.addChildrenToQueue(e);
						for (var r; (r = this.breadthFirstNext()); ) {
							this.hide(r.getLocation());
						}
					}),
					(n.prototype.lookupNode = function(t) {
						if (!t) throw new Error("lookupNode must be called with a path");
						this._queue.length = 0;
						var e = this._queue;
						s(t, e);
						for (var i = 0, n = e.length; n > i; i++) {
							e[i] = this._nodes[e[i]];
						}
						return e[e.length - 1];
					}),
					(n.prototype.dispatch = function(t, e, i) {
						if (!t) throw new Error("dispatch requires a path as it's first argument");
						if (!e) throw new Error("dispatch requires an event name as it's second argument");
						var n = this._nodes[t];
						if (n) {
							this.addChildrenToQueue(n);
							for (var s; (s = this.breadthFirstNext()); ) {
								s && s.onReceive && s.onReceive(e, i);
							}
						}
					}),
					(n.prototype.dispatchUIEvent = function(t, e, i) {
						if (!t) throw new Error("dispatchUIEvent needs a valid path to dispatch to");
						if (!e) throw new Error("dispatchUIEvent needs an event name as its second argument");
						var n;
						if ((r.call(i), (n = this.getNode(t)))) {
							var s, o, a, h;
							for (i.node = n; n; ) {
								for (n.onReceive && n.onReceive(e, i), o = n.getComponents(), a = 0, h = o.length; h > a; a++) {
									o[a] && o[a].onReceive && o[a].onReceive(e, i);
								}
								if (i.propagationStopped) break;
								if (((s = n.getParent()), s === n)) return;
								n = s;
							}
						}
					}),
					(e.exports = new n());
			},
			{ "./Event": 17, "./Path": 20 },
		],
		17: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this.propagationStopped = !1), (this.stopPropagation = s);
				}
				function s() {
					this.propagationStopped = !0;
				}
				e.exports = n;
			},
			{},
		],
		18: [
			function(t, e, i) {
				"use strict";
				function n() {
					var t = this;
					a._setUpdater(this),
						(this._updateQueue = []),
						(this._nextUpdateQueue = []),
						(this._scenes = {}),
						(this._messages = g),
						(this._inUpdate = !1),
						(this._clock = new s()),
						(this._channel = new o()),
						(this._channel.onMessage = function(e) {
							t.handleMessage(e);
						});
				}
				var s = t("./Clock"),
					r = t("./Scene"),
					o = t("./Channel"),
					a = t("./Dispatch"),
					h = t("../renderers/UIManager"),
					u = t("../renderers/Compositor"),
					c = t("../render-loops/RequestAnimationFrameLoop"),
					l = t("./TransformSystem"),
					p = t("./SizeSystem"),
					d = t("./Commands"),
					f = [d.ENGINE, d.START],
					m = [d.ENGINE, d.STOP],
					g = [d.TIME, null];
				(n.prototype.init = function(t) {
					if ("undefined" == typeof window)
						throw new Error(
							"FamousEngine#init needs to have access to the global window object. Instantiate Compositor and UIManager manually in the UI thread."
						);
					return (
						(this.compositor = (t && t.compositor) || new u()),
						(this.renderLoop = (t && t.renderLoop) || new c()),
						(this.uiManager = new h(this.getChannel(), this.compositor, this.renderLoop)),
						this
					);
				}),
					(n.prototype.setChannel = function(t) {
						return (this._channel = t), this;
					}),
					(n.prototype.getChannel = function() {
						return this._channel;
					}),
					(n.prototype._update = function() {
						this._inUpdate = !0;
						var t,
							e = this._clock.now(),
							i = this._nextUpdateQueue,
							n = this._updateQueue;
						for (this._messages[1] = e, p.update(), l.update(); i.length; ) {
							n.unshift(i.pop());
						}
						for (; n.length; ) {
							(t = n.shift()), t && t.update && t.update(e), t && t.onUpdate && t.onUpdate(e);
						}
						this._inUpdate = !1;
					}),
					(n.prototype.requestUpdate = function(t) {
						if (!t) throw new Error("requestUpdate must be called with a class to be updated");
						this._inUpdate ? this.requestUpdateOnNextTick(t) : this._updateQueue.push(t);
					}),
					(n.prototype.requestUpdateOnNextTick = function(t) {
						this._nextUpdateQueue.push(t);
					}),
					(n.prototype.handleMessage = function(t) {
						if (!t) throw new Error("onMessage must be called with an array of messages");
						for (var e; t.length > 0; ) {
							switch ((e = t.shift())) {
								case d.WITH:
									this.handleWith(t);
									break;
								case d.FRAME:
									this.handleFrame(t);
									break;
								default:
									throw new Error("received unknown command: " + e);
							}
						}
						return this;
					}),
					(n.prototype.handleWith = function(t) {
						var e = t.shift(),
							i = t.shift();
						switch (i) {
							case d.TRIGGER:
								var n = t.shift(),
									s = t.shift();
								a.dispatchUIEvent(e, n, s);
								break;
							default:
								throw new Error("received unknown command: " + i);
						}
						return this;
					}),
					(n.prototype.handleFrame = function(t) {
						if (!t) throw new Error("handleFrame must be called with an array of messages");
						if (!t.length) throw new Error("FRAME must be sent with a time");
						return this.step(t.shift()), this;
					}),
					(n.prototype.step = function(t) {
						if (null == t) throw new Error("step must be called with a time");
						if ((this._clock.step(t), this._update(), this._messages.length))
							for (this._channel.sendMessage(this._messages); this._messages.length > 2; ) {
								this._messages.pop();
							}
						return this;
					}),
					(n.prototype.getContext = function(t) {
						if (!t) throw new Error("getContext must be called with a selector");
						var e = t.indexOf("/");
						return (t = -1 === e ? t : t.substring(0, e)), this._scenes[t];
					}),
					(n.prototype.getClock = function() {
						return this._clock;
					}),
					(n.prototype.message = function(t) {
						return this._messages.push(t), this;
					}),
					(n.prototype.createScene = function(t) {
						return (t = t || "body"), this._scenes[t] && this._scenes[t].dismount(), (this._scenes[t] = new r(t, this)), this._scenes[t];
					}),
					(n.prototype.addScene = function(t) {
						var e = t._selector,
							i = this._scenes[e];
						return i && i !== t && i.dismount(), t.isMounted() || t.mount(t.getSelector()), (this._scenes[e] = t), this;
					}),
					(n.prototype.removeScene = function(t) {
						var e = t._selector,
							i = this._scenes[e];
						return i && i === t && (t.isMounted() && t.dismount(), delete this._scenes[e]), this;
					}),
					(n.prototype.startRenderLoop = function() {
						return this._channel.sendMessage(f), this;
					}),
					(n.prototype.stopRenderLoop = function() {
						return this._channel.sendMessage(m), this;
					}),
					(n.prototype.startEngine = function() {
						return console.warn("FamousEngine.startEngine is deprecated! Use FamousEngine.startRenderLoop instead!"), this.startRenderLoop();
					}),
					(n.prototype.stopEngine = function() {
						return console.warn("FamousEngine.stopEngine is deprecated! Use FamousEngine.stopRenderLoop instead!"), this.stopRenderLoop();
					}),
					(e.exports = new n());
			},
			{
				"../render-loops/RequestAnimationFrameLoop": 83,
				"../renderers/Compositor": 86,
				"../renderers/UIManager": 88,
				"./Channel": 13,
				"./Clock": 14,
				"./Commands": 15,
				"./Dispatch": 16,
				"./Scene": 22,
				"./SizeSystem": 24,
				"./TransformSystem": 26,
			},
		],
		19: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this._requestingUpdate = !1),
						(this._inUpdate = !1),
						(this._mounted = !1),
						(this._shown = !0),
						(this._updater = null),
						(this._opacity = 1),
						(this._UIEvents = []),
						(this._updateQueue = []),
						(this._nextUpdateQueue = []),
						(this._freedComponentIndicies = []),
						(this._components = []),
						(this._freedChildIndicies = []),
						(this._children = []),
						(this._fullChildren = []),
						(this._parent = null),
						(this._id = null),
						(this._transformID = null),
						(this._sizeID = null),
						this.constructor.NO_DEFAULT_COMPONENTS || this._init();
				}
				var s = t("./SizeSystem"),
					r = t("./Dispatch"),
					o = t("./TransformSystem"),
					a = t("./Size"),
					h = t("./Transform");
				(n.RELATIVE_SIZE = 0),
					(n.ABSOLUTE_SIZE = 1),
					(n.RENDER_SIZE = 2),
					(n.DEFAULT_SIZE = 0),
					(n.NO_DEFAULT_COMPONENTS = !1),
					(n.prototype._init = function() {
						(this._transformID = this.addComponent(new h())), (this._sizeID = this.addComponent(new a()));
					}),
					(n.prototype._setParent = function(t) {
						this._parent && -1 !== this._parent.getChildren().indexOf(this) && this._parent.removeChild(this), (this._parent = t);
					}),
					(n.prototype._setMounted = function(t, e) {
						(this._mounted = t), (this._id = e ? e : null);
					}),
					(n.prototype._setShown = function(t) {
						this._shown = t;
					}),
					(n.prototype._setUpdater = function(t) {
						(this._updater = t), this._requestingUpdate && this._updater.requestUpdate(this);
					}),
					(n.prototype.getLocation = function() {
						return this._id;
					}),
					(n.prototype.getId = n.prototype.getLocation),
					(n.prototype.emit = function(t, e) {
						return r.dispatch(this.getLocation(), t, e), this;
					}),
					(n.prototype.sendDrawCommand = function(t) {
						return this._updater.message(t), this;
					}),
					(n.prototype.getValue = function() {
						var t = this._children.length,
							e = this._components.length,
							i = 0,
							n = {
								location: this.getId(),
								spec: {
									location: this.getId(),
									showState: { mounted: this.isMounted(), shown: this.isShown(), opacity: this.getOpacity() || null },
									offsets: { mountPoint: [0, 0, 0], align: [0, 0, 0], origin: [0, 0, 0] },
									vectors: { position: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1] },
									size: { sizeMode: [0, 0, 0], proportional: [1, 1, 1], differential: [0, 0, 0], absolute: [0, 0, 0], render: [0, 0, 0] },
								},
								UIEvents: this._UIEvents,
								components: [],
								children: [],
							};
						if (n.location) {
							var r = o.get(this.getId()),
								a = s.get(this.getId());
							for (i = 0; 3 > i; i++) {
								(n.spec.offsets.mountPoint[i] = r.offsets.mountPoint[i]),
									(n.spec.offsets.align[i] = r.offsets.align[i]),
									(n.spec.offsets.origin[i] = r.offsets.origin[i]),
									(n.spec.vectors.position[i] = r.vectors.position[i]),
									(n.spec.vectors.rotation[i] = r.vectors.rotation[i]),
									(n.spec.vectors.scale[i] = r.vectors.scale[i]),
									(n.spec.size.sizeMode[i] = a.sizeMode[i]),
									(n.spec.size.proportional[i] = a.proportionalSize[i]),
									(n.spec.size.differential[i] = a.differentialSize[i]),
									(n.spec.size.absolute[i] = a.absoluteSize[i]),
									(n.spec.size.render[i] = a.renderSize[i]);
							}
							n.spec.vectors.rotation[3] = r.vectors.rotation[3];
						}
						for (i = 0; t > i; i++) {
							this._children[i] && this._children[i].getValue && n.children.push(this._children[i].getValue());
						}
						for (i = 0; e > i; i++) {
							this._components[i] && this._components[i].getValue && n.components.push(this._components[i].getValue());
						}
						return n;
					}),
					(n.prototype.getComputedValue = function() {
						console.warn("Node.getComputedValue is depricated. Use Node.getValue instead");
						for (
							var t = this._children.length,
								e = {
									location: this.getId(),
									computedValues: {
										transform: this.isMounted() ? o.get(this.getLocation()).getLocalTransform() : null,
										size: this.isMounted() ? s.get(this.getLocation()).get() : null,
									},
									children: [],
								},
								i = 0;
							t > i;
							i++
						) {
							this._children[i] && this._children[i].getComputedValue && e.children.push(this._children[i].getComputedValue());
						}
						return e;
					}),
					(n.prototype.getChildren = function() {
						return this._fullChildren;
					}),
					(n.prototype.getRawChildren = function() {
						return this._children;
					}),
					(n.prototype.getParent = function() {
						return this._parent;
					}),
					(n.prototype.requestUpdate = function(t) {
						return this._inUpdate || !this.isMounted()
							? this.requestUpdateOnNextTick(t)
							: (-1 === this._updateQueue.indexOf(t) && (this._updateQueue.push(t), this._requestingUpdate || this._requestUpdate()), this);
					}),
					(n.prototype.requestUpdateOnNextTick = function(t) {
						return -1 === this._nextUpdateQueue.indexOf(t) && this._nextUpdateQueue.push(t), this;
					}),
					(n.prototype.isMounted = function() {
						return this._mounted;
					}),
					(n.prototype.isRendered = function() {
						return this._mounted && this._shown;
					}),
					(n.prototype.isShown = function() {
						return this._shown;
					}),
					(n.prototype.getOpacity = function() {
						return this._opacity;
					}),
					(n.prototype.getMountPoint = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return o.get(this.getLocation()).getMountPoint();
							throw new Error("This node does not have access to a transform component");
						}
						return this.getComponent(this._transformID).getMountPoint();
					}),
					(n.prototype.getAlign = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return o.get(this.getLocation()).getAlign();
							throw new Error("This node does not have access to a transform component");
						}
						return this.getComponent(this._transformID).getAlign();
					}),
					(n.prototype.getOrigin = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return o.get(this.getLocation()).getOrigin();
							throw new Error("This node does not have access to a transform component");
						}
						return this.getComponent(this._transformID).getOrigin();
					}),
					(n.prototype.getPosition = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return o.get(this.getLocation()).getPosition();
							throw new Error("This node does not have access to a transform component");
						}
						return this.getComponent(this._transformID).getPosition();
					}),
					(n.prototype.getRotation = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return o.get(this.getLocation()).getRotation();
							throw new Error("This node does not have access to a transform component");
						}
						return this.getComponent(this._transformID).getRotation();
					}),
					(n.prototype.getScale = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return o.get(this.getLocation()).getScale();
							throw new Error("This node does not have access to a transform component");
						}
						return this.getComponent(this._transformID).getScale();
					}),
					(n.prototype.getSizeMode = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return s.get(this.getLocation()).getSizeMode();
							throw new Error("This node does not have access to a size component");
						}
						return this.getComponent(this._sizeID).getSizeMode();
					}),
					(n.prototype.getProportionalSize = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return s.get(this.getLocation()).getProportional();
							throw new Error("This node does not have access to a size component");
						}
						return this.getComponent(this._sizeID).getProportional();
					}),
					(n.prototype.getDifferentialSize = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return s.get(this.getLocation()).getDifferential();
							throw new Error("This node does not have access to a size component");
						}
						return this.getComponent(this._sizeID).getDifferential();
					}),
					(n.prototype.getAbsoluteSize = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return s.get(this.getLocation()).getAbsolute();
							throw new Error("This node does not have access to a size component");
						}
						return this.getComponent(this._sizeID).getAbsolute();
					}),
					(n.prototype.getRenderSize = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return s.get(this.getLocation()).getRender();
							throw new Error("This node does not have access to a size component");
						}
						return this.getComponent(this._sizeID).getRender();
					}),
					(n.prototype.getSize = function() {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (this.isMounted()) return s.get(this.getLocation()).get();
							throw new Error("This node does not have access to a size component");
						}
						return this.getComponent(this._sizeID).get();
					}),
					(n.prototype.getTransform = function() {
						return o.get(this.getLocation());
					}),
					(n.prototype.getUIEvents = function() {
						return this._UIEvents;
					}),
					(n.prototype.addChild = function(t) {
						var e = t ? this._children.indexOf(t) : -1;
						return (
							(t = t ? t : new n()),
							-1 === e &&
								((e = this._freedChildIndicies.length ? this._freedChildIndicies.pop() : this._children.length),
								(this._children[e] = t),
								this._fullChildren.push(t)),
							this.isMounted() && t.mount(this.getLocation() + "/" + e),
							t
						);
					}),
					(n.prototype.removeChild = function(t) {
						var e = this._children.indexOf(t);
						if (e > -1) {
							this._freedChildIndicies.push(e), (this._children[e] = null), t.isMounted() && t.dismount();
							var i = this._fullChildren.indexOf(t),
								n = this._fullChildren.length,
								s = 0;
							for (s = i; n - 1 > s; s++) {
								this._fullChildren[s] = this._fullChildren[s + 1];
							}
							return this._fullChildren.pop(), !0;
						}
						return !1;
					}),
					(n.prototype.addComponent = function(t) {
						var e = this._components.indexOf(t);
						return (
							-1 === e &&
								((e = this._freedComponentIndicies.length ? this._freedComponentIndicies.pop() : this._components.length),
								(this._components[e] = t),
								this.isMounted() && t.onMount && t.onMount(this, e),
								this.isShown() && t.onShow && t.onShow()),
							e
						);
					}),
					(n.prototype.getComponent = function(t) {
						return this._components[t];
					}),
					(n.prototype.removeComponent = function(t) {
						var e = this._components.indexOf(t);
						return (
							-1 !== e &&
								(this._freedComponentIndicies.push(e),
								this.isShown() && t.onHide && t.onHide(),
								this.isMounted() && t.onDismount && t.onDismount(),
								(this._components[e] = null)),
							t
						);
					}),
					(n.prototype.removeUIEvent = function(t) {
						var e,
							i = this.getUIEvents(),
							n = this._components,
							s = i.indexOf(t);
						if (-1 !== s) {
							i.splice(s, 1);
							for (var r = 0, o = n.length; o > r; r++) {
								(e = n[r]), e && e.onRemoveUIEvent && e.onRemoveUIEvent(t);
							}
						}
					}),
					(n.prototype.addUIEvent = function(t) {
						var e,
							i = this.getUIEvents(),
							n = this._components,
							s = -1 !== i.indexOf(t);
						if (!s) {
							i.push(t);
							for (var r = 0, o = n.length; o > r; r++) {
								(e = n[r]), e && e.onAddUIEvent && e.onAddUIEvent(t);
							}
						}
						return this;
					}),
					(n.prototype._requestUpdate = function(t) {
						(t || !this._requestingUpdate) && (this._updater && this._updater.requestUpdate(this), (this._requestingUpdate = !0));
					}),
					(n.prototype._vecOptionalSet = function(t, e, i) {
						return null != i && t[e] !== i ? ((t[e] = i), this._requestingUpdate || this._requestUpdate(), !0) : !1;
					}),
					(n.prototype.show = function() {
						return r.show(this.getLocation()), (this._shown = !0), this;
					}),
					(n.prototype.hide = function() {
						return r.hide(this.getLocation()), (this._shown = !1), this;
					}),
					(n.prototype.setAlign = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a transform component");
							o.get(this.getLocation()).setAlign(t, e, i);
						} else this.getComponent(this._transformID).setAlign(t, e, i);
						return this;
					}),
					(n.prototype.setMountPoint = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a transform component");
							o.get(this.getLocation()).setMountPoint(t, e, i);
						} else this.getComponent(this._transformID).setMountPoint(t, e, i);
						return this;
					}),
					(n.prototype.setOrigin = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a transform component");
							o.get(this.getLocation()).setOrigin(t, e, i);
						} else this.getComponent(this._transformID).setOrigin(t, e, i);
						return this;
					}),
					(n.prototype.setPosition = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a transform component");
							o.get(this.getLocation()).setPosition(t, e, i);
						} else this.getComponent(this._transformID).setPosition(t, e, i);
						return this;
					}),
					(n.prototype.setRotation = function(t, e, i, n) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a transform component");
							o.get(this.getLocation()).setRotation(t, e, i, n);
						} else this.getComponent(this._transformID).setRotation(t, e, i, n);
						return this;
					}),
					(n.prototype.setScale = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a transform component");
							o.get(this.getLocation()).setScale(t, e, i);
						} else this.getComponent(this._transformID).setScale(t, e, i);
						return this;
					}),
					(n.prototype.setOpacity = function(t) {
						if (t !== this._opacity) {
							(this._opacity = t), this._requestingUpdate || this._requestUpdate();
							for (var e, i = 0, n = this._components, s = n.length; s > i; i++) {
								(e = n[i]), e && e.onOpacityChange && e.onOpacityChange(t);
							}
						}
						return this;
					}),
					(n.prototype.setSizeMode = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a size component");
							s.get(this.getLocation()).setSizeMode(t, e, i);
						} else this.getComponent(this._sizeID).setSizeMode(t, e, i);
						return this;
					}),
					(n.prototype.setProportionalSize = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a size component");
							s.get(this.getLocation()).setProportional(t, e, i);
						} else this.getComponent(this._sizeID).setProportional(t, e, i);
						return this;
					}),
					(n.prototype.setDifferentialSize = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a size component");
							s.get(this.getLocation()).setDifferential(t, e, i);
						} else this.getComponent(this._sizeID).setDifferential(t, e, i);
						return this;
					}),
					(n.prototype.setAbsoluteSize = function(t, e, i) {
						if (this.constructor.NO_DEFAULT_COMPONENTS) {
							if (!this.isMounted()) throw new Error("This node does not have access to a size component");
							s.get(this.getLocation()).setAbsolute(t, e, i);
						} else this.getComponent(this._sizeID).setAbsolute(t, e, i);
						return this;
					}),
					(n.prototype.getFrame = function() {
						return this._updater.getFrame();
					}),
					(n.prototype.getComponents = function() {
						return this._components;
					}),
					(n.prototype.update = function(t) {
						this._inUpdate = !0;
						for (var e, i = this._nextUpdateQueue, n = this._updateQueue; i.length; ) {
							n.unshift(i.pop());
						}
						for (; n.length; ) {
							(e = this._components[n.shift()]), e && e.onUpdate && e.onUpdate(t);
						}
						return (
							(this._inUpdate = !1),
							(this._requestingUpdate = !1),
							this.isMounted()
								? this._nextUpdateQueue.length && (this._updater.requestUpdateOnNextTick(this), (this._requestingUpdate = !0))
								: ((this._parent = null), (this._id = null)),
							this
						);
					}),
					(n.prototype.mount = function(t) {
						if (this.isMounted()) throw new Error("Node is already mounted at: " + this.getLocation());
						return (
							this.constructor.NO_DEFAULT_COMPONENTS
								? (o.registerTransformAtPath(t), s.registerSizeAtPath(t))
								: (o.registerTransformAtPath(t, this.getComponent(this._transformID)), s.registerSizeAtPath(t, this.getComponent(this._sizeID))),
							r.mount(t, this),
							this._requestingUpdate || this._requestUpdate(),
							this
						);
					}),
					(n.prototype.dismount = function() {
						if (!this.isMounted()) throw new Error("Node is not mounted");
						var t = this.getLocation();
						o.deregisterTransformAtPath(t), s.deregisterSizeAtPath(t), r.dismount(t), this._requestingUpdate || this._requestUpdate();
					}),
					(e.exports = n);
			},
			{ "./Dispatch": 16, "./Size": 23, "./SizeSystem": 24, "./Transform": 25, "./TransformSystem": 26 },
		],
		20: [
			function(t, e, i) {
				"use strict";
				var n = {
					hasTrailingSlash: function hasTrailingSlash(t) {
						return "/" === t[t.length - 1];
					},
					depth: function depth(t) {
						for (var e = 0, i = t.length, n = this.hasTrailingSlash(t) ? i - 1 : i, s = 0; n > s; s++) {
							e += "/" === t[s] ? 1 : 0;
						}
						return e;
					},
					index: function index(t) {
						for (var e = t.length, i = this.hasTrailingSlash(t) ? e - 1 : e; i-- && "/" !== t[i]; ) {}
						var n = parseInt(t.substring(i + 1));
						return isNaN(n) ? 0 : n;
					},
					indexAtDepth: function indexAtDepth(t, e) {
						for (var i = 0, n = t.length, s = 0; n > i; i++) {
							if (("/" === t[i] && s++, s === e))
								return (
									(t = t.substring(i ? i + 1 : i)), (s = t.indexOf("/")), (t = -1 === s ? t : t.substring(0, s)), (s = parseInt(t)), isNaN(s) ? t : s
								);
						}
					},
					parent: function parent(t) {
						return t.substring(0, t.lastIndexOf("/", t.length - 2));
					},
					isChildOf: function isChildOf(t, e) {
						return this.isDescendentOf(t, e) && this.depth(t) === this.depth(e) + 1;
					},
					isDescendentOf: function isDescendentOf(t, e) {
						return t === e
							? !1
							: ((t = this.hasTrailingSlash(t) ? t : t + "/"),
							  (e = this.hasTrailingSlash(e) ? e : e + "/"),
							  this.depth(e) < this.depth(t) && 0 === t.indexOf(e));
					},
					getSelector: function getSelector(t) {
						var e = t.indexOf("/");
						return -1 === e ? t : t.substring(0, e);
					},
				};
				e.exports = n;
			},
			{},
		],
		21: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this.items = []), (this.paths = []), (this.memo = {});
				}
				var s = t("./Path");
				(n.prototype.insert = function(t, e) {
					var i = this.paths,
						n = i.indexOf(t);
					if (-1 !== n) throw new Error("item already exists at path: " + t);
					for (var r = 0, o = s.depth(t), a = s.index(t); i[r] && o >= s.depth(i[r]); ) {
						r++;
					}
					for (; i[r] && o === s.depth(i[r]) && a < s.index(i[r]); ) {
						r++;
					}
					i.splice(r, 0, t), this.items.splice(r, 0, e), (this.memo[t] = r);
					for (var h = this.paths.length; h > r; r++) {
						this.memo[this.paths[r]] = null;
					}
				}),
					(n.prototype.remove = function(t) {
						var e = this.paths,
							i = this.memo[t] ? this.memo[t] : e.indexOf(t);
						if (-1 === i) throw new Error("Cannot remove. No item exists at path: " + t);
						e.splice(i, 1), this.items.splice(i, 1), (this.memo[t] = null);
						for (var n = this.paths.length; n > i; i++) {
							this.memo[this.paths[i]] = null;
						}
					}),
					(n.prototype.get = function(t) {
						if (this.memo[t]) return this.items[this.memo[t]];
						var e = this.paths.indexOf(t);
						return -1 === e ? void 0 : ((this.memo[t] = e), this.items[e]);
					}),
					(n.prototype.getItems = function() {
						return this.items;
					}),
					(n.prototype.getPaths = function() {
						return this.paths;
					}),
					(e.exports = n);
			},
			{ "./Path": 20 },
		],
		22: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					if (!t) throw new Error("Scene needs to be created with a DOM selector");
					if (!e) throw new Error("Scene needs to be created with a class like Famous");
					s.call(this),
						(this._globalUpdater = e),
						(this._selector = t),
						this.mount(t),
						this._globalUpdater.message(o.NEED_SIZE_FOR).message(t),
						this.show();
				}
				var s = t("./Node"),
					r = t("./Dispatch"),
					o = t("./Commands"),
					a = t("./TransformSystem"),
					h = t("./SizeSystem");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.NO_DEFAULT_COMPONENTS = !0),
					(n.prototype.getUpdater = function() {
						return this._updater;
					}),
					(n.prototype.getSelector = function() {
						return this._selector;
					}),
					(n.prototype.getDispatch = function() {
						return console.warn("Scene#getDispatch is deprecated, require the dispatch directly"), r;
					}),
					(n.prototype.onReceive = function(t, e) {
						if ("CONTEXT_RESIZE" === t) {
							if (e.length < 2) throw new Error("CONTEXT_RESIZE's payload needs to be at least a pair of pixel sizes");
							this.setSizeMode("absolute", "absolute", "absolute"),
								this.setAbsoluteSize(e[0], e[1], e[2] ? e[2] : 0),
								this._updater
									.message(o.WITH)
									.message(this._selector)
									.message(o.READY);
						}
					}),
					(n.prototype.mount = function(t) {
						if (this.isMounted()) throw new Error("Scene is already mounted at: " + this.getLocation());
						r.mount(t, this), (this._id = t), (this._mounted = !0), (this._parent = this), a.registerTransformAtPath(t), h.registerSizeAtPath(t);
					}),
					(e.exports = n);
			},
			{ "./Commands": 15, "./Dispatch": 16, "./Node": 19, "./SizeSystem": 24, "./TransformSystem": 26 },
		],
		23: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.finalSize = new Float32Array(3)),
						(this.sizeChanged = !1),
						(this.sizeMode = new Uint8Array(3)),
						(this.sizeModeChanged = !1),
						(this.absoluteSize = new Float32Array(3)),
						(this.absoluteSizeChanged = !1),
						(this.proportionalSize = new Float32Array(a)),
						(this.proportionalSizeChanged = !1),
						(this.differentialSize = new Float32Array(3)),
						(this.differentialSizeChanged = !1),
						(this.renderSize = new Float32Array(3)),
						(this.renderSizeChanged = !1),
						(this.parent = null != t ? t : null);
				}
				function s(t, e, i) {
					return null != i && t[e] !== i ? ((t[e] = i), !0) : !1;
				}
				function r(t, e, i, n) {
					var r = !1;
					return (r = s(t, 0, e) || r), (r = s(t, 1, i) || r), (r = s(t, 2, n) || r);
				}
				function o(t) {
					if (t.constructor === String)
						switch (t.toLowerCase()) {
							case "relative":
							case "default":
								return n.RELATIVE;
							case "absolute":
								return n.ABSOLUTE;
							case "render":
								return n.RENDER;
							default:
								throw new Error("unknown size mode: " + t);
						}
					else if (0 > t || t > n.RENDER) throw new Error("unknown size mode: " + t);
					return t;
				}
				var a = [1, 1, 1],
					h = [0, 0, 0];
				(n.RELATIVE = 0),
					(n.ABSOLUTE = 1),
					(n.RENDER = 2),
					(n.DEFAULT = n.RELATIVE),
					(n.prototype.setParent = function(t) {
						return (this.parent = t), this;
					}),
					(n.prototype.getParent = function() {
						return this.parent;
					}),
					(n.prototype.setSizeMode = function(t, e, i) {
						return (
							null != t && (t = o(t)), null != e && (e = o(e)), null != i && (i = o(i)), (this.sizeModeChanged = r(this.sizeMode, t, e, i)), this
						);
					}),
					(n.prototype.getSizeMode = function() {
						return this.sizeMode;
					}),
					(n.prototype.setAbsolute = function(t, e, i) {
						return (this.absoluteSizeChanged = r(this.absoluteSize, t, e, i)), this;
					}),
					(n.prototype.getAbsolute = function() {
						return this.absoluteSize;
					}),
					(n.prototype.setProportional = function(t, e, i) {
						return (this.proportionalSizeChanged = r(this.proportionalSize, t, e, i)), this;
					}),
					(n.prototype.getProportional = function() {
						return this.proportionalSize;
					}),
					(n.prototype.setDifferential = function(t, e, i) {
						return (this.differentialSizeChanged = r(this.differentialSize, t, e, i)), this;
					}),
					(n.prototype.getDifferential = function() {
						return this.differentialSize;
					}),
					(n.prototype.get = function() {
						return this.finalSize;
					}),
					(n.prototype.fromComponents = function(t) {
						for (var e, i, s = this.sizeMode, r = this.finalSize, o = this.parent ? this.parent.get() : h, a = !1, u = t.length, c = 0; 3 > c; c++) {
							switch (((e = r[c]), s[c])) {
								case n.RELATIVE:
									r[c] = o[c] * this.proportionalSize[c] + this.differentialSize[c];
									break;
								case n.ABSOLUTE:
									r[c] = this.absoluteSize[c];
									break;
								case n.RENDER:
									var l, p;
									for (i = 0; u > i; i++) {
										(p = t[i]), p && p.getRenderSize && ((l = p.getRenderSize()[c]), (r[c] = r[c] < l || 0 === r[c] ? l : r[c]));
									}
							}
							a = a || e !== r[c];
						}
						return (this.sizeChanged = a), a;
					}),
					(e.exports = n);
			},
			{},
		],
		24: [
			function(t, e, i) {
				"use strict";
				function n() {
					this.pathStore = new c();
				}
				function s(t, e, i) {
					var n = i.getSizeMode(),
						s = n[0],
						r = n[1],
						o = n[2];
					t.onSizeModeChange && t.onSizeModeChange(s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onSizeModeChange && e[a].onSizeModeChange(s, r, o);
					}
					i.sizeModeChanged = !1;
				}
				function r(t, e, i) {
					var n = i.getAbsolute(),
						s = n[0],
						r = n[1],
						o = n[2];
					t.onAbsoluteSizeChange && t.onAbsoluteSizeChange(s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onAbsoluteSizeChange && e[a].onAbsoluteSizeChange(s, r, o);
					}
					i.absoluteSizeChanged = !1;
				}
				function o(t, e, i) {
					var n = i.getProportional(),
						s = n[0],
						r = n[1],
						o = n[2];
					t.onProportionalSizeChange && t.onProportionalSizeChange(s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onProportionalSizeChange && e[a].onProportionalSizeChange(s, r, o);
					}
					i.proportionalSizeChanged = !1;
				}
				function a(t, e, i) {
					var n = i.getDifferential(),
						s = n[0],
						r = n[1],
						o = n[2];
					t.onDifferentialSizeChange && t.onDifferentialSizeChange(s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onDifferentialSizeChange && e[a].onDifferentialSizeChange(s, r, o);
					}
					i.differentialSizeChanged = !1;
				}
				function h(t, e, i) {
					var n = i.getRenderSize(),
						s = n[0],
						r = n[1],
						o = n[2];
					t.onRenderSizeChange && t.onRenderSizeChange(s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onRenderSizeChange && e[a].onRenderSizeChange(s, r, o);
					}
					i.renderSizeChanged = !1;
				}
				function u(t, e, i) {
					var n = i.get(),
						s = n[0],
						r = n[1],
						o = n[2];
					t.onSizeChange && t.onSizeChange(s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onSizeChange && e[a].onSizeChange(s, r, o);
					}
					i.sizeChanged = !1;
				}
				var c = t("./PathStore"),
					l = t("./Size"),
					p = t("./Dispatch"),
					d = t("./Path");
				(n.prototype.registerSizeAtPath = function(t, e) {
					if (!d.depth(t)) return this.pathStore.insert(t, e ? e : new l());
					var i = this.pathStore.get(d.parent(t));
					if (!i) throw new Error("No parent size registered at expected path: " + d.parent(t));
					e && e.setParent(i), this.pathStore.insert(t, e ? e : new l(i));
				}),
					(n.prototype.deregisterSizeAtPath = function(t) {
						this.pathStore.remove(t);
					}),
					(n.prototype.get = function(t) {
						return this.pathStore.get(t);
					}),
					(n.prototype.update = function() {
						var t,
							e,
							i,
							n,
							c,
							l = this.pathStore.getItems(),
							d = this.pathStore.getPaths();
						for (i = 0, n = l.length; n > i; i++) {
							(t = p.getNode(d[i])),
								(c = t.getComponents()),
								t &&
									((e = l[i]),
									e.sizeModeChanged && s(t, c, e),
									e.absoluteSizeChanged && r(t, c, e),
									e.proportionalSizeChanged && o(t, c, e),
									e.differentialSizeChanged && a(t, c, e),
									e.renderSizeChanged && h(t, c, e),
									e.fromComponents(c) && u(t, c, e));
						}
					}),
					(e.exports = new n());
			},
			{ "./Dispatch": 16, "./Path": 20, "./PathStore": 21, "./Size": 23 },
		],
		25: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.local = new Float32Array(n.IDENT)),
						(this.global = new Float32Array(n.IDENT)),
						(this.offsets = {
							align: new Float32Array(3),
							alignChanged: !1,
							mountPoint: new Float32Array(3),
							mountPointChanged: !1,
							origin: new Float32Array(3),
							originChanged: !1,
						}),
						(this.vectors = {
							position: new Float32Array(3),
							positionChanged: !1,
							rotation: new Float32Array(u),
							rotationChanged: !1,
							scale: new Float32Array(c),
							scaleChanged: !1,
						}),
						(this._lastEulerVals = [0, 0, 0]),
						(this._lastEuler = !1),
						(this.parent = t ? t : null),
						(this.breakPoint = !1),
						(this.calculatingWorldMatrix = !1);
				}
				function s(t, e, i) {
					return null != i && t[e] !== i ? ((t[e] = i), !0) : !1;
				}
				function r(t, e, i, n, r) {
					var o = !1;
					return (o = s(t, 0, e) || o), (o = s(t, 1, i) || o), (o = s(t, 2, n) || o), null != r && (o = s(t, 3, r) || o), o;
				}
				function o(t, e) {
					var i = e.getLocalTransform(),
						s = t.getSize(),
						r = e.vectors,
						o = e.offsets,
						a = t.getParent().getSize(),
						h = 0,
						u = i[0],
						c = i[1],
						l = i[2],
						p = i[4],
						d = i[5],
						f = i[6],
						m = i[8],
						g = i[9],
						_ = i[10],
						y = i[12],
						v = i[13],
						T = i[14],
						b = r.position[0],
						E = r.position[1],
						O = r.position[2],
						w = r.rotation[0],
						x = r.rotation[1],
						I = r.rotation[2],
						C = r.rotation[3],
						S = r.scale[0],
						R = r.scale[1],
						A = r.scale[2],
						M = o.align[0] * a[0],
						D = o.align[1] * a[1],
						N = o.align[2] * a[2],
						L = o.mountPoint[0] * s[0],
						z = o.mountPoint[1] * s[1],
						U = o.mountPoint[2] * s[2],
						P = o.origin[0] * s[0],
						F = o.origin[1] * s[1],
						G = o.origin[2] * s[2],
						V = C * w,
						k = C * x,
						H = C * I,
						B = w * w,
						q = x * x,
						W = I * I,
						j = w * x,
						Y = w * I,
						Q = x * I;
					return (
						(i[0] = (1 - 2 * (q + W)) * S),
						(i[1] = 2 * (j + H) * S),
						(i[2] = 2 * (Y - k) * S),
						(i[3] = 0),
						(i[4] = 2 * (j - H) * R),
						(i[5] = (1 - 2 * (B + W)) * R),
						(i[6] = 2 * (Q + V) * R),
						(i[7] = 0),
						(i[8] = 2 * (Y + k) * A),
						(i[9] = 2 * (Q - V) * A),
						(i[10] = (1 - 2 * (B + q)) * A),
						(i[11] = 0),
						(i[12] = M + b - L + P - (i[0] * P + i[4] * F + i[8] * G)),
						(i[13] = D + E - z + F - (i[1] * P + i[5] * F + i[9] * G)),
						(i[14] = N + O - U + G - (i[2] * P + i[6] * F + i[10] * G)),
						(i[15] = 1),
						e.calculatingWorldMatrix && e.calculateWorldMatrix() && (h |= n.WORLD_CHANGED),
						(u !== i[0] ||
							c !== i[1] ||
							l !== i[2] ||
							p !== i[4] ||
							d !== i[5] ||
							f !== i[6] ||
							m !== i[8] ||
							g !== i[9] ||
							_ !== i[10] ||
							y !== i[12] ||
							v !== i[13] ||
							T !== i[14]) &&
							(h |= n.LOCAL_CHANGED),
						h
					);
				}
				function a(t, e) {
					var i = e.getLocalTransform(),
						s = e.parent.getLocalTransform(),
						r = t.getSize(),
						o = e.vectors,
						a = e.offsets,
						h = t.getParent().getSize(),
						u = !1,
						c = i[0],
						l = i[1],
						p = i[2],
						d = i[4],
						f = i[5],
						m = i[6],
						g = i[8],
						_ = i[9],
						y = i[10],
						v = i[12],
						T = i[13],
						b = i[14],
						E = s[0],
						O = s[1],
						w = s[2],
						x = s[4],
						I = s[5],
						C = s[6],
						S = s[8],
						R = s[9],
						A = s[10],
						M = s[12],
						D = s[13],
						N = s[14],
						L = o.position[0],
						z = o.position[1],
						U = o.position[2],
						P = o.rotation[0],
						F = o.rotation[1],
						G = o.rotation[2],
						V = o.rotation[3],
						k = o.scale[0],
						H = o.scale[1],
						B = o.scale[2],
						q = a.align[0] * h[0],
						W = a.align[1] * h[1],
						j = a.align[2] * h[2],
						Y = a.mountPoint[0] * r[0],
						Q = a.mountPoint[1] * r[1],
						K = a.mountPoint[2] * r[2],
						X = a.origin[0] * r[0],
						Z = a.origin[1] * r[1],
						J = a.origin[2] * r[2],
						$ = V * P,
						tt = V * F,
						et = V * G,
						it = P * P,
						nt = F * F,
						st = G * G,
						rt = P * F,
						ot = P * G,
						at = F * G,
						ht = (1 - 2 * (nt + st)) * k,
						ut = 2 * (rt + et) * k,
						ct = 2 * (ot - tt) * k,
						lt = 2 * (rt - et) * H,
						pt = (1 - 2 * (it + st)) * H,
						dt = 2 * (at + $) * H,
						ft = 2 * (ot + tt) * B,
						mt = 2 * (at - $) * B,
						gt = (1 - 2 * (it + nt)) * B,
						_t = q + L - Y + X - (ht * X + lt * Z + ft * J),
						yt = W + z - Q + Z - (ut * X + pt * Z + mt * J),
						vt = j + U - K + J - (ct * X + dt * Z + gt * J);
					return (
						(i[0] = E * ht + x * ut + S * ct),
						(i[1] = O * ht + I * ut + R * ct),
						(i[2] = w * ht + C * ut + A * ct),
						(i[3] = 0),
						(i[4] = E * lt + x * pt + S * dt),
						(i[5] = O * lt + I * pt + R * dt),
						(i[6] = w * lt + C * pt + A * dt),
						(i[7] = 0),
						(i[8] = E * ft + x * mt + S * gt),
						(i[9] = O * ft + I * mt + R * gt),
						(i[10] = w * ft + C * mt + A * gt),
						(i[11] = 0),
						(i[12] = E * _t + x * yt + S * vt + M),
						(i[13] = O * _t + I * yt + R * vt + D),
						(i[14] = w * _t + C * yt + A * vt + N),
						(i[15] = 1),
						e.calculatingWorldMatrix && e.calculateWorldMatrix() && (u |= n.WORLD_CHANGED),
						(c !== i[0] ||
							l !== i[1] ||
							p !== i[2] ||
							d !== i[4] ||
							f !== i[5] ||
							m !== i[6] ||
							g !== i[8] ||
							_ !== i[9] ||
							y !== i[10] ||
							v !== i[12] ||
							T !== i[13] ||
							b !== i[14]) &&
							(u |= n.LOCAL_CHANGED),
						u
					);
				}
				function h(t, e, i) {
					var n,
						s = e[0],
						r = e[1],
						o = e[2],
						a = e[4],
						h = e[5],
						u = e[6],
						c = e[8],
						l = e[9],
						p = e[10],
						d = e[12],
						f = e[13],
						m = e[14],
						g = !1,
						_ = i[0],
						y = i[1],
						v = i[2],
						T = i[3];
					return (
						(n = _ * s + y * a + v * c + T * d),
						(g = g ? g : t[0] === n),
						(t[0] = n),
						(n = _ * r + y * h + v * l + T * f),
						(g = g ? g : t[1] === n),
						(t[1] = n),
						(n = _ * o + y * u + v * p + T * m),
						(g = g ? g : t[2] === n),
						(t[2] = n),
						(t[3] = 0),
						(_ = i[4]),
						(y = i[5]),
						(v = i[6]),
						(T = i[7]),
						(n = _ * s + y * a + v * c + T * d),
						(g = g ? g : t[4] === n),
						(t[4] = n),
						(n = _ * r + y * h + v * l + T * f),
						(g = g ? g : t[5] === n),
						(t[5] = n),
						(n = _ * o + y * u + v * p + T * m),
						(g = g ? g : t[6] === n),
						(t[6] = n),
						(t[7] = 0),
						(_ = i[8]),
						(y = i[9]),
						(v = i[10]),
						(T = i[11]),
						(n = _ * s + y * a + v * c + T * d),
						(g = g ? g : t[8] === n),
						(t[8] = n),
						(n = _ * r + y * h + v * l + T * f),
						(g = g ? g : t[9] === n),
						(t[9] = n),
						(n = _ * o + y * u + v * p + T * m),
						(g = g ? g : t[10] === n),
						(t[10] = n),
						(t[11] = 0),
						(_ = i[12]),
						(y = i[13]),
						(v = i[14]),
						(T = i[15]),
						(n = _ * s + y * a + v * c + T * d),
						(g = g ? g : t[12] === n),
						(t[12] = n),
						(n = _ * r + y * h + v * l + T * f),
						(g = g ? g : t[13] === n),
						(t[13] = n),
						(n = _ * o + y * u + v * p + T * m),
						(g = g ? g : t[14] === n),
						(t[14] = n),
						(t[15] = 1),
						g
					);
				}
				var u = [0, 0, 0, 1],
					c = [1, 1, 1];
				(n.IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
					(n.WORLD_CHANGED = 1),
					(n.LOCAL_CHANGED = 2),
					(n.prototype.reset = function() {
						(this.parent = null), (this.breakPoint = !1), (this.calculatingWorldMatrix = !1);
					}),
					(n.prototype.setParent = function(t) {
						this.parent = t;
					}),
					(n.prototype.getParent = function() {
						return this.parent;
					}),
					(n.prototype.setBreakPoint = function() {
						(this.breakPoint = !0), (this.calculatingWorldMatrix = !0);
					}),
					(n.prototype.setCalculateWorldMatrix = function() {
						this.calculatingWorldMatrix = !0;
					}),
					(n.prototype.isBreakPoint = function() {
						return this.breakPoint;
					}),
					(n.prototype.getLocalTransform = function() {
						return this.local;
					}),
					(n.prototype.getWorldTransform = function() {
						if (!this.isBreakPoint() && !this.calculatingWorldMatrix) throw new Error("This transform is not calculating world transforms");
						return this.global;
					}),
					(n.prototype.calculate = function(t) {
						return !this.parent || this.parent.isBreakPoint() ? o(t, this) : a(t, this);
					}),
					(n.prototype.getPosition = function() {
						return this.vectors.position;
					}),
					(n.prototype.setPosition = function(t, e, i) {
						this.vectors.positionChanged = r(this.vectors.position, t, e, i);
					}),
					(n.prototype.getRotation = function() {
						return this.vectors.rotation;
					}),
					(n.prototype.setRotation = function(t, e, i, n) {
						var s,
							o,
							a,
							h,
							u = this.vectors.rotation;
						if (null != n)
							(s = t),
								(o = e),
								(a = i),
								(h = n),
								(this._lastEulerVals[0] = null),
								(this._lastEulerVals[1] = null),
								(this._lastEulerVals[2] = null),
								(this._lastEuler = !1);
						else {
							if (null == t || null == e || null == i)
								if (this._lastEuler)
									(t = null == t ? this._lastEulerVals[0] : t),
										(e = null == e ? this._lastEulerVals[1] : e),
										(i = null == i ? this._lastEulerVals[2] : i);
								else {
									var c = -2 * (u[1] * u[2] - u[3] * u[0]);
									Math.abs(c) > 0.99999
										? ((e = null == e ? 0.5 * Math.PI * c : e),
										  (t = null == t ? Math.atan2(-u[0] * u[2] + u[3] * u[1], 0.5 - u[1] * u[1] - u[2] * u[2]) : t),
										  (i = null == i ? 0 : i))
										: ((e = null == e ? Math.asin(c) : e),
										  (t = null == t ? Math.atan2(u[0] * u[2] + u[3] * u[1], 0.5 - u[0] * u[0] - u[1] * u[1]) : t),
										  (i = null == i ? Math.atan2(u[0] * u[1] + u[3] * u[2], 0.5 - u[0] * u[0] - u[2] * u[2]) : i));
								}
							var l = 0.5 * t,
								p = 0.5 * e,
								d = 0.5 * i,
								f = Math.sin(l),
								m = Math.sin(p),
								g = Math.sin(d),
								_ = Math.cos(l),
								y = Math.cos(p),
								v = Math.cos(d),
								T = m * g,
								b = y * g,
								E = m * v,
								O = y * v;
							(s = f * O + _ * T),
								(o = _ * E - f * b),
								(a = _ * b + f * E),
								(h = _ * O - f * T),
								(this._lastEuler = !0),
								(this._lastEulerVals[0] = t),
								(this._lastEulerVals[1] = e),
								(this._lastEulerVals[2] = i);
						}
						this.vectors.rotationChanged = r(u, s, o, a, h);
					}),
					(n.prototype.getScale = function() {
						return this.vectors.scale;
					}),
					(n.prototype.setScale = function(t, e, i) {
						this.vectors.scaleChanged = r(this.vectors.scale, t, e, i);
					}),
					(n.prototype.getAlign = function() {
						return this.offsets.align;
					}),
					(n.prototype.setAlign = function(t, e, i) {
						this.offsets.alignChanged = r(this.offsets.align, t, e, null != i ? i - 0.5 : i);
					}),
					(n.prototype.getMountPoint = function() {
						return this.offsets.mountPoint;
					}),
					(n.prototype.setMountPoint = function(t, e, i) {
						this.offsets.mountPointChanged = r(this.offsets.mountPoint, t, e, null != i ? i - 0.5 : i);
					}),
					(n.prototype.getOrigin = function() {
						return this.offsets.origin;
					}),
					(n.prototype.setOrigin = function(t, e, i) {
						this.offsets.originChanged = r(this.offsets.origin, t, e, null != i ? i - 0.5 : i);
					}),
					(n.prototype.calculateWorldMatrix = function() {
						for (var t = this.parent; t && !t.isBreakPoint(); ) {
							t = t.parent;
						}
						if (t) return h(this.global, t.getWorldTransform(), this.local);
						for (var e = 0; 16 > e; e++) {
							this.global[e] = this.local[e];
						}
						return !1;
					}),
					(e.exports = n);
			},
			{},
		],
		26: [
			function(t, e, i) {
				"use strict";
				function n() {
					this.pathStore = new g();
				}
				function s(t, e, i) {
					var n = i.align[0],
						s = i.align[1],
						r = i.align[2];
					t.onAlignChange && t.onAlignChange(n, s, r);
					for (var o = 0, a = e.length; a > o; o++) {
						e[o] && e[o].onAlignChange && e[o].onAlignChange(n, s, r);
					}
					i.alignChanged = !1;
				}
				function r(t, e, i) {
					var n = i.mountPoint[0],
						s = i.mountPoint[1],
						r = i.mountPoint[2];
					t.onMountPointChange && t.onMountPointChange(n, s, r);
					for (var o = 0, a = e.length; a > o; o++) {
						e[o] && e[o].onMountPointChange && e[o].onMountPointChange(n, s, r);
					}
					i.mountPointChanged = !1;
				}
				function o(t, e, i) {
					var n = i.origin[0],
						s = i.origin[1],
						r = i.origin[2];
					t.onOriginChange && t.onOriginChange(n, s, r);
					for (var o = 0, a = e.length; a > o; o++) {
						e[o] && e[o].onOriginChange && e[o].onOriginChange(n, s, r);
					}
					i.originChanged = !1;
				}
				function a(t, e, i) {
					var n = i.position[0],
						s = i.position[1],
						r = i.position[2];
					t.onPositionChange && t.onPositionChange(n, s, r);
					for (var o = 0, a = e.length; a > o; o++) {
						e[o] && e[o].onPositionChange && e[o].onPositionChange(n, s, r);
					}
					i.positionChanged = !1;
				}
				function h(t, e, i) {
					var n = i.rotation[0],
						s = i.rotation[1],
						r = i.rotation[2],
						o = i.rotation[3];
					t.onRotationChange && t.onRotationChange(n, s, r, o);
					for (var a = 0, h = e.length; h > a; a++) {
						e[a] && e[a].onRotationChange && e[a].onRotationChange(n, s, r, o);
					}
					i.rotationChanged = !1;
				}
				function u(t, e, i) {
					var n = i.scale[0],
						s = i.scale[1],
						r = i.scale[2];
					t.onScaleChange && t.onScaleChange(n, s, r);
					for (var o = 0, a = e.length; a > o; o++) {
						e[o] && e[o].onScaleChange && e[o].onScaleChange(n, s, r);
					}
					i.scaleChanged = !1;
				}
				function c(t, e, i) {
					t.onTransformChange && t.onTransformChange(i);
					for (var n = 0, s = e.length; s > n; n++) {
						e[n] && e[n].onTransformChange && e[n].onTransformChange(i);
					}
				}
				function l(t, e, i) {
					t.onLocalTransformChange && t.onLocalTransformChange(i);
					for (var n = 0, s = e.length; s > n; n++) {
						e[n] && e[n].onLocalTransformChange && e[n].onLocalTransformChange(i);
					}
				}
				function p(t, e, i) {
					t.onWorldTransformChange && t.onWorldTransformChange(i);
					for (var n = 0, s = e.length; s > n; n++) {
						e[n] && e[n].onWorldTransformChange && e[n].onWorldTransformChange(i);
					}
				}
				var d = t("./Path"),
					f = t("./Transform"),
					m = t("./Dispatch"),
					g = t("./PathStore");
				(n.prototype.registerTransformAtPath = function(t, e) {
					if (!d.depth(t)) return this.pathStore.insert(t, e ? e : new f());
					var i = this.pathStore.get(d.parent(t));
					if (!i) throw new Error("No parent transform registered at expected path: " + d.parent(t));
					e && e.setParent(i), this.pathStore.insert(t, e ? e : new f(i));
				}),
					(n.prototype.deregisterTransformAtPath = function(t) {
						this.pathStore.remove(t);
					}),
					(n.prototype.makeBreakPointAt = function(t) {
						var e = this.pathStore.get(t);
						if (!e) throw new Error("No transform Registered at path: " + t);
						e.setBreakPoint();
					}),
					(n.prototype.makeCalculateWorldMatrixAt = function(t) {
						var e = this.pathStore.get(t);
						if (!e) throw new Error("No transform Registered at path: " + t);
						e.setCalculateWorldMatrix();
					}),
					(n.prototype.get = function(t) {
						return this.pathStore.get(t);
					}),
					(n.prototype.update = function() {
						for (var t, e, i, n, d, g, _ = this.pathStore.getItems(), y = this.pathStore.getPaths(), v = 0, T = _.length; T > v; v++) {
							(i = m.getNode(y[v])),
								i &&
									((g = i.getComponents()),
									(t = _[v]),
									(n = t.vectors),
									(d = t.offsets),
									d.alignChanged && s(i, g, d),
									d.mountPointChanged && r(i, g, d),
									d.originChanged && o(i, g, d),
									n.positionChanged && a(i, g, n),
									n.rotationChanged && h(i, g, n),
									n.scaleChanged && u(i, g, n),
									(e = t.calculate(i)) &&
										(c(i, g, t), e & f.LOCAL_CHANGED && l(i, g, t.getLocalTransform()), e & f.WORLD_CHANGED && p(i, g, t.getWorldTransform())));
						}
					}),
					(e.exports = new n());
			},
			{ "./Dispatch": 16, "./Path": 20, "./PathStore": 21, "./Transform": 25 },
		],
		27: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					Channel: t("./Channel"),
					Clock: t("./Clock"),
					Commands: t("./Commands"),
					Dispatch: t("./Dispatch"),
					Event: t("./Event"),
					FamousEngine: t("./FamousEngine"),
					Node: t("./Node"),
					Path: t("./Path"),
					PathStore: t("./PathStore"),
					Scene: t("./Scene"),
					Size: t("./Size"),
					SizeSystem: t("./SizeSystem"),
					Transform: t("./Transform"),
					TransformSystem: t("./TransformSystem"),
				};
			},
			{
				"./Channel": 13,
				"./Clock": 14,
				"./Commands": 15,
				"./Dispatch": 16,
				"./Event": 17,
				"./FamousEngine": 18,
				"./Node": 19,
				"./Path": 20,
				"./PathStore": 21,
				"./Scene": 22,
				"./Size": 23,
				"./SizeSystem": 24,
				"./Transform": 25,
				"./TransformSystem": 26,
			},
		],
		28: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					if (!t) throw new Error("DOMElement must be instantiated on a node");
					if (
						((this._changeQueue = []),
						(this._requestingUpdate = !1),
						(this._renderSized = !1),
						(this._requestRenderSize = !1),
						(this._UIEvents = t.getUIEvents().slice(0)),
						(this._classes = ["famous-dom-element"]),
						(this._requestingEventListeners = []),
						(this._styles = {}),
						(this._attributes = {}),
						(this._content = ""),
						(this._tagName = e && e.tagName ? e.tagName : "div"),
						(this._renderSize = [0, 0, 0]),
						(this._node = t),
						t && t.addComponent(this),
						(this._callbacks = new s()),
						this.setProperty("display", t.isShown() ? "block" : "none"),
						this.onOpacityChange(t.getOpacity()),
						e)
					) {
						var i, n;
						if (e.classes)
							for (i = 0; i < e.classes.length; i++) {
								this.addClass(e.classes[i]);
							}
						if (e.attributes)
							for (n in e.attributes) {
								this.setAttribute(n, e.attributes[n]);
							}
						if (e.properties)
							for (n in e.properties) {
								this.setProperty(n, e.properties[n]);
							}
						e.id && this.setId(e.id), e.content && this.setContent(e.content), e.cutout === !1 && this.setCutoutState(e.cutout);
					}
				}
				var s = t("../utilities/CallbackStore"),
					r = t("../core/TransformSystem"),
					o = t("../core/Commands"),
					a = t("../core/Size");
				(n.prototype.getValue = function() {
					return {
						classes: this._classes,
						styles: this._styles,
						attributes: this._attributes,
						content: this._content,
						id: this._attributes.id,
						tagName: this._tagName,
					};
				}),
					(n.prototype.onUpdate = function() {
						var t = this._node,
							e = this._changeQueue,
							i = e.length;
						if (i && t) {
							for (t.sendDrawCommand(o.WITH), t.sendDrawCommand(t.getLocation()); i--; ) {
								t.sendDrawCommand(e.shift());
							}
							this._requestRenderSize && (t.sendDrawCommand(o.DOM_RENDER_SIZE), t.sendDrawCommand(t.getLocation()), (this._requestRenderSize = !1));
						}
						this._requestingUpdate = !1;
					}),
					(n.prototype.onMount = function(t, e) {
						(this._node = t),
							(this._id = e),
							(this._UIEvents = t.getUIEvents().slice(0)),
							r.makeBreakPointAt(t.getLocation()),
							this.onSizeModeChange.apply(this, t.getSizeMode()),
							this.draw(),
							this.setAttribute("data-fa-path", t.getLocation());
					}),
					(n.prototype.onDismount = function() {
						this.setProperty("display", "none"),
							this.setAttribute("data-fa-path", ""),
							this.setCutoutState(!1),
							this.onUpdate(),
							(this._initialized = !1);
					}),
					(n.prototype.onShow = function() {
						this.setProperty("display", "block");
					}),
					(n.prototype.onHide = function() {
						this.setProperty("display", "none");
					}),
					(n.prototype.setCutoutState = function(t) {
						return this._initialized && this._changeQueue.push(o.GL_CUTOUT_STATE, t), this._requestingUpdate || this._requestUpdate(), this;
					}),
					(n.prototype.onTransformChange = function(t) {
						this._changeQueue.push(o.CHANGE_TRANSFORM), (t = t.getLocalTransform());
						for (var e = 0, i = t.length; i > e; e++) {
							this._changeQueue.push(t[e]);
						}
						this._requestingUpdate || this._requestUpdate();
					}),
					(n.prototype.onSizeChange = function(t, e) {
						var i = this._node.getSizeMode(),
							n = i[0] !== a.RENDER,
							s = i[1] !== a.RENDER;
						return (
							this._initialized && this._changeQueue.push(o.CHANGE_SIZE, n ? t : n, s ? e : s), this._requestingUpdate || this._requestUpdate(), this
						);
					}),
					(n.prototype.onOpacityChange = function(t) {
						return this.setProperty("opacity", t);
					}),
					(n.prototype.onAddUIEvent = function(t) {
						return -1 === this._UIEvents.indexOf(t) ? (this._subscribe(t), this._UIEvents.push(t)) : this._inDraw && this._subscribe(t), this;
					}),
					(n.prototype.onRemoveUIEvent = function(t) {
						var e = this._UIEvents.indexOf(t);
						return -1 !== e ? (this._unsubscribe(t), this._UIEvents.splice(e, 1)) : this._inDraw && this._unsubscribe(t), this;
					}),
					(n.prototype._subscribe = function(t) {
						this._initialized && this._changeQueue.push(o.SUBSCRIBE, t), this._requestingUpdate || this._requestUpdate();
					}),
					(n.prototype.preventDefault = function(t) {
						this._initialized && this._changeQueue.push(o.PREVENT_DEFAULT, t), this._requestingUpdate || this._requestUpdate();
					}),
					(n.prototype.allowDefault = function(t) {
						this._initialized && this._changeQueue.push(o.ALLOW_DEFAULT, t), this._requestingUpdate || this._requestUpdate();
					}),
					(n.prototype._unsubscribe = function(t) {
						this._initialized && this._changeQueue.push(o.UNSUBSCRIBE, t), this._requestingUpdate || this._requestUpdate();
					}),
					(n.prototype.onSizeModeChange = function(t, e, i) {
						(t === a.RENDER || e === a.RENDER || i === a.RENDER) && ((this._renderSized = !0), (this._requestRenderSize = !0));
						var n = this._node.getSize();
						this.onSizeChange(n[0], n[1]);
					}),
					(n.prototype.getRenderSize = function() {
						return this._renderSize;
					}),
					(n.prototype._requestUpdate = function() {
						!this._requestingUpdate && this._id && (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
					}),
					(n.prototype.init = function() {
						this._changeQueue.push(o.INIT_DOM, this._tagName), (this._initialized = !0), this.onTransformChange(r.get(this._node.getLocation()));
						var t = this._node.getSize();
						this.onSizeChange(t[0], t[1]), this._requestingUpdate || this._requestUpdate();
					}),
					(n.prototype.setId = function(t) {
						return this.setAttribute("id", t), this;
					}),
					(n.prototype.addClass = function(t) {
						return this._classes.indexOf(t) < 0
							? (this._initialized && this._changeQueue.push(o.ADD_CLASS, t),
							  this._classes.push(t),
							  this._requestingUpdate || this._requestUpdate(),
							  this._renderSized && (this._requestRenderSize = !0),
							  this)
							: (this._inDraw && (this._initialized && this._changeQueue.push(o.ADD_CLASS, t), this._requestingUpdate || this._requestUpdate()),
							  this);
					}),
					(n.prototype.removeClass = function(t) {
						var e = this._classes.indexOf(t);
						return 0 > e
							? this
							: (this._changeQueue.push(o.REMOVE_CLASS, t), this._classes.splice(e, 1), this._requestingUpdate || this._requestUpdate(), this);
					}),
					(n.prototype.hasClass = function(t) {
						return -1 !== this._classes.indexOf(t);
					}),
					(n.prototype.setAttribute = function(t, e) {
						return (
							(this._attributes[t] !== e || this._inDraw) &&
								((this._attributes[t] = e),
								this._initialized && this._changeQueue.push(o.CHANGE_ATTRIBUTE, t, e),
								this._requestUpdate || this._requestUpdate()),
							this
						);
					}),
					(n.prototype.setProperty = function(t, e) {
						return (
							(this._styles[t] !== e || this._inDraw) &&
								((this._styles[t] = e),
								this._initialized && this._changeQueue.push(o.CHANGE_PROPERTY, t, e),
								this._requestingUpdate || this._requestUpdate(),
								this._renderSized && (this._requestRenderSize = !0)),
							this
						);
					}),
					(n.prototype.setContent = function(t) {
						return (
							(this._content !== t || this._inDraw) &&
								((this._content = t),
								this._initialized && this._changeQueue.push(o.CHANGE_CONTENT, t),
								this._requestingUpdate || this._requestUpdate(),
								this._renderSized && (this._requestRenderSize = !0)),
							this
						);
					}),
					(n.prototype.on = function(t, e) {
						return this._callbacks.on(t, e);
					}),
					(n.prototype.onReceive = function(t, e) {
						"resize" === t && ((this._renderSize[0] = e.val[0]), (this._renderSize[1] = e.val[1]), this._requestingUpdate || this._requestUpdate()),
							this._callbacks.trigger(t, e);
					}),
					(n.prototype.draw = function() {
						var t, e, i;
						for (this._inDraw = !0, this.init(), e = 0, i = this._classes.length; i > e; e++) {
							this.addClass(this._classes[e]);
						}
						this._content && this.setContent(this._content);
						for (t in this._styles) {
							null != this._styles[t] && this.setProperty(t, this._styles[t]);
						}
						for (t in this._attributes) {
							null != this._attributes[t] && this.setAttribute(t, this._attributes[t]);
						}
						for (e = 0, i = this._UIEvents.length; i > e; e++) {
							this.onAddUIEvent(this._UIEvents[e]);
						}
						this._inDraw = !1;
					}),
					(e.exports = n);
			},
			{ "../core/Commands": 15, "../core/Size": 23, "../core/TransformSystem": 26, "../utilities/CallbackStore": 94 },
		],
		29: [
			function(t, e, i) {
				"use strict";
				e.exports = { DOMElement: t("./DOMElement") };
			},
			{ "./DOMElement": 28 },
		],
		30: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					var n = this;
					t.classList.add("famous-dom-renderer"),
						(l = l || h("transform")),
						(this._compositor = i),
						(this._target = null),
						(this._parent = null),
						(this._path = null),
						(this._children = []),
						(this._insertElCallbackStore = new u()),
						(this._removeElCallbackStore = new u()),
						(this._root = new r(t, e)),
						(this._boundTriggerEvent = function(t) {
							return n._triggerEvent(t);
						}),
						(this._selector = e),
						(this._elements = {}),
						(this._elements[e] = this._root),
						(this.perspectiveTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])),
						(this._VPtransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])),
						(this._lastEv = null);
				}
				function s(t) {
					for (var e = [], i = t.target; i !== document.body; ) {
						e.push(i), (i = i.parentNode);
					}
					return e;
				}
				var r = t("./ElementCache"),
					o = t("./Math"),
					a = t("../core/Path"),
					h = t("../utilities/vendorPrefix"),
					u = t("../utilities/CallbackStore"),
					c = t("./events/EventMap"),
					l = null;
				(n.prototype.subscribe = function(t) {
					this._assertTargetLoaded(), this._listen(t), (this._target.subscribe[t] = !0);
				}),
					(n.prototype.preventDefault = function(t) {
						this._assertTargetLoaded(), this._listen(t), (this._target.preventDefault[t] = !0);
					}),
					(n.prototype.allowDefault = function(t) {
						this._assertTargetLoaded(), this._listen(t), (this._target.preventDefault[t] = !1);
					}),
					(n.prototype._listen = function(t) {
						if ((this._assertTargetLoaded(), !this._target.listeners[t] && !this._root.listeners[t])) {
							var e = c[t][1] ? this._root : this._target;
							(e.listeners[t] = this._boundTriggerEvent), e.element.addEventListener(t, this._boundTriggerEvent);
						}
					}),
					(n.prototype.unsubscribe = function(t) {
						this._assertTargetLoaded(), (this._target.subscribe[t] = !1);
					}),
					(n.prototype._triggerEvent = function(t) {
						if (this._lastEv !== t)
							for (var e = t.path ? t.path : s(t), i = 0; i < e.length; i++) {
								if (e[i].dataset) {
									var n = e[i].dataset.faPath;
									if (
										n &&
										(this._elements[n].preventDefault[t.type] && t.preventDefault(), this._elements[n] && this._elements[n].subscribe[t.type])
									) {
										this._lastEv = t;
										var r = c[t.type][0];
										this._compositor.sendEvent(n, t.type, new r(t));
										break;
									}
								}
							}
					}),
					(n.prototype.getSizeOf = function(t) {
						var e = this._elements[t];
						if (!e) return null;
						var i = { val: e.size };
						return this._compositor.sendEvent(t, "resize", i), i;
					}),
					(n.prototype.draw = function(t) {
						t.perspectiveDirty &&
							((this.perspectiveDirty = !0),
							(this.perspectiveTransform[0] = t.perspectiveTransform[0]),
							(this.perspectiveTransform[1] = t.perspectiveTransform[1]),
							(this.perspectiveTransform[2] = t.perspectiveTransform[2]),
							(this.perspectiveTransform[3] = t.perspectiveTransform[3]),
							(this.perspectiveTransform[4] = t.perspectiveTransform[4]),
							(this.perspectiveTransform[5] = t.perspectiveTransform[5]),
							(this.perspectiveTransform[6] = t.perspectiveTransform[6]),
							(this.perspectiveTransform[7] = t.perspectiveTransform[7]),
							(this.perspectiveTransform[8] = t.perspectiveTransform[8]),
							(this.perspectiveTransform[9] = t.perspectiveTransform[9]),
							(this.perspectiveTransform[10] = t.perspectiveTransform[10]),
							(this.perspectiveTransform[11] = t.perspectiveTransform[11]),
							(this.perspectiveTransform[12] = t.perspectiveTransform[12]),
							(this.perspectiveTransform[13] = t.perspectiveTransform[13]),
							(this.perspectiveTransform[14] = t.perspectiveTransform[14]),
							(this.perspectiveTransform[15] = t.perspectiveTransform[15])),
							(t.viewDirty || t.perspectiveDirty) &&
								(o.multiply(this._VPtransform, this.perspectiveTransform, t.viewTransform),
								(this._root.element.style[l] = this._stringifyMatrix(this._VPtransform)));
					}),
					(n.prototype._assertPathLoaded = function() {
						if (!this._path) throw new Error("path not loaded");
					}),
					(n.prototype._assertParentLoaded = function() {
						if (!this._parent) throw new Error("parent not loaded");
					}),
					(n.prototype._assertChildrenLoaded = function() {
						if (!this._children) throw new Error("children not loaded");
					}),
					(n.prototype._assertTargetLoaded = function() {
						if (!this._target) throw new Error("No target loaded");
					}),
					(n.prototype.findParent = function() {
						this._assertPathLoaded();
						for (var t, e = this._path; !t && e.length; ) {
							(e = e.substring(0, e.lastIndexOf("/"))), (t = this._elements[e]);
						}
						return (this._parent = t), t;
					}),
					(n.prototype.findTarget = function() {
						return (this._target = this._elements[this._path]), this._target;
					}),
					(n.prototype.loadPath = function(t) {
						return (this._path = t), (this._target = this._elements[this._path]), this._path;
					}),
					(n.prototype.resolveChildren = function(t, e) {
						for (var i, n, s = 0, r = this._path; (i = e.childNodes[s]); ) {
							i.dataset ? ((n = i.dataset.faPath), n && a.isDescendentOf(n, r) ? t.appendChild(i) : s++) : s++;
						}
					}),
					(n.prototype.insertEl = function(t) {
						if ((this.findParent(), this._assertParentLoaded(), this._parent.void))
							throw new Error(this._parent.path + " is a void element. Void elements are not allowed to have children.");
						this._target || (this._target = new r(document.createElement(t), this._path));
						var e = this._target.element,
							i = this._parent.element;
						this.resolveChildren(e, i),
							i.appendChild(e),
							(this._elements[this._path] = this._target),
							this._insertElCallbackStore.trigger(this._path, this._target);
					}),
					(n.prototype.setProperty = function(t, e) {
						this._assertTargetLoaded(), (this._target.element.style[t] = e);
					}),
					(n.prototype.setSize = function(t, e) {
						this._assertTargetLoaded(), this.setWidth(t), this.setHeight(e);
					}),
					(n.prototype.setWidth = function(t) {
						this._assertTargetLoaded();
						var e = this._target.content;
						t === !1
							? ((this._target.explicitWidth = !0),
							  e && (e.style.width = ""),
							  (t = e ? e.offsetWidth : 0),
							  (this._target.element.style.width = t + "px"))
							: ((this._target.explicitWidth = !1), e && (e.style.width = t + "px"), (this._target.element.style.width = t + "px")),
							(this._target.size[0] = t);
					}),
					(n.prototype.setHeight = function(t) {
						this._assertTargetLoaded();
						var e = this._target.content;
						t === !1
							? ((this._target.explicitHeight = !0),
							  e && (e.style.height = ""),
							  (t = e ? e.offsetHeight : 0),
							  (this._target.element.style.height = t + "px"))
							: ((this._target.explicitHeight = !1), e && (e.style.height = t + "px"), (this._target.element.style.height = t + "px")),
							(this._target.size[1] = t);
					}),
					(n.prototype.setAttribute = function(t, e) {
						this._assertTargetLoaded(), this._target.element.setAttribute(t, e);
					}),
					(n.prototype.setContent = function(t) {
						this._assertTargetLoaded(),
							this._target.formElement
								? (this._target.element.value = t)
								: (this._target.content ||
										((this._target.content = document.createElement("div")),
										this._target.content.classList.add("famous-dom-element-content"),
										this._target.element.insertBefore(this._target.content, this._target.element.firstChild)),
								  (this._target.content.innerHTML = t)),
							this.setSize(this._target.explicitWidth ? !1 : this._target.size[0], this._target.explicitHeight ? !1 : this._target.size[1]);
					}),
					(n.prototype.setMatrix = function(t) {
						this._assertTargetLoaded(), (this._target.element.style[l] = this._stringifyMatrix(t));
					}),
					(n.prototype.addClass = function(t) {
						this._assertTargetLoaded(), this._target.element.classList.add(t);
					}),
					(n.prototype.removeClass = function(t) {
						this._assertTargetLoaded(), this._target.element.classList.remove(t);
					}),
					(n.prototype._stringifyMatrix = function(t) {
						var e = "matrix3d(";
						return (
							(e += t[0] < 1e-6 && t[0] > -1e-6 ? "0," : t[0] + ","),
							(e += t[1] < 1e-6 && t[1] > -1e-6 ? "0," : t[1] + ","),
							(e += t[2] < 1e-6 && t[2] > -1e-6 ? "0," : t[2] + ","),
							(e += t[3] < 1e-6 && t[3] > -1e-6 ? "0," : t[3] + ","),
							(e += t[4] < 1e-6 && t[4] > -1e-6 ? "0," : t[4] + ","),
							(e += t[5] < 1e-6 && t[5] > -1e-6 ? "0," : t[5] + ","),
							(e += t[6] < 1e-6 && t[6] > -1e-6 ? "0," : t[6] + ","),
							(e += t[7] < 1e-6 && t[7] > -1e-6 ? "0," : t[7] + ","),
							(e += t[8] < 1e-6 && t[8] > -1e-6 ? "0," : t[8] + ","),
							(e += t[9] < 1e-6 && t[9] > -1e-6 ? "0," : t[9] + ","),
							(e += t[10] < 1e-6 && t[10] > -1e-6 ? "0," : t[10] + ","),
							(e += t[11] < 1e-6 && t[11] > -1e-6 ? "0," : t[11] + ","),
							(e += t[12] < 1e-6 && t[12] > -1e-6 ? "0," : t[12] + ","),
							(e += t[13] < 1e-6 && t[13] > -1e-6 ? "0," : t[13] + ","),
							(e += t[14] < 1e-6 && t[14] > -1e-6 ? "0," : t[14] + ","),
							(e += t[15] + ")")
						);
					}),
					(n.prototype.onInsertEl = function(t, e) {
						return this._insertElCallbackStore.on(t, e), this;
					}),
					(n.prototype.offInsertEl = function(t, e) {
						return this._insertElCallbackStore.off(t, e), this;
					}),
					(n.prototype.onRemoveEl = function(t, e) {
						return this._removeElCallbackStore.on(t, e), this;
					}),
					(n.prototype.offRemoveEl = function(t, e) {
						return this._removeElCallbackStore.off(t, e), this;
					}),
					(e.exports = n);
			},
			{
				"../core/Path": 20,
				"../utilities/CallbackStore": 94,
				"../utilities/vendorPrefix": 105,
				"./ElementCache": 31,
				"./Math": 32,
				"./events/EventMap": 36,
			},
		],
		31: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					(this.tagName = t.tagName.toLowerCase()), (this.void = s[this.tagName]);
					var i = t.constructor;
					(this.formElement = i === HTMLInputElement || i === HTMLTextAreaElement || i === HTMLSelectElement),
						(this.element = t),
						(this.path = e),
						(this.content = null),
						(this.size = new Int16Array(3)),
						(this.explicitHeight = !1),
						(this.explicitWidth = !1),
						(this.postRenderSize = new Float32Array(2)),
						(this.listeners = {}),
						(this.preventDefault = {}),
						(this.subscribe = {});
				}
				var s = t("./VoidElements");
				e.exports = n;
			},
			{ "./VoidElements": 33 },
		],
		32: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					var i = e[0],
						n = e[1],
						s = e[2],
						r = e[3],
						o = e[4],
						a = e[5],
						h = e[6],
						u = e[7],
						c = e[8],
						l = e[9],
						p = e[10],
						d = e[11],
						f = e[12],
						m = e[13],
						g = e[14],
						_ = e[15],
						y = i * a - n * o,
						v = i * h - s * o,
						T = i * u - r * o,
						b = n * h - s * a,
						E = n * u - r * a,
						O = s * u - r * h,
						w = c * m - l * f,
						x = c * g - p * f,
						I = c * _ - d * f,
						C = l * g - p * m,
						S = l * _ - d * m,
						R = p * _ - d * g,
						A = y * R - v * S + T * C + b * I - E * x + O * w;
					return A
						? ((A = 1 / A),
						  (t[0] = (a * R - h * S + u * C) * A),
						  (t[1] = (s * S - n * R - r * C) * A),
						  (t[2] = (m * O - g * E + _ * b) * A),
						  (t[3] = (p * E - l * O - d * b) * A),
						  (t[4] = (h * I - o * R - u * x) * A),
						  (t[5] = (i * R - s * I + r * x) * A),
						  (t[6] = (g * T - f * O - _ * v) * A),
						  (t[7] = (c * O - p * T + d * v) * A),
						  (t[8] = (o * S - a * I + u * w) * A),
						  (t[9] = (n * I - i * S - r * w) * A),
						  (t[10] = (f * E - m * T + _ * y) * A),
						  (t[11] = (l * T - c * E - d * y) * A),
						  (t[12] = (a * x - o * C - h * w) * A),
						  (t[13] = (i * C - n * x + s * w) * A),
						  (t[14] = (m * v - f * b - g * y) * A),
						  (t[15] = (c * b - l * v + p * y) * A),
						  t)
						: null;
				}
				function s(t, e, i) {
					var n,
						s,
						r,
						o,
						a = e[0],
						h = e[1],
						u = e[2],
						c = e[3],
						l = e[4],
						p = e[5],
						d = e[6],
						f = e[7],
						m = e[8],
						g = e[9],
						_ = e[10],
						y = e[11],
						v = e[12],
						T = e[13],
						b = e[14],
						E = e[15],
						O = i[0],
						w = i[1],
						x = i[2],
						I = i[3],
						C = i[4],
						S = i[5],
						R = i[6],
						A = i[7],
						M = i[8],
						D = i[9],
						N = i[10],
						L = i[11],
						z = i[12],
						U = i[13],
						P = i[14],
						F = i[15],
						G = !1;
					return (
						(n = O * a + w * l + x * m + I * v),
						(s = O * h + w * p + x * g + I * T),
						(r = O * u + w * d + x * _ + I * b),
						(o = O * c + w * f + x * y + I * E),
						(G = G ? G : n === t[0] || s === t[1] || r === t[2] || o === t[3]),
						(t[0] = n),
						(t[1] = s),
						(t[2] = r),
						(t[3] = o),
						(O = C),
						(w = S),
						(x = R),
						(I = A),
						(n = O * a + w * l + x * m + I * v),
						(s = O * h + w * p + x * g + I * T),
						(r = O * u + w * d + x * _ + I * b),
						(o = O * c + w * f + x * y + I * E),
						(G = G ? G : n === t[4] || s === t[5] || r === t[6] || o === t[7]),
						(t[4] = n),
						(t[5] = s),
						(t[6] = r),
						(t[7] = o),
						(O = M),
						(w = D),
						(x = N),
						(I = L),
						(n = O * a + w * l + x * m + I * v),
						(s = O * h + w * p + x * g + I * T),
						(r = O * u + w * d + x * _ + I * b),
						(o = O * c + w * f + x * y + I * E),
						(G = G ? G : n === t[8] || s === t[9] || r === t[10] || o === t[11]),
						(t[8] = n),
						(t[9] = s),
						(t[10] = r),
						(t[11] = o),
						(O = z),
						(w = U),
						(x = P),
						(I = F),
						(n = O * a + w * l + x * m + I * v),
						(s = O * h + w * p + x * g + I * T),
						(r = O * u + w * d + x * _ + I * b),
						(o = O * c + w * f + x * y + I * E),
						(G = G ? G : n === t[12] || s === t[13] || r === t[14] || o === t[15]),
						(t[12] = n),
						(t[13] = s),
						(t[14] = r),
						(t[15] = o),
						t
					);
				}
				e.exports = { multiply: s, invert: n };
			},
			{},
		],
		33: [
			function(t, e, i) {
				"use strict";
				var n = {
					area: !0,
					base: !0,
					br: !0,
					col: !0,
					embed: !0,
					hr: !0,
					img: !0,
					input: !0,
					keygen: !0,
					link: !0,
					meta: !0,
					param: !0,
					source: !0,
					track: !0,
					wbr: !0,
				};
				e.exports = n;
			},
			{},
		],
		34: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t), (this.data = t.data);
				}
				var s = t("./UIEvent");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "CompositionEvent";
					}),
					(e.exports = n);
			},
			{ "./UIEvent": 42 },
		],
		35: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.type = t.type), (this.defaultPrevented = t.defaultPrevented), (this.timeStamp = t.timeStamp);
					var e = t.target.constructor;
					(e === HTMLInputElement || e === HTMLTextAreaElement || e === HTMLSelectElement) && (this.value = t.target.value);
				}
				(n.prototype.toString = function() {
					return "Event";
				}),
					(e.exports = n);
			},
			{},
		],
		36: [
			function(t, e, i) {
				"use strict";
				var n = t("./CompositionEvent"),
					s = t("./Event"),
					r = t("./FocusEvent"),
					o = t("./InputEvent"),
					a = t("./KeyboardEvent"),
					h = t("./MouseEvent"),
					u = t("./TouchEvent"),
					c = t("./UIEvent"),
					l = t("./WheelEvent"),
					p = {
						change: [s, !0],
						submit: [s, !0],
						abort: [s, !1],
						beforeinput: [o, !0],
						blur: [r, !1],
						click: [h, !0],
						compositionend: [n, !0],
						compositionstart: [n, !0],
						compositionupdate: [n, !0],
						dblclick: [h, !0],
						focus: [r, !1],
						focusin: [r, !0],
						focusout: [r, !0],
						input: [o, !0],
						keydown: [a, !0],
						keyup: [a, !0],
						load: [s, !1],
						mousedown: [h, !0],
						mouseenter: [h, !1],
						mouseleave: [h, !1],
						mousemove: [h, !1],
						mouseout: [h, !0],
						mouseover: [h, !0],
						mouseup: [h, !0],
						contextMenu: [h, !0],
						resize: [c, !1],
						scroll: [c, !1],
						select: [s, !0],
						unload: [s, !1],
						wheel: [l, !0],
						touchcancel: [u, !0],
						touchend: [u, !0],
						touchmove: [u, !0],
						touchstart: [u, !0],
					};
				e.exports = p;
			},
			{
				"./CompositionEvent": 34,
				"./Event": 35,
				"./FocusEvent": 37,
				"./InputEvent": 38,
				"./KeyboardEvent": 39,
				"./MouseEvent": 40,
				"./TouchEvent": 41,
				"./UIEvent": 42,
				"./WheelEvent": 43,
			},
		],
		37: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
				}
				var s = t("./UIEvent");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "FocusEvent";
					}),
					(e.exports = n);
			},
			{ "./UIEvent": 42 },
		],
		38: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t),
						(this.inputType = t.inputType),
						(this.data = t.data),
						(this.isComposing = t.isComposing),
						(this.targetRange = t.targetRange);
				}
				var s = t("./UIEvent");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "InputEvent";
					}),
					(e.exports = n);
			},
			{ "./UIEvent": 42 },
		],
		39: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t),
						(this.DOM_KEY_LOCATION_STANDARD = 0),
						(this.DOM_KEY_LOCATION_LEFT = 1),
						(this.DOM_KEY_LOCATION_RIGHT = 2),
						(this.DOM_KEY_LOCATION_NUMPAD = 3),
						(this.key = t.key),
						(this.code = t.code),
						(this.location = t.location),
						(this.ctrlKey = t.ctrlKey),
						(this.shiftKey = t.shiftKey),
						(this.altKey = t.altKey),
						(this.metaKey = t.metaKey),
						(this.repeat = t.repeat),
						(this.isComposing = t.isComposing),
						(this.keyCode = t.keyCode);
				}
				var s = t("./UIEvent");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "KeyboardEvent";
					}),
					(e.exports = n);
			},
			{ "./UIEvent": 42 },
		],
		40: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t),
						(this.screenX = t.screenX),
						(this.screenY = t.screenY),
						(this.clientX = t.clientX),
						(this.clientY = t.clientY),
						(this.ctrlKey = t.ctrlKey),
						(this.shiftKey = t.shiftKey),
						(this.altKey = t.altKey),
						(this.metaKey = t.metaKey),
						(this.button = t.button),
						(this.buttons = t.buttons),
						(this.pageX = t.pageX),
						(this.pageY = t.pageY),
						(this.x = t.x),
						(this.y = t.y),
						(this.offsetX = t.offsetX),
						(this.offsetY = t.offsetY);
				}
				var s = t("./UIEvent");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "MouseEvent";
					}),
					(e.exports = n);
			},
			{ "./UIEvent": 42 },
		],
		41: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.identifier = t.identifier),
						(this.screenX = t.screenX),
						(this.screenY = t.screenY),
						(this.clientX = t.clientX),
						(this.clientY = t.clientY),
						(this.pageX = t.pageX),
						(this.pageY = t.pageY);
				}
				function s(t) {
					if (!t) return a;
					for (var e = [], i = 0; i < t.length; i++) {
						e[i] = new n(t[i]);
					}
					return e;
				}
				function r(t) {
					o.call(this, t),
						(this.touches = s(t.touches)),
						(this.targetTouches = s(t.targetTouches)),
						(this.changedTouches = s(t.changedTouches)),
						(this.altKey = t.altKey),
						(this.metaKey = t.metaKey),
						(this.ctrlKey = t.ctrlKey),
						(this.shiftKey = t.shiftKey);
				}
				var o = t("./UIEvent"),
					a = [];
				(r.prototype = Object.create(o.prototype)),
					(r.prototype.constructor = r),
					(r.prototype.toString = function() {
						return "TouchEvent";
					}),
					(e.exports = r);
			},
			{ "./UIEvent": 42 },
		],
		42: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t), (this.detail = t.detail);
				}
				var s = t("./Event");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "UIEvent";
					}),
					(e.exports = n);
			},
			{ "./Event": 35 },
		],
		43: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t),
						(this.DOM_DELTA_PIXEL = 0),
						(this.DOM_DELTA_LINE = 1),
						(this.DOM_DELTA_PAGE = 2),
						(this.deltaX = t.deltaX),
						(this.deltaY = t.deltaY),
						(this.deltaZ = t.deltaZ),
						(this.deltaMode = t.deltaMode);
				}
				var s = t("./MouseEvent");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.toString = function() {
						return "WheelEvent";
					}),
					(e.exports = n);
			},
			{ "./MouseEvent": 40 },
		],
		44: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					CompositionEvent: t("./CompositionEvent"),
					Event: t("./Event"),
					EventMap: t("./EventMap"),
					FocusEvent: t("./FocusEvent"),
					InputEvent: t("./InputEvent"),
					KeyboardEvent: t("./KeyboardEvent"),
					MouseEvent: t("./MouseEvent"),
					TouchEvent: t("./TouchEvent"),
					UIEvent: t("./UIEvent"),
					WheelEvent: t("./WheelEvent"),
				};
			},
			{
				"./CompositionEvent": 34,
				"./Event": 35,
				"./EventMap": 36,
				"./FocusEvent": 37,
				"./InputEvent": 38,
				"./KeyboardEvent": 39,
				"./MouseEvent": 40,
				"./TouchEvent": 41,
				"./UIEvent": 42,
				"./WheelEvent": 43,
			},
		],
		45: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					DOMRenderer: t("./DOMRenderer"),
					ElementCache: t("./ElementCache"),
					Events: t("./events"),
					Math: t("./Math"),
					VoidElements: t("./VoidElements"),
				};
			},
			{ "./DOMRenderer": 30, "./ElementCache": 31, "./Math": 32, "./VoidElements": 33, "./events": 44 },
		],
		46: [
			function(t, e, i) {
				e.exports = {
					components: t("./components"),
					core: t("./core"),
					renderLoops: t("./render-loops"),
					domRenderables: t("./dom-renderables"),
					domRenderers: t("./dom-renderers"),
					math: t("./math"),
					physics: t("./physics"),
					renderers: t("./renderers"),
					transitions: t("./transitions"),
					utilities: t("./utilities"),
					webglRenderables: t("./webgl-renderables"),
					webglRenderers: t("./webgl-renderers"),
					webglGeometries: t("./webgl-geometries"),
					webglMaterials: t("./webgl-materials"),
					webglShaders: t("./webgl-shaders"),
					polyfills: t("./polyfills"),
				};
			},
			{
				"./components": 12,
				"./core": 27,
				"./dom-renderables": 29,
				"./dom-renderers": 45,
				"./math": 51,
				"./physics": 79,
				"./polyfills": 81,
				"./render-loops": 84,
				"./renderers": 89,
				"./transitions": 93,
				"./utilities": 101,
				"./webgl-geometries": 110,
				"./webgl-materials": 124,
				"./webgl-renderables": 126,
				"./webgl-renderers": 139,
				"./webgl-shaders": 141,
			},
		],
		47: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					this.values = t || [1, 0, 0, 0, 1, 0, 0, 0, 1];
				}
				(n.prototype.get = function() {
					return this.values;
				}),
					(n.prototype.set = function(t) {
						return (this.values = t), this;
					}),
					(n.prototype.copy = function(t) {
						var e = this.values,
							i = t.values;
						return (
							(e[0] = i[0]),
							(e[1] = i[1]),
							(e[2] = i[2]),
							(e[3] = i[3]),
							(e[4] = i[4]),
							(e[5] = i[5]),
							(e[6] = i[6]),
							(e[7] = i[7]),
							(e[8] = i[8]),
							this
						);
					}),
					(n.prototype.vectorMultiply = function(t, e) {
						var i = this.values,
							n = t.x,
							s = t.y,
							r = t.z;
						return (e.x = i[0] * n + i[1] * s + i[2] * r), (e.y = i[3] * n + i[4] * s + i[5] * r), (e.z = i[6] * n + i[7] * s + i[8] * r), e;
					}),
					(n.prototype.multiply = function(t) {
						var e = this.values,
							i = t.values,
							n = e[0],
							s = e[1],
							r = e[2],
							o = e[3],
							a = e[4],
							h = e[5],
							u = e[6],
							c = e[7],
							l = e[8],
							p = i[0],
							d = i[1],
							f = i[2],
							m = i[3],
							g = i[4],
							_ = i[5],
							y = i[6],
							v = i[7],
							T = i[8];
						return (
							(e[0] = n * p + s * m + r * y),
							(e[1] = n * d + s * g + r * v),
							(e[2] = n * f + s * _ + r * T),
							(e[3] = o * p + a * m + h * y),
							(e[4] = o * d + a * g + h * v),
							(e[5] = o * f + a * _ + h * T),
							(e[6] = u * p + c * m + l * y),
							(e[7] = u * d + c * g + l * v),
							(e[8] = u * f + c * _ + l * T),
							this
						);
					}),
					(n.prototype.transpose = function() {
						var t = this.values,
							e = t[1],
							i = t[2],
							n = t[3],
							s = t[5],
							r = t[6],
							o = t[7];
						return (t[1] = n), (t[2] = r), (t[3] = e), (t[5] = o), (t[6] = i), (t[7] = s), this;
					}),
					(n.prototype.getDeterminant = function() {
						var t = this.values,
							e = t[3],
							i = t[4],
							n = t[5],
							s = t[6],
							r = t[7],
							o = t[8],
							a = t[0] * (i * o - n * r) - t[1] * (e * o - n * s) + t[2] * (e * r - i * s);
						return a;
					}),
					(n.prototype.inverse = function() {
						var t = this.values,
							e = t[0],
							i = t[1],
							n = t[2],
							s = t[3],
							r = t[4],
							o = t[5],
							a = t[6],
							h = t[7],
							u = t[8],
							c = e * (r * u - o * h) - i * (s * u - o * a) + n * (s * h - r * a);
						return Math.abs(c) < 1e-40
							? null
							: ((c = 1 / c),
							  (t[0] = (r * u - o * h) * c),
							  (t[3] = (-s * u + o * a) * c),
							  (t[6] = (s * h - r * a) * c),
							  (t[1] = (-i * u + n * h) * c),
							  (t[4] = (e * u - n * a) * c),
							  (t[7] = (-e * h + i * a) * c),
							  (t[2] = (i * o - n * r) * c),
							  (t[5] = (-e * o + n * s) * c),
							  (t[8] = (e * r - i * s) * c),
							  this);
					}),
					(n.clone = function(t) {
						return new n(t.values.slice());
					}),
					(n.inverse = function(t, e) {
						var i = t.values,
							n = e.values,
							s = i[0],
							r = i[1],
							o = i[2],
							a = i[3],
							h = i[4],
							u = i[5],
							c = i[6],
							l = i[7],
							p = i[8],
							d = s * (h * p - u * l) - r * (a * p - u * c) + o * (a * l - h * c);
						return Math.abs(d) < 1e-40
							? null
							: ((d = 1 / d),
							  (n[0] = (h * p - u * l) * d),
							  (n[3] = (-a * p + u * c) * d),
							  (n[6] = (a * l - h * c) * d),
							  (n[1] = (-r * p + o * l) * d),
							  (n[4] = (s * p - o * c) * d),
							  (n[7] = (-s * l + r * c) * d),
							  (n[2] = (r * u - o * h) * d),
							  (n[5] = (-s * u + o * a) * d),
							  (n[8] = (s * h - r * a) * d),
							  e);
					}),
					(n.transpose = function(t, e) {
						var i = t.values,
							n = e.values,
							s = i[0],
							r = i[1],
							o = i[2],
							a = i[3],
							h = i[4],
							u = i[5],
							c = i[6],
							l = i[7],
							p = i[8];
						return (n[0] = s), (n[1] = a), (n[2] = c), (n[3] = r), (n[4] = h), (n[5] = l), (n[6] = o), (n[7] = u), (n[8] = p), e;
					}),
					(n.add = function(t, e, i) {
						var n = t.values,
							s = e.values,
							r = i.values,
							o = n[0],
							a = n[1],
							h = n[2],
							u = n[3],
							c = n[4],
							l = n[5],
							p = n[6],
							d = n[7],
							f = n[8],
							m = s[0],
							g = s[1],
							_ = s[2],
							y = s[3],
							v = s[4],
							T = s[5],
							b = s[6],
							E = s[7],
							O = s[8];
						return (
							(r[0] = o + m),
							(r[1] = a + g),
							(r[2] = h + _),
							(r[3] = u + y),
							(r[4] = c + v),
							(r[5] = l + T),
							(r[6] = p + b),
							(r[7] = d + E),
							(r[8] = f + O),
							i
						);
					}),
					(n.subtract = function(t, e, i) {
						var n = t.values,
							s = e.values,
							r = i.values,
							o = n[0],
							a = n[1],
							h = n[2],
							u = n[3],
							c = n[4],
							l = n[5],
							p = n[6],
							d = n[7],
							f = n[8],
							m = s[0],
							g = s[1],
							_ = s[2],
							y = s[3],
							v = s[4],
							T = s[5],
							b = s[6],
							E = s[7],
							O = s[8];
						return (
							(r[0] = o - m),
							(r[1] = a - g),
							(r[2] = h - _),
							(r[3] = u - y),
							(r[4] = c - v),
							(r[5] = l - T),
							(r[6] = p - b),
							(r[7] = d - E),
							(r[8] = f - O),
							i
						);
					}),
					(n.multiply = function(t, e, i) {
						var n = t.values,
							s = e.values,
							r = i.values,
							o = n[0],
							a = n[1],
							h = n[2],
							u = n[3],
							c = n[4],
							l = n[5],
							p = n[6],
							d = n[7],
							f = n[8],
							m = s[0],
							g = s[1],
							_ = s[2],
							y = s[3],
							v = s[4],
							T = s[5],
							b = s[6],
							E = s[7],
							O = s[8];
						return (
							(r[0] = o * m + a * y + h * b),
							(r[1] = o * g + a * v + h * E),
							(r[2] = o * _ + a * T + h * O),
							(r[3] = u * m + c * y + l * b),
							(r[4] = u * g + c * v + l * E),
							(r[5] = u * _ + c * T + l * O),
							(r[6] = p * m + d * y + f * b),
							(r[7] = p * g + d * v + f * E),
							(r[8] = p * _ + d * T + f * O),
							i
						);
					}),
					(e.exports = n);
			},
			{},
		],
		48: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i, n) {
					(this.w = t || 1), (this.x = e || 0), (this.y = i || 0), (this.z = n || 0);
				}
				var s = Math.sin,
					r = Math.cos,
					o = Math.asin,
					a = Math.acos,
					h = Math.atan2,
					u = Math.sqrt;
				(n.prototype.multiply = function(t) {
					var e = this.x,
						i = this.y,
						n = this.z,
						s = this.w,
						r = t.x,
						o = t.y,
						a = t.z,
						h = t.w || 0;
					return (
						(this.w = s * h - e * r - i * o - n * a),
						(this.x = e * h + r * s + o * n - i * a),
						(this.y = i * h + o * s + e * a - r * n),
						(this.z = n * h + a * s + r * i - e * o),
						this
					);
				}),
					(n.prototype.leftMultiply = function(t) {
						var e = t.x,
							i = t.y,
							n = t.z,
							s = t.w || 0,
							r = this.x,
							o = this.y,
							a = this.z,
							h = this.w;
						return (
							(this.w = s * h - e * r - i * o - n * a),
							(this.x = e * h + r * s + o * n - i * a),
							(this.y = i * h + o * s + e * a - r * n),
							(this.z = n * h + a * s + r * i - e * o),
							this
						);
					}),
					(n.prototype.rotateVector = function(t, e) {
						var i = this.w,
							n = -this.x,
							s = -this.y,
							r = -this.z,
							o = t.x,
							a = t.y,
							h = t.z,
							u = -n * o - s * a - r * h,
							c = o * i + a * r - s * h,
							l = a * i + n * h - o * r,
							p = h * i + o * s - n * a,
							d = i,
							f = -n,
							m = -s,
							g = -r;
						return (e.x = c * d + f * u + m * p - l * g), (e.y = l * d + m * u + c * g - f * p), (e.z = p * d + g * u + f * l - c * m), e;
					}),
					(n.prototype.invert = function() {
						return (this.w = -this.w), (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this;
					}),
					(n.prototype.conjugate = function() {
						return (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this;
					}),
					(n.prototype.length = function() {
						var t = this.w,
							e = this.x,
							i = this.y,
							n = this.z;
						return u(t * t + e * e + i * i + n * n);
					}),
					(n.prototype.normalize = function() {
						var t = this.w,
							e = this.x,
							i = this.y,
							n = this.z,
							s = u(t * t + e * e + i * i + n * n);
						return 0 === s ? this : ((s = 1 / s), (this.w *= s), (this.x *= s), (this.y *= s), (this.z *= s), this);
					}),
					(n.prototype.set = function(t, e, i, n) {
						return null != t && (this.w = t), null != e && (this.x = e), null != i && (this.y = i), null != n && (this.z = n), this;
					}),
					(n.prototype.copy = function(t) {
						return (this.w = t.w), (this.x = t.x), (this.y = t.y), (this.z = t.z), this;
					}),
					(n.prototype.clear = function() {
						return (this.w = 1), (this.x = 0), (this.y = 0), (this.z = 0), this;
					}),
					(n.prototype.dot = function(t) {
						return this.w * t.w + this.x * t.x + this.y * t.y + this.z * t.z;
					}),
					(n.prototype.slerp = function(t, e, i) {
						var n,
							r,
							o,
							h,
							u,
							c = this.w,
							l = this.x,
							p = this.y,
							d = this.z,
							f = t.w,
							m = t.x,
							g = t.y,
							_ = t.z;
						return (
							(r = c * f + l * m + p * g + d * _),
							1 - r > 1e-5 ? ((n = a(r)), (o = s(n)), (h = s((1 - e) * n) / o), (u = s(e * n) / o)) : ((h = 1 - e), (u = e)),
							(i.w = c * h + f * u),
							(i.x = l * h + m * u),
							(i.y = p * h + g * u),
							(i.z = d * h + _ * u),
							i
						);
					}),
					(n.prototype.toMatrix = function(t) {
						var e = this.w,
							i = this.x,
							n = this.y,
							s = this.z,
							r = i * i,
							o = n * n,
							a = s * s,
							h = i * n,
							u = i * s,
							c = n * s;
						return t.set([
							1 - 2 * (o + a),
							2 * (h - e * s),
							2 * (u + e * n),
							2 * (h + e * s),
							1 - 2 * (r + a),
							2 * (c - e * i),
							2 * (u - e * n),
							2 * (c + e * i),
							1 - 2 * (r + o),
						]);
					}),
					(n.prototype.toEuler = function(t) {
						var e = this.w,
							i = this.x,
							n = this.y,
							s = this.z,
							r = i * i,
							a = n * n,
							u = s * s,
							c = 2 * (i * s + n * e);
						return (
							(c = -1 > c ? -1 : c > 1 ? 1 : c),
							(t.x = h(2 * (i * e - n * s), 1 - 2 * (r + a))),
							(t.y = o(c)),
							(t.z = h(2 * (s * e - i * n), 1 - 2 * (a + u))),
							t
						);
					}),
					(n.prototype.fromEuler = function(t, e, i) {
						var n = 0.5 * t,
							o = 0.5 * e,
							a = 0.5 * i,
							h = s(n),
							u = s(o),
							c = s(a),
							l = r(n),
							p = r(o),
							d = r(a);
						return (
							(this.w = l * p * d - h * u * c),
							(this.x = h * p * d + l * u * c),
							(this.y = l * u * d - h * p * c),
							(this.z = l * p * c + h * u * d),
							this
						);
					}),
					(n.prototype.fromAngleAxis = function(t, e, i, n) {
						var o = u(e * e + i * i + n * n);
						if (0 === o) (this.w = 1), (this.x = this.y = this.z = 0);
						else {
							o = 1 / o;
							var a = 0.5 * t,
								h = s(a);
							(this.w = r(a)), (this.x = h * e * o), (this.y = h * i * o), (this.z = h * n * o);
						}
						return this;
					}),
					(n.multiply = function(t, e, i) {
						var n = t.w || 0,
							s = t.x,
							r = t.y,
							o = t.z,
							a = e.w || 0,
							h = e.x,
							u = e.y,
							c = e.z;
						return (
							(i.w = n * a - s * h - r * u - o * c),
							(i.x = s * a + h * n + u * o - r * c),
							(i.y = r * a + u * n + s * c - h * o),
							(i.z = o * a + c * n + h * r - s * u),
							i
						);
					}),
					(n.normalize = function(t, e) {
						var i = t.w,
							n = t.x,
							s = t.y,
							r = t.z,
							o = u(i * i + n * n + s * s + r * r);
						return 0 === o ? this : ((o = 1 / o), (e.w *= o), (e.x *= o), (e.y *= o), (e.z *= o), e);
					}),
					(n.conjugate = function(t, e) {
						return (e.w = t.w), (e.x = -t.x), (e.y = -t.y), (e.z = -t.z), e;
					}),
					(n.clone = function(t) {
						return new n(t.w, t.x, t.y, t.z);
					}),
					(n.dot = function(t, e) {
						return t.w * e.w + t.x * e.x + t.y * e.y + t.z * e.z;
					}),
					(e.exports = n);
			},
			{},
		],
		49: [
			function(t, e, i) {
				"use strict";
				var n = function n(t, e) {
					t instanceof Array || t instanceof Float32Array ? ((this.x = t[0] || 0), (this.y = t[1] || 0)) : ((this.x = t || 0), (this.y = e || 0));
				};
				(n.prototype.set = function(t, e) {
					return null != t && (this.x = t), null != e && (this.y = e), this;
				}),
					(n.prototype.add = function(t) {
						return (this.x += t.x), (this.y += t.y), this;
					}),
					(n.prototype.subtract = function(t) {
						return (this.x -= t.x), (this.y -= t.y), this;
					}),
					(n.prototype.scale = function(t) {
						return t instanceof n ? ((this.x *= t.x), (this.y *= t.y)) : ((this.x *= t), (this.y *= t)), this;
					}),
					(n.prototype.rotate = function(t) {
						var e = this.x,
							i = this.y,
							n = Math.cos(t),
							s = Math.sin(t);
						return (this.x = e * n - i * s), (this.y = e * s + i * n), this;
					}),
					(n.prototype.dot = function(t) {
						return this.x * t.x + this.y * t.y;
					}),
					(n.prototype.cross = function(t) {
						return this.x * t.y - this.y * t.x;
					}),
					(n.prototype.invert = function() {
						return (this.x *= -1), (this.y *= -1), this;
					}),
					(n.prototype.map = function(t) {
						return (this.x = t(this.x)), (this.y = t(this.y)), this;
					}),
					(n.prototype.length = function() {
						var t = this.x,
							e = this.y;
						return Math.sqrt(t * t + e * e);
					}),
					(n.prototype.copy = function(t) {
						return (this.x = t.x), (this.y = t.y), this;
					}),
					(n.prototype.clear = function() {
						return (this.x = 0), (this.y = 0), this;
					}),
					(n.prototype.isZero = function() {
						return 0 !== this.x || 0 !== this.y ? !1 : !0;
					}),
					(n.prototype.toArray = function() {
						return [this.x, this.y];
					}),
					(n.normalize = function(t, e) {
						var i = t.x,
							n = t.y,
							s = Math.sqrt(i * i + n * n) || 1;
						return (s = 1 / s), (e.x = t.x * s), (e.y = t.y * s), e;
					}),
					(n.clone = function(t) {
						return new n(t.x, t.y);
					}),
					(n.add = function(t, e, i) {
						return (i.x = t.x + e.x), (i.y = t.y + e.y), i;
					}),
					(n.subtract = function(t, e, i) {
						return (i.x = t.x - e.x), (i.y = t.y - e.y), i;
					}),
					(n.scale = function(t, e, i) {
						return (i.x = t.x * e), (i.y = t.y * e), i;
					}),
					(n.dot = function(t, e) {
						return t.x * e.x + t.y * e.y;
					}),
					(n.cross = function(t, e) {
						return t.x * e.y - t.y * e.x;
					}),
					(e.exports = n);
			},
			{},
		],
		50: [
			function(t, e, i) {
				"use strict";
				var n = function n(t, e, i) {
					(this.x = t || 0), (this.y = e || 0), (this.z = i || 0);
				};
				(n.prototype.set = function(t, e, i) {
					return null != t && (this.x = t), null != e && (this.y = e), null != i && (this.z = i), this;
				}),
					(n.prototype.add = function(t) {
						return (this.x += t.x), (this.y += t.y), (this.z += t.z), this;
					}),
					(n.prototype.subtract = function(t) {
						return (this.x -= t.x), (this.y -= t.y), (this.z -= t.z), this;
					}),
					(n.prototype.rotateX = function(t) {
						var e = this.y,
							i = this.z,
							n = Math.cos(t),
							s = Math.sin(t);
						return (this.y = e * n - i * s), (this.z = e * s + i * n), this;
					}),
					(n.prototype.rotateY = function(t) {
						var e = this.x,
							i = this.z,
							n = Math.cos(t),
							s = Math.sin(t);
						return (this.x = i * s + e * n), (this.z = i * n - e * s), this;
					}),
					(n.prototype.rotateZ = function(t) {
						var e = this.x,
							i = this.y,
							n = Math.cos(t),
							s = Math.sin(t);
						return (this.x = e * n - i * s), (this.y = e * s + i * n), this;
					}),
					(n.prototype.dot = function(t) {
						return this.x * t.x + this.y * t.y + this.z * t.z;
					}),
					(n.prototype.cross = function(t) {
						var e = this.x,
							i = this.y,
							n = this.z,
							s = t.x,
							r = t.y,
							o = t.z;
						return (this.x = i * o - n * r), (this.y = n * s - e * o), (this.z = e * r - i * s), this;
					}),
					(n.prototype.scale = function(t) {
						return (this.x *= t), (this.y *= t), (this.z *= t), this;
					}),
					(n.prototype.invert = function() {
						return (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this;
					}),
					(n.prototype.map = function(t) {
						return (this.x = t(this.x)), (this.y = t(this.y)), (this.z = t(this.z)), this;
					}),
					(n.prototype.length = function() {
						var t = this.x,
							e = this.y,
							i = this.z;
						return Math.sqrt(t * t + e * e + i * i);
					}),
					(n.prototype.lengthSq = function() {
						var t = this.x,
							e = this.y,
							i = this.z;
						return t * t + e * e + i * i;
					}),
					(n.prototype.copy = function(t) {
						return (this.x = t.x), (this.y = t.y), (this.z = t.z), this;
					}),
					(n.prototype.clear = function() {
						return (this.x = 0), (this.y = 0), (this.z = 0), this;
					}),
					(n.prototype.isZero = function() {
						return 0 === this.x && 0 === this.y && 0 === this.z;
					}),
					(n.prototype.toArray = function() {
						return [this.x, this.y, this.z];
					}),
					(n.prototype.normalize = function() {
						var t = this.x,
							e = this.y,
							i = this.z,
							n = Math.sqrt(t * t + e * e + i * i) || 1;
						return (n = 1 / n), (this.x *= n), (this.y *= n), (this.z *= n), this;
					}),
					(n.prototype.applyRotation = function(t) {
						var e = t.w,
							i = -t.x,
							n = -t.y,
							s = -t.z,
							r = this.x,
							o = this.y,
							a = this.z,
							h = -i * r - n * o - s * a,
							u = r * e + o * s - n * a,
							c = o * e + i * a - r * s,
							l = a * e + r * n - i * o,
							p = e,
							d = -i,
							f = -n,
							m = -s;
						return (this.x = u * p + d * h + f * l - c * m), (this.y = c * p + f * h + u * m - d * l), (this.z = l * p + m * h + d * c - u * f), this;
					}),
					(n.prototype.applyMatrix = function(t) {
						var e = t.get(),
							i = this.x,
							n = this.y,
							s = this.z;
						return (
							(this.x = e[0] * i + e[1] * n + e[2] * s), (this.y = e[3] * i + e[4] * n + e[5] * s), (this.z = e[6] * i + e[7] * n + e[8] * s), this
						);
					}),
					(n.normalize = function(t, e) {
						var i = t.x,
							n = t.y,
							s = t.z,
							r = Math.sqrt(i * i + n * n + s * s) || 1;
						return (r = 1 / r), (e.x = i * r), (e.y = n * r), (e.z = s * r), e;
					}),
					(n.applyRotation = function(t, e, i) {
						var n = e.w,
							s = -e.x,
							r = -e.y,
							o = -e.z,
							a = t.x,
							h = t.y,
							u = t.z,
							c = -s * a - r * h - o * u,
							l = a * n + h * o - r * u,
							p = h * n + s * u - a * o,
							d = u * n + a * r - s * h,
							f = n,
							m = -s,
							g = -r,
							_ = -o;
						return (i.x = l * f + m * c + g * d - p * _), (i.y = p * f + g * c + l * _ - m * d), (i.z = d * f + _ * c + m * p - l * g), i;
					}),
					(n.clone = function(t) {
						return new n(t.x, t.y, t.z);
					}),
					(n.add = function(t, e, i) {
						return (i.x = t.x + e.x), (i.y = t.y + e.y), (i.z = t.z + e.z), i;
					}),
					(n.subtract = function(t, e, i) {
						return (i.x = t.x - e.x), (i.y = t.y - e.y), (i.z = t.z - e.z), i;
					}),
					(n.scale = function(t, e, i) {
						return (i.x = t.x * e), (i.y = t.y * e), (i.z = t.z * e), i;
					}),
					(n.dot = function(t, e) {
						return t.x * e.x + t.y * e.y + t.z * e.z;
					}),
					(n.cross = function(t, e, i) {
						var n = t.x,
							s = t.y,
							r = t.z,
							o = e.x,
							a = e.y,
							h = e.z;
						return (i.x = s * h - r * a), (i.y = r * o - n * h), (i.z = n * a - s * o), i;
					}),
					(n.project = function(t, e, i) {
						var n = t.x,
							s = t.y,
							r = t.z,
							o = e.x,
							a = e.y,
							h = e.z,
							u = n * o + s * a + r * h;
						return (u /= o * o + a * a + h * h), (i.x = o * u), (i.y = a * u), (i.z = h * u), i;
					}),
					(e.exports = n);
			},
			{},
		],
		51: [
			function(t, e, i) {
				e.exports = { Mat33: t("./Mat33"), Quaternion: t("./Quaternion"), Vec2: t("./Vec2"), Vec3: t("./Vec3") };
			},
			{ "./Mat33": 47, "./Quaternion": 48, "./Vec2": 49, "./Vec3": 50 },
		],
		52: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					var n = _;
					return p.cross(t, e, n), p.cross(n, i, n), n;
				}
				function s(t, e) {
					for (var i, n, s, r, o = -(1 / 0), a = 0; a < t.length; a++) {
						(s = t[a]), (n = p.dot(s, e)), n > o && ((i = s), (o = n), (r = a));
					}
					return { vertex: i, index: r };
				}
				function r(t, e, i) {
					(this.distance = t), (this.normal = e), (this.vertexIndices = i);
				}
				function o() {
					(this.vertices = []),
						(this.numVertices = 0),
						(this.features = []),
						(this.numFeatures = 0),
						(this.lastVertexIndex = 0),
						(this._IDPool = { vertices: [], features: [] });
				}
				function a(t, e, i, n) {
					for (var s = t[i].vertex, r = t[n].vertex, o = 0, a = e.length; a > o; o++) {
						var h = e[o];
						if (h) {
							var u = t[h[0]].vertex,
								c = t[h[1]].vertex;
							if ((s === u && r === c) || (s === c && r === u)) return void (e[o] = null);
						}
					}
					e.push([i, n]);
				}
				function h(t, e) {
					e = e || 1e3;
					var i,
						n,
						s = u(t, e),
						r = [];
					for (i = 0, n = s.features.length; n > i; i++) {
						var o = s.features[i];
						o && r.push(o.vertexIndices);
					}
					var a = l(s.vertices, r),
						h = a.centroid,
						c = [];
					for (i = 0, n = s.vertices.length; n > i; i++) {
						c.push(p.subtract(s.vertices[i].vertex, h, new p()));
					}
					var d = [];
					for (i = 0, n = c.length; n > i; i++) {
						d.push(p.normalize(c[i], new p()));
					}
					var f = {},
						m = {};
					for (i = 0; i < r.length; i++) {
						var g = r[i][0],
							_ = r[i][1],
							y = r[i][2];
						(m[g] = m[g] || {}),
							(m[_] = m[_] || {}),
							(m[y] = m[y] || {}),
							(f[g] = f[g] || []),
							(f[_] = f[_] || []),
							(f[y] = f[y] || []),
							m[g][_] || ((m[g][_] = 1), f[g].push(_)),
							m[g][y] || ((m[g][y] = 1), f[g].push(y)),
							m[_][g] || ((m[_][g] = 1), f[_].push(g)),
							m[_][y] || ((m[_][y] = 1), f[_].push(y)),
							m[y][g] || ((m[y][g] = 1), f[y].push(g)),
							m[y][_] || ((m[y][_] = 1), f[y].push(_));
					}
					(this.indices = r), (this.vertices = c), (this.normals = d), (this.polyhedralProperties = a), (this.graph = f);
				}
				function u(t, e) {
					var i = new o();
					i.addVertex(s(t, new p(1, 0, 0))), i.addVertex(s(t, new p(-1, 0, 0)));
					var r,
						a,
						h,
						u,
						c,
						l,
						d = i.vertices[0].vertex,
						f = i.vertices[1].vertex,
						m = p.subtract(f, d, b),
						g = -(1 / 0);
					for (c = 0; c < t.length; c++) {
						if (((a = t[c]), a !== d && a !== f)) {
							var _ = p.subtract(a, d, y);
							(r = p.dot(_, n(m, _, m))), (r = 0 > r ? -1 * r : r), r > g && ((g = r), (h = a), (u = c));
						}
					}
					i.addVertex({ vertex: h, index: u });
					var v = h,
						T = p.subtract(v, d, E),
						I = p.cross(m, T, new p());
					for (I.normalize(), g = -(1 / 0), c = 0; c < t.length; c++) {
						(a = t[c]),
							a !== d && a !== f && a !== v && ((r = p.dot(p.subtract(a, d, y), I)), (r = 0 > r ? -1 * r : r), r > g && ((g = r), (h = a), (u = c)));
					}
					i.addVertex({ vertex: h, index: u });
					var C = h,
						S = p.subtract(C, d, O),
						R = p.subtract(v, f, w),
						A = p.subtract(C, f, x),
						M = p.cross(T, S, new p()),
						D = p.cross(m, S, new p()),
						N = p.cross(R, A, new p());
					M.normalize(),
						D.normalize(),
						N.normalize(),
						p.dot(I, S) > 0 && I.invert(),
						p.dot(M, m) > 0 && M.invert(),
						p.dot(D, T) > 0 && D.invert(),
						p.dot(N, m) < 0 && N.invert();
					var L = 0,
						z = 1,
						U = 2,
						P = 3;
					i.addFeature(null, I, [L, z, U]), i.addFeature(null, M, [L, U, P]), i.addFeature(null, D, [L, z, P]), i.addFeature(null, N, [z, U, P]);
					var F = {};
					for (c = 0, l = i.vertices.length; l > c; c++) {
						F[i.vertices[c].index] = !0;
					}
					var G = d.x + f.x + v.x + C.x,
						V = d.y + f.y + v.y + C.y,
						k = d.z + f.z + v.z + C.z,
						H = new p(G, V, k);
					H.scale(0.25);
					for (var B = i.features, q = 0; q++ < e; ) {
						var W = null;
						for (c = 0, l = B.length; l > c; c++) {
							if (B[c] && !B[c].done) {
								(W = B[c]), (h = null), (u = null), (d = i.vertices[W.vertexIndices[0]].vertex);
								var j = s(t, W.normal);
								(h = j.vertex), (u = j.index);
								var Y = p.dot(p.subtract(h, d, y), W.normal);
								0.001 > Y || F[u] ? (W.done = !0) : ((F[u] = !0), i.addVertex(j), i.reshape(H));
							}
						}
						if (null === W) break;
					}
					return i;
				}
				function c(t, e, i, n, s) {
					var r = t + e;
					n[0] = r + i;
					var o = t * t,
						a = o + e * r;
					(n[1] = a + i * n[0]),
						(n[2] = t * o + e * a + i * n[1]),
						(s[0] = n[1] + t * (n[0] + t)),
						(s[1] = n[1] + e * (n[0] + e)),
						(s[2] = n[1] + i * (n[0] + i));
				}
				function l(t, e) {
					var i,
						n,
						s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						r = [],
						o = [],
						a = [],
						h = [],
						u = [],
						l = [];
					for (i = 0, n = e.length; n > i; i++) {
						var f = t[e[i][0]].vertex,
							m = t[e[i][1]].vertex,
							g = t[e[i][2]].vertex,
							_ = p.subtract(m, f, b),
							y = p.subtract(g, f, E),
							v = _.cross(y);
						p.dot(f, v) < 0 && v.invert();
						var T = v.x,
							O = v.y,
							w = v.z,
							x = f.x,
							I = f.y,
							C = f.z,
							S = m.x,
							R = m.y,
							A = m.z,
							M = g.x,
							D = g.y,
							N = g.z;
						c(x, S, M, r, h),
							c(I, R, D, o, u),
							c(C, A, N, a, l),
							(s[0] += T * r[0]),
							(s[1] += T * r[1]),
							(s[2] += O * o[1]),
							(s[3] += w * a[1]),
							(s[4] += T * r[2]),
							(s[5] += O * o[2]),
							(s[6] += w * a[2]),
							(s[7] += T * (I * h[0] + R * h[1] + D * h[2])),
							(s[8] += O * (C * u[0] + A * u[1] + N * u[2])),
							(s[9] += w * (x * l[0] + S * l[1] + M * l[2]));
					}
					(s[0] /= 6),
						(s[1] /= 24),
						(s[2] /= 24),
						(s[3] /= 24),
						(s[4] /= 60),
						(s[5] /= 60),
						(s[6] /= 60),
						(s[7] /= 120),
						(s[8] /= 120),
						(s[9] /= 120);
					var L = 1 / 0,
						z = -(1 / 0),
						U = 1 / 0,
						P = -(1 / 0),
						F = 1 / 0,
						G = -(1 / 0);
					for (i = 0, n = t.length; n > i; i++) {
						var V = t[i].vertex;
						V.x < L && (L = V.x), V.x > z && (z = V.x), V.y < U && (U = V.y), V.y > P && (P = V.y), V.z < F && (F = V.z), V.z > G && (G = V.z);
					}
					var k = [z - L, P - U, G - F],
						H = s[0],
						B = new p(s[1], s[2], s[3]);
					B.scale(1 / H);
					var q = new d([s[4], s[7], s[9], s[7], s[5], s[8], s[9], s[8], s[6]]);
					return { size: k, volume: H, centroid: B, eulerTensor: q };
				}
				var p = t("../math/Vec3"),
					d = t("../math/Mat33"),
					f = t("../utilities/ObjectManager");
				f.register("DynamicGeometry", o), f.register("DynamicGeometryFeature", r);
				var m = f.requestDynamicGeometryFeature,
					g = f.freeDynamicGeometryFeature,
					_ = new p(),
					y = new p(),
					v = new p(),
					T = new p(),
					b = new p(),
					E = new p(),
					O = new p(),
					w = new p(),
					x = new p();
				(r.prototype.reset = function(t, e, i) {
					return (this.distance = t), (this.normal = e), (this.vertexIndices = i), this;
				}),
					(o.prototype.reset = function() {
						return (
							(this.vertices = []),
							(this.numVertices = 0),
							(this.features = []),
							(this.numFeatures = 0),
							(this.lastVertexIndex = 0),
							(this._IDPool = { vertices: [], features: [] }),
							this
						);
					}),
					(o.prototype.addVertex = function(t) {
						var e = this._IDPool.vertices.length ? this._IDPool.vertices.pop() : this.vertices.length;
						(this.vertices[e] = t), (this.lastVertexIndex = e), this.numVertices++;
					}),
					(o.prototype.removeVertex = function(t) {
						var e = this.vertices[t];
						return (this.vertices[t] = null), this._IDPool.vertices.push(t), this.numVertices--, e;
					}),
					(o.prototype.addFeature = function(t, e, i) {
						var n = this._IDPool.features.length ? this._IDPool.features.pop() : this.features.length;
						(this.features[n] = m().reset(t, e, i)), this.numFeatures++;
					}),
					(o.prototype.removeFeature = function(t) {
						var e = this.features[t];
						(this.features[t] = null), this._IDPool.features.push(t), this.numFeatures--, g(e);
					}),
					(o.prototype.getLastVertex = function() {
						return this.vertices[this.lastVertexIndex];
					}),
					(o.prototype.getFeatureClosestToOrigin = function() {
						for (var t = 1 / 0, e = null, i = this.features, n = 0, s = i.length; s > n; n++) {
							var r = i[n];
							r && r.distance < t && ((t = r.distance), (e = r));
						}
						return e;
					}),
					(o.prototype.reshape = function(t) {
						var e,
							i,
							n,
							s,
							r,
							o = this.vertices,
							h = this.getLastVertex().vertex,
							u = this.features,
							c = [];
						for (n = 0, r = u.length; r > n; n++) {
							u[n] &&
								((i = u[n].vertexIndices),
								(e = o[i[0]].vertex),
								p.dot(u[n].normal, p.subtract(h, e, v)) > -0.001 &&
									(a(o, c, i[0], i[1]), a(o, c, i[1], i[2]), a(o, c, i[2], i[0]), this.removeFeature(n)));
						}
						var l = h,
							d = this.lastVertexIndex;
						for (s = 0, r = c.length; r > s; s++) {
							if (c[s]) {
								var f = c[s][0],
									m = c[s][1],
									g = o[f].vertex,
									_ = o[m].vertex,
									T = p.subtract(g, l, b),
									O = p.subtract(_, l, E),
									w = p.cross(T, O, new p());
								if ((w.normalize(), t)) {
									var x = p.subtract(t, l, y);
									p.dot(w, x) > -0.001 && w.invert(), this.addFeature(null, w, [d, f, m]);
								} else {
									var I = p.dot(w, l);
									0 > I && (w.invert(), (I *= -1)), this.addFeature(I, w, [d, f, m]);
								}
							}
						}
					}),
					(o.prototype.simplexContainsOrigin = function(t, e) {
						var i = this.vertices.length,
							s = this.lastVertexIndex,
							r = s - 1,
							o = s - 2,
							a = s - 3;
						(r = 0 > r ? r + i : r), (o = 0 > o ? o + i : o), (a = 0 > a ? a + i : a);
						var h,
							u,
							c,
							l,
							d,
							f,
							m,
							g,
							_,
							y,
							v,
							I,
							C,
							S = this.vertices[s].vertex,
							R = this.vertices[r].vertex,
							A = this.vertices[o].vertex,
							M = this.vertices[a].vertex,
							D = p.scale(S, -1, T),
							N = p.subtract(R, S, b);
						if (4 === i) {
							if (
								((h = p.subtract(A, S, E)),
								(u = p.subtract(M, S, O)),
								(d = p.cross(N, h, new p())),
								(f = p.cross(h, u, new p())),
								(m = p.cross(N, u, new p())),
								d.normalize(),
								f.normalize(),
								m.normalize(),
								p.dot(d, u) > 0 && d.invert(),
								p.dot(f, N) > 0 && f.invert(),
								p.dot(m, h) > 0 && m.invert(),
								(_ = p.dot(d, D)),
								(y = p.dot(f, D)),
								(v = p.dot(m, D)),
								0.001 > _ && 0.001 > v && 0.001 > y)
							)
								return (
									(c = p.subtract(A, R, w)),
									(l = p.subtract(M, R, x)),
									(g = p.cross(c, l, new p())),
									g.normalize(),
									p.dot(g, N) <= 0 && g.invert(),
									(I = -1 * p.dot(g, R)),
									this.addFeature(-_, d, [s, r, o]),
									this.addFeature(-y, f, [s, o, a]),
									this.addFeature(-v, m, [s, a, r]),
									this.addFeature(-I, g, [r, o, a]),
									!0
								);
							_ >= 0.001
								? ((C = this.removeVertex(a)), t.copy(d))
								: y >= 0.001
								? ((C = this.removeVertex(r)), t.copy(f))
								: ((C = this.removeVertex(o)), t.copy(m));
						} else 3 === i ? ((h = p.subtract(A, S, E)), p.cross(N, h, t), p.dot(t, D) <= 0 && t.invert()) : t.copy(n(N, D, N));
						return C && e && e(C), !1;
					}),
					(e.exports = { DynamicGeometry: o, ConvexHull: h });
			},
			{ "../math/Mat33": 47, "../math/Vec3": 50, "../utilities/ObjectManager": 97 },
		],
		53: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.events = new l()),
						(t = t || {}),
						(this.bodies = []),
						(this.forces = []),
						(this.constraints = []),
						(this.step = t.step || 1e3 / 60),
						(this.iterations = t.iterations || 10),
						(this._indexPools = { bodies: [], forces: [], constraints: [] }),
						(this._entityMaps = { bodies: {}, forces: {}, constraints: {} }),
						(this.speed = t.speed || 1),
						(this.time = 0),
						(this.delta = 0),
						(this.origin = t.origin || new p()),
						(this.orientation = t.orientation ? t.orientation.normalize() : new d()),
						(this.frameDependent = t.frameDependent || !1),
						(this.transformBuffers = { position: [0, 0, 0], rotation: [0, 0, 0, 1] });
				}
				function s(t, e, i) {
					var n = t._entityMaps[i];
					if (null == n[e._ID]) {
						var s = t[i],
							r = t._indexPools[i];
						r.length ? (n[e._ID] = r.pop()) : (n[e._ID] = s.length), (s[n[e._ID]] = e);
					}
				}
				function r(t, e, i) {
					var n = t._entityMaps[i],
						s = n[e._ID];
					null != s && (t._indexPools[i].push(s), (t[i][s] = null), (n[e._ID] = null));
				}
				function o(t, e) {
					t.momentum.add(p.scale(t.force, e, g)),
						t.angularMomentum.add(p.scale(t.torque, e, g)),
						p.scale(t.momentum, t.inverseMass, t.velocity),
						t.inverseInertia.vectorMultiply(t.angularMomentum, t.angularVelocity),
						t.force.clear(),
						t.torque.clear();
				}
				function a(t, e) {
					if (0 !== t.restrictions) {
						var i = t.restrictions,
							n = null,
							s = null,
							r = null,
							o = null,
							a = null,
							h = null;
						32 & i && (n = 0),
							16 & i && (s = 0),
							8 & i && (r = 0),
							4 & i && (o = 0),
							2 & i && (a = 0),
							1 & i && (h = 0),
							(null !== n || null !== s || null !== r) && t.setVelocity(n, s, r),
							(null !== o || null !== a || null !== h) && t.setAngularVelocity(o, a, h);
					}
					t.position.add(p.scale(t.velocity, e, g));
					var u = t.angularVelocity,
						c = t.orientation,
						l = u.x,
						d = u.y,
						f = u.z,
						m = c.w,
						_ = c.x,
						y = c.y,
						v = c.z,
						T = 0.5 * e;
					(c.w += (-l * _ - d * y - f * v) * T),
						(c.x += (l * m + d * v - f * y) * T),
						(c.y += (d * m + f * _ - l * v) * T),
						(c.z += (f * m + l * y - d * _) * T),
						c.normalize(),
						t.updateInertia();
				}
				var h = t("./bodies/Particle"),
					u = t("./constraints/Constraint"),
					c = t("./forces/Force"),
					l = t("../utilities/CallbackStore"),
					p = t("../math/Vec3"),
					d = t("../math/Quaternion"),
					f = new p(),
					m = new d(),
					g = new p();
				(n.prototype.on = function(t, e) {
					return this.events.on(t, e), this;
				}),
					(n.prototype.off = function(t, e) {
						return this.events.off(t, e), this;
					}),
					(n.prototype.trigger = function(t, e) {
						return this.events.trigger(t, e), this;
					}),
					(n.prototype.setOrigin = function(t, e, i) {
						return this.origin.set(t, e, i), this;
					}),
					(n.prototype.setOrientation = function(t, e, i, n) {
						return this.orientation.set(t, e, i, n).normalize(), this;
					}),
					(n.prototype.add = function() {
						for (var t = 0, e = arguments.length; e > t; t++) {
							var i = arguments[t];
							if (i instanceof Array)
								for (var n = 0, s = i.length; s > n; n++) {
									var r = i[n];
									this.add(r);
								}
							else i instanceof h ? this.addBody(i) : i instanceof u ? this.addConstraint(i) : i instanceof c && this.addForce(i);
						}
						return this;
					}),
					(n.prototype.remove = function() {
						for (var t = 0, e = arguments.length; e > t; t++) {
							var i = arguments[t];
							if (i instanceof Array)
								for (var n = 0, s = i.length; s > n; n++) {
									var r = i[n];
									this.add(r);
								}
							else i instanceof h ? this.removeBody(i) : i instanceof u ? this.removeConstraint(i) : i instanceof c && this.removeForce(i);
						}
						return this;
					}),
					(n.prototype.addBody = function(t) {
						s(this, t, "bodies");
					}),
					(n.prototype.addForce = function(t) {
						s(this, t, "forces");
					}),
					(n.prototype.addConstraint = function(t) {
						s(this, t, "constraints");
					}),
					(n.prototype.removeBody = function(t) {
						r(this, t, "bodies");
					}),
					(n.prototype.removeForce = function(t) {
						r(this, t, "forces");
					}),
					(n.prototype.removeConstraint = function(t) {
						r(this, t, "constraints");
					}),
					(n.prototype.update = function(t) {
						0 === this.time && (this.time = t);
						var e = this.bodies,
							i = this.forces,
							n = this.constraints,
							s = this.frameDependent,
							r = this.step,
							h = 0.001 * r,
							u = this.speed,
							c = this.delta;
						(c += (t - this.time) * u), (this.time = t);
						for (var l, p, d, f, m; c > r; ) {
							for (this.events.trigger("prestep", t), l = 0, p = i.length; p > l; l++) {
								(d = i[l]), null !== d && d.update(t, h);
							}
							for (l = 0, p = e.length; p > l; l++) {
								(f = e[l]), null !== f && o(f, h);
							}
							for (l = 0, p = n.length; p > l; l++) {
								(m = n[l]), null !== m && m.update(t, h);
							}
							for (var g = 0, _ = this.iterations; _ > g; g++) {
								for (l = 0, p = n.length; p > l; l++) {
									(m = n[l]), null !== m && m.resolve(t, h);
								}
							}
							for (l = 0, p = e.length; p > l; l++) {
								(f = e[l]), null !== f && a(f, h);
							}
							this.events.trigger("poststep", t), s ? (c = 0) : (c -= r);
						}
						this.delta = c;
					}),
					(n.prototype.getTransform = function(t) {
						var e = this.origin,
							i = this.orientation,
							n = this.transformBuffers,
							s = t.position,
							r = t.orientation,
							o = r,
							a = s;
						return (
							1 !== i.w && ((o = d.multiply(r, i, m)), (a = i.rotateVector(s, f))),
							(n.position[0] = e.x + a.x),
							(n.position[1] = e.y + a.y),
							(n.position[2] = e.z + a.z),
							(n.rotation[0] = o.x),
							(n.rotation[1] = o.y),
							(n.rotation[2] = o.z),
							(n.rotation[3] = o.w),
							n
						);
					}),
					(e.exports = n);
			},
			{
				"../math/Quaternion": 48,
				"../math/Vec3": 50,
				"../utilities/CallbackStore": 94,
				"./bodies/Particle": 55,
				"./constraints/Constraint": 62,
				"./forces/Force": 73,
			},
		],
		54: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					o.call(this, t), (this.normals = [new s(0, 1, 0), new s(1, 0, 0), new s(0, 0, 1)]), (this.type = 2);
				}
				var s = t("../../math/Vec3"),
					r = t("./convexBodyFactory"),
					o = r([
						new s(-100, -100, -100),
						new s(100, -100, -100),
						new s(-100, -100, 100),
						new s(100, -100, 100),
						new s(-100, 100, -100),
						new s(100, 100, -100),
						new s(-100, 100, 100),
						new s(100, 100, 100),
					]);
				(n.prototype = Object.create(o.prototype)), (n.prototype.constructor = n), (e.exports = n);
			},
			{ "../../math/Vec3": 50, "./convexBodyFactory": 58 },
		],
		55: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.events = new a()),
						(t = t || {}),
						(this.position = t.position || new s()),
						(this.orientation = t.orientation || new r()),
						(this.velocity = new s()),
						(this.momentum = new s()),
						(this.angularVelocity = new s()),
						(this.angularMomentum = new s()),
						(this.mass = t.mass || 1),
						(this.inverseMass = 1 / this.mass),
						(this.force = new s()),
						(this.torque = new s()),
						(this.restitution = null != t.restitution ? t.restitution : 0.4),
						(this.friction = null != t.friction ? t.friction : 0.2),
						(this.inverseInertia = new o([0, 0, 0, 0, 0, 0, 0, 0, 0])),
						(this.localInertia = new o([0, 0, 0, 0, 0, 0, 0, 0, 0])),
						(this.localInverseInertia = new o([0, 0, 0, 0, 0, 0, 0, 0, 0])),
						(this.size = t.size || [0, 0, 0]);
					var e = t.velocity;
					e && this.setVelocity(e.x, e.y, e.z),
						(this.restrictions = 0),
						this.setRestrictions.apply(this, t.restrictions || []),
						(this.collisionMask = t.collisionMask || 1),
						(this.collisionGroup = t.collisionGroup || 1),
						(this.type = 1),
						(this._ID = c++);
				}
				var s = t("../../math/Vec3"),
					r = t("../../math/Quaternion"),
					o = t("../../math/Mat33"),
					a = t("../../utilities/CallbackStore"),
					h = new s(),
					u = new o(),
					c = 0;
				(n.prototype.on = function(t, e) {
					return this.events.on(t, e), this;
				}),
					(n.prototype.off = function(t, e) {
						return this.events.off(t, e), this;
					}),
					(n.prototype.trigger = function(t, e) {
						return this.events.trigger(t, e), this;
					}),
					(n.prototype.getRestrictions = function() {
						var t = "",
							e = "",
							i = this.restrictions;
						return (
							32 & i && (t += "x"), 16 & i && (t += "y"), 8 & i && (t += "z"), 4 & i && (e += "x"), 2 & i && (e += "y"), 1 & i && (e += "z"), [t, e]
						);
					}),
					(n.prototype.setRestrictions = function(t, e) {
						return (
							(t = t || ""),
							(e = e || ""),
							(this.restrictions = 0),
							t.indexOf("x") > -1 && (this.restrictions |= 32),
							t.indexOf("y") > -1 && (this.restrictions |= 16),
							t.indexOf("z") > -1 && (this.restrictions |= 8),
							e.indexOf("x") > -1 && (this.restrictions |= 4),
							e.indexOf("y") > -1 && (this.restrictions |= 2),
							e.indexOf("z") > -1 && (this.restrictions |= 1),
							this
						);
					}),
					(n.prototype.getMass = function() {
						return this.mass;
					}),
					(n.prototype.setMass = function(t) {
						return (this.mass = t), (this.inverseMass = 1 / t), this;
					}),
					(n.prototype.getInverseMass = function() {
						return this.inverseMass;
					}),
					(n.prototype.updateLocalInertia = function() {
						return this.localInertia.set([0, 0, 0, 0, 0, 0, 0, 0, 0]), this.localInverseInertia.set([0, 0, 0, 0, 0, 0, 0, 0, 0]), this;
					}),
					(n.prototype.updateInertia = function() {
						var t = this.localInverseInertia,
							e = this.orientation;
						if ((t[0] === t[4] && t[4] === t[8]) || 1 === e.w) return this;
						var i = e.toMatrix(u);
						return (
							o.multiply(i, this.inverseInertia, this.inverseInertia), o.multiply(this.localInverseInertia, i.transpose(), this.inverseInertia), this
						);
					}),
					(n.prototype.getPosition = function() {
						return this.position;
					}),
					(n.prototype.setPosition = function(t, e, i) {
						return this.position.set(t, e, i), this;
					}),
					(n.prototype.getVelocity = function() {
						return this.velocity;
					}),
					(n.prototype.setVelocity = function(t, e, i) {
						return this.velocity.set(t, e, i), s.scale(this.velocity, this.mass, this.momentum), this;
					}),
					(n.prototype.getMomentum = function() {
						return this.momentum;
					}),
					(n.prototype.setMomentum = function(t, e, i) {
						return this.momentum.set(t, e, i), s.scale(this.momentum, this.inverseMass, this.velocity), this;
					}),
					(n.prototype.getOrientation = function() {
						return this.orientation;
					}),
					(n.prototype.setOrientation = function(t, e, i, n) {
						return this.orientation.set(t, e, i, n).normalize(), this.updateInertia(), this;
					}),
					(n.prototype.getAngularVelocity = function() {
						return this.angularVelocity;
					}),
					(n.prototype.setAngularVelocity = function(t, e, i) {
						this.angularVelocity.set(t, e, i);
						var n = o.inverse(this.inverseInertia, u);
						return n ? n.vectorMultiply(this.angularVelocity, this.angularMomentum) : this.angularMomentum.clear(), this;
					}),
					(n.prototype.getAngularMomentum = function() {
						return this.angularMomentum;
					}),
					(n.prototype.setAngularMomentum = function(t, e, i) {
						return this.angularMomentum.set(t, e, i), this.inverseInertia.vectorMultiply(this.angularMomentum, this.angularVelocity), this;
					}),
					(n.prototype.getForce = function() {
						return this.force;
					}),
					(n.prototype.setForce = function(t, e, i) {
						return this.force.set(t, e, i), this;
					}),
					(n.prototype.getTorque = function() {
						return this.torque;
					}),
					(n.prototype.setTorque = function(t, e, i) {
						return this.torque.set(t, e, i), this;
					}),
					(n.prototype.applyForce = function(t) {
						return this.force.add(t), this;
					}),
					(n.prototype.applyTorque = function(t) {
						return this.torque.add(t), this;
					}),
					(n.prototype.applyImpulse = function(t) {
						return this.momentum.add(t), s.scale(this.momentum, this.inverseMass, this.velocity), this;
					}),
					(n.prototype.applyAngularImpulse = function(t) {
						return this.angularMomentum.add(t), this.inverseInertia.vectorMultiply(this.angularMomentum, this.angularVelocity), this;
					}),
					(n.prototype.support = function() {
						return h;
					}),
					(n.prototype.updateShape = function() {}),
					(e.exports = n);
			},
			{ "../../math/Mat33": 47, "../../math/Quaternion": 48, "../../math/Vec3": 50, "../../utilities/CallbackStore": 94 },
		],
		56: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
					var e = t.radius || 1;
					(this.radius = e), (this.size = [2 * e, 2 * e, 2 * e]), this.updateLocalInertia(), this.inverseInertia.copy(this.localInverseInertia);
					var i = t.angularVelocity;
					i && this.setAngularVelocity(i.x, i.y, i.z), (this.type = 4);
				}
				var s = t("./Particle"),
					r = t("../../math/Vec3"),
					o = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.getRadius = function() {
						return this.radius;
					}),
					(n.prototype.setRadius = function(t) {
						return (this.radius = t), (this.size = [2 * this.radius, 2 * this.radius, 2 * this.radius]), this;
					}),
					(n.prototype.updateLocalInertia = function() {
						var t = this.mass,
							e = this.radius,
							i = t * e * e;
						this.localInertia.set([0.4 * i, 0, 0, 0, 0.4 * i, 0, 0, 0, 0.4 * i]),
							this.localInverseInertia.set([2.5 / i, 0, 0, 0, 2.5 / i, 0, 0, 0, 2.5 / i]);
					}),
					(n.prototype.support = function(t) {
						return r.scale(t, this.radius, o);
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Particle": 55 },
		],
		57: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
					var e = (this.normal = new r()),
						i = (this.direction = t.direction);
					switch (i) {
						case n.DOWN:
							e.set(0, 1, 0);
							break;
						case n.UP:
							e.set(0, -1, 0);
							break;
						case n.LEFT:
							e.set(-1, 0, 0);
							break;
						case n.RIGHT:
							e.set(1, 0, 0);
							break;
						case n.FORWARD:
							e.set(0, 0, -1);
							break;
						case n.BACKWARD:
							e.set(0, 0, 1);
					}
					(this.invNormal = r.clone(e, new r()).invert()), (this.mass = 1 / 0), (this.inverseMass = 0), (this.type = 8);
				}
				var s = t("./Particle"),
					r = t("../../math/Vec3");
				(n.DOWN = 0),
					(n.UP = 1),
					(n.LEFT = 2),
					(n.RIGHT = 3),
					(n.FORWARD = 4),
					(n.BACKWARD = 5),
					(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Particle": 55 },
		],
		58: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					function e(e) {
						r.call(this, e);
						var i = t.polyhedralProperties.size,
							n = e.size || i,
							h = n[0] / i[0],
							u = n[1] / i[1],
							c = n[2] / i[2];
						this._scale = [h, u, c];
						var l = new o([h, 0, 0, 0, u, 0, 0, 0, c]);
						(this.hull = t), (this.vertices = []);
						for (var p = 0, d = t.vertices.length; d > p; p++) {
							this.vertices.push(l.vectorMultiply(t.vertices[p], new a()));
						}
						s.call(this, l), this.inverseInertia.copy(this.localInverseInertia), this.updateInertia();
						var f = e.angularVelocity;
						f && this.setAngularVelocity(f.x, f.y, f.z);
					}
					if (!(t instanceof u)) {
						if (!(t instanceof Array)) throw new Error("convexBodyFactory requires a ConvexHull object or an array of Vec3's as input.");
						t = new u(t);
					}
					return (
						(e.prototype = Object.create(r.prototype)),
						(e.prototype.constructor = e),
						(e.prototype.setSize = function(e, i, n) {
							var s = t.polyhedralProperties.size;
							(this.size[0] = e), (this.size[1] = i), (this.size[2] = n);
							var r = e / s[0],
								a = i / s[1],
								h = n / s[2];
							this._scale = [r, a, h];
							for (var u = new o([r, 0, 0, 0, a, 0, 0, 0, h]), c = this.vertices, l = 0, p = t.vertices.length; p > l; l++) {
								u.vectorMultiply(t.vertices[l], c[l]);
							}
							return this;
						}),
						(e.prototype.updateLocalInertia = function() {
							var t = this._scale[0],
								e = this._scale[1],
								i = this._scale[2],
								n = new o([t, 0, 0, 0, e, 0, 0, 0, i]);
							return s.call(this, n), this;
						}),
						(e.prototype.support = function(t) {
							for (var e, i, n, s = this.vertices, r = -(1 / 0), o = 0, h = s.length; h > o; o++) {
								(e = s[o]), (i = a.dot(e, t)), i > r && ((n = e), (r = i));
							}
							return n;
						}),
						(e.prototype.updateShape = function() {
							for (
								var t = this.vertices,
									e = this.orientation,
									i = this.hull.vertices,
									n = this._scale[0],
									s = this._scale[1],
									r = this._scale[2],
									o = c,
									h = 0,
									u = t.length;
								u > h;
								h++
							) {
								o.copy(i[h]), (o.x *= n), (o.y *= s), (o.z *= r), a.applyRotation(o, e, t[h]);
							}
							return this;
						}),
						e
					);
				}
				function s(t) {
					var e = this.hull.polyhedralProperties,
						i = t.get(),
						n = i[0] * i[4] * i[8],
						s = e.eulerTensor,
						r = new o();
					o.multiply(t, s, r), o.multiply(r, t, r);
					var a = r.get(),
						h = a[0],
						u = a[4],
						c = a[8],
						l = a[1],
						p = a[7],
						d = a[2],
						f = e.volume * n,
						m = this.mass,
						g = m / f,
						_ = u + c,
						y = h + c,
						v = h + u,
						T = -l,
						b = -p,
						E = -d,
						O = e.centroid;
					(_ -= f * (O.y * O.y + O.z * O.z)),
						(y -= f * (O.z * O.z + O.x * O.x)),
						(v -= f * (O.x * O.x + O.y * O.y)),
						(T += f * O.x * O.y),
						(b += f * O.y * O.z),
						(E += f * O.z * O.x),
						(_ *= g * n),
						(y *= g * n),
						(v *= g * n),
						(T *= g * n),
						(b *= g * n),
						(E *= g * n);
					var w = [_, T, E, T, y, b, E, b, v];
					this.localInertia.set(w), o.inverse(this.localInertia, this.localInverseInertia);
				}
				var r = t("./Particle"),
					o = t("../../math/Mat33"),
					a = t("../../math/Vec3"),
					h = t("../Geometry"),
					u = h.ConvexHull,
					c = new a();
				e.exports = n;
			},
			{ "../../math/Mat33": 47, "../../math/Vec3": 50, "../Geometry": 52, "./Particle": 55 },
		],
		59: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.a = t), (this.b = e), s.call(this, i), (this.effectiveInertia = new o()), (this.angularImpulse = new r()), (this.error = 0);
				}
				var s = t("./Constraint"),
					r = t("../../math/Vec3"),
					o = t("../../math/Mat33"),
					a = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						this.cosAngle = this.cosAngle || this.a.orientation.dot(this.b.orientation);
					}),
					(n.prototype.update = function() {
						var t = this.a,
							e = this.b,
							i = t.orientation,
							n = e.orientation,
							s = i.dot(n),
							r = 2 * (s - this.cosAngle);
						this.error = r;
						var a = this.angularImpulse;
						e.applyAngularImpulse(a),
							t.applyAngularImpulse(a.invert()),
							o.add(t.inverseInertia, e.inverseInertia, this.effectiveInertia),
							this.effectiveInertia.inverse(),
							a.clear();
					}),
					(n.prototype.resolve = function() {
						var t = this.a,
							e = this.b,
							i = a,
							n = t.angularVelocity,
							s = e.angularVelocity;
						r.subtract(n, s, i), i.scale(1 + this.error);
						var o = i.applyMatrix(this.effectiveInertia);
						e.applyAngularImpulse(o), t.applyAngularImpulse(o.invert()), o.invert(), this.angularImpulse.add(o);
					}),
					(e.exports = n);
			},
			{ "../../math/Mat33": 47, "../../math/Vec3": 50, "./Constraint": 62 },
		],
		60: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.a = t),
						(this.b = e),
						s.call(this, i),
						(this.impulse = new r()),
						(this.angImpulseA = new r()),
						(this.angImpulseB = new r()),
						(this.error = new r()),
						(this.effMassMatrix = new o());
				}
				var s = t("./Constraint"),
					r = t("../../math/Vec3"),
					o = t("../../math/Mat33"),
					a = t("../../math/Quaternion"),
					h = new r(),
					u = new r(),
					c = new r(),
					l = new r(),
					p = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						var t = this.anchor,
							e = this.a,
							i = this.b,
							n = a.conjugate(e.orientation, new a()),
							s = a.conjugate(i.orientation, new a());
						(this.rA = r.subtract(t, e.position, new r())),
							(this.rB = r.subtract(t, i.position, new r())),
							(this.bodyRA = n.rotateVector(this.rA, new r())),
							(this.bodyRB = s.rotateVector(this.rB, new r()));
					}),
					(n.prototype.update = function(t, e) {
						var i = this.a,
							n = this.b,
							s = i.orientation.rotateVector(this.bodyRA, this.rA),
							a = n.orientation.rotateVector(this.bodyRB, this.rB),
							h = new o([0, s.z, -s.y, -s.z, 0, s.x, s.y, -s.x, 0]),
							c = new o([0, a.z, -a.y, -a.z, 0, a.x, a.y, -a.x, 0]),
							l = o.multiply(h, i.inverseInertia, new o()).multiply(h.transpose()),
							p = o.multiply(c, n.inverseInertia, new o()).multiply(c.transpose()),
							d = o.add(l, p, l),
							f = r.add(i.position, this.rA, this.anchor),
							m = r.add(n.position, this.rB, u);
						r.subtract(m, f, this.error), this.error.scale(0.2 / e);
						var g = i.inverseMass,
							_ = n.inverseMass,
							y = new o([g + _, 0, 0, 0, g + _, 0, 0, 0, g + _]);
						o.add(d, y, this.effMassMatrix), this.effMassMatrix.inverse();
						var v = this.impulse,
							T = this.angImpulseA,
							b = this.angImpulseB;
						n.applyImpulse(v), n.applyAngularImpulse(b), v.invert(), i.applyImpulse(v), i.applyAngularImpulse(T), v.clear(), T.clear(), b.clear();
					}),
					(n.prototype.resolve = function() {
						var t = this.a,
							e = this.b,
							i = this.rA,
							n = this.rB,
							s = r.add(t.velocity, r.cross(t.angularVelocity, i, p), c),
							o = r.add(e.velocity, r.cross(e.angularVelocity, n, p), l),
							a = s
								.subtract(o)
								.subtract(this.error)
								.applyMatrix(this.effMassMatrix),
							d = r.cross(n, a, h),
							f = r.cross(i, a, u).invert();
						e.applyImpulse(a),
							e.applyAngularImpulse(d),
							a.invert(),
							t.applyImpulse(a),
							t.applyAngularImpulse(f),
							a.invert(),
							this.impulse.add(a),
							this.angImpulseA.add(f),
							this.angImpulseB.add(d);
					}),
					(e.exports = n);
			},
			{ "../../math/Mat33": 47, "../../math/Quaternion": 48, "../../math/Vec3": 50, "./Constraint": 62 },
		],
		61: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					return e > t ? e : t > i ? i : t;
				}
				function s(t, e, i, n, s, r) {
					(this.penetration = t),
						(this.normal = e),
						(this.worldContactA = i),
						(this.worldContactB = n),
						(this.localContactA = s),
						(this.localContactB = r);
				}
				function r(t, e) {
					(this.targets = []), t && (this.targets = this.targets.concat(t)), l.call(this, e);
				}
				function o(t, e, i) {
					var n = e.position,
						s = i.position,
						r = c.subtract(s, n, new c()),
						o = r.length(),
						a = e.radius + i.radius,
						h = r.scale(1 / o),
						u = a - o;
					if (!(0 > u)) {
						var l = c.scale(h, e.radius, new c()),
							p = c.scale(h, -i.radius, new c()),
							d = c.add(n, l, new c()),
							f = c.add(s, p, new c()),
							m = v().reset(u, h, d, f, l, p);
						t.contactManifoldTable.registerContact(e, i, m);
					}
				}
				function a(t, e, i) {
					if (e.type === O) {
						var s = i;
						(i = e), (e = s);
					}
					var r = e.position,
						o = i.position,
						a = c.subtract(o, r, T),
						h = e.orientation,
						u = i.radius,
						l = e.size,
						p = 0.5 * l[0],
						d = 0.5 * l[1],
						f = 0.5 * l[2],
						m = e.normals,
						g = h.rotateVector(m[1], new c()),
						_ = h.rotateVector(m[0], new c()),
						y = h.rotateVector(m[2], new c()),
						b = new c();
					(b.x = n(c.dot(a, g), -p, p)), (b.y = n(c.dot(a, _), -d, d)), (b.z = n(c.dot(a, y), -f, f)), b.applyRotation(h);
					var E = c.add(r, b, new c()),
						w = c.subtract(E, o, E),
						x = w.length(),
						I = u - x;
					if (!(0 > I)) {
						var C = c.scale(w, -1 / x, new c()),
							S = b,
							R = w,
							A = c.add(r, S, new c()),
							M = c.add(o, R, new c()),
							D = v().reset(I, C, A, M, S, R);
						t.contactManifoldTable.registerContact(e, i, D);
					}
				}
				function h(t, e, i) {
					var n = m(e, i);
					if (n) {
						var s = g(e, i, n);
						null !== s && t.contactManifoldTable.registerContact(e, i, s);
					}
				}
				function u(t, e, i) {
					if (e.type === w) {
						var n = i;
						(i = e), (e = n);
					}
					var s = e.position,
						r = i.position,
						o = i.normal,
						a = i.invNormal,
						h = e.support(a),
						u = c.add(s, h, new c()),
						l = c.subtract(u, r, T),
						p = c.dot(l, a);
					if (!(0 > p)) {
						var d = c.scale(o, p, new c()).add(u),
							f = c.subtract(d, i.position, new c()),
							m = v().reset(p, a, u, d, h, f);
						t.contactManifoldTable.registerContact(e, i, m);
					}
				}
				var c = t("../../math/Vec3"),
					l = t("./Constraint"),
					p = t("./collision/SweepAndPrune"),
					d = t("./collision/BruteForce"),
					f = t("./collision/ConvexCollisionDetection"),
					m = f.gjk,
					g = f.epa,
					_ = t("./collision/ContactManifold"),
					y = t("../../utilities/ObjectManager");
				y.register("CollisionData", s);
				var v = y.requestCollisionData,
					T = new c();
				(s.prototype.reset = function(t, e, i, n, s, r) {
					return (
						(this.penetration = t),
						(this.normal = e),
						(this.worldContactA = i),
						(this.worldContactB = n),
						(this.localContactA = s),
						(this.localContactB = r),
						this
					);
				}),
					(r.prototype = Object.create(l.prototype)),
					(r.prototype.constructor = r),
					(r.prototype.init = function() {
						if (this.broadPhase) {
							var t = this.broadphase;
							t instanceof Function && (this.broadPhase = new t(this.targets));
						} else this.broadPhase = new p(this.targets);
						this.contactManifoldTable = this.contactManifoldTable || new _();
					}),
					(r.prototype.update = function(t, e) {
						if ((this.contactManifoldTable.update(e), 0 !== this.targets.length)) {
							var i, n;
							for (i = 0, n = this.targets.length; n > i; i++) {
								this.targets[i].updateShape();
							}
							var s,
								r = this.broadPhase.update();
							for (i = 0, n = r.length; n > i; i++) {
								(s = r[i]), s && this.applyNarrowPhase(s);
							}
							this.contactManifoldTable.prepContacts(e);
						}
					}),
					(r.prototype.resolve = function(t, e) {
						this.contactManifoldTable.resolveManifolds(e);
					}),
					(r.prototype.addTarget = function(t) {
						this.targets.push(t), this.broadPhase.add(t);
					}),
					(r.prototype.removeTarget = function(t) {
						var e = this.targets.indexOf(t);
						0 > e || (this.targets.splice(e, 1), this.broadPhase.remove(t));
					});
				var b = 1,
					E = 2,
					O = 4,
					w = 8,
					x = b | b,
					I = E | E,
					C = E | b,
					S = O | O,
					R = E | O,
					A = b | O,
					M = b | w,
					D = E | w,
					N = O | w,
					L = {};
				(L[x] = h),
					(L[I] = h),
					(L[C] = h),
					(L[A] = h),
					(L[S] = o),
					(L[R] = a),
					(L[M] = u),
					(L[D] = u),
					(L[N] = u),
					(r.prototype.applyNarrowPhase = function(t) {
						for (var e = 0, i = t.length; i > e; e++) {
							for (var n = e + 1; i > n; n++) {
								var s = t[e],
									r = t[n];
								if (0 !== (s.collisionMask & r.collisionGroup && s.collisionGroup & r.collisionMask)) {
									var o = s.type | r.type;
									L[o] && L[o](this, s, r);
								}
							}
						}
					}),
					(r.SweepAndPrune = p),
					(r.BruteForce = d.BruteForce),
					(r.BruteForceAABB = d.BruteForceAABB),
					(e.exports = r);
			},
			{
				"../../math/Vec3": 50,
				"../../utilities/ObjectManager": 97,
				"./Constraint": 62,
				"./collision/BruteForce": 68,
				"./collision/ContactManifold": 69,
				"./collision/ConvexCollisionDetection": 70,
				"./collision/SweepAndPrune": 71,
			},
		],
		62: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(t = t || {}), this.setOptions(t), (this._ID = s++);
				}
				var s = 0;
				(n.prototype.setOptions = function(t) {
					for (var e in t) {
						this[e] = t[e];
					}
					this.init(t);
				}),
					(n.prototype.init = function(t) {}),
					(n.prototype.update = function(t, e) {}),
					(n.prototype.resolve = function(t, e) {}),
					(e.exports = n);
			},
			{},
		],
		63: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					t ? (t instanceof Array ? (this.targets = t) : (this.targets = [t])) : (this.targets = []),
						s.call(this, e),
						(this.impulses = {}),
						(this.normals = {}),
						(this.velocityBiases = {}),
						(this.divisors = {});
				}
				var s = t("./Constraint"),
					r = t("../../math/Vec3"),
					o = new r(),
					a = new r(),
					h = 1e-7,
					u = Math.PI;
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						(this.equation1 =
							this.equation1 ||
							function() {
								return 0;
							}),
							(this.equation2 =
								this.equation2 ||
								function(t, e, i) {
									return i;
								}),
							(this.period = this.period || 1),
							(this.dampingRatio = this.dampingRatio || 0.5),
							(this.stiffness = (4 * u * u) / (this.period * this.period)),
							(this.damping = (4 * u * this.dampingRatio) / this.period);
					}),
					(n.prototype.update = function(t, e) {
						for (
							var i = this.targets,
								n = this.normals,
								s = this.velocityBiases,
								u = this.divisors,
								c = this.impulses,
								l = o,
								p = a,
								d = this.equation1,
								f = this.equation2,
								m = this.damping,
								g = this.stiffness,
								_ = 0,
								y = i.length;
							y > _;
							_++
						) {
							var v = i[_],
								T = v._ID;
							if (!v.immune) {
								var b,
									E,
									O = v.position,
									w = v.mass;
								if (0 === this.period) (b = 0), (E = 1);
								else {
									var x = m * w,
										I = g * w;
									(b = 1 / (e * (x + e * I))), (E = (e * I) / (x + e * I));
								}
								var C = O.x,
									S = O.y,
									R = O.z,
									A = d(C, S, R),
									M = (d(C + h, S, R) - A) / h,
									D = (d(C, S + h, R) - A) / h,
									N = (d(C, S, R + h) - A) / h,
									L = f(C, S, R),
									z = (f(C + h, S, R) - L) / h,
									U = (f(C, S + h, R) - L) / h,
									P = (f(C, S, R + h) - L) / h;
								p.set(M + z, D + U, N + P), p.normalize();
								var F = (E * (A + L)) / e,
									G = b + 1 / w,
									V = c[T] || 0;
								r.scale(p, V, l), v.applyImpulse(l), (n[T] = n[T] || new r()), n[T].copy(p), (s[T] = F), (u[T] = G), (c[T] = 0);
							}
						}
					}),
					(n.prototype.resolve = function() {
						for (
							var t = this.targets, e = this.normals, i = this.velocityBiases, n = this.divisors, s = this.impulses, a = o, h = 0, u = t.length;
							u > h;
							h++
						) {
							var c = t[h],
								l = c._ID;
							if (!c.immune) {
								var p = c.velocity,
									d = e[l],
									f = -(r.dot(d, p) + i[l]) / n[l];
								r.scale(d, f, a), c.applyImpulse(a), (s[l] += f);
							}
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Constraint": 62 },
		],
		64: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.a = t),
						(this.b = e),
						s.call(this, i),
						(this.impulse = 0),
						(this.distance = 0),
						(this.normal = new r()),
						(this.velocityBias = 0),
						(this.divisor = 0);
				}
				var s = t("./Constraint"),
					r = t("../../math/Vec3"),
					o = new r(),
					a = new r(),
					h = new r(),
					u = new r(),
					c = new r(),
					l = Math.PI;
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						(this.direction = this.direction || r.subtract(this.b.position, this.a.position, new r())),
							this.direction.normalize(),
							(this.minLength = this.minLength || 0),
							(this.period = this.period || 0.2),
							(this.dampingRatio = this.dampingRatio || 0.5),
							(this.stiffness = (4 * l * l) / (this.period * this.period)),
							(this.damping = (4 * l * this.dampingRatio) / this.period);
					}),
					(n.prototype.update = function(t, e) {
						var i = this.a,
							n = this.b,
							s = o,
							h = u,
							l = a,
							p = c,
							d = i.position,
							f = i.inverseMass,
							m = n.position,
							g = n.inverseMass,
							_ = this.direction;
						r.subtract(m, d, h), r.scale(_, r.dot(_, h), p);
						var y = p.add(d);
						r.subtract(m, y, s);
						var v = s.length();
						s.normalize();
						var T,
							b,
							E = f + g,
							O = 1 / E;
						if (0 === this.period) (T = 0), (b = 1);
						else {
							var w = this.damping * O,
								x = this.stiffness * O;
							(T = 1 / (e * (w + e * x))), (b = (e * x) / (w + e * x));
						}
						var I = (b * v) / e,
							C = T + E,
							S = this.impulse;
						r.scale(s, S, l),
							n.applyImpulse(l),
							i.applyImpulse(l.invert()),
							this.normal.copy(s),
							(this.distance = v),
							(this.velocityBias = I),
							(this.divisor = C),
							(this.impulse = 0);
					}),
					(n.prototype.resolve = function() {
						var t = this.a,
							e = this.b,
							i = a,
							n = h,
							s = this.minLength,
							o = this.distance;
						if (!(Math.abs(o) < s)) {
							var u = t.velocity,
								c = e.velocity,
								l = this.normal;
							r.subtract(c, u, n);
							var p = -(r.dot(l, n) + this.velocityBias) / this.divisor;
							r.scale(l, p, i), e.applyImpulse(i), t.applyImpulse(i.invert()), (this.impulse += p);
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Constraint": 62 },
		],
		65: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.a = t),
						(this.b = e),
						s.call(this, i),
						(this.impulse = 0),
						(this.distance = 0),
						(this.normal = new r()),
						(this.velocityBias = 0),
						(this.divisor = 0);
				}
				var s = t("./Constraint"),
					r = t("../../math/Vec3"),
					o = new r(),
					a = new r(),
					h = new r(),
					u = new r(),
					c = Math.PI;
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						(this.length = this.length || r.subtract(this.b.position, this.a.position, u).length()),
							(this.minLength = this.minLength || 0),
							(this.period = this.period || 0.2),
							(this.dampingRatio = this.dampingRatio || 0.5),
							(this.stiffness = (4 * c * c) / (this.period * this.period)),
							(this.damping = (4 * c * this.dampingRatio) / this.period);
					}),
					(n.prototype.update = function(t, e) {
						var i = this.a,
							n = this.b,
							s = o,
							h = u,
							c = a,
							l = this.length,
							p = i.position,
							d = i.inverseMass,
							f = n.position,
							m = n.inverseMass;
						r.subtract(f, p, h);
						var g = h.length();
						r.scale(h, 1 / g, s);
						var _,
							y,
							v = g - l,
							T = d + m,
							b = 1 / T;
						if (0 === this.period) (_ = 0), (y = 1);
						else {
							var E = this.damping * b,
								O = this.stiffness * b;
							(_ = 1 / (e * (E + e * O))), (y = (e * O) / (E + e * O));
						}
						var w = (y * v) / e,
							x = _ + T,
							I = this.impulse;
						r.scale(s, I, c),
							n.applyImpulse(c),
							i.applyImpulse(c.invert()),
							this.normal.copy(s),
							(this.distance = v),
							(this.velocityBias = w),
							(this.divisor = x),
							(this.impulse = 0);
					}),
					(n.prototype.resolve = function() {
						var t = this.a,
							e = this.b,
							i = a,
							n = h,
							s = this.minLength,
							o = this.distance;
						if (!(Math.abs(o) < s)) {
							var u = t.getVelocity(),
								c = e.getVelocity(),
								l = this.normal;
							r.subtract(c, u, n);
							var p = -(r.dot(l, n) + this.velocityBias) / this.divisor;
							r.scale(l, p, i), e.applyImpulse(i), t.applyImpulse(i.invert()), (this.impulse += p);
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Constraint": 62 },
		],
		66: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.a = t),
						(this.b = e),
						s.call(this, i),
						(this.impulse = new r()),
						(this.angImpulseA = new r()),
						(this.angImpulseB = new r()),
						(this.error = new r()),
						(this.errorRot = [0, 0]),
						(this.effMassMatrix = new o()),
						(this.effMassMatrixRot = []);
				}
				var s = t("./Constraint"),
					r = t("../../math/Vec3"),
					o = t("../../math/Mat33"),
					a = t("../../math/Quaternion"),
					h = new r(),
					u = new r(),
					c = new r(),
					l = new r(),
					p = new r(),
					d = new r(),
					f = new r(),
					m = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						var t = this.anchor,
							e = this.axis.normalize(),
							i = this.a,
							n = this.b,
							s = a.conjugate(i.orientation, new a()),
							o = a.conjugate(n.orientation, new a());
						(this.rA = r.subtract(t, i.position, new r())),
							(this.rB = r.subtract(t, n.position, new r())),
							(this.bodyRA = s.rotateVector(this.rA, new r())),
							(this.bodyRB = o.rotateVector(this.rB, new r())),
							(this.axisA = r.clone(e)),
							(this.axisB = r.clone(e)),
							(this.axisBTangent1 = new r()),
							(this.axisBTangent2 = new r()),
							(this.t1xA = new r()),
							(this.t2xA = new r()),
							(this.bodyAxisA = s.rotateVector(e, new r())),
							(this.bodyAxisB = o.rotateVector(e, new r()));
					}),
					(n.prototype.update = function(t, e) {
						var i = this.a,
							n = this.b,
							s = i.orientation.rotateVector(this.bodyAxisA, this.axisA),
							a = n.orientation.rotateVector(this.bodyAxisB, this.axisB);
						this.axis.copy(a);
						var p = a,
							d = this.axisBTangent1,
							f = this.axisBTangent2;
						p.x >= 0.57735 ? d.set(p.y, -p.x, 0) : d.set(0, p.z, -p.y), d.normalize(), r.cross(p, d, f);
						var m = r.cross(d, s, this.t1xA),
							g = r.cross(f, s, this.t2xA),
							_ = i.orientation.rotateVector(this.bodyRA, this.rA),
							y = n.orientation.rotateVector(this.bodyRB, this.rB),
							v = new o([0, _.z, -_.y, -_.z, 0, _.x, _.y, -_.x, 0]),
							T = new o([0, y.z, -y.y, -y.z, 0, y.x, y.y, -y.x, 0]),
							b = o.multiply(v, i.inverseInertia, new o()).multiply(v.transpose()),
							E = o.multiply(T, n.inverseInertia, new o()).multiply(T.transpose()),
							O = o.add(b, E, b),
							w = r.add(i.position, this.rA, this.anchor),
							x = r.add(n.position, this.rB, h),
							I = 1 / e;
						r.subtract(x, w, this.error), this.error.scale(0.2 * I);
						var C = i.inverseMass,
							S = n.inverseMass,
							R = new o([C + S, 0, 0, 0, C + S, 0, 0, 0, C + S]);
						o.add(O, R, this.effMassMatrix), this.effMassMatrix.inverse();
						var A = i.inverseInertia.vectorMultiply(m, h),
							M = i.inverseInertia.vectorMultiply(g, u),
							D = n.inverseInertia.vectorMultiply(m, c),
							N = n.inverseInertia.vectorMultiply(g, l),
							L = r.dot(m, A) + r.dot(m, D),
							z = r.dot(m, M) + r.dot(m, N),
							U = r.dot(g, A) + r.dot(g, D),
							P = r.dot(g, M) + r.dot(g, N),
							F = 1 / (L * P - z * U);
						(this.effMassMatrixRot[0] = P * F),
							(this.effMassMatrixRot[1] = -U * F),
							(this.effMassMatrixRot[2] = -z * F),
							(this.effMassMatrixRot[3] = L * F),
							(this.errorRot[0] = 0.2 * r.dot(s, d) * I),
							(this.errorRot[1] = 0.2 * r.dot(s, f) * I);
						var G = this.impulse.scale(0.5),
							V = this.angImpulseA.scale(0.5),
							k = this.angImpulseB.scale(0.5);
						n.applyImpulse(G), n.applyAngularImpulse(k), G.invert(), i.applyImpulse(G), i.applyAngularImpulse(V), G.clear(), V.clear(), k.clear();
					}),
					(n.prototype.resolve = function() {
						var t = this.a,
							e = this.b,
							i = this.rA,
							n = this.rB,
							s = this.t1xA,
							o = this.t2xA,
							a = t.angularVelocity,
							g = e.angularVelocity,
							_ = r.add(t.velocity, r.cross(a, i, f), p),
							y = r.add(e.velocity, r.cross(g, n, f), d),
							v = _.subtract(y)
								.subtract(this.error)
								.applyMatrix(this.effMassMatrix),
							T = r.subtract(g, a, m),
							b = this.errorRot,
							E = r.dot(s, T) + b[0],
							O = r.dot(o, T) + b[1],
							w = this.effMassMatrixRot,
							x = -(w[0] * E + w[1] * O),
							I = -(w[2] * E + w[3] * O),
							C = r.scale(s, x, u).add(r.scale(o, I, c)),
							S = r.cross(n, v, h).add(C),
							R = r
								.cross(i, v, l)
								.invert()
								.subtract(C);
						e.applyImpulse(v),
							e.applyAngularImpulse(S),
							v.invert(),
							t.applyImpulse(v),
							t.applyAngularImpulse(R),
							v.invert(),
							this.impulse.add(v),
							this.angImpulseA.add(R),
							this.angImpulseB.add(S);
					}),
					(e.exports = n);
			},
			{ "../../math/Mat33": 47, "../../math/Quaternion": 48, "../../math/Vec3": 50, "./Constraint": 62 },
		],
		67: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._body = t), (this._ID = t._ID), (this.position = null), (this.vertices = { x: [], y: [], z: [] }), this.update();
				}
				var s = 4,
					r = 8,
					o = 0,
					a = 1,
					h = 2,
					u = 3,
					c = 4,
					l = 5;
				(n.prototype.update = function() {
					var t = this._body,
						e = (this.position = t.position),
						i = 1 / 0,
						n = -(1 / 0),
						p = 1 / 0,
						d = -(1 / 0),
						f = 1 / 0,
						m = -(1 / 0),
						g = t.type;
					if (g === s) (n = d = m = t.radius), (i = p = f = -t.radius);
					else if (g === r) {
						var _ = t.direction;
						switch (((n = d = m = 1e6), (i = p = f = -1e6), _)) {
							case o:
								(d = 25), (p = -1e3);
								break;
							case a:
								(d = 1e3), (p = -25);
								break;
							case h:
								(n = 25), (i = -1e3);
								break;
							case u:
								(n = 1e3), (i = -25);
								break;
							case c:
								(m = 25), (f = -1e3);
								break;
							case l:
								(m = 1e3), (f = -25);
						}
					} else if (t.vertices)
						for (var y = t.vertices, v = 0, T = y.length; T > v; v++) {
							var b = y[v];
							b.x < i && (i = b.x), b.x > n && (n = b.x), b.y < p && (p = b.y), b.y > d && (d = b.y), b.z < f && (f = b.z), b.z > m && (m = b.z);
						}
					else (n = d = m = 25), (i = p = f = -25);
					var E = this.vertices;
					(E.x[0] = i + e.x), (E.x[1] = n + e.x), (E.y[0] = p + e.y), (E.y[1] = d + e.y), (E.z[0] = f + e.z), (E.z[1] = m + e.z);
				}),
					(n.checkOverlap = function(t, e) {
						var i = t.vertices,
							n = e.vertices,
							s = i.x[0],
							r = i.x[1],
							o = n.x[0],
							a = n.x[1];
						if ((s >= o && a >= s) || (o >= s && r >= o)) {
							var h = i.y[0],
								u = i.y[1],
								c = n.y[0],
								l = n.y[1];
							if ((h >= c && l >= h) || (c >= h && u >= c)) {
								var p = i.z[0],
									d = i.z[1],
									f = n.z[0],
									m = n.z[1];
								if ((p >= f && m >= p) || (f >= p && d >= f)) return !0;
							}
						}
						return !1;
					}),
					(n.vertexThreshold = 100),
					(e.exports = n);
			},
			{},
		],
		68: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._volumes = []), (this._entityRegistry = {});
					for (var e = 0; e < t.length; e++) {
						this.add(t[e]);
					}
				}
				function s(t) {
					this.targets = t;
				}
				var r = t("./AABB");
				(n.prototype.add = function(t) {
					var e = new r(t);
					(this._entityRegistry[t._ID] = t), this._volumes.push(e);
				}),
					(n.prototype.update = function() {
						for (var t = this._volumes, e = this._entityRegistry, i = 0, n = t.length; n > i; i++) {
							t[i].update();
						}
						for (var s = [], o = 0, a = t.length; a > o; o++) {
							for (var h = o + 1; a > h; h++) {
								r.checkOverlap(t[o], t[h]) && s.push([e[o], e[h]]);
							}
						}
						return s;
					}),
					(s.prototype.add = function(t) {
						this.targets.push(t);
					}),
					(s.prototype.update = function() {
						return [this.targets];
					}),
					(e.exports.BruteForceAABB = n),
					(e.exports.BruteForce = s);
			},
			{ "./AABB": 67 },
		],
		69: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					return e > t ? e : t > i ? i : t;
				}
				function s() {
					(this.manifolds = []), (this.collisionMatrix = {}), (this._IDPool = []);
				}
				function r(t, e, i, n) {
					(this.lowID = t), (this.highID = e), (this.contacts = []), (this.numContacts = 0), (this.bodyA = i), (this.bodyB = n), (this.lru = 0);
				}
				function o(t, e, i) {
					(this.bodyA = t),
						(this.bodyB = e),
						(this.data = i),
						(this.normalImpulse = 0),
						(this.tangentImpulse1 = 0),
						(this.tangentImpulse2 = 0),
						(this.impulse = new a()),
						(this.angImpulseA = new a()),
						(this.angImpulseB = new a()),
						i && this.init();
				}
				var a = t("../../../math/Vec3"),
					h = t("../../../utilities/ObjectManager");
				h.register("Manifold", r), h.register("Contact", o);
				var u = h.requestManifold,
					c = h.requestContact,
					l = h.freeManifold,
					p = h.freeContact,
					d = new a(),
					f = new a(),
					m = new a(),
					g = new a(),
					_ = new a(),
					y = new a(),
					v = new a(),
					T = new a(),
					b = new a(),
					E = new a(),
					O = new a(),
					w = new a(),
					x = new a(),
					I = new a(),
					C = new a();
				(s.prototype.addManifold = function(t, e, i, n) {
					var s = this.collisionMatrix;
					s[t] = s[t] || {};
					var r = this._IDPool.length ? this._IDPool.pop() : this.manifolds.length;
					this.collisionMatrix[t][e] = r;
					var o = u().reset(t, e, i, n);
					return (this.manifolds[r] = o), o;
				}),
					(s.prototype.removeManifold = function(t, e) {
						var i = this.collisionMatrix;
						(this.manifolds[e] = null), (i[t.lowID][t.highID] = null), this._IDPool.push(e), l(t);
					}),
					(s.prototype.update = function(t) {
						for (var e = this.manifolds, i = 0, n = e.length; n > i; i++) {
							var s = e[i];
							if (s) {
								var r = s.update(t);
								r || (this.removeManifold(s, i), s.bodyA.events.trigger("collision:end", s), s.bodyB.events.trigger("collision:end", s));
							}
						}
					}),
					(s.prototype.prepContacts = function(t) {
						for (var e = this.manifolds, i = 0, n = e.length; n > i; i++) {
							var s = e[i];
							if (s)
								for (var r = s.contacts, o = 0, a = r.length; a > o; o++) {
									var h = r[o];
									h && h.update(t);
								}
						}
					}),
					(s.prototype.resolveManifolds = function() {
						for (var t = this.manifolds, e = 0, i = t.length; i > e; e++) {
							var n = t[e];
							n && n.resolveContacts();
						}
					}),
					(s.prototype.registerContact = function(t, e, i) {
						var n, s;
						t._ID < e._ID ? ((n = t._ID), (s = e._ID)) : ((n = e._ID), (s = t._ID));
						var r,
							o = this.manifolds,
							a = this.collisionMatrix;
						a[n] && null != a[n][s]
							? ((r = o[a[n][s]]), r.contains(i), r.addContact(t, e, i))
							: ((r = this.addManifold(n, s, t, e)),
							  r.addContact(t, e, i),
							  t.events.trigger("collision:start", r),
							  e.events.trigger("collision:start", r));
					});
				var S = 10;
				(r.prototype.reset = function(t, e, i, n) {
					return (
						(this.lowID = t),
						(this.highID = e),
						(this.contacts = []),
						(this.numContacts = 0),
						(this.bodyA = i),
						(this.bodyB = n),
						(this.lru = 0),
						this
					);
				}),
					(r.prototype.addContact = function(t, e, i) {
						var n = this.lru;
						this.contacts[n] && this.removeContact(this.contacts[n], n),
							(this.contacts[n] = c().reset(t, e, i)),
							(this.lru = (this.lru + 1) % 4),
							this.numContacts++;
					}),
					(r.prototype.removeContact = function(t, e) {
						(this.contacts[e] = null), this.numContacts--, h.freeCollisionData(t.data), (t.data = null), p(t);
					}),
					(r.prototype.contains = function(t) {
						for (var e = t.worldContactA, i = t.worldContactB, n = this.contacts, s = 0, r = n.length; r > s; s++) {
							var o = n[s];
							if (o) {
								var h = o.data,
									u = a.subtract(h.worldContactA, e, I).length(),
									c = a.subtract(h.worldContactB, i, C).length();
								if (S > u || S > c) return this.removeContact(o, s), !0;
							}
						}
						return !1;
					}),
					(r.prototype.update = function() {
						for (var t = this.contacts, e = this.bodyA, i = this.bodyB, n = e.position, s = i.position, r = 0, o = t.length; o > r; r++) {
							var h = t[r];
							if (h) {
								var u = h.data,
									c = u.normal,
									l = u.localContactA,
									p = u.localContactB,
									d = u.worldContactA,
									f = u.worldContactB,
									m = a.add(n, l, O),
									g = a.add(s, p, w),
									_ = a.dot(a.subtract(g, m, x), c) > 0,
									y = a.subtract(d, m, I),
									v = a.subtract(f, g, C);
								(y.length() >= S || v.length() >= S || _) && this.removeContact(h, r);
							}
						}
						return this.numContacts ? !0 : !1;
					}),
					(r.prototype.resolveContacts = function() {
						for (var t = this.contacts, e = 0, i = t.length; i > e; e++) {
							t[e] && t[e].resolve();
						}
					}),
					(o.prototype.reset = function(t, e, i) {
						return (
							(this.bodyA = t),
							(this.bodyB = e),
							(this.data = i),
							(this.normalImpulse = 0),
							(this.tangentImpulse1 = 0),
							(this.tangentImpulse2 = 0),
							this.impulse.clear(),
							this.angImpulseA.clear(),
							this.angImpulseB.clear(),
							this.init(),
							this
						);
					}),
					(o.prototype.init = function() {
						var t = this.data,
							e = t.normal,
							i = new a();
						e.x >= 0.57735 ? i.set(e.y, -e.x, 0) : i.set(0, e.z, -e.y), i.normalize();
						var n = a.cross(e, i, new a());
						(this.tangent1 = i), (this.tangent2 = n);
						var s = this.bodyA,
							r = this.bodyB,
							o = t.localContactA,
							h = t.localContactB,
							u = s.inverseMass + r.inverseMass,
							c = a.cross(o, e, y),
							l = a.cross(h, e, v);
						this.effNormalMass = 1 / (u + a.dot(c, s.inverseInertia.vectorMultiply(c, d)) + a.dot(l, r.inverseInertia.vectorMultiply(l, d)));
						var p = a.cross(o, i, y),
							f = a.cross(h, i, v);
						this.effTangentialMass1 = 1 / (u + a.dot(p, s.inverseInertia.vectorMultiply(p, d)) + a.dot(f, r.inverseInertia.vectorMultiply(f, d)));
						var m = a.cross(o, n, y),
							g = a.cross(h, n, v);
						(this.effTangentialMass2 = 1 / (u + a.dot(m, s.inverseInertia.vectorMultiply(m, d)) + a.dot(g, r.inverseInertia.vectorMultiply(g, d)))),
							(this.restitution = Math.min(s.restitution, r.restitution)),
							(this.friction = s.friction * r.friction);
					}),
					(o.prototype.update = function(t) {
						var e = this.data,
							i = this.bodyA,
							n = this.bodyB,
							s = e.localContactA,
							r = e.localContactB,
							o = e.normal,
							h = a.add(i.velocity, a.cross(i.angularVelocity, s, _), m),
							u = a.add(n.velocity, a.cross(n.angularVelocity, r, _), g),
							c = u.subtract(h),
							l = a.dot(c, o),
							p = 0.15,
							d = 1.5,
							f = 20,
							y = Math.abs(l) < f ? 0 : this.restitution;
						(this.velocityBias = (-p * Math.max(e.penetration - d, 0)) / t), (this.velocityBias += y * l);
						var v = this.impulse.scale(0.25),
							T = this.angImpulseA.scale(0.25),
							b = this.angImpulseB.scale(0.25);
						n.applyImpulse(v),
							n.applyAngularImpulse(b),
							v.invert(),
							i.applyImpulse(v),
							i.applyAngularImpulse(T),
							(this.normalImpulse = 0),
							(this.tangentImpulse1 = 0),
							(this.tangentImpulse2 = 0),
							v.clear(),
							T.clear(),
							b.clear();
					}),
					(o.prototype.resolve = function() {
						var t = this.data,
							e = this.bodyA,
							i = this.bodyB,
							s = t.localContactA,
							r = t.localContactB,
							o = t.normal,
							h = this.tangent1,
							u = this.tangent2,
							c = a.add(e.velocity, a.cross(e.angularVelocity, s, _), m),
							l = a.add(i.velocity, a.cross(i.angularVelocity, r, _), g),
							p = l.subtract(c),
							y = -(a.dot(p, o) + this.velocityBias) * this.effNormalMass,
							v = Math.max(this.normalImpulse + y, 0);
						y = v - this.normalImpulse;
						var O = this.friction * v,
							w = -a.dot(p, h) * this.effTangentialMass1,
							x = n(this.tangentImpulse1 + w, -O, O);
						w = x - this.tangentImpulse1;
						var I = -a.dot(p, u) * this.effTangentialMass2,
							C = n(this.tangentImpulse2 + I, -O, O);
						I = C - this.tangentImpulse2;
						var S = a.scale(o, y, T),
							R = a.scale(h, w, b),
							A = a.scale(u, I, E);
						S.add(R).add(A);
						var M = a.cross(r, S, d),
							D = a.cross(s, S, f).invert();
						i.applyImpulse(S),
							i.applyAngularImpulse(M),
							S.invert(),
							e.applyImpulse(S),
							e.applyAngularImpulse(D),
							(this.normalImpulse = v),
							(this.tangentImpulse1 = x),
							(this.tangentImpulse2 = C),
							this.impulse.add(S),
							this.angImpulseA.add(D),
							this.angImpulseB.add(M);
					}),
					(e.exports = s);
			},
			{ "../../../math/Vec3": 50, "../../../utilities/ObjectManager": 97 },
		],
		70: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.vertex = t), (this.worldVertexA = e), (this.worldVertexB = i);
				}
				function s(t) {
					var e,
						i = t.vertices;
					for (e = i.length; e--; ) {
						var n = i.pop();
						null !== n && p(n);
					}
					t.numVertices = 0;
					var s = t.features;
					for (e = s.length; e--; ) {
						var r = s.pop();
						null !== r && f(r);
					}
					(t.numFeatures = 0), d(t);
				}
				function r(t, e, i) {
					var n = h.scale(i, -1, T),
						s = h.add(t.support(i), t.position, new h()),
						r = h.add(e.support(n), e.position, new h());
					return c().reset(h.subtract(s, r, new h()), s, r);
				}
				function o(t, e) {
					var i = r,
						n = h.subtract(e.position, t.position, v).normalize(),
						o = l();
					o.addVertex(i(t, e, n)), n.invert();
					for (
						var a = 0, u = 1e3;
						a++ < u && (0 !== n.x || 0 !== n.y || 0 !== n.z) && (o.addVertex(i(t, e, n)), !(h.dot(o.getLastVertex().vertex, n) < 0));

					) {
						if (o.simplexContainsOrigin(n, p)) return o;
					}
					return s(o), !1;
				}
				function a(t, e, i) {
					for (var n = r, o = 1 / 0, a = 0, c = 1e3; a++ < c; ) {
						var l = i.getFeatureClosestToOrigin();
						if (null === l) return null;
						var d = l.normal,
							f = n(t, e, d);
						if (((o = Math.min(o, h.dot(f.vertex, d))), o - l.distance <= 0.01)) {
							var v = i.vertices[l.vertexIndices[0]],
								T = i.vertices[l.vertexIndices[1]],
								b = i.vertices[l.vertexIndices[2]],
								E = v.vertex,
								O = T.vertex,
								w = b.vertex,
								x = h.scale(d, l.distance, m),
								I = h.subtract(O, E, g),
								C = h.subtract(w, E, _),
								S = h.subtract(x, E, y),
								R = h.dot(I, I),
								A = h.dot(I, C),
								M = h.dot(C, C),
								D = h.dot(S, I),
								N = h.dot(S, C),
								L = R * M - A * A,
								z = (M * D - A * N) / L,
								U = (R * N - A * D) / L,
								P = 1 - z - U,
								F = v.worldVertexA
									.scale(P)
									.add(T.worldVertexA.scale(z))
									.add(b.worldVertexA.scale(U)),
								G = v.worldVertexB
									.scale(P)
									.add(T.worldVertexB.scale(z))
									.add(b.worldVertexB.scale(U)),
								V = h.subtract(F, t.position, new h()),
								k = h.subtract(G, e.position, new h());
							return s(i), p(f), u.requestCollisionData().reset(l.distance, d, F, G, V, k);
						}
						i.addVertex(f), i.reshape();
					}
					throw new Error("EPA failed to terminate in allotted iterations.");
				}
				var h = t("../../../math/Vec3"),
					u = t("../../../utilities/ObjectManager");
				u.register("GJK_EPASupportPoint", n);
				var c = u.requestGJK_EPASupportPoint,
					l = u.requestDynamicGeometry,
					p = u.freeGJK_EPASupportPoint,
					d = u.freeDynamicGeometry,
					f = u.freeDynamicGeometryFeature,
					m = new h(),
					g = new h(),
					_ = new h(),
					y = new h(),
					v = new h(),
					T = new h();
				(n.prototype.reset = function(t, e, i) {
					return (this.vertex = t), (this.worldVertexA = e), (this.worldVertexB = i), this;
				}),
					(e.exports.gjk = o),
					(e.exports.epa = a);
			},
			{ "../../../math/Vec3": 50, "../../../utilities/ObjectManager": 97 },
		],
		71: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._sweepVolumes = []),
						(this._entityRegistry = {}),
						(this._boundingVolumeRegistry = {}),
						(this.endpoints = { x: [], y: [], z: [] }),
						(this.overlaps = []),
						(this.overlapsMatrix = {}),
						(this._IDPool = []),
						(t = t || []);
					for (var e = 0; e < t.length; e++) {
						this.add(t[e]);
					}
				}
				function s(t) {
					(this._boundingVolume = t),
						(this._ID = t._ID),
						(this.points = {
							x: [
								{ _ID: t._ID, side: 0, value: null },
								{ _ID: t._ID, side: 1, value: null },
							],
							y: [
								{ _ID: t._ID, side: 0, value: null },
								{ _ID: t._ID, side: 1, value: null },
							],
							z: [
								{ _ID: t._ID, side: 0, value: null },
								{ _ID: t._ID, side: 1, value: null },
							],
						}),
						this.update();
				}
				var r = t("./AABB"),
					o = ["x", "y", "z"];
				(n.prototype.add = function(t) {
					var e = new r(t),
						i = new s(e);
					(this._entityRegistry[t._ID] = t), (this._boundingVolumeRegistry[t._ID] = e), this._sweepVolumes.push(i);
					for (var n = 0; 3 > n; n++) {
						var a = o[n];
						this.endpoints[a].push(i.points[a][0]), this.endpoints[a].push(i.points[a][1]);
					}
				}),
					(n.prototype.remove = function(t) {
						(this._entityRegistry[t._ID] = null), (this._boundingVolumeRegistry[t._ID] = null);
						var e, i, n;
						for (e = 0, i = this._sweepVolumes.length; i > e; e++) {
							if (this._sweepVolumes[e]._ID === t._ID) {
								n = e;
								break;
							}
						}
						this._sweepVolumes.splice(n, 1);
						var s,
							r = this.endpoints,
							o = [];
						for (e = 0, i = r.x.length; i > e; e++) {
							(s = r.x[e]), s._ID !== t._ID && o.push(s);
						}
						var a = [];
						for (e = 0, i = r.y.length; i > e; e++) {
							(s = r.y[e]), s._ID !== t._ID && a.push(s);
						}
						var h = [];
						for (e = 0, i = r.z.length; i > e; e++) {
							(s = r.z[e]), s._ID !== t._ID && h.push(s);
						}
						(r.x = o), (r.y = a), (r.z = h);
					}),
					(n.prototype.update = function() {
						var t,
							e,
							i,
							n,
							s = this._sweepVolumes,
							a = this._entityRegistry,
							h = this._boundingVolumeRegistry;
						for (e = 0, n = s.length; n > e; e++) {
							s[e].update();
						}
						var u = this.endpoints,
							c = this.overlaps,
							l = this.overlapsMatrix,
							p = this._IDPool;
						for (i = 0; 3 > i; i++) {
							var d = o[i],
								f = u[d];
							for (e = 1, n = f.length; n > e; e++) {
								var m,
									g,
									_,
									y,
									v,
									T,
									b,
									E = f[e],
									O = E.value;
								for (t = e - 1; t >= 0 && (m = f[t]).value > O; ) {
									(T = E._ID),
										(b = m._ID),
										b > T ? ((y = T), (v = b)) : ((y = b), (v = T)),
										~E.side & m.side
											? r.checkOverlap(h[T], h[b]) && ((g = l[y] = l[y] || {}), (_ = g[v] = p.length ? p.pop() : c.length), (c[_] = [a[y], a[v]]))
											: E.side & ~m.side && (g = l[y]) && null != g[v] && ((_ = g[v]), (c[_] = null), (g[v] = null), p.push(_)),
										(f[t + 1] = m),
										t--;
								}
								f[t + 1] = E;
							}
						}
						return c;
					}),
					(s.prototype.update = function() {
						var t = this._boundingVolume;
						t.update();
						for (var e = this.points, i = 0; 3 > i; i++) {
							var n = o[i];
							(e[n][0].value = t.vertices[n][0]), (e[n][1].value = t.vertices[n][1]);
						}
					}),
					(e.exports = n);
			},
			{ "./AABB": 67 },
		],
		72: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					s.call(this, t, e);
				}
				var s = t("./Force"),
					r = t("../../math/Vec3"),
					o = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.QUADRATIC = function(t) {
						return t * t;
					}),
					(n.LINEAR = function(t) {
						return t;
					}),
					(n.prototype.init = function() {
						(this.max = this.max || 1 / 0), (this.strength = this.strength || 1), (this.type = this.type || n.LINEAR);
					}),
					(n.prototype.update = function() {
						for (var t = this.targets, e = this.type, i = o, n = this.max, s = this.strength, a = 0, h = t.length; h > a; a++) {
							var u = t[a],
								c = u.velocity,
								l = c.length(),
								p = l ? 1 / l : 0,
								d = -s * e(l);
							r.scale(c, (-n > d ? -n : d) * p, i), u.applyForce(i);
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Force": 73 },
		],
		73: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					t ? (t instanceof Array ? (this.targets = t) : (this.targets = [t])) : (this.targets = []),
						(e = e || {}),
						this.setOptions(e),
						(this._ID = s++);
				}
				var s = 0;
				(n.prototype.setOptions = function(t) {
					for (var e in t) {
						this[e] = t[e];
					}
					this.init(t);
				}),
					(n.prototype.addTarget = function(t) {
						this.targets.push(t);
					}),
					(n.prototype.removeTarget = function(t) {
						var e = this.targets.indexOf(t);
						0 > e || this.targets.splice(e, 1);
					}),
					(n.prototype.init = function(t) {}),
					(n.prototype.update = function(t, e) {}),
					(e.exports = n);
			},
			{},
		],
		74: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					s.call(this, t, e);
				}
				var s = t("./Force"),
					r = t("../../math/Vec3"),
					o = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.DOWN = 0),
					(n.UP = 1),
					(n.LEFT = 2),
					(n.RIGHT = 3),
					(n.FORWARD = 4),
					(n.BACKWARD = 5),
					(n.prototype.init = function(t) {
						if (((this.max = this.max || 1 / 0), t.acceleration)) return (this.strength = this.acceleration.length()), void (this.direction = -1);
						var e = (this.acceleration = new r()),
							i = (this.direction = this.direction || n.DOWN),
							s = (this.strength = this.strength || 200);
						switch (i) {
							case n.DOWN:
								e.set(0, s, 0);
								break;
							case n.UP:
								e.set(0, -1 * s, 0);
								break;
							case n.LEFT:
								e.set(-1 * s, 0, 0);
								break;
							case n.RIGHT:
								e.set(s, 0, 0);
								break;
							case n.FORWARD:
								e.set(0, 0, -1 * s);
								break;
							case n.BACKWARD:
								e.set(0, 0, s);
						}
					}),
					(n.prototype.update = function() {
						for (
							var t = this.targets, e = o, i = this.max, n = this.acceleration, s = n.length(), a = s ? 1 / s : 0, h = 0, u = t.length;
							u > h;
							h++
						) {
							var c = t[h],
								l = s * c.mass;
							r.scale(n, (l > i ? i : l) * a, e), c.applyForce(e);
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Force": 73 },
		],
		75: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.source = t || null), s.call(this, e, i);
				}
				var s = t("./Force"),
					r = t("../../math/Vec3"),
					o = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function() {
						(this.max = this.max || 1 / 0), (this.strength = this.strength || 200);
					}),
					(n.prototype.update = function() {
						for (
							var t = this.source,
								e = this.targets,
								i = o,
								n = this.strength,
								s = this.max,
								a = this.anchor || t.position,
								h = this.anchor ? 1 : t.mass,
								u = 0,
								c = e.length;
							c > u;
							u++
						) {
							var l = e[u];
							r.subtract(a, l.position, i);
							var p = i.length(),
								d = p ? 1 / p : 0,
								f = n * h * l.mass * d * d;
							(f = 0 > f ? (-s > f ? -s : f) : f > s ? s : f), i.scale(f * d), l.applyForce(i), t && t.applyForce(i.invert());
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Force": 73 },
		],
		76: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					s.call(this, t, e);
				}
				var s = t("./Force"),
					r = t("../../math/Vec3"),
					o = new r();
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.QUADRATIC = function(t) {
						return t.length();
					}),
					(n.LINEAR = function() {
						return 1;
					}),
					(n.prototype.init = function() {
						(this.max = this.max || 1 / 0), (this.strength = this.strength || 1), (this.type = this.type || n.LINEAR);
					}),
					(n.prototype.update = function() {
						for (var t = this.targets, e = this.type, i = o, n = this.max, s = this.strength, a = 0, h = t.length; h > a; a++) {
							var u = t[a],
								c = u.angularVelocity,
								l = -s * e(c);
							r.scale(c, -n > l ? -n : l, i), u.applyTorque(i);
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Force": 73 },
		],
		77: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.source = t || null), s.call(this, e, i);
				}
				var s = t("./Force"),
					r = t("../../math/Vec3"),
					o = t("../../math/Mat33"),
					a = t("../../math/Quaternion"),
					h = new a(),
					u = new r(),
					c = new r(),
					l = new o(),
					p = Math.PI;
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.init = function(t) {
						this.source || (this.anchor = this.anchor ? this.anchor.normalize() : new a(1, 0, 0, 0)),
							t.stiffness || t.damping
								? ((this.stiffness = this.stiffness || 100), (this.damping = this.damping || 0), (this.period = null), (this.dampingRatio = null))
								: (t.period || t.dampingRatio) &&
								  ((this.period = this.period || 1),
								  (this.dampingRatio = this.dampingRatio || 0),
								  (this.stiffness = (2 * p) / this.period),
								  (this.stiffness *= this.stiffness),
								  (this.damping = (4 * p * this.dampingRatio) / this.period));
					}),
					(n.prototype.update = function() {
						for (
							var t = this.source,
								e = this.targets,
								i = h,
								n = u,
								s = c,
								p = l,
								d = this.max,
								f = this.stiffness,
								m = this.damping,
								g = this.anchor || t.orientation,
								_ = this.anchor ? null : t.inverseInertia,
								y = 0,
								v = e.length;
							v > y;
							y++
						) {
							var T = e[y],
								b = T.orientation;
							if ((a.conjugate(b, i), i.multiply(g), !(i.w >= 1))) {
								var E = Math.acos(i.w),
									O = Math.sqrt(1 - i.w * i.w),
									w = s.copy(i).scale((2 * E) / O);
								w.scale(f),
									null !== _ ? o.add(_, T.inverseInertia, p).inverse() : o.inverse(T.inverseInertia, p),
									0 !== m && (t ? w.add(r.subtract(T.angularVelocity, t.angularVelocity, n).scale(-m)) : w.add(r.scale(T.angularVelocity, -m, n)));
								var x = w.applyMatrix(p),
									I = x.length();
								I > d && x.scale(d / I), T.applyTorque(x), t && t.applyTorque(x.invert());
							}
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Mat33": 47, "../../math/Quaternion": 48, "../../math/Vec3": 50, "./Force": 73 },
		],
		78: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.source = t || null), s.call(this, e, i);
				}
				var s = t("./Force"),
					r = t("../../math/Vec3"),
					o = new r(),
					a = new r();
				(n.prototype = Object.create(s.prototype)), (n.prototype.constructor = n);
				var h = Math.PI;
				(n.FENE = function(t, e) {
					var i = 0.99 * e,
						n = Math.max(Math.min(t, i), -i);
					return n / (1 - (n * n) / (e * e));
				}),
					(n.HOOKE = function(t) {
						return t;
					}),
					(n.prototype.init = function(t) {
						(this.max = this.max || 1 / 0),
							(this.length = this.length || 0),
							(this.type = this.type || n.HOOKE),
							(this.maxLength = this.maxLength || 1 / 0),
							t.stiffness || t.damping
								? ((this.stiffness = this.stiffness || 100), (this.damping = this.damping || 0), (this.period = null), (this.dampingRatio = null))
								: (t.period || t.dampingRatio) &&
								  ((this.period = this.period || 1),
								  (this.dampingRatio = this.dampingRatio || 0),
								  (this.stiffness = (2 * h) / this.period),
								  (this.stiffness *= this.stiffness),
								  (this.damping = (4 * h * this.dampingRatio) / this.period));
					}),
					(n.prototype.update = function() {
						for (
							var t = this.source,
								e = this.targets,
								i = o,
								n = a,
								s = this.max,
								h = this.stiffness,
								u = this.damping,
								c = this.length,
								l = this.maxLength,
								p = this.anchor || t.position,
								d = this.anchor ? 0 : t.inverseMass,
								f = this.type,
								m = 0,
								g = e.length;
							g > m;
							m++
						) {
							var _ = e[m];
							r.subtract(p, _.position, i);
							var y = i.length(),
								v = y - c;
							if (!(Math.abs(v) < 1e-6)) {
								var T = 1 / (_.inverseMass + d);
								null !== this.period && ((h *= T), (u *= T)),
									i.scale((h * f(v, l)) / v),
									0 !== u && (t ? i.add(r.subtract(_.velocity, t.velocity, n).scale(-u)) : i.add(r.scale(_.velocity, -u, n)));
								var b = i.length(),
									E = b ? 1 / b : 0;
								r.scale(i, (b > s ? s : b) * E, i), _.applyForce(i), t && t.applyForce(i.invert());
							}
						}
					}),
					(e.exports = n);
			},
			{ "../../math/Vec3": 50, "./Force": 73 },
		],
		79: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					Particle: t("./bodies/Particle"),
					convexBodyFactory: t("./bodies/convexBodyFactory"),
					Box: t("./bodies/Box"),
					Sphere: t("./bodies/Sphere"),
					Wall: t("./bodies/Wall"),
					Constraint: t("./constraints/Constraint"),
					Angle: t("./constraints/Angle"),
					Collision: t("./constraints/Collision"),
					Direction: t("./constraints/Direction"),
					Distance: t("./constraints/Distance"),
					Curve: t("./constraints/Curve"),
					Hinge: t("./constraints/Hinge"),
					BallAndSocket: t("./constraints/BallAndSocket"),
					Force: t("./forces/Force"),
					Drag: t("./forces/Drag"),
					RotationalDrag: t("./forces/RotationalDrag"),
					Gravity1D: t("./forces/Gravity1D"),
					Gravity3D: t("./forces/Gravity3D"),
					Spring: t("./forces/Spring"),
					RotationalSpring: t("./forces/RotationalSpring"),
					PhysicsEngine: t("./PhysicsEngine"),
					Geometry: t("./Geometry"),
				};
			},
			{
				"./Geometry": 52,
				"./PhysicsEngine": 53,
				"./bodies/Box": 54,
				"./bodies/Particle": 55,
				"./bodies/Sphere": 56,
				"./bodies/Wall": 57,
				"./bodies/convexBodyFactory": 58,
				"./constraints/Angle": 59,
				"./constraints/BallAndSocket": 60,
				"./constraints/Collision": 61,
				"./constraints/Constraint": 62,
				"./constraints/Curve": 63,
				"./constraints/Direction": 64,
				"./constraints/Distance": 65,
				"./constraints/Hinge": 66,
				"./forces/Drag": 72,
				"./forces/Force": 73,
				"./forces/Gravity1D": 74,
				"./forces/Gravity3D": 75,
				"./forces/RotationalDrag": 76,
				"./forces/RotationalSpring": 77,
				"./forces/Spring": 78,
			},
		],
		80: [
			function(t, e, i) {
				"use strict";
				var n,
					s,
					r = 0,
					o = ["ms", "moz", "webkit", "o"];
				if ("object" == (typeof window === "undefined" ? "undefined" : _typeof(window))) {
					(n = window.requestAnimationFrame), (s = window.cancelAnimationFrame || window.cancelRequestAnimationFrame);
					for (var a = 0; a < o.length && !n; ++a) {
						(n = window[o[a] + "RequestAnimationFrame"]), (s = window[o[a] + "CancelRequestAnimationFrame"] || window[o[a] + "CancelAnimationFrame"]);
					}
					n && !s && (n = null);
				}
				if (!n) {
					var h = Date.now
						? Date.now
						: function() {
								return new Date().getTime();
						  };
					(n = function n(t) {
						var e = h(),
							i = Math.max(0, 16 - (e - r)),
							n = setTimeout(function() {
								t(e + i);
							}, i);
						return (r = e + i), n;
					}),
						(s = function s(t) {
							clearTimeout(t);
						});
				}
				var u = { requestAnimationFrame: n, cancelAnimationFrame: s };
				e.exports = u;
			},
			{},
		],
		81: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					requestAnimationFrame: t("./animationFrame").requestAnimationFrame,
					cancelAnimationFrame: t("./animationFrame").cancelAnimationFrame,
				};
			},
			{ "./animationFrame": 80 },
		],
		82: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this._updates = []), (this._stoppedAt = s()), (this._sleep = 0), this.start();
					var t = this;
					window.addEventListener("message", function(e) {
						t._onWindowMessage(e);
					});
				}
				var s = t("./now");
				(n.prototype._onWindowMessage = function(t) {
					this._running && t.data.constructor === Array && "FRAME" === t.data[0] && this.step(t.data[1] - this._sleep);
				}),
					(n.prototype.start = function() {
						return (this._running = !0), (this._sleep += s() - this._stoppedAt), this;
					}),
					(n.prototype.stop = function() {
						return (this._running = !1), (this._stoppedAt = s()), this;
					}),
					(n.prototype.isRunning = function() {
						return this._running;
					}),
					(n.prototype.step = function(t) {
						for (var e = 0, i = this._updates.length; i > e; e++) {
							this._updates[e].update(t);
						}
						return this;
					}),
					(n.prototype.update = function(t) {
						return -1 === this._updates.indexOf(t) && this._updates.push(t), this;
					}),
					(n.prototype.noLongerUpdate = function(t) {
						var e = this._updates.indexOf(t);
						return e > -1 && this._updates.splice(e, 1), this;
					}),
					(e.exports = n);
			},
			{ "./now": 85 },
		],
		83: [
			function(t, e, i) {
				"use strict";
				function n() {
					var t = this;
					(this._updates = []),
						(this._looper = function(e) {
							t.loop(e);
						}),
						(this._time = 0),
						(this._stoppedAt = 0),
						(this._sleep = 0),
						(this._startOnVisibilityChange = !0),
						(this._rAF = null),
						(this._sleepDiff = !0),
						this.start(),
						a &&
							document.addEventListener(u, function() {
								t._onVisibilityChange();
							});
				}
				var s = t("../polyfills"),
					r = s.requestAnimationFrame,
					o = s.cancelAnimationFrame,
					a = "undefined" != typeof document;
				if (a) {
					var h, u;
					"undefined" != typeof document.hidden
						? ((h = "hidden"), (u = "visibilitychange"))
						: "undefined" != typeof document.mozHidden
						? ((h = "mozHidden"), (u = "mozvisibilitychange"))
						: "undefined" != typeof document.msHidden
						? ((h = "msHidden"), (u = "msvisibilitychange"))
						: "undefined" != typeof document.webkitHidden && ((h = "webkitHidden"), (u = "webkitvisibilitychange"));
				}
				(n.prototype._onVisibilityChange = function() {
					document[h] ? this._onUnfocus() : this._onFocus();
				}),
					(n.prototype._onFocus = function() {
						this._startOnVisibilityChange && this._start();
					}),
					(n.prototype._onUnfocus = function() {
						this._stop();
					}),
					(n.prototype.start = function() {
						return this._running || ((this._startOnVisibilityChange = !0), this._start()), this;
					}),
					(n.prototype._start = function() {
						(this._running = !0), (this._sleepDiff = !0), (this._rAF = r(this._looper));
					}),
					(n.prototype.stop = function() {
						return this._running && ((this._startOnVisibilityChange = !1), this._stop()), this;
					}),
					(n.prototype._stop = function() {
						(this._running = !1), (this._stoppedAt = this._time), o(this._rAF);
					}),
					(n.prototype.isRunning = function() {
						return this._running;
					}),
					(n.prototype.step = function(t) {
						(this._time = t), this._sleepDiff && ((this._sleep += t - this._stoppedAt), (this._sleepDiff = !1));
						for (var e = t - this._sleep, i = 0, n = this._updates.length; n > i; i++) {
							this._updates[i].update(e);
						}
						return this;
					}),
					(n.prototype.loop = function(t) {
						return this.step(t), (this._rAF = r(this._looper)), this;
					}),
					(n.prototype.update = function(t) {
						return -1 === this._updates.indexOf(t) && this._updates.push(t), this;
					}),
					(n.prototype.noLongerUpdate = function(t) {
						var e = this._updates.indexOf(t);
						return e > -1 && this._updates.splice(e, 1), this;
					}),
					(e.exports = n);
			},
			{ "../polyfills": 81 },
		],
		84: [
			function(t, e, i) {
				"use strict";
				e.exports = { RequestAnimationFrameLoop: t("./RequestAnimationFrameLoop"), ContainerLoop: t("./ContainerLoop"), now: t("./now") };
			},
			{ "./ContainerLoop": 82, "./RequestAnimationFrameLoop": 83, "./now": 85 },
		],
		85: [
			function(t, e, i) {
				"use strict";
				var n =
					window.performance && window.performance.now
						? function() {
								return window.performance.now();
						  }
						: Date.now;
				e.exports = n;
			},
			{},
		],
		86: [
			function(t, e, i) {
				"use strict";
				function n() {
					r(), (this._contexts = {}), (this._outCommands = []), (this._inCommands = []), (this._time = null), (this._resized = !1);
					var t = this;
					window.addEventListener("resize", function() {
						t.onResize();
					});
				}
				var s = t("./Context"),
					r = t("./inject-css"),
					o = t("../core/Commands");
				(n.prototype.onResize = function() {
					this._resized = !0;
					for (var t in this._contexts) {
						this._contexts[t].updateSize();
					}
				}),
					(n.prototype.getTime = function() {
						return this._time;
					}),
					(n.prototype.sendEvent = function(t, e, i) {
						this._outCommands.push(o.WITH, t, o.TRIGGER, e, i);
					}),
					(n.prototype.sendResize = function(t, e) {
						this.sendEvent(t, "CONTEXT_RESIZE", e);
					}),
					(n.prototype.handleWith = function(t, e) {
						var i = e[t],
							n = i.split("/"),
							s = this.getOrSetContext(n.shift());
						return s.receive(i, e, t);
					}),
					(n.prototype.getOrSetContext = function(t) {
						if (this._contexts[t]) return this._contexts[t];
						var e = new s(t, this);
						return (this._contexts[t] = e), e;
					}),
					(n.prototype.getContext = function(t) {
						return this._contexts[t] ? this._contexts[t] : void 0;
					}),
					(n.prototype.drawCommands = function() {
						for (var t = this._inCommands, e = 0, i = t[e]; i; ) {
							switch (i) {
								case o.TIME:
									this._time = t[++e];
									break;
								case o.WITH:
									e = this.handleWith(++e, t);
									break;
								case o.NEED_SIZE_FOR:
									this.giveSizeFor(++e, t);
							}
							i = t[++e];
						}
						for (var n in this._contexts) {
							this._contexts[n].draw();
						}
						return this._resized && this.updateSize(), this._outCommands;
					}),
					(n.prototype.updateSize = function() {
						for (var t in this._contexts) {
							this._contexts[t].updateSize();
						}
					}),
					(n.prototype.receiveCommands = function(t) {
						for (var e = t.length, i = 0; e > i; i++) {
							this._inCommands.push(t[i]);
						}
						for (var n in this._contexts) {
							this._contexts[n].checkInit();
						}
					}),
					(n.prototype.giveSizeFor = function(t, e) {
						var i = e[t],
							n = this.getContext(i);
						if (n) {
							var s = n.getRootSize();
							this.sendResize(i, s);
						} else this.getOrSetContext(i);
					}),
					(n.prototype.clearCommands = function() {
						(this._inCommands.length = 0), (this._outCommands.length = 0), (this._resized = !1);
					}),
					(e.exports = n);
			},
			{ "../core/Commands": 15, "./Context": 87, "./inject-css": 90 },
		],
		87: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					if (((this._compositor = e), (this._rootEl = document.querySelector(t)), (this._selector = t), null === this._rootEl))
						throw new Error('Failed to create Context: No matches for "' + t + '" found.');
					(this._selector = t),
						this._initDOMRenderer(),
						(this._webGLRenderer = null),
						(this._domRenderer = new L(this._domRendererRootEl, t, e)),
						(this._canvasEl = null),
						(this._renderState = {
							projectionType: N.ORTHOGRAPHIC_PROJECTION,
							perspectiveTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
							viewTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
							viewDirty: !1,
							perspectiveDirty: !1,
						}),
						(this._size = []),
						(this._meshTransform = new Float32Array(16)),
						(this._meshSize = [0, 0, 0]),
						(this._initDOM = !1),
						(this._commandCallbacks = []),
						this.initCommandCallbacks(),
						this.updateSize();
				}
				function s(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.preventDefault(i[++n]), n;
				}
				function r(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.allowDefault(i[++n]), n;
				}
				function o(t, e, i, n) {
					return (t._initDOM = !0), n;
				}
				function a(t, e, i, n) {
					return t._domRenderer.insertEl(i[++n]), n;
				}
				function h(t, e, i, n) {
					return t._domRenderer.getSizeOf(i[++n]), n;
				}
				function u(t, e, i, n) {
					var s = t._meshTransform;
					return (
						(s[0] = i[++n]),
						(s[1] = i[++n]),
						(s[2] = i[++n]),
						(s[3] = i[++n]),
						(s[4] = i[++n]),
						(s[5] = i[++n]),
						(s[6] = i[++n]),
						(s[7] = i[++n]),
						(s[8] = i[++n]),
						(s[9] = i[++n]),
						(s[10] = i[++n]),
						(s[11] = i[++n]),
						(s[12] = i[++n]),
						(s[13] = i[++n]),
						(s[14] = i[++n]),
						(s[15] = i[++n]),
						t._domRenderer.setMatrix(s),
						t._webGLRenderer && t._webGLRenderer.setCutoutUniform(e, "u_transform", s),
						n
					);
				}
				function c(t, e, i, n) {
					var s = i[++n],
						r = i[++n];
					return (
						t._domRenderer.setSize(s, r),
						t._webGLRenderer && ((t._meshSize[0] = s), (t._meshSize[1] = r), t._webGLRenderer.setCutoutUniform(e, "u_size", t._meshSize)),
						n
					);
				}
				function l(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.setProperty(i[++n], i[++n]), n;
				}
				function p(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.setContent(i[++n]), n;
				}
				function d(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.setAttribute(i[++n], i[++n]), n;
				}
				function f(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.addClass(i[++n]), n;
				}
				function m(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.removeClass(i[++n]), n;
				}
				function g(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.subscribe(i[++n]), n;
				}
				function _(t, e, i, n) {
					return t._webGLRenderer && t._webGLRenderer.getOrSetCutout(e), t._domRenderer.unsubscribe(i[++n]), n;
				}
				function y(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setMeshOptions(e, i[++n]), n;
				}
				function v(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setAmbientLightColor(e, i[++n], i[++n], i[++n]), n;
				}
				function T(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setLightPosition(e, i[++n], i[++n], i[++n]), n;
				}
				function b(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setLightColor(e, i[++n], i[++n], i[++n]), n;
				}
				function E(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.handleMaterialInput(e, i[++n], i[++n]), n;
				}
				function O(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setGeometry(e, i[++n], i[++n], i[++n]), n;
				}
				function w(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setMeshUniform(e, i[++n], i[++n]), n;
				}
				function x(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.bufferData(i[++n], i[++n], i[++n], i[++n], i[++n]), n;
				}
				function I(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setCutoutState(e, i[++n]), n;
				}
				function C(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.setMeshVisibility(e, i[++n]), n;
				}
				function S(t, e, i, n) {
					return t._webGLRenderer || t._initWebGLRenderer(), t._webGLRenderer.removeMesh(e), n;
				}
				function R(t, e, i, n) {
					return (
						(t._renderState.projectionType = N.PINHOLE_PROJECTION),
						(t._renderState.perspectiveTransform[11] = -1 / i[++n]),
						(t._renderState.perspectiveDirty = !0),
						n
					);
				}
				function A(t, e, i, n) {
					return (
						(t._renderState.projectionType = N.ORTHOGRAPHIC_PROJECTION),
						(t._renderState.perspectiveTransform[11] = 0),
						(t._renderState.perspectiveDirty = !0),
						n
					);
				}
				function M(t, e, i, n) {
					return (
						(t._renderState.viewTransform[0] = i[++n]),
						(t._renderState.viewTransform[1] = i[++n]),
						(t._renderState.viewTransform[2] = i[++n]),
						(t._renderState.viewTransform[3] = i[++n]),
						(t._renderState.viewTransform[4] = i[++n]),
						(t._renderState.viewTransform[5] = i[++n]),
						(t._renderState.viewTransform[6] = i[++n]),
						(t._renderState.viewTransform[7] = i[++n]),
						(t._renderState.viewTransform[8] = i[++n]),
						(t._renderState.viewTransform[9] = i[++n]),
						(t._renderState.viewTransform[10] = i[++n]),
						(t._renderState.viewTransform[11] = i[++n]),
						(t._renderState.viewTransform[12] = i[++n]),
						(t._renderState.viewTransform[13] = i[++n]),
						(t._renderState.viewTransform[14] = i[++n]),
						(t._renderState.viewTransform[15] = i[++n]),
						(t._renderState.viewDirty = !0),
						n
					);
				}
				var D = t("../webgl-renderers/WebGLRenderer"),
					N = t("../components/Camera"),
					L = t("../dom-renderers/DOMRenderer"),
					z = t("../core/Commands");
				(n.prototype.updateSize = function() {
					var t = this._rootEl.offsetWidth,
						e = this._rootEl.offsetHeight;
					return (
						(this._size[0] = t),
						(this._size[1] = e),
						(this._size[2] = t > e ? t : e),
						this._compositor.sendResize(this._selector, this._size),
						this._webGLRenderer && this._webGLRenderer.updateSize(this._size),
						this
					);
				}),
					(n.prototype.draw = function() {
						this._domRenderer.draw(this._renderState),
							this._webGLRenderer && this._webGLRenderer.draw(this._renderState),
							this._renderState.perspectiveDirty && (this._renderState.perspectiveDirty = !1),
							this._renderState.viewDirty && (this._renderState.viewDirty = !1);
					}),
					(n.prototype._initDOMRenderer = function() {
						(this._domRendererRootEl = document.createElement("div")),
							this._rootEl.appendChild(this._domRendererRootEl),
							(this._domRendererRootEl.style.visibility = "hidden"),
							(this._domRenderer = new L(this._domRendererRootEl, this._selector, this._compositor));
					}),
					(n.prototype.initCommandCallbacks = function() {
						(this._commandCallbacks[z.INIT_DOM] = a),
							(this._commandCallbacks[z.DOM_RENDER_SIZE] = h),
							(this._commandCallbacks[z.CHANGE_TRANSFORM] = u),
							(this._commandCallbacks[z.CHANGE_SIZE] = c),
							(this._commandCallbacks[z.CHANGE_PROPERTY] = l),
							(this._commandCallbacks[z.CHANGE_CONTENT] = p),
							(this._commandCallbacks[z.CHANGE_ATTRIBUTE] = d),
							(this._commandCallbacks[z.ADD_CLASS] = f),
							(this._commandCallbacks[z.REMOVE_CLASS] = m),
							(this._commandCallbacks[z.SUBSCRIBE] = g),
							(this._commandCallbacks[z.UNSUBSCRIBE] = _),
							(this._commandCallbacks[z.GL_SET_DRAW_OPTIONS] = y),
							(this._commandCallbacks[z.GL_AMBIENT_LIGHT] = v),
							(this._commandCallbacks[z.GL_LIGHT_POSITION] = T),
							(this._commandCallbacks[z.GL_LIGHT_COLOR] = b),
							(this._commandCallbacks[z.MATERIAL_INPUT] = E),
							(this._commandCallbacks[z.GL_SET_GEOMETRY] = O),
							(this._commandCallbacks[z.GL_UNIFORMS] = w),
							(this._commandCallbacks[z.GL_BUFFER_DATA] = x),
							(this._commandCallbacks[z.GL_CUTOUT_STATE] = I),
							(this._commandCallbacks[z.GL_MESH_VISIBILITY] = C),
							(this._commandCallbacks[z.GL_REMOVE_MESH] = S),
							(this._commandCallbacks[z.PINHOLE_PROJECTION] = R),
							(this._commandCallbacks[z.ORTHOGRAPHIC_PROJECTION] = A),
							(this._commandCallbacks[z.CHANGE_VIEW_TRANSFORM] = M),
							(this._commandCallbacks[z.PREVENT_DEFAULT] = s),
							(this._commandCallbacks[z.ALLOW_DEFAULT] = r),
							(this._commandCallbacks[z.READY] = o);
					}),
					(n.prototype._initWebGLRenderer = function() {
						(this._webGLRendererRootEl = document.createElement("canvas")),
							this._rootEl.appendChild(this._webGLRendererRootEl),
							(this._webGLRenderer = new D(this._webGLRendererRootEl, this._compositor)),
							this._webGLRenderer.updateSize(this._size);
					}),
					(n.prototype.getRootSize = function() {
						return [this._rootEl.offsetWidth, this._rootEl.offsetHeight];
					}),
					(n.prototype.checkInit = function() {
						this._initDOM && ((this._domRendererRootEl.style.visibility = "visible"), (this._initDOM = !1));
					}),
					(n.prototype.receive = function(t, e, i) {
						var n = i,
							s = e[++n];
						for (this._domRenderer.loadPath(t); null != s; ) {
							if (s === z.WITH || s === z.TIME) return n - 1;
							(n = this._commandCallbacks[s](this, t, e, n) + 1), (s = e[n]);
						}
						return n;
					}),
					(n.prototype.getDOMRenderer = function() {
						return this._domRenderer;
					}),
					(n.prototype.getWebGLRenderer = function() {
						return this._webGLRenderer;
					}),
					(e.exports = n);
			},
			{ "../components/Camera": 2, "../core/Commands": 15, "../dom-renderers/DOMRenderer": 30, "../webgl-renderers/WebGLRenderer": 136 },
		],
		88: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this._thread = t), (this._compositor = e), (this._renderLoop = i), this._renderLoop.update(this);
					var n = this;
					(this._thread.onmessage = function(t) {
						var e = t.data ? t.data : t;
						if (e[0] === s.ENGINE)
							switch (e[1]) {
								case s.START:
									n._engine.start();
									break;
								case s.STOP:
									n._engine.stop();
									break;
								default:
									console.error('Unknown ENGINE command "' + e[1] + '"');
							}
						else n._compositor.receiveCommands(e);
					}),
						(this._thread.onerror = function(t) {
							console.error(t);
						});
				}
				var s = t("../core/Commands");
				(n.prototype.getThread = function() {
					return this._thread;
				}),
					(n.prototype.getCompositor = function() {
						return this._compositor;
					}),
					(n.prototype.getEngine = function() {
						return this._renderLoop;
					}),
					(n.prototype.getRenderLoop = function() {
						return this._renderLoop;
					}),
					(n.prototype.update = function(t) {
						this._thread.postMessage([s.FRAME, t]);
						var e = this._compositor.drawCommands();
						this._thread.postMessage(e), this._compositor.clearCommands();
					}),
					(e.exports = n);
			},
			{ "../core/Commands": 15 },
		],
		89: [
			function(t, e, i) {
				"use strict";
				e.exports = { Compositor: t("./Compositor"), Context: t("./Context"), UIManager: t("./UIManager"), injectCSS: t("./inject-css") };
			},
			{ "./Compositor": 86, "./Context": 87, "./UIManager": 88, "./inject-css": 90 },
		],
		90: [
			function(t, e, i) {
				"use strict";
				function n() {
					if (!r)
						if (((r = !0), document.createStyleSheet)) {
							var t = document.createStyleSheet();
							t.cssText = s;
						} else {
							var e = document.getElementsByTagName("head")[0],
								i = document.createElement("style");
							i.styleSheet ? (i.styleSheet.cssText = s) : i.appendChild(document.createTextNode(s)),
								(e ? e : document.documentElement).appendChild(i);
						}
				}
				var s =
						".famous-dom-renderer {width:100%;height:100%;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;}.famous-dom-element {-webkit-transform-origin:0% 0%;transform-origin:0% 0%;-webkit-backface-visibility:visible;backface-visibility:visible;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;-webkit-tap-highlight-color:transparent;pointer-events:auto;z-index:1;}.famous-dom-element-content,.famous-dom-element {position:absolute;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;}.famous-webgl-renderer {-webkit-transform:translateZ(1000000px);transform:translateZ(1000000px);pointer-events:none;position:absolute;z-index:1;top:0;width:100%;height:100%;}",
					r = "undefined" == typeof document;
				e.exports = n;
			},
			{},
		],
		91: [
			function(t, e, i) {
				"use strict";
				var n = {
					linear: function linear(t) {
						return t;
					},
					easeIn: function easeIn(t) {
						return t * t;
					},
					easeOut: function easeOut(t) {
						return t * (2 - t);
					},
					easeInOut: function easeInOut(t) {
						return 0.5 >= t ? 2 * t * t : -2 * t * t + 4 * t - 1;
					},
					easeOutBounce: function easeOutBounce(t) {
						return t * (3 - 2 * t);
					},
					spring: function spring(t) {
						return (1 - t) * Math.sin(6 * Math.PI * t) + t;
					},
					inQuad: function inQuad(t) {
						return t * t;
					},
					outQuad: function outQuad(t) {
						return -(t -= 1) * t + 1;
					},
					inOutQuad: function inOutQuad(t) {
						return (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
					},
					inCubic: function inCubic(t) {
						return t * t * t;
					},
					outCubic: function outCubic(t) {
						return --t * t * t + 1;
					},
					inOutCubic: function inOutCubic(t) {
						return (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
					},
					inQuart: function inQuart(t) {
						return t * t * t * t;
					},
					outQuart: function outQuart(t) {
						return -(--t * t * t * t - 1);
					},
					inOutQuart: function inOutQuart(t) {
						return (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2);
					},
					inQuint: function inQuint(t) {
						return t * t * t * t * t;
					},
					outQuint: function outQuint(t) {
						return --t * t * t * t * t + 1;
					},
					inOutQuint: function inOutQuint(t) {
						return (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2);
					},
					inSine: function inSine(t) {
						return -1 * Math.cos(t * (Math.PI / 2)) + 1;
					},
					outSine: function outSine(t) {
						return Math.sin(t * (Math.PI / 2));
					},
					inOutSine: function inOutSine(t) {
						return -0.5 * (Math.cos(Math.PI * t) - 1);
					},
					inExpo: function inExpo(t) {
						return 0 === t ? 0 : Math.pow(2, 10 * (t - 1));
					},
					outExpo: function outExpo(t) {
						return 1 === t ? 1 : -Math.pow(2, -10 * t) + 1;
					},
					inOutExpo: function inOutExpo(t) {
						return 0 === t ? 0 : 1 === t ? 1 : (t /= 0.5) < 1 ? 0.5 * Math.pow(2, 10 * (t - 1)) : 0.5 * (-Math.pow(2, -10 * --t) + 2);
					},
					inCirc: function inCirc(t) {
						return -(Math.sqrt(1 - t * t) - 1);
					},
					outCirc: function outCirc(t) {
						return Math.sqrt(1 - --t * t);
					},
					inOutCirc: function inOutCirc(t) {
						return (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
					},
					inElastic: function inElastic(t) {
						var e = 1.70158,
							i = 0,
							n = 1;
						return 0 === t
							? 0
							: 1 === t
							? 1
							: (i || (i = 0.3),
							  (e = (i / (2 * Math.PI)) * Math.asin(1 / n)),
							  -(n * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - e) * (2 * Math.PI)) / i)));
					},
					outElastic: function outElastic(t) {
						var e = 1.70158,
							i = 0,
							n = 1;
						return 0 === t
							? 0
							: 1 === t
							? 1
							: (i || (i = 0.3),
							  (e = (i / (2 * Math.PI)) * Math.asin(1 / n)),
							  n * Math.pow(2, -10 * t) * Math.sin(((t - e) * (2 * Math.PI)) / i) + 1);
					},
					inOutElastic: function inOutElastic(t) {
						var e = 1.70158,
							i = 0,
							n = 1;
						return 0 === t
							? 0
							: 2 === (t /= 0.5)
							? 1
							: (i || (i = 0.3 * 1.5),
							  (e = (i / (2 * Math.PI)) * Math.asin(1 / n)),
							  1 > t
									? -0.5 * (n * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - e) * (2 * Math.PI)) / i))
									: n * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t - e) * (2 * Math.PI)) / i) * 0.5 + 1);
					},
					inBack: function inBack(t, e) {
						return void 0 === e && (e = 1.70158), t * t * ((e + 1) * t - e);
					},
					outBack: function outBack(t, e) {
						return void 0 === e && (e = 1.70158), --t * t * ((e + 1) * t + e) + 1;
					},
					inOutBack: function inOutBack(t, e) {
						return (
							void 0 === e && (e = 1.70158),
							(t /= 0.5) < 1 ? 0.5 * (t * t * (((e *= 1.525) + 1) * t - e)) : 0.5 * ((t -= 2) * t * (((e *= 1.525) + 1) * t + e) + 2)
						);
					},
					inBounce: function inBounce(t) {
						return 1 - n.outBounce(1 - t);
					},
					outBounce: function outBounce(t) {
						return 1 / 2.75 > t
							? 7.5625 * t * t
							: 2 / 2.75 > t
							? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
							: 2.5 / 2.75 > t
							? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
							: 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
					},
					inOutBounce: function inOutBounce(t) {
						return 0.5 > t ? 0.5 * n.inBounce(2 * t) : 0.5 * n.outBounce(2 * t - 1) + 0.5;
					},
					flat: function flat() {
						return 0;
					},
				};
				e.exports = n;
			},
			{},
		],
		92: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._queue = []), (this._from = null), (this._state = null), (this._startedAt = null), (this._pausedAt = null), null != t && this.from(t);
				}
				var s = t("./Curves"),
					r = t("../core/FamousEngine");
				(n.Clock = r.getClock()),
					(n.prototype.to = function(t, e, i, n, r) {
						return (
							(e = null != e && e.constructor === String ? s[e] : e),
							0 === this._queue.length && ((this._startedAt = this.constructor.Clock.now()), (this._pausedAt = null)),
							this._queue.push(t, null != e ? e : s.linear, null != i ? i : 100, n, r),
							this
						);
					}),
					(n.prototype.from = function(t) {
						return (
							(this._state = t),
							(this._from = this._sync(null, this._state)),
							(this._queue.length = 0),
							(this._startedAt = this.constructor.Clock.now()),
							(this._pausedAt = null),
							this
						);
					}),
					(n.prototype.delay = function(t, e) {
						var i = this._queue.length > 0 ? this._queue[this._queue.length - 5] : this._state;
						return this.to(i, s.flat, t, e);
					}),
					(n.prototype.override = function(t, e, i, n, r) {
						return (
							this._queue.length > 0 &&
								(null != t && (this._queue[0] = t),
								null != e && (this._queue[1] = e.constructor === String ? s[e] : e),
								null != i && (this._queue[2] = i),
								null != n && (this._queue[3] = n),
								null != r && (this._queue[4] = r)),
							this
						);
					}),
					(n.prototype._interpolate = function(t, e, i, n, s) {
						if (i instanceof Object) {
							if ("slerp" === s) {
								var r, o, a, h, u, c, l, p, d, f, m, g, _;
								if (((r = e[0]), (o = e[1]), (a = e[2]), (h = e[3]), (u = i[0]), (c = i[1]), (l = i[2]), (p = i[3]), 1 === n))
									return (t[0] = u), (t[1] = c), (t[2] = l), (t[3] = p), t;
								(f = h * p + r * u + o * c + a * l),
									1 - f > 1e-5
										? ((d = Math.acos(f)), (m = Math.sin(d)), (g = Math.sin((1 - n) * d) / m), (_ = Math.sin(n * d) / m))
										: ((g = 1 - n), (_ = n)),
									(t[0] = r * g + u * _),
									(t[1] = o * g + c * _),
									(t[2] = a * g + l * _),
									(t[3] = h * g + p * _);
							} else if (i instanceof Array)
								for (var y = 0, v = i.length; v > y; y++) {
									t[y] = this._interpolate(t[y], e[y], i[y], n, s);
								}
							else
								for (var T in i) {
									t[T] = this._interpolate(t[T], e[T], i[T], n, s);
								}
						} else t = e + n * (i - e);
						return t;
					}),
					(n.prototype._sync = function t(e, i) {
						if ("number" == typeof i) e = i;
						else if (i instanceof Array) {
							null == e && (e = []);
							for (var n = 0, s = i.length; s > n; n++) {
								e[n] = t(e[n], i[n]);
							}
						} else if (i instanceof Object) {
							null == e && (e = {});
							for (var r in i) {
								e[r] = t(e[r], i[r]);
							}
						}
						return e;
					}),
					(n.prototype.get = function(t) {
						if (0 === this._queue.length) return this._state;
						(t = this._pausedAt ? this._pausedAt : t), (t = t ? t : this.constructor.Clock.now());
						var e = (t - this._startedAt) / this._queue[2];
						this._state = this._interpolate(this._state, this._from, this._queue[0], this._queue[1](e > 1 ? 1 : e), this._queue[4]);
						var i = this._state;
						if (e >= 1) {
							(this._startedAt = this._startedAt + this._queue[2]),
								(this._from = this._sync(this._from, this._state)),
								this._queue.shift(),
								this._queue.shift(),
								this._queue.shift();
							var n = this._queue.shift();
							this._queue.shift(), n && n();
						}
						return e > 1 ? this.get() : i;
					}),
					(n.prototype.isActive = function() {
						return this._queue.length > 0;
					}),
					(n.prototype.halt = function() {
						return this.from(this.get());
					}),
					(n.prototype.pause = function() {
						return (this._pausedAt = this.constructor.Clock.now()), this;
					}),
					(n.prototype.isPaused = function() {
						return !!this._pausedAt;
					}),
					(n.prototype.resume = function() {
						var t = this._pausedAt - this._startedAt;
						return (this._startedAt = this.constructor.Clock.now() - t), (this._pausedAt = null), this;
					}),
					(n.prototype.reset = function(t) {
						return this.from(t);
					}),
					(n.prototype.set = function(t, e, i) {
						return null == e ? (this.from(t), i && i()) : this.to(t, e.curve, e.duration, i, e.method), this;
					}),
					(e.exports = n);
			},
			{ "../core/FamousEngine": 18, "./Curves": 91 },
		],
		93: [
			function(t, e, i) {
				"use strict";
				e.exports = { Curves: t("./Curves"), Transitionable: t("./Transitionable") };
			},
			{ "./Curves": 91, "./Transitionable": 92 },
		],
		94: [
			function(t, e, i) {
				"use strict";
				function n() {
					this._events = {};
				}
				(n.prototype.on = function(t, e) {
					this._events[t] || (this._events[t] = []);
					var i = this._events[t];
					return (
						i.push(e),
						function() {
							i.splice(i.indexOf(e), 1);
						}
					);
				}),
					(n.prototype.off = function(t, e) {
						var i = this._events[t];
						return i && i.splice(i.indexOf(e), 1), this;
					}),
					(n.prototype.trigger = function(t, e) {
						var i = this._events[t];
						if (i)
							for (var n = 0, s = i.length; s > n; n++) {
								i[n](e);
							}
						return this;
					}),
					(e.exports = n);
			},
			{},
		],
		95: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this._r = new s(0)), (this._g = new s(0)), (this._b = new s(0)), (this._opacity = new s(1)), t && this.set(t, e, i);
				}
				var s = t("../transitions/Transitionable");
				(n.prototype.toString = function() {
					return "Color";
				}),
					(n.prototype.set = function(t, e, i) {
						switch (n.determineType(t)) {
							case "hex":
								return this.setHex(t, e, i);
							case "colorName":
								return this.setColor(t, e, i);
							case "instance":
								return this.changeTo(t, e, i);
							case "rgb":
								return this.setRGB(t[0], t[1], t[2], e, i);
						}
						return this;
					}),
					(n.prototype.isActive = function() {
						return this._r.isActive() || this._g.isActive() || this._b.isActive() || this._opacity.isActive();
					}),
					(n.prototype.halt = function() {
						return this._r.halt(), this._g.halt(), this._b.halt(), this._opacity.halt(), this;
					}),
					(n.prototype.changeTo = function(t, e, i) {
						if (n.isColorInstance(t)) {
							var s = t.getRGB();
							this.setRGB(s[0], s[1], s[2], e, i);
						}
						return this;
					}),
					(n.prototype.setColor = function(t, e, i) {
						return r[t] && this.setHex(r[t], e, i), this;
					}),
					(n.prototype.getColor = function(t) {
						return n.isString(t) && (t = t.toLowerCase()), "hex" === t ? this.getHex() : this.getRGB();
					}),
					(n.prototype.setR = function(t, e, i) {
						return this._r.set(t, e, i), this;
					}),
					(n.prototype.setG = function(t, e, i) {
						return this._g.set(t, e, i), this;
					}),
					(n.prototype.setB = function(t, e, i) {
						return this._b.set(t, e, i), this;
					}),
					(n.prototype.setOpacity = function(t, e, i) {
						return this._opacity.set(t, e, i), this;
					}),
					(n.prototype.setRGB = function(t, e, i, n, s) {
						return this.setR(t, n), this.setG(e, n), this.setB(i, n, s), this;
					}),
					(n.prototype.getR = function() {
						return this._r.get();
					}),
					(n.prototype.getG = function() {
						return this._g.get();
					}),
					(n.prototype.getB = function() {
						return this._b.get();
					}),
					(n.prototype.getOpacity = function() {
						return this._opacity.get();
					}),
					(n.prototype.getRGB = function() {
						return [this.getR(), this.getG(), this.getB()];
					}),
					(n.prototype.getNormalizedRGB = function() {
						var t = this.getR() / 255,
							e = this.getG() / 255,
							i = this.getB() / 255;
						return [t, e, i];
					}),
					(n.prototype.getNormalizedRGBA = function() {
						var t = this.getR() / 255,
							e = this.getG() / 255,
							i = this.getB() / 255,
							n = this.getOpacity();
						return [t, e, i, n];
					}),
					(n.prototype.getHex = function() {
						var t = n.toHex(this.getR()),
							e = n.toHex(this.getG()),
							i = n.toHex(this.getB());
						return "#" + t + e + i;
					}),
					(n.prototype.setHex = function(t, e, i) {
						if (((t = "#" === t.charAt(0) ? t.substring(1, t.length) : t), 3 === t.length)) {
							var n = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
							t = t.replace(n, function(t, e, i, n) {
								return e + e + i + i + n + n;
							});
						}
						var s = parseInt(t.substring(0, 2), 16),
							r = parseInt(t.substring(2, 4), 16),
							o = parseInt(t.substring(4, 6), 16);
						return this.setRGB(s, r, o, e, i), this;
					}),
					(n.toHex = function(t) {
						var e = t.toString(16);
						return 1 === e.length ? "0" + e : e;
					}),
					(n.determineType = function(t) {
						return n.isColorInstance(t) ? "instance" : r[t] ? "colorName" : n.isHex(t) ? "hex" : Array.isArray(t) ? "rgb" : void 0;
					}),
					(n.isString = function(t) {
						return "string" == typeof t;
					}),
					(n.isHex = function(t) {
						return n.isString(t) ? "#" === t[0] : !1;
					}),
					(n.isColorInstance = function(t) {
						return !!t.getColor;
					});
				var r = {
					aliceblue: "#f0f8ff",
					antiquewhite: "#faebd7",
					aqua: "#00ffff",
					aquamarine: "#7fffd4",
					azure: "#f0ffff",
					beige: "#f5f5dc",
					bisque: "#ffe4c4",
					black: "#000000",
					blanchedalmond: "#ffebcd",
					blue: "#0000ff",
					blueviolet: "#8a2be2",
					brown: "#a52a2a",
					burlywood: "#deb887",
					cadetblue: "#5f9ea0",
					chartreuse: "#7fff00",
					chocolate: "#d2691e",
					coral: "#ff7f50",
					cornflowerblue: "#6495ed",
					cornsilk: "#fff8dc",
					crimson: "#dc143c",
					cyan: "#00ffff",
					darkblue: "#00008b",
					darkcyan: "#008b8b",
					darkgoldenrod: "#b8860b",
					darkgray: "#a9a9a9",
					darkgreen: "#006400",
					darkgrey: "#a9a9a9",
					darkkhaki: "#bdb76b",
					darkmagenta: "#8b008b",
					darkolivegreen: "#556b2f",
					darkorange: "#ff8c00",
					darkorchid: "#9932cc",
					darkred: "#8b0000",
					darksalmon: "#e9967a",
					darkseagreen: "#8fbc8f",
					darkslateblue: "#483d8b",
					darkslategray: "#2f4f4f",
					darkslategrey: "#2f4f4f",
					darkturquoise: "#00ced1",
					darkviolet: "#9400d3",
					deeppink: "#ff1493",
					deepskyblue: "#00bfff",
					dimgray: "#696969",
					dimgrey: "#696969",
					dodgerblue: "#1e90ff",
					firebrick: "#b22222",
					floralwhite: "#fffaf0",
					forestgreen: "#228b22",
					fuchsia: "#ff00ff",
					gainsboro: "#dcdcdc",
					ghostwhite: "#f8f8ff",
					gold: "#ffd700",
					goldenrod: "#daa520",
					gray: "#808080",
					green: "#008000",
					greenyellow: "#adff2f",
					grey: "#808080",
					honeydew: "#f0fff0",
					hotpink: "#ff69b4",
					indianred: "#cd5c5c",
					indigo: "#4b0082",
					ivory: "#fffff0",
					khaki: "#f0e68c",
					lavender: "#e6e6fa",
					lavenderblush: "#fff0f5",
					lawngreen: "#7cfc00",
					lemonchiffon: "#fffacd",
					lightblue: "#add8e6",
					lightcoral: "#f08080",
					lightcyan: "#e0ffff",
					lightgoldenrodyellow: "#fafad2",
					lightgray: "#d3d3d3",
					lightgreen: "#90ee90",
					lightgrey: "#d3d3d3",
					lightpink: "#ffb6c1",
					lightsalmon: "#ffa07a",
					lightseagreen: "#20b2aa",
					lightskyblue: "#87cefa",
					lightslategray: "#778899",
					lightslategrey: "#778899",
					lightsteelblue: "#b0c4de",
					lightyellow: "#ffffe0",
					lime: "#00ff00",
					limegreen: "#32cd32",
					linen: "#faf0e6",
					magenta: "#ff00ff",
					maroon: "#800000",
					mediumaquamarine: "#66cdaa",
					mediumblue: "#0000cd",
					mediumorchid: "#ba55d3",
					mediumpurple: "#9370db",
					mediumseagreen: "#3cb371",
					mediumslateblue: "#7b68ee",
					mediumspringgreen: "#00fa9a",
					mediumturquoise: "#48d1cc",
					mediumvioletred: "#c71585",
					midnightblue: "#191970",
					mintcream: "#f5fffa",
					mistyrose: "#ffe4e1",
					moccasin: "#ffe4b5",
					navajowhite: "#ffdead",
					navy: "#000080",
					oldlace: "#fdf5e6",
					olive: "#808000",
					olivedrab: "#6b8e23",
					orange: "#ffa500",
					orangered: "#ff4500",
					orchid: "#da70d6",
					palegoldenrod: "#eee8aa",
					palegreen: "#98fb98",
					paleturquoise: "#afeeee",
					palevioletred: "#db7093",
					papayawhip: "#ffefd5",
					peachpuff: "#ffdab9",
					peru: "#cd853f",
					pink: "#ffc0cb",
					plum: "#dda0dd",
					powderblue: "#b0e0e6",
					purple: "#800080",
					rebeccapurple: "#663399",
					red: "#ff0000",
					rosybrown: "#bc8f8f",
					royalblue: "#4169e1",
					saddlebrown: "#8b4513",
					salmon: "#fa8072",
					sandybrown: "#f4a460",
					seagreen: "#2e8b57",
					seashell: "#fff5ee",
					sienna: "#a0522d",
					silver: "#c0c0c0",
					skyblue: "#87ceeb",
					slateblue: "#6a5acd",
					slategray: "#708090",
					slategrey: "#708090",
					snow: "#fffafa",
					springgreen: "#00ff7f",
					steelblue: "#4682b4",
					tan: "#d2b48c",
					teal: "#008080",
					thistle: "#d8bfd8",
					tomato: "#ff6347",
					turquoise: "#40e0d0",
					violet: "#ee82ee",
					wheat: "#f5deb3",
					white: "#ffffff",
					whitesmoke: "#f5f5f5",
					yellow: "#ffff00",
					yellowgreen: "#9acd32",
				};
				e.exports = n;
			},
			{ "../transitions/Transitionable": 92 },
		],
		96: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					0: 48,
					1: 49,
					2: 50,
					3: 51,
					4: 52,
					5: 53,
					6: 54,
					7: 55,
					8: 56,
					9: 57,
					a: 97,
					b: 98,
					c: 99,
					d: 100,
					e: 101,
					f: 102,
					g: 103,
					h: 104,
					i: 105,
					j: 106,
					k: 107,
					l: 108,
					m: 109,
					n: 110,
					o: 111,
					p: 112,
					q: 113,
					r: 114,
					s: 115,
					t: 116,
					u: 117,
					v: 118,
					w: 119,
					x: 120,
					y: 121,
					z: 122,
					A: 65,
					B: 66,
					C: 67,
					D: 68,
					E: 69,
					F: 70,
					G: 71,
					H: 72,
					I: 73,
					J: 74,
					K: 75,
					L: 76,
					M: 77,
					N: 78,
					O: 79,
					P: 80,
					Q: 81,
					R: 82,
					S: 83,
					T: 84,
					U: 85,
					V: 86,
					W: 87,
					X: 88,
					Y: 89,
					Z: 90,
					ENTER: 13,
					LEFT_ARROW: 37,
					RIGHT_ARROW: 39,
					UP_ARROW: 38,
					DOWN_ARROW: 40,
					SPACE: 32,
					SHIFT: 16,
					TAB: 9,
				};
			},
			{},
		],
		97: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					return function() {
						return 0 !== t.length ? t.pop() : new e();
					};
				}
				function s(t) {
					return function(e) {
						t.push(e);
					};
				}
				var r = {};
				(r.pools = {}),
					(r.register = function(t, e) {
						var i = (this.pools[t] = []);
						(this["request" + t] = n(i, e)), (this["free" + t] = s(i));
					}),
					(r.disposeOf = function(t) {
						for (var e = this.pools[t], i = e.length; i--; ) {
							e.pop();
						}
					}),
					(e.exports = r);
			},
			{},
		],
		98: [
			function(t, e, i) {
				"use strict";
				function n() {
					(this._keyToValue = {}), (this._values = []), (this._keys = []), (this._keyToIndex = {}), (this._freedIndices = []);
				}
				(n.prototype.register = function(t, e) {
					var i = this._keyToIndex[t];
					null == i
						? ((i = this._freedIndices.pop()),
						  void 0 === i && (i = this._values.length),
						  (this._values[i] = e),
						  (this._keys[i] = t),
						  (this._keyToIndex[t] = i),
						  (this._keyToValue[t] = e))
						: ((this._keyToValue[t] = e), (this._values[i] = e));
				}),
					(n.prototype.unregister = function(t) {
						var e = this._keyToIndex[t];
						null != e &&
							(this._freedIndices.push(e),
							(this._keyToValue[t] = null),
							(this._keyToIndex[t] = null),
							(this._values[e] = null),
							(this._keys[e] = null));
					}),
					(n.prototype.get = function(t) {
						return this._keyToValue[t];
					}),
					(n.prototype.getValues = function() {
						return this._values;
					}),
					(n.prototype.getKeys = function() {
						return this._keys;
					}),
					(n.prototype.getKeyToValue = function() {
						return this._keyToValue;
					}),
					(e.exports = n);
			},
			{},
		],
		99: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					return e > t ? e : t > i ? i : t;
				}
				e.exports = n;
			},
			{},
		],
		100: [
			function(t, e, i) {
				"use strict";
				var n = function t(e) {
					var i;
					if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e))) {
						i = e instanceof Array ? [] : {};
						for (var n in e) {
							if ("object" == _typeof(e[n]) && null !== e[n]) {
								if (e[n] instanceof Array) {
									i[n] = new Array(e[n].length);
									for (var s = 0; s < e[n].length; s++) {
										i[n][s] = t(e[n][s]);
									}
								} else i[n] = t(e[n]);
							} else i[n] = e[n];
						}
					} else i = e;
					return i;
				};
				e.exports = n;
			},
			{},
		],
		101: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					CallbackStore: t("./CallbackStore"),
					clamp: t("./clamp"),
					clone: t("./clone"),
					Color: t("./Color"),
					KeyCodes: t("./KeyCodes"),
					keyValueToArrays: t("./keyValueToArrays"),
					loadURL: t("./loadURL"),
					ObjectManager: t("./ObjectManager"),
					Registry: t("./Registry"),
					strip: t("./strip"),
					vendorPrefix: t("./vendorPrefix"),
				};
			},
			{
				"./CallbackStore": 94,
				"./Color": 95,
				"./KeyCodes": 96,
				"./ObjectManager": 97,
				"./Registry": 98,
				"./clamp": 99,
				"./clone": 100,
				"./keyValueToArrays": 102,
				"./loadURL": 103,
				"./strip": 104,
				"./vendorPrefix": 105,
			},
		],
		102: [
			function(t, e, i) {
				"use strict";
				e.exports = function(t) {
					var e = [],
						i = [],
						n = 0;
					for (var s in t) {
						t.hasOwnProperty(s) && ((e[n] = s), (i[n] = t[s]), n++);
					}
					return { keys: e, values: i };
				};
			},
			{},
		],
		103: [
			function(t, e, i) {
				"use strict";
				var n = function n(t, e) {
					var i = new XMLHttpRequest();
					(i.onreadystatechange = function() {
						4 === this.readyState && e && e(this.responseText);
					}),
						i.open("GET", t),
						i.send();
				};
				e.exports = n;
			},
			{},
		],
		104: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					switch (t) {
						case null:
						case void 0:
							return t;
					}
					switch (t.constructor) {
						case Boolean:
						case Number:
						case String:
							return t;
						case Object:
							for (var e in t) {
								var i = n(t[e], !0);
								t[e] = i;
							}
							return t;
						default:
							return null;
					}
				}
				e.exports = n;
			},
			{},
		],
		105: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					for (var e = 0; e < s.length; e++) {
						var i = s[e] + t;
						if ("" === document.documentElement.style[i]) return i;
					}
					return t;
				}
				var s = ["", "-ms-", "-webkit-", "-moz-", "-o-"];
				e.exports = n;
			},
			{},
		],
		106: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t), (this.spec.dynamic = !0);
				}
				var s = t("./Geometry");
				(n.prototype.getLength = function() {
					return this.getVertexPositions().length;
				}),
					(n.prototype.getVertexBuffer = function(t) {
						if (!t) throw "getVertexBuffer requires a name";
						var e = this.spec.bufferNames.indexOf(t);
						if (~e) return this.spec.bufferValues[e];
						throw "buffer does not exist";
					}),
					(n.prototype.setVertexBuffer = function(t, e, i) {
						var n = this.spec.bufferNames.indexOf(t);
						return (
							-1 === n && (n = this.spec.bufferNames.push(t) - 1),
							(this.spec.bufferValues[n] = e || []),
							(this.spec.bufferSpacings[n] = i || this.DEFAULT_BUFFER_SIZE),
							-1 === this.spec.invalidations.indexOf(n) && this.spec.invalidations.push(n),
							this
						);
					}),
					(n.prototype.fromGeometry = function(t) {
						for (var e = t.spec.bufferNames.length, i = 0; e > i; i++) {
							this.setVertexBuffer(t.spec.bufferNames[i], t.spec.bufferValues[i], t.spec.bufferSpacings[i]);
						}
						return this;
					}),
					(n.prototype.setVertexPositions = function(t) {
						return this.setVertexBuffer("a_pos", t, 3);
					}),
					(n.prototype.setNormals = function(t) {
						return this.setVertexBuffer("a_normals", t, 3);
					}),
					(n.prototype.setTextureCoords = function(t) {
						return this.setVertexBuffer("a_texCoord", t, 2);
					}),
					(n.prototype.setIndices = function(t) {
						return this.setVertexBuffer("indices", t, 1);
					}),
					(n.prototype.setDrawType = function(t) {
						return (this.spec.type = t.toUpperCase()), this;
					}),
					(n.prototype.getVertexPositions = function() {
						return this.getVertexBuffer("a_pos");
					}),
					(n.prototype.getNormals = function() {
						return this.getVertexBuffer("a_normals");
					}),
					(n.prototype.getTextureCoords = function() {
						return this.getVertexBuffer("a_texCoord");
					}),
					(e.exports = n);
			},
			{ "./Geometry": 107 },
		],
		107: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					if (
						((this.options = t || {}),
						(this.DEFAULT_BUFFER_SIZE = 3),
						(this.spec = {
							id: s++,
							dynamic: !1,
							type: this.options.type || "TRIANGLES",
							bufferNames: [],
							bufferValues: [],
							bufferSpacings: [],
							invalidations: [],
						}),
						this.options.buffers)
					)
						for (var e = this.options.buffers.length, i = 0; e > i; ) {
							this.spec.bufferNames.push(this.options.buffers[i].name),
								this.spec.bufferValues.push(this.options.buffers[i].data),
								this.spec.bufferSpacings.push(this.options.buffers[i].size || this.DEFAULT_BUFFER_SIZE),
								this.spec.invalidations.push(i++);
						}
				}
				var s = 0;
				e.exports = n;
			},
			{},
		],
		108: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					return -(e + (t - e) / 2);
				}
				function s(t, e) {
					return 1 / ((t - e) / 2);
				}
				var r = t("../math/Vec3"),
					o = t("../math/Vec2"),
					a = [new r(), new r(), new r(), new o(), new o()],
					h = {};
				(h.generateParametric = function(t, e, i, n) {
					var s,
						r,
						o,
						a,
						h = [],
						u = Math.PI / (t - 1),
						c = n ? Math.PI + u : Math.PI,
						l = [];
					for (s = 0; t + 1 > s; s++) {
						for (r = ((0 === s ? 1e-4 : s) * Math.PI) / t, a = 0; e > a; a++) {
							(o = (2 * a * c) / e), i(r, o, l), h.push(l[0], l[1], l[2]);
						}
					}
					var p,
						d = [],
						f = 0;
					for (s = 0; t > s; s++) {
						for (a = 0; e > a; a++) {
							(p = (a + 1) % e), d.push(f + a, f + a + e, f + p), d.push(f + p, f + a + e, f + p + e);
						}
						f += e;
					}
					return { vertices: h, indices: d };
				}),
					(h.computeNormals = function(t, e, i) {
						var n,
							s,
							r,
							o,
							h,
							u,
							c,
							l,
							p,
							d,
							f = i || [],
							m = e.length / 3;
						for (u = 0; m > u; u++) {
							(s = 3 * e[3 * u + 0]),
								(n = 3 * e[3 * u + 1]),
								(r = 3 * e[3 * u + 2]),
								a[0].set(t[n], t[n + 1], t[n + 2]),
								a[1].set(t[s], t[s + 1], t[s + 2]),
								a[2].set(t[r], t[r + 1], t[r + 2]),
								(o = a[2]
									.subtract(a[0])
									.cross(a[1].subtract(a[0]))
									.normalize()),
								(f[n + 0] = (f[n + 0] || 0) + o.x),
								(f[n + 1] = (f[n + 1] || 0) + o.y),
								(f[n + 2] = (f[n + 2] || 0) + o.z),
								(f[s + 0] = (f[s + 0] || 0) + o.x),
								(f[s + 1] = (f[s + 1] || 0) + o.y),
								(f[s + 2] = (f[s + 2] || 0) + o.z),
								(f[r + 0] = (f[r + 0] || 0) + o.x),
								(f[r + 1] = (f[r + 1] || 0) + o.y),
								(f[r + 2] = (f[r + 2] || 0) + o.z);
						}
						for (u = 0; u < f.length; u += 3) {
							for (c = f[u], l = f[u + 1], p = f[u + 2], d = Math.sqrt(c * c + l * l + p * p), h = 0; 3 > h; h++) {
								f[u + h] /= d;
							}
						}
						return f;
					}),
					(h.subdivide = function(t, e, i) {
						for (var n, s, h, u, c, l, p = t.length / 3; p--; ) {
							(n = t.slice(3 * p, 3 * p + 3)),
								(c = n.map(function(t) {
									return new r(e[3 * t], e[3 * t + 1], e[3 * t + 2]);
								})),
								e.push.apply(e, r.scale(r.add(c[0], c[1], a[0]), 0.5, a[1]).toArray()),
								e.push.apply(e, r.scale(r.add(c[1], c[2], a[0]), 0.5, a[1]).toArray()),
								e.push.apply(e, r.scale(r.add(c[0], c[2], a[0]), 0.5, a[1]).toArray()),
								i &&
									((l = n.map(function(t) {
										return new o(i[2 * t], i[2 * t + 1]);
									})),
									i.push.apply(i, o.scale(o.add(l[0], l[1], a[3]), 0.5, a[4]).toArray()),
									i.push.apply(i, o.scale(o.add(l[1], l[2], a[3]), 0.5, a[4]).toArray()),
									i.push.apply(i, o.scale(o.add(l[0], l[2], a[3]), 0.5, a[4]).toArray())),
								(s = e.length - 3),
								(h = s + 1),
								(u = s + 2),
								t.push(s, h, u),
								t.push(n[0], s, u),
								t.push(s, n[1], h),
								(t[p] = u),
								(t[p + 1] = h),
								(t[p + 2] = n[2]);
						}
					}),
					(h.getUniqueFaces = function(t, e) {
						for (var i, n = e.length / 3, s = []; n--; ) {
							for (var r = 0; 3 > r; r++) {
								(i = e[3 * n + r]), s[i] ? (t.push(t[3 * i], t[3 * i + 1], t[3 * i + 2]), (e[3 * n + r] = t.length / 3 - 1)) : (s[i] = !0);
							}
						}
					}),
					(h.subdivideSpheroid = function(t, e) {
						for (var i, n, s, o, h, u = e.length / 3; u--; ) {
							(n = e.slice(3 * u, 3 * u + 3)),
								(i = n.map(function(e) {
									return new r(t[3 * e], t[3 * e + 1], t[3 * e + 2]);
								})),
								t.push.apply(t, r.normalize(r.add(i[0], i[1], a[0]), a[1]).toArray()),
								t.push.apply(t, r.normalize(r.add(i[1], i[2], a[0]), a[1]).toArray()),
								t.push.apply(t, r.normalize(r.add(i[0], i[2], a[0]), a[1]).toArray()),
								(s = t.length / 3 - 3),
								(o = s + 1),
								(h = s + 2),
								e.push(s, o, h),
								e.push(n[0], s, h),
								e.push(s, n[1], o),
								(e[3 * u] = h),
								(e[3 * u + 1] = o),
								(e[3 * u + 2] = n[2]);
						}
					}),
					(h.getSpheroidNormals = function(t, e) {
						e = e || [];
						for (var i, n = t.length / 3, s = 0; n > s; s++) {
							(i = new r(t[3 * s + 0], t[3 * s + 1], t[3 * s + 2]).normalize().toArray()),
								(e[3 * s + 0] = i[0]),
								(e[3 * s + 1] = i[1]),
								(e[3 * s + 2] = i[2]);
						}
						return e;
					}),
					(h.getSpheroidUV = function(t, e) {
						e = e || [];
						for (var i, n = t.length / 3, s = [], r = 0; n > r; r++) {
							i = a[0]
								.set(t[3 * r], t[3 * r + 1], t[3 * r + 2])
								.normalize()
								.toArray();
							var o = this.getAzimuth(i),
								h = this.getAltitude(i);
							(s[0] = (0.5 * o) / Math.PI + 0.5), (s[1] = h / Math.PI + 0.5), e.push.apply(e, s);
						}
						return e;
					}),
					(h.normalizeAll = function(t, e) {
						e = e || [];
						for (var i = t.length / 3, n = 0; i > n; n++) {
							Array.prototype.push.apply(e, new r(t[3 * n], t[3 * n + 1], t[3 * n + 2]).normalize().toArray());
						}
						return e;
					}),
					(h.normalizeVertices = function(t, e) {
						e = e || [];
						var i,
							o,
							a,
							h,
							u,
							c,
							l,
							p,
							d = t.length / 3,
							f = [];
						for (p = 0; d > p; p++) {
							(l = f[p] = new r(t[3 * p], t[3 * p + 1], t[3 * p + 2])),
								(null == i || l.x < i) && (i = l.x),
								(null == o || l.x > o) && (o = l.x),
								(null == a || l.y < a) && (a = l.y),
								(null == h || l.y > h) && (h = l.y),
								(null == u || l.z < u) && (u = l.z),
								(null == c || l.z > c) && (c = l.z);
						}
						var m = new r(n(o, i), n(h, a), n(c, u)),
							g = Math.min(s(o + m.x, i + m.x), s(h + m.y, a + m.y), s(c + m.z, u + m.z));
						for (p = 0; p < f.length; p++) {
							e.push.apply(
								e,
								f[p]
									.add(m)
									.scale(g)
									.toArray()
							);
						}
						return e;
					}),
					(h.getAzimuth = function(t) {
						return Math.atan2(t[2], -t[0]);
					}),
					(h.getAltitude = function(t) {
						return Math.atan2(-t[1], Math.sqrt(t[0] * t[0] + t[2] * t[2]));
					}),
					(h.trianglesToLines = function(t, e) {
						var i = t.length / 3;
						e = e || [];
						var n;
						for (n = 0; i > n; n++) {
							e.push(t[3 * n + 0], t[3 * n + 1]), e.push(t[3 * n + 1], t[3 * n + 2]), e.push(t[3 * n + 2], t[3 * n + 0]);
						}
						return e;
					}),
					(h.addBackfaceTriangles = function(t, e) {
						for (var i = e.length / 3, n = 0, s = e.length; s--; ) {
							e[s] > n && (n = e[s]);
						}
						for (n++, s = 0; i > s; s++) {
							var r = e[3 * s],
								o = e[3 * s + 1],
								a = e[3 * s + 2];
							e.push(r + n, a + n, o + n);
						}
						var h = t.length;
						for (s = 0; h > s; s++) {
							t.push(t[s]);
						}
					}),
					(e.exports = h);
			},
			{ "../math/Vec2": 49, "../math/Vec3": 50 },
		],
		109: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					t = r(t);
					var i = t.split("\n"),
						n = [];
					e = e || {};
					for (var o, a, h, u, c, l, p = [], d = [], f = [], m = [], g = [], _ = [], y = i.length, v = 0; y > v; v++) {
						(l = i[v]),
							(c = i[v].trim().split(" ")),
							-1 !== l.indexOf("v ")
								? _.push([parseFloat(c[1]), parseFloat(c[2]), parseFloat(c[3])])
								: -1 !== l.indexOf("vt ")
								? g.push([parseFloat(c[1]), parseFloat(c[2])])
								: -1 !== l.indexOf("vn ")
								? m.push([parseFloat(c[1]), parseFloat(c[2]), parseFloat(c[3])])
								: -1 !== l.indexOf("f ")
								? -1 !== c[1].indexOf("//")
									? ((o = c[1].split("//")),
									  (a = c[2].split("//")),
									  (h = c[3].split("//")),
									  d.push([parseFloat(o[0]) - 1, parseFloat(a[0]) - 1, parseFloat(h[0]) - 1]),
									  f.push([parseFloat(o[1]) - 1, parseFloat(a[1]) - 1, parseFloat(h[1]) - 1]),
									  c[4] &&
											((u = c[4].split("//")),
											d.push([parseFloat(o[0]) - 1, parseFloat(h[0]) - 1, parseFloat(u[0]) - 1]),
											f.push([parseFloat(o[2]) - 1, parseFloat(h[2]) - 1, parseFloat(u[2]) - 1])))
									: -1 !== c[1].indexOf("/")
									? ((o = c[1].split("/")),
									  (a = c[2].split("/")),
									  (h = c[3].split("/")),
									  d.push([parseFloat(o[0]) - 1, parseFloat(a[0]) - 1, parseFloat(h[0]) - 1]),
									  p.push([parseFloat(o[1]) - 1, parseFloat(a[1]) - 1, parseFloat(h[1]) - 1]),
									  f.push([parseFloat(o[2]) - 1, parseFloat(a[2]) - 1, parseFloat(h[2]) - 1]),
									  c[4] &&
											((u = c[4].split("/")),
											d.push([parseFloat(o[0]) - 1, parseFloat(h[0]) - 1, parseFloat(u[0]) - 1]),
											p.push([parseFloat(o[1]) - 1, parseFloat(h[1]) - 1, parseFloat(u[1]) - 1]),
											f.push([parseFloat(o[2]) - 1, parseFloat(h[2]) - 1, parseFloat(u[2]) - 1])))
									: (d.push([parseFloat(c[1]) - 1, parseFloat(c[2]) - 1, parseFloat(c[3]) - 1]),
									  p.push([parseFloat(c[1]) - 1, parseFloat(c[2]) - 1, parseFloat(c[3]) - 1]),
									  f.push([parseFloat(c[1]) - 1, parseFloat(c[2]) - 1, parseFloat(c[3]) - 1]),
									  c[4] &&
											(d.push([parseFloat(c[1]) - 1, parseFloat(c[3]) - 1, parseFloat(c[4]) - 1]),
											p.push([parseFloat(c[1]) - 1, parseFloat(c[3]) - 1, parseFloat(c[4]) - 1]),
											f.push([parseFloat(c[1]) - 1, parseFloat(c[3]) - 1, parseFloat(c[4]) - 1])))
								: -1 !== l.indexOf("g ") && (d.length && n.push(s(_, m, g, d, f, p, e)), (d.length = 0), (p.length = 0), (f.length = 0));
					}
					return n.push(s(_, m, g, d, f, p, e)), n;
				}
				function s(t, e, i, n, s, r, h) {
					var c = o(t, e, i, n, s, r);
					return (
						(c.vertices = a(c.vertices)),
						(c.normals = a(c.normals)),
						(c.texCoords = a(c.texCoords)),
						(c.indices = a(c.indices)),
						h.normalize && (c.vertices = u.normalizeVertices(c.vertices)),
						h.computeNormals && (c.normals = u.computeNormals(c.vertices, c.indices)),
						{ vertices: c.vertices, normals: c.normals, textureCoords: c.texCoords, indices: c.indices }
					);
				}
				function r(t) {
					return t.replace(/ +(?= )/g, "").replace(/\s+$/g, "");
				}
				function o(t, e, i, n, s, r) {
					for (var o, a, h, u, c, l = [], p = [], d = [], f = [], m = {}, g = 0, _ = n.length, y = s.length, v = r.length, T = 0; _ > T; T++) {
						(f[T] = []), (u = n[T].length);
						for (var b = 0; u > b; b++) {
							v && (h = r[T][b]),
								y && (a = s[T][b]),
								(o = n[T][b]),
								(c = m[o + "," + a + "," + h]),
								void 0 === c && ((c = g++), p.push(t[o]), y && l.push(e[a]), v && d.push(i[h]), (m[o + "," + a + "," + h] = c)),
								f[T].push(c);
						}
					}
					return { vertices: p, normals: l, texCoords: d, indices: f };
				}
				function a(t) {
					for (var e = t.length, i = [], n = 0; e > n; n++) {
						i.push.apply(i, t[n]);
					}
					return i;
				}
				var h = t("../utilities/loadURL"),
					u = t("./GeometryHelper"),
					c = { cached: {}, requests: {}, formatText: n };
				(c.load = function(t, e, i) {
					this.cached[t]
						? e(this.cached[t])
						: this.requests[t]
						? this.requests[t].push(e)
						: ((this.requests[t] = [e]), h(t, this._onsuccess.bind(this, t, i)));
				}),
					(c._onsuccess = function(t, e, i) {
						var s = n.call(this, i, e || {});
						this.cached[t] = s;
						for (var r = 0; r < this.requests[t].length; r++) {
							this.requests[t][r](s);
						}
						this.requests[t] = null;
					}),
					(e.exports = c);
			},
			{ "../utilities/loadURL": 103, "./GeometryHelper": 108 },
		],
		110: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					Box: t("./primitives/Box"),
					Circle: t("./primitives/Circle"),
					Cylinder: t("./primitives/Cylinder"),
					GeodesicSphere: t("./primitives/GeodesicSphere"),
					Icosahedron: t("./primitives/Icosahedron"),
					ParametricCone: t("./primitives/ParametricCone"),
					Plane: t("./primitives/Plane"),
					Sphere: t("./primitives/Sphere"),
					Tetrahedron: t("./primitives/Tetrahedron"),
					Torus: t("./primitives/Torus"),
					Triangle: t("./primitives/Triangle"),
					GeometryHelper: t("./GeometryHelper"),
					DynamicGeometry: t("./DynamicGeometry"),
					Geometry: t("./Geometry"),
					OBJLoader: t("./OBJLoader"),
				};
			},
			{
				"./DynamicGeometry": 106,
				"./Geometry": 107,
				"./GeometryHelper": 108,
				"./OBJLoader": 109,
				"./primitives/Box": 111,
				"./primitives/Circle": 112,
				"./primitives/Cylinder": 113,
				"./primitives/GeodesicSphere": 114,
				"./primitives/Icosahedron": 115,
				"./primitives/ParametricCone": 116,
				"./primitives/Plane": 117,
				"./primitives/Sphere": 118,
				"./primitives/Tetrahedron": 119,
				"./primitives/Torus": 120,
				"./primitives/Triangle": 121,
			},
		],
		111: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					return [2 * (1 & t) - 1, (2 & t) - 1, (4 & t) / 2 - 1];
				}
				function s(t) {
					t = t || {};
					var e,
						i,
						s,
						a,
						h,
						u = [],
						c = [],
						l = [],
						p = [];
					for (a = 0; a < o.length; a++) {
						for (e = o[a], s = 4 * a, h = 0; 4 > h; h++) {
							i = e[h];
							var d = n(i);
							u.push(d[0], d[1], d[2]), c.push(1 & h, (2 & h) / 2), l.push(e[4], e[5], e[6]);
						}
						p.push(s, s + 1, s + 2), p.push(s + 2, s + 1, s + 3);
					}
					return (
						(t.buffers = [
							{ name: "a_pos", data: u },
							{ name: "a_texCoord", data: c, size: 2 },
							{ name: "a_normals", data: l },
							{ name: "indices", data: p, size: 1 },
						]),
						new r(t)
					);
				}
				var r = t("../Geometry"),
					o = [
						[0, 4, 2, 6, -1, 0, 0],
						[1, 3, 5, 7, 1, 0, 0],
						[0, 1, 4, 5, 0, -1, 0],
						[2, 6, 3, 7, 0, 1, 0],
						[0, 2, 1, 3, 0, 0, -1],
						[4, 5, 6, 7, 0, 0, 1],
					];
				e.exports = s;
			},
			{ "../Geometry": 107 },
		],
		112: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					var e = t.detail || 30,
						i = r(e, !0);
					t.backface !== !1 && a.addBackfaceTriangles(i.vertices, i.indices);
					var n = s(i.vertices),
						h = a.computeNormals(i.vertices, i.indices);
					return (
						(t.buffers = [
							{ name: "a_pos", data: i.vertices },
							{ name: "a_texCoord", data: n, size: 2 },
							{ name: "a_normals", data: h },
							{ name: "indices", data: i.indices, size: 1 },
						]),
						new o(t)
					);
				}
				function s(t) {
					for (var e = [], i = t.length / 3, n = 0; i > n; n++) {
						var s = t[3 * n],
							r = t[3 * n + 1];
						e.push(0.5 + 0.5 * s, 0.5 + 0.5 * -r);
					}
					return e;
				}
				function r(t) {
					for (var e, i, n, s = [0, 0, 0], r = [], o = 1, a = 0; t + 1 > a; a++) {
						(e = (a / t) * Math.PI * 2), (i = Math.cos(e)), (n = Math.sin(e)), s.push(i, n, 0), a > 0 && r.push(0, o, ++o);
					}
					return { vertices: s, indices: r };
				}
				var o = t("../Geometry"),
					a = t("../GeometryHelper");
				e.exports = n;
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		113: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					var e,
						i = t.radius || 1,
						o = t.detail || 15;
					return (
						(e = r.generateParametric(o, o, n.generator.bind(null, i))),
						t.backface !== !1 && r.addBackfaceTriangles(e.vertices, e.indices),
						(t.buffers = [
							{ name: "a_pos", data: e.vertices },
							{ name: "a_texCoord", data: r.getSpheroidUV(e.vertices), size: 2 },
							{ name: "a_normals", data: r.computeNormals(e.vertices, e.indices) },
							{ name: "indices", data: e.indices, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				(n.generator = function(t, e, i, n) {
					(n[1] = t * Math.sin(i)), (n[0] = t * Math.cos(i)), (n[2] = t * (-1 + (e / Math.PI) * 2));
				}),
					(e.exports = n);
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		114: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					var e = 0.5 * (1 + Math.sqrt(5)),
						i = [-1, e, 0, 1, e, 0, -1, -e, 0, 1, -e, 0, 0, -1, -e, 0, 1, -e, 0, -1, e, 0, 1, e, e, 0, 1, e, 0, -1, -e, 0, 1, -e, 0, -1],
						n = [
							0,
							5,
							11,
							0,
							1,
							5,
							0,
							7,
							1,
							0,
							10,
							7,
							0,
							11,
							10,
							1,
							9,
							5,
							5,
							4,
							11,
							11,
							2,
							10,
							10,
							6,
							7,
							7,
							8,
							1,
							3,
							4,
							9,
							3,
							2,
							4,
							3,
							6,
							2,
							3,
							8,
							6,
							3,
							9,
							8,
							4,
							5,
							9,
							2,
							11,
							4,
							6,
							10,
							2,
							8,
							7,
							6,
							9,
							1,
							8,
						];
					(i = r.normalizeAll(i)), (t = t || {});
					for (var o = t.detail || 3; --o; ) {
						r.subdivideSpheroid(i, n);
					}
					r.getUniqueFaces(i, n);
					var a = r.computeNormals(i, n),
						h = r.getSpheroidUV(i);
					return (
						(t.buffers = [
							{ name: "a_pos", data: i },
							{ name: "a_texCoord", data: h, size: 2 },
							{ name: "a_normals", data: a },
							{ name: "indices", data: n, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				e.exports = n;
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		115: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					var e = (1 + Math.sqrt(5)) / 2,
						i = [-1, e, 0, 1, e, 0, -1, -e, 0, 1, -e, 0, 0, -1, -e, 0, 1, -e, 0, -1, e, 0, 1, e, e, 0, 1, e, 0, -1, -e, 0, 1, -e, 0, -1],
						n = [
							0,
							5,
							11,
							0,
							1,
							5,
							0,
							7,
							1,
							0,
							10,
							7,
							0,
							11,
							10,
							1,
							9,
							5,
							5,
							4,
							11,
							11,
							2,
							10,
							10,
							6,
							7,
							7,
							8,
							1,
							3,
							4,
							9,
							3,
							2,
							4,
							3,
							6,
							2,
							3,
							8,
							6,
							3,
							9,
							8,
							4,
							5,
							9,
							2,
							11,
							4,
							6,
							10,
							2,
							8,
							7,
							6,
							9,
							1,
							8,
						];
					r.getUniqueFaces(i, n);
					var o = r.computeNormals(i, n),
						a = r.getSpheroidUV(i);
					return (
						(i = r.normalizeAll(i)),
						(t.buffers = [
							{ name: "a_pos", data: i },
							{ name: "a_texCoord", data: a, size: 2 },
							{ name: "a_normals", data: o },
							{ name: "indices", data: n, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				e.exports = n;
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		116: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					var e = t.detail || 15,
						i = t.radius || 1 / Math.PI,
						o = r.generateParametric(e, e, n.generator.bind(null, i));
					return (
						t.backface !== !1 && r.addBackfaceTriangles(o.vertices, o.indices),
						(t.buffers = [
							{ name: "a_pos", data: o.vertices },
							{ name: "a_texCoord", data: r.getSpheroidUV(o.vertices), size: 2 },
							{ name: "a_normals", data: r.computeNormals(o.vertices, o.indices) },
							{ name: "indices", data: o.indices, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				(n.generator = function(t, e, i, n) {
					(n[0] = -t * e * Math.cos(i)), (n[1] = t * e * Math.sin(i)), (n[2] = -e / (Math.PI / 2) + 1);
				}),
					(e.exports = n);
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		117: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					for (var e, i = t.detailX || t.detail || 1, n = t.detailY || t.detail || 1, o = [], a = [], h = [], u = [], c = 0; n >= c; c++) {
						for (var l = c / n, p = 0; i >= p; p++) {
							var d = p / i;
							o.push(2 * (d - 0.5), 2 * (l - 0.5), 0),
								a.push(d, 1 - l),
								i > p && n > c && ((e = p + c * (i + 1)), u.push(e, e + 1, e + i + 1), u.push(e + i + 1, e + 1, e + i + 2));
						}
					}
					if (t.backface !== !1) {
						r.addBackfaceTriangles(o, u);
						var f = a.length;
						for (e = 0; f > e; e++) {
							a.push(a[e]);
						}
					}
					return (
						(h = r.computeNormals(o, u)),
						(t.buffers = [
							{ name: "a_pos", data: o },
							{ name: "a_texCoord", data: a, size: 2 },
							{ name: "a_normals", data: h },
							{ name: "indices", data: u, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				e.exports = n;
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		118: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					var e = t.detail || 10,
						i = t.detailX || e,
						o = t.detailY || e,
						a = r.generateParametric(i, o, n.generator, !0);
					return (
						(t.buffers = [
							{ name: "a_pos", data: a.vertices },
							{ name: "a_texCoord", data: r.getSpheroidUV(a.vertices), size: 2 },
							{ name: "a_normals", data: r.getSpheroidNormals(a.vertices) },
							{ name: "indices", data: a.indices, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				(n.generator = function(t, e, i) {
					var n = Math.sin(t) * Math.cos(e),
						s = Math.cos(t),
						r = -Math.sin(t) * Math.sin(e);
					(i[0] = n), (i[1] = s), (i[2] = r);
				}),
					(e.exports = n);
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		119: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					var e,
						i,
						n = [],
						o = [],
						a = Math.sqrt(3),
						h = [
							1,
							-1,
							-1 / a,
							-1,
							-1,
							-1 / a,
							0,
							1,
							0,
							0,
							1,
							0,
							0,
							-1,
							a - 1 / a,
							1,
							-1,
							-1 / a,
							0,
							1,
							0,
							-1,
							-1,
							-1 / a,
							0,
							-1,
							a - 1 / a,
							0,
							-1,
							a - 1 / a,
							-1,
							-1,
							-1 / a,
							1,
							-1,
							-1 / a,
						],
						u = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
					for (i = 0; 4 > i; i++) {
						n.push(0, 0, 0.5, 1, 1, 0);
					}
					for (t = t || {}; --e; ) {
						r.subdivide(u, h, n);
					}
					return (
						(o = r.computeNormals(h, u)),
						(t.buffers = [
							{ name: "a_pos", data: h },
							{ name: "a_texCoord", data: n, size: 2 },
							{ name: "a_normals", data: o },
							{ name: "indices", data: u, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				e.exports = n;
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		120: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					var e = t.detail || 30,
						i = t.holeRadius || 0.8,
						o = t.tubeRadius || 0.2,
						a = r.generateParametric(e, e, n.generator.bind(null, i, o));
					return (
						(t.buffers = [
							{ name: "a_pos", data: a.vertices },
							{ name: "a_texCoord", data: r.getSpheroidUV(a.vertices), size: 2 },
							{ name: "a_normals", data: r.computeNormals(a.vertices, a.indices) },
							{ name: "indices", data: a.indices, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				(n.generator = function(t, e, i, n, s) {
					(s[0] = (t + e * Math.cos(2 * n)) * Math.sin(2 * i)), (s[1] = -(t + e * Math.cos(2 * n)) * Math.cos(2 * i)), (s[2] = e * Math.sin(2 * n));
				}),
					(e.exports = n);
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		121: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					t = t || {};
					for (var e = t.detail || 1, i = [], n = [0, 0, 0.5, 1, 1, 0], o = [0, 1, 2], a = [-1, -1, 0, 0, 1, 0, 1, -1, 0]; --e; ) {
						r.subdivide(o, a, n);
					}
					return (
						t.backface !== !1 && r.addBackfaceTriangles(a, o),
						(i = r.computeNormals(a, o)),
						(t.buffers = [
							{ name: "a_pos", data: a },
							{ name: "a_texCoord", data: n, size: 2 },
							{ name: "a_normals", data: i },
							{ name: "indices", data: o, size: 1 },
						]),
						new s(t)
					);
				}
				var s = t("../Geometry"),
					r = t("../GeometryHelper");
				e.exports = n;
			},
			{ "../Geometry": 107, "../GeometryHelper": 108 },
		],
		122: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i, r) {
					(r = r || {}),
						(this.name = t),
						(this.chunk = e),
						(this.inputs = i ? (Array.isArray(i) ? i : [i]) : []),
						(this.uniforms = r.uniforms || {}),
						(this.varyings = r.varyings),
						(this.attributes = r.attributes),
						(this.meshes = []),
						r.texture && (this.texture = r.texture.__isATexture__ ? r.texture : s.register(null, r.texture)),
						(this._id = n.id++),
						(this.invalidations = []),
						(this.__isAMaterial__ = !0);
				}
				var s = t("./TextureRegistry"),
					r = {},
					o = {
						abs: { glsl: "abs(%1);", output: { 4: 4, 3: 3, 2: 2, 1: 1 } },
						sign: { glsl: "sign(%1);", output: { 4: 4, 3: 3, 2: 2, 1: 1 } },
						floor: { glsl: "floor(%1);", output: { 4: 4, 3: 3, 2: 2, 1: 1 } },
						ceiling: { glsl: "ceil(%1);", output: { 4: 4, 3: 3, 2: 2, 1: 1 } },
						mod: { glsl: "mod(%1, %2);" },
						min: { glsl: "min(%1, %2);", output: { 4: 4, 3: 3, 2: 2, 1: 1 } },
						max: { glsl: "max(%1, %2);", output: { 4: 4, 3: 3, 2: 2, 1: 1 } },
						clamp: { glsl: "clamp(%1, %2, %3);", output: { "4,1,1": 4, "3,1,1": 3, "2,1,1": 2, "1,1,1": 1 } },
						mix: { glsl: "mix(%1, %2, %3);", output: { "4,4,1": 4, "3,3,1": 3, "2,2,1": 2, "1,1,1": 1 } },
						step: { glsl: "step(%1, %2, %3);", output: { "1,1": 1, "1,2": 2, "1,3": 3, "1,4": 4 } },
						smoothstep: { glsl: "smoothstep(%1);", output: { "1,1,1": 1, "2,2,2": 2, "3,3,3": 3, "4,4,4": 4 } },
						fragCoord: { glsl: "gl_FragColor;", output: 4 },
						sin: { glsl: "sin(%1);", output: { 1: 1, 2: 2, 3: 3, 4: 4 } },
						cos: { glsl: "cos(%1);", output: { 1: 1, 2: 2, 3: 3, 4: 4 } },
						pow: { glsl: "pow(%1, %2);", output: { "1,1": 1, "2,2": 2, "3,3": 3, "1,4": 4 } },
						sqrt: { glsl: "sqrt(%1);", output: { "1,1": 1, "2,2": 2, "3,3": 3, "1,4": 4 } },
						time: { glsl: "u_time;", output: 1 },
						add: { glsl: "%1 + %2;", output: { "1,1": 1, "2,2": 2, "3,3": 3, "4,4": 4, "2,1": 2, "3,1": 3, "4,1": 4 } },
						subtract: { glsl: "%1 - %2;", output: { "1,1": 1, "2,2": 2, "3,3": 3, "4,4": 4, "2,1": 2, "3,1": 3, "4,1": 4 } },
						multiply: { glsl: "%1 * %2;", output: { "1,1": 1, "2,2": 2, "3,3": 3, "4,4": 4, "2,1": 2, "3,1": 3, "4,1": 4 } },
						normal: { glsl: "vec4((v_normal + 1.0) * 0.5, 1.0);", output: 4 },
						uv: { glsl: "v_textureCoordinate;", output: 2 },
						meshPosition: { glsl: "(v_position + 1.0) * 0.5;", output: 3 },
						normalize: { glsl: "normalize(%1)", output: { 1: 1, 2: 2, 3: 3, 4: 4 } },
						dot: { glsl: "dot(%1, %2);", output: { "1,1": 1, "2,2": 1, "3,3": 1, "4,4": 1 } },
						image: { glsl: "texture2D($TEXTURE, v_textureCoordinate);", output: 4 },
						constant: { glsl: "%1;" },
						parameter: { uniforms: { parameter: 1 }, glsl: "parameter;" },
						vec3: { glsl: "vec3(%1);", output: 3 },
						vec2: { glsl: "vec2(%1);", output: 2 },
					};
				r.registerExpression = function(t, e) {
					this[t] = function(i, s) {
						return new n(t, e, i, s);
					};
				};
				for (var a in o) {
					r.registerExpression(a, o[a]);
				}
				(n.id = 2),
					(n.prototype.setUniform = function(t, e) {
						(this.uniforms[t] = e), this.invalidations.push(t);
						for (var i = 0; i < this.meshes.length; i++) {
							this.meshes[i]._requestUpdate();
						}
					}),
					(e.exports = r),
					(r.Material = n),
					(r.Texture = function(t) {
						return "undefined" == typeof window ? console.error("Texture constructor cannot be run inside of a worker") : r.image([], { texture: t });
					}),
					(r.Custom = function(t, e, i) {
						return new n("custom", { glsl: t, output: 1, uniforms: i || {} }, e);
					}),
					(n.prototype.traverse = function(t) {
						for (var e = this.inputs, i = e && e.length, n = -1; ++n < i; ) {
							e[n].traverse(t);
						}
						t(this);
					});
			},
			{ "./TextureRegistry": 123 },
		],
		123: [
			function(t, e, i) {
				"use strict";
				var n = { registry: {}, textureIds: 1 };
				(n.register = function(t, e, i) {
					return t
						? ((this.registry[t] = { id: this.textureIds++, __isATexture__: !0, data: e, options: i }), this.registry[t])
						: { id: this.textureIds++, data: e, __isATexture__: !0, options: i };
				}),
					(n.get = function(t) {
						if (this.registry[t]) return this.registry[t];
						throw 'Texture "' + t + '" not found!';
					}),
					(e.exports = n);
			},
			{},
		],
		124: [
			function(t, e, i) {
				"use strict";
				e.exports = { Material: t("./Material"), TextureRegistry: t("./TextureRegistry") };
			},
			{ "./Material": 122, "./TextureRegistry": 123 },
		],
		125: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					(this._node = null),
						(this._id = null),
						(this._changeQueue = []),
						(this._initialized = !1),
						(this._requestingUpdate = !1),
						(this._inDraw = !1),
						(this.value = {
							geometry: h,
							drawOptions: null,
							color: null,
							expressions: {},
							flatShading: null,
							glossiness: null,
							positionOffset: null,
							normals: null,
						}),
						t && t.addComponent(this),
						e && this.setDrawOptions(e);
				}
				function s(t, e, i) {
					for (var n = t.value.expressions, r = n[i], o = !0, a = e.inputs; a--; ) {
						s(t, e.inputs[a], i);
					}
					for (a = u.length; a--; ) {
						o |= i !== u[a] && r !== n[u[a]];
					}
					o && e.meshes.splice(e.meshes.indexOf(r), 1), -1 === e.meshes.indexOf(t) && e.meshes.push(t);
				}
				var r = t("../webgl-geometries"),
					o = t("../core/Commands"),
					a = t("../core/TransformSystem"),
					h = new r.Plane(),
					u = ["baseColor", "normals", "glossiness", "positionOffset"];
				(n.prototype.setDrawOptions = function(t) {
					return this._changeQueue.push(o.GL_SET_DRAW_OPTIONS), this._changeQueue.push(t), (this.value.drawOptions = t), this;
				}),
					(n.prototype.getDrawOptions = function() {
						return this.value.drawOptions;
					}),
					(n.prototype.setGeometry = function(t, e) {
						if ("string" == typeof t) {
							if (!r[t]) throw 'Invalid geometry: "' + t + '".';
							t = new r[t](e);
						}
						if (
							((this.value.geometry !== t || this._inDraw) &&
								(this._initialized &&
									(this._changeQueue.push(o.GL_SET_GEOMETRY),
									this._changeQueue.push(t.spec.id),
									this._changeQueue.push(t.spec.type),
									this._changeQueue.push(t.spec.dynamic)),
								this._requestUpdate(),
								(this.value.geometry = t)),
							this._initialized && this._node)
						) {
							var i = this.value.geometry.spec.invalidations.length;
							for (i && this._requestUpdate(); i--; ) {
								this.value.geometry.spec.invalidations.pop(),
									this._changeQueue.push(o.GL_BUFFER_DATA),
									this._changeQueue.push(this.value.geometry.spec.id),
									this._changeQueue.push(this.value.geometry.spec.bufferNames[i]),
									this._changeQueue.push(this.value.geometry.spec.bufferValues[i]),
									this._changeQueue.push(this.value.geometry.spec.bufferSpacings[i]),
									this._changeQueue.push(this.value.geometry.spec.dynamic);
							}
						}
						return this;
					}),
					(n.prototype.getGeometry = function() {
						return this.value.geometry;
					}),
					(n.prototype.setBaseColor = function(t) {
						var e,
							i = t.__isAMaterial__,
							n = !!t.getNormalizedRGBA;
						return (
							i
								? (s(this, t, "baseColor"), (this.value.color = null), (this.value.expressions.baseColor = t), (e = t))
								: n && ((this.value.expressions.baseColor = null), (this.value.color = t), (e = t.getNormalizedRGBA())),
							this._initialized &&
								(t.__isAMaterial__ ? this._changeQueue.push(o.MATERIAL_INPUT) : t.getNormalizedRGB && this._changeQueue.push(o.GL_UNIFORMS),
								this._changeQueue.push("u_baseColor"),
								this._changeQueue.push(e)),
							this._requestUpdate(),
							this
						);
					}),
					(n.prototype.getBaseColor = function() {
						return this.value.expressions.baseColor || this.value.color;
					}),
					(n.prototype.setFlatShading = function(t) {
						return (
							(this._inDraw || this.value.flatShading !== t) &&
								((this.value.flatShading = t),
								this._initialized &&
									(this._changeQueue.push(o.GL_UNIFORMS), this._changeQueue.push("u_flatShading"), this._changeQueue.push(t ? 1 : 0)),
								this._requestUpdate()),
							this
						);
					}),
					(n.prototype.getFlatShading = function() {
						return this.value.flatShading;
					}),
					(n.prototype.setNormals = function(t) {
						var e = t.__isAMaterial__;
						return (
							e && (s(this, t, "normals"), (this.value.expressions.normals = t)),
							this._initialized &&
								(this._changeQueue.push(t.__isAMaterial__ ? o.MATERIAL_INPUT : o.GL_UNIFORMS),
								this._changeQueue.push("u_normals"),
								this._changeQueue.push(t)),
							this._requestUpdate(),
							this
						);
					}),
					(n.prototype.getNormals = function(t) {
						return this.value.expressions.normals;
					}),
					(n.prototype.setGlossiness = function(t, e) {
						var i = t.__isAMaterial__,
							n = !!t.getNormalizedRGB;
						return (
							i
								? (s(this, t, "glossiness"), (this.value.glossiness = [null, null]), (this.value.expressions.glossiness = t))
								: n &&
								  ((this.value.expressions.glossiness = null),
								  (this.value.glossiness = [t, e || 20]),
								  (t = t ? t.getNormalizedRGB() : [0, 0, 0]),
								  t.push(e || 20)),
							this._initialized &&
								(this._changeQueue.push(t.__isAMaterial__ ? o.MATERIAL_INPUT : o.GL_UNIFORMS),
								this._changeQueue.push("u_glossiness"),
								this._changeQueue.push(t)),
							this._requestUpdate(),
							this
						);
					}),
					(n.prototype.getGlossiness = function() {
						return this.value.expressions.glossiness || this.value.glossiness;
					}),
					(n.prototype.setPositionOffset = function(t) {
						var e,
							i = t.__isAMaterial__;
						return (
							i
								? (s(this, t, "positionOffset"), (this.value.expressions.positionOffset = t), (e = t))
								: ((this.value.expressions.positionOffset = null), (this.value.positionOffset = t), (e = this.value.positionOffset)),
							this._initialized &&
								(this._changeQueue.push(t.__isAMaterial__ ? o.MATERIAL_INPUT : o.GL_UNIFORMS),
								this._changeQueue.push("u_positionOffset"),
								this._changeQueue.push(e)),
							this._requestUpdate(),
							this
						);
					}),
					(n.prototype.getPositionOffset = function() {
						return this.value.expressions.positionOffset || this.value.positionOffset;
					}),
					(n.prototype.getMaterialExpressions = function() {
						return this.value.expressions;
					}),
					(n.prototype.getValue = function() {
						return this.value;
					}),
					(n.prototype._pushInvalidations = function(t) {
						var e,
							i = this.value.expressions[t],
							n = this._node;
						return (
							i &&
								i.traverse(function(t) {
									for (var i = t.invalidations.length; i--; ) {
										(e = t.invalidations.pop()), n.sendDrawCommand(o.GL_UNIFORMS), n.sendDrawCommand(e), n.sendDrawCommand(t.uniforms[e]);
									}
								}),
							this
						);
					}),
					(n.prototype.onUpdate = function() {
						var t = this._node,
							e = this._changeQueue;
						if (t && t.isMounted()) {
							if (
								(t.sendDrawCommand(o.WITH),
								t.sendDrawCommand(t.getLocation()),
								this.value.color &&
									this.value.color.isActive() &&
									(this._node.sendDrawCommand(o.GL_UNIFORMS),
									this._node.sendDrawCommand("u_baseColor"),
									this._node.sendDrawCommand(this.value.color.getNormalizedRGBA()),
									this._node.requestUpdateOnNextTick(this._id)),
								this.value.glossiness && this.value.glossiness[0] && this.value.glossiness[0].isActive())
							) {
								this._node.sendDrawCommand(o.GL_UNIFORMS), this._node.sendDrawCommand("u_glossiness");
								var i = this.value.glossiness[0].getNormalizedRGB();
								i.push(this.value.glossiness[1]), this._node.sendDrawCommand(i), this._node.requestUpdateOnNextTick(this._id);
							} else this._requestingUpdate = !1;
							this._pushInvalidations("baseColor"),
								this._pushInvalidations("positionOffset"),
								this._pushInvalidations("normals"),
								this._pushInvalidations("glossiness");
							for (var n = 0; n < e.length; n++) {
								t.sendDrawCommand(e[n]);
							}
							e.length = 0;
						}
					}),
					(n.prototype.onMount = function(t, e) {
						(this._node = t), (this._id = e), a.makeCalculateWorldMatrixAt(t.getLocation()), this.draw();
					}),
					(n.prototype.onDismount = function() {
						(this._initialized = !1),
							(this._inDraw = !1),
							this._node.sendDrawCommand(o.WITH),
							this._node.sendDrawCommand(this._node.getLocation()),
							this._node.sendDrawCommand(o.GL_REMOVE_MESH),
							(this._node = null),
							(this._id = null);
					}),
					(n.prototype.onShow = function() {
						this._changeQueue.push(o.GL_MESH_VISIBILITY, !0), this._requestUpdate();
					}),
					(n.prototype.onHide = function() {
						this._changeQueue.push(o.GL_MESH_VISIBILITY, !1), this._requestUpdate();
					}),
					(n.prototype.onTransformChange = function(t) {
						this._initialized &&
							(this._changeQueue.push(o.GL_UNIFORMS), this._changeQueue.push("u_transform"), this._changeQueue.push(t.getWorldTransform())),
							this._requestUpdate();
					}),
					(n.prototype.onSizeChange = function(t, e, i) {
						this._initialized && (this._changeQueue.push(o.GL_UNIFORMS), this._changeQueue.push("u_size"), this._changeQueue.push([t, e, i])),
							this._requestUpdate();
					}),
					(n.prototype.onOpacityChange = function(t) {
						this._initialized && (this._changeQueue.push(o.GL_UNIFORMS), this._changeQueue.push("u_opacity"), this._changeQueue.push(t)),
							this._requestUpdate();
					}),
					(n.prototype.onAddUIEvent = function(t) {}),
					(n.prototype._requestUpdate = function() {
						!this._requestingUpdate && this._node && (this._node.requestUpdate(this._id), (this._requestingUpdate = !0));
					}),
					(n.prototype.init = function() {
						(this._initialized = !0), this.onTransformChange(a.get(this._node.getLocation()));
						var t = this._node.getSize();
						this.onSizeChange(t[0], t[1], t[2]), this.onOpacityChange(this._node.getOpacity()), this._requestUpdate();
					}),
					(n.prototype.draw = function() {
						(this._inDraw = !0), this.init();
						var t = this.getValue();
						null != t.geometry && this.setGeometry(t.geometry),
							null != t.color && this.setBaseColor(t.color),
							null != t.glossiness && this.setGlossiness.apply(this, t.glossiness),
							null != t.drawOptions && this.setDrawOptions(t.drawOptions),
							null != t.flatShading && this.setFlatShading(t.flatShading),
							null != t.expressions.normals && this.setNormals(t.expressions.normals),
							null != t.expressions.baseColor && this.setBaseColor(t.expressions.baseColor),
							null != t.expressions.glossiness && this.setGlossiness(t.expressions.glossiness),
							null != t.expressions.positionOffset && this.setPositionOffset(t.expressions.positionOffset),
							(this._inDraw = !1);
					}),
					(e.exports = n);
			},
			{ "../core/Commands": 15, "../core/TransformSystem": 26, "../webgl-geometries": 110 },
		],
		126: [
			function(t, e, i) {
				"use strict";
				e.exports = { Mesh: t("./Mesh"), PointLight: t("./lights/PointLight"), AmbientLight: t("./lights/AmbientLight") };
			},
			{ "./Mesh": 125, "./lights/AmbientLight": 127, "./lights/PointLight": 129 },
		],
		127: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t), (this.commands.color = r.GL_AMBIENT_LIGHT);
				}
				var s = t("./Light"),
					r = t("../../core/Commands");
				(n.prototype = Object.create(s.prototype)), (n.prototype.constructor = n), (e.exports = n);
			},
			{ "../../core/Commands": 15, "./Light": 128 },
		],
		128: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this._node = t),
						(this._requestingUpdate = !1),
						(this._color = null),
						(this.queue = []),
						(this.commands = { color: s.GL_LIGHT_COLOR, position: s.GL_LIGHT_POSITION }),
						(this._id = t.addComponent(this));
				}
				var s = t("../../core/Commands");
				(n.prototype.setColor = function(t) {
					if (!t.getNormalizedRGB) return !1;
					this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)),
						(this._color = t),
						this.queue.push(this.commands.color);
					var e = this._color.getNormalizedRGB();
					return this.queue.push(e[0]), this.queue.push(e[1]), this.queue.push(e[2]), this;
				}),
					(n.prototype.getColor = function() {
						return this._color;
					}),
					(n.prototype.onUpdate = function() {
						var t = this._node.getLocation();
						this._node.sendDrawCommand(s.WITH).sendDrawCommand(t);
						for (var e = this.queue.length; e--; ) {
							this._node.sendDrawCommand(this.queue.shift());
						}
						if (this._color && this._color.isActive()) {
							this._node.sendDrawCommand(this.commands.color);
							var i = this._color.getNormalizedRGB();
							this._node.sendDrawCommand(i[0]),
								this._node.sendDrawCommand(i[1]),
								this._node.sendDrawCommand(i[2]),
								this._node.requestUpdateOnNextTick(this._id);
						} else this._requestingUpdate = !1;
					}),
					(e.exports = n);
			},
			{ "../../core/Commands": 15 },
		],
		129: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					s.call(this, t);
				}
				var s = t("./Light"),
					r = t("../../core/TransformSystem");
				(n.prototype = Object.create(s.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.onMount = function(t, e) {
						(this._id = e), r.makeBreakPointAt(this._node.getLocation()), this.onTransformChange(r.get(this._node.getLocation()));
					}),
					(n.prototype.onTransformChange = function(t) {
						this._requestingUpdate || (this._node.requestUpdate(this._id), (this._requestingUpdate = !0)),
							(t = t.getWorldTransform()),
							this.queue.push(this.commands.position),
							this.queue.push(t[12]),
							this.queue.push(t[13]),
							this.queue.push(t[14]);
					}),
					(e.exports = n);
			},
			{ "../../core/TransformSystem": 26, "./Light": 128 },
		],
		130: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					(this.buffer = null), (this.target = t), (this.type = e), (this.data = []), (this.gl = i);
				}
				(n.prototype.subData = function() {
					for (var t = this.gl, e = [], i = 0, n = 1e4; i < this.data.length; i += n) {
						e = Array.prototype.concat.apply(e, this.data.slice(i, i + n));
					}
					(this.buffer = this.buffer || t.createBuffer()),
						t.bindBuffer(this.target, this.buffer),
						t.bufferData(this.target, new this.type(e), t.STATIC_DRAW);
				}),
					(e.exports = n);
			},
			{},
		],
		131: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.gl = t),
						(this.registry = {}),
						(this._dynamicBuffers = []),
						(this._staticBuffers = []),
						(this._arrayBufferMax = 3e4),
						(this._elementBufferMax = 3e4);
				}
				var s = "indices",
					r = t("./Buffer");
				(n.prototype.allocate = function(t, e, i, n, o) {
					var a,
						h,
						u,
						c,
						l = this.registry[t] || (this.registry[t] = { keys: [], values: [], spacing: [], offset: [], length: [] }),
						p = l.keys.indexOf(e),
						d = e === s,
						f = !1,
						m = 0;
					if (-1 === p) {
						if (((p = l.keys.length), (h = d ? i.length : Math.floor(i.length / n)), o))
							(u = new r(d ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, d ? Uint16Array : Float32Array, this.gl)),
								this._dynamicBuffers.push({ buffer: u, offset: i.length, isIndex: d });
						else {
							for (c = 0; c < this._staticBuffers.length; c++) {
								if (
									d === this._staticBuffers[c].isIndex &&
									((a = this._staticBuffers[c].offset + i.length), (!d && a < this._arrayBufferMax) || (d && a < this._elementBufferMax))
								) {
									(u = this._staticBuffers[c].buffer), (m = this._staticBuffers[c].offset), (this._staticBuffers[c].offset += i.length), (f = !0);
									break;
								}
							}
							f ||
								((u = new r(d ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, d ? Uint16Array : Float32Array, this.gl)),
								this._staticBuffers.push({ buffer: u, offset: i.length, isIndex: d }));
						}
						l.keys.push(e), l.values.push(u), l.spacing.push(n), l.offset.push(m), l.length.push(h);
					}
					var g = i.length;
					for (c = 0; g > c; c++) {
						l.values[p].data[m + c] = i[c];
					}
					l.values[p].subData();
				}),
					(e.exports = n);
			},
			{ "./Buffer": 130 },
		],
		132: [
			function(t, e, i) {
				"use strict";
				function n() {
					return s(this.gl.compileShader, function(t) {
						if (!this.getShaderParameter(t, this.COMPILE_STATUS)) {
							var e = this.getShaderInfoLog(t),
								i = this.getShaderSource(t);
							r(e, i);
						}
					});
				}
				function s(t, e) {
					return function() {
						var i = t.apply(this, arguments);
						return e.apply(this, arguments), i;
					};
				}
				function r(t, e) {
					var i =
							"body,html{background:#e3e3e3;font-family:monaco,monospace;font-size:14px;line-height:1.7em}#shaderReport{left:0;top:0;right:0;box-sizing:border-box;position:absolute;z-index:1000;color:#222;padding:15px;white-space:normal;list-style-type:none;margin:50px auto;max-width:1200px}#shaderReport li{background-color:#fff;margin:13px 0;box-shadow:0 1px 2px rgba(0,0,0,.15);padding:20px 30px;border-radius:2px;border-left:20px solid #e01111}span{color:#e01111;text-decoration:underline;font-weight:700}#shaderReport li p{padding:0;margin:0}#shaderReport li:nth-child(even){background-color:#f4f4f4}#shaderReport li p:first-child{margin-bottom:10px;color:#666}",
						n = document.createElement("style");
					document.getElementsByTagName("head")[0].appendChild(n), (n.textContent = i);
					var s = document.createElement("ul");
					s.setAttribute("id", "shaderReport"), document.body.appendChild(s);
					for (var r, o = /ERROR: [\d]+:([\d]+): (.+)/gim, a = e.split("\n"); null != (r = o.exec(t)); ) {
						r.index === o.lastIndex && o.lastIndex++;
						var h = document.createElement("li"),
							u = '<p><span>ERROR</span> "' + r[2] + '" in line ' + r[1] + "</p>";
						(u += "<p><b>" + a[r[1] - 1].replace(/^[ \t]+/g, "") + "</b></p>"), (h.innerHTML = u), s.appendChild(h);
					}
				}
				e.exports = n;
			},
			{},
		],
		133: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					(this.gl = t),
						(this.options = e || {}),
						(this.registeredMaterials = {}),
						(this.cachedUniforms = {}),
						(this.uniformTypes = []),
						(this.definitionVec4 = []),
						(this.definitionVec3 = []),
						(this.definitionFloat = []),
						(this.applicationVec3 = []),
						(this.applicationVec4 = []),
						(this.applicationFloat = []),
						(this.applicationVert = []),
						(this.definitionVert = []),
						this.options.debug && (this.gl.compileShader = h.call(this)),
						this.resetProgram();
				}
				var s = t("../utilities/clone"),
					r = t("../utilities/keyValueToArrays"),
					o = t("../webgl-shaders").vertex,
					a = t("../webgl-shaders").fragment,
					h = t("./Debug"),
					u = 35633,
					c = 35632,
					l = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
					p = "precision mediump float;\n",
					d = { undefined: "float ", 1: "float ", 2: "vec2 ", 3: "vec3 ", 4: "vec4 ", 16: "mat4 " },
					f = { u_baseColor: "vec4", u_normals: "vert", u_glossiness: "vec4", u_positionOffset: "vert" },
					m = { vert: 1, vec3: 2, vec4: 4, float: 8 },
					g = r({
						u_perspective: l,
						u_view: l,
						u_resolution: [0, 0, 0],
						u_transform: l,
						u_size: [1, 1, 1],
						u_time: 0,
						u_opacity: 1,
						u_metalness: 0,
						u_glossiness: [0, 0, 0, 0],
						u_baseColor: [1, 1, 1, 1],
						u_normals: [1, 1, 1],
						u_positionOffset: [0, 0, 0],
						u_lightPosition: l,
						u_lightColor: l,
						u_ambientLight: [0, 0, 0],
						u_flatShading: 0,
						u_numLights: 0,
					}),
					_ = r({ a_pos: [0, 0, 0], a_texCoord: [0, 0], a_normals: [0, 0, 0] }),
					y = r({ v_textureCoordinate: [0, 0], v_normal: [0, 0, 0], v_position: [0, 0, 0], v_eyeVector: [0, 0, 0] });
				(n.prototype.registerMaterial = function(t, e) {
					var i = e,
						n = f[t],
						s = m[n];
					if ((this.registeredMaterials[e._id] & s) === s) return this;
					var r;
					for (r in i.uniforms) {
						-1 === g.keys.indexOf(r) && (g.keys.push(r), g.values.push(i.uniforms[r]));
					}
					for (r in i.varyings) {
						-1 === y.keys.indexOf(r) && (y.keys.push(r), y.values.push(i.varyings[r]));
					}
					for (r in i.attributes) {
						-1 === _.keys.indexOf(r) && (_.keys.push(r), _.values.push(i.attributes[r]));
					}
					return (
						(this.registeredMaterials[e._id] |= s),
						"float" === n &&
							(this.definitionFloat.push(e.defines),
							this.definitionFloat.push("float fa_" + e._id + "() {\n " + i.glsl + " \n}"),
							this.applicationFloat.push("if (int(abs(ID)) == " + e._id + ") return fa_" + e._id + "();")),
						"vec3" === n &&
							(this.definitionVec3.push(e.defines),
							this.definitionVec3.push("vec3 fa_" + e._id + "() {\n " + i.glsl + " \n}"),
							this.applicationVec3.push("if (int(abs(ID.x)) == " + e._id + ") return fa_" + e._id + "();")),
						"vec4" === n &&
							(this.definitionVec4.push(e.defines),
							this.definitionVec4.push("vec4 fa_" + e._id + "() {\n " + i.glsl + " \n}"),
							this.applicationVec4.push("if (int(abs(ID.x)) == " + e._id + ") return fa_" + e._id + "();")),
						"vert" === n &&
							(this.definitionVert.push(e.defines),
							this.definitionVert.push("vec3 fa_" + e._id + "() {\n " + i.glsl + " \n}"),
							this.applicationVert.push("if (int(abs(ID.x)) == " + e._id + ") return fa_" + e._id + "();")),
						this.resetProgram()
					);
				}),
					(n.prototype.resetProgram = function() {
						var t,
							e,
							i,
							n,
							r,
							h,
							l = [p],
							f = [p];
						for (
							this.uniformLocations = [],
								this.attributeLocations = {},
								this.uniformTypes = {},
								this.attributeNames = s(_.keys),
								this.attributeValues = s(_.values),
								this.varyingNames = s(y.keys),
								this.varyingValues = s(y.values),
								this.uniformNames = s(g.keys),
								this.uniformValues = s(g.values),
								this.cachedUniforms = {},
								f.push("uniform sampler2D u_textures[7];\n"),
								this.applicationVert.length && l.push("uniform sampler2D u_textures[7];\n"),
								h = 0;
							h < this.uniformNames.length;
							h++
						) {
							(n = this.uniformNames[h]),
								(r = this.uniformValues[h]),
								l.push("uniform " + d[r.length] + n + ";\n"),
								f.push("uniform " + d[r.length] + n + ";\n");
						}
						for (h = 0; h < this.attributeNames.length; h++) {
							(n = this.attributeNames[h]), (r = this.attributeValues[h]), l.push("attribute " + d[r.length] + n + ";\n");
						}
						for (h = 0; h < this.varyingNames.length; h++) {
							(n = this.varyingNames[h]),
								(r = this.varyingValues[h]),
								l.push("varying " + d[r.length] + n + ";\n"),
								f.push("varying " + d[r.length] + n + ";\n");
						}
						(e =
							l.join("") +
							o.replace("#vert_definitions", this.definitionVert.join("\n")).replace("#vert_applications", this.applicationVert.join("\n"))),
							(t =
								f.join("") +
								a
									.replace("#vec3_definitions", this.definitionVec3.join("\n"))
									.replace("#vec3_applications", this.applicationVec3.join("\n"))
									.replace("#vec4_definitions", this.definitionVec4.join("\n"))
									.replace("#vec4_applications", this.applicationVec4.join("\n"))
									.replace("#float_definitions", this.definitionFloat.join("\n"))
									.replace("#float_applications", this.applicationFloat.join("\n"))),
							(i = this.gl.createProgram()),
							this.gl.attachShader(i, this.compileShader(this.gl.createShader(u), e)),
							this.gl.attachShader(i, this.compileShader(this.gl.createShader(c), t)),
							this.gl.linkProgram(i),
							this.gl.getProgramParameter(i, this.gl.LINK_STATUS)
								? ((this.program = i), this.gl.useProgram(this.program))
								: (console.error("link error: " + this.gl.getProgramInfoLog(i)), (this.program = null)),
							this.setUniforms(this.uniformNames, this.uniformValues);
						var m = this.gl.getUniformLocation(this.program, "u_textures[0]");
						return this.gl.uniform1iv(m, [0, 1, 2, 3, 4, 5, 6]), this;
					}),
					(n.prototype.uniformIsCached = function(t, e) {
						if (null == this.cachedUniforms[t]) return e.length ? (this.cachedUniforms[t] = new Float32Array(e)) : (this.cachedUniforms[t] = e), !1;
						if (e.length) {
							for (var i = e.length; i--; ) {
								if (e[i] !== this.cachedUniforms[t][i]) {
									for (i = e.length; i--; ) {
										this.cachedUniforms[t][i] = e[i];
									}
									return !1;
								}
							}
						} else if (this.cachedUniforms[t] !== e) return (this.cachedUniforms[t] = e), !1;
						return !0;
					}),
					(n.prototype.setUniforms = function(t, e) {
						var i,
							n,
							s,
							r,
							o,
							a = this.gl;
						if (!this.program) return this;
						for (r = t.length, o = 0; r > o; o++) {
							if (
								((s = t[o]),
								(n = e[o]),
								(i = this.uniformLocations[s]),
								null !== i &&
									(void 0 === i && ((i = a.getUniformLocation(this.program, s)), (this.uniformLocations[s] = i)), !this.uniformIsCached(s, n)))
							)
								switch ((this.uniformTypes[s] || (this.uniformTypes[s] = this.getUniformTypeFromValue(n)), this.uniformTypes[s])) {
									case "uniform4fv":
										a.uniform4fv(i, n);
										break;
									case "uniform3fv":
										a.uniform3fv(i, n);
										break;
									case "uniform2fv":
										a.uniform2fv(i, n);
										break;
									case "uniform1fv":
										a.uniform1fv(i, n);
										break;
									case "uniform1f":
										a.uniform1f(i, n);
										break;
									case "uniformMatrix3fv":
										a.uniformMatrix3fv(i, !1, n);
										break;
									case "uniformMatrix4fv":
										a.uniformMatrix4fv(i, !1, n);
								}
						}
						return this;
					}),
					(n.prototype.getUniformTypeFromValue = function(t) {
						if (Array.isArray(t) || t instanceof Float32Array)
							switch (t.length) {
								case 1:
									return "uniform1fv";
								case 2:
									return "uniform2fv";
								case 3:
									return "uniform3fv";
								case 4:
									return "uniform4fv";
								case 9:
									return "uniformMatrix3fv";
								case 16:
									return "uniformMatrix4fv";
							}
						else if (!isNaN(parseFloat(t)) && isFinite(t)) return "uniform1f";
						throw 'cant load uniform "' + name + '" with value:' + JSON.stringify(t);
					}),
					(n.prototype.compileShader = function(t, e) {
						var i = 1;
						return (
							this.gl.shaderSource(t, e),
							this.gl.compileShader(t),
							this.gl.getShaderParameter(t, this.gl.COMPILE_STATUS) ||
								(console.error("compile error: " + this.gl.getShaderInfoLog(t)),
								console.error(
									"1: " +
										e.replace(/\n/g, function() {
											return "\n" + (i += 1) + ": ";
										})
								)),
							t
						);
					}),
					(e.exports = n);
			},
			{ "../utilities/clone": 100, "../utilities/keyValueToArrays": 102, "../webgl-shaders": 141, "./Debug": 132 },
		],
		134: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					(e = e || {}),
						(this.id = t.createTexture()),
						(this.width = e.width || 0),
						(this.height = e.height || 0),
						(this.mipmap = e.mipmap),
						(this.format = e.format || "RGBA"),
						(this.type = e.type || "UNSIGNED_BYTE"),
						(this.gl = t),
						this.bind(),
						t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, e.flipYWebgl || !1),
						t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.premultiplyAlphaWebgl || !1),
						t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t[e.magFilter] || t.NEAREST),
						t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t[e.minFilter] || t.NEAREST),
						t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t[e.wrapS] || t.CLAMP_TO_EDGE),
						t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t[e.wrapT] || t.CLAMP_TO_EDGE);
				}
				(n.prototype.bind = function() {
					return this.gl.bindTexture(this.gl.TEXTURE_2D, this.id), this;
				}),
					(n.prototype.unbind = function() {
						return this.gl.bindTexture(this.gl.TEXTURE_2D, null), this;
					}),
					(n.prototype.setImage = function(t) {
						return (
							this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl[this.format], this.gl[this.format], this.gl[this.type], t),
							this.mipmap && this.gl.generateMipmap(this.gl.TEXTURE_2D),
							this
						);
					}),
					(n.prototype.setArray = function(t) {
						return (
							this.gl.texImage2D(
								this.gl.TEXTURE_2D,
								0,
								this.gl[this.format],
								this.width,
								this.height,
								0,
								this.gl[this.format],
								this.gl[this.type],
								t
							),
							this
						);
					}),
					(n.prototype.readBack = function(t, e, i, n) {
						var s,
							r = this.gl;
						(t = t || 0), (e = e || 0), (i = i || this.width), (n = n || this.height);
						var o = r.createFramebuffer();
						return (
							r.bindFramebuffer(r.FRAMEBUFFER, o),
							r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, this.id, 0),
							r.checkFramebufferStatus(r.FRAMEBUFFER) === r.FRAMEBUFFER_COMPLETE &&
								((s = new Uint8Array(i * n * 4)), r.readPixels(t, e, i, n, r.RGBA, r.UNSIGNED_BYTE, s)),
							s
						);
					}),
					(e.exports = n);
			},
			{},
		],
		135: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					(this.registry = []),
						(this._needsResample = []),
						(this._activeTexture = 0),
						(this._boundTexture = null),
						(this._checkerboard = o()),
						(this.gl = t);
				}
				function s(t, e) {
					var i = ("string" == typeof t ? new Image() : t) || {};
					return (
						(i.crossOrigin = "anonymous"),
						i.src || (i.src = t),
						i.complete
							? e(i)
							: (i.onload = function() {
									e(i);
							  }),
						i
					);
				}
				var r = t("./Texture"),
					o = t("./createCheckerboard");
				(n.prototype.update = function(t) {
					for (var e = this.registry.length, i = 1; e > i; i++) {
						var n = this.registry[i];
						n &&
							n.isLoaded &&
							n.resampleRate &&
							(!n.lastResample || t - n.lastResample > n.resampleRate) &&
							(this._needsResample[n.id] || ((this._needsResample[n.id] = !0), (n.lastResample = t)));
					}
				}),
					(n.prototype.register = function(t, e) {
						var i,
							n = this,
							o = t.data,
							a = t.id,
							h = t.options || {},
							u = this.registry[a];
						return (
							u ||
								((u = new r(this.gl, h)),
								u.setImage(this._checkerboard),
								(i = this.registry[a] = {
									resampleRate: h.resampleRate || null,
									lastResample: null,
									isLoaded: !1,
									texture: u,
									source: o,
									id: a,
									slot: e,
								}),
								Array.isArray(o) || o instanceof Uint8Array || o instanceof Float32Array
									? (this.bindTexture(a), u.setArray(o), (i.isLoaded = !0))
									: o instanceof HTMLVideoElement
									? o.addEventListener("loadeddata", function() {
											n.bindTexture(a), u.setImage(o), (i.isLoaded = !0), (i.source = o);
									  })
									: "string" == typeof o &&
									  s(o, function(t) {
											n.bindTexture(a), u.setImage(t), (i.isLoaded = !0), (i.source = t);
									  })),
							a
						);
					}),
					(n.prototype.bindTexture = function(t) {
						var e = this.registry[t];
						this._activeTexture !== e.slot && (this.gl.activeTexture(this.gl.TEXTURE0 + e.slot), (this._activeTexture = e.slot)),
							this._boundTexture !== t && ((this._boundTexture = t), e.texture.bind()),
							this._needsResample[e.id] && (e.texture.setImage(e.source), (this._needsResample[e.id] = !1));
					}),
					(e.exports = n);
			},
			{ "./Texture": 134, "./createCheckerboard": 138 },
		],
		136: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					t.classList.add("famous-webgl-renderer"), (this.canvas = t), (this.compositor = e);
					var i = (this.gl = this.getWebGLContext(this.canvas));
					i.clearColor(0, 0, 0, 0),
						i.polygonOffset(0.1, 0.1),
						i.enable(i.POLYGON_OFFSET_FILL),
						i.enable(i.DEPTH_TEST),
						i.enable(i.BLEND),
						i.depthFunc(i.LEQUAL),
						i.blendFunc(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA),
						i.enable(i.CULL_FACE),
						i.cullFace(i.BACK),
						(this.meshRegistry = new c()),
						(this.cutoutRegistry = new c()),
						(this.lightRegistry = new c()),
						(this.numLights = 0),
						(this.ambientLightColor = [0, 0, 0]),
						(this.lightPositions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
						(this.lightColors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
						(this.textureManager = new h(i)),
						(this.bufferRegistry = new r(i)),
						(this.program = new s(i, { debug: !0 })),
						(this.state = { boundArrayBuffer: null, boundElementBuffer: null, lastDrawn: null, enabledAttributes: {}, enabledAttributesKeys: [] }),
						(this.resolutionName = ["u_resolution"]),
						(this.resolutionValues = [[0, 0, 0]]),
						(this.cachedSize = []),
						(this.projectionTransform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1e-6, 0, -1, 1, 0, 1]);
					var n = (this.cutoutGeometry = {
						spec: { id: -1, bufferValues: [[-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]], bufferNames: ["a_pos"], type: "TRIANGLE_STRIP" },
					});
					this.bufferRegistry.allocate(this.cutoutGeometry.spec.id, n.spec.bufferNames[0], n.spec.bufferValues[0], 3);
				}
				var s = t("./Program"),
					r = t("./BufferRegistry"),
					o = t("./radixSort"),
					a = t("../utilities/keyValueToArrays"),
					h = t("./TextureManager"),
					u = t("./compileMaterial"),
					c = t("../utilities/Registry"),
					l = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
					p = a({
						u_numLights: 0,
						u_ambientLight: new Array(3),
						u_lightPosition: new Array(3),
						u_lightColor: new Array(3),
						u_perspective: new Array(16),
						u_time: 0,
						u_view: new Array(16),
					});
				(n.prototype.getWebGLContext = function(t) {
					for (var e, i = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], n = 0, s = i.length; s > n; n++) {
						try {
							e = t.getContext(i[n]);
						} catch (t) {
							console.error("Error creating WebGL context: " + t.toString());
						}
						if (e) return e;
					}
					return e
						? void 0
						: (console.error("Could not retrieve WebGL context. Please refer to https://www.khronos.org/webgl/ for requirements"), !1);
				}),
					(n.prototype.createLight = function(t) {
						this.numLights++;
						var e = { color: [0, 0, 0], position: [0, 0, 0] };
						return this.lightRegistry.register(t, e), e;
					}),
					(n.prototype.createMesh = function(t) {
						var e = a({
								u_opacity: 1,
								u_transform: l,
								u_size: [0, 0, 0],
								u_baseColor: [0.5, 0.5, 0.5, 1],
								u_positionOffset: [0, 0, 0],
								u_normals: [0, 0, 0],
								u_flatShading: 0,
								u_glossiness: [0, 0, 0, 0],
							}),
							i = {
								depth: null,
								uniformKeys: e.keys,
								uniformValues: e.values,
								buffers: {},
								geometry: null,
								drawType: null,
								textures: [],
								visible: !0,
							};
						return this.meshRegistry.register(t, i), i;
					}),
					(n.prototype.setCutoutState = function(t, e) {
						var i = this.getOrSetCutout(t);
						i.visible = e;
					}),
					(n.prototype.getOrSetCutout = function(t) {
						var e = this.cutoutRegistry.get(t);
						if (!e) {
							var i = a({ u_opacity: 0, u_transform: l.slice(), u_size: [0, 0, 0], u_origin: [0, 0, 0], u_baseColor: [0, 0, 0, 1] });
							(e = {
								uniformKeys: i.keys,
								uniformValues: i.values,
								geometry: this.cutoutGeometry.spec.id,
								drawType: this.cutoutGeometry.spec.type,
								visible: !0,
							}),
								this.cutoutRegistry.register(t, e);
						}
						return e;
					}),
					(n.prototype.setMeshVisibility = function(t, e) {
						var i = this.meshRegistry.get(t) || this.createMesh(t);
						i.visible = e;
					}),
					(n.prototype.removeMesh = function(t) {
						this.meshRegistry.unregister(t);
					}),
					(n.prototype.setCutoutUniform = function(t, e, i) {
						var n = this.getOrSetCutout(t),
							s = n.uniformKeys.indexOf(e);
						if (i.length)
							for (var r = 0, o = i.length; o > r; r++) {
								n.uniformValues[s][r] = i[r];
							}
						else n.uniformValues[s] = i;
					}),
					(n.prototype.setMeshOptions = function(t, e) {
						var i = this.meshRegistry.get(t) || this.createMesh(t);
						return (i.options = e), this;
					}),
					(n.prototype.setAmbientLightColor = function(t, e, i, n) {
						return (this.ambientLightColor[0] = e), (this.ambientLightColor[1] = i), (this.ambientLightColor[2] = n), this;
					}),
					(n.prototype.setLightPosition = function(t, e, i, n) {
						var s = this.lightRegistry.get(t) || this.createLight(t);
						return (s.position[0] = e), (s.position[1] = i), (s.position[2] = n), this;
					}),
					(n.prototype.setLightColor = function(t, e, i, n) {
						var s = this.lightRegistry.get(t) || this.createLight(t);
						return (s.color[0] = e), (s.color[1] = i), (s.color[2] = n), this;
					}),
					(n.prototype.handleMaterialInput = function(t, e, i) {
						var n = this.meshRegistry.get(t) || this.createMesh(t);
						(i = u(i, n.textures.length)), (n.uniformValues[n.uniformKeys.indexOf(e)][0] = -i._id);
						for (var s = i.textures.length; s--; ) {
							n.textures.push(this.textureManager.register(i.textures[s], n.textures.length + s));
						}
						return this.program.registerMaterial(e, i), this.updateSize();
					}),
					(n.prototype.setGeometry = function(t, e, i, n) {
						var s = this.meshRegistry.get(t) || this.createMesh(t);
						return (s.geometry = e), (s.drawType = i), (s.dynamic = n), this;
					}),
					(n.prototype.setMeshUniform = function(t, e, i) {
						var n = this.meshRegistry.get(t) || this.createMesh(t),
							s = n.uniformKeys.indexOf(e);
						-1 === s ? (n.uniformKeys.push(e), n.uniformValues.push(i)) : (n.uniformValues[s] = i);
					}),
					(n.prototype.bufferData = function(t, e, i, n, s) {
						this.bufferRegistry.allocate(t, e, i, n, s);
					}),
					(n.prototype.draw = function(t) {
						var e = this.compositor.getTime();
						this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT),
							this.textureManager.update(e),
							(this.meshRegistryKeys = o(this.meshRegistry.getKeys(), this.meshRegistry.getKeyToValue())),
							this.setGlobalUniforms(t),
							this.drawCutouts(),
							this.drawMeshes();
					}),
					(n.prototype.drawMeshes = function() {
						for (var t, e, i = this.gl, n = this.meshRegistry.getValues(), s = 0; s < n.length; s++) {
							if (
								((e = n[s]),
								e &&
									((t = this.bufferRegistry.registry[e.geometry]),
									e.visible && (e.uniformValues[0] < 1 ? (i.depthMask(!1), i.enable(i.BLEND)) : (i.depthMask(!0), i.disable(i.BLEND)), t)))
							) {
								for (var r = e.textures.length; r--; ) {
									this.textureManager.bindTexture(e.textures[r]);
								}
								e.options && this.handleOptions(e.options, e),
									this.program.setUniforms(e.uniformKeys, e.uniformValues),
									this.drawBuffers(t, e.drawType, e.geometry),
									e.options && this.resetOptions(e.options);
							}
						}
					}),
					(n.prototype.drawCutouts = function() {
						var t,
							e,
							i = this.cutoutRegistry.getValues(),
							n = i.length;
						this.gl.disable(this.gl.CULL_FACE), this.gl.enable(this.gl.BLEND), this.gl.depthMask(!0);
						for (var s = 0; n > s; s++) {
							(t = i[s]),
								t &&
									((e = this.bufferRegistry.registry[t.geometry]),
									t.visible && (this.program.setUniforms(t.uniformKeys, t.uniformValues), this.drawBuffers(e, t.drawType, t.geometry)));
						}
						this.gl.enable(this.gl.CULL_FACE);
					}),
					(n.prototype.setGlobalUniforms = function(t) {
						for (var e, i, n = this.lightRegistry.getValues(), s = n.length, r = 0; s > r; r++) {
							(e = n[r]),
								e &&
									((i = 4 * r),
									(this.lightPositions[0 + i] = e.position[0]),
									(this.lightPositions[1 + i] = e.position[1]),
									(this.lightPositions[2 + i] = e.position[2]),
									(this.lightColors[0 + i] = e.color[0]),
									(this.lightColors[1 + i] = e.color[1]),
									(this.lightColors[2 + i] = e.color[2]));
						}
						(p.values[0] = this.numLights),
							(p.values[1] = this.ambientLightColor),
							(p.values[2] = this.lightPositions),
							(p.values[3] = this.lightColors),
							(this.projectionTransform[0] = 1 / (0.5 * this.cachedSize[0])),
							(this.projectionTransform[5] = -1 / (0.5 * this.cachedSize[1])),
							(this.projectionTransform[11] = t.perspectiveTransform[11]),
							(p.values[4] = this.projectionTransform),
							(p.values[5] = 0.001 * this.compositor.getTime()),
							(p.values[6] = t.viewTransform),
							this.program.setUniforms(p.keys, p.values);
					}),
					(n.prototype.drawBuffers = function(t, e, i) {
						var n,
							s,
							r,
							o,
							a,
							h,
							u,
							c,
							l = this.gl,
							p = 0;
						for (h = t.keys.length, c = 0; h > c; c++) {
							(n = t.keys[c]),
								"indices" !== n
									? ((s = this.program.attributeLocations[n]),
									  -1 !== s &&
											(void 0 !== s || ((s = l.getAttribLocation(this.program.program, n)), (this.program.attributeLocations[n] = s), -1 !== s)) &&
											(this.state.enabledAttributes[n] ||
												(l.enableVertexAttribArray(s), (this.state.enabledAttributes[n] = !0), this.state.enabledAttributesKeys.push(n)),
											(a = t.values[c]),
											(r = t.spacing[c]),
											(o = t.offset[c]),
											(p = t.length[c]),
											this.state.boundArrayBuffer !== a && (l.bindBuffer(a.target, a.buffer), (this.state.boundArrayBuffer = a)),
											this.state.lastDrawn !== i && l.vertexAttribPointer(s, r, l.FLOAT, l.FALSE, 0, 4 * o)))
									: (u = c);
						}
						var d = this.state.enabledAttributesKeys.length;
						for (c = 0; d > c; c++) {
							var f = this.state.enabledAttributesKeys[c];
							this.state.enabledAttributes[f] &&
								-1 === t.keys.indexOf(f) &&
								(l.disableVertexAttribArray(this.program.attributeLocations[f]), (this.state.enabledAttributes[f] = !1));
						}
						p &&
							(void 0 !== u
								? ((a = t.values[u]),
								  (o = t.offset[u]),
								  (r = t.spacing[u]),
								  (p = t.length[u]),
								  this.state.boundElementBuffer !== a && (l.bindBuffer(a.target, a.buffer), (this.state.boundElementBuffer = a)),
								  l.drawElements(l[e], p, l.UNSIGNED_SHORT, 2 * o))
								: l.drawArrays(l[e], 0, p)),
							(this.state.lastDrawn = i);
					}),
					(n.prototype.updateSize = function(t) {
						if (t) {
							var e = window.devicePixelRatio || 1,
								i = ~~(t[0] * e),
								n = ~~(t[1] * e);
							(this.canvas.width = i),
								(this.canvas.height = n),
								this.gl.viewport(0, 0, i, n),
								(this.cachedSize[0] = t[0]),
								(this.cachedSize[1] = t[1]),
								(this.cachedSize[2] = t[0] > t[1] ? t[0] : t[1]),
								(this.resolutionValues[0] = this.cachedSize);
						}
						return this.program.setUniforms(this.resolutionName, this.resolutionValues), this;
					}),
					(n.prototype.handleOptions = function(t, e) {
						var i = this.gl;
						if (t)
							switch ((t.blending && i.enable(i.BLEND), t.side)) {
								case "double":
									this.gl.cullFace(this.gl.FRONT),
										this.drawBuffers(this.bufferRegistry.registry[e.geometry], e.drawType, e.geometry),
										this.gl.cullFace(this.gl.BACK);
									break;
								case "back":
									i.cullFace(i.FRONT);
							}
					}),
					(n.prototype.resetOptions = function(t) {
						var e = this.gl;
						t && (t.blending && e.disable(e.BLEND), "back" === t.side && e.cullFace(e.BACK));
					}),
					(e.exports = n);
			},
			{
				"../utilities/Registry": 98,
				"../utilities/keyValueToArrays": 102,
				"./BufferRegistry": 131,
				"./Program": 133,
				"./TextureManager": 135,
				"./compileMaterial": 137,
				"./radixSort": 140,
			},
		],
		137: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					var i = "",
						n = {},
						h = {},
						c = {},
						l = [],
						p = [];
					return (
						t.traverse(function(t, d) {
							if (t.chunk) {
								var f = u[s(t)],
									m = o(t),
									g = r(t.chunk.glsl, t.inputs, p.length + e);
								(i += f + m + " = " + g + "\n "),
									t.uniforms && a(n, t.uniforms),
									t.varyings && a(h, t.varyings),
									t.attributes && a(c, t.attributes),
									t.chunk.defines && l.push(t.chunk.defines),
									t.texture && p.push(t.texture);
							}
						}),
						{ _id: t._id, glsl: i + "return " + o(t) + ";", defines: l.join("\n"), uniforms: n, varyings: h, attributes: c, textures: p }
					);
				}
				function s(t) {
					if ("number" == typeof t) return 1;
					if (Array.isArray(t)) return t.length;
					var e = t.chunk.output;
					if ("number" == typeof e) return e;
					var i = t.inputs
						.map(function(t) {
							return s(t);
						})
						.join(",");
					return e[i];
				}
				function r(t, e, i) {
					return t
						.replace(/%\d/g, function(t) {
							return o(e[t[1] - 1]);
						})
						.replace(/\$TEXTURE/, "u_textures[" + i + "]");
				}
				function o(t) {
					return Array.isArray(t) ? h(t) : "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) ? "fa_" + t._id : t.toFixed(6);
				}
				function a(t, e) {
					for (var i in e) {
						t[i] = e[i];
					}
				}
				function h(t) {
					var e = t.length;
					return "vec" + e + "(" + t.join(",") + ")";
				}
				var u = { 1: "float ", 2: "vec2 ", 3: "vec3 ", 4: "vec4 " };
				e.exports = n;
			},
			{},
		],
		138: [
			function(t, e, i) {
				"use strict";
				function n() {
					var t = document.createElement("canvas").getContext("2d");
					t.canvas.width = t.canvas.height = 128;
					for (var e = 0; e < t.canvas.height; e += 16) {
						for (var i = 0; i < t.canvas.width; i += 16) {
							(t.fillStyle = 16 & (i ^ e) ? "#FFF" : "#DDD"), t.fillRect(i, e, 16, 16);
						}
					}
					return t.canvas;
				}
				e.exports = n;
			},
			{},
		],
		139: [
			function(t, e, i) {
				"use strict";
				e.exports = {
					Buffer: t("./Buffer"),
					BufferRegistry: t("./BufferRegistry"),
					compileMaterial: t("./compileMaterial"),
					createCheckerboard: t("./createCheckerboard"),
					Debug: t("./Debug"),
					Program: t("./Program"),
					radixSort: t("./radixSort"),
					Texture: t("./Texture"),
					TextureManager: t("./TextureManager"),
					WebGLRenderer: t("./WebGLRenderer"),
				};
			},
			{
				"./Buffer": 130,
				"./BufferRegistry": 131,
				"./Debug": 132,
				"./Program": 133,
				"./Texture": 134,
				"./TextureManager": 135,
				"./WebGLRenderer": 136,
				"./compileMaterial": 137,
				"./createCheckerboard": 138,
				"./radixSort": 140,
			},
		],
		140: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					var n = t[i],
						s = e[n];
					return (s.depth ? s.depth : e[n].uniformValues[1][14]) + _;
				}
				function s(t, e, i, n) {
					var s = t[i];
					return (e[s].depth = a(n) - _), s;
				}
				function r(t, e, i) {
					e[t[i]].depth = null;
				}
				function o(t) {
					return (v[0] = t), T[0];
				}
				function a(t) {
					return (T[0] = t), v[0];
				}
				function h(t, e) {
					var i,
						a,
						h,
						d,
						_,
						y,
						v,
						T,
						b,
						E,
						O,
						w = 0,
						x = [];
					for (m = (32 / u + 0.999999999999999) | 0, i = 0, d = c * m; d > i; i++) {
						p[i] = 0;
					}
					for (i = 0, d = t.length; d > i; i++) {
						for (_ = o(n(t, e, i)), _ ^= (_ >> 31) | 2147483648, a = 0, h = 0; g > a; a += c, h += u) {
							p[a + ((_ >>> h) & l)]++;
						}
						p[a + ((_ >>> h) & f)]++;
					}
					for (a = 0; g >= a; a += c) {
						for (T = a, b = 0; a + c > T; T++) {
							(E = p[T] + b), (p[T] = b - 1), (b = E);
						}
					}
					if (--m) {
						for (i = 0, d = t.length; d > i; i++) {
							(_ = o(n(t, e, i))), (x[++p[_ & l]] = s(t, e, i, (_ ^= (_ >> 31) | 2147483648)));
						}
						for (v = x, x = t, t = v; ++w < m; ) {
							for (i = 0, d = t.length, y = w * c, O = w * u; d > i; i++) {
								(_ = o(n(t, e, i))), (x[++p[y + ((_ >>> O) & l)]] = t[i]);
							}
							(v = x), (x = t), (t = v);
						}
					}
					for (i = 0, d = t.length, y = w * c, O = w * u; d > i; i++) {
						(_ = o(n(t, e, i))), (x[++p[y + ((_ >>> O) & f)]] = s(t, e, i, _ ^ ((~_ >> 31) | 2147483648))), r(t, e, i);
					}
					return x;
				}
				var u = 11,
					c = 1 << u,
					l = c - 1,
					p = new Array(c * Math.ceil(64 / u)),
					d = 1 << 31 % u,
					f = (d << 1) - 1,
					m = (32 / u + 0.999999999999999) | 0,
					g = c * (m - 1),
					_ = Math.pow(20, 6),
					y = new ArrayBuffer(4),
					v = new Float32Array(y, 0, 1),
					T = new Int32Array(y, 0, 1);
				e.exports = h;
			},
			{},
		],
		141: [
			function(t, e, i) {
				"use strict";
				var n = {
					vertex:
						'#define GLSLIFY 1\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * Calculates transpose inverse matrix from transform\n * \n * @method random\n * @private\n *\n *\n */\n\n\nmat3 getNormalMatrix_1_0(in mat4 t) {\n   mat3 matNorm;\n   mat4 a = t;\n\n   float a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3],\n   a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3],\n   a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3],\n   a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3],\n   b00 = a00 * a11 - a01 * a10,\n   b01 = a00 * a12 - a02 * a10,\n   b02 = a00 * a13 - a03 * a10,\n   b03 = a01 * a12 - a02 * a11,\n   b04 = a01 * a13 - a03 * a11,\n   b05 = a02 * a13 - a03 * a12,\n   b06 = a20 * a31 - a21 * a30,\n   b07 = a20 * a32 - a22 * a30,\n   b08 = a20 * a33 - a23 * a30,\n   b09 = a21 * a32 - a22 * a31,\n   b10 = a21 * a33 - a23 * a31,\n   b11 = a22 * a33 - a23 * a32,\n\n   det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n   det = 1.0 / det;\n\n   matNorm[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\n   matNorm[0][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\n   matNorm[0][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\n\n   matNorm[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\n   matNorm[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\n   matNorm[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\n\n   matNorm[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\n   matNorm[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\n   matNorm[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\n\n   return matNorm;\n}\n\n\n\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * Calculates a matrix that creates the identity when multiplied by m\n * \n * @method inverse\n * @private\n *\n *\n */\n\n\nfloat inverse_2_1(float m) {\n    return 1.0 / m;\n}\n\nmat2 inverse_2_1(mat2 m) {\n    return mat2(m[1][1],-m[0][1],\n               -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);\n}\n\nmat3 inverse_2_1(mat3 m) {\n    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n    float b01 =  a22 * a11 - a12 * a21;\n    float b11 = -a22 * a10 + a12 * a20;\n    float b21 =  a21 * a10 - a11 * a20;\n\n    float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\n\nmat4 inverse_2_1(mat4 m) {\n    float\n        a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n        a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n        a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n        a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\n        b00 = a00 * a11 - a01 * a10,\n        b01 = a00 * a12 - a02 * a10,\n        b02 = a00 * a13 - a03 * a10,\n        b03 = a01 * a12 - a02 * a11,\n        b04 = a01 * a13 - a03 * a11,\n        b05 = a02 * a13 - a03 * a12,\n        b06 = a20 * a31 - a21 * a30,\n        b07 = a20 * a32 - a22 * a30,\n        b08 = a20 * a33 - a23 * a30,\n        b09 = a21 * a32 - a22 * a31,\n        b10 = a21 * a33 - a23 * a31,\n        b11 = a22 * a33 - a23 * a32,\n\n        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n    return mat4(\n        a11 * b11 - a12 * b10 + a13 * b09,\n        a02 * b10 - a01 * b11 - a03 * b09,\n        a31 * b05 - a32 * b04 + a33 * b03,\n        a22 * b04 - a21 * b05 - a23 * b03,\n        a12 * b08 - a10 * b11 - a13 * b07,\n        a00 * b11 - a02 * b08 + a03 * b07,\n        a32 * b02 - a30 * b05 - a33 * b01,\n        a20 * b05 - a22 * b02 + a23 * b01,\n        a10 * b10 - a11 * b08 + a13 * b06,\n        a01 * b08 - a00 * b10 - a03 * b06,\n        a30 * b04 - a31 * b02 + a33 * b00,\n        a21 * b02 - a20 * b04 - a23 * b00,\n        a11 * b07 - a10 * b09 - a12 * b06,\n        a00 * b09 - a01 * b07 + a02 * b06,\n        a31 * b01 - a30 * b03 - a32 * b00,\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\n}\n\n\n\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * Reflects a matrix over its main diagonal.\n * \n * @method transpose\n * @private\n *\n *\n */\n\n\nfloat transpose_3_2(float m) {\n    return m;\n}\n\nmat2 transpose_3_2(mat2 m) {\n    return mat2(m[0][0], m[1][0],\n                m[0][1], m[1][1]);\n}\n\nmat3 transpose_3_2(mat3 m) {\n    return mat3(m[0][0], m[1][0], m[2][0],\n                m[0][1], m[1][1], m[2][1],\n                m[0][2], m[1][2], m[2][2]);\n}\n\nmat4 transpose_3_2(mat4 m) {\n    return mat4(m[0][0], m[1][0], m[2][0], m[3][0],\n                m[0][1], m[1][1], m[2][1], m[3][1],\n                m[0][2], m[1][2], m[2][2], m[3][2],\n                m[0][3], m[1][3], m[2][3], m[3][3]);\n}\n\n\n\n\n/**\n * Converts vertex from modelspace to screenspace using transform\n * information from context.\n *\n * @method applyTransform\n * @private\n *\n *\n */\n\nvec4 applyTransform(vec4 pos) {\n    //TODO: move this multiplication to application code. \n\n    /**\n     * Currently multiplied in the vertex shader to avoid consuming the complexity of holding an additional\n     * transform as state on the mesh object in WebGLRenderer. Multiplies the object\'s transformation from object space\n     * to world space with its transformation from world space to eye space.\n     */\n    mat4 MVMatrix = u_view * u_transform;\n\n    //TODO: move the origin, sizeScale and y axis inversion to application code in order to amortize redundant per-vertex calculations.\n\n    /**\n     * The transform uniform should be changed to the result of the transformation chain:\n     *\n     * view * modelTransform * invertYAxis * sizeScale * origin\n     *\n     * which could be simplified to:\n     *\n     * view * modelTransform * convertToDOMSpace\n     *\n     * where convertToDOMSpace represents the transform matrix:\n     *\n     *                           size.x 0       0       size.x \n     *                           0      -size.y 0       size.y\n     *                           0      0       1       0\n     *                           0      0       0       1\n     *\n     */\n\n    /**\n     * Assuming a unit volume, moves the object space origin [0, 0, 0] to the "top left" [1, -1, 0], the DOM space origin.\n     * Later in the transformation chain, the projection transform negates the rigidbody translation.\n     * Equivalent to (but much faster than) multiplying a translation matrix "origin"\n     *\n     *                           1 0 0 1 \n     *                           0 1 0 -1\n     *                           0 0 1 0\n     *                           0 0 0 1\n     *\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\n     */\n    pos.x += 1.0;\n    pos.y -= 1.0;\n\n    /**\n     * Assuming a unit volume, scales an object to the amount of pixels in the size uniform vector\'s specified dimensions.\n     * Later in the transformation chain, the projection transform transforms the point into clip space by scaling\n     * by the inverse of the canvas\' resolution.\n     * Equivalent to (but much faster than) multiplying a scale matrix "sizeScale"\n     *\n     *                           size.x 0      0      0 \n     *                           0      size.y 0      0\n     *                           0      0      size.z 0\n     *                           0      0      0      1\n     *\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\n     */\n    pos.xyz *= u_size * 0.5;\n\n    /**\n     * Inverts the object space\'s y axis in order to match DOM space conventions. \n     * Later in the transformation chain, the projection transform reinverts the y axis to convert to clip space.\n     * Equivalent to (but much faster than) multiplying a scale matrix "invertYAxis"\n     *\n     *                           1 0 0 0 \n     *                           0 -1 0 0\n     *                           0 0 1 0\n     *                           0 0 0 1\n     *\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\n     */\n    pos.y *= -1.0;\n\n    /**\n     * Exporting the vertex\'s position as a varying, in DOM space, to be used for lighting calculations. This has to be in DOM space\n     * since light position and direction is derived from the scene graph, calculated in DOM space.\n     */\n\n    v_position = (MVMatrix * pos).xyz;\n\n    /**\n    * Exporting the eye vector (a vector from the center of the screen) as a varying, to be used for lighting calculations.\n    * In clip space deriving the eye vector is a matter of simply taking the inverse of the position, as the position is a vector\n    * from the center of the screen. However, since our points are represented in DOM space,\n    * the position is a vector from the top left corner of the screen, so some additional math is needed (specifically, subtracting\n    * the position from the center of the screen, i.e. half the resolution of the canvas).\n    */\n\n    v_eyeVector = (u_resolution * 0.5) - v_position;\n\n    /**\n     * Transforming the position (currently represented in dom space) into view space (with our dom space view transform)\n     * and then projecting the point into raster both by applying a perspective transformation and converting to clip space\n     * (the perspective matrix is a combination of both transformations, therefore it\'s probably more apt to refer to it as a\n     * projection transform).\n     */\n\n    pos = u_perspective * MVMatrix * pos;\n\n    return pos;\n}\n\n/**\n * Placeholder for positionOffset chunks to be templated in.\n * Used for mesh deformation.\n *\n * @method calculateOffset\n * @private\n *\n *\n */\n#vert_definitions\nvec3 calculateOffset(vec3 ID) {\n    #vert_applications\n    return vec3(0.0);\n}\n\n/**\n * Writes the position of the vertex onto the screen.\n * Passes texture coordinate and normal attributes as varyings\n * and passes the position attribute through position pipeline.\n *\n * @method main\n * @private\n *\n *\n */\nvoid main() {\n    v_textureCoordinate = a_texCoord;\n    vec3 invertedNormals = a_normals + (u_normals.x < 0.0 ? calculateOffset(u_normals) * 2.0 - 1.0 : vec3(0.0));\n    invertedNormals.y *= -1.0;\n    v_normal = transpose_3_2(mat3(inverse_2_1(u_transform))) * invertedNormals;\n    vec3 offsetPos = a_pos + calculateOffset(u_positionOffset);\n    gl_Position = applyTransform(vec4(offsetPos, 1.0));\n}\n',
					fragment:
						'#define GLSLIFY 1\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * Placeholder for fragmentShader  chunks to be templated in.\n * Used for normal mapping, gloss mapping and colors.\n * \n * @method applyMaterial\n * @private\n *\n *\n */\n\n#float_definitions\nfloat applyMaterial_1_0(float ID) {\n    #float_applications\n    return 1.;\n}\n\n#vec3_definitions\nvec3 applyMaterial_1_0(vec3 ID) {\n    #vec3_applications\n    return vec3(0);\n}\n\n#vec4_definitions\nvec4 applyMaterial_1_0(vec4 ID) {\n    #vec4_applications\n\n    return vec4(0);\n}\n\n\n\n/**\n * The MIT License (MIT)\n * \n * Copyright (c) 2015 Famous Industries Inc.\n * \n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the "Software"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n * \n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * Calculates the intensity of light on a surface.\n *\n * @method applyLight\n * @private\n *\n */\nvec4 applyLight_2_1(in vec4 baseColor, in vec3 normal, in vec4 glossiness, int numLights, vec3 ambientColor, vec3 eyeVector, mat4 lightPosition, mat4 lightColor, vec3 v_position) {\n    vec3 diffuse = vec3(0.0);\n    bool hasGlossiness = glossiness.a > 0.0;\n    bool hasSpecularColor = length(glossiness.rgb) > 0.0;\n\n    for(int i = 0; i < 4; i++) {\n        if (i >= numLights) break;\n        vec3 lightDirection = normalize(lightPosition[i].xyz - v_position);\n        float lambertian = max(dot(lightDirection, normal), 0.0);\n\n        if (lambertian > 0.0) {\n            diffuse += lightColor[i].rgb * baseColor.rgb * lambertian;\n            if (hasGlossiness) {\n                vec3 halfVector = normalize(lightDirection + eyeVector);\n                float specularWeight = pow(max(dot(halfVector, normal), 0.0), glossiness.a);\n                vec3 specularColor = hasSpecularColor ? glossiness.rgb : lightColor[i].rgb;\n                diffuse += specularColor * specularWeight * lambertian;\n            }\n        }\n\n    }\n\n    return vec4(ambientColor + diffuse, baseColor.a);\n}\n\n\n\n\n\n/**\n * Writes the color of the pixel onto the screen\n *\n * @method main\n * @private\n *\n *\n */\nvoid main() {\n    vec4 material = u_baseColor.r >= 0.0 ? u_baseColor : applyMaterial_1_0(u_baseColor);\n\n    /**\n     * Apply lights only if flat shading is false\n     * and at least one light is added to the scene\n     */\n    bool lightsEnabled = (u_flatShading == 0.0) && (u_numLights > 0.0 || length(u_ambientLight) > 0.0);\n\n    vec3 normal = normalize(v_normal);\n    vec4 glossiness = u_glossiness.x < 0.0 ? applyMaterial_1_0(u_glossiness) : u_glossiness;\n\n    vec4 color = lightsEnabled ?\n    applyLight_2_1(material, normalize(v_normal), glossiness,\n               int(u_numLights),\n               u_ambientLight * u_baseColor.rgb,\n               normalize(v_eyeVector),\n               u_lightPosition,\n               u_lightColor,   \n               v_position)\n    : material;\n\n    gl_FragColor = color;\n    gl_FragColor.a *= u_opacity;   \n}\n',
				};
				e.exports = n;
			},
			{},
		],
		142: [
			function(t, e, i) {
				"use strict";
				function n(t, e, i) {
					o.call(this),
						this.setMountPoint(0.5, 0.5)
							.setAlign(0.5, 0.5)
							.setSizeMode("absolute", "absolute")
							.setAbsoluteSize(r.CELL_SIZE, r.CELL_SIZE),
						(this.domElement = new h(this, { properties: { background: r.DOT_COLOR__UNTOUCHED } })),
						this.domElement.setAttribute("role", "gridcell"),
						this.domElement.setAttribute("aria-readonly", !0),
						this.domElement.setAttribute("aria-live", "polite"),
						this.domElement.setAttribute("aria-rowindex", i),
						this.domElement.setAttribute("aria-colindex", e),
						(this.id = t),
						(this.x = e),
						(this.y = i),
						(this.state = r.DOT_STATE__UNTOUCHED),
						(this.position = new a(this)),
						this.position.setX(e * r.CELL_SIDE, {}),
						this.position.setY(i * r.CELL_SIDE, {});
				}
				var s = t("famous"),
					r = t("./Consts.js"),
					o = s.core.Node,
					a = s.components.Position,
					h = s.domRenderables.DOMElement;
				(n.prototype = Object.create(o.prototype)), (n.prototype.constructor = n), (e.exports = n);
			},
			{ "./Consts.js": 143, famous: 46 },
		],
		143: [
			function(t, e, i) {
				"use strict";
				var n = {
					DOT_SIZE: 36,
					DOT_MARGIN: 1,
					CELL_RATIO: 0.6,
					CELL_MARGIN: 1,
					DIMENSION: 12,
					DURATION: 600,
					CURVE: "outBounce",
					FIGURES: [
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 0, y: 2 },
							{ x: 0, y: 3 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 1, y: 0 },
							{ x: 2, y: 0 },
							{ x: 3, y: 0 },
						],
						[
							{ x: 0, y: 1 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 2, y: 0 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 1, y: 1 },
							{ x: 1, y: 2 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 2, y: 1 },
						],
						[
							{ x: 0, y: 1 },
							{ x: 0, y: 2 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
						],
						[
							{ x: 0, y: 1 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 2, y: 1 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 0, y: 2 },
							{ x: 1, y: 1 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 2, y: 0 },
						],
						[
							{ x: 0, y: 1 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 1, y: 2 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 1, y: 1 },
							{ x: 2, y: 1 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 0, y: 2 },
							{ x: 1, y: 0 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 1, y: 0 },
							{ x: 2, y: 0 },
							{ x: 2, y: 1 },
						],
						[
							{ x: 0, y: 2 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 1, y: 2 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 1, y: 0 },
							{ x: 2, y: 0 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 1, y: 0 },
							{ x: 1, y: 1 },
							{ x: 1, y: 2 },
						],
						[
							{ x: 0, y: 1 },
							{ x: 1, y: 1 },
							{ x: 2, y: 0 },
							{ x: 2, y: 1 },
						],
						[
							{ x: 0, y: 0 },
							{ x: 0, y: 1 },
							{ x: 0, y: 2 },
							{ x: 1, y: 2 },
						],
					],
					FIGURESCOUNT: 2,
					DOT_STATE__HOVERED: 1,
					DOT_STATE__UNTOUCHED: 0,
					DOT_STATE__PLACED: -1,
					DOT_COLOR__HOVERED: "linear-gradient(45deg, #333 0%, #333 25%, #e87461 25%, #e87461 100%)",
					DOT_COLOR__UNTOUCHED: "#7ac74f",
					DOT_COLOR__PLACED: "linear-gradient(135deg, #d5d887 0%, #d5d887 75%, #333 75%, #333 100%)",
					DOT_CURVE__POSITION: "inOutElastic",
					DOT_DURATION__POSITION: 800,
					DOT_CURVE__ROTATION: "inExpo",
					DOT_DURATION__ROTATION: 800,
					SCORE__FIGURE: 2,
					SCORE__SURCHARGE: 0.8,
					init: function init() {
						var t = document.body.clientWidth,
							e = document.body.clientHeight;
						(this.WIDTH = t), (this.HEIGHT = e);
						var i = t > e ? e : t;
						return (
							i / this.DIMENSION < this.DOT_SIZE && (this.DOT_SIZE = i / this.DIMENSION - this.DOT_MARGIN),
							(this.CELL_SIZE = this.DOT_SIZE * this.CELL_RATIO),
							(this.DOT_SIDE = this.DOT_SIZE + this.DOT_MARGIN),
							(this.CELL_SIDE = this.CELL_SIZE + this.CELL_MARGIN),
							(this.ROWS = this.DIMENSION),
							(this.COLUMNS = this.DIMENSION),
							(this.SCORE__LINE = this.DIMENSION),
							this
						);
					},
				}.init();
				e.exports = n;
			},
			{},
		],
		144: [
			function(t, e, i) {
				"use strict";
				function n(t) {
					a.call(this),
						this.setMountPoint(0.5, 0.5)
							.setAlign(0.5, 0.5)
							.setOrigin(0.5, 0.5)
							.setSizeMode("absolute", "absolute")
							.setAbsoluteSize(r.DOT_SIZE, r.DOT_SIZE),
						(this.domElement = new c(this, { properties: { background: r.DOT_COLOR__UNTOUCHED }, classes: ["Dot"] })),
						this.domElement.setAttribute("role", "gridcell"),
						this.domElement.setAttribute("aria-selected", !1),
						this.domElement.setAttribute("aria-live", "polite"),
						this.domElement.setAttribute("aria-rowindex", Number.parseInt(t / r.ROWS)),
						this.domElement.setAttribute("aria-colindex", t % r.COLUMNS),
						(this.id = t),
						(this.state = r.DOT_STATE__UNTOUCHED),
						(this.hover = function() {
							this.state === r.DOT_STATE__UNTOUCHED &&
								((this.state = r.DOT_STATE__HOVERED),
								this.domElement.setProperty("background", r.DOT_COLOR__HOVERED),
								this.domElement.setAttribute("aria-selected", !0));
						}),
						(this.unhover = function() {
							this.state === r.DOT_STATE__HOVERED &&
								((this.state = r.DOT_STATE__UNTOUCHED),
								this.domElement.setProperty("background", r.DOT_COLOR__UNTOUCHED),
								this.domElement.setAttribute("aria-selected", !1));
						}),
						(this.place = function() {
							this.state === r.DOT_STATE__HOVERED &&
								((this.state = r.DOT_STATE__PLACED),
								this.domElement.setProperty("background", r.DOT_COLOR__PLACED),
								this.domElement.setAttribute("aria-readonly", !0));
						}),
						(this.unplace = function(t) {
							var e = t || !1,
								i = this;
							if (this.state === r.DOT_STATE__PLACED) {
								if (e) {
									var n = o.getClock();
									n.setTimeout(function() {
										i.domElement.setProperty("background", r.DOT_COLOR__UNTOUCHED);
									}, r.DURATION * t);
								} else this.domElement.setProperty("background", r.DOT_COLOR__UNTOUCHED);
								(this.state = r.DOT_STATE__UNTOUCHED),
									this.domElement.setAttribute("aria-readonly", !1),
									this.domElement.setAttribute("aria-selected", !1);
							}
						}),
						(this.position = new h(this)),
						(this.rotation = new u(this)),
						this.rotation.set(0, 0, 0, 0),
						this.addUIEvent("mousedown"),
						this.addUIEvent("mousemove"),
						this.addUIEvent("click"),
						this.addUIEvent("mouseup");
				}
				var s = t("famous"),
					r = t("./Consts.js"),
					o = s.core.FamousEngine,
					a = s.core.Node,
					h = s.components.Position,
					u = s.components.Rotation,
					c = s.domRenderables.DOMElement;
				(n.prototype = Object.create(a.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.onReceive = function(t, e) {
						switch (t) {
							case "mousedown":
								this._parent.mousingDown(this.id);
								break;
							case "mousemove":
								this._parent.mousing === !0 &&
									(this._parent.dotState(this.id), this.emit("id", this.domElement.id).emit("state", this.domElement.state));
								break;
							case "click":
								this._parent.dotState(this.id), this.emit("id", this.domElement.id).emit("state", this.domElement.state);
								break;
							case "mouseup":
								this._parent.mousingUp(this.id);
								break;
							default:
								return !1;
						}
					}),
					(e.exports = n);
			},
			{ "./Consts.js": 143, famous: 46 },
		],
		145: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					a.call(this),
						this.setMountPoint(0, 0)
							.setAlign(0.5, 0.5)
							.setSizeMode("absolute", "absolute")
							.setAbsoluteSize((r.DOT_SIDE * r.DIMENSION) / 2, (r.DOT_SIDE * r.DIMENSION) / 2),
						(this.domElement = new u(this, { tagName: "h1", classes: ["Figure"] })),
						this.domElement.setAttribute("role", "grid"),
						this.domElement.setAttribute("aria-live", "polite"),
						(this.id = t),
						(this.randomId = e),
						(this.cells = []);
					for (var i = 0; 4 > i; i++) {
						var n = new o(i, r.FIGURES[e][i].x, r.FIGURES[e][i].y);
						this.addChild(n), this.cells.push(n);
					}
					(this.position = new h(this)), this.addUIEvent("click");
				}
				var s = t("famous"),
					r = t("./Consts.js"),
					o = t("./Cell.js"),
					a = s.core.Node,
					h = s.components.Position,
					u = s.domRenderables.DOMElement;
				(n.prototype = Object.create(a.prototype)),
					(n.prototype.constructor = n),
					(n.prototype.onReceive = function(t, e) {
						switch (t) {
							case "click":
								this._parent.figureUpdate(this.id), this._parent.scoreSurcharge(), this.emit("id", this.id).emit("randomId", this.randomId);
								break;
							default:
								return !1;
						}
					}),
					(e.exports = n);
			},
			{ "./Cell.js": 142, "./Consts.js": 143, famous: 46 },
		],
		146: [
			function(t, e, i) {
				"use strict";
				function n(t, e) {
					l.call(this),
						(this.domElement = new d(this, { tagName: "main", classes: ["Game"] })),
						this.domElement.setAttribute("role", "grid"),
						this.domElement.setAttribute("aria-multiselectable", !0),
						this.domElement.setAttribute("aria-colcount", o.COLUMNS),
						this.domElement.setAttribute("aria-rowcount", o.ROWS);
					var i = 1,
						n = 0;
					this.dots = [];
					for (var r = 0; t > r; r++) {
						for (var p = 0; e > p; p++) {
							var f = new h(n++);
							this.addChild(f), this.dots.push(f);
						}
					}
					(this.figures = []),
						(this.figureIndexGenerate = function() {
							var t = this.figures || [],
								e = c(0, o.FIGURES.length);
							if (t.length < 1) return e;
							var i = (function() {
								var i = [];
								t.forEach(function(t) {
									i.push(t.randomId);
								});
								for (
									var n = function n(t, e) {
										return t.every(function(t) {
											return t !== e;
										});
									};
									!n(i, e);

								) {
									e = c(0, o.FIGURES.length);
								}
								return { v: e };
							})();
							return "object" == (typeof i === "undefined" ? "undefined" : _typeof(i)) ? i.v : void 0;
						}),
						(this.figureUpdate = function(t) {
							for (var e = this.figures, i = this.figureIndexGenerate(), n = o.FIGURES[i], s = 0; 4 > s; s++) {
								var r = e[t].cells[s],
									a = r.position;
								a.set(n[s].x * o.CELL_SIDE, n[s].y * o.CELL_SIDE, 0, { duration: o.DURATION, curve: o.CURVE }),
									(r.x = n[s].x),
									(r.y = n[s].y),
									r.domElement.setAttribute("aria-colindex", n[s].x),
									r.domElement.setAttribute("aria-rowindex", n[s].y);
							}
							e[t].randomId = i;
						});
					for (var m = 0; 2 > m; m++) {
						var g = this.figureIndexGenerate(),
							_ = new a(m, g);
						this.addChild(_), this.figures.push(_);
					}
					var y = new u();
					this.addChild(y),
						(this.score = y),
						(this.scoreInc = function(t) {
							this.score.scoreInc(t * i);
						}),
						(this.scoreReset = function() {
							this.score.scoreReset();
						}),
						(this.scoreSurcharge = function() {
							this.score.scoreSurcharge();
						}),
						(this.figureSet = function(t) {
							for (var e = this.dots, i = this.hoverDots, n = 0; 4 > n; n++) {
								e[i[n]].place();
							}
							(this.hoverDots = []), this.scoreInc(o.SCORE__FIGURE), this.linesCheck(), this.figureUpdate(t), setTimeout(this.isGameEnded(), 10);
						}),
						(this.figureCheck = function() {
							var t = this,
								e = this.hoverDots;
							if (4 === e.length) {
								var i;
								!(function() {
									for (
										var n = t.figures,
											s = t.orderRows,
											r = t.orderColumns,
											a = e.map(function(t) {
												return Number.parseInt(t / o.DIMENSION);
											}),
											h = e.map(function(t) {
												return t % o.DIMENSION;
											}),
											u = [],
											c = [],
											l = function l(t) {
												u.push(
													r.findIndex(function(e) {
														return e === h[t];
													})
												),
													c.push(
														s.findIndex(function(e) {
															return e === a[t];
														})
													);
											},
											p = 0;
										4 > p;
										p++
									) {
										l(p);
									}
									for (var d = u.min() * o.DIMENSION + c.min(), f = [], p = 0; 4 > p; p++) {
										f[p] = { x: Math.abs(u[p] - Number.parseInt(d / o.DIMENSION)), y: Math.abs((c[p] % o.DIMENSION) - (d % o.DIMENSION)) };
									}
									for (
										f.sort(function(t, e) {
											var i = t.x - e.x;
											return 0 !== i ? i : t.y - e.y;
										}),
											i = 0;
										i < o.FIGURESCOUNT;
										i++
									) {
										var m = n[i].cells;
										m.every(function(t, e) {
											return t.x === f[e].x && t.y === f[e].y;
										}) && (t.figureSet(i), (i = o.FIGURESCOUNT));
									}
								})();
							}
						}),
						(this.mousing = 0),
						(this.mousingDown = function(t) {
							this.mousing = this.dots[t].state ? -1 : 1;
						}),
						(this.mousingUp = function(t) {
							this.mousing = 0;
						}),
						(this.hoverDots = []),
						(this.dotHover = function(t) {
							switch (this.dots[t].state) {
								case o.DOT_STATE__UNTOUCHED:
									this.hoverDots.indexOf(t) < 0 &&
										(this.hoverDots.length < 4
											? this.hoverDots.push(t)
											: (this.dots[this.hoverDots[0]].unhover(), this.hoverDots.shift(), this.hoverDots.push(t)),
										this.dots[t].hover(),
										4 === this.hoverDots.length && this.figureCheck());
									break;
								case o.DOT_STATE__HOVERED:
									this.hoverDots.splice(this.hoverDots.indexOf(t), 1), this.dots[t].unhover();
									break;
								default:
									return !1;
							}
						}),
						(this.orderRows = [].initialize(o.ROWS)),
						(this.orderColumns = [].initialize(o.COLUMNS)),
						(this.etalonRows = []),
						(this.etalonColumns = []),
						(this.linesCheck = function() {
							for (
								var t = this.dots,
									e = [],
									n = [],
									s = this.orderRows,
									r = this.orderColumns,
									a = function a(i) {
										var s = t.filter(function(t) {
												return Number.parseInt(t.id / o.ROWS) === i && t.state === o.DOT_STATE__PLACED;
											}),
											r = t.filter(function(t) {
												return t.id % o.COLUMNS === i && t.state === o.DOT_STATE__PLACED;
											});
										s.length === o.ROWS && e.push(i), r.length === o.COLUMNS && n.push(i);
									},
									h = 0;
								h < o.DIMENSION;
								h++
							) {
								a(h);
							}
							if (
								(e.sort(function(t, e) {
									return t < o.ROWS / 2 ? e - t : t - e;
								}),
								n.sort(function(t, e) {
									return t < o.COLUMNS / 2 ? e - t : t - e;
								}),
								1 !== e.length || (e[0] !== s[0] && e[0] !== s[o.ROWS - 1]))
							)
								for (var u = 0; u < e.length; u++) {
									this.lineMove(e[u], "y"), i++;
								}
							else this.lineRotate(e[0], "y"), i++;
							if (1 !== n.length || (n[0] !== r[0] && n[0] !== r[o.COLUMNS - 1]))
								for (var c = 0; c < n.length; c++) {
									this.lineMove(n[c], "x"), i++;
								}
							else this.lineRotate(n[0], "x"), i++;
							i = 1;
						}),
						(this.lineMove = function(t, e) {
							this.scoreInc(o.SCORE__LINE);
							var n = this.orderRows,
								s = this.orderColumns,
								r = this.etalonRows,
								a = this.etalonColumns,
								h = [],
								u = [],
								c = 0;
							switch (e) {
								case "x":
									if (((h = s), (u = a), (c = h.indexOf(t)), t < o.COLUMNS / 2)) {
										for (var l = 0; l < o.ROWS; l++) {
											var p = this.dots[l * o.ROWS + h[c]],
												d = p.position;
											d.setX(u[0], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
												p.domElement.setAttribute("aria-colindex", 0),
												p.unplace(i);
										}
										for (var f = c - 1; f >= 0; f--) {
											for (var l = 0; l < o.ROWS; l++) {
												var p = this.dots[l * o.ROWS + h[f]],
													d = p.position;
												d.setX(u[f + 1], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
													p.domElement.setAttribute("aria-colindex", f + 1);
											}
										}
										s.splice(c, 1), s.unshift(t);
									} else {
										for (var l = 0; l < o.ROWS; l++) {
											var p = this.dots[l * o.ROWS + h[c]],
												d = p.position;
											d.setX(u[o.COLUMNS - 1], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
												p.domElement.setAttribute("aria-colindex", o.ROWS - 1),
												p.unplace(i);
										}
										for (var f = o.COLUMNS - 1; f > c; f--) {
											for (var l = 0; l < o.ROWS; l++) {
												var p = this.dots[l * o.ROWS + h[f]],
													d = p.position;
												d.setX(u[f - 1], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
													p.domElement.setAttribute("aria-colindex", f - 1);
											}
										}
										s.splice(c, 1), s.push(t);
									}
									break;
								case "y":
									if (((h = n), (u = r), (c = h.indexOf(t)), t < o.ROWS / 2)) {
										for (var f = 0; f < o.COLUMNS; f++) {
											var p = this.dots[h[c] * o.COLUMNS + f],
												d = p.position;
											d.setY(u[0], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
												p.domElement.setAttribute("aria-rowindex", 0),
												p.unplace(i);
										}
										for (var l = c - 1; l >= 0; l--) {
											for (var f = 0; f < o.COLUMNS; f++) {
												var p = this.dots[h[l] * o.COLUMNS + f],
													d = p.position;
												d.setY(u[l + 1], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
													p.domElement.setAttribute("aria-rowindex", l + 1);
											}
										}
										n.splice(c, 1), n.unshift(t);
									} else {
										for (var f = 0; f < o.COLUMNS; f++) {
											var p = this.dots[h[c] * o.COLUMNS + f],
												d = p.position;
											d.setY(u[o.ROWS - 1], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
												p.domElement.setAttribute("aria-rowindex", o.COLUMNS - 1),
												p.unplace(i);
										}
										for (var l = o.ROWS - 1; l > c; l--) {
											for (var f = 0; f < o.COLUMNS; f++) {
												var p = this.dots[h[l] * o.COLUMNS + f],
													d = p.position;
												d.setY(u[l - 1], { duration: o.DOT_DURATION__POSITION, curve: o.DOT_CURVE__POSITION }),
													p.domElement.setAttribute("aria-rowindex", l - 1);
											}
										}
										n.splice(c, 1), n.push(t);
									}
									break;
								default:
									return !1;
							}
						}),
						(this.lineRotate = function(t, e) {
							this.scoreInc(o.SCORE__LINE);
							var n = this.orderRows,
								s = this.orderColumns,
								r = this.etalonRows,
								a = this.etalonColumns,
								h = [],
								u = [],
								c = 0;
							switch (e) {
								case "x":
									if (((h = s), (u = a), (c = h.indexOf(t)), 0 === t))
										for (var l = 0; l < o.ROWS; l++) {
											var p = this.dots[l * o.ROWS + h[c]],
												d = p.rotation,
												f = d.getX(),
												m = d.getY(),
												g = 2 * Math.PI;
											d.set(f + g, m + g, 0, { duration: o.DOT_DURATION__ROTATION, curve: o.DOT_CURVE__ROTATION }), p.unplace(i);
										}
									else
										for (var l = 0; l < o.ROWS; l++) {
											var p = this.dots[l * o.ROWS + h[c]],
												d = p.rotation,
												f = d.getX(),
												m = d.getY(),
												g = 2 * Math.PI;
											d.set(f + g, m + g, 0, { duration: o.DOT_DURATION__ROTATION, curve: o.DOT_CURVE__ROTATION }), p.unplace(i);
										}
									break;
								case "y":
									if (((h = n), (u = r), (c = h.indexOf(t)), t < o.ROWS / 2))
										for (var _ = 0; _ < o.COLUMNS; _++) {
											var p = this.dots[h[c] * o.COLUMNS + _],
												d = p.rotation,
												f = d.getX(),
												m = d.getY(),
												g = 2 * Math.PI;
											d.set(f + g, m + g, 0, { duration: o.DOT_DURATION__ROTATION, curve: o.DOT_CURVE__ROTATION }), p.unplace(i);
										}
									else
										for (var _ = 0; _ < o.COLUMNS; _++) {
											var p = this.dots[h[c] * o.COLUMNS + _],
												d = p.rotation,
												f = d.getX(),
												m = d.getY(),
												g = 2 * Math.PI;
											d.set(f + g, m + g, 0, { duration: o.DOT_DURATION__ROTATION, curve: o.DOT_CURVE__ROTATION }), p.unplace(i);
										}
									break;
								default:
									return !1;
							}
						}),
						(this.isGameEnded = function() {
							for (var t = this.figures, e = this.orderRows, i = this.orderColumns, n = this.dots, s = [], r = 0, a = t.length; a > r; r++) {
								for (var h = t[r], u = [], c = 0; 4 > c; c++) {
									u.push({ x: h.cells[c].x, y: h.cells[c].y });
								}
								s.push(u);
							}
							for (
								var l = function l(t, r) {
										for (
											var a = function a(r, _a) {
													var h = s.some(function(s, a) {
														var h = s,
															u = i[r],
															c = e[t],
															l = h.map(function(t) {
																return t.x;
															}),
															p = h.map(function(t) {
																return t.y;
															}),
															d = l.max() - l.min() + 1,
															f = p.max() - p.min() + 1;
														return c + f > o.ROWS || u + d > o.COLUMNS
															? !1
															: h.every(function(t, s) {
																	var r = e[c + t.y] * o.ROWS + i[u + t.x];
																	return n[r].state !== o.DOT_STATE__PLACED ? !0 : !1;
															  });
													});
													return h === !0 ? { v: { v: !0 } } : void 0;
												},
												h = 0,
												u = o.COLUMNS;
											u > h;
											h++
										) {
											var c = a(h, u);
											if ("object" == (typeof c === "undefined" ? "undefined" : _typeof(c))) return c.v;
										}
									},
									p = 0,
									d = o.ROWS;
								d > p;
								p++
							) {
								var f = l(p, d);
								if ("object" == (typeof f === "undefined" ? "undefined" : _typeof(f))) return f.v;
							}
							return alert("Game over"), !1;
						});
					var v;
					(this.dotState = function(t) {
						void 0 !== t && t !== v && (this.dotHover(t), (v = t));
					}),
						this.setMountPoint(0.5, 0.5, 0)
							.setAlign(0.5, 0.5, 0)
							.setOrigin(0.5, 0.5, 0)
							.setPosition(0, 0, 0),
						(this.layout = new s(this)),
						console.log(this),
						this.addUIEvent("mousedown"),
						this.addUIEvent("mouseleave"),
						this.addUIEvent("mouseup");
				}
				function s(t) {
					(this.node = t),
						(this.id = this.node.addComponent(this)),
						(this.current = 0),
						(this.curve = [p.outQuint, p.outElastic, p.inElastic, p.inOutEase, p.inBounce]),
						(this.duration = [0.5 * o.DURATION, 3 * o.DURATION, 3 * o.DURATION, o.DURATION, 0.5 * o.DURATION]);
					for (var e = document.body.clientWidth, i = document.body.clientHeight, n = 0; 2 > n; n++) {
						var s = this.node.figures[n],
							r = s.position;
						e > i ? r.set(-o.ROWS * o.DOT_SIDE, ((n - 1) * o.ROWS * o.DOT_SIDE) / 2) : r.set((-n * o.ROWS * o.DOT_SIDE) / 2, -o.ROWS * o.DOT_SIDE);
					}
					var a = this.node.score,
						h = a.position;
					e > i ? h.set((o.ROWS * o.DOT_SIDE) / 2, (-o.ROWS * o.DOT_SIDE) / 2) : h.set((-o.ROWS * o.DOT_SIDE) / 2, (o.ROWS * o.DOT_SIDE) / 2),
						this.next();
				}
				var r = t("famous"),
					o = t("./Consts.js"),
					a = t("./Figure.js"),
					h = t("./Dot.js"),
					u = t("./Score.js"),
					c = t("./getRandomInt.js"),
					l = r.core.Node,
					p = r.transitions.Curves,
					d = r.domRenderables.DOMElement;
				(n.prototype = Object.create(l.prototype)),
					(n.prototype.constructor = l),
					(n.prototype.onReceive = function(t, e) {
						switch (t) {
							case "mousedown":
								this.emit("x", e.x).emit("y", e.y), (this.mousing = !0);
								break;
							case "mouseleave":
								this.emit("x", e.x).emit("y", e.y), (this.mousing = !1);
								break;
							case "mouseup":
								this.emit("x", e.x).emit("y", e.y), (this.mousing = !1);
								break;
							default:
								return !1;
						}
					}),
					(s.prototype.next = function() {
						this.current++ === o.ROWS && (this.current = 0);
						for (
							var t = this.duration[this.current],
								e = this.curve[this.current],
								i = 0,
								n = 0,
								s = o.DOT_SIDE,
								r = [-((s * o.ROWS) / 2 - s / 2), -((s * o.COLUMNS) / 2 - s / 2)],
								a = 0;
							a < this.node.dots.length;
							a++
						) {
							var h = r[0] + s * n++,
								u = r[1] + s * i;
							a < o.COLUMNS && this.node.etalonColumns.push(h), a % o.ROWS === 0 && this.node.etalonRows.push(u);
							var c = 0;
							this.node.dots[a].position.set(h, u, c, { duration: a * o.ROWS + t, curve: e }), n >= o.COLUMNS && ((n = 0), i++);
						}
					}),
					(e.exports = n);
			},
			{ "./Consts.js": 143, "./Dot.js": 144, "./Figure.js": 145, "./Score.js": 147, "./getRandomInt.js": 148, famous: 46 },
		],
		147: [
			function(t, e, i) {
				"use strict";
				function n() {
					o.call(this),
						this.setMountPoint(0, 0, 0)
							.setAlign(0.5, 0.5, 0)
							.setSizeMode("absolute", "absolute", "absolute")
							.setAbsoluteSize(r.DOT_SIDE * r.DIMENSION, (r.DOT_SIDE * r.DIMENSION) / 2, r.DOT_SIDE),
						(this.score = 0),
						(this.domElement = new h(this, {
							tagName: "h2",
							classes: ["Scores"],
							properties: { color: "#fff", fontSize: "32px" },
							content: 'Score: <var class="Score">' + this.score + "</var>",
						})),
						this.domElement.setAttribute("role", "log"),
						this.domElement.setAttribute("aria-live", "polite"),
						(this.scoreSetContent = function(t) {
							this.domElement.setContent('Score: <var class="Score">' + t + "</var>");
						}),
						(this.scoreInc = function(t) {
							(this.score += t), this.scoreSetContent(this.score);
						}),
						(this.scoreReset = function() {
							(this.score = 0), this.scoreSetContent(this.score);
						}),
						(this.scoreSurcharge = function() {
							(this.score = Number.parseInt(this.score * r.SCORE__SURCHARGE)), this.scoreSetContent(this.score);
						}),
						(this.position = new a(this));
				}
				var s = t("famous"),
					r = t("./Consts.js"),
					o = s.core.Node,
					a = s.components.Position,
					h = s.domRenderables.DOMElement;
				(n.prototype = Object.create(o.prototype)), (n.prototype.constructor = n), (e.exports = n);
			},
			{ "./Consts.js": 143, famous: 46 },
		],
		148: [
			function(t, e, i) {
				"use strict";
				var n = function n(t, e) {
					return Math.floor(Math.random() * (e - t)) + t;
				};
				e.exports = n;
			},
			{},
		],
		149: [
			function(t, e, i) {
				"use strict";
				var n = t("famous"),
					s = t("./Consts.js"),
					r = t("./Game.js"),
					o = n.core.FamousEngine;
				Array.prototype.initialize ||
					(Array.prototype.initialize = function(t) {
						for (var e = [], i = 0; t > i; i++) {
							e.push(i);
						}
						return e;
					}),
					Array.prototype.every ||
						(Array.prototype.every = function(t, e) {
							var i, n;
							if (null == this) throw new TypeError("this is null or not defined");
							var s = Object(this),
								r = s.length >>> 0;
							if ("function" != typeof t) throw new TypeError();
							for (arguments.length > 1 && (i = e), n = 0; r > n; ) {
								var o;
								if (n in s) {
									o = s[n];
									var a = t.call(i, o, n, s);
									if (!a) return !1;
								}
								n++;
							}
							return !0;
						}),
					Array.prototype.some ||
						(Array.prototype.some = function(t) {
							if (null == this) throw new TypeError("Array.prototype.some called on null or undefined");
							if ("function" != typeof t) throw new TypeError();
							for (var e = Object(this), i = e.length >>> 0, n = arguments.length >= 2 ? arguments[1] : void 0, s = 0; i > s; s++) {
								if (s in e && t.call(n, e[s], s, e)) return !0;
							}
							return !1;
						}),
					Array.prototype.filter ||
						(Array.prototype.filter = function(t) {
							if (void 0 === this || null === this) throw new TypeError();
							var e = Object(this),
								i = e.length >>> 0;
							if ("function" != typeof t) throw new TypeError();
							for (var n = [], s = arguments.length >= 2 ? arguments[1] : void 0, r = 0; i > r; r++) {
								if (r in e) {
									var o = e[r];
									t.call(s, o, r, e) && n.push(o);
								}
							}
							return n;
						}),
					Array.prototype.find ||
						(Array.prototype.find = function(t) {
							if (null === this) throw new TypeError("Array.prototype.find called on null or undefined");
							if ("function" != typeof t) throw new TypeError("predicate must be a function");
							for (var e, i = Object(this), n = i.length >>> 0, s = arguments[1], r = 0; n > r; r++) {
								if (((e = i[r]), t.call(s, e, r, i))) return e;
							}
							return void 0;
						}),
					Array.prototype.findIndex ||
						(Array.prototype.findIndex = function(t) {
							if (null === this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
							if ("function" != typeof t) throw new TypeError("predicate must be a function");
							for (var e, i = Object(this), n = i.length >>> 0, s = arguments[1], r = 0; n > r; r++) {
								if (((e = i[r]), t.call(s, e, r, i))) return r;
							}
							return -1;
						}),
					Array.prototype.forEach ||
						(Array.prototype.forEach = function(t, e) {
							var i, n;
							if (null == this) throw new TypeError(" this is null or not defined");
							var s = Object(this),
								r = s.length >>> 0;
							if ("function" != typeof t) throw new TypeError(t + " is not a function");
							for (arguments.length > 1 && (i = e), n = 0; r > n; ) {
								var o;
								n in s && ((o = s[n]), t.call(i, o, n, s)), n++;
							}
						}),
					Array.prototype.includes ||
						(Array.prototype.includes = function(t) {
							var e = Object(this),
								i = parseInt(e.length) || 0;
							if (0 === i) return !1;
							var n,
								s = parseInt(arguments[1]) || 0;
							s >= 0 ? (n = s) : ((n = i + s), 0 > n && (n = 0));
							for (var r; i > n; ) {
								if (((r = e[n]), t === r || (t !== t && r !== r))) return !0;
								n++;
							}
							return !1;
						}),
					(Array.prototype.max = function() {
						return Math.max.apply(null, this);
					}),
					(Array.prototype.min = function() {
						return Math.min.apply(null, this);
					}),
					o.init();
				var a = o.createScene(),
					h = new r(s.ROWS, s.COLUMNS);
				a.addChild(h);
			},
			{ "./Consts.js": 143, "./Game.js": 146, famous: 46 },
		],
	},
	{},
	[149]
);
