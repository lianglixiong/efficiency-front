import { Home } from 'layout/'

import {ReportManager} from 'views/'

export default {
  path: '/ReportManager',
  name: '报表管理',
  icon: 'icon-baobiaoguanli',
  component: Home,
  redirect: '/ReportManager/syntheticalReport',
  children: [
    {
      path: 'syntheticalReport',
      name: '综合报表',
      icon: 'inbox',
      component: ReportManager.syntheticalReport,
    }]
}