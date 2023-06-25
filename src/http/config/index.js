// import IPConfig from "../../../public/IPConfig";
// const baseURL = window.IPConfig.IP
const serverConfig = {
    baseURL:window.g.baseUrl,
    // baseURL: "/api/api/", // 请求基础地址,可根据环境自定义
    // baseURL: "http://172.16.38.11:8000/api/",    
    // baseURL: "http://192.168.28.158:5000/api/",
    // baseURL: process.env.VUE_APP_BACKEND_URL,
    useTokenAuthorization: true, // 是否开启 token 认证
  };
  export default serverConfig;