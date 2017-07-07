import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    mode: "hash",
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/home',
        component: resolve => require(['../pages/index.vue'], resolve),
        redirect:"/welcome",
        children: [{
                path: '/welcome/:id',
                component: resolve => require(['../pages/home/welcome.vue'], resolve) //欢迎页面
            }, {
                path: '/doctor',
                component: resolve => require(['../pages/DoctorManagePage.vue'], resolve)
            }, {
                path: '/log',
                component: resolve => require(['../pages/LogManagePage.vue'], resolve)
            }, {
                path: '/operator',
                component: resolve => require(['../pages/OperatorManagePage.vue'], resolve)
            }, {
                path: '/department',
                component: resolve => require(['../pages/DepartmentManagePage.vue'], resolve)
            }, {
                path: '/system',
                component: resolve => require(['../pages/SystemManagePage.vue'], resolve)
            }, {
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve) // 
            }, {
                path: '/news',
                component: resolve => require(['../pages/NewsPage.vue'], resolve) // 栏目管理
            }, {
                path: '/building',
                component: resolve => require(['../pages/floorManagePage.vue'], resolve) // 楼层管理
            }, {
                path: '/symptom',
                component: resolve => require(['../pages/symptomPage.vue'], resolve) // 症状管理
            }, {
                path: "/priv",
                component: resolve => require(['../pages/PrivManagePage.vue'], resolve) // 权限管理
            }, {
                path: "/role",
                component: resolve => require(['../pages/roleManagePage.vue'], resolve) // 权限管理
            }

        ]
    }, {
        path: '/login',
        component: resolve => require(['../pages/loginPage.vue'], resolve)
    }, ]
});


export default router;