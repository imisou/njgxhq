import * as util from '../util/common.js'
import NProgress from 'nprogress'
import router from "./routerConfig.js"

router.beforeEach(function(to, from, next, transition) {
    if (to.fullPath == '/login') {
        next()
    } else {
        NProgress.start();
        var _this = this;

        /*
            登录校验
         */
        // if($.cookie('sid') && $.cookie('sid') != 'null'){
        //     next();
        // }else{
        //     next('/login');
        // }
        next();
        
        /*
            页面访问权限校验
         */
        // $.ajax({    
        //     url: util.userApi + "/select_user_menuitem.do",
        //     type: "post",
        //     dataType: "json",
        //     // 获取服务器返回的json结果
        //     success: function(Resp) {
        //         if(Resp.respCode !== "0" || Resp.result == null){
        //             console.log("查询角色信息服务请求出错");
        //             return;
        //         }

        //         var result = Resp.result;
        //         if(result.indexOf(to.fullPath.substring(1)) !== -1){
        //             next();
        //         }else{
        //             next('/welcome');
        //         }
        //     },
        //     error: function() {
        //         console.log("查询角色信息服务请求出错");
        //     }
        // });
    }
});

router.afterEach(transition => {
    NProgress.done();
    NProgress.remove();
});

export default router
