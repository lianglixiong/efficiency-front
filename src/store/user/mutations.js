/**
 * Created by sailengsi on 2017/5/10.
 * Modified by davyWen on 2018/7/11.
 */
import {
  store
} from 'utils/'

import * as types from './mutations_types'

export default {
  [types.UPDATE_USERINFO] (state, userDb) {
    state.userinfo = userDb || {}
    store.set('userinfo', state.userinfo)
  },

  [types.REMOVE_USERINFO] (state) {
    store.remove('userinfo')
    state.userinfo = {}
  },

  [types.UPDATE_REMUMBER] (state, userDb) {
    state.remumber.remumber_flag = userDb.remumber_flag
    state.remumber.remumber_login_info = userDb.remumber_login_info

    store.set('remumber_flag', state.remumber.remumber_flag)
    store.set('remumber_login_info', state.remumber.remumber_login_info)
  },

  [types.REMOVE_REMUMBER] (state) {
    store.remove('remumber_flag')
    store.remove('remumber_login_info')

    state.remumber.remumber_flag = false
    state.remumber.remumber_login_info = {
      username: '',
      token: ''
    }
  },
  [types.SAVE_NAVLIST] (state, userDb) {
    state.navList = userDb || {}
    store.set('navList', state.navList)
  },

  [types.REMOVE_NAVLIST] (state) {
    store.remove('navList')
    state.navList = {}
  },
}
