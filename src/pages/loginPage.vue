<template>
    <div class="wrapper-login">
        <div class="login-header">
            <div class="login-logo">
                <i class="icon iconfont icon-logo"></i>
            </div>
            <span class="login-title">
                后台管理系统
            </span>
        </div>
        <div class="login-container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <template slot="prepend">
                            <i class="icon iconfont icon-yonghuming"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <template slot="prepend">
                            <i class="icon iconfont icon-mima"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import * as util from '../util/common.js'

import * as types from "../store/mutation_type.js"

export default {
    data: function() {
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            const self = this;
            var obj = {
                userName: self.ruleForm.username,
                userPasswd: self.ruleForm.password
            };

            var loginSubmit = function() {

                self.$http({
                    url: "/user/login_pc.do",
                    method: "post",
                    data: obj
                }).then(loginResp => {

                    if (loginResp.data.respCode != '0') {
                        self.$message({
                            message: loginResp.data.respMsg,
                            type: "error"
                        });
                    } else {

                        self.$fetch('/user/select_by_user.do').then(resp => {
                            if(resp.respCode != '0'){
                                self.$message({
                                    message: resp.respMsg,
                                    type: "error"
                                });
                                return;
                            }
                            self.$store.commit(types.SET_SITE_LIST,resp.result);
                            self.$store.commit(types.SET_HEADER_CURRENTSITE,resp.result[0]);
                            self.$router.push({ path: '/welcome', query: { siteId: resp.result[0].siteId }});
                            
                        })
                        
                    }
                });

            }
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    
                    loginSubmit();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style scoped lang="less" src="src/less/pages/login.less"></style>
