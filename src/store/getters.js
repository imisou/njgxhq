export default {
    projectName: (state)=>{
        return state.projectName
    },

    userName:(state) => {
        return $.cookie('userName');
    },

    userType:(state) => {
        return $.cookie('userType');
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
        if(state.siteData.length === 0){
            let siteList = window.localStorage.getItem("siteList");
            return JSON.parse(siteList);
        }
        return state.siteData;
    
    },

    currentSite:(state)=>{
        if(!state.currentSite){
            let currentSite = window.localStorage.getItem("currentSite");
            return JSON.parse(currentSite);
        }
        return state.currentSite;
    },

    getLeftbarType: (state)=>{
        return state.leftbar.type;
    }
}