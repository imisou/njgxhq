<template>
    <div class="panel">
        <div class="panel-heading">
            用户管理
        </div>
        <div class="panel-body">
            <div class="col-lg-12">
                <el-button type="success" icon="plus" v-if="userType == '1'" @click="addSystemPerson">添加</el-button>
            </div>
            <div class="col-lg-12" style="margin-top: 20px;">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column label="用户名" width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.userName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账号" width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.userCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px" v-if="scope.row.userType == 1" v-text="'超级管理员'"></span>
                            <span style="margin-left: 10px" v-if="scope.row.userType == 2" v-text="'操作员'"></span>
                            <span style="margin-left: 10px" v-if="scope.row.userType == 3" v-text="'微信账号'"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" v-if="userType == '1'" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" v-if="userType == '1'" @click="showRoleHandler(scope.$index, scope.row)">角色管理</el-button>
                            <el-button size="small" v-if="userType == '1'" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="添加操作员" v-model="person.dialogVisible" size="tiny">
            <div>
                <el-form label-width="120px" :model="person" :rules="personRule" ref="ruleForm">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="person.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="person.password"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" prop="userType" required>
                        <el-select v-model="person.usertype" placeholder="请选择">
                            <el-option :label="usertype.name" :value="usertype.id" v-for="usertype in userTypes"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="person.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSystemPersonSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改操作员" v-model="modifyPerson.dialogVisible" size="tiny">
            <div>
                <el-form label-width="120px" :model="modifyPerson" :rules="modifyPersonRule" ref="ModifyruleForm">
                    <el-form-item label="用户名">
                        <el-input v-model="modifyPerson.userName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="modifyPerson.password"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" prop="userType" required>
                        <el-select v-model="modifyPerson.usertype" placeholder="请选择">
                            <el-option :label="usertype.name" :value="usertype.id" v-for="usertype in userTypes"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyPerson.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifySystemPersonSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="删除操作员" v-model="deletePerson.dialogVisible" size="tiny">
            <div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="person.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="person.dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="角色管理" v-model="role.showRoleManage" size="tiny">
            <div>
                <el-checkbox-group v-model="role.checkedRoles" @change="handleCheckedRolesChange">
                    <el-checkbox v-for="(role,index) in role.roleList" :label="role.roleId">
                        <span>{{role.roleName}}</span>
                    </el-checkbox>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-checkbox :indeterminate="role.isIndeterminate" v-model="role.checkedAllRoles" @change="checkAllRoleHandle">全选</el-checkbox>
                <el-button @click="role.showRoleManage = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserRoleHandler()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as util from '../util/common.js'
export default {
    name: "OperatorManage",
    data: function() {
        var checkUser = (rule, value, callback) => {
            console.log(value);
            if (value === "" || value == null) {
                return callback(new Error('请选择用户类型'));
            }
            callback();

        };
        return {
            userTypes: [{
                id: 1,
                name: "超级管理员"
            }, {
                id: 2,
                name: "管理员"
            }, {
                id: 3,
                name: "微信用户"
            }],
            userType: "2",
            tableData: [],
            person: {
                dialogVisible: false,
                name: "",
                password: "",
                usertype: ""
            },
            deletePerson: {
                dialogVisible: false
            },
            modifyPerson: {
                dialogVisible: false,
                userName: "",
                password: "",
                userId: "",
                usertype: ""
            },
            personRule: {
                name: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                side: [{
                    validator: checkUser,
                    trigger: 'change'
                }]
            },
            modifyPersonRule: {
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                side: [{
                    validator: checkUser,
                    trigger: 'change'
                }]
            },
            role: {
                userId:"",
                showRoleManage: false,
                roleList: [],
                checkedRoles: [],
                checkedRolesAll: [],
                rolesLength: 0,
                checkedAllRoles: false,
                isIndeterminate: false
            },
        }
    },
    created: function() {
        //查询所有的操作员
        this.loadAllOperators();
        this.loadRole();
        this.userType = $.cookie('userType');

    },
    methods: {
        /**
         * 加载所有的操作员信息
         * @return {[type]} [description]
         */
        loadAllOperators: function() {
            var _this = this;
            $.ajax({
                url: util.userApi + "/select_users.do",
                type: "post",
                data: {
                    userId: null
                },
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(operatorsResp) {
                    if (operatorsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有用户信息失败:' + operatorsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.tableData = operatorsResp.result;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        //加载角色列表
        loadRole: function() {
            var _this = this;
            $.ajax({
                url: util.userApi + '/query_Role.do',
                type: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function(resp) {
                    if (resp.respCode == 0) {
                        var length = resp.result.length;
                        _this.role.roleList = resp.result;
                        $.each(resp.result, function(index, roleVal) {
                            _this.role.checkedRolesAll.push(roleVal.roleId);
                        })
                        _this.role.rolesLength = length;

                    } else {
                        console.log("角色列表加载失败");
                    }
                },
                error: function() {
                    console.log("角色列表加载服务请求出错！");
                }
            });
        },
        /**
         * 查询某一个操作员的信息
         * @param  {[type]} index  [description]
         * @param  {[type]} person [description]
         * @return {[type]}        [description]
         */
        handleEdit: function(index, person) {
            var _this = this;
            $.ajax({
                url: util.userApi + "/select_users.do",
                type: "post",
                data: {
                    "userId": person.userId
                },
                dataType: "json",
                success: function(findUserResp) {
                    if (findUserResp.respCode != "0") {
                        _this.$message({
                            message: '查询用户信息失败:' + findUserResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = findUserResp.result[0];
                    console.log('findUserResp', result)
                    _this.modifyPerson.userName = result.userName;
                    _this.modifyPerson.password = "";
                    _this.modifyPerson.userId = result.userId;
                    _this.modifyPerson.usertype = result.userType;

                    _this.modifyPerson.dialogVisible = true;


                }
            })
        },
        /**
         * 添加操作员 提交操作
         */
        modifySystemPersonSubmit: function() {
            var _this = this;
            var submitSuccess = function(operatorsResp) {
                if (operatorsResp.respCode != "0") {
                    _this.$message({
                        message: '修改用户信息失败:' + operatorsResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                _this.modifyPerson.dialogVisible = false;
                _this.$message({
                    message: '修改用户信息成功',
                    type: 'success'
                });
                _this.loadAllOperators()
            }
            let validateSuccess = function() {
                var obj = {
                    userId: _this.modifyPerson.userId,
                    userPasswd: _this.modifyPerson.password,
                    userType: _this.modifyPerson.usertype
                }
                $.ajax({
                    url: util.userApi + "/update_users.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(operatorsResp) {

                        submitSuccess(operatorsResp);
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }
            this.$refs['ModifyruleForm'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 删除 操作员操作
         * @param  {[type]} index  [description]
         * @param  {[type]} person [description]
         * @return {[type]}        [description]
         */
        handleDelete: function(index, person) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.userApi + "/delete_users.do",
                    type: "post",
                    data: {
                        "userId": person.userId
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除用户失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadAllOperators();

                    }
                })

            }
            this.$confirm('确定删除此操作员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        /**
         * 添加操作员 操作
         */
        addSystemPerson: function() {

            this.person.name = "";
            this.person.password = "";
            this.person.usertype = 2;

            this.person.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['ruleForm'].resetFields();
            })
        },
        /**
         * 添加操作员 提交操作
         */
        addSystemPersonSubmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    userName: _this.person.name,
                    userPasswd: _this.person.password,
                    userType: 2,
                    weixin: "",
                    userType: _this.person.usertype

                }
                $.ajax({
                    url: util.userApi + "/insert_user.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(operatorsResp) {
                        if (operatorsResp.respCode != "0") {
                            _this.$message({
                                message: '添加用户信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.person.dialogVisible = false;
                        _this.$message({
                            message: '添加用户信息成功',
                            type: 'success'
                        });
                        _this.loadAllOperators()
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        showRoleHandler: function(index, user) {
            var _this = this;
            $.ajax({
                url: util.userApi + "/query_userrole.do",
                type: "post",
                data: {
                    "userId": user.userId
                },
                dataType: "json",
                success: function(resp) {
                    if (resp.respCode == "0") {
                        _this.role.checkedRoles = resp.result.role;
                        _this.role.userId = user.userId;
                        _this.role.showRoleManage = true;
                    } else {
                        console.log("角色权限信息查询失败");
                    }
                },
                error: function() {
                    console.log("角色信息查询服务请求失败!");
                }
            });
        },
        checkAllRoleHandle: function(event) {
            this.role.checkedRoles = event.target.checked ? this.role.checkedRolesAll : [];
            this.role.isIndeterminate = false;
            /*if (!this.role.checkedAllRoles) {
                this.role.checkedRoles = this.role.checkedRolesAll;
            } else {
                this.role.checkedRoles = [];
            }*/
        },
        handleCheckedRolesChange: function(value) {
            var checkedCount = value.length;
            this.role.checkedAllRoles = checkedCount === this.role.checkedRolesAll.length;
            this.role.isIndeterminate = checkedCount > 0 && checkedCount < this.role.checkedRolesAll.length;
        },
        /**
         * 更改角色确定按钮
         * @return {[type]} [description]
         */
        modifyUserRoleHandler: function() {
            var _this = this;
            var obj = {}
            obj.userId = this.role.userId;
            obj.role = this.role.checkedRoles;

            $.ajax({
                url: util.userApi + "/modify_userrole.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(Resp) {
                    if (Resp.respCode == "0") {
                        _this.loadAllOperators();
                        _this.$message({
                            message: '角色更改成功',
                            type: 'success'
                        });
                    } else {
                        _this.$message({
                            message: '角色更改失败',
                            type: 'error'
                        });
                    }
                    _this.role.showRoleManage = false;
                },
                error: function(Resp) {
                    console.log("角色管理服务请求出错!");
                }
            });
        },
    }

}
</script>
<style scoped>
.panel {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
}

.panel-heading {
    padding: 20px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    background-color: #f5f5f5;
    margin-bottom: 0px;
}

.panel-body {
    padding: 15px;
}
</style>
