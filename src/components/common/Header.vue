<template>
    <div class="yz-header">
        <ul class="pull-left nav">
            <li>
                <a class="header-a" @click.stop="handleClickToggleMenu">
                    <i class="icon iconfont" :class="[leftbarType ? 'icon-indent':'icon-dedent']"></i>
                </a>
            </li>
        </ul>
        <div class="pull-left">
            <span class="cf6 font14">
                {{time | formDate('yyyy年MM月dd日')}}
            </span>
            <span class="cf6 font14 ml10">
                {{time | formDateToWeek('')}}
            </span>
        </div>
        <div class="user-info pull-right">

            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link header-dropdown">
                    <div class="header-site ">
                        {{currentSite.siteName}}
                        <b class="caret"></b>
                    </div>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout" v-for="site in siteList">
                        <a @click="handleClickGotoSite(site)">{{site.siteName}}</a>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link header-dropdown">
                    <div class="user-info__img">
                        <img class="user-logo" src="../../../static/img/img.jpg">
                    </div>
                    <div class="user-info__link">
                        <span>{{username}}</span>
                        <b class="caret"></b>
                    </div>
                    <!-- 
                     -->
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">
                        <i class="icon iconfont icon-tuichu"></i><span>退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import yzDropdown from "./Dropdown.vue"
import yzDropdownItem from "./DropdownItem.vue"
import * as util from '../../util/common.js'
import { mapGetters } from 'vuex'
import * as types from "../../store/mutation_type.js"

export default {
    data: function() {
        return {
            name: '测试',
            close: false,
            time: new Date()
        }
    },
    computed: {
        username:function() {
            let username = "测试"
            return username ? username : this.name;
        },
        ...mapGetters({
            username:"header/getUsername",  //用户名
            siteList:"siteList",
            "currentSite":"currentSite",
            leftbarType:"getLeftbarType"
        })
    },
    created:function(){
        this.$store.dispatch('setSite',this.$route.params.id);
        
    },
    methods: {

        handleCommand: function(command) {
            
        },

        /**
         * 点击切换站点  暂时实现
         * @param  {[type]} site [description]
         * @return {[type]}      [description]
         */
        handleClickGotoSite:function(site){

            this.$router.push({path:this.$route.matched[0].redirect+"/"+site.id});
//            console.log(this.$route.matched[0].redirect+"/"+site.id)
        },
        handleClickToggleMenu:function(){
            this.$store.commit(types.UPDATE_LEFTBAR_TYPE,!this.leftbarType)
        }
    },
    components: {
        yzDropdown,
        yzDropdownItem
    },
    watch:{
        
    }
}
</script>
<style lang="less" src="src/less/components/header.less"></style>
