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

