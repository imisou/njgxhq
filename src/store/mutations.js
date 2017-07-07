import * as types from "./mutation_type.js"
import router from "../router/index.js"

export default {
    [types.SET_SITE_LIST](state,payload){
        state.siteData = payload;
    },
    
    [types.SET_HEADER_CURRENTSITE](state,payload){
        console.log("$router",payload);
        state.currentSite = payload;
    },
    
    /**
     * 更改当前侧边栏的模式
     */
    [types.UPDATE_LEFTBAR_TYPE](state,payload){
        state.leftbar.type = payload;
    },
    
}