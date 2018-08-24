import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'
import qs from 'qs'

import { Login } from 'views/'

import EnergyConsumption from './EnergyConsumption/'
import EnergyAnalysis from './EnergyAnalysis/'
import Index from './Index/'
import ReportManager from './ReportManager/'
import EnergyAlarm from './EnergyAlarm/'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      hidden: true,
      component: Login
    },{
      path: '/jump',
      name: '跳转',
      hidden: true
    },
    Index,
    EnergyConsumption,
    EnergyAnalysis,
    ReportManager,
    EnergyAlarm
  ]
});

router.beforeEach((to, form, next) => {
  const userinfo = router.app.$store.getters.getUserinfo;
  
  if(userinfo.userName && userinfo.weatherId){
      if(to.path.indexOf('login') > -1){
        next('/g-situation/home');
      }else{
        next();
      }
  }else{
      let baseUrl = window.location.href,
      baseParam = baseUrl.split('?'),
      params = {},
      str = decodeURIComponent(baseParam[1]);
      params[str.split("=")[0]] = (str.split("=")[1]);

      let sendD = {
        userToken: params.edian
      };
      if(to.path.indexOf('login') > -1){
        next();
      }else if(to.path.indexOf('jump') > -1 && params.edian){
        router.app.axios({ // 用axios发送post请求
          method: 'post',
          url: '/login/login', // 请求地址       
          data: qs.stringify(sendD), // 参数 
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        })
        .then((res) => { // 处理返回的文件流
          if(res.data.code==200){
            router.app.$store.dispatch('remove_userinfo').then(() => {
              router.app.$store.dispatch('update_userinfo', res.data.data.user);
              router.app.$store.dispatch('save_navList', res.data.data.node);
              this.cityId = res.data.data.user.weatherId;
              window.sessionStorage.setItem('cityId',this.cityId);
              router.app.$store.dispatch('set_cur_route', {
                rootPath: '/g-situation/home'
              });
             
              next('/g-situation/home');
            });
          }else{
            next('/login');
          }      
        })
        .catch(function () {
          next('/login');
        });
      }else{
        next('/login');
      }
  }
});

export default router;
