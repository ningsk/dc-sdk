import BlackAndWhiteEffect from './type/BlackAndWhiteEffect'
import BloomEffect from './type/BloomEffect'
import BrightnessEffect from './type/BrightnessEffect'
import CloudEffect from './type/CloudEffect'
import DepthOfFieldEffect from './type/DepthOfFieldEffect'
import FogEffect from './type/FogEffect'
import NightVisionEffect from './type/NightVisionEffect'
import RainEffect from './type/RainEffect'
import SnowEffect from './type/SnowEffect'

class Effect {
    constructor () {
        this._comps = {
            blackAndWhiteEffect: new BlackAndWhiteEffect(),
            bloomEffect: new BloomEffect(),
            brightnessEffect: new BrightnessEffect(),
            cloudEffect: new CloudEffect(),
            depthOfFieldEffect: new DepthOfFieldEffect(),
            fogEffect: new FogEffect(),
            nightVisionEffect: new NightVisionEffect(),
            rainEffect: new RainEffect(),
            snowEffect: new SnowEffect()

        }
    }

    get blackAndWhiteEffect () {
        return this._comps.blackAndWhiteEffect
    }

    get bloomEffect () {
        return this._comps.bloomEffect
    }

    get brightnessEffect () {
        return this._comps.brightnessEffect
    }

    get cloudEffect () {
        return this._comps.cloudEffect
    }

    get depthOfFieldEffect () {
        return this._comps.depthOfFieldEffect
    }

    get fogEffect () {
        return this._comps.fogEffect
    }

    get nightVisionEffect () {
        return this._comps.nightVisionEffect
    }

    get rainEffect () {
        return this._comps.rainEffect
    }

    get snowEffect () {
        return this._comps.snowEffect
    }

    install (viewer) {
        Object.keys(this._comps).forEach(key => {
            this._comps[key].addTo(viewer)
        })
        Object.defineProperties(viewer, 'effect', {
            value: this,
            writable: false
        })
    }
}

export default Effect
