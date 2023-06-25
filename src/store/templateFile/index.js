const template_file={
    namespaced:true,
    state(){
        return{
            template_file_list:[],
        }
    },
    mutations:{
        getTemplateFileList:function(state,list){
            state.template_file_list = list  
        },
    }
}

export default template_file