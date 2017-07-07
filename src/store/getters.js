export default {
    projectName: (state)=>{
        return state.projectName
    },
    /**
     * 获取 首页 医院简介页面地址
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    hospitalLink:(state)=>{
        return state.hospitalLink
    },

    siteList:(state) =>{
        
        return state.siteData;
    
    },

    currentSite:(state)=>{
        
        return state.currentSite;
    },

    getLeftbarType: (state)=>{
        return state.leftbar.type;
    }
}