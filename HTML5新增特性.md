## HTML5与HTML比较

1. html没有语义化标签，而html5 添加了许多语义标签，使代码结构清晰，提高代码可读性。如：header、nav、footer、main、artical、section等。
2. html5 不区分是否是严格模式还是传统模式，而html 声明时有严格、传统、框架模式。文档声明变得简单明了。
3. html无法在网页上动态的绘制图片，而 html5 新增了canvas画布，canvas绘制的图片放大后会失真，而SVG可绘制矢量图形。

## H5新增特性

Canvas、SVG -- 用于绘画的元素，canvas绘制的图片会失真而SVG绘制的不会失真。
video、audio -- 用于播放视频和音频的媒体。
localStorage、sessionStorage -- 用于本地离线存储。
webSocket -- 单个TCP连接上进行全双工通讯的协议。
语义化标签元素 -- 如：article、footer、header、nav、section。
Drag 、Drop API -- 用于拖放的 。

## drag、drop API

[拖放API-MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)

### 被拖拽元素常用API

- draggable="true":用来设置元素可拖拽
- dragstart="dragstart(event)":用来设置开始拖拽后的处理逻辑

### 拖拽释放容器元素常用API

- ondragover="dragover(event)":默认地，数据/元素无法被放置到其他元素中。为了实现拖放，我们必须阻止元素的这种默认的处理方式。这个任务由 ondragover 事件的 event.preventDefault() 方法完成。
- ondrop="drop(event)":进行放置。

### 例子

```html
<!DOCTYPE HTML>
<html>
<head>
<script>
// 将容器元素设置可接受
function allowDrop(ev) {
    ev.preventDefault();
}

// 拖放要传递的数据
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// 鼠标松开后，对拖放数据进行处理
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
</script>
</head>
<body>

<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>

<!-- draggable="true"允许拖放 -->
<img id="drag1" src="img_logo.gif" draggable="true" ondragstart="drag(event)" width="336" height="69">

</body>
</html>
```

