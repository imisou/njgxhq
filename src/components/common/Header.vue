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
            <el-dropdown trigger="click" @command="handleClickGotoSite">
                <span class="el-dropdown-link header-dropdown">
                    <div class="header-site ">
                        {{currentSite.siteName}}
                        <b class="caret"></b>
                    </div>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="$index" v-for="(site,$index) in siteList">
                        <a>{{site.siteName}}</a>
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
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
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
import {
    mapGetters
} from 'vuex';
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
        ...mapGetters({
            username: "header/getUsername", //用户名
            siteList: "siteList",
            "currentSite": "currentSite",
            leftbarType: "getLeftbarType",
            "username": "userName"
        })
    },
    watch: {
        "$route": "getDefaultSiteId"
    },
    mounted: function() {
        this.getDefaultSiteId();

    },
    methods: {
        getDefaultSiteId: function() {
            debugger;
            var siteId = this.$route.query.siteId;
            window.localStorage.setItem("currentSiteId", siteId);
            this.$store.commit(types.SET_HEADER_CURRENTSITEID, siteId);
            this.siteList.map(site => {
                if (site.siteId == siteId) {
                    this.$store.commit(types.SET_HEADER_CURRENTSITE, site);

                }
            })
        },
        /**
         * 点击切换站点  暂时实现
         * @param  {[type]} site [description]
         * @return {[type]}      [description]
         */
        handleClickGotoSite: function(siteIndex) {
            var site = this.siteList[siteIndex];
            window.localStorage.setItem("currentSiteId", site.siteId);

            this.$store.commit(types.SET_HEADER_CURRENTSITEID, site.siteId);
            this.$store.commit(types.SET_HEADER_CURRENTSITE, site);

            // this.$router.push({
            //     'path': "",
            //     'params': {
            //         'siteId': site.id
            //     }
            // });
            var setUrlParam = function(arg, arg_val, url) {
                if (!url) {
                    url = window.location.href;
                }
                var pattern = arg + '=([^&]*)';
                var replaceText = arg + '=' + arg_val;
                if (url.match(pattern)) {
                    var tmp = '/(' + arg + '=)([^&]*)/gi';
                    tmp = url.replace(eval(tmp), replaceText);
                    return tmp;
                } else {
                    if (url.match('[\?]')) {
                        return url + '&' + replaceText;
                    } else {
                        return url + '?' + replaceText;
                    }
                }
                return url + '\n' + arg + '\n' + arg_val;

            }
            var url = setUrlParam('siteId', site.siteId);
            window.location.href = url;
        },
        handleClickToggleMenu: function() {
            this.$store.commit(types.UPDATE_LEFTBAR_TYPE, !this.leftbarType)
        },

        /**
         * 退出操作
         * @return {[type]} [description]
         */
        handleCommand: function(command) {
            this.$confirm('是否退出本系统？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    method: "post",
                    url: "/user/destroy.do"
                }).then(resp => {
                    console.log(resp);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    components: {
        yzDropdown,
        yzDropdownItem
    }
}

</script>
<style lang="less" src="src/less/components/header.less"></style>
