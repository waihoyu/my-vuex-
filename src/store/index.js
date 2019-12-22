import Vue from "vue";
import Vuex from "./vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    a: {
      state: {
        x: 1,
        age: 88
      },
      mutations: {
        syncAdd(state, paylaod) {
          console.log("a-module");
        },
        syncchildrenX(state, paylaod) {
          state.x = 999;
        }
      },
      modules: {
        aa: {
          state: {
            xaa: 11,
            age: 99
          }
        }
      }
    },
    b: {
      state: {
        y: 2,
        age: 77
      }
    }
  },
  state: {
    age: 10
  },
  getters: {
    myAge(state) {
      return state.age + 10;
    }
  },
  mutations: {
    syncAdd(state, payload) {
      console.log(payload);
      state.age += payload;
    },
    syncMinus(state, payload) {
      state.age -= payload;
    }
  },
  actions: {
    asyncMinus({ commit, dispatch }, payload) {
      setTimeout(() => {
        commit("syncMinus", payload);
      }, 2000);
    }
  }
});
// namespace
//registerModule
//store.subscribe(handler)// 中间件
