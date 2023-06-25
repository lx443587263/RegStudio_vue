import serviceAxios from "../index";
//登陆
export const userLogin=(data)=>{
    return serviceAxios({
        url: "user/login/",
        method: "post",
        data
    });
}
