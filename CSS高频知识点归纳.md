# CSS高频知识点归纳

#### CSS选择器以及这些选择器的优先级
+ !important
+ 内联样式（1000）
+ ID选择器（0100）
+ 类选择器/属性选择器/伪类选择器（0010）
+ 元素选择器/伪元素选择器（0001）
+ 关系选择器/通配符选择器（0000）
```css
a[href] {color:red;} /*属性选择器*/
/* 伪类选择器 */
/* 未访问的链接 */
a:link {
  color: #FF0000;
}
/* 已访问的链接 */
a:visited {
  color: #00FF00;
}
/* 元素选择器 */
a {
    color: #000;
}
/* 伪元素选择器 双冒号取代了伪元素的单冒号表示法。这是 W3C 试图区分伪类和伪元素的尝试*/
p::first-line {
  color: #ff0000;
}
/* 几种关系选择器 */
/* 1. 后代选择器 */
div a {

}
/* 2. 子选择器 */
div>a {

}
/* 3. 相邻选择器 */
div+p {

}
/* 4. 兄弟选择器 */
div~p {

}
```

#### 伪类与伪元素
伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。
CSS3规范中的要求使用双冒号(::)表示伪元素，以此来区分伪元素和伪类，比如::before和::after等伪元素使用双冒号(::)，:hover和:active等伪类使用单冒号(:)。除了一些低于IE8版本的浏览器外，大部分浏览器都支持伪元素的双冒号(::)表示方法。

##### 常见的伪类与伪元素
伪类：
+ :first-child/:last-child
+ :first-of-type(同类中的第一个)/:last-of-type
+ :not
+ :nth-child(an+b)
+ :nth-of-type(an+b)
+ :hover
+ :active
+ :focus

伪元素：
+ ::after
+ ::before
+ ::first-letter
+ ::first-line
+ ::selection

#### BFC(块级格式化上下文)

##### 什么是BFC？
BFC 全称为块级格式化上下文 (Block Formatting Context) 。BFC是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位以及与其他元素的关系和相互作用，当涉及到可视化布局的时候，Block Formatting Context提供了一个环境，HTML元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。这里有点类似一个BFC就是一个独立的行政单位的意思。可以说BFC就是一个作用范围，把它理解成是一个独立的容器，并且这个容器里box的布局与这个容器外的box毫不相干。

##### BFC的触发条件有哪些？
+ 根元素
+ float的值不为none
+ overflow的值不为visible
+ display的值为inline-block、table-cell、table-caption
+ position的值为absolute或fixed

##### BFC的约束规则
+ 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）
+ BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然
+ 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算
+ 浮动盒区域不叠加到BFC上

##### BFC可以干什么？
+ 垂直外边距重叠问题
+ 去除浮动
+ 自适用两列布局（float + overflow）

#### 如何实现自适应两栏布局，左侧固定宽度，右侧宽度自适应

DOM结构：
```html
<div class='box'>
    <div class='left-box'>
    </div>
    <div class='right-box'>
    </div>
</div>
```

##### float+margin
```css
.box {
    width:100%;
    height:100%;
}
.left-box {
    width:200px;
    height:100%;
    float:left;
}
.right-box {
    height:100%;
    margin-left:200px;
}
```
##### 利用calc函数计算
```css
.box {
    width:100%;
    height:100%;
}
.left-box {
    width:200px;
    height:100%;
    float:left;
}
.right-box {
    height:100%;
    width:calc(100% - 200px);/* calc函数运算符中间必须要有空格 */
    float:right;
}
```
##### float+overflow
```css
.box {
    width:100%;
    height:100%;
}
.left-box {
    width:200px;
    height:100%;
    float:left;
}
.right-box {
    height:100%;
    overflow:hidden;/* BFC */
}
```
##### flex
```css
.box {
    width:100%;
    height:100%;
    display:flex;
}
.left-box {
    width:200px;
    height:100%;
}
.right-box {
    height:100%;
    flex:1;/*flex-grow:1;*/
}
```

#### flex详解
>传统的布局方案依赖display,position,float
>注意：使用flex布局后，子元素的float,clear(属性规定元素的哪一侧不允许其他浮动元素),vertical-align

##### 容器属性
+ flex-direction: row,colunm,row-reverse,colunm-reverse
+ flex-wrap: no-wrap,wrap,wrap-reverse
+ flex-flow: row,no-wrap
+ justify-content: flex-start,flex-end,center,space-between,space-around
+ align-items: flex-start,flex-end,center,baseline(项目的第一行文字的基线对齐),stretch(默认值)
+ align-content: 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。flex-start,flex-end,center,space-between,space-around

##### 子元素属性
+ order: <integer>属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
+ flex-grow: <number>属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
>flex-grow是指元素排列完后**剩余**的空间如何分配，默认值为0，即不参与分配，如果有4个子元素，两个子元素的flex-grow为1，一个子元素为2，还有一个为0，则剩余空间会划分为4份，为1的占据1份，为2的占据2份，为0的占据0份。
+ flex-shrink: <number>属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小，为0不缩小。
+ flex-basis: 属性定义了在分配多余空间之前，项目占据的主轴空间（main size），主轴是横轴时就是宽度，此属性优先级大于width。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
+ flex: 属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
>因此：flex:1;等价于flex-grow:1;
+ align-self: 很少用到

#### 如何实现居中
##### 水平居中
+ 若是行内元素，给其父元素设置text-align:center即可实现行内元素水平居中。
+ 若是块级元素，该元素设置margin:0 auto即可（元素需要定宽）。
+ 若是块级元素，设置父元素为flex布局，子元素设置margin:0 auto即可（子元素不需要定宽）。
+ 使用flex，父元素上设置justify-content:center可以轻松的实现子元素水平居中。
+ 使用绝对定位和CSS3新增的属性transform（这个属性还和GPU硬件加速、固定定位相关）
```css
.box {
  width: 200px;
  height: 200px;
  position: relative;
  background-color: pink;
}

.box-center {
  position: absolute;
  left:50%;
  // width: 50%;
  height: 100%;
  // 通过 translate() 方法，元素从其当前位置移动，根据给定的 left（x 坐标） 和 top（y 坐标） 位置参数：
  // translate(x,y)	定义 2D 转换。
  // translateX(x)	定义转换，只是用 X 轴的值。
  // translateY(y)	定义转换，只是用 Y 轴的值。
  // left: 50% 先整体向父容器的左侧偏移50%，此时是不能居中的，因为元素本身有大小
  // 接着使用transform使用百分比向左偏移本身的宽度的一半实现水平居中（这里的百分比以元素本身的宽高为基准）
  transform:translate(-50%,0);
  background-color: greenyellow;
}
```
+ 使用绝对定位和margin-left（元素定宽）
```css
.box {
  width: 200px;
  height: 200px;
  position: relative;
  background-color: pink;
}

.box-center {
  position: absolute;
  left:50%;
  height: 100%;
  // 类似于transform
  // width: 50%;
  // margin-left: -25%;
  width: 100px;
  margin-left: -50px;
  background-color: greenyellow;
}
```
##### 垂直居中
+ 若元素是单行文本, 则可设置line-height等于父元素高度
+ 若是块级元素，设置父元素为flex布局，子元素设置margin: auto 0即可（子元素不需要定宽）
+ flex布局align-items:center.(块级flex,行内块inline-flex)
+ transform，设置父元素相对定位，子元素绝对定位，然后top，transform
+ 居中元素高度固定时，设置父元素相对定位，子元素绝对定位、负margin为子元素高度的一半
+ 居中元素高度固定时，设置父元素相对定位，子元素绝对定位、top:0,bottom:0、margin:auto 0;

##### 水平垂直居中
+ flex布局(justify-content,align-items)
+ absolute+transform(父元素relative,子元素absolute,top:50%,left:50%,transform(-50%,-50%))
+ 绝对定位实现(定位元素定宽定高)
```css
.box {
  position: relative;
  height: 100px;
  width: 100px;
  background-color: pink;
}

.box-center{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  background-color: greenyellow;
}
```

#### position
CSS 有两个最重要的基本属性，前端开发必须掌握：display 和 position。
display属性指定网页的布局。两个重要的布局：弹性布局flex和网格布局grid。
position属性用来指定一个元素在网页上的位置，一共有5种定位方式，即position属性主要有五个值。
+ static:默认属性，正常流。这时top、bottom、left、right这四个属性无效。
+ relative:表示相对于默认位置（即static时的位置）进行偏移，即定位基点是元素的默认位置。
+ absolute:脱离正常流。表示相对于最近的position属性不是static的上级元素（一般是父元素）进行偏移，即定位基点是父元素。
+ fixed:脱离正常流表示相对于视口（viewport，浏览器窗口）进行偏移，即定位基点是浏览器窗口。这会导致元素的位置不随页面滚动而变化，好像固定在网页上一样。
+ sticky:2017年浏览器新增支持。跟前面四个属性值都不一样，它会产生动态效果，很像relative和fixed的结合：一些时候是relative定位（定位基点是自身默认位置），另一些时候自动变成fixed定位（定位基点是视口）。
```css
/* sticky使用方法 */
{
  position:sticky;
  top:20px;
}
```
`一旦给元素加上absolute或float就相当于给元素加上了display:block`

##### 绝对定位需要注意的问题
问：父元素relative,子元素absolute,绝对定位的基点是在哪里？padding？border？margin？
答：父元素padding的左上角

#### 说说z-index有什么需要注意的地方

产生层叠上下文的方法：
+ HTML中的根元素<html></html>本身j就具有层叠上下文，称为“根层叠上下文”。
+ 普通元素设置position属性为非static值并设置z-index属性为具体数值，产生层叠上下文。
+ CSS3中的新属性也可以产生层叠上下文。

CSS3中的属性对层叠上下文产生的影响
+ 父元素的display属性值为flex|inline-flex，子元素z-index属性值不为auto的时候，子元素为层叠上下文元素；
+ 元素的opacity属性值不是1；
+ 元素的transform属性值不是none；
+ 元素mix-blend-mode属性值不是normal`；
+ 元素的filter属性值不是none；
+ 元素的isolation属性值是isolate；
+ will-change指定的属性值为上面任意一个；

>1、首先先看要比较的两个元素是否处于同一个层叠上下文中:
1.1如果是，谁的层叠等级大，谁在上面（怎么判断层叠等级大小呢？——看“层叠顺序”图）。
1.2如果两个元素不在统一层叠上下文中，请先比较他们所处的层叠上下文的层叠等级。 
2、当两个元素层叠等级相同、层叠顺序相同时，在DOM结构中后面的元素层叠等级在前面元素之上。

#### 如何使一个div的高度始终为宽度的一半
使用height:0;padding-bottom:50%。
>当margin或者padding取值是百分比的时候，无论是left，right或者top，bottom，都是以父元素的width为参考物，进行提前占位，避免资源加载时候的闪烁，还可以让高度自适应。
```css
{
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  /* background: blue; */
}
```

### 移动端1px解决方案

#### 真正原因

> 和dpr没有任何关系，dpr可以用来解释不同分辨率手机呈现页面的精细度的差异，但并不能解释1px问题。

我们做移动端页面时一般都会设置meta viewport的content=“width=device-width”，
这里就是把html视窗宽度大小设置等于设备宽度的大小，大多数手机的屏幕设备宽度都差不多，以iphoneX为例，屏幕宽度375px。

而UI给设计图的时候基本上都是给的二倍图甚至三倍图，假设设计图是750px的二倍图，在750px上设计了1px的边框，要拿到375px宽度的手机来显示，就相当于整体设计图缩小一倍，所以在375px手机上要以0.5px呈现才符合预期效果，然而css里最低只支持1px大小，不足1px就以1px显示，所以你看到的就显得边框较粗，实际上只是设计图整体缩小了，而1px的边框没有跟着缩小导致的。

![1px问题的原因](https://blog.csdn.net/u010059669/article/details/88953620)

#### 解决方案

这里只说一种解决方案：

```js

var viewport = document.querySelector("meta[name=viewport]");
var scale = window.screen.width / 750;
viewport.setAttribute('content', `width=750,initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`);

var docEl = document.documentElement;
var fontsize = 10 * (docEl.clientWidth / 320) + 'px';
docEl.style.fontSize = fontsize;

```

![解决方案](https://blog.csdn.net/u010059669/article/details/88953620)

## CSS继承

css 的继承很简单，分为默认继承的和默认不继承的，但所有属性都可以通过设置 inherit 实现继承。

当没有指定值时，默认继承的属性取父元素的同属性的计算值（相当于设置了 inherit ），默认不继承的属性取属性的初始值（相当于设置了 initial ）。

默认继承的属性：
- 所有元素默认继承：visibility、cursor
- 文本属性默认继承：letter-spacing、word-spacing、white-space、line-height、color、font、 font-family、font-size、font-style、font-variant、font-weight、text-indent、text-align、text-shadow、text-transform、direction
- 列表元素默认继承：list-style、list-style-type、list-style-position、list-style-image
- 表格元素默认继承：border-collapse

总结：只需要记住那些默认继承的，剩下的都是默认不继承的。而默认继承的元素除了文本相关的哪些，只有 visibility、cursor 比较常用了

## 使用css画一个三角形

```css
.triangle {
  width: 0px;
  height: 0px;
  border-bottom: 20px solid springgreen;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

## CSS3中的动画属性

> transition、animation和transform是CSS3中三个制作动画的重要属性

### transition

允许css的属性值在一定的时间区间内平滑地**过渡**。这种效果可以在鼠标单击、获得焦点、被点击或对元素任何改变中触发，并圆滑地以动画效果改变CSS的属性值。

transition主要包含四个属性值：执行变换的属性：transition-property，变换延续的时间：transition-duration，在延续时间段，变换的速率变化：transition-timing-function，变换延迟时间：transition-delay。

- transition-property: none || all || property,要过渡的属性名称，多个属性时用逗号连接
- transition-duration：为数值，单位为s（秒）或者ms(毫秒)，其默认值是0
- transition-timing-function：linear || ease || ease-in || ease-out || ease-in-out || cubic-
bezier(n,n,n,n)。
- transition-delay：为数值，单位为s（秒）或者ms(毫秒)， 默认大小是0。

例子：
```css
.one {
        width: 100px;
        height: 100px;
        margin: 200px auto;
        background-color: #cd4a48;
        transition: width 2s ease;
    }

    .one:hover {
        width: 300px;
    }

```

注意：
1. 不是所有的CSS属性都支持transition
2. transition需要明确知道，开始状态和结束状态的具体数值，才能计算出中间状态。比如，height从0px变化到100px，transition可以算出中间状态。但是，transition没法算出0px到auto的中间状态，也就是说，如果开始或结束的设置是height: auto，那么就不会产生动画效果。
3. transition需要事件触发，所以没法在网页加载时自动发生。
4. transition是一次性的，不能重复发生，除非一再触发。
5. transition写多个属性时，应该分别写4个子属性值，写在一起会出现只有一个属性有过渡效果，其它属性是突变的。

### animation

不同于transition只能定义首尾两个状态，animation可以定义任意多的关键帧，因而能实现更复杂的动画效果。

```css
animation: animation-name || animation-duration || animation-timing-function || animation-delay || animation-iteration-count || animation-direction
```

animation主要包含六个属性，**可以看出前四个属性与transition一一对应的**。具体含义如下：

属性名|描述
:--|:--
animation-name|需要绑定到选择器的 keyframe 名称
animation-duration|规定完成动画所花费的时间，以秒或毫秒计。
animation-timing-function|规定动画的速度曲线。
animation-delay|规定在动画开始之前的延迟，默认值为0。
animation-iteration-count|规定动画应该播放的次数，默认值为1。
animation-direction|规定是否应该轮流反向播放动画，默认值是正向。
animation-fill-mode|规定动画结束以后，是否让动画保持在结束状态。默认行为是跳回到动画的开始状态。
animation-play-state|规定动画播放过程突然停止时是否保持突然终止时的状态。默认行为是跳回到动画的开始状态。

##### keyframe

在使用animation之前要先会使用@keyframe
@keyframes 让开发者通过指定动画中特定时间点必须展现的关键帧样式（或者说停留点）来控制CSS动画的中间环节。这让开发者能够控制动画中的更多细节而不是全部让浏览器自动处理。
要使用关键帧, 先创建一个带名称的@keyframes规则，以便后续使用 animation-name这个属性来调用指定的@keyframes. 每个@keyframes 规则包含多个关键帧，也就是一段样式块语句，每个关键帧有一个百分比值作为名称，代表在动画进行中，在哪个阶段触发这个帧所包含的样式。
关键帧的编写顺序没有要求，最后只会根据百分比按由小到大的顺序触发。

具体规则与例子如下：
```css
/* 规则 */
@keyframes animationname {
  keyframes-selector {
    css-styles;
  }
}
/* 例子 */
@keyframes identifier {
  0% { top: 0; left: 0px}
  50% { top: 30px; left: 20px; }
  100% { top: 0; left: 30px;}
}
```

### transform

transform就是变形，主要包括旋转rotate、扭曲skew、缩放scale和移动translate以及矩阵变形matrix。

- translate:translate(x,y),translate3d(x,y,z),translateX(x),translateY(y),translateZ(z)。主要是用来平移。
- scale:scale(x,y),scale3d(x,y,z),scaleX(x),scaleY(y),scaleZ(z).放大缩小
- rotate:rotate(angle),rotate3d(x,y,z,angle),rotateX(angle),rotateY(angle),rotateZ(angle).旋转
- skew:skew(x-angle,y-angle),skewX(angle),skewY(angle)
- transform-origin:以上变化的默认参照点是元素的中心点，不过可以通过transform-origin设置元素的参照点。


## 说一下CSS3中新增了哪些属性

这个问题，说几个常见的css3新增属性即可

- 属性选择器
- border-radius
- 动画相关：Transition,Transform和Animation


