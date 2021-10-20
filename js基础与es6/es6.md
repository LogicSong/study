# ES6学习笔记

## 1.Object对象的扩展
##### (1). super关键字：
`this`关键字总是指向函数所在的当前对象，而`super`关键字则指向当前对象的原型对象(`proto`)
##### (2). 解构赋值
```
    const obj = {a:1,b:2,c:3};
    const {a,b,c} = obj;
```
##### (3). 扩展运算符
```
    const {a, ...newObj} = obj;
```
##### (4). 链判断运算符
```
    obj?.d
```
##### (5). Null判断运算符
读取对象属性的时候，如果某个属性的值是null或undefined，有时候需要为它们指定默认值。常见做法是通过||运算符指定默认值。
```
    const headerText = response.settings.headerText || 'Hello, world!';
    const animationDuration = response.settings.animationDuration || 300;
    const showSplashScreen = response.settings.showSplashScreen || true;
```
上面的三行代码都通过||运算符指定默认值，但是这样写是错的。开发者的原意是，只要属性的值为null或undefined，默认值就会生效，***但是属性的值如果为空字符串或false或0，默认值也会生效***。

因此，***这个运算符的一个目的，就是跟链判断运算符?.配合使用，为null或undefined的值设置默认值***。例如：
```
    const animationDuration = response.settings?.animationDuration ?? 300;
```
##### (6) Object对象新增的方法
    Object.is();
    Object.assign();//注意点：浅拷贝
    Object.getOwnPropertyDescriptors();//ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
##### (7) __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()

## 2.Proxy
##### (1)概述
Proxy原意即为代理。可以理解成，***在目标对象之前架设一个拦截层***。外界对该对象的访问，都必须先通过这层拦截。因此提供一种机制，可以对外界的访问进行过滤和改写。
ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。
```
    var proxy = new Proxy(target, handler);
```
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。
一个例子
```
    var proxy = new Proxy({}, {
        get: function(target, propKey) {
            return 35;
        }
    });

    proxy.time // 35
    proxy.name // 35
    proxy.title // 35
```
支持Proxy拦截操作的对象属性方法有13种，如下：
```
    get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
    set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
    deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
    ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
    getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
    defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
    preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
    getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
    isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
    setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
    apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
    construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
```
##### (2)Proxy.revocable()
该函数返回一个可取消的Proxy实例。
##### (3)this指向问题


## 3.Reflect
##### (1)概述
Reflect与Proxy一样，也是ES6为了操作对象而提供的新API。其设计目的有以下几个：
（1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
（2） 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
（3） 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
（4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
##### (2)使用Proxy+Reflect实现观察者模式
```
    const person = observable({
        name: '张三',
        age: 20
    });

    function print() {
        console.log(`${person.name}, ${person.age}`)
    }
    observe(print);
    person.name = '李四';
    // 输出
    // 李四, 20
```
## 4.Iterator和for ... of ...循环
##### (1).概念
avaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了Map和Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。
遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。
Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。
##### (2).调用 Iterator 接口的场合
    由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子
* 解构赋值
* 扩展运算符
* yield*
* 其他场合，如：
for...of
Array.from()
Promise.all()/Promise.race()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([ ['a',1],['b',2] ])）
##### (3).字符串的 Iterator 接口
字符串是一个类似数组的对象，也原生具有 Iterator 接口。
##### (4).async/await的实现
```
function asyncToGenerator(generatorFunc) {
  // 返回的是一个新的函数
  return function() {
  
    // 先调用generator函数 生成迭代器
    // 对应 var gen = testG()
    const gen = generatorFunc.apply(this, arguments)

    // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
    // var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
    
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key, arg) {
        let generatorResult
        
        // 这个方法需要包裹在try catch中
        // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }

        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { value, done } = generatorResult

        if (done) {
          // 如果已经完成了 就直接resolve这个promise
          // 这个done是在最后一次调用next后才会为true
          // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
          // 这个value也就是generator函数最后的返回值
          return resolve(value)
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回 { value: Promise, done: false } 的结构，
          // 这里要注意的是Promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(
            // 这个value对应的是yield后面的promise
            value
          ).then(
            // value这个promise被resove的时候，就会执行next
            // 并且只要done不是true的时候 就会递归的往下解开promise
            // 对应gen.next().value.then(value => {
            //    gen.next(value).value.then(value2 => {
            //       gen.next() 
            //
            //      // 此时done为true了 整个promise被resolve了 
            //      // 最外部的test().then(res => console.log(res))的then就开始执行了
            //    })
            // })
            function onResolve(val) {
              step("next", val)
            },
            // 如果promise被reject了 就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw(err)
            // 那么自然就被catch到 然后把promise给reject掉啦
            function onReject(err) {
              step("throw", err)
            },
          )
        }
      }
      step("next")
    })
  }
}
// 原文地址：https://segmentfault.com/a/1190000022705474
```