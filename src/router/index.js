import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 首页
  {
    path: '/home',
    component: Layout,
    name: 'Home',
    redirect: '/home/carousel/edit',
    meta: {
      title: '前台首页',
      icon: 'nested'
    },
    children: [
      {
        path: 'carousel/edit',
        component: () => import('@/views/home/carousel/edit'),
        name: 'carouselEdit',
        meta: { title: '轮播图编辑' }
      },
      {
        path: 'homeactivity',
        component: () => import('@/views/home/homeActivity/index'),
        name: 'homeActivity',
        meta: { title: '最近活动管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/components/activityArticle/list'),
            name: 'homeActivityList',
            meta: { title: '最近活动列表', path: { url: '/home/homeactivity/edit/', part: 'homeactivity' }}
          },
          {
            path: 'edit/:id',
            component: () => import('@/components/activityArticle/edit'),
            name: 'homeActivityEdit',
            hidden: true,
            meta: { title: '最近活动编辑' }
          },
          {
            path: 'create',
            component: () => import('@/components/activityArticle/create'),
            name: 'homeActivityCreate',
            meta: { title: '最近活动上传', path: { part: 'homeactivity' }}
          }
        ]
      },
      {
        path: 'homeevent',
        component: () => import('@/views/home/homeEvent/index'), // Parent router-view
        name: 'homeEvent',
        meta: { title: '重大事件管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/components/normalArticle/list'),
            name: 'homeEventList',
            meta: { title: '重大事件列表', path: { url: '/home/homeevent/edit/', part: 'homeevent' }}
          },
          {
            path: 'edit/:id',
            component: () => import('@/components/normalArticle/edit'),
            name: 'homeEventEdit',
            hidden: true,
            meta: { title: '重大事件编辑' }
          },
          {
            path: 'create',
            component: () => import('@/components/normalArticle/create'),
            name: 'homeEventCreate',
            meta: { title: '重大事件上传', path: { part: 'homeevent' }}
          }
        ]
      }

    ]
  },
  // 关于我们
  {
    path: '/about',
    component: Layout,
    name: 'About',
    meta: {
      title: '前台关于我们',
      icon: 'nested'
    },
    children: [
      {
        path: 'association/edit',
        component: () => import('@/views/about/association/index'), // Parent router-view
        name: 'association',
        meta: { title: '协会介绍编辑' }
      },
      {
        path: 'members',
        component: () => import('@/views/about/members/index'), // Parent router-view
        name: 'Members',
        meta: { title: '协会人员管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/views/about/members/list'),
            name: 'MembersList',
            meta: { title: '协会人员列表' }
          },
          {
            path: 'edit/:id',
            component: () => import('@/views/about/members/edit'),
            name: 'MembersEdit',
            hidden: true,
            meta: { title: '协会人员编辑' }
          },
          {
            path: 'create',
            component: () => import('@/views/about/members/create'),
            name: 'MembersCreate',
            meta: { title: '协会人员上传' }
          }
        ]
      }
    ]
  },

  // 活动信息
  {
    path: '/activity',
    component: Layout,
    name: 'Activity',
    meta: {
      title: '前台活动信息',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/components/activityArticle/list'), // Parent router-view
        name: 'activityList',
        meta: { title: '活动信息列表', path: { url: '/activity/edit/', part: 'activity' }}
      },
      {
        path: 'edit/:id',
        component: () => import('@/components/activityArticle/edit'), // Parent router-view
        name: 'activityEdit',
        hidden: true,
        meta: { title: '活动信息编辑' }
      },
      {
        path: 'create',
        component: () => import('@/components/activityArticle/create'), // Parent router-view
        name: 'activityCreate',
        meta: { title: '活动信息上传', path: { part: 'activity' }}
      }
    ]
  },

  // 专题报道
  {
    path: '/report',
    component: Layout,
    name: 'Report',
    meta: {
      title: '前台专题报道',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/components/normalArticle/list'), // Parent router-view
        name: 'reportList',
        meta: { title: '专题报道列表', path: { url: '/report/edit/', part: 'report' }}
      },
      {
        path: 'edit/:id',
        component: () => import('@/components/normalArticle/edit'), // Parent router-view
        name: 'reportEdit',
        hidden: true,
        meta: { title: '专题报道编辑' }
      },
      {
        path: 'create',
        component: () => import('@/components/normalArticle/create'), // Parent router-view
        name: 'reportCreate',
        meta: { title: '专题报道上传', path: { part: 'report' }}
      }
    ]
  },

  // 社会文化
  {
    path: '/culture',
    component: Layout,
    name: 'Culture',
    meta: {
      title: '前台社会文化',
      icon: 'nested'
    },
    children: [
      {
        path: 'service',
        component: () => import('@/views/culture/service/index'), // Parent router-view
        name: 'Service',
        meta: { title: '社会服务管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/components/normalArticle/list'),
            name: 'serviceList',
            meta: { title: '社会服务列表', path: { url: '/culture/service/edit/', part: 'service' }}
          },
          {
            path: 'edit/:id',
            component: () => import('@/components/normalArticle/edit'),
            name: 'serviceEdit',
            hidden: true,
            meta: { title: '社会服务编辑' }
          },
          {
            path: 'create',
            component: () => import('@/components/normalArticle/create'),
            name: 'serviceCreate',
            meta: { title: '社会服务上传', path: { part: 'service' }}
          }
        ]
      },
      {
        path: 'school',
        component: () => import('@/views/culture/school/index'), // Parent router-view
        name: 'School',
        meta: { title: '语言学校管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/components/normalArticle/list'),
            name: 'schoolList',
            meta: { title: '语言学校列表', path: { url: '/culture/school/edit/', part: 'school' }}
          },
          {
            path: 'edit/:id',
            component: () => import('@/components/normalArticle/edit'),
            name: 'schoolEdit',
            hidden: true,
            meta: { title: '语言学校编辑' }
          },
          {
            path: 'create',
            component: () => import('@/components/normalArticle/create'),
            name: 'schoolCreate',
            meta: { title: '语言学校上传', path: { part: 'school' }}
          }
        ]
      },
      {
        path: 'exchange',
        component: () => import('@/views/culture/exchange/index'), // Parent router-view
        name: 'Exchange',
        meta: { title: '文化交流管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/components/normalArticle/list'),
            name: 'exchangeList',
            meta: { title: '文化交流列表', path: { url: '/culture/exchange/edit/', part: 'exchange' }}
          },
          {
            path: 'edit/:id',
            component: () => import('@/components/normalArticle/edit'),
            name: 'exchangeEdit',
            hidden: true,
            meta: { title: '文化交流编辑' }
          },
          {
            path: 'create',
            component: () => import('@/components/normalArticle/create'),
            name: 'exchangeCreate',
            meta: { title: '文化交流上传', path: { part: 'exchange' }}
          }
        ]
      }

    ]
  },

  // 精彩回顾
  {
    path: '/review',
    component: Layout,
    name: 'Review',
    meta: {
      title: '前台精彩回顾',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/components/normalArticle/list'), // Parent router-view
        name: 'reviewList',
        meta: { title: '精彩回顾列表' , path: { url: '/review/edit/', part: 'review' }}
      },
      {
        path: 'edit/:id',
        component: () => import('@/components/normalArticle/edit'), // Parent router-view
        name: 'reviewEdit',
        hidden: true,
        meta: { title: '精彩回顾编辑' }
      },
      {
        path: 'create',
        component: () => import('@/components/normalArticle/create'), // Parent router-view
        name: 'reviewCreate',
        meta: { title: '精彩回顾上传' , path: { part: 'review' }}
      }
    ]
  },

  // 友情链接
  {
    path: '/link',
    component: Layout,
    name: 'Link',
    meta: {
      title: '前台友情链接',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/link/list'),
        name: 'linkList',
        meta: { title: '友情链接列表' }
      },
      {
        path: 'create',
        component: () => import('@/views/link/create'),
        name: 'linkCreate',
        meta: { title: '友情链接上传' }
      }
    ]
  },

  // 联系我们
  {
    path: '/contact',
    component: Layout,
    name: 'Contact',
    meta: {
      title: '前台联系我们',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'contactList',
        meta: { title: '联系表单列表' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
/* export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
} */

export default router
