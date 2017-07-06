<template>
    <div class="panel">
        <div class="panel-heading">
            科室管理
        </div>
        <div class="panel-body">
            <el-row>
                <el-form :inline="true" :model="queryDeptForm" class="demo-form-inline">
                    <el-form-item label="科室名称:">
                        <el-input v-model="queryDeptForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="医院名称:" prop="hospitalId">
                        <el-select v-model="queryDeptForm.hospitalId" placeholder="请选择医院">
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQueryDept">查询</el-button>
                        <el-button type="primary" @click="handleResetDeptQueryForm">重置</el-button>
                        <el-button type="success" icon="plus" @click="handleAddDept">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="deptList" border style="width: 100%">
                    <el-table-column label="科室名称" width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="医院" width="180">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.hospitalName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="描述">
                        <template scope="scope">
                            {{ scope.row.description }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="margin-top: 20px;">
                    <el-pagination @size-change="handleDeptPageSizeChange" @current-change="handleDeptPageChange" :current-page="page.currentPage" :page-sizes="[1,10,30,50,100]" :page-size="page.pageNumber" layout="total, sizes, prev, pager, next, jumper" :total="page.totalNumber" style="float: right;">
                    </el-pagination>
                </el-row>
            </el-row>
        </div>
        <el-dialog title="添加科室" v-model="addDeptForm.dialogVisible" size="tiny">
            <div>
                <el-form label-width="100px" :model="addDeptForm" :rules="rule" ref="ruleForm">
                    <el-form-item label="科室名称" prop="name">
                        <el-input v-model="addDeptForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="医院" prop="hospitalId" required>
                        <el-select v-model="addDeptForm.hospitalId" placeholder="请选择医院">
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="text" v-model="addDeptForm.description"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDeptForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddDeptSubmmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改科室" v-model="modDeptForm.dialogVisible" size="tiny">
            <div>
                <el-form label-width="100px" :model="modDeptForm" :rules="rule" ref="ModifyruleForm">
                    <el-form-item label="科室名称" prop="name">
                        <el-input v-model="modDeptForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="医院" prop="hospitalId" required>
                        <el-select v-model="modDeptForm.hospitalId" placeholder="请选择医院">
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="text" v-model="modDeptForm.description"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modDeptForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleModifyDeptSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import * as util from '../util/common.js'
export default {
    name: "DepartmentManage",
    data() {
        var checkAge = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择医院'));
            }
            callback();

        };
        return {
            deptList: [],
            hospitalList: [],
            page: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 100
            },
            queryDeptForm:{
                name:"",
                hospitalId:""
            },
            addDeptForm: {
                dialogVisible: false,
                name: "",
                description: "",
                hospitalId: ""
            },
            modDeptForm: {
                dialogVisible: false,
                id: "",
                name: "",
                description: "",
                hospitalId: ""
            },
            rule: {
                name: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                hospitalId: [{
                    validator: checkAge,
                    trigger: 'change'
                }],
                description: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }]
            }
        }
    },
    created: function() {
        this.loadDepts(null);
        this.loadHospitalList();
    },
    methods: {
        /**
         * 加载所有的科室信息
         * @return {[type]} [description]
         */
        loadDepts: function(id) {
            var _this = this;
            var obj = {
                name:_this.queryDeptForm.name?_this.queryDeptForm.name:undefined,
                hospitalId:_this.queryDeptForm.hospitalId,
                id: id,
                page: this.page
            }
            $.ajax({
                url: util.mainApi + "/dept/select_dept.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
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
                    _this.deptList = deptsResp.result.deptImformations;
                    _this.page = deptsResp.result.page;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 加载所有的医院信息
         * @return {[type]} [description]
         */
        loadHospitalList: function() {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/hospital/select_hospital.do",
                type: "post",
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(deptsResp) {
                    if (deptsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有医院信息失败:' + deptsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.hospitalList = deptsResp.result;
                },
                error: function() {
                    console.log("加载错误!");
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
        handleAddDept: function() {
            this.addDeptForm.name = "";
            this.addDeptForm.description = "";
            this.addDeptForm.hospitalId = "";

            this.addDeptForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['ruleForm'].resetFields();
            })
        },
        /**
         * 提交 添加的科室信息
         * @return {[type]} [description]
         */
        handleAddDeptSubmmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    name: _this.addDeptForm.name,
                    hospitalId: _this.addDeptForm.hospitalId,
                    description: _this.addDeptForm.description,
                }
                $.ajax({
                    url: util.mainApi + "/dept/insert_dept.do",
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
                                message: '添加科室信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.addDeptForm.dialogVisible = false;
                        _this.$message({
                            message: '添加科室信息成功',
                            type: 'success'
                        });
                        _this.loadDepts(null)
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            console.log(this.addDeptForm)
            this.$refs['ruleForm'].validate((valid) => {
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
        handleEdit: function(index, dept) {
            var _this = this;
            console.log(dept);
            var obj = {
                id: dept.id,
                page: {
                    currentPage: 1,
                    pageNumber: 10
                }
            }
            $.ajax({
                url: util.mainApi + "/dept/select_dept.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(findUserResp) {
                    if (findUserResp.respCode != "0") {
                        _this.$message({
                            message: '查询科室信息失败:' + findUserResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = findUserResp.result.deptImformations[0];
                    console.log('findUserResp', result)
                    _this.modDeptForm.id = result.id;
                    _this.modDeptForm.name = result.name;
                    _this.modDeptForm.description = result.description;
                    _this.modDeptForm.hospitalId = result.hospitalId;

                    _this.modDeptForm.dialogVisible = true;


                }
            })
        },
        /**
         * 添加操作员 提交操作
         */
        handleModifyDeptSubmit: function() {
            var _this = this;
            var submitSuccess = function(operatorsResp) {
                if (operatorsResp.respCode != "0") {
                    _this.$message({
                        message: '修改科室信息失败:' + operatorsResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                _this.modDeptForm.dialogVisible = false;
                _this.$message({
                    message: '修改科室信息成功',
                    type: 'success'
                });
                _this.loadDepts(null)
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.modDeptForm.id,
                    name: _this.modDeptForm.name,
                    description: _this.modDeptForm.description,
                    hospitalId: _this.modDeptForm.hospitalId
                }
                $.ajax({
                    url: util.mainApi + "/dept/update_dept.do",
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
         * 删除 科室
         * @param  {[type]} index [description]
         * @param  {[type]} dept  [description]
         * @return {[type]}       [description]
         */
        handleDelete: function(index, dept) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/dept/del_dept.do",
                    type: "post",
                    data: {
                        "id": dept.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除科室失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadDepts(null);

                    }
                })

            }
            this.$confirm('确定删除此科室?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },

        handleQueryDept:function(){
            this.loadDepts();
        },

        /**
         * 重置 查询
         * @return {[type]} [description]
         */
        handleResetDeptQueryForm:function(){
            this.queryDeptForm.name="";
            this.queryDeptForm.hospitalId = "";

            this.loadDepts();
        }
    }
}
</script>
<style scoped>
</style>
