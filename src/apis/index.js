/**
 * Created by sailengsi on 2017/5/11.
 */

/**
 * 导出所有模块需要用到接口
 * 一级属性：模块名
 * 一级属性中的方法：当前模块需要用的接口
 * @type {Object}
 */

import user from './user/'
import index from './homeIndex/'
import EnergyConsumption from './EnergyConsumption/'
import EnergyAnalysis from './EnergyAnalysis/'
import EnergyAlarm from './EnergyAlarm/'
import ReportManager from './ReportManager/'


export default [{
  module: 'user',
  name: '用户管理',
  list: user
}, {
  module: 'homeIndex',
  name: '耗能概况',
  list: index
}, {
  module: 'energyConsumption',
  name: '耗能统计',
  list: EnergyConsumption
}, {
  module: 'energyAnalysis',
  name: '耗能分析',
  list: EnergyAnalysis
}, {
  module: 'energyAlarm',
  name: '用能告警',
  list: EnergyAlarm
}, {
  module: 'ReportManager',
  name: '报表管理',
  list: ReportManager
}]
