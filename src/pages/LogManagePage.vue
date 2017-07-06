<template>
    <div class="panel">
        <div class="panel-heading">
            日志管理
        </div>
        <div class="panel-body">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabsChangeClick">
                <el-tab-pane label="接口日志" name="weixin">
                    <el-row>
                        <el-form :inline="true" :model="weixinForm" class="demo-form-inline">
                            <el-form-item label="医院名称:">
                                <el-input v-model="weixinForm.hospitalId" placeholder="医院id"></el-input>
                            </el-form-item>
                            <el-form-item label="接口响应:">
                                <el-select v-model="weixinForm.isSuccessful" placeholder="接口响应" style="width:150px;">
                                    <el-option label="成功" value="Y"></el-option>
                                    <el-option label="失败" value="N"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="时间段:">
                                <el-date-picker v-model="weixinForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                                <span>至</span>
                                <el-date-picker v-model="weixinForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleQueryWeixin">查询</el-button>
                                <el-button type="primary" @click="handleResetWeixinQueryForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row>
                        <el-table :data="weixinTable" style="width: 100%" :row-class-name="tableRowClassName">
                            <el-table-column type="expand">
                              <template scope="props">
                                <el-form label-position="left" class="demo-table-expand">
                                  <el-form-item label="请求参数">
                                    <span>{{ props.row.reqParam }}</span>
                                  </el-form-item>
                                  <el-form-item label="返回参数">
                                    <span>{{ props.row.respParam }}</span>
                                  </el-form-item>
                                </el-form>
                              </template>
                            </el-table-column>
                            <el-table-column prop="id" label="序号" width="180"></el-table-column>
                            <el-table-column prop="url" label="url"></el-table-column>
                            <!-- <el-table-column prop="reqParam" label="请求参数"></el-table-column>
                            <el-table-column prop="respParam" label="返回参数"></el-table-column> -->
                            <el-table-column label="响应结果" width="180">
                                <template scope="scope">
                                    <span v-if="scope.row.isSuccessful == 'Y'">成功</span>
                                    <span v-else style="color:#EC5B78;">失败</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="请求时间" width="230">
                                <template scope="scope">
                                    {{scope.row.callTime | formDate('yyyy-MM-dd hh:mm:ss') }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="hospitalId" label="医院id" width="180"></el-table-column>
                        </el-table>
                        <el-row style="margin-top: 20px;">
                            <el-pagination @size-change="handleWeixinPageSizeChange" @current-change="handleWeixinPageChange" :current-page="weixinForm.page.currentPage" :page-sizes="[10,30,50,100]" :page-size="weixinForm.page.pageNumber" layout="total, sizes, prev, pager, next, jumper" :total="weixinForm.page.totalNumber" style="float: right;">
                            </el-pagination>
                        </el-row>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="后台日志" name="second">
                    <el-row>
                        <el-form :inline="true" :model="consoleForm" class="demo-form-inline">
                            <el-form-item label="操作人:">
                                <el-input v-model="consoleForm.userName" placeholder="操作人"></el-input>
                            </el-form-item>
                            <el-form-item label="操作类型:">
                                <el-select v-model="consoleForm.operateType" placeholder="操作类型" style="width:150px;">
                                    <el-option :label="operateType.label" :value="operateType.value" v-for="operateType in operateTypeMap"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="时间段:">
                                <el-date-picker v-model="consoleForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                                <span>至</span>
                                <el-date-picker v-model="consoleForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleQueryConsole">查询</el-button>
                                <el-button type="primary" @click="handleResetConsoleQueryForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row>
                        <el-table :data="consoleTable" style="width: 100%">
                            <el-table-column prop="id" label="序号" width="180"></el-table-column>
                            <el-table-column prop="userName" label="用户" width="180"></el-table-column>
                            <el-table-column prop="operateTypeValue" label="操作类型" width="200"></el-table-column>
                            <el-table-column prop="operateValue" label="操作值"></el-table-column>
                            <el-table-column label="操作时间" width="240">
                                <template scope="scope">
                                    {{scope.row.operateTime | formDate('yyyy-MM-dd hh:mm:ss') }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row style="margin-top: 20px;">
                            <el-pagination @size-change="handleConsolePageSizeChange" @current-change="handleConsolePageChange" :current-page="consoleForm.page.currentPage" :page-sizes="[2,10,30,50,100]" :page-size="consoleForm.page.pageNumber" layout="total, sizes, prev, pager, next, jumper" :total="consoleForm.page.totalNumber" style="float: right;">
                            </el-pagination>
                        </el-row>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>

import * as util from '../util/common.js'

export default {
    name: "LogManage",
    data() {
        return {
            activeName: 'weixin',
            weixinForm: {
                hospitalId: "",
                isSuccessful: "",
                startTime: "",
                endTime: "",
                page: {
                    currentPage: 1,
                    pageNumber: 10,
                    totalNumber: 100
                }
            },
            consoleForm: {
                userName: "",
                operateType: "",
                startTime: "",
                endTime: "",
                page: {
                    currentPage: 1,
                    pageNumber: 10,
                    totalNumber: 100
                }
            },
            weixinTable: [],
            consoleTable: [],
            operateTypeMap: [{
                label: "添加用户",
                value: 'add_user'
            }, {
                label: "修改用户",
                value: 'mod_user'
            }, {
                label: "删除用户",
                value: 'del_user'
            },{
                label: "添加科室",
                value: 'add_dep'
            }, {
                label: "修改科室",
                value: 'mod_dep'
            }, {
                label: "删除科室",
                value: 'del_dep'
            },{
                label: "添加医生",
                value: 'add_doctor'
            }, {
                label: "修改医生",
                value: 'mod_doctor'
            }, {
                label: "删除医生",
                value: 'del_doctor'
            },{
                label: "添加新闻版块",
                value: 'add_section'
            }, {
                label: "修改新闻版块",
                value: 'mod_section'
            }, {
                label: "删除新闻版块",
                value: 'del_section'
            },{
                label: "添加新闻文章",
                value: 'add_article'
            }, {
                label: "修改新闻文章",
                value: 'mod_article'
            }, {
                label: "删除新闻文章",
                value: 'del_article'
            },{
                label: "添加医院就诊楼",
                value: 'add_building'
            }, {
                label: "修改医院就诊楼",
                value: 'mod_building'
            }, {
                label: "删除医院就诊楼",
                value: 'del_building'
            },{
                label: "添加医院就诊楼楼层",
                value: 'add_buildingFloor'
            }, {
                label: "修改医院就诊楼楼层",
                value: 'mod_buildingFloor'
            }, {
                label: "删除医院就诊楼楼层",
                value: 'del_buildingFloor'
            },{
                label: "添加就诊室",
                value: 'add_buildRoom'
            }, {
                label: "修改就诊室",
                value: 'mod_buildRoom'
            }, {
                label: "删除就诊室",
                value: 'del_buildRoom'
            },{
                label: "添加症状部位",
                value: 'add_symptomsite'
            }, {
                label: "修改症状部位",
                value: 'mod_symptomsite'
            }, {
                label: "删除症状部位",
                value: 'del_symptomsite'
            },{
                label: "添加症状",
                value: 'add_symptom'
            }, {
                label: "修改症状",
                value: 'mod_symptom'
            }, {
                label: "删除症状",
                value: 'del_symptom'
            }, {
                label: "登录",
                value: 'login'
            }]
        }
    },
    created: function() {
        this.loadWeixinTable();
    },
    methods: {
        formatDateTime: function(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var seconds = date.getSeconds();
            seconds = seconds < 10 ? ('0' + seconds) : seconds;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ":" + seconds;
        },
        /**
         * 重置 微信日志查询条件
         * @return {[type]} [description]
         */
        resetWeixinQueryForm: function() {
            this.weixinForm.hospitalId = "";
            this.weixinForm.isSuccessful = "";
            this.weixinForm.startTime = "";
            this.weixinForm.endTime = "";
        },
        /**
         * 重置 后台查询条件
         * @return {[type]} [description]
         */
        resetConsoleQueryForm: function() {
            this.consoleForm.userName = "";
            this.consoleForm.operateType = "";
            this.consoleForm.startTime = "";
            this.consoleForm.endTime = "";
        },
        /**
         * tab切换操作
         * @param  {[type]} tab   [description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        handleTabsChangeClick: function(tab, event) {
            console.log(tab);
            if (this.activeName == 'weixin') {
                this.weixinForm.page.currentPage = 1;
                this.resetWeixinQueryForm();
                this.loadWeixinTable();
            } else {
                this.consoleForm.page.currentPage = 1;
                this.resetConsoleQueryForm();
                this.loadConsoleTable();
            }
        },
        /**
         * 加载 平台日志
         * @return {[type]} [description]
         */
        loadWeixinTable: function() {
            var _this = this;
            var querySuccess = function(findWeixinResp) {
                _this.weixinTable = findWeixinResp.result.interfaceLogs;
                _this.weixinForm.page = findWeixinResp.result.page;
            }
            var obj = {
                hospitalId: this.weixinForm.hospitalId ? this.weixinForm.hospitalId : undefined,
                startTime: this.weixinForm.startTime ? this.formatDateTime(new Date(this.weixinForm.startTime)) : undefined,
                endTime: this.weixinForm.endTime ? this.formatDateTime(new Date(this.weixinForm.endTime)) : undefined,
                isSuccessful: this.weixinForm.isSuccessful ? this.weixinForm.isSuccessful : undefined,
                page: this.weixinForm.page
            }
            $.ajax({
                url: util.userApi+"/select_interfaceLog.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(findWeixinResp) {
                    if (findWeixinResp.respCode != '0') {
                        _this.$message({
                            message: '查询微信操作日志信息失败:' + findWeixinResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    querySuccess(findWeixinResp)
                }
            })
        },
        handleQueryWeixin: function() {
            console.log(this.weixinForm.startTime);
            //开始时间不能晚于截止时间
            var startTime = this.weixinForm.startTime;
            var endTime = this.weixinForm.endTime;
            if (startTime && endTime) {
                startTime = new Date(startTime).getTime();
                endTime = new Date(endTime).getTime();
                if (endTime < startTime) {
                    this.$message({
                        message: "截止时间不能早于开始时间",
                        type: "error"
                    })
                    return;
                }
            }
            this.loadWeixinTable();
        },
        /**
         * 微信接口分页 当前页切换
         * @return {[type]} [description]
         */
        handleWeixinPageChange: function(val) {
            this.weixinForm.page.currentPage = val;
            this.loadWeixinTable();
        },
        /**
         * 微信接口分页  每页页数切换
         * @return {[type]} [description]
         */
        handleWeixinPageSizeChange: function(val) {
            this.weixinForm.page.pageNumber = val;
            this.handleQueryWeixin();
        },

        handleResetWeixinQueryForm: function() {
            this.weixinForm.page.currentPage = 1;
            this.resetWeixinQueryForm();
            this.handleQueryWeixin();
        },
        tableRowClassName: function(row, index) {
            if (row.isSuccessful === 'N') {
                return 'error-row';
            }
            return '';
        },
        /**
         * 后台
         */
        /**
         * 加载后台日志信息
         * @return {[type]} [description]
         */
        loadConsoleTable: function() {
            var _this = this;

            // 查询后台日志数据成功操作
            var querySuccess = function(findConsoleResp) {
                _this.consoleTable = findConsoleResp.result.consoleLogComes;
                _this.consoleForm.page = findConsoleResp.result.page;
            }
            var obj = {
                userName: this.consoleForm.userName ? this.consoleForm.userName : undefined,
                operateType: this.consoleForm.operateType ? this.consoleForm.operateType : undefined,
                startTime: this.consoleForm.startTime ? this.formatDateTime(new Date(this.consoleForm.startTime)) : undefined,
                endTime: this.consoleForm.endTime ? this.formatDateTime(new Date(this.consoleForm.endTime)) : undefined,
                page: this.consoleForm.page
            }
            $.ajax({
                url: util.userApi+"/select_consoleLog.do",
                type: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(findConsoleResp) {
                    if (findConsoleResp.respCode != '0') {
                        _this.$message({
                            message: '查询后台操作日志信息失败:' + findConsoleResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    querySuccess(findConsoleResp)
                }
            })
        },
        validateConsoleOperateTime: function() {
            console.log(this.consoleForm.startTime);
            //开始时间不能晚于截止时间
            var startTime = this.consoleForm.startTime;
            var endTime = this.consoleForm.endTime;
            if (startTime != '' && endTime != '') {
                startTime = new Date(startTime).getTime();
                endTime = new Date(endTime).getTime();
                if (endTime < startTime) {
                    this.$message({
                        message: "截止时间不能早于开始时间",
                        type: "error"
                    })
                    return;
                }
            }
        },
        /**
         * 后台日志信息查询操作按钮
         * @return {[type]} [description]
         */
        handleQueryConsole: function() {
            this.consoleForm.page.currentPage = 1;
            this.validateConsoleOperateTime();
            this.loadConsoleTable();
        },
        /**
         * 后台分页 当前页切换
         * @return {[type]} [description]
         */
        handleConsolePageChange: function(val) {
            this.consoleForm.page.currentPage = val;
            this.validateConsoleOperateTime();
            this.loadConsoleTable();
        },
        /**
         * 后台分页  每页页数切换
         * @return {[type]} [description]
         */
        handleConsolePageSizeChange: function(val) {
            this.consoleForm.page.pageNumber = val;
            this.validateConsoleOperateTime();
            this.loadConsoleTable();
        },
        handleResetConsoleQueryForm: function() {
            this.consoleForm.page.currentPage = 1;
            this.resetConsoleQueryForm();
            this.loadConsoleTable();
        }
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
