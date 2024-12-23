import axios from 'axios'

const http = axios.create({
  baseURL: 'https:/v3pz.itndedu.com/v3pz',
  timeout: 10000,
  headers: {
    'terminal': 'h5'
  }
})

//添加拦截器
http.interceptors.request.use(config => {
  //在发送请求之前做些什么
  const token = localStorage.getItem('h5_token')
  //不需要添加token的api
  const whiteUrl = ['/login']
  if (token && !whiteUrl.includes(config.url)) {
    config.headers['h-token'] = token
  }
  return config;
}, error => {
  //对请求错误做些什么
  return Promise.reject(error);
})

//添加响应拦截器
http.interceptors.response.use(response => {
  //对响应数据做些什么
  if (response.data.code === -1) {

  }
  if (response.data.code === -2) {
    localStorage.removeItem('h5_token')
    localStorage.removeItem('h5_userInfo')
    window.location.href = window.location.origin

  }
  return response;
}, error => {
  //对响应错误做些什么
  return Promise.reject(error);
})

export default http