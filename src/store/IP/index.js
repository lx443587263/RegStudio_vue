import {addIp} from '../../http/api/ip'
const IP={
    namespaced:true,
    state(){
        return {
            ip_info:{
                ip_uuid:"",
                ip_name:"",
                private_project:false,
                description:"",
                start_date:"",
                status:"",
                end_date:"",
                create_user:"",
                version:"",
                category:"",
                project:"",
                tags:"",
                see_permission:"",
                child_version:"",
                reg_version:""
            },
            ip_lists:[],
            category_ip:[],
            project_ip:[],
            final_ip:[],
            all_ip:[],
            allCategoryListVuex:[],
            allProjectListVuex:[],
            res:{},
            current_ip_uuid:"",
        }
    },
    getters:{
        getAllCategoryList(state){
            return state.allCategoryListVuex
        }
    },
    mutations: {
        getAllIP(state){
            state.final_ip = state.all_ip
        },
        getProjectIP(state,version){
            if(state.project_ip.length==1){
                state.final_ip = state.project_ip
            }else{
                // let maxVersion =  state.project_ip.reduce((prev,current)=>(prev.version > current.version)?prev.version:current.version)
                state.final_ip = state.project_ip.filter(obj=>obj.child_version==version.charAt(version.length-1))
            }
        },
        getIpList:function(state,list){
            list.sort((a,b)=> {return a.ip_name.localeCompare(b.ip_name)})
            state.ip_lists = list;

        },
        setFinalIPList:function(state,list){
            state.final_ip = list;
        },
        setCurrentIpUuid(state,ip_uuid){
            state.current_ip_uuid = ip_uuid
        }, 
        allCategoryList(state,list){
            state.allCategoryListVuex = list;
        },
        allProjectList(state,list){
            state.allProjectListVuex = list
            state.allProjectListVuex.sort(function(a,b){
                return a.project>b.project?1:-1
            })
        },
        getCategoryIpList(state,list){
            if(localStorage.getItem('user')!='admin'){
                state.category_ip = []
                for(var i in list){
                    if(list[i].see_permission){
                        if(list[i].see_permission.indexOf(localStorage.getItem('user'))!=-1){
                            state.category_ip.push(list[i])
                        }
                    }
                }
            }else{
                state.category_ip = list;
            }
            state.final_ip = state.category_ip;
        },
        getProjectIpList(state,list){
            console.log("project",list)
            if(localStorage.getItem('user')!='admin'){
                state.project_ip = []
                for(var i in list){
                    if(list[i].see_permission){
                        if(list[i].see_permission.indexOf(localStorage.getItem('user'))!=-1){
                            state.project_ip.push(list[i])
                        }
                    }
                }
            }else{
                state.project_ip = list;
            }
            state.all_ip = state.project_ip;
            state.final_ip = state.project_ip
            // if(state.project_ip.length==1){
            //     state.final_ip = state.project_ip
            // }else{
            //     let maxVersion =  state.project_ip.reduce((prev,current)=>(prev.version > current.version)?prev.version:current.version)
            //     state.final_ip = state.project_ip.filter(obj=>obj.version==maxVersion)
            // }
        },
        deleteAllCategoryList(state,data){
            const index = state.allCategoryListVuex.findIndex((item) => item.category === data.category); // 查找元素在数组中的位置
            if (index !== -1) {
                if(state.allCategoryListVuex[index].versionList.length>1){
                    const idx = state.allCategoryListVuex[index].versionList.findIndex((item) => item.ipName === data.ip_name)
                    state.allCategoryListVuex[index].versionList.splice(idx, 1); // 删除元素
                }else{
                    state.allCategoryListVuex.splice(index,1);
                }
            }
        },
        addNewIP:async function (state,ip_info){
            state.ip_info.ip_uuid = ip_info.ip_uuid;
            state.ip_info.ip_name = ip_info.ip_name;
            state.ip_info.private_project = ip_info.private_project;
            state.ip_info.description = ip_info.description;
            state.ip_info.start_date = ip_info.start_date;
            state.ip_info.status = ip_info.status;
            state.ip_info.end_date = ip_info.end_date;
            state.ip_info.create_user = ip_info.create_user;
            state.ip_info.version = ip_info.version;
            state.ip_info.category = ip_info.category;
            state.ip_info.project = ip_info.project;
            state.ip_info.tags = ip_info.tags;
            state.ip_info.see_permission = ip_info.see_permission;
            state.ip_info.child_version = ip_info.child_version;
            state.ip_info.reg_version = ip_info.reg_version
            if(!state.ip_info.see_permission){
                state.ip_info.see_permission = "admin"
            }
            
            //发送数据到后端
            await addIp(state.ip_info).then((res)=>{
                if("error" in res)
                {
                    alert(res["error"]);
                }else{
                    state.ip_lists.unshift(ip_info);
                    state.category_ip.push(ip_info);
                    state.project_ip.push(ip_info);
                    // state.final_ip = state.ip_lists;
                    // console.log("store",state.final_ip)
                    const findCate = state.allCategoryListVuex.findIndex((item)=>item.category===state.ip_info.category)
                    if(findCate===-1){
                        let tempObj={}
                        tempObj.category = state.ip_info.category
                        tempObj.versionList = []
                        let temp = {}
                        temp.ipName = state.ip_info.ip_name
                        tempObj.versionList.push(temp)
                        state.allCategoryListVuex.unshift(tempObj)
                    }else{
                        const findIpName = state.allCategoryListVuex[findCate].versionList.findIndex((item)=>item.ipName===state.ip_info.ip_name)
                        if(findIpName===-1){
                            state.allCategoryListVuex[findCate].versionList.unshift({ipName:state.ip_info.ip_name,seePermission:state.ip_info.see_permission})
                        }
                    }
                }
            })
            
        },
    },
}


export default IP;