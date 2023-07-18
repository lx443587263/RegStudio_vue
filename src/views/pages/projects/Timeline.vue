<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="mx-auto col-lg-9 col-12">
        <timeline-list title="Modify Timeline with dashed line">
          <TimelineItem
            v-for="(item,idx) in modify_list" :key="idx" 
            :icon="{ component: 'ni ni-check-bold', color: item.color }"
            :title=item.user
            :date-time=item.data
            :description=item.des
            :badges="[item.modify_model]"
          />
        </timeline-list>
      </div>
    </div>
  </div>
</template>

<script>
import TimelineList from "@/examples/Cards/TimelineList.vue";
import TimelineItem from "@/examples/Cards/TimelineItem.vue";
import { getModifyDataApi } from "@/http/api/modify"

export default {
  name: "Timeline",
  components: { TimelineList, TimelineItem},
  data(){
    return {
      modify_list:[],
      reg_gather_uuid_list:[],
      single_uuid_list:[],
      value_list:[]
    }
  },
  created(){
    getModifyDataApi().then((res)=>{
      for(var i in res){
        if(res[i]["modify_model"]==="RegGather"){
          if(JSON.parse(res[i].modify_content)['ip_uuid']===this.$store.state.IP.current_ip_uuid){
            // this.modify_list.push({"user":res[i].user,"data":res[i].data,"former_content":JSON.parse(res[i].former_content),"modify_content":JSON.parse(res[i].modify_content)})
            this.compareObjects(res[i].user,res[i].data,JSON.parse(res[i].former_content),JSON.parse(res[i].modify_content),res[i].modify_model,"primary")
            if(this.reg_gather_uuid_list.indexOf(JSON.parse(res[i].modify_content)['reg_gather_uuid'])===-1){
              this.reg_gather_uuid_list.push(JSON.parse(res[i].modify_content)['reg_gather_uuid'])
            }
          }
        }
        if(res[i]["modify_model"]==="SingleReg"){
          if(this.reg_gather_uuid_list.indexOf(JSON.parse(res[i].modify_content)['reg_gather_uuid'])!=-1){
            // this.modify_list.push({"user":res[i].user,"data":res[i].data,"former_content":JSON.parse(res[i].former_content),"modify_content":JSON.parse(res[i].modify_content)})
            this.compareObjects(res[i].user,res[i].data,JSON.parse(res[i].former_content),JSON.parse(res[i].modify_content),res[i].modify_model,"info")
            this.single_uuid_list.push(JSON.parse(res[i].modify_content)['single_reg_uuid'])
          }
        }
        if(res[i]["modify_model"]==="Value"){
          if(this.single_uuid_list.indexOf(JSON.parse(res[i].modify_content)['single_reg_uuid'])){
            // this.modify_list.push({"user":res[i].user,"data":res[i].data,"former_content":JSON.parse(res[i].former_content),"modify_content":JSON.parse(res[i].modify_content)})
            this.compareObjects(res[i].user,res[i].data,JSON.parse(res[i].former_content),JSON.parse(res[i].modify_content),res[i].modify_model,"success")
            this.single_reg_uuid = JSON.parse(res[i].modify_content)
          }
        }
      }
    })
  },
  methods:{
    timeFormatSeconds (time) {
      var d = time ? new Date(time) : new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var hours = d.getHours();
      var min = d.getMinutes();
      var seconds = d.getSeconds();

      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      if (hours < 0) hours = '0' + hours;
      if (min < 10) min = '0' + min;
      if (seconds < 10) seconds = '0' + seconds;

      return (year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds);
    },
    compareObjects(user,data,obj1,obj2,modify_model,color) {
      let tempObj = {}
      tempObj.user = user
      tempObj.data = this.timeFormatSeconds(data)
      tempObj.modify_model = modify_model
      tempObj.color = color
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      keys1.forEach(key => {
        if (keys2.includes(key) && obj1[key] !== obj2[key]) {
          if("reg_gather_name" in obj1){
            tempObj.des=`${user} 将 ${obj1["reg_gather_name"]} 的 ${key} 字段从 ${obj1[key]} 修改成 ${obj2[key]}`
          }else{
            tempObj.des=`${user} 将 ${key} 字段从 ${obj1[key]} 修改成 ${obj2[key]}`
          }
          this.modify_list.push(tempObj)
        }
      });
    }
  },
};
</script>

