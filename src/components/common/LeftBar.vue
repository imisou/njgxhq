<template>
    <div class="wrapper-leftbar" :class="{'is-mini':leftbartype}">
        <div class="m-leftbar">
            <div class="leftbar-header">
                <a class="leftbar-header__a leftbar_logo">
                    <i class="icon iconfont icon-logo" style="font-size:21px;"></i>
                    <span>高校后勤</span>
                </a>
            </div>
            <div class="leftbar-menu" style="width: 100%;position: relative;">
                <yz-menu :mini="leftbartype">
                    <yz-menu-item name="1" :route="routeSite" v-if="menuList.indexOf('/site') != -1">
                        <i class="leftbar-menu__icon icon iconfont icon-zhandianguanli"></i>
                        <span>站点管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="2" :route="routeColumn" v-if="menuList.indexOf('/column') != -1">
                        <i class="leftbar-menu__icon icon iconfont icon-lanmuguanli"></i>
                        <span>栏目管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="3" :route="routeArticle" v-if="menuList.indexOf('/article') != -1">
                        <i class="leftbar-menu__icon icon iconfont icon-guanliwenzhang"></i>
                        <span>章节管理</span>
                    </yz-menu-item>
                    <!-- <yz-submenu :mode="leftbartype">
                        <template slot="title">
                            <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                            <span>系统管理 </span>
                        </template> -->
                    <yz-menu-item name="4" :route="routeOperator" v-if="menuList.indexOf('/operator') != -1">
                        <i class="leftbar-menu__icon icon iconfont icon-yonghuguanli"></i>
                        <span>用户管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="5" :route="routePriv" v-if="menuList.indexOf('/priv') != -1">
                        <i class="leftbar-menu__icon icon iconfont icon-quanxianguanli"></i>
                        <span>权限管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="6" :route="routeRole" v-if="menuList.indexOf('/role') != -1">
                        <i class="leftbar-menu__icon icon iconfont icon-jiaoseguanli"></i>
                        <span>角色管理</span>
                    </yz-menu-item>
                    <!-- </yz-submenu> -->
                </yz-menu>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from "vuex"
export default {
    name: "leftbar",
    data() {
        return {
            menuList:[],
            routeSite:"",
            routeColumn:"",
            routeArticle:"",
            routeOperator:"",
            routePriv:"",
            routeRole:""
        }
    },
    computed: {
        ...mapGetters({
            'leftbartype': "getLeftbarType",
            "site": "currentSite"
        })
    },
    watch:{
        "site.siteId":function(){
            this.setRouteWithSIteId();
        }
    },
    created(){
        this.getCurrentMenus();
        this.setRouteWithSIteId();
    },
    methods:{
        setRouteWithSIteId:function(){
            let _this=this;
            _this.routeSite="/site?siteId="+_this.site.siteId;
            _this.routeColumn="/column?siteId="+_this.site.siteId;
            _this.routeArticle="/article?siteId="+_this.site.siteId;
            _this.routeOperator="/operator?siteId="+_this.site.siteId;
            _this.routePriv="/priv?siteId="+_this.site.siteId;
            _this. routeRole="role?siteId="+_this.site.siteId
        },
        getCurrentMenus:function(){
            let _this=this;
            var list=[];
            _this.$fetch("/privilege/user_menuitem.do").then(resp =>{
                console.log('getCurrentMenus',resp);
                resp.result.map(function(val){
                    list.push(val.itemUrl);
                })
                _this.menuList=list;
            })
        }
    }
}
</script>
<style lang="less" src="src/less/components/leftbar.less"></style>
