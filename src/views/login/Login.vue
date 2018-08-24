<template>
  <div class="login" :style="winSize">
    <div class='login-top'>
      <img src="../../assets/login/LOGO_03.png" class="logo">
      <img src="../../assets/login/plane_03.png" class="plane">
      <img src="../../assets/login/ball_03.png" class="ball">
      <el-row :gutter="20" class="login-content">
        <el-col :span="6" :push='4' style="height:100%">
          <div class="grid-content g-left">
            <img src="../../assets/login/login-center_03.png">
          </div>
        </el-col>
        <el-col :span='6'>
          <div class="grid-content g-right">
            <el-form label-position="left" label-width="0px" class="demo-ruleForm loginform"
                    v-loading="login_actions.disabled"
                    :model='data'
                    :rules="rule_data"
                    ref='data'>
              <h3 class="title">用户登录</h3>
              <el-form-item
                prop='userName'>
                <el-input
                  v-model='data.userName' auto-complete="off" placeholder="账号">
                  <template slot="prepend"><i class="iconfont icon-username"></i></template>
                </el-input>
              </el-form-item>

              <el-form-item
                prop='userPassword'>
                <el-input type="password" auto-complete="off" placeholder="密码"
                          v-model='data.userPassword'>
                  <template slot="prepend"><i class="iconfont icon-password"></i></template>       
                </el-input>
              </el-form-item>

              <el-form-item
                prop='validateCode'>
                <el-input 
                    v-model='data.validateCode' auto-complete="off" placeholder="验证码"
                         style='width:70%;vertical-align: middle;'  @keyup.enter.native='onLogin("data")'>
                  <template slot="prepend"><i class="iconfont icon-identifying-code"></i></template>         
                </el-input>
                <img src="" id='validateImg' width='100%' @click="changeCode">
                <span class="load" v-show="imgError" @click="changeCode">点击获取</span>
              </el-form-item>
              <el-form-item >
                <el-button type="primary"
                          @click='onLogin("data")' style="width:100%;">登录
                </el-button>
              </el-form-item> 
            </el-form>
          </div>
        </el-col>     
      </el-row>
    </div>
    <div class='login-footer'>
      <p>©2016-2017 广州七七八二信息科技·物联网安监大数据平台 粤ICP备10240772号-17</p>
    </div>
  </div>
</template>

<script>
  import LoginJs from './Login.js'

  export default LoginJs
</script>

<style scoped lang='less'>
  @import url(Login.less);
</style>
