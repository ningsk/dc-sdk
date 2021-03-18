/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:12:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:15:20
 */
export default function isBetween(value, min, max) {
    value = parseFloat(value || 0.0)
    return value >= parseFloat(min) && value <= parseFloat(max)
}
