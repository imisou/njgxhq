<template>
    <div class="m-container">
        <div class="panel panel-default">
            <div class="panel-heading clearfix">
                <div class="panel-title pull-left">
                    内容管理
                </div>
            </div>
            <div class="panel-body">
                <div v-if="currentPage == 'table'">
                    <el-row>
                        <el-form :inline="true" class="demo-form-inline">
                            <!--  <el-form-item label="角色名称：">
                                <el-input v-model="querySiteName"></el-input>
                            </el-form-item> -->
                            <el-form-item>
                                <!-- <el-button type="primary" @click="handleLoadSiteInfo">查询</el-button> -->
                                <!-- <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button> -->
                                <el-button type="success" icon="plus" @click="handleAddSiteHandler">添加</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-row>
                        <el-table :data="articleTable" border style="width: 100%">
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column label="文章名称" width="200">
                                <template scope="scope">
                                    <span>{{ scope.row.articleTitle }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间">
                                <template scope="scope">
                                    <span>{{ scope.row.createTime | formDate('yyyy-MM-dd hh:mm:ss')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发布时间">
                                <template scope="scope">
                                    <span>{{ scope.row.publishTime | formDateHasNull('yyyy-MM-dd hh:mm:ss')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="版块">
                                <template scope="scope">
                                    <span>{{ scope.row.columnName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态">
                                <template scope="scope">
                                    <span>{{ scope.row.status | ArticleStatusFilters("") }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="300">
                                <template scope="scope">
                                    <el-button size="small" @click="handleModArticle(scope.row)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="handleDeleteArticle(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row style="margin-top: 20px;">
                            <el-pagination @current-change="handleArticlePageChange" :current-page="page.currentPage" :page-size="page.pageNumber" layout="total, prev, pager, next, jumper" :total="page.totalNumber" style="float: right;">
                            </el-pagination>
                        </el-row>
                    </el-row>
                </div>
                <div v-if="currentPage == 'form'">
                    <el-row>
                        <el-col :span="10">
                            <el-form class="demo-form" label-width="150px" ref="articleForm">
                                <el-form-item label="文章标题：">
                                    <el-input type="text" v-model="form.articleTitle"></el-input>
                                </el-form-item>
                                <el-form-item label="文章类型：">
                                    <el-cascader expand-trigger="hover" :options="columnCascader" v-model="form.columnId">
                                    </el-cascader>
                                </el-form-item>
                                <el-form-item label="文章缩略图：">
                                    <el-upload class="avatar-uploader" :action="mainApi + '/article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="picUploadData">
                                        <img v-if="showPicUrl" :src="showPicUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item label="文章内容：">
                                    <VueUEditor @ready="editorReady" style="width: 800px"></VueUEditor>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handleBackToTable">返回</el-button>
                                    <el-button type="success" icon="plus" @click="handleCommitArticle">提交</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from "vuex";
import * as util from "../../util/common.js"
import VueUEditor from '../../components/common/UEditor.vue';
const articleStatus = [{
    id: 1,
    value: "待审核"
}]
export default {
    name: "SiteManagePage",
    components: {
        VueUEditor
    },
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
            mainApi: util.consoleApi,
            siteTypes: [], //站点类型数据
            parentIds: [], //站点主站数据
            querySiteName: "", //查询的站点名称
            aiticleTables: [], //站点数据
            showAddForm: false,
            currentPage: 'table', //当前页面
            columnCascader: [],
            columnList: [],

            articleTable: [], //站点数据
            page: {
                currentPage: 1,
                pageNumber: 10,
                totalNumber: 1,
                totalPage: 1
            },
            mode: "add",
            currentStep: 0,
            columnList: [],
            editorInstance: "",
            modForm: {},
            ue: "",
            content: "",

            picUrl: "",
            showPicUrl:"",
            picUploadData: {
                oldFileUri: this.picUrl ? this.picUrl : ""
            }
        }
    },
    created() {
        this.loadColumnListBySiteId();
        this.loadArticle();
    },
    mounted() {

    },
    computed: {
        ...mapGetters({
            site: "currentSite",
            // 'columnCascader': "article/columnCascader",
            // "columnList": "article/columnList",
            // "mode": "article/mode",
            "form": "article/formContent",
        })
    },
    watch: {
        "site.siteId": function() {
            this.loadArticle();
            this.currentPage = 'table';
        }
    },
    methods: {
        /**
         * 加载当前站点的文章数据
         * @return {[type]} [description]
         */
        loadArticle: function() {
            var _this = this;
            var obj = {
                siteId: this.site.siteId,
                page: {
                    currentPage: _this.page.currentPage,
                    pageNumber: _this.page.pageNumber,
                    totalPage: _this.page.totalPage
                }
            };

            $.ajax({
                url: util.consoleApi + '/article/select_by_siteid_page.do',
                type: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(obj),
                dataType: 'json',
                success: function(resp) {
                    if (resp.respCode != "0") {
                        _this.$message.error('查询文章失败！');
                        return;
                    }
                    _this.articleTable = resp.result.articles;
                    var page = resp.result.page;
                    _this.page.currentPage = page.currentPage;
                    _this.page.pageNumber = page.pageNumber;
                    _this.page.totalNumber = page.totalNumber;
                    _this.page.totalPage = page.totalPage;

                },
                error: function() {
                    console.log("查询文章服务请求出错！");
                }
            });
        },

        /**
         * 点击编辑文章，进行数据的初始化操作
         * @param  {[type]} article [description]
         * @return {[type]}         [description]
         */
        handleModArticle: function(article) {
            var _this = this;

            var querySuccess = function(result) {

                var columnId = [];

                for (var i = 0; i < _this.columnCascader.length; i++) {
                    var firstColumn = _this.columnCascader[i];

                    for (var j = 0, jleng = firstColumn.children ? firstColumn.children.length : 0; j < jleng; j++) {
                        var childrenColumn = firstColumn.children[j];
                        if (childrenColumn.value == result.source.columnId) {
                            columnId = [firstColumn.value, childrenColumn.value];
                        }
                    }

                }

                var formContent = {
                    siteId: _this.site.siteId,
                    columnId: columnId,
                    columnName: result.source.columnName,
                    articleTitle: result.source.articleTitle,
                    articleContent: result.source.articleContent,
                    status: result.source.status
                }
                _this.picUrl = result.source.picUrl;
                _this.picUploadData.oldFileUri = result.source.picUrl;
                _this.modForm = result;

                _this.$store.commit("article/setForm", formContent);
                // _this.$store.commit("article/setMode", "mod");
                _this.mode = 'mod';
                _this.currentPage = 'form';
                _this.currentStep = '1';
            }
            $.ajax({
                url: util.consoleApi + "/article/select_by_articleid.do",
                type: "post",
                data: {
                    articleId: article.articleId
                },
                dataType: "json",
                success: function(editArticleResp) {
                    if (editArticleResp.respCode != "0") {
                        _this.$message({
                            message: '查询文章信息失败:' + editArticleResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    // var result = editArticleResp.result;
                    querySuccess(editArticleResp.result);
                }
            })
        },
        /**
         * 删除文章数据
         * @param  {[type]} article [description]
         * @return {[type]}         [description]
         */
        handleDeleteArticle: function(article) {
            var _this = this;
            var success = () => {
                $.ajax({
                    url: "http://localhost:8080/jsghx-console" + "/article/delete_article.do",
                    type: "post",
                    data: {
                        "articleId": article.articleId
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
                            message: '删除文章成功!'
                        });
                        _this.loadArticle();

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
         * 点击添加文章
         * @return {[type]} [description]
         */
        handleAddSiteHandler: function() {
            var _this = this;
            var formContent = {
                siteId: _this.site.siteId,
                columnId: "",
                columnName: "",
                articleTitle: "",
                articleContent: "",
                status: ""
            }
            this.picUrl = "";
            _this.$store.commit("article/setForm", formContent);
            // _this.$store.commit("article/setMode", "add");
            _this.mode = 'add';
            _this.currentPage = "form";
            _this.currentStep = "0";
        },

        /**
         * 点击分页按钮
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        handleArticlePageChange: function(val) {
            this.page.currentPage = val;
            this.loadArticle();
        },

        editorReady: function(editorInstance) {
            this.editorInstance = editorInstance;
            editorInstance.setContent(this.form.articleContent);
            editorInstance.addListener('contentChange', () => {
                console.log('编辑器内容发生了变化：', editorInstance.getContent());
            });
        },

        /**
         * 提交 文章
         * @return {[type]} [description]
         */
        handleCommitArticle: function() {
            var _this = this;
            var submitAddForm = function() {
                var columnName = "";
                var columnId = _this.form.columnId.length == 2 ? _this.form.columnId[1] : _this.form.columnId[0]
                for (var i = 0, ileng = _this.columnList.length; i < ileng; i++) {
                    if (_this.columnList[i].columnId == columnId) {
                        columnName = _this.columnList[i].columnName
                    }
                }
                var obj = {
                    siteId: _this.site.siteId,
                    columnId: columnId,
                    articleTitle: _this.form.articleTitle,
                    articleContent: _this.editorInstance.getContent(),
                    columnName: columnName,
                    picUrl:_this.picUrl
                };

                _this.$fetch("/article/insert_article.do", obj).then(resp => {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '添加版块信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }

                    _this.$message({
                        message: '添加版块信息成功',
                        type: 'success'
                    });
                    _this.loadArticle();
                    setTimeout(function() {
                        _this.currentPage = 'table';
                    })
                })
            }
            var submitModForm = function() {
                var columnName = "";
                var columnId = _this.form.columnId.length == 2 ? _this.form.columnId[1] : _this.form.columnId[0];
                for (var i = 0, ileng = _this.columnList.length; i < ileng; i++) {
                    if (_this.columnList[i].columnId == columnId) {
                        columnName = _this.columnList[i].columnName
                    }
                };

                var obj = {
                    // article:_this.modForm.article,
                    type: _this.site.siteId,
                    id: _this.modForm.article.esId,
                    index: _this.modForm.index,
                    source: {
                        articleContent: _this.editorInstance.getContent(),
                        articleTitle: _this.form.articleTitle,
                        siteId: _this.site.siteId,
                        columnId: _this.modForm.source.columnId,
                        columnName: _this.modForm.source.columnName,
                        picUrl:_this.picUrl
                    }
                };

                _this.$fetch("/article/update_article.do", obj).then(resp => {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '修改版块信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }

                    _this.$message({
                        message: '修改版块信息成功',
                        type: 'success'
                    });
                    _this.loadArticle();
                    setTimeout(function() {
                        _this.currentPage = 'table';
                    })
                })
            }

            let validateSuccess = function() {
                if (_this.mode === 'add') {
                    submitAddForm();
                } else {
                    submitModForm()
                }

            }
            this.$refs['articleForm'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleGotoNext: function() {
            this.currentStep = '1';
        },
        handleAvatarSuccess: function(res, file) {
            console.log(file);
            //this.articleAddForm.picUrl = URL.createObjectURL(file.raw);
            this.picUrl = file.response.result.uri;
            this.showPicUrl = file.response.result.url;
            this.picUploadData.oldFileUri = file.response.result.uri;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        beforeAvatarUpload: function(res, file) {
            // this.picUrl = file.response.result.uri;
            // this.showPicUrl = file.response.result.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;
        },

        handleBackToTable: function() {
            this.currentPage = 'table';
        },




        /**
         * 加载版块信息
         * @return {[type]} [description]
         */
        loadColumnListBySiteId: function() {
            var _this = this;
            $.ajax({
                url: "http://localhost:8080/jsghx-console" + "/user/select_column_by_siteid.do",
                type: "post",
                data: {
                    siteId: _this.site.siteId
                },
                dataType: "json",
                success: function(resp) {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '查询版块信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }

                    var result = resp.result;
                    var columns = [];
                    var columnList = [];
                    for (var i = 0; i < result.length; i++) {
                        var firstColumn = result[i];
                        var obj = {
                            label: firstColumn.columnName,
                            value: firstColumn.columnId,
                            children: []
                        }
                        var obj1 = {
                            columnId: firstColumn.columnId,
                            columnName: firstColumn.columnName,
                            level: 1,
                        };
                        columnList.push(obj1);
                        for (var j = 0, jleng = firstColumn.subColumnInfos ? firstColumn.subColumnInfos.length : 0; j < jleng; j++) {
                            var childrenColumn = firstColumn.subColumnInfos[j];
                            var subObj = {
                                label: childrenColumn.columnName,
                                value: childrenColumn.columnId,
                            }
                            obj1 = {
                                columnId: childrenColumn.columnId,
                                columnName: childrenColumn.columnName,
                                level: 2,
                            }
                            columnList.push(obj1);
                            obj.children.push(subObj);
                        }
                        columns.push(obj);
                    }
                    // _this.columnList = columns;
                    // _this.$store.commit('article/setColumnCascader', columns);
                    // _this.$store.commit('article/setColumnList', columnList);
                    _this.columnCascader = columns;
                    _this.columnList = columnList;
                }
            })
        },
    },
    filters: {
        ArticleStatusFilters: function(val) {
            var value = "待审核";
            articleStatus.map(function(ele, index) {
                if (ele.id == val) {
                    value = ele.value;
                }

            })
            return value;
        }
    }
}
</script>
<style lang="less" src="less/pages/article.less">

</style>
