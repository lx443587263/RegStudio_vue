import {editValue,addValue} from '../../http/api/value'
const value={
    namespaced:true,
    state(){
        return{
            valueList:[],
            valueInfo:{
                single_reg_uuid: "",
                value_uuid:"",
                valueId: "None",
                value: Number,
                description:""
            }
        }
    },
    mutations:{
        addVal:function(state,obj){
            state.valueInfo.single_reg_uuid = obj.single_reg_uuid
            state.valueInfo.value_uuid = obj.value_uuid
            state.valueInfo.valueId = obj.valueId
            state.valueInfo.value = obj.value
            state.valueInfo.description = obj.description
            addValue(state.valueInfo)
        },
        getValue:function(state,list){
            state.valueList=list
            for(var i in state.valueList){
                if(typeof(state.valueList[i].id) ==="number"){
                    for(var key in state.valueList[i]){
                        state.valueInfo[key] = state.valueList[i][key]
                    }
                     //发送数据到后端
                    // console.log("state.valueInfo",state.valueInfo)
                    editValue(state.valueInfo.value_uuid,state.valueInfo)
                }else{
                    //调用post
                    // console.log("调用post")
                    for(var s in state.valueList[i]){
                        state.valueInfo[s] = state.valueList[i][s]

                    }
                    addValue(state.valueInfo)
                }
            }
        },
    }
}

export default value