<template>
    <div class="panel">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 图表</el-breadcrumb-item>
                <el-breadcrumb-item>基础图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel-body">
            <div class="col-lg-12">
                <el-button @click="addSystemPerson">添加</el-button>
            </div>
            <div class="col-lg-12" style="margin-top: 20px;">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column label="序号" width="180">
                        <template scope="scope">
                            
                            <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="姓名" width="180">
                        <template scope="scope">
                           
                            <span style="margin-left: 10px">{{ scope.row.userName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账号" width="180">
                        <template scope="scope">
                            
                            <span style="margin-left: 10px">{{ scope.row.userCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户类型" width="180">
                        <template scope="scope">
                            
                            <span style="margin-left: 10px" >操作员</span>
                            <span style="margin-left: 10px">系统管理员</span>
                            <span style="margin-left: 10px">微信用户</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="添加操作员" v-model="person.dialogVisible" size="tiny">
            <div>
                <el-form label-width="80px" :model="person">
                    <el-form-item label="用户名">
                        <el-input v-model="person.name"  placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input v-model="person.name" placeholder="登录账户"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="person.password"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="person.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="person.dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改操作员" v-model="modifyPerson.dialogVisible" size="tiny">
            <div>
                <el-form label-width="80px" :model="person">
                    <el-form-item label="用户名">
                        <el-input v-model="modifyPerson.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="modifyPerson.password"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyPerson.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyPerson.dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除操作员" v-model="deletePerson.dialogVisible" size="tiny">
            <div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="person.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="person.dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "SystemManage",
    data() {
        return {
            tableData: [{
                name: "gzh"
            }],
            person: {
                dialogVisible: false,
                name: "",
                password: ""
            },
            deletePerson: {
                dialogVisible: false
            },
            modifyPerson:{
                dialogVisible: false,
                name: "",
                password: ""
            }
        }
    },
    methods: {
        handleEdit: function(index, person) {
            this.modifyPerson.dialogVisible = true;
        },
        handleDelete: function(index, person) {
            this.$confirm('确定删除此操作员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addSystemPerson: function() {
            this.person.dialogVisible = true;
        }
    }
}
</script>
<style scoped>
.echarts {
    float: left;
    width: 500px;
    height: 400px;
}
</style>
