// import { ElMessage } from 'element-plus'

import { editRegGatherApi, addRegGather } from '../../http/api/reggather'

const reg_gather = {
    namespaced: true,
    state() {
        return {
            gatherList: [],
            RegGatherInfo: {},
            addRegGatherInfo: {
                ip_uuid: "",
                reg_gather_uuid: "",
                tag: "",
                offset: "",
                reg_gather_name: "",
                description: "",
                reset: "",
                retention:"",
                address:"",
                reg_ram:"",
            },
            saveSuccesss:false,
            error_log:""
        }
    },
    mutations: {
        addReg: function (state, obj) {
            state.addRegGatherInfo.ip_uuid = obj.ip_uuid
            state.addRegGatherInfo.reg_gather_uuid = obj.reg_gather_uuid
            state.addRegGatherInfo.tag = obj.tag
            state.addRegGatherInfo.reg_gather_name = obj.reg_gather_name
            state.addRegGatherInfo.offset = obj.offset
            state.addRegGatherInfo.description = obj.description
            state.addRegGatherInfo.reset = obj.reset
            state.addRegGatherInfo.retention = obj.retention,
            state.addRegGatherInfo.address = obj.address,
            state.addRegGatherInfo.reg_ram = obj.reg_ram,
            addRegGather(state.addRegGatherInfo)
        },
        getRegGather: function (state, list) {
            state.gatherList = list
            //发送数据到后端
            for (var i in state.gatherList) {
                if ('address' in state.gatherList[i]) {
                    for (var key in state.gatherList[i]) {
                        state.RegGatherInfo[key] = state.gatherList[i][key]
                    }
                    editRegGatherApi(state.RegGatherInfo.reg_gather_uuid, state.RegGatherInfo).then((res) => {
                        if (typeof (res) == "object" && "detail" in res) {
                            state.saveSuccesss = false
                            state.error_log = res
                        } else {
                            state.saveSuccesss = true
                        }
                    })
                }
                else {
                    for (var k in state.gatherList[i]) {
                        state.RegGatherInfo[k] = state.gatherList[i][k]
                    }
                    addRegGather(state.RegGatherInfo).then((res) => {
                        if ('detail' in res) {
                            state.saveSuccesss = false
                            state.error_log = res
                        } else {
                            state.saveSuccesss = true
   
                        }
                    })
                }
            }
            if(state.saveSuccesss){
                // ElMessage({
                //     showClose: true,
                //     message: "保存成功",
                //     type: 'success',
                // })
            }else{
                console.log(state.error)
            }
        },

    },

}

export default reg_gather