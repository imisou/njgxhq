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
                path: '/welcome',//欢迎页面
                component: resolve => require(['../pages/home/welcome.vue'], resolve)
            }, {
                path: '/site',  //站点管理
                component: resolve => require(['../pages/home/siteManagePage.vue'], resolve)
            },{
                path: '/column',// 栏目管理
                component: resolve => require(['../pages/home/ColumnManagePage.vue'], resolve)
            }, {
                path: '/article',// 文章管理
                component: resolve => require(['../pages/home/ArticleManagePage.vue'], resolve),
                
            }, {
                path: '/operator',//用户管理
                component: resolve => require(['../pages/OperatorManagePage.vue'], resolve)
            }, {
                path: "/priv",// 权限管理
                component: resolve => require(['../pages/home/PrivManagePage.vue'], resolve)
            }, {
                path: "/role",// 角色管理
                component: resolve => require(['../pages/home/roleManagePage.vue'], resolve)
            },{
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve) //
            }, {
                path: '/log',
                component: resolve => require(['../pages/LogManagePage.vue'], resolve)
            }

        ]
    }, {
        path: '/login',
        component: resolve => require(['../pages/loginPage.vue'], resolve)
    }, ]
});


export default router;
