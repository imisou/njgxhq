<template>
    <div class="panel xs-role" >
        <div class="panel-heading">
            角色管理
        </div>
        <div class="panel-body">
            <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="角色名称：">
                        <el-input v-model="queryRoleName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadRoleInfo">查询</el-button>
                        <!-- <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button> -->
                        <el-button type="success" icon="plus" @click="addRoleHandler">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </div>
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
import * as util from '../util/common.js'
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
            $.ajax({
                url: util.userApi + "/query_Role.do",
                type: "post",
                data: {
                    "roleName": _this.queryRoleName ? _this.queryRoleName : undefined
                },
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(Resp) {
                    _this.roleList = Resp.result;
                },
                error: function() {
                    console.log("查询角色信息服务请求出错");
                }
            });
        },
        /**
         * 加载权限列表
         * @return {[type]} [description]
         */
        loadAllPrivList: function() {
            var _this = this;
            $.ajax({
                url: util.userApi + '/privilege.do',
                type: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function(resp) {
                    if (resp.respCode == 0) {
                        var length = resp.result.length;

                        _this.roleOptions = resp.result;

                    } else {
                        layer.alert("权限列表加载失败!");
                    }
                },
                error: function() {
                    console.log("权限列表加载服务请求出错！");
                }
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
                $.ajax({
                    url: util.userApi + "/add_Role.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify(obj),
                    async: false,
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(Resp) {
                        if (Resp.respCode == "0") {
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
                    },
                    error: function() {
                        console.log("录入角色信息服务请求出错！");
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
            layer.confirm('确认删除?', function(layerIndex) {
                $.ajax({
                    url: util.userApi + "/delete_Role.do",
                    type: "post",
                    data: {
                        "roleId": roleId
                    },
                    dataType: "json",
                    success: function(Resp) {
                        if (Resp.respCode == "0") {
                            _this.loadRoleInfo();
                            _this.$message({
                                message: '删除成功。',
                                type: 'success'
                            });
                        } else {
                            _this.$message({
                                message: '删除失败。',
                                type: 'error'
                            });
                        }
                        layer.close(layerIndex);
                    },
                    error: function() {
                        console.log("删除角色服务请求出错!");
                    }
                });
            });
        },
        /**
         * 显示修改角色信息页面
         * @param  {[type]} role [description]
         * @return {[type]}      [description]
         */
        modifyRoleHandler: function(role) {
            var _this = this;
            //this.modifyrole.roleForm.roleId = role.roleId;
            this.modifyrole.openNum += 1;
            $.ajax({
                url: util.userApi + "/query_RolePriv.do",
                type: "post",
                data: {
                    "roleId": role.roleId
                },
                dataType: "json",
                success: function(Resp) {
                    if (Resp.respCode == "0") {

                        _this.modifyrole.showRoleForm = true;
                        _this.$nextTick(function() {
                            _this.modifyrole.roleForm = {
                                roleName: Resp.result.roleName,
                                roleDesc: Resp.result.roleDesc,
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
                        //layer.alert("");
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
                $.ajax({
                    url: util.userApi + "/update_Role.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    success: function(Resp) {

                        if (Resp.respCode == "0") {
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
                    },
                    error: function() {
                        console.log("录入角色信息服务请求出错！");
                    }
                });
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
                url: util.userApi + "/query_RolePriv.do",
                type: "post",
                data: {
                    "roleId": roleId
                },
                dataType: "json",
                success: function(Resp) {
                    if (Resp.respCode == "0") {
                        _this.roleManage.checkList = Resp.result.priv;
                        _this.roleManage.roleId = roleId;
                        _this.roleManage.showRoleForm = true;
                    } else {
                        layer.alert("查询角色信息失败！");
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
            $.ajax({
                url: util.userApi + "/priv_Mannager.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(Resp) {
                    if (Resp.respCode == "0") {
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
                },
                error: function(Resp) {
                    console.log("权限管理服务请求出错!");
                }
            });
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
