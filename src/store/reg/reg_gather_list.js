const reg_gather_list={
    namespaced:true,
    state(){
        return{
            RegGatherList:[]
        }
    },
    mutations:{
        getRegGatherListValue:function(state,list){
            state.RegGatherList = list
            // window.sessionStorage.setItem("RegGatherList", JSON.stringify(list))
        },
    },
    getters:{
        getGatherList(state){
            return state.RegGatherList
        }
    },

}

export default reg_gather_list