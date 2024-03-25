import serviceAxios from "../index";


export const getModifyAllDataApi=(ip_uuid)=>{
    return serviceAxios({
        url: "ip/modification/?ip_uuid="+ip_uuid,
        method: "get",
    });
}

//查
export const getModifyDataApi=()=>{
    return serviceAxios({
        url: "ip/modification/cut_page",
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