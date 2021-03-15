/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 10:09:33
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 10:09:33
 */
class TopoJsonLayer extends GeoJsonLayer {
    constructor(id, url, options = {}) {
        if (!url) {
            throw new Error("TopoJsonLayer: the url invalid")
        }
        super(id, url, options)
        this.type = GeoJsonLayer.get
    }
}