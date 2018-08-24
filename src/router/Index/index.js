/**
 * Created by sailengsi on 2017/5/11.
 */

import { Home } from 'layout/'

// const Index = ()=> import (/* webpackChunkName: "index" */ '@/views/Index')
import { Index } from 'views/'

export default {
  path: '/g-situation',
  name: '能耗概况',
  icon: 'icon-nenghaogaikuang',
  component: Home,
  redirect: '/g-situation/home',
  children: [{
    path: 'home',
    // name: '主页',
    icon: 'home',
    component: Index
  }]
}
