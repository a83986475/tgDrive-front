import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Layout 组件立即需要，保持静态导入
import Layout from '@/components/Layout.vue';
import AdminLayout from '@/components/AdminLayout.vue';

// 所有页面改为懒加载，减少首屏 JS 体积
const Upload         = () => import(/* webpackChunkName: "upload" */      '../views/UploadPage.vue');
const Home           = () => import(/* webpackChunkName: "home" */        '../views/Home.vue');
const FileList       = () => import(/* webpackChunkName: "filelist" */    '../views/FileList.vue');
const Login          = () => import(/* webpackChunkName: "login" */       '../views/LoginPage.vue');
const ChangePassword = () => import(/* webpackChunkName: "changepwd" */   '@/views/ChangePassword.vue');
const BackupPage     = () => import(/* webpackChunkName: "backup" */      '@/views/BackupPage.vue');

interface RouteMeta extends Record<string | number | symbol, unknown> {
  requiresAuth?: boolean;
  requiredRole?: 'admin' | 'visitor';
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: Upload,
        meta: {
          requiresAuth: true,
          requiredRole: 'visitor'
        } as RouteMeta
      },
      {
        path: 'login',
        component: Login,
      }
    ]
  },
  {
    path: '/',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      requiredRole: 'admin'
    } as RouteMeta,
    children: [
      {
        path: 'home',
        component: Home,
        meta: {
          requiresAuth: true,
          requiredRole: 'admin'
        } as RouteMeta
      },
      {
        path: 'fileList',
        component: FileList,
        meta: {
          requiresAuth: true,
          requiredRole: 'admin'
        } as RouteMeta
      },
      {
        path: 'changePassword',
        component: ChangePassword,
        meta: {
          requiresAuth: true,
          requiredRole: 'admin'
        } as RouteMeta
      },
      {
        path: 'backup',
        component: BackupPage,
        meta: {
          requiresAuth: true,
          requiredRole: 'admin'
        } as RouteMeta
      },
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 缓存 token/role 到内存，避免每次路由跳转都读 localStorage
let cachedToken = localStorage.getItem('token');
let cachedRole = localStorage.getItem('role');

// 提供方法供 login/logout 时更新缓存
export const updateAuthCache = () => {
  cachedToken = localStorage.getItem('token');
  cachedRole = localStorage.getItem('role');
};

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !cachedToken) {
    next('/login');
    return;
  }

  if (to.meta.requiredRole) {
    if (cachedRole === 'admin') {
      next();
    } else if (cachedRole === 'visitor' && to.meta.requiredRole === 'visitor') {
      next();
    } else {
      next('/');
    }
    return;
  }

  next();
});

export default router;
