import user from './auth'
export default{
  guest(to, from, next){
    next(!user.check())
  },auth(to, from, next){
    next(user.check() ? true :{
      path: '/pages/login'
      ,query:{
        redirect: to.name}
    })
  }
}