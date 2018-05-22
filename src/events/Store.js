import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state={
 data:'',
 arr:[],
  arrStatusColor :[],
  arrPriorityColor :  {},
  statusRequest : {
    RequestClass: 'xBase',
    RequestAction: 'Request',
    TotalRequests: 1,
    // category
    R1_RequestTemplate: 'Setting.SearchBase',
    R1_ParentCode: 'xSystem.Setting.xTask.Status'
  },
  priorityRequest : {
    RequestClass:	'xBase',
    RequestAction: 'Request',
    TotalRequests: 1,
    R1_RequestTemplate: 'xEdu.TaskPriority',
    R1_Code: 'TaskPriority'
}
}
const getters={
  getData(state){
  return state.data;
  },
  getArr(state){
    return state.arr;
    }
}
const mutations ={
addData:(state, list)=>{
  state.arr=list;
}
}
const actions ={
addData:(context)=>{
  context.commit('addData')
}
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
