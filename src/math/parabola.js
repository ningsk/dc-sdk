export default function parabola (
    startPosition,
    endPosition,
    height = 0,
    count = 50
) {
    // 方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    const result = []
    height = Math.max(+height, 100)
    count = Math.max(+count, 50)
    const diffLng = Math.abs(startPosition.lng - endPosition.lng)
    const diffLat = Math.abs(startPosition.lat - endPosition.lat)
    const L = Math.max(diffLng, diffLat)
    let dlt = L / count
    if (diffLng > diffLat) {
        // base on lng
        const delLat = (endPosition.lat - startPosition.lat) / count
        if (startPosition.lng - endPosition.lng > 0) {
            dlt = -dlt
        }
        for (let i = 0; i < count; i++) {
            const h =
                height -
                (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
                Math.pow(L, 2)
            const lng = startPosition.lng + dlt * i
            const lat = startPosition.lat + delLat * i
            result.push([lng, lat, h])
        }
    } else {
        // base on lat
        const delLng = (endPosition.lng - startPosition.lng) / count
        if (startPosition.lat - endPosition.lat > 0) {
            dlt = -dlt
        }
        for (let i = 0; i < count; i++) {
            const h =
                height -
                (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
                Math.pow(L, 2)
            const lng = startPosition.lng + delLng * i
            const lat = startPosition.lat + dlt * i
            result.push([lng, lat, h])
        }
    }

    return result
}
