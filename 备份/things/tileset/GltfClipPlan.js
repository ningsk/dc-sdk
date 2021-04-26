//模型剖切(平面)类
class GltfClipPlan extends TilesClipPlan {

        //========== 方法 ==========

        getInverseTransform() {
            if (!this._inverseTransform) {
                var transform = Cesium.Transforms.eastNorthUpToFixedFrame(this._tileset.position.getValue((0, _util.currentTime)()));
                this._inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
            }
            return this._inverseTransform;
        }
    setPlanes(planes, opts) {
            opts = opts || {};

            this.clear();
            if (!planes) return;

            var clippingPlanes = new Cesium.ClippingPlaneCollection({
                planes: planes,
                edgeWidth: Cesium.defaultValue(opts.edgeWidth, 0.0),
                edgeColor: Cesium.defaultValue(opts.edgeColor, Cesium.Color.WHITE),
                unionClippingRegions: Cesium.defaultValue(opts.unionClippingRegions, false)
            });
            this.clippingPlanes = clippingPlanes;
            this._tileset.model.clippingPlanes = clippingPlanes;
        }

        //清除裁剪面
clear() {
            if (this._tileset.model.clippingPlanes) {
                this._tileset.model.clippingPlanes.enabled = false;
                this._tileset.model.clippingPlanes = undefined;
            }

            if (this.clippingPlanes) {
                delete this.clippingPlanes;
            }
        }
        //========== 对外属性 ==========
        get entity() {
            return this._tileset;
        },
        set entity(val) {
            this._tileset = val;
            this._inverseTransform = null;
        }
}
export default GltfClipPlan