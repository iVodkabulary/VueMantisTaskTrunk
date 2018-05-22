import Vue from 'vue'
import Utils from '@/services/utils.js'
export default{
  user(){
    return (localStorage.getItem('logedOnUser') != 'undefined')
  },check(){
      //console.log(localStorage.getItem('SesionId'));
      return (localStorage.getItem('SesionId') != 'undefined');
  }
}

export function requireAuth(to, from, next) {
  Utils.checkSession().then(result => {
    if (!result.success) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  })

}
export function isLoggedIn()  {
  var isLogin = false;
  Utils.checkSession().then(result => {
    return result.success;
  })
}
