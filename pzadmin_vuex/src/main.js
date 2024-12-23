import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store/index'
import PanelHead from './components/panelHead.vue'

//刷新之后动态路由添加
const localData = localStorage.getItem('pz_v3pz')
if (localData) {
  store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main', item)
  })
}
// 前置路由守卫，在每次路由跳转前执行
router.beforeEach((to, from) => {
  // 从本地存储中获取token
  const token = localStorage.getItem('pz_token');
  // 如果没有token且目标路由不是登录页面，则重定向到登录页面
  if (!token && to.path !== '/login') {
    return '/login';
  } 
  // 如果有token且目标路由是登录页面，则重定向到首页
  else if (token && to.path === '/login') {
    return '/';
  } 
  // 其他情况，允许路由跳转
  else {
    return true;
  }
});

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//全局注入组件
app.component('PanelHead', PanelHead)
//路由挂载
app.use(router)
//挂载store
app.use(store)

app.mount('#app')
