import serviceAxios from "../index";

//查
export const getIpListApi=()=>{
    return serviceAxios({
        url: "/patterninfo/",
        method: "get",
    });
  }