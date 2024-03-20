import serviceAxios from "../index";

//查
export const getIpListApi=()=>{
  return serviceAxios({
      url: "/ip/ipinfo/",
      method: "get",
  });
}

//查种类
export const getCategoryListApi=(category)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?category="+category,
      method: "get",
  });
}

//查项目
export const getProjectListApi=(project)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?project="+project,
      method: "get",
  });
}


//查IPName
export const getIpNameListApi=(ipName)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?ip_name="+ipName,
      method: "get",
  });
}

//查IP UUID
export const getIpUuidApi=(ipUuid)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?ip_uuid="+ipUuid,
      method: "get",
  });
}

//多条件查
export const getCategoryIPApi=(category,name)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?category="+category+"&ip_name="+name,
      method: "get",
  });
}

//多条件查项目
export const getProjectIPApi=(project)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?project="+project,
      method: "get",
  });
}



//增
export const addIp=(data)=>{
  return serviceAxios({
      url: "/ip/ipinfo/",
      method: "post",
      data,
  });
}

//删
export const deleteIp=(uuid)=>{
  return serviceAxios({
    url: "/ip/ipinfo/?ip_uuid="+uuid,
    method: "delete",
  });
}

//改
export const editIpVersion=(uuid,data)=>{
  if(data.project==""){
    data.project = null
  }
  return serviceAxios({
    url: "/ip/ipinfo/?ip_uuid="+uuid,
    method: "put",
    data
  }).then((res)=>{
    if("error" in res)
    {
        alert(res["error"]);
    }
  });
}

//查
export const getIpPageFileApi=(uuid)=>{
  return serviceAxios({
      url: "/ip/ip_page_file/?ip_uuid="+uuid,
      method: "get",
  });
}


//读取文件
export const perviewIpPageFileApi=(file_uuid)=>{
  return serviceAxios({
      url: "/ip/download_ip_page_file/?file_uuid="+file_uuid,
      method: "get",
      responseType: 'blob' // 响应类型设置为arraybuffer
  });
}

//删
export const deleteIpPageFileApi=(file_uuid)=>{
  return serviceAxios({
      url: "/ip/ip_page_file/?file_uuid="+file_uuid,
      method: "delete",
  });
}
