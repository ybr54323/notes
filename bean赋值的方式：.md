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

### 准备工作

- 引入AOP的两个包
  - aopalliance
  - spring-aop

_com.example.BeforeAdvice.java_

```java
public class BeforeAdvice implements MethodBeforeAdvice {
    public void before(Method method, Object[] args, Object target) throws Throwable {
		// 要放在前置的增强代码        
    }
}
```



_applicationContext.xml_

```xml
<bean id="person" class="com.example.Person" />
<!--前置通知类型-->
<bean id="beforeAdvice" class="com.example.BeforeAdvice" />
<!--配置目标类-->
<bean id="personProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
	<!--配置目标类-->
    <property name="target" ref="person" />
    <!--实现的接口，Person实现的接口累-->
    <property name="proxyInterfaces" value="com.example.Interface" />
    <!--采用拦截的名称-->
    <property name="interceptorNames" value="beforeAdvice" />
	<!--采用CGLIB-->
    <property name="optimize" value="true" />
</bean>
```




- proxyTargetClass:是否对类代理而不是接口，设置为ture时，使用CGLib代理
- interceptorNames:需要织入目标的Advice
- singleton:返回代理是否为单实例，默认为单例
- optimize:当设置为ture时，强制使用CGLib代理

环绕通知

__com.example.AroundAdvice.java_

```java
public class BeforeAdvice implements MethodInterceptor {
    public Object before(MethodInvocation invocation) throws Throwable {
		// 环绕前增强
        Object obj = invocation.proceed();
        // 环绕后增强
        return obj;
    }
}
```

_applicationContext.xml_

```xml
<bean id="person" class="com.example.Person" />
<!--前置通知类型-->
<bean id="aroundAdvice" class="com.example.AroundAdvice" />
<!--一般的切面时使用通知作为且米娜，因为要对目标类的某方法进行增强，需要配置带有切入点的切面-->
<bean id="myAdvisor" class="org.springframework.aop.support.RegexMethodPointcutAdvisor">
    <!--pattern中配置正则表达式-->
	<property name="pattern" value=".*" /> 
    	/
    <property name="patterns" value="a,b" />
    <property name="advice" ref="aroundAdvice" />
</bean>
<!--配置目标类-->
<bean id="personProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
	<!--配置目标类-->
    <property name="target" ref="person" />
    <!--实现的接口，Person实现的接口累-->
    <property name="proxyTargetClass" value="true" />
    <!--采用拦截的名称-->
    <property name="interceptorNames" value="myAdvisor" />
</bean>
```



### 自动代理创建

前面的案例中，每个代理都是通过ProxyFacaoryBean织入切面代理，在实际开发中，非常多的Bean每个都配置ProxyFactoryBean开发维护量巨大

解决办法：自动创建代理
- BeanNameAutoProxyCreator 根据Bean名称创建代理
- DefaultAdvisorAutoProxyCreator 根据Advisor本身包含信息创建代理
- AnnotationAwareAspectJAutoProxyCreator 基于Bean中的AspectJ注解进行自动代理

_applicationContext.xml_
```xml
<!--配置目标类-->
<bean id="personDao" class="com.example.personDao" />
<bean id="customerDao" class="com.example.customerDao" />

<!--配置增强-->
<bean id="beforeAdvice" class="com.example.BeforeAdvice" />
<bean id="aroundAdvice" class="com.example.AroundAdvice" />
<!--自动代理配置-->
<bean class="org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator">
	<property name="beanNames" value="*Dao" />
    <property name="interceptorNames" value="beforeAdvice" />
    	/
    <property name="interceptorNames" value="aroundAdvice" />
</bean>
```

<u>缺点是这种自动代理会把类里面的所有方法都代理</u>

_applicationContext.xml_
```xml
<!--配置目标类-->
<bean id="personDao" class="com.example.PersonDao" />
<bean id="customerDao" class="com.example.customerDao" />
<!--配置增强-->
<bean id="beforeAdvice" class="com.example.BeforeAdvice" />
<bean id="aroundAdvice" class="com.example.AroundAdvice" />
<!--配置切面-->
<bean id="myAdvisor" class="org.springframework.aop.support.RegexMethodPointcutAdvisor">
    <!--pattern中配置正则表达式-->
	<property name="pattern" value="com\.example\.PersonDao\.methodName" /> 
    	/
    <property name="patterns" value="a,b" />
    <property name="advice" ref="aroundAdvice" />
</bean>

<bean class="org.springframework.aop.framework.autoProxy.DefaultAdvisorAutoProxyCreator">	
</bean> 
```

## AspectJ

- AspectJ是一个基于Java语言的AOP框架
- Spring2.0以后新增了对AspectJ切点表达式支持
- @AspectJ 是AspectJ1.5新增功能，通过JDK1.5注解技术，允许直接在Bean类中定义切面
- 新版本Spring框架，建议使用AspectJ方式来开发AOP
- 使用AspectJ需要导入Spring AOP和AspectJ相关Jar
  - spring-aop
  - com.springsource.org.aopalliance
  - spring-aspects
  - com.springsource.org.aspectj.weave

引包

_applicationContext.xml_

```xml
<dependency>
        <groupId>aopalliance</groupId>
        <artifactId>aopalliance</artifactId>
        <version>1.0</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>4.2.4.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.8.9</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aspects</artifactId>
        <version>4.2.4.RELEASE</version>
    </dependency>
```



### AspectJ注解方式开发AOP

_applicationContext.xml_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop" xsi:schemaLocation="
        http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--XML的配置方式完成AOP的开发===============-->
    <!--配置目标类=================-->
    <bean id="customerDao" class="com.imooc.aspectJ.demo2.CustomerDaoImpl"/>

    <!--配置切面类-->
    <bean id="myAspectXml" class="com.imooc.aspectJ.demo2.MyAspectXml"/>

    <!--aop的相关配置=================-->
    <aop:config>
        <!--配置切入点-->
        <aop:pointcut id="pointcut1" expression="execution(* com.imooc.aspectJ.demo2.CustomerDao.save(..))"/>
        <aop:pointcut id="pointcut2" expression="execution(* com.imooc.aspectJ.demo2.CustomerDao.update(..))"/>
        <aop:pointcut id="pointcut3" expression="execution(* com.imooc.aspectJ.demo2.CustomerDao.delete(..))"/>
        <aop:pointcut id="pointcut4" expression="execution(* com.imooc.aspectJ.demo2.CustomerDao.findOne(..))"/>
        <aop:pointcut id="pointcut5" expression="execution(* com.imooc.aspectJ.demo2.CustomerDao.findAll(..))"/>
        <!--配置AOP的切面-->
        <aop:aspect ref="myAspectXml">
            <!--配置前置通知-->
            <aop:before method="before" pointcut-ref="pointcut1"/>
            <!--配置后置通知-->
            <aop:after-returning method="afterReturing" pointcut-ref="pointcut2" returning="result"/>
            <!--配置环绕通知-->
            <aop:around method="around" pointcut-ref="pointcut3"/>
            <!--配置异常抛出通知-->
            <aop:after-throwing method="afterThrowing" pointcut-ref="pointcut4" throwing="e"/>
            <!--配置最终通知-->
            <aop:after method="after" pointcut-ref="pointcut5"/>
        </aop:aspect>

    </aop:config>
</beans>
```

- 通过execution函数，可以定义切点的方法切入

- 语法：

  - exection(<访问修饰符>?<返回类型><方法名>(<参数>)<异常>)

- 例如

  - 匹配所有类public的方法 execution(public * *(..))

  - 匹配指定包下所有类的方法 execution(* com.imooc.dao.*(..)) 不包含子包

  - execution(* com.imooc.dao..*(..)) ..*表示包、子孙包下所有类

  - 匹配指定类所有方法 execution(* com.imooc.service.UserService.*(..))

  - 匹配实现特定接口所有类方法

    execution(* com.imooc.dao.GenericDAO+.*(..))

  - 匹配所有save开头的方法 execution(* save*(..))



### Aspect的XML方式开发AOP

_applicationContext.xml_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop" xsi:schemaLocation="
        http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--开启AspectJ的注解开发，自动代理=====================-->
    <aop:aspectj-autoproxy/>

    <!--目标类===================-->
    <bean id="productDao" class="com.imooc.aspectJ.demo1.ProductDao"/>

    <!--定义切面-->
    <bean class="com.imooc.aspectJ.demo1.MyAspectAnno"/>
</beans>
```

_com.imooc.aspectJ.demo1.ProductDao.java_

```java
package com.imooc.aspectJ.demo1;

public class ProductDao {

    public void save(){
        System.out.println("保存商品...");
    }

    public String update(){
        System.out.println("修改商品...");
        return "hello";
    }

    public void delete(){
        System.out.println("删除商品...");
    }

    public void findOne(){
        System.out.println("查询一个商品...");
        //int i = 1/0;
    }

    public void findAll(){
        System.out.println("查询所有商品...");
//        int j = 1/0;
    }

}
```



com.imooc.aspectJ.demo1.MyAspectAnno.java_

```java
package com.imooc.aspectJ.demo1;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;

/**
 * 切面类
 */
@Aspect
public class MyAspectAnno {
    
    @Before(value="myPointcut1()")
    public void before(JoinPoint joinPoint){
        System.out.println("前置通知=================="+joinPoint);
    }

    @AfterReturning(value="myPointcut2()",returning = "result")
    public void afterReturing(Object result){
        System.out.println("后置通知=================="+result);
    }

    @Around(value="myPointcut3()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕前通知================");
        Object obj = joinPoint.proceed(); // 执行目标方法
        System.out.println("环绕后通知================");
        return obj;
    }

    @AfterThrowing(value="myPointcut4()",throwing = "e")
    public void afterThrowing(Throwable e){
        System.out.println("异常抛出通知=============="+e.getMessage());
    }

    @After(value="myPointcut5()")
    public void after(){
        System.out.println("最终通知==================");
    }

    @Pointcut(value="execution(* com.imooc.aspectJ.demo1.ProductDao.save(..))")
    private void myPointcut1(){}

    @Pointcut(value="execution(* com.imooc.aspectJ.demo1.ProductDao.update(..))")
    private void myPointcut2(){}

    @Pointcut(value="execution(* com.imooc.aspectJ.demo1.ProductDao.delete(..))")
    private void myPointcut3(){}

    @Pointcut(value="execution(* com.imooc.aspectJ.demo1.ProductDao.findOne(..))")
    private void myPointcut4(){}

    @Pointcut(value="execution(* com.imooc.aspectJ.demo1.ProductDao.findAll(..))")
    private void myPointcut5(){}
}
```

