
import { Home } from 'layout/'

import {EnergyConsumption} from 'views/'

export default {
  path: '/EnergyConsumption',
  name: '能耗统计',
  icon: 'icon-nenghaotongji1',
  component: Home,
  redirect: '/EnergyConsumption/ItemStatistics',
  children: [
    {
      path: 'waterStatistcs',
      name: '水电用能统计',
      icon: 'inbox',
      component: EnergyConsumption.waterStatistcs,
    },{
    path: 'ItemStatistics',
    name: '分项用电统计',
    icon: 'inbox',
    component: EnergyConsumption.ItemStatistics,
  }]
}

