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



### 如何在codesandbox中分享demo，并且设置打开时的路由

![第一步](./../../../public/Snipaste_2023-03-20_10-57-28.png)
![第二步](../../../public/Snipaste_2023-03-20_11-03-36.png)

