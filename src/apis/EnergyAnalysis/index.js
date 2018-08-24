/**
 * 用户模块
 * @type {Object}
 */
export default [
    {
      name: '不同建筑用水对比',
      method: 'buildingWater',
      path: 'analyze/buildWaterCountCompare',
      type: 'post'
    },{
      name: '不同建筑用水成本对比',
      method: 'buildWaterCost',
      path: 'analyze/buildWaterCostCompare',
      type: 'post'
    },{
      name: '不同建筑用电对比',
      method: 'buildEle',
      path: 'analyze/buildEleCountCompare',
      type: 'post'
    },{
        name: '不同建筑用电成本对比',
        method: 'buildEleCost',
        path: 'analyze/buildEleCostCompare',
        type: 'post'
    },{
        name: '不同部门用水对比',
        method: 'deptWaterCount',
        path: 'analyze/deptWaterCountCompare',
        type: 'post'
    },{
        name: '不同部门用水成本对比',
        method: 'deptWaterCost',
        path: 'analyze/deptWaterCostCompare',
        type: 'post'
    },{
        name: '不同部门用电对比',
        method: 'deptEleCount',
        path: 'analyze/deptEleCountCompare',
        type: 'post'
    },{
        name: '不同部门用电成本对比',
        method: 'deptEleCost',
        path: 'analyze/deptEleCostCompare',
        type: 'post'
    },{
        name: '不同区域成本对比',
        method: 'areaCostCompare',
        path: 'analyze/areaCostCompare',
        type: 'post'
    },{
        name: '不同区域用量对比',
        method: 'areaCountCompare',
        path: 'analyze/areaCountCompare',
        type: 'post'
    },{
        name: '同建筑用水历史对比',
        method: 'buildWaterCountHis',
        path: 'analyze/buildWaterCountHistoryCompare',
        type: 'post'
    },{
        name: '同建筑用电历史对比',
        method: 'buildEleCountHis',
        path: 'analyze/buildEleCountHistoryCompare',        
        type: 'post'
    },{
        name: '同部门用水历史对比',
        method: 'deptWaterCountHis',
        path: 'analyze/deptWaterCountHistoryCompare',
        type: 'post'
    },{
        name: '同部门用电历史对比',
        method: 'deptEleCountHis',
        path: 'analyze/deptEleCountHistoryCompare',
        type: 'post'
    },{
        name: '同区域历史对比',
        method: 'areaCountHis',
        path: 'analyze/areaCountHistoryCompare',
        type: 'post'
    },{
        name: '能流图',
        method: 'energyFlow',
        path: 'analyze/energyFlow',
        type: 'post'
    },{
        name: '用水排名统计',
        method: 'waterRank',
        path: 'statistics/waterRank',
        type: 'post'
    },{
        name: '用电排名统计',
        method: 'eleRank',
        path: 'statistics/eleRank',
        type: 'post'
    },{
        name: '查询地区历史气温记录',
        method: 'getweather',
        path: 'main/getHistoryWeather',
        type: 'post'
    }
  ]
  
  