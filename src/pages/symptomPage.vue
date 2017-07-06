<template>
    <div class="panel symptom">
        <div class="panel-heading">
            症状管理
        </div>
        <div class="panel-body">
            <el-row v-if="showPanel == 'place'">
                <el-row>
                    <el-form :inline="true" :model="placeQueryForm" class="demo-form-inline">
                        <!-- <el-form-item label="部位名称:">
                            <el-input v-model="placeQueryForm.name"></el-input>
                        </el-form-item> -->
                        <el-form-item>
                            <!-- <el-button type="primary" @click="handleQueryPlace">查询</el-button>
                            <el-button type="primary" @click="handleResetPlaceQueryForm">重置</el-button> -->
                            <el-button type="success" icon="plus" @click="handleAddPlace">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row style="margin-top: 0px;">
                    <el-table :data="placeTableList" border style="width: 100%">
                        <el-table-column label="部位名称">
                            <template scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="顺序">
                            <template scope="scope">
                                {{ scope.row.seq }}
                            </template>
                        </el-table-column>
                        <el-table-column label="正反面">
                            <template scope="scope">
                                <span v-if="scope.row.side === '1'">正面</span>
                                <span v-if="scope.row.side === '0'">反面</span>
                                <span v-if="scope.row.side === '2'">其他</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="图片" width="300">
                            <template scope="scope">
                                默认：
                                <img :src="scope.row.pic0Url" width="64" height="64" style="border-radius:50%;">
                                选中：
                                <img :src="scope.row.pic1Url" width="64" height="64" style="border-radius:50%;">
                            </template>
                        </el-table-column>
                        <el-table-column label="展示" >
                            <template scope="scope">
                                <span style="margin-left: 10px" v-if="scope.row.showFlag == 'Y'">显示</span>
                                <span style="margin-left: 10px" v-if="scope.row.showFlag == 'N'">隐藏</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="handleEditPlace(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" @click="handleManagePlace(scope.$index, scope.row)">症状</el-button>
                                <el-button size="small" type="danger" @click="handleDeletePlace(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row style="margin-top: 20px;">
                        <el-pagination @current-change="handlePlacePageChange" :current-page="placePage.currentPage" :page-size="placePage.pageNumber" layout="total, prev, pager, next, jumper" :total="placePage.totalNumber" style="float: right;">
                        </el-pagination>
                    </el-row>
                </el-row>
                <el-dialog title="添加部位" v-model="placeAddForm.dialogVisible" size="tiny" custom-class="popover-page">
                    <div>
                        <el-form label-width="120px" :model="placeAddForm" :rules="placeRule" ref="placeAddFormRule">
                            <el-form-item label="名字" prop="name">
                                <el-input v-model="placeAddForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="顺序" prop="seq">
                                <el-input v-model="placeAddForm.seq"></el-input>
                            </el-form-item>
                            <el-form-item label="正反面" prop="side" required>
                                <el-select v-model="placeAddForm.side" placeholder="请选择">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in sideList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="展示" prop="showFlag" required>
                                <el-select v-model="placeAddForm.showFlag" placeholder="请选择">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in flagList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="默认图片:" prop="pic0Url" required>
                                <el-upload class="avatar-uploader" drag :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" >
                                    <img v-if="placeAddForm.pic0Url" :src="placeAddForm.pic0Url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <span class="tips">
                                    *  默认图片，建议图片大小为64*64
                                </span>
                            </el-form-item>
                            <el-form-item label="选中图片:" prop="pic1Url" required>
                                <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload" style="display:inline-block;">
                                    <img v-if="placeAddForm.pic1Url" :src="placeAddForm.pic1Url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <span class="tips">
                                    *  选中图片，建议图片大小为64*64
                                </span>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="placeAddForm.dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleAddPlaceSubmit">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="修改部位" v-if="placeModForm.dialogVisible" v-model="placeModForm.dialogVisible" size="tiny">
                    <div>
                        <el-form label-width="120px" :model="placeModForm" :rules="placeRule" ref="placeModFormRule">
                            <el-form-item label="名字" prop="name">
                                <el-input v-model="placeModForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="顺序" prop="seq">
                                <el-input v-model="placeModForm.seq"></el-input>
                            </el-form-item>
                            <el-form-item label="正反面" prop="side" required>
                                <el-select v-model="placeModForm.side" placeholder="请选择">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in sideList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="展示" prop="showFlag" required>
                                <el-select v-model="placeModForm.showFlag" placeholder="请选择">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in flagList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="默认图片:" prop="pic0Url" required>
                                <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload" >
                                    <img v-if="placeModForm.pic0Url" :src="placeModForm.pic0Url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <span class="tips">
                                    *  默认图片，建议图片大小为64*64
                                </span>
                            </el-form-item>
                            <el-form-item label="选中图片:" prop="pic1Url" required>
                                <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess3" :before-upload="beforeAvatarUpload" >
                                    <img v-if="placeModForm.pic1Url" :src="placeModForm.pic1Url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <span class="tips">
                                    *  选中图片，建议图片大小为64*64
                                </span>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                       <el-button @click="placeModForm.dialogVisible = false">取 消</el-button>
                       <el-button type="primary" @click="handleEditPlaceSubmit">确 定</el-button>
                   </span>
                </el-dialog>
            </el-row>
            <!-- 症状管理  -->
            <!--  <transition name="page-left"> -->
            <el-row v-if="showPanel == 'symptom'">
                <el-row>
                    <el-button type="primary" @click="handleBackToPlace">返回</el-button>
                    <el-button type="success" icon="plus" @click="handleAddSymptom">添加</el-button>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-table :data="symptomTableList" border style="width: 100%">
                        <el-table-column label="症状名称">
                            <template scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="性别" >
                            <template scope="scope">
                                <span style="margin-left: 10px" v-if="scope.row.sex == 'M'">男性</span>
                                <span style="margin-left: 10px" v-if="scope.row.sex == 'F'">女性</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="handleEditSymptom(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="handleDeleteBuilding(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row style="margin-top: 20px;">
                        <el-pagination @current-change="handleSymptomPageChange" :current-page="symptomPage.currentPage" :page-size="symptomPage.pageNumber" layout="total, prev, pager, next, jumper" :total="symptomPage.totalNumber" style="float: right;">
                        </el-pagination>
                    </el-row>
                </el-row>
                <el-dialog title="添加症状" v-model="symptomAddForm.dialogVisible" size="tiny" custom-class="popover-page">
                    <div>
                        <el-form label-width="80px" :model="symptomAddForm" :rules="symptomRule" ref="symptomAddFormRule">
                            <el-form-item label="名字:" prop="name">
                                <el-input v-model="symptomAddForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="性别:" prop="sex" required>
                                <el-select v-model="symptomAddForm.sex" placeholder="请选择">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in sexList"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="symptomAddForm.dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleAddSymptomSubmit">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="修改症状" v-model="symptomModForm.dialogVisible" size="tiny">
                    <div>
                        <el-form label-width="80px" :model="symptomModForm" :rules="symptomRule" ref="symptomModFormRule">
                            <el-form-item label="名字:" prop="name">
                                <el-input v-model="symptomModForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="性别:" prop="sex" required>
                                <el-select v-model="symptomModForm.sex" placeholder="请选择">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in sexList"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                       <el-button @click="symptomModForm.dialogVisible = false">取 消</el-button>
                       <el-button type="primary" @click="handleEditSymptomSubmit">确 定</el-button>
                   </span>
                </el-dialog>
            </el-row>
            <!-- </transition> -->
        </div>
    </div>
</template>
<script>
import * as util from '../util/common.js'
export default {
    name: "symptomPage",
    data() {
        var checkSide = (rule, value, callback) => {
            console.log(value);
            if (value === "" || value == null) {
                return callback(new Error('请选择正反面'));
            }
            callback();

        };
        var checkSex = (rule, value, callback) => {
            console.log(value);
            if (value === "" || value == null) {
                return callback(new Error('请选择性别'));
            }
            callback();

        };
        return {
            mainApi: util.mainApi,
            showPanel: 'place',
            sideList: [{
                id: "1",
                name: "正面"
            }, {
                id: "0",
                name: "反面"
            }, {
                id: "2",
                name: "其他"
            }],
            flagList: [{
                id: "Y",
                name: "显示"
            }, {
                id: "N",
                name: "隐藏"
            }],
            sexList: [{
                id: "M",
                name: "男性"
            }, {
                id: "F",
                name: "女性"
            }],

            //部位管理
            placePage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 1
            },
            placeTableList: [{
                name: "111",
                description: "asdas"
            }],
            placeQueryForm: {
                name: ""
            },
            placeAddForm: {
                dialogVisible: false,
                name: "",
                seq: "",
                side: "",
                showFlag:"Y",
                pic0Url:"",
                pic1Url:"",
            },
            placeModForm: {
                dialogVisible: false,
                id: "",
                name: "",
                seq: "",
                side: "",
                showFlag:"",
                pic0Url:"",
                pic1Url:"",
            },
            placeRule: {
                name: [{
                    required: true,
                    message: "请输入部位名称",
                    trigger: 'blur'
                }],
                seq: [{
                    required: true,
                    message: "请输入顺序名称",
                    trigger: 'blur'
                }],
                side: [{
                    validator: checkSide,
                    trigger: 'change'
                }],
                pic0Url: [{
                    required: true,
                    message: "请选择默认图片",
                    trigger: 'blur'
                }],
                pic1Url: [{
                    required: true,
                    message: "请选择选择时图片",
                    trigger: 'blur'
                }],
            },

            //症状管理
            placeId: "", //当前处理的部位id
            symptomPage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 1
            },
            symptomTableList: [{
                name: "111",
                description: "asdas"
            }],
            symptomQueryForm: {
                name: ""
            },
            symptomAddForm: {
                dialogVisible: false,
                name: "",
                sex:""
            },
            symptomModForm: {
                dialogVisible: false,
                id: "",
                name: "",
                sex:""
            },
            symptomRule: {
                name: [{
                    required: true,
                    message: "请输入症状名称",
                    trigger: 'blur'
                }],
                side: [{
                    validator: checkSex,
                    trigger: 'change'
                }]
            }

        }
    },
    created: function() {
        this.loadPlace();
    },
    methods: {

        loadPlace: function() {
            var _this = this;

            var loadBuildingSuccess = function(result) {
                _this.placeTableList = result.symptomSites;
                _this.placePage = result.page;
            }
            var obj = {
                id: this.placeQueryForm.id ? this.placeQueryForm.id : undefined,
                page: this.placePage
            }
            $.ajax({
                url: util.mainApi + "/symptom/selectSymptomSite.do",
                type: "post",
                dataType: "json",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                // 获取服务器返回的json结果
                success: function(loadBuildingResp) {
                    if (loadBuildingResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有部位信息失败:' + loadBuildingResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    loadBuildingSuccess(loadBuildingResp.result);
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 添加症状部位  显示页面操作
         * @return {[type]} [description]
         */
        handleAddPlace: function() {
            this.placeAddForm.name = "";
            this.placeAddForm.seq = "";
            this.placeAddForm.side = "";
            this.placeAddForm.showFlag = "Y";
            this.placeAddForm.pic0Url = "";
            this.placeAddForm.pic1Url = "";

            this.placeAddForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['placeAddFormRule'].resetFields();
            })
        },
        /**
         * 添加  症状部位 提交操作
         * @return {[type]} [description]
         */
        handleAddPlaceSubmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    name: _this.placeAddForm.name,
                    seq: _this.placeAddForm.seq,
                    side: _this.placeAddForm.side,
                    showFlag:  _this.placeAddForm.showFlag,
                    pic0Url:  _this.placeAddForm.pic0Url,
                    pic1Url:  _this.placeAddForm.pic1Url,
                }
                $.ajax({
                    url: util.mainApi + "/symptom/addSymptomSite.do",
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
                                message: '添加症状部位信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.placeAddForm.dialogVisible = false;
                        _this.$message({
                            message: '添加症状部位信息成功',
                            type: 'success'
                        });
                        _this.loadPlace();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['placeAddFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 修改症状部位   显示页面操作
         * @return {[type]} [description]
         */
        handleEditPlace: function(index, place) {
            var _this = this;
            var obj = {
                id: place.id,
                page: {
                    currentPage: 1,
                    pageNumber: 10
                }
            }
            $.ajax({
                url: util.mainApi + "/symptom/selectSymptomSite.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(editBuildingResp) {
                    if (editBuildingResp.respCode != "0") {
                        _this.$message({
                            message: '查询症状部位信息失败:' + editBuildingResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = editBuildingResp.result.symptomSites[0];
                    _this.placeModForm.id = result.id;
                    _this.placeModForm.name = result.name;
                    _this.placeModForm.seq = result.seq + "";
                    _this.placeModForm.side = result.side;
                    _this.placeModForm.showFlag = result.showFlag;          
                    _this.placeModForm.pic0Url = result.pic0Url;          
                    _this.placeModForm.pic1Url = result.pic1Url;          

                    _this.placeModForm.dialogVisible = true;
                    _this.$nextTick(function() {
                        this.$refs['placeModFormRule'].resetFields();
                    })
                }
            })
        },
        /**
         * 修改症状部位  提交操作
         * @return {[type]} [description]
         */
        handleEditPlaceSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {

                _this.placeModForm.dialogVisible = false;
                _this.$message({
                    message: '修改症状部位信息成功',
                    type: 'success'
                });
                _this.loadPlace();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.placeModForm.id,
                    name: _this.placeModForm.name,
                    seq: _this.placeModForm.seq,
                    side: _this.placeModForm.side,
                    showFlag:_this.placeModForm.showFlag,
                    pic0Url:_this.placeModForm.pic0Url,
                    pic1Url:_this.placeModForm.pic1Url

                }
                $.ajax({
                    url: util.mainApi + "/symptom/updateSymptomSite.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(columnResp) {
                        if (columnResp.respCode != "0") {
                            _this.$message({
                                message: '修改症状部位信息失败:' + columnResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        submitSuccess(columnResp);
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }
            this.$refs['placeModFormRule'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleDeletePlace: function(index, building) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/symptom/deleteSymptomSite.do",
                    type: "post",
                    data: {
                        "symptomSiteId": building.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除症状部位失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除症状部位成功!'
                        });
                        _this.loadPlace();

                    }
                })

            }
            this.$confirm('确定删除此症状部位?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },

        /**
         * 查询 门诊楼
         * @return {[type]} [description]
         */
        handleQueryPlace: function() {
            this.loadPlace();
        },

        /**
         * 重置门诊楼  查询操作
         * @return {[type]} [description]
         */
        handleResetPlaceQueryForm: function() {
            this.placeQueryForm.name = "";
            this.loadPlace();
        },

        /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handlePlacePageChange: function(val) {
            this.placePage.currentPage = val;
            this.loadPlace();
        },

        handleManagePlace: function(index, place) {
            this.placeId = place.id;
            this.loadSymptom();
            this.showPanel = 'symptom';
        },




        loadSymptom: function() {
            var _this = this;

            var loadBuildingSuccess = function(result) {
                _this.symptomTableList = result.symptoms;
                _this.symptomPage = result.page;
            }
            var obj = {
                siteId: this.placeId,
                id: this.symptomQueryForm.id ? this.symptomQueryForm.id : undefined,
                page: this.symptomPage
            }
            $.ajax({
                url: util.mainApi + "/symptom/selectSymptom.do",
                type: "post",
                dataType: "json",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                // 获取服务器返回的json结果
                success: function(loadBuildingResp) {
                    if (loadBuildingResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有症状信息失败:' + loadBuildingResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    loadBuildingSuccess(loadBuildingResp.result);
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 添加症状  显示页面操作
         * @return {[type]} [description]
         */
        handleAddSymptom: function() {
            this.symptomAddForm.name = "";
            this.symptomAddForm.sex = "";


            this.symptomAddForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['symptomAddFormRule'].resetFields();
            })
        },
        /**
         * 添加  症状 提交操作
         * @return {[type]} [description]
         */
        handleAddSymptomSubmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    name: _this.symptomAddForm.name,
                    sex: _this.symptomAddForm.sex,
                    siteId: _this.placeId
                }
                $.ajax({
                    url: util.mainApi + "/symptom/addSymptom.do",
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
                                message: '添加症状信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.symptomAddForm.dialogVisible = false;
                        _this.$message({
                            message: '添加症状信息成功',
                            type: 'success'
                        });
                        _this.loadSymptom();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['symptomAddFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 修改症状   显示页面操作
         * @return {[type]} [description]
         */
        handleEditSymptom: function(index, symptom) {
            var _this = this;
            var obj = {
                siteId: this.placeId,
                id: symptom.id,
                page: {
                    currentPage: 1,
                    pageNumber: 10
                }
            }
            $.ajax({
                url: util.mainApi + "/symptom/selectSymptom.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(editBuildingResp) {
                    if (editBuildingResp.respCode != "0") {
                        _this.$message({
                            message: '查询症状信息失败:' + editBuildingResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = editBuildingResp.result.symptoms[0];
                    _this.symptomModForm.id = result.id;
                    _this.symptomModForm.name = result.name;
                    _this.symptomModForm.sex = result.sex;

                    _this.symptomModForm.dialogVisible = true;
                }
            })
        },
        /**
         * 修改症状  提交操作
         * @return {[type]} [description]
         */
        handleEditSymptomSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {

                _this.symptomModForm.dialogVisible = false;
                _this.$message({
                    message: '修改症状信息成功',
                    type: 'success'
                });
                _this.loadSymptom();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.symptomModForm.id,
                    name: _this.symptomModForm.name,
                    sex: _this.symptomModForm.sex,
                    siteId: _this.placeId
                }
                $.ajax({
                    url: util.mainApi + "/symptom/updateSymptom.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(columnResp) {
                        if (columnResp.respCode != "0") {
                            _this.$message({
                                message: '修改症状信息失败:' + columnResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        submitSuccess(columnResp);
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }
            this.$refs['symptomModFormRule'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleDeleteBuilding: function(index, building) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/symptom/deleteSymptom.do",
                    type: "post",
                    data: {
                        "symptomId": building.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除症状失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除症状成功!'
                        });
                        _this.loadSymptom();

                    }
                })

            }
            this.$confirm('确定删除此症状?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },

        /**
         * 查询 症状
         * @return {[type]} [description]
         */
        handleQuerySymptom: function() {
            this.loadSymptom();
        },

        /**
         * 重置症状  查询操作
         * @return {[type]} [description]
         */
        handleResetSymptomQueryForm: function() {
            this.symptomQueryForm.name = "";
            this.loadSymptom();
        },

        /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleSymptomPageChange: function(val) {
            this.symptomPage.currentPage = val;
            this.loadSymptom();
        },
        handleBackToPlace: function() {
            this.showPanel = 'place';

        },

        handleAvatarSuccess: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.placeAddForm.pic0Url = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handlePictureSuccess: function(res, file) {
            this.placeAddForm.pic0Url = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;
        },

        handleAvatarSuccess1: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.placeAddForm.pic1Url = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handleAvatarSuccess2: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.placeModForm.pic0Url = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
         handleAvatarSuccess3: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.placeModForm.pic1Url = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handlePictureSuccess1: function(res, file) {
            this.placeAddForm.pic1Url = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;
        },
        beforeAvatarUpload: function(file) {
            console.log('beforeAvatarUpload', file);
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
    }
}
</script>
<style>
.page-left-enter,
.page-left-leave-active {
    transition: transform 3s;
    transform: translateX(100px);
}

.page-left-enter-active,
.page-left-leave {
    transform: translateX(0px);
}
.symptom .avatar-uploader{
    display: inline-block;
}
.symptom  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 64px;
    width: 64px;
    border-radius: 50%;
}


.symptom .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
    height: 64px;
    width: 64px;
}

.symptom .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 64px;
    height: 64px;
    line-height: 64px;
    text-align: center;
}
.symptom .tips{
    position: relative;
    top: -30px;
    color: red;
    padding-left: 10px;
}
.symptom .avatar {
    width: 64px;
    height: 64px;
    display: block;
}

.symptom .popover-page {
    min-width: 600px;
}

</style>
