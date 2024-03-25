import serviceAxios from "../index";

export const getSingleAllList=(single_reg_uuid)=>{
    return serviceAxios({
        url: "ip/singleReg/?single_reg_uuid="+single_reg_uuid,
        method: "get",
    });
}


export const getSingleList=(uuid)=>{
    return serviceAxios({
        url: "ip/singleReg/?reg_gather_uuid="+uuid,
        method: "get",
    });
}

//删
export const deleteSingle=(uuid)=>{
    return serviceAxios({
        url: "ip/singleReg/?single_reg_uuid="+uuid,
        method: "delete",
    });
}

//改
export const editSingle=(uuid,data)=>{
    return serviceAxios({
        url: "/ip/singleReg/?single_reg_uuid="+uuid,
        method: "put",
        data,
    });
}

//增
export const addSingle=(data)=>{
    return serviceAxios({
        url: "/ip/singleReg/",
        method: "post",
        data,
    });
}