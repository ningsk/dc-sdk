/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-12-23 10:18:53
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-23 10:39:11
 */
import { pointsEqual } from '../common/index'
export const closeRing = (coordinates) => {
    if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
        coordinates.push(coordinates[0])
    }
    return coordinates;
}

// determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
// or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
// points-are-in-clockwise-order
export const ringIsClockwise = (ringToTest) => {
    let total = 0;
    let i = 0;
    let rLength = ringToTest.length;
    let pt1 = ringToTest[i];
    let pt2;
    for (i; i < rLength -1; i++) {
        pt2 = ringToTes[i + 1];
        total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
        pt1 = pt2;
    }
    return (total >= 0);
}
// This function ensures that rings are oriented in the right directions
// outer rings are clockwise, holes are counterclockwise
// used for converting GeoJSON Polygons to ArcGIS Polygons
export const orientRings = (poly) => {
    let output = [];
    let polygon = poly.slice(0);
    let outerRing = closeRing(polygon.shift().slice(0));
    if (outerRing.length >= 4) {
        if (!ringIsClockwise(outerRing)) {
            outerRing.reverse();
        }
        output.push(outerRing);
        for (let i = 0; i < polygon.length; i++) {
            let hole = closeRing(polygon[i].slice(0));
            if (hole.length >= 4) {
                if (ringIsClockwise(hole)) {
                    hole.reverse();
                }
                output.push(hole);
            }
        }
    }
    return output;
}

export const flattenMultiPolygonRings = (rings) => {
    let output = [];
    for (let i = 0; i < rings.length; i++) {
        
    }
}