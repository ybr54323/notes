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