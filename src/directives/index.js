import permission from './permission';

//批量注册指令
const directives = {
    permission
}


export default {
    install(Vue){
        Object.keys(directives).forEach(key=>{
            Vue.directive(key,directives[key])
        })
    }
}