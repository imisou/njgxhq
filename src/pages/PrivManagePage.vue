<template>
    <div class="panel">
        <div class="panel-heading">
            权限管理
        </div>
        <div class="panel-body">
            <el-row>
                <el-form :inline="true" :model="queryPrivForm" class="demo-form-inline">
                    <el-form-item label="权限名称:">
                        <el-input v-model="queryPrivForm.privilegeName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="selctPrivs">查询</el-button>
                        <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button>
                        <el-button type="success" icon="plus" @click="handleAddPriv">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="privList" border style="width: 100%">
                    <el-table-column label="权限名称" width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.privilegeName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="描述">
                        <template scope="scope">
                            {{ scope.row.privilegeDesc }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template scope="scope">
                            <el-button size="small" @click="handleModifyPriv(scope.row.privilegeId)">编辑</el-button>
                            <el-button size="small" type="danger" @click="deletePriv(scope.row.privilegeId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-row style="margin-top: 20px;">
                    <el-pagination @size-change="handleDeptPageSizeChange" @current-change="handleDeptPageChange" :current-page="page.currentPage" :page-sizes="[1,10,30,50,100]" :page-size="page.pageNumber" layout="total, sizes, prev, pager, next, jumper" :total="page.totalNumber" style="float: right;">
                    </el-pagination>
                </el-row> -->
            </el-row>
        </div>
        <el-dialog title="录入权限" v-model="addPrivForm.dialogVisible" size="tiny">
            <el-form label-width="100px" :model="addPrivForm" :rules="rule" ref="addPrivFormRef">
                <el-form-item label="权限名称" prop="privilegeName">
                    <el-input v-model="addPrivForm.privilegeName" placeholder="权限名称"></el-input>
                </el-form-item>
                <el-form-item label="权限描述" prop="privilegeDesc">
                    <el-input type="textarea" v-model="addPrivForm.privilegeDesc" placeholder="权限描述"></el-input>
                </el-form-item>
                <el-form-item label="菜单项" prop="menuId" required>
                    <el-select v-model="addPrivForm.menuId" placeholder="请选择">
                        <el-option v-for="item in menuItemList" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPrivForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddPrivSubmmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改权限" v-model="modPrivForm.dialogVisible" size="tiny">
            <el-form label-width="100px" :model="modPrivForm" :rules="rule" ref="modPrivFormRef">
                <el-form-item label="权限名称" prop="privilegeName">
                    <el-input v-model="modPrivForm.privilegeName" placeholder="权限名称"></el-input>
                </el-form-item>
                <el-form-item label="权限描述" prop="privilegeDesc">
                    <el-input type="textarea" v-model="modPrivForm.privilegeDesc" placeholder="权限描述"></el-input>
                </el-form-item>
                <el-form-item label="菜单项" prop="menuId">
                    <el-select v-model="modPrivForm.menuId" placeholder="请选择">
                        <el-option v-for="item in menuItemList" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modPrivForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditPrivSubmmit">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
import * as util from '../util/common.js'
export default {
    name: "PrivManage",
    data() {
        var checkAge = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择菜单'));
            }
            callback();

        };
        return {
            privList: [],
            menuItemList: [],
            page: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 100
            },
            queryPrivForm: {
                privilegeName: ""
            },
            addPrivForm: {
                dialogVisible: false,
                privilegeName: "",
                privilegeDesc: "",
                resourceId: "",
                resourceType: "",
                menuId: ""
            },
            modPrivForm: {
                dialogVisible: false,
                privilegeId: "",
                privilegeName: "",
                privilegeDesc: "",
                resourceId: "",
                resourceType: "",
                menuId: ""
            },
            rule: {
                privilegeName: [{
                    required: true,
                    message: '请输入权限名称',
                    trigger: 'blur'
                }],
                menuId: [{
                    validator: checkAge,
                    trigger: 'change'
                }]
            }
        }
    },
    created: function() {
        this.loadAllPrivs();
        this.loadMenuItemList();
    },
    methods: {
        /**
         * 加载所有的科室信息
         * @return {[type]} [description]
         */
        loadAllPrivs: function(id) {
            var _this = this;
            var obj = {

            }
            $.ajax({
                url: util.userApi + "/privilege.do",
                type: "post",
                data: {},
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(deptsResp) {
                    if (deptsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有科室信息失败:' + deptsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.privList = deptsResp.result;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },

        selctPrivs:function(){
            var _this = this;
            var obj = {
                resourceType:'menuitem',
                privilegeName:_this.queryPrivForm.privilegeName?_this.queryPrivForm.privilegeName:null
            }  
            $.ajax({
                url: util.userApi + '/select_privilege.do',
                type: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(obj),
                dataType: 'json',
                success: function(resp) {
                    if (resp.respCode == '0') {
                        _this.privList = resp.result;
                    }
                }
            });
        },
        /**
         * 加载菜单项
         */
        loadMenuItemList: function() {
            var _this = this;
            $.ajax({
                url: util.userApi + '/select_menuIdAndName.do',
                type: 'post',
                dataType: 'json',
                async: false,
                success: function(resp) {
                    if (resp.respCode == '0') {
                        _this.menuItemList = resp.result;
                    }
                },
                error: function() {
                    console.log("请求加载菜单项服务出错！");
                }
            });
        },

        handleDeptPageSizeChange: function(val) {
            this.page.pageNumber = val;
            this.loadDepts();
        },
        handleDeptPageChange: function(val) {
            this.page.currentPage = val;
            this.loadDepts();
        },
        /**
         * 显示添加 科室页面
         * @return {[type]} [description]
         */
        handleAddPriv: function() {
            this.addPrivForm.privilegeName = "";
            this.addPrivForm.privilegeDesc = "";
            this.addPrivForm.menuId = "";

            this.addPrivForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['addPrivFormRef'].resetFields();
            })
        },
        /**
         * 提交 添加的科室信息
         * @return {[type]} [description]
         */
        handleAddPrivSubmmit: function() {
            var _this = this;
            let validateSuccess = function() {
                let obj = {}
                obj.privilegeName = _this.addPrivForm.privilegeName;
                obj.privilegeDesc = _this.addPrivForm.privilegeDesc;
                obj.resourceType = null;
                obj.menuId = _this.addPrivForm.menuId;

                console.log(obj)

                $.ajax({
                    url: util.userApi + '/insert_privilege.do',
                    type: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    success: function(resp) {
                        if (resp.respCode == "0") {
                            _this.$message({
                                message: '权限录入成功！',
                                type: 'success'
                            })
                            _this.addPrivForm.dialogVisible = false;
                            _this.addPrivForm.privilegeName = '';
                            _this.addPrivForm.privilegeDesc = '';
                            _this.loadAllPrivs();
                        } else {
                            _this.$message.error('权限录入失败！')
                        }
                    },
                    error: function() {
                        console.log("录入权限服务请求出错！");
                    }
                });

            }
            this.$refs['addPrivFormRef'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 修改 科室信息
         * @param  {[type]} index [description]
         * @param  {[type]} dept  [description]
         * @return {[type]}       [description]
         */
        handleModifyPriv: function(privilegeId) {
            var _this = this;
            var obj = {}
            obj.privilegeId = privilegeId;
            $.ajax({
                url: util.userApi + '/select_privilege.do',
                type: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(obj),
                dataType: 'json',
                success: function(resp) {
                    if (resp.respCode == '0') {
                        var arr = resp.result;
                        _this.modPrivForm.privilegeId = privilegeId;
                        _this.modPrivForm.privilegeName = arr[0].privilegeName;
                        _this.modPrivForm.privilegeDesc = arr[0].privilegeDesc;
                        _this.modPrivForm.menuId = arr[0].resourceId;

                        _this.modPrivForm.dialogVisible = true;

                    }
                }
            })
        },
        /**
         * 添加操作员 提交操作
         */
        handleEditPrivSubmmit: function() {
            var _this = this;
            var submitSuccess = function(operatorsResp) {
                if (operatorsResp.respCode != "0") {
                    _this.$message({
                        message: '更新权限失败:' + operatorsResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                _this.modPrivForm.dialogVisible = false;
                _this.$message({
                    message: '更新权限成功',
                    type: 'success'
                });
                _this.loadAllPrivs(null)
            }
            let validateSuccess = function() {
                var obj = {}
                obj.privilegeId = _this.modPrivForm.privilegeId;
                obj.privilegeName = _this.modPrivForm.privilegeName;
                obj.privilegeDesc = _this.modPrivForm.privilegeDesc;
                obj.resourceType = null;
                obj.menuId = _this.modPrivForm.menuId;
                $.ajax({
                    url: util.userApi + '/update_privilege.do',
                    type: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        
                    },
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    success: function(resp) {
                        if (resp.respCode == "0") {
                            submitSuccess(resp)
                        } else {
                            _this.$message.error('修改失败!')
                        }
                    },
                    error: function() {
                        console.log("更新权限服务请求出错！");
                    }
                });
            }
            this.$refs['modPrivFormRef'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        deletePriv: function(privilegeId){
            var _this = this;
            this.$confirm('确认删除该权限?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var obj = {}
                obj.privilegeId = privilegeId;
                $.ajax({
                    url: util.userApi + '/delete_privilege.do',
                    type: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    success: function(resp) {
                        if (resp.respCode == "0") {
                            _this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _this.loadAllPrivs(); 
                        }else{
                            _this.$message.error('删除失败!')
                        }
                    },
                    error: function() {
                        console.log("删除权限服务请求出错！");
                    }
                });
            })
        },

        /**
         * 重置 查询
         * @return {[type]} [description]
         */
        handleResetPrivQueryForm: function() {
            this.queryPrivForm.privilegeName = "";
            this.loadAllPrivs();
        }
    }
}
</script>
<style scoped>
</style>
