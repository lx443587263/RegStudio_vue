const project={
    namespaced:true,
    state(){
        return{
            project_list:[],
            projectKV:new Map(),
        }
    },
    mutations:{
        pushProject:function(state,data){
            state.project_list.push(data)
        },
        getProjectList:function(state,list){
            state.project_list = list  
        },
        getProjectKV:function(state,map){
            state.projectKV = map
            localStorage.projectMap = JSON.stringify(Array.from(state.projectKV.entries()));

        }
    }
}

export default project