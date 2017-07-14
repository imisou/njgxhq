<template>
    <div class="panel " >
        <div class="panel-heading panel-default">
            <span class="panel-title">角色管理</span>
        </div>
        <div class="panel-body">
            <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="角色名称：">
                        <el-input v-model="queryRoleName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadRoleInfo">查询</el-button>
                         <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button>
                        <el-button type="success" icon="plus" @click="addRoleHandler">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <div class="wraplist">
                <el-table :data="roleList" border style="width: 100%">
                    <el-table-column label="角色名称" width="200">
                        <template scope="scope">
                            <span>{{ scope.row.roleName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="角色描述">
                        <template scope="scope">
                            <span>{{ scope.row.roleDesc }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="权限">
                        <template scope="scope">
                            <span>{{ scope.row.privName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300">
                        <template scope="scope">
                            <el-button size="small" @click="modifyRoleHandler(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="deleteRoleHandler(scope.row.roleId)">删除</el-button>
                            <el-button size="small" @click="manageRoleHandler(scope.row.roleId)">修改权限</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="录入角色" v-model="role.showRoleForm" size="tiny">
                    <el-form :model="role.roleForm" :rules="role.rules" ref="validateroleForm" label-width="100px" class="demo-roleForm">
                        <el-form-item label="角色名称：" prop="roleName">
                            <el-input type="text" v-model="role.roleForm.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述：" prop="roleDesc">
                            <el-input type="textarea" :rows="3" v-model="role.roleForm.roleDesc"></el-input>
                        </el-form-item>
                        <el-form-item label="权限设置：" prop="priv" required>
                            <el-select v-model="role.roleForm.priv" multiple placeholder="请选择" style="width: 200px;">
                                <el-option v-for="item in roleOptions" :label="item.privilegeName" :value="item.privilegeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="role.showRoleForm = false">取 消</el-button>
                        <el-button type="primary" @click="submitRoleForm()">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="修改角色" v-model="modifyrole.showRoleForm" size="tiny">
                    <el-form :model="modifyrole.roleForm" :rules="modifyrole.rules" ref="validateModifyForm" label-width="100px" class="demo-roleForm">
                        <el-form-item label="角色名称：" prop="roleName">
                            <el-input type="text" v-model="modifyrole.roleForm.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述：" prop="roleDesc">
                            <el-input type="textarea" :rows="3" v-model="modifyrole.roleForm.roleDesc"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="modifyrole.showRoleForm = false">取 消</el-button>
                        <el-button type="primary" @click="submitModifyRoleHandler()">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="权限管理" v-model="roleManage.showRoleForm" size="tiny">
                    <el-checkbox-group v-model="roleManage.checkList">
                        <el-checkbox v-for="item in roleOptions" :label="item.privilegeId">{{item.privilegeName}}</el-checkbox>
                    </el-checkbox-group>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="roleManage.showRoleForm = false">取 消</el-button>
                        <el-button type="primary" @click="submitRoleManageHandler()">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from "vuex"
import * as util from '../../util/common.js'
export default {
    name: "roleManage",
    data() {
        var checkPriv = (rule, value, callback) => {
            if (value.length == 0) {
                return callback(new Error('权限不能为空'));
            } else {
                callback();
            }
        };
        return {
            roleList: [],
            roleOptions: [],
            queryRoleName: undefined,
            role: {
                openNum: 0,
                showRoleForm: false,
                roleForm: {
                    roleName: "",
                    roleDesc: "",
                    priv: []
                },
                rules: {
                    roleName: [{
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }],
                    roleDesc: [{
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    }],
                    priv: [{
                        validator: checkPriv,
                        trigger: 'change'
                    }]
                }
            },
            modifyrole: {
                openNum: 0,
                showRoleForm: false,
                roleForm: {
                    roleName: "",
                    roleDesc: "",
                    roleId: ""
                },
                rules: {
                    roleName: [{
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }],
                    roleDesc: [{
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    }],
                    priv: []
                }
            },
            roleManage: {
                showRoleForm: false,
                checkList: [],
                roleId: ""
            }
        }
    },
    computed:{
        ...mapGetters({
            "site": "currentSite"
        })
    },
    watch:{
        "site.siteId":function(){
            this.loadRoleInfo();
        }
    },
    created: function() {
        this.loadRoleInfo(undefined);
        this.loadAllPrivList();
    },
    methods: {
        /**
         * 加载角色列表信息
         * @param  {[type]} currentPage [description]
         * @return {[type]}             [description]
         */
        loadRoleInfo: function(currentPage) {
            var _this = this;
            var obj={roleName: _this.queryRoleName ? _this.queryRoleName : undefined};
            $.ajax({
                url:util.consoleApi +"/role/query_Role.do",
                type:"post",
                data:obj,
                success:function(resp){
                    if(resp.respCode=="0"){
                        _this.roleList = resp.result;
                    } else {
                        _this.$message({
                            message: '查询角色信息失败！',
                            type: 'error'
                        });
                    }
                },
                error: function() {
                    console.log("角色信息查询服务请求失败!");
                }
            })
        },
        /**
         * 加载权限列表
         * @return {[type]} [description]
         */
        loadAllPrivList: function() {
            var _this = this;
            this.$fetch("/privilege/all_privilege.do").then(function (resp){
                console.log('allpriv',resp);
                if (resp.respCode != "0") {
                    _this.$message({
                        message: '查询所有权限失败:' + resp.data.respMsg,
                        type: 'error'
                    });
                    return;
                }
                console.log(resp.result);
                var length = resp.result.length;
                _this.roleOptions = resp.result;
            });
        },
        /**
         * 显示录入角色
         */
        addRoleHandler: function() {
            var _this = this;
            this.role.openNum += 1;
            //清除校验与初始化
            this.$nextTick(function() {
                _this.role.roleForm = {
                    roleName: "",
                    roleDesc: "",
                    priv: []
                }
                if (_this.role.openNum > 1) {
                    _this.$refs['validateroleForm'].resetFields();
                }
                //
            });
            this.role.showRoleForm = true;
        },
        /**
         * 提交添加角色数据
         * @return {[type]} [description]
         */
        submitRoleForm: function() {
            var _this = this;
            var addRole = function() {
                var obj = {
                    roleName: _this.role.roleForm.roleName,
                    roleDesc: _this.role.roleForm.roleDesc,
                    priv: _this.role.roleForm.priv
                }
                _this.$fetch("/role/add_Role.do",JSON.stringify(obj)).then(function (resp){
                    if (resp.respCode == "0") {
                        _this.$message({
                            message: '角色添加成功。',
                            type: 'success'
                        });
                        _this.loadRoleInfo();
                        _this.role.showRoleForm = false;
                    } else {
                        _this.$message({
                            message: '角色录入失败。',
                            type: 'error'
                        });
                    }
                });
            }

            this.$refs['validateroleForm'].validate((valid) => {
                if (valid) {
                    addRole();
                } else {

                    return false;
                }
            });
        },
        /**
         * 删除角色操作
         * @param  {[type]} roleId [description]
         * @return {[type]}        [description]
         */
        deleteRoleHandler: function(roleId) {
            var _this = this;
            var obj={roleId: roleId};
            console.log(obj);

            this.$confirm('确认删除该角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    url: util.consoleApi + "/role/delete_Role.do",
                    type: "post",
                    data: {
                        roleId: roleId
                    },
                    success: function(resp) {
                        if (resp.respCode == "0") {
                            _this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _this.loadRoleInfo();
                        }else{
                            _this.$message.error('删除失败!')
                        }
                    },
                    error: function() {
                        console.log("角色删除失败!");
                    }
                })
            })
        },
        /**
         * 显示修改角色信息页面
         * @param  {[type]} role [description]
         * @return {[type]}      [description]
         */
        modifyRoleHandler: function(role) {
            var _this = this;
            var obj=role.roleId;
            console.log(obj);
            //this.modifyrole.roleForm.roleId = role.roleId;
            this.modifyrole.openNum += 1;
            $.ajax({
                url: util.consoleApi + "/role/query_RolePriv.do",
                type: "post",
                data: {
                    roleId: role.roleId
                },
                success: function(resp) {
                    if (resp.respCode == "0") {

                        _this.modifyrole.showRoleForm = true;
                        _this.$nextTick(function() {
                            _this.modifyrole.roleForm = {
                                roleName: resp.result.roleName,
                                roleDesc: resp.result.roleDesc,
                                roleId: role.roleId
                            }
                            if (_this.modifyrole.openNum > 1) {
                                _this.$refs['validateModifyForm'].resetFields();
                            }
                            //_this.$refs['validateModifyForm'].resetFields();
                        })
                    } else {
                        _this.$message({
                            message: '查询角色信息失败！',
                            type: 'error'
                        });
                    }
                },
                error: function() {
                    console.log("角色信息查询服务请求失败!");
                }
            });
        },
        /**
         * 提交修改角色信息
         * @return {[type]} [description]
         */
        submitModifyRoleHandler: function() {
            var _this = this;
            var modifyRole = function() {
                var obj = {
                    roleName: _this.modifyrole.roleForm.roleName,
                    roleDesc: _this.modifyrole.roleForm.roleDesc,
                    roleId: _this.modifyrole.roleForm.roleId
                }
                _this.$fetch("/role/update_Role.do",JSON.stringify(obj)).then(function (resp){
                    if (resp.respCode == "0") {
                        _this.$message({
                            message: '角色更新成功。',
                            type: 'success'
                        });
                        _this.loadRoleInfo();
                        _this.modifyrole.showRoleForm = false;
                    } else {
                        _this.$message({
                            message: '角色更新失败。',
                            type: 'error'
                        });
                    }
                })
            }

            this.$refs['validateModifyForm'].validate((valid) => {
                if (valid) {
                    modifyRole();
                } else {

                    return false;
                }
            });
        },
        /**
         * 显示权限管理页面
         * @param  {[type]} roleId [description]
         * @return {[type]}        [description]
         */
        manageRoleHandler: function(roleId) {
            var _this = this;
            $.ajax({
                url: util.consoleApi + "/role/query_RolePriv.do",
                type: "post",
                data: {
                    roleId: roleId
                },
                success: function(resp) {
                    if (resp.respCode == "0") {
                        _this.roleManage.checkList = resp.result.priv;
                        _this.roleManage.roleId = roleId;
                        _this.roleManage.showRoleForm = true;
                    } else {
                        _this.$message({
                            message: '角色更新失败。',
                            type: 'error'
                        });
                    }
                },
                error: function() {
                    console.log("角色信息查询服务请求失败!");
                }
            });
        },
        /**
         * 提交权限修改
         * @return {[type]} [description]
         */
        submitRoleManageHandler: function() {
            var _this = this;
            var obj = {}
            obj.roleId = this.roleManage.roleId;
            obj.priv = this.roleManage.checkList;
            _this.$fetch("/role/priv_Mannager.do",JSON.stringify(obj)).then(function(resp){
                if (resp.respCode == "0") {
                    _this.$message({
                        message: '权限更新成功。',
                        type: 'success'
                    });
                    _this.loadRoleInfo();
                    _this.roleManage.showRoleForm = false;
                } else {
                    _this.$message({
                        message: '权限更改失败',
                        type: 'error'
                    });

                }
            })
        },
        /**
         * 查询操作
         * @return {[type]} [description]
         */
        queryRoleHandler: function() {
            /*if(!this.queryRoleName){
                this.loadRoleInfo(undefined);
            }else{
                this.loadRoleInfo(undefined);
            }*/
            this.loadRoleInfo();
        },

        /**
         * 重置 查询
         * @return {[type]} [description]
         */
        handleResetPrivQueryForm:function() {
            this.queryRoleName = "";
            this.loadRoleInfo();
        }
    }
}
</script>
<style>
    .xs-role .el-checkbox{
        margin-top: 5px;
        margin-left: 15px;
    }
</style>
