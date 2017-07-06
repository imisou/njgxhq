<template>
    <div class="yz-header">
        <a class="logo">
            <i class="icon iconfont icon-logo" style="font-size:21px;"></i>
            <span>微信挂号</span>
        </a>
    
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
                <span class="el-dropdown-link">
                    <div class="user-info__img">
                        <img class="user-logo" src="../../../static/img/img.jpg">
                    </div>
                    <div class="user-info__link">
                        <span>{{username}}</span>
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
            // let username = decodeURI($.cookie('userName'));
            let username = "测试"
            console.log(username)
            return username ? username : this.name;
        },
        ...mapGetters({
            username:"header/getUsername",  //用户名
            siteList:"siteList"
        })
    },
    created:function(){
        this.getSite();
    },
    methods: {
        getSite:function(){
            this.$store.dispatch('setSite');
            
            console.log('getSite',this.siteList);
        },
        handleCommand: function(command) {
            
        }
    },
    components: {
        yzDropdown,
        yzDropdownItem
    }
}
</script>
<style lang="less" src="src/less/components/header.less"></style>
