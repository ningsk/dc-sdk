<!--
 * @Description:  天气效果
 * @version: 
 * @Author: ningsk
 * @Date: 2021-03-12 09:47:54
 * @LastEditors: ningsk
 * @LastEditTime: 2021-03-12 10:07:50
-->

## 天气效果如何实现

> 其实Cesium在1.46版本中就新增了对整个场景后期的处理（Post Processing）功能，包括模型描边、黑白图、明亮度调整、夜视效果、环境光遮蔽等

### 后期处理的原理 

后期处理的过程，有点类似照片中的ps。生活中拍摄了一张自拍照，看到照片后，发现它太暗了，于是我们增强亮度得到了一张新的图片。在增强亮度后发现脸上痘痘请i可见，这可不是我们希望的结果，于是
再进行一次美肤效果的处理，在这之后，可能还会进行n次的操作，直到满足我们的要求，上述过程和三维里面的后期处理流程非常相似；拍的原始照片相当于三维场景中实际渲染得到的效果，在此基础上进行物体描边、
夜视效果、环境光遮蔽等后期处理，最后渲染到场景中的图片相当于定版的最终照片  

### Cesium添加后期处理的流程

再介绍Cesium添加后期处理流程之前，首先要对用到的相关类进行说明:
PostProcessStage:对应于某个具体的后期处理效果，它的输入为场景渲染图或上一个后期处理的结果图，输出结果是一张处理后的照片
PostProcessStageComposite: 一个集合对象，存储类型为PostProcessStage或者PostProgressStageComposite的元素
PostProcessStageLibrary:负责创建具体的后期处理效果，包括Silhouette、Bloom、AmbientOcclusion等，创建返回的结果是PostProcessStageComposite或者PostProcessStage类型
PostProcessStageCollection：是一个集合类型的类，负责管理和维护放到集合中的元素，元素的类型是PostProcessStage或者PostProcessStageComposite

Cesium中添加后期处理的流程是：首先通过PostProcessStageLibrary创建一个或多个后处理效果对象，得到多个PostProcessStage或者PostProcesStageComposite。然后将他们加入到PostProcessStageCollection对象中，这样PostProcessStageCollection对象就会按照加入的顺序进行屏幕后期处理，在所有的效果都处理完毕后，执行FXAA，然后绘制到屏幕上。