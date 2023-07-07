import serviceAxios from "../index";

//增
export const addCategoryApi = (data) => {
    return serviceAxios({
        url: "/ip/category/",
        method: "post",
        data,
    });
}

//查
export const getCategoryApi=()=>{
    return serviceAxios({
        url: "/ip/category/",
        method: "get",
    });
}
  
//删
export const deleteCategoryApi=(category)=>{
    return serviceAxios({
        url: "/ip/category/?category="+category,
        method: "delete",
    });
}

//改
export const editCategoryApi=(category,data)=>{
    return serviceAxios({
        url: "/ip/category/?category="+category,
        method: "put",
        data
    });
}
  