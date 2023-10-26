const PatternInfo={
    namespaced:true,
    state(){
        return {
            pattern_lists:[],
        }
    },
    getters:{
        getPatternList(state){
            return state.pattern_lists
        }
    },
    mutations: {
        PatternList:function(state,list){
            state.pattern_lists = list;
        },
    },
}

export default PatternInfo;