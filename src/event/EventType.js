/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-14 13:21:11
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 10:47:44
 */
// 事件类型
const DrawEventType = {
  DRAW_START: "draw-start", // 开始绘制
  DRAW_ADD_POINT: "draw-add-point", // 绘制的过程中增加了点
  DRAW_MOVE_POINT: "draw-move-point", // 绘制中删除了last点
  DRAW_MOUSE_MOVE: "draw-mouse-move", // 绘制过程中鼠标移动了点
  DRAW_CREATED: "draw-created", // 创建完成
};

const EditEventType = {
  EDIT_START: "edit-start", // 开始编辑
  EDIT_MOVE_POINT: "edit-move-point", // 编辑修改了点
  EDIT_REMOVE_POINT: "edit-remove-point", // 编辑删除了点
  EDIT_STOP: "edit-stop", // 停止编辑
};

export { DrawEventType, EditEventType };
