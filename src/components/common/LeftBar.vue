<template>
    <div class="m-leftbar">
        <div class="leftbar-header">
            <ul class="nav">
                <!-- <li>
                    <a class="leftbar-header__a">
                        <i class="icon iconfont icon-cebianlankongzhi"></i>
                    </a>
                </li>
                <li>
                    <a class="leftbar-header__a">
                        <i class="icon iconfont icon-cebianlankongzhi"></i>
                    </a>
                </li> -->
            </ul>
        </div>
        <div class="leftbar-menu" style="width: 100%;position: relative;">
            <yz-menu>
                <yz-menu-item name="1" >
                    <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                    <span>站点管理</span>
                </yz-menu-item>
                <yz-menu-item name="1" >
                    <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                    <span>栏目管理</span>
                </yz-menu-item>
                <yz-menu-item name="1" >
                    <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                    <span>章节管理</span>
                </yz-menu-item>
                <yz-menu-item name="1" >
                    <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                    <span>用户管理</span>
                </yz-menu-item>
                <yz-menu-item name="1" >
                    <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                    <span>权限管理</span>
                </yz-menu-item>
                <yz-menu-item name="1" >
                    <i class="leftbar-menu__icon icon iconfont icon-cebianlankongzhi"></i>
                    <span>角色管理</span>
                </yz-menu-item>
                

            </yz-menu>
        </div>
    </div>
</template>
<script>
    export default{
        name:"leftbar",
        data(){
            return{

            }
        }
    }
</script>
<style lang="less" src="src/less/components/leftbar.less"></style>