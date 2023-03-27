动态增减表单 TableForm

### live demo

[![Edit Vue Antd Template (forked)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-antd-template-forked-gu3l3u?fontsize=14&hidenavigation=1&initialpath=%2F%23%2FtableFormDemo&theme=dark)

<iframe src="https://codesandbox.io/embed/vue-antd-template-forked-gu3l3u?fontsize=14&hidenavigation=1&initialpath=%2F%23%2FtableFormDemo&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vue Antd Template (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



### 参数

#### TableForm.prop

| 参数          | 说明           | 类型     | 默认值    |
| ------------- | -------------- | -------- | --------- |
| rowStyle      | 行的样式对象   | object   | {}        |
| columns       | 列信息数组     | Column[] | []        |
| addButtonText | 新增按钮的文案 | string   | '新增'    |
| maxLength     | 最大行数       | number   | Infinite  |
| minLength     | 最小行数       | number   | -Infinite |

#### Column

| 参数          | 说明                                                                                                                                                                                                      | 类型     | 默认值 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| dataIndex     | 字段名称，必须                                                                                                                                                                                            | string   |        |
| label         | label文案，非必须                                                                                                                                                                                         | string   |        |
| componentName | 表单项的组件名，例如'a-input'/'a-select'等，必须                                                                                                                                                          | string   | ''     |
| rules         | 校验规则，参考：https://1x.antdv.com/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99                                                                                                             | object[] |        |
| ...options    | 其他参数会被直接传入到动态组件中，例如: <component is="a-input" v-bind="options"/> ，所以可以参考Ant Design Vue 的对应Data Entry组件，所接收的参数，例如：https://1x.antdv.com/components/input-cn/#Input | object   |        |

### 插槽
#### removeTrigger

描述：用于自定义删除按钮的具名插槽

示例：

```vue
<template slot="removeTrigger" slot-scope="{ removeCallback, getCurrentRecord }">
	<a href="javascript:;">自定义删除</a>
</template>
```

插槽作用域：

| 参数             | 说明           | 类型       |
| ---------------- | -------------- | ---------- |
| removeCallBack   | 调用以删除该行 | ()=>void   |
| getCurrentRecord | 返回改行的数据 | ()=>object |

#### addTrigger

描述：用于自定义增加按钮的具名插槽

用法：

```vue
<template slot="addTrigger" slot-scope="{ addCallback }">
	<a href="javascript:;">自定义增加</a>
</template>
```

| 参数        | 说明           | 类型     |
| ----------- | -------------- | -------- |
| addCallback | 调用以新增一行 | ()=>void |




### 方法

| 参数                    | 说明                                                                                | 类型                                               |
| ----------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| init                    | 可以设置表单的行记录数组                                                            | ({ list: object[] })=>void                         |
| validateFields          | 同ant-design-vue的form.validateFields，传入回调函数，接收到校验结果、当前行记录数组 | (callback: (err: object, records: object[]))=>void |
| validateFieldsAndScroll | 同上，并且滚动到对应项的位置                                                        |                                                    |
| reset                   | 重置表单                                                                            | ()=>void                                           |

示例：

```js
this.$refs.form.validateFields((err, records) => {
    if (err) return // 校验不通过
    // records 是表单项数组
})
```

