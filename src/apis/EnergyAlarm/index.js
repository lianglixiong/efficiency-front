/**
 * 用户模块
 * @type {Object}
 */
export default [
    {
      name: '定额配置',
      method: 'saveEnergyLimit',
      path: 'alert/saveEnergyLimit',
      type: 'post'
    },{
      name: '定额查询',
      method: 'queryEnergyLimit',
      path: 'alert/queryEnergyLimit',
      type: 'post'
    },{
      name: '超额告警查询',
      method: 'queryExcessAlarm',
      path: 'alert/queryExcessAlarm',
      type: 'post'
    }
  ]
  