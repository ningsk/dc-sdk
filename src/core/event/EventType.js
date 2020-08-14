/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-14 13:21:11
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-14 13:28:13
 */
// 事件类型
const EventType = {
  DrawStart: 'draw-start', // 开始绘制
  DrawAddPoint: 'draw-add-point', // 绘制过程中增加了点
  DrawRemovePoint: 'draw-remove-lastpoint', // 绘制过程中删除了last点
  DrawMouseMove: 'draw-mouse-move', // 绘制过程中鼠标移动了点
  DrawCreated: 'draw-created', // 创建完成

  EditStart: 'edit-start', // 开始编辑
  EditMovePoint: 'edit-move-point', // 编辑修改了点
  EditRemovePoint: 'edit-remove-point', // 编辑删除了点
  EditStop: 'edit-stop', // 停止编辑
}

export {
  EventType
}