import serviceAxios from "../index";

//查
export const getModifyDataApi=()=>{
    return serviceAxios({
        url: "ip/modification/"        ,
        method: "get",
    });
}