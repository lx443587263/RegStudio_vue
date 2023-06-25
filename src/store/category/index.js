const category={
    namespaced:true,
    state(){
        return{
            category_list:[],
        }
    },
    mutations:{
        getCategoryList:function(state,list){
            state.category_list = list  
        },
    }
}

export default category