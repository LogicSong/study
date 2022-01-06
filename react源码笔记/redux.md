# redux解析

## redux的实现

### 为什么需要redux，它解决了什么问题

React作为一个组件化开发框架，组件之间存在大量通信，有时这些通信跨越多个组件，或者多个组件之间共享一套数据，简单的父子组件间传值不能满足我们的需求，自然而然地，我们需要有一个地方存取和操作这些公共状态。而redux就为我们提供了一种管理公共状态的方案。

### redux的简单实现

```js
//store.js
import { reducer } from './reducer'
export const createStore = (reducer) => {        
    let currentState = {}        
    let currentListeners = []             //观察者队列        
    function getState() {                
        return currentState        
    }        
    function dispatch(action) {                
        currentState = reducer(currentState, action)                
        currentListeners.forEach(fn => fn())        
    }        
    function subscribe(fn) {                
        currentListeners.push(fn);
        return function unsubscriber() {
            currentListeners.remove(fn)
        }

    }        
    dispatch({ type: '@@REDUX_INIT' })  //初始化store数据        
    return { getState, subscribe, dispatch }
}
```

## react-redux的实现

一个组件如果想从store存取公用状态，需要进行四步操作：import引入store、getState获取状态、dispatch修改状态、subscribe订阅更新，代码相对冗余，我们想要合并一些重复的操作，而react-redux就提供了一种合并操作的方案：react-redux提供Provider和connect两个API

### Provider的源码实现

Provider的核心是使用React Context API，将state注入到父组件，达到跨层级传递数据的效果。

```ts
function Provider<A extends Action = AnyAction>({
  store,
  context,
  children,
  serverState,
}: ProviderProps<A>) {
  const contextValue = useMemo(() => {
    const subscription = createSubscription(store)
    return {
      store,
      subscription,
      getServerState: serverState ? () => serverState : undefined,
    }
  }, [store, serverState])

  const previousState = useMemo(() => store.getState(), [store])

  useIsomorphicLayoutEffect(() => {
    const { subscription } = contextValue
    subscription.onStateChange = subscription.notifyNestedSubs
    subscription.trySubscribe()

    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs()
    }
    return () => {
      subscription.tryUnsubscribe()
      subscription.onStateChange = undefined
    }
  }, [contextValue, previousState])

  const Context = context || ReactReduxContext

  // @ts-ignore 'AnyAction' is assignable to the constraint of type 'A', but 'A' could be instantiated with a different subtype
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

### connect的简单实现

我们已经知道，connect接收mapStateToProps、mapDispatchToProps两个方法，然后返回一个高阶函数，这个高阶函数接收一个组件，返回一个高阶组件（其实就是给传入的组件增加一些属性和功能）connect根据传入的map，将state和dispatch(action)挂载子组件的props上：
```ts
export function connect(mapStateToProps, mapDispatchToProps) {    
    return function(Component) {      
        class Connect extends React.Component {        
            componentDidMount() {          
                //从context获取store并订阅更新          
                this.context.store.subscribe(this.handleStoreChange.bind(this));        
            }       
            handleStoreChange() {          
                // 触发更新          
                // 触发的方法有多种,这里为了简洁起见,直接forceUpdate强制更新,读者也可以通过setState来触发子组件更新          
                this.forceUpdate()        
            }        
            render() {          
                return (            
                    <Component              
                        // 传入该组件的props,需要由connect这个高阶组件原样传回原组件              
                        { ...this.props }              
                        // 根据mapStateToProps把state挂到this.props上              
                        { ...mapStateToProps(this.context.store.getState()) }               
                        // 根据mapDispatchToProps把dispatch(action)挂到this.props上              
                        { ...mapDispatchToProps(this.context.store.dispatch) }                 
                    />              
                )        
            }      
        }      
        //接收context的固定写法      
        Connect.contextTypes = {        
            store: PropTypes.object      
        }      
        return Connect    
    }
}
```

## redux中间件原理



### redux中间件中使用的聚合函数(Compose)

先看几个函数

```js
function f1(args) {
    console.log('fn1:',args)
}
function f2(args) {
    console.log('fn2:',args)
}
function f3(args) {
    console.log('fn3:',args)
}
```

如何执行这三个函数?

```js
fn1('args')
fn2('args')
fn3('args')
```

这样很啰嗦,优化一下

```js
// 先将函数改写一下,使其返回改写后的参数
function f1(args) {
    args = args + 1;
    console.log('fn1:',args);
    return args;
}
function f2(args) {
    args = args * 2;
    console.log('fn2:',args);
    return args;
}
function f3(args) {
    args = args / 3;
    console.log('fn3:',args);
    return args;
}
```

现在可以这样调用:

```js
f1(f2(f3(1)));
```

还是不够友好,能否将三个函数聚合成一个函数,然后直接调用聚合后的函数即可?

可以!下面就是聚合函数的实现,redux中的中间件就是用compose函数聚合的.

```js
function compose(funcArray: Function[]): Function {
    if (funcArray.length === 0) {
        return args => args
    }
    if (funcArray.length === 1) {
        return funcArray[0]
    }
    return funcArray.reduce((res, cur) => (...args) => res(cur(...args)))
}
```

### redux中间件实现原理

#### 先看applyMiddleWare

使用

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

let store = createStore(reducers, applyMiddleware(thunk));
```

首先明确一点:applyMiddleware在创建store时就调用了,看看源码它做了什么,返回了什么.

```js
// 核心源码
// 接受多个中间件(函数),返回一个函数
applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
    // 返回一个函数,该函数的参数是createStore,返回值是改写原store
  return (createStore: StoreEnhancerStoreCreator) =>
    <S, A extends AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>
    ) => {
      const store = createStore(reducer, preloadedState)
      let dispatch: Dispatch = () => {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.'
        )
      }

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        // dispatch
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      // 中间件的第一层函数是在这里调用的
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      // 使用compose进行聚合
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch)
    // 可以看到,返回值与原store唯一的区别就是改写(增强)了dispatch,这便是applyMiddleWare的作用
    // 也是中间件最终的目的
      return {
        ...store,
        dispatch
      }
    }
}
```

##### 总结一下applyMiddle

- 首先,它是一个三箭头函数,接受多个中间件(函数),返回一个双箭头函数
- 最下层的返回值函数,它的参数是createStore,它的返回值是改写原store
- 最下层返回值函数的返回值,实际上就是用createStore创建原store,然后通过中间件将dispatch增强,然后再将新的store作为返回值
- 中间件的第一层函数是在这里调用的,并将调用返回的函数用compose函数聚合

#### createStore做了什么

除了上文说的,源码中的createStore实际上首先看入参里有没有enhancer(applyMiddleware的执行结果),如果有则执行enhancer:
```js
if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(
        `Expected the enhancer to be a function. Instead, received: '${kindOf(
          enhancer
        )}'`
      )
    }

    return enhancer(createStore)(
      reducer,
      preloadedState as PreloadedState<S>
    ) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
  }
```

### MiddleWare

#### MiddleWare长什么样?

```js
// Middleware written as ES5 functions
// Outer function:
function exampleMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here

      return next(action)
    }
  }
}
```

- 最外层就是middleware本身,它在applyMiddleware中被调用`const chain = middlewares.map(middleware => middleware(middlewareAPI))`,当我们在业务代码中调用dispatch时就会将action派发到第一个middleware.只执行一遍
- wrapDispatch:(官方文档中写This function is actually the next middleware in the pipeline.)该函数也是在applyMiddleware中调用`dispatch = compose<typeof dispatch>(...chain)(store.dispatch)`,最后一个middleware中的next就是strore.dispatch.只执行一遍.
- handleAction: 每次dispatch都会触发,接受action参数.

#### 动手写一个logger

```js
const loggerMiddleware = storeAPI => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', storeAPI.getState())
  return result
}
```