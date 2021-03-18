/*
 * @Description: sdk内部统一调用console.*打印日志的控制类，在外部可以按需开启和关闭（默认开启）
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 11:56:23
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-11 12:47:43
 */

 let showError = true
 let showInfo = true
 let showWarn = true
 
class Log {
    static hasError(val) {
        showError = val
    }

    static hasInfo(val) {
        showInfo = val
    }

    static hasWarn(val) {
        showWarn = val
    }

    static logError(sources) {
        if (showError) {
            console.error(sources)
        }
    }

    static logInfo(sources) {
        if (showInfo) {
            console.info(sources);
        }
    }

    static logWarn(sources) {
        if (showWarn) {
            console.warn(sources)
        }
    }

}

export default Log