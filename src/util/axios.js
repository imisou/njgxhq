import axios from "axios"
import Vue from "vue"
import qs from 'qs'


//axios 基本配置
const $http = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
})

$http.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
$http.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    if (response.status !== 200 ) {
        return Promise.reject(response);
    }
    return response;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

const $fetch = function(url, params) {
    return new Promise((resolve, reject) => {
        $http.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//axios mock数据配置文件
import Mock from "../mock";

export { $http, $fetch };
