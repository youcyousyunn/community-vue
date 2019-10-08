import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

/**
 * constantRoutes
 * 没有权限要求的基础页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/',
        component: () => import('@/views/home/home'),
        name: 'Home',
        meta: { title: 'CodePorter', icon: 'home' }
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    children: [
      {
        path: 'ask',
        component: () => import('@/views/question/ask'),
        name: 'ask',
        meta: { title: '提问', icon: 'ask' }
      },
      {
        path: 'answer',
        component: () => import('@/views/question/answer'),
        name: 'answer',
        meta: { title: '问答问题', icon: 'answer' }
      }
    ]
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  // {
  //   path: '/company',
  //   component: Layout,
  //   alwaysShow: true,
  //   redirect: '/company/systemmanage',
  //   meta: { title: '厂商自助', icon: 'companyself', code: 'company', roles: ['admin', 'editor'] },
  //   children: [
  //     {
  //       path: 'systemmanage',
  //       component: () => import('@/views/company/systemmanage'),
  //       name: 'systemmanage',
  //       meta: { title: '运维系统管理', icon: 'dashboard', module: 'company', code: 'system', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'personmanage',
  //       component: () => import('@/views/company/personmanage'),
  //       name: 'personmanage',
  //       meta: { title: '运维人员管理', icon: 'dashboard', module: 'company', code: 'person', roles: ['admin', 'editor'] }
  //     }
  //   ]
  // }
]

const createRouter = () => new Router({
  mode: 'history', // 需要服务端支持
  base: 'community',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
