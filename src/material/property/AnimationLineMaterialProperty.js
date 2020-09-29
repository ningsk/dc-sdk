/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-28 09:29:10
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 13:21:21
 */
import * as Cesium from "cesium";
var Color = Cesium.Color;
var defaultValue = Cesium.defaultValue;
var defined = Cesium.defined;
var definedProperties = Cesium.definedProperties;
var Event = Cesium.Event;
var createPropertyDescriptor = Cesium.createPropertyDescriptor;
var Property = Cesium.Property;
var Material = Cesium.Material;
var defaultColor = new Cesium.Color(0, 0, 0, 0);

export function AnimationLineMaterialProperty(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  this._definitionChanged = new Event();
  this._color = undefined;
  this._colorSubscription = undefined;

  this.color = options.color || defaultColor; // 颜色
  this._duration = options.duration || 1000; // 时长
  var _material = AnimationLineMaterialProperty.getImageMaterial(
    options.url,
    options.repeat
  );
  this._materialType = _material.type; // 材质类型
  this._materialImage = _material.image; // 材质图片
  this._time = undefined;
}

definedProperties(AnimationLineMaterialProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.  A property is considered
   * constant if getValue always returns the same result for the current definition.
   * @memberof PolylineGlowMaterialProperty.prototype
   * @type {Boolean}
   * @readonly
   */
  isConstant: {
    get: function () {
      return false;
    },
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return
   * a different result for the same time.
   * @memberof PolylineGlowMaterialProperty.prototype
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  /**
   * Gets or sets the Property specifying the {@link Color} of the line.
   * @memberof PolylineGlowMaterialProperty.prototype
   * @type {Property}
   */
  color: createPropertyDescriptor("color"),
});

/**
 * Gets the {@link Material} type at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the type.
 * @returns {String} The type of material.
 */
AnimationLineMaterialProperty.prototype.getType = function (time) {
  return this._materialType;
};

/**
 * Gets the value of the property at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the value.
 * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
AnimationLineMaterialProperty.prototype.getValue = function (time, result) {
  if (!defined(result)) {
    result = {};
  }
  result.color = Property.getValueOrClonedDefault(
    this._color,
    time,
    defaultColor,
    result.color
  );
  result.image = this._materialImage;
  if (this._time === undefined) {
    this._time = time.secondsOfDay;
  }
  result.time = ((time.secondsOfDay - this._time) * 1000) / this._duration;
  return result;
};

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
AnimationLineMaterialProperty.prototype.equals = function (other) {
  return (
    this === other || //
    (other instanceof AnimationLineMaterialProperty &&
      Property.equals(this._color, other._color))
  );
};

var cacheIdx = 0;
var nameEx = "AnimationLine";

AnimationLineMaterialProperty.getImageMaterial = function (imgurl, repeat) {
  cacheIdx++;
  var typeName = nameEx + cacheIdx + "Type";
  var imageName = nameEx + cacheIdx + "Image";

  Material[typeName] = typeName;
  Material[imageName] = imgurl;

  Material._materialCache.addMaterial(Material[typeName], {
    fabric: {
      type: Material.PolylineArrowLinkType,
      uniforms: {
        color: new Color(1, 0, 0, 1.0),
        image: Material[imageName],
        time: 0,
        repeat: repeat || new Cesium.Cartesian2(1.0, 1.0),
      },
      //source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
      //    {\n\
      //        czm_material material = czm_getDefaultMaterial(materialInput);\n\
      //        vec2 st = repeat * materialInput.st;\n\
      //        if (texture2D(image, vec2(0.0, 0.0)).a == 1.0) {\n\
      //            discard;\n\
      //        } else {\n\
      //            material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
      //        }\n\
      //        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
      //        return material;\n\
      //    }"
      source:
        "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
              {\n\
                  czm_material material = czm_getDefaultMaterial(materialInput);\n\
                  vec2 st = repeat * materialInput.st;\n\
                  vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                  if(color.a == 0.0)\n\
                  {\n\
                      material.alpha = colorImage.a;\n\
                      material.diffuse = colorImage.rgb; \n\
                  }\n\
                  else\n\
                  {\n\
                      material.alpha = colorImage.a * color.a;\n\
                      material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \n\
                  }\n\
                  return material;\n\
              }",
    },
    translucent: function translucent() {
      return true;
    },
  });

  return {
    type: Material[typeName],
    image: Material[imageName],
  };
};
