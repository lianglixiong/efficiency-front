<template>
  <div>

    <header class="head-nav">
      <div class="head-left">
        <el-row class="head-top">
          <el-col class='logo-container'>
            <img src="../../assets/LOGO_03.png" class='logo' alt="">
            <h3 class="logo-title">能耗管理系统</h3>
          </el-col>
        </el-row>
        <el-row class="head-bottom">
          <el-col :span="20">
            <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" unique-opened router @select="handleSelect">
              <template v-for='(item) in navList'>
                <el-submenu v-if='!item.hidden && (($store.state.user.userinfo.access_status===1 && $store.state.user.userinfo.web_routers[item.path]) || $store.state.user.userinfo.access_status!==1)&&item.children.length&&item.children[0].name' :key='item.path' :index="item.path">
                  <template slot="title">
                    <i :class="'iconfont ' + item.icon"></i>{{item.name}}</template>
                  <template v-for="child in item.children">
                    <el-menu-item v-if="!child.hidden" :index="item.path+'/'+child.path" :key="child.path">{{child.name}}</el-menu-item>
                  </template>
                </el-submenu>
                <el-menu-item :index="item.path+'/'+item.children[0].path" :key='item.path' v-else-if='!item.hidden && item.children.length&& (($store.state.user.userinfo.access_status===1 && $store.state.user.userinfo.web_routers[item.path]) || $store.state.user.userinfo.access_status!==1)' class="">
                  <i :class="'iconfont ' + item.icon"></i>{{item.name}}
                </el-menu-item>
              </template>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="head-right">
        <el-row>
          <el-col class="userinfo">
            <!-- <span class='username'><i class='fa fa-user'></i>{{this.$store.state.user.userinfo.username}}</span> -->
            <span class='username'>
              <el-breadcrumb separator="|" class="right-list list-top">
                <el-breadcrumb-item>
                  <a>{{dialog.user_info.userName||"未登录"}}</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-if='$store.state.user.userinfo.is_update_pass'>
                  <a @click="setDialogInfo('pass')">账户信息</a>
                </el-breadcrumb-item>
                <!-- <el-breadcrumb-item>
                  <a @click="setDialogInfo('set')">我的账户</a>
                </el-breadcrumb-item> -->
                <el-breadcrumb-item>
                  <a @click="setDialogInfo('logout')">退出</a>
                </el-breadcrumb-item>
              </el-breadcrumb>
              <div class="right-list list-bottom">{{dateTime}}</div>
            </span>
          </el-col>
        </el-row>
      </div>
    </header>

    <el-dialog size="small" :title="dialog.title" v-model="dialog.show_pass">
      <el-form style="margin:20px;width:80%;" label-width="100px" :model="dialog.user_info" :rules="dialog.user_info_rules" ref='user_info'>
        <el-form-item class='edit-form' label="邮箱" prop='email'>
          <el-input v-model="dialog.user_info.email" disabled placeholder='常用邮箱'></el-input>
        </el-form-item>
        <el-form-item class='edit-form' label="用户名称" prop='username'>
          <el-input v-model="dialog.user_info.username" disabled placeholder='用户名'></el-input>
        </el-form-item>
        <el-form-item class='edit-form' label="当前密码" prop='old_password'>
          <el-input type='password' placeholder='当前密码' auto-complete='off' v-model="dialog.user_info.old_password"></el-input>
        </el-form-item>
        <el-form-item class='edit-form' label="新密码" prop='password'>
          <el-input type='password' placeholder='新密码' auto-complete='off' v-model="dialog.user_info.password"></el-input>
        </el-form-item>
        <el-form-item class='edit-form' label="确认密码" prop='password_confirm'>
          <el-input type='password' placeholder='确认密码' auto-complete='off' v-model="dialog.user_info.password_confirm"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show_pass = false">取 消</el-button>
        <el-button type="primary" @click="updUserPass('user_info')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog size="small" :title="dialog.title" v-model="dialog.show_set">
      <el-form style="margin:20px;width:80%;" label-width="100px" v-model='dialog.set_info' ref='set_info'>
        <el-form-item label="登录方式">
          <el-select placeholder="请选择登录方式" v-model='dialog.set_info.login_style'>
            <el-option label="单一登录" value="1"></el-option>
            <el-option label="多点登录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="禁止修改密码">
          <el-select placeholder="请选择用户" multiple v-model='dialog.set_info.disabled_update_pass'>
            <!-- value的值的ID是number，disabled_update_pass的元素中的是字符串，
                所以在value上，需要拼装一个空串，来转化
                因为elementUI内部用了===
            -->
            <el-option v-for='(user,index) in dialog.set_info.select_users' :key='index' :label='user.username' :value='user.id+""'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show_set = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateSetting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeadNavJs from "./HeadNav.js";

export default HeadNavJs;
</script>

<style lang='less'>
.logo-container {
  display: flex;
  align-items: center;
  height: 7.605vh;
}

.logo {
  height: 5.752vh;
  width: 5.752vh;
}

.logo-title {
  font-size: 3.333vh;
  padding-left: 1vw;
}

.fa-user {
  position: relative;
  top: -2px;
  margin-right: 4px;
}

.head-nav {
  width: 100%;
  height: 12.1vh;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
  padding-left: 2.3184vw;
  border: none;
  font-size: 0.875vw;

  .logout {
    width: 60px;
    line-height: 6.5vh;
    text-align: center;
    float: right;
    cursor: pointer;
  }
}
.el-menu-item {
  &:hover {
    background: #999 !important;
    // color:#4e88f9 !important;
  }
}
.userinfo {
  float: right;
  padding-right: 1.5vw;
  text-align: right;
}

.username {
  .el-breadcrumb {
    .el-breadcrumb__item {
      &:not(:first-child):hover {
        a {
          color: #4e88f9;
        }
      }
      &:last-child {
        a {
          cursor: pointer;
          &:hover {
            cursor: pointer;
          }
        }
      }
      &:first-child {
        a:hover {
          cursor: text;
        }
      }
      a {
        color: #eeeeee;
      }
    }
  }
  .right-list {
    display: inline-block;
    font-size: 1.491vh;
    &:nth-of-type(1) {
      margin-top: 1.643vh;
    }
    &:nth-of-type(2) {
      display: block;
      margin-top: 1.278vh;
    }
  }
}

.head-bottom {
  .el-menu-demo {
    .el-submenu .el-submenu__icon-arrow{
      color:#fff;
    }
    .el-menu-item,
    .el-submenu .el-submenu__title {
      height: auto;
      line-height: 3.695vh;
      border-bottom-width: 0.665vh;
      font-size: 2.205vh;
      padding: 0 0.834vw;
      color: #bec6c4;
    }

    &.el-menu--dark .el-menu-item:hover,
    .el-submenu:hover .el-submenu__title {
      border-bottom-width: 0.665vh;
    }

    &.el-menu--dark .el-submenu__title:hover{
      background: #999;
      color:#fff;
      .iconfont {
        color: #fff;
      }
    }

    &.el-menu--dark .el-menu-item:hover{
      color: #fff;
      .iconfont {
        color: #fff;
      }
    }

    &.el-menu--dark .el-menu-item.is-active,
    .el-submenu.is-active .el-submenu__title {
      color: #fff;
      background: #4e88f9;
      border-color: #4e88f9;
      border-bottom-width: 0.665vh;
      // border-top:0.555vh solid #4e88f9;
      .iconfont {
        color: #fff;
      }
    }

    .el-submenu .el-menu {
      top: 4.4vh;
      background: #324157;
      border-color: #324157;
      .el-menu-item {
        color: #ffffff;
        background: #324157;
      }
      .el-menu-item.is-active {
        color: #fff;
        background: #4e88f9;
      }
    }

    .iconfont {
      font-size: 2.362vh;
      margin-right: 0.28vw;
      vertical-align: top;
      color: #bec6c4;
    }
  }
}

.head-left,
.head-right {
  height: 100%;
}

.head-left {
  float: left;
  width: 60%;
}

.head-right {
  float: right;
  width: 40%;
}
</style>
