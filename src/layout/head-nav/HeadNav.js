import { transDate } from 'utils/'

export default {
  name: 'head-nav',
  data() {
    let _this = this;
    return {
      activeIndex: "",
      dateTime: "",
      navList:[],
      dialog: {
        show_access: false,
        show_set: false,
        show_pass: false,
        title: '修改密码',
        user_info: _this.$store.getters.getUserinfo,

        set_info: {
          login_style: '',
          disabled_update_pass: [],
          select_users: []
        },

        user_info_rules: {
          old_password: [{
            required: true,
            message: '旧密码不能为空！',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '新密码不能为空！',
            trigger: 'blur'
          }, {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else {
                if (this.dialog.user_info.password !== '') {
                  this.$refs.user_info.validateField('password_confirm')
                }
                callback()
              }
            }
          }],
          password_confirm: [{
            required: true,
            message: '确认密码不能为空！',
            trigger: 'blur'
          }, {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.dialog.user_info.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            }
          }]
        }
      }
    }
  },
  created() {
    // this.checkNavList();//动态加载头部导航
    this.navList = this.$router.options.routes;//开发时使用
  },
  mounted() {
    this.$store.dispatch('set_cur_route', {
      rootPath: this.$route.path
    });
    this.activeIndex = this.$store.state.router.headerCurRouter;
    setInterval(this.setDateTime, 1000);
  },
  computed: {

  },
  methods: {
    /**
     * 根据用户权限过滤导航列表
     */
    checkNavList() {   	
      let getNavListStr = JSON.stringify(this.$store.getters.getNavList),     
        routList = this.$router.options.routes;
      for (let index = 0; index < routList.length; index++) {
        let _parent = routList[index];
        if (getNavListStr.indexOf(_parent.name) == -1) {
          _parent.hidden = true;
        }
        if (_parent.children && _parent.children[0].name) {
          let _children = _parent.children;
          for (let _index = 0; _index < _children.length; _index++) {
            const _child = _children[_index];

            if (getNavListStr.indexOf(_child.name) == -1) {
              _child.hidden = true;
            }
          }
          routList[index].children = _children.filter((item) => {
            return !item.hidden;
          });
        }
      }

      this.navList = routList;
    },
    setDateTime() {
      this.dateTime = transDate().allTheDate4;
    },
    handleSelect(val) {
      this.$store.dispatch('set_cur_route', {
        rootPath: val
      });
    },
    /**
     * 退出登录
     */
    logout() {
      let _self = this;
      this.$confirm('你确定退出登录么?', '确认退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.$$api_user_logout({
          data: {},
          fn: () => {
            _self.$store.dispatch('remove_userinfo').then(() => {
              _self.$router.push('/login');
              window.location.reload();
            });
          }
        });
      });
    },

    /**
     * 弹出框-修改密码或者系统设置
     * @param {string} cmditem 弹框类型
     */
    setDialogInfo(cmditem) {
      if (!cmditem) {
        console.log('test')
        this.$message('菜单选项缺少command属性')
        return
      }
      switch (cmditem) {
        case 'info':
          this.$router.push({
            path: '/demo/user/edit',
            query: {
              id: this.$store.state.user.userinfo.id
            }
          })
          break
        case 'pass':
          this.dialog.show_pass = true
          this.dialog.title = '修改密码'
          break
        case 'set':
          // this.onGetSetting()
          // this.dialog.show_set = true
          // this.dialog.title = '系统设置'
          break
        case 'logout':
          this.logout()
          break
      }
    },

    /**
     * 修改密码
     * @param  {object} userinfo 当前修改密码的表单信息
     */
    updUserPass(userinfo) {
      this.$refs[userinfo].validate((valid) => {
        if (valid) {
          this.$$api_user_updatePass({
            data: {
              old_password: this.dialog[userinfo].old_password,
              password: this.dialog[userinfo].password,
              password_confirm: this.dialog[userinfo].password_confirm
            },
            fn: data => {
              this.dialog.show_pass = false
              this.$message.success('修改成功！')
            }
          })
        }
      })
    },

    /**
     * 获取系统设置信息
     */
    onGetSetting() {
      // 获取系统设置信息
      if (this.$store.state.user.userinfo.pid === 0) {
        this.$$api_system_getSetting({
          fn: data => {
            if (data.setting_info.disabled_update_pass) {
              data.setting_info.disabled_update_pass = data.setting_info.disabled_update_pass.split(',')
            } else {
              data.setting_info.disabled_update_pass = []
            }
            data.setting_info.login_style = data.setting_info.login_style + ''

            this.dialog.set_info = data.setting_info
          }
        })
      } else {
        this.$message.error('只有管理员才能操作！')
      }
    },
    /**
     * 修改系统设置信息
     */
    onUpdateSetting() {
      // console.log(this.dialog.set_info.login_style);
      // console.log(this.dialog.set_info.disabled_update_pass);
      // console.log(this.dialog.set_info.id);

      this.$$api_system_updateSetting({
        data: {
          id: this.dialog.set_info.id,
          login_style: this.dialog.set_info.login_style,
          disabled_update_pass: this.dialog.set_info.disabled_update_pass && this.dialog.set_info.disabled_update_pass.length ? this.dialog.set_info.disabled_update_pass.join(',') : ''
        },
        fn: data => {
          this.dialog.show_set = false
        }
      })
    }
  }
}
