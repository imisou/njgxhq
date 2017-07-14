// console.log('THIS IS ' + process.env.PROJECT_ENV);

// var projectEnv =  process.env.PROJECT_ENV;

const common = {

}
const states = {
    projectName: "南京高校后勤管理系统",
    hospitalLink: "https://mp.weixin.qq.com/s/IQm05hmmic9CsYw6CITuCg",
    siteData:[],   //站点list数据
    currentSiteId:"1",
    currentSite:{
        siteId:1
    },
    leftbar:{
        type:true,    //当前侧边栏的模式     
    }
}

export default Object.assign(common, states);
