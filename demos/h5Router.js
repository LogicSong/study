class Routers {
  constructor() {
    this.routes = {};
    // 监听popstate事件，对前进返回按钮进行监听
    window.addEventListener("popstate", (e) => {
      console.log("popstate", e);
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    });
  }
  init(path) {
    history.replaceState({ path: path }, null, path);
    this.routes[path] && this.routes[path]();
  }

  route(path, callback) {
    this.routes[path] = callback || function () {};
  }

  go(path) {
    history.pushState({ path: path }, null, path);
    this.routes[path] && this.routes[path]();
  }
}

window.Router = new Routers();
Router.init(location.pathname);
const content = document.querySelector("body");
const ul = document.querySelector("ul");
function changeBgColor(color) {
  content.style.backgroundColor = color;
}

Router.route("/", function () {
  changeBgColor("yellow");
});
Router.route("/blue", function () {
  changeBgColor("blue");
});
Router.route("/green", function () {
  changeBgColor("green");
});

ul.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    e.preventDefault();
    Router.go(e.target.getAttribute("href"));
  }
});
console.log("inited");
