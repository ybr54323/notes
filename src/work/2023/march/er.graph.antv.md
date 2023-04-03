# 关于er图的绘制

官方例子：https://x6.antv.antgroup.com/examples/showcase/practices/#er


<iframe src="https://codesandbox.io/embed/er-graph-demo-z9ndxk?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="er-graph-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


## 关于er图的连线交互：字段-字段，实体-实体

### 如何从节点中拉出连线，并连接另一个节点？

[连接桩](https://x6.antv.antgroup.com/tutorial/basic/port)

### 如何重新连接（源节点不变，改变目标节点）

通过添加工具集合接口，可通过连线工具（[连线工具](https://x6.antv.antgroup.com/api/registry/edge-tool#source-arrowhead-和-target-arrowhead)）来实现

### 如何取消（关闭）连接？

在连线（edge）上添加一个按钮，可通过连线工具（[删除按钮](https://x6.antv.antgroup.com/api/registry/edge-tool#button-remove)）来实现

### 如何在连线上添加按钮，触发事件？

可通过连线工具（[按钮](https://x6.antv.antgroup.com/api/registry/edge-tool#button)）来实现

### 如何校验连接 

需求中，存在节点的连接规则，即实体-实体，字段-字段，不能实体-字段

通过connecting配置的[validateConnection选项](https://x6.antv.antgroup.com/api/interacting/interaction#validateconnection)来实现

### 如何把当前页面的pageX，pageY转换成画布的内部坐标

pageToLocal(pageX, pageY): point

https://x6.antv.antgroup.com/api/graph/coordinate

官方文档：

https://x6.antv.antgroup.com/

连线的工具集文档

https://x6.antv.antgroup.com/api/registry/edge-tool#presets

连线的连接行为的文档

https://x6.antv.antgroup.com/api/interacting/interaction

id相体的node或者edge，通过graph.addNodes/addEdges来添加到画布，不会被重复绘制