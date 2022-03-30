import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from "./store";
import router from './router'
import vant from 'vant';
import 'vant/lib/index.css';


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(vant);

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next()
});
  
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


/* 包含内容
* vant 全局引用
* router 路由引入
* vuex-store 按照模块化存储
* util/request 请求/响应封装
* sass/scss
* vue.config.js请求代理
* */
