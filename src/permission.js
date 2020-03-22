import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单路由



 router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()


  // set page title
  document.title = getPageTitle(to.meta.title)

  // 取得token，我们的token是loginUserId
  const hasToken = getToken()
  if (hasToken) { // 如果页面保存了token，是记住登陆的状态
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name // 取得vuex中管理员的名字
      if (hasGetUserInfo) { // 如果有名字证明已经登陆了
        next()
      } else {
        try {
          // 没有名字就去发请求获取，这里用了那个判断是否登陆状态的接口，如果是登陆状态会返回名字给我们
          const result = await store.dispatch('user/getInfo')
          if(result.result == 1) {
            next()
          } else if(result.result == 0) {
            await store.dispatch('user/resetInfo')
            Message.error('网络错误，请重新登陆')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          } else if (result.result == 2) {
            await store.dispatch('user/resetInfo')
            Message.error('网络错误，请重新登陆')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
          
        } catch (error) {
          // 上面请求发生错误，会清空token，然后重定重新去登陆
          await store.dispatch('user/resetInfo')
          Message.error('网络错误，请重新登陆')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

   if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
}) 

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
