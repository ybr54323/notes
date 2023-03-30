### @vue/test-utils使用记录
#### 如何给测试用例中的全局Vue设置组件(`use()`),并使其生效 
例子:
```js
import antv from 'ant-design-vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(antv)

it('your test', () => {
    const wrapper = shallowMount(YourComponent, { localVue })
})
```
#### 如何调用组件的方法、如何使用`$nextTick`方法
```js
it('your test', async () => {
    const wrapper = shallowMount(YourComponent)
    // side effect
    await wrapper.vm.$nextTick()
})
```



### 关于插槽和插槽作用域

#### 当要使用到具名插槽和插槽作用域时，写法如下（测试调用了作用域的删除行的函数）

要用到插槽作用域时，要设置`mountOptions.scopedSlots`，文档地址：https://v1.test-utils.vuejs.org/zh/api/options.html#scopedslots

```js
it("验证removeSlot有效", async () => {
    const wrapper = mount(TableForm, {
      localVue,
      propsData: { columns: [{ label: 'name', dataIndex: 'name', componentName: 'a-input' }] },
      scopedSlots: {
        removeSlot: `
        
        <template slot-scope="{ removeCallback }">
          <span class="remove-slot" @click="removeCallback">test-remove-slot</span>
        </template>
        `
      }
    });
    wrapper.vm.init({ list: [{ name: "a" }] });
    await wrapper.vm.$nextTick();
    const removeSlot = wrapper.find('.remove-slot')
    removeSlot.trigger("click")
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.row').length).toBe(0)
});
```

### 关于微前端micro-zoe/micro-app与luckysheet集成的问题

存在定位不准确的问题，即右键菜单contextmenu弹出的位置，偏离了右键点击的位置，双击单元格以输入，输入框出现的位置也出错。
经调试后得知：因为luckysheet始化的逻辑是将所生成的表格dom，插入到documentElement中，是默认将整个模块当作全屏的应用，不存在内边距，顶格占满整个documentElement的，而由于微前端场景下，子应用dom不是对齐（占满）documentElement的，会存在内边距。微前端场景下，微前端的节点占位是如下橙色框中的：
[图片](../../../public/0dc9eec8-d7d9-4c6e-99de-387793644ec7.png)
所以就导致了库的定位出现了问题

解决方案：
使用iframe，给luckysheet提供一个documentElement，即在iframe中初始化这个库
vue代码如下：
```vue
<template>
  <iframe id="window-for-luckysheet" class="iframe" frameborder="0"> </iframe>
</template>

<script>
export default {
  name: "LuckySheet",
  mounted() {
    const tempWindow = document.getElementById("window-for-luckysheet").contentWindow;

    const links = [
      "https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/plugins.css",
      "https://cdn.jsdelivr.net/npm/luckysheet/dist/css/luckysheet.css",

      "https://cdn.jsdelivr.net/npm/luckysheet/dist/assets/iconfont/iconfont.css",
    ];
    const scripts = [
      "https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/js/plugin.js",
      "https://cdn.jsdelivr.net/npm/luckysheet/dist/luckysheet.umd.js",
    ];

    links.forEach((link) => {
      const elm = tempWindow.document.createElement("link");
      elm.href = link;
      elm.rel = "stylesheet";
      tempWindow.document.documentElement.appendChild(elm);
    });
    scripts.forEach((script) => {
      const elm = tempWindow.document.createElement("script");
      elm.src = script;
      tempWindow.document.documentElement.appendChild(elm);
    });
    const elm = tempWindow.document.createElement("div");
    elm.innerHTML = `
     <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
      "
    ></div>
    `;
    tempWindow.document.documentElement.appendChild(elm);

    tempWindow.onload = () => {
      const options = {
        container: "luckysheet",
      };
      tempWindow.luckysheet.create(options);
    };
  },
};
</script>

<style lang="less" scoped>
.iframe {
  width: calc(~"100%");
  height: calc(~"100%");
}
</style>
```



### 如何在codesandbox中分享demo，并且设置打开时的路由

![第一步](./../../../public/Snipaste_2023-03-20_10-57-28.png)
![第二步](../../../public/Snipaste_2023-03-20_11-03-36.png)

