import serviceAxios from "../index";


//查所有
export const getRegGatherAllList=(reg_gather_uuid)=>{
    return serviceAxios({
        url: "ip/regGather/?reg_gather_uuid="+reg_gather_uuid,
        method: "get",
    });
}

//查
export const getRegGatherList=(uuid)=>{
    return serviceAxios({
        url: "ip/regGather/?ip_uuid="+uuid,
        method: "get",
    });
}

//增
export const addRegGather=(data)=>{
    return serviceAxios({
        url: "/ip/regGather/",
        method: "post",
        data,
    });
}

//删
export const deleteRegGather=(uuid)=>{
    return serviceAxios({
        url: "ip/regGather/?reg_gather_uuid="+uuid,
        method: "delete",
    });
}

//改
export const editRegGatherApi=(uuid,data)=>{
    return serviceAxios({
        url: "/ip/regGather/?reg_gather_uuid="+uuid,
        method: "put",
        data,
    });
}
