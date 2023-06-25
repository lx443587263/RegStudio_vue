import store from '@/store'

export default{
    mounted(el,bindings) {
         let allowRoleList = bindings.value;
         let userRole = store.state.user;
         const newArr = allowRoleList.filter(item => userRole.position.includes(item))
        //  //无权限不加载
        //  if(allowRoleList.indexOf(userRole.position)===-1){
        //     //删除元素
        //     el.parentNode && el.parentNode.removeChild(el)
        //  }
        //无权限不加载
        // console.log("ttt",allowRoleList,newArr)
        // for(var i in newArr){
        //     if(allowRoleList.indexOf(newArr[i])===-1){
        //         //删除元素
        //         el.parentNode && el.parentNode.removeChild(el)
        //     }
        // }
        if(newArr.length===0){
            //删除元素
            el.parentNode && el.parentNode.removeChild(el)
        }
    },
}