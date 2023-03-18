# tuesday

今天在做需求时，要调整 antv@1.7.8 的消息提示模块的样式，由于这个大模块里面的消息提示比较多，这个样式的调整不能影响到其他的消息提示，结合文档 https://1x.antdv.com/components/message-cn/
,想到一个实现方式，具体如下


通过h方法返回一个带有标记的标签，包括要展示的文本信息
```js
this.$message.error({
    content(h) {
        // 标记子元素
        return h("span", {attrs: {id: "uniqueId"}, "msg"})
    }
})
```
通过`:has()`伪类，用子元素来找出父元素，再改其样式
```less
.ant-message-notice-content {
  &:has(#uniqueId) {
    // 样式代码
  }
}
```
如此就不会影响到其他逻辑分支的消息弹窗了



live demo
::: raw
<iframe src="https://codesandbox.io/embed/vue-antd-template-forked-gu3l3u?fontsize=14&hidenavigation=1&initialpath=%2F%23%2FmessageDemo&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vue Antd Template (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
:::
