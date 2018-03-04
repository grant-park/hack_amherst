import Vue from 'vue'
import Router from 'vue-router'
import Posts from '@/components/Posts'
import query from '@/components/Query'
import addpost from '@/components/AddPost'
import editpost from '@/components/EditPost'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/',
      name: 'query',
      component: query
    },
    {
      path: '/posts/add',
      component: addpost,
      name: 'addpost'
    },
    {
      path: '/posts/:id/edit',
      component: editpost,
      name: 'editpost'
    }
  ]
})
