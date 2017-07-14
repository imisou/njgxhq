<template>
    <div>
        <el-row>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="角色名称：">
                    <el-input v-model="querySiteName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLoadSiteInfo">查询</el-button>
                    <!-- <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button> -->
                    <el-button type="success" icon="plus" @click="handleAddSiteHandler">添加</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="articleTable" border style="width: 100%">
                <el-table-column label="序号">
                    <template scope="scope">
                        <span>{{ scope.row.$index }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文章名称" width="200">
                    <template scope="scope">
                        <span>{{ scope.row.articleTitle }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布时间">
                    <template scope="scope">
                        <span>{{ scope.row.publishTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="版块">
                    <template scope="scope">
                        <span>{{ scope.row.columnName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        <span>{{ scope.row.status }}</span>
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
                <el-pagination @current-change="handleArticlePageChange" :current-page="page.currentPage" :page-sizes="[1,10,30,50,100]" :page-size="page.pageNumber" layout="total, sizes, prev, pager, next, jumper" :total="page.totalNumber" style="float: right;">
                </el-pagination>
            </el-row>
        </el-row>
    </div>
</template>
<script>
import {
    mapGetters
} from "vuex"
import * as util from "../../../util/common.js"

export default {
    name: "cshi",
    data() {
        return {
            siteTypes: [], //站点类型数据
            parentIds: [], //站点主站数据
            querySiteName: "", //查询的站点名称
            articleTable: [], //站点数据
            page: {
                currentPage: "",
                pageNumber: 10,
                totalNumber: ""
            }
        }

    },
    computed: {
        ...mapGetters({
            site: "currentSite"
        })
    },
    watch: {
        "site.siteId": function() {
            this.loadArticle();
        }
    },
    created: function() {
        this.loadArticle();
    },
    methods: {
        loadArticle: function() {
            var _this = this;
            var obj = {
                siteId: this.site.siteId,
                page: {
                    currentPage: 1,
                    pageNumber: 10,
                    totalPage: 1
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
        handleModArticle: function(article) {
             var _this = this;

            var querySuccess = function(result){

                var formContent = {
                    siteId: _this.site.siteId,
                    columnId: result.source.columnId,
                    columnName: result.source.columnName,
                    articleTitle: result.source.articleTitle,
                    articleContent: result.source.articleContent,
                    status: result.source.status
                }
                _this.$store.commit("article/setForm",formContent);
                _this.$store.commit("article/setMode","mod");
                _this.$router.push({
                    "path": "/article/news",
                    query: {
                        "siteId": _this.site.siteId
                    }
                })
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
            _this.$store.commit("article/setForm",formContent);
            _this.$store.commit("article/setMode","add");
                
            this.$router.push({
                "path": "/article/news",
                query: {
                    "siteId": this.site.siteId
                }
            })
        },

        handleArticlePageChange: function(val) {
            this.page.currentPage = val;
            this.loadArticle();
        }
    }
}
</script>
<style>
.edui-default .el-form-item__content {
    line-height: 20px !important;
    position: relative;
    font-size: 14px;
}
</style>
