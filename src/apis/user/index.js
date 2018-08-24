/**
 * 用户模块
 * @type {Object}
 */
export default [
  {
    name: '登录',
    method: 'login',
    path: '/login/login',
    type: 'post'
  },
  {
    name: '退出',
    method: 'logout',
    path: '/login/logout',
    type: 'get'
  },
  {
    name: '获取验证码',
    method: 'getImgCode',
    path: '/login/getImgCode',
    type: 'get'
  }
]
