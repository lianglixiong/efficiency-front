import { Home } from 'layout/'

import {EnergyAlarm} from 'views/'

export default {
  path: '/EnergyAlarm',
  name: '用能告警',
  icon: 'icon-yongnenggaojing',
  component: Home,
  redirect: '/EnergyAlarm/excessAlarm',
  children: [
    {
      path: 'quotaMange',
      name: '能耗定额管理',
      icon: 'inbox',
      component: EnergyAlarm.quotaMange,
    },{
      path: 'excessAlarm',
      name: '能耗超额告警查询',
      icon: 'inbox',
      component: EnergyAlarm.excessAlarm,
    },]
}