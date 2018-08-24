import axios from 'axios'
import { debounce } from 'utils/'

let mydate = new Date();
//用于做后台jedis缓存
const verify_uuid = "verify_" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds();
export default {
  name: 'login',
  data() {
    return {
      imgError: true,
      debounceLogin: '',
      cityId:'',
      winSize: {
        width: '',
        height: ''
      },
      remumber: this.$store.state.user.remumber,
      login_actions: {
        disabled: false
      },
      data: {
        userName: '',
        userPassword: '',
        validateCode: '',
        verify: verify_uuid
      },
      rule_data: {
        userName: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'))
            } else {
              if (/^[a-zA-Z0-9_-]{1,16}$/.test(value)) {
                callback()
              } else {
                callback(new Error('用户名至少6位,由大小写字母和数字,-,_组成'))
              }
            }
          },
          trigger: 'blur'
        }],
        userPassword: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        validateCode: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入验证码'))
            } else {
              if (value.length != 4) {
                callback(new Error('验证码长度为4位'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  activated() {
    let _this = this;
    if (this.$store.getters.getUserinfo.userName && this.$store.state.router.headerCurRouter) {
      this.$alert('请先退出登录，再进入登录页登录', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          _this.$router.push(_this.$store.state.router.headerCurRouter);
        }
      })
    }
  },
  mounted() {
    this.changeCode();
    this.initDebounce();
  },
  methods: {
    setSize() {
      this.winSize.width = this.$$lib_$(window).width() + 'px'
      this.winSize.height = this.$$lib_$(window).height() + 'px'
    },
    //获取验证码图片
    changeCode() {
      let self = this;
      axios.get('/login/getImgCodeFlush', {
        params: { verify: verify_uuid },
        responseType: 'arraybuffer'
      })
        .then(response => {
          let codeImg = 'data:image/png;base64,' + btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          document.getElementById("validateImg").src = codeImg
          self.imgError = false;
        })
    },
    initDebounce() {
      this.onLogin = debounce(this.loginFn, 1000);
    },
    onLogin() {

    },
    loginFn(ref, type) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          if (!this.login_actions.disabled) {
            this.login_actions.disabled = true;
            let _self = this,
              rootPath = '/g-situation/home',
              fullPath = 'g-situation/home';
            this.$$api_user_login({
              data: this[ref],
              fn: data => {
                //TO DO
                _self.$store.dispatch('remove_userinfo').then(() => {
                  _self.$store.dispatch('update_userinfo', data.user);
                  _self.$store.dispatch('save_navList', data.node);
                  _self.$store.dispatch('set_cur_route', {
                    rootPath
                  });
                  _self.$router.push(fullPath);
                });
                this.cityId = data.user.weatherId;
                window.sessionStorage.setItem('cityId',this.cityId)

              },
              errFn: (err) => {
                _self.$message.error(err.message);
                _self.login_actions.disabled = false;
              },
              tokenFlag: true
            })
          } else {
            return this.$message({
              duration: '3000',
              message: '请勿重复提交，等待登录请求完成!'
            });
          }
        } else {
          return false;
        }
      })
    },
    resetForm(ref) {
      this.$refs[ref].resetFields()
    },
  },
  created() {
    this.setSize()
    this.$$lib_$(window).resize(() => {
      this.setSize()
    })
  }
}
