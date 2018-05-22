// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
// import jquery from 'jquery'
Vue.use(BootstrapVue)
Vue.use(VueResource)
//Vue.use(jquery)
 // Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)
import VueI18n from 'vue-i18n'
import store from './events/Store'
Vue.use(VueI18n)
export const bus=new Vue();
import enlang from './lang/i18n/en.json';
import vnlang from './lang/i18n/vn.json';
const messages = {
  vn:  vnlang,
  en: enlang
  }

 /*
Vue.config.lang = 'en'
Vue.locale('en', messages)
*/
// console.log(messages.vn)
const i18n = new VueI18n({
  locale: 'vn', // set locale
  messages, // set locale messages
})
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
