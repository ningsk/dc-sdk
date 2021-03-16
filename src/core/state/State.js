/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 11:40:59
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 15:46:50
 */

const State = {
    INITIALIZED: 'initialized', // 初始化
    ADDED: 'added', // 已经添加到地图上
    REMOVED: 'removed', // 已经移除地图
    CLEARED: 'cleared',
    INSTALLED: 'installed',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    PLAY: 'play',
    PAUSE: 'pause',
    RESTORE: 'restore'
}

export default State