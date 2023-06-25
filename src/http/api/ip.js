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

//查IPName
export const getIpNameListApi=(ipName)=>{
  return serviceAxios({
      url: "/ip/ipinfo/?ip_name="+ipName,
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