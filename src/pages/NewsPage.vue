<template>
    <div class="panel xs-news">
        <el-row v-show='!showArticle'>
            <div class="panel-heading">
                栏目管理
            </div>
            <div class="panel-body">
                <el-tabs v-model="activeName" type="card" @tab-click="handleTabsChangeClick">
                    <el-tab-pane label="栏目管理" name="column">
                        <el-row>
                            <el-form :inline="true" :model="consoleQueryForm" class="demo-form-inline">
                                <el-form-item label="医院名称:">
                                    <el-select v-model="consoleQueryForm.hospitalId" placeholder="请选择医院">
                                        <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handleQueryColumn">查询</el-button>
                                    <el-button type="primary" @click="handleResetColumnQueryForm">重置</el-button>
                                    <el-button type="success" icon="plus" @click="handleAddColumn">添加</el-button>
                                </el-form-item>
                            </el-form>
                        </el-row>
                        <el-row>
                            <el-table :data="columnsTable" style="width: 100%">
                                <el-table-column prop="name" label="栏目名称" width="180"></el-table-column>
                                <el-table-column prop="hospitalName" label="医院名称" width="300">
                                    <template scope="scope">
                                        <div class="pc-news__hospitals" :title="scope.row.hospitalName">
                                            {{scope.row.hospitalName}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="description" label="描述"></el-table-column>
                                <el-table-column label="操作" width="300">
                                    <template scope="scope">
                                        <el-button size="small" v-if="scope.row.description != '本栏目目前不可操作'" @click="handleEditColumn(scope.$index, scope.row)">编辑</el-button>
                                        <el-button size="small" v-if="scope.row.description != '本栏目目前不可操作'" @click="handleQuerySubArticle(scope.$index, scope.row)">下属文章</el-button>
                                        <el-button size="small" v-if="scope.row.description != '本栏目目前不可操作'" type="danger" @click="handleDeleteColumn(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                        <el-row style="margin-top: 20px;">
                            <el-pagination @size-change="handleColumnPageSizeChange" @current-change="handleColumnPageChange" :current-page="columnPage.currentPage" :page-size="columnPage.pageNumber" layout="total, prev, pager, next, jumper" :total="columnPage.totalNumber" style="float: right;">
                            </el-pagination>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="文章管理" name="article">
                        <el-row>
                            <el-form :inline="true" :model="articleQueryForm" class="demo-form-inline">
                                <el-form-item label="标题:">
                                    <el-input v-model="articleQueryForm.header" placeholder="文章标题" style="width:150px;"></el-input>
                                </el-form-item>
                                <el-form-item label="栏目:">
                                    <el-cascader expand-trigger="hover" :options="sections" v-model="articleQueryForm.sectionId"> </el-cascader>
                                    <!-- <el-select v-model="articleQueryForm.sectionId" placeholder="请选择" @change="changePic">
                                        <el-option v-for="item in sections" :label="item.name" :value="item.id"></el-option>
                                    </el-select> -->
                                </el-form-item>
                                <!-- <el-form-item label="医院:">
                                    
                                    <el-select v-model="articleQueryForm.hospitalId" placeholder="请选择">
                                         <el-option v-for="item in hospitalList" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item> -->
                                <el-form-item label="时间段:">
                                    <el-date-picker v-model="articleQueryForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                                    <span>至</span>
                                    <el-date-picker v-model="articleQueryForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handleQueryArticle">查询</el-button>
                                    <el-button type="primary" @click="handleResetArticleQueryForm">重置</el-button>
                                    <el-button type="success" icon="plus" @click="handleAddArticle">添加</el-button>
                                </el-form-item>
                            </el-form>
                        </el-row>
                        <el-row>
                            <el-table :data="articleTable" style="width: 100%">
                                <el-table-column prop="header" label="文章标题" width="200"></el-table-column>
                                <el-table-column label="图片" width="160">
                                    <template scope="scope">
                                        <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="60" height="60">
                                        <span v-if="!scope.row.picUrl">暂无图片</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="contentUrl" label="链接地址"></el-table-column>
                                <el-table-column prop="sectionName" label="栏目名称" width="150"></el-table-column>
                                <el-table-column label="创建时间" width="240">
                                    <template scope="scope">
                                        {{scope.row.createTime | formDate('yyyy-MM-dd hh:mm:ss') }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="200">
                                    <template scope="scope">
                                        <el-button size="small" @click="handleEditArticle(scope.$index, scope.row)">编辑</el-button>
                                        <el-button size="small" type="danger" @click="handleDeleteArticle(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row style="margin-top: 20px;">
                                <el-pagination @current-change="handleArticlePageChange" :current-page="articlePage.currentPage" :page-size="articlePage.pageNumber" layout="total, prev, pager, next, jumper" :total="articlePage.totalNumber" style="float: right;">
                                </el-pagination>
                            </el-row>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-row>
        <el-row v-if="showArticle">
            <div class="panel-heading" style="margin-bottom: 20px;">
                <span v-text="articleAddForm.title">添加文章</span>
                <div style="position:absolute;top: 10px;right: 20px;">
                    <el-button @click="showArticle = false">返 回</el-button>
                    <el-button type="success" @click="handleAddArticleSubmmit">提 交</el-button>
                </div>
            </div>
            <el-form label-width="120px" :model="articleAddForm" :rules="articleRule" ref="ArticleAddFormRule">
                <el-form-item label="文章标题:" prop="header">
                    <el-input v-model="articleAddForm.header" style="width:300px;"></el-input>
                </el-form-item>
                <el-form-item label="栏目:" prop="sectionId" required>
                    <el-cascader expand-trigger="hover" :options="sections" v-model="articleAddForm.sectionId" @change="changePic"> </el-cascader>
                    <!--  <el-select v-model="articleAddForm.sectionId" placeholder="请选择" @change="changePic">
                        <el-option v-for="item in sections" :label="item.name" :value="item.id"></el-option>
                    </el-select> -->
                </el-form-item>
                <!--  <el-form-item label="医院" prop="sectionId">
                    <el-select v-model="articleAddForm.hospitalIds" multiple placeholder="请选择">
                        <el-option v-for="item in hospitalInSec" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="图片:" prop="picUrl">
                        <el-upload class="avatar-uploader" :class="picSize" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="removeUpload">
                            <img v-if="articleAddForm.picUrl" :src="articleAddForm.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span class="tips" v-if="articleAddForm.sectionId[1] == '1'">
                            *  建议图片大小为85*72
                        </span>
                        <span class="tips" v-if="articleAddForm.sectionId[1] == '2'">
                            *  建议图片大小为75*80
                        </span>
                        <span class="tips" v-else>
                            *  建议图片大小为375*112
                        </span>
                    </el-form-item> -->
                <el-form-item label="图片:" prop="picUrl">
                    <vue-core-image-upload :disWidth="picWidth" :disHeight="picHeight" crop="server" :url="mainApi + '/news_article/upload_pictures.do'" extensions="png,gif,jpeg,jpg" @imageuploaded="imageuploaded" @errorhandle="handleError" cropRatio="auto" :picUrl="articleAddForm.picUrl">
                        
                    </vue-core-image-upload>
                    <span class="tips">
                        * 建议图片大小为{{picWidth}}*{{picHeight}}
                    </span>
                </el-form-item>
                <el-form-item label="摘要:" prop="summary">
                    <el-input type="textarea" autosize v-model="articleAddForm.summary" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="文章链接地址:" prop="content">
                    <el-input type="text" v-model="articleAddForm.contentUrl" style="width:500px;"></el-input>
                    <!-- <el-row :gutter="20">
                        <el-col :span="10">
                            <quill-editor ref="myTextEditor" v-model="articleAddForm.content" :config="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
                            </quill-editor>
                        </el-col>
                        <el-col :span="10" class="ql-snow">
                            <div v-html="articleAddForm.content" class="article-content ql-editor" style="padding: 20px;border:1px solid #f6f6f6;border-radius:5px;"></div>
                        </el-col>
                    </el-row> -->
                </el-form-item>
            </el-form>
            <el-row>
            </el-row>
        </el-row>
        <el-dialog title="添加栏目" v-model="columnForm.dialogVisible" size="tiny" custom-class="popover-page">
            <div>
                <el-form label-width="80px" :model="columnForm" :rules="columnRule" ref="columnFormRule">
                    <el-form-item label="名字" prop="name">
                        <el-input v-model="columnForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="医院" prop="hospitalId">
                        <el-select v-model="columnForm.hospitalId" placeholder="请选择医院" multiple>
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="text" v-model="columnForm.description"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="columnForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddColumnSubmmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改栏目" v-model="columnModForm.dialogVisible" size="tiny">
            <div>
                <el-form label-width="80px" :model="columnModForm" :rules="columnRule" ref="ModifyColumnsForm">
                    <el-form-item label="名字" prop="name">
                        <el-input v-model="columnModForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="医院" prop="hospitalId">
                        <el-select v-model="columnModForm.hospitalId" placeholder="请选择医院" multiple>
                            <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitalList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="text" v-model="columnModForm.description"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modDoctorForm.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditColumnSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="添加文章" v-model="articleAddForm.dialogVisible" size="tiny" custom-class="popover-page">
                <div>
                    <el-form label-width="120px" :model="articleAddForm" :rules="articleRule" ref="ArticleAddFormRule">
                        <el-form-item label="文章标题:" prop="header">
                            <el-input v-model="articleAddForm.header"></el-input>
                        </el-form-item>
                        <el-form-item label="图片" prop="picurl">
                            <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                <img v-if="articleAddForm.picUrl" :src="articleAddForm.picUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="文章链接地址:" prop="contentUrl">
                            <el-input type="text" v-model="articleAddForm.contentUrl"></el-input>
                            <quill-editor ref="myTextEditor" v-model="articleAddForm.contentUrl" :config="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
                            </quill-editor>
                        </el-form-item>
                        <el-form-item label="栏目" prop="sectionId" required>
                            <el-cascader expand-trigger="hover" :options="sections" v-model="articleAddForm.sectionId"> </el-cascader>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="articleAddForm.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddArticleSubmmit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="修改文章" v-if="articleModForm.dialogVisible" v-model="articleModForm.dialogVisible" size="tiny">
                <div>
                    <el-form label-width="120px" :model="articleModForm" :rules="articleRule" ref="articleModFormRule">
                        <el-form-item label="文章标题" prop="header">
                            <el-input v-model="articleModForm.header"></el-input>
                        </el-form-item>
                        <el-form-item label="图片" prop="picurl">
                            <el-upload class="avatar-uploader" :action="mainApi+'/news_article/upload_picture.do'" :show-file-list="false" :on-success="handlePictureSuccess" :before-upload="beforeAvatarUpload" :on-change="handleOnChange">
                                <img v-if="articleModForm.picUrl" :src="articleModForm.picUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="栏目:" prop="sectionId" required>
                            <el-cascader expand-trigger="hover" :options="sections" v-model="articleModForm.sectionId"> </el-cascader>
                        </el-form-item>
                        <el-form-item label="文章链接地址:" prop="contentUrl">
                            <el-input type="text" v-model="articleModForm.contentUrl"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                   <el-button @click="articleModForm.dialogVisible = false">取 消</el-button>
                   <el-button type="primary" @click="handleEditArticleSubmit">确 定</el-button>
               </span>
            </el-dialog> -->
    </div>
</template>
<script>
import * as util from '../util/common.js'
import {
    quillEditor
} from 'vue-quill-editor';
import VueCoreImageUpload from '../components/vue-upload';
// import VueCoreImageUpload from 'vue-core-image-upload';

export default {
    name: "LogManage",
    data() {
        var checkHospitalId = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择医院'));
            }
            callback();

        };

        var checksectionId = (rule, value, callback) => {
            console.log(value);
            if (value.length == 0) {
                return callback(new Error('请选择栏目'));
            }
            callback();

        };

        return {

            mainApi: util.mainApi,
            hospitalList: [],
            activeName: "column",
            columnsTable: [],
            columnPage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 100
            },
            columnForm: {
                dialogVisible: !1,
                name: "",
                hospitalId: "",
                description: ""
            },
            columnModForm: {
                dialogVisible: !1,
                id: "",
                name: "",
                hospitalId: "",
                description: ""
            },
            consoleQueryForm: {
                hospitalId: ""
            },
            columnRule: {
                name: [{
                    required: !0,
                    message: "请输入用户名",
                    trigger: "blur"
                }],
                hospitalId: [{
                    validator: checkHospitalId,
                    trigger: "change"
                }]
            },
            sections: [],
            articleTable: [],
            articlePage: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 1
            },
            articleAddForm: {
                title: "",
                dialogVisible: !1,
                id: "",
                summary: "",
                header: "",
                picUrl: "",
                content: "",
                contentUrl: "",
                sectionId: "",
                picInsertUrl: ""
            },
            articleModForm: {
                dialogVisible: !1,
                id: "",
                header: "",
                picUrl: "",
                contentUrl: "",
                sectionId: ""
            },
            articleQueryForm: {
                header: "",
                sectionId: [],
                startTime: "",
                endTime: ""
            },
            articleRule: {
                header: [{
                    required: !0,
                    message: "请输入标题",
                    trigger: "blur"
                }],
                hospitalId: [{
                    validator: checkHospitalId,
                    trigger: "change"
                }],
                contentUrl: [{
                    required: !0,
                    message: "请输入文章地址",
                    trigger: "blur"
                }],
                sectionId: [{
                    validator: checksectionId,
                    trigger: "change"
                }],
                picUrl: [{
                    required: !0,
                    message: "请添加图片",
                    trigger: "change"
                }],
                summary: [{
                    required: !0,
                    message: "请输入摘要",
                    trigger: "change"
                }]
            },
            editorOption: {
                modules: {
                    toolbar: {
                        container: [
                            ["bold", "italic", "underline", "strike"],
                            [{
                                header: 1
                            }, {
                                header: 2
                            }],
                            [{
                                list: "ordered"
                            }, {
                                list: "bullet"
                            }],
                            [{
                                script: "sub"
                            }, {
                                script: "super"
                            }],
                            [{
                                indent: "-1"
                            }, {
                                indent: "+1"
                            }],
                            [{
                                direction: "rtl"
                            }],
                            [{
                                size: ["small", !1, "large", "huge"]
                            }],
                            [{
                                header: [1, 2, 3, 4, !1]
                            }],
                            [{
                                color: []
                            }, {
                                background: []
                            }],
                            [{
                                font: []
                            }],
                            [{
                                align: []
                            }],
                            ["clean"],
                            ["link", "image"]
                        ]
                    }
                },
                placeholder: "微信文章内容"
            },
            showArticle: !1,
            addOrEdit: !0,
            picHeight: 500,
            picWidth: 950
        }
    },
    created: function() {
        this.loadHospitalList();
        this.handleResetColumnQueryForm();
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
                    if ("0" != deptsResp.respCode)
                        return _this.$message({
                            message: "查询所有医院信息失败:" + deptsResp.respMsg,
                            type: "error"
                        });
                    _this.hospitalList = deptsResp.result

                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 加载所有的栏目信息
         * @return {[type]} [description]
         */
        loadSectionList: function() {

            var _this = this;
            $.ajax({
                url: util.mainApi + "/news_section/select_all_sectionUnderHos.do",
                type: "post",
                dataType: "json",
                // 获取服务器返回的json结果
                success: function(deptsResp) {
                    if (deptsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有栏目信息失败:' + deptsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    var result = deptsResp.result;
                    /*var arr = [];
                    for (var i = 0, leng = result.length; i < leng; i++) {
                        var arrObj = {
                            label: result[i].hospitalName,
                            value: result[i].id,
                            children: []
                        }
                        for (var j = 0, jleng = result[i].newsSections.length; j < jleng; j++) {
                            var jarrObj = {
                                label: result[i].newsSections[j].name,
                                value: result[i].newsSections[j].id
                            }
                            arrObj.children.push(jarrObj);
                        }
                        arr.push(arrObj);
                    }*/
                    _this.sections = result;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },

        /**
         * 加载 所有的栏目
         * @return {[type]} [description]
         */
        loadColumns: function() {
            var _this = this;
            var obj = {
                hospitalId: this.consoleQueryForm.hospitalId,
                page: this.columnPage
            }
            $.ajax({
                url: util.mainApi + "/news_section/select_section.do",
                type: "post",
                dataType: "json",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                // 获取服务器返回的json结果
                success: function(columnsResp) {
                    if (columnsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有栏目信息失败:' + columnsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }

                    _this.columnsTable = columnsResp.result.sectionInfos;
                    _this.columnPage = columnsResp.result.page;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 显示添加栏目 页面
         * @return {[type]} [description]
         */
        handleAddColumn: function() {
            this.columnForm.name = "";
            this.columnForm.description = "";
            this.columnForm.deptId = [];
            this.columnForm.pic = "";

            this.columnForm.dialogVisible = true;
            this.$nextTick(function() {
                this.$refs['columnFormRule'].resetFields();
            })
        },
        /**
         * [handleAddDoctorSubmmit description]
         * @return {[type]} [description]
         */
        handleAddColumnSubmmit: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    name: _this.columnForm.name,
                    hospitalId: _this.columnForm.hospitalId,
                    description: _this.columnForm.description,
                }
                $.ajax({
                    url: util.mainApi + "/news_section/insert_section.do",
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
                                message: '添加栏目信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.columnForm.dialogVisible = false;
                        _this.$message({
                            message: '添加栏目信息成功',
                            type: 'success'
                        });
                        _this.loadColumns();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });

            }
            this.$refs['columnFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 显示修改栏目 信息页面
         * @param  {[type]} index  [description]
         * @param  {[type]} column [description]
         * @return {[type]}        [description]
         */
        handleEditColumn: function(index, column) {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/news_section/select_section_byid.do",
                type: "post",

                data: {
                    id: column.id
                },
                dataType: "json",
                success: function(columnResp) {
                    if (columnResp.respCode != "0") {
                        _this.$message({
                            message: '查询栏目信息失败:' + columnResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = columnResp.result;
                    _this.columnModForm.id = result.id;
                    _this.columnModForm.name = result.name;
                    _this.columnModForm.description = result.description;
                    _this.columnModForm.hospitalId = result.hospitalId;
                    _this.columnModForm.dialogVisible = true;
                }
            })
        },
        /**
         * 修改 栏目信息 提交操作
         * @return {[type]} [description]
         */
        handleEditColumnSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {
                if (columnResp.respCode != "0") {
                    _this.$message({
                        message: '修改栏目信息失败:' + columnResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                _this.columnModForm.dialogVisible = false;
                _this.$message({
                    message: '修改栏目信息成功',
                    type: 'success'
                });
                _this.loadColumns();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.columnModForm.id,
                    name: _this.columnModForm.name,
                    hospitalId: _this.columnModForm.hospitalId,
                    description: _this.columnModForm.description
                }
                $.ajax({
                    url: util.mainApi + "/news_section/update_section.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(columnResp) {

                        submitSuccess(columnResp);
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }
            this.$refs['ModifyColumnsForm'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 栏目 删除栏目操作
         * @param  {[type]} index  [description]
         * @param  {[type]} column [description]
         * @return {[type]}        [description]
         */
        handleDeleteColumn: function(index, column) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/news_section/del_section.do",
                    type: "post",
                    data: {
                        "id": column.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除栏目失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadColumns();

                    }
                })

            }
            this.$confirm('确定删除此栏目?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        /**
         * 栏目  查询操作
         * @return {[type]} [description]
         */
        handleQueryColumn: function() {
            this.loadColumns();
        },
        /**
         * 栏目  重置查询操作
         * @return {[type]} [description]
         */
        handleResetColumnQueryForm: function() {
            this.consoleQueryForm.hospitalId = "";
            this.loadColumns();
        },
        /**
         * 栏目 分页 每页页数 改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleColumnPageSizeChange: function(val) {
            this.columnPage.pageNumber = val;
            this.loadColumns();
        },
        /**
         * 栏目 分页 页码改变操作
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleColumnPageChange: function(val) {
            this.columnPage.currentPage = val;
            this.loadColumns();
        },

        handleQuerySubArticle: function(index, column) {
            var sectionId = column.id;
            this.activeName = 'article';
            this.articleQueryForm.sectionId = [column.hospitalId + "", sectionId + ""];
            this.loadSectionList()
            this.loadArticles();
        },


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
         * 加载 所有的栏目
         * @return {[type]} [description]
         */
        loadArticles: function() {
            var _this = this;
            var obj = {
                sectionId: this.articleQueryForm.sectionId.leng == 0 ? undefined : this.articleQueryForm.sectionId[1],
                header: this.articleQueryForm.header ? this.articleQueryForm.header : undefined,
                startTime: this.articleQueryForm.startTime ? this.formatDateTime(new Date(this.articleQueryForm.startTime)) : undefined,
                endTime: this.articleQueryForm.endTime ? this.formatDateTime(new Date(this.articleQueryForm.endTime)) : undefined,
                page: this.articlePage
            }
            $.ajax({
                url: util.mainApi + "/news_article/select_article.do",
                type: "post",
                dataType: "json",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(obj),
                // 获取服务器返回的json结果
                success: function(columnsResp) {
                    if (columnsResp.respCode != "0") {
                        _this.$message({
                            message: '查询所有文章信息失败:' + columnsResp.respMsg,
                            type: 'error'
                        });
                        return;
                    }

                    _this.articleTable = columnsResp.result.articleInfos;
                    _this.articlePage = columnsResp.result.page;
                },
                error: function() {
                    console.log("加载错误!");
                }
            });
        },
        /**
         * 显示添加栏目 页面
         * @return {[type]} [description]
         */
        handleAddArticle: function() {
            this.articleAddForm.title = "添加文章";
            this.articleAddForm.header = "";
            this.articleAddForm.contentUrl = "";
            this.articleAddForm.sectionId = [];
            this.articleAddForm.picUrl = "";
            this.articleAddForm.summary = "";


            this.addOrEdit = true;
            this.showArticle = true;
            this.$nextTick(function() {
                this.$refs['ArticleAddFormRule'].resetFields();
            })


        },
        /**
         * [handleAddDoctorSubmmit description]
         * @return {[type]} [description]
         */
        handleAddArticleSubmmit: function() {
            var _this = this;
            /**
             * 添加文章
             */
            var addArticle = function() {
                var obj = {
                    header: _this.articleAddForm.header,
                    picUrl: _this.articleAddForm.picUrl,
                    contentUrl: _this.articleAddForm.contentUrl,
                    summary: _this.articleAddForm.summary,
                    sectionId: _this.articleAddForm.sectionId[1],
                }
                $.ajax({
                    url: util.mainApi + "/news_article/confirm_sub.do",
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
                                message: '添加文章信息失败:' + operatorsResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        _this.showArticle = false;
                        _this.$message({
                            message: '添加文章信息成功',
                            type: 'success'
                        });
                        _this.loadArticles();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }

            /**
             * 修改文章
             * @return {[type]} [description]
             */
            var updateArticle = function() {
                var obj = {
                    id: _this.articleAddForm.id,
                    header: _this.articleAddForm.header,
                    picUrl: _this.articleAddForm.picUrl,
                    contentUrl: _this.articleAddForm.contentUrl,
                    summary: _this.articleAddForm.summary,
                    sectionId: _this.articleAddForm.sectionId[1],
                    contentUrl: _this.articleAddForm.contentUrl,


                }
                $.ajax({
                    url: util.mainApi + "/news_article/update_article.do",
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
                                message: '修改文章信息失败:' + columnResp.respMsg,
                                type: 'error'
                            });
                            return;
                        }
                        //_this.articleAddForm.dialogVisible = false;
                        _this.$message({
                            message: '修改文章信息成功',
                            type: 'success'
                        });
                        _this.showArticle = false;
                        _this.loadArticles();
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }
            let validateSuccess = function() {

                if (_this.addOrEdit == true) {
                    addArticle();
                } else {
                    updateArticle();
                }


            }
            this.$refs['ArticleAddFormRule'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 显示修改文章 信息页面
         * @param  {[type]} index  [description]
         * @param  {[type]} column [description]
         * @return {[type]}        [description]
         */
        handleEditArticle: function(index, article) {
            var _this = this;
            $.ajax({
                url: util.mainApi + "/news_article/select_article_byid.do",
                type: "post",
                data: {
                    id: article.id
                },
                dataType: "json",
                success: function(columnResp) {
                    if (columnResp.respCode != "0") {
                        _this.$message({
                            message: '查询文章信息失败:' + columnResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    var result = columnResp.result;
                    _this.articleAddForm.title = "修改文章：" + result.newsArticleReq.header;
                    _this.articleAddForm.id = result.newsArticleReq.id;
                    _this.articleAddForm.header = result.newsArticleReq.header;
                    _this.articleAddForm.contentUrl = result.newsArticleReq.contentUrl;
                    _this.articleAddForm.sectionId = [result.hospitalId + "", result.newsArticleReq.sectionId + ""];
                    _this.articleAddForm.picUrl = result.newsArticleReq.picUrl;
                    _this.articleAddForm.content = result.newsArticleReq.content;
                    _this.articleAddForm.summary = result.newsArticleReq.summary;


                    _this.addOrEdit = false;
                    _this.showArticle = true;
                    _this.$nextTick(function() {
                        _this.$refs['ArticleAddFormRule'].resetFields();
                    })

                }
            })
        },


        /**
         * 修改 文章信息 提交操作
         * @return {[type]} [description]
         */
        handleEditArticleSubmit: function() {
            var _this = this;
            var submitSuccess = function(columnResp) {
                if (columnResp.respCode != "0") {
                    _this.$message({
                        message: '修改用户信息失败:' + columnResp.respMsg,
                        type: 'error'
                    });
                    return;
                }
                _this.articleModForm.dialogVisible = false;
                _this.$message({
                    message: '修改用户信息成功',
                    type: 'success'
                });
                _this.loadArticles();
            }
            let validateSuccess = function() {
                var obj = {
                    id: _this.articleModForm.id,
                    header: _this.articleModForm.header,
                    contentUrl: _this.articleModForm.contentUrl,
                    sectionId: _this.articleModForm.sectionId[1],
                    picUrl: _this.articleModForm.picUrl

                }
                $.ajax({
                    url: util.mainApi + "/news_article/update_article.do",
                    type: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(obj),
                    dataType: "json",
                    // 获取服务器返回的json结果
                    success: function(columnResp) {

                        submitSuccess(columnResp);
                    },
                    error: function() {
                        console.log("加载错误!");
                    }
                });
            }
            this.$refs['articleModFormRule'].validate(function(valid) {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 文章 删除文章操作
         * @param  {[type]} index  [description]
         * @param  {[type]} column [description]
         * @return {[type]}        [description]
         */
        handleDeleteArticle: function(index, article) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: util.mainApi + "/news_article/del_article.do",
                    type: "post",
                    data: {
                        "id": article.id
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除文章失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadArticles();

                    }
                })

            }
            this.$confirm('确定删除此文章?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        /**
         * 栏目  查询操作
         * @return {[type]} [description]
         */
        handleQueryArticle: function() {
            this.loadArticles();
        },
        /**
         * 文章  重置查询操作
         * @return {[type]} [description]
         */
        handleResetArticleQueryForm: function() {
            this.articleQueryForm.header = "";
            this.articleQueryForm.sectionId = [];
            this.articleQueryForm.startTime = "";
            this.articleQueryForm.endTime = "";
            this.loadArticles();
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
        /**
         * tab切换操作
         * @param  {[type]} tab   [description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        handleTabsChangeClick: function(tab, event) {
            console.log(tab);
            if (this.activeName == 'article') {
                this.loadSectionList();
                this.handleResetArticleQueryForm();
            } else {
                this.handleResetColumnQueryForm()
            }
        },
        handleAvatarSuccess: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.articleAddForm.picUrl = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handlePictureSuccess: function(res, file) {
            this.articleModForm.picUrl = file.response.result.fis.url;
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
        removeUpload: function(file) {
            console.log('remove', file);
        },

        handleOnChange: function(file) {
            console.log('handleOnChange', file);
        },
        onEditorBlur: function(editor) {
            console.log('editor blur!', editor)
        },
        onEditorFocus: function(editor) {
            console.log('editor focus!', editor)
        },
        onEditorReady: function(editor) {
            console.log('editor ready!', editor)
        },
        onEditorChange: function({
            editor,
            html,
            text
        }) {
            console.log('editor change!', editor, html, text)
            this.content = html
        },

        imageuploaded(res,file) {
            console.log(res);
            this.articleAddForm.picUrl = res.result.fis.url;
        },
        handleError() {
            this.$notify.error({
                title: '上传失败',
                message: '图片上传接口上传失败，可更改为自己的服务器接口'
            });
        },
        changePic: function(e) {
            console.log(e);
            // if("1" == e[1]){
            //     this.picHeight = 72;
            //     this.picWidth = 85;
            // }else if("2" == e[1]){
            //     this.picHeight = 80;
            // this.picWidth = 75;
            // }else{
                this.picHeight = 500;
                this.picWidth = 950;
            // }
            
        }
    },

    watch: {
        "$router": function() {

        }
    },
    components: {
        quillEditor,
        VueCoreImageUpload
    },
    computed: {
        editor: function() {
            return this.$refs.myTextEditor.quillEditor;
        },
        picSize: function() {
            if (this.articleAddForm.sectionId[1] == '1') {
                return {
                    'pic-xinwen': true
                };
            } else if (this.articleAddForm.sectionId[1] == '2') {
                return {
                    'pic-jiankang': true
                };
            } else if (this.articleAddForm.sectionId[1] == '11') {
                return {
                    'pic-jiangzuo': true
                };
            } else {
                return {
                    'pic-jiangzuo': true
                };
            }
        }

    }
}
</script>
<style>
.xs-news .avatar-uploader {
    display: inline-block;
}

.xs-news .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 112px;
    width: 375px;
}

.xs-news .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
    height: 112px;
    width: 375px;
}

.xs-news .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    height: 112px;
    width: 375px;
    line-height: 112px;
    text-align: center;
}

.xs-news .avatar {
    display: block;
    min-height: 250px;
}

.xs-news .avatar-uploader.pic-xinwen .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 72px;
    width: 85px;
}

.xs-news .avatar-uploader.pic-xinwen .el-upload:hover {
    border-color: #20a0ff;
    height: 72px;
    width: 85px;
}

.xs-news .pic-xinwen .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    height: 72px;
    width: 85px;
    line-height: 72px;
    text-align: center;
}

.xs-news .pic-xinwen .avatar {
    height: 72px;
    width: 85px;
    display: block;
}

.xs-news .avatar-uploader.pic-jiankang .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 80px;
    width: 75px;
}

.xs-news .avatar-uploader.pic-jiankang .el-upload:hover {
    border-color: #20a0ff;
    height: 80px;
    width: 75px;
}

.xs-news .pic-jiankang .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    height: 80px;
    width: 75px;
    line-height: 80px;
    text-align: center;
}

.xs-news .pic-jiankang .avatar {
    height: 112px;
    width: 75px;
    display: block;
}

.xs-news .avatar-uploader.pic-jiangzuo .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 112px;
    width: 375px;
}

.xs-news .avatar-uploader.pic-jiangzuo .el-upload:hover {
    border-color: #20a0ff;
    height: 112px;
    width: 375px;
}

.xs-news .pic-jiangzuo .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    height: 112px;
    width: 375px;
    line-height: 112px;
    text-align: center;
}

.xs-news .pic-jiangzuo .avatar {
    display: block;
}

.xs-news .tips {
    position: relative;
    top: -30px;
    color: red;
    padding-left: 10px;
}

.popover-page {
    min-width: 600px;
}

.article-content {
    border: 1px solid rgb(246, 246, 246);
    border-radius: 5px;
    overflow: hidden;
    box-sizing: border-box;
    cursor: text;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 12px 15px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.pc-news__hospitals {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.xs-news .g-core-image-upload-btn{
    max-height: 250px;
} 
</style>
