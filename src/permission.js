import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取令牌
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/', '/question/ask', '/question/answer'] // 不需重定向白名单

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/home') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getUserInfo获取了他的权限角色
      const token = store.getters.token && store.getters.token.length > 0
      if (token) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意：角色必须是对象数组！例如：['admin']或['developer', 'editor']
          const { roles } = await store.dispatch('user/getUserInfo')

          // 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法确保addRoutes完成
          // 设置replace:true, 因此导航不会留下历史记录
          next({ ...to, replace: false })
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else { /* 没有令牌 */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在登录白名单中，直接进入
      next()
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
