import Vue from 'vue';
import App from './App';

//路由配置
import router from './router';

//vuex配置文件
import store from "./store"

import axios from 'axios';

//elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css'; // 默认主题
Vue.use(ElementUI);

//自定义插件
import YzView from "./directives/index.js"
Vue.use(YzView);

import "babel-polyfill";

import 'nprogress/nprogress.css' //这个样式必须引入

import VueQuillEditor from 'vue-quill-editor'
// use
Vue.use(VueQuillEditor)

/**
 * 定制的公共过滤器
 */
import hospitalFilter from './util/filter.js'
Vue.use(hospitalFilter);

var clickoutside = Vue.directive('clickoutside', {
    bind(el, binding, vnode) {
        function documentHandler(e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {

    },
    unbind(el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
})

//axios 基本配置
let $http = axios.create({
    baseURL: 'http://localhost:8080',

})

$http.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    console.log('请求数据',config)
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
$http.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    return response;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

Vue.prototype.$http = $http;

import Mock from "./mock";

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
