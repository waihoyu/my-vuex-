class HistoryRoute {
  constructor() {
    this.current = null;
  }
}
class VueRouter {
  constructor(options) {
    this.mode = options.mode || "hash";
    this.routes = options.routes || [];
    this.routesMap = this.createMap(this.routes);
    this.history = new HistoryRoute();
    this.init();
  }
  init() {
    if (this.mode === "hash") {
      //
      location.hash ? "" : (location.hash = "/");
      window.addEventListener("load", () => {
        this.history.current = location.hash.slice(1);
      });
      window.addEventListener("hashchange", () => [
        (this.history.current = location.hash.slice(1))
      ]);
    } else {
      location.pathname ? "" : (location.pathname = "/");
      window.addEventListener("load", () => {
        this.history.current = location.pathname;
      });
      window.addEventListener("popstate", () => {
        this.history.current = location.pathname;
      });
    }
  }
  createMap(routes) {
    return routes.reduce((memo, current) => {
      memo[current.path] = current.component;
      return memo;
    }, {});
  }
  go() {}
  back() {}
  push() {}
}
VueRouter.install = function(Vue, opts) {
  Vue.mixin({
    beforeCreate() {
      //定位根组件
      if (this.$options && this.$options.router) {
        this._root = this;
        this._router = this.$options.router;
        Vue.util.defineReactive(this, "xxx", this._router.history);
      } else {
        //vue组件的渲染顺序，
        console.log(this.$parent);
        this._root = this.$parent.$root;
      }
      Object.defineProperty(this, "$router", {
        get() {
          return this._root._router;
        }
      });
      Object.defineProperty(this, "$route", {
        get() {
          return {
            current: this._root._router.history.current
          };
        }
      });
    }
  });
  Vue.component("router-link", {
    props: {
      to: String
    },
    methods: {
      handClick() {
        alert(1);
      }
    },
    render(h) {
      let mode = this._self.$root._router.mde;
      let tag = this.tag;
      return (
        <a href={mode === "hash" ? `#${this.to}` : this.to}>
          {this.$slots.default}
        </a>
      );
    }
  });
  Vue.component("router-view", {
    render(h) {
      let current = this._self._root._router.history.current;
      //   console.log(this._self.$root._router);
      let routeMap = this._self.$root._router.routesMap;
      //   //   return h("a", {}, "这里是首页View");
      return h(routeMap[current]);
    }
  });
};

export default VueRouter;
