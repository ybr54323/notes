# 动态增减表单 TableForm

### live demo

[![Edit Vue Antd Template (forked)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-antd-template-forked-gu3l3u?fontsize=14&hidenavigation=1&initialpath=%2F%23%2FtableFormDemo&theme=dark)

<iframe src="https://codesandbox.io/embed/vue-antd-template-forked-gu3l3u?fontsize=14&hidenavigation=1&initialpath=%2F%23%2FtableFormDemo&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vue Antd Template (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



### 参数

#### TableForm

| 参数          | 说明           | 类型     | 默认值    |
| ------------- | -------------- | -------- | --------- |
| rowStyle      | 行的样式对象   | object   | {}        |
| columns       | 列信息数组     | Column[] | []        |
| addButtonText | 新增按钮的文案 | string   | '新增'    |
| maxLength     | 最大行数       | number   | Infinite  |
| minLength     | 最小行数       | number   | -Infinite |

#### Column

| 参数          | 说明                                                         | 类型     | 默认值 |
| ------------- | ------------------------------------------------------------ | -------- | ------ |
| dataIndex     | 字段名称，必须                                               | string   |        |
| label         | label文案，非必须                                            | string   |        |
| componentName | 表单项的组件名，例如'a-input'/'a-select'等，必须             | string   | ''     |
| rules         | 校验规则，参考：https://1x.antdv.com/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99 | object[] |        |
| ...options    | 其他参数会被直接传入到动态组件中，例如: <component is="a-input" v-bind="options"/> ，所以可以参考Ant Design Vue 的对应Data Entry组件，所接收的参数，例如：https://1x.antdv.com/components/input-cn/#Input | object   |        |

