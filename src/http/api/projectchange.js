import serviceAxios from "../index";

//查
export const getProjectChangeApi=()=>{
    return serviceAxios({
        url: "/ip/projectchange/",
        method: "get",
    });
}

export const addProjectChangeApi=(data)=>{
    return serviceAxios({
        url: "/ip/projectchange/",
        method: "post",
        data,
    });
}