let showError = true
let showInfo = true
let showWarn = true

class LogUtil {
  static hasError (val) {
    showError = val
  }

  static hasInfo (val) {
    showInfo = val
  }

  static hasWarn (val) {
    showWarn = val
  }

  static logError (sources) {
    if (showError) {
      console.error(sources)
    }
  }

  static logInfo (sources) {
    if (showInfo) {
      console.info(sources)
    }
  }

  static logWarn (sources) {
    if (showWarn) {
      console.warn(sources)
    }
  }
}

export default LogUtil
