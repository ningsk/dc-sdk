/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlatBillboard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _FlatBillboardFS = __webpack_require__(208);

var _FlatBillboardFS2 = _interopRequireDefault(_FlatBillboardFS);

var _FlatBillboardVS = __webpack_require__(209);

var _FlatBillboardVS2 = _interopRequireDefault(_FlatBillboardVS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//平放的图标
//目前DrawCommand单向渲染的，无法鼠标单击拾取对象 
var FlatBillboard = exports.FlatBillboard = function () {
  //========== 构造方法 ========== 
  function FlatBillboard(viewer, options) {
    _classCallCheck(this, FlatBillboard);

    this.viewer = viewer;
    this.options = options || {};

    this.width = options.width || options.size || 50;
    this.height = Cesium.defaultValue(options.height, this.width);
    this.show = Cesium.defaultValue(options.show, true);

    var oldVal = Cesium.defaultValue(options.distanceDisplayCondition, new Cesium.DistanceDisplayCondition(0, 5000000));
    this.distanceDisplayCondition = new Cesium.Cartesian2(oldVal.near, oldVal.far);

    this.textureDef = new Cesium.Texture({
      context: this.viewer.scene.context,
      width: 500,
      height: 500
    });
    this.textures = {};

    if (options.data) this.init(options.data);

    this._pickId = this.viewer.scene.context.createPickId({
      id: "FlatBillboard",
      primitive: this
    });
  }

  //========== 对外属性 ==========  
  //数据


  _createClass(FlatBillboard, [{
    key: "init",


    //========== 方法 ========== 
    value: function init(arrdata) {
      this.clear();

      this.options.data = arrdata;

      if (this.billboardCollection) {
        this.addBillboardCollection();
      }

      //按图片分组
      var imaObj = {};
      for (var i = 0, len = arrdata.length; i < len; i++) {
        var item = arrdata[i];

        if (!imaObj[item.image]) imaObj[item.image] = [];

        imaObj[item.image].push(item);
      }

      var commands = [];
      for (var key in imaObj) {
        var arr = imaObj[key];
        var image = key;

        //加载图片
        this.prepareTexture(image);

        //生成Command
        var VAO = this.prepareVAO(arr);
        var command = this.prepareCommand(VAO, image);
        commands.push(command);
      }
      this.commands = commands;

      this.render();
    }
  }, {
    key: "prepareTexture",
    value: function prepareTexture(imgUrl) {
      var _this = this;

      var image = new Image();
      image.onload = function (e) {
        var texture = new Cesium.Texture({
          context: _this.viewer.scene.context,
          source: image
        });
        _this.textures[imgUrl] = texture;
      };
      image.src = imgUrl;
    }
  }, {
    key: "prepareVAO",
    value: function prepareVAO(points) {
      var vertexs_H = [];
      var vertexs_L = [];
      var indexs = [];
      var uvs = [];
      var colors = [];
      for (var i = 0, len = points.length; i < len; i++) {
        var currP = points[i];
        var currCar = currP.position;
        var angle = currP.angle;

        indexs.push(i * 4 + 0);
        indexs.push(i * 4 + 2);
        indexs.push(i * 4 + 1);
        indexs.push(i * 4 + 0);
        indexs.push(i * 4 + 3);
        indexs.push(i * 4 + 2);

        // 伪造双精度数据 
        var currDF = new Float32Array(6);
        currDF[0] = currCar.x;
        currDF[1] = currCar.x - currDF[0];
        currDF[2] = currCar.y;
        currDF[3] = currCar.y - currDF[2];
        currDF[4] = currCar.z;
        currDF[5] = currCar.z - currDF[4];

        vertexs_H.push(currDF[0]);
        vertexs_H.push(currDF[2]);
        vertexs_H.push(currDF[4]);
        vertexs_L.push(currDF[1]);
        vertexs_L.push(currDF[3]);
        vertexs_L.push(currDF[5]);

        vertexs_H.push(currDF[0]);
        vertexs_H.push(currDF[2]);
        vertexs_H.push(currDF[4]);
        vertexs_L.push(currDF[1]);
        vertexs_L.push(currDF[3]);
        vertexs_L.push(currDF[5]);

        vertexs_H.push(currDF[0]);
        vertexs_H.push(currDF[2]);
        vertexs_H.push(currDF[4]);
        vertexs_L.push(currDF[1]);
        vertexs_L.push(currDF[3]);
        vertexs_L.push(currDF[5]);

        vertexs_H.push(currDF[0]);
        vertexs_H.push(currDF[2]);
        vertexs_H.push(currDF[4]);
        vertexs_L.push(currDF[1]);
        vertexs_L.push(currDF[3]);
        vertexs_L.push(currDF[5]);

        uvs.push(0, 0);
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(1, 0);
        var trans = Cesium.Transforms.eastNorthUpToFixedFrame(currCar);
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(angle));
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        var currMat = Cesium.Matrix4.multiply(trans, rotationZ, new Cesium.Matrix4());

        var heightScale = this.height / this.width;

        var zxj = new Cesium.Cartesian3(-1, -heightScale, 0);
        Cesium.Matrix4.multiplyByPointAsVector(currMat, zxj, zxj);
        Cesium.Cartesian3.normalize(zxj, zxj);
        colors.push(zxj.x, zxj.y, zxj.z);

        var zsj = new Cesium.Cartesian3(-1, heightScale, 0);
        Cesium.Matrix4.multiplyByPointAsVector(currMat, zsj, zsj);
        Cesium.Cartesian3.normalize(zsj, zsj);
        colors.push(zsj.x, zsj.y, zsj.z);

        var ysj = new Cesium.Cartesian3(1, heightScale, 0);
        Cesium.Matrix4.multiplyByPointAsVector(currMat, ysj, ysj);
        Cesium.Cartesian3.normalize(ysj, ysj);
        colors.push(ysj.x, ysj.y, ysj.z);

        var yxj = new Cesium.Cartesian3(1, -heightScale, 0);
        Cesium.Matrix4.multiplyByPointAsVector(currMat, yxj, yxj);
        Cesium.Cartesian3.normalize(yxj, yxj);
        colors.push(yxj.x, yxj.y, yxj.z);
      }

      return {
        index: new Uint16Array(indexs),
        vertex_H: {
          values: new Float32Array(vertexs_H),
          componentDatatype: "DOUBLE",
          componentsPerAttribute: 3
        },
        vertex_L: {
          values: new Float32Array(vertexs_L),
          componentDatatype: "DOUBLE",
          componentsPerAttribute: 3
        },
        uv: {
          values: new Float32Array(uvs),
          componentDatatype: "FLOAT",
          componentsPerAttribute: 2
        },
        color: {
          values: new Float32Array(colors),
          componentDatatype: "FLOAT",
          componentsPerAttribute: 3
        }
      };
    }
  }, {
    key: "prepareCommand",
    value: function prepareCommand(VAO, imgUrl) {
      var context = this.viewer.scene.context;

      var width = context.drawingBufferWidth;
      var height = context.drawingBufferHeight;
      var sp = Cesium.ShaderProgram.fromCache({
        context: context,
        vertexShaderSource: _FlatBillboardVS2.default,
        fragmentShaderSource: _FlatBillboardFS2.default,
        attributeLocations: {
          position3DHigh: 0,
          position3DLow: 1,
          color: 2,
          st: 3
        }
      });

      var indexBuffer = Cesium.Buffer.createIndexBuffer({
        context: context,
        typedArray: VAO.index,
        usage: Cesium.BufferUsage.STATIC_DRAW,
        indexDatatype: Cesium.IndexDatatype.UNSIGNED_SHORT
      });

      var va = new Cesium.VertexArray({
        context: context,
        attributes: [{
          index: 0,
          vertexBuffer: Cesium.Buffer.createVertexBuffer({
            context: context,
            typedArray: VAO.vertex_H.values,
            usage: Cesium.BufferUsage.STATIC_DRAW
          }),
          componentsPerAttribute: 3
        }, {
          index: 1,
          vertexBuffer: Cesium.Buffer.createVertexBuffer({
            context: context,
            typedArray: VAO.vertex_L.values,
            usage: Cesium.BufferUsage.STATIC_DRAW
          }),
          componentsPerAttribute: 3
        }, {
          index: 2,
          vertexBuffer: Cesium.Buffer.createVertexBuffer({
            context: context,
            typedArray: VAO.color.values,
            usage: Cesium.BufferUsage.STATIC_DRAW
          }),
          componentsPerAttribute: 3
        }, {
          index: 3,
          vertexBuffer: Cesium.Buffer.createVertexBuffer({
            context: context,
            typedArray: VAO.uv.values,
            usage: Cesium.BufferUsage.STATIC_DRAW
          }),
          componentsPerAttribute: 2
        }],
        indexBuffer: indexBuffer
      });

      var rs = Cesium.RenderState.fromCache();
      var that = this;
      var bs = Cesium.BoundingSphere.fromVertices(VAO.vertex_H.values);
      bs.radius = 1000000;
      // rs.depthMask = true;

      var command = new Cesium.DrawCommand({
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        shaderProgram: sp,
        vertexArray: va,
        modelMatrix: Cesium.Matrix4.IDENTITY,
        pickOnly: true,
        renderState: rs,
        boundingVolume: bs,
        uniformMap: {
          mm: function mm() {
            // return that.viewer.scene.camera.frustum._offCenterFrustum._perspectiveMatrix;
            if (that.viewer.scene.camera.frustum._offCenterFrustum) return that.viewer.scene.camera.frustum._offCenterFrustum._perspectiveMatrix;else return that.viewer.scene.camera.frustum._orthographicMatrix;
          },
          vv: function vv() {
            return that.viewer.scene.camera._viewMatrix;
          },
          resolution: function resolution() {
            return new Cesium.Cartesian2(width, height);
          },
          billWidth: function billWidth() {
            return that.width * 2;
          },
          billImg: function billImg() {
            return that.textures[imgUrl] || that.textureDef;
          },
          u_distanceDisplayCondition: function u_distanceDisplayCondition() {
            return that.distanceDisplayCondition;
          },
          u_eyePos: function u_eyePos() {
            return that.viewer.scene.camera.positionWC;
          }
        },
        castShadows: false,
        receiveShadows: false,
        pass: Cesium.Pass.TRANSLUCENT,
        pickCommand: new Cesium.DrawCommand({
          owner: this,
          pickOnly: true
        })
      });
      return command;
    }
  }, {
    key: "render",
    value: function render() {
      this.viewer.scene.primitives.add(this);
    }
  }, {
    key: "update",
    value: function update(frameState) {
      if (!this.show) {
        if (this.billboardCollection) {
          this.removeBillboardCollection();
        }
        return;
      }

      if (frameState.mode === Cesium.SceneMode.SCENE3D) {
        //三维模式下
        var commandList = frameState.commandList;
        if (commandList && this.commands) {
          commandList.push.apply(commandList, _toConsumableArray(this.commands));
        }

        if (this.billboardCollection) {
          this.removeBillboardCollection();
        }
      } else {
        if (!this.billboardCollection) {
          this.addBillboardCollection();
        }
      }
    }
  }, {
    key: "removeBillboardCollection",
    value: function removeBillboardCollection() {
      if (!this.billboardCollection) return;

      this.viewer.scene.primitives.remove(this.billboardCollection);
      delete this.billboardCollection;
    }
  }, {
    key: "addBillboardCollection",
    value: function addBillboardCollection() {
      var arrdata = this.data;
      if (!arrdata) return;

      if (this.billboardCollection) {
        this.removeBillboardCollection();
      }
      this.billboardCollection = new Cesium.BillboardCollection({ scene: this.viewer.scene });
      this.viewer.scene.primitives.add(this.billboardCollection);

      for (var i = 0, len = arrdata.length; i < len; i++) {
        var item = arrdata[i];

        var primitive = this.billboardCollection.add({
          position: item.position,
          image: item.image,
          rotation: Cesium.Math.toRadians(item.angle),
          scale: 1,
          width: this.width,
          height: this.height
        });

        primitive.data = item.data || item;
        primitive.tooltip = this.options.tooltip;
        primitive.popup = this.options.popup;
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.options && this.options.data) this.options.data = null;

      if (this.commands) {
        delete this.commands;
      }

      for (var key in this.textures) {
        if (this.textures[key]) {
          this.textures[key].destroy();
        }
      }
      this.textures = {};

      if (this.billboardCollection) {
        this.billboardCollection.removeAll();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.viewer.scene.primitives.remove(this);
      if (!this.viewer) return;

      this.clear();
      this.removeBillboardCollection();

      this.textureDef.destroy();

      //删除所有绑定的数据
      for (var i in this) {
        delete this[i];
      }
    }
  }, {
    key: "data",
    get: function get() {
      return this.options.data;
    },
    set: function set(val) {
      this.init(val);
    }
  }]);

  return FlatBillboard;
}();

/***/ }),
