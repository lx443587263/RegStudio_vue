import serviceAxios from "../index";

//查
export const getModifyDataApi=()=>{
    return serviceAxios({
        url: "ip/modification/"        ,
        method: "get",
    });
}

//分页
export const getModifyDataBypageApi=(params)=>{
    return serviceAxios({
        url: "ip/modification/cut_page",
        method: "get",
        params:params
    });
}