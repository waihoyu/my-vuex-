import Vue from "vue";
import Router from "./index2";
import HelloWorld from "@/components/HelloWorld";
import Home from "@/components/Home";
import About from "@/components/About";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/home",
      name: "HelloWorld",
      component: Home
    },
    {
      path: "/about",
      name: "About",
      component: About
    }
  ]
});
