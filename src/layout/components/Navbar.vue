<template>
  <div class="navbar">
    <div class="left-menu">
      <div class="left-menu-item">
        <ul>
          <li>
            <logo v-if="show_logo"></logo>
          </li>
        </ul>
      </div>
    </div>

    <div class="right-menu">
      <div class="right-menu-item">
        <ul>
          <li v-for="(item, index) in topicList" v-bind:key="index"
            v-bind:class="{checked: index === activeIndex}"
            v-on:click="changeIndex(index)">
            <svg-icon v-bind:icon-class=item.icon />
            <a>{{item.name}}</a>
          </li>
        </ul>
      </div>
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="search"></search>
      </template>

      <div class="avatar-container right-menu-item hover-effect" v-if="show_login">
        <div class="avatar-wrapper" style="margin-top:unset">
          <a class="login" @click="openLoginDialog">登录</a>
        </div>
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" v-if="show_profile">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatarUrl" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>我的问题</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="登录"
      :visible.sync="loginDialogVisible"
      v-if="loginDialogVisible"
      :modal-append-to-body="false"
      top="3%"
    >
      <el-form :model="loginForm" class="loginForm">
        <div class="form-group">
          <el-row>
            <el-col :span="24">
              <label class="control-label">账号 或 Email</label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-input v-model="loginForm.account" placeholder="请输入账号 或 Email"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="form-group">
          <el-row>
            <el-col>
              <label class="control-label">密码</label>
              <span class="pull-right">
                <a tabindex="4">忘记密码</a>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-input v-model="loginForm.pwd" placeholder="请输入密码"></el-input>
            </el-col>
          </el-row>
        </div>

        <div class="dialog-footer-login">
          <el-row>
            <el-col :span="24">
              <el-button>登 录</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="more-login-area">
          <span class="more-login-words">更多登录方式</span>
        </div>
        <div class="widget-login">
          <a target="_self" @click="oauth()"><svg-icon icon-class="github" /></a>
          <a target="_self"><svg-icon icon-class="qq" /></a>
          <a target="_self"><svg-icon icon-class="weixin" /></a>
        </div>
        <div class="dialog-footer-register">
          <el-row>
            <el-col :span="24">
              <el-button>注册新账号</el-button>
            </el-col>
          </el-row>
        </div>
        <div>
          <p class="privacy">继续即表示你同意<a>《服务条款》</a>和<a>《隐私政策》</a></p>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import Logo from '@/layout/components/Logo'
import Search from '@/components/HeaderSearch'
import {qryTopicList} from '@/api/topic.js'
import {setToken, getToken, removeToken} from '@/utils/auth'
import {qryUserInfo, logout} from '@/api/user.js'

export default {
  components: {
    Logo,
    Search
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  },
  data () {
    return {
      show_logo: true,
      activeIndex: 0,
      show_login: true,
      show_profile: false,
      topicList: [{name: '热点话题', icon: 'topic'}, {name: '分享', icon: 'share'}, {name: '发现', icon: 'discover'}, {name: '文章', icon: 'article'}],
      loginDialogVisible: false,
      loginForm: {
        account: '',
        pwd: ''
      },
      userInfo: {
        accountId: '',
        avatarUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
      }
    }
  },
  methods: {
    changeIndex (index) {
      this.activeIndex = index
    },
    // 获取话题列表
    getTopicList () {
      qryTopicList().then(res => {
        this.topicList = res.data
      })
    },
    // 获取用户信息
    getUserInfo () {
      qryUserInfo().then(res => {
        this.loginDialogVisible = false
        this.show_login = false
        this.show_profile = true
        this.userInfo = res.data
      })
    },
    // 打开登录弹框
    openLoginDialog () {
      this.loginDialogVisible = true
    },
    // 第三方登录授权
    oauth () {
      // 执行授权回调
      let $oauthWindow = {}
      setTimeout(() => {
        $oauthWindow = window.open(
          'https://github.com/login/oauth/authorize?client_id=Iv1.a004a44d31cbeff2&redirect_uri=http://localhost:8088/community/github/callback&scope=user&state=1',
          'popup',
          'width=600, height=500, top=0, left=10'
        )
      }, 2000)
      // 轮询子窗口地址栏变化
      let loop = setInterval(() => {
        // 解决本站与github网站不同源报错
        if ($oauthWindow && $oauthWindow.location) {
          let url = $oauthWindow.location.href
          if (url && url !== 'about:blank') {
            if (url.indexOf('http://localhost/community') !== -1) {
              const token = url.split('?')[1].split('=')[1]
              setToken(token) // 存入令牌
              $oauthWindow.close()
            }
          }
        }
        if ($oauthWindow.closed) {
          this.getUserInfo()
          clearInterval(loop)
        }
      }, 2000)
    },
    // 退出登录
    logout () {
      const sessionId = getToken()
      removeToken() // 删除本地授权令牌Cookie
      logout(sessionId).then(res => {
        this.show_login = true
        this.show_profile = false
        this.$router.push({path: '/'}) // 返回首页
      })
    }
  },
  created () {
    this.getTopicList()
  }
}
</script>
<style scoped lang="scss">
.navbar {
  border-top: 3px solid #009a61;
  height: 67px;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1), 0 1px rgba(0,0,0,0.1);
  background: #fafafa;
  overflow: hidden;
  position: relative;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 8px 8px;
      height: 100%;
      color: #5a5e66;
      vertical-align: text-bottom;
      ul {
        list-style: none;
        float: left;
        margin: 0;
        li {
          float: left;
          color: #757575;
          font-size: 16px;
          padding: 0 16px;
          cursor: pointer;
          .navbar-icon {
            font-size: 18px;
          }
        }
        .checked {
          color: #009a61;
        }
      }
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .search {
      display: inline-block;
      padding: 8px 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .login {
          color: #009a61;
          font-size: 16px;
          text-decoration: none;
          padding: 8px 8px;
          cursor: pointer;
          width: 40px;
          border-radius: 4px;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          // border-radius: 10px;
          border-radius: 50%
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }

  .left-menu {
    float: left;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }

    .left-menu-item {
      display: inline-block;
      padding: 8px 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      ul {
        list-style: none;
        float: left;
        margin: 0;
        li {
          float: left;
          color: #757575;
          font-size: 14px;
          cursor: pointer;
          .navbar-icon {
            font-size: 18px;
          }
        }
      }
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
  }
}
.svg-icon {
  font-size: 20px;
}
.loginForm {
  padding:0 125px;
  margin-top: 15px;
}
.form-group {
  margin-bottom: 15px;
}
.control-label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: bold;
}
.pull-right {
  float: right;
  a {
    color: #009a61;
    text-decoration: none;
  }
}
.dialog-footer-login {
  button {
    width: 100%;
    color: #fff;
    background-color: #009a61;
    border-color: #008151;
  }
}
.more-login-area {
  margin-top: 30px;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  position: relative;
  text-align: center;
  color: #777;
  .more-login-words {
    position: absolute;
    left: calc(50% - 52px);
    top: -10px;
    padding: 0 10px;
    background: #fff;
  }
}
.widget-login {
  text-align: center;
  padding-bottom: 10px;
  a {
    padding: 0 5px;
  }
}
.dialog-footer-register {
  margin: 15px 0;
  button {
    width: 100%;
    color: #333;
    background-color: #fff;
    border-color: #ccc;
  }
}
.privacy {
  text-align: center;
  a {
    color: #009a61;
    text-decoration: none;
  }
}
</style>
