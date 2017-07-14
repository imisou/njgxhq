import * as types from "./mutation_type.js"
import router from "../router/index.js"

export default {
    /**
     * 设置当前站点List数据
     */
    [types.SET_SITE_LIST](state,payload){
       window.localStorage.setItem("siteList",  JSON.stringify(payload));
        state.siteData = payload;
    },
    /**
     * 更改 当前的 站点信息
     */
    [types.SET_HEADER_CURRENTSITE](state,payload){
        window.localStorage.setItem("currentSite",  JSON.stringify(payload));
        state.currentSite = payload;
    },

    /**
     * 更新当前选中的站点ID
     */
    [types.SET_HEADER_CURRENTSITEID](state,payload){
        // console.log("$router",payload);
        console.log('SET_HEADER_CURRENTSITEID',payload);
        window.localStorage.setItem("currentSiteId", JSON.stringify(payload));
        state.currentSiteId = payload;

    },
    /**
     * 更改当前侧边栏的模式
     */
    [types.UPDATE_LEFTBAR_TYPE](state,payload){
        state.leftbar.type = payload;
    },
    
}