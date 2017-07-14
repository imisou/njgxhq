<template>
    <div class="panel">
        <div class="panel-heading panel-default">
            <span class="panel-title">权限管理</span>
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
                <el-form-item>
                    <el-radio class="radio" v-model="addPrivForm.isMenu" label="1">菜单项</el-radio>
                    <el-radio class="radio" v-model="addPrivForm.isMenu" label="2">操作项</el-radio>
                </el-form-item>
                <el-form-item label="菜单项" prop="menuId"  required v-if="addPrivForm.isMenu==='1'">
                    <el-select v-model="addPrivForm.menuId" placeholder="请选择">
                        <el-option v-for="item in menuItemList" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作项" prop="operateId"  required v-if="addPrivForm.isMenu==='2'">
                    <el-select v-model="addPrivForm.operateId" placeholder="请选择">
                        <el-option v-for="item in operateItemList" :label="item.name" :value="item.id"></el-option>
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
                <el-form-item>
                    <el-radio class="radio" v-model="modPrivForm.isMenu" label="1">菜单项</el-radio>
                    <el-radio class="radio" v-model="modPrivForm.isMenu" label="2">操作项</el-radio>
                </el-form-item>
                <el-form-item label="菜单项" prop="menuId"  required v-if="modPrivForm.isMenu==='1'">
                    <el-select v-model="modPrivForm.menuId" placeholder="请选择">
                        <el-option v-for="mitem in menuItemList" :label="mitem.itemName" :value="mitem.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作项" prop="operateId"  required v-if="modPrivForm.isMenu==='2'">
                    <el-select v-model="modPrivForm.operateId" placeholder="请选择">
                        <el-option v-for="oitem in operateItemList" :label="oitem.name" :value="oitem.id"></el-option>
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
    import {mapGetters} from "vuex"
    import * as util from '../../util/common.js'
    export default {
        name: "PrivManage",
        data() {
        var checkAge = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择'));
            }
            callback();

        };
        return {
            privList: [],
            menuItemList: [],
            operateItemList: [],
            page: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 100
            },
            queryPrivForm: {
                privilegeName: "",
                isMenu:"1"
            },
            addPrivForm: {
                dialogVisible: false,
                privilegeName: "",
                privilegeDesc: "",
                resourceId: "",
                resourceType: "",
                isMenu: '1',
                menuId: "",
                operateId: ""
            },
            modPrivForm: {
                dialogVisible: false,
                privilegeId: "",
                privilegeName: "",
                privilegeDesc: "",
                resourceId: "",
                resourceType: "",
                isMenu: "",
                menuId: "",
                operateId: ""
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
                }],
                operateId: [{
                    validator: checkAge,
                    trigger: 'change'
                }]
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
            this.loadAllPrivs();
        }
    },
    created: function() {
        this.loadAllPrivs();
        this.loadMenuItemList();
        this.loadOperateItemList();
    },
    methods: {
        /**
         * 加载所有的权限信息
         * @return {[type]} [description]
         */
        loadAllPrivs: function() {
            var _this = this;
            this.$fetch("/privilege/all_privilege.do").then(function (resp){
                console.log('allpriv',resp);
                if (resp.respCode != "0") {
                    _this.$message({
                        message: '查询所有权限信息失败:' + resp.data.respMsg,
                        type: 'error'
                    });
                    return;
                }
                console.log(resp.result);
                _this.privList =resp.result;
            });
        },

        selctPrivs:function(){
            var _this = this;
            var obj = {
                privilegeName:_this.queryPrivForm.privilegeName?_this.queryPrivForm.privilegeName:null
            };
            _this.$fetch("/privilege/select_privilege.do", JSON.stringify(obj)).then(function(resp){
                console.log('s-priv',resp.result);
                if (resp.respCode == '0'){
                    _this.privList =resp.result
                }
            });
        },
        /**
         * 加载菜单项
         */
        loadMenuItemList: function() {
            var _this = this;
            _this.$fetch("/privilege/all_menuitem.do").then(function (resp) {
                if (resp.respCode == '0'){
                    console.log('allmenu',resp.result);
                    _this.menuItemList =resp.result;
                }
            });
        },
        /**
         * 加载操作项
         */
        loadOperateItemList:function(){
            var _this = this;
            _this.$fetch("/privilege/all_operation.do").then(function (resp) {
                if (resp.respCode == '0'){
                    console.log('alloperate',resp.result);
                    _this.operateItemList =resp.result;
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
         * 显示添加 权限页面
         * @return {[type]} [description]
         */
        handleAddPriv: function() {
            this.addPrivForm.privilegeName = "";
            this.addPrivForm.privilegeDesc = "";
            this.addPrivForm.menuId = "";
            this.addPrivForm.operateId = "";
            this.addPrivForm.isMenu="1";
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
            var submitSuccess = function(operatorsResp) {
                if (operatorsResp.respCode != "0") {
                    _this.$message({
                        message: '添加权限失败:' + operatorsResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                console.log('添加权限成功');
                _this.addPrivForm.dialogVisible = false;
                _this.$message({
                    message: '添加权限成功',
                    type: 'success'
                });
                _this.loadAllPrivs(null)
            }
            let validateSuccess = function() {
                let obj = {}
                obj.privilegeName = _this.addPrivForm.privilegeName;
                obj.privilegeDesc = _this.addPrivForm.privilegeDesc;
                if(_this.addPrivForm.isMenu==='1'){
                    obj.resourceType = "menuitem";
                    obj.resourceId = _this.addPrivForm.menuId;
                }else if(_this.addPrivForm.isMenu==='2'){
                    obj.resourceType ="operation";
                    obj.resourceId = _this.addPrivForm.operateId;
                }
                _this.$fetch('/privilege/insert_privilege.do', JSON.stringify(obj)).then(function (resp) {
                    if (resp.respCode == "0") {
                        submitSuccess(resp)
                    } else {
                        _this.$message.error('添加失败!')
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
         * 修改 权限信息
         * @param  {[type]} index [description]
         * @param  {[type]} dept  [description]
         * @return {[type]}       [description]
         */
        handleModifyPriv: function(privilegeId) {
            var _this = this;
            var obj = {};
            obj.privilegeId = privilegeId;
            _this.modPrivForm.menuId="";
            _this.modPrivForm.operateId="";
            _this.$fetch('/privilege/select_privilege.do',obj).then(function (resp) {
                if (resp.respCode == '0'){
                    console.log("得到修改数据",resp);
                    _this.modPrivForm.privilegeId = privilegeId;
                    _this.modPrivForm.privilegeName = resp.result[0].privilegeName;
                    _this.modPrivForm.privilegeDesc = resp.result[0].privilegeDesc;
                    if(resp.result[0].resourceType==="menuitem"){
                        _this.modPrivForm.isMenu='1';
                        _this.modPrivForm.menuId=resp.result[0].resourceId;
                    }else if(resp.result[0].resourceType==="operation"){
                        _this.modPrivForm.isMenu='2';
                        _this.modPrivForm.operateId=resp.result[0].resourceId;
                    }

                    _this.modPrivForm.dialogVisible = true;
                }
            });
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
                console.log('更新权限成功');
                _this.modPrivForm.dialogVisible = false;
                _this.$message({
                    message: '更新权限成功',
                    type: 'success'
                });
                _this.loadAllPrivs(null)
            }
            let validateSuccess = function() {
                var obj = {};
                obj.privilegeId = _this.modPrivForm.privilegeId;
                obj.privilegeName = _this.modPrivForm.privilegeName;
                obj.privilegeDesc = _this.modPrivForm.privilegeDesc;
                if(_this.modPrivForm.isMenu==='1'){
                    obj.resourceType="menuitem";
                    obj.resourceId=_this.modPrivForm.menuId;
                } else if(_this.modPrivForm.isMenu==='2'){
                    obj.resourceType ="operation";
                    obj.resourceId = _this.modPrivForm.operateId;
                }

                _this.$fetch('/privilege/update_privilege.do',JSON.stringify(obj)).then(function(resp){
                    if (resp.respCode == "0") {
                        submitSuccess(resp)
                    } else {
                        _this.$message.error('修改失败!')
                    }
                })
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
                _this.$fetch('/privilege/delete_privilege.do',JSON.stringify(obj)).then(function(resp){
                    if (resp.respCode == "0") {
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadAllPrivs();
                    }else{
                        _this.$message.error('删除失败!')
                    }
                })
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
