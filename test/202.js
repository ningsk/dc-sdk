/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DynamicRiver = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Lines2Plane = Lines2Plane;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _Draw = __webpack_require__(6);

var _DynamicRiverFS = __webpack_require__(203);

var _DynamicRiverFS2 = _interopRequireDefault(_DynamicRiverFS);

var _DynamicRiverVS = __webpack_require__(204);

var _DynamicRiverVS2 = _interopRequireDefault(_DynamicRiverVS);

var _DynamicRiverMaterial = __webpack_require__(205);

var _DynamicRiverMaterial2 = _interopRequireDefault(_DynamicRiverMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//动态河流、公路
var DynamicRiver = exports.DynamicRiver = function () {
    //========== 构造方法 ========== 

    function DynamicRiver(viewer, options) {
        _classCallCheck(this, DynamicRiver);

        this.viewer = viewer;

        options = options || {};
        this.options = options;

        this._positions = Cesium.defaultValue(options.positions, null);

        this._image = Cesium.defaultValue(options.image, null); //贴图路径
        this._flipY = Cesium.defaultValue(options.flipY, false); //uv交换（图片横竖切换）
        this._width = Cesium.defaultValue(options.width, 10); //宽度
        this._height = Cesium.defaultValue(options.height, 0); //拔高数值
        this._alpha = Cesium.defaultValue(options.alpha, 0.5); //透明度
        this._speed = Cesium.defaultValue(options.speed, 1.0); //流动速度

        this._move = Cesium.defaultValue(options.move, true); //是否开启流动效果
        this._moveDir = Cesium.defaultValue(options.moveDir, true); //设置流动方向
        this._moveVar = Cesium.defaultValue(options.moveVar, new Cesium.Cartesian3(50, 1, 100)); //流动动画参数，不建议调整该参数

        this.resetPos();
    }

    //========== 对外属性 ==========  


    _createClass(DynamicRiver, [{
        key: "resetPos",


        //========== 方法 ========== 

        value: function resetPos() {
            if (this.riverPrimitive) {
                this.viewer.scene.primitives.remove(this.riverPrimitive);
                delete this.riverPrimitive;
            }

            if (!(0, _util.isArray)(this._positions) || !this._positions.length) return;

            this.sideRes = Lines2Plane(this._positions, this.width, this.height);
            if (!this.sideRes) return;

            this.material = this.prepareMaterial();
            this.riverPrimitive = this.createPrimitive();
            this.viewer.scene.primitives.add(this.riverPrimitive);
        }
    }, {
        key: "drawLines",
        value: function drawLines(style) {
            if (!this.drawControl) {
                this.drawControl = new _Draw.Draw(this.viewer, {
                    hasEdit: false,
                    removeScreenSpaceEvent: true
                });
            }
            var control = this.drawControl;

            var that = this;
            control.startDraw({
                type: "polyline",
                style: style || {
                    color: "#55ff33",
                    width: 3,
                    clampToGround: true
                },
                success: function success(entity) {
                    var positions = that.drawControl.getPositions(entity);
                    that.setPositions(positions);
                    that.drawControl.deleteAll();
                }
            });
        }
    }, {
        key: "setPositions",
        value: function setPositions(positions) {
            this._positions = positions;
            this.resetPos();
        }
    }, {
        key: "prepareMaterial",
        value: function prepareMaterial() {
            if (this.image) {
                var material = new Cesium.Material({
                    fabric: {
                        uniforms: {
                            image: this.image,
                            alpha: this.alpha,
                            moveVar: this.moveVar,
                            reflux: this.moveDir ? -1 : 1,
                            speed: this.speed,
                            move: this.move,
                            flipY: this.flipY
                        },
                        source: _DynamicRiverMaterial2.default
                    }
                });
                return material;
            } else {
                var material = Cesium.Material.fromType('Color');
                material.uniforms.color = new Cesium.Color(0.0, 1.0, 0.0, this.alpha);
                return material;
            }
        }
    }, {
        key: "createPrimitive",
        value: function createPrimitive() {
            //创建图元
            var sides = this.sideRes;
            var positions = new Float64Array(sides.vertexs);
            var attributes = new Cesium.GeometryAttributes();
            attributes.position = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions
            });
            attributes.st = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: sides.uvs
            });
            var geometry = new Cesium.Geometry({
                attributes: attributes,
                indices: sides.indexs,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
            });
            // geometry._workerName = ""

            var instance = new Cesium.GeometryInstance({
                geometry: geometry
            });
            var renderState = new Cesium.RenderState();
            renderState.depthTest.enabled = true;
            var ppp = new Cesium.Primitive({
                geometryInstances: instance,
                appearance: new Cesium.Appearance({
                    material: this.material,
                    renderState: renderState,
                    vertexShaderSource: _DynamicRiverVS2.default,
                    fragmentShaderSource: _DynamicRiverFS2.default //czm_lightDirectionEC在cesium1.66开始加入的
                })
            });
            return ppp;
        }
    }, {
        key: "offsetHeight",
        value: function offsetHeight(height, time) {
            if (!height || !time || !this.riverPrimitive) return;
            var that = this;
            var currH = 0;
            var avgF = 20; //平均每帧20毫秒，即每秒50帧；
            var avgH = height / (time * avgF);

            var selfV = this.sideRes.self;
            var totalN = new Cesium.Cartesian3();
            for (var i = 0, len = selfV.length; i < len; i++) {
                //求平均的法线
                var currN = Cesium.Cartesian3.normalize(selfV[i], new Cesium.Cartesian3());
                Cesium.Cartesian3.add(totalN, currN, totalN);
            }
            Cesium.Cartesian3.normalize(totalN, totalN);

            var initM = Cesium.clone(this.riverPrimitive.modelMatrix);

            this.dhEvent = function () {
                if (Math.abs(currH) <= Math.abs(height)) {
                    //可以升高，可以降低，height可以为负值
                    var currNor = Cesium.Cartesian3.multiplyByScalar(totalN, currH, new Cesium.Cartesian3());
                    that.riverPrimitive.modelMatrix = Cesium.Matrix4.multiplyByTranslation(initM, currNor, new Cesium.Matrix4());
                } else {
                    that.viewer.clock.onTick.removeEventListener(that.dhEvent);
                }
                currH += avgH;
            };
            this.viewer.clock.onTick.addEventListener(this.dhEvent);
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
            this.viewer.scene.primitives.remove(this.riverPrimitive);

            if (this.drawControl) {
                this.drawControl.destroy();
                delete this.drawControl;
            }
            this.material.destroy();

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "positions",
        get: function get() {
            return this._positions;
        },
        set: function set(val) {
            this.setPositions(val);
        }
    }, {
        key: "width",
        get: function get() {
            return this._width;
        },
        set: function set(val) {
            this._width = Number(val) || 1;
            this.resetPos();
        }
    }, {
        key: "height",
        get: function get() {
            return this._height;
        },
        set: function set(val) {
            this._height = Number(val);
            this.resetPos();
        }
    }, {
        key: "alpha",
        get: function get() {
            return this._alpha;
        },
        set: function set(val) {
            this._alpha = Number(val);
            this.material.uniforms.alpha = this._alpha;
        }
    }, {
        key: "moveDir",
        get: function get() {
            return this._moveDir;
        },
        set: function set(val) {
            this._moveDir = Boolean(val);
            this.material.uniforms.reflux = this._moveDir ? -1 : 1;
        }
    }, {
        key: "speed",
        get: function get() {
            return this._speed;
        },
        set: function set(val) {
            this._speed = Number(val) || 1;
            this.material.uniforms.speed = this._speed;
        }
    }, {
        key: "image",
        get: function get() {
            return this._image;
        },
        set: function set(str) {
            this._image = str;
            this.material.uniforms.image = this._image;
        }
    }, {
        key: "move",
        get: function get() {
            return this._move;
        },
        set: function set(val) {
            this._move = Boolean(val);
            this.material.uniforms.move = this._move;
        }
    }, {
        key: "flipY",
        get: function get() {
            return this._flipY;
        },
        set: function set(val) {
            this._flipY = Boolean(val);
            this.material.uniforms.flipY = this._flipY;
        }
    }, {
        key: "moveVar",
        get: function get() {
            return this._moveVar;
        },
        set: function set(val) {
            this._moveVar = val;
            this.material.uniforms.moveVar = this._moveVar;
        }
    }]);

    return DynamicRiver;
}();

function Lines2Plane(lineArr, width, height) {
    if (!lineArr || lineArr.length <= 1 || !width || width == 0) {
        marslog.warn("请确认参数符合规则：数组长度大于1，宽高不能为0！");
        return;
    }
    var len = lineArr.length;
    var leftPots = [];
    var rightPots = [];
    var halfW = width / 2.0;
    for (var i = 0; i < len; i++) {
        var prevP = void 0;
        var currP = void 0;
        var nextP = void 0;
        var leftPot = void 0;
        var rightPot = void 0;
        if (i == 0) {
            prevP = lineArr[i];
            currP = lineArr[i];
            nextP = lineArr[i + 1];
        } else if (i == len - 1) {
            prevP = lineArr[i - 1];
            currP = lineArr[i];
            nextP = lineArr[i - 1];
        } else {
            prevP = lineArr[i - 1];
            currP = lineArr[i];
            nextP = lineArr[i + 1];
        }

        if (height != 0) {
            prevP = RaisePoint(prevP, height);
            currP = RaisePoint(currP, height);
            nextP = RaisePoint(nextP, height);
        }

        if (prevP && currP && nextP) {
            var sides = GetSides(currP, nextP, halfW);
            leftPot = sides.left;
            rightPot = sides.right;

            if (i == 0) {
                leftPots.push(leftPot);
                rightPots.push(rightPot);
                leftPots.push(leftPot);
                rightPots.push(rightPot);
                continue;
            } else {
                if (i < len - 1) {
                    leftPots.push(leftPot);
                    rightPots.push(rightPot);
                } else {
                    leftPots.push(rightPot);
                    rightPots.push(leftPot);
                    leftPots.push(rightPot);
                    rightPots.push(leftPot);
                    continue;
                }
            }

            sides = GetSides(currP, prevP, halfW);
            leftPot = sides.left;
            rightPot = sides.right;
            leftPots.push(rightPot);
            rightPots.push(leftPot);
        }
    }
    // return {
    //     left:leftPots,
    //     right:rightPots,
    //     self:lineArr
    // }

    var leftPotsRes = [];
    var rightPotsRes = [];
    if (leftPots.length == len * 2) {
        for (var _i = 0; _i < len; _i++) {
            var CurrP = lineArr[_i];

            var lf1 = leftPots[_i * 2 + 0];
            var lf2 = leftPots[_i * 2 + 1];
            var dir1 = Cesium.Cartesian3.subtract(lf1, CurrP, new Cesium.Cartesian3());
            var dir2 = Cesium.Cartesian3.subtract(lf2, CurrP, new Cesium.Cartesian3());
            var avgDir = Cesium.Cartesian3.add(dir1, dir2, new Cesium.Cartesian3());
            var avgPot = Cesium.Cartesian3.add(CurrP, avgDir, new Cesium.Cartesian3());
            leftPotsRes.push(Cesium.clone(avgPot));

            var rg1 = rightPots[_i * 2 + 0];
            var rg2 = rightPots[_i * 2 + 1];
            dir1 = Cesium.Cartesian3.subtract(rg1, CurrP, new Cesium.Cartesian3());
            dir2 = Cesium.Cartesian3.subtract(rg2, CurrP, new Cesium.Cartesian3());
            avgDir = Cesium.Cartesian3.add(dir1, dir2, new Cesium.Cartesian3());
            avgPot = Cesium.Cartesian3.add(CurrP, avgDir, new Cesium.Cartesian3());
            rightPotsRes.push(Cesium.clone(avgPot));
        }
    } else {
        marslog.warn("计算左右侧点出问题！");
        return;
    }

    var uvs = [];
    var vertexs = [];
    var vertexsH = [];
    var vertexsL = [];
    var indexs = [];

    //先记录右边点，后记录左边点、记录2遍为了分离UV
    for (var _i2 = 0; _i2 < len; _i2++) {
        var encodeRes = Cesium.EncodedCartesian3.fromCartesian(rightPotsRes[_i2]);
        vertexs.push(rightPotsRes[_i2].x);
        vertexs.push(rightPotsRes[_i2].y);
        vertexs.push(rightPotsRes[_i2].z);

        vertexsH.push(encodeRes.high.x);
        vertexsH.push(encodeRes.high.y);
        vertexsH.push(encodeRes.high.z);

        vertexsL.push(encodeRes.low.x);
        vertexsL.push(encodeRes.low.y);
        vertexsL.push(encodeRes.low.z);

        uvs.push(1, 1);

        //记录索引以及UV
        if (_i2 < len - 1) {
            indexs.push(_i2 + len * 2);
            indexs.push(_i2 + 1);
            indexs.push(_i2 + 1 + len);

            indexs.push(_i2 + len * 2);
            indexs.push(_i2 + 1 + len);
            indexs.push(len + _i2 + len * 2);
        }
    }
    for (var _i3 = 0; _i3 < len; _i3++) {
        var _encodeRes = Cesium.EncodedCartesian3.fromCartesian(leftPotsRes[_i3]);
        vertexs.push(leftPotsRes[_i3].x);
        vertexs.push(leftPotsRes[_i3].y);
        vertexs.push(leftPotsRes[_i3].z);

        vertexsH.push(_encodeRes.high.x);
        vertexsH.push(_encodeRes.high.y);
        vertexsH.push(_encodeRes.high.z);

        vertexsL.push(_encodeRes.low.x);
        vertexsL.push(_encodeRes.low.y);
        vertexsL.push(_encodeRes.low.z);

        uvs.push(1, 0);
    }

    for (var _i4 = 0; _i4 < len; _i4++) {
        var _encodeRes2 = Cesium.EncodedCartesian3.fromCartesian(rightPotsRes[_i4]);
        vertexs.push(rightPotsRes[_i4].x);
        vertexs.push(rightPotsRes[_i4].y);
        vertexs.push(rightPotsRes[_i4].z);

        vertexsH.push(_encodeRes2.high.x);
        vertexsH.push(_encodeRes2.high.y);
        vertexsH.push(_encodeRes2.high.z);

        vertexsL.push(_encodeRes2.low.x);
        vertexsL.push(_encodeRes2.low.y);
        vertexsL.push(_encodeRes2.low.z);

        uvs.push(0, 1);

        // if(i<len-1){
        //     // indexs.push(i + len*2);
        //     // indexs.push(i+1 + len*2);
        //     // indexs.push(i+1+len + len*2);

        //     // indexs.push(i + len*2);
        //     // indexs.push(i+1+len + len*2);
        //     // indexs.push(len+i + len*2);
        // }
    }
    for (var _i5 = 0; _i5 < len; _i5++) {
        var _encodeRes3 = Cesium.EncodedCartesian3.fromCartesian(leftPotsRes[_i5]);
        vertexs.push(leftPotsRes[_i5].x);
        vertexs.push(leftPotsRes[_i5].y);
        vertexs.push(leftPotsRes[_i5].z);

        vertexsH.push(_encodeRes3.high.x);
        vertexsH.push(_encodeRes3.high.y);
        vertexsH.push(_encodeRes3.high.z);

        vertexsL.push(_encodeRes3.low.x);
        vertexsL.push(_encodeRes3.low.y);
        vertexsL.push(_encodeRes3.low.z);

        uvs.push(0, 0);
    }

    return {
        left: leftPotsRes,
        right: rightPotsRes,
        self: lineArr,
        vertexs: new Float32Array(vertexs),
        vertexsH: new Float32Array(vertexsH),
        vertexsL: new Float32Array(vertexsL),
        indexs: new Uint16Array(indexs),
        uvs: new Float32Array(uvs)
    };
}

function RaisePoint(pot, height) {
    if (!(pot instanceof Cesium.Cartesian3)) {
        marslog.warn("请确认点是Cartesian3类型！");
        return;
    }
    if (!height || height == 0) {
        marslog.warn("请确认高度是非零数值！");
        return;
    }
    var dir = Cesium.Cartesian3.normalize(pot, new Cesium.Cartesian3());
    var ray = new Cesium.Ray(pot, dir);
    return Cesium.Ray.getPoint(ray, height);
}

function GetSides(firstP, sceondP, halfW) {
    var dir = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(sceondP, firstP, new Cesium.Cartesian3()), new Cesium.Cartesian3());
    var nor = Cesium.Cartesian3.normalize(firstP, new Cesium.Cartesian3());
    var leftDir = Cesium.Cartesian3.cross(nor, dir, new Cesium.Cartesian3());
    var rightDir = Cesium.Cartesian3.cross(dir, nor, new Cesium.Cartesian3());
    var leftray = new Cesium.Ray(firstP, leftDir);
    var rightray = new Cesium.Ray(firstP, rightDir);
    var leftPot = Cesium.Ray.getPoint(leftray, halfW);
    var rightPot = Cesium.Ray.getPoint(rightray, halfW);
    return {
        left: leftPot,
        right: rightPot
    };
}

/***/ }),
