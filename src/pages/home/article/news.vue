<template>
    <div>
        <el-row>
            <el-col :span="2">
                <el-steps :space="100" direction="vertical" :active="currentStep">
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="10" v-if="currentStep == '0'">
                <el-form class="demo-form" label-width="150px" ref="articleTypeForm">
                    <el-form-item label="文章类型：">
                        <el-cascader expand-trigger="hover" :options="columnCascader" v-model="form.columnId">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="handleGotoNext">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="10" v-if="currentStep == '1'" :class="{'hidden':currentStep == '0'}">
                <el-form class="demo-form" label-width="150px" ref="articleForm">
                    <el-form-item label="文章标题：">
                        <el-input type="text" v-model="form.articleTitle"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="文章缩略图：">
                         <el-upload class="avatar-uploader" :action="mainApi + '/news_article/upload_picture.do'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item> -->
                    <el-form-item label="文章内容：">
                        <VueUEditor @ready="editorReady" style="width: 800px"></VueUEditor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="currentStep = '0';">上一步</el-button>
                        <el-button type="success" icon="plus" @click="handleCommitArticle">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {
    mapGetters
} from "vuex"
import * as util from "../../../util/common.js"
import VueUEditor from '../../../components/common/UEditor.vue';

export default {
    name: "cshi",
    components: {
        VueUEditor
    },
    data() {
        return {
            siteTypes: [], //站点类型数据
            parentIds: [], //站点主站数据
            querySiteName: "", //查询的站点名称
            aiticleTables: [], //站点数据
            currentStep: 0,
            columnList: [],
            editorInstance:"",
            // form: {
            //     siteId: "",
            //     columnId: "",
            //     columnName: "",
            //     articleTitle: "",
            //     articleContent: "",
            //     createTime: "",
            //     updateTime: "",
            //     pulishTime: "",
            //     status: ""
            // }
        }

    },
    computed: {
        ...mapGetters({
            site: "currentSite",
            'columnCascader':"article/columnCascader",
            "columnList":"article/columnList",
            "mode":"article/mode",
            "form":"article/formContent",
        })
    },
    created: function() {
        // this.loadColumnListBySiteId();
        console.log("mode",this.mode);
        if(this.mode == 'mod'){
            this.currentStep = '1';
        }else{
            this.currentStep = '0';

        }
    },
    mounted:function(){
        $("#ueditor_textarea_content").hidden();
    },
    methods: {
       
        modifyRoleHandler: function() {},
        deleteSiteHandler: function() {},
        handleAddSiteHandler: function() {
            this.$router.push({
                "path": "/article/news",
                query: {
                    "siteId": this.site.siteId
                }
            })
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
            var submitAddForm = function(){
                var columnName = "";
                for(var i=0,ileng = _this.columnList.length;i <ileng;i++){
                    if(_this.columnList[i].columnId == _this.form.columnId ){
                        columnName = _this.columnList[i].columnName
                    }
                }
                var obj = {
                    siteId: _this.site.siteId,
                    columnId: _this.form.columnId[1],
                    articleTitle: _this.form.articleTitle,
                    articleContent: _this.editorInstance.getContent(),
                    columnName:columnName
                };

                _this.$fetch("/article/insert_article.do", obj).then(resp => {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '添加版块信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.columnAdd.showAddForm = false;
                    _this.$message({
                        message: '添加版块信息成功',
                        type: 'success'
                    });
                    _this.loadColumnListBySiteId();
                })
            }
            var submitModForm = function(){
                 var columnName = "";
                for(var i=0,ileng = _this.columnList.length;i <ileng;i++){
                    if(_this.columnList[i].columnId == _this.form.columnId ){
                        columnName = _this.columnList[i].columnName
                    }
                }
                var obj = {
                    
                    index:"jsghx",
                    source:{
                        articleContent: _this.editorInstance.getContent(),
                        articleTitle: _this.form.articleTitle,
                         siteId: _this.site.siteId,
                    columnId: _this.form.columnId[1],
                               columnName:columnName
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
                    _this.columnAdd.showAddForm = false;
                    _this.$message({
                        message: '修改版块信息成功',
                        type: 'success'
                    });
                    _this.loadColumnListBySiteId();
                })
            }

            let validateSuccess = function() {
                if(this.mode === 'add'){
                    submitAddForm();
                }else{
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
            this.form.picUrl = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;

        },
        handlePictureSuccess: function(res, file) {
            this.form.picUrl = file.response.result.fis.url;
            //this.articleAddForm.picInsertUrl = file.response.result.fileInfos.url;
        },
    }
}
</script>
<style>
    .hidden{
        display: none;
    }
</style>
