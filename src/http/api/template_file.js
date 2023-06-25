import serviceAxios from "../index";

//查
export const getTemplateFileListApi=()=>{
  return serviceAxios({
      url: "/ip/upload_template/",
      method: "get",
  });
}

//删
export const deleteTemplateFileApi=(file_uuid)=>{
    return serviceAxios({
        url: "/ip/upload_template/?file_uuid="+file_uuid,
        method: "delete",
    });
}

//读取文件
export const getTemplateFileApi=(file_uuid)=>{
    return serviceAxios({
        url: "/ip/download_spec/?file_uuid="+file_uuid,
        method: "get",
        responseType: 'blob' // 响应类型设置为arraybuffer
    });
}