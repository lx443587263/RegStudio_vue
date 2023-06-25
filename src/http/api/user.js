import serviceAxios from "../index";

//查
export const userGet=()=>{
    return serviceAxios({
        url: "user/list/",
        method: "get",
    });
}

//新增
export const userAdd=(data)=>{
    // console.log("data",data)
    return serviceAxios({
        url: "user/add/",
        method: "post",
        data
    });
}

//删除
export const userDelete=(uuid)=>{
    return serviceAxios({
        url: "user/list/?user_uuid="+uuid,
        method: "delete",
    });
}

//改
export const userEdit=(uuid,data)=>{
    return serviceAxios({
        url: "user/list/?user_uuid="+uuid,
        method: "put",
        data
    });
}

//改密码
export const passwordEdit=(uuid,data)=>{
    return serviceAxios({
        url: "user/changePasswd/?user_uuid="+uuid,
        method: "put",
        data
    });
}