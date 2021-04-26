import Transform from '../transform/Transform'

export default function area (positions) {
    let result = 0
    if (positions && Array.isArray(positions)) {
        let h = 0
        const pos = positions.concat(positions[0])
        for (let i = 1; i < pos.length; i++) {
            const oel = Transform.transformWGS84ToCartesian(pos[i - 1])
            const el = Transform.transformWGS84ToCartesian(pos[i])
            h += oel.x * el.y - el.x * oel.y
        }
        result = Math.abs(h).toFixed(2)
    }
    return result
}
