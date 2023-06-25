
import {editSingle,addSingle} from '../../http/api/singlereg'
const single_reg={
    namespaced:true,
    state(){
        return{
            singleList:[],
            SingleRegInfo:{
                reg_gather_uuid: "",
                single_reg_uuid: "",
                start_bit: "0",
                end_bit: "",
                RW: "",
                field: "",
                note: "",
                description: "",
                hw_RW: "",
            }
        }
    },
    mutations:{
        addSingle:function(state,obj){
            state.SingleRegInfo.reg_gather_uuid = obj.reg_gather_uuid
            state.SingleRegInfo.single_reg_uuid = obj.single_reg_uuid
            state.SingleRegInfo.start_bit = obj.start_bit
            state.SingleRegInfo.end_bit = obj.end_bit
            state.SingleRegInfo.RW = obj.RW
            state.SingleRegInfo.hw_RW = obj.hw_RW
            state.SingleRegInfo.field = obj.field
            state.SingleRegInfo.note = obj.note
            state.SingleRegInfo.description = obj.description
            addSingle(state.SingleRegInfo)
        },
        getSingleReg:function(state,list){
            state.singleList=list
            // console.log("singlelist",list[0]["note"].content)
            //发送数据到后端
            for(var i in state.singleList){
                if(typeof(state.singleList[i].id) === "number"){
                    for(var key in state.singleList[i]){
                        state.SingleRegInfo[key] = state.singleList[i][key]
                    }
                    editSingle(state.SingleRegInfo.single_reg_uuid,state.SingleRegInfo)
                }else{
                    // 调用post
                    for(var s in state.singleList[i]){
                        state.SingleRegInfo[s] = state.singleList[i][s]

                    }
                    addSingle(state.SingleRegInfo).then((res)=>{
                        if("error" in res)
                        {
                            alert(res["error"])
                        }
                    })
                    // if('row_index' in state.SingleRegInfo)
                    // {
                    //     delete state.SingleRegInfo.row_index
                    //     addSingle(state.SingleRegInfo)
                    // }
                    
                }
            }
        },

    }
}

export default single_reg