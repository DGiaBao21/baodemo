import { createWebHistory, createRouter } from 'vue-router'

import List from '../pages/category/List.vue'
import Add from '../pages/category/Add.vue'
import Edit from '../pages/category/Edit.vue'

import BlogList from '../pages/blog/List.vue'
import BlogAdd from '../pages/blog/Add.vue'

const routes = [
  {
    path: '/',
    component: List
  },
  {
    path: '/add',
    component: Add
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: Edit
  },
  {
    path: '/blog-list',
    component: BlogList
  },
  {
    path: '/blog-add',
    component: BlogAdd
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})