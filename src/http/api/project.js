import serviceAxios from "../index";

//增
export const addProjectApi = (data) => {
    return serviceAxios({
        url: "/ip/project/",
        method: "post",
        data,
    });
}

//查
export const getProjectApi=()=>{
    return serviceAxios({
        url: "/ip/project/",
        method: "get",
    });
}

export const getProjecNameApi=(project)=>{
    return serviceAxios({
        url: "/ip/project/?project="+project,
        method: "get",
    });
}
//查项目uuid
export const getProjectUuidApi=(project_uuid)=>{
    return serviceAxios({
        url: "/ip/project/?project_uuid="+project_uuid,
        method: "get",
    });
  }

//删
export const deleteProjectApi=(project_uuid)=>{
    return serviceAxios({
        url: "/ip/project/?project_uuid="+project_uuid,
        method: "delete",
    });
}

//改
export const editProjectApi=(project_uuid,data)=>{
    return serviceAxios({
        url: "/ip/project/?project_uuid="+project_uuid,
        method: "put",
        data
    });
}
  