import { Home } from 'layout/'

import {EnergyAnalysis} from 'views/'

export default {
  path: '/EnergyAnalysis',
  name: '能耗分析',
  icon: 'icon-nenghaofenxi1',
  component: Home,
  redirect: '/EnergyAnalysis/CostComparison',
  children: [
    {
      path: 'CostComparison',
      name: '成本对比',
      icon: 'inbox',
      component: EnergyAnalysis.CostComparison,
    },{
      path: 'BuildingContrast',
      name: '建筑物对比',
      icon: 'inbox',
      component: EnergyAnalysis.CostComparison,
    },{
    path: 'Ranking',
    name: '排名参考',
    icon: 'inbox',
    component: EnergyAnalysis.Ranking,
  },{
    path: 'YearAndMonth',
    name: '年月对比',
    icon: 'inbox',
    component: EnergyAnalysis.YearAndMonth,
  },{
    path: 'Fluence',
    name: '能流图',
    icon: 'inbox',
    component: EnergyAnalysis.Fluence,
  }]
}