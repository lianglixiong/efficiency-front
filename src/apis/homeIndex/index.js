/**
 * 用户模块
 * @type {Object}
 */
export default [
  {
    name: '用水能耗',
    method: 'waterTrendCap',
    path: 'main/waterTrendCap',
    type: 'get'
  },{
    name: '用电能耗',
    method: 'eleTrendCap',
    path: 'main/eleTrendCap',
    type: 'get'
  },{
    name: '能耗日历',
    method: 'calendarCap',
    path: 'main/calendarCap',
    type: 'get'
  },{
    name: '总数据',
    method: 'totalData',
    path: 'main/totalData',
    type: 'get'
  },{
    name: '单位面积用电',
    method: 'areaAvgEle',
    path: 'main/areaAvgEle',
    type: 'get'
  },{
    name: '上月总量',
    method: 'lastMonthData',
    path: 'main/lastMonthData',
    type: 'get'
  },{
    name: '上月总能耗',
    method: 'colligateCap',
    path: 'main/colligateCap',
    type: 'get'
  }
]
