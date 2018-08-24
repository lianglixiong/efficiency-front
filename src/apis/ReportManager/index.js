/**
 * 用户模块
 * @type {Object}
 */
export default [
    {
      name: '能耗综合报表查询',
      method: 'queryStatement',
      path: 'statement/queryStatement',
      type: 'post'
    },{
      name: '报表导出',
      method: 'export',
      path: 'statement/export',
      type: 'post'
    }
  ]
  