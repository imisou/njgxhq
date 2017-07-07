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
                    <yz-menu-item name="1">
                        <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                        <span>站点管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="1">
                        <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                        <span>栏目管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="1">
                        <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                        <span>章节管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="1">
                        <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                        <span>用户管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="1">
                        <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                        <span>权限管理</span>
                    </yz-menu-item>
                    <yz-menu-item name="1">
                        <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                        <span>角色管理</span>
                    </yz-menu-item>
                    <yz-submenu :mode="leftbartype">
                        <template slot="title">
                            <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                            <span>ceshi </span>
                        </template>
                        <yz-menu-item name="1">
                            <span>角色管理</span>
                        </yz-menu-item>
                        <yz-menu-item name="1-1">
                            <span>角色管理</span>
                        </yz-menu-item>
                    </yz-submenu>
                    <yz-submenu :mode="leftbartype">
                        <template slot="title">
                            <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                            <span>ceshi </span>
                        </template>
                        <yz-menu-item name="2-1">
                            <span>角色管理</span>
                        </yz-menu-item>
                        <yz-menu-item name="2-2">
                            <span>角色管理</span>
                        </yz-menu-item>
                    </yz-submenu>
                </yz-menu>
            </div>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from "vuex"
export default {
    name: "leftbar",
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
            'leftbartype': "getLeftbarType"
        })
    }
}
</script>
<style lang="less" src="src/less/components/leftbar.less"></style>
