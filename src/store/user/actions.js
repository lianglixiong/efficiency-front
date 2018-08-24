/**
 * Created by sailengsi on 2017/5/10.
 * Modified by davyWen on 2018/7/11.
 */

import * as types from './mutations_types.js'

export default {
  update_userinfo: ({
    commit
  },
    userinfo
  ) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_USERINFO,userinfo)
      resolve()
    })
  },

  remove_userinfo: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_USERINFO)
      resolve()
    })
  },

  update_remumber: ({
    commit
  }, {
    remumber_flag,
    remumber_login_info
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_REMUMBER, {
        remumber_flag,
        remumber_login_info
      })
      resolve()
    })
  },

  remove_remumber: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_REMUMBER)
      resolve()
    })
  },

  save_navList: ({
    commit
  },
    navList
  ) => {
    return new Promise((resolve, reject) => {
      commit(types.SAVE_NAVLIST,navList)
      resolve()
    })
  },

  move_navList: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_NAVLIST)
      resolve()
    })
  },
}
