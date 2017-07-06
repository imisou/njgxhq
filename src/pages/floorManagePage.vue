<template>
    <div class="panel">
        <div class="panel-heading">
            楼层管理
        </div>
        <div class="panel-body">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabsChangeClick">
                <el-tab-pane label="门诊楼管理" name="building">
                    <el-row>
                        <el-form :inline="true" :model="buildingQueryForm" class="demo-form-inline">
                            <el-form-item label="医院名称:">
                                <el-select v-model="buildingQueryForm.hospitalId" placeholder="请选择医院">
                                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleQueryBuilding">查询</el-button>
                                <el-button type="primary" @click="handleResetBuildingQueryForm">重置</el-button>
                                <el-button type="success" icon="plus" @click="handleAddBuilding">添加</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row>
                        <el-table :data="buildingTableList" style="width: 100%">
                            <el-table-column prop="name" label="门诊楼名称" width="180"></el-table-column>
                            <el-table-column prop="hospitalName" label="医院名称" width="180"></el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="handleEditBuilding(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" @click="handleQuerySubFloor(scope.$index, scope.row)">下属楼层</el-button>
                                    <el-button size="small" type="danger" @click="handleDeleteBuilding(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row style="margin-top: 20px;">
                        <el-pagination @current-change="handleBuildingPageChange" :current-page="buildingPage.currentPage" :page-size="buildingPage.pageNumber" layout="total, prev, pager, next, jumper" :total="buildingPage.totalNumber" style="float: right;">
                        </el-pagination>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="楼层管理" name="floor">
                    <el-row>
                        <el-form :inline="true" :model="floorQueryForm" class="demo-form-inline">
                            <el-form-item label="楼层:">
                                <el-input v-model="floorQueryForm.floorName"></el-input>
                            </el-form-item>
                            <el-form-item label="门诊楼名称:">
                                 <el-cascader expand-trigger="hover" :options="buildings" v-model="floorQueryForm.buildingId"> </el-cascader>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleQueryFloor">查询</el-button>
                                <el-button type="primary" @click="handleResetFloorQueryForm">重置</el-button>
                                <el-button type="success" icon="plus" @click="handleAddFloor">添加</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row>
                        <el-table :data="floorTableList" style="width: 100%">
                            <el-table-column prop="floorName" label="楼层名称" width="180"></el-table-column>
                            <el-table-column  label="楼层名称" width="180">
                                <template scope="scope">
                                    <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="60" height="60">
                                    <span v-if="!scope.row.picUrl" >暂无图片</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="buildingName" label="门诊楼名称" width="180"></el-table-column>
                            <!-- <el-table-column prop="hospitalName" label="医院名称" width="180"></el-table-column> -->
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="handleEditFloor(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" @click="handleQuerySubRoom(scope.$index, scope.row)">下属诊室</el-button>
                                    <el-button size="small" type="danger" @click="handleDeleteFloor(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row style="margin-top: 20px;">
                        <el-pagination @current-change="handleFloorPageChange" :current-page="floorPage.currentPage" :page-size="floorPage.pageNumber" layout="total, prev, pager, next, jumper" :total="floorPage.totalNumber" style="float: right;">
                        </el-pagination>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="诊室管理" name="room">
                    <el-row>
                        <el-form :inline="true" :model="roomQueryForm" class="demo-form-inline">
                            <el-form-item label="诊室:">
                                <el-input v-model="roomQueryForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="楼层:">
                                 <el-cascader expand-trigger="hover" :options="floors" v-model="roomQueryForm.floorId"> </el-cascader>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleQueryRoom">查询</el-button>
                                <el-button type="primary" @click="handleResetRoomQueryForm">重置</el-button>
                                <el-button type="success" icon="plus" @click="handleAddRoom">添加</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row>
                        <el-table :data="roomTableList" style="width: 100%">
                            <el-table-column prop="name" label="诊室名称" width="180"></el-table-column>
                            <el-table-column prop="buildingName" label="门诊楼名称" width="180"></el-table-column>
                            <el-table-column prop="hospitalName" label="医院名称" width="180"></el-table-column>
                            <el-table-column prop="floorName" label="楼层" width="180"></el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="handleEditRoom(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="handleDeleteRoom(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row style="margin-top: 20px;">
                        <el-pagination @current-change="handleRoomPageChange" :current-page="roomPage.currentPage" :page-size="roomPage.pageNumber" layout="total, prev, pager, next, jumper" :total="roomPage.totalNumber" style="float: right;">
                        </el-pagination>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>



        <el-dialog title="添加门诊楼" v-model="buildingAddForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="80px" :model="buildingAddForm" :rules="buildingRule" ref="buildingAddFormRule">
                    <el-form-item label="名字" prop="buildingName">
                        <el-input v-model="buildingAddForm.buildingName"></el-input>
                    </el-form-item>
                    <el-form-item label="医院" prop="hospitalId" required>
                        <el-select v-model="buildingAddForm.hospitalId" placeholder="请选择医院">
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="buildingAddForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddBuildingSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改门诊楼" v-model="buildingModForm.dialogVisible" size="tiny">
            <div>
                <el-form label-width="80px" :model="buildingModForm" :rules="buildingRule" ref="buildingModFormRule">
                    <el-form-item label="名字" prop="buildingName">
                        <el-input v-model="buildingModForm.buildingName"></el-input>
                    </el-form-item>
                    <el-form-item label="医院" prop="hospitalId" required>
                        <el-select v-model="buildingModForm.hospitalId" placeholder="请选择医院">
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
               <el-button @click="buildingModForm.dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="handleEditBuildingSubmit">确 定</el-button>
           </span>
        </el-dialog>

        <el-dialog title="添加楼层" v-if="floorAddForm.dialogVisible" v-model="floorAddForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="150px" :model="floorAddForm" :rules="floorRule" ref="floorAddFormRule">
                    <el-form-item label="楼层名称:" prop="floorName">
                        <el-input v-model="floorAddForm.floorName"></el-input>
                    </el-form-item>
                    <el-form-item label="门诊楼名称:" prop="buildingId" required>
                        <el-cascader expand-trigger="hover" :options="buildings" v-model="floorAddForm.buildingId"> </el-cascader>
                    </el-form-item>
                    <el-form-item label="楼层平面图:" prop="picUrl">
                        <el-upload class="avatar-uploader" :action="mainApi+'/news_article/upload_picture.do'" :show-file-list="false" :on-success="handlePictureAddSuccess" :before-upload="beforeAvatarUpload" :on-change="handleOnChange">
                            <img v-if="floorAddForm.picUrl" :src="floorAddForm.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="floorAddForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddFloorSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改楼层" v-if="floorModForm.dialogVisible" v-model="floorModForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="150px" :model="floorModForm" :rules="buildingRule" ref="floorModFormRule">
                    <el-form-item label="楼层名称:" prop="floorName">
                        <el-input v-model="floorModForm.floorName"></el-input>
                    </el-form-item>
                    <el-form-item label="门诊楼名称:" prop="buildingId" required>
                        <el-cascader expand-trigger="hover" :options="buildings" v-model="floorModForm.buildingId"> </el-cascader>
                    </el-form-item>
                    <el-form-item label="楼层平面图:" prop="picUrl">
                        <el-upload class="avatar-uploader" :action="mainApi+'/news_article/upload_picture.do'" :show-file-list="false" :on-success="handlePictureModSuccess" :before-upload="beforeAvatarUpload" :on-change="handleOnChange">
                            <img v-if="floorModForm.picUrl" :src="floorModForm.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
               <el-button @click="floorModForm.dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="handleEditFloorSubmit">确 定</el-button>
           </span>
        </el-dialog>

        <el-dialog title="添加诊室" v-model="roomAddForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="150px" :model="roomAddForm" :rules="roomRule" ref="roomAddFormRule">
                    <el-form-item label="诊室名称" prop="name">
                        <el-input v-model="roomAddForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="诊室" prop="floorId" required>
                        <el-cascader expand-trigger="hover" :options="floors" v-model="roomAddForm.floorId"> </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roomAddForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddRoomSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改诊室" v-model="roomModForm.dialogVisible" size="tiny">
            <div>
                <el-form label-width="120px" :model="roomModForm" :rules="roomRule" ref="roomModFormRule">
                    <el-form-item label="诊室名称" prop="name">
                        <el-input v-model="roomModForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="诊室" prop="floorId" required>
                       <el-cascader expand-trigger="hover" :options="floors" v-model="roomModForm.floorId"> </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
               <el-button @click="roomModForm.dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="handleEditRoomSubmit">确 定</el-button>
           </span>
        </el-dialog>
    </div>
</template>
<script>
import * as util from '../util/common.js'

export default {
    name: "BuildingManage",
    data() {
        var checkBuildingId = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择门诊楼'));
            }
            callback();

        };

        var checkFloorId = (rule, value, callback) => {
            console.log(value);
            if (value.length == 0) {
                return callback(new Error('请选择楼层'));
            }
            callback();

        };

/*        var checkFloorId = (rule, value, callback) => {
            console.log(value);
            if (value.length == 0) {
                return callback(new Error('请选择诊室'));
            }
            callback();

        };*/
        

        return {
            mainApi:util.mainApi,
            hospitalList: [], //医院信息
            activeName: 'building', //当前打开的tab页签
            //门诊楼管理
            buildingPage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber:1
            },
            buildingTableList: [],
            buildingQueryForm: {
                buildingName: "",
                hospitalId: ""
            },
            buildingAddForm: {
                dialogVisible: false,
                buildingName: "",
                hospitalId: ""
            },
            buildingModForm: {
                dialogVisible: false,
                id: "",
                buildingName: "",
                hospitalId: ""
            },
            buildingRule:{
                buildingName:[
                {
                    required:true,
                    message:"请输入门诊楼名称",
                    trigger:'blur'
                }]
            },


            // 楼层管理
            buildings:[],
            floorPage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber:1
            },
            floorTableList: [],
            floorQueryForm:{
                floorName:"",
                buildingId:[]
            },
            floorAddForm: {
                dialogVisible: false,
                floorName: "",
                buildingId: [],
                picUrl:""
            },

            floorModForm: {
                dialogVisible: false,
                id: "",
                floorName: "",
                buildingId: [],
                picUrl:""
            },
            floorRule:{
                floorName:[
                {
                    required:true,
                    message:"请输入楼层名称",
                    trigger:'blur'
                }],
                buildingId:[{
                    validator: checkBuildingId,
                    trigger: 'change'
                }]
            },

            // 诊室管理
            floors:[],
            roomPage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber:1
            },
            roomTableList: [],
            roomQueryForm:{
                name:"",
                floorId:[]
            },
            roomAddForm: {
                dialogVisible: false,
                name: "",
                floorId: [],
                picUrl:""
            },

            roomModForm: {
                dialogVisible: false,
                id: "",
                name: "",
                floorId: [],
                picUrl:""
            },
            roomRule:{
                name:[
                {
                    required:true,
                    message:"请输入门诊楼名称",
                    trigger:'blur'
                }],
                floorId:[{
                    validator: checkFloorId,
                    trigger: 'change'
                }]
            },
        }
    },
    created: function() {
        this.loadHospitalList();
        this.loadBuilding();
    },
    methods: {
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
        /**
         * tab切换操作
         * @param  {[type]} tab   [description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        handleTabsChangeClick: function(tab, event) {
            console.log(tab);

            if (this.activeName == 'building') {
                this.buildingQueryForm.hospitalId = "";
                this.handleResetBuildingQueryForm();

            } else if(this.activeName == 'floor'){
                this.floorQueryForm.floorName = "";
                this.floorQueryForm.buildingId = [];
                this.loadBuildings();
                this.loadFloor();

            }else{
                this.roomQueryForm.roomName = "";
                this.roomQueryForm.floorId = [];
                this.loadFloors();
                this.loadRoom();
            }
        },
        /**
         * 加载门诊楼    查询条件为  医院名称
         * @return {[type]} [description]
         */
        loadBuilding: function() {
            var _this = this;

            var loadBuildingSuccess = function(result) {
                _this.buildingTableList = result.buildingImformations;
                _this.buildingPage = result.page;
            }
            var obj = {
                hospitalId: this.buildingQueryForm.hospitalId,
                page: this.buildingPage
            }
            $.ajax({
                url: util.mainApi + "/select_building_ofhospital.do",
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
                            message: '查询所有门诊楼信息失败:' + loadBuildingResp.respMsg,
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
         * 添加门诊楼  显示页面操作
         * @return {[type]} [description]
         */
        handleAddBuilding: function() {
            this.buildingAddForm.buildingName = "";
            this.buildingAddForm.hospitalId = "";

            this.buildingAddForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['buildingAddFormRule'].resetFields();
            })
        },
        /**
         * 添加  门诊楼 提交操作
         * @return {[type]} [description]
         */
        handleAddBuildingSubmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    buildingName: _this.buildingAddForm.buildingName,
                    hospitalId: _this.buildingAddForm.hospitalId
                }
                $.ajax({
                    url: util.mainApi + "/insert_building.do",
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
                                message: '添加门诊楼信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.buildingAddForm.dialogVisible = false;
                        _this.$message({
                            message: '添加门诊楼信息成功',
                            type: 'success'
                        });
                        _this.loadBuilding();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['buildingAddFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 修改门诊楼   显示页面操作
         * @return {[type]} [description]
         */
        handleEditBuilding: function(index,building) {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/select_buildingById.do",
                type: "post",

                data: {
                    id: building.id
                },
                dataType: "json",
                success: function(editBuildingResp) {
                    if (editBuildingResp.respCode != "0") {
                        _this.$message({
                            message: '查询门诊楼信息失败:' + editBuildingResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = editBuildingResp.result;
                    _this.buildingModForm.id = result.id;
                    _this.buildingModForm.buildingName = result.buildingName;
                    _this.buildingModForm.hospitalId = result.hospitalId;

                    _this.buildingModForm.dialogVisible = true;
                }
            })
        },
        /**
         * 修改门诊楼  提交操作
         * @return {[type]} [description]
         */
        handleEditBuildingSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {

                _this.buildingModForm.dialogVisible = false;
                _this.$message({
                    message: '修改门诊楼信息成功',
                    type: 'success'
                });
                _this.loadBuilding();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.buildingModForm.id,
                    buildingName: _this.buildingModForm.buildingName,
                    hospitalId: _this.buildingModForm.hospitalId
                }
                $.ajax({
                    url: util.mainApi + "/mod_building.do",
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
                                message: '修改门诊楼信息失败:' + columnResp.respMsg,
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
            this.$refs['buildingModFormRule'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleDeleteBuilding:function(index,building){
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/del_building.do",
                    type: "post",
                    data: {
                        "id": building.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除门诊楼失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除门诊楼成功!'
                        });
                        _this.loadBuilding();

                    }
                })

            }
            this.$confirm('删除门诊楼将会同时删除此门诊楼下的楼层与诊室。确定删除此门诊楼?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },

        /**
         * 查询 门诊楼
         * @return {[type]} [description]
         */
        handleQueryBuilding: function() {
            this.loadBuilding();
        },
        
        /**
         * 重置门诊楼  查询操作
         * @return {[type]} [description]
         */
        handleResetBuildingQueryForm:function(){
            this.buildingQueryForm.hospitalId = "";
            this.buildingQueryForm.buildingName = "";
            this.loadBuilding();
        },

         /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleBuildingPageChange: function(val) {
            this.buildingPage.currentPage = val;
            this.loadBuilding();
        },
        /**
         * 查询下属的楼层
         * @param  {[type]} index    [description]
         * @param  {[type]} building [description]
         * @return {[type]}          [description]
         */
        handleQuerySubFloor:function(index,building){
            this.floorQueryForm.floorName = "";
            this.floorQueryForm.buildingId = [Number.parseInt(building.hospitalId),building.id+""];
            this.loadBuildings();
            this.loadFloor();
            this.activeName = 'floor';
        },


        /**
         * 楼 层数管理
         */
        /**
         * 加载 医院-》门诊楼 list 数据
         * @return {[type]} [description]
         */
        loadBuildings:function(){
            var _this = this;
            $.ajax({
                url: util.mainApi + "/select_building_underHos.do",
                type: "post",
                dataType: "json",
                success: function(buildingsResp) {
                    if (buildingsResp.respCode != "0") {
                        _this.$message({
                            message: '查询医生信息失败:' + buildingsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = buildingsResp.result;
                    _this.buildings = result;
                
                }
            })
        },
        /**
         * 加载楼层    查询条件为  医院名称
         * @return {[type]} [description]
         */
        loadFloor: function() {
            var _this = this;

            var loadFloorSuccess = function(result) {

                _this.floorTableList = result.buildingFloorResps;
                _this.floorPage = result.page;
            }
            var obj = {
                floorName:this.floorQueryForm.floorName?this.floorQueryForm.floorName:undefined,
                buildingId:this.floorQueryForm.buildingId[1],
                page: this.floorPage
            }
            $.ajax({
                url: util.mainApi + "/floor/select_building_ofhospital.do",
                type: "post",
                dataType: "json",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                // 获取服务器返回的json结果
                success: function(loadFloorResp) {
                    if (loadFloorResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有医生信息失败:' + loadFloorResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    loadFloorSuccess(loadFloorResp.result);
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        
        /**
         * 添加楼层  显示页面操作
         * @return {[type]} [description]
         */
        handleAddFloor: function() {
            this.floorAddForm.floorName = "";
            this.floorAddForm.buildingId = [];
            this.floorAddForm.picUrl = "";

            this.floorAddForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['floorAddFormRule'].resetFields();
            })
        },
        /**
         * 添加  楼层 提交操作
         * @return {[type]} [description]
         */
        handleAddFloorSubmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    floorName: _this.floorAddForm.floorName,
                    buildingId: _this.floorAddForm.buildingId[1],
                    picUrl: _this.floorAddForm.picUrl
                }
                $.ajax({
                    url: util.mainApi + "/floor/insert_buildingFloor.do",
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
                                message: '添加楼层信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.floorAddForm.dialogVisible = false;
                        _this.$message({
                            message: '添加楼层信息成功',
                            type: 'success'
                        });
                        _this.loadFloor();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['floorAddFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 修改楼层   显示页面操作
         * @return {[type]} [description]
         */
        handleEditFloor: function(index,floor) {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/floor/select_buildingFloorById.do",
                type: "post",

                data: {
                    id: floor.id
                },
                dataType: "json",
                success: function(editFloorResp) {
                    if (editFloorResp.respCode != "0") {
                        _this.$message({
                            message: '查询医生信息失败:' + editFloorResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = editFloorResp.result;
                    _this.floorModForm.id = result.id;
                    _this.floorModForm.floorName = result.floorName;
                    _this.floorModForm.buildingId = [Number.parseInt(result.hospitalId),result.buildingId+""];
                    _this.floorModForm.picUrl = result.picUrl;
                    console.log( _this.floorModForm);
                    _this.floorModForm.dialogVisible = true;
                }
            })
        },
        /**
         * 修改楼层  提交操作
         * @return {[type]} [description]
         */
        handleEditFloorSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {

                _this.floorModForm.dialogVisible = false;
                _this.$message({
                    message: '修改楼层信息成功',
                    type: 'success'
                });
                _this.loadFloor();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.floorModForm.id,
                    floorName: _this.floorModForm.floorName,
                    buildingId: _this.floorModForm.buildingId[1],
                    picUrl: _this.floorModForm.picUrl,
                }
                $.ajax({
                    url: util.mainApi + "/floor/mod_buildingFloor.do",
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
                                message: '修改楼层信息失败:' + columnResp.respMsg,
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
            this.$refs['floorModFormRule'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 删除楼层
         * @return {[type]} [description]
         */
        handleDeleteFloor:function(index,building){   
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/floor/del_buildingFloor.do",
                    type: "post",
                    data: {
                        "id": building.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除楼层失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除楼层成功!'
                        });
                        _this.loadFloor();

                    }
                })

            }
            this.$confirm('删除楼层将会同时删除此楼层下的诊室。确定删除此楼层?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        /**
         * 查询 楼层
         * @return {[type]} [description]
         */
        handleQueryFloor: function() {
            this.loadFloor();
        },
        
        /**
         * 重置楼层  查询操作
         * @return {[type]} [description]
         */
        handleResetFloorQueryForm:function(){
            this.floorQueryForm.floorName = "";
            this.floorQueryForm.buildingId = [];
            this.loadFloor();
        },


         /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleFloorPageChange: function(val) {
            this.floorPage.currentPage = val;
            this.loadFloor();
        },
        handleQuerySubRoom:function(index,floor){
            this.loadFloors();
            this.roomQueryForm.name = "";
            this.roomQueryForm.floorId = [Number.parseInt(floor.hospitalId),floor.buildingId,floor.id+""];
            this.loadRoom();
            
            this.activeName = 'room';
        },

        /**
         * 诊室管理
         */
        /**
         * 加载 医院-》门诊楼-》楼层 list 数据
         * @return {[type]} [description]
         */
        loadFloors:function(){
            var _this = this;
            $.ajax({
                url: util.mainApi + "/select_building_room_underHos.do",
                type: "post",
                dataType: "json",
                success: function(buildingsResp) {
                    if (buildingsResp.respCode != "0") {
                        _this.$message({
                            message: '查询医生信息失败:' + buildingsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = buildingsResp.result;
                    _this.floors = result;
                
                }
            })
        },
        /**
         * 加载诊室    查询条件为  医院名称
         * @return {[type]} [description]
         */
        loadRoom: function() {
            var _this = this;

            var loadRoomSuccess = function(result) {

                _this.roomTableList = result.buildingRoomResps;
                _this.roomPage = result.page;
            }
            var obj = {
                name: this.roomQueryForm.name?this.roomQueryForm.name:undefined,
                floorId: this.roomQueryForm.floorId[2],
                page: this.roomPage
            }
            $.ajax({
                url: util.mainApi + "/select_buildingRoom.do",
                type: "post",
                dataType: "json",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                // 获取服务器返回的json结果
                success: function(loadRoomResp) {
                    if (loadRoomResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有医生信息失败:' + loadRoomResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    loadRoomSuccess(loadRoomResp.result);
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        
        /**
         * 添加诊室  显示页面操作
         * @return {[type]} [description]
         */
        handleAddRoom: function() {
            this.roomAddForm.floorName = "";
            this.roomAddForm.hospitalId = "";

            this.roomAddForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['roomAddFormRule'].resetFields();
            })
        },
        /**
         * 添加  诊室 提交操作
         * @return {[type]} [description]
         */
        handleAddRoomSubmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    name: _this.roomAddForm.name,
                    floorId: _this.roomAddForm.floorId[2],
                    buildingId: _this.roomAddForm.floorId[1]
                }
                $.ajax({
                    url: util.mainApi + "/insert_buildingRoom.do",
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
                                message: '添加诊室信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.roomAddForm.dialogVisible = false;
                        _this.$message({
                            message: '添加诊室信息成功',
                            type: 'success'
                        });
                        _this.loadRoom();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['roomAddFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 修改诊室   显示页面操作
         * @return {[type]} [description]
         */
        handleEditRoom: function(index,room) {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/select_buildingRoomById.do",
                type: "post",

                data: {
                    id: room.id
                },
                dataType: "json",
                success: function(editFloorResp) {
                    if (editFloorResp.respCode != "0") {
                        _this.$message({
                            message: '查询医生信息失败:' + editFloorResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = editFloorResp.result;
                    _this.roomModForm.id = result.id;
                    _this.roomModForm.name = result.name;
                    _this.roomModForm.floorId = [Number.parseInt(result.hospitalId),result.buildingId,result.floorId+""];

                    _this.roomModForm.dialogVisible = true;
                }
            })
        },
        /**
         * 修改诊室  提交操作
         * @return {[type]} [description]
         */
        handleEditRoomSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {

                _this.roomModForm.dialogVisible = false;
                _this.$message({
                    message: '修改诊室信息成功',
                    type: 'success'
                });
                _this.loadRoom();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.roomModForm.id,
                    name: _this.roomModForm.name,
                    floorId: _this.roomModForm.floorId[2],
                    buildingId:_this.roomModForm.floorId[1]
                }
                $.ajax({
                    url: util.mainApi + "/mod_buildingRoom.do",
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
                                message: '修改诊室信息失败:' + columnResp.respMsg,
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
            this.$refs['roomModFormRule'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 删除诊室
         * @return {[type]} [description]
         */
        handleDeleteRoom:function(index,room){
            
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/del_buildingRoom.do",
                    type: "post",
                    data: {
                        "id": room.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除诊室失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除诊室成功!'
                        });
                        _this.loadRoom();

                    }
                })

            }
            this.$confirm('确定删除此诊室?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        /**
         * 查询 诊室
         * @return {[type]} [description]
         */
        handleQueryRoom: function() {
            this.loadRoom();
        },
        
        /**
         * 重置诊室  查询操作
         * @return {[type]} [description]
         */
        handleResetRoomQueryForm:function(){
            this.roomQueryForm.floorId = [];
            this.roomQueryForm.name = "";
            this.loadRoom();
        },


         /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleRoomPageChange: function(val) {
            this.roomPage.currentPage = val;
            this.loadRoom();
        },




        /**
         * 栏目 分页 每页页数 改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleArticlePageSizeChange: function(val) {
            this.articlePage.pageNumber = val;
            this.loadArticles();
        },
        /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleArticlePageChange: function(val) {
            this.articlePage.currentPage = val;
            this.loadArticles();
        },

        handlePictureModSuccess: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.floorModForm.picUrl = file.response.result.fis.url;
        },
        handlePictureAddSuccess: function(res, file) {
            this.floorAddForm.picUrl = file.response.result.fis.url;
        },
        beforeAvatarUpload: function(file) {
            console.log('beforeAvatarUpload', file);
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleOnChange: function(file) {
            console.log('handleOnChange', file);
        }
    },

    watch: {
        "$router": function() {

        }
    }
}
</script>
<style>
.popover-page {
    min-width: 600px !important;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
