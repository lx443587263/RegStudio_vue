const category={
    namespaced:true,
    state(){
        return{
            category_list:[],
        }
    },
    mutations:{
        pushCategory:function(state,data){
            state.category_list.push(data)
        },
        getCategoryList:function(state,list){
            state.category_list = list  
        },
    }
}

export default category