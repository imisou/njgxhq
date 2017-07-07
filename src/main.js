import Vue from 'vue';
import App from './App';

//路由配置
import router from './router';

//vuex配置文件
import store from "./store"

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
});

/*
    axios 的配置
 */
import { $http, $fetch } from "./util/axios.js";
console.log($http);
Vue.prototype.$http = $http;
Vue.prototype.$fetch = $fetch;


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
