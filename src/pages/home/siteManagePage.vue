<template>
    <div class="m-container">
        <!--  <div class="m-page-breadcrumb">
            <el-breadcrumb separator="/">
                  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="panel panel-default">
            <div class="panel-heading clearfix">
                <div class="panel-title pull-left">
                    站点管理
                </div>
            </div>
            <div class="panel-body">
                <el-row>
                    <el-form :inline="true" class="demo-form-inline">
                        <!-- <el-form-item label="角色名称：">
                            <el-input v-model="querySiteName"></el-input>
                        </el-form-item> -->
                        <el-form-item>
                            <!-- <el-button type="primary" @click="handleLoadSiteInfo">查询</el-button> -->
                            <!-- <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button> -->
                            <el-button type="success" icon="plus" @click="handleAddSiteHandler">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-table :data="siteTables" border style="width: 100%">
                    <el-table-column label="序号">
                        <template scope="scope">
                            <span>{{ scope.row.siteId }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="站点名称" width="200">
                        <template scope="scope">
                            <span>{{ scope.row.siteName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上一级站点">
                        <template scope="scope">
                            <span>{{ scope.row.parentId }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型">
                        <template scope="scope">
                            <span>{{ scope.row.siteType | siteTypeFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="前缀">
                        <template scope="scope">
                            <span>{{ scope.row.prifixUri }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300">
                        <template scope="scope">
                            <el-button size="small" @click="modifyRoleHandler(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="deleteSiteHandler(scope.row.siteId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="录入站点" v-model="showAddForm" size="tiny">
            <el-form :model="siteAddObj" :rules="siteObjRole" ref="validateSiteAddForm" label-width="120px" class="demo-roleForm">
                <el-form-item label="站点名称：" prop="siteName">
                    <el-input type="text" v-model="siteAddObj.siteName"></el-input>
                </el-form-item>
                <el-form-item label="上一级站点：" prop="parentId" required>
                    <el-select v-model="siteAddObj.parentId" placeholder="请选择" style="width: 200px;">
                        <el-option v-for="item in parentIds" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点类型：" prop="siteType" required>
                    <el-select v-model="siteAddObj.siteType" placeholder="请选择" style="width: 200px;">
                        <el-option v-for="item in siteTypes" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点前缀：" prop="prifixUri">
                    <el-input type="text" v-model="siteAddObj.prifixUri"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddForm = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitSiteAddForm()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改站点" v-model="showModForm" size="tiny">
            <el-form :model="siteModObj" :rules="siteObjRole" ref="validateSiteModForm" label-width="120px" class="demo-roleForm">
                <el-form-item label="站点名称：" prop="siteName">
                    <el-input type="text" v-model="siteModObj.siteName"></el-input>
                </el-form-item>
                <el-form-item label="上一级站点：" prop="parentId" required>
                    <el-select v-model="siteModObj.parentId" placeholder="请选择" style="width: 200px;">
                        <el-option v-for="item in parentIds" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点类型：" prop="siteType" required>
                    <el-select v-model="siteModObj.siteType" placeholder="请选择" style="width: 200px;">
                        <el-option v-for="item in siteTypes" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点前缀：" prop="prifixUri">
                    <el-input type="text" v-model="siteModObj.prifixUri"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showModForm = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitSiteModForm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    mapGetter
} from "vuex";

var siteTypes = [];
export default {
    name: "SiteManagePage",
    data() {
        var checkParentId = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择上一级站点。'));
            }
            callback();

        };

        var checkSiteType = (rule, value, callback) => {
            console.log(value);
            if (value.length == 0) {
                return callback(new Error('请选择站点类型。'));
            }
            callback();

        };

        return {
            siteTypes: [], //站点类型数据
            parentIds: [], //站点主站数据
            querySiteName: "", //查询的站点名称
            siteTables: [], //站点数据
            showAddForm: false,
            siteAddObj: {
                // showRoleForm: false, // 是否显示添加页面
                siteName: "",
                parentId: "",
                siteType: "",
                prifixUri: ""
            },
            showModForm: false,
            siteModObj: {
                siteId: "",
                siteName: "",
                parentId: "",
                siteType: "",
                prifixUri: ""
            },
            siteObjRole: {
                siteName: [{
                    required: !0,
                    message: "请输入站点名称",
                    trigger: "blur"
                }],
                prifixUri: [{
                    required: !0,
                    message: "请输入站点前缀",
                    trigger: "blur"
                }],
                parentId: [{
                    validator: checkParentId,
                    trigger: "change"
                }],
                siteType: [{
                    validator: checkSiteType,
                    trigger: "change"
                }]
            }
        }
    },
    created() {
        this.loadSiteTypes();
        this.loadParentIds();
        //初始化根据用户类型查询站点信息
        this.loadSiteListByUserType();
    },
    methods: {
        loadParentIds: function() {
            this.parentIds = [{
                label: "无上一级站点",
                value: 0
            }, {
                label: "主站",
                value: 2
            }];
        },
        loadSiteTypes: function() {
            siteTypes = this.siteTypes = [{
                label: "主站",
                value: 1
            }, {
                label: "子站",
                value: 2
            }, {
                label: "虚拟子站",
                value: 3
            }];
        },
        /**
         * 查询站点信息
         * @return {[type]} [description]
         */
        handleLoadSiteInfo: function() {
            var obj = {
                siteName: _this.siteAddObj.siteName,
                parentId: _this.siteAddObj.parentId,
                siteType: _this.siteAddObj.siteType,
                prifixUri: _this.siteAddObj.prifixUri
            };

            this.$fetch("/select_by_user").then(resp => {
                if (resp.respCode != "0") {
                    this.$message({
                        message: '查询站点信息失败:' + resp.respMsg,
                        type: 'error'
                    });
                    return;
                }

                this.siteTables = resp.data.result;
            })
        },
        /**
         * 加载站点信息
         * @return {[type]} [description]
         */
        loadSiteListByUserType: function() {
            // var obj = {
            //     siteName: _this.siteAddObj.siteName,
            //     parentId: _this.siteAddObj.parentId,
            //     siteType: _this.siteAddObj.siteType,
            //     prifixUri: _this.siteAddObj.prifixUri
            // };

            this.$fetch("/user/select_by_user.do").then(resp => {
                if (resp.respCode != "0") {
                    _this.$message({
                        message: '查询站点信息失败:' + resp.respMsg,
                        type: 'error'
                    });
                    return;
                }

                this.siteTables = resp.result;
            })
        },
        /**
         * 初始化及显示添加站点页面
         * @return {[type]} [description]
         */
        handleAddSiteHandler: function() {
            var _this = this;
            // this.role.openNum += 1;
            //清除校验与初始化
            this.siteAddObj = {
                siteName: "",
                parentId: "",
                siteType: "",
                prifixUri: ""
            };
            this.showAddForm = true;
            this.$nextTick(function() {


                this.$refs['validateSiteAddForm'].resetFields();

            });

        },

        /**
         * 添加站点提交按钮
         * @return {[type]} [description]
         */
        handleSubmitSiteAddForm: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    siteName: _this.siteAddObj.siteName,
                    parentId: _this.siteAddObj.parentId,
                    siteType: _this.siteAddObj.siteType,
                    prifixUri: _this.siteAddObj.prifixUri
                };

                _this.$fetch("/user/insert_site.do", obj).then(resp => {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '添加站点信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.showAddForm = false;
                    _this.$message({
                        message: '添加站点信息成功',
                        type: 'success'
                    });
                    _this.loadSiteListByUserType();
                })


            }
            this.$refs['validateSiteAddForm'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },

        modifyRoleHandler: function(column) {
            var _this = this;
            $.ajax({
                url: "http://localhost:8080/jsghx-console" + "/user/select_by_siteid.do",
                type: "post",
                data: {
                    siteId: column.siteId
                },
                dataType: "json",
                success: function(resp) {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '查询栏目信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = resp.result;
                    _this.siteModObj.siteId = result.siteId;

                    _this.siteModObj.siteName = result.siteName;
                    _this.siteModObj.parentId = result.parentId;
                    _this.siteModObj.siteType = result.siteType;
                    _this.siteModObj.prifixUri = result.prifixUri;
                    _this.showModForm = true;

                }
            });


        },
        /**
         * 修改站点提交按钮
         * @return {[type]} [description]
         */
        handleSubmitSiteModForm: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    siteId: _this.siteModObj.siteId,
                    siteName: _this.siteModObj.siteName,
                    parentId: _this.siteModObj.parentId,
                    siteType: _this.siteModObj.siteType,
                    prifixUri: _this.siteModObj.prifixUri
                };

                _this.$fetch("/user/update_site.do", obj).then(resp => {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '修改站点信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.showModForm = false;
                    _this.$message({
                        message: '修改站点信息成功',
                        type: 'success'
                    });
                    _this.loadSiteListByUserType();
                })


            }
            this.$refs['validateSiteModForm'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 删除站点操作  
         * @param  {[type]} siteId [站点ID]
         * @return {[type]}        [description]
         */
        deleteSiteHandler: function(siteId) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: "http://localhost:8080/jsghx-console" + "/user/delete_site.do",
                    type: "post",
                    data: {
                        siteId: siteId
                    },
                    dataType: "json",
                    success: function(resp) {

                        if (resp.respCode != "0") {
                            _this.$message({
                                message: '删除站点失败:' + resp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadSiteListByUserType();
                    }
                })

            }
            this.$confirm('确定删除此站点?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        }
    },
    filters: {
        siteTypeFilter: (value) => {
            if (!value) return '';
            for(var i=0,ileng=siteTypes.length;i<ileng;i++){
                if(value == siteTypes[i].value){
                    return siteTypes[i].label
                }
            }
        }
      }
}
</script>
<style lang="less" src="less/pages/siteManage.less">
</style>
