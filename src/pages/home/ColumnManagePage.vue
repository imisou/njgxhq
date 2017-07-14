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
                    版块管理
                </div>
            </div>
            <div class="panel-body">
                <el-row>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <!-- <el-button type="primary" @click="handleLoadSiteInfo">查询</el-button> -->
                            <!-- <el-button type="primary" @click="handleResetPrivQueryForm">重置</el-button> -->
                            <el-button type="success" icon="plus" @click="handleAddColumn">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <div class="">
                    <el-tree :data="data2" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
                    </el-tree>
                </div>
            </div>
        </div>
        <el-dialog title="录入版块" v-model="columnAdd.showAddForm" size="tiny">
            <el-form :model="columnAdd.form" :rules="siteObjRole" ref="validateColumnAddForm" label-width="120px" class="demo-roleForm">
                <el-form-item label="版块名称：" prop="columnName">
                    <el-input type="text" v-model="columnAdd.form.columnName"></el-input>
                </el-form-item>
                <el-form-item label="上一级版块：" prop="parentName" required>
                    <el-input type="text" v-model="columnAdd.form.parentName" disabled></el-input>
                </el-form-item>
                <el-form-item label="顺序：" prop="columnSeq" required>
                    <el-input type="text" v-model="columnAdd.form.columnSeq"></el-input>
                </el-form-item>
                <el-form-item label="版块前缀：" prop="uri">
                    <el-input type="text" v-model="columnAdd.form.uri"></el-input>
                </el-form-item>
                <el-form-item label="是否展示：" prop="isShow">
                    <el-switch v-model="columnAdd.form.isShow" on-text="展示" off-text="隐藏"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="columnAdd.showAddForm = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitColumnAddForm()">确 定</el-button>
            </div>
        </el-dialog>

         <el-dialog title="编辑版块" v-model="columnMod.showAddForm" size="tiny">
            <el-form :model="columnMod.form" :rules="siteObjRole" ref="validatecolumnModForm" label-width="120px" class="demo-roleForm">
                <el-form-item label="版块名称：" prop="columnName">
                    <el-input type="text" v-model="columnMod.form.columnName"></el-input>
                </el-form-item>
                <el-form-item label="上一级版块：" prop="parentId" required>
                    <el-input type="text" v-model="columnMod.form.parentId" disabled></el-input>
                </el-form-item>
                <el-form-item label="顺序：" prop="columnSeq" required>
                    <el-input type="text" v-model="columnMod.form.columnSeq"></el-input>
                </el-form-item>
                <el-form-item label="版块前缀：" prop="uri">
                    <el-input type="text" v-model="columnMod.form.uri"></el-input>
                </el-form-item>
                <el-form-item label="是否展示：" prop="isShow">
                    <el-switch v-model="columnMod.form.isShow" on-text="展示" off-text="隐藏"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="columnMod.showAddForm = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitcolumnModForm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as types from "../../store/mutation_type.js"

let id = 1000;
export default {
    name: "ColumnManagePage",
    data() {
        var checkParentId = (rule, value, callback) => {
            console.log(value);
            if (value === "") {
                return callback(new Error('请选择上一级版块。'));
            }
            callback();

        };

        var checkSiteType = (rule, value, callback) => {
            console.log(value);
            if (value.length == 0) {
                return callback(new Error('请选择版块类型。'));
            }
            callback();

        };

        return {
            data2: [],
            defaultProps: {
                children: 'subColumnInfos',
                label: 'columnName'
            },

            columnAdd: {
                showAddForm: false,
                form: {
                    columnId: "",
                    columnName: "",
                    parentId: "",
                    uri: "",
                    columnSeq: "",
                    siteId: "",
                    parentName:"",
                    isShow:true
                }
            },
            columnMod: {
                showAddForm: false,
                form: {
                    columnId: "",
                    columnName: "",
                    parentId: "",
                    uri: "",
                    columnSeq: "",
                    siteId: "",
                    parentName:"",
                    isShow:true
                }
            },
            siteObjRole: {}

        }
    },
    computed: {
        ...mapGetters({
            'site': "currentSite"
        })
    },
    created() {
        this.loadColumnListBySiteId();
    },
    mounted() {

    },
    watch:{
        "site.siteId":function(){
            this.loadColumnListBySiteId();
        }
    },
    methods: {

        /**
         * 查询版块信息
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
                        message: '查询版块信息失败:' + resp.respMsg,
                        type: 'error'
                    });
                    return;
                }

                this.siteTables = resp.data.result;
            })
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

                    _this.data2 = resp.result;
                }
            })
        },
        /**
         * 初始化及显示添加站点页面
         * @return {[type]} [description]
         */
        handleAddColumn: function() {
            var _this = this;
            // this.role.openNum += 1;
            //清除校验与初始化
            this.columnAdd.form.columnId = "";
            this.columnAdd.form.columnName = "";
            this.columnAdd.form.parentId = 0;
            this.columnAdd.form.uri = "";
            this.columnAdd.form.columnSeq = "";
            this.columnAdd.form.parentName = "没有上一级";
            this.columnAdd.form.isShow = true;


            this.columnAdd.showAddForm = true;
            this.$nextTick(function() {
                this.$refs['validateColumnAddForm'].resetFields();

            });

        },

        /**
         * 添加站点提交按钮
         * @return {[type]} [description]
         */
        handleSubmitColumnAddForm: function() {
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    columnName: _this.columnAdd.form.columnName,
                    parentId: _this.columnAdd.form.parentId,
                    uri: _this.columnAdd.form.uri,
                    columnSeq: _this.columnAdd.form.columnSeq,
                    siteId: _this.site.siteId,
                    isShow:_this.columnAdd.form.isShow ? 'Y' :'N'
                };

                _this.$fetch("/user/insert_column.do", obj).then(resp => {
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
            this.$refs['validateColumnAddForm'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleSubmitcolumnModForm:function(){
            var _this = this;
            let validateSuccess = function() {
                var obj = {
                    columnId: _this.columnMod.form.columnId,
                    columnName: _this.columnMod.form.columnName,
                    parentId: _this.columnMod.form.parentId,
                    uri: _this.columnMod.form.uri,
                    columnSeq: _this.columnMod.form.columnSeq,
                    siteId: _this.site.siteId,
                    isShow:_this.columnMod.form.isShow ? 'Y' :'N'
                };

                _this.$fetch("/user/update_column.do", obj).then(resp => {
                    if (resp.respCode != "0") {
                        _this.$message({
                            message: '修改版块信息失败:' + resp.respMsg,
                            type: 'error'
                        });
                        return;
                    }
                    _this.columnMod.showAddForm = false;
                    _this.$message({
                        message: '修改版块信息成功',
                        type: 'success'
                    });
                    _this.loadColumnListBySiteId();
                })


            }
            this.$refs['validatecolumnModForm'].validate((valid) => {
                if (valid) {
                    validateSuccess();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        
       

        append(store, data) {
            var _this = this;
            // this.role.openNum += 1;
            //清除校验与初始化
            this.columnAdd.form.columnId = "";
            this.columnAdd.form.columnName = "";
            this.columnAdd.form.parentId = data.columnId;
            this.columnAdd.form.uri = "";
            this.columnAdd.form.columnSeq = "";
            this.columnAdd.form.parentName = data.columnName;
            this.columnAdd.form.isShow = true ;

            this.columnAdd.showAddForm = true;
            this.$nextTick(function() {
                this.$refs['validateColumnAddForm'].resetFields();

            });
        },

        remove(store, data) {
            // store.remove(data);
            var _this = this;
            var success = () => {
                $.ajax({
                    url: "http://localhost:8080/jsghx-console" + "/user/delete_column.do",
                    type: "post",
                    data: {
                        "columnId": data.columnId
                    },
                    dataType: "json",
                    success: function(findUserResp) {
                        if (findUserResp.respCode != "0") {
                            _this.$message({
                                message: '删除版块失败:' + findUserResp.respMsg,
                                type: 'error'
                            });
                            return;
                        };
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _this.loadColumnListBySiteId();
                        store.remove(data);;
                    }
                })

            }
            this.$confirm('确定删除此版块?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(success);
        },
        edit(store, data) {
            var _this = this;
            $.ajax({
                url: "http://localhost:8080/jsghx-console" + "/user/select_by_columnid.do",
                type: "post",
                data: {
                    "columnId": data.columnId
                },
                dataType: "json",
                success: function(findUserResp) {
                    if (findUserResp.respCode != "0") {
                        _this.$message({
                            message: '查询版块失败:' + findUserResp.respMsg,
                            type: 'error'
                        });
                        return;
                    };
                    _this.columnMod.form.columnId = findUserResp.result.columnId;
                    _this.columnMod.form.columnName = findUserResp.result.columnName;
                    _this.columnMod.form.parentId = findUserResp.result.parentId;
                    _this.columnMod.form.uri = findUserResp.result.uri;
                    _this.columnMod.form.columnSeq = findUserResp.result.columnSeq;
                    _this.columnMod.form.isShow = (findUserResp.result.isShow == 'Y'? true :false);

                    _this.columnMod.showAddForm = true;
                    _this.$nextTick(function() {
                        _this.$refs['validatecolumnModForm'].resetFields();

                    });
                }
            })
        },
        renderContent: function(h, {
            node,
            data,
            store
        }) {
            var _this = this;

            if (node.level == 1) {
                return h('span', [h('span', {}, [h('span', {}, node.label)]),
                    h('span', {

                        style: {
                            float: "right",
                            'marginRight': "20px"
                        }

                    }, [h('el-button', {
                            attrs: {
                                'size': "mini"
                            },
                            on: {
                                click: () => {
                                    this.append(store, data)
                                }
                            }
                        }, '添加'),
                        h('el-button', {
                            attrs: {
                                'size': "mini"
                            },
                            on: {
                                click: () => {
                                    this.edit(store, data)
                                }
                            }
                        }, '编辑'), h('el-button', {
                            attrs: {
                                'size': "mini"
                            },
                            on: {
                                click: () => {
                                    this.remove(store, data)
                                }
                            }
                        }, '删除')
                    ])
                ]);
            } else {
                return h('span', [h('span', {}, [h('span', {}, node.label)]),
                    h('span', {

                        style: {
                            float: "right",
                            'marginRight': "20px"
                        }

                    }, [h('el-button', {
                        attrs: {
                            'size': "mini"
                        },
                        on: {
                            click: () => {
                                this.edit(store, data)
                            }
                        }
                    }, '编辑'), h('el-button', {
                        attrs: {
                            'size': "mini"
                        },
                        on: {
                            click: () => {
                                this.remove(store, data)
                            }
                        }
                    }, '删除')])
                ]);
            }

            // return ( < span >
            //     < span >
            //     < span > {
            //         node.label
            //     } < /span> < /span> < span style = "float: right; margin-right: 20px" >
            //     < el - button size = "mini"
            //     on - click = {
            //         () => this.append(store, data)
            //     } > Append < /el-button> < el - button size = "mini"
            //     on - click = {
            //         () => this.remove(store, data)
            //     } > Delete < /el-button> < /span> < /span>);
            // }
        }
    }
}
</script>
<style lang="less" src="less/pages/siteManage.less">
</style>
