<template>
  <div class="container-fluid">
    <div class="card">
      <!-- Card header -->
      <div class="card-header">
        <div class="header">
          <h5 class="mb-0">操作日志</h5>
        </div>
      <div>
        <el-table :data="modifyData.results" style="width: 100%" max-height="680">
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.prop" :label="item.label" >
              <template #default="scope">
                {{ scope.row[item.prop] }}
              </template>
            </el-table-column>
          </el-table>
        <el-pagination 
          v-show = "modifyData.count!==0"
          :page-size="20"
          background
          layout="total,prev,pager,next,jumper"
          :total="modifyData.count"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          >
        </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getModifyDataApi,getModifyDataBypageApi} from "@/http/api/modify" 
import {getRegGatherAllList} from "@/http/api/reggather"
import {getSingleAllList} from "@/http/api/singlereg"
import { mapState } from 'vuex';
export default {
  name: "DynamicModifyTable",
  data() {
    return {
      tableHeader: [
        {
          prop: "user",
          label: "Operator",
        },
        {
          prop: "data",
          label: "data",
        },
        {
          prop: "ip_name",
          label: "IP",
        },
        {
          prop: "des",
          label: "active",
        },

      ],
      search:"",
      selectModify:[],
      currentRow:'',
      currentPage:1,
      modifyData:{
        count:0,
        results:[],
      },
    }
  },
  computed:{
    ...mapState('IP',['ip_lists']),

  },
  created(){
    getModifyDataApi().then((res)=>{
      for(var i in res.results){
          this.compareObjects(res.results[i].user,res.results[i].data,JSON.parse(res.results[i].former_content),JSON.parse(res.results[i].modify_content),JSON.parse(res.results[i].modify_content),res.results[i].modify_model)
      }
      this.modifyData.count = res.count
    })
  },

  methods: {
    handleCurrentChange(val){
      this.currentPage = val
      getModifyDataBypageApi({page:val,search:this.search}).then((resp)=>{
        this.modifyData.results = []
        for(var i in resp.results){
            this.compareObjects(resp.results[i].user,resp.results[i].data,JSON.parse(resp.results[i].former_content),JSON.parse(resp.results[i].modify_content),JSON.parse(resp.results[i].modify_content),resp.results[i].modify_model)
        }
        this.modifyData.count = resp.count
      })
    },
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
    
    async compareObjects(user,data,obj1,obj2,obj3,moduleName) {
     
      let tempObj = {}
      if(moduleName=="RegGather"){
        this.ip_lists.filter(item => {
          if(item.ip_uuid==obj3.ip_uuid){
            tempObj.ip_name =  item.ip_name
          }
        })
      }else if(moduleName=="SingleReg"){
       await getRegGatherAllList(obj3.reg_gather_uuid).then(res=>{
          if(res[0]){
            this.ip_lists.filter(item => {
              if(item.ip_uuid==res[0].ip_uuid){
                tempObj.ip_name =  item.ip_name
              }
            })
          }
        })
      }else{
        await getSingleAllList(obj3.single_reg_uuid).then(async res =>  {
          if(res[0]){
            await getRegGatherAllList(res[0].reg_gather_uuid).then(resp=>{
              if(resp[0]){
                this.ip_lists.filter(item => {
                  if(item.ip_uuid==resp[0].ip_uuid){
                    tempObj.ip_name =  item.ip_name
                  }
                })
              }
            })
          }
        })
      }
      tempObj.user = user
      tempObj.data = this.timeFormatSeconds(data)
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      keys1.forEach(key => {
        if (keys2.includes(key) && obj1[key] !== obj2[key]) {
          if("reg_gather_name" in obj1){
            tempObj.des=`${user} 将 ${obj1["reg_gather_name"]} 的 ${key} 字段从 ${obj1[key]} 修改成 ${obj2[key]}`
          }else{
            tempObj.des=`${user} 将 ${key} 字段从 ${obj1[key]} 修改成 ${obj2[key]}`

          }
            this.modifyData.results.push(tempObj)
          // tempList.push(tempObj)
        }
      });

    }
  }
}
</script>

<style scoped>
.edit-icon {
  cursor: pointer;
}

.editable-row {
  display: flex;
  align-items: center;
}

.editable-row-span {
  display: inline-block;
  margin-right: 6px;
}

.menu-item {
  height: 32px;
  line-height: 32px;
  padding-left: 12px;
}

.menu-item:hover {
  color: #fff;
  background: #409eff;
  cursor: pointer;
}
</style>