import Vue from 'vue'
import Router from 'vue-router'
import calendar from '@/components/test_canlen/calendar.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: calendar
    }
  ]
})
