/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-19 14:45:37
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-19 15:35:32
 */
import Cesium from 'cesium';

var Color = Cesium.Color;
var defaultValue = Cesium.defaultValue;
var defined = Cesium.defined;
var defineProperties = Cesium.defineProperties;
var Event = Cesium.Event;
var createPropertyDescriptor = Cesium.createPropertyDescriptor;
var Property = Cesium.Property;
var defaultColor = Color.WHITE;

function EllipsoidFadeMaterialProperty(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  this._definitionChanged = new Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = options.color;
  this._time = undefined;
}

defineProperties(EllipsoidFadeMaterialProperty.prototype, {

  /**
   * Gets a value indicating if this property is constant. A property is considered
   * constant if getValue always returns the same result for the current definition.
   * @memberof PolylineGlowMaterialProperty.prototype
   * @type {Boolean}
   * @readonly
   */
  isConstant: {
    get: function() {
      return false;
    }
  }

  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return 
   * a different result for the same time.
   * @memberof PolylineGlowMaterialProperty.prototype
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },

  /**
   * Gets or sets the Property specifying the {@link Color} of the line
   */
  color: createPropertyDescriptor('color')

});

/**
 * 
 * @param {JulianDate} time The time for which to retrieve the type.
 * @returns {String} The type of material. 
 */
EllipsoidFadeMaterialProperty.prototype.getType = function(time) {
  return Material.EllipsoidFadeType;
}
/**
 * Gets the value of the property at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the value.
 * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
EllipsoidFadeMaterialProperty.prototype.getValue = function(time) {
  if (!defined(result)) {
    result = {};
  }
  result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);

  if (this._time === undefined) {
    this._time = time.secondsOfDay;
  }
  result.time = time.secondsOfDay - this._time;
  return result;
}

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
EllipsoidFadeMaterialProperty.prototype.equals = function (other) {
  return this === other || //
      (other instanceof EllipsoidFadeMaterialProperty &&
      Property.equals(this._color, other._color));
};

// 材质处理开始
var Material = Cesium.Material;
Material.EllipsoidFadeType = 'EllipsoidFade'; // 渐变的气泡
Material._materialCache.addMaterial(Material.EllipsoidFadeType, {
  fabric: {
    type: Material.EllipsoidFadeType,
    uniforms: {
      color: new Color(1, 0, 0, 1.0),
      time: 0
    },
    source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            material.diffuse = 1.5 * color.rgb;\n\
            vec2 st = materialInput.st;\n\
            float dis = distance(st, vec2(0.5, 0.5));\n\
            float per = fract(time);\n\
            if(dis > per * 0.5){\n\
                //material.alpha = 0.0;\n\
                discard;\n\
            }else {\n\
                    material.alpha = color.a  * dis / per / 2.0;\n\
            }\n\
            return material;\n\
        }"
  },
  translucent: function translucent() {
    return true;
  }
});
//材质处理 end

export {EllipsoidFadeMaterialProperty};