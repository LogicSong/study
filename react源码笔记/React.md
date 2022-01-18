# React

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8954bb134b6049afa265031fe36c53d7~tplv-k3u1fbpfcp-watermark.awebp)

## render阶段：Fiber节点如何被创建并构建Fiber树

1. render阶段开始于performSyncWorkOnRoot或**performConcurrentWorkOnRoot**方法的调用。这取决于本次更新是同步更新还是异步更新。他们会调用如下方法：
```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {//如果当前浏览器帧没有剩余时间，shouldYield会中止循环，直到浏览器有空闲时间后再继续遍历。
    performUnitOfWork(workInProgress);
    //performUnitOfWork方法会创建下一个Fiber节点并赋值给workInProgress，并将workInProgress与已创建的Fiber节点连接起来构成Fiber树。
  }
}
```
2. **performUnitOfWork**的工作可以分为两部分：“递”和“归”。
    1. “递”阶段:首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用**beginWork**方法。
    2. “归”阶段:在“归”阶段会调用**completeWork**处理Fiber节点。
    3. “递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了。
3. **beginWork**方法：beginWork的工作是传入当前Fiber节点，创建子Fiber节点。
    1. 除rootFiber以外， 组件mount时，由于是首次渲染，是不存在当前组件对应的Fiber节点在上一次更新时的Fiber节点，即mount时current === null。所以源码是通过current === null ?来区分组件是处于mount还是update。
    2. update时：如果current存在，在满足一定条件时可以复用current节点，这样就能克隆current.child作为workInProgress.child，而不需要新建workInProgress.child。通过调用bailoutOnAlreadyFinishedWork()进行复用。
    3. mount时：除fiberRootNode以外，current === null。会根据fiber.tag(tag值是FunctionComponent/ClassComponent/HostComponent...)不同，(基于jsx ReactElement对象)创建不同类型的子Fiber节点。
    4. 不管是mount还是update，对于我们常见的组件类型，如（FunctionComponent/ClassComponent/HostComponent），最终会进入reconcileChildren方法
    5. reconcileChildren:从该函数名就能看出这是Reconciler模块的核心部分。对于mount的组件，他会创建新的子Fiber节点；对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成新Fiber节点。不论走哪个逻辑，最终他会生成新的子Fiber节点并赋值给workInProgress.child，作为本次beginWork返回值，并作为下次performUnitOfWork执行时workInProgress的传参
![](./img/beginWork.png)
4. **completeWork**方法：类似beginWork，completeWork也是针对不同fiber.tag调用不同的处理逻辑。
    1. 以处理HostComponent为例，和beginWork一样，我们根据current === null ?判断是mount还是update。同时针对HostComponent，判断update时我们还需要考虑workInProgress.stateNode != null ?（即该Fiber节点是否存在对应的DOM节点）。
    2. update时：当update时，Fiber节点已经存在对应DOM节点，所以不需要生成DOM节点。需要做的主要是处理props，比如：onClick、onChange等回调函数的注册、处理style prop、处理DANGEROUSLY_SET_INNER_HTML prop、处理children prop等，最主要的逻辑是调用updateHostComponent方法。在updateHostComponent内部，被处理完的props会被赋值给workInProgress.updateQueue，并最终会在commit阶段被渲染在页面上。其中updatePayload为数组形式，他的偶数索引的值为变化的prop key，奇数索引的值为变化的prop value。
    3. mount时：主要逻辑包括三个：为Fiber节点生成对应的DOM节点、将子孙DOM节点插入刚生成的DOM节点中、与update逻辑中的updateHostComponent类似的处理props的过程
    > mount时只会在rootFiber存在Placement effectTag。那么commit阶段是如何通过一次插入DOM操作（对应一个Placement effectTag）将整棵DOM树插入页面的呢？原因就在于completeWork中的appendAllChildren方法。由于completeWork属于“归”阶段调用的函数，每次调用appendAllChildren时都会将已生成的子孙DOM节点插入当前生成的DOM节点下。**那么当“归”到rootFiber时，我们已经有一个构建好的离屏DOM树**。至此render阶段的绝大部分工作就完成了。
    4. effectList：还有一个问题：作为DOM操作的依据，commit阶段需要找到所有有effectTag的Fiber节点并依次执行effectTag对应操作。难道需要在commit阶段再遍历一次Fiber树寻找effectTag !== null的Fiber节点么？这显然是很低效的。为了解决这个问题，在completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在effectTag的Fiber节点会被保存在一条被称为effectList的单向链表中。effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。类似appendAllChildren，在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。这样，在commit阶段只需要遍历effectList就能执行所有effect了。
    5. 当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段。如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段。
    6. 至此，render阶段全部工作完成。在`performSyncWorkOnRoot`函数中fiberRootNode被传递给`commitRoot`方法，开启commit阶段工作流程。
![](./img/completeWork.png)

```js
    export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,// 通过workInProgress.pendingProps.children就能得到
      renderLanes,
    );
  }
}
//mountChildFibers与reconcileChildFibers这两个方法的逻辑基本一致。唯一的区别是：reconcileChildFibers会为生成的Fiber节点带上effectTag属性，而mountChildFibers不会。
// 我们知道，render阶段的工作是在内存中进行，当工作结束后会通知Renderer需要执行的DOM操作。要执行DOM操作的具体类型就保存在fiber.effectTag中。
```
那么，如果要通知Renderer将Fiber节点对应的DOM节点插入页面中，需要满足两个条件：
- fiber.stateNode存在，即Fiber节点中保存了对应的DOM节点
- (fiber.effectTag & Placement) !== 0，即Fiber节点存在Placement effectTag
我们知道，mount时，fiber.stateNode === null，且在reconcileChildren中调用的mountChildFibers不会为Fiber节点赋值effectTag。那么首屏渲染如何完成呢？
针对第一个问题，fiber.stateNode会在completeWork中创建，我们会在下一节介绍。
第二个问题的答案十分巧妙：假设mountChildFibers也会赋值effectTag，那么可以预见mount时整棵Fiber树所有节点都会有Placement effectTag。那么commit阶段在执行DOM操作时每个节点都会执行一次插入操作，这样大量的DOM操作是极低效的。
为了解决这个问题，在mount时只有rootFiber会赋值Placement effectTag，在commit阶段只会执行一次插入操作。

## Commit阶段：
commitRoot方法是commit阶段工作的起点。fiberRootNode会作为传参。
```js
commitRoot(root);
```
在rootFiber.firstEffect上保存了一条需要执行副作用的Fiber节点的单向链表effectList，这些Fiber节点的updateQueue中保存了变化的props。这些副作用对应的DOM操作在commit阶段执行。除此之外，一些生命周期钩子（比如componentDidXXX）、hook（比如useEffect）也需要在commit阶段执行。
commit阶段的主要工作（即Renderer的工作流程）分为三部分：

- before mutation阶段（执行DOM操作前）
before mutation阶段的代码很短，整个过程就是遍历effectList并调用`commitBeforeMutationEffects`函数处理。`commitBeforeMutationEffects`函数内部整体可以分为三部分：处理DOM节点渲染/删除后的 autoFocus、blur 逻辑；调用`getSnapshotBeforeUpdate`生命周期钩子；调度`useEffect`。
- mutation阶段（执行DOM操作）
类似before mutation阶段，mutation阶段也是遍历effectList，执行函数。这里执行的是`commitMutationEffects`。
`commitMutationEffects`会遍历effectList，对每个Fiber节点执行如下三个操作：
根据ContentReset effectTag重置文字节点
更新ref
根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)
我们关注步骤三中的Placement | Update | Deletion。

- layout阶段（执行DOM操作后）
该阶段之所以称为layout，因为该阶段的代码都是在DOM渲染完成（mutation阶段完成）后执行的。
该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段。
layout阶段也是遍历effectList，执行函数。具体执行的函数是`commitLayoutEffects`。`commitLayoutEffects`一共做了两件事：

`commitLayoutEffectOnFiber`（调用生命周期钩子和hook相关操作）
`commitAttachRef`（赋值 ref）

`commitLayoutEffectOnFiber`方法会根据fiber.tag对不同类型的节点分别处理。对于ClassComponent，他会通过current === null?区分是mount还是update，调用componentDidMount或componentDidUpdate。对于FunctionComponent及相关类型，他会调用`useLayoutEffect hook`的回调函数，调度useEffect的销毁与回调函数。对于HostRoot，即rootFiber，如果赋值了第三个参数回调函数，也会在此时调用。
>结合这里我们可以发现，useLayoutEffect hook从上一次更新的销毁函数调用到本次更新的回调函数调用是同步执行的。而useEffect则需要先调度，在Layout阶段完成后再异步执行。这就是useLayoutEffect与useEffect的区别。

commitAttachRef代码逻辑很简单：获取DOM实例，更新ref。
至此，整个layout阶段就结束了。

#### current Fiber树切换
```js
root.current = finishedWork;
```
workInProgress Fiber树在commit阶段完成渲染后会变为current Fiber树。这行代码的作用就是切换fiberRootNode指向的current Fiber树。

那么这行代码为什么在这里呢？（在mutation阶段结束后，layout阶段开始前。）

我们知道componentWillUnmount会在mutation阶段执行。此时current Fiber树还指向前一次更新的Fiber树，在生命周期钩子内获取的DOM还是更新前的。

componentDidMount和componentDidUpdate会在layout阶段执行。此时current Fiber树已经指向更新后的Fiber树，在生命周期钩子内获取的DOM就是更新后的。

## 状态更新

```js
/*状态更新调用流程*/
触发状态更新（根据场景调用不同方法）

    |
    |
    v

创建Update对象

    |
    |
    v

从fiber到root（`markUpdateLaneFromFiberToRoot`）

    |
    |
    v

调度更新（`ensureRootIsScheduled`）

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

### 创建Update对象

#### 触发状态更新的几种场景

1. ReactDOM.render
2. this.setState
3. this.forceUpdate
4. useState
5. useReducer

**这些方法调用的场景各不相同，他们是如何接入同一套状态更新机制呢？**

答案是：每次状态更新都会创建一个保存更新状态相关内容的对象，我们叫他Update。在render阶段的beginWork中会根据Update计算新的state。

### 从fiber到root

当我们在触发状态更新时，触发更新的fiber上就包含了相关的Update对象。

但是我们知道，render阶段是从rootFiber开始向下遍历的，那么要开始render就要先从当前的fiber找到rootFiber。源码是怎么做的呢？

答案是调用`markUpdateLaneFromFiberToRoot`方法。该方法就是从触发状态更新的Fiber一直向上遍历寻找rootFiber，源码如下：

```js
// Walk the parent path to the root and update the child expiration time.
let node = sourceFiber;
let parent = sourceFiber.return;
while (parent !== null) {
  parent.childLanes = mergeLanes(parent.childLanes, lane);
  alternate = parent.alternate;
  if (alternate !== null) {
    alternate.childLanes = mergeLanes(alternate.childLanes, lane);
  } else {
    if (__DEV__) {
      if ((parent.effectTag & (Placement | Hydrating)) !== NoEffect) {
        warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
      }
    }
  }
  node = parent;
  parent = parent.return;
}
if (node.tag === HostRoot) {
  const root: FiberRoot = node.stateNode;
  return root;
} else {
  return null;
}
```

### 调度更新

现在，我们有了rootFiber，并且知道该rootFiber对应的Fiber树中某个Fiber节点包含一个Update。

接下来通知Scheduler根据更新的优先级，决定以同步还是异步的方式调度本次更新。

这里调用的方法是`ensureRootIsScheduled`。

以下是`ensureRootIsScheduled`最核心的一段代码：

```js
/*
  在这段核心代码之前还做了一些事：
  检查task是否已经存在，如果存在且优先级也没有变化，那么就复用之前的task
*/
if (newCallbackPriority === SyncLanePriority) {
  // 任务已经过期，需要同步执行render阶段
  newCallbackNode = scheduleSyncCallback(
    performSyncWorkOnRoot.bind(null, root)
  );
} else {
  // 根据任务优先级异步执行render阶段
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
    newCallbackPriority
  );
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

其中，`scheduleCallback`和`scheduleSyncCallback`会调用`Scheduler`提供的调度方法根据优先级调度回调函数执行。

可以看到，这里调度的回调函数为：
```js
performSyncWorkOnRoot.bind(null, root);
performConcurrentWorkOnRoot.bind(null, root);
```

至此，状态更新就和我们所熟知的render阶段连接上了。

### 深入理解Update与UpdateQueue

#### Update

首先，我们将可以触发更新的方法所隶属的组件分类：

- ReactDOM.render —— HostRoot

- this.setState —— ClassComponent

- this.forceUpdate —— ClassComponent

- useState —— FunctionComponent

- useReducer —— FunctionComponent

可以看到，一共三种组件（HostRoot | ClassComponent | FunctionComponent）可以触发更新。

由于不同类型组件工作方式不同，所以存在两种不同结构的Update，其中ClassComponent与HostRoot共用一套Update结构，FunctionComponent单独使用一种Update结构。虽然他们的结构不同，但是他们工作机制与工作流程大体相同。

Update的数据结构:

```js
const update: Update<*> = {
  eventTime,
  lane,
  suspenseConfig,
  tag: UpdateState,
  payload: null,
  callback: null,

  next: null,
};
```
主要参数：
- tag：更新的类型，包括UpdateState | ReplaceState | ForceUpdate | CaptureUpdate。

- payload：更新挂载的数据，不同类型组件挂载的数据不同。对于ClassComponent，payload为this.setState的第一个传参。对于HostRoot，payload为ReactDOM.render的第一个传参。

- callback：更新的回调函数。即在commit 阶段的 layout 子阶段一节中提到的回调函数。

- next：与其他Update连接形成链表。

#### UpdateQueue

ClassComponent与HostRoot使用的UpdateQueue结构如下(FunctionComponent不在此之内)：

```js
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    pending: null,
  },
  effects: null,
};
```

[UpdateQueue](https://react.iamkasong.com/state/update.html#updatequeue)

#### Fiber、UpdateQueue、Update之间的关系

每次触发更新时，相应的Fiber都会生成一个Update，一个Fiber可能生成了多个Update，这些Update以链表的形式保存在fiber.UpdateQueue中。这就是Fiber、Update、UpdateQueue之间的关系。


## Hook

### React团队推动hook的动机

1. 在组件之间复用状态逻辑很难

传统class组件的解决方案是使用`render props`和`高阶组件(HOC)`，但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。如果你在 React DevTools 中观察过 React 应用，你会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。

**React 需要为共享状态逻辑提供更好的原生途径。**

2. 复杂组件变得难以理解

每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

为了解决这个问题，**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**

3. 难以理解的 class

必须去理解 JavaScript 中 this 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的语法提案，这些代码非常冗余。大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。


