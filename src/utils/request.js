// axios封装
// 请求拦截、相应拦截、错误统一处理
import axios from 'axios';
// import QS from 'qs';
import {Dialog} from 'vant';
import {getAuth} from '../api/login'
import { _ } from "@/utils/common";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 请求超时时间
axios.defaults.timeout = 10000;


// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token =  _.getCookie('Access-Token');
    token && (config.headers['Access-Token'] = token);
    return config;
  },
  error => {
    return Promise.error(error);
  })


// 响应拦截器
axios.interceptors.response.use(
  response => {
    return new Promise((resolve, reject) => {
       let data = response.data;
       switch (data.code) {
          case 200:
            resolve(response.data)
            break;
          case 401:
            setToken();
            break;
          default:
            Dialog.alert({
              title: '提示',
              message: data.msg,
            }).then(() => {
              // on close
            });
            break;
       }
    });
  },error => {
    console.log(error)
  }
)


function setToken(){
  getAuth().then((res) => {
    let url = location.protocol + '//' + location.host +'/wealth/'
    let data = res.data.replace(/REDIRECTURI/g , encodeURIComponent(url))
    window.location.href =  data
  })
}

export {axios as request}
