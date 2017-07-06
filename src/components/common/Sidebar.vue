<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <el-menu-item index="doctor" v-if="menuList.indexOf('doctor') != -1">
                <i class="icon iconfont icon-yishengguanli"></i>医生管理
            </el-menu-item>
            <el-menu-item index="log" v-if="menuList.indexOf('log') != -1">
                <i class="icon iconfont icon-rizhiguanli"></i>操作日志
            </el-menu-item>
            <el-menu-item index="department" v-if="menuList.indexOf('department') != -1">
                <i class="icon iconfont icon-keshiguanli"></i>科室管理
            </el-menu-item>
            <el-menu-item index="news" v-if="menuList.indexOf('news') != -1">
                <i class="icon iconfont icon-lanmuguanli"></i>栏目管理
            </el-menu-item>

            <el-menu-item index="symptom" v-if="menuList.indexOf('symptom') != -1">
                <i class="icon iconfont icon-quanshen_iconx-copy"></i>症状管理
            </el-menu-item>
            <el-menu-item index="operator" v-if="menuList.indexOf('operator') != -1">
                <i class="icon iconfont icon-caozuoyuanguanli"></i>用户管理
            </el-menu-item>
            <el-menu-item index="priv" v-if="menuList.indexOf('priv') != -1"><i class="icon iconfont icon-caozuoyuanguanli"></i>权限管理</el-menu-item>
            <el-menu-item index="role" v-if="menuList.indexOf('role') != -1"><i class="icon iconfont icon-caozuoyuanguanli"></i>角色管理</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
import * as util from '../../util/common.js'
export default {
    name: "Sidebar",
    data() {
        return {
            menuList: ['news']
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created: function() {
        this.loadMenuList();
    },
    methods: {
        loadMenuList: function() {
            var _this = this;
            $.ajax({
                url: util.userApi + "/select_user_menuitem.do",
                type: "post",
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(Resp) {
                    if(Resp.respCode !== '0'){
                        _this.$message({
                            message:"查询菜单权限出错，原因："+Resp.respMsg,
                            type:"error"
                        });
                        return;
                    }
                    _this.menuList = Resp.result?Resp.result:[];
                },
                error: function() {
                    console.log("查询角色信息服务请求出错");
                }
            });
        }
    }
}
</script>
<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 170px;
    left: 0;
    top: 50px;
    bottom: 0;
    background: #2E363F;
}

.sidebar > ul {
    height: 100%;
}

.sidebar>.el-menu>.el-menu-item,
.el-submenu .el-submenu__title {
    padding-left: 20px !important;
}

.el-menu .el-menu-item.is-active,
.el-menu .el-menu-item:hover {
    border-right: 4px solid #20a0ff;
}

.sidebar i {
    font-size: 20px;
    margin: 0 10px;
}
</style>
