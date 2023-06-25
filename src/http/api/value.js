import serviceAxios from "../index";

export const getValueList=(uuid)=>{
    return serviceAxios({
        url: "ip/value/?single_reg_uuid="+uuid,
        method: "get",
    });
}

//删
export const deleteValue=(uuid)=>{
    return serviceAxios({
        url: "ip/value/?value_uuid="+uuid,
        method: "delete",
    });
}

//改
export const editValue=(uuid,data)=>{
    return serviceAxios({
        url: "ip/value/?value_uuid="+uuid,
        method: "put",
        data
    });
}

//增
export const addValue=(data)=>{
    return serviceAxios({
        url: "ip/value/",
        method: "post",
        data
    });
}