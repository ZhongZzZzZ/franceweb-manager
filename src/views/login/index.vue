<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm"  class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">后台登陆</h3>
      </div>
      <el-form-item prop="emailAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.emailAccount"
          placeholder="Username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登陆</el-button>
          <a style="color: #fff" src="javascript:;" @click="dialogFormVisible = true">修改密码或忘记密码</a>
          </el-form>
          <div class="tips">

            <el-dialog  custom-class="passwordDialog" center title="修改密码或找回密码" :visible.sync="dialogFormVisible">
              <el-form :model="passwordForm" ref="passwordForm" class="passwordForm">
                <el-form-item label="邮箱账号" :label-width="formLabelWidth" prop="emailAccount">
                  <el-input style="color:black!important;" v-model="passwordForm.emailAccount"  autofocus="true" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="邮箱验证码" :label-width="formLabelWidth" prop="code">
                  <el-input v-model="passwordForm.code"  placeholder="请输入邮箱验证码">
                  </el-input>
                </el-form-item>
                <el-button @click="getEmailCaptcha" :disabled="isDisabled" ref="emailCaptchaBtn" style="position: absolute;right: 50px;top:155px" :class="{disabled : isDisabled}">{{computeTime > 0 ? `已发送(${computeTime})` : '获取验证码'}}</el-button>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                  <el-input type="password" v-model="passwordForm.password"  placeholder="6到15位字母、数字、下划线"></el-input>
                </el-form-item>
              </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button :loading="loading1" type="primary" @click="submitRegisterForm('passwordForm')">提 交</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
</template>

<script>

import {reqPassword,reqEmailCaptcha} from '@/api/user'
export default {
  name: 'Login',
  data() {
    //邮箱验证
    // const validateEmailAccount = (rule,value,callback) => {
    //   if(value === '') {
    //     return callback(new Error('邮箱账号不能为空'))
    //   } else if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]+@[a-zA-Z0-9]+(\.[a-zA-Z]+)+$/.test(value)){
    //     return callback(new Error('邮箱格式不正确'))
    //   }else{
    //     callback()
    //   }
    // }
    // //密码验证
    // const validatePass = (rule,value,callback) => {
    //   if(value === '') {
    //     return callback(new Error('密码不能为空'))
    //   } else if (!/^[a-zA-Z0-9_]{6,15}$/.test(value)){
    //       return callback(new Error('密码需由6-15字母、数字、下划线组成'))
    //   } else {
    //     callback()
    //   }
    // }
    // //邮箱验证码验证
    // const validateEmailCaptcha = (rule,value,callback) => {
    //   if(!/^[0-9]{4}$/.test(value)) {
    //     return callback(new Error('邮箱验证码格式不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        emailAccount: '',
        password: ''
      },
      // loginRules: {
      //   emailAccount: [{ required: true, trigger: 'blur', validator: validateEmailAccount }],
      //   password: [{ required: true, trigger: 'blur', validator: validatePass }]
      // },
      // passwordRules: {
      //   emailAccount: [{ required: true, trigger: 'blur', validator: validateEmailAccount }],
      //   password: [{ required: true, trigger: 'blur', validator: validatePass }],
      //   code: [{ required: true, trigger: 'blur', validator: validateEmailCaptcha }],
      // },
      loading: false,//登陆按钮
      loading1:false,//修改密码找回密码按钮
      passwordType: 'password',
      redirect: undefined,
      dialogFormVisible: false,
      passwordForm: {
        emailAccount:'',
        password:'',
        code:''
      },
      formLabelWidth: '100px',
      emailCaptchaBtnVal :'获取验证码',
      computeTime: 0, //验证码重新获取的倒计时时间
      isDisabled:false, //获取验证码按钮是否可用
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    computeTime (newVal) { //根据当前计时时间决定按钮是否可用
      if(newVal>0) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.password = this.$md5(this.loginForm.password)
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            if(res.result == 2) {
              this.$message.error('密码错误')
              this.loginForm.password = ''
              this.loading = false
              return false
            } else if(res.result == 3) {
              this.$message.error('未找到该用户')
              this.loginForm.password = ''
              this.loading = false
              return false
            } else if(res.result == 5) {
              this.$message.error('超过登陆次数，请半小时后登陆')
              this.loginForm.password = ''
              this.loading = false
              return false
            } else if(res.result == 6) {
              this.$message.error('首次登陆，请前往邮箱进行验证')
              this.loginForm.password = ''
              this.loading = false
              return false
            }
            this.$router.replace({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.loginForm.password = ''
            this.$message.error('登陆失败')
          })
        } else {
          return false
        }
      })
    },
    getEmailCaptcha(){ //点击之后发异步请求去获取验证码，进入倒计时30s，此时按钮变得不可用
      const {emailAccount} = this.passwordForm //获取当前表单里的邮箱
      if(emailAccount === '') {
        this.$message.error('请填写邮箱')
        return  //如果邮箱没填或者格式不对就不调用
      } else {
        this.computeTime = 30 //30s倒计时
        this.intervalID = setInterval(() => {
          --this.computeTime
          if(this.computeTime === 0) {  //当计时为0的时候清空计时器
            clearInterval(this.intervalID)
          }
        }, 1000);
        reqEmailCaptcha(emailAccount).then((result) => {
          if(result.data.result == 0 ) { //根据文档 0为发送邮箱失败
          this.computeTime = 0 //这时候归零按钮，不用等倒计时结束
          this.$message.error('验证码接受失败')
        }
        }).catch((err) => {
          this.computeTime = 0
          this.$message.error('网络错误')
        });

      }
    },
    submitRegisterForm(formName) { //ele组件的表单验证，验证通过就在回调函数里面传入true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading1 = true
            this.passwordForm.password = this.$md5(this.passwordForm.password)
            reqPassword(this.passwordForm).then((result) => {
              this.loading1 = false
              switch (result.data.result) {
              case '5':
                this.$message.error('未发送验证码')
                break;
              case '4':
                this.$message.error('一次修改密码提交次数超过两次')
                break;
              case '3':
                this.$message.error('验证码错误')
                break;
              case '2':
                this.$message.error('不存在密码')
                break;
              case '1':
                this.$message.success('操作成功')
                //这里应该清空表单并且关闭弹框
                this.$refs.passwordForm.resetFields()
                this.dialogFormVisible = false
                break;
              case '0':
                this.$message.success('密码为空')
                break;
              default:
                break;
            }
            }).catch((err) => {
              this.loading1 = false
              this.$message.error('网络错误')
            })
            //注册返回结果验证
          } else {
            return false;
          }
        });

  }},
  }

</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #919191;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #000000!important;
  }
}
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #000!important;
    margin-bottom: 10px;
    position: relative;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
    .getEmailCaptcha{
      background: rgba(0,0,0,0);

    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>


