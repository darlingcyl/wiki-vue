import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import AdminEbook from '../views/admin/admin-ebook.vue'
import AdminDoc from '../views/admin/admin-doc.vue'
import AdminCategory from '../views/admin/admin-category.vue'
import Doc from '../views/doc.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/admin/ebook',
    name: 'AdminEbook',
    component: AdminEbook

  },
  {
    path: '/admin/doc',
    name: 'AdminDoc',
    component: AdminDoc

  },
  {
    path: '/admin/category',
    name: 'AdminCategory',
    component: AdminCategory

  }
  ,
  {
    path: '/doc',
    name: 'Doc',
    component: Doc

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
