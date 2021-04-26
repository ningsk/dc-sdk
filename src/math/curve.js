/**
 * Some of the code borrows from MAPV
 * https://github.com/huiyan-fe/mapv/blob/3292c7c25dbbf29af3cf7b3acb48108d60b3eed8/src/utils/curve.js
 */
export default function curve (points, options) {
    options = options || {}
    let curvePoints = []
    for (let i = 0; i < points.length - 1; i++) {
        const p = getCurveByTwoPoints(points[i], points[i + 1], options.count)
        if (p && p.length > 0) {
            curvePoints = curvePoints.concat(p)
        }
    }
    return curvePoints
}

/**
 * Get a curvilinear coordinate set of points based on two points
 * @param obj1
 * @param obj2
 * @param count
 * @returns {null|[]}
 */
function getCurveByTwoPoints (obj1, obj2, count) {
    if (!obj1 || !obj2) {
        return null
    }
    const curveCoordinates = []
    count = count || 40 // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
    const B1 = function (x) {
        return 1 - 2 * x + x * x
    }
    const B2 = x => {
        return 2 * x - 2 * x * x
    }
    const B3 = x => {
        return x * x
    }

    let t, h, t2
    let inc = 0
    const lat1 = parseFloat(obj1.lat)
    const lat2 = parseFloat(obj2.lat)
    let lng1 = parseFloat(obj1.lng)
    let lng2 = parseFloat(obj2.lng)

    // 计算曲线角度的方法
    if (lng2 > lng1) {
        if (lng2 - lng1 > 180) {
            if (lng1 < 0) {
                lng1 = 180 + 180 + lng1
                lng2 = 180 + 180 + lng2
            }
        }
    }
    // 此时纠正了 lng1 lng2

    t2 = 0
    // 纬度相同
    if (lat2 === lat1) {
        t = 0
        h = lng1 - lng2
        // 经度相同
    } else if (lng2 === lng1) {
        t = Math.PI / 2
        h = lat1 - lat2
    } else {
        t = Math.atan((lat2 - lat1) / (lng2 - lng1))
        h = (lat2 - lat1) / Math.sin(t)
    }
    if (t2 === 0) {
        t2 = t + Math.PI / 5
    }
    const h2 = h / 2
    const lng3 = h2 * Math.cos(t2) + lng1
    const lat3 = h2 * Math.sin(t2) + lat1

    for (let i = 0; i < count + 1; i++) {
        const x = lng1 * B1(inc) + lng3 * B2(inc) + lng2 * B3(inc)
        const y = lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc)
        const lng1Src = obj1.lng
        const lng2Src = obj2.lng
        curveCoordinates.push([lng1Src < 0 && lng2Src > 0 ? x - 360 : x, y])
        inc = inc + 1 / count
    }
    return curveCoordinates
}
