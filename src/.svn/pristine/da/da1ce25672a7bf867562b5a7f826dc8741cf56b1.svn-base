import Vue from 'vue'
import Router from 'vue-router'

// Containers
//import Full from '@/containers/Full'

// Views
//import Dashboard from '@/views/Dashboard'
//import Charts from '@/views/Charts'
//import Widgets from '@/views/Widgets'

// Views - Components
//import Buttons from '@/views/components/Buttons'
//import SocialButtons from '@/views/components/SocialButtons'
//import Cards from '@/views/components/Cards'
//import Forms from '@/views/components/Forms'
//import Modals from '@/views/components/Modals'
//import Switches from '@/views/components/Switches'
//import Tables from '@/views/components/Tables'
// Views - Icons
import FontAwesome from '@/views/icons/FontAwesome'
import SimpleLineIcons from '@/views/icons/SimpleLineIcons'

// Views - Pages
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'
import Login from '@/views/pages/Login'
import ResetPass from '@/views/pages/Resetpass'
import Register from '@/views/pages/Register'

import Home from '@/components/Home'
import Report from '@/components/Report'
import Product from '@/components/Product'
import Support from '@/components/Support'
import MyView from '@/components/MyView'
import Target from '@/components/Target'
import TimeLine from '@/components/Timeline'
import Categories from '@/components/Categories'
import Projects from '@/components/Projects'
import Project from '@/components/static/Project'

import Calendar from '@/components/Calendar'
import Scrumboard from '@/components/Scrumboard'
import DailyReport from '@/components/DailyReport'
import DynamicCharts from '@/components/DynamicCharts'
import Documents from '@/components/Documents'
import Setting from '@/components/Setting'
import AdvancedSetting from '@/components/AdvancedSetting'
import WeekTarget from '@/components/static/WeekTarget'
import WeekTask from '@/components/static/WeekTask'
import TargetSetting from '@/components/static/TargetSetting'
import Tasks from '@/components/Tasks'
import DynamicMain from '@/components/dynamic/DynamicMain'
import SettingUsers from "@/components/static/SettingUsers.vue"
import SettingGroupAndProject from "@/components/static/SettingGroupAndProject.vue"
import SettingUI from "@/components/static/SettingUI.vue"

import DataGroup from '@/components/static/advance/DataGroup'
import Calendars from '@/components/static/advance/Calendars'
import UIReports from '@/components/static/advance/Reports'
import UIFilters from '@/components/static/advance/Filters'
import UILists from '@/components/static/advance/Lists'
import UIForms from '@/components/static/advance/Forms'
import UIPages from '@/components/static/advance/Pages'
import Notifications from '@/components/static/advance/Notifications'
import Groups from '@/components/static/Groups'
import Users from '@/components/static/advance/Users'
import Settings from '@/components/static/advance/Settings'
import UIimports from '@/components/static/advance/Imports'
import AllNotifications from '@/components/static/AllNotifications'
Vue.use(Router)

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import { requireAuth } from "@/services/auth.js"
// configure language
locale.use(lang);



export default new Router({
  //mode: 'history',
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  //root: '/',
  //mode: 'html5',
  routes: [
    {
      path: '/',
      redirect: '/my-view-page',
      name: 'Home',
      beforeEnter: requireAuth,
      component: Home,
      children: [
        {
          path: 'my-view-page',
          name: 'MyView',
          beforeEnter: requireAuth,
          component: MyView,
        },
        {
          path: '/task-block-view',
          name: 'Target',
          beforeEnter: requireAuth,
          component: Target,
          children: [{
            path: 'week-target',
            name: 'WeekTarget',
            component: WeekTarget

          }, {
            path: 'week-task',
            name: 'WeekTask',
            beforeEnter: requireAuth,
            component: WeekTask

          },
          {
            path: 'target-setting',
            name: 'TargetSetting',
            beforeEnter: requireAuth,
            component: TargetSetting

          }]
        },
        {
          path: '/dynamic/:url/:value',
          name: 'DynamicMain1',
          beforeEnter: requireAuth,
          component: DynamicMain,
          children: []
        },
        {
          path: '/dynamic/:url',
          name: 'DynamicMain2',
          beforeEnter: requireAuth,
          component: DynamicMain,
          children: []
        },
        {
          path: '/tasks',
          redirect: '/timeline',
          name: 'Tasks',
          beforeEnter: requireAuth,
          component: Tasks,
          children: [{
            path: '/timeline',
            name: 'TimeLine',
            component: TimeLine,
            children: []
          },
          {
            path: '/scrumboard',
            name: 'scrumboard',
            beforeEnter: requireAuth,
            component: Scrumboard,
            children: []
          }]
        },

        {
          path: 'category',
          name: 'Categories',
          beforeEnter: requireAuth,
          component: Categories,
          children: []
        },
        /*{
          path: 'department',
          name: 'Department',
          component: Department,
          children: []
        },*/
        {
          path: 'projects',
          name: 'Projects',
          beforeEnter: requireAuth,
          component: Projects,
          children: []
        },
        {
          path: 'project',
          name: 'Project',
          beforeEnter: requireAuth,
          component: Project,
          children: []
        },
        {
          path: 'calendar',
          name: 'Calendar',
          beforeEnter: requireAuth,
          component: Calendar,
          children: []
        },
        {
          path: 'daily-report',
          name: 'DailyReport',
          beforeEnter: requireAuth,
          component: DailyReport,
          children: []
        },
        {
          path: 'all-notifications',
          name: 'AllNotifications',
          beforeEnter: requireAuth,
          component: AllNotifications,
          children: []
        },

        {
          path: 'dynamic-charts',
          name: 'DynamicCharts',
          beforeEnter: requireAuth,
          component: DynamicCharts,
          children: []
        },
        {
          path: 'knowhow-document',
          name: 'Documents',
          beforeEnter: requireAuth,
          component: Documents,
          children: []
        },
        {
          path: '/config',
          name: 'Setting',
          beforeEnter: requireAuth,
          redirect: '/setting-users',
          component: Setting,
          children: [
            {
              path: '/setting-users',
              name: 'SettingUsers',
              beforeEnter: requireAuth,
              component: SettingUsers,
              children: []
            },
            {
              path: '/setting-group-project',
              name: 'SettingGroupAndProject',
              beforeEnter: requireAuth,
              component: SettingGroupAndProject,
              children: []
            },
            {
              path: '/setting-ui',
              name: 'SettingUI',
              beforeEnter: requireAuth,
              component: SettingUI,
              children: []
            }
          ]
        },
        {
          path: '/advanced-setting',
          name: 'AdvancedSetting',
          beforeEnter: requireAuth,
          component: AdvancedSetting,
          children: [{
            path: '/data-groups',
            name: 'DataGroup',
            beforeEnter: requireAuth,
            component: DataGroup,
          },
          {
            path: '/settings/:param',
            name: 'Settings2',
            beforeEnter: requireAuth,
            component: Settings,
          },
          {
            path: '/settings',
            name: 'Settings1',
            beforeEnter: requireAuth,
            component: Settings,
          },
          {
            path: '/lists',
            name: 'UILists',
            beforeEnter: requireAuth,
            component: UILists,
          },
          {
            path: '/forms',
            name: 'UIForms',
            beforeEnter: requireAuth,
            component: UIForms,
          },
          {
            path: '/filters',
            name: 'UIFilters',
            beforeEnter: requireAuth,
            component: UIFilters,
          },
          {
            path: '/reports',
            name: 'UIReports',
            beforeEnter: requireAuth,
            component: UIReports,
          },
          {
            path: '/pages',
            name: 'UIPages',
            beforeEnter: requireAuth,
            component: UIPages,
          },
          {
            path: '/imports',
            name: 'UIimports',
            beforeEnter: requireAuth,
            component: UIimports,
          },
          {
            path: '/users',
            name: 'Users',
            beforeEnter: requireAuth,
            component: Users,
          },
          {
            path: '/groups',
            name: 'Groups',
            beforeEnter: requireAuth,
            component: Groups,
          },
          {
            path: '/notifications',
            name: 'Notifications',
            beforeEnter: requireAuth,
            component: Notifications,
          },
          {
            path: '/calendar/setting',
            name: 'CalendarSetting',
            beforeEnter: requireAuth,
            component: Calendars,
          }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'reset-pass',
          name: 'ResetPass',
          component: ResetPass
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    },
    { path: '*', component: Page404 }
  ]
})
