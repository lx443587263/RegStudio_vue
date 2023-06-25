const user={
    namespaced:true,
    state(){
        return{
            userlist:[],
            token: localStorage.getItem("token") || "",
            position: localStorage.getItem("position") || "",
            username: localStorage.getItem("username") || "",
            user_uuid: localStorage.getItem("user_uuid") || "",
        }
    },
    getters:{
        getUserList(state){
            return state.userlist
        }
    },
    mutations:{
        login(state, {token, username,position,user_uuid}) {
            state.token = token;
            state.username = username;
            state.position = position.split(',');
            state.user_uuid = user_uuid
            localStorage.setItem('token', token);
            localStorage.setItem('position', position.split(','));
            localStorage.setItem('user', username);
            localStorage.setItem('user_uuid', user_uuid);
        },
        setUserList:function(state,list){
            state.userlist = list  
        },

    }

}

export default user