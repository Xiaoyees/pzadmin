import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import api from './api/index'

const app = createApp(App)
//在实例上绑定属性
app.config.globalProperties.$api = api

router.beforeEach((to, from) => {
  // 在每次路由切换前进行拦截检查
  if (to.path !== '/login') { // 如果目标路径不是登录页面
    if (!localStorage.getItem('h5_token')) { // 检查本地存储中是否存在 'h5_token'
      return '/login'; // 如果不存在 token，重定向到登录页面
    }
  }
});

//路由挂载
app.use(router)
app.mount('#app')
