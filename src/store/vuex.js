let Vue;
const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key]);
  });
};
class ModuleCollection {
  constructor(options) {
    this.register([], options);
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    };
    if (path.length === 0) {
      this.root = newModule;
    } else {
      let parent = path.slice(0, -1).reduce((root, curent) => {
        return this.root._children[curent];
      }, this.root);
      parent._children[path[path.length - 1]] = newModule;
    }
    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module);
      });
    }
  }
}
//
const installModule = (store, state, path, rootModule) => {
  if (path.length > 0) {
    // 子模块
    let parent = path.slice(0, -1).reduce((state, curent) => {
      return state[curent];
    }, state);
    Vue.set(parent, path[path.length - 1], rootModule.state);
  }
  let getters = rootModule._raw.getters;
  if (getters) {
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return fn(rootModule.state);
        }
      });
    });
  }
  let mutations = rootModule._raw.mutations;
  if (mutations) {
    forEach(mutations, (mutationName, fn) => {
      let arr =
        store.mutations[mutationName] || (store.mutations[mutationName] = []);
      arr.push(payload => {
        fn(rootModule.state, payload);
      });
    });
  }
  let actions = rootModule._raw.actions;
  if (actions) {
    forEach(actions, (actionName, fn) => {
      let arr = store.actions[actionName] || (store.actions[actionName] = []);
      arr.push(payload => {
        fn(store, payload);
      });
    });
  }
  forEach(rootModule._children, (moduleName, module) => {
    installModule(store, state, path.concat(moduleName), module);
  });
};
class Store {
  constructor(options) {
    // this._s = options.state;
    this._vm = new Vue({
      data: {
        state: options.state
      }
    });

    this.getters = {};
    this.mutations = {};
    this.actions = {};

    // let getters = options.getters || {};
    // forEach(getters, (getterName, fn) => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       return fn.call(this, this.state);
    //     }
    //   });
    // });
    // let mutations = options.mutations || {};
    // Object.keys(mutations).forEach(mutationName => {
    //   this.mutations[mutationName] = payload => {
    //     mutations[mutationName](this.state, payload);
    //   };
    // });
    // let actions = options.actions || {};
    // forEach(actions, (actionName, fn) => {
    //   this.actions[actionName] = payload => {
    //     fn.call(this, this, payload);
    //   };
    // });

    //收集模块
    this.modules = new ModuleCollection(options);
    // console.log(this.modules);
    installModule(this, this.state, [], this.modules.root);
    // let root = {
    //   _raw: rootModule,
    //   state: { age: 100 },
    //   _children: {
    //     a: {
    //       _raw: aModule
    //     }
    //   }
    // };
  }

  dispatch = (type, payload) => {
    this.actions[type].forEach(fn => {
      fn(payload);
    });
  };
  commit = (type, payload) => {
    // this.mutations[type](payload);
    this.mutations[type].forEach(fn => {
      fn(payload);
    });
  };
  get state() {
    return this._vm.state;
  }
}
const install = (_Vue, abc) => {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      //   console.log(this.$options.name);
      //父组建还是子组件
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store;
      } else {
        this.$store = this.$parent && this.$parent.$store;
      }
    }
  });
  //   console.log("install");
};
export default { install, Store };
