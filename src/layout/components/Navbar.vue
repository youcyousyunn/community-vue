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
            <svg-icon v-if="item.icon" v-bind:icon-class=item.icon />
            <a @click="searchByTopic(item)">{{item.name}}</a>
          </li>
        </ul>
      </div>
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="search"></search>
      </template>

      <div class="avatar-container right-menu-item hover-effect" v-if="show_login">
        <div class="avatar-wrapper">
          <a class="login" @click="openLoginDialog">立即登录</a>
        </div>
        <div class="avatar-wrapper">
          <a class="register">免费注册</a>
        </div>
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" v-if="show_profile">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatar" class="user-avatar">
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
              <el-input type="password" v-model="loginForm.pwd" placeholder="请输入密码"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="form-group">
          <el-row>
            <el-col :span="24">
              <label class="control-label">验证码</label>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-input v-model="loginForm.vCode" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="10" class="login-code">
              <img :src="vCodeImg" />
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
import {qryTopicList} from '@/api/tag.js'
import {setToken, getToken, removeToken} from '@/utils/auth'
import {qryUserInfo, logout} from '@/api/user.js'
import transfer from '@/utils/transfer.js'
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
      topicId: '',
      show_logo: true,
      activeIndex: 0,
      show_login: true,
      show_profile: false,
      topicList: [],
      loginDialogVisible: false,
      vCodeImg: 'data:image/gif;base64,' + '/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAkAG8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2GuVgtrjWNTvyL6aGKKTaoVjg8kevtXTyuIonkPRVLH8K4/S4NQFhJdxahDawM/ztIcc9M5Irc5Ymzb+HzDcRzNf3Emxg20ng4rarnrSXVYhIPNWeSQbYTdboU34JxgjcTgZ4GMA88VozadLcp/pFwJWz9wpiL/vjPPb7xbHbFAPfUr6lrsVtZtJbBpS3ypKo+TPsf4u/3c4xg4rI0SzkXVXt7mSYboPNKpK6HJx1wQc8mhA+o66zYjeOGXJBbaJnAxx15IT8lq1FdBPFMk00ckQaAAq4BKdOuKXUrla0Rq3moRaZYiVg7jAESsGBPA4JPfvzz+Ros7x10eO6vJoywBMjhdgHOMYyeR0x6+nQYc0sF3qpE1yzafZs0jvI27cSxO0eoydoHoKGMviS4a3tpEt7OBfkUrkE4wCVBGR7ZHHen1J5US28Vx4julnuflsYuFUDG8/T/wCvx0966OJPL3qECpkbAGJ4wB0/h+g+venRxpDGscahUUYAHYVC0xW1kkt/9KZWYABhyQSCuenByPXj1pdRD2hTzJJSzgugVv3jYAGTwM4B5OSOTxnoMYdzqapcyJpzT3kzKFZAzMigZxg54OT1HXgZ4GG/YtU1yNnu5jaQ5IWEIQTg45B/ye1VLTVZNDMdtMtvLA43pLAQS6nODx1HvTv0KSa0K0s+oJfWwe9kM7HJVTwgz9ee/Wt631VZJhJLG3yphJElwjhsE5UnGflHPOAeDyRWLHcJfaldX0tlfTxEhY/sy5K4IxnBHYDI5ByQeDWnbR6rIGibTLeAdQ9xIJR7gbef8mi6L91rUs60bpNMupGnWOPBASNckgnABY+uc8AH345raXbR2um28v2LfMwB85s5VWPzbSASuFJOBgE56ZzWtPLdJCrCOIN5uGHnY+TccYJXlj8o2nHJI3cAkEE4ZtsxVQ2Fyd+Vx3yOucjqeO/oaJ6mal0K0bxwiONbu4cgADdgliASQePlPynrgcjHYUy7kmmtmWKaEzAfJujIZSeMj3wSOPU/Sp4LVxawojK8YRQpuEYyEYGNxY5J6ZzzxzUUltmRYCIhIylljExyQMAkAjoMj6ZA+tWVy7xbuVtL3aXZLC0I3E7nbkZP5Y7f561k398LLVHaAOT9mEKF23n0ySSSTx1JJz1rcbT7tVZYnZAQRhZf/rD/AD+lfyZnVEm00ZRFbeBl054Gedx47HP50W7FWjuiGx0e3NjEkwtZJMiQlmyVbqPyx+h9eB/DDLtktLkRSIMKQxOfqevrz/jT5bkx72acFQVwrw84PU8+nXA54HUkCnWUt/eEi1hFvbMDm4aPZu9No6kYOQeOn1pN9EGrW4y3udXtTK1+/lxRgAyOF2fXPB56dfwz1dBq15eNbPYxXFzHGP3p2rGr8YwxYdQcH5Tj3Iq2mg28kyz6hI9/Mn3PPwUTjHC9OR1+ma1qnUhyXYyH0u/vH3XepyRLjiO0Xy9p/wB85JHt6/Squp6TYaZo8xtNPjLngMU3lM9Tk5IwK6GiiyI5mUdHtPsWlwxEYcjc/wBTz/8AW/Cr1FFMQDjvmmyRiRQrFgAwb5WKng57duOnfoeKKKExvcrWLG40y2lGImlRZW8sADJwzdc9ST78+vNTpDHH/qlWME5YIoG7jAz+AH5Ciiiei07jl8TGXczQQq6gEmWNOfRnCn9DXNeJ9au9Lvlt7Ixw+YgleQICzHlec8dFHbPFFFTLYIK7NXSdOheCDUZ2kuLuaJXMkzbtuQGwo6AA9OOM1r0UVSJCiiigAooooAKKKKAP/9k=',
      loginForm: {
        account: '',
        pwd: '',
        vCode: ''
      },
      userInfo: {
        accountId: ''
      }
    }
  },
  methods: {
    // 根据话题检索问题
    searchByTopic (data) {
      if (data.name !== '首页') {
        this.topicId = data.id
      } else {
        this.topicId = ''
      }
      transfer.$emit('searchByTopic', this.topicId)
    },
    changeIndex (index) {
      this.activeIndex = index
    },
    // 获取话题列表
    getTopicList () {
      const pid = 0 // 话题的父节点
      qryTopicList(pid).then(res => {
        const data = res.data
        for (let i = 0; i < 4; i++) {
          this.topicList.push(data[i])
        }
        this.searchByTopic(data[0])
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
  display: flex;
  justify-content: center;
  border-top: 3px solid #009a61;
  height: 60px;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
  background: #ffffff;
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
  .left-menu {
    height: 100%;
    &:focus {
      outline: none;
    }

    .left-menu-item {
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
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

  .right-menu {
    height: 100%;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding-top: calc(30px - 10.5px);
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
          padding: 0 10px;
          font-weight: 700!important;
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
      padding-top: calc(30px - 19px);
      width: 265px;
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
      margin-left: 20px;
      .avatar-wrapper {
        display: inline-block;
        position: relative;
        .login {
          color: #00965e;
          font-size: 16px;
          text-decoration: none;
          cursor: pointer;
          width: 40px;
          border-radius: 4px;
        }
        .register {
          margin-left: 15px;
          padding: .375rem .75rem;
          color: #fff;
          background-color: #00965e;
          border-color: #00965e;
          border-radius: .25rem;
          border: 1px solid transparent;
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
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle
  }
}

// 更改话题图标原有样式
/deep/ .svg-icon {
  padding-top: 2px
}
</style>
