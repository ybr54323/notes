# Bean的常用配置

### bean的生命周期

配置方法

applicationContext.xml
```java
<bean id="person" class="com.example.Person" init-method="init" destroy-method="destory" />
```

注解方法

- @PostConstruct
- @PreDestroy

com.example.Person

```java
public class Person {
    @PostConstruct
    public void init(){}
    @PreDestroy
    public void destroy(){}
}
```

@Scope
指定Bean的作用范围

### bean的作用域
|类别|说明|
|---|---|
|singleton|在SpringIOC容器中仅存在一个Bean实例，Bean以单实例的方式存在|
|prototype|每次调用getBean()时会返回一个新的实例|
|request|每次HTTP请求都会创建一个新的Bean，该作用域仅适用于WebApplicationContext环境|
|session|同一个HTTP Session共享一个Bean，不同的HTTP Session使用不同的Bean。该作用于仅适用于WebApplicationContext环境|

# bean赋值的方式：

## 注解方法注入属性

- @Value 
- @Autowired 自动注入，通常用于引入dao，不用手动创建
- - 如果存在两个相同Bean类，则按照名称注入
- @Autowired 注入时可以针对成员变量或者set方法
- 通过@Autowired的required属性，设置一定要找到匹配的bean
- 使用@Qualifier指定注入Bean的名称

- @Resource(name="BeanName")

UserDao.java

```java
@Repository("userDao")
public class UserDao {
    ...
}
```

UserService.java

```java
@Service("userService")
public class UserSerivce {
    @Value("张三")
    private String name;
    @Resource(name="userDao")
    private UserDao userDao;
    ...
    @Value("23")
    public void setAge(int age){
        this.age = age;
    }
}
```

## xml配置方法注入属性

### 构造方法注入:

*Bean下要有对应的构造方法constructor*

```xml
<bean id="person" class="com.example.Person">
	<constructor-arg name="name" value="张三" />
    <constructor-arg name="age" value="23" />
</bean>
```



### set方法注入:

*以下的方式都需要Bean下要有对应的setter*

```xml
<bean id="person" class="com.example.Person">
	<property name="name" value="张三" />
    <property name="age" value="23" />
</bean>
```



### p命名空间属性注入:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
<!-- ... --->
<bean id="person" class="com.example.Person" p:name="张三" p:age="23" p:cat-ref="cat" />
	<bean id="cat" class="com.example.Cat" p:name="李四" />
```



### spEL属性注入:

```xml
<bean id="person" class="com.example.Person">
	<property name="name" value="#{'张三'}" />
</bean>

<bean id="person" class="com.example.Person">
	<property name="cat" value="#{cat}" />
</bean>
<bean id="cat" class="com.example.Cat">
	<property name="name" value="#{'李四'}}" />
</bean>
```



### 复杂类型的属性注入：

```xml
<bean id="person" class="com.example.Person">
	<property name="list">
        <list>
            <value>1</value>
        	<value>2</value>
        	<value>3</value>
        </list>
    </property>
    <property name="set">
        <set>
        	<value>1</value>
            <value>2</value>
        	<value>3</value>
        </set>
    </property>
    <property>
    	<map>
        	<entry key="1" value="1"></entry>
            <entry key="2" value="2"></entry>
            <entry key="3" value="3"></entry>
        </map>
    </property>
    <property>
        <props>
            <prop key="1">1</prop>
            <prop key="2">2</prop>
            <prop key="3">3</prop>
        </props>
    </property>
</bean>
```



# 定义bean:
### 使用xml配置
applicationContext.xml
```xml
<bean id="person" class="com.example.Person" />
```



### 使用注解方法定义

applicationContext.xml

```xml
<content:component-scan base-package="com.example" />
```

com.example.Person.java

```java
@Component("person")
public class Person {
    public static void main(String[] arg){}
}
```

- @Component 描述Spring框架中Bean
- @Repository 用于对DAO实现类进行标注
- @Service 用于对Service实现类进行标注
- @Controller 用于对Controller实现类进行标注

传统XML配置和注解配置混合使用
- XML的优势
    结构清晰，易于阅读
- 注解方式的优势
    开发便捷，属性注入方便
- XML与注解的整合开发
    1、一如context命名空间
    2、再配置文件中添加context:annotation-config 标签

```
<context:annotation-config> 只解析属性的注解
```



# AOP
面向切面编程 aspect oriented programming
### AOP的相关术语
* Joinpoint 连接点指被拦截到的点，在spring中指的是方法，因为spring中只支持方法类型的连接点，可能会被拦截的点，或者叫能被拦截的点。
* Pointcut 定义哪些方法会被拦截，真正被拦截的点。
* Advice 拦截后要做的事情，
* Introduction 引介是一种特殊的通知在不修改类代码的前提下，引介可以在运行期为类动态的添加一些方法或者Field。
* Target 代理的目标对象，被增强的对象
* Weaving 将Advice应用到Target的过程
* Proxy 被应用增强后产生的代理对象
* Aspect 切入点和同志的组合，AspectJ采用编译器织入和类装载区织入的方式， Spring采用动态代理方式织入



JDK动态代理

_注意UserDaoImpl实现了UserDao的4个接口，UserDao是Interface类_

```java
public class MyJDKProxy implements InvocationHandler {
    private UserDao userDao;

    public MyJDKProxy(UserDao userDao) {
        this.userDao = userDao;
    }

    public Object createProxy() {
        Object proxy = Proxy.newProxyInstance(userDao.getClass().getClassLoader(), userDao.getClass().getInterfaces(), this);
        return proxy;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if ("save".equals(method.getName())) {
            System.out.println("权限校验");
            return method.invoke(userDao, args);
        }
        return method.invoke(userDao, args);
    }
}
```



CGLIB对于没有实现接口的类，实现代理的方式

```java
public class MyCGLIBProxy implements MethodInterceptor{
  private UserDao userDao;
  public MyCGLIBProxy(UserDao userDao){
    this.userDao = userDao;
  }
  public Object createProxy(){
    // 1.创建核心类
    Enhancer enhancer = new Enhancer();
    // 2.设置父类
    enhancer.setSuperclass(userDao.getClass());
    // 3.设置回调
    enhancer.setCallback();
    // 4.生成代理
    Object proxy = enhancer.create();
    return proxy;
  }
  public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throw Throwable {
    if ("save".equals(method.getName())){
      System.out.println("权限校验");
      return methodProxy.invokeSuper(proxy.args);
    }
    return methodProxy.invokeSuper(proxy.args);
  } 
}
```



- Spring在运行期，生成动态代理对象，不需要特殊的编译器

- Spring AOP的底层原理就是通过JDK动态代理或CGLIB动态代理技术，为目标Bean执行横向织入

  ​    1.若目标对象实现了若干接口，Spring使用JDK的java.lang.reflect.Proxy类代理
  
  ​    2.若目标没有实现任何接口，Spring使用CGLIB库生产目标对象的子类。
  
- 程序中应该优先对接口创建代理，便于程序解耦维护

- 标记为final的方法，不能被代理，因为无法进行覆盖

    - JDK动态生成代理是针对接口生成子类，接口中方法不能使用final修饰
    - CGLIB是针对目标类生成子类，因此类或方法不能使用final
    
- Spring支支持方法连接点，不支持属性连接点



### AOP增强类型

- AOP联盟为通知Advice定义了org.aopalliance.aop.Interface.Advice

- Spring按照通知Advice在目标类的连接点位置，可分为5类

  - 前置通知org.springframework.aop.MethodBeforeAdvice
    
      - 在目标方法执行前实施增强
  - 后置通知org.springframework.aop.AfterReturningAdvice
    
      - 在目标方法执行后实施增强
  - 环绕通知 org.aopalliance.intercept.MethodInterceptor
  
      - 在目标方法执行前后实施增强
  - 异常抛出通知 org.springframework.aop.ThrowsAdvice
      - 在方法抛出异常后实施增强
- 引介通知 org.springframework.aop.IntroductionInterceptor
      - 在目标类中添加一些新的方法和属性（Spring不支持属性代理）