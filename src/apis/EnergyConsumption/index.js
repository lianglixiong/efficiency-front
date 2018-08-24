/**
 * 用户模块
 * @type {Object}
 */
export default [
  {
    name: '建筑物树形菜单',
    method: 'buildingTree',
    path: 'statistics/buildingTree',
    type: 'post'
  },{
    name: '部门树形菜单数据',
    method: 'deptTree',
    path: 'statistics/deptTree',
    type: 'post'
  },{
    name: '区域树形菜单数据',
    method: 'efficPointTree',
    path: 'statistics/efficPointTree',
    type: 'post'
  },
  {
    name: '用电统计',
    method: 'deptBuildingElec',
    path: 'statistics/deptBuildingElec',
    type: 'post'
  },{
    name: '用水统计',
    method: 'deptBuildingWater',
    path: 'statistics/deptBuildingWater',
    type: 'post'
  },{
    name: '能耗分项统计',
    method: 'subItemSta',
    path: 'statistics/subItemSta',
    type: 'post'
  },{
    name: '能耗分析对比',
    method: 'subItemContrast',
    path: 'statistics/subItemContrast',
    type: 'post'
  }
]
