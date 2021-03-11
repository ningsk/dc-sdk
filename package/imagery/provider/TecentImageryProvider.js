const { Cesium } from DC.Namespace;

class TecentImageryProvider extends Cesium.UrlTemplateImageryProvider {
	constructor(options = {}) {
	    let url = options.url;
		if (Cesium.defined(options.layer)) {
			
		}
	}
}