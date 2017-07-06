<template>
    <div class="panel xs-doctor">
        <div class="panel-heading">
            医生管理
        </div>
        <div class="panel-body">
            <el-row>
                <el-form :inline="true" :model="queryDoctorForm" class="demo-form-inline">
                    <el-form-item label="医生名称:">
                        <el-input v-model="queryDoctorForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="科室名称:" prop="deptId">
                        <el-cascader expand-trigger="hover" :options="deptList" v-model="queryDoctorForm.deptId"> </el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQueryDoctor">查询</el-button>
                        <el-button type="primary" @click="handleResetDoctorQueryForm">重置</el-button>
                        <el-button type="success" icon="plus" @click="handleAddDoctor">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-table :data="doctorList" border style="width: 100%">
                    <el-table-column label="姓名" width="150">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="图片" width="120">
                        <template scope="scope">
                            <img :src="scope.row.pic" width="80" height="96">
                        </template>
                    </el-table-column>
                    <el-table-column label="是否专家" width="150">
                        <template scope="scope">
                            <span v-if="scope.row.professor =='Y'">专家</span>
                            <span v-if="scope.row.professor =='N'">非专家</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="科室" width="150">
                        <template scope="scope">
                            {{ scope.row.deptName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="描述">
                        <template scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.description }}</span>
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
                    <el-pagination @size-change="handleDoctorPageSizeChange" @current-change="handleDoctorPageChange" :current-page="page.currentPage" :page-sizes="[1,10,30,50,100]" :page-size="page.pageNumber" layout="total, sizes, prev, pager, next, jumper" :total="page.totalNumber" style="float: right;">
                    </el-pagination>
                </el-row>
            </el-row>
        </div>
        <el-dialog title="添加医生" v-model="addDoctorForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="100px" :model="addDoctorForm" :rules="rule" ref="ruleForm">
                    <el-form-item label="名字:" prop="name">
                        <el-input v-model="addDoctorForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="头像:" prop="pic">
                        <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="addDoctorForm.picUrl" :src="addDoctorForm.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item> 
                    <el-form-item label="是否专家:" prop="expert" required>
                        <el-select v-model="addDoctorForm.professor" placeholder="是否是专家">
                            <el-option v-for="expert in isExpert" :label="expert.label" :value="expert.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签:" prop="tags">
                        <el-tag :key="tag" v-for="tag in addDoctorForm.dynamicTags" :closable="true" :close-transition="false" @close="handleCloseTagsOfAddDoc(tag)" style="margin-left:5px;border-radius:10px;background-color: #fff;color: #000;border:1px solid #ccc;padding: 0 10px;">{{tag}}</el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                    </el-form-item>
                    <el-form-item label="科室:" prop="deptId" required>
                        <el-cascader expand-trigger="hover" :options="deptList" v-model="addDoctorForm.deptId"> </el-cascader>
                    </el-form-item>
                    <el-form-item label="描述:" prop="description">
                        <el-input type="textarea" autosize v-model="addDoctorForm.description"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDoctorForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddDoctorSubmmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改科室" v-model="modDoctorForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="110px" :model="modDoctorForm" :rules="rule" ref="ModifyruleForm">
                    <el-form-item label="名字:" prop="name">
                        <el-input v-model="modDoctorForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="头像:" prop="pic">
                        <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
                            <img v-if="modDoctorForm.picUrl" :src="modDoctorForm.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="是否专家:" prop="expert" required>
                        <el-select v-model="modDoctorForm.professor" placeholder="是否是专家">
                            <el-option v-for="expert in isExpert" :label="expert.label" :value="expert.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签:" prop="tags">
                        <el-tag :key="tag" v-for="tag in modDoctorForm.dynamicTags" :closable="true" :close-transition="false" @close="handleCloseTagsOfModDoc(tag)" style="margin-left:5px;border-radius:10px;background-color: #fff;color: #000;border:1px solid #ccc;padding: 0 10px;">{{tag}}</el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInputMod" size="mini" @keyup.enter.native="handleInputConfirmMod" @blur="handleInputConfirmMod">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInputMod">+ 新标签</el-button>
                    </el-form-item>
                    <el-form-item label="科室:" prop="deptId" required>
                        <el-cascader expand-trigger="hover" :options="deptList" v-model="modDoctorForm.deptId"> </el-cascader>
                    </el-form-item>
                    <el-form-item label="描述:" prop="description">
                        <el-input type="textarea" autosize v-model="modDoctorForm.description"></el-input>
                    </el-form-item>
                    
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modDoctorForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleModifyDeptSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import * as util from '../util/common.js'
import uploadPic from 'components/common/uploadPic.vue'
export default {
    name: "DoctorManage",
    data() {
        var checkdeptId = (rule, value, callback) => {
            console.log(value);
            if (value.length == 0) {
                return callback(new Error('请选择科室'));
            }
            callback();

        };
        return {
            mainApi: util.mainApi,
            isExpert: [{
                label: '专家',
                value: "Y"
            }, {
                label: '非专家',
                value: "N"
            }],
            inputVisible: false,
            inputValue: '',

            doctorList: [],
            deptList: [],
            page: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 100
            },
            queryDoctorForm: {
                name: "",
                deptId: []
            },
            addDoctorForm: {
                dialogVisible: false,
                name: "",
                description: "",
                deptId: [],
                picUrl: "",
                professor: "",
                dynamicTags: [],

            },
            modDoctorForm: {
                dialogVisible: false,
                name: "",
                description: "",
                deptId: [],
                picUrl: "",
                professor: "",
                dynamicTags: [],
            },
            rule: {
                name: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                deptId: [{
                    validator: checkdeptId,
                    trigger: 'change'
                }]
            }
        }
    },
    created: function() {
        this.loadDepts();
        this.loadDoctorsList(null);
    },
    methods: {

        /**
         * 加载所有的医生信息
         * @return {[type]} [description]
         */
        loadDepts: function() {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/select_dept_underHospital.do",
                type: "post",
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(deptsResp) {
                    if (deptsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有医生信息失败:' + deptsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    var result = deptsResp.result;
                    var arr = [];
                    for (var i = 0, leng = result.length; i < leng; i++) {
                        var arrObj = {
                            label: result[i].hospitalName,
                            value: result[i].id,
                            children: []
                        }
                        for (var j = 0, jleng = result[i].depts.length; j < jleng; j++) {
                            var jarrObj = {
                                label: result[i].depts[j].name,
                                value: result[i].depts[j].id
                            }
                            arrObj.children.push(jarrObj);
                        }
                        arr.push(arrObj);
                    }
                    _this.deptList = arr;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 加载所有的医生信息
         * @return {[type]} [description]
         */
        loadDoctorsList: function(id) {
            var _this = this;
            var obj = {
                id: null,
                name: _this.queryDoctorForm.name ? _this.queryDoctorForm.name : undefined,
                deptId: _this.queryDoctorForm.deptId[1],
                page: this.page
            }
            $.ajax({
                url: util.mainApi + "/doctor/select_doctor.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(doctorResp) {
                    if (doctorResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有医院信息失败:' + doctorResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.doctorList = doctorResp.result.doctorInfos;
                    _this.page = doctorResp.result.page;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        handleDoctorPageSizeChange: function(val) {
            this.page.pageNumber = val;
            this.loadDoctorsList(null);
        },
        handleDoctorPageChange: function(val) {
            this.page.currentPage = val;
            this.loadDoctorsList(null);
        },
        /**
         * 显示添加 医生页面
         * @return {[type]} [description]
         */
        handleAddDoctor: function() {
            this.addDoctorForm.name = "";
            this.addDoctorForm.description = "";
            this.addDoctorForm.deptId = [];
            this.addDoctorForm.picUrl = "";
            this.addDoctorForm.professor = 'N';
            this.addDoctorForm.dynamicTags = [];

            this.addDoctorForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['ruleForm'].resetFields();
            })
        },
        /**
         * 提交 添加的医生信息
         * @return {[type]} [description]
         */
        handleAddDoctorSubmmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    name: _this.addDoctorForm.name,
                    deptId: _this.addDoctorForm.deptId[1],
                    description: _this.addDoctorForm.description,
                    professor: _this.addDoctorForm.professor,
                    label: _this.addDoctorForm.dynamicTags.length === 0 ? "" : _this.addDoctorForm.dynamicTags.join(','),
                    pic: _this.addDoctorForm.picUrl
                }
                $.ajax({
                    url: util.mainApi + "/doctor/insert_doctor.do",
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
                                message: '添加医生信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.addDoctorForm.dialogVisible = false;
                        _this.$message({
                            message: '添加医生信息成功',
                            type: 'success'
                        });
                        _this.loadDoctorsList(null)
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
        /**
         * 修改 医生信息
         * @param  {[type]} index [description]
         * @param  {[type]} dept  [description]
         * @return {[type]}       [description]
         */
        handleEdit: function(index, dept) {

            var _this = this;
            var obj = {
                id: dept.id,
                page: {
                    currentPage:1,
                    pageNumber:10
                }
            }
            $.ajax({
                url: util.mainApi + "/doctor/select_doctor.do",
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
                            message: '查询医生信息失败:' + findUserResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = findUserResp.result.doctorInfos[0];
                    console.log('findUserResp', result)
                    _this.modDoctorForm.id = result.id;
                    _this.modDoctorForm.name = result.name;
                    _this.modDoctorForm.description = result.description;
                    var hospitalId = "";
                    console.log(_this.deptList)
                    for (var i = 0, leng = _this.deptList.length; i < leng; i++) {
                        for (var j = 0, jleng = _this.deptList[i].children.length; j < jleng; j++) {
                            if (_this.deptList[i].children[j].value == result.deptId) {
                                hospitalId = _this.deptList[i].value;
                            }
                        }

                    }
                    _this.modDoctorForm.deptId = [hospitalId, result.deptId];
                    _this.modDoctorForm.professor = result.professor;
                    _this.modDoctorForm.picUrl = result.pic;
                    _this.modDoctorForm.dynamicTags = result.labels;

                    _this.modDoctorForm.dialogVisible = true;


                }
            })
        },
        /**
         * 修改医生信息 提交操作
         */
        handleModifyDeptSubmit: function() {
            var _this = this;
            var submitSuccess = function(operatorsResp) {
                if (operatorsResp.respCode != "0") {
                    _this.$message({
                        message: '修改用户信息失败:' + operatorsResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                _this.modDoctorForm.dialogVisible = false;
                _this.$message({
                    message: '修改用户信息成功',
                    type: 'success'
                });
                _this.loadDoctorsList(null)
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.modDoctorForm.id,
                    name: _this.modDoctorForm.name,
                    description: _this.modDoctorForm.description,
                    deptId: _this.modDoctorForm.deptId[1],
                    professor: _this.modDoctorForm.professor,
                    label: _this.modDoctorForm.dynamicTags.length === 0 ? "" : _this.modDoctorForm.dynamicTags.join(','),
                    pic: _this.modDoctorForm.picUrl
                }
                $.ajax({
                    url: util.mainApi + "/doctor/update_doctor.do",
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
                    url: util.mainApi + "/doctor/del_doctor.do",
                    type: "post",
                    data: {
                        "id": dept.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除医生信息失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadDoctorsList();

                    }
                })

            }
            this.$confirm('确定删除此医生?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        handleAvatarScucess: function() {},
        beforeAvatarUpload: function() {},
        handleQueryDoctor: function() {
            this.loadDoctorsList();
        },
        handleResetDoctorQueryForm: function() {
            this.queryDoctorForm.name = "";
            this.queryDoctorForm.deptId = [];
            this.loadDoctorsList();
        },

        handleCloseTagsOfAddDoc: function(tag) {
            console.log('handleCloseTagsOfAddDoc', tag);
            this.addDoctorForm.dynamicTags.splice(this.addDoctorForm.dynamicTags.indexOf(tag), 1);
        },
        showInput: function() {
            this.inputVisible = true;
            this.$nextTick(function() {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm: function() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.addDoctorForm.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        handleAvatarSuccess: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.addDoctorForm.picUrl = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handleAvatarSuccess1: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.modDoctorForm.picUrl = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handlePictureSuccess: function(res, file) {
            this.addDoctorForm.picUrl = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;
        },
        beforeAvatarUpload: function(file) {
            console.log('beforeAvatarUpload', file);
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleCloseTagsOfModDoc: function(tag) {
            console.log('handleCloseTagsOfAddDoc', tag);
            this.modDoctorForm.dynamicTags.splice(this.modDoctorForm.dynamicTags.indexOf(tag), 1);
        },
        showInputMod: function() {
            this.inputVisible = true;
            this.$nextTick(function() {
                this.$refs.saveTagInputMod.$refs.input.focus();
            });
        },

        handleInputConfirmMod: function() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.modDoctorForm.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
    }
}
</script>
<style>
.xs-doctor .input-new-tag {
    display: inline-block;
    width: 100px;
}

.xs-doctor .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 80px;
    height: 96px;
}

.xs-doctor .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
    width: 80px;
    height: 96px;
}

.xs-doctor .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 96px;
    line-height: 96px;
    text-align: center;
}

.xs-doctor .avatar {
    width: 80px;
    height: 96px;
    display: block;
}

.xs-doctor .popover-page {
    min-width: 500px;
}
</style>
